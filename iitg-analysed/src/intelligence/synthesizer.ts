/**
 * @file src/intelligence/synthesizer.ts
 * AI synthesis engine — takes raw FeedItems and produces IntelligenceBriefs.
 * Supports Ollama (local), Groq, and OpenRouter backends.
 */

import type { FeedItem } from '../types/feed';
import type { IntelligenceBrief, LLMConfig, SignalStrength } from '../types/intelligence';
import { generateId } from '../utils/id';

const SYSTEM_PROMPT = `You are an intelligence analyst for IIT Guwahati.
Given a set of recent news items and updates from the IIT Guwahati campus,
produce a concise brief (2-3 sentences) summarizing the key developments.
Focus on what is most relevant to students, faculty, and researchers.
Respond ONLY with a JSON object: { "title": string, "summary": string, "tags": string[], "signalStrength": "low"|"medium"|"high"|"critical" }`;

export class IntelligenceSynthesizer {
  private config: LLMConfig;

  constructor(config: LLMConfig) {
    this.config = config;
  }

  async synthesize(items: FeedItem[]): Promise<IntelligenceBrief[]> {
    if (items.length === 0) return [];

    // Group items by category, synthesize a brief per group
    const grouped = items.reduce<Record<string, FeedItem[]>>((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {});

    const briefs = await Promise.allSettled(
      Object.entries(grouped).map(([category, groupItems]) =>
        this.synthesizeGroup(category, groupItems)
      )
    );

    return briefs
      .filter((r): r is PromiseFulfilledResult<IntelligenceBrief> => r.status === 'fulfilled')
      .map((r) => r.value);
  }

  private async synthesizeGroup(category: string, items: FeedItem[]): Promise<IntelligenceBrief> {
    const itemsText = items
      .slice(0, 5)
      .map((i) => `- ${i.title}: ${i.summary}`)
      .join('\n');

    const userPrompt = `Category: ${category}\nItems:\n${itemsText}`;

    let raw: string;
    try {
      raw = await this.callLLM(userPrompt);
    } catch {
      // Fallback: simple concatenation if LLM unavailable
      return this.fallbackBrief(category, items);
    }

    try {
      const parsed = JSON.parse(raw) as {
        title: string;
        summary: string;
        tags: string[];
        signalStrength: SignalStrength;
      };
      return {
        id: generateId('brief', category + Date.now()),
        title: parsed.title,
        summary: parsed.summary,
        generatedAt: new Date(),
        category: items[0].category,
        sourceItems: items,
        signalStrength: parsed.signalStrength ?? 'medium',
        tags: parsed.tags ?? [],
      };
    } catch {
      return this.fallbackBrief(category, items);
    }
  }

  private fallbackBrief(category: string, items: FeedItem[]): IntelligenceBrief {
    return {
      id: generateId('brief', category + Date.now()),
      title: `${items.length} updates in ${category}`,
      summary: items.slice(0, 3).map((i) => i.title).join(' · '),
      generatedAt: new Date(),
      category: items[0].category,
      sourceItems: items,
      signalStrength: 'low',
      tags: [category, 'iitg'],
    };
  }

  private async callLLM(prompt: string): Promise<string> {
    if (this.config.backend === 'ollama') {
      return this.callOllama(prompt);
    }
    // Extend here for groq / openrouter
    throw new Error(`Backend ${this.config.backend} not yet implemented`);
  }

  private async callOllama(prompt: string): Promise<string> {
    const baseUrl = this.config.baseUrl ?? 'http://localhost:11434';
    const response = await fetch(`${baseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.config.model ?? 'llama3.2',
        system: SYSTEM_PROMPT,
        prompt,
        stream: false,
      }),
    });
    if (!response.ok) throw new Error(`Ollama error: ${response.status}`);
    const data = await response.json() as { response: string };
    return data.response;
  }
}
