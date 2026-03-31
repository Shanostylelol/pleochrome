import { createRouter, publicProcedure } from '../trpc'

export const healthRouter = createRouter({
  check: publicProcedure.query(async ({ ctx }) => {
    // V2: governance_requirements is gone — check assets table instead
    const { count, error } = await ctx.db
      .from('assets')
      .select('*', { count: 'exact', head: true })

    if (error) {
      return {
        status: 'error' as const,
        message: error.message,
        assetCount: 0,
        timestamp: new Date().toISOString(),
      }
    }

    return {
      status: 'ok' as const,
      message: 'Powerhouse CRM is operational',
      assetCount: count ?? 0,
      timestamp: new Date().toISOString(),
    }
  }),
})
