'use client'

import { useState } from 'react'
import { FileText, Download, Trash2, Paperclip, Award, Plus, AlertTriangle } from 'lucide-react'
import { trpc } from '@/lib/trpc'
import { createClient } from '@/lib/supabase'
import { NeuCard, NeuBadge, NeuButton, NeuModal, NeuInput, NeuSelect } from '@/components/ui'
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

function isExpiringSoon(d: string | null | undefined): boolean {
  if (!d) return false
  const diff = new Date(d).getTime() - Date.now()
  return diff > 0 && diff < 60 * 86_400_000
}

function isExpired(d: string | null | undefined): boolean {
  if (!d) return false
  return new Date(d).getTime() < Date.now()
}

function fmtDate(d: string | null | undefined): string {
  if (!d) return '---'
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export function PartnerDocumentsTab({ partnerId }: PartnerDocumentsTabProps) {
  const { toast } = useToast()
  const utils = trpc.useUtils()
  const [uploading, setUploading] = useState(false)
  const [docType, setDocType] = useState('other')
  const [previewDoc, setPreviewDoc] = useState<Record<string, unknown> | null>(null)
  const [showAddCred, setShowAddCred] = useState(false)
  const [credName, setCredName] = useState('')
  const [credType, setCredType] = useState('license')
  const [issuingBody, setIssuingBody] = useState('')
  const [credNumber, setCredNumber] = useState('')
  const [issuedAt, setIssuedAt] = useState('')
  const [expiresAt, setExpiresAt] = useState('')

  const { data: docs = [] } = trpc.documents.list.useQuery({ partnerId })
  const { data: creds = [] } = trpc.partners.getCredentials.useQuery({ partnerId })

  const createDoc = trpc.documents.create.useMutation({
    onSuccess: () => { utils.documents.list.invalidate({ partnerId }); toast('Document uploaded', 'success') },
    onError: (err) => toast(err.message, 'error'),
  })
  const deleteDoc = trpc.documents.delete.useMutation({
    onSuccess: () => { utils.documents.list.invalidate({ partnerId }); toast('Document deleted', 'success') },
    onError: (err) => toast(err.message, 'error'),
  })
  const addCred = trpc.partners.addCredential.useMutation({
    onSuccess: () => { utils.partners.getCredentials.invalidate({ partnerId }); resetCred(); toast('Credential added', 'success') },
    onError: (err) => toast(err.message, 'error'),
  })
  const deleteCred = trpc.partners.deleteCredential.useMutation({
    onSuccess: () => { utils.partners.getCredentials.invalidate({ partnerId }); toast('Credential removed', 'success') },
    onError: (err) => toast(err.message, 'error'),
  })

  function resetCred() { setShowAddCred(false); setCredName(''); setIssuingBody(''); setCredNumber(''); setIssuedAt(''); setExpiresAt('') }

  async function handleUpload(file: File) {
    setUploading(true)
    try {
      const supabase = createClient()
      const path = `partners/${partnerId}/${Date.now()}-${file.name}`
      const { error: uploadError } = await supabase.storage.from('documents').upload(path, file)
      if (uploadError) throw new Error(uploadError.message)
      await createDoc.mutateAsync({
        title: file.name, filename: file.name, storagePath: path, storageBucket: 'documents',
        mimeType: file.type || 'application/octet-stream', fileSizeBytes: file.size, documentType: docType, partnerId,
      })
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Upload failed', 'error')
    } finally { setUploading(false) }
  }

  function handleFileInput() {
    const input = document.createElement('input')
    input.type = 'file'
    input.onchange = (e) => { const file = (e.target as HTMLInputElement).files?.[0]; if (file) handleUpload(file) }
    input.click()
  }

  async function handleDownload(docId: string) {
    try {
      const result = await utils.client.documents.getDownloadUrl.query({ documentId: docId })
      if (result?.url) window.open(result.url, '_blank')
    } catch { toast('Download failed', 'error') }
  }

  const typedDocs = docs as Array<Record<string, unknown>>
  const hasExpiring = creds.some((c: Record<string, unknown>) => isExpiringSoon(c.expires_at as string) || isExpired(c.expires_at as string))

  return (
    <div className="space-y-6">
      {/* ── Credentials section ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-[var(--amethyst)]" />
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Credentials ({creds.length})</h3>
            {hasExpiring && <NeuBadge color="amber" size="sm">Action needed</NeuBadge>}
          </div>
          <NeuButton icon={<Plus className="h-3.5 w-3.5" />} size="sm" variant="ghost" onClick={() => setShowAddCred(true)}>Add</NeuButton>
        </div>

        {creds.length === 0 ? (
          <p className="text-xs text-[var(--text-muted)] px-1">No credentials recorded. Add licenses, certifications, or registrations.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {creds.map((cr: Record<string, unknown>) => {
              const exp = cr.expires_at as string | null
              const expired = isExpired(exp)
              const expiring = isExpiringSoon(exp)
              return (
                <NeuCard key={cr.id as string} variant="raised-sm" padding="sm"
                  className={`group ${expired ? 'border border-[var(--ruby)] border-opacity-40' : expiring ? 'border border-[var(--amber)] border-opacity-40' : ''}`}>
                  <div className="flex items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-medium text-[var(--text-primary)] truncate">{cr.credential_name as string}</p>
                        {expired && <NeuBadge color="ruby" size="sm">Expired</NeuBadge>}
                        {expiring && !expired && <NeuBadge color="amber" size="sm"><AlertTriangle className="h-3 w-3 mr-0.5 inline" />Expiring</NeuBadge>}
                      </div>
                      <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                        {(cr.credential_type as string)?.replace(/_/g, ' ')}
                        {cr.issuing_body ? ` · ${cr.issuing_body}` : ''}
                        {cr.credential_number ? ` · #${cr.credential_number}` : ''}
                        {' · '}Exp: {fmtDate(exp)}
                      </p>
                    </div>
                    <button onClick={() => deleteCred.mutate({ credentialId: cr.id as string })}
                      className="p-1 text-[var(--text-muted)] hover:text-[var(--ruby)] transition-colors opacity-0 group-hover:opacity-100 shrink-0">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </NeuCard>
              )
            })}
          </div>
        )}
      </div>

      {/* ── Documents section ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-[var(--teal)]" />
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Documents ({typedDocs.length})</h3>
          </div>
          <div className="flex items-center gap-2">
            <select value={docType} onChange={(e) => setDocType(e.target.value)}
              className="h-7 text-[11px] rounded-[var(--radius-sm)] px-2 bg-[var(--bg-input)] text-[var(--text-secondary)] shadow-[var(--shadow-pressed)] border border-[var(--border)] focus:outline-none focus:border-[var(--teal)]">
              {DOCUMENT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
            <NeuButton size="sm" icon={<Paperclip className="h-3.5 w-3.5" />} loading={uploading} onClick={handleFileInput}>Upload</NeuButton>
          </div>
        </div>

        {typedDocs.length === 0 ? (
          <p className="text-xs text-[var(--text-muted)] px-1">No documents uploaded yet.</p>
        ) : (
          <div className="space-y-2">
            {typedDocs.map((doc) => (
              <NeuCard key={doc.id as string} variant="raised-sm" padding="sm"
                className="flex items-center gap-3 cursor-pointer group" onClick={() => setPreviewDoc(doc)}>
                <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-[var(--bg-input)] shadow-[var(--shadow-pressed)] flex items-center justify-center shrink-0">
                  <FileText className="h-4 w-4 text-[var(--text-muted)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--text-primary)] truncate">{(doc.title ?? doc.filename) as string}</p>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    {doc.document_type as string}
                    {doc.file_size_bytes ? ` · ${formatBytes(doc.file_size_bytes as number)}` : ''}
                    {doc.uploaded_at ? ` · ${new Date(doc.uploaded_at as string).toLocaleDateString()}` : ''}
                  </p>
                </div>
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
      </div>

      {/* ── Modals ── */}
      <DocumentPreviewModal open={!!previewDoc} onClose={() => setPreviewDoc(null)}
        document={previewDoc} onUpdate={() => { utils.documents.list.invalidate({ partnerId }); setPreviewDoc(null) }} />

      <NeuModal open={showAddCred} onClose={resetCred} title="Add Credential" maxWidth="md">
        <div className="space-y-3">
          <NeuInput label="Name *" value={credName} onChange={(e) => setCredName(e.target.value)} placeholder="e.g. SEC Broker-Dealer License" />
          <NeuSelect label="Type" value={credType} onChange={(e) => setCredType(e.target.value)}
            options={[{ value: 'license', label: 'License' }, { value: 'certification', label: 'Certification' }, { value: 'registration', label: 'Registration' }, { value: 'insurance', label: 'Insurance' }, { value: 'other', label: 'Other' }]} />
          <NeuInput label="Issuing Body" value={issuingBody} onChange={(e) => setIssuingBody(e.target.value)} placeholder="SEC, FINRA, etc." />
          <NeuInput label="Credential Number" value={credNumber} onChange={(e) => setCredNumber(e.target.value)} placeholder="Optional" />
          <div className="grid grid-cols-2 gap-3">
            <NeuInput label="Issued" type="date" value={issuedAt} onChange={(e) => setIssuedAt(e.target.value)} />
            <NeuInput label="Expires" type="date" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} />
          </div>
          <div className="flex gap-3 pt-2">
            <NeuButton variant="ghost" onClick={resetCred} fullWidth>Cancel</NeuButton>
            <NeuButton loading={addCred.isPending} disabled={!credName.trim()} fullWidth
              onClick={() => addCred.mutate({ partnerId, credentialName: credName.trim(), credentialType: credType, issuingBody: issuingBody || undefined, credentialNumber: credNumber || undefined, issuedAt: issuedAt || undefined, expiresAt: expiresAt || undefined })}>
              Add
            </NeuButton>
          </div>
        </div>
      </NeuModal>
    </div>
  )
}
