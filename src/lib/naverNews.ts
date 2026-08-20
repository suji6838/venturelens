export type InvestmentNewsItem = {
  title: string
  summary: string
  link: string
  source: string
  publishedAt: string
}

const NAVER_API_BASE = 'https://naverapihub.apigw.ntruss.com'

function stripHtml(text: string): string {
  return text
    .replace(/<[^>]+>/g, '')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
}

function hostnameOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return ''
  }
}

type NaverNewsApiItem = {
  title: string
  description: string
  link: string
  originallink: string
  pubDate: string
}

export async function fetchInvestmentNews(query = '스타트업 투자유치', display = 10): Promise<InvestmentNewsItem[]> {
  const clientId = process.env.NAVER_CLIENT_ID
  const clientSecret = process.env.NAVER_CLIENT_SECRET
  if (!clientId || !clientSecret) throw new Error('NAVER_CLIENT_ID/NAVER_CLIENT_SECRET이 설정되지 않았습니다.')

  const url = `${NAVER_API_BASE}/search/v1/news?query=${encodeURIComponent(query)}&display=${display}&sort=date`
  const response = await fetch(url, {
    headers: {
      'X-NCP-APIGW-API-KEY-ID': clientId,
      'X-NCP-APIGW-API-KEY': clientSecret,
    },
    next: { revalidate: 1800 },
  })
  if (!response.ok) throw new Error(`NAVER 뉴스 검색 실패 (${response.status})`)

  const data: { items: NaverNewsApiItem[] } = await response.json()
  return data.items.map(item => {
    const link = item.originallink || item.link
    return {
      title: stripHtml(item.title),
      summary: stripHtml(item.description),
      link,
      source: hostnameOf(link),
      publishedAt: item.pubDate,
    }
  })
}
