'use client'

import Image from 'next/image'
import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer className="relative py-12 border-t border-white/[0.04] bg-[#0A0F1A]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/">
            <Image src="/logo-white.png" alt="PleoChrome" width={140} height={34}
              className="opacity-40 hover:opacity-60 transition-opacity" />
          </Link>
          <div className="gem-bar w-28">
            <span className="bg-[#1B6B4A]" /><span className="bg-[#1A8B7A]" /><span className="bg-[#1E3A6E]" />
            <span className="bg-[#5B2D8E]" /><span className="bg-[#A61D3A]" /><span className="bg-[#C47A1A]" /><span className="bg-[#7BA31E]" />
          </div>
          <div className="flex items-center gap-6 text-xs tracking-wider text-white/25">
            <Link href="/about" className="hover:text-white/50 transition-colors">About</Link>
            <Link href="/knowledge" className="hover:text-white/50 transition-colors">Knowledge</Link>
            <span className="w-px h-3 bg-white/10" />
            <span>&copy; {new Date().getFullYear()} PleoChrome</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
