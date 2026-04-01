'use client'

import { useState, useMemo } from 'react'
import { trpc } from '@/lib/trpc'
import { NeuCard, NeuBadge, NeuButton, NeuModal, NeuInput, NeuSelect } from '@/components/ui'
import { NeuProgress } from '@/components/ui/NeuProgress'
import { useToast } from '@/components/ui/NeuToast'
import { Plus, ClipboardCheck, Check, ChevronDown, ChevronRight } from 'lucide-react'
import { ComplianceBadge } from '@/components/crm/ComplianceBadge'

const STAGE_ORDER = ['discovery', 'due_diligence', 'contracting', 'integration', 'approval', 'general']
const STAGE_LABELS: Record<string, string> = {
  discovery: 'Discovery', due_diligence: 'Due Diligence', contracting: 'Contracting',
  integration: 'Integration', approval: 'Approval', general: 'General',
}

export function PartnerOnboardingTab({ partnerId, partnerType }: { partnerId: string; partnerType?: string }) {
  const [showAdd, setShowAdd] = useState(false)
  const [itemName, setItemName] = useState('')
  const [itemType, setItemType] = useState('document')
  const [itemStage, setItemStage] = useState('general')
  const [description, setDescription] = useState('')
  const [expandedStages, setExpandedStages] = useState<Set<string>>(new Set(STAGE_ORDER))
  const { toast } = useToast()
  const utils = trpc.useUtils()

  const { data: items = [], isLoading } = trpc.partners.getOnboardingItems.useQuery({ partnerId })

  const createMut = trpc.partners.createOnboardingItem.useMutation({
    onSuccess: () => { utils.partners.getOnboardingItems.invalidate({ partnerId }); setShowAdd(false); setItemName(''); setDescription(''); toast('Item added', 'success') },
    onError: (err) => toast(err.message, 'error'),
  })
  const updateMut = trpc.partners.updateOnboardingItem.useMutation({
    onSuccess: () => { utils.partners.getOnboardingItems.invalidate({ partnerId }); toast('Item verified', 'success') },
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
    return STAGE_ORDER.filter(s => map.has(s)).map(s => ({ stage: s, label: STAGE_LABELS[s] ?? s, items: map.get(s)! }))
  }, [items])

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

  if (isLoading) return <NeuCard variant="raised" padding="lg" className="text-center"><p className="text-sm text-[var(--text-muted)]">Loading...</p></NeuCard>

  return (
    <div className="space-y-4">
      {/* Header + progress */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Onboarding Progress</h3>
          <p className="text-xs text-[var(--text-muted)]">{verifiedItems}/{totalItems} items verified</p>
        </div>
        <NeuButton icon={<Plus className="h-4 w-4" />} size="sm" onClick={() => setShowAdd(true)}>Add Item</NeuButton>
      </div>
      <NeuProgress value={pct} color={pct === 100 ? 'emerald' : 'teal'} />

      {/* Staged items */}
      {totalItems === 0 ? (
        <NeuCard variant="pressed" padding="lg" className="text-center">
          <ClipboardCheck className="h-10 w-10 text-[var(--text-placeholder)] mx-auto mb-3" />
          <p className="text-sm text-[var(--text-muted)] mb-3">No onboarding items yet</p>
          {(templates as Array<Record<string, unknown>>).length > 0 && (
            <NeuButton size="sm" loading={applyTemplateMut.isPending}
              onClick={() => applyTemplateMut.mutate({ partnerId, templateId: (templates as Array<Record<string, unknown>>)[0].id as string })}>
              Apply Default Template
            </NeuButton>
          )}
        </NeuCard>
      ) : (
        <div className="space-y-3">
          {grouped.map(({ stage, label, items: stageItems }) => {
            const stageVerified = stageItems.filter(i => i.status === 'verified').length
            const stageTotal = stageItems.length
            const allDone = stageVerified === stageTotal
            const expanded = expandedStages.has(stage)
            return (
              <NeuCard key={stage} variant="pressed" padding="sm">
                <button onClick={() => toggleStage(stage)} className="flex items-center gap-2 w-full text-left py-1">
                  {expanded ? <ChevronDown className="h-3.5 w-3.5 text-[var(--text-muted)]" /> : <ChevronRight className="h-3.5 w-3.5 text-[var(--text-muted)]" />}
                  <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] flex-1">{label}</span>
                  <ComplianceBadge kycStatus={allDone ? 'verified' : stageVerified > 0 ? 'pending' : 'not_started'} size="sm" />
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
                        </div>
                      )
                    })}
                  </div>
                )}
              </NeuCard>
            )
          })}
        </div>
      )}

      {/* Add Item Modal */}
      <NeuModal open={showAdd} onClose={() => setShowAdd(false)} title="Add Onboarding Item">
        <div className="space-y-3">
          <NeuInput label="Item Name *" value={itemName} onChange={(e) => setItemName(e.target.value)} placeholder="e.g., NDA, Insurance Certificate" />
          <div className="grid grid-cols-2 gap-3">
            <NeuSelect label="Stage" value={itemStage} onChange={(e) => setItemStage(e.target.value)}
              options={STAGE_ORDER.map(s => ({ value: s, label: STAGE_LABELS[s] ?? s }))} />
            <NeuSelect label="Type" value={itemType} onChange={(e) => setItemType(e.target.value)}
              options={[{ value: 'document', label: 'Document' }, { value: 'verification', label: 'Verification' },
                { value: 'reference', label: 'Reference' }, { value: 'compliance', label: 'Compliance' },
                { value: 'communication', label: 'Communication' }, { value: 'other', label: 'Other' }]} />
          </div>
          <NeuInput label="Description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional" />
          <div className="flex justify-end gap-2 pt-2">
            <NeuButton variant="ghost" onClick={() => setShowAdd(false)}>Cancel</NeuButton>
            <NeuButton loading={createMut.isPending} disabled={!itemName.trim()}
              onClick={() => createMut.mutate({ partnerId, itemName: itemName.trim(), itemType, description: description || undefined })}>
              Create
            </NeuButton>
          </div>
        </div>
      </NeuModal>
    </div>
  )
}
