// app/budgets/components/BudgetEmptyState.tsx

import { Button } from '@/components/ui/button'

export function BudgetEmptyState({ onCreate }: { onCreate?: () => void }) {
  return (
    <div className="text-center py-12 opacity-80">
      <p className="mb-4">No budgets created yet.</p>
      {onCreate && (
        <Button onClick={onCreate}>
          Create your first budget
        </Button>
      )}
    </div>
  )
}
