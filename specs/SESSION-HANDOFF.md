# Session Handoff — PleoChrome Powerhouse CRM V2

**Last Updated:** 2026-03-30
**Purpose:** Read this FIRST in any new session. Tells you exactly where to pick up.

---

## QUICK START (New Session Protocol)

```
Step 1: READ THIS FILE — know what phase you're on
Step 2: READ specs/V2-MASTER-BUILD-PLAN.md — find your phase, read its section
Step 3: READ specs/V2-ARCHITECTURE-RULES.md — code standards
Step 4: READ CLAUDE.md — mandatory pre-flight
Step 5: READ the specific spec files listed under your phase (below)
Step 6: RUN `npm run build` — verify clean state before writing code
Step 7: GO — execute the phase
```

**DO NOT re-read all 14 spec files.** Only read what your current phase needs.

---

## CURRENT STATE

### V2 Architecture: DESIGN COMPLETE, BUILD NOT STARTED

All seed data wiped. Only team_members remain (3 rows). V1 UI still exists but queries return empty.

| What | Status |
|------|--------|
| V2 Spec documents | 14 files, ~10,000 lines, ALL committed |
| V2 Database migration | NOT YET WRITTEN (spec complete) |
| V2 tRPC routers | NOT YET WRITTEN (spec complete) |
| V2 UI pages | NOT YET WRITTEN (spec complete) |
| V1 code | Still in place (will be overwritten phase-by-phase) |
| Database | EMPTY except team_members. RLS disabled. V1 tables still exist (will be dropped in Phase 1) |

### Current Phase: **PHASE 0 — STARTING NOW**
### Next Action: Execute Phase 0 from V2-MASTER-BUILD-PLAN.md, then immediately proceed to Phase 1

---

## PHASE → SPEC FILE MAP

When you start a phase, read ONLY the specs listed for that phase:

| Phase | Specs to Read |
|-------|--------------|
| **0: Design System** | V2-ARCHITECTURE-RULES.md (Section 3-4) |
| **1: Database** | V2-POWERHOUSE-BLUEPRINT.md (Sections 2-8), V2-MIGRATION-ADDENDUM.md (ALL), V2-COMPLETE-TASK-DENSITY.md (for template seeding) |
| **2: Core Routers** | V2-POWERHOUSE-BLUEPRINT.md (Section 10.1-10.4), V2-BUILD-READINESS-AUDIT.md (Gap 1: task/subtask wiring) |
| **3: Supporting Routers** | V2-POWERHOUSE-BLUEPRINT.md (Section 10.5-10.8), V2-BUILD-READINESS-AUDIT.md (Gaps 2-4: comments, approvals, notifications) |
| **4: All Other Routers** | V2-BUILD-READINESS-AUDIT.md (Gaps 5-11), V2-PARTNER-AND-CUSTOMER-DESIGN.md, V2-OWNERSHIP-AND-KYC-DESIGN.md, V2-FEATURES-AND-WORKFLOWS-ADDENDUM.md |
| **5: Pipeline + Asset Detail** | V2-POWERHOUSE-BLUEPRINT.md (Section 11), V2-UNIFIED-PHASE-MAPPING.md, V2-BUILD-READINESS-AUDIT.md (Gap 12-13) |
| **6: Remaining Pages** | V2-POWERHOUSE-BLUEPRINT.md (Section 11), V2-BUILD-READINESS-AUDIT.md (all gaps) |
| **7: Polish + PWA** | V2-FEATURES-AND-WORKFLOWS-ADDENDUM.md (SOPs, reminders, notifications) |
| **8: E2E Test** | V2-MASTER-BUILD-PLAN.md (Phase 8 section) |

---

## SUPABASE

- **URL:** https://satrlfdnevquvnozhlvn.supabase.co
- **Project Ref:** satrlfdnevquvnozhlvn
- **Credentials:** In `.env.local`
- **Current state:** V1 tables exist but ALL DATA WIPED (except team_members). RLS disabled.
- **Team members:** Shane/CEO, David/CTO, Chris/CRO (3 rows)

---

## STACK

- Next.js 16 + React 19 + TypeScript strict + Tailwind v4
- tRPC (fetch adapter, NOT @trpc/next) + TanStack Query v5
- Supabase (PostgreSQL + Auth + Storage + Realtime)
- @dnd-kit for drag-and-drop
- recharts for charts (already installed)
- jszip + file-saver for batch downloads (already installed)
- Serwist for PWA (currently disabled for Turbopack)

---

## V2 ARCHITECTURE SUMMARY (Don't re-read specs — this is the cheat sheet)

**6 Phases:** Lead → Intake → Asset Maturity → Security → Value Creation → Distribution

**5 Value Models:** Tokenization, Fractional Securities, Debt Instrument, Broker Sale, Barter

**Hierarchy:** Phase → Stage → Task → Subtask → (Comments + Documents)

**28 Tables:** assets, asset_stages, tasks, subtasks, documents, comments, approvals, notifications, activity_log, workflow_templates, template_stages, template_tasks, template_subtasks, partners, partner_onboarding_items, partner_credentials, contacts, ownership_links, asset_owners, kyc_records, communication_log, meetings, sops, reminders, asset_partners, gate_checks, meeting_notes, team_members

**11 Task Types:** document_upload, meeting, physical_action, payment_outgoing, payment_incoming, approval, review, due_diligence, filing, communication, automated

**Key Features:** Drag-and-drop reorder (stages + tasks), hide/unhide (stages + tasks + subtasks), soft/advisory gates, save-as-template, partner auto-linking, ownership hierarchy with KYC, comment threads with @mentions, multi-level approvals, notification system, meeting transcripts, SOPs, reminders, batch document download, printable reports

**Gates are ADVISORY** — warnings displayed, user can always "Proceed Anyway", override logged.

---

## CRITICAL RULES (Always Follow)

1. `npm run build` after EVERY file change — zero errors
2. Neumorphic design system — CSS variables only, no hardcoded colors
3. Dark + light mode — every component
4. Mobile-first — test at 375px after every UI change
5. "asset" not "stone" — everywhere
6. File size limits — 300 max for pages, 250 for components
7. No inline components in pages — extract to components/crm/
8. Shared NeuModal for all modals
9. constants.ts for all phase/status/task-type labels and colors
10. Activity log is IMMUTABLE — never write from frontend
11. Tailwind v4: use `var()` explicitly — `w-[var(--x)]` not `w-[--x]`

---

## GIT STATE

- **Branch:** main
- **Remote:** origin (Shanostylelol/pleochrome)
- **Last commit:** V2 MASTER BUILD PLAN
- **All spec files committed and pushed**

---

## SPEC FILE INVENTORY (14 files, ~10,000 lines)

| # | File | Lines | What |
|---|------|-------|------|
| 1 | V2-MASTER-BUILD-PLAN.md | 458 | THE build sequence — 9 phases with tests |
| 2 | V2-POWERHOUSE-BLUEPRINT.md | 2,569 | SQL schema, routers, pages |
| 3 | V2-COMPLETE-TASK-DENSITY.md | 2,617 | 175 tasks, 656 subtasks for template seeding |
| 4 | V2-MIGRATION-ADDENDUM.md | 330 | Schema fixes (enums, columns, 6 extra tables) |
| 5 | V2-ARCHITECTURE-RULES.md | 380 | Code standards, CSS rules, testing rules |
| 6 | V2-BUILD-READINESS-AUDIT.md | 607 | Wiring details for 14 features |
| 7 | V2-UNIFIED-PHASE-MAPPING.md | 361 | 6 phases × 5 models = all stages |
| 8 | V2-RETROFIT-ANALYSIS.md | 291 | File-by-file KEEP/REWRITE/DELETE |
| 9 | V2-PARTNER-AND-CUSTOMER-DESIGN.md | 251 | Partner onboarding, credentials, comms |
| 10 | V2-OWNERSHIP-AND-KYC-DESIGN.md | 336 | Entity look-through, KYC records |
| 11 | V2-FEATURES-AND-WORKFLOWS-ADDENDUM.md | 468 | Meetings, SOPs, reminders, timeline, exports |
| 12 | V2-REGULATORY-VALIDATION-REPORT.md | 22 | 48 citations verified, 0 fabricated |
| 13 | DEBT-INSTRUMENT-WORKFLOW-COMPLETE.md | 796 | Debt/Broker/Barter full spec |
| 14 | BUILD-LOG.md | ~350 | Build audit trail (update after every phase) |
