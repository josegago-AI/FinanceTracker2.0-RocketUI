export const metadata = { title: 'Transactions' }
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import TransactionView from '@/app/transactions/components/TransactionView'

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

export default async function TransactionsPage() {
  const sb    = createClient(cookies())
  const stats = await getTransactionStats(sb)
  const txs   = await getTransactions(sb)

  return <TransactionView stats={stats} txs={txs} />
}