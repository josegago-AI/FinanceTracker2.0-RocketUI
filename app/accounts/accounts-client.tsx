'use client'

import { useState, useOptimistic, useTransition, useMemo } from 'react'
import { Pencil, Trash2, Plus, Edit } from 'lucide-react'
import FinancialSummaryCard from '@/app/rocket-ui/components/ui/FinancialSummaryCard'
import AccountFilters from '@/app/accounts/components/AccountFilters'
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
  stats: {
    totalBalance: number
    activeAccountsCount: number
    accountsByType: Record<string, number>
    monthlyChange: number
  }
}

export function AccountsClient({ initialAccounts, stats }: AccountsClientProps) {
  const [optimisticAccounts, setOptimisticAccounts] = useOptimistic(initialAccounts)
  const [isPending, startTransition] = useTransition()
  const [selectedAccount, setSelectedAccount] = useState<Account | undefined>()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [filters, setFilters] = useState({
    search: '',
    accountType: 'all',
    status: 'all',
    currency: 'all'
  })

  const handleDelete = async (id: string, accountName: string) => {
    if (!confirm(`Are you sure you want to delete "${accountName}"?`)) return

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

  const handleModalSuccess = () => {
    window.location.reload()
  }

  const handleModalOpen = (open: boolean) => {
    setIsFormOpen(open)
    if (!open) setSelectedAccount(undefined)
  }

  const filtered = useMemo(() => {
    let data = optimisticAccounts

    if (filters.search) {
      const s = filters.search.toLowerCase()
      data = data.filter((a: Account) =>
        a.name.toLowerCase().includes(s) ||
        a.institution?.toLowerCase().includes(s)
      )
    }

    if (filters.accountType !== 'all') {
      data = data.filter((a: Account) => a.type === filters.accountType)
    }

    if (filters.status !== 'all') {
      const isActive = filters.status === 'active'
      data = data.filter((a: Account) => a.is_active === isActive)
    }

    if (filters.currency !== 'all') {
      data = data.filter((a: Account) => a.currency === filters.currency)
    }

    return data
  }, [optimisticAccounts, filters])

  const getAccountTypeIcon = (type: string) => {
    switch (type) {
      case 'checking': return '🏦'
      case 'savings': return '🐷'
      case 'credit_card': return '💳'
      case 'cash': return '💵'
      case 'investment': return '📈'
      default: return '💼'
    }
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold mb-6">Accounts</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <FinancialSummaryCard
            title="Total Balance"
            amount={stats.totalBalance}
            change={0}
            changeType="neutral"
            icon="Wallet"
            iconColor="bg-blue-500"
          />
          <FinancialSummaryCard
            title="Active Accounts"
            amount={stats.activeAccountsCount}
            change={0}
            changeType="neutral"
            icon="CreditCard"
            iconColor="bg-green-500"
            formatter="#"
          />
          <FinancialSummaryCard
            title="Account Types"
            amount={Object.keys(stats.accountsByType).length}
            change={0}
            changeType="neutral"
            icon="Target"
            iconColor="bg-orange-500"
            formatter="#"
          />
          <FinancialSummaryCard
            title="Monthly Change"
            amount={stats.monthlyChange}
            change={0}
            changeType="neutral"
            icon="TrendingUp"
            iconColor="bg-teal-500"
          />
        </div>

        <AccountFilters onFiltersChange={setFilters} />

        <div className="bg-card rounded-xl shadow-elevation-1 overflow-hidden">
          {filtered.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="text-5xl mb-4">🏦</div>
              <p className="text-lg font-medium mb-2 text-foreground">No accounts found</p>
              <p className="text-sm text-muted-foreground">
                {optimisticAccounts.length === 0
                  ? 'Create your first account to start tracking your finances'
                  : 'Try adjusting your filters or search terms'}
              </p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted/30">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Account</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Type</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Institution</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Balance</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((account) => (
                  <tr key={account.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{getAccountTypeIcon(account.type)}</span>
                        <span className="text-sm font-medium">{account.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm capitalize text-muted-foreground">
                        {account.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {account.institution || '-'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-sm font-semibold">
                        {formatCurrency(Number(account.balance))}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          account.is_active
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {account.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(account)}
                          className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                          title="Edit account"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(account.id, account.name)}
                          className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                          title="Delete account"
                          disabled={isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <button
        onClick={handleCreate}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-colors"
      >
        <Plus className="h-6 w-6" />
      </button>

      <AccountForm
        account={selectedAccount}
        open={isFormOpen}
        onOpenChange={handleModalOpen}
        onSuccess={handleModalSuccess}
      />
    </>
  )
}
