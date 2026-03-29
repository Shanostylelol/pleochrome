# PleoChrome Powerhouse CRM — Schema Design Document

**Version:** 1.0
**Date:** 2026-03-27
**Classification:** Internal Technical Document
**SQL Migration:** `supabase/migrations/001_powerhouse_crm_schema.sql`

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Entity Relationship Summary](#2-entity-relationship-summary)
3. [JSONB Metadata Structure](#3-jsonb-metadata-structure)
4. [Supabase Storage Bucket Design](#4-supabase-storage-bucket-design)
5. [Row Level Security Summary](#5-row-level-security-summary)
6. [Immutable Audit Trail Design](#6-immutable-audit-trail-design)
7. [Supabase Project Configuration](#7-supabase-project-configuration)
8. [UI/UX Design Direction](#8-uiux-design-direction)
9. [Research Sources](#9-research-sources)

---

## 1. Architecture Overview

### Design Principles

The Powerhouse CRM schema was designed with these principles derived from research across CRM database design, compliance tracking systems, document management platforms, and asset tokenization architectures:

1. **Asset-centric model.** Everything revolves around the `stones` table. A "stone" is PleoChrome's internal term for any real-world asset being processed — whether a single gemstone, a barrel of emeralds, or a future non-gemstone RWA. Every other entity (steps, documents, tasks, meetings, comments) connects back to a stone.

2. **Workflow as data.** The 9-phase, 40+ step tokenization workflow from `TOKENIZATION-WORKFLOW-COMPLETE.md` is encoded as rows in `asset_steps`, pre-populated when a stone is created. This makes progress queryable, filterable, and visualizable without hardcoded UI logic.

3. **Immutable audit trail.** The `activity_log` table is append-only, enforced at both the RLS layer (no UPDATE/DELETE policies) and the trigger layer (raises exception on mutation attempts). This provides the compliance-grade evidence chain that securities regulators and institutional investors expect.

4. **Gate-based progression.** Each phase transition requires a formal `gate_checks` record with all conditions documented. This maps directly to the "IF ANY ANSWER IS NO -- STOP" pattern from the workflow documents and provides legal defensibility for every phase transition decision.

5. **Flexible metadata via JSONB.** The `metadata` field on `stones` stores the full master record for audit/export, including certification data, custody details, legal structuring, tokenization config, and distribution metrics. Structured enough for programmatic access, flexible enough for evolving requirements.

6. **Document versioning with legal hold.** Documents track versions via `parent_document_id` chains and support `is_locked` for legal holds that prevent deletion at the database level (trigger-enforced, not just application logic).

7. **Team-scoped RLS.** All tables use Row Level Security with a simple but effective model: if you are an active `team_member`, you can read everything. Write permissions are scoped by table and role. External users (future investor portal, partner portal) would get separate, more restrictive policies.

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Database | PostgreSQL 15+ (Supabase managed) |
| Auth | Supabase Auth (email/password, magic link) |
| Storage | Supabase Storage (S3-compatible) |
| API | Supabase auto-generated REST + Realtime |
| Frontend | Next.js 16 + React 19 + TypeScript strict |
| Styling | Tailwind v4 + shadcn/ui |
| State | React Query (TanStack Query) for server state |
| Realtime | Supabase Realtime for live pipeline updates |

### Table Count: 13

| # | Table | Purpose | Rows (Est. Year 1) |
|---|-------|---------|---------------------|
| 1 | `team_members` | Internal team profiles | 3-10 |
| 2 | `stones` | Master asset records | 5-50 |
| 3 | `asset_steps` | Workflow step tracking | 200-2,000 |
| 4 | `partners` | External partners | 20-100 |
| 5 | `contacts` | People (holders, investors, etc.) | 50-500 |
| 6 | `documents` | File metadata + versioning | 500-5,000 |
| 7 | `activity_log` | Immutable audit trail | 5,000-50,000 |
| 8 | `meeting_notes` | Meeting records | 50-200 |
| 9 | `tasks` | To-do items | 200-2,000 |
| 10 | `gate_checks` | Phase passage records | 50-400 |
| 11 | `asset_partners` | Stone-partner junction | 50-500 |
| 12 | `notifications` | In-app notifications | 1,000-10,000 |
| 13 | `comments` | Threaded comments | 500-5,000 |

### Views: 3

| View | Purpose |
|------|---------|
| `v_pipeline_board` | Pipeline kanban — one row per stone with progress metrics |
| `v_task_dashboard` | Open tasks across all stones with overdue flags |
| `v_compliance_dashboard` | Expiring documents, DD statuses, KYC expirations |

---

## 2. Entity Relationship Summary

```
team_members ──────────────────────────────────────────────────────────┐
  │                                                                    │
  │ (lead_team_member_id)                                              │
  ▼                                                                    │
stones ◄──── asset_steps          (1:many — steps per stone)           │
  │    ◄──── documents            (1:many — files per stone)           │
  │    ◄──── tasks                (1:many — to-dos per stone)          │
  │    ◄──── gate_checks          (1:many — gate records per stone)    │
  │    ◄──── meeting_notes        (1:many — meetings per stone)        │
  │    ◄──── activity_log         (1:many — audit entries per stone)   │
  │    ◄──── notifications        (1:many — alerts per stone)          │
  │    ◄──── comments             (polymorphic — via entity_type)      │
  │    ◄──── asset_partners       (many:many junction to partners)     │
  │                                                                    │
  │ (asset_holder_contact_id)                                          │
  ▼                                                                    │
contacts ──── partners            (many:1 — contact belongs to partner)│
                │                                                      │
                ◄──── asset_partners (many:many junction to stones)     │
                ◄──── documents     (1:many — DD reports, NDAs)        │
                ◄──── meeting_notes  (1:many — partner meetings)       │
                                                                       │
notifications ──── team_members    (1:many — user's notifications) ◄───┘
```

### Key Relationships

- **stones -> asset_steps:** 1:many. Each stone gets ~40 steps pre-populated from the workflow template.
- **stones -> contacts:** Many:1 via `asset_holder_contact_id`. The stone's asset holder is a contact record.
- **stones <-> partners:** Many:many via `asset_partners` junction table. Multiple partners involved per stone.
- **documents -> stones, steps, partners, contacts, meetings:** Polymorphic associations. A document can belong to any combination.
- **asset_steps -> asset_steps:** Self-referencing via `depends_on` array for step dependencies.
- **documents -> documents:** Self-referencing via `parent_document_id` for version chains.
- **comments:** Fully polymorphic via `entity_type` + `entity_id`. Can attach to any entity.

---

## 3. JSONB Metadata Structure

The `metadata` JSONB field on `stones` serves as the master record for audit, export, and investor reporting. It captures ALL data about the stone in a single queryable document.

### Full Structure

```json
{
  "holder": {
    "name": "White Oak Partners II LLC",
    "principal": "Emiel A. Kandi",
    "entity_type": "LLC",
    "state_of_formation": "Washington",
    "kyc_status": "verified",
    "kyc_verified_date": "2026-04-15",
    "ofac_status": "clear",
    "ofac_screened_date": "2026-04-15",
    "pep_status": "clear",
    "pep_screened_date": "2026-04-15",
    "beneficial_owners": [
      {
        "name": "",
        "ownership_pct": 100,
        "kyc_status": "verified"
      }
    ],
    "enhanced_dd_required": true,
    "enhanced_dd_reason": "Principal has prior federal conviction. Full disclosure in PPM risk factors."
  },

  "certification": {
    "gia_reports": [
      {
        "report_number": "GIA-2026-XXXXXX",
        "stone_description": "Natural Colombian Emerald",
        "carat_weight": 12.5,
        "color_grade": "Vivid Green",
        "clarity": "Slightly Included",
        "treatment": "Minor Oil",
        "origin": "Colombia",
        "verified_online": true,
        "verified_date": "2026-05-20",
        "report_date": "2026-05-15",
        "document_id": "uuid-ref-to-documents-table"
      }
    ],
    "ssef_reports": [
      {
        "report_number": "SSEF-XXXX",
        "origin_determination": "Colombia",
        "report_date": "2026-06-01",
        "document_id": "uuid-ref"
      }
    ],
    "total_stones_certified": 150,
    "total_carat_weight": 4500.00,
    "certification_complete": false,
    "certification_cost": 25000.00
  },

  "appraisals": [
    {
      "appraiser_name": "AGS Certified Appraiser",
      "appraiser_credentials": "CGA, USPAP-current",
      "appraiser_partner_id": "uuid-ref-to-partners-table",
      "appraised_value": 9500000.00,
      "appraisal_date": "2026-06-15",
      "methodology": "Comparative Market Analysis + Replacement Cost",
      "uspap_compliant": true,
      "document_id": "uuid-ref",
      "sequence": 1
    },
    {
      "appraiser_name": "",
      "appraised_value": 10200000.00,
      "appraisal_date": "2026-06-25",
      "sequence": 2
    },
    {
      "appraiser_name": "",
      "appraised_value": 9800000.00,
      "appraisal_date": "2026-07-05",
      "sequence": 3
    }
  ],

  "valuation": {
    "variance_analysis": {
      "lowest_two_average": 9650000.00,
      "max_variance_pct": 7.37,
      "variance_acceptable": true,
      "offering_value": 9650000.00,
      "methodology": "Average of two lowest appraisals"
    },
    "claimed_value": 18000000.00,
    "offering_value": 9650000.00,
    "value_date": "2026-07-10"
  },

  "custody": {
    "current_vault": "Brink's Diamond & Jewelry",
    "vault_partner_id": "uuid-ref",
    "vault_location": "New York, NY",
    "receipt_number": "BRK-2026-XXXXX",
    "intake_date": "2026-07-20",
    "insured_value": 10000000.00,
    "insurance_carrier": "Lloyd's of London",
    "insurance_policy_number": "LLX-XXXXX",
    "insurance_expires": "2027-07-20",
    "api_feed_active": true,
    "previous_custody": [
      {
        "vault": "Olympic Vault",
        "location": "Tacoma, WA",
        "from_date": "2010-01-01",
        "to_date": "2026-07-18",
        "notes": "Original custody location. $62K vault bill resolved."
      }
    ]
  },

  "provenance": {
    "origin_country": "Colombia",
    "mine_name": "Unknown — barrel lot",
    "chain_of_custody": [
      {
        "entity": "Mine operator (Colombia)",
        "period": "Pre-2008",
        "documentation": "Limited"
      },
      {
        "entity": "Strategic Worldwide Investments",
        "period": "2008-2010",
        "documentation": "Partial — corporate records"
      },
      {
        "entity": "White Oak Partners II LLC",
        "period": "2010-present",
        "documentation": "2019 Pierce County default judgment"
      }
    ],
    "gaps_identified": true,
    "gap_description": "Pre-2008 provenance from mine to initial acquisition is undocumented.",
    "conflict_mineral_assessment": "Not applicable — emeralds not covered by Dodd-Frank Section 1502",
    "legal_opinion_obtained": true,
    "legal_opinion_date": "2026-04-30",
    "legal_opinion_document_id": "uuid-ref"
  },

  "legal": {
    "spv_name": "PleoChrome Series A LLC",
    "spv_type": "Wyoming Series LLC",
    "ein": "XX-XXXXXXX",
    "formation_date": "2026-05-01",
    "registered_agent": "Northwest Registered Agent",
    "operating_agreement_document_id": "uuid-ref",
    "ppm_version": "1.0",
    "ppm_date": "2026-08-15",
    "ppm_document_id": "uuid-ref",
    "subscription_agreement_document_id": "uuid-ref",
    "investor_questionnaire_document_id": "uuid-ref",
    "msb_classification": "Exempt — legal opinion obtained",
    "msb_opinion_document_id": "uuid-ref",
    "regulatory_framework": "Reg D 506(c)",
    "general_solicitation_permitted": true,
    "accredited_investors_only": true,
    "minimum_investment": 100000.00,
    "maximum_offering": 9650000.00
  },

  "tokenization": {
    "platform": "Brickken",
    "platform_partner_id": "uuid-ref",
    "token_standard": "ERC-3643",
    "blockchain": "Polygon",
    "contract_address": "0x...",
    "testnet_contract_address": "0x...",
    "testnet_deployed_at": "2026-09-01",
    "mainnet_deployed_at": "2026-10-01",
    "total_tokens": 965000,
    "token_price": 10.00,
    "token_symbol": "PLEO-A",
    "smart_contract_audit": {
      "auditor": "CertiK",
      "audit_date": "2026-09-20",
      "findings": 0,
      "critical_findings": 0,
      "report_document_id": "uuid-ref"
    },
    "chainlink_por": {
      "feed_address": "0x...",
      "update_frequency": "daily",
      "data_sources": ["vault_api", "insurance_certificate", "appraisal"]
    }
  },

  "regulatory_filings": {
    "form_d": {
      "filed": true,
      "filed_date": "2026-10-15",
      "accession_number": "0001234567-26-XXXXXX",
      "document_id": "uuid-ref"
    },
    "blue_sky_filings": [
      {
        "state": "California",
        "filed": true,
        "filed_date": "2026-10-20",
        "fee": 300.00,
        "renewal_date": "2027-10-20"
      }
    ],
    "form_d_amendments": []
  },

  "distribution": {
    "offering_status": "open",
    "offering_opened_date": "2026-11-01",
    "total_investors": 0,
    "total_raised": 0.00,
    "tokens_minted": 0,
    "tokens_distributed": 0,
    "investor_verification_provider": "Verify Investor",
    "subscription_minimum": 100000.00,
    "broker_dealer": "Dalmore Group",
    "broker_dealer_partner_id": "uuid-ref"
  },

  "financials": {
    "setup_fee_pct": 2.0,
    "setup_fee_amount": 193000.00,
    "success_fee_pct": 1.5,
    "success_fee_amount": 144750.00,
    "annual_admin_fee_pct": 0.75,
    "annual_admin_fee_amount": 72375.00,
    "total_costs_incurred": 0.00,
    "cost_breakdown": {
      "legal": 0.00,
      "certification": 0.00,
      "appraisal": 0.00,
      "custody": 0.00,
      "insurance": 0.00,
      "tokenization": 0.00,
      "regulatory_filings": 0.00,
      "audit": 0.00,
      "marketing": 0.00
    }
  },

  "risk_register": [
    {
      "risk_id": "R1",
      "description": "Provenance concerns — convicted felon in ownership chain",
      "severity": "critical",
      "likelihood": "high",
      "mitigation": "Full disclosure in PPM risk factors. Clean separation from individual.",
      "status": "monitoring",
      "identified_date": "2026-03-14"
    }
  ],

  "timeline": {
    "engagement_date": null,
    "target_offering_date": null,
    "actual_offering_date": null,
    "estimated_total_weeks": 26,
    "milestones": []
  }
}
```

### Querying JSONB

PostgreSQL supports efficient querying into JSONB fields:

```sql
-- Find all stones with GIA certification complete
select * from stones
where metadata->'certification'->>'certification_complete' = 'true';

-- Find stones with offering value > $5M
select * from stones
where (metadata->'valuation'->>'offering_value')::decimal > 5000000;

-- Find stones with critical risks
select * from stones
where metadata @> '{"risk_register": [{"severity": "critical"}]}';

-- Find stones using Brickken platform
select * from stones
where metadata->'tokenization'->>'platform' = 'Brickken';
```

The GIN index on `metadata` (`idx_stones_metadata`) enables efficient JSONB queries.

---

## 4. Supabase Storage Bucket Design

### Bucket Structure

| Bucket | Access | Purpose | Folder Pattern |
|--------|--------|---------|----------------|
| `stone-documents` | Private | All documents related to stones | `{asset_id}/{phase}/{step_number}/{filename}` |
| `partner-documents` | Private | DD reports, contracts, NDAs | `{partner_id}/{document_type}/{filename}` |
| `meeting-recordings` | Private | Audio/video meeting files | `{year}/{month}/{meeting_id}/{filename}` |
| `team-documents` | Private | Founder DD, internal docs | `{team_member_id}/{document_type}/{filename}` |
| `exports` | Private | Generated reports, data exports | `{year}/{month}/{export_type}/{filename}` |

### Storage Path Examples

```
stone-documents/
  550e8400-e29b-41d4-a716-446655440000/         # Stone UUID
    phase_0_foundation/
      0.1/articles-of-organization.pdf
      0.2/engagement-letter-bull-blockchain.pdf
      0.4/aml-kyc-policy-v1.pdf
    phase_1_intake/
      1.1/intake-questionnaire-completed.pdf
      1.2/kyc-verification-report.pdf
      1.3/ofac-screening-results.pdf
    phase_2_certification/
      2.1/gia-report-stone-001.pdf
      2.1/gia-report-stone-002.pdf
      2.4/appraisal-report-1.pdf
      2.4/appraisal-report-2.pdf
      2.4/appraisal-report-3.pdf
    phase_3_custody/
      3.2/custody-receipt-brinks.pdf
      3.2/insurance-certificate.pdf

partner-documents/
  660e8400-e29b-41d4-a716-446655440001/         # Partner UUID
    dd_report/dd-report-bull-blockchain-2026.pdf
    nda/nda-zoniqx-signed.pdf
    partner_agreement/master-services-agreement.pdf

meeting-recordings/
  2026/04/
    770e8400-e29b-41d4-a716-446655440002/       # Meeting UUID
      zoniqx-intro-call.mp4
      zoniqx-intro-transcript.txt

team-documents/
  880e8400-e29b-41d4-a716-446655440003/         # Team member UUID
    dd_report/founder-dd-shane-pierson.pdf
    background_check/background-check-2026.pdf
```

### Storage RLS Policies

```sql
-- stone-documents bucket: Team members can read/write
create policy "Team read stone docs"
  on storage.objects for select
  using (
    bucket_id = 'stone-documents'
    and exists(select 1 from team_members where auth_user_id = auth.uid() and is_active = true)
  );

create policy "Team upload stone docs"
  on storage.objects for insert
  with check (
    bucket_id = 'stone-documents'
    and exists(select 1 from team_members where auth_user_id = auth.uid() and is_active = true)
  );

-- Prevent deletion of files associated with locked documents
-- (Application layer enforces this by checking documents.is_locked before calling storage.remove)

-- partner-documents bucket: Same pattern
create policy "Team read partner docs"
  on storage.objects for select
  using (
    bucket_id = 'partner-documents'
    and exists(select 1 from team_members where auth_user_id = auth.uid() and is_active = true)
  );

-- meeting-recordings bucket: Same pattern
create policy "Team read meeting recordings"
  on storage.objects for select
  using (
    bucket_id = 'meeting-recordings'
    and exists(select 1 from team_members where auth_user_id = auth.uid() and is_active = true)
  );
```

### Bucket Configuration

```sql
-- Create buckets via Supabase dashboard or SQL
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('stone-documents', 'stone-documents', false, 104857600, -- 100MB
    array['application/pdf', 'image/jpeg', 'image/png', 'image/webp',
          'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'text/plain', 'text/csv']),
  ('partner-documents', 'partner-documents', false, 52428800, -- 50MB
    array['application/pdf', 'image/jpeg', 'image/png',
          'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']),
  ('meeting-recordings', 'meeting-recordings', false, 524288000, -- 500MB
    array['audio/mpeg', 'audio/wav', 'audio/ogg', 'video/mp4', 'video/webm',
          'text/plain', 'application/pdf']),
  ('team-documents', 'team-documents', false, 52428800, -- 50MB
    array['application/pdf', 'image/jpeg', 'image/png']),
  ('exports', 'exports', false, 209715200, -- 200MB
    array['application/pdf', 'application/json', 'text/csv',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']);
```

---

## 5. Row Level Security Summary

### Policy Model

The RLS model is designed for a small, trusted internal team (3-10 people) with full read access and controlled write access. External user access (investor portal, partner portal) would be added as separate policies in future phases.

| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| `team_members` | All team | -- | Own profile only | -- |
| `stones` | All team | All team | All team | NONE (use terminated status) |
| `asset_steps` | All team | All team | All team | -- |
| `partners` | All team | All team | All team | -- |
| `contacts` | All team | All team | All team | -- |
| `documents` | All team | All team | All team | Only if `is_locked = false` |
| `activity_log` | All team | All team | **NONE** (immutable) | **NONE** (immutable) |
| `meeting_notes` | All team | All team | All team | -- |
| `tasks` | All team | All team | All team | All team |
| `gate_checks` | All team | All team | **NONE** (immutable) | **NONE** (immutable) |
| `asset_partners` | All team | All team | All team | All team |
| `notifications` | Own only | All team | Own only | -- |
| `comments` | All team | All team | Own only | Own only |

### Defense in Depth

The `activity_log` and `gate_checks` tables are protected at three levels:
1. **RLS policies:** No UPDATE or DELETE policies exist.
2. **Database triggers:** `trg_activity_log_no_update` and `trg_activity_log_no_delete` raise exceptions on any mutation attempt.
3. **Application layer:** The API should never expose update/delete endpoints for these tables.

---

## 6. Immutable Audit Trail Design

### What Gets Logged

| Event | Automatic? | Trigger |
|-------|-----------|---------|
| Stone created | Manual | Application inserts on stone creation |
| Stone status changed | Auto | `trg_stones_log_changes` |
| Stone phase advanced | Auto | `trg_stones_log_changes` |
| Stone offering value set | Auto | `trg_stones_log_changes` |
| Step completed | Auto | `trg_asset_steps_log_completion` |
| Step blocked | Auto | `trg_asset_steps_log_completion` |
| Gate check recorded | Manual | Application inserts with gate_checks |
| Document uploaded | Manual | Application inserts on upload |
| Document locked | Manual | Application inserts on lock |
| Partner engaged | Manual | Application inserts on engagement |
| Contact KYC verified | Manual | Application inserts on verification |
| Meeting recorded | Manual | Application inserts on creation |

### Log Entry Structure

```json
{
  "id": "uuid",
  "asset_id": "uuid",
  "step_id": "uuid | null",
  "entity_type": "stone",
  "action": "phase_advanced",
  "detail": "Stone 'Kandi Emerald Barrel' advanced from phase_1_intake to phase_2_certification",
  "changes": {
    "current_phase": {
      "old": "phase_1_intake",
      "new": "phase_2_certification"
    }
  },
  "performed_by": "uuid",
  "performed_by_name": "Shane Pierson",
  "performed_at": "2026-04-15T14:30:00Z",
  "ip_address": "192.168.1.1",
  "severity": "warning",
  "category": "operational"
}
```

### Performance Considerations

At scale, the activity_log will be the largest table. Mitigation strategies:
- **Indexed columns:** `asset_id`, `performed_at`, `entity_type`, `action`, `category`, `performed_by`
- **Time-based partitioning:** When the table exceeds 1M rows, partition by month using `pg_partman`
- **Cold storage archival:** Move activity_log entries older than 2 years to Supabase Storage as JSON exports (regulations may require 5-7 year retention, but active queries only need recent data)

---

## 7. Supabase Project Configuration

### Recommended Settings

**Project Setup:**
- Region: `us-west-1` (closest to PleoChrome team, Seattle-adjacent)
- Plan: Pro ($25/month) -- required for custom domains and higher limits
- Database password: 40+ character random string, stored in 1Password

**Database Settings:**
- Statement timeout: 30 seconds (prevent long-running queries)
- Pool size: Default (Supabase manages this on Pro)
- SSL enforcement: Enabled

**Auth Configuration:**
```
Site URL: https://app.pleochrome.com
Redirect URLs:
  - https://app.pleochrome.com/**
  - http://localhost:3000/**  (dev only)

Providers:
  - Email/Password: Enabled
  - Magic Link: Enabled (for team invites)

Email templates: Custom branded (PleoChrome logo + colors)

Session duration: 7 days (compliance — force re-auth weekly)
```

**Realtime Configuration:**
- Enable for tables: `stones`, `asset_steps`, `tasks`, `notifications`
- Disable for tables: `activity_log`, `documents` (too noisy)

**Edge Functions (future):**
- `send-notification` — Push notifications via email/Slack
- `generate-report` — PDF generation for investor reports
- `sync-vault-api` — Periodic vault status sync
- `compliance-check` — Automated screening re-checks

**Environment Variables (.env.local):**
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...  # Server-side only, NEVER expose
```

### Type Generation

Generate TypeScript types from the schema:

```bash
npx supabase gen types typescript --project-id xxxxxxxx > src/lib/database.types.ts
```

Run this after every migration to keep types in sync.

---

## 8. UI/UX Design Direction

### Design Philosophy

The Powerhouse CRM should feel like a **mission control center for high-value asset processing** — not a generic CRM. The UI should communicate precision, trust, and progress. Think Bloomberg Terminal meets luxury watch dashboard, built with PleoChrome's dark navy + gemstone accent palette.

### Color System

Based on PleoChrome's existing design system:

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-primary` | `#030712` | Main background |
| `--bg-secondary` | `#0a1628` | Card/panel backgrounds |
| `--bg-tertiary` | `#111827` | Elevated surfaces |
| `--border` | `#1e293b` | Borders, dividers |
| `--text-primary` | `#f8fafc` | Primary text |
| `--text-secondary` | `#94a3b8` | Secondary text, labels |
| `--text-muted` | `#64748b` | Timestamps, metadata |
| `--accent-emerald` | `#1B6B4A` | Success, completed steps |
| `--accent-teal` | `#1A8B7A` | Active, in-progress |
| `--accent-sapphire` | `#1E3A6E` | Information, links |
| `--accent-amethyst` | `#5B2D8E` | Tags, categories |
| `--accent-ruby` | `#A61D3A` | Errors, blocked, critical |
| `--accent-amber` | `#C47A1A` | Warnings, attention needed |
| `--accent-chartreuse` | `#7BA31E` | New, fresh items |

### Pipeline Board (Main View)

**Layout:** Full-width horizontal kanban board with 9 columns (one per phase). Each column header shows the phase name and a count of stones in that phase.

**Inspiration:** Pipedrive's pipeline view, but in dark mode with PleoChrome's gemstone palette. The Dribbble "Data Pipeline Dashboard Dark" aesthetic — clean, information-dense, no wasted space.

```
+------------------+------------------+------------------+----
| PHASE 0          | PHASE 1          | PHASE 2          |
| Foundation       | Intake           | Certification    |
| 1 stone          | 2 stones         | 0 stones         |
+------------------+------------------+------------------+----
| +──────────────+ | +──────────────+ |                  |
| | Kandi Barrel | | | Diamond Lot  | |                  |
| | $10-18M      | | | $2.5M        | |                  |
| | Step 0.5     | | | Step 1.2     | |                  |
| | ████░░░░ 40% | | | ██░░░░░░ 20% | |                  |
| | [Shane]      | | | [David]      | |                  |
| | 2 tasks due  | | | KYC pending  | |                  |
| +──────────────+ | +──────────────+ |                  |
|                  | +──────────────+ |                  |
|                  | | Ruby Ring    | |                  |
|                  | | $500K        | |                  |
|                  | | Step 1.4     | |                  |
|                  | | ███░░░░░ 30% | |                  |
|                  | | [Chris]      | |                  |
|                  | +──────────────+ |                  |
+------------------+------------------+------------------+----
```

**Stone Card Design:**
- Gemstone color accent bar on the left edge (emerald green for emeralds, ruby red for rubies, etc.)
- Name, value range, current step number
- Progress bar (completed steps / total steps in current phase)
- Assigned team member avatar
- Status badges: overdue tasks (red), blocked steps (amber), documents pending (blue)
- Click to open stone detail view

**Interactions:**
- Drag-and-drop is NOT supported between phases (phase transitions require formal gate checks)
- Click stone card to open detail panel/page
- Filter by: value path, status, assigned team member, date range
- Sort by: value, created date, last activity, days in phase

### Stone Detail Page

**Layout:** Full-page view with left sidebar navigation and main content area.

```
+------+-----------------------------------------------+
| NAV  |  STONE DETAIL: Kandi Emerald Barrel            |
|      |  PC-2026-001 | Tokenization | $10-18M          |
|      |                                                 |
| Over |  [Overview] [Steps] [Documents] [Activity] ...  |
| view |                                                 |
|      |  +-------------------------------------------+  |
| Steps|  | PHASE 2: Certification & Valuation         |  |
|      |  | Progress: 2/5 steps complete               |  |
| Docs |  |                                           |  |
|      |  | [x] 2.1 GIA Lab Certification    [Shane]  |  |
| Part-|  | [x] 2.2 SSEF Origin (skipped)    [David]  |  |
| ners |  | [>] 2.3 Build Appraiser Panel    [David]  |  |
|      |  | [ ] 2.4 Sequential 3-Appraisal   [--]     |  |
| Meet-|  | [ ] 2.5 Variance Analysis        [--]     |  |
| ings |  | [!] GATE 2: Verification         [--]     |  |
|      |  +-------------------------------------------+  |
| Tasks|                                                 |
|      |  +-------------------------------------------+  |
| Log  |  | RECENT ACTIVITY                            |  |
|      |  | 14:30 Shane completed Step 2.1             |  |
|      |  | 14:25 GIA report uploaded (3 files)        |  |
|      |  | 09:00 David started Step 2.3               |  |
|      |  +-------------------------------------------+  |
+------+-----------------------------------------------+
```

**Tabs:**
1. **Overview** — Summary card with metadata, value, timeline, risk indicators
2. **Steps** — Phase-by-phase step tracker with status toggles
3. **Documents** — File browser organized by phase/step, with upload, version history, and legal hold controls
4. **Partners** — Partners assigned to this stone with DD status badges
5. **Meetings** — Meeting notes timeline with AI summaries
6. **Tasks** — Task list filtered to this stone, with create/assign
7. **Activity** — Chronological audit trail with filters
8. **Financials** — Cost tracking, fee calculations, P&L per stone
9. **Gate Checks** — History of gate attempts with conditions met/unmet

### Task Dashboard

**Layout:** Two-panel view. Left: task list with filters. Right: task detail when selected.

**Columns:** Priority icon, title, stone name, step, assignee avatar, due date, status badge.

**Filters:** My tasks, all tasks, overdue, by stone, by priority, by status.

### Compliance Dashboard

**Layout:** Grid of alert cards, sorted by urgency.

**Card Types:**
- **Red (Urgent):** Overdue compliance items — expired DD, expired KYC, late filings
- **Amber (Warning):** Expiring within 30 days — documents, insurance, DD reports
- **Blue (Info):** Upcoming — quarterly re-screening due, annual audit due

### Navigation

**Left sidebar (persistent):**
```
[PleoChrome Logo]

Pipeline                 -- Kanban board
Stones                   -- List/table view
Tasks                    -- Task dashboard
Documents                -- Global document browser
Partners                 -- Partner directory
Contacts                 -- Contact directory
Meetings                 -- Meeting timeline
Compliance               -- Compliance dashboard
Activity                 -- Global audit trail
Settings                 -- Team, preferences

[User avatar + name]
[Notification bell (count)]
```

### Key UI Patterns

1. **Status badges with semantic colors:**
   - `completed` = emerald green pill
   - `in_progress` = teal pill
   - `blocked` = ruby red pill
   - `not_started` = gray pill
   - `skipped` = muted gray pill with strikethrough

2. **Progress indicators:**
   - Phase-level: Segmented progress bar showing completed/total steps
   - Stone-level: Overall completion percentage with phase breakdown
   - Pipeline-level: Total stones per phase with value aggregates

3. **Real-time updates:** Use Supabase Realtime to push stone status changes, new tasks, and notifications to all connected clients without page refresh.

4. **Command palette (Cmd+K):** Quick navigation to any stone, partner, or document by name/reference code.

5. **Responsive design:** Pipeline board scrolls horizontally on mobile. Detail views stack vertically. Core functionality works on tablet for on-the-go updates.

### Component Library

Build on shadcn/ui with custom variants for PleoChrome's dark palette:

| Component | Source | Customization |
|-----------|--------|--------------|
| Card | shadcn `Card` | Dark bg, gem-color left border accent |
| Badge | shadcn `Badge` | Status-semantic color variants |
| Table | shadcn `Table` | Dark headers, hover states |
| Dialog | shadcn `Dialog` | Dark overlay, step completion forms |
| Command | shadcn `Command` | Cmd+K palette for quick nav |
| Tabs | shadcn `Tabs` | Stone detail page navigation |
| Progress | shadcn `Progress` | Step completion bars |
| Toast | shadcn `Toast` | Realtime notification toasts |
| Calendar | shadcn `Calendar` | Due date pickers |
| Dropdown | shadcn `DropdownMenu` | Actions, filters |

---

## 9. Research Sources

This schema design was informed by research across these domains:

### CRM Database Design
- [CRM Database Schema Example (Practical Guide)](https://www.dragonflydb.io/databases/schema/crm)
- [Top 10 Database Schema Design Best Practices](https://www.bytebase.com/blog/top-database-schema-design-best-practices/)
- [PostgreSQL Database Design Guide](https://www.tigerdata.com/learn/guide-to-postgresql-database-design)

### Audit Trail / Immutability
- [How to Enforce Immutability and Append-Only Audit Trails](https://www.designgurus.io/answers/detail/how-do-you-enforce-immutability-and-appendonly-audit-trails)
- [Immutable Audit Logs in PostgreSQL](https://hoop.dev/blog/immutable-audit-logs-in-postgresql-with-pgcli/)
- [Immutable Audit Trails: A Complete Guide](https://www.hubifi.com/blog/immutable-audit-log-basics)
- [Postgres Audit Logging Guide](https://www.bytebase.com/blog/postgres-audit-logging/)

### Supabase / RLS
- [Row Level Security | Supabase Docs](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Storage Access Control | Supabase Docs](https://supabase.com/docs/guides/storage/security/access-control)
- [Storage Buckets | Supabase Docs](https://supabase.com/docs/guides/storage/buckets/fundamentals)
- [Supabase RLS Guide: Policies That Actually Work](https://designrevision.com/blog/supabase-row-level-security)

### Compliance / Document Management
- [How to Design Database for Compliance Management Systems](https://www.geeksforgeeks.org/dbms/how-to-design-database-for-compliance-management-systems/)
- [Version Control in Document Management](https://computhink.com/blog/version-control-in-document-management-why-it-matters-more-than-ever/)
- [Regulatory Compliance Database & Tracking Guide](https://www.vistaar.ai/blog/regulatory-compliance-databases-and-tracking-the-complete-guide/)

### Asset Tokenization Architecture
- [Tokenization Platforms Explained | XBTO](https://www.xbto.com/resources/tokenization-platforms-explained-technology-custody-compliance)
- [How to Create a Real-World Asset Tokenization Platform](https://intellivon.com/blogs/asset-tokenization-platform-development/)
- [Zoniqx DyCIST Multi-Jurisdictional Compliance](https://www.zoniqx.com/resources/ensuring-global-compliance-in-asset-tokenization-a-comprehensive-guide-to-dycists-multi-jurisdictional-features)

### UI/UX Inspiration
- [Pipeline designs on Dribbble](https://dribbble.com/tags/pipeline)
- [Kanban Board designs on Dribbble](https://dribbble.com/tags/kanban-board)
- [Kanban Board — shadcnuikit.com](https://shadcnuikit.com/dashboard/apps/kanban)
- [CRM Dashboard Templates](https://adminlte.io/blog/crm-dashboard-templates/)
- [TailAdmin Dashboard](https://tailadmin.com/)
