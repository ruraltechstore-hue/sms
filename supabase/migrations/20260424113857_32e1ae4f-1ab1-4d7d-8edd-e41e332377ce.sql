-- ============================================================
-- ENUM: app_role (11 roles)
-- ============================================================
CREATE TYPE public.app_role AS ENUM (
  'principal',
  'sms_admin',
  'front_desk',
  'teacher',
  'class_teacher',
  'exam_coordinator',
  'transport_manager',
  'librarian',
  'hostel_warden',
  'student',
  'parent'
);

-- ============================================================
-- TABLE: user_roles
-- ============================================================
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- SECURITY DEFINER: has_role
-- ============================================================
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Convenience: is the user any kind of admin/principal?
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('principal','sms_admin')
  )
$$;

-- ============================================================
-- TIMESTAMP TRIGGER FUNCTION
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ============================================================
-- TABLE: teachers
-- ============================================================
CREATE TABLE public.teachers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  subjects TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_teachers_updated BEFORE UPDATE ON public.teachers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- TABLE: parents
-- ============================================================
CREATE TABLE public.parents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.parents ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_parents_updated BEFORE UPDATE ON public.parents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- TABLE: classes
-- ============================================================
CREATE TABLE public.classes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  section TEXT,
  class_teacher_id UUID REFERENCES public.teachers(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_classes_updated BEFORE UPDATE ON public.classes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- TABLE: students
-- ============================================================
CREATE TABLE public.students (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  class_id UUID REFERENCES public.classes(id) ON DELETE SET NULL,
  parent_id UUID REFERENCES public.parents(id) ON DELETE SET NULL,
  roll_number TEXT,
  admission_date DATE DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive','alumni')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_students_updated BEFORE UPDATE ON public.students
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_students_class_id ON public.students(class_id);
CREATE INDEX idx_students_parent_id ON public.students(parent_id);

-- ============================================================
-- TABLE: attendance
-- ============================================================
CREATE TABLE public.attendance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES public.teachers(id) ON DELETE SET NULL,
  class_id UUID REFERENCES public.classes(id) ON DELETE SET NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL CHECK (status IN ('present','absent','late','excused')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (student_id, date)
);
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_attendance_updated BEFORE UPDATE ON public.attendance
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_attendance_student_id ON public.attendance(student_id);
CREATE INDEX idx_attendance_class_id ON public.attendance(class_id);

-- ============================================================
-- TABLE: marks
-- ============================================================
CREATE TABLE public.marks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES public.teachers(id) ON DELETE SET NULL,
  exam_id UUID,
  subject TEXT NOT NULL,
  score NUMERIC NOT NULL,
  max_score NUMERIC NOT NULL DEFAULT 100,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.marks ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_marks_updated BEFORE UPDATE ON public.marks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_marks_student_id ON public.marks(student_id);

-- ============================================================
-- TABLE: fees
-- ============================================================
CREATE TABLE public.fees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  fee_type TEXT NOT NULL DEFAULT 'tuition',
  amount NUMERIC NOT NULL,
  paid_amount NUMERIC NOT NULL DEFAULT 0,
  due_date DATE,
  paid_date DATE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('paid','partial','overdue','pending')),
  method TEXT,
  receipt_no TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.fees ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_fees_updated BEFORE UPDATE ON public.fees
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_fees_student_id ON public.fees(student_id);

-- ============================================================
-- TABLE: exams
-- ============================================================
CREATE TABLE public.exams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  class_id UUID REFERENCES public.classes(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  max_marks NUMERIC NOT NULL DEFAULT 100,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','scheduled','completed','reviewed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_exams_updated BEFORE UPDATE ON public.exams
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- now wire marks.exam_id FK
ALTER TABLE public.marks
  ADD CONSTRAINT marks_exam_id_fkey FOREIGN KEY (exam_id) REFERENCES public.exams(id) ON DELETE SET NULL;

-- ============================================================
-- TABLE: transport
-- ============================================================
CREATE TABLE public.transport (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  route TEXT NOT NULL,
  vehicle TEXT NOT NULL,
  pickup_point TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.transport ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_transport_updated BEFORE UPDATE ON public.transport
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_transport_student_id ON public.transport(student_id);

-- ============================================================
-- TABLE: library
-- ============================================================
CREATE TABLE public.library (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  books_issued JSONB NOT NULL DEFAULT '[]'::jsonb,
  fines NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.library ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_library_updated BEFORE UPDATE ON public.library
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_library_student_id ON public.library(student_id);

-- ============================================================
-- TABLE: hostel
-- ============================================================
CREATE TABLE public.hostel (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  room TEXT NOT NULL,
  attendance JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.hostel ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_hostel_updated BEFORE UPDATE ON public.hostel
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_hostel_student_id ON public.hostel(student_id);

-- ============================================================
-- TABLE: messages
-- ============================================================
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX idx_messages_receiver_id ON public.messages(receiver_id);

-- ============================================================
-- HELPER: is the current user the parent of this student?
-- ============================================================
CREATE OR REPLACE FUNCTION public.is_parent_of_student(_user_id UUID, _student_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.students s
    JOIN public.parents p ON p.id = s.parent_id
    WHERE s.id = _student_id AND p.user_id = _user_id
  )
$$;

-- HELPER: is the current user the student themselves?
CREATE OR REPLACE FUNCTION public.is_self_student(_user_id UUID, _student_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.students WHERE id = _student_id AND user_id = _user_id
  )
$$;

-- HELPER: is the current user the class teacher of this class?
CREATE OR REPLACE FUNCTION public.is_class_teacher_of(_user_id UUID, _class_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.classes c
    JOIN public.teachers t ON t.id = c.class_teacher_id
    WHERE c.id = _class_id AND t.user_id = _user_id
  )
$$;

-- ============================================================
-- RLS POLICIES
-- ============================================================

-- ---- user_roles ----
CREATE POLICY "users read own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin(auth.uid()));
CREATE POLICY "admins manage roles" ON public.user_roles
  FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- ---- teachers ----
CREATE POLICY "teachers read all authed" ON public.teachers
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "admins manage teachers" ON public.teachers
  FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "teacher updates self" ON public.teachers
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- ---- parents ----
CREATE POLICY "parents read all authed" ON public.parents
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "admins manage parents" ON public.parents
  FOR ALL USING (
    public.is_admin(auth.uid()) OR public.has_role(auth.uid(),'front_desk')
  ) WITH CHECK (
    public.is_admin(auth.uid()) OR public.has_role(auth.uid(),'front_desk')
  );
CREATE POLICY "parent updates self" ON public.parents
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- ---- classes ----
CREATE POLICY "classes read all authed" ON public.classes
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "admins manage classes" ON public.classes
  FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- ---- students ----
CREATE POLICY "students readable scoped" ON public.students
  FOR SELECT USING (
    public.is_admin(auth.uid())
    OR public.has_role(auth.uid(),'front_desk')
    OR public.has_role(auth.uid(),'teacher')
    OR public.has_role(auth.uid(),'class_teacher')
    OR public.has_role(auth.uid(),'exam_coordinator')
    OR public.has_role(auth.uid(),'transport_manager')
    OR public.has_role(auth.uid(),'librarian')
    OR public.has_role(auth.uid(),'hostel_warden')
    OR user_id = auth.uid()
    OR public.is_parent_of_student(auth.uid(), id)
  );
CREATE POLICY "students insert by frontdesk/admin" ON public.students
  FOR INSERT WITH CHECK (
    public.is_admin(auth.uid()) OR public.has_role(auth.uid(),'front_desk')
  );
CREATE POLICY "students update by admin/frontdesk/classteacher" ON public.students
  FOR UPDATE USING (
    public.is_admin(auth.uid())
    OR public.has_role(auth.uid(),'front_desk')
    OR (public.has_role(auth.uid(),'class_teacher') AND public.is_class_teacher_of(auth.uid(), class_id))
  );
CREATE POLICY "students delete by admin" ON public.students
  FOR DELETE USING (public.is_admin(auth.uid()));

-- ---- attendance ----
CREATE POLICY "attendance read scoped" ON public.attendance
  FOR SELECT USING (
    public.is_admin(auth.uid())
    OR public.has_role(auth.uid(),'teacher')
    OR public.has_role(auth.uid(),'class_teacher')
    OR public.is_self_student(auth.uid(), student_id)
    OR public.is_parent_of_student(auth.uid(), student_id)
  );
CREATE POLICY "attendance write by teacher/admin" ON public.attendance
  FOR INSERT WITH CHECK (
    public.is_admin(auth.uid())
    OR public.has_role(auth.uid(),'teacher')
    OR public.has_role(auth.uid(),'class_teacher')
  );
CREATE POLICY "attendance update by teacher/admin" ON public.attendance
  FOR UPDATE USING (
    public.is_admin(auth.uid())
    OR public.has_role(auth.uid(),'teacher')
    OR public.has_role(auth.uid(),'class_teacher')
  );
CREATE POLICY "attendance delete by admin" ON public.attendance
  FOR DELETE USING (public.is_admin(auth.uid()));

-- ---- marks ----
CREATE POLICY "marks read scoped" ON public.marks
  FOR SELECT USING (
    public.is_admin(auth.uid())
    OR public.has_role(auth.uid(),'teacher')
    OR public.has_role(auth.uid(),'class_teacher')
    OR public.has_role(auth.uid(),'exam_coordinator')
    OR public.is_self_student(auth.uid(), student_id)
    OR public.is_parent_of_student(auth.uid(), student_id)
  );
CREATE POLICY "marks write by teacher/coordinator/admin" ON public.marks
  FOR INSERT WITH CHECK (
    public.is_admin(auth.uid())
    OR public.has_role(auth.uid(),'teacher')
    OR public.has_role(auth.uid(),'class_teacher')
    OR public.has_role(auth.uid(),'exam_coordinator')
  );
CREATE POLICY "marks update by teacher/coordinator/admin" ON public.marks
  FOR UPDATE USING (
    public.is_admin(auth.uid())
    OR public.has_role(auth.uid(),'teacher')
    OR public.has_role(auth.uid(),'class_teacher')
    OR public.has_role(auth.uid(),'exam_coordinator')
  );
CREATE POLICY "marks delete by admin/coordinator" ON public.marks
  FOR DELETE USING (
    public.is_admin(auth.uid()) OR public.has_role(auth.uid(),'exam_coordinator')
  );

-- ---- fees ----
CREATE POLICY "fees read scoped" ON public.fees
  FOR SELECT USING (
    public.is_admin(auth.uid())
    OR public.is_self_student(auth.uid(), student_id)
    OR public.is_parent_of_student(auth.uid(), student_id)
  );
CREATE POLICY "fees write by admin" ON public.fees
  FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- ---- exams ----
CREATE POLICY "exams read all authed" ON public.exams
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "exams write by coordinator/admin" ON public.exams
  FOR ALL USING (
    public.is_admin(auth.uid()) OR public.has_role(auth.uid(),'exam_coordinator')
  ) WITH CHECK (
    public.is_admin(auth.uid()) OR public.has_role(auth.uid(),'exam_coordinator')
  );

-- ---- transport ----
CREATE POLICY "transport read scoped" ON public.transport
  FOR SELECT USING (
    public.is_admin(auth.uid())
    OR public.has_role(auth.uid(),'transport_manager')
    OR public.is_self_student(auth.uid(), student_id)
    OR public.is_parent_of_student(auth.uid(), student_id)
  );
CREATE POLICY "transport write by manager/admin" ON public.transport
  FOR ALL USING (
    public.is_admin(auth.uid()) OR public.has_role(auth.uid(),'transport_manager')
  ) WITH CHECK (
    public.is_admin(auth.uid()) OR public.has_role(auth.uid(),'transport_manager')
  );

-- ---- library ----
CREATE POLICY "library read scoped" ON public.library
  FOR SELECT USING (
    public.is_admin(auth.uid())
    OR public.has_role(auth.uid(),'librarian')
    OR public.is_self_student(auth.uid(), student_id)
    OR public.is_parent_of_student(auth.uid(), student_id)
  );
CREATE POLICY "library write by librarian/admin" ON public.library
  FOR ALL USING (
    public.is_admin(auth.uid()) OR public.has_role(auth.uid(),'librarian')
  ) WITH CHECK (
    public.is_admin(auth.uid()) OR public.has_role(auth.uid(),'librarian')
  );

-- ---- hostel ----
CREATE POLICY "hostel read scoped" ON public.hostel
  FOR SELECT USING (
    public.is_admin(auth.uid())
    OR public.has_role(auth.uid(),'hostel_warden')
    OR public.is_self_student(auth.uid(), student_id)
    OR public.is_parent_of_student(auth.uid(), student_id)
  );
CREATE POLICY "hostel write by warden/admin" ON public.hostel
  FOR ALL USING (
    public.is_admin(auth.uid()) OR public.has_role(auth.uid(),'hostel_warden')
  ) WITH CHECK (
    public.is_admin(auth.uid()) OR public.has_role(auth.uid(),'hostel_warden')
  );

-- ---- messages ----
CREATE POLICY "messages read own" ON public.messages
  FOR SELECT USING (sender_id = auth.uid() OR receiver_id = auth.uid() OR public.is_admin(auth.uid()));
CREATE POLICY "messages send self" ON public.messages
  FOR INSERT WITH CHECK (sender_id = auth.uid());
CREATE POLICY "messages update own" ON public.messages
  FOR UPDATE USING (receiver_id = auth.uid() OR sender_id = auth.uid());
CREATE POLICY "messages delete own/admin" ON public.messages
  FOR DELETE USING (sender_id = auth.uid() OR public.is_admin(auth.uid()));