'use client'

import { useState, useTransition } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { BudgetForm } from './budget-form'
import { createBudget, updateBudget, deleteBudget } from './actions'

export function BudgetsClient({ initialBudgets }) {
  const [budgets, setBudgets] = useState(initialBudgets)
  const [editing, setEditing] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  // ✅ Add a new budget
  const handleAdd = async (data) => {
    startTransition(async () => {
      try {
        const newBudget = await createBudget(data)
        setBudgets((prev) => [newBudget, ...prev])
        setIsModalOpen(false)
      } catch (err) {
        console.error('Error creating budget:', err)
      }
    })
  }

  // ✅ Edit an existing budget
  const handleEdit = async (id, data) => {
    startTransition(async () => {
      try {
        const updated = await updateBudget(id, data)
        setBudgets((prev) => prev.map((b) => (b.id === id ? updated : b)))
        setEditing(null)
        setIsModalOpen(false)
      } catch (err) {
        console.error('Error updating budget:', err)
      }
    })
  }

  // ✅ Delete a budget
  const handleDelete = async (id) => {
    if (!confirm('Delete this budget?')) return
    startTransition(async () => {
      try {
        await deleteBudget(id)
        setBudgets((prev) => prev.filter((b) => b.id !== id))
      } catch (err) {
        console.error('Error deleting budget:', err)
      }
    })
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Your Budgets</h2>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Add Budget
        </Button>
      </div>

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
                  <h3 className="text-lg font-semibold">{budget.name}</h3>
                  <p className="text-sm text-muted-foreground">{budget.category}</p>
                </div>
                <div className="flex space-x-2">
                  <Button size="icon" variant="ghost" onClick={() => { setEditing(budget); setIsModalOpen(true) }}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => handleDelete(budget.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="text-sm text-muted-foreground mb-1">
                {budget.month} {budget.year}
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span>${budget.spent.toFixed(2)} spent</span>
                <span>${remaining.toFixed(2)} left</span>
              </div>
              <div className="w-full bg-muted/30 rounded-full h-2">
                <div className={`h-2 rounded-full ${progressColor}`} style={{ width: `${percentage}%` }}></div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <BudgetForm
          initialData={editing}
          onSubmit={(data) => editing ? handleEdit(editing.id, data) : handleAdd(data)}
          onCancel={() => { setIsModalOpen(false); setEditing(null) }}
          loading={isPending}
        />
      )}
    </div>
  )
}
