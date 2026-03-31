'use client'

import { useState } from 'react'
import { Activity, Clock, Download } from 'lucide-react'
import { NeuCard } from '@/components/ui/NeuCard'
import { NeuBadge } from '@/components/ui/NeuBadge'
import { NeuButton } from '@/components/ui/NeuButton'
import { saveAs } from 'file-saver'

// ── Types ─────────────────────────────────────────────────
interface ActivityTabProps {
  activity: Array<Record<string, unknown>>
  assetName?: string
}

// ── Badge color for action types ──────────────────────────
const actionColors: Record<string, 'teal' | 'chartreuse' | 'amber' | 'ruby' | 'gray' | 'sapphire' | 'amethyst'> = {
  // Full action matches
  task_created: 'teal', task_completed: 'chartreuse', task_assigned: 'sapphire',
  task_started: 'teal', task_blocked: 'ruby', task_deleted: 'ruby',
  stage_completed: 'chartreuse', stage_started: 'teal',
  phase_advanced: 'amber',
  document_uploaded: 'teal', document_deleted: 'ruby', document_locked: 'amber',
  comment_posted: 'amethyst', comment_created: 'amethyst', comment_mention: 'amethyst',
  subtask_completed: 'chartreuse', subtask_created: 'teal',
  approval_requested: 'amber', approval_approved: 'chartreuse', approval_rejected: 'ruby',
  asset_created: 'teal', asset_updated: 'teal', asset_archived: 'gray',
  // Fallback prefixes (for any new actions)
  created: 'teal', updated: 'teal', completed: 'chartreuse',
  advanced: 'amber', blocked: 'ruby', deleted: 'ruby',
  started: 'teal', assigned: 'sapphire', uploaded: 'teal',
}

// ── Component ─────────────────────────────────────────────
const ENTITY_FILTERS = [
  { id: 'all', label: 'All' }, { id: 'task', label: 'Tasks' }, { id: 'document', label: 'Documents' },
  { id: 'comment', label: 'Comments' }, { id: 'asset', label: 'Phases' },
]

export function ActivityTab({ activity, assetName }: ActivityTabProps) {
  const [entityFilter, setEntityFilter] = useState('all')
  function exportCSV() {
    const headers = 'Action,Detail,Performed By,Timestamp\n'
    const rows = activity.map((e) => {
      const action = (e.action as string) ?? ''
      const detail = ((e.detail as string) ?? '').replace(/"/g, '""')
      const performer = ((e.team_members as Record<string, unknown>)?.full_name as string) ?? (e.performed_by as string) ?? ''
      const time = (e.performed_at ?? e.created_at) as string
      return `"${action}","${detail}","${performer}","${time}"`
    }).join('\n')
    const csv = headers + rows
    saveAs(new Blob([csv], { type: 'text/csv;charset=utf-8' }), `${assetName ?? 'activity'}-log.csv`)
  }

  if (activity.length === 0) {
    return (
      <NeuCard variant="pressed" padding="lg" className="text-center">
        <Activity className="h-10 w-10 text-[var(--text-placeholder)] mx-auto mb-3" />
        <p className="text-sm text-[var(--text-muted)]">No activity recorded yet.</p>
      </NeuCard>
    )
  }

  return (
    <NeuCard variant="raised" padding="md">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div className="flex gap-1">
          {ENTITY_FILTERS.map((f) => (
            <button key={f.id} onClick={() => setEntityFilter(f.id)}
              className={`px-2 py-0.5 text-[10px] rounded-[var(--radius-sm)] transition-all ${
                entityFilter === f.id
                  ? 'bg-[var(--bg-surface)] shadow-[var(--shadow-raised-sm)] text-[var(--text-primary)] font-medium'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              }`}>{f.label}</button>
          ))}
        </div>
        <NeuButton variant="ghost" size="sm" icon={<Download className="h-3.5 w-3.5" />} onClick={exportCSV}>
          Export CSV
        </NeuButton>
      </div>
      <div className="space-y-3">
        {activity
          .filter((entry) => entityFilter === 'all' || (entry.entity_type as string) === entityFilter)
          .map((entry) => {
          const action = (entry.action as string) ?? ''
          const badgeColor = actionColors[action] ?? actionColors[action.split('_').pop() ?? ''] ?? 'gray'
          const timestamp = (entry.performed_at ?? entry.created_at) as string
          const performer = (entry.team_members as Record<string, unknown>)?.full_name as string ?? ''

          return (
            <div
              key={entry.id as string}
              className="flex items-start gap-3 pb-3 border-b border-[var(--border)] last:border-0"
            >
              <Clock className="h-4 w-4 text-[var(--text-muted)] mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <NeuBadge color={badgeColor} size="sm">{action.replace(/_/g, ' ')}</NeuBadge>
                  {(entry.detail as string) && <span className="text-sm text-[var(--text-secondary)] truncate">{entry.detail as string}</span>}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  {performer && <span className="text-xs text-[var(--text-muted)]">{performer}</span>}
                  {timestamp && <span className="text-xs text-[var(--text-placeholder)]">{new Date(timestamp).toLocaleString()}</span>}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </NeuCard>
  )
}
