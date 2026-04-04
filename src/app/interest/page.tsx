'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Layers, Coins, Landmark, Handshake, ArrowLeftRight, ArrowRight, CheckCircle } from 'lucide-react'
import { trpc } from '@/lib/trpc'
import { SiteFooter } from '@/components/landing/SiteFooter'
import { MobileNav } from '@/components/landing/MobileNav'

const models = [
  { slug: 'tokenization', name: 'Tokenization', icon: Coins, color: '#1A8B7A', desc: 'Digital tokens on blockchain' },
  { slug: 'fractional', name: 'Fractional Securities', icon: Layers, color: '#1B6B4A', desc: 'SEC-compliant fractional shares' },
  { slug: 'debt', name: 'Debt Instruments', icon: Landmark, color: '#1E3A6E', desc: 'Asset-backed lending' },
  { slug: 'broker-sale', name: 'Broker Sale', icon: Handshake, color: '#C47A1A', desc: 'Direct regulated sale' },
  { slug: 'barter', name: 'Barter Exchange', icon: ArrowLeftRight, color: '#5B2D8E', desc: 'Asset-for-asset exchange' },
]

const investorTypes = [
  { value: 'individual', label: 'Individual Investor' },
  { value: 'family_office', label: 'Family Office' },
  { value: 'fund_institution', label: 'Fund / Institution' },
  { value: 'advisor_consultant', label: 'Advisor / Consultant' },
  { value: 'other', label: 'Other' },
]

const accreditedOptions = [
  { value: 'self_certified_accredited', label: 'I am an accredited investor' },
  { value: 'not_accredited', label: 'I am not accredited' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' },
]

const investmentRanges = [
  { value: 'under_100k', label: 'Under $100,000' },
  { value: '100k_500k', label: '$100,000 - $500,000' },
  { value: '500k_1m', label: '$500,000 - $1,000,000' },
  { value: '1m_5m', label: '$1,000,000 - $5,000,000' },
  { value: '5m_plus', label: '$5,000,000+' },
]

const assetOptions = ['Gemstones', 'Real Estate', 'Precious Metals', 'Mineral Rights', 'Other']

export default function InterestPage() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    fullName: '', email: '', entity: '',
    investorType: '' as string, accreditedStatus: '' as string,
    assetInterests: [] as string[], investmentRange: '' as string,
    referralSource: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const submitMut = trpc.interest.submit.useMutation({
    onSuccess: () => setSubmitted(true),
    onError: (err) => setErrors({ submit: err.message }),
  })

  function toggleAsset(asset: string) {
    setForm(prev => ({
      ...prev,
      assetInterests: prev.assetInterests.includes(asset)
        ? prev.assetInterests.filter(a => a !== asset)
        : [...prev.assetInterests, asset]
    }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const newErrors: Record<string, string> = {}
    if (!form.fullName.trim()) newErrors.fullName = 'Name is required'
    if (!form.email.trim() || !form.email.includes('@')) newErrors.email = 'Valid email is required'
    if (!form.investorType) newErrors.investorType = 'Please select your investor type'
    if (!form.accreditedStatus) newErrors.accreditedStatus = 'Please select your accreditation status'
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return }
    setErrors({})
    submitMut.mutate({
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      entity: form.entity.trim() || undefined,
      investorType: form.investorType as 'individual' | 'family_office' | 'fund_institution' | 'advisor_consultant' | 'other',
      accreditedStatus: form.accreditedStatus as 'self_certified_accredited' | 'not_accredited' | 'prefer_not_to_say',
      assetInterests: form.assetInterests.length > 0 ? form.assetInterests : undefined,
      investmentRange: form.investmentRange as '' | 'under_100k' | '100k_500k' | '500k_1m' | '1m_5m' | '5m_plus' || undefined,
      referralSource: form.referralSource.trim() || undefined,
    })
  }

  const inputClass = "w-full h-11 px-4 rounded-lg bg-white/[0.04] border border-white/10 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[#1A8B7A] transition-colors"
  const selectClass = "w-full h-11 px-4 rounded-lg bg-white/[0.04] border border-white/10 text-sm text-white focus:outline-none focus:border-[#1A8B7A] transition-colors appearance-none"
  const labelClass = "block text-xs uppercase tracking-wider text-white/40 mb-1.5"

  return (
    <div className="min-h-screen bg-[#0A0F1A] text-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-[#0A0F1A]/80 backdrop-blur-md border-b border-white/5">
        <Link href="/"><Image src="/logo-white.png" alt="PleoChrome" width={120} height={32} /></Link>
        <div className="flex items-center gap-4">
          <Link href="/about" className="hidden sm:inline text-xs uppercase tracking-widest text-white/50 hover:text-white transition-colors">About</Link>
          <Link href="/knowledge" className="hidden sm:inline text-xs uppercase tracking-widest text-white/50 hover:text-white transition-colors">Knowledge</Link>
          <Link href="/login" className="hidden sm:inline-flex text-xs uppercase tracking-widest text-white/50 hover:text-white transition-colors px-4 py-1.5 border border-white/10 rounded-full">Sign In</Link>
          <MobileNav />
        </div>
      </nav>

      <div className="pt-28 pb-20 px-4">
        <div className="max-w-2xl mx-auto">

          {submitted ? (
            /* Success state */
            <div className="text-center py-20">
              <CheckCircle className="h-16 w-16 text-[#1A8B7A] mx-auto mb-6" />
              <h1 className="text-2xl font-light text-white/90 mb-3" style={{ fontFamily: 'var(--font-display, serif)' }}>Thank you for your interest</h1>
              <p className="text-sm text-white/50 mb-8 max-w-md mx-auto">
                We have received your information. Our team will be in touch to share relevant research and updates as our platform develops.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/knowledge" className="text-sm text-[#1A8B7A] hover:text-white transition-colors flex items-center gap-1">
                  Explore the Knowledge Hub <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Hero */}
              <div className="text-center mb-12">
                <p className="text-xs uppercase tracking-[0.3em] text-[#1A8B7A] mb-4">Investor Interest</p>
                <h1 className="text-2xl sm:text-3xl font-light text-white/90 leading-tight mb-4" style={{ fontFamily: 'var(--font-display, serif)' }}>
                  Exploring Value Creation for High-Value Assets
                </h1>
                <p className="text-sm text-white/40 max-w-lg mx-auto leading-relaxed">
                  PleoChrome is building the operational infrastructure to help asset holders unlock value through multiple regulated pathways. We are not currently offering any securities. This page is for educational purposes and to register your interest in learning more.
                </p>
              </div>

              {/* Value Models */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-12">
                {models.map(m => {
                  const Icon = m.icon
                  return (
                    <Link key={m.slug} href={`/knowledge/${m.slug}`}
                      className="group p-3 rounded-lg border border-white/5 bg-white/[0.02] hover:border-white/10 transition-all text-center">
                      <Icon size={16} className="mx-auto mb-1.5" style={{ color: m.color }} />
                      <p className="text-[10px] font-medium text-white/70 group-hover:text-white transition-colors">{m.name}</p>
                    </Link>
                  )
                })}
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <h2 className="text-sm font-semibold text-white/70 mb-4">Register Your Interest</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Full Name *</label>
                    <input type="text" value={form.fullName} onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))}
                      placeholder="Your full name" className={inputClass} />
                    {errors.fullName && <p className="text-xs text-red-400 mt-1">{errors.fullName}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Email *</label>
                    <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                      placeholder="you@example.com" className={inputClass} />
                    {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Entity Name (if applicable)</label>
                  <input type="text" value={form.entity} onChange={e => setForm(p => ({ ...p, entity: e.target.value }))}
                    placeholder="Company, family office, or fund name" className={inputClass} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Investor Type *</label>
                    <select value={form.investorType} onChange={e => setForm(p => ({ ...p, investorType: e.target.value }))} className={selectClass}>
                      <option value="" className="bg-[#0A0F1A]">Select...</option>
                      {investorTypes.map(t => <option key={t.value} value={t.value} className="bg-[#0A0F1A]">{t.label}</option>)}
                    </select>
                    {errors.investorType && <p className="text-xs text-red-400 mt-1">{errors.investorType}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Accreditation Status *</label>
                    <select value={form.accreditedStatus} onChange={e => setForm(p => ({ ...p, accreditedStatus: e.target.value }))} className={selectClass}>
                      <option value="" className="bg-[#0A0F1A]">Select...</option>
                      {accreditedOptions.map(t => <option key={t.value} value={t.value} className="bg-[#0A0F1A]">{t.label}</option>)}
                    </select>
                    {errors.accreditedStatus && <p className="text-xs text-red-400 mt-1">{errors.accreditedStatus}</p>}
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Asset Classes of Interest</label>
                  <div className="flex flex-wrap gap-2">
                    {assetOptions.map(asset => (
                      <button key={asset} type="button" onClick={() => toggleAsset(asset)}
                        className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                          form.assetInterests.includes(asset)
                            ? 'border-[#1A8B7A] bg-[#1A8B7A]/10 text-[#1A8B7A]'
                            : 'border-white/10 text-white/40 hover:border-white/20'
                        }`}>
                        {asset}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Investment Range (optional)</label>
                  <select value={form.investmentRange} onChange={e => setForm(p => ({ ...p, investmentRange: e.target.value }))} className={selectClass}>
                    <option value="" className="bg-[#0A0F1A]">Prefer not to say</option>
                    {investmentRanges.map(r => <option key={r.value} value={r.value} className="bg-[#0A0F1A]">{r.label}</option>)}
                  </select>
                </div>

                <div>
                  <label className={labelClass}>How did you hear about PleoChrome?</label>
                  <input type="text" value={form.referralSource} onChange={e => setForm(p => ({ ...p, referralSource: e.target.value }))}
                    placeholder="LinkedIn, referral, conference, etc." className={inputClass} />
                </div>

                {errors.submit && <p className="text-sm text-red-400">{errors.submit}</p>}

                <button type="submit" disabled={submitMut.isPending}
                  className="w-full h-12 rounded-lg text-sm font-medium text-white transition-all disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #1A8B7A, #1B6B4A)', boxShadow: '0 4px 12px rgba(26, 139, 122, 0.3)' }}>
                  {submitMut.isPending ? 'Submitting...' : 'Register Interest'}
                </button>
              </form>

              {/* Disclaimer */}
              <div className="mt-8 p-4 rounded-lg bg-white/[0.02] border border-white/5">
                <p className="text-[10px] text-white/25 leading-relaxed">
                  No securities are being offered or sold. No money or other consideration is being solicited, and if sent in response, will not be accepted. This page is for informational purposes only and does not constitute an offer to sell or a solicitation to buy any securities. Completing this form does not create any obligation or commitment of any kind. PleoChrome is an asset orchestration platform and does not provide investment advice, broker securities, or hold client assets.
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      <SiteFooter />
    </div>
  )
}
