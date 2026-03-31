'use client'

import { useRouter } from 'next/navigation'
import {
  Upload, Calendar, Truck, ArrowUpRight, ArrowDownLeft,
  ShieldCheck, Eye, Search, FileText, Mail, Zap,
  Play, Check, AlertTriangle,
  type LucideIcon,
} from 'lucide-react'
import { NeuCard, NeuBadge, NeuAvatar, NeuProgress } from '@/components/ui'
import { TASK_TYPES, type TaskTypeKey } from '@/lib/constants'

const ICON_MAP: Record<string, LucideIcon> = {
  Upload, Calendar, Truck, ArrowUpRight, ArrowDownLeft,
  ShieldCheck, Eye, Search, FileText, Mail, Zap,
}

interface TaskItem {
  id: string
  title: string
  task_type: string
  status: string
  due_date?: string | null
  asset_id?: string | null
  assigned_to?: string | null
  assets?: { name: string; reference_code: string } | null
  asset_stages?: { name: string; phase: string } | null
  team_members?: { id: string; full_name: string } | null
  subtasks?: Array<{ id: string; status: string }> | null
}

interface TaskKanbanViewProps {
  tasks: TaskItem[]
  onUpdateStatus?: (taskId: string, status: string) => void
  onComplete?: (taskId: string) => void
}

const COLUMNS = [
  { key: 'todo', label: 'To Do', color: 'var(--text-muted)' },
  { key: 'in_progress', label: 'In Progress', color: 'var(--teal)' },
  { key: 'blocked', label: 'Blocked', color: 'var(--ruby)' },
  { key: 'done', label: 'Done', color: 'var(--chartreuse)' },
] as const

function isOverdue(task: TaskItem): boolean {
  if (!task.due_date || task.status === 'done') return false
  return new Date(task.due_date) < new Date()
}

export function TaskKanbanView({ tasks, onUpdateStatus, onComplete }: TaskKanbanViewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {COLUMNS.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.key)
        return (
          <div key={col.key}>
            {/* Column header */}
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: col.color }}
              />
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                {col.label}
              </span>
              <span className="text-[10px] font-bold text-[var(--text-muted)] bg-[var(--bg-elevated)] px-1.5 py-0.5 rounded-full">
                {colTasks.length}
              </span>
            </div>

            {/* Column trough */}
            <NeuCard variant="pressed" padding="sm" className="min-h-[200px] space-y-2">
              {colTasks.length === 0 ? (
                <p className="text-xs text-[var(--text-placeholder)] text-center py-8">
                  No tasks
                </p>
              ) : (
                colTasks.map((task) => (
                  <KanbanCard
                    key={task.id}
                    task={task}
                    onUpdateStatus={onUpdateStatus}
                    onComplete={onComplete}
                  />
                ))
              )}
            </NeuCard>
          </div>
        )
      })}
    </div>
  )
}

function KanbanCard({
  task,
  onUpdateStatus,
  onComplete,
}: {
  task: TaskItem
  onUpdateStatus?: (taskId: string, status: string) => void
  onComplete?: (taskId: string) => void
}) {
  const router = useRouter()
  const typeKey = task.task_type as TaskTypeKey
  const typeConfig = TASK_TYPES[typeKey]
  const TaskIcon = typeConfig ? ICON_MAP[typeConfig.icon] ?? FileText : FileText
  const overdue = isOverdue(task)

  const formattedDue = task.due_date
    ? new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : null

  const subtaskList = task.subtasks ?? []
  const doneCount = subtaskList.filter((s) => s.status === 'done').length
  const totalCount = subtaskList.length

  const handleTitleClick = () => {
    if (task.asset_id) router.push(`/crm/assets/${task.asset_id}?tab=workflow`)
  }

  return (
    <NeuCard variant="raised-sm" padding="sm" className="space-y-2">
      {/* Overdue badge */}
      {overdue && (
        <div className="flex items-center gap-1">
          <NeuBadge color="ruby" size="sm">
            <AlertTriangle className="h-3 w-3 mr-0.5" />
            OVERDUE
          </NeuBadge>
        </div>
      )}

      {/* Title row */}
      <div className="flex items-start gap-2">
        <div
          className="flex items-center justify-center w-6 h-6 rounded-[var(--radius-sm)] shrink-0 mt-0.5"
          style={{
            background: typeConfig
              ? `color-mix(in srgb, ${typeConfig.color} 15%, transparent)`
              : 'var(--bg-elevated)',
          }}
        >
          <TaskIcon
            className="h-3.5 w-3.5"
            style={{ color: typeConfig?.color ?? 'var(--text-muted)' }}
          />
        </div>
        <button
          onClick={handleTitleClick}
          className="text-sm font-medium text-[var(--text-primary)] leading-tight line-clamp-2 text-left hover:text-[var(--teal)] transition-colors cursor-pointer"
        >
          {task.title}
        </button>
      </div>

      {/* Asset name + stage context */}
      {task.assets?.name && (
        <p className="text-[11px] text-[var(--text-muted)] truncate">
          {task.assets.name}
        </p>
      )}
      {task.asset_stages?.name && (
        <p className="text-[10px] text-[var(--text-placeholder)] truncate">
          {task.asset_stages.name}
        </p>
      )}

      {/* Subtask progress */}
      {totalCount > 0 && (
        <div className="flex items-center gap-2">
          <NeuProgress value={doneCount} max={totalCount} size="sm" color="teal" />
          <span className="text-[10px] text-[var(--text-muted)] whitespace-nowrap">
            {doneCount}/{totalCount}
          </span>
        </div>
      )}

      {/* Footer: due date + assignee + action */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {formattedDue && (
            <span
              className="text-[11px] flex items-center gap-1"
              style={{ color: overdue ? 'var(--ruby)' : 'var(--text-muted)' }}
            >
              <Calendar className="h-3 w-3" /> {formattedDue}
            </span>
          )}
          {task.team_members?.full_name && (
            <NeuAvatar name={task.team_members.full_name} size="sm" />
          )}
        </div>

        {/* Action button */}
        {task.status === 'todo' && onUpdateStatus && (
          <button
            onClick={() => onUpdateStatus(task.id, 'in_progress')}
            className="flex items-center gap-1 px-2 py-1 rounded-[var(--radius-sm)] text-[10px] font-semibold text-[var(--teal)] bg-[color-mix(in_srgb,var(--teal)_10%,transparent)] hover:bg-[color-mix(in_srgb,var(--teal)_20%,transparent)] transition-colors"
            title="Start task"
          >
            <Play className="h-3 w-3" /> Start
          </button>
        )}
        {task.status === 'in_progress' && onComplete && (
          <button
            onClick={() => onComplete(task.id)}
            className="flex items-center gap-1 px-2 py-1 rounded-[var(--radius-sm)] text-[10px] font-semibold text-[var(--chartreuse)] bg-[color-mix(in_srgb,var(--chartreuse)_10%,transparent)] hover:bg-[color-mix(in_srgb,var(--chartreuse)_20%,transparent)] transition-colors"
            title="Complete task"
          >
            <Check className="h-3 w-3" /> Done
          </button>
        )}
      </div>
    </NeuCard>
  )
}
