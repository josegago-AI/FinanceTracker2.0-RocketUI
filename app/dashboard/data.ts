import { unstable_noStore as noStore } from 'next/cache'
import { getSupabaseClient, getUserId } from '@/lib/supabase/helpers'

export async function getKPIs() {
  noStore()

  const supabase = await getSupabaseClient()
  const userId = await getUserId()

  try {
    if (!userId) {
      return {
        totalBalance: 0,
        monthlyIncome: 0,
        monthlyExpenses: 0,
        savingsRate: 0
      }
    }

    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const { data: accounts } = await supabase
      .from('accounts')
      .select('balance')
      .eq('user_id', userId)
      .eq('is_active', true)

    const totalBalance = accounts?.reduce((sum, acc) => sum + Number(acc.balance), 0) || 0

    const { data: transactions } = await supabase
      .from('transactions')
      .select('amount, type')
      .eq('user_id', userId)
      .gte('date', startOfMonth.toISOString().split('T')[0])

    let monthlyIncome = 0
    let monthlyExpenses = 0

    transactions?.forEach((t) => {
      const amount = Number(t.amount)
      if (t.type === 'income') {
        monthlyIncome += amount
      } else if (t.type === 'expense') {
        monthlyExpenses += amount
      }
    })

    const savingsRate = monthlyIncome > 0
      ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100
      : 0

    return {
      totalBalance,
      monthlyIncome,
      monthlyExpenses,
      savingsRate: Number(savingsRate.toFixed(1))
    }
  } catch (error) {
    console.error('Error fetching KPIs:', error)
    return {
      totalBalance: 0,
      monthlyIncome: 0,
      monthlyExpenses: 0,
      savingsRate: 0
    }
  }
}

export async function getRecentTransactions() {
  noStore()

  const supabase = await getSupabaseClient()
  const userId = await getUserId()

  try {
    if (!userId) {
      return []
    }

    const { data: transactions, error } = await supabase
      .from('transactions')
      .select(`
        id,
        date,
        payee,
        amount,
        type,
        categories (
          name
        )
      `)
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(10)

    if (error) {
      console.error('Error fetching transactions:', error)
      return []
    }

    return transactions.map((t: any) => ({
      id: t.id,
      date: t.date,
      payee: t.payee,
      amount: Number(t.amount),
      type: t.type,
      category: t.categories?.name || 'Uncategorized'
    }))
  } catch (error) {
    console.error('Error fetching recent transactions:', error)
    return []
  }
}
