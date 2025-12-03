// app/budgets/components/BudgetOverviewCard.tsx

import { AlertTriangle, CheckCircle2, XOctagon } from 'lucide-react'

const STATUS = [
  { label: 'On Track', value: '4', icon: CheckCircle2, tone: 'text-success', bg: 'bg-success/10' },
  { label: 'Approaching Limit', value: '2', icon: AlertTriangle, tone: 'text-warning', bg: 'bg-warning/10' },
  { label: 'Exceeded', value: '1', icon: XOctagon, tone: 'text-destructive', bg: 'bg-destructive/10' },
]

const PROGRESS = 68

export function BudgetOverviewCard() {
  return (
    <section className="rounded-xl border border-border/70 bg-card p-6 shadow-sm">
      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">Current month snapshot</p>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Budget Overview</h2>
      </div>

      <div className="mt-5 flex flex-wrap gap-6" aria-label="Budget status counts">
        {STATUS.map(({ label, value, icon: Icon, tone, bg }) => (
          <div key={label} className="flex items-center gap-3">
            <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${bg}`}>
              <Icon className={`h-5 w-5 ${tone}`} />
            </span>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{label}</p>
              <p className={`text-lg font-semibold ${tone}`}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-2" aria-label="Budget compliance">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Compliance</span>
          <span className="font-semibold text-foreground">{PROGRESS}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-primary" style={{ width: `${PROGRESS}%` }} />
        </div>
      </div>
    </section>
  )
}
