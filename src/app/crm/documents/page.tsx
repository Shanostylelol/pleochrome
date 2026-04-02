'use client'

import { useState, useRef, useMemo } from 'react'
import Link from 'next/link'
import { trpc } from '@/lib/trpc'
import { createClient } from '@/lib/supabase'
import { NeuCard, NeuBadge, NeuButton, NeuInput, NeuSelect, NeuSkeleton } from '@/components/ui'
import { FileText, Upload, Lock, Unlock, Search, Trash2, X, UploadCloud, Download, Package, ArrowUpDown, ChevronUp, ChevronDown } from 'lucide-react'

type DocSortKey = 'title' | 'document_type' | 'uploaded_at' | 'file_size_bytes'
import { exportCSV } from '@/lib/csv-export'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { DocumentPreviewModal } from '@/components/crm/DocumentPreviewModal'

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

const DOC_TYPE_OPTIONS = [
  { value: '', label: 'All Types' },
  { value: 'appraisal', label: 'Appraisal' },
  { value: 'certificate', label: 'Certificate' },
  { value: 'legal', label: 'Legal' },
  { value: 'financial', label: 'Financial' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'custody', label: 'Custody' },
  { value: 'compliance', label: 'Compliance' },
  { value: 'other', label: 'Other' },
]

export default function DocumentsPage() {
  const [search, setSearch] = useState('')
  const [docTypeFilter, setDocTypeFilter] = useState('')
  const [showUpload, setShowUpload] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [docType, setDocType] = useState('other')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [previewDoc, setPreviewDoc] = useState<Record<string, unknown> | null>(null)
  const [assetFilter, setAssetFilter] = useState('')
  const [uploaderFilter, setUploaderFilter] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [sortKey, setSortKey] = useState<DocSortKey>('uploaded_at')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const toggleSort = (key: DocSortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir(key === 'uploaded_at' ? 'desc' : 'asc') }
  }
  const SortIcon = ({ col }: { col: DocSortKey }) => sortKey !== col
    ? <ArrowUpDown className="h-3 w-3 ml-1 opacity-40" />
    : sortDir === 'asc' ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />

  const { data: assets = [] } = trpc.assets.list.useQuery()
  const { data: teamMembers = [] } = trpc.team.listActive.useQuery()

  const queryInput = {
    ...(search ? { search } : {}),
    ...(docTypeFilter ? { documentType: docTypeFilter } : {}),
    ...(assetFilter ? { assetId: assetFilter } : {}),
    ...(uploaderFilter ? { uploadedBy: uploaderFilter } : {}),
    ...(dateFrom ? { dateFrom: new Date(dateFrom).toISOString() } : {}),
    ...(dateTo ? { dateTo: new Date(dateTo + 'T23:59:59').toISOString() } : {}),
  }

  const { data: rawDocuments = [], isLoading } = trpc.documents.list.useQuery(
    Object.keys(queryInput).length > 0 ? queryInput : undefined
  )
  const documents = useMemo(() => [...rawDocuments].sort((a, b) => {
    const av = (a as Record<string, unknown>)[sortKey]
    const bv = (b as Record<string, unknown>)[sortKey]
    if (av == null) return 1; if (bv == null) return -1
    const cmp = typeof av === 'number' && typeof bv === 'number' ? av - bv : String(av).localeCompare(String(bv))
    return sortDir === 'asc' ? cmp : -cmp
  }), [rawDocuments, sortKey, sortDir])
  const { data: stats } = trpc.documents.getStats.useQuery()
  const utils = trpc.useUtils()

  const toggleLock = trpc.documents.toggleLock.useMutation({
    onSuccess: () => { utils.documents.list.invalidate(); utils.documents.getStats.invalidate() },
  })
  const deleteDoc = trpc.documents.delete.useMutation({
    onSuccess: () => { utils.documents.list.invalidate(); utils.documents.getStats.invalidate() },
  })
  const createDoc = trpc.documents.create.useMutation({
    onSuccess: () => {
      utils.documents.list.invalidate(); utils.documents.getStats.invalidate()
      setShowUpload(false); setSelectedFile(null); setDocType('other')
    },
  })

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
    } catch (err) { console.error('Upload failed:', err) }
    setUploading(false)
  }

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const [batchDownloading, setBatchDownloading] = useState(false)

  const handleDownload = async (docId: string) => {
    try {
      const result = await utils.client.documents.getDownloadUrl.query({ documentId: docId })
      window.open(result.url, '_blank')
    } catch { /* no file in storage yet */ }
  }

  const handleBatchDownload = async () => {
    if (selectedIds.size === 0) return
    setBatchDownloading(true)
    try {
      const zip = new JSZip()
      const selected = documents.filter((d) => selectedIds.has((d as Record<string, unknown>).id as string))
      await Promise.all(selected.map(async (doc) => {
        const d = doc as Record<string, unknown>
        try {
          const result = await utils.client.documents.getDownloadUrl.query({ documentId: d.id as string })
          if (result?.url) {
            const res = await fetch(result.url)
            zip.file((d.filename ?? d.title ?? 'document') as string, await res.blob())
          }
        } catch { /* skip files without storage */ }
      }))
      saveAs(await zip.generateAsync({ type: 'blob' }), `documents-${new Date().toISOString().slice(0, 10)}.zip`)
      setSelectedIds(new Set())
    } finally {
      setBatchDownloading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
            Document Library
          </h1>
          <div className="text-sm text-[var(--text-muted)] mt-1">
            {stats
              ? `${stats.totalDocuments} documents | ${formatBytes(stats.totalSizeBytes)} used | ${stats.lockedCount} locked`
              : <NeuSkeleton variant="text" lines={1} className="w-48" />}
          </div>
        </div>
        <div className="flex gap-2">
          {selectedIds.size > 0 && (
            <NeuButton variant="ghost" icon={<Package className="h-4 w-4" />}
              onClick={handleBatchDownload} loading={batchDownloading}>
              <span className="hidden sm:inline">{selectedIds.size} selected — Download ZIP</span>
            </NeuButton>
          )}
          <NeuButton variant="ghost" icon={<Download className="h-4 w-4" />} size="sm"
            onClick={() => exportCSV('documents.csv', [
              { key: 'title', label: 'Title' }, { key: 'filename', label: 'Filename' },
              { key: 'document_type', label: 'Type' }, { key: 'file_size_bytes', label: 'Size (bytes)' },
              { key: 'uploaded_at', label: 'Uploaded' },
            ], documents as Record<string, unknown>[])}>
            <span className="hidden sm:inline">CSV</span>
          </NeuButton>
          <NeuButton icon={<Upload className="h-4 w-4" />} onClick={() => setShowUpload(!showUpload)}>
            <span className="hidden sm:inline">Upload</span>
          </NeuButton>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-2">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <NeuInput placeholder="Search documents..." icon={<Search className="h-4 w-4" />}
              value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="w-full sm:w-40">
            <NeuSelect value={docTypeFilter} onChange={(e) => setDocTypeFilter(e.target.value)} options={DOC_TYPE_OPTIONS} />
          </div>
          <div className="w-full sm:w-48">
            <NeuSelect value={assetFilter} onChange={(e) => setAssetFilter(e.target.value)}
              options={[{ value: '', label: 'All Assets' }, ...(assets as Array<{ id: string; name: string }>).map(a => ({ value: a.id, label: a.name }))]} />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="w-full sm:w-44">
            <NeuSelect value={uploaderFilter} onChange={(e) => setUploaderFilter(e.target.value)}
              options={[{ value: '', label: 'All Uploaders' }, ...(teamMembers as Array<{ id: string; full_name: string }>).map(m => ({ value: m.id, label: m.full_name }))]} />
          </div>
          <div className="w-full sm:w-40">
            <NeuInput type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} placeholder="From date" />
          </div>
          <div className="w-full sm:w-40">
            <NeuInput type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} placeholder="To date" />
          </div>
          <div className="flex-1" />
          {(assetFilter || uploaderFilter || dateFrom || dateTo || docTypeFilter) && (
            <NeuButton variant="ghost" size="sm" onClick={() => { setAssetFilter(''); setUploaderFilter(''); setDateFrom(''); setDateTo(''); setDocTypeFilter('') }}>
              Clear All
            </NeuButton>
          )}
        </div>
      </div>

      {/* Upload panel */}
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
              onDrop={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedFile(e.dataTransfer.files?.[0] ?? null) }}
              className="flex flex-col items-center justify-center gap-2 py-8 rounded-[var(--radius-md)] border-2 border-dashed border-[var(--border)] cursor-pointer hover:border-[var(--teal)] transition-colors"
            >
              <UploadCloud className="h-8 w-8 text-[var(--text-placeholder)]" />
              <p className="text-sm text-[var(--text-muted)]">Drag files here or click to browse</p>
              <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.png,.jpg,.jpeg,.webp" onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)} />
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-[var(--radius-md)] bg-[var(--bg-body)]">
                <FileText className="h-5 w-5 text-[var(--teal)] shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--text-primary)] truncate">{selectedFile.name}</p>
                  <p className="text-xs text-[var(--text-muted)]">{formatBytes(selectedFile.size)}</p>
                </div>
                <button onClick={() => setSelectedFile(null)} className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)]"><X className="h-4 w-4" /></button>
              </div>
              <NeuSelect label="Document Type" value={docType} onChange={(e) => setDocType(e.target.value)} options={DOC_TYPE_OPTIONS.filter((o) => o.value !== '')} />
              <div className="flex gap-3">
                <NeuButton variant="ghost" onClick={() => setSelectedFile(null)} fullWidth>Cancel</NeuButton>
                <NeuButton onClick={handleUpload} loading={uploading} fullWidth>Upload</NeuButton>
              </div>
            </div>
          )}
          {createDoc.error && <p className="text-sm text-[var(--ruby)]">{createDoc.error.message}</p>}
        </NeuCard>
      )}

      {/* Document table */}
      {isLoading ? (
        <div className="space-y-3 py-4"><NeuSkeleton variant="text" lines={1} /><NeuSkeleton variant="card" /><NeuSkeleton variant="text" lines={3} /></div>
      ) : documents.length === 0 ? (
        <NeuCard variant="pressed" padding="lg" className="text-center">
          <FileText className="h-12 w-12 text-[var(--text-placeholder)] mx-auto mb-3" />
          <p className="text-sm text-[var(--text-muted)]">No documents found</p>
        </NeuCard>
      ) : (
        <NeuCard variant="raised" padding="none" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--bg-body)]">
                  <th className="w-8 px-3 py-2"><span className="sr-only">Select</span></th>
                  {([
                    { key: 'title' as DocSortKey, label: 'Title', cls: '' },
                    { key: 'document_type' as DocSortKey, label: 'Type', cls: 'hidden md:table-cell' },
                    { key: null, label: 'Asset', cls: 'hidden lg:table-cell' },
                    { key: null, label: 'Uploaded By', cls: 'hidden lg:table-cell' },
                    { key: 'uploaded_at' as DocSortKey, label: 'Date', cls: 'hidden sm:table-cell' },
                    { key: 'file_size_bytes' as DocSortKey, label: 'Size', cls: 'hidden md:table-cell text-right' },
                  ]).map(({ key, label, cls }) => (
                    <th key={label} onClick={key ? () => toggleSort(key) : undefined}
                      className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] ${cls} ${key ? 'cursor-pointer hover:text-[var(--text-secondary)] select-none' : ''}`}>
                      <span className="inline-flex items-center">
                        {label}{key && <SortIcon col={key} />}
                      </span>
                    </th>
                  ))}
                  <th className="text-right px-3 py-2" />
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => {
                  const asset = doc.assets as { name: string; reference_code: string } | null
                  const uploader = doc.team_members as { full_name: string } | null
                  return (
                    <tr key={doc.id} className="border-b border-[var(--border)] hover:bg-[var(--bg-elevated)] transition-colors cursor-pointer"
                      onClick={() => setPreviewDoc(doc as Record<string, unknown>)}>
                      <td className="px-3 py-2">
                        <input type="checkbox" checked={selectedIds.has(doc.id)} onChange={() => toggleSelect(doc.id)}
                          className="rounded border-[var(--border)] accent-[var(--teal)]" />
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-1.5">
                          <p className="font-medium text-[var(--text-primary)] truncate max-w-[180px]">{doc.title}</p>
                          {Boolean((doc as Record<string, unknown>).notes) && (
                            <span title="Has notes" className="text-[var(--teal)] text-[10px] shrink-0">📝</span>
                          )}
                        </div>
                        <p className="text-xs text-[var(--text-muted)] truncate">{doc.filename}</p>
                        {Boolean((doc as Record<string, unknown>).notes) && (
                          <p className="text-[10px] text-[var(--text-muted)] truncate italic">{String((doc as Record<string, unknown>).notes)}</p>
                        )}
                      </td>
                      <td className="px-3 py-2 hidden md:table-cell">
                        <NeuBadge color="gray" size="sm">{doc.document_type}</NeuBadge>
                      </td>
                      <td className="px-3 py-2 hidden lg:table-cell">
                        {doc.asset_id && asset?.name ? (
                          <Link href={`/crm/assets/${doc.asset_id}`} onClick={(e) => e.stopPropagation()}>
                            <NeuBadge color="teal" size="sm">{asset.name}</NeuBadge>
                          </Link>
                        ) : <span className="text-[var(--text-placeholder)]">&mdash;</span>}
                      </td>
                      <td className="px-3 py-2 hidden lg:table-cell text-[var(--text-muted)]">{uploader?.full_name ?? '\u2014'}</td>
                      <td className="px-3 py-2 hidden sm:table-cell text-[var(--text-muted)]">{formatDate(doc.uploaded_at)}</td>
                      <td className="px-3 py-2 text-right hidden md:table-cell text-[var(--text-muted)]">{formatBytes(doc.file_size_bytes ?? 0)}</td>
                      <td className="px-3 py-2 text-right">
                        <div className="flex gap-1 justify-end">
                          {doc.is_locked && <Lock className="h-4 w-4 text-[var(--ruby)]" />}
                          <NeuButton variant="ghost" size="sm" onClick={() => handleDownload(doc.id)} aria-label="Download">
                            <Download className="h-4 w-4" />
                          </NeuButton>
                          <NeuButton variant="ghost" size="sm" onClick={() => toggleLock.mutate({ documentId: doc.id })} aria-label={doc.is_locked ? 'Unlock' : 'Lock'}>
                            {doc.is_locked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                          </NeuButton>
                          {!doc.is_locked && (
                            <NeuButton variant="ghost" size="sm" onClick={() => deleteDoc.mutate({ documentId: doc.id })} aria-label="Delete">
                              <Trash2 className="h-4 w-4 text-[var(--ruby)]" />
                            </NeuButton>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </NeuCard>
      )}
      {/* Preview modal */}
      <DocumentPreviewModal
        open={!!previewDoc}
        onClose={() => setPreviewDoc(null)}
        document={previewDoc}
        onUpdate={() => { utils.documents.list.invalidate(); utils.documents.getStats.invalidate(); setPreviewDoc(null) }}
      />
    </div>
  )
}
