'use client'

import { usePathname } from 'next/navigation'
import RocketHeader from '@/app/components/layout/RocketHeader'

export default function SiteHeaderGate() {
  const pathname = usePathname()
  // Hide header on auth routes
  if (pathname?.startsWith('/auth')) return null
  return <RocketHeader />
}