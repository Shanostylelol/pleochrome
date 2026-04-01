'use client'

import { useState } from 'react'
import { Clock, Paperclip, MessageCircle, Activity } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TASK_TYPES, type TaskTypeKey } from '@/lib/constants'
import { NeuButton, NeuInput } from '@/components/ui'
import { trpc } from '@/lib/trpc'
import { SubtaskChecklist, type Subtask } from './SubtaskChecklist'
import { EntityFileList } from './EntityFileList'
import { EntityCommentThread } from './EntityCommentThread'
import { TaskActivityList } from './TaskActivityList'
import { TaskAssigneeSelect } from './TaskAssigneeSelect'
import { TaskDetailSection } from './TaskDetailSection'
import type { Task } from './TaskCard'

// ── Types ─────────────────────────────────────────────────
export interface TaskCardDetailsProps {
  task: Task
  subtasks: Subtask[]
  assetId?: string
  onComplete: (taskId: string) => void
  onAddSubtask: (taskId: string, title: string, subtaskType?: string) => void
  onUpdate?: (taskId: string, fields: {
    title?: string
    description?: string
    notes?: string
    taskType?: TaskTypeKey
    dueDate?: string | null
    assignedTo?: string | null
  }) => void
  onDeleteSubtask?: (subtaskId: string) => void
  onUpdateSubtask?: (subtaskId: string, fields: { title?: string; subtaskType?: string; notes?: string; status?: string }) => void
  onReorderSubtasks?: (subtaskIds: string[]) => void
}

// ── Task type badge options ───────────────────────────────
const TASK_TYPE_KEYS = Object.keys(TASK_TYPES) as TaskTypeKey[]

// ── Component ─────────────────────────────────────────────
export function TaskCardDetails({
  task,
  subtasks,
  assetId,
  onComplete,
  onAddSubtask,
  onUpdate,
  onDeleteSubtask,
  onUpdateSubtask,
  onReorderSubtasks,
}: TaskCardDetailsProps) {
  const { data: currentUser } = trpc.team.getCurrentUser.useQuery()
  const [editingDueDate, setEditingDueDate] = useState(false)
  const [dueValue, setDueValue] = useState(task.due_date ? task.due_date.slice(0, 10) : '')
  const [typeMenuOpen, setTypeMenuOpen] = useState(false)
  const [showReminder, setShowReminder] = useState(false)
  const [reminderDate, setReminderDate] = useState('')
  const [reminderDesc, setReminderDesc] = useState('')

  const reminderMutation = trpc.reminders.create.useMutation({
    onSuccess: () => { setShowReminder(false); setReminderDate(''); setReminderDesc('') },
  })

  function handleSetReminder() {
    if (!reminderDate) return
    reminderMutation.mutate({
      title: task.title,
      remindAt: new Date(reminderDate + 'T09:00:00Z').toISOString(),
      description: reminderDesc.trim() || undefined,
      taskId: task.id,
      assetId: assetId || undefined,
    })
  }

  const typeConfig = TASK_TYPES[task.task_type]

  function handleDueDateChange(value: string) {
    setDueValue(value)
    const isoDate = value ? new Date(value + 'T00:00:00Z').toISOString() : null
    onUpdate?.(task.id, { dueDate: isoDate })
    setEditingDueDate(false)
  }

  function handleTypeChange(newType: TaskTypeKey) {
    onUpdate?.(task.id, { taskType: newType })
    setTypeMenuOpen(false)
  }

  return (
    <div className="mt-3 pt-3 border-t border-[var(--border)] space-y-3">
      {/* Task type badge */}
      <div className="relative inline-block">
        <button onClick={() => setTypeMenuOpen(!typeMenuOpen)}
          className={cn('inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[var(--radius-sm)] text-[11px] font-medium',
            'border border-[var(--border)] hover:border-[var(--text-muted)] transition-colors')}
          style={{ color: typeConfig.color }}>
          {typeConfig.label}
        </button>
        {typeMenuOpen && (
          <div className="absolute left-0 top-7 z-20 neu-raised-sm p-1 min-w-[160px] max-h-48 overflow-y-auto">
            {TASK_TYPE_KEYS.map((key) => (
              <button key={key} onClick={() => handleTypeChange(key)}
                className={cn('flex items-center gap-2 w-full px-3 py-1.5 text-xs rounded-[var(--radius-sm)]',
                  'hover:bg-[var(--bg-elevated)] transition-colors',
                  key === task.task_type ? 'text-[var(--text-primary)] font-medium' : 'text-[var(--text-secondary)]')}>
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: TASK_TYPES[key].color }} />
                {TASK_TYPES[key].label}
              </button>
            ))}
          </div>
        )}
      </div>

      {task.description && (
        <p className="text-sm text-[var(--text-secondary)]">{task.description}</p>
      )}
      {task.notes && (
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Notes
          </span>
          <p className="text-sm text-[var(--text-secondary)] mt-0.5">{task.notes}</p>
        </div>
      )}

      {/* Due date editor */}
      <div>
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1 block">
          Due Date
        </span>
        {editingDueDate ? (
          <input
            type="date"
            autoFocus
            value={dueValue}
            onChange={(e) => handleDueDateChange(e.target.value)}
            onBlur={() => setEditingDueDate(false)}
            className={cn(
              'h-8 text-sm rounded-[var(--radius-sm)] px-2',
              'bg-[var(--bg-input)] text-[var(--text-primary)]',
              'shadow-[var(--shadow-pressed)] border border-[var(--border)]',
              'focus:outline-none focus:border-[var(--teal)]'
            )}
          />
        ) : (
          <button
            onClick={() => setEditingDueDate(true)}
            className={cn(
              'text-sm px-2 py-1 rounded-[var(--radius-sm)]',
              'hover:bg-[var(--bg-elevated)] transition-colors',
              task.due_date ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)] italic'
            )}
          >
            {task.due_date
              ? new Date(task.due_date).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })
              : 'Set due date...'}
          </button>
        )}
      </div>

      {/* Assigned To */}
      <TaskAssigneeSelect task={task} onUpdate={onUpdate} />

      {task.payment_amount != null && (
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Payment
          </span>
          <span
            className={cn(
              'text-sm font-semibold',
              task.payment_direction === 'incoming'
                ? 'text-[var(--chartreuse)]'
                : 'text-[var(--ruby)]'
            )}
          >
            {task.payment_direction === 'incoming' ? '+' : '-'}$
            {task.payment_amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>
      )}

      {/* Set Reminder */}
      {!showReminder ? (
        <NeuButton variant="ghost" size="sm" icon={<Clock className="h-3.5 w-3.5" />}
          onClick={() => setShowReminder(true)} className="!h-7 !px-2 text-[var(--text-secondary)]">
          Set Reminder
        </NeuButton>
      ) : (
        <div className="space-y-2 p-2 rounded-[var(--radius-md)] bg-[var(--bg-elevated)]">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Reminder</span>
          <NeuInput type="date" value={reminderDate} onChange={(e) => setReminderDate(e.target.value)} label="Remind on *" />
          <NeuInput placeholder="Optional note..." value={reminderDesc} onChange={(e) => setReminderDesc(e.target.value)} />
          <div className="flex gap-2">
            <NeuButton variant="ghost" size="sm" onClick={() => { setShowReminder(false); setReminderDate(''); setReminderDesc('') }}>Cancel</NeuButton>
            <NeuButton size="sm" onClick={handleSetReminder} loading={reminderMutation.isPending} disabled={!reminderDate}>Save</NeuButton>
          </div>
          {reminderMutation.error && <p className="text-xs text-[var(--ruby)]">{reminderMutation.error.message}</p>}
        </div>
      )}

      {/* Subtasks */}
      <div>
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1 block">
          Subtasks ({subtasks.length})
        </span>
        <SubtaskChecklist
          subtasks={subtasks}
          taskId={task.id}
          assetId={assetId}
          currentUserId={currentUser?.id ?? ''}
          onComplete={(stId) => onComplete(stId)}
          onAddSubtask={(title, subtaskType) => onAddSubtask(task.id, title, subtaskType)}
          onDelete={onDeleteSubtask}
          onUpdate={onUpdateSubtask}
          onReorder={onReorderSubtasks}
        />
      </div>

      {/* Files */}
      <TaskDetailSection icon={<Paperclip className="h-3 w-3" />} label="Files">
        <EntityFileList entityType="task" entityId={task.id} assetId={assetId} />
      </TaskDetailSection>

      {/* Comments */}
      <TaskDetailSection icon={<MessageCircle className="h-3 w-3" />} label="Comments">
        <EntityCommentThread entityType="task" entityId={task.id} assetId={assetId} currentUserId={currentUser?.id ?? ''} />
      </TaskDetailSection>

      {/* Activity */}
      <TaskDetailSection icon={<Activity className="h-3 w-3" />} label="Activity">
        <TaskActivityList taskId={task.id} />
      </TaskDetailSection>
    </div>
  )
}
