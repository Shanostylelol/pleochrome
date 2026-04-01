'use client'

import { useState } from 'react'
import { CheckCircle, XCircle, AlertCircle, Plus, Trash2, X } from 'lucide-react'
import { NeuConfirmDialog } from '@/components/ui/NeuConfirmDialog'
import { trpc } from '@/lib/trpc'
import { NeuCard } from '@/components/ui/NeuCard'
import { NeuButton } from '@/components/ui/NeuButton'
import { NeuProgress } from '@/components/ui/NeuProgress'
import { NeuSelect } from '@/components/ui/NeuSelect'
import { useToast } from '@/components/ui/NeuToast'

const STAGE_LABELS: Record<string, string> = {
  identity: 'Identity', screening: 'Screening', accreditation: 'Accreditation',
  documents: 'Documents', approval: 'Approval', general: 'General',
}
const STAGE_ORDER = ['identity', 'screening', 'accreditation', 'documents', 'approval', 'general']
const ITEM_TYPE_OPTIONS = [
  { value: 'verification', label: 'Verification' }, { value: 'document', label: 'Document' },
  { value: 'compliance', label: 'Compliance' }, { value: 'other', label: 'Other' },
]

interface ContactOnboardingChecklistProps {
  contactId: string
  contact: Record<string, unknown>
  kycRecords?: Array<Record<string, unknown>>
}

export function ContactOnboardingChecklist({ contactId, contact }: ContactOnboardingChecklistProps) {
  const [addingInStage, setAddingInStage] = useState<string | null>(null)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)
  const [newName, setNewName] = useState('')
  const [newType, setNewType] = useState('verification')
  const { toast } = useToast()
  const utils = trpc.useUtils()
  const { data: items = [] } = trpc.contacts.getOnboardingItems.useQuery({ contactId })

  const updateMut = trpc.contacts.updateOnboardingItem.useMutation({
    onSuccess: () => { utils.contacts.getOnboardingItems.invalidate({ contactId }); toast('Item verified', 'success') },
    onError: (err) => toast(err.message, 'error'),
  })
  const createMut = trpc.contacts.createOnboardingItem.useMutation({
    onSuccess: () => {
      utils.contacts.getOnboardingItems.invalidate({ contactId })
      setAddingInStage(null); setNewName(''); setNewType('verification')
      toast('Item added', 'success')
    },
    onError: (err) => toast(err.message, 'error'),
  })
  const deleteMut = trpc.contacts.deleteOnboardingItem.useMutation({
    onSuccess: () => { utils.contacts.getOnboardingItems.invalidate({ contactId }); toast('Item removed', 'success') },
    onError: (err) => toast(err.message, 'error'),
  })

  const typedItems = items as Array<Record<string, unknown>>
  const done = typedItems.filter(i => i.status === 'verified').length
  const total = typedItems.length
  const pct = total > 0 ? Math.round((done / total) * 100) : 0

  // If no template items and not adding, show basic KYC status with Add button
  if (total === 0 && !addingInStage) {
    const kyc = (contact.kyc_status as string) ?? 'not_started'
    return (
      <NeuCard variant="pressed" padding="md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Compliance Status</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--text-muted)]">{kyc === 'verified' ? 'Verified' : 'Pending'}</span>
            <NeuButton variant="ghost" size="sm" icon={<Plus className="h-3 w-3" />}
              onClick={() => setAddingInStage('identity')} className="!h-5 !px-1.5 text-[10px]">Add Step</NeuButton>
          </div>
        </div>
      </NeuCard>
    )
  }

  // Group by stage
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

  const visibleStages = STAGE_ORDER.filter(s => grouped.has(s) || addingInStage === s)

  return (
    <NeuCard variant="pressed" padding="md">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Compliance Checklist</span>
        <span className="text-xs text-[var(--text-muted)]">{done}/{total} complete</span>
      </div>
      <NeuProgress value={pct} color={pct === 100 ? 'emerald' : 'teal'} />

      <div className="mt-3 space-y-3">
        {visibleStages.map((stage) => {
          const stageItems = grouped.get(stage) ?? []
          const stageDone = stageItems.filter(i => i.status === 'verified').length
          const isAddingHere = addingInStage === stage
          return (
            <div key={stage}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">{STAGE_LABELS[stage] ?? stage}</span>
                {stageItems.length > 0 && <span className="text-[10px] text-[var(--text-muted)]">{stageDone}/{stageItems.length}</span>}
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
                    <button onClick={() => setPendingDeleteId(item.id as string)}
                      className="p-0.5 text-[var(--text-muted)] hover:text-[var(--ruby)] transition-colors shrink-0" title="Remove">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                )
              })}

              {/* Inline add at bottom of each stage */}
              {isAddingHere ? (
                <div className="flex items-center gap-2 pt-1 mt-1 border-t border-[var(--border)]">
                  <NeuSelect value={newType} onChange={(e) => setNewType(e.target.value)}
                    className="!w-28 shrink-0" options={ITEM_TYPE_OPTIONS} />
                  <input
                    autoFocus
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newName.trim()) {
                        createMut.mutate({ contactId, itemName: newName.trim(), itemType: newType, stage })
                      }
                      if (e.key === 'Escape') { setAddingInStage(null); setNewName('') }
                    }}
                    placeholder="Item name..."
                    className="flex-1 h-6 text-xs rounded-[var(--radius-sm)] px-2 bg-[var(--bg-input)] text-[var(--text-primary)] shadow-[var(--shadow-pressed)] border border-[var(--border)] focus:outline-none focus:border-[var(--teal)] placeholder:text-[var(--text-placeholder)]"
                  />
                  <button onClick={() => { setAddingInStage(null); setNewName('') }}
                    className="p-0.5 text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { setAddingInStage(stage); setNewName(''); setNewType('verification') }}
                  className="flex items-center gap-1 text-[10px] text-[var(--text-muted)] hover:text-[var(--teal)] transition-colors pt-1 mt-0.5"
                >
                  <Plus className="h-2.5 w-2.5" /> Add Item
                </button>
              )}
            </div>
          )
        })}
      </div>
      <NeuConfirmDialog
        open={!!pendingDeleteId}
        onClose={() => setPendingDeleteId(null)}
        onConfirm={() => { if (pendingDeleteId) deleteMut.mutate({ itemId: pendingDeleteId }); setPendingDeleteId(null) }}
        title="Remove Onboarding Item"
        message="Remove this item from the checklist?"
        confirmLabel="Remove"
        variant="danger"
        loading={deleteMut.isPending}
      />
    </NeuCard>
  )
}
