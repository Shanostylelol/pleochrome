# Spec: 00 — Supabase Initialization

**Phase:** 0 (Foundation)
**Step:** 0.1
**Depends On:** Nothing (this is the first step)
**Produces:** Running Supabase project with all tables, views, triggers, RLS policies, and storage buckets
**Estimated Time:** 30 minutes

---

## CLAUDE.md Rules That Apply

- `Database Rules #1`: Never modify `001_powerhouse_crm_schema.sql` or `002_modular_governance_schema.sql` directly. Create new migration files for changes.
- `Database Rules #2`: Run `npx supabase gen types typescript` after any migration to regenerate `database.types.ts`.
- `Database Rules #3`: The `activity_log` table is IMMUTABLE. No UPDATE or DELETE operations.
- `Database Rules #4`: Documents with `is_locked = true` cannot be deleted.
- `Database Rules #5`: Governance requirements can only be modified by CEO, CTO, or Compliance Officer.
- `Security Rules #5`: No secrets in client-side code. All API keys go in `.env.local`.

---

## Prerequisites

1. Supabase CLI installed globally: `brew install supabase/tap/supabase`
2. A Supabase project created at https://supabase.com/dashboard (you need the project ref and DB password)
3. You are authenticated: `supabase login`

---

## Step 1: Initialize Supabase in the Project

```bash
cd ~/Projects/pleochrome

# Initialize Supabase (creates supabase/ directory structure if not present)
supabase init --with-intellij-settings false
```

If the `supabase/` directory already exists (it does — migrations are already there), the CLI will recognize it. No harm in running `init` again.

---

## Step 2: Link to the Remote Supabase Project

```bash
# Replace YOUR_PROJECT_REF with the actual Supabase project reference ID
supabase link --project-ref YOUR_PROJECT_REF
```

You will be prompted for the database password. Enter it.

To find the project ref:
- Go to https://supabase.com/dashboard
- Select the PleoChrome project
- Settings > General > Reference ID (format: `abcdefghijklmnopqrst`)

---

## Step 3: Run Migration 001 — Core CRM Schema

```bash
supabase db push
```

This runs all migrations in `supabase/migrations/` in alphabetical order. The two files are:

1. **`001_powerhouse_crm_schema.sql`** — Creates:
   - 10 enum types: `value_path`, `workflow_phase`, `step_status`, `asset_status`, `partner_type`, `dd_status`, `risk_level`, `document_type`, `task_priority`, `task_status`, `kyc_status`, `contact_role`
   - 13 tables: `team_members`, `assets`, `asset_steps`, `partners`, `contacts`, `documents`, `activity_log`, `meeting_notes`, `tasks`, `gate_checks`, `asset_partners`, `notifications`, `comments`
   - 3 views: `v_pipeline_board`, `v_task_dashboard`, `v_compliance_dashboard`
   - 5 trigger functions: `prevent_activity_log_mutation()`, `prevent_locked_document_delete()`, `protect_document_lock()`, `log_stone_changes()`, `log_step_completion()`
   - 9 `updated_at` triggers (moddatetime on all mutable tables)
   - 2 utility functions: `generate_asset_reference()`, `populate_asset_steps()`
   - Helper functions: `get_team_member_id()`, `is_team_member()`
   - RLS policies on all 13 tables (read: all team members; write: team members; notifications: own only; comments: own edit/delete; activity_log: insert-only)
   - All indexes

2. **`002_modular_governance_schema.sql`** — Creates:
   - 1 enum type: `task_type`
   - Layer 1 tables: `governance_requirements`, `governance_documents`
   - Layer 2 tables: `partner_modules`, `module_tasks`, `default_tasks`
   - Layer 3 table: `asset_task_instances`
   - Alters `asset_steps` to add `governance_requirement_id` and `partner_module_id` columns
   - RLS policies on all new tables
   - Seeds ~25+ governance requirements (shared phases 1+2 + tokenization-specific phase 3+4)

If `supabase db push` fails (common with fresh projects), use the alternative:

```bash
# Alternative: run migrations directly via psql
supabase db reset
```

**WARNING:** `db reset` drops everything and re-runs all migrations. Only use on fresh/dev projects.

---

## Step 4: Verify Tables Exist

Run from the Supabase SQL Editor (Dashboard > SQL Editor) or via CLI:

```bash
supabase db execute --sql "
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
"
```

**Expected tables (19 total):**
```
activity_log
asset_partners
asset_steps
asset_task_instances
assets
comments
contacts
default_tasks
documents
gate_checks
governance_documents
governance_requirements
meeting_notes
module_tasks
notifications
partner_modules
partners
tasks
team_members
```

---

## Step 5: Verify Governance Requirements Seeded

```bash
supabase db execute --sql "
SELECT count(*) as total_requirements,
       count(*) FILTER (WHERE value_path IS NULL) as shared_requirements,
       count(*) FILTER (WHERE value_path = 'tokenization') as tokenization_requirements,
       count(*) FILTER (WHERE is_gate = true) as gates
FROM governance_requirements;
"
```

**Expected results:**
- `total_requirements`: 25+ (shared phase 1-2 steps + gates + tokenization phase 3-4 steps + gates)
- `shared_requirements`: 15+ (8 phase 1 steps + 2 gates + 10 phase 2 steps + 3 gates)
- `tokenization_requirements`: 10+ (6 phase 3 steps + 1 gate + 10 phase 4 steps + 1 gate)
- `gates`: 7+ (G1, G2, G3, G4, G5, G6, G7)

---

## Step 6: Verify Views Work

```bash
supabase db execute --sql "SELECT * FROM v_pipeline_board LIMIT 1;"
supabase db execute --sql "SELECT * FROM v_task_dashboard LIMIT 1;"
supabase db execute --sql "SELECT * FROM v_compliance_dashboard LIMIT 1;"
```

All three should return 0 rows (no data yet) without errors.

---

## Step 7: Verify Triggers Work

Test the immutable activity log:

```bash
supabase db execute --sql "
-- Insert a test row (should succeed)
INSERT INTO activity_log (entity_type, action, detail, severity, category)
VALUES ('test', 'test_run', 'Verifying immutability trigger', 'info', 'operational');

-- Attempt to update it (should FAIL with: 'activity_log is immutable')
-- DO NOT RUN THIS IN PRODUCTION — only for verification
-- UPDATE activity_log SET detail = 'modified' WHERE entity_type = 'test';
"
```

You can verify the update trigger is active by checking:

```bash
supabase db execute --sql "
SELECT trigger_name, event_manipulation
FROM information_schema.triggers
WHERE event_object_table = 'activity_log';
"
```

Expected: `trg_activity_log_no_update` (BEFORE UPDATE) and `trg_activity_log_no_delete` (BEFORE DELETE).

---

## Step 8: Create Storage Buckets

Go to Supabase Dashboard > Storage, or run via SQL:

```bash
supabase db execute --sql "
-- Create storage buckets (all private by default)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) VALUES
  ('asset-documents', 'asset-documents', false, 52428800, -- 50MB
   ARRAY['application/pdf', 'image/png', 'image/jpeg', 'image/webp',
         'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
         'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
         'text/csv', 'text/plain']),

  ('partner-documents', 'partner-documents', false, 52428800,
   ARRAY['application/pdf', 'image/png', 'image/jpeg', 'image/webp',
         'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
         'text/plain']),

  ('meeting-recordings', 'meeting-recordings', false, 524288000, -- 500MB
   ARRAY['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/webm',
         'video/mp4', 'video/webm', 'video/quicktime']),

  ('team-documents', 'team-documents', false, 52428800,
   ARRAY['application/pdf', 'image/png', 'image/jpeg', 'image/webp',
         'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
         'text/plain']),

  ('temp-uploads', 'temp-uploads', false, 52428800,
   ARRAY['application/pdf', 'image/png', 'image/jpeg', 'image/webp',
         'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
         'text/csv', 'text/plain'])
ON CONFLICT (id) DO NOTHING;
"
```

### Storage Bucket Policies

All buckets are private. Access is restricted to authenticated team members only.

```bash
supabase db execute --sql "
-- Policy: Team members can read from asset-documents
CREATE POLICY \"Team members can read asset documents\"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'asset-documents' AND (SELECT is_team_member()));

-- Policy: Team members can upload to asset-documents
CREATE POLICY \"Team members can upload asset documents\"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'asset-documents' AND (SELECT is_team_member()));

-- Policy: Team members can update asset-documents
CREATE POLICY \"Team members can update asset documents\"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'asset-documents' AND (SELECT is_team_member()));

-- Policy: Team members can delete from asset-documents
CREATE POLICY \"Team members can delete asset documents\"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'asset-documents' AND (SELECT is_team_member()));

-- Repeat for partner-documents
CREATE POLICY \"Team members can read partner documents\"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'partner-documents' AND (SELECT is_team_member()));

CREATE POLICY \"Team members can upload partner documents\"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'partner-documents' AND (SELECT is_team_member()));

CREATE POLICY \"Team members can update partner documents\"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'partner-documents' AND (SELECT is_team_member()));

CREATE POLICY \"Team members can delete partner documents\"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'partner-documents' AND (SELECT is_team_member()));

-- Repeat for meeting-recordings
CREATE POLICY \"Team members can read meeting recordings\"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'meeting-recordings' AND (SELECT is_team_member()));

CREATE POLICY \"Team members can upload meeting recordings\"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'meeting-recordings' AND (SELECT is_team_member()));

CREATE POLICY \"Team members can update meeting recordings\"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'meeting-recordings' AND (SELECT is_team_member()));

CREATE POLICY \"Team members can delete meeting recordings\"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'meeting-recordings' AND (SELECT is_team_member()));

-- Repeat for team-documents
CREATE POLICY \"Team members can read team documents\"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'team-documents' AND (SELECT is_team_member()));

CREATE POLICY \"Team members can upload team documents\"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'team-documents' AND (SELECT is_team_member()));

CREATE POLICY \"Team members can update team documents\"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'team-documents' AND (SELECT is_team_member()));

CREATE POLICY \"Team members can delete team documents\"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'team-documents' AND (SELECT is_team_member()));

-- Repeat for temp-uploads
CREATE POLICY \"Team members can read temp uploads\"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'temp-uploads' AND (SELECT is_team_member()));

CREATE POLICY \"Team members can upload temp files\"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'temp-uploads' AND (SELECT is_team_member()));

CREATE POLICY \"Team members can delete temp uploads\"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'temp-uploads' AND (SELECT is_team_member()));
"
```

---

## Step 9: Generate TypeScript Types

```bash
cd ~/Projects/pleochrome

# Generate types from the linked Supabase project
npx supabase gen types typescript --linked > src/lib/database.types.ts
```

**Verify the generated file contains:**
- `Database` interface with `public` schema
- All 18+ table definitions
- All enum types
- The `v_pipeline_board`, `v_task_dashboard`, `v_compliance_dashboard` view types

**IMPORTANT:** This file is auto-generated. Never edit it manually. Run this command again after any migration.

---

## Step 10: Seed Team Members (Development Only)

For development, seed the founding team so the CRM has users to work with:

```bash
supabase db execute --sql "
INSERT INTO team_members (full_name, email, role, title, is_active) VALUES
  ('Shane Pierson', 'shane@pleochrome.com', 'CEO', 'Chief Executive Officer & Chief Compliance Officer', true),
  ('David', 'david@pleochrome.com', 'CTO', 'Chief Technology Officer & COO', true),
  ('Chris', 'chris@pleochrome.com', 'CRO', 'Chief Revenue Officer', true)
ON CONFLICT (email) DO NOTHING;
"
```

**Note:** These team members do NOT have `auth_user_id` set yet. Auth linking happens when each person signs up via Supabase Auth. For development, the tRPC layer will use a mock user context (see spec `04-trpc-setup.md`).

---

## Verification Checklist

| Check | Command | Expected |
|-------|---------|----------|
| Tables exist | `SELECT count(*) FROM information_schema.tables WHERE table_schema='public'` | 19+ |
| Governance requirements seeded | `SELECT count(*) FROM governance_requirements` | 25+ |
| Views work | `SELECT * FROM v_pipeline_board LIMIT 1` | 0 rows, no error |
| Activity log immutable | Check triggers on `activity_log` | 2 triggers (no_update, no_delete) |
| Storage buckets exist | Dashboard > Storage | 5 buckets visible |
| Types generated | `ls src/lib/database.types.ts` | File exists, non-empty |
| Team members seeded | `SELECT count(*) FROM team_members` | 3 |

---

## Files Created/Modified

| File | Action |
|------|--------|
| `src/lib/database.types.ts` | CREATED (auto-generated, do not edit) |
| `supabase/.env` | CREATED by `supabase link` (contains DB connection string) |

---

## Troubleshooting

**"relation already exists" errors during push:**
The migrations are not idempotent. If you've run them before, use `supabase db reset` to start fresh.

**"permission denied for schema auth" errors:**
The `is_team_member()` function references `auth.uid()`. This works in Supabase but not in a bare Postgres instance. Always use the Supabase-hosted database.

**Types generation fails:**
Make sure you're linked (`supabase link`) and authenticated (`supabase login`). The types command needs a live connection.

**Storage bucket creation fails:**
If the SQL approach fails, create buckets manually via the Supabase Dashboard > Storage > New Bucket. Set each to Private, then apply policies via SQL Editor.
