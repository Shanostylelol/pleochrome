'use client'

import { useState } from 'react'
import { FileText, Download, Trash2, Paperclip } from 'lucide-react'
import { cn } from '@/lib/utils'
import { trpc } from '@/lib/trpc'
import { createClient } from '@/lib/supabase'
import { NeuButton } from '@/components/ui/NeuButton'
import { useToast } from '@/components/ui/NeuToast'

interface StageFileListProps {
  stageId: string
  assetId?: string
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function StageFileList({ stageId, assetId }: StageFileListProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const utils = trpc.useUtils()

  const { data: docs = [] } = trpc.documents.list.useQuery({ stageId })
  const createDoc = trpc.documents.create.useMutation({
    onSuccess: () => {
      utils.documents.list.invalidate({ stageId })
      toast('File uploaded', 'success')
    },
    onError: (err) => toast(err.message, 'error'),
  })
  const deleteDoc = trpc.documents.delete.useMutation({
    onSuccess: () => {
      utils.documents.list.invalidate({ stageId })
      toast('File deleted', 'success')
    },
    onError: (err) => toast(err.message, 'error'),
  })

  async function handleUpload(file: File) {
    setUploading(true)
    setError(null)
    try {
      const supabase = createClient()
      const path = `stages/${stageId}/${Date.now()}-${file.name}`
      const { error: uploadError } = await supabase.storage.from('documents').upload(path, file)
      if (uploadError) throw new Error(uploadError.message)

      await createDoc.mutateAsync({
        title: file.name,
        filename: file.name,
        storagePath: path,
        storageBucket: 'documents',
        mimeType: file.type || 'application/octet-stream',
        fileSizeBytes: file.size,
        documentType: 'general',
        stageId,
        assetId,
      })
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Upload failed'
      setError(msg)
      toast(msg, 'error')
    } finally {
      setUploading(false)
    }
  }

  async function handleDownload(docId: string) {
    try {
      const result = await utils.client.documents.getDownloadUrl.query({ documentId: docId })
      if (result?.url) window.open(result.url, '_blank')
    } catch {
      toast('Download failed', 'error')
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

  return (
    <div>
      {docs.length > 0 && (
        <div className="space-y-1 mb-2">
          {(docs as Array<{ id: string; filename: string; file_size_bytes: number; mime_type: string; is_locked: boolean }>).map((doc) => (
            <div key={doc.id} className={cn(
              'group flex items-center gap-2 py-1 px-2 rounded-[var(--radius-sm)]',
              'hover:bg-[var(--bg-surface)] transition-colors'
            )}>
              <FileText className="h-3.5 w-3.5 text-[var(--text-muted)] shrink-0" />
              <span className="flex-1 text-xs text-[var(--text-primary)] truncate">{doc.filename}</span>
              <span className="text-[10px] text-[var(--text-muted)] shrink-0">{formatBytes(doc.file_size_bytes)}</span>
              <button onClick={() => handleDownload(doc.id)} aria-label={`Download ${doc.filename}`}
                className="p-1.5 text-[var(--text-muted)] hover:text-[var(--teal)] transition-colors opacity-0 group-hover:opacity-100">
                <Download className="h-3 w-3" />
              </button>
              {!doc.is_locked && (
                <button onClick={() => deleteDoc.mutate({ documentId: doc.id })} aria-label={`Delete ${doc.filename}`}
                  className="p-1.5 text-[var(--text-muted)] hover:text-[var(--ruby)] transition-colors opacity-0 group-hover:opacity-100">
                  <Trash2 className="h-3 w-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <NeuButton variant="ghost" size="sm" onClick={handleFileInput} loading={uploading}
        icon={<Paperclip className="h-3.5 w-3.5" />} className="!h-7 !px-2 text-[var(--text-secondary)]">
        Attach File
      </NeuButton>
      {error && <p className="text-xs text-[var(--ruby)] mt-1">{error}</p>}
    </div>
  )
}
