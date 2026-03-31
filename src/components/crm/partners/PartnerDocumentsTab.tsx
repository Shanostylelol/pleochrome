'use client'

import { useState } from 'react'
import { FileText, Download, Trash2, Paperclip } from 'lucide-react'
import { trpc } from '@/lib/trpc'
import { createClient } from '@/lib/supabase'
import { NeuCard } from '@/components/ui/NeuCard'
import { NeuBadge } from '@/components/ui/NeuBadge'
import { NeuButton } from '@/components/ui/NeuButton'
import { useToast } from '@/components/ui/NeuToast'
import { DocumentPreviewModal } from '@/components/crm/DocumentPreviewModal'
import { DOCUMENT_TYPES } from '@/lib/constants'

interface PartnerDocumentsTabProps {
  partnerId: string
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function PartnerDocumentsTab({ partnerId }: PartnerDocumentsTabProps) {
  const { toast } = useToast()
  const utils = trpc.useUtils()
  const [uploading, setUploading] = useState(false)
  const [docType, setDocType] = useState('other')
  const [previewDoc, setPreviewDoc] = useState<Record<string, unknown> | null>(null)

  const { data: docs = [] } = trpc.documents.list.useQuery({ partnerId })
  const createDoc = trpc.documents.create.useMutation({
    onSuccess: () => { utils.documents.list.invalidate({ partnerId }); toast('Document uploaded', 'success') },
    onError: (err) => toast(err.message, 'error'),
  })
  const deleteDoc = trpc.documents.delete.useMutation({
    onSuccess: () => { utils.documents.list.invalidate({ partnerId }); toast('Document deleted', 'success') },
    onError: (err) => toast(err.message, 'error'),
  })

  async function handleUpload(file: File) {
    setUploading(true)
    try {
      const supabase = createClient()
      const path = `partners/${partnerId}/${Date.now()}-${file.name}`
      const { error: uploadError } = await supabase.storage.from('documents').upload(path, file)
      if (uploadError) throw new Error(uploadError.message)

      await createDoc.mutateAsync({
        title: file.name,
        filename: file.name,
        storagePath: path,
        storageBucket: 'documents',
        mimeType: file.type || 'application/octet-stream',
        fileSizeBytes: file.size,
        documentType: docType,
        partnerId,
      })
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Upload failed', 'error')
    } finally {
      setUploading(false)
    }
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

  async function handleDownload(docId: string) {
    try {
      const result = await utils.client.documents.getDownloadUrl.query({ documentId: docId })
      if (result?.url) window.open(result.url, '_blank')
    } catch { toast('Download failed', 'error') }
  }

  const typedDocs = docs as Array<Record<string, unknown>>

  return (
    <div className="space-y-4">
      {/* Upload controls */}
      <div className="flex items-center gap-3">
        <select value={docType} onChange={(e) => setDocType(e.target.value)}
          className="h-8 text-xs rounded-[var(--radius-sm)] px-2 bg-[var(--bg-input)] text-[var(--text-secondary)] shadow-[var(--shadow-pressed)] border border-[var(--border)] focus:outline-none focus:border-[var(--teal)]">
          {DOCUMENT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
        <NeuButton size="sm" icon={<Paperclip className="h-3.5 w-3.5" />}
          loading={uploading} onClick={handleFileInput}>
          Upload Document
        </NeuButton>
      </div>

      {/* Document list */}
      {typedDocs.length === 0 ? (
        <NeuCard variant="pressed" padding="lg" className="text-center">
          <FileText className="h-10 w-10 text-[var(--text-placeholder)] mx-auto mb-3" />
          <p className="text-sm text-[var(--text-muted)]">No documents for this partner.</p>
          <p className="text-xs text-[var(--text-placeholder)] mt-1">Upload documents above.</p>
        </NeuCard>
      ) : (
        <div className="space-y-2">
          {typedDocs.map((doc) => (
            <NeuCard key={doc.id as string} variant="raised-sm" padding="sm"
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => setPreviewDoc(doc)}>
              <div className="w-9 h-9 rounded-[var(--radius-md)] bg-[var(--teal-bg)] text-[var(--teal)] flex items-center justify-center shrink-0">
                <FileText className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--text-primary)] truncate">{(doc.title ?? doc.filename) as string}</p>
                <p className="text-xs text-[var(--text-muted)]">
                  {doc.document_type as string}
                  {doc.file_size_bytes ? ` · ${formatBytes(doc.file_size_bytes as number)}` : ''}
                  {doc.uploaded_at ? ` · ${new Date(doc.uploaded_at as string).toLocaleDateString()}` : ''}
                </p>
              </div>
              <NeuBadge color="gray" size="sm">{doc.document_type as string}</NeuBadge>
              <button onClick={(e) => { e.stopPropagation(); handleDownload(doc.id as string) }}
                className="p-1 text-[var(--text-muted)] hover:text-[var(--teal)] transition-colors opacity-0 group-hover:opacity-100">
                <Download className="h-3.5 w-3.5" />
              </button>
              {!(doc.is_locked as boolean) && (
                <button onClick={(e) => { e.stopPropagation(); deleteDoc.mutate({ documentId: doc.id as string }) }}
                  className="p-1 text-[var(--text-muted)] hover:text-[var(--ruby)] transition-colors opacity-0 group-hover:opacity-100">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </NeuCard>
          ))}
        </div>
      )}

      <DocumentPreviewModal open={!!previewDoc} onClose={() => setPreviewDoc(null)}
        document={previewDoc}
        onUpdate={() => { utils.documents.list.invalidate({ partnerId }); setPreviewDoc(null) }} />
    </div>
  )
}
