// app/budgets/components/KPIHeader.tsx
'use client'

import { useEffect, useMemo, useState } from 'react'
import { cn } from '@/lib/utils'

type KPIStatus = 'safe' | 'warn' | 'danger'

const KPI_STATUS_COLORS: Record<
  KPIStatus,
  { text: string; bg: string }
> = {
  safe: { text: 'text-green-500', bg: 'bg-green-500' },
  warn: { text: 'text-yellow-500', bg: 'bg-yellow-500' },
  danger: { text: 'text-red-500', bg: 'bg-red-500' },
}

export type KPIItem = {
  key: string
  label: string
  value: string
  delta?: string
  progress?: string
  status: KPIStatus
  icon?: string
}

export interface KPIHeaderProps {
  kpis: KPIItem[]
  activeKpi: string
  onFilterChange: (key: string) => void
}

const KPI_ORDER = [
  'totalAllocated',
  'totalSpent',
  'remaining',
  'otherSpend',
  'overallProgress',
]

export function KPIHeader({ kpis, activeKpi, onFilterChange }: KPIHeaderProps) {
  const [announcement, setAnnouncement] = useState('')

  const orderedKpis = useMemo(() => {
    const prioritized = KPI_ORDER.map((key) =>
      kpis.find((kpi) => kpi.key === key)
    ).filter((kpi): kpi is KPIItem => Boolean(kpi))

    const remaining = kpis.filter(
      (kpi) => !KPI_ORDER.includes(kpi.key)
    )

    return [...prioritized, ...remaining]
  }, [kpis])

  useEffect(() => {
    const activeItem = orderedKpis.find((kpi) => kpi.key === activeKpi)
    if (activeItem) {
      setAnnouncement(`${activeItem.label} selected`)
    }
  }, [activeKpi, orderedKpis])

  return (
    <div className="space-y-2" aria-label="Budget KPIs">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {orderedKpis.map((kpi) => {
          const isActive = kpi.key === activeKpi
          const subtitle = kpi.delta ?? kpi.progress
          const colors = KPI_STATUS_COLORS[kpi.status]

          return (
            <button
              key={kpi.key}
              type="button"
              className={cn(
                'relative overflow-hidden rounded-xl border border-transparent bg-card p-4 text-left transition-all',
                'hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                isActive && 'border-primary bg-primary/5'
              )}
              aria-pressed={isActive}
              onClick={() => onFilterChange(kpi.key)}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    {kpi.icon ? (
                      <span aria-hidden className={cn('text-lg', colors.text)}>
                        {kpi.icon}
                      </span>
                    ) : (
                      <span
                        aria-hidden
                        className={cn('flex h-2 w-2 rounded-full', colors.bg)}
                      />
                    )}
                    <span>{kpi.label}</span>
                  </div>

                  <p className="text-2xl font-semibold">{kpi.value}</p>

                  {subtitle ? (
                    <span
                      className={cn(
                        'inline-flex items-center text-sm font-medium',
                        colors.text
                      )}
                    >
                      {subtitle}
                    </span>
                  ) : null}
                </div>

                {isActive ? (
                  <span className="sr-only">Active</span>
                ) : null}
              </div>
            </button>
          )
        })}
      </div>

      <div aria-live="polite" className="sr-only">
        {announcement}
      </div>
    </div>
  )
}