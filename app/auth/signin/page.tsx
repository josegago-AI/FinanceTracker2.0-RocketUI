import { redirect } from 'next/navigation'
import { isAuthDisabled } from '@/lib/config/flags'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase/browser'
import Link from 'next/link'

export default async function SignInPage() {
  if (isAuthDisabled()) redirect('/dashboard')
  return <SignInForm />
}

function SignInForm() {
  'use client' // ←  MUST be **inside** the function body
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const supabase = supabaseBrowser()
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      router.push('/dashboard')
      router.refresh()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Sign In</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Enter your credentials to access your account</p>
        </div>

        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-3 py-2 border border-input rounded-md bg-background" placeholder="Enter your email" />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">Password</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-3 py-2 border border-input rounded-md bg-background" placeholder="Enter your password" />
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-md">{error}</div>
          )}

          <button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 disabled:opacity-50">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-primary hover:underline">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  )
}