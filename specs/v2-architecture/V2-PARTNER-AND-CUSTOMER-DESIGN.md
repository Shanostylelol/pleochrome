# PleoChrome V2 — Partner & Customer Data Design

> Date: 2026-03-30
> Purpose: Define how partners and customers connect into the workflow engine

---

## 1. THE GAP

The V2 blueprint has `partners`, `contacts`, and `asset_partners` tables but is missing:

1. **Partner onboarding as a workflow** — each partner relationship has its own DD stages
2. **Partner ↔ task linking** — assigning partners to specific stages/tasks they perform
3. **Customer/holder relationship tracking** — full profile beyond contact info
4. **Partner credential tracking** — licenses, insurance, certifications with expiry dates
5. **Communication log** — emails, calls, meetings tied to partners and customers

---

## 2. PARTNER DATA MODEL

### 2.1 Partner Onboarding (New Table: `partner_onboarding_items`)

Every partner goes through DD before they can be assigned to asset tasks. This is tracked per partner.

```sql
CREATE TABLE partner_onboarding_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id      UUID NOT NULL REFERENCES partners(id) ON DELETE CASCADE,

  -- Item definition
  item_name       TEXT NOT NULL,          -- "FINRA Registration Verified", "E&O Insurance Certificate"
  item_type       TEXT NOT NULL,          -- 'credential', 'document', 'verification', 'agreement', 'reference_check'
  description     TEXT,

  -- Status
  status          TEXT NOT NULL DEFAULT 'pending',  -- pending, in_progress, verified, failed, expired, waived
  verified_at     TIMESTAMPTZ,
  verified_by     UUID REFERENCES team_members(id),
  expires_at      TIMESTAMPTZ,           -- When this credential/verification expires

  -- Evidence
  document_id     UUID,                  -- Link to uploaded document (certificate, agreement, etc.)
  notes           TEXT,

  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

**Default onboarding items by partner type:**

| Partner Type | Onboarding Items |
|-------------|-----------------|
| Appraiser | USPAP Certification, State License, E&O Insurance, Independence Declaration, Sample Reports |
| Vault Custodian | SOC 2 Report, Insurance Certificate, Custody Agreement Template, API Documentation, Segregated Storage Confirmation |
| Broker-Dealer | FINRA Registration (CRD#), Form BD, Compliance Manual, E&O Insurance, SIPC Membership, AML Program |
| Securities Counsel | Bar Admission, Malpractice Insurance, Conflicts Check, Engagement Letter, Sample PPMs |
| Transfer Agent | SEC Registration (if applicable), Bonding Certificate, System Security Documentation |
| Tokenization Platform | Smart Contract Audit History, SOC 2, Insurance, API Docs, Compliance Engine Documentation |
| Oracle Provider | Technical Documentation, SLA Agreement, Audit History, Insurance |
| Insurance Broker | Licensed in Required States, E&O Insurance, Carrier Ratings (A.M. Best) |
| KYC Provider | SOC 2 Report, Privacy Policy, Data Processing Agreement, Compliance Certifications |
| Gemological Lab | GIA/SSEF Accreditation, Chain of Custody Procedures, Insurance, Sample Reports |
| Escrow Agent | Bonding, State License, SOC 2, Template Escrow Agreement |
| Title Company | State License, E&O Insurance, ALTA Membership |
| Auditor | PCAOB Registration, Independence Confirmation, Engagement Letter |

### 2.2 Partner ↔ Task Linking (New Column on `tasks` and `template_tasks`)

```sql
-- Add to tasks table:
ALTER TABLE tasks ADD COLUMN partner_id UUID REFERENCES partners(id) ON DELETE SET NULL;

-- Add to template_tasks table:
ALTER TABLE template_tasks ADD COLUMN partner_type TEXT;  -- Which type of partner performs this task
-- e.g., 'appraiser' for appraisal tasks, 'vault_custodian' for custody tasks
-- When a template is instantiated, if the asset has a linked partner of that type,
-- the task.partner_id is auto-filled.
```

This means:
- Template tasks know WHICH TYPE of partner does the work
- When an asset's workflow is instantiated, tasks auto-link to the assigned partner of that type
- In the UI, you can see which partner is responsible for each task
- Partner can be changed per-task if needed

### 2.3 Partner Credentials (New Table: `partner_credentials`)

Track active licenses, insurance, certifications per partner with expiry alerts.

```sql
CREATE TABLE partner_credentials (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id      UUID NOT NULL REFERENCES partners(id) ON DELETE CASCADE,

  credential_type TEXT NOT NULL,          -- 'license', 'insurance', 'certification', 'registration', 'membership'
  credential_name TEXT NOT NULL,          -- "FINRA Registration", "E&O Insurance", "USPAP Certification"
  issuing_body    TEXT,                   -- "FINRA", "State of Florida", "The Appraisal Foundation"
  credential_number TEXT,                 -- License/registration number

  issued_at       DATE,
  expires_at      DATE,                   -- NULL = no expiry
  is_active       BOOLEAN NOT NULL DEFAULT true,

  -- Evidence
  document_id     UUID,                  -- Uploaded certificate/document
  verification_url TEXT,                 -- URL to verify (e.g., FINRA BrokerCheck)

  notes           TEXT,

  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

## 3. CUSTOMER/HOLDER DATA MODEL

### 3.1 Enhanced Contacts Table

The blueprint's `contacts` table already has KYC/OFAC/PEP fields. What's missing:

```sql
-- Add to contacts table:
ALTER TABLE contacts ADD COLUMN contact_type TEXT NOT NULL DEFAULT 'individual';  -- 'individual', 'entity'
ALTER TABLE contacts ADD COLUMN company_name TEXT;
ALTER TABLE contacts ADD COLUMN company_type TEXT;            -- 'llc', 'corporation', 'trust', 'partnership', 'individual'
ALTER TABLE contacts ADD COLUMN state_of_formation TEXT;
ALTER TABLE contacts ADD COLUMN ein TEXT;                     -- Entity EIN
ALTER TABLE contacts ADD COLUMN website TEXT;
ALTER TABLE contacts ADD COLUMN preferred_contact_method TEXT DEFAULT 'email';  -- 'email', 'phone', 'text'
ALTER TABLE contacts ADD COLUMN timezone TEXT;
ALTER TABLE contacts ADD COLUMN relationship_status TEXT DEFAULT 'prospect';    -- 'prospect', 'active', 'inactive', 'do_not_contact'
ALTER TABLE contacts ADD COLUMN source TEXT;                  -- How they found us: 'referral', 'direct', 'dealer', 'website', 'conference'
ALTER TABLE contacts ADD COLUMN referral_source TEXT;         -- Who referred them
```

### 3.2 Communication Log (New Table: `communication_log`)

Track ALL communications with contacts and partners.

```sql
CREATE TABLE communication_log (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Who
  contact_id      UUID REFERENCES contacts(id) ON DELETE CASCADE,
  partner_id      UUID REFERENCES partners(id) ON DELETE CASCADE,
  -- One of these should be set (polymorphic)

  -- Context
  asset_id        UUID REFERENCES assets(id) ON DELETE SET NULL,
  task_id         UUID,                   -- If communication is tied to a specific task

  -- Communication details
  comm_type       TEXT NOT NULL,          -- 'email_sent', 'email_received', 'phone_call', 'text', 'letter', 'in_person', 'video_call'
  direction       TEXT NOT NULL DEFAULT 'outbound',  -- 'inbound', 'outbound'
  subject         TEXT,
  summary         TEXT NOT NULL,          -- What was discussed/communicated

  -- Metadata
  duration_minutes INTEGER,              -- For calls/meetings
  attendees       TEXT[],                -- Who was on the call
  action_items    TEXT[],                -- Follow-up actions

  -- Evidence
  document_id     UUID,                  -- Attached email, letter, transcript

  -- Team
  performed_by    UUID NOT NULL REFERENCES team_members(id),
  performed_at    TIMESTAMPTZ NOT NULL DEFAULT now(),

  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

## 4. HOW PARTNERS CONNECT TO THE WORKFLOW

### Flow:

```
1. PARTNER ONBOARDED
   → DD items completed → credentials uploaded → partner approved

2. PARTNER LINKED TO ASSET
   → asset_partners junction table → role assigned (appraiser, counsel, etc.)

3. TEMPLATE TASKS HAVE partner_type
   → "Appraisal task" has partner_type = 'appraiser'
   → "PPM Drafting" has partner_type = 'securities_counsel'

4. WORKFLOW INSTANTIATED
   → Template copied to asset
   → Tasks auto-link to assigned partner of matching type
   → If no partner assigned for that type → task shows "Partner Required" badge

5. DURING EXECUTION
   → Partner badge on each task shows who's doing the work
   → Communication log tracks all interactions
   → Documents uploaded to tasks are linked to partner
   → Partner credentials checked before task can start (advisory warning if expired)
```

### Partner Assignment UI:
- Asset Detail → Partners tab → "Assign Partner" button
- Select partner type → dropdown shows only partners of that type
- After assignment, all tasks with matching `partner_type` auto-link
- Can override per-task if needed

### Partner Dashboard:
- Partner Detail → "Active Assignments" tab shows all assets/tasks they're linked to
- "Credentials" tab shows all credentials with expiry alerts
- "Communications" tab shows all logged interactions
- "Documents" tab shows all documents they've uploaded/are linked to

---

## 5. WHAT THIS MEANS FOR THE BUILD

### New Tables (3):
1. `partner_onboarding_items` — DD tracking per partner
2. `partner_credentials` — licenses/insurance/certs with expiry
3. `communication_log` — all communications with contacts and partners

### Modified Tables (3):
1. `tasks` — add `partner_id` FK
2. `template_tasks` — add `partner_type` TEXT
3. `contacts` — add enhanced fields (contact_type, company, source, etc.)

### New Router Procedures:
- `partners.getOnboardingItems` — DD items for a partner
- `partners.updateOnboardingItem` — complete/verify a DD item
- `partners.getCredentials` — credentials for a partner
- `partners.addCredential` — add credential with expiry
- `partners.getExpiringCredentials` — dashboard widget: credentials expiring within 30 days
- `communications.create` — log a communication
- `communications.listByContact` — comms for a contact
- `communications.listByPartner` — comms for a partner
- `communications.listByAsset` — comms for an asset

### New UI:
- Partner Detail: Onboarding tab, Credentials tab, Communications tab
- Contact Detail: Communications tab, relationship status
- Asset Detail Partners tab: "Assign Partner" with type matching
- Task cards: Partner badge showing assigned partner
- Dashboard widget: Expiring credentials alert
- Compliance: Partner credential status overview
