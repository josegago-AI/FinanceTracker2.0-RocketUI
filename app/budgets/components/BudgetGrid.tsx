// app/budgets/components/BudgetGrid.tsx
'use client'

import type { KeyboardEvent, MouseEvent } from 'react'
import { useMemo } from 'react'
import { MoreHorizontal, Pencil } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import { BudgetCard } from './BudgetCard'

const STATUS = {
  'on-track': {
    label: 'On track',
    badge: 'bg-emerald-50 text-emerald-600 ring-1 ring-inset ring-emerald-200',
    dot: 'bg-emerald-500',
    card:
      'border-emerald-200/70 hover:shadow-emerald-100/60 focus-visible:ring-emerald-500/40',
  },
  warning: {
    label: 'Warning',
    badge: 'bg-amber-50 text-amber-600 ring-1 ring-inset ring-amber-200',
    dot: 'bg-amber-500',
    card:
      'border-amber-200/70 hover:shadow-amber-100/60 focus-visible:ring-amber-500/40',
  },
  exceeded: {
    label: 'Exceeded',
    badge: 'bg-rose-50 text-rose-600 ring-1 ring-inset ring-rose-200',
    dot: 'bg-rose-500',
    card:
      'border-rose-200/70 hover:shadow-rose-100/60 focus-visible:ring-rose-500/40',
  },
  default: {
    label: 'Tracked',
    badge: 'bg-muted text-muted-foreground ring-1 ring-inset ring-border/60',
    dot: 'bg-muted-foreground/50',
    card: 'focus-visible:ring-primary/30',
  },
} as const

const KPI_FILTERS: Record<string, (budget: BudgetGridBudget) => boolean> = {
  overspent: (budget) => {
    const limit = resolveLimit(budget)
    return limit > 0 && budget.spent > limit
  },
  underutilized: (budget) => {
    const limit = resolveLimit(budget)
    if (limit === 0) return false
    if (typeof budget.progress === 'number') return budget.progress < 50
    if (typeof budget.remaining === 'number') {
      return budget.remaining / limit > 0.5
    }
    return false
  },
  attention: (budget) => {
    const status = normalizeStatus(budget.status)
    return status === 'warning' || status === 'exceeded'
  },
}

const FILTER_PRESETS: Record<string, (budget: BudgetGridBudget) => boolean> = {
  all: () => true,
  'on-track': (budget) => normalizeStatus(budget.status) === 'on-track',
  warning: (budget) => normalizeStatus(budget.status) === 'warning',
  exceeded: (budget) => normalizeStatus(budget.status) === 'exceeded',
  'needs-attention': (budget) => {
    const status = normalizeStatus(budget.status)
    return status === 'warning' || status === 'exceeded'
  },
}

export interface BudgetGridBudget {
  id: string
  name?: string
  spent: number
  limit?: number
  categoryColor?: string
  color?: string
  category?: string
  allocated?: number
  amount?: number
  remaining?: number
  progress?: number
  status?: 'on-track' | 'warning' | 'exceeded' | string
  period?: string
}

export interface BudgetGridProps {
  categoryBudgets: BudgetGridBudget[]
  activeKpiKey?: string | null
  activeFilterKey?: string | null
  onSelectBudget?: (budget: BudgetGridBudget) => void
  onOpenDetails?: (budget: BudgetGridBudget) => void
  onOpenEdit?: (budget: BudgetGridBudget) => void
}

export function BudgetGrid({
  categoryBudgets,
  activeFilterKey,
  activeKpiKey,
  onSelectBudget,
  onOpenDetails,
  onOpenEdit,
}: BudgetGridProps) {
  const filteredBudgets = useMemo(() => {
    const filterKey = activeFilterKey ?? 'all'
    const filterFn =
      FILTER_PRESETS[filterKey] ??
      ((budget: BudgetGridBudget) => {
        if (!filterKey || filterKey === 'all') return true
        return normalizeStatus(budget.status) === filterKey
      })

    const kpiFn =
      activeKpiKey && KPI_FILTERS[activeKpiKey]
        ? KPI_FILTERS[activeKpiKey]
        : null

    return categoryBudgets.filter((budget) => {
      if (!filterFn(budget)) return false
      if (kpiFn && !kpiFn(budget)) return false
      return true
    })
  }, [categoryBudgets, activeFilterKey, activeKpiKey])

  if (filteredBudgets.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border/60 bg-muted/20 p-10 text-center text-sm text-muted-foreground">
        No budgets match the selected filters just yet. Try adjusting your KPI
        or filter selections.
      </p>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {filteredBudgets.map((budget) => {
        const statusKey = normalizeStatus(budget.status)
        const statusStyles = STATUS[statusKey] ?? STATUS.default
        const limit = resolveLimit(budget)
        const displayName = budget.name ?? budget.category ?? 'Budget'

        return (
          <div key={budget.id} className="relative" role="group">
            <BudgetCard
              name={displayName}
              spent={budget.spent}
              limit={limit}
              categoryColor={budget.categoryColor ?? budget.color}
              className={cn(
                'relative rounded-xl border border-border/60 bg-card/90 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                statusStyles.card,
              )}
              onClick={() => onSelectBudget?.(budget)}
              onKeyDown={(event) => handleCardKeyDown(event, budget, onSelectBudget)}
              role={onSelectBudget ? 'button' : undefined}
              tabIndex={onSelectBudget ? 0 : undefined}
            />

            <div className="pointer-events-none absolute right-8 top-8 flex items-center gap-2 text-xs font-semibold">
              <span
                className={cn(
                  'inline-flex items-center gap-2 rounded-full px-3 py-1 uppercase tracking-wide',
                  statusStyles.badge,
                )}
              >
                <span className={cn('h-2 w-2 rounded-full', statusStyles.dot)} />
                {statusStyles.label}
              </span>

              <div className="pointer-events-auto flex gap-1">
                {onOpenDetails ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full bg-background/70 shadow-sm transition-colors hover:bg-background"
                    onClick={(event) =>
                      handleActionClick(event, budget, onOpenDetails)
                    }
                    aria-label={`View details for ${displayName}`}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                ) : null}

                {onOpenEdit ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full bg-background/70 shadow-sm transition-colors hover:bg-background"
                    onClick={(event) => handleActionClick(event, budget, onOpenEdit)}
                    aria-label={`Edit ${displayName}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                ) : null}
              </div>
            </div>

            {budget.period ? (
              <div className="pointer-events-none absolute left-8 top-8 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {budget.period}
              </div>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}

function handleCardKeyDown(
  event: KeyboardEvent<HTMLDivElement>,
  budget: BudgetGridBudget,
  onSelectBudget?: (budget: BudgetGridBudget) => void,
) {
  if (!onSelectBudget) return
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    onSelectBudget(budget)
  }
}

function handleActionClick(
  event: MouseEvent<HTMLButtonElement>,
  budget: BudgetGridBudget,
  handler?: (budget: BudgetGridBudget) => void,
) {
  event.preventDefault()
  event.stopPropagation()
  handler?.(budget)
}

function resolveLimit(budget: BudgetGridBudget): number {
  if (typeof budget.limit === 'number') return budget.limit
  if (typeof budget.allocated === 'number') return budget.allocated
  if (typeof budget.amount === 'number') return budget.amount
  return 0
}

function normalizeStatus(
  status: BudgetGridBudget['status'],
): keyof typeof STATUS {
  if (status === 'on-track' || status === 'warning' || status === 'exceeded') {
    return status
  }
  return 'default'
}
