type JsonSchema = Record<string, unknown>

export async function generateStructured<T>(prompt: string, responseSchema: JsonSchema): Promise<T> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('GEMINI_API_KEY가 설정되지 않았습니다.')

  const model = 'gemini-3.6-flash'
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json', responseSchema },
    }),
  })
  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Gemini 호출 실패 (${response.status}): ${text.slice(0, 300)}`)
  }
  const data = await response.json()
  const text: string | undefined = data.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) throw new Error('Gemini 응답이 비어 있습니다.')
  return JSON.parse(text) as T
}
