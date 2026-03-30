# PleoChrome V2 — Features & Workflows Addendum
# Everything We Haven't Thought Of Yet

> Date: 2026-03-30
> Purpose: Think through EVERY way the team uses this app daily, then identify gaps

---

## HOW THE TEAM ACTUALLY USES THIS (Daily Reality Check)

### Shane (CEO) — Daily
1. Opens dashboard → sees pipeline overview, AUM, risk alerts
2. Checks "My Approvals" → approves/rejects pending items
3. Reviews deal committee items → votes on leads
4. Takes calls with holders/partners → logs notes
5. Reviews compliance status → checks KYC expirations
6. Has meetings → pastes AI transcript, reviews action items
7. Makes strategic decisions → logged to audit trail

### David (CTO/Ops) — Daily
1. Opens "My Tasks" → sees what's due today
2. Works through asset stages → completes subtasks, uploads docs
3. Coordinates with appraisers, vault, labs → logs comms
4. Manages document flow → uploads, organizes, verifies
5. Tracks partner deliverables → checks what partners owe us
6. Updates asset progress → marks stages complete
7. Preps for meetings → reviews agenda template

### Chris (CRO) — Daily
1. Manages lead pipeline → qualifies new leads
2. Contacts holders → logs calls, sends follow-ups
3. Tracks investor pipeline (future) → manages relationships
4. Coordinates with BD/counsel → logs comms
5. Prepares marketing materials → attaches to data room
6. Manages meeting schedule → books, preps, follows up
7. Tracks revenue/costs → monitors deal economics

---

## MISSING FEATURES (Things That Will Bite Us If Not Planned)

### 1. MEETING SYSTEM (Enhanced)

**Current spec gap:** The blueprint has a `meeting_notes` table but it's barebones.

**What we actually need:**

```sql
CREATE TABLE meetings (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Basic info
  title             TEXT NOT NULL,
  meeting_type      TEXT NOT NULL,
  -- 'deal_committee', 'holder_call', 'partner_call', 'internal_review',
  -- 'investor_call', 'legal_review', 'appraisal_review', 'closing_call',
  -- 'compliance_review', 'board_meeting', 'ad_hoc'

  -- When
  scheduled_at      TIMESTAMPTZ,
  started_at        TIMESTAMPTZ,
  ended_at          TIMESTAMPTZ,
  duration_minutes  INTEGER,
  location          TEXT,                   -- 'zoom', 'phone', 'in_person', URL

  -- Linked entities
  asset_id          UUID REFERENCES assets(id) ON DELETE SET NULL,
  stage_id          UUID,                   -- Which stage this meeting is for
  task_id           UUID,                   -- Which task this meeting fulfills
  partner_id        UUID REFERENCES partners(id) ON DELETE SET NULL,

  -- Attendees
  internal_attendees UUID[] DEFAULT '{}',   -- team_member IDs
  external_attendees JSONB DEFAULT '[]',    -- [{name, email, company, role}]

  -- Agenda (templated per meeting type)
  agenda_items      JSONB DEFAULT '[]',     -- [{topic, duration_min, presenter, notes}]

  -- AI Transcript (LARGE TEXT — for Otter.ai, Fireflies, etc.)
  transcript        TEXT,                   -- Full AI meeting transcript (can be 10K+ words)
  transcript_source TEXT,                   -- 'otter', 'fireflies', 'manual', 'zoom_ai'

  -- Meeting Notes (structured)
  summary           TEXT,                   -- Executive summary (human-written or AI-generated)
  key_decisions     JSONB DEFAULT '[]',     -- [{decision, rationale, decided_by}]

  -- Action Items (auto-create tasks from these)
  action_items      JSONB DEFAULT '[]',
  -- [{description, assigned_to, due_date, priority, created_task_id}]
  -- When an action item is converted to a task, created_task_id links back

  -- Follow-up
  follow_up_date    DATE,                   -- When to follow up
  follow_up_notes   TEXT,

  -- Documents (presentation, handouts, etc.)
  -- Linked via documents table with meeting_id FK

  -- Status
  status            TEXT NOT NULL DEFAULT 'scheduled',
  -- 'scheduled', 'in_progress', 'completed', 'cancelled', 'rescheduled'

  -- Meta
  created_by        UUID NOT NULL REFERENCES team_members(id),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

**Meeting Agenda Templates per Type:**

| Meeting Type | Default Agenda Items |
|-------------|---------------------|
| deal_committee | Pipeline review, New leads, Deal updates, Risk items, Vote items |
| holder_call | Status update, Document requests, Timeline review, Open questions, Next steps |
| partner_call | Deliverable status, Timeline check, Issues/blockers, Cost review, Action items |
| internal_review | Task progress, Blockers, Priority changes, Resource allocation, Calendar |
| legal_review | Document review, Filing status, Compliance items, Risk assessment, Decisions needed |
| appraisal_review | Report review, Variance analysis, Value discussion, Methodology review |
| closing_call | Final checklist, Outstanding items, Fund flow confirmation, Signing schedule |
| compliance_review | KYC status, Sanctions screening, Document expiry, Risk register, Regulatory updates |

**Key UX:**
- Meeting form has a "Paste Transcript" expandable textarea (no character limit)
- Action items section: each item has "Convert to Task" button → creates task linked to asset/stage
- After meeting is saved, action items show up in the relevant team member's task list
- Meeting history visible on asset detail Activity tab and linked stage/task

### 2. SOP/PLAYBOOK SYSTEM

Every task type should have a standard operating procedure attached. Not enforced, but AVAILABLE as guidance.

```sql
CREATE TABLE sops (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- What this SOP covers
  title           TEXT NOT NULL,
  task_type       v2_task_type,            -- Which task type this applies to
  stage_context   TEXT,                    -- Optional: specific stage this SOP is for
  value_model     v2_value_model,          -- Optional: model-specific SOP

  -- Content
  purpose         TEXT NOT NULL,           -- Why this SOP exists
  steps           JSONB NOT NULL,          -- [{step_number, instruction, notes, estimated_time}]
  tips            TEXT,                    -- Pro tips / common mistakes

  -- Regulatory basis
  regulatory_citation TEXT,
  compliance_notes    TEXT,

  -- Template documents (forms to fill, checklists to follow)
  template_document_ids UUID[] DEFAULT '{}',

  -- Meta
  version         INTEGER NOT NULL DEFAULT 1,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_by      UUID REFERENCES team_members(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

**How it works in the UI:**
- When a team member opens a task, there's a "View SOP" button if one exists for that task type
- SOP slides out as a right panel showing step-by-step instructions
- Team member can follow along and check off steps (not enforced, just guidance)
- Over time, SOPs get refined based on actual experience

**Initial SOPs to seed (from Google Drive `/10 - Standard Operating Procedures/`):**
1. Asset Intake and Screening
2. KYC/KYB Onboarding
3. Appraisal Management
4. Vault Custody
5. Token Issuance
6. Investor Onboarding
7. Sanctions Screening
8. SAR Filing
9. Incident Response
10. Business Continuity
11. Regulatory Filing
12. Secondary Transfer
13. Data Retention
14. Vendor Management
15. Redemption

### 3. REMINDERS & FOLLOW-UPS

```sql
CREATE TABLE reminders (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- What to remind about
  title           TEXT NOT NULL,
  description     TEXT,

  -- Linked to (polymorphic)
  asset_id        UUID REFERENCES assets(id) ON DELETE CASCADE,
  task_id         UUID,
  contact_id      UUID REFERENCES contacts(id) ON DELETE SET NULL,
  partner_id      UUID REFERENCES partners(id) ON DELETE SET NULL,
  meeting_id      UUID,

  -- When
  remind_at       TIMESTAMPTZ NOT NULL,

  -- Who
  remind_user_id  UUID NOT NULL REFERENCES team_members(id),

  -- Status
  status          TEXT NOT NULL DEFAULT 'pending',  -- 'pending', 'sent', 'dismissed', 'snoozed'
  snoozed_until   TIMESTAMPTZ,

  -- Recurrence (optional)
  is_recurring    BOOLEAN NOT NULL DEFAULT false,
  recurrence_rule TEXT,   -- 'daily', 'weekly', 'monthly', 'quarterly', 'annually'

  created_by      UUID NOT NULL REFERENCES team_members(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_reminders_user ON reminders(remind_user_id);
CREATE INDEX idx_reminders_due ON reminders(remind_at) WHERE status = 'pending';
```

**How it works:**
- On any task, subtask, contact, or meeting: "Set Reminder" button
- Choose date/time + optional recurrence
- Shows in notification panel when due
- Dashboard widget: "Upcoming Reminders" (next 7 days)

### 4. DOCUMENT PREVIEW & VERSIONING

**Document preview:** Already referenced but needs explicit design:
- In-browser PDF viewer (use react-pdf or iframe)
- Image viewer with zoom
- For DOC/XLS/PPT: show file info + download button (no in-browser preview)
- Preview modal accessible from any document link

**Document versioning:**
```sql
-- Already in blueprint: documents.parent_document_id
-- The version chain: original → v2 → v3 → ...
-- UI: "Version History" expandable on any document showing the chain
-- Upload new version: "Upload New Version" button on locked documents
-- Old versions are NOT deleted — full history preserved
```

### 5. ASSET ECONOMICS TRACKER

Track the full financial picture per asset:

```sql
-- Already partially in tasks (estimated_amount, actual_amount, payment fields)
-- But we need a summary view

-- The data lives in tasks:
-- payment_outgoing tasks: costs WE pay (legal fees, appraisal fees, filing fees, etc.)
-- payment_incoming tasks: money WE receive (engagement fees, deposits, investor funds)

-- What we need in the UI:
-- Asset Detail → Financials tab shows:
--   Revenue (total payment_incoming tasks marked done)
--   Costs (total payment_outgoing tasks marked done)
--   P&L = Revenue - Costs
--   Breakdown by phase (how much each phase cost)
--   Projected costs (sum of estimated_amount on pending payment tasks)
--   Budget variance (actual vs estimated)
```

No new table needed — this is computed from task data. But the Financials tab UI needs to be designed for this.

### 6. DASHBOARD WIDGETS (Personal Dashboard)

Each team member should see a personalized dashboard. Not just the pipeline overview.

**My Day View:**
| Widget | Data |
|--------|------|
| My Tasks Due Today | Tasks where assigned_to = me AND due_date = today |
| My Overdue Tasks | Tasks where assigned_to = me AND due_date < today AND status != done |
| My Pending Approvals | Approvals where approver = me AND decision = pending |
| Recent Comments on My Tasks | Comments on tasks I'm assigned to, last 24h |
| Upcoming Meetings | Meetings where I'm an attendee, next 7 days |
| Upcoming Reminders | Reminders where remind_user = me, next 7 days |
| Expiring Credentials | Partner credentials expiring in 30 days |
| Expiring KYC | KYC records expiring in 30 days |

**Pipeline View:**
| Widget | Data |
|--------|------|
| Pipeline Funnel | Assets per phase |
| AUM by Model | Value breakdown by value creation model |
| Risk Indicators | Blocked stages, overdue tasks, stale assets |
| Compliance Score | Per-asset compliance % |
| Recent Activity | Last 10 activity log entries |

### 7. QUICK ACTIONS (Accessible from Anywhere)

Floating action button or keyboard shortcuts for common actions:
- `N` — New asset (Quick Add)
- `T` — New task
- `M` — Log meeting
- `C` — Log communication
- `D` — Upload document
- `Cmd+K` — Search (already exists)
- `Cmd+/` — Keyboard shortcut help

### 8. ASSET TIMELINE VIEW

A chronological view of EVERYTHING that happened on an asset:

```
Timeline for "Emerald Barrel #017093"
─────────────────────────────────────

Mar 30, 2026 10:45 AM — Shane created asset (Lead phase)
Mar 30, 2026 10:46 AM — Workflow instantiated (Tokenization template, 36 stages)
Mar 30, 2026 11:00 AM — David started Stage 1.1: Initial Outreach
Mar 30, 2026 11:15 AM — David completed Task: Record lead in CRM
Mar 30, 2026 11:30 AM — David uploaded document: NDA (signed)
Mar 30, 2026 14:00 PM — Meeting: Holder intro call (45 min, transcript attached)
  └── Action item: "Send engagement agreement" → assigned to Chris
Mar 30, 2026 14:30 PM — Chris posted comment on Task 1.2.1: "NDA has non-standard clause"
  └── Shane replied: "Have counsel review before signing"
Mar 30, 2026 15:00 PM — David completed Stage 1.2: Holder Qualification
Mar 31, 2026 09:00 AM — OFAC screening passed (auto-logged)
Apr 1, 2026 10:00 AM — Deal committee approved (2/2 votes)
Apr 1, 2026 10:01 AM — ⚠️ Phase advanced: Lead → Intake (0 warnings)
...
```

This is a **combined view** of: activity_log + comments + documents + meetings + phase changes + approvals. All in one scrollable timeline.

**Implementation:** A tRPC query that unions multiple tables by timestamp, sorted descending. No new table needed — it's a read-only aggregation.

### 9. PRINT/EXPORT SYSTEM

**Asset Project Report (Print):**
- Cover page: asset name, reference code, value model, current phase, key stats
- Ownership section: owner(s), beneficial owners, KYC status
- Phase-by-phase: each stage with tasks, subtasks, completion status, who did what, when
- Document index: all documents with upload date, uploader, task linkage
- Comment log: all comments with timestamps
- Meeting log: all meetings with summaries and action items
- Financial summary: revenue, costs, P&L
- Timeline: full chronological history

**Format:** HTML page with print CSS → Ctrl+P → PDF
**Route:** `/crm/reports/[assetId]` — print-optimized layout

**Batch Document Export:**
- Select asset → "Download All Documents" → ZIP file
- Documents organized in folders: `/Phase/Stage/Task/filename.ext`
- Uses client-side JSZip for small batches, Edge Function for large

**Audit Trail Export:**
- Select date range + asset (optional) → CSV or PDF
- Columns: timestamp, action, entity, detail, performed_by
- SEC/compliance-ready format

### 10. SEARCH & FILTERING (Enhanced)

**Global Search (Cmd+K):**
- Assets (by name, reference code, holder)
- Contacts (by name, email, entity)
- Partners (by name, type)
- Tasks (by title, type)
- Documents (by title, filename)
- Meetings (by title, transcript text)
- Comments (by text content)

**Advanced Filters per page:**
| Page | Filter Options |
|------|---------------|
| Pipeline | Phase, Value Model, Status, Lead, Date Range |
| Assets | Type, Value Range, Phase, Model, Holder, Status |
| Tasks | Assignee, Type, Status, Due Date, Asset, Priority, Stage |
| Documents | Asset, Stage, Task, Type, Locked, Expired, Date |
| Partners | Type, DD Status, Credential Status |
| Contacts | Role, KYC Status, Relationship Status, Type |
| Meetings | Type, Asset, Date Range, Attendee |

### 11. FUTURE FEATURES (Plan But Don't Build Yet)

These should be designed into the schema (fields exist) but UI not built:

| Feature | Schema Support | Build When |
|---------|---------------|------------|
| Calendar integration (Google Calendar) | meetings.scheduled_at, external_attendees | After Google OAuth scope expansion |
| Email integration (send from app) | communication_log, template fields | After Resend/SendGrid integration |
| Investor portal | contacts with role=investor, separate auth | After first offering closes |
| Automated workflows (Zapier/n8n) | tasks.automated type, webhook fields | After core CRM stable |
| AI meeting summary | meetings.transcript → AI → summary | After OpenAI integration |
| Mobile push notifications | notifications table, FCM tokens | After PWA service worker |
| Multi-currency support | assets.currency (already TEXT) | When non-USD assets arise |
| Custom fields | metadata JSONB on all entities | When users request specific fields |
| Recurring task automation | reminders.is_recurring + cron | After Supabase Edge Functions |
| Two-factor approval | approvals with sequential chain | When compliance requires it |

---

## UPDATED TABLE COUNT

| Category | Tables | New in This Addendum |
|----------|--------|---------------------|
| Blueprint (original) | 19 | — |
| Partner & Customer | 3 | — |
| Ownership & KYC | 3 | — |
| **Meetings (enhanced)** | **1** | Replaces barebones meeting_notes |
| **SOPs** | **1** | NEW |
| **Reminders** | **1** | NEW |
| **Total** | **28** | +3 |

---

## CONTEXT PRESERVATION RULES

To ensure the builder doesn't lose context as they progress through phases:

### Rule 1: Spec Files Are the Source of Truth
If there's a conflict between conversation memory and spec files, the spec files win. They are checked into git and versioned.

### Rule 2: Build Log Updated After Every Phase
`specs/BUILD-LOG.md` must be updated after every completed phase with:
- What was built
- What was tested
- What passed/failed
- What was deferred

### Rule 3: Session Handoff Updated After Every Session
`specs/SESSION-HANDOFF.md` must be updated at the end of every session with:
- Current state
- What's working
- What's not working
- Next steps

### Rule 4: Pre-Flight Checklist Before Every Build Phase
Before starting any phase, read:
1. `CLAUDE.md` — project rules
2. `specs/V2-ARCHITECTURE-RULES.md` — code standards
3. `specs/V2-MIGRATION-ADDENDUM.md` — schema additions
4. The specific phase section in `specs/V2-IMPLEMENTATION-PLAN.md`

### Rule 5: Never Skip Testing
Every phase has a testing checklist. Every item must be checked. If a test fails, fix it before moving on. If it requires manual testing by Shane, STOP and ask Shane to test it. Document the test result.

### Rule 6: Git Commit After Every Phase
Atomic commits per phase. Descriptive messages. Push to origin.

---

## COMPLETE SPEC INVENTORY (Final)

| # | File | Lines | Purpose |
|---|------|-------|---------|
| 1 | V2-POWERHOUSE-BLUEPRINT.md | 2,569 | SQL schema, routers, pages |
| 2 | V2-COMPLETE-TASK-DENSITY.md | 2,617 | 175 tasks, 656 subtasks |
| 3 | V2-MIGRATION-ADDENDUM.md | 330 | Fixes all 6 critical gaps |
| 4 | V2-ARCHITECTURE-RULES.md | 380 | Code standards, CSS, testing |
| 5 | V2-IMPLEMENTATION-PLAN.md | 540 | 8-phase build with checklists |
| 6 | V2-UNIFIED-PHASE-MAPPING.md | 361 | 6 phases × 5 models |
| 7 | V2-RETROFIT-ANALYSIS.md | 291 | File-by-file analysis |
| 8 | V2-PARTNER-AND-CUSTOMER-DESIGN.md | 251 | Partner onboarding, credentials |
| 9 | V2-OWNERSHIP-AND-KYC-DESIGN.md | 336 | Entity look-through, KYC |
| 10 | V2-REGULATORY-VALIDATION-REPORT.md | 22 | 48 citations verified |
| 11 | **V2-FEATURES-AND-WORKFLOWS-ADDENDUM.md** | **~400** | **This file — everything we missed** |
| 12 | DEBT-INSTRUMENT-WORKFLOW-COMPLETE.md | 796 | Debt/Broker/Barter spec |
| — | **Total** | **~8,900** | Complete V2 architecture |
