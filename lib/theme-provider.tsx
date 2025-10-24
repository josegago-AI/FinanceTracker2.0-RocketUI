'use client'

import React from 'react'

export function RocketThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <div className="theme-rocket bg-background text-foreground transition-colors duration-300">
      {children}
    </div>
  )
}
