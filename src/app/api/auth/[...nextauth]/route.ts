import { handlers } from '@/lib/auth'; // Referring to the auth.ts we just created

console.error('GITHUB_ID:', process.env.AUTH_GITHUB_ID);
console.error('GITHUB_SECRET:', process.env.AUTH_GITHUB_SECRET);

export const { GET, POST } = handlers;
