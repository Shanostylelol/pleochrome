# Page Spec: Document Library

**Phase:** 3 — Document Management
**URL:** `/crm/documents`
**Priority:** P0
**Dependencies:** Phase 0 (Foundation), Phase 2 (Asset Detail — governance step document slots)
**Estimated Build Time:** 3-4 hours
**Spec Version:** 1.0

---

## PURPOSE

Global document management across all assets, partners, and governance steps. This is the central repository where every file in the system can be found, filtered, uploaded, versioned, locked, and exported. The Document Library is critical for audit readiness — investors and regulators will use this page to verify that every required document exists.

---

## DATA SOURCES

### Database Tables

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `documents` | File metadata, versioning, lock status | `id`, `asset_id`, `step_id`, `partner_id`, `contact_id`, `meeting_id`, `document_type`, `filename`, `storage_path`, `file_size_bytes`, `mime_type`, `version`, `parent_document_id`, `is_locked`, `uploaded_by`, `uploaded_at`, `expires_at` |
| `assets` | Asset reference for association | `id`, `name`, `reference_code` |
| `asset_steps` | Step reference for association | `id`, `step_number`, `title` |
| `partners` | Partner reference for association | `id`, `name` |
| `team_members` | Uploader info | `id`, `full_name`, `avatar_url` |
| `activity_log` | Automatic audit entries on document mutations | Immutable — no frontend writes |

### Supabase Storage

| Bucket | Path Pattern | Purpose |
|--------|-------------|---------|
| `asset-documents` | `{asset_id}/{step_number}/{filename}` | All asset-related documents |
| `partner-documents` | `{partner_id}/{filename}` | DD reports, contracts, NDAs |
| `meeting-attachments` | `{meeting_id}/{filename}` | Meeting-related files |

### Views

| View | Purpose |
|------|---------|
| `v_pipeline_board` | Used for asset dropdown filter options |

---

## PAGE LAYOUT

### Header

```
[Title] "Document Library" — Cormorant Garamond, 28px, --text-primary
[Right Section]
  [Button: "Upload"] — NeuButton primary, --accent-teal, icon: upload-cloud
  [Toggle: ViewMode] Grid (icon) | List (icon) — NeuButton group, ghost variant
[StorageStats]
  "[X] documents | [Y.Z] GB used | [N] locked" — DM Sans 12px, --text-muted, right-aligned
```

### Upload Zone (Collapsible)

- Position: below header, collapsed by default
- Toggle: expand when "Upload" button is clicked, or when files are dragged over the page
- Height: 120px when expanded
- Style: NeuCard pressed/concave, dashed border using `--border-default`
- Text: "Drag files here to upload, or click to browse" — DM Sans 14px, --text-muted, centered
- Drag state: border becomes solid `--accent-teal`, background gains `rgba(26,139,122,0.08)` tint
- Multi-file support: accept multiple files simultaneously
- After file selection, each file shows an inline row:
  1. Filename + size
  2. Document type dropdown (AI-suggested from filename pattern matching, user confirms/changes)
  3. Asset association dropdown (required)
  4. Step association dropdown (filtered by selected asset)
  5. Partner association dropdown (optional)
  6. Per-file "Upload" button OR "Upload All" batch button at bottom

**Document type auto-suggestion rules (filename pattern matching):**
- `gia-*` or `*grading*` -> GIA_REPORT
- `appraisal*` or `*uspap*` -> APPRAISAL
- `ppm*` or `*placement*memo*` -> LEGAL
- `insurance*` or `*coverage*cert*` -> CUSTODY
- `kyc*` or `*aml*` or `*ofac*` -> KYC
- Default: OTHER

### Search Bar

- Full-width NeuInput, pressed/concave style
- Icon: search (magnifying glass) on left
- Placeholder: "Search by filename, document type, or content..."
- Debounced 300ms — filters results in real-time as user types
- Clear button (X) appears when text is entered

### Filter Bar

Layout: flex row, 8px gap, flex-wrap

| Filter | Component | Options |
|--------|-----------|---------|
| Document Type | NeuSelect (dropdown) | "All Types", GIA_REPORT, APPRAISAL, LEGAL, CUSTODY, KYC, OTHER, PPM, INSURANCE, SUBSCRIPTION_AGREEMENT, BOARD_RESOLUTION, MEETING_TRANSCRIPT, DD_REPORT, CONTRACT, NDA |
| Asset | NeuSelect (dropdown with search) | "All Assets" + all active assets by name |
| Step | NeuSelect (dropdown) | "All Steps" + filtered by selected asset (disabled if no asset selected) |
| Uploaded By | NeuSelect (dropdown) | "All" + team member names with avatars |
| Date Range | NeuDateRangePicker | Start date / end date |
| Lock Status | NeuSelect (dropdown) | "All", "Locked", "Unlocked" |
| [Clear Filters] | NeuButton ghost | Visible when any filter is active |

### Document Table (List View — Default)

Sortable columns — click header to sort ascending, click again for descending. Current sort indicated by triangle icon.

| Column | Width | Content | Sortable |
|--------|-------|---------|----------|
| Checkbox | 40px | NeuCheckbox for batch selection | No |
| Type | 120px | NeuBadge colored by document type | Yes |
| Filename | flex | DM Sans 14px, --text-primary, linked (click opens preview) | Yes |
| Asset | 180px | Asset name, linked to `/crm/assets/[id]` | Yes |
| Step | 80px | Step number, JetBrains Mono 12px, --text-muted | Yes |
| Version | 60px | "v2" badge if version > 1 | Yes |
| Date | 100px | Upload date, DM Sans 12px, --text-muted | Yes |
| Uploader | 140px | NeuAvatar (24px) + name | Yes |
| Size | 80px | Formatted file size (KB/MB), right-aligned | Yes |
| Lock | 60px | Lock icon (filled ruby if locked, outline gray if unlocked) | Yes |
| Actions | 140px | Icon buttons: Preview (eye), Download (download), Version History (clock), Lock/Unlock (lock toggle) | No |

**Row interactions:**
- Hover: `--bg-tertiary` background
- Row click: opens document preview modal
- Checkbox click: selects for batch operations

### Document Grid (Card View)

Responsive grid: 4 columns on xl (1280px+), 3 on lg (1024px+), 2 on md (768px+), 1 on sm (<768px)
Gap: 16px

**DocumentCard (NeuCard raised):**
```
[TypeBadge] — colored by category, top-left
[LockIcon] — top-right if locked, --accent-ruby
[Preview Thumbnail] — 160px height, contained fit
  - PDF: first page thumbnail (generated server-side or placeholder icon)
  - Image: actual image preview
  - Other: file type icon (64px)
[Filename] — DM Sans 14px, --text-primary, truncated with ellipsis
[Version Badge] — "v2" pill if version > 1
[Asset Name] — DM Sans 12px, --text-muted, linked
[Step Ref] — "Step 2.1" JetBrains Mono 11px, --text-muted
[Meta] — "Uploaded by Shane on Apr 15" DM Sans 11px, --text-muted
[Actions on hover] — Preview | Download | Replace icon buttons
```

### Batch Action Bar

- Position: fixed to bottom of viewport
- Visibility: appears when 1+ documents are selected via checkboxes
- Height: 56px
- Background: `--bg-tertiary` with `--border-default` top border
- Shadow: `--shadow-panel` (upward)
- Layout: flex row, items center, space-between, padding 0 24px

```
[Left] "[X] documents selected" — DM Sans 14px, --text-primary
[Right]
  [Button: "Download ZIP"] — NeuButton primary, icon: download
  [Button: "Lock Selected"] — NeuButton outline, icon: lock, --accent-amber
  [Button: "Export CSV"] — NeuButton ghost, icon: file-spreadsheet
  [Button: "Deselect All"] — NeuButton ghost, --text-muted
```

### Preview Modal

- Trigger: click filename or preview icon
- Component: NeuModal, 800px wide, max-height 90vh
- Header: filename + type badge + version + lock status
- Body: PDF viewer (react-pdf or iframe with signed URL) for PDFs, `<img>` for images, "Preview not available" message for other types
- Footer actions: Download, Replace (upload new version), Lock/Unlock, View Version History, Close
- Keyboard: Escape to close

### Version History Modal

- Trigger: click version history (clock) icon
- Component: NeuModal, 600px wide
- Header: "Version History — [filename]"
- Body: vertical list of all versions (queried via `parent_document_id` chain)
- Each version row: version number, uploader avatar+name, upload date, file size, "Download" button, "Preview" button
- Current version highlighted with `--accent-teal` left border
- Oldest version at bottom, newest at top

---

## Mobile Layout

### Breakpoint Behavior

**Below 768px (phones):**

- **View mode:** List view only (grid view hidden). Simplified columns — only Filename, Document Type badge, and Upload Date visible. All other columns hidden behind a tap-to-expand row detail.
- **Upload zone:** Tap-to-upload button instead of drag-and-drop. Button includes camera icon option for taking photos of physical documents. Upload zone is always visible as a compact bar (not collapsible).
- **Preview:** Full-screen modal (not 800px centered). Document fills viewport width. Pinch-to-zoom supported for images/PDFs.
- **Batch select:** Long-press a document row to enter selection mode. Once in selection mode, tap to toggle selection. Batch action bar slides up from bottom.
- **Filter bar:** Filters collapse into a single "Filter" button that opens a bottom sheet with all filter options stacked vertically.
- **Search bar:** Full-width, sticky below header.
- **Table rows:** Minimum 48px height for touch targets.
- **Batch action bar:** Full-width bottom sheet with stacked action buttons (not inline row).

**768px-1023px (tablets):**

- **View mode:** Both grid and list available. Grid shows 2 columns.
- **Upload zone:** Drag-and-drop supported.
- **Preview:** 600px wide modal.

**1024px+ (desktop):**

- Full layout as designed.

### Document Upload Validation (Mobile)

- File size max: 50MB per file (show clear error if exceeded before upload starts)
- Allowed MIME types: `application/pdf`, `image/jpeg`, `image/png`, `image/webp`, `application/vnd.openxmlformats-officedocument.*`, `text/csv`, `text/plain`
- Camera capture: `accept="image/*;capture=camera"` attribute on mobile file input
- Filename sanitization: strip special characters, limit to 255 characters
- Duplicate filename check within the same asset+step (warn user, allow override)

---

## DOCUMENT TYPE BADGES

| Type | Color | Label |
|------|-------|-------|
| GIA_REPORT | `--accent-teal` (#1A8B7A) | GIA Report |
| APPRAISAL | `--accent-emerald` (#1B6B4A) | Appraisal |
| LEGAL | `--accent-amber` (#C47A1A) | Legal |
| CUSTODY | `--accent-sapphire` (#1E3A6E) | Custody |
| KYC | `--accent-amethyst` (#5B2D8E) | KYC |
| OTHER | `--text-muted` (#64748b) | Other |
| PPM | `--accent-amber` (#C47A1A) | PPM |
| INSURANCE | `--accent-sapphire` (#1E3A6E) | Insurance |
| DD_REPORT | `--accent-amethyst` (#5B2D8E) | DD Report |
| CONTRACT | `--accent-emerald` (#1B6B4A) | Contract |
| NDA | `--accent-amber` (#C47A1A) | NDA |

---

## COMPONENTS USED

| Component | Source | Usage |
|-----------|--------|-------|
| NeuCard | `src/components/ui/NeuCard` | Document cards (grid view), upload zone, preview container |
| NeuButton | `src/components/ui/NeuButton` | Upload, Download, Lock, Export, filter clear, batch actions |
| NeuBadge | `src/components/ui/NeuBadge` | Document type badges, version badges, lock status |
| NeuInput | `src/components/ui/NeuInput` | Search bar, filename input |
| NeuSelect | `src/components/ui/NeuSelect` | All filter dropdowns |
| NeuCheckbox | `src/components/ui/NeuCheckbox` | Batch selection checkboxes |
| NeuModal | `src/components/ui/NeuModal` | Preview modal, version history modal |
| NeuAvatar | `src/components/ui/NeuAvatar` | Uploader avatars in table and cards |
| NeuProgress | `src/components/ui/NeuProgress` | Upload progress indicator |
| NeuTabs | `src/components/ui/NeuTabs` | View toggle (Grid/List) |

### New CRM Components to Create

| Component | Path | Purpose |
|-----------|------|---------|
| DocumentTable | `src/components/crm/DocumentTable` | Sortable document table with column headers |
| DocumentCard | `src/components/crm/DocumentCard` | Grid view document card |
| DocumentUploadZone | `src/components/crm/DocumentUploadZone` | Drag-and-drop upload area with type suggestion |
| DocumentPreviewModal | `src/components/crm/DocumentPreviewModal` | Full document preview |
| DocumentVersionHistory | `src/components/crm/DocumentVersionHistory` | Version chain display |
| BatchActionBar | `src/components/crm/BatchActionBar` | Fixed bottom bar for multi-select actions |
| SortableColumnHeader | `src/components/crm/SortableColumnHeader` | Reusable header with sort indicators |

---

## tRPC ROUTES

### Router: `src/server/routers/documents.ts`

| Procedure | Type | Input | Output | Notes |
|-----------|------|-------|--------|-------|
| `documents.list` | query | `{ search?, documentType?, assetId?, stepId?, uploadedBy?, dateFrom?, dateTo?, isLocked?, sortBy?, sortDir?, page?, pageSize? }` | `{ documents: Document[], total: number, page: number }` | Paginated, all filters optional. JOIN with assets, asset_steps, team_members for display data. |
| `documents.upload` | mutation | `{ filename, fileSize, mimeType, documentType, assetId, stepId?, partnerId?, filePath }` | `{ document: Document }` | Validates MIME type. Inserts document record. Activity logged by DB trigger. |
| `documents.getVersions` | query | `{ documentId }` | `{ versions: Document[] }` | Recursive CTE on `parent_document_id` to get full version chain, ordered newest first. |
| `documents.lock` | mutation | `{ documentId }` | `{ document: Document }` | Sets `is_locked = true`. Once locked, cannot be unlocked except by admin. Activity logged. |
| `documents.unlock` | mutation | `{ documentId }` | `{ document: Document }` | Only CEO/CTO role. Sets `is_locked = false`. Activity logged. |
| `documents.delete` | mutation | `{ documentId }` | `{ success: boolean }` | Soft delete. Fails if `is_locked = true` (DB trigger enforced). Removes file from Storage. Activity logged. |
| `documents.batchDownload` | mutation | `{ documentIds: string[] }` | `{ downloadUrl: string }` | Generates ZIP of selected documents via Edge Function. Returns signed URL for download. |
| `documents.replace` | mutation | `{ documentId, filename, fileSize, mimeType, filePath }` | `{ document: Document }` | Creates new version. Sets `parent_document_id` to previous document. Increments version. Old file preserved. |
| `documents.getStats` | query | `{}` | `{ totalCount: number, totalSizeBytes: number, lockedCount: number }` | Storage stats for header display. |

### Data Validation Rules

All upload validation enforced on BOTH client and server:

| Rule | Client-Side | Server-Side (tRPC) |
|------|------------|-------------------|
| File size max 50MB | Check `file.size` before upload starts, show error toast | `z.number().int().positive().max(52_428_800, "File size cannot exceed 50MB")` |
| Allowed MIME types | Check `file.type` against allowlist | `z.enum([...ALLOWED_MIME_TYPES], { errorMap: () => ({ message: "File type not supported" }) })` |
| Filename max 255 chars | Truncate on client | `z.string().min(1).max(255, "Filename too long")` |
| Filename sanitization | Strip `< > : " / \\ | ? *` characters | Same regex on server |
| Duplicate check | Warn user, allow override | Check `documents` table for same `asset_id + step_id + filename` |
| Total asset storage max 500MB | Show running total in upload zone | Aggregate check before insert |

**Allowed MIME types constant (shared):**
```typescript
export const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/csv',
  'text/plain',
] as const
```

### Zod Schemas

```typescript
// Input validation
const DocumentListInput = z.object({
  search: z.string().optional(),
  documentType: z.enum(['GIA_REPORT', 'APPRAISAL', 'LEGAL', 'CUSTODY', 'KYC', 'OTHER', 'PPM', 'INSURANCE', 'DD_REPORT', 'CONTRACT', 'NDA']).optional(),
  assetId: z.string().uuid().optional(),
  stepId: z.string().uuid().optional(),
  uploadedBy: z.string().uuid().optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  isLocked: z.boolean().optional(),
  sortBy: z.enum(['document_type', 'filename', 'created_at', 'file_size', 'version']).default('created_at'),
  sortDir: z.enum(['asc', 'desc']).default('desc'),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(10).max(100).default(20),
});

const DocumentUploadInput = z.object({
  filename: z.string()
    .min(1, "Filename is required")
    .max(255, "Filename too long")
    .regex(/^[^<>:"/\\|?*]+$/, "Filename contains invalid characters"),
  fileSize: z.number()
    .int()
    .positive("File size must be positive")
    .max(52_428_800, "File size cannot exceed 50MB"),
  mimeType: z.enum(
    ['application/pdf', 'image/jpeg', 'image/png', 'image/webp',
     'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
     'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
     'application/vnd.openxmlformats-officedocument.presentationml.presentation',
     'text/csv', 'text/plain'],
    { errorMap: () => ({ message: "File type not supported. Accepted: PDF, images, Word, Excel, CSV, text." }) }
  ),
  documentType: z.enum(['GIA_REPORT', 'APPRAISAL', 'LEGAL', 'CUSTODY', 'KYC', 'OTHER', 'PPM', 'INSURANCE', 'DD_REPORT', 'CONTRACT', 'NDA']),
  assetId: z.string().uuid("Invalid asset ID"),
  stepId: z.string().uuid("Invalid step ID").optional(),
  partnerId: z.string().uuid("Invalid partner ID").optional(),
  filePath: z.string().min(1, "File path is required"),
});
```

---

## SUPABASE STORAGE INTEGRATION

### Upload Flow

1. Frontend calls `supabase.storage.from('asset-documents').upload(path, file)` directly (Storage uploads are the one exception to "no direct Supabase calls from components")
2. Path format: `{asset_id}/{step_number}/{timestamp}-{filename}`
3. On successful upload, call `documents.upload` tRPC mutation with the returned file path
4. tRPC mutation validates MIME type, creates document record, DB trigger logs activity

### MIME Type Validation

Allowed types:
- `application/pdf`
- `image/jpeg`, `image/png`, `image/webp`, `image/tiff`
- `application/msword`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
- `application/vnd.ms-excel`, `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- `text/plain`, `text/csv`

Reject all others with error: "File type not supported. Accepted: PDF, images, Word, Excel, text, CSV."

### Download

- Generate signed URL via `supabase.storage.from(bucket).createSignedUrl(path, 3600)` (1 hour expiry)
- For batch download: Edge Function fetches all files, streams into ZIP using `archiver` library

---

## KEYBOARD SHORTCUTS

| Key | Action |
|-----|--------|
| `Cmd+K` | Open global search (command palette) |
| `Cmd+U` | Open upload zone (when on this page) |
| `Escape` | Close modal, deselect all |
| `Cmd+A` | Select all visible documents (when table is focused) |

---

## TEST CRITERIA

| # | Test | Expected Result |
|---|------|-----------------|
| 1 | Navigate to `/crm/documents` | Page renders with header, empty state if no documents |
| 2 | Upload a PDF via drag-and-drop | File appears in Storage bucket, document record created, appears in table |
| 3 | Upload a PDF via click-to-browse | Same as above |
| 4 | Upload with AI type suggestion | Filename "gia-report-017093.pdf" auto-suggests GIA_REPORT type |
| 5 | Filter by document type | Only documents of selected type shown |
| 6 | Filter by asset | Only documents for selected asset shown |
| 7 | Filter by date range | Only documents within range shown |
| 8 | Search by filename | Table filters in real-time (300ms debounce) |
| 9 | Sort by any column | Click header sorts ascending, click again descending |
| 10 | Switch Grid/List view | View toggles, documents remain filtered/sorted |
| 11 | Click preview icon | Preview modal opens with document content |
| 12 | Click version history icon | Version history modal shows all versions |
| 13 | Lock a document | Lock icon turns ruby, document cannot be deleted |
| 14 | Attempt to delete locked document | Error: "This document is legally held and cannot be deleted" |
| 15 | Select 3 documents, click "Download ZIP" | ZIP file downloads containing all 3 files |
| 16 | Select 2 documents, click "Lock Selected" | Both documents show locked status |
| 17 | Select 5 documents, click "Export CSV" | CSV downloads with document metadata |
| 18 | Replace a document | New version created (v2), old version preserved in version history |
| 19 | Upload invalid MIME type (e.g., .exe) | Error toast: "File type not supported" |
| 20 | `npm run build` | Zero errors, zero warnings |
| 21 | Dark mode | All elements render correctly with CSS custom properties |
| 22 | Light mode | All elements render correctly with CSS custom properties |
| 23 | Empty state (no documents) | Illustration + "No documents yet. Upload your first document." message |
| 24 | Storage stats display | Header shows correct document count, total size, locked count |

---

## CLAUDE.md RULES APPLIED

- **Pre-flight check:** Read CLAUDE.md, DECISION-AUDIT-LOG.md, portal-data.ts before coding
- **Neumorphic design system:** All shadows via CSS custom properties, no inline box-shadow
- **Dark + light mode:** CSS custom properties for all colors, no hardcoded values
- **Atomic components:** Use NeuCard, NeuButton, NeuBadge etc. from `src/components/ui/`
- **tRPC for mutations:** No direct Supabase client calls except Storage uploads
- **Activity logging is automatic:** DB triggers handle audit trail, no manual frontend inserts
- **Documents with `is_locked = true` cannot be deleted:** Enforced at DB trigger level
- **MIME type validation:** Before storing in Supabase Storage
- **"asset" not "stone":** In all UI text. DB column is `asset_id`.
- **Test after build:** `npm run build` must pass with zero errors

---

## DEPENDENCIES ON OTHER PHASES

| Dependency | Phase | What's Needed |
|------------|-------|---------------|
| Foundation (Phase 0) | 0 | Design system, atomic components, tRPC setup, Supabase client |
| Asset Detail (Phase 2) | 2 | Asset exists to associate documents with. Governance step document slots reference this same documents table. |
| Per-step upload zones | 2 | The governance tab step detail uses the same DocumentUploadZone component |

### What This Phase Provides to Others

| Consumer | What |
|----------|------|
| Phase 4 (Tasks) | Tasks can reference evidence documents via `evidence_document_id` |
| Phase 5 (Partners) | Partner detail Documents tab reuses DocumentTable filtered by partner |
| Phase 5 (Meetings) | Meeting attachments use the same upload flow |
| Phase 7 (Compliance) | Compliance dashboard checks document expiry dates from this table |
| Phase 7 (Templates) | Governance requirements reference required document types |
