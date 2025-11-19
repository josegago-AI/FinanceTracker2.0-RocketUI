// app/budgets/page.tsx

import { BudgetGrid } from './components/BudgetGrid'
import { BudgetOverviewCard } from './components/BudgetOverviewCard'
import { FilterBar } from './components/FilterBar'
import { KPIHeader } from './components/KPIHeader'

export default function BudgetsPage() {
  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <p className="text-sm font-medium text-primary">Budgets</p>
        <h1 className="text-3xl font-semibold tracking-tight">Plan. Adjust. Stay on track.</h1>
        <p className="text-base text-muted-foreground">
          KPI-first overview of this month’s allocations before digging into individual categories.
        </p>
      </div>

      <KPIHeader />
      <BudgetOverviewCard />
      <FilterBar />
      <BudgetGrid />
    </section>
  )
}
