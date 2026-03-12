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

## QA / Smoke test (Alienware RTX 5090)

- Time: Thursday, March 12th, 2026 — 4:02 PM (America/New_York)
- Smoke test: Cogito.wake() against local Ollama generator @ 192.168.68.73:11435 (no Engram memory supplied)
- Result: wake returned sessionId=86c44e12-69b8-4675-98a0-98f4b63f7745 and default summary: "Agent test-agent — session started. 0 recent memories loaded."

Cogito compiled and produced a wake briefing (fallback summary) in smoke run. Next: wire Cogito to Engram API for real briefings and add CI tests.

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
