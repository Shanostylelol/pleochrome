# Page Spec: Meetings

**Phase:** 5 — Partners + Meetings + Contacts
**URLs:** `/crm/meetings` (list), `/crm/meetings/[id]` (detail)
**Priority:** P0
**Dependencies:** Phase 0 (Foundation), Phase 4 (Tasks — action items link to tasks), Phase 5 (Partners — meetings linked to partners)
**Estimated Build Time:** 3-4 hours
**Spec Version:** 1.0

---

## PURPOSE

Meeting records with summaries, transcripts, action items, and partner/asset associations. Every call, video meeting, and in-person meeting gets logged here with full context — who attended, what was discussed, what decisions were made, and what follow-ups are required. Meetings serve as the decision-making evidence trail that complements the automated activity log.

---

## DATA SOURCES

### Database Tables

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `meeting_notes` | Meeting records | `id`, `title`, `date`, `duration_minutes`, `meeting_type`, `stone_id`, `partner_id`, `summary`, `transcript`, `ai_summary`, `recording_url`, `attendees` (JSONB), `action_items` (JSONB), `created_by`, `created_at`, `updated_at` |
| `stones` | Asset association | `id`, `name`, `reference_code` |
| `partners` | Partner association | `id`, `name`, `type` |
| `team_members` | Attendee info | `id`, `full_name`, `avatar_url`, `role` |
| `documents` | Meeting attachments | `id`, `meeting_id`, `filename`, `file_path` |
| `tasks` | Linked action items | `id`, `title`, `status`, `assigned_to`, `due_date` |

---

## PAGE 1: MEETING LIST (`/crm/meetings`)

### Header

```
[Title] "Meetings" — Cormorant Garamond, 28px, --text-primary
[Right Section]
  [Button: "Log Meeting"] — NeuButton primary, --accent-teal, icon: plus
```

### Filter Bar

Layout: flex row, 8px gap, flex-wrap

| Filter | Component | Options |
|--------|-----------|---------|
| Search | NeuInput | "Search meetings..." — searches title and summary |
| Meeting Type | NeuSelect | "All Types", "Partner Meeting", "Asset Review", "Governance", "Internal", "Other" |
| Asset | NeuSelect (searchable) | "All Assets" + asset names |
| Partner | NeuSelect (searchable) | "All Partners" + partner names |
| Date Range | NeuDateRangePicker | Start/end date |
| Has Action Items | NeuSelect | "All", "Has Open Items", "All Complete", "No Items" |

### Meeting List

Chronological, newest first. Infinite scroll (loads 20 at a time).

**MeetingCard (NeuCard raised):**

```
[Element: MeetingCard] — NeuCard raised, padding 16px, margin-bottom 8px, cursor pointer
  Click: navigates to /crm/meetings/[id]

  [Row 1: Date + Duration]
    [DateBadge] "Mar 15, 2026 | 2:00 PM PST" — JetBrains Mono 12px, --text-muted
    [DurationBadge] "45 min" — DM Sans 12px, --text-muted, NeuBadge ghost
    [MeetingTypeBadge] — NeuBadge, colored by type

  [Row 2: Title]
    "Rialto Markets Intro Call" — DM Sans 16px, 600 weight, --text-primary

  [Row 3: Attendees]
    NeuAvatar stack (max 5, 24px each, -8px overlap) + names text
    "Shane, David, Rialto Team" — DM Sans 12px, --text-secondary

  [Row 4: Associations]
    [AssetBadge] "Emerald Barrel #017093" — NeuBadge, --accent-teal bg at 15%, linked
    [PartnerBadge] "Rialto Markets" — NeuBadge, --accent-amethyst bg at 15%, linked

  [Row 5: Summary Preview]
    First 2 lines of summary text — DM Sans 13px, --text-secondary, truncated with ellipsis

  [Row 6: Footer]
    [ActionItems] "3 open / 5 total action items" — DM Sans 12px, --text-muted, icon: check-square
    [Attachments] paperclip icon + count (if > 0) — DM Sans 12px, --text-muted
```

### Meeting Type Badges

| Type | Color | Label |
|------|-------|-------|
| partner_meeting | `--accent-amethyst` (#5B2D8E) | Partner Meeting |
| asset_review | `--accent-teal` (#1A8B7A) | Asset Review |
| governance | `--accent-amber` (#C47A1A) | Governance |
| internal | `--text-muted` (#64748b) | Internal |
| other | `--text-muted` (#64748b) | Other |

---

## PAGE 2: MEETING DETAIL (`/crm/meetings/[id]`)

### Header

```
[Breadcrumb] "Meetings > Rialto Markets Intro Call" — DM Sans 12px, --text-muted

[Row 1: Date + Type]
  "March 15, 2026, 2:00 PM PST" — JetBrains Mono 14px, --text-muted
  [MeetingTypeBadge] — NeuBadge colored
  [DurationBadge] "45 min" — NeuBadge ghost

[Row 2: Title]
  "Rialto Markets Intro Call" — Cormorant Garamond, 28px, --text-primary

[Row 3: Attendees]
  Full avatar + name list (NeuAvatar 32px + name + role)
  External attendees shown as text (no avatar)

[Row 4: Associations]
  [AssetBadge] linked to asset detail
  [PartnerBadge] linked to partner detail

[Row 5: Actions]
  [Button: "Edit"] — NeuButton ghost
  [Button: "Delete"] — NeuButton ghost, --accent-ruby (with confirmation dialog)
```

### Section: Summary

```
NeuCard raised, full width
[Header] "Summary" — DM Sans 16px, 600 weight, icon: file-text
[Content] Rich text area — editable with save button
  When editing: textarea with basic markdown support
  When viewing: rendered markdown
[Button: "Edit Summary"] — NeuButton ghost, small
[SaveButton] — NeuButton primary, appears when editing
```

### Section: AI Summary

```
NeuCard raised, full width
Background: --bg-tertiary
Border-left: 3px --accent-teal
[Header] "AI Summary" — DM Sans 16px, 600 weight, icon: sparkles (or zap)

[If transcript exists and AI summary generated:]
  [SubSection: "Key Topics"]
    Bulleted list — DM Sans 14px, --text-primary
  [SubSection: "Decisions Made"]
    Bulleted list — DM Sans 14px, --text-primary
  [SubSection: "Next Steps"]
    Bulleted list — DM Sans 14px, --text-primary
  [Button: "Regenerate"] — NeuButton ghost, small

[If no transcript:]
  "Paste a meeting transcript below to generate an AI summary."
  — DM Sans 14px, --text-muted, italic
  [This is a placeholder — AI integration is future. For now, show the static message.]
```

### Section: Full Transcript

```
NeuCard raised, full width
[Header] "Transcript" — DM Sans 16px, 600 weight, icon: message-square
[CollapseToggle] — collapsed by default, click to expand
[Content when expanded:]
  Pre-formatted text block — JetBrains Mono 12px, --text-secondary
  Speaker labels in DM Sans 13px, 600 weight, --text-primary
  Max-height: 600px with scroll
[Button: "Edit Transcript"] — NeuButton ghost, small
[Textarea] — large, auto-expanding, for pasting/editing transcript
```

### Section: Action Items

```
NeuCard raised, full width
[Header] "Action Items" — DM Sans 16px, 600 weight, icon: check-square
[Count] "3 open / 5 total"

[Element: ActionItem] — flex row, items center, border-bottom --border-default
  [NeuCheckbox] — check to complete (updates linked task if exists)
  [Title] "Follow up with Rialto on ATS pricing" — DM Sans 14px, --text-primary
  [AssigneeAvatar] — NeuAvatar 24px
  [AssigneeName] — DM Sans 12px, --text-secondary
  [DueDate] — DM Sans 12px, color-coded
  [StatusBadge] — NeuBadge
  [LinkedTaskRef] "Task #123" — JetBrains Mono 11px, --accent-teal, linked (if linked)
  [Button: "Convert to Task"] — NeuButton ghost, small (if NOT yet linked to task)
    Click: creates task in tasks table, links action item to task ID

[Button: "Add Action Item"] — NeuButton ghost, icon: plus
  Inline form: title, assignee, due date
```

**"Convert to Task" flow:**
1. Click "Convert to Task" button on an action item
2. Pre-fill task creation with: title from action item, asset from meeting, assignee from action item
3. User confirms or adjusts fields
4. Task created via `tasks.createAdhoc` tRPC mutation
5. Action item updated with linked task ID
6. Button changes to "Task #123" linked reference

### Section: Recording

```
[If recording_url provided:]
  NeuCard raised
  [Header] "Recording" — icon: video
  [Player] Audio/video embed (if URL is .mp4/.webm) or external link button
  [Link] "Open in external player" — --accent-teal, new tab

[If no recording:]
  Not shown (section hidden entirely)
```

### Section: Attachments

```
NeuCard raised, full width
[Header] "Attachments" — DM Sans 16px, 600 weight, icon: paperclip
[FileList] — documents where meeting_id = this meeting
  Each: filename (linked to download), file size, uploaded date, uploader
[UploadZone] — compact drag-and-drop area
  "Drop files or click to attach" — DM Sans 12px, --text-muted
```

### New Meeting Form

Trigger: "Log Meeting" button (from list page or partner detail)
Component: NeuModal, 640px wide, or full-page form

| Field | Component | Required | Notes |
|-------|-----------|----------|-------|
| Date/Time | DateTime picker | Yes | Defaults to now |
| Title | NeuInput | Yes | |
| Meeting Type | NeuSelect | No | Partner Meeting, Asset Review, Governance, Internal, Other. Default: Other |
| Attendees | Multi-select (team members) + free text for external | No | |
| Associated Asset | NeuSelect (searchable) | No | |
| Associated Partner | NeuSelect (searchable) | No | Pre-filled if launched from partner detail |
| Duration | NeuInput (number, minutes) | No | |
| Summary | Textarea (rich text) | No | |
| Transcript | Textarea (large) | No | "Paste transcript here" placeholder |
| Recording URL | NeuInput | No | |
| Attachments | File upload zone | No | |

Footer: "Save Meeting" (NeuButton primary) + "Cancel" (NeuButton ghost)

---

## COMPONENTS USED

| Component | Source | Usage |
|-----------|--------|-------|
| NeuCard | `src/components/ui/NeuCard` | Meeting cards, detail sections |
| NeuButton | `src/components/ui/NeuButton` | Log Meeting, Edit, Delete, Convert to Task, Add Action Item |
| NeuBadge | `src/components/ui/NeuBadge` | Meeting type, asset/partner association, duration, status |
| NeuInput | `src/components/ui/NeuInput` | Form fields, search |
| NeuSelect | `src/components/ui/NeuSelect` | Filters, form fields |
| NeuCheckbox | `src/components/ui/NeuCheckbox` | Action item completion |
| NeuModal | `src/components/ui/NeuModal` | New meeting form, confirmation dialogs |
| NeuAvatar | `src/components/ui/NeuAvatar` | Attendee avatars |
| NeuTabs | `src/components/ui/NeuTabs` | (not used on this page directly) |

### New CRM Components

| Component | Path | Purpose |
|-----------|------|---------|
| MeetingCard | `src/components/crm/MeetingCard` | List view meeting card |
| MeetingDetailHeader | `src/components/crm/MeetingDetailHeader` | Detail page header with associations |
| MeetingActionItems | `src/components/crm/MeetingActionItems` | Action item list with task linking |
| MeetingCreateForm | `src/components/crm/MeetingCreateForm` | New meeting form |
| MeetingAISummary | `src/components/crm/MeetingAISummary` | AI summary section (placeholder for now) |

---

## tRPC ROUTES

### Router: `src/server/routers/meetings.ts`

| Procedure | Type | Input | Output | Notes |
|-----------|------|-------|--------|-------|
| `meetings.list` | query | `{ search?, meetingType?, assetId?, partnerId?, dateFrom?, dateTo?, hasActionItems?, cursor?, limit? }` | `{ meetings: Meeting[], nextCursor: string \| null }` | Cursor-based pagination. JOINs with stones, partners for badge data. |
| `meetings.getById` | query | `{ meetingId }` | `{ meeting: MeetingFull }` | Full meeting with attendees, action items, attachments, linked asset/partner. |
| `meetings.create` | mutation | `{ title, date, meetingType?, attendees?, assetId?, partnerId?, durationMinutes?, summary?, transcript?, recordingUrl? }` | `{ meeting: Meeting }` | Activity logged. |
| `meetings.update` | mutation | `{ meetingId, title?, date?, meetingType?, attendees?, assetId?, partnerId?, durationMinutes?, summary?, transcript?, aiSummary?, recordingUrl? }` | `{ meeting: Meeting }` | Activity logged with before/after diff. |
| `meetings.delete` | mutation | `{ meetingId }` | `{ success: boolean }` | Soft delete with confirmation. Activity logged. |
| `meetings.addActionItem` | mutation | `{ meetingId, title, assigneeId?, dueDate? }` | `{ meeting: Meeting }` | Appends to action_items JSONB array. Activity logged. |
| `meetings.linkActionItemToTask` | mutation | `{ meetingId, actionItemIndex, taskId }` | `{ meeting: Meeting }` | Updates action_items JSONB to add task_id reference. |

### Zod Schemas

```typescript
const MeetingListInput = z.object({
  search: z.string().optional(),
  meetingType: z.enum(['all', 'partner_meeting', 'asset_review', 'governance', 'internal', 'other']).default('all'),
  assetId: z.string().uuid().optional(),
  partnerId: z.string().uuid().optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  hasActionItems: z.enum(['all', 'has_open', 'all_complete', 'none']).default('all'),
  cursor: z.string().datetime().optional(),
  limit: z.number().int().min(10).max(50).default(20),
});

const MeetingCreateInput = z.object({
  title: z.string().min(1).max(500),
  date: z.string().datetime(),
  meetingType: z.enum(['partner_meeting', 'asset_review', 'governance', 'internal', 'other']).default('other'),
  attendees: z.array(z.object({
    userId: z.string().uuid().optional(),
    name: z.string(),
    role: z.string().optional(),
    external: z.boolean().default(false),
  })).optional(),
  assetId: z.string().uuid().optional(),
  partnerId: z.string().uuid().optional(),
  durationMinutes: z.number().int().positive().optional(),
  summary: z.string().max(50000).optional(),
  transcript: z.string().max(500000).optional(),
  recordingUrl: z.string().url().optional(),
});
```

---

## MEETING-ASSET-PARTNER RELATIONSHIP

Meetings are linked to **both** an asset AND a partner (both optional):
- `meeting_notes.stone_id` — the asset discussed
- `meeting_notes.partner_id` — the partner present

This triple relationship allows:
- Partner detail > Meetings tab: shows all meetings with this partner
- Asset detail (future): shows all meetings about this asset
- Cross-reference: "Meeting with Rialto about Emerald Barrel" links to both

Both badges (AssetBadge and PartnerBadge) appear on meeting cards and detail page, each clickable to navigate to the respective detail page.

---

## TEST CRITERIA

| # | Test | Expected Result |
|---|------|-----------------|
| 1 | Navigate to `/crm/meetings` | List renders with meeting cards |
| 2 | Filter by meeting type | Only selected type shown |
| 3 | Filter by asset | Only meetings for selected asset shown |
| 4 | Filter by partner | Only meetings for selected partner shown |
| 5 | Filter by date range | Only meetings in range shown |
| 6 | Search by title | Cards filter in real-time |
| 7 | Click meeting card | Navigates to meeting detail |
| 8 | Meeting detail renders all sections | Header, summary, AI summary placeholder, transcript, action items, attachments |
| 9 | Edit summary | Summary updates, saved via tRPC |
| 10 | Add action item | New item appears in list |
| 11 | Convert action item to task | Task created, linked reference appears |
| 12 | Complete action item checkbox | Status updates, linked task updates if exists |
| 13 | Upload attachment | File appears in attachments list |
| 14 | Create new meeting | Form submits, meeting appears in list |
| 15 | Delete meeting | Confirmation dialog, soft delete, removed from list |
| 16 | Asset badge clickable | Navigates to asset detail |
| 17 | Partner badge clickable | Navigates to partner detail |
| 18 | Infinite scroll | "Load more" loads next 20 meetings |
| 19 | `npm run build` | Zero errors |
| 20 | Dark mode | All elements correct |
| 21 | Light mode | All elements correct |

---

## CLAUDE.md RULES APPLIED

- **Neumorphic design system:** NeuCard raised for all cards and sections
- **Dark + light mode:** CSS custom properties throughout
- **tRPC for mutations:** All meeting CRUD through tRPC
- **Activity logging is automatic:** DB triggers handle audit trail
- **"asset" not "stone":** UI says "Asset" (DB: `stone_id`)
- **Platform-agnostic:** Meeting notes may reference partners but never imply commitment

---

## DEPENDENCIES

| Dependency | Phase | What's Needed |
|------------|-------|---------------|
| Foundation (Phase 0) | 0 | Atomic components, tRPC |
| Tasks (Phase 4) | 4 | "Convert to Task" creates tasks via tasks router |
| Partners (Phase 5) | 5 | Partner association and partner detail Meetings tab |

### What This Phase Provides to Others

| Consumer | What |
|----------|------|
| Phase 5 (Partners) | Partner detail Meetings tab reuses MeetingCard component |
| Phase 6 (Search) | Meetings searchable in global search (title + summary) |
