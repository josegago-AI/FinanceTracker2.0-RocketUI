import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

import { RocketThemeProvider } from '@/lib/theme-provider'
import SiteHeaderGate from '@/app/components/layout/SiteHeaderGate'

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
      <body>
        <RocketThemeProvider>
         
          {/* Global Header */}
          <SiteHeaderGate />

          {/* Main content */}
          <main className="pt-16 min-h-screen bg-background">
            {children}
          </main>
        </RocketThemeProvider>
      </body>
    </html>
  )
}