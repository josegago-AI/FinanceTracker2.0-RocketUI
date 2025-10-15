import Header from '@/app/rocket-ui/components/ui/Header';
import FinancialSummaryCard from '@/app/rocket-ui/components/ui/FinancialSummaryCard';
import SpendingChart from '@/app/rocket-ui/components/ui/SpendingChart';
import RecentTransactions from '@/app/rocket-ui/components/ui/RecentTransactions';
import { createClient } from '@/lib/supabase/server';

export default async function DashboardPage() {
  const supabase = createClient();

  // Safe fetch with error fallback
  const { data: txs, error } = await supabase
    .from('transactions')
    .select('*')
    .order('date', { ascending: false })
    .limit(5);

  if (error) {
    console.error('Supabase tx fetch:', error);
  }

  const kpis = {
    totalBalance: 12450.75,
    monthlyIncome: 5200,
    monthlyExpenses: 3850.25,
  };

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto px-6 py-8 pt-24">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <FinancialSummaryCard title="Total Balance" amount={kpis.totalBalance} change={5.2} changeType="positive" icon="Wallet" iconColor="bg-blue-500" />
          <FinancialSummaryCard title="Monthly Income" amount={kpis.monthlyIncome} change={0} changeType="neutral" icon="TrendingUp" iconColor="bg-green-500" />
          <FinancialSummaryCard title="Monthly Expenses" amount={kpis.monthlyExpenses} change={-12.3} changeType="positive" icon="TrendingDown" iconColor="bg-orange-500" />
          <FinancialSummaryCard title="Savings Goal" amount={8500} change={15.7} changeType="positive" icon="Target" iconColor="bg-purple-500" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2"><SpendingChart /></div>
          <RecentTransactions transactions={txs ?? []} />
        </div>
      </div>
    </>
  );
}