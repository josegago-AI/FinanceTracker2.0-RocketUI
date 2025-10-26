// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Full read/write server client.
 * Safe for server actions or route handlers (request scope only).
 */
export function createClient() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )
}

/**
 * Read-only client for Server Components.
 * Reads cookies safely without writing.
 */
export function createReadOnlyClient() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll() {
          // no-op — RSC-safe
        },
      },
    }
  )
}

/** Helper to fetch current user (RSC-safe) */
export async function getSessionUser() {
  const sb = createReadOnlyClient()
  const { data: { user } } = await sb.auth.getUser()
  return user ?? null
}
