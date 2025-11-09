// app/budgets/budgets-client.tsx
'use client'

import { useState, useEffect } from 'react'
import { BudgetList } from './components/BudgetList'
import { BudgetEmptyState } from './components/BudgetEmptyState'
import { BudgetForm } from './budget-form'
import { Button } from '@/components/ui/button'
import { getBudgets, createBudget, updateBudget } from './actions'

export default function BudgetsClient() {
  const [budgets, setBudgets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [openForm, setOpenForm] = useState(false)
  const [editBudget, setEditBudget] = useState<any | null>(null)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)
    try {
      const data = await getBudgets()
      setBudgets(data)
    } finally {
      setLoading(false)
    }
  }

  function openCreate() {
    setEditBudget(null)
    setOpenForm(true)
  }

  function openEdit(budget: any) {
    setEditBudget(budget)
    setOpenForm(true)
  }

  async function handleSubmit(formData: any) {
    if (editBudget) {
      await updateBudget(editBudget.id, formData)
    } else {
      await createBudget(formData)
    }
    await load()
    setOpenForm(false)
  }

  return (
    <div>
      <div className="flex justify-between mb-8">
        <h2 className="text-2xl font-semibold">Your Budgets</h2>
        <Button onClick={openCreate}>New Budget</Button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : budgets.length === 0 ? (
        <BudgetEmptyState onCreate={openCreate} />
      ) : (
        <BudgetList budgets={budgets} />
      )}

      {openForm && (
        <BudgetForm
          initialData={editBudget}
          onSubmit={handleSubmit}
          onCancel={() => setOpenForm(false)}
        />
      )}
    </div>
  )
}
