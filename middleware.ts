// /middleware.ts
import { NextResponse, NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(req: NextRequest) {
  // Important: clone headers for the next response
  const res = NextResponse.next({
    request: { headers: req.headers },
  })

  // Create a Supabase server client that can read & write cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => req.cookies.get(name)?.value,
        set: (name: string, value: string, options: any) => {
          res.cookies.set({ name, value, ...options })
        },
        remove: (name: string, options: any) => {
          res.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // 👇 This call ensures auth cookies get refreshed/written to the response if needed
  await supabase.auth.getSession()

  return res
}

// Apply to all routes except static assets
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
