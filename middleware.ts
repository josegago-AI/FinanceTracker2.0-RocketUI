import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const authDisabled = process.env.AUTH_DISABLED === 'true'

  if (authDisabled) {
    return NextResponse.next()
  }

  const protectedPaths = ['/dashboard', '/accounts', '/transactions', '/categories', '/budgets', '/settings']
  const pathname = request.nextUrl.pathname

  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path))

  if (isProtectedPath) {
    const authToken = request.cookies.get('supabase-auth-token')

    if (!authToken) {
      const signInUrl = new URL('/auth/signin', request.url)
      signInUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(signInUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/accounts/:path*',
    '/transactions/:path*',
    '/categories/:path*',
    '/budgets/:path*',
    '/settings/:path*'
  ]
}
