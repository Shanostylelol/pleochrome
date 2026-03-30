'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { NeuAvatar } from '@/components/ui/NeuAvatar'
import {
  LayoutDashboard, Gem, Handshake, FileText, CheckSquare,
  Calendar, Activity, Users, BookOpen, Shield, Settings,
} from 'lucide-react'

const mainNav = [
  { label: 'Pipeline', icon: LayoutDashboard, href: '/crm' },
  { label: 'Assets', icon: Gem, href: '/crm/assets' },
  { label: 'Partners', icon: Handshake, href: '/crm/partners' },
  { label: 'Documents', icon: FileText, href: '/crm/documents' },
  { label: 'Tasks', icon: CheckSquare, href: '/crm/tasks' },
  { label: 'Meetings', icon: Calendar, href: '/crm/meetings' },
  { label: 'Activity', icon: Activity, href: '/crm/activity' },
]

const adminNav = [
  { label: 'Team', icon: Users, href: '/crm/team' },
  { label: 'Templates', icon: BookOpen, href: '/crm/templates' },
  { label: 'Compliance', icon: Shield, href: '/crm/compliance' },
  { label: 'Settings', icon: Settings, href: '/crm/settings' },
]

function isActive(pathname: string, href: string) {
  if (href === '/crm') return pathname === '/crm'
  if (href === '/crm/assets') return pathname === '/crm/assets' || pathname.startsWith('/crm/assets/')
  return pathname.startsWith(href)
}

export function CRMSidebar() {
  const pathname = usePathname()

  return (
    <aside className="crm-sidebar hidden md:flex flex-col fixed left-0 top-[var(--header-height)] h-[calc(100vh-var(--header-height))] bg-[var(--bg-sidebar)] border-r border-[var(--border)] z-30 w-[var(--sidebar-width)] lg:w-[var(--sidebar-width)]" style={{ width: 'var(--sidebar-width)' }}>
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {mainNav.map((item) => {
          const active = isActive(pathname, item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] text-sm font-medium transition-all',
                active
                  ? 'text-[var(--text-primary)] bg-[var(--bg-body)] shadow-[var(--shadow-pressed)] font-semibold'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]'
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span className="hidden lg:inline">{item.label}</span>
            </Link>
          )
        })}

        <div className="h-px bg-[var(--border)] mx-3 my-2" />

        {adminNav.map((item) => {
          const active = isActive(pathname, item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] text-sm font-medium transition-all',
                active
                  ? 'text-[var(--text-primary)] bg-[var(--bg-body)] shadow-[var(--shadow-pressed)] font-semibold'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]'
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span className="hidden lg:inline">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="px-3 py-3 border-t border-[var(--border)]">
        <div className="flex items-center gap-3 px-3 py-2 rounded-[var(--radius-md)] hover:bg-[var(--bg-elevated)] transition-colors cursor-pointer">
          <NeuAvatar name="Shane Pierson" size="sm" />
          <div className="hidden lg:block min-w-0">
            <p className="text-sm font-medium text-[var(--text-primary)] truncate">Shane Pierson</p>
            <p className="text-xs text-[var(--text-muted)]">CEO</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
