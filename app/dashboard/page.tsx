function openPlaceholder() {
  alert('Modal coming next step')
}

import AddTxButton from '@/app/rocket-ui/components/ui/AddTxButton'
import Header from '@/app/rocket-ui/components/ui/Header'
import FinancialSummaryCard from '@/app/rocket-ui/components/ui/FinancialSummaryCard'
import SpendingChart from '@/app/rocket-ui/components/ui/SpendingChart'
import RecentTransactions from '@/app/rocket-ui/components/ui/RecentTransactions'
import { createClient } from '@/lib/supabase/server'
import { format } from 'date-fns'

/* ----------  KPIs  ---------- */
async function getKPIs(sb: ReturnType<typeof createClient>) {
  const start = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()
  const end   = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString()

  const [
    { data: income },
    { data: expenses },
    { data: accounts }
  ] = await Promise.all([
    sb.from('transactions').select('amount').eq('type', 'income').gte('date', start).lte('date', end),
    sb.from('transactions').select('amount').eq('type', 'expense').gte('date', start).lte('date', end),
    sb.from('accounts').select('balance').eq('is_active', true)
  ])

  const monthlyIncome   = income?.reduce((s, t) => s + t.amount, 0) ?? 0
  const monthlyExpenses = expenses?.reduce((s, t) => s + Math.abs(t.amount), 0) ?? 0
  const totalBalance    = accounts?.reduce((s, a) => s + a.balance, 0) ?? 0
  const savingsRate     = monthlyIncome ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100 : 0

  return { totalBalance, monthlyIncome, monthlyExpenses, savingsRate }
}

/* ----------  Recent TX  ---------- */
async function getRecentTransactions(sb: ReturnType<typeof createClient>) {
  const { data } = await sb.from('transactions').select('*').order('date', { ascending: false }).limit(5)
  return data ?? []
}

/* ----------  Page  ---------- */
export default async function DashboardPage() {
  const sb    = createClient()        // ← cookies() **inside** top-level Server Component
  const kpis  = await getKPIs(sb)
  const txs   = await getRecentTransactions(sb)

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto px-6 py-8 pt-24">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <FinancialSummaryCard title="Total Balance" amount={kpis.totalBalance} change={0} changeType="neutral" icon="Wallet" iconColor="bg-blue-500" />
          <FinancialSummaryCard title="Monthly Income" amount={kpis.monthlyIncome} change={0} changeType="neutral" icon="TrendingUp" iconColor="bg-green-500" />
          <FinancialSummaryCard title="Monthly Expenses" amount={kpis.monthlyExpenses} change={0} changeType="neutral" icon="TrendingDown" iconColor="bg-orange-500" />
          <FinancialSummaryCard title="Savings Rate" amount={kpis.savingsRate / 100} change={0} changeType="neutral" icon="Target" iconColor="bg-purple-500" formatter="%" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2"><SpendingChart /></div>
          <RecentTransactions transactions={txs} />
        </div>
      </div>
       {/* Floating + button */}
      <AddTxButton onClick={openPlaceholder} />
    </>
  )
}