/**
 * @file src/feeds/imd-weather.ts
 * Weather feed for Guwahati/IITG campus area from IMD.
 *
 * Uses Open-Meteo (free, no key needed) for Guwahati coordinates.
 * Refresh: every 30 minutes
 */

import type { IITGFeed, FeedItem } from '../types/feed';
import { generateId } from '../utils/id';

const IITG_LAT = 26.1918;
const IITG_LNG = 91.6946;

export const imdWeatherFeed: IITGFeed = {
  id: 'iitg-weather',
  name: 'IITG Campus Weather',
  category: 'weather',
  refreshIntervalSeconds: 1800,

  async fetch(): Promise<FeedItem[]> {
    const url = new URL('https://api.open-meteo.com/v1/forecast');
    url.searchParams.set('latitude', String(IITG_LAT));
    url.searchParams.set('longitude', String(IITG_LNG));
    url.searchParams.set('current', 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,precipitation');
    url.searchParams.set('timezone', 'Asia/Kolkata');

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`Weather feed error: ${response.status}`);
    }

    const data = await response.json() as {
      current: {
        temperature_2m: number;
        relative_humidity_2m: number;
        weather_code: number;
        wind_speed_10m: number;
        precipitation: number;
        time: string;
      };
    };

    const c = data.current;
    const summary = `${c.temperature_2m}°C, Humidity ${c.relative_humidity_2m}%, Wind ${c.wind_speed_10m} km/h, Precipitation ${c.precipitation} mm`;

    return [
      {
        id: generateId('iitg-weather', c.time),
        title: `IITG Campus Weather — ${c.temperature_2m}°C`,
        summary,
        publishedAt: new Date(c.time),
        source: 'Open-Meteo (Guwahati)',
        sourceId: 'iitg-weather',
        category: 'weather',
        tags: ['weather', 'guwahati', 'campus'],
      },
    ];
  },
};
