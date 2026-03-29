'use client'

import { useState } from 'react'
import { BookOpen, Shield, ChevronDown, ChevronRight } from 'lucide-react'
import { NeuCard, NeuBadge, NeuTabs } from '@/components/ui'
import { trpc } from '@/lib/trpc'

const TABS = [
  { id: 'requirements', label: 'Requirements' },
  { id: 'modules', label: 'Partner Modules' },
]

export default function TemplatesPage() {
  const [activeTab, setActiveTab] = useState('requirements')
  const { data: requirements = [], isLoading } = trpc.governance.listRequirements.useQuery()
  const { data: modules = [] } = trpc.governance.listModules.useQuery()

  const phaseLabels: Record<string, string> = {
    phase_0_foundation: 'Phase 0 — Foundation',
    phase_1_intake: 'Phase 1 — Intake & Acquisition',
    phase_2_certification: 'Phase 2 — Certification',
    phase_3_custody: 'Phase 3 — Custody',
    phase_4_legal: 'Phase 4 — Legal',
    phase_5_tokenization: 'Phase 5 — Execution',
    phase_6_regulatory: 'Phase 6 — Regulatory',
    phase_7_distribution: 'Phase 7 — Distribution',
    phase_8_ongoing: 'Phase 8 — Ongoing',
  }

  const grouped: Record<string, typeof requirements> = {}
  requirements.forEach((r) => {
    const label = phaseLabels[r.phase] ?? r.phase ?? 'Other'
    if (!grouped[label]) grouped[label] = []
    grouped[label].push(r)
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
          Governance Templates
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          {requirements.length} requirements across {Object.keys(grouped).length} phases
        </p>
      </div>

      <NeuTabs tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'requirements' && (
        isLoading ? (
          <p className="text-[var(--text-muted)] text-center py-10">Loading requirements...</p>
        ) : (
          <div className="space-y-3">
            {Object.entries(grouped).map(([phase, reqs]) => (
              <PhaseGroup key={phase} phase={phase} requirements={reqs} />
            ))}
          </div>
        )
      )}

      {activeTab === 'modules' && (
        modules.length === 0 ? (
          <NeuCard variant="pressed" padding="lg" className="text-center">
            <BookOpen className="h-12 w-12 text-[var(--text-placeholder)] mx-auto mb-3" />
            <p className="text-sm text-[var(--text-muted)]">No partner modules configured</p>
          </NeuCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {modules.map((m) => (
              <NeuCard key={m.id} variant="raised" padding="md">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-[var(--text-primary)]">{m.module_name}</h3>
                  <NeuBadge color="amethyst" size="sm">
                    {(m.partners as { name: string } | null)?.name ?? 'Unlinked'}
                  </NeuBadge>
                </div>
                {m.description && (
                  <p className="text-xs text-[var(--text-muted)]">{m.description}</p>
                )}
              </NeuCard>
            ))}
          </div>
        )
      )}
    </div>
  )
}

function PhaseGroup({ phase, requirements }: { phase: string; requirements: Array<Record<string, unknown>> }) {
  const [expanded, setExpanded] = useState(true)
  const gateCount = requirements.filter((r) => r.is_gate).length

  return (
    <NeuCard variant="raised" padding="none">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-[var(--bg-elevated)] transition-colors rounded-t-[var(--radius-md)]"
      >
        {expanded ? <ChevronDown className="h-4 w-4 text-[var(--text-muted)]" /> : <ChevronRight className="h-4 w-4 text-[var(--text-muted)]" />}
        <span className="text-sm font-semibold text-[var(--text-primary)] flex-1">{phase}</span>
        <span className="text-xs text-[var(--text-muted)]">{requirements.length} steps</span>
        {gateCount > 0 && <NeuBadge color="amber" size="sm">{gateCount} gates</NeuBadge>}
      </button>
      {expanded && (
        <div className="px-4 pb-3 space-y-1.5">
          {requirements.map((r) => (
            <div key={r.id as string} className="flex items-center gap-3 px-3 py-2 rounded-[var(--radius-md)] bg-[var(--bg-body)] shadow-[var(--shadow-pressed)]">
              {r.is_gate ? (
                <Shield className="h-4 w-4 text-[var(--amber)] shrink-0" />
              ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--text-muted)] shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[var(--text-primary)] truncate">
                  <span className="text-[var(--text-muted)]" style={{ fontFamily: 'var(--font-mono)' }}>{r.step_number as string}</span>{' '}
                  {r.title as string}
                </p>
                {(r.regulatory_citation as string) && (
                  <p className="text-[10px] text-[var(--text-muted)]" style={{ fontFamily: 'var(--font-mono)' }}>
                    {r.regulatory_citation as string}
                  </p>
                )}
              </div>
              {(r.value_path as string | null) && (
                <NeuBadge
                  color={(r.value_path as string) === 'tokenization' ? 'teal' : (r.value_path as string) === 'fractional_securities' ? 'emerald' : 'sapphire'}
                  size="sm"
                >
                  {String((r.value_path as string) === 'fractional_securities' ? 'Frac' : (r.value_path as string) === 'tokenization' ? 'Token' : 'Debt')}
                </NeuBadge>
              )}
            </div>
          ))}
        </div>
      )}
    </NeuCard>
  )
}
