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
import { TransactionForm } from './transaction-form'
import { deleteTransaction } from './actions'
import { formatCurrency, formatDate } from '@/lib/utils'

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

type TransactionsClientProps = {
  initialTransactions: Transaction[]
  accounts: Account[]
  categories: Category[]
}

export function TransactionsClient({
  initialTransactions,
  accounts,
  categories,
}: TransactionsClientProps) {
  const [optimisticTransactions, setOptimisticTransactions] = useOptimistic(initialTransactions)
  const [isPending, startTransition] = useTransition()
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | undefined>()
  const [isFormOpen, setIsFormOpen] = useState(false)

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this transaction?')) return

    setOptimisticTransactions(optimisticTransactions.filter((t) => t.id !== id))

    startTransition(async () => {
      await deleteTransaction(id)
    })
  }

  const handleEdit = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setIsFormOpen(true)
  }

  const handleCreate = () => {
    setSelectedTransaction(undefined)
    setIsFormOpen(true)
  }

  return (
    <>
      <div className="mb-6 flex justify-end">
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Transaction
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        {optimisticTransactions.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <p className="text-lg mb-2">No transactions yet</p>
            <p className="text-sm">Add your first transaction to start tracking</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Payee</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {optimisticTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="whitespace-nowrap">
                    {formatDate(transaction.date)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'
                        }`}
                      />
                      <span className="font-medium">{transaction.payee}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">
                    {transaction.account.name}
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">
                    {transaction.category.name}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    <span
                      className={
                        transaction.type === 'income'
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }
                    >
                      {transaction.type === 'income' ? '+' : '-'}
                      {formatCurrency(Math.abs(transaction.amount))}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-xs truncate text-gray-500">
                    {transaction.notes || '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(transaction)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(transaction.id)}
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

      <TransactionForm
        transaction={selectedTransaction}
        accounts={accounts}
        categories={categories}
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
      />
    </>
  )
}
