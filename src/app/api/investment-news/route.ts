import { NextResponse } from 'next/server'
import { fetchInvestmentNews } from '@/lib/naverNews'

export async function GET() {
  try {
    const items = await fetchInvestmentNews()
    return NextResponse.json(items)
  } catch (e) {
    return NextResponse.json({ detail: e instanceof Error ? e.message : '뉴스를 불러오지 못했습니다.' }, { status: 502 })
  }
}
