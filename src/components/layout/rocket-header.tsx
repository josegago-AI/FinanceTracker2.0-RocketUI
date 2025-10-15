'use client';

import { Search, Download, Plus } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export function RocketHeader({ breadcrumb }: { breadcrumb: string }) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-background/90 border-b border-border shadow-elevation-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: breadcrumb */}
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">FinanceFlow</span>
            <span>›</span>
            <span className="font-medium text-foreground">{breadcrumb}</span>
          </div>

          {/* Middle: search */}
          <div className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search transactions..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background text-sm focus:ring-2 focus:ring-ring focus:outline-none"
              />
            </div>
          </div>

          {/* Right: actions */}
          <div className="flex items-center space-x-3">
            <button className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-input bg-background text-sm hover:bg-accent hover:text-accent-foreground transition">
              <Download className="h-4 w-4" />
              Export
            </button>
            <button className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition">
              <Plus className="h-4 w-4" />
              Add Transaction
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}