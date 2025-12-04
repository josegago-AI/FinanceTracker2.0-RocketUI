// app/budgets/layout.tsx

export const metadata = { title: 'Budgets' }

export default function BudgetsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {children}
    </div>
  )
}
