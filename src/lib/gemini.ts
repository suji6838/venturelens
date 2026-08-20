type JsonSchema = Record<string, unknown>

// 429(할당량/분당 요청 제한 초과)는 짧은 backoff로는 해소되지 않고 재시도할수록 얼마 안 되는
// 무료 할당량만 더 깎아먹으므로 재시도하지 않음 — 500/503(일시적 서버 과부하)만 재시도 대상.
const RETRYABLE_STATUSES = new Set([500, 503])

async function callGemini(prompt: string, responseSchema: JsonSchema, apiKey: string): Promise<Response> {
  const model = 'gemini-3.6-flash'
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema,
        maxOutputTokens: 6000,
        // gemini-3.6-flash는 항상 내부 reasoning을 거치는 모델이라 thinkingBudget:0은 거부됨 —
        // 낮은 양수 값으로 reasoning 분량을 최대한 줄여 응답 속도를 개선(체감 30~45초 → 단축 시도).
        thinkingConfig: { thinkingBudget: 512 },
      },
    }),
  })
}

export async function generateStructured<T>(prompt: string, responseSchema: JsonSchema): Promise<T> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('GEMINI_API_KEY가 설정되지 않았습니다.')

  const attempts = 2
  let lastError: Error = new Error('Gemini 호출 실패')
  for (let attempt = 1; attempt <= attempts; attempt++) {
    const response = await callGemini(prompt, responseSchema, apiKey)
    if (response.ok) {
      const data = await response.json()
      const text: string | undefined = data.candidates?.[0]?.content?.parts?.[0]?.text
      if (!text) throw new Error('Gemini 응답이 비어 있습니다.')
      return JSON.parse(text) as T
    }
    const body = await response.text()
    lastError = new Error(`Gemini 호출 실패 (${response.status}): ${body.slice(0, 300)}`)
    if (!RETRYABLE_STATUSES.has(response.status) || attempt === attempts) break
    await new Promise(resolve => setTimeout(resolve, 1500))
  }
  throw lastError
}
