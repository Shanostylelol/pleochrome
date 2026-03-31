'use client'

import { useRouter } from 'next/navigation'
import {
  Upload, Calendar, Truck, ArrowUpRight, ArrowDownLeft,
  ShieldCheck, Eye, Search, FileText, Mail, Zap,
  Play, Check,
  type LucideIcon,
} from 'lucide-react'
import { NeuCard, NeuBadge } from '@/components/ui'
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
  stage_id?: string | null
  assets?: { name: string; reference_code: string } | null
  asset_stages?: { name: string; phase: string } | null
}

interface TaskGroupedViewProps {
  tasks: TaskItem[]
  onUpdateStatus?: (taskId: string, status: string) => void
  onComplete?: (taskId: string) => void
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

interface AssetGroup {
  assetId: string
  assetName: string
  referenceCode: string
  stages: Map<string, { stageName: string; tasks: TaskItem[] }>
}

export function TaskGroupedView({ tasks, onUpdateStatus, onComplete }: TaskGroupedViewProps) {
  const router = useRouter()

  // Build grouped structure: asset -> stage -> tasks
  const groups: AssetGroup[] = []
  const assetMap = new Map<string, AssetGroup>()

  for (const task of tasks) {
    const aid = task.asset_id ?? 'unassigned'
    let group = assetMap.get(aid)
    if (!group) {
      group = {
        assetId: aid,
        assetName: task.assets?.name ?? 'Unassigned',
        referenceCode: task.assets?.reference_code ?? '',
        stages: new Map(),
      }
      assetMap.set(aid, group)
      groups.push(group)
    }
    const sid = task.stage_id ?? 'no-stage'
    let stage = group.stages.get(sid)
    if (!stage) {
      stage = { stageName: task.asset_stages?.name ?? 'General', tasks: [] }
      group.stages.set(sid, stage)
    }
    stage.tasks.push(task)
  }

  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <NeuCard key={group.assetId} variant="raised" padding="none">
          {/* Asset header */}
          <button
            onClick={() => {
              if (group.assetId !== 'unassigned') router.push(`/crm/assets/${group.assetId}?tab=workflow`)
            }}
            className="w-full flex items-center gap-2 px-4 py-3 border-b border-[var(--border)] text-left hover:bg-[var(--bg-elevated)] transition-colors cursor-pointer"
          >
            <span className="text-sm font-semibold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
              {group.assetName}
            </span>
            {group.referenceCode && (
              <span className="text-[11px] text-[var(--text-muted)] font-mono">
                ({group.referenceCode})
              </span>
            )}
          </button>

          {/* Stages */}
          {Array.from(group.stages.entries()).map(([sid, stage]) => (
            <div key={sid}>
              <div className="px-4 py-2 bg-[var(--bg-body)]">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  {stage.stageName}
                </span>
              </div>
              <div className="divide-y divide-[var(--border)]">
                {stage.tasks.map((task) => {
                  const typeKey = task.task_type as TaskTypeKey
                  const typeConfig = TASK_TYPES[typeKey]
                  const TaskIcon = typeConfig ? ICON_MAP[typeConfig.icon] ?? FileText : FileText
                  const status = statusBadge[task.status] ?? { label: task.status, color: 'gray' as const }
                  const overdue = isOverdue(task)

                  return (
                    <div
                      key={task.id}
                      className="flex items-center gap-3 px-4 py-2.5 pl-8 hover:bg-[var(--bg-elevated)] transition-colors"
                      style={overdue ? { borderLeft: '3px solid var(--ruby)' } : undefined}
                    >
                      <TaskIcon
                        className="h-3.5 w-3.5 shrink-0"
                        style={{ color: typeConfig?.color ?? 'var(--text-muted)' }}
                      />
                      <button
                        onClick={() => { if (task.asset_id) router.push(`/crm/assets/${task.asset_id}?tab=workflow`) }}
                        className="text-sm text-[var(--text-primary)] truncate text-left hover:text-[var(--teal)] transition-colors cursor-pointer flex-1 min-w-0"
                      >
                        {task.title}
                      </button>
                      <NeuBadge color={typeBadgeColor[task.task_type] ?? 'gray'} size="sm">
                        {typeConfig?.label ?? task.task_type.replace(/_/g, ' ')}
                      </NeuBadge>
                      <NeuBadge color={status.color} size="sm">{status.label}</NeuBadge>

                      {/* Action */}
                      {task.status === 'todo' && onUpdateStatus && (
                        <button
                          onClick={() => onUpdateStatus(task.id, 'in_progress')}
                          className="flex items-center gap-1 px-2 py-1 rounded-[var(--radius-sm)] text-[10px] font-semibold text-[var(--teal)] bg-[color-mix(in_srgb,var(--teal)_10%,transparent)] hover:bg-[color-mix(in_srgb,var(--teal)_20%,transparent)] transition-colors shrink-0"
                          title="Start task"
                        >
                          <Play className="h-3 w-3" />
                        </button>
                      )}
                      {task.status === 'in_progress' && onComplete && (
                        <button
                          onClick={() => onComplete(task.id)}
                          className="flex items-center gap-1 px-2 py-1 rounded-[var(--radius-sm)] text-[10px] font-semibold text-[var(--chartreuse)] bg-[color-mix(in_srgb,var(--chartreuse)_10%,transparent)] hover:bg-[color-mix(in_srgb,var(--chartreuse)_20%,transparent)] transition-colors shrink-0"
                          title="Complete task"
                        >
                          <Check className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </NeuCard>
      ))}
    </div>
  )
}
