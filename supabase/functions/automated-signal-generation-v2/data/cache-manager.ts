// ==================================================================================
// 🎯 SESSION #309: CACHE MANAGER - MARKET DATA CACHING LAYER
// ==================================================================================
// 🚨 PURPOSE: Create basic API response caching for improved performance and rate limiting
// 🛡️ ANTI-REGRESSION MANDATE: NO impact on existing functionality - additive enhancement only
// 📝 SESSION #309 CREATION: New module to support future performance optimization
// 🔧 FOUNDATION: Basic caching infrastructure for Polygon.io API responses
// 🚨 CRITICAL SUCCESS: Enable caching without breaking existing API flow
// ⚠️ SIMPLE APPROACH: In-memory caching with TTL support for Edge Function environment
// 🎖️ PERFORMANCE READY: Cache management for API rate limiting optimization
// 📊 PRODUCTION SAFE: Optional caching that preserves all existing API behavior
// 🏆 TESTING REQUIREMENT: Cache hits/misses should not affect data accuracy
// 🚀 FUTURE READY: Foundation for advanced caching strategies in future sessions
// ==================================================================================

import {
  CacheEntry,
  CacheStatistics,
  CacheConfig,
} from "../types/market-data-types.ts";

/**
 * 🗄️ CACHE MANAGER - SESSION #309 NEW MODULE
 * 🚨 NEW MODULE: Basic caching infrastructure for API responses
 * 🛡️ ANTI-REGRESSION: Additive enhancement - does not modify existing functionality
 * 🎯 PURPOSE: Provide optional caching for Polygon.io API responses
 * 🔧 IN-MEMORY: Simple Map-based caching suitable for Edge Function environment
 * 🚀 TTL SUPPORT: Time-to-live management for data freshness
 * 🚨 PERFORMANCE: Reduce API calls while maintaining data accuracy
 * 📊 MONITORING: Basic statistics for cache effectiveness tracking
 * 🎖️ PRODUCTION SAFE: Optional usage preserves all existing behavior
 */
export class CacheManager {
  private cache: Map<string, CacheEntry>;
  private config: CacheConfig;
  private stats: {
    hits: number;
    misses: number;
    totalRequests: number;
  };

  /**
   * 🔧 CONSTRUCTOR - SESSION #309 INITIALIZATION
   * PURPOSE: Initialize cache with configuration
   * FOUNDATION: Set up in-memory cache with reasonable defaults
   */
  constructor(config?: Partial<CacheConfig>) {
    this.cache = new Map();
    this.config = {
      defaultTTL: 300000, // 5 minutes default
      maxEntries: 1000,
      enableLogging: false,
      autoCleanup: true,
      cleanupInterval: 600000, // 10 minutes
      ...config,
    };
    this.stats = {
      hits: 0,
      misses: 0,
      totalRequests: 0,
    };

    // Setup automatic cleanup if enabled
    if (this.config.autoCleanup) {
      setInterval(() => this.cleanup(), this.config.cleanupInterval);
    }
  }

  /**
   * 🗄️ GET CACHED DATA - SESSION #309 CACHE RETRIEVAL
   * 🎯 PURPOSE: Retrieve data from cache if valid and not expired
   * 🔧 TTL CHECK: Validate data freshness before returning
   * 🚀 PERFORMANCE: Fast cache lookup with automatic expiry
   *
   * @param key - Cache key for data lookup
   * @returns Cached data or null if not found/expired
   */
  get<T>(key: string): T | null {
    this.stats.totalRequests++;

    const entry = this.cache.get(key);
    if (!entry) {
      this.stats.misses++;
      if (this.config.enableLogging) {
        console.log(`🔍 [SESSION_309_CACHE] MISS: ${key}`);
      }
      return null;
    }

    const now = Date.now();

    // Check if entry has expired
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      this.stats.misses++;
      if (this.config.enableLogging) {
        console.log(`⏰ [SESSION_309_CACHE] EXPIRED: ${key}`);
      }
      return null;
    }

    // Update access statistics
    entry.accessCount++;
    entry.lastAccessed = now;
    this.stats.hits++;

    if (this.config.enableLogging) {
      console.log(
        `✅ [SESSION_309_CACHE] HIT: ${key} (age: ${(
          (now - entry.timestamp) /
          1000
        ).toFixed(1)}s)`
      );
    }

    return entry.data as T;
  }

  /**
   * 💾 SET CACHED DATA - SESSION #309 CACHE STORAGE
   * 🎯 PURPOSE: Store data in cache with TTL
   * 🔧 TTL SUPPORT: Custom or default time-to-live
   * 🚀 SIZE MANAGEMENT: Automatic cleanup when max entries reached
   *
   * @param key - Cache key for data storage
   * @param data - Data to cache
   * @param ttl - Optional time-to-live in milliseconds
   */
  set<T>(key: string, data: T, ttl?: number): void {
    const now = Date.now();
    const entryTTL = ttl || this.config.defaultTTL;

    // Check if we need to make room
    if (this.cache.size >= this.config.maxEntries) {
      this.evictOldest();
    }

    const entry: CacheEntry<T> = {
      data,
      timestamp: now,
      ttl: entryTTL,
      key,
      accessCount: 0,
      lastAccessed: now,
    };

    this.cache.set(key, entry);

    if (this.config.enableLogging) {
      console.log(
        `💾 [SESSION_309_CACHE] SET: ${key} (ttl: ${(entryTTL / 1000).toFixed(
          1
        )}s)`
      );
    }
  }

  /**
   * 🗑️ DELETE CACHED DATA - SESSION #309 CACHE REMOVAL
   * 🎯 PURPOSE: Remove specific entry from cache
   * 🔧 MANUAL CLEANUP: Explicit cache invalidation
   */
  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    if (deleted && this.config.enableLogging) {
      console.log(`🗑️ [SESSION_309_CACHE] DELETE: ${key}`);
    }
    return deleted;
  }

  /**
   * 🧹 CLEANUP EXPIRED ENTRIES - SESSION #309 CACHE MAINTENANCE
   * 🎯 PURPOSE: Remove expired entries to free memory
   * 🔧 AUTOMATIC: Called periodically if auto-cleanup enabled
   */
  cleanup(): number {
    const now = Date.now();
    let removedCount = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
        removedCount++;
      }
    }

    if (removedCount > 0 && this.config.enableLogging) {
      console.log(
        `🧹 [SESSION_309_CACHE] Cleaned up ${removedCount} expired entries`
      );
    }

    return removedCount;
  }

  /**
   * 🔄 EVICT OLDEST ENTRY - SESSION #309 SIZE MANAGEMENT
   * 🎯 PURPOSE: Remove oldest entry when cache is full
   * 🔧 LRU STRATEGY: Basic least-recently-used eviction
   */
  private evictOldest(): void {
    let oldestKey = "";
    let oldestTime = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (entry.lastAccessed < oldestTime) {
        oldestTime = entry.lastAccessed;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
      if (this.config.enableLogging) {
        console.log(`🔄 [SESSION_309_CACHE] EVICTED: ${oldestKey} (oldest)`);
      }
    }
  }

  /**
   * 📊 GET CACHE STATISTICS - SESSION #309 MONITORING
   * 🎯 PURPOSE: Provide cache performance metrics
   * 🔧 MONITORING: Track effectiveness for optimization
   */
  getStatistics(): CacheStatistics {
    const entries = Array.from(this.cache.values());
    const timestamps = entries.map((e) => e.timestamp);

    return {
      totalEntries: this.cache.size,
      hits: this.stats.hits,
      misses: this.stats.misses,
      hitRate:
        this.stats.totalRequests > 0
          ? this.stats.hits / this.stats.totalRequests
          : 0,
      totalSize: this.cache.size,
      oldestEntry: timestamps.length > 0 ? Math.min(...timestamps) : 0,
      newestEntry: timestamps.length > 0 ? Math.max(...timestamps) : 0,
    };
  }

  /**
   * 🔍 CHECK CACHE KEY EXISTS - SESSION #309 VALIDATION
   * 🎯 PURPOSE: Check if key exists without retrieving data
   * 🔧 UTILITY: Support conditional caching logic
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    // Check if expired
    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * 🧼 CLEAR ALL CACHE - SESSION #309 RESET
   * 🎯 PURPOSE: Clear entire cache
   * 🔧 RESET: Complete cache invalidation
   */
  clear(): void {
    const size = this.cache.size;
    this.cache.clear();
    this.stats = { hits: 0, misses: 0, totalRequests: 0 };

    if (this.config.enableLogging) {
      console.log(`🧼 [SESSION_309_CACHE] Cleared ${size} entries`);
    }
  }

  /**
   * 📊 GET MANAGER NAME - SESSION #309 MODULAR IDENTIFICATION
   * PURPOSE: Identify this manager module for logging and debugging
   * SESSION #301-308 COMPATIBILITY: Follows same naming pattern as other modular components
   */
  getName(): string {
    return "CacheManager";
  }
}

/**
 * 🗄️ CACHE HELPER FUNCTIONS - SESSION #309 UTILITY FUNCTIONS
 * 🎯 PURPOSE: Provide simple caching functions for common use cases
 * 🔧 CONVENIENCE: Simplified cache operations for basic usage
 * 🛡️ OPTIONAL: Can be used or ignored without affecting existing functionality
 */

// Global cache instance for simple usage
let globalCache: CacheManager | null = null;

/**
 * 🗄️ GET GLOBAL CACHE HELPER - SESSION #309 CONVENIENCE FUNCTION
 * 🎯 PURPOSE: Get or create global cache instance
 * 🔧 SINGLETON: Shared cache for simple use cases
 */
export function getGlobalCache(): CacheManager {
  if (!globalCache) {
    globalCache = new CacheManager({
      enableLogging: false,
      defaultTTL: 300000, // 5 minutes
      maxEntries: 500,
    });
  }
  return globalCache;
}

/**
 * 💾 SIMPLE CACHE SET HELPER - SESSION #309 CONVENIENCE FUNCTION
 * 🎯 PURPOSE: Simple cache storage for common use cases
 * 🛡️ OPTIONAL: Can be used for performance optimization
 */
export function cacheSet<T>(key: string, data: T, ttl?: number): void {
  getGlobalCache().set(key, data, ttl);
}

/**
 * 🗄️ SIMPLE CACHE GET HELPER - SESSION #309 CONVENIENCE FUNCTION
 * 🎯 PURPOSE: Simple cache retrieval for common use cases
 * 🛡️ OPTIONAL: Can be used for performance optimization
 */
export function cacheGet<T>(key: string): T | null {
  return getGlobalCache().get<T>(key);
}

/**
 * 🔍 BUILD CACHE KEY HELPER - SESSION #309 UTILITY FUNCTION
 * 🎯 PURPOSE: Generate consistent cache keys for API requests
 * 🔧 STANDARDIZATION: Consistent key format for API caching
 */
export function buildCacheKey(
  ticker: string,
  timeframe: string,
  dateRange: string
): string {
  return `api_${ticker}_${timeframe}_${dateRange}`;
}

// ==================================================================================
// 🎯 SESSION #309 CACHE MANAGER CREATION COMPLETE
// ==================================================================================
// 📊 FUNCTIONALITY: Complete basic caching infrastructure for API response optimization
// 🛡️ ANTI-REGRESSION: Additive enhancement only - no impact on existing functionality
// 🔧 FOUNDATION: In-memory caching with TTL support suitable for Edge Function environment
// 📈 PERFORMANCE READY: Optional caching to reduce API calls and improve response times
// 🎖️ PRODUCTION SAFE: Can be used or ignored without affecting existing API behavior
// ⚡ MODULAR BENEFITS: Clean interfaces + optional usage + future enhancement ready
// 🚀 PATTERN COMPLIANT: Imports from shared types, standardized logging, follows Sessions #301-308 patterns
// 🔄 FUTURE READY: Session #309 cache foundation complete - ready for integration with API fetcher
// 🏆 OPTIONAL USAGE: Cache can be integrated for performance gains without breaking existing functionality
// 🎯 SESSION #309 ACHIEVEMENT: Cache infrastructure successfully pattern-compliant - provides optional performance enhancement with modular architecture benefits
// ==================================================================================
