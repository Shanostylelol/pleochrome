"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";

const PASSCODE = "pleo123";

// Dynamically import Handsontable (SSR incompatible)
const HotTableWrapper = dynamic(() => import("./HotTable"), { ssr: false });

/* ═══════════════════════════════════════════════════════
   PleoChrome — Live Financial Spreadsheet
   Handsontable-powered, formula-driven, multi-tab
   /spreadsheet
   ═══════════════════════════════════════════════════════ */

export default function SpreadsheetPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [dark, setDark] = useState(true);
  const [code, setCode] = useState("");
  const [err, setErr] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (localStorage.getItem("pleo-auth") === "true") setUnlocked(true);
      const saved = localStorage.getItem("pleo-dark");
      if (saved !== null) setDark(saved === "true");
    }
  }, []);

  const go = (e: React.FormEvent) => {
    e.preventDefault();
    if (code === PASSCODE) { setUnlocked(true); localStorage.setItem("pleo-auth", "true"); }
    else { setErr(true); setTimeout(() => setErr(false), 1500); }
  };

  if (!unlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030712] px-4">
        <form onSubmit={go} className="text-center max-w-sm w-full">
          <Image src="/favicon.png" alt="" width={48} height={48} className="mx-auto mb-6 opacity-60" />
          <h1 className="font-[family-name:var(--font-cormorant)] text-2xl font-light text-white/80 mb-2">Financial Spreadsheet</h1>
          <p className="text-xs tracking-[0.2em] uppercase text-white/30 mb-8">Enter passcode</p>
          <input type="password" value={code} onChange={e => setCode(e.target.value)} placeholder="Passcode" autoFocus
            className={`w-full bg-white/[0.04] border rounded-xl px-5 py-3.5 text-sm text-white/80 placeholder:text-white/20 outline-none ${err ? "border-[#A61D3A]" : "border-white/[0.08] focus:border-white/20"}`} />
          <button type="submit" className="mt-4 w-full bg-gradient-to-r from-[#1A8B7A] to-[#1E3A6E] text-white text-xs tracking-[0.2em] uppercase py-3.5 rounded-xl">Enter</button>
        </form>
      </div>
    );
  }

  const bg = dark ? "bg-[#030712]" : "bg-[#F8F9FA]";
  const tx = dark ? "text-[#FAFBFC]" : "text-[#1a1a1a]";
  const s1 = dark ? "text-white/25" : "text-gray-400";

  return (
    <div className={`min-h-screen ${bg} ${tx} transition-colors duration-300`}>
      <header className="pt-4 pb-3 sm:pt-6 sm:pb-4 px-4">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <a href="/portal" className={`text-[9px] sm:text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full border flex items-center gap-1 ${dark ? "border-white/10 text-white/30 hover:text-white/50" : "border-gray-300 text-gray-400 hover:text-gray-600"}`}>
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              Portal
            </a>
            <Image src={dark ? "/logo-white.png" : "/logo.png"} alt="PleoChrome" width={120} height={30} className="opacity-50 h-4 sm:h-5 w-auto" />
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] tracking-wider uppercase ${s1} hidden sm:inline`}>Live Financial Model</span>
            <button onClick={() => { setDark(!dark); localStorage.setItem("pleo-dark", String(!dark)); }}
              className={`text-[9px] sm:text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full border ${dark ? "border-white/10 text-white/30" : "border-gray-300 text-gray-400"}`}>
              {dark ? "Light" : "Dark"}
            </button>
          </div>
        </div>
      </header>

      <div className="px-2 sm:px-4 pb-8">
        <div className="max-w-[1400px] mx-auto">
          <HotTableWrapper dark={dark} />
        </div>
      </div>

      <footer className={`text-center py-4 border-t ${dark ? "border-white/[0.03]" : "border-gray-100"}`}>
        <p className={`text-[9px] tracking-[0.15em] ${s1}`}>PleoChrome &mdash; Confidential</p>
      </footer>
    </div>
  );
}
