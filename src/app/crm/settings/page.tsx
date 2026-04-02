'use client'

import { useState, useEffect } from 'react'
import { Sun, Moon, Bell, Database, User } from 'lucide-react'
import { NeuCard, NeuToggle } from '@/components/ui'
import { useTheme } from '@/components/crm/ThemeProvider'
import { useCurrentUser } from '@/components/crm/CurrentUserProvider'

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme()
  const currentUser = useCurrentUser()
  const [inAppNotifs, setInAppNotifs] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pleochrome-notifs')
      return saved !== null ? JSON.parse(saved) : true
    }
    return true
  })
  useEffect(() => { localStorage.setItem('pleochrome-notifs', JSON.stringify(inAppNotifs)) }, [inAppNotifs])

  function usePref(key: string, defaultVal = true) {
    const [val, setVal] = useState(() => {
      if (typeof window === 'undefined') return defaultVal
      const s = localStorage.getItem(`plc-notif-${key}`)
      return s !== null ? JSON.parse(s) : defaultVal
    })
    const toggle = (v: boolean) => { setVal(v); localStorage.setItem(`plc-notif-${key}`, JSON.stringify(v)) }
    return [val as boolean, toggle] as const
  }
  const [notifTaskAssigned, setNotifTaskAssigned] = usePref('task_assigned')
  const [notifPhaseAdvanced, setNotifPhaseAdvanced] = usePref('phase_advanced')
  const [notifGateBlocked, setNotifGateBlocked] = usePref('gate_blocked')
  const [notifApprovalNeeded, setNotifApprovalNeeded] = usePref('approval_needed')
  const [notifMentions, setNotifMentions] = usePref('mentions')

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1
          className="text-2xl font-semibold text-[var(--text-primary)]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Settings
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Configure your Powerhouse preferences
        </p>
      </div>

      {/* Profile */}
      <NeuCard variant="raised" padding="md">
        <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
          <User className="h-4 w-4" />
          Profile
        </h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-[var(--text-muted)]">Name</span>
            <span className="text-[var(--text-primary)] font-medium">{currentUser.full_name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--text-muted)]">Email</span>
            <span
              className="text-[var(--text-primary)]"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              {currentUser.email || 'Not set'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--text-muted)]">Role</span>
            <span className="text-[var(--text-primary)] font-medium">CEO &amp; CCO</span>
          </div>
        </div>
      </NeuCard>

      {/* Appearance */}
      <NeuCard variant="raised" padding="md">
        <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
          {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          Appearance
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[var(--text-primary)]">Dark Mode</p>
            <p className="text-xs text-[var(--text-muted)]">
              Toggle between dark and light theme
            </p>
          </div>
          <NeuToggle enabled={theme === 'dark'} onChange={toggleTheme} />
        </div>
      </NeuCard>

      {/* Notifications */}
      <NeuCard variant="raised" padding="md">
        <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
          <Bell className="h-4 w-4" />
          Notifications
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--text-primary)]">In-App Notifications</p>
              <p className="text-xs text-[var(--text-muted)]">
                Show notifications within the CRM
              </p>
            </div>
            <NeuToggle enabled={inAppNotifs} onChange={setInAppNotifs} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--text-primary)]">Email Digests</p>
              <p className="text-xs text-[var(--text-muted)]">Daily summary (coming soon)</p>
            </div>
            <NeuToggle enabled={false} onChange={() => {}} disabled />
          </div>
          {inAppNotifs && (
            <div className="pt-3 border-t border-[var(--border)]">
              <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">Notification Types</p>
              <div className="space-y-3">
                {([
                  ['Task assigned to me', notifTaskAssigned, setNotifTaskAssigned],
                  ['Phase advanced', notifPhaseAdvanced, setNotifPhaseAdvanced],
                  ['Gate blocked', notifGateBlocked, setNotifGateBlocked],
                  ['Approval needed', notifApprovalNeeded, setNotifApprovalNeeded],
                  ['Mentions in comments', notifMentions, setNotifMentions],
                ] as [string, boolean, (v: boolean) => void][]).map(([label, val, setter]) => (
                  <div key={label} className="flex items-center justify-between">
                    <p className="text-xs text-[var(--text-secondary)]">{label}</p>
                    <NeuToggle enabled={val} onChange={setter} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </NeuCard>

      {/* System */}
      <NeuCard variant="raised" padding="md">
        <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
          <Database className="h-4 w-4" />
          System
        </h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-[var(--text-muted)]">Environment</span>
            <span
              className="text-[var(--text-primary)]"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              {process.env.NEXT_PUBLIC_ENV ?? 'production'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--text-muted)]">Supabase Project</span>
            <span
              className="text-[var(--text-primary)]"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              {process.env.NEXT_PUBLIC_SUPABASE_URL?.split('.')[0]?.split('//')[1] ?? '-'}
            </span>
          </div>
        </div>
      </NeuCard>

      {/* Keyboard Shortcuts */}
      <NeuCard variant="raised" padding="md">
        <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Keyboard Shortcuts</h2>
        <div className="space-y-2">
          {[
            ['⌘ K', 'Open command palette (search, quick actions, recently viewed)'],
            ['↑ ↓', 'Navigate command palette results'],
            ['↵', 'Select highlighted result'],
            ['Esc', 'Close command palette / cancel edit'],
            ['Enter (in comment)', 'Post comment (Shift+Enter for new line)'],
            ['Double-click stage name', 'Rename stage inline'],
            ['Double-click task title', 'Edit task title inline'],
          ].map(([key, desc]) => (
            <div key={key} className="flex items-center gap-3">
              <kbd className="shrink-0 px-2 py-0.5 rounded-[var(--radius-sm)] text-[11px] font-mono bg-[var(--bg-body)] shadow-[var(--shadow-raised-sm)] text-[var(--text-primary)] whitespace-nowrap">
                {key}
              </kbd>
              <span className="text-xs text-[var(--text-secondary)]">{desc}</span>
            </div>
          ))}
        </div>
      </NeuCard>
    </div>
  )
}
