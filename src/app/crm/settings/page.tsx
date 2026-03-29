'use client'

import { Settings } from 'lucide-react'
import { NeuCard } from '@/components/ui'

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-semibold text-[var(--text-primary)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Settings
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Configure platform preferences, integrations, and account settings
          </p>
        </div>
      </div>

      <NeuCard className="flex flex-col items-center justify-center py-16 text-center">
        <Settings className="h-12 w-12 text-[var(--text-muted)] mb-4 opacity-40" />
        <p
          className="text-lg font-medium text-[var(--text-primary)] mb-1"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Settings — Phase 7
        </p>
        <p className="text-sm text-[var(--text-muted)] max-w-md">
          Platform configuration including user preferences, notification settings, API integrations,
          branding customization, and team permissions will be available in Phase 7.
        </p>
      </NeuCard>
    </div>
  )
}
