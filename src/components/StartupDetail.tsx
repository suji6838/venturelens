'use client'
import { useState } from 'react'
import type { Startup } from './StartupCard'
type Props = { startup: Startup | null }
export default function StartupDetail({ startup }: Props) {
  const [tab, setTab] = useState<'analysis' | 'valuation' | 'history'>('analysis')
  if (!startup) return <section className="detail empty"><span>◌</span><h2>분석할 기업을 선택하세요</h2><p>추천 카드에서 기업을 고르면 AI 분석과 가치 추정을 확인할 수 있습니다.</p></section>
  return <section className="detail" aria-live="polite">
    <div className="detail-head"><div><p className="eyebrow">AI INVESTMENT BRIEF</p><h2>{startup.name}</h2><p>{startup.summary}</p></div><div className="detail-score"><b>{startup.score}</b><span>투자매력도</span></div></div>
    <div className="tabs" role="tablist">
      <button className={tab === 'analysis' ? 'active' : ''} onClick={() => setTab('analysis')} role="tab">AI 분석</button>
      <button className={tab === 'valuation' ? 'active' : ''} onClick={() => setTab('valuation')} role="tab">가치 추정</button>
      <button className={tab === 'history' ? 'active' : ''} onClick={() => setTab('history')} role="tab">투자 이력</button>
    </div>
    {tab === 'analysis' && <div className="analysis-grid">
      <article><span>01</span><h3>사업모델</h3><p>{startup.model}</p></article><article><span>02</span><h3>시장성</h3><p>{startup.market}</p></article><article><span>03</span><h3>성장성</h3><p>{startup.growth_text}</p></article><article><span>04</span><h3>경쟁력</h3><p>{startup.competition}</p></article>
    </div>}
    {tab === 'valuation' && <><div className="valuation-intro"><span>AI VALUATION</span><div><h3>동종기업 · 투자배수 · 성장성 기반 기업가치 추정</h3><p>유사 기업의 거래 사례와 성장 지표를 함께 반영해 추정 범위와 적정가치를 산정합니다.</p></div></div><div className="valuation"><div className="value-main"><p>추정 기업가치 범위</p><strong>{startup.valuation}</strong><span>적정가치 <b>{startup.fair}</b></span></div><div className="confidence"><p>AI 산정 신뢰도</p><div className="bar"><i style={{width: `${startup.confidence}%`}} /></div><b>{startup.confidence}% · 높음</b><p className="basis">{startup.basis}</p></div></div></>}
    {tab === 'history' && <div className="history">{startup.history.map(item => <div key={item}><span>●</span>{item}</div>)}</div>}
  </section>
}
