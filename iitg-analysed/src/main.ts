/**
 * @file src/main.ts
 * Application entry point for IITG Analysed.
 * Initialises the dashboard, feed aggregator, and intelligence engine.
 */

import './styles/global.css';
import { Dashboard } from './components/dashboard/Dashboard';
import { fetchAllFeeds } from './feeds/index';
import { IntelligenceSynthesizer } from './intelligence/synthesizer';

async function init() {
  const app = document.getElementById('app');
  if (!app) throw new Error('Missing #app element in DOM');

  // Mount dashboard shell
  const dashboard = new Dashboard(app);
  dashboard.render();

  // Start feed polling
  async function refreshFeeds() {
    try {
      const items = await fetchAllFeeds();
      dashboard.updateFeeds(items);

      // Run AI synthesis
      const llmBackend = (import.meta.env.VITE_LLM_BACKEND as string) ?? 'ollama';
      const synthesizer = new IntelligenceSynthesizer({
        backend: llmBackend as 'ollama' | 'groq' | 'openrouter',
        model: 'llama3.2',
        baseUrl: import.meta.env.VITE_OLLAMA_URL,
      });
      const briefs = await synthesizer.synthesize(items);
      dashboard.updateBriefs(briefs);
    } catch (err) {
      console.error('Feed refresh error:', err);
    }
  }

  await refreshFeeds();
  // Refresh every 5 minutes
  setInterval(refreshFeeds, 5 * 60 * 1000);
}

init();
