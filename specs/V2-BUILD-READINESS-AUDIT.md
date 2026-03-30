# PleoChrome V2 — Build Readiness Audit
# Can we actually build every feature without dead ends?

> Date: 2026-03-30
> Purpose: Verify EVERY feature has SQL + Router + UI + Wiring + Testing detail
> Verdict: **NOT READY YET — 14 gaps identified below**

---

## Audit Criteria (5-point check per feature)

| # | Criteria | Question |
|---|----------|----------|
| 1 | **SQL** | Table exists with all columns, types, constraints, indexes? |
| 2 | **Router** | tRPC procedures defined with input/output shapes? |
| 3 | **UI** | Component specs exist (what it looks like, what data it shows)? |
| 4 | **Wiring** | Data flow specified (which query → which component, which mutation → which invalidation)? |
| 5 | **Testing** | Verification steps defined (API test, browser test, manual test)? |

---

## FEATURE-BY-FEATURE AUDIT

### ✅ READY TO BUILD (sufficient detail)

| Feature | SQL | Router | UI | Wiring | Testing | Notes |
|---------|-----|--------|-----|--------|---------|-------|
| Phase → Stage hierarchy | ✅ | ✅ | ✅ | ✅ | ✅ | Blueprint + Addendum + Plan |
| Asset CRUD | ✅ | ✅ | ✅ | ✅ | ✅ | Well specified |
| Pipeline Board (kanban/list/dashboard) | ✅ | ✅ | ✅ | ✅ | ✅ | Exists in V1, rewrite clear |
| Asset Detail shell (hero, tabs, timeline) | ✅ | ✅ | ✅ | ✅ | ✅ | Exists in V1, rewrite clear |
| Stage reorder (drag-and-drop) | ✅ | ✅ | ✅ | ✅ | ✅ | sort_order + @dnd-kit |
| Stage hide/unhide | ✅ | ✅ | ✅ | ✅ | ✅ | is_hidden + confirmation |
| Soft gates (advisory) | ✅ | ✅ | ✅ | ✅ | ✅ | RPC + warning dialog UX specced |
| Activity/audit trail | ✅ | ✅ | ✅ | ✅ | ✅ | Immutable log, trigger-based |
| Template instantiation | ✅ | ✅ | — | ✅ | ✅ | Two-template merge RPC |
| Save-as-template | ✅ | ✅ | ✅ | ✅ | ✅ | RPC + modal specced |

### ⚠️ GAPS — Need More Detail Before Building

---

### GAP 1: Task + Subtask Wiring (within a stage)

**What's missing:** The Stage Accordion component is referenced but the exact data flow for expanding a stage → loading tasks → expanding a task → loading subtasks is not specified.

**Fix — add to Architecture Rules:**

```
StageAccordion data flow:
1. stages.listByAsset(assetId) returns all stages (with is_hidden filtered in UI)
2. User clicks stage → expands accordion
3. tasks.listByStage(stageId) returns tasks for that stage (lazy loaded)
4. Each TaskCard shows: type icon, title, assignee avatar, subtask progress (X/Y), comment count, partner badge
5. User clicks task → expands inline
6. subtasks.listByTask(taskId) returns subtasks (lazy loaded)
7. Each subtask row: checkbox, type icon, title, assignee, status badge
8. Checkbox click → subtasks.complete(subtaskId) → invalidate tasks.listByStage + stages.listByAsset

Task creation on live asset:
1. User clicks "+ Add Task" at bottom of stage's task list
2. Inline form appears: title input, task type dropdown, assignee dropdown, due date picker
3. Submit → tasks.create({ stageId, title, taskType, assignedTo, dueDate })
4. Invalidate tasks.listByStage + stages.listByAsset
5. New task appears at bottom of list

Subtask creation on live asset:
1. User clicks "+ Add Subtask" at bottom of task's subtask list
2. Inline form: title input, type dropdown
3. Submit → subtasks.create({ taskId, title, subtaskType })
4. Invalidate subtasks.listByTask

Stage creation on live asset:
1. User clicks "+ Add Stage" at bottom of phase section
2. Inline form: name input, description textarea
3. Submit → stages.create({ assetId, phase, name, description })
4. Invalidate stages.listByAsset
5. New stage appears at bottom of that phase with sort_order = max + 1
```

---

### GAP 2: Comment System Wiring

**What's missing:** Comment thread rendering, @mention detection, reply chain, notification trigger.

**Fix:**

```
Comment data flow:
1. comments.listByEntity({ entityType: 'task', entityId: taskId }) returns comments
   - Includes team_members join for author name/avatar
   - Ordered by created_at ascending
   - Replies nested under parent (parent_comment_id)
2. User types comment in textarea at bottom of thread
3. @mention detection: when user types "@", show dropdown of team_members
   - Match by name prefix
   - Insert @[full_name](team_member_id) markdown-style
4. Submit → comments.create({ entityType, entityId, body, parentCommentId? })
5. Server-side: parse body for @mentions → create notification for each mentioned user
6. If parentCommentId set → create notification for parent comment author
7. Invalidate comments.listByEntity

Comment thread UI:
- Top-level comments: left-aligned, full width
- Replies: indented 24px, connected by thin line
- Each comment: avatar, name, timestamp, body text, "Reply" button
- @mentions rendered as teal-colored linked text
- "Edit" button on own comments only
- Deleted comments show "[deleted]" to preserve thread

Notifications created:
- comment_mention → for each @mentioned user
- comment_reply → for parent comment author (if reply)
```

---

### GAP 3: Approval Chain Execution

**What's missing:** What happens step-by-step when approval is requested, first approver acts, chain advances.

**Fix:**

```
Approval chain flow:
1. Task has approval requirement (task.requires_approval = true OR task_type = 'approval')
2. When all subtasks complete → task auto-moves to status 'pending_approval'
3. System creates approval records based on task's approval config:
   - Sequential: approver_1 gets notification, then approver_2 after #1 approves
   - Parallel: all approvers get notification simultaneously
4. Approver opens Approval Queue → sees pending item with context
5. Approver clicks Approve or Reject:
   - approvals.decide({ approvalId, decision: 'approved'|'rejected', reason? })
6. If approved AND sequential → check if next approver exists → create their notification
7. If approved AND all approvers done → task.status → 'approved' → then 'done'
8. If rejected → task.status → 'rejected' → notification to task assignee
   - Assignee must fix and re-request approval
9. All decisions logged to activity_log

Approval config on tasks (JSONB):
{
  "mode": "sequential",  // or "parallel"
  "approvers": [
    { "team_member_id": "uuid-shane", "order": 1 },
    { "team_member_id": "uuid-david", "order": 2 }
  ]
}
```

---

### GAP 4: Notification System Trigger Logic

**What's missing:** WHO creates notifications — app layer or DB triggers? And the exact list of triggers.

**Fix:**

```
Notifications are created in the APPLICATION LAYER (tRPC mutations), not DB triggers.
Reason: DB triggers can't easily resolve @mentions or determine which user should be notified.

Notification creation points (in tRPC mutations):

| Trigger Action | Notification Type | Recipient |
|---------------|-------------------|-----------|
| comments.create with @mention | comment_mention | Each @mentioned user |
| comments.create with parentCommentId | comment_reply | Parent comment author |
| tasks.create with assigned_to | task_assigned | Assignee |
| subtasks.create with assigned_to | subtask_assigned | Assignee |
| approvals.request | approval_requested | Approver |
| approvals.decide | approval_decision | Approval requester |
| stages.updateStatus to 'completed' | stage_completed | Asset lead |
| assets.advancePhase | phase_advanced | All assigned team members |
| documents.create on a task | document_uploaded | Task assignee (if not uploader) |
| [cron/scheduled] task approaching deadline | deadline_approaching | Task assignee |
| [cron/scheduled] task past deadline | deadline_overdue | Task assignee + asset lead |
| stages.evaluate gate ready | gate_ready | Asset lead |
| assets.update status | asset_status_changed | All assigned team members |

Each notification record:
{
  user_id: UUID (recipient),
  type: v2_notification_type,
  title: "Shane mentioned you in a comment",
  body: "On task 'Run OFAC screening' for Emerald Barrel",
  entity_type: 'comment' | 'task' | 'approval' | 'asset' | etc.,
  entity_id: UUID,
  asset_id: UUID (for navigation),
  is_read: false,
  created_at: timestamp
}
```

---

### GAP 5: Meeting System Router + UI

**What's missing:** No router procedures defined, no UI component specs.

**Fix:**

```
meetings router:
- list({ assetId?, dateRange?, type?, limit, cursor }) → paginated meetings
- getById({ meetingId }) → full meeting with attendees, agenda, transcript, action items
- create({ title, meetingType, scheduledAt, assetId?, stageId?, taskId?, partnerId?,
           internalAttendees, externalAttendees, agendaItems }) → new meeting
- update({ meetingId, ...fields }) → update meeting
- complete({ meetingId, summary, keyDecisions, actionItems, transcript?, transcriptSource? })
  → marks completed, processes action items
- convertActionItem({ meetingId, actionItemIndex, stageId? })
  → creates task from action item, links back via created_task_id
- delete({ meetingId }) → soft delete
- getAgendaTemplate({ meetingType }) → returns default agenda items for that type

Meetings page UI:
- Table: date, title, type badge, asset link, partner link, duration, status
- "New Meeting" button → modal with form
- Click row → meeting detail view

Meeting detail view:
- Header: title, type, date, duration, location
- Attendees section: internal (avatars) + external (name/company list)
- Agenda: checklist of topics with notes per item
- Transcript: expandable/collapsible large text area
  - "Paste Transcript" button → opens full-screen textarea
- Summary: editable text
- Key Decisions: list with decision, rationale, decided_by
- Action Items: list with description, assignee, due date
  - Each has "Convert to Task" button (if not yet converted)
  - Converted items show link to created task
- Documents: uploaded meeting materials (drag-drop zone)

Meeting linked to asset shows in:
- Asset Detail → Activity tab (as timeline entry)
- Asset Detail → relevant stage/task (if linked)
```

---

### GAP 6: SOP System Router + UI

**What's missing:** No router, no UI, no seeding plan.

**Fix:**

```
sops router:
- list({ taskType?, valueModel? }) → all SOPs with filters
- getById({ sopId }) → full SOP
- getForTask({ taskType, valueModel? }) → SOP matching a task context
- create({ title, taskType, valueModel?, purpose, steps, tips, regulatoryCitation })
- update({ sopId, ...fields })
- deactivate({ sopId }) → sets is_active = false

SOP UI (Phase 7 — not Phase 1):
- NOT a standalone page initially
- Instead: "View SOP" button on TaskCard (if SOP exists for that task_type)
- Click → right slide-out panel showing:
  - Title, purpose
  - Step-by-step instructions (numbered list)
  - Tips section
  - Regulatory citation
  - "Close" button

SOP seeding (Phase 1 — in template seed):
- Create 1 SOP per task type as a starting template
- Content derived from Google Drive /10 - Standard Operating Procedures/
- These are placeholder SOPs — team will refine over time

Future: standalone /crm/sops page for browsing and editing all SOPs
```

---

### GAP 7: Reminders Router + UI + Scheduling

**What's missing:** No router, no UI, no cron/scheduling mechanism.

**Fix:**

```
reminders router:
- list({ userId, status?, limit, cursor }) → user's reminders
- create({ title, remindAt, assetId?, taskId?, contactId?, partnerId?, meetingId?,
           isRecurring?, recurrenceRule? })
- dismiss({ reminderId }) → status = 'dismissed'
- snooze({ reminderId, snoozeUntil }) → status = 'snoozed', snoozed_until set
- delete({ reminderId }) → hard delete

Reminder UI:
- "Set Reminder" button on: tasks, contacts, partners, meetings
- Click → small popover: date/time picker, optional recurrence dropdown
- Dashboard widget: "Upcoming Reminders" (next 7 days)
- Notification panel: due reminders appear as notifications

Scheduling mechanism (Phase 7):
- Option A: Supabase Edge Function on cron (every 15 min)
  → SELECT * FROM reminders WHERE remind_at <= now() AND status = 'pending'
  → For each: create notification, update status to 'sent'
  → For recurring: create next reminder based on recurrence_rule
- Option B: Client-side check on dashboard load (simpler, less real-time)
  → reminders.getDue() query on dashboard mount
  → Show in notification panel

Start with Option B (client-side). Add Option A when Edge Functions are needed.
```

---

### GAP 8: Ownership/KYC Router + UI

**What's missing:** Router procedures not fully listed, OwnershipTree component not detailed.

**Fix:**

```
contacts router (enhanced):
- list({ role?, kycStatus?, contactType?, search, limit, cursor })
- getById({ contactId }) → contact + kyc_records + ownership_links + linked assets
- create({ fullName, contactType, email, phone, ...kycFields, ...entityFields })
- update({ contactId, ...fields })
- linkToAsset({ contactId, assetId, role, ownershipPercentage?, isPrimary? })

ownership router:
- getOwnershipTree({ contactId }) → recursive tree of entity → beneficial owners
- addBeneficialOwner({ parentContactId, childContactId, ownershipPercentage, isControlPerson, roleTitle })
- updateOwnershipLink({ linkId, ownershipPercentage?, isControlPerson?, roleTitle? })
- removeOwnershipLink({ linkId }) → soft deactivate

kyc router:
- listByContact({ contactId }) → all KYC records for a contact
- create({ contactId, checkType, provider, status, resultDetails?, flags?, documentId? })
- update({ kycRecordId, status, resultDetails?, flags? })
- getExpiring({ daysAhead: 30 }) → KYC records expiring within N days
- getIncomplete({ assetId }) → contacts linked to asset with incomplete KYC

OwnershipTree component:
- Input: assetId
- Fetches: asset_owners for the asset → for each owner:
  - If individual: show name, KYC status badges (identity ✅, OFAC ✅, PEP ✅)
  - If entity: show entity name, KYB status, then fetch ownership_links → recursively show beneficial owners
- Each node is clickable → navigates to contact detail
- Each node shows: name, ownership %, role, KYC status traffic light (green/yellow/red)
- "Add Owner" button at top → AddOwnerModal
  - Toggle: Individual / Entity
  - If entity: after creating, prompt "Add beneficial owners?"

KYC Status Panel (on contact detail page):
- List of all kyc_records for this contact
- Each row: check_type, status badge, performed_at, expires_at, provider
- "Run Check" button per type → creates new kyc_record with status 'pending'
- "Upload Evidence" → links document to kyc_record
- Traffic light summary at top: ✅ All clear | ⚠️ Expiring | 🔴 Failed/Missing
```

---

### GAP 9: Partner Onboarding Router + UI

**What's missing:** No router procedures, no UI for onboarding flow.

**Fix:**

```
partners router (enhanced, add to existing):
- getOnboardingItems({ partnerId }) → DD items with status
- createOnboardingItem({ partnerId, itemName, itemType, description })
- updateOnboardingItem({ itemId, status, verifiedBy?, documentId?, notes? })
- getCredentials({ partnerId }) → credentials list
- addCredential({ partnerId, credentialType, credentialName, issuingBody, credentialNumber, issuedAt, expiresAt, documentId?, verificationUrl? })
- updateCredential({ credentialId, ...fields })
- getExpiringCredentials({ daysAhead: 30 }) → expiring across all partners
- seedDefaultOnboarding({ partnerId, partnerType }) → creates default DD items for that partner type

Partner Detail page (enhanced):
- Overview tab: existing (contact info, DD status)
- Onboarding tab (NEW):
  - Progress bar: X/Y items completed
  - List of onboarding items, each with: name, type badge, status badge
  - Click item → expand: description, notes, evidence document link
  - "Complete" button → marks verified, records who/when
  - "Add Item" button → add custom DD item
- Credentials tab (NEW):
  - List of credentials: name, issuer, number, issued date, expiry, status
  - ⚠️ badge on expiring within 30 days
  - "Add Credential" button → form
  - "Upload Certificate" → links document
- Assignments tab (existing → enhanced):
  - Shows all assets where this partner is linked
  - Shows all tasks assigned to this partner across assets
  - Click task → navigate to asset detail
- Communications tab (NEW):
  - communication_log entries for this partner
  - "Log Communication" button → form (type, direction, summary, duration)
```

---

### GAP 10: Communication Log Router + UI

**What's missing:** Router procedures listed but UI not specified.

**Fix:**

```
communications router:
- create({ contactId?, partnerId?, assetId?, taskId?, commType, direction, subject, summary, durationMinutes?, attendees?, actionItems?, documentId? })
- listByContact({ contactId, limit, cursor })
- listByPartner({ partnerId, limit, cursor })
- listByAsset({ assetId, limit, cursor })

Communication log UI:
- NOT a standalone page. Appears as a tab/section on:
  - Contact detail → Communications tab
  - Partner detail → Communications tab
  - Asset detail → Activity tab (mixed in with other activity)
- Each entry: type icon (📧 email, 📞 phone, 💬 text, 📝 letter, 🖥️ video, 👤 in-person)
- Direction arrow (↗ outbound, ↙ inbound)
- Subject, summary (expandable), duration, attendees, action items
- "Log Communication" button → modal form:
  - Type dropdown, direction toggle, subject, summary textarea
  - Optional: asset link, task link, duration, attendees, document upload
```

---

### GAP 11: Template Editor Wiring

**What's missing:** The template editor page (/crm/templates/[id]) is referenced but the interaction flow is not detailed.

**Fix:**

```
Template editor page flow:
1. templates.getById(templateId) → returns template with stages[], each with tasks[], each with subtasks[]
2. Display: stages grouped by phase, each expandable
3. Within each phase section:
   - Stages listed vertically with drag handles (DnD reorder via @dnd-kit)
   - Each stage: name (editable inline), description (editable), gate toggle, regulatory fields
   - "+ Add Stage" button at bottom of phase
4. Click stage → expands to show tasks:
   - Tasks listed with drag handles
   - Each task: title (editable), type dropdown, partner_type dropdown, estimated duration
   - "+ Add Task" button at bottom
5. Click task → expands to show subtasks:
   - Subtask list with drag handles
   - Each subtask: title (editable), type dropdown, requires_approval toggle
   - "+ Add Subtask" button
6. All edits are auto-saved (debounced) OR explicit "Save" button

Mutations used:
- templates.updateStage({ stageId, name?, description?, isGate?, regulatoryBasis?, regulatoryCitation? })
- templates.addStage({ templateId, phase, name, description })
- templates.removeStage({ stageId }) → confirm dialog
- templates.reorderStages({ templateId, phase, stageIds[] })
- templates.updateTask({ taskId, title?, description?, taskType?, partnerType?, estimatedDuration? })
- templates.addTask({ stageId, title, taskType, partnerType? })
- templates.removeTask({ taskId })
- templates.reorderTasks({ stageId, taskIds[] })
- templates.updateSubtask({ subtaskId, title?, subtaskType?, requiresApproval? })
- templates.addSubtask({ taskId, title, subtaskType? })
- templates.removeSubtask({ subtaskId })
- templates.reorderSubtasks({ taskId, subtaskIds[] })
```

---

### GAP 12: Document Required Checklist Wiring

**What's missing:** How the "required documents" feature works end-to-end.

**Fix:**

```
Required documents flow:
1. Each template_stage has required_document_types TEXT[] (e.g., ['gia_report', 'nda', 'kyc_report'])
2. When template is instantiated → asset_stages copies required_document_types
3. Documents tab on asset detail shows:
   - Section: "Required Documents" grouped by stage
   - Each required type: ✅ (uploaded) or ❌ (missing) with type label
   - Click ❌ → opens upload modal pre-set to that document type + stage
4. documents.getRequiredChecklist({ assetId }) router procedure:
   - For each stage with required_document_types:
     - For each required type:
       - Check if document with that type exists for this asset + stage
     - Return: { stageId, stageName, required: [{type, label, uploaded: bool, documentId?}] }
5. Compliance dashboard uses same data to calculate "document completeness %"
```

---

### GAP 13: Batch Document Download Implementation

**What's missing:** The actual JSZip implementation.

**Fix:**

```
Batch download flow:
1. User clicks "Download All Documents" on asset detail
2. Client calls documents.listByAsset({ assetId }) → gets all documents with storage_path
3. For each document: call documents.getDownloadUrl({ documentId }) → signed URL
4. Client-side JSZip:
   - Create ZIP with folder structure: /Phase_Name/Stage_Name/Task_Name/filename.ext
   - For each document: fetch signed URL → add to ZIP with correct path
   - Generate ZIP blob → trigger download
5. Progress bar showing: "Downloading X of Y documents..."
6. If >100MB total: show warning "Large download — this may take a moment"

Implementation (in a utility file):
- src/lib/batch-download.ts
- Uses 'jszip' package (already installed) + 'file-saver' (already installed)
- Parallel fetch with concurrency limit (5 at a time)
```

---

### GAP 14: Report Generation Implementation

**What's missing:** The actual report HTML/print structure.

**Fix:**

```
Report route: /crm/reports/[assetId]
- Server component that calls generate_asset_report(assetId) RPC
- Returns full JSONB with all phases/stages/tasks/subtasks/comments/documents
- Renders as a clean HTML page with print CSS

Report structure:
1. Cover: asset name, reference code, value model, current phase, created date, lead
2. Ownership: owner(s), beneficial owners, KYC status per person
3. For each phase (ordered):
   a. Phase header with status
   b. For each stage (ordered, skip hidden):
      - Stage name, status, dates (started, completed)
      - For each task:
        - Title, type, assignee, status, dates
        - For each subtask: title, status, who completed, when
        - Documents attached to this task
        - Comments on this task
      - Documents attached to this stage
   c. Gate status (passed/pending, who passed, when)
4. Financial summary: total costs, total revenue, P&L
5. Meeting log: all meetings with summaries
6. Communication log: all logged communications
7. Document index: all documents with upload date, type, task linkage
8. Full timeline (last 100 entries)

Print CSS:
- @media print { hide sidebar, header, nav }
- Page breaks between phases
- Monospace for reference codes, timestamps
- Tables with borders for document index
```

---

## ALSO: Build Rules We Might Have Forgotten

### ✅ Checked — Still in place:
- [ ] CLAUDE.md pre-flight — YES, in Architecture Rules Rule 4
- [ ] Neumorphic design system — YES, in Architecture Rules Section 3
- [ ] Dark + light mode — YES, in CLAUDE.md
- [ ] "asset" not "stone" — YES, in CLAUDE.md
- [ ] Platform-agnostic — YES, in CLAUDE.md
- [ ] Mobile-first design — YES, in CLAUDE.md
- [ ] Zod validation client + server — YES, in Architecture Rules Section 5
- [ ] Activity log immutable — YES, in Architecture Rules Section 6
- [ ] `npm run build` after every step — YES, in Architecture Rules Section 7
- [ ] File size limits — YES, in Architecture Rules Section 1
- [ ] CSS variables only — YES, in Architecture Rules Section 3
- [ ] Barrel exports — YES, noted in audit

### ⚠️ Rules That Need Reinforcement:

1. **Tailwind v4 `var()` gotcha** — `w-[var(--sidebar-width)]` NOT `w-[--sidebar-width]`
   → Already in global CLAUDE.md but should be re-read before every CSS change

2. **tRPC fetch adapter** — NOT @trpc/next. Using fetch handler in App Router.
   → Already in trpc.ts but builder must not accidentally import @trpc/next

3. **Admin Supabase client** — uses `createClient` from `@supabase/supabase-js` (not SSR client)
   → Already in supabase-server.ts but important for new routers

4. **Dev mode auth bypass** — first team_member (Shane) used as mock user
   → Already in trpc.ts context creation

5. **Supabase Realtime** — for live updates on pipeline board and activity feed
   → Already implemented in V1 page.tsx, must be preserved in V2 rewrite

---

## VERDICT

**14 gaps found.** All gaps are now documented with complete implementation details above.

With this addendum, every feature now has:
- SQL ✅ (tables + columns defined)
- Router ✅ (procedures + input/output specified)
- UI ✅ (component behavior + layout described)
- Wiring ✅ (data flow + invalidation specified)
- Testing ✅ (in Implementation Plan checklists)

**Ready to build after this file is committed.**
