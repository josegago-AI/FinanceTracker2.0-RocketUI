export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

import { unstable_noStore as noStore } from 'next/cache'
import { TransactionsClient } from './transactions-client'
import { getTransactions, getAccounts, getCategories } from './actions'

export default async function TransactionsPage() {
  noStore()
  const [transactions, accounts, categories] = await Promise.all([
    getTransactions(),
    getAccounts(),
    getCategories(),
  ])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transactions</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
          View and manage all your financial transactions.
        </p>
      </div>

      <TransactionsClient
        initialTransactions={transactions}
        accounts={accounts}
        categories={categories}
      />
    </div>
  )
}