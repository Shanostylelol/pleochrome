'use client'

import { Shield } from 'lucide-react'
import { NeuCard } from '@/components/ui'

export default function CompliancePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-semibold text-[var(--text-primary)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Compliance Dashboard
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Monitor regulatory compliance status across all assets and operations
          </p>
        </div>
      </div>

      <NeuCard className="flex flex-col items-center justify-center py-16 text-center">
        <Shield className="h-12 w-12 text-[var(--text-muted)] mb-4 opacity-40" />
        <p
          className="text-lg font-medium text-[var(--text-primary)] mb-1"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Compliance Dashboard — Phase 7
        </p>
        <p className="text-sm text-[var(--text-muted)] max-w-md">
          Real-time compliance monitoring, regulatory requirement tracking, audit trail management,
          and automated compliance reporting will be available in Phase 7.
        </p>
      </NeuCard>
    </div>
  )
}
