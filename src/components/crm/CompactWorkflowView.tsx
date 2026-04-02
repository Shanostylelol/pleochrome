'use client'

import { ChevronRight, CheckCircle2, Clock, AlertTriangle, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NeuCard } from '@/components/ui/NeuCard'
import { NeuBadge } from '@/components/ui/NeuBadge'
import { NeuAvatar } from '@/components/ui/NeuAvatar'
import { NeuSelect } from '@/components/ui/NeuSelect'
import { TASK_STATUSES, TASK_TYPES, PHASES, type PhaseKey, type TaskStatusKey, STAGE_STATUSES, type StageStatusKey } from '@/lib/constants'
import type { Stage } from './StageAccordion'
import type { Task } from './TaskCard'
import type { Subtask } from './SubtaskChecklist'

interface CompactWorkflowViewProps {
  stagesByPhase: Map<PhaseKey, Stage[]>
  tasksByStage: Map<string, Task[]>
  subtasksByTask: Map<string, Subtask[]>
  onUpdateTaskStatus?: (taskId: string, status: TaskStatusKey) => void
  onUpdateStageStatus?: (stageId: string, status: 'not_started' | 'in_progress' | 'completed' | 'skipped') => void
  onSelectTask: (task: Task, stage: Stage) => void
}

const STAGE_STATUS_CYCLE: Array<'not_started' | 'in_progress' | 'completed'> = ['not_started', 'in_progress', 'completed']

const statusIcon: Record<string, React.ReactNode> = {
  todo: <Circle className="h-3 w-3 text-[var(--text-muted)]" />,
  in_progress: <Clock className="h-3 w-3 text-[var(--teal)]" />,
  blocked: <AlertTriangle className="h-3 w-3 text-[var(--ruby)]" />,
  done: <CheckCircle2 className="h-3 w-3 text-[var(--chartreuse)]" />,
}

const statusBadge: Record<StageStatusKey, 'gray' | 'teal' | 'chartreuse'> = {
  not_started: 'gray', in_progress: 'teal', completed: 'chartreuse', skipped: 'gray',
}

const STATUS_OPTIONS = Object.entries(TASK_STATUSES).map(([k, v]) => ({ value: k, label: v.label }))

export function CompactWorkflowView({ stagesByPhase, tasksByStage, subtasksByTask, onUpdateTaskStatus, onUpdateStageStatus, onSelectTask }: CompactWorkflowViewProps) {
  const phases = Array.from(stagesByPhase.entries())

  return (
    <div className="space-y-4">
      {phases.map(([phaseKey, phaseStages]) => (
        <div key={phaseKey}>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ background: `var(--phase-${phaseKey.replace(/_/g, '-')})` }} />
            {PHASES[phaseKey]?.label ?? phaseKey}
            <span className="text-[var(--text-placeholder)] font-normal">{phaseStages.length} stages</span>
          </h3>

          {phaseStages.map((stage) => {
            const tasks = tasksByStage.get(stage.id) ?? []
            const stCfg = STAGE_STATUSES[stage.status]
            const completed = tasks.filter(t => t.status === 'done').length

            return (
              <NeuCard key={stage.id} variant="raised" padding="none" className="mb-2 overflow-hidden">
                {/* Stage header row */}
                <div className="flex items-center gap-2 px-3 py-2 bg-[var(--bg-elevated)] border-b border-[var(--border)]">
                  <div className="w-1 h-4 rounded-full shrink-0" style={{ background: `var(--phase-${phaseKey.replace(/_/g, '-')})` }} />
                  <span className="text-xs font-semibold text-[var(--text-primary)] flex-1 truncate">{stage.name}</span>
                  {stage.is_gate && <NeuBadge color="amber" size="sm">Gate</NeuBadge>}
                  {onUpdateStageStatus ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        const idx = STAGE_STATUS_CYCLE.indexOf(stage.status as typeof STAGE_STATUS_CYCLE[number])
                        const next = STAGE_STATUS_CYCLE[(idx + 1) % STAGE_STATUS_CYCLE.length]
                        onUpdateStageStatus(stage.id, next)
                      }}
                      title="Click to advance stage status"
                      className="shrink-0 transition-transform hover:scale-105"
                    >
                      <NeuBadge color={statusBadge[stage.status]} size="sm">{stCfg.label}</NeuBadge>
                    </button>
                  ) : (
                    <NeuBadge color={statusBadge[stage.status]} size="sm">{stCfg.label}</NeuBadge>
                  )}
                  <span className="text-[11px] text-[var(--text-muted)] tabular-nums">{completed}/{tasks.length}</span>
                </div>

                {/* Task rows */}
                {tasks.length === 0 ? (
                  <p className="text-xs text-[var(--text-muted)] text-center py-3">No tasks</p>
                ) : (
                  <div>
                    {tasks.map((task) => {
                      const subs = subtasksByTask.get(task.id) ?? []
                      const subsDone = subs.filter(s => s.status === 'done').length
                      const typeCfg = TASK_TYPES[task.task_type]
                      const formattedDue = task.due_date ? new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : null

                      return (
                        <div key={task.id}
                          onClick={() => onSelectTask(task, stage)}
                          className={cn(
                            'flex items-center gap-2 px-3 py-2 border-b border-[var(--border)] last:border-b-0',
                            'hover:bg-[var(--bg-elevated)] cursor-pointer transition-colors',
                            'min-h-[44px]'
                          )}
                        >
                          {/* Status icon */}
                          <div className="shrink-0">{statusIcon[task.status] ?? statusIcon.todo}</div>

                          {/* Type dot + Title */}
                          <div className="flex-1 min-w-0 flex items-center gap-1.5">
                            {typeCfg && <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: typeCfg.color }} />}
                            <span className={cn('text-sm truncate', task.status === 'done' && 'line-through text-[var(--text-muted)]')}>
                              {task.title}
                            </span>
                          </div>

                          {/* Subtask count */}
                          {subs.length > 0 && (
                            <span className="text-[11px] text-[var(--text-muted)] tabular-nums shrink-0 hidden sm:inline">
                              {subsDone}/{subs.length}
                            </span>
                          )}

                          {/* Status select (desktop) */}
                          <div className="hidden md:block shrink-0 w-24" onClick={(e) => e.stopPropagation()}>
                            <NeuSelect
                              value={task.status}
                              onChange={(e) => onUpdateTaskStatus?.(task.id, e.target.value as TaskStatusKey)}
                              className="!h-6 !text-[11px] !rounded-[var(--radius-sm)] !px-1.5"
                              options={STATUS_OPTIONS}
                            />
                          </div>

                          {/* Assignee */}
                          {task.assignee && (
                            <div className="shrink-0 hidden sm:block">
                              <NeuAvatar name={task.assignee.name} size="sm" />
                            </div>
                          )}

                          {/* Due date */}
                          {formattedDue && (
                            <span className="text-[11px] text-[var(--text-muted)] shrink-0 hidden lg:inline">{formattedDue}</span>
                          )}

                          <ChevronRight className="h-3 w-3 text-[var(--text-placeholder)] shrink-0" />
                        </div>
                      )
                    })}
                  </div>
                )}
              </NeuCard>
            )
          })}
        </div>
      ))}
    </div>
  )
}
