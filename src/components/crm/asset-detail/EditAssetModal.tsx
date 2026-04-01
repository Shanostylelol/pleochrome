'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { trpc } from '@/lib/trpc'
import { NeuCard } from '@/components/ui/NeuCard'
import { NeuButton } from '@/components/ui/NeuButton'
import { NeuInput } from '@/components/ui/NeuInput'
import { NeuTextarea } from '@/components/ui/NeuInput'

// ── Types ─────────────────────────────────────────────────
interface EditAssetModalProps {
  asset: Record<string, unknown>
  assetId: string
  onClose: () => void
}

// ── Component ─────────────────────────────────────────────
export function EditAssetModal({ asset, assetId, onClose }: EditAssetModalProps) {
  const [name, setName] = useState((asset.name as string) ?? '')
  const [description, setDescription] = useState((asset.description as string) ?? '')
  const [claimedValue, setClaimedValue] = useState((asset.claimed_value as number)?.toString() ?? '')
  const [appraisedValue, setAppraisedValue] = useState((asset.appraised_value as number | null)?.toString() ?? '')
  const rawTarget = asset.target_completion_date as string | null | undefined
  const [targetDate, setTargetDate] = useState(rawTarget ? rawTarget.slice(0, 10) : '')
  const [holderEntity, setHolderEntity] = useState((asset.asset_holder_entity as string) ?? '')

  const utils = trpc.useUtils()
  const updateMutation = trpc.assets.update.useMutation({
    onSuccess: () => {
      utils.assets.getById.invalidate({ assetId })
      onClose()
    },
  })

  const handleSubmit = () => {
    if (!name.trim()) return
    updateMutation.mutate({
      assetId,
      name: name.trim(),
      description: description.trim() || undefined,
      claimedValue: claimedValue ? parseFloat(claimedValue.replace(/,/g, '')) : undefined,
      appraisedValue: appraisedValue ? parseFloat(appraisedValue.replace(/,/g, '')) : undefined,
      targetCompletionDate: targetDate ? new Date(targetDate).toISOString() : null,
      holderEntity: holderEntity.trim() || undefined,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[var(--overlay)]" onClick={onClose} />
      <NeuCard variant="raised" padding="lg" className="relative w-full max-w-md z-10 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2
            className="text-lg font-semibold text-[var(--text-primary)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Edit Asset
          </h2>
          <button onClick={onClose} className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)]">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-3">
          <NeuInput
            label="Name *"
            placeholder="Asset name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <NeuTextarea
            label="Description"
            placeholder="Asset description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
          <NeuInput
            label="Claimed Value"
            placeholder="$0"
            value={claimedValue}
            onChange={(e) => setClaimedValue(e.target.value.replace(/[^0-9.]/g, ''))}
            onBlur={() => { const n = parseFloat(claimedValue); if (!isNaN(n) && n > 0) setClaimedValue(n.toLocaleString('en-US')) }}
            onFocus={() => setClaimedValue(claimedValue.replace(/,/g, ''))}
          />
          <NeuInput
            label="Appraised Value"
            placeholder="$0"
            value={appraisedValue}
            onChange={(e) => setAppraisedValue(e.target.value.replace(/[^0-9.]/g, ''))}
            onBlur={() => { const n = parseFloat(appraisedValue); if (!isNaN(n) && n > 0) setAppraisedValue(n.toLocaleString('en-US')) }}
            onFocus={() => setAppraisedValue(appraisedValue.replace(/,/g, ''))}
          />
          <NeuInput
            label="Holder Entity"
            placeholder="Entity name"
            value={holderEntity}
            onChange={(e) => setHolderEntity(e.target.value)}
          />
          <NeuInput
            label="Target Completion Date"
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <NeuButton variant="ghost" onClick={onClose} fullWidth>Cancel</NeuButton>
          <NeuButton onClick={handleSubmit} loading={updateMutation.isPending} disabled={!name.trim()} fullWidth>
            Save Changes
          </NeuButton>
        </div>
        {updateMutation.error && <p className="text-sm text-[var(--ruby)]">{updateMutation.error.message}</p>}
      </NeuCard>
    </div>
  )
}
