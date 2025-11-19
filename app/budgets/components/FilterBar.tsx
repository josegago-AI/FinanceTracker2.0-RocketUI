'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { KeyboardEvent } from 'react'

type BudgetStatus = 'all' | 'active' | 'completed'
type BudgetPeriod = 'this-month' | 'last-month' | 'quarter' | 'year'
type BudgetSort = 'name-asc' | 'spent-desc' | 'remaining-desc'

interface FilterBarProps {
  status: BudgetStatus
  period: BudgetPeriod
  sort: BudgetSort
  onStatusChange: (status: BudgetStatus) => void
  onPeriodChange: (period: BudgetPeriod) => void
  onSortChange: (sort: BudgetSort) => void
}

interface SegmentedOption<TValue extends string> {
  label: string
  value: TValue
  description?: string
}

interface SegmentedControlProps<TValue extends string> {
  id: string
  label: string
  value: TValue
  onChange: (value: TValue) => void
  options: SegmentedOption<TValue>[]
}

function SegmentedControl<TValue extends string>({
  id,
  label,
  value,
  onChange,
  options,
}: SegmentedControlProps<TValue>) {
  const labelId = `${id}-label`

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return

    event.preventDefault()
    const direction = event.key === 'ArrowRight' ? 1 : -1
    const nextIndex = (index + direction + options.length) % options.length
    const nextValue = options[nextIndex]?.value
    if (nextValue) {
      onChange(nextValue)
    }
  }

  return (
    <div>
      <span id={labelId} className="block text-sm font-medium text-muted-foreground mb-2">
        {label}
      </span>
      <div
        role="radiogroup"
        aria-labelledby={labelId}
        className="flex gap-2 rounded-xl border border-border bg-muted/40 p-1 shadow-sm"
        id={id}
      >
        {options.map((option, optionIndex) => {
          const isActive = value === option.value
          return (
            <button
              key={option.value}
              id={`${id}-${option.value}`}
              role="radio"
              aria-checked={isActive}
              type="button"
              onClick={() => onChange(option.value)}
              onKeyDown={(event) => handleKeyDown(event, optionIndex)}
              className={cn(
                'flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                isActive
                  ? 'bg-background text-foreground shadow-elevation-1'
                  : 'text-muted-foreground hover:bg-background/80 hover:text-foreground'
              )}
            >
              <span className="block leading-none">{option.label}</span>
              {option.description ? (
                <span className="mt-1 block text-xs font-normal text-muted-foreground/70">
                  {option.description}
                </span>
              ) : null}
            </button>
          )
        })}
      </div>
    </div>
  )
}

const STATUS_OPTIONS: SegmentedOption<BudgetStatus>[] = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Completed', value: 'completed' },
]

const PERIOD_OPTIONS: SegmentedOption<BudgetPeriod>[] = [
  { label: 'This Month', value: 'this-month' },
  { label: 'Last Month', value: 'last-month' },
  { label: 'Quarter', value: 'quarter' },
  { label: 'Year', value: 'year' },
]

const SORT_OPTIONS: { label: string; value: BudgetSort; description?: string }[] = [
  { label: 'Name (A-Z)', value: 'name-asc' },
  { label: 'Spent (High-Low)', value: 'spent-desc' },
  { label: 'Remaining (Low-High)', value: 'remaining-desc' },
]

export function FilterBar({
  status,
  period,
  sort,
  onStatusChange,
  onPeriodChange,
  onSortChange,
}: FilterBarProps) {
  return (
    <section className="bg-card rounded-xl p-4 shadow-elevation-1">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_2fr_1fr]">
        <SegmentedControl
          id="budget-status-filter"
          label="Status"
          value={status}
          onChange={onStatusChange}
          options={STATUS_OPTIONS}
        />
        <SegmentedControl
          id="budget-period-filter"
          label="Period"
          value={period}
          onChange={onPeriodChange}
          options={PERIOD_OPTIONS}
        />
        <div>
          <span className="block text-sm font-medium text-muted-foreground mb-2">Sort</span>
          <Select value={sort} onValueChange={(nextValue) => onSortChange(nextValue as BudgetSort)}>
            <SelectTrigger className="rounded-xl border-2 border-border bg-background shadow-sm transition-all hover:shadow-md focus:border-ring">
              <SelectValue placeholder="Sort budgets" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </section>
  )
}

export type { BudgetStatus, BudgetPeriod, BudgetSort }
 
EOF
)