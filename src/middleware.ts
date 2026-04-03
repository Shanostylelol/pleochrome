import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  const { pathname, host } = request.nextUrl

  // Redirect www to non-www (prevents cookie domain mismatches)
  if (host.startsWith('www.')) {
    const url = request.nextUrl.clone()
    url.host = host.replace('www.', '')
    return NextResponse.redirect(url, 301)
  }

  // Skip auth check in development mode
  if (process.env.NEXT_PUBLIC_ENV === 'development') {
    return NextResponse.next()
  }

  // If Supabase isn't configured, allow access (graceful degradation)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.next()
  }

  let response = NextResponse.next({ request })

  try {
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setAll(cookiesToSet: any[]) {
          cookiesToSet.forEach(({ name, value }: { name: string; value: string }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }: { name: string; value: string; options: Record<string, unknown> }) =>
            response.cookies.set(name, value, options as Parameters<typeof response.cookies.set>[2])
          )
        },
      },
    })

    const { data: { user } } = await supabase.auth.getUser()

    // Protect /crm routes
    if (pathname.startsWith('/crm')) {
      if (!user) {
        return NextResponse.redirect(new URL('/login', request.url))
      }
    }

    // Redirect authenticated users away from login
    if (pathname === '/login' && user) {
      return NextResponse.redirect(new URL('/crm', request.url))
    }
  } catch {
    // If auth check fails, allow access to login page, block CRM
    if (pathname.startsWith('/crm')) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon\\.png|icons|partners|screenshots|logo).*)', '/crm/:path*', '/login'],
}
