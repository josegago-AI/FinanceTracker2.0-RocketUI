'use client'

import { createBrowserClient } from '@supabase/ssr'

export function supabaseBrowser() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anon) {
    throw new Error(
      '❌ Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY.'
    )
  }

  // 👇 THIS is the console breadcrumb — it runs once when the client is first created
  if (typeof window !== 'undefined' && !(window as any).__sb_init__) {
    ;(window as any).__sb_init__ = true
    console.log('[supabaseBrowser] init — client created')
  }

  // ✅ create and return the browser client with proper session behavior
  return createBrowserClient(url, anon, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  })
}
