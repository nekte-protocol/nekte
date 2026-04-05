import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { CapabilityCache } from '../cache.js';
import type { CapabilityRef } from '@nekte/core';

const ref: CapabilityRef = { id: 'sentiment', cat: 'nlp', h: 'abc12345' };

describe('CapabilityCache', () => {
  let cache: CapabilityCache;

  beforeEach(() => {
    cache = new CapabilityCache({ defaultTtlMs: 60_000, maxEntries: 3 });
  });

  it('stores and retrieves capabilities', () => {
    cache.set('agent1', ref, 0);
    expect(cache.get('agent1', 'sentiment', 0)).toEqual(ref);
  });

  it('returns version hash', () => {
    cache.set('agent1', ref, 0);
    expect(cache.getHash('agent1', 'sentiment')).toBe('abc12345');
  });

  it('validates hash', () => {
    cache.set('agent1', ref, 0);
    expect(cache.isValid('agent1', 'sentiment', 'abc12345')).toBe(true);
    expect(cache.isValid('agent1', 'sentiment', 'wrong')).toBe(false);
  });

  it('returns undefined for missing entries', () => {
    expect(cache.get('agent1', 'missing', 0)).toBeUndefined();
    expect(cache.getHash('agent1', 'missing')).toBeUndefined();
  });

  it('invalidates specific capability', () => {
    cache.set('agent1', ref, 0);
    cache.invalidate('agent1', 'sentiment');
    expect(cache.get('agent1', 'sentiment', 0)).toBeUndefined();
  });

  it('invalidates all capabilities for an agent', () => {
    cache.set('agent1', ref, 0);
    cache.set('agent1', { ...ref, id: 'translate', h: 'def456' }, 0);
    cache.invalidateAgent('agent1');
    expect(cache.stats().size).toBe(0);
  });

  it('clears entire cache', () => {
    cache.set('agent1', ref, 0);
    cache.set('agent2', { ...ref, h: 'other' }, 0);
    cache.clear();
    expect(cache.stats().size).toBe(0);
  });

  it('evicts oldest when at capacity', () => {
    cache.set('a', { id: 'cap1', cat: 'x', h: '1' }, 0);
    cache.set('a', { id: 'cap2', cat: 'x', h: '2' }, 0);
    cache.set('a', { id: 'cap3', cat: 'x', h: '3' }, 0);
    // At capacity (3). Adding one more should evict oldest.
    cache.set('a', { id: 'cap4', cat: 'x', h: '4' }, 0);
    expect(cache.stats().size).toBe(3);
    expect(cache.get('a', 'cap1', 0)).toBeUndefined();
  });

  it('reports stats with agent count', () => {
    cache.set('agent1', ref, 0);
    cache.set('agent2', { ...ref, h: 'other' }, 0);
    const stats = cache.stats();
    expect(stats.size).toBe(2);
    expect(stats.agents).toBe(2);
  });

  it('expires entries after TTL', () => {
    vi.useFakeTimers();
    const shortCache = new CapabilityCache({ defaultTtlMs: 100 });
    shortCache.set('agent1', ref, 0);
    expect(shortCache.get('agent1', 'sentiment', 0)).toEqual(ref);

    vi.advanceTimersByTime(200);
    expect(shortCache.get('agent1', 'sentiment', 0)).toBeUndefined();
    vi.useRealTimers();
  });
});
