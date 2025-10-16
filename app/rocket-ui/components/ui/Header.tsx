'use client';
import { Menu, Bell, Sun, Moon, Home, Wallet, CreditCard, FolderOpen } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [dark, setDark] = useState(false);
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-card/80 backdrop-blur flex items-center justify-between px-6 z-40 border-b">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Menu className="w-5 h-5" />
          <span className="font-semibold">FinanceFlow</span>
        </div>
        <nav className="hidden md:flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center gap-2 text-sm hover:text-primary transition">
            <Home className="w-4 h-4" />
            Dashboard
          </Link>
          <Link href="/accounts" className="flex items-center gap-2 text-sm hover:text-primary transition">
            <Wallet className="w-4 h-4" />
            Accounts
          </Link>
          <Link href="/transactions" className="flex items-center gap-2 text-sm hover:text-primary transition">
            <CreditCard className="w-4 h-4" />
            Transactions
          </Link>
          <Link href="/categories" className="flex items-center gap-2 text-sm hover:text-primary transition">
            <FolderOpen className="w-4 h-4" />
            Categories
          </Link>
        </nav>
      </div>
      <div className="flex items-center gap-3">
        <button onClick={() => setDark(!dark)}>
          {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <Bell className="w-5 h-5" />
      </div>
    </header>
  );
}