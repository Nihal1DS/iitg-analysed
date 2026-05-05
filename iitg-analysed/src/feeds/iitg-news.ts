/**
 * @file src/feeds/iitg-news.ts
 * Feed parser for IITG official news and announcements.
 *
 * Source: https://www.iitg.ac.in/news/
 * Method: RSS via relay server (CORS-blocked from browser)
 * Refresh: every 10 minutes
 */

import type { IITGFeed, FeedItem } from '../types/feed';
import { generateId } from '../utils/id';

const FEED_URL = '/relay/iitg-news-rss';

export const iitgNewsFeed: IITGFeed = {
  id: 'iitg-news',
  name: 'IITG Official News',
  category: 'news',
  refreshIntervalSeconds: 600,

  async fetch(): Promise<FeedItem[]> {
    const response = await fetch(FEED_URL);
    if (!response.ok) {
      throw new Error(`IITG News feed error: ${response.status}`);
    }

    const xml = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'application/xml');
    const items = Array.from(doc.querySelectorAll('item'));

    return items.map((item) => {
      const title = item.querySelector('title')?.textContent ?? 'Untitled';
      const link = item.querySelector('link')?.textContent ?? undefined;
      const description = item.querySelector('description')?.textContent ?? '';
      const pubDate = item.querySelector('pubDate')?.textContent;

      return {
        id: generateId('iitg-news', title),
        title,
        summary: description.replace(/<[^>]+>/g, '').slice(0, 300),
        url: link,
        publishedAt: pubDate ? new Date(pubDate) : new Date(),
        source: 'IITG Official News',
        sourceId: 'iitg-news',
        category: 'news',
        tags: ['official', 'iitg'],
      };
    });
  },
};
