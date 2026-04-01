'use client'

import { useState } from 'react'
import { trpc } from '@/lib/trpc'
import { NeuCard, NeuButton, NeuInput, NeuTextarea, NeuSelect } from '@/components/ui'
import { X } from 'lucide-react'

interface QuickAddModalProps {
  onClose: () => void
}

export function QuickAddModal({ onClose }: QuickAddModalProps) {
  const [name, setName] = useState('')
  const [assetType, setAssetType] = useState<'gemstone' | 'real_estate' | 'precious_metal' | 'mineral_rights' | 'other'>('gemstone')
  const [valuePath, setValuePath] = useState<'fractional_securities' | 'tokenization' | 'debt_instrument' | 'broker_sale' | 'barter' | ''>('')
  const [holderEntity, setHolderEntity] = useState('')
  const [description, setDescription] = useState('')
  const [estimatedValue, setEstimatedValue] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const utils = trpc.useUtils()
  const createMutation = trpc.assets.create.useMutation({
    onSuccess: () => { utils.assets.listForPipeline.invalidate(); utils.assets.getStats.invalidate(); onClose() },
  })

  const nameErr = submitted && !name.trim() ? 'Asset name is required' : undefined
  const holderErr = submitted && !holderEntity.trim() ? 'Holder entity is required' : undefined
  const valueErr = estimatedValue && isNaN(parseFloat(estimatedValue.replace(/,/g, ''))) ? 'Must be a valid number' : undefined

  const handleSubmit = () => {
    setSubmitted(true)
    if (!name.trim() || !holderEntity.trim() || valueErr) return
    createMutation.mutate({
      name: name.trim(), assetType, valueModel: valuePath || undefined, holderEntity: holderEntity.trim(),
      description: description.trim() || undefined,
      claimedValue: estimatedValue ? parseFloat(estimatedValue.replace(/,/g, '')) : undefined,
    } as any)  // eslint-disable-line @typescript-eslint/no-explicit-any
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[var(--overlay)]" onClick={onClose} />
      <NeuCard variant="raised" padding="lg" className="relative w-full max-w-md max-w-[calc(100vw-2rem)] z-10 space-y-4 max-h-[80vh] sm:max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>Quick Add Asset</h2>
          <button onClick={onClose} className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)]"><X className="h-5 w-5" /></button>
        </div>
        <NeuInput label="Asset Name *" placeholder="e.g., Emerald Barrel #017093" value={name}
          onChange={(e) => setName(e.target.value)} error={nameErr} />
        <NeuInput label="Holder Entity *" placeholder="e.g., Kandi International LLC" value={holderEntity}
          onChange={(e) => setHolderEntity(e.target.value)} error={holderErr} />
        <NeuTextarea label="Description" placeholder="Brief asset description..." value={description}
          onChange={(e) => setDescription(e.target.value)} rows={2} />
        <div className="grid grid-cols-2 gap-3">
          <NeuSelect label="Asset Type" value={assetType} onChange={(e) => setAssetType(e.target.value as typeof assetType)}
            options={[{ value: 'gemstone', label: 'Gemstone' }, { value: 'real_estate', label: 'Real Estate' },
              { value: 'precious_metal', label: 'Precious Metal' }, { value: 'mineral_rights', label: 'Mineral Rights' },
              { value: 'other', label: 'Other' }]} />
          <NeuSelect label="Value Model" value={valuePath} onChange={(e) => setValuePath(e.target.value as typeof valuePath)}
            options={[{ value: '', label: 'Undecided' }, { value: 'fractional_securities', label: 'Fractional' },
              { value: 'tokenization', label: 'Tokenization' }, { value: 'debt_instrument', label: 'Debt' },
              { value: 'broker_sale', label: 'Broker Sale' }, { value: 'barter', label: 'Barter' }]} />
        </div>
        <NeuInput label="Estimated Value" placeholder="$0" value={estimatedValue} error={valueErr}
          onChange={(e) => setEstimatedValue(e.target.value.replace(/[^0-9.,]/g, ''))}
          onBlur={() => {
            const num = parseFloat(estimatedValue.replace(/,/g, ''))
            if (!isNaN(num) && num > 0) setEstimatedValue(num.toLocaleString('en-US'))
          }}
          onFocus={() => setEstimatedValue(estimatedValue.replace(/,/g, ''))} />
        <div className="flex gap-3 pt-2">
          <NeuButton variant="ghost" onClick={onClose} fullWidth>Cancel</NeuButton>
          <NeuButton onClick={handleSubmit} loading={createMutation.isPending} disabled={createMutation.isPending} fullWidth>Create Asset</NeuButton>
        </div>
        {createMutation.error && <p className="text-sm text-[var(--ruby)]">{createMutation.error.message}</p>}
        <div className="flex justify-center pt-1 border-t border-[var(--border)]">
          <a href="/crm/assets/new" onClick={onClose} className="text-[11px] text-[var(--teal)] hover:text-[var(--text-primary)] transition-colors">
            Need more options? Try the full wizard &rarr;
          </a>
        </div>
      </NeuCard>
    </div>
  )
}
