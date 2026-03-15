"use client";

import { useState, useMemo, useCallback } from "react";
import Image from "next/image";

const PASSCODE = "PleoChrome2026";

// ═══════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════

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

// ═══════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════

interface CostLine {
  id: string; label: string; narrative: string;
  phase: "Acquisition" | "Preparation" | "Tokenization" | "Distribution";
  paidBy: "pleochrome" | "asset-holder" | "proceeds";
  defaultAmount: number; scaleFactor?: number; fixed?: boolean; min: number; max: number;
}
interface CustomCost { id: string; label: string; amount: number; phase: string; paidBy: "pleochrome" | "asset-holder" | "proceeds"; }

const comparableStones = [
  { name: "Custom Stone", value: 55000000, type: "Custom", carat: 0, note: "Enter your own values" },
  { name: "Estrela de Fura Ruby", value: 34800000, type: "Ruby", carat: 55.22, note: "Sotheby's NY, June 2023. World record for any ruby at auction." },
  { name: "Sunrise Ruby", value: 30420000, type: "Ruby", carat: 25.59, note: "Sotheby's Geneva, May 2015. Burmese pigeon's blood, no heat." },
  { name: "Blue Moon Diamond", value: 48500000, type: "Diamond", carat: 12.03, note: "Sotheby's Geneva, Nov 2015. Internally flawless fancy vivid blue." },
  { name: "Pink Star Diamond", value: 71200000, type: "Diamond", carat: 59.60, note: "Sotheby's HK, April 2017. Most expensive gemstone ever sold at auction." },
  { name: "Rockefeller Emerald", value: 5500000, type: "Emerald", carat: 18.04, note: "Christie's NY, June 2017. Colombian origin, exceptional clarity." },
  { name: "Royal Blue Sapphire", value: 17300000, type: "Sapphire", carat: 17.70, note: "Christie's Geneva, 2018. Kashmir origin, no heat treatment." },
  { name: "Hope Spinel", value: 1470000, type: "Spinel", carat: 50.13, note: "Bonhams London, 2015. Historic provenance, exceptional size." },
];

const defaultCosts: CostLine[] = [
  { id:"kyc",label:"KYC / KYB on Asset Holder",narrative:"Identity verification on the stone owner. Includes government ID check with liveness detection, entity verification for businesses, and identification of all owners with >25% stake (Ultimate Beneficial Owners). This is a legal requirement under anti-money laundering regulations before any financial engagement.",phase:"Acquisition",paidBy:"pleochrome",defaultAmount:150,fixed:true,min:0,max:5000 },
  { id:"sanctions",label:"Sanctions & PEP Screening",narrative:"Every person and entity involved is screened against the US Treasury's OFAC Specially Designated Nationals list, EU and UN consolidated sanctions lists, and Politically Exposed Person databases. A single sanctions hit halts the entire process. This protects PleoChrome and all stakeholders from criminal and regulatory liability.",phase:"Acquisition",paidBy:"pleochrome",defaultAmount:250,fixed:true,min:0,max:5000 },
  { id:"provenance",label:"Provenance Research",narrative:"A thorough investigation tracing the stone's complete ownership history from the original mine to the current holder. Confirms there are no competing ownership claims, outstanding liens, or legal encumbrances. Similar to a title search in real estate \u2014 without clean provenance, no credible offering can proceed.",phase:"Acquisition",paidBy:"asset-holder",defaultAmount:5000,fixed:true,min:1000,max:50000 },
  { id:"intake-legal",label:"Intake Agreement (Legal)",narrative:"The master engagement contract between PleoChrome and the stone owner. Drafted by a securities attorney, it defines: each party's obligations, the complete fee structure, timeline expectations, conditions for proceeding through all seven gates, and termination provisions. This is the legal foundation for the entire relationship.",phase:"Acquisition",paidBy:"pleochrome",defaultAmount:5000,fixed:true,min:2000,max:25000 },
  { id:"gia",label:"GIA Grading Report",narrative:"The Gemological Institute of America is the global gold standard for gemstone certification. They grade the stone's cut, color, clarity, and carat weight using standardized scientific methods. Every serious buyer, auction house, and institutional investor expects a GIA report. Without one, a stone cannot be credibly valued.",phase:"Preparation",paidBy:"asset-holder",defaultAmount:400,fixed:true,min:100,max:5000 },
  { id:"ssef",label:"SSEF Origin Report",narrative:"The Swiss Gemmological Institute uses advanced spectroscopic analysis to determine exactly where a stone was mined. Geographic origin dramatically affects value \u2014 a Burmese ruby can be worth 2-5x more than an identical-looking stone from Mozambique. For high-value colored stones, SSEF origin reports are the institutional standard.",phase:"Preparation",paidBy:"asset-holder",defaultAmount:4000,fixed:true,min:1000,max:15000 },
  { id:"gubelin",label:"Gub\u00e9lin Report (Optional)",narrative:"A third lab certification from Gub\u00e9lin Gem Lab in Switzerland. For stones valued above $10M, triple-lab certification (GIA + SSEF + Gub\u00e9lin) is the standard used by auction houses like Christie's and Sotheby's. This provides maximum scientific credibility and eliminates any doubt about the stone's identity.",phase:"Preparation",paidBy:"asset-holder",defaultAmount:4000,fixed:true,min:0,max:15000 },
  { id:"appraisal1",label:"Independent Appraisal #1",narrative:"A Certified Gemologist Appraiser (CGA) or Master Gemologist Appraiser (MGA) physically inspects the stone and writes a formal valuation report following USPAP standards \u2014 the same professional standards that govern real estate appraisals. This appraiser must have zero affiliation with the seller, PleoChrome, or the other appraisers.",phase:"Preparation",paidBy:"asset-holder",defaultAmount:15000,scaleFactor:0.6,min:1000,max:100000 },
  { id:"appraisal2",label:"Independent Appraisal #2",narrative:"A second, completely independent appraiser receives the stone (shipped with insured transit) and performs their own valuation without knowledge of the first appraiser's findings. This independence is the cornerstone of PleoChrome's investor protection model.",phase:"Preparation",paidBy:"asset-holder",defaultAmount:15000,scaleFactor:0.6,min:1000,max:100000 },
  { id:"appraisal3",label:"Independent Appraisal #3",narrative:"The third and final independent appraisal. Once all three are complete, PleoChrome applies the 3-Appraisal Rule: we average the two lowest valuations to determine the conservative offering price. This structurally protects investors from inflated pricing and eliminates appraiser bias.",phase:"Preparation",paidBy:"asset-holder",defaultAmount:15000,scaleFactor:0.6,min:1000,max:100000 },
  { id:"transit-ins",label:"Transit Insurance",narrative:"Every time the stone physically moves \u2014 between labs, appraisers, and the vault \u2014 it requires specialized inland marine insurance. For a high-value stone, each shipment can cost $5K-$10K. There are typically 4-6 insured transits during the preparation phase. This cost scales linearly with the stone's value.",phase:"Preparation",paidBy:"asset-holder",defaultAmount:30000,scaleFactor:1,min:5000,max:500000 },
  { id:"vault",label:"Vault Custody (Year 1)",narrative:"The stone is stored in a segregated, climate-controlled vault operated by Brink's or Malca-Amit \u2014 the same companies that secure gold reserves for central banks. 'Segregated' means the stone is stored alone, never mixed with other assets. Annual cost is typically 0.15% of the stone's value, negotiated for high-value single assets.",phase:"Preparation",paidBy:"asset-holder",defaultAmount:82500,scaleFactor:1,min:5000,max:1000000 },
  { id:"insurance",label:"Insurance Premium (Year 1)",narrative:"Specialized 'specie insurance' from Lloyd's of London or AXA XL that covers theft, damage, natural disaster, and loss while the stone is in vault storage. The rate (approximately 0.25% of insured value per year) is significantly lower than retail jewelry insurance because institutional vaults have fortress-level security.",phase:"Preparation",paidBy:"asset-holder",defaultAmount:137500,scaleFactor:1,min:10000,max:2000000 },
  { id:"chainlink-setup",label:"Chainlink Oracle Setup",narrative:"Chainlink is the world's largest blockchain oracle network, trusted by institutions managing billions in assets. PleoChrome builds a custom connection between the vault's inventory system and the blockchain, so anyone \u2014 investors, regulators, or the public \u2014 can verify in real time that the stone is in custody. This is a one-time integration cost.",phase:"Preparation",paidBy:"pleochrome",defaultAmount:100000,fixed:true,min:25000,max:500000 },
  { id:"chainlink-yr1",label:"Chainlink Maintenance (Year 1)",narrative:"Annual cost to operate the oracle network. Multiple independent Chainlink nodes verify the vault data daily and publish it on-chain. This continuous verification is what enables 'oracle-gated minting' \u2014 the smart contract physically cannot create tokens unless the oracle confirms the stone is in the vault.",phase:"Preparation",paidBy:"pleochrome",defaultAmount:50000,fixed:true,min:10000,max:200000 },
  { id:"spv",label:"SPV Formation (Series LLC)",narrative:"A dedicated legal entity (Series LLC) is created to hold this specific stone. Each stone gets its own isolated entity, so any legal issues with one stone can never affect another \u2014 this is called 'bankruptcy remoteness.' The operating agreement within the SPV defines exactly what rights token holders have.",phase:"Preparation",paidBy:"pleochrome",defaultAmount:8000,fixed:true,min:1000,max:50000 },
  { id:"ppm",label:"PPM (Offering Document)",narrative:"The Private Placement Memorandum is the comprehensive legal document every investor reads before investing. It describes: the stone and its certifications, all risk factors, the complete fee structure, the legal structure of the SPV, use of proceeds, management background, and tax implications. Drafted by a securities attorney specializing in Reg D offerings.",phase:"Preparation",paidBy:"pleochrome",defaultAmount:50000,scaleFactor:0.3,min:10000,max:200000 },
  { id:"sub-agreement",label:"Subscription Agreement",narrative:"The contract each investor signs when they commit capital. It contains: the investor's representations (that they are accredited, understand the risks, etc.), the investment amount, payment instructions via wire transfer, and the legal terms of their token purchase.",phase:"Preparation",paidBy:"pleochrome",defaultAmount:8000,fixed:true,min:2000,max:30000 },
  { id:"token-agreement",label:"Token Purchase Agreement",narrative:"A specialized legal document that creates the binding connection between a blockchain token and the investor's legal ownership rights in the SPV. This is what makes a digital token represent real, enforceable ownership in a real gemstone \u2014 the bridge between blockchain and law.",phase:"Preparation",paidBy:"pleochrome",defaultAmount:10000,fixed:true,min:2000,max:30000 },
  { id:"media",label:"Photo & Media Documentation",narrative:"Professional gemstone photography under standardized lighting conditions: minimum 8 angles, macro detail shots, 360-degree video, and independent weight verification on a calibrated scale. These assets populate the investor data room and all marketing materials. All media is timestamped and cryptographically hashed as part of the permanent evidence trail.",phase:"Preparation",paidBy:"asset-holder",defaultAmount:5000,fixed:true,min:1000,max:25000 },
  { id:"brickken",label:"Brickken Platform (Year 1)",narrative:"Brickken is the tokenization engine that deploys the smart contracts, manages compliance rules, and handles the complete token lifecycle. Think of it as the operating system for the digital security. PleoChrome uses their Enterprise tier, which includes unlimited issuances, built-in KYC, and investor management tools.",phase:"Tokenization",paidBy:"pleochrome",defaultAmount:35000,fixed:true,min:10000,max:100000 },
  { id:"audit",label:"Smart Contract Audit",narrative:"Before any tokens are created, an independent security firm (CertiK, Hacken, or OpenZeppelin) performs a comprehensive audit of all smart contract code. They check for vulnerabilities, backdoors, logic errors, and attack vectors. This is the digital equivalent of a building inspection before occupancy \u2014 non-negotiable for institutional credibility.",phase:"Tokenization",paidBy:"pleochrome",defaultAmount:90000,fixed:true,min:5000,max:300000 },
  { id:"dev",label:"Development & Testing",narrative:"Blockchain developers configure the token parameters, deploy to a practice network (testnet), run the full test suite (mint, transfer, block, oracle gate), and verify every compliance rule works correctly. This typically requires 40-120 hours of specialized Solidity/Web3 development work.",phase:"Tokenization",paidBy:"pleochrome",defaultAmount:20000,fixed:true,min:5000,max:100000 },
  { id:"gas",label:"Blockchain Gas Fees",narrative:"The actual transaction fees paid to the Polygon network to deploy the smart contracts on the public blockchain. Polygon was chosen specifically because its gas costs are extremely low (under $1 per transaction) compared to Ethereum ($5-$50+). This is a negligible cost.",phase:"Tokenization",paidBy:"pleochrome",defaultAmount:200,fixed:true,min:10,max:5000 },
  { id:"bluesky",label:"Blue Sky Filings (50 States)",narrative:"Under US securities law, when offering securities, you must file a notice with each state where investors may reside. Fees range from $0 (Florida, Indiana) to $1,500 (Puerto Rico). Filing in all 50 states plus DC costs approximately $13K-$18K total. The SEC Form D itself has zero filing fee.",phase:"Tokenization",paidBy:"pleochrome",defaultAmount:15000,fixed:true,min:5000,max:25000 },
  { id:"marketing",label:"Marketing & Investor Acquisition",narrative:"Digital marketing to reach accredited investors. Under Reg D 506(c), PleoChrome can advertise publicly \u2014 websites, LinkedIn, events, and targeted digital campaigns. The cost to generate a qualified accredited investor lead is $15-$50. The cost to convert that lead into a committed investor who wires funds is typically $1,500-$5,000. This is PleoChrome's largest variable cost.",phase:"Distribution",paidBy:"pleochrome",defaultAmount:200000,scaleFactor:0.5,min:10000,max:5000000 },
  { id:"investor-kyc",label:"Investor KYC & Accreditation",narrative:"Every investor must pass: (1) government ID verification with liveness detection, (2) accredited investor verification \u2014 proof of $200K+ income or $1M+ net worth, and (3) sanctions screening. Under 2025 SEC guidance, investors committing $200K+ can self-certify their accredited status, significantly reducing friction for larger tickets.",phase:"Distribution",paidBy:"pleochrome",defaultAmount:12000,scaleFactor:0.3,min:1000,max:100000 },
  { id:"transfer-agent",label:"Transfer Agent (Year 1)",narrative:"A SEC-registered Transfer Agent maintains the official shareholder records \u2014 who owns which tokens, in what quantities, and processes all transfers. Think of it as the official registrar for the digital securities. This is a regulatory requirement, not optional. Securitize or Vertalo are the leading digital transfer agents.",phase:"Distribution",paidBy:"pleochrome",defaultAmount:30000,fixed:true,min:10000,max:150000 },
  { id:"data-room",label:"Investor Portal / Data Room",narrative:"A secure, password-protected online workspace where verified investors can access: the PPM, all GIA/SSEF reports, appraisal summaries, vault custody receipts, Chainlink PoR status, quarterly performance reports, and tax documents. This is the investor's single source of truth for their investment.",phase:"Distribution",paidBy:"pleochrome",defaultAmount:10000,fixed:true,min:2000,max:50000 },
  { id:"compliance-yr1",label:"Compliance Monitoring (Year 1)",narrative:"After the offering closes, regulatory compliance continues indefinitely. This includes: quarterly sanctions re-screening of all investors, continuous transaction monitoring for suspicious patterns, ongoing KYC status updates, and maintaining the complete audit trail. This is what separates a legitimate offering from an unregulated one.",phase:"Distribution",paidBy:"pleochrome",defaultAmount:25000,fixed:true,min:5000,max:100000 },
  { id:"aml-audit",label:"Annual AML Program Audit",narrative:"An independent third-party auditor reviews PleoChrome's entire anti-money laundering program: procedures, documentation, screening results, training records, and incident responses. This annual audit is a legal requirement under the Bank Secrecy Act. Regulators expect it, and institutional partners will ask for the report.",phase:"Distribution",paidBy:"pleochrome",defaultAmount:15000,fixed:true,min:5000,max:50000 },
];

const phaseInfo: Record<string, { color: string; num: string; subtitle: string }> = {
  Acquisition: { color: "#1B6B4A", num: "01", subtitle: "Building the Pipeline" },
  Preparation: { color: "#1A8B7A", num: "02", subtitle: "Building the Evidence Layer" },
  Tokenization: { color: "#1E3A6E", num: "03", subtitle: "Minting the Digital Asset" },
  Distribution: { color: "#C47A1A", num: "04", subtitle: "Token Sale & Management" },
};

// ═══════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════

function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [code, setCode] = useState("");
  const [err, setErr] = useState(false);
  const go = (e: React.FormEvent) => { e.preventDefault(); if (code === PASSCODE) onUnlock(); else { setErr(true); setTimeout(() => setErr(false), 1500); } };
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030712] px-4">
      <form onSubmit={go} className="text-center max-w-sm w-full">
        <Image src="/favicon.png" alt="" width={48} height={48} className="mx-auto mb-6 opacity-60" />
        <h1 className="font-[family-name:var(--font-cormorant)] text-2xl font-light text-white/80 mb-2">Financial Model</h1>
        <p className="text-xs tracking-[0.2em] uppercase text-white/30 mb-8">Enter passcode</p>
        <input type="password" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Passcode" autoFocus
          className={`w-full bg-white/[0.04] border rounded-xl px-5 py-3.5 text-sm text-white/80 placeholder:text-white/20 outline-none ${err ? "border-[#A61D3A]" : "border-white/[0.08] focus:border-white/20"}`} />
        <button type="submit" className="mt-4 w-full bg-gradient-to-r from-[#1A8B7A] to-[#1E3A6E] text-white text-xs tracking-[0.2em] uppercase py-3.5 rounded-xl">Enter</button>
      </form>
    </div>
  );
}

function DollarInput({ value, onChange, min, max, compact = false }: { value: number; onChange: (v: number) => void; min: number; max: number; compact?: boolean }) {
  const [focused, setFocused] = useState(false);
  const [raw, setRaw] = useState(String(value));
  const [valid, setValid] = useState(true);
  const display = focused ? raw : "$" + Math.round(value).toLocaleString("en-US");
  return (
    <input type="text" inputMode="numeric" value={display}
      onFocus={() => { setFocused(true); setRaw(String(Math.round(value))); }}
      onChange={(e) => { const s = e.target.value.replace(/[^0-9.-]/g, ""); setRaw(s); const n = Number(s); if (!isNaN(n) && n >= min && n <= max) { setValid(true); onChange(n); } else setValid(false); }}
      onBlur={() => { setFocused(false); const n = Math.max(min, Math.min(max, Math.round(Number(raw) || min))); setRaw(String(n)); onChange(n); setValid(true); }}
      className={`w-full bg-inherit border rounded-md text-right font-mono outline-none transition-colors ${compact ? "px-2 py-1.5 text-xs" : "px-3 py-2 text-sm"} ${valid ? "border-inherit focus:border-[#1A8B7A]/40" : "border-[#A61D3A]/50 text-[#A61D3A]"}`} />
  );
}

function PctInput({ value, onChange, min, max }: { value: number; onChange: (v: number) => void; min: number; max: number }) {
  const [focused, setFocused] = useState(false);
  const [raw, setRaw] = useState(String(value));
  const display = focused ? raw : value + "%";
  return (
    <input type="text" inputMode="decimal" value={display}
      onFocus={() => { setFocused(true); setRaw(String(value)); }}
      onChange={(e) => { const s = e.target.value.replace(/[^0-9.]/g, ""); setRaw(s); const n = Number(s); if (!isNaN(n) && n >= min && n <= max) onChange(n); }}
      onBlur={() => { setFocused(false); const n = Math.max(min, Math.min(max, Number(raw) || min)); setRaw(String(n)); onChange(n); }}
      className="w-full bg-inherit border border-inherit rounded-md px-3 py-2 text-sm text-right font-mono outline-none focus:border-[#1A8B7A]/40" />
  );
}

// Simple donut chart with CSS
function Donut({ segments, size = 160 }: { segments: { label: string; value: number; color: string }[]; size?: number }) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  let cumPct = 0;
  const gradientStops = segments.map((seg) => {
    const startPct = cumPct;
    const segPct = total > 0 ? (seg.value / total) * 100 : 0;
    cumPct += segPct;
    return `${seg.color} ${startPct}% ${cumPct}%`;
  }).join(", ");

  return (
    <div className="flex flex-col items-center gap-3">
      <div style={{ width: size, height: size, borderRadius: "50%", background: `conic-gradient(${gradientStops})`, position: "relative" }}>
        <div className="absolute inset-[25%] rounded-full bg-inherit" style={{ background: "inherit" }} />
        <div className="absolute inset-[28%] rounded-full flex items-center justify-center" style={{ background: "var(--donut-bg, #030712)" }}>
          <span className="text-[10px] font-mono opacity-60">{fmtFull(total)}</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1 justify-center">
        {segments.filter(s => s.value > 0).map((seg) => (
          <div key={seg.label} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-sm shrink-0" style={{ background: seg.color }} />
            <span className="text-[9px] opacity-50">{seg.label}</span>
            <span className="text-[9px] font-mono opacity-40">{pct(seg.value, total)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════

export default function FinancialModel() {
  const [unlocked, setUnlocked] = useState(false);
  const [dark, setDark] = useState(true);
  const [selectedStone, setSelectedStone] = useState(0);
  const [assetValue, setAssetValue] = useState(55_000_000);
  const [appraisalDiscount, setAppraisalDiscount] = useState(12.7);
  const [tokenPrice, setTokenPrice] = useState(100_000);
  const [bdRate, setBdRate] = useState(7.0);
  const [setupFeeRate, setSetupFeeRate] = useState(2.0);
  const [successFeeRate, setSuccessFeeRate] = useState(1.5);
  const [adminFeeRate, setAdminFeeRate] = useState(0.75);
  const [investorReturn, setInvestorReturn] = useState(500000);
  const [appreciation, setAppreciation] = useState(10);
  const [holdYears, setHoldYears] = useState(3);
  const [overrides, setOverrides] = useState<Record<string, number>>({});
  const [customCosts, setCustomCosts] = useState<CustomCost[]>([]);
  const [openPhases, setOpenPhases] = useState<Set<string>>(new Set());
  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<"model" | "investor" | "scenarios">("model");

  const togglePhase = (p: string) => setOpenPhases(prev => { const n = new Set(prev); n.has(p) ? n.delete(p) : n.add(p); return n; });
  const toggleNote = (id: string) => setExpandedNotes(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const addCustom = useCallback((phase: string) => setCustomCosts(p => [...p, { id: "c-" + Date.now(), label: "New Expense", amount: 0, phase, paidBy: "pleochrome" }]), []);
  const updateCustom = useCallback((id: string, f: string, v: string | number) => setCustomCosts(p => p.map(c => c.id === id ? { ...c, [f]: v } : c)), []);
  const removeCustom = useCallback((id: string) => setCustomCosts(p => p.filter(c => c.id !== id)), []);

  const selectStone = (idx: number) => {
    setSelectedStone(idx);
    if (idx > 0) setAssetValue(comparableStones[idx].value);
  };

  const model = useMemo(() => {
    const offeringValue = assetValue * (1 - appraisalDiscount / 100);
    const totalTokens = Math.floor(offeringValue / tokenPrice);
    const sf = assetValue / 55_000_000;
    const bdFee = offeringValue * (bdRate / 100);
    const setupFee = assetValue * (setupFeeRate / 100);
    const successFee = offeringValue * (successFeeRate / 100);
    const adminFee = offeringValue * (adminFeeRate / 100);

    const costs = defaultCosts.map(line => {
      if (overrides[line.id] !== undefined) return { ...line, amount: overrides[line.id] };
      let a = line.defaultAmount;
      if (!line.fixed && line.scaleFactor !== undefined) a = line.defaultAmount * Math.pow(sf, line.scaleFactor);
      return { ...line, amount: Math.round(a) };
    });

    const all = [...costs.map(c => ({ ...c, custom: false })), ...customCosts.map(c => ({ ...c, custom: true, narrative: "", min: 0, max: 999999999, fixed: true, scaleFactor: undefined }))];
    const pcCosts = all.filter(c => c.paidBy === "pleochrome").reduce((s, c) => s + c.amount, 0);
    const ahCosts = all.filter(c => c.paidBy === "asset-holder").reduce((s, c) => s + c.amount, 0);
    const totalCosts = pcCosts + ahCosts + bdFee;
    const yr1Rev = setupFee + successFee + 12000;
    const yr2Rev = adminFee + 25000 + 24000;
    const yr1Net = yr1Rev - pcCosts;
    const netToHolder = offeringValue - bdFee - setupFee - successFee - ahCosts;

    // Investor return calc
    const tokensForInvestment = Math.floor(investorReturn / tokenPrice);
    const futureValue = investorReturn * Math.pow(1 + appreciation / 100, holdYears);
    const investorProfit = futureValue - investorReturn;

    // Cash balance over 120 days
    const cashPoints = [
      { day: 0, bal: setupFee, label: "Setup fee collected" },
      { day: 14, bal: setupFee - (costs.find(c=>c.phase==="Acquisition")?.amount || 0) * 4, label: "Acquisition costs" },
      { day: 42, bal: setupFee - pcCosts * 0.3, label: "Labs + legal begin" },
      { day: 70, bal: setupFee - pcCosts * 0.7, label: "PoR + SPV + PPM" },
      { day: 84, bal: setupFee - pcCosts * 0.85, label: "Audit + deploy" },
      { day: 105, bal: setupFee - pcCosts * 0.95, label: "Marketing spend" },
      { day: 120, bal: yr1Net, label: "Success fee closes deal" },
    ];

    // Breakeven
    const fixedCosts = costs.filter(c => c.fixed && c.paidBy === "pleochrome").reduce((s, c) => s + c.amount, 0);
    const breakeven = fixedCosts / ((setupFeeRate + successFeeRate * (1 - appraisalDiscount / 100)) / 100);

    return { offeringValue, totalTokens, sf, bdFee, setupFee, successFee, adminFee, all, pcCosts, ahCosts, totalCosts, yr1Rev, yr2Rev, yr1Net, netToHolder, tokensForInvestment, futureValue, investorProfit, cashPoints, breakeven, fixedCosts };
  }, [assetValue, appraisalDiscount, tokenPrice, bdRate, setupFeeRate, successFeeRate, adminFeeRate, overrides, customCosts, investorReturn, appreciation, holdYears]);

  if (!unlocked) return <PasswordGate onUnlock={() => setUnlocked(true)} />;

  // Theme tokens
  const bg = dark ? "bg-[#030712]" : "bg-[#F8F9FA]";
  const tx = dark ? "text-[#FAFBFC]" : "text-[#1a1a1a]";
  const cd = dark ? "bg-[rgba(10,17,32,0.92)] border-white/[0.04]" : "bg-white border-gray-200 shadow-sm";
  const s1 = dark ? "text-white/25" : "text-gray-400";
  const s2 = dark ? "text-white/50" : "text-gray-600";
  const s3 = dark ? "text-white/70" : "text-gray-800";
  const ib = dark ? "bg-white/[0.04] border-white/[0.08]" : "bg-gray-50 border-gray-200";
  const dv = dark ? "border-white/[0.04]" : "border-gray-100";
  const logo = dark ? "/logo-white.png" : "/logo.png";
  const donutBg = dark ? "#0A1120" : "#ffffff";

  const tabs = [
    { id: "model" as const, label: "Deal Model" },
    { id: "investor" as const, label: "Investor View" },
    { id: "scenarios" as const, label: "Scenarios" },
  ];

  return (
    <div className={`min-h-screen ${bg} ${tx} transition-colors duration-300`} style={{ "--donut-bg": donutBg } as React.CSSProperties}>
      {/* Header */}
      <header className="text-center pt-6 pb-4 sm:pt-10 sm:pb-6 relative px-4">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Image src={logo} alt="PleoChrome" width={140} height={35} className="h-5 sm:h-6 w-auto opacity-60" />
          <button onClick={() => setDark(!dark)} className={`text-[10px] tracking-wider uppercase px-3 py-1 rounded-full border transition-colors ${dark ? "border-white/10 text-white/30" : "border-gray-300 text-gray-400"}`}>
            {dark ? "Light" : "Dark"}
          </button>
        </div>
        <h1 className="font-[family-name:var(--font-cormorant)] text-lg sm:text-2xl font-light tracking-wider">Interactive Financial Model</h1>
        <p className={`mt-1 text-[9px] sm:text-[10px] tracking-[0.25em] uppercase ${s1}`}>Value from Every Angle &mdash; Confidential</p>
      </header>

      <div className="max-w-4xl mx-auto px-3 sm:px-5 pb-16">

        {/* Intro Narrative */}
        <div className={`${cd} border rounded-2xl p-4 sm:p-5 mb-5`}>
          <h2 className={`text-xs sm:text-sm font-semibold ${s3} mb-2`}>How to Read This Model</h2>
          <p className={`text-[11px] sm:text-xs ${s2} leading-relaxed`}>
            This interactive model maps the complete economics of tokenizing a single high-value gemstone through PleoChrome&apos;s 7-Gate framework. Every number is adjustable &mdash; change the asset value, fee rates, or any individual cost to see how the deal economics shift in real time. Costs are color-coded: <span className="text-[#1A8B7A] font-semibold">PleoChrome</span> pays green items, <span className="text-[#C47A1A] font-semibold">Asset Holder</span> pays amber items (pass-through), and <span className="text-[#5B2D8E] font-semibold">Broker-Dealer</span> fees come from offering proceeds. Click &ldquo;What is this?&rdquo; on any line item for a plain-English explanation.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 mb-5 overflow-x-auto">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${activeTab === t.id ? (dark ? "bg-white/10 text-white" : "bg-gray-900 text-white") : (dark ? "text-white/30 hover:text-white/50" : "text-gray-400 hover:text-gray-600")}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ══════════════════════════════════ */}
        {/* TAB: DEAL MODEL                   */}
        {/* ══════════════════════════════════ */}
        {activeTab === "model" && (<>

          {/* Comparable Stone Selector */}
          <div className={`${cd} border rounded-2xl p-4 sm:p-5 mb-4`}>
            <h2 className={`text-[10px] sm:text-xs tracking-[0.2em] uppercase ${s1} mb-3 font-semibold`}>Select Comparable Stone</h2>
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
              {comparableStones.map((stone, i) => (
                <button key={i} onClick={() => selectStone(i)}
                  className={`shrink-0 px-3 py-2 rounded-lg border text-left transition-all ${selectedStone === i ? (dark ? "border-[#1A8B7A]/50 bg-[#1A8B7A]/10" : "border-[#1A8B7A] bg-[#1A8B7A]/5") : (dark ? "border-white/[0.06] hover:border-white/10" : "border-gray-200 hover:border-gray-300")}`}>
                  <p className={`text-[10px] sm:text-xs font-semibold ${selectedStone === i ? "text-[#1A8B7A]" : s2}`}>{stone.name}</p>
                  {stone.value > 0 && <p className={`text-[9px] font-mono ${s1}`}>{fmtFull(stone.value)} {stone.carat > 0 ? `\u00b7 ${stone.carat}ct ${stone.type}` : ""}</p>}
                </button>
              ))}
            </div>
            {selectedStone > 0 && <p className={`text-[10px] ${s1} mt-2 italic`}>{comparableStones[selectedStone].note}</p>}
          </div>

          {/* Deal Dashboard */}
          <div className={`${cd} border rounded-2xl p-4 sm:p-5 mb-4`}>
            <h2 className="text-[10px] sm:text-xs tracking-[0.2em] uppercase text-[#1A8B7A] mb-3 font-semibold">Deal Dashboard</h2>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
              {[
                { label: "Offering Value", value: fmtFull(model.offeringValue), accent: "#1A8B7A", sub: model.totalTokens + " tokens" },
                { label: "Total Deal Costs", value: fmtFull(model.totalCosts), accent: "#A61D3A", sub: pct(model.totalCosts, model.offeringValue) + " of offering" },
                { label: "PleoChrome Net (Yr 1)", value: fmtFull(model.yr1Net), accent: model.yr1Net >= 0 ? "#1B6B4A" : "#A61D3A", sub: model.yr1Net >= 0 ? pct(model.yr1Net, model.yr1Rev) + " margin" : "Below breakeven" },
                { label: "Net to Asset Holder", value: fmtFull(model.netToHolder), accent: "#C47A1A", sub: pct(model.netToHolder, assetValue) + " of claimed" },
              ].map(m => (
                <div key={m.label} className={`${cd} border rounded-xl p-2.5 sm:p-3`}>
                  <p className={`text-[8px] sm:text-[9px] tracking-wider uppercase ${s1} mb-0.5`}>{m.label}</p>
                  <p className="text-sm sm:text-lg font-bold font-mono" style={{ color: m.accent }}>{m.value}</p>
                  <p className={`text-[8px] sm:text-[9px] ${s1}`}>{m.sub}</p>
                </div>
              ))}
            </div>

            {/* Money Flow Donut */}
            <div className="mt-4 flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
              <Donut segments={[
                { label: "Asset Holder Net", value: model.netToHolder, color: "#1A8B7A" },
                { label: "BD Placement", value: model.bdFee, color: "#5B2D8E" },
                { label: "PleoChrome Revenue", value: model.yr1Rev, color: "#1B6B4A" },
                { label: "Vault + Insurance", value: (overrides["vault"] ?? 82500 * model.sf) + (overrides["insurance"] ?? 137500 * model.sf), color: "#1E3A6E" },
                { label: "Other Costs", value: model.ahCosts - (overrides["vault"] ?? 82500 * model.sf) - (overrides["insurance"] ?? 137500 * model.sf), color: "#C47A1A" },
              ]} />
              <div className="flex-1 text-center sm:text-left">
                <p className={`text-xs font-semibold ${s3} mb-1`}>Where Every Dollar Goes</p>
                <p className={`text-[10px] sm:text-xs ${s2} leading-relaxed`}>
                  Of the {fmtFull(model.offeringValue)} offering, {pct(model.netToHolder, model.offeringValue)} flows to the asset holder,
                  {" "}{pct(model.bdFee, model.offeringValue)} to the broker-dealer for distribution,
                  and {pct(model.yr1Rev, model.offeringValue)} to PleoChrome as platform revenue.
                  The remaining covers labs, appraisals, vault custody, insurance, and compliance infrastructure.
                </p>
              </div>
            </div>
          </div>

          {/* Adjustable Inputs */}
          <div className={`${cd} border rounded-2xl p-4 sm:p-5 mb-4`}>
            <h2 className={`text-[10px] sm:text-xs tracking-[0.2em] uppercase ${s1} mb-3 font-semibold`}>Adjust Deal Variables</h2>
            <div className="grid grid-cols-2 gap-x-3 gap-y-2 sm:grid-cols-4 sm:gap-3">
              {[
                { label: "Asset Value", comp: <div className={`${ib} border rounded-lg overflow-hidden`}><DollarInput value={assetValue} onChange={(v) => { setAssetValue(v); setSelectedStone(0); }} min={100000} max={1000000000} /></div> },
                { label: "Appraisal Discount", comp: <div className={`${ib} border rounded-lg overflow-hidden`}><PctInput value={appraisalDiscount} onChange={setAppraisalDiscount} min={0} max={50} /></div> },
                { label: "Token Price", comp: <div className={`${ib} border rounded-lg overflow-hidden`}><DollarInput value={tokenPrice} onChange={setTokenPrice} min={1000} max={10000000} /></div> },
                { label: "BD Placement Rate", comp: <div className={`${ib} border rounded-lg overflow-hidden`}><PctInput value={bdRate} onChange={setBdRate} min={0} max={20} /></div> },
                { label: "Setup Fee", comp: <div className={`${ib} border rounded-lg overflow-hidden`}><PctInput value={setupFeeRate} onChange={setSetupFeeRate} min={0} max={10} /></div> },
                { label: "Success Fee", comp: <div className={`${ib} border rounded-lg overflow-hidden`}><PctInput value={successFeeRate} onChange={setSuccessFeeRate} min={0} max={10} /></div> },
                { label: "Annual Admin Fee", comp: <div className={`${ib} border rounded-lg overflow-hidden`}><PctInput value={adminFeeRate} onChange={setAdminFeeRate} min={0} max={5} /></div> },
              ].map(inp => (
                <div key={inp.label}>
                  <label className={`block text-[8px] sm:text-[9px] tracking-wider uppercase ${s1} mb-1`}>{inp.label}</label>
                  {inp.comp}
                </div>
              ))}
            </div>
          </div>

          {/* Phase Costs (Collapsible) */}
          {(["Acquisition", "Preparation", "Tokenization", "Distribution"] as const).map(phase => {
            const pi = phaseInfo[phase];
            const isOpen = openPhases.has(phase);
            const phaseCosts = model.all.filter(c => c.phase === phase);
            const phaseTotal = phaseCosts.reduce((s, c) => s + c.amount, 0);
            return (
              <div key={phase} className={`${cd} border rounded-2xl mb-3 overflow-hidden`}>
                <button onClick={() => togglePhase(phase)} className={`w-full flex items-center gap-2 p-3 sm:p-4 text-left ${dark ? "hover:bg-white/[0.02]" : "hover:bg-gray-50"} transition-colors`}>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center font-mono text-[10px] font-bold text-white shrink-0" style={{ background: pi.color }}>{pi.num}</div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs sm:text-sm font-semibold ${s3}`}>{phase}</p>
                    <p className={`text-[8px] sm:text-[9px] ${s1}`}>{pi.subtitle} &middot; {phaseCosts.length} items</p>
                  </div>
                  <span className="font-mono text-xs shrink-0" style={{ color: pi.color }}>{fmtFull(phaseTotal)}</span>
                  <svg className={`w-4 h-4 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""} ${s1}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M6 9l6 6 6-6" /></svg>
                </button>
                <div className={`transition-all duration-400 overflow-hidden ${isOpen ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"}`}>
                  <div className={`border-t ${dv} px-3 sm:px-4 pb-3`}>
                    {phaseCosts.map(cost => {
                      const noteOpen = expandedNotes.has(cost.id);
                      const pbColors: Record<string, string> = { pleochrome: "text-[#1A8B7A]", "asset-holder": "text-[#C47A1A]", proceeds: "text-[#5B2D8E]" };
                      const pbLabels: Record<string, string> = { pleochrome: "PleoChrome", "asset-holder": "Asset Holder", proceeds: "Proceeds" };
                      return (
                        <div key={cost.id} className={`border-b ${dv} last:border-0 py-2.5`}>
                          <div className="flex items-start gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className={`text-[11px] sm:text-xs ${s2}`}>{cost.label}</span>
                                <span className={`text-[7px] sm:text-[8px] tracking-wider uppercase px-1.5 py-[1px] rounded ${pbColors[cost.paidBy]} ${dark ? "bg-white/[0.05]" : "bg-gray-100"}`}>{pbLabels[cost.paidBy]}</span>
                                {cost.custom && <button onClick={() => removeCustom(cost.id)} className="text-[#A61D3A] text-[9px] hover:underline">Remove</button>}
                              </div>
                              {cost.narrative && (
                                <button onClick={() => toggleNote(cost.id)} className={`text-[9px] ${s1} mt-0.5 hover:underline text-left`}>
                                  {noteOpen ? "Hide explanation \u25B2" : "What is this? \u25BC"}
                                </button>
                              )}
                              {noteOpen && cost.narrative && <p className={`text-[10px] sm:text-[11px] ${s2} mt-1.5 leading-relaxed max-w-lg`}>{cost.narrative}</p>}
                            </div>
                            <div className={`w-24 sm:w-28 shrink-0 ${ib} border rounded-md`}>
                              {cost.custom
                                ? <DollarInput value={cost.amount} compact onChange={v => updateCustom(cost.id, "amount", v)} min={0} max={999999999} />
                                : <DollarInput compact value={overrides[cost.id] !== undefined ? overrides[cost.id] : cost.amount} onChange={v => setOverrides(p => ({ ...p, [cost.id]: v }))} min={cost.min} max={cost.max} />}
                            </div>
                          </div>
                          {cost.custom && <input type="text" value={cost.label} onChange={e => updateCustom(cost.id, "label", e.target.value)} className={`mt-1 text-[10px] ${ib} border rounded px-2 py-1 w-full outline-none`} placeholder="Expense name" />}
                        </div>
                      );
                    })}
                    <button onClick={() => addCustom(phase)} className={`mt-2 text-[9px] sm:text-[10px] tracking-wider uppercase ${s1} flex items-center gap-1`}>
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 5v14M5 12h14" /></svg>
                      Add Custom Expense
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Revenue */}
          <div className={`${cd} border rounded-2xl p-4 sm:p-5 mb-3`}>
            <h2 className="text-[10px] sm:text-xs tracking-[0.2em] uppercase text-[#1B6B4A] mb-3 font-semibold">PleoChrome Revenue</h2>
            {[
              { label: `Setup Fee (${setupFeeRate}% of asset value)`, amount: model.setupFee, note: "Collected at engagement signing" },
              { label: `Success Fee (${successFeeRate}% of offering)`, amount: model.successFee, note: "Collected when token sale closes" },
              { label: "Secondary Transfer Fees (est.)", amount: 12000, note: "0.25% per transfer, ~20% annual turnover" },
              { label: `Annual Admin Fee (${adminFeeRate}%, Year 2+)`, amount: model.adminFee, note: "Recurring SaaS-like revenue" },
              { label: "Valuation Refresh (Year 2+)", amount: 25000, note: "Annual re-appraisal coordination" },
            ].map(r => (
              <div key={r.label} className={`flex items-center justify-between py-2 border-b ${dv} last:border-0`}>
                <div className="flex-1 pr-2"><p className={`text-[11px] sm:text-xs ${s2}`}>{r.label}</p><p className={`text-[9px] ${s1}`}>{r.note}</p></div>
                <span className="font-mono text-xs text-[#1B6B4A] shrink-0">{fmtFull(r.amount)}</span>
              </div>
            ))}
            <div className={`mt-3 pt-3 border-t-2 ${dark ? "border-[#1B6B4A]/20" : "border-[#1B6B4A]/10"} flex justify-between`}>
              <span className={`text-xs font-semibold ${s2}`}>Year 1 Total</span>
              <span className="font-mono text-sm font-bold text-[#1B6B4A]">{fmtFull(model.yr1Rev)}</span>
            </div>
          </div>

          {/* 120-Day Timeline */}
          <div className={`${cd} border rounded-2xl p-4 sm:p-5 mb-3`}>
            <h2 className="text-[10px] sm:text-xs tracking-[0.2em] uppercase text-[#5B2D8E] mb-1 font-semibold">120-Day Cash Flow Timeline</h2>
            <p className={`text-[10px] ${s1} mb-4`}>Shows when costs are incurred and when revenue arrives. The &ldquo;cash valley&rdquo; represents maximum capital at risk before the success fee closes the deal.</p>

            {/* Running Cash Balance */}
            <div className="relative h-24 sm:h-32 mb-4">
              <div className={`absolute inset-0 border-b border-l ${dv}`}>
                {/* Zero line */}
                <div className={`absolute w-full border-t border-dashed ${dark ? "border-white/10" : "border-gray-200"}`} style={{ bottom: "40%" }} />
                {/* Cash balance line */}
                <svg className="w-full h-full" viewBox="0 0 120 100" preserveAspectRatio="none">
                  <polyline
                    fill="none"
                    stroke="#1A8B7A"
                    strokeWidth="1.5"
                    points={model.cashPoints.map(p => {
                      const x = p.day;
                      const maxBal = Math.max(...model.cashPoints.map(cp => Math.abs(cp.bal)));
                      const y = 50 - (p.bal / (maxBal * 1.2)) * 45;
                      return `${x},${y}`;
                    }).join(" ")}
                  />
                  {model.cashPoints.map((p, i) => {
                    const maxBal = Math.max(...model.cashPoints.map(cp => Math.abs(cp.bal)));
                    const x = p.day;
                    const y = 50 - (p.bal / (maxBal * 1.2)) * 45;
                    return <circle key={i} cx={x} cy={y} r="2" fill={p.bal >= 0 ? "#1A8B7A" : "#A61D3A"} />;
                  })}
                </svg>
              </div>
              {/* Day labels */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-between px-1">
                {[0, 30, 60, 90, 120].map(d => <span key={d} className={`text-[7px] sm:text-[8px] font-mono ${s1}`}>D{d}</span>)}
              </div>
            </div>

            <div className={`grid grid-cols-3 gap-2 text-center pt-2 border-t ${dv}`}>
              <div><p className={`text-[8px] uppercase tracking-wider ${s1}`}>Total Outflows</p><p className="text-xs sm:text-sm font-mono font-semibold text-[#A61D3A]">{fmt(model.pcCosts + model.ahCosts)}</p></div>
              <div><p className={`text-[8px] uppercase tracking-wider ${s1}`}>Total Inflows</p><p className="text-xs sm:text-sm font-mono font-semibold text-[#1B6B4A]">{fmt(model.setupFee + model.successFee)}</p></div>
              <div><p className={`text-[8px] uppercase tracking-wider ${s1}`}>Net at Day 120</p><p className={`text-xs sm:text-sm font-mono font-semibold ${model.yr1Net >= 0 ? "text-[#1A8B7A]" : "text-[#A61D3A]"}`}>{fmt(model.yr1Net)}</p></div>
            </div>
          </div>

          {/* Asset Holder Economics */}
          <div className={`${cd} border rounded-2xl p-4 sm:p-5 mb-3`}>
            <h2 className="text-[10px] sm:text-xs tracking-[0.2em] uppercase text-[#C47A1A] mb-3 font-semibold">Asset Holder Economics</h2>
            <p className={`text-[10px] ${s1} mb-3`}>This waterfall shows how the asset holder&apos;s claimed value translates to actual net proceeds after all costs and fees.</p>
            {[
              { label: "Claimed Asset Value", amount: assetValue },
              { label: `Offering Value (after ${appraisalDiscount}% appraisal discount)`, amount: model.offeringValue },
              { label: `Less: BD Placement (${bdRate}%)`, amount: -model.bdFee },
              { label: `Less: PleoChrome Setup Fee (${setupFeeRate}%)`, amount: -model.setupFee },
              { label: `Less: PleoChrome Success Fee (${successFeeRate}%)`, amount: -model.successFee },
              { label: "Less: Pass-Through Costs", amount: -model.ahCosts },
            ].map(line => (
              <div key={line.label} className={`flex justify-between py-1.5 border-b ${dv} last:border-0`}>
                <span className={`text-[11px] sm:text-xs ${s2}`}>{line.label}</span>
                <span className={`font-mono text-xs ${line.amount < 0 ? "text-[#A61D3A]" : s3}`}>{fmtFull(line.amount)}</span>
              </div>
            ))}
            <div className={`mt-3 pt-3 border-t-2 ${dark ? "border-[#1A8B7A]/20" : "border-[#1A8B7A]/10"} flex justify-between items-end`}>
              <span className={`text-sm font-semibold ${s3}`}>Net Proceeds</span>
              <div className="text-right">
                <span className="font-mono text-xl font-bold text-[#1A8B7A]">{fmtFull(model.netToHolder)}</span>
                <p className={`text-[9px] ${s1}`}>{pct(model.netToHolder, assetValue)} of claimed value</p>
              </div>
            </div>
          </div>
        </>)}

        {/* ══════════════════════════════════ */}
        {/* TAB: INVESTOR VIEW                */}
        {/* ══════════════════════════════════ */}
        {activeTab === "investor" && (<>
          <div className={`${cd} border rounded-2xl p-4 sm:p-5 mb-4`}>
            <h2 className={`text-xs sm:text-sm font-semibold ${s3} mb-2`}>Investor Return Calculator</h2>
            <p className={`text-[10px] sm:text-[11px] ${s2} leading-relaxed mb-4`}>
              Model your potential returns as an investor in a PleoChrome tokenized gemstone offering. Adjust your investment amount, expected annual appreciation of the underlying stone, and holding period to see projected outcomes.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
              <div>
                <label className={`block text-[8px] sm:text-[9px] tracking-wider uppercase ${s1} mb-1`}>Your Investment</label>
                <div className={`${ib} border rounded-lg overflow-hidden`}><DollarInput value={investorReturn} onChange={setInvestorReturn} min={100000} max={50000000} /></div>
              </div>
              <div>
                <label className={`block text-[8px] sm:text-[9px] tracking-wider uppercase ${s1} mb-1`}>Annual Appreciation</label>
                <div className={`${ib} border rounded-lg overflow-hidden`}><PctInput value={appreciation} onChange={setAppreciation} min={-20} max={50} /></div>
              </div>
              <div>
                <label className={`block text-[8px] sm:text-[9px] tracking-wider uppercase ${s1} mb-1`}>Holding Period (Years)</label>
                <div className={`${ib} border rounded-lg overflow-hidden`}>
                  <input type="number" value={holdYears} onChange={e => setHoldYears(Math.max(1, Math.min(20, Number(e.target.value))))}
                    className="w-full bg-transparent text-sm py-2 px-3 text-right font-mono outline-none" />
                </div>
              </div>
            </div>

            {/* Scenarios Table */}
            <div className="overflow-x-auto -mx-2 px-2">
              <table className="w-full text-xs min-w-[400px]">
                <thead><tr className={`text-[9px] tracking-wider uppercase ${s1}`}>
                  <th className="text-left py-2">Scenario</th><th className="text-right py-2">Annual</th><th className="text-right py-2">Future Value</th><th className="text-right py-2">Profit</th><th className="text-right py-2">Total Return</th>
                </tr></thead>
                <tbody className="font-mono">
                  {[
                    { label: "Conservative", rate: Math.max(0, appreciation - 5) },
                    { label: "Base Case", rate: appreciation },
                    { label: "Optimistic", rate: appreciation + 5 },
                    { label: "Bull Case", rate: appreciation + 15 },
                  ].map(sc => {
                    const fv = investorReturn * Math.pow(1 + sc.rate / 100, holdYears);
                    const profit = fv - investorReturn;
                    const totalReturn = ((fv / investorReturn) - 1) * 100;
                    return (
                      <tr key={sc.label} className={`border-t ${dv}`}>
                        <td className={`py-2 font-sans ${s2}`}>{sc.label}</td>
                        <td className={`text-right ${s1}`}>{sc.rate}%</td>
                        <td className="text-right text-[#1A8B7A]">{fmtFull(Math.round(fv))}</td>
                        <td className={`text-right ${profit >= 0 ? "text-[#1B6B4A]" : "text-[#A61D3A]"}`}>{fmtFull(Math.round(profit))}</td>
                        <td className={`text-right ${totalReturn >= 0 ? "text-[#1A8B7A]" : "text-[#A61D3A]"}`}>{totalReturn.toFixed(1)}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* What You Own */}
          <div className={`${cd} border rounded-2xl p-4 sm:p-5 mb-4`}>
            <h2 className={`text-xs sm:text-sm font-semibold ${s3} mb-2`}>What Your Investment Represents</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Tokens Owned", value: model.tokensForInvestment.toString(), sub: `of ${model.totalTokens} total` },
                { label: "Ownership %", value: pct(model.tokensForInvestment, model.totalTokens), sub: "of the tokenized stone" },
                { label: `Value in ${holdYears} Years`, value: fmtFull(Math.round(model.futureValue)), sub: `at ${appreciation}% annual appreciation` },
                { label: "Total Profit", value: fmtFull(Math.round(model.investorProfit)), sub: `${((model.futureValue / investorReturn - 1) * 100).toFixed(1)}% total return` },
              ].map(m => (
                <div key={m.label} className={`${cd} border rounded-xl p-3`}>
                  <p className={`text-[8px] sm:text-[9px] tracking-wider uppercase ${s1} mb-0.5`}>{m.label}</p>
                  <p className={`text-base sm:text-lg font-bold font-mono ${s3}`}>{m.value}</p>
                  <p className={`text-[8px] sm:text-[9px] ${s1}`}>{m.sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Investor Protections */}
          <div className={`${cd} border rounded-2xl p-4 sm:p-5 mb-4`}>
            <h2 className={`text-xs sm:text-sm font-semibold ${s3} mb-3`}>Built-In Investor Protections</h2>
            {[
              { title: "3-Appraisal Rule", desc: "Three independent, USPAP-compliant appraisals. The two lowest are averaged to set the offering price \u2014 structurally conservative by design." },
              { title: "Oracle-Gated Minting", desc: "Chainlink Proof of Reserve verifies the stone is in vault custody before any tokens can be created. The smart contract physically cannot mint tokens without oracle confirmation." },
              { title: "ERC-3643 Compliance", desc: "Every token transfer is automatically verified at the smart contract level: KYC status, accreditation, jurisdiction, and holding limits. Non-compliant transfers are blocked before execution." },
              { title: "Segregated Custody", desc: "Your stone is stored alone in an institutional vault (Brink's or Malca-Amit) \u2014 never commingled with other assets. Insured by Lloyd's of London or equivalent." },
              { title: "Bankruptcy Remoteness", desc: "Each stone is held in its own Series LLC. If PleoChrome or any other stone faces legal issues, your investment is structurally isolated." },
            ].map(p => (
              <div key={p.title} className={`py-2.5 border-b ${dv} last:border-0`}>
                <p className={`text-xs font-semibold ${s3}`}>{p.title}</p>
                <p className={`text-[10px] sm:text-[11px] ${s2} leading-relaxed mt-0.5`}>{p.desc}</p>
              </div>
            ))}
          </div>
        </>)}

        {/* ══════════════════════════════════ */}
        {/* TAB: SCENARIOS                    */}
        {/* ══════════════════════════════════ */}
        {activeTab === "scenarios" && (<>
          {/* Break-Even Analysis */}
          <div className={`${cd} border rounded-2xl p-4 sm:p-5 mb-4`}>
            <h2 className={`text-xs sm:text-sm font-semibold ${s3} mb-2`}>Break-Even Analysis</h2>
            <p className={`text-[10px] sm:text-[11px] ${s2} leading-relaxed mb-4`}>
              PleoChrome&apos;s costs are largely fixed regardless of stone value, creating significant operating leverage. The break-even point is where PleoChrome&apos;s revenue from fees covers its direct costs.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
              <div className={`${cd} border rounded-xl p-3`}>
                <p className={`text-[8px] tracking-wider uppercase ${s1} mb-0.5`}>Fixed Platform Costs</p>
                <p className="text-lg font-bold font-mono text-[#A61D3A]">{fmtFull(model.fixedCosts)}</p>
              </div>
              <div className={`${cd} border rounded-xl p-3`}>
                <p className={`text-[8px] tracking-wider uppercase ${s1} mb-0.5`}>Break-Even Asset Value</p>
                <p className="text-lg font-bold font-mono text-[#C47A1A]">{fmt(model.breakeven)}</p>
              </div>
              <div className={`${cd} border rounded-xl p-3`}>
                <p className={`text-[8px] tracking-wider uppercase ${s1} mb-0.5`}>Current Margin</p>
                <p className={`text-lg font-bold font-mono ${model.yr1Net >= 0 ? "text-[#1B6B4A]" : "text-[#A61D3A]"}`}>{pct(model.yr1Net, model.yr1Rev)}</p>
              </div>
            </div>

            {/* Sensitivity Table */}
            <h3 className={`text-[10px] tracking-wider uppercase ${s1} mb-2 font-semibold`}>Sensitivity: Asset Value vs. PleoChrome Net Income</h3>
            <div className="overflow-x-auto -mx-2 px-2">
              <table className="w-full text-[10px] sm:text-xs min-w-[400px]">
                <thead><tr className={`${s1} text-[9px] tracking-wider uppercase`}>
                  <th className="text-left py-1.5">Asset Value</th><th className="text-right">Revenue</th><th className="text-right">Costs</th><th className="text-right">Net</th><th className="text-right">Margin</th>
                </tr></thead>
                <tbody className="font-mono">
                  {[5_000_000, 10_000_000, 25_000_000, 55_000_000, 100_000_000, 250_000_000].map(av => {
                    const ov = av * (1 - appraisalDiscount / 100);
                    const rev = av * (setupFeeRate / 100) + ov * (successFeeRate / 100) + 12000;
                    const net = rev - model.fixedCosts;
                    const isActive = av === assetValue;
                    return (
                      <tr key={av} className={`border-t ${dv} ${isActive ? (dark ? "bg-white/[0.03]" : "bg-[#1A8B7A]/5") : ""}`}>
                        <td className={`py-1.5 ${isActive ? "font-semibold" : ""} ${s2}`}>{fmtFull(av)}</td>
                        <td className="text-right text-[#1B6B4A]">{fmt(rev)}</td>
                        <td className="text-right text-[#A61D3A]">{fmt(model.fixedCosts)}</td>
                        <td className={`text-right font-semibold ${net >= 0 ? "text-[#1A8B7A]" : "text-[#A61D3A]"}`}>{fmt(net)}</td>
                        <td className={`text-right ${net >= 0 ? "text-[#1A8B7A]" : "text-[#A61D3A]"}`}>{rev > 0 ? pct(net, rev) : "N/A"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Multi-Year Portfolio Projection */}
          <div className={`${cd} border rounded-2xl p-4 sm:p-5 mb-4`}>
            <h2 className={`text-xs sm:text-sm font-semibold ${s3} mb-2`}>5-Year Portfolio Projection</h2>
            <p className={`text-[10px] sm:text-[11px] ${s2} leading-relaxed mb-4`}>
              As PleoChrome scales from one stone to a portfolio, fixed costs are amortized across multiple assets and margins expand significantly. Legal templates, Chainlink infrastructure, and the Brickken platform serve all stones simultaneously.
            </p>
            <div className="overflow-x-auto -mx-2 px-2">
              <table className="w-full text-[10px] sm:text-xs min-w-[500px]">
                <thead><tr className={`${s1} text-[9px] tracking-wider uppercase`}>
                  <th className="text-left py-1.5">Year</th><th className="text-right">Stones</th><th className="text-right">AUM</th><th className="text-right">Revenue</th><th className="text-right">Net Income</th><th className="text-right">Margin</th>
                </tr></thead>
                <tbody className="font-mono">
                  {[
                    { yr: 1, stones: 1, aum: model.offeringValue, rev: model.yr1Rev, net: model.yr1Net },
                    { yr: 2, stones: 3, aum: model.offeringValue * 3.5, rev: model.yr1Rev * 2 + model.yr2Rev, net: model.yr1Rev * 2 + model.yr2Rev - model.fixedCosts * 1.8 },
                    { yr: 3, stones: 7, aum: model.offeringValue * 7, rev: model.yr1Rev * 3 + model.yr2Rev * 3, net: model.yr1Rev * 3 + model.yr2Rev * 3 - model.fixedCosts * 2.5 },
                    { yr: 4, stones: 12, aum: model.offeringValue * 12, rev: model.yr1Rev * 4 + model.yr2Rev * 6, net: model.yr1Rev * 4 + model.yr2Rev * 6 - model.fixedCosts * 3 },
                    { yr: 5, stones: 20, aum: model.offeringValue * 20, rev: model.yr1Rev * 5 + model.yr2Rev * 10, net: model.yr1Rev * 5 + model.yr2Rev * 10 - model.fixedCosts * 3.5 },
                  ].map(row => (
                    <tr key={row.yr} className={`border-t ${dv}`}>
                      <td className={`py-1.5 ${s2}`}>Year {row.yr}</td>
                      <td className={`text-right ${s2}`}>{row.stones}</td>
                      <td className="text-right text-[#1E3A6E]">{fmt(row.aum)}</td>
                      <td className="text-right text-[#1B6B4A]">{fmt(row.rev)}</td>
                      <td className={`text-right font-semibold ${row.net >= 0 ? "text-[#1A8B7A]" : "text-[#A61D3A]"}`}>{fmt(row.net)}</td>
                      <td className={`text-right ${row.net >= 0 ? "text-[#1A8B7A]" : "text-[#A61D3A]"}`}>{row.rev > 0 ? pct(row.net, row.rev) : "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Key Unit Economics */}
          <div className={`${cd} border rounded-2xl p-4 sm:p-5 mb-4`}>
            <h2 className={`text-xs sm:text-sm font-semibold ${s3} mb-3`}>Unit Economics</h2>
            <p className={`text-[10px] sm:text-[11px] ${s2} leading-relaxed mb-4`}>
              These are the metrics institutional investors use to evaluate platform businesses. PleoChrome&apos;s economics improve dramatically with scale because platform costs are largely fixed while revenue scales linearly with asset value and portfolio size.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: "Revenue per Stone (Yr 1)", value: fmtFull(model.yr1Rev), note: "Setup + success + transfers" },
                { label: "Gross Margin per Stone", value: pct(model.yr1Net, model.yr1Rev), note: "After all PleoChrome direct costs" },
                { label: "Annual Recurring Revenue", value: fmtFull(model.yr2Rev), note: "Per stone, starting Year 2" },
                { label: "CAC (Est.)", value: fmtFull(Math.round((overrides["marketing"] ?? 200000) / 120)), note: "Marketing spend \u00F7 target investors" },
                { label: "LTV per Stone (5yr)", value: fmtFull(model.yr1Rev + model.yr2Rev * 4), note: "Year 1 rev + 4 years recurring" },
                { label: "Payback Period", value: model.yr1Net >= 0 ? "< 120 days" : "Not yet profitable", note: "Time to recover setup costs" },
              ].map(m => (
                <div key={m.label} className={`${cd} border rounded-xl p-3`}>
                  <p className={`text-[8px] tracking-wider uppercase ${s1} mb-0.5`}>{m.label}</p>
                  <p className={`text-base font-bold font-mono ${s3}`}>{m.value}</p>
                  <p className={`text-[8px] ${s1}`}>{m.note}</p>
                </div>
              ))}
            </div>
          </div>
        </>)}

      </div>

      <footer className={`text-center py-6 border-t ${dv}`}>
        <div className="flex gap-[2px] justify-center mb-2">
          {["#1B6B4A","#1A8B7A","#1E3A6E","#5B2D8E","#A61D3A","#C47A1A","#7BA31E"].map(c => (
            <span key={c} className="h-[2px] w-4 rounded-sm" style={{ background: c }} />
          ))}
        </div>
        <p className={`text-[10px] tracking-[0.15em] ${s1}`}>PleoChrome &mdash; Confidential &mdash; Florida</p>
      </footer>
    </div>
  );
}
