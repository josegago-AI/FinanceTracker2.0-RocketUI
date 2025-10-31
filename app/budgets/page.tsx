import { getBudgets } from './actions'
import { BudgetsClient } from './budgets-client'

export const dynamic = 'force-dynamic'
export const metadata = {
  title: 'Budgets',
}

export default async function BudgetsPage() {
  const rawBudgets = await getBudgets()

  // ✅ Map database rows to the correct Budget interface
  const budgets = (rawBudgets || []).map((b: any) => ({
    id: b.id,
    category_id: b.category_id,
    amount: b.amount,
    month: b.month,
    year: b.year,
    created_at: b.created_at,
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
