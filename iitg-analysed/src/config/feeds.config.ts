/**
 * @file src/config/feeds.config.ts
 * Central registry of all active feeds.
 * To add a new feed:
 *   1. Create your parser in src/feeds/your-feed.ts
 *   2. Import it here and add to ACTIVE_FEEDS
 */

import type { IITGFeed } from '../types/feed';
import { iitgNewsFeed } from '../feeds/iitg-news';
import { iitgEventsFeed } from '../feeds/iitg-events';
import { iitgResearchFeed } from '../feeds/iitg-research';
import { placementsFeed } from '../feeds/placements';
import { imdWeatherFeed } from '../feeds/imd-weather';

/**
 * All active feeds. Add your new feed object here.
 * The aggregator in src/feeds/index.ts picks these up automatically.
 */
export const ACTIVE_FEEDS: IITGFeed[] = [
  iitgNewsFeed,
  iitgEventsFeed,
  iitgResearchFeed,
  placementsFeed,
  imdWeatherFeed,
];

/** Default refresh interval for feeds that don't specify one (in seconds) */
export const DEFAULT_REFRESH_INTERVAL = 300;
