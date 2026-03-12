export interface CogitoConfig {
  agentId: string
  persona?: string
  ollamaUrl?: string
  ollamaModel?: string
  engramUrl?: string      // optional: Engram REST API base URL
  memory?: EngramLike     // optional: Engram SDK instance
}

/** Minimal Engram interface Cogito depends on — compatible with @cartisien/engram */
export interface EngramLike {
  remember(sessionId: string, content: string, role: string): Promise<unknown>
  recall(sessionId: string, query: string, limit?: number): Promise<MemoryLike[]>
}

export interface MemoryLike {
  content: string
  role?: string
  similarity?: number
  createdAt?: Date | string
}

export interface WakeBriefing {
  agentId: string
  sessionId: string
  sessionStart: Date
  summary: string
  recentMemories: MemoryLike[]
  persona?: string
}

export interface SleepOptions {
  summary?: string
  persist?: boolean    // default: true — store sleep digest in Engram
}

export interface BeliefOperation {
  memoryId: string
  operation: 'reinforce' | 'contradict' | 'invalidate'
  timestamp: Date
  reason?: string
}

export interface SessionState {
  sessionId: string
  agentId: string
  startTime: Date
  beliefs: BeliefOperation[]
  turnCount: number
}
