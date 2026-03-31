'use client'

import { MessageSquare } from 'lucide-react'
import { trpc } from '@/lib/trpc'
import { NeuCard } from '@/components/ui/NeuCard'
import { NeuBadge } from '@/components/ui/NeuBadge'
import { CommentThread, type Comment } from '@/components/crm/CommentThread'

interface CommentsTabProps {
  assetId: string
  currentUserId: string
  tasks?: Array<{ id: string; title: string; stage_id?: string }>
  stages?: Array<{ id: string; name: string }>
}

export function CommentsTab({ assetId, currentUserId, tasks = [], stages = [] }: CommentsTabProps) {
  const utils = trpc.useUtils()
  const { data: allComments = [] } = trpc.comments.listAllForAsset.useQuery({ assetId })

  const createComment = trpc.comments.create.useMutation({
    onSuccess: () => { utils.comments.listAllForAsset.invalidate({ assetId }); utils.assets.getById.invalidate({ assetId }) },
  })
  const deleteComment = trpc.comments.delete.useMutation({
    onSuccess: () => { utils.comments.listAllForAsset.invalidate({ assetId }) },
  })

  // Build lookup maps for context
  const taskMap = new Map(tasks.map(t => [t.id, t]))
  const stageMap = new Map(stages.map(s => [s.id, s]))

  function getContext(c: Record<string, unknown>): string | null {
    const taskId = c.task_id as string | null
    const stageId = c.stage_id as string | null
    const subtaskId = c.subtask_id as string | null
    if (subtaskId && taskId) {
      const task = taskMap.get(taskId)
      const stage = task?.stage_id ? stageMap.get(task.stage_id) : null
      return `${stage?.name ?? ''} › ${task?.title ?? 'Task'} › Subtask`
    }
    if (taskId) {
      const task = taskMap.get(taskId)
      const stage = task?.stage_id ? stageMap.get(task.stage_id) : null
      return `${stage?.name ?? ''} › ${task?.title ?? 'Task'}`
    }
    if (stageId) {
      const stage = stageMap.get(stageId)
      return stage?.name ?? 'Stage'
    }
    return null
  }

  const threadComments: (Comment & { context?: string | null })[] = (allComments as Array<Record<string, unknown>>).map((c) => {
    const author = c.team_members as Record<string, unknown> | null
    return {
      id: c.id as string,
      author: { id: (author?.id as string) ?? '', name: (author?.full_name as string) ?? 'Unknown' },
      body: c.body as string,
      created_at: c.created_at as string,
      is_edited: c.is_edited as boolean | undefined,
      parent_id: (c.parent_comment_id as string | null) ?? undefined,
      context: getContext(c),
    }
  })

  return (
    <NeuCard variant="raised" padding="md">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
          {threadComments.length} {threadComments.length === 1 ? 'comment' : 'comments'} across asset
        </span>
      </div>

      {threadComments.length === 0 ? (
        <div className="text-center py-4">
          <MessageSquare className="h-10 w-10 text-[var(--text-placeholder)] mx-auto mb-3" />
          <p className="text-sm text-[var(--text-muted)] mb-4">No comments yet.</p>
        </div>
      ) : (
        <div className="space-y-3 mb-4">
          {threadComments.filter(c => !c.parent_id).map((c) => (
            <div key={c.id}>
              {c.context && (
                <NeuBadge color="gray" size="sm" className="mb-1">{c.context}</NeuBadge>
              )}
            </div>
          ))}
        </div>
      )}

      <CommentThread
        comments={threadComments}
        onPost={(body) => createComment.mutate({ body, assetId })}
        onReply={(commentId, body) => createComment.mutate({ body, assetId, parentCommentId: commentId })}
        onDelete={(commentId) => deleteComment.mutate({ commentId })}
        currentUserId={currentUserId}
      />
    </NeuCard>
  )
}
