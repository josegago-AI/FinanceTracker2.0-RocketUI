export const metadata = { title: 'Transactions' }
import { format } from 'date-fns'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import FinancialSummaryCard from '@/app/rocket-ui/components/ui/FinancialSummaryCard'

/* ----------  stats  ---------- */
async function getTransactionStats(sb: ReturnType<typeof createClient>) {
  const start = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()
  const end   = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString()

  const [
    { data: income },
    { data: expense },
    { data: count }
  ] = await Promise.all([
    sb.from('transactions').select('amount').eq('type', 'income').gte('date', start).lte('date', end),
    sb.from('transactions').select('amount').eq('type', 'expense').gte('date', start).lte('date', end),
    sb.from('transactions').select('*', { head: true, count: 'exact' }).gte('date', start).lte('date', end)
  ])

  const totalIncome  = income?.reduce((s, t) => s + t.amount, 0) ?? 0
  const totalExpense = expense?.reduce((s, t) => s + Math.abs(t.amount), 0) ?? 0
  const netSavings   = totalIncome - totalExpense
  const txCount      = count ?? 0

  return { totalIncome, totalExpense, netSavings, txCount }
}

async function getTransactions(sb: ReturnType<typeof createClient>) {
  const { data } = await sb.from('transactions').select('*').order('date', { ascending: false })
  return data ?? []
}

/* ----------  page  ---------- */
export default async function TransactionsPage() {
  const sb    = createClient(cookies())
  const stats = await getTransactionStats(sb)
  const txs   = await getTransactions(sb)

  return (
    <>
      <div className="max-w-7xl mx-auto px-6 py-8 pt-24">
        <h1 className="text-2xl font-bold mb-6">Transactions</h1>

        {/* Rocket Stats Strip */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <FinancialSummaryCard title="Total Income"  amount={stats.totalIncome}  change={0} changeType="neutral" icon="TrendingUp"  iconColor="bg-green-500" />
          <FinancialSummaryCard title="Total Expense" amount={stats.totalExpense} change={0} changeType="neutral" icon="TrendingDown" iconColor="bg-red-500" />
          <FinancialSummaryCard title="Net Savings"   amount={stats.netSavings}   change={0} changeType="neutral" icon="Target"      iconColor="bg-blue-500" />
          <FinancialSummaryCard title="# Transactions" amount={stats.txCount}    change={0} changeType="neutral" icon="CreditCard" iconColor="bg-purple-500" formatter="#"/>
        </div>

        {/* Table (simple for now) */}
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
    </>
  )
}