'use client'

import { useState } from 'react'
import { trpc } from '@/lib/trpc'
import { NeuModal, NeuButton, NeuSelect, NeuCard } from '@/components/ui'
import { NeuTextarea } from '@/components/ui/NeuInput'
import { useToast } from '@/components/ui/NeuToast'
import { AlertTriangle, ArrowRight } from 'lucide-react'
import { VALUE_MODELS, type ValueModelKey } from '@/lib/constants'

interface PivotValueModelModalProps {
  open: boolean
  onClose: () => void
  assetId: string
  assetName: string
  currentModel: string | null
}

const MODEL_OPTIONS = Object.entries(VALUE_MODELS).map(([key, cfg]) => ({
  value: key,
  label: cfg.label,
}))

export function PivotValueModelModal({ open, onClose, assetId, assetName, currentModel }: PivotValueModelModalProps) {
  const { toast } = useToast()
  const utils = trpc.useUtils()
  const [newModel, setNewModel] = useState('')
  const [reason, setReason] = useState('')

  const pivotMut = trpc.assets.pivotValueModel.useMutation({
    onSuccess: (result) => {
      const r = result as Record<string, unknown>
      toast(
        `Pivoted to ${(r.newModel as string).replace(/_/g, ' ')}. ${r.archivedStages} stages archived, ${r.newStages} new stages created.`,
        'success'
      )
      utils.assets.getById.invalidate({ assetId })
      utils.assets.listForPipeline.invalidate()
      onClose()
      setNewModel(''); setReason('')
    },
    onError: (err) => toast(err.message, 'error'),
  })

  const availableModels = MODEL_OPTIONS.filter(m => m.value !== currentModel)
  const currentLabel = currentModel ? VALUE_MODELS[currentModel as ValueModelKey]?.label ?? currentModel : 'Undecided'
  const newLabel = newModel ? VALUE_MODELS[newModel as ValueModelKey]?.label ?? newModel : ''

  return (
    <NeuModal open={open} onClose={onClose} title="Change Value Creation Approach" maxWidth="md">
      <div className="space-y-4">
        <NeuCard variant="pressed" padding="sm">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-[var(--amber)] shrink-0" />
            <p className="text-xs text-[var(--text-secondary)]">
              Pivoting changes the asset&apos;s value creation path. <strong>Phase 1-3 work is preserved.</strong>{' '}
              This changes how you&apos;ll monetize this asset. All your early work (sourcing, KYC, appraisal) stays intact. Only the later steps (legal structuring, offering, distribution) will be swapped out for the new approach.
            </p>
          </div>
        </NeuCard>

        <p className="text-xs text-[var(--text-muted)]">Asset: <span className="font-medium text-[var(--text-primary)]">{assetName}</span></p>

        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-1">Current Approach</p>
            <p className="text-sm font-semibold text-[var(--text-primary)]">{currentLabel}</p>
          </div>
          <ArrowRight className="h-4 w-4 text-[var(--text-muted)] shrink-0" />
          <div className="flex-1">
            <NeuSelect
              label="New Approach *"
              value={newModel}
              onChange={(e) => setNewModel(e.target.value)}
              options={[{ value: '', label: 'Select new model...' }, ...availableModels]}
            />
          </div>
        </div>

        <NeuTextarea
          label="Why are you changing the approach? *"
          placeholder="e.g., Direct buyer identified at AGTA show, switching from tokenization to broker sale"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={3}
        />

        {newModel && (
          <NeuCard variant="pressed" padding="sm">
            <p className="text-xs font-semibold text-[var(--text-muted)]">Here&apos;s what happens:</p>
            <ul className="text-xs text-[var(--text-secondary)] mt-1.5 space-y-1 list-disc list-inside">
              <li>Your sourcing, KYC, and appraisal work — <span className="font-semibold text-[var(--chartreuse)]">kept as-is</span></li>
              <li>Current {currentLabel} legal/offering/distribution steps — <span className="font-semibold text-[var(--amber)]">saved to history</span></li>
              <li>New {newLabel} steps — <span className="font-semibold text-[var(--teal)]">added to your workflow</span></li>
              <li>Tasks you hadn&apos;t started yet — <span className="text-[var(--text-muted)]">replaced by the new steps</span></li>
              <li>Tasks you already completed — <span className="font-semibold text-[var(--chartreuse)]">permanently saved</span></li>
            </ul>
          </NeuCard>
        )}

        <div className="flex gap-3 pt-2">
          <NeuButton variant="ghost" onClick={onClose} fullWidth>Cancel</NeuButton>
          <NeuButton
            variant="danger"
            onClick={() => pivotMut.mutate({
              assetId,
              newValueModel: newModel as 'tokenization' | 'fractional_securities' | 'debt_instrument' | 'broker_sale' | 'barter',
              reason: reason.trim(),
            })}
            loading={pivotMut.isPending}
            disabled={!newModel || !reason.trim()}
            fullWidth
          >
            Switch to {newLabel || '...'}
          </NeuButton>
        </div>
      </div>
    </NeuModal>
  )
}
