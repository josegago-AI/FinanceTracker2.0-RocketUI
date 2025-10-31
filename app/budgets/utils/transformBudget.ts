// ✅ Types for DB & UI budgets
export interface DBBudget {
  id: string
  category_id: string
  amount: number
  month: number
  year: number
  created_at?: string
  spent?: number // optional from DB
}

export interface UIBudget extends DBBudget {
  allocated: number
  spent: number
  remaining: number
  progress: number
  weeklySpending: number[]
  icon: string
  color: string
  period: string
  alertThreshold: number
  lastTransaction: string
  transactionCount: number
}

// ✅ Normalize DB to UI
export function transformBudget(budget: DBBudget): UIBudget {
  const allocated = Number(budget.amount)
  const spent = Number(budget.spent ?? 0) // ✅ enforce number
  const remaining = allocated - spent
  const progress = allocated > 0 ? (spent / allocated) * 100 : 0

  return {
    ...budget,
    spent,               // ✅ always number
    allocated,
    remaining,
    progress,
    weeklySpending: [10, 50, 30, 20, 60, 40, 25],
    icon: "Wallet",
    color: "bg-primary",
    period: `${budget.month}/${budget.year}`,
    alertThreshold: 80,
    lastTransaction: "N/A",
    transactionCount: 0
  }
}
