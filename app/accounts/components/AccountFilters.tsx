'use client'
import { useEffect, useState } from 'react'
import { Search, X } from 'lucide-react'

interface Props {
  onFiltersChange: (filters: any) => void
}

export default function AccountFilters({ onFiltersChange }: Props) {
  const [search, setSearch] = useState('')
  const [accountType, setAccountType] = useState('all')
  const [status, setStatus] = useState('all')
  const [currency, setCurrency] = useState('all')

  useEffect(() => {
    onFiltersChange({ search, accountType, status, currency })
  }, [search, accountType, status, currency])

  const handleClear = () => {
    setSearch('')
    setAccountType('all')
    setStatus('all')
    setCurrency('all')
  }

  return (
    <div className="bg-card rounded-xl p-4 shadow-elevation-1 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-muted-foreground mb-1">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Account name, institution..."
              className="w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">Account Type</label>
          <select
            value={accountType}
            onChange={(e) => setAccountType(e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
          >
            <option value="all">All types</option>
            <option value="checking">Checking</option>
            <option value="savings">Savings</option>
            <option value="credit_card">Credit Card</option>
            <option value="cash">Cash</option>
            <option value="investment">Investment</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
          >
            <option value="all">All status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

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
