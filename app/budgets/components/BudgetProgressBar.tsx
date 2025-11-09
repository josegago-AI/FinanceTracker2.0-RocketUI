// app/budgets/components/BudgetProgressBar.tsx
'use client'

import React from 'react'
import { cn } from '@/lib/utils'

export function BudgetProgressBar({
  value,
  max,
}: {
  value: number
  max: number
}) {
  const pct = Math.min(100, Math.round((value / max) * 100))

  return (
    <div className="w-full bg-muted/40 rounded-full h-3 overflow-hidden">
      <div
        className={cn(
          "h-full bg-primary transition-all duration-300",
          pct > 85 && "bg-destructive"
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
