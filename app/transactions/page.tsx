export const metadata = { title: 'Transactions' }
import { format } from 'date-fns'

async function getTransactions() {
  // Server-only helper that already wraps cookies() correctly
  const { createClient } = await import('@/lib/supabase/server')
  const sb = createClient() // ← uses the helper that passes cookieStore internally
  const { data } = await sb.from('transactions').select('*').order('date', { ascending: false })
  return data ?? []
}

export default async function TransactionsPage() {
  const txs = await getTransactions()

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 pt-24">
      <h1 className="text-2xl font-bold mb-6">Transactions</h1>
      <div className="bg-card rounded-xl shadow-elevation-1 overflow-hidden">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/30">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Date</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Payee</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Category</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {txs.map((tx: any) => (
              <tr key={tx.id}>
                <td className="px-4 py-3 text-sm">{format(new Date(tx.date), 'MMM d, yyyy')}</td>
                <td className="px-4 py-3 text-sm font-medium">{tx.payee}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{tx.category}</td>
                <td className={`px-4 py-3 text-sm font-semibold text-right ${tx.amount < 0 ? 'text-red-500' : 'text-green-500'}`}>
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Math.abs(tx.amount))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}