// 여러 언론사가 같은 보도자료/사건을 각자 다른 제목으로 실으면 URL은 달라서
// 단순 링크 중복 제거로는 못 걸러짐 — 제목의 특징적인 단어(고유명사 등)가
// 얼마나 겹치는지로 "사실상 같은 기사"를 판별함.
//
// 단순 자카드 유사도는 "해외/진출/박차/확보" 같은 보도자료 상용구가 서로 다른
// 기업 기사에도 우연히 겹쳐서 오탐을 만들고, 반대로 언론사마다 강조하는 사실이
// 달라 겹치는 단어 자체가 적은 진짜 중복(같은 사건, 다른 사실 강조)은 놓친다.
// 그래서 배치 내 문서빈도(df) 기반 가중치를 둬서 "서치독", "스피드플로어" 같은
// 흔치 않은 고유명사는 강하게, 여러 기사에 공통으로 등장하는 상용구는 약하게
// 반영한다(TF-IDF의 IDF와 동일한 아이디어).
const STOPWORDS = new Set([
  '스타트업', '투자유치', '유치', '투자', '시드', '시드투자', '시리즈', '기업', '선정',
  '지원', '확대', '성장', '플랫폼', '서비스', '억원', '만원', '기관', '대표', '참가',
  '모집', '설명회', '프로그램', '사업', '참여', '스타트', '솔루션', '제공', '출시',
  '개발', '국내', '글로벌', '해외', '진출', '박차', '확보', '가속', '구축', '추진',
  '공급', '협력', '체결', '조성', '발굴', '유망', '혁신', '자금', '규모', '전략',
  '시장', '파트너', '파트너십', '최대', '신규', '발표', '공개', '투자금', '누적',
  '받아', '받은', '통해', '위해',
])

function tokenize(title: string): Set<string> {
  const cleaned = title.replace(/\[[^\]]*\]/g, ' ')
  const tokens = cleaned
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter(t => t.length >= 2 && !STOPWORDS.has(t))
  return new Set(tokens)
}

function computeIdf(tokenSets: Set<string>[]): Map<string, number> {
  const documentFrequency = new Map<string, number>()
  for (const tokens of tokenSets) {
    for (const t of tokens) documentFrequency.set(t, (documentFrequency.get(t) ?? 0) + 1)
  }
  const n = tokenSets.length
  const idf = new Map<string, number>()
  for (const [t, df] of documentFrequency) idf.set(t, Math.log((n + 1) / df) + 1)
  return idf
}

function weightedSimilarity(a: Set<string>, b: Set<string>, idf: Map<string, number>): number {
  if (a.size === 0 || b.size === 0) return 0
  let intersectionWeight = 0
  let unionWeight = 0
  for (const t of new Set([...a, ...b])) {
    const w = idf.get(t) ?? 1
    unionWeight += w
    if (a.has(t) && b.has(t)) intersectionWeight += w
  }
  return unionWeight === 0 ? 0 : intersectionWeight / unionWeight
}

export function dedupeSimilarTitles<T extends { title: string }>(items: T[], threshold = 0.18): T[] {
  const tokenSets = items.map(item => tokenize(item.title))
  const idf = computeIdf(tokenSets)
  const kept: T[] = []
  const keptTokens: Set<string>[] = []
  items.forEach((item, i) => {
    const tokens = tokenSets[i]
    const isDuplicate = keptTokens.some(existing => weightedSimilarity(tokens, existing, idf) >= threshold)
    if (!isDuplicate) {
      kept.push(item)
      keptTokens.push(tokens)
    }
  })
  return kept
}
