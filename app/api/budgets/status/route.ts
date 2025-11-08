import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getUserId } from '@/lib/auth/getUserId'

function monthBounds(year: number, month: number) {
  const start = new Date(Date.UTC(year, month - 1, 1))
  const end = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999))
  return { start: start.toISOString().slice(0,10), end: end.toISOString().slice(0,10) }
}

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
    .select('id, category_id, amount')
    .eq('user_id', userId)
    .eq('month', month)
    .eq('year', year)

  if (bErr) return NextResponse.json({ error: bErr.message }, { status: 400 })

  const { start, end } = monthBounds(year, month)

  // fetch transactions for the same period and aggregate in JS
  const { data: txs, error: tErr } = await supabase
    .from('transactions')
    .select('category_id, amount, date')
    .eq('user_id', userId)
    .gte('date', start)
    .lte('date', end)

  if (tErr) return NextResponse.json({ error: tErr.message }, { status: 400 })

  const spentByCat = new Map<string, number>()
  for (const t of txs ?? []) {
    const cur = spentByCat.get(t.category_id) ?? 0
    spentByCat.set(t.category_id, cur + Number(t.amount ?? 0))
  }

  const items = (budgets ?? []).map(b => {
    const allocated = Number(b.amount)
    const spent = Number(spentByCat.get(b.category_id) ?? 0)
    const progress = allocated > 0 ? (spent / allocated) * 100 : 0
    const status = progress < 80 ? 'on-track' : progress < 100 ? 'warning' : 'exceeded'
    return { budget_id: b.id, category_id: b.category_id, allocated, spent, progress, status }
  })

  return NextResponse.json({ month, year, items })
}
