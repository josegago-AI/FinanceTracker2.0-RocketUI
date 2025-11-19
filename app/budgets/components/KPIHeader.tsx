'use client'

// app/budgets/components/KPIHeader.tsx

import type { LucideIcon } from 'lucide-react'
import { ArrowDownRight, ArrowUpRight, CircleDot, Wallet, Wallet2 } from 'lucide-react'

const STATUS = {
  safe: 'text-success',
  warn: 'text-warning',
  danger: 'text-error',
} as const

type StatusKey = keyof typeof STATUS

type KPIConfig = {
  key: string
  label: string
  value: string
  status: StatusKey
  statusLabel: string
  icon: LucideIcon
}

const KPI_ITEMS: KPIConfig[] = [
  { key: 'totalAllocated', label: 'Total Allocated', value: '$12,500', status: 'safe', statusLabel: 'Stable', icon: Wallet2 },
  { key: 'totalSpent', label: 'Total Spent', value: '$8,950', status: 'warn', statusLabel: 'Trending up', icon: ArrowUpRight },
  { key: 'remaining', label: 'Remaining', value: '$3,550', status: 'safe', statusLabel: 'On plan', icon: Wallet },
  { key: 'otherSpend', label: 'Other Spend', value: '$420', status: 'danger', statusLabel: 'Needs review', icon: ArrowDownRight },
  { key: 'overallProgress', label: 'Overall Progress', value: '72%', status: 'warn', statusLabel: 'Approaching', icon: CircleDot },
]

export function KPIHeader() {
  return (
    <section className="space-y-3" aria-label="Budget KPIs">
      <p className="text-sm text-muted-foreground">High-level snapshot of how the plan is pacing this month.</p>
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
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">{item.label}</span>
                <span className="rounded-full bg-muted p-2 text-primary">
                  <Icon className="h-4 w-4" />
                </span>
              </div>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-primary">{item.value}</p>
              <span className={`text-xs font-semibold uppercase tracking-wide ${STATUS[item.status]}`}>
                {item.statusLabel}
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
