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

  getWorkload: protectedProcedure.query(async ({ ctx }) => {
    const { data: members, error } = await ctx.db
      .from('team_members')
      .select('id, full_name, email, role')
      .eq('is_active', true)
      .order('full_name')

    if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })

    const { data: tasks } = await ctx.db
      .from('tasks')
      .select('assigned_to, status')
      .eq('is_deleted', false)
      .in('status', ['todo', 'in_progress', 'blocked', 'done'])

    const counts = (members ?? []).map((m) => {
      const memberTasks = (tasks ?? []).filter((t) => t.assigned_to === m.id)
      return {
        ...m,
        open: memberTasks.filter((t) => t.status === 'todo' || t.status === 'in_progress').length,
        blocked: memberTasks.filter((t) => t.status === 'blocked').length,
        completed: memberTasks.filter((t) => t.status === 'done').length,
      }
    })

    return counts
  }),
})
