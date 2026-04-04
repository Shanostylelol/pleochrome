'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import RadialOrbitalTimeline, { type TimelineItem } from '@/components/ui/radial-orbital-timeline'
import { ORBITAL_TIMELINE_DATA, VALUE_MODEL_ARTICLES } from '@/lib/knowledge-data'

export default function KnowledgePage() {
  const router = useRouter()

  const handleNodeClick = (item: TimelineItem) => {
    if (item.href) router.push(item.href)
  }

  return (
    <div className="min-h-screen bg-[#0A0F1A] text-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-[#0A0F1A]/80 backdrop-blur-md border-b border-white/5">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo-white.png" alt="PleoChrome" width={120} height={32} />
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/about" className="text-xs uppercase tracking-widest text-white/50 hover:text-white transition-colors">About</Link>
          <Link href="/knowledge" className="text-xs uppercase tracking-widest text-[#1A8B7A]">Knowledge</Link>
          <Link href="/login" className="text-xs uppercase tracking-widest text-white/50 hover:text-white transition-colors px-4 py-1.5 border border-white/10 rounded-full">Sign In</Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="pt-32 pb-8 text-center px-4">
        <p className="text-xs uppercase tracking-[0.3em] text-[#1A8B7A] mb-4">Knowledge Hub</p>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-white/90 max-w-3xl mx-auto leading-tight" style={{ fontFamily: 'var(--font-display, serif)' }}>
          Five Paths to Value Creation
        </h1>
        <p className="text-sm sm:text-base text-white/40 mt-4 max-w-xl mx-auto">
          Deep analysis of each value creation model — grounded in academic research, regulatory frameworks, and real-world market data.
        </p>
      </div>

      {/* Orbital Timeline */}
      <div className="py-8">
        <RadialOrbitalTimeline timelineData={ORBITAL_TIMELINE_DATA} onNodeClick={handleNodeClick} />
      </div>

      {/* Article Cards */}
      <div className="max-w-5xl mx-auto px-4 pb-20">
        <h2 className="text-sm uppercase tracking-[0.2em] text-white/30 mb-8 text-center">Research & Analysis</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {VALUE_MODEL_ARTICLES.map((article) => (
            <Link key={article.slug} href={`/knowledge/${article.slug}`}
              className="group p-5 rounded-xl border border-white/8 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/15 transition-all duration-300">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full" style={{ background: article.modelColor }} />
                <span className="text-[10px] uppercase tracking-widest text-white/40">{article.model}</span>
                <span className="text-[10px] text-white/20 ml-auto">{article.readTime}</span>
              </div>
              <h3 className="text-sm font-semibold text-white/90 group-hover:text-white transition-colors leading-snug">{article.title}</h3>
              <p className="text-xs text-white/40 mt-2 line-clamp-3">{article.excerpt}</p>
              <div className="flex items-center gap-1 mt-4 text-[11px] text-[#1A8B7A] opacity-0 group-hover:opacity-100 transition-opacity">
                Read Analysis <ArrowRight size={12} />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="border-t border-white/5 py-8 px-4">
        <p className="text-[10px] text-white/20 max-w-3xl mx-auto text-center leading-relaxed">
          The content on this page is for informational and educational purposes only. It does not constitute investment advice, an offer to sell, or a solicitation to buy any securities. All investments involve risk. Past performance is not indicative of future results. Consult with qualified legal and financial advisors before making investment decisions.
        </p>
        <p className="text-[10px] text-white/15 text-center mt-2">PleoChrome — Value from Every Angle</p>
      </div>
    </div>
  )
}
