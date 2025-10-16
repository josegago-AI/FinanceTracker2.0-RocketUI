import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

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

export async function getSessionUser() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  return user
}