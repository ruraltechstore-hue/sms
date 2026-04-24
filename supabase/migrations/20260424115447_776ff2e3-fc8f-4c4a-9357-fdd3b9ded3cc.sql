
-- Helper: insert a confirmed test user with role in metadata.
-- The on_auth_user_created trigger will assign the role automatically.
DO $$
DECLARE
  test_password text := crypt('Test1234!', gen_salt('bf'));
  r record;
  new_id uuid;
BEGIN
  FOR r IN
    SELECT * FROM (VALUES
      ('principal@eduverse.test',         'Priya Principal',       'principal'),
      ('admin@eduverse.test',              'Adam SMS-Admin',        'sms_admin'),
      ('frontdesk@eduverse.test',          'Fiona FrontDesk',       'front_desk'),
      ('teacher@eduverse.test',            'Tom Teacher',           'teacher'),
      ('classteacher@eduverse.test',       'Cara ClassTeacher',     'class_teacher'),
      ('examcoord@eduverse.test',          'Eli ExamCoord',         'exam_coordinator'),
      ('transport@eduverse.test',          'Tara Transport',        'transport_manager'),
      ('librarian@eduverse.test',          'Lila Librarian',        'librarian'),
      ('hostel@eduverse.test',             'Hank HostelWarden',     'hostel_warden'),
      ('student@eduverse.test',            'Sam Student',           'student'),
      ('parent@eduverse.test',             'Pat Parent',            'parent')
    ) AS t(email, full_name, role_name)
  LOOP
    -- Skip if already exists
    IF EXISTS (SELECT 1 FROM auth.users WHERE email = r.email) THEN
      CONTINUE;
    END IF;

    new_id := gen_random_uuid();

    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      new_id,
      'authenticated',
      'authenticated',
      r.email,
      test_password,
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', r.full_name, 'role', r.role_name),
      now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, identity_data, provider, provider_id,
      last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(),
      new_id,
      jsonb_build_object('sub', new_id::text, 'email', r.email),
      'email',
      new_id::text,
      now(), now(), now()
    );
  END LOOP;
END $$;
