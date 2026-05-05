# IITG Analysed

**Real-time IIT Guwahati intelligence dashboard** — AI-powered news aggregation, research monitoring, academic tracking, and campus infrastructure awareness in a unified situational interface.

[![GitHub stars](https://img.shields.io/github/stars/Nihal1DS/IITG-analysed?style=social)](https://github.com/Nihal1DS/IITG-analysed/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/Nihal1DS/IITG-analysed?style=social)](https://github.com/Nihal1DS/IITG-analysed/network/members)
[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Last commit](https://img.shields.io/github/last-commit/Nihal1DS/IITG-analysed)](https://github.com/Nihal1DS/IITG-analysed/commits/main)

> **Inspired by [worldmonitor](https://github.com/koala73/worldmonitor)** — adapted and focused entirely on IIT Guwahati.

---

## What It Does

- **Campus news feeds** — aggregated from IITG official channels, research portals, and student bodies
- **Research Intelligence** — track publications, patents, funded projects across all departments
- **Placement Radar** — real-time placement season stats, company visits, package trends
- **Event Monitor** — Techniche, Alcheringa, seminars, guest lectures, workshops
- **Infrastructure Map** — campus map overlay with facility status (hostels, labs, library, mess)
- **Faculty & Research tracker** — active grants, collaborations, and publication velocity
- **AI Synthesis** — summarized briefs from IITG news with local LLM support (Ollama)
- **Contributor-ready** — clean module separation so anyone from IITG can plug in a new feed

---

## Quick Start

```bash
git clone https://github.com/Nihal1DS/IITG-analysed.git
cd IITG-analysed
npm install
npm run dev
```

Open [localhost:5173](http://localhost:5173). No environment variables required for basic operation.

For variant-specific development:

```bash
npm run dev:research     # Research & Publications view
npm run dev:placements   # Placement dashboard
npm run dev:events       # Campus events view
npm run dev:infra        # Infrastructure map
```

See the **[self-hosting guide](./docs/SELF_HOSTING.md)** for deployment options (Vercel, Docker, static).

---

## Tech Stack

| Category       | Technologies                                                              |
| -------------- | ------------------------------------------------------------------------- |
| **Frontend**   | Vanilla TypeScript, Vite, deck.gl + MapLibre GL                           |
| **Maps**       | campus-gl (custom campus map engine based on deck.gl)                     |
| **AI/ML**      | Ollama / Groq / OpenRouter, Transformers.js (browser-side)                |
| **API**        | Node.js + Express, Protocol Buffers                                       |
| **Deployment** | Vercel Edge Functions, Docker, PWA                                        |
| **Caching**    | Redis (Upstash), 3-tier cache, CDN, service worker                        |

Full details in the **[architecture docs](./ARCHITECTURE.md)**.

---

## Project Structure

```
iitg-analysed/
├── .github/                    # GitHub Actions, issue & PR templates
│   ├── ISSUE_TEMPLATE/
│   └── workflows/
├── api/                        # Backend API endpoints (Node.js/Express)
├── data/                       # Static data files (departments, contacts, feeds)
├── deploy/                     # Deployment configs (nginx, etc.)
├── docker/                     # Docker-related configs
├── docs/                       # Project documentation
├── e2e/                        # End-to-end tests (Playwright)
├── public/                     # Static assets (icons, og-image, campus images)
├── scripts/                    # Utility and setup scripts
├── server/                     # Relay server for external feeds
├── shared/                     # Shared types & utilities (used by src + api)
├── src/                        # Main frontend source
│   ├── components/             # UI components
│   │   ├── dashboard/          # Main dashboard layout
│   │   ├── feeds/              # News & event feed components
│   │   ├── intelligence/       # AI synthesis display
│   │   ├── layout/             # App shell, nav, sidebar
│   │   └── map/                # Campus map components
│   ├── config/                 # App-wide config (IITG data, feed URLs, etc.)
│   ├── feeds/                  # Feed parsers and aggregators
│   ├── intelligence/           # AI summarization and signal correlation
│   ├── maps/                   # Campus map engine
│   ├── types/                  # TypeScript type definitions
│   └── utils/                  # Shared helpers
└── tests/                      # Unit tests
```

---

## Data Sources

| Category         | Source                                                         |
| ---------------- | -------------------------------------------------------------- |
| Official News    | iitg.ac.in/news, IITG press releases                          |
| Research         | Scopus, Google Scholar (IITG affiliation filter), IITG R\&D   |
| Placements       | IITG Career Development Cell (public reports)                  |
| Events           | IITG events portal, Techniche, Alcheringa official pages      |
| Campus Infra     | IITG web portals, facility status APIs (when available)        |
| Weather          | IMD Guwahati station data                                      |
| Student Bodies   | Gymkhana, SAC, departmental societies                          |

Contributors are welcome to add new sources. See [CONTRIBUTING.md](./CONTRIBUTING.md).

---

## Contributing

Contributions welcome from students, alumni, faculty, and IITG enthusiasts!

```bash
npm run typecheck        # Type checking
npm run lint             # Lint code
npm run build            # Production build
npm run test             # Run unit tests
npm run test:e2e         # Run end-to-end tests
```

See **[CONTRIBUTING.md](./CONTRIBUTING.md)** for full guidelines.

---

## License

**AGPL-3.0** for non-commercial use.

| Use Case                          | Allowed?                           |
| --------------------------------- | ---------------------------------- |
| Personal / research / educational | ✅ Yes                              |
| Self-hosted (non-commercial)      | ✅ Yes, with attribution            |
| Fork and modify (non-commercial)  | ✅ Yes, share source under AGPL-3.0 |
| Commercial use / SaaS             | ❌ Requires separate license        |

---

## Author

**Nihal Patel** — [GitHub](https://github.com/Nihal1DS) · [nihalpatel.2802@gmail.com](mailto:nihalpatel.2802@gmail.com)

---

## Acknowledgements

This project is inspired by and architecturally adapted from [worldmonitor](https://github.com/koala73/worldmonitor) by [Elie Habib](https://github.com/koala73), which is licensed under AGPL-3.0.

---

[iitg.ac.in](https://www.iitg.ac.in) · [IITG Research Portal](https://www.iitg.ac.in/research/) · [IITG Placements](https://www.iitg.ac.in/cdc/)
