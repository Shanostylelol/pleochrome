'use client'

import { trpc } from '@/lib/trpc'
import { useToast } from '@/components/ui/NeuToast'
import { CommentThread, type Comment } from './CommentThread'

interface EntityCommentThreadProps {
  entityType: 'task' | 'subtask' | 'stage'
  entityId: string
  assetId?: string
  currentUserId: string
}

export function EntityCommentThread({ entityType, entityId, assetId, currentUserId }: EntityCommentThreadProps) {
  const utils = trpc.useUtils()
  const { toast } = useToast()

  const queryInput = entityType === 'task'
    ? { taskId: entityId }
    : entityType === 'subtask'
      ? { subtaskId: entityId }
      : { stageId: entityId }

  const { data: rawComments = [] } = trpc.comments.listByEntity.useQuery(queryInput)

  const postComment = trpc.comments.create.useMutation({
    onSuccess: () => { utils.comments.listByEntity.invalidate(queryInput); toast('Comment posted', 'success') },
    onError: (err) => toast(err.message, 'error'),
  })
  const deleteComment = trpc.comments.delete.useMutation({
    onSuccess: () => { utils.comments.listByEntity.invalidate(queryInput); toast('Comment deleted', 'success') },
    onError: (err) => toast(err.message, 'error'),
  })

  const comments: Comment[] = (rawComments as Array<{
    id: string; body: string; created_at: string; is_edited: boolean;
    parent_comment_id: string | null;
    team_members: { id: string; full_name: string } | null
  }>).map((c) => ({
    id: c.id,
    author: { id: c.team_members?.id ?? '', name: c.team_members?.full_name ?? 'Unknown' },
    body: c.body, created_at: c.created_at, is_edited: c.is_edited, parent_id: c.parent_comment_id,
  }))

  const createInput = { ...queryInput, assetId }

  return (
    <CommentThread
      comments={comments}
      currentUserId={currentUserId}
      onPost={(body) => postComment.mutate({ ...createInput, body })}
      onReply={(parentId, body) => postComment.mutate({ ...createInput, body, parentCommentId: parentId })}
      onDelete={(commentId) => deleteComment.mutate({ commentId })}
    />
  )
}
