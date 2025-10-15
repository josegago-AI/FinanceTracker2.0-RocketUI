import { Badge } from '@/src/components/ui/badge';
import { formatCurrency, formatDate } from '@/lib/utils';

export function TransactionRow({ tx }: any) {
  const isIncome = tx.amount > 0;
  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
        {formatDate(tx.date)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-3 ${isIncome ? 'bg-green-400' : 'bg-red-400'}`} />
          <span className="text-sm font-medium text-gray-900 dark:text-white">{tx.payee}</span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <Badge className={isIncome ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}>
          {tx.category}
        </Badge>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
        <span className={isIncome ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
          {isIncome ? '+' : ''}{formatCurrency(tx.amount)}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300 max-w-xs truncate">
        {tx.notes}
      </td>
    </tr>
  );
}