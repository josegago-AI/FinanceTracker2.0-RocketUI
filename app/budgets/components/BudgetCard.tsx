// app/budgets/components/BudgetCard.tsx
'use client'

import type {
  AriaRole,
  KeyboardEventHandler,
  MouseEventHandler,
} from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { BudgetProgressBar } from './BudgetProgressBar'

export interface BudgetCardProps {
  name: string
  spent: number
  limit: number
  categoryColor?: string
  className?: string
  onClick?: MouseEventHandler<HTMLDivElement>
  onKeyDown?: KeyboardEventHandler<HTMLDivElement>
  role?: AriaRole
  tabIndex?: number
}

export function BudgetCard({
  name,
  spent,
  limit,
  categoryColor,
className,
  onClick,
  onKeyDown,
  role,
  tabIndex,
}: BudgetCardProps) {
  const remaining = limit - spent

  return (
    <Card
      className={cn('hover:shadow-md transition-shadow', className)}
      onClick={onClick}
      onKeyDown={onKeyDown}
      role={role}
      tabIndex={tabIndex}
    >
      <CardHeader>
        <div className="flex items-center gap-3">
          <div
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: categoryColor ?? '#999' }}
          />
          <h3 className="font-semibold">{name}</h3>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <BudgetProgressBar value={spent} max={limit} />

        <div className="flex justify-between text-sm text-muted-foreground">
          <span>${spent.toFixed(2)} spent</span>
          <span>${remaining.toFixed(2)} left</span>
        </div>
      </CardContent>
    </Card>
  )
}