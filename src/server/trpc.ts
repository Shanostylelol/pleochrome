import { initTRPC, TRPCError } from '@trpc/server'
import superjson from 'superjson'
import { createAdminClient, createServerSupabaseClient } from '@/lib/supabase-server'
import type { TeamMember } from '@/lib/types'

export async function createTRPCContext() {
  const db = createAdminClient()

  const isDev = process.env.NEXT_PUBLIC_ENV === 'development'

  let user: TeamMember | null = null

  if (isDev) {
    const { data } = await db
      .from('team_members')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: true })
      .limit(1)
      .single()

    user = data
  } else {
    const supabase = await createServerSupabaseClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()

    if (authUser) {
      const { data } = await db
        .from('team_members')
        .select('*')
        .eq('auth_user_id', authUser.id)
        .eq('is_active', true)
        .single()

      user = data
    }
  }

  return { db, user }
}

export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>

const t = initTRPC.context<TRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        ...(process.env.NEXT_PUBLIC_ENV === 'development' && {
          stack: error.cause?.stack,
        }),
      },
    }
  },
})

const loggerMiddleware = t.middleware(async ({ path, type, next }) => {
  const start = Date.now()
  const result = await next()
  const duration = Date.now() - start

  if (result.ok) {
    console.log(`[tRPC] ${type} ${path} — ${duration}ms OK`)
  } else {
    console.error(`[tRPC] ${type} ${path} — ${duration}ms ERROR`)
  }

  return result
})

const authMiddleware = t.middleware(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to perform this action.',
    })
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  })
})

export const createRouter = t.router
export const createCallerFactory = t.createCallerFactory

export const publicProcedure = t.procedure.use(loggerMiddleware)

export const protectedProcedure = t.procedure
  .use(loggerMiddleware)
  .use(authMiddleware)
