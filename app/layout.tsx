import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import RocketHeader from '@/app/components/layout/RocketHeader'

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
        {/* 🎯 Rocket-style header - appears on all pages */}
        <RocketHeader />
        
        {/* 🎯 Main content with proper spacing for fixed header */}
        <main className="pt-16 min-h-screen bg-background">
          {children}
        </main>
      </body>
    </html>
  )
}