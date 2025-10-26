'use server'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function addTransaction(values: {
  payee: string
  amount: number        // positive = income, negative = expense
  category: string
  date: string
  notes?: string
}) {
  const sb = createClient()
  const { data: user } = await sb.auth.getUser()
  if (!user.user) throw new Error('Unauthorized')

  // pick first active account as default
  const { data: account } = await sb
    .from('accounts')
    .select('id')
    .eq('user_id', user.user.id)
    .eq('is_active', true)
    .single()

  if (!account) throw new Error('No active account')

  const { error } = await sb.from('transactions').insert({
    user_id: user.user.id,
    account_id: account.id,
    payee: values.payee,
    amount: Math.abs(values.amount),
    type: values.amount >= 0 ? 'income' : 'expense',
    category: values.category,
    date: values.date,
    notes: values.notes ?? null
  })

  if (error) throw error
  revalidatePath('/transactions')
}

export async function updateTransaction(id: string, values: Partial<{
  payee: string
  amount: number
  category: string
  date: string
  notes: string | null
}>) {
  const sb = createClient()
  const { data: user } = await sb.auth.getUser()
  if (!user.user) throw new Error('Unauthorized')

  const { error } = await sb
    .from('transactions')
    .update({ ...values, updated_at: new Date().toISOString() }
    ).eq('id', id).eq('user_id', user.user.id)

  if (error) throw error
  revalidatePath('/transactions')
}

export async function deleteTransaction(id: string) {
  const sb = createClient(cookies())
  const { data: user } = await sb.auth.getUser()
  if (!user.user) throw new Error('Unauthorized')

  const { error } = await sb
    .from('transactions')
    .delete()
    .eq('id', id)
    .eq('user_id', user.user.id)

  if (error) throw error
  revalidatePath('/transactions')
}