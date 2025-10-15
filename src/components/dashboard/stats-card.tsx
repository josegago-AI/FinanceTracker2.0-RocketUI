import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/card';

export function StatsCard({ title, value, icon }: any) {
  return (
    <Card className="hover:shadow-elevation-2 transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-2xl font-bold text-primary">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}