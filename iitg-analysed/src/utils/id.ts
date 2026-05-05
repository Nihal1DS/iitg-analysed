/**
 * @file src/utils/id.ts
 * Deterministic ID generator for feed items.
 */

/** Generate a stable ID from a namespace + key string */
export function generateId(namespace: string, key: string): string {
  const raw = `${namespace}::${key}`;
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    hash = (Math.imul(31, hash) + raw.charCodeAt(i)) | 0;
  }
  return `${namespace}-${Math.abs(hash).toString(36)}`;
}
