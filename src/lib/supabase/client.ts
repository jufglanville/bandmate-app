import { createClient } from '@supabase/supabase-js';

// Utility to resolve environment variables
const getEnvVar = (localKey: string, prodKey: string): string => {
  return process.env.NODE_ENV === 'development'
    ? (process.env[localKey] as string)
    : (process.env[prodKey] as string);
};

// Resolve Supabase configuration
export const supabaseURL = getEnvVar(
  'NEXT_PUBLIC_SUPABASE_URL_LOCAL',
  'NEXT_PUBLIC_SUPABASE_URL',
);
export const supabaseRoleKey = getEnvVar(
  'SUPABASE_SERVICE_ROLE_KEY_LOCAL',
  'SUPABASE_SERVICE_ROLE_KEY',
);
export const supabaseJWTSecret = process.env.SUPABASE_JWT_SECRET as string;

export const supabase = createClient(supabaseURL, supabaseRoleKey);
