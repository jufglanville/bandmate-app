import { redirect } from 'next/navigation';
import { fetchUserDetailsById } from '@/lib/supabase/getUsers';
import { getUserSession } from '@/app/auth';

const page = async () => {
  // Get the user session
  const userSession = await getUserSession();

  // Get user details
  const user = await fetchUserDetailsById(userSession.id);
  if (!user) return redirect('/auth/signin');

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <p>Your email address is {user.email}</p>
      <p>Address: {user.user_details.address_line_1}</p>
    </div>
  );
};

export default page;
