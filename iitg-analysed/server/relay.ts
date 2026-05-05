/**
 * @file server/relay.ts
 * Lightweight relay/proxy server for CORS-blocked external feeds.
 * Runs separately from the main API (different port).
 *
 * Routes:
 *   GET /iitg-news-rss     — IITG official news RSS feed
 *   GET /iitg-events       — IITG events (scraped, returned as JSON)
 *   GET /health            — health check
 */

import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.RELAY_PORT ?? 3001;

app.use(cors({ origin: ['http://localhost:5173'] }));

// ── IITG News RSS ─────────────────────────────────────────────────────────────
app.get('/iitg-news-rss', async (_req, res) => {
  try {
    const response = await fetch('https://www.iitg.ac.in/news/rss.xml', {
      headers: { 'User-Agent': 'IITG-Analysed/1.0 (+https://github.com/Nihal1DS/IITG-analysed)' },
    });
    if (!response.ok) throw new Error(`Upstream error: ${response.status}`);
    const xml = await response.text();
    res.set('Content-Type', 'application/rss+xml');
    res.send(xml);
  } catch (err) {
    console.error('IITG News RSS relay error:', err);
    res.status(502).json({ error: 'Failed to fetch IITG News RSS' });
  }
});

// ── IITG Events ───────────────────────────────────────────────────────────────
app.get('/iitg-events', async (_req, res) => {
  try {
    // TODO: implement scraping of https://www.iitg.ac.in/events/
    // For now, returns a minimal placeholder
    // Contributors: implement proper scraping here (see CONTRIBUTING.md)
    res.json([
      {
        title: 'Techniche 2025',
        date: '2025-09-05T00:00:00Z',
        description: 'Annual techno-management festival of IIT Guwahati.',
        url: 'https://techniche.org',
        tags: ['techniche', 'fest', 'tech'],
      },
      {
        title: 'Alcheringa 2026',
        date: '2026-01-23T00:00:00Z',
        description: 'Asia\'s largest cultural festival hosted by IIT Guwahati.',
        url: 'https://alcheringa.in',
        tags: ['alcheringa', 'fest', 'cultural'],
      },
    ]);
  } catch (err) {
    console.error('IITG Events relay error:', err);
    res.status(502).json({ error: 'Failed to fetch IITG Events' });
  }
});

// ── Health ────────────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'iitg-analysed-relay', ts: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`IITG Analysed Relay running on http://localhost:${PORT}`);
});
