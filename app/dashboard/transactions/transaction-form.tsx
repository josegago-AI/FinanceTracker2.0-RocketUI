'use client'

import { useState, useTransition } from 'react'
import { createTransaction, updateTransaction } from './actions'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

type Transaction = {
  id: string
  date: string
  payee: string
  amount: number
  type: string
  notes: string | null
  account: { id: string; name: string }
  category: { id: string; name: string }
}

type Account = {
  id: string
  name: string
}

type Category = {
  id: string
  name: string
  type: string
}

type TransactionFormProps = {
  transaction?: Transaction
  accounts: Account[]
  categories: Category[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TransactionForm({
  transaction,
  accounts,
  categories,
  open,
  onOpenChange,
}: TransactionFormProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState(transaction?.type || 'expense')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = transaction
        ? await updateTransaction(transaction.id, formData)
        : await createTransaction(formData)

      if (result.error) {
        setError(result.error)
      } else {
        onOpenChange(false)
      }
    })
  }

  const filteredCategories = categories.filter((c) => c.type === selectedType)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {transaction ? 'Edit Transaction' : 'Create Transaction'}
            </DialogTitle>
            <DialogDescription>
              {transaction
                ? 'Update transaction details'
                : 'Add a new transaction to track your finances'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
                {error}
              </div>
            )}
            <div className="grid gap-2">
              <label htmlFor="date" className="text-sm font-medium">
                Date *
              </label>
              <input
                id="date"
                name="date"
                type="date"
                defaultValue={transaction?.date || new Date().toISOString().split('T')[0]}
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="type" className="text-sm font-medium">
                Type *
              </label>
              <select
                id="type"
                name="type"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="account_id" className="text-sm font-medium">
                Account *
              </label>
              <select
                id="account_id"
                name="account_id"
                defaultValue={transaction?.account.id}
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select account...</option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="category_id" className="text-sm font-medium">
                Category *
              </label>
              <select
                id="category_id"
                name="category_id"
                defaultValue={transaction?.category.id}
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select category...</option>
                {filteredCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="payee" className="text-sm font-medium">
                Payee *
              </label>
              <input
                id="payee"
                name="payee"
                defaultValue={transaction?.payee}
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="e.g., Walmart, Salary"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="amount" className="text-sm font-medium">
                Amount *
              </label>
              <input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                min="0"
                defaultValue={transaction?.amount}
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="notes" className="text-sm font-medium">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                defaultValue={transaction?.notes || ''}
                rows={3}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Optional notes..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Saving...' : transaction ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
