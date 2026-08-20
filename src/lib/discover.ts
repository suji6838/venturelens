import { fetchInvestmentNews, type InvestmentNewsItem } from './naverNews'
import { generateStructured } from './gemini'
import type { Startup } from '@/components/StartupCard'
import { activeFilterConstraints, initialFilters, type Filters } from './filters'

const DEFAULT_QUERIES = ['스타트업 투자유치', '스타트업 시리즈A', '스타트업 시드투자']

const RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    startups: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          industry: { type: 'string' },
          founded: { type: 'integer' },
          score: { type: 'integer' },
          stage: { type: 'string' },
          growth: { type: 'string' },
          funding: { type: 'string' },
          tag: { type: 'string' },
          summary: { type: 'string' },
          model: { type: 'string' },
          market: { type: 'string' },
          growth_text: { type: 'string' },
          competition: { type: 'string' },
          valuation: { type: 'string' },
          fair: { type: 'string' },
          basis: { type: 'string' },
          confidence: { type: 'integer' },
          history: { type: 'array', items: { type: 'string' } },
          sourceUrl: { type: 'string' },
        },
        required: [
          'name', 'industry', 'founded', 'score', 'stage', 'growth', 'funding', 'tag',
          'summary', 'model', 'market', 'growth_text', 'competition', 'valuation', 'fair',
          'basis', 'confidence', 'history', 'sourceUrl',
        ],
      },
    },
  },
  required: ['startups'],
}

type ExtractedStartup = Omit<Startup, 'id'>

function buildQueries(filters: Filters): string[] {
  const specific: string[] = []
  if (filters.keyword.trim()) specific.push(`${filters.keyword.trim()} 투자유치`)
  if (filters.industry !== initialFilters.industry) specific.push(`${filters.industry} 스타트업 투자유치`)
  if (filters.stage !== initialFilters.stage) specific.push(`스타트업 ${filters.stage} 투자유치`)
  return specific.length > 0 ? [...specific, DEFAULT_QUERIES[0]] : DEFAULT_QUERIES
}

function buildPrompt(articles: InvestmentNewsItem[], filters: Filters): string {
  const list = articles
    .map((a, i) => `[${i + 1}] ${a.title}\n${a.summary}\n출처: ${a.source} (${a.publishedAt})\nURL: ${a.link}`)
    .join('\n\n')

  const constraints = activeFilterConstraints(filters)
  const constraintsBlock = constraints.length > 0
    ? `\n다음 조건을 모두 만족하는 기업만 선정하세요(기사에 조건 충족 여부를 판단할 근거가 없으면 그 기업은 제외하세요):\n${constraints.map(c => `- ${c}`).join('\n')}\n조건에 맞는 기업이 하나도 없으면 startups를 빈 배열로 반환하세요.\n`
    : ''

  return `당신은 한국 스타트업 투자 애널리스트입니다. 아래는 최신 네이버 뉴스 기사 목록입니다.

${list}
${constraintsBlock}
이 기사들에서 실제로 이름이 언급된 스타트업/기업을 최대 10개까지 골라주세요. **기사에 등장하지 않는 회사를 지어내지 마세요.** 같은 회사가 여러 기사에 나오면 하나로 합치세요.

각 기업에 대해:
- 기사에 나온 사실(투자단계, 투자금액, 투자일자, 산업)은 최대한 그대로 반영하세요.
- 기사에 명시되지 않은 세부 항목(사업모델 설명, 시장성, 성장성, 경쟁력, 기업가치 추정, 신뢰도)은 기사 맥락과 일반적인 업계 지식을 바탕으로 애널리스트로서 합리적으로 추정해서 채우세요.
- score는 투자매력도 0~100점, confidence는 가치평가 신뢰도 0~100(정수).
- valuation은 "150~200억원" 같은 범위 문자열, fair는 "175억원" 같은 단일 적정가치 문자열.
- tag는 "강한 매수" / "매수" / "관심" 중 하나.
- history는 "2024.04 · Series A · 32억원" 형식의 투자이력 문자열 배열(기사에서 확인 가능한 것 위주, 없으면 이번 투자 1건만).
- sourceUrl은 해당 기업 정보의 근거가 된 기사의 URL(위 목록의 URL 그대로).

투자매력도(score) 높은 순으로 정렬해서 반환하세요.`
}

export async function discoverStartups(filters: Filters = initialFilters): Promise<Startup[]> {
  const queries = buildQueries(filters)
  const newsLists = await Promise.all(queries.map(q => fetchInvestmentNews(q, 8)))
  const seen = new Set<string>()
  const articles: InvestmentNewsItem[] = []
  for (const list of newsLists) {
    for (const item of list) {
      if (seen.has(item.link)) continue
      seen.add(item.link)
      articles.push(item)
    }
  }
  if (articles.length === 0) return []

  const { startups } = await generateStructured<{ startups: ExtractedStartup[] }>(
    buildPrompt(articles, filters),
    RESPONSE_SCHEMA,
  )

  return (startups ?? [])
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map((s, i) => ({ ...s, id: i + 1 }))
}
