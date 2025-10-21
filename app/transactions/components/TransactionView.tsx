'use client'

import { useMemo, useState, useCallback } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { format } from 'date-fns'
import { Plus, Edit, Trash2 } from 'lucide-react'
import FinancialSummaryCard from '@/app/rocket-ui/components/ui/FinancialSummaryCard'
import TransactionFilters from '@/app/transactions/components/TransactionFilters'
import { AddTransactionModal } from '@/app/transactions/components/AddTransactionModal'
import SavedViewsMenu from '@/app/transactions/components/SavedViewsMenu'

// If you currently use a server action here, you can keep it.
// However, calling server actions directly from client handlers is fragile.
// Prefer an /api route with fetch if you have it available.
// import { deleteTransaction } from '@/app/transactions/action'

type TxRow = any

type QueryLike = {
  q?: string
  dateFrom?: string
  dateTo?: string
  category?: string
  accountId?: string
  tags?: string
  sort?: 'date' | 'amount' | 'payee'
  dir?: 'asc' | 'desc'
  limit?: number
  cursor?: string | null
}

export default function TransactionView({
  stats,
  txs,
  initialQuery,
  nextCursor
}: {
  stats: any
  txs: TxRow[]
  initialQuery?: QueryLike
  nextCursor?: string | null
}) {
  const router = useRouter()
  const pathname = usePathname()
  const sp = useSearchParams()

  // Local UI state (modal/editing); filters kept for compatibility with your existing <TransactionFilters />
  const [filters, setFilters] = useState<{
    search: string
    category: string
    account: string
    dateRange: string
    start: Date | null
    end: Date | null
  }>({
    search: initialQuery?.q ?? '',
    category: (initialQuery?.category as string) ?? 'all',
    account: (initialQuery?.accountId as string) ?? 'all',
    dateRange: 'all',
    start: initialQuery?.dateFrom ? new Date(initialQuery.dateFrom) : null,
    end: initialQuery?.dateTo ? new Date(initialQuery.dateTo) : null
  })

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTx, setEditingTx] = useState<any>(null)

  // --- URL helpers -----------------------------------------------------------

  const setParams = useCallback(
    (patch: Record<string, string | number | boolean | undefined>, { replace = false }: { replace?: boolean } = {}) => {
      const next = new URLSearchParams(sp?.toString())
      for (const [k, v] of Object.entries(patch)) {
        if (v === undefined || v === null || v === '') next.delete(k)
        else next.set(k, String(v))
      }
      // reset pagination when filters/sort change
      next.delete('cursor')
      const url = `${pathname}?${next.toString()}`
      replace ? router.replace(url) : router.push(url)
    },
    [router, pathname, sp]
  )

  const nextSortDir = (field: 'date' | 'amount' | 'payee') => {
    const currSort = (sp.get('sort') as QueryLike['sort']) ?? (initialQuery?.sort ?? 'date')
    const currDir = (sp.get('dir') as QueryLike['dir']) ?? (initialQuery?.dir ?? 'desc')
    if (currSort !== field) return 'desc'
    return currDir === 'asc' ? 'desc' : 'asc'
  }

  // --- Wiring TransactionFilters to URL -------------------------------------

  // Keep your existing TransactionFilters usage, but also push changes to the URL
  const onFiltersChange = (f: typeof filters) => {
    setFilters(f)
    // Map your filter object -> URL params
    setParams({
      q: f.search || undefined,
      category: f.category !== 'all' ? f.category : undefined,
      accountId: f.account !== 'all' ? f.account : undefined,
      dateFrom: f.start ? fmtISO(f.start) : undefined,
      dateTo: f.end ? fmtISO(f.end) : undefined
    })
  }

  // --- Edit/Delete/Modal handlers -------------------------------------------

  const handleEdit = (transaction: any) => {
    setEditingTx(transaction)
    setIsModalOpen(true)
  }

  const handleDelete = async (transaction: any) => {
    if (!confirm(`Are you sure you want to delete "${transaction.payee}"?`)) return
    try {
      // Prefer an API route (recommended):
      await fetch(`/api/transactions/${transaction.id}`, { method: 'DELETE' })

      // If you must keep server action usage, uncomment next 2 lines and ensure it's supported:
      // await deleteTransaction(transaction.id)
      // ^ calling server actions directly in client events can be brittle across Next versions

      // After mutation: reload current URL (preserves filters)
      router.refresh()
    } catch (error) {
      console.error('Error deleting transaction:', error)
      alert('Failed to delete transaction')
    }
  }

  const handleModalSuccess = () => {
    // After add/edit, refresh server data (keeps URL state)
    router.refresh()
  }

  const handleModalOpen = (open: boolean) => {
    setIsModalOpen(open)
    if (!open) setEditingTx(null)
  }

  // --- (Optional) Client-side filtering overlay -----------------------------
  // We keep your previous client filter as a non-breaking enhancement,
  // but ideally the server already returns filtered data based on URL.
  const filtered = useMemo(() => {
    let data = txs
    if (filters.search) {
      const s = filters.search.toLowerCase()
      data = data.filter((t: any) => t.payee?.toLowerCase().includes(s) || t.notes?.toLowerCase().includes(s))
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

  // --- Build Next link (pagination) -----------------------------------------
  const nextHref = (() => {
    if (!nextCursor) return null
    const params = new URLSearchParams(sp?.toString())
    params.set('cursor', String(nextCursor))
    return `${pathname}?${params.toString()}`
  })()

  // --- Render ---------------------------------------------------------------

  return (
    <>
    <div className="max-w-7xl mx-auto px-6 py-8 pt-24">
      {/* Header area with title + Saved Views menu */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <SavedViewsMenu initialQuery={initialQuery} />
      </div>
      
        {/* Rocket Stats Strip */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <FinancialSummaryCard title="Total Income"  amount={stats.totalIncome}  change={0} changeType="neutral" icon="TrendingUp"  iconColor="bg-green-500" />
          <FinancialSummaryCard title="Total Expense" amount={stats.totalExpense} change={0} changeType="neutral" icon="TrendingDown" iconColor="bg-red-500" />
          <FinancialSummaryCard title="Net Savings"   amount={stats.netSavings}   change={0} changeType="neutral" icon="Target"      iconColor="bg-blue-500" />
          <FinancialSummaryCard title="# Transactions" amount={stats.txCount}    change={0} changeType="neutral" icon="CreditCard" iconColor="bg-purple-500" formatter="#"/>
        </div>

        {/* Filters (now wired to URL) */}
        <TransactionFilters onFiltersChange={onFiltersChange} />

        {/* Table */}
        <div className="bg-card rounded-xl shadow-elevation-1 overflow-hidden">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/30">
              <tr>
                <SortableTh
                  label="Date"
                  field="date"
                  onClick={() => setParams({ sort: 'date', dir: nextSortDir('date') })}
                  currentSort={(sp.get('sort') as QueryLike['sort']) ?? (initialQuery?.sort ?? 'date')}
                  currentDir={(sp.get('dir') as QueryLike['dir']) ?? (initialQuery?.dir ?? 'desc')}
                />
                <SortableTh
                  label="Payee"
                  field="payee"
                  onClick={() => setParams({ sort: 'payee', dir: nextSortDir('payee') })}
                  currentSort={(sp.get('sort') as QueryLike['sort']) ?? (initialQuery?.sort ?? 'date')}
                  currentDir={(sp.get('dir') as QueryLike['dir']) ?? (initialQuery?.dir ?? 'desc')}
                />
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Category</th>
                <SortableTh
                  label="Amount"
                  field="amount"
                  align="right"
                  onClick={() => setParams({ sort: 'amount', dir: nextSortDir('amount') })}
                  currentSort={(sp.get('sort') as QueryLike['sort']) ?? (initialQuery?.sort ?? 'date')}
                  currentDir={(sp.get('dir') as QueryLike['dir']) ?? (initialQuery?.dir ?? 'desc')}
                />
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
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">No transactions found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination (URL-preserving) */}
        <div className="mx-auto max-w-7xl px-0 py-6 flex items-center justify-end">
          {nextHref ? (
            <a
              href={nextHref}
              className="inline-flex items-center rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
            >
              Next →
            </a>
          ) : (
            <span className="inline-flex items-center rounded-lg border px-3 py-2 text-sm text-gray-400">
              Next →
            </span>
          )}
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

// --- Small helpers -----------------------------------------------------------

function fmtISO(d: Date) {
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

function SortIcon({
  active,
  dir
}: {
  active: boolean
  dir: 'asc' | 'desc'
}) {
  if (!active) return <span className="text-muted-foreground/60">↕</span>
  return <span>{dir === 'asc' ? '▲' : '▼'}</span>
}

function SortableTh({
  label,
  field,
  align = 'left',
  onClick,
  currentSort,
  currentDir
}: {
  label: string
  field: 'date' | 'amount' | 'payee'
  align?: 'left' | 'right'
  onClick: () => void
  currentSort: QueryLike['sort']
  currentDir: QueryLike['dir']
}) {
  const isActive = currentSort === field
  return (
    <th className={`px-4 py-3 text-${align} text-sm font-medium text-muted-foreground`}>
      <button
        type="button"
        onClick={onClick}
        className="inline-flex items-center gap-1 hover:text-foreground"
        title={`Sort by ${label}`}
      >
        <span>{label}</span>
        <SortIcon active={isActive} dir={isActive ? (currentDir ?? 'desc') : 'desc'} />
      </button>
    </th>
  )
}
