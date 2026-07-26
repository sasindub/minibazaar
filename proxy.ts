import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { ADMIN_COOKIE, verifySessionToken } from '@/lib/auth'

// Next.js 16: Middleware is now "proxy". Protects the admin area.
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // The login page itself must stay public.
  if (pathname === '/admin/login') {
    // If already logged in, bounce to the dashboard.
    const token = request.cookies.get(ADMIN_COOKIE)?.value
    if (await verifySessionToken(token)) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
    return NextResponse.next()
  }

  // Everything else under /admin requires a valid session.
  const token = request.cookies.get(ADMIN_COOKIE)?.value
  const user = await verifySessionToken(token)
  if (!user) {
    const loginUrl = new URL('/admin/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
