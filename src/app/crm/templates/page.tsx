'use client'

import { BookOpen } from 'lucide-react'
import { NeuCard } from '@/components/ui'

export default function TemplatesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-semibold text-[var(--text-primary)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Governance Templates
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Standardized templates for governance, compliance, and legal documentation
          </p>
        </div>
      </div>

      <NeuCard className="flex flex-col items-center justify-center py-16 text-center">
        <BookOpen className="h-12 w-12 text-[var(--text-muted)] mb-4 opacity-40" />
        <p
          className="text-lg font-medium text-[var(--text-primary)] mb-1"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Governance Templates — Phase 7
        </p>
        <p className="text-sm text-[var(--text-muted)] max-w-md">
          Pre-built governance templates for SPV formation, operating agreements, compliance
          checklists, and regulatory filings will be available in Phase 7.
        </p>
      </NeuCard>
    </div>
  )
}
