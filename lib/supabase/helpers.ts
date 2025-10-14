import 'server-only'

import { isAuthDisabled } from '@/lib/config/flags'

export async function getSupabaseClient() {
  if (isAuthDisabled) {
    const { supabaseAdmin } = await import('@/lib/supabase/admin')
    return supabaseAdmin()
  } else {
    const { createClient } = await import('@/lib/supabase/server')
    return createClient()
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
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    return user?.id || null
  }
}
