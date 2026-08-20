import { NextResponse } from 'next/server'
import { unstable_cache } from 'next/cache'
import { discoverStartups } from '@/lib/discover'
import { initialFilters, type Filters } from '@/lib/filters'

const getCachedStartups = unstable_cache(discoverStartups, ['venturelens-discover'], {
  revalidate: 21600, // 6시간
  tags: ['discover'],
})

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const filters: Filters = { ...initialFilters, ...body }
    const startups = await getCachedStartups(filters)
    return NextResponse.json(startups)
  } catch (e) {
    return NextResponse.json(
      { detail: e instanceof Error ? e.message : 'AI 추천을 불러오지 못했습니다.' },
      { status: 502 },
    )
  }
}
