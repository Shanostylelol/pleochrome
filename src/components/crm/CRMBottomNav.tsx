'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LayoutDashboard, Gem, CheckSquare, Activity, Menu } from 'lucide-react'
import { MoreSheet } from './MoreSheet'

const bottomItems = [
  { label: 'Pipeline', icon: LayoutDashboard, href: '/crm' },
  { label: 'Assets', icon: Gem, href: '/crm/assets' },
  { label: 'Tasks', icon: CheckSquare, href: '/crm/tasks' },
  { label: 'Activity', icon: Activity, href: '/crm/activity' },
]

export function CRMBottomNav() {
  const pathname = usePathname()
  const [moreOpen, setMoreOpen] = useState(false)

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[var(--bg-surface)] border-t border-[var(--border)]" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="flex items-stretch h-16">
          {bottomItems.map((item) => {
            const active = item.href === '/crm' ? pathname === '/crm' : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex-1 flex flex-col items-center justify-center gap-0.5 min-w-[44px] min-h-[44px] transition-colors',
                  active ? 'text-[var(--teal)]' : 'text-[var(--text-muted)]'
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            )
          })}
          <button
            onClick={() => setMoreOpen(true)}
            className={cn(
              'flex-1 flex flex-col items-center justify-center gap-0.5 min-w-[44px] min-h-[44px] transition-colors',
              moreOpen ? 'text-[var(--teal)]' : 'text-[var(--text-muted)]'
            )}
          >
            <Menu className="h-5 w-5" />
            <span className="text-[10px] font-medium">More</span>
          </button>
        </div>
      </nav>

      <MoreSheet open={moreOpen} onClose={() => setMoreOpen(false)} />
    </>
  )
}
