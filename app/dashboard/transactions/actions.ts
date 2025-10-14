'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function getTransactions() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data, error } = await supabase
    .from('transactions')
    .select(`
      id,
      date,
      payee,
      amount,
      type,
      notes,
      account_id,
      category_id,
      accounts!inner(id, name),
      categories!inner(id, name)
    `)
    .eq('user_id', user.id)
    .order('date', { ascending: false })

  if (error) {
    console.error('Error fetching transactions:', error)
    return []
  }

  return data.map((t: any) => ({
    id: t.id,
    date: t.date,
    payee: t.payee,
    amount: Number(t.amount),
    type: t.type,
    notes: t.notes,
    account: {
      id: t.accounts.id,
      name: t.accounts.name
    },
    category: {
      id: t.categories.id,
      name: t.categories.name
    }
  }))
}

export async function getAccounts() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data, error } = await supabase
    .from('accounts')
    .select('id, name')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching accounts:', error)
    return []
  }

  return data
}

export async function getCategories() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data, error } = await supabase
    .from('categories')
    .select('id, name, type')
    .eq('user_id', user.id)
    .order('type', { ascending: true })
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  return data
}

export async function createTransaction(formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  const account_id = formData.get('account_id') as string
  const category_id = formData.get('category_id') as string
  const date = formData.get('date') as string
  const amount = parseFloat(formData.get('amount') as string)
  const type = formData.get('type') as string
  const payee = formData.get('payee') as string
  const notes = formData.get('notes') as string || null

  const { error } = await supabase
    .from('transactions')
    .insert({
      user_id: user.id,
      account_id,
      category_id,
      date,
      amount,
      type,
      payee,
      notes
    })

  if (error) {
    console.error('Error creating transaction:', error)
    return { error: error.message }
  }

  revalidatePath('/dashboard/transactions')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function updateTransaction(id: string, formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  const account_id = formData.get('account_id') as string
  const category_id = formData.get('category_id') as string
  const date = formData.get('date') as string
  const amount = parseFloat(formData.get('amount') as string)
  const type = formData.get('type') as string
  const payee = formData.get('payee') as string
  const notes = formData.get('notes') as string || null

  const { error } = await supabase
    .from('transactions')
    .update({
      account_id,
      category_id,
      date,
      amount,
      type,
      payee,
      notes
    })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error updating transaction:', error)
    return { error: error.message }
  }

  revalidatePath('/dashboard/transactions')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function deleteTransaction(id: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error deleting transaction:', error)
    return { error: error.message }
  }

  revalidatePath('/dashboard/transactions')
  revalidatePath('/dashboard')
  return { success: true }
}
