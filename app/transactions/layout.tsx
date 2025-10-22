export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

import { unstable_noStore as noStore } from 'next/cache'
import { isAuthDisabled } from '@/lib/config/flags'

export default async function TransactionsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  noStore()

  if (!isAuthDisabled) {
    const { redirect } = await import('next/navigation')
    const { getSessionUser } = await import('@/lib/supabase/server')
    const user = await getSessionUser()

    if (!user) {
      redirect('/auth/signin')
    }
  }

  return <>{children}</>
}
