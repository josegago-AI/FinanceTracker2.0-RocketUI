import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

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
      <body className={inter.className}>
        
        {/* 🎯 Header gated to not show on /auth/* */}
        <SiteHeaderGate />
        
        
        {/* 🎯 Main content with spacing for fixed header when visible */}
        <main className="pt-16 min-h-screen bg-background">
          {children}
        </main>
      </body>
    </html>
  )
}