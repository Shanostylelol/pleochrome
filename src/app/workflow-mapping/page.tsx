"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import {
  type ValuePath,
  type Tag,
  type WorkflowPhase,
  SHARED_PHASES,
  getPathPhases,
  TAG_CONFIG,
} from "@/lib/portal-data";
import { PathSelector } from "@/components/portal/PathSelector";

/* ═══════════════════════════════════════════════════════
   PleoChrome — Master Workflow Map
   Password-protected, unlinked page
   /workflow-mapping
   ═══════════════════════════════════════════════════════ */

const PASSCODE = "pleo123";

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
  const c = TAG_CONFIG[tag];
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
  const [selectedPath, setSelectedPath] = useState<ValuePath>("tokenization");
  const [activePhase, setActivePhase] = useState<number | null>(null);
  const [openSteps, setOpenSteps] = useState<Set<string>>(new Set());

  const [dark, setDark] = useState(true);

  const phases: WorkflowPhase[] = [...SHARED_PHASES, ...getPathPhases(selectedPath)];

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

  const handlePathChange = (path: ValuePath) => {
    setSelectedPath(path);
    setActivePhase(null);
    setOpenSteps(new Set());
  };

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
        {(Object.entries(TAG_CONFIG) as [Tag, (typeof TAG_CONFIG)[Tag]][]).map(([key, val]) => (
          <span key={key} className="text-[9px] sm:text-[10px] tracking-wider uppercase px-2 py-[2px] rounded" style={{ color: val.color, background: val.bg }}>
            {val.label}
          </span>
        ))}
      </div>

      {/* Path Selector */}
      <PathSelector
        selected={selectedPath}
        onChange={handlePathChange}
        dark={dark}
        className="px-4 py-3"
        layoutId="workflowPathPill"
      />

      {/* Gem Navigation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedPath}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="flex justify-center gap-6 sm:gap-10 flex-wrap px-4 pt-8 pb-4"
        >
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
        </motion.div>
      </AnimatePresence>

      {/* Phase Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedPath}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="max-w-3xl mx-auto px-3 sm:px-5"
        >
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
        </motion.div>
      </AnimatePresence>

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
