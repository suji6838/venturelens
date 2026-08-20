// 여러 언론사가 같은 보도자료/사건을 각자 다른 제목으로 실으면 URL은 달라서
// 단순 링크 중복 제거로는 못 걸러짐 — 제목의 특징적인 단어(고유명사 등)가
// 얼마나 겹치는지로 "사실상 같은 기사"를 판별함.
const STOPWORDS = new Set([
  '스타트업', '투자유치', '유치', '투자', '시드', '시드투자', '시리즈', '기업', '선정',
  '지원', '확대', '성장', '플랫폼', '서비스', '억원', '만원', '기관', '대표', '참가',
  '모집', '설명회', '프로그램', '사업', '참여', '스타트', '솔루션', '제공', '출시',
  '개발', '국내', '글로벌',
])

function tokenize(title: string): Set<string> {
  const cleaned = title.replace(/\[[^\]]*\]/g, ' ')
  const tokens = cleaned
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter(t => t.length >= 2 && !STOPWORDS.has(t))
  return new Set(tokens)
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0
  let intersection = 0
  for (const t of a) if (b.has(t)) intersection++
  return intersection / (a.size + b.size - intersection)
}

export function dedupeSimilarTitles<T extends { title: string }>(items: T[], threshold = 0.22): T[] {
  const kept: T[] = []
  const keptTokens: Set<string>[] = []
  for (const item of items) {
    const tokens = tokenize(item.title)
    const isDuplicate = keptTokens.some(existing => jaccard(tokens, existing) >= threshold)
    if (!isDuplicate) {
      kept.push(item)
      keptTokens.push(tokens)
    }
  }
  return kept
}
