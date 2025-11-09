// app/budgets/components/BudgetList.tsx

import { BudgetCard } from './BudgetCard'

export function BudgetList({
  budgets,
}: {
  budgets: {
    id: string
    name: string
    spent: number
    limit: number
    color?: string
  }[]
}) {
  if (budgets.length === 0) return null

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {budgets.map((b) => (
        <BudgetCard
          key={b.id}
          name={b.name}
          spent={b.spent}
          limit={b.limit}
          categoryColor={b.color}
        />
      ))}
    </div>
  )
}
