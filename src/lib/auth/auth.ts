import NextAuth from 'next-auth';
import SendGrid from 'next-auth/providers/sendgrid';
import GitHub from 'next-auth/providers/github';
import type { Provider } from 'next-auth/providers';
import { SupabaseAdapter } from '@auth/supabase-adapter';
import jwt from 'jsonwebtoken';
import { redirect } from 'next/navigation';
import { sendGridVerificationEmail } from './sendGridVerificationEmail';

import {
  supabaseURL,
  supabaseRoleKey,
  supabaseJWTSecret,
} from '@/lib/supabase/client';

// Interface for session object
interface ISession {
  user: {
    id: string;
    email: string;
    image: string;
    name: string;
  };
}

// Providers configuration
const providers: Provider[] = [
  GitHub,
  SendGrid({
    server: process.env.AUTH_SENDGRID_SERVER,
    from: process.env.AUTH_SENDGRID_FROM,
    sendVerificationRequest: async ({ identifier: email, url, provider }) => {
      await sendGridVerificationEmail({ email, url, provider });
    },
  }),
];
export const providerMap = providers.map((provider) => {
  const providerData = typeof provider === 'function' ? provider() : provider;
  return { id: providerData.id, name: providerData.name };
});

// Extend NextAuth session with a custom property
declare module 'next-auth' {
  interface Session {
    supabaseAccessToken?: string;
  }
}

// NextAuth configuration with Supabase adapter and session callbacks
export const { handlers, signIn, signOut, auth } = NextAuth({
  debug: process.env.NODE_ENV === 'development', // Enable debug mode in dev
  providers,
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
  },
  adapter: SupabaseAdapter({
    url: supabaseURL,
    secret: supabaseRoleKey,
  }),
  callbacks: {
    async session({ session, user }) {
      try {
        if (supabaseJWTSecret) {
          const payload = {
            aud: 'authenticated',
            exp: Math.floor(new Date(session.expires).getTime() / 1000),
            sub: user.id,
            email: user.email,
            role: 'authenticated',
          };
          session.supabaseAccessToken = jwt.sign(payload, supabaseJWTSecret);
        }
        return session;
      } catch (error) {
        console.error('Error creating session token:', error);
        return session;
      }
    },
    async redirect({ url, baseUrl }) {
      // Extract the `callbackUrl` from the incoming query parameters
      const callbackUrl = new URL(url).searchParams.get('callbackUrl');

      // Redirect to the `callbackUrl` if it exists; otherwise, default to `/dashboard`
      return callbackUrl
        ? `${baseUrl}/${callbackUrl}}`
        : `${baseUrl}/dashboard`;
    },
  },
});

// Get the user session
export const getUserSession = async () => {
  const session = (await auth()) as ISession;
  if (!session?.user) return redirect('/auth/signin');

  return session.user;
};
