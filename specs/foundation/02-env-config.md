# Spec: 02 — Environment Configuration & Supabase Clients

**Phase:** 0 (Foundation)
**Step:** 0.3
**Depends On:** 00-supabase-init.md (Supabase linked), 01-packages.md (packages installed)
**Produces:** `.env.local` documented, browser + server Supabase clients, generated TypeScript types
**Estimated Time:** 20 minutes

---

## CLAUDE.md Rules That Apply

- `Security Rules #5`: No secrets in client-side code. All API keys go in `.env.local` and are only accessed in server-side code.
- `Database Rules #2`: Run `npx supabase gen types typescript` after any migration to regenerate `database.types.ts`.
- `File Structure`: `src/lib/database.types.ts` for auto-generated types (DO NOT EDIT MANUALLY).
- `File Structure`: `src/lib/supabase.ts` and `src/lib/supabase-server.ts` for client instances.

---

## Step 1: Document .env.local

Create or verify `.env.local` in the project root:

**File: `~/Projects/pleochrome/.env.local`**

```env
# ─────────────────────────────────────────────────
# Supabase Configuration
# ─────────────────────────────────────────────────

# PUBLIC: Safe to expose in browser. Identifies the project.
# Found at: Supabase Dashboard > Settings > API > Project URL
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co

# PUBLIC: Safe to expose in browser. Only works with RLS policies.
# Found at: Supabase Dashboard > Settings > API > anon/public key
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...

# SECRET: Server-side only. Bypasses RLS. NEVER expose to browser.
# Found at: Supabase Dashboard > Settings > API > service_role key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...

# ─────────────────────────────────────────────────
# App Configuration
# ─────────────────────────────────────────────────

# Base URL of the app (used for redirects, email links, etc.)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Environment indicator (development | staging | production)
NEXT_PUBLIC_ENV=development
```

**Variable Reference:**

| Variable | Scope | Purpose |
|----------|-------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Client + Server | The Supabase project URL. Prefixed with `NEXT_PUBLIC_` so it's available in browser code. Safe to expose — it's just a URL. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client + Server | The anonymous/public API key. Used for client-side queries that go through RLS policies. Safe to expose — RLS protects the data. |
| `SUPABASE_SERVICE_ROLE_KEY` | Server ONLY | The service role key. Bypasses ALL RLS policies. Used in tRPC server context for admin operations. NEVER import this in any file under `src/app/` or `src/components/`. Only used in `src/server/` and `src/lib/supabase-server.ts`. |
| `NEXT_PUBLIC_APP_URL` | Client + Server | Base URL for the app. Used for auth redirects, email confirmation links. |
| `NEXT_PUBLIC_ENV` | Client + Server | Environment flag. Used for conditional behavior (e.g., skip auth in development). |

**Security note:** `.env.local` is already in `.gitignore` (Next.js default). Verify this:
```bash
grep '.env.local' ~/Projects/pleochrome/.gitignore
```

---

## Step 2: Create Browser Supabase Client

**File: `src/lib/supabase.ts`**

```typescript
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './database.types'

/**
 * Creates a Supabase client for use in browser/client components.
 * Uses the anon key — all queries go through RLS policies.
 *
 * Usage:
 *   import { createClient } from '@/lib/supabase'
 *   const supabase = createClient()
 *   const { data } = await supabase.from('assets').select('*')
 *
 * IMPORTANT: Do NOT use this for data mutations in components.
 * All mutations must go through tRPC (per CLAUDE.md API Rules #1).
 * This client is only for:
 *   - Realtime subscriptions
 *   - Storage uploads (direct from browser)
 *   - Auth operations (sign in, sign out, session checks)
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

---

## Step 3: Create Server Supabase Client

**File: `src/lib/supabase-server.ts`**

```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from './database.types'

/**
 * Creates a Supabase client for use in Server Components, Route Handlers,
 * and Server Actions. Reads auth cookies from the request.
 *
 * Usage (in a Server Component or Route Handler):
 *   import { createServerSupabaseClient } from '@/lib/supabase-server'
 *   const supabase = await createServerSupabaseClient()
 *   const { data } = await supabase.from('assets').select('*')
 *
 * This client uses the ANON key + user's cookies for RLS.
 */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing sessions.
          }
        },
      },
    }
  )
}

/**
 * Creates a Supabase ADMIN client that bypasses RLS.
 * Uses the service_role key — NEVER expose to the client.
 *
 * Usage (in tRPC routers ONLY):
 *   import { createAdminClient } from '@/lib/supabase-server'
 *   const admin = createAdminClient()
 *   const { data } = await admin.from('governance_requirements').select('*')
 *
 * WARNING: This bypasses ALL Row Level Security policies.
 * Only use in server-side code (src/server/) for operations that
 * need to bypass RLS — such as reading governance_requirements
 * when no user is authenticated (dev mode).
 */
export function createAdminClient() {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() { return [] },
        setAll() {},
      },
    }
  )
}
```

---

## Step 4: Generate TypeScript Types

Run the type generation command:

```bash
cd ~/Projects/pleochrome
npx supabase gen types typescript --linked > src/lib/database.types.ts
```

**Verify the output file:**

The generated `src/lib/database.types.ts` should contain:

1. A top-level `Database` interface with a `public` property
2. Inside `public.Tables`, definitions for all 18+ tables:
   - `activity_log`, `asset_partners`, `asset_steps`, `asset_task_instances`, `assets`, `comments`, `contacts`, `default_tasks`, `documents`, `gate_checks`, `governance_documents`, `governance_requirements`, `meeting_notes`, `module_tasks`, `notifications`, `partner_modules`, `partners`, `tasks`, `team_members`
3. Inside `public.Views`, definitions for:
   - `v_pipeline_board`, `v_task_dashboard`, `v_compliance_dashboard`
4. Inside `public.Enums`, definitions for all enum types:
   - `value_path`, `workflow_phase`, `step_status`, `asset_status`, `partner_type`, `dd_status`, `risk_level`, `document_type`, `task_priority`, `task_status`, `kyc_status`, `contact_role`, `task_type`
5. Inside `public.Functions`, definitions for:
   - `generate_asset_reference`, `get_team_member_id`, `is_team_member`, `populate_asset_steps`

**File MUST NOT be manually edited.** Add a header comment if desired, but regenerate it entirely after any schema change.

---

## Step 5: Create Type Helpers

**File: `src/lib/types.ts`**

```typescript
import type { Database } from './database.types'

/**
 * Convenience type aliases for database tables.
 * These save you from writing Database['public']['Tables']['assets']['Row'] every time.
 */

// Table row types (what you get back from SELECT)
export type Asset = Database['public']['Tables']['assets']['Row']
export type AssetInsert = Database['public']['Tables']['assets']['Insert']
export type AssetUpdate = Database['public']['Tables']['assets']['Update']

export type AssetStep = Database['public']['Tables']['asset_steps']['Row']
export type AssetStepInsert = Database['public']['Tables']['asset_steps']['Insert']
export type AssetStepUpdate = Database['public']['Tables']['asset_steps']['Update']

export type Partner = Database['public']['Tables']['partners']['Row']
export type PartnerInsert = Database['public']['Tables']['partners']['Insert']

export type Contact = Database['public']['Tables']['contacts']['Row']

export type Document = Database['public']['Tables']['documents']['Row']
export type DocumentInsert = Database['public']['Tables']['documents']['Insert']

export type ActivityLog = Database['public']['Tables']['activity_log']['Row']

export type MeetingNote = Database['public']['Tables']['meeting_notes']['Row']

export type Task = Database['public']['Tables']['tasks']['Row']
export type TaskInsert = Database['public']['Tables']['tasks']['Insert']

export type GateCheck = Database['public']['Tables']['gate_checks']['Row']
export type GateCheckInsert = Database['public']['Tables']['gate_checks']['Insert']

export type AssetPartner = Database['public']['Tables']['asset_partners']['Row']

export type Notification = Database['public']['Tables']['notifications']['Row']

export type Comment = Database['public']['Tables']['comments']['Row']
export type CommentInsert = Database['public']['Tables']['comments']['Insert']

export type TeamMember = Database['public']['Tables']['team_members']['Row']

export type GovernanceRequirement = Database['public']['Tables']['governance_requirements']['Row']
export type GovernanceDocument = Database['public']['Tables']['governance_documents']['Row']

export type PartnerModule = Database['public']['Tables']['partner_modules']['Row']
export type ModuleTask = Database['public']['Tables']['module_tasks']['Row']
export type DefaultTask = Database['public']['Tables']['default_tasks']['Row']

export type AssetTaskInstance = Database['public']['Tables']['asset_task_instances']['Row']
export type AssetTaskInstanceInsert = Database['public']['Tables']['asset_task_instances']['Insert']
export type AssetTaskInstanceUpdate = Database['public']['Tables']['asset_task_instances']['Update']

// View types (what you get back from view queries)
export type PipelineBoard = Database['public']['Views']['v_pipeline_board']['Row']
export type TaskDashboard = Database['public']['Views']['v_task_dashboard']['Row']
export type ComplianceDashboard = Database['public']['Views']['v_compliance_dashboard']['Row']

// Enum types (re-exported for convenience)
export type ValuePath = Database['public']['Enums']['value_path']
export type WorkflowPhase = Database['public']['Enums']['workflow_phase']
export type StepStatus = Database['public']['Enums']['step_status']
export type AssetStatus = Database['public']['Enums']['asset_status']
export type PartnerType = Database['public']['Enums']['partner_type']
export type DdStatus = Database['public']['Enums']['dd_status']
export type RiskLevel = Database['public']['Enums']['risk_level']
export type DocumentType = Database['public']['Enums']['document_type']
export type TaskPriority = Database['public']['Enums']['task_priority']
export type TaskStatus = Database['public']['Enums']['task_status']
export type KycStatus = Database['public']['Enums']['kyc_status']
export type ContactRole = Database['public']['Enums']['contact_role']
export type TaskType = Database['public']['Enums']['task_type']
```

---

## Step 6: Test the Configuration

Create a simple test script to verify everything connects:

```bash
cd ~/Projects/pleochrome

# Test from the command line (Node.js)
node -e "
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'YOUR_URL_HERE',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_KEY_HERE'
);
supabase.from('governance_requirements').select('id', { count: 'exact', head: true })
  .then(({ count, error }) => {
    if (error) console.error('ERROR:', error.message);
    else console.log('SUCCESS: governance_requirements count =', count);
  });
"
```

If this script is run outside of Next.js, you need to supply the env vars manually. A better test is to verify via `npm run build`:

```bash
npm run build
```

**Expected:** Build succeeds. No type errors from the new files.

---

## Verification Checklist

| Check | How | Expected |
|-------|-----|----------|
| `.env.local` exists | `ls -la .env.local` | File exists, non-empty |
| `.env.local` in `.gitignore` | `grep env.local .gitignore` | Present |
| `supabase.ts` exports `createClient` | `grep 'export function createClient' src/lib/supabase.ts` | Found |
| `supabase-server.ts` exports both clients | `grep 'export' src/lib/supabase-server.ts` | `createServerSupabaseClient`, `createAdminClient` |
| `database.types.ts` generated | `wc -l src/lib/database.types.ts` | 500+ lines |
| `types.ts` compiles | `npx tsc --noEmit src/lib/types.ts` | No errors |
| `npm run build` passes | `npm run build` | Success |

---

## Files Created

| File | Purpose |
|------|---------|
| `.env.local` | Environment variables (already exists — document only) |
| `src/lib/supabase.ts` | Browser Supabase client (anon key, RLS-gated) |
| `src/lib/supabase-server.ts` | Server Supabase client (cookie-based) + Admin client (service role) |
| `src/lib/database.types.ts` | Auto-generated TypeScript types from Supabase schema |
| `src/lib/types.ts` | Convenience type aliases for tables, views, and enums |
