import { NextResponse } from 'next/server'
import { unstable_cache } from 'next/cache'
import { discoverStartups } from '@/lib/discover'

const getCachedStartups = unstable_cache(discoverStartups, ['venturelens-discover'], {
  revalidate: 21600, // 6시간
  tags: ['discover'],
})

export async function GET() {
  try {
    const startups = await getCachedStartups()
    return NextResponse.json(startups)
  } catch (e) {
    return NextResponse.json(
      { detail: e instanceof Error ? e.message : 'AI 추천을 불러오지 못했습니다.' },
      { status: 502 },
    )
  }
}
