'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Handshake, Users2, FileText, Calendar, ShieldCheck,
  Users, LayoutTemplate, Shield, Settings, X,
} from 'lucide-react'

const moreItems = [
  { label: 'Partners', icon: Handshake, href: '/crm/partners' },
  { label: 'Contacts', icon: Users2, href: '/crm/contacts' },
  { label: 'Documents', icon: FileText, href: '/crm/documents' },
  { label: 'Meetings', icon: Calendar, href: '/crm/meetings' },
  { label: 'Approvals', icon: ShieldCheck, href: '/crm/approvals' },
  { label: 'Team', icon: Users, href: '/crm/team' },
  { label: 'Templates', icon: LayoutTemplate, href: '/crm/templates' },
  { label: 'Compliance', icon: Shield, href: '/crm/compliance' },
  { label: 'Settings', icon: Settings, href: '/crm/settings' },
]

export function MoreSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname()

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="absolute inset-0 bg-[var(--overlay)]" onClick={onClose} />
      <div
        className="absolute bottom-0 left-0 right-0 bg-[var(--bg-surface)] rounded-t-[var(--radius-xl)] shadow-[var(--shadow-raised)] animate-slide-up"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">More</h3>
          <button onClick={onClose} className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)]">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-1 px-3 pb-4">
          {moreItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex flex-col items-center gap-1.5 py-4 rounded-[var(--radius-md)] min-h-[44px] transition-colors',
                  active
                    ? 'text-[var(--teal)] bg-[var(--teal-bg)]'
                    : 'text-[var(--text-muted)] hover:bg-[var(--bg-elevated)]'
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
