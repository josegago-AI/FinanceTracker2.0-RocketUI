'use server'

import { createClient } from '@/lib/supabase/server'
import { getUserId } from '@/lib/auth/getUserId'

export async function getBudgets() {
  const supabase = createClient()
  const userId = await getUserId()
  if (!userId) return []

  const { data, error } = await supabase
    .from('budgets')
    .select('id, category_id, amount, month, year, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching budgets:', error)
    return []
  }

  return data
}

export async function createBudget(budget: {
  category_id: string
  amount: number
  month: string
  year: number
}) {
  const supabase = createClient()
  const userId = await getUserId()
  if (!userId) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('budgets')
    .insert([{ ...budget, user_id: userId }])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateBudget(id: string, updates: Partial<{ category_id: string; amount: number; month: string; year: number }>) {
  const supabase = createClient()
  const userId = await getUserId()
  if (!userId) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('budgets')
    .update(updates)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteBudget(id: string) {
  const supabase = createClient()
  const userId = await getUserId()
  if (!userId) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('budgets')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)

  if (error) throw error
  return true
}
