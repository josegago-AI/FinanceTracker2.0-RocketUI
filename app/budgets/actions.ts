// app/budgets/actions.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getBudgets() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('budgets')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data ?? []
}

export async function insertBudget(formData: FormData) {
  const supabase = createClient()
  const name = formData.get('name') as string
  const category = formData.get('category') as string
  const limit = Number(formData.get('limit'))
  const month = formData.get('month') as string
  const year = Number(formData.get('year'))

  const { error } = await supabase
    .from('budgets')
    .insert([{ name, category, limit, month, year }])

  if (error) throw new Error(error.message)

  revalidatePath('/budgets')
}

export async function deleteBudget(id: string) {
  const supabase = createClient()
  const { error } = await supabase.from('budgets').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/budgets')
}
