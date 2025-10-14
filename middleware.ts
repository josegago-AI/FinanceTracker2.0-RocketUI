import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/ssr'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // ✅ This helper automatically reads the Supabase URL and KEY
  // from environment variables internally — you do NOT need process.env here.
  const supabase = createMiddlewareClient({ req, res })

  // Refreshes the session if necessary
  await supabase.auth.getSession()

  return res
}

// Protect your authenticated routes
export const config = {
  matcher: ['/dashboard/:path*', '/transactions/:path*'],
}
