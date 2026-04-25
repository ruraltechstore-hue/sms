-- Add attachment columns to assignments
ALTER TABLE public.assignments
  ADD COLUMN IF NOT EXISTS attachment_url text,
  ADD COLUMN IF NOT EXISTS attachment_type text,
  ADD COLUMN IF NOT EXISTS attachment_name text;

-- Create storage bucket for assignment attachments (public read)
INSERT INTO storage.buckets (id, name, public)
VALUES ('assignment-attachments', 'assignment-attachments', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS policies
-- Anyone authenticated can read (bucket is public, but keeping policy for clarity)
DROP POLICY IF EXISTS "assignment_attachments_read_all" ON storage.objects;
CREATE POLICY "assignment_attachments_read_all"
ON storage.objects FOR SELECT
USING (bucket_id = 'assignment-attachments');

-- Teachers, class_teachers and admins can upload
DROP POLICY IF EXISTS "assignment_attachments_upload" ON storage.objects;
CREATE POLICY "assignment_attachments_upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'assignment-attachments'
  AND (
    public.is_admin(auth.uid())
    OR public.has_role(auth.uid(), 'teacher'::public.app_role)
    OR public.has_role(auth.uid(), 'class_teacher'::public.app_role)
  )
);

-- Teachers, class_teachers and admins can update
DROP POLICY IF EXISTS "assignment_attachments_update" ON storage.objects;
CREATE POLICY "assignment_attachments_update"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'assignment-attachments'
  AND (
    public.is_admin(auth.uid())
    OR public.has_role(auth.uid(), 'teacher'::public.app_role)
    OR public.has_role(auth.uid(), 'class_teacher'::public.app_role)
  )
);

-- Teachers, class_teachers and admins can delete
DROP POLICY IF EXISTS "assignment_attachments_delete" ON storage.objects;
CREATE POLICY "assignment_attachments_delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'assignment-attachments'
  AND (
    public.is_admin(auth.uid())
    OR public.has_role(auth.uid(), 'teacher'::public.app_role)
    OR public.has_role(auth.uid(), 'class_teacher'::public.app_role)
  )
);