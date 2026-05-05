/**
 * @file src/feeds/iitg-events.ts
 * Feed parser for IITG campus events.
 *
 * Sources:
 *   - https://www.iitg.ac.in/events/ (scraped via relay)
 *   - Techniche: https://techniche.org
 *   - Alcheringa: https://alcheringa.in
 * Refresh: every 30 minutes
 */

import type { IITGFeed, FeedItem } from '../types/feed';
import { generateId } from '../utils/id';

export const iitgEventsFeed: IITGFeed = {
  id: 'iitg-events',
  name: 'IITG Events',
  category: 'event',
  refreshIntervalSeconds: 1800,

  async fetch(): Promise<FeedItem[]> {
    const response = await fetch('/relay/iitg-events');
    if (!response.ok) {
      throw new Error(`IITG Events feed error: ${response.status}`);
    }

    // Relay returns normalized JSON — see server/relays/iitg-events.ts
    const data = await response.json() as Array<{
      title: string;
      date: string;
      description: string;
      url?: string;
      tags?: string[];
    }>;

    return data.map((event) => ({
      id: generateId('iitg-events', event.title + event.date),
      title: event.title,
      summary: event.description.slice(0, 300),
      url: event.url,
      publishedAt: new Date(event.date),
      source: 'IITG Events',
      sourceId: 'iitg-events',
      category: 'event',
      tags: event.tags ?? ['event', 'iitg'],
    }));
  },
};
