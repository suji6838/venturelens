'use client'
import { useEffect, useState } from 'react'
import AuthScreen from '@/components/AuthScreen'
import Dashboard from '@/components/Dashboard'
import { getSession, type User } from '@/lib/auth'

const TOKEN_KEY = 'venturelens_token'

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    const saved = sessionStorage.getItem(TOKEN_KEY)
    if (saved) setUser(getSession(saved))
    setAuthLoading(false)
  }, [])

  const authenticated = (nextUser: User, token: string) => {
    sessionStorage.setItem(TOKEN_KEY, token)
    setUser(nextUser)
  }

  const logout = () => {
    sessionStorage.removeItem(TOKEN_KEY)
    setUser(null)
  }

  if (authLoading) return <div className="auth-loading">VentureLens를 준비하고 있습니다…</div>
  if (!user) return <AuthScreen onAuthenticated={authenticated} />
  return <Dashboard user={user} onLogout={logout} />
}
