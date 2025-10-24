export const metadata = { title: 'Accounts' }

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

import { unstable_noStore as noStore } from 'next/cache'
import { AccountsClient } from './accounts-client'
import { getAccounts } from './actions'
import { getAccountStats } from './actions'

export default async function AccountsPage() {
  noStore()
  const [accounts, stats] = await Promise.all([
    getAccounts(),
    getAccountStats(),
  ])

  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Accounts</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your financial accounts and track balances in real time.
        </p>
      </header>

      <AccountsClient initialAccounts={accounts} stats={stats} />
    </main>
  )
}
