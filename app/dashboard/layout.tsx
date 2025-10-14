export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

import { unstable_noStore as noStore } from 'next/cache'
import Link from 'next/link'
import { Home, CreditCard, Settings, Wallet, FolderOpen } from 'lucide-react'
import { isAuthDisabled } from '@/lib/config/flags'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  noStore()

  if (!isAuthDisabled) {
    const { redirect } = await import('next/navigation')
    const { getSessionUser } = await import('@/lib/supabase/server')
    const user = await getSessionUser()

    if (!user) {
      redirect('/auth/signin')
    }
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-white dark:bg-gray-800 border-r">
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-xl font-semibold">FinanceFlow</h1>
          </div>
          <div className="mt-8 flex-grow flex flex-col">
            <nav className="flex-1 px-2 space-y-1">
              <Link
                href="/dashboard"
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Home className="mr-3 h-5 w-5" />
                Dashboard
              </Link>
              <Link
                href="/dashboard/accounts"
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Wallet className="mr-3 h-5 w-5" />
                Accounts
              </Link>
              <Link
                href="/dashboard/transactions"
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <CreditCard className="mr-3 h-5 w-5" />
                Transactions
              </Link>
              <Link
                href="/dashboard/categories"
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <FolderOpen className="mr-3 h-5 w-5" />
                Categories
              </Link>
              <Link
                href="/settings"
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Settings className="mr-3 h-5 w-5" />
                Settings
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}