'use client'

import { trpc } from '@/lib/trpc'
import { useToast } from '@/components/ui/NeuToast'
import { CommentThread, type Comment } from './CommentThread'

interface TaskCommentThreadProps {
  taskId: string
  assetId?: string
  currentUserId: string
}

export function TaskCommentThread({ taskId, assetId, currentUserId }: TaskCommentThreadProps) {
  const utils = trpc.useUtils()
  const { toast } = useToast()
  const { data: rawComments = [] } = trpc.comments.listByEntity.useQuery({ taskId })

  const postComment = trpc.comments.create.useMutation({
    onSuccess: () => { utils.comments.listByEntity.invalidate({ taskId }); toast('Comment posted', 'success') },
    onError: (err) => toast(err.message, 'error'),
  })
  const deleteComment = trpc.comments.delete.useMutation({
    onSuccess: () => { utils.comments.listByEntity.invalidate({ taskId }); toast('Comment deleted', 'success') },
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

  return (
    <CommentThread
      comments={comments}
      currentUserId={currentUserId}
      onPost={(body) => postComment.mutate({ taskId, assetId, body })}
      onReply={(parentId, body) => postComment.mutate({ taskId, assetId, body, parentCommentId: parentId })}
      onDelete={(commentId) => deleteComment.mutate({ commentId })}
    />
  )
}
