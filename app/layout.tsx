import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

import { RocketThemeProvider } from '@/lib/theme-provider'
import SiteHeaderGate from '@/app/components/layout/SiteHeaderGate'
import { AnimatePresence, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'

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
  const pathname = usePathname()

  return (
    <html lang="en">
      <body className={inter.className}>
        <RocketThemeProvider>
          {/* ✅ Global top navigation bar */}
          <SiteHeaderGate />

          {/* ✅ Animated page transitions */}
          <AnimatePresence mode="wait">
            <motion.main
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="pt-16 min-h-screen bg-background"
            >
              {children}
            </motion.main>
          </AnimatePresence>
        </RocketThemeProvider>
      </body>
    </html>
  )
}
