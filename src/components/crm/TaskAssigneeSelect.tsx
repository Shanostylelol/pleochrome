'use client'

import { cn } from '@/lib/utils'
import { NeuAvatar } from '@/components/ui/NeuAvatar'
import { trpc } from '@/lib/trpc'
import type { Task } from './TaskCard'
import type { TaskTypeKey } from '@/lib/constants'

interface TaskAssigneeSelectProps {
  task: Task
  onUpdate?: (taskId: string, fields: {
    title?: string
    description?: string
    notes?: string
    taskType?: TaskTypeKey
    dueDate?: string | null
    assignedTo?: string | null
  }) => void
}

export function TaskAssigneeSelect({ task, onUpdate }: TaskAssigneeSelectProps) {
  const { data: members = [] } = trpc.team.listActive.useQuery()
  const current = task.assignee
  return (
    <div>
      <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1 block">Assigned To</span>
      <div className="flex items-center gap-2">
        {current && <NeuAvatar name={current.name} src={current.avatar_url} size="sm" />}
        <select value={task.assigned_to ?? ''}
          onChange={(e) => onUpdate?.(task.id, { assignedTo: e.target.value || null })}
          className={cn('h-7 text-xs rounded-[var(--radius-sm)] px-2 flex-1',
            'bg-[var(--bg-input)] text-[var(--text-primary)]',
            'shadow-[var(--shadow-pressed)] border border-[var(--border)]',
            'focus:outline-none focus:border-[var(--teal)]')}>
          <option value="">Unassigned</option>
          {(members as Array<{ id: string; full_name: string; role: string }>).map((m) => (
            <option key={m.id} value={m.id}>{m.full_name} ({m.role})</option>
          ))}
        </select>
      </div>
    </div>
  )
}
