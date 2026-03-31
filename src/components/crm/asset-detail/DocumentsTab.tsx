'use client'

import { useState, useMemo } from 'react'
import { FileText, Download, ChevronDown } from 'lucide-react'
import { trpc } from '@/lib/trpc'
import { NeuCard } from '@/components/ui/NeuCard'
import { NeuBadge } from '@/components/ui/NeuBadge'
import { NeuButton } from '@/components/ui/NeuButton'
import { useToast } from '@/components/ui/NeuToast'
import { DocumentUploadZone, type UploadedFile } from '@/components/crm/DocumentUploadZone'
import { RequiredDocsChecklist } from './RequiredDocsChecklist'
import { DocumentPreviewModal } from '@/components/crm/DocumentPreviewModal'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

interface DocumentsTabProps {
  assetId: string
  documents: Array<Record<string, unknown>>
  stages?: Array<{ id: string; name: string; phase: string }>
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function DocCard({ doc, onClick }: { doc: Record<string, unknown>; onClick: () => void }) {
  return (
    <NeuCard variant="raised-sm" padding="sm" className="flex items-center gap-3 cursor-pointer" onClick={onClick}>
      <div className="w-9 h-9 rounded-[var(--radius-md)] bg-[var(--teal-bg)] text-[var(--teal)] flex items-center justify-center shrink-0">
        <FileText className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[var(--text-primary)] truncate">{(doc.title ?? doc.filename) as string}</p>
        <p className="text-xs text-[var(--text-muted)]">
          {doc.document_type as string}
          {doc.file_size_bytes ? ` \u00B7 ${formatBytes(doc.file_size_bytes as number)}` : ''}
          {doc.created_at ? ` \u00B7 ${new Date(doc.created_at as string).toLocaleDateString()}` : ''}
        </p>
      </div>
      <NeuBadge color="gray" size="sm">{doc.document_type as string}</NeuBadge>
    </NeuCard>
  )
}

export function DocumentsTab({ assetId, documents, stages = [] }: DocumentsTabProps) {
  const utils = trpc.useUtils()
  const { toast } = useToast()
  const [downloading, setDownloading] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState('')
  const [previewDoc, setPreviewDoc] = useState<Record<string, unknown> | null>(null)

  const createDoc = trpc.documents.create.useMutation({
    onSuccess: () => { utils.assets.getById.invalidate({ assetId }); toast('Document saved', 'success') },
    onError: (err) => toast(err.message, 'error'),
  })

  const handleUploadComplete = (file: UploadedFile) => {
    createDoc.mutate({
      title: file.name, filename: file.name, storagePath: file.url, storageBucket: 'documents',
      mimeType: file.mimeType || 'application/octet-stream', fileSizeBytes: file.size,
      documentType: 'general', assetId,
    })
  }

  // Group documents by stage
  const grouped = useMemo(() => {
    const byStage = new Map<string | null, Array<Record<string, unknown>>>()
    for (const doc of documents) {
      const sid = (doc.stage_id as string) ?? null
      if (!byStage.has(sid)) byStage.set(sid, [])
      byStage.get(sid)!.push(doc)
    }
    const sections: { id: string | null; name: string; docs: Array<Record<string, unknown>> }[] = []
    for (const stage of stages) {
      const docs = byStage.get(stage.id)
      if (docs?.length) sections.push({ id: stage.id, name: stage.name, docs })
    }
    const ungrouped = byStage.get(null)
    if (ungrouped?.length) sections.push({ id: null, name: 'General', docs: ungrouped })
    return sections
  }, [documents, stages])

  async function handleBatchDownload() {
    if (documents.length === 0) return
    setDownloading(true); setDownloadProgress('Preparing...')
    try {
      const zip = new JSZip()
      let done = 0
      for (const doc of documents) {
        setDownloadProgress(`Fetching ${done + 1}/${documents.length}...`)
        try {
          const result = await utils.client.documents.getDownloadUrl.query({ documentId: doc.id as string })
          if (result?.url) { const r = await fetch(result.url); zip.file((doc.filename ?? doc.title ?? 'doc') as string, await r.blob()) }
        } catch { /* skip */ }
        done++
      }
      setDownloadProgress('Creating ZIP...')
      saveAs(await zip.generateAsync({ type: 'blob' }), `documents-${assetId.slice(0, 8)}.zip`)
      toast('Download complete', 'success')
    } catch { toast('Batch download failed', 'error') }
    finally { setDownloading(false); setDownloadProgress('') }
  }

  return (
    <div className="space-y-4">
      <RequiredDocsChecklist assetId={assetId} />

      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--text-secondary)]">
          {documents.length} {documents.length === 1 ? 'document' : 'documents'}
        </p>
        {documents.length > 0 && (
          <NeuButton variant="ghost" size="sm" icon={<Download className="h-3.5 w-3.5" />}
            loading={downloading} onClick={handleBatchDownload}>
            {downloadProgress || 'Download All'}
          </NeuButton>
        )}
      </div>

      <DocumentUploadZone assetId={assetId} onUploadComplete={handleUploadComplete} />

      {documents.length === 0 ? (
        <NeuCard variant="pressed" padding="lg" className="text-center">
          <FileText className="h-10 w-10 text-[var(--text-placeholder)] mx-auto mb-3" />
          <p className="text-sm text-[var(--text-muted)]">No documents attached.</p>
          <p className="text-xs text-[var(--text-placeholder)] mt-1">Upload documents above.</p>
        </NeuCard>
      ) : grouped.length > 0 ? (
        <div className="space-y-4">
          {grouped.map((section) => (
            <div key={section.id ?? 'general'}>
              <div className="flex items-center gap-2 mb-2">
                <ChevronDown className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  {section.name}
                </span>
                <NeuBadge color="gray" size="sm">{section.docs.length}</NeuBadge>
              </div>
              <div className="space-y-1.5 ml-5">
                {section.docs.map((doc) => (
                  <DocCard key={doc.id as string} doc={doc} onClick={() => setPreviewDoc(doc)} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-1.5">
          {documents.map((doc) => (
            <DocCard key={doc.id as string} doc={doc} onClick={() => setPreviewDoc(doc)} />
          ))}
        </div>
      )}

      <DocumentPreviewModal open={!!previewDoc} onClose={() => setPreviewDoc(null)}
        document={previewDoc}
        onUpdate={() => { utils.assets.getById.invalidate({ assetId }); setPreviewDoc(null) }} />
    </div>
  )
}
