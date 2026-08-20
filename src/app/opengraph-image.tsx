import { ImageResponse } from 'next/og'

export const alt = 'VentureLens AI — AI Investment Intelligence'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px 90px',
          background: '#112342',
          backgroundImage:
            'radial-gradient(circle at 82% 18%, rgba(111,161,255,0.35), rgba(17,35,66,0) 55%)',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div
            style={{
              width: 76,
              height: 76,
              borderRadius: 18,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #6fa1ff, #2866e7)',
              color: '#fff',
              fontSize: 42,
              fontWeight: 800,
            }}
          >
            V
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 44, fontWeight: 800, color: '#fff', letterSpacing: -1 }}>
              VentureLens
            </div>
            <div style={{ fontSize: 18, letterSpacing: 3, color: '#9eb1d0', fontWeight: 600 }}>
              AI INVESTMENT INTELLIGENCE
            </div>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 64,
            fontSize: 60,
            fontWeight: 800,
            lineHeight: 1.25,
            color: '#fff',
            maxWidth: 920,
          }}
        >
          Discover your next investment, first.
        </div>
        <div style={{ display: 'flex', gap: 14, marginTop: 40 }}>
          {['AI Sourcing', 'Live News Signal', 'Valuation Estimates'].map(label => (
            <div
              key={label}
              style={{
                display: 'flex',
                fontSize: 20,
                color: '#c8d6ec',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.16)',
                borderRadius: 999,
                padding: '10px 22px',
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  )
}
