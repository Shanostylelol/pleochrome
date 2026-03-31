# Build Direction — PleoChrome Powerhouse CRM V2

**Last Updated:** 2026-03-31
**Read After:** SESSION-HANDOFF.md → CLAUDE.md → This file

---

## THE PROBLEM

The CRM has correct infrastructure (28 tables, 23 routers, 18 pages, 50+ components) but the interaction model is **surface-level**. Types are cosmetic dots that don't trigger behavior. Notes don't save visibly. Files only work at one level. Nothing creates proper audit records. The user said: "Think about what I'm really trying to get you to build."

**This is an asset-type agnostic pipeline management CRM.** Not a gemstone app. The core patterns must work for ANY real-world asset flowing through a governance lifecycle.

---

## WHAT TO BUILD (Priority Order)

### 1. TYPE-SPECIFIC SUBTASK RENDERERS

**Core concept:** When a subtask has a type, it should render a TYPE-SPECIFIC UI that captures the RIGHT data for that action.

| Type | What It Renders | What It Captures |
|------|----------------|-----------------|
| `document_upload` | Inline upload zone + file list + version history | Files, version notes, upload timestamp |
| `meeting` | Meeting quick-form (title, date, attendees) + calendar link | Meeting record linked to subtask |
| `approval` | Approval request panel (what needs approval, who approves) | Approval decision, reason, timestamp |
| `call` | Call log form (who, duration, outcome) | Call record with timestamp |
| `email` | Email log form (to, subject, summary) | Email record with timestamp |
| `note` | Rich text note area with save button | Timestamped note with author |
| `verification` | Checklist with pass/fail + evidence attachment | Verification result + evidence files |
| `signature` | Signature request status + signed doc upload | Signature status + document |
| `research` | Notes area + file attachment for findings | Research notes + supporting docs |
| `follow_up` | Due date + notes + linked entity | Follow-up record |
| `review` | Review form (decision, notes, attachments) | Review outcome |
| `filing` | Filing form (where filed, reference number, date) | Filing record |
| `communication` | Communication log (type, direction, summary) | Comms record |

**Implementation:** Create a `SubtaskTypeRenderer` component that switches on `subtask_type` and renders the appropriate inline UI below the subtask row when expanded.

### 2. UNIVERSAL CONVERSATION THREAD

**Core concept:** Every entity (stage, task, subtask, document) gets a unified activity/conversation feed. NOT separate "notes" and "comments" — one system.

**What each entry shows:**
- Author avatar + name
- Timestamp (relative + absolute)
- Content (text, @mentions highlighted)
- Attached files (if any)
- Action type badge (comment, note, status_change, file_upload, etc.)

**@mentions:** Type `@` → dropdown of team members → select → creates notification for that user. Use existing `comments.create` router which already has @mention detection.

**Where it appears:**
- Task detail (already has TaskCommentThread — extend it)
- Subtask detail (new — add SubtaskActivityThread)
- Stage level (new — add to StageAccordion)
- Document level (new — add to file list items)

### 3. UNIVERSAL FILE ATTACHMENT

**Core concept:** Files attachable at stage, task, AND subtask level. With version history.

**Current state:** TaskFileList exists for task-level files. Extend the pattern.

**What to build:**
- `SubtaskFileList` — same as TaskFileList but passes `subtaskId` instead of `taskId`
- Stage-level file attachment (add to StageAccordion footer)
- Document version chain UI (show previous versions with timestamps)
- The `documents` table already has `task_id`, `stage_id` FKs — just need UI

### 4. VISIBLE SAVE STATES

**Core concept:** Every mutation shows feedback. User always knows if an action saved.

**Already done:** Toast error handlers on all 16 workflow mutations.
**Still needed:**
- Success toast on key actions (task complete, subtask create, file upload)
- "Saved" indicator on inline edits (subtask title, notes)
- Reminder save confirmation + reminder history view
- Loading spinners on all mutation buttons (`isPending` state)

### 5. CLEAR TYPE SELECTORS

**Current:** Tiny 2.5px colored dots that users don't understand.
**Replace with:** Dropdown selectors with labels, like the "No type" dropdown on the add subtask form — but extend to existing subtasks too. Show the type label text, not just a dot.

**Also needed:**
- Stage type selector (what kind of stage is this?)
- Task type is already a badge — make it a clearer dropdown too

### 6. NOTIFICATION TRIGGERS

**Current:** Only `task_assigned` creates notifications.
**Add triggers for:**
- `comment_mention` — when @mentioned in a comment
- `comment_reply` — when someone replies to your comment
- `approval_requested` — when an approval is assigned to you
- `approval_decision` — when your request is approved/rejected
- `stage_completed` — when a stage you own completes
- `phase_advanced` — when asset advances phase
- `document_uploaded` — when a document is added to your asset
- `deadline_approaching` — 24h before due date (needs cron or getDue check)

### 7. APPROVAL CHAIN COMPLETION

**Current:** Approval records created but task doesn't auto-advance.
**Build:** When all approvers approve → task status auto-changes to `approved` → then `done`. If any reject → task status = `rejected`, assignee notified.

### 8. TEMPLATE EDITOR COMPLETION

**Current:** Can add stages/tasks but can't delete or reorder them.
**Build:** `templates.removeStage`, `templates.removeTask`, `templates.removeSubtask` mutations + delete buttons in editor + DnD reorder.

---

## WHAT NOT TO TOUCH

- Database schema is solid — don't change tables
- Router structure is correct — add procedures, don't reorganize
- Page routing is correct — don't change URLs
- Design system is correct — keep neumorphic CSS variables
- Template seeding is correct — don't re-seed

---

## HOW TO TEST

1. Delete test assets (keep templates): `DELETE FROM assets WHERE name LIKE 'E2E%' OR name LIKE 'Test%'`
2. Create fresh asset through New Asset wizard (/crm/assets/new)
3. Select Tokenization value model → verify 35 stages, 92 tasks instantiated
4. Walk through Lead phase: expand each stage, interact with each task type
5. For EVERY subtask type: verify the type-specific renderer shows correct UI
6. For EVERY conversation thread: post a comment, verify timestamp + author
7. Upload a file at task level AND subtask level, verify version history
8. Set a reminder, verify confirmation + history
9. Advance to Intake, verify gate warnings (if any)
10. Check notification panel after @mention
11. Test dark mode on workflow tab
12. Test at 375px mobile viewport

---

## REFERENCE FILES

| What | Where |
|------|-------|
| Original architecture spec | `specs/v2-architecture/V2-POWERHOUSE-BLUEPRINT.md` |
| Feature wiring gaps | `specs/v2-architecture/V2-BUILD-READINESS-AUDIT.md` |
| Gap audit (spec vs reality) | `specs/v2-testing/V2-GAP-AUDIT-2026-03-31.md` |
| Shane's feedback | `~/.claude/projects/.../memory/pleochrome-feedback-2026-03-31.md` |
| Issue log | `specs/v2-testing/MASTER-ISSUE-LOG.md` |
| Test plan | `specs/v2-testing/COMPLETE-FIX-AND-TEST-PLAN.md` |
| Code rules | `CLAUDE.md` |
| Project map | `specs/PROJECT-MAP.md` |
