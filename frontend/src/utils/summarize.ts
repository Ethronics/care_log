/**
 * Care log summarization: tries intelligent (backend/LLM) first, falls back to simple.
 * Backend: POST /api/summarize with { "text": "..." } → { "summary": "..." }
 * Set VITE_SUMMARIZE_API_URL to override the endpoint (default: VITE_API_BASE_URL + /api/summarize).
 */

const MAX_CHARS = 280
const MAX_SENTENCES = 2

/** Simple client-side fallback when no API or on error */
export function summarizeCareLogTextSimple(text: string): string {
  const trimmed = text.trim()
  if (!trimmed) return trimmed

  const sentences = trimmed
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean)

  if (sentences.length <= MAX_SENTENCES) return trimmed
  const taken = sentences.slice(0, MAX_SENTENCES).join(' ')
  if (taken.length <= MAX_CHARS) return taken

  const byChars = trimmed.slice(0, MAX_CHARS)
  const lastSpace = byChars.lastIndexOf(' ')
  return lastSpace > MAX_CHARS / 2 ? byChars.slice(0, lastSpace) : byChars
}

function getSummarizeUrl(): string | null {
  const base =
    import.meta.env.VITE_SUMMARIZE_API_URL ??
    import.meta.env.VITE_API_BASE_URL ??
    'http://localhost:8000'
  if (!base || typeof base !== 'string') return null
  const url = base.replace(/\/$/, '')
  return `${url}/api/summarize`
}

/**
 * Returns an intelligent summary when the backend is configured and responds;
 * otherwise falls back to a short client-side summary.
 */
export async function summarizeCareLogText(text: string): Promise<string> {
  const trimmed = text.trim()
  if (!trimmed) return trimmed

  const url = getSummarizeUrl()
  if (url) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: trimmed }),
      })
      if (res.ok) {
        const data = (await res.json()) as { summary?: string }
        if (typeof data.summary === 'string' && data.summary.trim()) {
          return data.summary.trim()
        }
      }
    } catch {
      // Network or parse error: use fallback
    }
  }

  return summarizeCareLogTextSimple(trimmed)
}
