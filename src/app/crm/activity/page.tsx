'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Activity, Clock, Download } from 'lucide-react'
import { NeuCard, NeuBadge, NeuButton, NeuTabs, NeuAvatar } from '@/components/ui'
import { ListPageSkeleton } from '@/components/crm/skeletons'
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

const PAGE_SIZE = 50

export default function ActivityPage() {
  const [filter, setFilter] = useState('all')
  const [cursor, setCursor] = useState<string | undefined>(undefined)
  const [allEntries, setAllEntries] = useState<Array<Record<string, unknown>>>([])

  const queryInput = {
    ...(filter !== 'all' ? { category: filter } : {}),
    limit: PAGE_SIZE,
    cursor,
  }

  const { data: entries = [], isLoading } = trpc.activity.list.useQuery(queryInput)
  const { data: countData } = trpc.activity.getCount.useQuery()
  const utils = trpc.useUtils()

  // Reset when filter changes
  useEffect(() => {
    setCursor(undefined)
    setAllEntries([])
  }, [filter])

  // Merge new entries
  useEffect(() => {
    if (!cursor) {
      setAllEntries(entries as Array<Record<string, unknown>>)
    } else if (entries.length > 0) {
      setAllEntries((prev) => [...prev, ...(entries as Array<Record<string, unknown>>)])
    }
  }, [entries, cursor])

  // Realtime subscription
  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel('activity-feed')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'activity_log' }, () => {
        setCursor(undefined)
        setAllEntries([])
        utils.activity.list.invalidate()
        utils.activity.getCount.invalidate()
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [utils])

  const handleExport = useCallback(async () => {
    try {
      const result = await utils.client.activity.export.query({ format: 'csv', limit: 5000 })
      if (result.format === 'csv' && typeof result.data === 'string') {
        const blob = new Blob([result.data], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `activity-log-${new Date().toISOString().slice(0, 10)}.csv`
        a.click()
        URL.revokeObjectURL(url)
      }
    } catch (err) {
      console.error('Export failed:', err)
    }
  }, [utils])

  const hasMore = entries.length === PAGE_SIZE

  const handleLoadMore = () => {
    const lastEntry = allEntries[allEntries.length - 1]
    if (lastEntry?.id) setCursor(lastEntry.id as string)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-semibold text-[var(--text-primary)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Activity Feed
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Immutable audit trail &mdash; {countData?.count ?? 0} entries
          </p>
        </div>
        <NeuButton
          variant="ghost"
          icon={<Download className="h-4 w-4" />}
          onClick={handleExport}
        >
          <span className="hidden sm:inline">Export</span>
        </NeuButton>
      </div>

      <NeuTabs tabs={TABS} activeTab={filter} onTabChange={setFilter} />

      {isLoading && allEntries.length === 0 ? (
        <ListPageSkeleton />
      ) : allEntries.length === 0 ? (
        <NeuCard variant="pressed" padding="lg" className="text-center">
          <Activity className="h-12 w-12 text-[var(--text-placeholder)] mx-auto mb-3" />
          <p className="text-sm text-[var(--text-muted)]">No activity recorded yet</p>
          <p className="text-xs text-[var(--text-placeholder)] mt-1">
            Activity is automatically logged by database triggers
          </p>
        </NeuCard>
      ) : (
        <>
          <div className="space-y-1">
            {allEntries.map((entry) => {
              const performer = entry.team_members as { full_name: string; email: string } | null
              const category = entry.category as string | null
              return (
                <NeuCard key={entry.id as string} variant="raised-sm" padding="sm" className="flex items-start gap-3">
                  {performer ? (
                    <NeuAvatar name={performer.full_name} size="sm" />
                  ) : (
                    <div className="mt-0.5">
                      <Clock className="h-4 w-4 text-[var(--text-muted)]" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[var(--text-primary)]">
                      {performer && <span className="font-medium">{performer.full_name}</span>}
                      {performer && ' \u2014 '}
                      {entry.action as string}
                    </p>
                    {Boolean(entry.detail) && (
                      <p className="text-xs text-[var(--text-muted)] mt-0.5 truncate">
                        {String(entry.detail)}
                      </p>
                    )}
                    <p
                      className="text-[10px] text-[var(--text-placeholder)] mt-1"
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      {timeAgo(entry.performed_at as string)} &middot;{' '}
                      {new Date(entry.performed_at as string).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-1 shrink-0 flex-wrap justify-end">
                    {category && (
                      <NeuBadge color={categoryColors[category] ?? 'gray'} size="sm">
                        {category}
                      </NeuBadge>
                    )}
                    {Boolean(entry.asset_id) && (
                      <Link href={`/crm/assets/${String(entry.asset_id)}`}>
                        <NeuBadge color="teal" size="sm">View</NeuBadge>
                      </Link>
                    )}
                    {Boolean(entry.partner_id) && !entry.asset_id && (
                      <Link href={`/crm/partners/${String(entry.partner_id)}`}>
                        <NeuBadge color="amethyst" size="sm">View</NeuBadge>
                      </Link>
                    )}
                  </div>
                </NeuCard>
              )
            })}
          </div>

          {hasMore && (
            <div className="flex justify-center pt-2">
              <NeuButton variant="ghost" onClick={handleLoadMore} loading={isLoading}>
                Load More
              </NeuButton>
            </div>
          )}
        </>
      )}
    </div>
  )
}
