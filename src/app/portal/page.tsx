"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const PASSCODE = "pleo123";

export default function Portal() {
  const [unlocked, setUnlocked] = useState(false);
  const [code, setCode] = useState("");
  const [err, setErr] = useState(false);
  const [dark, setDark] = useState(true);

  // Persist dark mode and auth
  useEffect(() => {
    const saved = localStorage.getItem("pleo-dark");
    if (saved !== null) setDark(saved === "true");
    if (localStorage.getItem("pleo-auth") === "true") setUnlocked(true);
  }, []);

  useEffect(() => { localStorage.setItem("pleo-dark", String(dark)); }, [dark]);

  const go = (e: React.FormEvent) => {
    e.preventDefault();
    if (code === PASSCODE) { setUnlocked(true); localStorage.setItem("pleo-auth", "true"); }
    else { setErr(true); setTimeout(() => setErr(false), 1500); }
  };

  const bg = dark ? "bg-[#030712]" : "bg-[#F8F9FA]";
  const tx = dark ? "text-[#FAFBFC]" : "text-[#1a1a1a]";
  const cd = dark ? "bg-[rgba(10,17,32,0.92)] border-white/[0.04]" : "bg-white border-gray-200 shadow-sm";
  const s1 = dark ? "text-white/25" : "text-gray-400";
  const s2 = dark ? "text-white/50" : "text-gray-600";
  const s3 = dark ? "text-white/70" : "text-gray-800";
  const logo = dark ? "/logo-white.png" : "/logo.png";

  if (!unlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030712] px-4">
        <form onSubmit={go} className="text-center max-w-sm w-full">
          <Image src="/favicon.png" alt="" width={56} height={56} className="mx-auto mb-6 opacity-60" />
          <h1 className="font-[family-name:var(--font-cormorant)] text-2xl font-light text-white/80 mb-1">PleoChrome Portal</h1>
          <p className="text-xs tracking-[0.2em] uppercase text-white/30 mb-8">Restricted Access</p>
          <input type="password" value={code} onChange={e => setCode(e.target.value)} placeholder="Passcode" autoFocus
            className={`w-full bg-white/[0.04] border rounded-xl px-5 py-3.5 text-sm text-white/80 placeholder:text-white/20 outline-none ${err ? "border-[#A61D3A]" : "border-white/[0.08] focus:border-white/20"}`} />
          <button type="submit" className="mt-4 w-full bg-gradient-to-r from-[#1A8B7A] to-[#1E3A6E] text-white text-xs tracking-[0.2em] uppercase py-3.5 rounded-xl">Enter</button>
        </form>
      </div>
    );
  }

  const tools = [
    {
      title: "Deal Model",
      subtitle: "Interactive P&L Calculator",
      desc: "Build, adjust, save, and export complete tokenization deal models. Change any cost, add custom expenses, compare stones, and download the P&L as a CSV for Excel or Google Sheets.",
      href: "/financial-model",
      color: "#1B6B4A",
      icon: (
        <svg className="w-7 h-7 sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path d="M3 3v18h18" /><path d="M7 16l4-8 4 4 5-10" />
        </svg>
      ),
    },
    {
      title: "Workflow Map",
      subtitle: "7-Gate Execution Framework",
      desc: "Interactive visual map of PleoChrome's complete pipeline — from stone acquisition through tokenization to investor distribution. Click each gem to explore the 34 steps across 4 phases.",
      href: "/workflow-mapping",
      color: "#1A8B7A",
      icon: (
        <svg className="w-7 h-7 sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <circle cx="12" cy="5" r="2" /><circle cx="5" cy="19" r="2" /><circle cx="19" cy="19" r="2" />
          <path d="M12 7v4M10 13l-3.5 4M14 13l3.5 4" />
        </svg>
      ),
    },
    {
      title: "Learn",
      subtitle: "How It All Works",
      desc: "Plain-English guide to everything PleoChrome does. 9-step visual walkthrough of the process plus a 28-term glossary explaining every concept, acronym, and role — no jargon.",
      href: "/learn",
      color: "#C47A1A",
      icon: (
        <svg className="w-7 h-7 sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" /><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
        </svg>
      ),
    },
    {
      title: "System Architecture",
      subtitle: "Governance Engine Blueprint",
      desc: "Internal mission-control system design: state machine workflow, role-based access control, AI automation, partner API integrations, and 12-week MVP build plan.",
      href: "/architecture",
      color: "#5B2D8E",
      icon: (
        <svg className="w-7 h-7 sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path d="M12 2L2 7l10 5 10-5z" /><path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      ),
    },
  ];

  return (
    <div className={`min-h-screen ${bg} ${tx} transition-colors duration-300`}>
      {/* Header */}
      <header className="text-center pt-10 pb-6 sm:pt-14 sm:pb-8 relative px-4">
        <div className="flex items-center justify-center gap-3 mb-3">
          <Image src={logo} alt="PleoChrome" width={180} height={45} className="h-6 sm:h-7 w-auto opacity-60" />
          <button onClick={() => setDark(!dark)}
            className={`text-[9px] sm:text-[10px] tracking-wider uppercase px-3 py-1 rounded-full border transition-colors ${dark ? "border-white/10 text-white/30 hover:text-white/50" : "border-gray-300 text-gray-400 hover:text-gray-600"}`}>
            {dark ? "Light" : "Dark"}
          </button>
        </div>
        <h1 className="font-[family-name:var(--font-cormorant)] text-xl sm:text-3xl font-light tracking-wider">Partner Portal</h1>
        <p className={`mt-1 text-[10px] sm:text-xs tracking-[0.25em] uppercase ${s1}`}>Value from Every Angle</p>
        <div className="flex gap-[2px] justify-center mt-3">
          {["#1B6B4A","#1A8B7A","#1E3A6E","#5B2D8E","#A61D3A","#C47A1A","#7BA31E"].map(c => (
            <span key={c} className="h-[2px] w-5 rounded-sm" style={{ background: c }} />
          ))}
        </div>
        <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] max-w-lg h-px bg-gradient-to-r from-transparent ${dark ? "via-white/[0.06]" : "via-gray-200"} to-transparent`} />
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-16">
        {/* Welcome */}
        <div className={`${cd} border rounded-2xl p-4 sm:p-5 mb-6`}>
          <p className={`text-xs sm:text-sm ${s2} leading-relaxed`}>
            Welcome to the PleoChrome partner portal. These tools are designed to help you understand,
            model, and explain the gemstone tokenization process. Select a tool below.
          </p>
        </div>

        {/* Tool Cards */}
        <div className="space-y-3 sm:space-y-4">
          {tools.map(tool => (
            <Link key={tool.title} href={tool.href}
              className={`${cd} border rounded-2xl p-4 sm:p-5 flex items-start gap-4 transition-all duration-300 group ${dark ? "hover:bg-white/[0.03] hover:border-white/[0.08]" : "hover:shadow-md hover:border-gray-300"}`}>
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105"
                style={{ background: tool.color + "15", color: tool.color }}>
                {tool.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h2 className={`text-sm sm:text-base font-semibold ${s3}`}>{tool.title}</h2>
                  <svg className={`w-4 h-4 ${s1} transition-transform duration-300 group-hover:translate-x-1`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
                <p className={`text-[10px] sm:text-xs tracking-wider uppercase ${s1} mb-1.5`}>{tool.subtitle}</p>
                <p className={`text-[11px] sm:text-xs ${s2} leading-relaxed`}>{tool.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Links */}
        <div className={`mt-8 pt-6 border-t ${dark ? "border-white/[0.04]" : "border-gray-100"}`}>
          <p className={`text-[10px] tracking-wider uppercase ${s1} mb-3`}>Quick Links</p>
          <div className="flex flex-wrap gap-2">
            <Link href="/" className={`text-[10px] sm:text-xs px-3 py-1.5 rounded-lg border transition-colors ${dark ? "border-white/[0.06] text-white/30 hover:text-white/50" : "border-gray-200 text-gray-400 hover:text-gray-600"}`}>
              Public Website
            </Link>
            <a href="mailto:team@pleochrome.com" className={`text-[10px] sm:text-xs px-3 py-1.5 rounded-lg border transition-colors ${dark ? "border-white/[0.06] text-white/30 hover:text-white/50" : "border-gray-200 text-gray-400 hover:text-gray-600"}`}>
              Contact Team
            </a>
          </div>
        </div>
      </div>

      <footer className={`text-center py-6 border-t ${dark ? "border-white/[0.03]" : "border-gray-100"}`}>
        <div className="flex gap-[2px] justify-center mb-2">
          {["#1B6B4A","#1A8B7A","#1E3A6E","#5B2D8E","#A61D3A","#C47A1A","#7BA31E"].map(c => (
            <span key={c} className="h-[2px] w-4 rounded-sm" style={{ background: c }} />
          ))}
        </div>
        <p className={`text-[10px] tracking-[0.15em] ${dark ? "text-white/10" : "text-gray-300"}`}>PleoChrome &mdash; Confidential &mdash; Florida</p>
      </footer>
    </div>
  );
}
