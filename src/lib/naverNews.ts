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

// 뉴스/블로그/SNS/구인구직/VC미디어/기업정보 조회 사이트처럼 "회사 공식 홈페이지"일 수 없는
// 도메인은 제목이 회사명과 일치하더라도 항상 후보에서 제외.
const NON_HOMEPAGE_HOST_PATTERNS = [
  'naver.com', 'daum.net', 'kakao.com', 'tistory.com', 'blog.me', 'brunch.co.kr',
  'wikipedia.org', 'namu.wiki', 'thewiki.kr', 'youtube.com', 'instagram.com', 'facebook.com',
  'twitter.com', 'x.com', 'linkedin.com', 'threads.net',
  'wanted.co.kr', 'jobkorea.co.kr', 'saramin.co.kr', 'incruit.com', 'jobplanet.co.kr', 'catch.co.kr',
  'rocketpunch.com', 'thevc.kr', 'platum.kr', 'venturesquare.net', 'bloter.net',
  'k-expo.org', 'kstartup.go.kr', 'marketbz.com',
  'google.com', 'apps.apple.com', 'play.google.com',
]

function isBlockedHost(link: string): boolean {
  const host = hostnameOf(link)
  if (!host) return true
  return NON_HOMEPAGE_HOST_PATTERNS.some(pattern => host.includes(pattern))
}

// 검색 결과 제목에 회사명이 "단어 단위"로 그대로 들어있지 않으면(다른 상품/성분명 일부에
// 우연히 포함된 경우 등) 후보에서 제외 — 링크를 아예 안 보여주는 게 엉뚱한 곳으로 연결하는 것보다 낫다.
// 예: "자일로"가 "자일로올리고당"(건강식품 성분명) 안에 붙어 있으면 매칭시키지 않음.
function titleMatchesCompany(title: string, companyName: string): boolean {
  const text = stripHtml(title)
  const idx = text.indexOf(companyName)
  if (idx === -1) return false
  const isWordChar = (ch: string) => /[0-9A-Za-zㄱ-ㆎ가-힣]/.test(ch)
  const before = text[idx - 1]
  const after = text[idx + companyName.length]
  return !(before && isWordChar(before)) && !(after && isWordChar(after))
}

// 기업명으로 네이버 웹문서 검색을 돌려 공식 홈페이지로 보이는 첫 결과를 반환.
// 검색 자체가 실패하거나(구독 미설정 등) 확신할 만한 결과가 없으면 undefined — 호출부에서 그냥 링크를 생략.
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
    const hit = (data.items ?? []).find(
      item => !isBlockedHost(item.link) && titleMatchesCompany(item.title, companyName),
    )
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
