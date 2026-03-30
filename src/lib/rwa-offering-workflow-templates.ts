/* ═══════════════════════════════════════════════════════════════════════════════
   PleoChrome — RWA Fractional Securities Offering Workflow Templates
   ═══════════════════════════════════════════════════════════════════════════════

   Exhaustive, SEC-regulation-grounded workflow templates for fractional
   securities offerings of real-world assets. Designed to seed the governance_requirements
   and default_tasks tables in the Powerhouse CRM.

   Asset classes covered:
     1. Gemstones (colored stones, diamonds)
     2. Precious Metals (gold, silver, platinum, palladium)
     3. Real Estate (commercial, residential, land)
     4. Mineral Rights (oil, gas, mining)

   Pipeline stages:
     Stage 1: LEAD — Initial outreach, qualification
     Stage 2: INTAKE — Full asset details, provenance, holder info
     Stage 3: ASSET MATURITY — Certification, appraisal, custody, insurance
     Stage 4: SECURITY — SEC registration, legal structuring, issuer formation
     Stage 5: VALUE CREATION — Offering memorandum, investor qualification, subscriptions
     Stage 6: DISTRIBUTION — ATS listing, BD placement, secondary trading

   Each stage maps to the existing workflow_phase enum:
     Stage 1 → phase_1_intake (lead qualification subset)
     Stage 2 → phase_1_intake (full intake)
     Stage 3 → phase_2_certification
     Stage 4 → phase_3_custody (securities structuring)
     Stage 5 → phase_4_legal (value creation / offering)
     Stage 6 → phase_4_legal (distribution / ongoing)

   Regulatory framework: US Federal (SEC, FINRA, FinCEN) + State (Blue Sky, UCC)

   Last Updated: 2026-03-29
   ═══════════════════════════════════════════════════════════════════════════════ */

// ── Types ────────────────────────────────────────────────────────────────────

export type AssetClass = 'gemstones' | 'precious_metals' | 'real_estate' | 'mineral_rights';

export type OfferingStage =
  | 'lead'
  | 'intake'
  | 'asset_maturity'
  | 'security'
  | 'value_creation'
  | 'distribution';

export type TaskType = 'action' | 'upload' | 'review' | 'approval' | 'automated' | 'meeting' | 'payment' | 'filing';

export type RegulationType =
  | 'sec'
  | 'finra'
  | 'fincen'
  | 'state_blue_sky'
  | 'ucc'
  | 'irs'
  | 'uspap'
  | 'occ'
  | 'cftc'
  | 'blm'
  | 'state_mineral'
  | 'kimberley_process'
  | 'lbma'
  | 'soc2'
  | 'ofac'
  | 'none';

export interface SubTask {
  id: string;
  title: string;
  description: string;
  task_type: TaskType;
  assigned_role: string;
  estimated_duration: string;
  required_documents?: string[];
  is_blocking?: boolean;
}

export interface WorkflowTask {
  id: string;
  step_number: string;
  title: string;
  description: string;
  task_type: TaskType;
  assigned_role: string;
  estimated_duration: string;
  estimated_cost?: string;

  // Regulatory
  regulatory_basis: string;
  regulatory_citations: string[];
  regulation_types: RegulationType[];
  source_urls?: string[];

  // Documents
  required_documents: string[];
  output_documents: string[];

  // Dependencies
  depends_on?: string[]; // step_numbers this task depends on
  is_gate?: boolean;
  gate_id?: string;

  // Approval
  required_approvals?: {
    internal?: string[];
    external?: string[];
  };

  // Asset class applicability
  asset_classes: AssetClass[] | 'all';

  // Asset-class-specific variations
  variations?: Partial<Record<AssetClass, {
    description_override?: string;
    additional_documents?: string[];
    additional_subtasks?: SubTask[];
    estimated_duration_override?: string;
    estimated_cost_override?: string;
    regulatory_citations_override?: string[];
  }>>;

  // Sub-tasks
  subtasks?: SubTask[];
}

export interface WorkflowStage {
  stage: OfferingStage;
  stage_number: number;
  title: string;
  subtitle: string;
  description: string;
  maps_to_phase: string; // workflow_phase enum value
  estimated_total_duration: string;
  tasks: WorkflowTask[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// STAGE 1: LEAD — Initial Outreach & Qualification
// Maps to: phase_1_intake (early)
// Duration: 1-4 weeks
// ═══════════════════════════════════════════════════════════════════════════════

export const STAGE_1_LEAD: WorkflowStage = {
  stage: 'lead',
  stage_number: 1,
  title: 'Lead',
  subtitle: 'Initial Outreach & Qualification',
  description: 'Source potential assets, make first contact with holders, perform preliminary screening to determine if the asset and holder meet minimum criteria for the PleoChrome pipeline.',
  maps_to_phase: 'phase_1_intake',
  estimated_total_duration: '1-4 weeks',
  tasks: [
    {
      id: 'L-1.1',
      step_number: '1.1',
      title: 'Identify Target Asset',
      description: 'Source from vault inventories, dealer networks, broker introductions, estate sales, and direct holder outreach. Confirm minimum value threshold, asset type eligibility, and holder willingness to engage.',
      task_type: 'action',
      assigned_role: 'chief_revenue_officer',
      estimated_duration: '1-7 days',
      regulatory_basis: 'Securities offerings require sufficient asset value to justify regulatory compliance costs. The minimum threshold ensures economic viability of the offering structure and satisfies institutional investor expectations.',
      regulatory_citations: [],
      regulation_types: ['none'],
      required_documents: [],
      output_documents: ['lead_intake_form'],
      asset_classes: 'all',
      variations: {
        gemstones: {
          description_override: 'Source from vault inventories, dealer networks (Colombo, Bangkok, Jaipur, NYC 47th St), auction houses (Christie\'s, Sotheby\'s, Bonhams), estate sales, and direct holder referrals. Confirm minimum value threshold ($1M+), stone type (emerald, ruby, sapphire, alexandrite, paraiba tourmaline, padparadscha), and holder willingness.',
          estimated_cost_override: '$0',
        },
        precious_metals: {
          description_override: 'Source from LBMA-approved refiners, sovereign mint inventories, allocated account holders, ETF redemption opportunities, and institutional metal dealers. Confirm minimum value threshold ($500K+), metal type (gold, silver, platinum, palladium), form (bars, coins, allocated accounts), and LBMA/COMEX deliverable status.',
          additional_documents: ['lbma_good_delivery_list_check'],
        },
        real_estate: {
          description_override: 'Source from commercial brokers (CBRE, JLL, Cushman & Wakefield), MLS listings, off-market deals, distressed asset funds, 1031 exchange intermediaries, and direct owner outreach. Confirm minimum value threshold ($1M+), property type (multifamily, office, retail, industrial, land), location, and zoning.',
          additional_documents: ['property_listing_sheet', 'preliminary_title_search'],
        },
        mineral_rights: {
          description_override: 'Source from mineral rights brokers, county courthouse records, BLM patent databases, landmen referrals, and producing operator divestiture programs. Confirm minimum value threshold ($500K+), resource type (oil, gas, coal, lithium, rare earth), production status (producing vs. non-producing), and legal description.',
          additional_documents: ['county_mineral_records_printout'],
        },
      },
      subtasks: [
        {
          id: 'L-1.1.1',
          title: 'Source Screening',
          description: 'Verify the source/referrer is reputable. Check for prior bad acts, sanctions, or known fraud associations.',
          task_type: 'action',
          assigned_role: 'chief_revenue_officer',
          estimated_duration: '1-2 hours',
        },
        {
          id: 'L-1.1.2',
          title: 'Preliminary Value Assessment',
          description: 'Desktop estimate using comparable sales, price indices, and publicly available data. Determine if the asset meets the minimum threshold for the pipeline.',
          task_type: 'action',
          assigned_role: 'chief_revenue_officer',
          estimated_duration: '2-4 hours',
        },
        {
          id: 'L-1.1.3',
          title: 'CRM Lead Creation',
          description: 'Create lead record in Powerhouse CRM with basic asset details, holder contact information, source channel, and preliminary value estimate.',
          task_type: 'action',
          assigned_role: 'chief_revenue_officer',
          estimated_duration: '15 minutes',
        },
      ],
    },
    {
      id: 'L-1.2',
      step_number: '1.2',
      title: 'Holder Introduction & NDA',
      description: 'First formal contact with asset holder. Execute mutual NDA. Share PleoChrome overview deck. Assess holder sophistication, timeline expectations, and willingness to undergo full due diligence process.',
      task_type: 'action',
      assigned_role: 'chief_revenue_officer',
      estimated_duration: '3-7 days',
      regulatory_basis: 'NDAs protect trade secrets and material non-public information during the evaluation period. Required for compliance with insider trading regulations and to preserve confidentiality of offering structure details.',
      regulatory_citations: ['Defend Trade Secrets Act, 18 U.S.C. 1836'],
      regulation_types: ['none'],
      source_urls: ['https://www.law.cornell.edu/uscode/text/18/1836'],
      required_documents: [],
      output_documents: ['nda', 'overview_deck'],
      asset_classes: 'all',
      subtasks: [
        {
          id: 'L-1.2.1',
          title: 'Schedule Introduction Call/Meeting',
          description: 'Coordinate schedules and confirm meeting format (video, phone, in-person). For high-value assets ($5M+), prefer in-person meeting.',
          task_type: 'meeting',
          assigned_role: 'chief_revenue_officer',
          estimated_duration: '1-3 days',
        },
        {
          id: 'L-1.2.2',
          title: 'Prepare Customized Deck',
          description: 'Customize the PleoChrome overview deck for the specific asset class and holder profile. Include relevant case studies, fee structure overview, and timeline estimates.',
          task_type: 'action',
          assigned_role: 'chief_revenue_officer',
          estimated_duration: '2-4 hours',
        },
        {
          id: 'L-1.2.3',
          title: 'Execute Mutual NDA',
          description: 'Send, negotiate (if needed), and countersign mutual NDA. Use PleoChrome standard NDA template reviewed by counsel. Store executed copy in document vault.',
          task_type: 'upload',
          assigned_role: 'chief_revenue_officer',
          estimated_duration: '1-5 days',
          required_documents: ['nda'],
        },
        {
          id: 'L-1.2.4',
          title: 'Conduct Introduction Meeting',
          description: 'Present PleoChrome value proposition. Assess holder sophistication, expectations, timeline flexibility, and willingness to undergo KYC, appraisal, and custody transfer. Document meeting notes.',
          task_type: 'meeting',
          assigned_role: 'chief_revenue_officer',
          estimated_duration: '1-2 hours',
        },
        {
          id: 'L-1.2.5',
          title: 'Post-Meeting Assessment',
          description: 'Internal debrief. Score holder on cooperation likelihood, asset quality indicators, timeline alignment, and deal complexity. Update CRM lead record.',
          task_type: 'review',
          assigned_role: 'chief_revenue_officer',
          estimated_duration: '30 minutes',
        },
      ],
    },
    {
      id: 'L-1.3',
      step_number: '1.3',
      title: 'Preliminary KYC Screening',
      description: 'Run initial identity verification and sanctions screening on the asset holder (individual or entity). OFAC/SDN check, PEP screening, adverse media scan. This is a preliminary screen — full KYC occurs at Intake.',
      task_type: 'automated',
      assigned_role: 'compliance_officer',
      estimated_duration: '1-3 days',
      regulatory_basis: 'Bank Secrecy Act and FinCEN regulations require identification of all parties in financial transactions. OFAC sanctions compliance is mandatory — transacting with an SDN-listed person or entity is a federal crime. Dealers in Precious Metals, Stones, or Jewels (DPMS) have heightened AML obligations under 31 CFR Part 1027.',
      regulatory_citations: [
        'BSA 31 USC 5311-5332',
        'FinCEN 31 CFR Part 1027 (DPMS)',
        'OFAC 31 CFR Part 501',
        'USA PATRIOT Act Section 326 (CIP)',
      ],
      regulation_types: ['fincen', 'ofac'],
      source_urls: [
        'https://www.fincen.gov/news/news-releases/dealers-precious-metals-stones-or-jewels-required-establish-anti-money-0',
        'https://sanctionssearch.ofac.treas.gov/',
      ],
      required_documents: ['government_id', 'proof_of_address'],
      output_documents: ['ofac_screening_result', 'pep_screening_result'],
      asset_classes: 'all',
      subtasks: [
        {
          id: 'L-1.3.1',
          title: 'Collect Identity Documents',
          description: 'Request government-issued photo ID (passport preferred), proof of address (utility bill or bank statement within 90 days), and for entities: articles of incorporation, certificate of good standing.',
          task_type: 'upload',
          assigned_role: 'compliance_officer',
          estimated_duration: '1-2 days',
          required_documents: ['government_id', 'proof_of_address'],
        },
        {
          id: 'L-1.3.2',
          title: 'OFAC/SDN Screening',
          description: 'Screen holder name, aliases, and entity name against OFAC Specially Designated Nationals (SDN) list, Consolidated Sanctions List, and EU/UK sanctions lists.',
          task_type: 'automated',
          assigned_role: 'compliance_officer',
          estimated_duration: '1 hour',
          is_blocking: true,
        },
        {
          id: 'L-1.3.3',
          title: 'PEP Screening',
          description: 'Check if holder is a Politically Exposed Person (PEP) or related to a PEP. Flag for enhanced due diligence if positive.',
          task_type: 'automated',
          assigned_role: 'compliance_officer',
          estimated_duration: '1 hour',
        },
        {
          id: 'L-1.3.4',
          title: 'Adverse Media Scan',
          description: 'Search news databases, court records, and regulatory enforcement actions for the holder name and any associated entities.',
          task_type: 'automated',
          assigned_role: 'compliance_officer',
          estimated_duration: '2-4 hours',
        },
      ],
    },
    {
      id: 'L-1.4',
      step_number: '1.4',
      title: 'Lead Qualification Decision',
      description: 'Internal review of all preliminary data. Score the lead on asset quality, holder reliability, regulatory risk, market demand, and economic viability. Go/No-Go decision to proceed to full Intake.',
      task_type: 'approval',
      assigned_role: 'ceo',
      estimated_duration: '1-3 days',
      depends_on: ['1.1', '1.2', '1.3'],
      regulatory_basis: 'Documented decision-making provides evidence of reasonable judgment and protects against liability claims. Internal deal committee review is a SOC 2 processing integrity control.',
      regulatory_citations: [],
      regulation_types: ['soc2'],
      required_documents: [],
      output_documents: ['lead_qualification_memo'],
      required_approvals: {
        internal: ['ceo', 'chief_revenue_officer'],
      },
      asset_classes: 'all',
      subtasks: [
        {
          id: 'L-1.4.1',
          title: 'Prepare Lead Package',
          description: 'Compile all preliminary data: asset details, holder info, KYC screening results, preliminary valuation, and risk assessment into a standardized lead qualification package.',
          task_type: 'action',
          assigned_role: 'chief_revenue_officer',
          estimated_duration: '2-4 hours',
        },
        {
          id: 'L-1.4.2',
          title: 'Deal Committee Review',
          description: 'Founders review lead package. Evaluate: (1) asset quality and market demand, (2) holder cooperation likelihood, (3) regulatory complexity, (4) timeline to revenue, (5) capital requirements.',
          task_type: 'meeting',
          assigned_role: 'ceo',
          estimated_duration: '30-60 minutes',
        },
        {
          id: 'L-1.4.3',
          title: 'Record Decision',
          description: 'Document Go/No-Go decision with rationale in CRM. If Go: advance to Intake stage and notify holder. If No-Go: close lead with reason code and send courtesy notification to holder.',
          task_type: 'action',
          assigned_role: 'ceo',
          estimated_duration: '15 minutes',
        },
      ],
      is_gate: true,
      gate_id: 'G-LEAD',
    },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// STAGE 2: INTAKE — Full Asset Details, Provenance, Holder Info
// Maps to: phase_1_intake (full)
// Duration: 2-6 weeks
// ═══════════════════════════════════════════════════════════════════════════════

export const STAGE_2_INTAKE: WorkflowStage = {
  stage: 'intake',
  stage_number: 2,
  title: 'Intake',
  subtitle: 'Full Asset Documentation & Due Diligence',
  description: 'Collect comprehensive asset details, complete provenance documentation, perform full KYC/KYB on the holder, execute engagement agreement, and prepare the asset for the certification/appraisal pipeline.',
  maps_to_phase: 'phase_1_intake',
  estimated_total_duration: '2-6 weeks',
  tasks: [
    {
      id: 'I-2.1',
      step_number: '2.1',
      title: 'Full KYC / KYB on Asset Holder',
      description: 'Complete identity verification on the individual or entity. For entities: verify beneficial ownership (all >25% owners), corporate structure, state of organization, and authorized signatories. Enhanced due diligence for PEP or high-risk jurisdictions.',
      task_type: 'action',
      assigned_role: 'compliance_officer',
      estimated_duration: '3-10 days',
      regulatory_basis: 'Bank Secrecy Act and FinCEN Customer Identification Program (CIP) rules require identification and verification of all parties in financial transactions. FinCEN CDD Rule (effective May 2018) requires identification of beneficial owners (>25%) for legal entities. Enhanced Due Diligence (EDD) required for PEPs and high-risk customers.',
      regulatory_citations: [
        'BSA 31 USC 5311-5332',
        'FinCEN 31 CFR Part 1010.230 (CDD/Beneficial Ownership)',
        'FinCEN 31 CFR Part 1027 (DPMS)',
        'USA PATRIOT Act Section 326 (CIP)',
        'OFAC 31 CFR Part 501',
      ],
      regulation_types: ['fincen', 'ofac'],
      source_urls: [
        'https://www.fincen.gov/resources/statutes-and-regulations/cdd-final-rule',
      ],
      required_documents: ['government_id', 'proof_of_address', 'beneficial_ownership_form'],
      output_documents: ['kyc_report', 'ofac_screening', 'pep_screening', 'cdd_report'],
      asset_classes: 'all',
      subtasks: [
        {
          id: 'I-2.1.1',
          title: 'Collect Full KYC Package',
          description: 'For individuals: passport, driver\'s license, SSN/TIN, proof of address (2 forms), source of wealth declaration. For entities: articles of incorporation, certificate of good standing, operating agreement, EIN letter, beneficial ownership certification (FinCEN BOI Report if applicable), board resolution authorizing engagement.',
          task_type: 'upload',
          assigned_role: 'compliance_officer',
          estimated_duration: '3-7 days',
          required_documents: ['government_id', 'proof_of_address', 'beneficial_ownership_form', 'source_of_wealth_declaration'],
        },
        {
          id: 'I-2.1.2',
          title: 'Identity Verification',
          description: 'Verify identity documents against issuing authority databases. Cross-reference addresses. For entities: verify state registration, good standing, and authorized signatories.',
          task_type: 'automated',
          assigned_role: 'compliance_officer',
          estimated_duration: '1-2 days',
        },
        {
          id: 'I-2.1.3',
          title: 'Beneficial Ownership Verification',
          description: 'For entities: identify all beneficial owners (>25% equity or significant control). Verify each beneficial owner\'s identity. Cross-reference with FinCEN BOI database (when access available to non-financial institutions).',
          task_type: 'action',
          assigned_role: 'compliance_officer',
          estimated_duration: '2-5 days',
          required_documents: ['beneficial_ownership_form'],
        },
        {
          id: 'I-2.1.4',
          title: 'Source of Wealth / Source of Funds Analysis',
          description: 'Assess the legitimate source of the asset. How did the holder acquire it? Purchase receipts, inheritance documents, mining/extraction records, or prior auction records. Flag unexplained acquisition pathways.',
          task_type: 'review',
          assigned_role: 'compliance_officer',
          estimated_duration: '1-3 days',
        },
        {
          id: 'I-2.1.5',
          title: 'Enhanced Due Diligence (if triggered)',
          description: 'If PEP, high-risk jurisdiction, adverse media, or complex ownership structure: conduct enhanced due diligence including senior management approval, ongoing monitoring plan, and additional source of wealth verification.',
          task_type: 'review',
          assigned_role: 'compliance_officer',
          estimated_duration: '3-7 days',
        },
        {
          id: 'I-2.1.6',
          title: 'KYC Sign-Off',
          description: 'Compliance officer reviews all collected data and either approves KYC (clear), flags conditions (conditional), or rejects (fail). Document decision with rationale.',
          task_type: 'approval',
          assigned_role: 'compliance_officer',
          estimated_duration: '1 day',
          is_blocking: true,
        },
      ],
    },
    {
      id: 'I-2.2',
      step_number: '2.2',
      title: 'Provenance & Chain of Custody Documentation',
      description: 'Collect and verify the complete chain of custody from origin to current holder. Identify any gaps, disputes, liens, or encumbrances. Verify clean title.',
      task_type: 'action',
      assigned_role: 'chief_revenue_officer',
      estimated_duration: '1-3 weeks',
      regulatory_basis: 'Provenance establishes clean title and regulatory compliance. Required for investor protection — the PPM must accurately represent the asset\'s history. Undisclosed title defects create rescission liability under Securities Act Section 12(a)(2).',
      regulatory_citations: [
        'Securities Act Section 12(a)(2), 15 U.S.C. 77l',
        'UCC 2-403 (good faith purchaser)',
      ],
      regulation_types: ['sec', 'ucc'],
      source_urls: ['https://www.law.cornell.edu/uscode/text/15/77l'],
      required_documents: [],
      output_documents: ['provenance_chain_document', 'title_opinion'],
      asset_classes: 'all',
      variations: {
        gemstones: {
          description_override: 'Collect complete chain of custody: mine/origin to cutter to dealer to current holder. Verify Kimberley Process compliance for diamonds. For colored stones: obtain origin documentation from dealers and prior owners. Cross-reference with GIA/SSEF/Gubelin origin reports if available. Flag any gaps in the chain.',
          additional_documents: ['kimberley_process_certificate', 'mine_of_origin_documentation', 'prior_sales_receipts'],
          regulatory_citations_override: [
            'Clean Diamond Trade Act, 19 U.S.C. 3901-3913',
            'Kimberley Process Certification Scheme',
            'UCC 2-403 (good faith purchaser)',
          ],
        },
        precious_metals: {
          description_override: 'Verify LBMA Good Delivery status for gold/silver bars. Collect assay certificates, refiner certificates of origin, and chain of custody from refiner to current holder. For coins: verify mint of origin, grading (PCGS/NGC if numismatic), and dealer provenance. Check for conflict mineral compliance (Dodd-Frank Section 1502 if applicable).',
          additional_documents: ['lbma_good_delivery_certificate', 'assay_certificate', 'refiner_certificate', 'mint_certificate_of_authenticity'],
          regulatory_citations_override: [
            'Dodd-Frank Act Section 1502 (Conflict Minerals)',
            'LBMA Responsible Gold Guidance',
            'UCC 2-403',
          ],
        },
        real_estate: {
          description_override: 'Order full title search through a licensed title company. Review deed history, mortgage liens, tax liens, easements, restrictive covenants, and pending litigation. Obtain title commitment for owner\'s and lender\'s title insurance. Verify zoning compliance and permitted uses. Check for environmental contamination history (Phase I ESA if indicated).',
          additional_documents: ['title_search_report', 'title_commitment', 'deed_copies', 'survey', 'zoning_certificate', 'phase_i_environmental_report'],
          estimated_duration_override: '2-4 weeks',
          regulatory_citations_override: [
            'Real Property Law (state-specific)',
            'CERCLA 42 U.S.C. 9601 et seq. (environmental liability)',
            'Title Insurance Regulations (state-specific)',
          ],
        },
        mineral_rights: {
          description_override: 'Engage a landman to perform title examination from county courthouse records. Trace mineral ownership from original patent (federal or state) through all conveyances, reservations, and severances. Identify split estate issues (surface vs. mineral ownership). Check for pooling/unitization orders, overriding royalty interests, and non-participating royalty interests. Verify current operator and lease status.',
          additional_documents: ['mineral_title_opinion', 'chain_of_title_abstract', 'current_lease_agreement', 'division_order', 'pooling_unitization_orders'],
          estimated_duration_override: '3-6 weeks',
          estimated_cost_override: '$5,000-$25,000 (landman fees)',
          regulatory_citations_override: [
            'State mineral rights statutes (varies by state)',
            'BLM 43 CFR Part 3100 (federal mineral leasing)',
            'Dormant Mineral Acts (state-specific)',
          ],
        },
      },
      subtasks: [
        {
          id: 'I-2.2.1',
          title: 'Request Chain of Custody Documents',
          description: 'Request all available documentation from the holder: purchase receipts, inheritance documents, auction records, dealer certificates, prior appraisals, and any transfer records.',
          task_type: 'action',
          assigned_role: 'chief_revenue_officer',
          estimated_duration: '1-5 days',
        },
        {
          id: 'I-2.2.2',
          title: 'Verify Each Link in the Chain',
          description: 'Contact prior owners, dealers, or auction houses to verify each transfer. Cross-reference dates, values, and descriptions. Flag unverifiable links.',
          task_type: 'action',
          assigned_role: 'chief_revenue_officer',
          estimated_duration: '5-14 days',
        },
        {
          id: 'I-2.2.3',
          title: 'Lien & Encumbrance Search',
          description: 'Search UCC filings, judgment liens, and tax liens against the holder and the asset. For real estate: full title search. For mineral rights: check for overriding royalty interests and operator liens.',
          task_type: 'action',
          assigned_role: 'compliance_officer',
          estimated_duration: '3-7 days',
        },
        {
          id: 'I-2.2.4',
          title: 'Title Opinion / Provenance Summary',
          description: 'Prepare or obtain a formal title opinion (real estate/minerals) or provenance summary memo (gemstones/metals) documenting the complete chain and any noted gaps or risks.',
          task_type: 'review',
          assigned_role: 'compliance_officer',
          estimated_duration: '2-5 days',
        },
      ],
    },
    {
      id: 'I-2.3',
      step_number: '2.3',
      title: 'Existing Certification & Documentation Review',
      description: 'Collect and verify all existing certifications, lab reports, appraisals, surveys, inspections, and third-party assessments. Determine if re-certification is needed.',
      task_type: 'review',
      assigned_role: 'chief_revenue_officer',
      estimated_duration: '3-10 days',
      regulatory_basis: 'Existing certifications establish baseline asset characteristics. Stale or unverified reports cannot support an offering valuation. Independent verification of prior assessments is required for investor protection.',
      regulatory_citations: [],
      regulation_types: ['none'],
      required_documents: [],
      output_documents: ['certification_review_memo'],
      asset_classes: 'all',
      variations: {
        gemstones: {
          description_override: 'Collect prior GIA/SSEF/Gubelin reports. Verify report numbers against lab databases (GIA Report Check). Assess if re-certification is needed based on report age (>5 years), scope (missing origin determination), or discrepancies with visual inspection. Check for treatments not disclosed in prior reports.',
          additional_documents: ['gia_report', 'ssef_report', 'gubelin_report'],
        },
        precious_metals: {
          description_override: 'Collect assay certificates, refiner certificates, LBMA Good Delivery certificates, and PCGS/NGC grading reports (for coins). Verify serial numbers against refiner records. Check for weight and fineness consistency. Determine if independent assay is required.',
          additional_documents: ['assay_certificate', 'pcgs_ngc_grade_report', 'lbma_certificate'],
        },
        real_estate: {
          description_override: 'Collect prior appraisals, property condition reports, environmental assessments (Phase I/II ESA), engineering reports, rent rolls, operating statements (3 years), tenant estoppels, and surveys. Review zoning compliance, building permits, and certificate of occupancy. Assess if updated appraisal or inspection is required.',
          additional_documents: ['prior_appraisal', 'phase_i_esa', 'property_condition_report', 'rent_roll', 'operating_statements', 'survey_plat', 'certificate_of_occupancy'],
        },
        mineral_rights: {
          description_override: 'Collect reserve reports (SEC-compliant if public operator), production history (state oil & gas commission records), geological surveys, well logs, and existing engineering assessments. Verify operator reporting accuracy against state production data. Assess if new reserve report or geological assessment is needed.',
          additional_documents: ['reserve_report', 'production_history', 'geological_survey', 'well_logs', 'operator_lease_statements'],
        },
      },
      subtasks: [
        {
          id: 'I-2.3.1',
          title: 'Collect All Existing Reports',
          description: 'Request all available third-party reports, certifications, and assessments from the holder.',
          task_type: 'upload',
          assigned_role: 'chief_revenue_officer',
          estimated_duration: '3-7 days',
        },
        {
          id: 'I-2.3.2',
          title: 'Verify Report Authenticity',
          description: 'Contact issuing laboratories/firms to verify report numbers, dates, and contents. Flag any discrepancies.',
          task_type: 'action',
          assigned_role: 'chief_revenue_officer',
          estimated_duration: '2-5 days',
        },
        {
          id: 'I-2.3.3',
          title: 'Re-Certification Assessment',
          description: 'Determine if existing certifications are sufficient for the offering or if new/updated certifications are required. Document decision with rationale.',
          task_type: 'review',
          assigned_role: 'chief_revenue_officer',
          estimated_duration: '1-2 days',
        },
      ],
    },
    {
      id: 'I-2.4',
      step_number: '2.4',
      title: 'Preliminary Valuation Estimate',
      description: 'Desktop valuation using comparable sales, price indices, and prior appraisals. Sets expectations for the offering range — this is NOT the offering value and must be clearly distinguished from the formal USPAP appraisal process.',
      task_type: 'action',
      assigned_role: 'chief_revenue_officer',
      estimated_duration: '3-7 days',
      regulatory_basis: 'Preliminary valuation is required for internal deal committee review and to establish whether the asset justifies the compliance expenditure. Must be clearly labeled as an estimate, not a formal appraisal.',
      regulatory_citations: [],
      regulation_types: ['none'],
      required_documents: [],
      output_documents: ['preliminary_valuation_memo'],
      asset_classes: 'all',
      variations: {
        gemstones: {
          description_override: 'Desktop valuation using comparable auction results (Christie\'s, Sotheby\'s records), dealer price lists (Rapaport for diamonds, GemVal for colored stones), and prior appraisals. Consider 4Cs, origin premium, treatment status, and current market conditions.',
        },
        precious_metals: {
          description_override: 'Valuation based on spot price (LBMA Gold Price, COMEX), premium over spot for physical form (bars vs. coins), numismatic premium (if applicable), and weight/fineness verification. Consider current market contango/backwardation.',
        },
        real_estate: {
          description_override: 'Desktop valuation using comparable sales approach, income approach (cap rate analysis based on rent roll and operating statements), and replacement cost approach. Use CoStar, Real Capital Analytics, or local MLS comparables. Consider market conditions, submarket trends, and property condition.',
          estimated_duration_override: '5-10 days',
        },
        mineral_rights: {
          description_override: 'Valuation based on production income approach (discounted cash flow of royalty income), comparable sales of mineral interests (per acre, per BOE), and reserve-based valuation if reserve report available. Consider commodity price forecasts, decline curves, and remaining reserve life.',
          estimated_duration_override: '5-14 days',
        },
      },
    },
    {
      id: 'I-2.5',
      step_number: '2.5',
      title: 'Engagement Agreement Execution',
      description: 'Execute formal engagement agreement with asset holder. Define scope of services, fee structure (setup fee, success fee, admin fee), timeline expectations, mutual obligations, representations and warranties regarding asset title and encumbrances, and termination provisions.',
      task_type: 'action',
      assigned_role: 'ceo',
      estimated_duration: '3-10 days',
      regulatory_basis: 'A written engagement agreement establishes the legal relationship, defines scope of services, allocates risk, and provides contractual basis for fee collection. Required for professional liability insurance coverage.',
      regulatory_citations: [],
      regulation_types: ['none'],
      required_documents: [],
      output_documents: ['engagement_agreement'],
      asset_classes: 'all',
      subtasks: [
        {
          id: 'I-2.5.1',
          title: 'Draft Engagement Agreement',
          description: 'Draft engagement agreement using PleoChrome template. Customize fee structure, scope, and timeline based on asset class and complexity.',
          task_type: 'action',
          assigned_role: 'ceo',
          estimated_duration: '1-2 days',
        },
        {
          id: 'I-2.5.2',
          title: 'Legal Review',
          description: 'Securities counsel reviews engagement agreement for compliance with applicable regulations and adequacy of representations and warranties.',
          task_type: 'review',
          assigned_role: 'securities_counsel',
          estimated_duration: '2-5 days',
        },
        {
          id: 'I-2.5.3',
          title: 'Negotiate & Execute',
          description: 'Share draft with holder. Negotiate any requested modifications. Obtain final signatures from both parties. Store executed copy in document vault.',
          task_type: 'action',
          assigned_role: 'ceo',
          estimated_duration: '3-7 days',
          required_documents: ['engagement_agreement'],
          is_blocking: true,
        },
      ],
    },
    {
      id: 'I-2.6',
      step_number: '2.6',
      title: 'Internal Deal Committee Review — Intake',
      description: 'Full founders review of the complete intake package. Final Go/No-Go decision to commit resources for certification, appraisal, and legal structuring. This decision triggers significant capital expenditure.',
      task_type: 'approval',
      assigned_role: 'ceo',
      estimated_duration: '1-3 days',
      depends_on: ['2.1', '2.2', '2.3', '2.4', '2.5'],
      regulatory_basis: 'Internal deal committee review with documented rationale is a SOC 2 processing integrity control and securities compliance best practice. Protects against liability for investment decisions.',
      regulatory_citations: [],
      regulation_types: ['soc2'],
      required_documents: [],
      output_documents: ['deal_committee_memo'],
      required_approvals: {
        internal: ['ceo', 'cto', 'chief_revenue_officer'],
      },
      asset_classes: 'all',
      is_gate: true,
      gate_id: 'G-INTAKE',
    },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// STAGE 3: ASSET MATURITY — Certification, Appraisal, Custody, Insurance
// Maps to: phase_2_certification
// Duration: 6-16 weeks
// ═══════════════════════════════════════════════════════════════════════════════

export const STAGE_3_ASSET_MATURITY: WorkflowStage = {
  stage: 'asset_maturity',
  stage_number: 3,
  title: 'Asset Maturity',
  subtitle: 'Certification, Appraisal, Custody & Insurance',
  description: 'Independently verify every claim about the asset. Obtain laboratory certification, USPAP-compliant appraisals, institutional custody, comprehensive insurance, and complete all physical due diligence required to support the offering valuation.',
  maps_to_phase: 'phase_2_certification',
  estimated_total_duration: '6-16 weeks',
  tasks: [
    {
      id: 'AM-3.1',
      step_number: '3.1',
      title: 'Independent Laboratory Certification',
      description: 'Submit asset for independent third-party certification by a globally recognized laboratory or authority. The certification establishes the physical characteristics, authenticity, and quality grade of the asset.',
      task_type: 'action',
      assigned_role: 'chief_revenue_officer',
      estimated_duration: '2-6 weeks',
      estimated_cost: '$5,000-$25,000',
      regulatory_basis: 'Independent certification from a recognized authority is essential for establishing the physical characteristics and authenticity of the asset. Required for investor protection — the offering valuation must be grounded in verified, independently assessed asset characteristics.',
      regulatory_citations: [],
      regulation_types: ['none'],
      required_documents: [],
      output_documents: ['lab_certification_report'],
      asset_classes: 'all',
      variations: {
        gemstones: {
          description_override: 'Submit stone(s) to GIA (Gemological Institute of America) laboratory for comprehensive grading: species identification, color grade, clarity, cut (if applicable), carat weight, origin determination, and treatment disclosure. For high-value colored stones ($500K+), obtain supplemental origin report from SSEF (Switzerland) or Gubelin (Switzerland).',
          additional_documents: ['gia_report', 'ssef_report', 'gubelin_report'],
          estimated_cost_override: '$5,000-$20,000 (GIA) + $0-$5,000 (SSEF/Gubelin)',
          estimated_duration_override: '2-4 weeks (GIA) + 2 weeks (supplemental)',
        },
        precious_metals: {
          description_override: 'For bars: independent assay by an LBMA-approved assayer to verify weight and fineness. For LBMA Good Delivery bars: verify serial number and bar list status. For coins: submit to PCGS or NGC for grading and encapsulation. For all: XRF or fire assay testing to confirm metal content.',
          additional_documents: ['assay_certificate', 'lbma_verification', 'pcgs_ngc_grade_certificate'],
          estimated_cost_override: '$500-$5,000',
          estimated_duration_override: '1-3 weeks',
        },
        real_estate: {
          description_override: 'Commission property condition assessment (PCA) per ASTM E2018 standard. Order Phase I Environmental Site Assessment (ESA) per ASTM E1527. If Phase I identifies RECs (Recognized Environmental Conditions): order Phase II ESA with sampling. Commission building systems inspection (HVAC, electrical, plumbing, structural). Order ALTA/NSPS survey.',
          additional_documents: ['property_condition_assessment', 'phase_i_esa', 'phase_ii_esa', 'building_inspection_report', 'alta_survey'],
          estimated_cost_override: '$15,000-$75,000',
          estimated_duration_override: '3-6 weeks',
          regulatory_citations_override: [
            'CERCLA 42 U.S.C. 9601 (environmental liability)',
            'ASTM E1527-21 (Phase I ESA)',
            'ASTM E2018-15 (Property Condition Assessment)',
          ],
        },
        mineral_rights: {
          description_override: 'Commission SEC-compliant reserve report from a qualified petroleum engineer (SPE/PRMS classification) or qualified person (NI 43-101 for mining). Reserves must be classified as Proved (1P), Proved + Probable (2P), or Proved + Probable + Possible (3P). For producing properties: obtain production verification from state oil & gas commission or BLM records.',
          additional_documents: ['reserve_report', 'production_verification', 'geological_assessment', 'decline_curve_analysis'],
          estimated_cost_override: '$25,000-$100,000',
          estimated_duration_override: '4-8 weeks',
          regulatory_citations_override: [
            'SEC Regulation S-K Item 1200-1205 (reserve estimation standards)',
            'SPE/PRMS Reserve Classification',
            'NI 43-101 (mining, if Canadian cross-listing)',
          ],
        },
      },
      subtasks: [
        {
          id: 'AM-3.1.1',
          title: 'Select Certification Authority',
          description: 'Identify the appropriate laboratory or authority based on asset class, value, and market expectations. Verify lab accreditation and independence.',
          task_type: 'action',
          assigned_role: 'chief_revenue_officer',
          estimated_duration: '1-3 days',
        },
        {
          id: 'AM-3.1.2',
          title: 'Prepare & Ship Asset for Examination',
          description: 'Package asset for secure transport to laboratory. Arrange insured shipping (full declared value). Obtain tracking and proof of delivery. For real estate/minerals: coordinate site access for inspectors.',
          task_type: 'action',
          assigned_role: 'chief_revenue_officer',
          estimated_duration: '2-5 days',
        },
        {
          id: 'AM-3.1.3',
          title: 'Laboratory Examination Period',
          description: 'Asset is under examination by the certification authority. Monitor progress and respond to any queries from the lab.',
          task_type: 'action',
          assigned_role: 'chief_revenue_officer',
          estimated_duration: '1-6 weeks',
        },
        {
          id: 'AM-3.1.4',
          title: 'Receive & Verify Certification',
          description: 'Receive certification report. Verify completeness, accuracy of asset identification, and consistency with prior reports. Flag any discrepancies or unexpected findings.',
          task_type: 'review',
          assigned_role: 'chief_revenue_officer',
          estimated_duration: '1-2 days',
          is_blocking: true,
        },
      ],
    },
    {
      id: 'AM-3.2',
      step_number: '3.2',
      title: 'Appraiser Panel Selection & Vetting',
      description: 'Identify, vet, and engage three independent USPAP-compliant appraisers. Verify credentials, insurance, independence (no conflicts of interest), and relevant specialization.',
      task_type: 'action',
      assigned_role: 'chief_revenue_officer',
      estimated_duration: '1-3 weeks',
      estimated_cost: '$1,500 (vetting)',
      regulatory_basis: 'USPAP (Uniform Standards of Professional Appraisal Practice) is the recognized ethical and performance standard for professional appraisers in the United States. Using three independent appraisers exceeds industry standard (typically 1-2) and provides institutional-grade valuation confidence. USPAP Ethics Rule prohibits contingent compensation based on appraised value.',
      regulatory_citations: [
        'USPAP Standards Rules 7-8 (Personal Property Appraisal)',
        'USPAP Ethics Rule (fee prohibition)',
        'FIRREA (Financial Institutions Reform, Recovery, and Enforcement Act) — for real estate',
      ],
      regulation_types: ['uspap'],
      source_urls: [
        'https://www.appraisalfoundation.org/imis/TAF/Standards/Appraisal_Standards/Uniform_Standards_of_Professional_Appraisal_Practice/TAF/USPAP.aspx',
      ],
      required_documents: [],
      output_documents: ['appraiser_engagement_letters'],
      asset_classes: 'all',
      variations: {
        gemstones: {
          description_override: 'Identify and vet three independent USPAP-compliant gemstone appraisers. Required credentials: CGA (Certified Gemologist Appraiser) from AGS or MGA (Master Gemologist Appraiser) from ASA. Verify E&O insurance, gemological laboratory access, and no business relationship with the asset holder or PleoChrome.',
        },
        precious_metals: {
          description_override: 'Identify and vet three independent USPAP-compliant precious metals appraisers. Required credentials: ASA-accredited in personal property (gems/jewelry/precious metals) or equivalent. For numismatic coins: require PNG (Professional Numismatists Guild) membership or equivalent expertise.',
        },
        real_estate: {
          description_override: 'Identify and vet three independent MAI-designated appraisers (Member, Appraisal Institute) with specialization in the relevant property type. Must be state-certified general appraiser. Verify FIRREA compliance for any financing-related appraisals. No business relationship with borrower, owner, or PleoChrome.',
          regulatory_citations_override: [
            'USPAP Standards Rules 1-2 (Real Property Appraisal)',
            'FIRREA Title XI (Appraisal Requirements)',
            'OCC 12 CFR Part 34 (Appraisal Standards)',
          ],
        },
        mineral_rights: {
          description_override: 'Identify and vet three independent qualified petroleum engineers (for oil/gas) or mining engineers with valuation credentials. Required credentials: PE license, SPE member, and experience with SEC reserve reporting. For mining: Qualified Person under NI 43-101 or equivalent.',
        },
      },
      subtasks: [
        {
          id: 'AM-3.2.1',
          title: 'Identify Candidate Appraisers',
          description: 'Search professional directories (ASA, AAA, Appraisal Institute), industry referrals, and vetted partner network for qualified appraisers.',
          task_type: 'action',
          assigned_role: 'chief_revenue_officer',
          estimated_duration: '3-5 days',
        },
        {
          id: 'AM-3.2.2',
          title: 'Verify Credentials & Independence',
          description: 'Confirm each candidate\'s credentials, E&O insurance coverage ($1M+ recommended), USPAP continuing education compliance, and absence of conflicts of interest.',
          task_type: 'action',
          assigned_role: 'compliance_officer',
          estimated_duration: '3-5 days',
        },
        {
          id: 'AM-3.2.3',
          title: 'Execute Engagement Letters',
          description: 'Negotiate terms and execute engagement letters with all three appraisers. Define scope, methodology, timeline, and fee structure (fixed fee only — no percentage-based fees per USPAP).',
          task_type: 'action',
          assigned_role: 'chief_revenue_officer',
          estimated_duration: '3-7 days',
          required_documents: ['appraiser_engagement_letters'],
        },
      ],
    },
    {
      id: 'AM-3.3',
      step_number: '3.3',
      title: 'Sequential Three-Appraisal Process',
      description: 'Execute the PleoChrome three-appraisal methodology: each appraiser works independently with sealed prior values. Asset moves sequentially between appraisers. All appraisals must be USPAP-compliant. This methodology prevents anchoring bias and provides institutional-grade valuation confidence.',
      task_type: 'action',
      assigned_role: 'chief_revenue_officer',
      estimated_duration: '3-8 weeks',
      estimated_cost: '$9,000-$75,000 (varies by asset class)',
      regulatory_basis: 'The sequential sealed-value methodology prevents anchoring bias and ensures independent valuation. USPAP Ethics Rule prohibits fees based on a percentage of appraised value. This three-appraisal approach is a competitive differentiator.',
      regulatory_citations: [
        'USPAP Standards Rules 7-8 (Personal Property)',
        'USPAP Standards Rules 1-2 (Real Property)',
        'USPAP Ethics Rule (contingent compensation prohibition)',
      ],
      regulation_types: ['uspap'],
      required_documents: ['lab_certification_report'],
      output_documents: ['appraisal_report_1', 'appraisal_report_2', 'appraisal_report_3'],
      depends_on: ['3.1', '3.2'],
      asset_classes: 'all',
      variations: {
        gemstones: {
          estimated_cost_override: '$9,000-$18,000 ($3K-$6K per appraisal)',
        },
        precious_metals: {
          estimated_cost_override: '$4,500-$12,000 ($1.5K-$4K per appraisal)',
        },
        real_estate: {
          estimated_cost_override: '$15,000-$75,000 ($5K-$25K per appraisal)',
          estimated_duration_override: '4-8 weeks',
        },
        mineral_rights: {
          estimated_cost_override: '$30,000-$100,000 ($10K-$33K per engineering assessment)',
          estimated_duration_override: '6-12 weeks',
        },
      },
      subtasks: [
        {
          id: 'AM-3.3.1',
          title: 'Appraiser 1 — First Independent Appraisal',
          description: 'Transport asset to Appraiser 1 (or arrange site access). Appraiser conducts independent examination and produces USPAP-compliant appraisal report. Value is sealed.',
          task_type: 'action',
          assigned_role: 'chief_revenue_officer',
          estimated_duration: '1-3 weeks',
        },
        {
          id: 'AM-3.3.2',
          title: 'Appraiser 2 — Second Independent Appraisal',
          description: 'Transport asset to Appraiser 2. Appraiser 1\'s value is sealed — Appraiser 2 has no knowledge of it. Appraiser conducts independent examination and produces USPAP-compliant appraisal report.',
          task_type: 'action',
          assigned_role: 'chief_revenue_officer',
          estimated_duration: '1-3 weeks',
        },
        {
          id: 'AM-3.3.3',
          title: 'Appraiser 3 — Third Independent Appraisal',
          description: 'Transport asset to Appraiser 3. Both prior values are sealed. Appraiser conducts independent examination and produces USPAP-compliant appraisal report.',
          task_type: 'action',
          assigned_role: 'chief_revenue_officer',
          estimated_duration: '1-3 weeks',
        },
        {
          id: 'AM-3.3.4',
          title: 'Collect & Secure All Appraisal Reports',
          description: 'Receive all three sealed appraisal reports. Store originals in document vault. Verify each report is complete, signed, and USPAP-compliant.',
          task_type: 'upload',
          assigned_role: 'chief_revenue_officer',
          estimated_duration: '1-3 days',
          required_documents: ['appraisal_report_1', 'appraisal_report_2', 'appraisal_report_3'],
          is_blocking: true,
        },
      ],
    },
    {
      id: 'AM-3.4',
      step_number: '3.4',
      title: 'Variance Analysis & Offering Value Determination',
      description: 'Unseal and compare all three appraisals. If variance exceeds 15-20%, trigger review and potential fourth appraisal. Offering value = average of the two lowest appraisals. This conservative methodology protects investors.',
      task_type: 'review',
      assigned_role: 'ceo',
      estimated_duration: '2-5 days',
      depends_on: ['3.3'],
      regulatory_basis: 'Variance analysis is a statistical due diligence control. Using the average of the two lowest appraisals (not the highest) demonstrates conservative valuation methodology required for investor protection and regulatory defensibility. Material overvaluation creates Securities Act Section 12(a)(2) rescission liability.',
      regulatory_citations: [
        'Securities Act Section 12(a)(2), 15 U.S.C. 77l (material misrepresentation)',
      ],
      regulation_types: ['sec'],
      required_documents: ['appraisal_report_1', 'appraisal_report_2', 'appraisal_report_3'],
      output_documents: ['variance_analysis_memo', 'offering_value_determination'],
      required_approvals: {
        internal: ['ceo', 'chief_revenue_officer'],
      },
      asset_classes: 'all',
      is_gate: true,
      gate_id: 'G-VALUATION',
    },
    {
      id: 'AM-3.5',
      step_number: '3.5',
      title: 'Institutional Custody Transfer',
      description: 'Select and engage institutional custodian. Arrange insured transport. Execute custody agreement with segregated storage. Custodian must provide API access for automated Proof of Reserve verification.',
      task_type: 'action',
      assigned_role: 'cto',
      estimated_duration: '1-3 weeks',
      estimated_cost: '$50,000-$150,000/year (custody + insurance)',
      depends_on: ['3.4'],
      regulatory_basis: 'Institutional custody is required for investor protection and regulatory compliance. Segregated storage ensures the asset is not commingled with other assets. Third-party custody eliminates self-dealing risk.',
      regulatory_citations: [
        'Investment Advisers Act Rule 206(4)-2 (Custody Rule) — applies if PleoChrome is ever deemed an investment adviser',
      ],
      regulation_types: ['sec'],
      required_documents: [],
      output_documents: ['custody_agreement', 'custody_receipt', 'transport_manifest', 'insurance_certificate'],
      asset_classes: 'all',
      variations: {
        gemstones: {
          description_override: 'Select institutional vault (Brink\'s Diamond & Jewelry, Malca-Amit, Loomis, or equivalent). Arrange insured transport by bonded courier. Execute custody agreement with segregated storage in individually identified, tamper-evident containers. Vault must provide API access for Chainlink Proof of Reserve.',
          estimated_cost_override: '$50,000-$100,000/year',
        },
        precious_metals: {
          description_override: 'Select institutional vault (Brink\'s, Loomis, Delaware Depository, COMEX-approved, or LBMA-approved). For LBMA Good Delivery bars: maintain chain of integrity (bar must remain in LBMA-approved vault to retain Good Delivery status). Execute allocated storage agreement with individual bar/coin identification. API access for PoR verification required.',
          estimated_cost_override: '$10,000-$50,000/year',
          additional_documents: ['allocated_storage_agreement', 'bar_list_inventory'],
        },
        real_estate: {
          description_override: 'For real estate: "custody" means recorded deed transfer to the SPV and engagement of a licensed property manager. Record deed with county recorder\'s office. Engage institutional property manager (CBRE, JLL, Cushman & Wakefield, or regional equivalent). Execute property management agreement. Set up escrow for rents, taxes, and insurance.',
          additional_documents: ['recorded_deed', 'property_management_agreement', 'escrow_agreement'],
          estimated_cost_override: '$5,000-$25,000/year (property management) + recording fees',
        },
        mineral_rights: {
          description_override: 'For mineral rights: "custody" means recorded conveyance to the SPV and operator notification. Record mineral deed or assignment with county recorder\'s office. File division order change with the operator. Engage a revenue tracking service to monitor royalty payments. For federal minerals: file assignment with BLM.',
          additional_documents: ['recorded_mineral_deed', 'division_order', 'operator_assignment_notification', 'blm_assignment'],
          estimated_cost_override: '$2,000-$10,000 (recording + legal) + ongoing monitoring',
        },
      },
      subtasks: [
        {
          id: 'AM-3.5.1',
          title: 'Select Custodian / Property Manager',
          description: 'Evaluate custodian options based on asset class, geographic location, insurance capacity, API capabilities, and fee structure. Obtain proposals.',
          task_type: 'action',
          assigned_role: 'cto',
          estimated_duration: '3-7 days',
        },
        {
          id: 'AM-3.5.2',
          title: 'Negotiate & Execute Custody Agreement',
          description: 'Negotiate custody terms including: segregation requirements, insurance coverage, access protocols, reporting frequency, API access, fee structure, and termination provisions. Legal review before execution.',
          task_type: 'action',
          assigned_role: 'ceo',
          estimated_duration: '5-10 days',
          required_documents: ['custody_agreement'],
        },
        {
          id: 'AM-3.5.3',
          title: 'Arrange Insured Transport',
          description: 'Coordinate asset transport from current location to institutional custodian. Full declared-value insurance. Bonded courier for movable assets. For real estate/minerals: execute conveyance documents.',
          task_type: 'action',
          assigned_role: 'chief_revenue_officer',
          estimated_duration: '3-7 days',
        },
        {
          id: 'AM-3.5.4',
          title: 'Confirm Receipt & Custody',
          description: 'Confirm custodian has received and secured the asset (or deed is recorded). Obtain custody receipt with asset identification. Verify segregated storage. Test API access.',
          task_type: 'action',
          assigned_role: 'cto',
          estimated_duration: '1-3 days',
          required_documents: ['custody_receipt'],
          is_blocking: true,
        },
      ],
    },
    {
      id: 'AM-3.6',
      step_number: '3.6',
      title: 'Insurance Verification',
      description: 'Verify that all insurance coverage is adequate, current, and properly structured. Coverage must equal or exceed the offering value. SPV must be named as additional insured or loss payee.',
      task_type: 'review',
      assigned_role: 'compliance_officer',
      estimated_duration: '3-7 days',
      depends_on: ['3.4', '3.5'],
      regulatory_basis: 'Insurance is required to protect investor capital in the event of loss, theft, damage, or liability. Adequate coverage is a PPM disclosure requirement and investor expectation. Gap in coverage creates material disclosure obligation.',
      regulatory_citations: [],
      regulation_types: ['none'],
      required_documents: ['insurance_certificate'],
      output_documents: ['insurance_verification_memo'],
      asset_classes: 'all',
      variations: {
        gemstones: {
          description_override: 'Verify vault specie insurance covers full appraised value. Confirm transit insurance for the transport chain. Verify PleoChrome SPV is named as additional insured. Confirm coverage includes mysterious disappearance, employee dishonesty, and natural disaster.',
        },
        precious_metals: {
          description_override: 'Verify vault/depository insurance covers full market value of allocated metals. Confirm coverage survives metal movement (e.g., for periodic assay). For LBMA bars: verify LBMA-approved vault carries London market insurance.',
        },
        real_estate: {
          description_override: 'Verify property insurance (all-risk/special form), general liability, flood insurance (if in FEMA flood zone), earthquake (if applicable), umbrella/excess liability, and environmental liability insurance. Confirm SPV is named insured. Verify coverage meets lender requirements if leveraged.',
          additional_documents: ['property_insurance_policy', 'liability_insurance_certificate', 'flood_insurance_certificate'],
        },
        mineral_rights: {
          description_override: 'Verify operator maintains adequate insurance: general liability, pollution/environmental liability, worker\'s compensation, and umbrella coverage. For royalty interests: confirm title insurance covers mineral interest. If operating: verify all well-specific insurance.',
          additional_documents: ['operator_insurance_certificate', 'mineral_title_insurance'],
        },
      },
    },
    {
      id: 'AM-3.7',
      step_number: '3.7',
      title: 'Proof of Reserve Configuration',
      description: 'Configure automated Proof of Reserve (PoR) verification system. For blockchain-integrated offerings: Chainlink PoR oracle feed. For traditional: automated custodian reporting API integration.',
      task_type: 'automated',
      assigned_role: 'cto',
      estimated_duration: '2-4 weeks',
      estimated_cost: '$5,000-$15,000',
      depends_on: ['3.5'],
      regulatory_basis: 'Proof of Reserve provides independent verification that the physical asset backing the securities actually exists in custody. This investor protection mechanism enables real-time verification without trusting the issuer alone.',
      regulatory_citations: [],
      regulation_types: ['none'],
      source_urls: ['https://docs.chain.link/data-feeds/proof-of-reserve'],
      required_documents: [],
      output_documents: ['por_configuration_document'],
      asset_classes: 'all',
    },
    {
      id: 'AM-3.8',
      step_number: '3.8',
      title: 'Bad Actor Background Checks (Rule 506(d))',
      description: 'Comprehensive Rule 506(d) disqualification screening on ALL covered persons: directors, officers, >20% beneficial owners, promoters, compensated solicitors, and their directors/officers/general partners.',
      task_type: 'action',
      assigned_role: 'compliance_officer',
      estimated_duration: '1-3 weeks',
      depends_on: [],
      regulatory_basis: 'Rule 506(d) disqualifies Regulation D offerings if any "covered person" has specified bad acts within lookback periods. Criminal convictions (5yr issuer, 10yr others), court injunctions/restraining orders (5yr), final regulatory orders (10yr), SEC disciplinary orders (for duration), SRO bars (for duration), SEC stop orders (5yr). A single disqualifying event kills the entire offering.',
      regulatory_citations: [
        '17 CFR 230.506(d) (Bad Actor Disqualification)',
        '17 CFR 230.506(e) (Disclosure of Pre-Existing Bad Acts)',
      ],
      regulation_types: ['sec'],
      source_urls: [
        'https://www.sec.gov/resources-small-businesses/small-business-compliance-guides/disqualification-felons-other-bad-actors-rule-506-offerings-related-disclosure-requirements',
      ],
      required_documents: [],
      output_documents: ['bad_actor_screening_report'],
      required_approvals: {
        internal: ['compliance_officer'],
        external: ['securities_counsel'],
      },
      asset_classes: 'all',
      subtasks: [
        {
          id: 'AM-3.8.1',
          title: 'Identify All Covered Persons',
          description: 'List every covered person under Rule 506(d): (i) the issuer/SPV, (ii) any predecessor of the issuer, (iii) any affiliated issuer, (iv) any director, executive officer, or other officer of the issuer participating in the offering, (v) any >20% beneficial owner, (vi) any promoter, (vii) any person compensated for investor solicitation, (viii) any general partner or managing member of any such solicitor.',
          task_type: 'action',
          assigned_role: 'compliance_officer',
          estimated_duration: '1-2 days',
        },
        {
          id: 'AM-3.8.2',
          title: 'Run Background Checks',
          description: 'For each covered person: criminal records search (federal + state), SEC enforcement actions, FINRA BrokerCheck, state securities regulator actions, court injunctions, and SRO disciplinary history.',
          task_type: 'automated',
          assigned_role: 'compliance_officer',
          estimated_duration: '5-10 days',
        },
        {
          id: 'AM-3.8.3',
          title: 'Securities Counsel Review',
          description: 'Securities counsel reviews all background check results. Determines if any findings trigger disqualification under Rule 506(d) or require disclosure under Rule 506(e).',
          task_type: 'review',
          assigned_role: 'securities_counsel',
          estimated_duration: '3-5 days',
          is_blocking: true,
        },
      ],
    },
    {
      id: 'AM-3.9',
      step_number: '3.9',
      title: 'Asset Maturity Gate',
      description: 'All certifications complete. Three appraisals received and analyzed. Offering value locked. Asset in institutional custody. Insurance verified. Bad actor screening clear. PoR configured. Asset is fully mature and ready for securities structuring.',
      task_type: 'approval',
      assigned_role: 'ceo',
      estimated_duration: '1-2 days',
      depends_on: ['3.1', '3.3', '3.4', '3.5', '3.6', '3.7', '3.8'],
      regulatory_basis: 'Gate-based progression ensures no asset advances to securities structuring without satisfying all physical due diligence prerequisites. Prevents premature capital commitment.',
      regulatory_citations: [],
      regulation_types: ['soc2'],
      required_documents: [],
      output_documents: [],
      required_approvals: {
        internal: ['ceo', 'compliance_officer'],
        external: ['securities_counsel'],
      },
      asset_classes: 'all',
      is_gate: true,
      gate_id: 'G-MATURITY',
    },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// STAGE 4: SECURITY — SEC Registration, Legal Structuring, Issuer Formation
// Maps to: phase_3_custody (securities structuring)
// Duration: 4-12 weeks
// ═══════════════════════════════════════════════════════════════════════════════

export const STAGE_4_SECURITY: WorkflowStage = {
  stage: 'security',
  stage_number: 4,
  title: 'Security',
  subtitle: 'SEC Registration, Legal Structuring & Issuer Formation',
  description: 'Form the SPV (issuer entity), select the appropriate SEC exemption, engage registered transfer agent and broker-dealer, structure the offering terms, and prepare all regulatory filings.',
  maps_to_phase: 'phase_3_custody',
  estimated_total_duration: '4-12 weeks',
  tasks: [
    {
      id: 'S-4.1',
      step_number: '4.1',
      title: 'SPV Formation',
      description: 'Form dedicated Special Purpose Vehicle (issuer entity) for this specific asset. Each asset gets its own SPV to provide liability isolation from PleoChrome Holdings and from other assets.',
      task_type: 'action',
      assigned_role: 'securities_counsel',
      estimated_duration: '1-2 weeks',
      estimated_cost: '$8,000-$15,000',
      regulatory_basis: 'SPV formation is required to isolate asset risk from the parent company and from other assets. Series LLC structure under Wyoming or Delaware law allows multiple series with separate liability without forming separate entities. The SPV is the "issuer" for securities law purposes.',
      regulatory_citations: [
        'Wyoming LLC Act 17-29-211 (Series LLC)',
        'Delaware LLC Act 6 Del. C. 18-215 (Series LLC)',
      ],
      regulation_types: ['sec'],
      source_urls: [
        'https://sos.wyo.gov/Business/docs/LLC_General_Info.pdf',
      ],
      required_documents: [],
      output_documents: ['articles_of_organization', 'operating_agreement', 'ein_letter', 'bank_account_confirmation'],
      asset_classes: 'all',
      subtasks: [
        {
          id: 'S-4.1.1',
          title: 'Select Jurisdiction & Entity Type',
          description: 'Determine optimal jurisdiction (Wyoming, Delaware, or asset-state) and entity type (Series LLC, standalone LLC, or LP). Consider: asset location, investor expectations, tax treatment, and series liability protection.',
          task_type: 'action',
          assigned_role: 'securities_counsel',
          estimated_duration: '1-3 days',
        },
        {
          id: 'S-4.1.2',
          title: 'File Articles of Organization',
          description: 'File formation documents with the secretary of state. For Series LLC: file master series designation. Obtain certified copies.',
          task_type: 'filing',
          assigned_role: 'securities_counsel',
          estimated_duration: '1-5 days',
          required_documents: ['articles_of_organization'],
        },
        {
          id: 'S-4.1.3',
          title: 'Draft Operating Agreement',
          description: 'Draft comprehensive operating agreement defining: management structure, investor rights, distribution waterfall, voting provisions, transfer restrictions, dissolution procedures, and manager authority.',
          task_type: 'action',
          assigned_role: 'securities_counsel',
          estimated_duration: '5-10 days',
          required_documents: ['operating_agreement'],
        },
        {
          id: 'S-4.1.4',
          title: 'Obtain EIN',
          description: 'Apply for Employer Identification Number (EIN) from the IRS for the new SPV entity. Required for bank account opening and tax reporting.',
          task_type: 'filing',
          assigned_role: 'securities_counsel',
          estimated_duration: '1-2 days',
          required_documents: ['ein_letter'],
        },
        {
          id: 'S-4.1.5',
          title: 'Open SPV Bank Account',
          description: 'Open a dedicated bank account for the SPV entity. Collect subscription proceeds, pay operating expenses, and distribute returns through this account. Banking institution must complete CIP on the SPV.',
          task_type: 'action',
          assigned_role: 'ceo',
          estimated_duration: '3-7 days',
          required_documents: ['bank_account_confirmation'],
        },
        {
          id: 'S-4.1.6',
          title: 'Register as Foreign LLC (if needed)',
          description: 'If the SPV is formed in a different state than where the asset is located, file foreign LLC registration in the asset state. Required for real estate and mineral rights SPVs.',
          task_type: 'filing',
          assigned_role: 'securities_counsel',
          estimated_duration: '3-7 days',
        },
      ],
    },
    {
      id: 'S-4.2',
      step_number: '4.2',
      title: 'Regulatory Exemption Selection',
      description: 'Determine the optimal SEC exemption for the offering based on target investor base, raise amount, timeline, and cost constraints.',
      task_type: 'review',
      assigned_role: 'securities_counsel',
      estimated_duration: '3-7 days',
      regulatory_basis: 'All securities offerings must be registered with the SEC or qualify for an exemption. The three primary exemptions for fractional RWA offerings are: Regulation D Rule 506(b) (accredited + up to 35 sophisticated, no general solicitation), Regulation D Rule 506(c) (accredited only, general solicitation permitted), Regulation A+ Tier 2 (all investors, up to $75M, SEC qualification required), and Regulation CF (all investors, up to $5M, funding portal required).',
      regulatory_citations: [
        '17 CFR 230.506(b) (Reg D 506(b))',
        '17 CFR 230.506(c) (Reg D 506(c))',
        'Regulation A, 17 CFR 230.251-263',
        'Regulation CF, 17 CFR 227',
        'Securities Act Section 4(a)(2) (private placement exemption)',
      ],
      regulation_types: ['sec'],
      source_urls: [
        'https://www.sec.gov/resources-small-businesses/capital-raising-building-blocks/regulation',
        'https://www.sec.gov/resources-small-businesses/exempt-offerings/regulation-d-exemptions',
      ],
      required_documents: [],
      output_documents: ['exemption_analysis_memo'],
      required_approvals: {
        internal: ['ceo'],
        external: ['securities_counsel'],
      },
      asset_classes: 'all',
      subtasks: [
        {
          id: 'S-4.2.1',
          title: 'Analyze Exemption Options',
          description: 'Compare Reg D 506(b), 506(c), Reg A+ Tier 2, and Reg CF across these dimensions: (1) investor eligibility, (2) raise limit, (3) general solicitation, (4) verification requirements, (5) ongoing reporting, (6) preemption of state blue sky, (7) cost, (8) timeline. Document recommendation with rationale.',
          task_type: 'review',
          assigned_role: 'securities_counsel',
          estimated_duration: '2-3 days',
        },
        {
          id: 'S-4.2.2',
          title: 'CEO Decision & Documentation',
          description: 'CEO reviews exemption analysis and selects the exemption. Document decision with rationale in the deal file. This decision drives the entire securities structuring process.',
          task_type: 'approval',
          assigned_role: 'ceo',
          estimated_duration: '1-2 days',
          is_blocking: true,
        },
      ],
    },
    {
      id: 'S-4.3',
      step_number: '4.3',
      title: 'Transfer Agent Engagement',
      description: 'Select and engage an SEC-registered transfer agent. The transfer agent maintains the official shareholder registry, processes issuances and transfers, and manages the cap table.',
      task_type: 'action',
      assigned_role: 'ceo',
      estimated_duration: '2-4 weeks',
      estimated_cost: '$5,000-$25,000/year',
      regulatory_basis: 'Transfer agents must be registered with the SEC under Section 17A of the Securities Exchange Act of 1934. The transfer agent is the official record keeper of security ownership and must maintain accurate records per SEC rules.',
      regulatory_citations: [
        'Securities Exchange Act Section 17A, 15 U.S.C. 78q-1',
        '17 CFR 240.17Ad-1 through 17Ad-19 (Transfer Agent Rules)',
      ],
      regulation_types: ['sec'],
      source_urls: [
        'https://www.sec.gov/resources-small-businesses/going-public/transfer-agents',
      ],
      required_documents: [],
      output_documents: ['transfer_agent_agreement'],
      asset_classes: 'all',
      subtasks: [
        {
          id: 'S-4.3.1',
          title: 'Evaluate Transfer Agent Options',
          description: 'Compare transfer agent options: Rialto Transfer Services (integrated with ATS), Vertalo (digital-native), Colonial Stock Transfer (traditional), or equivalent. Evaluate: SEC registration, digital capabilities, ATS integration, pricing, and investor portal.',
          task_type: 'action',
          assigned_role: 'ceo',
          estimated_duration: '5-10 days',
        },
        {
          id: 'S-4.3.2',
          title: 'Negotiate & Execute Agreement',
          description: 'Negotiate service agreement terms including: fee structure, service levels, reporting frequency, technology integration, and termination provisions.',
          task_type: 'action',
          assigned_role: 'ceo',
          estimated_duration: '5-10 days',
          required_documents: ['transfer_agent_agreement'],
        },
        {
          id: 'S-4.3.3',
          title: 'Configure Cap Table',
          description: 'Set up the cap table on the transfer agent platform: define unit classes, total authorized units, transfer restrictions, and investor identifiers.',
          task_type: 'action',
          assigned_role: 'cto',
          estimated_duration: '2-5 days',
        },
      ],
    },
    {
      id: 'S-4.4',
      step_number: '4.4',
      title: 'Broker-Dealer / Placement Agent Engagement',
      description: 'Engage a FINRA-registered broker-dealer (BD) as placement agent for primary distribution. The BD assists with investor qualification, subscription processing, and regulatory compliance for the offering.',
      task_type: 'action',
      assigned_role: 'ceo',
      estimated_duration: '2-6 weeks',
      estimated_cost: '$10,000-$55,000 setup + 1-7% success fee',
      regulatory_basis: 'The use of a registered broker-dealer for securities distribution ensures compliance with the Securities Exchange Act Section 15. Any person "effecting transactions in securities" must be registered as a BD. Exceptions exist for issuers selling their own securities (Section 3(a)(4)), but using a BD provides significant legal protection and investor confidence.',
      regulatory_citations: [
        'Securities Exchange Act Section 15, 15 U.S.C. 78o',
        'FINRA Rule 5123 (Private Placements of Securities)',
        'FINRA Rule 2111 (Suitability) / Reg BI',
        'SEC Regulation Best Interest, 17 CFR 240.15l-1',
      ],
      regulation_types: ['sec', 'finra'],
      source_urls: [
        'https://www.finra.org/rules-guidance/rulebooks/finra-rules/5123',
      ],
      required_documents: [],
      output_documents: ['broker_dealer_agreement', 'selling_agreement'],
      asset_classes: 'all',
      subtasks: [
        {
          id: 'S-4.4.1',
          title: 'Evaluate BD Options',
          description: 'Compare BD options: Rialto Markets (full-stack), Dalmore Group (digital offerings), North Capital (online BD), or traditional placement agents. Evaluate: FINRA disciplinary history (BrokerCheck), asset class experience, fee structure, distribution reach, and technology platform.',
          task_type: 'action',
          assigned_role: 'ceo',
          estimated_duration: '5-14 days',
        },
        {
          id: 'S-4.4.2',
          title: 'BD Due Diligence on the Offering',
          description: 'The BD will conduct its own due diligence on the offering per FINRA Rule 5123 and Regulation Best Interest. Cooperate fully with BD information requests. This process validates the offering structure.',
          task_type: 'review',
          assigned_role: 'ceo',
          estimated_duration: '1-3 weeks',
        },
        {
          id: 'S-4.4.3',
          title: 'Negotiate & Execute Agreements',
          description: 'Negotiate placement agreement: commission structure, expense reimbursement, indemnification, territory, minimum raise, and termination provisions.',
          task_type: 'action',
          assigned_role: 'ceo',
          estimated_duration: '5-10 days',
          required_documents: ['broker_dealer_agreement'],
        },
      ],
    },
    {
      id: 'S-4.5',
      step_number: '4.5',
      title: 'Unit / Share Structure Configuration',
      description: 'Define the fractional ownership structure: total units, minimum investment per investor, unit price, investor rights (economic, governance, information), distribution waterfall, and transfer restrictions.',
      task_type: 'action',
      assigned_role: 'securities_counsel',
      estimated_duration: '1-2 weeks',
      depends_on: ['4.1', '4.2'],
      regulatory_basis: 'Unit structure must comply with the selected SEC exemption requirements. For Reg D 506(c): no limit on raise amount, but all purchasers must be accredited. Minimum investment thresholds affect accreditation verification requirements (March 2025 SEC no-action letter: $200K+ for natural persons enables self-certification).',
      regulatory_citations: [
        '17 CFR 230.506(c)(2)(ii) (verification methods)',
        'SEC No-Action Letter (March 12, 2025) — self-certification at higher minimums',
      ],
      regulation_types: ['sec'],
      required_documents: [],
      output_documents: ['unit_structure_term_sheet'],
      required_approvals: {
        internal: ['ceo'],
        external: ['securities_counsel'],
      },
      asset_classes: 'all',
    },
    {
      id: 'S-4.6',
      step_number: '4.6',
      title: 'Escrow Structure & Release Conditions',
      description: 'Define escrow arrangements for investor subscription funds: minimum raise threshold (soft cap), escrow agent selection, release conditions, refund procedures if minimum not met, and interest treatment.',
      task_type: 'action',
      assigned_role: 'securities_counsel',
      estimated_duration: '1-2 weeks',
      estimated_cost: '$2,000-$5,000',
      regulatory_basis: 'Escrow protections for investor capital are expected by SEC and state regulators, particularly in blind pool or asset-backed offering scenarios. Escrow structure must be fully disclosed in the PPM. Failure to establish adequate escrow creates regulatory risk and investor confidence issues.',
      regulatory_citations: [
        'SEC Rule 15c2-4 (Escrow of Securities Offering Proceeds)',
      ],
      regulation_types: ['sec'],
      required_documents: [],
      output_documents: ['escrow_agreement'],
      asset_classes: 'all',
    },
    {
      id: 'S-4.7',
      step_number: '4.7',
      title: 'Securities Gate',
      description: 'SPV formed. Exemption selected. Transfer agent engaged. BD engaged. Unit structure defined. Escrow established. All securities infrastructure is in place before legal document drafting begins.',
      task_type: 'approval',
      assigned_role: 'ceo',
      estimated_duration: '1-2 days',
      depends_on: ['4.1', '4.2', '4.3', '4.4', '4.5', '4.6'],
      regulatory_basis: 'Gate-based progression ensures all securities infrastructure is established before incurring the significant cost of PPM drafting and SEC filing preparation.',
      regulatory_citations: [],
      regulation_types: ['soc2'],
      required_documents: [],
      output_documents: [],
      required_approvals: {
        internal: ['ceo', 'compliance_officer'],
        external: ['securities_counsel'],
      },
      asset_classes: 'all',
      is_gate: true,
      gate_id: 'G-SECURITIES',
    },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// STAGE 5: VALUE CREATION — Offering Memorandum, Investor Qualification, Subscriptions
// Maps to: phase_4_legal (value creation / offering)
// Duration: 6-14 weeks
// ═══════════════════════════════════════════════════════════════════════════════

export const STAGE_5_VALUE_CREATION: WorkflowStage = {
  stage: 'value_creation',
  stage_number: 5,
  title: 'Value Creation (Fractional Securities)',
  subtitle: 'Offering Documents, Investor Qualification & Subscription Processing',
  description: 'Draft and finalize all offering documents (PPM, Subscription Agreement, Investor Questionnaire). File with SEC. Qualify and onboard investors. Process subscriptions. Issue fractional units.',
  maps_to_phase: 'phase_4_legal',
  estimated_total_duration: '6-14 weeks',
  tasks: [
    {
      id: 'VC-5.1',
      step_number: '5.1',
      title: 'Private Placement Memorandum (PPM) Drafting',
      description: 'Securities counsel drafts the PPM — the primary disclosure document for the offering. Must disclose all material information including: asset description, valuation methodology, risk factors, conflicts of interest, fee structure, use of proceeds, management bios, and tax implications.',
      task_type: 'action',
      assigned_role: 'securities_counsel',
      estimated_duration: '4-8 weeks',
      estimated_cost: '$40,000-$100,000',
      regulatory_basis: 'The PPM is the primary disclosure document for Regulation D offerings. While not technically required for Reg D (unlike Reg A+ offering circular), failing to provide adequate disclosure exposes the issuer to Section 12(a)(2) rescission liability — investors can demand their money back if any material fact was misstated or omitted. The PPM must be reviewed and approved by the broker-dealer under FINRA Rule 5123.',
      regulatory_citations: [
        'Securities Act Section 12(a)(2), 15 U.S.C. 77l',
        'SEC Rule 502(b) (Disclosure Requirements for 506(b))',
        '17 CFR 230.502(b)(2) (Required Disclosures)',
        'FINRA Rule 5123 (BD must file offering documents within 15 days)',
        'SEC Rule 10b-5 (Anti-fraud)',
      ],
      regulation_types: ['sec', 'finra'],
      source_urls: [
        'https://www.law.cornell.edu/uscode/text/15/77l',
        'https://www.finra.org/rules-guidance/rulebooks/finra-rules/5123',
      ],
      required_documents: [
        'offering_value_determination',
        'operating_agreement',
        'lab_certification_report',
        'appraisal_report_1',
        'appraisal_report_2',
        'appraisal_report_3',
        'custody_agreement',
        'insurance_certificate',
      ],
      output_documents: ['ppm_draft', 'ppm_final'],
      asset_classes: 'all',
      variations: {
        gemstones: {
          description_override: 'PPM must include: detailed gemological description (species, color, clarity, cut, carat, origin, treatments), GIA/SSEF/Gubelin lab report summaries, three-appraisal valuation methodology and results, vault custody arrangements, insurance coverage, Proof of Reserve mechanism, and gemstone-specific risk factors (illiquidity, subjective valuation, treatment discoveries).',
        },
        precious_metals: {
          description_override: 'PPM must include: detailed metal specifications (type, form, weight, fineness, refiner, serial numbers), LBMA/assay certification summaries, three-appraisal valuation methodology, allocated storage arrangements, insurance coverage, PoR mechanism, and precious metals-specific risk factors (commodity price volatility, storage risk, counterparty risk).',
        },
        real_estate: {
          description_override: 'PPM must include: property description (location, improvements, condition), Phase I ESA summary, three-appraisal valuation methodology, property management arrangements, tenant information (if applicable), operating history, pro forma projections, insurance coverage, and real estate-specific risk factors (market risk, environmental liability, tenant defaults, capital expenditure requirements). Must include audited financial statements if Reg A+.',
        },
        mineral_rights: {
          description_override: 'PPM must include: legal description of mineral interests, reserve report summary (proved/probable/possible), production history, decline curve projections, operator information, royalty rate and payment structure, three-valuation methodology, and mineral rights-specific risk factors (commodity price volatility, production decline, operator risk, regulatory changes, environmental liability, depletion).',
        },
      },
      subtasks: [
        {
          id: 'VC-5.1.1',
          title: 'Assemble Disclosure Package',
          description: 'Compile all documents needed for PPM drafting: lab reports, appraisals, operating agreement, custody agreement, insurance certificates, management bios, financial projections, and fee schedule.',
          task_type: 'action',
          assigned_role: 'compliance_officer',
          estimated_duration: '3-5 days',
        },
        {
          id: 'VC-5.1.2',
          title: 'Risk Factor Identification',
          description: 'Identify all material risk factors specific to this offering: asset-specific risks, market risks, regulatory risks, operational risks, tax risks, and PleoChrome-specific risks (key person, early stage, limited track record).',
          task_type: 'review',
          assigned_role: 'securities_counsel',
          estimated_duration: '3-5 days',
        },
        {
          id: 'VC-5.1.3',
          title: 'Initial PPM Draft',
          description: 'Securities counsel produces first complete draft of the PPM including all sections: cover page, summary, risk factors, use of proceeds, plan of distribution, description of the asset, management, compensation, conflicts, tax matters, and subscription procedures.',
          task_type: 'action',
          assigned_role: 'securities_counsel',
          estimated_duration: '2-4 weeks',
        },
        {
          id: 'VC-5.1.4',
          title: 'Internal Review & Comment',
          description: 'PleoChrome team (CEO, CTO, Compliance) reviews draft PPM for factual accuracy, completeness, and consistency with marketing materials.',
          task_type: 'review',
          assigned_role: 'ceo',
          estimated_duration: '5-7 days',
        },
        {
          id: 'VC-5.1.5',
          title: 'BD Review & Approval',
          description: 'Broker-dealer reviews PPM for compliance with FINRA rules, suitability requirements, and Regulation Best Interest. BD may require modifications.',
          task_type: 'review',
          assigned_role: 'broker_dealer',
          estimated_duration: '5-14 days',
        },
        {
          id: 'VC-5.1.6',
          title: 'Finalize PPM',
          description: 'Incorporate all review comments. Securities counsel produces final PPM. All parties sign off. PPM is the official offering document.',
          task_type: 'approval',
          assigned_role: 'securities_counsel',
          estimated_duration: '3-5 days',
          is_blocking: true,
        },
      ],
    },
    {
      id: 'VC-5.2',
      step_number: '5.2',
      title: 'Subscription Agreement Drafting',
      description: 'Draft the subscription agreement that investors will sign to purchase fractional units. Includes: investment amount, representations and warranties, accreditation certification, suitability representations, and risk acknowledgments.',
      task_type: 'action',
      assigned_role: 'securities_counsel',
      estimated_duration: '1-2 weeks',
      estimated_cost: '$5,000-$15,000',
      regulatory_basis: 'The subscription agreement creates the binding contractual commitment between the investor and the SPV. It must contain representations and warranties regarding: accredited investor status, investment purpose (not for redistribution), receipt of PPM, understanding of risks, and suitability. The subscription date triggers the 15-day Form D filing deadline if it is the first sale.',
      regulatory_citations: [
        '17 CFR 230.502(d) (Resale limitations)',
        '17 CFR 230.506(c)(2)(ii) (Accreditation verification)',
      ],
      regulation_types: ['sec'],
      required_documents: ['ppm_final'],
      output_documents: ['subscription_agreement'],
      asset_classes: 'all',
    },
    {
      id: 'VC-5.3',
      step_number: '5.3',
      title: 'Investor Questionnaire Preparation',
      description: 'Prepare the investor questionnaire that collects: accreditation basis, investment experience, risk tolerance, suitability information, and source of investment funds. Required for both KYC and suitability compliance.',
      task_type: 'action',
      assigned_role: 'securities_counsel',
      estimated_duration: '3-5 days',
      estimated_cost: '$2,000-$5,000',
      regulatory_basis: 'FINRA suitability rules (Rule 2111) and SEC Regulation Best Interest require reasonable basis to believe the investment is suitable for each investor. The investor questionnaire collects the information necessary to make this determination.',
      regulatory_citations: [
        'FINRA Rule 2111 (Suitability)',
        'SEC Regulation Best Interest, 17 CFR 240.15l-1',
        '17 CFR 230.506(c)(2)(ii) (Accreditation verification methods)',
      ],
      regulation_types: ['sec', 'finra'],
      required_documents: [],
      output_documents: ['investor_questionnaire'],
      asset_classes: 'all',
    },
    {
      id: 'VC-5.4',
      step_number: '5.4',
      title: 'SEC Filing Preparation',
      description: 'Prepare the appropriate SEC filing based on the selected exemption. For Reg D: Form D (notice filing). For Reg A+: Form 1-A (offering circular requiring SEC qualification). For Reg CF: Form C (via funding portal).',
      task_type: 'filing',
      assigned_role: 'securities_counsel',
      estimated_duration: '1-4 weeks (Reg D) / 8-16 weeks (Reg A+)',
      estimated_cost: '$500 (Reg D) / $50,000-$100,000 (Reg A+)',
      regulatory_basis: 'Form D is a notice filing required within 15 calendar days of the first sale of securities under Regulation D. The "first sale" is when the first investor is irrevocably contractually committed to invest. Form 1-A for Reg A+ must be qualified by the SEC before any sales — this is a review process that typically takes 2-6 months. Note: EDGAR account setup now requires Login.gov with MFA (mandatory since EDGAR Next, September 2025).',
      regulatory_citations: [
        '17 CFR 230.503 (Form D filing requirement)',
        '17 CFR 230.252 (Form 1-A for Reg A+)',
        'Regulation CF, 17 CFR 227.203 (Form C)',
      ],
      regulation_types: ['sec'],
      source_urls: [
        'https://www.sec.gov/resources-small-businesses/exempt-offerings/filing-form-d-notice',
        'https://www.sec.gov/edgar',
      ],
      required_documents: ['ppm_final'],
      output_documents: ['form_d_filing', 'edgar_confirmation'],
      asset_classes: 'all',
      subtasks: [
        {
          id: 'VC-5.4.1',
          title: 'EDGAR Account Setup / Verification',
          description: 'Verify or set up EDGAR filing account for the SPV. Since EDGAR Next (Sept 2025): requires Login.gov account with MFA. Obtain CIK (Central Index Key) for the issuer.',
          task_type: 'action',
          assigned_role: 'securities_counsel',
          estimated_duration: '2-5 days',
        },
        {
          id: 'VC-5.4.2',
          title: 'Complete Form D / Form 1-A',
          description: 'Complete the applicable filing form with all required information: issuer details, offering details, exemption claimed, amount being offered, investor limitations, and use of proceeds.',
          task_type: 'action',
          assigned_role: 'securities_counsel',
          estimated_duration: '2-7 days (Form D) / 4-8 weeks (Form 1-A)',
        },
        {
          id: 'VC-5.4.3',
          title: 'File with SEC',
          description: 'Submit filing via EDGAR. For Form D: file within 15 days of first sale. For Form 1-A: file and begin SEC review process. Confirm receipt and filing acceptance.',
          task_type: 'filing',
          assigned_role: 'securities_counsel',
          estimated_duration: '1 day (filing) / 2-6 months (Reg A+ qualification)',
        },
      ],
    },
    {
      id: 'VC-5.5',
      step_number: '5.5',
      title: 'Blue Sky State Filings',
      description: 'File state securities notice filings in all applicable jurisdictions. Requirements vary significantly by state. Most states accept NASAA Electronic Filing Depository (EFD) submissions.',
      task_type: 'filing',
      assigned_role: 'securities_counsel',
      estimated_duration: '1-3 weeks',
      estimated_cost: '$1,500-$15,000 (varies by number of states)',
      regulatory_basis: 'NSMIA Section 18(b)(4)(F) preempts state blue sky registration for "covered securities" offered under Rule 506, but 46 states still require notice filings with fees. Critical state rules: New York requires NOTICE BEFORE first sale (not after). Rhode Island requires 10-day pre-filing. Florida does NOT require filing for Rule 506. Texas requires Form D filing at state level. For Reg A+: Tier 2 is preempted from state registration but not from state enforcement.',
      regulatory_citations: [
        'NSMIA Section 18(b)(4)(F), 15 U.S.C. 77r(b)(4)(F)',
        'State Blue Sky Laws (varies by state)',
        'NASAA Uniform Notice Filing Policy',
      ],
      regulation_types: ['sec', 'state_blue_sky'],
      source_urls: [
        'https://www.nasaa.org/industry-resources/electronic-filing/',
      ],
      required_documents: ['form_d_filing'],
      output_documents: ['blue_sky_filings'],
      asset_classes: 'all',
      subtasks: [
        {
          id: 'VC-5.5.1',
          title: 'Identify Required Filing States',
          description: 'Determine which states require notice filings based on: issuer state, asset location state, and anticipated investor states. Pre-filing states (NY, RI) must be filed before first sale.',
          task_type: 'action',
          assigned_role: 'securities_counsel',
          estimated_duration: '1-2 days',
        },
        {
          id: 'VC-5.5.2',
          title: 'Prepare State Filings',
          description: 'Prepare filing forms for each state. Most accept NASAA EFD electronic filing. New York requires Form 99 + consent to service. Calculate filing fees.',
          task_type: 'action',
          assigned_role: 'securities_counsel',
          estimated_duration: '3-7 days',
        },
        {
          id: 'VC-5.5.3',
          title: 'Submit Filings & Pay Fees',
          description: 'Submit all state filings via NASAA EFD or individual state portals. Pay filing fees (range: $100-$600 per state, except NY which is significantly higher). Retain confirmations.',
          task_type: 'filing',
          assigned_role: 'securities_counsel',
          estimated_duration: '1-3 days',
        },
      ],
    },
    {
      id: 'VC-5.6',
      step_number: '5.6',
      title: 'Investor Marketing & Outreach',
      description: 'Begin investor outreach. Under Reg D 506(c): general solicitation and advertising are permitted. All marketing materials must be reviewed by securities counsel and the broker-dealer.',
      task_type: 'action',
      assigned_role: 'chief_revenue_officer',
      estimated_duration: 'Ongoing (2-12 weeks for initial capital raise)',
      estimated_cost: '$5,000-$50,000',
      depends_on: ['5.1'],
      regulatory_basis: 'Rule 506(c) permits general solicitation and advertising, unlike Rule 506(b). However, all purchasers must still be accredited investors with reasonable steps taken to verify accreditation. Marketing materials must not contain material misstatements or omissions. All materials should be reviewed by counsel and BD to avoid securities fraud liability under Rule 10b-5.',
      regulatory_citations: [
        '17 CFR 230.506(c) (General solicitation permitted)',
        'SEC Rule 10b-5 (Anti-fraud)',
        'FINRA Rule 2210 (Communications with the Public)',
      ],
      regulation_types: ['sec', 'finra'],
      source_urls: [
        'https://www.sec.gov/resources-small-businesses/exempt-offerings/general-solicitation-rule-506c',
      ],
      required_documents: ['ppm_final'],
      output_documents: ['marketing_materials_approved'],
      asset_classes: 'all',
      subtasks: [
        {
          id: 'VC-5.6.1',
          title: 'Develop Marketing Materials',
          description: 'Create investor-facing materials: pitch deck, one-pager, email templates, landing page, and social media content. All materials must be consistent with PPM disclosures.',
          task_type: 'action',
          assigned_role: 'chief_revenue_officer',
          estimated_duration: '1-2 weeks',
        },
        {
          id: 'VC-5.6.2',
          title: 'Legal & BD Review of Materials',
          description: 'Securities counsel and BD review all marketing materials for compliance with Rule 506(c), Rule 10b-5, and FINRA Rule 2210. No unapproved materials may be distributed.',
          task_type: 'review',
          assigned_role: 'securities_counsel',
          estimated_duration: '3-7 days',
          is_blocking: true,
        },
        {
          id: 'VC-5.6.3',
          title: 'Execute Outreach Campaign',
          description: 'Distribute approved materials via: accredited investor networks, family office databases, RIA channels, digital advertising (Rule 506(c) permitted), industry events, and direct introductions.',
          task_type: 'action',
          assigned_role: 'chief_revenue_officer',
          estimated_duration: 'Ongoing',
        },
      ],
    },
    {
      id: 'VC-5.7',
      step_number: '5.7',
      title: 'Investor KYC & Accreditation Verification',
      description: 'For each prospective investor: complete KYC, sanctions screening, and accredited investor verification per the selected method under Rule 506(c).',
      task_type: 'action',
      assigned_role: 'compliance_officer',
      estimated_duration: '3-10 days per investor',
      regulatory_basis: 'Rule 506(c) requires the issuer to take "reasonable steps to verify" that all purchasers are accredited investors. Verification methods include: (1) reviewing tax returns + W-2s for income test, (2) reviewing bank/brokerage statements for net worth test, (3) obtaining written confirmation from a registered BD, CPA, attorney, or RIA, (4) self-certification at higher minimum investments per March 2025 SEC no-action letter ($200K+ natural persons, $1M+ entities). The March 2025 letter also requires: minimum is per investor (not aggregated with spouse), investor must represent funds are not borrowed for the investment.',
      regulatory_citations: [
        '17 CFR 230.506(c)(2)(ii) (Verification methods)',
        '17 CFR 230.501(a) (Accredited investor definition)',
        'SEC No-Action Letter (March 12, 2025) — self-certification safe harbor',
        'BSA/FinCEN CIP Requirements',
      ],
      regulation_types: ['sec', 'fincen'],
      required_documents: [],
      output_documents: ['kyc_report', 'accreditation_verification', 'investor_suitability_form'],
      asset_classes: 'all',
      subtasks: [
        {
          id: 'VC-5.7.1',
          title: 'Investor KYC Collection',
          description: 'Collect investor identity documents: government ID, proof of address, SSN/TIN (for tax reporting), and for entities: formation documents, EIN, beneficial ownership.',
          task_type: 'upload',
          assigned_role: 'compliance_officer',
          estimated_duration: '2-5 days',
          required_documents: ['government_id', 'proof_of_address'],
        },
        {
          id: 'VC-5.7.2',
          title: 'Sanctions & AML Screening',
          description: 'Screen investor against OFAC SDN list, PEP databases, and adverse media. For entities: screen all beneficial owners.',
          task_type: 'automated',
          assigned_role: 'compliance_officer',
          estimated_duration: '1 day',
        },
        {
          id: 'VC-5.7.3',
          title: 'Accreditation Verification',
          description: 'Verify accredited investor status using the selected method: (A) Income: 2 years of tax returns showing $200K+ individual / $300K+ joint, (B) Net Worth: bank/brokerage statements showing $1M+ excluding primary residence, (C) Professional Letter: written confirmation from registered BD, CPA, attorney, or RIA, (D) Self-Certification: investor invests $200K+ and represents funds are not borrowed (per March 2025 no-action letter).',
          task_type: 'review',
          assigned_role: 'compliance_officer',
          estimated_duration: '2-5 days',
          is_blocking: true,
        },
        {
          id: 'VC-5.7.4',
          title: 'Suitability Assessment',
          description: 'Review investor questionnaire for suitability: investment experience, risk tolerance, liquidity needs, portfolio concentration, and investment objectives. BD must concur if BD is involved.',
          task_type: 'review',
          assigned_role: 'compliance_officer',
          estimated_duration: '1-2 days',
        },
      ],
    },
    {
      id: 'VC-5.8',
      step_number: '5.8',
      title: 'Subscription Processing & Unit Issuance',
      description: 'Process investor subscription: execute subscription agreement, collect funds via wire transfer to escrow, perform final compliance review, issue fractional units via transfer agent, and update cap table.',
      task_type: 'action',
      assigned_role: 'compliance_officer',
      estimated_duration: '3-7 days per investor',
      regulatory_basis: 'Subscription creates the binding contractual commitment. Each subscription must be individually reviewed for completeness (subscription agreement, investor questionnaire, accreditation verification, KYC clearance) before acceptance. Issuer has the right to reject any subscription. Transfer agent records the issuance.',
      regulatory_citations: [
        'Securities Exchange Act Section 17A (Transfer Agent)',
        '17 CFR 230.502(d) (Resale limitations — legend requirement)',
      ],
      regulation_types: ['sec'],
      required_documents: ['subscription_agreement', 'investor_questionnaire', 'accreditation_verification'],
      output_documents: ['executed_subscription', 'unit_certificate', 'cap_table_update'],
      asset_classes: 'all',
      subtasks: [
        {
          id: 'VC-5.8.1',
          title: 'Execute Subscription Agreement',
          description: 'Investor signs subscription agreement. Verify all required representations and warranties are properly completed. Countersign on behalf of the SPV.',
          task_type: 'action',
          assigned_role: 'compliance_officer',
          estimated_duration: '1-3 days',
        },
        {
          id: 'VC-5.8.2',
          title: 'Collect Subscription Funds',
          description: 'Investor wires subscription amount to escrow account (or directly to SPV if past escrow release threshold). Verify receipt and AML clearance of funds.',
          task_type: 'payment',
          assigned_role: 'compliance_officer',
          estimated_duration: '1-3 days',
        },
        {
          id: 'VC-5.8.3',
          title: 'Final Compliance Review',
          description: 'Review complete investor file: KYC clear, accreditation verified, suitability confirmed, subscription agreement complete, funds received. Approve or reject subscription.',
          task_type: 'approval',
          assigned_role: 'compliance_officer',
          estimated_duration: '1 day',
          is_blocking: true,
        },
        {
          id: 'VC-5.8.4',
          title: 'Issue Fractional Units',
          description: 'Instruct transfer agent to issue fractional units to the investor. Units carry restricted legend per Rule 502(d). Cap table updated. Investor confirmation sent.',
          task_type: 'action',
          assigned_role: 'cto',
          estimated_duration: '1-2 days',
        },
      ],
    },
    {
      id: 'VC-5.9',
      step_number: '5.9',
      title: 'Value Creation Gate',
      description: 'PPM finalized. SEC filing submitted. Blue sky filings complete. First subscription(s) processed. Investor pipeline operational. Escrow release conditions met (if applicable).',
      task_type: 'approval',
      assigned_role: 'ceo',
      estimated_duration: '1-2 days',
      depends_on: ['5.1', '5.4', '5.5', '5.8'],
      regulatory_basis: 'Gate confirms all offering documents are finalized, regulatory filings submitted, and the subscription process is operational before scaling investor outreach.',
      regulatory_citations: [],
      regulation_types: ['soc2'],
      required_documents: [],
      output_documents: [],
      required_approvals: {
        internal: ['ceo', 'compliance_officer'],
      },
      asset_classes: 'all',
      is_gate: true,
      gate_id: 'G-VALUE',
    },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// STAGE 6: DISTRIBUTION — ATS Listing, BD Placement, Secondary Trading, Ongoing
// Maps to: phase_4_legal (distribution / ongoing management)
// Duration: Ongoing (initial setup 2-6 weeks)
// ═══════════════════════════════════════════════════════════════════════════════

export const STAGE_6_DISTRIBUTION: WorkflowStage = {
  stage: 'distribution',
  stage_number: 6,
  title: 'Distribution',
  subtitle: 'ATS Listing, Secondary Trading & Ongoing Management',
  description: 'List units on Alternative Trading System for secondary liquidity, manage ongoing reporting obligations, process secondary transfers, handle annual compliance, and manage eventual exit/liquidation.',
  maps_to_phase: 'phase_4_legal',
  estimated_total_duration: 'Ongoing (lifetime of offering)',
  tasks: [
    {
      id: 'D-6.1',
      step_number: '6.1',
      title: 'ATS Listing Application',
      description: 'Apply to list fractional units on a registered Alternative Trading System (ATS) for secondary trading. The ATS provides liquidity for investors who wish to sell their units after the Rule 144 holding period.',
      task_type: 'action',
      assigned_role: 'ceo',
      estimated_duration: '2-6 weeks',
      estimated_cost: '$10,000-$50,000/year',
      regulatory_basis: 'Alternative Trading Systems must be registered with the SEC under Regulation ATS (17 CFR 242.300-303). The ATS operator must also be registered as a broker-dealer. ATS listing provides secondary liquidity, which enhances the offering\'s attractiveness to investors.',
      regulatory_citations: [
        'Regulation ATS, 17 CFR 242.300-303',
        'Securities Exchange Act Section 5 (Exchange registration)',
        'SEC Form ATS (filed by ATS operator)',
      ],
      regulation_types: ['sec'],
      source_urls: [
        'https://www.sec.gov/divisions/marketreg/form-ats-n-filings.htm',
      ],
      required_documents: ['ppm_final'],
      output_documents: ['ats_listing_agreement'],
      asset_classes: 'all',
      subtasks: [
        {
          id: 'D-6.1.1',
          title: 'Select ATS Platform',
          description: 'Evaluate ATS options: Rialto Markets, tZERO, Securitize Markets, North Capital, MERJ Exchange, or equivalent. Evaluate: asset class support, investor access, fee structure, technology integration, and regulatory track record.',
          task_type: 'action',
          assigned_role: 'ceo',
          estimated_duration: '5-10 days',
        },
        {
          id: 'D-6.1.2',
          title: 'ATS Due Diligence & Application',
          description: 'Complete ATS listing application. ATS operator will conduct due diligence on the offering, SPV, and underlying asset. Provide all requested documentation.',
          task_type: 'action',
          assigned_role: 'ceo',
          estimated_duration: '1-4 weeks',
        },
        {
          id: 'D-6.1.3',
          title: 'Execute Listing Agreement',
          description: 'Negotiate and execute ATS listing agreement. Define: listing fees, trading fees, reporting obligations, and de-listing provisions.',
          task_type: 'action',
          assigned_role: 'ceo',
          estimated_duration: '3-7 days',
          required_documents: ['ats_listing_agreement'],
        },
      ],
    },
    {
      id: 'D-6.2',
      step_number: '6.2',
      title: 'FINRA Form 5123 Filing (BD)',
      description: 'The broker-dealer must file the offering documents with FINRA within 15 calendar days of the first sale of securities. This is the BD\'s obligation but the issuer must ensure compliance.',
      task_type: 'filing',
      assigned_role: 'broker_dealer',
      estimated_duration: '1-5 days',
      regulatory_basis: 'FINRA Rule 5123 requires member firms to submit offering documents (PPM, term sheet, or other offering documents) to FINRA\'s Corporate Financing Department within 15 calendar days of the date of first sale. Failure to file can result in FINRA disciplinary action against the BD.',
      regulatory_citations: [
        'FINRA Rule 5123 (Private Placements of Securities)',
      ],
      regulation_types: ['finra'],
      source_urls: [
        'https://www.finra.org/rules-guidance/rulebooks/finra-rules/5123',
      ],
      required_documents: ['ppm_final'],
      output_documents: ['finra_5123_confirmation'],
      asset_classes: 'all',
    },
    {
      id: 'D-6.3',
      step_number: '6.3',
      title: 'Secondary Transfer Processing',
      description: 'Facilitate compliant secondary transfers of fractional units between investors. All transfers must comply with Rule 144 or another exemption from registration. Transfer agent processes the transfer.',
      task_type: 'action',
      assigned_role: 'compliance_officer',
      estimated_duration: '3-7 days per transfer',
      regulatory_basis: 'Restricted securities may not be resold without registration or an exemption. Rule 144 requires: (1) minimum holding period of 6 months (reporting issuers) or 12 months (non-reporting issuers), (2) current public information, (3) volume limitations for affiliates, (4) manner of sale requirements, (5) Form 144 filing for sales over 5,000 shares or $50,000. For non-affiliates of non-reporting issuers: 12-month hold + no other conditions.',
      regulatory_citations: [
        '17 CFR 230.144 (Rule 144 — Selling Restricted and Control Securities)',
        'Securities Act Section 4(a)(1) (Exemption for non-issuer transactions)',
        'Securities Act Section 4(a)(7) (Exemption for accredited investor resales)',
      ],
      regulation_types: ['sec'],
      source_urls: [
        'https://www.sec.gov/reports/rule-144-selling-restricted-control-securities',
      ],
      required_documents: [],
      output_documents: ['transfer_instruction_letter', 'opinion_letter'],
      asset_classes: 'all',
      subtasks: [
        {
          id: 'D-6.3.1',
          title: 'Verify Holding Period',
          description: 'Confirm seller has held units for the required holding period: 12 months for non-reporting issuer under Rule 144. Check original subscription date against transfer agent records.',
          task_type: 'review',
          assigned_role: 'compliance_officer',
          estimated_duration: '1 day',
        },
        {
          id: 'D-6.3.2',
          title: 'KYC Buyer',
          description: 'Complete KYC and accreditation verification on the buyer (same process as primary offering investor qualification).',
          task_type: 'action',
          assigned_role: 'compliance_officer',
          estimated_duration: '3-5 days',
        },
        {
          id: 'D-6.3.3',
          title: 'Securities Counsel Opinion Letter',
          description: 'Obtain opinion letter from securities counsel confirming the transfer qualifies for an exemption from registration (Rule 144, Section 4(a)(1), or Section 4(a)(7)).',
          task_type: 'review',
          assigned_role: 'securities_counsel',
          estimated_duration: '2-5 days',
          required_documents: ['opinion_letter'],
        },
        {
          id: 'D-6.3.4',
          title: 'Process Transfer',
          description: 'Instruct transfer agent to process the transfer. Update cap table. Issue new units to buyer and cancel seller\'s units. Confirm transaction to both parties.',
          task_type: 'action',
          assigned_role: 'cto',
          estimated_duration: '1-2 days',
        },
      ],
    },
    {
      id: 'D-6.4',
      step_number: '6.4',
      title: 'Cap Table Management',
      description: 'Maintain the official shareholder registry through the transfer agent. Track all unit holders, transfer restrictions, compliance status, and distribution eligibility.',
      task_type: 'automated',
      assigned_role: 'cto',
      estimated_duration: 'Ongoing',
      regulatory_basis: 'The transfer agent must maintain accurate records of security ownership per SEC rules. The cap table is the legal record of who owns what. Discrepancies between the cap table and actual ownership create regulatory and legal liability.',
      regulatory_citations: [
        'Securities Exchange Act Section 17A',
        '17 CFR 240.17Ad-1 through 17Ad-19',
      ],
      regulation_types: ['sec'],
      required_documents: [],
      output_documents: [],
      asset_classes: 'all',
    },
    {
      id: 'D-6.5',
      step_number: '6.5',
      title: 'Quarterly Reporting',
      description: 'Prepare and distribute quarterly investor reports including: NAV update, asset status, custody verification, insurance confirmation, market conditions, and any material events.',
      task_type: 'action',
      assigned_role: 'ceo',
      estimated_duration: '3-5 days per quarter',
      regulatory_basis: 'Quarterly reporting is a PPM commitment and investor relations best practice. NAV calculation must be based on documented methodology. Material events must be promptly disclosed to investors.',
      regulatory_citations: [],
      regulation_types: ['none'],
      required_documents: [],
      output_documents: ['quarterly_investor_report'],
      asset_classes: 'all',
      variations: {
        real_estate: {
          description_override: 'Quarterly report includes: NOI vs. budget, occupancy rate, rent collection rate, capital expenditure updates, property condition changes, lease expirations, market comparables, and any material events (tenant defaults, damage, zoning changes).',
          additional_documents: ['quarterly_financial_statements', 'occupancy_report'],
        },
        mineral_rights: {
          description_override: 'Quarterly report includes: production volumes vs. forecast, royalty income received, commodity prices, well status updates, operator activity, reserve revisions (if any), and regulatory/environmental developments.',
          additional_documents: ['production_report', 'royalty_statement'],
        },
      },
    },
    {
      id: 'D-6.6',
      step_number: '6.6',
      title: 'Annual Obligations',
      description: 'Execute all annual compliance requirements: independent re-appraisal, K-1 tax distribution, Form D amendment, blue sky renewals, annual compliance audit, and investor communications.',
      task_type: 'action',
      assigned_role: 'compliance_officer',
      estimated_duration: '2-4 weeks (annually)',
      estimated_cost: '$15,000-$50,000/year',
      regulatory_basis: 'K-1 reporting is required by March 15 for partnership/LLC pass-through entities (IRC Section 6031). Form D annual amendments are required if the offering continues beyond one year (17 CFR 230.503(a)). Blue sky renewals vary by state. Annual re-appraisal supports NAV accuracy and investor confidence.',
      regulatory_citations: [
        'IRC Section 6031 (K-1 reporting deadline)',
        '17 CFR 230.503(a) (Form D annual amendment)',
        'State Blue Sky renewal requirements (varies)',
      ],
      regulation_types: ['sec', 'irs', 'state_blue_sky'],
      required_documents: [],
      output_documents: ['annual_reappraisal', 'k1_tax_documents', 'form_d_amendment', 'blue_sky_renewals', 'annual_compliance_report'],
      asset_classes: 'all',
      subtasks: [
        {
          id: 'D-6.6.1',
          title: 'Annual Independent Re-Appraisal',
          description: 'Commission updated independent appraisal to support current NAV. Single appraiser acceptable for annual updates (three-appraisal only required at initial offering).',
          task_type: 'action',
          assigned_role: 'chief_revenue_officer',
          estimated_duration: '2-4 weeks',
          required_documents: ['annual_reappraisal'],
        },
        {
          id: 'D-6.6.2',
          title: 'K-1 Tax Document Preparation & Distribution',
          description: 'Prepare Schedule K-1 for each unit holder. Distribute by March 15 (or request 6-month extension via Form 7004). Coordinate with SPV tax preparer (CPA).',
          task_type: 'action',
          assigned_role: 'compliance_officer',
          estimated_duration: '2-4 weeks',
          required_documents: ['k1_tax_documents'],
        },
        {
          id: 'D-6.6.3',
          title: 'Form D Annual Amendment',
          description: 'File Form D amendment with SEC if offering continues beyond one year. Update total amount sold, number of investors, and any other changed information.',
          task_type: 'filing',
          assigned_role: 'securities_counsel',
          estimated_duration: '1-3 days',
          required_documents: ['form_d_amendment'],
        },
        {
          id: 'D-6.6.4',
          title: 'Blue Sky Renewals',
          description: 'File renewal notice filings with applicable states. Requirements and deadlines vary by state. Most states require annual renewal with fees.',
          task_type: 'filing',
          assigned_role: 'securities_counsel',
          estimated_duration: '3-7 days',
          required_documents: ['blue_sky_renewals'],
        },
        {
          id: 'D-6.6.5',
          title: 'Annual Compliance Audit',
          description: 'Conduct annual internal compliance audit: verify all filings are current, KYC records are maintained, investor accreditation is valid, cap table is accurate, and custody/insurance are current.',
          task_type: 'review',
          assigned_role: 'compliance_officer',
          estimated_duration: '3-5 days',
          required_documents: ['annual_compliance_report'],
        },
        {
          id: 'D-6.6.6',
          title: 'Custody Verification',
          description: 'Annual independent verification that the asset remains in institutional custody. Cross-reference with Proof of Reserve data. Confirm insurance renewal.',
          task_type: 'review',
          assigned_role: 'cto',
          estimated_duration: '1-2 days',
        },
      ],
    },
    {
      id: 'D-6.7',
      step_number: '6.7',
      title: 'Investor Accreditation Re-Verification',
      description: 'Establish and execute schedule for re-verifying accredited investor status, particularly critical for secondary transfers where buyer accreditation must be current at time of transfer.',
      task_type: 'action',
      assigned_role: 'compliance_officer',
      estimated_duration: 'Ongoing (annually per investor)',
      regulatory_basis: 'While Rule 506(c) requires verification at the time of sale, secondary transfers also require current accreditation verification. Stale accreditation data (e.g., investor\'s financial situation has changed) creates compliance risk.',
      regulatory_citations: [
        '17 CFR 230.506(c)(2)(ii)',
      ],
      regulation_types: ['sec'],
      required_documents: [],
      output_documents: ['accreditation_reverification'],
      asset_classes: 'all',
    },
    {
      id: 'D-6.8',
      step_number: '6.8',
      title: 'Exit / Liquidation',
      description: 'Upon asset sale, offering termination, or SPV wind-down: execute complete liquidation process including proceeds distribution, unit cancellation, tax reporting, entity dissolution, and regulatory notifications.',
      task_type: 'action',
      assigned_role: 'ceo',
      estimated_duration: '4-12 weeks',
      regulatory_basis: 'Orderly wind-down requires: distribution of proceeds according to the waterfall defined in the operating agreement, cancellation of all outstanding units, final tax reporting (K-1), dissolution of the SPV entity with the state, Form D termination filing with SEC, notification to ATS (if listed), and notification to all investors.',
      regulatory_citations: [
        'State LLC Dissolution Laws (varies)',
        'IRC Section 6031 (final K-1)',
        '17 CFR 230.503 (Form D termination)',
      ],
      regulation_types: ['sec', 'irs'],
      required_documents: [],
      output_documents: ['distribution_notice', 'final_k1', 'articles_of_dissolution', 'form_d_termination'],
      asset_classes: 'all',
      subtasks: [
        {
          id: 'D-6.8.1',
          title: 'Asset Sale / Disposition',
          description: 'Execute sale of the underlying asset through appropriate channels (auction, private sale, dealer network). Obtain fair market value. Deposit proceeds to SPV account.',
          task_type: 'action',
          assigned_role: 'chief_revenue_officer',
          estimated_duration: '2-8 weeks',
        },
        {
          id: 'D-6.8.2',
          title: 'Calculate Distribution Waterfall',
          description: 'Apply the distribution waterfall per the operating agreement: (1) return of capital, (2) preferred return, (3) promote/carried interest, (4) remaining proceeds pro rata. Account for all fees and expenses.',
          task_type: 'action',
          assigned_role: 'compliance_officer',
          estimated_duration: '2-5 days',
        },
        {
          id: 'D-6.8.3',
          title: 'Distribute Proceeds',
          description: 'Wire distribution amounts to each unit holder per the waterfall calculation. Obtain wire confirmations. Collect PleoChrome exit/redemption fee.',
          task_type: 'payment',
          assigned_role: 'ceo',
          estimated_duration: '3-7 days',
        },
        {
          id: 'D-6.8.4',
          title: 'Cancel All Units',
          description: 'Instruct transfer agent to cancel all outstanding units. Confirm cap table shows zero units outstanding.',
          task_type: 'action',
          assigned_role: 'cto',
          estimated_duration: '1-2 days',
        },
        {
          id: 'D-6.8.5',
          title: 'Final K-1 & Tax Reporting',
          description: 'Prepare and distribute final K-1 for each unit holder reflecting liquidation proceeds. Coordinate with SPV tax preparer.',
          task_type: 'action',
          assigned_role: 'compliance_officer',
          estimated_duration: '2-4 weeks',
          required_documents: ['final_k1'],
        },
        {
          id: 'D-6.8.6',
          title: 'File Form D Termination',
          description: 'File Form D amendment to indicate the offering is terminated. File via EDGAR.',
          task_type: 'filing',
          assigned_role: 'securities_counsel',
          estimated_duration: '1-2 days',
          required_documents: ['form_d_termination'],
        },
        {
          id: 'D-6.8.7',
          title: 'Dissolve SPV',
          description: 'File articles of dissolution with the secretary of state. Cancel EIN with IRS. Close bank accounts. Notify all counterparties (custodian, property manager, operator, insurers). De-list from ATS.',
          task_type: 'filing',
          assigned_role: 'securities_counsel',
          estimated_duration: '2-4 weeks',
          required_documents: ['articles_of_dissolution'],
        },
        {
          id: 'D-6.8.8',
          title: 'UCC-3 Termination (if applicable)',
          description: 'If a UCC-1 financing statement was filed: file UCC-3 termination statement within 20 days of demand from the debtor/holder after full satisfaction.',
          task_type: 'filing',
          assigned_role: 'securities_counsel',
          estimated_duration: '1-5 days',
        },
      ],
    },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPLETE WORKFLOW — All 6 Stages
// ═══════════════════════════════════════════════════════════════════════════════

export const RWA_OFFERING_WORKFLOW: WorkflowStage[] = [
  STAGE_1_LEAD,
  STAGE_2_INTAKE,
  STAGE_3_ASSET_MATURITY,
  STAGE_4_SECURITY,
  STAGE_5_VALUE_CREATION,
  STAGE_6_DISTRIBUTION,
];

// ═══════════════════════════════════════════════════════════════════════════════
// SUMMARY STATISTICS
// ═══════════════════════════════════════════════════════════════════════════════

export const WORKFLOW_SUMMARY = {
  total_stages: 6,
  total_tasks: RWA_OFFERING_WORKFLOW.reduce((sum, stage) => sum + stage.tasks.length, 0),
  total_subtasks: RWA_OFFERING_WORKFLOW.reduce(
    (sum, stage) => sum + stage.tasks.reduce(
      (tSum, task) => tSum + (task.subtasks?.length ?? 0), 0
    ), 0
  ),
  total_gates: RWA_OFFERING_WORKFLOW.reduce(
    (sum, stage) => sum + stage.tasks.filter(t => t.is_gate).length, 0
  ),
  asset_classes: ['gemstones', 'precious_metals', 'real_estate', 'mineral_rights'] as const,
  sec_exemptions_covered: ['Reg D 506(b)', 'Reg D 506(c)', 'Reg A+ Tier 2', 'Reg CF'],
  estimated_total_duration: '16-52 weeks (initial offering)',
  estimated_total_cost: {
    low: '$150,000',
    high: '$500,000+',
    note: 'Varies significantly by asset class, exemption type, and complexity. Excludes ongoing annual costs.',
  },
  regulatory_frameworks: [
    'Securities Act of 1933 (registration, exemptions)',
    'Securities Exchange Act of 1934 (broker-dealers, transfer agents, ATS)',
    'Regulation D (Rules 506(b), 506(c), Form D)',
    'Regulation A+ (Tier 2, Form 1-A)',
    'Regulation CF (Form C, funding portals)',
    'Regulation ATS (17 CFR 242.300-303)',
    'Regulation Best Interest (17 CFR 240.15l-1)',
    'FINRA Rules (5123, 2111, 2210)',
    'Bank Secrecy Act / FinCEN (KYC, AML, CDD)',
    'OFAC Sanctions (SDN List)',
    'USA PATRIOT Act Section 326 (CIP)',
    'UCC Article 9 (security interests)',
    'USPAP (appraisal standards)',
    'IRC (K-1 reporting, partnership taxation)',
    'State Blue Sky Laws (notice filings)',
    'NSMIA (federal preemption)',
    'CERCLA (environmental liability — real estate)',
    'Clean Diamond Trade Act (gemstones)',
    'LBMA Standards (precious metals)',
    'State mineral rights statutes',
    'BLM regulations (federal minerals)',
    'Dodd-Frank Section 1502 (conflict minerals)',
    'SOC 2 Trust Service Criteria (processing integrity, availability)',
  ],
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// DOCUMENT TYPE REGISTRY
// All document types referenced across the workflow
// ═══════════════════════════════════════════════════════════════════════════════

export const DOCUMENT_TYPES = {
  // Identity & KYC
  government_id: { label: 'Government-Issued Photo ID', stage: 'intake', required: true },
  proof_of_address: { label: 'Proof of Address', stage: 'intake', required: true },
  beneficial_ownership_form: { label: 'Beneficial Ownership Certification', stage: 'intake', required: true },
  source_of_wealth_declaration: { label: 'Source of Wealth Declaration', stage: 'intake', required: false },
  kyc_report: { label: 'KYC Verification Report', stage: 'intake', required: true },
  ofac_screening: { label: 'OFAC/SDN Screening Result', stage: 'intake', required: true },
  pep_screening: { label: 'PEP Screening Result', stage: 'intake', required: true },
  cdd_report: { label: 'Customer Due Diligence Report', stage: 'intake', required: true },

  // Legal
  nda: { label: 'Mutual Non-Disclosure Agreement', stage: 'lead', required: true },
  engagement_agreement: { label: 'Engagement Agreement', stage: 'intake', required: true },
  articles_of_organization: { label: 'Articles of Organization (SPV)', stage: 'security', required: true },
  operating_agreement: { label: 'Operating Agreement (SPV)', stage: 'security', required: true },
  ein_letter: { label: 'EIN Confirmation Letter', stage: 'security', required: true },
  bank_account_confirmation: { label: 'SPV Bank Account Confirmation', stage: 'security', required: true },
  escrow_agreement: { label: 'Escrow Agreement', stage: 'security', required: true },
  opinion_letter: { label: 'Securities Counsel Opinion Letter', stage: 'distribution', required: false },
  articles_of_dissolution: { label: 'Articles of Dissolution', stage: 'distribution', required: false },

  // Certification
  gia_report: { label: 'GIA Lab Report', stage: 'asset_maturity', required: false },
  ssef_report: { label: 'SSEF Origin Report', stage: 'asset_maturity', required: false },
  gubelin_report: { label: 'Gubelin Origin Report', stage: 'asset_maturity', required: false },
  assay_certificate: { label: 'Assay Certificate', stage: 'asset_maturity', required: false },
  lbma_certificate: { label: 'LBMA Good Delivery Certificate', stage: 'asset_maturity', required: false },
  pcgs_ngc_grade_certificate: { label: 'PCGS/NGC Grading Certificate', stage: 'asset_maturity', required: false },
  property_condition_assessment: { label: 'Property Condition Assessment (ASTM E2018)', stage: 'asset_maturity', required: false },
  phase_i_esa: { label: 'Phase I Environmental Site Assessment', stage: 'asset_maturity', required: false },
  phase_ii_esa: { label: 'Phase II Environmental Site Assessment', stage: 'asset_maturity', required: false },
  reserve_report: { label: 'Reserve Report (SPE/PRMS)', stage: 'asset_maturity', required: false },
  lab_certification_report: { label: 'Laboratory Certification Report', stage: 'asset_maturity', required: true },

  // Provenance
  provenance_chain_document: { label: 'Provenance Chain Document', stage: 'intake', required: true },
  title_opinion: { label: 'Title Opinion / Title Commitment', stage: 'intake', required: true },
  kimberley_process_certificate: { label: 'Kimberley Process Certificate', stage: 'intake', required: false },
  mineral_title_opinion: { label: 'Mineral Title Opinion', stage: 'intake', required: false },

  // Appraisal
  appraisal_report_1: { label: 'Appraisal Report #1', stage: 'asset_maturity', required: true },
  appraisal_report_2: { label: 'Appraisal Report #2', stage: 'asset_maturity', required: true },
  appraisal_report_3: { label: 'Appraisal Report #3', stage: 'asset_maturity', required: true },
  variance_analysis_memo: { label: 'Variance Analysis Memo', stage: 'asset_maturity', required: true },
  offering_value_determination: { label: 'Offering Value Determination', stage: 'asset_maturity', required: true },
  annual_reappraisal: { label: 'Annual Reappraisal Report', stage: 'distribution', required: true },
  appraiser_engagement_letters: { label: 'Appraiser Engagement Letters', stage: 'asset_maturity', required: true },

  // Custody & Insurance
  custody_agreement: { label: 'Custody Agreement', stage: 'asset_maturity', required: true },
  custody_receipt: { label: 'Custody Receipt', stage: 'asset_maturity', required: true },
  transport_manifest: { label: 'Transport Manifest', stage: 'asset_maturity', required: true },
  insurance_certificate: { label: 'Insurance Certificate', stage: 'asset_maturity', required: true },
  allocated_storage_agreement: { label: 'Allocated Storage Agreement', stage: 'asset_maturity', required: false },
  recorded_deed: { label: 'Recorded Deed', stage: 'asset_maturity', required: false },
  property_management_agreement: { label: 'Property Management Agreement', stage: 'asset_maturity', required: false },
  recorded_mineral_deed: { label: 'Recorded Mineral Deed', stage: 'asset_maturity', required: false },
  division_order: { label: 'Division Order', stage: 'asset_maturity', required: false },

  // Compliance
  bad_actor_screening_report: { label: 'Rule 506(d) Bad Actor Screening Report', stage: 'asset_maturity', required: true },
  background_check: { label: 'Background Check Report', stage: 'asset_maturity', required: true },
  por_configuration_document: { label: 'Proof of Reserve Configuration', stage: 'asset_maturity', required: true },
  annual_compliance_report: { label: 'Annual Compliance Audit Report', stage: 'distribution', required: true },

  // Securities
  ppm_draft: { label: 'PPM Draft', stage: 'value_creation', required: true },
  ppm_final: { label: 'Private Placement Memorandum (Final)', stage: 'value_creation', required: true },
  subscription_agreement: { label: 'Subscription Agreement', stage: 'value_creation', required: true },
  investor_questionnaire: { label: 'Investor Questionnaire', stage: 'value_creation', required: true },
  exemption_analysis_memo: { label: 'SEC Exemption Analysis Memo', stage: 'security', required: true },
  unit_structure_term_sheet: { label: 'Unit Structure Term Sheet', stage: 'security', required: true },
  marketing_materials_approved: { label: 'Approved Marketing Materials', stage: 'value_creation', required: true },
  accreditation_verification: { label: 'Accredited Investor Verification', stage: 'value_creation', required: true },
  accreditation_reverification: { label: 'Accreditation Re-Verification', stage: 'distribution', required: false },

  // Filings
  form_d_filing: { label: 'SEC Form D Filing', stage: 'value_creation', required: true },
  form_d_amendment: { label: 'Form D Annual Amendment', stage: 'distribution', required: true },
  form_d_termination: { label: 'Form D Termination', stage: 'distribution', required: false },
  edgar_confirmation: { label: 'EDGAR Filing Confirmation', stage: 'value_creation', required: true },
  blue_sky_filings: { label: 'Blue Sky State Filings', stage: 'value_creation', required: true },
  blue_sky_renewals: { label: 'Blue Sky Annual Renewals', stage: 'distribution', required: true },
  finra_5123_confirmation: { label: 'FINRA Rule 5123 Filing Confirmation', stage: 'distribution', required: true },

  // Agreements
  transfer_agent_agreement: { label: 'Transfer Agent Agreement', stage: 'security', required: true },
  broker_dealer_agreement: { label: 'Broker-Dealer Placement Agreement', stage: 'security', required: true },
  selling_agreement: { label: 'Selling Agreement', stage: 'security', required: false },
  ats_listing_agreement: { label: 'ATS Listing Agreement', stage: 'distribution', required: false },

  // Investor
  executed_subscription: { label: 'Executed Subscription Agreement', stage: 'value_creation', required: true },
  unit_certificate: { label: 'Unit Certificate / Confirmation', stage: 'value_creation', required: true },
  cap_table_update: { label: 'Cap Table Update Confirmation', stage: 'value_creation', required: true },
  investor_suitability_form: { label: 'Investor Suitability Form', stage: 'value_creation', required: true },
  transfer_instruction_letter: { label: 'Transfer Instruction Letter', stage: 'distribution', required: false },

  // Reporting
  quarterly_investor_report: { label: 'Quarterly Investor Report', stage: 'distribution', required: true },
  k1_tax_documents: { label: 'Schedule K-1 Tax Document', stage: 'distribution', required: true },
  final_k1: { label: 'Final Schedule K-1', stage: 'distribution', required: false },
  distribution_notice: { label: 'Liquidation Distribution Notice', stage: 'distribution', required: false },

  // Internal
  lead_intake_form: { label: 'Lead Intake Form', stage: 'lead', required: true },
  overview_deck: { label: 'PleoChrome Overview Deck', stage: 'lead', required: true },
  lead_qualification_memo: { label: 'Lead Qualification Memo', stage: 'lead', required: true },
  preliminary_valuation_memo: { label: 'Preliminary Valuation Memo', stage: 'intake', required: true },
  deal_committee_memo: { label: 'Deal Committee Decision Memo', stage: 'intake', required: true },
  certification_review_memo: { label: 'Certification Review Memo', stage: 'intake', required: true },
  insurance_verification_memo: { label: 'Insurance Verification Memo', stage: 'asset_maturity', required: true },
} as const;
