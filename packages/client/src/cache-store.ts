/**
 * Cache Store — Port + Default Adapter (Hexagonal Architecture)
 *
 * The CacheStore port decouples CapabilityCache from its backing storage.
 * This enables shared caches, Redis-backed caches, etc.
 */

// ---------------------------------------------------------------------------
// Port
// ---------------------------------------------------------------------------

/** Entry stored in the cache */
export interface CacheStoreEntry {
  data: unknown;
  cachedAt: number;
  ttlMs: number;
}

/**
 * Port: backing store for cache entries.
 * Implement this to use Redis, shared memory, etc.
 */
export interface CacheStore {
  get(key: string): CacheStoreEntry | undefined;
  set(key: string, entry: CacheStoreEntry): void;
  delete(key: string): boolean;
  keys(): IterableIterator<string>;
  readonly size: number;
  clear(): void;
}

// ---------------------------------------------------------------------------
// Default Adapter: In-Memory
// ---------------------------------------------------------------------------

export interface InMemoryStoreConfig {
  maxEntries?: number;
}

/**
 * Default adapter: simple Map-based store with LRU eviction.
 */
export class InMemoryCacheStore implements CacheStore {
  private entries = new Map<string, CacheStoreEntry>();
  private readonly maxEntries: number;

  constructor(config?: InMemoryStoreConfig) {
    this.maxEntries = config?.maxEntries ?? 1000;
  }

  get(key: string): CacheStoreEntry | undefined {
    const entry = this.entries.get(key);
    if (!entry) return undefined;

    // Check TTL
    if (Date.now() - entry.cachedAt > entry.ttlMs) {
      this.entries.delete(key);
      return undefined;
    }
    return entry;
  }

  set(key: string, entry: CacheStoreEntry): void {
    // Update if exists
    if (this.entries.has(key)) {
      this.entries.set(key, entry);
      return;
    }

    // Evict oldest if at capacity
    if (this.entries.size >= this.maxEntries) {
      this.evictOldest();
    }

    this.entries.set(key, entry);
  }

  delete(key: string): boolean {
    return this.entries.delete(key);
  }

  keys(): IterableIterator<string> {
    return this.entries.keys();
  }

  get size(): number {
    return this.entries.size;
  }

  clear(): void {
    this.entries.clear();
  }

  private evictOldest(): void {
    let oldestKey: string | undefined;
    let oldestTime = Infinity;

    for (const [key, entry] of this.entries) {
      if (entry.cachedAt < oldestTime) {
        oldestTime = entry.cachedAt;
        oldestKey = key;
      }
    }

    if (oldestKey) this.entries.delete(oldestKey);
  }
}
