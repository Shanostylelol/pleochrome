/* ═══════════════════════════════════════════════════════
   PleoChrome — Shared Portal Data Layer
   Three-path value creation + partner stack definitions
   ═══════════════════════════════════════════════════════ */

// ── Value Path ───────────────────────────────

export type ValuePath = "fractional" | "tokenization" | "debt";

export const VALUE_PATHS: Record<
  ValuePath,
  { label: string; shortLabel: string; color: string; tagline: string; description: string }
> = {
  fractional: {
    label: "Fractional Securities",
    shortLabel: "Fractional",
    color: "#1B6B4A",
    tagline: "Divide and Distribute",
    description:
      "Split a high-value asset into affordable, SEC-compliant fractional shares. Lower minimums broaden the investor base while maintaining full regulatory compliance.",
  },
  tokenization: {
    label: "Tokenization",
    shortLabel: "Tokenization",
    color: "#1A8B7A",
    tagline: "Programmable Ownership",
    description:
      "Convert full asset value into ERC-3643 security tokens on Polygon. Compliance is embedded at the smart contract level — every transfer is validated before execution.",
  },
  debt: {
    label: "Debt Instruments",
    shortLabel: "Debt",
    color: "#1E3A6E",
    tagline: "Borrow Against Value",
    description:
      "Use verified, vaulted gemstones as collateral for asset-backed loans. The holder retains ownership while unlocking immediate capital.",
  },
};

export const PATH_ORDER: ValuePath[] = ["fractional", "tokenization", "debt"];

// ── Partner Stack ────────────────────────────

export type PartnerStack = "rialto-full" | "rialto-zoniqx" | "rialto-brickken" | "multi-partner";

export interface PartnerStackInfo {
  label: string;
  shortLabel: string;
  description: string;
  setupCost: number;
  annualCost: number;
  components: { role: string; provider: string; cost: string }[];
}

export const PARTNER_STACKS: Record<PartnerStack, PartnerStackInfo> = {
  "rialto-full": {
    label: "Option A: Rialto Full-Stack",
    shortLabel: "Rialto Full-Stack",
    description: "Single partner — BD, ATS, Transfer Agent, Tokenization, KYC/AML, White-Label",
    setupCost: 50_000,
    annualCost: 60_000,
    components: [
      { role: "Broker-Dealer", provider: "Rialto Markets", cost: "Included" },
      { role: "ATS (Secondary)", provider: "Rialto Markets", cost: "Included" },
      { role: "Transfer Agent", provider: "Rialto Transfer Services", cost: "Included" },
      { role: "Tokenization", provider: "Rialto (in-house)", cost: "Included" },
      { role: "KYC/AML", provider: "Rialto (integrated)", cost: "Included" },
      { role: "White-Label Portal", provider: "RiMES Platform", cost: "Included" },
    ],
  },
  "rialto-zoniqx": {
    label: "Option B: Rialto + Zoniqx",
    shortLabel: "Rialto + Zoniqx",
    description: "Rialto for BD/ATS/distribution + Zoniqx for tokenization (ERC-7518)",
    setupCost: 50_000,
    annualCost: 60_000, // Zoniqx pricing TBD — placeholder
    components: [
      { role: "Broker-Dealer", provider: "Rialto Markets", cost: "$50K setup + $5K/mo" },
      { role: "ATS (Secondary)", provider: "Rialto Markets", cost: "Included with Rialto" },
      { role: "Transfer Agent", provider: "Rialto Transfer Services", cost: "Included with Rialto" },
      { role: "Tokenization", provider: "Zoniqx (ERC-7518)", cost: "TBD — under NDA" },
      { role: "KYC/AML", provider: "Zoniqx zCompliance", cost: "Included with Zoniqx" },
    ],
  },
  "rialto-brickken": {
    label: "Option C: Rialto + Brickken",
    shortLabel: "Rialto + Brickken",
    description: "Rialto for BD/ATS/distribution + Brickken for tokenization (ERC-3643)",
    setupCost: 50_000,
    annualCost: 65_500, // $60K Rialto + ~$5.5K Brickken
    components: [
      { role: "Broker-Dealer", provider: "Rialto Markets", cost: "$50K setup + $5K/mo" },
      { role: "ATS (Secondary)", provider: "Rialto Markets", cost: "Included with Rialto" },
      { role: "Transfer Agent", provider: "Rialto Transfer Services", cost: "Included with Rialto" },
      { role: "Tokenization", provider: "Brickken (ERC-3643)", cost: "EUR 5,000/yr" },
      { role: "KYC/AML", provider: "Brickken (150 units incl.)", cost: "Included with Brickken" },
    ],
  },
  "multi-partner": {
    label: "Option D: Multi-Partner",
    shortLabel: "Multi-Partner",
    description: "Best-of-breed components — Dalmore BD + tZERO ATS + Vertalo TA + Brickken tokens",
    setupCost: 50_000,
    annualCost: 57_500,
    components: [
      { role: "Broker-Dealer", provider: "Dalmore Group", cost: "$25-55K setup + 1-3% success" },
      { role: "ATS (Secondary)", provider: "tZERO / North Capital", cost: "$10-50K setup + trade fees" },
      { role: "Transfer Agent", provider: "Vertalo", cost: "$10-25K/yr" },
      { role: "Tokenization", provider: "Brickken (ERC-3643)", cost: "EUR 5,000/yr" },
      { role: "KYC/AML", provider: "Sumsub / Brickken", cost: "$2-5K/yr" },
    ],
  },
};

// ── Workflow Types ────────────────────────────

export type Tag = "rw" | "dg" | "lg" | "pt" | "ai";

export interface WorkflowStep {
  num: string;
  title: string;
  detail: string;
  tags: Tag[];
  cost?: string;
  timeline?: string;
}

export interface WorkflowGate {
  id: string;
  name: string;
  desc: string;
}

export interface WorkflowPhase {
  id: number;
  title: string;
  subtitle: string;
  desc: string;
  color: string;
  glowColor: string;
  gemFills: [string, string, string, string];
  steps: WorkflowStep[];
  gates: WorkflowGate[];
}

// ── Shared Phases (1 & 2) — identical across all paths ──

export const SHARED_PHASES: WorkflowPhase[] = [
  {
    id: 1,
    title: "Acquisition",
    subtitle: "Building the Pipeline",
    desc: "Source high-value stones from vaults, dealer networks, and direct holders. Verify seller identity, negotiate terms, execute intake agreements.",
    color: "#1B6B4A",
    glowColor: "rgba(27,107,74,0.5)",
    gemFills: ["#1B6B4A", "#145A3A", "#0D4A2E", "#A3D9B5"],
    steps: [
      { num: "1.1", title: "Identify Target Asset", detail: "Source from vault inventories, dealer networks, Chris's pipeline. Confirm minimum value threshold ($1M+), stone type eligibility, and holder willingness.", tags: ["rw", "pt"] },
      { num: "1.2", title: "Holder Introduction & NDA", detail: "First contact. Execute mutual NDA. Share PleoChrome overview deck. Assess holder sophistication and expectations.", tags: ["rw", "lg"] },
      { num: "1.3", title: "KYC / KYB on Asset Holder", detail: "Run full identity verification on the individual or entity. OFAC/SDN screening. PEP check. Adverse media scan.", tags: ["rw", "lg", "ai"] },
      { num: "1.4", title: "Provenance Documentation", detail: "Collect complete chain of custody. Mine/origin → dealer → current holder. Verify Kimberley Process compliance if applicable. Flag any gaps.", tags: ["rw", "lg"] },
      { num: "1.5", title: "Existing Certification Review", detail: "Collect prior GIA/SSEF/Gübelin reports. Verify report numbers against lab databases. Assess if re-certification is needed.", tags: ["rw", "dg"] },
      { num: "1.6", title: "Preliminary Valuation Estimate", detail: "Desktop valuation using comparable auction results, dealer price lists, and prior appraisals. Sets expectations — not the offering value.", tags: ["rw", "ai"] },
      { num: "1.7", title: "Engagement Agreement", detail: "Execute formal engagement with asset holder. Define fee structure, timeline expectations, and mutual obligations.", tags: ["lg"] },
      { num: "1.8", title: "Internal Deal Committee Review", detail: "Founders review deal package. Go/No-Go decision based on provenance quality, valuation potential, and holder reliability.", tags: ["rw"] },
    ],
    gates: [
      { id: "G1", name: "SOURCE GATE", desc: "Asset holder verified. KYC passed. Provenance documented. Engagement signed." },
      { id: "G2", name: "EVIDENCE GATE", desc: "Prior certifications verified. Preliminary valuation within range. No red flags in provenance chain." },
    ],
  },
  {
    id: 2,
    title: "Preparation",
    subtitle: "Certification & Valuation",
    desc: "Independently verify every claim. GIA lab grading, three USPAP appraisals, institutional custody, and complete legal structuring.",
    color: "#1A8B7A",
    glowColor: "rgba(26,139,122,0.5)",
    gemFills: ["#1A8B7A", "#147A6A", "#0E695A", "#A3E0D4"],
    steps: [
      { num: "2.1", title: "GIA Lab Submission", detail: "Submit stone(s) to GIA laboratory for grading. Species identification, color grade, clarity, cut, carat weight, and origin determination.", tags: ["pt"], cost: "$5K-$20K", timeline: "2-4 weeks" },
      { num: "2.2", title: "SSEF / Gübelin Origin (if needed)", detail: "For high-value colored stones, obtain supplemental origin determination from SSEF or Gübelin. Strengthens provenance chain.", tags: ["pt"], cost: "$0-$5K", timeline: "2 weeks" },
      { num: "2.3", title: "Appraiser Panel Selection", detail: "Identify and vet three independent USPAP-compliant appraisers. Verify credentials (CGA/MGA), insurance, independence, and no conflicts.", tags: ["pt", "lg"], cost: "$1.5K", timeline: "2 weeks" },
      { num: "2.4", title: "Sequential 3-Appraisal Process", detail: "Each appraiser works independently with sealed prior values. Stone moves sequentially. Ensures no cross-contamination of valuations.", tags: ["pt", "rw"], cost: "$9K-$18K", timeline: "3-5 weeks" },
      { num: "2.5", title: "Variance Analysis", detail: "Compare all three appraisals. If variance exceeds 15-20%, trigger review. Offering value = average of two lowest.", tags: ["dg", "ai"], timeline: "2-3 days" },
      { num: "2.6", title: "Vault Selection & Transfer", detail: "Select institutional vault (Brink's or Malca-Amit). Arrange insured transport. Execute custody agreement with segregated storage.", tags: ["pt", "rw"], cost: "$50K-$100K/yr", timeline: "1-2 weeks" },
      { num: "2.7", title: "Insurance Verification", detail: "Verify vault's specie insurance covers full appraised value. Confirm transit insurance for the appraisal chain. Obtain coverage certificates.", tags: ["pt", "lg"], cost: "Incl. in vault" },
      { num: "2.8", title: "SPV Formation", detail: "Form dedicated Series LLC under PleoChrome Holdings. Obtain EIN. Open SPV bank account. Draft operating agreement.", tags: ["lg"], cost: "$8K-$10K", timeline: "1-2 weeks" },
      { num: "2.9", title: "PPM & Legal Documents", detail: "Securities counsel drafts Private Placement Memorandum, Subscription Agreement, and path-specific offering documents. Compliance review.", tags: ["lg"], cost: "$55K-$128K", timeline: "4-6 weeks" },
      { num: "2.10", title: "Chainlink Proof of Reserve Setup", detail: "Configure Chainlink PoR oracle feed connecting vault inventory to on-chain verification. Test attestation on testnet.", tags: ["dg", "pt"], cost: "$5K-$12K", timeline: "2-4 weeks" },
    ],
    gates: [
      { id: "G3", name: "VERIFICATION GATE", desc: "All lab reports received. Three appraisals complete. Variance within threshold. Offering value locked." },
      { id: "G4", name: "CUSTODY GATE", desc: "Stone in institutional vault. Insurance verified. Transport completed. Custody receipt issued." },
      { id: "G5", name: "LEGAL GATE", desc: "SPV formed. PPM finalized. All legal documents reviewed by counsel. Compliance sign-off obtained." },
    ],
  },
];

// ── Path-Specific Phases ─────────────────────

export function getPathPhases(path: ValuePath): WorkflowPhase[] {
  switch (path) {
    case "tokenization":
      return TOKENIZATION_PHASES;
    case "fractional":
      return FRACTIONAL_PHASES;
    case "debt":
      return DEBT_PHASES;
  }
}

const TOKENIZATION_PHASES: WorkflowPhase[] = [
  {
    id: 3,
    title: "Tokenization",
    subtitle: "Smart Contract Deployment",
    desc: "Deploy ERC-3643 security tokens on Polygon with compliance rules embedded at the protocol level. Oracle-gated minting ensures every token is backed.",
    color: "#1A8B7A",
    glowColor: "rgba(26,139,122,0.5)",
    gemFills: ["#1A8B7A", "#147A6A", "#0E695A", "#A3E0D4"],
    steps: [
      { num: "3.1", title: "Platform Configuration", detail: "Configure token parameters on the selected tokenization platform (Brickken or Zoniqx). Set symbol, total supply, compliance rules, jurisdiction restrictions.", tags: ["dg", "pt"], cost: "$2K-$5K", timeline: "1 week" },
      { num: "3.2", title: "ERC-3643 Compliance Rules", detail: "Define on-chain compliance: accredited investor whitelist, jurisdiction blocks, transfer restrictions, holding period enforcement (Rule 144).", tags: ["dg", "lg"], timeline: "1 week" },
      { num: "3.3", title: "Testnet Deployment & Testing", detail: "Deploy to Polygon testnet. Test minting, transfers, compliance rule enforcement, and PoR oracle integration. Run edge cases.", tags: ["dg"], timeline: "1-2 weeks" },
      { num: "3.4", title: "Smart Contract Audit", detail: "Independent security audit of all deployed contracts. Remediate any findings. Obtain clean audit report before mainnet.", tags: ["dg", "pt"], cost: "$15K-$37K", timeline: "2-4 weeks" },
      { num: "3.5", title: "Chainlink PoR Oracle Activation", detail: "Activate Proof of Reserve feed on mainnet. Verify oracle-gated minting blocks token creation if reserves are unconfirmed.", tags: ["dg", "pt"], timeline: "1-2 days" },
      { num: "3.6", title: "Mainnet Deployment", detail: "Deploy security token to Polygon mainnet. Final configuration review by counsel. Token contract is live and immutable.", tags: ["dg", "lg"], timeline: "1 day" },
    ],
    gates: [
      { id: "G6", name: "PLATFORM GATE", desc: "Smart contract audited. PoR verified. Token deployed on mainnet. Parameters match legal documents." },
    ],
  },
  {
    id: 4,
    title: "Distribution",
    subtitle: "Investor Onboarding",
    desc: "Onboard accredited investors through KYC, accreditation verification, and subscription processing. Tokens minted only upon confirmed and funded subscriptions.",
    color: "#C47A1A",
    glowColor: "rgba(196,122,26,0.5)",
    gemFills: ["#C47A1A", "#A66815", "#8B5610", "#F0D9A8"],
    steps: [
      { num: "4.1", title: "Form D Filing", detail: "File Form D with SEC via EDGAR within 15 days of first sale. Annual amendments required if offering continues.", tags: ["lg"], timeline: "1-2 days" },
      { num: "4.2", title: "Blue Sky State Filings", detail: "File state securities notices in applicable jurisdictions. New York requires pre-filing before first sale.", tags: ["lg"], cost: "$1.5K-$10K", timeline: "1-2 weeks" },
      { num: "4.3", title: "Investor Marketing (506c)", detail: "General solicitation permitted under Reg D 506(c). Targeted outreach to accredited investors via networks, events, and digital campaigns.", tags: ["rw"], cost: "$5K-$30K" },
      { num: "4.4", title: "Investor KYC & Accreditation", detail: "Each investor completes KYC, sanctions screening, and accredited investor verification. Self-certification permitted at $200K+ minimums.", tags: ["dg", "lg", "ai"] },
      { num: "4.5", title: "Subscription Processing", detail: "Investor signs subscription agreement, funds wire. Compliance review on each subscription. PleoChrome success fee collected.", tags: ["lg", "dg"] },
      { num: "4.6", title: "Token Minting", detail: "Tokens minted to investor's whitelisted wallet only after subscription confirmed and funded. Oracle verifies reserves before mint.", tags: ["dg"] },
      { num: "4.7", title: "Cap Table Update", detail: "Transfer agent records updated. On-chain and off-chain cap tables reconciled. Investor confirmation sent.", tags: ["dg"] },
      { num: "4.8", title: "Ongoing Reporting", detail: "Quarterly NAV updates. Annual re-appraisal. K-1 tax distribution. Compliance monitoring. Form D amendments.", tags: ["dg", "lg", "ai"] },
      { num: "4.9", title: "Secondary Transfer Facilitation", detail: "Compliant peer-to-peer transfers via ATS. ERC-3643 compliance checks enforced automatically on every trade.", tags: ["dg", "lg"] },
      { num: "4.10", title: "Redemption / Exit", detail: "Upon asset sale or offering close: token burn, proceeds distribution, SPV dissolution, final K-1, UCC termination if applicable.", tags: ["lg", "dg", "rw"] },
    ],
    gates: [
      { id: "G7", name: "OFFERING GATE", desc: "Form D filed. Blue sky notices submitted. Investor pipeline operational. First subscription processed." },
    ],
  },
];

const FRACTIONAL_PHASES: WorkflowPhase[] = [
  {
    id: 3,
    title: "Securities Structuring",
    subtitle: "Unit Division & Registration",
    desc: "Structure the offering as fractional LLC membership units. Engage transfer agent and broker-dealer. File with SEC under chosen exemption.",
    color: "#1B6B4A",
    glowColor: "rgba(27,107,74,0.5)",
    gemFills: ["#1B6B4A", "#145A3A", "#0D4A2E", "#A3D9B5"],
    steps: [
      { num: "3.1", title: "Transfer Agent Engagement", detail: "Select and engage SEC-registered transfer agent (Vertalo, Rialto Transfer Services, or equivalent). Configure cap table for fractional units.", tags: ["pt", "lg"], cost: "$5K-$20K", timeline: "2-4 weeks" },
      { num: "3.2", title: "BD / Placement Agent Engagement", detail: "Engage broker-dealer of record for primary distribution (Rialto Markets, Dalmore Group, or equivalent). Define placement terms.", tags: ["pt", "lg"], cost: "$10K-$25K setup", timeline: "2-6 weeks" },
      { num: "3.3", title: "Unit Structure Configuration", detail: "Define fractional unit parameters: total units, minimum investment, unit price, investor rights, voting provisions, distribution waterfall.", tags: ["lg", "dg"], timeline: "1-2 weeks" },
      { num: "3.4", title: "Regulatory Exemption Selection", detail: "Determine optimal SEC exemption: Reg D 506(c) (accredited only, unlimited raise) vs Reg A+ (all investors, up to $75M) vs Reg CF (all investors, up to $5M).", tags: ["lg"], timeline: "1 week" },
      { num: "3.5", title: "Form D / Form 1-A Preparation", detail: "Prepare SEC filing based on chosen exemption. Form D for Reg D (filed within 15 days of first sale) or Form 1-A for Reg A+ (SEC qualification required).", tags: ["lg"], timeline: "1-4 weeks" },
    ],
    gates: [
      { id: "G6F", name: "SECURITIES GATE", desc: "Transfer agent engaged. BD engaged. Units structured. SEC filing prepared. Compliance review complete." },
    ],
  },
  {
    id: 4,
    title: "Distribution & Management",
    subtitle: "Investor Access & Reporting",
    desc: "Onboard investors, process subscriptions, issue fractional units, and manage ongoing reporting obligations throughout the asset lifecycle.",
    color: "#C47A1A",
    glowColor: "rgba(196,122,26,0.5)",
    gemFills: ["#C47A1A", "#A66815", "#8B5610", "#F0D9A8"],
    steps: [
      { num: "4.1", title: "Investor Outreach", detail: "Targeted marketing to qualified investors. General solicitation permitted under 506(c). Content marketing, events, referral networks.", tags: ["rw", "pt"], cost: "$5K-$30K" },
      { num: "4.2", title: "Investor KYC & Accreditation", detail: "Each investor completes identity verification, sanctions screening, and accreditation check (self-certification at $200K+ or third-party letter).", tags: ["dg", "lg", "ai"] },
      { num: "4.3", title: "Subscription & Unit Issuance", detail: "Investor signs subscription agreement, wires funds. Transfer agent issues fractional units. Cap table updated.", tags: ["lg", "dg"] },
      { num: "4.4", title: "Cap Table Management", detail: "Maintain official shareholder registry. Track all unit holders, transfer restrictions, and compliance status.", tags: ["dg"] },
      { num: "4.5", title: "Quarterly Reporting", detail: "Quarterly NAV updates based on market conditions. Investor communications. Compliance monitoring. Custody verification.", tags: ["dg", "ai"] },
      { num: "4.6", title: "Annual Obligations", detail: "Annual independent re-appraisal. K-1 tax distribution by March 15. Form D amendment. Blue sky renewals. Independent compliance audit.", tags: ["lg", "dg"] },
      { num: "4.7", title: "Secondary Transfer Facilitation", detail: "If ATS available: facilitate compliant unit transfers between investors. Otherwise: handle transfer requests manually through transfer agent.", tags: ["dg", "lg"] },
      { num: "4.8", title: "Exit / Liquidation", detail: "Upon asset sale: distribute proceeds per waterfall. File final K-1. Dissolve SPV. Cancel all units. File Form D termination.", tags: ["lg", "rw", "dg"] },
    ],
    gates: [
      { id: "G7F", name: "OFFERING GATE", desc: "SEC filing submitted. Investor pipeline operational. First subscription processed. Cap table active." },
    ],
  },
];

const DEBT_PHASES: WorkflowPhase[] = [
  {
    id: 3,
    title: "Loan Structuring",
    subtitle: "Collateral & Documentation",
    desc: "Perfect the security interest via UCC Article 9. Structure loan terms, engage lenders, and execute collateral custody agreements.",
    color: "#1E3A6E",
    glowColor: "rgba(30,58,110,0.5)",
    gemFills: ["#1E3A6E", "#162F5A", "#0E2446", "#A3BFE0"],
    steps: [
      { num: "3.1", title: "UCC-1 Financing Statement", detail: "File UCC-1 with secretary of state to perfect security interest in the gemstone collateral under Article 9. Dual approach: filing + possession.", tags: ["lg"], cost: "$5-$50/state", timeline: "1-2 weeks" },
      { num: "3.2", title: "Lender Identification", detail: "Source lending capital: institutional lenders, alternative credit funds, family offices, or syndication partners. Match to borrower's needs.", tags: ["pt", "rw"], timeline: "2-4 weeks" },
      { num: "3.3", title: "Loan Terms Structuring", detail: "Define rate (12-18% APR), LTV (50-70%), term (12-36 months), payment schedule, covenants, and default triggers. Draft security agreement and promissory note.", tags: ["lg", "dg"], cost: "$5K-$10K", timeline: "1-2 weeks" },
      { num: "3.4", title: "Collateral Custody Agreement", detail: "Execute tripartite agreement between borrower, lender, and vault. Define release conditions, reappraisal triggers, and default procedures.", tags: ["lg", "pt"], cost: "$3K", timeline: "1 week" },
      { num: "3.5", title: "Insurance & Coverage Verification", detail: "Verify specie insurance covers collateral value for loan term. Confirm lender is named as loss payee. Obtain coverage certificates.", tags: ["lg", "pt"] },
    ],
    gates: [
      { id: "G6D", name: "COLLATERAL GATE", desc: "UCC-1 perfected. Lender engaged. Terms set. Custody agreement executed. Insurance verified." },
    ],
  },
  {
    id: 4,
    title: "Capital & Servicing",
    subtitle: "Deployment Through Maturity",
    desc: "Originate the loan, deploy capital, manage ongoing servicing, monitor collateral, and handle maturity or default scenarios.",
    color: "#4A7BC7",
    glowColor: "rgba(74,123,199,0.5)",
    gemFills: ["#4A7BC7", "#3A6BB7", "#2A5BA7", "#C0D4F0"],
    steps: [
      { num: "4.1", title: "Loan Origination & Closing", detail: "Execute promissory note, security agreement, and guaranty. Disburse funds to borrower. Activate loan servicing. PleoChrome origination fee collected.", tags: ["lg", "dg", "rw"], cost: "2% origination" },
      { num: "4.2", title: "Participation Notes (if applicable)", detail: "If offering loan participations to investors: structure as Reg D 506(c) securities. Draft note PPM, file Form D, onboard note investors.", tags: ["lg", "dg"], cost: "$50K-$80K" },
      { num: "4.3", title: "Payment Servicing", detail: "Monthly payment collection, escrow management, and distribution to lender(s). PleoChrome earns servicing fee (0.75%/year of outstanding balance).", tags: ["dg", "ai"] },
      { num: "4.4", title: "Collateral Monitoring", detail: "Quarterly PoR verification. Annual reappraisal of collateral value. If LTV exceeds covenant threshold, trigger margin call or additional collateral requirement.", tags: ["dg", "pt", "ai"], cost: "$2K/yr reappraisal" },
      { num: "4.5", title: "Default & Workout Procedures", detail: "If borrower defaults (30+ days late): issue notice, 30-day cure period, then foreclosure. UCC 9-610 commercially reasonable disposition of collateral.", tags: ["lg", "rw"] },
      { num: "4.6", title: "Loan Maturity & Collateral Release", detail: "Upon payoff: confirm full principal + interest received. Release collateral from vault. File UCC-3 termination statement. Close loan file.", tags: ["lg", "rw", "dg"] },
    ],
    gates: [
      { id: "G7D", name: "SERVICING GATE", desc: "Loan originated. Payments current. Collateral monitored. Servicing operational." },
    ],
  },
];

// ── Revenue Model ────────────────────────────

export interface RevenueModel {
  setupFeeRate: number;
  successFeeRate: number;
  adminFeeRate: number;
  additionalFees: { label: string; rate: string; timing: string }[];
}

export const REVENUE_MODELS: Record<ValuePath, RevenueModel> = {
  fractional: {
    setupFeeRate: 0.02,
    successFeeRate: 0.015,
    adminFeeRate: 0.0075,
    additionalFees: [
      { label: "Exit / Redemption Fee", rate: "1.0%", timing: "At exit" },
    ],
  },
  tokenization: {
    setupFeeRate: 0.02,
    successFeeRate: 0.015,
    adminFeeRate: 0.0075,
    additionalFees: [
      { label: "Secondary Trading Fee", rate: "0.25% per transfer", timing: "Per secondary trade" },
      { label: "Technology Licensing", rate: "TBD", timing: "Year 3+" },
    ],
  },
  debt: {
    setupFeeRate: 0.02,
    successFeeRate: 0.015,
    adminFeeRate: 0.0075,
    additionalFees: [
      { label: "Origination Fee", rate: "2% of loan value", timing: "At loan closing" },
      { label: "Servicing Fee", rate: "0.75%/yr of balance", timing: "Monthly" },
      { label: "Interest Spread", rate: "3% (if co-lending)", timing: "Monthly" },
    ],
  },
};

// ── Cost Lines Per Path ──────────────────────

export interface CostLine {
  id: string;
  label: string;
  narrative: string;
  phase: string;
  paidBy: "pleochrome" | "asset-holder" | "proceeds";
  defaultAmount: number;
  scaleFactor?: number;
  fixed?: boolean;
  min: number;
  max: number;
}

export function getPathCostLines(path: ValuePath): CostLine[] {
  switch (path) {
    case "tokenization":
      return TOKENIZATION_COSTS;
    case "fractional":
      return FRACTIONAL_COSTS;
    case "debt":
      return DEBT_COSTS;
  }
}

const TOKENIZATION_COSTS: CostLine[] = [
  { id: "t-platform", label: "Tokenization Platform (Year 1)", narrative: "Evaluating Brickken (EUR 5K/yr Advanced) and Zoniqx (pricing TBD). Rialto full-stack includes tokenization.", phase: "Tokenization", paidBy: "pleochrome", defaultAmount: 5500, fixed: true, min: 5000, max: 60000 },
  { id: "t-config", label: "Token Configuration & Review", narrative: "Counsel reviews token parameters against legal documents. Configuration of compliance rules.", phase: "Tokenization", paidBy: "pleochrome", defaultAmount: 3500, fixed: true, min: 2000, max: 5000 },
  { id: "t-audit", label: "Smart Contract Audit", narrative: "Independent security audit of ERC-3643 contracts before mainnet deployment.", phase: "Tokenization", paidBy: "pleochrome", defaultAmount: 25000, fixed: true, min: 15000, max: 50000 },
  { id: "t-dev", label: "Development & Testing", narrative: "Testnet deployment, PoR integration testing, edge case validation. Platform-agnostic — works with any provider.", phase: "Tokenization", paidBy: "pleochrome", defaultAmount: 5000, fixed: true, min: 2000, max: 15000 },
  { id: "t-gas", label: "Gas / Deployment Fees", narrative: "Polygon mainnet deployment costs. Minimal due to Polygon's low gas fees.", phase: "Tokenization", paidBy: "pleochrome", defaultAmount: 100, fixed: true, min: 50, max: 500 },
  { id: "t-bluesky", label: "Blue Sky State Filings", narrative: "State securities notice filings. New York requires pre-filing before first sale.", phase: "Distribution", paidBy: "pleochrome", defaultAmount: 1500, fixed: true, min: 500, max: 10000 },
];

const FRACTIONAL_COSTS: CostLine[] = [
  { id: "f-ta", label: "Transfer Agent (Year 1)", narrative: "SEC-registered transfer agent for cap table management. Options: Vertalo, Rialto Transfer Services, or traditional.", phase: "Securities", paidBy: "pleochrome", defaultAmount: 10000, fixed: true, min: 5000, max: 25000 },
  { id: "f-bd", label: "BD / Placement Agent Setup", narrative: "Broker-dealer of record for primary distribution. Rialto Markets ($50K+$5K/mo) or Dalmore Group ($25-55K setup).", phase: "Securities", paidBy: "pleochrome", defaultAmount: 15000, fixed: true, min: 5000, max: 55000 },
  { id: "f-unit", label: "Unit Structuring Legal", narrative: "Legal structuring of fractional LLC membership units: rights, restrictions, distribution waterfall.", phase: "Securities", paidBy: "pleochrome", defaultAmount: 5000, fixed: true, min: 3000, max: 10000 },
  { id: "f-bluesky", label: "Blue Sky State Filings", narrative: "State securities notice filings for applicable jurisdictions.", phase: "Distribution", paidBy: "pleochrome", defaultAmount: 1500, fixed: true, min: 500, max: 10000 },
  { id: "f-captable", label: "Cap Table Software (Year 1)", narrative: "Ongoing cap table management and investor registry platform.", phase: "Distribution", paidBy: "pleochrome", defaultAmount: 2000, fixed: true, min: 1000, max: 5000 },
];

const DEBT_COSTS: CostLine[] = [
  { id: "d-ucc", label: "UCC-1 Filing", narrative: "File UCC-1 financing statement to perfect security interest under Article 9. Filed with secretary of state.", phase: "Loan Structuring", paidBy: "pleochrome", defaultAmount: 500, fixed: true, min: 50, max: 2000 },
  { id: "d-lender", label: "Lender Engagement", narrative: "Source and engage lending partners: institutional lenders, alternative credit funds, or syndication partners.", phase: "Loan Structuring", paidBy: "pleochrome", defaultAmount: 2500, fixed: true, min: 1000, max: 5000 },
  { id: "d-loandocs", label: "Loan Documentation Legal", narrative: "Draft security agreement, promissory note, guaranty, and collateral custody agreement.", phase: "Loan Structuring", paidBy: "pleochrome", defaultAmount: 7500, fixed: true, min: 5000, max: 15000 },
  { id: "d-collateral", label: "Collateral Custody Agreement", narrative: "Tripartite agreement between borrower, lender, and vault defining release conditions and default procedures.", phase: "Loan Structuring", paidBy: "pleochrome", defaultAmount: 3000, fixed: true, min: 2000, max: 5000 },
  { id: "d-servicing", label: "Loan Servicing Setup", narrative: "Configure payment processing, escrow management, and reporting infrastructure.", phase: "Servicing", paidBy: "pleochrome", defaultAmount: 2500, fixed: true, min: 1500, max: 5000 },
  { id: "d-monitoring", label: "Collateral Monitoring (Year 1)", narrative: "Quarterly PoR verification and annual reappraisal coordination for collateral value monitoring.", phase: "Servicing", paidBy: "pleochrome", defaultAmount: 3000, fixed: true, min: 1200, max: 5000 },
];

// ── Architecture States ──────────────────────

export interface AssetState {
  id: string;
  label: string;
  phase: string;
  color: string;
  desc: string;
  gate?: string;
}

export const SHARED_STATES: AssetState[] = [
  { id: "PROPOSED", label: "Proposed", phase: "Acquisition", color: "#1B6B4A", desc: "Asset submitted for evaluation" },
  { id: "SCREENING", label: "Screening", phase: "Acquisition", color: "#1B6B4A", desc: "KYC/KYB and provenance review" },
  { id: "INTAKE_COMPLETE", label: "Intake Complete", phase: "Acquisition", color: "#1B6B4A", desc: "All intake requirements met", gate: "G1" },
  { id: "EVIDENCE_REVIEW", label: "Evidence Review", phase: "Acquisition", color: "#1B6B4A", desc: "Certifications and provenance verified", gate: "G2" },
  { id: "GIA_SUBMITTED", label: "GIA Submitted", phase: "Preparation", color: "#1A8B7A", desc: "Submitted to GIA laboratory" },
  { id: "GIA_COMPLETE", label: "GIA Complete", phase: "Preparation", color: "#1A8B7A", desc: "Lab reports received" },
  { id: "APPRAISAL_1", label: "Appraisal 1", phase: "Preparation", color: "#1A8B7A", desc: "First appraiser engaged" },
  { id: "APPRAISAL_2", label: "Appraisal 2", phase: "Preparation", color: "#1A8B7A", desc: "Second appraiser engaged" },
  { id: "APPRAISAL_3", label: "Appraisal 3", phase: "Preparation", color: "#1A8B7A", desc: "Third appraiser engaged" },
  { id: "VALUATION_LOCKED", label: "Valuation Locked", phase: "Preparation", color: "#1A8B7A", desc: "Offering value determined", gate: "G3" },
  { id: "IN_CUSTODY", label: "In Custody", phase: "Preparation", color: "#1A8B7A", desc: "Stone in institutional vault", gate: "G4" },
  { id: "SPV_FORMED", label: "SPV Formed", phase: "Preparation", color: "#1A8B7A", desc: "Series LLC created" },
  { id: "LEGAL_COMPLETE", label: "Legal Complete", phase: "Preparation", color: "#1A8B7A", desc: "All legal documents finalized", gate: "G5" },
];

export const BRANCH_LABEL = "PATH SELECTION — Choose value creation path";

export function getPathStates(path: ValuePath): AssetState[] {
  switch (path) {
    case "tokenization":
      return [
        { id: "MINT_AUTH", label: "Mint Authorized", phase: "Tokenization", color: "#1A8B7A", desc: "Token deployment approved" },
        { id: "MINTED", label: "Minted", phase: "Tokenization", color: "#1A8B7A", desc: "Security tokens deployed on mainnet", gate: "G6" },
        { id: "OFFERING_OPEN", label: "Offering Open", phase: "Distribution", color: "#C47A1A", desc: "Accepting investor subscriptions", gate: "G7" },
        { id: "OFFERING_CLOSED", label: "Offering Closed", phase: "Distribution", color: "#C47A1A", desc: "Subscription period ended" },
        { id: "ACTIVE_MGMT", label: "Active Management", phase: "Distribution", color: "#C47A1A", desc: "Ongoing reporting and compliance" },
      ];
    case "fractional":
      return [
        { id: "UNITS_CONFIGURED", label: "Units Configured", phase: "Securities", color: "#1B6B4A", desc: "Fractional unit structure defined" },
        { id: "BD_ENGAGED", label: "BD Engaged", phase: "Securities", color: "#1B6B4A", desc: "Broker-dealer of record confirmed" },
        { id: "SEC_FILED", label: "SEC Filed", phase: "Securities", color: "#1B6B4A", desc: "Form D or Form 1-A filed", gate: "G6F" },
        { id: "OFFERING_OPEN_F", label: "Offering Open", phase: "Distribution", color: "#C47A1A", desc: "Accepting investor subscriptions", gate: "G7F" },
        { id: "ACTIVE_MGMT_F", label: "Active Management", phase: "Distribution", color: "#C47A1A", desc: "Ongoing reporting and compliance" },
      ];
    case "debt":
      return [
        { id: "COLLATERAL_PERFECTED", label: "Collateral Perfected", phase: "Loan Structuring", color: "#1E3A6E", desc: "UCC-1 filed, security interest perfected" },
        { id: "LOAN_STRUCTURED", label: "Loan Structured", phase: "Loan Structuring", color: "#1E3A6E", desc: "Terms, rate, and maturity defined" },
        { id: "LOAN_ORIGINATED", label: "Loan Originated", phase: "Servicing", color: "#4A7BC7", desc: "Funds disbursed, loan active", gate: "G6D" },
        { id: "LOAN_ACTIVE", label: "Loan Active", phase: "Servicing", color: "#4A7BC7", desc: "Payments being collected and monitored", gate: "G7D" },
        { id: "LOAN_MATURED", label: "Loan Matured", phase: "Servicing", color: "#4A7BC7", desc: "Payoff confirmed, collateral released" },
      ];
  }
}

// ── Tag Config ───────────────────────────────

export const TAG_CONFIG: Record<Tag, { label: string; color: string; bg: string }> = {
  rw: { label: "Real World", color: "#1B6B4A", bg: "rgba(27,107,74,0.15)" },
  dg: { label: "Digital", color: "#1A8B7A", bg: "rgba(26,139,122,0.15)" },
  lg: { label: "Legal", color: "#C47A1A", bg: "rgba(196,122,26,0.15)" },
  pt: { label: "Partner", color: "#5B2D8E", bg: "rgba(91,45,142,0.15)" },
  ai: { label: "AI", color: "#A61D3A", bg: "rgba(166,29,58,0.15)" },
};
