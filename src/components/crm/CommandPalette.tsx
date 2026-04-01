'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc'
import { NeuCard } from '@/components/ui'
import { Search, Gem, Handshake, FileText, CheckSquare, Calendar, Users2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const { data: results } = trpc.search.global.useQuery(
    { query },
    { enabled: open && query.length >= 1 }
  )
  const { data: quickCounts } = trpc.search.getQuickFilterCounts.useQuery(
    undefined,
    { enabled: open }
  )

  useEffect(() => {
    if (open) { setQuery(''); setSelectedIndex(-1); setTimeout(() => inputRef.current?.focus(), 100) }
  }, [open])

  // Reset selection when query or results change
  useEffect(() => { setSelectedIndex(-1) }, [query])

  const groupDefs = [
    { key: 'assets', label: 'Assets', icon: Gem, color: 'teal' as const, items: results?.assets ?? [], getPath: (i: { id: string }) => `/crm/assets/${i.id}`, getLabel: (i: { name: string }) => i.name, getSub: (i: { reference_code: string | null; asset_type: string }) => `${i.reference_code} · ${i.asset_type}` },
    { key: 'partners', label: 'Partners', icon: Handshake, color: 'amethyst' as const, items: results?.partners ?? [], getPath: (i: { id: string }) => `/crm/partners/${i.id}`, getLabel: (i: { name: string }) => i.name, getSub: (i: { type: string; dd_status: string }) => `${i.type} · ${i.dd_status}` },
    { key: 'contacts', label: 'Contacts', icon: Users2, color: 'teal' as const, items: results?.contacts ?? [], getPath: (i: { id: string }) => `/crm/contacts/${i.id}`, getLabel: (i: { full_name: string }) => i.full_name, getSub: (i: { contact_type: string; kyc_status: string }) => `${i.contact_type} · KYC: ${i.kyc_status}` },
    { key: 'documents', label: 'Documents', icon: FileText, color: 'sapphire' as const, items: results?.documents ?? [], getPath: (i: { id: string; asset_id?: string | null }) => i.asset_id ? `/crm/assets/${i.asset_id}?tab=documents` : `/crm/documents`, getLabel: (i: { title: string }) => i.title, getSub: (i: { document_type: string }) => i.document_type },
    { key: 'tasks', label: 'Tasks', icon: CheckSquare, color: 'emerald' as const, items: results?.tasks ?? [], getPath: (i: { id: string; asset_id?: string | null }) => i.asset_id ? `/crm/assets/${i.asset_id}?tab=workflow&taskId=${i.id}` : `/crm/tasks`, getLabel: (i: { title: string }) => i.title, getSub: (i: { status: string }) => i.status },
    { key: 'meetings', label: 'Meetings', icon: Calendar, color: 'amber' as const, items: results?.meetings ?? [], getPath: () => `/crm/meetings`, getLabel: (i: { title: string }) => i.title, getSub: (i: { meeting_date: string }) => new Date(i.meeting_date).toLocaleDateString() },
  ]

  // Build flat navigable item list
  const flatItems = groupDefs.flatMap(g =>
    (g.items as Record<string, unknown>[]).map(item => ({
      id: item.id as string,
      path: g.getPath(item as never),
      label: g.getLabel(item as never),
      sub: g.getSub(item as never),
      icon: g.icon,
      color: g.color,
      groupKey: g.key,
    }))
  )

  const navigate = useCallback((path: string) => {
    onClose()
    router.push(path)
  }, [onClose, router])

  // Auto-scroll selected item into view
  useEffect(() => {
    if (selectedIndex < 0 || !listRef.current) return
    const el = listRef.current.querySelector(`[data-idx="${selectedIndex}"]`) as HTMLElement | null
    el?.scrollIntoView({ block: 'nearest' })
  }, [selectedIndex])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return }
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(i => Math.min(i + 1, flatItems.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(i => Math.max(i - 1, 0))
      } else if (e.key === 'Enter' && selectedIndex >= 0 && flatItems[selectedIndex]) {
        e.preventDefault()
        navigate(flatItems[selectedIndex].path)
      }
    }
    if (open) {
      document.addEventListener('keydown', handleKey)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose, navigate, flatItems, selectedIndex])

  if (!open) return null

  const hasResults = flatItems.length > 0
  let globalIdx = -1

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[15vh] px-4">
      <div className="absolute inset-0 bg-[var(--overlay)]" onClick={onClose} />
      <NeuCard variant="raised" padding="none" className="relative w-full max-w-[560px] z-10 overflow-hidden">
        <div className="flex items-center gap-3 px-4 h-14 border-b border-[var(--border)]">
          <Search className="h-5 w-5 text-[var(--text-muted)] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search assets, partners, documents, tasks..."
            className="flex-1 bg-transparent text-[var(--text-primary)] placeholder:text-[var(--text-placeholder)] text-base outline-none"
          />
          <div className="hidden sm:flex items-center gap-1.5">
            <kbd className="text-[11px] text-[var(--text-muted)] bg-[var(--bg-body)] px-1.5 py-0.5 rounded" style={{ fontFamily: 'var(--font-mono)' }}>↑↓</kbd>
            <kbd className="text-[11px] text-[var(--text-muted)] bg-[var(--bg-body)] px-1.5 py-0.5 rounded" style={{ fontFamily: 'var(--font-mono)' }}>↵</kbd>
            <kbd className="text-[11px] text-[var(--text-muted)] bg-[var(--bg-body)] px-1.5 py-0.5 rounded" style={{ fontFamily: 'var(--font-mono)' }}>ESC</kbd>
          </div>
        </div>

        <div ref={listRef} className="max-h-[400px] overflow-y-auto">
          {query.length === 0 ? (
            <div className="px-4 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-3">Quick Filters</p>
              <div className="flex flex-wrap gap-2">
                {(quickCounts?.blocked ?? 0) > 0 && (
                  <button onClick={() => setQuery('blocked:')} className="px-3 py-1.5 rounded-full text-xs font-medium bg-[var(--bg-body)] shadow-[var(--shadow-raised-sm)] text-[var(--ruby)] hover:bg-[var(--bg-elevated)] transition-colors">
                    {quickCounts?.blocked} blocked
                  </button>
                )}
                {(quickCounts?.overdue ?? 0) > 0 && (
                  <button onClick={() => setQuery('overdue:')} className="px-3 py-1.5 rounded-full text-xs font-medium bg-[var(--bg-body)] shadow-[var(--shadow-raised-sm)] text-[var(--amber)] hover:bg-[var(--bg-elevated)] transition-colors">
                    {quickCounts?.overdue} overdue
                  </button>
                )}
                {(quickCounts?.inLead ?? 0) > 0 && (
                  <button onClick={() => setQuery('phase:lead')} className="px-3 py-1.5 rounded-full text-xs font-medium bg-[var(--bg-body)] shadow-[var(--shadow-raised-sm)] text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] transition-colors">
                    {quickCounts?.inLead} in Lead
                  </button>
                )}
                {(quickCounts?.blocked ?? 0) === 0 && (quickCounts?.overdue ?? 0) === 0 && (quickCounts?.inLead ?? 0) === 0 && (
                  <p className="text-sm text-[var(--text-muted)]">Start typing to search across all entities</p>
                )}
              </div>
              <p className="text-[11px] text-[var(--text-placeholder)] mt-3">
                Tip: <code style={{ fontFamily: 'var(--font-mono)' }}>blocked:</code> · <code style={{ fontFamily: 'var(--font-mono)' }}>overdue:</code> · <code style={{ fontFamily: 'var(--font-mono)' }}>phase:lead</code>
              </p>
            </div>
          ) : !hasResults ? (
            <div className="px-4 py-8 text-center">
              <p className="text-sm text-[var(--text-muted)]">No results for &ldquo;{query}&rdquo;</p>
            </div>
          ) : (
            groupDefs.filter(g => g.items.length > 0).map(group => (
              <div key={group.key}>
                <div className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)] bg-[var(--bg-body)]">
                  {group.label}
                </div>
                {(group.items as Record<string, unknown>[]).map(item => {
                  globalIdx++
                  const idx = globalIdx
                  const isSelected = selectedIndex === idx
                  return (
                    <button
                      key={item.id as string}
                      data-idx={idx}
                      onClick={() => navigate(group.getPath(item as never))}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={cn(
                        'flex items-center gap-3 w-full px-4 py-2.5 text-left transition-colors',
                        isSelected ? 'bg-[var(--bg-elevated)]' : 'hover:bg-[var(--bg-elevated)]'
                      )}
                    >
                      <group.icon className="h-4 w-4 shrink-0" style={{ color: `var(--${group.color})` }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[var(--text-primary)] truncate">{group.getLabel(item as never)}</p>
                        <p className="text-xs text-[var(--text-muted)] truncate">{group.getSub(item as never)}</p>
                      </div>
                      {isSelected && <span className="text-[10px] text-[var(--text-muted)] shrink-0" style={{ fontFamily: 'var(--font-mono)' }}>↵</span>}
                    </button>
                  )
                })}
              </div>
            ))
          )}
        </div>
      </NeuCard>
    </div>
  )
}
