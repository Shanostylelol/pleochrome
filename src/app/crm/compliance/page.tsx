'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Shield, AlertTriangle, UserX, Clock } from 'lucide-react'
import { NeuCard, NeuBadge, NeuProgress } from '@/components/ui'
import { ListPageSkeleton } from '@/components/crm/skeletons'
import { trpc } from '@/lib/trpc'
import { PHASES, type PhaseKey } from '@/lib/constants'

function daysUntil(dateStr: string): number {
  const ms = new Date(dateStr).getTime() - Date.now()
  return Math.ceil(ms / 86_400_000)
}

export default function CompliancePage() {
  const { data: compliance = [], isLoading: complianceLoading } =
    trpc.dashboard.getComplianceSummary.useQuery()
  const { data: expiring = [], isLoading: expiringLoading } =
    trpc.partners.getExpiringCredentials.useQuery({ daysAhead: 60 })
  const { data: incompleteKyc = [], isLoading: kycLoading } =
    trpc.kyc.getIncomplete.useQuery()

  const isLoading = complianceLoading || expiringLoading || kycLoading

  const totalAssets = compliance.length
  const avgScore = totalAssets > 0
    ? Math.round(compliance.reduce((s, a) => s + a.score, 0) / totalAssets)
    : 0
  const expiringCount = expiring.length
  const incompleteCount = incompleteKyc.length

  return (
    <div className="space-y-6">
      <div>
        <h1
          className="text-2xl font-semibold text-[var(--text-primary)]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Compliance Dashboard
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Governance health, credentials, and KYC status
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <NeuCard variant="raised-sm" padding="md">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Total Assets
            </span>
            <Shield className="h-4 w-4 text-[var(--teal)]" />
          </div>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{totalAssets}</p>
        </NeuCard>
        <NeuCard variant="raised-sm" padding="md">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Avg Compliance
            </span>
            <Shield className="h-4 w-4 text-[var(--chartreuse)]" />
          </div>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{avgScore}%</p>
        </NeuCard>
        <NeuCard variant="raised-sm" padding="md">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Expiring Creds
            </span>
            <Clock className="h-4 w-4 text-[var(--amber)]" />
          </div>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{expiringCount}</p>
        </NeuCard>
        <NeuCard variant="raised-sm" padding="md">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Incomplete KYC
            </span>
            <UserX className="h-4 w-4 text-[var(--ruby)]" />
          </div>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{incompleteCount}</p>
        </NeuCard>
      </div>

      {isLoading ? (
        <ListPageSkeleton />
      ) : (
        <>
          {/* Asset Compliance Table */}
          <NeuCard variant="raised" padding="none" className="overflow-hidden">
            <div className="px-4 py-3 border-b border-[var(--border)]">
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                Asset Compliance
              </h3>
            </div>
            {compliance.length === 0 ? (
              <div className="text-center py-10">
                <Shield className="h-10 w-10 text-[var(--chartreuse)] mx-auto mb-2" />
                <p className="text-sm text-[var(--text-muted)]">No assets with governance stages</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--border)] bg-[var(--bg-body)]">
                      <th className="text-left px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Asset</th>
                      <th className="text-left px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] hidden sm:table-cell">Phase</th>
                      <th className="text-center px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] hidden md:table-cell">Stages</th>
                      <th className="text-left px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Compliance</th>
                      <th className="text-right px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]" />
                    </tr>
                  </thead>
                  <tbody>
                    {compliance.map((a) => {
                      const progressColor = a.score >= 80 ? 'chartreuse' : a.score >= 40 ? 'amber' : 'ruby'
                      const phaseLabel = PHASES[a.phase as PhaseKey]?.label ?? a.phase
                      return (
                        <tr key={a.id} className="border-b border-[var(--border)] hover:bg-[var(--bg-elevated)] transition-colors">
                          <td className="px-4 py-2.5 font-medium text-[var(--text-primary)]">{a.name}</td>
                          <td className="px-4 py-2.5 hidden sm:table-cell">
                            <NeuBadge color="gray" size="sm">{phaseLabel}</NeuBadge>
                          </td>
                          <td className="px-4 py-2.5 text-center hidden md:table-cell text-[var(--text-muted)]">
                            {a.completedSteps}/{a.totalSteps}
                          </td>
                          <td className="px-4 py-2.5 min-w-[160px]">
                            <div className="flex items-center gap-2">
                              <NeuProgress value={a.score} color={progressColor} size="sm" />
                              <span className="text-xs font-bold text-[var(--text-primary)] w-10 text-right tabular-nums">
                                {a.score}%
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-2.5 text-right">
                            <Link href={`/crm/assets/${a.id}?tab=governance`}>
                              <NeuBadge color="teal" size="sm">View</NeuBadge>
                            </Link>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </NeuCard>

          {/* Expiring Credentials */}
          <NeuCard variant="raised" padding="none" className="overflow-hidden">
            <div className="px-4 py-3 border-b border-[var(--border)]">
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                Expiring Credentials
              </h3>
            </div>
            {expiring.length === 0 ? (
              <div className="text-center py-10">
                <Shield className="h-10 w-10 text-[var(--chartreuse)] mx-auto mb-2" />
                <p className="text-sm text-[var(--text-muted)]">No credentials expiring soon</p>
              </div>
            ) : (
              <div className="divide-y divide-[var(--border)]">
                {expiring.map((cred) => {
                  const days = daysUntil(cred.expires_at!)
                  const urgencyColor: 'ruby' | 'amber' | 'gray' = days < 7 ? 'ruby' : days < 30 ? 'amber' : 'gray'
                  const partner = cred.partners as { id: string; name: string } | null
                  return (
                    <div key={cred.id} className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--bg-elevated)] transition-colors">
                      <AlertTriangle className={`h-4 w-4 shrink-0 ${days < 7 ? 'text-[var(--ruby)]' : 'text-[var(--amber)]'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                          {partner?.name ?? 'Unknown Partner'}
                        </p>
                        <p className="text-xs text-[var(--text-muted)]">
                          {cred.credential_name} &middot; Expires {new Date(cred.expires_at!).toLocaleDateString()}
                        </p>
                      </div>
                      <NeuBadge color={urgencyColor} size="sm">
                        {days}d left
                      </NeuBadge>
                    </div>
                  )
                })}
              </div>
            )}
          </NeuCard>

          {/* Incomplete KYC */}
          <NeuCard variant="raised" padding="none" className="overflow-hidden">
            <div className="px-4 py-3 border-b border-[var(--border)]">
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                Incomplete KYC
              </h3>
            </div>
            {incompleteKyc.length === 0 ? (
              <div className="text-center py-10">
                <Shield className="h-10 w-10 text-[var(--chartreuse)] mx-auto mb-2" />
                <p className="text-sm text-[var(--text-muted)]">All contacts have completed KYC</p>
              </div>
            ) : (
              <div className="divide-y divide-[var(--border)]">
                {incompleteKyc.map((contact) => (
                  <div key={contact.id} className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--bg-elevated)] transition-colors">
                    <UserX className="h-4 w-4 text-[var(--ruby)] shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                        {contact.full_name}
                      </p>
                      <p className="text-xs text-[var(--text-muted)] capitalize">
                        {(contact.contact_type ?? '').replace(/_/g, ' ')}
                      </p>
                    </div>
                    <NeuBadge
                      color={contact.kyc_status === 'pending' ? 'amber' : 'ruby'}
                      size="sm"
                    >
                      {contact.kyc_status}
                    </NeuBadge>
                  </div>
                ))}
              </div>
            )}
          </NeuCard>
        </>
      )}
    </div>
  )
}
