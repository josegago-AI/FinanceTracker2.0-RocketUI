// app/budgets/page.tsx

import BudgetsClient from './budgets-client'
import { BudgetOverviewCard } from './components/BudgetOverviewCard'
import { FilterBar } from './components/FilterBar'
import { KPIHeader } from './components/KPIHeader'

export default function BudgetsPage() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      <header className="mb-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Budgets</h1>
          <p className="text-base text-muted-foreground">
            Create and manage your spending budgets to stay on track with your financial goals.
          </p>
        </div>
      </header>

      <section className="space-y-8">
        <KPIHeader />
        <BudgetOverviewCard />
        <FilterBar />
        <BudgetsClient />
      </section>
    </main>
  )
}
