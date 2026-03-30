# Session Handoff — PleoChrome Powerhouse CRM Build

**Last Updated:** 2026-03-30
**Purpose:** This file ensures any new Claude Code session can pick up the build exactly where the last one left off. Read this FIRST in any new session.

---

## CURRENT STATE (as of March 30, 2026)

### What's Built & Working
- **24 Next.js routes** (15 CRM pages + API + manifest + landing + portals)
- **13 tRPC routers:** health, assets, documents, tasks, partners, meetings, search, governance, activity, assetTaskInstances, steps, **dashboard** (NEW)
- **Supabase fully deployed:** 19 tables, 81 governance requirements, 4 views, 5 storage buckets, 3 team members
- **Governance engine CONNECTED:** `assemble_asset_workflow()` creates 53 governance steps per tokenization asset
- **Neumorphic design system:** 10 atomic components, dark + light mode, responsive at 375/768/1440px
- **Pipeline Board:** Kanban + list + **DASHBOARD** view toggle, DnD with confirmation, stats ribbon, path filters, Quick Add
- **Asset Detail:** 8-tab interface, phase timeline, Edit modal, document upload, task create, financial cards
- **INTERACTIVE Governance Tab:** expandable step accordions, Start/Complete/Block/Unblock, task instance checkboxes, progress summary
- **Gates Tab:** 7 gate milestones with phase progress bars, Pass Gate button when ready
- **Templates CRUD:** edit requirement modal, create module modal, module task mapping, coverage matrix
- **Executive Dashboard:** pipeline funnel, value by path, risk indicators, compliance by asset
- **Cross-page links:** partners→detail, activity→asset/partner, compliance→asset, all connected
- **All sidebar pages render:** Pipeline, Assets, Partners, Documents, Tasks, Meetings, Activity, Team, Templates, Compliance, Settings
- **11 test assets** across all phases/paths/types

### What Does NOT Work Yet (Remaining Gaps)
1. **Partner modules table is EMPTY** — no modules configured for any partner
2. **Default tasks table is EMPTY** — no fallback tasks when no partner module assigned
3. **Older assets have ZERO governance steps** — only Lifecycle Test Asset has 53 steps
4. **No comments system** on assets/steps
5. **No document versioning or batch download**
6. **No pagination** on any list
7. **No comments system** on assets/steps
8. **DnD kanban** — confirmation dialog works but actual drag visual may need testing

---

## TO RESUME BUILDING

### Step 1: Read governance documents
```
Read: CLAUDE.md (mandatory pre-flight)
Read: specs/GAP-ANALYSIS.md (82 gaps with severity matrix)
Read: specs/BUILD-LOG.md (build audit trail)
Read: specs/MASTER-BUILD-PLAN.md (phase status)
```

### Step 2: Read the wireframe and specs
```
Read: wireframe-prototype.html (4,990-line interactive reference)
Read: specs/pages/01-pipeline-board.md through specs/pages/11-new-asset-wizard.md
Read: specs/api/assets-router.md
Read: specs/features/quick-add-lead.md
Read: specs/features/search.md
```

### Step 3: Priority work items
1. **Make governance steps interactive** — add completion controls, task instance display, status changes
2. **Build templates CRUD UI** — edit requirements, create modules, map tasks
3. **Executive dashboard** — AUM trend chart, pipeline funnel, compliance trend, risk heatmap (use recharts, already installed)
4. **Cross-page connections** — link everything together
5. **End-to-end lifecycle test** — create asset → complete all steps → advance phases → verify

### Step 4: User's specific requests
- Every template should be editable (task wording, requirements, partner-specific)
- Documents organized at task/step level with upload/download
- DnD kanban needs to work properly
- Partner modules need to connect to live asset lifecycle
- Audit every page/tab/button for missing wiring

---

## KEY FILES

| File | Purpose |
|------|---------|
| `CLAUDE.md` | Governance rules — read before ANY code change |
| `specs/GAP-ANALYSIS.md` | 82 gaps across P0-P3 with severity matrix |
| `specs/BUILD-LOG.md` | What was built and when |
| `specs/MASTER-BUILD-PLAN.md` | Build sequence (8 phases) |
| `specs/ERROR-LOG.md` | Issues and resolutions |
| `wireframe-prototype.html` | Visual reference for all pages |
| `.env.local` | Supabase credentials (NOT in git) |

---

## SUPABASE PROJECT

- **URL:** https://satrlfdnevquvnozhlvn.supabase.co
- **Project Ref:** satrlfdnevquvnozhlvn
- **Credentials:** In `.env.local`
- **Status:** Fully deployed. 19 tables, 81 governance requirements, 4 views, 5 storage buckets.
- **assemble_asset_workflow()** function is deployed and working

---

## DATABASE STATE

- **11 test assets** across all phases and value paths
- **81 governance requirements** (32 shared + 21 tokenization + 15 fractional + 13 debt)
- **53 asset_steps** on the Lifecycle Test Asset (ID: 80695eea-2b03-4cd8-9660-bafb099b9f35)
- **1 partner** (Rialto Markets, broker_dealer)
- **3 team members** (Shane/CEO, David/CTO, Chris/CRO)
- **Path-specific step numbers:** Tokenization=3.T1-4.T21, Fractional=3.F1-4.F15, Debt=3.D1-4.D13

---

## BUILD PHASE STATUS

| Phase | Status | Notes |
|-------|--------|-------|
| 0: Foundation | COMPLETE | Supabase, components, tRPC, CRM shell, PWA |
| 1: Pipeline Board | COMPLETE | Kanban + list + DnD + stats + filters |
| 2: Asset Detail | COMPLETE | 8 tabs, governance shows 53 steps |
| 3: Documents | COMPLETE | Upload, download, lock, delete |
| 4: Tasks + Activity | COMPLETE | Dashboard, create, activity feed |
| 5: Partners + Meetings | COMPLETE | Directory, detail, create |
| 6: Search + Filters | COMPLETE | Cmd+K cross-entity search |
| 7: Templates + Compliance | PARTIAL | Read-only templates, compliance dashboard |
| 8: Polish + Deploy | PARTIAL | Testing done, many gaps remaining |

---

## CRITICAL REMINDERS

1. **Pre-flight check is MANDATORY** — read CLAUDE.md before any code
2. **"asset" not "stone"** — everywhere in code
3. **Platform-agnostic** — no Brickken/Zoniqx commitment
4. **Neumorphic design system** — raised buttons, pressed inputs, CSS variables only
5. **Dark + light mode** — every component must support both
6. **Immutable audit trail** — never write to activity_log from frontend
7. **Test after every step** — `npm run build` must pass
8. **Mobile-first design** — design for 375px first, test at 375px AND 1440px
9. **Validate ALL inputs** — Zod on both client and server
10. **assemble_asset_workflow()** — MUST be called when creating non-evaluating assets
