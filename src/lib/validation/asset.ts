import { z } from 'zod'
import { uuidSchema, phaseEnum, valueModelEnum, assetStatusEnum, paginationSchema, moneySchema } from './shared'

export const createAssetInput = z.object({
  name: z.string().min(1).max(255),
  assetType: z.string().min(1).max(100),
  description: z.string().max(2000).optional(),
  valueModel: valueModelEnum.optional(),
  claimedValue: moneySchema.optional(),
  holderEntity: z.string().min(1).max(255),
  origin: z.string().max(255).optional(),
  caratWeight: z.number().positive().optional(),
  assetCount: z.number().int().positive().optional(),
  leadTeamMemberId: uuidSchema.optional(),
})

export const updateAssetInput = z.object({
  assetId: uuidSchema,
  name: z.string().min(1).max(255).optional(),
  description: z.string().max(2000).optional(),
  claimedValue: moneySchema.optional(),
  appraisedValue: moneySchema.optional(),
  valueModel: valueModelEnum.optional(),
  origin: z.string().max(255).optional(),
  caratWeight: z.number().positive().optional(),
  assetCount: z.number().int().positive().optional(),
  currentLocation: z.string().max(255).optional(),
  spvName: z.string().max(255).optional(),
  spvEin: z.string().max(20).optional(),
  leadTeamMemberId: uuidSchema.optional(),
  metadata: z.record(z.unknown()).optional(),
})

export const advancePhaseInput = z.object({
  assetId: uuidSchema,
  targetPhase: phaseEnum,
  force: z.boolean().default(false),
  overrideReason: z.string().max(1000).optional(),
})

export const listAssetsInput = z.object({
  valueModel: valueModelEnum.optional(),
  status: assetStatusEnum.optional(),
  phase: phaseEnum.optional(),
  search: z.string().max(200).optional(),
  leadTeamMemberId: uuidSchema.optional(),
  ...paginationSchema.shape,
})

export const archiveAssetInput = z.object({
  assetId: uuidSchema,
  reason: z.string().min(1).max(1000),
})
