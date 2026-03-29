'use client'

import { useState } from 'react'
import { Sun, Moon, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NeuButton } from '@/components/ui/NeuButton'
import { NeuAvatar } from '@/components/ui/NeuAvatar'
import { useTheme } from './ThemeProvider'
import { MobileDrawer } from './MobileDrawer'

export function CRMHeader() {
  const { theme, toggleTheme } = useTheme()
  const [drawerOpen, setDrawerOpen] = useState(false)

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
          <NeuButton
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </NeuButton>
          <NeuAvatar name="Shane Pierson" size="sm" />
        </div>
      </header>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  )
}
