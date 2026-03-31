# Spec: 04 — tRPC Setup

**Phase:** 0 (Foundation)
**Step:** 0.5
**Depends On:** 01-packages.md (tRPC packages installed), 02-env-config.md (Supabase clients created)
**Produces:** Working tRPC server + client, health endpoint responds, providers wrap CRM
**Estimated Time:** 30 minutes

---

## CLAUDE.md Rules That Apply

- `API Rules #1`: All data mutations go through tRPC. No direct Supabase client calls from components (except Realtime subscriptions and Storage uploads).
- `API Rules #2`: Every mutation must invalidate affected queries.
- `API Rules #3`: Activity logging is automatic (DB triggers). Do NOT manually insert activity_log rows from the frontend.
- `API Rules #4`: Auth context flows through tRPC middleware. Every router procedure gets `ctx.user` with the authenticated user's ID and role.
- `File Structure`: `src/server/trpc.ts` for init, `src/server/routers/` for domain routers, `src/app/api/trpc/[trpc]/route.ts` for the API route.
- `CRM Architecture`: Three-layer governance model. When building CRM features, ask: "Am I building for Layer 1, 2, or 3?"

---

## Step 1: tRPC Initialization + Auth Context

### File: `src/server/trpc.ts`

```typescript
import { initTRPC, TRPCError } from '@trpc/server'
import superjson from 'superjson'
import { createAdminClient, createServerSupabaseClient } from '@/lib/supabase-server'
import type { TeamMember } from '@/lib/types'

/**
 * tRPC Context — created for every request.
 *
 * In production: extracts user from Supabase session cookies.
 * In development: uses a mock user (Shane) to bypass auth.
 *
 * Every procedure gets access to:
 *   ctx.db     — Supabase admin client (bypasses RLS for server-side queries)
 *   ctx.user   — Authenticated team member (or mock user in dev)
 */
export async function createTRPCContext() {
  // CRITICAL: Uses createAdminClient() which bypasses RLS.
  // This is intentional for server-side tRPC — all access control
  // is enforced at the tRPC middleware level, not at the DB level.
  // In dev mode, team_members have no auth_user_id, so RLS would
  // block ALL queries. The admin client solves this.
  const db = createAdminClient()

  // --- AUTH: Development bypass ---
  // TODO: Replace with real auth when ready (Phase 8+)
  // In production, this will use createServerSupabaseClient() to get
  // the user from session cookies.
  const isDev = process.env.NEXT_PUBLIC_ENV === 'development'

  let user: TeamMember | null = null

  if (isDev) {
    // Fetch the first team member (Shane) as the mock user
    const { data } = await db
      .from('team_members')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: true })
      .limit(1)
      .single()

    user = data
  } else {
    // Production: get user from Supabase session
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

/**
 * tRPC initialization with superjson transformer.
 * superjson handles Date, Decimal, and other non-JSON types.
 */
const t = initTRPC.context<TRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        // In development, include the full error stack
        ...(process.env.NEXT_PUBLIC_ENV === 'development' && {
          stack: error.cause?.stack,
        }),
      },
    }
  },
})

/**
 * Middleware: Logging
 * Logs every tRPC call with timing information.
 */
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

/**
 * Middleware: Require authenticated user
 * Throws UNAUTHORIZED if no user in context.
 */
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
      user: ctx.user, // Now guaranteed non-null
    },
  })
})

/**
 * Exports for router definitions
 */
export const createRouter = t.router
export const createCallerFactory = t.createCallerFactory

/** Public procedure — no auth required (used for health check) */
export const publicProcedure = t.procedure.use(loggerMiddleware)

/** Protected procedure — requires authenticated user */
export const protectedProcedure = t.procedure
  .use(loggerMiddleware)
  .use(authMiddleware)
```

---

## Step 2: Health Router (Test Endpoint)

### File: `src/server/routers/health.ts`

```typescript
import { createRouter, publicProcedure } from '../trpc'

export const healthRouter = createRouter({
  /**
   * Health check endpoint.
   * Returns { status: "ok" } and the governance_requirements count
   * to verify database connectivity.
   */
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
```

---

## Step 3: App Router (Merged Router)

### File: `src/server/routers/_app.ts`

```typescript
import { createRouter } from '../trpc'
import { healthRouter } from './health'

/**
 * Root tRPC router.
 * All domain routers are merged here.
 *
 * Add new routers as they are built:
 *   assets: assetsRouter,     (Phase 1)
 *   steps: stepsRouter,       (Phase 2)
 *   documents: documentsRouter, (Phase 3)
 *   tasks: tasksRouter,       (Phase 4)
 *   activity: activityRouter, (Phase 4)
 *   gates: gatesRouter,       (Phase 2)
 *   partners: partnersRouter, (Phase 5)
 *   meetings: meetingsRouter, (Phase 5)
 *   comments: commentsRouter, (Phase 4)
 *   team: teamRouter,         (Phase 7)
 */
export const appRouter = createRouter({
  health: healthRouter,
})

/** Type export for the client */
export type AppRouter = typeof appRouter
```

---

## Step 4: Next.js API Route Handler

### File: `src/app/api/trpc/[trpc]/route.ts`

```typescript
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { appRouter } from '@/server/routers/_app'
import { createTRPCContext } from '@/server/trpc'

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: createTRPCContext,
    onError:
      process.env.NEXT_PUBLIC_ENV === 'development'
        ? ({ path, error }) => {
            console.error(`[tRPC Error] ${path ?? '<no-path>'}:`, error)
          }
        : undefined,
  })

export { handler as GET, handler as POST }
```

---

## Step 5: Client-Side tRPC Hooks

### File: `src/lib/trpc.ts`

```typescript
'use client'

import { createTRPCReact } from '@trpc/react-query'
import type { AppRouter } from '@/server/routers/_app'

/**
 * Client-side tRPC hooks.
 *
 * Usage in components:
 *   import { trpc } from '@/lib/trpc'
 *
 *   // Query
 *   const { data } = trpc.health.check.useQuery()
 *
 *   // Mutation
 *   const mutation = trpc.assets.create.useMutation({
 *     onSuccess: () => {
 *       utils.assets.list.invalidate()  // Invalidate affected queries
 *     }
 *   })
 */
export const trpc = createTRPCReact<AppRouter>()
```

---

## Step 6: Providers Wrapper

### File: `src/app/crm/providers.tsx`

```typescript
'use client'

import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink } from '@trpc/client'
import superjson from 'superjson'
import { trpc } from '@/lib/trpc'

/**
 * CRM Providers — wraps all CRM pages with:
 *   1. tRPC client (connected to /api/trpc)
 *   2. TanStack Query client (caching, revalidation)
 *
 * Placed in crm/layout.tsx to scope providers to CRM pages only.
 * The public landing page does NOT need tRPC.
 */
export function CRMProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Stale time: 30 seconds (data is fresh for 30s before refetching)
            staleTime: 30 * 1000,
            // Retry failed queries twice
            retry: 2,
            // Refetch on window focus (keeps data fresh when tabbing back)
            refetchOnWindowFocus: true,
          },
          mutations: {
            // Retry mutations once
            retry: 1,
          },
        },
      })
  )

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `${process.env.NEXT_PUBLIC_APP_URL ?? ''}/api/trpc`,
          transformer: superjson,
        }),
      ],
    })
  )

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  )
}
```

---

## Step 7: Wire Up Providers in CRM Layout

The `CRMProviders` component will be used in `src/app/crm/layout.tsx` (built in spec `05-crm-shell.md`). For now, create this **minimal** placeholder layout for testing. It will be **replaced entirely** by spec 05-crm-shell.md in the next step.

### File: `src/app/crm/layout.tsx` (PLACEHOLDER — replaced by 05-crm-shell.md)

```typescript
import { CRMProviders } from './providers'

export default function CRMLayout({ children }: { children: React.ReactNode }) {
  return (
    <CRMProviders>
      <div style={{ padding: '24px' }}>
        {children}
      </div>
    </CRMProviders>
  )
}
```

**WARNING:** This is a throwaway file. Spec 05-crm-shell.md replaces it completely. Do NOT add features to this placeholder.

---

## Verification

### Test 1: Build Passes

```bash
npm run build
```

**Expected:** Zero errors. The tRPC types should resolve correctly.

### Test 2: Health Endpoint Responds

```bash
# Start dev server
npm run dev

# In another terminal, test the health endpoint
curl http://localhost:3000/api/trpc/health.check | python3 -m json.tool
```

**Expected response (wrapped in tRPC envelope):**

```json
{
  "result": {
    "data": {
      "json": {
        "status": "ok",
        "message": "Powerhouse CRM is operational",
        "governanceRequirementsCount": 25,
        "timestamp": "2026-03-29T..."
      }
    }
  }
}
```

If `governanceRequirementsCount` is 0, the governance seed data may not have been applied. Re-check migration 002.

### Test 3: Client Hooks Work

Create a temporary test page at `src/app/crm/page.tsx`:

```typescript
'use client'

import { trpc } from '@/lib/trpc'

export default function CRMPage() {
  const { data, isLoading, error } = trpc.health.check.useQuery()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      <h1>Powerhouse CRM</h1>
      <p>Status: {data?.status}</p>
      <p>Governance Requirements: {data?.governanceRequirementsCount}</p>
    </div>
  )
}
```

Visit `http://localhost:3000/crm` — should show status "ok" and the count.

**This test page will be replaced by the Pipeline Board in Phase 1.**

---

## Verification Checklist

| Check | How | Expected |
|-------|-----|----------|
| `src/server/trpc.ts` compiles | `npm run build` | No type errors |
| `src/server/routers/_app.ts` exports `AppRouter` | `npm run build` | No type errors |
| API route responds | `curl .../api/trpc/health.check` | JSON with status "ok" |
| Governance count > 0 | Response `governanceRequirementsCount` | 25+ |
| Client hooks work | Visit `/crm` with test page | Data renders |
| Mock user loads | Check server logs | `[tRPC] query health.check — Xms OK` |
| superjson transformer works | Check response dates | ISO string format, not epoch |

---

## Files Created

| File | Purpose |
|------|---------|
| `src/server/trpc.ts` | tRPC initialization, context creation, middleware, procedure exports |
| `src/server/routers/health.ts` | Health check router (test endpoint) |
| `src/server/routers/_app.ts` | Root merged router, exports `AppRouter` type |
| `src/app/api/trpc/[trpc]/route.ts` | Next.js API route handler for tRPC |
| `src/lib/trpc.ts` | Client-side tRPC React hooks |
| `src/app/crm/providers.tsx` | TanStack Query + tRPC provider wrapper |
| `src/app/crm/layout.tsx` | Placeholder CRM layout (wires providers) |

---

## Database Tables/Views Read

| Table/View | Operation | Purpose |
|------------|-----------|---------|
| `team_members` | SELECT | Mock user lookup in dev mode context |
| `governance_requirements` | SELECT (count) | Health check verification |

---

## tRPC Routes Defined

| Route | Type | Auth | Purpose |
|-------|------|------|---------|
| `health.check` | Query | Public | Returns system status + governance count |
