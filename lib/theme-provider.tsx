export function RocketThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <div className="theme-rocket bg-background text-foreground transition-colors">
      {children}
    </div>
  )
}
