/**
 * @file src/feeds/iitg-research.ts
 * Feed parser for IITG research publications via Scopus API.
 *
 * Requires SCOPUS_API_KEY in .env (free key at dev.elsevier.com).
 * Falls back to IITG R&D portal scrape if no key is set.
 * Refresh: every 6 hours
 */

import type { IITGFeed, FeedItem } from '../types/feed';
import { generateId } from '../utils/id';

const AFFILIATION_ID = '60014990'; // IITG Scopus affiliation ID

export const iitgResearchFeed: IITGFeed = {
  id: 'iitg-research',
  name: 'IITG Research Publications',
  category: 'research',
  refreshIntervalSeconds: 21600,

  async fetch(): Promise<FeedItem[]> {
    // Route through the API backend (which holds the Scopus API key securely)
    const response = await fetch('/api/research/recent?limit=20');
    if (!response.ok) {
      throw new Error(`Research feed error: ${response.status}`);
    }

    const data = await response.json() as Array<{
      title: string;
      authors: string[];
      journal: string;
      doi?: string;
      publishedDate: string;
      abstract?: string;
      department?: string;
    }>;

    return data.map((pub) => ({
      id: generateId('iitg-research', pub.doi ?? pub.title),
      title: pub.title,
      summary: pub.abstract
        ? pub.abstract.slice(0, 300)
        : `By ${pub.authors.join(', ')} — Published in ${pub.journal}`,
      url: pub.doi ? `https://doi.org/${pub.doi}` : undefined,
      publishedAt: new Date(pub.publishedDate),
      source: 'IITG Research (Scopus)',
      sourceId: 'iitg-research',
      category: 'research',
      tags: ['research', 'publication', pub.department ?? 'iitg'].filter(Boolean),
    }));
  },
};

export { AFFILIATION_ID };
