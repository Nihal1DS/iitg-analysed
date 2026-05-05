# Contributing to IITG Analysed

Thanks for your interest in contributing! This project is built for and by the IIT Guwahati community — students, alumni, faculty, and enthusiasts are all welcome.

---

## Table of Contents

- [Ways to Contribute](#ways-to-contribute)
- [Getting Started](#getting-started)
- [Project Structure Guide](#project-structure-guide)
- [Adding a New Data Feed](#adding-a-new-data-feed)
- [Adding a New UI Component](#adding-a-new-ui-component)
- [Code Style](#code-style)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Feature Requests](#feature-requests)
- [Code of Conduct](#code-of-conduct)

---

## Ways to Contribute

| Type | Examples |
|------|---------|
| **New data feeds** | Add RSS/API feeds for IITG departments, research portals, student clubs |
| **UI improvements** | Improve dashboard layout, add new visualization panels |
| **AI enhancements** | Improve news summarization, signal correlation logic |
| **Bug fixes** | Fix broken feeds, UI glitches, API errors |
| **Documentation** | Improve docs, add tutorials, translate to regional languages |
| **Campus data** | Add/update static data (departments list, faculty, facilities) |
| **Tests** | Write unit tests or E2E tests for untested features |

---

## Getting Started

1. **Fork** the repo on GitHub
2. **Clone** your fork:
   ```bash
   git clone https://github.com/<your-username>/IITG-analysed.git
   cd IITG-analysed
   ```
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Create a branch:**
   ```bash
   git checkout -b feat/your-feature-name
   ```
5. **Start dev server:**
   ```bash
   npm run dev
   ```

---

## Project Structure Guide

Each folder has a clear responsibility. Always place your code in the right folder:

| Folder | What goes here |
|--------|----------------|
| `src/feeds/` | Feed parsers — one file per source (e.g., `iitg-news.ts`, `scopus.ts`) |
| `src/intelligence/` | AI synthesis logic — summarizers, signal correlators |
| `src/components/feeds/` | UI components that **display** feed data |
| `src/components/map/` | Campus map layers and overlays |
| `src/components/dashboard/` | Dashboard panel layout and arrangement |
| `src/components/intelligence/` | UI for AI-generated briefs |
| `src/config/` | App-wide constants and IITG-specific config |
| `src/types/` | All TypeScript interfaces and types |
| `src/utils/` | Pure helper functions (no side effects) |
| `api/` | Backend endpoints — one file per domain (news, research, placements) |
| `server/` | Feed relay server for CORS-blocked external sources |
| `data/` | Static JSON data (departments, faculty list, campus map GeoJSON) |
| `docs/` | Markdown documentation only |
| `scripts/` | One-off utility scripts (data refresh, setup helpers) |
| `tests/` | Unit tests mirroring `src/` structure |
| `e2e/` | Playwright end-to-end tests |

---

## Adding a New Data Feed

1. Create a new file in `src/feeds/`:
   ```
   src/feeds/your-source-name.ts
   ```
2. Implement the `IITGFeed` interface from `src/types/feed.ts`:
   ```ts
   import type { IITGFeed, FeedItem } from '../types/feed';

   export const yourSourceFeed: IITGFeed = {
     id: 'your-source-id',
     name: 'Your Source Name',
     category: 'research', // or 'news' | 'placement' | 'event' | 'infra'
     async fetch(): Promise<FeedItem[]> {
       // your fetch logic here
     }
   };
   ```
3. Register your feed in `src/config/feeds.config.ts`
4. Write a unit test in `tests/feeds/your-source-name.test.ts`

---

## Adding a New UI Component

1. Create your component in the appropriate subfolder of `src/components/`
2. Keep components **pure** where possible — data fetching belongs in `src/feeds/` or `api/`
3. Export from the subfolder's `index.ts`
4. Document any props with JSDoc comments

---

## Code Style

This project uses [Biome](https://biomejs.dev/) for linting and formatting.

```bash
npm run lint          # Check for issues
npm run lint:fix      # Auto-fix where possible
npm run typecheck     # TypeScript type check
```

Key rules:
- Use TypeScript strictly — avoid `any`
- Prefer named exports over default exports
- One responsibility per file
- Keep functions under 40 lines where possible
- All new code must have TypeScript types

---

## Pull Request Process

1. Ensure `npm run typecheck` and `npm run lint` pass with no errors
2. Write or update tests for your changes
3. Update relevant docs if needed
4. Fill out the PR template completely
5. Link the related issue if one exists
6. Request a review from the maintainer (`@Nihal1DS`)

PR title format: `feat: add placement feed from IITG CDC` / `fix: RSS parser for IITG news`

---

## Reporting Bugs

Use the **Bug Report** issue template. Include:
- What you expected vs what happened
- Steps to reproduce
- Browser/OS/Node version
- Console error logs

---

## Feature Requests

Use the **Feature Request** issue template. Describe:
- What problem you're solving
- What data source or feature would help
- Why this is relevant to the IITG community

---

## Code of Conduct

Please read [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md). This is a community project — be respectful, inclusive, and constructive.

---

**Questions?** Open a Discussion on GitHub or email [nihalpatel.2802@gmail.com](mailto:nihalpatel.2802@gmail.com)
