export const metadata = { title: 'Accounts' }
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

import { unstable_noStore as noStore } from 'next/cache'
import { AccountsClient } from './accounts-client'
import { getAccounts } from './actions'

export default async function AccountsPage() {
  noStore()
  const accounts = await getAccounts()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Accounts</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
          Manage your financial accounts and track balances.
        </p>
      </div>

      <AccountsClient initialAccounts={accounts} />
    </div>
  )
}
