'use client'

import { Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { trpc } from '@/lib/trpc'
import { NeuButton } from '@/components/ui/NeuButton'
import { useToast } from '@/components/ui/NeuToast'

interface BulkActionBarProps {
  selectedIds: Set<string>
  assetId: string
  onClear: () => void
  onDone: () => void
}

export function BulkActionBar({ selectedIds, assetId, onClear, onDone }: BulkActionBarProps) {
  const { toast } = useToast()
  const utils = trpc.useUtils()
  const count = selectedIds.size

  const batchStatus = trpc.tasks.batchUpdateStatus.useMutation({
    onSuccess: () => { utils.assets.getById.invalidate({ assetId }); toast(`${count} tasks updated`, 'success'); onDone() },
    onError: (err) => toast(err.message, 'error'),
  })

  const batchAssign = trpc.tasks.batchAssign.useMutation({
    onSuccess: () => { utils.assets.getById.invalidate({ assetId }); toast(`${count} tasks assigned`, 'success'); onDone() },
    onError: (err) => toast(err.message, 'error'),
  })

  const { data: team = [] } = trpc.team.listActive.useQuery()
  const ids = Array.from(selectedIds)

  if (count === 0) return null

  return (
    <div className={cn(
      'fixed bottom-20 left-1/2 -translate-x-1/2 z-40',
      'flex items-center gap-3 px-4 py-3 rounded-[var(--radius-lg)]',
      'bg-[var(--bg-surface)] shadow-[var(--shadow-raised)] border border-[var(--border)]'
    )}>
      <span className="text-sm font-semibold text-[var(--text-primary)]">{count} selected</span>

      <NeuButton size="sm" icon={<Check className="h-3.5 w-3.5" />}
        loading={batchStatus.isPending}
        onClick={() => batchStatus.mutate({ taskIds: ids, status: 'done' })}>
        Complete
      </NeuButton>

      <select
        onChange={(e) => { if (e.target.value) batchAssign.mutate({ taskIds: ids, assignedTo: e.target.value }) }}
        className={cn('h-8 text-xs rounded-[var(--radius-sm)] px-2',
          'bg-[var(--bg-input)] text-[var(--text-secondary)]',
          'shadow-[var(--shadow-pressed)] border border-[var(--border)]')}>
        <option value="">Assign to...</option>
        {(team as Array<{ id: string; full_name: string }>).map((m) => (
          <option key={m.id} value={m.id}>{m.full_name}</option>
        ))}
      </select>

      <NeuButton size="sm" variant="ghost" icon={<X className="h-3.5 w-3.5" />} onClick={onClear}>
        Cancel
      </NeuButton>
    </div>
  )
}
