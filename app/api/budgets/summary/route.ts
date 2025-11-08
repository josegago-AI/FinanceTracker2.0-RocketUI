import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getUserId } from '@/lib/auth/getUserId'

export async function GET(req: Request) {
  const supabase = createClient()
  const userId = await getUserId()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const month = Number(searchParams.get('month'))
  const year = Number(searchParams.get('year'))
  if (!month || !year) return NextResponse.json({ error: 'month and year required' }, { status: 400 })

  const { data: budgets, error: bErr } = await supabase
    .from('budgets')
    .select('category_id, amount')
    .eq('user_id', userId)
    .eq('month', month)
    .eq('year', year)

  if (bErr) return NextResponse.json({ error: bErr.message }, { status: 400 })

  const totalAllocated = (budgets ?? []).reduce((s, r) => s + Number(r.amount), 0)

  // Compute spent for the month
  const start = new Date(Date.UTC(year, month - 1, 1)).toISOString().slice(0,10)
  const end = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999)).toISOString().slice(0,10)

  const { data: txs, error: tErr } = await supabase
    .from('transactions')
    .select('amount, date')
    .eq('user_id', userId)
    .gte('date', start)
    .lte('date', end)

  if (tErr) return NextResponse.json({ error: tErr.message }, { status: 400 })

  const totalSpent = (txs ?? []).reduce((s, t) => s + Number(t.amount ?? 0), 0)
  return NextResponse.json({
    month, year,
    totalAllocated,
    totalSpent,
    remaining: totalAllocated - totalSpent
  })
}
