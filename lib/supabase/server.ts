import { createServerClient } from '@supabase/ssr'

export function createClient(cookieStore: ReturnType<typeof import('next/headers').cookies>) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string)       { return cookieStore.get(name)?.value },
        set(name, value, opts)  { cookieStore.set({ name, value, ...opts }) },
        remove(name, opts)      { cookieStore.set({ name, value: '', ...opts }) },
      },
    }
  )
}