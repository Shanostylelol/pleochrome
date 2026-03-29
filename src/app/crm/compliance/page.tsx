'use client'

import { Shield, AlertTriangle } from 'lucide-react'
import { NeuCard, NeuBadge, NeuProgress } from '@/components/ui'
import { trpc } from '@/lib/trpc'

export default function CompliancePage() {
  const { data: alerts = [], isLoading } = trpc.governance.complianceDashboard.useQuery()
  const { data: stats } = trpc.assets.getStats.useQuery()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
          Compliance Dashboard
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Governance alerts and progress</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <NeuCard variant="raised-sm" padding="md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Compliance Score</span>
            <Shield className={`h-4 w-4 ${(stats?.complianceScore ?? 0) >= 80 ? 'text-[var(--chartreuse)]' : 'text-[var(--amber)]'}`} />
          </div>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{stats?.complianceScore ?? 0}%</p>
          <NeuProgress value={stats?.complianceScore ?? 0} max={100} color={stats?.complianceScore && stats.complianceScore >= 80 ? 'chartreuse' : 'amber'} />
        </NeuCard>

        <NeuCard variant="raised-sm" padding="md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Active Assets</span>
          </div>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{stats?.activeCount ?? 0}</p>
        </NeuCard>

        <NeuCard variant="raised-sm" padding="md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Active Alerts</span>
            <AlertTriangle className="h-4 w-4 text-[var(--amber)]" />
          </div>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{alerts.length}</p>
        </NeuCard>
      </div>

      {isLoading ? (
        <p className="text-[var(--text-muted)] text-center py-10">Loading compliance data...</p>
      ) : alerts.length === 0 ? (
        <NeuCard variant="pressed" padding="lg" className="text-center">
          <Shield className="h-12 w-12 text-[var(--chartreuse)] mx-auto mb-3" />
          <p className="text-sm text-[var(--text-primary)] font-medium">All clear</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">No compliance alerts at this time</p>
        </NeuCard>
      ) : (
        <div className="space-y-2">
          {alerts.map((alert, idx) => (
            <NeuCard key={idx} variant="raised-sm" padding="sm" className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-[var(--amber)] shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[var(--text-primary)]">{alert.detail}</p>
                <p className="text-xs text-[var(--text-muted)]">
                  {alert.asset_name ?? alert.entity_name} {alert.deadline ? `· Due: ${new Date(alert.deadline).toLocaleDateString()}` : ''}
                </p>
              </div>
              <NeuBadge color={alert.alert_type === 'overdue' ? 'ruby' : 'amber'} size="sm">
                {alert.alert_type}
              </NeuBadge>
            </NeuCard>
          ))}
        </div>
      )}
    </div>
  )
}
