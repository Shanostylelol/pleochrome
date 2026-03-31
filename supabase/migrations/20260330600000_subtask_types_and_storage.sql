-- ============================================================================
-- Migration 1 of 2: Add subtask-specific enum values + storage bucket
-- Must be separate from backfill because ALTER TYPE ADD VALUE can't be used
-- in same transaction as the new values
-- ============================================================================

-- ── 1. Add subtask-specific enum values to v2_task_type ─────────────────────
ALTER TYPE v2_task_type ADD VALUE IF NOT EXISTS 'call';
ALTER TYPE v2_task_type ADD VALUE IF NOT EXISTS 'email';
ALTER TYPE v2_task_type ADD VALUE IF NOT EXISTS 'note';
ALTER TYPE v2_task_type ADD VALUE IF NOT EXISTS 'research';
ALTER TYPE v2_task_type ADD VALUE IF NOT EXISTS 'verification';
ALTER TYPE v2_task_type ADD VALUE IF NOT EXISTS 'follow_up';
ALTER TYPE v2_task_type ADD VALUE IF NOT EXISTS 'signature';

-- ── 2. Create Supabase Storage bucket for documents ─────────────────────────
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents',
  'documents',
  false,
  52428800,
  ARRAY[
    'application/pdf',
    'image/png', 'image/jpeg', 'image/gif', 'image/webp',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain', 'text/csv', 'application/json'
  ]
) ON CONFLICT (id) DO NOTHING;

-- Storage RLS policies
CREATE POLICY "authenticated_upload_documents" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'documents');
CREATE POLICY "authenticated_read_documents" ON storage.objects
  FOR SELECT TO authenticated USING (bucket_id = 'documents');
CREATE POLICY "authenticated_delete_documents" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'documents');
