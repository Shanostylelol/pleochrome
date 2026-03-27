"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const PASSCODE = "pleo123";

export default function PartnerPrep() {
  const [unlocked, setUnlocked] = useState(false);
  const [dark, setDark] = useState(true);
  const [code, setCode] = useState("");
  const [err, setErr] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (localStorage.getItem("pleo-auth") === "true") setUnlocked(true);
      const saved = localStorage.getItem("pleo-dark");
      if (saved !== null) setDark(saved === "true");
    }
  }, []);

  const go = (e: React.FormEvent) => { e.preventDefault(); if (code === PASSCODE) { setUnlocked(true); localStorage.setItem("pleo-auth", "true"); } else { setErr(true); setTimeout(() => setErr(false), 1500); } };

  if (!unlocked) return (
    <div className="min-h-screen flex items-center justify-center bg-[#030712] px-4">
      <form onSubmit={go} className="text-center max-w-sm w-full">
        <Image src="/favicon.png" alt="" width={48} height={48} className="mx-auto mb-6 opacity-60" />
        <h1 className="font-[family-name:var(--font-cormorant)] text-2xl font-light text-white/80 mb-2">Partner Prep</h1>
        <p className="text-xs tracking-[0.2em] uppercase text-white/30 mb-8">Enter passcode</p>
        <input type="password" value={code} onChange={e => setCode(e.target.value)} placeholder="Passcode" autoFocus className={`w-full bg-white/[0.04] border rounded-xl px-5 py-3.5 text-sm text-white/80 placeholder:text-white/20 outline-none ${err ? "border-[#A61D3A]" : "border-white/[0.08] focus:border-white/20"}`} />
        <button type="submit" className="mt-4 w-full bg-gradient-to-r from-[#1A8B7A] to-[#1E3A6E] text-white text-xs tracking-[0.2em] uppercase py-3.5 rounded-xl">Enter</button>
      </form>
    </div>
  );

  const bg = dark ? "bg-[#030712]" : "bg-[#F8F9FA]";
  const tx = dark ? "text-[#FAFBFC]" : "text-[#1a1a1a]";
  const cd = dark ? "bg-[rgba(10,17,32,0.92)] border-white/[0.04]" : "bg-white border-gray-200 shadow-sm";
  const s1 = dark ? "text-white/25" : "text-gray-400";
  const s2 = dark ? "text-white/50" : "text-gray-600";
  const s3 = dark ? "text-white/70" : "text-gray-800";
  const dv = dark ? "border-white/[0.04]" : "border-gray-100";
  const hv = dark ? "hover:bg-white/[0.02]" : "hover:bg-gray-50";

  type QA = { q: string; why: string; ourAnswer?: string };

  const platformQuestions: QA[] = [
    { q: "What token standard do you deploy? (ERC-3643, ERC-7518, other?)", why: "We need a permissioned, compliance-embedded token standard suitable for US Reg D 506(c) securities. We are evaluating both ERC-3643 (Brickken) and ERC-7518 (Zoniqx).", ourAnswer: "We need a compliance token on Polygon with built-in KYC whitelisting, transfer restrictions, and institutional credibility. We're evaluating multiple standards." },
    { q: "Which tier should we start with for our first $10M offering?", why: "We need to understand entry-level pricing and whether it covers a ~$10M first offering. Our pipeline is $1B+.", ourAnswer: "We're starting with one $10M offering but our pipeline is $1B+. We want to understand the upgrade path as we scale." },
    { q: "Does your platform handle compliance for US Reg D 506(c) offerings?", why: "We need to know if the platform can enforce accredited investor requirements and transfer restrictions at the smart contract level.", ourAnswer: "We're offering exclusively under Reg D 506(c) to accredited investors. We need on-chain KYC whitelisting and transfer restrictions." },
    { q: "How does your KYC integration work? Is it included in the subscription?", why: "We need to understand KYC capacity, what providers are used, and whether it covers accredited investor verification.", ourAnswer: "We expect 50-200 investors across our first few offerings. We need KYC + accredited investor verification." },
    { q: "Can we connect Chainlink Proof of Reserve to gate the minting process?", why: "Oracle-gated minting is our key differentiator. The smart contract must check PoR before creating tokens.", ourAnswer: "We're integrating Chainlink PoR to verify vault custody. We need the mint function to check the oracle feed before executing." },
    { q: "Which blockchains do you support? Can we deploy on Polygon?", why: "We chose Polygon for low gas costs and institutional adoption.", ourAnswer: "Polygon is our target chain. Low gas, institutional adoption, Chainlink PoR available." },
    { q: "Are your smart contracts already audited? By whom?", why: "If pre-audited, we only need a config review ($3-5K), not a full audit ($50-100K).", ourAnswer: "We want to leverage pre-audited contracts to avoid the cost of a full custom audit." },
    { q: "How do you handle the cap table / shareholder registry?", why: "We need to know if the platform can serve as the transfer agent function via on-chain registry.", ourAnswer: "Per the SEC's January 2026 statement, blockchain can serve as the master securityholder file. Can your platform fulfill this role?" },
    { q: "What does the investor onboarding flow look like from their perspective?", why: "We need a smooth experience for accredited investors — not a crypto-native UX.", ourAnswer: "Our investors are high-net-worth individuals, not crypto natives. The onboarding needs to feel like a premium investment experience, not a DeFi app." },
    { q: "Can we white-label the investor-facing interface?", why: "We need PleoChrome branding, not the platform's branding, on what investors see.", ourAnswer: "Our brand is 'institutional luxury.' The investor portal needs to match our design system — navy + gem accents." },
    { q: "How do you handle dividend/distribution payments to token holders?", why: "If stones are ever sold or generate income, we need to distribute to holders.", ourAnswer: "We may need to distribute proceeds if a stone is redeemed or the offering is liquidated." },
    { q: "What's the process for secondary transfers between token holders?", why: "Need to understand how holder-to-holder transfers work within the compliance framework.", ourAnswer: "We need compliant secondary transfers — only between verified, accredited wallets." },
    { q: "What's your sandbox/testnet environment like? Can we test before going live?", why: "We must test everything before deploying real tokens with real investor money.", ourAnswer: "We want to run a complete end-to-end test: deploy, mint, transfer, block non-compliant, verify PoR gate — all on testnet first." },
    { q: "What does your pricing look like for our scale? $1B+ pipeline over 3-5 years?", why: "Need to understand volume pricing and whether there are per-token or per-offering fees beyond the subscription.", ourAnswer: "We have $1B+ in potential assets from multiple holders in Tacoma WA, Newport Beach CA, and Sarasota FL. We're starting with one $10M offering but expect to scale rapidly." },
    { q: "What ongoing support do you provide? Dedicated account manager?", why: "For our first offering, we'll need hands-on support.", ourAnswer: "This is our first tokenization. We need a partner who will walk us through the first deployment, not just hand us documentation." },
    { q: "Can you provide references from other US-based issuers who have done Reg D offerings on your platform?", why: "Social proof and validation that you've done this before in the US regulatory context.", ourAnswer: "We're building for US institutional credibility. We need to know you've successfully supported US Reg D offerings." },
  ];

  const whatWeTell: { topic: string; script: string }[] = [
    { topic: "Who We Are", script: "PleoChrome is the orchestration platform for unlocking value from high-value colored gemstones through three paths: Fractional Securities, Tokenization, and Debt Instruments. We coordinate every specialist in the pipeline — GIA for certification, independent appraisers for valuation, Brink's and Malca-Amit for custody, Chainlink for reserve verification, and tokenization platforms for digital securities. We don't hold stones, we don't hold investor money, and we don't give investment advice. We orchestrate the trust infrastructure that makes gemstone value creation possible." },
    { topic: "Our Pipeline", script: "We currently have access to over $1 billion in GIA-certified colored gemstones from multiple asset holders across Tacoma WA, Newport Beach CA, and Sarasota FL. Our first offering will be approximately $10 million in certified emeralds — a controlled proof-of-concept to validate the end-to-end process before scaling." },
    { topic: "Our Differentiator", script: "Three things make PleoChrome different: (1) The 3-Appraisal Rule — every stone gets three independent USPAP-compliant appraisals and we use the two lowest to set the offering price. Structurally conservative. (2) Oracle-gated minting via Chainlink Proof of Reserve — tokens physically cannot be created unless the oracle confirms vault custody. (3) Three value paths — Fractional Securities for simplicity, Tokenization (ERC-3643 or ERC-7518) for programmable compliance, and Debt Instruments for borrowing against verified assets. We're platform-agnostic, evaluating both Brickken and Zoniqx for tokenization." },
    { topic: "Our Team", script: "Shane Pierson — 20 years in financial services, SBA lending national sales manager, building the orchestration platform. Chris Ramsey — operations and legal strategy, decades of experience in capital markets. David Whiting — data engineering, MS in Statistics from Texas A&M, building the analytics and governance infrastructure." },
    { topic: "What We Need from a Tokenization Partner", script: "We need a tokenization partner, not a vendor. We need: compliant security token deployment on Polygon, built-in KYC/accreditation verification, Chainlink PoR integration for mint-gating, a clean investor onboarding experience, and the ability to scale from one offering to hundreds. We're currently evaluating Brickken (ERC-3643) and Zoniqx (ERC-7518) — and we want to move fast with the right partner." },
    { topic: "Our Timeline", script: "We want our first token deployed within 90-120 days. The legal structuring and appraisal process is already in motion. We need the tokenization platform configured and tested within the next 60 days so we're ready when the legal and custody gates clear." },
  ];

  const genericPartnerQs: QA[] = [
    { q: "What services do you provide end-to-end?", why: "Understand scope — what's included vs. what we need elsewhere" },
    { q: "What are your certifications/licenses/registrations?", why: "Verify they're authorized to do what they claim" },
    { q: "What security certifications do you have? (SOC 2, ISO 27001?)", why: "We're handling $10M+ assets — security is non-negotiable" },
    { q: "Can you provide references from similar clients?", why: "Social proof from companies like ours" },
    { q: "What's your pricing structure? Any hidden fees?", why: "Full cost transparency" },
    { q: "What's your onboarding timeline?", why: "We need to move within 60-90 days" },
    { q: "What happens if we need to switch providers later?", why: "Data portability and lock-in risk" },
    { q: "What's your insurance coverage?", why: "E&O, cyber, professional liability" },
    { q: "Who would be our point of contact?", why: "Dedicated support vs. ticket queue" },
    { q: "What's your company's financial stability? Funding status?", why: "We can't build on a platform that might disappear" },
    { q: "Do you have an API? What documentation exists?", why: "We need programmatic integration for our governance engine" },
    { q: "What compliance frameworks do you support? US Reg D? EU MiCA?", why: "Multi-jurisdiction capability" },
  ];

  const sections = [
    { id: "platform", title: "Tokenization Platform Evaluation", subtitle: "16 questions for Brickken, Zoniqx, or any platform", color: "#1A8B7A", count: platformQuestions.length },
    { id: "ourStory", title: "What We Tell Partners", subtitle: "Scripted talking points about PleoChrome", color: "#1B6B4A", count: whatWeTell.length },
    { id: "generic", title: "Universal Partner Questions", subtitle: "Works for any partner meeting", color: "#C47A1A", count: genericPartnerQs.length },
  ];

  return (
    <div className={`min-h-screen ${bg} ${tx} transition-colors duration-300`}>
      <header className="text-center pt-6 pb-5 sm:pt-10 sm:pb-7 relative px-4">
        <div className="flex items-center justify-center gap-2 mb-3">
          <a href="/portal" className={`text-[9px] sm:text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full border flex items-center gap-1 ${dark ? "border-white/10 text-white/30 hover:text-white/50" : "border-gray-300 text-gray-400 hover:text-gray-600"}`}>
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Portal
          </a>
          <Image src={dark ? "/logo-white.png" : "/logo.png"} alt="PleoChrome" width={160} height={40} className="opacity-50 h-5 sm:h-6 w-auto" />
          <button onClick={() => { setDark(!dark); localStorage.setItem("pleo-dark", String(!dark)); }}
            className={`text-[9px] sm:text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full border ${dark ? "border-white/10 text-white/30" : "border-gray-300 text-gray-400"}`}>
            {dark ? "Light" : "Dark"}
          </button>
        </div>
        <h1 className="font-[family-name:var(--font-cormorant)] text-lg sm:text-2xl font-light tracking-wider">Partner Meeting Prep</h1>
        <p className={`mt-1 text-[10px] tracking-[0.25em] uppercase ${s1}`}>Questions, Scripts, and Strategy</p>
      </header>

      <div className="max-w-3xl mx-auto px-3 sm:px-5 pb-16">

        {/* Hub */}
        {!activeSection && (
          <>
            <div className={`${cd} border rounded-2xl p-4 sm:p-5 mb-5`}>
              <p className={`text-xs sm:text-sm ${s2} leading-relaxed`}>
                Use this before ANY partner meeting. It has: evaluation questions for tokenization platforms
                (Brickken, Zoniqx, or others), scripted talking points about PleoChrome&apos;s three value paths,
                and a universal question set that works for any partner (appraisers, vaults, broker-dealers, attorneys).
              </p>
            </div>

            {sections.map(sec => (
              <button key={sec.id} onClick={() => { setActiveSection(sec.id); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                className={`w-full ${cd} border rounded-2xl p-4 sm:p-5 flex items-center gap-3 text-left mb-3 ${hv} transition-colors group`}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-sm" style={{ background: sec.color }}>
                  {sec.count}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-semibold ${s3}`}>{sec.title}</p>
                  <p className={`text-[10px] ${s1}`}>{sec.subtitle}</p>
                </div>
                <svg className={`w-4 h-4 ${s1} group-hover:translate-x-1 transition-transform`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </button>
            ))}
          </>
        )}

        {/* Platform Evaluation */}
        {activeSection === "platform" && (
          <>
            <button onClick={() => setActiveSection(null)} className={`text-[10px] ${s1} flex items-center gap-1 mb-4 hover:${s2}`}>
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              Back to Hub
            </button>
            <div className={`${cd} border rounded-2xl p-4 sm:p-5 mb-4`}>
              <h2 className={`text-sm font-semibold ${s3} mb-1`}>Tokenization Platform — Evaluation Playbook</h2>
              <p className={`text-[10px] ${s2} leading-relaxed`}>
                Ask these questions in order. For each one, there&apos;s a &ldquo;Why We Ask&rdquo; (your internal reason)
                and &ldquo;Our Answer&rdquo; (what to say when they ask us the same topic). Tap each to expand.
              </p>
            </div>
            {platformQuestions.map((qa, i) => (
              <details key={i} className={`${cd} border rounded-xl mb-2 overflow-hidden`}>
                <summary className={`flex items-start gap-2 p-3 sm:p-4 cursor-pointer ${hv} transition-colors`}>
                  <span className="text-[10px] font-mono text-[#1A8B7A] w-5 shrink-0 mt-0.5">{i + 1}.</span>
                  <span className={`text-xs sm:text-sm font-semibold ${s3} flex-1`}>{qa.q}</span>
                </summary>
                <div className={`px-4 sm:px-5 pb-4 pl-9 sm:pl-10 border-t ${dv}`}>
                  <div className="mt-3">
                    <p className={`text-[9px] tracking-wider uppercase ${s1} mb-1`}>Why We Ask This</p>
                    <p className={`text-[11px] ${s2} leading-relaxed`}>{qa.why}</p>
                  </div>
                  {qa.ourAnswer && (
                    <div className="mt-3">
                      <p className="text-[9px] tracking-wider uppercase text-[#1A8B7A] mb-1">Our Talking Point</p>
                      <p className={`text-[11px] ${s3} leading-relaxed italic`}>&ldquo;{qa.ourAnswer}&rdquo;</p>
                    </div>
                  )}
                </div>
              </details>
            ))}
          </>
        )}

        {/* Our Story */}
        {activeSection === "ourStory" && (
          <>
            <button onClick={() => setActiveSection(null)} className={`text-[10px] ${s1} flex items-center gap-1 mb-4`}>
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              Back to Hub
            </button>
            <div className={`${cd} border rounded-2xl p-4 sm:p-5 mb-4`}>
              <h2 className={`text-sm font-semibold ${s3} mb-1`}>What We Tell Partners About PleoChrome</h2>
              <p className={`text-[10px] ${s2}`}>Memorize these talking points. They make you sound like you&apos;ve been doing this for years.</p>
            </div>
            {whatWeTell.map((item, i) => (
              <div key={i} className={`${cd} border rounded-xl p-4 sm:p-5 mb-3`}>
                <p className="text-[9px] tracking-wider uppercase text-[#1B6B4A] mb-2 font-semibold">{item.topic}</p>
                <p className={`text-xs sm:text-sm ${s3} leading-[1.8] italic`}>&ldquo;{item.script}&rdquo;</p>
              </div>
            ))}
          </>
        )}

        {/* Generic */}
        {activeSection === "generic" && (
          <>
            <button onClick={() => setActiveSection(null)} className={`text-[10px] ${s1} flex items-center gap-1 mb-4`}>
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              Back to Hub
            </button>
            <div className={`${cd} border rounded-2xl p-4 sm:p-5 mb-4`}>
              <h2 className={`text-sm font-semibold ${s3} mb-1`}>Universal Partner Interview Questions</h2>
              <p className={`text-[10px] ${s2}`}>Use these for ANY partner: appraisers, vaults, broker-dealers, attorneys, tech partners.</p>
            </div>
            {genericPartnerQs.map((qa, i) => (
              <details key={i} className={`${cd} border rounded-xl mb-2 overflow-hidden`}>
                <summary className={`flex items-start gap-2 p-3 sm:p-4 cursor-pointer ${hv}`}>
                  <span className={`text-[10px] font-mono ${s1} w-5 shrink-0 mt-0.5`}>{i + 1}.</span>
                  <span className={`text-xs sm:text-sm font-semibold ${s3} flex-1`}>{qa.q}</span>
                </summary>
                <div className={`px-4 pb-3 pl-9 border-t ${dv} mt-0 pt-3`}>
                  <p className={`text-[11px] ${s2} leading-relaxed`}>{qa.why}</p>
                </div>
              </details>
            ))}
          </>
        )}

      </div>

      <footer className={`text-center py-6 border-t ${dv}`}>
        <p className={`text-[9px] tracking-[0.15em] ${s1}`}>PleoChrome &mdash; Confidential</p>
      </footer>
    </div>
  );
}
