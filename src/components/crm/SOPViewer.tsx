'use client'

import { useEffect, useCallback } from 'react'
import { X, BookOpen, Clock, AlertCircle, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NeuCard } from '@/components/ui/NeuCard'
import { NeuButton } from '@/components/ui/NeuButton'
import { NeuBadge } from '@/components/ui/NeuBadge'
import { trpc } from '@/lib/trpc'

interface SOPStep {
  stepNumber: number
  instruction: string
  notes?: string
  estimatedTime?: string
}

export interface SOPViewerProps {
  taskType: string
  valueModel?: string
  open: boolean
  onClose: () => void
}

export function SOPViewer({ taskType, valueModel, open, onClose }: SOPViewerProps) {
  const { data: sop, isLoading, error } = trpc.sops.getForTask.useQuery(
    { taskType: taskType as never, valueModel: valueModel as never },
    { enabled: open }
  )

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose]
  )

  useEffect(() => {
    if (!open) return
    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [open, handleEscape])

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          'fixed inset-0 z-50 bg-[var(--overlay)] transition-opacity duration-300',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-out panel */}
      <aside
        className={cn(
          'fixed top-0 right-0 z-50 h-full w-full sm:w-[400px] bg-[var(--bg-surface)] border-l border-[var(--border)] shadow-[var(--shadow-raised)]',
          'transition-transform duration-300 ease-in-out overflow-y-auto',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Standard Operating Procedure"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-[var(--space-lg)] py-[var(--space-md)] bg-[var(--bg-surface)] border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-[var(--teal)]" />
            <span
              className="text-sm font-semibold tracking-widest uppercase text-[var(--teal)]"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              SOP
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-[var(--radius-sm)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors"
            aria-label="Close SOP viewer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-[var(--space-lg)]">
          {isLoading && <LoadingState />}
          {error && <ErrorState />}
          {!isLoading && !error && !sop && <EmptyState />}
          {!isLoading && !error && sop && <SOPContent sop={sop} />}
        </div>
      </aside>
    </>
  )
}

function SOPContent({ sop }: { sop: Record<string, unknown> }) {
  const title = sop.title as string
  const purpose = sop.purpose as string
  const regulatoryCitation = sop.regulatory_citation as string | null
  const steps = (sop.steps ?? []) as SOPStep[]

  return (
    <div className="space-y-[var(--space-lg)]">
      {/* Title & Purpose */}
      <div>
        <h2
          className="text-xl font-semibold text-[var(--text-primary)] mb-2"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {title}
        </h2>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{purpose}</p>
      </div>

      {/* Regulatory citation */}
      {regulatoryCitation && (
        <NeuCard variant="pressed" padding="sm">
          <div className="flex items-start gap-2">
            <FileText className="h-4 w-4 text-[var(--sapphire)] mt-0.5 shrink-0" />
            <div>
              <span className="text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">
                Regulatory Citation
              </span>
              <p className="text-sm text-[var(--text-primary)] mt-0.5">{regulatoryCitation}</p>
            </div>
          </div>
        </NeuCard>
      )}

      {/* Steps checklist */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">
          Steps
        </h3>
        {steps.map((step) => (
          <NeuCard key={step.stepNumber} variant="flat" padding="sm" className="border border-[var(--border)] rounded-[var(--radius-md)]">
            <div className="flex gap-3">
              <span
                className="flex items-center justify-center w-7 h-7 shrink-0 rounded-full bg-[var(--teal-bg)] text-[var(--teal)] text-xs font-bold"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                {step.stepNumber}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--text-primary)]">
                  {step.instruction}
                </p>
                {step.notes && (
                  <p className="mt-1 text-xs text-[var(--text-muted)] italic">{step.notes}</p>
                )}
                {step.estimatedTime && (
                  <div className="mt-1.5 flex items-center gap-1">
                    <Clock className="h-3 w-3 text-[var(--text-muted)]" />
                    <span className="text-xs text-[var(--text-muted)]">{step.estimatedTime}</span>
                  </div>
                )}
              </div>
            </div>
          </NeuCard>
        ))}
      </div>
    </div>
  )
}

function LoadingState() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-6 w-2/3 rounded bg-[var(--bg-elevated)]" />
      <div className="h-4 w-full rounded bg-[var(--bg-elevated)]" />
      <div className="h-4 w-4/5 rounded bg-[var(--bg-elevated)]" />
      <div className="mt-6 space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 rounded-[var(--radius-md)] bg-[var(--bg-elevated)]" />
        ))}
      </div>
    </div>
  )
}

function ErrorState() {
  return (
    <div className="flex flex-col items-center py-12 text-center">
      <AlertCircle className="h-10 w-10 text-[var(--ruby)] mb-3" />
      <p className="text-sm font-medium text-[var(--text-primary)]">Failed to load SOP</p>
      <p className="text-xs text-[var(--text-muted)] mt-1">Please try again later.</p>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center py-12 text-center">
      <BookOpen className="h-10 w-10 text-[var(--text-muted)] mb-3" />
      <p className="text-sm font-medium text-[var(--text-primary)]">
        No SOP available for this task type
      </p>
      <p className="text-xs text-[var(--text-muted)] mt-1">
        An SOP can be created by an admin to guide this workflow.
      </p>
    </div>
  )
}
