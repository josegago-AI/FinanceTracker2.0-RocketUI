// lib/supabase/service.ts
import { createClient } from '@supabase/supabase-js'

// Server-only: requires SUPABASE_SERVICE_ROLE_KEY
export function supabaseService() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
