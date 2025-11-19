// app/budgets/components/BudgetOverviewCard.tsx

import { AlertTriangle, CheckCircle2, XOctagon } from 'lucide-react'

const STATUS = {
  safe: { label: 'On Track', value: '4', icon: CheckCircle2, tone: 'text-success' },
  warn: { label: 'Approaching', value: '2', icon: AlertTriangle, tone: 'text-warning' },
  danger: { label: 'Exceeded', value: '1', icon: XOctagon, tone: 'text-error' },
}

const PROGRESS = 68

export function BudgetOverviewCard() {
  return (
    <section className="rounded-xl border border-border/70 bg-card p-6 shadow-sm">
      <div className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">Current Month</p>
        <h2 className="text-2xl font-semibold tracking-tight text-primary">Budget Overview</h2>
        <p className="text-sm text-muted-foreground">Snapshot of pacing by status before diving into individual budgets.</p>
      </div>

      <div className="mt-6 grid gap-3 text-sm text-muted-foreground md:grid-cols-3">
        {Object.values(STATUS).map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className="flex items-center justify-between rounded-lg border border-border/60 bg-background/80 px-3 py-2">
            <div className="flex items-center gap-2">
              <span className={`rounded-full bg-muted p-2 ${tone}`}>
                <Icon className="h-4 w-4" />
              </span>
              <span className="font-medium text-foreground">{label}</span>
            </div>
            <span className={`text-base font-semibold ${tone}`}>{value}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Compliance</span>
          <span className="font-semibold text-primary">{PROGRESS}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-primary" style={{ width: `${PROGRESS}%` }} />
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Planned allocation</span>
          <span>Actual spend</span>
        </div>
      </div>
    </section>
  )
}
