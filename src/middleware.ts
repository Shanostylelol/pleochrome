import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip auth check in development mode
  if (process.env.NEXT_PUBLIC_ENV === 'development') {
    return NextResponse.next()
  }

  // Create Supabase client with request/response cookie handling
  let response = NextResponse.next({ request })
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session (important — keeps session alive)
  const { data: { user } } = await supabase.auth.getUser()

  // Protect /crm routes — redirect to login if not authenticated
  if (pathname.startsWith('/crm') && !pathname.startsWith('/crm/login')) {
    if (!user) {
      const loginUrl = new URL('/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Redirect authenticated users away from login page
  if (pathname === '/login' && user) {
    return NextResponse.redirect(new URL('/crm', request.url))
  }

  return response
}

export const config = {
  matcher: ['/crm/:path*', '/login'],
}
