"use client";

import { useState, useMemo, useCallback } from "react";
import Image from "next/image";

const PASSCODE = "pleo123";

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
  // ACQUISITION — lean defaults
  { id:"kyc",label:"KYC / KYB on Asset Holder",narrative:"Identity verification on the stone owner. Includes government ID check with liveness detection, entity verification for businesses, and identification of all owners with >25% stake. Brickken\u2019s Advanced tier includes 150 KYC checks, so this may already be covered by the platform subscription. Standalone cost via Veriff: $0.80/check or Didit: free for up to 500/month.",phase:"Acquisition",paidBy:"pleochrome",defaultAmount:50,fixed:true,min:0,max:5000 },
  { id:"sanctions",label:"Sanctions & PEP Screening",narrative:"Screening against OFAC SDN, EU/UN sanctions, and PEP databases. Typically bundled with KYC provider at no additional cost, or $10-$50 per screening via Sumsub Compliance tier. A single sanctions hit halts the entire process \u2014 this protects everyone from criminal and regulatory liability.",phase:"Acquisition",paidBy:"pleochrome",defaultAmount:100,fixed:true,min:0,max:5000 },
  { id:"provenance",label:"Provenance Research",narrative:"Tracing the stone\u2019s ownership history from mine to current holder. Confirms no competing claims, liens, or encumbrances. Like a title search for real estate. For stones with existing auction/dealer records, this is straightforward. Stones with gaps require more investigation. Hourly legal research at $150-$250/hr.",phase:"Acquisition",paidBy:"asset-holder",defaultAmount:2500,fixed:true,min:500,max:50000 },
  { id:"intake-legal",label:"Intake Agreement (Legal)",narrative:"The engagement contract between PleoChrome and the stone owner. A boutique securities attorney can draft this from a template for $1,500-$3,000. The first one costs more; subsequent stones reuse the template with modifications. This becomes a standard form document after the first deal.",phase:"Acquisition",paidBy:"pleochrome",defaultAmount:2500,fixed:true,min:500,max:25000 },
  // PREPARATION — lean defaults
  { id:"gia",label:"GIA Grading Report",narrative:"The global gold standard for gemstone certification. Most high-value stones already have a GIA report \u2014 these travel with the stone through its lifetime. If a fresh report is needed, GIA charges $150-$500 for colored stones depending on carat weight. For a $55M stone, the report almost certainly already exists.",phase:"Preparation",paidBy:"asset-holder",defaultAmount:0,fixed:true,min:0,max:5000 },
  { id:"ssef",label:"SSEF Origin Report",narrative:"The Swiss Gemmological Institute determines where the stone was mined using spectroscopy. Origin dramatically affects value \u2014 a Burmese ruby can be worth 2-5x a Mozambican one. Published price: CHF 4,000 (~$4,500) for a 50-100ct ID + Origin report. Most $55M stones already have this report.",phase:"Preparation",paidBy:"asset-holder",defaultAmount:0,fixed:true,min:0,max:15000 },
  { id:"gubelin",label:"Gub\u00e9lin Report (Optional)",narrative:"Third lab certification for maximum credibility. For stones above $10M, triple-lab (GIA + SSEF + Gub\u00e9lin) is the auction house standard. ~$4,000-$5,000 if needed. Set to $0 if the stone already has existing certifications, which is typical for stones at this price point.",phase:"Preparation",paidBy:"asset-holder",defaultAmount:0,fixed:true,min:0,max:15000 },
  { id:"appraisal1",label:"Independent Appraisal #1",narrative:"A CGA or MGA appraiser physically inspects the stone and writes a USPAP-compliant valuation report. Appraisers charge hourly ($150-$250/hr), not by percentage of value (USPAP prohibits %-based fees). For a high-value stone: 20-40 hours of research + inspection + written report.",phase:"Preparation",paidBy:"asset-holder",defaultAmount:7500,scaleFactor:0.6,min:1000,max:100000 },
  { id:"appraisal2",label:"Independent Appraisal #2",narrative:"Second independent appraiser with zero affiliation to the first. Stone shipped with insured transit. They don\u2019t know what the first appraiser valued the stone at. This independence is the cornerstone of PleoChrome\u2019s investor protection model.",phase:"Preparation",paidBy:"asset-holder",defaultAmount:7500,scaleFactor:0.6,min:1000,max:100000 },
  { id:"appraisal3",label:"Independent Appraisal #3",narrative:"Third appraisal completes the 3-Appraisal Rule. Once all three are in, we average the two lowest to set the offering price. This structural conservatism protects investors from inflated pricing and eliminates appraiser bias.",phase:"Preparation",paidBy:"asset-holder",defaultAmount:7500,scaleFactor:0.6,min:1000,max:100000 },
  { id:"transit-ins",label:"Transit Insurance",narrative:"Specialized inland marine insurance for each shipment between labs, appraisers, and vault. If the stone is already vaulted and appraisers visit the vault (common for ultra-high-value stones), transit costs drop significantly. Budget 2-4 transits at $2K-$5K each scaled to stone value.",phase:"Preparation",paidBy:"asset-holder",defaultAmount:10000,scaleFactor:1,min:0,max:500000 },
  { id:"vault",label:"Vault Custody (Year 1)",narrative:"Segregated storage at Brink\u2019s or Malca-Amit. Annual rate negotiated to 0.10-0.15% for a high-value single item. The stone owner may already have a vault relationship \u2014 leveraging existing arrangements avoids new setup costs. This is the asset owner\u2019s cost, not PleoChrome\u2019s.",phase:"Preparation",paidBy:"asset-holder",defaultAmount:55000,scaleFactor:1,min:5000,max:1000000 },
  { id:"insurance",label:"Specie Insurance (Year 1)",narrative:"Specialized vault-storage insurance from Lloyd\u2019s, AXA XL, or Munich Re. Rate: 0.10-0.15% for vault-stored items with no transit risk (much lower than the 1-2% retail jewelry rate). The asset owner or SPV carries this policy, not PleoChrome. The platform\u2019s direct insurance cost is $0.",phase:"Preparation",paidBy:"asset-holder",defaultAmount:55000,scaleFactor:1,min:5000,max:2000000 },
  { id:"chainlink-setup",label:"Chainlink Oracle Integration",narrative:"Chainlink\u2019s BUILD program provides free access to Proof of Reserve for early-stage projects in exchange for a token supply commitment (3-7%). If PleoChrome doesn\u2019t issue its own token, direct negotiation is needed. For low-frequency PoR feeds (monthly vault attestation), LINK token gas costs are minimal \u2014 $50-$200/month.",phase:"Preparation",paidBy:"pleochrome",defaultAmount:2500,fixed:true,min:0,max:500000 },
  { id:"chainlink-yr1",label:"Chainlink LINK Fees (Year 1)",narrative:"Ongoing LINK token costs to pay oracle operators for vault attestation data feeds. For a monthly or quarterly update frequency (not real-time), this is approximately $50-$200/month in LINK. Annual cost: $600-$2,400. This is the actual operating cost, not an enterprise license fee.",phase:"Preparation",paidBy:"pleochrome",defaultAmount:1200,fixed:true,min:100,max:50000 },
  { id:"spv",label:"SPV Formation (Series LLC)",narrative:"Wyoming Series LLC formation: $100 state filing + $25-$125/yr registered agent + $0 EIN from IRS. The operating agreement can be drafted from templates for $500-$1,500 by a boutique attorney (or $0 using open-source templates with attorney review). Each new stone series costs only an internal amendment, not a new state filing.",phase:"Preparation",paidBy:"pleochrome",defaultAmount:750,fixed:true,min:160,max:50000 },
  { id:"ppm",label:"PPM (Offering Document)",narrative:"The legal disclosure document every investor reads. A boutique securities attorney specializing in Reg D 506(c) and digital assets can draft this for $7,500-$12,000 flat fee (not $50K+ BigLaw rates). The first PPM costs more; subsequent offerings reuse the template with stone-specific modifications at $3,000-$5,000 each.",phase:"Preparation",paidBy:"pleochrome",defaultAmount:10000,scaleFactor:0.2,min:3000,max:200000 },
  { id:"sub-agreement",label:"Subscription Agreement",narrative:"The investor sign-up contract. Typically bundled with the PPM engagement or drafted separately for $1,500-$3,000. After the first deal, this becomes a standard template requiring minimal customization per stone.",phase:"Preparation",paidBy:"pleochrome",defaultAmount:2000,fixed:true,min:500,max:30000 },
  { id:"token-agreement",label:"Token Purchase Agreement",narrative:"Connects the blockchain token to legal SPV ownership rights. A specialized document, but once the template exists from the first deal, subsequent stones require only minor modifications. First-deal cost: $2,000-$3,000.",phase:"Preparation",paidBy:"pleochrome",defaultAmount:2500,fixed:true,min:500,max:30000 },
  { id:"media",label:"Photo & Media Documentation",narrative:"Professional gemstone photography (8+ angles, macro, 360 video) plus weight verification. Can be done at the vault facility during intake. $1,000-$3,000 for a professional gemstone photographer. Or $500 if the vault\u2019s own documentation is sufficient.",phase:"Preparation",paidBy:"asset-holder",defaultAmount:2000,fixed:true,min:500,max:25000 },
  // TOKENIZATION — lean defaults
  { id:"brickken",label:"Brickken Platform (Year 1)",narrative:"Brickken\u2019s Advanced tier (EUR 499/mo or EUR 5,000/yr) covers: token deployment from pre-audited ERC-3643 factory contracts, 150 KYC checks included, compliance guidance, multi-chain support, and investor management. You do NOT need the Enterprise tier ($22K) for a first offering. The contracts are already audited by Brickken.",phase:"Tokenization",paidBy:"pleochrome",defaultAmount:5500,fixed:true,min:3000,max:100000 },
  { id:"audit",label:"Configuration Review",narrative:"Since Brickken deploys pre-audited ERC-3643 factory contracts, you do NOT need a full $50K-$100K custom smart contract audit. What you need is a configuration review \u2014 verifying your specific deployment parameters (compliance rules, identity settings, transfer restrictions) are correctly set. A boutique security firm charges $2,500-$5,000 for this. Or it may be covered by Brickken\u2019s compliance guidance.",phase:"Tokenization",paidBy:"pleochrome",defaultAmount:3500,fixed:true,min:0,max:300000 },
  { id:"dev",label:"Development & Testing",narrative:"Configuring token parameters in Brickken, running testnet deployment, verifying compliance rules, and connecting the Chainlink PoR feed. If using Brickken\u2019s dashboard (not custom API integration), this is 10-30 hours of work, not 100+. A blockchain developer or even a technical co-founder can handle this.",phase:"Tokenization",paidBy:"pleochrome",defaultAmount:5000,fixed:true,min:0,max:100000 },
  { id:"gas",label:"Blockchain Gas Fees",narrative:"Polygon transaction fees to deploy contracts. Under $1 per transaction. Multiple contract deployments + test transactions = $50-$200 total. This is essentially free compared to Ethereum ($5-$50+ per tx).",phase:"Tokenization",paidBy:"pleochrome",defaultAmount:100,fixed:true,min:10,max:5000 },
  { id:"bluesky",label:"Blue Sky Filings (Target States)",narrative:"You only file in states where your actual investors reside \u2014 NOT all 50 states. For a first offering targeting 3-5 states through your existing network: $300-$900 in government fees + $200-$500 for a filing service. File via NASAA\u2019s electronic system (EFD). All 50 states is unnecessary and costs $13K+.",phase:"Tokenization",paidBy:"pleochrome",defaultAmount:1500,fixed:true,min:300,max:25000 },
  // DISTRIBUTION — lean defaults
  { id:"marketing",label:"Marketing & Investor Acquisition",narrative:"Under 506(c), you can advertise publicly. But for a first offering, your existing network is the primary channel. LinkedIn Sales Navigator ($120/mo), targeted LinkedIn ads ($500-$1,000 burst), direct outreach via email, and one virtual investor webinar. Total 6-month budget: $1,700-$3,000. No placement agent needed for the first deal.",phase:"Distribution",paidBy:"pleochrome",defaultAmount:3000,scaleFactor:0.3,min:500,max:5000000 },
  { id:"investor-kyc",label:"Investor KYC & Accreditation",narrative:"Covered by Brickken\u2019s included 150 KYC checks at the Advanced tier. For accredited investor verification: investments of $200K+ allow self-certification under March 2025 SEC guidance \u2014 the investor signs a letter, no third-party verification needed. Below $200K: use VerifyInvestor.com at $50-$150/investor.",phase:"Distribution",paidBy:"pleochrome",defaultAmount:0,fixed:true,min:0,max:100000 },
  { id:"transfer-agent",label:"Transfer Agent",narrative:"For a first Reg D 506(c) offering, you do NOT need a separate registered transfer agent. The ERC-3643 on-chain identity registry IS your shareholder record. Brickken\u2019s platform maintains the cap table. Per the SEC\u2019s Jan 2026 statement, blockchain can serve as the master securityholder file. Budget $0 for the first offering; add a TA ($5K-$15K/yr) when you scale to secondary trading.",phase:"Distribution",paidBy:"pleochrome",defaultAmount:0,fixed:true,min:0,max:150000 },
  { id:"data-room",label:"Investor Portal / Data Room",narrative:"A secure online workspace for investors to access the PPM, certifications, vault receipts, and reports. For a first offering: a simple password-protected page on your existing website (already built on Vercel) or Google Drive shared folder costs $0. As you scale, use Dealroom or Intralinks at $200-$500/month.",phase:"Distribution",paidBy:"pleochrome",defaultAmount:0,fixed:true,min:0,max:50000 },
  { id:"compliance-yr1",label:"Compliance Monitoring (Year 1)",narrative:"Quarterly sanctions re-screening of investors (included in Brickken or $1-$2/check via Sumsub). Transaction monitoring is built into ERC-3643 smart contracts. The main cost is your time managing the compliance program, not software subscriptions. Budget for annual re-screening of ~50-100 investors.",phase:"Distribution",paidBy:"pleochrome",defaultAmount:500,fixed:true,min:0,max:100000 },
  { id:"aml-audit",label:"Annual AML Program Audit",narrative:"Independent third-party review of your AML program. Required by regulation, but for a startup with one offering and <100 investors, a boutique compliance consultant can do this for $3,000-$5,000 (not $15K+). The first year may only require a program setup review, not a full operational audit.",phase:"Distribution",paidBy:"pleochrome",defaultAmount:3500,fixed:true,min:1000,max:50000 },
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [activeTab] = useState("model");

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

  // Export to CSV
  const exportCSV = () => {
    const rows: string[][] = [
      ["PleoChrome Deal Model — " + new Date().toLocaleDateString()],
      [],
      ["DEAL PARAMETERS"],
      ["Asset Value", fmtFull(assetValue)],
      ["Appraisal Discount", appraisalDiscount + "%"],
      ["Offering Value", fmtFull(model.offeringValue)],
      ["Token Price", fmtFull(tokenPrice)],
      ["Total Tokens", String(model.totalTokens)],
      ["BD Placement Rate", bdRate + "%"],
      ["Setup Fee Rate", setupFeeRate + "%"],
      ["Success Fee Rate", successFeeRate + "%"],
      ["Admin Fee Rate (Annual)", adminFeeRate + "%"],
      [],
      ["DEAL DASHBOARD"],
      ["Offering Value", fmtFull(model.offeringValue)],
      ["Total Deal Costs", fmtFull(model.totalCosts)],
      ["PleoChrome Year 1 Revenue", fmtFull(model.yr1Rev)],
      ["PleoChrome Year 1 Net Income", fmtFull(model.yr1Net)],
      ["Net to Asset Holder", fmtFull(model.netToHolder)],
      [],
      ["PHASE-BY-PHASE COSTS"],
      ["Line Item", "Phase", "Paid By", "Amount"],
    ];
    model.all.forEach(c => {
      const pb = c.paidBy === "pleochrome" ? "PleoChrome" : c.paidBy === "asset-holder" ? "Asset Holder" : "Proceeds";
      rows.push([c.label, c.phase, pb, fmtFull(c.amount)]);
    });
    rows.push([]);
    rows.push(["COST SUMMARY"]);
    rows.push(["PleoChrome Direct Costs", "", "", fmtFull(model.pcCosts)]);
    rows.push(["Asset Holder Pass-Through", "", "", fmtFull(model.ahCosts)]);
    rows.push(["BD Placement Fee (" + bdRate + "%)", "", "", fmtFull(model.bdFee)]);
    rows.push(["Total All Costs", "", "", fmtFull(model.totalCosts)]);
    rows.push([]);
    rows.push(["REVENUE"]);
    rows.push(["Setup Fee (" + setupFeeRate + "% of asset)", "", "", fmtFull(model.setupFee)]);
    rows.push(["Success Fee (" + successFeeRate + "% of offering)", "", "", fmtFull(model.successFee)]);
    rows.push(["Secondary Transfer Fees (est.)", "", "", "$12,000"]);
    rows.push(["Year 1 Total Revenue", "", "", fmtFull(model.yr1Rev)]);
    rows.push(["Annual Admin Fee (Year 2+)", "", "", fmtFull(model.adminFee)]);
    rows.push([]);
    rows.push(["ASSET HOLDER ECONOMICS"]);
    rows.push(["Claimed Asset Value", "", "", fmtFull(assetValue)]);
    rows.push(["Offering Value", "", "", fmtFull(model.offeringValue)]);
    rows.push(["Less: BD Placement", "", "", fmtFull(-model.bdFee)]);
    rows.push(["Less: PleoChrome Setup Fee", "", "", fmtFull(-model.setupFee)]);
    rows.push(["Less: PleoChrome Success Fee", "", "", fmtFull(-model.successFee)]);
    rows.push(["Less: Pass-Through Costs", "", "", fmtFull(-model.ahCosts)]);
    rows.push(["Net Proceeds to Asset Holder", "", "", fmtFull(model.netToHolder)]);

    const csv = rows.map(r => r.map(c => '"' + String(c).replace(/"/g, '""') + '"').join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "PleoChrome-Deal-Model-" + new Date().toISOString().slice(0, 10) + ".csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`min-h-screen ${bg} ${tx} transition-colors duration-300`} style={{ "--donut-bg": donutBg } as React.CSSProperties}>
      {/* Header */}
      <header className="text-center pt-6 pb-4 sm:pt-10 sm:pb-6 relative px-4">
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2 flex-wrap">
          <Image src={logo} alt="PleoChrome" width={140} height={35} className="h-5 sm:h-6 w-auto opacity-60" />
          <button onClick={() => setDark(!dark)} className={`text-[9px] sm:text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full border transition-colors ${dark ? "border-white/10 text-white/30" : "border-gray-300 text-gray-400"}`}>
            {dark ? "Light" : "Dark"}
          </button>
          <button onClick={exportCSV} className={`text-[9px] sm:text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full border transition-colors flex items-center gap-1 ${dark ? "border-[#1B6B4A]/30 text-[#1B6B4A] hover:border-[#1B6B4A]/60" : "border-[#1B6B4A]/30 text-[#1B6B4A] hover:border-[#1B6B4A]"}`}>
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
            Export CSV
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

        {/* ══════════════════════════════════
         Removed tabs: Investor View, Market, Scenarios, Fundraise
         Available in standalone pages if needed
         ══════════════════════════════════ */}

        {false && (<>
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

        {/* ══════════════════════════════════ */}
        {/* TAB: MARKET                       */}
        {/* ══════════════════════════════════ */}
        {activeTab === "market" && (<>

          {/* What is Market Sizing */}
          <div className={`${cd} border rounded-2xl p-4 sm:p-5 mb-4`}>
            <h2 className={`text-xs sm:text-sm font-semibold ${s3} mb-2`}>Understanding Market Sizing</h2>
            <p className={`text-[10px] sm:text-[11px] ${s2} leading-relaxed`}>
              Investors want to know: &ldquo;How big could this get?&rdquo; We answer that with three concentric circles. <strong>TAM</strong> (Total Addressable Market) is the entire universe of potential value. <strong>SAM</strong> (Serviceable Addressable Market) is the slice we could realistically serve with our current model. <strong>SOM</strong> (Serviceable Obtainable Market) is what we expect to actually capture in the next 5 years. Think of it like fishing: TAM is the ocean, SAM is the lake we&apos;re fishing in, and SOM is the fish we expect to catch.
            </p>
          </div>

          {/* TAM / SAM / SOM */}
          <div className={`${cd} border rounded-2xl p-4 sm:p-5 mb-4`}>
            <h2 className="text-[10px] sm:text-xs tracking-[0.2em] uppercase text-[#1A8B7A] mb-4 font-semibold">Market Opportunity</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
              {[
                { label: "TAM", title: "Total Addressable Market", value: "$16T+", sub: "Tokenized RWA by 2030", color: "#1E3A6E", desc: "Boston Consulting Group projects the total tokenized real-world asset market will reach $16 trillion by 2030. Today it\u2019s $21.4 billion \u2014 meaning the market needs to grow roughly 750x. The global gemstone market alone is $38 billion and growing 6% annually. This is the entire ocean of opportunity." },
                { label: "SAM", title: "Serviceable Addressable", value: "$2-5B", sub: "High-value colored gemstones", color: "#1A8B7A", desc: "Of all gemstones in the world, PleoChrome targets a specific slice: colored gemstones (not diamonds) valued at $100K or more, with GIA-certifiable quality and clean provenance. The accumulated stock of these investment-grade stones in private collections is estimated at $20-50 billion. Of those, $2-5 billion are realistically available for tokenization in the near term." },
                { label: "SOM", title: "Obtainable in 5 Years", value: "$500M-$800M", sub: "PleoChrome GMV", color: "#1B6B4A", desc: "Based on how fast comparable platforms have grown (Masterworks went from $0 to $941M in art assets in 5 years), PleoChrome targeting $500-800M in tokenized gemstone value by Year 5 is aggressive but achievable. This would represent 500-800 stones at an average value of $1M each, generating $15-40M in annual platform revenue." },
              ].map(m => (
                <div key={m.label} className={`${cd} border rounded-xl p-4`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded" style={{ color: m.color, background: m.color + "15" }}>{m.label}</span>
                    <span className={`text-[9px] ${s1}`}>{m.title}</span>
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold font-mono mb-1" style={{ color: m.color }}>{m.value}</p>
                  <p className={`text-[10px] font-medium ${s2} mb-2`}>{m.sub}</p>
                  <p className={`text-[10px] ${s1} leading-relaxed`}>{m.desc}</p>
                </div>
              ))}
            </div>

            {/* Key stats */}
            <h3 className={`text-[10px] tracking-wider uppercase ${s1} mb-2 font-semibold`}>Market Growth Signals</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { stat: "308%", label: "RWA growth (3yr)", note: "CoinDesk 2025" },
                { stat: "749%", label: "Tokenized alt funds YoY", note: "Canton Network" },
                { stat: "54%", label: "Financial firms investing", note: "Broadridge 2026" },
                { stat: "$2.5B+", label: "RWA VC funding 2025", note: "Cointelegraph" },
                { stat: "12-15%", label: "Colored gem appreciation/yr", note: "Industry consensus" },
                { stat: "95%", label: "Value retention in downturns", note: "Investment-grade stones" },
                { stat: "$18B", label: "BlackRock BUIDL AUM", note: "Feb 2026" },
                { stat: "0%", label: "Current gemstone share of RWA", note: "White space" },
              ].map(s => (
                <div key={s.label} className={`${cd} border rounded-lg p-2.5`}>
                  <p className="text-lg font-bold font-mono text-[#1A8B7A]">{s.stat}</p>
                  <p className={`text-[9px] ${s2}`}>{s.label}</p>
                  <p className={`text-[8px] ${s1}`}>{s.note}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Why Colored Gemstones */}
          <div className={`${cd} border rounded-2xl p-4 sm:p-5 mb-4`}>
            <h2 className={`text-xs sm:text-sm font-semibold ${s3} mb-2`}>Why Colored Gemstones?</h2>
            <p className={`text-[10px] sm:text-[11px] ${s2} leading-relaxed mb-3`}>
              Not all gemstones are created equal. PleoChrome specifically targets colored gemstones (rubies, sapphires, emeralds, alexandrites) rather than diamonds. Here&apos;s why:
            </p>
            {[
              { title: "Supply is permanently constrained", desc: "Unlike diamonds (which can now be lab-grown cheaply), colored gemstones cannot be synthetically replicated at investment grade. Major mines are closing or depleting. The Mogok ruby mines in Burma, Kashmir sapphire deposits, and Colombian emerald mines are producing less every year. Shrinking supply + growing demand = price appreciation." },
              { title: "12-15% annual appreciation", desc: "Investment-grade colored gemstones have appreciated 12-15% annually on average, with exceptional specimens achieving 20-25% gains. During economic downturns, certified rare stones retain 95% of their value \u2014 compared to 70% for common varieties. This makes them a compelling alternative asset class." },
              { title: "Colored gem jewelry is exploding", desc: "Colored gemstone jewelry sales are growing 28% annually, driven by younger buyers who want something distinctive. The Estrela de Fura ruby ($34.8M, 2023) and record-breaking auction results signal institutional appetite. Christie\u2019s jewelry sales grew 17% YoY in 2025." },
              { title: "Diamonds are commoditized", desc: "De Beers\u2019 monopoly has eroded. Lab-grown diamonds are chemically identical and 80% cheaper. Diamond prices have declined. Colored gemstones remain irreplaceable by synthesis at investment quality, preserving their scarcity premium." },
            ].map(item => (
              <div key={item.title} className={`py-2.5 border-b ${dv} last:border-0`}>
                <p className={`text-xs font-semibold ${s3}`}>{item.title}</p>
                <p className={`text-[10px] sm:text-[11px] ${s2} leading-relaxed mt-0.5`}>{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Competitive Landscape */}
          <div className={`${cd} border rounded-2xl p-4 sm:p-5 mb-4`}>
            <h2 className={`text-xs sm:text-sm font-semibold ${s3} mb-2`}>Competitive Landscape</h2>
            <p className={`text-[10px] sm:text-[11px] ${s2} leading-relaxed mb-3`}>
              Who else is doing this? The short answer: almost no one is doing what PleoChrome does. Here are the closest comparables and why PleoChrome is different.
            </p>

            <h3 className={`text-[10px] tracking-wider uppercase ${s1} mb-2 mt-3 font-semibold`}>Direct Competitors (Gemstone Tokenization)</h3>
            <div className="overflow-x-auto -mx-2 px-2">
              <table className="w-full text-[10px] sm:text-xs min-w-[500px]">
                <thead><tr className={`${s1} text-[8px] tracking-wider uppercase`}>
                  <th className="text-left py-1.5">Company</th><th className="text-left">Model</th><th className="text-left">Scale</th><th className="text-left">Weakness</th>
                </tr></thead>
                <tbody>
                  {[
                    { name: "NYBlue (ZIRC)", model: "Commodity token \u2014 1M carats blue zircon", scale: "1M tokens on Polygon", weakness: "Single stone type; commodity, not unique high-value stones" },
                    { name: "Tiamonds", model: "Diamond NFTs (1:1 per stone)", scale: "30K+ diamonds on-chain", weakness: "Diamonds, not colored gems; pivoting away from gemstones" },
                    { name: "Habsburg Fine Arts", model: "EUR 5M gemstone portfolio token", scale: "EUR 5M total", weakness: "Tiny portfolio; single fund, not marketplace" },
                    { name: "Gubelin Provenance", model: "Blockchain provenance tracking", scale: "Used by Gemfields", weakness: "Provenance only \u2014 no tokenization, no fractional ownership" },
                  ].map(c => (
                    <tr key={c.name} className={`border-t ${dv}`}>
                      <td className={`py-1.5 font-semibold ${s2}`}>{c.name}</td>
                      <td className={`${s1}`}>{c.model}</td>
                      <td className={`${s1}`}>{c.scale}</td>
                      <td className="text-[#A61D3A]">{c.weakness}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className={`text-[10px] tracking-wider uppercase ${s1} mb-2 mt-4 font-semibold`}>Adjacent Comparables (Luxury Asset Tokenization)</h3>
            <div className="overflow-x-auto -mx-2 px-2">
              <table className="w-full text-[10px] sm:text-xs min-w-[500px]">
                <thead><tr className={`${s1} text-[8px] tracking-wider uppercase`}>
                  <th className="text-left py-1.5">Company</th><th className="text-left">Asset</th><th className="text-right">AUM</th><th className="text-right">Revenue</th><th className="text-right">Valuation</th>
                </tr></thead>
                <tbody className="font-mono">
                  {[
                    { name: "Masterworks", asset: "Fine art", aum: "$941M", rev: "$76.5M", val: "$1.0B" },
                    { name: "Securitize", asset: "Multi-asset", aum: "$4.0B+", rev: "$55.6M*", val: "$1.25B" },
                    { name: "Ondo Finance", asset: "Treasuries", aum: "$1.8B", rev: "~$2.7M", val: "$4.9B FDV" },
                    { name: "Rally", asset: "Collectibles", aum: "$175M+", rev: "N/A", val: "$175M" },
                  ].map(c => (
                    <tr key={c.name} className={`border-t ${dv}`}>
                      <td className={`py-1.5 font-sans font-semibold ${s2}`}>{c.name}</td>
                      <td className={`font-sans ${s1}`}>{c.asset}</td>
                      <td className="text-right text-[#1A8B7A]">{c.aum}</td>
                      <td className="text-right text-[#1B6B4A]">{c.rev}</td>
                      <td className={`text-right ${s2}`}>{c.val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className={`text-[9px] ${s1} mt-1`}>*Securitize 9-month revenue (2025). Going public via SPAC.</p>

            <h3 className={`text-[10px] tracking-wider uppercase ${s1} mb-2 mt-4 font-semibold`}>PleoChrome&apos;s Differentiation</h3>
            {[
              { title: "End-to-end orchestration", desc: "Competitors do 1-2 things (tokenize, or track provenance, or custody). PleoChrome manages the entire pipeline: sourcing \u2192 certification \u2192 appraisal \u2192 custody \u2192 legal \u2192 oracle \u2192 token \u2192 sale \u2192 ongoing management." },
              { title: "Individual high-value stones", desc: "NYBlue tokenizes a batch of 1 million cheap zircons. PleoChrome tokenizes one $55M ruby. These are fundamentally different propositions for fundamentally different investors." },
              { title: "Genuine white space", desc: "Of the $21.4 billion in on-chain tokenized assets today, less than $10 million represents gemstones. No credible platform owns this category. PleoChrome has a first-mover opportunity in a $2-5 billion serviceable market." },
              { title: "Compliance from day one", desc: "Built for SEC Reg D 506(c) and EU MiCA from the start. ERC-3643 tokens with on-chain KYC. This is what separates a real business from a crypto experiment." },
            ].map(d => (
              <div key={d.title} className={`py-2 border-b ${dv} last:border-0`}>
                <p className={`text-xs font-semibold ${s3}`}>{d.title}</p>
                <p className={`text-[10px] ${s2} leading-relaxed mt-0.5`}>{d.desc}</p>
              </div>
            ))}
          </div>
        </>)}

        {/* ══════════════════════════════════ */}
        {/* TAB: FUNDRAISE                    */}
        {/* ══════════════════════════════════ */}
        {activeTab === "fundraise" && (<>

          <div className={`${cd} border rounded-2xl p-4 sm:p-5 mb-4`}>
            <h2 className={`text-xs sm:text-sm font-semibold ${s3} mb-2`}>Understanding This Section</h2>
            <p className={`text-[10px] sm:text-[11px] ${s2} leading-relaxed`}>
              This section shows how PleoChrome plans to fund its operations and what the money would be used for. &ldquo;Burn rate&rdquo; is how much cash the company spends each month. &ldquo;Runway&rdquo; is how many months of cash the company has before it runs out. &ldquo;Use of proceeds&rdquo; shows exactly where every dollar of investment goes. Investors want to know: how much do you need, what will you do with it, and when will you need more?
            </p>
          </div>

          {/* Fundraise Scenario */}
          <div className={`${cd} border rounded-2xl p-4 sm:p-5 mb-4`}>
            <h2 className="text-[10px] sm:text-xs tracking-[0.2em] uppercase text-[#5B2D8E] mb-4 font-semibold">Seed Round Scenario</h2>
            <p className={`text-[10px] sm:text-[11px] ${s2} leading-relaxed mb-4`}>
              Based on comparable RWA/tokenization startups (Brickken raised EUR 2.4M seed at EUR 21.7M valuation; average fintech seed is $3.2M), here is a seed round scenario for PleoChrome:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              {[
                { label: "Target Raise", value: "$2.5M-$4M", note: "Seed round" },
                { label: "Pre-Money Valuation", value: "$12M-$18M", note: "Based on fintech seed benchmarks" },
                { label: "Monthly Burn", value: "$80K-$120K", note: "Fintech seed median: $120K" },
                { label: "Runway", value: "24-30 months", note: "2025+ investor expectation" },
              ].map(m => (
                <div key={m.label} className={`${cd} border rounded-xl p-3`}>
                  <p className={`text-[8px] tracking-wider uppercase ${s1} mb-0.5`}>{m.label}</p>
                  <p className={`text-base sm:text-lg font-bold font-mono ${s3}`}>{m.value}</p>
                  <p className={`text-[8px] ${s1}`}>{m.note}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Use of Proceeds */}
          <div className={`${cd} border rounded-2xl p-4 sm:p-5 mb-4`}>
            <h2 className={`text-xs sm:text-sm font-semibold ${s3} mb-2`}>Use of Proceeds</h2>
            <p className={`text-[10px] sm:text-[11px] ${s2} leading-relaxed mb-3`}>
              This shows exactly where every dollar of the seed raise would be allocated. Investors hate vague &ldquo;general corporate purposes&rdquo; \u2014 they want specificity. Each category below ties directly to a milestone PleoChrome needs to hit.
            </p>
            {[
              { category: "Legal & Compliance", pct: "25%", amount: "$625K-$1M", color: "#5B2D8E", desc: "Securities counsel engagement, entity formation (Series LLC master + first series), PPM template, compliance program build-out (AML/KYC policy, CCO designation), Form D and blue sky filings, MSB legal opinion. This is the foundation everything else builds on." },
              { category: "Technology & Infrastructure", pct: "30%", amount: "$750K-$1.2M", color: "#1E3A6E", desc: "Chainlink Proof of Reserve integration (custom adapter + feed deployment), Brickken platform setup, PleoChrome admin dashboard build (asset pipeline tracking, investor management, compliance dashboard), smart contract audit, and SOC 2 Type II preparation. This is PleoChrome\u2019s proprietary operating system." },
              { category: "First Stone Pilot (120-Day)", pct: "20%", amount: "$500K-$800K", color: "#1A8B7A", desc: "All costs associated with running the first gemstone through the complete 7-gate pipeline: GIA/SSEF certification, three independent appraisals, vault custody deposit, insurance, marketing for the initial offering, and broker-dealer engagement. Proves the model works end-to-end." },
              { category: "Team & Operations", pct: "15%", amount: "$375K-$600K", color: "#C47A1A", desc: "Key hires: Head of Operations (asset pipeline management), Compliance Officer (required by regulators from day one), and part-time CTO/blockchain developer. Plus office, insurance (D&O, E&O, cyber), and basic operational infrastructure for 18-24 months." },
              { category: "Working Capital & Reserve", pct: "10%", amount: "$250K-$400K", color: "#A61D3A", desc: "Cash buffer for unexpected costs, timing gaps between expenses and revenue, and the ability to move quickly when a high-value stone opportunity arises. Investors expect 20-30% buffer \u2014 this is the safety net that prevents desperate fundraising." },
            ].map(item => (
              <div key={item.category} className={`py-3 border-b ${dv} last:border-0`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded" style={{ background: item.color }} />
                    <span className={`text-xs font-semibold ${s3}`}>{item.category}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-xs font-semibold" style={{ color: item.color }}>{item.amount}</span>
                    <span className={`text-[9px] ${s1} ml-1`}>({item.pct})</span>
                  </div>
                </div>
                <div className={`h-1.5 rounded-full ${dark ? "bg-white/[0.04]" : "bg-gray-100"} mb-2`}>
                  <div className="h-full rounded-full" style={{ width: item.pct, background: item.color }} />
                </div>
                <p className={`text-[10px] ${s2} leading-relaxed`}>{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Milestones */}
          <div className={`${cd} border rounded-2xl p-4 sm:p-5 mb-4`}>
            <h2 className={`text-xs sm:text-sm font-semibold ${s3} mb-2`}>Milestones This Capital Unlocks</h2>
            <p className={`text-[10px] sm:text-[11px] ${s2} leading-relaxed mb-3`}>
              Investors think in milestones, not timelines. Each milestone below de-risks the business and makes the next raise easier and larger. The goal of the seed round is to prove the model works with one stone, then raise a Series A to scale.
            </p>
            {[
              { month: "Month 1-3", title: "Legal Foundation", desc: "Entity formed, securities counsel engaged, compliance program written, CCO designated. PleoChrome exists as a legal entity ready to operate." },
              { month: "Month 2-5", title: "Technology Platform", desc: "Chainlink PoR integration complete, Brickken sandbox tested, admin dashboard MVP live. The orchestration engine works." },
              { month: "Month 3-8", title: "First Stone Through Pipeline", desc: "One high-value colored gemstone completes all 7 gates: certified, appraised (3x), vaulted, insured, oracle-verified, tokenized, and offered to accredited investors. This is proof-of-concept." },
              { month: "Month 6-12", title: "First Token Sale Closes", desc: "Investors purchase tokens in the first offering. Revenue flows. The business model is validated with real money." },
              { month: "Month 12-18", title: "Pipeline of 5-10 Stones", desc: "With the first stone proven, additional asset holders engage. Legal templates reduce per-stone costs. Platform handles multiple concurrent offerings." },
              { month: "Month 18-24", title: "Series A Ready", desc: "Proven revenue, 5-10 tokenized stones, growing AUM, institutional partner relationships (Chainlink, Brickken, vault, BD), and SOC 2 in progress. Raise $8-15M Series A to scale to 50+ stones." },
            ].map(ms => (
              <div key={ms.month} className={`flex gap-3 py-2.5 border-b ${dv} last:border-0`}>
                <span className={`text-[9px] font-mono ${s1} w-20 shrink-0 pt-0.5`}>{ms.month}</span>
                <div>
                  <p className={`text-xs font-semibold ${s3}`}>{ms.title}</p>
                  <p className={`text-[10px] ${s2} leading-relaxed mt-0.5`}>{ms.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Burn Rate Model */}
          <div className={`${cd} border rounded-2xl p-4 sm:p-5 mb-4`}>
            <h2 className={`text-xs sm:text-sm font-semibold ${s3} mb-2`}>Monthly Burn Rate Projection</h2>
            <p className={`text-[10px] sm:text-[11px] ${s2} leading-relaxed mb-3`}>
              &ldquo;Burn rate&rdquo; is how much cash the company spends each month before revenue covers costs. Investors in 2025-2026 expect startups to have 24-30 months of runway (cash \u00F7 monthly burn). The median fintech seed-stage burn is $120K/month.
            </p>
            <div className="overflow-x-auto -mx-2 px-2">
              <table className="w-full text-[10px] sm:text-xs min-w-[400px]">
                <thead><tr className={`${s1} text-[8px] tracking-wider uppercase`}>
                  <th className="text-left py-1.5">Category</th><th className="text-right">Month 1-6</th><th className="text-right">Month 7-12</th><th className="text-right">Month 13-18</th><th className="text-right">Month 19-24</th>
                </tr></thead>
                <tbody className="font-mono">
                  {[
                    { cat: "Team (salaries + contractors)", m1: "$35K", m2: "$45K", m3: "$55K", m4: "$65K" },
                    { cat: "Legal & Compliance", m1: "$25K", m2: "$15K", m3: "$10K", m4: "$8K" },
                    { cat: "Technology (infra + dev)", m1: "$20K", m2: "$25K", m3: "$15K", m4: "$12K" },
                    { cat: "Chainlink + Brickken", m1: "$15K", m2: "$8K", m3: "$8K", m4: "$8K" },
                    { cat: "Marketing", m1: "$5K", m2: "$15K", m3: "$20K", m4: "$25K" },
                    { cat: "Insurance + Office + Misc", m1: "$5K", m2: "$5K", m3: "$7K", m4: "$7K" },
                  ].map(row => (
                    <tr key={row.cat} className={`border-t ${dv}`}>
                      <td className={`py-1.5 font-sans ${s2}`}>{row.cat}</td>
                      <td className="text-right text-[#A61D3A]">{row.m1}</td>
                      <td className="text-right text-[#A61D3A]">{row.m2}</td>
                      <td className="text-right text-[#A61D3A]">{row.m3}</td>
                      <td className="text-right text-[#A61D3A]">{row.m4}</td>
                    </tr>
                  ))}
                  <tr className={`border-t-2 ${dv} font-semibold`}>
                    <td className={`py-1.5 font-sans ${s3}`}>Total Monthly Burn</td>
                    <td className="text-right text-[#A61D3A]">$105K</td>
                    <td className="text-right text-[#A61D3A]">$113K</td>
                    <td className="text-right text-[#A61D3A]">$115K</td>
                    <td className="text-right text-[#A61D3A]">$125K</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className={`mt-3 pt-3 border-t ${dv} grid grid-cols-3 gap-2 text-center`}>
              <div><p className={`text-[8px] uppercase tracking-wider ${s1}`}>24-Month Total Burn</p><p className="text-sm font-mono font-semibold text-[#A61D3A]">~$2.7M</p></div>
              <div><p className={`text-[8px] uppercase tracking-wider ${s1}`}>Revenue Offset (est.)</p><p className="text-sm font-mono font-semibold text-[#1B6B4A]">~$1.0M</p><p className={`text-[8px] ${s1}`}>From first 2-3 stone offerings</p></div>
              <div><p className={`text-[8px] uppercase tracking-wider ${s1}`}>Net Cash Need</p><p className="text-sm font-mono font-semibold text-[#C47A1A]">~$1.7M</p><p className={`text-[8px] ${s1}`}>+ $800K-$1.3M buffer</p></div>
            </div>
          </div>

          {/* Comparable Raises */}
          <div className={`${cd} border rounded-2xl p-4 sm:p-5 mb-4`}>
            <h2 className={`text-xs sm:text-sm font-semibold ${s3} mb-2`}>What Comparable Companies Raised</h2>
            <p className={`text-[10px] sm:text-[11px] ${s2} leading-relaxed mb-3`}>
              These are real fundraising examples from companies in the RWA tokenization space. They show what investors have been willing to pay for similar businesses at similar stages.
            </p>
            <div className="overflow-x-auto -mx-2 px-2">
              <table className="w-full text-[10px] sm:text-xs min-w-[450px]">
                <thead><tr className={`${s1} text-[8px] tracking-wider uppercase`}>
                  <th className="text-left py-1.5">Company</th><th className="text-left">Round</th><th className="text-right">Amount</th><th className="text-right">Valuation</th><th className="text-left">Notes</th>
                </tr></thead>
                <tbody className="font-mono">
                  {[
                    { name: "Brickken", round: "Seed", amount: "$2.6M", val: "$23.5M", note: "Barcelona; EUR 2.4M at EUR 21.7M post-money" },
                    { name: "Securitize", round: "Total", amount: "$100M+", val: "$1.25B", note: "Going public via SPAC (2026)" },
                    { name: "Masterworks", round: "Total", amount: "$110M", val: "$1.0B", note: "$941M AUM in art; $76.5M revenue" },
                    { name: "Rally", round: "Total", amount: "$109M", val: "$175M", note: "8 rounds; collectible fractionalization" },
                    { name: "RWA sector", round: "All 2025", amount: "$2.5B+", val: "\u2014", note: "#1 category for crypto VC in 2025" },
                  ].map(c => (
                    <tr key={c.name} className={`border-t ${dv}`}>
                      <td className={`py-1.5 font-sans font-semibold ${s2}`}>{c.name}</td>
                      <td className={`font-sans ${s1}`}>{c.round}</td>
                      <td className="text-right text-[#1B6B4A]">{c.amount}</td>
                      <td className={`text-right ${s2}`}>{c.val}</td>
                      <td className={`font-sans text-[9px] ${s1}`}>{c.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
