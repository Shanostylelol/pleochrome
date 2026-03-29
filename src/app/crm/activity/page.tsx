'use client'

import { useState, useEffect } from 'react'
import { Activity, Clock } from 'lucide-react'
import { NeuCard, NeuBadge, NeuTabs } from '@/components/ui'
import { createClient } from '@/lib/supabase'

type ActivityEntry = {
  id: string
  action: string
  detail: string | null
  entity_type: string | null
  category: string | null
  severity: string | null
  performed_by: string | null
  created_at: string
  asset_id: string | null
}

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
  const [entries, setEntries] = useState<ActivityEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const supabase = createClient()
    async function load() {
      const { data } = await supabase
        .from('activity_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)
      setEntries((data as ActivityEntry[]) ?? [])
      setLoading(false)
    }
    load()

    const channel = supabase
      .channel('activity-feed')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'activity_log' }, (payload) => {
        setEntries((prev) => [payload.new as ActivityEntry, ...prev])
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  const filtered = filter === 'all' ? entries : entries.filter((e) => e.category === filter)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
          Activity Feed
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Immutable audit trail — {entries.length} entries</p>
      </div>

      <NeuTabs tabs={TABS} activeTab={filter} onTabChange={setFilter} />

      {loading ? (
        <p className="text-[var(--text-muted)] text-center py-10">Loading activity...</p>
      ) : filtered.length === 0 ? (
        <NeuCard variant="pressed" padding="lg" className="text-center">
          <Activity className="h-12 w-12 text-[var(--text-placeholder)] mx-auto mb-3" />
          <p className="text-sm text-[var(--text-muted)]">No activity recorded yet</p>
          <p className="text-xs text-[var(--text-placeholder)] mt-1">Activity is automatically logged by database triggers</p>
        </NeuCard>
      ) : (
        <div className="space-y-1">
          {filtered.map((entry) => (
            <NeuCard key={entry.id} variant="raised-sm" padding="sm" className="flex items-start gap-3">
              <div className="mt-0.5">
                <Clock className="h-4 w-4 text-[var(--text-muted)]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[var(--text-primary)]">{entry.action}</p>
                {entry.detail && (
                  <p className="text-xs text-[var(--text-muted)] mt-0.5 truncate">{entry.detail}</p>
                )}
                <p className="text-[10px] text-[var(--text-placeholder)] mt-1" style={{ fontFamily: 'var(--font-mono)' }}>
                  {timeAgo(entry.created_at)} · {new Date(entry.created_at).toLocaleString()}
                </p>
              </div>
              <div className="flex gap-1 shrink-0">
                {entry.entity_type && (
                  <NeuBadge color="gray" size="sm">{entry.entity_type}</NeuBadge>
                )}
                {entry.category && (
                  <NeuBadge color={categoryColors[entry.category] ?? 'gray'} size="sm">{entry.category}</NeuBadge>
                )}
              </div>
            </NeuCard>
          ))}
        </div>
      )}
    </div>
  )
}
