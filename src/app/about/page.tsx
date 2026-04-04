'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Layers, Coins, Landmark, Handshake, ArrowLeftRight } from 'lucide-react'

const team = [
  {
    name: 'Shane Pierson',
    title: 'Chief Executive Officer & Chief Compliance Officer',
    initials: 'SP',
    bio: 'Shane brings over 20 years of experience in banking, capital markets, and SBA lending across FDIC-insured institutions including Pacific Premier Bank, Grasshopper Bank, and CB&T. A published author in the Scotsman Guide and co-founder of the Lords of Lending podcast, Shane has spent his career at the intersection of traditional finance and innovation. He holds a BS in Business & Technology from Stevens Institute of Technology.',
  },
  {
    name: 'David Whiting',
    title: 'Chief Technology Officer & Chief Operating Officer',
    initials: 'DW',
    bio: 'David is a data engineer and statistician with experience at FreightWaves (Inc. 5000 #85), SchoolsFirst Federal Credit Union ($34B AUM), and Discover Financial Services. He holds an MS in Statistics from Texas A&M University and a BS from Utah Valley University. David is a co-author of a peer-reviewed academic publication in Rheumatology and Orthopedic Medicine and is an Eagle Scout.',
  },
  {
    name: 'G. Christopher Ramsey, JD',
    title: 'Chief Revenue Officer',
    initials: 'CR',
    bio: 'Chris is a licensed attorney with over 33 years of legal and business experience spanning corporate law, capital markets, and strategic advisory. He holds a JD from Widener University School of Law and a BA in Psychology from Villanova University. Chris has led business development and legal strategy across multiple ventures and brings deep expertise in deal structuring and investor relations.',
  },
]

const models = [
  { icon: Coins, name: 'Tokenization', color: '#1A8B7A', desc: 'Digital tokens on blockchain with programmable compliance and global settlement' },
  { icon: Layers, name: 'Fractional Securities', color: '#1B6B4A', desc: 'SEC-compliant fractional LLC units through Reg D 506(c) private placements' },
  { icon: Landmark, name: 'Debt Instruments', color: '#1E3A6E', desc: 'Asset-backed lending with UCC Article 9 collateral structures' },
  { icon: Handshake, name: 'Broker Sale', color: '#C47A1A', desc: 'Direct sales through regulated broker-dealer channels and ATS platforms' },
  { icon: ArrowLeftRight, name: 'Barter', color: '#5B2D8E', desc: 'Structured asset-for-asset exchanges with independent valuation' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0A0F1A] text-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-[#0A0F1A]/80 backdrop-blur-md border-b border-white/5">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo-white.png" alt="PleoChrome" width={120} height={32} />
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/about" className="text-xs uppercase tracking-widest text-[#1A8B7A]">About</Link>
          <Link href="/knowledge" className="text-xs uppercase tracking-widest text-white/50 hover:text-white transition-colors">Knowledge</Link>
          <Link href="/login" className="text-xs uppercase tracking-widest text-white/50 hover:text-white transition-colors px-4 py-1.5 border border-white/10 rounded-full">Sign In</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-4 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-[#1A8B7A] mb-4">About PleoChrome</p>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-white/90 max-w-3xl mx-auto leading-tight" style={{ fontFamily: 'var(--font-display, serif)' }}>
          Value from Every Angle
        </h1>
        <p className="text-sm sm:text-base text-white/40 mt-6 max-w-2xl mx-auto leading-relaxed">
          PleoChrome is a real-world asset orchestration platform. We coordinate the specialists, compliance workflows, and financial structures that transform high-value physical assets into investment-grade instruments.
        </p>
      </section>

      {/* The Problem */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xs uppercase tracking-[0.2em] text-white/30 mb-6">The Problem We Solve</h2>
          <div className="space-y-4 text-sm text-white/60 leading-relaxed">
            <p>
              The global market for high-value physical assets is enormous. Gemstones alone represent a $34 billion annual market. Add real estate, precious metals, mineral rights, and fine art, and you are looking at trillions in asset value sitting in vaults, safety deposit boxes, and private collections.
            </p>
            <p>
              The problem is that these assets are effectively frozen capital. Selling a $10 million emerald lot is not like selling shares of stock. There is no exchange, no ticker symbol, no instant liquidity. Owners who need capital must navigate fragmented dealer networks, opaque pricing, and a buyer pool measured in dozens rather than thousands.
            </p>
            <p>
              PleoChrome exists to solve this problem. We are the operational backbone that connects every specialist needed to convert a physical asset into a financial product. Think of us as the general contractor for asset monetization. We do not own the assets, hold investor funds, or provide investment advice. We orchestrate the process.
            </p>
          </div>
        </div>
      </section>

      {/* Five Paths */}
      <section className="py-16 px-4 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xs uppercase tracking-[0.2em] text-white/30 mb-8 text-center">Five Paths to Value</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {models.map(m => {
              const Icon = m.icon
              return (
                <Link key={m.name} href={`/knowledge/${m.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="group p-4 rounded-xl border border-white/8 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/15 transition-all text-center">
                  <div className="w-10 h-10 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ background: `${m.color}20`, border: `1px solid ${m.color}40` }}>
                    <Icon size={18} style={{ color: m.color }} />
                  </div>
                  <p className="text-xs font-semibold text-white/90">{m.name}</p>
                  <p className="text-[10px] text-white/40 mt-1 leading-relaxed">{m.desc}</p>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 px-4 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xs uppercase tracking-[0.2em] text-white/30 mb-8 text-center">The Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {team.map(t => (
              <div key={t.name} className="p-6 rounded-xl border border-white/8 bg-white/[0.02]">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#1A8B7A]/30 to-[#1E3A6E]/30 border border-white/10 flex items-center justify-center text-sm font-bold text-white/70 mb-4">
                  {t.initials}
                </div>
                <h3 className="text-sm font-semibold text-white/90">{t.name}</h3>
                <p className="text-[10px] uppercase tracking-wider text-[#1A8B7A] mt-0.5">{t.title}</p>
                <p className="text-xs text-white/50 mt-3 leading-relaxed">{t.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="border-t border-white/5 py-8 px-4 text-center">
        <Image src="/logo-white.png" alt="PleoChrome" width={100} height={26} className="mx-auto opacity-30" />
        <p className="text-[10px] text-white/15 mt-4">PleoChrome &bull; Value from Every Angle &bull; Fitech Venture LLC</p>
      </div>
    </div>
  )
}
