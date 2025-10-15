export const metadata = { title: 'Dashboard' }
import { formatCurrency, formatDate } from '@/lib/utils'
import { StatsCard } from '@/src/components/dashboard/stats-card'

async function getKPIs() {
  return {
    totalBalance: 12450.75,
    monthlyIncome: 5200.00,
    monthlyExpenses: 3850.25,
    savingsRate: 26.0,
  }
}

async function getRecentTransactions() {
  return [
    {
      id: '1',
      date: new Date().toISOString(),
      payee: 'Grocery Store',
      amount: -85.32,
      type: 'expense',
      category: 'Food & Dining',
    },
    {
      id: '2',
      date: new Date(Date.now() - 86400000).toISOString(),
      payee: 'Salary Deposit',
      amount: 2600.00,
      type: 'income',
      category: 'Salary',
    },
    {
      id: '3',
      date: new Date(Date.now() - 172800000).toISOString(),
      payee: 'Electric Company',
      amount: -120.45,
      type: 'expense',
      category: 'Utilities',
    },
  ]
}

export default async function DashboardPage() {
  const kpis = await getKPIs()
  const recentTransactions = await getRecentTransactions()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
          Welcome back! Here&apos;s your financial overview.
        </p>
      </div>

      {/* Rocket KPI Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatsCard title="Total Balance" value={formatCurrency(kpis.totalBalance)} icon="$" />
        <StatsCard title="Monthly Income" value={formatCurrency(kpis.monthlyIncome)} icon="↑" />
        <StatsCard title="Monthly Expenses" value={formatCurrency(kpis.monthlyExpenses)} icon="↓" />
        <StatsCard title="Savings Rate" value={`${kpis.savingsRate}%`} icon="%" />
      </div>

      {/* Recent Transactions */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
            Recent Transactions
          </h3>
          <div className="flow-root">
            <ul className="-my-5 divide-y divide-gray-200 dark:divide-gray-700">
              {recentTransactions.map((transaction) => (
                <li key={transaction.id} className="py-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        transaction.type === 'income' ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'
                      }`}>
                        <span className={`text-sm font-medium ${
                          transaction.type === 'income' ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {transaction.payee}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {transaction.category} • {formatDate(transaction.date)}
                      </p>
                    </div>
                    <div className="inline-flex items-center text-base font-semibold">
                      <span className={transaction.amount > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                        {formatCurrency(Math.abs(transaction.amount))}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}