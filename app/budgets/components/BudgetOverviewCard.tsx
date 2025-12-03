// app/budgets/components/BudgetOverviewCard.tsx

import { AlertTriangle, CheckCircle2, XOctagon } from 'lucide-react'

const STATUS = [
  { label: 'On Track', value: '4', icon: CheckCircle2, tone: 'text-success', bg: 'bg-success/20' },
  { label: 'Approaching Limit', value: '2', icon: AlertTriangle, tone: 'text-warning', bg: 'bg-warning/20' },
  { label: 'Exceeded', value: '1', icon: XOctagon, tone: 'text-destructive', bg: 'bg-destructive/20' },
]

const PROGRESS = 68

export function BudgetOverviewCard() {
  return (
    <section className="rounded-xl border border-border/70 bg-card p-6 shadow-sm">
      <div className="flex flex-wrap items-center gap-4" aria-label="Budget status counts">
        {STATUS.map(({ label, value, icon: Icon, tone, bg }) => (
          <div key={label} className="flex items-center gap-3 rounded-lg bg-muted/40 px-3 py-2">
            <span className={`flex h-8 w-8 items-center justify-center rounded-md ${bg}`}>
              <Icon className={`h-4 w-4 ${tone}`} />
            </span>
            <p className="text-sm font-medium text-foreground">
              {label} <span className="text-muted-foreground">{value}</span>
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-2" aria-label="Budget compliance">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Compliance</span>
          <span className="font-semibold text-foreground">{PROGRESS}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-primary/80" style={{ width: `${PROGRESS}%` }} />
        </div>
      </div>
    </section>
  )
}
