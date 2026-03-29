'use client'

import { Sun, Moon, Bell, Database } from 'lucide-react'
import { NeuCard, NeuToggle } from '@/components/ui'
import { useTheme } from '@/components/crm/ThemeProvider'

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
          Settings
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Configure your Powerhouse preferences</p>
      </div>

      <NeuCard variant="raised" padding="md">
        <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
          {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          Appearance
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[var(--text-primary)]">Dark Mode</p>
            <p className="text-xs text-[var(--text-muted)]">Toggle between dark and light theme</p>
          </div>
          <NeuToggle enabled={theme === 'dark'} onChange={toggleTheme} />
        </div>
      </NeuCard>

      <NeuCard variant="raised" padding="md">
        <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
          <Bell className="h-4 w-4" />
          Notifications
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--text-primary)]">In-App Notifications</p>
              <p className="text-xs text-[var(--text-muted)]">Show notifications within the CRM</p>
            </div>
            <NeuToggle enabled={true} onChange={() => {}} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--text-primary)]">Email Digests</p>
              <p className="text-xs text-[var(--text-muted)]">Daily summary (coming soon)</p>
            </div>
            <NeuToggle enabled={false} onChange={() => {}} disabled />
          </div>
        </div>
      </NeuCard>

      <NeuCard variant="raised" padding="md">
        <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
          <Database className="h-4 w-4" />
          System
        </h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-[var(--text-muted)]">Environment</span>
            <span className="text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-mono)' }}>
              {process.env.NEXT_PUBLIC_ENV ?? 'production'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--text-muted)]">Supabase Project</span>
            <span className="text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-mono)' }}>
              {process.env.NEXT_PUBLIC_SUPABASE_URL?.split('.')[0]?.split('//')[1] ?? '-'}
            </span>
          </div>
        </div>
      </NeuCard>
    </div>
  )
}
