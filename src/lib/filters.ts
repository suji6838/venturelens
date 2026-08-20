export type Filters = {
  industry: string; stage: string; growth: string; keyword: string; recentFunding: string
  fundingAmount: string; foundedYear: string; revenue: string; employees: string
  traffic: string; patents: string; investors: string
}

export const initialFilters: Filters = {
  industry: '전체 산업', stage: '전체 단계', growth: '성장률 무관', keyword: '',
  recentFunding: '무관', fundingAmount: '무관', foundedYear: '무관', revenue: '무관',
  employees: '무관', traffic: '무관', patents: '무관', investors: '무관'
}

export const selectOptions = {
  recentFunding: ['무관', '최근 6개월', '최근 1년', '최근 2년'],
  fundingAmount: ['무관', '10억원 이상', '30억원 이상', '100억원 이상'],
  foundedYear: ['무관', '2024년 이후', '2021~2023년', '2020년 이전'],
  revenue: ['무관', '1억원 이상', '10억원 이상', '50억원 이상'],
  employees: ['무관', '10명 이상', '30명 이상', '100명 이상'],
  traffic: ['무관', '월 1만 이상', '월 10만 이상', '월 100만 이상'],
  patents: ['무관', '1건 이상', '5건 이상', '10건 이상'],
  investors: ['무관', '기관 투자자 보유', '글로벌 투자자 보유', '후속 투자 유치']
}

const FILTER_LABELS: Record<keyof Filters, string> = {
  industry: '산업', stage: '투자 단계', growth: '성장률', keyword: '검색 키워드',
  recentFunding: '최근 투자유치', fundingAmount: '투자금액', foundedYear: '설립연도',
  revenue: '매출', employees: '직원 수', traffic: '트래픽', patents: '특허', investors: '투자자',
}

export function activeFilterConstraints(filters: Filters): string[] {
  return (Object.keys(initialFilters) as (keyof Filters)[])
    .filter(key => filters[key] && filters[key] !== initialFilters[key])
    .map(key => `${FILTER_LABELS[key]}: ${filters[key]}`)
}
