"use client"

import { MoreVertical, Edit } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

import type { UIBudget } from "../utils/transformBudget";

interface BudgetCardProps {
  budget: UIBudget;
}


export function BudgetCard({ budget }: BudgetCardProps) {
  const progress = budget.progress ?? (budget.spent / budget.limit) * 100
  const remaining = budget.limit - budget.spent

  const statusColor = {
    "on-track": "text-green-500",
    "warning": "text-yellow-500",
    "exceeded": "text-red-500"
  }[budget.status ?? "on-track"]

  const barColor = {
    "on-track": "bg-green-500",
    "warning": "bg-yellow-500",
    "exceeded": "bg-red-500"
  }[budget.status ?? "on-track"]

  return (
    <motion.div whileHover={{ scale: 1.02 }}>
      <Card className="p-6 border-border bg-card shadow-sm hover:shadow-md transition-all">
        
        {/* Top row */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-semibold text-lg">{budget.category}</h3>
            <p className="text-sm text-muted-foreground">
              {budget.month}/{budget.year}
            </p>
          </div>

          <div className="flex gap-2 opacity-70 hover:opacity-100 transition">
            <Button variant="ghost" size="sm">
              <Edit size={18} />
            </Button>
            <Button variant="ghost" size="sm">
              <MoreVertical size={18} />
            </Button>
          </div>
        </div>

        {/* Data rows */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Allocated</span>
            <span className="font-medium">${budget.limit}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Spent</span>
            <span className={cn("font-semibold", statusColor)}>
              ${budget.spent}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Remaining</span>
            <span className={remaining >= 0 ? "text-green-500" : "text-red-500"}>
              ${remaining}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">Progress</span>
            <span className={cn("font-medium", statusColor)}>
              {progress.toFixed(1)}%
            </span>
          </div>

          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <motion.div 
              className={`h-2 ${barColor}`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
