// app/budgets/components/BudgetGrid.tsx

const STATUS = {
  safe: 'text-success',
  warn: 'text-warning',
  danger: 'text-error',
} as const

type StatusKey = keyof typeof STATUS

type MockBudget = {
  id: string
  name: string
  allocated: string
  spent: string
  remaining: string
  trend: '↑' | '↓' | '↔'
  status: StatusKey
  progress: number
}

const MOCK_BUDGETS: MockBudget[] = [
  {
    id: 'dining',
    name: 'Dining Out',
    allocated: '$500',
    spent: '$320',
    remaining: '$180',
    trend: '↑',
    status: 'warn',
    progress: 64,
  },
  {
    id: 'groceries',
    name: 'Groceries',
    allocated: '$650',
    spent: '$410',
    remaining: '$240',
    trend: '↔',
    status: 'safe',
    progress: 63,
  },
  {
    id: 'transport',
    name: 'Transportation',
    allocated: '$300',
    spent: '$290',
    remaining: '$10',
    trend: '↓',
    status: 'danger',
    progress: 97,
  },
  {
    id: 'fitness',
    name: 'Fitness & Wellness',
    allocated: '$200',
    spent: '$80',
    remaining: '$120',
    trend: '↑',
    status: 'safe',
    progress: 40,
  },
]

export function BudgetGrid() {
  return (
    <section className="space-y-4">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {MOCK_BUDGETS.map((budget) => (
          <article
            key={budget.id}
            className="rounded-xl border border-border/70 bg-card p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-primary">{budget.name}</p>
                <p className="text-xs text-muted-foreground">Trend {budget.trend}</p>
              </div>
              <span className={`text-xs font-semibold uppercase tracking-wide ${STATUS[budget.status]}`}>
                {budget.status === 'safe' && 'On Track'}
                {budget.status === 'warn' && 'Approaching'}
                {budget.status === 'danger' && 'Exceeded'}
              </span>
            </div>

            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Allocated</dt>
                <dd className="font-semibold text-foreground">{budget.allocated}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Spent</dt>
                <dd className="font-semibold text-foreground">{budget.spent}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Remaining</dt>
                <dd className="font-semibold text-foreground">{budget.remaining}</dd>
              </div>
              <div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Progress</span>
                  <span className="font-semibold text-foreground">{budget.progress}%</span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${budget.progress}%` }} />
                </div>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </section>
  )
}
