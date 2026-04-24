
-- Trigger function: on new auth user, insert chosen role into public.user_roles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  selected_role public.app_role;
  raw_role text;
BEGIN
  raw_role := NEW.raw_user_meta_data->>'role';

  -- Validate against enum, fallback to 'student'
  IF raw_role IS NULL OR raw_role NOT IN (
    'principal','sms_admin','front_desk','teacher','class_teacher',
    'exam_coordinator','transport_manager','librarian','hostel_warden',
    'student','parent'
  ) THEN
    selected_role := 'student'::public.app_role;
  ELSE
    selected_role := raw_role::public.app_role;
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, selected_role)
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Ensure unique constraint exists for the ON CONFLICT above
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'user_roles_user_id_role_key'
  ) THEN
    ALTER TABLE public.user_roles
      ADD CONSTRAINT user_roles_user_id_role_key UNIQUE (user_id, role);
  END IF;
END $$;

-- Drop and recreate trigger to be idempotent
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
