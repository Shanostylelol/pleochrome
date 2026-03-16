"use client";

import { useState, useRef, useCallback } from "react";
import { HotTable } from "@handsontable/react-wrapper";
import { registerAllModules } from "handsontable/registry";
import HyperFormula from "hyperformula";
import "handsontable/styles/handsontable.css";
import "handsontable/styles/ht-theme-main.css";

registerAllModules();

interface Props { dark: boolean }

type TabId = "assumptions" | "deal" | "pnl" | "sources" | "timeline";

const tabs: { id: TabId; label: string; color: string }[] = [
  { id: "assumptions", label: "Assumptions", color: "#1A8B7A" },
  { id: "deal", label: "Deal Model", color: "#1B6B4A" },
  { id: "pnl", label: "P&L", color: "#1E3A6E" },
  { id: "sources", label: "Pricing Sources", color: "#C47A1A" },
  { id: "timeline", label: "Payment Timeline", color: "#5B2D8E" },
];

// ═══════════════════════════════════════════════
// SHEET DATA
// ═══════════════════════════════════════════════

function getAssumptionsData() {
  return [
    ["ASSET DETAILS", "", "", ""],
    ["Stone Type", "Burmese Ruby", "", "Pigeon's blood, Mogok origin"],
    ["Carat Weight", 55, "ct", "Comparable: Estrela de Fura (55.22ct, $34.8M)"],
    ["Treatment", "No Heat", "", "Unheated commands 2-5x premium"],
    ["Claimed Asset Value", 55000000, "$", "Enter the stone owner's claimed value"],
    ["Appraisal Discount", 0.127, "%", "3-Appraisal Rule: avg of 2 lowest, typically 10-15% below claimed"],
    ["Offering Value", "=B5*(1-B6)", "$", "Claimed Value x (1 - Appraisal Discount)"],
    ["Token Price (Min Investment)", 100000, "$", "Reg D 506(c); $200K+ allows self-certification"],
    ["Total Tokens", "=INT(B7/B8)", "#", "Offering Value / Token Price"],
    ["", "", "", ""],
    ["FEE STRUCTURE", "", "", ""],
    ["Setup Fee Rate", 0.02, "%", "Industry standard 1-3%. Collected at engagement."],
    ["Success Fee Rate", 0.015, "%", "0.5-3%. Collected at close. $0 if offering fails."],
    ["Annual Admin Fee Rate", 0.0075, "%", "0.5-1.0%. Recurring revenue starting Year 2."],
    ["BD Placement Rate", 0.07, "%", "5-7% for BD distribution. 0% if direct placement."],
    ["", "", "", ""],
    ["CALCULATED FEES", "", "", ""],
    ["Setup Fee ($)", "=B5*B12", "$", "Asset Value x Setup Fee Rate"],
    ["Success Fee ($)", "=B7*B13", "$", "Offering Value x Success Fee Rate"],
    ["Annual Admin Fee ($)", "=B7*B14", "$", "Offering Value x Admin Fee Rate"],
    ["BD Placement Fee ($)", "=B7*B15", "$", "Offering Value x BD Rate"],
  ];
}

function getDealData() {
  return [
    ["PHASE 1: ACQUISITION (Days 1-14)", "", "", "", "", ""],
    ["KYC / KYB on Asset Holder", 50, "", '=IF(C2<>"",C2,B2)', "PleoChrome", "Veriff $0.80/check | Day 1-3"],
    ["Sanctions & PEP Screening", 100, "", '=IF(C3<>"",C3,B3)', "PleoChrome", "OFAC/EU/UN screening | Day 1-3"],
    ["Provenance Research", 2500, "", '=IF(C4<>"",C4,B4)', "Asset Holder", "Title search 10-20hrs | Day 3-10"],
    ["Intake Agreement (Legal)", 2500, "", '=IF(C5<>"",C5,B5)', "PleoChrome", "Boutique attorney | Day 5-14"],
    ["", "", "", "", "", ""],
    ["PHASE 2: PREPARATION (Days 14-84)", "", "", "", "", ""],
    ["GIA Grading Report", 0, "", '=IF(C8<>"",C8,B8)', "Asset Holder", "Most $50M+ stones already certified | Day 14-35"],
    ["SSEF Origin Report", 0, "", '=IF(C9<>"",C9,B9)', "Asset Holder", "CHF 4,000 if needed | Day 14-35"],
    ["Gubelin Report (Optional)", 0, "", '=IF(C10<>"",C10,B10)', "Asset Holder", "Triple-lab cert | Day 14-35"],
    ["Independent Appraisal #1", 7500, "", '=IF(C11<>"",C11,B11)', "Asset Holder", "CGA/MGA USPAP | Day 28-38"],
    ["Independent Appraisal #2", 7500, "", '=IF(C12<>"",C12,B12)', "Asset Holder", "Sequential independent | Day 38-48"],
    ["Independent Appraisal #3", 7500, "", '=IF(C13<>"",C13,B13)', "Asset Holder", "Completes 3-Appraisal Rule | Day 48-56"],
    ["Transit Insurance", 10000, "", '=IF(C14<>"",C14,B14)', "Asset Holder", "2-4 transits at $2K-5K | Days 28-65"],
    ["Vault Custody (Year 1)", 55000, "", '=IF(C15<>"",C15,B15)', "Asset Holder", "0.10% Brink's/Malca-Amit | Day 56+"],
    ["Specie Insurance (Year 1)", 55000, "", '=IF(C16<>"",C16,B16)', "Asset Holder", "0.10% Lloyd's/AXA XL | Day 56+"],
    ["Chainlink Oracle Integration", 2500, "", '=IF(C17<>"",C17,B17)', "PleoChrome", "BUILD program | Day 42-70"],
    ["Chainlink LINK Fees (Year 1)", 1200, "", '=IF(C18<>"",C18,B18)', "PleoChrome", "$100-200/mo | Day 70+"],
    ["SPV Formation (Series LLC)", 750, "", '=IF(C19<>"",C19,B19)', "PleoChrome", "Wyoming $100 + RA + template | Day 30-45"],
    ["PPM Drafting", 10000, "", '=IF(C20<>"",C20,B20)', "PleoChrome", "Boutique $7.5K-12K | Day 35-70"],
    ["Subscription Agreement", 2000, "", '=IF(C21<>"",C21,B21)', "PleoChrome", "Bundled with PPM | Day 50-70"],
    ["Token Purchase Agreement", 2500, "", '=IF(C22<>"",C22,B22)', "PleoChrome", "On-chain to SPV link | Day 50-70"],
    ["Photo & Media", 2000, "", '=IF(C23<>"",C23,B23)', "Asset Holder", "8+ angles, 360 video | Day 56-65"],
    ["", "", "", "", "", ""],
    ["PHASE 3: TOKENIZATION (Days 63-84)", "", "", "", "", ""],
    ["Brickken Platform (Year 1)", 5500, "", '=IF(C26<>"",C26,B26)', "PleoChrome", "Advanced EUR 5K/yr | Day 63"],
    ["Configuration Review", 3500, "", '=IF(C27<>"",C27,B27)', "PleoChrome", "Pre-audited contracts | Day 63-75"],
    ["Development & Testing", 5000, "", '=IF(C28<>"",C28,B28)', "PleoChrome", "10-30hrs config | Day 65-80"],
    ["Blockchain Gas Fees", 100, "", '=IF(C29<>"",C29,B29)', "PleoChrome", "Polygon <$0.01/tx | Day 80"],
    ["Blue Sky Filings (5 States)", 1500, "", '=IF(C30<>"",C30,B30)', "PleoChrome", "3-5 target states | Day 80-84"],
    ["", "", "", "", "", ""],
    ["PHASE 4: DISTRIBUTION (Days 84-120)", "", "", "", "", ""],
    ["Marketing & Investor Acq.", 3000, "", '=IF(C33<>"",C33,B33)', "PleoChrome", "LinkedIn + direct | Day 84-120"],
    ["Investor KYC & Accreditation", 0, "", '=IF(C34<>"",C34,B34)', "PleoChrome", "Covered by Brickken | Day 90-120"],
    ["Compliance Monitoring (Year 1)", 500, "", '=IF(C35<>"",C35,B35)', "PleoChrome", "Built into Brickken | Day 120+"],
    ["Annual AML Audit", 3500, "", '=IF(C36<>"",C36,B36)', "PleoChrome", "Boutique $3K-5K | Month 12"],
    ["", "", "", "", "", ""],
    ["COST SUMMARY", "", "", "", "", ""],
    ["PleoChrome Direct Costs", "", "", "=D2+D3+D5+D17+D18+D19+D20+D21+D22+D26+D27+D28+D29+D30+D33+D34+D35+D36", "", ""],
    ["Asset Holder Pass-Through", "", "", "=D4+D8+D9+D10+D11+D12+D13+D14+D15+D16+D23", "", ""],
    ["BD Placement Fee", "", "", "=Assumptions!B21", "", ""],
    ["TOTAL ALL COSTS", "", "", "=D39+D40+D41", "", ""],
  ];
}

function getPnlData() {
  return [
    ["Revenue Stream", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "5-Year Total"],
    ["Setup Fee", "=Assumptions!B18", 0, 0, 0, 0, "=SUM(B2:F2)"],
    ["Success Fee", "=Assumptions!B19", 0, 0, 0, 0, "=SUM(B3:F3)"],
    ["Secondary Transfer Fees", 12000, 24000, 24000, 24000, 24000, "=SUM(B4:F4)"],
    ["Annual Admin Fee", 0, "=Assumptions!B20", "=Assumptions!B20", "=Assumptions!B20", "=Assumptions!B20", "=SUM(B5:F5)"],
    ["Valuation Refresh Fee", 0, 25000, 25000, 25000, 25000, "=SUM(B6:F6)"],
    ["TOTAL REVENUE", "=SUM(B2:B6)", "=SUM(C2:C6)", "=SUM(D2:D6)", "=SUM(E2:E6)", "=SUM(F2:F6)", "=SUM(G2:G6)"],
    ["", "", "", "", "", "", ""],
    ["PleoChrome Direct Costs", "='Deal Model'!D39", 0, 0, 0, 0, "=SUM(B9:F9)"],
    ["Annual Ongoing", 0, 15000, 15000, 15000, 15000, "=SUM(B10:F10)"],
    ["TOTAL COSTS", "=SUM(B9:B10)", "=SUM(C9:C10)", "=SUM(D9:D10)", "=SUM(E9:E10)", "=SUM(F9:F10)", "=SUM(G9:G10)"],
    ["", "", "", "", "", "", ""],
    ["NET INCOME", "=B7-B11", "=C7-C11", "=D7-D11", "=E7-E11", "=F7-F11", "=G7-G11"],
    ["NET MARGIN", "=IF(B7=0,0,B13/B7)", "=IF(C7=0,0,C13/C7)", "=IF(D7=0,0,D13/D7)", "=IF(E7=0,0,E13/E7)", "=IF(F7=0,0,F13/F7)", "=IF(G7=0,0,G13/G7)"],
    ["", "", "", "", "", "", ""],
    ["ASSET HOLDER ECONOMICS", "", "", "", "", "", ""],
    ["Claimed Asset Value", "=Assumptions!B5", "", "", "", "", ""],
    ["Offering Value", "=Assumptions!B7", "", "", "", "", ""],
    ["Less: BD Placement", "=-Assumptions!B21", "", "", "", "", ""],
    ["Less: Setup Fee", "=-Assumptions!B18", "", "", "", "", ""],
    ["Less: Success Fee", "=-Assumptions!B19", "", "", "", "", ""],
    ["Less: Pass-Through Costs", "=-'Deal Model'!D40", "", "", "", "", ""],
    ["NET TO ASSET HOLDER", "=SUM(B17:B22)", "", "", "", "", ""],
    ["% of Claimed Value", "=IF(B17=0,0,B23/B17)", "", "", "", "", ""],
  ];
}

function getSourcesData() {
  return [
    ["Cost Category", "Rate / Amount", "Basis", "Last Verified", "Source"],
    ["GIA Colored Stone Report (50+ ct)", "$300-$500", "Per report", "Mar 2026", "gia.edu/gem-lab-fee-schedule"],
    ["SSEF Origin Report (50-100 ct)", "CHF 4,000", "Per report", "Mar 2026", "ssef.ch/testing-prices"],
    ["Gubelin ID + Origin", "~CHF 4,000", "Per report", "Mar 2026", "gubelingemlab.com"],
    ["USPAP Appraisal (CGA/MGA)", "$150-$250/hr", "Hourly (not % of value)", "Mar 2026", "americangemsociety.org/CGA"],
    ["Vault Custody (Brink's)", "0.10-0.15%", "Annual, of asset value", "Mar 2026", "us.brinks.com/precious-metals"],
    ["Vault Custody (Malca-Amit FTZ)", "0.10-0.25%", "Annual, of asset value", "Mar 2026", "malca-amit.com/vaults-ftz"],
    ["Specie Insurance (vault-stored)", "0.10-0.15%", "Annual, of insured value", "Mar 2026", "AXA XL / Lloyd's syndicate"],
    ["Transit Insurance", "0.25-1.0%", "Per transit event", "Mar 2026", "Marsh Fine Art & Specie"],
    ["Brickken Advanced Tier", "EUR 5,000/yr", "Annual subscription", "Mar 2026", "brickken.com/plans"],
    ["Chainlink BUILD Program", "$0 cash", "Token supply commitment", "Mar 2026", "chain.link/build-program"],
    ["Chainlink LINK Feed Costs", "$100-200/mo", "Monthly oracle fees", "Mar 2026", "docs.chain.link/data-feeds"],
    ["Config Review (pre-audited)", "$2.5K-$5K", "Per review", "Mar 2026", "softstack.io/audit-cost-2025"],
    ["Securities Attorney (boutique)", "$7.5K-$12K", "Flat fee per offering", "Mar 2026", "contractscounsel.com/ppm-cost"],
    ["Wyoming Series LLC Formation", "$100", "One-time", "Mar 2026", "sos.wyo.gov/Business/docs/BusinessFees.pdf"],
    ["Wyoming Registered Agent", "$25-$125/yr", "Annual", "Mar 2026", "wyomingagents.com"],
    ["Form D Filing (SEC)", "$0", "No fee", "Mar 2026", "sec.gov/form-d"],
    ["Blue Sky Filing (per state avg)", "$100-$500", "Per state notice", "Mar 2026", "blueskycomply.com/fees"],
    ["KYC (Veriff Essential)", "$0.80/check", "Per verification", "Mar 2026", "veriff.com/plans"],
    ["KYC (Sumsub Basic)", "$1.35/check", "Per verification", "Mar 2026", "sumsub.com/pricing"],
    ["Self-Cert ($200K+ investments)", "$0", "SEC March 2025 guidance", "Mar 2026", "SEC Rule 506(c) update"],
    ["BD Placement (full service)", "5-7%", "Of capital raised", "Mar 2026", "FINRA guidelines"],
    ["AML Audit (boutique)", "$3K-$5K", "Annual", "Mar 2026", "BSA/AML benchmarks"],
  ];
}

function getTimelineData() {
  return [
    ["Event", "Day Start", "Day End", "Cost Out ($)", "Revenue In ($)", "Running Balance ($)", "Phase"],
    ["Setup fee collected", 1, 1, 0, "=Assumptions!B18", "=E2-D2", "Acquisition"],
    ["KYC/KYB + Sanctions", 1, 3, 150, 0, "=F2+E3-D3", "Acquisition"],
    ["Provenance research (AH cost)", 3, 10, 0, 0, "=F3+E4-D4", "Acquisition"],
    ["Intake agreement (legal)", 5, 14, 2500, 0, "=F4+E5-D5", "Acquisition"],
    ["Stone shipped to GIA/SSEF", 14, 14, 0, 0, "=F5+E6-D6", "Preparation"],
    ["Lab reports received", 28, 35, 0, 0, "=F6+E7-D7", "Preparation"],
    ["Appraiser 1", 28, 38, 0, 0, "=F7+E8-D8", "Preparation"],
    ["Appraiser 2", 38, 48, 0, 0, "=F8+E9-D9", "Preparation"],
    ["Appraiser 3", 48, 56, 0, 0, "=F9+E10-D10", "Preparation"],
    ["SPV formation", 30, 45, 750, 0, "=F10+E11-D11", "Preparation"],
    ["PPM drafting begins", 35, 70, 10000, 0, "=F11+E12-D12", "Preparation"],
    ["Sub + Token agreements", 50, 70, 4500, 0, "=F12+E13-D13", "Preparation"],
    ["Chainlink PoR integration", 42, 70, 2500, 0, "=F13+E14-D14", "Preparation"],
    ["Vault custody begins", 56, 60, 0, 0, "=F14+E15-D15", "Preparation"],
    ["Brickken platform", 63, 63, 5500, 0, "=F15+E16-D16", "Tokenization"],
    ["Configuration review", 63, 75, 3500, 0, "=F16+E17-D17", "Tokenization"],
    ["Testnet + testing", 65, 80, 5000, 0, "=F17+E18-D18", "Tokenization"],
    ["Mainnet deploy + gas", 80, 80, 100, 0, "=F18+E19-D19", "Tokenization"],
    ["Blue sky filings", 80, 84, 1500, 0, "=F19+E20-D20", "Tokenization"],
    ["Marketing begins", 84, 120, 3000, 0, "=F20+E21-D21", "Distribution"],
    ["First investors onboard", 90, 90, 0, 0, "=F21+E22-D22", "Distribution"],
    ["Token sale closes + Success fee", 120, 120, 500, "=Assumptions!B19", "=F22+E23-D23", "Distribution"],
    ["Compliance monitoring starts", 120, 120, 0, 0, "=F23+E24-D24", "Distribution"],
  ];
}

// ═══════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════

export default function HotTableWrapper({ dark }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>("assumptions");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hotRef = useRef<any>(null);

  const getSettings = useCallback(() => {
    const base = {
      licenseKey: "non-commercial-and-evaluation",
      rowHeaders: true,
      manualColumnResize: true,
      manualRowResize: true,
      contextMenu: true,
      undo: true,
      autoWrapRow: true,
      autoWrapCol: true,
      formulas: { engine: HyperFormula },
      className: dark ? "htDark" : "",
      height: "auto",
      stretchH: "all" as const,
    };

    switch (activeTab) {
      case "assumptions":
        return {
          ...base,
          data: getAssumptionsData(),
          colHeaders: ["Parameter", "Value", "Unit", "Source / Justification"],
          colWidths: [250, 150, 60, 350],
          columns: [
            { type: "text" as const },
            { type: "text" as const, numericFormat: { pattern: "$0,0.00" } },
            { type: "text" as const },
            { type: "text" as const },
          ],
        };
      case "deal":
        return {
          ...base,
          data: getDealData(),
          colHeaders: ["Line Item", "Default ($)", "Override ($)", "Actual ($)", "Paid By", "Source / When Due"],
          colWidths: [220, 120, 120, 120, 100, 280],
        };
      case "pnl":
        return {
          ...base,
          data: getPnlData(),
          colHeaders: ["", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "5-Year Total"],
          colWidths: [200, 120, 120, 120, 120, 120, 130],
        };
      case "sources":
        return {
          ...base,
          data: getSourcesData(),
          colHeaders: ["Cost Category", "Rate / Amount", "Basis", "Last Verified", "Source"],
          colWidths: [250, 130, 160, 100, 280],
        };
      case "timeline":
        return {
          ...base,
          data: getTimelineData(),
          colHeaders: ["Event", "Day Start", "Day End", "Cost Out ($)", "Revenue In ($)", "Running Balance ($)", "Phase"],
          colWidths: [250, 80, 80, 120, 120, 140, 100],
        };
      default:
        return base;
    }
  }, [activeTab, dark]);

  const settings = getSettings();

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-1 mb-3 overflow-x-auto pb-1">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-3 sm:px-4 py-2 rounded-lg text-[10px] sm:text-xs font-medium transition-all whitespace-nowrap border ${
              activeTab === tab.id
                ? "text-white border-transparent"
                : dark
                  ? "border-white/[0.06] text-white/30 hover:text-white/50"
                  : "border-gray-200 text-gray-400 hover:text-gray-600"
            }`}
            style={activeTab === tab.id ? { background: tab.color } : {}}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Spreadsheet */}
      <div className={`rounded-xl overflow-hidden border ${dark ? "border-white/[0.06]" : "border-gray-200"}`}>
        <HotTable
          ref={hotRef}
          {...settings}
        />
      </div>

      {/* Instructions */}
      <p className={`text-[9px] sm:text-[10px] mt-2 ${dark ? "text-white/20" : "text-gray-400"}`}>
        Double-click any cell to edit. Formulas auto-calculate. Override column (Deal Model tab) lets you change any default.
        Changes are live — they update across all tabs instantly.
      </p>
    </div>
  );
}
