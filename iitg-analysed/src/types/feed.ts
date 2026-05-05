/**
 * @file src/types/feed.ts
 * Core types for all data feeds in IITG Analysed.
 * All feed parsers in src/feeds/ must implement IITGFeed.
 */

export type FeedCategory =
  | 'news'        // Official IITG announcements, press releases
  | 'research'    // Publications, patents, grants
  | 'placement'   // Placement season data, company visits
  | 'event'       // Campus events, fests, seminars
  | 'infra'       // Facility status, campus infrastructure
  | 'weather'     // IMD Guwahati weather
  | 'student';    // Student body announcements

export interface FeedItem {
  id: string;
  title: string;
  summary: string;
  url?: string;
  publishedAt: Date;
  source: string;           // Human-readable source name, e.g. "IITG News"
  sourceId: string;         // Machine ID of the feed, e.g. "iitg-news"
  category: FeedCategory;
  tags?: string[];
  imageUrl?: string;
  /** Relevance score 0–1, set by intelligence engine */
  relevance?: number;
}

/** Standard interface every feed parser must implement */
export interface IITGFeed {
  /** Unique machine-readable ID, e.g. "iitg-news", "scopus" */
  id: string;
  /** Human-readable name */
  name: string;
  category: FeedCategory;
  /** Fetch and return normalized feed items */
  fetch(): Promise<FeedItem[]>;
  /** Optional: how often to refresh this feed in seconds (default: 300) */
  refreshIntervalSeconds?: number;
}

export interface FeedState {
  items: FeedItem[];
  lastUpdated: Date | null;
  loading: boolean;
  error: string | null;
}
