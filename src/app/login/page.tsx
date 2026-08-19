'use client'
import { useRouter } from 'next/navigation'
import AuthScreen from '@/components/AuthScreen'
import type { User } from '@/lib/auth'

const TOKEN_KEY = 'venturelens_token'

export default function LoginPage() {
  const router = useRouter()

  const authenticated = (_user: User, token: string) => {
    sessionStorage.setItem(TOKEN_KEY, token)
    router.push('/')
  }

  return <AuthScreen onAuthenticated={authenticated} />
}
