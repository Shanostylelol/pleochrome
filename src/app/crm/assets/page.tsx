'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc'
import { NeuCard, NeuBadge, NeuButton, NeuInput, NeuProgress } from '@/components/ui'
import { Plus, Search, Gem, LayoutGrid, List, Download } from 'lucide-react'
import { exportCSV } from '@/lib/csv-export'
import { cn } from '@/lib/utils'
import { AssetCard } from '@/components/crm/AssetCard'
import { ListPageSkeleton } from '@/components/crm/skeletons'

type PathFilter = 'fractional_securities' | 'tokenization' | 'debt_instrument' | 'broker_sale' | 'barter'

const PATH_LABEL: Record<string, string> = {
  fractional_securities: 'Fractional', tokenization: 'Tokenization', debt_instrument: 'Debt',
  broker_sale: 'Broker Sale', barter: 'Barter',
}
const PATH_COLOR: Record<string, 'emerald' | 'teal' | 'sapphire' | 'amber' | 'gray'> = {
  fractional_securities: 'emerald', tokenization: 'teal', debt_instrument: 'sapphire', broker_sale: 'amber', barter: 'gray',
}
const STATUS_COLOR: Record<string, 'emerald' | 'teal' | 'amber' | 'chartreuse' | 'ruby' | 'gray'> = {
  active: 'teal', paused: 'amber', completed: 'chartreuse', terminated: 'ruby', archived: 'gray',
}
const PHASE_LABEL: Record<string, string> = {
  lead: 'Lead', intake: 'Intake', asset_maturity: 'Asset Maturity',
  security: 'Security', value_creation: 'Value Creation', distribution: 'Distribution',
}

function fmtVal(val: number | null): string {
  if (!val) return 'TBD'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val)
}

function formatType(type: string): string {
  return type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

const FILTERS: { label: string; value: PathFilter | null; color: string }[] = [
  { label: 'All', value: null, color: 'var(--text-muted)' },
  { label: 'Fractional', value: 'fractional_securities', color: 'var(--emerald)' },
  { label: 'Tokenization', value: 'tokenization', color: 'var(--teal)' },
  { label: 'Debt', value: 'debt_instrument', color: 'var(--sapphire)' },
]

export default function AssetsPage() {
  const [search, setSearch] = useState('')
  const [pathFilter, setPathFilter] = useState<PathFilter | null>(null)
  const [view, setView] = useState<'grid' | 'table'>('table')
  const router = useRouter()

  const { data: assets = [], isLoading } = trpc.assets.list.useQuery(
    pathFilter ? { valueModel: pathFilter } : undefined
  )

  const filtered = search
    ? assets.filter((a) =>
        (a.name ?? '').toLowerCase().includes(search.toLowerCase()) ||
        (a.reference_code ?? '').toLowerCase().includes(search.toLowerCase())
      )
    : assets

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
            Assets
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">{filtered.length} assets in pipeline</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="p-0.5 rounded-[var(--radius-md)] bg-[var(--bg-body)] shadow-[var(--shadow-pressed)] flex">
            <button onClick={() => setView('grid')} className={cn('p-2 rounded-[var(--radius-sm)] transition-all', view === 'grid' ? 'bg-[var(--bg-surface)] shadow-[var(--shadow-raised-sm)] text-[var(--text-primary)]' : 'text-[var(--text-muted)]')} aria-label="Grid">
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button onClick={() => setView('table')} className={cn('p-2 rounded-[var(--radius-sm)] transition-all', view === 'table' ? 'bg-[var(--bg-surface)] shadow-[var(--shadow-raised-sm)] text-[var(--text-primary)]' : 'text-[var(--text-muted)]')} aria-label="Table">
              <List className="h-4 w-4" />
            </button>
          </div>
          <NeuButton variant="ghost" icon={<Download className="h-4 w-4" />} size="sm"
            onClick={() => exportCSV('assets.csv', [
              { key: 'reference_code', label: 'Reference' }, { key: 'name', label: 'Name' },
              { key: 'asset_type', label: 'Type' }, { key: 'value_model', label: 'Model' },
              { key: 'current_phase', label: 'Phase' }, { key: 'status', label: 'Status' },
              { key: 'claimed_value', label: 'Claimed Value' }, { key: 'appraised_value', label: 'Appraised Value' },
            ], filtered as unknown as Record<string, unknown>[])}>
            <span className="hidden sm:inline">CSV</span>
          </NeuButton>
          <NeuButton icon={<Plus className="h-4 w-4" />} onClick={() => router.push('/crm/assets/new')}>
            <span className="hidden sm:inline">New Asset</span>
          </NeuButton>
        </div>
      </div>

      {/* Stats by path */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {(['fractional_securities', 'tokenization', 'debt_instrument', 'broker_sale'] as const).map((path) => {
          const count = assets.filter((a: any) => a.value_model === path).length
          return (
            <NeuCard key={path} variant="raised-sm" padding="md" hoverable className="cursor-pointer" onClick={() => setPathFilter(path === pathFilter ? null : path as PathFilter)}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">{PATH_LABEL[path]}</span>
                <NeuBadge color={PATH_COLOR[path]} dot />
              </div>
              <p className="text-xl font-bold text-[var(--text-primary)]">{count}</p>
            </NeuCard>
          )
        })}
      </div>

      {/* Filters + Search */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="p-1 rounded-[var(--radius-lg)] bg-[var(--bg-body)] shadow-[var(--shadow-pressed)] inline-flex gap-1">
          {FILTERS.map((f) => {
            const isActive = pathFilter === f.value
            return (
              <button key={f.label} onClick={() => setPathFilter(isActive && f.value !== null ? null : f.value)}
                className={cn('px-3 py-1.5 rounded-[var(--radius-md)] text-xs font-medium transition-all', isActive ? 'text-white shadow-[var(--shadow-raised-sm)]' : 'text-[var(--text-muted)] shadow-[var(--shadow-raised-sm)] bg-[var(--bg-surface)]')}
                style={isActive ? { backgroundColor: f.color } : undefined}>{f.label}</button>
            )
          })}
        </div>
        <div className="flex-1 max-w-sm">
          <NeuInput placeholder="Search by name or reference..." icon={<Search className="h-4 w-4" />} value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <ListPageSkeleton />
      ) : filtered.length === 0 ? (
        <NeuCard variant="pressed" padding="lg" className="text-center">
          <Gem className="h-12 w-12 text-[var(--text-placeholder)] mx-auto mb-3" />
          <p className="text-sm text-[var(--text-muted)]">No assets found</p>
        </NeuCard>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((asset) => <AssetCard key={asset.id} asset={asset} />)}
        </div>
      ) : (
        <NeuCard variant="raised" padding="none" className="overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--bg-body)]">
                <th className="text-left px-4 py-3 font-semibold text-[var(--text-muted)] text-xs uppercase tracking-wider">Reference</th>
                <th className="text-left px-4 py-3 font-semibold text-[var(--text-muted)] text-xs uppercase tracking-wider">Name</th>
                <th className="text-left px-4 py-3 font-semibold text-[var(--text-muted)] text-xs uppercase tracking-wider hidden md:table-cell">Type</th>
                <th className="text-left px-4 py-3 font-semibold text-[var(--text-muted)] text-xs uppercase tracking-wider hidden lg:table-cell">Path</th>
                <th className="text-left px-4 py-3 font-semibold text-[var(--text-muted)] text-xs uppercase tracking-wider">Phase</th>
                <th className="text-right px-4 py-3 font-semibold text-[var(--text-muted)] text-xs uppercase tracking-wider">Value</th>
                <th className="text-left px-4 py-3 font-semibold text-[var(--text-muted)] text-xs uppercase tracking-wider hidden lg:table-cell">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((asset) => (
                <tr key={asset.id} onClick={() => router.push(`/crm/assets/${asset.id}`)} className="border-b border-[var(--border)] hover:bg-[var(--bg-elevated)] cursor-pointer transition-colors">
                  <td className="px-4 py-3 font-medium text-[var(--text-muted)]" style={{ fontFamily: 'var(--font-mono)' }}>{asset.reference_code}</td>
                  <td className="px-4 py-3 font-semibold text-[var(--text-primary)]">{asset.name}</td>
                  <td className="px-4 py-3 hidden md:table-cell"><NeuBadge color="gray" size="sm">{formatType(asset.asset_type ?? '')}</NeuBadge></td>
                  <td className="px-4 py-3 hidden lg:table-cell"><NeuBadge color={PATH_COLOR[asset.value_model as string] ?? 'gray'} size="sm">{PATH_LABEL[asset.value_model as string] ?? asset.value_model}</NeuBadge></td>
                  <td className="px-4 py-3 text-[var(--text-secondary)]">{PHASE_LABEL[asset.current_phase as string] ?? asset.current_phase}</td>
                  <td className="px-4 py-3 text-right font-semibold text-[var(--text-primary)]">{fmtVal(asset.appraised_value ?? asset.claimed_value)}</td>
                  <td className="px-4 py-3 hidden lg:table-cell"><NeuBadge color={STATUS_COLOR[asset.status as string] ?? 'gray'} size="sm">{asset.status}</NeuBadge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </NeuCard>
      )}
    </div>
  )
}
