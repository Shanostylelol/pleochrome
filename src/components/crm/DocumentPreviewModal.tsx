'use client'

import { useState, useEffect } from 'react'
import { Download, Pencil, Lock, Unlock, FileText, Save, RotateCcw, Clock } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { cn } from '@/lib/utils'
import { trpc } from '@/lib/trpc'
import { NeuModal } from '@/components/ui/NeuModal'
import { NeuButton } from '@/components/ui/NeuButton'
import { NeuBadge } from '@/components/ui/NeuBadge'
import { useToast } from '@/components/ui/NeuToast'
import { DOCUMENT_TYPES } from '@/lib/constants'

interface DocumentPreviewModalProps {
  open: boolean
  onClose: () => void
  document: Record<string, unknown> | null
  onUpdate?: () => void
}

function getPreviewType(mimeType: string): 'image' | 'pdf' | 'text' | 'other' {
  if (mimeType?.startsWith('image/')) return 'image'
  if (mimeType === 'application/pdf') return 'pdf'
  if (mimeType?.startsWith('text/')) return 'text'
  return 'other'
}

function formatBytes(bytes: number): string {
  if (!bytes) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function DocumentPreviewModal({ open, onClose, document: doc, onUpdate }: DocumentPreviewModalProps) {
  const { toast } = useToast()
  const utils = trpc.useUtils()
  const [signedUrl, setSignedUrl] = useState<string | null>(null)
  const [textContent, setTextContent] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  // Edit fields
  const [editTitle, setEditTitle] = useState('')
  const [editType, setEditType] = useState('')
  const [editDescription, setEditDescription] = useState('')

  const docId = doc?.id as string
  const mimeType = (doc?.mime_type as string) ?? ''
  const previewType = getPreviewType(mimeType)

  // Fetch signed URL when modal opens
  useEffect(() => {
    if (!open || !docId) { setSignedUrl(null); setTextContent(null); return }
    utils.client.documents.getDownloadUrl.query({ documentId: docId })
      .then((result) => {
        if (result?.url) {
          setSignedUrl(result.url)
          if (previewType === 'text') {
            fetch(result.url).then(r => r.text()).then(setTextContent).catch(() => setTextContent('Could not load text content'))
          }
        }
      })
      .catch(() => toast('Could not load preview', 'error'))
  }, [open, docId, previewType, utils.client.documents.getDownloadUrl, toast])

  // Sync edit fields when doc changes
  useEffect(() => {
    if (doc) {
      setEditTitle((doc.title as string) ?? '')
      setEditType((doc.document_type as string) ?? 'general')
      setEditDescription((doc.description as string) ?? '')
      setIsEditing(false)
    }
  }, [doc])

  const updateMutation = trpc.documents.update.useMutation({
    onSuccess: () => { toast('Document updated', 'success'); setIsEditing(false); onUpdate?.() },
    onError: (err) => toast(err.message, 'error'),
  })

  const toggleLockMutation = trpc.documents.toggleLock.useMutation({
    onSuccess: () => {
      toast(doc?.is_locked ? 'Document unlocked' : 'Document locked', 'success')
      onUpdate?.()
    },
    onError: (err) => toast(err.message, 'error'),
  })

  const { data: versions = [] } = trpc.documents.getVersionHistory.useQuery(
    { documentId: docId },
    { enabled: !!docId && open }
  )

  const createVersionMutation = trpc.documents.createNewVersion.useMutation({
    onSuccess: () => { toast('New version uploaded', 'success'); onUpdate?.() },
    onError: (err) => toast(err.message, 'error'),
  })

  async function handleReplace(file: File) {
    const supabase = createClient()
    const folder = (doc?.asset_id as string) ?? 'general'
    const path = `${folder}/${Date.now()}-${file.name}`
    const { error: uploadError } = await supabase.storage.from('documents').upload(path, file)
    if (uploadError) { toast(uploadError.message, 'error'); return }
    createVersionMutation.mutate({
      parentDocumentId: docId,
      filename: file.name,
      storagePath: path,
      storageBucket: 'documents',
      mimeType: file.type || 'application/octet-stream',
      fileSizeBytes: file.size,
    })
  }

  function handleSave() {
    updateMutation.mutate({
      documentId: docId,
      title: editTitle.trim() || undefined,
      documentType: editType || undefined,
      description: editDescription.trim() || null,
    })
  }

  if (!doc) return null

  const uploaderName = (doc.team_members as Record<string, unknown>)?.full_name as string ?? 'Unknown'
  const assetInfo = doc.assets as Record<string, unknown> | null
  const isLocked = doc.is_locked as boolean

  return (
    <NeuModal open={open} onClose={onClose} title={isEditing ? 'Edit Document' : (doc.title as string) ?? 'Document'} maxWidth="full">
      <div className="space-y-4">
        {/* Preview area */}
        <div className="rounded-[var(--radius-md)] bg-[var(--bg-elevated)] border border-[var(--border)] overflow-hidden">
          {previewType === 'image' && signedUrl && (
            <div className="flex items-center justify-center p-4 min-h-[300px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={signedUrl} alt={(doc.title as string) ?? 'Document'} className="max-h-[40vh] sm:max-h-[60vh] max-w-full object-contain rounded-[var(--radius-sm)]" />
            </div>
          )}
          {previewType === 'pdf' && signedUrl && (
            <iframe src={signedUrl} className="w-full h-[40vh] sm:h-[60vh] border-0" title={(doc.title as string) ?? 'PDF Preview'} />
          )}
          {previewType === 'text' && (
            <pre className="p-4 text-xs text-[var(--text-secondary)] max-h-[40vh] sm:max-h-[60vh] overflow-auto whitespace-pre-wrap font-mono">
              {textContent ?? 'Loading...'}
            </pre>
          )}
          {previewType === 'other' && (
            <div className="flex flex-col items-center justify-center p-8 min-h-[200px] text-center">
              <FileText className="h-12 w-12 text-[var(--text-placeholder)] mb-3" />
              <p className="text-sm text-[var(--text-secondary)]">Preview not available for this file type</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">{mimeType || 'Unknown type'}</p>
              {signedUrl && (
                <NeuButton variant="ghost" size="sm" icon={<Download className="h-3.5 w-3.5" />}
                  onClick={() => window.open(signedUrl, '_blank')} className="mt-3">
                  Download to View
                </NeuButton>
              )}
            </div>
          )}
          {!signedUrl && previewType !== 'other' && (
            <div className="flex items-center justify-center p-8 min-h-[200px]">
              <p className="text-sm text-[var(--text-muted)]">Loading preview...</p>
            </div>
          )}
        </div>

        {/* Metadata + Edit mode */}
        {isEditing ? (
          <div className="space-y-3 p-3 rounded-[var(--radius-md)] bg-[var(--bg-elevated)] border border-[var(--border)]">
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1 block">Title</label>
              <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)}
                className={cn('w-full h-8 text-sm rounded-[var(--radius-sm)] px-2',
                  'bg-[var(--bg-input)] text-[var(--text-primary)]',
                  'shadow-[var(--shadow-pressed)] border border-[var(--border)]',
                  'focus:outline-none focus:border-[var(--teal)]')} />
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1 block">Document Type</label>
              <select value={editType} onChange={(e) => setEditType(e.target.value)}
                className={cn('w-full h-8 text-sm rounded-[var(--radius-sm)] px-2',
                  'bg-[var(--bg-input)] text-[var(--text-primary)]',
                  'shadow-[var(--shadow-pressed)] border border-[var(--border)]',
                  'focus:outline-none focus:border-[var(--teal)]')}>
                {DOCUMENT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1 block">Description</label>
              <textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} rows={2}
                placeholder="Optional description..."
                className={cn('w-full text-sm rounded-[var(--radius-sm)] px-2 py-1.5 resize-none',
                  'bg-[var(--bg-input)] text-[var(--text-primary)] placeholder:text-[var(--text-placeholder)]',
                  'shadow-[var(--shadow-pressed)] border border-[var(--border)]',
                  'focus:outline-none focus:border-[var(--teal)]')} />
            </div>
            <div className="flex gap-2">
              <NeuButton size="sm" icon={<Save className="h-3.5 w-3.5" />} loading={updateMutation.isPending} onClick={handleSave}>Save</NeuButton>
              <NeuButton size="sm" variant="ghost" onClick={() => setIsEditing(false)}>Cancel</NeuButton>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--text-muted)]">
            <NeuBadge color="teal" size="sm">{(doc.document_type as string) ?? 'general'}</NeuBadge>
            <span>{formatBytes(doc.file_size_bytes as number)}</span>
            <span>{doc.uploaded_at ? new Date(doc.uploaded_at as string).toLocaleDateString() : '—'}</span>
            <span>by {uploaderName}</span>
            {assetInfo && <span className="text-[var(--teal)]">{assetInfo.name as string}</span>}
            {isLocked && <NeuBadge color="ruby" size="sm"><Lock className="h-3 w-3 inline mr-0.5" />Locked</NeuBadge>}
            {typeof doc.version === 'number' && doc.version > 1 && <NeuBadge color="gray" size="sm">v{doc.version}</NeuBadge>}
          </div>
        )}

        {/* Version history */}
        {(versions as Array<Record<string, unknown>>).length > 1 && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-[var(--text-muted)]" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Version History</span>
            </div>
            {(versions as Array<Record<string, unknown>>).map((v) => {
              const vUploader = (v.team_members as Record<string, unknown>)?.full_name as string ?? 'Unknown'
              return (
                <div key={v.id as string} className="flex items-center gap-2 text-xs py-1 px-2 rounded-[var(--radius-sm)] hover:bg-[var(--bg-elevated)]">
                  <span className="font-mono font-medium text-[var(--text-primary)]">v{v.version as number}</span>
                  {v.is_current === true && <NeuBadge color="teal" size="sm">current</NeuBadge>}
                  <span className="text-[var(--text-muted)]">{v.uploaded_at ? new Date(v.uploaded_at as string).toLocaleDateString() : ''}</span>
                  <span className="text-[var(--text-muted)]">{vUploader}</span>
                  <span className="text-[var(--text-muted)] truncate flex-1">{v.filename as string}</span>
                </div>
              )
            })}
          </div>
        )}

        {/* Action bar */}
        <div className="flex items-center gap-2 pt-2 border-t border-[var(--border)]">
          {signedUrl && (
            <NeuButton variant="ghost" size="sm" icon={<Download className="h-3.5 w-3.5" />}
              onClick={() => window.open(signedUrl, '_blank')}>
              Download
            </NeuButton>
          )}
          {!isEditing && !isLocked && (
            <>
              <NeuButton variant="ghost" size="sm" icon={<Pencil className="h-3.5 w-3.5" />}
                onClick={() => setIsEditing(true)}>
                Edit
              </NeuButton>
              <NeuButton variant="ghost" size="sm" icon={<RotateCcw className="h-3.5 w-3.5" />}
                loading={createVersionMutation.isPending}
                onClick={() => {
                  const input = document.createElement('input')
                  input.type = 'file'
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0]
                    if (file) handleReplace(file)
                  }
                  input.click()
                }}>
                Replace
              </NeuButton>
            </>
          )}
          <NeuButton variant="ghost" size="sm"
            icon={isLocked ? <Unlock className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
            loading={toggleLockMutation.isPending}
            onClick={() => toggleLockMutation.mutate({ documentId: docId })}>
            {isLocked ? 'Unlock' : 'Lock'}
          </NeuButton>
        </div>
      </div>
    </NeuModal>
  )
}
