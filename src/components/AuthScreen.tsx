'use client'
import { useState } from 'react'
import { login, register, type User } from '@/lib/auth'

type Props = { onAuthenticated: (user: User, token: string) => void }

export default function AuthScreen({ onAuthenticated }: Props) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    if (!email.trim() || !password) return setError('이메일과 비밀번호를 입력해 주세요.')
    if (mode === 'register' && name.trim().length < 2) return setError('이름을 2자 이상 입력해 주세요.')
    setLoading(true)
    try {
      const { user, token } = mode === 'login'
        ? await login(email, password)
        : await register(name, email, password)
      onAuthenticated(user, token)
    } catch (err) {
      setError(err instanceof Error ? err.message : '잠시 후 다시 시도해 주세요.')
    } finally {
      setLoading(false)
    }
  }

  return <main className="auth-page">
    <section className="auth-intro"><div className="auth-brand"><span className="brand-mark">V</span><div><b>VentureLens</b><small>AI INVESTMENT INTELLIGENCE</small></div></div><div><p className="eyebrow">PRIVATE INVESTMENT WORKSPACE</p><h1>더 빠르게,<br /><em>더 선명하게</em> 투자하세요.</h1><p>AI 기반 기업 발굴과 가치 분석을 하나의 투자 워크스페이스에서 경험하세요.</p></div><ul><li>맞춤형 스타트업 발굴</li><li>AI 투자매력도 분석</li><li>데이터 기반 가치 추정</li></ul></section>
    <section className="auth-panel"><div className="auth-card"><p className="eyebrow">WELCOME TO VENTURELENS</p><h2>{mode === 'login' ? '다시 만나 반가워요' : '투자 워크스페이스 시작하기'}</h2><p className="auth-sub">{mode === 'login' ? '계정 정보로 로그인해 주세요.' : '간단한 정보 입력 후 바로 시작할 수 있어요.'}</p><form onSubmit={submit} className="auth-form">
      {mode === 'register' && <label>이름<input value={name} onChange={e => setName(e.target.value)} placeholder="이름을 입력해 주세요" autoComplete="name" /></label>}
      <label>이메일<input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@company.com" autoComplete="email" /></label>
      <label>비밀번호<input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="6자 이상 입력해 주세요" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} /></label>
      {error && <p className="auth-error" role="alert">{error}</p>}
      <button className="auth-submit" disabled={loading}>{loading ? '처리 중…' : mode === 'login' ? '로그인' : '계정 만들기'} <span>→</span></button>
    </form><p className="auth-switch">{mode === 'login' ? '아직 계정이 없으신가요?' : '이미 계정이 있으신가요?'} <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}>{mode === 'login' ? '계정 만들기' : '로그인'}</button></p></div></section>
  </main>
}
