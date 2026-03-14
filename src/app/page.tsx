"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  ShieldCheck,
  FileCheck2,
  Gem,
  Lock,
  Building2,
  Link2,
  Users,
} from "lucide-react";
import { ShaderAnimation } from "@/components/ui/shader-animation";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════
   PleoChrome Landing Page
   "Trust, Verified from Every Angle"
   ═══════════════════════════════════════════════════════ */

// ── 7-Gate data ──────────────────────────────

const gates = [
  {
    icon: <ShieldCheck className="h-5 w-5" />,
    title: "Intake",
    subtitle: "Source Verification",
    description:
      "Every asset begins with rigorous provenance review. Origin legitimacy, seller eligibility, and chain-of-custody documentation — verified before anything moves forward.",
  },
  {
    icon: <FileCheck2 className="h-5 w-5" />,
    title: "Evidence",
    subtitle: "Legal Clearance",
    description:
      "Sanctions screening, legal transferability, and regulatory compliance checks create an unbroken evidence trail from source to sale.",
  },
  {
    icon: <Gem className="h-5 w-5" />,
    title: "Verification",
    subtitle: "Independent Valuation",
    description:
      "Three independent GIA-certified appraisals. The two lowest define the asset\u2019s market value — structurally conservative, investor-protective by design.",
  },
  {
    icon: <Lock className="h-5 w-5" />,
    title: "Custody",
    subtitle: "Institutional Vault",
    description:
      "Physical assets secured in institutional-grade vaults with active insurance. Custody receipts are cryptographically linked to on-chain records.",
  },
  {
    icon: <Building2 className="h-5 w-5" />,
    title: "Issuer",
    subtitle: "Legal Structuring",
    description:
      "Each asset is wrapped in a dedicated Special Purpose Vehicle. Offering rights, investor protections, and legal frameworks \u2014 all finalized before tokenization.",
  },
  {
    icon: <Link2 className="h-5 w-5" />,
    title: "Platform",
    subtitle: "Token Alignment",
    description:
      "Smart contract parameters are validated against legal documents and vault records. Oracle-gated minting ensures on-chain and off-chain facts are perfectly synchronized.",
  },
  {
    icon: <Users className="h-5 w-5" />,
    title: "Sale",
    subtitle: "Investor Access",
    description:
      "Qualified investor onboarding, compliant distribution channels, and transparent communication paths \u2014 all live and verified before the first token is offered.",
  },
];

// ── Gem accent colors for visual variety ─────

const gemColors = [
  "bg-[#1B6B4A]", // emerald
  "bg-[#1A8B7A]", // teal
  "bg-[#1E3A6E]", // sapphire
  "bg-[#5B2D8E]", // amethyst
  "bg-[#A61D3A]", // ruby
  "bg-[#C47A1A]", // amber
  "bg-[#7BA31E]", // chartreuse
];

// ── Hero Section ─────────────────────────────

function HeroSection() {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 600),   // logo
      setTimeout(() => setStage(2), 1800),  // "Trust"
      setTimeout(() => setStage(3), 2800),  // "Verified from Every Angle"
      setTimeout(() => setStage(4), 4000),  // CTA
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Shader background */}
      <ShaderAnimation />

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60 z-[1]" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6 w-full">
        {/* Logo */}
        <div
          className={cn(
            "transition-all duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] w-full flex justify-center",
            stage >= 1
              ? "opacity-100 scale-100"
              : "opacity-0 scale-[0.85]"
          )}
        >
          <Image
            src="/logo-white.png"
            alt="PleoChrome"
            width={840}
            height={200}
            priority
            className="max-w-[85vw] sm:max-w-[75vw] md:w-[760px] lg:w-[840px] h-auto drop-shadow-[0_0_40px_rgba(26,139,122,0.15)]"
          />
        </div>

        {/* Tagline — "Trust" */}
        <h1
          className={cn(
            "font-display font-light text-white/90 mt-8 sm:mt-10 transition-all duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)]",
            "text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-[0.1em] sm:tracking-[0.15em]",
            stage >= 2
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6"
          )}
        >
          Trust
        </h1>

        {/* Tagline — "Verified from Every Angle" */}
        <p
          className={cn(
            "text-[11px] sm:text-sm md:text-base tracking-[0.2em] sm:tracking-[0.35em] uppercase text-white/50 mt-3 sm:mt-4 transition-all duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)]",
            stage >= 3
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6"
          )}
        >
          Verified from Every Angle
        </p>

        {/* Gem accent bar */}
        <div
          className={cn(
            "gem-bar mt-6 sm:mt-8 w-32 sm:w-48 transition-all duration-[1s] ease-[cubic-bezier(0.16,1,0.3,1)]",
            stage >= 3 ? "opacity-100" : "opacity-0"
          )}
        >
          <span className="bg-[#1B6B4A]" />
          <span className="bg-[#1A8B7A]" />
          <span className="bg-[#1E3A6E]" />
          <span className="bg-[#5B2D8E]" />
          <span className="bg-[#A61D3A]" />
          <span className="bg-[#C47A1A]" />
          <span className="bg-[#7BA31E]" />
        </div>

        {/* CTA */}
        <div
          className={cn(
            "mt-8 sm:mt-12 transition-all duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)]",
            stage >= 4
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          )}
        >
          <a
            href="#contact"
            className="group relative inline-flex items-center gap-2 sm:gap-3 border border-white/15 rounded-full px-6 py-3 sm:px-8 sm:py-3.5
              text-xs sm:text-sm tracking-[0.15em] sm:tracking-[0.2em] uppercase text-white/70 hover:text-white
              bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-sm
              transition-all duration-500 hover:border-white/25 hover:shadow-[0_0_30px_rgba(26,139,122,0.1)]"
          >
            <span>Learn More</span>
            <svg
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
            </svg>
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div
          className={cn(
            "w-[1px] h-12 bg-gradient-to-b from-transparent to-white/20 transition-opacity duration-1000",
            stage >= 4 ? "opacity-100" : "opacity-0"
          )}
        />
      </div>
    </section>
  );
}

// ── Intro Section ────────────────────────────

function IntroSection() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    const el = document.getElementById("intro");
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="intro"
      className="relative py-20 sm:py-32 md:py-40 vault-texture"
    >
      <div className="relative z-10 max-w-3xl mx-auto px-5 sm:px-6 text-center">
        <p
          className={cn(
            "text-[10px] sm:text-xs tracking-[0.3em] sm:tracking-[0.4em] uppercase text-[#1A8B7A] mb-4 sm:mb-6 transition-all duration-700",
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          The Orchestration Platform
        </p>
        <h2
          className={cn(
            "font-display text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] font-light leading-[1.3] sm:leading-[1.25] text-white/90 transition-all duration-1000 delay-200",
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          )}
        >
          We don&apos;t hold the stone.<br className="hidden md:block" />
          We don&apos;t sell the token.<br className="hidden md:block" />
          We orchestrate the trust that makes both possible.
        </h2>
        <div
          className={cn(
            "gem-bar mt-10 w-32 mx-auto transition-all duration-700 delay-500",
            visible ? "opacity-100" : "opacity-0"
          )}
        >
          <span className="bg-[#1B6B4A]" />
          <span className="bg-[#1A8B7A]" />
          <span className="bg-[#1E3A6E]" />
          <span className="bg-[#5B2D8E]" />
          <span className="bg-[#A61D3A]" />
          <span className="bg-[#C47A1A]" />
          <span className="bg-[#7BA31E]" />
        </div>
      </div>
    </section>
  );
}

// ── Process Gate Card ────────────────────────

interface GateCardProps {
  gate: (typeof gates)[number];
  index: number;
  area: string;
  visible: boolean;
}

function GateCard({ gate, index, area, visible }: GateCardProps) {
  return (
    <li
      className={cn(
        "min-h-[16rem] list-none transition-all duration-700",
        area,
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-8"
      )}
      style={{ transitionDelay: `${150 + index * 100}ms` }}
    >
      <div className="relative h-full rounded-2xl border border-white/[0.06] p-[3px] md:rounded-[1.5rem]">
        <GlowingEffect
          spread={40}
          glow
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
          borderWidth={2}
        />
        <div className="relative flex h-full flex-col justify-between gap-4 overflow-hidden rounded-[calc(1rem-1px)] md:rounded-[calc(1.5rem-3px)] bg-[#0A0F1A]/80 backdrop-blur-sm p-6 md:p-7 border border-white/[0.03]">
          {/* Gate number + icon */}
          <div className="flex items-center justify-between">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", gemColors[index])}>
              <span className="text-white/90">{gate.icon}</span>
            </div>
            <span className="text-xs tracking-[0.3em] uppercase text-white/20 font-medium">
              Gate {index + 1}
            </span>
          </div>

          {/* Content */}
          <div className="space-y-2.5 mt-auto">
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
              <h3 className="text-lg md:text-xl font-semibold tracking-tight text-white/90">
                {gate.title}
              </h3>
              <span className="text-[11px] sm:text-xs tracking-wider uppercase text-[#1A8B7A]">
                {gate.subtitle}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-white/40">
              {gate.description}
            </p>
          </div>
        </div>
      </div>
    </li>
  );
}

// ── Process Section ──────────────────────────

const gridAreas = [
  "md:[grid-area:1/1/2/5]",
  "md:[grid-area:1/5/2/9]",
  "md:[grid-area:1/9/2/13]",
  "md:[grid-area:2/1/3/7]",
  "md:[grid-area:2/7/3/13]",
  "md:[grid-area:3/1/4/7]",
  "md:[grid-area:3/7/4/13]",
];

function ProcessSection() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    const el = document.getElementById("process");
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="process" className="relative py-16 sm:py-28 md:py-36 vault-texture">
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className="text-center mb-16 md:mb-20">
          <p
            className={cn(
              "text-xs tracking-[0.4em] uppercase text-[#C47A1A] mb-4 transition-all duration-700",
              visible ? "opacity-100" : "opacity-0"
            )}
          >
            The 7-Gate Framework
          </p>
          <h2
            className={cn(
              "font-display text-3xl md:text-4xl lg:text-5xl font-light text-white/90 transition-all duration-1000 delay-100",
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}
          >
            Nothing Moves Without Evidence
          </h2>
          <p
            className={cn(
              "mt-5 text-base md:text-lg text-white/40 max-w-xl mx-auto leading-relaxed transition-all duration-700 delay-300",
              visible ? "opacity-100" : "opacity-0"
            )}
          >
            Every asset passes through seven strict, binary decision gates.
            Each must be satisfied with documented proof before the next opens.
          </p>
        </div>

        {/* Gate cards grid */}
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-5">
          {gates.map((gate, i) => (
            <GateCard
              key={gate.title}
              gate={gate}
              index={i}
              area={gridAreas[i]}
              visible={visible}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}

// ── Value Proposition Section ────────────────

function ValueSection() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    const el = document.getElementById("value");
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const pillars = [
    {
      label: "Orchestration",
      text: "We coordinate the specialists \u2014 gemologists, appraisers, custodians, and issuers \u2014 so every function is handled by the best in class.",
    },
    {
      label: "Transparency",
      text: "Oracle-validated evidence trails tie on-chain token behavior directly to independently verified off-chain facts. Nothing is assumed.",
    },
    {
      label: "Protection",
      text: "Structurally conservative valuations, automated mint-gating, and institutional custody protect every stakeholder in the chain.",
    },
  ];

  return (
    <section id="value" className="relative py-16 sm:py-28 md:py-36">
      {/* Subtle top border */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] max-w-4xl h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-6">
        <div className="text-center mb-10 sm:mb-16">
          <h2
            className={cn(
              "font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-white/90 transition-all duration-1000",
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}
          >
            Extraordinary Assets Deserve<br className="hidden md:block" />
            Extraordinary Infrastructure
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {pillars.map((pillar, i) => (
            <div
              key={pillar.label}
              className={cn(
                "transition-all duration-700",
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
              style={{ transitionDelay: `${200 + i * 150}ms` }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={cn("w-1.5 h-1.5 rounded-full", gemColors[i * 2])} />
                <span className="text-xs tracking-[0.3em] uppercase text-white/50">
                  {pillar.label}
                </span>
              </div>
              <p className="text-white/60 leading-relaxed text-[15px]">
                {pillar.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Contact / CTA Section ────────────────────

function ContactSection() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    const el = document.getElementById("contact");
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="contact" className="relative py-20 sm:py-32 md:py-44 vault-texture">
      {/* Top divider */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] max-w-4xl h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <div className="relative z-10 max-w-2xl mx-auto px-5 sm:px-6 text-center">
        <div
          className={cn(
            "transition-all duration-1000",
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <Image
            src="/favicon.png"
            alt="PleoChrome"
            width={56}
            height={56}
            className="mx-auto mb-8 drop-shadow-[0_0_20px_rgba(26,139,122,0.2)]"
          />

          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-white/90 mb-4 sm:mb-5">
            Let&apos;s Build Something<br />Worth Trusting
          </h2>

          <p className="text-white/40 text-sm sm:text-base md:text-lg leading-relaxed mb-8 sm:mb-10 max-w-lg mx-auto">
            If you represent an asset of exceptional provenance — or the infrastructure to verify one — we should talk.
          </p>

          <a
            href="mailto:info@pleochrome.com"
            className="group relative inline-flex items-center gap-2 sm:gap-3 rounded-full px-7 py-3.5 sm:px-10 sm:py-4
              text-xs sm:text-sm tracking-[0.15em] sm:tracking-[0.2em] uppercase font-medium
              bg-gradient-to-r from-[#1A8B7A] to-[#1E3A6E]
              text-white shadow-[0_0_40px_rgba(26,139,122,0.2)]
              hover:shadow-[0_0_60px_rgba(26,139,122,0.35)]
              transition-all duration-500 hover:scale-[1.02]"
          >
            <span>Contact Us</span>
            <svg
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </a>

          <p className="mt-6 text-xs tracking-[0.2em] text-white/20">
            info@pleochrome.com
          </p>
        </div>
      </div>
    </section>
  );
}

// ── Footer ───────────────────────────────────

function Footer() {
  return (
    <footer className="relative py-12 border-t border-white/[0.04]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Image
              src="/logo-white.png"
              alt="PleoChrome"
              width={140}
              height={34}
              className="opacity-40 hover:opacity-60 transition-opacity"
            />
          </div>

          {/* Gem bar */}
          <div className="gem-bar w-28">
            <span className="bg-[#1B6B4A]" />
            <span className="bg-[#1A8B7A]" />
            <span className="bg-[#1E3A6E]" />
            <span className="bg-[#5B2D8E]" />
            <span className="bg-[#A61D3A]" />
            <span className="bg-[#C47A1A]" />
            <span className="bg-[#7BA31E]" />
          </div>

          <div className="flex items-center gap-6 text-xs tracking-wider text-white/25">
            <span>Florida</span>
            <span className="w-px h-3 bg-white/10" />
            <span>&copy; {new Date().getFullYear()} PleoChrome</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ── Main Page ────────────────────────────────

export default function HomePage() {
  return (
    <main className="bg-[#030712] min-h-screen">
      <HeroSection />
      <IntroSection />
      <ProcessSection />
      <ValueSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
