'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Bell, Clock, Check, AlarmClock, Trash2, Plus } from 'lucide-react'
import { NeuCard, NeuButton, NeuBadge } from '@/components/ui'
import { ListPageSkeleton } from '@/components/crm/skeletons'
import { SetReminderModal } from '@/components/crm/SetReminderModal'
import { trpc } from '@/lib/trpc'

function timeUntil(date: string): { label: string; overdue: boolean } {
  const ms = new Date(date).getTime() - Date.now()
  const overdue = ms < 0
  const abs = Math.abs(ms)
  const mins = Math.floor(abs / 60000)
  if (mins < 60) return { label: overdue ? `${mins}m overdue` : `In ${mins}m`, overdue }
  const hours = Math.floor(mins / 60)
  if (hours < 24) return { label: overdue ? `${hours}h overdue` : `In ${hours}h`, overdue }
  const days = Math.floor(hours / 24)
  return { label: overdue ? `${days}d overdue` : `In ${days}d`, overdue }
}

const SNOOZE_OPTIONS = [
  { label: '1 hour', hours: 1 },
  { label: 'Tomorrow', hours: 24 },
  { label: '3 days', hours: 72 },
  { label: '1 week', hours: 168 },
]

export default function RemindersPage() {
  const [showCreate, setShowCreate] = useState(false)
  const [snoozeOpen, setSnoozeOpen] = useState<string | null>(null)

  const utils = trpc.useUtils()
  const { data: reminders = [], isLoading } = trpc.reminders.list.useQuery()
  const dismissMut = trpc.reminders.dismiss.useMutation({
    onSuccess: () => utils.reminders.list.invalidate(),
  })
  const snoozeMut = trpc.reminders.snooze.useMutation({
    onSuccess: () => { utils.reminders.list.invalidate(); setSnoozeOpen(null) },
  })
  const deleteMut = trpc.reminders.delete.useMutation({
    onSuccess: () => utils.reminders.list.invalidate(),
  })

  const overdue = (reminders as Record<string, unknown>[]).filter((r) => new Date(r.remind_at as string).getTime() < Date.now())
  const upcoming = (reminders as Record<string, unknown>[]).filter((r) => new Date(r.remind_at as string).getTime() >= Date.now())

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
            <Bell className="h-6 w-6 inline mr-2 -mt-1" />Reminders
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            {reminders.length} pending · {overdue.length} overdue
          </p>
        </div>
        <NeuButton icon={<Plus className="h-4 w-4" />} onClick={() => setShowCreate(true)}>
          <span className="hidden sm:inline">New Reminder</span>
        </NeuButton>
      </div>

      {isLoading ? <ListPageSkeleton /> : reminders.length === 0 ? (
        <NeuCard variant="pressed" padding="lg" className="text-center">
          <Bell className="h-10 w-10 text-[var(--text-placeholder)] mx-auto mb-3" />
          <p className="text-sm text-[var(--text-muted)]">No pending reminders</p>
          <p className="text-xs text-[var(--text-placeholder)] mt-1">Set reminders from any asset detail page</p>
        </NeuCard>
      ) : (
        <div className="space-y-4">
          {overdue.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--ruby)] mb-2">Overdue</p>
              <div className="space-y-2">
                {overdue.map((r) => <ReminderRow key={r.id as string} reminder={r} snoozeOpen={snoozeOpen} setSnoozeOpen={setSnoozeOpen} onDismiss={() => dismissMut.mutate({ reminderId: r.id as string })} onSnooze={(hours) => snoozeMut.mutate({ reminderId: r.id as string, snoozedUntil: new Date(Date.now() + hours * 3_600_000).toISOString() })} onDelete={() => deleteMut.mutate({ reminderId: r.id as string })} loading={dismissMut.isPending || snoozeMut.isPending || deleteMut.isPending} />)}
              </div>
            </div>
          )}
          {upcoming.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">Upcoming</p>
              <div className="space-y-2">
                {upcoming.map((r) => <ReminderRow key={r.id as string} reminder={r} snoozeOpen={snoozeOpen} setSnoozeOpen={setSnoozeOpen} onDismiss={() => dismissMut.mutate({ reminderId: r.id as string })} onSnooze={(hours) => snoozeMut.mutate({ reminderId: r.id as string, snoozedUntil: new Date(Date.now() + hours * 3_600_000).toISOString() })} onDelete={() => deleteMut.mutate({ reminderId: r.id as string })} loading={dismissMut.isPending || snoozeMut.isPending || deleteMut.isPending} />)}
              </div>
            </div>
          )}
        </div>
      )}

      <SetReminderModal open={showCreate} onClose={() => setShowCreate(false)} />
    </div>
  )
}

function ReminderRow({ reminder, snoozeOpen, setSnoozeOpen, onDismiss, onSnooze, onDelete, loading }: {
  reminder: Record<string, unknown>
  snoozeOpen: string | null
  setSnoozeOpen: (id: string | null) => void
  onDismiss: () => void
  onSnooze: (hours: number) => void
  onDelete: () => void
  loading: boolean
}) {
  const { label, overdue } = timeUntil(reminder.remind_at as string)
  const asset = reminder.assets as { name: string; reference_code: string } | null
  const isSnoozeOpen = snoozeOpen === (reminder.id as string)

  return (
    <NeuCard variant="raised-sm" padding="sm">
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 p-1.5 rounded-[var(--radius-sm)] ${overdue ? 'bg-[var(--ruby-bg)]' : 'bg-[var(--bg-body)]'}`}>
          <Bell className={`h-4 w-4 ${overdue ? 'text-[var(--ruby)]' : 'text-[var(--text-muted)]'}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[var(--text-primary)]">{reminder.title as string}</p>
          {Boolean(reminder.description) && <p className="text-xs text-[var(--text-muted)] truncate">{String(reminder.description)}</p>}
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className={`text-[11px] font-medium ${overdue ? 'text-[var(--ruby)]' : 'text-[var(--text-muted)]'}`}>{label}</span>
            <span className="text-[11px] text-[var(--text-placeholder)]">
              {new Date(reminder.remind_at as string).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </span>
            {asset && (
              <Link href={`/crm/assets/${(reminder.asset_id as string)}`} className="text-[11px] text-[var(--teal)] hover:underline truncate">
                {asset.reference_code}
              </Link>
            )}
            {(reminder.is_recurring as boolean) && <NeuBadge color="amethyst" size="sm">{reminder.recurrence_rule as string}</NeuBadge>}
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={onDismiss} disabled={loading} aria-label="Dismiss reminder"
            className="p-1.5 rounded-[var(--radius-sm)] text-[var(--chartreuse)] hover:bg-[var(--bg-elevated)] transition-colors">
            <Check className="h-3.5 w-3.5" />
          </button>
          <div className="relative">
            <button onClick={() => setSnoozeOpen(isSnoozeOpen ? null : reminder.id as string)} aria-label="Snooze reminder"
              className="p-1.5 rounded-[var(--radius-sm)] text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] transition-colors">
              <AlarmClock className="h-3.5 w-3.5" />
            </button>
            {isSnoozeOpen && (
              <div className="absolute right-0 top-8 z-20 neu-raised-sm p-1 min-w-[120px]" onClick={(e) => e.stopPropagation()}>
                {SNOOZE_OPTIONS.map((s) => (
                  <button key={s.hours} onClick={() => onSnooze(s.hours)}
                    className="flex items-center gap-2 w-full px-3 py-2 text-xs rounded-[var(--radius-sm)] text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]">
                    <Clock className="h-3 w-3" /> {s.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button onClick={onDelete} disabled={loading} aria-label="Delete reminder"
            className="p-1.5 rounded-[var(--radius-sm)] text-[var(--text-muted)] hover:text-[var(--ruby)] hover:bg-[var(--bg-elevated)] transition-colors">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </NeuCard>
  )
}
