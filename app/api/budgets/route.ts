import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getUserId } from '@/lib/auth/getUserId'

const monthNameToInt: Record<string, number> = {
  january:1,february:2,march:3,april:4,may:5,june:6,
  july:7,august:8,september:9,october:10,november:11,december:12
}

export async function GET(req: Request) {
  const supabase = createClient()
  const userId = await getUserId()
  if (!userId) return NextResponse.json([], { status: 200 })

  const { searchParams } = new URL(req.url)
  const monthParam = searchParams.get('month')
  const yearParam = searchParams.get('year')

  let q = supabase.from('budgets')
    .select('id, user_id, category_id, amount, month, year, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (yearParam) q = q.eq('year', Number(yearParam))
  if (monthParam) {
    const m = Number(monthParam) || monthNameToInt[monthParam.toLowerCase()]
    if (m) q = q.eq('month', m)
  }

  const { data, error } = await q
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const supabase = createClient()
  const userId = await getUserId()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { category_id, amount, month, year } = body ?? {}

  if (!category_id || amount == null || !month || !year)
    return NextResponse.json({ error: 'category_id, amount, month, year are required' }, { status: 400 })

  const monthInt = typeof month === 'number'
    ? month
    : monthNameToInt[String(month).toLowerCase()]

  if (!monthInt || monthInt < 1 || monthInt > 12)
    return NextResponse.json({ error: 'month must be 1–12 or a month name' }, { status: 400 })

  const { data, error } = await supabase
    .from('budgets')
    .insert([{ user_id: userId, category_id, amount, month: monthInt, year }])
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data, { status: 201 })
}
