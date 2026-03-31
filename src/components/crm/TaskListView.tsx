'use client'

import { useRouter } from 'next/navigation'
import {
  Upload, Calendar, Truck, ArrowUpRight, ArrowDownLeft,
  ShieldCheck, Eye, Search, FileText, Mail, Zap,
  Play, Check,
  type LucideIcon,
} from 'lucide-react'
import { NeuCard, NeuBadge, NeuAvatar } from '@/components/ui'
import { TASK_TYPES, type TaskTypeKey } from '@/lib/constants'
import { TaskGroupedView } from './TaskGroupedView'

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
  stage_id?: string | null
  assets?: { name: string; reference_code: string } | null
  asset_stages?: { name: string; phase: string } | null
  team_members?: { id: string; full_name: string } | null
  subtasks?: Array<{ id: string; status: string }> | null
}

interface TaskListViewProps {
  tasks: TaskItem[]
  onUpdateStatus?: (taskId: string, status: string) => void
  onComplete?: (taskId: string) => void
  grouped?: boolean
}

const statusBadge: Record<string, { label: string; color: 'gray' | 'teal' | 'ruby' | 'chartreuse' | 'amber' }> = {
  todo: { label: 'To Do', color: 'gray' },
  in_progress: { label: 'In Progress', color: 'teal' },
  blocked: { label: 'Blocked', color: 'ruby' },
  pending_approval: { label: 'Pending Approval', color: 'amber' },
  approved: { label: 'Approved', color: 'chartreuse' },
  rejected: { label: 'Rejected', color: 'ruby' },
  done: { label: 'Done', color: 'chartreuse' },
  cancelled: { label: 'Cancelled', color: 'gray' },
}

const typeBadgeColor: Record<string, 'teal' | 'amethyst' | 'amber' | 'ruby' | 'chartreuse' | 'sapphire' | 'emerald' | 'gray'> = {
  document_upload: 'teal',
  meeting: 'amethyst',
  physical_action: 'amber',
  payment_outgoing: 'ruby',
  payment_incoming: 'chartreuse',
  approval: 'sapphire',
  review: 'teal',
  due_diligence: 'emerald',
  filing: 'sapphire',
  communication: 'amethyst',
  automated: 'amber',
}

function isOverdue(task: TaskItem): boolean {
  if (!task.due_date || task.status === 'done') return false
  return new Date(task.due_date) < new Date()
}

export function TaskListView({ tasks, onUpdateStatus, onComplete, grouped }: TaskListViewProps) {
  if (tasks.length === 0) {
    return (
      <NeuCard variant="pressed" padding="lg" className="text-center">
        <p className="text-sm text-[var(--text-muted)]">No tasks found</p>
      </NeuCard>
    )
  }

  if (grouped) return <TaskGroupedView tasks={tasks} onUpdateStatus={onUpdateStatus} onComplete={onComplete} />

  return (
    <div className="overflow-x-auto">
      <NeuCard variant="raised" padding="none">
        <div className="hidden md:grid grid-cols-[1fr_120px_140px_120px_100px_90px_80px_72px] gap-3 px-4 py-2.5 border-b border-[var(--border)]">
          {['Title', 'Type', 'Asset', 'Stage', 'Assignee', 'Due', 'Status', ''].map((h) => (
            <span key={h || 'action'} className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
              {h}
            </span>
          ))}
        </div>
        <div className="divide-y divide-[var(--border)]">
          {tasks.map((task) => (
            <TaskRow key={task.id} task={task} onUpdateStatus={onUpdateStatus} onComplete={onComplete} />
          ))}
        </div>
      </NeuCard>
    </div>
  )
}

function TaskRow({
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
  const status = statusBadge[task.status] ?? { label: task.status, color: 'gray' as const }
  const overdue = isOverdue(task)

  const formattedDue = task.due_date
    ? new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : null

  const subtaskList = task.subtasks ?? []
  const doneCount = subtaskList.filter((s) => s.status === 'done').length

  const handleTitleClick = () => {
    if (task.asset_id) router.push(`/crm/assets/${task.asset_id}?tab=workflow`)
  }

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-[1fr_120px_140px_120px_100px_90px_80px_72px] gap-2 md:gap-3 px-4 py-3 hover:bg-[var(--bg-elevated)] transition-colors items-center"
      style={overdue ? { borderLeft: '3px solid var(--ruby)' } : undefined}
    >
      {/* Title */}
      <div className="flex items-center gap-2 min-w-0">
        <TaskIcon
          className="h-4 w-4 shrink-0"
          style={{ color: typeConfig?.color ?? 'var(--text-muted)' }}
        />
        <button
          onClick={handleTitleClick}
          className="text-sm font-medium text-[var(--text-primary)] truncate text-left hover:text-[var(--teal)] transition-colors cursor-pointer"
        >
          {task.title}
        </button>
        {subtaskList.length > 0 && (
          <span className="text-[10px] text-[var(--text-muted)] shrink-0">
            {doneCount}/{subtaskList.length}
          </span>
        )}
      </div>

      {/* Type */}
      <div>
        <NeuBadge color={typeBadgeColor[task.task_type] ?? 'gray'} size="sm">
          {typeConfig?.label ?? task.task_type.replace(/_/g, ' ')}
        </NeuBadge>
      </div>

      {/* Asset */}
      <div className="min-w-0">
        {task.assets?.name ? (
          <button
            onClick={handleTitleClick}
            className="text-xs text-[var(--text-muted)] hover:text-[var(--teal)] transition-colors truncate block text-left cursor-pointer"
          >
            {task.assets.name}
          </button>
        ) : (
          <span className="text-xs text-[var(--text-placeholder)]">--</span>
        )}
      </div>

      {/* Stage */}
      <div className="min-w-0">
        {task.asset_stages?.name ? (
          <span className="text-xs text-[var(--text-muted)] truncate block">
            {task.asset_stages.name}
          </span>
        ) : (
          <span className="text-xs text-[var(--text-placeholder)]">--</span>
        )}
      </div>

      {/* Assignee */}
      <div>
        {task.team_members?.full_name ? (
          <NeuAvatar name={task.team_members.full_name} size="sm" />
        ) : (
          <span className="text-xs text-[var(--text-placeholder)]">--</span>
        )}
      </div>

      {/* Due */}
      <div>
        {formattedDue ? (
          <span className="text-xs" style={{ color: overdue ? 'var(--ruby)' : 'var(--text-muted)' }}>
            {formattedDue}
          </span>
        ) : (
          <span className="text-xs text-[var(--text-placeholder)]">--</span>
        )}
      </div>

      {/* Status */}
      <div>
        <NeuBadge color={status.color} size="sm">{status.label}</NeuBadge>
      </div>

      {/* Action */}
      <div>
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
    </div>
  )
}
