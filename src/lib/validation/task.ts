import { z } from 'zod'
import { uuidSchema, taskTypeEnum, moneySchema, paginationSchema } from './shared'

export const createTaskInput = z.object({
  stageId: uuidSchema,
  assetId: uuidSchema,
  title: z.string().min(1).max(500),
  description: z.string().max(2000).optional(),
  taskType: taskTypeEnum.default('physical_action'),
  assignedTo: uuidSchema.optional(),
  dueDate: z.string().datetime().optional(),
  estimatedDurationDays: z.number().int().positive().optional(),
  estimatedAmount: moneySchema.optional(),
  paymentRecipient: z.string().max(255).optional(),
  paymentDescription: z.string().max(500).optional(),
})

export const updateTaskInput = z.object({
  taskId: uuidSchema,
  title: z.string().min(1).max(500).optional(),
  description: z.string().max(2000).optional(),
  taskType: taskTypeEnum.optional(),
  assignedTo: uuidSchema.nullable().optional(),
  dueDate: z.string().datetime().nullable().optional(),
  estimatedDurationDays: z.number().int().positive().nullable().optional(),
  estimatedAmount: moneySchema.nullable().optional(),
  actualAmount: moneySchema.nullable().optional(),
  paymentRecipient: z.string().max(255).nullable().optional(),
  paymentDescription: z.string().max(500).nullable().optional(),
  paymentReference: z.string().max(255).nullable().optional(),
  notes: z.string().max(5000).nullable().optional(),
})

export const completeTaskInput = z.object({
  taskId: uuidSchema,
})

export const reorderTasksInput = z.object({
  stageId: uuidSchema,
  taskIds: z.array(uuidSchema).min(1),
})

export const toggleTaskHiddenInput = z.object({
  taskId: uuidSchema,
})

export const requestApprovalInput = z.object({
  taskId: uuidSchema,
  approverIds: z.array(uuidSchema).min(1),
  sequential: z.boolean().default(false),
})

export const listMyTasksInput = z.object({
  status: z.enum(['todo', 'in_progress', 'blocked', 'pending_approval']).optional(),
  ...paginationSchema.shape,
})
