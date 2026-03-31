'use client'

import { X, AlertTriangle } from 'lucide-react'
import { NeuCard, NeuBadge } from '@/components/ui'
import { PHASE_ORDER } from '@/lib/constants'
import { trpc } from '@/lib/trpc'
import { TemplatePhaseSection } from './TemplatePhaseSection'

/* eslint-disable @typescript-eslint/no-explicit-any */
interface TemplateData {
  template: any
  stages: any[]
  tasks: any[]
  subtasks: any[]
}

export function TemplateEditor({ data, onClose }: { data: TemplateData; onClose: () => void }) {
  const utils = trpc.useUtils()

  // Group stages by phase
  const stagesByPhase: Record<string, any[]> = {}
  PHASE_ORDER.forEach((p) => { stagesByPhase[p] = [] })
  data.stages.forEach((s) => {
    const ph = s.phase as string
    if (!stagesByPhase[ph]) stagesByPhase[ph] = []
    stagesByPhase[ph].push(s)
  })

  // Group tasks by stage
  const tasksByStage: Record<string, any[]> = {}
  data.tasks.forEach((t) => {
    const sid = t.template_stage_id as string
    if (!tasksByStage[sid]) tasksByStage[sid] = []
    tasksByStage[sid].push(t)
  })

  // Group subtasks by task
  const subtasksByTask: Record<string, any[]> = {}
  data.subtasks.forEach((st) => {
    const tid = st.template_task_id as string
    if (!subtasksByTask[tid]) subtasksByTask[tid] = []
    subtasksByTask[tid].push(st)
  })

  return (
    <NeuCard variant="raised" padding="md" className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div>
            <h2
              className="text-lg font-semibold text-[var(--text-primary)]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {data.template.name}
            </h2>
            {data.template.description && (
              <p className="text-xs text-[var(--text-muted)] mt-0.5">{data.template.description}</p>
            )}
          </div>
          {data.template.is_system && (
            <NeuBadge color="sapphire" size="sm">System</NeuBadge>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* System template warning */}
      {data.template.is_system && (
        <div className="flex items-start gap-2 rounded-lg p-3 bg-[var(--amber-bg)] border border-[var(--amber)]" style={{ borderColor: 'var(--amber)', borderWidth: 1, borderStyle: 'solid' }}>
          <AlertTriangle className="h-4 w-4 text-[var(--amber)] shrink-0 mt-0.5" />
          <p className="text-xs text-[var(--text-secondary)]">
            System template — modifications will affect all new assets created from this template.
          </p>
        </div>
      )}

      {/* Phase sections */}
      {PHASE_ORDER.map((phaseKey) => (
        <TemplatePhaseSection
          key={phaseKey}
          phaseKey={phaseKey}
          stages={stagesByPhase[phaseKey] ?? []}
          tasksByStage={tasksByStage}
          subtasksByTask={subtasksByTask}
          templateId={data.template.id}
          utils={utils}
        />
      ))}
    </NeuCard>
  )
}
