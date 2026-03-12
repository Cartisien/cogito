/**
 * @cartisien/cogito
 * Agent identity, lifecycle management, and belief revision.
 *
 * "I compute, therefore I am."
 */

import { SessionManager } from './session.js'
import { buildWakeBriefing, buildSleepDigest } from './briefing.js'
import type {
  CogitoConfig,
  WakeBriefing,
  SleepOptions,
  MemoryLike,
} from './types.js'

export type { CogitoConfig, WakeBriefing, SleepOptions, MemoryLike }

const DEFAULTS = {
  ollamaUrl:   'http://localhost:11434',
  ollamaModel: 'qwen2.5:32b',
}

const RECALL_LIMIT = 10
const WAKE_QUERY   = 'recent context decisions preferences tasks'

export class Cogito {
  private readonly config: Required<Pick<CogitoConfig, 'agentId'>> & CogitoConfig
  private session: SessionManager

  constructor(config: CogitoConfig) {
    if (!config.agentId) throw new Error('Cogito: agentId is required')
    this.config  = { ...DEFAULTS, ...config }
    this.session = new SessionManager()
  }

  // ─── Lifecycle ─────────────────────────────────────────────────────────────

  /**
   * Initialize the agent session. Loads recent memories and returns a briefing.
   */
  async wake(): Promise<WakeBriefing> {
    const state   = this.session.start(this.config.agentId)
    let memories: MemoryLike[] = []

    if (this.config.memory) {
      try {
        memories = await this.config.memory.recall(
          this.config.agentId,
          WAKE_QUERY,
          RECALL_LIMIT
        )
      } catch {
        // non-fatal — wake proceeds with empty memories
      }
    }

    return buildWakeBriefing(
      this.config.agentId,
      state.sessionId,
      memories,
      this.config
    )
  }

  /**
   * End the session. Optionally stores a digest memory in Engram.
   */
  async sleep(options: SleepOptions = {}): Promise<void> {
    const state = this.session.current
    if (!state) return

    const digest = await buildSleepDigest(
      this.config.agentId,
      options.summary,
      state.turnCount,
      this.session.durationMs()
    )

    if ((options.persist !== false) && this.config.memory && digest) {
      try {
        await this.config.memory.remember(
          this.config.agentId,
          `[Session digest] ${digest}`,
          'system'
        )
      } catch {
        // non-fatal
      }
    }

    this.session.end()
  }

  /**
   * Synthesize an insight across retrieved memories before a task.
   */
  async reflect(query: string): Promise<string> {
    if (!this.config.memory) return ''

    let memories: MemoryLike[] = []
    try {
      memories = await this.config.memory.recall(
        this.config.agentId,
        query,
        RECALL_LIMIT
      )
    } catch {
      return ''
    }

    if (memories.length === 0) return ''
    return memories.map(m => m.content).join('\n')
  }

  /** Increment the turn counter (call once per agent conversation turn). */
  turn(): void {
    this.session.incrementTurn()
  }

  // ─── Belief Revision ───────────────────────────────────────────────────────

  /**
   * Confirm a belief — increases its certainty score.
   * Delegate to Engram SDK if available (calls memory.reinforce if it exists).
   */
  async reinforce(memoryId: string): Promise<void> {
    this.session.recordBelief({ memoryId, operation: 'reinforce' })
    const mem = this.config.memory as unknown as Record<string, unknown>
    if (typeof mem?.reinforce === 'function') {
      await (mem.reinforce as (id: string) => Promise<void>)(memoryId)
    }
  }

  /**
   * Challenge a belief — lowers its certainty and marks it contradicted.
   */
  async contradict(memoryId: string, reason?: string): Promise<void> {
    this.session.recordBelief({ memoryId, operation: 'contradict', reason })
    const mem = this.config.memory as unknown as Record<string, unknown>
    if (typeof mem?.contradict === 'function') {
      await (mem.contradict as (id: string) => Promise<void>)(memoryId)
    }
  }

  /**
   * Supersede a belief — removes it from future recall.
   */
  async invalidate(memoryId: string, reason?: string): Promise<void> {
    this.session.recordBelief({ memoryId, operation: 'invalidate', reason })
    const mem = this.config.memory as unknown as Record<string, unknown>
    if (typeof mem?.invalidate === 'function') {
      await (mem.invalidate as (id: string) => Promise<void>)(memoryId)
    }
  }

  // ─── Introspection ─────────────────────────────────────────────────────────

  get agentId(): string { return this.config.agentId }
  get isAwake(): boolean { return this.session.isActive }
  get sessionId(): string | null {
    return this.session.isActive ? this.session.sessionId : null
  }
}

export default Cogito
