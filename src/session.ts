import { randomUUID } from 'crypto'
import type { SessionState, BeliefOperation } from './types.js'

export class SessionManager {
  private state: SessionState | null = null

  start(agentId: string): SessionState {
    this.state = {
      sessionId: randomUUID(),
      agentId,
      startTime: new Date(),
      beliefs: [],
      turnCount: 0,
    }
    return this.state
  }

  end(): SessionState | null {
    const s = this.state
    this.state = null
    return s
  }

  get current(): SessionState | null { return this.state }

  get isActive(): boolean { return this.state !== null }

  incrementTurn(): void {
    if (this.state) this.state.turnCount++
  }

  recordBelief(op: Omit<BeliefOperation, 'timestamp'>): void {
    if (this.state) {
      this.state.beliefs.push({ ...op, timestamp: new Date() })
    }
  }

  get sessionId(): string {
    if (!this.state) throw new Error('Cogito: no active session. Call wake() first.')
    return this.state.sessionId
  }

  get agentId(): string {
    if (!this.state) throw new Error('Cogito: no active session. Call wake() first.')
    return this.state.agentId
  }

  durationMs(): number {
    if (!this.state) return 0
    return Date.now() - this.state.startTime.getTime()
  }
}
