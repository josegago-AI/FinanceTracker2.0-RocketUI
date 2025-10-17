export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

import { unstable_noStore as noStore } from 'next/cache'
import '@/src/styles/globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { isAuthDisabled } from '@/lib/config/flags'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FinanceFlow - Personal Finance Tracker',
  description: 'Track your finances with ease',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  noStore()
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={inter.className}>
        {isAuthDisabled() && (
          <div className="bg-yellow-100 border-b border-yellow-400 px-4 py-2 text-center text-sm text-yellow-900">
            <strong>Authless Dev Mode</strong> - No login required, using admin client
          </div>
        )}
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center">
            <div className="mr-4 flex">
              <a className="mr-6 flex items-center space-x-2" href="/">
                <span className="font-bold">FinanceFlow</span>
              </a>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}