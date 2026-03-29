'use client'

import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

const PHASES = [
  { key: 'phase_0_foundation', label: 'Foundation', short: '0' },
  { key: 'phase_1_intake', label: 'Intake', short: '1' },
  { key: 'phase_2_certification', label: 'Certification', short: '2' },
  { key: 'phase_3_custody', label: 'Custody', short: '3' },
  { key: 'phase_4_legal', label: 'Legal', short: '4' },
  { key: 'phase_5_tokenization', label: 'Execution', short: '5' },
  { key: 'phase_6_regulatory', label: 'Regulatory', short: '6' },
  { key: 'phase_7_distribution', label: 'Distribution', short: '7' },
  { key: 'phase_8_ongoing', label: 'Ongoing', short: '8' },
]

export function PhaseTimeline({ currentPhase }: { currentPhase: string }) {
  const currentIdx = PHASES.findIndex((p) => p.key === currentPhase)

  return (
    <div className="flex items-center gap-0 overflow-x-auto scrollbar-none py-3 px-1">
      {PHASES.map((phase, idx) => {
        const isCompleted = idx < currentIdx
        const isActive = idx === currentIdx
        const isPending = idx > currentIdx

        return (
          <div key={phase.key} className="flex items-center shrink-0">
            {/* Dot */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'flex items-center justify-center rounded-full transition-all',
                  isCompleted && 'w-7 h-7 bg-[var(--chartreuse)] text-white',
                  isActive && 'w-9 h-9 bg-[var(--teal)] text-white shadow-[0_0_12px_var(--teal)]',
                  isPending && 'w-6 h-6 border-2 border-[var(--text-placeholder)] bg-transparent'
                )}
              >
                {isCompleted && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                {isActive && <span className="text-xs font-bold">{phase.short}</span>}
              </div>
              <span
                className={cn(
                  'text-[10px] mt-1.5 whitespace-nowrap',
                  isActive ? 'font-semibold text-[var(--text-primary)]' : isCompleted ? 'text-[var(--text-secondary)]' : 'text-[var(--text-muted)]'
                )}
              >
                {phase.label}
              </span>
            </div>

            {/* Connecting line */}
            {idx < PHASES.length - 1 && (
              <div
                className={cn(
                  'h-0.5 min-w-[24px] lg:min-w-[40px] mx-1',
                  idx < currentIdx ? 'bg-[var(--chartreuse)]' : idx === currentIdx ? 'bg-gradient-to-r from-[var(--teal)] to-[var(--text-placeholder)]' : 'border-t-2 border-dashed border-[var(--text-placeholder)]'
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
