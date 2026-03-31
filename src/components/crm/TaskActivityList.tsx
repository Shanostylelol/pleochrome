'use client'

import { trpc } from '@/lib/trpc'
import { NeuBadge } from '@/components/ui/NeuBadge'

const actionColors: Record<string, 'teal' | 'chartreuse' | 'amber' | 'ruby' | 'gray'> = {
  created: 'teal', updated: 'teal', completed: 'chartreuse',
  started: 'teal', assigned: 'teal', blocked: 'ruby', deleted: 'ruby',
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export function TaskActivityList({ taskId }: { taskId: string }) {
  const { data: events = [] } = trpc.activity.listByTask.useQuery({ taskId, limit: 10 })

  if (events.length === 0) {
    return <p className="text-xs text-[var(--text-muted)] text-center py-2">No activity yet.</p>
  }

  return (
    <div className="space-y-1.5">
      {(events as Array<Record<string, unknown>>).map((e) => {
        const action = (e.action as string) ?? ''
        const color = actionColors[action.split('_').pop() ?? ''] ?? 'gray'
        const performer = (e.team_members as Record<string, unknown>)?.full_name as string ?? ''
        const time = (e.performed_at ?? e.created_at) as string
        return (
          <div key={e.id as string} className="flex items-center gap-2 text-xs">
            <NeuBadge color={color} size="sm">{action.replace(/_/g, ' ')}</NeuBadge>
            <span className="text-[var(--text-muted)] truncate flex-1">{(e.detail as string) ?? ''}</span>
            {performer && <span className="text-[var(--text-muted)] shrink-0">{performer}</span>}
            <span className="text-[var(--text-placeholder)] shrink-0">{timeAgo(time)}</span>
          </div>
        )
      })}
    </div>
  )
}
