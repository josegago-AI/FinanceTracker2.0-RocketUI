'use client'
import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import { Plus, Edit, Trash2 } from 'lucide-react'
import FinancialSummaryCard from '@/app/rocket-ui/components/ui/FinancialSummaryCard'
import TransactionFilters from '@/app/transactions/components/TransactionFilters'
import { AddTransactionModal } from '@/app/transactions/components/AddTransactionModal'
import { deleteTransaction } from '@/app/transactions/action'

export default function TransactionView({ stats, txs }: { stats: any; txs: any[] }) {
  const [filters, setFilters] = useState({ search: '', category: 'all', account: 'all', dateRange: 'all', start: null as Date | null, end: null as Date | null })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTx, setEditingTx] = useState<any>(null)

  // Your existing filtered logic stays the same...
  const filtered = useMemo(() => {
    let data = txs
    if (filters.search) {
      const s = filters.search.toLowerCase()
      data = data.filter((t: any) => t.payee.toLowerCase().includes(s) || t.notes?.toLowerCase().includes(s))
    }
    if (filters.category !== 'all') data = data.filter((t: any) => t.category === filters.category)
    if (filters.account !== 'all') data = data.filter((t: any) => t.account === filters.account)
    if (filters.start && filters.end) {
      const startDate = filters.start
      const endDate = filters.end
      data = data.filter((t: any) => new Date(t.date) >= startDate && new Date(t.date) <= endDate)
    }
    return data
  }, [txs, filters])

  // 🔧 ADD THESE FUNCTIONS:
  const handleEdit = (transaction: any) => {
    setEditingTx(transaction)
    setIsModalOpen(true)
  }

  const handleDelete = async (transaction: any) => {
    if (confirm(`Are you sure you want to delete "${transaction.payee}"?`)) {
      try {
        await deleteTransaction(transaction.id)
        window.location.reload() // Refresh to show updated data
      } catch (error) {
        console.error('Error deleting transaction:', error)
        alert('Failed to delete transaction')
      }
    }
  }

  const handleModalSuccess = () => {
    window.location.reload() // Refresh after add/edit
  }

  const handleModalOpen = (open: boolean) => {
    setIsModalOpen(open)
    if (!open) setEditingTx(null) // Clear editing state when closing
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-6 py-8 pt-24">
        <h1 className="text-2xl font-bold mb-6">Transactions</h1>

        {/* Rocket Stats Strip */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <FinancialSummaryCard title="Total Income"  amount={stats.totalIncome}  change={0} changeType="neutral" icon="TrendingUp"  iconColor="bg-green-500" />
          <FinancialSummaryCard title="Total Expense" amount={stats.totalExpense} change={0} changeType="neutral" icon="TrendingDown" iconColor="bg-red-500" />
          <FinancialSummaryCard title="Net Savings"   amount={stats.netSavings}   change={0} changeType="neutral" icon="Target"      iconColor="bg-blue-500" />
          <FinancialSummaryCard title="# Transactions" amount={stats.txCount}    change={0} changeType="neutral" icon="CreditCard" iconColor="bg-purple-500" formatter="#"/>
        </div>

        {/* Filters */}
        <TransactionFilters onFiltersChange={setFilters} />

        {/* Table */}
        <div className="bg-card rounded-xl shadow-elevation-1 overflow-hidden">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/30">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Payee</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Category</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Amount</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((tx: any) => (
                <tr key={tx.id}>
                  <td className="px-4 py-3 text-sm">{format(new Date(tx.date), 'MMM d, yyyy')}</td>
                  <td className="px-4 py-3 text-sm font-medium">{tx.payee}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{tx.category}</td>
                  <td className={`px-4 py-3 text-sm font-semibold text-right ${tx.amount < 0 ? 'text-red-500' : 'text-green-500'}`}>
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Math.abs(tx.amount))}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(tx)}
                        className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                        title="Edit transaction"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(tx)}
                        className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                        title="Delete transaction"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-colors"
      >
        <Plus className="h-6 w-6" />
      </button>

      {/* Add/Edit Transaction Modal */}
      <AddTransactionModal 
        open={isModalOpen} 
        onOpenChange={handleModalOpen}
        transaction={editingTx}
        onSuccess={handleModalSuccess}
      />
    </>
  )
}