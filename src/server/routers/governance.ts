import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { createRouter, protectedProcedure } from '../trpc'

export const governanceRouter = createRouter({
  listRequirements: protectedProcedure
    .input(
      z.object({
        valuePath: z.string().optional(),
        phase: z.string().optional(),
        isGate: z.boolean().optional(),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      let query = ctx.db
        .from('governance_requirements')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })

      if (input?.valuePath) query = query.or(`value_path.is.null,value_path.eq.${input.valuePath}`)
      if (input?.phase) query = query.eq('phase', input.phase as never)
      if (input?.isGate !== undefined) query = query.eq('is_gate', input.isGate)

      const { data, error } = await query
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data ?? []
    }),

  listModules: protectedProcedure.query(async ({ ctx }) => {
    const { data, error } = await ctx.db
      .from('partner_modules')
      .select('*, partners!partner_modules_partner_id_fkey(name)')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
    return data ?? []
  }),

  complianceDashboard: protectedProcedure.query(async ({ ctx }) => {
    const { data, error } = await ctx.db
      .from('v_compliance_dashboard')
      .select('*')

    if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
    return data ?? []
  }),

  updateRequirement: protectedProcedure
    .input(z.object({
      requirementId: z.string().uuid(),
      title: z.string().min(1).max(500).optional(),
      description: z.string().max(2000).optional(),
      regulatoryBasis: z.string().optional(),
      regulatoryCitation: z.string().optional(),
      isGate: z.boolean().optional(),
      sortOrder: z.number().int().optional(),
      isActive: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { requirementId, ...fields } = input
      const updates: Record<string, unknown> = {}
      if (fields.title !== undefined) updates.title = fields.title
      if (fields.description !== undefined) updates.description = fields.description
      if (fields.regulatoryBasis !== undefined) updates.regulatory_basis = fields.regulatoryBasis
      if (fields.regulatoryCitation !== undefined) updates.regulatory_citation = fields.regulatoryCitation
      if (fields.isGate !== undefined) updates.is_gate = fields.isGate
      if (fields.sortOrder !== undefined) updates.sort_order = fields.sortOrder
      if (fields.isActive !== undefined) updates.is_active = fields.isActive

      const { data, error } = await ctx.db
        .from('governance_requirements')
        .update(updates as never)
        .eq('id', requirementId)
        .select()
        .single()
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),

  createModule: protectedProcedure
    .input(z.object({
      partnerId: z.string().uuid(),
      moduleName: z.string().min(1).max(255),
      description: z.string().max(2000).optional(),
      coversFunctions: z.array(z.string()).default([]),
      valuePaths: z.array(z.string()).default([]),
    }))
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.db
        .from('partner_modules')
        .insert({
          partner_id: input.partnerId,
          module_name: input.moduleName,
          description: input.description ?? null,
          covers_functions: input.coversFunctions,
          value_paths: input.valuePaths,
          is_active: true,
          version: 1,
        } as never)
        .select()
        .single()
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),

  createModuleTask: protectedProcedure
    .input(z.object({
      partnerModuleId: z.string().uuid(),
      governanceRequirementId: z.string().uuid(),
      taskTitle: z.string().min(1).max(500),
      taskDescription: z.string().max(2000).optional(),
      taskType: z.enum(['action', 'upload', 'review', 'approval', 'automated']).default('action'),
      replacesDefault: z.boolean().default(false),
      sortOrder: z.number().int().default(0),
    }))
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.db
        .from('module_tasks')
        .insert({
          partner_module_id: input.partnerModuleId,
          governance_requirement_id: input.governanceRequirementId,
          task_title: input.taskTitle,
          task_description: input.taskDescription ?? null,
          task_type: input.taskType,
          replaces_default: input.replacesDefault,
          sort_order: input.sortOrder,
          is_active: true,
        } as never)
        .select()
        .single()
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),

  listModuleTasks: protectedProcedure
    .input(z.object({ partnerModuleId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const { data, error } = await ctx.db
        .from('module_tasks')
        .select('*')
        .eq('partner_module_id', input.partnerModuleId)
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data ?? []
    }),
})
