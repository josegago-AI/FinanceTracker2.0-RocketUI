import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function StatsCard({ title, value, icon, trend }) {
  return (
    <Card className="hover:shadow-elevation-2 transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-2xl font-bold text-primary">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className="text-xs text-muted-foreground">{trend}</p>
        )}
      </CardContent>
    </Card>
  )
}