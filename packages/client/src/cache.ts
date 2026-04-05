/**
 * Capability Cache
 *
 * Client-side cache that stores version hashes and schemas
 * from previous interactions. Enables zero-schema invocation:
 * if the hash hasn't changed, skip the schema reload entirely.
 *
 * Supports pluggable backing stores via the CacheStore port,
 * enabling cross-agent cache sharing.
 */

import type { Capability, DiscoveryLevel } from '@nekte/core';
import { InMemoryCacheStore, type CacheStore, type CacheStoreEntry } from './cache-store.js';

interface CacheEntryData {
  levels: Partial<Record<DiscoveryLevel, Capability>>;
  hash: string;
}

export interface CacheConfig {
  /** Default TTL for cache entries (ms). Default: 5 minutes */
  defaultTtlMs?: number;
  /** Maximum number of entries. Default: 1000 */
  maxEntries?: number;
  /** Pluggable backing store. Default: InMemoryCacheStore */
  store?: CacheStore;
  /** Key namespace prefix (for multi-environment shared stores) */
  namespace?: string;
}

export class CapabilityCache {
  private readonly store: CacheStore;
  private readonly defaultTtlMs: number;
  private readonly namespace: string;

  constructor(config?: CacheConfig) {
    this.defaultTtlMs = config?.defaultTtlMs ?? 5 * 60 * 1000;
    this.namespace = config?.namespace ? `${config.namespace}:` : '';
    this.store = config?.store ?? new InMemoryCacheStore({ maxEntries: config?.maxEntries ?? 1000 });
  }

  /**
   * Store a capability at a given discovery level.
   */
  set(agentId: string, cap: Capability, level: DiscoveryLevel, ttlMs?: number): void {
    const key = this.key(agentId, cap.id);
    const existing = this.store.get(key);
    const data: CacheEntryData = existing
      ? { ...(existing.data as CacheEntryData), hash: cap.h }
      : { levels: {}, hash: cap.h };

    data.levels[level] = cap;

    this.store.set(key, {
      data,
      cachedAt: Date.now(),
      ttlMs: ttlMs ?? this.defaultTtlMs,
    });
  }

  /**
   * Get the version hash for a capability.
   * Returns undefined if not cached or expired.
   */
  getHash(agentId: string, capId: string): string | undefined {
    const entry = this.getEntry(agentId, capId);
    return entry?.hash;
  }

  /**
   * Get a cached capability at a specific level.
   */
  get(agentId: string, capId: string, level: DiscoveryLevel): Capability | undefined {
    const entry = this.getEntry(agentId, capId);
    return entry?.levels[level];
  }

  /**
   * Check if a version hash is still valid.
   */
  isValid(agentId: string, capId: string, hash: string): boolean {
    const cached = this.getHash(agentId, capId);
    return cached === hash;
  }

  /**
   * Invalidate a specific capability.
   */
  invalidate(agentId: string, capId: string): void {
    this.store.delete(this.key(agentId, capId));
  }

  /**
   * Invalidate all capabilities for an agent.
   */
  invalidateAgent(agentId: string): void {
    const prefix = `${this.namespace}${agentId}:`;
    for (const key of [...this.store.keys()]) {
      if (key.startsWith(prefix)) {
        this.store.delete(key);
      }
    }
  }

  /**
   * Clear the entire cache.
   */
  clear(): void {
    this.store.clear();
  }

  /**
   * Get cache stats for debugging/monitoring.
   */
  stats(): { size: number; agents: number } {
    const agents = new Set<string>();
    for (const key of this.store.keys()) {
      const withoutNs = key.startsWith(this.namespace) ? key.slice(this.namespace.length) : key;
      agents.add(withoutNs.split(':')[0]);
    }
    return { size: this.store.size, agents: agents.size };
  }

  // -----------------------------------------------------------------------

  private key(agentId: string, capId: string): string {
    return `${this.namespace}${agentId}:${capId}`;
  }

  private getEntry(agentId: string, capId: string): CacheEntryData | undefined {
    const entry = this.store.get(this.key(agentId, capId));
    if (!entry) return undefined;
    return entry.data as CacheEntryData;
  }
}
