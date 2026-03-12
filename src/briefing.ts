import type { MemoryLike, WakeBriefing, CogitoConfig } from './types.js'

const BRIEFING_SYSTEM = `You are a concise agent briefing assistant. 
Given a list of recent memories, produce a 2-3 sentence wake briefing that surfaces:
- any unresolved tasks or decisions
- relevant context for the current session
- any changed preferences or important updates
Be direct. No filler.`

async function callOllama(
  prompt: string,
  ollamaUrl: string,
  model: string,
  timeoutMs = 20_000
): Promise<string> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const res = await fetch(`${ollamaUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        prompt: `${BRIEFING_SYSTEM}\n\nMemories:\n${prompt}\n\nBriefing:`,
        stream: false,
      }),
      signal: controller.signal,
    })
    clearTimeout(timer)

    if (!res.ok) throw new Error(`Ollama HTTP ${res.status}`)
    const data = await res.json() as { response: string }
    return data.response?.trim() ?? ''
  } catch {
    clearTimeout(timer)
    return '' // graceful fallback — briefing is non-critical
  }
}

export async function buildWakeBriefing(
  agentId: string,
  sessionId: string,
  memories: MemoryLike[],
  config: CogitoConfig
): Promise<WakeBriefing> {
  let summary = `Agent ${agentId} — session started. ${memories.length} recent memories loaded.`

  if (memories.length > 0 && config.ollamaUrl) {
    const memoryText = memories
      .slice(0, 10)
      .map(m => `- ${m.content}`)
      .join('\n')

    const generated = await callOllama(
      memoryText,
      config.ollamaUrl,
      config.ollamaModel ?? 'qwen2.5:32b',
    )

    if (generated) summary = generated
  }

  return {
    agentId,
    sessionId,
    sessionStart: new Date(),
    summary,
    recentMemories: memories,
    persona: config.persona,
  }
}

export async function buildSleepDigest(
  agentId: string,
  summary: string | undefined,
  turnCount: number,
  durationMs: number
): Promise<string> {
  const mins = Math.round(durationMs / 60_000)
  const base = `Session ended. ${turnCount} turns over ${mins} minute${mins !== 1 ? 's' : ''}.`
  return summary ? `${base} ${summary}` : base
}
