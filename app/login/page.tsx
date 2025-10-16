'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    setLoading(false)

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      setMessage({ type: 'success', text: 'Check your email for the login link!' })
      setEmail('')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <svg className="text-foreground" height="40" viewBox="0 0 256 256" width="40" xmlns="http://www.w3.org/2000/svg">
              <path d="M148 64a12 12 0 1 1-12-12a12 12 0 0 1 12 12Zm-12 52a12 12 0 1 0 12 12a12 12 0 0 0-12-12Zm0 64a12 12 0 1 0 12 12a12 12 0 0 0-12-12Zm-80-92v-4a8 8 0 0 1 16 0v4h112v-4a8 8 0 0 1 16 0v4a24 24 0 0 1 24 24v88a24 24 0 0 1-24 24H40a24 24 0 0 1-24-24v-88a24 24 0 0 1 24-24Zm160 24H40v88h160Z" fill="currentColor"></path>
            </svg>
            <h1 className="text-3xl font-bold">WhatToDo</h1>
          </div>
          <p className="text-muted-foreground">
            Your personal media tracker and curator
          </p>
        </div>

        <div className="bg-card rounded-xl p-6 shadow-soft">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full h-12 px-4 rounded-lg bg-primary/10 dark:bg-primary/20 border-none placeholder:text-foreground/50 focus:ring-2 focus:ring-primary"
              />
            </div>

            {message && (
              <div
                className={`p-3 rounded-lg text-sm ${
                  message.type === 'success'
                    ? 'bg-primary/20 text-primary'
                    : 'bg-destructive/20 text-destructive'
                }`}
              >
                {message.text}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 flex items-center justify-center rounded-lg bg-primary text-white font-bold shadow-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send magic link'}
            </button>

            <p className="text-xs text-center text-muted-foreground">
              We&apos;ll send you a magic link to sign in without a password.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

