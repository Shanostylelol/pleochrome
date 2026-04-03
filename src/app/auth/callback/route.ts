import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { createAdminClient } from '@/lib/supabase-server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=no_code`)
  }

  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setAll(cookiesToSet: any[]) {
          cookiesToSet.forEach(({ name, value, options }: { name: string; value: string; options: Record<string, unknown> }) => {
            cookieStore.set(name, value, options as Parameters<typeof cookieStore.set>[2])
          })
        },
      },
    }
  )

  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

  if (exchangeError) {
    return NextResponse.redirect(`${origin}/login?error=exchange_failed`)
  }

  // Get the authenticated user
  const { data: { user: authUser } } = await supabase.auth.getUser()

  if (!authUser?.email) {
    return NextResponse.redirect(`${origin}/login?error=no_email`)
  }

  // Enforce @pleochrome.com domain
  if (!authUser.email.endsWith('@pleochrome.com')) {
    await supabase.auth.signOut()
    return NextResponse.redirect(`${origin}/login?error=domain_restricted`)
  }

  // Auto-link: match email to team_members and set auth_user_id
  const admin = createAdminClient()
  const { data: teamMember } = await admin
    .from('team_members')
    .select('id, auth_user_id')
    .eq('email', authUser.email)
    .eq('is_active', true)
    .single()

  if (!teamMember) {
    await supabase.auth.signOut()
    return NextResponse.redirect(`${origin}/login?error=not_team_member`)
  }

  // Link auth_user_id if not already set
  if (!teamMember.auth_user_id) {
    await admin
      .from('team_members')
      .update({ auth_user_id: authUser.id })
      .eq('id', teamMember.id)
  }

  return NextResponse.redirect(`${origin}/crm`)
}
