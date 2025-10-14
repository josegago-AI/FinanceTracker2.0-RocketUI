'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function getAccounts() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data, error } = await supabase
    .from('accounts')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching accounts:', error)
    return []
  }

  return data
}

export async function createAccount(formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  const name = formData.get('name') as string
  const type = formData.get('type') as string
  const balance = parseFloat(formData.get('balance') as string) || 0
  const institution = formData.get('institution') as string || null
  const currency = formData.get('currency') as string || 'USD'

  const { error } = await supabase
    .from('accounts')
    .insert({
      user_id: user.id,
      name,
      type,
      balance,
      institution,
      currency,
      is_active: true
    })

  if (error) {
    console.error('Error creating account:', error)
    return { error: error.message }
  }

  revalidatePath('/dashboard/accounts')
  return { success: true }
}

export async function updateAccount(id: string, formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  const name = formData.get('name') as string
  const type = formData.get('type') as string
  const balance = parseFloat(formData.get('balance') as string) || 0
  const institution = formData.get('institution') as string || null
  const currency = formData.get('currency') as string || 'USD'
  const is_active = formData.get('is_active') === 'true'

  const { error } = await supabase
    .from('accounts')
    .update({
      name,
      type,
      balance,
      institution,
      currency,
      is_active
    })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error updating account:', error)
    return { error: error.message }
  }

  revalidatePath('/dashboard/accounts')
  return { success: true }
}

export async function deleteAccount(id: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  const { error } = await supabase
    .from('accounts')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error deleting account:', error)
    return { error: error.message }
  }

  revalidatePath('/dashboard/accounts')
  return { success: true }
}
