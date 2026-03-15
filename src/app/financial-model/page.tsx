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

interface SavedDeal {
  name: string;
  date: string;
  assetValue: number;
  appraisalDiscount: number;
  tokenPrice: number;
  bdRate: number;
  setupFeeRate: number;
  successFeeRate: number;
  adminFeeRate: number;
  overrides: Record<string, number>;
  customCosts: CustomCost[];
}

function getSavedDeals(): SavedDeal[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem("pleochrome-deals") || "[]"); } catch { return []; }
}

function saveDealToStorage(deals: SavedDeal[]) {
  localStorage.setItem("pleochrome-deals", JSON.stringify(deals));
}

export default function FinancialModel() {
  const [unlocked, setUnlocked] = useState(false);
  const [dark, setDark] = useState(true);
  const [dealName, setDealName] = useState("$55M Burmese Ruby");
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
  const [savedDeals, setSavedDeals] = useState<SavedDeal[]>([]);
  const [showSaved, setShowSaved] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  // Load saved deals on mount
  useState(() => { setSavedDeals(getSavedDeals()); });

  const togglePhase = (p: string) => setOpenPhases(prev => { const n = new Set(prev); n.has(p) ? n.delete(p) : n.add(p); return n; });
  const toggleNote = (id: string) => setExpandedNotes(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const addCustom = useCallback((phase: string) => setCustomCosts(p => [...p, { id: "c-" + Date.now(), label: "New Expense", amount: 0, phase, paidBy: "pleochrome" }]), []);
  const updateCustom = useCallback((id: string, f: string, v: string | number) => setCustomCosts(p => p.map(c => c.id === id ? { ...c, [f]: v } : c)), []);
  const removeCustom = useCallback((id: string) => setCustomCosts(p => p.filter(c => c.id !== id)), []);

  const saveDeal = () => {
    const deal: SavedDeal = { name: dealName, date: new Date().toISOString(), assetValue, appraisalDiscount, tokenPrice, bdRate, setupFeeRate, successFeeRate, adminFeeRate, overrides, customCosts };
    const existing = getSavedDeals().filter(d => d.name !== dealName);
    const updated = [...existing, deal];
    saveDealToStorage(updated);
    setSavedDeals(updated);
    setSaveMsg("Saved!");
    setTimeout(() => setSaveMsg(""), 2000);
  };

  const loadDeal = (deal: SavedDeal) => {
    setDealName(deal.name);
    setAssetValue(deal.assetValue);
    setAppraisalDiscount(deal.appraisalDiscount);
    setTokenPrice(deal.tokenPrice);
    setBdRate(deal.bdRate);
    setSetupFeeRate(deal.setupFeeRate);
    setSuccessFeeRate(deal.successFeeRate);
    setAdminFeeRate(deal.adminFeeRate);
    setOverrides(deal.overrides);
    setCustomCosts(deal.customCosts);
    setSelectedStone(0);
    setShowSaved(false);
  };

  const deleteDeal = (name: string) => {
    const updated = getSavedDeals().filter(d => d.name !== name);
    saveDealToStorage(updated);
    setSavedDeals(updated);
  };

  const newDeal = () => {
    setDealName("New Deal");
    setAssetValue(1_000_000);
    setAppraisalDiscount(12.7);
    setTokenPrice(100_000);
    setBdRate(7.0);
    setSetupFeeRate(2.0);
    setSuccessFeeRate(1.5);
    setAdminFeeRate(0.75);
    setOverrides({});
    setCustomCosts([]);
    setSelectedStone(0);
  };

  const selectStone = (idx: number) => {
    setSelectedStone(idx);
    if (idx > 0) { setAssetValue(comparableStones[idx].value); setDealName(comparableStones[idx].name); }
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
      ["PleoChrome Deal Model: " + dealName],
      ["Exported: " + new Date().toLocaleString()],
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
    a.download = "PleoChrome-" + dealName.replace(/[^a-zA-Z0-9]/g, "-") + "-" + new Date().toISOString().slice(0, 10) + ".csv";
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
        <h1 className="font-[family-name:var(--font-cormorant)] text-lg sm:text-2xl font-light tracking-wider">Deal Model</h1>
        <p className={`mt-1 text-[9px] sm:text-[10px] tracking-[0.25em] uppercase ${s1}`}>Value from Every Angle &mdash; Confidential</p>

        {/* Deal Name + Save/Load Bar */}
        <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
          <input type="text" value={dealName} onChange={e => setDealName(e.target.value)}
            className={`${ib} border rounded-lg px-3 py-1.5 text-sm font-semibold text-center w-48 sm:w-64 outline-none focus:border-[#1A8B7A]/40`}
            placeholder="Deal name..." />
          <button onClick={saveDeal} className={`text-[9px] sm:text-[10px] tracking-wider uppercase px-2.5 py-1.5 rounded-lg border flex items-center gap-1 transition-colors ${dark ? "border-[#1B6B4A]/30 text-[#1B6B4A] hover:bg-[#1B6B4A]/10" : "border-[#1B6B4A]/30 text-[#1B6B4A] hover:bg-[#1B6B4A]/5"}`}>
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            {saveMsg || "Save"}
          </button>
          <button onClick={() => { setSavedDeals(getSavedDeals()); setShowSaved(!showSaved); }} className={`text-[9px] sm:text-[10px] tracking-wider uppercase px-2.5 py-1.5 rounded-lg border flex items-center gap-1 transition-colors ${dark ? "border-white/10 text-white/30 hover:text-white/50" : "border-gray-300 text-gray-400 hover:text-gray-600"}`}>
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>
            Load
          </button>
          <button onClick={newDeal} className={`text-[9px] sm:text-[10px] tracking-wider uppercase px-2.5 py-1.5 rounded-lg border flex items-center gap-1 transition-colors ${dark ? "border-white/10 text-white/30 hover:text-white/50" : "border-gray-300 text-gray-400 hover:text-gray-600"}`}>
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 5v14M5 12h14"/></svg>
            New
          </button>
        </div>

        {/* Saved Deals Dropdown */}
        {showSaved && (
          <div className={`mt-2 max-w-md mx-auto ${cd} border rounded-xl p-3 text-left`}>
            {savedDeals.length === 0 ? (
              <p className={`text-xs ${s1} text-center`}>No saved deals yet. Modify the model and click Save.</p>
            ) : savedDeals.map(d => (
              <div key={d.name} className={`flex items-center justify-between py-2 border-b ${dv} last:border-0`}>
                <button onClick={() => loadDeal(d)} className="text-left flex-1 min-w-0">
                  <p className={`text-xs font-semibold ${s3} truncate`}>{d.name}</p>
                  <p className={`text-[9px] ${s1}`}>{fmtFull(d.assetValue)} &middot; {new Date(d.date).toLocaleDateString()}</p>
                </button>
                <button onClick={() => deleteDeal(d.name)} className="text-[#A61D3A] text-[9px] ml-2 hover:underline shrink-0">Delete</button>
              </div>
            ))}
          </div>
        )}
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
