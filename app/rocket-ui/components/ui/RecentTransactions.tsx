import { format } from 'date-fns';

interface Tx { id: string; payee: string; amount: number; category: string; date: string; }
export default function RecentTransactions({ transactions }: { transactions: Tx[] }) {
  return (
    <div className="bg-card rounded-xl p-5 shadow-elevation-1">
      <h3 className="font-semibold mb-4">Recent Transactions</h3>
      <ul className="space-y-3">
        {transactions.map((tx) => (
          <li key={tx.id} className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{tx.payee}</p>
              <p className="text-xs text-muted-foreground">{tx.category} • {format(new Date(tx.date), 'MMM d')}</p>
            </div>
            <span className={`font-semibold ${tx.amount < 0 ? 'text-red-500' : 'text-green-500'}`}>
              {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Math.abs(tx.amount))}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}