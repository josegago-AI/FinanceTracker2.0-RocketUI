'use client'
import { useEffect, useState } from 'react'
import { Search, X, Calendar } from 'lucide-react'

interface Props {
  onFiltersChange: (filters: any) => void
}

export default function TransactionFilters({ onFiltersChange }: Props) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [account, setAccount] = useState('all')
  const [dateRange, setDateRange] = useState('all')

  // simple date helper
  const getDateBoundaries = (range: string) => {
    const now = new Date()
    switch (range) {
      case 'today': return { start: new Date(now.getFullYear(), now.getMonth(), now.getDate()), end: now }
      case 'week':  return { start: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), end: now }
      case 'month': return { start: new Date(now.getFullYear(), now.getMonth(), 1), end: new Date(now.getFullYear(), now.getMonth() + 1, 0) }
      case 'year':  return { start: new Date(now.getFullYear(), 0, 1), end: new Date(now.getFullYear(), 11, 31) }
      default: return { start: null, end: null }
    }
  }

  useEffect(() => {
    const { start, end } = getDateBoundaries(dateRange)
    onFiltersChange({ search, category, account, dateRange, start, end })
  }, [search, category, account, dateRange])

  const handleClear = () => {
    setSearch(''); setCategory('all'); setAccount('all'); setDateRange('all')
  }

  return (
    <div className="bg-card rounded-xl p-4 shadow-elevation-1 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
        {/* Search */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-muted-foreground mb-1">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Payee, notes, tags..."
              className="w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background text-sm"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
          >
            <option value="all">All categories</option>
            <option value="food">Food & Dining</option>
            <option value="transport">Transportation</option>
            <option value="shopping">Shopping</option>
            <option value="entertainment">Entertainment</option>
            <option value="bills">Bills & Utilities</option>
            <option value="healthcare">Healthcare</option>
            <option value="income">Income</option>
          </select>
        </div>

        {/* Account */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">Account</label>
          <select
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
          >
            <option value="all">All accounts</option>
            <option value="checking">Checking</option>
            <option value="savings">Savings</option>
            <option value="credit">Credit Card</option>
            <option value="cash">Cash</option>
          </select>
        </div>

        {/* Date Range */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">Date</label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
          >
            <option value="all">All time</option>
            <option value="today">Today</option>
            <option value="week">This week</option>
            <option value="month">This month</option>
            <option value="year">This year</option>
          </select>
        </div>

        {/* Clear */}
        <div className="flex items-end">
          <button
            onClick={handleClear}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-input rounded-md bg-background hover:bg-muted text-sm"
          >
            <X className="w-4 h-4" />
            Clear
          </button>
        </div>
      </div>
    </div>
  )
}