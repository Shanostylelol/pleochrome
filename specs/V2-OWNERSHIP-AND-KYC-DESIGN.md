# PleoChrome V2 — Asset Ownership & KYC/AML Design

> Date: 2026-03-30
> Regulatory Basis: FinCEN CDD Rule (31 CFR 1010.230), Corporate Transparency Act (BOI reporting)
> Purpose: Track asset ownership hierarchies with full KYC/AML on every person in the chain

---

## THE PROBLEM

An asset has an owner. That owner could be:

```
CASE 1: Individual person
  Asset → Owner: "John Smith" (individual)
  → KYC on John Smith

CASE 2: Single entity
  Asset → Owner: "White Oak Partners LLC" (entity)
  → KYC on the entity (KYB)
  → Identify beneficial owners (≥25% or control person)
  → KYC on EACH beneficial owner

CASE 3: Nested entities
  Asset → Owner: "White Oak Partners LLC"
    → 35% owned by "John Smith" (individual) → KYC
    → 40% owned by "Jane Doe" (individual) → KYC
    → 25% owned by "ABC Holdings Inc" (entity)
      → 60% owned by "Bob Jones" (individual) → KYC
      → 40% owned by "Alice Brown" (individual) → KYC

CASE 4: Multiple owners (co-ownership)
  Asset → Owner 1: "John Smith" (50%)
  Asset → Owner 2: "Jane Doe" (50%)
  → KYC on both
```

**FinCEN CDD Rule requires:**
- Identify ALL beneficial owners who own ≥25% of a legal entity
- Identify ONE individual with significant management control (even if <25%)
- Verify identity of each (government ID, DOB, address, SSN/TIN)
- Screen EACH against OFAC/SDN, PEP lists
- Re-screen periodically (quarterly recommended)

**Corporate Transparency Act (CTA) requires:**
- Report beneficial owners to FinCEN (BOI filing)
- Threshold: ≥25% ownership OR substantial control
- Must update within 30 days of changes

---

## DATA MODEL

### The `contacts` table already handles individuals and entities.

Add these fields to make it handle the hierarchy:

```sql
-- Enhanced contacts table (additions to V2 blueprint)
ALTER TABLE contacts ADD COLUMN contact_type TEXT NOT NULL DEFAULT 'individual';
  -- 'individual' or 'entity'

-- Entity-specific fields
ALTER TABLE contacts ADD COLUMN entity_name TEXT;           -- Legal entity name (if entity)
ALTER TABLE contacts ADD COLUMN entity_type TEXT;            -- 'llc', 'corporation', 'series_llc', 'trust', 'partnership', 'sole_proprietor'
ALTER TABLE contacts ADD COLUMN state_of_formation TEXT;
ALTER TABLE contacts ADD COLUMN date_of_formation DATE;
ALTER TABLE contacts ADD COLUMN ein TEXT;                    -- Federal EIN
ALTER TABLE contacts ADD COLUMN registered_agent TEXT;
ALTER TABLE contacts ADD COLUMN principal_address TEXT;

-- Individual-specific fields
ALTER TABLE contacts ADD COLUMN date_of_birth DATE;
ALTER TABLE contacts ADD COLUMN ssn_last_four TEXT;          -- Only last 4 stored, full SSN never in DB
ALTER TABLE contacts ADD COLUMN citizenship TEXT;
ALTER TABLE contacts ADD COLUMN id_type TEXT;                -- 'passport', 'drivers_license', 'state_id', 'foreign_national_id'
ALTER TABLE contacts ADD COLUMN id_number_last_four TEXT;    -- Last 4 of ID number
ALTER TABLE contacts ADD COLUMN id_expiry DATE;
ALTER TABLE contacts ADD COLUMN id_issuing_authority TEXT;

-- Source/relationship
ALTER TABLE contacts ADD COLUMN source TEXT;                 -- 'referral', 'direct', 'dealer', 'website', 'conference'
ALTER TABLE contacts ADD COLUMN referral_source TEXT;
ALTER TABLE contacts ADD COLUMN relationship_status TEXT DEFAULT 'prospect';
  -- 'prospect', 'active_holder', 'active_investor', 'inactive', 'do_not_contact', 'blacklisted'
```

### NEW TABLE: `ownership_links`

This creates the ownership hierarchy — connecting entities to their beneficial owners (individuals or other entities).

```sql
CREATE TABLE ownership_links (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- The entity being looked through
  parent_contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  -- Must be an entity (contact_type = 'entity')

  -- The owner (individual or another entity)
  child_contact_id  UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  -- Can be individual (terminal node) or entity (recurse deeper)

  -- Ownership details
  ownership_percentage DECIMAL(5,2),      -- e.g., 35.00 for 35%
  is_control_person    BOOLEAN NOT NULL DEFAULT false,
  -- TRUE if this person has significant management control
  -- (FinCEN requires identifying at least one control person per entity)

  role_title         TEXT,                -- "Managing Member", "CEO", "Trustee", etc.
  relationship_type  TEXT NOT NULL DEFAULT 'beneficial_owner',
  -- 'beneficial_owner', 'control_person', 'authorized_signer', 'registered_agent'

  -- Verification
  verified_at        TIMESTAMPTZ,
  verified_by        UUID REFERENCES team_members(id),
  verification_method TEXT,               -- 'operating_agreement', 'corporate_resolution', 'sos_filing', 'self_certification'
  verification_document_id UUID,          -- Link to uploaded evidence

  -- Status
  is_active          BOOLEAN NOT NULL DEFAULT true,
  effective_date     DATE,
  termination_date   DATE,

  notes              TEXT,

  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Prevent duplicate links
  UNIQUE(parent_contact_id, child_contact_id)
);

CREATE INDEX idx_ownership_parent ON ownership_links(parent_contact_id);
CREATE INDEX idx_ownership_child ON ownership_links(child_contact_id);
```

### NEW TABLE: `asset_owners`

Links assets to their owners (can be multiple for co-ownership).

```sql
CREATE TABLE asset_owners (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id        UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  contact_id      UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,

  -- Ownership details
  ownership_percentage DECIMAL(5,2),      -- For co-ownership splits
  role            TEXT NOT NULL DEFAULT 'holder',
  -- 'holder', 'co_holder', 'custodian', 'beneficial_owner', 'trustee'

  is_primary      BOOLEAN NOT NULL DEFAULT false,
  -- The main point of contact for this asset

  -- Engagement
  engagement_status TEXT NOT NULL DEFAULT 'prospect',
  -- 'prospect', 'engaged', 'under_agreement', 'active', 'completed', 'terminated'
  engagement_date   DATE,
  agreement_document_id UUID,             -- Link to signed engagement agreement

  notes           TEXT,

  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE(asset_id, contact_id)
);

CREATE INDEX idx_asset_owners_asset ON asset_owners(asset_id);
CREATE INDEX idx_asset_owners_contact ON asset_owners(contact_id);
```

### NEW TABLE: `kyc_records`

One record per KYC/AML check performed on a contact. Tracks the full history — not just current status.

```sql
CREATE TABLE kyc_records (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id      UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,

  -- What was checked
  check_type      TEXT NOT NULL,
  -- 'identity_verification', 'address_verification', 'ofac_sdn', 'pep_screening',
  -- 'adverse_media', 'sanctions_eu', 'sanctions_un', 'beneficial_ownership',
  -- 'source_of_funds', 'source_of_wealth', 'background_check'

  -- Provider
  provider        TEXT,                   -- 'sumsub', 'veriff', 'manual', 'ofac_api', etc.
  provider_reference TEXT,                -- External reference ID from provider

  -- Result
  status          TEXT NOT NULL DEFAULT 'pending',
  -- 'pending', 'in_progress', 'passed', 'failed', 'inconclusive', 'expired', 'waived'
  result_details  JSONB DEFAULT '{}',     -- Provider-specific result data
  risk_level      TEXT,                   -- 'low', 'medium', 'high', 'critical'
  flags           TEXT[],                 -- Any flags raised: 'partial_match', 'pep_relative', etc.

  -- Evidence
  document_id     UUID,                   -- Uploaded screening report / certificate
  notes           TEXT,

  -- Lifecycle
  performed_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  performed_by    UUID REFERENCES team_members(id),
  expires_at      TIMESTAMPTZ,            -- When this check expires and needs re-screening
  next_review_at  TIMESTAMPTZ,            -- Scheduled re-screening date

  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_kyc_contact ON kyc_records(contact_id);
CREATE INDEX idx_kyc_type ON kyc_records(check_type);
CREATE INDEX idx_kyc_status ON kyc_records(status);
CREATE INDEX idx_kyc_expiry ON kyc_records(expires_at) WHERE status = 'passed';
```

---

## HOW IT ALL CONNECTS

### Visual: Ownership Hierarchy for an Asset

```
ASSET: "Emerald Barrel #017093" ($15.4M, Tokenization)
│
├── PRIMARY OWNER: "White Oak Partners LLC" (entity)
│   ├── KYB: ✅ Verified (EIN, Formation Docs, Operating Agreement)
│   ├── OFAC: ✅ Clear (screened 2026-03-15)
│   │
│   ├── BENEFICIAL OWNER (35%): "Emiel Kandi" (individual)
│   │   ├── KYC: ✅ Identity Verified (passport)
│   │   ├── OFAC: ✅ Clear
│   │   ├── PEP: ✅ Clear
│   │   └── Background: ⚠️ Flagged (see DD report)
│   │
│   ├── BENEFICIAL OWNER (40%): "Jeffrey Wolko" (individual)
│   │   ├── KYC: ✅ Identity Verified (DL)
│   │   ├── OFAC: ✅ Clear
│   │   └── PEP: ✅ Clear
│   │
│   └── CONTROL PERSON: "Travis Nyman" (individual, 25%, Managing Member)
│       ├── KYC: ✅ Identity Verified (passport)
│       ├── OFAC: ✅ Clear
│       └── PEP: ✅ Clear
│
└── CO-HOLDER: "Vertical Capital LLC" (entity, 0% — custody only)
    └── KYB: ✅ Verified
```

### Compliance Dashboard: KYC Status View

For each asset, show:
- Owner(s) with KYC status badges
- If entity → show beneficial owners underneath with their KYC status
- ⚠️ if any check is expired or approaching expiry
- 🔴 if any check failed or is missing
- Overall asset compliance score factors in KYC completeness

### Recurring Re-Screening

The `kyc_records.expires_at` field drives the recurring compliance tasks:
- OFAC/SDN screening: expires every 90 days
- PEP screening: expires every 180 days
- Background checks: expires every 365 days
- KYC identity: expires based on ID document expiry date

When a check approaches expiry, the system should:
1. Create a notification for the compliance officer
2. Show in the Compliance Dashboard as "approaching expiry"
3. Auto-create a task on the asset's Lead/Intake stage for re-screening

---

## INTAKE FLOW UPDATES

### When a new asset is created:

1. **Step 1: Owner Info** — wizard asks: "Is the owner an individual or entity?"
   - Individual → collect: name, DOB, address, ID type + last 4
   - Entity → collect: entity name, type, state of formation, EIN, principal address

2. **Step 2: Beneficial Owners** (if entity) — "Who owns 25%+ of this entity?"
   - For each: name, ownership %, role, is_control_person
   - "Is any owner also an entity?" → recurse

3. **Step 3: KYC Initiation** — auto-create KYC tasks for:
   - Entity KYB verification
   - Each beneficial owner: identity, OFAC, PEP
   - Control person identification

4. **Step 4: Engagement** — engagement agreement tied to primary owner

### The Intake stage (Phase 2) already has KYC tasks.
The ownership hierarchy just tells the system WHO needs to be screened.

---

## UI COMPONENTS NEEDED

1. **OwnershipTree** — Visual tree showing entity → beneficial owners → nested entities
   - Expandable nodes
   - KYC status badges on each person
   - Click person → contact detail

2. **AddOwnerModal** — Add individual or entity owner to an asset
   - Toggle: Individual / Entity
   - If entity: prompt for beneficial owners

3. **BeneficialOwnerForm** — Add/edit beneficial owner on an entity
   - Name, ownership %, role, control person toggle
   - Link to existing contact or create new

4. **KYCStatusPanel** — Per-contact KYC dashboard
   - List all checks with status, date, expiry
   - "Run Check" button for each type
   - Upload evidence

5. **ComplianceKYCWidget** — Dashboard widget
   - Assets with incomplete KYC
   - Expiring checks in next 30 days
   - Failed checks requiring attention

---

## TABLE COUNT UPDATE

This adds 3 new tables to the V2 schema:
- `ownership_links` — entity → beneficial owner hierarchy
- `asset_owners` — asset → owner(s) with roles and engagement
- `kyc_records` — individual KYC/AML check history

Enhanced `contacts` with individual/entity fields.

**V2 Total Tables:** 19 (blueprint) + 3 (partner design) + 3 (ownership) = **25 tables**
