'use client'

import { useState, useTransition } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { BudgetForm } from './budget-form'
import { createBudget, updateBudget, deleteBudget } from './actions'

interface Budget {
  id: string
  name: string
  category: string
  limit: number
  spent: number
  month: string
  year: string
}

interface BudgetsClientProps {
  initialBudgets: Budget[]
}

export function BudgetsClient({ initialBudgets }: BudgetsClientProps) {
  const [budgets, setBudgets] = useState<Budget[]>(initialBudgets)
  const [editing, setEditing] = useState<Budget | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  // ✅ Add a new budget
  const handleAdd = async (data: Omit<Budget, 'id' | 'spent'>) => {
    startTransition(async () => {
      try {
        const payload = {
          category_id: data.category, // match Supabase schema
          amount: data.limit, // match Supabase schema
          month: data.month,
          year: Number(data.year),
        }

        const newBudget = await createBudget(payload)
        setBudgets((prev: Budget[]) => [newBudget, ...prev])
        setIsModalOpen(false)
      } catch (err) {
        console.error('Error creating budget:', err)
      }
    })
  }

  // ✅ Edit an existing budget
  const handleEdit = async (id: string, data: Partial<Budget>) => {
    startTransition(async () => {
      try {
        const updated = await updateBudget(id, {
          ...data,
          year: data.year ? Number(data.year) : undefined,
        })

        setBudgets((prev: Budget[]) =>
          prev.map((b) => (b.id === id ? updated : b))
        )
        setEditing(null)
        setIsModalOpen(false)
      } catch (err) {
        console.error('Error updating budget:', err)
      }
    })
  }

  // ✅ Delete a budget
  const handleDelete = async (id: string) => {
    if (!confirm('Delete this budget?')) return
    startTransition(async () => {
      try {
        await deleteBudget(id)
        setBudgets((prev: Budget[]) => prev.filter((b) => b.id !== id))
      } catch (err) {
        console.error('Error deleting budget:', err)
      }
    })
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Your Budgets</h2>
      </div>
      {/* ...rest of your component (cards, table, modals, etc.) */}
    </div>
  )
}
