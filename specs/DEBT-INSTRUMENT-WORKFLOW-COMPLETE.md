# PleoChrome — Asset-Backed Debt Instrument Workflow
# Complete Granular Specification for CRM Template Seeding
**Date:** 2026-03-29
**Scope:** All asset classes (gemstones, precious metals, real estate, mineral rights)
**Workflows:** Debt Instrument (primary), Broker Sale, Barter/Exchange

---

## Architecture Alignment

This spec maps to the existing three-layer governance model:
- **Layer 1** (governance_requirements): The regulatory "why" for each step
- **Layer 2** (default_tasks / module_tasks): The operational "how" — specific tasks
- **Layer 3** (asset_task_instances): Execution records per asset

Each stage below produces:
1. Governance requirements (immutable regulatory backbone)
2. Default tasks per requirement (operational subtasks)
3. Required documents per requirement
4. Gate criteria for phase transitions

---

## STAGE 1: LEAD
**Phase:** `phase_0_foundation` / `phase_1_intake`
**Color:** Emerald `#1B6B4A`
**Estimated Duration:** 1–3 weeks
**Purpose:** Source, qualify, and screen potential asset-backed debt opportunities

### 1.1 Initial Outreach & Source Identification
**Governance Basis:** Securities offerings and lending transactions require documented sourcing to establish clean business origination and prevent predatory practices.
**Regulatory Citation:** Fair Lending Act (ECOA) 15 U.S.C. 1691; FTC Act Section 5 (unfair practices)
**Duration:** 1–5 days

**Default Tasks:**
| # | Task | Type | Subtasks | Assigned Role |
|---|------|------|----------|---------------|
| 1.1.1 | Identify asset holder through dealer network, vault inventory, or direct referral | action | - Search dealer pipeline<br>- Review vault partner inventory reports<br>- Check inbound inquiry queue<br>- Tag source channel (referral/dealer/direct/broker) | cro |
| 1.1.2 | Confirm asset class eligibility | review | - Verify asset is in supported class (gemstone, precious metal, real estate, mineral rights)<br>- Confirm minimum value threshold ($250K for debt, $1M for securities)<br>- Check asset type against lending policy (LTV caps by class) | cro |
| 1.1.3 | Record lead in CRM pipeline | action | - Create asset record with status `prospect`<br>- Enter holder contact information<br>- Log source channel and referral attribution<br>- Assign initial pipeline stage | cro |

**Required Documents:** None (lead stage)

---

### 1.2 Holder Qualification & Screening
**Governance Basis:** KYC/AML obligations apply from first substantive contact. Dealers in Precious Metals, Stones, or Jewels (DPMS) have heightened AML requirements under FinCEN regulations. Real estate transactions trigger FinCEN Geographic Targeting Orders in certain jurisdictions.
**Regulatory Citation:** BSA 31 USC 5311-5332; FinCEN 31 CFR Part 1027 (DPMS); FinCEN GTOs (real estate)
**Duration:** 3–7 days

**Default Tasks:**
| # | Task | Type | Subtasks | Assigned Role |
|---|------|------|----------|---------------|
| 1.2.1 | Execute mutual NDA with asset holder | upload | - Send NDA template<br>- Negotiate any modifications<br>- Obtain wet or e-signature<br>- File executed NDA in document library | compliance_officer |
| 1.2.2 | Preliminary KYC/KYB screening | action | - Individual: government ID verification, address verification<br>- Entity: articles of organization, beneficial ownership (>25% owners per FinCEN CDD Rule)<br>- OFAC/SDN list screening<br>- PEP (Politically Exposed Person) check<br>- Adverse media scan | compliance_officer |
| 1.2.3 | Holder sophistication assessment | review | - Assess borrower experience with secured lending<br>- Evaluate understanding of collateral custody requirements<br>- Document holder's intended use of loan proceeds<br>- Determine business-purpose vs. consumer-purpose loan classification | cro |
| 1.2.4 | Preliminary title/ownership verification | action | - Request proof of ownership (bill of sale, chain of custody, deed, mineral lease)<br>- For gemstones: verify holder appears on existing lab reports<br>- For real estate: preliminary title search<br>- For mineral rights: verify lease/deed and current production status<br>- Flag any liens, encumbrances, or competing claims | compliance_officer |

**Required Documents:** `nda`, `kyc_report`, `ofac_screening`, `pep_screening`

---

### 1.3 Asset Screening & Preliminary Assessment
**Governance Basis:** Responsible lending requires preliminary assessment of collateral quality before committing resources to full underwriting. Prevents predatory lending on insufficient collateral.
**Regulatory Citation:** OCC Lending Standards (12 CFR 30, Appendix A); FDIC Interagency Guidelines on Real Estate Lending
**Duration:** 3–5 days

**Default Tasks:**
| # | Task | Type | Subtasks | Assigned Role |
|---|------|------|----------|---------------|
| 1.3.1 | Collect existing asset documentation | upload | - For gemstones: prior GIA/SSEF/Gubelin reports, dealer invoices<br>- For precious metals: assay reports, refiner certificates, weight/purity documentation<br>- For real estate: deed, prior appraisals, title report, survey, environmental assessments<br>- For mineral rights: lease agreements, production records, geological surveys, royalty statements | cro |
| 1.3.2 | Desktop valuation estimate | action | - Research comparable sales (auction results, dealer price lists, MLS data, mineral royalty multiples)<br>- Calculate preliminary LTV range (conservative)<br>- Estimate maximum loan amount<br>- Document methodology and sources<br>- **This is NOT the offering value** | cro |
| 1.3.3 | Preliminary risk assessment | review | - Evaluate provenance quality (clean chain of custody?)<br>- Assess market liquidity of collateral class<br>- Flag regulatory risks by jurisdiction<br>- Check for existing liens (UCC search, title search)<br>- Rate preliminary risk: Low / Medium / High / Critical | compliance_officer |
| 1.3.4 | Borrower financial capacity check | action | - Request recent financial statements or tax returns<br>- Assess ability to service debt (DSCR for business-purpose)<br>- Verify intended use of proceeds<br>- For consumer-purpose: triggers TILA/RESPA analysis | cro |

**Required Documents:** `gia_report` (if gemstone), `appraisal_report` (if real estate), `correspondence`

---

### 1.4 Internal Deal Committee Review — Lead Stage
**Governance Basis:** SOC 2 processing integrity control. Documented Go/No-Go prevents wasted resources on non-viable deals.
**Regulatory Citation:** SOC 2 Trust Service Criteria: Processing Integrity (PI1)
**Duration:** 1–2 days

**Default Tasks:**
| # | Task | Type | Subtasks | Assigned Role |
|---|------|------|----------|---------------|
| 1.4.1 | Prepare deal summary memo | action | - Compile lead screening results<br>- Attach preliminary valuation<br>- Include risk assessment<br>- Provide recommendation (proceed / decline / conditional) | cro |
| 1.4.2 | Deal committee vote | approval | - CEO review and vote<br>- CTO review and vote (if applicable)<br>- CRO review and vote<br>- Document decision rationale<br>- If conditional: define conditions for proceeding | ceo |
| 1.4.3 | Communicate decision to holder | action | - If approved: send engagement agreement<br>- If declined: send professional decline letter<br>- If conditional: outline conditions required | cro |

**Required Documents:** None (internal)

---

### GATE G0: LEAD QUALIFICATION GATE
**Criteria:**
- [ ] Holder KYC/KYB screening passed (no OFAC/SDN hits, no disqualifying PEP findings)
- [ ] Asset class confirmed eligible
- [ ] Preliminary valuation supports minimum loan size
- [ ] No unresolvable title/ownership issues
- [ ] Deal committee approved (or conditionally approved)
- [ ] NDA executed

**Required Approvals:** CEO, Compliance Officer
**Gate Type:** Hard gate — cannot proceed to Intake without passing

---

## STAGE 2: INTAKE
**Phase:** `phase_1_intake`
**Color:** Emerald `#1B6B4A`
**Estimated Duration:** 2–4 weeks
**Purpose:** Full asset documentation, provenance verification, holder onboarding, and initial LTV assessment

### 2.1 Full Asset Details Collection
**Governance Basis:** Complete asset description is required for proper valuation, insurance coverage, and UCC financing statement (which requires description of collateral per UCC 9-108).
**Regulatory Citation:** UCC 9-108 (Sufficiency of Description); UCC 9-504 (Indication of Collateral)
**Duration:** 3–7 days

**Default Tasks:**
| # | Task | Type | Subtasks | Assigned Role |
|---|------|------|----------|---------------|
| 2.1.1 | Complete asset profile in CRM | action | **Gemstones:**<br>- Species, variety, weight (ct), dimensions<br>- Color, clarity, cut grade<br>- Treatment history (heated, unheated, etc.)<br>- GIA report numbers<br>**Precious Metals:**<br>- Metal type (gold, silver, platinum, palladium)<br>- Form (bars, coins, rounds, scrap)<br>- Weight (troy oz), purity (fineness)<br>- Refiner/mint marks, serial numbers<br>**Real Estate:**<br>- Property address, legal description, parcel number<br>- Property type (residential, commercial, land, mixed-use)<br>- Square footage, acreage, zoning<br>- Current use and occupancy status<br>**Mineral Rights:**<br>- Mineral type(s), location (county/state/section-township-range)<br>- Lease status (producing, non-producing, HBP)<br>- Net mineral acres, royalty interest percentage<br>- Operator name and current production rates | cro |
| 2.1.2 | Upload supporting photographs and media | upload | - High-resolution photographs (minimum 10 angles for tangibles)<br>- Video documentation (if available)<br>- For real estate: property survey, floor plans, aerials<br>- For mineral rights: production maps, well logs | cro |
| 2.1.3 | Verify asset dimensions against documentation | review | - Cross-reference physical description with existing reports<br>- Flag any discrepancies between documentation and holder claims<br>- Document any modifications since last certification | compliance_officer |

**Required Documents:** `photo`, `correspondence`

---

### 2.2 Complete Provenance & Chain of Custody
**Governance Basis:** Clean title and documented chain of custody are prerequisites for perfecting a security interest. UCC Article 9 priority rules depend on the debtor having rights in the collateral (UCC 9-203(b)(2)).
**Regulatory Citation:** UCC 9-203(b)(2) (Rights in Collateral); Clean Diamond Trade Act 19 U.S.C. 3901 (if diamonds); Kimberley Process (if rough diamonds)
**Duration:** 5–10 days

**Default Tasks:**
| # | Task | Type | Subtasks | Assigned Role |
|---|------|------|----------|---------------|
| 2.2.1 | Document complete chain of custody | action | **Gemstones:**<br>- Mine/source → rough dealer → cutter → wholesale dealer → retail → current holder<br>- Kimberley Process certificate (if diamond)<br>- All bills of sale in the chain<br>**Precious Metals:**<br>- Refiner/mint → dealer → current holder<br>- LBMA/COMEX chain of custody documentation<br>- For gold: compliance with Dodd-Frank Section 1502 (conflict minerals)<br>**Real Estate:**<br>- Full title abstract from title company<br>- Chain of title for minimum 40 years<br>- All deeds, mortgages, releases in the chain<br>**Mineral Rights:**<br>- Original severance deed or reservation<br>- All subsequent conveyances<br>- Current lease agreement with operator<br>- Division order from operator | compliance_officer |
| 2.2.2 | Gap analysis on provenance chain | review | - Identify any breaks in the chain of custody<br>- Flag periods without documentation<br>- Assess whether gaps are resolvable<br>- Document risk level of any remaining gaps | compliance_officer |
| 2.2.3 | Lien and encumbrance search | action | - UCC search in debtor's state of organization (and state of location for fixtures)<br>- For real estate: title search and commitment<br>- For mineral rights: title opinion from landman or mineral attorney<br>- Federal tax lien search (IRS)<br>- State tax lien search<br>- Judgment lien search<br>- Document any existing security interests | compliance_officer |
| 2.2.4 | Conflict minerals / sanctions screening (if applicable) | automated | - For precious metals: Dodd-Frank Section 1502 conflict minerals check<br>- For gemstones from restricted origins: enhanced due diligence<br>- OFAC country-based sanctions screening on asset origin<br>- Document compliance determination | compliance_officer |

**Required Documents:** `correspondence` (chain of custody docs), `dd_report` (lien search results)

---

### 2.3 Holder Onboarding & Engagement
**Governance Basis:** Formal engagement agreement establishes the legal relationship and forms the basis for fee collection and liability allocation.
**Regulatory Citation:** State contract law; Professional liability insurance requirements
**Duration:** 3–5 days

**Default Tasks:**
| # | Task | Type | Subtasks | Assigned Role |
|---|------|------|----------|---------------|
| 2.3.1 | Complete KYC/KYB (full verification) | action | - Upgrade from preliminary screening to full verification<br>- For individuals: government ID, proof of address, SSN verification<br>- For entities: articles/operating agreement, EIN letter, beneficial ownership certification (FinCEN BOI report if applicable)<br>- Enhanced due diligence if any flags from preliminary screening<br>- Final OFAC/SDN re-screening with current lists | compliance_officer |
| 2.3.2 | Execute engagement agreement | upload | - Define scope of services (debt structuring)<br>- Fee schedule: origination fee (2%), servicing fee (0.75%/yr), other fees<br>- Timeline expectations<br>- Representations and warranties re: asset title, no undisclosed encumbrances<br>- Indemnification provisions<br>- Termination provisions<br>- Obtain wet or e-signature | ceo |
| 2.3.3 | Business-purpose vs. consumer-purpose determination | review | - Document intended use of loan proceeds<br>- If proceeds are for personal, family, or household use: loan is consumer-purpose and triggers TILA/Reg Z, RESPA, ECOA, and potentially state consumer lending license requirements<br>- If proceeds are for business/commercial/investment: document the determination<br>- **CRITICAL:** This determination affects the entire regulatory framework for the loan | compliance_officer |

**Required Documents:** `kyc_report`, `engagement_agreement`, `background_check`

---

### 2.4 Initial LTV Assessment
**Governance Basis:** Responsible lending standards require preliminary underwriting before committing to full appraisal and structuring costs.
**Regulatory Citation:** OCC Lending Standards (12 CFR 30 Appendix A); Interagency Appraisal and Evaluation Guidelines
**Duration:** 2–3 days

**Default Tasks:**
| # | Task | Type | Subtasks | Assigned Role |
|---|------|------|----------|---------------|
| 2.4.1 | Calculate preliminary LTV | action | - Use desktop valuation from Lead stage<br>- Apply asset-class-specific LTV caps:<br>  - Gemstones: 50–65% LTV (illiquid, specialized market)<br>  - Precious metals: 60–80% LTV (liquid, commoditized)<br>  - Real estate: 50–75% LTV (varies by type/location)<br>  - Mineral rights: 40–60% LTV (income-dependent, depleting asset)<br>- Calculate maximum loan amount<br>- Estimate interest rate range based on risk profile | cro |
| 2.4.2 | Preliminary loan structure outline | action | - Proposed loan amount range<br>- Proposed rate range (12–18% APR for gemstones, varies by class)<br>- Proposed term (12–36 months)<br>- Payment structure (interest-only vs. amortizing)<br>- Collateral description for UCC filing<br>- Identify potential lender pool | cro |
| 2.4.3 | Borrower capacity assessment | review | - For business-purpose: DSCR analysis (minimum 1.25x)<br>- For consumer-purpose: DTI ratio analysis (per TILA/ATR rule if applicable)<br>- Assess repayment sources<br>- Document analysis in underwriting file | compliance_officer |

**Required Documents:** None (internal analysis)

---

### GATE G1: INTAKE GATE
**Criteria:**
- [ ] Full KYC/KYB verification complete and passed
- [ ] Complete chain of custody documented (gaps flagged and risk-assessed)
- [ ] Lien search complete — no unresolvable competing interests
- [ ] Engagement agreement executed
- [ ] Business-purpose/consumer-purpose determination documented
- [ ] Preliminary LTV within policy limits
- [ ] All required intake documents uploaded

**Required Approvals:** CEO, Compliance Officer
**Gate Type:** Hard gate — cannot proceed to Asset Maturity without passing

---

## STAGE 3: ASSET MATURITY
**Phase:** `phase_2_certification`
**Color:** Teal `#1A8B7A`
**Estimated Duration:** 4–10 weeks
**Purpose:** Independent certification, formal appraisal, institutional custody, insurance, and collateral perfection preparation

### 3.1 Independent Certification
**Governance Basis:** Independent certification from a recognized authority establishes the physical characteristics and authenticity of the asset, forming the basis for appraisal and investor confidence.
**Regulatory Citation:** USPAP Standards Rule 7 (Personal Property); Interagency Appraisal and Evaluation Guidelines (real estate); FIRREA Section 1110 (real estate appraisal standards)
**Duration:** 2–6 weeks (varies by asset class)

**Default Tasks:**
| # | Task | Type | Subtasks | Assigned Role |
|---|------|------|----------|---------------|
| 3.1.1 | Submit for independent certification/grading | action | **Gemstones:**<br>- Submit to GIA for species ID, color grade, clarity, cut, carat, origin determination<br>- If high-value colored stone: supplemental SSEF or Gubelin origin report<br>- Cost: $5K–$20K per stone; Timeline: 2–4 weeks<br>**Precious Metals:**<br>- Submit to LBMA-accredited assayer for purity verification<br>- Weight certification by independent scale<br>- Hallmark/refiner mark verification<br>- Cost: $500–$5K; Timeline: 1–2 weeks<br>**Real Estate:**<br>- Order title commitment from title company<br>- Order ALTA survey (if not current)<br>- Order Phase I Environmental Site Assessment (if commercial)<br>- Cost: $5K–$15K; Timeline: 2–4 weeks<br>**Mineral Rights:**<br>- Commission title opinion from qualified mineral attorney<br>- Order current production and reserve report from petroleum engineer<br>- Verify division order with operator<br>- Cost: $5K–$25K; Timeline: 3–6 weeks | cro |
| 3.1.2 | Verify certification against claim | review | - Compare results against holder's representations<br>- Flag any material discrepancies<br>- Assess whether discrepancies affect loan viability<br>- Document findings | compliance_officer |

**Required Documents:** `gia_report` or `ssef_report` (gemstones), `dd_report` (metals/real estate/minerals)

---

### 3.2 Formal Appraisal Process
**Governance Basis:** USPAP-compliant appraisals are required for establishing collateral value in secured lending. Multiple independent appraisals provide institutional-grade valuation confidence.
**Regulatory Citation:** USPAP Standards Rules 7–8 (Personal Property); FIRREA Section 1110 + Interagency Appraisal Guidelines (real estate, threshold $250K+); USPAP Ethics Rule (fee prohibition)
**Duration:** 3–6 weeks

**Default Tasks:**
| # | Task | Type | Subtasks | Assigned Role |
|---|------|------|----------|---------------|
| 3.2.1 | Appraiser panel selection | action | **Gemstones:**<br>- Identify 3 independent USPAP-compliant appraisers (CGA/MGA credentials)<br>- Verify insurance, independence, no conflicts<br>**Precious Metals:**<br>- 2 independent appraisers (more standardized market)<br>- Verify credentials and independence<br>**Real Estate:**<br>- 1–2 MAI-designated or state-certified appraisers (per FIRREA if federally related)<br>- Must meet Interagency Appraisal Guidelines independence requirements<br>**Mineral Rights:**<br>- 1–2 qualified petroleum engineers (SPE standards) or mineral appraisers<br>- Verify qualification per PRMS (Petroleum Resources Management System) | cro |
| 3.2.2 | Execute appraisal engagement letters | upload | - Define scope, methodology requirements, timeline, and fee<br>- Require USPAP compliance certification<br>- Prohibit percentage-based fees (USPAP Ethics Rule)<br>- Specify intended use (secured lending)<br>- Specify intended users (PleoChrome, lender, borrower) | cro |
| 3.2.3 | Conduct sequential appraisal process | action | **Gemstones (3 appraisals):**<br>- Appraiser 1 examines stone, completes report<br>- Sealed prior value passed to custody chain (NOT to Appraiser 2)<br>- Appraiser 2 examines independently<br>- Appraiser 3 examines independently<br>- Physical stone moves sequentially under insured custody<br>**Other asset classes (1–2 appraisals):**<br>- Appraisers work independently<br>- Reports delivered directly to PleoChrome | cro |
| 3.2.4 | Variance analysis | review | - Compare all appraisals<br>- If variance exceeds 15–20% for gemstones or 10% for other classes: trigger review<br>- Collateral value = average of two lowest (gemstones) or lower of two (others)<br>- For single appraisal: value = appraised value with appropriate haircut<br>- Document methodology and final collateral value determination<br>- Lock collateral value for loan structuring | ceo |

**Required Documents:** `appraisal_report` (multiple)

---

### 3.3 Institutional Custody Establishment
**Governance Basis:** Perfection of a security interest by possession requires the collateral to be held by a bailee who has authenticated a bailee notification. Institutional custody protects both lender and borrower interests.
**Regulatory Citation:** UCC 9-313 (Perfection by Possession); UCC 9-312(d) (Bailee Notification)
**Duration:** 1–3 weeks

**Default Tasks:**
| # | Task | Type | Subtasks | Assigned Role |
|---|------|------|----------|---------------|
| 3.3.1 | Select custody provider | action | **Gemstones/Precious Metals:**<br>- Evaluate Brink's, Malca-Amit, Loomis, or equivalent<br>- Verify segregated storage capability<br>- Confirm API access for Proof of Reserve<br>- Obtain facility audit reports (SOC 1/SOC 2)<br>**Real Estate:**<br>- Title held in SPV name (if formed) or deed of trust<br>- Select title company for escrow<br>**Mineral Rights:**<br>- Assignment of proceeds to lockbox account<br>- Revenue disbursement order with operator | cto |
| 3.3.2 | Execute custody agreement | upload | - For tangibles: vault custody agreement with segregated storage<br>- Define access protocols, inspection rights, release conditions<br>- Name PleoChrome/lender as secured party<br>- For real estate: deed of trust recorded with county<br>- For mineral rights: assignment of production revenue to escrow | ceo |
| 3.3.3 | Arrange insured transport | action | - For physical assets: arrange armored/insured transport to vault<br>- Transit insurance covering full appraised value<br>- Chain of custody documentation throughout transport<br>- Photograph asset before and after transport<br>- Obtain custody receipt upon arrival | cro |
| 3.3.4 | Verify custody and obtain receipt | upload | - Confirm asset received at custodian/vault<br>- Verify condition matches pre-transport documentation<br>- Obtain formal custody receipt<br>- Confirm segregated storage implemented<br>- Verify API/reporting access for ongoing monitoring | cto |

**Required Documents:** `vault_agreement`, `custody_receipt`, `transport_manifest`, `insurance_certificate`

---

### 3.4 Insurance Verification & Placement
**Governance Basis:** Insurance protects the secured party's interest in the collateral. Lender must be named as loss payee.
**Regulatory Citation:** UCC 9-207 (Secured Party's duty of care for collateral in possession); State insurance regulations
**Duration:** 1–2 weeks

**Default Tasks:**
| # | Task | Type | Subtasks | Assigned Role |
|---|------|------|----------|---------------|
| 3.4.1 | Verify or place insurance coverage | action | **Gemstones/Precious Metals:**<br>- Verify vault's specie insurance covers full appraised value<br>- If gap: place supplemental coverage<br>- Confirm all-risk coverage (theft, fire, natural disaster, mysterious disappearance)<br>**Real Estate:**<br>- Verify hazard insurance (standard mortgagee clause)<br>- Verify flood insurance (if in flood zone per FEMA)<br>- Verify title insurance (lender's policy)<br>**Mineral Rights:**<br>- Verify operator's liability insurance<br>- Verify environmental liability coverage<br>- Consider business interruption coverage | compliance_officer |
| 3.4.2 | Obtain insurance certificates | upload | - Certificate naming SPV/lender as additional insured or loss payee<br>- Verify coverage amounts meet or exceed collateral value<br>- Confirm policy term covers full loan term<br>- Set calendar reminder for renewal 60 days before expiry<br>- File certificates in document library | compliance_officer |

**Required Documents:** `insurance_certificate`

---

### 3.5 Collateral Perfection Preparation
**Governance Basis:** UCC Article 9 requires a security agreement and one of the methods of perfection (filing, possession, or control) to establish a perfected security interest with priority over other creditors.
**Regulatory Citation:** UCC 9-203 (Attachment); UCC 9-310 (Perfection by Filing); UCC 9-313 (Perfection by Possession); UCC 9-322 (Priority)
**Duration:** 1–2 weeks

**Default Tasks:**
| # | Task | Type | Subtasks | Assigned Role |
|---|------|------|----------|---------------|
| 3.5.1 | Prepare UCC-1 financing statement | action | - Draft UCC-1 with correct debtor name (exact legal name per UCC 9-503)<br>- For registered organizations: name must match state formation records exactly<br>- For individuals: use driver's license name (in most states per 2010 amendments)<br>- Draft collateral description (specific vs. supergeneric per UCC 9-108)<br>- Identify correct filing office (state of debtor's organization per UCC 9-301) | compliance_officer |
| 3.5.2 | Prepare security agreement | action | - Draft security agreement granting security interest in the collateral<br>- Include adequate description of collateral (UCC 9-108)<br>- Include after-acquired property clause if applicable<br>- Include representations and warranties<br>- Include default provisions and remedies<br>- Include cross-collateralization provisions if multiple assets | compliance_officer |
| 3.5.3 | Pre-filing UCC search | action | - Run UCC search in filing office to confirm no prior filings against same collateral<br>- Run UCC search against debtor name for any existing secured parties<br>- If prior filings exist: negotiate subordination or payoff<br>- Document search results and clear-to-file determination | compliance_officer |
| 3.5.4 | Prepare additional perfection documents (asset-class specific) | action | **Real Estate (Mortgage/Deed of Trust):**<br>- Draft mortgage/deed of trust for recording<br>- Order title commitment with lender endorsements<br>- Prepare assignment of rents and leases (if income-producing)<br>**Mineral Rights:**<br>- Draft mortgage on mineral interest for recording<br>- Prepare assignment of production proceeds<br>- Draft division order notification to operator<br>**Gemstones/Metals (Possession):**<br>- Prepare bailee notification letter (UCC 9-312(d))<br>- Draft control agreement if held by intermediary | compliance_officer |

**Required Documents:** None (documents prepared, not yet executed/filed)

---

### GATE G2: ASSET MATURITY GATE
**Criteria:**
- [ ] Independent certification/grading complete
- [ ] All appraisals complete and within variance threshold
- [ ] Collateral value locked
- [ ] Asset in institutional custody with custody receipt
- [ ] Insurance verified and certificates obtained
- [ ] UCC-1 prepared and pre-filing search clear
- [ ] Security agreement drafted
- [ ] No unresolved title or lien issues

**Required Approvals:** CEO, Compliance Officer, External Counsel
**Gate Type:** Hard gate — cannot proceed to Security without passing

---

## STAGE 4: SECURITY
**Phase:** `phase_3_custody` (debt-specific)
**Color:** Sapphire `#1E3A6E`
**Estimated Duration:** 2–4 weeks
**Purpose:** Perfect security interest, execute loan documentation, complete legal review

### 4.1 UCC Filing & Security Interest Perfection
**Governance Basis:** Perfection of the security interest establishes the lender's priority over other creditors and the debtor's trustee in bankruptcy.
**Regulatory Citation:** UCC 9-310 (Filing); UCC 9-313 (Possession); UCC 9-322 (Priority); UCC 9-515 (Duration — 5 years); 11 U.S.C. 544 (Bankruptcy trustee's avoiding powers)
**Duration:** 1–2 weeks

**Default Tasks:**
| # | Task | Type | Subtasks | Assigned Role |
|---|------|------|----------|---------------|
| 4.1.1 | File UCC-1 financing statement | action | - File with secretary of state in debtor's state of organization<br>- For real estate fixtures: also file fixture filing with county recorder<br>- Pay filing fees ($5–$50 per state; some states higher)<br>- Obtain file-stamped copy as proof of filing<br>- Record filing date, file number, and lapse date (5 years from filing)<br>- Set calendar reminder for continuation statement 6 months before lapse | compliance_officer |
| 4.1.2 | Perfect by possession (belt-and-suspenders for tangibles) | action | - Send bailee notification letter to vault custodian (UCC 9-312(d))<br>- Obtain authenticated acknowledgment from custodian<br>- Custodian must acknowledge holding for benefit of secured party<br>- This provides dual perfection (filing + possession) for maximum protection | compliance_officer |
| 4.1.3 | Record mortgage/deed of trust (real estate / mineral rights) | action | - For real estate: record mortgage/deed of trust with county recorder<br>- For mineral rights: record mineral mortgage with county recorder<br>- Obtain recording reference numbers<br>- Verify title insurance policy issued after recording<br>- File assignment of production proceeds with operator (mineral rights) | compliance_officer |
| 4.1.4 | Post-filing verification | review | - Run UCC search to confirm filing appears correctly<br>- Verify debtor name indexed correctly<br>- Confirm no intervening filings between search and filing<br>- For recorded documents: verify recording and indexing<br>- Document perfection status in compliance log | compliance_officer |

**Required Documents:** `correspondence` (filed UCC-1), `dd_report` (post-filing search)

---

### 4.2 Promissory Note Structuring
**Governance Basis:** The promissory note is the evidence of the debt obligation. For business-purpose loans, state usury laws and negotiable instrument requirements (UCC Article 3) apply. For consumer-purpose loans, TILA/Reg Z disclosure requirements apply.
**Regulatory Citation:** UCC Article 3 (Negotiable Instruments); State usury laws (varies); TILA 15 U.S.C. 1601 (if consumer-purpose); Reg Z 12 CFR 1026 (if consumer-purpose)
**Duration:** 1–2 weeks

**Default Tasks:**
| # | Task | Type | Subtasks | Assigned Role |
|---|------|------|----------|---------------|
| 4.2.1 | Draft promissory note | action | - Principal amount<br>- Interest rate (fixed or variable; if variable, specify index + margin)<br>- Maturity date<br>- Payment schedule (monthly interest-only, amortizing, balloon, etc.)<br>- Prepayment provisions (penalty or no penalty)<br>- Late payment charges (typically 5% of payment amount)<br>- Default interest rate (typically +5% above contract rate)<br>- Default triggers (payment default, covenant default, cross-default)<br>- Acceleration clause<br>- Governing law and venue | compliance_officer |
| 4.2.2 | Usury law compliance check | review | - Identify applicable state usury limits<br>- For business-purpose loans: most states exempt or have higher caps<br>- Common exemptions: business-purpose (most states), $300K+ (NY), $250K+ (CA per Finance Code 22002)<br>- If consumer-purpose: federal preemption may apply under DIDMCA for certain lenders<br>- Document compliance determination<br>- **Critical states:** NY (criminal usury at 25%); CA (10% without license); FL (18% simple / 25% criminal) | compliance_officer |
| 4.2.3 | TILA/Reg Z analysis (if consumer-purpose) | review | - If consumer-purpose: full TILA disclosure required<br>- APR calculation per Reg Z Appendix J<br>- Total of payments, finance charge, payment schedule<br>- Closing disclosure form (if real estate-secured)<br>- 3-day right of rescission (if primary residence-secured)<br>- Determine if state lending license required<br>- **If consumer-purpose: engage consumer lending compliance counsel** | compliance_officer |

**Required Documents:** None (draft stage; documents finalized in 5.1)

---

### 4.3 Lien Documentation & Security Agreement
**Governance Basis:** The security agreement creates the security interest and defines the rights and obligations of both parties with respect to the collateral.
**Regulatory Citation:** UCC 9-203 (Attachment requirements); UCC 9-108 (Sufficiency of description)
**Duration:** 1 week

**Default Tasks:**
| # | Task | Type | Subtasks | Assigned Role |
|---|------|------|----------|---------------|
| 4.3.1 | Finalize security agreement | action | - Grant of security interest in described collateral<br>- Collateral description (specific, matching UCC-1)<br>- Debtor's representations and warranties (title, no other liens, authority)<br>- Debtor's covenants (maintain insurance, no further encumbrance, provide financials, cooperate with inspections)<br>- LTV maintenance covenant (trigger reappraisal or additional collateral if LTV exceeds threshold)<br>- Events of default<br>- Secured party's remedies (foreclose, dispose per UCC 9-610)<br>- After-acquired property clause (if applicable)<br>- Proceeds clause (security interest in identifiable proceeds per UCC 9-315) | compliance_officer |
| 4.3.2 | Draft collateral custody agreement (tripartite) | action | - Parties: borrower, lender (or PleoChrome as agent), custodian/vault<br>- Custodian holds for benefit of secured party<br>- Release conditions (lender written authorization only)<br>- Inspection rights (lender may inspect upon reasonable notice)<br>- Reappraisal trigger (if market conditions change materially)<br>- Default procedures (upon default, custodian holds pending lender instructions)<br>- Termination (upon loan payoff, lender authorizes release) | compliance_officer |
| 4.3.3 | Guaranty agreement (if applicable) | action | - Personal guaranty from individual principals if borrower is entity<br>- Scope: full recourse or limited recourse (carve-outs)<br>- Typical carve-outs: fraud, environmental, waste, bankruptcy interference<br>- Guarantor financial disclosures | compliance_officer |

**Required Documents:** None (draft stage)

---

### 4.4 Legal Review & Compliance Sign-Off
**Governance Basis:** Independent legal review of all loan documents protects all parties and ensures enforceability.
**Regulatory Citation:** State bar requirements for legal document review; UCC Article 9 enforceability requirements
**Duration:** 1–2 weeks

**Default Tasks:**
| # | Task | Type | Subtasks | Assigned Role |
|---|------|------|----------|---------------|
| 4.4.1 | External counsel review of loan package | review | - Review promissory note for enforceability<br>- Review security agreement for proper grant and description<br>- Review UCC-1 for proper debtor name and collateral description<br>- Review collateral custody agreement<br>- Review guaranty (if applicable)<br>- Usury opinion (if rate near state limits)<br>- True lender / rent-a-bank analysis (if using bank partner)<br>- Confirm no licensing requirements in applicable states | compliance_officer |
| 4.4.2 | State lending license analysis | review | - Determine if PleoChrome (or the lending entity) needs a state lending license<br>- Many states exempt: business-purpose loans, loans above threshold amounts, loans by certain entity types<br>- If license required: determine if broker, lender, or servicer license needed<br>- States with broadest requirements: CA (CFL/CRMLA), NY (Licensed Lender), GA, MD, IL, NJ<br>- Document analysis and licensing determination | compliance_officer |
| 4.4.3 | Compliance officer final sign-off | approval | - Review complete loan file<br>- Verify all regulatory requirements addressed<br>- Confirm KYC/AML current<br>- Confirm insurance current<br>- Confirm UCC filed and perfection complete<br>- Sign off on loan package | compliance_officer |

**Required Documents:** `legal_opinion`

---

### GATE G3: SECURITY GATE (maps to G6D in existing system)
**Criteria:**
- [ ] UCC-1 filed and confirmed (or mortgage/deed of trust recorded)
- [ ] Possession-based perfection complete (for tangibles)
- [ ] All loan documents drafted and reviewed by counsel
- [ ] Usury compliance confirmed
- [ ] State lending license analysis complete
- [ ] Insurance certificates current
- [ ] Collateral custody agreement executed
- [ ] Compliance officer sign-off obtained

**Required Approvals:** CEO, External General Counsel
**Gate Type:** Hard gate — cannot proceed to Value Creation without passing

---

## STAGE 5: VALUE CREATION (DEBT INSTRUMENT)
**Phase:** `phase_4_legal` (debt-specific)
**Color:** Medium Blue `#4A7BC7`
**Estimated Duration:** 1–2 weeks
**Purpose:** Issue the debt instrument, originate the loan, deploy capital

### 5.1 Note Issuance & Loan Origination
**Governance Basis:** Loan closing creates binding obligations. The promissory note evidences the debt, the security agreement grants the lien, and disbursement completes the transaction.
**Regulatory Citation:** State contract law; UCC Article 3 (negotiable instruments); TILA 15 U.S.C. 1601 (if consumer); RESPA 12 U.S.C. 2601 (if real estate-secured consumer)
**Duration:** 3–5 days

**Default Tasks:**
| # | Task | Type | Subtasks | Assigned Role |
|---|------|------|----------|---------------|
| 5.1.1 | Pre-closing verification | review | - Verify all gate criteria still satisfied<br>- Re-run OFAC screening (if more than 30 days since last)<br>- Confirm insurance certificates current<br>- Verify UCC filing still effective (no amendments or terminations)<br>- Confirm collateral still in custody | compliance_officer |
| 5.1.2 | Loan closing | action | - Execute promissory note (borrower signature)<br>- Execute security agreement (borrower signature)<br>- Execute collateral custody agreement (all three parties)<br>- Execute guaranty (if applicable, guarantor signature)<br>- For consumer real estate: provide closing disclosure 3 business days before closing<br>- For consumer primary residence: provide right of rescission notice<br>- Collect origination fee (2% of loan amount) | ceo |
| 5.1.3 | Fund disbursement | action | - Wire loan proceeds to borrower's designated account<br>- Deduct origination fee and any prepaid amounts from proceeds<br>- Obtain borrower's acknowledgment of receipt<br>- Record disbursement date (this is the "date of first sale" for TILA if consumer)<br>- File disbursement record in loan file | ceo |
| 5.1.4 | Post-closing file assembly | action | - Compile complete executed loan file<br>- Verify all signatures, dates, and amounts<br>- Scan and upload all executed documents to CRM<br>- Lock critical documents (promissory note, security agreement, UCC-1)<br>- Set document retention schedule (minimum 6 years after maturity) | compliance_officer |

**Required Documents:** All executed loan documents (uploaded post-closing)

---

### 5.2 Interest Rate Setting & Payment Schedule
**Governance Basis:** Interest rate and payment terms must comply with state usury laws and, if consumer-purpose, with TILA/Reg Z disclosure requirements.
**Regulatory Citation:** State usury laws; TILA 15 U.S.C. 1601 (if consumer); Truth in Lending Act Reg Z 12 CFR 1026 (if consumer)
**Duration:** Determined during Stage 4; finalized at closing

**Default Tasks:**
| # | Task | Type | Subtasks | Assigned Role |
|---|------|------|----------|---------------|
| 5.2.1 | Finalize interest rate | action | - Set rate based on risk profile, LTV, term, and market conditions<br>- PleoChrome target ranges by asset class:<br>  - Gemstones: 12–18% APR<br>  - Precious metals: 8–14% APR (lower risk, liquid market)<br>  - Real estate: 10–16% APR (bridge/hard money rates)<br>  - Mineral rights: 12–18% APR (income stream as additional support)<br>- If participating notes: lender gets base rate, PleoChrome retains spread (3%)<br>- Document rate determination methodology | ceo |
| 5.2.2 | Generate amortization schedule | automated | - Calculate payment amount based on rate, principal, term<br>- Interest-only periods (if applicable)<br>- Balloon payment at maturity (if applicable)<br>- Late fee calculation ($X or Y% after Z-day grace period)<br>- Default rate application (contract rate + 5%)<br>- Provide borrower with complete payment schedule at closing | cro |
| 5.2.3 | Set up payment processing | action | - Configure ACH/wire payment instructions<br>- Set up escrow account for reserves (insurance, reappraisal costs)<br>- Establish payment receipt and application procedures (interest before principal)<br>- Configure late payment notices (auto-send at grace period expiry)<br>- Set up monthly statement generation | cto |

**Required Documents:** `fee_schedule`

---

### 5.3 Participation Notes (if syndicating the loan)
**Governance Basis:** Under the Reves test, loan participation notes offered to investors for investment return are presumed to be securities, requiring Reg D 506(c) compliance.
**Regulatory Citation:** Reves v. Ernst & Young, 494 U.S. 56 (1990); 17 CFR 230.506(c); Kirschner v. JP Morgan Chase (2023) — distinguished for institutional syndications
**Duration:** 4–8 weeks (if applicable; skip if single lender)

**Default Tasks:**
| # | Task | Type | Subtasks | Assigned Role |
|---|------|------|----------|---------------|
| 5.3.1 | Structure participation notes | action | - Define participation interests (pro rata or sequential)<br>- Set minimum investment amount ($200K+ for self-certification accreditation verification)<br>- Define payment waterfall (senior/subordinate or pari passu)<br>- Draft participation agreement | ceo |
| 5.3.2 | Draft participation PPM | action | - Securities counsel drafts Private Placement Memorandum<br>- Disclose all material risks, fees, conflicts<br>- Disclose underlying loan terms and collateral<br>- Include subscription agreement and investor questionnaire<br>- Compliance review | compliance_officer |
| 5.3.3 | SEC and state filings for participation notes | action | - File Form D with SEC within 15 days of first sale<br>- File Blue Sky notices in applicable states<br>- For New York: file BEFORE first sale<br>- EDGAR Next enrollment (if not already established) | compliance_officer |
| 5.3.4 | Participation investor onboarding | action | - KYC/AML on each note investor<br>- Accredited investor verification (506(c) requires reasonable steps)<br>- Execute subscription agreement<br>- Collect funds into escrow<br>- Issue participation certificates upon closing | compliance_officer |

**Required Documents:** `ppm`, `subscription_agreement`, `investor_questionnaire`, `form_d_filing`, `blue_sky_filing`, `accreditation_verification`

---

### GATE G4: VALUE CREATION GATE (maps to G7D in existing system)
**Criteria:**
- [ ] Loan documents executed
- [ ] Funds disbursed to borrower
- [ ] Post-closing file assembled and locked
- [ ] Payment processing configured and tested
- [ ] If participation notes: Form D filed, investors verified and funded
- [ ] Origination fee collected
- [ ] Loan entered into servicing system

**Required Approvals:** CEO
**Gate Type:** Hard gate — cannot proceed to Distribution/Servicing without passing

---

## STAGE 6: DISTRIBUTION & ONGOING MANAGEMENT
**Phase:** `phase_5_tokenization` / `phase_7_distribution` / `phase_8_ongoing`
**Color:** Amber `#C47A1A`
**Estimated Duration:** Ongoing (loan term: 12–36 months)
**Purpose:** Investor/lender matching (if not yet done), note sale, servicing, collateral monitoring, maturity/default handling

### 6.1 Lender/Investor Matching & Note Sale
**Governance Basis:** If PleoChrome originates with balance sheet capital and then sells the note, the sale must comply with UCC Article 9 (if selling a payment intangible) and potentially securities laws (if selling participation interests).
**Regulatory Citation:** UCC 9-109(a)(3) (Sale of payment intangibles); UCC 9-318 (Obligor's rights and duties after assignment); State debt buyer licensing laws (if purchasing distressed)
**Duration:** 2–4 weeks (if applicable)

**Default Tasks:**
| # | Task | Type | Subtasks | Assigned Role |
|---|------|------|----------|---------------|
| 6.1.1 | Identify lender/investor pool | action | - Source from institutional lenders, alternative credit funds, family offices<br>- Match lender risk appetite to asset class and LTV<br>- Prepare loan summary package for lender marketing<br>- Conduct initial lender outreach | cro |
| 6.1.2 | Lender due diligence facilitation | action | - Provide complete loan file to interested lenders<br>- Facilitate lender's independent review of collateral<br>- Arrange collateral inspection (if requested)<br>- Provide appraisal reports and certification documents<br>- Answer lender questions and provide supplemental information | cro |
| 6.1.3 | Negotiate note purchase/participation terms | action | - Purchase price (par, premium, or discount)<br>- Representations and warranties (standard CMSA/MBA reps)<br>- Repurchase obligations (early payment default, breach of rep)<br>- Servicing retention/transfer<br>- Escrow holdback (if applicable) | ceo |
| 6.1.4 | Execute note sale/assignment | action | - Execute assignment and assumption agreement<br>- Execute allonge to promissory note (endorsement)<br>- File UCC-3 assignment (to update secured party of record)<br>- Notify borrower of assignment (per UCC 9-406)<br>- Transfer servicing records | ceo |

**Required Documents:** `partner_agreement` (note purchase agreement), `correspondence` (assignment documents)

---

### 6.2 Loan Servicing Setup & Ongoing Management
**Governance Basis:** Loan servicers must properly account for and apply payments, maintain escrow accounts, and provide borrower with regular statements.
**Regulatory Citation:** RESPA 12 U.S.C. 2605 (if federally related mortgage); CFPB Servicing Rules 12 CFR 1024 Subpart C (if consumer mortgage); State servicer licensing requirements
**Duration:** Ongoing throughout loan term

**Default Tasks:**
| # | Task | Type | Subtasks | Assigned Role |
|---|------|------|----------|---------------|
| 6.2.1 | Configure loan servicing system | action | - Set up loan in servicing platform<br>- Configure payment schedule, rates, fees<br>- Set up ACH collection (if borrower authorizes)<br>- Configure escrow account for insurance and reappraisal reserves<br>- Set up automated statement generation<br>- PleoChrome servicing fee: 0.75%/year of outstanding balance | cto |
| 6.2.2 | Monthly servicing operations | action | - Collect and apply monthly payments (interest before principal)<br>- Post payments to borrower's account<br>- Distribute payments to lender/note holder<br>- Manage escrow disbursements<br>- Generate and send monthly statements<br>- Track days past due and late fees | cro |
| 6.2.3 | Quarterly Proof of Reserve verification | automated | - Trigger PoR check against vault API (for tangible assets)<br>- For real estate: verify title insurance still in force, no new liens<br>- For mineral rights: verify production still active, review royalty statements<br>- Log verification results in compliance dashboard<br>- Flag any discrepancies for immediate investigation | cto |
| 6.2.4 | Annual reappraisal | action | - Commission annual reappraisal of collateral (1 appraiser sufficient for annual)<br>- Compare to original appraised value<br>- Recalculate LTV<br>- If LTV exceeds covenant threshold: initiate margin call procedure<br>- If LTV has improved: document for loan file<br>- Cost: $2K–$10K depending on asset class | cro |
| 6.2.5 | Insurance renewal monitoring | action | - Track all insurance policy expiration dates<br>- Send renewal reminders 90 and 60 days before expiry<br>- Verify renewed coverage meets requirements<br>- If borrower fails to maintain insurance: force-place coverage (charge to borrower)<br>- File updated certificates | compliance_officer |
| 6.2.6 | UCC continuation filing | action | - File UCC-3 continuation statement before 5-year lapse (file 6 months before lapse date)<br>- If loan term exceeds 5 years: mandatory continuation<br>- Verify continuation properly indexed<br>- **Failure to file = loss of perfection = loss of priority** | compliance_officer |

**Required Documents:** `appraisal_report` (annual), `insurance_certificate` (annual renewal), `investor_report` (quarterly/annual)

---

### 6.3 Default & Workout Procedures
**Governance Basis:** UCC Article 9 Part 6 governs enforcement of security interests after default. Secured party must act in a commercially reasonable manner.
**Regulatory Citation:** UCC 9-601 (Rights after default); UCC 9-610 (Disposition); UCC 9-611 (Notification); UCC 9-612 (Timeliness of notification); UCC 9-615 (Application of proceeds); UCC 9-626 (Noncompliance penalties)
**Duration:** 30–180 days (depending on resolution path)

**Default Tasks:**
| # | Task | Type | Subtasks | Assigned Role |
|---|------|------|----------|---------------|
| 6.3.1 | Payment default notice | action | - If payment 30+ days past due: issue formal default notice<br>- Specify default, required cure, and cure period (typically 30 days)<br>- Send via certified mail and email<br>- Begin default interest rate accrual<br>- Document all communications | compliance_officer |
| 6.3.2 | Workout negotiation (if applicable) | action | - Assess borrower's willingness and ability to cure<br>- Explore options: rate modification, term extension, partial paydown, additional collateral<br>- If restructuring: draft modification agreement<br>- Obtain lender/note holder consent for any modification<br>- If no cure possible: proceed to enforcement | ceo |
| 6.3.3 | Collateral disposition (foreclosure) | action | - UCC 9-610: Dispose in commercially reasonable manner<br>- Send notification to debtor, guarantors, and junior secured parties (UCC 9-611)<br>- Minimum 10 days notice before disposition (UCC 9-612 safe harbor)<br>- Options: public auction (UCC 9-610(c)) or private sale<br>- For gemstones/metals: engage recognized auction house or dealer<br>- For real estate: follow state foreclosure procedures (judicial or non-judicial depending on state)<br>- For mineral rights: broker sale through recognized mineral broker<br>- Document commercial reasonableness of disposition method<br>- Apply proceeds per UCC 9-615 (expenses → debt → junior lienholders → debtor surplus) | ceo |
| 6.3.4 | Deficiency or surplus handling | action | - If proceeds < debt: send deficiency notice to borrower/guarantor<br>- Pursue deficiency judgment if economics warrant<br>- If proceeds > debt: remit surplus to borrower within reasonable time (UCC 9-615(d))<br>- File UCC-3 termination after disposition<br>- Close loan file | compliance_officer |

**Required Documents:** `correspondence` (default notices, disposition records)

---

### 6.4 Loan Maturity & Payoff
**Governance Basis:** Upon full satisfaction of the debt, the secured party must file a UCC-3 termination statement within 20 days of debtor's authenticated demand.
**Regulatory Citation:** UCC 9-513 (Termination Statement — 20 days); State recording statutes (mortgage/deed of trust release)
**Duration:** 1–2 weeks

**Default Tasks:**
| # | Task | Type | Subtasks | Assigned Role |
|---|------|------|----------|---------------|
| 6.4.1 | Payoff processing | action | - Calculate payoff amount (principal + accrued interest + fees)<br>- Provide payoff statement to borrower<br>- Receive and verify payoff funds (certified funds or wire)<br>- Apply final payment and zero balance | cro |
| 6.4.2 | Collateral release | action | - Authorize custodian/vault to release collateral to borrower<br>- Execute collateral release authorization letter<br>- For real estate: record release/satisfaction of mortgage<br>- For mineral rights: file release of assignment with operator<br>- Confirm borrower receipt of collateral | ceo |
| 6.4.3 | UCC-3 termination filing | action | - File UCC-3 termination statement with secretary of state<br>- Must be filed within 20 days of borrower's authenticated demand<br>- Failure to file: secured party liable for $500 penalty per UCC 9-625(e)(3)<br>- Verify termination properly indexed<br>- Retain copy in loan file | compliance_officer |
| 6.4.4 | Loan file closure | action | - Generate final loan accounting statement<br>- File all closing documents<br>- Archive loan file per retention schedule (6 years minimum)<br>- Send loan satisfaction letter to borrower<br>- Update CRM status to `completed`<br>- Remove any monitoring/reminder calendar entries | compliance_officer |

**Required Documents:** `correspondence` (payoff statement, release authorization, UCC-3 termination)

---

### 6.5 Reporting & Tax Obligations
**Governance Basis:** Lenders and servicers have ongoing reporting obligations to borrowers and tax authorities.
**Regulatory Citation:** IRS Form 1098 (Mortgage Interest Statement — if $600+ interest received); IRS Form 1099-INT (if applicable); IRC Section 6050H
**Duration:** Annual (throughout loan term)

**Default Tasks:**
| # | Task | Type | Subtasks | Assigned Role |
|---|------|------|----------|---------------|
| 6.5.1 | Quarterly investor/lender reporting | action | - Payment status update<br>- Collateral value update (if reappraisal performed)<br>- LTV calculation<br>- Insurance status<br>- Any material events (default, restructuring, appraisal variance) | cro |
| 6.5.2 | Annual tax reporting | action | - Issue IRS Form 1098 to borrower (if mortgage interest $600+)<br>- Issue IRS Form 1099-INT to note holders (if applicable)<br>- If participation notes: issue K-1 to participation holders by March 15<br>- File copies with IRS<br>- Provide borrower with annual loan statement | compliance_officer |
| 6.5.3 | Annual compliance audit | review | - Review all active loans for compliance<br>- Verify all UCC filings current (continuation statements filed before lapse)<br>- Verify all insurance certificates current<br>- Verify all reappraisals current (within 12 months)<br>- Verify all PoR checks current<br>- Document audit results<br>- Remediate any findings | compliance_officer |

**Required Documents:** `tax_document`, `investor_report`

---

## WORKFLOW B: BROKER SALE (Traditional Brokered Asset Sale)
**Purpose:** Sell the asset through a dealer/broker network rather than using it as debt collateral
**Duration:** 4–16 weeks depending on asset class and market conditions

### B.1 Broker Engagement
**Duration:** 1–2 weeks

| # | Task | Type | Description |
|---|------|------|-------------|
| B.1.1 | Select broker/dealer | action | - For gemstones: engage Christie's, Sotheby's, Phillips, Bonhams, or specialized dealer (e.g., Graff, Harry Winston channel)<br>- For precious metals: LBMA dealer, COMEX broker, or bullion dealer<br>- For real estate: licensed real estate broker in property jurisdiction<br>- For mineral rights: mineral broker (e.g., LandGate, EnergyNet, US Mineral Exchange) |
| B.1.2 | Negotiate broker terms | action | - Commission rate (gemstones: 10–25% auction / 5–15% private; metals: 1–3%; real estate: 5–6%; minerals: 5–10%)<br>- Exclusive vs. non-exclusive listing<br>- Listing duration and renewal terms<br>- Reserve price / minimum price<br>- Marketing budget allocation |
| B.1.3 | Execute listing/consignment agreement | upload | - Define scope, commission, duration, exclusivity<br>- Set reserve/minimum price<br>- Establish marketing plan<br>- Include representations and warranties<br>- Insurance and custody during marketing period |

**Required Documents:** `partner_agreement` (listing/consignment agreement)

### B.2 Marketing & Sale Process
**Duration:** 2–12 weeks

| # | Task | Type | Description |
|---|------|------|-------------|
| B.2.1 | Prepare marketing materials | action | - Professional photography / property brochure<br>- Certification and appraisal summaries<br>- Provenance documentation for marketing<br>- For auction: catalog lot preparation |
| B.2.2 | Conduct marketing campaign | action | - Broker's client network distribution<br>- Industry publication advertising<br>- Digital marketing (if appropriate)<br>- Private viewings / property showings<br>- Auction catalog distribution (if auction) |
| B.2.3 | Receive and evaluate offers | review | - Review all offers for adequacy<br>- Verify buyer financial capacity<br>- Evaluate terms (price, contingencies, timeline)<br>- Present offers to asset holder with recommendation |
| B.2.4 | Negotiate and accept offer | action | - Counter-offer if appropriate<br>- Negotiate final terms<br>- Execute purchase agreement<br>- For real estate: open escrow |

### B.3 Closing & Transfer
**Duration:** 1–4 weeks

| # | Task | Type | Description |
|---|------|------|-------------|
| B.3.1 | Buyer due diligence period | action | - Buyer inspects asset / property / title<br>- Buyer arranges financing (if applicable)<br>- Buyer completes KYC/KYB verification |
| B.3.2 | Close transaction | action | - Receive purchase funds (escrow or direct)<br>- Transfer title/possession to buyer<br>- For real estate: record deed, issue title insurance<br>- For minerals: record assignment, notify operator<br>- For gemstones/metals: transfer custody from vault<br>- Pay broker commission |
| B.3.3 | Post-sale administration | action | - Distribute net proceeds to asset holder<br>- Collect PleoChrome success fee (1.5%)<br>- File any required UCC terminations<br>- Issue tax documents (1099-S for real estate if applicable)<br>- Close asset file in CRM |

**Required Documents:** `correspondence` (purchase agreement, closing documents)

### Regulatory Considerations — Broker Sale
| Regulation | Applicability |
|------------|---------------|
| State real estate broker licensing | Required for real estate sales; PleoChrome would need licensed broker or broker partnership |
| Auction house regulations | Varies by state; some require auctioneer license |
| Sales tax | Varies by state and asset class; gemstones/metals may be exempt in some states |
| Capital gains reporting | IRS Form 1099-S (real estate); Form 1099-B (broker sales); 28% collectibles rate for gemstones |
| State dealer licensing | Some states require precious metals/gemstone dealer licenses |

---

## WORKFLOW C: BARTER / EXCHANGE
**Purpose:** Asset-for-asset trade, potentially as a 1031 exchange (real estate/mineral rights) or direct swap
**Duration:** 4–12 weeks

### C.1 Exchange Identification
**Duration:** 1–2 weeks

| # | Task | Type | Description |
|---|------|------|-------------|
| C.1.1 | Identify exchange counterparty | action | - Source through dealer networks, direct outreach, or exchange platforms<br>- For IRC 1031: must be "like-kind" property (real property for real property only after 2017 TCJA)<br>- For non-1031: any mutually agreed exchange |
| C.1.2 | Preliminary valuation matching | action | - Value both assets using independent appraisals<br>- Calculate boot (cash difference) if values unequal<br>- Determine if exchange makes economic sense for both parties |
| C.1.3 | Tax structure analysis | review | - For real estate/mineral rights: evaluate IRC 1031 like-kind exchange eligibility<br>- For gemstones/metals: 1031 NOT available (TCJA 2017 limited to real property only)<br>- Calculate tax implications of direct exchange vs. sale/purchase<br>- Engage tax counsel for ruling |

### C.2 Exchange Structuring
**Duration:** 2–4 weeks

| # | Task | Type | Description |
|---|------|------|-------------|
| C.2.1 | **IRC 1031 Exchange (if eligible — real estate/minerals only)** | action | - Engage Qualified Intermediary (QI) — CRITICAL: QI must be engaged BEFORE closing of relinquished property<br>- 45-day identification period for replacement property<br>- 180-day completion deadline<br>- QI holds proceeds — exchanger cannot touch funds<br>- Document exchange agreement per Treasury Reg 1.1031<br>- **Regulatory:** IRC 1031; Treasury Reg 1.1031(k)-1 |
| C.2.2 | **Direct exchange (non-1031)** | action | - Draft exchange agreement specifying both assets<br>- Define valuations and boot amount<br>- Define simultaneous or sequential closing<br>- Each party provides representations and warranties re: their asset<br>- Each party responsible for their own due diligence |
| C.2.3 | Mutual due diligence | action | - Both parties inspect counterparty's asset<br>- Both parties verify title/ownership<br>- Both parties obtain independent appraisals<br>- Both parties complete KYC/KYB on counterparty |

### C.3 Exchange Closing
**Duration:** 1–4 weeks

| # | Task | Type | Description |
|---|------|------|-------------|
| C.3.1 | Execute exchange closing | action | - Simultaneous transfer of both assets (or sequential per agreement)<br>- For 1031: closing through QI per safe harbor requirements<br>- Transfer of custody, title, possession<br>- Payment of boot (cash difference) if applicable<br>- Record all title transfers |
| C.3.2 | Post-exchange administration | action | - File IRS Form 8824 (Like-Kind Exchanges) if 1031<br>- Report exchange on tax returns<br>- Update CRM records for both assets<br>- Collect PleoChrome facilitation fee<br>- Issue tax documents to both parties |

**Required Documents:** `correspondence` (exchange agreement, QI engagement letter if 1031), `appraisal_report`, `tax_document` (Form 8824)

### Regulatory Considerations — Barter/Exchange
| Regulation | Applicability |
|------------|---------------|
| IRC Section 1031 | Like-kind exchange: real property only (post-TCJA 2017). 45-day ID / 180-day completion. QI required. |
| IRC Section 1001 | Recognition of gain/loss on exchange of property (if not 1031-qualifying) |
| Treasury Reg 1.1031(k)-1 | Deferred exchange safe harbors, QI requirements |
| State transfer taxes | May apply to both sides of exchange (real estate) |
| IRS Form 8824 | Required reporting for like-kind exchanges |
| 28% collectibles rate | Gemstones/precious metals exchanges taxed at collectibles rate (not eligible for 1031) |
| State sales tax | May apply to non-real-estate exchanges in some states |

---

## COMPREHENSIVE REGULATORY REFERENCE

### Federal Regulations
| Regulation | Full Citation | Applicability |
|------------|---------------|---------------|
| UCC Article 3 | Uniform Commercial Code Art. 3 | Promissory note enforceability |
| UCC Article 9 | Uniform Commercial Code Art. 9 | Security interest creation, perfection, priority, enforcement |
| UCC 9-108 | | Sufficiency of collateral description |
| UCC 9-203 | | Attachment of security interest (enforceability requirements) |
| UCC 9-301 | | Law governing perfection (debtor's state of organization) |
| UCC 9-310 | | Perfection by filing UCC-1 |
| UCC 9-313 | | Perfection by possession (tangible collateral) |
| UCC 9-322 | | Priority among competing security interests |
| UCC 9-503 | | Name of debtor on financing statement |
| UCC 9-504 | | Indication of collateral |
| UCC 9-513 | | Termination statement (20-day requirement) |
| UCC 9-515 | | Duration of financing statement (5 years) |
| UCC 9-601 | | Rights after default |
| UCC 9-610 | | Disposition of collateral after default |
| UCC 9-611 | | Notification before disposition |
| UCC 9-612 | | Timeliness of notification (10-day safe harbor) |
| UCC 9-615 | | Application of proceeds (waterfall) |
| UCC 9-625 | | Remedies for noncompliance ($500 penalty for late termination) |
| TILA | 15 U.S.C. 1601 et seq. | Consumer loan disclosures (if consumer-purpose) |
| Reg Z | 12 CFR 1026 | TILA implementing regulation |
| RESPA | 12 U.S.C. 2601 et seq. | Real estate settlement procedures (if federally related mortgage) |
| ECOA | 15 U.S.C. 1691 | Equal credit opportunity (all loans) |
| Reg B | 12 CFR 1002 | ECOA implementing regulation |
| BSA | 31 U.S.C. 5311-5332 | Anti-money laundering obligations |
| FinCEN CDD Rule | 31 CFR 1010.230 | Customer Due Diligence (beneficial ownership) |
| FinCEN DPMS | 31 CFR Part 1027 | Dealers in Precious Metals, Stones, or Jewels |
| OFAC | 31 CFR Part 501 | Sanctions compliance |
| Securities Act | 15 U.S.C. 77a et seq. | If participation notes: securities registration/exemption |
| Reg D 506(c) | 17 CFR 230.506(c) | If participation notes: accredited investor offering |
| Form D | 17 CFR 230.503 | If participation notes: SEC notice filing |
| Rule 506(d) | 17 CFR 230.506(d) | Bad actor disqualification (if securities) |
| Reves test | Reves v. Ernst & Young, 494 U.S. 56 (1990) | Whether participation notes are securities |
| IRC 408(m)(2) | 26 U.S.C. 408(m)(2) | Collectibles definition (gemstones, metals) |
| IRC 1031 | 26 U.S.C. 1031 | Like-kind exchanges (real property only post-2017) |
| Clean Diamond Trade Act | 19 U.S.C. 3901-3913 | Kimberley Process compliance (diamonds) |
| Dodd-Frank 1502 | 15 U.S.C. 78m(p) | Conflict minerals (gold, tin, tungsten, tantalum) |
| FIRREA 1110 | 12 U.S.C. 3339 | Real estate appraisal standards |

### State-Level Considerations
| Category | Key States | Notes |
|----------|-----------|-------|
| Usury laws | NY (16%/25% criminal), CA (10% unlicensed), FL (18%/25%), TX (varies by structure) | Most states exempt business-purpose loans above threshold amounts |
| Lending licenses | CA (CFL/CRMLA), NY (Licensed Lender), GA, MD, IL, NJ, OR, VT | Many states exempt business-purpose, high-amount, or specified entity types |
| UCC filing offices | All 50 states + DC | File in debtor's state of organization; fixture filings with county |
| Recording statutes | All 50 states | For real estate: race-notice (majority), race, or notice jurisdictions |
| Foreclosure type | Varies by state | Judicial (NY, FL, IL, NJ) vs. Non-judicial (CA, TX, VA, GA) |
| Sales tax on tangible assets | Varies by state | Some states exempt precious metals (e.g., TX, FL), some tax gemstones |
| Mineral rights conveyance | TX, OK, CO, NM, ND, WY, LA | State-specific recording requirements and operator notification |

---

## DURATION SUMMARY

| Stage | Phase | Duration | Dependencies |
|-------|-------|----------|--------------|
| 1. Lead | Foundation/Intake | 1–3 weeks | None |
| 2. Intake | Intake | 2–4 weeks | Lead Gate passed |
| 3. Asset Maturity | Certification | 4–10 weeks | Intake Gate passed |
| 4. Security | Custody (Debt) | 2–4 weeks | Asset Maturity Gate passed |
| 5. Value Creation | Legal (Debt) | 1–2 weeks | Security Gate passed |
| 6. Distribution | Distribution/Ongoing | Ongoing (12–36 months) | Value Creation Gate passed |
| **Total to closing** | | **10–23 weeks** | |
| **Broker Sale** | N/A | 4–16 weeks | Asset Maturity complete |
| **Barter/Exchange** | N/A | 4–12 weeks | Asset Maturity complete |

---

## TASK COUNT SUMMARY

| Stage | Governance Requirements | Default Tasks | Subtasks (approx.) |
|-------|------------------------|---------------|---------------------|
| 1. Lead | 4 + 1 gate | 13 | ~50 |
| 2. Intake | 4 + 1 gate | 14 | ~60 |
| 3. Asset Maturity | 5 + 1 gate | 16 | ~70 |
| 4. Security | 4 + 1 gate | 12 | ~50 |
| 5. Value Creation | 3 + 1 gate | 10 | ~40 |
| 6. Distribution | 5 + 0 gates | 20 | ~80 |
| **Debt Total** | **25 + 5 gates** | **85** | **~350** |
| Broker Sale | 3 phases | 10 | ~30 |
| Barter/Exchange | 3 phases | 8 | ~20 |
| **Grand Total** | **25 + 5 gates** | **103** | **~400** |

---

## DATA SEEDING FORMAT

The data in this spec should be seeded into the PleoChrome database using the following mapping:

```
governance_requirements:
  - value_path: 'debt_instruments' (or null for shared stages 1-3)
  - phase: maps to workflow_phase enum
  - step_number: "X.Y" format
  - title: requirement name
  - description: full requirement description
  - regulatory_basis: plain-language "why"
  - regulatory_citation: exact law/rule citation
  - is_gate: true for gate requirements
  - gate_id: "G0", "G1", "G2", "G3", "G4"
  - required_documents: array of document_type values
  - required_approvals: JSONB with internal/external roles

default_tasks:
  - governance_requirement_id: FK to parent requirement
  - task_title: task name
  - task_description: detailed description with subtasks
  - task_type: 'action' | 'upload' | 'review' | 'approval' | 'automated'
  - assigned_role: default role assignment
  - estimated_duration: text duration estimate
  - sort_order: sequential within requirement

governance_documents:
  - governance_requirement_id: FK to parent requirement
  - document_type: from document_type enum
  - description: what the document proves
  - is_required: boolean
```

### New Enums / Types Needed
The following may need to be added to the database schema:

```sql
-- Additional document types (if not already in enum)
-- 'ucc_filing'
-- 'title_report'
-- 'survey'
-- 'environmental_assessment'
-- 'mineral_title_opinion'
-- 'production_report'
-- 'lender_engagement_letter'
-- 'participation_agreement'
-- 'payoff_statement'
-- 'release_authorization'
-- 'exchange_agreement'

-- Additional partner types (if not already in enum)
-- 'mineral_broker'
-- 'title_company'
-- 'qualified_intermediary'
-- 'real_estate_broker'
-- 'petroleum_engineer'
-- 'tax_counsel'
-- 'loan_servicer'

-- Workflow type for broker sale and barter
-- Could be a new value_path or a separate workflow_type enum
```

---

*This specification is exhaustive and designed to be machine-parseable for database seeding. Each stage, task, and subtask maps directly to the PleoChrome Powerhouse CRM three-layer governance model.*
