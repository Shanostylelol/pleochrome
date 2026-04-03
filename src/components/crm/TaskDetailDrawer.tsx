'use client'

import { useEffect, useCallback } from 'react'
import { useState, useRef } from 'react'
import { X, ChevronRight, Edit3 } from 'lucide-react'
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
  const [editingTitle, setEditingTitle] = useState(false)
  const [titleDraft, setTitleDraft] = useState('')
  const titleRef = useRef<HTMLInputElement>(null)

  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  function handleTitleEdit() {
    if (!task) return
    setTitleDraft(task.title)
    setEditingTitle(true)
    setTimeout(() => titleRef.current?.focus(), 50)
  }

  function handleTitleSubmit() {
    const trimmed = titleDraft.trim()
    if (trimmed && trimmed !== task?.title && onUpdate) {
      onUpdate(task!.id, { title: trimmed })
    }
    setEditingTitle(false)
  }

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
          <button onClick={onClose} aria-label="Close task details" className="p-1.5 rounded-[var(--radius-sm)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center">
            <X className="h-5 w-5" />
          </button>
          {stage && (
            <div className="flex items-center gap-1 text-xs text-[var(--text-muted)] truncate">
              <span>{stage.name}</span>
              <ChevronRight className="h-3 w-3 shrink-0" />
            </div>
          )}
          {editingTitle ? (
            <input ref={titleRef} value={titleDraft}
              onChange={(e) => setTitleDraft(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={(e) => { if (e.key === 'Enter') handleTitleSubmit(); if (e.key === 'Escape') setEditingTitle(false) }}
              className="flex-1 text-sm font-semibold bg-[var(--bg-input)] border border-[var(--teal)] text-[var(--text-primary)] rounded-[var(--radius-sm)] px-2 py-1 outline-none min-w-0" />
          ) : (
            <h2 className="text-sm font-semibold text-[var(--text-primary)] truncate flex-1">{task.title}</h2>
          )}
          {onUpdate && !editingTitle && (
            <button onClick={handleTitleEdit} className="p-1 text-[var(--text-muted)] hover:text-[var(--teal)] transition-colors shrink-0">
              <Edit3 className="h-3.5 w-3.5" />
            </button>
          )}
          <NeuBadge color={task.status === 'done' ? 'chartreuse' : task.status === 'blocked' ? 'ruby' : task.status === 'in_progress' ? 'teal' : 'gray'} size="sm">
            {task.status.replace(/_/g, ' ')}
          </NeuBadge>
        </div>

        {/* Content: reuse TaskCardDetails */}
        <div className="p-4" style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}>
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
