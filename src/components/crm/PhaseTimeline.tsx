'use client'

import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'
import { PHASES, PHASE_ORDER, type PhaseKey } from '@/lib/constants'

// ── Props ─────────────────────────────────────────────────
export interface PhaseTimelineProps {
  currentPhase: PhaseKey
  onPhaseClick?: (phase: PhaseKey) => void
}

// ── Short labels for compact display ──────────────────────
const SHORT_LABELS: Record<PhaseKey, string> = {
  lead: 'Lead',
  intake: 'Intake',
  asset_maturity: 'Maturity',
  security: 'Security',
  value_creation: 'Value',
  distribution: 'Distrib.',
}

// ── Component ─────────────────────────────────────────────
export function PhaseTimeline({ currentPhase, onPhaseClick }: PhaseTimelineProps) {
  const currentIdx = PHASE_ORDER.indexOf(currentPhase)

  return (
    <div className="flex items-center gap-0 overflow-x-auto scrollbar-none py-3 px-1">
      {PHASE_ORDER.map((phaseKey, idx) => {
        const phase = PHASES[phaseKey]
        const isCompleted = idx < currentIdx
        const isActive = idx === currentIdx
        const isPending = idx > currentIdx
        const isClickable = !!onPhaseClick

        return (
          <div key={phaseKey} className="flex items-center shrink-0">
            {/* Phase dot + label */}
            <button
              type="button"
              disabled={!isClickable}
              onClick={() => onPhaseClick?.(phaseKey)}
              className={cn(
                'flex flex-col items-center gap-1.5 group',
                isClickable && 'cursor-pointer',
                !isClickable && 'cursor-default'
              )}
            >
              <div
                className={cn(
                  'flex items-center justify-center rounded-full transition-all',
                  isCompleted && 'w-7 h-7 text-[var(--text-on-accent)]',
                  isActive && 'w-9 h-9 text-[var(--text-on-accent)]',
                  isPending && 'w-6 h-6 border-2 border-[var(--text-placeholder)] bg-transparent',
                  isClickable && !isActive && 'group-hover:scale-110'
                )}
                style={{
                  ...(isCompleted ? { background: 'var(--chartreuse)' } : {}),
                  ...(isActive
                    ? {
                        background: phase.color,
                        boxShadow: `0 0 12px ${phase.color}`,
                      }
                    : {}),
                }}
              >
                {isCompleted && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                {isActive && <span className="text-xs font-bold">{idx + 1}</span>}
              </div>

              <span
                className={cn(
                  'text-[10px] whitespace-nowrap transition-colors',
                  isActive
                    ? 'font-semibold text-[var(--text-primary)]'
                    : isCompleted
                      ? 'text-[var(--text-secondary)]'
                      : 'text-[var(--text-muted)]',
                  isClickable && 'group-hover:text-[var(--text-primary)]'
                )}
              >
                {SHORT_LABELS[phaseKey]}
              </span>
            </button>

            {/* Connecting line */}
            {idx < PHASE_ORDER.length - 1 && (
              <div
                className={cn(
                  'h-0.5 min-w-[24px] lg:min-w-[40px] mx-1',
                  idx < currentIdx
                    ? 'bg-[var(--chartreuse)]'
                    : idx === currentIdx
                      ? 'bg-gradient-to-r from-[var(--teal)] to-[var(--text-placeholder)]'
                      : 'border-t-2 border-dashed border-[var(--text-placeholder)]'
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
