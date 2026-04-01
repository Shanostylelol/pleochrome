'use client'

import { useState, useMemo } from 'react'
import { trpc } from '@/lib/trpc'
import { NeuCard, NeuBadge, NeuButton, NeuSelect, NeuConfirmDialog, NeuSkeleton } from '@/components/ui'
import { NeuProgress } from '@/components/ui/NeuProgress'
import { useToast } from '@/components/ui/NeuToast'
import { Plus, ClipboardCheck, Check, ChevronDown, ChevronRight, Trash2, X } from 'lucide-react'
import { ComplianceBadge } from '@/components/crm/ComplianceBadge'

const STAGE_ORDER = ['discovery', 'due_diligence', 'contracting', 'integration', 'approval', 'general']
const STAGE_LABELS: Record<string, string> = {
  discovery: 'Discovery', due_diligence: 'Due Diligence', contracting: 'Contracting',
  integration: 'Integration', approval: 'Approval', general: 'General',
}
const ITEM_TYPE_OPTIONS = [
  { value: 'document', label: 'Document' }, { value: 'verification', label: 'Verification' },
  { value: 'reference', label: 'Reference' }, { value: 'compliance', label: 'Compliance' },
  { value: 'communication', label: 'Communication' }, { value: 'other', label: 'Other' },
]

export function PartnerOnboardingTab({ partnerId, partnerType }: { partnerId: string; partnerType?: string }) {
  const [expandedStages, setExpandedStages] = useState<Set<string>>(new Set(STAGE_ORDER))
  const [addingInStage, setAddingInStage] = useState<string | null>(null)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)
  const [newItemName, setNewItemName] = useState('')
  const [newItemType, setNewItemType] = useState('document')
  const { toast } = useToast()
  const utils = trpc.useUtils()

  const { data: items = [], isLoading } = trpc.partners.getOnboardingItems.useQuery({ partnerId })

  const createMut = trpc.partners.createOnboardingItem.useMutation({
    onSuccess: () => {
      utils.partners.getOnboardingItems.invalidate({ partnerId })
      setAddingInStage(null); setNewItemName(''); setNewItemType('document')
      toast('Item added', 'success')
    },
    onError: (err) => toast(err.message, 'error'),
  })
  const updateMut = trpc.partners.updateOnboardingItem.useMutation({
    onSuccess: () => { utils.partners.getOnboardingItems.invalidate({ partnerId }); toast('Item verified', 'success') },
    onError: (err) => toast(err.message, 'error'),
  })
  const deleteMut = trpc.partners.deleteOnboardingItem.useMutation({
    onSuccess: () => { utils.partners.getOnboardingItems.invalidate({ partnerId }); toast('Item removed', 'success') },
    onError: (err) => toast(err.message, 'error'),
  })
  const applyTemplateMut = trpc.partners.applyOnboardingTemplate.useMutation({
    onSuccess: () => { utils.partners.getOnboardingItems.invalidate({ partnerId }); toast('Template applied', 'success') },
    onError: (err) => toast(err.message, 'error'),
  })

  const grouped = useMemo(() => {
    const map = new Map<string, Array<Record<string, unknown>>>()
    for (const item of items as Array<Record<string, unknown>>) {
      const stage = (item.stage as string) ?? 'general'
      if (!map.has(stage)) map.set(stage, [])
      map.get(stage)!.push(item)
    }
    // Include all stages that have items OR are in the standard order (so empty stages still show + Add Item)
    return STAGE_ORDER.map(s => ({ stage: s, label: STAGE_LABELS[s] ?? s, items: map.get(s) ?? [] }))
      .filter(g => g.items.length > 0 || addingInStage === g.stage)
  }, [items, addingInStage])

  const totalItems = (items as Array<Record<string, unknown>>).length
  const verifiedItems = (items as Array<Record<string, unknown>>).filter(i => i.status === 'verified').length
  const pct = totalItems > 0 ? Math.round((verifiedItems / totalItems) * 100) : 0

  const { data: templates = [] } = trpc.partners.getOnboardingTemplates.useQuery(
    partnerType ? { partnerType } : undefined,
    { enabled: totalItems === 0 }
  )

  const toggleStage = (stage: string) => {
    const next = new Set(expandedStages)
    next.has(stage) ? next.delete(stage) : next.add(stage)
    setExpandedStages(next)
  }

  if (isLoading) return <NeuSkeleton variant="text" lines={3} />

  return (
    <div className="space-y-4">
      {/* Header + progress */}
      <div>
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">Onboarding Progress</h3>
        <p className="text-xs text-[var(--text-muted)]">{verifiedItems}/{totalItems} items verified</p>
      </div>
      <NeuProgress value={pct} color={pct === 100 ? 'emerald' : 'teal'} />

      {/* Staged items */}
      {totalItems === 0 && !addingInStage ? (
        <NeuCard variant="pressed" padding="lg" className="text-center">
          <ClipboardCheck className="h-10 w-10 text-[var(--text-placeholder)] mx-auto mb-3" />
          <p className="text-sm text-[var(--text-muted)] mb-3">No onboarding items yet</p>
          <div className="flex items-center justify-center gap-2">
            {(templates as Array<Record<string, unknown>>).length > 0 && (
              <NeuButton size="sm" loading={applyTemplateMut.isPending}
                onClick={() => applyTemplateMut.mutate({ partnerId, templateId: (templates as Array<Record<string, unknown>>)[0].id as string })}>
                Apply Default Template
              </NeuButton>
            )}
            <NeuButton variant="ghost" size="sm" icon={<Plus className="h-3.5 w-3.5" />}
              onClick={() => { setAddingInStage('discovery'); setExpandedStages(new Set(STAGE_ORDER)) }}>
              Add Custom Item
            </NeuButton>
          </div>
        </NeuCard>
      ) : (
        <div className="space-y-3">
          {grouped.map(({ stage, label, items: stageItems }) => {
            const stageVerified = stageItems.filter(i => i.status === 'verified').length
            const stageTotal = stageItems.length
            const allDone = stageTotal > 0 && stageVerified === stageTotal
            const expanded = expandedStages.has(stage)
            const isAddingHere = addingInStage === stage
            return (
              <NeuCard key={stage} variant="pressed" padding="sm">
                <button onClick={() => toggleStage(stage)} className="flex items-center gap-2 w-full text-left py-1">
                  {expanded ? <ChevronDown className="h-3.5 w-3.5 text-[var(--text-muted)]" /> : <ChevronRight className="h-3.5 w-3.5 text-[var(--text-muted)]" />}
                  <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] flex-1">{label}</span>
                  {stageTotal > 0 && <ComplianceBadge kycStatus={allDone ? 'verified' : stageVerified > 0 ? 'pending' : 'not_started'} size="sm" />}
                  <span className="text-[10px] text-[var(--text-muted)]">{stageVerified}/{stageTotal}</span>
                </button>
                {expanded && (
                  <div className="mt-2 space-y-1.5 ml-5">
                    {stageItems.map((item) => {
                      const st = (item.status as string) ?? 'pending'
                      return (
                        <div key={item.id as string} className="flex items-center gap-2 py-1">
                          {st === 'verified' ? (
                            <Check className="h-4 w-4 text-[var(--chartreuse)] shrink-0" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-[var(--border)] shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-[var(--text-primary)]">{item.item_name as string}</p>
                            {typeof item.description === 'string' && <p className="text-[10px] text-[var(--text-muted)] truncate">{item.description}</p>}
                          </div>
                          <NeuBadge color={st === 'verified' ? 'chartreuse' : st === 'rejected' ? 'ruby' : 'gray'} size="sm">
                            {(item.item_type as string).replace(/_/g, ' ')}
                          </NeuBadge>
                          {st !== 'verified' && (
                            <NeuButton variant="ghost" size="sm" loading={updateMut.isPending}
                              onClick={() => updateMut.mutate({ itemId: item.id as string, status: 'verified' })}
                              className="!h-6 !px-2 text-[var(--teal)]">
                              Verify
                            </NeuButton>
                          )}
                          <button onClick={() => setPendingDeleteId(item.id as string)}
                            className="p-1 text-[var(--text-muted)] hover:text-[var(--ruby)] transition-colors shrink-0" title="Remove item">
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      )
                    })}

                    {/* Inline add form at bottom of stage */}
                    {isAddingHere ? (
                      <div className="flex items-center gap-2 pt-1 border-t border-[var(--border)] mt-1">
                        <NeuSelect value={newItemType} onChange={(e) => setNewItemType(e.target.value)}
                          className="!w-32 shrink-0" options={ITEM_TYPE_OPTIONS} />
                        <input
                          autoFocus
                          value={newItemName}
                          onChange={(e) => setNewItemName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && newItemName.trim()) {
                              createMut.mutate({ partnerId, itemName: newItemName.trim(), itemType: newItemType, stage })
                            }
                            if (e.key === 'Escape') { setAddingInStage(null); setNewItemName('') }
                          }}
                          placeholder="Item name..."
                          className="flex-1 h-7 text-sm rounded-[var(--radius-sm)] px-2 bg-[var(--bg-input)] text-[var(--text-primary)] shadow-[var(--shadow-pressed)] border border-[var(--border)] focus:outline-none focus:border-[var(--teal)] placeholder:text-[var(--text-placeholder)]"
                        />
                        <button onClick={() => { setAddingInStage(null); setNewItemName('') }}
                          className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => { setAddingInStage(stage); setNewItemName(''); setNewItemType('document') }}
                        className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--teal)] transition-colors pt-1 mt-1"
                      >
                        <Plus className="h-3 w-3" /> Add Item
                      </button>
                    )}
                  </div>
                )}
              </NeuCard>
            )
          })}
        </div>
      )}
      <NeuConfirmDialog
        open={!!pendingDeleteId}
        onClose={() => setPendingDeleteId(null)}
        onConfirm={() => { if (pendingDeleteId) deleteMut.mutate({ itemId: pendingDeleteId }); setPendingDeleteId(null) }}
        title="Remove Onboarding Item"
        message="Remove this item from the onboarding checklist?"
        confirmLabel="Remove"
        variant="danger"
        loading={deleteMut.isPending}
      />
    </div>
  )
}
