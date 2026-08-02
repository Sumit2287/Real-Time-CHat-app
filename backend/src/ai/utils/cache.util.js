/**
 * In-memory LRU Cache Utility for Embeddings & AI Calculations
 */
class SimpleLruCache {
  constructor(maxSize = 500, ttlMs = 1000 * 60 * 30) {
    this.maxSize = maxSize;
    this.ttlMs = ttlMs;
    this.cache = new Map();
  }

  get(key) {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > this.ttlMs) {
      this.cache.delete(key);
      return null;
    }

    // Refresh position for LRU
    this.cache.delete(key);
    this.cache.set(key, entry);
    return entry.value;
  }

  set(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      // Delete oldest entry
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, { value, timestamp: Date.now() });
  }

  clear() {
    this.cache.clear();
  }
}

export const embeddingCache = new SimpleLruCache(1000, 1000 * 60 * 60); // 1 hour TTL
export const smartReplyCache = new SimpleLruCache(200, 1000 * 60 * 5); // 5 min TTL
