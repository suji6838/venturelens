import { NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'

export async function POST(request: Request) {
  const secret = new URL(request.url).searchParams.get('secret')
  if (!secret || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  revalidateTag('discover', { expire: 0 })
  return NextResponse.json({ revalidated: true })
}
