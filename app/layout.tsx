import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

import { RocketThemeProvider } from '@/lib/theme-provider'
import SiteHeaderGate from '@/app/components/layout/SiteHeaderGate'
import { PageTransition } from '@/app/components/layout/PageTransition'
import PathnameWrapper from '@/app/components/layout/PathnameWrapper'


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FinanceFlow - Personal Finance Tracker',
  description: 'Track your finances with Rocket-powered UI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <RocketThemeProvider>
          {/* ✅ Global top navigation bar */}
          
          <SiteHeaderGate />
          <main className="pt-20 min-h-screen bg-background">
              <PathnameWrapper>
              {children}
              </PathnameWrapper>
            </main>
        </RocketThemeProvider>
      </body>
    </html>
  )
}
