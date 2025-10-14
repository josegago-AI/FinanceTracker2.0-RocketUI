'use client'

import { useState, useOptimistic, useTransition } from 'react'
import { Pencil, Trash2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { AccountForm } from './account-form'
import { deleteAccount } from './actions'
import { formatCurrency } from '@/lib/utils'

type Account = {
  id: string
  name: string
  type: string
  balance: number
  institution: string | null
  currency: string
  is_active: boolean
}

type AccountsClientProps = {
  initialAccounts: Account[]
}

export function AccountsClient({ initialAccounts }: AccountsClientProps) {
  const [optimisticAccounts, setOptimisticAccounts] = useOptimistic(initialAccounts)
  const [isPending, startTransition] = useTransition()
  const [selectedAccount, setSelectedAccount] = useState<Account | undefined>()
  const [isFormOpen, setIsFormOpen] = useState(false)

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this account?')) return

    setOptimisticAccounts(optimisticAccounts.filter((a) => a.id !== id))

    startTransition(async () => {
      await deleteAccount(id)
    })
  }

  const handleEdit = (account: Account) => {
    setSelectedAccount(account)
    setIsFormOpen(true)
  }

  const handleCreate = () => {
    setSelectedAccount(undefined)
    setIsFormOpen(true)
  }

  const totalBalance = optimisticAccounts
    .filter((a) => a.is_active)
    .reduce((sum, a) => sum + Number(a.balance), 0)

  return (
    <>
      <div className="mb-6 flex justify-between items-center">
        <div className="bg-white dark:bg-gray-800 px-6 py-4 rounded-lg shadow">
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Balance</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(totalBalance)}
          </div>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Account
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        {optimisticAccounts.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <p className="text-lg mb-2">No accounts yet</p>
            <p className="text-sm">Create your first account to start tracking your finances</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Institution</TableHead>
                <TableHead className="text-right">Balance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {optimisticAccounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell className="font-medium">{account.name}</TableCell>
                  <TableCell className="capitalize">
                    {account.type.replace('_', ' ')}
                  </TableCell>
                  <TableCell>{account.institution || '-'}</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(Number(account.balance))}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        account.is_active
                          ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {account.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(account)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(account.id)}
                        disabled={isPending}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <AccountForm
        account={selectedAccount}
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
      />
    </>
  )
}
