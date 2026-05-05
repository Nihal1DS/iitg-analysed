/**
 * @file api/index.ts
 * IITG Analysed — main API server (Express).
 * Handles authenticated external API calls, caching, and data transformation.
 *
 * Routes:
 *   GET /api/research/recent   — recent IITG publications from Scopus
 *   GET /api/placements/recent — recent placement announcements
 *   GET /health                — health check
 */

import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(cors({ origin: ['http://localhost:5173', 'https://iitg-analysed.vercel.app'] }));
app.use(express.json());

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'iitg-analysed-api', ts: new Date().toISOString() });
});

// ── Research — Scopus ────────────────────────────────────────────────────────
app.get('/api/research/recent', async (req, res) => {
  const limit = Math.min(Number(req.query.limit ?? 20), 50);
  const apiKey = process.env.SCOPUS_API_KEY;

  if (!apiKey) {
    // Return empty if no key — frontend shows graceful empty state
    return res.json([]);
  }

  try {
    const url = new URL('https://api.elsevier.com/content/search/scopus');
    url.searchParams.set('query', 'af-id(60014990)'); // IITG affiliation
    url.searchParams.set('count', String(limit));
    url.searchParams.set('sort', 'coverDate-desc');
    url.searchParams.set('field', 'title,creator,publicationName,doi,coverDate,description');

    const response = await fetch(url.toString(), {
      headers: { 'X-ELS-APIKey': apiKey, Accept: 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Scopus error: ${response.status}`);
    }

    const data = await response.json() as {
      'search-results': {
        entry: Array<{
          'dc:title': string;
          'dc:creator': string;
          'prism:publicationName': string;
          'prism:doi'?: string;
          'prism:coverDate': string;
          'dc:description'?: string;
        }>;
      };
    };

    const entries = data['search-results'].entry ?? [];
    const normalized = entries.map((e) => ({
      title: e['dc:title'],
      authors: [e['dc:creator']],
      journal: e['prism:publicationName'],
      doi: e['prism:doi'],
      publishedDate: e['prism:coverDate'],
      abstract: e['dc:description'],
    }));

    return res.json(normalized);
  } catch (err) {
    console.error('Scopus fetch error:', err);
    return res.status(502).json({ error: 'Failed to fetch research data' });
  }
});

// ── Placements ────────────────────────────────────────────────────────────────
app.get('/api/placements/recent', (_req, res) => {
  // Placeholder — implement scraping or manual data entry here
  // Contributors can add a proper scraper for the IITG CDC page
  res.json([
    {
      title: 'Placement Season 2025-26 Opens',
      description: 'The Career Development Cell has opened registrations for the 2025-26 placement season.',
      date: new Date().toISOString(),
      url: 'https://www.iitg.ac.in/cdc/',
      tags: ['placement', 'cdc'],
    },
  ]);
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`IITG Analysed API running on http://localhost:${PORT}`);
});

export default app;
