import { Icon } from '@/lib/icon-map';

interface Props {
  title: string;
  amount: number;
  change: number;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: string;
  iconColor: string;
  formatter?: '$' | '%' | '#';
}

export default function FinancialSummaryCard({
  title,
  amount,
  change,
  changeType,
  icon,
  iconColor,
  formatter = '$',
}: Props) {
  const flag = changeType === 'positive' ? '+' : changeType === 'negative' ? '-' : '';

  const display =
  formatter === '#' ? String(Math.round(amount)) :
  formatter === '%' ? `${(amount * 100).toFixed(1)}%` :
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  return (
    <div className="bg-card rounded-xl p-5 shadow-elevation-1">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-muted-foreground">{title}</span>
        <Icon name={icon} className={`w-6 h-6 ${iconColor} text-white rounded-full p-1`} />
      </div>
      <div className="text-2xl font-semibold">{display}</div>
      {change !== 0 && (
        <div className={`text-xs mt-1 ${changeType === 'positive' ? 'text-green-500' : 'text-red-500'}`}>
          {flag}{Math.abs(change)} %
        </div>
      )}
    </div>
  );
}