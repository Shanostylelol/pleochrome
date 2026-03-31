'use client'

import { AlertTriangle } from 'lucide-react'
import { NeuModal } from '@/components/ui/NeuModal'
import { NeuButton } from '@/components/ui/NeuButton'
import { NeuCard } from '@/components/ui/NeuCard'

export interface GateWarning {
  type: string
  message: string
}

export interface GateWarningModalProps {
  open: boolean
  onClose: () => void
  onProceed: () => void
  warnings: GateWarning[]
  targetPhase: string
}

export function GateWarningModal({
  open,
  onClose,
  onProceed,
  warnings,
  targetPhase,
}: GateWarningModalProps) {
  return (
    <NeuModal open={open} onClose={onClose} title="Gate Check Warning" maxWidth="md">
      {/* Warning banner */}
      <NeuCard variant="pressed" padding="sm" className="mb-4">
        <div className="flex items-start gap-2">
          <AlertTriangle className="h-5 w-5 text-[var(--amber)] shrink-0 mt-0.5" />
          <p className="text-sm text-[var(--text-secondary)]">
            These items are incomplete before advancing to{' '}
            <span className="font-semibold text-[var(--text-primary)]">{targetPhase}</span>.
            Proceeding will log an override in the audit trail.
          </p>
        </div>
      </NeuCard>

      {/* Warning list */}
      <ul className="space-y-2 mb-6">
        {warnings.map((warning, idx) => (
          <li key={idx} className="flex items-start gap-2.5">
            <AlertTriangle className="h-4 w-4 text-[var(--amber)] shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--amber)]">
                {warning.type}
              </span>
              <p className="text-sm text-[var(--text-secondary)] mt-0.5">
                {warning.message}
              </p>
            </div>
          </li>
        ))}
      </ul>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <NeuButton variant="ghost" size="sm" onClick={onClose}>
          Cancel
        </NeuButton>
        <NeuButton
          variant="danger"
          size="sm"
          onClick={() => {
            onProceed()
            onClose()
          }}
        >
          Proceed Anyway
        </NeuButton>
      </div>
    </NeuModal>
  )
}
