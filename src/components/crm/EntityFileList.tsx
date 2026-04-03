'use client'

import { useState } from 'react'
import { FileText, Download, Trash2, Paperclip, StickyNote, Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { trpc } from '@/lib/trpc'
import { createClient } from '@/lib/supabase'
import { NeuButton } from '@/components/ui/NeuButton'
import { useToast } from '@/components/ui/NeuToast'

interface EntityFileListProps {
  entityType: 'task' | 'subtask' | 'stage'
  entityId: string
  taskId?: string
  assetId?: string
}

type DocItem = { id: string; filename: string; file_size_bytes: number; is_locked: boolean; notes?: string | null; title?: string }

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function FileRow({ doc, onDownload, onDelete, onUpdateNote }: {
  doc: DocItem
  onDownload: (id: string) => void
  onDelete: (id: string) => void
  onUpdateNote: (id: string, notes: string) => void
}) {
  const [noteOpen, setNoteOpen] = useState(false)
  const [noteVal, setNoteVal] = useState(doc.notes ?? '')

  function commitNote() {
    onUpdateNote(doc.id, noteVal.trim())
    setNoteOpen(false)
  }

  return (
    <div className={cn('rounded-[var(--radius-sm)] transition-colors', 'hover:bg-[var(--bg-surface)]')}>
      <div className="group flex items-center gap-2 py-1 px-2">
        <FileText className="h-3.5 w-3.5 text-[var(--text-muted)] shrink-0" />
        <div className="flex-1 min-w-0">
          <span className="text-xs text-[var(--text-primary)] truncate block">{doc.filename}</span>
          {doc.notes && !noteOpen && (
            <span className="text-[10px] text-[var(--text-muted)] truncate block italic">{doc.notes}</span>
          )}
        </div>
        <span className="text-[10px] text-[var(--text-muted)] shrink-0">{formatBytes(doc.file_size_bytes)}</span>
        <button onClick={() => { setNoteVal(doc.notes ?? ''); setNoteOpen(!noteOpen) }}
          aria-label={doc.notes ? 'Edit note' : 'Add note'}
          title={doc.notes ? 'Edit note' : 'Add note'}
          className={cn('p-1.5 transition-colors opacity-0 group-hover:opacity-100',
            doc.notes ? 'text-[var(--teal)]' : 'text-[var(--text-muted)] hover:text-[var(--teal)]')}>
          <StickyNote className="h-3 w-3" />
        </button>
        <button onClick={() => onDownload(doc.id)} aria-label={`Download ${doc.filename}`}
          className="p-1.5 text-[var(--text-muted)] hover:text-[var(--teal)] transition-colors opacity-0 group-hover:opacity-100">
          <Download className="h-3 w-3" />
        </button>
        {!doc.is_locked && (
          <button onClick={() => onDelete(doc.id)} aria-label={`Delete ${doc.filename}`}
            className="p-1.5 text-[var(--text-muted)] hover:text-[var(--ruby)] transition-colors opacity-0 group-hover:opacity-100">
            <Trash2 className="h-3 w-3" />
          </button>
        )}
      </div>

      {noteOpen && (
        <div className="px-2 pb-2 flex items-center gap-1.5">
          <input
            autoFocus
            type="text"
            value={noteVal}
            onChange={(e) => setNoteVal(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') commitNote(); if (e.key === 'Escape') setNoteOpen(false) }}
            placeholder="Add a note about this file..."
            className="flex-1 text-xs px-2 py-1 rounded-[var(--radius-sm)] bg-[var(--bg-input)] text-[var(--text-primary)] placeholder:text-[var(--text-placeholder)] shadow-[var(--shadow-pressed)] border border-[var(--border)] focus:outline-none focus:border-[var(--teal)]"
          />
          <button onClick={commitNote} aria-label="Save note"
            className="p-1 text-[var(--chartreuse)] hover:bg-[var(--bg-elevated)] rounded-[var(--radius-sm)]">
            <Check className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => setNoteOpen(false)} aria-label="Cancel"
            className="p-1 text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] rounded-[var(--radius-sm)]">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  )
}

const DOC_TYPES = [
  { value: 'general', label: 'General' },
  { value: 'appraisal', label: 'Appraisal' },
  { value: 'certificate', label: 'Certificate' },
  { value: 'legal', label: 'Legal' },
  { value: 'financial', label: 'Financial' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'compliance', label: 'Compliance' },
  { value: 'report', label: 'Report' },
  { value: 'other', label: 'Other' },
]

export function EntityFileList({ entityType, entityId, taskId, assetId }: EntityFileListProps) {
  const [uploading, setUploading] = useState(false)
  const [docType, setDocType] = useState('general')
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const utils = trpc.useUtils()

  const listQuery = entityType === 'task'
    ? trpc.documents.listByTask.useQuery({ taskId: entityId })
    : entityType === 'subtask'
      ? trpc.documents.listBySubtask.useQuery({ subtaskId: entityId })
      : trpc.documents.list.useQuery({ stageId: entityId })

  const docs = (listQuery.data ?? []) as DocItem[]

  const invalidate = () => {
    if (entityType === 'task') utils.documents.listByTask.invalidate({ taskId: entityId })
    else if (entityType === 'subtask') utils.documents.listBySubtask.invalidate({ subtaskId: entityId })
    else utils.documents.list.invalidate({ stageId: entityId })
  }

  const createDoc = trpc.documents.create.useMutation({
    onSuccess: () => { invalidate(); toast('File uploaded', 'success') },
    onError: (err) => toast(err.message, 'error'),
  })
  const deleteDoc = trpc.documents.delete.useMutation({
    onSuccess: () => { invalidate(); toast('File deleted', 'success') },
    onError: (err) => toast(err.message, 'error'),
  })
  const updateDoc = trpc.documents.update.useMutation({
    onSuccess: () => { invalidate() },
    onError: (err) => toast(err.message, 'error'),
  })

  async function handleUpload(file: File) {
    setUploading(true); setError(null)
    try {
      const supabase = createClient()
      const path = `${entityType}s/${entityId}/${Date.now()}-${file.name}`
      const { error: uploadError } = await supabase.storage.from('documents').upload(path, file)
      if (uploadError) throw new Error(uploadError.message)
      await createDoc.mutateAsync({
        title: file.name, filename: file.name,
        storagePath: path, storageBucket: 'documents',
        mimeType: file.type || 'application/octet-stream',
        fileSizeBytes: file.size, documentType: docType,
        ...(entityType === 'task' ? { taskId: entityId } : {}),
        ...(entityType === 'subtask' ? { subtaskId: entityId, taskId } : {}),
        ...(entityType === 'stage' ? { stageId: entityId } : {}),
        assetId,
      })
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Upload failed'
      setError(msg); toast(msg, 'error')
    } finally { setUploading(false) }
  }

  async function handleDownload(docId: string) {
    try {
      const result = await utils.client.documents.getDownloadUrl.query({ documentId: docId })
      if (result?.url) window.open(result.url, '_blank')
    } catch { toast('Download failed', 'error') }
  }

  function handleFileInput() {
    const input = document.createElement('input')
    input.type = 'file'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) handleUpload(file)
    }
    input.click()
  }

  return (
    <div>
      {docs.length > 0 && (
        <div className="space-y-0.5 mb-2">
          {docs.map((doc) => (
            <FileRow
              key={doc.id}
              doc={doc}
              onDownload={handleDownload}
              onDelete={(id) => deleteDoc.mutate({ documentId: id })}
              onUpdateNote={(id, notes) => updateDoc.mutate({ documentId: id, notes: notes || null })}
            />
          ))}
        </div>
      )}
      <div className="flex items-center gap-1.5">
        <select
          value={docType}
          onChange={(e) => setDocType(e.target.value)}
          className="h-8 text-sm rounded-[var(--radius-sm)] px-2 bg-[var(--bg-input)] text-[var(--text-secondary)] border border-[var(--border)] shadow-[var(--shadow-pressed)] focus:outline-none focus:border-[var(--teal)]"
        >
          {DOC_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
        <NeuButton variant="ghost" size="sm" onClick={handleFileInput} loading={uploading}
          icon={<Paperclip className="h-3.5 w-3.5" />} className="!h-7 !px-2 text-[var(--text-secondary)]">
          Attach File
        </NeuButton>
      </div>
      {error && <p className="text-xs text-[var(--ruby)] mt-1">{error}</p>}
    </div>
  )
}
