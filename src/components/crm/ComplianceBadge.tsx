'use client'

import { cn } from '@/lib/utils'

interface ComplianceBadgeProps {
  kycStatus: string
  ddStatus?: string
  size?: 'sm' | 'md'
  showLabel?: boolean
}

const STATUS_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  verified: { color: 'var(--chartreuse)', bg: 'color-mix(in srgb, var(--chartreuse) 15%, transparent)', label: 'Verified' },
  passed: { color: 'var(--chartreuse)', bg: 'color-mix(in srgb, var(--chartreuse) 15%, transparent)', label: 'Passed' },
  pending: { color: 'var(--amber)', bg: 'color-mix(in srgb, var(--amber) 15%, transparent)', label: 'In Review' },
  in_review: { color: 'var(--amber)', bg: 'color-mix(in srgb, var(--amber) 15%, transparent)', label: 'In Review' },
  in_progress: { color: 'var(--amber)', bg: 'color-mix(in srgb, var(--amber) 15%, transparent)', label: 'In Progress' },
  not_started: { color: 'var(--ruby)', bg: 'color-mix(in srgb, var(--ruby) 15%, transparent)', label: 'Action Required' },
  failed: { color: 'var(--ruby)', bg: 'color-mix(in srgb, var(--ruby) 15%, transparent)', label: 'Failed' },
  rejected: { color: 'var(--ruby)', bg: 'color-mix(in srgb, var(--ruby) 15%, transparent)', label: 'Rejected' },
  expired: { color: 'var(--ruby)', bg: 'color-mix(in srgb, var(--ruby) 15%, transparent)', label: 'Expired' },
}

export function ComplianceBadge({ kycStatus, ddStatus, size = 'sm', showLabel = true }: ComplianceBadgeProps) {
  const status = kycStatus || ddStatus || 'not_started'
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.not_started

  const dotSize = size === 'sm' ? 'w-2 h-2' : 'w-3 h-3'
  const textSize = size === 'sm' ? 'text-[10px]' : 'text-xs'

  return (
    <span className={cn('inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded-[var(--radius-sm)]')}
      style={{ background: config.bg }}>
      <span className={cn(dotSize, 'rounded-full shrink-0')} style={{ background: config.color }} />
      {showLabel && <span className={cn(textSize, 'font-medium')} style={{ color: config.color }}>{config.label}</span>}
    </span>
  )
}

export function getComplianceLevel(kycStatus: string): 'red' | 'yellow' | 'green' {
  if (kycStatus === 'verified' || kycStatus === 'passed') return 'green'
  if (kycStatus === 'pending' || kycStatus === 'in_review' || kycStatus === 'in_progress') return 'yellow'
  return 'red'
}
