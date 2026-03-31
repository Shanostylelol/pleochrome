import { TRPCError } from '@trpc/server'
import { createRouter, protectedProcedure } from '../trpc'

export const teamRouter = createRouter({
  listActive: protectedProcedure.query(async ({ ctx }) => {
    const { data, error } = await ctx.db
      .from('team_members')
      .select('id, full_name, email, role')
      .eq('is_active', true)
      .order('full_name')

    if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
    return data ?? []
  }),

  getCurrentUser: protectedProcedure.query(({ ctx }) => ({
    id: ctx.user.id,
    full_name: ctx.user.full_name,
    email: ctx.user.email,
    role: ctx.user.role,
  })),
})
