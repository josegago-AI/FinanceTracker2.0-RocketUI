'use client'

// app/budgets/components/KPIHeader.tsx

import type { LucideIcon } from 'lucide-react'
import { CircleDollarSign, Layers, PieChart, TrendingUp, Wallet2 } from 'lucide-react'

type KPIConfig = {
  key: string
  label: string
  value: string
  icon: LucideIcon
  valueTone?: string
}

const KPI_ITEMS: KPIConfig[] = [
  { key: 'totalAllocated', label: 'Total Allocated', value: '$12,500', icon: Wallet2 },
  { key: 'totalSpent', label: 'Total Spent', value: '$8,950', icon: TrendingUp },
  { key: 'remaining', label: 'Remaining', value: '$3,550', icon: CircleDollarSign, valueTone: 'text-success' },
  { key: 'otherSpend', label: 'Other Spend', value: '$420', icon: Layers },
  { key: 'overallProgress', label: 'Overall Progress', value: '72%', icon: PieChart, valueTone: 'text-warning' },
]

export function KPIHeader() {
  return (
    <section className="space-y-3" aria-label="Budget KPIs">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {KPI_ITEMS.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.key}
              type="button"
              className="rounded-xl border border-border/70 bg-card p-4 text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              onClick={() => {}}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                  <p className={`mt-2 text-3xl font-semibold tracking-tight ${item.valueTone ?? 'text-foreground'}`}>
                    {item.value}
                  </p>
                </div>
                <span className="rounded-lg bg-muted/80 p-2 text-muted-foreground">
                  <Icon className="h-4 w-4" />
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}
