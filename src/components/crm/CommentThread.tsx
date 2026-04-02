'use client'

import { useState, Fragment } from 'react'
import { Reply, Pencil, Trash2, Send } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NeuAvatar } from '@/components/ui/NeuAvatar'
import { NeuButton } from '@/components/ui/NeuButton'

// ── Types ─────────────────────────────────────────────────
export interface Comment {
  id: string
  author: { id: string; name: string; avatar_url?: string }
  body: string
  created_at: string
  is_edited?: boolean
  parent_id?: string | null
}

export interface CommentThreadProps {
  comments: Comment[]
  onPost: (body: string, parentId?: string) => void
  onReply: (commentId: string, body: string) => void
  onDelete: (commentId: string) => void
  onEdit?: (commentId: string, body: string) => void
  currentUserId: string
}

// ── Helpers ───────────────────────────────────────────────

/** Render @mentions as teal-colored spans */
function renderBody(body: string) {
  const parts = body.split(/(@\w+)/g)
  return parts.map((part, i) =>
    part.startsWith('@') ? (
      <span key={i} className="font-semibold text-[var(--teal)]">{part}</span>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    )
  )
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

// ── Single comment ────────────────────────────────────────
function CommentBubble({
  comment,
  isOwn,
  onReplyClick,
  onDelete,
  onEdit,
  depth,
}: {
  comment: Comment
  isOwn: boolean
  onReplyClick: () => void
  onDelete: (id: string) => void
  onEdit?: (id: string, body: string) => void
  depth: number
}) {
  const [editing, setEditing] = useState(false)
  const [editVal, setEditVal] = useState(comment.body)

  function submitEdit() {
    const trimmed = editVal.trim()
    if (trimmed && trimmed !== comment.body) onEdit?.(comment.id, trimmed)
    setEditing(false)
  }

  return (
    <div
      className="flex gap-2.5"
      style={{ paddingLeft: depth > 0 ? `${depth * 24}px` : undefined }}
    >
      <NeuAvatar name={comment.author.name} src={comment.author.avatar_url} size="sm" />
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-semibold text-[var(--text-primary)]">
            {comment.author.name}
          </span>
          <span className="text-[11px] text-[var(--text-muted)]">
            {timeAgo(comment.created_at)}
          </span>
          {comment.is_edited && (
            <span className="text-[10px] italic text-[var(--text-placeholder)]">(edited)</span>
          )}
        </div>
        {editing ? (
          <div className="mt-1 space-y-1.5">
            <textarea value={editVal} onChange={(e) => setEditVal(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitEdit() } if (e.key === 'Escape') setEditing(false) }}
              rows={2} autoFocus
              className="w-full text-sm rounded-[var(--radius-sm)] px-2 py-1.5 resize-none bg-[var(--bg-input)] text-[var(--text-primary)] shadow-[var(--shadow-pressed)] border border-[var(--teal)] focus:outline-none" />
            <div className="flex gap-2">
              <button onClick={submitEdit} className="text-[11px] font-semibold text-[var(--teal)] hover:underline">Save</button>
              <button onClick={() => { setEditing(false); setEditVal(comment.body) }} className="text-[11px] text-[var(--text-muted)] hover:underline">Cancel</button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-[var(--text-secondary)] mt-0.5 whitespace-pre-wrap break-words">
            {renderBody(comment.body)}
          </p>
        )}
        <div className="flex items-center gap-3 mt-1">
          {!editing && <button
            onClick={onReplyClick}
            className="flex items-center gap-1 text-[11px] text-[var(--text-muted)] hover:text-[var(--teal)] transition-colors"
          >
            <Reply className="h-3 w-3" /> Reply
          </button>}
          {isOwn && !editing && onEdit && (
            <>
              <button onClick={() => { setEditVal(comment.body); setEditing(true) }}
                className="flex items-center gap-1 text-[11px] text-[var(--text-muted)] hover:text-[var(--amber)] transition-colors">
                <Pencil className="h-3 w-3" /> Edit
              </button>
              <button
                onClick={() => onDelete(comment.id)}
                className="flex items-center gap-1 text-[11px] text-[var(--text-muted)] hover:text-[var(--ruby)] transition-colors"
              >
                <Trash2 className="h-3 w-3" /> Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Input box ─────────────────────────────────────────────
function CommentInput({
  onSubmit,
  placeholder,
  autoFocus,
}: {
  onSubmit: (body: string) => void
  placeholder?: string
  autoFocus?: boolean
}) {
  const [value, setValue] = useState('')

  function handleSubmit() {
    const trimmed = value.trim()
    if (!trimmed) return
    onSubmit(trimmed)
    setValue('')
  }

  return (
    <div className="flex items-end gap-2">
      <textarea
        autoFocus={autoFocus}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSubmit()
          }
        }}
        placeholder={placeholder ?? 'Write a comment...'}
        rows={1}
        className={cn(
          'flex-1 min-h-[36px] max-h-[120px] resize-none text-sm rounded-[var(--radius-md)] px-3 py-2',
          'bg-[var(--bg-input)] text-[var(--text-primary)] placeholder:text-[var(--text-placeholder)]',
          'shadow-[var(--shadow-pressed)] border border-[var(--border)]',
          'focus:outline-none focus:border-[var(--teal)]'
        )}
      />
      <NeuButton size="sm" onClick={handleSubmit} icon={<Send className="h-3.5 w-3.5" />}>
        Post
      </NeuButton>
    </div>
  )
}

// ── Main thread ───────────────────────────────────────────
export function CommentThread({ comments, onPost, onReply, onDelete, onEdit, currentUserId }: CommentThreadProps) {
  const [replyingTo, setReplyingTo] = useState<string | null>(null)

  // Build parent -> replies map
  const roots = comments.filter((c) => !c.parent_id)
  const repliesMap = new Map<string, Comment[]>()
  for (const c of comments) {
    if (c.parent_id) {
      const arr = repliesMap.get(c.parent_id) || []
      arr.push(c)
      repliesMap.set(c.parent_id, arr)
    }
  }

  function renderComment(comment: Comment, depth: number) {
    const replies = repliesMap.get(comment.id) || []
    return (
      <div key={comment.id} className="space-y-3">
        <CommentBubble
          comment={comment}
          isOwn={comment.author.id === currentUserId}
          onReplyClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
          onDelete={onDelete}
          onEdit={onEdit}
          depth={depth}
        />
        {replyingTo === comment.id && (
          <div style={{ paddingLeft: `${(depth + 1) * 24}px` }}>
            <CommentInput
              autoFocus
              placeholder="Write a reply..."
              onSubmit={(body) => {
                onReply(comment.id, body)
                setReplyingTo(null)
              }}
            />
          </div>
        )}
        {replies.map((r) => renderComment(r, depth + 1))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {roots.length === 0 && (
        <p className="text-sm text-[var(--text-muted)] text-center py-4">No comments yet.</p>
      )}
      {roots.map((c) => renderComment(c, 0))}

      {/* New top-level comment */}
      <div className="pt-2 border-t border-[var(--border)]">
        <CommentInput onSubmit={(body) => onPost(body)} />
      </div>
    </div>
  )
}
