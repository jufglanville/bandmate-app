import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import type { Provider } from 'next-auth/providers';
import { SupabaseAdapter } from '@auth/supabase-adapter';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

// Utility to resolve environment variables
const getEnvVar = (localKey: string, prodKey: string): string => {
  return process.env.NODE_ENV === 'development'
    ? (process.env[localKey] as string)
    : (process.env[prodKey] as string);
};

// Resolve Supabase configuration
const supabaseURL = getEnvVar(
  'NEXT_PUBLIC_SUPABASE_URL_LOCAL',
  'NEXT_PUBLIC_SUPABASE_URL',
);
const supabaseRoleKey = getEnvVar(
  'SUPABASE_SERVICE_ROLE_KEY_LOCAL',
  'SUPABASE_SERVICE_ROLE_KEY',
);
const supabaseJWTSecret = process.env.SUPABASE_JWT_SECRET as string;

// Create a reusable Supabase client
export const createSupabaseClient = (): SupabaseClient => {
  return createClient(supabaseURL, supabaseRoleKey);
};

// Providers configuration
const providers: Provider[] = [GitHub];
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
  },
});
