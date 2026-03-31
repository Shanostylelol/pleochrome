'use client'

import { useState } from 'react'
import { Upload, CheckCircle, XCircle, Shield, Search, Plus, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NeuButton } from '@/components/ui/NeuButton'
import { NeuBadge } from '@/components/ui/NeuBadge'
import { useToast } from '@/components/ui/NeuToast'
import { parseSubtaskNotes, serializeSubtaskNotes } from '@/lib/subtask-notes'
import type { SubtaskTypeKey } from '@/lib/constants'
import type { Subtask } from '../SubtaskChecklist'

interface FileTypeRendererProps {
  subtask: Subtask
  typeKey: SubtaskTypeKey
  taskId: string
  assetId?: string
  onUpdate: (subtaskId: string, fields: { notes?: string }) => void
}

export function FileTypeRenderer({ subtask, typeKey, onUpdate }: FileTypeRendererProps) {
  const { toast } = useToast()
  const parsed = parseSubtaskNotes(subtask.notes)
  const [text, setText] = useState(parsed.text ?? '')

  function saveNotes(extra: Record<string, unknown> = {}) {
    const data = { ...parsed, _type: typeKey, text, ...extra }
    onUpdate(subtask.id, { notes: serializeSubtaskNotes(data) })
    toast('Saved', 'success')
  }

  if (typeKey === 'document_upload') {
    return (
      <div className="space-y-2">
        <p className="text-xs text-[var(--text-muted)]">
          Upload documents for this task. Files are attached below.
        </p>
        <div className="flex items-start gap-2">
          <Upload className="h-4 w-4 text-[var(--teal)] mt-0.5 shrink-0" />
          <textarea value={text} onChange={(e) => setText(e.target.value)}
            placeholder="Notes about this document..."
            rows={2}
            className={cn('flex-1 text-xs rounded-[var(--radius-sm)] px-2 py-1.5 resize-none',
              'bg-[var(--bg-input)] text-[var(--text-primary)] placeholder:text-[var(--text-placeholder)]',
              'shadow-[var(--shadow-pressed)] border border-[var(--border)]',
              'focus:outline-none focus:border-[var(--teal)]')} />
        </div>
        <NeuButton size="sm" onClick={() => saveNotes()} className="!h-7">Save Notes</NeuButton>
      </div>
    )
  }

  if (typeKey === 'verification') {
    const result = (parsed.result as string | null) ?? null
    const checklist = (parsed.checklist as Array<{ item: string; checked: boolean }>) ?? []
    const [items, setItems] = useState(checklist)
    const [newItem, setNewItem] = useState('')

    function addItem() {
      if (!newItem.trim()) return
      const updated = [...items, { item: newItem.trim(), checked: false }]
      setItems(updated)
      setNewItem('')
    }

    function toggleItem(idx: number) {
      const updated = items.map((it, i) => i === idx ? { ...it, checked: !it.checked } : it)
      setItems(updated)
    }

    function removeItem(idx: number) {
      setItems(items.filter((_, i) => i !== idx))
    }

    return (
      <div className="space-y-3">
        {/* Pass/Fail */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-[var(--text-muted)]">Result:</span>
          <NeuButton size="sm" variant={result === 'pass' ? 'primary' : 'ghost'}
            icon={<CheckCircle className="h-3.5 w-3.5" />}
            onClick={() => saveNotes({ result: 'pass', checklist: items })}
            className={cn('!h-7', result === 'pass' && '!bg-[var(--emerald)] !text-white')}>
            Pass
          </NeuButton>
          <NeuButton size="sm" variant={result === 'fail' ? 'primary' : 'ghost'}
            icon={<XCircle className="h-3.5 w-3.5" />}
            onClick={() => saveNotes({ result: 'fail', checklist: items })}
            className={cn('!h-7', result === 'fail' && '!bg-[var(--ruby)] !text-white')}>
            Fail
          </NeuButton>
        </div>

        {/* Checklist */}
        <div className="space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Checklist</span>
          {items.map((it, i) => (
            <label key={i} className="flex items-center gap-2 text-xs text-[var(--text-primary)] cursor-pointer">
              <input type="checkbox" checked={it.checked} onChange={() => toggleItem(i)} className="accent-[var(--teal)]" />
              <span className={it.checked ? 'line-through text-[var(--text-muted)]' : ''}>{it.item}</span>
              <button onClick={() => removeItem(i)} className="ml-auto text-[var(--text-muted)] hover:text-[var(--ruby)]">
                <Trash2 className="h-3 w-3" />
              </button>
            </label>
          ))}
          <div className="flex gap-1">
            <input value={newItem} onChange={(e) => setNewItem(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') addItem() }}
              placeholder="Add check item..."
              className={cn('flex-1 h-6 text-xs rounded-[var(--radius-sm)] px-2',
                'bg-[var(--bg-input)] text-[var(--text-primary)] placeholder:text-[var(--text-placeholder)]',
                'shadow-[var(--shadow-pressed)] border border-[var(--border)]',
                'focus:outline-none focus:border-[var(--teal)]')} />
            <button onClick={addItem} className="text-[var(--teal)] hover:text-[var(--text-primary)]">
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Verification notes..." rows={2}
          className={cn('w-full text-xs rounded-[var(--radius-sm)] px-2 py-1.5 resize-none',
            'bg-[var(--bg-input)] text-[var(--text-primary)] placeholder:text-[var(--text-placeholder)]',
            'shadow-[var(--shadow-pressed)] border border-[var(--border)]',
            'focus:outline-none focus:border-[var(--teal)]')} />
        <NeuButton size="sm" onClick={() => saveNotes({ result, checklist: items })} className="!h-7">Save</NeuButton>
      </div>
    )
  }

  if (typeKey === 'signature') {
    const sigStatus = (parsed.status as string) ?? 'pending'
    const signerName = (parsed.signer_name as string) ?? ''
    const [signer, setSigner] = useState(signerName)
    const statuses = ['pending', 'sent', 'signed', 'declined'] as const
    const statusColors: Record<string, string> = {
      pending: 'gray', sent: 'amber', signed: 'chartreuse', declined: 'ruby',
    }

    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-[var(--sapphire)]" />
          <span className="text-xs font-medium text-[var(--text-muted)]">Status:</span>
          <div className="flex gap-1">
            {statuses.map((s) => (
              <button key={s} onClick={() => saveNotes({ status: s, signer_name: signer })}
                className={cn('px-2 py-0.5 text-[10px] rounded-[var(--radius-sm)] font-medium capitalize transition-colors',
                  sigStatus === s
                    ? 'bg-[var(--bg-surface)] shadow-[var(--shadow-raised)] text-[var(--text-primary)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]')}>
                {s}
              </button>
            ))}
          </div>
          <NeuBadge color={statusColors[sigStatus] as 'gray' | 'teal' | 'chartreuse' | 'amber' | 'ruby'} size="sm">
            {sigStatus}
          </NeuBadge>
        </div>
        <input value={signer} onChange={(e) => setSigner(e.target.value)}
          placeholder="Signer name..."
          className={cn('w-full h-7 text-xs rounded-[var(--radius-sm)] px-2',
            'bg-[var(--bg-input)] text-[var(--text-primary)] placeholder:text-[var(--text-placeholder)]',
            'shadow-[var(--shadow-pressed)] border border-[var(--border)]',
            'focus:outline-none focus:border-[var(--teal)]')} />
        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Signature notes..." rows={2}
          className={cn('w-full text-xs rounded-[var(--radius-sm)] px-2 py-1.5 resize-none',
            'bg-[var(--bg-input)] text-[var(--text-primary)] placeholder:text-[var(--text-placeholder)]',
            'shadow-[var(--shadow-pressed)] border border-[var(--border)]',
            'focus:outline-none focus:border-[var(--teal)]')} />
        <NeuButton size="sm" onClick={() => saveNotes({ status: sigStatus, signer_name: signer })} className="!h-7">Save</NeuButton>
      </div>
    )
  }

  // research (default for file types)
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-[var(--emerald)]" />
        <span className="text-xs font-medium text-[var(--text-muted)]">Research Findings</span>
      </div>
      <textarea value={text} onChange={(e) => setText(e.target.value)}
        placeholder="Document your research findings..."
        rows={4}
        className={cn('w-full text-xs rounded-[var(--radius-sm)] px-2 py-1.5 resize-none',
          'bg-[var(--bg-input)] text-[var(--text-primary)] placeholder:text-[var(--text-placeholder)]',
          'shadow-[var(--shadow-pressed)] border border-[var(--border)]',
          'focus:outline-none focus:border-[var(--teal)]')} />
      <NeuButton size="sm" onClick={() => saveNotes()} className="!h-7">Save Findings</NeuButton>
    </div>
  )
}
