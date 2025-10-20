import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient(cookieStore: ReturnType<typeof import('next/headers').cookies>) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string)      { return cookieStore.get(name)?.value },
        set(name, value, opts) { cookieStore.set({ name, value, ...opts }) }, // OK in actions/routes
        remove(name, opts)     { cookieStore.set({ name, value: '', ...opts }) },
      },
    }
  )
}

// ↓ NEW: use this from Server Components / DAL read paths
export function createReadOnlyClient() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll() { /* no-op in RSC render to avoid cookie writes */ },
      },
    }
  )
}

export async function getSessionUser() {
  const sb = createReadOnlyClient()
  const { data: { user } } = await sb.auth.getUser()
  return user ?? null
}
