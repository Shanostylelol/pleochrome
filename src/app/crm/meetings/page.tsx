'use client'

import { Calendar, Plus } from 'lucide-react'
import { NeuCard, NeuBadge, NeuButton } from '@/components/ui'
import { trpc } from '@/lib/trpc'

export default function MeetingsPage() {
  const { data: meetings = [], isLoading } = trpc.meetings.list.useQuery()

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
            Meetings
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">{meetings.length} meetings</p>
        </div>
        <NeuButton icon={<Plus className="h-4 w-4" />}>
          <span className="hidden sm:inline">New Meeting</span>
        </NeuButton>
      </div>

      {isLoading ? (
        <p className="text-[var(--text-muted)] text-center py-10">Loading meetings...</p>
      ) : meetings.length === 0 ? (
        <NeuCard variant="pressed" padding="lg" className="text-center">
          <Calendar className="h-12 w-12 text-[var(--text-placeholder)] mx-auto mb-3" />
          <p className="text-sm text-[var(--text-muted)]">No meetings yet</p>
          <p className="text-xs text-[var(--text-placeholder)] mt-1">Schedule your first meeting to get started</p>
        </NeuCard>
      ) : (
        <div className="space-y-2">
          {meetings.map((m) => (
            <NeuCard key={m.id} variant="raised-sm" padding="sm" className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-[var(--radius-md)] bg-[var(--teal-bg)] text-[var(--teal)] shrink-0">
                <Calendar className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--text-primary)] truncate">{m.title}</p>
                <p className="text-xs text-[var(--text-muted)]">
                  {new Date(m.meeting_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
              <div className="flex gap-1">
                {(m.assets as { name: string } | null)?.name && (
                  <NeuBadge color="teal" size="sm">{(m.assets as { name: string }).name}</NeuBadge>
                )}
                {(m.partners as { name: string } | null)?.name && (
                  <NeuBadge color="amethyst" size="sm">{(m.partners as { name: string }).name}</NeuBadge>
                )}
              </div>
            </NeuCard>
          ))}
        </div>
      )}
    </div>
  )
}
