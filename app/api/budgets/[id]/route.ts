import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getUserId } from '@/lib/auth/getUserId'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const supabase = createClient()
  const userId = await getUserId()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('budgets')
    .select('id, user_id, category_id, amount, month, year, created_at')
    .eq('id', params.id)
    .eq('user_id', userId)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  return NextResponse.json(data)
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const supabase = createClient()
  const userId = await getUserId()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const updates = await req.json()
  const { month, ...rest } = updates ?? {}
  const payload = {
    ...rest,
    ...(month != null ? { month: typeof month === 'number' ? month : undefined } : {})
  }

  const { data, error } = await supabase
    .from('budgets')
    .update(payload)
    .eq('id', params.id)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const supabase = createClient()
  const userId = await getUserId()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { error } = await supabase
    .from('budgets')
    .delete()
    .eq('id', params.id)
    .eq('user_id', userId)

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true })
}
