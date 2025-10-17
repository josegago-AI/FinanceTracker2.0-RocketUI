'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { 
  LayoutDashboard, 
  Receipt, 
  PiggyBank, 
  Target, 
  BarChart3, 
  BookOpen,
  Bell,
  Settings,
  User,
  Menu,
  X,
  DollarSign,
  CreditCard,  // 🎯 Added for Accounts
  Tag          // 🎯 Added for Categories
} from 'lucide-react'

interface NavigationItem {
  label: string
  path: string
  icon: React.ComponentType<any>
}

export default function RocketHeader() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigationItems: NavigationItem[] = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Transactions', path: '/transactions', icon: Receipt },
    { label: 'Accounts', path: '/accounts', icon: CreditCard },      // 🎯 ADDED
    { label: 'Categories', path: '/categories', icon: Tag },         // 🎯 ADDED
    { label: 'Budgets', path: '/budgets', icon: PiggyBank },
    { label: 'Goals', path: '/goals', icon: Target },
    { label: 'Reports', path: '/reports', icon: BarChart3 },
    { label: 'Guide', path: '/guide', icon: BookOpen }
  ]

  const isActivePath = (path: string) => pathname === path

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border elevation-1">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo - Rocket-style */}
        <Link href="/dashboard" className="flex items-center space-x-2 hover-lift">
          <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
            <DollarSign className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <span className="text-xl font-semibold text-foreground">FinanceFlow</span>
        </Link>

        {/* Desktop Navigation - Rocket-style */}
        <nav className="hidden md:flex items-center space-x-1">
          {navigationItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105 ${
                  isActivePath(item.path)
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Desktop Actions - Rocket-style */}
        <div className="hidden md:flex items-center space-x-3">
          <Button variant="ghost" size="sm" className="hover:bg-muted">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </Button>
          <Button variant="ghost" size="sm" className="hover:bg-muted">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center hover:bg-muted/80 cursor-pointer">
            <User className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-card border-t border-border elevation-2">
          <nav className="px-6 py-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActivePath(item.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
            <div className="pt-4 mt-4 border-t border-border space-y-2">
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}