// app/budgets/layout.tsx
export const metadata = { title: 'Budgets' }

export default function BudgetsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="min-h-screen bg-background pt-16">
      <div className="max-w-7xl mx-auto px-6 py-8">{children}</div>
    </main>
  )
}
