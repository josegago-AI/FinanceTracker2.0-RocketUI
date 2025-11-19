// app/budgets/components/BudgetOverviewCard.tsx
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn, formatCurrency } from '@/lib/utils'
import { BudgetProgressBar } from './BudgetProgressBar'

const STATUS = {
  safe: 'text-green-500',
  warn: 'text-yellow-500',
  danger: 'text-red-500',
} as const

type RiskState = keyof typeof STATUS

interface BudgetOverviewCardProps {
  monthLabel: string
  totalAllocated: number
  totalSpent: number
  remaining: number
  progressPercentage: number
}

function getRiskState(progress: number, remaining: number): RiskState {
  if (remaining < 0) {
    return 'danger'
  }

  if (progress >= 95) {
    return 'danger'
  }

  if (progress >= 80) {
    return 'warn'
  }

  return 'safe'
}

function formatMoney(amount: number) {
  if (typeof formatCurrency === 'function') {
    return formatCurrency(amount)
  }

  return amount.toLocaleString(undefined, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  })
}

export function BudgetOverviewCard({
  monthLabel,
  totalAllocated,
  totalSpent,
  remaining,
  progressPercentage,
}: BudgetOverviewCardProps) {
  const progress = Math.max(0, Math.min(progressPercentage, 100))
  const status = getRiskState(progress, remaining)

  return (
    <Card className="rounded-xl border border-border/60 bg-card/70 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {monthLabel}
            </p>
            <h3 className="text-2xl font-semibold text-foreground">Budget Overview</h3>
          </div>
          <span className={cn('text-sm font-semibold', STATUS[status])}>{progress}%</span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-sm text-muted-foreground">Remaining this cycle</span>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-semibold tracking-tight">
              {formatMoney(remaining)}
            </span>
            <span className={cn('text-sm font-medium', STATUS[status])}>
              {status === 'safe' && 'On track'}
              {status === 'warn' && 'Approaching limit'}
              {status === 'danger' && 'Over allocation'}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Allocated vs. spent</span>
            <span>
              {formatMoney(totalSpent)} / {formatMoney(totalAllocated)}
            </span>
          </div>
          <BudgetProgressBar value={totalSpent} max={Math.max(totalAllocated, 1)} />
        </div>

        <dl className="grid grid-cols-1 gap-4 text-sm text-muted-foreground sm:grid-cols-3">
          <div className="rounded-lg border border-border/60 bg-background/60 p-3">
            <dt className="text-xs uppercase tracking-wide">Total Allocated</dt>
            <dd className="mt-1 text-base font-medium text-foreground">
              {formatMoney(totalAllocated)}
            </dd>
          </div>
          <div className="rounded-lg border border-border/60 bg-background/60 p-3">
            <dt className="text-xs uppercase tracking-wide">Total Spent</dt>
            <dd className="mt-1 text-base font-medium text-foreground">
              {formatMoney(totalSpent)}
            </dd>
          </div>
          <div className="rounded-lg border border-border/60 bg-background/60 p-3">
            <dt className="text-xs uppercase tracking-wide">Remaining</dt>
            <dd className="mt-1 text-base font-medium text-foreground">
              {formatMoney(remaining)}
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  )
}
