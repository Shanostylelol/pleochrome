# Page Spec: Task Dashboard

**Phase:** 4 — Tasks + Activity
**URL:** `/crm/tasks`
**Priority:** P0
**Dependencies:** Phase 0 (Foundation), Phase 2 (Asset Detail — governance step tasks)
**Estimated Build Time:** 3-4 hours
**Spec Version:** 1.0

---

## PURPOSE

Cross-asset task view showing all tasks from governance-generated `asset_task_instances` and manually created adhoc tasks. This is the daily "what do I need to do" page for every team member. Tasks can be filtered, grouped, sorted, completed, assigned, and created — providing full operational visibility across the entire pipeline.

---

## DATA SOURCES

### Database Tables

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `tasks` | Adhoc tasks (manually created) | `id`, `title`, `description`, `asset_id`, `step_id`, `assigned_to`, `priority`, `due_date`, `status`, `completed_at` |
| `asset_task_instances` | Governance-generated tasks from `002_modular_governance_schema.sql` | `id`, `asset_id`, `governance_requirement_id`, `module_task_id`, `title`, `description`, `assigned_to`, `status`, `priority`, `due_date`, `completed_by`, `completed_at` |
| `assets` | Asset reference | `id`, `name`, `reference_code`, `current_phase` |
| `asset_steps` | Step reference | `id`, `step_number`, `title`, `phase_id` |
| `team_members` | Assignee info | `id`, `full_name`, `avatar_url`, `role` |
| `activity_log` | Automatic audit entries | Immutable |

### Views

| View | Purpose |
|------|---------|
| `v_task_dashboard` | Open tasks with overdue flags, merged from both task sources |
| `v_unified_tasks` | Merges governance + adhoc tasks into a single queryable interface |

---

## PAGE LAYOUT

### Header

```
[Title] "Tasks" — Cormorant Garamond, 28px, --text-primary
[Right Section]
  [Toggle: ViewMode] List (icon) | Board (icon) | Calendar (icon) — NeuButton group
  [Button: "New Task"] — NeuButton primary, --accent-teal, icon: plus
```

### Stats Ribbon

Layout: 5 stat cards in a horizontal row, equal width, 8px gap
Height: 72px per card
Component: NeuCard raised with colored left border

| Stat | Label | Value Style | Left Border Color |
|------|-------|-------------|-------------------|
| Open | "Open" | --text-primary, large number | --accent-teal |
| Overdue | "Overdue" | --accent-ruby, large number | --accent-ruby |
| Due Today | "Due Today" | --accent-amber, large number | --accent-amber |
| Completed This Week | "Completed This Week" | --accent-emerald, large number | --accent-emerald |
| Blocked | "Blocked" | --accent-ruby, large number | --accent-ruby |

### Filter Bar

Layout: flex row, 8px gap, flex-wrap

| Filter | Component | Options |
|--------|-----------|---------|
| Status | NeuSelect | "All", "Open", "Completed", "Overdue", "Blocked" |
| Asset | NeuSelect (searchable) | "All Assets" + asset names |
| Phase | NeuSelect | "All Phases", "Phase 1", "Phase 2", "Phase 3", "Phase 4" |
| Assignee | NeuSelect | "All", "My Tasks", [team member names with avatars] |
| Priority | NeuSelect | "All", "Urgent", "High", "Medium", "Low" |
| Due Date | NeuSelect | "All", "Overdue", "Due Today", "Due This Week", "Due This Month" |
| Task Type | NeuSelect | "All", "Action", "Upload", "Review", "Approval", "Automated" |
| Group By | NeuSelect | "By Asset" (default), "By Phase", "By Assignee", "By Priority" |

### List View (Default)

**Group Headers**

```
[Element: GroupHeader] — NeuCard flat, --bg-secondary, collapsible
  [ChevronIcon] — rotates on expand/collapse
  [GroupName] — DM Sans 16px, 600 weight, --text-primary
    - By Asset: "Emerald Barrel #017093"
    - By Phase: "Phase 2: Preparation"
    - By Assignee: "Shane Pierson"
    - By Priority: "Urgent"
  [TaskCount] — NeuBadge, --text-muted, "12 tasks"
  [OverdueBadge] — NeuBadge, --accent-ruby, "3 overdue" (only if > 0)
```

**Task Rows**

```
[Element: TaskRow] — flex row, 44px height, border-bottom --border-default
  [NeuCheckbox] — quick-complete (marks task as done on check)
  [PriorityDot] — 8px circle
    - urgent: --accent-ruby
    - high: --accent-amber
    - medium: --accent-sapphire
    - low: --text-muted (#64748b)
  [TypeIcon] — 16px, colored by type
    - action: play-circle (--accent-teal)
    - upload: upload-cloud (--accent-sapphire)
    - review: eye (--accent-amethyst)
    - approval: shield-check (--accent-amber)
    - automated: zap (--accent-chartreuse)
  [TaskTitle] — DM Sans 14px, --text-primary (strikethrough + --text-muted if completed)
  [AssetName] — DM Sans 12px, --text-muted, linked (hidden when grouping by asset)
  [StepRef] — "Step 2.4" JetBrains Mono 11px, --text-muted
  [AssigneeAvatar] — NeuAvatar 24px
  [DueDate] — DM Sans 12px
    - Normal: --text-muted
    - Today: "Today" in --accent-amber
    - Tomorrow: "Tomorrow" in --text-secondary
    - Overdue: "Overdue 3d" in --accent-ruby with red background at 10%
    - Future: "Mar 31" in --text-muted
  [StatusBadge] — NeuBadge matching status colors
  [QuickActions on hover] — icon buttons
    - Complete (check icon)
    - Reassign (user-plus icon)
    - Add note (message icon)
    - View in context (external-link — navigates to step in governance tab)
```

**Overdue highlighting:** Tasks with due_date < now() AND status != 'complete' get:
- Background: `rgba(166,29,58,0.06)` (ruby at 6%)
- Left border: 3px `--accent-ruby`
- "Overdue Xd" badge with days count

### Board View (Kanban by Status)

4 columns, horizontal layout, min-width 280px each:

| Column | Status | Header Color |
|--------|--------|-------------|
| To Do | `not_started` | --text-muted |
| In Progress | `in_progress` | --accent-teal |
| Blocked | `blocked` | --accent-ruby |
| Done | `complete` | --accent-emerald |

Each column: NeuCard pressed/concave for the container, task cards are NeuCard raised (compact).

Task Card (compact):
```
[TaskTitle] — DM Sans 13px, --text-primary, 2-line max
[AssetName] — DM Sans 11px, --text-muted
[StepRef] — JetBrains Mono 11px, --text-muted
[Footer] — flex row, space-between
  [AssigneeAvatar] — 20px
  [DueDate] — DM Sans 11px, color-coded
  [PriorityDot] — 6px
```

Drag-and-drop between columns changes task status. Drop triggers tRPC mutation + activity log.

### Calendar View

- Month view (default) with week/day toggles
- Tasks displayed as colored dots on their due dates
- Dot colors: urgent=ruby, high=amber, medium=sapphire, low=gray
- Click a date: side panel shows task list for that day
- Click a task: opens task detail modal
- Overdue tasks: ruby background on past dates with incomplete tasks
- Navigation: previous/next month arrows, "Today" button

### Task Creation Modal

Trigger: "New Task" button
Component: NeuModal, 560px wide

Fields:
| Field | Component | Required | Notes |
|-------|-----------|----------|-------|
| Title | NeuInput | Yes | Text input |
| Description | Textarea (NeuInput variant) | No | Auto-expanding |
| Asset | NeuSelect (searchable) | Yes | All active assets |
| Step | NeuSelect | Yes | Filtered by selected asset |
| Type | NeuSelect | No | Action, Upload, Review, Approval, Automated. Default: Action |
| Assignee | NeuSelect | No | Team members with avatars |
| Priority | NeuSelect | No | Urgent, High, Medium, Low. Default: Medium |
| Due Date | Date picker | No | Defaults to none |

Footer: "Create Task" (NeuButton primary) + "Cancel" (NeuButton ghost)

---

## COMPONENTS USED

| Component | Source | Usage |
|-----------|--------|-------|
| NeuCard | `src/components/ui/NeuCard` | Stat cards, group headers, task cards (board view) |
| NeuButton | `src/components/ui/NeuButton` | New Task, view toggles, quick actions |
| NeuBadge | `src/components/ui/NeuBadge` | Status badges, priority badges, overdue badges, count badges |
| NeuInput | `src/components/ui/NeuInput` | Task title, description, search |
| NeuSelect | `src/components/ui/NeuSelect` | All filter dropdowns, form fields |
| NeuCheckbox | `src/components/ui/NeuCheckbox` | Quick-complete checkboxes |
| NeuModal | `src/components/ui/NeuModal` | Task creation modal |
| NeuAvatar | `src/components/ui/NeuAvatar` | Assignee avatars |
| NeuTabs | `src/components/ui/NeuTabs` | View mode toggle |

### New CRM Components

| Component | Path | Purpose |
|-----------|------|---------|
| TaskRow | `src/components/crm/TaskRow` | Single task row in list view |
| TaskCard | `src/components/crm/TaskCard` | Compact task card for board view |
| TaskStatsRibbon | `src/components/crm/TaskStatsRibbon` | 5-stat summary bar |
| TaskGroupHeader | `src/components/crm/TaskGroupHeader` | Collapsible group header |
| TaskCreateModal | `src/components/crm/TaskCreateModal` | New task form modal |
| TaskCalendarView | `src/components/crm/TaskCalendarView` | Month/week/day calendar |
| TaskBoardView | `src/components/crm/TaskBoardView` | Kanban columns with drag-and-drop |

---

## tRPC ROUTES

### Router: `src/server/routers/tasks.ts`

| Procedure | Type | Input | Output | Notes |
|-----------|------|-------|--------|-------|
| `tasks.list` | query | `{ search?, status?, assetId?, phase?, assignee?, priority?, dueDate?, taskType?, groupBy?, sortBy?, sortDir?, page?, pageSize? }` | `{ tasks: UnifiedTask[], total: number, groups: GroupedTasks[] }` | Queries `v_unified_tasks` view. Returns both flat and grouped results. |
| `tasks.getStats` | query | `{}` | `{ open: number, overdue: number, dueToday: number, completedThisWeek: number, blocked: number }` | Aggregation query for stats ribbon. |
| `tasks.complete` | mutation | `{ taskId, source: 'adhoc' \| 'governance' }` | `{ task: UnifiedTask }` | Sets status='complete', completed_by=ctx.user.id, completed_at=now(). Activity logged by trigger. |
| `tasks.assign` | mutation | `{ taskId, assigneeId, source: 'adhoc' \| 'governance' }` | `{ task: UnifiedTask }` | Updates assigned_to. Sends notification to new assignee. Activity logged. |
| `tasks.createAdhoc` | mutation | `{ title, description?, assetId, stepId, type?, assignee?, priority?, dueDate? }` | `{ task: Task }` | Creates in `tasks` table. Activity logged. |
| `tasks.updatePriority` | mutation | `{ taskId, priority, source }` | `{ task: UnifiedTask }` | Updates priority field. Activity logged. |
| `tasks.updateStatus` | mutation | `{ taskId, status, source }` | `{ task: UnifiedTask }` | For board view drag-and-drop. Activity logged. |

### Zod Schemas

```typescript
const TaskListInput = z.object({
  search: z.string().optional(),
  status: z.enum(['all', 'open', 'completed', 'overdue', 'blocked']).default('all'),
  assetId: z.string().uuid().optional(),
  phase: z.number().int().min(1).max(4).optional(),
  assignee: z.union([z.literal('all'), z.literal('me'), z.string().uuid()]).default('all'),
  priority: z.enum(['all', 'urgent', 'high', 'medium', 'low']).default('all'),
  dueDate: z.enum(['all', 'overdue', 'today', 'this_week', 'this_month']).default('all'),
  taskType: z.enum(['all', 'action', 'upload', 'review', 'approval', 'automated']).default('all'),
  groupBy: z.enum(['asset', 'phase', 'assignee', 'priority']).default('asset'),
  sortBy: z.enum(['due_date', 'priority', 'created_at', 'title']).default('due_date'),
  sortDir: z.enum(['asc', 'desc']).default('asc'),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(10).max(100).default(50),
});

const TaskCreateInput = z.object({
  title: z.string().min(1).max(500),
  description: z.string().max(5000).optional(),
  assetId: z.string().uuid(),
  stepId: z.string().uuid(),
  type: z.enum(['action', 'upload', 'review', 'approval', 'automated']).default('action'),
  assignee: z.string().uuid().optional(),
  priority: z.enum(['urgent', 'high', 'medium', 'low']).default('medium'),
  dueDate: z.string().datetime().optional(),
});
```

---

## Mobile Layout

### Breakpoint Behavior

**Below 768px (phones):**

- **View mode:** List view only. Board view and Calendar view hidden (too complex for phone screens). A simplified "Board" option can show a single column at a time with swipeable tab navigation (like Pipeline Board mobile).
- **Task rows:** Swipe-right gesture to complete a task (like iOS Mail). Swipe reveals green "Complete" action. Swipe-left reveals "Reassign" and "View" actions.
- **Group-by:** Dropdown selector at top of page (not toggle buttons). Saves vertical space.
- **Stats ribbon:** Horizontally scrollable row. Shows 2.5 cards visible at a time to hint at scrollability. `overflow-x: auto`, `scroll-snap-type: x mandatory`.
- **Filter bar:** Single "Filter" button opens bottom sheet with all filter options.
- **Task creation modal:** Full-screen page (not centered modal). Back arrow in top-left to cancel. "Create" button fixed to bottom.
- **Quick-complete checkbox:** 44x44px minimum touch target.
- **Task row height:** Minimum 56px for comfortable tapping.
- **Quick actions:** No hover-revealed actions. Instead, tap the task row to expand inline detail with action buttons.

**768px-1023px (tablets):**

- All three views available (List, Board, Calendar).
- Board view: 2 columns visible, horizontally scrollable.
- Calendar view: Month view with compact task indicators.

**1024px+ (desktop):**

- Full layout as designed.

### Touch Interactions

| Interaction | Gesture | Result |
|-------------|---------|--------|
| Complete task | Swipe right on task row | Task marked done, row slides away |
| View task detail | Tap task row | Inline expansion with full detail |
| Reassign task | Swipe left, tap "Reassign" | Assignee picker opens |
| Change group-by | Tap dropdown | Grouping changes, list re-renders |
| Create task | Tap "New Task" button | Full-screen creation form |
| Pull to refresh | Pull down on task list | Refetch all tasks |

---

## DUE DATE FORMATTING RULES

| Condition | Display | Color |
|-----------|---------|-------|
| `due_date` is today | "Today" | `--accent-amber` |
| `due_date` is tomorrow | "Tomorrow" | `--text-secondary` |
| `due_date` is within 7 days | Day name "Wednesday" | `--text-secondary` |
| `due_date` is this year | "Mar 31" (short month + day) | `--text-muted` |
| `due_date` is next year+ | "Mar 31, 2027" | `--text-muted` |
| `due_date` < today AND status != complete | "Overdue Xd" (X = days overdue) | `--accent-ruby` |
| No due_date | "No due date" | `--text-muted` at 50% opacity |

---

## TEST CRITERIA

| # | Test | Expected Result |
|---|------|-----------------|
| 1 | Navigate to `/crm/tasks` | Page renders with stats ribbon, empty state if no tasks |
| 2 | Stats ribbon accuracy | Open, overdue, due today, completed this week, blocked counts match data |
| 3 | Filter by status "Open" | Only open tasks shown |
| 4 | Filter by "My Tasks" | Only tasks assigned to current user shown |
| 5 | Filter by asset | Only tasks for selected asset shown |
| 6 | Group by Asset | Tasks grouped under asset name headers |
| 7 | Group by Assignee | Tasks grouped under team member name headers |
| 8 | Group by Priority | Tasks grouped under Urgent/High/Medium/Low headers |
| 9 | Quick-complete checkbox | Task status changes to complete, strikethrough applied, stats update |
| 10 | Create new adhoc task | Modal opens, form submits, task appears in list |
| 11 | Switch to Board view | Kanban columns render with correct tasks |
| 12 | Drag task between Board columns | Status updates, activity logged |
| 13 | Switch to Calendar view | Tasks appear as dots on correct dates |
| 14 | Overdue task highlighting | Red background, "Overdue Xd" badge, ruby left border |
| 15 | Due date formatting | Today/Tomorrow/Overdue render correctly |
| 16 | Sort by due date | Tasks reorder correctly |
| 17 | Sort by priority | Urgent first, then High, Medium, Low |
| 18 | Click "View in context" | Navigates to asset governance tab, scrolls to step |
| 19 | `npm run build` | Zero errors |
| 20 | Dark mode | All elements correct |
| 21 | Light mode | All elements correct |

---

## CLAUDE.md RULES APPLIED

- **Neumorphic design system:** NeuCard raised for stat cards, NeuCard pressed for board columns
- **Activity logging is automatic:** DB triggers on task status changes
- **"asset" not "stone":** All UI labels say "Asset" (DB column is `asset_id`)
- **No prop drilling beyond 2 levels:** Use TanStack Query for task state
- **Dark + light mode:** CSS custom properties throughout
- **tRPC for mutations:** All task updates go through tRPC, not direct Supabase calls

---

## DEPENDENCIES

| Dependency | Phase | What's Needed |
|------------|-------|---------------|
| Foundation (Phase 0) | 0 | Atomic components, tRPC, Supabase client |
| Asset Detail (Phase 2) | 2 | Assets + governance steps must exist. Tasks tab on Asset Detail reuses TaskRow component. |

### What This Phase Provides to Others

| Consumer | What |
|----------|------|
| Phase 5 (Meetings) | Action items in meetings link to tasks |
| Phase 6 (Search) | Tasks are searchable in global search |
| Phase 7 (Compliance) | Overdue tasks appear as compliance alerts |
| Phase 7 (Templates) | Template tasks are instantiated into this system |
