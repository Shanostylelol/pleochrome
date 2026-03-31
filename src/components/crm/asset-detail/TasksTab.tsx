'use client'

import { useCallback } from 'react'
import { CheckSquare } from 'lucide-react'
import { trpc } from '@/lib/trpc'
import { NeuCard } from '@/components/ui/NeuCard'
import { TaskCard, type Task } from '@/components/crm/TaskCard'
import type { Subtask } from '@/components/crm/SubtaskChecklist'

// ── Types ─────────────────────────────────────────────────
interface TasksTabProps {
  assetId: string
  tasks: Task[]
  subtasks: Array<{ id: string; task_id: string; title: string; status: string; assignee?: { name: string; avatar_url?: string } }>
}

// ── Component ─────────────────────────────────────────────
export function TasksTab({ assetId, tasks, subtasks }: TasksTabProps) {
  const utils = trpc.useUtils()
  const invalidate = useCallback(
    () => utils.assets.getById.invalidate({ assetId }),
    [utils, assetId],
  )

  const completeTask = trpc.tasks.complete.useMutation({ onSuccess: invalidate })
  const completeSubtask = trpc.subtasks.complete.useMutation({ onSuccess: invalidate })
  const toggleTaskHidden = trpc.tasks.toggleHidden.useMutation({ onSuccess: invalidate })
  const createSubtask = trpc.subtasks.create.useMutation({ onSuccess: invalidate })

  // Group subtasks by task
  const subtasksByTask = new Map<string, Subtask[]>()
  for (const st of subtasks) {
    if (!subtasksByTask.has(st.task_id)) subtasksByTask.set(st.task_id, [])
    subtasksByTask.get(st.task_id)!.push({
      id: st.id,
      title: st.title,
      status: st.status as Subtask['status'],
      assignee: st.assignee,
    })
  }

  if (tasks.length === 0) {
    return (
      <NeuCard variant="pressed" padding="lg" className="text-center">
        <CheckSquare className="h-10 w-10 text-[var(--text-placeholder)] mx-auto mb-3" />
        <p className="text-sm text-[var(--text-muted)]">No tasks for this asset.</p>
      </NeuCard>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-[var(--text-secondary)]">
        {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} total
      </p>
      <div className="space-y-2">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            subtasks={subtasksByTask.get(task.id) ?? []}
            onComplete={(taskId) => completeTask.mutate({ taskId })}
            onHide={(taskId) => toggleTaskHidden.mutate({ taskId })}
            onAddSubtask={(taskId, title) => createSubtask.mutate({ taskId, title })}
            onReorderSubtasks={() => {}}
          />
        ))}
      </div>
    </div>
  )
}
