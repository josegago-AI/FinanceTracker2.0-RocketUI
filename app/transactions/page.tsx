export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server'
import { formatCurrency, formatDate } from '@/lib/utils'

async function getTransactions() {
  const supabase = createClient()
  
  try {
    // Mock data for now - replace with real Supabase queries
    const mockTransactions = [
      {
        id: '1',
        date: new Date().toISOString(),
        payee: 'Grocery Store',
        amount: -85.32,
        type: 'expense',
        category: 'Food & Dining',
        notes: 'Weekly groceries'
      },
      {
        id: '2',
        date: new Date(Date.now() - 86400000).toISOString(),
        payee: 'Salary Deposit',
        amount: 2600.00,
        type: 'income',
        category: 'Salary',
        notes: 'Monthly salary'
      },
      {
        id: '3',
        date: new Date(Date.now() - 172800000).toISOString(),
        payee: 'Electric Company',
        amount: -120.45,
        type: 'expense',
        category: 'Utilities',
        notes: 'Monthly electric bill'
      },
      {
        id: '4',
        date: new Date(Date.now() - 259200000).toISOString(),
        payee: 'Coffee Shop',
        amount: -4.50,
        type: 'expense',
        category: 'Food & Dining',
        notes: 'Morning coffee'
      },
      {
        id: '5',
        date: new Date(Date.now() - 345600000).toISOString(),
        payee: 'Gas Station',
        amount: -45.20,
        type: 'expense',
        category: 'Transportation',
        notes: 'Fill up tank'
      }
    ]

    // Example of how to query Supabase (uncomment when schema is ready):
    // const { data: transactions } = await supabase
    //   .from('transactions')
    //   .select(`
    //     id,
    //     date,
    //     payee,
    //     amount,
    //     type,
    //     notes,
    //     categories(name)
    //   `)
    //   .order('date', { ascending: false })

    return mockTransactions
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return []
  }
}

export default async function TransactionsPage() {
  const transactions = await getTransactions()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transactions</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
          View and manage all your financial transactions.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Payee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {formatDate(transaction.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-3 ${
                          transaction.type === 'income' ? 'bg-green-400' : 'bg-red-400'
                        }`} />
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {transaction.payee}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {transaction.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <span className={transaction.amount > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                        {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300 max-w-xs truncate">
                      {transaction.notes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}