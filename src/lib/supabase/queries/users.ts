import { supabase } from '../client';

export async function fetchUserDetailsById(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select(
      `
      id,
      email,
      name,
      user_details!inner (
        forename,
        surname,
        address_line_1,
        city,
        phone_number
      )
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
