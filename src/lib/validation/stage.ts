import { z } from 'zod'
import { uuidSchema, phaseEnum, stageStatusEnum } from './shared'

export const createStageInput = z.object({
  assetId: uuidSchema,
  phase: phaseEnum,
  name: z.string().min(1).max(255),
  description: z.string().max(2000).optional(),
  isGate: z.boolean().default(false),
  gateId: z.string().max(10).optional(),
})

export const updateStageStatusInput = z.object({
  stageId: uuidSchema,
  status: stageStatusEnum,
})

export const reorderStagesInput = z.object({
  assetId: uuidSchema,
  phase: phaseEnum,
  stageIds: z.array(uuidSchema).min(1),
})

export const toggleStageHiddenInput = z.object({
  stageId: uuidSchema,
})
