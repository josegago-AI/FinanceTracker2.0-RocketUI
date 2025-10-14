import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
          Welcome to FinanceFlow
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
          Your personal finance tracker. Take control of your money with powerful insights and easy-to-use tools.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/auth/signin"
            className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Sign In
          </Link>
          <Link
            href="/dev-preview"
            className="text-sm font-semibold leading-6 text-gray-900 dark:text-white"
          >
            Dev Preview <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </div>
  )
}