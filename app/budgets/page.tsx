import { getBudgets } from './actions'
import { BudgetsClient } from './budgets-client'

export const dynamic = 'force-dynamic'
export const metadata = {
  title: 'Budgets',
}

export default async function BudgetsPage() {
  const rawBudgets = await getBudgets()

  // 🧩 Map Supabase rows to match the Budget interface
  const budgets = (rawBudgets || []).map((b: any) => ({
    id: b.id,
    name: b.category?.name || 'Unnamed', // optional relation
    category: b.category_id || 'Uncategorized',
    limit: b.amount || 0,
    spent: 0, // placeholder (could later be calculated)
    month: b.month || '',
    year: b.year?.toString() || '',
  }))

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Budgets</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track and manage your monthly spending limits.
        </p>
      </div>
      <BudgetsClient initialBudgets={budgets} />
    </div>
  )
}
