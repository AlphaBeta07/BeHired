-- ============================================================
-- BeHired Storage Setup
-- Run this in Supabase SQL Editor to fix resume upload RLS
-- ============================================================

-- 1. Create the storage bucket (if it doesn't exist yet)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'behired-uploads',
  'behired-uploads',
  true,
  10485760,  -- 10MB
  ARRAY['application/pdf']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['application/pdf'];

-- 2. Drop any existing conflicting policies
DROP POLICY IF EXISTS "Allow anon uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow anon reads" ON storage.objects;
DROP POLICY IF EXISTS "Allow anon updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow anon deletes" ON storage.objects;
DROP POLICY IF EXISTS "Public read" ON storage.objects;
DROP POLICY IF EXISTS "Anon insert" ON storage.objects;

-- 3. Allow anyone (including anon key) to INSERT files into behired-uploads
CREATE POLICY "Allow anon uploads"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'behired-uploads');

-- 4. Allow public read (needed for PDFs to be viewable)
CREATE POLICY "Allow anon reads"
ON storage.objects FOR SELECT
USING (bucket_id = 'behired-uploads');

-- 5. Allow update (upsert/replace)
CREATE POLICY "Allow anon updates"
ON storage.objects FOR UPDATE
USING (bucket_id = 'behired-uploads');

-- 6. Allow delete
CREATE POLICY "Allow anon deletes"
ON storage.objects FOR DELETE
USING (bucket_id = 'behired-uploads');
