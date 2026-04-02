'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronDown, Shield, Play, CheckCircle2, Paperclip, MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NeuCard } from '@/components/ui/NeuCard'
import { NeuBadge } from '@/components/ui/NeuBadge'
import { NeuButton } from '@/components/ui/NeuButton'
import { NeuProgress } from '@/components/ui/NeuProgress'
import { STAGE_STATUSES, type StageStatusKey, type PhaseKey, type TaskStatusKey, type TaskTypeKey } from '@/lib/constants'
import { trpc } from '@/lib/trpc'
import { type Task } from './TaskCard'
import { type Subtask } from './SubtaskChecklist'
import { SortableTaskItem } from './SortableTaskItem'
import { TaskDetailSection } from './TaskDetailSection'
import { EntityFileList } from './EntityFileList'
import { EntityCommentThread } from './EntityCommentThread'
import { StageFooter } from './StageFooter'
import {
  DndContext,
  DragOverlay,
  closestCenter,
  type DragEndEvent,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'

// ── Types ─────────────────────────────────────────────────
export interface Stage {
  id: string
  name: string
  status: StageStatusKey
  phase: PhaseKey
  is_gate: boolean
  sort_order: number
}

export interface StageAccordionProps {
  stage: Stage
  tasks: Task[]
  subtasks: Record<string, Subtask[]>
  isExpanded: boolean
  onToggle: () => void
  onReorderTasks: (stageId: string, taskIds: string[]) => void
  onHideStage: (stageId: string) => void
  onAddTask: (stageId: string) => void
  /** Phase CSS variable color, e.g. var(--phase-lead) */
  phaseColor: string
  onCompleteTask: (taskId: string) => void
  onHideTask: (taskId: string) => void
  onAddSubtask: (taskId: string, title: string, subtaskType?: string) => void
  onReorderSubtasks: (taskId: string, subtaskIds: string[]) => void
  onUpdateStageStatus?: (stageId: string, status: 'not_started' | 'in_progress' | 'completed' | 'skipped') => void
  onUpdateTaskStatus?: (taskId: string, status: TaskStatusKey) => void
  onDeleteTask?: (taskId: string) => void
  onUpdateTask?: (taskId: string, fields: {
    title?: string; description?: string; notes?: string;
    taskType?: TaskTypeKey; dueDate?: string | null; assignedTo?: string | null
  }) => void
  onDeleteSubtask?: (subtaskId: string) => void
  onUpdateSubtask?: (subtaskId: string, fields: { title?: string; subtaskType?: string; notes?: string; status?: string }) => void
  onCompleteSubtask?: (subtaskId: string) => void
  assetId?: string
  currentUserId?: string
}

// ── Status badge color ────────────────────────────────────
const statusBadge: Record<StageStatusKey, 'gray' | 'teal' | 'chartreuse'> = {
  not_started: 'gray',
  in_progress: 'teal',
  completed: 'chartreuse',
  skipped: 'gray',
}

// ── Component ─────────────────────────────────────────────
export function StageAccordion({
  stage,
  tasks,
  subtasks,
  isExpanded,
  onToggle,
  onReorderTasks,
  onHideStage,
  onAddTask,
  phaseColor,
  onCompleteTask,
  onHideTask,
  onAddSubtask,
  onReorderSubtasks,
  onUpdateStageStatus,
  onUpdateTaskStatus,
  onDeleteTask,
  onUpdateTask,
  onDeleteSubtask,
  onUpdateSubtask,
  onCompleteSubtask,
  assetId,
  currentUserId,
}: StageAccordionProps) {
  const [activeDragId, setActiveDragId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState(false)
  const [nameDraft, setNameDraft] = useState(stage.name)
  const utils = trpc.useUtils()
  const renameMut = trpc.stages.rename.useMutation({
    onSuccess: () => utils.assets.getById.invalidate(),
  })
  const statusCfg = STAGE_STATUSES[stage.status]
  const taskCount = tasks.length
  const completedCount = tasks.filter((t) => t.status === 'done').length

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  const taskIds = tasks.map((t) => t.id)

  function handleDragStart(event: DragStartEvent) {
    setActiveDragId(event.active.id as string)
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveDragId(null)
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = taskIds.indexOf(active.id as string)
    const newIndex = taskIds.indexOf(over.id as string)
    if (oldIndex === -1 || newIndex === -1) return
    const newOrder = arrayMove(taskIds, oldIndex, newIndex)
    onReorderTasks(stage.id, newOrder)
  }

  return (
    <NeuCard variant="raised" padding="none" className="overflow-hidden">
      {/* Phase color left border */}
      <div className="flex">
        <div className="w-1 shrink-0 rounded-l-[var(--radius-md)]" style={{ background: phaseColor }} />

        <div className="flex-1">
          {/* Header */}
          <div
            role="button"
            tabIndex={0}
            onClick={onToggle}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle() } }}
            className={cn(
              'w-full px-3 sm:px-4 py-2.5 sm:py-3 text-left cursor-pointer',
              'hover:bg-[var(--bg-elevated)] transition-colors'
            )}
          >
            {/* Top row: name + chevron */}
            <div className="flex items-center gap-2">
              {stage.is_gate && (
                <div className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[var(--amber-bg)] shrink-0">
                  <Shield className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[var(--amber)]" />
                </div>
              )}
              {editingName ? (
                <input
                  autoFocus
                  value={nameDraft}
                  onChange={(e) => setNameDraft(e.target.value)}
                  onBlur={() => {
                    if (nameDraft.trim() && nameDraft.trim() !== stage.name) {
                      renameMut.mutate({ stageId: stage.id, name: nameDraft.trim() })
                    }
                    setEditingName(false)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') { e.currentTarget.blur() }
                    if (e.key === 'Escape') { setNameDraft(stage.name); setEditingName(false) }
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 text-sm font-semibold bg-transparent border-b border-[var(--teal)] text-[var(--text-primary)] outline-none px-0.5 min-w-0"
                />
              ) : (
                <span
                  className="text-sm font-semibold text-[var(--text-primary)] truncate flex-1 cursor-pointer"
                  onDoubleClick={(e) => { e.stopPropagation(); setNameDraft(stage.name); setEditingName(true) }}
                  title="Double-click to rename"
                >
                  {stage.name}
                </span>
              )}
              {stage.is_gate && (
                <NeuBadge color="amber" size="sm">Gate</NeuBadge>
              )}
              <ChevronDown
                className={cn(
                  'h-4 w-4 text-[var(--text-muted)] transition-transform shrink-0',
                  isExpanded && 'rotate-180'
                )}
              />
            </div>

            {/* Bottom row: status + actions + progress (wraps naturally) */}
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <NeuBadge color={statusBadge[stage.status]} size="sm">
                {statusCfg.label}
              </NeuBadge>

              {onUpdateStageStatus && stage.status === 'not_started' && (
                <NeuButton variant="ghost" size="sm" icon={<Play className="h-3 w-3" />}
                  onClick={(e) => { e.stopPropagation(); onUpdateStageStatus(stage.id, 'in_progress') }}
                  className="!h-6 !px-1.5 !text-[11px] text-[var(--teal)]">
                  Start
                </NeuButton>
              )}
              {onUpdateStageStatus && stage.status === 'in_progress' && (
                <NeuButton variant="ghost" size="sm" icon={<CheckCircle2 className="h-3 w-3" />}
                  onClick={(e) => { e.stopPropagation(); onUpdateStageStatus(stage.id, 'completed') }}
                  className="!h-6 !px-1.5 !text-[11px] text-[var(--chartreuse)]">
                  Complete
                </NeuButton>
              )}

              <div className="flex items-center gap-2 ml-auto shrink-0">
                {taskCount > 0 && <div className="w-12 sm:w-16"><NeuProgress value={completedCount} max={taskCount} color="teal" size="sm" /></div>}
                <span className="text-xs text-[var(--text-muted)] tabular-nums whitespace-nowrap">
                  {completedCount}/{taskCount}
                </span>
              </div>
            </div>
          </div>

          {/* Expanded body */}
          <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              style={{ overflow: 'hidden' }}
            >
            <div className="px-4 pb-4 pt-1 border-t border-[var(--border)]">
              {/* Task list with DnD */}
              {tasks.length === 0 ? (
                <p className="text-sm text-[var(--text-muted)] text-center py-6">
                  No tasks in this stage yet.
                </p>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
                    <div className="space-y-2 mt-2">
                      {tasks.map((task) => (
                        <SortableTaskItem
                          key={task.id}
                          task={task}
                          subtasks={subtasks[task.id] ?? []}
                          onCompleteTask={onCompleteTask}
                          onHideTask={onHideTask}
                          onAddSubtask={onAddSubtask}
                          onReorderSubtasks={onReorderSubtasks}
                          onUpdateTaskStatus={onUpdateTaskStatus}
                          onDeleteTask={onDeleteTask}
                          onUpdateTask={onUpdateTask}
                          onDeleteSubtask={onDeleteSubtask}
                          onUpdateSubtask={onUpdateSubtask}
                          onCompleteSubtask={onCompleteSubtask}
                        />
                      ))}
                    </div>
                  </SortableContext>
                  <DragOverlay>
                    {activeDragId && (() => {
                      const t = tasks.find(tk => tk.id === activeDragId)
                      if (!t) return null
                      return (
                        <NeuCard variant="raised" padding="sm" className="shadow-lg opacity-90 max-w-xs">
                          <p className="text-sm font-medium text-[var(--text-primary)] truncate">{t.title}</p>
                        </NeuCard>
                      )
                    })()}
                  </DragOverlay>
                </DndContext>
              )}

              {/* Stage-level files */}
              <TaskDetailSection icon={<Paperclip className="h-3 w-3" />} label="Stage Files" defaultOpen>
                <EntityFileList entityType="stage" entityId={stage.id} assetId={assetId} />
              </TaskDetailSection>

              {/* Stage-level comments */}
              <TaskDetailSection icon={<MessageCircle className="h-3 w-3" />} label="Stage Notes & Comments" defaultOpen>
                <EntityCommentThread entityType="stage" entityId={stage.id} assetId={assetId} currentUserId={currentUserId ?? ''} />
              </TaskDetailSection>

              {/* Footer */}
              <StageFooter stageId={stage.id} onAddTask={onAddTask} onHideStage={onHideStage} />
            </div>
            </motion.div>
          )}
          </AnimatePresence>
        </div>
      </div>
    </NeuCard>
  )
}
