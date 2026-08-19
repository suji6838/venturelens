'use client'
import { useEffect, useState } from 'react'
import Dashboard from '@/components/Dashboard'
import { getSession, type User } from '@/lib/auth'

const TOKEN_KEY = 'venturelens_token'

export default function Home() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const saved = sessionStorage.getItem(TOKEN_KEY)
    if (saved) setUser(getSession(saved))
  }, [])

  const logout = () => {
    sessionStorage.removeItem(TOKEN_KEY)
    setUser(null)
  }

  return <Dashboard user={user} onLogout={logout} />
}
