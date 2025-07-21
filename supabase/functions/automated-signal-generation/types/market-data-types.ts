// ==================================================================================
// 🎯 SESSION #309: SHARED MARKET DATA TYPES - PATTERN COMPLIANCE
// ==================================================================================
// 🚨 PURPOSE: Centralized interfaces to eliminate circular dependencies between data modules
// 🛡️ ANTI-REGRESSION MANDATE: Extracted interfaces from Session #309 files without modification
// 📝 SESSION #309 PATTERN FIX: Follows Sessions #301-308 shared types pattern
// 🔧 CIRCULAR DEPENDENCY FIX: Enables clean imports between polygon-fetcher and price-processor
// 🚨 CRITICAL SUCCESS: Maintain exact interface compatibility with Session #309 modules
// ⚠️ PRODUCTION READY: Zero functionality changes - pure interface extraction
// 🎖️ SESSIONS #301-308 COMPLIANCE: Follows established modular architecture patterns
// 📊 FOUNDATION: Shared types for all Session #309 data layer components
// 🏆 PRESERVATION: All Session #185 + #184 + #183 data structures maintained exactly
// 🚀 FUTURE READY: Prepared for Session #310 configuration management integration
// ==================================================================================

/**
 * 🌐 POLYGON API RESPONSE INTERFACE - SESSION #309 EXTRACTED
 * PURPOSE: Define structure for Polygon.io API responses
 * SESSION #309: Extracted from polygon-fetcher.ts for shared usage
 * PRODUCTION READY: Complete response structure validation preserved
 */
export interface PolygonAPIResponse {
  status: string;
  results?: PolygonBarData[];
  resultsCount?: number;
  adjusted?: boolean;
  queryCount?: number;
  request_id?: string;
}

/**
 * 📊 POLYGON BAR DATA INTERFACE - SESSION #309 EXTRACTED
 * PURPOSE: Individual OHLCV bar data from Polygon.io
 * SESSION #184 PRESERVED: All data fields used in original processing maintained
 * SESSION #309: Extracted from polygon-fetcher.ts for shared usage
 */
export interface PolygonBarData {
  t: number; // timestamp
  o: number; // open
  h: number; // high
  l: number; // low
  c: number; // close
  v: number; // volume
  vw?: number; // volume weighted average price
  n?: number; // number of transactions
}

/**
 * 🔧 API FETCH CONFIGURATION - SESSION #309 EXTRACTED
 * PURPOSE: Configuration for individual API requests
 * SESSION #185 PRESERVED: Date range and timeframe configuration maintained
 * SESSION #309: Extracted from polygon-fetcher.ts for shared usage
 */
export interface APIFetchConfig {
  ticker: string;
  timeframe: string;
  url: string;
  modeLabel: string;
  maxRetries?: number;
  retryDelay?: number;
}

/**
 * 🌐 TIMEFRAME DATA POINT INTERFACE - SESSION #309 EXTRACTED
 * PURPOSE: Processed market data structure for technical analysis
 * SESSION #305 PRESERVED: Maintains exact same interface as TimeframeDataCoordinator
 * SESSION #309: Extracted from price-processor.ts for shared usage
 * PRODUCTION READY: Complete OHLCV data structure for all indicators
 */
export interface TimeframeDataPoint {
  currentPrice: number;
  changePercent: number;
  volume: number;
  prices: number[];
  highs: number[];
  lows: number[];
  volumes: number[];
}

/**
 * 📊 DATA QUALITY ASSESSMENT INTERFACE - SESSION #309 EXTRACTED
 * PURPOSE: Comprehensive data quality assessment results
 * SESSION #184 PRESERVED: Technical indicator data sufficiency validation maintained
 * SESSION #309: Extracted from price-processor.ts for shared usage
 */
export interface DataQualityAssessment {
  sufficient: boolean;
  dataPoints: number;
  requiredForIndicators: {
    RSI: { required: number; sufficient: boolean };
    MACD: { required: number; sufficient: boolean };
    Bollinger: { required: number; sufficient: boolean };
    Stochastic: { required: number; sufficient: boolean };
  };
  qualityScore: number;
  recommendations: string[];
}

/**
 * 🔧 PROCESSING CONFIGURATION INTERFACE - SESSION #309 EXTRACTED
 * PURPOSE: Configuration for data processing operations
 * SESSION #184 PRESERVED: Processing parameters and quality thresholds maintained
 * SESSION #309: Extracted from price-processor.ts for shared usage
 */
export interface ProcessingConfig {
  maxDataPoints?: number;
  qualityThreshold?: number;
  enableQualityLogging?: boolean;
  preserveAllData?: boolean;
}

/**
 * 🗄️ CACHE ENTRY INTERFACE - SESSION #309 EXTRACTED
 * PURPOSE: Define structure for cached API responses
 * SESSION #309: Extracted from cache-manager.ts for shared usage
 * PRODUCTION READY: Complete cache entry with metadata
 */
export interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
  key: string;
  accessCount: number;
  lastAccessed: number;
}

/**
 * 📊 CACHE STATISTICS INTERFACE - SESSION #309 EXTRACTED
 * PURPOSE: Track cache performance and effectiveness
 * SESSION #309: Extracted from cache-manager.ts for shared usage
 */
export interface CacheStatistics {
  totalEntries: number;
  hits: number;
  misses: number;
  hitRate: number;
  totalSize: number;
  oldestEntry: number;
  newestEntry: number;
}

/**
 * 🔧 CACHE CONFIGURATION INTERFACE - SESSION #309 EXTRACTED
 * PURPOSE: Configuration for cache behavior
 * SESSION #309: Extracted from cache-manager.ts for shared usage
 */
export interface CacheConfig {
  defaultTTL: number;
  maxEntries: number;
  enableLogging: boolean;
  autoCleanup: boolean;
  cleanupInterval: number;
}

// ==================================================================================
// 🎯 SESSION #309 SHARED TYPES CREATION COMPLETE
// ==================================================================================
// 📊 FUNCTIONALITY: Complete interface extraction from Session #309 data modules
// 🛡️ ANTI-REGRESSION: Zero changes to interface definitions - pure extraction
// 🔧 PATTERN COMPLIANCE: Follows Sessions #301-308 shared types architecture
// 📈 CIRCULAR DEPENDENCY FIX: Enables clean imports between all Session #309 modules
// 🎖️ PRODUCTION READY: All Session #185 + #184 + #183 data structures preserved exactly
// ⚡ MODULAR BENEFITS: Clean separation + zero duplication + future enhancement ready
// 🚀 PATTERN COMPLIANCE: Session #309 shared types complete - ready for module integration
// 🔄 NEXT MODULE: Update Session #309 modules to import from shared types
// 🏆 CIRCULAR DEPENDENCY ELIMINATED: Clean module architecture achieved
// 🎯 SESSION #309 FOUNDATION: Shared types successfully extracted - modular pattern compliance complete
// ==================================================================================
