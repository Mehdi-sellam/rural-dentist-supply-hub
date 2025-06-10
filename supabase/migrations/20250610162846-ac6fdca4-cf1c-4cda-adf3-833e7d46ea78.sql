
-- Insert the admin user into profiles table
-- This assumes the user will register with admin@dentgo.dz first
-- We'll update this profile to have admin privileges

-- First, let's create a function to safely update or insert the admin profile
CREATE OR REPLACE FUNCTION public.ensure_admin_profile(
  admin_user_id UUID,
  admin_email TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert or update the admin profile
  INSERT INTO public.profiles (
    id,
    full_name,
    dental_office_name,
    phone,
    email,
    wilaya,
    address,
    is_admin
  ) VALUES (
    admin_user_id,
    'Administrateur DentGo',
    'DentGo Administration',
    '+213 000 000 000',
    admin_email,
    'Alger',
    'Siège social DentGo',
    true
  )
  ON CONFLICT (id) 
  DO UPDATE SET
    is_admin = true,
    full_name = COALESCE(profiles.full_name, 'Administrateur DentGo'),
    dental_office_name = COALESCE(profiles.dental_office_name, 'DentGo Administration');
END;
$$;

-- Update the handle_new_user function to check for admin email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if this is the admin email
  IF NEW.email = 'admin@dentgo.dz' THEN
    INSERT INTO public.profiles (id, full_name, dental_office_name, phone, email, wilaya, address, is_admin)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'full_name', 'Administrateur DentGo'),
      COALESCE(NEW.raw_user_meta_data->>'dental_office_name', 'DentGo Administration'),
      COALESCE(NEW.raw_user_meta_data->>'phone', '+213 000 000 000'),
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'wilaya', 'Alger'),
      COALESCE(NEW.raw_user_meta_data->>'address', 'Siège social DentGo'),
      true  -- Set as admin
    );
  ELSE
    -- Regular user
    INSERT INTO public.profiles (id, full_name, dental_office_name, phone, email, wilaya, address, is_admin)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
      COALESCE(NEW.raw_user_meta_data->>'dental_office_name', ''),
      COALESCE(NEW.raw_user_meta_data->>'phone', ''),
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'wilaya', ''),
      COALESCE(NEW.raw_user_meta_data->>'address', ''),
      false  -- Regular user
    );
  END IF;
  RETURN NEW;
END;
$$;
