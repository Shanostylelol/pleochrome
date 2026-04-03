'use client'

import { useState } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleGoogleLogin() {
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: { hd: 'pleochrome.com' },
      },
    })
    if (authError) {
      setError(authError.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0F1A] px-4">
      <div className="w-full max-w-sm space-y-8 text-center">
        {/* Logo */}
        <div className="flex flex-col items-center gap-4">
          <Image src="/logo-white.png" alt="PleoChrome" width={180} height={48} priority />
          <p className="text-sm text-[#8892A4] tracking-wide">Powerhouse CRM</p>
        </div>

        {/* Sign in card */}
        <div className="rounded-2xl p-8 space-y-6"
          style={{
            background: '#141B2D',
            boxShadow: '8px 8px 16px #0a0e18, -8px -8px 16px #1e2842',
          }}>
          <div>
            <h1 className="text-xl font-semibold text-white" style={{ fontFamily: 'var(--font-display, serif)' }}>
              Welcome back
            </h1>
            <p className="text-sm text-[#8892A4] mt-1">Sign in with your PleoChrome account</p>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white transition-all duration-200 disabled:opacity-60"
            style={{
              background: 'linear-gradient(135deg, #1A8B7A, #1B6B4A)',
              boxShadow: loading ? 'none' : '0 4px 12px rgba(26, 139, 122, 0.3)',
            }}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <svg width="20" height="20" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
                <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
                <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
                <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
              </svg>
            )}
            {loading ? 'Signing in...' : 'Continue with Google'}
          </button>

          {error && (
            <p className="text-sm text-[#A61D3A]">{error}</p>
          )}

          <p className="text-xs text-[#5A6478]">
            Restricted to @pleochrome.com accounts
          </p>
        </div>

        <p className="text-xs text-[#3D4555]">
          PleoChrome &mdash; Value from Every Angle
        </p>
      </div>
    </div>
  )
}
