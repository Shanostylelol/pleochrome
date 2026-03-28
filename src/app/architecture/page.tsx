"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { SHARED_STATES, getPathStates, BRANCH_LABEL, type ValuePath, VALUE_PATHS } from "@/lib/portal-data";
import { PathSelector } from "@/components/portal/PathSelector";

const PASSCODE = "pleo123";

/* ═══════════════════════════════════════════════════════
   PleoChrome — Governance Engine Architecture
   Internal system visualization
   /architecture
   ═══════════════════════════════════════════════════════ */

// ── Data ──────────────────────────────────────

// assetStates is now derived from the shared data layer (see state machine section below)

const exceptionStates = [
  { id: "HOLD", label: "HOLD", color: "#A61D3A", desc: "Workflow frozen. A discrepancy, gap, or anomaly has been detected. Requires manual resolution by Compliance + Founder." },
  { id: "REJECTED", label: "REJECTED", color: "#6B7280", desc: "Asset failed a gate and cannot proceed. Reasons documented. Stone returned to owner." },
  { id: "EXCEPTION", label: "EXCEPTION", color: "#C47A1A", desc: "Requires manual review. Examples: appraisal variance >15%, partial sanctions match, insurance gap detected." },
];

const roles = [
  { id: "founder", label: "Founder", who: "Shane", color: "#1B6B4A", permissions: ["Approve mint (1 of 3)", "Override HOLD states", "Manage user roles", "View all data", "Set offering value (with Ops)"], cannot: ["Bypass multi-sig", "Delete audit logs", "Approve own KYC clearance"] },
  { id: "ops", label: "Operations Lead", who: "Chris / David", color: "#1A8B7A", permissions: ["Input candidate stones", "Upload documents", "Advance states (with evidence)", "Assign appraisers", "Manage vault logistics", "Approve mint (1 of 3)"], cannot: ["Modify completed states", "Delete audit logs", "Bypass multi-sig", "Approve own submissions"] },
  { id: "compliance", label: "Compliance Officer", who: "TBD (Required)", color: "#5B2D8E", permissions: ["Approve KYC clearance", "Sign off on legal documents", "View all audit trails", "File SARs", "Manage sanctions screening", "Override HOLD (with Founder)"], cannot: ["Advance operational states", "Approve mint alone", "Modify financial terms"] },
  { id: "legal", label: "Legal Counsel", who: "External Attorney", color: "#1E3A6E", permissions: ["Upload legal documents", "Provide compliance sign-off", "Approve mint (1 of 3)", "View offering documents"], cannot: ["Advance operational states", "Access investor PII", "Modify non-legal documents"] },
  { id: "tech", label: "Tech Lead", who: "David / Contractor", color: "#C47A1A", permissions: ["Deploy smart contracts", "Configure Chainlink PoR", "Manage API integrations", "Monitor system health"], cannot: ["Approve mint without Ops + Founder", "Modify legal documents", "Access financial terms"] },
  { id: "readonly", label: "Read-Only", who: "Investors, Auditors", color: "#6B7280", permissions: ["View offering documents", "View PoR status", "View reports", "Download tax documents"], cannot: ["Modify anything", "View internal audit trails", "Access other investors' data"] },
];

const multiSigActions = [
  { action: "Mint Authorization", required: ["Legal", "Ops", "Founder"], min: "3 of 3", critical: true },
  { action: "Override HOLD State", required: ["Compliance", "Founder"], min: "2 of 2", critical: true },
  { action: "Change Offering Value", required: ["Ops", "Founder"], min: "2 of 2", critical: false },
  { action: "Add/Remove Appraiser", required: ["Ops", "Compliance"], min: "2 of 2", critical: false },
  { action: "Emergency Halt", required: ["Any Role"], min: "1 of 1", critical: true },
  { action: "Resume from Halt", required: ["Founder", "Compliance"], min: "2 of 2", critical: true },
];

const aiFeatures = [
  { name: "Document OCR + Extraction", trigger: "New document uploaded", action: "Extract key fields (weight, value, dates), compare to existing records. Flag mismatches.", icon: "file" },
  { name: "Appraiser Independence Check", trigger: "Appraisers assigned", action: "Cross-check addresses, employers, LinkedIn, prior work together. Flag any connections.", icon: "search" },
  { name: "Variance Anomaly Detection", trigger: "3 appraisals received", action: "Calculate variance. Flag >15%. Compare to market comparables. Generate variance report.", icon: "alert" },
  { name: "Insurance Gap Monitor", trigger: "Daily scan", action: "Verify all active assets have current, adequate coverage. Alert 30 days before expiry.", icon: "shield" },
  { name: "PoR Watchdog", trigger: "Every 6 hours", action: "Verify Chainlink feed is updating. Data matches expected format. Alert if stale >48hrs.", icon: "chain" },
  { name: "Sanctions Re-screening", trigger: "Quarterly", action: "Re-run all parties against updated OFAC/EU/UN lists. Flag new matches.", icon: "globe" },
  { name: "Reconciliation Engine", trigger: "Every state change", action: "Cross-check ALL document fields: weight, description, value across every source. Any mismatch = auto-HOLD.", icon: "check" },
  { name: "Compliance Calendar", trigger: "Daily", action: "Alert upcoming deadlines: Form D amendments, insurance renewals, annual audits, K-1 due dates.", icon: "calendar" },
  { name: "Loan Payment Monitoring", trigger: "Monthly", action: "Track payment schedule, flag late payments (30+ days), trigger default procedures.", icon: "dollar" },
];

const mvpPhases = [
  { phase: "Phase 1", weeks: "Weeks 1-3", title: "Foundation", items: ["Database schema + RLS policies", "Auth with roles (6 roles)", "Asset registry CRUD", "State machine logic (gate enforcement)", "Audit trail logging (append-only)"], color: "#1B6B4A" },
  { phase: "Phase 2", weeks: "Weeks 3-5", title: "Evidence Layer", items: ["Document upload + storage", "Document taxonomy per state", "Hash verification on upload", "Basic reconciliation (weight/desc matching)"], color: "#1A8B7A" },
  { phase: "Phase 3", weeks: "Weeks 5-7", title: "Workflow UI", items: ["Asset pipeline view (Kanban by state)", "Single-asset detail (timeline + docs + approvals)", "Multi-sig approval flow", "Alert dashboard"], color: "#1E3A6E" },
  { phase: "Phase 4", weeks: "Weeks 7-9", title: "Platform Integration", items: ["KYC webhook (Sumsub/Veriff)", "Vault status integration", "Value path APIs (Rialto full-stack | Brickken/Zoniqx tokenization | lending partners)", "Chainlink PoR monitoring"], color: "#5B2D8E" },
  { phase: "Phase 5", weeks: "Weeks 9-12", title: "AI + Polish", items: ["Document OCR/extraction (Claude API)", "Automated reconciliation engine", "Compliance calendar + alerts", "Insurance gap monitoring", "Investor onboarding flow"], color: "#C47A1A" },
];

// ── Password Gate ─────────────────────────────

function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [code, setCode] = useState("");
  const [err, setErr] = useState(false);
  const go = (e: React.FormEvent) => { e.preventDefault(); if (code === PASSCODE) onUnlock(); else { setErr(true); setTimeout(() => setErr(false), 1500); } };
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030712] px-4">
      <form onSubmit={go} className="text-center max-w-sm w-full">
        <Image src="/favicon.png" alt="" width={48} height={48} className="mx-auto mb-6 opacity-60" />
        <h1 className="font-[family-name:var(--font-cormorant)] text-2xl font-light text-white/80 mb-2">System Architecture</h1>
        <p className="text-xs tracking-[0.2em] uppercase text-white/30 mb-8">Enter passcode</p>
        <input type="password" value={code} onChange={e => setCode(e.target.value)} placeholder="Passcode" autoFocus
          className={`w-full bg-white/[0.04] border rounded-xl px-5 py-3.5 text-sm text-white/80 placeholder:text-white/20 outline-none ${err ? "border-[#A61D3A]" : "border-white/[0.08] focus:border-white/20"}`} />
        <button type="submit" className="mt-4 w-full bg-gradient-to-r from-[#1A8B7A] to-[#1E3A6E] text-white text-xs tracking-[0.2em] uppercase py-3.5 rounded-xl">Enter</button>
      </form>
    </div>
  );
}

// ── Main ──────────────────────────────────────

export default function ArchitecturePage() {
  const [unlocked, setUnlocked] = useState(false);
  const [dark, setDark] = useState(true);
  const [activeState, setActiveState] = useState<string | null>(null);
  const [activeRole, setActiveRole] = useState<string | null>(null);
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(["states"]));
  const [selectedPath, setSelectedPath] = useState<ValuePath>("tokenization");

  const pathStates = getPathStates(selectedPath);
  const assetStates = [...SHARED_STATES, ...pathStates];

  useState(() => {
    if (typeof window !== "undefined") {
      if (localStorage.getItem("pleo-auth") === "true") setUnlocked(true);
      const saved = localStorage.getItem("pleo-dark");
      if (saved !== null) setDark(saved === "true");
    }
  });

  const toggleSection = (s: string) => setOpenSections(prev => { const n = new Set(prev); n.has(s) ? n.delete(s) : n.add(s); return n; });

  if (!unlocked) return <PasswordGate onUnlock={() => setUnlocked(true)} />;

  const bg = dark ? "bg-[#030712]" : "bg-[#F8F9FA]";
  const tx = dark ? "text-[#FAFBFC]" : "text-[#1a1a1a]";
  const cd = dark ? "bg-[rgba(10,17,32,0.92)] border-white/[0.04]" : "bg-white border-gray-200 shadow-sm";
  const s1 = dark ? "text-white/25" : "text-gray-400";
  const s2 = dark ? "text-white/50" : "text-gray-600";
  const s3 = dark ? "text-white/70" : "text-gray-800";
  const dv = dark ? "border-white/[0.04]" : "border-gray-100";
  const hv = dark ? "hover:bg-white/[0.02]" : "hover:bg-gray-50";

  const sectionData = [
    { id: "states", title: "State Machine — The Gated Corridor", subtitle: `${SHARED_STATES.length} shared states + path-specific states + 3 exception states. No step can be skipped.`, color: "#1A8B7A" },
    { id: "rbac", title: "Role-Based Access Control", subtitle: "6 roles with granular permissions. Multi-signature for critical actions.", color: "#5B2D8E" },
    { id: "ai", title: "AI Automation Layer", subtitle: "9 AI-powered functions for redundancy, verification, and monitoring.", color: "#1E3A6E" },
    { id: "mvp", title: "MVP Build Phases", subtitle: "12-week roadmap from database to AI-powered governance.", color: "#C47A1A" },
  ];

  return (
    <div className={`min-h-screen ${bg} ${tx} transition-colors duration-300`}>
      <header className="text-center pt-6 pb-5 sm:pt-10 sm:pb-7 relative px-4">
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
        <h1 className="font-[family-name:var(--font-cormorant)] text-lg sm:text-2xl font-light tracking-wider">Governance Engine Architecture</h1>
        <p className={`mt-1 text-[10px] tracking-[0.25em] uppercase ${s1}`}>Internal Mission Control — Confidential</p>
        <div className="flex gap-[2px] justify-center mt-3">
          {["#1B6B4A","#1A8B7A","#1E3A6E","#5B2D8E","#A61D3A","#C47A1A","#7BA31E"].map(c => (
            <span key={c} className="h-[2px] w-4 rounded-sm" style={{ background: c }} />
          ))}
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-3 sm:px-5 pb-16">

        {/* Principle */}
        <div className={`${cd} border rounded-2xl p-4 sm:p-5 mb-5`}>
          <p className={`text-xs sm:text-sm ${s2} leading-relaxed`}>
            <strong className={s3}>&ldquo;Good software does not replace governance. It enforces governance.&rdquo;</strong><br /><br />
            This is PleoChrome&apos;s proprietary internal system — a strict state machine that enforces the 7-gate workflow
            across all three value creation paths (Fractional Securities, Tokenization, and Debt Instruments),
            catalogs every piece of evidence with permanent audit trails, connects to external partners via modular APIs,
            and uses AI for continuous verification. Partners can be swapped. This logic cannot.
          </p>
        </div>

        {/* Section Cards */}
        {sectionData.map(section => {
          const isOpen = openSections.has(section.id);
          return (
            <div key={section.id} className={`${cd} border rounded-2xl mb-3 overflow-hidden`}>
              <button onClick={() => toggleSection(section.id)} className={`w-full flex items-center gap-3 p-3.5 sm:p-4 text-left ${hv} transition-colors`}>
                <div className="w-2 h-8 rounded-full shrink-0" style={{ background: section.color }} />
                <div className="flex-1">
                  <p className={`text-xs sm:text-sm font-semibold ${s3}`}>{section.title}</p>
                  <p className={`text-[10px] ${s1}`}>{section.subtitle}</p>
                </div>
                <svg className={`w-4 h-4 ${s1} shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M6 9l6 6 6-6" /></svg>
              </button>

              <div className={`transition-all duration-500 overflow-hidden ${isOpen ? "max-h-[8000px] opacity-100" : "max-h-0 opacity-0"}`}>
                <div className={`border-t ${dv} p-3.5 sm:p-4`}>

                  {/* ── STATE MACHINE ──────────── */}
                  {section.id === "states" && (
                    <>
                      <p className={`text-[10px] sm:text-xs ${s2} leading-relaxed mb-4`}>
                        Every asset exists in exactly ONE state at any time. Transitions are programmatically blocked
                        until binary gate conditions are met. After LEGAL_COMPLETE, the pipeline branches based on the
                        chosen value creation path. Click any state to see details.
                      </p>

                      {/* Shared States Pipeline */}
                      <p className={`text-[10px] tracking-wider uppercase ${s1} mb-2 font-semibold`}>Shared Pipeline (All Paths)</p>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {SHARED_STATES.map(st => (
                          <button key={st.id} onClick={() => setActiveState(activeState === st.id ? null : st.id)}
                            className={`relative px-2.5 py-1.5 rounded-lg text-[9px] sm:text-[10px] font-medium transition-all border ${activeState === st.id
                              ? "text-white border-transparent scale-105"
                              : `${dark ? "border-white/[0.06] text-white/40 hover:text-white/60" : "border-gray-200 text-gray-500 hover:text-gray-700"}`}`}
                            style={activeState === st.id ? { background: st.color, borderColor: st.color } : {}}>
                            {st.gate && <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#A61D3A] text-white text-[7px] font-bold flex items-center justify-center">{st.gate}</span>}
                            {st.label}
                          </button>
                        ))}
                      </div>

                      {/* Branch Point Indicator */}
                      <div className={`relative my-5 flex items-center gap-3`}>
                        <div className={`flex-1 h-px ${dark ? "bg-white/[0.08]" : "bg-gray-200"}`} />
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${dark ? "border-white/[0.1] bg-white/[0.04]" : "border-gray-200 bg-gray-50"}`}>
                          <svg className={`w-3.5 h-3.5 ${dark ? "text-white/40" : "text-gray-400"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                            <path d="M6 3v12" /><path d="M18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" /><path d="M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" /><path d="M18 9c0 6-6 9-12 9" />
                          </svg>
                          <span className={`text-[9px] sm:text-[10px] tracking-[0.15em] uppercase font-semibold ${dark ? "text-white/50" : "text-gray-500"}`}>
                            {BRANCH_LABEL}
                          </span>
                        </div>
                        <div className={`flex-1 h-px ${dark ? "bg-white/[0.08]" : "bg-gray-200"}`} />
                      </div>

                      {/* Path Selector */}
                      <PathSelector
                        selected={selectedPath}
                        onChange={(p) => { setSelectedPath(p); setActiveState(null); }}
                        dark={dark}
                        className="mb-4"
                        layoutId="archPathPill"
                      />

                      {/* Path-Specific States */}
                      <p className={`text-[10px] tracking-wider uppercase ${s1} mb-2 font-semibold`}>
                        {VALUE_PATHS[selectedPath].label} States
                      </p>
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={selectedPath}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.25 }}
                          className="flex flex-wrap gap-1.5 mb-4"
                        >
                          {pathStates.map(st => {
                            const accentColor = VALUE_PATHS[selectedPath].color;
                            return (
                              <button key={st.id} onClick={() => setActiveState(activeState === st.id ? null : st.id)}
                                className={`relative px-2.5 py-1.5 rounded-lg text-[9px] sm:text-[10px] font-medium transition-all border ${activeState === st.id
                                  ? "text-white border-transparent scale-105"
                                  : `${dark ? "border-white/[0.06] text-white/40 hover:text-white/60" : "border-gray-200 text-gray-500 hover:text-gray-700"}`}`}
                                style={activeState === st.id ? { background: accentColor, borderColor: accentColor } : { borderColor: `${accentColor}30` }}>
                                {st.gate && <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#A61D3A] text-white text-[7px] font-bold flex items-center justify-center">{st.gate}</span>}
                                {st.label}
                              </button>
                            );
                          })}
                        </motion.div>
                      </AnimatePresence>

                      {/* Active state detail */}
                      {activeState && (() => {
                        const st = assetStates.find(s => s.id === activeState);
                        if (!st) return null;
                        return (
                          <div className={`${cd} border rounded-xl p-3 mb-4`}>
                            <div className="flex items-center gap-2 mb-1.5">
                              <div className="w-3 h-3 rounded" style={{ background: st.color }} />
                              <span className={`text-xs font-semibold ${s3}`}>{st.label}</span>
                              <span className={`text-[9px] ${s1}`}>{st.phase}</span>
                              {st.gate && <span className="text-[8px] font-bold text-[#A61D3A] bg-[rgba(166,29,58,0.1)] px-1.5 py-0.5 rounded">Gate {st.gate}</span>}
                            </div>
                            <p className={`text-[10px] sm:text-xs ${s2} leading-relaxed`}>{st.desc}</p>
                          </div>
                        );
                      })()}

                      {/* Exception States */}
                      <p className={`text-[10px] tracking-wider uppercase ${s1} mb-2 font-semibold`}>Exception States</p>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {exceptionStates.map(ex => (
                          <div key={ex.id} className={`${cd} border rounded-lg p-2.5 flex-1 min-w-[140px]`}>
                            <div className="flex items-center gap-1.5 mb-1">
                              <div className="w-2.5 h-2.5 rounded" style={{ background: ex.color }} />
                              <span className={`text-[10px] font-bold ${s3}`}>{ex.label}</span>
                            </div>
                            <p className={`text-[9px] ${s1} leading-relaxed`}>{ex.desc}</p>
                          </div>
                        ))}
                      </div>

                      {/* Auto-HOLD triggers */}
                      <p className={`text-[10px] tracking-wider uppercase ${s1} mb-2 mt-4 font-semibold`}>Auto-HOLD Triggers</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {[
                          "Appraisal variance >15% between any two appraisers",
                          "Sanctions screening returns partial match",
                          "Insurance coverage gap detected",
                          "Chainlink PoR feed stale >48 hours",
                          "Vault API returns error status",
                          "Document hash verification failure",
                        ].map(t => (
                          <div key={t} className={`flex items-start gap-2 py-1.5`}>
                            <div className="w-1.5 h-1.5 rounded-full bg-[#A61D3A] mt-1 shrink-0" />
                            <span className={`text-[10px] ${s2}`}>{t}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {/* ── RBAC ───────────────────── */}
                  {section.id === "rbac" && (
                    <>
                      <p className={`text-[10px] sm:text-xs ${s2} leading-relaxed mb-4`}>
                        Every user has a specific role with defined permissions. No single person can complete a critical action alone.
                        Click a role to see full permissions.
                      </p>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                        {roles.map(role => (
                          <button key={role.id} onClick={() => setActiveRole(activeRole === role.id ? null : role.id)}
                            className={`${cd} border rounded-xl p-3 text-left transition-all ${activeRole === role.id ? "ring-1" : ""}`}
                            style={activeRole === role.id ? { outlineColor: role.color, outlineWidth: "1px", outlineStyle: "solid" } : {}}>
                            <div className="w-6 h-6 rounded-lg mb-2 flex items-center justify-center text-white text-[10px] font-bold" style={{ background: role.color }}>
                              {role.label[0]}
                            </div>
                            <p className={`text-[10px] sm:text-xs font-semibold ${s3}`}>{role.label}</p>
                            <p className={`text-[9px] ${s1}`}>{role.who}</p>
                          </button>
                        ))}
                      </div>

                      {activeRole && (() => {
                        const role = roles.find(r => r.id === activeRole);
                        if (!role) return null;
                        return (
                          <div className={`${cd} border rounded-xl p-3 mb-4`}>
                            <p className={`text-xs font-semibold ${s3} mb-2`}>{role.label} — {role.who}</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <p className="text-[9px] tracking-wider uppercase text-[#1B6B4A] font-semibold mb-1">Can Do</p>
                                {role.permissions.map(p => (
                                  <div key={p} className="flex items-start gap-1.5 py-0.5">
                                    <span className="text-[#1B6B4A] text-[9px] mt-0.5">+</span>
                                    <span className={`text-[10px] ${s2}`}>{p}</span>
                                  </div>
                                ))}
                              </div>
                              <div>
                                <p className="text-[9px] tracking-wider uppercase text-[#A61D3A] font-semibold mb-1">Cannot Do</p>
                                {role.cannot.map(c => (
                                  <div key={c} className="flex items-start gap-1.5 py-0.5">
                                    <span className="text-[#A61D3A] text-[9px] mt-0.5">&times;</span>
                                    <span className={`text-[10px] ${s2}`}>{c}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      })()}

                      {/* Multi-Sig */}
                      <p className={`text-[10px] tracking-wider uppercase ${s1} mb-2 font-semibold`}>Multi-Signature Actions</p>
                      <div className="space-y-1.5">
                        {multiSigActions.map(ms => (
                          <div key={ms.action} className={`flex items-center gap-2 py-2 border-b ${dv} last:border-0`}>
                            {ms.critical && <div className="w-1.5 h-1.5 rounded-full bg-[#A61D3A] shrink-0" />}
                            <span className={`text-[10px] sm:text-xs ${s3} flex-1`}>{ms.action}</span>
                            <span className={`text-[9px] ${s1}`}>{ms.required.join(" + ")}</span>
                            <span className={`text-[9px] font-mono font-bold ${ms.critical ? "text-[#A61D3A]" : s2}`}>{ms.min}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {/* ── AI LAYER ────────────────── */}
                  {section.id === "ai" && (
                    <>
                      <p className={`text-[10px] sm:text-xs ${s2} leading-relaxed mb-4`}>
                        AI doesn&apos;t make decisions — it verifies, monitors, and flags. Every AI function produces documented evidence
                        that feeds into the audit trail. Humans make the final call on every critical action.
                      </p>
                      <div className="space-y-2">
                        {aiFeatures.map(ai => (
                          <div key={ai.name} className={`${cd} border rounded-xl p-3`}>
                            <p className={`text-[10px] sm:text-xs font-semibold ${s3}`}>{ai.name}</p>
                            <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 mt-1">
                              <div className="flex items-center gap-1">
                                <span className={`text-[8px] tracking-wider uppercase ${s1}`}>Trigger:</span>
                                <span className={`text-[10px] ${s2}`}>{ai.trigger}</span>
                              </div>
                            </div>
                            <p className={`text-[10px] ${s2} leading-relaxed mt-1`}>{ai.action}</p>
                          </div>
                        ))}
                      </div>

                      {/* Alert Levels */}
                      <p className={`text-[10px] tracking-wider uppercase ${s1} mb-2 mt-4 font-semibold`}>Alert Escalation</p>
                      {[
                        { level: "1", label: "Info", action: "Logged, no notification", color: "#6B7280" },
                        { level: "2", label: "Warning", action: "Email to Ops Lead", color: "#C47A1A" },
                        { level: "3", label: "Alert", action: "Email + SMS to Ops + Compliance", color: "#C47A1A" },
                        { level: "4", label: "Critical", action: "Email + SMS + Phone to ALL roles, auto-HOLD", color: "#A61D3A" },
                        { level: "5", label: "Emergency", action: "All of above + FREEZE all platform activity", color: "#A61D3A" },
                      ].map(al => (
                        <div key={al.level} className={`flex items-center gap-2 py-1.5 border-b ${dv} last:border-0`}>
                          <span className="text-[10px] font-mono font-bold w-4 text-center" style={{ color: al.color }}>L{al.level}</span>
                          <span className={`text-[10px] font-semibold w-16 ${s3}`}>{al.label}</span>
                          <span className={`text-[10px] ${s2} flex-1`}>{al.action}</span>
                        </div>
                      ))}
                    </>
                  )}

                  {/* ── MVP PHASES ──────────────── */}
                  {section.id === "mvp" && (
                    <>
                      <p className={`text-[10px] sm:text-xs ${s2} leading-relaxed mb-4`}>
                        Built in strict priority order. Each phase produces a working system. No phase depends on external partners
                        until Phase 4. Total timeline: 12 weeks to operational MVP.
                      </p>
                      <div className="space-y-3">
                        {mvpPhases.map(ph => (
                          <div key={ph.phase} className={`${cd} border rounded-xl p-3.5`}>
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[10px] font-bold" style={{ background: ph.color }}>
                                {ph.phase.split(" ")[1]}
                              </div>
                              <div>
                                <p className={`text-xs font-semibold ${s3}`}>{ph.title}</p>
                                <p className={`text-[9px] ${s1}`}>{ph.weeks}</p>
                              </div>
                            </div>
                            <div className="space-y-1 pl-9">
                              {ph.items.map(item => (
                                <div key={item} className="flex items-start gap-1.5">
                                  <div className="w-1 h-1 rounded-full mt-1.5 shrink-0" style={{ background: ph.color }} />
                                  <span className={`text-[10px] ${s2}`}>{item}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Tech Stack */}
                      <p className={`text-[10px] tracking-wider uppercase ${s1} mb-2 mt-4 font-semibold`}>Recommended Tech Stack</p>
                      <div className="grid grid-cols-2 gap-1.5">
                        {[
                          { layer: "Frontend", tech: "Next.js 16 + React 19 + Tailwind v4" },
                          { layer: "Backend", tech: "Next.js Server Actions" },
                          { layer: "Database", tech: "Supabase (PostgreSQL + RLS)" },
                          { layer: "Auth", tech: "Supabase Auth (magic link)" },
                          { layer: "Storage", tech: "Supabase Storage (S3)" },
                          { layer: "Audit Log", tech: "Append-only table (no UPDATE/DELETE)" },
                          { layer: "AI", tech: "Claude API (Anthropic)" },
                          { layer: "Hosting", tech: "Vercel (serverless)" },
                        ].map(t => (
                          <div key={t.layer} className={`py-1.5 px-2 rounded-lg ${dark ? "bg-white/[0.02]" : "bg-gray-50"}`}>
                            <p className={`text-[9px] font-semibold ${s3}`}>{t.layer}</p>
                            <p className={`text-[9px] ${s1}`}>{t.tech}</p>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                </div>
              </div>
            </div>
          );
        })}

      </div>

      <footer className={`text-center py-6 border-t ${dv}`}>
        <div className="flex gap-[2px] justify-center mb-2">
          {["#1B6B4A","#1A8B7A","#1E3A6E","#5B2D8E","#A61D3A","#C47A1A","#7BA31E"].map(c => (
            <span key={c} className="h-[2px] w-4 rounded-sm" style={{ background: c }} />
          ))}
        </div>
        <p className={`text-[10px] tracking-[0.15em] ${s1}`}>PleoChrome &mdash; Confidential &mdash; Internal Only</p>
      </footer>
    </div>
  );
}
