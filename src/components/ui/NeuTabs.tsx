'use client'

import { cn } from '@/lib/utils'

export interface NeuTabsProps {
  tabs: { id: string; label: string; icon?: React.ReactNode; count?: number }[]
  activeTab: string
  onTabChange: (tabId: string) => void
  size?: 'sm' | 'md'
}

export function NeuTabs({ tabs, activeTab, onTabChange, size = 'md' }: NeuTabsProps) {
  return (
    <div
      className={cn(
        'inline-flex gap-1 p-1 rounded-[var(--radius-lg)]',
        'bg-[var(--bg-body)] shadow-[var(--shadow-pressed)]',
        'overflow-x-auto scrollbar-none'
      )}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'flex items-center gap-1.5 whitespace-nowrap rounded-[var(--radius-md)] font-medium transition-all',
              'focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)]',
              size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm',
              isActive
                ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-[var(--shadow-raised-sm)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
            )}
          >
            {tab.icon}
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={cn(
                  'inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full text-[10px] font-bold px-1',
                  isActive
                    ? 'bg-[var(--teal-bg)] text-[var(--teal)]'
                    : 'bg-[var(--bg-elevated)] text-[var(--text-muted)]'
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
