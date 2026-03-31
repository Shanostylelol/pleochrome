'use client'

import { useState } from 'react'
import { ArrowRightCircle, ListChecks, Plus, X } from 'lucide-react'
import { NeuButton, NeuInput } from '@/components/ui'
import { trpc } from '@/lib/trpc'

// ── Types ────────────────────────────────────────────────
export interface ActionItem {
  title: string
  assignee?: string
  dueDate?: string
  converted?: boolean
}

interface ActionItemsSectionProps {
  meetingId: string
  assetId?: string | null
  actionItems: ActionItem[]
  onItemsChange: (items: ActionItem[]) => void
}

// ── Component ────────────────────────────────────────────
export function ActionItemsSection({ meetingId, assetId, actionItems, onItemsChange }: ActionItemsSectionProps) {
  const [showForm, setShowForm] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newAssignee, setNewAssignee] = useState('')
  const [newDueDate, setNewDueDate] = useState('')
  const [convertingIdx, setConvertingIdx] = useState<number | null>(null)
  const utils = trpc.useUtils()

  const updateMut = trpc.meetings.update.useMutation({
    onSuccess: () => utils.meetings.list.invalidate(),
  })

  const convertMut = trpc.meetings.convertActionItem.useMutation({
    onSuccess: (_data, variables) => {
      utils.tasks.list.invalidate()
      const updated = actionItems.map((item, i) =>
        i === variables.actionItemIndex ? { ...item, converted: true } : item
      )
      onItemsChange(updated)
      updateMut.mutate({ meetingId, actionItems: updated })
      setConvertingIdx(null)
    },
  })

  const { data: stages = [] } = trpc.stages.listByAsset.useQuery(
    { assetId: assetId ?? '' },
    { enabled: !!assetId },
  )

  const handleAdd = () => {
    if (!newTitle.trim()) return
    const newItem: ActionItem = {
      title: newTitle.trim(),
      assignee: newAssignee.trim() || undefined,
      dueDate: newDueDate || undefined,
    }
    const updated = [...actionItems, newItem]
    onItemsChange(updated)
    updateMut.mutate({ meetingId, actionItems: updated })
    setNewTitle('')
    setNewAssignee('')
    setNewDueDate('')
    setShowForm(false)
  }

  const handleDelete = (idx: number) => {
    const updated = actionItems.filter((_, i) => i !== idx)
    onItemsChange(updated)
    updateMut.mutate({ meetingId, actionItems: updated })
  }

  const handleConvert = (idx: number) => {
    if (!assetId || stages.length === 0) return
    const firstStage = stages[0]
    setConvertingIdx(idx)
    convertMut.mutate({
      meetingId,
      actionItemIndex: idx,
      assetId,
      stageId: firstStage.id,
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <ListChecks className="h-3.5 w-3.5 text-[var(--text-muted)]" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
            Action Items ({actionItems.length})
          </span>
        </div>
        <NeuButton
          variant="ghost"
          size="sm"
          icon={<Plus className="h-3.5 w-3.5" />}
          onClick={() => setShowForm(!showForm)}
          className="!h-7 !px-2"
        >
          Add
        </NeuButton>
      </div>

      {/* Inline add form */}
      {showForm && (
        <div className="mb-3 p-3 rounded-[var(--radius-sm)] bg-[var(--bg-body)] shadow-[var(--shadow-pressed)]">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <NeuInput
              placeholder="Action item title *"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <NeuInput
              placeholder="Assignee (optional)"
              value={newAssignee}
              onChange={(e) => setNewAssignee(e.target.value)}
            />
            <NeuInput
              type="date"
              placeholder="Due date"
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
            />
          </div>
          <div className="flex gap-2 mt-2 justify-end">
            <NeuButton variant="ghost" size="sm" onClick={() => setShowForm(false)}>
              Cancel
            </NeuButton>
            <NeuButton size="sm" onClick={handleAdd} disabled={!newTitle.trim()}>
              Add Item
            </NeuButton>
          </div>
        </div>
      )}

      {/* Items list */}
      {actionItems.length === 0 && !showForm ? (
        <p className="text-xs text-[var(--text-placeholder)]">No action items recorded</p>
      ) : (
        <div className="space-y-1.5">
          {actionItems.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 px-3 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-body)] shadow-[var(--shadow-pressed)]"
            >
              <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${item.converted ? 'bg-[var(--chartreuse)]' : 'bg-[var(--teal)]'}`} />
              <div className="flex-1 min-w-0">
                <p className={`text-sm truncate ${item.converted ? 'text-[var(--text-muted)] line-through' : 'text-[var(--text-primary)]'}`}>
                  {item.title}
                </p>
                <div className="flex gap-2 text-[10px] text-[var(--text-muted)]">
                  {item.assignee && <span>{item.assignee}</span>}
                  {item.dueDate && <span>Due {item.dueDate}</span>}
                  {item.converted && <span className="text-[var(--chartreuse)]">Converted</span>}
                </div>
              </div>
              {!item.converted && assetId && stages.length > 0 && (
                <NeuButton
                  size="sm"
                  variant="ghost"
                  icon={<ArrowRightCircle className="h-3.5 w-3.5" />}
                  onClick={() => handleConvert(idx)}
                  loading={convertingIdx === idx && convertMut.isPending}
                  className="!h-7 !px-2"
                  title="Convert to Task"
                />
              )}
              {!item.converted && (
                <button
                  onClick={() => handleDelete(idx)}
                  className="p-1 rounded-[var(--radius-sm)] text-[var(--text-muted)] hover:text-[var(--ruby)] transition-colors"
                  title="Remove action item"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      {(convertMut.error || updateMut.error) && (
        <p className="text-xs text-[var(--ruby)] mt-1">
          {convertMut.error?.message ?? updateMut.error?.message}
        </p>
      )}
    </div>
  )
}
