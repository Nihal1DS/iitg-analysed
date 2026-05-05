/**
 * @file src/feeds/index.ts
 * Feed aggregator — collects all active feeds and merges results.
 * Uses the feed registry from src/config/feeds.config.ts.
 */

import type { FeedItem, FeedCategory } from '../types/feed';
import { ACTIVE_FEEDS, DEFAULT_REFRESH_INTERVAL } from '../config/feeds.config';

/** In-memory cache per feed ID */
const cache = new Map<string, { items: FeedItem[]; fetchedAt: Date }>();

/** Fetch all active feeds in parallel, with per-feed caching */
export async function fetchAllFeeds(): Promise<FeedItem[]> {
  const results = await Promise.allSettled(
    ACTIVE_FEEDS.map(async (feed) => {
      const cached = cache.get(feed.id);
      const ttl = (feed.refreshIntervalSeconds ?? DEFAULT_REFRESH_INTERVAL) * 1000;
      if (cached && Date.now() - cached.fetchedAt.getTime() < ttl) {
        return cached.items;
      }
      const items = await feed.fetch();
      cache.set(feed.id, { items, fetchedAt: new Date() });
      return items;
    })
  );

  const items: FeedItem[] = [];
  for (const result of results) {
    if (result.status === 'fulfilled') {
      items.push(...result.value);
    } else {
      console.warn('Feed fetch failed:', result.reason);
    }
  }

  // Sort by publish date, newest first
  return items.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
}

/** Fetch feeds for a specific category only */
export async function fetchFeedsByCategory(category: FeedCategory): Promise<FeedItem[]> {
  const all = await fetchAllFeeds();
  return all.filter((item) => item.category === category);
}

/** Invalidate the cache for a specific feed */
export function invalidateFeed(feedId: string): void {
  cache.delete(feedId);
}
