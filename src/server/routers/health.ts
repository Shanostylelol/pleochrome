import { createRouter, publicProcedure } from '../trpc'

export const healthRouter = createRouter({
  check: publicProcedure.query(async ({ ctx }) => {
    const { count, error } = await ctx.db
      .from('governance_requirements')
      .select('*', { count: 'exact', head: true })

    if (error) {
      return {
        status: 'error' as const,
        message: error.message,
        governanceRequirementsCount: 0,
        timestamp: new Date().toISOString(),
      }
    }

    return {
      status: 'ok' as const,
      message: 'Powerhouse CRM is operational',
      governanceRequirementsCount: count ?? 0,
      timestamp: new Date().toISOString(),
    }
  }),
})
