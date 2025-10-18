export const metadata = { title: 'Accounts' }
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

import { unstable_noStore as noStore } from 'next/cache'
import { AccountsClient } from './accounts-client'
import { getAccounts, getAccountStats } from './actions'

export default async function AccountsPage() {
  noStore()
  const accounts = await getAccounts()
  const stats = await getAccountStats()

  return <AccountsClient initialAccounts={accounts} stats={stats} />
}
