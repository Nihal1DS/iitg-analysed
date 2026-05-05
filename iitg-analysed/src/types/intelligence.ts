/**
 * @file src/types/intelligence.ts
 * Types for the AI intelligence / synthesis layer.
 */

import type { FeedCategory, FeedItem } from './feed';

export type SignalStrength = 'low' | 'medium' | 'high' | 'critical';

export interface IntelligenceBrief {
  id: string;
  title: string;
  summary: string;
  generatedAt: Date;
  category: FeedCategory;
  /** Source items that contributed to this brief */
  sourceItems: FeedItem[];
  signalStrength: SignalStrength;
  /** Tags extracted by the LLM */
  tags: string[];
}

export interface CorrelatedSignal {
  id: string;
  description: string;
  categories: FeedCategory[];
  items: FeedItem[];
  strength: SignalStrength;
  detectedAt: Date;
}

export type LLMBackend = 'ollama' | 'groq' | 'openrouter';

export interface LLMConfig {
  backend: LLMBackend;
  model: string;
  baseUrl?: string;
  apiKey?: string;
}
