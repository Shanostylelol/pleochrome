"use client";

import { useEffect, useRef, useState } from "react";
import Handsontable from "handsontable";
import { HotTable } from "@handsontable/react-wrapper";
import { registerAllModules } from "handsontable/registry";
import HyperFormula from "hyperformula";
import "handsontable/styles/handsontable.css";
import "handsontable/styles/ht-theme-main.css";

registerAllModules();

interface Props { dark: boolean }

type TabId = "Assumptions" | "Deal Model" | "PnL" | "Pricing Sources" | "Timeline";

const tabMeta: { id: TabId; label: string; color: string }[] = [
  { id: "Assumptions", label: "Assumptions", color: "#1A8B7A" },
  { id: "Deal Model", label: "Deal Model", color: "#1B6B4A" },
  { id: "PnL", label: "P&L", color: "#1E3A6E" },
  { id: "Pricing Sources", label: "Pricing Sources", color: "#C47A1A" },
  { id: "Timeline", label: "Payment Timeline", color: "#5B2D8E" },
];

// ═══════════════════════════════════════════════
// SHEET DATA (all sheets registered in one HF engine)
// ═══════════════════════════════════════════════

const sheetsData: Record<TabId, (string | number | null)[][]> = {
  "Assumptions": [
    ["ASSET DETAILS", null, null, null],
    ["Stone Type", "Burmese Ruby", null, "Pigeon's blood, Mogok origin"],
    ["Carat Weight", 55, "ct", "Comparable: Estrela de Fura (55.22ct, $34.8M)"],
    ["Treatment", "No Heat", null, "Unheated commands 2-5x premium"],
    ["Claimed Asset Value", 55000000, "$", "Enter the stone owner's claimed value"],
    ["Appraisal Discount", 0.127, "%", "3-Appraisal Rule: avg of 2 lowest"],
    ["Offering Value", "=B5*(1-B6)", "$", "Auto: Claimed x (1 - Discount)"],
    ["Token Price", 100000, "$", "Min investment per token"],
    ["Total Tokens", "=INT(B7/B8)", "#", "Auto: Offering Value / Token Price"],
    [null, null, null, null],
    ["FEE STRUCTURE", null, null, null],
    ["Setup Fee Rate", 0.02, "%", "1-3%. Collected at engagement."],
    ["Success Fee Rate", 0.015, "%", "0.5-3%. Collected at close."],
    ["Annual Admin Fee Rate", 0.0075, "%", "0.5-1.0%. Recurring Year 2+."],
    ["BD Placement Rate", 0.07, "%", "5-7%. 0% if direct placement."],
    [null, null, null, null],
    ["CALCULATED FEES", null, null, null],
    ["Setup Fee ($)", "=B5*B12", "$", "Asset Value x Setup Rate"],
    ["Success Fee ($)", "=B7*B13", "$", "Offering Value x Success Rate"],
    ["Annual Admin Fee ($)", "=B7*B14", "$", "Offering Value x Admin Rate"],
    ["BD Placement Fee ($)", "=B7*B15", "$", "Offering Value x BD Rate"],
  ],
  "Deal Model": [
    ["PHASE 1: ACQUISITION", null, null, null, null, null],
    ["KYC / KYB on Asset Holder", 50, null, '=IF(ISBLANK(C2),B2,C2)', "PleoChrome", "Day 1-3"],
    ["Sanctions & PEP Screening", 100, null, '=IF(ISBLANK(C3),B3,C3)', "PleoChrome", "Day 1-3"],
    ["Provenance Research", 2500, null, '=IF(ISBLANK(C4),B4,C4)', "Asset Holder", "Day 3-10"],
    ["Intake Agreement", 2500, null, '=IF(ISBLANK(C5),B5,C5)', "PleoChrome", "Day 5-14"],
    [null, null, null, null, null, null],
    ["PHASE 2: PREPARATION", null, null, null, null, null],
    ["GIA Grading Report", 0, null, '=IF(ISBLANK(C8),B8,C8)', "Asset Holder", "Day 14-35"],
    ["SSEF Origin Report", 0, null, '=IF(ISBLANK(C9),B9,C9)', "Asset Holder", "Day 14-35"],
    ["Gubelin Report", 0, null, '=IF(ISBLANK(C10),B10,C10)', "Asset Holder", "Day 14-35"],
    ["Appraisal #1", 7500, null, '=IF(ISBLANK(C11),B11,C11)', "Asset Holder", "Day 28-38"],
    ["Appraisal #2", 7500, null, '=IF(ISBLANK(C12),B12,C12)', "Asset Holder", "Day 38-48"],
    ["Appraisal #3", 7500, null, '=IF(ISBLANK(C13),B13,C13)', "Asset Holder", "Day 48-56"],
    ["Transit Insurance", 10000, null, '=IF(ISBLANK(C14),B14,C14)', "Asset Holder", "Days 28-65"],
    ["Vault Custody (Year 1)", 55000, null, '=IF(ISBLANK(C15),B15,C15)', "Asset Holder", "Day 56+"],
    ["Specie Insurance (Year 1)", 55000, null, '=IF(ISBLANK(C16),B16,C16)', "Asset Holder", "Day 56+"],
    ["Chainlink Integration", 2500, null, '=IF(ISBLANK(C17),B17,C17)', "PleoChrome", "Day 42-70"],
    ["Chainlink LINK Fees", 1200, null, '=IF(ISBLANK(C18),B18,C18)', "PleoChrome", "Day 70+"],
    ["SPV Formation", 750, null, '=IF(ISBLANK(C19),B19,C19)', "PleoChrome", "Day 30-45"],
    ["PPM Drafting", 10000, null, '=IF(ISBLANK(C20),B20,C20)', "PleoChrome", "Day 35-70"],
    ["Subscription Agreement", 2000, null, '=IF(ISBLANK(C21),B21,C21)', "PleoChrome", "Day 50-70"],
    ["Token Purchase Agreement", 2500, null, '=IF(ISBLANK(C22),B22,C22)', "PleoChrome", "Day 50-70"],
    ["Photo & Media", 2000, null, '=IF(ISBLANK(C23),B23,C23)', "Asset Holder", "Day 56-65"],
    [null, null, null, null, null, null],
    ["PHASE 3: TOKENIZATION", null, null, null, null, null],
    ["Brickken Platform", 5500, null, '=IF(ISBLANK(C26),B26,C26)', "PleoChrome", "Day 63"],
    ["Configuration Review", 3500, null, '=IF(ISBLANK(C27),B27,C27)', "PleoChrome", "Day 63-75"],
    ["Development & Testing", 5000, null, '=IF(ISBLANK(C28),B28,C28)', "PleoChrome", "Day 65-80"],
    ["Blockchain Gas Fees", 100, null, '=IF(ISBLANK(C29),B29,C29)', "PleoChrome", "Day 80"],
    ["Blue Sky Filings", 1500, null, '=IF(ISBLANK(C30),B30,C30)', "PleoChrome", "Day 80-84"],
    [null, null, null, null, null, null],
    ["PHASE 4: DISTRIBUTION", null, null, null, null, null],
    ["Marketing", 3000, null, '=IF(ISBLANK(C33),B33,C33)', "PleoChrome", "Day 84-120"],
    ["Investor KYC", 0, null, '=IF(ISBLANK(C34),B34,C34)', "PleoChrome", "Day 90-120"],
    ["Compliance Monitoring", 500, null, '=IF(ISBLANK(C35),B35,C35)', "PleoChrome", "Day 120+"],
    ["Annual AML Audit", 3500, null, '=IF(ISBLANK(C36),B36,C36)', "PleoChrome", "Month 12"],
    [null, null, null, null, null, null],
    ["TOTALS", null, null, null, null, null],
    ["PleoChrome Costs", null, null, "=D2+D3+D5+D17+D18+D19+D20+D21+D22+D26+D27+D28+D29+D30+D33+D34+D35+D36", null, null],
    ["Asset Holder Costs", null, null, "=D4+D8+D9+D10+D11+D12+D13+D14+D15+D16+D23", null, null],
    ["BD Placement Fee", null, null, "=Assumptions!B21", null, null],
    ["TOTAL ALL COSTS", null, null, "=D39+D40+D41", null, null],
  ],
  "PnL": [
    ["", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "5-Year Total"],
    ["Setup Fee", "=Assumptions!B18", 0, 0, 0, 0, "=SUM(B2:F2)"],
    ["Success Fee", "=Assumptions!B19", 0, 0, 0, 0, "=SUM(B3:F3)"],
    ["Transfer Fees (est.)", 12000, 24000, 24000, 24000, 24000, "=SUM(B4:F4)"],
    ["Annual Admin Fee", 0, "=Assumptions!B20", "=Assumptions!B20", "=Assumptions!B20", "=Assumptions!B20", "=SUM(B5:F5)"],
    ["Valuation Refresh", 0, 25000, 25000, 25000, 25000, "=SUM(B6:F6)"],
    ["TOTAL REVENUE", "=SUM(B2:B6)", "=SUM(C2:C6)", "=SUM(D2:D6)", "=SUM(E2:E6)", "=SUM(F2:F6)", "=SUM(G2:G6)"],
    [null, null, null, null, null, null, null],
    ["PleoChrome Costs", "='Deal Model'!D39", 0, 0, 0, 0, "=SUM(B9:F9)"],
    ["Annual Ongoing", 0, 15000, 15000, 15000, 15000, "=SUM(B10:F10)"],
    ["TOTAL COSTS", "=B9+B10", "=C9+C10", "=D9+D10", "=E9+E10", "=F9+F10", "=G9+G10"],
    [null, null, null, null, null, null, null],
    ["NET INCOME", "=B7-B11", "=C7-C11", "=D7-D11", "=E7-E11", "=F7-F11", "=G7-G11"],
    ["NET MARGIN", "=IF(B7=0,0,B13/B7)", "=IF(C7=0,0,C13/C7)", "=IF(D7=0,0,D13/D7)", "=IF(E7=0,0,E13/E7)", "=IF(F7=0,0,F13/F7)", "=IF(G7=0,0,G13/G7)"],
    [null, null, null, null, null, null, null],
    ["ASSET HOLDER", null, null, null, null, null, null],
    ["Claimed Value", "=Assumptions!B5", null, null, null, null, null],
    ["Offering Value", "=Assumptions!B7", null, null, null, null, null],
    ["Less: BD Fee", "=-Assumptions!B21", null, null, null, null, null],
    ["Less: Setup Fee", "=-Assumptions!B18", null, null, null, null, null],
    ["Less: Success Fee", "=-Assumptions!B19", null, null, null, null, null],
    ["Less: Pass-Through", "=-'Deal Model'!D40", null, null, null, null, null],
    ["NET TO HOLDER", "=SUM(B17:B22)", null, null, null, null, null],
    ["% of Claimed", "=IF(B17=0,0,B23/B17)", null, null, null, null, null],
  ],
  "Pricing Sources": [
    ["Cost Category", "Rate / Amount", "Basis", "Verified", "Source"],
    ["GIA Report (50+ ct)", "$300-$500", "Per report", "Mar 2026", "gia.edu"],
    ["SSEF Origin (50-100ct)", "CHF 4,000", "Per report", "Mar 2026", "ssef.ch"],
    ["Gubelin ID + Origin", "~CHF 4,000", "Per report", "Mar 2026", "gubelingemlab.com"],
    ["USPAP Appraisal", "$150-$250/hr", "Hourly", "Mar 2026", "americangemsociety.org"],
    ["Vault (Brink's)", "0.10-0.15%", "Annual", "Mar 2026", "us.brinks.com"],
    ["Vault (Malca-Amit)", "0.10-0.25%", "Annual", "Mar 2026", "malca-amit.com"],
    ["Specie Insurance", "0.10-0.15%", "Annual", "Mar 2026", "AXA XL / Lloyd's"],
    ["Transit Insurance", "0.25-1.0%", "Per transit", "Mar 2026", "Marsh Fine Art"],
    ["Brickken Advanced", "EUR 5,000/yr", "Annual", "Mar 2026", "brickken.com/plans"],
    ["Chainlink BUILD", "$0 cash", "Token commit", "Mar 2026", "chain.link/build-program"],
    ["Chainlink LINK", "$100-200/mo", "Monthly", "Mar 2026", "docs.chain.link"],
    ["Config Review", "$2.5K-$5K", "Per review", "Mar 2026", "softstack.io"],
    ["Attorney (boutique)", "$7.5K-$12K", "Flat fee", "Mar 2026", "contractscounsel.com"],
    ["Wyoming LLC", "$100", "One-time", "Mar 2026", "sos.wyo.gov"],
    ["Form D (SEC)", "$0", "No fee", "Mar 2026", "sec.gov"],
    ["Blue Sky (avg/state)", "$100-$500", "Per state", "Mar 2026", "blueskycomply.com"],
    ["KYC (Veriff)", "$0.80/check", "Per check", "Mar 2026", "veriff.com"],
    ["KYC (Sumsub)", "$1.35/check", "Per check", "Mar 2026", "sumsub.com"],
    ["Self-Cert ($200K+)", "$0", "SEC 2025", "Mar 2026", "SEC 506(c)"],
    ["BD Placement", "5-7%", "Of raised", "Mar 2026", "FINRA"],
    ["AML Audit", "$3K-$5K", "Annual", "Mar 2026", "BSA/AML"],
  ],
  "Timeline": [
    ["Event", "Day", "Day End", "Cost Out", "Revenue In", "Balance", "Phase"],
    ["Setup fee collected", 1, 1, 0, "=Assumptions!B18", "=E2-D2", "Acquisition"],
    ["KYC + Sanctions", 1, 3, 150, 0, "=F2+E3-D3", "Acquisition"],
    ["Provenance (AH)", 3, 10, 0, 0, "=F3+E4-D4", "Acquisition"],
    ["Intake agreement", 5, 14, 2500, 0, "=F4+E5-D5", "Acquisition"],
    ["Stone to GIA", 14, 14, 0, 0, "=F5+E6-D6", "Preparation"],
    ["Lab reports back", 28, 35, 0, 0, "=F6+E7-D7", "Preparation"],
    ["Appraiser 1", 28, 38, 0, 0, "=F7+E8-D8", "Preparation"],
    ["Appraiser 2", 38, 48, 0, 0, "=F8+E9-D9", "Preparation"],
    ["Appraiser 3", 48, 56, 0, 0, "=F9+E10-D10", "Preparation"],
    ["SPV formation", 30, 45, 750, 0, "=F10+E11-D11", "Preparation"],
    ["PPM drafting", 35, 70, 10000, 0, "=F11+E12-D12", "Preparation"],
    ["Agreements", 50, 70, 4500, 0, "=F12+E13-D13", "Preparation"],
    ["Chainlink PoR", 42, 70, 2500, 0, "=F13+E14-D14", "Preparation"],
    ["Vault intake", 56, 60, 0, 0, "=F14+E15-D15", "Preparation"],
    ["Brickken setup", 63, 63, 5500, 0, "=F15+E16-D16", "Tokenization"],
    ["Config review", 63, 75, 3500, 0, "=F16+E17-D17", "Tokenization"],
    ["Dev + testing", 65, 80, 5000, 0, "=F17+E18-D18", "Tokenization"],
    ["Mainnet deploy", 80, 80, 100, 0, "=F18+E19-D19", "Tokenization"],
    ["Blue sky filings", 80, 84, 1500, 0, "=F19+E20-D20", "Tokenization"],
    ["Marketing begins", 84, 120, 3000, 0, "=F20+E21-D21", "Distribution"],
    ["Investors onboard", 90, 90, 0, 0, "=F21+E22-D22", "Distribution"],
    ["Sale closes + fee", 120, 120, 500, "=Assumptions!B19", "=F22+E23-D23", "Distribution"],
  ],
};

const sheetColHeaders: Record<TabId, string[]> = {
  "Assumptions": ["Parameter", "Value", "Unit", "Source / Justification"],
  "Deal Model": ["Line Item", "Default ($)", "Override ($)", "Actual ($)", "Paid By", "Source / Timing"],
  "PnL": ["", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "5-Year Total"],
  "Pricing Sources": ["Cost Category", "Rate / Amount", "Basis", "Verified", "Source"],
  "Timeline": ["Event", "Day Start", "Day End", "Cost Out ($)", "Revenue In ($)", "Running Balance ($)", "Phase"],
};

const sheetColWidths: Record<TabId, number[]> = {
  "Assumptions": [220, 140, 50, 320],
  "Deal Model": [200, 110, 110, 110, 100, 240],
  "PnL": [180, 110, 110, 110, 110, 110, 120],
  "Pricing Sources": [220, 120, 120, 90, 240],
  "Timeline": [200, 70, 70, 110, 110, 130, 90],
};

// Currency cells per sheet (row, col) — 0-indexed
const currencyCells: Record<TabId, [number, number][]> = {
  "Assumptions": [[4,1],[6,1],[7,1],[8,1],[17,1],[18,1],[19,1],[20,1]],
  "Deal Model": [[1,1],[1,2],[1,3],[2,1],[2,2],[2,3],[3,1],[3,2],[3,3],[4,1],[4,2],[4,3],
    [7,1],[7,2],[7,3],[8,1],[8,2],[8,3],[9,1],[9,2],[9,3],[10,1],[10,2],[10,3],
    [11,1],[11,2],[11,3],[12,1],[12,2],[12,3],[13,1],[13,2],[13,3],[14,1],[14,2],[14,3],
    [15,1],[15,2],[15,3],[16,1],[16,2],[16,3],[17,1],[17,2],[17,3],[18,1],[18,2],[18,3],
    [19,1],[19,2],[19,3],[20,1],[20,2],[20,3],[21,1],[21,2],[21,3],[22,1],[22,2],[22,3],
    [25,1],[25,2],[25,3],[26,1],[26,2],[26,3],[27,1],[27,2],[27,3],[28,1],[28,2],[28,3],
    [29,1],[29,2],[29,3],[32,1],[32,2],[32,3],[33,1],[33,2],[33,3],[34,1],[34,2],[34,3],
    [35,1],[35,2],[35,3],[38,3],[39,3],[40,3],[41,3]],
  "PnL": [],  // Will format all numeric cells
  "Pricing Sources": [],
  "Timeline": [],
};

// ═══════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════

export default function HotTableWrapper({ dark }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>("Assumptions");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hotRefs = useRef<Record<TabId, any>>({} as Record<TabId, any>);
  const [hfInstance] = useState(() =>
    HyperFormula.buildEmpty({
      licenseKey: "gpl-v3",
      precisionRounding: 2,
    })
  );
  const [ready, setReady] = useState(false);

  // Register all sheets in HyperFormula on mount
  useEffect(() => {
    const sheetNames = hfInstance.getSheetNames();

    // Add sheets that don't exist yet
    for (const tabId of Object.keys(sheetsData) as TabId[]) {
      if (!sheetNames.includes(tabId)) {
        hfInstance.addSheet(tabId);
      }
    }

    // Set data for each sheet
    for (const tabId of Object.keys(sheetsData) as TabId[]) {
      const sheetId = hfInstance.getSheetId(tabId);
      if (sheetId !== undefined) {
        hfInstance.setSheetContent(sheetId, sheetsData[tabId]);
      }
    }

    setReady(true);
  }, [hfInstance]);

  if (!ready) {
    return <div className={`text-center py-20 ${dark ? "text-white/30" : "text-gray-400"}`}>Loading spreadsheet engine...</div>;
  }

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-1 mb-3 overflow-x-auto pb-1">
        {tabMeta.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-3 sm:px-4 py-2 rounded-lg text-[10px] sm:text-xs font-medium transition-all whitespace-nowrap border ${
              activeTab === tab.id
                ? "text-white border-transparent"
                : dark ? "border-white/[0.06] text-white/30 hover:text-white/50" : "border-gray-200 text-gray-400 hover:text-gray-600"
            }`}
            style={activeTab === tab.id ? { background: tab.color } : {}}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Sheets — render all but only show active */}
      {(Object.keys(sheetsData) as TabId[]).map(tabId => (
        <div key={tabId} style={{ display: activeTab === tabId ? "block" : "none" }}>
          <div className={`rounded-xl overflow-hidden border ${dark ? "border-white/[0.08]" : "border-gray-200"}`}>
            <HotTable
              ref={(el: unknown) => { hotRefs.current[tabId] = el; }}
              data={sheetsData[tabId]}
              colHeaders={sheetColHeaders[tabId]}
              colWidths={sheetColWidths[tabId]}
              rowHeaders={true}
              formulas={{ engine: hfInstance, sheetName: tabId }}
              licenseKey="non-commercial-and-evaluation"
              manualColumnResize={true}
              manualRowResize={true}
              contextMenu={true}
              undo={true}
              autoWrapRow={true}
              autoWrapCol={true}
              height="auto"
              stretchH="all"
              className={dark ? "htDark" : ""}
              cells={function(row, col) {
                const cp: Handsontable.CellMeta = {};

                // Section headers (row 0, 6, 10, 16, 24, 31, 37, 38 in various sheets)
                const cellVal = sheetsData[tabId]?.[row]?.[col];
                const firstCol = sheetsData[tabId]?.[row]?.[0];

                if (typeof firstCol === "string" && (
                  firstCol.startsWith("PHASE") ||
                  firstCol.startsWith("ASSET") ||
                  firstCol.startsWith("FEE") ||
                  firstCol.startsWith("CALCULATED") ||
                  firstCol === "TOTALS" ||
                  firstCol === "TOTAL REVENUE" ||
                  firstCol === "TOTAL COSTS" ||
                  firstCol === "TOTAL ALL COSTS" ||
                  firstCol === "NET INCOME" ||
                  firstCol === "NET TO HOLDER" ||
                  firstCol === "NET MARGIN"
                )) {
                  cp.renderer = function(instance, td, row, col, prop, value, cp) {
                    Handsontable.renderers.TextRenderer(instance, td, row, col, prop, value, cp);
                    td.style.fontWeight = "bold";
                    td.style.background = dark ? "#0F1B2E" : "#E8EAF0";
                  };
                }

                // Currency formatting for numeric columns
                if (tabId === "Deal Model" && (col === 1 || col === 2 || col === 3)) {
                  cp.numericFormat = { pattern: "$0,0", culture: "en-US" };
                  cp.type = "numeric";
                  if (col === 2) {
                    // Override column — yellow highlight
                    cp.renderer = function(instance, td, row, col, prop, value, cp) {
                      Handsontable.renderers.NumericRenderer(instance, td, row, col, prop, value, cp);
                      td.style.background = dark ? "#2A2000" : "#FFF9C4";
                      td.style.color = dark ? "#FFD54F" : "#1565C0";
                      td.style.fontWeight = "bold";
                    };
                  }
                  if (col === 3) {
                    // Actual column — light blue
                    cp.renderer = function(instance, td, row, col, prop, value, cp) {
                      Handsontable.renderers.NumericRenderer(instance, td, row, col, prop, value, cp);
                      td.style.background = dark ? "#0A1929" : "#E3F2FD";
                    };
                  }
                }

                // Assumptions value column
                if (tabId === "Assumptions" && col === 1) {
                  const r = row;
                  // Percentage rows
                  if (r === 5 || r === 11 || r === 12 || r === 13 || r === 14) {
                    cp.numericFormat = { pattern: "0.00%", culture: "en-US" };
                    cp.type = "numeric";
                  }
                  // Currency rows
                  if (r === 4 || r === 6 || r === 7 || r === 8 || r === 17 || r === 18 || r === 19 || r === 20) {
                    cp.numericFormat = { pattern: "$0,0", culture: "en-US" };
                    cp.type = "numeric";
                  }
                  // Editable input cells (yellow)
                  if (r === 1 || r === 2 || r === 3 || r === 4 || r === 5 || r === 7 || r === 11 || r === 12 || r === 13 || r === 14) {
                    cp.renderer = function(instance, td, row, col, prop, value, cp) {
                      Handsontable.renderers.TextRenderer(instance, td, row, col, prop, value, cp);
                      td.style.background = dark ? "#2A2000" : "#FFF9C4";
                      td.style.color = dark ? "#FFD54F" : "#1565C0";
                      td.style.fontWeight = "bold";
                    };
                  }
                  // Calculated cells (blue)
                  if (r === 6 || r === 8 || r === 17 || r === 18 || r === 19 || r === 20) {
                    cp.readOnly = true;
                    cp.renderer = function(instance, td, row, col, prop, value, cp) {
                      Handsontable.renderers.NumericRenderer(instance, td, row, col, prop, value, cp);
                      td.style.background = dark ? "#0A1929" : "#E3F2FD";
                    };
                  }
                }

                // P&L formatting
                if (tabId === "PnL" && col >= 1) {
                  const r = row;
                  if (r === 13 || r === 23) {
                    // Percentage rows
                    cp.numericFormat = { pattern: "0.00%", culture: "en-US" };
                    cp.type = "numeric";
                  } else if (r >= 1 && r !== 7 && r !== 11 && r !== 14 && r !== 15) {
                    cp.numericFormat = { pattern: "$0,0", culture: "en-US" };
                    cp.type = "numeric";
                  }
                }

                // Timeline formatting
                if (tabId === "Timeline" && (col === 3 || col === 4 || col === 5)) {
                  cp.numericFormat = { pattern: "$0,0", culture: "en-US" };
                  cp.type = "numeric";
                  if (col === 5) {
                    // Running balance — conditional color
                    cp.renderer = function(instance, td, row, col, prop, value, cp) {
                      Handsontable.renderers.NumericRenderer(instance, td, row, col, prop, value, cp);
                      const num = parseFloat(String(value));
                      if (!isNaN(num) && num < 0) {
                        td.style.color = "#A61D3A";
                        td.style.fontWeight = "bold";
                      } else {
                        td.style.color = dark ? "#1A8B7A" : "#1B6B4A";
                      }
                    };
                  }
                }

                return cp;
              }}
            />
          </div>
        </div>
      ))}

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-3">
        <div className="flex items-center gap-1.5">
          <div className={`w-4 h-3 rounded ${dark ? "bg-[#2A2000]" : "bg-[#FFF9C4]"} border ${dark ? "border-white/10" : "border-gray-300"}`} />
          <span className={`text-[9px] ${dark ? "text-white/30" : "text-gray-400"}`}>Editable input</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className={`w-4 h-3 rounded ${dark ? "bg-[#0A1929]" : "bg-[#E3F2FD]"} border ${dark ? "border-white/10" : "border-gray-300"}`} />
          <span className={`text-[9px] ${dark ? "text-white/30" : "text-gray-400"}`}>Auto-calculated</span>
        </div>
        <span className={`text-[9px] ${dark ? "text-white/20" : "text-gray-300"}`}>Double-click to edit. Formulas auto-calculate across all tabs.</span>
      </div>
    </div>
  );
}
