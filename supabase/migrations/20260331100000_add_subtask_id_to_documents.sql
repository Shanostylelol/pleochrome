-- Add subtask_id FK to documents table for subtask-level file attachment
ALTER TABLE documents ADD COLUMN subtask_id UUID REFERENCES subtasks(id) ON DELETE SET NULL;
CREATE INDEX idx_documents_subtask_id ON documents(subtask_id) WHERE subtask_id IS NOT NULL;
