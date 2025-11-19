// app/budgets/components/BudgetOverviewCard.tsx

const STATUS = {
  safe: 'text-green-500',
  warn: 'text-yellow-500',
  danger: 'text-red-500',
} as const

export function BudgetOverviewCard() {
  return (
    <section className="rounded-xl border border-border/60 bg-card/80 p-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(0,0,0,0.08)]">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Current Month</p>
          <h2 className="text-2xl font-semibold tracking-tight">Budget Overview</h2>
        </div>
        <div className="text-sm text-muted-foreground">
          On Track: <span className={STATUS.safe}>4</span> | Approaching:{' '}
          <span className={STATUS.warn}>2</span> | Exceeded:{' '}
          <span className={STATUS.danger}>1</span>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <p className="text-sm text-muted-foreground">Compliance bar</p>
        <div className="h-3 w-full rounded-full bg-muted">
          <div className="h-full rounded-full bg-emerald-400" style={{ width: '68%' }} />
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Planned allocation</span>
          <span>Actual spend</span>
        </div>
      </div>
    </section>
  )
}
