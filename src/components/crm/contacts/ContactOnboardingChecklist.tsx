'use client'

import { CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NeuCard } from '@/components/ui/NeuCard'
import { NeuProgress } from '@/components/ui/NeuProgress'

interface ContactOnboardingChecklistProps {
  contact: Record<string, unknown>
  kycRecords: Array<Record<string, unknown>>
}

interface CheckItem {
  label: string
  status: 'done' | 'pending' | 'not_started'
  detail?: string
}

function getChecks(contact: Record<string, unknown>, kycRecords: Array<Record<string, unknown>>): CheckItem[] {
  const kyc = (contact.kyc_status as string) ?? 'not_started'
  const ofac = (contact.ofac_status as string) ?? 'not_screened'
  const pep = (contact.pep_status as string) ?? 'not_screened'
  const accreditation = (contact.accreditation_status as string) ?? 'not_verified'
  const hasIdentityCheck = kycRecords.some(r => ((r.check_type as string) ?? '').toLowerCase().includes('identity') && r.status === 'passed')

  return [
    {
      label: 'Identity Verified',
      status: hasIdentityCheck ? 'done' : kycRecords.some(r => ((r.check_type as string) ?? '').toLowerCase().includes('identity')) ? 'pending' : 'not_started',
      detail: hasIdentityCheck ? 'Government ID verified' : undefined,
    },
    {
      label: 'KYC/KYB Screening',
      status: kyc === 'verified' ? 'done' : kyc === 'pending' ? 'pending' : 'not_started',
      detail: kyc === 'verified' ? `Verified ${contact.kyc_verified_at ? new Date(contact.kyc_verified_at as string).toLocaleDateString() : ''}` : undefined,
    },
    {
      label: 'OFAC/SDN Clear',
      status: ofac === 'clear' ? 'done' : ofac === 'flagged' || ofac === 'match' ? 'pending' : 'not_started',
      detail: ofac === 'clear' ? `Screened ${contact.ofac_screened_at ? new Date(contact.ofac_screened_at as string).toLocaleDateString() : ''}` : undefined,
    },
    {
      label: 'PEP Screen Clear',
      status: pep === 'clear' ? 'done' : pep === 'is_pep' ? 'pending' : 'not_started',
      detail: pep === 'clear' ? 'No PEP match' : pep === 'is_pep' ? 'PEP flagged — review required' : undefined,
    },
    {
      label: 'Accreditation Verified',
      status: accreditation === 'verified' ? 'done' : accreditation === 'pending' ? 'pending' : 'not_started',
      detail: contact.accreditation_type ? `Type: ${contact.accreditation_type}` : undefined,
    },
  ]
}

export function ContactOnboardingChecklist({ contact, kycRecords }: ContactOnboardingChecklistProps) {
  const checks = getChecks(contact, kycRecords)
  const done = checks.filter(c => c.status === 'done').length
  const total = checks.length
  const pct = Math.round((done / total) * 100)

  const statusIcons = {
    done: <CheckCircle className="h-4 w-4 text-[var(--chartreuse)]" />,
    pending: <AlertCircle className="h-4 w-4 text-[var(--amber)]" />,
    not_started: <XCircle className="h-4 w-4 text-[var(--ruby)]" />,
  }

  return (
    <NeuCard variant="pressed" padding="md">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
          Compliance Checklist
        </span>
        <span className="text-xs text-[var(--text-muted)]">{done}/{total} complete</span>
      </div>
      <NeuProgress value={pct} color={pct === 100 ? 'emerald' : 'teal'} />
      <div className="mt-3 space-y-2">
        {checks.map((check) => (
          <div key={check.label} className="flex items-center gap-2">
            {statusIcons[check.status]}
            <span className={cn('text-sm flex-1',
              check.status === 'done' ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'
            )}>
              {check.label}
            </span>
            {check.detail && (
              <span className="text-[10px] text-[var(--text-muted)]">{check.detail}</span>
            )}
          </div>
        ))}
      </div>
    </NeuCard>
  )
}
