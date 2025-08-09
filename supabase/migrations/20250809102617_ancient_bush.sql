/*
  # Fix Profile Creation Database Error

  1. Database Trigger Update
    - Fix handle_new_user function to properly populate email column
    - Use metadata passed from signup for role and other fields
    - Ensure all NOT NULL constraints are satisfied

  2. Security
    - Maintain proper RLS while enabling necessary operations
    - Fix automatic profile creation via trigger
*/

-- Update function to properly handle profile creation with email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, phone, role, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'مستخدم جديد'),
    COALESCE(NEW.raw_user_meta_data->>'phone', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;