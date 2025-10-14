import { unstable_noStore as noStore } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function getKPIs() {
  noStore()
  const supabase = await createClient()
  
  try {
    // Mock data for now - replace with real Supabase queries
    const mockKPIs = {
      totalBalance: 12450.75,
      monthlyIncome: 5200.00,
      monthlyExpenses: 3850.25,
      savingsRate: 26.0
    }

    // Example of how to query Supabase (uncomment when schema is ready):
    // const { data: transactions } = await supabase
    //   .from('transactions')
    //   .select('amount, type')
    //   .gte('date', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())

    return mockKPIs
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
  const supabase = await createClient()
  
  try {
    // Mock data for now - replace with real Supabase queries
    const mockTransactions = [
      {
        id: '1',
        date: new Date().toISOString(),
        payee: 'Grocery Store',
        amount: -85.32,
        type: 'expense',
        category: 'Food & Dining'
      },
      {
        id: '2',
        date: new Date(Date.now() - 86400000).toISOString(),
        payee: 'Salary Deposit',
        amount: 2600.00,
        type: 'income',
        category: 'Salary'
      },
      {
        id: '3',
        date: new Date(Date.now() - 172800000).toISOString(),
        payee: 'Electric Company',
        amount: -120.45,
        type: 'expense',
        category: 'Utilities'
      }
    ]

    // Example of how to query Supabase (uncomment when schema is ready):
    // const { data: transactions } = await supabase
    //   .from('transactions')
    //   .select('id, date, payee, amount, type, categories(name)')
    //   .order('date', { ascending: false })
    //   .limit(10)

    return mockTransactions
  } catch (error) {
    console.error('Error fetching recent transactions:', error)
    return []
  }
}