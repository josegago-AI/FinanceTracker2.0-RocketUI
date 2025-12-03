// app/budgets/components/FilterBar.tsx

export function FilterBar() {
  return (
    <section className="rounded-xl border border-border/60 bg-card/70 p-4 shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground" htmlFor="budget-status">
            Status
          </label>
          <select
            id="budget-status"
            className="w-full rounded-xl border border-border/60 bg-background px-3 py-2 text-sm shadow-sm"
            defaultValue="all"
            disabled
          >
            <option value="all">All</option>
            <option value="safe">On Track</option>
            <option value="warn">Approaching</option>
            <option value="danger">Exceeded</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground" htmlFor="budget-period">
            Period
          </label>
          <select
            id="budget-period"
            className="w-full rounded-xl border border-border/60 bg-background px-3 py-2 text-sm shadow-sm"
            defaultValue="current"
            disabled
          >
            <option value="current">Current Month ▼</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground" htmlFor="budget-sort">
            Sort
          </label>
          <select
            id="budget-sort"
            className="w-full rounded-xl border border-border/60 bg-background px-3 py-2 text-sm shadow-sm"
            defaultValue="name"
            disabled
          >
            <option value="name">Category Name ▼</option>
          </select>
        </div>
      </div>
    </section>
  )
}
