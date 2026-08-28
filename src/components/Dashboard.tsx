'use client'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import StartupCard, { type Startup } from '@/components/StartupCard'
import StartupDetail from '@/components/StartupDetail'
import InvestmentNewsFeed from '@/components/InvestmentNewsFeed'
import Footer from '@/components/Footer'
import { STARTUPS } from '@/lib/startups'
import type { User } from '@/lib/auth'
import { type Filters, initialFilters, selectOptions, STAGE_OPTIONS } from '@/lib/filters'

type RecommendationsResult = { items: Startup[]; fallback: boolean; reason?: string }

async function fetchRecommendations(filters: Filters): Promise<RecommendationsResult> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 45000) // 실제 뉴스+AI 호출이라 최대 45초까지 기다림, 그 이상이면 폴백
    const response = await fetch('/api/discover', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(filters),
      signal: controller.signal,
    }).finally(() => clearTimeout(timeout))
    if (!response.ok) {
      const body = await response.json().catch(() => ({}))
      throw new Error(typeof body.detail === 'string' ? body.detail : 'AI 추천을 불러오지 못했습니다.')
    }
    const data: Startup[] = await response.json()
    if (!Array.isArray(data)) throw new Error('AI 추천을 불러오지 못했습니다.')
    return { items: data, fallback: false } // 빈 배열은 "조건에 맞는 기업 없음"이라는 정상 결과 — 폴백 대상 아님
  } catch (e) {
    // AI 파이프라인(뉴스+Gemini) 자체가 실패했을 때만 목데이터로 폴백 — 화면이 완전히 비지 않도록 함
    return { items: STARTUPS, fallback: true, reason: e instanceof Error ? e.message : undefined }
  }
}

function fallbackMessage(reason?: string): string {
  if (reason?.includes('429') || reason?.toLowerCase().includes('quota') || reason?.toLowerCase().includes('resource_exhausted')) {
    return 'AI 분석 API 사용량 한도(무료 티어)에 도달해 예시 데이터를 보여드리고 있어요. 잠시 후 다시 시도해 주세요.'
  }
  return '지금 실시간 AI 추천을 불러오지 못해 예시 데이터를 보여드리고 있어요. "AI 추천 기업 찾기"를 다시 눌러보세요.'
}

type Props = { user: User | null; onLogout: () => void }

export default function Dashboard({ user, onLogout }: Props) {
  const [filters, setFilters] = useState<Filters>(initialFilters)
  const [items, setItems] = useState<Startup[]>([])
  const [selected, setSelected] = useState<Startup | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const loadRecommendations = useCallback(async (nextFilters: Filters) => {
    setLoading(true)
    setError('')
    setNotice('')
    try {
      const { items: data, fallback, reason } = await fetchRecommendations(nextFilters)
      setItems(data)
      setSelected(data[0] ?? null)
      if (fallback) setNotice(fallbackMessage(reason))
    } catch (e) {
      setError(e instanceof Error ? e.message : '잠시 후 다시 시도해 주세요.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadRecommendations(initialFilters)
  }, [loadRecommendations])

  const change = (key: keyof Filters, value: string) => setFilters(prev => ({ ...prev, [key]: value }))
  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    loadRecommendations(filters)
  }
  const goHome = (event: React.MouseEvent) => {
    event.preventDefault()
    setFilters(initialFilters)
    loadRecommendations(initialFilters)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const extraSelect = (key: keyof typeof selectOptions, label: string) => (
    <label key={key}>{label}<select value={filters[key]} onChange={e => change(key, e.target.value)}>
      {selectOptions[key].map(option => <option key={option}>{option}</option>)}
    </select></label>
  )

  return <div className="app-shell">
    <header className="topbar">
      <Link href="/" className="brand" onClick={goHome}><span className="brand-mark">V</span><div><b>VentureLens</b><small>AI INVESTMENT INTELLIGENCE</small></div></Link>
      <div className="header-meta"><span className="live"><i /> AI 스코어링 활성</span>{user ? <><span className="user-name">{user.name}님</span><button className="logout" onClick={onLogout}>로그아웃</button></> : <Link className="logout" href="/login">로그인</Link>}</div>
    </header>
    <main className="dashboard">
      <aside className="filter-panel">
        <div><p className="eyebrow">DISCOVERY ENGINE</p><h1>다음 성장 곡선을<br /><em>먼저</em> 발견하세요.</h1><p className="filter-desc">투자 기준을 설정하면 AI가 성장 잠재력과 시장 신호를 종합해 우선순위를 제안합니다.</p></div>
        <form onSubmit={submit}>
          <label>검색 키워드<input value={filters.keyword} onChange={e => change('keyword', e.target.value)} placeholder="기업명 또는 산업 검색" /></label>
          <label>산업<select value={filters.industry} onChange={e => change('industry', e.target.value)}>{['전체 산업', 'AI', '헬스케어', '핀테크', 'SaaS', '로보틱스', '커머스', '바이오', '기후테크'].map(option => <option key={option}>{option}</option>)}</select></label>
          <label>투자 단계<select value={filters.stage} onChange={e => change('stage', e.target.value)}>{['전체 단계', ...STAGE_OPTIONS].map(option => <option key={option}>{option}</option>)}</select></label>
          <label>성장률<select value={filters.growth} onChange={e => change('growth', e.target.value)}><option>성장률 무관</option><option>연 50% 이상</option><option>연 100% 이상</option></select></label>
          <div className="condition-title">기업 조건</div>
          <div className="condition-grid">{extraSelect('recentFunding', '최근 투자유치')}{extraSelect('fundingAmount', '투자금액')}{extraSelect('foundedYear', '설립연도')}{extraSelect('revenue', '매출')}{extraSelect('employees', '직원 수')}{extraSelect('traffic', '트래픽')}{extraSelect('patents', '특허')}{extraSelect('investors', '투자자')}</div>
          <button className="primary" type="submit">AI 추천 기업 찾기 <span>→</span></button>
        </form>
        <div className="filter-note"><b>분석 기준</b><span>시장 · 성장 · 팀 · 경쟁력</span></div>
      </aside>
      <section className="content">
        <div className="content-head"><div><p className="eyebrow">CURATED PIPELINE</p><h2>AI 추천 TOP 5 <span>투자 후보</span></h2></div><p className="updated">실시간 스코어링 · 상위 결과</p></div>
        <section className="kpis"><div><small>분석 기업</small><b>1,248</b><span>이번 주 +84</span></div><div><small>고성장 후보</small><b>36</b><span>연 100%+ 성장</span></div><div><small>평균 매력도</small><b>87.2</b><span>상위 5개 기준</span></div></section>
        {loading && <div className="state">AI가 실시간 뉴스를 분석하고 있습니다… (최대 30초 정도 걸릴 수 있어요)</div>}
        {!loading && notice && <div className="notice">{notice}<button onClick={() => loadRecommendations(filters)}>다시 시도</button></div>}
        {error && <div className="state error">{error}<button onClick={() => loadRecommendations(filters)}>다시 시도</button></div>}
        {!loading && !error && <div className="startup-grid">{items.slice(0, 5).map(item => <StartupCard key={item.id} startup={item} selected={selected?.id === item.id} onSelect={() => setSelected(item)} />)}</div>}
        {!loading && !error && items.length === 0 && <div className="state">조건에 맞는 기업이 없습니다. 조건을 넓혀 다시 찾아보세요.</div>}
        <StartupDetail startup={selected} />
        <InvestmentNewsFeed />
      </section>
    </main>
    <Footer />
  </div>
}
