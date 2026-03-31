-- Fix: Allow anon/service_role uploads in dev mode
-- The browser client uses anon key, not authenticated role
-- Add permissive policies for development

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "authenticated_upload_documents" ON storage.objects;
DROP POLICY IF EXISTS "authenticated_read_documents" ON storage.objects;
DROP POLICY IF EXISTS "authenticated_delete_documents" ON storage.objects;

-- Create permissive policies (dev mode — tighten for production)
CREATE POLICY "allow_upload_documents" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'documents');
CREATE POLICY "allow_read_documents" ON storage.objects
  FOR SELECT USING (bucket_id = 'documents');
CREATE POLICY "allow_update_documents" ON storage.objects
  FOR UPDATE USING (bucket_id = 'documents');
CREATE POLICY "allow_delete_documents" ON storage.objects
  FOR DELETE USING (bucket_id = 'documents');
