'use client'

import { CheckCircle, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { trpc } from '@/lib/trpc'
import { NeuCard } from '@/components/ui/NeuCard'
import { NeuProgress } from '@/components/ui/NeuProgress'

interface RequiredDocsChecklistProps {
  assetId: string
}

export function RequiredDocsChecklist({ assetId }: RequiredDocsChecklistProps) {
  const { data: checklist = [] } = trpc.documents.getRequiredChecklist.useQuery({ assetId })

  if (checklist.length === 0) return null

  const totalRequired = checklist.reduce((sum, s) => sum + s.requirements.length, 0)
  const totalUploaded = checklist.reduce((sum, s) => sum + s.requirements.filter((r: { uploaded: boolean }) => r.uploaded).length, 0)
  const pct = totalRequired > 0 ? Math.round((totalUploaded / totalRequired) * 100) : 0

  return (
    <NeuCard variant="pressed" padding="md">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
          Required Documents
        </span>
        <span className="text-xs text-[var(--text-muted)]">{totalUploaded}/{totalRequired} uploaded</span>
      </div>
      <div className="w-full mb-3">
        <NeuProgress value={pct} color={pct === 100 ? 'emerald' : 'teal'} />
      </div>

      <div className="space-y-3">
        {checklist.map((stage) => {
          const uploaded = stage.requirements.filter((r: { uploaded: boolean }) => r.uploaded).length
          const total = stage.requirements.length
          return (
            <div key={stage.stageId}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-[var(--text-primary)]">{stage.stageName}</span>
                <span className="text-[10px] text-[var(--text-muted)]">{uploaded}/{total}</span>
              </div>
              <div className="space-y-0.5 ml-2">
                {stage.requirements.map((req: { documentType: string; uploaded: boolean }) => (
                  <div key={req.documentType} className="flex items-center gap-2">
                    {req.uploaded ? (
                      <CheckCircle className="h-3.5 w-3.5 text-[var(--emerald)] shrink-0" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5 text-[var(--ruby)] shrink-0" />
                    )}
                    <span className={cn('text-xs capitalize',
                      req.uploaded ? 'text-[var(--text-muted)]' : 'text-[var(--text-primary)]'
                    )}>
                      {req.documentType.replace(/_/g, ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </NeuCard>
  )
}
