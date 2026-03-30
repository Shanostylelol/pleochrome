'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { trpc } from '@/lib/trpc'
import { createClient } from '@/lib/supabase'
import { NeuCard, NeuBadge, NeuButton, NeuInput, NeuSelect } from '@/components/ui'
import { FileText, Upload, Lock, Unlock, Search, Trash2, X, UploadCloud, Download } from 'lucide-react'

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function DocumentsPage() {
  const [search, setSearch] = useState('')
  const [showUpload, setShowUpload] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [docType, setDocType] = useState('other')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { data: documents = [], isLoading } = trpc.documents.list.useQuery(
    search ? { search } : undefined
  )
  const { data: stats } = trpc.documents.getStats.useQuery()
  const utils = trpc.useUtils()

  const toggleLock = trpc.documents.toggleLock.useMutation({
    onSuccess: () => {
      utils.documents.list.invalidate()
      utils.documents.getStats.invalidate()
    },
  })

  const deleteDoc = trpc.documents.delete.useMutation({
    onSuccess: () => {
      utils.documents.list.invalidate()
      utils.documents.getStats.invalidate()
    },
  })

  const createDoc = trpc.documents.create.useMutation({
    onSuccess: () => {
      utils.documents.list.invalidate()
      utils.documents.getStats.invalidate()
      setShowUpload(false)
      setSelectedFile(null)
      setDocType('other')
    },
  })

  const handleFileSelect = (file: File | null) => {
    if (!file) return
    setSelectedFile(file)
  }

  const handleUpload = async () => {
    if (!selectedFile) return
    setUploading(true)
    try {
      const supabase = createClient()
      const path = `global/${Date.now()}-${selectedFile.name}`
      const { error } = await supabase.storage.from('asset-documents').upload(path, selectedFile)
      if (error) throw error
      await createDoc.mutateAsync({
        title: selectedFile.name.replace(/\.[^.]+$/, ''),
        filename: selectedFile.name,
        storagePath: path,
        storageBucket: 'asset-documents',
        mimeType: selectedFile.type,
        fileSizeBytes: selectedFile.size,
        documentType: docType,
      })
    } catch (err) {
      console.error('Upload failed:', err)
    }
    setUploading(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
            Document Library
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            {stats ? `${stats.totalDocuments} documents | ${formatBytes(stats.totalSizeBytes)} used | ${stats.lockedCount} locked` : 'Loading...'}
          </p>
        </div>
        <NeuButton icon={<Upload className="h-4 w-4" />} onClick={() => setShowUpload(!showUpload)}>
          <span className="hidden sm:inline">Upload</span>
        </NeuButton>
      </div>

      <NeuInput
        placeholder="Search documents..."
        icon={<Search className="h-4 w-4" />}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {showUpload && (
        <NeuCard variant="pressed" padding="md" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Upload Document</h3>
            <button onClick={() => { setShowUpload(false); setSelectedFile(null) }} className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)]">
              <X className="h-4 w-4" />
            </button>
          </div>

          {!selectedFile ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); e.stopPropagation() }}
              onDrop={(e) => { e.preventDefault(); e.stopPropagation(); handleFileSelect(e.dataTransfer.files?.[0] ?? null) }}
              className="flex flex-col items-center justify-center gap-2 py-8 rounded-[var(--radius-md)] border-2 border-dashed border-[var(--border)] cursor-pointer hover:border-[var(--teal)] transition-colors"
            >
              <UploadCloud className="h-8 w-8 text-[var(--text-placeholder)]" />
              <p className="text-sm text-[var(--text-muted)]">Drag files here or click to browse</p>
              <p className="text-xs text-[var(--text-placeholder)]">PDF, DOC, XLS, CSV, PNG, JPG up to 50MB</p>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.png,.jpg,.jpeg,.webp"
                onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null)}
              />
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-[var(--radius-md)] bg-[var(--bg-body)]">
                <FileText className="h-5 w-5 text-[var(--teal)] shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--text-primary)] truncate">{selectedFile.name}</p>
                  <p className="text-xs text-[var(--text-muted)]">{formatBytes(selectedFile.size)}</p>
                </div>
                <button onClick={() => setSelectedFile(null)} className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <NeuSelect
                label="Document Type"
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                options={[
                  { value: 'appraisal', label: 'Appraisal' },
                  { value: 'certificate', label: 'Certificate' },
                  { value: 'legal', label: 'Legal' },
                  { value: 'financial', label: 'Financial' },
                  { value: 'insurance', label: 'Insurance' },
                  { value: 'custody', label: 'Custody' },
                  { value: 'compliance', label: 'Compliance' },
                  { value: 'other', label: 'Other' },
                ]}
              />
              <div className="flex gap-3">
                <NeuButton variant="ghost" onClick={() => { setSelectedFile(null) }} fullWidth>Cancel</NeuButton>
                <NeuButton onClick={handleUpload} loading={uploading} fullWidth>Upload</NeuButton>
              </div>
            </div>
          )}

          {createDoc.error && <p className="text-sm text-[var(--ruby)]">{createDoc.error.message}</p>}
        </NeuCard>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-[var(--text-muted)]">Loading documents...</p>
        </div>
      ) : documents.length === 0 ? (
        <NeuCard variant="pressed" padding="lg" className="text-center">
          <FileText className="h-12 w-12 text-[var(--text-placeholder)] mx-auto mb-3" />
          <p className="text-sm text-[var(--text-muted)]">No documents yet</p>
          <p className="text-xs text-[var(--text-placeholder)] mt-1">Upload your first document to get started</p>
        </NeuCard>
      ) : (
        <div className="space-y-2">
          {documents.map((doc) => (
            <NeuCard key={doc.id} variant="raised-sm" padding="sm" className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-[var(--radius-md)] bg-[var(--teal-bg)] text-[var(--teal)] shrink-0">
                <FileText className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--text-primary)] truncate">{doc.title}</p>
                <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                  <span>{doc.filename}</span>
                  <span>&middot;</span>
                  <span>{formatBytes(doc.file_size_bytes ?? 0)}</span>
                  <span>&middot;</span>
                  <span>{formatDate(doc.uploaded_at)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <NeuBadge color="gray" size="sm">{doc.document_type}</NeuBadge>
                {doc.is_locked && <NeuBadge color="ruby" size="sm">Locked</NeuBadge>}
                {doc.asset_id && (doc.assets as { name: string } | null)?.name && (
                  <Link href={`/crm/assets/${doc.asset_id}`} onClick={(e) => e.stopPropagation()}>
                    <NeuBadge color="teal" size="sm">{(doc.assets as { name: string }).name}</NeuBadge>
                  </Link>
                )}
              </div>
              <div className="flex gap-1 shrink-0">
                <NeuButton
                  variant="ghost"
                  size="sm"
                  onClick={async () => {
                    try {
                      const result = await utils.client.documents.getDownloadUrl.query({ documentId: doc.id })
                      window.open(result.url, '_blank')
                    } catch { /* no file in storage yet */ }
                  }}
                  aria-label="Download"
                >
                  <Download className="h-4 w-4" />
                </NeuButton>
                <NeuButton
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleLock.mutate({ documentId: doc.id })}
                  aria-label={doc.is_locked ? 'Unlock' : 'Lock'}
                >
                  {doc.is_locked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                </NeuButton>
                {!doc.is_locked && (
                  <NeuButton
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteDoc.mutate({ documentId: doc.id })}
                    aria-label="Delete"
                  >
                    <Trash2 className="h-4 w-4 text-[var(--ruby)]" />
                  </NeuButton>
                )}
              </div>
            </NeuCard>
          ))}
        </div>
      )}
    </div>
  )
}
