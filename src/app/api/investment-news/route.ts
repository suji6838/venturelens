import { NextResponse } from 'next/server'
import { fetchInvestmentNews } from '@/lib/naverNews'
import { dedupeSimilarTitles } from '@/lib/dedupe'

export async function GET() {
  try {
    const items = await fetchInvestmentNews('스타트업 투자유치', 15)
    return NextResponse.json(dedupeSimilarTitles(items))
  } catch (e) {
    return NextResponse.json({ detail: e instanceof Error ? e.message : '뉴스를 불러오지 못했습니다.' }, { status: 502 })
  }
}
