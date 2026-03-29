# PleoChrome Powerhouse CRM — Comprehensive Feature Map

**Version:** 1.0
**Date:** 2026-03-27
**Classification:** Build Blueprint — Feature Inventory & Prioritization
**Authors:** Shane Pierson (CEO), Claude Opus 4.6 (Architecture)
**Prerequisite Documents:**
- `POWERHOUSE-CRM-WIREFRAME-SPEC.md` (UI/UX wireframes)
- `POWERHOUSE-CRM-SCHEMA-DESIGN.md` (database schema)
- `DECISION-AUDIT-LOG.md` (strategic decisions)
- `CLAUDE.md` (architecture rules)

---

## HOW TO READ THIS DOCUMENT

Every feature is evaluated from **three perspectives:**
1. **USER** — Shane, David, Chris managing 1-5 assets daily. Does this save them time? Reduce errors? Prevent missed deadlines?
2. **DEVELOPER** — What's needed to build this correctly? Database schema, API endpoints, component architecture.
3. **INVESTOR** — What would an institutional investor, SEC examiner, or auditor need to see? Does this prove diligence?

**Priority Levels:**
- **P0** = MVP must-have. Cannot launch without it.
- **P1** = Launch week. Ship within 7 days of MVP.
- **P2** = Month 1. First 30 days post-launch.
- **P3** = Quarter 1. First 90 days.
- **P4** = Future. Nice-to-have, defer explicitly.

**Complexity:**
- **Simple** = 1-2 days, single component, no new tables
- **Medium** = 3-5 days, multiple components, may need schema changes
- **Complex** = 1-2 weeks, new subsystem, multiple tables, real-time considerations

**Overkill Flag:**
- Features marked with `[OVERKILL]` are designed for 50+ person teams or enterprise scale. Explicitly deferred for a 3-person team managing 1-5 assets, with notes on when they become relevant.

---

## TABLE OF CONTENTS

- [A. Commenting & Notes](#a-commenting--notes)
- [B. Task Management](#b-task-management)
- [C. Notifications & Alerts](#c-notifications--alerts)
- [D. Approval Workflows](#d-approval-workflows)
- [E. Document Management](#e-document-management)
- [F. Activity & Audit Trail](#f-activity--audit-trail)
- [G. Reporting & Analytics](#g-reporting--analytics)
- [H. Search & Navigation](#h-search--navigation)
- [I. Integrations](#i-integrations)
- [J. User Management & Security](#j-user-management--security)
- [K. Investor-Facing Features](#k-investor-facing-features)
- [L. Asset-Specific Features](#l-asset-specific-features)
- [M. What We're Missing](#m-what-were-missing)
- [N. Simplicity Guardrails](#n-simplicity-guardrails)

---

## A. COMMENTING & NOTES

### A.1 — Threaded Comments on Entities
- **What it does:** Users can post comments on assets, governance steps, partners, and documents. Comments support nested replies (one level deep) creating conversation threads.
- **Who needs it:** All. USER: daily coordination between Shane/David/Chris on specific steps. DEVELOPER: polymorphic comment model via `entity_type` + `entity_id`. INVESTOR: demonstrates collaborative decision-making trail.
- **Priority:** P0
- **Complexity:** Medium
- **Database requirement:** `comments` table already designed — `entity_type` (enum: asset, step, partner, document, meeting), `entity_id` (uuid), `parent_comment_id` (uuid, nullable for replies), `author_id`, `body`, `created_at`. Index on `(entity_type, entity_id, created_at)` and `(parent_comment_id)`.
- **Already in wireframe?** Yes — Governance step detail has "Notes" section with threaded comments, @mentions, and reply buttons.

### A.2 — @Mentions (Tag a Team Member)
- **What it does:** Type `@` followed by a name to tag a team member in a comment. Tagged users receive a notification. Mentioned names render as linked chips.
- **Who needs it:** USER: "Hey @Chris, can you review this appraisal?" without leaving context. DEVELOPER: needs typeahead search against `team_members`, notification trigger on mention parse.
- **Priority:** P0
- **Complexity:** Medium — requires mention parsing regex, typeahead dropdown component, notification integration.
- **Database requirement:** `comment_mentions` junction table (comment_id, mentioned_user_id) OR parse mentions from comment body at render time. Recommendation: store mentions explicitly for reliable notification delivery and searchability.
- **Already in wireframe?** Yes — mentioned in governance step comments section: "Supports @mentions (triggers search for team member names)."

### A.3 — Rich Text vs Plain Text
- **What it does:** Comments support basic formatting — bold, italic, bulleted lists, links. NOT a full WYSIWYG editor.
- **Who needs it:** USER: occasionally needs to paste a link or emphasize a point. DEVELOPER: use a lightweight markdown renderer (react-markdown) rather than a full rich text editor (TipTap/ProseMirror) to keep bundle size down.
- **Priority:** P1
- **Complexity:** Simple — store as markdown, render with react-markdown. Input is a plain textarea with optional formatting toolbar (bold/italic/link buttons).
- **Database requirement:** `comments.body` is already TEXT. Store raw markdown. No schema change.
- **Already in wireframe?** Partial — wireframe shows text areas but doesn't specify formatting. Meeting summaries mention "rich text editor."

### A.4 — Comment Editing and Deletion
- **What it does:** Authors can edit their own comments within a time window (e.g., 15 minutes). Edited comments show "(edited)" badge. Comments can be soft-deleted (body replaced with "[deleted]", preserved in database for audit). No hard delete.
- **Who needs it:** USER: fix typos, update information. INVESTOR: audit trail integrity preserved — edits are logged, original preserved, no true deletion.
- **Priority:** P1
- **Complexity:** Simple
- **Database requirement:** Add `edited_at` (timestamp, nullable), `is_deleted` (boolean, default false), `original_body` (text, nullable — stores pre-edit body). Activity log trigger on comment edit/delete.
- **Already in wireframe?** No — wireframe shows comments but does not address edit/delete behavior.
- **Design decision needed:** Should comments on governance steps be fully immutable (no edit, no delete) for compliance? Recommendation: governance step comments are immutable after 15 minutes. General asset comments allow soft-delete.

### A.5 — Private Notes (Visible Only to Author)
- **What it does:** A user can write a private note on any entity that only they can see. Useful for personal reminders, sensitive observations, or draft thoughts before sharing.
- **Who needs it:** USER: Shane might note "Kandi seems evasive on provenance — push harder next call" without David seeing it.
- **Priority:** P2
- **Complexity:** Simple
- **Database requirement:** Add `is_private` boolean to `comments` table. RLS policy: private comments visible only to `author_id = auth.uid()`.
- **Already in wireframe?** No
- **`[OVERKILL]` at current stage?** Borderline. With 3 people, private notes are less critical since most communication is open. But for sensitive partner evaluations (Kandi provenance issues), this has real value. Keep at P2.

### A.6 — Comment Notifications
- **What it does:** When a comment is posted on an entity you're assigned to, or when you're @mentioned, you receive an in-app notification and optionally an email.
- **Who needs it:** All. USER: know when teammates comment without constantly checking. DEVELOPER: trigger off comment insert. INVESTOR: proves responsive collaboration.
- **Priority:** P0 (tied to A.1 and C.1)
- **Complexity:** Medium — part of the broader notification system (Section C).
- **Database requirement:** Insert into `notifications` table on comment creation. Fields: `user_id`, `type` ('comment'), `title`, `body`, `entity_type`, `entity_id`, `read` (boolean).
- **Already in wireframe?** Yes — notification center shows comment-related notifications.

### A.7 — Comment Search
- **What it does:** Search across all comments by keyword, author, date range, or entity.
- **Who needs it:** USER: "What did Chris say about the Rialto pricing?" INVESTOR: locate specific discussions during audit.
- **Priority:** P2
- **Complexity:** Medium — requires full-text search index on `comments.body`.
- **Database requirement:** Add GIN index on `comments.body` using `to_tsvector('english', body)`. Expose via tRPC search endpoint.
- **Already in wireframe?** Partial — global search (Cmd+K) mentions searching tasks and documents but doesn't explicitly mention comments.

### A.8 — Inline Document Annotations
- **What it does:** Users can add comments/annotations directly on specific pages or sections of uploaded documents (PDFs, images).
- **Who needs it:** USER: "Page 3 of the PPM has an error in the fee schedule." INVESTOR: shows document review rigor.
- **Priority:** P4 (Future)
- **Complexity:** Complex — requires PDF viewer with annotation layer, coordinate-based comment positioning, separate annotation data model.
- **Database requirement:** New `document_annotations` table: `document_id`, `page_number`, `x_position`, `y_position`, `body`, `author_id`, `created_at`.
- **Already in wireframe?** No
- **`[OVERKILL]` at current stage?** Yes. With 3 people reviewing documents, a verbal "check page 3" in a comment is sufficient. Defer until 10+ people or external reviewer access.

---

## B. TASK MANAGEMENT

### B.1 — Task Creation (Manual)
- **What it does:** Users can create tasks manually, assigning them to a governance step, asset, team member, with title, description, type, priority, and due date.
- **Who needs it:** USER: ad-hoc tasks not covered by governance templates. DEVELOPER: task creation modal with form validation.
- **Priority:** P0
- **Complexity:** Simple
- **Database requirement:** `tasks` table already designed — `title`, `description`, `asset_id`, `step_id`, `assigned_to`, `priority`, `due_date`, `status`, `type`.
- **Already in wireframe?** Yes — Task Creation Modal specified with all fields.

### B.2 — Task Auto-Generation from Governance
- **What it does:** When an asset is created via the New Asset Wizard, the system automatically generates task instances from governance templates and partner modules. The `assemble_asset_workflow()` function creates all tasks mapped to governance steps.
- **Who needs it:** All. USER: don't have to manually create 40+ tasks per asset. DEVELOPER: database function + trigger. INVESTOR: proves every regulatory requirement is systematically tracked.
- **Priority:** P0
- **Complexity:** Complex — requires the full template-to-instance pipeline: governance_requirements -> module_tasks -> asset_task_instances.
- **Database requirement:** `governance_requirements`, `partner_modules`, `module_tasks`, `asset_task_instances` tables (from `002_modular_governance_schema.sql`). Function: `assemble_asset_workflow(asset_id, value_path, partner_assignments)`.
- **Already in wireframe?** Yes — New Asset Wizard Step 5 shows "This will create: X governance steps, X default tasks."

### B.3 — Task Assignment and Reassignment
- **What it does:** Tasks can be assigned to any active team member. Reassignment logs the change in activity trail and notifies both old and new assignee.
- **Who needs it:** USER: "David, take over the Rialto follow-up." DEVELOPER: simple `assigned_to` update + notification trigger.
- **Priority:** P0
- **Complexity:** Simple
- **Database requirement:** `tasks.assigned_to` (uuid, FK to team_members). Update trigger fires activity_log insert.
- **Already in wireframe?** Yes — assignee picker on every task row, quick-action "Reassign" button.

### B.4 — Due Dates with Reminders
- **What it does:** Every task has an optional due date. System sends reminders at configurable intervals (default: 3 days before, 1 day before, day of). Overdue tasks get escalating visual indicators.
- **Who needs it:** USER: don't miss the Form D 15-day filing deadline. INVESTOR: proves deadline awareness.
- **Priority:** P0
- **Complexity:** Medium — requires a scheduled job (Supabase Edge Function on cron) to check upcoming/overdue tasks daily and generate notifications.
- **Database requirement:** `tasks.due_date` already exists. Need a `task_reminders` config or use notification preferences. Cron function: `check_task_deadlines()` runs daily.
- **Already in wireframe?** Yes — due dates shown on every task row with color-coded urgency (amber = today, ruby = overdue).

### B.5 — Priority Levels
- **What it does:** Tasks have four priority levels: Urgent, High, Medium, Low. Visual indicators (colored dots) and sorting by priority.
- **Who needs it:** USER: distinguish "call GIA today" from "update meeting notes when you get to it."
- **Priority:** P0
- **Complexity:** Simple
- **Database requirement:** `tasks.priority` enum already designed: urgent, high, medium, low.
- **Already in wireframe?** Yes — priority dots, filter by priority, sort by priority.

### B.6 — Task Dependencies
- **What it does:** Task B can be marked as dependent on Task A. Task B cannot be started/completed until Task A is done. Visualized as a warning badge: "Blocked by: [Task A title]".
- **Who needs it:** USER: "Can't file Form D until PPM is finalized." DEVELOPER: dependency validation on status change.
- **Priority:** P1
- **Complexity:** Medium
- **Database requirement:** `tasks.depends_on` (uuid[], array of task IDs) — mirrors the `asset_steps.depends_on` pattern already in schema. Add check constraint: cannot set status = 'complete' if any dependency is not complete.
- **Already in wireframe?** Partial — `asset_steps` has dependencies, but task-level dependencies are not explicitly shown.

### B.7 — Recurring Tasks
- **What it does:** Create tasks that automatically regenerate on a schedule — monthly compliance checks, quarterly OFAC re-screening, annual insurance renewal reminders.
- **Who needs it:** USER: "Every quarter, re-screen all holders against OFAC/PEP lists." INVESTOR: proves ongoing compliance vigilance.
- **Priority:** P1
- **Complexity:** Medium — needs a `task_recurrence` model and a cron job to generate instances.
- **Database requirement:** New: `task_templates_recurring` table — `title`, `description`, `recurrence_rule` (e.g., "FREQ=MONTHLY;INTERVAL=3"), `asset_id` (nullable for global), `assigned_to`, `priority`. Cron function: `generate_recurring_tasks()`.
- **Already in wireframe?** No — compliance dashboard shows upcoming items but doesn't specify recurrence mechanism.

### B.8 — Task Templates (Reusable Checklists)
- **What it does:** Pre-defined task sets that can be applied to any governance step. E.g., "Appraisal Process Checklist" with 5 standard tasks. Templates are the partner modules from the Template Layer.
- **Who needs it:** USER: consistency across assets. DEVELOPER: already part of the 3-layer governance model.
- **Priority:** P0 (part of governance template system)
- **Complexity:** Already designed in the modular governance schema.
- **Database requirement:** `module_tasks` table already designed.
- **Already in wireframe?** Yes — Governance Templates page (Page 11) covers both governance requirements and partner modules.

### B.9 — Subtasks (Nested Tasks)
- **What it does:** A task can have child subtasks. Parent task shows completion as "3/5 subtasks done." Parent cannot be completed until all subtasks are done.
- **Who needs it:** USER: break "Complete 3 appraisals" into individual appraiser subtasks.
- **Priority:** P2
- **Complexity:** Medium
- **Database requirement:** `tasks.parent_task_id` (uuid, nullable, self-referencing FK). Query: child tasks where parent_task_id = X.
- **Already in wireframe?** No — tasks are flat in the wireframe. Steps contain tasks, but tasks don't contain sub-tasks.
- **`[OVERKILL]` at current stage?** Borderline. The governance step -> task hierarchy already provides one level of nesting. Adding subtasks creates a third level (step -> task -> subtask). With 3 people, this may over-complicate. Keep at P2 and evaluate after first 2 assets.

### B.10 — Time Tracking per Task
- **What it does:** Optional time log per task — "Started at X, completed at Y, total: Z hours."
- **Who needs it:** Marginal. Could help with cost allocation per asset.
- **Priority:** P4 (Future)
- **Complexity:** Simple
- **Database requirement:** `task_time_entries` table: `task_id`, `user_id`, `started_at`, `ended_at`, `duration_minutes`.
- **Already in wireframe?** No
- **`[OVERKILL]` at current stage?** Yes. Three people don't need time tracking on individual tasks. Defer until headcount > 5 or billing becomes per-hour.

### B.11 — Task Completion Evidence
- **What it does:** When completing a task, optionally link a document or URL as evidence of completion. E.g., completing "File Form D" links to the EDGAR confirmation page.
- **Who needs it:** USER: prove the task was actually done, not just checked off. INVESTOR: evidence chain for every completed step.
- **Priority:** P1
- **Complexity:** Simple
- **Database requirement:** `tasks.evidence_document_id` (uuid, FK to documents, nullable), `tasks.evidence_url` (text, nullable), `tasks.completed_by` (uuid), `tasks.completed_at` (timestamp).
- **Already in wireframe?** Partial — task expanded view mentions "Evidence/link: linked URL if any" and "Completion info."

### B.12 — Bulk Task Operations
- **What it does:** Select multiple tasks and apply bulk actions: reassign, change priority, change due date, mark complete.
- **Who needs it:** USER: after a partner swap, reassign all new tasks at once.
- **Priority:** P2
- **Complexity:** Simple
- **Database requirement:** No schema change. tRPC batch mutation endpoint.
- **Already in wireframe?** No — wireframe shows individual task actions only.
- **`[OVERKILL]` at current stage?** With 1-5 assets generating ~40 tasks each (200 max), bulk operations have mild value. Keep at P2.

---

## C. NOTIFICATIONS & ALERTS

### C.1 — In-App Notification Center
- **What it does:** Slide-in panel from the right showing all notifications grouped by time (Today, Yesterday, Earlier). Unread count badge on bell icon. Click a notification to navigate to the relevant entity.
- **Who needs it:** All. USER: see what happened while away. DEVELOPER: real-time subscription via Supabase Realtime.
- **Priority:** P0
- **Complexity:** Medium
- **Database requirement:** `notifications` table already designed — `user_id`, `type`, `title`, `body`, `entity_type`, `entity_id`, `read`, `created_at`. Supabase Realtime subscription on `notifications` where `user_id = auth.uid()`.
- **Already in wireframe?** Yes — full Notification Center spec in Global Overlays section.

### C.2 — Email Notifications
- **What it does:** Configurable email notifications for critical events. Uses Resend (or Supabase email) for delivery. Events that trigger email: task assigned, task overdue, gate ready, approval requested, insurance expiry warning, KYC expiry warning.
- **Who needs it:** USER: catch critical items even when not in the app. DEVELOPER: email template system + Resend integration.
- **Priority:** P1
- **Complexity:** Medium — requires email templates, Resend integration, preference-respecting send logic.
- **Database requirement:** User preferences stored in `team_members.notification_preferences` (JSONB) or a separate `notification_preferences` table.
- **Already in wireframe?** Yes — Settings > Notifications page shows per-event-type email toggles.

### C.3 — Notification Preferences (Per-User, Per-Event-Type)
- **What it does:** Each user configures which events generate in-app and/or email notifications. Granular control per event type.
- **Who needs it:** USER: Shane wants email on gate readiness, Chris doesn't. DEVELOPER: preference lookup before every notification dispatch.
- **Priority:** P1
- **Complexity:** Medium
- **Database requirement:** `notification_preferences` table: `user_id`, `event_type` (enum), `in_app` (boolean), `email` (boolean). Default: all in-app ON, email ON for critical only.
- **Already in wireframe?** Yes — Settings > Notifications shows the full preference matrix.

### C.4 — Digest Mode (Daily Summary vs Real-Time)
- **What it does:** Users can opt for a daily digest email instead of individual notification emails. Digest sent at configurable time (default: 8 AM local).
- **Who needs it:** USER: reduce email noise while staying informed.
- **Priority:** P2
- **Complexity:** Medium — requires batching logic in the email cron job.
- **Database requirement:** Add `digest_mode` (boolean) and `digest_time` (time) to notification preferences.
- **Already in wireframe?** No
- **`[OVERKILL]` at current stage?** Yes for 3 people. They'll get maybe 5-10 emails/day max. Defer.

### C.5 — Escalation (Overdue Task Auto-Escalation)
- **What it does:** If a task is overdue by X days (configurable, default: 3), automatically escalate by notifying the task owner's manager or all team leads. Second escalation at 7 days.
- **Who needs it:** USER: catch things that slip. INVESTOR: proves nothing sits unaddressed.
- **Priority:** P2
- **Complexity:** Medium — requires escalation rules engine in the daily cron job.
- **Database requirement:** `escalation_rules` table or config: `days_overdue_threshold`, `escalation_target` (role or user_id), `level` (1, 2). Or simpler: hardcode 3-day and 7-day escalation in the cron function.
- **Already in wireframe?** No
- **`[OVERKILL]` at current stage?** Borderline. With 3 people, a Slack message works. But for compliance optics (investor perspective), automated escalation proves governance rigor. Keep at P2.

### C.6 — Gate Readiness Notifications
- **What it does:** When all conditions for a gate check are met, automatically notify all team members that the gate is ready for review and passage.
- **Who needs it:** All. USER: know the moment an asset can advance. INVESTOR: proves timely pipeline progression.
- **Priority:** P0
- **Complexity:** Simple — trigger when gate_check conditions evaluate to all-pass.
- **Database requirement:** Uses existing `notifications` table. Trigger: `evaluate_gate_conditions()` function runs on step completion, document upload, approval grant.
- **Already in wireframe?** Yes — gate passage flow describes notifications sent to team.

### C.7 — Insurance/Document Expiry Warnings
- **What it does:** System monitors expiry dates on insurance certificates, KYC verifications, appraisals, and other time-sensitive documents. Sends warnings at 90, 60, 30, 14, and 7 days before expiry. Critical alert on expiry day.
- **Who needs it:** All. USER: never let insurance lapse. INVESTOR: proves continuous coverage and compliance.
- **Priority:** P0
- **Complexity:** Medium — daily cron job scans `documents` and `assets.metadata` for expiry dates.
- **Database requirement:** Expiry dates stored in `assets.metadata` JSONB (custody.insurance_expires, holder.kyc_verified_date + 1 year, etc.) and/or dedicated `compliance_deadlines` table for explicit tracking. Cron: `check_compliance_deadlines()`.
- **Already in wireframe?** Yes — Compliance Dashboard shows critical/warning/upcoming items with expiry tracking.

### C.8 — Compliance Deadline Alerts
- **What it does:** Alerts for regulatory filing deadlines — Form D 15-day window, Blue Sky notice deadlines, annual report due dates, quarterly investor reporting deadlines.
- **Who needs it:** All. USER: miss a Form D deadline = SEC violation. INVESTOR: proves regulatory awareness.
- **Priority:** P0
- **Complexity:** Medium — part of the compliance monitoring cron system.
- **Database requirement:** `compliance_deadlines` table: `asset_id`, `deadline_type` (enum), `deadline_date`, `status` (open/acknowledged/resolved), `assigned_to`, `notes`. Or encode in governance step metadata.
- **Already in wireframe?** Yes — Compliance Dashboard and Calendar.

### C.9 — Partner Response Tracking
- **What it does:** Track when a partner was last contacted and flag if they haven't responded in X days (configurable, default: 5 business days). Shows "Awaiting response: 8 days" warning on partner record.
- **Who needs it:** USER: "Bull Blockchain hasn't replied in 5 days — follow up." INVESTOR: proves active partner management.
- **Priority:** P2
- **Complexity:** Medium
- **Database requirement:** `partners.last_contact_date` (timestamp), `partners.response_pending_since` (timestamp, nullable). Or track via meeting_notes/activity_log last entry per partner.
- **Already in wireframe?** Partial — partner cards show "Last contact: Mar 15" but no explicit response tracking or alerts.

### C.10 — Push Notifications (Mobile)
- **What it does:** Push notifications to mobile devices for critical alerts.
- **Who needs it:** USER: get insurance expiry alerts even when away from desk.
- **Priority:** P4 (Future — requires mobile app)
- **Complexity:** Complex
- **Database requirement:** `push_subscriptions` table: `user_id`, `device_token`, `platform` (ios/android/web).
- **Already in wireframe?** No
- **`[OVERKILL]` at current stage?** Yes. No mobile app planned for MVP. Email + in-app covers the 3-person team.

---

## D. APPROVAL WORKFLOWS

### D.1 — Step-Level Approvals
- **What it does:** Governance steps can require approval from a designated role (e.g., CRO must approve appraisal step, counsel must approve PPM draft). Approver reviews completed tasks and documents, then approves or requests changes.
- **Who needs it:** All. USER: formal sign-off prevents premature progression. INVESTOR: proves multi-person review of critical steps.
- **Priority:** P0
- **Complexity:** Medium
- **Database requirement:** `governance_requirements.required_approvals` (JSONB array of `{role, approval_type}`). Instance: `asset_step_approvals` table: `step_instance_id`, `approver_id`, `status` (pending/approved/rejected), `notes`, `decided_at`. Activity log on every approval action.
- **Already in wireframe?** Yes — full approval workflow (Flow 1) with approve/request-changes buttons, approval status display, and notification flow.

### D.2 — Gate Passage Approvals
- **What it does:** Gate passage requires all conditions met AND explicit approval from an authorized team member (CEO, CTO, or Compliance Officer). Confirmation dialog with permanent record.
- **Who needs it:** All. USER: formal milestone acknowledgment. INVESTOR: proves deliberate phase advancement.
- **Priority:** P0
- **Complexity:** Medium — part of the gate check system.
- **Database requirement:** `gate_checks` table already designed — `checked_by`, `checked_at`, `conditions` (JSONB), `notes`, `result` (passed/failed). Immutable once created.
- **Already in wireframe?** Yes — Gate Passage flow (Flow 2) fully specified with confirmation dialog and permanent record.

### D.3 — Document Review Approvals
- **What it does:** Certain documents (PPM, legal opinions, compliance certifications) require explicit review and approval by designated roles before being considered "accepted."
- **Who needs it:** USER: ensure counsel has reviewed the PPM before it goes to investors. INVESTOR: proves legal review of critical documents.
- **Priority:** P1
- **Complexity:** Medium
- **Database requirement:** `document_reviews` table: `document_id`, `reviewer_id`, `status` (pending/approved/rejected/revision_requested), `notes`, `reviewed_at`. Or use the step-level approval system since documents are tied to governance steps.
- **Already in wireframe?** Partial — approvals are shown at the step level, not at the individual document level. Recommendation: leverage step approvals for document review (the step "Draft PPM" includes the PPM document; approving the step approves the document).

### D.4 — Cost Approvals (Threshold-Based)
- **What it does:** Expenditures over a threshold (e.g., $5,000) require approval from 2-of-3 founders before the cost is committed. Tracks estimated vs actual costs per step.
- **Who needs it:** USER: financial discipline for a startup. INVESTOR: proves cost governance.
- **Priority:** P2
- **Complexity:** Medium
- **Database requirement:** `cost_approvals` table: `asset_id`, `step_id`, `amount`, `description`, `requested_by`, `approvals` (JSONB array of `{user_id, approved, decided_at}`), `threshold_rule` (e.g., ">5000 requires 2/3"), `status`. Or simpler: use the general approval system with a "cost" type.
- **Already in wireframe?** Partial — Financials tab shows cost tracking with estimated/actual, but no approval gate on costs.

### D.5 — Approval Delegation
- **What it does:** If an approver is unavailable (vacation, emergency), they can delegate their approval authority to another team member for a specified time period.
- **Who needs it:** USER: Shane is traveling and can't approve — delegates to Chris.
- **Priority:** P3
- **Complexity:** Medium
- **Database requirement:** `approval_delegations` table: `delegator_id`, `delegate_id`, `start_date`, `end_date`, `scope` (all approvals or specific types), `created_at`.
- **Already in wireframe?** No
- **`[OVERKILL]` at current stage?** Yes for 3 people who can text each other. But becomes important when adding external compliance officers or board members. Defer to P3.

### D.6 — Approval History (Full Audit)
- **What it does:** Complete history of every approval decision — who approved/rejected what, when, with what notes. Exportable for audit.
- **Who needs it:** INVESTOR: must see the full approval chain. SEC examiner wants to know who approved the PPM.
- **Priority:** P0 (intrinsic to the activity log)
- **Complexity:** Simple — every approval action already logs to `activity_log`.
- **Database requirement:** Already covered by `activity_log` immutable table. No additional schema needed.
- **Already in wireframe?** Yes — activity feed shows approval events; gate records show who passed gates.

### D.7 — Rejection Workflow (Required Notes)
- **What it does:** When an approver rejects (requests changes), they MUST provide notes explaining what needs to change. The step/task is marked "Blocked" with the rejection notes displayed prominently. Assignee is notified.
- **Who needs it:** USER: know exactly what to fix. INVESTOR: proves substantive review, not rubber-stamping.
- **Priority:** P0
- **Complexity:** Simple — modal with required textarea on "Request Changes" action.
- **Database requirement:** `asset_step_approvals.notes` (required when status = 'rejected'). Step status -> 'blocked'.
- **Already in wireframe?** Yes — approval flow shows "Request Changes" requiring notes, step status -> Blocked.

### D.8 — Approval SLAs
- **What it does:** Approvals must be completed within a time limit (e.g., 48 hours). If the SLA is breached, escalation notification is sent. Dashboard shows pending approvals with time-remaining countdown.
- **Who needs it:** USER: prevent bottlenecks. INVESTOR: proves responsive governance.
- **Priority:** P2
- **Complexity:** Medium — SLA monitoring in the daily cron job.
- **Database requirement:** `governance_requirements.approval_sla_hours` (integer, nullable). Cron checks `asset_step_approvals` where status = 'pending' AND `created_at` + sla_hours < now().
- **Already in wireframe?** No
- **`[OVERKILL]` at current stage?** Yes for 3 people. They'll notice a pending approval within hours. Becomes relevant with external approvers (counsel, board members). Keep at P2 for future-proofing.

---

## E. DOCUMENT MANAGEMENT

### E.1 — Upload (Drag-and-Drop, Multi-File)
- **What it does:** Upload files via drag-and-drop onto upload zones or click-to-browse. Supports multi-file upload with progress indicators. MIME type validation before storage.
- **Who needs it:** All. USER: daily operation. DEVELOPER: Supabase Storage integration with bucket routing.
- **Priority:** P0
- **Complexity:** Medium
- **Database requirement:** `documents` table already designed. 5 Supabase Storage buckets: `asset-documents`, `partner-documents`, `meeting-attachments`, `profile-images`, `templates`.
- **Already in wireframe?** Yes — upload zones specified throughout: governance steps, document library, global upload.

### E.2 — Version Control
- **What it does:** Replacing a document creates a new version (v1, v2, v3). All previous versions are preserved and accessible via version history. Version chain via `parent_document_id`.
- **Who needs it:** All. USER: "Which version of the PPM did Rialto review?" INVESTOR: complete document lineage.
- **Priority:** P0
- **Complexity:** Medium
- **Database requirement:** `documents.parent_document_id` (uuid, self-referencing FK), `documents.version` (integer). Old file preserved in storage; new file stored alongside. Query: version chain = recursive CTE on parent_document_id.
- **Already in wireframe?** Yes — version badges, version history modal, replace action.

### E.3 — Document Types/Categories with Auto-Classification
- **What it does:** Every document is categorized (GIA Report, Appraisal, PPM, Insurance Certificate, Legal Opinion, etc.). AI suggests the type based on filename. User confirms or corrects.
- **Who needs it:** USER: automatic organization. DEVELOPER: filename pattern matching initially, optional AI classification later.
- **Priority:** P0 (manual classification), P2 (AI auto-classification)
- **Complexity:** Simple (manual), Medium (AI)
- **Database requirement:** `documents.document_type` (enum or text). Classification logic: filename patterns ("gia-" -> GIA Report, "ppm" -> PPM, "insurance" -> Insurance Certificate). AI: future Edge Function calling OpenAI for content analysis.
- **Already in wireframe?** Yes — upload flow includes "This looks like a GIA Report. Is that correct?" with correction dropdown.

### E.4 — Document Preview (Inline)
- **What it does:** Preview PDFs and images inline without downloading. PDF viewer embedded in modal or side panel. Image preview with zoom.
- **Who needs it:** USER: quickly verify a document without leaving the CRM.
- **Priority:** P1
- **Complexity:** Medium — requires a PDF viewer component (react-pdf or pdf.js).
- **Database requirement:** No schema change. Signed URL from Supabase Storage for preview.
- **Already in wireframe?** Yes — preview (eye icon) on every document, specified as "opens inline preview or modal."

### E.5 — Download and Bulk Download
- **What it does:** Download individual documents or select multiple for bulk download as a ZIP file.
- **Who needs it:** USER: send a document package to counsel. INVESTOR: download all documents for an asset during audit.
- **Priority:** P0 (individual), P2 (bulk/ZIP)
- **Complexity:** Simple (individual — signed URL), Medium (bulk — server-side ZIP generation)
- **Database requirement:** No schema change. Bulk: Edge Function that fetches files from Storage and streams a ZIP.
- **Already in wireframe?** Yes (individual download). Bulk download not explicitly specified.

### E.6 — Legal Hold (Prevent Deletion)
- **What it does:** Mark a document as legally held. Legally held documents cannot be deleted, replaced, or moved — even by administrators. Enforced at the database trigger level.
- **Who needs it:** All. USER: protect critical evidence. INVESTOR: proves document integrity. DEVELOPER: trigger-enforced immutability.
- **Priority:** P0
- **Complexity:** Simple — already designed at the database level.
- **Database requirement:** `documents.is_locked` (boolean). Trigger: `BEFORE DELETE ON documents` raises exception if `is_locked = true`. `BEFORE UPDATE ON documents` prevents changing `is_locked` from true to false (only admin override).
- **Already in wireframe?** Yes — lock icon on documents, "Legally held" badge, lock/unlock action.

### E.7 — Expiry Tracking
- **What it does:** Documents with expiry dates (insurance certificates, appraisals older than 1 year, KYC verifications) are tracked with warnings at 90/60/30/14/7 days before expiry.
- **Who needs it:** All. USER: never let insurance lapse. INVESTOR: proves continuous compliance.
- **Priority:** P0
- **Complexity:** Medium — part of the compliance monitoring system (C.7).
- **Database requirement:** `documents.expires_at` (timestamp, nullable). Compliance cron scans for approaching expiry dates.
- **Already in wireframe?** Yes — Compliance Dashboard shows expiry items; document cards show expiry warnings.

### E.8 — Document Templates (Pre-Filled Forms)
- **What it does:** Maintain template documents (NDA template, engagement letter template, subscription agreement template) that can be cloned and customized per asset/partner.
- **Who needs it:** USER: don't recreate the NDA from scratch every time.
- **Priority:** P2
- **Complexity:** Medium
- **Database requirement:** `document_templates` table: `name`, `description`, `document_type`, `file_path` (in templates Storage bucket), `created_by`. Clone operation: copy file to asset-documents bucket + create documents row.
- **Already in wireframe?** Partial — templates Storage bucket mentioned; import from template button on Governance Templates page.

### E.9 — E-Signature Integration (DocuSign/OneSpan)
- **What it does:** Send documents for e-signature directly from the CRM. Track signature status. Signed documents auto-uploaded as new versions.
- **Who needs it:** USER: streamline subscription agreement signing. INVESTOR: legally binding signatures.
- **Priority:** P3 (Future integration)
- **Complexity:** Complex — third-party API integration, webhook handling.
- **Database requirement:** `e_signature_requests` table: `document_id`, `provider` (docusign/onespan), `external_id`, `status`, `signers` (JSONB), `sent_at`, `completed_at`.
- **Already in wireframe?** Yes — listed in Settings > Integrations as "Coming in Phase 2."
- **`[OVERKILL]` at current stage?** Yes for MVP. Manual upload of signed PDFs works for 1-5 assets. Becomes critical at scale.

### E.10 — Document Sharing (Secure External Links)
- **What it does:** Generate a secure, time-limited, optionally password-protected link to share a document with an external party (partner, investor, counsel) without giving them CRM access.
- **Who needs it:** USER: share the PPM with a potential investor. DEVELOPER: Supabase Storage signed URLs with custom expiry.
- **Priority:** P2
- **Complexity:** Simple — Supabase Storage signed URLs already support expiry.
- **Database requirement:** `document_shares` table: `document_id`, `shared_by`, `share_url`, `expires_at`, `password_hash` (nullable), `accessed_count`, `max_accesses` (nullable).
- **Already in wireframe?** No

### E.11 — Full-Text Search Within Documents
- **What it does:** Search for text inside uploaded PDFs and documents, not just filenames/metadata.
- **Who needs it:** USER: "Find every document that mentions 'Kandi'." INVESTOR: locate specific clauses during audit.
- **Priority:** P4 (Future)
- **Complexity:** Complex — requires OCR/text extraction pipeline, full-text indexing.
- **Database requirement:** `documents.extracted_text` (text, nullable). Extraction: Edge Function using pdf-parse or external OCR service. GIN index for full-text search.
- **Already in wireframe?** Partial — Document Library search mentions "content" but implementation is unclear.
- **`[OVERKILL]` at current stage?** Yes. With 500 documents max in year 1, filename search + metadata search covers 95% of cases.

### E.12 — Storage Quota Management
- **What it does:** Display storage usage across all buckets. Warn when approaching Supabase plan limits.
- **Who needs it:** DEVELOPER: prevent unexpected overages. USER: awareness.
- **Priority:** P2
- **Complexity:** Simple
- **Database requirement:** No table needed. Query Supabase Storage API for bucket sizes. Display in Settings > Data Management.
- **Already in wireframe?** Yes — Document Library header shows "[X] documents | [Y.Z] GB used."

---

## F. ACTIVITY & AUDIT TRAIL

### F.1 — Immutable Event Log
- **What it does:** Every mutation in the system (document upload, task completion, step status change, gate passage, approval, comment, partner change, asset creation, etc.) is logged in an append-only table. No UPDATE or DELETE operations ever. Enforced by database triggers.
- **Who needs it:** All. This is the single most critical feature for investor/regulator credibility. USER: "What happened to this asset while I was out?" INVESTOR: SEC-grade audit trail. DEVELOPER: triggers handle all logging automatically.
- **Priority:** P0
- **Complexity:** Complex — requires triggers on every mutable table.
- **Database requirement:** `activity_log` table already designed — `id`, `asset_id`, `user_id`, `action_type`, `entity_type`, `entity_id`, `details` (JSONB with before/after state), `created_at`. Triggers on: `assets`, `asset_steps`, `tasks`, `documents`, `gate_checks`, `comments`, `partners`, `asset_partners`, `team_members`. RLS: SELECT only, no UPDATE/DELETE policies.
- **Already in wireframe?** Yes — Activity page (Page 9) with "records cannot be edited or deleted" prominently stated.

### F.2 — Per-Asset Activity Feed
- **What it does:** Filtered activity feed showing only events for a specific asset. Accessible from the Asset Detail Activity tab.
- **Who needs it:** All. USER: "What happened with Emerald Barrel #017093 this week?"
- **Priority:** P0
- **Complexity:** Simple — filter query on `activity_log.asset_id`.
- **Database requirement:** Index on `(asset_id, created_at DESC)` already implied in schema.
- **Already in wireframe?** Yes — Asset Detail Activity tab.

### F.3 — Per-Step Activity Feed
- **What it does:** Activity feed filtered to a specific governance step. Shows only events related to that step's tasks, documents, and approvals.
- **Who needs it:** USER: "What's the full history of Step 2.4 — Appraisals?"
- **Priority:** P0
- **Complexity:** Simple — filter on `activity_log.entity_type = 'step' AND entity_id = step_id` plus related entities.
- **Database requirement:** Index on `(entity_type, entity_id, created_at DESC)`.
- **Already in wireframe?** Yes — governance step expanded view has "Activity for this step" section.

### F.4 — Global Activity Feed
- **What it does:** Cross-asset, cross-entity activity feed with filtering and infinite scroll. The "compliance-grade evidence chain" page.
- **Who needs it:** All. INVESTOR: the page they will ask for during audit.
- **Priority:** P0
- **Complexity:** Medium — requires efficient pagination and filtering on a high-volume table.
- **Database requirement:** Indexes on `(created_at DESC)`, `(action_type, created_at DESC)`, `(user_id, created_at DESC)`. Pagination via cursor-based infinite scroll (not offset-based).
- **Already in wireframe?** Yes — Activity page (Page 9) fully specified.

### F.5 — Filterable by Event Type, User, Date Range, Asset
- **What it does:** Activity feeds can be filtered by action type (document, step, gate, task, comment, status change, partner, system), user, date range, and asset.
- **Who needs it:** All. INVESTOR: "Show me only gate passage events for the last 6 months."
- **Priority:** P0
- **Complexity:** Simple — filter bar + query parameters.
- **Database requirement:** Composite indexes to support multi-field filtering efficiently.
- **Already in wireframe?** Yes — filter bar on Activity page.

### F.6 — Export to PDF/CSV for Audit
- **What it does:** Export filtered activity log as a formatted PDF report or CSV data file. Includes header with export date, filter criteria, and PleoChrome branding. Designed for investor/regulator consumption.
- **Who needs it:** INVESTOR: the deliverable they'll request. USER: send to counsel for review.
- **Priority:** P0
- **Complexity:** Medium — PDF generation (Edge Function using jsPDF or Puppeteer), CSV generation (straightforward).
- **Database requirement:** No schema change. Edge Function endpoint: `export_audit_trail(filters, format)`.
- **Already in wireframe?** Yes — Export Audit Trail button with format/filter options dialog.

### F.7 — Automated Entries (System Logs Every Mutation)
- **What it does:** Activity log entries are created automatically by database triggers. Frontend developers do NOT manually insert log entries. This ensures no action goes unlogged.
- **Who needs it:** DEVELOPER: reduces boilerplate and prevents gaps. INVESTOR: guarantees completeness.
- **Priority:** P0
- **Complexity:** Already designed — triggers handle this.
- **Database requirement:** Trigger functions on all mutable tables. Each trigger captures: table name, operation (INSERT/UPDATE/DELETE), old row, new row, current user from `auth.uid()`.
- **Already in wireframe?** Yes — CLAUDE.md explicitly states "Activity logging is automatic. Database triggers handle audit trail entries."

### F.8 — Manual Activity Entries (Team Notes)
- **What it does:** Team members can add manual log entries — e.g., "Called GIA, they confirmed report will be ready by Friday." These are logged as "manual_note" action type and are just as immutable as automated entries.
- **Who needs it:** USER: document phone calls, in-person meetings, verbal agreements.
- **Priority:** P1
- **Complexity:** Simple
- **Database requirement:** `activity_log` supports `action_type = 'manual_note'`. Frontend: "Add note" button that inserts into activity_log directly (exception to the no-frontend-insert rule, since this IS a user-initiated action, not a system trigger).
- **Already in wireframe?** Partial — "Add Note" button on Asset Detail hero, but mechanism not fully specified.

### F.9 — Timestamp Precision
- **What it does:** All activity log timestamps are stored with second-level precision in UTC. Displayed with user's local timezone conversion.
- **Who needs it:** INVESTOR: precise timing matters for regulatory compliance (Form D 15-day window, gate passage sequencing).
- **Priority:** P0
- **Complexity:** Simple — PostgreSQL `timestamptz` default.
- **Database requirement:** `activity_log.created_at` is `TIMESTAMPTZ DEFAULT now()`. Frontend: display with timezone conversion via `Intl.DateTimeFormat`.
- **Already in wireframe?** Yes — activity entries show "2026-03-29 14:32:15 UTC."

---

## G. REPORTING & ANALYTICS

### G.1 — Compliance Score Calculation
- **What it does:** Per-asset and global compliance score = (completed governance steps with all required documents and approvals) / (total required governance steps) * 100%. Updates in real-time as steps complete.
- **Who needs it:** All. USER: at-a-glance health check. INVESTOR: quantified compliance posture.
- **Priority:** P0
- **Complexity:** Medium — database view or computed field aggregating step completion, document uploads, and approval statuses.
- **Database requirement:** `v_pipeline_board` view includes compliance score calculation. Per-asset: query `asset_steps` + `documents` + approvals for that asset.
- **Already in wireframe?** Yes — ComplianceScore stat card (87%), per-asset compliance percentage in tables.

### G.2 — Pipeline Velocity (Avg Days Per Phase)
- **What it does:** Track how long assets spend in each phase on average. Identify bottleneck phases. Display as trend line over time.
- **Who needs it:** USER: "Phase 2 is taking too long — what's blocking?" INVESTOR: operational efficiency metric.
- **Priority:** P1
- **Complexity:** Medium — requires tracking phase entry/exit timestamps.
- **Database requirement:** `assets.phase_entered_at` (JSONB object: `{phase_1: timestamp, phase_2: timestamp, ...}`) or track via `gate_checks.checked_at` timestamps (gate passage = phase exit).
- **Already in wireframe?** Yes — "Avg Days in Pipeline" stat card with sparkline.

### G.3 — Cost Tracking (Estimated vs Actual)
- **What it does:** Per-asset cost tracking by category (Legal, Certification, Appraisal, Custody, Tokenization, Regulatory, Marketing). Compare estimated costs (from CostLine data in portal-data.ts) against actual expenditures.
- **Who needs it:** USER: budget management. INVESTOR: proof of financial discipline.
- **Priority:** P1
- **Complexity:** Medium
- **Database requirement:** `asset_costs` table: `asset_id`, `category`, `description`, `estimated_amount`, `actual_amount`, `step_id` (nullable), `partner_id` (nullable), `receipt_document_id` (nullable), `status` (estimated/committed/paid), `created_by`. Or store in `assets.metadata.costs` JSONB.
- **Already in wireframe?** Yes — Financials tab with cost tracking table.

### G.4 — Revenue Projection
- **What it does:** Per-asset and aggregate revenue projection based on offering value, fee structure (2% setup, 1.5% success, 0.75% admin), and pipeline stage. Year 1-5 projection table.
- **Who needs it:** USER: business planning. INVESTOR: revenue potential visibility.
- **Priority:** P2
- **Complexity:** Medium — calculated fields based on fee structure and offering values.
- **Database requirement:** Fee structure stored in config or `assets.metadata.financials`. Calculation: pure function, no additional tables needed.
- **Already in wireframe?** Yes — Financials tab Revenue Projection section.

### G.5 — Partner Performance Tracking
- **What it does:** Track partner responsiveness (average response time), task completion rate for partner-assigned tasks, DD score, and meeting frequency.
- **Who needs it:** USER: evaluate which partners to continue working with. INVESTOR: proves partner diligence.
- **Priority:** P2
- **Complexity:** Medium — aggregate queries across tasks, meetings, and activity filtered by partner.
- **Database requirement:** No new table — computed from `tasks` (filter by partner module), `meeting_notes` (filter by partner), `partners.dd_score`.
- **Already in wireframe?** Partial — partner cards show stats ("Last contact: Mar 15") but no formal performance dashboard.

### G.6 — Task Completion Metrics
- **What it does:** Dashboard widgets showing: tasks completed this week/month, overdue task trend, completion rate by team member, average time-to-completion by task type.
- **Who needs it:** USER: team productivity overview. INVESTOR: operational metrics.
- **Priority:** P2
- **Complexity:** Medium
- **Database requirement:** Computed from `tasks` table aggregations. No new tables.
- **Already in wireframe?** Partial — task dashboard has summary stats (Open, Overdue, Due Today, Completed This Week, Blocked) but not trend analytics.

### G.7 — Investor Reporting (Quarterly NAV, Annual Re-Appraisal)
- **What it does:** Generate formatted quarterly investor reports including: NAV calculation, asset status summary, compliance score, fee summary, key milestones achieved. Export as branded PDF.
- **Who needs it:** INVESTOR: the primary deliverable they expect. USER: investor relations management.
- **Priority:** P3
- **Complexity:** Complex — templated PDF generation with dynamic data, charts, and branding.
- **Database requirement:** No new tables — aggregates data from assets, financials, compliance. `investor_reports` table for tracking generated reports: `report_id`, `report_type`, `period`, `generated_at`, `file_path`, `generated_by`.
- **Already in wireframe?** No
- **`[OVERKILL]` at current stage?** No, but timing is P3. No investors yet, but the data structures should be designed to support this from day one.

### G.8 — Exportable Reports (PDF, CSV)
- **What it does:** Any dashboard view, filtered table, or report can be exported to PDF or CSV.
- **Who needs it:** All. INVESTOR: audit deliverables. USER: share with counsel, partners.
- **Priority:** P1 (basic CSV), P2 (formatted PDF)
- **Complexity:** Simple (CSV), Medium (PDF)
- **Database requirement:** No schema change. Edge Functions for generation.
- **Already in wireframe?** Yes — export buttons throughout (Asset List, Activity Log, Compliance Dashboard).

### G.9 — Dashboard Widgets (Charts, KPIs)
- **What it does:** Pipeline Board stats ribbon with: Total Pipeline AUM, Active Assets, Avg Days in Pipeline, Compliance Score. Each with trend indicators.
- **Who needs it:** USER: daily operational overview.
- **Priority:** P0
- **Complexity:** Medium
- **Database requirement:** `v_pipeline_board` view provides aggregated data for dashboard.
- **Already in wireframe?** Yes — Stats Ribbon on Pipeline Board fully specified.

---

## H. SEARCH & NAVIGATION

### H.1 — Global Search (Assets, Partners, Documents, Tasks, Activity)
- **What it does:** Single search input that queries across all entity types. Results grouped by type (Assets, Partners, Documents, Tasks, Team). Keyboard navigable.
- **Who needs it:** USER: find anything fast.
- **Priority:** P0
- **Complexity:** Medium — requires search endpoints across multiple tables with relevance ranking.
- **Database requirement:** Search indexes on: `assets.name`, `partners.name`, `documents.filename`, `tasks.title`, `team_members.full_name`. tRPC endpoint: `globalSearch(query)` returns grouped results.
- **Already in wireframe?** Yes — Command Palette (Cmd+K) with grouped results.

### H.2 — Command Palette (Cmd+K)
- **What it does:** Quick-access modal triggered by Cmd+K (Mac) or Ctrl+K (Windows). Combines search with quick actions (New Asset, New Meeting, My Tasks, Recent items).
- **Who needs it:** USER: power user efficiency. DEVELOPER: standard modern SaaS pattern.
- **Priority:** P0
- **Complexity:** Medium — component + search integration + quick actions.
- **Database requirement:** `recent_items` tracked in localStorage (client-side). Search hits existing endpoints.
- **Already in wireframe?** Yes — fully specified in Global Overlays.

### H.3 — Recent Items
- **What it does:** Track and display the last 5-10 pages/entities the user visited. Shown in Command Palette when search is empty and optionally in sidebar.
- **Who needs it:** USER: quick back-navigation.
- **Priority:** P1
- **Complexity:** Simple — localStorage tracking on client.
- **Database requirement:** None — client-side only. Or optional: `user_activity.recent_items` JSONB on team_members.
- **Already in wireframe?** Yes — Command Palette shows "Recent — last 5 visited pages."

### H.4 — Breadcrumb Navigation
- **What it does:** Dynamic breadcrumbs showing the current location in the CRM hierarchy. Each segment is a clickable link (except the last). E.g., "Pipeline > Assets > Emerald Barrel #017093 > Governance."
- **Who needs it:** USER: orientation and quick back-navigation.
- **Priority:** P0
- **Complexity:** Simple
- **Database requirement:** None — derived from URL structure.
- **Already in wireframe?** Yes — breadcrumbs specified in header bar and on every detail page.

### H.5 — Keyboard Shortcuts
- **What it does:** Keyboard shortcuts for common actions: Cmd+K (search), N (new asset), Tab (navigate cards), Enter (open), Escape (close modals), Arrow keys (navigate lists/kanban).
- **Who needs it:** USER: power user efficiency.
- **Priority:** P1
- **Complexity:** Simple — global keyboard event listeners.
- **Database requirement:** None.
- **Already in wireframe?** Yes — Pipeline Board keyboard navigation table specified.

### H.6 — Saved Views/Filters
- **What it does:** Save a combination of filters as a named view (e.g., "My Overdue Tasks," "Phase 2 Blocked Assets," "Expiring Documents"). Quick-switch between saved views.
- **Who needs it:** USER: don't re-apply the same 4 filters every morning.
- **Priority:** P2
- **Complexity:** Medium
- **Database requirement:** `saved_views` table: `user_id`, `name`, `page` (pipeline/assets/tasks/documents), `filters` (JSONB), `is_default` (boolean), `created_at`.
- **Already in wireframe?** No
- **`[OVERKILL]` at current stage?** Borderline. With 3 people and 1-5 assets, filter combinations are limited. But becomes valuable quickly as assets grow. Keep at P2.

---

## I. INTEGRATIONS

### I.1 — Supabase (Database, Auth, Storage, Realtime)
- **What it does:** Core infrastructure — PostgreSQL database, authentication (email + MFA), file storage (5 buckets), and real-time subscriptions for live updates.
- **Who needs it:** All. This IS the backend.
- **Priority:** P0
- **Complexity:** Complex (initial setup), then ongoing
- **Database requirement:** Supabase project already created. Migrations in `supabase/migrations/`.
- **Already in wireframe?** Yes — referenced throughout as the data layer.

### I.2 — Google Drive Sync (One-Way Mirror)
- **What it does:** Mirror key documents from Supabase Storage to Google Drive for external sharing, backup, and folder-based organization that non-CRM users can access.
- **Who needs it:** USER: share documents with partners/counsel who don't have CRM access. Keep Google Drive organized automatically.
- **Priority:** P2
- **Complexity:** Complex — Google Drive API integration, file sync logic, folder structure management.
- **Database requirement:** `integration_configs` table: `integration_type` (google_drive), `config` (JSONB with folder mappings, sync status), `enabled`, `last_synced_at`.
- **Already in wireframe?** Yes — Settings > Integrations shows Google Drive card.

### I.3 — Email Service (Resend for Notifications)
- **What it does:** Transactional email delivery for notifications, digests, and system alerts. Using Resend for reliable delivery with templates.
- **Who needs it:** All. USER: receive email notifications for critical events.
- **Priority:** P1
- **Complexity:** Medium — Resend SDK integration, email templates, preference-respecting dispatch.
- **Database requirement:** No new tables. API key in `.env.local`.
- **Already in wireframe?** Implicit — email notifications mentioned throughout.

### I.4 — Calendar Integration
- **What it does:** Sync meeting records with Google Calendar. Create calendar events for tasks with due dates. Future: scheduling links for partner meetings.
- **Who needs it:** USER: see CRM deadlines alongside regular calendar.
- **Priority:** P3
- **Complexity:** Complex — Google Calendar API, OAuth flow.
- **Database requirement:** Part of `integration_configs` table.
- **Already in wireframe?** No
- **`[OVERKILL]` at current stage?** Yes for MVP. Manual calendar management works for 3 people.

### I.5 — AI (Document Classification, Meeting Summarization, Compliance Gap Detection)
- **What it does:** Three AI capabilities: (1) Auto-classify uploaded documents by type, (2) Summarize meeting transcripts into key topics/decisions/action items, (3) Identify compliance gaps across assets.
- **Who needs it:** USER: time savings on repetitive analysis. INVESTOR: shows technological sophistication.
- **Priority:** P2 (doc classification), P2 (meeting summarization), P3 (compliance gap detection)
- **Complexity:** Medium (classification), Medium (summarization), Complex (compliance gaps)
- **Database requirement:** No new tables for classification/summarization — use existing fields. Compliance gap detection may need `compliance_gaps` table for persistent tracking.
- **Already in wireframe?** Yes — document upload has AI classification suggestion; meeting detail has "AI Summary" section.

### I.6 — Chainlink (Proof of Reserve Feed)
- **What it does:** Read-only integration with Chainlink Proof of Reserve oracle. Display current PoR status for tokenized assets. Show last verification timestamp and result.
- **Who needs it:** INVESTOR: cryptographic proof of asset custody. USER: verify PoR is active.
- **Priority:** P3 (not needed until tokenization is live)
- **Complexity:** Medium — read-only API call to Chainlink oracle.
- **Database requirement:** Store PoR status in `assets.metadata.por` JSONB: `{feed_address, last_verified, result, active}`.
- **Already in wireframe?** Yes — Asset Detail custody card shows "PoR Status: Active" and "API Feed Active."

### I.7 — Tokenization Platform API (Rialto/Brickken/Zoniqx)
- **What it does:** API integration with whichever tokenization platform is selected. Sync token deployment status, contract addresses, distribution metrics.
- **Who needs it:** DEVELOPER: automated status sync. USER: don't have to manually update token status.
- **Priority:** P3 (not needed until platform selected and contracted)
- **Complexity:** Complex — varies by platform API.
- **Database requirement:** Store in `assets.metadata.tokenization` JSONB.
- **Already in wireframe?** Yes — listed in Settings > Integrations as "Coming in Phase 2."

### I.8 — DocuSign/OneSpan (E-Signatures)
- **What it does:** Send documents for e-signature, track status, auto-upload signed documents.
- **Who needs it:** USER: streamline subscription agreements.
- **Priority:** P3
- **Complexity:** Complex
- **Database requirement:** See E.9.
- **Already in wireframe?** Yes — listed in Settings > Integrations.

### I.9 — Slack/Teams Notifications
- **What it does:** Forward critical CRM notifications to a Slack/Teams channel.
- **Who needs it:** USER: team communication where they already are.
- **Priority:** P3
- **Complexity:** Medium — webhook integration.
- **Database requirement:** Webhook URL in `integration_configs`.
- **Already in wireframe?** No
- **`[OVERKILL]` at current stage?** Yes. Three people can just check the CRM. Becomes valuable with more team members.

---

## J. USER MANAGEMENT & SECURITY

### J.1 — Authentication (Supabase Auth with MFA)
- **What it does:** Email/password login with magic link option. Multi-factor authentication (TOTP) required for all team members. Session management with token refresh.
- **Who needs it:** All. INVESTOR: security posture proof. USER: account protection.
- **Priority:** P0
- **Complexity:** Medium — Supabase Auth handles most of this.
- **Database requirement:** Supabase `auth.users` table (managed by Supabase). `team_members` table links to `auth.users.id`. MFA configured in Supabase Auth settings.
- **Already in wireframe?** Yes — Settings > Security shows MFA management.

### J.2 — Role-Based Permissions (RBAC)
- **What it does:** Six roles with different permission levels: CEO (full access), CTO (full access), CRO (full access except system config), Compliance Officer (full access to compliance, read-only elsewhere), Team Member (standard access), ReadOnly/External (view only).
- **Who needs it:** All. INVESTOR: access control proof. DEVELOPER: RLS policies per role.
- **Priority:** P0
- **Complexity:** Medium — RLS policies on every table.
- **Database requirement:** `team_members.role` (enum). RLS policies: governance requirements write = CEO/CTO/Compliance only. Activity log = no UPDATE/DELETE for any role. Documents = team members can upload, only admins can delete locked docs. Partner modules = CEO/CTO only for creation.
- **Already in wireframe?** Yes — CLAUDE.md specifies "Governance requirements can only be modified by CEO, CTO, or Compliance Officer."

### J.3 — Session Management
- **What it does:** View active sessions, sign out other sessions, login history with device/IP/location/timestamp.
- **Who needs it:** USER: security awareness. INVESTOR: security hygiene.
- **Priority:** P1
- **Complexity:** Simple — Supabase Auth provides session management.
- **Database requirement:** Supabase `auth.sessions` table (managed). Login history: log auth events to `activity_log` with `action_type = 'auth_login'`.
- **Already in wireframe?** Yes — Settings > Security shows session management and login history.

### J.4 — User Action Audit
- **What it does:** Every user action is attributed to a specific user in the activity log. Who created this asset? Who uploaded this document? Who approved this gate?
- **Who needs it:** INVESTOR: accountability and non-repudiation.
- **Priority:** P0 (intrinsic to activity log)
- **Complexity:** Simple — `activity_log.user_id` is populated by trigger using `auth.uid()`.
- **Database requirement:** Already designed.
- **Already in wireframe?** Yes — every activity entry shows user avatar + name.

### J.5 — API Key Management
- **What it does:** Generate and manage API keys for future integrations. Key name, scopes, created date, last used, revocation.
- **Who needs it:** DEVELOPER: future integration infrastructure.
- **Priority:** P3
- **Complexity:** Medium
- **Database requirement:** `api_keys` table: `key_hash` (never store plaintext), `name`, `scopes` (JSONB), `created_by`, `last_used_at`, `revoked_at`.
- **Already in wireframe?** Yes — Settings > Integrations shows API Key management.

### J.6 — Data Export (GDPR Compliance)
- **What it does:** Export all data associated with a user or entity. For regulatory/legal compliance and data portability.
- **Who needs it:** DEVELOPER: legal requirement if operating with EU entities. INVESTOR: data governance proof.
- **Priority:** P2
- **Complexity:** Medium
- **Database requirement:** No new tables. Edge Function that queries all tables for user/entity data and packages as JSON/CSV.
- **Already in wireframe?** Yes — Settings > Data Management shows export functionality.

### J.7 — Account Deactivation (Soft Delete)
- **What it does:** Deactivate a team member's account without deleting their data. Preserve all historical records (activity, comments, approvals). Deactivated user cannot login but their name appears in historical records.
- **Who needs it:** USER: team member leaves. INVESTOR: preservation of audit trail.
- **Priority:** P1
- **Complexity:** Simple
- **Database requirement:** `team_members.is_active` (boolean). Deactivation sets `is_active = false`. RLS: deactivated users cannot authenticate. All FKs preserved.
- **Already in wireframe?** Partial — implied but not explicitly specified.

---

## K. INVESTOR-FACING FEATURES (Future Portal)

### K.1 — Investor Portal (Read-Only Dashboard)
- **What it does:** A separate, read-only portal where investors can log in to view their investment summary, asset status, and documents. Completely separate from the internal CRM.
- **Who needs it:** INVESTOR: self-service access reduces questions. USER: reduce investor inquiry burden.
- **Priority:** P3 (design now, build later)
- **Complexity:** Complex — separate auth layer, dedicated RLS policies, new portal pages.
- **Database requirement:** `investors` table: `user_id` (Supabase Auth), `name`, `email`, `entity_name`, `entity_type`, `accreditation_status`, `accreditation_verified_date`. `investor_holdings` table: `investor_id`, `asset_id`, `units_held`, `invested_amount`, `invested_date`. Separate RLS: investors can only see assets they've invested in.
- **Already in wireframe?** No — wireframe covers internal CRM only.

### K.2 — Investment Summary Dashboard
- **What it does:** Per-investor view showing: total invested, current NAV, distributions received, unrealized gains, portfolio allocation.
- **Who needs it:** INVESTOR: portfolio visibility.
- **Priority:** P3
- **Complexity:** Medium (once investor tables exist)
- **Database requirement:** Computed from `investor_holdings` + `assets` data.
- **Already in wireframe?** No

### K.3 — Quarterly Reports Access
- **What it does:** Investors can download quarterly reports as formatted PDFs from their portal.
- **Who needs it:** INVESTOR: standard expectation in private securities.
- **Priority:** P3
- **Complexity:** Medium — PDF generation + secure access.
- **Database requirement:** `investor_reports` table linked to `investors` and `assets`.
- **Already in wireframe?** No

### K.4 — K-1 Tax Documents
- **What it does:** Distribute annual K-1 tax documents to investors through the portal.
- **Who needs it:** INVESTOR: tax filing requirement for LLC unit holders.
- **Priority:** P3
- **Complexity:** Simple (upload + access control). Tax document preparation is external (CPA).
- **Database requirement:** `documents` table with type = 'k1', linked to investor + asset.
- **Already in wireframe?** No

### K.5 — Proof of Custody (Chainlink PoR)
- **What it does:** Investor-facing display of Chainlink Proof of Reserve verification, showing cryptographic proof that the underlying asset is in custody.
- **Who needs it:** INVESTOR: differentiated trust signal, especially for crypto-native investors.
- **Priority:** P3
- **Complexity:** Simple (display only, data from I.6 integration)
- **Database requirement:** Read from `assets.metadata.por`.
- **Already in wireframe?** Partial — internal CRM shows PoR status; investor portal display not specified.

### K.6 — Compliance Certifications Display
- **What it does:** Show investors the compliance status of their assets — certifications received, appraisals completed, insurance active, regulatory filings current.
- **Who needs it:** INVESTOR: confidence that their investment is properly managed.
- **Priority:** P3
- **Complexity:** Simple — read-only view of existing compliance data.
- **Database requirement:** Computed from existing compliance score and step completion data.
- **Already in wireframe?** No

### K.7 — Investor Support/Contact
- **What it does:** Simple contact form or messaging system within the investor portal for questions and support requests.
- **Who needs it:** INVESTOR: communication channel.
- **Priority:** P4
- **Complexity:** Simple
- **Database requirement:** `support_requests` table or simple email routing.
- **Already in wireframe?** No
- **`[OVERKILL]` at current stage?** Yes. With 0 investors currently, this is purely future-state.

---

## L. ASSET-SPECIFIC FEATURES

### L.1 — Asset Lifecycle Visualization (Phase Timeline)
- **What it does:** Horizontal timeline showing the asset's progression through all 4 phases. Completed phases show checkmarks, current phase pulses, upcoming phases are dashed. Clickable to scroll to that phase's governance steps.
- **Who needs it:** All. USER: at-a-glance progress. INVESTOR: visual proof of systematic progression.
- **Priority:** P0
- **Complexity:** Medium — custom SVG/CSS component.
- **Database requirement:** Computed from `asset_steps` completion status and `gate_checks` records.
- **Already in wireframe?** Yes — Phase Timeline fully specified in Asset Detail.

### L.2 — Provenance Chain Visualization
- **What it does:** Visual chain showing the asset's custody history: origin -> certification -> vault transfers -> current location. Each node shows date, entity, and linked documents.
- **Who needs it:** INVESTOR: critical for RWA — proves unbroken chain of custody. USER: verify provenance claims.
- **Priority:** P1
- **Complexity:** Medium — custom visualization component.
- **Database requirement:** Data from `assets.metadata.custody` JSONB (previous custody history) + `documents` (receipts, certificates). May need dedicated `custody_events` table for cleaner modeling: `asset_id`, `event_type` (transfer, verification, insurance), `from_entity`, `to_entity`, `date`, `document_id`.
- **Already in wireframe?** Partial — custody card shows "Previous Custody: collapsible section listing prior vaults" but no visual chain.

### L.3 — Appraisal Comparison View
- **What it does:** Side-by-side comparison of all 3 independent appraisals for an asset. Shows value, methodology, credentials, USPAP compliance, and variance analysis.
- **Who needs it:** USER: quick comparison without opening 3 documents. INVESTOR: proves independent valuation methodology.
- **Priority:** P1
- **Complexity:** Simple — data from `assets.metadata.appraisals` JSONB.
- **Database requirement:** Already in metadata schema.
- **Already in wireframe?** Yes — Asset Detail Overview Appraisals card shows all 3 appraisers with values, variance calculation, and USPAP compliance.

### L.4 — Financial Model per Asset
- **What it does:** Per-asset financial model showing: fee projections (setup, success, admin), cost tracking (estimated vs actual), revenue projection (Year 1-5), ROI calculation.
- **Who needs it:** USER: business case for each asset. INVESTOR: financial viability assessment.
- **Priority:** P1
- **Complexity:** Medium
- **Database requirement:** `asset_costs` table (see G.3). Revenue calculations from fee structure + offering value.
- **Already in wireframe?** Yes — Financials tab fully specified with fee summary, cost tracking, and revenue projection.

### L.5 — Partner Assignment per Asset
- **What it does:** Assign partners to an asset with specific roles (vault, counsel, BD, tokenization platform, etc.). Track active partner modules. Support partner/module swaps.
- **Who needs it:** All. USER: manage the partner ecosystem per asset. DEVELOPER: junction table with module tracking.
- **Priority:** P0
- **Complexity:** Medium
- **Database requirement:** `asset_partners` junction table already designed — `asset_id`, `partner_id`, `role`, `active_module_id`, `assigned_at`, `assigned_by`.
- **Already in wireframe?** Yes — Asset Detail Partners tab with assignment, module swap flow.

### L.6 — Risk Register per Asset
- **What it does:** List of identified risks per asset with severity (critical/high/moderate/low), description, mitigation strategy, status (monitoring/mitigated/resolved), and owner.
- **Who needs it:** USER: proactive risk management. INVESTOR: proves risk awareness and mitigation planning.
- **Priority:** P1
- **Complexity:** Medium
- **Database requirement:** `asset_risks` table: `asset_id`, `severity`, `title`, `description`, `mitigation_plan`, `status`, `owner_id`, `identified_date`, `resolved_date`. Or store in `assets.metadata.risks` JSONB for simpler modeling.
- **Already in wireframe?** Yes — Risk Register card in Asset Detail Overview.

### L.7 — Media Gallery (Asset Photos)
- **What it does:** Photo gallery for the physical asset — stone photos, vault photos, certification images. Supports upload, tagging, and fullscreen preview.
- **Who needs it:** USER: visual reference. INVESTOR: proof of physical asset existence.
- **Priority:** P2
- **Complexity:** Simple — Supabase Storage + image viewer component.
- **Database requirement:** `documents` table with `document_type = 'photo'`. Media bucket in Supabase Storage.
- **Already in wireframe?** No — not explicitly specified, but photos would be uploaded as documents.

### L.8 — Asset Archival
- **What it does:** Mark completed or terminated assets as archived. Archived assets don't appear in pipeline or active lists but are fully preserved and searchable. Can be unarchived.
- **Who needs it:** USER: clean up the pipeline view. INVESTOR: historical record preservation.
- **Priority:** P1
- **Complexity:** Simple
- **Database requirement:** `assets.status` enum includes 'archived'. Filter: active views exclude archived by default; archive view shows only archived.
- **Already in wireframe?** Yes — "Archive Asset" in the Asset Detail "More" dropdown.

### L.9 — Asset Duplication (Template from Completed Deal)
- **What it does:** Clone a completed asset as a starting template for a new similar asset. Copies: basic info structure, partner assignments, governance template selection. Does NOT copy: documents, task completion status, activity log.
- **Who needs it:** USER: second gemstone barrel follows same process as first.
- **Priority:** P2
- **Complexity:** Medium — selective deep copy logic.
- **Database requirement:** No new tables. Server function: `duplicate_asset(source_asset_id)` creates new asset with copied metadata template, re-runs `assemble_asset_workflow()`.
- **Already in wireframe?** Yes — "Duplicate Asset" in the Asset Detail "More" dropdown.

---

## M. WHAT WE'RE MISSING

### M.1 — From the USER Perspective

#### M.1.1 — Quick-Add Capture (Inbox/Scratch Pad)
- **What it is:** A quick-capture input (always accessible, maybe floating button or sidebar widget) to jot down a note, task, or thought without navigating away from the current page. Like a CRM "inbox" that can be triaged later.
- **Why it matters:** Shane is on a call with Rialto and Rob mentions a critical detail. He needs to capture it instantly without navigating to the right asset, finding the right step, opening a form. Current wireframe requires multiple clicks to add anything.
- **Priority:** P1
- **Complexity:** Medium
- **Database requirement:** `quick_captures` table: `user_id`, `body`, `entity_type` (nullable), `entity_id` (nullable), `triaged` (boolean), `created_at`. Or simpler: unassigned tasks/comments that get linked to entities later.
- **Already in wireframe?** No

#### M.1.2 — Dashboard "My Day" View
- **What it is:** A personalized daily view showing: my overdue tasks, my tasks due today, my pending approvals, my recent notifications, meetings today. One page that answers "what do I need to do right now?"
- **Why it matters:** The Pipeline Board is asset-centric. But Shane's morning question is "what do I personally need to do today?" — a user-centric view.
- **Priority:** P1
- **Complexity:** Medium
- **Database requirement:** No new tables — aggregation queries filtered by `assigned_to = current_user`.
- **Already in wireframe?** Partial — Task Dashboard has "My Tasks" filter, but there's no unified personal daily view.

#### M.1.3 — Email Logging / BCC Capture
- **What it is:** A dedicated BCC address (crm@pleochrome.com) that, when CC'd on partner/counsel emails, automatically logs the email as a meeting note or activity entry associated with the relevant partner/asset.
- **Why it matters:** Most partner communication happens over email, not in the CRM. Without email capture, the CRM has blind spots in the communication timeline. With 3 people, this means manually logging every important email — which won't happen consistently.
- **Priority:** P3
- **Complexity:** Complex — requires email receiving infrastructure (Resend inbound or dedicated service).
- **Database requirement:** `email_captures` table: `from`, `to`, `subject`, `body_text`, `received_at`, `asset_id` (auto-matched or manual), `partner_id` (auto-matched), `processed` (boolean).
- **Already in wireframe?** No
- **`[OVERKILL]` at current stage?** Borderline. The communication gap is real, but the infrastructure cost is high. Consider a simpler pattern first: "Log Email" button that opens a pre-filled meeting note form.

#### M.1.4 — Mobile-Responsive CRM Access
- **What it is:** Not a native app, but a fully responsive web experience that works on phone/tablet for checking status, approving tasks, and viewing notifications.
- **Why it matters:** Shane/David/Chris won't always be at a desk. Checking pipeline status from a phone during a partner dinner is a real use case.
- **Priority:** P1
- **Complexity:** Medium — responsive breakpoints already specified in wireframe, but need to verify every page works at mobile widths.
- **Database requirement:** None — frontend concern only.
- **Already in wireframe?** Yes — responsive behavior section specifies breakpoints down to xs (<640px).

### M.2 — From the DEVELOPER Perspective

#### M.2.1 — Optimistic UI Updates
- **What it is:** When a user completes a task or uploads a document, the UI updates immediately (optimistically) before the server confirms. If the server fails, the UI rolls back with an error toast.
- **Why it matters:** Without optimistic updates, every click has a perceptible delay (Supabase round-trip = 50-200ms). With 40+ tasks per asset, the accumulated lag feels sluggish. TanStack Query supports optimistic mutations natively.
- **Priority:** P0
- **Complexity:** Medium — part of the TanStack Query integration pattern.
- **Database requirement:** None — frontend architecture concern.
- **Already in wireframe?** Implicit in the interaction patterns but not explicitly called out.

#### M.2.2 — Error Boundary Strategy
- **What it is:** React error boundaries at page level, section level, and component level to prevent cascading failures. A broken comment component shouldn't crash the entire Asset Detail page.
- **Why it matters:** With real-time subscriptions and complex state, partial failures are inevitable. Graceful degradation is critical for a tool used daily.
- **Priority:** P0
- **Complexity:** Simple — React Error Boundary components at 3 levels.
- **Database requirement:** None.
- **Already in wireframe?** Yes — error states section specifies page-level, component-level, and network errors.

#### M.2.3 — Database Migration Strategy
- **What it is:** A documented process for applying schema changes (new tables, columns, indexes) without downtime. Sequential migration files in `supabase/migrations/`.
- **Why it matters:** The schema will evolve as features are added. Without a migration discipline, schema drift causes production bugs.
- **Priority:** P0
- **Complexity:** Simple — Supabase CLI handles migrations.
- **Database requirement:** Migration file naming: `XXX_description.sql`. Never modify existing migration files. Run `supabase gen types typescript` after every migration.
- **Already in wireframe?** Yes — CLAUDE.md specifies "Never modify existing migration files. Create new migration files for changes."

#### M.2.4 — Seed Data for Development
- **What it is:** A seed script that populates the database with realistic test data: 3-5 assets at different phases, 10+ partners, 50+ tasks, 100+ activity log entries, sample documents.
- **Why it matters:** Without seed data, every developer session starts with manually creating test records. This kills development velocity and makes it impossible to test edge cases (overdue tasks, expired documents, blocked steps).
- **Priority:** P0
- **Complexity:** Medium
- **Database requirement:** `supabase/seed.sql` or a TypeScript seed script that creates comprehensive test data.
- **Already in wireframe?** No

#### M.2.5 — Rate Limiting and Abuse Prevention
- **What it is:** Rate limits on API endpoints (especially auth, search, and export) to prevent abuse. Supabase RLS handles authorization; rate limiting handles volumetric abuse.
- **Why it matters:** Even for an internal tool, a misconfigured client or a bug in the real-time subscription could flood the API.
- **Priority:** P1
- **Complexity:** Simple — Supabase Edge Functions support rate limiting. tRPC middleware can add limits.
- **Database requirement:** None — middleware concern.
- **Already in wireframe?** No

#### M.2.6 — Comprehensive Type Safety
- **What it is:** End-to-end type safety from database schema (auto-generated types) through tRPC routers to React components. Zero `any` types. Strict TypeScript config.
- **Why it matters:** Type safety prevents entire categories of bugs (wrong field name, missing required field, type mismatch) that are especially dangerous in a compliance tool where data integrity is paramount.
- **Priority:** P0
- **Complexity:** Medium — disciplined use of generated types + tRPC inference.
- **Database requirement:** `database.types.ts` auto-generated from Supabase. tRPC routers use Zod schemas matching the database types.
- **Already in wireframe?** Yes — CLAUDE.md specifies "TypeScript strict."

### M.3 — From the INVESTOR Perspective

#### M.3.1 — Compliance Certificate Generation
- **What it is:** Generate a formal compliance certificate per asset as a PDF: "As of [date], [Asset Name] has completed X/Y governance steps, all required documents are on file, all approvals have been obtained, insurance is active through [date]." Signed by the Compliance Officer or CEO.
- **Why it matters:** Investors and regulators want a single-page summary, not a 100-page activity log. A compliance certificate is the executive summary that references the full audit trail.
- **Priority:** P2
- **Complexity:** Medium — templated PDF with dynamic data.
- **Database requirement:** `compliance_certificates` table: `asset_id`, `generated_at`, `generated_by`, `period_covered`, `score`, `file_path`, `signature_data`. Or generate on-demand without persistence.
- **Already in wireframe?** No

#### M.3.2 — Data Room Preparation
- **What it is:** One-click generation of a complete data room for an asset — organized folder structure with all documents, audit trail export, compliance certificate, financial summary, partner directory.
- **Why it matters:** When an investor or acquirer requests a data room, PleoChrome should be able to produce it in minutes, not days. This is a major differentiator vs. manual operations.
- **Priority:** P2
- **Complexity:** Complex — aggregation + packaging + ZIP generation.
- **Database requirement:** No new tables. Edge Function: `generate_data_room(asset_id)` queries all related documents, generates audit trail PDF, compliance certificate, and packages into organized ZIP.
- **Already in wireframe?** No

#### M.3.3 — Regulatory Filing Tracker
- **What it is:** Dedicated tracker for all regulatory filings per asset: Form D, Blue Sky notices, state registrations, UCC-1 filings. Status: not started, in progress, filed, confirmed, rejected. Filing dates and confirmation numbers.
- **Why it matters:** SEC examiner will ask: "Show me when you filed Form D and the confirmation." This needs to be instant, not a 30-minute search through emails and documents.
- **Priority:** P1
- **Complexity:** Medium
- **Database requirement:** Could be handled within governance steps (Step "File Form D" with completion evidence), but a dedicated `regulatory_filings` table would be cleaner: `asset_id`, `filing_type`, `jurisdiction`, `filed_date`, `confirmation_number`, `status`, `document_id`, `notes`.
- **Already in wireframe?** Partial — governance steps include filing tasks, but there's no dedicated filing tracker view.

#### M.3.4 — KYC/AML Status Dashboard
- **What it is:** Dedicated view showing KYC/AML status for all asset holders and beneficial owners. Verification dates, expiry dates, screening results (OFAC, PEP, adverse media), enhanced DD flags.
- **Why it matters:** This is the first thing a compliance auditor or regulator asks for. Having it as a dedicated, real-time view (not buried in asset metadata) proves systematic compliance.
- **Priority:** P1
- **Complexity:** Medium
- **Database requirement:** Data exists in `assets.metadata.holder` JSONB and `contacts` table. Need a dedicated view: `v_kyc_dashboard` aggregating KYC status across all contacts/holders.
- **Already in wireframe?** Partial — Asset Detail shows KYC status per holder. Compliance Dashboard shows expiry warnings. But no dedicated KYC-focused view.

#### M.3.5 — Third-Party Audit Access
- **What it is:** Ability to grant temporary, read-only access to an external auditor, regulator, or counsel. Scoped to specific assets and date ranges. All auditor actions are logged. Auto-expires after the audit period.
- **Why it matters:** SEC examiners, external auditors, and institutional investor due diligence teams need access without getting full CRM permissions. Self-service access reduces friction and demonstrates transparency.
- **Priority:** P3
- **Complexity:** Complex — new auth role, scoped RLS, auto-expiry.
- **Database requirement:** `audit_access` table: `user_id`, `granted_by`, `asset_ids` (uuid[]), `expires_at`, `scope` (read-only), `ip_whitelist` (optional). RLS policies for 'auditor' role.
- **Already in wireframe?** No — wireframe mentions ReadOnly/External role but doesn't specify temporary/scoped access.

---

## N. SIMPLICITY GUARDRAILS

For a **3-person team managing 1-5 assets**, many enterprise CRM features add complexity without proportional value. This section flags features that should be explicitly deferred or simplified.

### Features That Are OVERKILL for Current Stage

| Feature | Why It's Overkill | When It Becomes Relevant |
|---------|-------------------|-------------------------|
| A.8 — Inline Document Annotations | 3 people can just say "check page 3" | 10+ people or external reviewer access |
| B.9 — Subtasks | Step -> Task is already one nesting level; subtasks add a third | 10+ tasks per step regularly |
| B.10 — Time Tracking | 3 people don't need billable hour tracking | Headcount > 5 or per-hour billing |
| B.12 — Bulk Task Operations | Max ~200 tasks across all assets | 500+ tasks or frequent reassignment |
| C.4 — Digest Mode | 5-10 emails/day is manageable | 50+ notifications/day |
| C.10 — Push Notifications | No mobile app planned | Mobile app exists |
| D.5 — Approval Delegation | 3 people can text each other | External approvers or board members |
| D.8 — Approval SLAs | 3 people respond within hours | External approvers with slower turnaround |
| E.9 — E-Signature Integration | Manual PDF upload works for 1-5 deals | 10+ simultaneous deals with investor signings |
| E.11 — Full-Text Document Search | 500 documents searchable by filename/type | 5,000+ documents |
| H.6 — Saved Views/Filters | Limited filter combinations with few assets | 20+ assets, complex filtering needed daily |
| I.4 — Calendar Integration | 3 people manage calendars manually | 5+ team members or formal scheduling |
| I.9 — Slack/Teams Notifications | 3 people check the CRM directly | 10+ team members in different tools |
| K.7 — Investor Support/Contact | 0 investors currently | First investor onboarded |
| M.1.3 — Email BCC Capture | Complex infrastructure for 3 people | 5+ people with external communication volume |

### Features That Seem Simple But Are MANDATORY

| Feature | Why It's Mandatory Despite Team Size |
|---------|-------------------------------------|
| F.1 — Immutable Audit Trail | SEC/regulatory requirement. Non-negotiable regardless of team size. |
| E.6 — Legal Hold | Single locked document prevents a legal disaster. |
| D.1 — Step-Level Approvals | Even 3 people need formal sign-off for regulatory steps. |
| C.7 — Insurance Expiry Warnings | One lapsed insurance policy = catastrophic risk on a $10M asset. |
| C.8 — Compliance Deadline Alerts | Missing a Form D deadline = SEC violation. |
| J.1 — MFA Authentication | 3 people with access to $10M+ asset data need MFA. |
| F.6 — Export to PDF/CSV | The first thing an investor or regulator asks for. |

### Recommended Build Order (MVP to Quarter 1)

**MVP (P0) — The "Can We Operate?" Release**
Build the minimum feature set that allows Shane, David, and Chris to actually manage an asset through the governance pipeline, with the audit trail that makes an investor take them seriously.

Core pages: Pipeline Board, Asset Detail (all tabs), Partners, Documents, Tasks, Activity Log, Settings (auth/notifications), New Asset Wizard.

Key features: Asset CRUD, governance step tracking, task management (basic), document upload with versioning, immutable audit trail, gate checks, approval workflow, notifications (in-app), search (Cmd+K), RBAC, MFA.

**P1 — The "Now It's Comfortable" Release (Launch Week)**
Polish: rich text comments, task dependencies, email notifications, provenance chain, risk register, keyboard shortcuts, recent items, mobile responsive verification, PDF export, cost tracking.

**P2 — The "Month 1 Maturity" Release**
Depth: AI document classification, meeting summarization, compliance certificates, data room generation, saved views, document sharing, bulk operations, partner performance tracking, storage management, recurring tasks.

**P3 — The "Quarter 1 Expansion" Release**
Scale: investor portal, calendar integration, e-signatures, Chainlink PoR, tokenization API, approval delegation, third-party audit access, regulatory filing tracker, KYC dashboard, Slack integration, API keys.

---

## FEATURE COUNT SUMMARY

| Category | Total Features | P0 | P1 | P2 | P3 | P4 |
|----------|---------------|-----|-----|-----|-----|-----|
| A. Commenting & Notes | 8 | 3 | 2 | 2 | 0 | 1 |
| B. Task Management | 12 | 5 | 3 | 2 | 0 | 2 |
| C. Notifications & Alerts | 10 | 4 | 2 | 2 | 1 | 1 |
| D. Approval Workflows | 8 | 4 | 1 | 2 | 1 | 0 |
| E. Document Management | 12 | 5 | 2 | 3 | 1 | 1 |
| F. Activity & Audit Trail | 9 | 7 | 1 | 0 | 0 | 0 |
| G. Reporting & Analytics | 9 | 2 | 3 | 3 | 1 | 0 |
| H. Search & Navigation | 6 | 3 | 2 | 1 | 0 | 0 |
| I. Integrations | 9 | 1 | 1 | 2 | 4 | 0 |
| J. User Management | 7 | 3 | 2 | 1 | 1 | 0 |
| K. Investor-Facing | 7 | 0 | 0 | 0 | 5 | 2 |
| L. Asset-Specific | 9 | 3 | 4 | 2 | 0 | 0 |
| M. Missing Features | 12 | 4 | 4 | 2 | 2 | 0 |
| **TOTAL** | **118** | **44** | **27** | **22** | **16** | **7** |

---

## CROSS-REFERENCE: WIREFRAME COVERAGE

Features that exist in the wireframe spec but are NOT in this feature map: **None.** This feature map is a superset of the wireframe.

Features in this feature map that are NOT in the wireframe:
- A.4 — Comment editing/deletion policy
- A.5 — Private notes
- A.8 — Inline document annotations
- B.6 — Task dependencies (at task level)
- B.7 — Recurring tasks
- B.9 — Subtasks
- B.10 — Time tracking
- C.4 — Digest mode
- C.5 — Escalation
- C.9 — Partner response tracking
- D.4 — Cost approvals
- D.5 — Approval delegation
- D.8 — Approval SLAs
- E.8 — Document templates
- E.10 — Document sharing (secure links)
- E.11 — Full-text document search
- G.7 — Investor reporting (quarterly)
- H.6 — Saved views/filters
- I.4 — Calendar integration
- I.9 — Slack/Teams notifications
- K.1 through K.7 — Entire investor portal section
- L.2 — Provenance chain visualization (partial)
- L.7 — Media gallery
- M.1.1 — Quick-add capture
- M.1.2 — Dashboard "My Day" view
- M.1.3 — Email BCC capture
- M.2.1 — Optimistic UI updates
- M.2.4 — Seed data for development
- M.2.5 — Rate limiting
- M.3.1 — Compliance certificate generation
- M.3.2 — Data room preparation
- M.3.3 — Regulatory filing tracker
- M.3.4 — KYC/AML dashboard
- M.3.5 — Third-party audit access

**Total new features not in wireframe: 34** — these represent the gaps identified through web research, three-perspective analysis, and industry best practices.

---

*This feature map was researched using industry best practices from CRM implementation checklists, deal pipeline management patterns, compliance management software requirements, document management system standards, task management system features, SEC audit trail requirements, notification system architecture, approval workflow patterns, investor portal requirements, and real estate deal management CRM features.*

*Sources consulted:*
- [33 CRM Features Your Small Business Needs in 2026](https://www.onepagecrm.com/blog/crm-features/)
- [CRM Requirements Checklist 2026](https://www.brevo.com/blog/crm-requirements/)
- [Pipeline and Deal Management — Intapp DealCloud](https://www.intapp.com/dealcloud/pipeline-deal-management/)
- [Top 10 Features Every Compliance Platform Should Have](https://www.starcompliance.com/10-features-any-compliance-platform-should-have/)
- [Compliance Management Software: Core Features Checklist](https://expiryedge.com/blogs/compliance-management-software-core-features-checklist/)
- [Document Management System Requirements — SPD Technology](https://spd.tech/legaltech-development/a-brief-guide-to-document-management-system-requirements/)
- [Essential Features of Task Management Software — Zoho](https://www.zoho.com/projects/task-management/essential-features.html)
- [Audit Trail Requirements: Guidelines for Compliance](https://www.inscopehq.com/post/audit-trail-requirements-guidelines-for-compliance-and-best-practices)
- [Notification System Design Patterns — SuprSend](https://www.suprsend.com/post/top-6-design-patterns-for-building-effective-notification-systems-for-developers)
- [Approval Workflow Software — Digital Project Manager](https://thedigitalprojectmanager.com/tools/best-approval-workflow-software/)
- [7 Must-Have Investor Portal Features](https://copiawealthstudios.com/blog/7-must-have-investor-portal-features-for-growth-in-2025)
- [Asset Management CRM Guide — Creatio](https://www.creatio.com/glossary/asset-management-crm)
- [Commercial Real Estate CRM — CREPipeline](https://crepipeline.com/)
- [Design a Comment System — System Design School](https://systemdesignschool.io/problems/comment-system/solution)
