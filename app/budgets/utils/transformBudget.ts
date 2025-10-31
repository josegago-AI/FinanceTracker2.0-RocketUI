// Adapts DB budgets to Rocket-UI style fields
export interface DBBudget {
  id: string;
  amount: number | string;
  spent: number | string;
  month: number;
  year: number;
  category_id: string;
}

export interface UIBudget extends DBBudget {
  allocated: number;
  remaining: number;
  progress: number;
  weeklySpending: number[];
  icon: string;
  color: string;
  period: string;
  alertThreshold: number;
  lastTransaction: string;
  transactionCount: number;
}

export function transformBudget(budget: DBBudget): UIBudget {
  const allocated = Number(budget.amount);
  const spent = Number(budget.spent);
  const remaining = allocated - spent;
  const progress = allocated > 0 ? (spent / allocated) * 100 : 0;

  // TEMP placeholders until real integration
  const weeklySpending = [10, 50, 30, 20, 60, 40, 25];
  const icon = "Wallet";
  const color = "bg-primary";
  const period = `${budget.month}/${budget.year}`;
  const alertThreshold = 80;
  const lastTransaction = "N/A";
  const transactionCount = 0;

  return {
    ...budget,
    allocated,
    spent,
    remaining,
    progress,
    weeklySpending,
    icon,
    color,
    period,
    alertThreshold,
    lastTransaction,
    transactionCount,
  };
}
