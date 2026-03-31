-- ============================================================================
-- PLEOCHROME POWERHOUSE CRM V2 — Complete Schema Migration
-- ============================================================================
-- Date: 2026-03-30
-- Description: Replaces V1 schema with V2 Phase→Stage→Task→Subtask hierarchy.
--   Drops all V1 tables/enums/views/functions (except team_members).
--   Creates 16 enums, 25 tables, indexes, triggers, 6 RPCs.
-- ============================================================================

-- ============================================================================
-- 0. EXTENSIONS (idempotent)
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "moddatetime";

-- ============================================================================
-- 1. DROP V1 — Views, Triggers, Functions, Tables, Enums
-- ============================================================================

-- 1.1 Drop V1 views
DROP VIEW IF EXISTS v_unified_tasks CASCADE;
DROP VIEW IF EXISTS v_asset_governance_progress CASCADE;
DROP VIEW IF EXISTS v_governance_coverage CASCADE;
DROP VIEW IF EXISTS v_compliance_dashboard CASCADE;
DROP VIEW IF EXISTS v_task_dashboard CASCADE;
DROP VIEW IF EXISTS v_pipeline_board CASCADE;

-- 1.2 Drop V1 triggers (on tables that will be dropped — CASCADE handles most)
-- Explicit drops for safety on tables we keep or rename
DROP TRIGGER IF EXISTS trg_activity_log_no_update ON activity_log;
DROP TRIGGER IF EXISTS trg_activity_log_no_delete ON activity_log;

-- 1.3 Drop V1 tables (reverse dependency order, CASCADE for FKs)
DROP TABLE IF EXISTS asset_task_instances CASCADE;
DROP TABLE IF EXISTS default_tasks CASCADE;
DROP TABLE IF EXISTS module_tasks CASCADE;
DROP TABLE IF EXISTS partner_modules CASCADE;
DROP TABLE IF EXISTS governance_documents CASCADE;
DROP TABLE IF EXISTS governance_requirements CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS asset_partners CASCADE;
DROP TABLE IF EXISTS gate_checks CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS meeting_notes CASCADE;
DROP TABLE IF EXISTS activity_log CASCADE;
DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS contacts CASCADE;
DROP TABLE IF EXISTS partners CASCADE;
DROP TABLE IF EXISTS asset_steps CASCADE;
DROP TABLE IF EXISTS assets CASCADE;
-- team_members is PRESERVED

-- 1.4 Drop V1 functions
DROP FUNCTION IF EXISTS prevent_activity_log_mutation() CASCADE;
DROP FUNCTION IF EXISTS prevent_locked_document_delete() CASCADE;
DROP FUNCTION IF EXISTS protect_document_lock() CASCADE;
DROP FUNCTION IF EXISTS log_stone_changes() CASCADE;
DROP FUNCTION IF EXISTS log_step_completion() CASCADE;
DROP FUNCTION IF EXISTS log_task_instance_completion() CASCADE;
DROP FUNCTION IF EXISTS generate_asset_reference() CASCADE;
DROP FUNCTION IF EXISTS populate_asset_steps(uuid, value_path) CASCADE;
DROP FUNCTION IF EXISTS assemble_asset_workflow(uuid, uuid[]) CASCADE;
-- Keep: is_team_member(), get_team_member_id() (used for auth)

-- 1.5 Drop V1 enums
DROP TYPE IF EXISTS value_path CASCADE;
DROP TYPE IF EXISTS workflow_phase CASCADE;
DROP TYPE IF EXISTS step_status CASCADE;
DROP TYPE IF EXISTS asset_status CASCADE;
DROP TYPE IF EXISTS partner_type CASCADE;
DROP TYPE IF EXISTS dd_status CASCADE;
DROP TYPE IF EXISTS risk_level CASCADE;
DROP TYPE IF EXISTS document_type CASCADE;
DROP TYPE IF EXISTS task_priority CASCADE;
DROP TYPE IF EXISTS task_status CASCADE;
DROP TYPE IF EXISTS kyc_status CASCADE;
DROP TYPE IF EXISTS contact_role CASCADE;
DROP TYPE IF EXISTS task_type CASCADE;


-- ============================================================================
-- 2. V2 ENUM TYPES (16 total)
-- ============================================================================

-- 2.1 Lifecycle phases
CREATE TYPE v2_phase AS ENUM (
  'lead', 'intake', 'asset_maturity', 'security', 'value_creation', 'distribution'
);

-- 2.2 Value creation models
CREATE TYPE v2_value_model AS ENUM (
  'tokenization', 'fractional_securities', 'debt_instrument', 'broker_sale', 'barter'
);

-- 2.3 Asset status
CREATE TYPE v2_asset_status AS ENUM (
  'active', 'paused', 'completed', 'terminated', 'archived'
);

-- 2.4 Stage status
CREATE TYPE v2_stage_status AS ENUM (
  'not_started', 'in_progress', 'completed', 'skipped'
);

-- 2.5 Task types (11 total — includes review + communication from addendum)
CREATE TYPE v2_task_type AS ENUM (
  'document_upload', 'meeting', 'physical_action', 'payment_outgoing',
  'payment_incoming', 'approval', 'review', 'due_diligence', 'filing',
  'communication', 'automated'
);

-- 2.6 Task status
CREATE TYPE v2_task_status AS ENUM (
  'todo', 'in_progress', 'blocked', 'pending_approval',
  'approved', 'rejected', 'done', 'cancelled'
);

-- 2.7 Subtask status
CREATE TYPE v2_subtask_status AS ENUM (
  'todo', 'in_progress', 'pending_approval', 'approved',
  'rejected', 'done', 'cancelled'
);

-- 2.8 Approval decision
CREATE TYPE v2_approval_decision AS ENUM (
  'pending', 'approved', 'rejected', 'abstained'
);

-- 2.9 Notification type
CREATE TYPE v2_notification_type AS ENUM (
  'comment_mention', 'comment_reply', 'task_assigned', 'subtask_assigned',
  'approval_requested', 'approval_decision', 'stage_completed', 'phase_advanced',
  'document_uploaded', 'deadline_approaching', 'deadline_overdue',
  'gate_ready', 'asset_status_changed'
);

-- 2.10 Audit action types
CREATE TYPE v2_audit_action AS ENUM (
  'created', 'updated', 'deleted', 'status_changed', 'phase_advanced',
  'stage_completed', 'task_completed', 'subtask_completed',
  'approval_requested', 'approval_decided', 'document_uploaded',
  'document_locked', 'document_unlocked', 'comment_posted',
  'template_saved', 'template_instantiated', 'gate_passed', 'gate_failed',
  'asset_archived', 'asset_terminated'
);

-- 2.11 Partner types (includes qualified_intermediary from addendum)
CREATE TYPE v2_partner_type AS ENUM (
  'appraiser', 'vault_custodian', 'broker_dealer', 'securities_counsel',
  'general_counsel', 'transfer_agent', 'tokenization_platform', 'oracle_provider',
  'insurance_broker', 'kyc_provider', 'registered_agent', 'auditor',
  'smart_contract_auditor', 'gemological_lab', 'escrow_agent', 'title_company',
  'surveyor', 'environmental', 'qualified_intermediary', 'other'
);

-- 2.12 Contact role
CREATE TYPE v2_contact_role AS ENUM (
  'asset_holder', 'beneficial_owner', 'investor', 'partner_contact',
  'counsel', 'appraiser', 'vault_manager', 'regulator', 'broker', 'other'
);

-- 2.13 Document category: TEXT field (not enum) for flexibility

-- 2.14 Risk level
CREATE TYPE v2_risk_level AS ENUM ('low', 'medium', 'high', 'critical');

-- 2.15 Due diligence status
CREATE TYPE v2_dd_status AS ENUM (
  'not_started', 'in_progress', 'passed', 'failed', 'expired', 'waived'
);

-- 2.16 KYC status
CREATE TYPE v2_kyc_status AS ENUM (
  'not_started', 'pending', 'verified', 'failed', 'expired'
);


-- ============================================================================
-- 3. V2 TABLES
-- ============================================================================

-- 3.1 team_members — PRESERVED from V1 (no changes)

-- 3.2 assets
CREATE TABLE assets (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                    TEXT NOT NULL,
  asset_type              TEXT NOT NULL,
  description             TEXT,
  reference_code          TEXT UNIQUE NOT NULL,
  carat_weight            DECIMAL(12,2),
  asset_count             INTEGER,
  origin                  TEXT,
  current_location        TEXT,
  claimed_value           DECIMAL(15,2),
  appraised_value         DECIMAL(15,2),
  currency                TEXT NOT NULL DEFAULT 'USD',
  current_phase           v2_phase NOT NULL DEFAULT 'lead',
  value_model             v2_value_model,
  status                  v2_asset_status NOT NULL DEFAULT 'active',
  asset_holder_contact_id UUID,
  asset_holder_entity     TEXT,
  spv_name                TEXT,
  spv_ein                 TEXT,
  lead_team_member_id     UUID REFERENCES team_members(id) ON DELETE SET NULL,
  assigned_team_ids       UUID[] DEFAULT '{}',
  source_template_id      UUID,
  metadata                JSONB NOT NULL DEFAULT '{}',
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at            TIMESTAMPTZ,
  terminated_at           TIMESTAMPTZ,
  termination_reason      TEXT,
  is_deleted              BOOLEAN NOT NULL DEFAULT false,
  deleted_at              TIMESTAMPTZ,
  deleted_by              UUID REFERENCES team_members(id)
);

-- 3.3 contacts
CREATE TABLE contacts (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name         TEXT NOT NULL,
  role              v2_contact_role NOT NULL DEFAULT 'other',
  title             TEXT,
  entity            TEXT,
  email             TEXT,
  phone             TEXT,
  address           TEXT,
  kyc_status        v2_kyc_status NOT NULL DEFAULT 'not_started',
  kyc_verified_at   TIMESTAMPTZ,
  kyc_expires_at    TIMESTAMPTZ,
  ofac_status       TEXT DEFAULT 'not_screened',
  ofac_screened_at  TIMESTAMPTZ,
  pep_status        TEXT DEFAULT 'not_screened',
  pep_screened_at   TIMESTAMPTZ,
  partner_id        UUID,
  notes             TEXT,
  tags              TEXT[] DEFAULT '{}',
  metadata          JSONB NOT NULL DEFAULT '{}',
  -- Addendum: contact type + KYC/KYB fields
  contact_type      TEXT NOT NULL DEFAULT 'individual',
  date_of_birth     DATE,
  ssn_last_four     TEXT,
  citizenship       TEXT,
  id_type           TEXT,
  id_number_last_four TEXT,
  id_expiry         DATE,
  id_issuing_authority TEXT,
  entity_name       TEXT,
  entity_type       TEXT,
  state_of_formation TEXT,
  date_of_formation DATE,
  ein               TEXT,
  registered_agent  TEXT,
  principal_address TEXT,
  website           TEXT,
  source            TEXT,
  referral_source   TEXT,
  relationship_status TEXT DEFAULT 'prospect',
  preferred_contact_method TEXT DEFAULT 'email',
  timezone          TEXT,
  is_deleted        BOOLEAN NOT NULL DEFAULT false,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Deferred FK: assets -> contacts
ALTER TABLE assets
  ADD CONSTRAINT fk_assets_holder_contact
  FOREIGN KEY (asset_holder_contact_id)
  REFERENCES contacts(id) ON DELETE SET NULL;

-- 3.4 partners
CREATE TABLE partners (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name              TEXT NOT NULL,
  type              v2_partner_type NOT NULL,
  website           TEXT,
  description       TEXT,
  dd_status         v2_dd_status NOT NULL DEFAULT 'not_started',
  dd_report_url     TEXT,
  dd_completed_at   TIMESTAMPTZ,
  dd_expires_at     TIMESTAMPTZ,
  risk_level        v2_risk_level,
  contact_name      TEXT,
  contact_email     TEXT,
  contact_phone     TEXT,
  contact_title     TEXT,
  engagement_status TEXT DEFAULT 'evaluating',
  contract_start    DATE,
  contract_end      DATE,
  fee_structure     JSONB,
  notes             TEXT,
  tags              TEXT[] DEFAULT '{}',
  metadata          JSONB NOT NULL DEFAULT '{}',
  is_deleted        BOOLEAN NOT NULL DEFAULT false,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Deferred FK: contacts -> partners
ALTER TABLE contacts
  ADD CONSTRAINT fk_contacts_partner
  FOREIGN KEY (partner_id)
  REFERENCES partners(id) ON DELETE SET NULL;

-- 3.5 asset_partners (junction)
CREATE TABLE asset_partners (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id        UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  partner_id      UUID NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  role_on_asset   TEXT,
  engagement_date DATE,
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(asset_id, partner_id)
);

-- 3.6 workflow_templates
CREATE TABLE workflow_templates (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  description     TEXT,
  value_model     v2_value_model,
  is_system       BOOLEAN NOT NULL DEFAULT false,
  is_default      BOOLEAN NOT NULL DEFAULT false,
  source_asset_id UUID REFERENCES assets(id) ON DELETE SET NULL,
  version         INTEGER NOT NULL DEFAULT 1,
  parent_template_id UUID REFERENCES workflow_templates(id) ON DELETE SET NULL,
  created_by      UUID REFERENCES team_members(id),
  metadata        JSONB NOT NULL DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- FK: assets -> workflow_templates
ALTER TABLE assets
  ADD CONSTRAINT fk_assets_template
  FOREIGN KEY (source_template_id)
  REFERENCES workflow_templates(id) ON DELETE SET NULL;

-- 3.7 template_stages
CREATE TABLE template_stages (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id         UUID NOT NULL REFERENCES workflow_templates(id) ON DELETE CASCADE,
  phase               v2_phase NOT NULL,
  sort_order          INTEGER NOT NULL DEFAULT 0,
  name                TEXT NOT NULL,
  description         TEXT,
  regulatory_basis    TEXT,
  regulatory_citation TEXT,
  source_url          TEXT,
  is_gate             BOOLEAN NOT NULL DEFAULT false,
  gate_id             TEXT,
  is_hidden           BOOLEAN NOT NULL DEFAULT false,
  required_document_types TEXT[] DEFAULT '{}',
  required_approvals  JSONB DEFAULT '{}',
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(template_id, phase, sort_order)
);

-- 3.8 template_tasks
CREATE TABLE template_tasks (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_stage_id   UUID NOT NULL REFERENCES template_stages(id) ON DELETE CASCADE,
  title               TEXT NOT NULL,
  description         TEXT,
  task_type           v2_task_type NOT NULL DEFAULT 'physical_action',
  default_assignee_role TEXT,
  estimated_duration_days INTEGER,
  relative_due_offset_days INTEGER,
  approval_config     JSONB DEFAULT '{}',
  estimated_amount    DECIMAL(15,2),
  payment_recipient   TEXT,
  payment_description TEXT,
  sort_order          INTEGER NOT NULL DEFAULT 0,
  -- Addendum fields
  is_hidden           BOOLEAN NOT NULL DEFAULT false,
  partner_type        TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3.9 template_subtasks
CREATE TABLE template_subtasks (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_task_id    UUID NOT NULL REFERENCES template_tasks(id) ON DELETE CASCADE,
  title               TEXT NOT NULL,
  description         TEXT,
  default_assignee_role TEXT,
  sort_order          INTEGER NOT NULL DEFAULT 0,
  requires_approval   BOOLEAN NOT NULL DEFAULT false,
  approval_config     JSONB DEFAULT '{}',
  -- Addendum fields
  is_hidden           BOOLEAN NOT NULL DEFAULT false,
  subtask_type        v2_task_type,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3.10 asset_stages (instance layer)
CREATE TABLE asset_stages (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id            UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  phase               v2_phase NOT NULL,
  sort_order          INTEGER NOT NULL DEFAULT 0,
  name                TEXT NOT NULL,
  description         TEXT,
  source_template_stage_id UUID REFERENCES template_stages(id) ON DELETE SET NULL,
  status              v2_stage_status NOT NULL DEFAULT 'not_started',
  started_at          TIMESTAMPTZ,
  completed_at        TIMESTAMPTZ,
  completed_by        UUID REFERENCES team_members(id),
  is_gate             BOOLEAN NOT NULL DEFAULT false,
  gate_id             TEXT,
  gate_passed_at      TIMESTAMPTZ,
  gate_passed_by      UUID REFERENCES team_members(id),
  is_hidden           BOOLEAN NOT NULL DEFAULT false,
  regulatory_basis    TEXT,
  regulatory_citation TEXT,
  required_document_types TEXT[] DEFAULT '{}',
  required_approvals  JSONB DEFAULT '{}',
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(asset_id, phase, sort_order)
);

-- 3.11 tasks (instance layer)
CREATE TABLE tasks (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id            UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  stage_id            UUID NOT NULL REFERENCES asset_stages(id) ON DELETE CASCADE,
  source_template_task_id UUID REFERENCES template_tasks(id) ON DELETE SET NULL,
  title               TEXT NOT NULL,
  description         TEXT,
  task_type           v2_task_type NOT NULL DEFAULT 'physical_action',
  assigned_to         UUID REFERENCES team_members(id) ON DELETE SET NULL,
  assigned_by         UUID REFERENCES team_members(id),
  assigned_at         TIMESTAMPTZ,
  status              v2_task_status NOT NULL DEFAULT 'todo',
  started_at          TIMESTAMPTZ,
  completed_at        TIMESTAMPTZ,
  completed_by        UUID REFERENCES team_members(id),
  due_date            TIMESTAMPTZ,
  estimated_duration_days INTEGER,
  estimated_amount    DECIMAL(15,2),
  actual_amount       DECIMAL(15,2),
  payment_recipient   TEXT,
  payment_description TEXT,
  payment_reference   TEXT,
  evidence_urls       TEXT[] DEFAULT '{}',
  notes               TEXT,
  sort_order          INTEGER NOT NULL DEFAULT 0,
  is_deleted          BOOLEAN NOT NULL DEFAULT false,
  -- Addendum fields
  is_hidden           BOOLEAN NOT NULL DEFAULT false,
  partner_id          UUID,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3.12 subtasks
CREATE TABLE subtasks (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id             UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  source_template_subtask_id UUID REFERENCES template_subtasks(id) ON DELETE SET NULL,
  title               TEXT NOT NULL,
  description         TEXT,
  assigned_to         UUID REFERENCES team_members(id) ON DELETE SET NULL,
  assigned_by         UUID REFERENCES team_members(id),
  status              v2_subtask_status NOT NULL DEFAULT 'todo',
  started_at          TIMESTAMPTZ,
  completed_at        TIMESTAMPTZ,
  completed_by        UUID REFERENCES team_members(id),
  requires_approval   BOOLEAN NOT NULL DEFAULT false,
  sort_order          INTEGER NOT NULL DEFAULT 0,
  notes               TEXT,
  -- Addendum fields
  is_hidden           BOOLEAN NOT NULL DEFAULT false,
  subtask_type        v2_task_type,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3.13 approvals
CREATE TABLE approvals (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id             UUID REFERENCES tasks(id) ON DELETE CASCADE,
  subtask_id          UUID REFERENCES subtasks(id) ON DELETE CASCADE,
  requested_by        UUID NOT NULL REFERENCES team_members(id),
  requested_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  approver_id         UUID NOT NULL REFERENCES team_members(id),
  approver_role       TEXT,
  decision            v2_approval_decision NOT NULL DEFAULT 'pending',
  decided_at          TIMESTAMPTZ,
  reason              TEXT,
  approval_order      INTEGER NOT NULL DEFAULT 0,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_approval_target CHECK (
    (task_id IS NOT NULL AND subtask_id IS NULL) OR
    (task_id IS NULL AND subtask_id IS NOT NULL)
  )
);

-- 3.14 documents
CREATE TABLE documents (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id            UUID REFERENCES assets(id) ON DELETE CASCADE,
  stage_id            UUID REFERENCES asset_stages(id) ON DELETE SET NULL,
  task_id             UUID REFERENCES tasks(id) ON DELETE SET NULL,
  partner_id          UUID REFERENCES partners(id) ON DELETE SET NULL,
  contact_id          UUID REFERENCES contacts(id) ON DELETE SET NULL,
  document_type       TEXT NOT NULL,
  title               TEXT NOT NULL,
  description         TEXT,
  filename            TEXT NOT NULL,
  file_size_bytes     BIGINT,
  mime_type           TEXT,
  storage_bucket      TEXT NOT NULL,
  storage_path        TEXT NOT NULL,
  version             INTEGER NOT NULL DEFAULT 1,
  parent_document_id  UUID REFERENCES documents(id) ON DELETE SET NULL,
  is_current          BOOLEAN NOT NULL DEFAULT true,
  is_locked           BOOLEAN NOT NULL DEFAULT false,
  locked_by           UUID REFERENCES team_members(id),
  locked_at           TIMESTAMPTZ,
  lock_reason         TEXT,
  uploaded_by         UUID REFERENCES team_members(id),
  uploaded_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  verified_by         UUID REFERENCES team_members(id),
  verified_at         TIMESTAMPTZ,
  expires_at          TIMESTAMPTZ,
  tags                TEXT[] DEFAULT '{}',
  notes               TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3.15 comments
CREATE TABLE comments (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id             UUID REFERENCES tasks(id) ON DELETE CASCADE,
  subtask_id          UUID REFERENCES subtasks(id) ON DELETE CASCADE,
  asset_id            UUID REFERENCES assets(id) ON DELETE CASCADE,
  stage_id            UUID REFERENCES asset_stages(id) ON DELETE CASCADE,
  body                TEXT NOT NULL,
  author_id           UUID NOT NULL REFERENCES team_members(id),
  parent_comment_id   UUID REFERENCES comments(id) ON DELETE CASCADE,
  mentioned_team_ids  UUID[] DEFAULT '{}',
  is_edited           BOOLEAN NOT NULL DEFAULT false,
  edited_at           TIMESTAMPTZ,
  is_deleted          BOOLEAN NOT NULL DEFAULT false,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3.16 activity_log (immutable audit trail)
CREATE TABLE activity_log (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id            UUID REFERENCES assets(id) ON DELETE SET NULL,
  stage_id            UUID REFERENCES asset_stages(id) ON DELETE SET NULL,
  task_id             UUID REFERENCES tasks(id) ON DELETE SET NULL,
  subtask_id          UUID REFERENCES subtasks(id) ON DELETE SET NULL,
  document_id         UUID REFERENCES documents(id) ON DELETE SET NULL,
  partner_id          UUID REFERENCES partners(id) ON DELETE SET NULL,
  contact_id          UUID REFERENCES contacts(id) ON DELETE SET NULL,
  comment_id          UUID REFERENCES comments(id) ON DELETE SET NULL,
  entity_type         TEXT NOT NULL,
  action              v2_audit_action NOT NULL,
  detail              TEXT,
  changes             JSONB,
  performed_by        UUID REFERENCES team_members(id),
  performed_by_name   TEXT,
  performed_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  ip_address          INET,
  user_agent          TEXT,
  request_id          TEXT,
  severity            TEXT DEFAULT 'info',
  category            TEXT
);

-- 3.17 notifications
CREATE TABLE notifications (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id        UUID NOT NULL REFERENCES team_members(id) ON DELETE CASCADE,
  title               TEXT NOT NULL,
  message             TEXT NOT NULL,
  type                v2_notification_type NOT NULL,
  asset_id            UUID REFERENCES assets(id) ON DELETE CASCADE,
  stage_id            UUID REFERENCES asset_stages(id) ON DELETE SET NULL,
  task_id             UUID REFERENCES tasks(id) ON DELETE SET NULL,
  subtask_id          UUID REFERENCES subtasks(id) ON DELETE SET NULL,
  comment_id          UUID REFERENCES comments(id) ON DELETE SET NULL,
  approval_id         UUID REFERENCES approvals(id) ON DELETE SET NULL,
  action_url          TEXT,
  is_read             BOOLEAN NOT NULL DEFAULT false,
  read_at             TIMESTAMPTZ,
  is_dismissed        BOOLEAN NOT NULL DEFAULT false,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3.18 meeting_notes
CREATE TABLE meeting_notes (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id            UUID REFERENCES assets(id) ON DELETE SET NULL,
  partner_id          UUID REFERENCES partners(id) ON DELETE SET NULL,
  task_id             UUID REFERENCES tasks(id) ON DELETE SET NULL,
  title               TEXT NOT NULL,
  meeting_date        TIMESTAMPTZ NOT NULL,
  duration_minutes    INTEGER,
  location            TEXT,
  meeting_type        TEXT,
  attendees           JSONB NOT NULL DEFAULT '[]',
  created_by          UUID REFERENCES team_members(id),
  agenda              TEXT,
  summary             TEXT,
  transcript          TEXT,
  ai_summary          TEXT,
  key_decisions       TEXT,
  action_items        JSONB DEFAULT '[]',
  follow_up_date      DATE,
  follow_up_notes     TEXT,
  tags                TEXT[] DEFAULT '{}',
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3.19 gate_checks
CREATE TABLE gate_checks (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id            UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  stage_id            UUID NOT NULL REFERENCES asset_stages(id) ON DELETE CASCADE,
  passed              BOOLEAN NOT NULL,
  checked_by          UUID NOT NULL REFERENCES team_members(id),
  checked_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  conditions          JSONB NOT NULL DEFAULT '[]',
  blockers            JSONB DEFAULT '[]',
  approved_by         UUID REFERENCES team_members(id),
  approved_at         TIMESTAMPTZ,
  notes               TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3.20 partner_onboarding_items (from addendum)
CREATE TABLE partner_onboarding_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id      UUID NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  item_name       TEXT NOT NULL,
  item_type       TEXT NOT NULL,
  description     TEXT,
  status          TEXT NOT NULL DEFAULT 'pending',
  verified_at     TIMESTAMPTZ,
  verified_by     UUID REFERENCES team_members(id),
  expires_at      TIMESTAMPTZ,
  document_id     UUID,
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3.21 partner_credentials (from addendum)
CREATE TABLE partner_credentials (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id        UUID NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  credential_type   TEXT NOT NULL,
  credential_name   TEXT NOT NULL,
  issuing_body      TEXT,
  credential_number TEXT,
  issued_at         DATE,
  expires_at        DATE,
  is_active         BOOLEAN NOT NULL DEFAULT true,
  document_id       UUID,
  verification_url  TEXT,
  notes             TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3.22 communication_log (from addendum)
CREATE TABLE communication_log (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id      UUID REFERENCES contacts(id) ON DELETE CASCADE,
  partner_id      UUID REFERENCES partners(id) ON DELETE CASCADE,
  asset_id        UUID REFERENCES assets(id) ON DELETE SET NULL,
  task_id         UUID,
  comm_type       TEXT NOT NULL,
  direction       TEXT NOT NULL DEFAULT 'outbound',
  subject         TEXT,
  summary         TEXT NOT NULL,
  duration_minutes INTEGER,
  attendees       TEXT[],
  action_items    TEXT[],
  document_id     UUID,
  performed_by    UUID NOT NULL REFERENCES team_members(id),
  performed_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3.23 ownership_links (from addendum)
CREATE TABLE ownership_links (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_contact_id     UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  child_contact_id      UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  ownership_percentage  DECIMAL(5,2),
  is_control_person     BOOLEAN NOT NULL DEFAULT false,
  role_title            TEXT,
  relationship_type     TEXT NOT NULL DEFAULT 'beneficial_owner',
  verified_at           TIMESTAMPTZ,
  verified_by           UUID REFERENCES team_members(id),
  verification_method   TEXT,
  verification_document_id UUID,
  is_active             BOOLEAN NOT NULL DEFAULT true,
  effective_date        DATE,
  termination_date      DATE,
  notes                 TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(parent_contact_id, child_contact_id)
);

-- 3.24 asset_owners (from addendum)
CREATE TABLE asset_owners (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id        UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  contact_id      UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  ownership_percentage DECIMAL(5,2),
  role            TEXT NOT NULL DEFAULT 'holder',
  is_primary      BOOLEAN NOT NULL DEFAULT false,
  engagement_status TEXT NOT NULL DEFAULT 'prospect',
  engagement_date   DATE,
  agreement_document_id UUID,
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(asset_id, contact_id)
);

-- 3.25 kyc_records (from addendum)
CREATE TABLE kyc_records (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id        UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  check_type        TEXT NOT NULL,
  provider          TEXT,
  provider_reference TEXT,
  status            TEXT NOT NULL DEFAULT 'pending',
  result_details    JSONB DEFAULT '{}',
  risk_level        TEXT,
  flags             TEXT[],
  document_id       UUID,
  notes             TEXT,
  performed_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  performed_by      UUID REFERENCES team_members(id),
  expires_at        TIMESTAMPTZ,
  next_review_at    TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3.26 sops (from features addendum)
CREATE TABLE sops (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title           TEXT NOT NULL,
  task_type       v2_task_type,
  stage_context   TEXT,
  value_model     v2_value_model,
  purpose         TEXT NOT NULL,
  steps           JSONB NOT NULL,
  tips            TEXT,
  regulatory_citation TEXT,
  compliance_notes    TEXT,
  template_document_ids UUID[] DEFAULT '{}',
  version         INTEGER NOT NULL DEFAULT 1,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_by      UUID REFERENCES team_members(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3.27 reminders (from features addendum)
CREATE TABLE reminders (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title           TEXT NOT NULL,
  description     TEXT,
  asset_id        UUID REFERENCES assets(id) ON DELETE CASCADE,
  task_id         UUID,
  contact_id      UUID REFERENCES contacts(id) ON DELETE SET NULL,
  partner_id      UUID REFERENCES partners(id) ON DELETE SET NULL,
  meeting_id      UUID,
  remind_at       TIMESTAMPTZ NOT NULL,
  remind_user_id  UUID NOT NULL REFERENCES team_members(id),
  status          TEXT NOT NULL DEFAULT 'pending',
  snoozed_until   TIMESTAMPTZ,
  is_recurring    BOOLEAN NOT NULL DEFAULT false,
  recurrence_rule TEXT,
  created_by      UUID NOT NULL REFERENCES team_members(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Deferred FK: tasks -> partners (addendum)
ALTER TABLE tasks
  ADD CONSTRAINT fk_tasks_partner
  FOREIGN KEY (partner_id)
  REFERENCES partners(id) ON DELETE SET NULL;


-- ============================================================================
-- 4. INDEXES
-- ============================================================================

-- assets
CREATE INDEX idx_assets_status ON assets(status) WHERE NOT is_deleted;
CREATE INDEX idx_assets_phase ON assets(current_phase) WHERE NOT is_deleted;
CREATE INDEX idx_assets_value_model ON assets(value_model) WHERE NOT is_deleted;
CREATE INDEX idx_assets_reference ON assets(reference_code);
CREATE INDEX idx_assets_lead ON assets(lead_team_member_id);
CREATE INDEX idx_assets_template ON assets(source_template_id);
CREATE INDEX idx_assets_metadata ON assets USING GIN(metadata);
CREATE INDEX idx_assets_created ON assets(created_at DESC);

-- contacts
CREATE INDEX idx_contacts_role ON contacts(role);
CREATE INDEX idx_contacts_email ON contacts(email);
CREATE INDEX idx_contacts_partner ON contacts(partner_id);
CREATE INDEX idx_contacts_kyc ON contacts(kyc_status);
CREATE INDEX idx_contacts_type ON contacts(contact_type);
CREATE INDEX idx_contacts_relationship ON contacts(relationship_status);

-- partners
CREATE INDEX idx_partners_type ON partners(type) WHERE NOT is_deleted;
CREATE INDEX idx_partners_dd ON partners(dd_status);
CREATE INDEX idx_partners_engagement ON partners(engagement_status);

-- asset_partners
CREATE INDEX idx_asset_partners_asset ON asset_partners(asset_id);
CREATE INDEX idx_asset_partners_partner ON asset_partners(partner_id);

-- workflow_templates
CREATE INDEX idx_templates_model ON workflow_templates(value_model);
CREATE INDEX idx_templates_default ON workflow_templates(is_default) WHERE is_default;
CREATE INDEX idx_templates_system ON workflow_templates(is_system) WHERE is_system;

-- template_stages
CREATE INDEX idx_template_stages_template ON template_stages(template_id);
CREATE INDEX idx_template_stages_phase ON template_stages(phase);
CREATE INDEX idx_template_stages_sort ON template_stages(template_id, phase, sort_order);

-- template_tasks
CREATE INDEX idx_template_tasks_stage ON template_tasks(template_stage_id);
CREATE INDEX idx_template_tasks_sort ON template_tasks(template_stage_id, sort_order);

-- template_subtasks
CREATE INDEX idx_template_subtasks_task ON template_subtasks(template_task_id);

-- asset_stages
CREATE INDEX idx_asset_stages_asset ON asset_stages(asset_id);
CREATE INDEX idx_asset_stages_phase ON asset_stages(phase);
CREATE INDEX idx_asset_stages_status ON asset_stages(status);
CREATE INDEX idx_asset_stages_sort ON asset_stages(asset_id, phase, sort_order);
CREATE INDEX idx_asset_stages_gate ON asset_stages(is_gate) WHERE is_gate;
CREATE INDEX idx_asset_stages_hidden ON asset_stages(is_hidden) WHERE is_hidden;
CREATE INDEX idx_asset_stages_source ON asset_stages(source_template_stage_id);

-- tasks
CREATE INDEX idx_tasks_asset ON tasks(asset_id) WHERE NOT is_deleted;
CREATE INDEX idx_tasks_stage ON tasks(stage_id) WHERE NOT is_deleted;
CREATE INDEX idx_tasks_assigned ON tasks(assigned_to) WHERE NOT is_deleted;
CREATE INDEX idx_tasks_status ON tasks(status) WHERE NOT is_deleted;
CREATE INDEX idx_tasks_type ON tasks(task_type);
CREATE INDEX idx_tasks_due ON tasks(due_date) WHERE status NOT IN ('done', 'cancelled') AND NOT is_deleted;
CREATE INDEX idx_tasks_sort ON tasks(stage_id, sort_order);
CREATE INDEX idx_tasks_partner ON tasks(partner_id);
CREATE INDEX idx_tasks_hidden ON tasks(is_hidden) WHERE is_hidden;

-- subtasks
CREATE INDEX idx_subtasks_task ON subtasks(task_id);
CREATE INDEX idx_subtasks_assigned ON subtasks(assigned_to);
CREATE INDEX idx_subtasks_status ON subtasks(status);
CREATE INDEX idx_subtasks_hidden ON subtasks(is_hidden) WHERE is_hidden;

-- approvals
CREATE INDEX idx_approvals_task ON approvals(task_id) WHERE task_id IS NOT NULL;
CREATE INDEX idx_approvals_subtask ON approvals(subtask_id) WHERE subtask_id IS NOT NULL;
CREATE INDEX idx_approvals_approver ON approvals(approver_id);
CREATE INDEX idx_approvals_pending ON approvals(decision) WHERE decision = 'pending';
CREATE INDEX idx_approvals_requested_by ON approvals(requested_by);

-- documents
CREATE INDEX idx_documents_asset ON documents(asset_id);
CREATE INDEX idx_documents_stage ON documents(stage_id);
CREATE INDEX idx_documents_task ON documents(task_id);
CREATE INDEX idx_documents_partner ON documents(partner_id);
CREATE INDEX idx_documents_type ON documents(document_type);
CREATE INDEX idx_documents_locked ON documents(is_locked) WHERE is_locked;
CREATE INDEX idx_documents_current ON documents(is_current) WHERE is_current;
CREATE INDEX idx_documents_expires ON documents(expires_at) WHERE expires_at IS NOT NULL;

-- comments
CREATE INDEX idx_comments_task ON comments(task_id) WHERE task_id IS NOT NULL;
CREATE INDEX idx_comments_subtask ON comments(subtask_id) WHERE subtask_id IS NOT NULL;
CREATE INDEX idx_comments_asset ON comments(asset_id) WHERE asset_id IS NOT NULL;
CREATE INDEX idx_comments_stage ON comments(stage_id) WHERE stage_id IS NOT NULL;
CREATE INDEX idx_comments_author ON comments(author_id);
CREATE INDEX idx_comments_parent ON comments(parent_comment_id);
CREATE INDEX idx_comments_created ON comments(created_at DESC);

-- activity_log
CREATE INDEX idx_activity_asset ON activity_log(asset_id);
CREATE INDEX idx_activity_performed_at ON activity_log(performed_at DESC);
CREATE INDEX idx_activity_entity ON activity_log(entity_type);
CREATE INDEX idx_activity_action ON activity_log(action);
CREATE INDEX idx_activity_category ON activity_log(category);
CREATE INDEX idx_activity_performer ON activity_log(performed_by);
CREATE INDEX idx_activity_task ON activity_log(task_id);

-- notifications
CREATE INDEX idx_notifications_recipient ON notifications(recipient_id);
CREATE INDEX idx_notifications_unread ON notifications(recipient_id, is_read) WHERE NOT is_read;
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_asset ON notifications(asset_id);

-- meeting_notes
CREATE INDEX idx_meetings_asset ON meeting_notes(asset_id);
CREATE INDEX idx_meetings_partner ON meeting_notes(partner_id);
CREATE INDEX idx_meetings_date ON meeting_notes(meeting_date DESC);
CREATE INDEX idx_meetings_task ON meeting_notes(task_id);

-- gate_checks
CREATE INDEX idx_gates_asset ON gate_checks(asset_id);
CREATE INDEX idx_gates_stage ON gate_checks(stage_id);
CREATE INDEX idx_gates_passed ON gate_checks(passed);

-- partner_onboarding_items
CREATE INDEX idx_partner_onboarding_partner ON partner_onboarding_items(partner_id);
CREATE INDEX idx_partner_onboarding_status ON partner_onboarding_items(status);

-- partner_credentials
CREATE INDEX idx_partner_creds_partner ON partner_credentials(partner_id);
CREATE INDEX idx_partner_creds_expiry ON partner_credentials(expires_at) WHERE is_active;

-- communication_log
CREATE INDEX idx_comm_log_contact ON communication_log(contact_id);
CREATE INDEX idx_comm_log_partner ON communication_log(partner_id);
CREATE INDEX idx_comm_log_asset ON communication_log(asset_id);
CREATE INDEX idx_comm_log_date ON communication_log(performed_at);

-- ownership_links
CREATE INDEX idx_ownership_parent ON ownership_links(parent_contact_id);
CREATE INDEX idx_ownership_child ON ownership_links(child_contact_id);

-- asset_owners
CREATE INDEX idx_asset_owners_asset ON asset_owners(asset_id);
CREATE INDEX idx_asset_owners_contact ON asset_owners(contact_id);

-- kyc_records
CREATE INDEX idx_kyc_contact ON kyc_records(contact_id);
CREATE INDEX idx_kyc_type ON kyc_records(check_type);
CREATE INDEX idx_kyc_status ON kyc_records(status);
CREATE INDEX idx_kyc_expiry ON kyc_records(expires_at) WHERE status = 'passed';

-- sops
CREATE INDEX idx_sops_task_type ON sops(task_type);
CREATE INDEX idx_sops_value_model ON sops(value_model);
CREATE INDEX idx_sops_active ON sops(is_active) WHERE is_active;

-- reminders
CREATE INDEX idx_reminders_user ON reminders(remind_user_id);
CREATE INDEX idx_reminders_due ON reminders(remind_at) WHERE status = 'pending';
CREATE INDEX idx_reminders_asset ON reminders(asset_id);


-- ============================================================================
-- 5. TRIGGERS & FUNCTIONS
-- ============================================================================

-- 5.1 Auto-update updated_at on all tables with that column
CREATE TRIGGER trg_assets_updated_at BEFORE UPDATE ON assets FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);
CREATE TRIGGER trg_contacts_updated_at BEFORE UPDATE ON contacts FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);
CREATE TRIGGER trg_partners_updated_at BEFORE UPDATE ON partners FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);
CREATE TRIGGER trg_workflow_templates_updated_at BEFORE UPDATE ON workflow_templates FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);
CREATE TRIGGER trg_template_stages_updated_at BEFORE UPDATE ON template_stages FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);
CREATE TRIGGER trg_template_tasks_updated_at BEFORE UPDATE ON template_tasks FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);
CREATE TRIGGER trg_template_subtasks_updated_at BEFORE UPDATE ON template_subtasks FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);
CREATE TRIGGER trg_asset_stages_updated_at BEFORE UPDATE ON asset_stages FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);
CREATE TRIGGER trg_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);
CREATE TRIGGER trg_subtasks_updated_at BEFORE UPDATE ON subtasks FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);
CREATE TRIGGER trg_approvals_updated_at BEFORE UPDATE ON approvals FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);
CREATE TRIGGER trg_documents_updated_at BEFORE UPDATE ON documents FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);
CREATE TRIGGER trg_comments_updated_at BEFORE UPDATE ON comments FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);
CREATE TRIGGER trg_meeting_notes_updated_at BEFORE UPDATE ON meeting_notes FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);
CREATE TRIGGER trg_partner_onboarding_updated_at BEFORE UPDATE ON partner_onboarding_items FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);
CREATE TRIGGER trg_partner_creds_updated_at BEFORE UPDATE ON partner_credentials FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);
CREATE TRIGGER trg_ownership_links_updated_at BEFORE UPDATE ON ownership_links FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);
CREATE TRIGGER trg_asset_owners_updated_at BEFORE UPDATE ON asset_owners FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);
CREATE TRIGGER trg_sops_updated_at BEFORE UPDATE ON sops FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);

-- 5.2 Immutable activity_log
CREATE OR REPLACE FUNCTION prevent_activity_log_mutation()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'activity_log is immutable. UPDATE and DELETE operations are prohibited.';
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_activity_log_no_update
  BEFORE UPDATE ON activity_log FOR EACH ROW
  EXECUTE FUNCTION prevent_activity_log_mutation();

CREATE TRIGGER trg_activity_log_no_delete
  BEFORE DELETE ON activity_log FOR EACH ROW
  EXECUTE FUNCTION prevent_activity_log_mutation();

-- 5.3 Prevent delete on locked documents
CREATE OR REPLACE FUNCTION prevent_locked_document_delete()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.is_locked THEN
    RAISE EXCEPTION 'Cannot delete locked document %. Unlock it first.', OLD.id;
  END IF;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_documents_no_locked_delete
  BEFORE DELETE ON documents FOR EACH ROW
  EXECUTE FUNCTION prevent_locked_document_delete();

-- 5.4 Auto-log asset changes
CREATE OR REPLACE FUNCTION log_asset_changes()
RETURNS TRIGGER AS $$
DECLARE
  v_changes JSONB := '{}';
  v_action v2_audit_action;
  v_detail TEXT;
BEGIN
  IF TG_OP = 'INSERT' THEN
    v_action := 'created';
    v_detail := 'Asset created: ' || NEW.name;
    INSERT INTO activity_log (asset_id, entity_type, action, detail, performed_at)
    VALUES (NEW.id, 'asset', v_action, v_detail, now());
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.current_phase IS DISTINCT FROM NEW.current_phase THEN
      v_action := 'phase_advanced';
      v_changes := jsonb_build_object('current_phase', jsonb_build_object('old', OLD.current_phase::TEXT, 'new', NEW.current_phase::TEXT));
      v_detail := 'Phase changed from ' || OLD.current_phase::TEXT || ' to ' || NEW.current_phase::TEXT;
    ELSIF OLD.status IS DISTINCT FROM NEW.status THEN
      v_action := 'status_changed';
      v_changes := jsonb_build_object('status', jsonb_build_object('old', OLD.status::TEXT, 'new', NEW.status::TEXT));
      v_detail := 'Status changed from ' || OLD.status::TEXT || ' to ' || NEW.status::TEXT;
    ELSE
      v_action := 'updated';
      v_detail := 'Asset updated: ' || NEW.name;
    END IF;
    INSERT INTO activity_log (asset_id, entity_type, action, detail, changes, performed_at)
    VALUES (NEW.id, 'asset', v_action, v_detail, v_changes, now());
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_assets_audit
  AFTER INSERT OR UPDATE ON assets FOR EACH ROW
  EXECUTE FUNCTION log_asset_changes();

-- 5.5 Auto-log task changes
CREATE OR REPLACE FUNCTION log_task_changes()
RETURNS TRIGGER AS $$
DECLARE
  v_action v2_audit_action;
  v_detail TEXT;
BEGIN
  IF TG_OP = 'INSERT' THEN
    v_action := 'created';
    v_detail := 'Task created: ' || NEW.title;
  ELSIF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status AND NEW.status = 'done' THEN
    v_action := 'task_completed';
    v_detail := 'Task completed: ' || NEW.title;
  ELSE
    v_action := 'updated';
    v_detail := 'Task updated: ' || NEW.title;
  END IF;
  INSERT INTO activity_log (asset_id, task_id, stage_id, entity_type, action, detail, performed_by, performed_at)
  VALUES (NEW.asset_id, NEW.id, NEW.stage_id, 'task', v_action, v_detail, NEW.completed_by, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_tasks_audit
  AFTER INSERT OR UPDATE ON tasks FOR EACH ROW
  EXECUTE FUNCTION log_task_changes();

-- 5.6 Auto-log document uploads
CREATE OR REPLACE FUNCTION log_document_upload()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO activity_log (asset_id, document_id, entity_type, action, detail, performed_by, performed_at)
  VALUES (NEW.asset_id, NEW.id, 'document', 'document_uploaded',
          'Document uploaded: ' || NEW.title, NEW.uploaded_by, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_documents_audit
  AFTER INSERT ON documents FOR EACH ROW
  EXECUTE FUNCTION log_document_upload();

-- 5.7 Auto-log comments
CREATE OR REPLACE FUNCTION log_comment_posted()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO activity_log (
    asset_id, task_id, subtask_id, comment_id, entity_type, action, detail, performed_by, performed_at
  ) VALUES (
    NEW.asset_id, NEW.task_id, NEW.subtask_id, NEW.id,
    'comment', 'comment_posted', 'Comment posted by team member',
    NEW.author_id, now()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_comments_audit
  AFTER INSERT ON comments FOR EACH ROW
  EXECUTE FUNCTION log_comment_posted();


-- ============================================================================
-- 6. RPC FUNCTIONS
-- ============================================================================

-- 6.1 instantiate_from_template — Copy stages/tasks/subtasks from a single template
CREATE OR REPLACE FUNCTION instantiate_from_template(
  p_asset_id UUID,
  p_template_id UUID
) RETURNS VOID AS $$
DECLARE
  v_stage RECORD;
  v_task RECORD;
  v_subtask RECORD;
  v_new_stage_id UUID;
  v_new_task_id UUID;
BEGIN
  FOR v_stage IN
    SELECT * FROM template_stages
    WHERE template_id = p_template_id AND NOT is_hidden
    ORDER BY phase, sort_order
  LOOP
    INSERT INTO asset_stages (
      asset_id, phase, sort_order, name, description,
      source_template_stage_id, is_gate, gate_id,
      regulatory_basis, regulatory_citation,
      required_document_types, required_approvals
    ) VALUES (
      p_asset_id, v_stage.phase, v_stage.sort_order, v_stage.name, v_stage.description,
      v_stage.id, v_stage.is_gate, v_stage.gate_id,
      v_stage.regulatory_basis, v_stage.regulatory_citation,
      v_stage.required_document_types, v_stage.required_approvals
    ) RETURNING id INTO v_new_stage_id;

    FOR v_task IN
      SELECT * FROM template_tasks
      WHERE template_stage_id = v_stage.id AND NOT is_hidden
      ORDER BY sort_order
    LOOP
      INSERT INTO tasks (
        asset_id, stage_id, source_template_task_id,
        title, description, task_type,
        estimated_duration_days, estimated_amount,
        payment_recipient, payment_description, sort_order
      ) VALUES (
        p_asset_id, v_new_stage_id, v_task.id,
        v_task.title, v_task.description, v_task.task_type,
        v_task.estimated_duration_days, v_task.estimated_amount,
        v_task.payment_recipient, v_task.payment_description, v_task.sort_order
      ) RETURNING id INTO v_new_task_id;

      FOR v_subtask IN
        SELECT * FROM template_subtasks
        WHERE template_task_id = v_task.id AND NOT is_hidden
        ORDER BY sort_order
      LOOP
        INSERT INTO subtasks (
          task_id, source_template_subtask_id,
          title, description, requires_approval, sort_order
        ) VALUES (
          v_new_task_id, v_subtask.id,
          v_subtask.title, v_subtask.description,
          v_subtask.requires_approval, v_subtask.sort_order
        );
      END LOOP;
    END LOOP;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- 6.2 instantiate_workflow — Two-template merge (shared + model-specific)
CREATE OR REPLACE FUNCTION instantiate_workflow(
  p_asset_id UUID,
  p_value_model v2_value_model DEFAULT NULL
) RETURNS JSONB AS $$
DECLARE
  v_shared_template_id UUID;
  v_model_template_id UUID;
  v_stages_created INT := 0;
  v_tasks_created INT := 0;
BEGIN
  SELECT id INTO v_shared_template_id
  FROM workflow_templates
  WHERE value_model IS NULL AND is_default = true AND is_system = true
  LIMIT 1;

  IF p_value_model IS NOT NULL THEN
    SELECT id INTO v_model_template_id
    FROM workflow_templates
    WHERE value_model = p_value_model AND is_default = true AND is_system = true
    LIMIT 1;
  END IF;

  IF v_shared_template_id IS NOT NULL THEN
    PERFORM instantiate_from_template(p_asset_id, v_shared_template_id);
  END IF;

  IF v_model_template_id IS NOT NULL THEN
    PERFORM instantiate_from_template(p_asset_id, v_model_template_id);
  END IF;

  SELECT count(*) INTO v_stages_created FROM asset_stages WHERE asset_id = p_asset_id;
  SELECT count(*) INTO v_tasks_created FROM tasks WHERE stage_id IN (
    SELECT id FROM asset_stages WHERE asset_id = p_asset_id
  );

  UPDATE assets SET
    source_template_id = COALESCE(v_model_template_id, v_shared_template_id),
    value_model = COALESCE(p_value_model, value_model)
  WHERE id = p_asset_id;

  INSERT INTO activity_log (asset_id, entity_type, action, detail, performed_at)
  VALUES (p_asset_id, 'asset', 'template_instantiated',
          format('Workflow instantiated: %s stages, %s tasks', v_stages_created, v_tasks_created), now());

  RETURN jsonb_build_object(
    'stages_created', v_stages_created,
    'tasks_created', v_tasks_created,
    'shared_template_id', v_shared_template_id,
    'model_template_id', v_model_template_id
  );
END;
$$ LANGUAGE plpgsql;

-- 6.3 save_as_template — Capture asset workflow as template
CREATE OR REPLACE FUNCTION save_as_template(
  p_asset_id UUID,
  p_template_name TEXT,
  p_description TEXT DEFAULT NULL,
  p_created_by UUID DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  v_template_id UUID;
  v_asset RECORD;
  v_stage RECORD;
  v_task RECORD;
  v_subtask RECORD;
  v_new_stage_id UUID;
  v_new_task_id UUID;
BEGIN
  SELECT * INTO v_asset FROM assets WHERE id = p_asset_id;

  INSERT INTO workflow_templates (
    name, description, value_model, source_asset_id, created_by
  ) VALUES (
    p_template_name, p_description, v_asset.value_model, p_asset_id, p_created_by
  ) RETURNING id INTO v_template_id;

  FOR v_stage IN
    SELECT * FROM asset_stages WHERE asset_id = p_asset_id ORDER BY phase, sort_order
  LOOP
    INSERT INTO template_stages (
      template_id, phase, sort_order, name, description,
      regulatory_basis, regulatory_citation,
      is_gate, gate_id, is_hidden,
      required_document_types, required_approvals
    ) VALUES (
      v_template_id, v_stage.phase, v_stage.sort_order, v_stage.name, v_stage.description,
      v_stage.regulatory_basis, v_stage.regulatory_citation,
      v_stage.is_gate, v_stage.gate_id, v_stage.is_hidden,
      v_stage.required_document_types, v_stage.required_approvals
    ) RETURNING id INTO v_new_stage_id;

    FOR v_task IN
      SELECT * FROM tasks WHERE stage_id = v_stage.id AND NOT is_deleted ORDER BY sort_order
    LOOP
      INSERT INTO template_tasks (
        template_stage_id, title, description, task_type,
        estimated_duration_days, estimated_amount,
        payment_recipient, payment_description, sort_order
      ) VALUES (
        v_new_stage_id, v_task.title, v_task.description, v_task.task_type,
        v_task.estimated_duration_days, v_task.estimated_amount,
        v_task.payment_recipient, v_task.payment_description, v_task.sort_order
      ) RETURNING id INTO v_new_task_id;

      FOR v_subtask IN
        SELECT * FROM subtasks WHERE task_id = v_task.id ORDER BY sort_order
      LOOP
        INSERT INTO template_subtasks (
          template_task_id, title, description,
          requires_approval, sort_order
        ) VALUES (
          v_new_task_id, v_subtask.title, v_subtask.description,
          v_subtask.requires_approval, v_subtask.sort_order
        );
      END LOOP;
    END LOOP;
  END LOOP;

  INSERT INTO activity_log (asset_id, entity_type, action, detail, performed_by, performed_at)
  VALUES (p_asset_id, 'template', 'template_saved',
          'Template saved: ' || p_template_name, p_created_by, now());

  RETURN v_template_id;
END;
$$ LANGUAGE plpgsql;

-- 6.4 evaluate_gate — Check gate conditions (advisory)
CREATE OR REPLACE FUNCTION evaluate_gate(
  p_stage_id UUID,
  p_checked_by UUID
) RETURNS JSONB AS $$
DECLARE
  v_stage RECORD;
  v_conditions JSONB := '[]';
  v_all_tasks_done BOOLEAN;
  v_required_docs_present BOOLEAN;
  v_all_prior_stages_done BOOLEAN;
  v_can_pass BOOLEAN := true;
BEGIN
  SELECT * INTO v_stage FROM asset_stages WHERE id = p_stage_id;

  IF NOT v_stage.is_gate THEN
    RAISE EXCEPTION 'Stage % is not a gate', p_stage_id;
  END IF;

  SELECT NOT EXISTS (
    SELECT 1 FROM tasks t
    JOIN asset_stages s ON t.stage_id = s.id
    WHERE s.asset_id = v_stage.asset_id
      AND s.phase = v_stage.phase
      AND s.sort_order < v_stage.sort_order
      AND NOT s.is_hidden
      AND t.status NOT IN ('done', 'cancelled')
      AND NOT t.is_deleted
  ) INTO v_all_tasks_done;

  v_conditions := v_conditions || jsonb_build_object(
    'condition', 'All tasks in preceding stages are completed',
    'met', v_all_tasks_done
  );
  IF NOT v_all_tasks_done THEN v_can_pass := false; END IF;

  SELECT NOT EXISTS (
    SELECT unnest(v_stage.required_document_types) AS req_type
    EXCEPT
    SELECT d.document_type FROM documents d
    WHERE d.asset_id = v_stage.asset_id AND d.is_current
  ) INTO v_required_docs_present;

  v_conditions := v_conditions || jsonb_build_object(
    'condition', 'All required documents are uploaded',
    'met', v_required_docs_present
  );
  IF NOT v_required_docs_present THEN v_can_pass := false; END IF;

  SELECT NOT EXISTS (
    SELECT 1 FROM asset_stages
    WHERE asset_id = v_stage.asset_id
      AND phase = v_stage.phase
      AND sort_order < v_stage.sort_order
      AND NOT is_hidden
      AND status != 'completed'
  ) INTO v_all_prior_stages_done;

  v_conditions := v_conditions || jsonb_build_object(
    'condition', 'All prior stages in this phase are completed',
    'met', v_all_prior_stages_done
  );
  IF NOT v_all_prior_stages_done THEN v_can_pass := false; END IF;

  INSERT INTO gate_checks (asset_id, stage_id, passed, checked_by, conditions)
  VALUES (v_stage.asset_id, p_stage_id, v_can_pass, p_checked_by, v_conditions);

  RETURN jsonb_build_object(
    'can_pass', v_can_pass,
    'conditions', v_conditions,
    'stage_id', p_stage_id,
    'gate_id', v_stage.gate_id
  );
END;
$$ LANGUAGE plpgsql;

-- 6.5 advance_phase — Advisory gates (ALWAYS advances, returns warnings)
CREATE OR REPLACE FUNCTION advance_phase(
  p_asset_id UUID,
  p_target_phase v2_phase,
  p_force BOOLEAN DEFAULT false,
  p_override_reason TEXT DEFAULT NULL
) RETURNS JSONB AS $$
DECLARE
  v_asset RECORD;
  v_warnings JSONB := '[]'::jsonb;
  v_incomplete_tasks JSONB;
  v_phase_order TEXT[] := ARRAY['lead','intake','asset_maturity','security','value_creation','distribution'];
  v_current_idx INT;
  v_target_idx INT;
BEGIN
  SELECT * INTO v_asset FROM assets WHERE id = p_asset_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Asset not found');
  END IF;

  v_current_idx := array_position(v_phase_order, v_asset.current_phase::text);
  v_target_idx := array_position(v_phase_order, p_target_phase::text);

  IF v_target_idx > v_current_idx + 1 AND NOT p_force THEN
    v_warnings := v_warnings || jsonb_build_object(
      'type', 'phase_skip',
      'message', format('Skipping from %s to %s (non-sequential)', v_asset.current_phase, p_target_phase)
    );
  END IF;

  -- Collect incomplete tasks in current phase as warnings
  SELECT COALESCE(jsonb_agg(jsonb_build_object(
    'type', 'incomplete_task',
    'stage', s.name,
    'task', t.title,
    'status', t.status::text
  )), '[]'::jsonb) INTO v_incomplete_tasks
  FROM tasks t
  JOIN asset_stages s ON t.stage_id = s.id
  WHERE s.asset_id = p_asset_id
    AND s.phase = v_asset.current_phase
    AND NOT s.is_hidden
    AND NOT t.is_deleted
    AND NOT t.is_hidden
    AND t.status NOT IN ('done', 'cancelled');

  IF jsonb_array_length(v_incomplete_tasks) > 0 THEN
    v_warnings := v_warnings || v_incomplete_tasks;
  END IF;

  -- ALWAYS advance (soft/advisory gates)
  UPDATE assets SET
    current_phase = p_target_phase,
    updated_at = now()
  WHERE id = p_asset_id;

  INSERT INTO activity_log (
    asset_id, entity_type, action, detail,
    performed_by, category, changes
  ) VALUES (
    p_asset_id, 'asset', 'phase_advanced',
    format('Advanced from %s to %s', v_asset.current_phase, p_target_phase),
    current_setting('app.current_user_id')::uuid,
    'operational',
    jsonb_build_object(
      'from_phase', v_asset.current_phase,
      'to_phase', p_target_phase,
      'had_warnings', jsonb_array_length(v_warnings) > 0,
      'warnings', v_warnings,
      'forced', p_force,
      'override_reason', p_override_reason
    )
  );

  RETURN jsonb_build_object(
    'success', true,
    'new_phase', p_target_phase,
    'warnings', v_warnings,
    'was_overridden', jsonb_array_length(v_warnings) > 0
  );
END;
$$ LANGUAGE plpgsql;

-- 6.6 generate_asset_report — Comprehensive report data
CREATE OR REPLACE FUNCTION generate_asset_report(p_asset_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'asset', row_to_json(a),
    'holder_contact', (SELECT row_to_json(c) FROM contacts c WHERE c.id = a.asset_holder_contact_id),
    'stages', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'stage', row_to_json(s),
          'tasks', (
            SELECT jsonb_agg(
              jsonb_build_object(
                'task', row_to_json(t),
                'subtasks', (SELECT jsonb_agg(row_to_json(st)) FROM subtasks st WHERE st.task_id = t.id),
                'documents', (SELECT jsonb_agg(row_to_json(d)) FROM documents d WHERE d.task_id = t.id AND d.is_current),
                'comments', (SELECT jsonb_agg(row_to_json(cm) ORDER BY cm.created_at) FROM comments cm WHERE cm.task_id = t.id AND NOT cm.is_deleted),
                'approvals', (SELECT jsonb_agg(row_to_json(ap)) FROM approvals ap WHERE ap.task_id = t.id)
              ) ORDER BY t.sort_order
            ) FROM tasks t WHERE t.stage_id = s.id AND NOT t.is_deleted
          )
        ) ORDER BY s.phase, s.sort_order
      ) FROM asset_stages s WHERE s.asset_id = a.id
    ),
    'partners', (
      SELECT jsonb_agg(row_to_json(p))
      FROM asset_partners ap
      JOIN partners p ON p.id = ap.partner_id
      WHERE ap.asset_id = a.id
    ),
    'documents', (
      SELECT jsonb_agg(row_to_json(d))
      FROM documents d WHERE d.asset_id = a.id AND d.is_current
    ),
    'gate_checks', (
      SELECT jsonb_agg(row_to_json(gc) ORDER BY gc.checked_at)
      FROM gate_checks gc WHERE gc.asset_id = a.id
    ),
    'activity', (
      SELECT jsonb_agg(row_to_json(al) ORDER BY al.performed_at DESC)
      FROM (SELECT * FROM activity_log WHERE asset_id = a.id ORDER BY performed_at DESC LIMIT 200) al
    ),
    'generated_at', now()
  ) INTO v_result
  FROM assets a
  WHERE a.id = p_asset_id;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql;

-- 6.7 batch_document_paths — Storage paths for batch download
CREATE OR REPLACE FUNCTION batch_document_paths(
  p_asset_id UUID,
  p_document_ids UUID[] DEFAULT NULL
) RETURNS TABLE (
  document_id UUID,
  title TEXT,
  filename TEXT,
  storage_bucket TEXT,
  storage_path TEXT,
  file_size_bytes BIGINT,
  document_type TEXT,
  stage_name TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    d.id,
    d.title,
    d.filename,
    d.storage_bucket,
    d.storage_path,
    d.file_size_bytes,
    d.document_type,
    s.name AS stage_name
  FROM documents d
  LEFT JOIN asset_stages s ON d.stage_id = s.id
  WHERE d.asset_id = p_asset_id
    AND d.is_current
    AND (p_document_ids IS NULL OR d.id = ANY(p_document_ids));
END;
$$ LANGUAGE plpgsql;

-- 6.8 is_team_member (preserved/recreated for auth)
CREATE OR REPLACE FUNCTION is_team_member()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM team_members
    WHERE auth_user_id = auth.uid()
      AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ============================================================================
-- 7. RLS — DISABLED FOR DEV/TESTING
-- ============================================================================
-- RLS will be enabled in a later phase (Phase 8) before production deployment.
-- For now, all tables have RLS disabled to simplify development.

-- Note: team_members may already have RLS enabled from V1. Leave as-is.


-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
-- Tables created: 27 (+ 1 preserved team_members = 28 total)
-- Enums created: 16
-- RPC functions: 8 (instantiate_from_template, instantiate_workflow,
--   save_as_template, evaluate_gate, advance_phase, generate_asset_report,
--   batch_document_paths, is_team_member)
-- Triggers: 21 (19 moddatetime + 2 immutable audit log)
-- Audit triggers: 4 (assets, tasks, documents, comments)
