'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, Check, CheckCheck, X, ExternalLink } from 'lucide-react'
import { trpc } from '@/lib/trpc'
import { NeuCard } from '@/components/ui/NeuCard'
import { NeuButton } from '@/components/ui/NeuButton'
import { cn } from '@/lib/utils'
import { useToast } from '@/components/ui/NeuToast'

const TYPE_COLORS: Record<string, string> = {
  comment_mention: 'var(--amethyst)',
  comment_reply: 'var(--teal)',
  task_assigned: 'var(--teal)',
  approval_requested: 'var(--sapphire)',
  approval_decision: 'var(--emerald)',
  phase_advanced: 'var(--amber)',
  document_uploaded: 'var(--teal)',
  deadline_approaching: 'var(--amber)',
  deadline_overdue: 'var(--ruby)',
  asset_status_changed: 'var(--gray)',
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

export function NotificationPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { toast } = useToast()
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const utils = trpc.useUtils()
  const router = useRouter()

  const { data: notifications = [] } = trpc.notifications.list.useQuery(
    { unreadOnly: filter === 'unread', limit: 30 },
    { enabled: open }
  )

  const markRead = trpc.notifications.markRead.useMutation({
    onSuccess: () => { utils.notifications.list.invalidate(); utils.notifications.getUnreadCount.invalidate() },
    onError: (err) => toast(err.message, 'error'),
  })

  const markAllRead = trpc.notifications.markAllRead.useMutation({
    onSuccess: () => { utils.notifications.list.invalidate(); utils.notifications.getUnreadCount.invalidate() },
    onError: (err) => toast(err.message, 'error'),
  })

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div
        className="absolute top-[var(--header-height)] right-4 w-96 max-h-[70vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <NeuCard variant="raised" padding="none" className="flex flex-col max-h-[70vh]">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-[var(--text-muted)]" />
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">Notifications</h3>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => markAllRead.mutate()}
                className="text-[11px] text-[var(--teal)] hover:underline"
              >
                Mark all read
              </button>
              <button onClick={onClose} aria-label="Close notifications" className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-1 px-4 py-2 border-b border-[var(--border)]">
            {(['all', 'unread'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  'px-3 py-1 rounded-[var(--radius-md)] text-xs font-medium transition-all',
                  filter === f
                    ? 'bg-[var(--teal)] text-[var(--text-on-accent)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                )}
              >
                {f === 'all' ? 'All' : 'Unread'}
              </button>
            ))}
          </div>

          {/* Notification list */}
          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <div className="py-12 text-center">
                <CheckCheck className="h-8 w-8 text-[var(--text-muted)] mx-auto mb-2" />
                <p className="text-sm text-[var(--text-muted)]">All caught up!</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={cn(
                    'flex gap-3 px-4 py-3 border-b border-[var(--border)] hover:bg-[var(--bg-elevated)] transition-colors cursor-pointer',
                    !n.is_read && 'bg-[var(--bg-body)]'
                  )}
                  onClick={() => {
                    if (!n.is_read) markRead.mutate({ notificationId: n.id })
                    if (n.asset_id) { onClose(); router.push(`/crm/assets/${n.asset_id}`) }
                  }}
                >
                  <div
                    className="w-2 h-2 rounded-full mt-2 shrink-0"
                    style={{ backgroundColor: !n.is_read ? (TYPE_COLORS[n.type] ?? 'var(--teal)') : 'transparent' }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--text-primary)] truncate">{n.title}</p>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5 line-clamp-2">{n.message}</p>
                    <p className="text-[10px] text-[var(--text-placeholder)] mt-1">{timeAgo(n.created_at)}</p>
                  </div>
                  {n.asset_id && (
                    <ExternalLink className="h-3 w-3 text-[var(--text-placeholder)] mt-1 shrink-0" />
                  )}
                </div>
              ))
            )}
          </div>
        </NeuCard>
      </div>
    </div>
  )
}
