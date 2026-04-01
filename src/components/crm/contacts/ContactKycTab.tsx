'use client'

import { useState } from 'react'
import { trpc } from '@/lib/trpc'
import { NeuCard, NeuBadge, NeuButton, NeuModal, NeuInput, NeuSelect, NeuSkeleton } from '@/components/ui'
import { Plus, ShieldCheck } from 'lucide-react'

const KYC_STATUS_COLOR: Record<string, 'gray' | 'amber' | 'teal' | 'chartreuse' | 'ruby'> = {
  pending: 'amber',
  passed: 'chartreuse',
  failed: 'ruby',
  expired: 'ruby',
  waived: 'gray',
}

function formatDate(date: string | null | undefined): string {
  if (!date) return '---'
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export function ContactKycTab({ contactId }: { contactId: string }) {
  const [showAdd, setShowAdd] = useState(false)
  const [checkType, setCheckType] = useState('')
  const [provider, setProvider] = useState('')
  const [status, setStatus] = useState<'pending' | 'passed' | 'failed'>('pending')

  const { data: records = [], isLoading } = trpc.kyc.listByContact.useQuery({ contactId })
  const utils = trpc.useUtils()
  const createMut = trpc.kyc.create.useMutation({
    onSuccess: () => {
      utils.kyc.listByContact.invalidate({ contactId })
      utils.contacts.getById.invalidate({ contactId })
      setShowAdd(false)
      setCheckType('')
      setProvider('')
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
          KYC Records ({records.length})
        </h3>
        <NeuButton icon={<Plus className="h-4 w-4" />} size="sm" onClick={() => setShowAdd(true)}>
          Add Check
        </NeuButton>
      </div>

      {records.length === 0 ? (
        <NeuCard variant="pressed" padding="lg" className="text-center">
          <ShieldCheck className="h-10 w-10 text-[var(--text-placeholder)] mx-auto mb-3" />
          <p className="text-sm text-[var(--text-muted)]">No KYC records yet</p>
        </NeuCard>
      ) : (
        <div className="space-y-2">
          {records.map((r: Record<string, unknown>) => {
            const st = (r.status as string) ?? 'pending'
            return (
              <NeuCard key={r.id as string} variant="raised" padding="md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-[var(--text-primary)]">
                      {(r.check_type as string) ?? '---'}
                    </p>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">
                      {(r.provider as string) || 'No provider'} &middot; {formatDate(r.performed_at as string)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {(r.expires_at as string) && (
                      <span className="text-xs text-[var(--text-muted)]">
                        Exp: {formatDate(r.expires_at as string)}
                      </span>
                    )}
                    <NeuBadge color={KYC_STATUS_COLOR[st] ?? 'gray'} size="sm">
                      {st.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                    </NeuBadge>
                  </div>
                </div>
              </NeuCard>
            )
          })}
        </div>
      )}

      {/* Add KYC Modal */}
      <NeuModal open={showAdd} onClose={() => setShowAdd(false)} title="Add KYC Check">
        <div className="space-y-4">
          <NeuInput label="Check Type" value={checkType} onChange={(e) => setCheckType(e.target.value)} placeholder="e.g. Identity Verification, AML Screen" />
          <NeuInput label="Provider" value={provider} onChange={(e) => setProvider(e.target.value)} placeholder="e.g. Jumio, LexisNexis" />
          <NeuSelect
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value as 'pending' | 'passed' | 'failed')}
            options={[
              { value: 'pending', label: 'Pending' },
              { value: 'passed', label: 'Passed' },
              { value: 'failed', label: 'Failed' },
            ]}
          />
          <div className="flex justify-end gap-2 pt-2">
            <NeuButton variant="ghost" onClick={() => setShowAdd(false)}>Cancel</NeuButton>
            <NeuButton
              loading={createMut.isPending}
              disabled={!checkType.trim()}
              onClick={() => createMut.mutate({
                contactId,
                checkType: checkType.trim(),
                provider: provider || undefined,
                status,
              })}
            >
              Create
            </NeuButton>
          </div>
        </div>
      </NeuModal>
    </div>
  )
}
