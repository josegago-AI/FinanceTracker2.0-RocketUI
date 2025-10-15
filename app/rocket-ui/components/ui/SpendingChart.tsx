'use client';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

const data = [
  { day: 'Mon', spent: 120 },
  { day: 'Tue', spent: 190 },
  { day: 'Wed', spent: 80 },
  { day: 'Thu', spent: 140 },
  { day: 'Fri', spent: 200 },
  { day: 'Sat', spent: 90 },
  { day: 'Sun', spent: 60 },
];

export default function SpendingChart() {
  return (
    <div className="bg-card rounded-xl p-5 shadow-elevation-1">
      <h3 className="font-semibold mb-4">Spending This Week</h3>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="day" hide />
          <YAxis hide />
          <Tooltip />
          <Area type="monotone" dataKey="spent" stroke="#3b82f6" fillOpacity={1} fill="url(#color)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}