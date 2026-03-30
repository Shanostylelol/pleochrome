# PleoChrome V2 — Migration Addendum
# Consolidates ALL fixes from audit into the Blueprint

> Date: 2026-03-30
> Source: Architecture audit of all 8 spec files
> Purpose: Apply ON TOP of V2-POWERHOUSE-BLUEPRINT.md SQL to create the final migration

---

## 1. ENUM FIXES (CRITICAL — Template seeding fails without these)

```sql
-- Add missing task types to v2_task_type
-- The Blueprint has 9 types. Templates use 11.
ALTER TYPE v2_task_type ADD VALUE 'review';
ALTER TYPE v2_task_type ADD VALUE 'communication';

-- Add missing partner type
ALTER TYPE v2_partner_type ADD VALUE 'qualified_intermediary';
```

---

## 2. COLUMN ADDITIONS TO EXISTING BLUEPRINT TABLES

### 2.1 tasks table — add is_hidden, partner_id, subtask fields
```sql
ALTER TABLE tasks ADD COLUMN is_hidden BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE tasks ADD COLUMN partner_id UUID REFERENCES partners(id) ON DELETE SET NULL;
CREATE INDEX idx_tasks_partner ON tasks(partner_id);
CREATE INDEX idx_tasks_hidden ON tasks(is_hidden) WHERE is_hidden;
```

### 2.2 subtasks table — add is_hidden, subtask_type
```sql
ALTER TABLE subtasks ADD COLUMN is_hidden BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE subtasks ADD COLUMN subtask_type v2_task_type;
CREATE INDEX idx_subtasks_hidden ON subtasks(is_hidden) WHERE is_hidden;
```

### 2.3 template_tasks table — add is_hidden, partner_type
```sql
ALTER TABLE template_tasks ADD COLUMN is_hidden BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE template_tasks ADD COLUMN partner_type TEXT;
-- partner_type is TEXT (not enum) because it maps to v2_partner_type for auto-linking
-- but may also hold custom values
```

### 2.4 template_subtasks table — add is_hidden, subtask_type
```sql
ALTER TABLE template_subtasks ADD COLUMN is_hidden BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE template_subtasks ADD COLUMN subtask_type v2_task_type;
```

### 2.5 contacts table — add individual/entity/KYC fields
```sql
-- Contact type
ALTER TABLE contacts ADD COLUMN contact_type TEXT NOT NULL DEFAULT 'individual';
  -- 'individual' or 'entity'

-- Individual-specific KYC fields
ALTER TABLE contacts ADD COLUMN date_of_birth DATE;
ALTER TABLE contacts ADD COLUMN ssn_last_four TEXT;
ALTER TABLE contacts ADD COLUMN citizenship TEXT;
ALTER TABLE contacts ADD COLUMN id_type TEXT;
ALTER TABLE contacts ADD COLUMN id_number_last_four TEXT;
ALTER TABLE contacts ADD COLUMN id_expiry DATE;
ALTER TABLE contacts ADD COLUMN id_issuing_authority TEXT;

-- Entity-specific KYB fields
ALTER TABLE contacts ADD COLUMN entity_name TEXT;
ALTER TABLE contacts ADD COLUMN entity_type TEXT;
ALTER TABLE contacts ADD COLUMN state_of_formation TEXT;
ALTER TABLE contacts ADD COLUMN date_of_formation DATE;
ALTER TABLE contacts ADD COLUMN ein TEXT;
ALTER TABLE contacts ADD COLUMN registered_agent TEXT;
ALTER TABLE contacts ADD COLUMN principal_address TEXT;
ALTER TABLE contacts ADD COLUMN website TEXT;

-- Relationship/source fields
ALTER TABLE contacts ADD COLUMN source TEXT;
ALTER TABLE contacts ADD COLUMN referral_source TEXT;
ALTER TABLE contacts ADD COLUMN relationship_status TEXT DEFAULT 'prospect';
ALTER TABLE contacts ADD COLUMN preferred_contact_method TEXT DEFAULT 'email';
ALTER TABLE contacts ADD COLUMN timezone TEXT;

CREATE INDEX idx_contacts_type ON contacts(contact_type);
CREATE INDEX idx_contacts_relationship ON contacts(relationship_status);
```

---

## 3. NEW TABLES (6 tables from supplemental specs)

### 3.1 partner_onboarding_items
```sql
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
CREATE INDEX idx_partner_onboarding_partner ON partner_onboarding_items(partner_id);
CREATE INDEX idx_partner_onboarding_status ON partner_onboarding_items(status);
```

### 3.2 partner_credentials
```sql
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
CREATE INDEX idx_partner_creds_partner ON partner_credentials(partner_id);
CREATE INDEX idx_partner_creds_expiry ON partner_credentials(expires_at) WHERE is_active;
```

### 3.3 communication_log
```sql
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
CREATE INDEX idx_comm_log_contact ON communication_log(contact_id);
CREATE INDEX idx_comm_log_partner ON communication_log(partner_id);
CREATE INDEX idx_comm_log_asset ON communication_log(asset_id);
CREATE INDEX idx_comm_log_date ON communication_log(performed_at);
```

### 3.4 ownership_links
```sql
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
CREATE INDEX idx_ownership_parent ON ownership_links(parent_contact_id);
CREATE INDEX idx_ownership_child ON ownership_links(child_contact_id);
```

### 3.5 asset_owners
```sql
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
CREATE INDEX idx_asset_owners_asset ON asset_owners(asset_id);
CREATE INDEX idx_asset_owners_contact ON asset_owners(contact_id);
```

### 3.6 kyc_records
```sql
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
CREATE INDEX idx_kyc_contact ON kyc_records(contact_id);
CREATE INDEX idx_kyc_type ON kyc_records(check_type);
CREATE INDEX idx_kyc_status ON kyc_records(status);
CREATE INDEX idx_kyc_expiry ON kyc_records(expires_at) WHERE status = 'passed';
```

---

## 4. RPC FUNCTION FIX: advance_phase() — ADVISORY GATES

```sql
-- Replace the Blueprint's advance_phase() with this version
CREATE OR REPLACE FUNCTION advance_phase(
  p_asset_id UUID,
  p_target_phase v2_phase,
  p_force BOOLEAN DEFAULT false,
  p_override_reason TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
  v_asset RECORD;
  v_warnings JSONB := '[]'::jsonb;
  v_gate_result JSONB;
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

  -- Check sequential (allow skip with force)
  IF v_target_idx > v_current_idx + 1 AND NOT p_force THEN
    v_warnings := v_warnings || jsonb_build_object(
      'type', 'phase_skip',
      'message', format('Skipping from %s to %s (non-sequential)', v_asset.current_phase, p_target_phase)
    );
  END IF;

  -- Evaluate gate (ADVISORY — collects warnings but does NOT block)
  v_gate_result := evaluate_gate(p_asset_id, v_asset.current_phase);
  IF NOT (v_gate_result->>'passed')::boolean THEN
    v_warnings := v_warnings || (v_gate_result->'conditions');
  END IF;

  -- ALWAYS advance (soft gates)
  UPDATE assets SET
    current_phase = p_target_phase,
    updated_at = now()
  WHERE id = p_asset_id;

  -- Log the advance (and override if warnings existed)
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
$$;
```

---

## 5. TEMPLATE INSTANTIATION: Two-Template Merge Logic

The shared phases (Lead, Intake, Asset Maturity) come from a universal template.
The model-specific phases (Security, Value Creation, Distribution) come from a model template.

```sql
-- Updated instantiate_workflow to handle two-template merge
CREATE OR REPLACE FUNCTION instantiate_workflow(
  p_asset_id UUID,
  p_value_model v2_value_model DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
  v_shared_template_id UUID;
  v_model_template_id UUID;
  v_stages_created INT := 0;
  v_tasks_created INT := 0;
BEGIN
  -- Get the shared (universal) template for phases 1-3
  SELECT id INTO v_shared_template_id
  FROM workflow_templates
  WHERE value_model IS NULL AND is_default = true AND is_system = true
  LIMIT 1;

  -- Get the model-specific template for phases 4-6 (if model selected)
  IF p_value_model IS NOT NULL THEN
    SELECT id INTO v_model_template_id
    FROM workflow_templates
    WHERE value_model = p_value_model AND is_default = true AND is_system = true
    LIMIT 1;
  END IF;

  -- Instantiate shared phases (lead, intake, asset_maturity)
  IF v_shared_template_id IS NOT NULL THEN
    PERFORM instantiate_from_template(p_asset_id, v_shared_template_id);
  END IF;

  -- Instantiate model-specific phases (security, value_creation, distribution)
  IF v_model_template_id IS NOT NULL THEN
    PERFORM instantiate_from_template(p_asset_id, v_model_template_id);
  END IF;

  -- Count what was created
  SELECT count(*) INTO v_stages_created FROM asset_stages WHERE asset_id = p_asset_id;
  SELECT count(*) INTO v_tasks_created FROM tasks WHERE stage_id IN (
    SELECT id FROM asset_stages WHERE asset_id = p_asset_id
  );

  -- Update asset's source_template_id (use model template if exists, else shared)
  UPDATE assets SET
    source_template_id = COALESCE(v_model_template_id, v_shared_template_id),
    value_model = COALESCE(p_value_model, value_model)
  WHERE id = p_asset_id;

  RETURN jsonb_build_object(
    'stages_created', v_stages_created,
    'tasks_created', v_tasks_created,
    'shared_template_id', v_shared_template_id,
    'model_template_id', v_model_template_id
  );
END;
$$;
```

---

## 6. UPDATED TABLE COUNT

| Source | Tables |
|--------|--------|
| Blueprint (original) | 19 |
| Partner & Customer Design | 3 |
| Ownership & KYC Design | 3 |
| **Total** | **25** |

---

## 7. FINAL ENUM DEFINITIONS (Complete)

```sql
CREATE TYPE v2_task_type AS ENUM (
  'document_upload',
  'meeting',
  'physical_action',
  'payment_outgoing',
  'payment_incoming',
  'approval',
  'review',           -- ADDED
  'due_diligence',
  'filing',
  'communication',    -- ADDED
  'automated'
);

CREATE TYPE v2_partner_type AS ENUM (
  'appraiser',
  'vault_custodian',
  'broker_dealer',
  'securities_counsel',
  'general_counsel',
  'transfer_agent',
  'tokenization_platform',
  'oracle_provider',
  'insurance_broker',
  'kyc_provider',
  'registered_agent',
  'auditor',
  'smart_contract_auditor',
  'gemological_lab',
  'escrow_agent',
  'title_company',
  'surveyor',
  'environmental',
  'qualified_intermediary',  -- ADDED
  'other'
);
```
