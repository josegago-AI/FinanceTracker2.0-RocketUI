'use client'

import { useState, useTransition } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { BudgetForm } from './budget-form'
import { createBudget, updateBudget, deleteBudget } from './actions'
import { BudgetCard } from "./components/BudgetCard";
import { transformBudget } from "./utils/transformBudget"

interface Budget {
  id: string
  category_id: string
  amount: number
  month: number
  year: number
  created_at?: string
}

// ✅ DB budget shape (from Supabase)
interface DBBudget {
  id: string
  category_id: string
  amount: number
  month: number
  year: number
  created_at?: string
  spent?: number // may come from SQL view later
}

// ✅ UI budget shape after transformBudget()
interface UIBudget extends DBBudget {
  allocated: number
  spent: number
  remaining: number
  progress: number
  weeklySpending: number[]
  icon: string
  color: string
  period: string
  alertThreshold: number
  lastTransaction: string
  transactionCount: number
}

interface BudgetsClientProps {
  initialBudgets: Budget[]
}

export function BudgetsClient({ initialBudgets }: BudgetsClientProps) {
  const [budgets, setBudgets] = useState<UIBudget[]>(() =>
  initialBudgets.map((b) => transformBudget(b))
)
  const [editing, setEditing] = useState<DBBudget | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  // ✅ Add a new budget
  const handleAdd = async (data: { category_id: string; amount: number; month: number; year: number }) => {
    startTransition(async () => {
      try {
              const payload = {
  category_id: data.category_id,
  amount: data.amount,
  month: String(data.month),   // ✅ convert to string
  year: Number(data.year),     // ✅ stays number
}



        const newBudget = transformBudget(await createBudget(payload))
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
      const payload = {
        category_id: data.category_id,
        amount: data.amount,
        month: data.month !== undefined ? String(data.month) : undefined,
        year: data.year !== undefined ? Number(data.year) : undefined,
      };

      // ✅ Get updated record and transform it
      const updatedItem = transformBudget(await updateBudget(id, payload));

      // ✅ Replace item in state
      setBudgets((prev: Budget[]) =>
        prev.map((b) => (b.id === id ? updatedItem : b))
      );

      setEditing(null);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error updating budget:", err);
    }
  });
};


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
  <div className="space-y-6">

    {/* ✅ Budget grid cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {budgets.map((b) => (
        <BudgetCard key={b.id} budget={b} />
      ))}
    </div>

    {/* ✅ Empty state */}
    {budgets.length === 0 && (
      <p className="text-muted-foreground mt-4">No budgets yet</p>
    )}

    {/* ✅ Debug list (temporary, removable) */}
    <ul className="space-y-2 mt-4">
      {budgets.map((b) => (
        <li
          key={b.id}
          className="flex justify-between rounded-lg border p-3"
        >
          <div>
            <p className="font-medium">
              {b.month}/{b.year} — ${b.amount}
            </p>
            <p className="text-sm text-muted-foreground">
              Category: {b.category_id}
            </p>
          </div>

          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setEditing(b)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="destructive" onClick={() => handleDelete(b.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </li>
      ))}
    </ul>

  </div>
);
}

export default BudgetsClient;
