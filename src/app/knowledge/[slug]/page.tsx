'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Clock, User, ExternalLink } from 'lucide-react'
import { VALUE_MODEL_ARTICLES } from '@/lib/knowledge-data'

export default function ArticlePage() {
  const params = useParams<{ slug: string }>()
  const article = VALUE_MODEL_ARTICLES.find(a => a.slug === params.slug)

  if (!article) {
    return (
      <div className="min-h-screen bg-[#0A0F1A] flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/50">Article not found</p>
          <Link href="/knowledge" className="text-[#1A8B7A] text-sm mt-2 inline-block">Back to Knowledge Hub</Link>
        </div>
      </div>
    )
  }

  const related = VALUE_MODEL_ARTICLES.filter(a => a.slug !== article.slug).slice(0, 2)

  // Convert markdown-style content to HTML-like rendering
  const renderContent = (content: string) => {
    return content.split('\n\n').map((block, i) => {
      if (block.startsWith('## ')) {
        return <h2 key={i} className="text-xl sm:text-2xl font-semibold text-white/95 mt-10 mb-4" style={{ fontFamily: 'var(--font-display, serif)' }}>{block.replace('## ', '')}</h2>
      }
      if (block.startsWith('**') && block.endsWith('**')) {
        return <p key={i} className="text-sm font-semibold text-white/80 mt-4 mb-1">{block.replace(/\*\*/g, '')}</p>
      }
      if (block.startsWith('**')) {
        const parts = block.split('**')
        return (
          <p key={i} className="text-sm text-white/60 leading-relaxed mb-3">
            {parts.map((part, j) => j % 2 === 1 ? <strong key={j} className="text-white/80">{part}</strong> : part)}
          </p>
        )
      }
      return <p key={i} className="text-sm text-white/60 leading-relaxed mb-3">{block}</p>
    })
  }

  return (
    <div className="min-h-screen bg-[#0A0F1A] text-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-[#0A0F1A]/80 backdrop-blur-md border-b border-white/5">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo-white.png" alt="PleoChrome" width={120} height={32} />
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/about" className="text-xs uppercase tracking-widest text-white/50 hover:text-white transition-colors hidden sm:inline">About</Link>
          <Link href="/knowledge" className="text-xs uppercase tracking-widest text-white/50 hover:text-white transition-colors">Knowledge</Link>
          <Link href="/login" className="text-xs uppercase tracking-widest text-white/50 hover:text-white transition-colors px-4 py-1.5 border border-white/10 rounded-full">Sign In</Link>
        </div>
      </nav>

      {/* Article */}
      <article className="pt-24 pb-20 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Back link */}
          <Link href="/knowledge" className="inline-flex items-center gap-1.5 text-xs text-[#1A8B7A] hover:text-white transition-colors mb-8">
            <ArrowLeft size={14} /> Knowledge Hub
          </Link>

          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: article.modelColor }} />
              <span className="text-xs uppercase tracking-[0.2em] text-white/40">{article.model}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light text-white/95 leading-tight" style={{ fontFamily: 'var(--font-display, serif)' }}>
              {article.title}
            </h1>
            <p className="text-sm text-white/40 mt-3">{article.subtitle}</p>

            {/* Meta */}
            <div className="flex items-center gap-4 mt-6 pt-6 border-t border-white/8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#1A8B7A]/20 flex items-center justify-center text-[10px] font-bold text-[#1A8B7A]">SP</div>
                <div>
                  <p className="text-xs font-medium text-white/70">{article.author}</p>
                  <p className="text-[10px] text-white/30">CEO, PleoChrome</p>
                </div>
              </div>
              <span className="text-[10px] text-white/20">|</span>
              <span className="text-[10px] text-white/30 flex items-center gap-1"><Clock size={10} />{article.readTime}</span>
              <span className="text-[10px] text-white/30">{article.date}</span>
            </div>
          </div>

          {/* Content */}
          <div className="article-content">
            {renderContent(article.content)}
          </div>

          {/* Sources */}
          <div className="mt-12 pt-8 border-t border-white/8">
            <h3 className="text-xs uppercase tracking-[0.2em] text-white/30 mb-4">Sources & References</h3>
            <ol className="space-y-2">
              {article.sources.map((src, i) => (
                <li key={i} className="text-xs text-white/40 flex items-start gap-2">
                  <span className="text-white/20 shrink-0">{i + 1}.</span>
                  <a href={src.url} target="_blank" rel="noreferrer" className="hover:text-[#1A8B7A] transition-colors flex items-start gap-1">
                    {src.label} <ExternalLink size={10} className="shrink-0 mt-0.5" />
                  </a>
                </li>
              ))}
            </ol>
          </div>

          {/* Disclaimer */}
          <div className="mt-8 p-4 rounded-lg bg-white/[0.02] border border-white/5">
            <p className="text-[10px] text-white/25 leading-relaxed">
              This article represents the analysis and opinions of the author and does not constitute investment advice, an offer to sell, or a solicitation of an offer to buy any securities. Past performance is not indicative of future results. All investments involve risk, including the possible loss of principal. Consult with qualified legal and financial advisors before making investment decisions.
            </p>
          </div>

          {/* Related */}
          <div className="mt-12">
            <h3 className="text-xs uppercase tracking-[0.2em] text-white/30 mb-4">Related Analysis</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {related.map(r => (
                <Link key={r.slug} href={`/knowledge/${r.slug}`}
                  className="p-4 rounded-lg border border-white/8 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/15 transition-all group">
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: r.modelColor }} />
                    <span className="text-[10px] uppercase tracking-widest text-white/30">{r.model}</span>
                  </div>
                  <p className="text-xs font-medium text-white/70 group-hover:text-white transition-colors">{r.title}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </article>
    </div>
  )
}
