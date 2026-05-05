# Architecture — IITG Analysed

This document describes the system design, data flow, and technical decisions behind IITG Analysed.

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Browser / Client                        │
│                                                             │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────────┐  │
│  │  Dashboard  │  │  Campus Map  │  │  Intelligence UI  │  │
│  │ Components  │  │   (deck.gl)  │  │  (AI Summaries)   │  │
│  └──────┬──────┘  └──────┬───────┘  └────────┬──────────┘  │
│         └────────────────┼──────────────────┘              │
│                          │                                   │
│              ┌───────────▼───────────┐                      │
│              │    State / Store       │                      │
│              │  (TypeScript modules)  │                      │
│              └───────────┬───────────┘                      │
│                          │                                   │
│              ┌───────────▼───────────┐                      │
│              │    Feed Aggregator     │                      │
│              │   src/feeds/*.ts       │                      │
│              └───────────┬───────────┘                      │
└──────────────────────────┼──────────────────────────────────┘
                           │  HTTP / WebSocket
        ┌──────────────────┼──────────────────────┐
        │                  │                       │
┌───────▼──────┐  ┌────────▼───────┐  ┌───────────▼────────┐
│  IITG API    │  │  Relay Server  │  │  External APIs     │
│  api/        │  │  server/       │  │  (Scopus, IMD, etc)│
│  (Express)   │  │  (CORS proxy)  │  │                    │
└───────┬──────┘  └────────┬───────┘  └───────────┬────────┘
        │                  │                       │
        └──────────────────┴───────────────────────┘
                           │
              ┌────────────▼────────────┐
              │     Data Sources         │
              │  IITG website, Scopus,   │
              │  RSS feeds, IMD, etc.    │
              └─────────────────────────┘
```

---

## Module Responsibilities

### `src/feeds/` — Feed Parsers
Each file is a self-contained feed parser for one data source. It exports an `IITGFeed` object implementing the standard interface. The feed aggregator in `src/feeds/index.ts` collects all feeds and normalizes them into `FeedItem[]`.

**Feeds currently planned:**
- `iitg-news.ts` — Official IITG news RSS
- `iitg-research.ts` — IITG R&D publications
- `scopus.ts` — Scopus API (IITG affiliation filter)
- `iitg-events.ts` — Campus events portal
- `placements.ts` — CDC public placement data
- `imd-guwahati.ts` — Weather from IMD Guwahati station
- `gymkhana.ts` — Student Gymkhana announcements

### `src/intelligence/` — AI Engine
Receives normalized `FeedItem[]` and produces `IntelligenceBrief[]` via:
1. **Deduplicator** — removes redundant items across feeds
2. **Synthesizer** — calls local Ollama or cloud LLM to produce summaries
3. **Correlator** — cross-references items (e.g., research grant + faculty news)

### `src/components/` — UI Layer
Strictly presentational. Components receive typed props and emit events. No direct API calls — all data comes via the store.

### `api/` — Backend
Express server exposing REST endpoints. Handles:
- Authenticated/rate-limited external API calls (Scopus, etc.)
- Data caching (Redis/Upstash)
- Aggregated endpoints consumed by the frontend

### `server/` — Relay Server
Lightweight proxy for CORS-blocked sources (e.g., IITG RSS feeds that don't allow browser requests). Runs separately; can be deployed on Railway or any Node.js host.

### `shared/` — Shared Types
TypeScript types and utility functions shared between `src/`, `api/`, and `server/`. Never import from `src/` in `api/` — always go through `shared/`.

---

## Data Flow

```
External Source → Feed Parser → Normalizer → Feed Store
                                                  │
                                      Intelligence Engine
                                                  │
                                        UI Components
                                                  │
                                            User
```

---

## Caching Strategy

| Layer | Tool | TTL |
|-------|------|-----|
| Edge CDN | Vercel Edge | 60s (news), 1hr (research) |
| Application | Redis (Upstash) | 5min (news), 30min (events) |
| Client | Service Worker | 2min |
| In-memory | JS Map | 30s |

---

## AI/LLM Integration

The intelligence engine supports multiple backends via a common `LLMAdapter` interface:

| Backend | Config Key | Notes |
|---------|-----------|-------|
| Ollama (local) | `VITE_LLM_BACKEND=ollama` | No API key, runs locally |
| Groq | `VITE_LLM_BACKEND=groq` | Fast cloud inference |
| OpenRouter | `VITE_LLM_BACKEND=openrouter` | Multi-model support |

---

## Campus Map

Built on **deck.gl** with a custom IITG campus GeoJSON overlay. Layers include:
- Campus building footprints
- Department locations
- Event pins (from `src/feeds/iitg-events.ts`)
- Weather overlay (IMD data)
- Real-time facility status (when APIs are available)

---

## Deployment

| Target | Command | Notes |
|--------|---------|-------|
| Vercel | `vercel deploy` | Frontend + API via Edge Functions |
| Docker | `docker-compose up` | Full stack including relay server |
| Static | `npm run build` | Frontend only, no server features |

---

## Testing Strategy

| Layer | Tool | Coverage Target |
|-------|------|----------------|
| Unit | Vitest | All feed parsers, utils, intelligence logic |
| Integration | Vitest + MSW | API endpoint handlers |
| E2E | Playwright | Dashboard load, map interaction, feed rendering |
