// app/budgets/components/BudgetCard.tsx
'use client'

import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { BudgetProgressBar } from './BudgetProgressBar'

export function BudgetCard({
  name,
  spent,
  limit,
  categoryColor,
}: {
  name: string
  spent: number
  limit: number
  categoryColor?: string
}) {
  const remaining = limit - spent

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: categoryColor ?? '#999' }}
          />
          <h3 className="font-semibold">{name}</h3>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <BudgetProgressBar value={spent} max={limit} />

        <div className="flex justify-between text-sm text-muted-foreground">
          <span>${spent.toFixed(2)} spent</span>
          <span>${remaining.toFixed(2)} left</span>
        </div>
      </CardContent>
    </Card>
  )
}
