'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { NeuAvatar } from '@/components/ui/NeuAvatar'
import { X, LayoutDashboard, Gem, Handshake, FileText, CheckSquare, Calendar, Activity, Users, BookOpen, Shield, Settings } from 'lucide-react'

const allNav = [
  { label: 'Pipeline', icon: LayoutDashboard, href: '/crm' },
  { label: 'Assets', icon: Gem, href: '/crm/assets' },
  { label: 'Partners', icon: Handshake, href: '/crm/partners' },
  { label: 'Documents', icon: FileText, href: '/crm/documents' },
  { label: 'Tasks', icon: CheckSquare, href: '/crm/tasks' },
  { label: 'Meetings', icon: Calendar, href: '/crm/meetings' },
  { label: 'Activity', icon: Activity, href: '/crm/activity' },
  { label: 'Team', icon: Users, href: '/crm/team' },
  { label: 'Templates', icon: BookOpen, href: '/crm/templates' },
  { label: 'Compliance', icon: Shield, href: '/crm/compliance' },
  { label: 'Settings', icon: Settings, href: '/crm/settings' },
]

export function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname()

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (open) {
      document.addEventListener('keydown', handleKey)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="absolute inset-0 bg-[var(--overlay)]" onClick={onClose} />
      <div className="absolute left-0 top-0 h-full w-72 bg-[var(--bg-sidebar)] shadow-[var(--shadow-raised)] animate-slide-in-left">
        <div className="flex items-center justify-between px-4 h-[var(--header-height)] border-b border-[var(--border)]">
          <span className="text-lg font-semibold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
            PleoChrome
          </span>
          <button onClick={onClose} className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)]">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="px-3 py-4 space-y-1 overflow-y-auto h-[calc(100%-var(--header-height)-72px)]">
          {allNav.map((item) => {
            const active = item.href === '/crm' ? pathname === '/crm' : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-3 py-3 rounded-[var(--radius-md)] text-sm font-medium transition-all min-h-[44px]',
                  active
                    ? 'text-[var(--text-primary)] bg-[var(--bg-body)] shadow-[var(--shadow-pressed)] font-semibold'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]'
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 px-4 py-3 border-t border-[var(--border)]">
          <div className="flex items-center gap-3">
            <NeuAvatar name="Shane Pierson" size="sm" />
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">Shane Pierson</p>
              <p className="text-xs text-[var(--text-muted)]">CEO</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
