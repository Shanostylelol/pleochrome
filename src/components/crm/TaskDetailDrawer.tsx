'use client'

import { useEffect, useCallback } from 'react'
import { X, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NeuBadge } from '@/components/ui/NeuBadge'
import { TaskCardDetails, type TaskCardDetailsProps } from './TaskCardDetails'
import type { Task } from './TaskCard'
import type { Subtask } from './SubtaskChecklist'
import type { Stage } from './StageAccordion'

interface TaskDetailDrawerProps {
  open: boolean
  onClose: () => void
  task: Task | null
  stage: Stage | null
  subtasks: Subtask[]
  assetId?: string
  onComplete: (taskId: string) => void
  onAddSubtask: (taskId: string, title: string, subtaskType?: string) => void
  onUpdate?: TaskCardDetailsProps['onUpdate']
  onDeleteSubtask?: (subtaskId: string) => void
  onUpdateSubtask?: (subtaskId: string, fields: { title?: string; subtaskType?: string; notes?: string; status?: string }) => void
  onReorderSubtasks?: (subtaskIds: string[]) => void
}

export function TaskDetailDrawer({
  open, onClose, task, stage, subtasks, assetId,
  onComplete, onAddSubtask, onUpdate, onDeleteSubtask, onUpdateSubtask, onReorderSubtasks,
}: TaskDetailDrawerProps) {
  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    if (!open) return
    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', handleEscape); document.body.style.overflow = '' }
  }, [open, handleEscape])

  if (!open || !task) return null

  // Mobile: full-screen overlay. Desktop: slide-in from right.
  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[var(--overlay)]" onClick={onClose} />

      {/* Drawer panel */}
      <div className={cn(
        'absolute bg-[var(--bg-surface)] shadow-[var(--shadow-raised)] overflow-y-auto',
        // Mobile: full screen
        'inset-0 md:inset-y-0 md:left-auto md:right-0 md:w-[520px] md:border-l md:border-[var(--border)]'
      )}>
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center gap-2 px-4 py-3 bg-[var(--bg-surface)] border-b border-[var(--border)]">
          <button onClick={onClose} className="p-1.5 rounded-[var(--radius-sm)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center">
            <X className="h-5 w-5" />
          </button>
          {stage && (
            <div className="flex items-center gap-1 text-xs text-[var(--text-muted)] truncate">
              <span>{stage.name}</span>
              <ChevronRight className="h-3 w-3 shrink-0" />
            </div>
          )}
          <h2 className="text-sm font-semibold text-[var(--text-primary)] truncate flex-1">{task.title}</h2>
          <NeuBadge color={task.status === 'done' ? 'chartreuse' : task.status === 'blocked' ? 'ruby' : task.status === 'in_progress' ? 'teal' : 'gray'} size="sm">
            {task.status.replace(/_/g, ' ')}
          </NeuBadge>
        </div>

        {/* Content: reuse TaskCardDetails */}
        <div className="p-4">
          <TaskCardDetails
            task={task}
            subtasks={subtasks}
            assetId={assetId}
            onComplete={onComplete}
            onAddSubtask={onAddSubtask}
            onUpdate={onUpdate}
            onDeleteSubtask={onDeleteSubtask}
            onUpdateSubtask={onUpdateSubtask}
            onReorderSubtasks={onReorderSubtasks}
          />
        </div>
      </div>
    </div>
  )
}
