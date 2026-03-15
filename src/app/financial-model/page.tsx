"use client";

import { useState, useMemo, useCallback } from "react";
import Image from "next/image";

const PASSCODE = "PleoChrome2026";

// ── Helpers ───────────────────────────────────

function fmtFull(n: number): string {
  const abs = Math.abs(n);
  const str = "$" + abs.toLocaleString("en-US", { maximumFractionDigits: 0 });
  return n < 0 ? "(" + str + ")" : str;
}

function fmt(n: number): string {
  const abs = Math.abs(n);
  let s: string;
  if (abs >= 1_000_000) s = "$" + (abs / 1_000_000).toFixed(2) + "M";
  else if (abs >= 1_000) s = "$" + (abs / 1_000).toFixed(1) + "K";
  else s = "$" + abs.toFixed(0);
  return n < 0 ? "(" + s + ")" : s;
}

function pct(n: number, d: number): string {
  if (d === 0) return "0%";
  return ((n / d) * 100).toFixed(1) + "%";
}

// ── Data ──────────────────────────────────────

interface CostLine {
  id: string;
  label: string;
  narrative: string;
  phase: "Acquisition" | "Preparation" | "Tokenization" | "Distribution";
  paidBy: "pleochrome" | "asset-holder" | "proceeds";
  defaultAmount: number;
  scaleFactor?: number;
  fixed?: boolean;
  min: number;
  max: number;
}

interface CustomCost {
  id: string;
  label: string;
  amount: number;
  phase: string;
  paidBy: "pleochrome" | "asset-holder" | "proceeds";
}

const defaultCosts: CostLine[] = [
  // Acquisition
  { id: "kyc", label: "KYC / KYB on Asset Holder", narrative: "Identity verification on the stone owner. Includes government ID check, liveness detection, and entity verification for businesses. If the seller is a company, we also identify all owners with >25% stake.", phase: "Acquisition", paidBy: "pleochrome", defaultAmount: 150, fixed: true, min: 0, max: 5000 },
  { id: "sanctions", label: "Sanctions & PEP Screening", narrative: "We screen the seller against every major sanctions list (US OFAC, EU, UN) and check if they are a Politically Exposed Person. This is a legal requirement before doing business with anyone in financial services.", phase: "Acquisition", paidBy: "pleochrome", defaultAmount: 250, fixed: true, min: 0, max: 5000 },
  { id: "provenance", label: "Provenance Research", narrative: "Legal research tracing the stone's ownership history from the mine to the current holder. Confirms there are no competing claims, liens, or legal issues. Think of it as a title search for a gemstone.", phase: "Acquisition", paidBy: "asset-holder", defaultAmount: 5000, fixed: true, min: 1000, max: 50000 },
  { id: "intake-legal", label: "Intake Agreement (Legal)", narrative: "The contract between PleoChrome and the stone owner that defines who does what, what it costs, and what happens at each stage. Drafted by a securities attorney. This is our master engagement document.", phase: "Acquisition", paidBy: "pleochrome", defaultAmount: 5000, fixed: true, min: 2000, max: 25000 },
  // Preparation
  { id: "gia", label: "GIA Grading Report", narrative: "The Gemological Institute of America grades the stone's cut, color, clarity, and carat weight. This is the global gold standard for gemstone certification. Every serious buyer expects a GIA report.", phase: "Preparation", paidBy: "asset-holder", defaultAmount: 400, fixed: true, min: 100, max: 5000 },
  { id: "ssef", label: "SSEF Origin Report", narrative: "The Swiss Gemmological Institute determines where the stone was mined using advanced spectroscopy. Origin matters enormously: a Burmese ruby can be worth 2-5x more than an identical-looking stone from Mozambique.", phase: "Preparation", paidBy: "asset-holder", defaultAmount: 4000, fixed: true, min: 1000, max: 15000 },
  { id: "gubelin", label: "Gubelin Report (Optional)", narrative: "A third lab report from Gubelin (Switzerland) for maximum credibility. For stones valued above $10M, triple-lab certification (GIA + SSEF + Gubelin) is the institutional standard used by auction houses.", phase: "Preparation", paidBy: "asset-holder", defaultAmount: 4000, fixed: true, min: 0, max: 15000 },
  { id: "appraisal1", label: "Appraisal #1 (USPAP)", narrative: "A certified gemologist appraiser physically inspects the stone and writes a formal valuation report following USPAP standards (the same rules real estate appraisers follow). This appraiser has no connection to the seller or to PleoChrome.", phase: "Preparation", paidBy: "asset-holder", defaultAmount: 15000, scaleFactor: 0.6, min: 1000, max: 100000 },
  { id: "appraisal2", label: "Appraisal #2 (USPAP)", narrative: "A second, completely independent appraiser. They don't know what the first appraiser valued the stone at. The stone is shipped to them with insured transit. This independence is what makes the process credible.", phase: "Preparation", paidBy: "asset-holder", defaultAmount: 15000, scaleFactor: 0.6, min: 1000, max: 100000 },
  { id: "appraisal3", label: "Appraisal #3 (USPAP)", narrative: "The third and final independent appraisal. Once all three are in, we average the two lowest values to set the offering price. This 3-Appraisal Rule is PleoChrome's core investor protection mechanism.", phase: "Preparation", paidBy: "asset-holder", defaultAmount: 15000, scaleFactor: 0.6, min: 1000, max: 100000 },
  { id: "transit-ins", label: "Transit Insurance", narrative: "Every time the stone moves between labs, appraisers, and the vault, it needs specialized insurance. For a $55M stone, each shipment costs $5K-$10K. There are typically 4-6 shipments during the preparation phase.", phase: "Preparation", paidBy: "asset-holder", defaultAmount: 30000, scaleFactor: 1, min: 5000, max: 500000 },
  { id: "vault", label: "Vault Custody (Year 1)", narrative: "The stone is stored in a segregated, climate-controlled vault at Brink's or Malca-Amit — the same companies that store gold for central banks. The stone is not mixed with other assets. Annual cost is typically 0.15% of value.", phase: "Preparation", paidBy: "asset-holder", defaultAmount: 82500, scaleFactor: 1, min: 5000, max: 1000000 },
  { id: "insurance", label: "Insurance Premium (Year 1)", narrative: "Specialized 'specie insurance' from Lloyd's of London or AXA XL that covers theft, damage, and loss while in vault storage. Rate: approximately 0.25% of the stone's insured value per year.", phase: "Preparation", paidBy: "asset-holder", defaultAmount: 137500, scaleFactor: 1, min: 10000, max: 2000000 },
  { id: "chainlink-setup", label: "Chainlink PoR Setup", narrative: "Chainlink is the world's largest blockchain oracle network. We build a custom connection between the vault's inventory system and the blockchain so anyone can verify the stone is in custody in real time. This is a one-time integration.", phase: "Preparation", paidBy: "pleochrome", defaultAmount: 100000, fixed: true, min: 25000, max: 500000 },
  { id: "chainlink-yr1", label: "Chainlink PoR Maintenance (Yr 1)", narrative: "Annual cost to keep the oracle network running — multiple independent nodes verify the vault data daily and publish it on-chain. This is what makes 'oracle-gated minting' possible.", phase: "Preparation", paidBy: "pleochrome", defaultAmount: 50000, fixed: true, min: 10000, max: 200000 },
  { id: "spv", label: "SPV Formation", narrative: "We create a dedicated legal entity (Series LLC) to hold this specific stone. Each stone gets its own entity, so legal issues with one stone can never affect another. Includes the operating agreement that defines investor rights.", phase: "Preparation", paidBy: "pleochrome", defaultAmount: 8000, fixed: true, min: 1000, max: 50000 },
  { id: "ppm", label: "PPM Drafting", narrative: "The Private Placement Memorandum is the legal offering document that every investor reads before investing. It describes the stone, the risks, the fees, the legal structure, and the tax implications. Written by a securities attorney.", phase: "Preparation", paidBy: "pleochrome", defaultAmount: 50000, scaleFactor: 0.3, min: 10000, max: 200000 },
  { id: "sub-agreement", label: "Subscription Agreement", narrative: "The contract each investor signs when they invest. Contains their representations (that they're accredited, understand the risks, etc.), payment instructions, and the terms of their token purchase.", phase: "Preparation", paidBy: "pleochrome", defaultAmount: 8000, fixed: true, min: 2000, max: 30000 },
  { id: "token-agreement", label: "Token Purchase Agreement", narrative: "A specialized legal document that connects the blockchain token to the investor's legal rights in the SPV. This is what makes a digital token represent real ownership in a real gemstone.", phase: "Preparation", paidBy: "pleochrome", defaultAmount: 10000, fixed: true, min: 2000, max: 30000 },
  { id: "media", label: "Photo & Media Documentation", narrative: "Professional gemstone photography (8+ angles, macro detail, 360 video) plus independent weight verification. These assets go in the investor data room and marketing materials.", phase: "Preparation", paidBy: "asset-holder", defaultAmount: 5000, fixed: true, min: 1000, max: 25000 },
  // Tokenization
  { id: "brickken", label: "Brickken Platform (Year 1)", narrative: "Brickken is the tokenization engine that deploys the smart contracts, manages compliance rules, and handles the token lifecycle. Think of it as the operating system for the digital security. Enterprise tier.", phase: "Tokenization", paidBy: "pleochrome", defaultAmount: 35000, fixed: true, min: 10000, max: 100000 },
  { id: "audit", label: "Smart Contract Audit", narrative: "Before any tokens are created, an independent security firm (like CertiK or OpenZeppelin) audits the smart contract code to verify there are no vulnerabilities. This is like a building inspection before occupancy.", phase: "Tokenization", paidBy: "pleochrome", defaultAmount: 90000, fixed: true, min: 5000, max: 300000 },
  { id: "dev", label: "Development & Testing", narrative: "Blockchain developers configure the token, run tests on a practice network (testnet), verify that all compliance rules work, and confirm the oracle connection. 40-120 hours of specialized work.", phase: "Tokenization", paidBy: "pleochrome", defaultAmount: 20000, fixed: true, min: 5000, max: 100000 },
  { id: "gas", label: "Mainnet Deployment (Gas)", narrative: "The actual blockchain transaction fees to deploy the smart contracts on Polygon. Polygon's gas costs are extremely low compared to Ethereum — typically under $1 per transaction.", phase: "Tokenization", paidBy: "pleochrome", defaultAmount: 200, fixed: true, min: 10, max: 5000 },
  { id: "bluesky", label: "Blue Sky Filings (All States)", narrative: "When offering securities in the US, you must notify each state where investors reside. Fees range from $0 (Florida) to $1,500 (Puerto Rico). Filing in all 50 states + DC costs approximately $15K total.", phase: "Tokenization", paidBy: "pleochrome", defaultAmount: 15000, fixed: true, min: 5000, max: 25000 },
  // Distribution
  { id: "marketing", label: "Marketing & Investor Acquisition", narrative: "Digital marketing to reach accredited investors. Under Reg D 506(c), we can advertise publicly — websites, social media, events. Cost per qualified accredited investor lead: $15-$50. Cost to convert a lead to a committed investor: $1,500-$5,000.", phase: "Distribution", paidBy: "pleochrome", defaultAmount: 200000, scaleFactor: 0.5, min: 10000, max: 5000000 },
  { id: "investor-kyc", label: "Investor KYC & Accreditation", narrative: "Every investor must pass identity verification, accredited investor verification (income or net worth documentation), and sanctions screening. For investments of $200K+, investors can self-certify under 2025 SEC guidance.", phase: "Distribution", paidBy: "pleochrome", defaultAmount: 12000, scaleFactor: 0.3, min: 1000, max: 100000 },
  { id: "transfer-agent", label: "Transfer Agent (Year 1)", narrative: "A registered agent that maintains the official shareholder records — like a registrar for the tokens. Tracks who owns what, processes transfers, and handles communications. Required for SEC compliance.", phase: "Distribution", paidBy: "pleochrome", defaultAmount: 30000, fixed: true, min: 10000, max: 150000 },
  { id: "data-room", label: "Investor Portal / Data Room", narrative: "A secure online workspace where investors access the PPM, GIA reports, appraisals, vault receipts, and quarterly reports. Think of it as a private, password-protected document vault for each offering.", phase: "Distribution", paidBy: "pleochrome", defaultAmount: 10000, fixed: true, min: 2000, max: 50000 },
  { id: "compliance-yr1", label: "Compliance Monitoring (Year 1)", narrative: "Ongoing regulatory compliance: quarterly sanctions re-screening of all investors, transaction monitoring, suspicious activity detection. This runs continuously after the offering closes.", phase: "Distribution", paidBy: "pleochrome", defaultAmount: 25000, fixed: true, min: 5000, max: 100000 },
  { id: "aml-audit", label: "Annual AML Audit", narrative: "An independent third-party audit of PleoChrome's anti-money laundering program. This is a legal requirement — regulators expect it annually. The auditor reviews our processes, documentation, and training.", phase: "Distribution", paidBy: "pleochrome", defaultAmount: 15000, fixed: true, min: 5000, max: 50000 },
];

const phaseConfig = {
  Acquisition: { color: "#1B6B4A", num: "01", subtitle: "Building the Pipeline" },
  Preparation: { color: "#1A8B7A", num: "02", subtitle: "Building the Evidence Layer" },
  Tokenization: { color: "#1E3A6E", num: "03", subtitle: "Minting the Digital Asset" },
  Distribution: { color: "#C47A1A", num: "04", subtitle: "Token Sale & Management" },
} as const;

const paidByLabels = { pleochrome: "PleoChrome", "asset-holder": "Asset Holder", proceeds: "From Proceeds" };
const paidByColors = { pleochrome: "text-[#1A8B7A]", "asset-holder": "text-[#C47A1A]", proceeds: "text-[#5B2D8E]" };

// ── Components ────────────────────────────────

function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const go = (e: React.FormEvent) => { e.preventDefault(); if (code === PASSCODE) onUnlock(); else { setError(true); setTimeout(() => setError(false), 1500); } };
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030712] px-4">
      <form onSubmit={go} className="text-center max-w-sm w-full">
        <Image src="/favicon.png" alt="" width={48} height={48} className="mx-auto mb-6 opacity-60" />
        <h1 className="font-[family-name:var(--font-cormorant)] text-2xl font-light text-white/80 mb-2">Financial Model</h1>
        <p className="text-xs tracking-[0.2em] uppercase text-white/30 mb-8">Enter passcode</p>
        <input type="password" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Passcode" autoFocus className={`w-full bg-white/[0.04] border rounded-xl px-5 py-3.5 text-sm text-white/80 placeholder:text-white/20 outline-none transition-all ${error ? "border-[#A61D3A]" : "border-white/[0.08] focus:border-white/20"}`} />
        <button type="submit" className="mt-4 w-full bg-gradient-to-r from-[#1A8B7A] to-[#1E3A6E] text-white text-xs tracking-[0.2em] uppercase py-3.5 rounded-xl">Enter</button>
      </form>
    </div>
  );
}

function ValidatedInput({ value, onChange, min, max }: { value: number; onChange: (v: number) => void; min: number; max: number }) {
  const [raw, setRaw] = useState(String(value));
  const [valid, setValid] = useState(true);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const s = e.target.value;
    setRaw(s);
    const n = Number(s);
    if (s === "" || isNaN(n)) { setValid(false); return; }
    if (n < min || n > max) { setValid(false); onChange(Math.max(min, Math.min(max, n))); return; }
    setValid(true);
    onChange(n);
  };
  const handleBlur = () => { const n = Math.max(min, Math.min(max, Number(raw) || min)); setRaw(String(n)); onChange(n); setValid(true); };
  return (
    <input type="text" inputMode="numeric" value={raw} onChange={handleChange} onBlur={handleBlur}
      className={`w-full bg-inherit border rounded-md px-2 py-1.5 text-xs text-right font-mono outline-none transition-colors [appearance:textfield]
        ${valid ? "border-inherit focus:border-[#1A8B7A]/40" : "border-[#A61D3A]/50 text-[#A61D3A]"}`} />
  );
}

// ── Main ──────────────────────────────────────

export default function FinancialModel() {
  const [unlocked, setUnlocked] = useState(false);
  const [dark, setDark] = useState(true);
  const [assetValue, setAssetValue] = useState(55_000_000);
  const [appraisalDiscount, setAppraisalDiscount] = useState(12.7);
  const [tokenPrice, setTokenPrice] = useState(100_000);
  const [bdRate, setBdRate] = useState(7.0);
  const [setupFeeRate, setSetupFeeRate] = useState(2.0);
  const [successFeeRate, setSuccessFeeRate] = useState(1.5);
  const [adminFeeRate, setAdminFeeRate] = useState(0.75);
  const [overrides, setOverrides] = useState<Record<string, number>>({});
  const [customCosts, setCustomCosts] = useState<CustomCost[]>([]);
  const [openPhases, setOpenPhases] = useState<Set<string>>(new Set(["Acquisition"]));
  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set());

  const togglePhase = (p: string) => setOpenPhases((prev) => { const n = new Set(prev); n.has(p) ? n.delete(p) : n.add(p); return n; });
  const toggleNote = (id: string) => setExpandedNotes((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const addCustomCost = useCallback((phase: string) => {
    const id = "custom-" + Date.now();
    setCustomCosts((prev) => [...prev, { id, label: "New Expense", amount: 0, phase, paidBy: "pleochrome" }]);
  }, []);

  const updateCustomCost = useCallback((id: string, field: string, value: string | number) => {
    setCustomCosts((prev) => prev.map((c) => c.id === id ? { ...c, [field]: value } : c));
  }, []);

  const removeCustomCost = useCallback((id: string) => {
    setCustomCosts((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const model = useMemo(() => {
    const offeringValue = assetValue * (1 - appraisalDiscount / 100);
    const totalTokens = Math.floor(offeringValue / tokenPrice);
    const scaleFactor = assetValue / 55_000_000;
    const bdFee = offeringValue * (bdRate / 100);
    const setupFee = assetValue * (setupFeeRate / 100);
    const successFee = offeringValue * (successFeeRate / 100);
    const adminFee = offeringValue * (adminFeeRate / 100);

    const costs = defaultCosts.map((line) => {
      if (overrides[line.id] !== undefined) return { ...line, amount: overrides[line.id] };
      let amount = line.defaultAmount;
      if (!line.fixed && line.scaleFactor !== undefined) amount = line.defaultAmount * Math.pow(scaleFactor, line.scaleFactor);
      return { ...line, amount: Math.round(amount) };
    });

    const allCosts = [...costs.map((c) => ({ ...c, custom: false })), ...customCosts.map((c) => ({ ...c, custom: true, narrative: "", min: 0, max: 999999999, fixed: true }))];
    const pleoChromeCosts = allCosts.filter((c) => c.paidBy === "pleochrome").reduce((s, c) => s + c.amount, 0);
    const assetHolderCosts = allCosts.filter((c) => c.paidBy === "asset-holder").reduce((s, c) => s + c.amount, 0);
    const totalCosts = pleoChromeCosts + assetHolderCosts + bdFee;
    const yr1Revenue = setupFee + successFee + 12000;
    const yr2Revenue = adminFee + 25000 + 24000;
    const yr1Net = yr1Revenue - pleoChromeCosts;
    const netToHolder = offeringValue - bdFee - setupFee - successFee - assetHolderCosts;

    return { offeringValue, totalTokens, scaleFactor, bdFee, setupFee, successFee, adminFee, allCosts, pleoChromeCosts, assetHolderCosts, totalCosts, yr1Revenue, yr2Revenue, yr1Net, netToHolder };
  }, [assetValue, appraisalDiscount, tokenPrice, bdRate, setupFeeRate, successFeeRate, adminFeeRate, overrides, customCosts]);

  if (!unlocked) return <PasswordGate onUnlock={() => setUnlocked(true)} />;

  // Theme
  const bg = dark ? "bg-[#030712]" : "bg-[#F8F9FA]";
  const text = dark ? "text-[#FAFBFC]" : "text-[#1a1a1a]";
  const card = dark ? "bg-[rgba(10,17,32,0.92)] border-white/[0.04]" : "bg-white border-gray-200 shadow-sm";
  const sub = dark ? "text-white/30" : "text-gray-400";
  const sub2 = dark ? "text-white/50" : "text-gray-600";
  const sub3 = dark ? "text-white/70" : "text-gray-800";
  const inputBg = dark ? "bg-white/[0.04] border-white/[0.08]" : "bg-gray-50 border-gray-200";
  const divider = dark ? "border-white/[0.04]" : "border-gray-100";
  const logo = dark ? "/logo-white.png" : "/logo.png";

  return (
    <div className={`min-h-screen ${bg} ${text} transition-colors duration-300`}>
      {/* Header */}
      <header className="text-center pt-6 pb-5 sm:pt-10 sm:pb-7 relative px-4">
        <div className="flex items-center justify-center gap-3 mb-3">
          <Image src={logo} alt="PleoChrome" width={140} height={35} className="h-5 sm:h-6 w-auto opacity-60" />
          <button onClick={() => setDark(!dark)} className={`text-[10px] tracking-wider uppercase px-3 py-1 rounded-full border transition-colors ${dark ? "border-white/10 text-white/30 hover:text-white/50" : "border-gray-300 text-gray-400 hover:text-gray-600"}`}>
            {dark ? "Light" : "Dark"}
          </button>
        </div>
        <h1 className="font-[family-name:var(--font-cormorant)] text-lg sm:text-2xl font-light tracking-wider">Interactive Financial Model</h1>
        <p className={`mt-1 text-[10px] tracking-[0.25em] uppercase ${sub}`}>Value from Every Angle</p>
        <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-[60%] max-w-md h-px bg-gradient-to-r from-transparent ${dark ? "via-white/[0.06]" : "via-gray-200"} to-transparent`} />
      </header>

      <div className="max-w-4xl mx-auto px-3 sm:px-5 pb-16">

        {/* ── Deal Dashboard ──────────────── */}
        <div className={`${card} border rounded-2xl p-4 sm:p-5 mb-5`}>
          <h2 className="text-[10px] sm:text-xs tracking-[0.2em] uppercase text-[#1A8B7A] mb-3 font-semibold">Deal Dashboard</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {[
              { label: "Offering Value", value: fmtFull(model.offeringValue), accent: "#1A8B7A", sub: model.totalTokens + " tokens at " + fmtFull(tokenPrice) },
              { label: "Total Deal Costs", value: fmtFull(model.totalCosts), accent: "#A61D3A", sub: pct(model.totalCosts, model.offeringValue) + " of offering" },
              { label: "PleoChrome Net (Yr 1)", value: fmtFull(model.yr1Net), accent: model.yr1Net >= 0 ? "#1B6B4A" : "#A61D3A", sub: model.yr1Net >= 0 ? pct(model.yr1Net, model.yr1Revenue) + " margin" : "Below breakeven" },
              { label: "Net to Asset Holder", value: fmtFull(model.netToHolder), accent: "#C47A1A", sub: pct(model.netToHolder, assetValue) + " of claimed value" },
            ].map((m) => (
              <div key={m.label} className={`${card} border rounded-xl p-3`}>
                <p className={`text-[9px] sm:text-[10px] tracking-wider uppercase ${sub} mb-1`}>{m.label}</p>
                <p className="text-base sm:text-xl font-bold font-mono" style={{ color: m.accent }}>{m.value}</p>
                <p className={`text-[9px] sm:text-[10px] ${sub} mt-0.5`}>{m.sub}</p>
              </div>
            ))}
          </div>
          {/* Mini flow */}
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <div className={`rounded-lg p-2 ${dark ? "bg-[#1B6B4A]/10" : "bg-[#1B6B4A]/5"}`}>
              <p className={`text-[9px] uppercase tracking-wider ${sub}`}>Revenue</p>
              <p className="text-sm font-mono font-semibold text-[#1B6B4A]">{fmt(model.yr1Revenue)}</p>
            </div>
            <div className={`rounded-lg p-2 ${dark ? "bg-[#A61D3A]/10" : "bg-[#A61D3A]/5"}`}>
              <p className={`text-[9px] uppercase tracking-wider ${sub}`}>PC Costs</p>
              <p className="text-sm font-mono font-semibold text-[#A61D3A]">{fmt(model.pleoChromeCosts)}</p>
            </div>
            <div className={`rounded-lg p-2 ${dark ? "bg-[#1A8B7A]/10" : "bg-[#1A8B7A]/5"}`}>
              <p className={`text-[9px] uppercase tracking-wider ${sub}`}>Net Income</p>
              <p className="text-sm font-mono font-semibold text-[#1A8B7A]">{fmt(model.yr1Net)}</p>
            </div>
          </div>
        </div>

        {/* ── Adjustable Inputs ───────────── */}
        <div className={`${card} border rounded-2xl p-4 sm:p-5 mb-5`}>
          <h2 className={`text-[10px] sm:text-xs tracking-[0.2em] uppercase ${sub2} mb-3 font-semibold`}>Adjust Variables</h2>
          <div className="grid grid-cols-2 gap-x-3 gap-y-2 sm:grid-cols-4 sm:gap-4">
            {[
              { label: "Asset Value ($)", value: assetValue, set: setAssetValue, min: 100000, max: 1000000000 },
              { label: "Appraisal Discount (%)", value: appraisalDiscount, set: setAppraisalDiscount, min: 0, max: 50 },
              { label: "Token Price ($)", value: tokenPrice, set: setTokenPrice, min: 1000, max: 10000000 },
              { label: "BD Rate (%)", value: bdRate, set: setBdRate, min: 0, max: 20 },
              { label: "Setup Fee (%)", value: setupFeeRate, set: setSetupFeeRate, min: 0, max: 10 },
              { label: "Success Fee (%)", value: successFeeRate, set: setSuccessFeeRate, min: 0, max: 10 },
              { label: "Admin Fee (%)", value: adminFeeRate, set: setAdminFeeRate, min: 0, max: 5 },
            ].map((inp) => (
              <div key={inp.label}>
                <label className={`block text-[9px] sm:text-[10px] tracking-wider uppercase ${sub} mb-1`}>{inp.label}</label>
                <div className={`${inputBg} border rounded-lg overflow-hidden`}>
                  <input type="number" value={inp.value}
                    onChange={(e) => { const v = Number(e.target.value); if (v >= inp.min && v <= inp.max) inp.set(v); }}
                    className="w-full bg-transparent text-sm py-2 px-3 outline-none font-mono [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Phase Cost Sections (Collapsible) ── */}
        {(Object.keys(phaseConfig) as (keyof typeof phaseConfig)[]).map((phase) => {
          const config = phaseConfig[phase];
          const isOpen = openPhases.has(phase);
          const phaseCosts = model.allCosts.filter((c) => c.phase === phase);
          const phaseTotal = phaseCosts.reduce((s, c) => s + c.amount, 0);

          return (
            <div key={phase} className={`${card} border rounded-2xl mb-3 overflow-hidden`}>
              {/* Phase Header (clickable) */}
              <button onClick={() => togglePhase(phase)} className={`w-full flex items-center gap-2 sm:gap-3 p-3 sm:p-4 text-left ${dark ? "hover:bg-white/[0.02]" : "hover:bg-gray-50"} transition-colors`}>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center font-mono text-[10px] sm:text-xs font-bold text-white shrink-0" style={{ background: config.color }}>
                  {config.num}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs sm:text-sm font-semibold ${sub3}`}>{phase}</p>
                  <p className={`text-[9px] sm:text-[10px] ${sub}`}>{config.subtitle} &middot; {phaseCosts.length} items</p>
                </div>
                <span className="font-mono text-xs sm:text-sm shrink-0" style={{ color: config.color }}>{fmtFull(phaseTotal)}</span>
                <svg className={`w-4 h-4 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""} ${sub}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M6 9l6 6 6-6" /></svg>
              </button>

              {/* Phase Body */}
              <div className={`transition-all duration-400 overflow-hidden ${isOpen ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"}`}>
                <div className={`border-t ${divider} px-3 sm:px-4 pb-3`}>
                  {phaseCosts.map((cost) => {
                    const noteOpen = expandedNotes.has(cost.id);
                    return (
                      <div key={cost.id} className={`border-b ${divider} last:border-0 py-2.5`}>
                        <div className="flex items-start gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className={`text-xs sm:text-sm ${sub2}`}>{cost.label}</span>
                              <span className={`text-[8px] tracking-wider uppercase px-1.5 py-[1px] rounded ${paidByColors[cost.paidBy]} ${dark ? "bg-white/[0.05]" : "bg-gray-100"}`}>
                                {paidByLabels[cost.paidBy]}
                              </span>
                              {cost.custom && (
                                <button onClick={() => removeCustomCost(cost.id)} className="text-[#A61D3A] text-[10px] hover:underline">Remove</button>
                              )}
                            </div>
                            {/* Narrative toggle */}
                            {cost.narrative && (
                              <button onClick={() => toggleNote(cost.id)} className={`text-[9px] sm:text-[10px] ${sub} mt-0.5 hover:underline text-left`}>
                                {noteOpen ? "Hide explanation" : "What is this?"}
                              </button>
                            )}
                            {noteOpen && cost.narrative && (
                              <p className={`text-[10px] sm:text-xs ${sub2} mt-1 leading-relaxed max-w-lg`}>{cost.narrative}</p>
                            )}
                          </div>
                          <div className={`w-24 sm:w-28 shrink-0 ${inputBg} border rounded-md`}>
                            {cost.custom ? (
                              <input type="number" value={cost.amount}
                                onChange={(e) => updateCustomCost(cost.id, "amount", Number(e.target.value))}
                                className="w-full bg-transparent text-xs text-right font-mono py-1.5 px-2 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none" />
                            ) : (
                              <ValidatedInput
                                value={overrides[cost.id] !== undefined ? overrides[cost.id] : cost.amount}
                                onChange={(v) => setOverrides((prev) => ({ ...prev, [cost.id]: v }))}
                                min={cost.min} max={cost.max} />
                            )}
                          </div>
                        </div>
                        {/* Custom cost label edit */}
                        {cost.custom && (
                          <input type="text" value={cost.label} onChange={(e) => updateCustomCost(cost.id, "label", e.target.value)}
                            className={`mt-1 text-[10px] ${inputBg} border rounded px-2 py-1 w-full outline-none`} placeholder="Expense name" />
                        )}
                      </div>
                    );
                  })}
                  {/* Add Custom Expense */}
                  <button onClick={() => addCustomCost(phase)} className={`mt-2 text-[10px] sm:text-xs tracking-wider uppercase ${sub} hover:${sub2} transition-colors flex items-center gap-1`}>
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 5v14M5 12h14" /></svg>
                    Add Custom Expense
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* ── Revenue ─────────────────────── */}
        <div className={`${card} border rounded-2xl p-4 sm:p-5 mb-3`}>
          <h2 className="text-[10px] sm:text-xs tracking-[0.2em] uppercase text-[#1B6B4A] mb-3 font-semibold">PleoChrome Revenue</h2>
          {[
            { label: "Setup Fee (" + setupFeeRate + "% of asset value)", amount: model.setupFee, note: "Collected when asset holder signs engagement agreement" },
            { label: "Success Fee (" + successFeeRate + "% of offering)", amount: model.successFee, note: "Collected when token sale closes" },
            { label: "Secondary Transfer Fees (est.)", amount: 12000, note: "0.25% per token transfer, estimated 20% annual turnover" },
            { label: "Annual Admin Fee (" + adminFeeRate + "%, Year 2+)", amount: model.adminFee, note: "Recurring revenue for ongoing management and reporting" },
            { label: "Valuation Refresh (Year 2+)", amount: 25000, note: "Annual re-appraisal coordination fee" },
          ].map((r) => (
            <div key={r.label} className={`flex items-center justify-between py-2 border-b ${divider} last:border-0`}>
              <div className="min-w-0 flex-1 pr-2">
                <p className={`text-xs sm:text-sm ${sub2} truncate`}>{r.label}</p>
                <p className={`text-[9px] sm:text-[10px] ${sub}`}>{r.note}</p>
              </div>
              <span className="font-mono text-xs sm:text-sm text-[#1B6B4A] shrink-0">{fmtFull(r.amount)}</span>
            </div>
          ))}
          <div className={`mt-3 pt-3 border-t-2 ${dark ? "border-[#1B6B4A]/20" : "border-[#1B6B4A]/10"} flex justify-between`}>
            <span className={`text-xs font-semibold ${sub2}`}>Year 1 Total</span>
            <span className="font-mono text-sm font-bold text-[#1B6B4A]">{fmtFull(model.yr1Revenue)}</span>
          </div>
        </div>

        {/* ── Asset Holder Summary ─────────── */}
        <div className={`${card} border rounded-2xl p-4 sm:p-5 mb-3`}>
          <h2 className="text-[10px] sm:text-xs tracking-[0.2em] uppercase text-[#C47A1A] mb-3 font-semibold">Asset Holder Economics</h2>
          {[
            { label: "Claimed Asset Value", amount: assetValue },
            { label: "Offering Value (after " + appraisalDiscount + "% appraisal discount)", amount: model.offeringValue },
            { label: "Less: BD Placement (" + bdRate + "%)", amount: -model.bdFee },
            { label: "Less: PleoChrome Setup Fee", amount: -model.setupFee },
            { label: "Less: PleoChrome Success Fee", amount: -model.successFee },
            { label: "Less: Pass-Through Costs (labs, vault, insurance)", amount: -model.assetHolderCosts },
          ].map((line) => (
            <div key={line.label} className={`flex justify-between py-1.5 border-b ${divider} last:border-0`}>
              <span className={`text-xs sm:text-sm ${sub2}`}>{line.label}</span>
              <span className={`font-mono text-xs sm:text-sm ${line.amount < 0 ? "text-[#A61D3A]" : sub3}`}>{fmtFull(line.amount)}</span>
            </div>
          ))}
          <div className={`mt-3 pt-3 border-t-2 ${dark ? "border-[#1A8B7A]/20" : "border-[#1A8B7A]/10"} flex justify-between items-end`}>
            <span className={`text-sm font-semibold ${sub3}`}>Net Proceeds</span>
            <div className="text-right">
              <span className="font-mono text-xl font-bold text-[#1A8B7A]">{fmtFull(model.netToHolder)}</span>
              <p className={`text-[10px] ${sub}`}>{pct(model.netToHolder, assetValue)} of claimed value</p>
            </div>
          </div>
        </div>

      </div>

      <footer className={`text-center py-6 border-t ${divider}`}>
        <div className="flex gap-[2px] justify-center mb-2">
          {["#1B6B4A","#1A8B7A","#1E3A6E","#5B2D8E","#A61D3A","#C47A1A","#7BA31E"].map((c) => (
            <span key={c} className="h-[2px] w-4 rounded-sm" style={{ background: c }} />
          ))}
        </div>
        <p className={`text-[10px] tracking-[0.15em] ${sub}`}>PleoChrome &mdash; Confidential &mdash; Florida</p>
      </footer>
    </div>
  );
}
