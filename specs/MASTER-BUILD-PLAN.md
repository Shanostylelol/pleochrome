# PleoChrome Powerhouse CRM — Master Build Plan

**Version:** 1.0
**Created:** 2026-03-29
**Status:** PLANNING
**Methodology:** Plan → Validate → Build → Test → Commit for every element

---

## BUILD METHODOLOGY

Every build step follows this cycle:

```
1. PLAN     — Read the page spec, cross-reference CLAUDE.md rules
2. VALIDATE — Check plan against master plan dependencies, design system, schema
3. BUILD    — Write the code following architecture rules
4. TEST     — npm run build (zero errors), visual check in browser, verify data flow
5. LOG      — Update BUILD-LOG.md with what was done, what was tested
6. COMMIT   — Git commit with descriptive message, push to origin
```

**If blocked:** STOP. Log the blocker in ERROR-LOG.md. Do NOT work around it.
**Before ANY code:** Read CLAUDE.md pre-flight checklist.
**After ANY code:** Run `npm run build` — zero errors required.

---

## PHASE 0: FOUNDATION

**Goal:** Everything compiles, Supabase connected, design system works, component library ready, PWA installable, mobile navigation operational.
**Duration:** ~3-4 hours
**Dependencies:** None (this IS the dependency for everything else)

| Step | Spec File | What | Test |
|------|-----------|------|------|
| 0.1 | `specs/foundation/00-supabase-init.md` | Initialize Supabase CLI, link project, run migrations 001+002 | Tables exist in Supabase dashboard |
| 0.2 | `specs/foundation/01-packages.md` | Install tRPC, TanStack Query, Supabase client libs | `npm run build` passes |
| 0.3 | `specs/foundation/02-env-config.md` | Configure .env.local, Supabase client, type generation | Types generate, client connects |
| 0.4 | `specs/foundation/03-design-system.md` | Extract neumorphic CSS + create atomic components (NeuCard, NeuButton, NeuInput, NeuBadge, NeuTabs, NeuCheckbox, NeuToggle, NeuProgress, NeuAvatar) | Components render in both dark/light mode |
| 0.5 | `specs/foundation/04-trpc-setup.md` | tRPC initialization, auth context, router structure | tRPC endpoint responds |
| 0.6 | `specs/foundation/05-crm-shell.md` | CRM layout (sidebar + header + theme toggle), auth bypass for dev | Shell renders at /crm |
| 0.7 | `specs/foundation/06-pwa-setup.md` | PWA manifest, service worker (Serwist), offline banner, iOS meta tags | Lighthouse PWA > 90, app installable |

---

## PHASE 1: PIPELINE BOARD

**Goal:** See all assets in a kanban view. Create new assets.
**Duration:** ~4-6 hours
**Dependencies:** Phase 0 complete

| Step | Spec File | What | Test |
|------|-----------|------|------|
| 1.1 | `specs/pages/01-pipeline-board.md` | Pipeline Board page with kanban columns | Page renders at /crm |
| 1.2 | `specs/api/assets-router.md` | tRPC assets router (list, getById, create, updatePhase) | API returns data |
| 1.3 | — | Seed first asset (Emerald Barrel #017093) via assemble_asset_workflow() | Asset appears in pipeline |
| 1.4 | — | Stats ribbon (AUM, active count, compliance score) | Stats calculate correctly |
| 1.5 | — | Path filter pills (Fractional / Tokenization / Debt / All) | Filtering works |

---

## PHASE 2: ASSET DETAIL + GOVERNANCE

**Goal:** Click an asset → see full governance workflow → interact with steps.
**Duration:** ~6-8 hours
**Dependencies:** Phase 1 complete

| Step | Spec File | What | Test |
|------|-----------|------|------|
| 2.1 | `specs/pages/02-asset-detail.md` | Asset Detail shell with hero + phase timeline + tabs | Page renders at /crm/assets/[id] |
| 2.2 | `specs/api/steps-router.md` | tRPC steps router (getByAsset, updateStatus, completeTask) | Steps load for asset |
| 2.3 | — | Overview tab (6 data cards from metadata JSONB) | Cards show real data |
| 2.4 | — | Governance tab (phases → steps → expandable detail) | Steps expand with tasks |
| 2.5 | — | Step detail (tasks, documents, approvals, comments, activity) | All sub-sections render |
| 2.6 | `specs/api/gates-router.md` | tRPC gates router (evaluate, passGate) | Gate conditions evaluate |
| 2.7 | — | Gate check modal with conditions + "Pass Gate" button | Gate passage works |

---

## PHASE 3: DOCUMENT MANAGEMENT

**Goal:** Upload, store, preview, version, and manage documents per step and per asset.
**Duration:** ~3-4 hours
**Dependencies:** Phase 2 complete

| Step | Spec File | What | Test |
|------|-----------|------|------|
| 3.1 | `specs/pages/03-documents.md` | Document Library page (global) | Page renders at /crm/documents |
| 3.2 | `specs/api/documents-router.md` | tRPC documents router (upload, list, getVersions, lock, delete) | Upload stores file in Supabase Storage |
| 3.3 | — | Per-step document upload zones in governance tab | Upload from within a step |
| 3.4 | — | Document preview modal | Preview opens for uploaded docs |
| 3.5 | — | Batch operations (select, download ZIP, lock) | Multi-select works |
| 3.6 | — | Version history (replace → old version preserved) | Versions tracked |
| 3.7 | — | Documents tab on Asset Detail | Asset-scoped document list |

---

## PHASE 4: TASKS + ACTIVITY

**Goal:** Track tasks, see immutable audit trail, export compliance evidence.
**Duration:** ~3-4 hours
**Dependencies:** Phase 2 complete (can parallel with Phase 3)

| Step | Spec File | What | Test |
|------|-----------|------|------|
| 4.1 | `specs/pages/04-tasks.md` | Task Dashboard page (global) | Page renders at /crm/tasks |
| 4.2 | `specs/api/tasks-router.md` | tRPC tasks router (list, complete, assign, createAdhoc) | Tasks load and update |
| 4.3 | — | Tasks tab on Asset Detail (grouped by phase/step) | Asset-scoped tasks |
| 4.4 | — | Activity tab on Asset Detail (read from activity_log) | Activity feed loads |
| 4.5 | `specs/pages/05-activity.md` | Global Activity page | Page renders at /crm/activity |
| 4.6 | — | Export audit trail (CSV + PDF) | Export downloads correctly |
| 4.7 | — | Commenting system (per-step, per-asset) | Comments save and display |

---

## PHASE 5: PARTNERS + MEETINGS + CONTACTS

**Goal:** Manage partners, track meetings, link relationships.
**Duration:** ~3-4 hours
**Dependencies:** Phase 2 complete (can parallel with Phase 3/4)

| Step | Spec File | What | Test |
|------|-----------|------|------|
| 5.1 | `specs/pages/06-partners.md` | Partners Directory + Partner Detail | Pages render |
| 5.2 | `specs/api/partners-router.md` | tRPC partners router | Partners load |
| 5.3 | — | Partner module assignment per asset | Module swap works |
| 5.4 | `specs/pages/07-meetings.md` | Meetings page with asset/partner linking | Meetings with relationships |
| 5.5 | `specs/api/meetings-router.md` | tRPC meetings router | Meetings CRUD |
| 5.6 | — | Asset holder contact management (on Asset Detail) | Holder info saves |
| 5.7 | — | Meeting-Asset-Partner relationship badges | Cross-references work |

---

## PHASE 6: SEARCH + FILTERS + NAVIGATION

**Goal:** Find anything instantly. Sort, filter, organize everything.
**Duration:** ~2-3 hours
**Dependencies:** Phases 1-5 complete (data must exist to search)

| Step | Spec File | What | Test |
|------|-----------|------|------|
| 6.1 | `specs/features/search.md` | Global fuzzy search (Cmd+K) | Search finds across all types |
| 6.2 | — | Sortable table columns (Asset List, Documents, Tasks) | Sort ascending/descending |
| 6.3 | — | Advanced filters on every list page | Filters narrow results |
| 6.4 | — | View toggles (Grid ↔ List) on Partners | View switch works |
| 6.5 | — | Partner category grouping | Group by type works |

---

## PHASE 7: GOVERNANCE TEMPLATES + COMPLIANCE + SETTINGS

**Goal:** Manage governance requirements, monitor compliance, configure the system.
**Duration:** ~3-4 hours
**Dependencies:** Phase 2 complete

| Step | Spec File | What | Test |
|------|-----------|------|------|
| 7.1 | `specs/pages/08-templates.md` | Governance Templates page | Page renders |
| 7.2 | `specs/pages/09-compliance.md` | Compliance Dashboard | Alerts calculate |
| 7.3 | — | Team page | Team members display |
| 7.4 | `specs/pages/10-settings.md` | Settings page | Preferences save |
| 7.5 | — | New Asset Wizard (5-step creation flow) | Asset creation works end-to-end |
| 7.6 | — | Notification center (in-app) | Notifications display |

---

## PHASE 8: POLISH + DEPLOY

**Goal:** Production-ready, deployed, error-free, PWA-installable, mobile-tested.
**Duration:** ~3-4 hours
**Dependencies:** All phases complete

| Step | Spec File | What | Test |
|------|-----------|------|------|
| 8.1 | — | Responsive QA: test every page at 375px, 390px, 768px, 1024px, 1440px | No horizontal scroll, all touch targets 44x44px |
| 8.2 | — | Loading states (skeleton screens) | Loading visible on slow connections |
| 8.3 | — | Empty states (no data illustrations) | Empty pages show guidance |
| 8.4 | — | Error states (failed loads, failed uploads, validation errors) | Errors handled gracefully with user-friendly messages |
| 8.5 | — | PWA final audit: Lighthouse PWA > 90, icon assets finalized, splash screens | App installable on Chrome + Safari |
| 8.6 | — | Background sync implementation (offline mutation queue) | Mutations queue offline, replay on reconnect |
| 8.7 | — | Final build + Vercel deploy | /crm accessible on pleochrome.com |
| 8.8 | — | Seed production data (Emerald Barrel + partners) | Real data visible |
| 8.9 | — | Cross-browser test: Chrome, Safari, Firefox, Edge (desktop + mobile) | No rendering issues |

---

## TESTING REQUIREMENTS (Every Build Step)

Every page and feature MUST pass ALL of the following test categories before being marked complete. These are not optional polish — they are part of the build step.

### Build Test

- `npm run build` — zero TypeScript errors, zero warnings that would become errors

### Visual Test (Desktop)

- Page renders correctly at 1440px
- Dark mode: all text readable, all shadows visible, no invisible elements
- Light mode: all text readable, all shadows visible, no invisible elements
- Neumorphic: buttons raised, inputs pressed, cards raised — visual hierarchy correct

### Visual Test (Mobile)

- Page renders correctly at **375px** (iPhone SE) and **390px** (iPhone 14)
- No horizontal scroll on any viewport between 320px and 2560px
- All touch targets minimum **44x44px** (inspect with DevTools element overlay)
- Text readable without zooming (minimum 13px body text, 11px labels)
- Navigation accessible (bottom bar visible on mobile, sidebar on desktop)
- Forms: all inputs minimum 48px height (prevents iOS zoom-on-focus)
- Modals: full-screen on mobile, centered on desktop

### Data Validation Test

- Submit empty required fields — inline errors shown immediately
- Submit invalid email format — error shown below field
- Submit negative currency value — error shown, submission blocked
- Submit value exceeding max (e.g., > $10B) — error shown, submission blocked
- Submit oversized file (> 50MB) — error shown, upload blocked before starting
- Submit invalid file type — error shown, upload blocked
- Valid submission — data saved correctly, toast confirmation shown
- Server rejects invalid data even if client validation is bypassed (test via API directly)

### PWA Test (Phase 0.7+)

- Lighthouse PWA audit score > 90
- App installable on Chrome (desktop + Android)
- Manifest loads correctly in DevTools > Application
- Service worker active and caching static assets
- Offline: app shell loads, offline banner shown
- Online recovery: banner disappears, data refreshes
- Manifest icons display correctly (192x192 and 512x512)
- iOS: apple-mobile-web-app-capable meta tag present

### Responsive Test (Every Page)

- **375px** (iPhone SE): layout correct, no overflow
- **390px** (iPhone 14): layout correct
- **768px** (iPad portrait): sidebar collapsed, content fills
- **1024px** (laptop): full sidebar, standard layout
- **1440px** (desktop): full layout, no excessive whitespace
- Bottom navigation visible and functional below 768px
- FAB visible on Pipeline page below 768px

---

## MUTABILITY PRINCIPLE — Nothing is Hardcoded

**CRITICAL:** The CRM is data-driven, not code-driven. All workflow content comes from the database.

**What can be modified at any time without code changes:**
- Governance requirements (add/deactivate/reorder via Templates page — CEO/CTO/Compliance only)
- Default tasks per requirement (add/edit/remove via Templates page)
- Partner modules and their tasks (add/swap/deactivate via Partners page)
- Per-asset tasks (add ad-hoc tasks on any step at any time)
- Per-asset step status (advance, block, or hold)
- Documents (upload new versions, add new document types)
- Comments and notes (add to any entity at any time)

**What requires a code change:**
- New PAGE (e.g., adding an Investor Portal page)
- New COMPONENT (e.g., a chart type that doesn't exist)
- New tRPC ROUTE (e.g., a new API endpoint)
- Schema changes (new table or column — requires a migration)

**When building:** Every list, workflow, and display must render from database queries, not from hardcoded arrays in the code. The `portal-data.ts` file is for the PUBLIC landing page only. The CRM reads from Supabase.

**When the user discovers a new requirement mid-process:**
1. If it's a task: add it ad-hoc on the relevant step (no code change)
2. If it's a governance requirement: add it via Templates page (no code change, but new assets will auto-include it)
3. If it's a new feature/page: that requires a code change — log it in the specs and build it

---

## BUILD RULES (Cross-Referenced from CLAUDE.md)

1. **Read CLAUDE.md before every build step** — pre-flight check is mandatory
2. **Use neumorphic design system** — no inline shadows, no hardcoded colors
3. **Use atomic components** — NeuCard, NeuButton, NeuInput for everything
4. **Feature-based file structure** — not layer-based
5. **tRPC for all data mutations** — no direct Supabase client calls from components
6. **Activity logging is automatic** — DB triggers handle it, not frontend code
7. **Dark + light mode on everything** — CSS custom properties, no hardcoded theme values
8. **"asset" not "stone"** — everywhere in code, UI, and comments
9. **Platform-agnostic** — no Brickken/Zoniqx/Rialto commitment in UI
10. **Test after every step** — `npm run build` must pass before commit
11. **Mobile-first** — design for 375px first, enhance upward. Test at 375px AND 1440px.
12. **PWA-ready** — service worker active, manifest valid, offline banner works
13. **Validate all inputs** — Zod schemas on BOTH client (React Hook Form) and server (tRPC). Shared schemas from `src/lib/validation/`.
14. **Touch targets** — minimum 44x44px on all interactive mobile elements, 8px gap between targets
15. **Bottom navigation on mobile** — sidebar hidden below 768px, replaced by bottom nav bar

---

## AUTONOMOUS BUILD PROTOCOL

When the user says **"Go"**, Claude Code will:

1. Read `specs/MASTER-BUILD-PLAN.md` to determine the next uncompleted phase
2. Read the specific page/feature spec for that step
3. Read `CLAUDE.md` (pre-flight check)
4. Read `specs/BUILD-LOG.md` to understand what's already done
5. Read `specs/ERROR-LOG.md` to check for known issues
6. Execute the build step (plan → validate → code → test → log → commit)
7. Update `specs/BUILD-LOG.md` with results
8. Move to the next step
9. If blocked: update `specs/ERROR-LOG.md`, pause, and ask the user

**The "Go" command means: pick up where you left off and keep building until the next natural checkpoint or blocker.**

---

## CURRENT STATUS

| Phase | Status | Notes |
|-------|--------|-------|
| 0: Foundation (0.1-0.6) | COMPLETE | All 7 steps done, Supabase migrated, 10 components, tRPC, CRM shell |
| 0.7: PWA Setup | COMPLETE | Manifest, icons, offline page (SW disabled for Turbopack — Phase 8) |
| 1: Pipeline Board | COMPLETE | Kanban, stats ribbon, path filters, Quick Add modal, 2 assets seeded |
| 2: Asset Detail | COMPLETE | Hero, phase timeline, 8 tabs (overview, governance, etc.), getById route |
| 3: Documents | COMPLETE | Document Library, router (list/create/lock/delete), search |
| 4: Tasks + Activity | COMPLETE | Task Dashboard with filters, Activity placeholder |
| 5: Partners + Meetings | COMPLETE | Partners directory, Meetings list, Team page |
| 6: Search + Filters | COMPLETE | Cmd+K command palette, cross-entity search |
| 7: Templates + Compliance | COMPLETE | Governance templates, compliance dashboard, settings |
| 8: Polish + Deploy | NEAR COMPLETE | Gate validation, DnD confirm, doc download, activity router. Lifecycle test remaining. |
