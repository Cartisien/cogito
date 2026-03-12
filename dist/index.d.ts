/**
 * @cartisien/cogito
 * Agent identity, lifecycle management, and belief revision.
 *
 * "I compute, therefore I am."
 */
export interface CogitoConfig {
    agentId: string;
    memory?: unknown;
    persona?: string;
    ollamaUrl?: string;
}
export interface WakeBriefing {
    agentId: string;
    sessionStart: Date;
    summary: string;
    recentMemoryCount: number;
}
export interface SleepOptions {
    summary?: string;
}
/**
 * Cogito — agent lifecycle and identity manager.
 * Full implementation coming in v0.2.
 */
export declare class Cogito {
    private config;
    private sessionStart;
    constructor(config: CogitoConfig);
    wake(): Promise<WakeBriefing>;
    sleep(_options?: SleepOptions): Promise<void>;
    reflect(_query: string): Promise<string>;
    reinforce(_memoryId: string): Promise<void>;
    contradict(_memoryId: string): Promise<void>;
    invalidate(_memoryId: string): Promise<void>;
}
export default Cogito;
//# sourceMappingURL=index.d.ts.map