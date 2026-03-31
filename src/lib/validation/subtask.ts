import { z } from 'zod'
import { uuidSchema, subtaskTypeEnum_extended, subtaskStatusEnum } from './shared'

export const createSubtaskInput = z.object({
  taskId: uuidSchema,
  title: z.string().min(1).max(500),
  description: z.string().max(2000).optional(),
  assignedTo: uuidSchema.optional(),
  requiresApproval: z.boolean().default(false),
  subtaskType: subtaskTypeEnum_extended.optional(),
})

export const updateSubtaskInput = z.object({
  subtaskId: uuidSchema,
  title: z.string().min(1).max(500).optional(),
  description: z.string().max(2000).optional(),
  assignedTo: uuidSchema.nullable().optional(),
  notes: z.string().max(5000).nullable().optional(),
  subtaskType: subtaskTypeEnum_extended.nullable().optional(),
  status: subtaskStatusEnum.optional(),
})

export const completeSubtaskInput = z.object({
  subtaskId: uuidSchema,
})

export const reorderSubtasksInput = z.object({
  taskId: uuidSchema,
  subtaskIds: z.array(uuidSchema).min(1),
})

export const toggleSubtaskHiddenInput = z.object({
  subtaskId: uuidSchema,
})
