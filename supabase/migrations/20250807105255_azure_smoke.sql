/*
  # Fix Profile Creation and RLS Issues

  1. Database Trigger
    - Create automatic profile creation trigger for new auth users
    - This bypasses RLS for initial profile creation

  2. RLS Policy Updates
    - Fix profile insertion policy
    - Allow admins to update any profile
    - Use maybeSingle() for existence checks

  3. Security
    - Maintain proper RLS while enabling necessary operations
    - Enable automatic profile creation via trigger
*/

-- Create function to automatically create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, phone, role, created_at, updated_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'مستخدم جديد'),
    COALESCE(NEW.raw_user_meta_data->>'phone', NEW.email),
    'student',
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile for new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Create new INSERT policy that allows the trigger to work
CREATE POLICY "Allow profile creation via trigger"
  ON profiles
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

-- Update the UPDATE policy to allow admins to update any profile
CREATE POLICY "Users can update own profile or admins can update any"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = id OR 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    auth.uid() = id OR 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.profiles TO anon, authenticated;