'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Sun, Moon, Menu, Search, Bell, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { NeuButton } from '@/components/ui/NeuButton'
import { NeuAvatar } from '@/components/ui/NeuAvatar'
import { useTheme } from './ThemeProvider'
import { MobileDrawer } from './MobileDrawer'
import { CommandPalette } from './CommandPalette'
import { NotificationPanel } from './NotificationPanel'
import { useCurrentUser } from './CurrentUserProvider'
import { trpc } from '@/lib/trpc'

export function CRMHeader() {
  const { theme, toggleTheme } = useTheme()
  const currentUser = useCurrentUser()
  const router = useRouter()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const { data: unreadData } = trpc.notifications.getUnreadCount.useQuery(
    undefined,
    { refetchInterval: 30_000 }
  )
  const unreadCount = unreadData?.count ?? 0

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [])

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between h-[var(--header-height)] px-4 lg:px-6 bg-[var(--bg-surface)] border-b border-[var(--border)] shadow-[var(--shadow-flat)]">
        <div className="flex items-center gap-3">
          <button
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-[var(--radius-md)] text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] transition-colors"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <span className="text-lg font-semibold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
              PleoChrome
            </span>
            <span className="ml-2 text-xs font-medium tracking-widest uppercase text-[var(--teal)]">
              Powerhouse
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSearchOpen(true)}
            className="hidden sm:flex items-center gap-2 h-8 px-3 rounded-[var(--radius-md)] bg-[var(--bg-input)] shadow-[var(--shadow-pressed)] text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
          >
            <Search className="h-3.5 w-3.5" />
            <span>Search...</span>
            <kbd className="text-[10px] bg-[var(--bg-body)] px-1 py-0.5 rounded" style={{ fontFamily: 'var(--font-mono)' }}>
              ⌘K
            </kbd>
          </button>
          <NeuButton variant="ghost" size="sm" className="sm:hidden" onClick={() => setSearchOpen(true)} aria-label="Search">
            <Search className="h-4 w-4" />
          </NeuButton>

          {/* Notification bell with unread count badge */}
          <NeuButton variant="ghost" size="sm" className="relative" aria-label="Notifications" onClick={() => setNotificationsOpen(!notificationsOpen)}>
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-[var(--text-on-accent)] bg-[var(--teal)] rounded-full leading-none">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </NeuButton>

          <NeuButton
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </NeuButton>
          <div className="relative">
            <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center">
              <NeuAvatar name={currentUser.full_name} size="sm" />
            </button>
            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-1 z-50 neu-raised-sm p-1 min-w-[180px]">
                <div className="px-3 py-2 border-b border-[var(--border)]">
                  <p className="text-sm font-medium text-[var(--text-primary)]">{currentUser.full_name}</p>
                  <p className="text-xs text-[var(--text-muted)]">{currentUser.email}</p>
                </div>
                <button onClick={() => { setUserMenuOpen(false); handleSignOut() }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-[var(--radius-sm)] text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] mt-1">
                  <LogOut className="h-3.5 w-3.5" /> Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <CommandPalette open={searchOpen} onClose={() => setSearchOpen(false)} />
      <NotificationPanel open={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
    </>
  )
}
