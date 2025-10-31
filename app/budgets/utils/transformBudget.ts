// Adapts DB budgets to Rocket-UI style fields
export function transformBudget(budget) {
  // Map real DB values
  const allocated = Number(budget.amount);
  const spent = Number(budget.spent);
  const remaining = allocated - spent;
  const progress = allocated > 0 ? (spent / allocated) * 100 : 0;

  // TEMP FAKE DATA until real schema upgrade
  const weeklySpending = [10, 50, 30, 20, 60, 40, 25]; // mock trending bars
  const icon = "Wallet"; // default, later per category
  const color = "bg-primary"; // default
  const period = `${budget.month}/${budget.year}`;
  const alertThreshold = 80; // static for now
  const lastTransaction = "N/A"; // until linked to tx table
  const transactionCount = 0; // until aggregation added

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
