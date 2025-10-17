import 'server-only'
import { cookies } from 'next/headers'

import { isAuthDisabled } from '@/lib/config/flags'

export async function getSupabaseClient() {
  if (isAuthDisabled()) {
    const { supabaseAdmin } = await import('@/lib/supabase/admin')
    return supabaseAdmin()
  } else {
    const { createClient } = await import('@/lib/supabase/server')
    const cookieStore = cookies()
    return createClient(cookieStore)
  }
}

export async function getUserId() {
  if (isAuthDisabled) {
    const { supabaseAdmin } = await import('@/lib/supabase/admin')
    const supabase = supabaseAdmin()
    const { data: profiles } = await supabase.from('profiles').select('id').limit(1).single()
    return profiles?.id || null
  } else {
    const { createClient } = await import('@/lib/supabase/server')
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    const { data: { user } } = await supabase.auth.getUser()
    return user?.id || null
  }
}
