import { z } from 'zod'

// ── Shared primitives ────────────────────────────────────────────
export const uuidSchema = z.string().uuid()
export const optionalUuid = z.string().uuid().optional().nullable()

// ── Cursor-based pagination ──────────────────────────────────────
export const paginationSchema = z.object({
  cursor: z.string().uuid().optional(),
  limit: z.number().int().min(1).max(100).default(25),
})

// ── Sort / filter helpers ────────────────────────────────────────
export const sortOrderSchema = z.enum(['asc', 'desc']).default('asc')

export const dateRangeSchema = z.object({
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
})

// ── V2 Enums (match database exactly) ────────────────────────────
export const phaseEnum = z.enum([
  'lead', 'intake', 'asset_maturity', 'security', 'value_creation', 'distribution',
])

export const valueModelEnum = z.enum([
  'tokenization', 'fractional_securities', 'debt_instrument', 'broker_sale', 'barter',
])

export const taskTypeEnum = z.enum([
  'document_upload', 'meeting', 'physical_action', 'payment_outgoing',
  'payment_incoming', 'approval', 'review', 'due_diligence', 'filing',
  'communication', 'automated',
])

// Extended enum that includes subtask-specific types (call, email, note, etc.)
export const subtaskTypeEnum_extended = z.enum([
  'document_upload', 'meeting', 'physical_action', 'payment_outgoing',
  'payment_incoming', 'approval', 'review', 'due_diligence', 'filing',
  'communication', 'automated',
  'call', 'email', 'note', 'research', 'verification', 'follow_up', 'signature',
])

export const assetStatusEnum = z.enum([
  'active', 'paused', 'completed', 'terminated', 'archived',
])

export const stageStatusEnum = z.enum([
  'not_started', 'in_progress', 'completed', 'skipped',
])

export const taskStatusEnum = z.enum([
  'todo', 'in_progress', 'blocked', 'pending_approval',
  'approved', 'rejected', 'done', 'cancelled',
])

export const subtaskStatusEnum = z.enum([
  'todo', 'in_progress', 'pending_approval', 'approved',
  'rejected', 'done', 'cancelled',
])

export const priorityEnum = z.enum(['low', 'medium', 'high', 'urgent'])

export const approvalStatusEnum = z.enum([
  'pending', 'approved', 'rejected', 'escalated',
])

export const partnerTypeEnum = z.enum([
  'appraiser', 'custodian', 'legal', 'broker_dealer', 'tokenization_platform',
  'transfer_agent', 'escrow', 'insurance', 'logistics', 'marketing',
  'qualified_intermediary', 'other',
])

// ── Reusable field schemas ───────────────────────────────────────
export const moneySchema = z.number().nonnegative().multipleOf(0.01).max(999_999_999_999.99)
export const emailSchema = z.string().email()
export const phoneSchema = z.string().regex(/^\+?[\d\s\-().]{7,20}$/, 'Invalid phone number')
export const urlSchema = z.string().url().optional().nullable()

// ── Common input patterns ────────────────────────────────────────
export const searchSchema = z.object({
  query: z.string().min(1).max(200),
})

export const idInput = z.object({
  id: uuidSchema,
})

export const assetIdInput = z.object({
  assetId: uuidSchema,
})

export const stageIdInput = z.object({
  stageId: uuidSchema,
})

export const taskIdInput = z.object({
  taskId: uuidSchema,
})
