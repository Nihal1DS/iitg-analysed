/**
 * @file src/components/dashboard/Dashboard.ts
 * Main dashboard shell component.
 * Composes feed panels, map, and intelligence briefs into the layout.
 */

import type { FeedItem } from '../../types/feed';
import type { IntelligenceBrief } from '../../types/intelligence';

export class Dashboard {
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  render(): void {
    this.container.innerHTML = `
      <div class="iitg-dashboard">
        <header class="dashboard-header">
          <h1>🎓 IITG Analysed</h1>
          <p class="subtitle">Real-time IIT Guwahati Intelligence Dashboard</p>
        </header>

        <main class="dashboard-grid">
          <section id="intelligence-panel" class="panel panel--intelligence">
            <h2>AI Intelligence Briefs</h2>
            <div id="briefs-list" class="briefs-list">
              <p class="loading">Loading intelligence briefs...</p>
            </div>
          </section>

          <section id="feed-panel" class="panel panel--feeds">
            <h2>Live Feed</h2>
            <div id="feed-list" class="feed-list">
              <p class="loading">Fetching live data...</p>
            </div>
          </section>

          <section id="map-panel" class="panel panel--map">
            <h2>Campus Map</h2>
            <div id="campus-map" class="campus-map">
              <!-- Campus map mounts here via src/maps/campus-map.ts -->
            </div>
          </section>
        </main>
      </div>
    `;
  }

  updateFeeds(items: FeedItem[]): void {
    const list = document.getElementById('feed-list');
    if (!list) return;

    list.innerHTML = items
      .slice(0, 30)
      .map(
        (item) => `
        <article class="feed-item feed-item--${item.category}">
          <span class="feed-item__badge">${item.category}</span>
          <h3 class="feed-item__title">
            ${item.url ? `<a href="${item.url}" target="_blank" rel="noopener">${item.title}</a>` : item.title}
          </h3>
          <p class="feed-item__summary">${item.summary}</p>
          <time class="feed-item__time">${item.publishedAt.toLocaleString('en-IN')}</time>
        </article>
      `
      )
      .join('');
  }

  updateBriefs(briefs: IntelligenceBrief[]): void {
    const list = document.getElementById('briefs-list');
    if (!list) return;

    if (briefs.length === 0) {
      list.innerHTML = '<p class="empty">No briefs generated yet.</p>';
      return;
    }

    list.innerHTML = briefs
      .map(
        (brief) => `
        <div class="brief brief--${brief.signalStrength}">
          <h3 class="brief__title">${brief.title}</h3>
          <p class="brief__summary">${brief.summary}</p>
          <div class="brief__meta">
            <span class="brief__signal">${brief.signalStrength.toUpperCase()}</span>
            <span class="brief__time">${brief.generatedAt.toLocaleTimeString('en-IN')}</span>
          </div>
        </div>
      `
      )
      .join('');
  }
}
