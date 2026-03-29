# Spec: 01 — Package Installation

**Phase:** 0 (Foundation)
**Step:** 0.2
**Depends On:** 00-supabase-init.md (Supabase project linked)
**Produces:** All required npm packages installed, `npm run build` passes
**Estimated Time:** 15 minutes

---

## CLAUDE.md Rules That Apply

- `Stack`: Next.js 16 + React 19 + TypeScript strict + Tailwind v4
- `Stack`: tRPC for typed API layer
- `Stack`: Supabase (PostgreSQL + Auth + Storage + Realtime)
- `Stack`: TanStack Query for server state
- `Stack`: motion (Framer Motion) for animations
- `Tailwind v4 Gotcha`: Always use `var()` explicitly in arbitrary values

---

## Current State

The project already has these packages installed (from `package.json`):
- `next` 16.1.6
- `react` 19.2.3
- `react-dom` 19.2.3
- `lucide-react` ^0.577.0
- `motion` ^12.36.0
- `clsx` ^2.1.1
- `tailwind-merge` ^3.5.0
- `three` ^0.183.2 (used for 3D landing page — keep)
- `@univerjs/preset-sheets-core` + `@univerjs/presets` (spreadsheet components — keep)
- `rxjs` ^7.8.2 (dependency of univerjs — keep)

---

## Step 1: Install Supabase Client Libraries

```bash
cd ~/Projects/pleochrome

npm install @supabase/supabase-js@^2.49.0 @supabase/ssr@^0.6.0
```

| Package | Purpose |
|---------|---------|
| `@supabase/supabase-js` | Browser + server Supabase client. Provides typed queries, auth, storage, realtime. |
| `@supabase/ssr` | Server-side rendering helpers for Next.js App Router. Creates Supabase clients that work with cookies. |

---

## Step 2: Install tRPC + TanStack Query

```bash
npm install @trpc/server@^11 @trpc/client@^11 @trpc/next@^11 @trpc/react-query@^11 @tanstack/react-query@^5
```

| Package | Purpose |
|---------|---------|
| `@trpc/server` | Server-side tRPC router definitions, procedures, middleware |
| `@trpc/client` | Client-side tRPC caller |
| `@trpc/next` | Next.js integration (API route adapter) |
| `@trpc/react-query` | React hooks that connect tRPC to TanStack Query |
| `@tanstack/react-query` | Server state management. Caching, revalidation, optimistic updates. |

**Note on tRPC v11:** tRPC v11 is the current major version as of 2026. It supports Next.js App Router natively. If v11 is not yet released on npm, use `@trpc/server@next` etc.

---

## Step 3: Install Validation

```bash
npm install zod@^3.24.0
```

| Package | Purpose |
|---------|---------|
| `zod` | Runtime type validation. Used in tRPC input schemas. Every tRPC mutation and query input is validated with Zod before reaching the handler. |

---

## Step 4: Install Data Utilities

```bash
npm install date-fns@^4 recharts@^2.15.0 file-saver@^2.0.5
npm install -D @types/file-saver@^2.0.7
```

| Package | Purpose |
|---------|---------|
| `date-fns` | Date formatting and manipulation. Used for: "3 days ago", due date formatting, days-in-phase calculation. Chosen over dayjs/moment for tree-shaking. |
| `recharts` | Chart library built on D3 + React. Used for: compliance score donut, AUM trend line, phase distribution bar chart. |
| `file-saver` | Client-side file saving. Used for: CSV export of audit trails, PDF export of compliance reports. |
| `@types/file-saver` | TypeScript types for file-saver. |

---

## Step 5: Install Inngest (Async Operations)

```bash
npm install inngest@^3
```

| Package | Purpose |
|---------|---------|
| `inngest` | Background job framework. Used for: async workflow assembly (`assemble_asset_workflow()`), scheduled compliance checks, email notifications, document processing. Not needed for Phase 0/1 but installing now avoids future dependency conflicts. |

---

## Step 6: Install superjson (tRPC Serialization)

```bash
npm install superjson@^2
```

| Package | Purpose |
|---------|---------|
| `superjson` | Serializes Date, Map, Set, BigInt, etc. over JSON. Required for tRPC to correctly serialize Supabase timestamps and decimal values. Without this, all dates come back as strings. |

---

## Complete Install Command (All at Once)

If you prefer a single command:

```bash
cd ~/Projects/pleochrome

npm install \
  @supabase/supabase-js@^2.49.0 \
  @supabase/ssr@^0.6.0 \
  @trpc/server@^11 \
  @trpc/client@^11 \
  @trpc/next@^11 \
  @trpc/react-query@^11 \
  @tanstack/react-query@^5 \
  zod@^3.24.0 \
  date-fns@^4 \
  recharts@^2.15.0 \
  file-saver@^2.0.5 \
  inngest@^3 \
  superjson@^2

npm install -D @types/file-saver@^2.0.7
```

---

## What We Are NOT Installing (and Why)

| Package | Reason for Exclusion |
|---------|---------------------|
| `@supabase/auth-helpers-nextjs` | Deprecated. `@supabase/ssr` replaces it. |
| `react-markdown` | P1 feature (rich text comments). Install when needed. |
| `@tiptap/*` | P1+ feature. Not needed for MVP. |
| `jspdf` | P2 feature (PDF export). `file-saver` + server-side PDF generation is better. |
| `react-beautiful-dnd` | Not needed. Kanban is read-only (click-to-navigate, no drag). |
| `@tanstack/react-table` | Not needed for Phase 0/1. Add when building table views in Phase 3+. |
| `framer-motion` | Already installed as `motion` (the renamed package). |

---

## Verification

### Build Test

```bash
cd ~/Projects/pleochrome
npm run build
```

**Expected:** Build succeeds with zero errors. Warnings about unused packages are acceptable.

### Package Check

```bash
# Verify all critical packages are in node_modules
node -e "
const pkgs = [
  '@supabase/supabase-js',
  '@supabase/ssr',
  '@trpc/server',
  '@trpc/client',
  '@trpc/react-query',
  '@tanstack/react-query',
  'zod',
  'date-fns',
  'recharts',
  'file-saver',
  'inngest',
  'superjson'
];
pkgs.forEach(p => {
  try { require.resolve(p); console.log('OK:', p); }
  catch { console.log('MISSING:', p); }
});
"
```

**Expected:** All 12 packages show "OK".

---

## Files Modified

| File | Action |
|------|--------|
| `package.json` | MODIFIED (new dependencies added) |
| `package-lock.json` | MODIFIED (lockfile updated) |
| `node_modules/` | MODIFIED (new packages installed) |

---

## Final package.json Dependencies (After This Step)

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.49.0",
    "@supabase/ssr": "^0.6.0",
    "@tanstack/react-query": "^5",
    "@trpc/client": "^11",
    "@trpc/next": "^11",
    "@trpc/react-query": "^11",
    "@trpc/server": "^11",
    "@univerjs/preset-sheets-core": "^0.17.0",
    "@univerjs/presets": "^0.17.0",
    "clsx": "^2.1.1",
    "date-fns": "^4",
    "file-saver": "^2.0.5",
    "inngest": "^3",
    "lucide-react": "^0.577.0",
    "motion": "^12.36.0",
    "next": "16.1.6",
    "react": "19.2.3",
    "react-dom": "19.2.3",
    "recharts": "^2.15.0",
    "rxjs": "^7.8.2",
    "superjson": "^2",
    "tailwind-merge": "^3.5.0",
    "three": "^0.183.2",
    "zod": "^3.24.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/file-saver": "^2.0.7",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@types/three": "^0.183.1",
    "eslint": "^9",
    "eslint-config-next": "16.1.6",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
```
