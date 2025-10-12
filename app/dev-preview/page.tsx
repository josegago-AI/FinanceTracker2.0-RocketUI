export default function DevPreviewPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Dev Preview - Health Check
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
          ✅ Next.js 14 App Router is working
        </p>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
          ✅ Tailwind CSS is loaded
        </p>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
          ✅ TypeScript compilation successful
        </p>
        <div className="mt-8 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <p className="text-green-800 dark:text-green-200">
            🎉 App is ready for Supabase integration!
          </p>
        </div>
        <div className="mt-6">
          <a
            href="/"
            className="text-primary hover:text-primary/80 font-medium"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}