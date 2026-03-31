'use client'

import { CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { trpc } from '@/lib/trpc'
import { NeuCard } from '@/components/ui/NeuCard'
import { NeuButton } from '@/components/ui/NeuButton'
import { NeuProgress } from '@/components/ui/NeuProgress'
import { useToast } from '@/components/ui/NeuToast'

const STAGE_LABELS: Record<string, string> = {
  identity: 'Identity', screening: 'Screening', accreditation: 'Accreditation',
  documents: 'Documents', approval: 'Approval', general: 'General',
}

interface ContactOnboardingChecklistProps {
  contactId: string
  contact: Record<string, unknown>
  kycRecords?: Array<Record<string, unknown>>
}

export function ContactOnboardingChecklist({ contactId, contact }: ContactOnboardingChecklistProps) {
  const { toast } = useToast()
  const utils = trpc.useUtils()
  const { data: items = [] } = trpc.contacts.getOnboardingItems.useQuery({ contactId })

  const updateMut = trpc.contacts.updateOnboardingItem.useMutation({
    onSuccess: () => { utils.contacts.getOnboardingItems.invalidate({ contactId }); toast('Item verified', 'success') },
    onError: (err) => toast(err.message, 'error'),
  })

  const typedItems = items as Array<Record<string, unknown>>
  const done = typedItems.filter(i => i.status === 'verified').length
  const total = typedItems.length
  const pct = total > 0 ? Math.round((done / total) * 100) : 0

  // If no template items, show basic KYC status
  if (total === 0) {
    const kyc = (contact.kyc_status as string) ?? 'not_started'
    return (
      <NeuCard variant="pressed" padding="md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Compliance Status</span>
          <span className="text-xs text-[var(--text-muted)]">{kyc === 'verified' ? 'Verified' : 'Pending'}</span>
        </div>
      </NeuCard>
    )
  }

  // Group by stage
  const stageOrder = ['identity', 'screening', 'accreditation', 'documents', 'approval', 'general']
  const grouped = new Map<string, Array<Record<string, unknown>>>()
  for (const item of typedItems) {
    const stage = (item.stage as string) ?? 'general'
    if (!grouped.has(stage)) grouped.set(stage, [])
    grouped.get(stage)!.push(item)
  }

  const statusIcons = {
    verified: <CheckCircle className="h-4 w-4 text-[var(--chartreuse)]" />,
    pending: <AlertCircle className="h-4 w-4 text-[var(--amber)]" />,
    not_started: <XCircle className="h-4 w-4 text-[var(--ruby)]" />,
  }

  return (
    <NeuCard variant="pressed" padding="md">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Compliance Checklist</span>
        <span className="text-xs text-[var(--text-muted)]">{done}/{total} complete</span>
      </div>
      <NeuProgress value={pct} color={pct === 100 ? 'emerald' : 'teal'} />

      <div className="mt-3 space-y-3">
        {stageOrder.filter(s => grouped.has(s)).map((stage) => {
          const stageItems = grouped.get(stage)!
          const stageDone = stageItems.filter(i => i.status === 'verified').length
          return (
            <div key={stage}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">{STAGE_LABELS[stage] ?? stage}</span>
                <span className="text-[10px] text-[var(--text-muted)]">{stageDone}/{stageItems.length}</span>
              </div>
              {stageItems.map((item) => {
                const st = (item.status as string) ?? 'pending'
                const icon = st === 'verified' ? statusIcons.verified : st === 'pending' ? statusIcons.pending : statusIcons.not_started
                return (
                  <div key={item.id as string} className="flex items-center gap-2 py-0.5">
                    {icon}
                    <span className="text-sm flex-1 text-[var(--text-primary)]">{item.item_name as string}</span>
                    {st !== 'verified' && (
                      <NeuButton variant="ghost" size="sm" loading={updateMut.isPending}
                        onClick={() => updateMut.mutate({ itemId: item.id as string, status: 'verified' })}
                        className="!h-5 !px-1.5 text-[10px] text-[var(--teal)]">
                        Verify
                      </NeuButton>
                    )}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </NeuCard>
  )
}
