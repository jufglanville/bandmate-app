import { redirect } from 'next/navigation';
import { signIn, providerMap } from '@/lib/auth';
import { AuthError } from 'next-auth';

const SIGNIN_ERROR_URL = '/auth/error';

export default async function SignInPage() {
  return (
    <div className="flex flex-col gap-2">
      <form
        action={async (formData) => {
          'use server';
          try {
            await signIn('credentials', formData);
          } catch (error) {
            if (error instanceof AuthError) {
              return redirect(`${SIGNIN_ERROR_URL}?error=${error.type}`);
            }
            throw error;
          }
        }}
      >
        <label htmlFor="email">
          Email
          <input name="email" id="email" />
        </label>
        <label htmlFor="password">
          Password
          <input name="password" id="password" />
        </label>
        <input type="submit" value="Sign In" />
      </form>

      <form
        action={async (formData) => {
          'use server';
          await signIn('sendgrid', formData);
        }}
      >
        <input
          type="text"
          name="email"
          placeholder="Email"
          className="p-1 border-solid"
        />
        <button type="submit">Signin with Sendgrid</button>
      </form>

      {Object.values(providerMap).map((provider) => (
        <form
          key={provider.id}
          action={async () => {
            'use server';
            try {
              await signIn(provider.id, {
                redirectTo: '/dashboard',
              });
            } catch (error) {
              // Signin can fail for a number of reasons, such as the user
              // not existing, or the user not having the correct role.
              // In some cases, you may want to redirect to a custom error
              if (error instanceof AuthError) {
                return redirect(`${SIGNIN_ERROR_URL}?error=${error.type}`);
              }

              // Otherwise if a redirects happens Next.js can handle it
              // so you can just re-thrown the error and let Next.js handle it.
              // Docs:
              // https://nextjs.org/docs/app/api-reference/functions/redirect#server-component
              throw error;
            }
          }}
        >
          <button type="submit">
            <span>Sign in with {provider.name}</span>
          </button>
        </form>
      ))}
    </div>
  );
}
