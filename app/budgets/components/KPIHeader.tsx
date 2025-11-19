// app/budgets/components/KPIHeader.tsx

const STATUS = {
  safe: 'text-green-500',
  warn: 'text-yellow-500',
  danger: 'text-red-500',
} as const

type StatusKey = keyof typeof STATUS

const KPI_ITEMS: { key: string; label: string; value: string; status: StatusKey }[] = [
  { key: 'totalAllocated', label: 'Total Allocated', value: '$12,500', status: 'safe' },
  { key: 'totalSpent', label: 'Total Spent', value: '$8,950', status: 'warn' },
  { key: 'remaining', label: 'Remaining', value: '$3,550', status: 'safe' },
  { key: 'otherSpend', label: 'Other Spend', value: '$420', status: 'danger' },
  { key: 'overallProgress', label: 'Overall Progress', value: '72%', status: 'warn' },
]

export function KPIHeader() {
  return (
    <section className="space-y-3" aria-label="Budget KPIs">
      <p className="text-sm text-muted-foreground">
        High-level snapshot of how the plan is pacing this month.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {KPI_ITEMS.map((item) => (
          <button
            key={item.key}
            type="button"
            className="rounded-xl border border-border/60 bg-card/80 p-4 text-left shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(0,0,0,0.08)]"
            onClick={() => {}}
          >
            <span className="text-sm font-medium text-muted-foreground">{item.label}</span>
            <p className="mt-2 text-2xl font-semibold tracking-tight">{item.value}</p>
            <span className={`mt-1 inline-block text-xs font-semibold uppercase tracking-wide ${STATUS[item.status]}`}>
              View details
            </span>
          </button>
        ))}
      </div>
    </section>
  )
}
