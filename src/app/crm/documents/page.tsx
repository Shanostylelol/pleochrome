'use client'

import { useState } from 'react'
import { trpc } from '@/lib/trpc'
import { NeuCard, NeuBadge, NeuButton, NeuInput } from '@/components/ui'
import { FileText, Upload, Lock, Unlock, Search, Trash2 } from 'lucide-react'

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
        <NeuButton icon={<Upload className="h-4 w-4" />}>
          <span className="hidden sm:inline">Upload</span>
        </NeuButton>
      </div>

      <NeuInput
        placeholder="Search documents..."
        icon={<Search className="h-4 w-4" />}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

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
                {(doc.assets as { name: string } | null)?.name && (
                  <NeuBadge color="teal" size="sm">{(doc.assets as { name: string }).name}</NeuBadge>
                )}
              </div>
              <div className="flex gap-1 shrink-0">
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
