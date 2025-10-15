'use client';
import { Menu, Bell, Sun, Moon } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [dark, setDark] = useState(false);
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-card/80 backdrop-blur flex items-center justify-between px-6 z-40 border-b">
      <div className="flex items-center gap-4">
        <Menu className="w-5 h-5" />
        <span className="font-semibold">FinanceFlow</span>
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