'use client'
import { useCallback, useEffect, useState } from 'react'
import StartupCard, { type Startup } from '@/components/StartupCard'
import StartupDetail from '@/components/StartupDetail'
import { STARTUPS } from '@/lib/startups'

type Filters = {
  industry: string; stage: string; growth: string; keyword: string; recentFunding: string
  fundingAmount: string; foundedYear: string; revenue: string; employees: string
  traffic: string; patents: string; investors: string
}

const initialFilters: Filters = {
  industry: '전체 산업', stage: '전체 단계', growth: '성장률 무관', keyword: '',
  recentFunding: '무관', fundingAmount: '무관', foundedYear: '무관', revenue: '무관',
  employees: '무관', traffic: '무관', patents: '무관', investors: '무관'
}

const selectOptions = {
  recentFunding: ['무관', '최근 6개월', '최근 1년', '최근 2년'],
  fundingAmount: ['무관', '10억원 이상', '30억원 이상', '100억원 이상'],
  foundedYear: ['무관', '2024년 이후', '2021~2023년', '2020년 이전'],
  revenue: ['무관', '1억원 이상', '10억원 이상', '50억원 이상'],
  employees: ['무관', '10명 이상', '30명 이상', '100명 이상'],
  traffic: ['무관', '월 1만 이상', '월 10만 이상', '월 100만 이상'],
  patents: ['무관', '1건 이상', '5건 이상', '10건 이상'],
  investors: ['무관', '기관 투자자 보유', '글로벌 투자자 보유', '후속 투자 유치']
}

function fetchRecommendations(): Promise<Startup[]> {
  return new Promise(resolve => setTimeout(() => resolve(STARTUPS), 500))
}

export default function Home() {
  const [filters, setFilters] = useState<Filters>(initialFilters)
  const [items, setItems] = useState<Startup[]>([])
  const [selected, setSelected] = useState<Startup | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadRecommendations = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await fetchRecommendations()
      setItems(data)
      setSelected(data[0] ?? null)
    } catch (e) {
      setError(e instanceof Error ? e.message : '잠시 후 다시 시도해 주세요.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadRecommendations()
  }, [loadRecommendations])

  const change = (key: keyof Filters, value: string) => setFilters(prev => ({ ...prev, [key]: value }))
  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    loadRecommendations()
  }
  const extraSelect = (key: keyof typeof selectOptions, label: string) => (
    <label key={key}>{label}<select value={filters[key]} onChange={e => change(key, e.target.value)}>
      {selectOptions[key].map(option => <option key={option}>{option}</option>)}
    </select></label>
  )

  return <div className="app-shell">
    <header className="topbar">
      <div className="brand"><span className="brand-mark">V</span><div><b>VentureLens</b><small>AI INVESTMENT INTELLIGENCE</small></div></div>
      <div className="header-meta"><span className="live"><i /> AI 스코어링 활성</span><span>투자 발굴 워크스페이스</span></div>
    </header>
    <main className="dashboard">
      <aside className="filter-panel">
        <div><p className="eyebrow">DISCOVERY ENGINE</p><h1>다음 성장 곡선을<br /><em>먼저</em> 발견하세요.</h1><p className="filter-desc">투자 기준을 설정하면 AI가 성장 잠재력과 시장 신호를 종합해 우선순위를 제안합니다.</p></div>
        <form onSubmit={submit}>
          <label>검색 키워드<input value={filters.keyword} onChange={e => change('keyword', e.target.value)} placeholder="기업명 또는 산업 검색" /></label>
          <label>산업<select value={filters.industry} onChange={e => change('industry', e.target.value)}>{['전체 산업', 'AI', '헬스케어', '핀테크', 'SaaS', '로보틱스', '커머스', '바이오', '기후테크'].map(option => <option key={option}>{option}</option>)}</select></label>
          <label>투자 단계<select value={filters.stage} onChange={e => change('stage', e.target.value)}>{['전체 단계', 'Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C+'].map(option => <option key={option}>{option}</option>)}</select></label>
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
        {loading && <div className="state">AI가 투자 후보를 분석하고 있습니다…</div>}
        {error && <div className="state error">{error}<button onClick={() => loadRecommendations()}>다시 시도</button></div>}
        {!loading && !error && <div className="startup-grid">{items.map(item => <StartupCard key={item.id} startup={item} selected={selected?.id === item.id} onSelect={() => setSelected(item)} />)}</div>}
        {!loading && !error && items.length === 0 && <div className="state">조건에 맞는 기업이 없습니다. 조건을 넓혀 다시 찾아보세요.</div>}
        <StartupDetail startup={selected} />
      </section>
    </main>
  </div>
}
