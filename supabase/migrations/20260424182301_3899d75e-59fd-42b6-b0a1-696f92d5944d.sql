-- ===========================================================
-- Assignments / Homework / Tasks
-- Created by class_teacher (any class) or teacher (own subject)
-- ===========================================================
CREATE TABLE public.assignments (
  id          UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  class_id    UUID NOT NULL,
  teacher_id  UUID,                                  -- creator (teacher or class_teacher)
  title       TEXT NOT NULL,
  description TEXT,
  subject     TEXT,
  kind        TEXT NOT NULL DEFAULT 'assignment',   -- assignment | homework | task
  due_date    DATE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;

-- Read: any admin / teaching staff / exam coordinator; students & parents see only own class.
CREATE POLICY "assignments read scoped" ON public.assignments
FOR SELECT USING (
  is_admin(auth.uid())
  OR has_role(auth.uid(), 'teacher'::app_role)
  OR has_role(auth.uid(), 'class_teacher'::app_role)
  OR has_role(auth.uid(), 'exam_coordinator'::app_role)
  OR EXISTS (SELECT 1 FROM public.students s WHERE s.user_id = auth.uid() AND s.class_id = assignments.class_id)
  OR EXISTS (
    SELECT 1 FROM public.students s
    JOIN public.parents p ON p.id = s.parent_id
    WHERE p.user_id = auth.uid() AND s.class_id = assignments.class_id
  )
);

-- Write: admin, class_teacher, teacher
CREATE POLICY "assignments insert by staff" ON public.assignments
FOR INSERT WITH CHECK (
  is_admin(auth.uid())
  OR has_role(auth.uid(), 'class_teacher'::app_role)
  OR has_role(auth.uid(), 'teacher'::app_role)
);

CREATE POLICY "assignments update by staff" ON public.assignments
FOR UPDATE USING (
  is_admin(auth.uid())
  OR has_role(auth.uid(), 'class_teacher'::app_role)
  OR has_role(auth.uid(), 'teacher'::app_role)
);

CREATE POLICY "assignments delete by class teacher/admin" ON public.assignments
FOR DELETE USING (
  is_admin(auth.uid())
  OR has_role(auth.uid(), 'class_teacher'::app_role)
);

CREATE TRIGGER trg_assignments_updated_at
BEFORE UPDATE ON public.assignments
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_assignments_class ON public.assignments(class_id);
CREATE INDEX idx_assignments_due ON public.assignments(due_date);

-- ===========================================================
-- Assignment Submissions
-- ===========================================================
CREATE TABLE public.assignment_submissions (
  id            UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
  student_id    UUID NOT NULL,
  status        TEXT NOT NULL DEFAULT 'pending', -- pending | submitted | late | graded
  submitted_at  TIMESTAMPTZ,
  remarks       TEXT,
  score         NUMERIC,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(assignment_id, student_id)
);

ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;

-- Read: staff or own student / their parent
CREATE POLICY "submissions read scoped" ON public.assignment_submissions
FOR SELECT USING (
  is_admin(auth.uid())
  OR has_role(auth.uid(), 'teacher'::app_role)
  OR has_role(auth.uid(), 'class_teacher'::app_role)
  OR has_role(auth.uid(), 'exam_coordinator'::app_role)
  OR is_self_student(auth.uid(), student_id)
  OR is_parent_of_student(auth.uid(), student_id)
);

-- Write: only staff (students/parents are read-only per spec)
CREATE POLICY "submissions write by staff" ON public.assignment_submissions
FOR ALL USING (
  is_admin(auth.uid())
  OR has_role(auth.uid(), 'teacher'::app_role)
  OR has_role(auth.uid(), 'class_teacher'::app_role)
) WITH CHECK (
  is_admin(auth.uid())
  OR has_role(auth.uid(), 'teacher'::app_role)
  OR has_role(auth.uid(), 'class_teacher'::app_role)
);

CREATE TRIGGER trg_submissions_updated_at
BEFORE UPDATE ON public.assignment_submissions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_submissions_assignment ON public.assignment_submissions(assignment_id);
CREATE INDEX idx_submissions_student ON public.assignment_submissions(student_id);

-- ===========================================================
-- Books catalog (library inventory)
-- ===========================================================
CREATE TABLE public.books (
  id              UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title           TEXT NOT NULL,
  author          TEXT,
  isbn            TEXT,
  category        TEXT,
  total_copies    INTEGER NOT NULL DEFAULT 1,
  available_copies INTEGER NOT NULL DEFAULT 1,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;

CREATE POLICY "books read all authed" ON public.books
FOR SELECT TO authenticated USING (true);

CREATE POLICY "books write by librarian/admin" ON public.books
FOR ALL USING (
  is_admin(auth.uid()) OR has_role(auth.uid(), 'librarian'::app_role)
) WITH CHECK (
  is_admin(auth.uid()) OR has_role(auth.uid(), 'librarian'::app_role)
);

CREATE TRIGGER trg_books_updated_at
BEFORE UPDATE ON public.books
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ===========================================================
-- Book issues (per-loan rows)
-- ===========================================================
CREATE TABLE public.book_issues (
  id           UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  book_id      UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  student_id   UUID NOT NULL,
  issue_date   DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date     DATE,
  return_date  DATE,
  fine         NUMERIC NOT NULL DEFAULT 0,
  status       TEXT NOT NULL DEFAULT 'issued', -- issued | returned | overdue
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.book_issues ENABLE ROW LEVEL SECURITY;

CREATE POLICY "book_issues read scoped" ON public.book_issues
FOR SELECT USING (
  is_admin(auth.uid())
  OR has_role(auth.uid(), 'librarian'::app_role)
  OR is_self_student(auth.uid(), student_id)
  OR is_parent_of_student(auth.uid(), student_id)
);

CREATE POLICY "book_issues write by librarian/admin" ON public.book_issues
FOR ALL USING (
  is_admin(auth.uid()) OR has_role(auth.uid(), 'librarian'::app_role)
) WITH CHECK (
  is_admin(auth.uid()) OR has_role(auth.uid(), 'librarian'::app_role)
);

CREATE TRIGGER trg_book_issues_updated_at
BEFORE UPDATE ON public.book_issues
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_book_issues_book ON public.book_issues(book_id);
CREATE INDEX idx_book_issues_student ON public.book_issues(student_id);

-- ===========================================================
-- Hostel rooms (separate from allocations)
-- ===========================================================
CREATE TABLE public.hostel_rooms (
  id           UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_number  TEXT NOT NULL UNIQUE,
  block        TEXT,
  capacity     INTEGER NOT NULL DEFAULT 1,
  occupancy    INTEGER NOT NULL DEFAULT 0,
  notes        TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.hostel_rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "hostel_rooms read all authed" ON public.hostel_rooms
FOR SELECT TO authenticated USING (true);

CREATE POLICY "hostel_rooms write by warden/admin" ON public.hostel_rooms
FOR ALL USING (
  is_admin(auth.uid()) OR has_role(auth.uid(), 'hostel_warden'::app_role)
) WITH CHECK (
  is_admin(auth.uid()) OR has_role(auth.uid(), 'hostel_warden'::app_role)
);

CREATE TRIGGER trg_hostel_rooms_updated_at
BEFORE UPDATE ON public.hostel_rooms
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ===========================================================
-- Drivers (transport)
-- ===========================================================
CREATE TABLE public.drivers (
  id           UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name         TEXT NOT NULL,
  phone        TEXT,
  license_no   TEXT,
  vehicle      TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "drivers read all authed" ON public.drivers
FOR SELECT TO authenticated USING (true);

CREATE POLICY "drivers write by transport/admin" ON public.drivers
FOR ALL USING (
  is_admin(auth.uid()) OR has_role(auth.uid(), 'transport_manager'::app_role)
) WITH CHECK (
  is_admin(auth.uid()) OR has_role(auth.uid(), 'transport_manager'::app_role)
);

CREATE TRIGGER trg_drivers_updated_at
BEFORE UPDATE ON public.drivers
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();