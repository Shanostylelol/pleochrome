'use client'

import { useState } from 'react'
import { trpc } from '@/lib/trpc'
import { NeuCard, NeuBadge, NeuButton, NeuModal, NeuInput, NeuSelect } from '@/components/ui'
import { Plus, ClipboardCheck, Check } from 'lucide-react'

const STATUS_COLOR: Record<string, 'gray' | 'amber' | 'chartreuse' | 'ruby'> = {
  pending: 'amber',
  verified: 'chartreuse',
  rejected: 'ruby',
  not_started: 'gray',
}

function formatDate(date: string | null | undefined): string {
  if (!date) return '---'
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export function PartnerOnboardingTab({ partnerId }: { partnerId: string }) {
  const [showAdd, setShowAdd] = useState(false)
  const [itemName, setItemName] = useState('')
  const [itemType, setItemType] = useState('document')
  const [description, setDescription] = useState('')

  const { data: items = [], isLoading } = trpc.partners.getOnboardingItems.useQuery({ partnerId })
  const utils = trpc.useUtils()

  const createMut = trpc.partners.createOnboardingItem.useMutation({
    onSuccess: () => {
      utils.partners.getOnboardingItems.invalidate({ partnerId })
      utils.partners.getById.invalidate({ partnerId })
      setShowAdd(false)
      setItemName('')
      setDescription('')
    },
  })

  const updateMut = trpc.partners.updateOnboardingItem.useMutation({
    onSuccess: () => {
      utils.partners.getOnboardingItems.invalidate({ partnerId })
      utils.partners.getById.invalidate({ partnerId })
    },
  })

  if (isLoading) {
    return (
      <NeuCard variant="raised" padding="lg" className="text-center">
        <p className="text-sm text-[var(--text-muted)]">Loading onboarding items...</p>
      </NeuCard>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">
          Due Diligence Items ({items.length})
        </h3>
        <NeuButton icon={<Plus className="h-4 w-4" />} size="sm" onClick={() => setShowAdd(true)}>
          Add Item
        </NeuButton>
      </div>

      {items.length === 0 ? (
        <NeuCard variant="pressed" padding="lg" className="text-center">
          <ClipboardCheck className="h-10 w-10 text-[var(--text-placeholder)] mx-auto mb-3" />
          <p className="text-sm text-[var(--text-muted)]">No onboarding items yet</p>
        </NeuCard>
      ) : (
        <div className="space-y-2">
          {items.map((item: Record<string, unknown>) => {
            const st = (item.status as string) ?? 'pending'
            return (
              <NeuCard key={item.id as string} variant="raised" padding="md">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm text-[var(--text-primary)]">
                      {item.item_name as string}
                    </p>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">
                      {(item.item_type as string)?.replace(/_/g, ' ')} &middot;{' '}
                      {(item.description as string) || 'No description'}
                    </p>
                    {(item.verified_at as string) && (
                      <p className="text-[11px] text-[var(--text-muted)] mt-1">
                        Verified: {formatDate(item.verified_at as string)}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <NeuBadge color={STATUS_COLOR[st] ?? 'gray'} size="sm">
                      {st.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                    </NeuBadge>
                    {st !== 'verified' && (
                      <NeuButton
                        variant="success"
                        size="sm"
                        icon={<Check className="h-3.5 w-3.5" />}
                        loading={updateMut.isPending}
                        onClick={() => updateMut.mutate({ itemId: item.id as string, status: 'verified' })}
                      >
                        Verify
                      </NeuButton>
                    )}
                  </div>
                </div>
              </NeuCard>
            )
          })}
        </div>
      )}

      {/* Add Onboarding Item Modal */}
      <NeuModal open={showAdd} onClose={() => setShowAdd(false)} title="Add Onboarding Item">
        <div className="space-y-4">
          <NeuInput label="Item Name" value={itemName} onChange={(e) => setItemName(e.target.value)} placeholder="e.g. NDA, Insurance Certificate" />
          <NeuSelect
            label="Type"
            value={itemType}
            onChange={(e) => setItemType(e.target.value)}
            options={[
              { value: 'document', label: 'Document' },
              { value: 'verification', label: 'Verification' },
              { value: 'reference', label: 'Reference Check' },
              { value: 'compliance', label: 'Compliance' },
              { value: 'other', label: 'Other' },
            ]}
          />
          <NeuInput label="Description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional description" />
          <div className="flex justify-end gap-2 pt-2">
            <NeuButton variant="ghost" onClick={() => setShowAdd(false)}>Cancel</NeuButton>
            <NeuButton
              loading={createMut.isPending}
              disabled={!itemName.trim()}
              onClick={() => createMut.mutate({
                partnerId,
                itemName: itemName.trim(),
                itemType,
                description: description || undefined,
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
