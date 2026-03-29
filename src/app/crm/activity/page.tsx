'use client'

import { Activity } from 'lucide-react'
import { NeuCard } from '@/components/ui'

export default function ActivityFeedPage() {
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
            Track all actions across the platform
          </p>
        </div>
      </div>

      <NeuCard className="flex flex-col items-center justify-center py-16 text-center">
        <Activity className="h-12 w-12 text-[var(--text-muted)] mb-4 opacity-40" />
        <p
          className="text-lg font-medium text-[var(--text-primary)] mb-1"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Global Activity — Phase 4.5
        </p>
        <p className="text-sm text-[var(--text-muted)] max-w-md">
          The global activity feed will aggregate all actions, status changes, and audit events
          across every asset, partner, and team member in the system.
        </p>
      </NeuCard>
    </div>
  )
}
