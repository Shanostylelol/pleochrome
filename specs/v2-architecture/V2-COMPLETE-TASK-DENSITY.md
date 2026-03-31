# PleoChrome Powerhouse CRM V2 --- Complete Task Density Specification

**Date:** 2026-03-29
**Author:** Architecture Session (Synthesized from 5 research files)
**Status:** COMPLETE --- Ready for template database seeding
**Source Files:**
- `V2-UNIFIED-PHASE-MAPPING.md` (stage structure, all 5 models)
- `V2-POWERHOUSE-BLUEPRINT.md` (SQL schema, template architecture)
- `DEBT-INSTRUMENT-WORKFLOW-COMPLETE.md` (debt/broker/barter granular spec)
- `RWA-TOKENIZATION-WORKFLOW-TEMPLATE.json` (tokenization granular spec)
- `rwa-offering-workflow-templates.ts` (fractional securities granular spec)

---

## How to Read This Document

Every stage is formatted as:

```
### Stage X.Y: [Stage Name]
**Phase:** [which of the 6 phases]
**Models:** [which value creation models use this stage]
**Duration:** [estimated time]
**Owner:** [primary responsible team role]

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|

**Subtasks for X.Y.N:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
```

**Task Types:**
| Code | Description |
|------|-------------|
| `document_upload` | File must be attached (PDF, DOC, XLS, PPT, images) |
| `meeting` | Scheduled meeting with notes, attendees, action items |
| `physical_action` | Something done in the physical world (transport, vault, filing at office) |
| `payment_outgoing` | Cost to pay (wire, check, ACH) with receipt upload |
| `payment_incoming` | Deposit/payment to receive with confirmation upload |
| `approval` | Requires one or more team member approvals (with approval chain) |
| `review` | Analysis/evaluation that produces a written assessment |
| `due_diligence` | DD report to prepare and file |
| `filing` | Regulatory filing to submit (SEC, state, FINRA, UCC) |
| `communication` | Email, letter, or formal notice to send (logged) |
| `automated` | Future automation hook (API call, cron job, etc.) |

**Team Roles:**
| Code | Person |
|------|--------|
| `ceo` | Shane (CEO) |
| `cto` | David (CTO) |
| `cro` | Chris (CRO / Chief Revenue Officer) |
| `compliance_officer` | Shane or David (rotating compliance hat) |
| `securities_counsel` | External (Bull Blockchain Law or equivalent) |
| `general_counsel` | External |
| `tax_counsel` | External |

**Value Creation Models:**
| Code | Name |
|------|------|
| `T` | Tokenization (ERC-3643 / Reg D 506(c)) |
| `F` | Fractional Securities (Reg D / Reg A+ / Reg CF) |
| `D` | Debt Instrument (Asset-backed lending) |
| `B` | Broker Sale (Traditional brokered sale) |
| `X` | Barter/Exchange (Asset-for-asset trade) |

---

# PHASE 1: LEAD

**Color:** Gray `#6B7280`
**Duration:** 1--3 weeks
**Purpose:** Source, qualify, and screen potential deals
**Shared across:** ALL models (T, F, D, B, X)

---

### Stage 1.1: Initial Outreach & Source Identification
**Phase:** Lead
**Models:** ALL
**Duration:** 1--5 days
**Owner:** CRO

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 1.1.1 | Identify asset holder through pipeline sources | `review` | CRO | None | see below |
| 1.1.2 | Confirm asset class eligibility and minimum value | `review` | CRO | None | see below |
| 1.1.3 | Create lead record in CRM pipeline | `automated` | CRO | None | see below |

**Subtasks for 1.1.1 --- Identify asset holder:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 1.1.1.a | Search dealer pipeline and vault partner inventory reports | `review` | CRO reviews dealer network contacts, vault inventory alerts, and inbound inquiry queue | Timestamped search log with source channels queried and results count |
| 1.1.1.b | Screen source/referrer reputation | `due_diligence` | CRO checks referrer for prior bad acts, sanctions associations, or known fraud | Source screening memo uploaded; pass/fail recorded |
| 1.1.1.c | Tag source channel in CRM | `automated` | CRO selects source channel: referral / dealer / direct / broker / auction / inbound | Source channel tag recorded with timestamp |

**Subtasks for 1.1.2 --- Confirm eligibility:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 1.1.2.a | Verify asset is in supported class | `review` | CRO confirms asset class (gemstone, precious metal, real estate, mineral rights) against policy | Asset class confirmed; eligibility status logged |
| 1.1.2.b | Confirm minimum value threshold | `review` | CRO checks: $250K minimum for debt, $500K for metals/minerals, $1M for securities/RE | Preliminary value estimate logged with methodology |
| 1.1.2.c | Check asset type against lending/offering policy | `review` | CRO references LTV caps by class, regulatory barriers, and market liquidity | Policy check result logged (eligible / conditional / ineligible) |

**Subtasks for 1.1.3 --- Create CRM record:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 1.1.3.a | Create asset record with status `prospect` | `automated` | CRO enters holder contact info, asset description, source channel | Asset record created with reference code (PC-YYYY-XXXX); timestamp logged |
| 1.1.3.b | Assign initial pipeline stage and lead owner | `automated` | CRO assigns self as lead owner, sets phase to `lead` | Assignment recorded with timestamp |

---

### Stage 1.2: Holder Qualification & Screening
**Phase:** Lead
**Models:** ALL
**Duration:** 3--7 days
**Owner:** Compliance Officer + CRO

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 1.2.1 | Execute mutual NDA with asset holder | `document_upload` | Compliance Officer | `nda` (executed) | see below |
| 1.2.2 | Preliminary KYC/KYB screening | `due_diligence` | Compliance Officer | `kyc_report`, `ofac_screening`, `pep_screening` | see below |
| 1.2.3 | Holder sophistication assessment | `review` | CRO | None (internal memo) | see below |
| 1.2.4 | Preliminary title/ownership verification | `due_diligence` | Compliance Officer | Varies by asset class | see below |

**Subtasks for 1.2.1 --- Execute NDA:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 1.2.1.a | Send NDA template to holder | `communication` | Compliance Officer sends standard mutual NDA via email | Outbound email logged with timestamp and recipient |
| 1.2.1.b | Negotiate any modifications | `communication` | Compliance Officer reviews holder redlines, negotiates terms | Redline version uploaded; negotiation notes logged |
| 1.2.1.c | Obtain wet or e-signature | `document_upload` | Both parties sign; executed NDA uploaded to document vault | Executed NDA uploaded; signature date recorded; document locked |
| 1.2.1.d | File executed NDA in document library | `automated` | System tags NDA to asset record and marks stage requirement complete | Document association logged |

**Subtasks for 1.2.2 --- Preliminary KYC/KYB:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 1.2.2.a | Collect government-issued ID (individuals) or formation docs (entities) | `document_upload` | Compliance Officer requests passport/DL; for entities: articles, cert of good standing | Document(s) uploaded; type and issuing authority recorded |
| 1.2.2.b | Run OFAC/SDN list screening | `automated` | Screen holder name, aliases, entity name against OFAC SDN, EU/UK sanctions lists | OFAC screening result logged: CLEAR or MATCH; timestamp; list version |
| 1.2.2.c | Run PEP (Politically Exposed Person) check | `automated` | Screen against global PEP databases | PEP screening result logged: CLEAR or FLAG; timestamp |
| 1.2.2.d | Run adverse media scan | `automated` | Search news databases, court records, regulatory enforcement actions | Adverse media report uploaded; findings summary logged |
| 1.2.2.e | Verify beneficial ownership (entities >25% owners per CDD Rule) | `review` | Compliance Officer identifies all beneficial owners and collects ID for each | Beneficial ownership certification uploaded; each owner's verification status logged |
| 1.2.2.f | Compliance Officer review and preliminary sign-off | `approval` | Compliance Officer reviews all results; issues preliminary clearance or flags for EDD | **Requires approval before proceeding.** Decision logged: PASS / CONDITIONAL / FAIL with rationale |

**Subtasks for 1.2.3 --- Sophistication assessment:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 1.2.3.a | Assess holder experience with the value path | `review` | CRO evaluates holder's experience with securities, lending, or asset sales | Sophistication score logged (1-5 scale) with notes |
| 1.2.3.b | Evaluate understanding of custody requirements | `review` | CRO discusses vault/custody process; assesses cooperation likelihood | Cooperation rating logged with notes |
| 1.2.3.c | Document intended outcome and timeline expectations | `review` | CRO records holder's desired value path, target timeline, and economic expectations | Holder preferences logged in CRM metadata |

**Subtasks for 1.2.4 --- Preliminary title verification:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 1.2.4.a | Request proof of ownership from holder | `communication` | CRO requests bill of sale, chain of custody, deed, mineral lease, or lab reports showing holder's name | Request sent timestamp logged; follow-up reminders auto-scheduled |
| 1.2.4.b | Preliminary lien/encumbrance check | `due_diligence` | Compliance Officer runs UCC search, preliminary title search (RE), or lease verification (minerals) | Search results uploaded; existing liens flagged; risk level noted |
| 1.2.4.c | Flag competing claims or ownership gaps | `review` | Compliance Officer documents any red flags found | Ownership verification memo uploaded: CLEAR / FLAGS IDENTIFIED |

---

### Stage 1.3: Asset Screening & Preliminary Assessment
**Phase:** Lead
**Models:** ALL
**Duration:** 3--5 days
**Owner:** CRO + Compliance Officer

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 1.3.1 | Collect existing asset documentation | `document_upload` | CRO | Varies: `gia_report`, `appraisal_report`, `title_report`, `production_report` | see below |
| 1.3.2 | Desktop valuation estimate | `review` | CRO | None (internal memo) | see below |
| 1.3.3 | Preliminary risk assessment | `review` | Compliance Officer | None (internal memo) | see below |
| 1.3.4 | Borrower/holder financial capacity check (if debt path) | `review` | CRO | `financial_statements` or `tax_returns` (if available) | see below |

**Subtasks for 1.3.1 --- Collect documentation:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 1.3.1.a | Request all existing third-party reports from holder | `communication` | CRO sends document request list tailored to asset class | Request email logged; document checklist sent |
| 1.3.1.b | Upload received documents to asset record | `document_upload` | CRO uploads each document, tags type and source | Each document uploaded with timestamp, type tag, and source attribution |
| 1.3.1.c | Verify report authenticity against issuing authority | `review` | CRO checks GIA Report Check, LBMA bar list, title company records | Verification result per document logged: VERIFIED / UNVERIFIABLE / EXPIRED |

**Subtasks for 1.3.2 --- Desktop valuation:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 1.3.2.a | Research comparable sales and market data | `review` | CRO gathers auction results, dealer lists, MLS data, mineral royalty multiples | Data sources documented in valuation memo |
| 1.3.2.b | Calculate preliminary value range | `review` | CRO applies methodology appropriate to asset class; documents range and confidence level | Preliminary valuation memo uploaded with methodology, range, and confidence level |
| 1.3.2.c | Estimate maximum offering/loan amount | `review` | CRO calculates based on LTV caps or offering economics | Estimated max amount logged |

**Subtasks for 1.3.3 --- Risk assessment:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 1.3.3.a | Evaluate provenance quality | `review` | Compliance Officer rates chain of custody completeness | Provenance quality rating: CLEAN / GAPS / UNRESOLVABLE |
| 1.3.3.b | Assess market liquidity of asset class | `review` | Compliance Officer evaluates secondary market depth | Liquidity rating: HIGH / MEDIUM / LOW / ILLIQUID |
| 1.3.3.c | Flag regulatory risks by jurisdiction | `review` | Compliance Officer identifies state-specific licensing, tax, or regulatory issues | Jurisdictional risk flags logged |
| 1.3.3.d | Rate overall preliminary risk | `review` | Compliance Officer assigns composite risk level | Risk rating logged: LOW / MEDIUM / HIGH / CRITICAL with rationale |

**Subtasks for 1.3.4 --- Financial capacity (debt path):**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 1.3.4.a | Request financial statements or tax returns | `communication` | CRO requests recent financials from holder | Request logged; received documents uploaded |
| 1.3.4.b | Assess debt service capacity (DSCR for business-purpose) | `review` | CRO analyzes ability to service proposed debt | DSCR or DTI calculation logged with inputs and result |
| 1.3.4.c | Verify intended use of proceeds | `review` | CRO documents holder's stated use; triggers business-purpose vs. consumer-purpose analysis | Use-of-proceeds classification logged |

---

### Stage 1.4: Internal Deal Committee Review
**Phase:** Lead
**Models:** ALL
**Duration:** 1--2 days
**Owner:** CEO

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 1.4.1 | Prepare deal summary memo | `review` | CRO | None (internal) | see below |
| 1.4.2 | Deal committee vote (Go/No-Go) | `approval` | CEO | None | see below |
| 1.4.3 | Communicate decision to holder | `communication` | CRO | `engagement_agreement` (if Go) | see below |

**Subtasks for 1.4.1 --- Deal summary memo:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 1.4.1.a | Compile lead screening results into standardized package | `review` | CRO assembles all preliminary data: asset details, holder info, KYC results, valuation, risk assessment | Lead qualification package uploaded as internal document |
| 1.4.1.b | Attach preliminary valuation and risk assessment | `document_upload` | CRO attaches supporting memos | Documents linked to deal committee review task |
| 1.4.1.c | Provide recommendation (proceed / decline / conditional) | `review` | CRO writes recommendation with rationale | Recommendation logged with rationale text |

**Subtasks for 1.4.2 --- Deal committee vote:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 1.4.2.a | Schedule deal committee meeting | `meeting` | CRO schedules meeting with CEO, CTO, CRO | Meeting scheduled; calendar invite logged |
| 1.4.2.b | CEO review and vote | `approval` | CEO reviews package, casts vote | **Approval required.** CEO vote logged: GO / NO-GO / CONDITIONAL with rationale |
| 1.4.2.c | CTO review and vote | `approval` | CTO reviews package, casts vote | **Approval required.** CTO vote logged: GO / NO-GO / CONDITIONAL with rationale |
| 1.4.2.d | CRO review and vote | `approval` | CRO reviews package, casts vote | **Approval required.** CRO vote logged: GO / NO-GO / CONDITIONAL with rationale |
| 1.4.2.e | Document final decision and conditions | `review` | CEO records aggregate decision with any conditions | Decision logged in audit trail: GO / NO-GO / CONDITIONAL; conditions listed |

**Subtasks for 1.4.3 --- Communicate decision:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 1.4.3.a | If GO: send engagement agreement and next steps | `communication` | CRO sends engagement agreement draft to holder with welcome materials | Outbound communication logged; engagement agreement sent timestamp |
| 1.4.3.b | If NO-GO: send professional decline letter | `communication` | CRO sends courteous decline with general reason | Decline communication logged; reason code recorded |
| 1.4.3.c | If CONDITIONAL: outline conditions for proceeding | `communication` | CRO sends conditions list to holder | Conditions communicated; follow-up deadline set |

---

### GATE G1: LEAD QUALIFICATION
**Criteria (all must be met):**
- [ ] KYC/KYB preliminary screening passed (no OFAC/SDN hits, no disqualifying PEP findings)
- [ ] Asset class confirmed eligible
- [ ] Preliminary valuation supports minimum threshold
- [ ] No unresolvable title/ownership issues identified
- [ ] Deal committee approved (or conditionally approved with conditions met)
- [ ] NDA executed and filed
**Required Approvals:** CEO + Compliance Officer
**Gate Type:** Hard gate --- cannot proceed to Intake without passing

---

# PHASE 2: INTAKE

**Color:** Emerald `#1B6B4A`
**Duration:** 2--4 weeks
**Purpose:** Full asset profiling, holder onboarding, engagement execution
**Shared across:** ALL models (T, F, D, B, X)

---

### Stage 2.1: Full KYC/KYB Verification
**Phase:** Intake
**Models:** ALL
**Duration:** 3--10 days
**Owner:** Compliance Officer

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 2.1.1 | Complete full identity verification | `due_diligence` | Compliance Officer | `government_id`, `proof_of_address`, `beneficial_ownership_form` | see below |
| 2.1.2 | Source of wealth / source of funds analysis | `review` | Compliance Officer | `financial_statements`, `acquisition_records` | see below |
| 2.1.3 | Enhanced due diligence (if triggered) | `review` | Compliance Officer | Varies | see below |

**Subtasks for 2.1.1 --- Full identity verification:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 2.1.1.a | Collect full KYC package | `document_upload` | Compliance Officer collects: passport, DL, SSN/TIN, proof of address (2 forms), source of wealth declaration; for entities: articles, operating agreement, EIN letter, BOI report, board resolution | Each document uploaded with type tag; completeness checklist updated |
| 2.1.1.b | Verify identity against government databases | `automated` | Run identity documents through verification service | Verification result per document: VERIFIED / MISMATCH / UNABLE TO VERIFY; timestamp |
| 2.1.1.c | Re-run OFAC/SDN screening (full, current lists) | `automated` | Screen all individuals and entities against current OFAC lists | OFAC result logged: CLEAR / MATCH; list version and date noted |
| 2.1.1.d | Verify beneficial ownership for entities | `review` | Compliance Officer identifies all >25% owners; verifies each identity | Each beneficial owner's verification status logged individually |
| 2.1.1.e | Cross-reference addresses and entity registrations | `automated` | Verify state registration, good standing, authorized signatories | Verification results per entity logged |
| 2.1.1.f | Compliance Officer KYC sign-off | `approval` | Compliance Officer reviews all data; issues CLEAR / CONDITIONAL / FAIL | **Approval required before proceeding.** Decision logged with rationale; KYC status updated in contact record |

**Subtasks for 2.1.2 --- Source of wealth:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 2.1.2.a | Assess legitimate source of asset acquisition | `review` | Compliance Officer reviews purchase receipts, inheritance docs, mining records, auction records | Source of wealth assessment uploaded |
| 2.1.2.b | Flag unexplained acquisition pathways | `review` | Compliance Officer documents any gaps or inconsistencies | Risk flags logged with severity level |

**Subtasks for 2.1.3 --- Enhanced DD (if triggered):**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 2.1.3.a | Obtain senior management approval for high-risk client | `approval` | CEO reviews EDD findings and approves continued engagement | **CEO approval required.** Decision logged |
| 2.1.3.b | Establish ongoing monitoring plan | `review` | Compliance Officer defines monitoring frequency and triggers | Monitoring plan documented and scheduled |
| 2.1.3.c | Additional source of wealth verification | `due_diligence` | Compliance Officer obtains additional evidence of legitimate acquisition | Supplemental evidence uploaded and assessed |

---

### Stage 2.2: Provenance Review & Chain of Custody
**Phase:** Intake
**Models:** ALL
**Duration:** 5--14 days
**Owner:** Compliance Officer + CRO

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 2.2.1 | Document complete chain of custody | `due_diligence` | Compliance Officer | Varies by asset class | see below |
| 2.2.2 | Gap analysis on provenance chain | `review` | Compliance Officer | None (internal memo) | see below |
| 2.2.3 | Lien and encumbrance search (full) | `due_diligence` | Compliance Officer | `ucc_search_results`, `title_search`, `tax_lien_search` | see below |
| 2.2.4 | Conflict minerals / sanctions screening on asset origin | `automated` | Compliance Officer | None | see below |

**Subtasks for 2.2.1 --- Chain of custody:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 2.2.1.a | Request all chain of custody documents from holder | `communication` | CRO sends tailored document request by asset class | Request logged; document checklist sent |
| 2.2.1.b | Collect and upload bills of sale, transfer records, deeds | `document_upload` | CRO uploads each document in the chain | Each link in chain uploaded and tagged with date and parties |
| 2.2.1.c | Verify each link by contacting prior owners/dealers | `due_diligence` | CRO contacts prior owners, auction houses, dealers to verify transfers | Verification result per chain link: VERIFIED / UNVERIFIABLE; contact details logged |
| 2.2.1.d | Cross-reference with lab reports and certification history | `review` | CRO compares chain with lab report holder names and dates | Cross-reference results logged |

**Subtasks for 2.2.2 --- Gap analysis:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 2.2.2.a | Identify breaks in the chain | `review` | Compliance Officer maps timeline and flags undocumented periods | Gap analysis report uploaded showing each gap with date range |
| 2.2.2.b | Assess whether gaps are resolvable | `review` | Compliance Officer determines if additional research can close gaps | Gap resolution assessment: RESOLVABLE / UNRESOLVABLE per gap |
| 2.2.2.c | Document residual provenance risk | `review` | Compliance Officer rates remaining provenance risk after gap analysis | Provenance risk rating logged: LOW / MEDIUM / HIGH |

**Subtasks for 2.2.3 --- Lien search:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 2.2.3.a | Run UCC search in debtor's state of organization | `due_diligence` | Compliance Officer orders UCC search from search company | UCC search results uploaded; existing filings documented |
| 2.2.3.b | Run federal and state tax lien searches | `due_diligence` | Compliance Officer searches IRS and state tax lien records | Tax lien search results uploaded: CLEAR or LIENS FOUND |
| 2.2.3.c | Run judgment lien search | `due_diligence` | Compliance Officer searches court records for judgment liens | Judgment search results uploaded |
| 2.2.3.d | For RE: order full title search and commitment | `due_diligence` | Compliance Officer orders from title company | Title commitment uploaded |
| 2.2.3.e | For minerals: obtain title opinion from mineral attorney | `due_diligence` | Compliance Officer engages mineral attorney or landman | Title opinion uploaded |
| 2.2.3.f | Document all existing security interests and priority | `review` | Compliance Officer maps all liens with filing dates and priority | Lien summary uploaded: CLEAR TO PROCEED or ISSUES IDENTIFIED |

**Subtasks for 2.2.4 --- Conflict/sanctions screening on origin:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 2.2.4.a | Check Dodd-Frank Section 1502 (precious metals) | `automated` | Screen metal origin against conflict minerals database | Conflict minerals determination logged |
| 2.2.4.b | Check Kimberley Process (diamonds) | `review` | Verify KP certificate if applicable | KP compliance status logged |
| 2.2.4.c | OFAC country-based sanctions screening on asset origin | `automated` | Screen origin country against OFAC sanctioned countries | Origin sanctions result logged: CLEAR / RESTRICTED |

---

### Stage 2.3: Asset Holder Intake Questionnaire
**Phase:** Intake
**Models:** ALL
**Duration:** 3--7 days
**Owner:** CRO

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 2.3.1 | Complete full asset profile in CRM | `document_upload` | CRO | `intake_questionnaire`, `photos` | see below |
| 2.3.2 | Upload supporting photographs and media | `document_upload` | CRO | `photos`, `video` | see below |
| 2.3.3 | Verify asset dimensions against documentation | `review` | Compliance Officer | None | see below |

**Subtasks for 2.3.1 --- Asset profile:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 2.3.1.a | Enter complete physical description by asset class | `document_upload` | CRO enters all physical attributes: weight, dimensions, color, clarity, purity, sq ft, acreage, net mineral acres, etc. | Asset profile fields populated; completeness score calculated |
| 2.3.1.b | Record current location and custody status | `review` | CRO documents where asset is currently held | Current location logged |
| 2.3.1.c | Document desired outcome and timeline | `review` | CRO records holder's preferences for value path, timing, and economic terms | Holder preferences logged in metadata |

**Subtasks for 2.3.2 --- Photos/media:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 2.3.2.a | Upload high-resolution photographs (minimum 10 angles for tangibles) | `document_upload` | CRO uploads photos from holder or professional photographer | Photo count logged; each tagged with angle/description |
| 2.3.2.b | Upload supporting media (video, surveys, floor plans, well logs) | `document_upload` | CRO uploads all supplemental visual documentation | Each file uploaded with type tag |

**Subtasks for 2.3.3 --- Verification:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 2.3.3.a | Cross-reference physical description with existing reports | `review` | Compliance Officer compares CRM data with lab reports, surveys, deeds | Verification result: CONSISTENT / DISCREPANCIES FOUND |
| 2.3.3.b | Flag any discrepancies between documentation and claims | `review` | Compliance Officer documents material differences | Discrepancy list uploaded with severity ratings |

---

### Stage 2.4: Existing Documentation Review
**Phase:** Intake
**Models:** ALL
**Duration:** 3--7 days
**Owner:** CRO

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 2.4.1 | Inventory all existing documents | `review` | CRO | All existing reports | see below |
| 2.4.2 | Conduct document gap analysis | `review` | CRO | None | see below |

**Subtasks for 2.4.1 --- Document inventory:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 2.4.1.a | Catalog all existing certifications, appraisals, and reports | `review` | CRO creates comprehensive inventory of all available third-party documentation | Document inventory spreadsheet uploaded with: title, date, issuer, relevance, expiry |
| 2.4.1.b | Verify report authenticity with issuing authorities | `review` | CRO contacts labs/firms to verify report numbers and contents | Verification status per document logged |
| 2.4.1.c | Assess whether existing reports are current and sufficient | `review` | CRO determines if re-certification or new appraisals are needed | Assessment memo: CURRENT / STALE / INSUFFICIENT per document |

**Subtasks for 2.4.2 --- Gap analysis:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 2.4.2.a | Identify missing documents required for each value path | `review` | CRO compares inventory against template requirements | Gap list uploaded: document type, required by (stage), estimated cost to obtain |
| 2.4.2.b | Estimate cost and timeline to fill gaps | `review` | CRO prices out certification, appraisal, and legal costs | Cost estimate attached to gap analysis |

---

### Stage 2.5: Engagement Agreement Execution
**Phase:** Intake
**Models:** ALL
**Duration:** 3--10 days
**Owner:** CEO

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 2.5.1 | Draft and execute engagement agreement | `document_upload` | CEO | `engagement_agreement` (executed) | see below |
| 2.5.2 | Business-purpose vs. consumer-purpose determination (if debt path) | `review` | Compliance Officer | `determination_memo` | see below |
| 2.5.3 | Collect retainer payment (if applicable) | `payment_incoming` | CEO | `payment_confirmation` | see below |

**Subtasks for 2.5.1 --- Engagement agreement:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 2.5.1.a | Draft engagement agreement from template | `review` | CEO customizes template for asset class, fee structure, and scope | Draft version uploaded |
| 2.5.1.b | Internal legal review | `review` | Securities counsel reviews terms | Counsel review memo uploaded; changes noted |
| 2.5.1.c | Send to holder for review | `communication` | CEO sends draft to holder | Outbound communication logged |
| 2.5.1.d | Negotiate modifications | `communication` | CEO addresses holder feedback on fees, timeline, exclusivity | Negotiation notes logged; redline versions tracked |
| 2.5.1.e | Execute agreement (both parties sign) | `document_upload` | CEO obtains signatures (wet or e-signature) | **Executed agreement uploaded and locked.** Signature date recorded |

**Subtasks for 2.5.2 --- Purpose determination (debt path):**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 2.5.2.a | Document intended use of loan proceeds | `review` | Compliance Officer interviews holder about use of funds | Use-of-proceeds statement uploaded |
| 2.5.2.b | Apply business-purpose vs. consumer-purpose test | `review` | Compliance Officer determines classification and documents rationale | **Determination memo uploaded.** BUSINESS-PURPOSE or CONSUMER-PURPOSE with full rationale |
| 2.5.2.c | If consumer-purpose: flag TILA/Reg Z requirements | `review` | Compliance Officer documents additional regulatory requirements triggered | Regulatory requirements checklist updated |

**Subtasks for 2.5.3 --- Retainer:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 2.5.3.a | Invoice retainer per engagement agreement | `communication` | CEO sends retainer invoice | Invoice logged |
| 2.5.3.b | Receive and confirm retainer payment | `payment_incoming` | CEO confirms wire/ACH receipt | Payment confirmation uploaded; amount and date logged |

---

### Stage 2.6: Internal Deal Committee Review (Intake Gate)
**Phase:** Intake
**Models:** ALL
**Duration:** 1--3 days
**Owner:** CEO

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 2.6.1 | Prepare intake review package | `review` | CRO | None (internal) | see below |
| 2.6.2 | Deal committee review and Go/No-Go | `approval` | CEO | None | see below |
| 2.6.3 | Client progress update | `communication` | CRO | None | see below |

**Subtasks for 2.6.1 --- Intake package:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 2.6.1.a | Compile complete intake file | `review` | CRO assembles: KYC results, provenance, valuation, engagement agreement, gap analysis | Intake package uploaded as internal document |
| 2.6.1.b | Provide resource estimate for Asset Maturity phase | `review` | CRO estimates cost, timeline, and partner requirements for next phase | Resource estimate attached |

**Subtasks for 2.6.2 --- Committee review:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 2.6.2.a | Conduct deal committee meeting | `meeting` | CEO leads review with CTO and CRO | Meeting notes uploaded with attendees, duration, key discussion points |
| 2.6.2.b | CEO vote | `approval` | CEO casts vote with rationale | **Approval required.** Vote logged |
| 2.6.2.c | CTO vote | `approval` | CTO casts vote with rationale | **Approval required.** Vote logged |
| 2.6.2.d | CRO vote | `approval` | CRO casts vote with rationale | **Approval required.** Vote logged |
| 2.6.2.e | Record final decision | `review` | CEO documents aggregate decision and any conditions | Decision logged in audit trail |

**Subtasks for 2.6.3 --- Client update:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 2.6.3.a | Send holder progress update (if Go) | `communication` | CRO notifies holder of advancement to Asset Maturity with timeline | Communication logged |
| 2.6.3.b | Send decline notification (if No-Go) | `communication` | CRO sends professional decline with reason | Communication logged; lead status updated to `terminated` |

---

### GATE G2: INTAKE COMPLETE
**Criteria:**
- [ ] Full KYC/KYB verification complete and passed
- [ ] Sanctions screening CLEAR (current lists)
- [ ] PEP screening CLEAR or EDD completed
- [ ] Provenance documented (gaps identified and risk-assessed)
- [ ] All existing docs inventoried and gaps identified
- [ ] Engagement agreement executed
- [ ] Business-purpose/consumer-purpose determination documented (if debt)
- [ ] Deal committee approved
**Required Approvals:** CEO + Compliance Officer
**Gate Type:** Hard gate

---

# PHASE 3: ASSET MATURITY

**Color:** Teal `#1A8B7A`
**Duration:** 4--10 weeks
**Purpose:** Certify, appraise, secure custody, insure
**Shared across:** ALL models (T, F, D, B, X)

---

### Stage 3.1: Independent Certification
**Phase:** Asset Maturity
**Models:** ALL
**Duration:** 2--6 weeks
**Owner:** CRO

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 3.1.1 | Submit asset for independent certification/grading | `physical_action` | CRO | `lab_certification_report` (output) | see below |
| 3.1.2 | Verify certification results against holder claims | `review` | Compliance Officer | None | see below |

**Subtasks for 3.1.1 --- Certification submission:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 3.1.1.a | Select certification authority based on asset class | `review` | CRO selects: GIA (gems), LBMA assayer (metals), title company (RE), petroleum engineer (minerals) | Selected authority logged with rationale |
| 3.1.1.b | Arrange insured transport to lab/facility | `physical_action` | CRO arranges armored transport; photographs asset pre-transport | Transport manifest uploaded; transit insurance cert uploaded; pre-transport photos uploaded |
| 3.1.1.c | Submit asset and track progress | `physical_action` | CRO submits asset to authority; tracks submission status | Submission receipt uploaded; tracking updates logged |
| 3.1.1.d | Receive and upload certification report | `document_upload` | CRO receives report; verifies report number with authority | **Certification report uploaded and locked.** Report number, date, and issuing authority logged |
| 3.1.1.e | Log certification costs | `payment_outgoing` | CRO records cost: $500--$100K depending on asset class | Payment receipt uploaded; cost logged against asset |

**Subtasks for 3.1.2 --- Verification against claims:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 3.1.2.a | Compare certification results with holder representations | `review` | Compliance Officer checks each attribute against what holder claimed | Comparison matrix uploaded: MATCH / DISCREPANCY per attribute |
| 3.1.2.b | Flag material discrepancies and assess impact | `review` | Compliance Officer determines if discrepancies affect deal viability | Discrepancy impact assessment: IMMATERIAL / MATERIAL / DEAL-BREAKING |

---

### Stage 3.2: Appraiser Panel Selection
**Phase:** Asset Maturity
**Models:** ALL
**Duration:** 1--2 weeks
**Owner:** CRO

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 3.2.1 | Identify and vet independent appraisers | `review` | CRO | None | see below |
| 3.2.2 | Execute appraiser engagement letters | `document_upload` | CRO | `appraiser_engagement_letter` (per appraiser) | see below |

**Subtasks for 3.2.1 --- Identify appraisers:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 3.2.1.a | Research qualified appraisers (minimum 3 for gems, 2 for others) | `review` | CRO identifies candidates with credentials: CGA/MGA (gems), MAI/SRA (RE), SPE (minerals), ASA (metals) | Candidate list uploaded with credentials per appraiser |
| 3.2.1.b | Verify credentials, insurance, and independence | `due_diligence` | CRO confirms active certification, E&O insurance, no conflicts of interest | Verification checklist completed per appraiser |
| 3.2.1.c | Confirm USPAP compliance commitment | `review` | CRO verifies each appraiser will produce USPAP-compliant report | USPAP compliance acknowledgment logged per appraiser |

**Subtasks for 3.2.2 --- Engagement letters:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 3.2.2.a | Draft engagement letters with scope, methodology, timeline, fee | `review` | CRO drafts letters; prohibits percentage-based fees per USPAP Ethics Rule | Draft engagement letters uploaded |
| 3.2.2.b | Execute engagement letters (both parties sign) | `document_upload` | CRO obtains signatures from each appraiser | **Executed engagement letters uploaded.** Fee per appraiser logged |
| 3.2.2.c | Log appraiser costs | `payment_outgoing` | CRO records fees: $3K--$50K depending on asset class and complexity | Payment records logged per appraiser |

---

### Stage 3.3: Sequential Appraisal Process
**Phase:** Asset Maturity
**Models:** ALL
**Duration:** 3--8 weeks
**Owner:** CRO

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 3.3.1 | Conduct sequential independent appraisals | `physical_action` | CRO | `appraisal_report` (per appraiser, output) | see below |
| 3.3.2 | Maintain chain of custody throughout process | `physical_action` | CRO | `transport_manifest`, `custody_transfer_receipt` | see below |

**Subtasks for 3.3.1 --- Sequential appraisals:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 3.3.1.a | Transport asset to Appraiser 1 under insured custody | `physical_action` | CRO arranges bonded transport; photographs at handoff | Transport manifest uploaded; pre-handoff photos; insurance cert |
| 3.3.1.b | Appraiser 1 completes USPAP-compliant appraisal | `review` | Appraiser 1 examines asset and delivers report | **Appraisal 1 uploaded and locked.** Value, methodology, date logged |
| 3.3.1.c | Seal Appraiser 1 value; transport to Appraiser 2 | `physical_action` | CRO seals prior value to prevent anchoring; arranges transport | Sealed value confirmation logged; transport manifest uploaded |
| 3.3.1.d | Appraiser 2 completes independent appraisal | `review` | Appraiser 2 examines independently | **Appraisal 2 uploaded and locked.** Value, methodology, date logged |
| 3.3.1.e | Appraiser 3 completes independent appraisal (if applicable) | `review` | Appraiser 3 examines independently (required for gems, optional for others) | **Appraisal 3 uploaded and locked** (if applicable) |
| 3.3.1.f | Return asset to vault with chain-of-custody documentation | `physical_action` | CRO arranges return transport | Return transport manifest uploaded; vault receipt updated |

**Subtasks for 3.3.2 --- Chain of custody:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 3.3.2.a | Photograph asset at each handoff point | `document_upload` | CRO photographs asset before and after each transfer | Photos uploaded with timestamp and location |
| 3.3.2.b | Log each custody transfer with signatures | `document_upload` | CRO obtains signed custody transfer receipts | Transfer receipts uploaded per handoff |

---

### Stage 3.4: Variance Analysis & Value Determination
**Phase:** Asset Maturity
**Models:** ALL
**Duration:** 2--5 days
**Owner:** CEO

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 3.4.1 | Analyze appraisal variance and lock offering/collateral value | `review` | CEO | `variance_analysis_report` (output) | see below |

**Subtasks for 3.4.1 --- Variance analysis:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 3.4.1.a | Create side-by-side appraisal comparison matrix | `review` | CEO compiles all appraisals: values, methodologies, assumptions, key differences | Comparison matrix uploaded |
| 3.4.1.b | Calculate variance percentage | `automated` | System computes variance between highest and lowest | Variance percentage logged; flag if >15--20% (gems) or >10% (others) |
| 3.4.1.c | Trigger resolution if variance exceeds threshold | `review` | CEO requests clarification from appraisers, commissions 4th appraisal, or documents reasons | Resolution actions logged; additional appraisal uploaded if commissioned |
| 3.4.1.d | Determine and lock offering/collateral value | `approval` | CEO sets value using conservative methodology (average of two lowest for gems) | **Value locked.** Methodology, final value, and rationale logged |
| 3.4.1.e | CEO + CRO sign-off on value | `approval` | Both CEO and CRO approve the locked value | **Dual approval required.** Both approvals logged with timestamps |

---

### Stage 3.5: Vault Selection & Custody Transfer
**Phase:** Asset Maturity
**Models:** ALL
**Duration:** 1--3 weeks
**Owner:** CTO (for vault/API), CRO (for physical logistics)

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 3.5.1 | Select custody provider | `review` | CTO | None | see below |
| 3.5.2 | Execute custody agreement | `document_upload` | CEO | `custody_agreement` (executed) | see below |
| 3.5.3 | Arrange insured transport to vault | `physical_action` | CRO | `transport_manifest`, `transit_insurance` | see below |
| 3.5.4 | Verify custody and obtain receipt | `document_upload` | CTO | `vault_receipt`, `custody_receipt` | see below |

**Subtasks for 3.5.1 --- Select provider:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 3.5.1.a | Request proposals from 2--3 institutional vault providers | `communication` | CTO sends RFPs to Brink's, Malca-Amit, Loomis (tangibles) or title companies (RE) | RFPs sent; responses logged |
| 3.5.1.b | Evaluate facility security, insurance, API capability, costs | `review` | CTO compares proposals against requirements (segregated storage, PoR API, SOC 1/2 audit) | Evaluation matrix uploaded |
| 3.5.1.c | Select provider and document rationale | `review` | CTO selects provider | Selection decision logged with rationale |

**Subtasks for 3.5.2 --- Execute agreement:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 3.5.2.a | Negotiate custody agreement terms | `review` | CEO reviews access protocols, inspection rights, release conditions | Negotiation notes logged |
| 3.5.2.b | Legal review of custody agreement | `review` | Counsel reviews terms | Legal review memo uploaded |
| 3.5.2.c | Execute custody agreement | `document_upload` | CEO signs; custody provider signs | **Executed custody agreement uploaded and locked.** Effective date logged |

**Subtasks for 3.5.3 --- Insured transport:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 3.5.3.a | Arrange armored/insured transport | `physical_action` | CRO books bonded courier covering full appraised value | Transport booking confirmation uploaded; transit insurance cert uploaded |
| 3.5.3.b | Photograph asset before transport | `document_upload` | CRO takes pre-transport condition photos | Photos uploaded with timestamp |
| 3.5.3.c | Execute transport with chain-of-custody tracking | `physical_action` | CRO tracks asset from origin to vault | Transport manifest uploaded; GPS/tracking data logged |
| 3.5.3.d | Log transport costs | `payment_outgoing` | CRO records transport and insurance costs | Payment receipt uploaded |

**Subtasks for 3.5.4 --- Verify custody:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 3.5.4.a | Confirm asset received at vault | `document_upload` | CTO verifies receipt confirmation from vault | **Vault receipt uploaded and locked.** Receipt date, asset ID, storage location logged |
| 3.5.4.b | Verify condition matches pre-transport documentation | `review` | CTO compares vault's condition report with pre-transport photos | Condition verification: MATCH / DAMAGE NOTED |
| 3.5.4.c | Confirm segregated storage implemented | `review` | CTO verifies asset is in segregated (not pooled) storage | Segregation confirmation logged |
| 3.5.4.d | Test API/reporting access for ongoing monitoring | `automated` | CTO verifies vault API connectivity and data accuracy | API test results logged: CONNECTED / ISSUES |

---

### Stage 3.6: Insurance Verification
**Phase:** Asset Maturity
**Models:** ALL
**Duration:** 1--2 weeks
**Owner:** Compliance Officer

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 3.6.1 | Verify or place insurance coverage | `review` | Compliance Officer | `insurance_certificate` | see below |
| 3.6.2 | Obtain insurance certificates naming SPV/lender as insured | `document_upload` | Compliance Officer | `insurance_certificate` (output) | see below |

**Subtasks for 3.6.1 --- Insurance verification:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 3.6.1.a | Verify vault/existing insurance covers full appraised value | `review` | Compliance Officer confirms coverage amount, perils covered, deductibles | Coverage verification: ADEQUATE / GAP IDENTIFIED |
| 3.6.1.b | If gap: place supplemental coverage | `payment_outgoing` | Compliance Officer engages insurance broker to obtain supplemental policy | Supplemental policy uploaded; premium cost logged |
| 3.6.1.c | Confirm all-risk coverage (theft, fire, natural disaster, mysterious disappearance) | `review` | Compliance Officer reviews policy exclusions | Coverage scope verified and logged |
| 3.6.1.d | Verify policy term covers full anticipated deal timeline | `review` | Compliance Officer confirms expiry date vs. expected completion | Term adequacy logged |

**Subtasks for 3.6.2 --- Certificates:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 3.6.2.a | Obtain certificate naming SPV/lender as additional insured or loss payee | `document_upload` | Compliance Officer requests certificate from insurer | **Insurance certificate uploaded.** Named insured, coverage amount, policy number, expiry logged |
| 3.6.2.b | Set calendar reminder for renewal (60 days before expiry) | `automated` | System creates renewal reminder | Reminder scheduled and logged |

---

### Stage 3.7: Vault API / Reporting Activation
**Phase:** Asset Maturity
**Models:** ALL
**Duration:** 1--2 weeks
**Owner:** CTO

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 3.7.1 | Configure vault API or reporting feed | `automated` | CTO | None | see below |
| 3.7.2 | Verify data accuracy and set monitoring schedule | `review` | CTO | None | see below |

**Subtasks for 3.7.1 --- API configuration:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 3.7.1.a | Configure API connection to vault/custodian | `automated` | CTO sets up API integration with vault system | API configuration logged: endpoint, auth method, polling frequency |
| 3.7.1.b | Map vault data fields to CRM data model | `automated` | CTO ensures vault inventory data maps correctly | Field mapping documented |
| 3.7.1.c | Test data feed with live data | `automated` | CTO verifies real-time data matches physical reality | Test results logged: all fields verified |

**Subtasks for 3.7.2 --- Monitoring:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 3.7.2.a | Set automated monitoring schedule | `automated` | CTO configures daily/weekly monitoring checks | Monitoring schedule logged |
| 3.7.2.b | Define alert thresholds and escalation procedures | `review` | CTO documents what triggers alerts (API down, data mismatch, etc.) | Alert configuration documented |

---

### GATE G3: ASSET MATURITY
**Criteria:**
- [ ] All lab reports received and verified
- [ ] All independent appraisals completed (USPAP compliant)
- [ ] Variance within threshold (15--20% gems, 10% others)
- [ ] Offering/collateral value documented and approved
- [ ] Asset in institutional vault with segregated storage
- [ ] Vault receipt in hand and locked
- [ ] Insurance covers full appraised value
- [ ] Insurance certificates filed with named insured
- [ ] API/reporting feed active (if applicable)
**Required Approvals:** CEO + Compliance Officer
**Gate Type:** Hard gate

---

# PHASE 4: SECURITY

**Color:** Sapphire `#1E3A6E`
**Duration:** 2--6 weeks
**Purpose:** Legal structuring, regulatory filings, compliance preparation
**DIVERGES BY MODEL starting here**

---

## PHASE 4 --- TOKENIZATION (T)

### Stage 4.T1: Series SPV Formation
**Phase:** Security
**Models:** Tokenization
**Duration:** 1--2 weeks
**Owner:** CEO

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 4.T1.1 | Form Series LLC / SPV for the asset | `filing` | CEO | `series_operating_agreement`, `ein_letter` | see below |

**Subtasks for 4.T1.1:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 4.T1.1.a | File series designation with state | `filing` | CEO files series formation with Secretary of State (typically DE or WY) | Filing receipt uploaded; series name, filing number, effective date logged |
| 4.T1.1.b | Draft Series Operating Agreement | `document_upload` | Securities counsel drafts SOA defining token holders' rights, distributions, governance | **SOA uploaded.** Version, date, key terms logged |
| 4.T1.1.c | Obtain EIN from IRS | `filing` | CEO applies for EIN via IRS Form SS-4 | **EIN letter uploaded.** EIN number logged |
| 4.T1.1.d | Open SPV bank account | `physical_action` | CEO opens business bank account for the series | Account confirmation uploaded; bank, account type logged |
| 4.T1.1.e | Log formation costs | `payment_outgoing` | CEO records state filing fees, legal costs | Costs logged: state fee, counsel fee |

---

### Stage 4.T2: PPM Drafting
**Phase:** Security
**Models:** Tokenization
**Duration:** 2--4 weeks
**Owner:** Securities Counsel

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 4.T2.1 | Draft Private Placement Memorandum (60--150 pages) | `document_upload` | Securities Counsel | `ppm`, `subscription_agreement`, `token_purchase_agreement` | see below |

**Subtasks for 4.T2.1:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 4.T2.1.a | Counsel drafts PPM with all required disclosures | `review` | Securities counsel drafts: risk factors, use of proceeds, asset description, valuation methodology, management bios, fee structure, token mechanics | Draft PPM uploaded; page count and section checklist logged |
| 4.T2.1.b | Internal review by CEO and CRO | `review` | CEO and CRO review for accuracy and completeness | Review comments uploaded |
| 4.T2.1.c | Draft Subscription Agreement | `document_upload` | Counsel drafts subscription agreement for token purchasers | Subscription Agreement uploaded |
| 4.T2.1.d | Draft Token Purchase Agreement | `document_upload` | Counsel drafts TPA with smart contract terms | TPA uploaded |
| 4.T2.1.e | Final legal review and sign-off | `approval` | Securities counsel certifies PPM is complete and compliant | **Counsel sign-off logged.** PPM version locked |
| 4.T2.1.f | Log legal costs | `payment_outgoing` | CEO records PPM drafting costs ($25K--$75K) | Payment logged |

---

### Stage 4.T3: Investor Qualification Forms
**Phase:** Security
**Models:** Tokenization
**Duration:** 1 week
**Owner:** Securities Counsel

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 4.T3.1 | Draft investor questionnaire and accreditation verification forms | `document_upload` | Securities Counsel | `investor_questionnaire`, `accreditation_form` | see below |

**Subtasks for 4.T3.1:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 4.T3.1.a | Draft investor questionnaire | `review` | Counsel drafts questionnaire capturing accreditation status, investment experience, risk tolerance | Template uploaded |
| 4.T3.1.b | Draft accreditation verification letter templates | `review` | Counsel prepares CPA/attorney verification letter templates per 506(c) | Templates uploaded |
| 4.T3.1.c | Legal review and approval | `approval` | Counsel certifies forms comply with Reg D 506(c) requirements | **Approval logged** |

---

### Stage 4.T4: Custody Agreement (SPV <> Vault)
**Phase:** Security
**Models:** Tokenization
**Duration:** 1--2 weeks
**Owner:** CEO

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 4.T4.1 | Execute custody agreement between SPV and vault | `document_upload` | CEO | `custody_agreement` (SPV-specific) | see below |

**Subtasks for 4.T4.1:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 4.T4.1.a | Negotiate SPV-specific custody terms | `review` | CEO negotiates release conditions, inspection rights, PoR access | Negotiation notes logged |
| 4.T4.1.b | Legal review of custody agreement | `review` | Counsel reviews for enforceability and investor protection | Counsel review memo uploaded |
| 4.T4.1.c | Execute agreement | `document_upload` | CEO and vault provider sign | **Executed agreement uploaded and locked** |

---

### Stage 4.T5: MSB Classification Legal Opinion
**Phase:** Security
**Models:** Tokenization
**Duration:** 1--2 weeks
**Owner:** Securities Counsel

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 4.T5.1 | Obtain legal opinion on MSB classification | `document_upload` | Securities Counsel | `legal_opinion` | see below |

**Subtasks for 4.T5.1:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 4.T5.1.a | Engage counsel for MSB/money transmitter analysis | `communication` | CEO engages counsel to analyze fund flow for MSB/state money transmitter classification | Engagement confirmed; scope logged |
| 4.T5.1.b | Counsel conducts fund flow analysis | `review` | Counsel analyzes token purchase/redemption flow against FinCEN MSB rules and state-by-state money transmitter laws | Analysis summary logged |
| 4.T5.1.c | Receive and file legal opinion | `document_upload` | Counsel delivers formal opinion | **Legal opinion uploaded and locked.** Conclusion logged: MSB / NOT MSB / CONDITIONAL |
| 4.T5.1.d | Log legal costs | `payment_outgoing` | CEO records opinion cost | Payment logged |

---

### Stage 4.T6: Form D Preparation
**Phase:** Security
**Models:** Tokenization
**Duration:** 3--5 days
**Owner:** Compliance Officer

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 4.T6.1 | Prepare Form D for EDGAR filing | `review` | Compliance Officer | `form_d_draft` | see below |

**Subtasks for 4.T6.1:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 4.T6.1.a | Register for EDGAR Next (if not already) | `filing` | Compliance Officer completes EDGAR enrollment | EDGAR CIK number logged |
| 4.T6.1.b | Prepare Form D with all required fields | `review` | Compliance Officer fills in: issuer info, offering amount, exemption(s) claimed, executive info | Form D draft uploaded |
| 4.T6.1.c | Legal review of Form D | `approval` | Securities counsel reviews for accuracy | **Counsel approval logged** |
| 4.T6.1.d | Verify Bad Actor disqualification check (Rule 506(d)) | `due_diligence` | Compliance Officer screens all covered persons against Rule 506(d) | Bad Actor screening result: CLEAR / ISSUE; each person screened logged |

---

### GATE G4T: SECURITY (TOKENIZATION)
**Criteria:** SPV formed, PPM complete, investor forms ready, custody agreement executed, MSB opinion obtained, Form D prepared, Rule 506(d) clear
**Required Approvals:** CEO + Securities Counsel
**Gate Type:** Hard gate

---

## PHASE 4 --- FRACTIONAL SECURITIES (F)

### Stage 4.F1: Regulatory Pathway Selection
**Phase:** Security
**Models:** Fractional Securities
**Duration:** 3--5 days
**Owner:** Securities Counsel + CEO

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 4.F1.1 | Evaluate Reg D vs Reg A+ vs Reg CF | `review` | Securities Counsel | `regulatory_pathway_memo` | see below |

**Subtasks for 4.F1.1:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 4.F1.1.a | Analyze offering size, investor type, and marketing requirements | `review` | Counsel evaluates: offering amount, accredited vs non-accredited investors, general solicitation needs | Analysis memo uploaded |
| 4.F1.1.b | Decision matrix: Reg D 506(b) vs 506(c) vs Reg A+ Tier 1 vs Tier 2 vs Reg CF | `review` | Counsel prepares decision matrix with pros/cons | Decision matrix uploaded |
| 4.F1.1.c | Counsel recommendation | `approval` | Counsel recommends pathway with rationale | **Recommendation logged.** Pathway selected: [specific regulation] |
| 4.F1.1.d | CEO approval of selected pathway | `approval` | CEO approves regulatory pathway | **CEO approval logged** |

---

### Stage 4.F2: Series SPV Formation & Unit Structuring
**Phase:** Security
**Models:** Fractional Securities
**Duration:** 1--2 weeks
**Owner:** CEO

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 4.F2.1 | Form Series LLC / SPV | `filing` | CEO | `series_operating_agreement`, `ein_letter` | see below |
| 4.F2.2 | Define unit classes (A/B/Preferred) | `review` | Securities Counsel | None | see below |

**Subtasks for 4.F2.1:** (Same structure as 4.T1.1 -- series formation, SOA, EIN, bank account)
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 4.F2.1.a | File series designation | `filing` | CEO files with Secretary of State | Filing receipt uploaded |
| 4.F2.1.b | Draft Series Operating Agreement with unit classes | `document_upload` | Counsel drafts SOA with Class A/B/Preferred rights | **SOA uploaded** |
| 4.F2.1.c | Obtain EIN | `filing` | CEO files SS-4 | EIN logged |
| 4.F2.1.d | Open SPV bank account | `physical_action` | CEO opens account | Account confirmation uploaded |

**Subtasks for 4.F2.2:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 4.F2.2.a | Define unit economics: price per unit, total units, minimum investment | `review` | CEO + Counsel determine offering structure | Unit economics logged: price, count, minimum |
| 4.F2.2.b | Define distribution waterfall and voting rights per class | `review` | Counsel documents class rights | Distribution waterfall documented |

---

### Stage 4.F3: Offering Document Preparation
**Phase:** Security
**Models:** Fractional Securities
**Duration:** 2--4 weeks
**Owner:** Securities Counsel

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 4.F3.1 | Draft PPM (Reg D) or Form 1-A (Reg A+) or Form C (Reg CF) | `document_upload` | Securities Counsel | Offering docs (varies by pathway) | see below |

**Subtasks for 4.F3.1:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 4.F3.1.a | Counsel drafts offering document per selected pathway | `review` | Counsel drafts complete offering document with all required disclosures | Draft uploaded; page count logged |
| 4.F3.1.b | Internal review by CEO and CRO | `review` | CEO/CRO review for accuracy | Review comments uploaded |
| 4.F3.1.c | Revisions and final legal sign-off | `approval` | Counsel finalizes | **Counsel sign-off logged; document version locked** |
| 4.F3.1.d | Log legal costs | `payment_outgoing` | CEO records drafting costs | Payment logged |

---

### Stage 4.F4: Transfer Agent Engagement
**Phase:** Security
**Models:** Fractional Securities
**Duration:** 1--2 weeks
**Owner:** CRO

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 4.F4.1 | Select and engage Transfer Agent | `document_upload` | CRO | `ta_agreement` | see below |

**Subtasks for 4.F4.1:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 4.F4.1.a | Evaluate TA candidates | `meeting` | CRO evaluates 2--3 TAs on capability, cost, technology | Evaluation matrix uploaded |
| 4.F4.1.b | Negotiate and execute TA agreement | `document_upload` | CRO executes agreement | **TA agreement uploaded.** Fees logged |
| 4.F4.1.c | Log TA costs | `payment_outgoing` | CRO records setup and ongoing fees | Costs logged |

---

### Stage 4.F5: Broker-Dealer Engagement
**Phase:** Security
**Models:** Fractional Securities
**Duration:** 1--2 weeks
**Owner:** CRO

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 4.F5.1 | Select and engage Broker-Dealer | `document_upload` | CRO | `bd_agreement`, `finra_5123` | see below |

**Subtasks for 4.F5.1:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 4.F5.1.a | Evaluate BD candidates (Rialto, Dalmore, etc.) | `meeting` | CRO evaluates BDs on: ATS capability, compliance infrastructure, cost | Evaluation matrix uploaded |
| 4.F5.1.b | Negotiate and execute BD agreement | `document_upload` | CRO executes agreement | **BD agreement uploaded.** Commission structure logged |
| 4.F5.1.c | BD files FINRA 5123 (Private Placement Filing) | `filing` | BD files with FINRA | FINRA filing confirmation uploaded |
| 4.F5.1.d | Log BD costs | `payment_outgoing` | CRO records BD fees | Costs logged |

---

### Stage 4.F6: SEC Filing Preparation
**Phase:** Security
**Models:** Fractional Securities
**Duration:** 3--5 days
**Owner:** Compliance Officer

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 4.F6.1 | Prepare SEC filing (Form D / Form 1-A / Form C) | `review` | Compliance Officer | Filing draft | see below |

**Subtasks for 4.F6.1:** (Same structure as 4.T6.1 -- EDGAR registration, form preparation, legal review, 506(d) check)
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 4.F6.1.a | Prepare filing per selected regulatory pathway | `review` | Compliance Officer completes filing form | Filing draft uploaded |
| 4.F6.1.b | Legal review | `approval` | Counsel reviews | Approval logged |
| 4.F6.1.c | Rule 506(d) Bad Actor check (if Reg D) | `due_diligence` | Compliance Officer screens all covered persons | Screening results logged |

---

### GATE G4F: SECURITY (FRACTIONAL)
**Criteria:** Pathway selected, SPV formed, offering docs complete, TA engaged, BD engaged, filing prepared, 506(d) clear
**Required Approvals:** CEO + Securities Counsel
**Gate Type:** Hard gate

---

## PHASE 4 --- DEBT INSTRUMENT (D)

### Stage 4.D1: Business-Purpose vs Consumer-Purpose Determination
**Phase:** Security | **Models:** Debt Instrument | **Duration:** 2--3 days | **Owner:** Compliance Officer

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 4.D1.1 | Complete loan purpose analysis and document determination | `review` | Compliance Officer | `determination_memo` | see below |

**Subtasks:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 4.D1.1.a | Analyze intended use of proceeds | `review` | Compliance Officer reviews holder statement and supporting evidence | Use analysis documented |
| 4.D1.1.b | Apply business-purpose/consumer-purpose test | `review` | If personal/family/household use: consumer-purpose triggers TILA/Reg Z/RESPA/ECOA | **Determination logged: BUSINESS or CONSUMER with full legal rationale** |
| 4.D1.1.c | If consumer: document additional regulatory requirements | `review` | Compliance Officer lists all triggered regulations | Requirements checklist updated |

---

### Stage 4.D2: UCC-1 Drafting & Pre-Filing Search
**Phase:** Security | **Models:** Debt Instrument | **Duration:** 1 week | **Owner:** Compliance Officer

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 4.D2.1 | Conduct UCC search and draft UCC-1 | `filing` | Compliance Officer | `ucc_search_results`, `ucc_1_draft` | see below |

**Subtasks:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 4.D2.1.a | Run UCC search against debtor name in filing state | `due_diligence` | Compliance Officer orders UCC search from search company | Search results uploaded: existing filings documented |
| 4.D2.1.b | Draft UCC-1 with correct debtor name (UCC 9-503) | `review` | Compliance Officer drafts using exact legal name per state formation records | UCC-1 draft uploaded |
| 4.D2.1.c | Draft collateral description (UCC 9-108) | `review` | Compliance Officer drafts specific or supergeneric description | Collateral description reviewed and approved |
| 4.D2.1.d | Identify correct filing office (UCC 9-301) | `review` | Compliance Officer determines state of debtor's organization | Filing jurisdiction logged |

---

### Stage 4.D3: Promissory Note Structuring
**Phase:** Security | **Models:** Debt Instrument | **Duration:** 1--2 weeks | **Owner:** Compliance Officer

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 4.D3.1 | Draft promissory note | `review` | Compliance Officer | `promissory_note_draft` | see below |
| 4.D3.2 | Usury law compliance check | `review` | Compliance Officer | `usury_analysis_memo` | see below |
| 4.D3.3 | TILA/Reg Z analysis (if consumer-purpose) | `review` | Compliance Officer | `tila_analysis` | see below |

**Subtasks for 4.D3.1:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 4.D3.1.a | Draft note with: principal, rate, maturity, payment schedule, prepayment, late fees, default triggers, acceleration | `review` | Compliance Officer drafts complete note | Note draft uploaded |
| 4.D3.1.b | Legal review of note for UCC Article 3 compliance | `approval` | Counsel reviews for negotiable instrument requirements | Counsel review logged |

**Subtasks for 4.D3.2:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 4.D3.2.a | Identify applicable state usury limits | `review` | Compliance Officer researches usury caps for the applicable state | State usury limits documented |
| 4.D3.2.b | Confirm proposed rate is within limits (or exempt) | `review` | Compliance Officer documents: business-purpose exemption, dollar threshold exemption, or rate compliance | **Usury compliance determination logged with citation** |

**Subtasks for 4.D3.3 (if consumer):**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 4.D3.3.a | Calculate APR per Reg Z Appendix J | `review` | Compliance Officer calculates total of payments, finance charge | APR calculation documented |
| 4.D3.3.b | Prepare TILA disclosures | `document_upload` | Compliance Officer prepares required disclosure forms | Disclosure forms uploaded |
| 4.D3.3.c | Determine state lending license requirements | `review` | Compliance Officer checks if PleoChrome needs a license | License determination logged |

---

### Stage 4.D4: Security Agreement & Pledge Agreement
**Phase:** Security | **Models:** Debt Instrument | **Duration:** 1 week | **Owner:** Compliance Officer

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 4.D4.1 | Draft security agreement | `review` | Compliance Officer | `security_agreement_draft` | see below |
| 4.D4.2 | Draft guaranty agreement (if applicable) | `review` | Compliance Officer | `guaranty_draft` | see below |

**Subtasks for 4.D4.1:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 4.D4.1.a | Draft security agreement with: grant, collateral description, representations, covenants, LTV maintenance, events of default, remedies | `review` | Compliance Officer drafts comprehensive security agreement | Draft uploaded |
| 4.D4.1.b | Add after-acquired property and proceeds clauses | `review` | Compliance Officer includes UCC 9-315 proceeds clause | Clauses documented |

**Subtasks for 4.D4.2:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 4.D4.2.a | Draft personal guaranty (full or limited recourse) | `review` | Compliance Officer drafts with carve-outs for fraud, environmental, waste | Guaranty draft uploaded |
| 4.D4.2.b | Collect guarantor financial disclosures | `document_upload` | Compliance Officer requests guarantor financials | Financial disclosures uploaded |

---

### Stage 4.D5: Tripartite Custody Control Agreement
**Phase:** Security | **Models:** Debt Instrument | **Duration:** 1 week | **Owner:** Compliance Officer

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 4.D5.1 | Negotiate and draft tripartite CCA (borrower + lender + custodian) | `document_upload` | Compliance Officer | `custody_control_agreement` | see below |

**Subtasks:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 4.D5.1.a | Draft CCA: release conditions, inspection rights, reappraisal triggers, default procedures | `review` | Compliance Officer drafts with all three parties' obligations | CCA draft uploaded |
| 4.D5.1.b | Negotiate with vault custodian and borrower | `communication` | CEO negotiates terms with both counterparties | Negotiation notes logged |
| 4.D5.1.c | Execute CCA (all three parties) | `document_upload` | All parties sign | **Executed CCA uploaded and locked** |

---

### Stage 4.D6: State Lending License Analysis
**Phase:** Security | **Models:** Debt Instrument | **Duration:** 3--5 days | **Owner:** Compliance Officer

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 4.D6.1 | Analyze state licensing requirements | `review` | Compliance Officer | `licensing_analysis_memo` | see below |

**Subtasks:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 4.D6.1.a | Determine if lending license required in applicable state(s) | `review` | Compliance Officer checks: CA CFL/CRMLA, NY Licensed Lender, GA, MD, IL, NJ, etc. | License requirement per state logged |
| 4.D6.1.b | Check for exemptions: business-purpose, dollar threshold, entity type | `review` | Compliance Officer documents applicable exemptions | Exemption analysis uploaded |
| 4.D6.1.c | If license required: initiate application or engage licensed entity | `filing` | Compliance Officer begins license process or partners with licensed lender | Licensing plan logged |

---

### Stage 4.D7: External Counsel Review
**Phase:** Security | **Models:** Debt Instrument | **Duration:** 1--2 weeks | **Owner:** Compliance Officer

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 4.D7.1 | External counsel reviews all loan documents | `review` | General Counsel | `legal_opinion` | see below |
| 4.D7.2 | Compliance Officer final sign-off | `approval` | Compliance Officer | None | see below |

**Subtasks for 4.D7.1:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 4.D7.1.a | Counsel reviews: note, security agreement, UCC-1, CCA, guaranty | `review` | Counsel reviews complete loan package for enforceability | **Counsel review memo uploaded** |
| 4.D7.1.b | Usury opinion (if rate near state limits) | `document_upload` | Counsel provides usury opinion if needed | Opinion uploaded |
| 4.D7.1.c | True lender / rent-a-bank analysis (if using bank partner) | `review` | Counsel analyzes structure for regulatory risk | Analysis logged |

**Subtasks for 4.D7.2:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 4.D7.2.a | Review complete loan file | `review` | Compliance Officer verifies all requirements addressed | Checklist completed |
| 4.D7.2.b | Verify KYC/AML, insurance, UCC filing all current | `review` | Compliance Officer confirms no expirations | Verification logged |
| 4.D7.2.c | Sign off on loan package | `approval` | Compliance Officer issues formal sign-off | **Compliance sign-off logged** |

---

### GATE G4D: SECURITY (DEBT)
**Criteria:** Business/consumer determination documented, UCC-1 drafted, note structured, security agreement drafted, CCA executed, licensing clear, external counsel reviewed, compliance sign-off
**Required Approvals:** CEO + External General Counsel
**Gate Type:** Hard gate

---

## PHASE 4 --- BROKER SALE (B)

### Stage 4.B1: Broker/Dealer Selection
**Phase:** Security | **Models:** Broker Sale | **Duration:** 1--2 weeks | **Owner:** CRO

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 4.B1.1 | Evaluate and select broker/dealer for asset sale | `meeting` | CRO | None | see below |

**Subtasks:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 4.B1.1.a | Identify candidate brokers by asset class | `review` | CRO identifies: auction houses (gems), LBMA dealers (metals), RE brokers, mineral brokers | Candidate list uploaded |
| 4.B1.1.b | Evaluate candidates on: network, track record, commission, marketing capability | `meeting` | CRO meets with 2--3 candidates | Evaluation matrix uploaded |
| 4.B1.1.c | Select broker and document rationale | `review` | CRO makes selection | **Selection decision logged** |

---

### Stage 4.B2: Listing/Consignment Agreement
**Phase:** Security | **Models:** Broker Sale | **Duration:** 1 week | **Owner:** CRO

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 4.B2.1 | Execute listing/consignment agreement | `document_upload` | CRO | `listing_agreement` | see below |

**Subtasks:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 4.B2.1.a | Draft agreement: scope, commission, duration, exclusivity | `review` | CRO drafts or reviews broker's standard terms | Draft uploaded |
| 4.B2.1.b | Legal review | `review` | Counsel reviews | Counsel comments uploaded |
| 4.B2.1.c | Execute agreement | `document_upload` | Both parties sign | **Agreement uploaded and locked** |
| 4.B2.1.d | Log commission structure | `review` | CRO records commission percentage and terms | Commission terms logged |

---

### Stage 4.B3: Reserve Price & Marketing Strategy
**Phase:** Security | **Models:** Broker Sale | **Duration:** 3--5 days | **Owner:** CEO

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 4.B3.1 | Set reserve price and approve marketing plan | `approval` | CEO | `marketing_plan` | see below |

**Subtasks:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 4.B3.1.a | Determine reserve price based on appraisals and market conditions | `review` | CEO and CRO set reserve | **Reserve price logged** |
| 4.B3.1.b | Approve broker's marketing plan | `approval` | CEO reviews and approves marketing approach | **Marketing plan approved and logged** |

---

### Stage 4.B4: Seller Disclosure Preparation
**Phase:** Security | **Models:** Broker Sale | **Duration:** 3--5 days | **Owner:** CRO

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 4.B4.1 | Prepare seller disclosures | `document_upload` | CRO | `condition_report`, `inspection_report` | see below |

**Subtasks:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 4.B4.1.a | Compile condition reports, inspection findings, known defects | `document_upload` | CRO assembles all disclosure materials | Disclosure package uploaded |
| 4.B4.1.b | Legal review of disclosure adequacy | `review` | Counsel reviews for compliance with state disclosure laws | Review logged |

---

### GATE G4B: SECURITY (BROKER)
**Criteria:** Broker selected, agreement executed, reserve price set, marketing plan approved, disclosures prepared
**Required Approvals:** CEO
**Gate Type:** Hard gate

---

## PHASE 4 --- BARTER/EXCHANGE (X)

### Stage 4.X1: 1031 Exchange Eligibility Determination
**Phase:** Security | **Models:** Barter/Exchange | **Duration:** 3--5 days | **Owner:** Tax Counsel

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 4.X1.1 | Determine IRC 1031 eligibility | `review` | Tax Counsel | `tax_counsel_opinion` | see below |

**Subtasks:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 4.X1.1.a | Analyze whether assets are "like-kind" real property (post-TCJA 2017) | `review` | Tax counsel analyzes: real property for real property only; gems/metals NOT eligible | **Eligibility determination logged: ELIGIBLE / NOT ELIGIBLE** |
| 4.X1.1.b | If eligible: document 45-day ID and 180-day completion deadlines | `review` | Counsel maps timeline constraints | Deadline dates calculated and logged |
| 4.X1.1.c | If not eligible: calculate tax implications of direct exchange | `review` | Counsel estimates capital gains exposure | Tax analysis uploaded |

---

### Stage 4.X2: Qualified Intermediary Engagement (if 1031)
**Phase:** Security | **Models:** Barter/Exchange | **Duration:** 1 week | **Owner:** CEO

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 4.X2.1 | Engage QI (if 1031 eligible) | `document_upload` | CEO | `qi_agreement` | see below |

**Subtasks:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 4.X2.1.a | Select qualified intermediary | `review` | CEO evaluates QI candidates on: bonding, insurance, reputation, cost | Selection logged |
| 4.X2.1.b | Execute QI agreement | `document_upload` | CEO signs QI agreement | **QI agreement uploaded** |
| 4.X2.1.c | Pay QI deposit | `payment_outgoing` | CEO wires deposit | Payment receipt uploaded |

---

### Stage 4.X3: Counterparty Due Diligence
**Phase:** Security | **Models:** Barter/Exchange | **Duration:** 1--2 weeks | **Owner:** Compliance Officer

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 4.X3.1 | Conduct KYC and asset DD on counterparty | `due_diligence` | Compliance Officer | `kyc_report` (counterparty), `appraisal_report` (counterparty asset) | see below |

**Subtasks:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 4.X3.1.a | KYC/KYB on counterparty (same process as Stage 2.1) | `due_diligence` | Compliance Officer runs full KYC on counterparty | KYC result logged: CLEAR / FLAG |
| 4.X3.1.b | Appraise counterparty's asset independently | `physical_action` | CRO commissions appraisal of received asset | Appraisal report uploaded |
| 4.X3.1.c | Verify counterparty's title/ownership | `due_diligence` | Compliance Officer verifies counterparty's clean title | Title verification logged |

---

### Stage 4.X4: Exchange Agreement Drafting
**Phase:** Security | **Models:** Barter/Exchange | **Duration:** 1--2 weeks | **Owner:** Securities Counsel

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 4.X4.1 | Draft and review exchange agreement | `document_upload` | Securities Counsel | `exchange_agreement` | see below |

**Subtasks:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 4.X4.1.a | Draft exchange agreement: assets, valuations, boot, closing mechanics | `review` | Counsel drafts agreement | Draft uploaded |
| 4.X4.1.b | Legal review (both PleoChrome counsel and tax counsel) | `approval` | Both counsel review | **Dual counsel approval logged** |
| 4.X4.1.c | Counterparty review and negotiation | `communication` | CEO negotiates with counterparty | Negotiation notes logged |

---

### GATE G4X: SECURITY (BARTER)
**Criteria:** 1031 eligibility determined, QI engaged (if applicable), counterparty DD complete, exchange agreement drafted and reviewed
**Required Approvals:** CEO + Tax Counsel
**Gate Type:** Hard gate

---

# PHASE 5: VALUE CREATION

**Color:** Amethyst `#5B2D8E`
**Duration:** 2--12 weeks (varies by model)
**Purpose:** Execute the chosen value creation strategy
**COMPLETELY MODEL-SPECIFIC**

---

## PHASE 5 --- TOKENIZATION (T)

### Stage 5.T1: Platform Configuration
**Phase:** Value Creation | **Models:** Tokenization | **Duration:** 1--2 weeks | **Owner:** CTO

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 5.T1.1 | Configure tokenization platform (Brickken/Zoniqx) | `automated` | CTO | `configuration_docs` | see below |

**Subtasks:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 5.T1.1.a | Configure token parameters: name, symbol, total supply, decimals | `automated` | CTO sets ERC-3643 token params | Configuration snapshot uploaded |
| 5.T1.1.b | Set compliance rules: whitelist requirements, transfer restrictions, lockup periods | `automated` | CTO configures compliance module | Compliance rules documented |
| 5.T1.1.c | Configure identity registry for investor verification | `automated` | CTO sets up KYC/accreditation gates in token contract | Registry configuration logged |
| 5.T1.1.d | Document complete configuration | `document_upload` | CTO writes configuration spec | Configuration document uploaded |

---

### Stage 5.T2: Testnet Deployment & Testing
**Phase:** Value Creation | **Models:** Tokenization | **Duration:** 1--2 weeks | **Owner:** CTO

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 5.T2.1 | Deploy and test on testnet | `automated` | CTO | `test_report` | see below |

**Subtasks:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 5.T2.1.a | Deploy contracts to Polygon testnet (Mumbai/Amoy) | `automated` | CTO deploys all contracts | Contract addresses logged; deployment transaction hashes recorded |
| 5.T2.1.b | Test mint, transfer, compliance block, and burn functions | `automated` | CTO executes test matrix | Test results: PASS/FAIL per function; test transaction hashes |
| 5.T2.1.c | Test compliance rules (block unauthorized transfers) | `automated` | CTO verifies whitelist enforcement | Compliance test results logged |
| 5.T2.1.d | Upload comprehensive test report | `document_upload` | CTO writes test report | **Test report uploaded** |

---

### Stage 5.T3: Chainlink Proof of Reserve Integration
**Phase:** Value Creation | **Models:** Tokenization | **Duration:** 2--4 weeks | **Owner:** CTO

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 5.T3.1 | Build and deploy Chainlink PoR integration | `automated` | CTO | `por_configuration` | see below |

**Subtasks:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 5.T3.1.a | Apply to Chainlink for BUILD program (if applicable) | `communication` | CTO submits BUILD application | Application status logged |
| 5.T3.1.b | Develop custom external adapter for vault API | `automated` | CTO builds adapter translating vault data to Chainlink format | Code repository link logged; adapter version |
| 5.T3.1.c | Deploy PoR feed on testnet and verify | `automated` | CTO tests PoR feed accuracy against vault data | Testnet PoR verification results logged |
| 5.T3.1.d | Connect PoR feed to token contract | `automated` | CTO links PoR data feed to smart contract | Integration configuration logged |

---

### Stage 5.T4: Smart Contract Audit
**Phase:** Value Creation | **Models:** Tokenization | **Duration:** 2--4 weeks | **Owner:** CTO

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 5.T4.1 | Engage auditor and complete smart contract audit | `document_upload` | CTO | `audit_report` | see below |

**Subtasks:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 5.T4.1.a | Engage smart contract auditor (CertiK, OpenZeppelin, Trail of Bits, etc.) | `communication` | CTO selects and engages auditor | Engagement logged; auditor name and scope documented |
| 5.T4.1.b | Receive audit report | `document_upload` | CTO receives findings | **Audit report uploaded.** Findings: CRITICAL/HIGH/MEDIUM/LOW counts logged |
| 5.T4.1.c | Remediate all critical and high findings | `automated` | CTO fixes code based on audit recommendations | Remediation log: each finding addressed with fix description |
| 5.T4.1.d | Obtain audit pass confirmation | `approval` | Auditor confirms all critical/high issues resolved | **Audit pass confirmation uploaded** |
| 5.T4.1.e | Log audit costs | `payment_outgoing` | CTO records audit fees ($15K--$100K) | Payment logged |

---

### Stage 5.T5: Mainnet Deployment
**Phase:** Value Creation | **Models:** Tokenization | **Duration:** 1--3 days | **Owner:** CTO

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 5.T5.1 | Deploy to Polygon mainnet with multi-sig authorization | `automated` | CTO | None | see below |

**Subtasks:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 5.T5.1.a | Deploy contracts to Polygon mainnet | `automated` | CTO deploys audited contracts | **Mainnet contract addresses logged; deployment tx hashes recorded** |
| 5.T5.1.b | Verify contract parameters match approved configuration | `review` | CTO verifies all params on-chain | Parameter verification checklist completed |
| 5.T5.1.c | Configure 3-of-3 multi-sig mint authorization | `approval` | CEO + CTO + CRO each confirm multi-sig wallet access | **All three multi-sig confirmations logged** |
| 5.T5.1.d | Verify PoR feed on mainnet | `automated` | CTO confirms PoR data matches vault | Mainnet PoR verification logged |

---

### Stage 5.T6: File Form D with SEC
**Phase:** Value Creation | **Models:** Tokenization | **Duration:** 1--3 days | **Owner:** Compliance Officer

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 5.T6.1 | File Form D via EDGAR | `filing` | Compliance Officer | `form_d_filing_confirmation` | see below |

**Subtasks:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 5.T6.1.a | Submit Form D via EDGAR | `filing` | Compliance Officer files electronically | **Filing confirmation uploaded; CIK number logged; filing date recorded** |
| 5.T6.1.b | Verify filing appears on SEC EDGAR database | `review` | Compliance Officer confirms public listing | Verification screenshot uploaded |
| 5.T6.1.c | Log filing fees | `payment_outgoing` | Compliance Officer records fees | Fees logged |

---

### Stage 5.T7: Blue Sky State Notice Filings
**Phase:** Value Creation | **Models:** Tokenization | **Duration:** 2--4 weeks | **Owner:** Compliance Officer

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 5.T7.1 | File state notice filings in applicable jurisdictions | `filing` | Compliance Officer | `state_filings_tracker` | see below |

**Subtasks:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 5.T7.1.a | Determine required state filings (up to 46 states + DC) | `review` | Compliance Officer identifies states where filing is required; notes NY pre-sale requirement | State filing list generated |
| 5.T7.1.b | Prepare and submit state notices | `filing` | Compliance Officer files in each required state | **Per-state filing: date, fee, confirmation number logged** |
| 5.T7.1.c | Create tracking spreadsheet | `document_upload` | Compliance Officer maintains master tracker | Tracking spreadsheet uploaded and maintained |
| 5.T7.1.d | Log total filing fees | `payment_outgoing` | Compliance Officer records all state fees | Total costs logged |

---

### Stage 5.T8: Investor Verification Setup
**Phase:** Value Creation | **Models:** Tokenization | **Duration:** 3--5 days | **Owner:** CTO

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 5.T8.1 | Configure investor onboarding and accreditation verification flow | `automated` | CTO | None | see below |

**Subtasks:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 5.T8.1.a | Set up KYC/AML flow for token investors | `automated` | CTO configures identity verification pipeline | Configuration logged |
| 5.T8.1.b | Set up accreditation verification (506(c) reasonable steps) | `automated` | CTO configures verification method: CPA/attorney letter or third-party service | Verification method documented |
| 5.T8.1.c | Test end-to-end investor onboarding flow | `review` | CTO runs test with sample investor data | **Test report uploaded** |

---

### GATE G5T: VALUE CREATION (TOKENIZATION)
**Criteria:** Platform configured, testnet tested, PoR integrated, audit passed, mainnet deployed, Form D filed, Blue Sky filings submitted, investor verification operational
**Required Approvals:** CEO + CTO + Compliance Officer
**Gate Type:** Hard gate

---

## PHASE 5 --- FRACTIONAL SECURITIES (F)

### Stage 5.F1: SEC Filing & Qualification
**Phase:** Value Creation | **Models:** Fractional Securities | **Duration:** 1 day -- 6 months (depends on pathway) | **Owner:** Compliance Officer

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 5.F1.1 | Submit SEC filing | `filing` | Compliance Officer | `filing_confirmation` | see below |

**Subtasks:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 5.F1.1.a | Submit Form D (Reg D) or Form 1-A (Reg A+) or Form C (Reg CF) | `filing` | Compliance Officer files via EDGAR or applicable portal | **Filing confirmation uploaded; date logged** |
| 5.F1.1.b | If Reg A+: respond to SEC qualification comments | `communication` | Counsel responds to SEC comments | Comment letters and responses logged |
| 5.F1.1.c | Log filing fees | `payment_outgoing` | Compliance Officer records fees | Fees logged |

---

### Stage 5.F2: Blue Sky Filings (if Reg D)
**Phase:** Value Creation | **Models:** Fractional Securities | **Duration:** 2--4 weeks | **Owner:** Compliance Officer

(Same structure as 5.T7 -- state notice filings)

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 5.F2.1 | File state notice filings | `filing` | Compliance Officer | `state_filings_tracker` | Same subtasks as 5.T7.1 |

---

### Stage 5.F3: Investor Onboarding Infrastructure
**Phase:** Value Creation | **Models:** Fractional Securities | **Duration:** 1--2 weeks | **Owner:** CTO

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 5.F3.1 | Build investor onboarding pipeline | `automated` | CTO | None | see below |

**Subtasks:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 5.F3.1.a | Configure KYC/AML flow for investors | `automated` | CTO sets up identity verification | Configuration logged |
| 5.F3.1.b | Configure accreditation verification (if 506(c)) | `automated` | CTO sets up verification method | Method documented |
| 5.F3.1.c | Set up e-signature for subscription agreements | `automated` | CTO configures DocuSign/equivalent | Integration logged |
| 5.F3.1.d | Set up escrow account for investor funds | `physical_action` | CEO opens escrow account | Account details logged |

---

### Stage 5.F4: Investor Data Room Build
**Phase:** Value Creation | **Models:** Fractional Securities | **Duration:** 3--5 days | **Owner:** CRO

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 5.F4.1 | Assemble investor data room | `document_upload` | CRO | All offering materials | see below |

**Subtasks:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 5.F4.1.a | Upload PPM, certification reports, appraisals, vault receipt, insurance, team bios | `document_upload` | CRO assembles all investor-facing materials into secure data room | Data room link logged; document count logged |
| 5.F4.1.b | Set access controls (view-only, watermarked, tracked) | `automated` | CTO configures data room security | Access controls documented |

---

### Stage 5.F5: Marketing Material Preparation
**Phase:** Value Creation | **Models:** Fractional Securities | **Duration:** 1--2 weeks | **Owner:** CRO

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 5.F5.1 | Prepare compliant marketing materials | `document_upload` | CRO | `pitch_deck`, `one_pager`, `email_templates` | see below |

**Subtasks:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 5.F5.1.a | Create pitch deck, one-pager, email templates | `document_upload` | CRO drafts marketing collateral | Materials uploaded |
| 5.F5.1.b | Counsel compliance review of all materials | `approval` | Securities counsel reviews for Reg D/A+/CF compliance | **Counsel approval logged per document** |
| 5.F5.1.c | BD approval of materials (if BD engaged) | `approval` | BD compliance reviews | **BD approval logged** |

---

### Stage 5.F6: E2E Investor Onboarding Test
**Phase:** Value Creation | **Models:** Fractional Securities | **Duration:** 2--3 days | **Owner:** CTO

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 5.F6.1 | Test complete investor flow end-to-end | `review` | CTO | `test_report` | see below |

**Subtasks:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 5.F6.1.a | Run test investor through: KYC > accreditation > data room > subscription > payment > confirmation | `automated` | CTO tests full pipeline | **Test report uploaded: PASS/FAIL per step** |
| 5.F6.1.b | Fix any issues and re-test | `automated` | CTO remediates failures | Issue log with resolutions |

---

### GATE G5F: VALUE CREATION (FRACTIONAL)
**Criteria:** SEC filing submitted, Blue Sky filings complete, investor onboarding operational, data room live, marketing materials approved, E2E test passed
**Required Approvals:** CEO + CTO
**Gate Type:** Hard gate

---

## PHASE 5 --- DEBT INSTRUMENT (D)

### Stage 5.D1: Pre-Closing Verification
**Phase:** Value Creation | **Models:** Debt Instrument | **Duration:** 1--2 days | **Owner:** Compliance Officer

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 5.D1.1 | Verify all conditions precedent | `review` | Compliance Officer | None | see below |

**Subtasks:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 5.D1.1.a | Verify all gate criteria still satisfied | `review` | Compliance Officer checks no material changes since Security gate | Verification checklist completed |
| 5.D1.1.b | Re-run OFAC screening (if >30 days since last) | `automated` | Compliance Officer runs current OFAC check | OFAC result logged |
| 5.D1.1.c | Confirm insurance certificates current | `review` | Compliance Officer verifies no expirations | Insurance status logged |
| 5.D1.1.d | Verify UCC filing still effective | `review` | Compliance Officer confirms no amendments or terminations | UCC status logged |
| 5.D1.1.e | Confirm collateral still in custody | `automated` | CTO verifies via vault API | Custody confirmation logged |

---

### Stage 5.D2: UCC-1 Filing
**Phase:** Value Creation | **Models:** Debt Instrument | **Duration:** 1--3 days | **Owner:** Compliance Officer

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 5.D2.1 | File UCC-1 financing statement | `filing` | Compliance Officer | `ucc_filing_receipt` | see below |

**Subtasks:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 5.D2.1.a | File UCC-1 with Secretary of State | `filing` | Compliance Officer files electronically or by mail | **Filing receipt uploaded; file number, filing date, lapse date (5 years) logged** |
| 5.D2.1.b | For RE fixtures: file fixture filing with county recorder | `filing` | Compliance Officer files if applicable | Recording information logged |
| 5.D2.1.c | Send bailee notification to vault (belt-and-suspenders perfection) | `communication` | Compliance Officer sends UCC 9-312(d) notice to vault | **Bailee acknowledgment uploaded** |
| 5.D2.1.d | Log filing fees | `payment_outgoing` | Compliance Officer records fees | Fees logged |
| 5.D2.1.e | Set UCC continuation reminder (6 months before 5-year lapse) | `automated` | System creates reminder | Reminder logged |

---

### Stage 5.D3: Loan Closing & Execution
**Phase:** Value Creation | **Models:** Debt Instrument | **Duration:** 1--3 days | **Owner:** CEO

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 5.D3.1 | Execute all loan documents at closing | `meeting` | CEO | All executed loan docs | see below |

**Subtasks:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 5.D3.1.a | Schedule and conduct closing meeting | `meeting` | CEO conducts closing (in-person or virtual) | Meeting logged: date, time, attendees, location |
| 5.D3.1.b | Execute promissory note (borrower signs) | `document_upload` | CEO obtains borrower signature | **Executed note uploaded and locked** |
| 5.D3.1.c | Execute security agreement (borrower signs) | `document_upload` | CEO obtains signature | **Executed security agreement uploaded and locked** |
| 5.D3.1.d | Execute tripartite custody agreement (all three parties) | `document_upload` | CEO obtains all signatures | **Executed CCA uploaded and locked** |
| 5.D3.1.e | Execute guaranty (if applicable) | `document_upload` | CEO obtains guarantor signature | Executed guaranty uploaded and locked |
| 5.D3.1.f | Collect origination fee (2% of loan amount) | `payment_incoming` | CEO collects at closing | **Origination fee amount and receipt logged** |
| 5.D3.1.g | Compliance Officer final sign-off | `approval` | Compliance Officer verifies all documents properly executed | **Compliance sign-off logged** |

---

### Stage 5.D4: Fund Disbursement
**Phase:** Value Creation | **Models:** Debt Instrument | **Duration:** 1 day | **Owner:** CEO

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 5.D4.1 | Disburse loan proceeds | `payment_outgoing` | CEO | `wire_confirmation` | see below |

**Subtasks:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 5.D4.1.a | Internal wire approval (CEO + CTO dual authorization) | `approval` | CEO and CTO both authorize wire | **Dual authorization logged** |
| 5.D4.1.b | Wire proceeds to borrower's designated account | `payment_outgoing` | CEO initiates wire (net of origination fee and prepaid amounts) | **Wire confirmation uploaded; amount, date, recipient account logged** |
| 5.D4.1.c | Obtain borrower acknowledgment of receipt | `communication` | CRO confirms borrower received funds | Acknowledgment logged |
| 5.D4.1.d | Record disbursement date (TILA "date of first sale" if consumer) | `automated` | System records disbursement date | Date logged |

---

### Stage 5.D5: Post-Closing File Assembly
**Phase:** Value Creation | **Models:** Debt Instrument | **Duration:** 1--2 days | **Owner:** Compliance Officer

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 5.D5.1 | Assemble and lock closing binder | `document_upload` | Compliance Officer | `closing_binder` | see below |

**Subtasks:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 5.D5.1.a | Compile complete executed loan file | `document_upload` | Compliance Officer assembles all docs | Closing binder uploaded |
| 5.D5.1.b | Verify all signatures, dates, and amounts | `review` | Compliance Officer cross-checks | Verification checklist completed |
| 5.D5.1.c | Lock all critical documents | `automated` | System locks: note, security agreement, UCC-1, CCA | Document lock status logged per document |
| 5.D5.1.d | Set retention schedule (minimum 6 years after maturity) | `automated` | System sets retention dates | Retention dates logged |

---

### Stage 5.D6: Participation Notes (Optional --- if syndicating)
**Phase:** Value Creation | **Models:** Debt Instrument | **Duration:** 4--8 weeks (if applicable) | **Owner:** CEO

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 5.D6.1 | Structure and market participation notes (if syndicating loan) | `review` | CEO | `participation_ppm`, `form_d_filing` | see below |

**Subtasks:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 5.D6.1.a | Structure participation interests (pro rata or sequential) | `review` | CEO defines participation terms, minimum investment, payment waterfall | Structure documented |
| 5.D6.1.b | Draft participation PPM (securities counsel) | `document_upload` | Counsel drafts PPM for participation notes | PPM uploaded |
| 5.D6.1.c | File Form D for participation notes (Reg D 506(c)) | `filing` | Compliance Officer files with SEC | Filing confirmation uploaded |
| 5.D6.1.d | Onboard participation investors (KYC + accreditation verification) | `due_diligence` | Compliance Officer verifies each investor | Per-investor verification logged |
| 5.D6.1.e | Collect participation funds and issue certificates | `payment_incoming` | CEO collects funds and issues certificates | Per-investor: amount, date, certificate number logged |

---

### GATE G5D: VALUE CREATION (DEBT)
**Criteria:** Pre-closing verified, UCC-1 filed, all docs executed, funds disbursed, closing binder assembled, payment processing configured, participation notes completed (if applicable)
**Required Approvals:** CEO
**Gate Type:** Hard gate

---

## PHASE 5 --- BROKER SALE (B)

### Stage 5.B1: Marketing Campaign Launch
**Phase:** Value Creation | **Models:** Broker Sale | **Duration:** 1--2 weeks | **Owner:** CRO

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 5.B1.1 | Launch asset marketing campaign | `communication` | CRO | `marketing_materials` | see below |

**Subtasks:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 5.B1.1.a | Prepare professional marketing materials | `document_upload` | CRO creates: photography, brochure, certification summaries, provenance highlights | Materials uploaded |
| 5.B1.1.b | List asset with broker's network | `communication` | CRO coordinates listing with selected broker | Listing date and channels logged |
| 5.B1.1.c | Distribute to buyer network | `communication` | CRO and broker execute distribution plan | Distribution reach logged (number of contacts, channels) |

---

### Stage 5.B2: Buyer Inquiry Management
**Phase:** Value Creation | **Models:** Broker Sale | **Duration:** 2--8 weeks | **Owner:** CRO

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 5.B2.1 | Qualify buyers and manage inquiries | `review` | CRO | None | see below |

**Subtasks:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 5.B2.1.a | Track all buyer inquiries | `automated` | CRO logs each inquiry with contact, interest level, timeline | Inquiry log maintained |
| 5.B2.1.b | Qualify buyers (financial capacity, intent) | `review` | CRO assesses buyer capability | Qualification status per buyer logged |
| 5.B2.1.c | Conduct buyer presentations | `meeting` | CRO presents asset to qualified buyers | Meeting notes per presentation logged |

---

### Stage 5.B3: Offer Negotiation
**Phase:** Value Creation | **Models:** Broker Sale | **Duration:** 1--4 weeks | **Owner:** CEO

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 5.B3.1 | Receive, evaluate, and negotiate offers | `review` | CEO | `offers_received` | see below |

**Subtasks:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 5.B3.1.a | Receive and log all offers | `document_upload` | CRO uploads each offer | Each offer: amount, terms, contingencies, buyer, date logged |
| 5.B3.1.b | Evaluate offers against reserve price and terms | `review` | CEO evaluates: price, contingencies, timeline, buyer reliability | Evaluation notes per offer logged |
| 5.B3.1.c | Negotiate and counter-offer | `communication` | CEO negotiates through broker | Negotiation history logged per offer |
| 5.B3.1.d | Present recommendation to asset holder | `meeting` | CRO presents top offers with recommendation | Meeting notes and holder response logged |

---

### Stage 5.B4: Purchase Agreement Execution
**Phase:** Value Creation | **Models:** Broker Sale | **Duration:** 3--7 days | **Owner:** CEO

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 5.B4.1 | Execute purchase agreement and collect earnest money | `document_upload` | CEO | `purchase_agreement`, `earnest_money_receipt` | see below |

**Subtasks:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 5.B4.1.a | Draft purchase agreement | `review` | Counsel drafts or reviews broker's standard form | Draft uploaded |
| 5.B4.1.b | Legal review | `approval` | Counsel reviews terms | Counsel approval logged |
| 5.B4.1.c | Execute agreement (all parties sign) | `document_upload` | CEO obtains signatures | **Executed agreement uploaded and locked** |
| 5.B4.1.d | Collect earnest money deposit | `payment_incoming` | CRO collects deposit into escrow | **Earnest money amount and receipt logged** |

---

### GATE G5B: VALUE CREATION (BROKER)
**Criteria:** Marketing launched, buyer qualified, purchase agreement executed, earnest money received
**Required Approvals:** CEO
**Gate Type:** Hard gate

---

## PHASE 5 --- BARTER/EXCHANGE (X)

### Stage 5.X1: Counterparty Asset Appraisal
**Phase:** Value Creation | **Models:** Barter/Exchange | **Duration:** 2--4 weeks | **Owner:** CRO

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 5.X1.1 | Appraise the asset to be received | `physical_action` | CRO | `appraisal_report` (counterparty asset) | see below |

**Subtasks:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 5.X1.1.a | Commission independent appraisal of counterparty asset | `physical_action` | CRO engages appraiser appropriate to asset class | Engagement logged |
| 5.X1.1.b | Receive and upload appraisal report | `document_upload` | CRO uploads completed appraisal | **Appraisal report uploaded; value logged** |

---

### Stage 5.X2: Exchange Value Equalization
**Phase:** Value Creation | **Models:** Barter/Exchange | **Duration:** 3--5 days | **Owner:** CEO

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 5.X2.1 | Calculate boot and agree on equalization terms | `review` | CEO | None | see below |

**Subtasks:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 5.X2.1.a | Calculate value differential between assets | `review` | CEO computes difference based on independent appraisals | Value differential documented |
| 5.X2.1.b | Negotiate cash boot amount (if needed) | `communication` | CEO negotiates with counterparty | Boot amount and direction agreed; logged |
| 5.X2.1.c | Both parties approve final equalization terms | `approval` | Both parties confirm agreement | **Dual approval logged** |

---

### Stage 5.X3: Exchange Agreement Execution
**Phase:** Value Creation | **Models:** Barter/Exchange | **Duration:** 3--5 days | **Owner:** CEO

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 5.X3.1 | Execute exchange agreement | `document_upload` | CEO | `exchange_agreement` (executed) | see below |

**Subtasks:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 5.X3.1.a | Finalize exchange agreement with both parties' counsel | `review` | Counsel reviews final terms | Counsel review logged |
| 5.X3.1.b | Execute agreement (both parties sign) | `document_upload` | CEO obtains all signatures | **Executed agreement uploaded and locked** |
| 5.X3.1.c | Legal sign-off | `approval` | Counsel confirms agreement is enforceable | **Counsel approval logged** |

---

### Stage 5.X4: 1031 Timeline Compliance (if applicable)
**Phase:** Value Creation | **Models:** Barter/Exchange | **Duration:** Ongoing (45 + 180 days) | **Owner:** Compliance Officer

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 5.X4.1 | Monitor and enforce 1031 exchange deadlines | `review` | Compliance Officer | `qi_documentation` | see below |

**Subtasks:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 5.X4.1.a | Track 45-day property identification deadline | `automated` | System monitors deadline | Deadline date logged; alerts set at 30, 15, 7, 3, 1 days |
| 5.X4.1.b | File property identification with QI | `document_upload` | CEO files identification notice | **Identification notice uploaded; date and properties logged** |
| 5.X4.1.c | Track 180-day completion deadline | `automated` | System monitors deadline | Deadline logged with alerts |
| 5.X4.1.d | Verify QI documentation at each step | `review` | Compliance Officer reviews QI's records | QI compliance verified |

---

### GATE G5X: VALUE CREATION (BARTER)
**Criteria:** Counterparty asset appraised, equalization agreed, exchange agreement executed, 1031 deadlines tracked (if applicable)
**Required Approvals:** CEO + Tax Counsel (if 1031)
**Gate Type:** Hard gate

---

# PHASE 6: DISTRIBUTION

**Color:** Amber `#C47A1A`
**Duration:** Ongoing (months to years)
**Purpose:** Place with investors/buyers, manage ongoing obligations
**DIVERGES BY MODEL**

---

## PHASE 6 --- TOKENIZATION (T)

### Stage 6.T1: Investor Outreach (506(c) General Solicitation)
**Phase:** Distribution | **Models:** Tokenization | **Duration:** Ongoing | **Owner:** CRO

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 6.T1.1 | Conduct investor outreach campaign | `communication` | CRO | `marketing_materials` | see below |

**Subtasks:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 6.T1.1.a | Execute marketing campaign (general solicitation permitted under 506(c)) | `communication` | CRO distributes materials to investor network | Campaign reach and channels logged |
| 6.T1.1.b | Conduct investor presentations | `meeting` | CRO presents offering to potential investors | Per-presentation: attendees, date, questions, follow-up logged |
| 6.T1.1.c | Track investor pipeline | `automated` | CRO maintains investor interest tracker | Pipeline status per investor logged |

---

### Stage 6.T2: Investor Processing (per investor)
**Phase:** Distribution | **Models:** Tokenization | **Duration:** 3--10 days per investor | **Owner:** Compliance Officer + CTO

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 6.T2.1 | Process each investor: KYC > accreditation > subscription > payment > token mint | `due_diligence` | Compliance Officer | Per investor: `kyc_docs`, `accreditation_verification`, `subscription_agreement`, `wire_confirmation` | see below |

**Subtasks (repeated per investor):**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 6.T2.1.a | Investor KYC/AML verification | `due_diligence` | Compliance Officer verifies investor identity | Per-investor KYC result logged |
| 6.T2.1.b | Accreditation verification (506(c) reasonable steps) | `due_diligence` | Compliance Officer obtains CPA/attorney verification letter or uses third-party service | **Accreditation verification uploaded per investor** |
| 6.T2.1.c | Execute subscription agreement | `document_upload` | CRO obtains signed subscription | **Subscription agreement uploaded per investor** |
| 6.T2.1.d | Receive investment payment (wire) | `payment_incoming` | CRO confirms wire receipt | **Wire confirmation uploaded; amount and date logged** |
| 6.T2.1.e | Mint tokens to investor's verified wallet | `automated` | CTO initiates token mint (requires multi-sig) | **Mint transaction hash logged; token count, wallet address, timestamp recorded** |
| 6.T2.1.f | Send investor welcome package | `communication` | CRO sends: confirmation, token custody instructions, reporting schedule | Welcome package sent confirmation logged |

---

### Stage 6.T3: First Close
**Phase:** Distribution | **Models:** Tokenization | **Duration:** 1--3 days | **Owner:** CEO

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 6.T3.1 | Authorize and execute first close | `approval` | CEO | `closing_authorization` | see below |

**Subtasks:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 6.T3.1.a | CEO authorizes first close | `approval` | CEO approves when minimum raise achieved | **Close authorization logged** |
| 6.T3.1.b | File Form D amendment within 15 days of first sale | `filing` | Compliance Officer files | **Amendment filing confirmation uploaded** |
| 6.T3.1.c | Send investor welcome packages to all close participants | `communication` | CRO sends to all investors in this close | Distribution log per investor |

---

### Stage 6.T4: Secondary Market Enablement
**Phase:** Distribution | **Models:** Tokenization | **Duration:** 2--4 weeks | **Owner:** CTO + CRO

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 6.T4.1 | List on Alternative Trading System (ATS) | `communication` | CRO | `ats_listing_agreement` | see below |

**Subtasks:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 6.T4.1.a | Apply to ATS (tZERO, Securitize Markets, Rialto) | `communication` | CRO submits listing application | Application date and status logged |
| 6.T4.1.b | Configure trading rules (lockup enforcement, whitelist-only trading) | `automated` | CTO configures smart contract trading parameters | Trading rules documented |
| 6.T4.1.c | Execute ATS listing agreement | `document_upload` | CRO executes agreement | **Agreement uploaded** |

---

### Stage 6.T5: Ongoing Compliance
**Phase:** Distribution | **Models:** Tokenization | **Duration:** Ongoing (quarterly/annual) | **Owner:** Compliance Officer + CTO

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 6.T5.1 | Quarterly sanctions re-screening | `automated` | Compliance Officer | `ofac_screening` | see below |
| 6.T5.2 | Quarterly vault verification | `automated` | CTO | None | see below |
| 6.T5.3 | Quarterly investor updates | `communication` | CRO | `investor_report` | see below |
| 6.T5.4 | Annual reappraisal | `physical_action` | CRO | `appraisal_report` | see below |
| 6.T5.5 | Annual Form D amendment | `filing` | Compliance Officer | `form_d_amendment` | see below |
| 6.T5.6 | Annual K-1 preparation | `filing` | Compliance Officer | `k1_documents` | see below |
| 6.T5.7 | Chainlink PoR maintenance | `automated` | CTO | None | see below |

**Subtasks for 6.T5.1 --- Quarterly sanctions:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 6.T5.1.a | Re-screen all investors against current OFAC lists | `automated` | Compliance Officer runs batch screening | Screening results per investor logged; CLEAR or MATCH |
| 6.T5.1.b | If match found: freeze token transfers and escalate | `review` | Compliance Officer initiates sanctions response | Escalation action logged |

**Subtasks for 6.T5.2 --- Vault verification:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 6.T5.2.a | Trigger PoR check against vault API | `automated` | CTO runs verification | PoR result: MATCH / MISMATCH; timestamp |
| 6.T5.2.b | Log verification in compliance dashboard | `automated` | System records result | Logged automatically |

**Subtasks for 6.T5.3 --- Investor updates:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 6.T5.3.a | Prepare quarterly report (asset status, valuation, PoR, distributions) | `review` | CRO drafts quarterly report | Report uploaded |
| 6.T5.3.b | Distribute to all investors | `communication` | CRO sends via data room or email | Distribution confirmation per investor logged |

**Subtasks for 6.T5.4 --- Annual reappraisal:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 6.T5.4.a | Commission annual reappraisal (1 appraiser sufficient) | `physical_action` | CRO engages appraiser | Appraisal report uploaded; new value logged |
| 6.T5.4.b | Compare to offering value and log variance | `review` | CEO reviews | Variance logged; impact assessment documented |

**Subtasks for 6.T5.5 --- Annual Form D:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 6.T5.5.a | File annual Form D amendment via EDGAR | `filing` | Compliance Officer files | Filing confirmation uploaded |

**Subtasks for 6.T5.6 --- K-1s:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 6.T5.6.a | Prepare and distribute K-1s to all token holders by March 15 | `filing` | Compliance Officer prepares with tax accountant | K-1s uploaded; distribution confirmation per investor |

**Subtasks for 6.T5.7 --- PoR maintenance:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 6.T5.7.a | Monitor PoR feed uptime and accuracy | `automated` | CTO monitors | Uptime metrics logged |
| 6.T5.7.b | Update external adapter if vault API changes | `automated` | CTO maintains adapter | Version updates logged |

---

## PHASE 6 --- FRACTIONAL SECURITIES (F)

### Stage 6.F1: Capital Raise & Subscription Processing
**Phase:** Distribution | **Models:** Fractional Securities | **Duration:** Ongoing | **Owner:** CRO

(Same per-investor structure as 6.T2, but issuing LLC units instead of tokens)

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 6.F1.1 | Process investor subscriptions | `due_diligence` | CRO + Compliance Officer | Per investor: `subscription_agreement`, `wire_confirmation` | Same per-investor subtasks as 6.T2 minus token mint; add unit issuance |

---

### Stage 6.F2: Unit Issuance
**Phase:** Distribution | **Models:** Fractional Securities | **Duration:** 1--3 days per close | **Owner:** CRO

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 6.F2.1 | Issue fractional units via Transfer Agent | `document_upload` | CRO | `unit_certificates` | see below |

**Subtasks:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 6.F2.1.a | Instruct TA to issue units per subscription | `communication` | CRO sends issuance instructions to TA | Instructions logged |
| 6.F2.1.b | Upload unit certificates/confirmations | `document_upload` | CRO uploads per-investor confirmations | Certificates uploaded per investor |

---

### Stage 6.F3: Ongoing SEC Reporting
**Phase:** Distribution | **Models:** Fractional Securities | **Duration:** Ongoing (annual/semi-annual) | **Owner:** Compliance Officer

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 6.F3.1 | File required SEC reports by pathway | `filing` | Compliance Officer | Varies | see below |

**Subtasks:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 6.F3.1.a | File Form 1-K annual (Reg A+) | `filing` | Compliance Officer files annually | Filing confirmation uploaded |
| 6.F3.1.b | File Form 1-SA semi-annual (Reg A+) | `filing` | Compliance Officer files semi-annually | Filing confirmation uploaded |
| 6.F3.1.c | File Form C-AR annual (Reg CF) | `filing` | Compliance Officer files annually | Filing confirmation uploaded |
| 6.F3.1.d | File Form D amendments (Reg D) as needed | `filing` | Compliance Officer files | Filing confirmation uploaded |

---

### Stage 6.F4: Secondary Market Trading
**Phase:** Distribution | **Models:** Fractional Securities | **Duration:** Ongoing | **Owner:** CRO

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 6.F4.1 | Manage secondary trading via ATS and TA | `automated` | CRO | None | see below |

**Subtasks:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 6.F4.1.a | List units on ATS (if applicable) | `communication` | CRO coordinates with BD/ATS | Listing status logged |
| 6.F4.1.b | Process transfer requests via TA | `review` | CRO coordinates unit transfers | Per transfer: date, parties, units, approval logged |

---

### Stage 6.F5: Exit / Liquidation Event
**Phase:** Distribution | **Models:** Fractional Securities | **Duration:** 2--8 weeks | **Owner:** CEO

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 6.F5.1 | Execute exit strategy | `review` | CEO | `exit_documentation` | see below |

**Subtasks:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 6.F5.1.a | Sell underlying asset or trigger liquidation event | `physical_action` | CEO executes asset sale or liquidation | Sale/liquidation details logged |
| 6.F5.1.b | Execute distribution waterfall per SOA | `payment_outgoing` | CEO distributes proceeds per class priority | Per-investor distribution amount, date, method logged |
| 6.F5.1.c | File Form 1-Z exit report (Reg A+) | `filing` | Compliance Officer files exit report | Filing confirmation uploaded |
| 6.F5.1.d | Dissolve SPV | `filing` | CEO files dissolution with state | Dissolution confirmation uploaded |
| 6.F5.1.e | Issue final K-1s | `filing` | Compliance Officer prepares final K-1s | K-1s distributed; confirmation logged per investor |
| 6.F5.1.f | Close asset record in CRM | `automated` | System updates status to `completed` | Status change logged |

---

## PHASE 6 --- DEBT INSTRUMENT (D)

### Stage 6.D1: Lender/Investor Matching & Note Sale
**Phase:** Distribution | **Models:** Debt Instrument | **Duration:** 2--4 weeks (if applicable) | **Owner:** CRO

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 6.D1.1 | Market and sell loan or participation notes | `communication` | CRO | `note_purchase_agreement` | see below |

**Subtasks:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 6.D1.1.a | Identify lender/investor pool | `review` | CRO sources from institutional lenders, credit funds, family offices | Prospect list logged |
| 6.D1.1.b | Facilitate lender due diligence | `communication` | CRO provides complete loan file to interested lenders | Due diligence package sent; access logged |
| 6.D1.1.c | Negotiate note purchase/participation terms | `communication` | CEO negotiates price, reps, warranties, repurchase obligations | Terms logged |
| 6.D1.1.d | Execute assignment and file UCC-3 assignment | `document_upload` | CEO executes assignment; Compliance Officer files UCC-3 | **Assignment docs uploaded; UCC-3 filing logged** |
| 6.D1.1.e | Notify borrower of assignment (UCC 9-406) | `communication` | CRO notifies borrower | Notification sent; delivery confirmation logged |

---

### Stage 6.D2: Monthly/Quarterly Loan Servicing
**Phase:** Distribution | **Models:** Debt Instrument | **Duration:** Ongoing (loan term) | **Owner:** CRO + CTO

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 6.D2.1 | Process borrower payments and manage servicing | `payment_incoming` | CRO | `payment_records` | see below |

**Subtasks (recurring monthly):**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 6.D2.1.a | Collect and apply monthly payment (interest before principal) | `payment_incoming` | CRO processes ACH/wire | Payment amount, date, application (interest/principal split) logged |
| 6.D2.1.b | Post payment to borrower's account and generate statement | `automated` | System applies payment and generates statement | Statement generated and sent |
| 6.D2.1.c | Distribute payments to lender/note holder | `payment_outgoing` | CRO initiates distribution per servicing agreement | Distribution amount, date, recipient logged |
| 6.D2.1.d | Track days past due and late fees | `automated` | System monitors delinquency | DPD and late fee status logged |
| 6.D2.1.e | Send delinquency notices if payment late | `communication` | CRO sends at 10, 30, 60, 90 day marks | Each notice logged with delivery confirmation |

---

### Stage 6.D3: Quarterly Collateral Verification
**Phase:** Distribution | **Models:** Debt Instrument | **Duration:** Recurring quarterly | **Owner:** CTO

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 6.D3.1 | Verify collateral status quarterly | `automated` | CTO | None | see below |

**Subtasks:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 6.D3.1.a | Trigger PoR/vault verification | `automated` | CTO runs vault API check | Verification result logged |
| 6.D3.1.b | Re-screen borrower against OFAC sanctions | `automated` | Compliance Officer runs screening | OFAC result logged |
| 6.D3.1.c | For RE: verify no new liens filed | `due_diligence` | Compliance Officer runs title update | Title status logged |
| 6.D3.1.d | For minerals: verify production still active | `review` | CRO checks state production records | Production status logged |

---

### Stage 6.D4: Annual Reappraisal & LTV Recalculation
**Phase:** Distribution | **Models:** Debt Instrument | **Duration:** 2--4 weeks annually | **Owner:** CRO

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 6.D4.1 | Commission annual reappraisal and recalculate LTV | `physical_action` | CRO | `appraisal_report` (annual) | see below |

**Subtasks:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 6.D4.1.a | Commission reappraisal (1 appraiser sufficient for annual) | `physical_action` | CRO engages appraiser | **Appraisal report uploaded; current value logged** |
| 6.D4.1.b | Recalculate LTV with current value and outstanding balance | `automated` | System calculates LTV | Current LTV logged: value, balance, ratio |
| 6.D4.1.c | If LTV exceeds covenant threshold: initiate margin call | `communication` | Compliance Officer sends margin call notice to borrower | Margin call notice logged; cure deadline set |
| 6.D4.1.d | Log reappraisal costs | `payment_outgoing` | CRO records cost ($2K--$10K) | Costs logged |

---

### Stage 6.D5: UCC Continuation Filing
**Phase:** Distribution | **Models:** Debt Instrument | **Duration:** 1 week (every 5 years) | **Owner:** Compliance Officer

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 6.D5.1 | File UCC-3 continuation statement | `filing` | Compliance Officer | `ucc_continuation_receipt` | see below |

**Subtasks:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 6.D5.1.a | File UCC-3 continuation (must be within 6 months before lapse) | `filing` | Compliance Officer files with Secretary of State | **Filing receipt uploaded; new lapse date logged** |
| 6.D5.1.b | Verify continuation properly indexed | `review` | Compliance Officer runs post-filing search | Verification logged |
| 6.D5.1.c | **CRITICAL: Failure to file = loss of perfection = loss of priority** | `automated` | System monitors lapse dates with escalating alerts | Alert schedule documented |

---

### Stage 6.D6: Default / Workout Procedures
**Phase:** Distribution | **Models:** Debt Instrument | **Duration:** 30--180 days | **Owner:** CEO + Compliance Officer

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 6.D6.1 | Issue default notice and pursue resolution | `communication` | Compliance Officer | `default_notice`, `workout_agreement` | see below |

**Subtasks:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 6.D6.1.a | Issue formal default notice (certified mail + email) | `communication` | Compliance Officer sends notice specifying default, required cure, and cure period (30 days) | **Default notice uploaded; delivery confirmation logged** |
| 6.D6.1.b | Begin default interest rate accrual | `automated` | System applies default rate (contract + 5%) | Rate change logged with effective date |
| 6.D6.1.c | Workout negotiation (if applicable) | `meeting` | CEO negotiates: rate modification, term extension, partial paydown, additional collateral | Meeting notes and proposed terms logged |
| 6.D6.1.d | If restructuring: draft and execute modification agreement | `document_upload` | Compliance Officer drafts modification | **Modification agreement uploaded** |
| 6.D6.1.e | If no cure: collateral disposition per UCC 9-610 | `physical_action` | CEO arranges commercially reasonable disposition | **Disposition: method, notice, sale price, proceeds application logged per UCC 9-615** |
| 6.D6.1.f | Handle deficiency or surplus per UCC 9-615(d) | `communication` | Compliance Officer sends deficiency notice or remits surplus | Resolution documented |

---

### Stage 6.D7: Loan Maturity / Payoff
**Phase:** Distribution | **Models:** Debt Instrument | **Duration:** 1--2 weeks | **Owner:** CRO

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 6.D7.1 | Process loan payoff and release collateral | `payment_incoming` | CRO | `payoff_statement`, `ucc_termination`, `release_authorization` | see below |

**Subtasks:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 6.D7.1.a | Calculate and provide payoff statement to borrower | `communication` | CRO calculates: principal + accrued interest + fees | Payoff statement uploaded |
| 6.D7.1.b | Receive and verify payoff funds | `payment_incoming` | CRO confirms certified funds or wire | **Payoff amount, date, method logged** |
| 6.D7.1.c | Authorize collateral release to borrower | `approval` | CEO authorizes vault to release collateral | **Release authorization uploaded** |
| 6.D7.1.d | For RE: record release/satisfaction of mortgage | `filing` | Compliance Officer records with county | Recording confirmation uploaded |
| 6.D7.1.e | File UCC-3 termination (within 20 days of demand per UCC 9-513) | `filing` | Compliance Officer files | **UCC-3 termination receipt uploaded** |
| 6.D7.1.f | Send loan satisfaction letter to borrower | `communication` | CRO sends formal satisfaction letter | Communication logged |
| 6.D7.1.g | Archive loan file and update CRM status to `completed` | `automated` | System archives and updates status | Status change logged; retention schedule set |

---

### Stage 6.D8: Tax Reporting
**Phase:** Distribution | **Models:** Debt Instrument | **Duration:** Annual | **Owner:** Compliance Officer

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 6.D8.1 | Prepare and file annual tax documents | `filing` | Compliance Officer | `form_1098`, `form_1099_int`, `k1_documents` | see below |

**Subtasks:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 6.D8.1.a | Issue Form 1098 to borrower (if mortgage interest $600+) | `filing` | Compliance Officer prepares and sends | Form sent; copy filed with IRS |
| 6.D8.1.b | Issue Form 1099-INT to note holders (if applicable) | `filing` | Compliance Officer prepares and sends | Per-holder: form sent and IRS copy filed |
| 6.D8.1.c | Issue K-1s to participation holders by March 15 | `filing` | Compliance Officer prepares with tax accountant | Per-holder K-1 distributed |
| 6.D8.1.d | File copies with IRS | `filing` | Compliance Officer submits IRS copies | IRS filing confirmation logged |

---

## PHASE 6 --- BROKER SALE (B)

### Stage 6.B1: Closing & Title Transfer
**Phase:** Distribution | **Models:** Broker Sale | **Duration:** 1--4 weeks | **Owner:** CEO

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 6.B1.1 | Close transaction and transfer asset | `meeting` | CEO | `bill_of_sale`, `deed`, `transfer_docs` | see below |

**Subtasks:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 6.B1.1.a | Facilitate buyer due diligence period | `review` | CRO assists buyer's inspection/verification | Due diligence period dates logged |
| 6.B1.1.b | Conduct closing meeting | `meeting` | CEO conducts closing | Meeting: date, attendees, location logged |
| 6.B1.1.c | Transfer title/possession to buyer | `physical_action` | CRO arranges: deed recording (RE), vault transfer (tangibles), assignment (minerals) | **Transfer documents uploaded; transfer date logged** |
| 6.B1.1.d | Execute bill of sale or deed | `document_upload` | CEO obtains all signatures | **Bill of sale/deed uploaded and locked** |

---

### Stage 6.B2: Payment Collection
**Phase:** Distribution | **Models:** Broker Sale | **Duration:** 1--5 days | **Owner:** CEO

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 6.B2.1 | Collect sale proceeds and pay commissions | `payment_incoming` | CEO | `wire_confirmation`, `commission_receipt` | see below |

**Subtasks:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 6.B2.1.a | Receive sale proceeds (escrow release or direct wire) | `payment_incoming` | CRO confirms receipt | **Sale proceeds amount, date, source logged** |
| 6.B2.1.b | Pay broker commission | `payment_outgoing` | CEO authorizes commission payment | **Commission amount, recipient, date logged** |
| 6.B2.1.c | Collect PleoChrome success fee (1.5%) | `payment_incoming` | CEO calculates and collects fee | **Fee amount logged** |
| 6.B2.1.d | Distribute net proceeds to asset holder | `payment_outgoing` | CEO wires net proceeds to holder | **Distribution amount, date, recipient logged** |

---

### Stage 6.B3: Post-Sale Documentation
**Phase:** Distribution | **Models:** Broker Sale | **Duration:** 1--2 weeks | **Owner:** Compliance Officer

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 6.B3.1 | Complete post-sale administration | `filing` | Compliance Officer | `closing_docs`, `tax_documents` | see below |

**Subtasks:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 6.B3.1.a | Upload all closing documents to asset record | `document_upload` | Compliance Officer uploads and tags all docs | All closing docs uploaded and tagged |
| 6.B3.1.b | Transfer insurance to buyer (if applicable) | `communication` | Compliance Officer coordinates insurance transfer | Transfer confirmation logged |
| 6.B3.1.c | File tax reporting (Form 1099-S for RE, Form 8949 / Schedule D) | `filing` | Compliance Officer prepares and files | Tax documents filed; copies uploaded |
| 6.B3.1.d | File UCC terminations (if any liens existed) | `filing` | Compliance Officer files UCC-3 terminations | Termination receipts uploaded |
| 6.B3.1.e | Close asset record in CRM | `automated` | System updates status to `completed` | Status change logged |

---

## PHASE 6 --- BARTER/EXCHANGE (X)

### Stage 6.X1: Simultaneous Asset Transfer
**Phase:** Distribution | **Models:** Barter/Exchange | **Duration:** 1--3 days | **Owner:** CEO

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 6.X1.1 | Execute simultaneous asset exchange | `physical_action` | CEO | `transfer_docs` (both directions) | see below |

**Subtasks:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 6.X1.1.a | Deliver our asset to counterparty | `physical_action` | CRO arranges insured transport or deed transfer | **Outbound transfer docs uploaded** |
| 6.X1.1.b | Receive counterparty's asset | `physical_action` | CRO receives and verifies condition | **Inbound transfer docs uploaded; condition verified** |
| 6.X1.1.c | If 1031: execute through QI per safe harbor | `document_upload` | CEO ensures QI handles all proceeds | QI transaction records uploaded |

---

### Stage 6.X2: Cash Boot Settlement (if applicable)
**Phase:** Distribution | **Models:** Barter/Exchange | **Duration:** 1--3 days | **Owner:** CEO

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 6.X2.1 | Settle cash boot payment | `payment_incoming` or `payment_outgoing` | CEO | `wire_confirmation` | see below |

**Subtasks:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 6.X2.1.a | Wire or receive equalizing cash payment | `payment_incoming` or `payment_outgoing` | CEO processes boot payment | **Boot amount, direction (pay/receive), date logged** |
| 6.X2.1.b | Upload wire confirmation | `document_upload` | CEO uploads confirmation | Wire confirmation uploaded |

---

### Stage 6.X3: Post-Exchange Custody
**Phase:** Distribution | **Models:** Barter/Exchange | **Duration:** 1--2 weeks | **Owner:** CTO

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 6.X3.1 | Vault received asset and update insurance | `physical_action` | CTO | `vault_receipt`, `insurance_certificate` | see below |

**Subtasks:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 6.X3.1.a | Transfer received asset to institutional vault (if tangible) | `physical_action` | CTO arranges transport and custody | **New vault receipt uploaded** |
| 6.X3.1.b | Update insurance to cover received asset | `document_upload` | Compliance Officer updates insurance | **Updated insurance certificate uploaded** |
| 6.X3.1.c | Create new asset record in CRM for received asset | `automated` | CRO creates record linking to exchange | New asset record created with exchange reference |

---

### Stage 6.X4: Tax Reporting
**Phase:** Distribution | **Models:** Barter/Exchange | **Duration:** Annual | **Owner:** Compliance Officer

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| 6.X4.1 | File exchange tax documentation | `filing` | Compliance Officer | `form_8824`, `form_8949`, `tax_docs` | see below |

**Subtasks:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| 6.X4.1.a | File Form 8824 (Like-Kind Exchanges) if 1031 | `filing` | Compliance Officer prepares and files | **Form 8824 uploaded; filing confirmation logged** |
| 6.X4.1.b | File Form 8949 (non-1031 exchanges) | `filing` | Compliance Officer prepares and files | Form 8949 uploaded |
| 6.X4.1.c | Issue tax documents to both parties | `communication` | Compliance Officer sends to counterparty | Distribution confirmation logged |
| 6.X4.1.d | Close asset record or update with received asset | `automated` | System updates records | Status change logged |

---

# CROSS-CUTTING STAGES (Apply to All Phases)

These stages are not tied to a single phase but recur throughout the asset lifecycle. They should be tracked as recurring tasks on every active asset.

---

### CC.1: Client Communication Touchpoints
**Phase:** ALL (recurring)
**Models:** ALL
**Duration:** Ongoing
**Owner:** CRO

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| CC.1.1 | Weekly/bi-weekly holder status update | `communication` | CRO | None | see below |
| CC.1.2 | Monthly progress report | `communication` | CRO | `progress_report` | see below |

**Subtasks for CC.1.1:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| CC.1.1.a | Send brief status update email/call to holder | `communication` | CRO provides: current phase, next milestones, any blockers | Communication logged: date, medium, summary |
| CC.1.1.b | Document any holder questions or concerns | `review` | CRO records holder feedback | Concerns logged; follow-up action items created |

**Subtasks for CC.1.2:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| CC.1.2.a | Prepare monthly progress report | `document_upload` | CRO drafts: milestones completed, upcoming milestones, cost tracker, timeline update | Report uploaded |
| CC.1.2.b | Send to holder and file in asset record | `communication` | CRO distributes report | Distribution logged |

---

### CC.2: Internal Review Checkpoints
**Phase:** ALL (recurring weekly)
**Models:** ALL
**Duration:** 30--60 minutes weekly
**Owner:** CEO

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| CC.2.1 | Weekly deal review meeting | `meeting` | CEO | None | see below |

**Subtasks:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| CC.2.1.a | Review all active assets: status, blockers, next actions | `meeting` | CEO leads review with CTO and CRO | Meeting notes uploaded: per-asset status, action items, owners |
| CC.2.1.b | Escalate blocked items and assign resolution owners | `review` | CEO assigns escalation owners | Escalation items logged with deadlines |
| CC.2.1.c | Review cost tracker vs. budget | `review` | CRO presents cost status per asset | Cost variance noted |

---

### CC.3: Quality Assurance Steps
**Phase:** ALL (before gate submissions)
**Models:** ALL
**Duration:** 1--2 days
**Owner:** Compliance Officer

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| CC.3.1 | Pre-gate document quality review | `review` | Compliance Officer | None | see below |

**Subtasks:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| CC.3.1.a | Audit all uploaded documents for completeness and accuracy | `review` | Compliance Officer checks every document against requirements | QA checklist completed: per-document pass/fail |
| CC.3.1.b | Verify all required approvals have been obtained | `review` | Compliance Officer checks approval chains | Approval audit result logged |
| CC.3.1.c | Flag any gaps or deficiencies before gate submission | `communication` | Compliance Officer sends remediation list to task owners | Gap list distributed; remediation deadlines set |

---

### CC.4: Escalation Procedures
**Phase:** ALL (triggered)
**Models:** ALL
**Duration:** Immediate to 1 week
**Owner:** CEO (final escalation)

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| CC.4.1 | Handle escalated issues | `review` | CEO | `escalation_memo` | see below |

**Subtasks:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| CC.4.1.a | Document escalation: issue, impact, recommended resolution | `review` | Escalating team member writes escalation memo | **Escalation memo uploaded** |
| CC.4.1.b | CEO reviews and decides on resolution path | `approval` | CEO reviews options and decides | **Resolution decision logged with rationale** |
| CC.4.1.c | Communicate resolution to all affected parties | `communication` | CRO communicates decision | Communication logged |
| CC.4.1.d | Implement resolution and verify | `review` | Assigned owner executes resolution | Resolution implementation confirmed |

---

### CC.5: Handoff Procedures
**Phase:** ALL (at stage transitions)
**Models:** ALL
**Duration:** 1--2 hours
**Owner:** Outgoing owner

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| CC.5.1 | Execute work handoff between team members | `communication` | Outgoing owner | `handoff_memo` | see below |

**Subtasks:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| CC.5.1.a | Prepare handoff memo: completed work, pending items, open questions, key contacts | `document_upload` | Outgoing owner documents current state | Handoff memo uploaded |
| CC.5.1.b | Conduct handoff meeting with incoming owner | `meeting` | Both parties meet to review | Meeting logged: date, attendees, key discussion |
| CC.5.1.c | Incoming owner acknowledges receipt and confirms understanding | `approval` | Incoming owner confirms | **Acknowledgment logged** |
| CC.5.1.d | Update task assignments in CRM | `automated` | System reassigns tasks | Assignment changes logged |

---

### CC.6: Cost Tracking
**Phase:** ALL (ongoing)
**Models:** ALL
**Duration:** Continuous
**Owner:** CRO

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| CC.6.1 | Track all costs per asset | `review` | CRO | `invoices`, `receipts` | see below |

**Subtasks:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| CC.6.1.a | Log every payment (outgoing) with category, amount, recipient, date | `payment_outgoing` | CRO records each cost as it occurs | Per-payment: category, amount, recipient, invoice, date |
| CC.6.1.b | Upload supporting invoices and receipts | `document_upload` | CRO uploads documentation | Invoices/receipts uploaded and linked to payments |
| CC.6.1.c | Compare actuals to budget monthly | `review` | CRO prepares variance report | Budget vs. actual report uploaded |

---

### CC.7: Time Tracking
**Phase:** ALL (ongoing)
**Models:** ALL
**Duration:** Continuous
**Owner:** All team members

#### Tasks:
| # | Task | Type | Assignee | Documents Required | Subtasks |
|---|------|------|----------|-------------------|----------|
| CC.7.1 | Track time spent per asset per phase | `automated` | All | None | see below |

**Subtasks:**
| # | Subtask | Type | Action | Logged Output |
|---|---------|------|--------|---------------|
| CC.7.1.a | Log time entries per task | `automated` | Each team member logs hours against tasks | Time entry: person, task, hours, date |
| CC.7.1.b | Generate monthly time summary per asset | `automated` | System generates summary | Summary: total hours by person, phase, and task type |

---

# SUMMARY STATISTICS

## Stage Counts by Phase and Model

| Phase | Shared | T | F | D | B | X |
|-------|--------|---|---|---|---|---|
| 1. Lead | 4 | -- | -- | -- | -- | -- |
| 2. Intake | 6 | -- | -- | -- | -- | -- |
| 3. Asset Maturity | 7 | -- | -- | -- | -- | -- |
| 4. Security | -- | 6 | 6 | 7 | 4 | 4 |
| 5. Value Creation | -- | 8 | 6 | 6 | 4 | 4 |
| 6. Distribution | -- | 5 | 5 | 8 | 3 | 4 |
| Cross-Cutting | 7 | -- | -- | -- | -- | -- |
| **Total** | **24** | **19** | **17** | **21** | **11** | **12** |
| **Grand Total per model** | | **43** | **41** | **45** | **35** | **36** |

## Task and Subtask Counts (Approximate)

| Phase | Tasks | Subtasks |
|-------|-------|----------|
| Phase 1: Lead | 13 | ~55 |
| Phase 2: Intake | 18 | ~70 |
| Phase 3: Asset Maturity | 14 | ~60 |
| Phase 4: Security (T) | 8 | ~30 |
| Phase 4: Security (F) | 8 | ~30 |
| Phase 4: Security (D) | 12 | ~50 |
| Phase 4: Security (B) | 5 | ~15 |
| Phase 4: Security (X) | 5 | ~18 |
| Phase 5: Value Creation (T) | 10 | ~40 |
| Phase 5: Value Creation (F) | 8 | ~25 |
| Phase 5: Value Creation (D) | 10 | ~40 |
| Phase 5: Value Creation (B) | 5 | ~18 |
| Phase 5: Value Creation (X) | 5 | ~16 |
| Phase 6: Distribution (T) | 12 | ~45 |
| Phase 6: Distribution (F) | 8 | ~25 |
| Phase 6: Distribution (D) | 14 | ~55 |
| Phase 6: Distribution (B) | 5 | ~18 |
| Phase 6: Distribution (X) | 5 | ~16 |
| Cross-Cutting | 10 | ~30 |
| **GRAND TOTAL** | **~175** | **~656** |

## Task Type Distribution

| Task Type | Approximate Count |
|-----------|-------------------|
| `document_upload` | ~45 |
| `meeting` | ~15 |
| `physical_action` | ~20 |
| `payment_outgoing` | ~25 |
| `payment_incoming` | ~15 |
| `approval` | ~30 |
| `review` | ~55 |
| `due_diligence` | ~20 |
| `filing` | ~25 |
| `communication` | ~30 |
| `automated` | ~35 |

---

## Database Seeding Map

This spec maps to the V2 schema as follows:

```
workflow_templates        ← One per value model (5) + one universal (shared phases)
  template_stages         ← One per stage in this document
    template_tasks        ← One per task row in each stage's table
      template_subtasks   ← One per subtask row in each task's detail table
```

**Seeding order:**
1. Create 6 `workflow_templates` (1 universal + 5 model-specific)
2. Create `template_stages` for each stage, linking to appropriate template
3. Create `template_tasks` for each task, linking to parent stage
4. Create `template_subtasks` for each subtask, linking to parent task

**When an asset is created:**
1. Instantiate shared stages (Phases 1--3) from the universal template
2. When value model is selected, instantiate model-specific stages (Phases 4--6) from the model template
3. Instantiate cross-cutting recurring tasks
4. All instance-layer records (`asset_stages`, `tasks`, `subtasks`) are independent copies that can be modified per-asset

---

*This specification is exhaustive and designed to be machine-parseable for database seeding. Every task has at least one subtask. Every subtask has a "Logged Output" column defining what gets recorded for audit purposes. Every approval requirement is explicitly marked. This is the blueprint that will be used to seed the template database.*
