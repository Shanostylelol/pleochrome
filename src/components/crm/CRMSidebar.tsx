'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useCurrentUser } from './CurrentUserProvider'
import { NeuAvatar } from '@/components/ui/NeuAvatar'
import {
  LayoutGrid, LayoutDashboard, Gem, Handshake, Users2, FileText, CheckSquare,
  Calendar, Activity, ShieldCheck, Users, LayoutTemplate, Shield, Settings, Bell,
} from 'lucide-react'

const mainNav = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/crm/dashboard' },
  { label: 'Pipeline', icon: LayoutGrid, href: '/crm' },
  { label: 'Assets', icon: Gem, href: '/crm/assets' },
  { label: 'Partners', icon: Handshake, href: '/crm/partners' },
  { label: 'Contacts', icon: Users2, href: '/crm/contacts' },
  { label: 'Documents', icon: FileText, href: '/crm/documents' },
  { label: 'Tasks', icon: CheckSquare, href: '/crm/tasks' },
  { label: 'Meetings', icon: Calendar, href: '/crm/meetings' },
  { label: 'Reminders', icon: Bell, href: '/crm/reminders' },
  { label: 'Activity', icon: Activity, href: '/crm/activity' },
  { label: 'Approvals', icon: ShieldCheck, href: '/crm/approvals' },
]

const adminNav = [
  { label: 'Team', icon: Users, href: '/crm/team' },
  { label: 'Templates', icon: LayoutTemplate, href: '/crm/templates' },
  { label: 'Compliance', icon: Shield, href: '/crm/compliance' },
  { label: 'Settings', icon: Settings, href: '/crm/settings' },
]

function isActive(pathname: string, href: string) {
  if (href === '/crm') return pathname === '/crm'
  return pathname === href || pathname.startsWith(href + '/')
}

export function CRMSidebar() {
  const pathname = usePathname()
  const currentUser = useCurrentUser()

  const renderNavItem = (item: (typeof mainNav)[number]) => {
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
  }

  return (
    <aside
      className="crm-sidebar hidden md:flex flex-col fixed left-0 top-[var(--header-height)] h-[calc(100vh-var(--header-height))] bg-[var(--bg-sidebar)] border-r border-[var(--border)] z-30 w-[var(--sidebar-collapsed-width)] lg:w-[var(--sidebar-width)]"
    >
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {mainNav.map(renderNavItem)}

        <div className="h-px bg-[var(--border)] mx-3 my-2" />

        {adminNav.map(renderNavItem)}
      </nav>

      <div className="px-3 py-3 border-t border-[var(--border)]">
        <div className="flex items-center gap-3 px-3 py-2 rounded-[var(--radius-md)] hover:bg-[var(--bg-elevated)] transition-colors cursor-pointer">
          <NeuAvatar name={currentUser.full_name} size="sm" />
          <div className="hidden lg:block min-w-0">
            <p className="text-sm font-medium text-[var(--text-primary)] truncate">{currentUser.full_name}</p>
            <p className="text-xs text-[var(--text-muted)]">{currentUser.role || 'Team'}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
