# Complete Fix & Test Plan — PleoChrome CRM V2

**Date:** 2026-03-30
**Purpose:** Exhaustive inventory of everything that needs fixing, building, and testing. Nothing left behind.

---

## PART A: TIER 1+2 FIXES (8 Issues — Build These)

### Fix 1: Nested `<button>` in SubtaskChecklist type dropdown
**File:** `src/components/crm/SubtaskChecklist.tsx`
**Lines:** 113-129 (filled type dot), 131-145 (dashed circle set type)
**Change:** Both outer `<button>` elements → `<div role="button" tabIndex={0}>` with `cursor-pointer` added to className
**Inner buttons stay as `<button>`** — they're valid inside a `<div>`
**Test:** Open subtask type dropdown → no hydration error in console. Click type → changes. Keyboard Enter opens dropdown.

### Fix 2: DocumentUploadZone fake upload → real Supabase Storage
**File:** `src/components/crm/DocumentUploadZone.tsx`
**Lines:** 79-97
**Change:** Replace `setInterval` simulation with `supabase.storage.from('documents').upload(path, file)`. Return real storage path instead of `url: ''`. Add error handling with `setError()`.
**Import:** Already has `createClient` imported
**Test:** Drop a PDF on the upload zone → progress fills → file appears in Supabase Storage bucket → onUploadComplete returns real path.

### Fix 3: Add DragOverlay for visual drag feedback
**Files:** StageAccordion.tsx, WorkflowTab.tsx, SubtaskChecklist.tsx
**Change:** Add `<DragOverlay>` after `</SortableContext>` in each DndContext. Render a simplified card showing the dragged item's title.
**Pattern:** Copy from pipeline page (src/app/crm/page.tsx L312-314) which already uses DragOverlay correctly.
**Also need:** Track `activeId` state via `onDragStart` handler to know which item is being dragged.
**Test:** Drag a task → ghost preview card follows cursor. Release → item stays in new position.

### Fix 4: Add onError handlers to all 16 mutations
**File:** `src/components/crm/asset-detail/useWorkflowMutations.ts`
**Lines:** 27-42 (all mutation declarations)
**Change:** Add `onError: (error) => toast(error.message ?? 'Operation failed', 'error')` to every mutation.
**Import:** `import { useToast } from '@/components/ui/NeuToast'` + call `const { toast } = useToast()` inside hook.
**Verify NeuToast exists:** Yes, at `src/components/ui/NeuToast.tsx`
**Test:** Trigger a mutation failure → error toast appears in top-right. UI remains responsive.

### Fix 5: Maximum update depth exceeded
**Location:** Appeared on Compliance page navigation
**Root cause:** Need to investigate — likely stale closure in useCallback or parent re-render cascade. The useWorkflowMutations hook itself was verified clean.
**Action:** Add `console.log` tracing to compliance page render, check for infinite invalidation loops.
**Test:** Navigate to Compliance page → no "maximum update depth" errors in console.

### Fix 6: Link New Asset Wizard from Quick Add modal
**File:** `src/app/crm/page.tsx`
**Location:** Inside QuickAddModal component (~line 657)
**Change:** Add "Need more options? Try the full wizard →" link pointing to `/crm/assets/new`. Use Next.js `Link` component. Close modal on click.
**Import:** `Link` from 'next/link', `ArrowRight` from 'lucide-react'
**Test:** Click "+ New Asset" → Quick Add opens → click "Full Wizard →" → navigates to /crm/assets/new → 4-step wizard loads.

### Fix 7: Register CommunicationsTab in asset detail
**File:** `src/app/crm/assets/[id]/page.tsx`
**3 changes:**
1. Import CommunicationsTab (add to existing import group)
2. Add to TABS array: `{ id: 'communications', label: 'Communications', icon: <Phone className={IC} /> }`
3. Add render clause: `{activeTab === 'communications' && <CommunicationsTab assetId={assetId} />}`
**Import:** `Phone` from lucide-react (or `MessageSquare` if preferred)
**Test:** Open asset detail → "Communications" tab visible → click → tab loads with log communication button.

### Fix 8: "Value Path" → "Value Model" label
**File:** `src/app/crm/page.tsx`
**Line:** ~675
**Change:** `"Value Path"` → `"Value Model"`
**Test:** Open Quick Add modal → second dropdown labeled "Value Model".

---

## PART B: EVERY UNTESTED ELEMENT (104 items across all pages)

### Pipeline Board (16 untested elements)
| # | Element | What to Test | Risk |
|---|---------|-------------|------|
| 1 | Dashboard view mode | Click chart icon → stats widgets appear | Low |
| 2 | List view mode | Click list icon → table view appears | Low |
| 3 | Kanban drag between columns | Drag asset card from Lead to Intake → phase change modal | Medium |
| 4 | Phase move confirmation modal | After drag → modal with Cancel/Confirm Move | Medium |
| 5 | Fractional filter pill | Click → only fractional assets shown | Low |
| 6 | Tokenization filter pill | Click → only tokenization assets | Low |
| 7 | Debt/Broker/Barter filters | Same | Low |
| 8 | Dashboard My Tasks widget | Shows tasks, links to assets | Low |
| 9 | Dashboard Pending Approvals | Shows approvals | Low |
| 10 | Dashboard Reminders widget | Shows upcoming reminders | Low |
| 11 | Dashboard Pipeline Funnel | Phase bar chart | Low |
| 12 | Dashboard AUM by Model | Progress bars per model | Low |
| 13 | Dashboard Risk Indicators | Risk cards | Low |
| 14 | Quick Add Cancel button | Closes modal | Low |
| 15 | Mobile FAB button | Opens Quick Add on mobile | Low |
| 16 | Stats cards values accurate | Total AUM, active count match | Low |

### Asset Detail Hero (14 untested elements)
| # | Element | What to Test | Risk |
|---|---------|-------------|------|
| 17 | Edit button → EditAssetModal | Modal opens with name, description, values | Low |
| 18 | EditAssetModal Save | Saves changes, closes modal | Low |
| 19 | EditAssetModal Cancel | Closes without saving | Low |
| 20 | Advance to [Phase] button | Calls advancePhase mutation | Medium |
| 21 | GateWarningModal (if gates fail) | Shows warnings, Proceed Anyway button | Medium |
| 22 | GateWarningModal Proceed Anyway | Forces advance with warnings logged | Medium |
| 23 | Save Template button → modal | Opens SaveTemplateModal | Low |
| 24 | SaveTemplateModal form + save | Creates template from asset workflow | Medium |
| 25 | Add Doc button | Navigates to Documents tab | Low |
| 26 | Comment button | Navigates to Comments tab | Low |
| 27 | Export button | Downloads JSON report | Medium |
| 28 | Phase timeline clickable? | Do phase circles navigate? | Low |
| 29 | Breadcrumb "Pipeline" link | Navigates back to pipeline | Low |
| 30 | Tab counts accurate | Workflow 35, Tasks 92, etc. | Low |

### Asset Detail Tabs (40 untested elements)
| # | Element | What to Test | Risk |
|---|---------|-------------|------|
| 31 | Documents tab load | Shows document list | Low |
| 32 | Documents tab upload zone | Drag file → upload progress → file listed | HIGH |
| 33 | Documents tab download button | Signed URL → file opens | Medium |
| 34 | Documents tab lock/unlock toggle | Lock icon changes | Medium |
| 35 | Documents tab delete (unlocked) | Removes document | Medium |
| 36 | Documents tab delete (locked) | Should be disabled/blocked | Low |
| 37 | Comments tab load | Shows comment thread | Low |
| 38 | Comments tab post + @mention | Creates comment with notification | Low |
| 39 | Comments tab reply threading | Click Reply → inline input → threaded | Medium |
| 40 | Comments tab edit own | Edit button on own comments | Medium |
| 41 | Comments tab delete own | Delete button on own comments | Medium |
| 42 | Tasks tab load | Shows task list by stage | Low |
| 43 | Activity tab load | Shows audit log | Low |
| 44 | Activity tab category filter | All/Operational/Governance/Compliance | Low |
| 45 | Gates tab load | Shows gate stages | Low |
| 46 | Gates tab Evaluate button | Evaluate gate milestone | Medium |
| 47 | Financials tab load | Shows payment breakdown | Low |
| 48 | Financials tab totals correct | Income/expense/net calculations | Low |
| 49 | Partners tab load | Shows linked partners | Low |
| 50 | Partners tab Add Partner | Opens modal, select partner, assign role | Medium |
| 51 | Partners tab remove partner | Remove partner from asset | Medium |
| 52 | Meetings tab load | Shows meeting list | Low |
| 53 | Meetings tab create meeting | Modal → fill form → create | Medium |
| 54 | Meetings tab expand detail | Click card → MeetingDetail view | Low |
| 55 | Meetings tab delete meeting | Delete with confirmation | Medium |
| 56 | Meetings tab action items | Add action item → convert to task | Medium |
| 57 | Communications tab load | (After Fix 7) Shows communication log | Medium |
| 58 | Communications tab log entry | Log new communication (type, direction, notes) | Medium |

### Workflow Tab Deep Interactions (15 untested)
| # | Element | What to Test | Risk |
|---|---------|-------------|------|
| 59 | Task double-click title edit | Double-click → inline input → Enter saves | Low |
| 60 | Task type badge change | Click badge → dropdown → select new type | Low |
| 61 | Task Set Reminder form | Click → expand → date + note → Save | Medium |
| 62 | Task ... menu → Set Status submenu | Open menu → Set Status → see all 8 statuses → select | Low |
| 63 | Task ... menu → Hide Task | Opens ConfirmHideModal → confirm → task hidden | Medium |
| 64 | Task DnD visual drag (after Fix 3) | Drag task → DragOverlay shows → drops in new position | HIGH |
| 65 | Stage DnD visual drag (after Fix 3) | Drag stage → DragOverlay shows → drops in new position | HIGH |
| 66 | Subtask DnD visual drag (after Fix 3) | Drag subtask → reorders | HIGH |
| 67 | Subtask notes expand | Click notes icon → textarea → type → blur saves | Medium |
| 68 | Subtask delete (X button) | Click → subtask removed | Low |
| 69 | Add Task inline form | Click "+ Add Task" → type title → Enter → task appears | Low |
| 70 | Add Stage inline form | Click "+ Add Stage" → type name → Enter → stage appears | Low |
| 71 | Hide Stage (eye-off) | Click → ConfirmHideModal → confirm → stage hidden | Medium |
| 72 | File upload in per-task FILES section | Attach File → select → uploads to Supabase → listed | HIGH |
| 73 | File download in per-task FILES | Click download → signed URL → opens | Medium |

### Tasks Page (5 untested)
| # | Element | What to Test | Risk |
|---|---------|-------------|------|
| 74 | My Tasks filter | Shows only assigned tasks (grouped by asset) | Low |
| 75 | List view | Table layout with columns | Low |
| 76 | + New Task modal | Select asset → stage → type → title → Create | Medium |
| 77 | Task Start button in kanban | Click Start → moves to IN PROGRESS column | Low |
| 78 | Task Complete button in kanban | Click → moves to DONE column | Low |

### Partners Page + Detail (6 untested)
| # | Element | What to Test | Risk |
|---|---------|-------------|------|
| 79 | + Add Partner modal | Fill form → validation → create | Medium |
| 80 | Partner card → detail page | Click → /crm/partners/[id] loads | Low |
| 81 | Partner detail Overview tab | Contact info, DD status | Low |
| 82 | Partner detail Onboarding tab | Checklist items | Medium |
| 83 | Partner detail Credentials tab | Certifications, expiry dates | Medium |
| 84 | Partner detail Assignments tab | Linked assets | Low |

### Contacts + Detail (5 untested)
| # | Element | What to Test | Risk |
|---|---------|-------------|------|
| 85 | + Add Contact modal | Fill form → validation → create | Medium |
| 86 | Contact → detail page | Click → /crm/contacts/[id] loads | Low |
| 87 | Contact detail KYC tab | KYC status, verification records | Medium |
| 88 | Contact detail Ownership tab | Beneficial owners, asset links | Medium |
| 89 | Contact detail Communications tab | Communication log per contact | Medium |

### Meetings Page (3 untested)
| # | Element | What to Test | Risk |
|---|---------|-------------|------|
| 90 | + New Meeting modal | Fill form → create | Medium |
| 91 | Meeting expand → detail | Action items, transcript, key decisions | Low |
| 92 | Meeting delete | Confirmation → delete | Medium |

### Approvals Page (4 untested)
| # | Element | What to Test | Risk |
|---|---------|-------------|------|
| 93 | Approve button | Click → approval recorded | Medium |
| 94 | Reject button → reason textarea | Click → textarea shows | Low |
| 95 | Confirm Reject with reason | Submit → rejection recorded | Medium |
| 96 | Cancel rejection | Hides textarea, returns to buttons | Low |

### Settings Page (3 untested)
| # | Element | What to Test | Risk |
|---|---------|-------------|------|
| 97 | Dark mode toggle (settings) | Same as header toggle | Low |
| 98 | In-App Notifications toggle | May not persist (local state only) | Medium |
| 99 | Email Digests toggle (disabled) | Shows "coming soon" state | Low |

### Global Elements (5 untested)
| # | Element | What to Test | Risk |
|---|---------|-------------|------|
| 100 | Notification panel Mark All Read | Click → all notifications marked read | Medium |
| 101 | Notification panel All/Unread filter | Tabs switch | Low |
| 102 | Notification click → navigate | Click notification → goes to related entity | Medium |
| 103 | Offline banner | Disconnect WiFi → banner appears | Low |
| 104 | Mobile bottom nav + More sheet | 375px → bottom nav shows, More opens drawer | Medium |

---

## PART C: TIER 3-5 ISSUES (Log for Future Sprints)

### Tier 3: UX Improvements
- Overview metadata fields not editable (need EditAssetModal expansion or inline edit)
- Quick Add missing Description field
- Quick Add no currency formatting on Estimated Value
- Activity badges mostly gray (missing color mappings for stage/document/subtask/comment/approval actions)
- Empty stages show during status filter (should hide when 0 matching tasks)
- No loading skeletons (NeuSkeleton exists but unused)

### Tier 4: Mobile/Accessibility
- DnD has no keyboard alternative (@dnd-kit limitation)
- Menu button undersized (12x12px, should be 44px)
- Drag handles undersized (16-20px, should be 44px)
- Menu dropdowns can go off-screen on mobile (absolute positioning, no viewport check)
- No aria-labels on icon-only buttons
- Search bar min-width too large for 320px phones

### Tier 5: New Features (Roadmap)
- Task assignment notifications
- Bulk task operations
- Task dependencies ("blocked until")
- Recurring tasks (quarterly compliance)
- Pipeline velocity tracking (phase entry timestamps)
- Team workload dashboard
- Per-task activity audit trail
- Calendar/email integration
- Client/holder portal (read-only)
- PDF/CSV export from workflow

---

## EXECUTION ORDER

**Step 1:** Fix 1-8 (Tier 1+2 code changes) — ~2 hours
**Step 2:** Build check (`npx tsc --noEmit` + `npm run build`) — verify zero errors
**Step 3:** Chrome E2E of all 8 fixes
**Step 4:** Chrome E2E of Part B items 1-78 (Pipeline, Asset Detail, Workflow, Tasks)
**Step 5:** Chrome E2E of Part B items 79-104 (Partners, Contacts, Meetings, Approvals, Settings, Global)
**Step 6:** Dark mode check on 5 key pages
**Step 7:** Mobile 375px check on 3 key pages
**Step 8:** Console error check (zero errors target)
**Step 9:** Update SESSION-HANDOFF.md with final state
**Step 10:** Save to memory for next session
