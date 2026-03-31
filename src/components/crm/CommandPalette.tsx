'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc'
import { NeuCard, NeuBadge } from '@/components/ui'
import { Search, Gem, Handshake, FileText, CheckSquare, Calendar, Users2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const { data: results } = trpc.search.global.useQuery(
    { query },
    { enabled: open && query.length >= 1 }
  )

  useEffect(() => {
    if (open) {
      setQuery('')
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

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

  const navigate = useCallback((path: string) => {
    onClose()
    router.push(path)
  }, [onClose, router])

  if (!open) return null

  const groups = [
    { key: 'assets', label: 'Assets', icon: Gem, color: 'teal' as const, items: results?.assets ?? [], getPath: (i: { id: string }) => `/crm/assets/${i.id}`, getLabel: (i: { name: string; reference_code: string | null }) => i.name, getSub: (i: { reference_code: string | null; asset_type: string }) => `${i.reference_code} · ${i.asset_type}` },
    { key: 'partners', label: 'Partners', icon: Handshake, color: 'amethyst' as const, items: results?.partners ?? [], getPath: (i: { id: string }) => `/crm/partners/${i.id}`, getLabel: (i: { name: string }) => i.name, getSub: (i: { type: string; dd_status: string }) => `${i.type} · ${i.dd_status}` },
    { key: 'contacts', label: 'Contacts', icon: Users2, color: 'teal' as const, items: results?.contacts ?? [], getPath: (i: { id: string }) => `/crm/contacts/${i.id}`, getLabel: (i: { full_name: string }) => i.full_name, getSub: (i: { contact_type: string; kyc_status: string }) => `${i.contact_type} · KYC: ${i.kyc_status}` },
    { key: 'documents', label: 'Documents', icon: FileText, color: 'sapphire' as const, items: results?.documents ?? [], getPath: () => `/crm/documents`, getLabel: (i: { title: string }) => i.title, getSub: (i: { document_type: string }) => i.document_type },
    { key: 'tasks', label: 'Tasks', icon: CheckSquare, color: 'emerald' as const, items: results?.tasks ?? [], getPath: () => `/crm/tasks`, getLabel: (i: { title: string }) => i.title, getSub: (i: { status: string }) => i.status },
    { key: 'meetings', label: 'Meetings', icon: Calendar, color: 'amber' as const, items: results?.meetings ?? [], getPath: () => `/crm/meetings`, getLabel: (i: { title: string }) => i.title, getSub: (i: { meeting_date: string }) => new Date(i.meeting_date).toLocaleDateString() },
  ]

  const hasResults = groups.some((g) => g.items.length > 0)

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
          <kbd className="hidden sm:inline text-[11px] text-[var(--text-muted)] bg-[var(--bg-body)] px-1.5 py-0.5 rounded" style={{ fontFamily: 'var(--font-mono)' }}>
            ESC
          </kbd>
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          {query.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <p className="text-sm text-[var(--text-muted)]">Start typing to search across all entities</p>
            </div>
          ) : !hasResults ? (
            <div className="px-4 py-8 text-center">
              <p className="text-sm text-[var(--text-muted)]">No results for &ldquo;{query}&rdquo;</p>
            </div>
          ) : (
            groups.filter((g) => g.items.length > 0).map((group) => (
              <div key={group.key}>
                <div className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)] bg-[var(--bg-body)]">
                  {group.label}
                </div>
                {group.items.map((item: Record<string, unknown>) => (
                  <button
                    key={item.id as string}
                    onClick={() => navigate(group.getPath(item as never))}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-left hover:bg-[var(--bg-elevated)] transition-colors"
                  >
                    <group.icon className="h-4 w-4 shrink-0" style={{ color: `var(--${group.color})` }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[var(--text-primary)] truncate">{group.getLabel(item as never)}</p>
                      <p className="text-xs text-[var(--text-muted)] truncate">{group.getSub(item as never)}</p>
                    </div>
                  </button>
                ))}
              </div>
            ))
          )}
        </div>
      </NeuCard>
    </div>
  )
}
