# Session Handoff — PleoChrome Powerhouse CRM V2

**Last Updated:** 2026-03-30
**Purpose:** Read this FIRST in any new session. Tells you exactly where to pick up.

---

## QUICK START (New Session Protocol)

```
Step 1: READ THIS FILE — know current state
Step 2: READ specs/DIRECTION.md — what to build next with full context
Step 3: READ CLAUDE.md — mandatory code rules
Step 4: READ specs/PROJECT-MAP.md — know where everything is
Step 5: RUN `npm run build` — verify clean state before writing code
Step 6: GO — execute the direction
```

**Architecture specs are in `specs/v2-architecture/`.** Only read specific files when DIRECTION.md tells you to.

---

## CURRENT STATE (Updated 2026-03-31 — Session 2)

### Infrastructure Status

| What | Status |
|------|--------|
| V2 Database | 28 tables + 4 new migrations (subtask types, storage bucket, instantiation fix, RLS fix) |
| tRPC Routers | 23 total (added team router with getCurrentUser + listActive) |
| Supabase Storage | `documents` bucket created with permissive RLS policies |
| Subtask Types | 18 enum values (11 original task types + 7 subtask-specific: call, email, note, research, verification, follow_up, signature) |
| Template Subtasks | All backfilled with semantic types |
| Workflow Instantiation | FIXED — copies subtask_type from templates |
| Build | TypeScript 0 errors, production build clean |
| Console Errors | 0 across all pages |

### Current Phase: **SPRINTS A-D + DOC HARDENING COMPLETE — READY FOR PRODUCTION POLISH**

### What Was Built (Session 2 — March 31)

**Sprint A:** 13 type-specific subtask renderers (Document→upload, Call→log, Meeting→scheduler, Approval→flow, Verification→pass/fail, etc.), subtask-level files + comments, type badge dropdowns replacing dots, success toasts on all mutations.

**Sprint B:** 5 notification triggers (task_assigned, subtask_assigned, document_uploaded, stage_completed, phase_advanced), approval auto-advance to done, stage-level files + comments.

**Sprint C:** Template editor subtask management (add/delete), task reorder arrows, required docs checklist component, batch download with JSZip.

**Document System Hardening:** Preview modal (text/PDF/image inline), document edit/update/rename, documents grouped by stage, partner documents tab, required document types seeded (23 requirements across 11+ stages), 6 Library filters (search, type, asset, uploader, date from/to), version history with Replace button.

**Sprint D:** Overview metadata inline-editable (Origin, Carat Weight, GIA Report, Vault Provider, SPV Name, SPV EIN), currency formatting on value inputs ($commas on blur), activity badge color mappings (30+ action types), empty stage hiding during status filter, loading skeletons on 3 pages.

**Audit Fixes:** 10 missing error toasts added, filter bar layout fixed, lock/unlock cycle verified, click-to-expand on subtask titles.

### What's Next (Remaining Work)
- Mobile 375px viewport testing + touch target sizing
- Keyboard DnD accessibility
- Communication logging on contacts/partners
- Report generation + activity export
- Ownership tree visualization
- Partner onboarding/credentials tab completion
- Fresh E2E test with new asset creation through full lifecycle

### CRITICAL: What Needs To Be Built (Shane's Feedback 2026-03-31)

**The current build is surface-level UI. Types are cosmetic dots, notes don't save visibly, files only work at one level, nothing creates audit records. This CRM manages real assets worth millions — every interaction must be recorded, traceable, and functional.**

#### 1. TYPE-SPECIFIC RENDERERS (Highest Priority)
Each subtask/task type must trigger a SPECIFIC UI and action:
- **Document** → Inline upload zone + version history + notes thread
- **Meeting** → Meeting scheduler/modal + calendar display + invites
- **Approval** → Approval request form showing what needs approval + approve/reject flow
- **Call** → Call log form (who, when, duration, outcome, notes)
- **Email** → Email log (to, subject, body, attachments)
- **Note** → Rich text note with author + timestamp
- **Verification** → Checklist with pass/fail + evidence attachment
- **Signature** → Signature request status + signed document upload
Currently these are just colored dots that change nothing.

#### 2. UNIVERSAL CONVERSATION THREAD
Every entity (stage, task, subtask, document) needs:
- Threaded, timestamped conversation history
- Author attribution (who said what, when)
- @mention support triggering notifications (like Pipedrive)
- File attachments within conversations
- NOT separate "notes" and "comments" — one unified activity/conversation system

#### 3. UNIVERSAL FILE ATTACHMENT
- Files at stage, task, AND subtask level (currently task only)
- Version history (replace a document, keep old versions)
- Notes/conversation on each document
- Version comparison

#### 4. VISIBLE SAVE STATES & AUDIT
- Every mutation shows toast confirmation
- Every saved item shows "saved by X at Y time"
- Reminders show confirmation + history
- All changes create timestamped activity records

#### 5. TYPE SYSTEM UX
- Replace tiny dot buttons with clear dropdown selectors
- The dots are confusing — users don't know what they mean
- Stages and tasks need type selectors too (not just subtasks)
- Each type needs defined paths and structures

#### 6. REMAINING MEDIUM PRIORITY ITEMS
- Overview metadata fields inline-editable
- Currency formatting on value inputs
- Activity badge color mappings
- Empty stage hiding during status filter
- Loading skeletons
- Mobile 375px viewport
- Touch target sizing

### What Was Fixed (March 30-31) — Now Working
- [x] Button click responsiveness (div role=button, stopPropagation)
- [x] DragOverlay added for visual drag feedback
- [x] Error toast handlers on all 16 mutations
- [x] Subtask types created (13 distinct types with colors)
- [x] File upload wired to real Supabase Storage
- [x] Storage RLS fixed for dev mode
- [x] Workflow instantiation function fixed (gate_criteria removed)
- [x] CommunicationsTab registered
- [x] "Value Model" label fixed
- [x] Wizard link in Quick Add modal
- [x] Subtask inline editing, type selector, status cycling
- [x] Per-task files/comments sections (collapsible)
- [x] Task assignment dropdown
- [x] Progress bars on stages
- [x] Search/filter in workflow
- [x] getCurrentUser tRPC procedure

### What MUST Be Read Before Next Session
1. This file (SESSION-HANDOFF.md) — current state
2. `~/.claude/projects/-Users-shanepierson-Projects/memory/pleochrome-feedback-2026-03-31.md` — Shane's detailed feedback
3. `~/.claude/projects/-Users-shanepierson-Projects/memory/pleochrome-session-2026-03-31-state.md` — Complete session state
4. `specs/MASTER-ISSUE-LOG.md` — 30 issues by tier
5. `specs/COMPLETE-FIX-AND-TEST-PLAN.md` — 104 untested elements + execution plan
6. `specs/V2-POWERHOUSE-BLUEPRINT.md` — Original architecture (Section 10-11)
7. CLAUDE.md — Project rules

### Testing Protocol for Next Session
- Delete test data and start fresh
- Create new test asset through wizard
- Test EVERY feature against original V2 spec requirements
- Verify type-specific behavior works (not just cosmetic)
- Verify conversation threads are functional with timestamps
- Verify file upload/download at all levels
- Verify @mentions create notifications
- Use Chrome extension for ALL testing — no API-only tests

---

## SPEC FILE MAP (reorganized 2026-03-31)

All V2 architecture specs moved to `specs/v2-architecture/`. Testing docs in `specs/v2-testing/`.

| File | What | When to Read |
|------|------|-------------|
| `v2-architecture/V2-POWERHOUSE-BLUEPRINT.md` | Schema, routers, pages | Building routers or pages |
| `v2-architecture/V2-BUILD-READINESS-AUDIT.md` | 14 wiring gaps | Connecting features |
| `v2-architecture/V2-FEATURES-AND-WORKFLOWS-ADDENDUM.md` | Meetings, SOPs, reminders | Building those features |
| `v2-architecture/V2-COMPLETE-TASK-DENSITY.md` | 175 tasks, 656 subtasks | Template work |
| `v2-architecture/V2-ARCHITECTURE-RULES.md` | Code standards | Always |
| `v2-testing/V2-GAP-AUDIT-2026-03-31.md` | Spec vs reality gaps | Planning work |
| `v2-testing/MASTER-ISSUE-LOG.md` | 30 categorized issues | Prioritizing |
| `DIRECTION.md` | What to build next | Every session |
| `PROJECT-MAP.md` | Where everything is | When lost |

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
