"use client";

import { useEffect, useRef } from "react";
import "@univerjs/preset-sheets-core/lib/index.css";

/* ═══════════════════════════════════════════════
   PleoChrome — Univer Spreadsheet Component
   Full Excel-like spreadsheet with formatting toolbar
   ═══════════════════════════════════════════════ */

// Style definitions
const navy = "0B2341";
const headerStyle = "hdr";
const sectionStyle = "sec";
const inputStyle = "inp";
const calcStyle = "calc";
const currStyle = "curr";
const pctStyle = "pcts";
const boldStyle = "bld";
const redStyle = "red";
const greenStyle = "grn";

function buildWorkbookData() {
  return {
    id: "pleochrome-model",
    name: "PleoChrome Financial Model",
    sheetOrder: ["assumptions", "deal", "pnl", "sources", "timeline"],
    styles: {
      [headerStyle]: { bl: 1, fs: 11, bg: { rgb: `#${navy}` }, cl: { rgb: "#FFFFFF" }, ht: 2 },
      [sectionStyle]: { bl: 1, fs: 10, bg: { rgb: "#E0E0E0" }, cl: { rgb: `#${navy}` } },
      [inputStyle]: { bg: { rgb: "#FFF9C4" }, cl: { rgb: "#1565C0" }, bl: 1 },
      [calcStyle]: { bg: { rgb: "#E3F2FD" } },
      [currStyle]: { n: { pattern: "$#,##0" } },
      [pctStyle]: { n: { pattern: "0.00%" } },
      [boldStyle]: { bl: 1, fs: 10 },
      [redStyle]: { cl: { rgb: "#A61D3A" }, bl: 1 },
      [greenStyle]: { cl: { rgb: "#1B6B4A" }, bl: 1 },
    },
    sheets: {
      assumptions: {
        id: "assumptions",
        name: "Assumptions",
        tabColor: "#1A8B7A",
        rowCount: 25,
        columnCount: 4,
        defaultColumnWidth: 120,
        defaultRowHeight: 26,
        columnData: { 0: { w: 230 }, 1: { w: 160 }, 2: { w: 60 }, 3: { w: 340 } },
        freeze: { xSplit: 0, ySplit: 1, startRow: 1, startColumn: 0 },
        cellData: {
          0: { 0: { v: "Parameter", s: headerStyle }, 1: { v: "Value", s: headerStyle }, 2: { v: "Unit", s: headerStyle }, 3: { v: "Source / Justification", s: headerStyle } },
          1: { 0: { v: "ASSET DETAILS", s: sectionStyle }, 1: { s: sectionStyle }, 2: { s: sectionStyle }, 3: { s: sectionStyle } },
          2: { 0: { v: "Stone Type" }, 1: { v: "Burmese Ruby", s: inputStyle }, 3: { v: "Pigeon's blood, Mogok origin" } },
          3: { 0: { v: "Carat Weight" }, 1: { v: 55, s: inputStyle }, 2: { v: "ct" }, 3: { v: "Comparable: Estrela de Fura (55.22ct, $34.8M)" } },
          4: { 0: { v: "Treatment" }, 1: { v: "No Heat", s: inputStyle }, 3: { v: "Unheated commands 2-5x premium" } },
          5: { 0: { v: "Claimed Asset Value" }, 1: { v: 55000000, s: "inp_curr" }, 2: { v: "$" }, 3: { v: "Enter the stone owner's claimed value" } },
          6: { 0: { v: "Appraisal Discount" }, 1: { v: 0.127, s: "inp_pct" }, 2: { v: "%" }, 3: { v: "3-Appraisal Rule: avg of 2 lowest" } },
          7: { 0: { v: "Offering Value" }, 1: { f: "=B6*(1-B7)", s: "calc_curr" }, 2: { v: "$" }, 3: { v: "Auto: Claimed x (1 - Discount)" } },
          8: { 0: { v: "Token Price" }, 1: { v: 100000, s: "inp_curr" }, 2: { v: "$" }, 3: { v: "Min investment per token" } },
          9: { 0: { v: "Total Tokens" }, 1: { f: "=INT(B8/B9)", s: calcStyle }, 2: { v: "#" }, 3: { v: "Auto: Offering Value / Token Price" } },
          10: {},
          11: { 0: { v: "FEE STRUCTURE", s: sectionStyle }, 1: { s: sectionStyle }, 2: { s: sectionStyle }, 3: { s: sectionStyle } },
          12: { 0: { v: "Setup Fee Rate" }, 1: { v: 0.02, s: "inp_pct" }, 2: { v: "%" }, 3: { v: "1-3%. Collected at engagement." } },
          13: { 0: { v: "Success Fee Rate" }, 1: { v: 0.015, s: "inp_pct" }, 2: { v: "%" }, 3: { v: "0.5-3%. Collected at close." } },
          14: { 0: { v: "Annual Admin Fee Rate" }, 1: { v: 0.0075, s: "inp_pct" }, 2: { v: "%" }, 3: { v: "0.5-1.0%. Recurring Year 2+." } },
          15: { 0: { v: "BD Placement Rate" }, 1: { v: 0.07, s: "inp_pct" }, 2: { v: "%" }, 3: { v: "5-7%. 0% if direct placement." } },
          16: {},
          17: { 0: { v: "CALCULATED FEES", s: sectionStyle }, 1: { s: sectionStyle }, 2: { s: sectionStyle }, 3: { s: sectionStyle } },
          18: { 0: { v: "Setup Fee ($)" }, 1: { f: "=B6*B13", s: "calc_curr" }, 2: { v: "$" }, 3: { v: "Asset Value x Setup Rate" } },
          19: { 0: { v: "Success Fee ($)" }, 1: { f: "=B8*B14", s: "calc_curr" }, 2: { v: "$" }, 3: { v: "Offering Value x Success Rate" } },
          20: { 0: { v: "Annual Admin Fee ($)" }, 1: { f: "=B8*B15", s: "calc_curr" }, 2: { v: "$" }, 3: { v: "Offering Value x Admin Rate" } },
          21: { 0: { v: "BD Placement Fee ($)" }, 1: { f: "=B8*B16", s: "calc_curr" }, 2: { v: "$" }, 3: { v: "Offering Value x BD Rate" } },
        },
      },
      deal: {
        id: "deal",
        name: "Deal Model",
        tabColor: "#1B6B4A",
        rowCount: 45,
        columnCount: 6,
        defaultColumnWidth: 110,
        defaultRowHeight: 26,
        columnData: { 0: { w: 210 }, 1: { w: 110 }, 2: { w: 110 }, 3: { w: 110 }, 4: { w: 100 }, 5: { w: 240 } },
        freeze: { xSplit: 0, ySplit: 1, startRow: 1, startColumn: 0 },
        cellData: {
          0: { 0: { v: "Line Item", s: headerStyle }, 1: { v: "Default ($)", s: headerStyle }, 2: { v: "Override ($)", s: headerStyle }, 3: { v: "Actual ($)", s: headerStyle }, 4: { v: "Paid By", s: headerStyle }, 5: { v: "Source / Timing", s: headerStyle } },
          1: { 0: { v: "PHASE 1: ACQUISITION", s: sectionStyle }, 1: { s: sectionStyle }, 2: { s: sectionStyle }, 3: { s: sectionStyle }, 4: { s: sectionStyle }, 5: { s: sectionStyle } },
          2: { 0: { v: "KYC / KYB" }, 1: { v: 50, s: currStyle }, 2: { s: inputStyle }, 3: { f: '=IF(C3="",B3,C3)', s: "calc_curr" }, 4: { v: "PleoChrome" }, 5: { v: "Day 1-3" } },
          3: { 0: { v: "Sanctions Screening" }, 1: { v: 100, s: currStyle }, 2: { s: inputStyle }, 3: { f: '=IF(C4="",B4,C4)', s: "calc_curr" }, 4: { v: "PleoChrome" }, 5: { v: "Day 1-3" } },
          4: { 0: { v: "Provenance Research" }, 1: { v: 2500, s: currStyle }, 2: { s: inputStyle }, 3: { f: '=IF(C5="",B5,C5)', s: "calc_curr" }, 4: { v: "Asset Holder" }, 5: { v: "Day 3-10" } },
          5: { 0: { v: "Intake Agreement" }, 1: { v: 2500, s: currStyle }, 2: { s: inputStyle }, 3: { f: '=IF(C6="",B6,C6)', s: "calc_curr" }, 4: { v: "PleoChrome" }, 5: { v: "Day 5-14" } },
          6: {},
          7: { 0: { v: "PHASE 2: PREPARATION", s: sectionStyle }, 1: { s: sectionStyle }, 2: { s: sectionStyle }, 3: { s: sectionStyle }, 4: { s: sectionStyle }, 5: { s: sectionStyle } },
          8: { 0: { v: "GIA Report" }, 1: { v: 0, s: currStyle }, 2: { s: inputStyle }, 3: { f: '=IF(C9="",B9,C9)', s: "calc_curr" }, 4: { v: "Asset Holder" }, 5: { v: "Day 14-35" } },
          9: { 0: { v: "SSEF Origin Report" }, 1: { v: 0, s: currStyle }, 2: { s: inputStyle }, 3: { f: '=IF(C10="",B10,C10)', s: "calc_curr" }, 4: { v: "Asset Holder" }, 5: { v: "Day 14-35" } },
          10: { 0: { v: "Gubelin Report" }, 1: { v: 0, s: currStyle }, 2: { s: inputStyle }, 3: { f: '=IF(C11="",B11,C11)', s: "calc_curr" }, 4: { v: "Asset Holder" }, 5: { v: "Day 14-35" } },
          11: { 0: { v: "Appraisal #1" }, 1: { v: 7500, s: currStyle }, 2: { s: inputStyle }, 3: { f: '=IF(C12="",B12,C12)', s: "calc_curr" }, 4: { v: "Asset Holder" }, 5: { v: "Day 28-38" } },
          12: { 0: { v: "Appraisal #2" }, 1: { v: 7500, s: currStyle }, 2: { s: inputStyle }, 3: { f: '=IF(C13="",B13,C13)', s: "calc_curr" }, 4: { v: "Asset Holder" }, 5: { v: "Day 38-48" } },
          13: { 0: { v: "Appraisal #3" }, 1: { v: 7500, s: currStyle }, 2: { s: inputStyle }, 3: { f: '=IF(C14="",B14,C14)', s: "calc_curr" }, 4: { v: "Asset Holder" }, 5: { v: "Day 48-56" } },
          14: { 0: { v: "Transit Insurance" }, 1: { v: 10000, s: currStyle }, 2: { s: inputStyle }, 3: { f: '=IF(C15="",B15,C15)', s: "calc_curr" }, 4: { v: "Asset Holder" }, 5: { v: "Days 28-65" } },
          15: { 0: { v: "Vault Custody (Yr 1)" }, 1: { v: 55000, s: currStyle }, 2: { s: inputStyle }, 3: { f: '=IF(C16="",B16,C16)', s: "calc_curr" }, 4: { v: "Asset Holder" }, 5: { v: "Day 56+" } },
          16: { 0: { v: "Specie Insurance (Yr 1)" }, 1: { v: 55000, s: currStyle }, 2: { s: inputStyle }, 3: { f: '=IF(C17="",B17,C17)', s: "calc_curr" }, 4: { v: "Asset Holder" }, 5: { v: "Day 56+" } },
          17: { 0: { v: "Chainlink Integration" }, 1: { v: 2500, s: currStyle }, 2: { s: inputStyle }, 3: { f: '=IF(C18="",B18,C18)', s: "calc_curr" }, 4: { v: "PleoChrome" }, 5: { v: "Day 42-70" } },
          18: { 0: { v: "Chainlink LINK Fees" }, 1: { v: 1200, s: currStyle }, 2: { s: inputStyle }, 3: { f: '=IF(C19="",B19,C19)', s: "calc_curr" }, 4: { v: "PleoChrome" }, 5: { v: "Day 70+" } },
          19: { 0: { v: "SPV Formation" }, 1: { v: 750, s: currStyle }, 2: { s: inputStyle }, 3: { f: '=IF(C20="",B20,C20)', s: "calc_curr" }, 4: { v: "PleoChrome" }, 5: { v: "Day 30-45" } },
          20: { 0: { v: "PPM Drafting" }, 1: { v: 10000, s: currStyle }, 2: { s: inputStyle }, 3: { f: '=IF(C21="",B21,C21)', s: "calc_curr" }, 4: { v: "PleoChrome" }, 5: { v: "Day 35-70" } },
          21: { 0: { v: "Subscription Agreement" }, 1: { v: 2000, s: currStyle }, 2: { s: inputStyle }, 3: { f: '=IF(C22="",B22,C22)', s: "calc_curr" }, 4: { v: "PleoChrome" }, 5: { v: "Day 50-70" } },
          22: { 0: { v: "Token Purchase Agreement" }, 1: { v: 2500, s: currStyle }, 2: { s: inputStyle }, 3: { f: '=IF(C23="",B23,C23)', s: "calc_curr" }, 4: { v: "PleoChrome" }, 5: { v: "Day 50-70" } },
          23: { 0: { v: "Photo & Media" }, 1: { v: 2000, s: currStyle }, 2: { s: inputStyle }, 3: { f: '=IF(C24="",B24,C24)', s: "calc_curr" }, 4: { v: "Asset Holder" }, 5: { v: "Day 56-65" } },
          24: {},
          25: { 0: { v: "PHASE 3: TOKENIZATION", s: sectionStyle }, 1: { s: sectionStyle }, 2: { s: sectionStyle }, 3: { s: sectionStyle }, 4: { s: sectionStyle }, 5: { s: sectionStyle } },
          26: { 0: { v: "Brickken Platform" }, 1: { v: 5500, s: currStyle }, 2: { s: inputStyle }, 3: { f: '=IF(C27="",B27,C27)', s: "calc_curr" }, 4: { v: "PleoChrome" }, 5: { v: "Day 63" } },
          27: { 0: { v: "Configuration Review" }, 1: { v: 3500, s: currStyle }, 2: { s: inputStyle }, 3: { f: '=IF(C28="",B28,C28)', s: "calc_curr" }, 4: { v: "PleoChrome" }, 5: { v: "Day 63-75" } },
          28: { 0: { v: "Development & Testing" }, 1: { v: 5000, s: currStyle }, 2: { s: inputStyle }, 3: { f: '=IF(C29="",B29,C29)', s: "calc_curr" }, 4: { v: "PleoChrome" }, 5: { v: "Day 65-80" } },
          29: { 0: { v: "Blockchain Gas Fees" }, 1: { v: 100, s: currStyle }, 2: { s: inputStyle }, 3: { f: '=IF(C30="",B30,C30)', s: "calc_curr" }, 4: { v: "PleoChrome" }, 5: { v: "Day 80" } },
          30: { 0: { v: "Blue Sky Filings" }, 1: { v: 1500, s: currStyle }, 2: { s: inputStyle }, 3: { f: '=IF(C31="",B31,C31)', s: "calc_curr" }, 4: { v: "PleoChrome" }, 5: { v: "Day 80-84" } },
          31: {},
          32: { 0: { v: "PHASE 4: DISTRIBUTION", s: sectionStyle }, 1: { s: sectionStyle }, 2: { s: sectionStyle }, 3: { s: sectionStyle }, 4: { s: sectionStyle }, 5: { s: sectionStyle } },
          33: { 0: { v: "Marketing" }, 1: { v: 3000, s: currStyle }, 2: { s: inputStyle }, 3: { f: '=IF(C34="",B34,C34)', s: "calc_curr" }, 4: { v: "PleoChrome" }, 5: { v: "Day 84-120" } },
          34: { 0: { v: "Investor KYC" }, 1: { v: 0, s: currStyle }, 2: { s: inputStyle }, 3: { f: '=IF(C35="",B35,C35)', s: "calc_curr" }, 4: { v: "PleoChrome" }, 5: { v: "Day 90-120" } },
          35: { 0: { v: "Compliance Monitoring" }, 1: { v: 500, s: currStyle }, 2: { s: inputStyle }, 3: { f: '=IF(C36="",B36,C36)', s: "calc_curr" }, 4: { v: "PleoChrome" }, 5: { v: "Day 120+" } },
          36: { 0: { v: "Annual AML Audit" }, 1: { v: 3500, s: currStyle }, 2: { s: inputStyle }, 3: { f: '=IF(C37="",B37,C37)', s: "calc_curr" }, 4: { v: "PleoChrome" }, 5: { v: "Month 12" } },
          37: {},
          38: { 0: { v: "TOTALS", s: sectionStyle }, 1: { s: sectionStyle }, 2: { s: sectionStyle }, 3: { s: sectionStyle }, 4: { s: sectionStyle }, 5: { s: sectionStyle } },
          39: { 0: { v: "PleoChrome Costs", s: boldStyle }, 3: { f: "=D3+D4+D6+D18+D19+D20+D21+D22+D23+D27+D28+D29+D30+D31+D34+D35+D36+D37", s: "calc_curr" } },
          40: { 0: { v: "Asset Holder Costs", s: boldStyle }, 3: { f: "=D5+D9+D10+D11+D12+D13+D14+D15+D16+D17+D24", s: "calc_curr" } },
          41: { 0: { v: "BD Placement Fee", s: boldStyle }, 3: { f: "=Assumptions!B22", s: "calc_curr" } },
          42: { 0: { v: "TOTAL ALL COSTS", s: boldStyle }, 3: { f: "=D40+D41+D42", s: "calc_curr" } },
        },
      },
      pnl: {
        id: "pnl",
        name: "P&L",
        tabColor: "#1E3A6E",
        rowCount: 28,
        columnCount: 7,
        defaultColumnWidth: 110,
        defaultRowHeight: 26,
        columnData: { 0: { w: 200 }, 6: { w: 130 } },
        freeze: { xSplit: 1, ySplit: 1, startRow: 1, startColumn: 1 },
        cellData: {
          0: { 0: { v: "", s: headerStyle }, 1: { v: "Year 1", s: headerStyle }, 2: { v: "Year 2", s: headerStyle }, 3: { v: "Year 3", s: headerStyle }, 4: { v: "Year 4", s: headerStyle }, 5: { v: "Year 5", s: headerStyle }, 6: { v: "5-Year Total", s: headerStyle } },
          1: { 0: { v: "Setup Fee" }, 1: { f: "=Assumptions!B19", s: currStyle }, 2: { v: 0, s: currStyle }, 3: { v: 0, s: currStyle }, 4: { v: 0, s: currStyle }, 5: { v: 0, s: currStyle }, 6: { f: "=SUM(B2:F2)", s: currStyle } },
          2: { 0: { v: "Success Fee" }, 1: { f: "=Assumptions!B20", s: currStyle }, 2: { v: 0, s: currStyle }, 3: { v: 0, s: currStyle }, 4: { v: 0, s: currStyle }, 5: { v: 0, s: currStyle }, 6: { f: "=SUM(B3:F3)", s: currStyle } },
          3: { 0: { v: "Transfer Fees (est.)" }, 1: { v: 12000, s: currStyle }, 2: { v: 24000, s: currStyle }, 3: { v: 24000, s: currStyle }, 4: { v: 24000, s: currStyle }, 5: { v: 24000, s: currStyle }, 6: { f: "=SUM(B4:F4)", s: currStyle } },
          4: { 0: { v: "Annual Admin Fee" }, 1: { v: 0, s: currStyle }, 2: { f: "=Assumptions!B21", s: currStyle }, 3: { f: "=Assumptions!B21", s: currStyle }, 4: { f: "=Assumptions!B21", s: currStyle }, 5: { f: "=Assumptions!B21", s: currStyle }, 6: { f: "=SUM(B5:F5)", s: currStyle } },
          5: { 0: { v: "Valuation Refresh" }, 1: { v: 0, s: currStyle }, 2: { v: 25000, s: currStyle }, 3: { v: 25000, s: currStyle }, 4: { v: 25000, s: currStyle }, 5: { v: 25000, s: currStyle }, 6: { f: "=SUM(B6:F6)", s: currStyle } },
          6: { 0: { v: "TOTAL REVENUE", s: boldStyle }, 1: { f: "=SUM(B2:B6)", s: greenStyle }, 2: { f: "=SUM(C2:C6)", s: greenStyle }, 3: { f: "=SUM(D2:D6)", s: greenStyle }, 4: { f: "=SUM(E2:E6)", s: greenStyle }, 5: { f: "=SUM(F2:F6)", s: greenStyle }, 6: { f: "=SUM(G2:G6)", s: greenStyle } },
          7: {},
          8: { 0: { v: "PleoChrome Costs" }, 1: { f: "='Deal Model'!D40", s: currStyle }, 2: { v: 0, s: currStyle }, 3: { v: 0, s: currStyle }, 4: { v: 0, s: currStyle }, 5: { v: 0, s: currStyle }, 6: { f: "=SUM(B9:F9)", s: currStyle } },
          9: { 0: { v: "Annual Ongoing" }, 1: { v: 0, s: currStyle }, 2: { v: 15000, s: currStyle }, 3: { v: 15000, s: currStyle }, 4: { v: 15000, s: currStyle }, 5: { v: 15000, s: currStyle }, 6: { f: "=SUM(B10:F10)", s: currStyle } },
          10: { 0: { v: "TOTAL COSTS", s: boldStyle }, 1: { f: "=B9+B10", s: redStyle }, 2: { f: "=C9+C10", s: redStyle }, 3: { f: "=D9+D10", s: redStyle }, 4: { f: "=E9+E10", s: redStyle }, 5: { f: "=F9+F10", s: redStyle }, 6: { f: "=G9+G10", s: redStyle } },
          11: {},
          12: { 0: { v: "NET INCOME", s: boldStyle }, 1: { f: "=B7-B11", s: greenStyle }, 2: { f: "=C7-C11", s: greenStyle }, 3: { f: "=D7-D11", s: greenStyle }, 4: { f: "=E7-E11", s: greenStyle }, 5: { f: "=F7-F11", s: greenStyle }, 6: { f: "=G7-G11", s: greenStyle } },
          13: { 0: { v: "NET MARGIN" }, 1: { f: "=IF(B7=0,0,B13/B7)", s: pctStyle }, 2: { f: "=IF(C7=0,0,C13/C7)", s: pctStyle }, 3: { f: "=IF(D7=0,0,D13/D7)", s: pctStyle }, 4: { f: "=IF(E7=0,0,E13/E7)", s: pctStyle }, 5: { f: "=IF(F7=0,0,F13/F7)", s: pctStyle }, 6: { f: "=IF(G7=0,0,G13/G7)", s: pctStyle } },
          14: {},
          15: { 0: { v: "ASSET HOLDER ECONOMICS", s: sectionStyle }, 1: { s: sectionStyle }, 2: { s: sectionStyle }, 3: { s: sectionStyle }, 4: { s: sectionStyle }, 5: { s: sectionStyle }, 6: { s: sectionStyle } },
          16: { 0: { v: "Claimed Value" }, 1: { f: "=Assumptions!B6", s: currStyle } },
          17: { 0: { v: "Offering Value" }, 1: { f: "=Assumptions!B8", s: currStyle } },
          18: { 0: { v: "Less: BD Placement" }, 1: { f: "=-Assumptions!B22", s: redStyle } },
          19: { 0: { v: "Less: Setup Fee" }, 1: { f: "=-Assumptions!B19", s: redStyle } },
          20: { 0: { v: "Less: Success Fee" }, 1: { f: "=-Assumptions!B20", s: redStyle } },
          21: { 0: { v: "Less: Pass-Through" }, 1: { f: "=-'Deal Model'!D41", s: redStyle } },
          22: { 0: { v: "NET TO HOLDER", s: boldStyle }, 1: { f: "=SUM(B17:B22)", s: greenStyle } },
          23: { 0: { v: "% of Claimed Value" }, 1: { f: "=IF(B17=0,0,B23/B17)", s: pctStyle } },
        },
      },
      sources: {
        id: "sources",
        name: "Pricing Sources",
        tabColor: "#C47A1A",
        rowCount: 25,
        columnCount: 5,
        defaultColumnWidth: 130,
        defaultRowHeight: 26,
        columnData: { 0: { w: 230 }, 4: { w: 250 } },
        freeze: { xSplit: 0, ySplit: 1, startRow: 1, startColumn: 0 },
        cellData: {
          0: { 0: { v: "Cost Category", s: headerStyle }, 1: { v: "Rate / Amount", s: headerStyle }, 2: { v: "Basis", s: headerStyle }, 3: { v: "Verified", s: headerStyle }, 4: { v: "Source", s: headerStyle } },
          1: { 0: { v: "GIA Report (50+ ct)" }, 1: { v: "$300-$500" }, 2: { v: "Per report" }, 3: { v: "Mar 2026" }, 4: { v: "gia.edu" } },
          2: { 0: { v: "SSEF Origin (50-100ct)" }, 1: { v: "CHF 4,000" }, 2: { v: "Per report" }, 3: { v: "Mar 2026" }, 4: { v: "ssef.ch" } },
          3: { 0: { v: "USPAP Appraisal" }, 1: { v: "$150-$250/hr" }, 2: { v: "Hourly" }, 3: { v: "Mar 2026" }, 4: { v: "americangemsociety.org" } },
          4: { 0: { v: "Vault (Brink's)" }, 1: { v: "0.10-0.15%" }, 2: { v: "Annual" }, 3: { v: "Mar 2026" }, 4: { v: "us.brinks.com" } },
          5: { 0: { v: "Specie Insurance" }, 1: { v: "0.10-0.15%" }, 2: { v: "Annual" }, 3: { v: "Mar 2026" }, 4: { v: "AXA XL / Lloyd's" } },
          6: { 0: { v: "Brickken Advanced" }, 1: { v: "EUR 5,000/yr" }, 2: { v: "Annual" }, 3: { v: "Mar 2026" }, 4: { v: "brickken.com/plans" } },
          7: { 0: { v: "Chainlink BUILD" }, 1: { v: "$0 cash" }, 2: { v: "Token commit" }, 3: { v: "Mar 2026" }, 4: { v: "chain.link/build-program" } },
          8: { 0: { v: "Config Review" }, 1: { v: "$2.5K-$5K" }, 2: { v: "Per review" }, 3: { v: "Mar 2026" }, 4: { v: "softstack.io" } },
          9: { 0: { v: "Attorney (boutique)" }, 1: { v: "$7.5K-$12K" }, 2: { v: "Flat fee" }, 3: { v: "Mar 2026" }, 4: { v: "contractscounsel.com" } },
          10: { 0: { v: "Wyoming LLC" }, 1: { v: "$100" }, 2: { v: "One-time" }, 3: { v: "Mar 2026" }, 4: { v: "sos.wyo.gov" } },
          11: { 0: { v: "Form D (SEC)" }, 1: { v: "$0" }, 2: { v: "No fee" }, 3: { v: "Mar 2026" }, 4: { v: "sec.gov" } },
          12: { 0: { v: "Blue Sky (avg)" }, 1: { v: "$100-$500" }, 2: { v: "Per state" }, 3: { v: "Mar 2026" }, 4: { v: "blueskycomply.com" } },
          13: { 0: { v: "KYC (Veriff)" }, 1: { v: "$0.80/check" }, 2: { v: "Per check" }, 3: { v: "Mar 2026" }, 4: { v: "veriff.com" } },
          14: { 0: { v: "BD Placement" }, 1: { v: "5-7%" }, 2: { v: "Of raised" }, 3: { v: "Mar 2026" }, 4: { v: "FINRA" } },
          15: { 0: { v: "AML Audit" }, 1: { v: "$3K-$5K" }, 2: { v: "Annual" }, 3: { v: "Mar 2026" }, 4: { v: "BSA/AML" } },
        },
      },
      timeline: {
        id: "timeline",
        name: "Timeline",
        tabColor: "#5B2D8E",
        rowCount: 26,
        columnCount: 7,
        defaultColumnWidth: 100,
        defaultRowHeight: 26,
        columnData: { 0: { w: 210 }, 5: { w: 130 } },
        freeze: { xSplit: 0, ySplit: 1, startRow: 1, startColumn: 0 },
        cellData: {
          0: { 0: { v: "Event", s: headerStyle }, 1: { v: "Day Start", s: headerStyle }, 2: { v: "Day End", s: headerStyle }, 3: { v: "Cost Out ($)", s: headerStyle }, 4: { v: "Revenue In ($)", s: headerStyle }, 5: { v: "Running Balance", s: headerStyle }, 6: { v: "Phase", s: headerStyle } },
          1: { 0: { v: "Setup fee collected" }, 1: { v: 1 }, 2: { v: 1 }, 3: { v: 0, s: currStyle }, 4: { f: "=Assumptions!B19", s: currStyle }, 5: { f: "=E2-D2", s: currStyle }, 6: { v: "Acquisition" } },
          2: { 0: { v: "KYC + Sanctions" }, 1: { v: 1 }, 2: { v: 3 }, 3: { v: 150, s: currStyle }, 4: { v: 0, s: currStyle }, 5: { f: "=F2+E3-D3", s: currStyle }, 6: { v: "Acquisition" } },
          3: { 0: { v: "Intake agreement" }, 1: { v: 5 }, 2: { v: 14 }, 3: { v: 2500, s: currStyle }, 4: { v: 0, s: currStyle }, 5: { f: "=F3+E4-D4", s: currStyle }, 6: { v: "Acquisition" } },
          4: { 0: { v: "SPV formation" }, 1: { v: 30 }, 2: { v: 45 }, 3: { v: 750, s: currStyle }, 4: { v: 0, s: currStyle }, 5: { f: "=F4+E5-D5", s: currStyle }, 6: { v: "Preparation" } },
          5: { 0: { v: "PPM drafting" }, 1: { v: 35 }, 2: { v: 70 }, 3: { v: 10000, s: currStyle }, 4: { v: 0, s: currStyle }, 5: { f: "=F5+E6-D6", s: currStyle }, 6: { v: "Preparation" } },
          6: { 0: { v: "Legal agreements" }, 1: { v: 50 }, 2: { v: 70 }, 3: { v: 4500, s: currStyle }, 4: { v: 0, s: currStyle }, 5: { f: "=F6+E7-D7", s: currStyle }, 6: { v: "Preparation" } },
          7: { 0: { v: "Chainlink PoR" }, 1: { v: 42 }, 2: { v: 70 }, 3: { v: 2500, s: currStyle }, 4: { v: 0, s: currStyle }, 5: { f: "=F7+E8-D8", s: currStyle }, 6: { v: "Preparation" } },
          8: { 0: { v: "Brickken setup" }, 1: { v: 63 }, 2: { v: 63 }, 3: { v: 5500, s: currStyle }, 4: { v: 0, s: currStyle }, 5: { f: "=F8+E9-D9", s: currStyle }, 6: { v: "Tokenization" } },
          9: { 0: { v: "Config review" }, 1: { v: 63 }, 2: { v: 75 }, 3: { v: 3500, s: currStyle }, 4: { v: 0, s: currStyle }, 5: { f: "=F9+E10-D10", s: currStyle }, 6: { v: "Tokenization" } },
          10: { 0: { v: "Dev + testing" }, 1: { v: 65 }, 2: { v: 80 }, 3: { v: 5000, s: currStyle }, 4: { v: 0, s: currStyle }, 5: { f: "=F10+E11-D11", s: currStyle }, 6: { v: "Tokenization" } },
          11: { 0: { v: "Mainnet + gas" }, 1: { v: 80 }, 2: { v: 80 }, 3: { v: 100, s: currStyle }, 4: { v: 0, s: currStyle }, 5: { f: "=F11+E12-D12", s: currStyle }, 6: { v: "Tokenization" } },
          12: { 0: { v: "Blue sky filings" }, 1: { v: 80 }, 2: { v: 84 }, 3: { v: 1500, s: currStyle }, 4: { v: 0, s: currStyle }, 5: { f: "=F12+E13-D13", s: currStyle }, 6: { v: "Tokenization" } },
          13: { 0: { v: "Marketing begins" }, 1: { v: 84 }, 2: { v: 120 }, 3: { v: 3000, s: currStyle }, 4: { v: 0, s: currStyle }, 5: { f: "=F13+E14-D14", s: currStyle }, 6: { v: "Distribution" } },
          14: { 0: { v: "Sale closes + fee" }, 1: { v: 120 }, 2: { v: 120 }, 3: { v: 500, s: currStyle }, 4: { f: "=Assumptions!B20", s: currStyle }, 5: { f: "=F14+E15-D15", s: currStyle }, 6: { v: "Distribution" } },
        },
      },
    },
  };
}

export default function UniverSheet({ dark }: { dark: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const univerRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const init = async () => {
      const { UniverSheetsCorePreset } = await import("@univerjs/preset-sheets-core");
      const { default: enUS } = await import("@univerjs/preset-sheets-core/locales/en-US");
      const { createUniver, LocaleType, mergeLocales } = await import("@univerjs/presets");

      if (!containerRef.current) return;

      const { univer, univerAPI } = createUniver({
        locale: LocaleType.EN_US,
        locales: { [LocaleType.EN_US]: mergeLocales(enUS) },
        presets: [
          UniverSheetsCorePreset({
            container: containerRef.current,
          }),
        ],
      });

      univerAPI.createWorkbook(buildWorkbookData());
      univerRef.current = univer;
    };

    init();

    return () => {
      univerRef.current?.dispose();
    };
  }, []);

  return (
    <div>
      <div
        ref={containerRef}
        className={`rounded-xl overflow-hidden border ${dark ? "border-white/[0.08]" : "border-gray-200"}`}
        style={{ height: "calc(100vh - 120px)", width: "100%" }}
      />
      <div className="flex flex-wrap gap-3 mt-2">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-3 rounded bg-[#FFF9C4] border border-gray-300" />
          <span className={`text-[9px] ${dark ? "text-white/30" : "text-gray-400"}`}>Editable input</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-3 rounded bg-[#E3F2FD] border border-gray-300" />
          <span className={`text-[9px] ${dark ? "text-white/30" : "text-gray-400"}`}>Auto-calculated</span>
        </div>
        <span className={`text-[9px] ${dark ? "text-white/20" : "text-gray-300"}`}>
          Full toolbar: bold, italic, colors, number formats, borders, merge, alignment. Cross-sheet formulas auto-calculate.
        </span>
      </div>
    </div>
  );
}
