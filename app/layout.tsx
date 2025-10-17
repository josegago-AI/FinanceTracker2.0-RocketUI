import { RocketHeader } from '@/app/components/layout/RocketHeader'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <RocketHeader />
        <main className="pt-16"> {/* Account for fixed header */}
          {children}
        </main>
      </body>
    </html>
  )
}