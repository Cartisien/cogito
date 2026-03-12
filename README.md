# @cartisien/cogito

> **Agent identity, lifecycle management, and belief revision.**

Part of the [Cartisien Memory Suite](https://github.com/Cartisien) — *res cogitans* to Engram's trace and Extensa's *res extensa*.

[![npm](https://img.shields.io/npm/v/@cartisien/cogito)](https://www.npmjs.com/package/@cartisien/cogito)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## What is Cogito?

Cogito is the lifecycle and identity layer for AI agents. While [Engram](https://github.com/Cartisien/engram) handles memory storage and retrieval, Cogito manages *who the agent is* and *when it's running*:

- **Identity** — stable agent ID, persona configuration, and session context
- **Lifecycle** — `wake()` / `sleep()` protocol with session boundary tracking
- **Belief revision** — structured certainty management across the agent's memory
- **Wake briefing** — synthesize relevant context from Engram on startup
- **Sleep digest** — summarize the session and commit important decisions before shutdown

```typescript
import { Cogito } from '@cartisien/cogito';
import { Engram } from '@cartisien/engram';

const memory = new Engram({ adapter: 'sqlite', connectionString: './agent.db', agentId: 'my-agent' });
const agent  = new Cogito({ agentId: 'my-agent', memory });

// On startup
const briefing = await agent.wake();
// → "Last session: 2h ago. 3 unresolved tasks. User preference updated: dark mode."

// ... agent runs ...

// On shutdown
await agent.sleep({ summary: 'Completed refactor. Deferred auth ticket to tomorrow.' });
```

---

## Architecture

```
┌─────────────────────────────────────────┐
│              Agent Application           │
└────────────────────┬────────────────────┘
                     │
┌────────────────────▼────────────────────┐
│              Cogito                      │
│  wake() · sleep() · identify()          │
│  reinforce() · contradict() · reflect() │
└────────────────────┬────────────────────┘
                     │
┌────────────────────▼────────────────────┐
│              Engram                      │
│  store() · recall() · consolidate()     │
└─────────────────────────────────────────┘
```

---

## API (v0.2 — coming soon)

### `new Cogito(config)`

```typescript
const agent = new Cogito({
  agentId: 'my-agent',      // stable identity key
  memory: engramInstance,   // Engram instance
  persona?: string,         // optional system prompt / personality
  ollamaUrl?: string,       // local LLM for briefing synthesis
});
```

### `wake(): Promise<WakeBriefing>`

Initialize the agent, load recent context from Engram, and return a briefing summary.

### `sleep(options?): Promise<void>`

Summarize the session, store a session-digest memory, and close connections cleanly.

### `reflect(query): Promise<string>`

Synthesize insights across retrieved memories before a task.

### Belief Revision

```typescript
await agent.reinforce(memoryId);   // confirm a belief
await agent.contradict(memoryId);  // challenge a belief
await agent.invalidate(memoryId);  // supersede a belief
```

---

## The Cartisien Memory Suite

| Package | Role | Status |
|---------|------|--------|
| [`@cartisien/engram`](https://github.com/Cartisien/engram) | Persistent memory | ✅ Stable |
| [`@cartisien/cogito`](https://github.com/Cartisien/cogito) | Agent lifecycle & identity | 🔧 In development |
| [`@cartisien/extensa`](https://github.com/Cartisien/extensa) | Vector infrastructure | 🔧 In development |

*"Res cogitans meets res extensa."*

---

## Research

This package is part of the Cartisien Memory Suite described in:

> Cartisien. (2026). *Engram: A Local-First Persistent Memory Architecture for Conversational AI Agents*. Zenodo. https://doi.org/10.5281/zenodo.18988892

---

## License

MIT © [Cartisien](https://cartisien.com)
