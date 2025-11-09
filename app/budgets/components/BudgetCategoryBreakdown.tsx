// app/budgets/components/BudgetCategoryBreakdown.tsx
'use client'

export function BudgetCategoryBreakdown({
  items,
}: {
  items: { name: string; amount: number; color?: string }[]
}) {
  const total = items.reduce((sum, i) => sum + i.amount, 0)

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.name} className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color ?? '#888' }}
            />
            <span>{item.name}</span>
          </div>

          <span className="text-muted-foreground">
            {Math.round((item.amount / total) * 100)}%
          </span>
        </div>
      ))}
    </div>
  )
}
