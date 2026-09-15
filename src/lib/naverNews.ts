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

type NaverWebApiItem = {
  title: string
  link: string
  description: string
}

// 뉴스/블로그/SNS/구인구직/VC미디어처럼 "회사 공식 홈페이지"일 수 없는 도메인은 후보에서 제외.
// 완벽한 목록은 아니지만, 명백히 아닌 것만 걸러내고 나머지는 검색 결과 1순위를 그대로 신뢰.
const NON_HOMEPAGE_HOST_PATTERNS = [
  'naver.com', 'daum.net', 'kakao.com', 'tistory.com', 'blog.me', 'brunch.co.kr',
  'wikipedia.org', 'namu.wiki', 'youtube.com', 'instagram.com', 'facebook.com',
  'twitter.com', 'x.com', 'linkedin.com', 'threads.net',
  'wanted.co.kr', 'jobkorea.co.kr', 'saramin.co.kr', 'rocketpunch.com',
  'thevc.kr', 'platum.kr', 'venturesquare.net', 'bloter.net',
  'google.com', 'apps.apple.com', 'play.google.com',
]

function isLikelyHomepage(link: string): boolean {
  const host = hostnameOf(link)
  if (!host) return false
  return !NON_HOMEPAGE_HOST_PATTERNS.some(pattern => host.includes(pattern))
}

// 기업명으로 네이버 웹문서 검색을 돌려 공식 홈페이지로 보이는 첫 결과를 반환.
// 검색 자체가 실패하거나(구독 미설정 등) 마땅한 결과가 없으면 undefined — 호출부에서 그냥 링크를 생략.
export async function findCompanyWebsite(companyName: string): Promise<string | undefined> {
  const clientId = process.env.NAVER_CLIENT_ID
  const clientSecret = process.env.NAVER_CLIENT_SECRET
  if (!clientId || !clientSecret) return undefined

  const query = `${companyName} 공식 홈페이지`
  const url = `${NAVER_API_BASE}/search/v1/webkr?query=${encodeURIComponent(query)}&display=5`
  try {
    const response = await fetch(url, {
      headers: {
        'X-NCP-APIGW-API-KEY-ID': clientId,
        'X-NCP-APIGW-API-KEY': clientSecret,
      },
      next: { revalidate: 21600 },
    })
    if (!response.ok) return undefined

    const data: { items?: NaverWebApiItem[] } = await response.json()
    const hit = (data.items ?? []).find(item => isLikelyHomepage(item.link))
    return hit?.link
  } catch {
    return undefined
  }
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
