'use client'

import { useState } from 'react'
import { trpc } from '@/lib/trpc'
import { NeuCard, NeuBadge, NeuButton, NeuModal, NeuInput, NeuSelect, NeuSkeleton } from '@/components/ui'
import { useToast } from '@/components/ui/NeuToast'
import { Plus, Award, AlertTriangle, Trash2 } from 'lucide-react'

function formatDate(date: string | null | undefined): string {
  if (!date) return '---'
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function isExpiringSoon(expiresAt: string | null | undefined): boolean {
  if (!expiresAt) return false
  const diff = new Date(expiresAt).getTime() - Date.now()
  return diff > 0 && diff < 60 * 86_400_000 // 60 days
}

function isExpired(expiresAt: string | null | undefined): boolean {
  if (!expiresAt) return false
  return new Date(expiresAt).getTime() < Date.now()
}

export function PartnerCredentialsTab({ partnerId }: { partnerId: string }) {
  const [showAdd, setShowAdd] = useState(false)
  const [credName, setCredName] = useState('')
  const [credType, setCredType] = useState('license')
  const [issuingBody, setIssuingBody] = useState('')
  const [credNumber, setCredNumber] = useState('')
  const [issuedAt, setIssuedAt] = useState('')
  const [expiresAt, setExpiresAt] = useState('')

  const { data: creds = [], isLoading } = trpc.partners.getCredentials.useQuery({ partnerId })
  const utils = trpc.useUtils()
  const { toast } = useToast()

  const deleteMut = trpc.partners.deleteCredential.useMutation({
    onSuccess: () => { utils.partners.getCredentials.invalidate({ partnerId }); utils.partners.getById.invalidate({ partnerId }); toast('Credential removed', 'success') },
    onError: (err) => toast(err.message, 'error'),
  })
  const addMut = trpc.partners.addCredential.useMutation({
    onSuccess: () => {
      utils.partners.getCredentials.invalidate({ partnerId })
      utils.partners.getById.invalidate({ partnerId })
      setShowAdd(false)
      setCredName('')
      setIssuingBody('')
      setCredNumber('')
      setIssuedAt('')
      setExpiresAt('')
    },
  })

  if (isLoading) {
    return (
      <NeuSkeleton variant="text" lines={3} />
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">
          Credentials ({creds.length})
        </h3>
        <NeuButton icon={<Plus className="h-4 w-4" />} size="sm" onClick={() => setShowAdd(true)}>
          Add Credential
        </NeuButton>
      </div>

      {creds.length === 0 ? (
        <NeuCard variant="pressed" padding="lg" className="text-center">
          <Award className="h-10 w-10 text-[var(--text-placeholder)] mx-auto mb-3" />
          <p className="text-sm text-[var(--text-muted)]">No credentials recorded</p>
        </NeuCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {creds.map((cr: Record<string, unknown>) => {
            const exp = cr.expires_at as string | null
            const expiring = isExpiringSoon(exp)
            const expired = isExpired(exp)
            return (
              <NeuCard
                key={cr.id as string}
                variant="raised"
                padding="md"
                className={`group ${expired ? 'border border-[var(--ruby)] border-opacity-40' : expiring ? 'border border-[var(--amber)] border-opacity-40' : ''}`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <p className="font-medium text-sm text-[var(--text-primary)]">
                      {cr.credential_name as string}
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {(cr.credential_type as string)?.replace(/_/g, ' ')}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                  {expired && <NeuBadge color="ruby" size="sm">Expired</NeuBadge>}
                  {expiring && !expired && (
                    <NeuBadge color="amber" size="sm">
                      <AlertTriangle className="h-3 w-3 mr-1 inline" />Expiring
                    </NeuBadge>
                  )}
                  <button onClick={() => deleteMut.mutate({ credentialId: cr.id as string })}
                    aria-label="Remove credential"
                    className="p-1 text-[var(--text-muted)] hover:text-[var(--ruby)] transition-colors opacity-0 group-hover:opacity-100">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
                </div>
                <dl className="space-y-1.5 text-xs">
                  {(cr.issuing_body as string) && (
                    <div className="flex justify-between">
                      <dt className="text-[var(--text-muted)]">Issuing Body</dt>
                      <dd className="text-[var(--text-primary)]">{cr.issuing_body as string}</dd>
                    </div>
                  )}
                  {(cr.credential_number as string) && (
                    <div className="flex justify-between">
                      <dt className="text-[var(--text-muted)]">Number</dt>
                      <dd className="text-[var(--text-primary)] font-mono">{cr.credential_number as string}</dd>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <dt className="text-[var(--text-muted)]">Issued</dt>
                    <dd className="text-[var(--text-primary)]">{formatDate(cr.issued_at as string)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-[var(--text-muted)]">Expires</dt>
                    <dd className={expired ? 'text-[var(--ruby)] font-semibold' : expiring ? 'text-[var(--amber)] font-semibold' : 'text-[var(--text-primary)]'}>
                      {formatDate(exp)}
                    </dd>
                  </div>
                </dl>
              </NeuCard>
            )
          })}
        </div>
      )}

      {/* Add Credential Modal */}
      <NeuModal open={showAdd} onClose={() => setShowAdd(false)} title="Add Credential" maxWidth="lg">
        <div className="space-y-4">
          <NeuInput label="Credential Name" value={credName} onChange={(e) => setCredName(e.target.value)} placeholder="e.g. SEC Broker-Dealer License" />
          <NeuSelect
            label="Type"
            value={credType}
            onChange={(e) => setCredType(e.target.value)}
            options={[
              { value: 'license', label: 'License' },
              { value: 'certification', label: 'Certification' },
              { value: 'registration', label: 'Registration' },
              { value: 'insurance', label: 'Insurance' },
              { value: 'other', label: 'Other' },
            ]}
          />
          <NeuInput label="Issuing Body" value={issuingBody} onChange={(e) => setIssuingBody(e.target.value)} placeholder="e.g. SEC, FINRA, State of Delaware" />
          <NeuInput label="Credential Number" value={credNumber} onChange={(e) => setCredNumber(e.target.value)} placeholder="Optional" />
          <div className="grid grid-cols-2 gap-3">
            <NeuInput label="Issued Date" type="date" value={issuedAt} onChange={(e) => setIssuedAt(e.target.value)} />
            <NeuInput label="Expires Date" type="date" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <NeuButton variant="ghost" onClick={() => setShowAdd(false)}>Cancel</NeuButton>
            <NeuButton
              loading={addMut.isPending}
              disabled={!credName.trim()}
              onClick={() => addMut.mutate({
                partnerId,
                credentialName: credName.trim(),
                credentialType: credType,
                issuingBody: issuingBody || undefined,
                credentialNumber: credNumber || undefined,
                issuedAt: issuedAt || undefined,
                expiresAt: expiresAt || undefined,
              })}
            >
              Add
            </NeuButton>
          </div>
        </div>
      </NeuModal>
    </div>
  )
}
