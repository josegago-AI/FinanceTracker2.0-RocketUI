'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { BudgetForm } from './budget-form'

interface Budget {
  id: string
  name: string
  category: string
  limit: number
  spent: number
  month: string
  year: string
}

export function BudgetsClient({ initialBudgets }: { initialBudgets: Budget[] }) {
  const [budgets, setBudgets] = useState(initialBudgets)
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="space-y-8">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Your Budgets</h2>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Budget
        </Button>
      </div>

      {/* Budget Grid */}
      {budgets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgets.map((budget) => {
            const percentage = Math.min((budget.spent / budget.limit) * 100, 100)
            const remaining = budget.limit - budget.spent
            const progressColor =
              percentage < 70 ? 'bg-green-500' : percentage < 90 ? 'bg-yellow-500' : 'bg-red-500'

            return (
              <motion.div
                key={budget.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-xl shadow-elevation-1 p-6 border border-border hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{budget.name}</h3>
                    <p className="text-sm text-muted-foreground">{budget.category}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="icon" variant="ghost">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground mb-1">
                  {budget.month} {budget.year}
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-foreground font-medium">
                    ${budget.spent.toLocaleString()}
                  </span>
                  <span className="text-muted-foreground">
                    / ${budget.limit.toLocaleString()}
                  </span>
                </div>

                <div className="relative w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`absolute left-0 top-0 h-2 ${progressColor} transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>

                <p className="mt-2 text-sm text-muted-foreground">
                  Remaining: ${remaining.toLocaleString()}
                </p>
              </motion.div>
            )
          })}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No budgets found. Create your first one!</p>
        </Card>
      )}

      {/* Floating Add Button */}
      <Button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg flex items-center justify-center bg-gradient-to-r from-primary/90 to-primary/70 text-white hover:brightness-110 active:scale-95"
      >
        <Plus className="h-6 w-6" />
      </Button>

      <AnimatePresence>
        {isModalOpen && (
          <BudgetForm onClose={() => setIsModalOpen(false)} onSave={setBudgets} />
        )}
      </AnimatePresence>
    </div>
  )
}
