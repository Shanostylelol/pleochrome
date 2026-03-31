import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { createRouter, protectedProcedure } from '../trpc'
import { uuidSchema, taskTypeEnum, valueModelEnum } from '@/lib/validation/shared'

export const sopsRouter = createRouter({
  list: protectedProcedure
    .input(z.object({
      taskType: taskTypeEnum.optional(),
      valueModel: valueModelEnum.optional(),
    }).optional())
    .query(async ({ ctx, input }) => {
      let query = ctx.db.from('sops').select('*').eq('is_active', true).order('title')
      if (input?.taskType) query = query.eq('task_type', input.taskType)
      if (input?.valueModel) query = query.eq('value_model', input.valueModel)

      const { data, error } = await query
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data ?? []
    }),

  getById: protectedProcedure
    .input(z.object({ sopId: uuidSchema }))
    .query(async ({ ctx, input }) => {
      const { data, error } = await ctx.db.from('sops').select('*').eq('id', input.sopId).single()
      if (error) throw new TRPCError({ code: 'NOT_FOUND', message: 'SOP not found' })
      return data
    }),

  getForTask: protectedProcedure
    .input(z.object({ taskType: taskTypeEnum, valueModel: valueModelEnum.optional() }))
    .query(async ({ ctx, input }) => {
      // Try model-specific first, then generic
      let query = ctx.db.from('sops').select('*').eq('task_type', input.taskType).eq('is_active', true)
      if (input.valueModel) query = query.eq('value_model', input.valueModel)

      const { data } = await query.limit(1).maybeSingle()
      if (data) return data

      // Fallback: generic SOP for this task type (no value_model)
      const { data: generic } = await ctx.db.from('sops').select('*')
        .eq('task_type', input.taskType).is('value_model', null).eq('is_active', true)
        .limit(1).maybeSingle()

      return generic
    }),

  create: protectedProcedure
    .input(z.object({
      title: z.string().min(1).max(255),
      taskType: taskTypeEnum.optional(),
      valueModel: valueModelEnum.optional(),
      purpose: z.string().min(1).max(2000),
      steps: z.array(z.object({
        stepNumber: z.number().int(),
        instruction: z.string(),
        notes: z.string().optional(),
        estimatedTime: z.string().optional(),
      })),
      tips: z.string().max(5000).optional(),
      regulatoryCitation: z.string().max(500).optional(),
      complianceNotes: z.string().max(2000).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.db.from('sops').insert({
        title: input.title,
        task_type: input.taskType ?? null,
        value_model: input.valueModel ?? null,
        purpose: input.purpose,
        steps: input.steps,
        tips: input.tips ?? null,
        regulatory_citation: input.regulatoryCitation ?? null,
        compliance_notes: input.complianceNotes ?? null,
        created_by: ctx.user.id,
      } as never).select().single()

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),

  update: protectedProcedure
    .input(z.object({
      sopId: uuidSchema,
      title: z.string().max(255).optional(),
      purpose: z.string().max(2000).optional(),
      steps: z.array(z.object({
        stepNumber: z.number().int(),
        instruction: z.string(),
        notes: z.string().optional(),
        estimatedTime: z.string().optional(),
      })).optional(),
      tips: z.string().max(5000).optional(),
      isActive: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { sopId, ...fields } = input
      const updates: Record<string, unknown> = {}
      if (fields.title !== undefined) updates.title = fields.title
      if (fields.purpose !== undefined) updates.purpose = fields.purpose
      if (fields.steps !== undefined) updates.steps = fields.steps
      if (fields.tips !== undefined) updates.tips = fields.tips
      if (fields.isActive !== undefined) updates.is_active = fields.isActive

      const { data, error } = await ctx.db.from('sops').update(updates as never).eq('id', sopId).select().single()
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),
})
