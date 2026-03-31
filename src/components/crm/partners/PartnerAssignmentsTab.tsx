'use client'

import Link from 'next/link'
import { NeuCard, NeuBadge } from '@/components/ui'
import { Gem } from 'lucide-react'

const STATUS_COLOR: Record<string, 'teal' | 'amber' | 'chartreuse' | 'ruby' | 'gray'> = {
  active: 'teal',
  paused: 'amber',
  completed: 'chartreuse',
  terminated: 'ruby',
  archived: 'gray',
}

type AssetPartner = Record<string, unknown>

export function PartnerAssignmentsTab({ assets }: { assets: AssetPartner[] }) {
  if (assets.length === 0) {
    return (
      <NeuCard variant="pressed" padding="lg" className="text-center">
        <Gem className="h-10 w-10 text-[var(--text-placeholder)] mx-auto mb-3" />
        <p className="text-sm text-[var(--text-muted)]">No assets assigned to this partner</p>
        <p className="text-xs text-[var(--text-placeholder)] mt-1">
          Asset-partner assignments are managed from individual asset pages
        </p>
      </NeuCard>
    )
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-[var(--text-primary)]">
        Assigned Assets ({assets.length})
      </h3>
      {assets.map((ap) => {
        const asset = ap.assets as Record<string, unknown> | null
        const status = (asset?.status as string) ?? 'active'
        return (
          <NeuCard key={ap.id as string} variant="raised" padding="md" hoverable>
            <Link href={`/crm/assets/${asset?.id ?? ''}`} className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium text-sm text-[var(--text-primary)]">
                  {(asset?.name as string) ?? '---'}
                </p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5 font-mono">
                  {(asset?.reference_code as string) ?? '---'}
                </p>
              </div>
              <NeuBadge color={STATUS_COLOR[status] ?? 'gray'} size="sm">
                {status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
              </NeuBadge>
            </Link>
          </NeuCard>
        )
      })}
    </div>
  )
}
