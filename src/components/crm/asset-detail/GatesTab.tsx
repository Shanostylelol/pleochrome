'use client'

import { useState, useCallback } from 'react'
import { Shield, Lock, CheckCircle2 } from 'lucide-react'
import { trpc } from '@/lib/trpc'
import { PHASES, type PhaseKey } from '@/lib/constants'
import { NeuCard } from '@/components/ui/NeuCard'
import { NeuBadge } from '@/components/ui/NeuBadge'
import { NeuButton } from '@/components/ui/NeuButton'
import { NeuProgress } from '@/components/ui/NeuProgress'
import { GateWarningModal, type GateWarning } from '@/components/crm/GateWarningModal'
import type { Stage } from '@/components/crm/StageAccordion'

// ── Types ─────────────────────────────────────────────────
interface GatesTabProps {
  assetId: string
  stages: Stage[]
  owners?: Array<{ contacts: { kyc_status: string; full_name: string } | null }>
}

// ── Component ─────────────────────────────────────────────
export function GatesTab({ assetId, stages, owners = [] }: GatesTabProps) {
  const [warningModal, setWarningModal] = useState<{
    stageId: string
    warnings: GateWarning[]
    targetPhase: string
  } | null>(null)

  const utils = trpc.useUtils()
  const invalidate = useCallback(
    () => utils.assets.getById.invalidate({ assetId }),
    [utils, assetId],
  )

  const updateStatus = trpc.stages.updateStatus.useMutation({ onSuccess: invalidate })

  const gateStages = stages.filter((s) => s.is_gate)

  if (gateStages.length === 0) {
    return (
      <NeuCard variant="pressed" padding="lg" className="text-center">
        <Lock className="h-10 w-10 text-[var(--text-placeholder)] mx-auto mb-3" />
        <p className="text-sm text-[var(--text-muted)]">No gate milestones in this workflow.</p>
      </NeuCard>
    )
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-[var(--text-muted)]">
        {gateStages.length} gate {gateStages.length === 1 ? 'milestone' : 'milestones'} across the workflow
      </p>

      {gateStages.map((gate) => {
        const phase = gate.phase as PhaseKey
        const phaseCfg = PHASES[phase]
        const phaseStages = stages.filter((s) => s.phase === phase && !s.is_gate)
        const phaseCompleted = phaseStages.filter((s) => s.status === 'completed').length
        const phaseTotal = phaseStages.length
        const allPhaseComplete = phaseTotal > 0 && phaseCompleted === phaseTotal
        const gateReady = allPhaseComplete && gate.status !== 'completed'
        const isPassed = gate.status === 'completed'

        const handleEvaluate = () => {
          if (allPhaseComplete) {
            updateStatus.mutate({ stageId: gate.id, status: 'completed' })
          } else {
            // Show warning modal with incomplete items
            const warnings: GateWarning[] = [
              ...phaseStages
                .filter((s) => s.status !== 'completed')
                .map((s) => ({
                  type: 'Incomplete Stage',
                  message: `"${s.name}" is still ${s.status.replace(/_/g, ' ')}.`,
                })),
              ...owners
                .filter((o) => o.contacts && o.contacts.kyc_status !== 'verified')
                .map((o) => ({
                  type: 'Unverified Owner',
                  message: `"${o.contacts?.full_name ?? 'Unknown'}" KYC status: ${o.contacts?.kyc_status ?? 'not started'}.`,
                })),
            ]
            setWarningModal({
              stageId: gate.id,
              warnings,
              targetPhase: phaseCfg?.label ?? phase,
            })
          }
        }

        return (
          <NeuCard key={gate.id} variant="raised" padding="md">
            <div className="flex items-start gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  isPassed
                    ? 'bg-[var(--chartreuse-bg)] text-[var(--chartreuse)]'
                    : gateReady
                      ? 'bg-[var(--amber-bg)] text-[var(--amber)]'
                      : 'bg-[var(--bg-body)] text-[var(--text-muted)]'
                }`}
              >
                {isPassed ? <CheckCircle2 className="h-5 w-5" /> : <Shield className="h-5 w-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[var(--text-primary)]">{gate.name}</p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">{phaseCfg?.label ?? phase}</p>
                <div className="mt-2">
                  <NeuProgress
                    value={phaseCompleted}
                    max={phaseTotal || 1}
                    color={allPhaseComplete ? 'chartreuse' : 'teal'}
                  />
                  <p className="text-[10px] text-[var(--text-muted)] mt-1">
                    {phaseCompleted}/{phaseTotal} phase stages completed
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <NeuBadge
                  color={isPassed ? 'chartreuse' : gateReady ? 'amber' : 'gray'}
                  size="sm"
                >
                  {isPassed ? 'Passed' : gateReady ? 'Ready' : 'Pending'}
                </NeuBadge>
                {!isPassed && (
                  <NeuButton
                    size="sm"
                    icon={<CheckCircle2 className="h-3.5 w-3.5" />}
                    onClick={handleEvaluate}
                    loading={updateStatus.isPending}
                  >
                    {gateReady ? 'Pass Gate' : 'Evaluate'}
                  </NeuButton>
                )}
              </div>
            </div>
          </NeuCard>
        )
      })}

      {/* Gate warning modal */}
      {warningModal && (
        <GateWarningModal
          open={true}
          onClose={() => setWarningModal(null)}
          onProceed={() => {
            updateStatus.mutate({ stageId: warningModal.stageId, status: 'completed' })
            setWarningModal(null)
          }}
          warnings={warningModal.warnings}
          targetPhase={warningModal.targetPhase}
        />
      )}
    </div>
  )
}
