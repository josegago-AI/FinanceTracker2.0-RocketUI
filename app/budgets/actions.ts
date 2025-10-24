import { createClient } from '@/lib/supabase/server'

export async function getBudgets() {
  const supabase = createClient()
  const { data } = await supabase
    .from('budgets')
    .select('id, name, category, limit, spent, month, year')
    .order('created_at', { ascending: false })
  return data ?? []
}
