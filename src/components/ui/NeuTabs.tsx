'use client'

import { useRef, useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

export interface NeuTabsProps {
  tabs: { id: string; label: string; icon?: React.ReactNode; count?: number }[]
  activeTab: string
  onTabChange: (tabId: string) => void
  size?: 'sm' | 'md'
}

export function NeuTabs({ tabs, activeTab, onTabChange, size = 'md' }: NeuTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  function checkScroll() {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 2)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2)
  }

  useEffect(() => {
    checkScroll()
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', checkScroll, { passive: true })
    const ro = new ResizeObserver(checkScroll)
    ro.observe(el)
    return () => { el.removeEventListener('scroll', checkScroll); ro.disconnect() }
  }, [])

  // Auto-scroll active tab into view
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const activeBtn = el.querySelector('[data-active="true"]') as HTMLElement | null
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    }
  }, [activeTab])

  return (
    <div className="relative w-full max-w-full">
      {/* Left fade */}
      {canScrollLeft && (
        <div className="absolute left-0 top-0 bottom-0 w-6 z-10 pointer-events-none rounded-l-[var(--radius-lg)] bg-gradient-to-r from-[var(--bg-body)] to-transparent" />
      )}
      <div
        ref={scrollRef}
        className={cn(
          'flex gap-1 p-1 rounded-[var(--radius-lg)] w-full',
          'bg-[var(--bg-body)] shadow-[var(--shadow-pressed)]',
          'overflow-x-auto scrollbar-none'
        )}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab
          return (
            <button
              key={tab.id}
              data-active={isActive}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'flex items-center gap-1.5 whitespace-nowrap rounded-[var(--radius-md)] font-medium transition-all shrink-0',
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
      {/* Right fade */}
      {canScrollRight && (
        <div className="absolute right-0 top-0 bottom-0 w-6 z-10 pointer-events-none rounded-r-[var(--radius-lg)] bg-gradient-to-l from-[var(--bg-body)] to-transparent" />
      )}
    </div>
  )
}
