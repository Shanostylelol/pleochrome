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
    <NeuModal open={open} onClose={onClose} title="Pivot Value Model" maxWidth="md">
      <div className="space-y-4">
        <NeuCard variant="pressed" padding="sm">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-[var(--amber)] shrink-0" />
            <p className="text-xs text-[var(--text-secondary)]">
              Pivoting changes the asset&apos;s value creation path. <strong>Phase 1-3 work is preserved.</strong>{' '}
              Phase 4-6 stages for the current model will be archived (not deleted) and new stages for the selected model will be created.
            </p>
          </div>
        </NeuCard>

        <p className="text-xs text-[var(--text-muted)]">Asset: <span className="font-medium text-[var(--text-primary)]">{assetName}</span></p>

        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-1">Current Model</p>
            <p className="text-sm font-semibold text-[var(--text-primary)]">{currentLabel}</p>
          </div>
          <ArrowRight className="h-4 w-4 text-[var(--text-muted)] shrink-0" />
          <div className="flex-1">
            <NeuSelect
              label="New Model *"
              value={newModel}
              onChange={(e) => setNewModel(e.target.value)}
              options={[{ value: '', label: 'Select new model...' }, ...availableModels]}
            />
          </div>
        </div>

        <NeuTextarea
          label="Reason for Pivot *"
          placeholder="Why is this value model changing? This is logged to the audit trail."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={3}
        />

        {newModel && (
          <NeuCard variant="pressed" padding="sm">
            <p className="text-xs text-[var(--text-muted)]">What will happen:</p>
            <ul className="text-xs text-[var(--text-secondary)] mt-1 space-y-0.5 list-disc list-inside">
              <li>Phases 1-3 (Lead, Intake, Asset Maturity) — <span className="text-[var(--chartreuse)]">preserved</span></li>
              <li>Phases 4-6 stages for <strong>{currentLabel}</strong> — <span className="text-[var(--amber)]">archived</span> (visible in audit)</li>
              <li>New Phase 4-6 stages for <strong>{newLabel}</strong> — <span className="text-[var(--teal)]">created</span></li>
              <li>Open tasks in archived stages — <span className="text-[var(--amber)]">cancelled</span></li>
              <li>Completed tasks — <span className="text-[var(--chartreuse)]">preserved in history</span></li>
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
            Pivot to {newLabel || '...'}
          </NeuButton>
        </div>
      </div>
    </NeuModal>
  )
}
