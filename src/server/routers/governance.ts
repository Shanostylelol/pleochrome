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
        .order('phase_number', { ascending: true })
        .order('step_number', { ascending: true })

      if (input?.valuePath) query = query.or(`value_path_scope.is.null,value_path_scope.eq.${input.valuePath}`)
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
})
