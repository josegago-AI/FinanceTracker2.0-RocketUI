export const metadata = { title: 'Categories' }
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

import { unstable_noStore as noStore } from 'next/cache'
import { CategoriesClient } from './categories-client'
import { getCategories } from './actions'

export default async function CategoriesPage() {
  noStore()
  const categories = await getCategories()

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Categories</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
          Organize your transactions with custom categories.
        </p>
      </div>

      <CategoriesClient initialCategories={categories} />
    </div>
  )
}
