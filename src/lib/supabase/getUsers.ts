import { supabase } from './client';

export async function fetchUserById(userId: string) {
  // Replace 'users' with the name of your users table
  const { data, error } = await supabase
    .from('users')
    .select(
      `
      *,
      user_details(*)
    `,
    )
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user details:', error);
    return null;
  }

  return data;
}
