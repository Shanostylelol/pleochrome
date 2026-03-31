# E2E Test Checklist — PleoChrome Powerhouse CRM

## Test Scenario: Full Asset Lifecycle from New Asset → Complete Workflow

### Pre-Test: Global Navigation
- [ ] 1. Sidebar loads with all 13 links
- [ ] 2. Click each nav link → correct page loads
- [ ] 3. Dark mode toggle → all pages switch
- [ ] 4. Cmd+K → Command Palette opens
- [ ] 5. Type "emerald" in search → asset results appear
- [ ] 6. Click result → navigates to asset
- [ ] 7. Notification bell → panel opens with filter tabs
- [ ] 8. Click outside notification panel → closes

### A. Pipeline Board (/crm)
- [ ] 9. Pipeline loads with 6 phase columns
- [ ] 10. Value model filter tabs work (All, Fractional, Tokenization, etc.)
- [ ] 11. View toggle switches between Dashboard/Kanban/List
- [ ] 12. Asset cards show name, ref code, status badge, value
- [ ] 13. Click asset card → navigates to asset detail

### B. Create New Test Asset
- [ ] 14. Navigate to /crm/assets (if new asset wizard exists) or use existing
- [ ] 15. Verify asset loads with workflow stages instantiated

### C. Asset Detail — Hero Section
- [ ] 16. Asset name, ref code, status badge, value model badge visible
- [ ] 17. Claimed value, appraised value display
- [ ] 18. Edit button → opens EditAssetModal
- [ ] 19. Edit name → save → name updated
- [ ] 20. Advance Phase button visible → click → phase advances (or gate warning)
- [ ] 21. Save Template button → modal → enter name → save
- [ ] 22. Export button → JSON downloads

### D. Asset Detail — Overview Tab
- [ ] 23. Overview tab loads with asset metadata
- [ ] 24. Asset Owners section visible (if owners exist)

### E. Workflow Tab — Stage Interactions
- [ ] 25. All 6 phases visible with stage counts
- [ ] 26. Search bar filters tasks by title
- [ ] 27. Status filter (All/To Do/Active/Blocked/Done) works
- [ ] 28. Stage header click → expands/collapses
- [ ] 29. Progress bar visible on each stage
- [ ] 30. Stage Start button → status changes to IN PROGRESS
- [ ] 31. Stage Complete button → status changes to COMPLETED
- [ ] 32. Stage grip handle visible for DnD
- [ ] 33. Drag stage to reorder → visually moves → persists after reload
- [ ] 34. "+ Add Stage" → type name → Enter → new stage appears
- [ ] 35. Hide Stage (eye-off icon) → confirmation → stage disappears

### F. Workflow Tab — Task Interactions
- [ ] 36. Task cards show: type icon, title, status badge, due date, assignee avatar
- [ ] 37. Task grip handle visible for DnD
- [ ] 38. Drag task to reorder within stage → visually moves → persists
- [ ] 39. Click task title → detail panel expands
- [ ] 40. Double-click task title → inline edit → type new name → Enter saves
- [ ] 41. Task type badge visible (Document Upload, Review, etc.)
- [ ] 42. Click task type badge → dropdown → change type → persists
- [ ] 43. Task Start button (play icon) → status TO DO → IN PROGRESS
- [ ] 44. Task Complete button (check) → status → DONE, opacity reduces
- [ ] 45. Task ... menu → opens with Hide/Set Status/Delete
- [ ] 46. Task ... menu → Set Status → submenu → click "Blocked" → status changes
- [ ] 47. Task ... menu → Hide Task → task disappears
- [ ] 48. Task ... menu → Delete Task → task removed permanently
- [ ] 49. Due Date → click "Set due date..." → date picker → select → date shows
- [ ] 50. Assigned To dropdown → shows Shane/David/Chris → select → avatar appears
- [ ] 51. Set Reminder → form expands → enter date → Save → reminder created
- [ ] 52. "+ Add Task" → inline input → type title → Enter → task appears

### G. Workflow Tab — Subtask Interactions
- [ ] 53. Subtasks visible with checkbox, type dot, title, status badge
- [ ] 54. Subtask type dots show colors (verification=chartreuse, email=teal, etc.)
- [ ] 55. Click subtask checkbox → marks DONE with strikethrough
- [ ] 56. Click subtask status badge → cycles TO DO → IN PROGRESS → DONE
- [ ] 57. Double-click subtask title → inline edit → Enter saves
- [ ] 58. Click type dot → dropdown with 13 types (call, email, note, etc.) → select → color changes
- [ ] 59. Click dashed circle (no type) → type selector → select type
- [ ] 60. Click notes icon → textarea expands → type note → blur saves
- [ ] 61. Click X delete button → subtask removed
- [ ] 62. Drag subtask grip handle → subtask reorders
- [ ] 63. "+ Add Subtask" → type dropdown + title input → Enter → subtask with type appears

### H. Workflow Tab — Per-Task Files
- [ ] 64. Click "FILES ▸" → section expands
- [ ] 65. "Attach File" button visible
- [ ] 66. Click Attach File → file picker opens
- [ ] 67. Select a file → uploads to Supabase Storage → appears in list
- [ ] 68. File shows: icon, name, size, download button, delete button
- [ ] 69. Click download → file opens in new tab (signed URL)
- [ ] 70. Click delete → file removed from list
- [ ] 71. Error shown if upload fails

### I. Workflow Tab — Per-Task Comments
- [ ] 72. Click "COMMENTS ▸" → section expands
- [ ] 73. "No comments yet." shown initially
- [ ] 74. Type comment → Post → comment appears with author + timestamp
- [ ] 75. @David in comment → highlighted in teal
- [ ] 76. Click Reply → inline reply input → post reply → threaded
- [ ] 77. Own comments show Edit/Delete buttons
- [ ] 78. Delete own comment → removed

### J. Documents Tab
- [ ] 79. Documents tab loads with file list
- [ ] 80. Search filters documents by name
- [ ] 81. Document type filter dropdown works
- [ ] 82. Upload zone → drag file or click → upload works
- [ ] 83. Download button → signed URL → file opens
- [ ] 84. Lock/Unlock toggle → lock icon changes
- [ ] 85. Delete button (only on unlocked docs) → removes
- [ ] 86. Locked document → delete button disabled

### K. Comments Tab (Asset-Level)
- [ ] 87. Comments thread loads
- [ ] 88. Post new comment → appears immediately
- [ ] 89. @mention → teal highlight + notification created
- [ ] 90. Reply to comment → threaded display

### L. Tasks Tab (Asset-Level)
- [ ] 91. Tasks list loads grouped by stage
- [ ] 92. Subtask counts shown per task

### M. Activity Tab
- [ ] 93. Activity log loads with entries
- [ ] 94. Filter tabs (All/Operational/Governance/Compliance) work
- [ ] 95. Export CSV button → downloads file

### N. Gates Tab
- [ ] 96. Gates list shows gate stages
- [ ] 97. Gate status indicators visible

### O. Financials Tab
- [ ] 98. Payment tasks displayed with amounts
- [ ] 99. Incoming/outgoing totals calculated

### P. Partners Tab
- [ ] 100. Partners linked to asset displayed
- [ ] 101. Assign partner button works (if implemented)

### Q. Meetings Tab
- [ ] 102. Meetings tab loads
- [ ] 103. Create Meeting button → modal → fill form → create
- [ ] 104. Meeting detail expands with action items

### R. Tasks Page (/crm/tasks)
- [ ] 105. Task Dashboard loads with task count
- [ ] 106. Status tabs filter correctly (All/My Tasks/To Do/In Progress/Blocked/Done)
- [ ] 107. Kanban view shows 4 status columns
- [ ] 108. List view shows table
- [ ] 109. + New Task → modal → select asset → select stage → fill title → Create
- [ ] 110. Task Start/Complete buttons work from kanban cards

### S. Contacts Page (/crm/contacts)
- [ ] 111. Contacts page loads with list
- [ ] 112. Filter: All/Individuals/Entities
- [ ] 113. Search by name
- [ ] 114. Add Contact → modal → fill form → create
- [ ] 115. Click contact → detail page loads

### T. Partners Page (/crm/partners)
- [ ] 116. Partners grid loads
- [ ] 117. + Add Partner → modal → fill form → create
- [ ] 118. Click partner card → detail page loads

### U. Meetings Page (/crm/meetings)
- [ ] 119. Meetings list loads
- [ ] 120. + New Meeting → modal → fill form → create
- [ ] 121. Click meeting → detail expands

### V. Templates Page (/crm/templates)
- [ ] 122. Templates grid loads with 7+ templates
- [ ] 123. Value model filter works
- [ ] 124. Click template → editor opens
- [ ] 125. System template shows all stages/tasks
- [ ] 126. Add stage → type name → added
- [ ] 127. Add task → type name → added
- [ ] 128. Delete stage/task works
- [ ] 129. + Create Template → modal → create

### W. Other Pages
- [ ] 130. Activity page loads with audit log
- [ ] 131. Approvals page loads with pending queue
- [ ] 132. Approve/Reject workflow works
- [ ] 133. Team page shows 3 members
- [ ] 134. Compliance dashboard shows stats
- [ ] 135. Settings page loads, dark mode toggle works

### X. Cross-Cutting Concerns
- [ ] 136. Zero console errors after full test
- [ ] 137. Dark mode: all pages render correctly
- [ ] 138. Mobile 375px: layout doesn't break
- [ ] 139. All modals close with Escape or click outside
- [ ] 140. Data persists after page reload
