import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { createRouter, protectedProcedure } from '../trpc'
import { uuidSchema, phaseEnum, taskTypeEnum } from '@/lib/validation/shared'

export const templatesRouter = createRouter({
  // ── List templates ─────────────────────────────────────────────
  list: protectedProcedure
    .input(z.object({ valueModel: z.string().optional(), assetType: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      let query = ctx.db.from('workflow_templates').select('*').order('name')
      if (input?.valueModel) query = query.eq('value_model', input.valueModel as never)
      if (input?.assetType) query = query.eq('asset_type' as never, input.assetType)

      const { data, error } = await query
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data ?? []
    }),

  // ── Get template with full hierarchy ───────────────────────────
  getById: protectedProcedure
    .input(z.object({ templateId: uuidSchema }))
    .query(async ({ ctx, input }) => {
      const { data: template, error } = await ctx.db
        .from('workflow_templates').select('*').eq('id', input.templateId).single()
      if (error) throw new TRPCError({ code: 'NOT_FOUND', message: 'Template not found' })

      const { data: stages } = await ctx.db.from('template_stages')
        .select('*').eq('template_id', input.templateId).order('phase').order('sort_order')

      const stageIds = (stages ?? []).map(s => s.id)
      const { data: tasks } = stageIds.length > 0
        ? await ctx.db.from('template_tasks').select('*').in('template_stage_id', stageIds).order('sort_order')
        : { data: [] }

      const taskIds = (tasks ?? []).map(t => t.id)
      const { data: subtasks } = taskIds.length > 0
        ? await ctx.db.from('template_subtasks').select('*').in('template_task_id', taskIds).order('sort_order')
        : { data: [] }

      return { template, stages: stages ?? [], tasks: tasks ?? [], subtasks: subtasks ?? [] }
    }),

  // ── Create template ────────────────────────────────────────────
  create: protectedProcedure
    .input(z.object({
      name: z.string().min(1).max(255),
      description: z.string().max(2000).optional(),
      valueModel: z.string().optional(),
      assetType: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.db.from('workflow_templates').insert({
        name: input.name,
        description: input.description ?? null,
        value_model: input.valueModel ?? null,
        asset_type: input.assetType ?? null,
        created_by: ctx.user.id,
      } as never).select().single()

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),

  // ── Stage CRUD ─────────────────────────────────────────────────
  addStage: protectedProcedure
    .input(z.object({
      templateId: uuidSchema,
      phase: phaseEnum,
      name: z.string().min(1).max(255),
      description: z.string().max(2000).optional(),
      isGate: z.boolean().default(false),
      gateId: z.string().max(10).optional(),
      regulatoryBasis: z.string().max(500).optional(),
      regulatoryCitation: z.string().max(255).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { data: existing } = await ctx.db.from('template_stages')
        .select('sort_order').eq('template_id', input.templateId).eq('phase', input.phase)
        .order('sort_order', { ascending: false }).limit(1).maybeSingle()

      const { data, error } = await ctx.db.from('template_stages').insert({
        template_id: input.templateId,
        phase: input.phase,
        name: input.name,
        description: input.description ?? null,
        sort_order: (existing?.sort_order ?? -1) + 1,
        is_gate: input.isGate,
        gate_id: input.gateId ?? null,
        regulatory_basis: input.regulatoryBasis ?? null,
        regulatory_citation: input.regulatoryCitation ?? null,
      } as never).select().single()

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),

  updateStage: protectedProcedure
    .input(z.object({
      stageId: uuidSchema,
      name: z.string().max(255).optional(),
      description: z.string().max(2000).optional(),
      isGate: z.boolean().optional(),
      isHidden: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { stageId, ...fields } = input
      const updates: Record<string, unknown> = {}
      if (fields.name !== undefined) updates.name = fields.name
      if (fields.description !== undefined) updates.description = fields.description
      if (fields.isGate !== undefined) updates.is_gate = fields.isGate
      if (fields.isHidden !== undefined) updates.is_hidden = fields.isHidden

      const { data, error } = await ctx.db.from('template_stages').update(updates as never).eq('id', stageId).select().single()
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),

  removeStage: protectedProcedure
    .input(z.object({ stageId: uuidSchema }))
    .mutation(async ({ ctx, input }) => {
      const { error } = await ctx.db.from('template_stages').delete().eq('id', input.stageId)
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return { success: true }
    }),

  reorderStages: protectedProcedure
    .input(z.object({ templateId: uuidSchema, phase: phaseEnum, stageIds: z.array(uuidSchema).min(1) }))
    .mutation(async ({ ctx, input }) => {
      await Promise.all(input.stageIds.map((id, i) =>
        ctx.db.from('template_stages').update({ sort_order: i } as never).eq('id', id)
      ))
      return { success: true }
    }),

  // ── Task CRUD ──────────────────────────────────────────────────
  addTask: protectedProcedure
    .input(z.object({
      templateStageId: uuidSchema,
      title: z.string().min(1).max(500),
      description: z.string().max(2000).optional(),
      taskType: taskTypeEnum.default('physical_action'),
      estimatedDurationDays: z.number().int().positive().optional(),
      partnerType: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { data: existing } = await ctx.db.from('template_tasks')
        .select('sort_order').eq('template_stage_id', input.templateStageId)
        .order('sort_order', { ascending: false }).limit(1).maybeSingle()

      const { data, error } = await ctx.db.from('template_tasks').insert({
        template_stage_id: input.templateStageId,
        title: input.title,
        description: input.description ?? null,
        task_type: input.taskType,
        sort_order: (existing?.sort_order ?? -1) + 1,
        estimated_duration_days: input.estimatedDurationDays ?? null,
        partner_type: input.partnerType ?? null,
      } as never).select().single()

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),

  updateTask: protectedProcedure
    .input(z.object({
      taskId: uuidSchema,
      title: z.string().max(500).optional(),
      description: z.string().max(2000).optional(),
      taskType: taskTypeEnum.optional(),
      isHidden: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { taskId, ...fields } = input
      const updates: Record<string, unknown> = {}
      if (fields.title !== undefined) updates.title = fields.title
      if (fields.description !== undefined) updates.description = fields.description
      if (fields.taskType !== undefined) updates.task_type = fields.taskType
      if (fields.isHidden !== undefined) updates.is_hidden = fields.isHidden

      const { data, error } = await ctx.db.from('template_tasks').update(updates as never).eq('id', taskId).select().single()
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),

  removeTask: protectedProcedure
    .input(z.object({ taskId: uuidSchema }))
    .mutation(async ({ ctx, input }) => {
      const { error } = await ctx.db.from('template_tasks').delete().eq('id', input.taskId)
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return { success: true }
    }),

  reorderTasks: protectedProcedure
    .input(z.object({ templateStageId: uuidSchema, taskIds: z.array(uuidSchema).min(1) }))
    .mutation(async ({ ctx, input }) => {
      await Promise.all(input.taskIds.map((id, i) =>
        ctx.db.from('template_tasks').update({ sort_order: i } as never).eq('id', id)
      ))
      return { success: true }
    }),

  // ── Subtask CRUD ───────────────────────────────────────────────
  addSubtask: protectedProcedure
    .input(z.object({
      templateTaskId: uuidSchema,
      title: z.string().min(1).max(500),
      description: z.string().max(2000).optional(),
      requiresApproval: z.boolean().default(false),
    }))
    .mutation(async ({ ctx, input }) => {
      const { data: existing } = await ctx.db.from('template_subtasks')
        .select('sort_order').eq('template_task_id', input.templateTaskId)
        .order('sort_order', { ascending: false }).limit(1).maybeSingle()

      const { data, error } = await ctx.db.from('template_subtasks').insert({
        template_task_id: input.templateTaskId,
        title: input.title,
        description: input.description ?? null,
        requires_approval: input.requiresApproval,
        sort_order: (existing?.sort_order ?? -1) + 1,
      } as never).select().single()

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),

  removeSubtask: protectedProcedure
    .input(z.object({ subtaskId: uuidSchema }))
    .mutation(async ({ ctx, input }) => {
      const { error } = await ctx.db.from('template_subtasks').delete().eq('id', input.subtaskId)
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return { success: true }
    }),

  reorderSubtasks: protectedProcedure
    .input(z.object({ templateTaskId: uuidSchema, subtaskIds: z.array(uuidSchema).min(1) }))
    .mutation(async ({ ctx, input }) => {
      await Promise.all(input.subtaskIds.map((id, i) =>
        ctx.db.from('template_subtasks').update({ sort_order: i } as never).eq('id', id)
      ))
      return { success: true }
    }),

  // ── Save from asset (snapshot) ─────────────────────────────────
  saveFromAsset: protectedProcedure
    .input(z.object({
      assetId: uuidSchema,
      templateName: z.string().min(1).max(255),
      description: z.string().max(2000).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.db.rpc('save_as_template', {
        p_asset_id: input.assetId,
        p_template_name: input.templateName,
        p_description: input.description ?? undefined,
        p_created_by: ctx.user.id,
      })

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return { templateId: data }
    }),

  // ── Instantiate template to asset ──────────────────────────────
  instantiateToAsset: protectedProcedure
    .input(z.object({ assetId: uuidSchema, templateId: uuidSchema }))
    .mutation(async ({ ctx, input }) => {
      const { error } = await ctx.db.rpc('instantiate_from_template', {
        p_asset_id: input.assetId,
        p_template_id: input.templateId,
      })

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return { success: true }
    }),
})
