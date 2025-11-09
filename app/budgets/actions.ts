// app/budgets/actions.ts
'use server'

export async function getBudgets() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/budgets`, {
    cache: 'no-store',
  })
  if (!res.ok) throw new Error('Failed to fetch budgets')
  return res.json()
}

export async function createBudget(data: any) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/budgets`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to create budget')
  return res.json()
}

export async function updateBudget(id: string, data: any) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/budgets/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to update budget')
  return res.json()
}

export async function deleteBudget(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/budgets/${id}`, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error('Failed to delete budget')
  return res.json()
}
