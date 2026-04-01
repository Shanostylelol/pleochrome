'use client'

import { useState, useRef, useEffect, type KeyboardEvent } from 'react'
import {
  ChevronDown, Check, EyeOff, MoreHorizontal,
  Upload, Calendar, Truck, ArrowUpRight, ArrowDownLeft,
  ShieldCheck, Eye, Search, FileText, Mail, Zap,
  Play, RotateCcw, Trash2, Users, type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { NeuCard } from '@/components/ui/NeuCard'
import { NeuCheckbox } from '@/components/ui/NeuCheckbox'
import { NeuBadge } from '@/components/ui/NeuBadge'
import { NeuAvatar } from '@/components/ui/NeuAvatar'
import { NeuConfirmDialog } from '@/components/ui/NeuConfirmDialog'
import { NeuButton } from '@/components/ui/NeuButton'
import { TASK_TYPES, TASK_STATUSES, type TaskTypeKey, type TaskStatusKey } from '@/lib/constants'
import { type Subtask } from './SubtaskChecklist'
import { TaskCardDetails } from './TaskCardDetails'

// ── Icon map ──────────────────────────────────────────────
const ICON_MAP: Record<string, LucideIcon> = {
  Upload, Calendar, Truck, ArrowUpRight, ArrowDownLeft,
  ShieldCheck, Eye, Search, FileText, Mail, Zap,
}

// ── Types ─────────────────────────────────────────────────
export interface Task {
  id: string
  title: string
  description?: string
  notes?: string
  task_type: TaskTypeKey
  status: TaskStatusKey
  due_date?: string
  assigned_to?: string | null
  assignee?: { name: string; avatar_url?: string }
  payment_amount?: number
  payment_direction?: 'incoming' | 'outgoing'
  partner_id?: string
}

export interface TaskCardProps {
  task: Task
  subtasks: Subtask[]
  assetId?: string
  onComplete: (taskId: string) => void
  onHide: (taskId: string) => void
  onAddSubtask: (taskId: string, title: string, subtaskType?: string) => void
  onReorderSubtasks: (taskId: string, subtaskIds: string[]) => void
  onUpdateStatus?: (taskId: string, status: TaskStatusKey) => void
  onDelete?: (taskId: string) => void
  onUpdate?: (taskId: string, fields: {
    title?: string; description?: string; notes?: string;
    taskType?: TaskTypeKey; dueDate?: string | null; assignedTo?: string | null
  }) => void
  onDeleteSubtask?: (subtaskId: string) => void
  onUpdateSubtask?: (subtaskId: string, fields: { title?: string; subtaskType?: string; notes?: string; status?: string }) => void
  onCompleteSubtask?: (subtaskId: string) => void
  selectable?: boolean
  selected?: boolean
  onSelect?: (taskId: string) => void
}

const statusBadgeColor: Record<TaskStatusKey, 'gray' | 'teal' | 'chartreuse' | 'ruby' | 'amber'> = {
  todo: 'gray', in_progress: 'teal', blocked: 'ruby', pending_approval: 'amber',
  approved: 'chartreuse', rejected: 'ruby', done: 'chartreuse', cancelled: 'gray',
}

const ALL_STATUSES = Object.keys(TASK_STATUSES) as TaskStatusKey[]

// ── Dropdown menu (extracted to stay under 250 lines) ─────
function TaskMenu({ task, onHide, onUpdateStatus, onDelete, onClose }: {
  task: Task
  onHide: (id: string) => void
  onUpdateStatus?: (id: string, s: TaskStatusKey) => void
  onDelete?: (id: string) => void
  onClose: () => void
}) {
  const [statusOpen, setStatusOpen] = useState(false)
  const menuBtn = cn(
    'flex items-center gap-2 w-full px-3 py-2 text-sm rounded-[var(--radius-sm)]',
    'text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] transition-colors',
  )
  return (
    <div className="absolute right-0 top-8 z-20 neu-raised-sm p-1 min-w-[160px]">
      <button onClick={() => { onHide(task.id); onClose() }} className={menuBtn}>
        <EyeOff className="h-3.5 w-3.5" /> Hide Task
      </button>
      {onUpdateStatus && (
        <div className="relative">
          <button onClick={() => setStatusOpen(!statusOpen)} className={menuBtn}>
            <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', statusOpen && 'rotate-180')} />
            Set Status
          </button>
          {statusOpen && (
            <div className="ml-2 mt-0.5 p-1 border-l border-[var(--border)]">
              {ALL_STATUSES.map((s) => (
                <button key={s} onClick={() => { onUpdateStatus(task.id, s); onClose() }}
                  className={cn(
                    'flex items-center gap-2 w-full px-3 py-1.5 text-xs rounded-[var(--radius-sm)]',
                    'hover:bg-[var(--bg-elevated)] transition-colors',
                    s === task.status ? 'text-[var(--text-primary)] font-medium' : 'text-[var(--text-secondary)]',
                  )}>
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: TASK_STATUSES[s].color }} />
                  {TASK_STATUSES[s].label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      {onDelete && (
        <button onClick={() => { onDelete(task.id); onClose() }}
          className={cn(menuBtn, '!text-[var(--ruby)] hover:!bg-[color-mix(in_srgb,var(--ruby)_10%,transparent)]')}>
          <Trash2 className="h-3.5 w-3.5" /> Delete Task
        </button>
      )}
    </div>
  )
}

// ── Component ─────────────────────────────────────────────
export function TaskCard({
  task, subtasks, assetId, onComplete, onHide, onAddSubtask,
  onReorderSubtasks, onUpdateStatus,
  onDelete, onUpdate, onDeleteSubtask, onUpdateSubtask, onCompleteSubtask,
  selectable, selected, onSelect,
}: TaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [editingTitle, setEditingTitle] = useState(false)
  const [titleValue, setTitleValue] = useState(task.title)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const titleInputRef = useRef<HTMLInputElement>(null)

  const isDone = task.status === 'done'
  const typeConfig = TASK_TYPES[task.task_type]
  const statusConfig = TASK_STATUSES[task.status]
  const TaskIcon = ICON_MAP[typeConfig.icon] ?? FileText
  const formattedDue = task.due_date
    ? new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : null

  useEffect(() => {
    if (editingTitle && titleInputRef.current) {
      titleInputRef.current.focus()
      titleInputRef.current.select()
    }
  }, [editingTitle])

  function handleTitleSubmit() {
    const trimmed = titleValue.trim()
    if (trimmed && trimmed !== task.title) onUpdate?.(task.id, { title: trimmed })
    else setTitleValue(task.title)
    setEditingTitle(false)
  }

  function handleTitleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleTitleSubmit()
    if (e.key === 'Escape') { setTitleValue(task.title); setEditingTitle(false) }
  }

  function renderPrimaryAction() {
    if (task.status === 'todo' && onUpdateStatus) return (
      <NeuButton variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onUpdateStatus(task.id, 'in_progress') }}
        icon={<Play className="h-3.5 w-3.5" />} className="!h-7 !min-h-[44px] !min-w-[44px] !px-2 text-[var(--teal)]" />
    )
    if (task.status === 'in_progress') return (
      <NeuButton variant="success" size="sm" onClick={(e) => { e.stopPropagation(); onComplete(task.id) }}
        icon={<Check className="h-3.5 w-3.5" />} className="!h-7 !min-h-[44px] !min-w-[44px] !px-2" />
    )
    if (task.status === 'blocked' && onUpdateStatus) return (
      <NeuButton variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onUpdateStatus(task.id, 'in_progress') }}
        icon={<RotateCcw className="h-3.5 w-3.5" />} className="!h-7 !min-h-[44px] !min-w-[44px] !px-2 text-[var(--amber)]" />
    )
    return null
  }

  return (
    <NeuCard variant={isDone ? 'flat' : 'raised-sm'} padding="none"
      className={cn('overflow-hidden transition-opacity', isDone && 'opacity-70')}>
      <div className="flex">
        <div className="w-1 shrink-0 rounded-l-[var(--radius-md)]" style={{ background: typeConfig.color }} />
        <div className="flex-1 p-3">
          <div className="flex items-start gap-2">
            {/* Selection checkbox */}
            {selectable && (
              <NeuCheckbox checked={!!selected} onChange={() => onSelect?.(task.id)} color="teal" />
            )}
            {/* Type icon */}
            <div className="flex items-center justify-center w-7 h-7 rounded-[var(--radius-sm)] shrink-0"
              style={{ background: `color-mix(in srgb, ${typeConfig.color} 15%, transparent)` }}>
              <TaskIcon className="h-4 w-4" style={{ color: typeConfig.color }} />
            </div>
            {/* Title + meta */}
            <div className="flex-1 min-w-0">
              {editingTitle ? (
                <input ref={titleInputRef} value={titleValue}
                  onChange={(e) => setTitleValue(e.target.value)}
                  onBlur={handleTitleSubmit} onKeyDown={handleTitleKeyDown}
                  className={cn(
                    'w-full h-7 text-sm font-medium rounded-[var(--radius-sm)] px-1.5',
                    'bg-[var(--bg-input)] text-[var(--text-primary)]',
                    'shadow-[var(--shadow-pressed)] border border-[var(--border)]',
                    'focus:outline-none focus:border-[var(--teal)]',
                  )} />
              ) : (
                <button onClick={() => setIsExpanded(!isExpanded)}
                  onDoubleClick={(e) => { e.preventDefault(); if (onUpdate) setEditingTitle(true) }}
                  className="flex items-center gap-1.5 text-left w-full group">
                  {isDone && <Check className="h-4 w-4 text-[var(--chartreuse)] shrink-0" />}
                  <span className={cn('text-sm font-medium truncate', isDone
                    ? 'line-through text-[var(--text-muted)]'
                    : 'text-[var(--text-primary)] group-hover:text-[var(--teal)]')}>
                    {task.title}
                  </span>
                  <ChevronDown className={cn('h-3.5 w-3.5 text-[var(--text-muted)] transition-transform shrink-0 ml-auto',
                    isExpanded && 'rotate-180')} />
                </button>
              )}
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <NeuBadge color={statusBadgeColor[task.status]} size="sm">{statusConfig.label}</NeuBadge>
                {formattedDue && (
                  <span className="text-[11px] text-[var(--text-muted)] flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {formattedDue}
                  </span>
                )}
                {task.assignee && <NeuAvatar name={task.assignee.name} src={task.assignee.avatar_url} size="sm" />}
                {task.partner_id && (
                  <NeuBadge color="amethyst" size="sm">
                    <Users className="h-3 w-3 mr-0.5 inline" />Partner Assigned
                  </NeuBadge>
                )}
              </div>
            </div>
            {/* Actions */}
            <div className="flex items-center gap-1 shrink-0 relative">
              {renderPrimaryAction()}
              <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Task actions"
                className="p-2 rounded-[var(--radius-sm)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                <MoreHorizontal className="h-4 w-4" />
              </button>
              {menuOpen && (
                <TaskMenu task={task} onHide={onHide} onUpdateStatus={onUpdateStatus}
                  onDelete={onDelete ? () => { setMenuOpen(false); setConfirmDelete(true) } : undefined}
                  onClose={() => setMenuOpen(false)} />
              )}
            </div>
          </div>
          {isExpanded && (
            <TaskCardDetails task={task} subtasks={subtasks} assetId={assetId}
              onComplete={onCompleteSubtask ?? onComplete}
              onAddSubtask={onAddSubtask} onUpdate={onUpdate} onDeleteSubtask={onDeleteSubtask}
              onUpdateSubtask={onUpdateSubtask} onReorderSubtasks={(ids: string[]) => onReorderSubtasks(task.id, ids)} />
          )}
        </div>
      </div>
      <NeuConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={() => { onDelete?.(task.id); setConfirmDelete(false) }}
        title="Delete Task"
        message={`Delete "${task.title}"? This cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
      />
    </NeuCard>
  )
}
