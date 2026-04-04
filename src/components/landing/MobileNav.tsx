'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Layers, Coins, Landmark, Handshake, ArrowLeftRight, Users, BookOpen, LogIn } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { label: 'Home', href: '/', icon: null },
  { label: 'About', href: '/about', icon: Users },
  { label: 'Knowledge Hub', href: '/knowledge', icon: BookOpen },
  { type: 'divider' as const, label: 'Value Creation Models' },
  { label: 'Tokenization', href: '/knowledge/tokenization', icon: Coins },
  { label: 'Fractional Securities', href: '/knowledge/fractional', icon: Layers },
  { label: 'Debt Instruments', href: '/knowledge/debt', icon: Landmark },
  { label: 'Broker Sale', href: '/knowledge/broker-sale', icon: Handshake },
  { label: 'Barter Exchange', href: '/knowledge/barter', icon: ArrowLeftRight },
  { label: 'Register Interest', href: '/interest', icon: BookOpen },
  { type: 'divider' as const, label: '' },
  { label: 'Team Login', href: '/login', icon: LogIn },
]

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="sm:hidden">
      <button onClick={() => setOpen(true)}
        className="p-2 text-white/60 hover:text-white transition-colors"
        aria-label="Open menu">
        <Menu className="h-5 w-5" />
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={() => setOpen(false)} />

          {/* Drawer */}
          <div className="fixed top-0 right-0 bottom-0 w-72 bg-[#0A0F1A] border-l border-white/10 z-50 overflow-y-auto"
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
              <span className="text-xs uppercase tracking-[0.2em] text-white/40">Menu</span>
              <button onClick={() => setOpen(false)} className="p-2 text-white/50 hover:text-white transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Nav items */}
            <nav className="py-4">
              {navItems.map((item, i) => {
                if ('type' in item && item.type === 'divider') {
                  return (
                    <div key={i} className="px-5 pt-4 pb-2">
                      {item.label && (
                        <span className="text-[10px] uppercase tracking-[0.2em] text-white/25">{item.label}</span>
                      )}
                      {!item.label && <div className="h-px bg-white/5" />}
                    </div>
                  )
                }

                const Icon = 'icon' in item ? item.icon : null
                const isActive = pathname === ('href' in item ? item.href : '')

                return (
                  <Link key={i} href={'href' in item ? item.href! : '/'}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-5 py-3 text-sm transition-colors',
                      isActive ? 'text-[#1A8B7A] bg-white/[0.03]' : 'text-white/60 hover:text-white hover:bg-white/[0.02]'
                    )}>
                    {Icon && <Icon className="h-4 w-4 shrink-0" />}
                    {!Icon && <span className="w-4" />}
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-white/5 mt-auto">
              <p className="text-[10px] text-white/15">PleoChrome &bull; Value from Every Angle</p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
