// ✅ Types for DB & UI budgets
export interface DBBudget {
  id: string
  category_id: string
  amount: number
  month: number
  year: number
  created_at?: string
  spent?: number // optional from DB
  category_name?: string // <-- if join query includes it
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
  status: "on-track" | "warning" | "exceeded" // ✅ needed for BudgetCard
  category: string // ✅ what UI expects
}

// ✅ Normalize DB → UI
export function transformBudget(budget: DBBudget): UIBudget {
  const allocated = Number(budget.amount)
  const spent = Number(budget.spent ?? 0)
  const remaining = allocated - spent
  const progress = allocated > 0 ? (spent / allocated) * 100 : 0

  // ✅ simple status logic for now (0 errors)
  const status: "on-track" | "warning" | "exceeded" =
    progress < 80 ? "on-track" : progress < 100 ? "warning" : "exceeded"

  return {
    ...budget,
    spent,
    allocated,
    remaining,
    progress,
    weeklySpending: [10, 50, 30, 20, 60, 40, 25],
    icon: "Wallet",
    color: "bg-primary",
    period: `${budget.month}/${budget.year}`,
    alertThreshold: 80,
    lastTransaction: "N/A",
    transactionCount: 0,
    status,
    category: budget.category_name ?? "Uncategorized" // ✅ fallback
  }
}
