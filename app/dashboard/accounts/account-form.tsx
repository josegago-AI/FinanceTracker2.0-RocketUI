'use client'

import { useState, useTransition } from 'react'
import { createAccount, updateAccount } from './actions'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

type Account = {
  id: string
  name: string
  type: string
  balance: number
  institution: string | null
  currency: string
  is_active: boolean
}

type AccountFormProps = {
  account?: Account
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AccountForm({ account, open, onOpenChange }: AccountFormProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = account
        ? await updateAccount(account.id, formData)
        : await createAccount(formData)

      if (result.error) {
        setError(result.error)
      } else {
        onOpenChange(false)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{account ? 'Edit Account' : 'Create Account'}</DialogTitle>
            <DialogDescription>
              {account ? 'Update account details' : 'Add a new financial account to track'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
                {error}
              </div>
            )}
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">
                Account Name *
              </label>
              <input
                id="name"
                name="name"
                defaultValue={account?.name}
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="e.g., Main Checking"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="type" className="text-sm font-medium">
                Account Type *
              </label>
              <select
                id="type"
                name="type"
                defaultValue={account?.type || 'checking'}
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="checking">Checking</option>
                <option value="savings">Savings</option>
                <option value="credit_card">Credit Card</option>
                <option value="cash">Cash</option>
                <option value="investment">Investment</option>
              </select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="balance" className="text-sm font-medium">
                Current Balance
              </label>
              <input
                id="balance"
                name="balance"
                type="number"
                step="0.01"
                defaultValue={account?.balance || 0}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="institution" className="text-sm font-medium">
                Institution
              </label>
              <input
                id="institution"
                name="institution"
                defaultValue={account?.institution || ''}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="e.g., Chase Bank"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="currency" className="text-sm font-medium">
                Currency
              </label>
              <input
                id="currency"
                name="currency"
                defaultValue={account?.currency || 'USD'}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            {account && (
              <div className="flex items-center gap-2">
                <input
                  id="is_active"
                  name="is_active"
                  type="checkbox"
                  defaultChecked={account.is_active}
                  value="true"
                  className="h-4 w-4 rounded border-gray-300"
                />
                <label htmlFor="is_active" className="text-sm font-medium">
                  Active Account
                </label>
              </div>
            )}
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
              {isPending ? 'Saving...' : account ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
