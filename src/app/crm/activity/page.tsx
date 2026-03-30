'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Activity, Clock } from 'lucide-react'
import { NeuCard, NeuBadge, NeuTabs, NeuAvatar } from '@/components/ui'
import { trpc } from '@/lib/trpc'
import { createClient } from '@/lib/supabase'

const categoryColors: Record<string, 'teal' | 'emerald' | 'amber' | 'ruby' | 'gray'> = {
  operational: 'teal',
  governance: 'emerald',
  compliance: 'amber',
  financial: 'amber',
  security: 'ruby',
}

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'operational', label: 'Operational' },
  { id: 'governance', label: 'Governance' },
  { id: 'compliance', label: 'Compliance' },
]

function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export default function ActivityPage() {
  const [filter, setFilter] = useState('all')
  const { data: entries = [], isLoading } = trpc.activity.list.useQuery(
    filter !== 'all' ? { category: filter } : undefined
  )

  // Realtime subscription for new activity
  const utils = trpc.useUtils()
  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel('activity-feed')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'activity_log' }, () => {
        utils.activity.list.invalidate()
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [utils])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
          Activity Feed
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Immutable audit trail — {entries.length} entries</p>
      </div>

      <NeuTabs tabs={TABS} activeTab={filter} onTabChange={setFilter} />

      {isLoading ? (
        <p className="text-[var(--text-muted)] text-center py-10">Loading activity...</p>
      ) : entries.length === 0 ? (
        <NeuCard variant="pressed" padding="lg" className="text-center">
          <Activity className="h-12 w-12 text-[var(--text-placeholder)] mx-auto mb-3" />
          <p className="text-sm text-[var(--text-muted)]">No activity recorded yet</p>
          <p className="text-xs text-[var(--text-placeholder)] mt-1">Activity is automatically logged by database triggers</p>
        </NeuCard>
      ) : (
        <div className="space-y-1">
          {entries.map((entry) => {
            const performer = entry.team_members as { full_name: string; email: string } | null
            return (
              <NeuCard key={entry.id} variant="raised-sm" padding="sm" className="flex items-start gap-3">
                {performer ? (
                  <NeuAvatar name={performer.full_name} size="sm" />
                ) : (
                  <div className="mt-0.5"><Clock className="h-4 w-4 text-[var(--text-muted)]" /></div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[var(--text-primary)]">
                    {performer && <span className="font-medium">{performer.full_name}</span>}
                    {performer && ' — '}
                    {entry.action}
                  </p>
                  {entry.detail && (
                    <p className="text-xs text-[var(--text-muted)] mt-0.5 truncate">{entry.detail}</p>
                  )}
                  <p className="text-[10px] text-[var(--text-placeholder)] mt-1" style={{ fontFamily: 'var(--font-mono)' }}>
                    {timeAgo(entry.performed_at)} · {new Date(entry.performed_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-1 shrink-0">
                  {entry.asset_id && (
                    <Link href={`/crm/assets/${entry.asset_id}`}>
                      <NeuBadge color="teal" size="sm">View Asset</NeuBadge>
                    </Link>
                  )}
                  {entry.partner_id && (
                    <Link href={`/crm/partners/${entry.partner_id}`}>
                      <NeuBadge color="amethyst" size="sm">View Partner</NeuBadge>
                    </Link>
                  )}
                  {entry.entity_type && !entry.asset_id && !entry.partner_id && (
                    <NeuBadge color="gray" size="sm">{entry.entity_type}</NeuBadge>
                  )}
                  {entry.category && <NeuBadge color={categoryColors[entry.category] ?? 'gray'} size="sm">{entry.category}</NeuBadge>}
                </div>
              </NeuCard>
            )
          })}
        </div>
      )}
    </div>
  )
}
