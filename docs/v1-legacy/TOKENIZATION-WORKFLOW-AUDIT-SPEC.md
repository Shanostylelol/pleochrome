# PLEOCHROME TOKENIZATION WORKFLOW AUDIT SPEC
# Exhaustive Step-by-Step Blueprint for CRM Database Schema

**Audit Date:** March 27, 2026
**Auditor:** Automated Compliance Audit (Claude Opus 4.6)
**Scope:** All steps in the Tokenization value path (Shared Phases 1-2 + Tokenization-specific Phases 3-4), cross-referenced against SEC Reg D 506(c) requirements, ERC-3643 standard, FINRA guidance, and RWA tokenization industry best practices.
**Source files audited:**
- `TOKENIZATION-WORKFLOW-COMPLETE.md` (Phases 0-8, ~1,900 lines)
- `src/lib/portal-data.ts` (SHARED_PHASES + TOKENIZATION_PHASES)
- `SEC-COMPLIANCE-RESEARCH.md` (Reg D 506(c), PPM, Form D, Blue Sky, Transfer Agent, BD)
- `BLOCKCHAIN-TOKENIZATION-DEEP-DIVE.md` (ERC-3643, Chainlink PoR, Brickken)

**Web research conducted:**
- Reg D 506(c) compliance checklist (2025-2026 guidance including March 2025 no-action letter)
- ERC-3643 token issuance checklist (T-REX architecture, ONCHAINID)
- FINRA 2026 regulatory oversight report on tokenized securities
- RWA tokenization operational checklists (BDO, Centrifuge, Buzko Krasnov)
- SEC Statement on Tokenized Securities (Jan 28, 2026)
- OWASP Smart Contract Top 10 (2026 refresh)
- Rule 506(d) bad actor disqualification requirements
- Chainlink Proof of Reserve technical requirements
- FinCEN MSB registration requirements (2025-2026)
- OECD due diligence for precious metals and stones
- SEC Rule 144 holding period requirements

---

## TABLE OF CONTENTS

1. [Phase 0: Foundation (Pre-Workflow)](#phase-0-foundation)
2. [Phase 1: Acquisition (Shared Phase 1)](#phase-1-acquisition)
3. [Phase 2: Preparation (Shared Phase 2)](#phase-2-preparation)
4. [Phase 3: Tokenization (Path-Specific)](#phase-3-tokenization)
5. [Phase 4: Distribution (Path-Specific)](#phase-4-distribution)
6. [Ongoing Management (Post-Distribution)](#ongoing-management)
7. [MISSING STEPS identified by this audit](#missing-steps)
8. [Complete Data Schema Summary](#data-schema-summary)

---

## PHASE 0: FOUNDATION

**Coverage in current workflow:** TOKENIZATION-WORKFLOW-COMPLETE.md covers Steps 0.1 through 0.6 with Gate 0. This phase is NOT in portal-data.ts (it is pre-workflow infrastructure).

**Audit finding:** Phase 0 is well-documented in the workflow doc but invisible in the portal UI. This is acceptable since Phase 0 is a one-time company setup, not per-asset.

### Step 0.1: Form PleoChrome Holdings LLC (Wyoming Series LLC)

**Documents Required:**
- Articles of Organization (filed with Wyoming SOS)
- EIN Confirmation Letter (IRS)
- Master Operating Agreement (drafted by securities counsel)
- Registered Agent Confirmation
- Bank Account Opening Documentation
- Wyoming SOS Filing Receipt

**Tasks to Complete:**
- [ ] File Articles of Organization at wyobiz.wyo.gov ($100)
- [ ] Obtain EIN from IRS (irs.gov/businesses, Form SS-4 online)
- [ ] Open business bank account (Mercury, recommended)
- [ ] Retain registered agent (Northwest Registered Agent or equivalent)
- [ ] Draft and execute Master Operating Agreement with securities counsel
- [ ] Set calendar reminder for Wyoming annual report (anniversary month, $60+)

**Data Fields to Capture:**
```json
{
  "entity_name": "string",
  "entity_type": "wyoming_series_llc",
  "formation_state": "WY",
  "formation_date": "date",
  "sos_filing_number": "string",
  "ein": "string",
  "registered_agent_name": "string",
  "registered_agent_address": "string",
  "bank_name": "string",
  "bank_account_number": "string (encrypted)",
  "bank_routing_number": "string (encrypted)",
  "operating_agreement_date": "date",
  "operating_agreement_hash": "string (SHA-256)",
  "annual_report_due_date": "date",
  "formation_cost_total": "decimal"
}
```

**Sources/Links:**
- Wyoming SOS filing: https://wyobiz.wyo.gov
- IRS EIN: https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online
- Mercury bank: https://mercury.com
- Wyoming annual report info: https://sos.wyo.gov/Business/docs/LLC_AnnualReport.pdf

**Audit Log Entries:**
- `ENTITY_FORMED: PleoChrome Holdings LLC formed in Wyoming by [user] at [timestamp]. SOS filing #[number].`
- `EIN_OBTAINED: EIN [number] obtained from IRS at [timestamp].`
- `BANK_ACCOUNT_OPENED: Bank account opened at [bank] by [user] at [timestamp].`
- `OPERATING_AGREEMENT_EXECUTED: Master Operating Agreement executed at [timestamp]. Hash: [SHA-256].`

**Compliance Checkpoints:**
- SOS filing receipt with file number
- EIN confirmation letter on file
- Executed Operating Agreement with securities counsel review documented
- Bank account statements showing active status

**AI Automation Opportunities:**
- Auto-generate Wyoming annual report reminder 60 days before due date
- Auto-hash and store Operating Agreement for tamper detection
- Template pre-fill for Series designation filings

---

### Step 0.2: Engage Securities Counsel

**Documents Required:**
- Attorney Shortlist with Credentials and Quotes
- Signed Engagement Letter with Fee Structure
- Kickoff Meeting Notes

**Tasks to Complete:**
- [ ] Research and shortlist 3-5 firms (Dilendorf, Bull Blockchain Law, Cooley, LegalBison, Prokopiev)
- [ ] Verify each firm has specific tokenized securities experience (not just crypto or traditional private placements)
- [ ] Verify each firm is licensed in relevant jurisdiction
- [ ] Schedule and conduct introductory calls
- [ ] Compare fee structures and scope of work
- [ ] Execute engagement letter
- [ ] Schedule kickoff meeting

**Data Fields to Capture:**
```json
{
  "counsel_firm_name": "string",
  "counsel_primary_attorney": "string",
  "counsel_bar_number": "string",
  "counsel_jurisdiction": "string",
  "engagement_letter_date": "date",
  "engagement_letter_hash": "string (SHA-256)",
  "fee_structure_type": "enum: flat_fee | hourly | hybrid",
  "fee_estimate_low": "decimal",
  "fee_estimate_high": "decimal",
  "ppm_timeline_estimate_weeks": "integer",
  "kickoff_meeting_date": "date",
  "shortlist_document_hash": "string (SHA-256)"
}
```

**Sources/Links:**
- Dilendorf Law Firm: https://dilendorf.com
- Bull Blockchain Law: https://bullblockchainlaw.com
- Cooley: https://cooley.com
- LegalBison: https://legalbison.com/tokenization-real-world-assets
- Prokopiev Law Group: https://prokopievlaw.com

**Audit Log Entries:**
- `COUNSEL_ENGAGED: [firm_name] engaged as securities counsel by [user] at [timestamp]. Engagement letter hash: [SHA-256].`
- `KICKOFF_COMPLETED: Securities counsel kickoff meeting completed at [timestamp]. Attendees: [list].`

**Compliance Checkpoints:**
- Engagement letter on file with clear scope covering: PPM drafting, Subscription Agreement, Operating Agreement, Token Purchase Agreement, Form D filing, Blue Sky filings, bad actor checks, MSB opinion
- Counsel has verifiable experience with tokenized securities under Reg D

**AI Automation Opportunities:**
- Auto-track PPM drafting timeline against target completion date
- Milestone reminders for each deliverable in the engagement scope

---

### Step 0.3: Designate Compliance Officer

**Documents Required:**
- Board Resolution Designating Compliance Officer
- Compliance Officer Responsibilities Document

**Tasks to Complete:**
- [ ] Draft board resolution designating Compliance Officer
- [ ] Document Compliance Officer responsibilities (AML/KYC oversight, sanctions screening, SAR filing, regulatory filings, training)
- [ ] Execute board resolution
- [ ] Verify Compliance Officer understands BSA/AML obligations

**Data Fields to Capture:**
```json
{
  "compliance_officer_name": "string",
  "compliance_officer_title": "string",
  "board_resolution_date": "date",
  "board_resolution_hash": "string (SHA-256)",
  "responsibilities_document_hash": "string (SHA-256)",
  "bsa_aml_training_date": "date | null"
}
```

**Sources/Links:**
- FinCEN BSA/AML guidance: https://www.fincen.gov/resources/statutes-and-regulations/bank-secrecy-act
- FATF guidance on DPMS: https://www.fatf-gafi.org

**Audit Log Entries:**
- `COMPLIANCE_OFFICER_DESIGNATED: [name] designated as Compliance Officer by board resolution at [timestamp].`

**Compliance Checkpoints:**
- Signed board resolution on file
- Named individual with documented responsibilities
- Every partner engagement will verify this designation exists

**AI Automation Opportunities:**
- Auto-generate training reminders
- Pre-populate compliance officer field across all downstream forms

---

### Step 0.4: Draft AML/KYC Policy

**Documents Required:**
- AML/KYC Policy Document (minimum 5 pages)
- Customer Due Diligence (CDD) Procedures
- Sanctions Screening Procedures
- SAR Filing Procedures
- Training Requirements
- Record Retention Policy

**Tasks to Complete:**
- [ ] Draft AML/KYC policy using BSA/AML templates
- [ ] Include CDD procedures (individual and entity)
- [ ] Include Enhanced Due Diligence (EDD) triggers and procedures
- [ ] Include sanctions screening process (OFAC, EU/UN, PEP)
- [ ] Include SAR filing process with FinCEN
- [ ] Include training requirements and schedule
- [ ] Include record retention policy (minimum 5 years)
- [ ] Include risk assessment methodology for DPMS (Dealers in Precious Metals and Stones)
- [ ] Securities counsel review and sign-off
- [ ] FATF high-risk sector acknowledgment for precious metals and stones

**Data Fields to Capture:**
```json
{
  "aml_policy_version": "string",
  "aml_policy_date": "date",
  "aml_policy_hash": "string (SHA-256)",
  "counsel_review_date": "date | null",
  "counsel_review_signoff": "boolean",
  "cdd_procedures_included": "boolean",
  "edd_procedures_included": "boolean",
  "sanctions_screening_included": "boolean",
  "sar_filing_included": "boolean",
  "training_requirements_included": "boolean",
  "record_retention_included": "boolean",
  "dpms_risk_assessment_included": "boolean",
  "last_updated": "date"
}
```

**Sources/Links:**
- FinCEN AML for Precious Metals & Stones: https://www.fincen.gov/system/files/guidance/faq060305.pdf
- OFAC SDN List: https://sanctionssearch.ofac.treas.gov
- OpenSanctions: https://opensanctions.org
- Jewelers Vigilance Committee: https://jvclegal.org/about-aml/
- OECD Due Diligence Guidance: https://www.oecd.org/corporate/mne/mining.htm

**Audit Log Entries:**
- `AML_POLICY_CREATED: AML/KYC policy v[version] created at [timestamp]. Hash: [SHA-256].`
- `AML_POLICY_REVIEWED: AML/KYC policy reviewed by [counsel_name] at [timestamp]. Result: [approved/revisions_requested].`

**Compliance Checkpoints:**
- Policy document minimum 5 pages with all 6 required sections
- Counsel review documented
- DPMS-specific risk assessment included (FATF flags gemstone dealers as high-risk)
- Policy is a living document with version control

**AI Automation Opportunities:**
- Auto-flag when policy exceeds 12 months without review/update
- AI compliance checker to validate all required sections are present
- Auto-generate policy amendment when regulatory changes detected

---

### Step 0.5: Obtain Business Insurance

**Documents Required:**
- D&O Insurance Policy
- E&O Insurance Policy
- Cyber Liability Insurance Policy
- General Liability Insurance Policy
- Crime/Fidelity Bond
- Certificate of Insurance (COI) for partner engagements

**Tasks to Complete:**
- [ ] Request quotes from fintech-specialized brokers (Founder Shield, Vouch, Embroker)
- [ ] Obtain D&O coverage ($1M minimum limit)
- [ ] Obtain E&O coverage
- [ ] Obtain Cyber Liability coverage
- [ ] Obtain General Liability coverage
- [ ] Obtain Crime/Fidelity bond
- [ ] Receive and file Certificate of Insurance
- [ ] Set renewal reminders for all policies

**Data Fields to Capture:**
```json
{
  "insurance_policies": [
    {
      "policy_type": "enum: d_and_o | e_and_o | cyber | general_liability | crime_fidelity",
      "carrier": "string",
      "policy_number": "string",
      "coverage_limit": "decimal",
      "annual_premium": "decimal",
      "effective_date": "date",
      "expiration_date": "date",
      "broker": "string"
    }
  ],
  "coi_issued": "boolean",
  "total_annual_premium": "decimal"
}
```

**Sources/Links:**
- Founder Shield: https://foundershield.com
- Vouch: https://www.vouch.us
- Embroker: https://www.embroker.com

**Audit Log Entries:**
- `INSURANCE_BOUND: [policy_type] bound with [carrier] at [timestamp]. Policy #[number]. Coverage: $[limit].`

**Compliance Checkpoints:**
- All 5 coverage types active before any partner engagement
- COI available for partner requests
- Renewal dates tracked with 60-day advance reminders

**AI Automation Opportunities:**
- Auto-alert 60 and 30 days before policy renewal dates
- Auto-generate COI requests for new partner engagements

---

### Step 0.6: Resolve Asset-Specific Blockers

**Documents Required:**
- Written Legal Opinion on Provenance/Viability
- Comprehensive Background Report (PACER, state courts, OFAC, FinCEN, 50-state criminal)
- Written Vault Confirmation of Account Current Status
- Go/No-Go Decision Memo

**Tasks to Complete:**
- [ ] Securities counsel runs comprehensive background check
- [ ] Check PACER federal court records
- [ ] Check all 50 state court records
- [ ] Run OFAC/SDN screening on asset holder
- [ ] Run FinCEN screening
- [ ] Determine if federal restitution obligations satisfied
- [ ] Determine if DOJ has lien on assets
- [ ] Verify any default judgments are final and uncontested
- [ ] Contact vault for exact account balance
- [ ] Negotiate vault bill resolution with asset holder
- [ ] Obtain written confirmation vault bill is resolved
- [ ] Securities counsel provides written legal opinion
- [ ] Make formal Go/No-Go decision: PROCEED, DISCLOSE AND PROCEED, or WALK AWAY

**Data Fields to Capture:**
```json
{
  "asset_blocker_id": "string",
  "background_check_date": "date",
  "background_check_provider": "string",
  "pacer_check_result": "enum: clear | findings | pending",
  "state_courts_check_result": "enum: clear | findings | pending",
  "ofac_check_result": "enum: clear | match | partial_match",
  "fincen_check_result": "enum: clear | findings | pending",
  "federal_restitution_status": "string",
  "doj_lien_status": "enum: no_lien | lien_exists | uncertain",
  "vault_bill_amount": "decimal",
  "vault_bill_resolved": "boolean",
  "vault_confirmation_date": "date | null",
  "legal_opinion_date": "date",
  "legal_opinion_result": "enum: proceed | disclose_and_proceed | walk_away",
  "legal_opinion_hash": "string (SHA-256)",
  "go_no_go_decision": "enum: go | no_go | conditional_go",
  "go_no_go_decision_date": "date",
  "go_no_go_decision_by": "string"
}
```

**Sources/Links:**
- PACER: https://pacer.uscourts.gov
- OFAC SDN Search: https://sanctionssearch.ofac.treas.gov
- FinCEN BSA E-Filing: https://bsaefiling.fincen.treas.gov

**Audit Log Entries:**
- `BACKGROUND_CHECK_COMPLETED: Background check on [holder_name] completed by [provider] at [timestamp]. Result: [clear/findings].`
- `VAULT_BILL_RESOLVED: Vault bill of $[amount] resolved at [timestamp]. Confirmation from [vault_name].`
- `LEGAL_OPINION_RECEIVED: Legal opinion on provenance received from [counsel_name] at [timestamp]. Result: [proceed/disclose_and_proceed/walk_away].`
- `GO_NO_GO_DECISION: Decision [go/no_go/conditional_go] made by [user] at [timestamp]. Rationale: [text].`

**Compliance Checkpoints:**
- Written legal opinion on file from securities counsel
- All background check results documented and retained
- Vault bill resolution confirmed in writing
- Go/No-Go decision formally documented with rationale

**AI Automation Opportunities:**
- Auto-aggregate public records checks across multiple databases
- NLP-based adverse media scanning
- Risk scoring based on background check results

---

### GATE 0 CHECK

**Gate Fields:**
```json
{
  "gate_0_passed": "boolean",
  "gate_0_date": "date | null",
  "gate_0_reviewer": "string",
  "checklist": {
    "entity_formed": "boolean",
    "counsel_engaged": "boolean",
    "compliance_officer_designated": "boolean",
    "aml_kyc_policy_drafted": "boolean",
    "insurance_bound": "boolean",
    "legal_opinion_received": "boolean",
    "vault_bill_resolved": "boolean",
    "internal_systems_setup": "boolean"
  }
}
```

---

## PHASE 1: ACQUISITION (Shared Phase 1)

**Coverage:** portal-data.ts Steps 1.1-1.8 with Gates G1, G2. TOKENIZATION-WORKFLOW-COMPLETE.md Steps 1.1-1.6 with Gate 1.

**Audit finding:** The portal-data.ts has 8 steps; the workflow doc has 6 steps. The portal includes "Internal Deal Committee Review" (1.8) and splits activities differently. The spec below unifies both into a comprehensive 8-step process.

---

### Step 1.1: Identify Target Asset

**Documents Required:**
- Asset Identification Sheet (internal form)
- Vault Inventory Report (if sourced from vault)
- Dealer Network Referral Record

**Tasks to Complete:**
- [ ] Source from vault inventories, dealer networks, partner pipeline
- [ ] Confirm minimum value threshold ($1M+ for tokenization viability)
- [ ] Confirm stone type eligibility (emerald, ruby, sapphire, alexandrite, etc.)
- [ ] Confirm holder willingness to engage in tokenization process
- [ ] Log asset in CRM pipeline with preliminary details

**Data Fields to Capture:**
```json
{
  "asset_id": "uuid",
  "asset_name": "string",
  "asset_type": "enum: emerald | ruby | sapphire | alexandrite | diamond | padparadscha | other",
  "source_channel": "enum: vault_inventory | dealer_network | direct_holder | partner_referral | inbound",
  "source_contact": "string",
  "preliminary_value_estimate": "decimal",
  "stone_count": "integer | null",
  "total_carat_weight": "decimal | null",
  "current_location": "string",
  "current_vault": "string | null",
  "holder_name": "string",
  "holder_type": "enum: individual | entity",
  "holder_willingness": "enum: confirmed | tentative | unconfirmed",
  "minimum_value_threshold_met": "boolean",
  "pipeline_stage": "enum: identified | contacted | screening | engaged | passed | rejected",
  "identified_date": "date",
  "identified_by": "string"
}
```

**Sources/Links:**
- Chris's dealer pipeline
- Vault partner inventory feeds
- Industry databases (Sotheby's, Christie's auction results for comparable sales)

**Audit Log Entries:**
- `ASSET_IDENTIFIED: Asset [asset_id] identified via [source_channel] by [user] at [timestamp]. Preliminary value: $[estimate].`

**Compliance Checkpoints:**
- Value threshold verification documented
- Source channel documented for full audit trail

**AI Automation Opportunities:**
- AI-powered comparable valuation using auction databases
- Automated eligibility screening against asset criteria
- Pipeline scoring model for prioritization

---

### Step 1.2: Holder Introduction & NDA

**Documents Required:**
- Mutual Non-Disclosure Agreement (NDA)
- PleoChrome Overview Deck
- Initial Introduction Email/Letter

**Tasks to Complete:**
- [ ] Make first contact with asset holder
- [ ] Execute mutual NDA
- [ ] Share PleoChrome overview deck explaining value paths
- [ ] Assess holder sophistication and expectations
- [ ] Determine holder's preferred value path (tokenization vs. fractional vs. debt)
- [ ] Document initial meeting notes

**Data Fields to Capture:**
```json
{
  "nda_executed": "boolean",
  "nda_date": "date | null",
  "nda_hash": "string (SHA-256)",
  "nda_counterparty": "string",
  "overview_deck_sent": "boolean",
  "overview_deck_sent_date": "date | null",
  "holder_sophistication_level": "enum: institutional | hnw_experienced | hnw_novice | retail",
  "holder_preferred_path": "enum: tokenization | fractional | debt | undecided",
  "initial_meeting_date": "date | null",
  "initial_meeting_notes": "text",
  "holder_expectations_documented": "boolean"
}
```

**Sources/Links:**
- PleoChrome overview deck (Google Drive)

**Audit Log Entries:**
- `NDA_EXECUTED: Mutual NDA executed with [holder_name] at [timestamp]. Hash: [SHA-256].`
- `INTRODUCTION_COMPLETED: Initial introduction completed with [holder_name] at [timestamp]. Sophistication: [level]. Preferred path: [path].`

**Compliance Checkpoints:**
- NDA executed BEFORE any confidential information is shared
- Holder expectations documented to prevent disputes later

**AI Automation Opportunities:**
- Auto-generate NDA from template with holder details pre-filled
- Meeting transcription and automated note generation

---

### Step 1.3: KYC / KYB on Asset Holder

**Documents Required:**
- KYC Clearance Report
- Government-Issued ID (copy retained)
- Identity Verification Documentation
- Liveness Check Confirmation (for individuals)
- Entity Formation Documents (for entities)
- Beneficial Ownership Identification (for entities, all owners >25%)

**Tasks to Complete:**
- [ ] For individuals: collect government-issued ID
- [ ] For individuals: run liveness check (Veriff, Onfido, or Brickken built-in)
- [ ] For entities: collect formation documents (Articles, Operating Agreement)
- [ ] For entities: identify ALL beneficial owners >25% (CDD Rule requirement)
- [ ] For entities: run KYC on each beneficial owner >25%
- [ ] Verify identity against provided documentation
- [ ] Generate and file KYC clearance report
- [ ] Retain all documentation for minimum 5 years

**Data Fields to Capture:**
```json
{
  "kyc_status": "enum: pending | in_progress | cleared | failed | requires_edd",
  "kyc_provider": "string",
  "kyc_date": "date",
  "kyc_expiry_date": "date",
  "kyc_report_hash": "string (SHA-256)",
  "holder_id_type": "enum: passport | drivers_license | national_id | other",
  "holder_id_number": "string (encrypted)",
  "holder_id_country": "string (ISO 3166)",
  "holder_id_expiry": "date",
  "liveness_check_completed": "boolean",
  "liveness_check_date": "date | null",
  "entity_formation_docs_collected": "boolean | null",
  "beneficial_owners": [
    {
      "name": "string",
      "ownership_percentage": "decimal",
      "kyc_status": "enum: pending | cleared | failed",
      "kyc_date": "date | null"
    }
  ],
  "edd_required": "boolean",
  "edd_reason": "string | null",
  "record_retention_expiry": "date"
}
```

**Sources/Links:**
- Veriff: https://www.veriff.com ($0.80/check)
- Didit: https://www.didit.me (free)
- Brickken built-in KYC (150 included in plan)
- FinCEN CDD Rule: https://www.fincen.gov/resources/statutes-regulations/federal-register-notices/customer-due-diligence-requirements

**Audit Log Entries:**
- `KYC_INITIATED: KYC process initiated for [holder_name] via [provider] at [timestamp].`
- `KYC_CLEARED: KYC cleared for [holder_name] at [timestamp]. Report hash: [SHA-256].`
- `KYC_FAILED: KYC FAILED for [holder_name] at [timestamp]. Reason: [reason]. HARD STOP.`
- `BENEFICIAL_OWNER_IDENTIFIED: Beneficial owner [name] ([percentage]%) identified for [entity_name] at [timestamp].`

**Compliance Checkpoints:**
- KYC clearance report on file for every individual and beneficial owner
- CDD Rule compliance verified: all beneficial owners >25% identified and verified
- Documentation retained with 5-year minimum expiry date set
- EDD triggered when appropriate (high-risk jurisdictions, PEP status, unusual patterns)

**AI Automation Opportunities:**
- Automated ID document verification and data extraction
- Facial recognition matching for liveness checks
- Entity ownership structure analysis and beneficial owner identification
- Risk scoring for EDD trigger determination
- Automated 5-year retention date calculation and expiry alerts

---

### Step 1.3b: OFAC/SDN and PEP Screening

**Documents Required:**
- OFAC/SDN Screening Results (documented, including "no results found")
- EU/UN Sanctions Screening Results
- PEP Screening Results
- Adverse Media Scan Results

**Tasks to Complete:**
- [ ] Screen primary asset holder against OFAC SDN list
- [ ] Screen ALL associated persons against OFAC SDN list
- [ ] Screen ALL beneficial owners (for entities) against OFAC SDN list
- [ ] Screen against EU sanctions list
- [ ] Screen against UN sanctions list
- [ ] Run PEP (Politically Exposed Person) check
- [ ] Run adverse media scan
- [ ] Document ALL results (including negative/clear results)
- [ ] Resolve any partial matches (name variations, transliterations)
- [ ] If OFAC POSITIVE MATCH: IMMEDIATE STOP -- cannot proceed under any circumstances
- [ ] If PEP POSITIVE: does not disqualify but triggers Enhanced Due Diligence

**Data Fields to Capture:**
```json
{
  "ofac_screening_date": "date",
  "ofac_screening_result": "enum: clear | match | partial_match_resolved",
  "ofac_partial_match_resolution": "text | null",
  "eu_sanctions_screening_date": "date",
  "eu_sanctions_screening_result": "enum: clear | match | partial_match_resolved",
  "un_sanctions_screening_date": "date",
  "un_sanctions_screening_result": "enum: clear | match | partial_match_resolved",
  "pep_screening_date": "date",
  "pep_screening_result": "enum: clear | pep_identified",
  "pep_relationship": "string | null",
  "adverse_media_screening_date": "date",
  "adverse_media_screening_result": "enum: clear | findings",
  "adverse_media_findings": "text | null",
  "all_associated_persons_screened": "boolean",
  "screening_methodology": "string",
  "screened_by": "string"
}
```

**Sources/Links:**
- OFAC SDN List (free): https://sanctionssearch.ofac.treas.gov
- OpenSanctions (free): https://opensanctions.org
- NameScan (DPMS specialized): https://namescan.io/industries/preciousmetals
- Sanction Scanner: https://www.sanctionscanner.com

**Audit Log Entries:**
- `OFAC_SCREENING_COMPLETED: OFAC screening for [holder_name] completed by [user] at [timestamp]. Result: [clear/match/partial_match_resolved].`
- `SANCTIONS_SCREENING_COMPLETED: Full sanctions screening (OFAC + EU + UN) for [holder_name] completed at [timestamp]. Result: [clear].`
- `PEP_CHECK_COMPLETED: PEP screening for [holder_name] completed at [timestamp]. Result: [clear/pep_identified].`
- `ADVERSE_MEDIA_COMPLETED: Adverse media scan for [holder_name] completed at [timestamp]. Result: [clear/findings].`
- `SANCTIONS_MATCH_DETECTED: CRITICAL -- OFAC match detected for [holder_name] at [timestamp]. ENGAGEMENT TERMINATED.`

**Compliance Checkpoints:**
- All persons associated with asset screened (not just primary contact)
- All beneficial owners of entity holders screened
- Results documented even when "no results found"
- Partial match resolutions documented with reasoning
- OFAC match = immediate hard stop, no exceptions
- PEP status documented and EDD initiated if applicable

**AI Automation Opportunities:**
- Automated batch screening across all sanctions databases simultaneously
- Name variation and transliteration matching (reducing false positives)
- Continuous monitoring / re-screening automation (quarterly)
- NLP-based adverse media scanning across news databases
- Risk score calculation based on screening results

---

### Step 1.4: Provenance Review and Chain of Custody

**Documents Required:**
- Provenance Report documenting complete chain of custody
- Gap Analysis identifying undocumented periods
- Risk Assessment of provenance quality
- OECD Conflict Mineral Assessment (if applicable)
- Kimberley Process Compliance Certificate (if applicable, for diamonds)
- Import/Export Documentation
- Prior ownership records/receipts

**Tasks to Complete:**
- [ ] Determine mine/origin (country, mine name if known)
- [ ] Document every prior owner in chronological order
- [ ] Collect import/export documentation for international transfers
- [ ] Assess conflict zone exposure (OECD Due Diligence Guidance)
- [ ] Verify Kimberley Process compliance if applicable
- [ ] Identify and document any gaps in chain of custody
- [ ] Assess materiality of any provenance gaps
- [ ] Determine if provenance issues must be disclosed in PPM risk factors
- [ ] For the first asset specifically: document White Oak Partners II LLC history

**Data Fields to Capture:**
```json
{
  "provenance_report_date": "date",
  "provenance_report_hash": "string (SHA-256)",
  "origin_country": "string (ISO 3166)",
  "origin_mine": "string | null",
  "origin_region": "string | null",
  "chain_of_custody": [
    {
      "owner_name": "string",
      "owner_type": "enum: mine | dealer | collector | estate | vault | auction_house | other",
      "acquisition_date": "date | null",
      "disposal_date": "date | null",
      "documentation_available": "boolean",
      "documentation_type": "string | null"
    }
  ],
  "provenance_gaps": [
    {
      "gap_start_date": "date | null",
      "gap_end_date": "date | null",
      "gap_description": "text",
      "materiality": "enum: low | medium | high | critical"
    }
  ],
  "conflict_zone_assessment": "enum: clear | concern_identified | not_applicable",
  "oecd_due_diligence_completed": "boolean",
  "kimberley_process_applicable": "boolean",
  "kimberley_process_compliant": "boolean | null",
  "import_export_docs_collected": "boolean",
  "provenance_quality_rating": "enum: excellent | good | acceptable | poor | disqualifying",
  "ppm_disclosure_required": "boolean",
  "ppm_disclosure_description": "text | null"
}
```

**Sources/Links:**
- OECD Due Diligence Guidance for Responsible Supply Chains: https://www.oecd.org/corporate/mne/mining.htm
- Kimberley Process: https://www.kimberleyprocess.com
- FATF guidance on precious metals and stones: https://www.fatf-gafi.org

**Audit Log Entries:**
- `PROVENANCE_REVIEW_INITIATED: Provenance review for asset [asset_id] initiated by [user] at [timestamp].`
- `PROVENANCE_GAP_IDENTIFIED: Provenance gap identified for asset [asset_id]: [description]. Materiality: [level].`
- `PROVENANCE_REVIEW_COMPLETED: Provenance review completed for asset [asset_id] at [timestamp]. Quality: [rating].`

**Compliance Checkpoints:**
- Complete chain of custody documented from mine to current vault
- All gaps identified with materiality assessment
- OECD conflict mineral assessment on file
- Provenance issues flagged for PPM disclosure
- Investor would see: complete chain of custody with quality rating

**AI Automation Opportunities:**
- AI-powered provenance document classification and extraction
- Automated conflict zone assessment using OECD databases
- NLP analysis of ownership transfer documents
- Provenance quality scoring model
- Cross-reference against stolen gemstone databases

---

### Step 1.5: Review Existing Documentation

**Documents Required:**
- Documentation Inventory with Verification Status
- GIA Report Verification Confirmations
- Assessment of Existing Documentation Quality
- List of Additional Documentation Needed

**Tasks to Complete:**
- [ ] Catalog all existing GIA reports
- [ ] Verify EVERY GIA report online at gia.edu/report-check-landing
- [ ] Catalog all existing appraisals and assess USPAP compliance
- [ ] Catalog purchase receipts and insurance records
- [ ] Catalog photos/video of assets
- [ ] Assess overall documentation quality
- [ ] Identify documentation gaps
- [ ] Flag any fabricated or suspect documents

**Data Fields to Capture:**
```json
{
  "existing_documents": [
    {
      "document_type": "enum: gia_report | ssef_report | gubelin_report | appraisal | purchase_receipt | insurance_record | photo | video | other",
      "document_id": "string | null",
      "document_date": "date | null",
      "verified": "boolean",
      "verification_method": "string | null",
      "verification_date": "date | null",
      "quality_assessment": "enum: excellent | good | acceptable | poor | unusable",
      "notes": "text | null"
    }
  ],
  "gia_reports_count": "integer",
  "gia_reports_verified_count": "integer",
  "existing_appraisals_count": "integer",
  "uspap_compliant_appraisals_count": "integer",
  "documentation_quality_overall": "enum: complete | adequate | gaps_identified | inadequate",
  "additional_docs_needed": "text[]"
}
```

**Sources/Links:**
- GIA Report Check: https://gia.edu/report-check-landing
- SSEF Report Check: https://www.ssef.ch
- Gubelin Report Check: https://www.gubelingemlab.com

**Audit Log Entries:**
- `GIA_REPORT_VERIFIED: GIA report #[number] verified at gia.edu at [timestamp]. Result: [authentic/not_found/mismatch].`
- `DOCUMENTATION_REVIEW_COMPLETED: Documentation review for asset [asset_id] completed at [timestamp]. Quality: [rating]. Gaps: [count].`

**Compliance Checkpoints:**
- Every GIA report verified online (never accepted at face value)
- Existing appraisals assessed for USPAP compliance
- Documentation gaps identified and remediation planned

**AI Automation Opportunities:**
- Automated GIA report number extraction and online verification
- Document authenticity detection using image analysis
- Automated inventory generation from uploaded document batch

---

### Step 1.6: Preliminary Valuation Estimate

**Documents Required:**
- Desktop Valuation Memo
- Comparable Sales Data
- Market Analysis Summary

**Tasks to Complete:**
- [ ] Research comparable auction results (Sotheby's, Christie's, Bonhams)
- [ ] Review dealer price lists for similar stones
- [ ] Analyze prior appraisals (weight them by USPAP compliance)
- [ ] Produce preliminary valuation estimate
- [ ] Document methodology and data sources
- [ ] Set holder expectations (this is NOT the offering value)

**Data Fields to Capture:**
```json
{
  "preliminary_valuation_date": "date",
  "preliminary_valuation_low": "decimal",
  "preliminary_valuation_mid": "decimal",
  "preliminary_valuation_high": "decimal",
  "valuation_methodology": "text",
  "comparable_sales_count": "integer",
  "comparable_sales_sources": "string[]",
  "prior_appraisals_considered": "integer",
  "valuation_prepared_by": "string",
  "holder_expectations_managed": "boolean"
}
```

**Audit Log Entries:**
- `PRELIMINARY_VALUATION_COMPLETED: Preliminary valuation for asset [asset_id] completed at [timestamp]. Range: $[low] - $[high].`

**Compliance Checkpoints:**
- Methodology documented (not just a number)
- Comparable sales data cited
- Clear distinction from final offering value

**AI Automation Opportunities:**
- AI-powered comparable sales analysis from auction databases
- Market trend analysis for gemstone price forecasting
- Automated valuation report generation

---

### Step 1.7: Engagement Agreement

**Documents Required:**
- Signed Engagement Agreement
- Fee Structure Documentation
- Timeline and Gate Conditions Documentation

**Tasks to Complete:**
- [ ] Securities counsel drafts engagement agreement
- [ ] Define PleoChrome fee structure: 2% setup, 1.5% success, 0.75% annual admin
- [ ] Define asset holder obligations (documentation, pass-through costs, cooperation)
- [ ] Define timeline expectations and gate conditions
- [ ] Define termination provisions
- [ ] Specify that funds flow through SPV (not PleoChrome directly)
- [ ] Both parties review and negotiate
- [ ] Both parties execute electronically

**Data Fields to Capture:**
```json
{
  "engagement_agreement_date": "date",
  "engagement_agreement_hash": "string (SHA-256)",
  "setup_fee_rate": "decimal",
  "success_fee_rate": "decimal",
  "annual_admin_fee_rate": "decimal",
  "holder_obligations_documented": "boolean",
  "timeline_expectations_set": "boolean",
  "termination_provisions_included": "boolean",
  "spv_fund_flow_specified": "boolean",
  "both_parties_executed": "boolean",
  "execution_method": "enum: electronic | wet_ink",
  "counsel_reviewed": "boolean"
}
```

**Audit Log Entries:**
- `ENGAGEMENT_AGREEMENT_EXECUTED: Engagement agreement executed with [holder_name] at [timestamp]. Hash: [SHA-256]. Fee structure: [setup]%/[success]%/[admin]%.`

**Compliance Checkpoints:**
- Securities counsel drafted or reviewed the agreement
- Fee structure clearly documented
- Fund flow through SPV explicitly specified (avoids MSB classification risk)
- Termination provisions protect both parties

**AI Automation Opportunities:**
- Auto-generate engagement agreement from template with deal-specific terms
- Fee calculator based on preliminary valuation

---

### Step 1.8: Internal Deal Committee Review

**Documents Required:**
- Deal Package Summary
- Go/No-Go Decision Memo

**Tasks to Complete:**
- [ ] Compile deal package: KYC results, sanctions screening, provenance report, preliminary valuation, existing documentation review, engagement terms
- [ ] Founders review deal package
- [ ] Assess provenance quality
- [ ] Assess valuation potential
- [ ] Assess holder reliability
- [ ] Make Go/No-Go decision
- [ ] Document decision with rationale

**Data Fields to Capture:**
```json
{
  "deal_committee_review_date": "date",
  "deal_committee_members": "string[]",
  "provenance_quality_assessment": "enum: strong | acceptable | concerns | disqualifying",
  "valuation_potential_assessment": "enum: high | medium | low | uncertain",
  "holder_reliability_assessment": "enum: high | medium | low | unacceptable",
  "deal_committee_decision": "enum: proceed | conditional_proceed | defer | reject",
  "decision_rationale": "text",
  "conditions_for_proceed": "text | null"
}
```

**Audit Log Entries:**
- `DEAL_COMMITTEE_REVIEW: Deal committee reviewed asset [asset_id] at [timestamp]. Decision: [decision]. Members: [list].`

**Compliance Checkpoints:**
- Formal review by at least two founders documented
- Decision rationale recorded (shows diligence, not just yes/no)
- Any conditions documented with clear acceptance criteria

**AI Automation Opportunities:**
- Auto-compile deal package from individual step outputs
- Risk scoring model aggregating all Phase 1 findings
- AI-generated deal summary memo

---

### GATE 1 (Source Gate) and GATE 2 (Evidence Gate)

**Gate Fields:**
```json
{
  "gate_1_passed": "boolean",
  "gate_1_date": "date | null",
  "gate_1_checklist": {
    "holder_identity_verified": "boolean",
    "sanctions_screening_clear": "boolean",
    "pep_screening_clear_or_edd_initiated": "boolean",
    "provenance_documented": "boolean",
    "existing_docs_reviewed_verified": "boolean",
    "engagement_agreement_signed": "boolean",
    "no_unresolved_red_flags": "boolean"
  },
  "gate_2_passed": "boolean",
  "gate_2_date": "date | null",
  "gate_2_checklist": {
    "prior_certifications_verified": "boolean",
    "preliminary_valuation_within_range": "boolean",
    "no_provenance_red_flags": "boolean",
    "deal_committee_approved": "boolean"
  }
}
```

---

## PHASE 2: PREPARATION (Shared Phase 2)

**Coverage:** portal-data.ts Steps 2.1-2.10 with Gates G3, G4, G5.

---

### Step 2.1: GIA Lab Submission

**Documents Required:**
- GIA Identification & Origin Report for each significant stone
- GIA Online Verification Confirmations
- GIA Submission Forms
- Transit Insurance for transport to/from GIA

**Tasks to Complete:**
- [ ] Contact GIA lab (Carlsbad: carlsbadlab@gia.edu or New York: newyorklab@gia.edu)
- [ ] Complete submission forms for each stone
- [ ] Arrange insured transport to GIA laboratory
- [ ] For each stone: obtain Identification & Origin Report (not just identification)
- [ ] For emeralds: add Emerald Clarity Enhancement Filler ID ($50/stone)
- [ ] Verify each report online at gia.edu/report-check-landing
- [ ] Catalog all report numbers

**Data Fields to Capture:**
```json
{
  "gia_submissions": [
    {
      "stone_id": "string",
      "gia_report_number": "string",
      "report_type": "enum: identification_origin | identification_only",
      "species": "string",
      "color_grade": "string",
      "clarity_grade": "string | null",
      "cut_grade": "string | null",
      "carat_weight": "decimal",
      "origin_determination": "string | null",
      "treatment_status": "string",
      "enhancement_filler_id": "boolean",
      "fee_paid": "decimal",
      "submission_date": "date",
      "report_received_date": "date | null",
      "online_verification_date": "date | null",
      "online_verification_result": "enum: verified | not_found | mismatch"
    }
  ],
  "total_gia_cost": "decimal",
  "express_service_used": "boolean",
  "transit_insurance_policy": "string | null"
}
```

**Sources/Links:**
- GIA Lab (Carlsbad): carlsbadlab@gia.edu
- GIA Lab (New York): newyorklab@gia.edu
- GIA Report Check: https://gia.edu/report-check-landing
- GIA Fee Schedule: https://www.gia.edu/gem-lab-service/colored-stone

**Audit Log Entries:**
- `GIA_SUBMITTED: [count] stones submitted to GIA [lab_location] at [timestamp]. Submission ref: [ref].`
- `GIA_REPORT_RECEIVED: GIA report #[number] received for stone [stone_id] at [timestamp]. Species: [species]. Weight: [carat]ct. Origin: [origin].`
- `GIA_REPORT_VERIFIED_ONLINE: GIA report #[number] verified online at [timestamp]. Result: [verified].`

**Compliance Checkpoints:**
- Every report verified online (never trust paper alone)
- Report type is Identification & ORIGIN (not just identification)
- All stones are individually reported

**AI Automation Opportunities:**
- Automated report number extraction and online verification
- Batch GIA fee estimation based on stone count and weight ranges
- Timeline tracking with automated alerts for expected delivery dates

---

### Step 2.2: SSEF / Gubelin Origin (If Needed)

**Documents Required:**
- SSEF Origin Determination Report (per stone submitted)
- Spectroscopic Analysis Data

**Tasks to Complete:**
- [ ] Determine if supplemental origin determination is needed (for high-value origin-dependent stones)
- [ ] Submit key stones to SSEF (ssef.ch) for spectroscopic origin determination
- [ ] Receive and catalog SSEF reports
- [ ] Compare SSEF origin findings with GIA origin findings

**Data Fields to Capture:**
```json
{
  "ssef_required": "boolean",
  "ssef_submissions": [
    {
      "stone_id": "string",
      "ssef_report_number": "string",
      "origin_determination": "string",
      "spectroscopic_data_included": "boolean",
      "fee_paid": "decimal",
      "submission_date": "date",
      "report_received_date": "date | null"
    }
  ],
  "origin_consistency_with_gia": "enum: consistent | inconsistent | partial_match",
  "origin_inconsistency_notes": "text | null"
}
```

**Sources/Links:**
- SSEF: https://www.ssef.ch
- Gubelin Gem Lab: https://www.gubelingemlab.com

**Audit Log Entries:**
- `SSEF_SUBMITTED: [count] stones submitted to SSEF at [timestamp].`
- `SSEF_REPORT_RECEIVED: SSEF report #[number] received for stone [stone_id]. Origin: [origin].`
- `ORIGIN_INCONSISTENCY: Origin determination inconsistency between GIA and SSEF for stone [stone_id]. GIA: [origin1]. SSEF: [origin2].`

**Compliance Checkpoints:**
- SSEF origin consistent with GIA origin (or inconsistency documented and addressed)
- Provides independent confirmation of geographic origin claims

**AI Automation Opportunities:**
- Automated origin consistency checking between multiple lab reports

---

### Step 2.3: Build Approved Appraiser Panel

**Documents Required:**
- 3 Signed Appraiser Engagement Agreements
- Verified Credentials for Each (CGA or MGA)
- USPAP Currency Confirmation for Each
- Independence Confirmations (no affiliation with holder, PleoChrome, vault, or other appraisers)
- E&O Insurance Verification for Each
- 12-Question Interview Notes for Each Candidate

**Tasks to Complete:**
- [ ] Source candidates from ASA, AGS, and NAJA directories
- [ ] Verify CGA or MGA credential for each candidate
- [ ] Verify USPAP currency for each candidate
- [ ] Verify E&O insurance for each candidate
- [ ] Confirm ZERO affiliation with asset holder, PleoChrome, vault partner, or other appraisers
- [ ] Confirm no disciplinary actions from any gemological association
- [ ] Verify fee structure is hourly or flat (USPAP prohibits percentage-of-value fees)
- [ ] Conduct 12-question interview for each candidate
- [ ] Execute engagement agreements with top 3 appraisers

**Data Fields to Capture:**
```json
{
  "appraiser_panel": [
    {
      "appraiser_name": "string",
      "credential": "enum: cga | mga | other",
      "credential_number": "string",
      "credential_verified": "boolean",
      "uspap_current": "boolean",
      "uspap_expiry_date": "date",
      "eo_insurance_verified": "boolean",
      "eo_insurance_carrier": "string",
      "independence_confirmed": "boolean",
      "disciplinary_actions": "enum: none | disclosed",
      "fee_structure": "enum: hourly | flat",
      "fee_amount": "decimal",
      "engagement_date": "date",
      "interview_score": "decimal | null",
      "specialty": "string"
    }
  ],
  "panel_complete": "boolean"
}
```

**Sources/Links:**
- ASA Directory: https://appraisers.org
- AGS Directory: https://americangemsociety.org
- NAJA Directory: https://najaappraisers.com
- USPAP Standards: https://www.appraisalfoundation.org

**Audit Log Entries:**
- `APPRAISER_VETTED: Appraiser [name] vetted at [timestamp]. Credential: [credential]. USPAP current: [yes/no]. Independence: [confirmed/concern].`
- `APPRAISER_PANEL_COMPLETE: 3-appraiser panel assembled at [timestamp]. Appraisers: [list].`

**Compliance Checkpoints:**
- All 3 appraisers independently credentialed and verified
- Independence from all parties confirmed in writing
- USPAP-prohibited percentage fees not used
- 12-question interview documented for each

**AI Automation Opportunities:**
- Automated credential verification against directory databases
- Conflict-of-interest detection across appraiser networks

---

### Step 2.4: Sequential 3-Appraisal Process

**Documents Required:**
- 3 Independent USPAP-Compliant Written Appraisal Reports
- Transit Insurance Policies for Each Shipping Leg
- Shipping Manifests and Chain of Custody Documentation

**Tasks to Complete:**
- [ ] Ship stones to Appraiser 1 with insured transit
- [ ] Appraiser 1 produces independent USPAP-compliant report
- [ ] Ship stones from Appraiser 1 to Appraiser 2 with insured transit
- [ ] Appraiser 2 produces independent report (no knowledge of Appraiser 1's findings)
- [ ] Ship stones from Appraiser 2 to Appraiser 3 with insured transit
- [ ] Appraiser 3 produces independent report (no knowledge of others' findings)
- [ ] Verify each report includes: intended use, effective date, type of value, methodology, comparable sales, certification statement
- [ ] Verify each values collection as whole AND key individual pieces

**Data Fields to Capture:**
```json
{
  "appraisals": [
    {
      "appraiser_name": "string",
      "appraisal_number": "integer (1, 2, or 3)",
      "report_date": "date",
      "report_hash": "string (SHA-256)",
      "total_collection_value": "decimal",
      "key_stone_values": [
        {
          "stone_id": "string",
          "appraised_value": "decimal"
        }
      ],
      "methodology": "string",
      "comparable_sales_cited": "integer",
      "uspap_compliant": "boolean",
      "intended_use_stated": "boolean",
      "effective_date": "date",
      "type_of_value": "string",
      "certification_statement_included": "boolean"
    }
  ],
  "transit_insurance_policies": [
    {
      "leg": "string",
      "insurance_policy": "string",
      "coverage_amount": "decimal",
      "carrier": "string"
    }
  ],
  "chain_of_custody_log": [
    {
      "date": "date",
      "from": "string",
      "to": "string",
      "method": "string",
      "tracking_number": "string | null"
    }
  ]
}
```

**Audit Log Entries:**
- `APPRAISAL_SHIPPED: Stones shipped from [from] to [to] at [timestamp]. Transit insurance: $[coverage]. Tracking: [number].`
- `APPRAISAL_RECEIVED: Appraisal #[number] received from [appraiser] at [timestamp]. Total value: $[value].`

**Compliance Checkpoints:**
- Sequential order maintained (no cross-contamination)
- Each report independently USPAP-compliant with all required sections
- Transit insurance active for every shipping leg
- Chain of custody documented at every handoff

**AI Automation Opportunities:**
- Automated appraisal comparison and variance calculation
- Transit tracking integration with insurance verification
- USPAP compliance checker for report sections

---

### Step 2.5: Variance Analysis and Offering Value Determination

**Documents Required:**
- Variance Analysis Report
- Final Offering Value Determination (documented)
- Token Pricing Calculation

**Tasks to Complete:**
- [ ] Collect all 3 appraisal reports
- [ ] Calculate variance between highest and lowest appraisals
- [ ] If variance > 15-20%: flag for review, consider 4th tiebreaker appraisal
- [ ] Calculate offering value = average of two lowest appraisals
- [ ] Determine token price and total supply
- [ ] Document methodology in formal Variance Analysis Report
- [ ] Securities counsel reviews methodology for PPM disclosure
- [ ] Communicate offering value to asset holder (manage expectations)

**Data Fields to Capture:**
```json
{
  "appraisal_1_value": "decimal",
  "appraisal_2_value": "decimal",
  "appraisal_3_value": "decimal",
  "variance_percentage": "decimal",
  "variance_within_threshold": "boolean",
  "threshold_used": "decimal (e.g., 0.20 for 20%)",
  "fourth_appraisal_triggered": "boolean",
  "fourth_appraisal_value": "decimal | null",
  "offering_value": "decimal",
  "offering_value_methodology": "string",
  "token_price": "decimal",
  "total_token_supply": "integer",
  "variance_analysis_date": "date",
  "variance_analysis_hash": "string (SHA-256)",
  "counsel_reviewed": "boolean",
  "holder_notified": "boolean",
  "holder_notification_date": "date | null"
}
```

**Audit Log Entries:**
- `VARIANCE_ANALYSIS_COMPLETED: Variance analysis completed at [timestamp]. Values: $[v1], $[v2], $[v3]. Variance: [pct]%. Offering value: $[value].`
- `TOKEN_PRICING_SET: Token price set at $[price]. Total supply: [count]. At [timestamp].`

**Compliance Checkpoints:**
- Variance within 15-20% threshold (or 4th appraisal obtained)
- Conservative methodology used (average of two lowest, not highest)
- Token pricing matches offering value exactly (supply x price = offering value)
- Methodology disclosed in PPM

**AI Automation Opportunities:**
- Automated variance calculation and threshold alerting
- Market-adjusted valuation modeling
- Automatic token supply calculation

---

### Step 2.6: Vault Selection & Transfer

**Documents Required:**
- Vault Comparison Matrix
- Signed Custody Agreement
- Insurance Verification Letter
- API/Reporting Feed Specifications
- Transit Insurance Policy
- Shipping Manifest
- Vault Receipt / Custody Acknowledgment
- Segregated Storage Confirmation

**Tasks to Complete:**
- [ ] Request proposals from institutional vaults (Brink's, Malca-Amit)
- [ ] Evaluate: segregated storage, insurance coverage, API capability, FTZ availability, financial stability
- [ ] Securities counsel reviews custody agreement terms
- [ ] Execute custody agreement
- [ ] Arrange insured armored transport
- [ ] Vault verifies stones against GIA reports upon receipt
- [ ] Obtain segregated storage confirmation
- [ ] Verify vault insurance covers full appraised value
- [ ] Activate API/reporting feed (for Chainlink PoR)

**Data Fields to Capture:**
```json
{
  "vault_partner": "string",
  "vault_location": "string",
  "custody_agreement_date": "date",
  "custody_agreement_hash": "string (SHA-256)",
  "segregated_storage_confirmed": "boolean",
  "insurance_coverage_amount": "decimal",
  "insurance_carrier": "string",
  "insurance_verification_date": "date",
  "ftz_available": "boolean",
  "api_capability": "boolean",
  "api_active": "boolean",
  "api_endpoint": "string | null",
  "vault_receipt_number": "string",
  "vault_receipt_date": "date",
  "annual_custody_cost": "decimal",
  "transit_insurance_amount": "decimal",
  "transit_date": "date | null",
  "transit_carrier": "string | null",
  "stones_verified_against_gia": "boolean"
}
```

**Sources/Links:**
- Brink's: https://us.brinks.com/precious-metals
- Malca-Amit: https://malca-amit.com

**Audit Log Entries:**
- `VAULT_SELECTED: [vault_name] selected as custody partner at [timestamp].`
- `CUSTODY_AGREEMENT_EXECUTED: Custody agreement executed with [vault_name] at [timestamp]. Hash: [SHA-256].`
- `STONES_TRANSFERRED: Stones transferred to [vault_name] at [timestamp]. Transit insurance: $[amount].`
- `VAULT_RECEIPT_ISSUED: Vault receipt #[number] issued by [vault_name] at [timestamp]. Segregated storage: [confirmed].`
- `VAULT_API_ACTIVATED: Vault API feed activated at [timestamp]. Endpoint: [url].`

**Compliance Checkpoints:**
- Institutional-grade vault (Brink's or Malca-Amit class)
- Segregated storage (not commingled)
- Insurance covers full appraised value (written confirmation)
- API feed for Chainlink PoR integration
- Stones verified against GIA reports at intake

**AI Automation Opportunities:**
- Automated vault comparison scoring matrix
- API health monitoring with alert on feed interruptions
- Insurance adequacy checker (coverage vs. appraised value)

---

### Step 2.7: SPV Formation

**Documents Required:**
- Series A Operating Agreement
- Series A EIN
- Series A Bank Account Documentation
- Series Designation Filing (Wyoming SOS)

**Tasks to Complete:**
- [ ] Securities counsel drafts Series A Operating Agreement
- [ ] Define token holder rights (economic, voting, distribution)
- [ ] File series designation with Wyoming SOS ($10)
- [ ] Obtain EIN for Series A
- [ ] Open Series A bank account
- [ ] Ensure token holders have rights IN THIS SERIES only (not parent LLC)

**Data Fields to Capture:**
```json
{
  "spv_name": "string",
  "spv_type": "wyoming_series_llc_series",
  "series_designation_date": "date",
  "series_filing_number": "string",
  "spv_ein": "string",
  "spv_bank_name": "string",
  "spv_bank_account": "string (encrypted)",
  "operating_agreement_date": "date",
  "operating_agreement_hash": "string (SHA-256)",
  "token_holder_economic_rights": "text",
  "token_holder_voting_rights": "text",
  "token_holder_distribution_rights": "text"
}
```

**Audit Log Entries:**
- `SPV_FORMED: Series [name] formed under PleoChrome Holdings at [timestamp]. Filing #[number]. EIN: [ein].`

**Compliance Checkpoints:**
- Operating Agreement precisely defines token-to-legal-rights mapping
- Token holders have rights in THIS SERIES only (liability isolation)
- EIN and bank account active before token sale

---

### Step 2.8: PPM & Legal Documents

**Documents Required:**
- Finalized PPM (60-150 pages, 17 sections)
- Subscription Agreement
- Token Purchase Agreement
- Investor Questionnaire
- Accredited Investor Certification Form
- Operating Agreement (Series-specific)
- Custody Agreement
- Smart Contract Audit Report Reference
- Tax Opinion Letter
- Escrow Agreement (if applicable)

**Tasks to Complete:**
- [ ] Securities counsel drafts PPM with all 17 required sections
- [ ] Cover Page with proper disclaimers
- [ ] Summary of Offering
- [ ] Risk Factors (gemstone-specific, tokenization, securities, business, regulatory, custody, market, tax, liquidity)
- [ ] Description of Business
- [ ] Management Team with Bad Actor disclosure (Rule 506(d))
- [ ] Terms of Offering (token structure, rights)
- [ ] Use of Proceeds (detailed breakdown)
- [ ] Description of Securities (ERC-3643 token structure)
- [ ] Plan of Distribution
- [ ] Investor Suitability Standards
- [ ] Tax Considerations (28% collectibles rate for gemstones)
- [ ] ERISA Considerations
- [ ] Legal Matters
- [ ] Conflicts of Interest
- [ ] Financial Statements
- [ ] Exhibits (Subscription Agreement, Operating Agreement, Investor Questionnaire, Accredited Investor Cert)
- [ ] Tax counsel reviews tax sections
- [ ] Management reviews for factual accuracy
- [ ] BD (if engaged) reviews for FINRA compliance
- [ ] Bad actor checks on ALL covered persons (Rule 506(d))

**Data Fields to Capture:**
```json
{
  "ppm_version": "string",
  "ppm_date": "date",
  "ppm_hash": "string (SHA-256)",
  "ppm_page_count": "integer",
  "ppm_sections_complete": {
    "cover_page": "boolean",
    "summary": "boolean",
    "risk_factors": "boolean",
    "business_description": "boolean",
    "management_team": "boolean",
    "terms_of_offering": "boolean",
    "use_of_proceeds": "boolean",
    "description_of_securities": "boolean",
    "plan_of_distribution": "boolean",
    "investor_suitability": "boolean",
    "tax_considerations": "boolean",
    "erisa_considerations": "boolean",
    "legal_matters": "boolean",
    "conflicts_of_interest": "boolean",
    "financial_statements": "boolean",
    "exhibits": "boolean"
  },
  "tax_counsel_review_date": "date | null",
  "management_review_date": "date | null",
  "bd_review_date": "date | null",
  "bad_actor_checks_completed": "boolean",
  "bad_actor_check_date": "date | null",
  "bad_actor_covered_persons": [
    {
      "name": "string",
      "role": "string",
      "check_result": "enum: clear | disqualifying_event | pre_rule_event_disclosed",
      "lookback_period_years": "integer"
    }
  ],
  "subscription_agreement_hash": "string (SHA-256)",
  "token_purchase_agreement_hash": "string (SHA-256)",
  "tax_opinion_hash": "string (SHA-256) | null",
  "msb_legal_opinion_hash": "string (SHA-256)",
  "msb_classification": "enum: not_msb | msb_registration_required | pending"
}
```

**Sources/Links:**
- SEC Form D info: https://www.sec.gov/about/forms/formd.pdf
- EDGAR: https://www.sec.gov/edgar
- Rule 506(d) Bad Actor: https://www.sec.gov/resources-small-businesses/small-business-compliance-guides/disqualification-felons-other-bad-actors-rule-506-offerings-related-disclosure-requirements
- FINRA Form 5123: https://www.finra.org/rules-guidance/rulebooks/finra-rules/5123

**Audit Log Entries:**
- `PPM_DRAFT_COMPLETED: PPM v[version] draft completed at [timestamp]. [page_count] pages. Hash: [SHA-256].`
- `BAD_ACTOR_CHECK_COMPLETED: Bad actor check for [name] ([role]) completed at [timestamp]. Result: [clear/event_disclosed].`
- `MSB_OPINION_RECEIVED: MSB legal opinion received at [timestamp]. Classification: [not_msb/msb_required].`
- `PPM_FINALIZED: PPM finalized and approved at [timestamp]. All sections complete. All reviews signed off.`

**Compliance Checkpoints:**
- All 17 PPM sections present and complete
- Bad actor checks on ALL covered persons (directors, officers, general partners, managing members, >20% shareholders, promoters, compensated solicitors)
- 5-year lookback for issuers; 10-year lookback for other covered persons
- MSB legal opinion obtained (and fund flow structured to avoid MSB classification)
- Tax considerations address 28% collectibles rate
- All documents internally consistent
- Rule 506(d) disqualification events: check for felonies, misdemeanors re: securities, false SEC filings, SEC/CFTC/state orders, suspension from BD/IA membership, stop orders

**AI Automation Opportunities:**
- AI-powered PPM completeness checker (verify all 17 sections)
- Automated consistency checking between PPM and marketing materials
- Bad actor check automation across public databases
- Tax treatment analysis for tokenized collectibles

---

### Step 2.9: Chainlink Proof of Reserve Setup

**Documents Required:**
- Chainlink BUILD Program Application
- Custom External Adapter Documentation
- PoR Feed Contract (testnet)
- Oracle Integration Test Report

**Tasks to Complete:**
- [ ] Apply to Chainlink BUILD program at chain.link/build-program
- [ ] Negotiate token supply commitment to LINK stakers (typically 3-5%)
- [ ] Develop custom external adapter connecting vault API to Chainlink oracle network
- [ ] Deploy PoR feed contract to Polygon testnet
- [ ] Test attestation: verify feed correctly reports custody status
- [ ] Test mint-gating: tokens cannot mint when PoR reports no custody
- [ ] Establish manual fallback process if automated feed unavailable

**Data Fields to Capture:**
```json
{
  "chainlink_build_application_date": "date | null",
  "chainlink_build_status": "enum: applied | approved | rejected | not_applicable",
  "link_staker_commitment_pct": "decimal | null",
  "external_adapter_deployed": "boolean",
  "external_adapter_endpoint": "string | null",
  "por_feed_contract_testnet": "string | null",
  "por_feed_contract_mainnet": "string | null",
  "por_feed_verified_on_testnet": "boolean",
  "mint_gating_tested": "boolean",
  "manual_fallback_documented": "boolean",
  "por_integration_cost": "decimal"
}
```

**Sources/Links:**
- Chainlink BUILD Program: https://chain.link/build-program
- Chainlink PoR Docs: https://docs.chain.link/data-feeds/proof-of-reserve
- AggregatorV3Interface: https://docs.chain.link/data-feeds/using-data-feeds

**Audit Log Entries:**
- `CHAINLINK_BUILD_APPLIED: Applied to Chainlink BUILD program at [timestamp].`
- `POR_TESTNET_VERIFIED: PoR feed verified on testnet at [timestamp]. Custody status correctly reported.`
- `MINT_GATING_TESTED: Mint-gating tested at [timestamp]. Mint blocked when PoR=false: [confirmed].`

**Compliance Checkpoints:**
- PoR feed accurately reports custody status
- Mint-gating confirmed functional (tokens cannot be minted without custody verification)
- Manual fallback process documented

**AI Automation Opportunities:**
- Automated PoR feed health monitoring
- Alert system for feed discrepancies or downtime

---

### GATE 3 (Verification), GATE 4 (Custody), GATE 5 (Legal)

**Gate Fields:**
```json
{
  "gate_3_passed": "boolean",
  "gate_3_date": "date | null",
  "gate_3_checklist": {
    "all_lab_reports_received_verified": "boolean",
    "ssef_origin_complete_if_applicable": "boolean",
    "three_appraisals_received": "boolean",
    "variance_within_threshold": "boolean",
    "offering_value_determined": "boolean"
  },
  "gate_4_passed": "boolean",
  "gate_4_date": "date | null",
  "gate_4_checklist": {
    "stones_in_institutional_vault": "boolean",
    "vault_receipt_in_hand": "boolean",
    "vault_insurance_verified": "boolean",
    "api_feed_active_or_manual_fallback": "boolean"
  },
  "gate_5_passed": "boolean",
  "gate_5_date": "date | null",
  "gate_5_checklist": {
    "spv_formed": "boolean",
    "ppm_finalized": "boolean",
    "subscription_agreement_finalized": "boolean",
    "token_purchase_agreement_finalized": "boolean",
    "custody_agreement_executed": "boolean",
    "msb_opinion_received": "boolean",
    "form_d_prepared": "boolean",
    "all_documents_consistent": "boolean",
    "bad_actor_checks_complete": "boolean"
  }
}
```

---

## PHASE 3: TOKENIZATION (Path-Specific)

**Coverage:** portal-data.ts Steps 3.1-3.6 with Gate G6.

---

### Step 3.1: Platform Configuration

**Documents Required:**
- Active Platform Subscription Confirmation
- Token Configuration Document
- Compliance Rules Configuration Document
- Legal Document Hashes On-Chain

**Tasks to Complete:**
- [ ] Subscribe to tokenization platform (Brickken Enterprise or Zoniqx)
- [ ] Configure token name (must match PPM exactly)
- [ ] Configure token symbol
- [ ] Configure total supply (must match offering value / token price)
- [ ] Configure compliance rules: KYC required, accredited investor required, US jurisdiction
- [ ] Set jurisdiction restrictions per legal opinion
- [ ] Attach legal document hashes on-chain (PPM, Subscription Agreement, Token Purchase Agreement)
- [ ] Keep local backups of all configurations (migration insurance)

**Data Fields to Capture:**
```json
{
  "tokenization_platform": "enum: brickken | zoniqx | securitize | other",
  "platform_tier": "string",
  "platform_annual_cost": "decimal",
  "token_name": "string",
  "token_symbol": "string",
  "token_standard": "enum: erc_3643 | erc_7518 | erc_1400 | other",
  "blockchain": "enum: polygon | ethereum | avalanche | other",
  "total_supply": "integer",
  "token_price": "decimal",
  "compliance_rules": {
    "kyc_required": "boolean",
    "accredited_investor_required": "boolean",
    "jurisdiction_whitelist": "string[]",
    "jurisdiction_blacklist": "string[]",
    "max_holder_count": "integer | null",
    "per_investor_max_pct": "decimal | null",
    "per_country_max_pct": "decimal | null",
    "lockup_period_days": "integer | null",
    "daily_transfer_limit": "decimal | null"
  },
  "document_hashes_on_chain": {
    "ppm_hash": "string (SHA-256)",
    "subscription_agreement_hash": "string (SHA-256)",
    "token_purchase_agreement_hash": "string (SHA-256)"
  },
  "configuration_date": "date",
  "local_backup_created": "boolean"
}
```

**Sources/Links:**
- Brickken: https://www.brickken.com
- Zoniqx: https://zoniqx.com
- ERC-3643 docs: https://docs.erc3643.org

**Audit Log Entries:**
- `PLATFORM_SUBSCRIBED: Subscribed to [platform] [tier] at [timestamp]. Annual cost: $[cost].`
- `TOKEN_CONFIGURED: Token [symbol] configured on [platform] at [timestamp]. Supply: [count]. Price: $[price].`
- `COMPLIANCE_RULES_SET: Compliance rules configured at [timestamp]. KYC: [yes]. Accredited: [yes]. Jurisdictions: [list].`

**Compliance Checkpoints:**
- Token parameters EXACTLY match legal documents (name, symbol, supply, price)
- Compliance rules enforce all legal requirements
- Document hashes on-chain for verifiability

**AI Automation Opportunities:**
- Automated parameter validation against PPM
- Configuration drift detection (alert if platform settings change)

---

### Step 3.2: ERC-3643 Compliance Rules Definition

**Documents Required:**
- Compliance Rules Specification
- Claim Topics Registry Configuration
- Trusted Issuers Registry Configuration
- Identity Registry Configuration

**Tasks to Complete:**
- [ ] Define on-chain compliance rules:
  - Accredited investor whitelist enforcement
  - Jurisdiction restrictions (block non-US or restricted jurisdictions)
  - Transfer restrictions (Rule 144 holding period: 12 months for non-reporting issuer)
  - Maximum holder count (stay under 2,000 to avoid SEC reporting threshold)
  - Per-investor maximum (e.g., 10% of total supply)
- [ ] Configure Claim Topics Registry:
  - Topic 1: KYC/Identity Verified
  - Topic 2: Accredited Investor
  - Topic 4: AML/Sanctions Screening Passed
- [ ] Configure Trusted Issuers Registry (who can verify identities)
- [ ] Configure Identity Registry (map wallet addresses to ONCHAINID)

**Data Fields to Capture:**
```json
{
  "claim_topics": [
    {
      "topic_id": "integer",
      "topic_name": "string",
      "required": "boolean"
    }
  ],
  "trusted_issuers": [
    {
      "issuer_name": "string",
      "issuer_onchainid": "string",
      "authorized_topics": "integer[]"
    }
  ],
  "rule_144_holding_period_days": "integer",
  "max_holder_count": "integer",
  "per_investor_max_percentage": "decimal",
  "per_country_max_percentage": "decimal | null",
  "lockup_period_enforced": "boolean",
  "compliance_rules_hash": "string (SHA-256)"
}
```

**Sources/Links:**
- ERC-3643 Compliance Contract: https://docs.erc3643.org/erc-3643/smart-contracts-library/permissioned-tokens
- SEC Rule 144: https://www.sec.gov/reports/rule-144-selling-restricted-control-securities
- SEC holder thresholds: Section 12(g) of the Exchange Act (2,000 holders of record)

**Audit Log Entries:**
- `COMPLIANCE_RULES_DEFINED: On-chain compliance rules defined at [timestamp]. Holding period: [days] days. Max holders: [count].`

**Compliance Checkpoints:**
- Rule 144 holding period correctly set (12 months for non-reporting issuer)
- Max holder count keeps offering below SEC reporting thresholds
- All required claim topics configured (KYC + Accredited + AML minimum)
- Trusted issuers are legitimate KYC/verification providers

**AI Automation Opportunities:**
- Automated Rule 144 holding period calculation
- Regulatory threshold monitoring (holder count approaching 2,000)

---

### Step 3.3: Testnet Deployment & Testing

**Documents Required:**
- Testnet Deployment Report
- Comprehensive Test Report (positive and negative cases)
- Edge Case Test Results

**Tasks to Complete:**
- [ ] Deploy to Polygon testnet (Amoy)
- [ ] Test minting to whitelisted wallet -> PASS
- [ ] Test transfer to non-whitelisted wallet -> FAIL (correctly blocked)
- [ ] Test mint when PoR reports no custody -> FAIL (correctly blocked)
- [ ] Test all compliance rules blocking correctly
- [ ] Test freeze/unfreeze functionality
- [ ] Test forced transfer capability (for court orders)
- [ ] Test pause/unpause functionality (emergency stop)
- [ ] Test recovery address functionality (lost wallet)
- [ ] Test token burn functionality (for redemptions)
- [ ] Test batch operations
- [ ] Test edge cases: transfer exactly at limit, max holder count boundary, lockup period expiry

**Data Fields to Capture:**
```json
{
  "testnet_contract_address": "string",
  "testnet_deployment_date": "date",
  "test_results": [
    {
      "test_name": "string",
      "test_type": "enum: positive | negative | edge_case",
      "expected_result": "string",
      "actual_result": "string",
      "passed": "boolean",
      "notes": "text | null"
    }
  ],
  "total_tests_run": "integer",
  "total_passed": "integer",
  "total_failed": "integer",
  "all_critical_tests_passed": "boolean",
  "test_report_hash": "string (SHA-256)"
}
```

**Audit Log Entries:**
- `TESTNET_DEPLOYED: Token deployed to [testnet] at [timestamp]. Contract: [address].`
- `TEST_SUITE_COMPLETED: Test suite completed at [timestamp]. [passed]/[total] tests passed.`
- `TEST_FAILURE: Test [test_name] FAILED at [timestamp]. Expected: [expected]. Got: [actual].`

**Compliance Checkpoints:**
- ALL compliance blocking tests pass (non-whitelisted transfer blocked, etc.)
- Emergency controls (pause, freeze, forced transfer) verified functional
- No critical or high-severity test failures

**AI Automation Opportunities:**
- Automated test suite generation for ERC-3643 compliance rules
- Continuous integration testing on code changes
- Automated regression testing

---

### Step 3.4: Smart Contract Audit

**Documents Required:**
- Smart Contract Audit Report (with severity classifications)
- Remediation Documentation (if findings)
- Clean Audit Report (post-remediation)

**Tasks to Complete:**
- [ ] Engage independent audit firm (OpenZeppelin, CertiK, Quantstamp, QuillAudits, Trail of Bits, or Sherlock)
- [ ] Provide deployed testnet contract, documentation, compliance rules, PoR integration
- [ ] Audit covers all 6 ERC-3643 contracts + Chainlink PoR integration + escrow
- [ ] Check OWASP Smart Contract Top 10 (2026): access control (#1), business logic (#2), price/oracle manipulation (#3), lack of input validation (#4), unchecked external calls (#5), improper error handling (#6), front-running (#7), reentrancy (#8), denial of service (#9), proxy vulnerabilities (#10)
- [ ] Remediate any critical or high-severity findings
- [ ] Obtain clean audit report before mainnet deployment
- [ ] Include audit report in investor data room

**Data Fields to Capture:**
```json
{
  "audit_firm": "string",
  "audit_start_date": "date",
  "audit_end_date": "date",
  "audit_report_hash": "string (SHA-256)",
  "findings": [
    {
      "finding_id": "string",
      "severity": "enum: critical | high | medium | low | informational",
      "description": "text",
      "remediated": "boolean",
      "remediation_date": "date | null",
      "remediation_description": "text | null"
    }
  ],
  "critical_findings_count": "integer",
  "high_findings_count": "integer",
  "all_critical_high_remediated": "boolean",
  "re_audit_required": "boolean",
  "re_audit_completed": "boolean",
  "re_audit_date": "date | null",
  "clean_report_obtained": "boolean",
  "audit_cost": "decimal"
}
```

**Sources/Links:**
- OpenZeppelin: https://www.openzeppelin.com/security-audits
- CertiK: https://www.certik.com
- Quantstamp: https://quantstamp.com
- QuillAudits: https://www.quillaudits.com
- Trail of Bits: https://www.trailofbits.com
- OWASP Smart Contract Top 10 (2026): https://scs.owasp.org/sctop10/

**Audit Log Entries:**
- `AUDIT_ENGAGED: Smart contract audit engaged with [firm] at [timestamp].`
- `AUDIT_COMPLETED: Audit completed at [timestamp]. Findings: [critical]/[high]/[medium]/[low]/[info].`
- `FINDING_REMEDIATED: Finding [id] ([severity]) remediated at [timestamp].`
- `CLEAN_AUDIT_OBTAINED: Clean audit report obtained at [timestamp].`

**Compliance Checkpoints:**
- Independent audit firm (not affiliated with platform provider)
- All critical and high findings remediated and re-verified
- Audit report available in investor data room
- OWASP Smart Contract Top 10 (2026) coverage confirmed

**AI Automation Opportunities:**
- Automated vulnerability scanning (complementing manual audit)
- Continuous monitoring for known vulnerability patterns
- Automated OWASP checklist verification

---

### Step 3.5: Chainlink PoR Oracle Activation (Mainnet)

**Documents Required:**
- Mainnet PoR Feed Contract Address
- Oracle Integration Verification Report

**Tasks to Complete:**
- [ ] Activate PoR feed on Polygon mainnet
- [ ] Verify oracle-gated minting blocks token creation if reserves unconfirmed
- [ ] Verify feed is connected to MAINNET vault data (not testnet)
- [ ] Document the AggregatorV3Interface integration

**Data Fields to Capture:**
```json
{
  "por_mainnet_contract": "string",
  "por_mainnet_activation_date": "date",
  "por_mainnet_verified": "boolean",
  "mint_gating_mainnet_confirmed": "boolean",
  "feed_source_verified_mainnet": "boolean"
}
```

**Audit Log Entries:**
- `POR_MAINNET_ACTIVATED: Chainlink PoR activated on mainnet at [timestamp]. Contract: [address].`
- `POR_MAINNET_VERIFIED: PoR mainnet feed verified reporting real vault data at [timestamp].`

---

### Step 3.6: Mainnet Deployment

**Documents Required:**
- Live Mainnet Token Contract Address
- Configuration Review Report (independent)
- Contract Addresses Record

**Tasks to Complete:**
- [ ] FINAL parameter review: name, symbol, supply, compliance rules ALL match legal documents
- [ ] Independent reviewer (counsel + external) verifies parameters
- [ ] Deploy to Polygon mainnet
- [ ] Record all contract addresses permanently
- [ ] Verify Chainlink PoR is connected to mainnet (not testnet)
- [ ] Verify all compliance rules active on mainnet

**Data Fields to Capture:**
```json
{
  "mainnet_token_contract": "string",
  "mainnet_identity_registry": "string",
  "mainnet_compliance_contract": "string",
  "mainnet_trusted_issuers_registry": "string",
  "mainnet_claim_topics_registry": "string",
  "mainnet_identity_storage": "string",
  "deployment_date": "date",
  "deployment_tx_hash": "string",
  "deployment_block_number": "integer",
  "gas_cost": "decimal",
  "independent_review_date": "date",
  "independent_reviewer": "string",
  "parameters_match_legal_docs": "boolean",
  "por_connected_mainnet": "boolean"
}
```

**Audit Log Entries:**
- `MAINNET_DEPLOYED: Token deployed to Polygon mainnet at [timestamp]. Contract: [address]. Block: [number]. Tx: [hash].`
- `INDEPENDENT_REVIEW_PASSED: Independent parameter review passed at [timestamp]. Reviewer: [name].`

**Compliance Checkpoints:**
- Token parameters EXACTLY match PPM and Token Purchase Agreement
- Independent review documented (not self-verified)
- All 6 ERC-3643 contract addresses recorded
- PoR verified as mainnet, not testnet
- This deployment is IRREVERSIBLE

---

### GATE 6 (Platform Gate)

```json
{
  "gate_6_passed": "boolean",
  "gate_6_date": "date | null",
  "gate_6_checklist": {
    "smart_contract_audited": "boolean",
    "por_verified": "boolean",
    "token_deployed_mainnet": "boolean",
    "parameters_match_legal_docs": "boolean",
    "all_compliance_rules_active": "boolean"
  }
}
```

---

## PHASE 4: DISTRIBUTION (Path-Specific)

**Coverage:** portal-data.ts Steps 4.1-4.10 with Gate G7.

---

### Step 4.1: Form D Filing

(Detailed earlier in Phase 2.8 context; this is the execution step)

**Documents Required:**
- Login.gov Account Credentials
- EDGAR CIK Number
- Filed Form D
- Filing Confirmation Receipt

**Tasks to Complete:**
- [ ] Create Login.gov account with MFA (required since EDGAR Next, Sept 2025)
- [ ] Submit Form ID to obtain EDGAR CIK number (requires notarized auth document)
- [ ] Prepare all Form D information offline FIRST (1-hour timeout on EDGAR)
- [ ] Complete Form D online: issuer identity, principal place of business, related persons, industry group, issuer size, exemption (Rule 506(c)), filing type, duration, securities type, minimum investment, sales compensation, offering amounts, investor counts
- [ ] File within 15 calendar days of first sale (or in advance)
- [ ] Record filing confirmation

**Data Fields to Capture:**
```json
{
  "edgar_cik_number": "string",
  "login_gov_account_created": "boolean",
  "form_d_filed": "boolean",
  "form_d_filing_date": "date",
  "form_d_filing_number": "string",
  "exemption_claimed": "rule_506_c",
  "total_offering_amount": "decimal",
  "minimum_investment": "decimal",
  "first_sale_date": "date | null",
  "annual_amendment_due_date": "date | null"
}
```

**Sources/Links:**
- Login.gov: https://login.gov
- EDGAR: https://www.sec.gov/edgar
- Form D instructions: https://www.sec.gov/about/forms/formd.pdf
- EDGAR CIK: https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany

**Audit Log Entries:**
- `FORM_D_FILED: Form D filed with SEC via EDGAR at [timestamp]. Filing #[number]. CIK: [cik].`

**Compliance Checkpoints:**
- Filed within 15 days of first sale
- Exemption checked as "Rule 506(c)" specifically
- Number of non-accredited investors = ZERO
- Annual amendment calendar set

---

### Step 4.2: Blue Sky State Filings

**Documents Required:**
- State Notice Filings (per state)
- Filing Confirmation Receipts
- Tracking Spreadsheet (state, filing date, renewal date, fee paid)

**Tasks to Complete:**
- [ ] Identify states where investors reside
- [ ] File in NEW YORK BEFORE first sale (unique pre-filing requirement)
- [ ] File in RHODE ISLAND 10 days before first sale
- [ ] File in all other applicable states within 15 days of first sale
- [ ] Most states via Electronic Filing Depository (EFD) via NASAA
- [ ] NEW YORK and FLORIDA: manual/direct submissions (do not use EFD)
- [ ] Track renewal dates for annual renewals
- [ ] File in additional states as new-state investors close

**Data Fields to Capture:**
```json
{
  "blue_sky_filings": [
    {
      "state": "string",
      "filing_date": "date",
      "filing_method": "enum: efd | manual",
      "fee_paid": "decimal",
      "confirmation_number": "string",
      "renewal_date": "date",
      "pre_filing_required": "boolean",
      "pre_filing_completed": "boolean | null"
    }
  ],
  "total_states_filed": "integer",
  "total_blue_sky_cost": "decimal"
}
```

**Sources/Links:**
- NASAA EFD: https://www.nasaa.org/industry-resources/electronic-filing/
- BlueSkyComply: https://www.blueskycomply.com

**Audit Log Entries:**
- `BLUE_SKY_FILED: Blue sky notice filed in [state] at [timestamp]. Fee: $[amount]. Confirmation: [number].`

**Compliance Checkpoints:**
- NY filed BEFORE any NY investor sale
- All states filed within 15 days of first sale in that state
- Renewal dates tracked

---

### Step 4.3: Investor Marketing (506(c))

**Documents Required:**
- Marketing Materials (all reviewed by counsel)
- Data Room (live)
- Marketing Deck
- One-Pager
- Email Templates
- Risk Disclosure Text
- Marketing Materials Archive (retain all materials used)

**Tasks to Complete:**
- [ ] Build secure investor data room with all documents
- [ ] Create marketing deck (counsel-reviewed)
- [ ] Create one-pager (counsel-reviewed)
- [ ] Create email templates (counsel-reviewed)
- [ ] All materials include standard disclaimers
- [ ] All materials consistent with PPM
- [ ] Securities counsel approves all materials before distribution
- [ ] Begin targeted outreach to accredited investors
- [ ] Archive all marketing materials used in the offering

**Data Fields to Capture:**
```json
{
  "data_room_url": "string",
  "data_room_provider": "string",
  "marketing_materials": [
    {
      "material_type": "enum: deck | one_pager | email | ad | social | website | webinar | other",
      "material_name": "string",
      "counsel_reviewed": "boolean",
      "counsel_review_date": "date | null",
      "distribution_date": "date | null",
      "material_hash": "string (SHA-256)"
    }
  ],
  "marketing_budget_monthly": "decimal",
  "bd_engaged": "boolean",
  "bd_name": "string | null",
  "bd_commission_rate": "decimal | null"
}
```

**Audit Log Entries:**
- `MARKETING_MATERIAL_APPROVED: [material_type] "[material_name]" approved by counsel at [timestamp].`
- `DATA_ROOM_LIVE: Investor data room live at [timestamp]. URL: [url].`

**Compliance Checkpoints:**
- EVERY marketing material reviewed by counsel before distribution
- Disclaimers included on all materials
- No false/misleading statements, guaranteed returns, or SEC approval claims
- Materials consistent with PPM (inconsistencies = fraud exposure)
- Complete archive maintained (SEC may request)

---

### Step 4.4: Investor KYC & Accreditation

**Documents Required (per investor):**
- KYC Verification Report
- Accredited Investor Verification (self-cert letter or third-party letter)
- OFAC/Sanctions Screening Results
- Government-Issued ID
- Subscription Agreement (signed)
- PPM Acknowledgment

**Tasks to Complete (per investor):**
- [ ] Investor completes KYC verification
- [ ] Investor passes OFAC/SDN sanctions screening
- [ ] Verify accredited investor status:
  - For $200K+ investments: self-certification with written representation (per March 2025 SEC no-action letter)
  - For lower amounts: traditional verification (tax returns, net worth docs, professional cert, or third-party letter)
- [ ] Investor reviews PPM (documented acknowledgment)
- [ ] Investor signs Subscription Agreement
- [ ] Wire funds to SPV escrow account (NOT to PleoChrome directly)

**Data Fields to Capture (per investor):**
```json
{
  "investor_id": "uuid",
  "investor_name": "string",
  "investor_type": "enum: natural_person | entity",
  "investor_state": "string",
  "investor_country": "string (ISO 3166)",
  "kyc_status": "enum: pending | cleared | failed",
  "kyc_date": "date",
  "kyc_provider": "string",
  "ofac_screening_date": "date",
  "ofac_screening_result": "enum: clear | match",
  "accreditation_method": "enum: self_certification_200k | income_verification | net_worth_verification | professional_cert | third_party_letter",
  "accreditation_date": "date",
  "accreditation_verification_provider": "string | null",
  "self_cert_investment_not_financed": "boolean | null",
  "ppm_acknowledgment_date": "date",
  "subscription_agreement_date": "date",
  "subscription_agreement_hash": "string (SHA-256)",
  "investment_amount": "decimal",
  "wire_date": "date | null",
  "wire_confirmed": "boolean",
  "wallet_address": "string",
  "wallet_whitelisted": "boolean",
  "tokens_minted": "boolean",
  "tokens_minted_date": "date | null",
  "token_count": "integer | null",
  "blue_sky_filed_for_state": "boolean"
}
```

**Sources/Links:**
- VerifyInvestor: https://verifyinvestor.com
- InvestReady: https://investready.com
- SEC March 2025 no-action letter: https://www.sec.gov/corpfin/no-action (search for verification)
- Parallel Markets: https://parallelmarkets.com

**Audit Log Entries:**
- `INVESTOR_KYC_CLEARED: Investor [name] KYC cleared via [provider] at [timestamp].`
- `INVESTOR_ACCREDITATION_VERIFIED: Investor [name] accreditation verified via [method] at [timestamp].`
- `INVESTOR_SANCTIONS_CLEARED: Investor [name] sanctions screening clear at [timestamp].`
- `SUBSCRIPTION_RECEIVED: Subscription agreement received from [name] for $[amount] at [timestamp].`
- `WIRE_CONFIRMED: Wire of $[amount] confirmed from [name] at [timestamp].`
- `TOKENS_MINTED: [count] tokens minted to [wallet_address] for investor [name] at [timestamp]. Tx: [hash].`

**Compliance Checkpoints:**
- EVERY purchaser is a verified accredited investor (no exceptions under 506(c))
- Self-certification valid only at $200K+ with written representation that investment is not third-party financed
- Issuer has no information suggesting representation is false
- OFAC screening completed for every investor
- PPM review documented
- Funds go to SPV, not PleoChrome
- Documentation retained minimum 5 years

**AI Automation Opportunities:**
- Automated investor onboarding flow (KYC -> accreditation -> subscription -> minting)
- AI-powered accreditation document verification
- Real-time sanctions screening automation
- Automated wallet whitelisting upon all checks cleared

---

### Step 4.5: Subscription Processing & Token Minting

See data fields above in 4.4. This is the execution of subscription processing after verification.

**Additional Tasks:**
- [ ] Compliance review on each subscription
- [ ] Confirm wire received in SPV escrow account
- [ ] PleoChrome success fee (1.5%) calculated and collected
- [ ] Tokens minted to investor's whitelisted wallet
- [ ] Oracle verifies reserves before mint (Chainlink PoR)
- [ ] Token minting transaction confirmed on-chain

---

### Step 4.6: Cap Table Update

**Documents Required:**
- Updated Cap Table (on-chain and off-chain reconciled)
- Transfer Agent Records Update
- Investor Confirmation

**Tasks to Complete:**
- [ ] Transfer agent records updated with new investor
- [ ] On-chain and off-chain cap tables reconciled
- [ ] Investor receives confirmation of token receipt
- [ ] BD files Form 5123 with FINRA within 15 days of first sale (if BD engaged)

**Data Fields to Capture:**
```json
{
  "cap_table_last_updated": "date",
  "total_investors": "integer",
  "total_tokens_minted": "integer",
  "total_capital_raised": "decimal",
  "on_chain_off_chain_reconciled": "boolean",
  "reconciliation_date": "date",
  "form_5123_filed": "boolean | null",
  "form_5123_date": "date | null"
}
```

**Audit Log Entries:**
- `CAP_TABLE_UPDATED: Cap table updated at [timestamp]. Total investors: [count]. Total raised: $[amount].`
- `RECONCILIATION_COMPLETED: On-chain/off-chain cap table reconciliation completed at [timestamp]. Match: [yes/no].`

**Compliance Checkpoints:**
- On-chain token ownership matches transfer agent records exactly
- BD FINRA Form 5123 filed within 15 days (if applicable)

---

### Step 4.7-4.10: Ongoing Reporting, Secondary Transfers, Redemption/Exit

These are covered in the Ongoing Management section below.

---

### GATE 7 (Offering Gate)

```json
{
  "gate_7_passed": "boolean",
  "gate_7_date": "date | null",
  "gate_7_checklist": {
    "form_d_filed": "boolean",
    "blue_sky_notices_submitted": "boolean",
    "investor_pipeline_operational": "boolean",
    "first_subscription_processed": "boolean",
    "first_tokens_minted": "boolean"
  }
}
```

---

## ONGOING MANAGEMENT

### Quarterly Tasks

| Task | Data Fields | Audit Log |
|------|------------|-----------|
| Investor Reporting (NAV, custody, insurance, market) | `quarterly_report_date`, `nav_per_token`, `custody_verified`, `insurance_verified` | `QUARTERLY_REPORT_DISTRIBUTED: Q[quarter] [year] report distributed to [count] investors at [timestamp].` |
| Sanctions Re-Screening (ALL investors + holders) | `quarterly_screening_date`, `all_investors_screened`, `any_matches` | `QUARTERLY_SANCTIONS_SCREENING: [count] persons screened at [timestamp]. Result: [all_clear / match_found].` |
| Chainlink PoR Verification | `por_verified_date`, `por_status` | `POR_QUARTERLY_CHECK: PoR feed verified at [timestamp]. Status: [active/degraded/manual_fallback].` |

### Annual Tasks

| Task | Data Fields | Audit Log |
|------|------------|-----------|
| Re-Appraisal (minimum 1 USPAP) | `annual_appraisal_date`, `updated_value`, `appraiser` | `ANNUAL_REAPPRAISAL: Asset reappraised at [timestamp]. Value: $[value]. Change: [pct]%.` |
| Form D Amendment | `form_d_amendment_date`, `amendment_number` | `FORM_D_AMENDED: Annual Form D amendment filed at [timestamp].` |
| Blue Sky Renewals | `renewal_dates`, `fees_paid` | `BLUE_SKY_RENEWED: [count] state renewals filed at [timestamp].` |
| K-1 Tax Distribution (by March 15) | `k1_distribution_date`, `investor_count` | `K1_DISTRIBUTED: K-1 forms distributed to [count] investors at [timestamp].` |
| Form 1065 SPV Tax Return | `form_1065_date` | `FORM_1065_FILED: SPV tax return filed at [timestamp].` |
| Independent Compliance Audit | `audit_date`, `auditor`, `findings` | `COMPLIANCE_AUDIT_COMPLETED: Annual audit completed by [auditor] at [timestamp]. Findings: [count].` |
| AML Training (all team members) | `training_date`, `attendees` | `AML_TRAINING_COMPLETED: Annual AML training completed at [timestamp]. Attendees: [list].` |
| Wyoming Annual Report | `annual_report_date`, `fee_paid` | `WYOMING_ANNUAL_REPORT_FILED: Filed at [timestamp]. Fee: $[amount].` |
| Insurance Renewal | `renewal_dates`, `premiums` | `INSURANCE_RENEWED: [count] policies renewed at [timestamp].` |

### Event-Driven Tasks

| Trigger | Task | Audit Log |
|---------|------|-----------|
| Secondary transfer request | ERC-3643 compliance check (automated), transfer agent update, cap table reconciliation | `SECONDARY_TRANSFER: [count] tokens transferred from [wallet_a] to [wallet_b] at [timestamp]. Tx: [hash].` |
| Material change in offering | Form D amendment "as soon as practicable" | `MATERIAL_CHANGE_AMENDMENT: Form D amended for material change at [timestamp]. Change: [description].` |
| New state investor | Blue sky filing in new state | `NEW_STATE_FILING: Blue sky notice filed in [state] for new investor at [timestamp].` |
| Asset sale / offering close | Token burn, proceeds distribution, SPV dissolution, final K-1, UCC termination | `OFFERING_CLOSED: Offering closed at [timestamp]. Total raised: $[amount]. Tokens burned: [count].` |
| Investor accreditation expiry | Re-verification or freeze tokens | `ACCREDITATION_EXPIRY_ALERT: Investor [name] accreditation expires [date]. Action required.` |

---

## MISSING STEPS

The following steps are NOT covered in the current workflow but SHOULD be, based on industry best practices and regulatory requirements identified through web research:

### MISSING 1: Bad Actor Background Checks (Rule 506(d))

**Status in current docs:** Mentioned in the PPM section and SEC-COMPLIANCE-RESEARCH.md but NOT a standalone step with its own checklist in the workflow.

**Why it matters:** Rule 506(d) disqualifies the ENTIRE offering if any covered person has a disqualifying event. This is not just a PPM section -- it must be a hard gate.

**Recommended insertion:** Step 2.8b -- between PPM drafting and final legal document package.

**Covered persons to check:**
- Directors, executive officers, other officers participating in the offering
- General partners, managing members
- Shareholders with >20% ownership
- Promoters
- Anyone compensated for soliciting investors (placement agents, finders)

**Disqualifying events (5-year lookback for issuers, 10-year for others):**
- Criminal conviction related to securities
- Court injunction/restraining order related to securities
- Final order from state securities regulator, banking regulator, NCUA, insurance regulator
- SEC disciplinary order
- SEC cease-and-desist order
- Suspension/expulsion from SRO membership
- SEC stop order or refusal order
- US Postal Service false representation order

**Data Fields:**
```json
{
  "bad_actor_checks": [
    {
      "covered_person_name": "string",
      "role": "string",
      "check_date": "date",
      "check_provider": "string",
      "lookback_years": "integer",
      "result": "enum: clear | disqualifying_event | pre_rule_event",
      "event_description": "text | null",
      "waiver_sought": "boolean | null",
      "disclosure_to_investors": "boolean | null"
    }
  ]
}
```

---

### MISSING 2: Investor Accreditation Re-Verification Schedule

**Status in current docs:** Initial verification covered; re-verification NOT addressed.

**Why it matters:** Accredited investor status is point-in-time. Investors can lose accredited status. For ongoing compliance, particularly with secondary transfers, the issuer should have a re-verification cadence.

**Recommended insertion:** Ongoing Management section.

**Data Fields:**
```json
{
  "investor_reverification_schedule": "enum: annual | biennial | at_transfer",
  "last_reverification_date": "date",
  "next_reverification_due": "date",
  "reverification_result": "enum: confirmed | failed | pending"
}
```

---

### MISSING 3: Investor Wallet Setup and Security Guidance

**Status in current docs:** Wallet addresses mentioned but no dedicated step for investor wallet setup.

**Why it matters:** Many accredited investors in a $10-18M gemstone offering are traditional HNW individuals who may never have used a crypto wallet. Without dedicated onboarding, this becomes a major friction point.

**Recommended insertion:** Step 4.3b -- between marketing and KYC/accreditation.

**Tasks:**
- [ ] Provide wallet setup guide (MetaMask or Brickken integrated wallet)
- [ ] Offer live support for wallet creation
- [ ] Verify investor controls their private key
- [ ] Test small transaction to verify wallet functionality
- [ ] Document wallet address for whitelisting

---

### MISSING 4: Escrow Structure and Release Conditions

**Status in current docs:** Brickken escrow mentioned in BLOCKCHAIN-TOKENIZATION-DEEP-DIVE.md but NOT a standalone step with conditions.

**Why it matters:** Investor funds held in escrow need clear release conditions. If soft cap is not met, automatic refund must be documented and tested.

**Recommended insertion:** Step 3.1b -- during platform configuration.

**Data Fields:**
```json
{
  "escrow_type": "enum: smart_contract | bank_escrow | hybrid",
  "escrow_contract_address": "string | null",
  "escrow_bank_account": "string | null",
  "soft_cap": "decimal",
  "hard_cap": "decimal",
  "escrow_release_conditions": "text",
  "auto_refund_if_soft_cap_missed": "boolean",
  "escrow_deadline": "date | null"
}
```

---

### MISSING 5: Disaster Recovery and Business Continuity Plan

**Status in current docs:** Not addressed.

**Why it matters:** Regulators and institutional investors expect a documented plan for: Brickken platform failure, vault catastrophe (fire, theft, natural disaster), key person incapacitation, smart contract exploit.

**Recommended insertion:** Phase 0 addition -- Step 0.7.

**Data Fields:**
```json
{
  "dr_plan_date": "date",
  "dr_plan_hash": "string (SHA-256)",
  "platform_migration_plan": "boolean",
  "vault_contingency_plan": "boolean",
  "key_person_succession_plan": "boolean",
  "smart_contract_incident_response": "boolean",
  "last_dr_test_date": "date | null"
}
```

---

### MISSING 6: Investor Communication Cadence and Templates

**Status in current docs:** Quarterly reporting mentioned but no formal communication plan.

**Why it matters:** Consistent, professional investor communications build trust and are a competitive differentiator for a novel asset class.

**Recommended insertion:** Step 4.3c and Ongoing Management.

---

### MISSING 7: Secondary Market Liquidity Plan

**Status in current docs:** Step 4.9 mentions ATS and secondary transfer facilitation but lacks detail on how secondary liquidity is actually provided.

**Why it matters:** One of tokenization's key value propositions is liquidity. Without a concrete plan for secondary market access, the tokenization premium is undermined.

**Recommended insertion:** Expanded Step 4.9 with ATS partnership details, Rialto Markets integration, and liquidity provision strategy.

**Data Fields:**
```json
{
  "ats_partner": "string | null",
  "ats_contract_date": "date | null",
  "ats_setup_cost": "decimal | null",
  "ats_transaction_fee_rate": "decimal | null",
  "secondary_trading_live": "boolean",
  "secondary_trading_start_date": "date | null"
}
```

---

### MISSING 8: FINRA Filing (Form 5123) Detail

**Status in current docs:** Mentioned in passing but no dedicated step.

**Why it matters:** If a BD is engaged, Form 5123 must be filed with FINRA within 15 calendar days of first sale. Missing this is a FINRA violation.

**Data Fields:**
```json
{
  "finra_form_5123_required": "boolean",
  "finra_form_5123_filed": "boolean | null",
  "finra_form_5123_date": "date | null",
  "finra_filing_fee": "decimal | null"
}
```

---

### MISSING 9: Tax Counsel Engagement (Separate from Securities Counsel)

**Status in current docs:** Tax opinion mentioned as part of PPM but no standalone engagement step for tax counsel.

**Why it matters:** Gemstones are classified as collectibles for tax purposes, triggering a 28% long-term capital gains rate instead of the standard 20%. This requires specialized tax analysis beyond what securities counsel typically provides. UBTI considerations for tax-exempt investors and FIRPTA withholding for foreign investors also require dedicated tax expertise.

**Data Fields:**
```json
{
  "tax_counsel_engaged": "boolean",
  "tax_counsel_firm": "string | null",
  "tax_opinion_date": "date | null",
  "collectibles_tax_treatment_documented": "boolean",
  "ubti_analysis_completed": "boolean",
  "firpta_analysis_completed": "boolean"
}
```

---

### MISSING 10: Reg S Parallel Offering (International Investors)

**Status in current docs:** Not addressed.

**Why it matters:** Form D allows claiming multiple exemptions (e.g., Rule 506(c) + Regulation S). For a $10-18M offering, international accredited investors could significantly expand the investor pool. Reg S governs sales to non-US persons outside the US.

**Recommended insertion:** Step 4.1b -- parallel to domestic Form D filing.

**Data Fields:**
```json
{
  "reg_s_parallel_offering": "boolean",
  "reg_s_jurisdictions": "string[]",
  "reg_s_counsel_engaged": "boolean",
  "reg_s_restrictions_documented": "boolean"
}
```

---

## DATA SCHEMA SUMMARY

### Master Asset Record (Top-Level)

```json
{
  "asset_id": "uuid (primary key)",
  "asset_name": "string",
  "asset_type": "string",
  "value_path": "tokenization",
  "current_phase": "integer (0-4)",
  "current_step": "string (e.g., '2.4')",
  "status": "enum: active | paused | completed | terminated",
  "created_date": "date",
  "last_updated": "timestamp",

  "phase_0": { /* Foundation fields */ },
  "phase_1": { /* Acquisition fields (Steps 1.1-1.8, Gates G1-G2) */ },
  "phase_2": { /* Preparation fields (Steps 2.1-2.10, Gates G3-G5) */ },
  "phase_3": { /* Tokenization fields (Steps 3.1-3.6, Gate G6) */ },
  "phase_4": { /* Distribution fields (Steps 4.1-4.10, Gate G7) */ },
  "ongoing": { /* Ongoing management fields */ },

  "audit_log": [ /* Array of all audit log entries */ ],
  "documents": [ /* Array of all document references with hashes */ ],
  "investors": [ /* Array of all investor records */ ],
  "gates": { /* All gate pass/fail statuses */ },

  "financial_summary": {
    "total_costs_incurred": "decimal",
    "total_revenue_collected": "decimal",
    "net_position": "decimal",
    "setup_fee_collected": "boolean",
    "success_fees_total": "decimal",
    "admin_fees_total": "decimal"
  }
}
```

### Total Unique Data Fields Across All Steps: ~350+
### Total Document Types Required: ~65+
### Total Audit Log Event Types: ~75+
### Total Compliance Checkpoints: ~90+
### Total Tasks (Checkbox Items): ~200+

---

## SOURCES

- [SEC Rule 506 of Regulation D](https://www.investor.gov/introduction-investing/investing-basics/glossary/rule-506-regulation-d)
- [SEC March 2025 No-Action Letter on 506(c) Verification](https://www.sec.gov/corpfin/no-action)
- [SEC Statement on Tokenized Securities (Jan 28, 2026)](https://www.sec.gov/newsroom/speeches-statements/corp-fin-statement-tokenized-securities-012826)
- [FINRA 2026 Annual Regulatory Oversight Report](https://www.finra.org/sites/default/files/2025-12/2026-annual-regulatory-oversight-report.pdf)
- [ERC-3643 Official Documentation](https://docs.erc3643.org/erc-3643)
- [ERC-3643 Permissioned Tokens Standard](https://www.erc3643.org/)
- [Chainalysis Introduction to ERC-3643](https://www.chainalysis.com/blog/introduction-to-erc-3643-ethereum-rwa-token-standard/)
- [Chainlink Proof of Reserve Documentation](https://docs.chain.link/data-feeds/proof-of-reserve)
- [Chainlink BUILD Program](https://chain.link/build-program)
- [OWASP Smart Contract Top 10: 2026](https://scs.owasp.org/sctop10/)
- [RWA.io Tokenization Smart Contract Audit Checklist](https://www.rwa.io/post/tokenization-smart-contract-audit-checklist)
- [SEC Rule 506(d) Bad Actor Disqualification](https://www.sec.gov/resources-small-businesses/small-business-compliance-guides/disqualification-felons-other-bad-actors-rule-506-offerings-related-disclosure-requirements)
- [SEC Rule 144 Holding Period](https://www.sec.gov/reports/rule-144-selling-restricted-control-securities)
- [FinCEN AML for Dealers in Precious Metals and Stones](https://www.fincen.gov/system/files/guidance/faq060305.pdf)
- [FATF Guidance on DPMS AML/CFT](https://www.sanctionscanner.com/blog/cft-measures-in-precious-metals-stones-or-jewels-472)
- [OECD Due Diligence for Responsible Supply Chains](https://www.oecd.org/corporate/mne/mining.htm)
- [Legal Guide to RWA Tokenization (Buzko Krasnov)](https://www.buzko.legal/content-eng/legal-guide-to-real-world-assets-rwa-tokenization)
- [BDO Tokenization Trends 2026](https://www.bdo.com/insights/industries/fintech/trends-in-tokenization-reimagining-real-world-assets)
- [Kirkland & Ellis on SEC No-Action Letter for 506(c)](https://www.kirkland.com/publications/kirkland-aim/2025/03/sec-no-action-letter-opens-the-door-wider-on-rule-506c-offerings)
- [Reed Smith on Simplified 506(c) Verification](https://www.reedsmith.com/articles/sec-staff-simplifies-accredited-investor-verification-rule-506-offerings/)
- [SEC Recommendation on Tokenization of Equity Securities (Feb 2026)](https://www.sec.gov/files/recommendation-market-structure-subcommittee-tokenization-equity-securities-022626.pdf)
- [Sidley Austin on FINRA 2026 Report](https://www.sidley.com/en/insights/newsupdates/2025/12/finra-issues-2026-regulatory-oversight-report)
- [GIA Gem Lab Services](https://www.gia.edu/gem-lab-service/colored-stone)
- [Wyoming SOS Business Filing](https://wyobiz.wyo.gov)
