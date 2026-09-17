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
  // 언론사/매거진 도메인 — 기사 링크가 "홈페이지"로 잘못 채택되는 사례가 실제로 나와서 추가.
  'chosun.com', 'hankyung.com', 'thebionews.net', 'donga.com', 'joongang.co.kr', 'hani.co.kr',
  'khan.co.kr', 'mk.co.kr', 'edaily.co.kr', 'news1.kr', 'yna.co.kr', 'mt.co.kr', 'asiae.co.kr',
  'etnews.com', 'zdnet.co.kr', 'newsis.com', 'sedaily.com', 'fnnews.com',
  // 링크 리다이렉트/트래킹 서비스 — 실제 홈페이지가 아니라 중간 리다이렉트 페이지로 확인됨.
  'infoflex.net',
]

function isBlockedHost(link: string): boolean {
  const host = hostnameOf(link)
  if (!host) return true
  return NON_HOMEPAGE_HOST_PATTERNS.some(pattern => host.includes(pattern))
}

// 뉴스 기사/게시판 URL 패턴(경로에 news, article, board, bbs가 들어가거나 idxno= 같은 기사
// ID 쿼리파라미터가 붙는 경우)은 도메인을 다 막아둘 수 없으니 URL 구조로 한 번 더 걸러낸다.
// 회사 홈페이지 루트 URL은 이런 패턴을 갖지 않는다.
const ARTICLE_URL_PATTERN = /\/(news|article(view)?|board|bbs|archives)(\/|\.html?|$)|[?&](idxno|artid|articleid|aid)=/i

function looksLikeArticleUrl(link: string): boolean {
  return ARTICLE_URL_PATTERN.test(link)
}

// 검색 결과 제목에 회사명이 "단어 단위"로 그대로 들어있지 않으면(다른 상품/성분명 일부에
// 우연히 포함된 경우 등) 후보에서 제외 — 링크를 아예 안 보여주는 게 엉뚱한 곳으로 연결하는 것보다 낫다.
// 예: "자일로"가 "자일로올리고당"(건강식품 성분명) 안에 붙어 있으면 매칭시키지 않음.
// 회사명이 1글자면 무관한 단어(게임/작품명 등)에 우연히 단어 경계까지 맞아떨어질 확률이 높아
// 아예 매칭 대상에서 제외한다.
function titleMatchesCompany(title: string, companyName: string): boolean {
  if (companyName.trim().length < 2) return false
  const text = stripHtml(title)
  const idx = text.indexOf(companyName)
  if (idx === -1) return false
  const isWordChar = (ch: string) => /[0-9A-Za-zㄱ-ㆎ가-힣]/.test(ch)
  const before = text[idx - 1]
  const after = text[idx + companyName.length]
  return !(before && isWordChar(before)) && !(after && isWordChar(after))
}

// 후보 링크가 실제로 열리는(죽은 도메인/만료/엉뚱한 곳으로 리다이렉트가 아닌) 페이지인지 확인.
// 검색 제목 매칭만으로는 도메인이 만료돼 파킹 페이지로 넘어가거나 완전히 다른 사이트로
// 리다이렉트된 경우를 걸러낼 수 없어서, 링크를 붙이기 전에 반드시 한 번 접속을 시도해본다.
async function isReachableHomepage(url: string): Promise<boolean> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 5000)
  try {
    const response = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; VentureLensBot/1.0)' },
    })
    if (!response.ok) return false
    // 리다이렉트를 따라간 최종 주소가 차단 대상 도메인(파킹/검색결과 페이지 등)이면 실패 처리.
    return !isBlockedHost(response.url)
  } catch {
    return false
  } finally {
    clearTimeout(timeout)
  }
}

// 기업명으로 네이버 웹문서 검색을 돌려 공식 홈페이지로 보이는 결과 중, 실제로 접속되는
// 첫 후보를 반환. 검색 자체가 실패하거나(구독 미설정 등) 확신할 만한/접속되는 결과가
// 없으면 undefined — 호출부에서 그냥 링크를 생략(엉뚱한 페이지를 보여주는 것보다 낫다).
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
    const candidates = (data.items ?? []).filter(
      item => !isBlockedHost(item.link) && !looksLikeArticleUrl(item.link) && titleMatchesCompany(item.title, companyName),
    )
    for (const candidate of candidates) {
      if (await isReachableHomepage(candidate.link)) return candidate.link
    }
    return undefined
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
