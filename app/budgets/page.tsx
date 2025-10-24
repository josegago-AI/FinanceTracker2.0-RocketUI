export const metadata = { title: 'Budgets' }
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

import { getBudgets } from './actions'
import { BudgetsClient } from './budgets-client'

export default async function BudgetsPage() {
  const budgets = await getBudgets()

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Budgets</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your spending limits and track how your expenses align with your goals.
        </p>
      </header>
      <BudgetsClient initialBudgets={budgets} />
    </div>
  )
}
