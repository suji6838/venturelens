'use client'
import { useEffect, useState } from 'react'
import type { InvestmentNewsItem } from '@/lib/naverNews'

function formatDate(pubDate: string): string {
  const d = new Date(pubDate)
  if (Number.isNaN(d.getTime())) return pubDate
  return `${d.getMonth() + 1}.${d.getDate()}`
}

export default function InvestmentNewsFeed() {
  const [items, setItems] = useState<InvestmentNewsItem[] | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    fetch('/api/investment-news')
      .then(async res => {
        const data = await res.json()
        if (!res.ok) throw new Error(data.detail || '뉴스를 불러오지 못했습니다.')
        return data as InvestmentNewsItem[]
      })
      .then(data => { if (!cancelled) setItems(data) })
      .catch(e => { if (!cancelled) setError(e instanceof Error ? e.message : '뉴스를 불러오지 못했습니다.') })
    return () => { cancelled = true }
  }, [])

  return <section className="news-feed">
    <div className="content-head"><div><p className="eyebrow">LIVE NEWS SIGNAL</p><h2>최근 투자유치 뉴스</h2></div><p className="updated">네이버 뉴스 실시간 연동</p></div>
    {error && <div className="state error">{error}</div>}
    {!error && !items && <div className="state">투자유치 뉴스를 불러오는 중…</div>}
    {!error && items && items.length === 0 && <div className="state">최근 투자유치 관련 뉴스가 없습니다.</div>}
    {!error && items && items.length > 0 && <ul className="news-list">
      {items.map(item => (
        <li key={item.link}>
          <a href={item.link} target="_blank" rel="noopener noreferrer">{item.title}</a>
          <div className="news-meta"><span>{item.source}</span><span>{formatDate(item.publishedAt)}</span></div>
        </li>
      ))}
    </ul>}
  </section>
}
