import { handlers } from '@/app/auth/auth'; // Referring to the auth.ts we just created
export const { GET, POST } = handlers;
export { auth as middleware } from '@/app/auth/auth';
