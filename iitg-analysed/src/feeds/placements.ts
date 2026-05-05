/**
 * @file src/feeds/placements.ts
 * Feed parser for IITG placement data.
 *
 * Source: IITG Career Development Cell public reports
 * https://www.iitg.ac.in/cdc/
 * Refresh: once per day (placement data updates infrequently)
 */

import type { IITGFeed, FeedItem } from '../types/feed';
import { generateId } from '../utils/id';

export const placementsFeed: IITGFeed = {
  id: 'iitg-placements',
  name: 'IITG Placement Data',
  category: 'placement',
  refreshIntervalSeconds: 86400,

  async fetch(): Promise<FeedItem[]> {
    const response = await fetch('/api/placements/recent');
    if (!response.ok) {
      throw new Error(`Placements feed error: ${response.status}`);
    }

    const data = await response.json() as Array<{
      title: string;
      description: string;
      date: string;
      url?: string;
      tags?: string[];
    }>;

    return data.map((item) => ({
      id: generateId('iitg-placements', item.title + item.date),
      title: item.title,
      summary: item.description.slice(0, 300),
      url: item.url,
      publishedAt: new Date(item.date),
      source: 'IITG CDC',
      sourceId: 'iitg-placements',
      category: 'placement',
      tags: item.tags ?? ['placement', 'cdc', 'iitg'],
    }));
  },
};
