# PleoChrome Governance Engine — Architecture Specification

**Date:** March 16, 2026
**Status:** MVP Design Phase
**Principle:** "Good software does not replace governance. It enforces governance."

---

## Core Philosophy

PleoChrome's proprietary software is NOT a consumer-facing crypto app. It is an **internal mission-control panel** that:
1. Enforces the 7-gate workflow as a strict state machine (no step can be skipped)
2. Catalogs every piece of evidence with permanent audit trails
3. Connects to external partners via modular APIs
4. Implements role-based access control so no single person can bypass the process
5. Uses AI for redundancy checking, anomaly detection, and automated reconciliation

The software IS the company's moat. Partners can be swapped. The governance logic cannot.

---

## 1. State Machine — The Gated Corridor

Every asset exists in exactly ONE state at any time. Transitions are programmatically blocked until binary gate conditions are met.

### Asset States (16 total)

```
PROPOSED → INTAKE_REVIEW → KYC_PENDING → KYC_CLEARED →
LAB_SUBMITTED → LAB_COMPLETE → APPRAISAL_IN_PROGRESS → APPRAISAL_COMPLETE →
VALUATION_SET → CUSTODY_PENDING → IN_VAULT → LEGAL_PENDING →
LEGAL_COMPLETE → MINT_AUTHORIZED → MINTED → OFFERING_OPEN →
OFFERING_CLOSED → ACTIVE_MANAGEMENT → REDEMPTION → RETIRED
```

Plus exception states:
```
HOLD — Workflow frozen pending resolution
REJECTED — Failed a gate, cannot proceed
EXCEPTION — Requires manual review (e.g., appraisal variance >15%)
```

### Gate Transition Rules

| From State | To State | Required Evidence | Approver |
|------------|----------|-------------------|----------|
| PROPOSED → INTAKE_REVIEW | Intake questionnaire submitted | Auto |
| INTAKE_REVIEW → KYC_PENDING | Questionnaire reviewed, no red flags | Ops Lead |
| KYC_PENDING → KYC_CLEARED | KYC/KYB passed, sanctions clear, PEP clear | Compliance |
| KYC_CLEARED → LAB_SUBMITTED | Stone shipped to GIA/SSEF with tracking | Ops Lead |
| LAB_SUBMITTED → LAB_COMPLETE | Lab reports uploaded + verified authentic | Ops Lead |
| LAB_COMPLETE → APPRAISAL_IN_PROGRESS | 3 appraisers assigned from approved panel | Ops Lead |
| APPRAISAL_IN_PROGRESS → APPRAISAL_COMPLETE | All 3 USPAP reports uploaded | Ops Lead |
| APPRAISAL_COMPLETE → VALUATION_SET | Variance analysis done, 2-lowest averaged, offering value set | Ops Lead + Founder |
| VALUATION_SET → CUSTODY_PENDING | Stone shipped to vault with tracking + insurance | Ops Lead |
| CUSTODY_PENDING → IN_VAULT | Vault receipt uploaded, API confirms custody | Auto (vault webhook) |
| IN_VAULT → LEGAL_PENDING | Chainlink PoR feed active + confirmed | Tech Lead |
| LEGAL_PENDING → LEGAL_COMPLETE | PPM + Sub Agreement + Token Agreement uploaded + compliance sign-off | Legal + Compliance |
| LEGAL_COMPLETE → MINT_AUTHORIZED | **MULTI-SIG: Legal + Ops + Founder must all approve** | 3-of-3 sign-off |
| MINT_AUTHORIZED → MINTED | Token deployed on mainnet, PoR gate verified | Tech Lead |
| MINTED → OFFERING_OPEN | Form D filed, blue sky filed, BD engaged | Legal + Ops |
| OFFERING_OPEN → OFFERING_CLOSED | Target raise met or offering period expired | Auto |
| OFFERING_CLOSED → ACTIVE_MANAGEMENT | All tokens distributed, cap table finalized | Ops Lead |

### Exception Triggers (Auto-HOLD)
- Appraisal variance >15% between any two appraisers
- Sanctions screening returns a partial match (not definitive)
- Insurance coverage gap detected
- Chainlink PoR feed goes stale (no update in 48 hours)
- Vault API returns non-200 status
- Any uploaded document fails hash verification

---

## 2. Evidence & Registry Layer

### Document Taxonomy

| Document Type | Required State | Source | Verification |
|--------------|---------------|--------|-------------|
| Intake Questionnaire | PROPOSED | Asset Holder | Completeness check |
| Government ID (KYC) | KYC_PENDING | KYC Provider (Sumsub/Veriff) | Liveness + match |
| Entity Formation Docs (KYB) | KYC_PENDING | Asset Holder | Registry cross-check |
| Sanctions Screening Report | KYC_PENDING | OFAC/Chainalysis | Auto-pass or flag |
| GIA Grading Report | LAB_SUBMITTED | GIA | GIA Report Check verification |
| SSEF Origin Report | LAB_SUBMITTED | SSEF | Certificate number cross-check |
| USPAP Appraisal Report #1 | APPRAISAL_IN_PROGRESS | Appraiser 1 | Credential verification |
| USPAP Appraisal Report #2 | APPRAISAL_IN_PROGRESS | Appraiser 2 | Credential verification |
| USPAP Appraisal Report #3 | APPRAISAL_IN_PROGRESS | Appraiser 3 | Credential verification |
| Variance Analysis Report | APPRAISAL_COMPLETE | System (auto-generated) | Auto |
| Transit Insurance Certificate | Various | Insurance Provider | Policy number + dates |
| Vault Receipt / Custody Ack | CUSTODY_PENDING | Vault (Brink's/Malca-Amit) | API confirmation |
| Chainlink PoR Feed Status | IN_VAULT | Chainlink | On-chain verification |
| SPV Formation Certificate | LEGAL_PENDING | Delaware/Wyoming SOS | Filing number |
| Operating Agreement | LEGAL_PENDING | Securities Attorney | Digital signature |
| PPM (Final) | LEGAL_PENDING | Securities Attorney | Compliance sign-off |
| Subscription Agreement Template | LEGAL_PENDING | Securities Attorney | Compliance sign-off |
| Token Purchase Agreement | LEGAL_PENDING | Securities Attorney | Compliance sign-off |
| Smart Contract Audit Report | LEGAL_COMPLETE | Audit Firm | Report hash |
| Form D Filing Confirmation | OFFERING_OPEN | SEC EDGAR | Filing number |
| Blue Sky Filing Receipts | OFFERING_OPEN | State SOS | Filing numbers |
| Investor KYC Records | OFFERING_OPEN | KYC Provider | Per investor |
| Subscription Agreements (Executed) | OFFERING_OPEN | Investors | Per investor |
| Photos/Video (Standardized) | Any post-LAB | Photographer | Hashed at upload |

### Audit Trail Requirements

Every action creates an immutable log entry:
```json
{
  "timestamp": "2026-03-16T14:30:22Z",
  "user_id": "shane@pleochrome.com",
  "role": "founder",
  "asset_id": "STONE-001",
  "action": "state_transition",
  "from_state": "APPRAISAL_COMPLETE",
  "to_state": "VALUATION_SET",
  "evidence": {
    "variance_report_id": "VAR-001",
    "offering_value": 48000000,
    "appraisal_values": [48000000, 50000000, 52000000],
    "two_lowest_avg": 49000000
  },
  "ip_address": "192.168.1.1",
  "approval_chain": ["ops@pleochrome.com", "shane@pleochrome.com"]
}
```

### Automated Reconciliation (AI)

The system continuously cross-checks:
- Stone weight: intake form vs. GIA report vs. vault receipt vs. token metadata
- Stone description: all documents must match
- Appraiser independence: no shared addresses, employers, or affiliations detected
- Insurance coverage: current policy covers full appraised value, no gaps in dates
- Chainlink PoR feed: matches vault API data within tolerance
- Token supply: on-chain supply matches cap table in system
- Investor count: on-chain whitelist matches KYC records

Any mismatch triggers automatic HOLD state + alert to Compliance Officer.

---

## 3. Partner Integration Layer (API Architecture)

### Modular Connector Design

```
PleoChrome Governance Engine
├── Inbound Webhooks (receive partner status)
│   ├── Vault Webhook → custody confirmation, status changes
│   ├── KYC Webhook → verification results (pass/fail/review)
│   ├── Chainlink → PoR feed status updates
│   └── Brickken → token deployment status, transfer events
│
├── Outbound API Calls (send instructions to partners)
│   ├── → KYC Provider: initiate verification request
│   ├── → Brickken API: deploy token, configure compliance, whitelist investor
│   ├── → Chainlink: register PoR feed parameters
│   └── → E-signature: send documents for signing
│
└── Data Feeds (continuous monitoring)
    ├── Chainlink PoR: poll or subscribe to on-chain feed
    ├── Polygon RPC: monitor token contract events
    └── Vault API: periodic custody confirmation
```

### Integration Priority (MVP)

1. **First: Internal Registry + State Machine** (no external dependencies)
2. **Second: Document Storage + Audit Trails** (S3/Supabase storage + logging)
3. **Third: KYC Provider Integration** (Sumsub/Veriff webhook)
4. **Fourth: Vault Status Integration** (Brink's/Malca-Amit API or manual input)
5. **Fifth: Brickken API** (token deployment + investor whitelisting)
6. **Sixth: Chainlink PoR** (oracle feed monitoring)
7. **Last: External dashboards** (investor portal, partner views)

---

## 4. Role-Based Access Control (RBAC)

### Roles

| Role | Who | Can Do | Cannot Do |
|------|-----|--------|-----------|
| **Founder** | Shane | Approve mint authorization (1 of 3 required), override HOLD states, manage user roles, view all data | Cannot bypass multi-sig requirements |
| **Ops Lead** | David / Chris | Input candidate stones, upload documents, advance states (with evidence), assign appraisers, manage vault logistics | Cannot approve mint, cannot modify completed states, cannot delete audit logs |
| **Compliance Officer** | TBD (required) | Approve KYC clearance, sign off on legal documents, view all audit trails, file SARs, manage sanctions screening | Cannot advance non-compliance states, cannot approve mint |
| **Legal** | External Counsel | Upload legal documents, provide compliance sign-off on PPM/agreements | Cannot advance operational states, view-only for non-legal documents |
| **Tech Lead** | David (or contractor) | Deploy smart contracts, configure Chainlink PoR, manage API integrations | Cannot approve mint without Ops + Founder, cannot modify legal documents |
| **Read-Only** | Investors, auditors | View offering documents, PoR status, reports | Cannot modify anything |

### Multi-Signature Requirements

| Action | Required Approvers | Minimum |
|--------|-------------------|---------|
| Mint Authorization | Legal + Ops + Founder | 3 of 3 |
| Override HOLD state | Compliance + Founder | 2 of 2 |
| Change offering value | Ops + Founder | 2 of 2 |
| Add/remove from appraiser panel | Ops + Compliance | 2 of 2 |
| Emergency halt (freeze all activity) | Any single role | 1 of 1 (anyone can halt) |
| Resume from emergency halt | Founder + Compliance | 2 of 2 |

---

## 5. AI-Powered Automation Layer

### Redundancy & Verification

| AI Function | Trigger | Action |
|------------|---------|--------|
| Document OCR + Extraction | New document uploaded | Extract key fields (weight, value, dates, names), compare to existing records |
| Appraiser Independence Check | Appraisers assigned | Cross-check addresses, employers, LinkedIn connections, prior work together |
| Variance Anomaly Detection | 3 appraisals received | Flag if variance >15%, compare to market comparables |
| Insurance Gap Monitor | Daily | Verify all active assets have current, adequate coverage |
| Chainlink PoR Watchdog | Every 6 hours | Verify feed is updating, data matches expected format |
| Sanctions Re-screening | Quarterly | Re-run all parties against updated OFAC/EU/UN lists |
| Compliance Calendar | Daily | Alert upcoming deadlines (Form D amendments, insurance renewals, annual audits) |
| Reconciliation Engine | On every state change | Cross-check all document fields for consistency |

### Alert Escalation

```
Level 1 (Info): Logged, no notification
Level 2 (Warning): Email to Ops Lead
Level 3 (Alert): Email + SMS to Ops Lead + Compliance
Level 4 (Critical): Email + SMS + Phone to ALL roles, auto-HOLD on asset
Level 5 (Emergency): All of above + freeze ALL platform activity
```

---

## 6. MVP Tech Stack

### Recommended

| Layer | Technology | Why |
|-------|-----------|-----|
| **Frontend** | Next.js 16 + React 19 + Tailwind v4 | Already using for pleochrome.com; team knows it |
| **Backend** | Next.js API routes + Server Actions | Keeps stack simple; no separate backend |
| **Database** | Supabase (PostgreSQL) | RLS policies for RBAC, real-time subscriptions, storage for documents |
| **Auth** | Supabase Auth (magic link + SSO) | Role-based, no passwords to manage |
| **Storage** | Supabase Storage (S3-compatible) | Documents, photos, reports with access control |
| **Audit Log** | Append-only Supabase table (no UPDATE/DELETE permissions) | Immutable by design |
| **AI** | Claude API (Anthropic) | Document analysis, reconciliation, anomaly detection |
| **Hosting** | Vercel | Already deployed; serverless, auto-scaling |
| **Monitoring** | Sentry | Error tracking, performance monitoring |

### Database Schema (Core Tables)

```sql
-- Assets (the stones)
assets: id, name, type, carat_weight, origin_claim, current_state,
        asset_holder_id, offering_value, created_at, updated_at

-- State Transitions (audit trail)
state_transitions: id, asset_id, from_state, to_state,
                   triggered_by, approved_by[], evidence_ids[],
                   notes, created_at

-- Documents (evidence)
documents: id, asset_id, type, file_path, uploaded_by,
           source_party, received_date, hash, verified,
           verified_by, created_at

-- Parties (asset holders, investors, appraisers, partners)
parties: id, type, name, entity_name, email,
         kyc_status, sanctions_status, role, created_at

-- Approvals (multi-sig)
approvals: id, asset_id, action_type, required_roles[],
           approved_by[], status, created_at, completed_at

-- Alerts
alerts: id, asset_id, level, type, message,
        acknowledged_by, resolved_by, created_at
```

### MVP Build Phases

**Phase 1 (Weeks 1-3): Foundation**
- Database schema + RLS policies
- Auth with roles (Founder, Ops, Compliance, Legal, Tech, Read-Only)
- Asset registry (CRUD for stones)
- State machine logic (programmatic gate enforcement)
- Audit trail logging

**Phase 2 (Weeks 3-5): Evidence Layer**
- Document upload + storage (Supabase Storage)
- Document taxonomy + required-per-state rules
- Hash verification on upload
- Basic reconciliation checks (weight/description matching)

**Phase 3 (Weeks 5-7): Workflow UI**
- Asset pipeline view (Kanban or list view showing all assets by state)
- Single-asset detail view (timeline of all states, documents, approvals)
- Multi-sig approval flow UI
- Alert dashboard

**Phase 4 (Weeks 7-9): Partner Integrations**
- KYC webhook integration (Sumsub or Veriff)
- Manual vault status input (graduated to API when partner is live)
- Brickken API integration (token deployment)
- Chainlink PoR monitoring

**Phase 5 (Weeks 9-12): AI + Polish**
- Document OCR/extraction (Claude API)
- Automated reconciliation engine
- Compliance calendar + deadline alerts
- Insurance gap monitoring
- Investor onboarding flow

---

## 7. What Makes This Proprietary

The governance engine IS PleoChrome's moat because:

1. **Partners are replaceable; the process is not.** If we switch from Brink's to Malca-Amit, we change an API connector. The 7-gate workflow, evidence requirements, and approval logic remain identical.

2. **The audit trail is the product.** When a regulator, investor, or partner asks "how do you ensure compliance?", the answer is the system itself — not a PowerPoint deck.

3. **AI-powered reconciliation catches what humans miss.** Cross-checking 50+ data points across 20+ documents per stone is impossible manually at scale. The AI layer makes this automatic and continuous.

4. **Multi-sig governance prevents single points of failure.** No one person can authorize a mint. No one person can override a hold. This is institutional-grade governance, not startup chaos.

5. **The state machine is the brand promise.** "Nothing moves without evidence" isn't a tagline — it's a database constraint.
