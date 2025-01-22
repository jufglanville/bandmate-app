-- Step 1: Create the user_details table with a uuid as primary key
create table public.user_details (
  id uuid default uuid_generate_v4() primary key,  -- Use uuid_generate_v4() for generating UUIDs
  user_id uuid not null unique references public.users (id) on delete cascade,  -- Foreign key to users table
  forename text,
  surname text,
  address_line_1 text,
  address_line_2 text,
  city text,
  postcode text,
  country text,
  phone_number text,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Step 2: Enable Row-Level Security
alter table user_details enable row level security;

-- Step 3: Define Security Policies
-- Allow users to view only their own details
create policy "Can view own user details." on user_details
  for select using (next_auth.uid() = user_id);

-- Allow users to update only their own details
create policy "Can update own user details." on user_details
  for update using (next_auth.uid() = user_id);

-- Step 4: Trigger to Auto-Insert User Details
-- Create a function that auto-inserts a row into user_details when a new user is added
create function public.handle_new_user_details()
returns trigger as $$
begin
  insert into public.user_details (user_id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

-- Step 5: Attach the trigger to the users table
create trigger on_user_created
  after insert on public.users
  for each row execute function public.handle_new_user_details();