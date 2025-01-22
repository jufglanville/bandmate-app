import { redirect } from 'next/navigation';
import { auth } from '@/app/auth';

import { fetchUserById } from '@/lib/supabase/getUsers';

const page = async () => {
  // Get the user session
  const session = await auth();
  if (!session?.user) return redirect('/auth/signin');

  // Get user details
  const user = await fetchUserById(session.user.id as string);

  console.log(user);

  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      <p>Your email address is {user?.email}</p>
      <p>Address: {user?.user_details.address_line_1}</p>
    </div>
  );
};

export default page;
