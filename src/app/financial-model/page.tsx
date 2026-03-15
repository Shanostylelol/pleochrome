"use client";

import { useState, useMemo } from "react";
import Image from "next/image";

/* ═══════════════════════════════════════════════════════
   PleoChrome — Interactive Financial Model
   Password-protected at /financial-model
   ═══════════════════════════════════════════════════════ */

const PASSCODE = "PleoChrome2026";

// ── Helpers ───────────────────────────────────

function fmt(n: number): string {
  if (Math.abs(n) >= 1_000_000) return "$" + (n / 1_000_000).toFixed(2) + "M";
  if (Math.abs(n) >= 1_000) return "$" + (n / 1_000).toFixed(1) + "K";
  return "$" + n.toFixed(0);
}

function fmtFull(n: number): string {
  return "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

function pct(n: number): string {
  return (n * 100).toFixed(2) + "%";
}

// ── Types ─────────────────────────────────────

interface CostLine {
  id: string;
  label: string;
  phase: string;
  paidBy: "pleochrome" | "asset-holder" | "proceeds";
  defaultAmount: number;
  scaleFactor?: number; // multiply by asset value / 55M to scale
  fixed?: boolean; // true = doesn't scale with asset value
  note: string;
}

const costLines: CostLine[] = [
  // Phase 1
  { id: "kyc", label: "KYC / KYB on Asset Holder", phase: "Acquisition", paidBy: "pleochrome", defaultAmount: 150, fixed: true, note: "Sumsub: $1-$1.35/check + enhanced screening" },
  { id: "sanctions", label: "Sanctions & PEP Screening", phase: "Acquisition", paidBy: "pleochrome", defaultAmount: 250, fixed: true, note: "OFAC SDN, EU/UN, PEP, adverse media" },
  { id: "provenance", label: "Provenance Research", phase: "Acquisition", paidBy: "asset-holder", defaultAmount: 5000, fixed: true, note: "10-40 hrs legal research at $250/hr" },
  { id: "intake-legal", label: "Intake Agreement (Legal)", phase: "Acquisition", paidBy: "pleochrome", defaultAmount: 5000, fixed: true, note: "Securities attorney: 10-20 hrs at $400-$600/hr" },
  // Phase 2
  { id: "gia", label: "GIA Grading Report", phase: "Preparation", paidBy: "asset-holder", defaultAmount: 400, fixed: true, note: "GIA highest tier for colored stones" },
  { id: "ssef", label: "SSEF Origin Report", phase: "Preparation", paidBy: "asset-holder", defaultAmount: 4000, fixed: true, note: "CHF 4,000 for 50-100ct. Source: ssef.ch" },
  { id: "gubelin", label: "Gubelin Report (Optional)", phase: "Preparation", paidBy: "asset-holder", defaultAmount: 4000, fixed: true, note: "Triple-lab certification for institutional credibility" },
  { id: "appraisal1", label: "Appraisal #1 (USPAP)", phase: "Preparation", paidBy: "asset-holder", defaultAmount: 15000, scaleFactor: 0.6, note: "CGA/MGA certified. 20-80+ hrs for high-value stones" },
  { id: "appraisal2", label: "Appraisal #2 (USPAP)", phase: "Preparation", paidBy: "asset-holder", defaultAmount: 15000, scaleFactor: 0.6, note: "Independent — zero affiliation with #1" },
  { id: "appraisal3", label: "Appraisal #3 (USPAP)", phase: "Preparation", paidBy: "asset-holder", defaultAmount: 15000, scaleFactor: 0.6, note: "Completes the 3-Appraisal Rule" },
  { id: "transit-ins", label: "Transit Insurance (Appraisals)", phase: "Preparation", paidBy: "asset-holder", defaultAmount: 30000, scaleFactor: 1, note: "0.25-1.0% per transit × 4-6 shipments" },
  { id: "vault", label: "Vault Custody (Year 1)", phase: "Preparation", paidBy: "asset-holder", defaultAmount: 82500, scaleFactor: 1, note: "Brink's/Malca-Amit. 0.15% of value" },
  { id: "insurance", label: "Insurance Premium (Year 1)", phase: "Preparation", paidBy: "asset-holder", defaultAmount: 137500, scaleFactor: 1, note: "Specie insurance: 0.25% of value. Lloyd's/AXA XL" },
  { id: "chainlink-setup", label: "Chainlink PoR — Setup", phase: "Preparation", paidBy: "pleochrome", defaultAmount: 100000, fixed: true, note: "Custom adapter + feed deployment. Enterprise engagement" },
  { id: "chainlink-yr1", label: "Chainlink PoR — Year 1 Maint.", phase: "Preparation", paidBy: "pleochrome", defaultAmount: 50000, fixed: true, note: "Oracle network fees, data feed updates" },
  { id: "spv", label: "SPV Formation", phase: "Preparation", paidBy: "pleochrome", defaultAmount: 8000, fixed: true, note: "Series LLC (WY/DE) + Operating Agreement + EIN" },
  { id: "ppm", label: "PPM Drafting", phase: "Preparation", paidBy: "pleochrome", defaultAmount: 50000, scaleFactor: 0.3, note: "Securities attorney. $25K-$75K depending on complexity" },
  { id: "sub-agreement", label: "Subscription Agreement", phase: "Preparation", paidBy: "pleochrome", defaultAmount: 8000, fixed: true, note: "Often bundled with PPM engagement" },
  { id: "token-agreement", label: "Token Purchase Agreement", phase: "Preparation", paidBy: "pleochrome", defaultAmount: 10000, fixed: true, note: "Links on-chain token to SPV legal rights" },
  { id: "media", label: "Photo & Media Documentation", phase: "Preparation", paidBy: "asset-holder", defaultAmount: 5000, fixed: true, note: "8+ angles, macro, 360 video, weight verification" },
  // Phase 3
  { id: "brickken", label: "Brickken Platform (Year 1)", phase: "Tokenization", paidBy: "pleochrome", defaultAmount: 35000, fixed: true, note: "Enterprise tier. Source: brickken.com/plans" },
  { id: "audit", label: "Smart Contract Audit", phase: "Tokenization", paidBy: "pleochrome", defaultAmount: 90000, fixed: true, note: "CertiK/Hacken/OpenZeppelin for ERC-3643 suite" },
  { id: "dev", label: "Testnet Dev & Testing", phase: "Tokenization", paidBy: "pleochrome", defaultAmount: 20000, fixed: true, note: "40-120 hrs blockchain dev at $200-$400/hr" },
  { id: "gas", label: "Mainnet Deployment (Gas)", phase: "Tokenization", paidBy: "pleochrome", defaultAmount: 200, fixed: true, note: "Polygon: $0.01-$0.10/tx. Minimal" },
  { id: "bluesky", label: "Blue Sky Filings (All States)", phase: "Tokenization", paidBy: "pleochrome", defaultAmount: 15000, fixed: true, note: "50 states + DC. Source: NASAA fee matrix" },
  // Phase 4
  { id: "marketing", label: "Marketing & Investor Acquisition", phase: "Distribution", paidBy: "pleochrome", defaultAmount: 200000, scaleFactor: 0.5, note: "Digital-first under 506(c). $1.5K per investor acquisition" },
  { id: "investor-kyc", label: "Investor KYC & Accreditation", phase: "Distribution", paidBy: "pleochrome", defaultAmount: 12000, scaleFactor: 0.3, note: "120 investors × $100 each (KYC + accreditation + sanctions)" },
  { id: "transfer-agent", label: "Transfer Agent (Year 1)", phase: "Distribution", paidBy: "pleochrome", defaultAmount: 30000, fixed: true, note: "Securitize or equivalent. Base + per-account" },
  { id: "data-room", label: "Investor Portal / Data Room", phase: "Distribution", paidBy: "pleochrome", defaultAmount: 10000, fixed: true, note: "SaaS data room. $500-$2K/month" },
  { id: "compliance", label: "Compliance Monitoring (Year 1)", phase: "Distribution", paidBy: "pleochrome", defaultAmount: 25000, fixed: true, note: "Quarterly re-screening + monitoring tools" },
  { id: "aml-audit", label: "Annual AML Audit", phase: "Distribution", paidBy: "pleochrome", defaultAmount: 15000, fixed: true, note: "Independent third-party audit. Required." },
];

// ── Password Gate ─────────────────────────────

function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code === PASSCODE) onUnlock();
    else { setError(true); setTimeout(() => setError(false), 1500); }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030712] px-4">
      <form onSubmit={handleSubmit} className="text-center max-w-sm w-full">
        <Image src="/favicon.png" alt="PleoChrome" width={48} height={48} className="mx-auto mb-6 opacity-60" />
        <h1 className="font-[family-name:var(--font-cormorant)] text-2xl font-light text-white/80 mb-2">Financial Model</h1>
        <p className="text-xs tracking-[0.2em] uppercase text-white/30 mb-8">Enter passcode</p>
        <input type="password" value={code} onChange={(e) => setCode(e.target.value)}
          placeholder="Passcode" autoFocus
          className={`w-full bg-white/[0.04] border rounded-xl px-5 py-3.5 text-sm text-white/80 placeholder:text-white/20 outline-none transition-all ${error ? "border-[#A61D3A]" : "border-white/[0.08] focus:border-white/20"}`} />
        <button type="submit" className="mt-4 w-full bg-gradient-to-r from-[#1A8B7A] to-[#1E3A6E] text-white text-xs tracking-[0.2em] uppercase py-3.5 rounded-xl hover:opacity-90 transition-opacity">Enter</button>
      </form>
    </div>
  );
}

// ── Input Field ───────────────────────────────

function NumInput({ label, value, onChange, prefix = "$", suffix = "", small = false }: {
  label: string; value: number; onChange: (v: number) => void; prefix?: string; suffix?: string; small?: boolean;
}) {
  return (
    <div className={small ? "" : "mb-3"}>
      <label className="block text-[10px] sm:text-xs tracking-wider uppercase text-white/30 mb-1">{label}</label>
      <div className="flex items-center bg-white/[0.04] border border-white/[0.08] rounded-lg overflow-hidden focus-within:border-white/20 transition-colors">
        {prefix && <span className="text-white/25 text-xs pl-3 pr-1">{prefix}</span>}
        <input type="number" value={value} onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 bg-transparent text-white/80 text-sm py-2.5 px-1 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" />
        {suffix && <span className="text-white/25 text-xs pr-3 pl-1">{suffix}</span>}
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────

export default function FinancialModel() {
  const [unlocked, setUnlocked] = useState(false);

  // Adjustable inputs
  const [assetValue, setAssetValue] = useState(55_000_000);
  const [appraisalDiscount, setAppraisalDiscount] = useState(12.7);
  const [tokenPrice, setTokenPrice] = useState(100_000);
  const [bdRate, setBdRate] = useState(7.0);
  const [setupFeeRate, setSetupFeeRate] = useState(2.0);
  const [successFeeRate, setSuccessFeeRate] = useState(1.5);
  const [adminFeeRate, setAdminFeeRate] = useState(0.75);
  const [targetInvestors, setTargetInvestors] = useState(120);
  const [overrides, setOverrides] = useState<Record<string, number>>({});

  // Derived values
  const model = useMemo(() => {
    const offeringValue = assetValue * (1 - appraisalDiscount / 100);
    const totalTokens = Math.floor(offeringValue / tokenPrice);
    const bdFee = offeringValue * (bdRate / 100);
    const setupFee = assetValue * (setupFeeRate / 100);
    const successFee = offeringValue * (successFeeRate / 100);
    const adminFee = offeringValue * (adminFeeRate / 100);
    const scaleFactor = assetValue / 55_000_000;

    // Calculate costs
    const costs = costLines.map((line) => {
      if (overrides[line.id] !== undefined) return { ...line, amount: overrides[line.id] };
      let amount = line.defaultAmount;
      if (!line.fixed && line.scaleFactor !== undefined) {
        amount = line.defaultAmount * Math.pow(scaleFactor, line.scaleFactor);
      }
      return { ...line, amount: Math.round(amount) };
    });

    const pleoChromeCosts = costs.filter((c) => c.paidBy === "pleochrome").reduce((s, c) => s + c.amount, 0);
    const assetHolderCosts = costs.filter((c) => c.paidBy === "asset-holder").reduce((s, c) => s + c.amount, 0);

    // Revenue
    const yr1Revenue = setupFee + successFee + 12000; // + secondary transfer est
    const yr2Revenue = adminFee + 25000 + 24000; // admin + refresh + transfers

    // Asset holder economics
    const netToHolder = offeringValue - bdFee - setupFee - successFee - assetHolderCosts;

    // Annual ongoing (simplified)
    const annualOngoing = 82500 * scaleFactor + 137500 * scaleFactor + 50000 + 35000 + 30000 + 25000 + 15000 + 25000 * Math.pow(scaleFactor, 0.6) + 12000 + 7500 + 100;

    // 5-year projection
    const yr1Net = yr1Revenue - pleoChromeCosts;
    const yr2Net = yr2Revenue - (annualOngoing * 0.46); // PleoChrome share of ongoing

    return {
      offeringValue, totalTokens, bdFee, setupFee, successFee, adminFee,
      costs, pleoChromeCosts, assetHolderCosts,
      yr1Revenue, yr2Revenue, yr1Net, yr2Net,
      netToHolder, annualOngoing,
      fiveYearRevenue: yr1Revenue + yr2Revenue * 4,
      fiveYearCosts: pleoChromeCosts + (annualOngoing * 0.46) * 4,
      fiveYearNet: yr1Net + yr2Net * 4,
    };
  }, [assetValue, appraisalDiscount, tokenPrice, bdRate, setupFeeRate, successFeeRate, adminFeeRate, targetInvestors, overrides]);

  if (!unlocked) return <PasswordGate onUnlock={() => setUnlocked(true)} />;

  const phases = ["Acquisition", "Preparation", "Tokenization", "Distribution"];
  const phaseColors: Record<string, string> = {
    Acquisition: "#1B6B4A", Preparation: "#1A8B7A", Tokenization: "#1E3A6E", Distribution: "#C47A1A",
  };

  return (
    <div className="min-h-screen bg-[#030712] text-[#FAFBFC]">
      {/* Header */}
      <header className="text-center pt-8 pb-6 sm:pt-12 sm:pb-8 relative">
        <Image src="/logo-white.png" alt="PleoChrome" width={160} height={40} className="mx-auto mb-3 opacity-50 h-5 sm:h-6 w-auto" />
        <h1 className="font-[family-name:var(--font-cormorant)] text-xl sm:text-2xl font-light tracking-wider">Financial Model</h1>
        <p className="mt-1 text-[10px] tracking-[0.25em] uppercase text-white/25">Interactive P&L Calculator</p>
        <div className="flex gap-[2px] justify-center mt-3">
          {["#1B6B4A","#1A8B7A","#1E3A6E","#5B2D8E","#A61D3A","#C47A1A","#7BA31E"].map((c) => (
            <span key={c} className="h-[2px] w-4 rounded-sm" style={{ background: c }} />
          ))}
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] max-w-md h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      </header>

      <div className="max-w-5xl mx-auto px-3 sm:px-5 pb-16">

        {/* ── Input Controls ──────────────── */}
        <div className="bg-[rgba(10,17,32,0.92)] border border-white/[0.04] rounded-2xl p-4 sm:p-6 mb-6">
          <h2 className="text-xs tracking-[0.2em] uppercase text-[#1A8B7A] mb-4">Adjust Variables</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <NumInput label="Asset Value" value={assetValue} onChange={setAssetValue} />
            <NumInput label="3-Appraisal Discount" value={appraisalDiscount} onChange={setAppraisalDiscount} prefix="" suffix="%" />
            <NumInput label="Token Price" value={tokenPrice} onChange={setTokenPrice} />
            <NumInput label="Target Investors" value={targetInvestors} onChange={setTargetInvestors} prefix="" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-3">
            <NumInput label="BD Placement Rate" value={bdRate} onChange={setBdRate} prefix="" suffix="%" />
            <NumInput label="Setup Fee Rate" value={setupFeeRate} onChange={setSetupFeeRate} prefix="" suffix="%" />
            <NumInput label="Success Fee Rate" value={successFeeRate} onChange={setSuccessFeeRate} prefix="" suffix="%" />
            <NumInput label="Annual Admin Fee" value={adminFeeRate} onChange={setAdminFeeRate} prefix="" suffix="%" />
          </div>
        </div>

        {/* ── Key Metrics Dashboard ────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Offering Value", value: fmtFull(model.offeringValue), sub: `${model.totalTokens} tokens` },
            { label: "PleoChrome Year 1 Revenue", value: fmt(model.yr1Revenue), sub: pct(model.yr1Revenue / model.offeringValue) + " of offering" },
            { label: "PleoChrome Year 1 Net", value: fmt(model.yr1Net), sub: pct(model.yr1Net / model.yr1Revenue) + " margin" },
            { label: "Net to Asset Holder", value: fmtFull(model.netToHolder), sub: pct(model.netToHolder / assetValue) + " of claimed value" },
          ].map((m) => (
            <div key={m.label} className="bg-[rgba(10,17,32,0.92)] border border-white/[0.04] rounded-xl p-3 sm:p-4">
              <p className="text-[9px] sm:text-[10px] tracking-wider uppercase text-white/25 mb-1">{m.label}</p>
              <p className="text-lg sm:text-xl font-semibold text-white/80 font-mono">{m.value}</p>
              <p className="text-[10px] text-white/20 mt-0.5">{m.sub}</p>
            </div>
          ))}
        </div>

        {/* ── Cash Flow Bars ──────────────── */}
        <div className="bg-[rgba(10,17,32,0.92)] border border-white/[0.04] rounded-2xl p-4 sm:p-6 mb-6">
          <h2 className="text-xs tracking-[0.2em] uppercase text-[#C47A1A] mb-4">Cash Flow Summary</h2>
          <div className="space-y-3">
            {[
              { label: "PleoChrome Revenue (Year 1)", amount: model.yr1Revenue, color: "#1B6B4A", max: model.yr1Revenue },
              { label: "PleoChrome Costs (Year 1)", amount: model.pleoChromeCosts, color: "#A61D3A", max: model.yr1Revenue },
              { label: "BD Placement Fee", amount: model.bdFee, color: "#5B2D8E", max: model.bdFee },
              { label: "Asset Holder Pass-Through", amount: model.assetHolderCosts, color: "#1E3A6E", max: model.bdFee },
              { label: "Net to Asset Holder", amount: model.netToHolder, color: "#1A8B7A", max: model.offeringValue },
            ].map((bar) => (
              <div key={bar.label}>
                <div className="flex justify-between text-[10px] sm:text-xs mb-1">
                  <span className="text-white/40">{bar.label}</span>
                  <span className="text-white/60 font-mono">{fmtFull(bar.amount)}</span>
                </div>
                <div className="h-2 bg-white/[0.04] rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{
                    width: `${Math.min(100, (bar.amount / model.offeringValue) * 100)}%`,
                    background: bar.color,
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Phase Cost Breakdown ─────────── */}
        {phases.map((phase) => {
          const phaseCosts = model.costs.filter((c) => c.phase === phase);
          const phaseTotal = phaseCosts.reduce((s, c) => s + c.amount, 0);
          return (
            <div key={phase} className="bg-[rgba(10,17,32,0.92)] border border-white/[0.04] rounded-2xl p-4 sm:p-6 mb-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded" style={{ background: phaseColors[phase] }} />
                  <h3 className="text-xs sm:text-sm font-semibold text-white/60">{phase}</h3>
                </div>
                <span className="font-mono text-xs text-white/40">{fmtFull(phaseTotal)}</span>
              </div>
              <div className="space-y-1">
                {phaseCosts.map((cost) => (
                  <div key={cost.id} className="flex items-center gap-2 py-1.5 border-b border-white/[0.03] last:border-0">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm text-white/50 truncate">{cost.label}</span>
                        <span className={`text-[8px] sm:text-[9px] tracking-wider uppercase px-1.5 py-[1px] rounded shrink-0 ${
                          cost.paidBy === "pleochrome" ? "text-[#1A8B7A] bg-[rgba(26,139,122,0.1)]" :
                          cost.paidBy === "asset-holder" ? "text-[#C47A1A] bg-[rgba(196,122,26,0.1)]" :
                          "text-[#5B2D8E] bg-[rgba(91,45,142,0.1)]"
                        }`}>
                          {cost.paidBy === "pleochrome" ? "PC" : cost.paidBy === "asset-holder" ? "AH" : "BD"}
                        </span>
                      </div>
                      <p className="text-[9px] sm:text-[10px] text-white/20 mt-0.5 truncate">{cost.note}</p>
                    </div>
                    <div className="w-24 sm:w-28 shrink-0">
                      <input
                        type="number"
                        value={overrides[cost.id] !== undefined ? overrides[cost.id] : cost.amount}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setOverrides((prev) => ({ ...prev, [cost.id]: val }));
                        }}
                        className="w-full bg-white/[0.03] border border-white/[0.06] rounded-md px-2 py-1.5 text-xs text-right text-white/60 font-mono outline-none focus:border-white/15 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* ── Revenue Model ────────────────── */}
        <div className="bg-[rgba(10,17,32,0.92)] border border-white/[0.04] rounded-2xl p-4 sm:p-6 mb-4">
          <h2 className="text-xs tracking-[0.2em] uppercase text-[#1B6B4A] mb-4">PleoChrome Revenue</h2>
          <div className="space-y-2">
            {[
              { label: "Setup / Structuring Fee", rate: setupFeeRate + "% of asset value", amount: model.setupFee, timing: "At engagement" },
              { label: "Primary Sale Success Fee", rate: successFeeRate + "% of offering", amount: model.successFee, timing: "At token sale close" },
              { label: "Secondary Transfer Fees (est.)", rate: "0.25% per transfer", amount: 12000, timing: "Ongoing" },
              { label: "Annual Admin Fee (Year 2+)", rate: adminFeeRate + "% of offering", amount: model.adminFee, timing: "Annually" },
              { label: "Valuation Refresh (Year 2+)", rate: "Flat fee", amount: 25000, timing: "Annually" },
            ].map((rev) => (
              <div key={rev.label} className="flex items-center justify-between py-2 border-b border-white/[0.03] last:border-0">
                <div>
                  <p className="text-xs sm:text-sm text-white/50">{rev.label}</p>
                  <p className="text-[9px] sm:text-[10px] text-white/20">{rev.rate} &middot; {rev.timing}</p>
                </div>
                <span className="font-mono text-xs sm:text-sm text-[#1B6B4A]">{fmtFull(rev.amount)}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-white/[0.06] flex justify-between">
            <span className="text-xs font-semibold text-white/50">Year 1 Total Revenue</span>
            <span className="font-mono text-sm font-semibold text-[#1B6B4A]">{fmtFull(model.yr1Revenue)}</span>
          </div>
          <div className="mt-1 flex justify-between">
            <span className="text-xs font-semibold text-white/50">Year 2+ Annual Revenue</span>
            <span className="font-mono text-sm font-semibold text-[#1A8B7A]">{fmtFull(model.yr2Revenue)}</span>
          </div>
        </div>

        {/* ── 5-Year P&L ──────────────────── */}
        <div className="bg-[rgba(10,17,32,0.92)] border border-white/[0.04] rounded-2xl p-4 sm:p-6 mb-4">
          <h2 className="text-xs tracking-[0.2em] uppercase text-[#5B2D8E] mb-4">5-Year Net P&L (PleoChrome — This Asset)</h2>
          <div className="overflow-x-auto -mx-2 px-2">
            <table className="w-full text-xs sm:text-sm min-w-[500px]">
              <thead>
                <tr className="text-white/25 text-[10px] tracking-wider uppercase">
                  <th className="text-left py-2 pr-2">Item</th>
                  {[1,2,3,4,5].map((y) => <th key={y} className="text-right py-2 px-1">Yr {y}</th>)}
                  <th className="text-right py-2 pl-2">5-Yr Total</th>
                </tr>
              </thead>
              <tbody className="font-mono">
                <tr className="text-[#1B6B4A] border-b border-white/[0.03]">
                  <td className="py-1.5 pr-2 font-sans text-white/40">Revenue</td>
                  <td className="text-right px-1">{fmt(model.yr1Revenue)}</td>
                  {[2,3,4,5].map((y) => <td key={y} className="text-right px-1">{fmt(model.yr2Revenue)}</td>)}
                  <td className="text-right pl-2 font-semibold">{fmt(model.fiveYearRevenue)}</td>
                </tr>
                <tr className="text-[#A61D3A] border-b border-white/[0.03]">
                  <td className="py-1.5 pr-2 font-sans text-white/40">Costs</td>
                  <td className="text-right px-1">({fmt(model.pleoChromeCosts)})</td>
                  {[2,3,4,5].map((y) => <td key={y} className="text-right px-1">({fmt(model.annualOngoing * 0.46)})</td>)}
                  <td className="text-right pl-2 font-semibold">({fmt(model.fiveYearCosts)})</td>
                </tr>
                <tr className="text-white/70 font-semibold">
                  <td className="py-2 pr-2 font-sans">Net Income</td>
                  <td className="text-right px-1">{fmt(model.yr1Net)}</td>
                  {[2,3,4,5].map((y) => <td key={y} className="text-right px-1">{fmt(model.yr2Net)}</td>)}
                  <td className="text-right pl-2 text-[#1A8B7A]">{fmt(model.fiveYearNet)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Asset Holder Summary ─────────── */}
        <div className="bg-[rgba(10,17,32,0.92)] border border-white/[0.04] rounded-2xl p-4 sm:p-6 mb-4">
          <h2 className="text-xs tracking-[0.2em] uppercase text-[#C47A1A] mb-4">Asset Holder Economics</h2>
          <div className="space-y-2">
            {[
              { label: "Claimed Asset Value", amount: assetValue, color: "text-white/60" },
              { label: "Offering Value (After 3-Appraisal Discount)", amount: model.offeringValue, color: "text-white/50" },
              { label: "Less: BD Placement Fee (" + bdRate + "%)", amount: -model.bdFee, color: "text-[#A61D3A]" },
              { label: "Less: PleoChrome Setup Fee (" + setupFeeRate + "%)", amount: -model.setupFee, color: "text-[#A61D3A]" },
              { label: "Less: PleoChrome Success Fee (" + successFeeRate + "%)", amount: -model.successFee, color: "text-[#A61D3A]" },
              { label: "Less: Pass-Through Costs (labs, vault, insurance)", amount: -model.assetHolderCosts, color: "text-[#A61D3A]" },
            ].map((line) => (
              <div key={line.label} className="flex justify-between py-1.5 border-b border-white/[0.03] last:border-0">
                <span className="text-xs sm:text-sm text-white/40">{line.label}</span>
                <span className={`font-mono text-xs sm:text-sm ${line.color}`}>{line.amount < 0 ? "(" + fmtFull(Math.abs(line.amount)) + ")" : fmtFull(line.amount)}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t-2 border-[#1A8B7A]/30 flex justify-between">
            <span className="text-sm font-semibold text-white/70">Net Proceeds to Asset Holder</span>
            <div className="text-right">
              <span className="font-mono text-lg font-bold text-[#1A8B7A]">{fmtFull(model.netToHolder)}</span>
              <p className="text-[10px] text-white/25">{pct(model.netToHolder / assetValue)} of claimed value</p>
            </div>
          </div>
        </div>

      </div>

      {/* Footer */}
      <footer className="text-center py-8 border-t border-white/[0.03]">
        <div className="flex gap-[2px] justify-center mb-2">
          {["#1B6B4A","#1A8B7A","#1E3A6E","#5B2D8E","#A61D3A","#C47A1A","#7BA31E"].map((c) => (
            <span key={c} className="h-[2px] w-4 rounded-sm" style={{ background: c }} />
          ))}
        </div>
        <p className="text-[10px] tracking-[0.15em] text-white/10">PleoChrome &mdash; Confidential &mdash; Florida</p>
      </footer>
    </div>
  );
}
