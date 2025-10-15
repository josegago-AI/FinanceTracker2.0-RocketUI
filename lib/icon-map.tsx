import React from 'react';
import { Wallet, TrendingUp, TrendingDown, Target } from 'lucide-react';
export const Icon = ({ name, ...props }: { name: string } & React.ComponentProps<'svg'>) => {
  const map: Record<string, React.ElementType> = { Wallet, TrendingUp, TrendingDown, Target };
  const Component = map[name];
  return Component ? <Component {...props} /> : null;
};