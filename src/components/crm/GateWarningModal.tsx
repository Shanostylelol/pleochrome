'use client'

import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { NeuModal } from '@/components/ui/NeuModal'
import { NeuButton } from '@/components/ui/NeuButton'
import { NeuCard } from '@/components/ui/NeuCard'
import { NeuInput } from '@/components/ui/NeuInput'

export interface GateWarning {
  taskId?: string
  taskTitle?: string
  stageName?: string
  type?: string
  message?: string
}

export interface GateWarningModalProps {
  open: boolean
  onClose: () => void
  onProceed: (reason: string) => void
  warnings: GateWarning[]
  targetPhase: string
}

export function GateWarningModal({ open, onClose, onProceed, warnings, targetPhase }: GateWarningModalProps) {
  const [reason, setReason] = useState('')

  const handleProceed = () => {
    if (!reason.trim()) return
    onProceed(reason.trim())
    setReason('')
    onClose()
  }

  return (
    <NeuModal open={open} onClose={onClose} title="Gate Check — Incomplete Items" maxWidth="md">
      <NeuCard variant="pressed" padding="sm" className="mb-4">
        <div className="flex items-start gap-2">
          <AlertTriangle className="h-5 w-5 text-[var(--amber)] shrink-0 mt-0.5" />
          <p className="text-sm text-[var(--text-secondary)]">
            These tasks are incomplete before advancing to{' '}
            <span className="font-semibold text-[var(--text-primary)]">{targetPhase.replace(/_/g, ' ')}</span>.
            You must provide a reason to override.
          </p>
        </div>
      </NeuCard>

      <ul className="space-y-2 mb-4">
        {warnings.map((w, idx) => (
          <li key={idx} className="flex items-start gap-2.5">
            <AlertTriangle className="h-4 w-4 text-[var(--amber)] shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              {w.stageName && <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--amber)]">{w.stageName}</span>}
              {w.type && <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--amber)]">{w.type}</span>}
              <p className="text-sm text-[var(--text-secondary)] mt-0.5">{w.taskTitle ?? w.message ?? 'Incomplete item'}</p>
            </div>
          </li>
        ))}
      </ul>

      <NeuInput
        label="Override Reason *"
        placeholder="Why are you advancing with incomplete tasks?"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        error={reason.length === 0 ? undefined : undefined}
      />

      <div className="flex items-center justify-end gap-3 mt-4">
        <NeuButton variant="ghost" size="sm" onClick={onClose}>Cancel</NeuButton>
        <NeuButton variant="danger" size="sm" onClick={handleProceed} disabled={!reason.trim()}>
          Override & Advance
        </NeuButton>
      </div>
    </NeuModal>
  )
}
