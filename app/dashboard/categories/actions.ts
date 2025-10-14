'use server'

import { revalidatePath } from 'next/cache'
import { getSupabaseClient, getUserId } from '@/lib/supabase/helpers'

export async function getCategories() {
  const supabase = await getSupabaseClient()
  const userId = await getUserId()

  if (!userId) {
    return []
  }

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('user_id', userId)
    .order('type', { ascending: true })
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  return data
}

export async function createCategory(formData: FormData) {
  const supabase = await getSupabaseClient()
  const userId = await getUserId()

  if (!userId) {
    return { error: 'Unauthorized' }
  }

  const name = formData.get('name') as string
  const type = formData.get('type') as string
  const color = formData.get('color') as string || null
  const icon = formData.get('icon') as string || null

  const { error } = await supabase
    .from('categories')
    .insert({
      user_id: userId,
      name,
      type,
      color,
      icon
    })

  if (error) {
    console.error('Error creating category:', error)
    return { error: error.message }
  }

  revalidatePath('/dashboard/categories')
  return { success: true }
}

export async function updateCategory(id: string, formData: FormData) {
  const supabase = await getSupabaseClient()
  const userId = await getUserId()

  if (!userId) {
    return { error: 'Unauthorized' }
  }

  const name = formData.get('name') as string
  const type = formData.get('type') as string
  const color = formData.get('color') as string || null
  const icon = formData.get('icon') as string || null

  const { error } = await supabase
    .from('categories')
    .update({
      name,
      type,
      color,
      icon
    })
    .eq('id', id)
    .eq('user_id', userId)

  if (error) {
    console.error('Error updating category:', error)
    return { error: error.message }
  }

  revalidatePath('/dashboard/categories')
  return { success: true }
}

export async function deleteCategory(id: string) {
  const supabase = await getSupabaseClient()
  const userId = await getUserId()

  if (!userId) {
    return { error: 'Unauthorized' }
  }

  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)

  if (error) {
    console.error('Error deleting category:', error)
    return { error: error.message }
  }

  revalidatePath('/dashboard/categories')
  return { success: true }
}
