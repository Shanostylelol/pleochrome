"use client";

import { useState } from "react";
import Image from "next/image";

/* ═══════════════════════════════════════════════════════
   PleoChrome — Master Workflow Map
   Password-protected, unlinked page
   /workflow-mapping
   ═══════════════════════════════════════════════════════ */

const PASSCODE = "pleo123";

// ── Data ──────────────────────────────────────

type Tag = "rw" | "dg" | "lg" | "pt" | "ai";

interface Step {
  num: string;
  title: string;
  detail: string;
  tags: Tag[];
}

interface Gate {
  id: string;
  name: string;
  desc: string;
}

interface Phase {
  id: number;
  title: string;
  subtitle: string;
  desc: string;
  color: string;
  glowColor: string;
  gemFills: [string, string, string, string];
  steps: Step[];
  gates: Gate[];
}

const phases: Phase[] = [
  {
    id: 1,
    title: "Acquisition",
    subtitle: "Building the Pipeline",
    desc: "Source high-value stones from vaults, dealer networks, and direct holders. Verify seller identity, negotiate terms, execute intake agreements.",
    color: "#1B6B4A",
    glowColor: "rgba(27,107,74,0.5)",
    gemFills: ["#25905F", "#1B6B4A", "#167040", "#134F32"],
    steps: [
      { num: "1.1", title: "Source Identification", detail: "Three channels: (A) Already-vaulted stones at Brink\u2019s/Malca-Amit with existing GIA reports. (B) Dealer networks, auction houses (Christie\u2019s, Sotheby\u2019s), and mining consortiums. (C) Direct holder submissions via PleoChrome intake portal. AI can score and rank pipeline opportunities by documentation completeness and estimated value.", tags: ["rw", "dg", "ai"] },
      { num: "1.2", title: "Initial Screening", detail: "Quick-kill assessment: minimum value threshold ($100K+), initial provenance documentation, non-sanctioned jurisdiction, stone type suitability (emeralds, rubies, sapphires, high-value diamonds). Reject early, save everyone time.", tags: ["dg", "ai"] },
      { num: "1.3", title: "Asset Holder Intake", detail: "Full questionnaire: personal/entity identity, stone specifications (type, carat, color, origin claim), acquisition history, provenance chain, existing certifications, high-resolution photos (min 4 angles + scale), and seller representations (clear title, no liens, not previously tokenized).", tags: ["dg", "rw"] },
      { num: "1.4", title: "KYC / KYB on Seller", detail: "Government ID + liveness check (individuals), formation docs + UBO identification for >25% owners (entities). Source of wealth verification. Background screening via Sumsub or ComPilot. Enhanced due diligence for PEPs and high-risk jurisdictions.", tags: ["pt", "dg", "ai"] },
      { num: "1.5", title: "Sanctions & PEP Screening", detail: "OFAC SDN, EU/UN consolidated sanctions, PEP databases, adverse media. Blockchain wallet screening via Chainalysis if crypto-connected. Any hit = escalate to compliance officer. Document all results.", tags: ["pt", "ai"] },
      { num: "1.6", title: "Provenance & Title Review", detail: "Complete chain of custody from mine to current holder. Clear legal title \u2014 no liens, encumbrances, or competing claims. Not previously tokenized/pledged. OECD Due Diligence Guidance and Kimberley Process compliance. AI can parse and cross-reference provenance documents.", tags: ["lg", "rw", "ai"] },
      { num: "1.7", title: "Price Negotiation", detail: "Tokenization terms: PleoChrome fee structure (setup fee + success fee 0.5\u20133% + annual admin), pass-through costs (appraisals, vault, insurance, legal \u2014 paid by asset holder), expected offering value range. All costs transparent.", tags: ["rw"] },
      { num: "1.8", title: "Intake Agreement", detail: "Master engagement agreement: obligations, fee structure, timeline, conditions for proceeding through all 7 gates, termination provisions, confidentiality. Signed electronically via WORM-compliant e-signature.", tags: ["lg", "rw"] },
    ],
    gates: [
      { id: "G1", name: "INTAKE GATE", desc: "Seller verified, sanctions clear, provenance reviewed, title confirmed, agreement executed" },
      { id: "G2", name: "EVIDENCE GATE", desc: "Legal transferability, export/import compliance, conflict origin screening complete" },
    ],
  },
  {
    id: 2,
    title: "Preparation",
    subtitle: "Building the Evidence Layer",
    desc: "Transform a raw stone into a fully documented, independently valued, institutionally vaulted, and legally structured asset. Every claim verified by independent specialists.",
    color: "#1A8B7A",
    glowColor: "rgba(26,139,122,0.5)",
    gemFills: ["#22B09B", "#1A8B7A", "#158A6E", "#116B58"],
    steps: [
      { num: "2.1", title: "GIA Lab Submission", detail: "Ship to GIA (or SSEF/Gub\u00e9lin for colored stones). Cut, color, clarity, carat grading. Origin determination via spectroscopic analysis. Treatment disclosure. 2\u20133 week turnaround. GIA report is the industry gold standard.", tags: ["pt", "rw"] },
      { num: "2.2", title: "Report Verification", detail: "Verify GIA report authenticity via GIA Report Check (report number + carat weight). Confirm stone identity matches documentation. Cross-reference pre-existing reports. AI flags discrepancies between seller claims and lab results.", tags: ["dg", "ai"] },
      { num: "2.3", title: "3x Independent Appraisals", detail: "Sequential shipping to 3 CGA/MGA certified appraisers. Zero affiliation with seller, PleoChrome, or each other. USPAP-compliant written reports. 5\u201310 business days each. Insured inland marine transit. Cost: $100\u2013$5,000+ per appraisal. Total: 3\u20134 weeks.", tags: ["pt", "rw"] },
      { num: "2.4", title: "Valuation Reconciliation", detail: "Variance analysis across 3 appraisals. If spread >15\u201320%, flag for 4th appraisal or reject. The 3-Appraisal Rule: average the two lowest = structurally conservative offering baseline. Compare to market comparables (auction records, dealer prices). AI automates comparable analysis.", tags: ["dg", "ai"] },
      { num: "2.5", title: "Vault Intake & Custody", detail: "Transport to Brink\u2019s or Malca-Amit via insured carrier. Vault verifies against GIA report, photographs, assigns segregated storage (not commingled). Issues Vault Receipt. Malca-Amit offers Free Trade Zone (duty-free). Activates API reporting feed.", tags: ["pt", "rw"] },
      { num: "2.6", title: "Insurance Verification", detail: "Vault insurance covers this asset at appraised value. No gaps between transport, storage, and movement. Lloyd\u2019s of London is the gold standard. Document policy numbers, coverage limits, sublimits, and expiration dates.", tags: ["rw", "dg"] },
      { num: "2.7", title: "Chainlink PoR Setup", detail: "Custom external adapter \u2192 vault inventory API. Deploy Proof of Reserve feed contract on Polygon. Multiple Chainlink nodes verify and aggregate. Feed reports: stones held, appraised value, custody status. Smart contracts query before any mint. Reference: Serenity Labs (Feb 2026) built similar for precious metals.", tags: ["pt", "dg"] },
      { num: "2.8", title: "SPV Formation", detail: "Create new Series under master Series LLC entity. Each series is bankruptcy-remote. Operating Agreement defines token holder rights, distribution waterfall, governance, transfer restrictions. Obtain EIN. Open SPV bank account. Structure TBD: Wyoming or Delaware Series LLC.", tags: ["lg"] },
      { num: "2.9", title: "Legal Document Suite", detail: "Securities attorney drafts: PPM (risk factors, use of proceeds, management, tax), Subscription Agreement (representations, accreditation, payment), Token Purchase Agreement (links on-chain token to SPV legal rights). Compliance review. $15K\u2013$50K per offering. Templates reduce cost for subsequent stones.", tags: ["lg"] },
      { num: "2.10", title: "Photo & Media", detail: "Professional photography: 8+ angles, macro detail, scale reference, 360 video. Independent weight verification on calibrated scale. Marketing-ready assets for investor materials and data room. All media timestamped and hashed as evidence.", tags: ["rw", "ai"] },
    ],
    gates: [
      { id: "G3", name: "VERIFICATION GATE", desc: "GIA verified, 3 appraisals reconciled, final valuation determined" },
      { id: "G4", name: "CUSTODY GATE", desc: "Vaulted, insured, Chainlink PoR feed live and verified" },
      { id: "G5", name: "ISSUER GATE", desc: "SPV formed, PPM finalized, all legal documents complete" },
    ],
  },
  {
    id: 3,
    title: "Tokenization",
    subtitle: "Minting the Digital Asset",
    desc: "Deploy a compliant security token (ERC-3643 or ERC-7518) on Polygon via the selected tokenization platform. Oracle-gated minting ensures nothing is created without verified reserves.",
    color: "#1E3A6E",
    glowColor: "rgba(30,58,110,0.6)",
    gemFills: ["#2A5299", "#1E3A6E", "#1A3560", "#142A4F"],
    steps: [
      { num: "3.1", title: "Token Configuration", detail: "Configure on the selected tokenization platform (Brickken or Zoniqx): name, symbol, total supply (offering value \u00F7 min investment), compliance rules (KYC whitelist, accredited investor status, jurisdiction blocks, max holders, lock-up period, transfer restrictions). Trusted issuers for identity claims.", tags: ["dg", "pt"] },
      { num: "3.2", title: "Testnet Deployment", detail: "Deploy security token + escrow on Polygon testnet via the platform\u2019s sandbox environment. Deploy identity infrastructure. Attach hashed legal documents on-chain. Configure mint-gate requiring Chainlink PoR verification.", tags: ["dg", "pt"] },
      { num: "3.3", title: "Integration Testing", detail: "Full lifecycle: (1) Mint to whitelisted wallet \u2014 pass. (2) Transfer whitelisted \u2014 pass. (3) Transfer non-whitelisted \u2014 revert. (4) PoR custody false \u2014 mint halts. (5) Non-accredited/wrong jurisdiction \u2014 blocked. Automated test suite.", tags: ["dg", "ai"] },
      { num: "3.4", title: "Smart Contract Audit", detail: "Independent audit by CertiK, Hacken, or OpenZeppelin ($5K\u2013$30K). No vulnerabilities, backdoors, logic errors, infinite mint vectors, or reentrancy. Report filed as permanent evidence. Each compliance module audited independently.", tags: ["pt"] },
      { num: "3.5", title: "Mainnet Deployment", detail: "Deploy audited contracts to Polygon mainnet. ALL parameters must match testnet exactly. Confirm PoR feed connected on mainnet (not testnet). Record contract addresses permanently. This is irreversible.", tags: ["dg"] },
      { num: "3.6", title: "Regulatory Filings", detail: "File Form D with SEC via EDGAR (within 15 days of first sale, no fee). Blue sky notices per state. Engage broker-dealer for distribution. Prepare compliant marketing materials with proper Reg D 506(c) disclaimers.", tags: ["lg"] },
    ],
    gates: [
      { id: "G6", name: "PLATFORM GATE", desc: "Token live, PoR verified, audited, parameters match legal docs" },
    ],
  },
  {
    id: 4,
    title: "Distribution",
    subtitle: "Token Sale & Ongoing Management",
    desc: "Execute a controlled Reg D 506(c) offering to qualified investors. Every buyer verified, every transaction recorded, evidence trail continues indefinitely.",
    color: "#C47A1A",
    glowColor: "rgba(196,122,26,0.5)",
    gemFills: ["#E09525", "#C47A1A", "#A86A15", "#8A5710"],
    steps: [
      { num: "4.1", title: "Investor Outreach", detail: "Via broker-dealer network. Reg D 506(c) permits general solicitation (websites, social media, events). All investors MUST be verified accredited. Marketing must include risk disclosures and \u201Cfor accredited investors only\u201D language.", tags: ["pt", "rw"] },
      { num: "4.2", title: "Investor KYC & Accreditation", detail: "Gov ID + liveness, address verification, accredited investor verification. 2025 SEC simplification: $200K+ investments allow self-certification. Below: tax returns, bank statements, CPA letter. Sanctions screening on every investor.", tags: ["pt", "dg", "ai"] },
      { num: "4.3", title: "Subscription Execution", detail: "Investor reviews PPM, signs Subscription + Token Purchase Agreements. Wire funds to SPV escrow (never touches PleoChrome). Broker-dealer reviews and accepts subscription. WORM-compliant e-signature.", tags: ["lg", "dg"] },
      { num: "4.4", title: "Wallet Whitelist & Mint", detail: "Add wallet to ERC-3643 Identity Registry (ONCHAINID). Chainlink Secure Mint: contract checks reserves \u2265 supply + requested mint. Yes \u2192 tokens minted. No \u2192 reverts. Transfer to investor wallet. Update cap table.", tags: ["dg", "pt"] },
      { num: "4.5", title: "Investor Confirmation", detail: "Confirmation package: token quantity, wallet address, contract address, cap table position, block explorer link, investor portal credentials, reporting schedule, support contact.", tags: ["dg"] },
      { num: "4.6", title: "Ongoing: PoR Monitoring", detail: "Chainlink feed runs 24/7. Daily attestation. Custody change \u2192 automated alert. Mint auto-halts if reserves < supply. Chainlink Automation triggers circuit breakers (halt all minting/burning/transfers). Dashboard monitors all assets.", tags: ["dg", "pt", "ai"] },
      { num: "4.7", title: "Ongoing: Reporting", detail: "Quarterly: custody confirmation, PoR status, market comparables. Annual: independent re-appraisal, K-1 tax statements, insurance renewal, Form D amendment. AI automates report generation.", tags: ["dg", "ai"] },
      { num: "4.8", title: "Ongoing: Compliance", detail: "Quarterly investor sanctions re-screening. Accreditation monitoring. SAR filing when triggered. Annual independent AML audit. Multi-jurisdiction tracking (US Reg D, EU MiCA, UAE VARA). AI-powered transaction monitoring.", tags: ["lg", "ai"] },
      { num: "4.9", title: "Secondary Transfers", detail: "ERC-3643 auto-verifies: recipient KYC\u2019d, accredited, correct jurisdiction, under max holders, lock-up expired. Compliant = executes on-chain. Non-compliant = blocked at contract level. Secondary trading via tZERO ATS (24/7, SEC/FINRA regulated).", tags: ["dg"] },
      { num: "4.10", title: "Redemption", detail: "Redemption request \u2192 burn all tokens for series \u2192 coordinate vault release \u2192 insured transport to holder \u2192 delivery confirmation \u2192 SPV dissolves \u2192 audit trail preserved permanently. Redemption logistics = major software opportunity.", tags: ["rw", "lg", "dg"] },
    ],
    gates: [
      { id: "G7", name: "SALE GATE", desc: "Onboarding live, KYC verified, Form D filed, broker-dealer engaged" },
    ],
  },
];

const tagConfig: Record<Tag, { label: string; color: string; bg: string }> = {
  rw: { label: "RW", color: "#C47A1A", bg: "rgba(196,122,26,0.1)" },
  dg: { label: "DG", color: "#1A8B7A", bg: "rgba(26,139,122,0.1)" },
  lg: { label: "LG", color: "#5B2D8E", bg: "rgba(91,45,142,0.1)" },
  pt: { label: "PT", color: "#1E3A6E", bg: "rgba(30,58,110,0.15)" },
  ai: { label: "AI", color: "#7BA31E", bg: "rgba(123,163,30,0.1)" },
};

// ── Components ────────────────────────────────

function GemSVG({ fills }: { fills: [string, string, string, string] }) {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <polygon points="50,5 90,25 90,75 50,95 10,75 10,25" fill={fills[1]} opacity={0.9} />
      <polygon points="50,5 90,25 50,45 10,25" fill={fills[0]} opacity={0.8} />
      <polygon points="90,25 90,75 50,45" fill={fills[1]} opacity={0.7} />
      <polygon points="10,25 50,45 10,75" fill={fills[2]} opacity={0.6} />
      <polygon points="50,95 90,75 50,45 10,75" fill={fills[3]} opacity={0.8} />
      <line x1="50" y1="5" x2="50" y2="45" stroke="rgba(255,255,255,0.15)" strokeWidth={0.5} />
      <line x1="90" y1="25" x2="50" y2="45" stroke="rgba(255,255,255,0.15)" strokeWidth={0.5} />
      <line x1="10" y1="25" x2="50" y2="45" stroke="rgba(255,255,255,0.15)" strokeWidth={0.5} />
    </svg>
  );
}

function TagBadge({ tag }: { tag: Tag }) {
  const c = tagConfig[tag];
  return (
    <span
      className="text-[9px] sm:text-[10px] tracking-wider uppercase px-1.5 py-[1px] rounded"
      style={{ color: c.color, background: c.bg }}
    >
      {c.label}
    </span>
  );
}

// ── Password Gate ─────────────────────────────

function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code === PASSCODE) {
      onUnlock();
    } else {
      setError(true);
      setTimeout(() => setError(false), 1500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030712] px-4">
      <form onSubmit={handleSubmit} className="text-center max-w-sm w-full">
        <Image
          src="/favicon.png"
          alt="PleoChrome"
          width={48}
          height={48}
          className="mx-auto mb-6 opacity-60"
        />
        <h1 className="font-[family-name:var(--font-cormorant)] text-2xl font-light text-white/80 mb-2">
          Restricted Access
        </h1>
        <p className="text-xs tracking-[0.2em] uppercase text-white/30 mb-8">
          Enter passcode to continue
        </p>
        <input
          type="password"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Passcode"
          className={`w-full bg-white/[0.04] border rounded-xl px-5 py-3.5 text-sm text-white/80
            placeholder:text-white/20 outline-none transition-all duration-300
            ${error ? "border-[#A61D3A] shake" : "border-white/[0.08] focus:border-white/20"}`}
          autoFocus
        />
        <button
          type="submit"
          className="mt-4 w-full bg-gradient-to-r from-[#1A8B7A] to-[#1E3A6E] text-white text-xs
            tracking-[0.2em] uppercase py-3.5 rounded-xl hover:opacity-90 transition-opacity"
        >
          Enter
        </button>
      </form>
    </div>
  );
}

// ── Main Page ─────────────────────────────────

export default function WorkflowMapping() {
  const [unlocked, setUnlocked] = useState(false);
  const [activePhase, setActivePhase] = useState<number | null>(null);
  const [openSteps, setOpenSteps] = useState<Set<string>>(new Set());

  const [dark, setDark] = useState(true);

  // Check portal auth + dark mode
  useState(() => {
    if (typeof window !== "undefined") {
      if (localStorage.getItem("pleo-auth") === "true") setUnlocked(true);
      const saved = localStorage.getItem("pleo-dark");
      if (saved !== null) setDark(saved === "true");
    }
  });

  if (!unlocked) {
    return <PasswordGate onUnlock={() => setUnlocked(true)} />;
  }

  const togglePhase = (id: number) => {
    setActivePhase(activePhase === id ? null : id);
    setOpenSteps(new Set());
  };

  const toggleStep = (key: string) => {
    setOpenSteps((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <div className={`min-h-screen ${dark ? "bg-[#030712] text-[#FAFBFC]" : "bg-[#F8F9FA] text-[#1a1a1a]"} transition-colors duration-300`}>
      {/* Header */}
      <header className="text-center pt-8 pb-6 sm:pt-12 sm:pb-8 relative px-4">
        <div className="flex items-center justify-center gap-2 mb-3">
          <a href="/portal" className={`text-[9px] sm:text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full border transition-colors flex items-center gap-1 ${dark ? "border-white/10 text-white/30 hover:text-white/50" : "border-gray-300 text-gray-400 hover:text-gray-600"}`}>
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Portal
          </a>
          <Image src={dark ? "/logo-white.png" : "/logo.png"} alt="PleoChrome" width={160} height={40} className="opacity-50 h-5 sm:h-6 w-auto" />
          <button onClick={() => { setDark(!dark); localStorage.setItem("pleo-dark", String(!dark)); }}
            className={`text-[9px] sm:text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full border transition-colors ${dark ? "border-white/10 text-white/30" : "border-gray-300 text-gray-400"}`}>
            {dark ? "Light" : "Dark"}
          </button>
        </div>
        <h1 className="font-[family-name:var(--font-cormorant)] text-xl sm:text-2xl font-light tracking-wider">
          Master Workflow Map
        </h1>
        <p className={`mt-1 text-[10px] sm:text-xs tracking-[0.25em] uppercase ${dark ? "text-white/25" : "text-gray-400"}`}>
          Value from Every Angle
        </p>
        {/* Gem bar */}
        <div className="flex gap-[2px] justify-center mt-3">
          {["#1B6B4A","#1A8B7A","#1E3A6E","#5B2D8E","#A61D3A","#C47A1A","#7BA31E"].map((c) => (
            <span key={c} className="h-[2px] w-4 sm:w-5 rounded-sm" style={{ background: c }} />
          ))}
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] max-w-md h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      </header>

      {/* Legend */}
      <div className="flex flex-wrap gap-2 sm:gap-3 justify-center px-4 py-3">
        {(Object.entries(tagConfig) as [Tag, typeof tagConfig.rw][]).map(([key, val]) => (
          <span key={key} className="text-[9px] sm:text-[10px] tracking-wider uppercase px-2 py-[2px] rounded" style={{ color: val.color, background: val.bg }}>
            {key === "rw" ? "Real World" : key === "dg" ? "Digital" : key === "lg" ? "Legal" : key === "pt" ? "Partner" : "AI/Auto"}
          </span>
        ))}
      </div>

      {/* Gem Navigation */}
      <div className="flex justify-center gap-6 sm:gap-10 flex-wrap px-4 pt-8 pb-4">
        {phases.map((phase) => {
          const isActive = activePhase === phase.id;
          return (
            <button
              key={phase.id}
              onClick={() => togglePhase(phase.id)}
              className="flex flex-col items-center gap-2 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ transform: isActive ? "translateY(-6px)" : "translateY(0)" }}
            >
              <div
                className="w-14 h-14 sm:w-[72px] sm:h-[72px] transition-all duration-500"
                style={{
                  filter: isActive
                    ? `drop-shadow(0 8px 32px ${phase.glowColor}) drop-shadow(0 0 16px ${phase.glowColor})`
                    : "drop-shadow(0 4px 12px rgba(0,0,0,0.3))",
                  transform: isActive ? "scale(1.12)" : "scale(1)",
                }}
              >
                <GemSVG fills={phase.gemFills} />
              </div>
              <span className={`text-[10px] sm:text-xs tracking-[0.18em] uppercase transition-colors duration-300 ${isActive ? "text-white/70" : "text-white/25"}`}>
                {phase.title}
              </span>
              <span className={`font-mono text-[9px] -mt-1 transition-colors duration-300 ${isActive ? "text-white/30" : "text-white/10"}`}>
                Phase {String(phase.id).padStart(2, "0")} &middot; {phase.steps.length} Steps
              </span>
            </button>
          );
        })}
      </div>

      {/* Phase Content */}
      <div className="max-w-3xl mx-auto px-3 sm:px-5">
        {phases.map((phase) => {
          const isOpen = activePhase === phase.id;
          return (
            <div
              key={phase.id}
              className="overflow-hidden transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                maxHeight: isOpen ? "6000px" : "0",
                opacity: isOpen ? 1 : 0,
                margin: isOpen ? "16px 0 40px" : "0",
              }}
            >
              <div className="bg-[rgba(10,17,32,0.92)] border border-white/[0.04] rounded-2xl p-5 sm:p-7 backdrop-blur-sm">
                {/* Phase header */}
                <div className="flex items-center gap-3 mb-1">
                  <div
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center font-mono text-xs font-medium text-white shrink-0"
                    style={{ background: phase.color }}
                  >
                    {String(phase.id).padStart(2, "0")}
                  </div>
                  <div>
                    <h2 className="font-[family-name:var(--font-cormorant)] text-lg sm:text-xl font-normal tracking-wide">
                      {phase.title}
                    </h2>
                    <p className="text-[10px] tracking-[0.18em] uppercase text-white/25 mt-[1px]">
                      {phase.subtitle}
                    </p>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-white/25 leading-relaxed mt-2 mb-5 max-w-xl">
                  {phase.desc}
                </p>

                {/* Steps */}
                <div className="divide-y divide-white/[0.04]">
                  {phase.steps.map((step) => {
                    const key = step.num;
                    const stepOpen = openSteps.has(key);
                    return (
                      <div key={key}>
                        <button
                          onClick={() => toggleStep(key)}
                          className="w-full flex items-center gap-2 sm:gap-3 py-3 sm:py-3.5 px-2 sm:px-3 text-left hover:bg-white/[0.02] transition-colors"
                        >
                          <span className="font-mono text-[10px] text-white/10 w-6 shrink-0">{step.num}</span>
                          <span
                            className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full border-2 shrink-0 transition-all duration-300"
                            style={{
                              borderColor: phase.color,
                              background: stepOpen ? phase.color : "transparent",
                            }}
                          />
                          <span className={`text-xs sm:text-sm font-semibold flex-1 transition-colors duration-200 ${stepOpen ? "text-white/70" : "text-white/40"}`}>
                            {step.title}
                          </span>
                          <div className="hidden sm:flex gap-1 shrink-0">
                            {step.tags.map((t) => <TagBadge key={t} tag={t} />)}
                          </div>
                          <svg
                            className={`w-3.5 h-3.5 shrink-0 transition-transform duration-300 ${stepOpen ? "rotate-180 text-white/25" : "text-white/10"}`}
                            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
                          >
                            <path d="M6 9l6 6 6-6" />
                          </svg>
                        </button>
                        <div
                          className="overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]"
                          style={{
                            maxHeight: stepOpen ? "300px" : "0",
                            opacity: stepOpen ? 1 : 0,
                          }}
                        >
                          <div className="pl-10 sm:pl-14 pr-3 pb-4">
                            <div className="flex gap-1 mb-2 sm:hidden">
                              {step.tags.map((t) => <TagBadge key={t} tag={t} />)}
                            </div>
                            <p className="text-xs sm:text-[13px] text-white/30 leading-[1.7]">
                              {step.detail}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Gates */}
                <div className="mt-4 space-y-2">
                  {phase.gates.map((gate) => (
                    <div
                      key={gate.id}
                      className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg"
                      style={{ background: "linear-gradient(135deg,rgba(166,29,58,0.06),rgba(91,45,142,0.03))", border: "1px solid rgba(166,29,58,0.15)" }}
                    >
                      <span className="w-7 h-7 rounded-md bg-[#A61D3A] flex items-center justify-center font-mono text-[10px] font-bold text-white shrink-0">
                        {gate.id}
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-white/50">{gate.name}</span>
                      <span className="hidden sm:block ml-auto text-[11px] text-white/25 text-right max-w-[320px]">{gate.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <footer className="text-center py-8 mt-8 border-t border-white/[0.03]">
        <div className="flex gap-[2px] justify-center mb-2">
          {["#1B6B4A","#1A8B7A","#1E3A6E","#5B2D8E","#A61D3A","#C47A1A","#7BA31E"].map((c) => (
            <span key={c} className="h-[2px] w-4 rounded-sm" style={{ background: c }} />
          ))}
        </div>
        <p className="text-[10px] tracking-[0.15em] text-white/10">
          PleoChrome &mdash; Confidential &mdash; Florida
        </p>
      </footer>
    </div>
  );
}
