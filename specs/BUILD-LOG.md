# PleoChrome Powerhouse CRM — Build Log

**Purpose:** Running record of every build step, what was done, what was tested, and what was committed. This is the build-time audit trail.

---

## Format

```
### [Phase].[Step] — [Title]
**Date:** YYYY-MM-DD
**Status:** COMPLETE / FAILED / IN PROGRESS
**What was done:** (description)
**Files created/modified:** (list)
**Tests passed:** (npm run build, visual check, data flow)
**Commit:** (hash + message)
**Notes:** (anything relevant for future reference)
```

---

## Log Entries

### 0.1 — Supabase Initialization
**Date:** 2026-03-29
**Status:** COMPLETE
**What was done:**
- Initialized Supabase CLI (`supabase init`)
- Linked project ref `satrlfdnevquvnozhlvn`
- Fixed `uuid_generate_v4()` → `gen_random_uuid()` (19 occurrences across 001+002 — uuid-ossp not in public schema on Supabase)
- Fixed `a.asset_reference` → `a.reference_code` in v_unified_tasks view (002)
- Added `completed_by` column to tasks table in 001 (was missing, needed by v_unified_tasks)
- Fixed `role_on_stone` → `role_on_asset` in asset_partners table
- Removed uuid-ossp extension (not needed with gen_random_uuid)
- Ran `supabase db reset --linked` — all 3 migrations applied successfully
- Created 5 storage buckets (asset-documents, partner-documents, meeting-recordings, team-documents, temp-uploads)
- Seeded 3 team members (Shane/CEO, David/CTO, Chris/CRO)
- Generated TypeScript types (2,369 lines)
**Files created/modified:**
- `supabase/migrations/001_powerhouse_crm_schema.sql` (uuid fix, completed_by, role_on_asset)
- `supabase/migrations/002_modular_governance_schema.sql` (uuid fix, reference_code fix)
- `src/lib/database.types.ts` (auto-generated)
- `supabase/config.toml` (created by init)
**Tests passed:**
- 19 tables exist in public schema
- 81 governance requirements seeded
- 4 views working (v_pipeline_board, v_task_dashboard, v_compliance_dashboard, v_unified_tasks)
- 5 storage buckets created
- 3 team members seeded
- Types file generated (2,369 lines)
**Notes:** ERR-001 (stone→asset) partially resolved in this step. Migration files modified pre-deployment since they had never been deployed.

### 0.2 — Package Installation
**Date:** 2026-03-29
**Status:** COMPLETE
**What was done:** Installed 16 packages + 1 devDependency: @supabase/supabase-js, @supabase/ssr, @trpc/server, @trpc/client, @trpc/react-query, @tanstack/react-query, zod, date-fns, recharts, file-saver, inngest, superjson, @serwist/next, serwist, react-hook-form, @hookform/resolvers, @types/file-saver (dev)
**Files created/modified:** package.json, package-lock.json
**Tests passed:** All 16 packages resolve OK. `npm run build` passes with zero errors.
**Notes:** Fixed database.types.ts — Supabase CLI was leaking "Initialising login role..." and version upgrade notice into stdout. Regenerated with `2>/dev/null`.

### 0.3 — Env Config + Supabase Clients
**Date:** 2026-03-29
**Status:** COMPLETE
**What was done:** Created browser Supabase client (supabase.ts), server + admin clients (supabase-server.ts), and type aliases (types.ts). .env.local already configured from Phase 0.1.
**Files created:** `src/lib/supabase.ts`, `src/lib/supabase-server.ts`, `src/lib/types.ts`
**Tests passed:** `npm run build` — zero errors.

---

## PHASE 1: PIPELINE BOARD

---

## PHASE 2: ASSET DETAIL + GOVERNANCE

---

## PHASE 3: DOCUMENT MANAGEMENT

### 3.1-3.7 — Document Library + Router
**Date:** 2026-03-29
**Status:** COMPLETE
**What was done:** Created documents tRPC router (list, getStats, create, toggleLock, delete). Built Document Library page at /crm/documents with search, stats bar, document list with type badges, lock/unlock, delete controls, upload button. Fixed document_type enum mapping and required fields (title, storage_bucket).
**Files created:** `src/server/routers/documents.ts`, `src/app/crm/documents/page.tsx`
**Tests passed:** `npm run build` — zero errors.

---

## PHASE 4+5: TASKS, ACTIVITY, PARTNERS, MEETINGS

### 4.1-5.7 — All CRM Pages
**Date:** 2026-03-29
**Status:** COMPLETE
**What was done:**
- Created tasks tRPC router (list, complete, create)
- Created partners tRPC router (list, getById, create)
- Created meetings tRPC router (list, create)
- Built Task Dashboard at /crm/tasks with filter tabs, priority badges, complete button
- Built Activity Feed placeholder at /crm/activity
- Built Partners Directory at /crm/partners with grid cards, DD status, contact info
- Built Meetings page at /crm/meetings with linked asset/partner badges
- Built Team page at /crm/team with 3 founders
- Built placeholder pages: Templates, Compliance, Settings (Phase 7)
**Files created:** 6 routers total, 11 CRM pages total
**Tests passed:** `npm run build` — zero errors. 22 routes generated.

### 2.1-2.5 — Asset Detail Shell + Steps + Tabs
**Date:** 2026-03-29
**Status:** COMPLETE
**What was done:**
- Added `assets.getById` route with asset, steps, documents, tasks, activity, comments, partners data
- Built Asset Detail page at `/crm/assets/[id]` with:
  - Breadcrumb navigation (Pipeline > Asset Name)
  - Hero section: name, reference code, status/path/type badges, holder, 4 key metrics (Appraised/Offering/Raised/Investors), lead avatar, action buttons (Edit/Add Doc/Note/Export)
  - Phase Timeline component (9 phases with completed/active/pending dots, connecting lines, labels)
  - 8-tab interface (Overview/Governance/Documents/Tasks/Activity/Gates/Financials/Partners)
  - Overview tab: 4 info cards (Holder, Certification, Custody, Legal) with data from metadata JSONB
  - Governance tab: steps grouped by phase with status badges and step numbers
  - Activity tab: chronological audit trail from activity_log
  - Partners tab: partner cards with avatars and roles
  - Placeholder tabs for Documents, Tasks, Gates, Financials (built in later phases)
- Fixed admin client comments query: uses `entity_id`/`entity_type` not `asset_id`
**Files created:** `src/app/crm/assets/[id]/page.tsx`, `src/components/crm/PhaseTimeline.tsx`
**Files modified:** `src/server/routers/assets.ts`
**Tests passed:** `npm run build` — zero errors. 14 routes generated including dynamic `/crm/assets/[id]`.

### 1.1-1.5 — Pipeline Board + Assets Router + Seed Data + Stats + Filters
**Date:** 2026-03-29
**Status:** COMPLETE
**What was done:**
- Created assets tRPC router with `list`, `getStats`, `create`, `updatePhase` procedures
- Fixed admin client to use `createClient` from `@supabase/supabase-js` (SSR client was returning `never` types)
- Built Pipeline Board page at `/crm` with:
  - Page header with "New Asset" button
  - Stats ribbon (Total AUM, Active Assets, Avg Days, Compliance Score with progress bar)
  - Path filter pills (All/Fractional/Tokenization/Debt) in pressed container
  - 4-column kanban board (Acquisition/Preparation/Execution/Distribution) with pressed troughs
  - Asset cards (NeuCard raised-sm, hoverable) showing reference, name, badges, value, progress, step info, avatar
  - Empty column states with Inbox icon
  - Mobile FAB (floating action button) for Quick Add
  - Quick Add Modal with name, holder, asset type, value path, estimated value
  - Supabase Realtime subscription for live updates
- Created AssetCard component with path/status badges, progress bar, risk indicator
- Seeded 2 test assets: Emerald Barrel #017093 ($15.4M tokenization, active) and Ruby Parcel Colombia #082 ($3.2M fractional, prospect)
**Files created:** `src/server/routers/assets.ts`, `src/components/crm/AssetCard.tsx`
**Files modified:** `src/server/routers/_app.ts`, `src/app/crm/page.tsx`, `src/lib/supabase-server.ts`
**Tests passed:**
- `npm run build` — zero errors
- `assets.list` — returns 2 assets in correct phase order
- `assets.getStats` — returns $15.2M AUM, 2 active, 0% compliance (no steps yet)
- `v_pipeline_board` view — both assets visible with correct data
- Quick Add Modal — creates assets via tRPC mutation

### 0.7 — PWA Setup
**Date:** 2026-03-29
**Status:** COMPLETE
**What was done:**
- Created manifest.ts with PleoChrome branding, shortcuts, and icon references
- Created service worker (sw.ts) with default Serwist caching
- Updated next.config.ts with Serwist wrapper (disabled for Turbopack compat — re-enable Phase 8)
- Created 10 placeholder icon PNGs (192x192, 512x512, maskable, shortcuts, apple-touch, screenshots)
- Added iOS meta tags to root layout (appleWebApp, formatDetection)
- Created offline fallback page (crm/offline/page.tsx) with neumorphic design
- Created OfflineBanner component (connection detection, amber warning bar)
- Added offline banner CSS to neumorphic.css
- Integrated OfflineBanner into CRM layout
**Files created:** `src/app/manifest.ts`, `src/app/sw.ts`, `src/app/crm/offline/page.tsx`, `src/components/crm/OfflineBanner.tsx`, 10 placeholder icons
**Files modified:** `next.config.ts`, `src/app/layout.tsx`, `src/app/crm/layout.tsx`, `src/styles/neumorphic.css`
**Tests passed:** `npm run build` — zero errors. Manifest generates at `/manifest.webmanifest`.
**Notes:** Serwist service worker disabled because @serwist/next doesn't support Next.js 16 Turbopack. Manifest + icons + offline page are ready. SW will be re-enabled in Phase 8 with `--webpack` flag or @serwist/turbopack migration. Logged in ERROR-LOG as ERR-004.

### 0.6 — CRM Shell
**Date:** 2026-03-29
**Status:** COMPLETE
**What was done:**
- Created CRM shell layout with sidebar (desktop), header, bottom nav (mobile), theme toggle
- Created ThemeProvider with localStorage persistence (dark/light)
- Created CRMSidebar with 11 nav items (7 main + 4 admin), active state detection, collapsed mode
- Created CRMHeader with PleoChrome branding, theme toggle, user avatar, hamburger (mobile)
- Created MobileDrawer (slide-out full nav for mobile)
- Created CRMBottomNav (5-item bottom bar: Pipeline, Assets, Tasks, Activity, More)
- Created MoreSheet (slide-up grid with remaining nav items)
- Created NeuToast provider with success/error/info notifications
- Added shell CSS and animation keyframes to neumorphic.css
- Updated CRM test page with neumorphic cards showing system status
**Files created:** `ThemeProvider.tsx`, `CRMSidebar.tsx`, `CRMHeader.tsx`, `MobileDrawer.tsx`, `CRMBottomNav.tsx`, `MoreSheet.tsx`, `NeuToast.tsx`
**Files modified:** `src/app/crm/layout.tsx`, `src/app/crm/page.tsx`, `src/styles/neumorphic.css`
**Tests passed:** `npm run build` — zero errors.

### 0.5 — tRPC Setup
**Date:** 2026-03-29
**Status:** COMPLETE
**What was done:** Created tRPC server init with auth context (dev bypass using mock user Shane), health router, app router, Next.js API route handler (fetch adapter), client-side hooks, CRM providers wrapper, placeholder CRM layout + test page.
**Files created:** `src/server/trpc.ts`, `src/server/routers/health.ts`, `src/server/routers/_app.ts`, `src/app/api/trpc/[trpc]/route.ts`, `src/lib/trpc.ts`, `src/app/crm/providers.tsx`, `src/app/crm/layout.tsx`, `src/app/crm/page.tsx`
**Tests passed:**
- `npm run build` — zero errors
- `curl /api/trpc/health.check` — returns `{"status":"ok","governanceRequirementsCount":81}`
- Dev mode auth bypass: mock user (Shane) loads from team_members

### 0.4 — Design System + Atomic Components
**Date:** 2026-03-29
**Status:** COMPLETE
**What was done:**
- Created neumorphic.css with full CSS custom property system (brand colors, dark/light themes, shadows, spacing, radius, utility classes)
- Created design-system.ts with TypeScript constants (BRAND_COLORS, PATH_COLORS, PHASE_COLORS, STATUS_COLORS, etc.)
- Created 10 atomic components: NeuCard, NeuButton, NeuInput/NeuTextarea, NeuSelect, NeuBadge, NeuTabs, NeuCheckbox, NeuToggle, NeuProgress, NeuAvatar
- Created barrel export (components/ui/index.ts)
- Updated globals.css to import neumorphic.css before Tailwind
- Updated layout.tsx with data-theme="dark" attribute
**Files created:** `src/styles/neumorphic.css`, `src/lib/design-system.ts`, 10 component files in `src/components/ui/`, `src/components/ui/index.ts`
**Files modified:** `src/app/globals.css`, `src/app/layout.tsx`
**Tests passed:** `npm run build` — zero errors.

---

## PHASE 6: SEARCH + FILTERS

### 6.1 — Global Search (Cmd+K)
**Date:** 2026-03-29
**Status:** COMPLETE
**What was done:** Created search tRPC router with parallel queries across assets, partners, documents, tasks, meetings. Built CommandPalette component with keyboard shortcut (Cmd+K), real-time grouped results, click-to-navigate. Integrated search trigger in CRM header.
**Files created:** `src/server/routers/search.ts`, `src/components/crm/CommandPalette.tsx`
**Tests passed:** `npm run build` — zero errors. Search finds assets by name/reference.

---

## PHASE 7: TEMPLATES + COMPLIANCE + SETTINGS

### 7.1-7.4 — Governance Templates, Compliance, Settings
**Date:** 2026-03-29
**Status:** COMPLETE
**What was done:** Created governance tRPC router. Built Templates page (81 requirements, expandable phase groups, gate indicators, regulatory citations, path badges). Compliance Dashboard (score, alerts, per-asset progress). Settings page (theme toggle, notifications, system info). Fixed governance router column names.
**Files created:** `src/server/routers/governance.ts`
**Tests passed:** `npm run build` — zero errors. Templates shows all 81 requirements.

---

## PHASE 8: POLISH + TESTING

### 8.1-8.4 — Browser Testing, Bug Fixes, Create Modals
**Date:** 2026-03-29
**Status:** COMPLETE
**What was done:**
- Seeded 8 additional test assets (11 total across all phases/paths/types)
- Browser-tested all 11 CRM pages in Chrome with screenshots
- Tested dark + light mode (both correct neumorphic shadows)
- Tested Cmd+K search, Quick Add, Task creation, path filters, asset detail navigation
- Bug fixes: phase labels, asset type badges, governance router columns, tasks/meetings router column mismatches, NeuSelect children support, admin client typing
- Added: Task Create Modal, Partner Create Modal, Meeting Create Modal, Activity Feed (real Supabase query + Realtime)
**Tests passed:** `npm run build` — zero errors. 22 routes. All pages verified in browser.

### 8.5 — Drag-and-Drop + List View Toggle
**Date:** 2026-03-29
**Status:** COMPLETE
**What was done:**
- Installed @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities
- Kanban cards show grip handle on hover, draggable between columns
- DragOverlay shows card preview while dragging
- Dropping on a different column triggers updatePhase mutation
- View toggle (kanban/list) with neumorphic pressed container
- List view: full table (Reference, Name, Type, Path, Phase, Value, Status) with color-coded badges
- Rows clickable to navigate to asset detail
- Responsive table: Type hidden < md, Path/Status hidden < lg
**Tests passed:** `npm run build` — zero errors. Kanban and list toggle verified in browser.

### 8.6 — Mobile Responsive QA
**Date:** 2026-03-29
**Status:** COMPLETE
**What was done:**
- Tested at 375px (iPhone SE): Pipeline Board, Asset Detail, bottom nav, hamburger drawer, More sheet, FAB
- Tested at 768px (iPad portrait): sidebar icon-only, bottom nav hidden, kanban scrollable
- Tested at 1440px (desktop): full sidebar with labels, all content visible
- All pages pass: no horizontal overflow, touch targets adequate, text readable
**Breakpoints verified:** 375px, 768px, 1440px
**Results:**
- 375px: sidebar hidden, bottom nav visible, FAB visible, hamburger drawer slides in, More sheet slides up, kanban scrollable, asset detail stacks vertically
- 768px: sidebar icon-only, bottom nav hidden, content fills, kanban scrollable
- 1440px: full sidebar with labels, all columns visible, list view full table

---

## SPRINT 2: PRODUCTION BLOCKERS

### S2.1 — Gate Validation + Phase Transition Confirmation
**Date:** 2026-03-30
**Status:** COMPLETE
**What was done:**
- updatePhase validates sequential transitions (no phase skipping)
- Checks all steps in current phase completed before advancing
- Returns blockers list when validation fails
- Supports force:true admin override
- Pipeline DnD shows confirmation dialog before moving assets
**Tests passed:** `npm run build` — zero errors.

### S2.2 — Document Download + Storage Cleanup
**Date:** 2026-03-30
**Status:** COMPLETE
**What was done:**
- getDownloadUrl route generates signed Supabase Storage URLs (1hr expiry)
- Download button on every document in the library
- Storage file cleanup on document deletion
- assets.archive mutation for soft-deleting assets
**Files created:** None (modifications to existing routers)

### S2.3 — Activity Feed Router
**Date:** 2026-03-30
**Status:** COMPLETE
**What was done:**
- New activity tRPC router replaces direct Supabase client calls
- Resolves performed_by to team member names via FK join
- Shows avatars for attributed actions
- Fixed performed_at column reference

### S2.4 — Reference Code Fix
**Date:** 2026-03-30
**Status:** COMPLETE
**What was done:**
- Reference code uses random 4-digit + retry loop (5 attempts)
- Eliminates Date.now() collision risk

### Remaining
**Status:** PENDING
**Items:** Wipe test data + zero-to-end asset lifecycle test
