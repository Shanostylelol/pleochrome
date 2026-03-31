'use client'

import { useCallback, type Dispatch, type SetStateAction } from 'react'
import { trpc } from '@/lib/trpc'
import { useToast } from '@/components/ui/NeuToast'
import type { PhaseKey, StageStatusKey, TaskStatusKey, TaskTypeKey } from '@/lib/constants'

// ── Parameter types ─────────────────────────────────────────
interface UseWorkflowMutationsParams {
  assetId: string
  setLocalTaskOrder: Dispatch<SetStateAction<Map<string, string[]>>>
  setLocalStageOrder: Dispatch<SetStateAction<Map<string, string[]>>>
}

// ── Hook ────────────────────────────────────────────────────
export function useWorkflowMutations({
  assetId,
  setLocalTaskOrder,
  setLocalStageOrder,
}: UseWorkflowMutationsParams) {
  const utils = trpc.useUtils()
  const { toast } = useToast()
  const invalidate = useCallback(
    () => utils.assets.getById.invalidate({ assetId }),
    [utils, assetId],
  )
  const onErr = useCallback((msg: string) => (error: { message: string }) => {
    toast(error.message ?? msg, 'error')
  }, [toast])

  // ── Mutations ───────────────────────────────────────────
  const completeTask = trpc.tasks.complete.useMutation({ onSuccess: invalidate, onError: onErr('Failed to complete task') })
  const completeSubtask = trpc.subtasks.complete.useMutation({ onSuccess: invalidate, onError: onErr('Failed to complete subtask') })
  const updateStageStatus = trpc.stages.updateStatus.useMutation({ onSuccess: invalidate, onError: onErr('Failed to update stage') })
  const toggleStageHidden = trpc.stages.toggleHidden.useMutation({ onSuccess: invalidate, onError: onErr('Failed to toggle stage') })
  const toggleTaskHidden = trpc.tasks.toggleHidden.useMutation({ onSuccess: invalidate, onError: onErr('Failed to toggle task') })
  const createTask = trpc.tasks.create.useMutation({ onSuccess: invalidate, onError: onErr('Failed to create task') })
  const createSubtask = trpc.subtasks.create.useMutation({ onSuccess: invalidate, onError: onErr('Failed to create subtask') })
  const createStage = trpc.stages.create.useMutation({ onSuccess: invalidate, onError: onErr('Failed to create stage') })
  const updateTaskStatus = trpc.tasks.updateStatus.useMutation({ onSuccess: invalidate, onError: onErr('Failed to update status') })
  const deleteTask = trpc.tasks.softDelete.useMutation({ onSuccess: invalidate, onError: onErr('Failed to delete task') })
  const deleteSubtask = trpc.subtasks.softDelete.useMutation({ onSuccess: invalidate, onError: onErr('Failed to delete subtask') })
  const updateTask = trpc.tasks.update.useMutation({ onSuccess: invalidate, onError: onErr('Failed to update task') })
  const reorderTasks = trpc.tasks.reorder.useMutation({ onSuccess: invalidate, onError: onErr('Failed to reorder tasks') })
  const updateSubtask = trpc.subtasks.update.useMutation({ onSuccess: invalidate, onError: onErr('Failed to update subtask') })
  const reorderSubtasks = trpc.subtasks.reorder.useMutation({ onSuccess: invalidate, onError: onErr('Failed to reorder subtasks') })
  const reorderStages = trpc.stages.reorder.useMutation({ onSuccess: invalidate, onError: onErr('Failed to reorder stages') })

  // ── Handlers ────────────────────────────────────────────
  const handleCompleteTask = useCallback(
    (taskId: string) => completeTask.mutate({ taskId }),
    [completeTask],
  )

  const handleCompleteSubtask = useCallback(
    (subtaskId: string) => completeSubtask.mutate({ subtaskId }),
    [completeSubtask],
  )

  const handleUpdateStageStatus = useCallback(
    (stageId: string, status: StageStatusKey) => updateStageStatus.mutate({ stageId, status }),
    [updateStageStatus],
  )

  const handleUpdateTaskStatus = useCallback(
    (taskId: string, status: TaskStatusKey) => updateTaskStatus.mutate({ taskId, status }),
    [updateTaskStatus],
  )

  const handleDeleteTask = useCallback(
    (taskId: string) => deleteTask.mutate({ taskId }),
    [deleteTask],
  )

  const handleUpdateTask = useCallback(
    (taskId: string, fields: {
      title?: string; description?: string; notes?: string;
      taskType?: TaskTypeKey; dueDate?: string | null; assignedTo?: string | null
    }) => updateTask.mutate({ taskId, ...fields } as Parameters<typeof updateTask.mutate>[0]),
    [updateTask],
  )

  const handleReorderTasks = useCallback(
    (stageId: string, taskIds: string[]) => {
      setLocalTaskOrder((prev) => new Map(prev).set(stageId, taskIds))
      reorderTasks.mutate({ stageId, taskIds })
    },
    [reorderTasks, setLocalTaskOrder],
  )

  const handleDeleteSubtask = useCallback(
    (subtaskId: string) => deleteSubtask.mutate({ subtaskId }),
    [deleteSubtask],
  )

  const handleAddSubtask = useCallback(
    (taskId: string, title: string, subtaskType?: string) => {
      createSubtask.mutate({ taskId, title, subtaskType: subtaskType as Parameters<typeof createSubtask.mutate>[0]['subtaskType'] })
    },
    [createSubtask],
  )

  const handleUpdateSubtask = useCallback(
    (subtaskId: string, fields: { title?: string; subtaskType?: string; notes?: string; status?: string }) => {
      updateSubtask.mutate({ subtaskId, ...fields } as Parameters<typeof updateSubtask.mutate>[0])
    },
    [updateSubtask],
  )

  const handleReorderSubtasks = useCallback(
    (taskId: string, subtaskIds: string[]) => reorderSubtasks.mutate({ taskId, subtaskIds }),
    [reorderSubtasks],
  )

  return {
    // Mutation objects (for isPending, etc.)
    createTask,
    createSubtask,
    createStage,
    toggleStageHidden,
    toggleTaskHidden,
    reorderStages,

    // Handler functions
    handleCompleteTask,
    handleCompleteSubtask,
    handleUpdateStageStatus,
    handleUpdateTaskStatus,
    handleDeleteTask,
    handleUpdateTask,
    handleReorderTasks,
    handleDeleteSubtask,
    handleAddSubtask,
    handleUpdateSubtask,
    handleReorderSubtasks,

    // Invalidate (in case the component needs it directly)
    invalidate,
  }
}
