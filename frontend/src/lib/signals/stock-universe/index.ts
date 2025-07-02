// ===================================================================
// STOCK UNIVERSE MANAGEMENT SYSTEM
// ===================================================================
// File: src/lib/signals/stock-universe/index.ts
// Purpose: Main interface for tiered stock universe selection
// Author: Kurzora Trading Platform
// Version: 1.0 - Modular Architecture for 6,000+ Stock Scalability

// ===================================================================
// TYPES & INTERFACES
// ===================================================================

export interface StockInfo {
  ticker: string;
  companyName: string;
  sector: string;
  industry: string;
  marketCap: number;
  avgVolume: number;
  exchange: string;
  isActive: boolean;
  isIslamicCompliant?: boolean;
}

export type SubscriptionTier = "starter" | "professional" | "elite";

export interface UniverseStats {
  totalStocks: number;
  sectors: string[];
  exchanges: string[];
  islamicCompliantCount: number;
  averageMarketCap: number;
  tier: SubscriptionTier;
}

// ===================================================================
// STOCK UNIVERSE IMPORTS
// ===================================================================

// ✅ ACTIVE IMPORTS
import { SP500_STOCKS, SP500_STATS } from "./sp500";

// 🔄 FUTURE EXPANSION IMPORTS (will be added as we create each stock file)
// import { SP400_STOCKS } from './sp400';
// import { SP600_STOCKS } from './sp600';
// import { NASDAQ_LARGE_STOCKS } from './nasdaq-large';
// import { NYSE_ADDITIONAL_STOCKS } from './nyse-additional';
// import { RUSSELL_ADDITIONS_STOCKS } from './russell-additions';

// ===================================================================
// MAIN UNIVERSE SELECTION FUNCTION
// ===================================================================

/**
 * Get stock universe based on subscription tier
 * @param tier - Subscription tier: starter, professional, or elite
 * @param options - Additional filtering options
 * @returns Array of StockInfo objects for the specified tier
 */
export function getStockUniverse(
  tier: SubscriptionTier = "starter",
  options?: {
    islamicCompliantOnly?: boolean;
    minMarketCap?: number;
    minVolume?: number;
    sectors?: string[];
  }
): StockInfo[] {
  let universe: StockInfo[] = [];

  // ===================================================================
  // TIER-BASED UNIVERSE SELECTION
  // ===================================================================

  switch (tier) {
    case "starter":
      // S&P 500 - Premium large-cap stocks (~500 stocks)
      universe = SP500_STOCKS;
      console.log(
        `📊 Loading Starter Universe: S&P 500 (${SP500_STOCKS.length} stocks)`
      );
      break;

    case "professional":
      // S&P 1500 - Large + Mid Cap stocks (~1,500 stocks)
      // Currently only S&P 500 available - will expand with SP400 + SP600
      universe = SP500_STOCKS; // Future: [...SP500_STOCKS, ...SP400_STOCKS, ...SP600_STOCKS]
      console.log(
        `📊 Loading Professional Universe: S&P 500 (${SP500_STOCKS.length} stocks) - Mid/Small cap expansion coming soon`
      );
      break;

    case "elite":
      // Full US Market - All tradeable stocks (~6,000+ stocks)
      // Currently only S&P 500 available - will expand with full market coverage
      universe = SP500_STOCKS; // Future: [...SP500_STOCKS, ...SP400_STOCKS, ...SP600_STOCKS, ...NASDAQ_LARGE_STOCKS, ...NYSE_ADDITIONAL_STOCKS, ...RUSSELL_ADDITIONS_STOCKS]
      console.log(
        `📊 Loading Elite Universe: S&P 500 (${SP500_STOCKS.length} stocks) - Full market expansion coming soon`
      );
      break;

    default:
      console.warn(`⚠️ Unknown tier: ${tier}, defaulting to starter`);
      universe = SP500_STOCKS;
  }

  // ===================================================================
  // OPTIONAL FILTERING
  // ===================================================================

  if (options) {
    if (options.islamicCompliantOnly) {
      universe = universe.filter((stock) => stock.isIslamicCompliant === true);
      console.log(
        `🕌 Islamic Compliant Filter: ${universe.length} stocks remaining`
      );
    }

    if (options.minMarketCap) {
      universe = universe.filter(
        (stock) => stock.marketCap >= options.minMarketCap!
      );
      console.log(
        `💰 Market Cap Filter (>${options.minMarketCap}): ${universe.length} stocks remaining`
      );
    }

    if (options.minVolume) {
      universe = universe.filter(
        (stock) => stock.avgVolume >= options.minVolume!
      );
      console.log(
        `📈 Volume Filter (>${options.minVolume}): ${universe.length} stocks remaining`
      );
    }

    if (options.sectors && options.sectors.length > 0) {
      universe = universe.filter((stock) =>
        options.sectors!.includes(stock.sector)
      );
      console.log(
        `🏭 Sector Filter (${options.sectors.join(", ")}): ${
          universe.length
        } stocks remaining`
      );
    }
  }

  console.log(
    `✅ Final Universe: ${universe.length} stocks loaded for ${tier} tier`
  );
  return universe;
}

// ===================================================================
// UNIVERSE STATISTICS
// ===================================================================

/**
 * Get statistics about a stock universe
 * @param tier - Subscription tier
 * @param options - Filtering options
 * @returns UniverseStats object with detailed information
 */
export function getUniverseStats(
  tier: SubscriptionTier = "starter",
  options?: {
    islamicCompliantOnly?: boolean;
    minMarketCap?: number;
    minVolume?: number;
    sectors?: string[];
  }
): UniverseStats {
  const universe = getStockUniverse(tier, options);

  const sectors = [...new Set(universe.map((stock) => stock.sector))];
  const exchanges = [...new Set(universe.map((stock) => stock.exchange))];
  const islamicCompliantCount = universe.filter(
    (stock) => stock.isIslamicCompliant === true
  ).length;
  const averageMarketCap =
    universe.reduce((sum, stock) => sum + stock.marketCap, 0) / universe.length;

  return {
    totalStocks: universe.length,
    sectors,
    exchanges,
    islamicCompliantCount,
    averageMarketCap,
    tier,
  };
}

// ===================================================================
// CONVENIENCE EXPORTS
// ===================================================================

/**
 * Get all available sectors across all tiers
 */
export function getAllSectors(): string[] {
  const allStocks = getStockUniverse("elite");
  return [...new Set(allStocks.map((stock) => stock.sector))].sort();
}

/**
 * Get stocks by specific sector
 */
export function getStocksBySector(
  sector: string,
  tier: SubscriptionTier = "starter"
): StockInfo[] {
  return getStockUniverse(tier).filter((stock) => stock.sector === sector);
}

/**
 * Search stocks by ticker or company name
 */
export function searchStocks(
  query: string,
  tier: SubscriptionTier = "starter"
): StockInfo[] {
  const universe = getStockUniverse(tier);
  const searchTerm = query.toLowerCase();

  return universe.filter(
    (stock) =>
      stock.ticker.toLowerCase().includes(searchTerm) ||
      stock.companyName.toLowerCase().includes(searchTerm)
  );
}

// ===================================================================
// DEFAULT EXPORT
// ===================================================================

export default {
  getStockUniverse,
  getUniverseStats,
  getAllSectors,
  getStocksBySector,
  searchStocks,
};

// ===================================================================
// INITIALIZATION LOG
// ===================================================================

console.log(`🚀 Stock Universe System Initialized`);
console.log(`📊 S&P 500 Universe: ${SP500_STATS.totalStocks} stocks loaded`);
console.log(
  `🏭 Sectors: ${Object.keys(SP500_STATS.sectorBreakdown).length} GICS sectors`
);
console.log(
  `🕌 Islamic Compliant: ${SP500_STATS.islamicCompliantCount} stocks`
);
console.log(
  `💰 Average Market Cap: ${(SP500_STATS.averageMarketCap / 1000000000).toFixed(
    1
  )}B`
);
console.log(`✅ System ready for tiered universe selection`);

// ===================================================================
// DEVELOPMENT NOTES
// ===================================================================

/*
🚀 EXPANSION ROADMAP:

Session #99 (Current Status):
✅ Create index.ts (this file) 
✅ Create sp500.ts with 503 S&P 500 stocks
✅ Update index.ts to import real S&P 500 data
🔄 Update stock-scanner.ts to use new imports
🔄 Test with SignalsTest.tsx

Future Sessions:
📋 Create sp400.ts → +400 Mid Cap stocks  
📋 Create sp600.ts → +600 Small Cap stocks
📋 Create nasdaq-large.ts → +1,000 NASDAQ stocks
📋 Create nyse-additional.ts → +1,000 NYSE stocks  
📋 Create russell-additions.ts → +2,000 Russell 2000 stocks
📋 Add international.ts → Global expansion

💡 CURRENT BENEFITS:
✅ No token limits (each file manageable)
✅ Real S&P 500 data (503 stocks)
✅ Selective loading by tier  
✅ Islamic compliance tagging
✅ Easy maintenance per market segment
✅ Performance optimization
✅ Clean separation of concerns
✅ Unlimited scalability foundation

🎯 CURRENT STATUS: S&P 500 Foundation Complete
🎯 NEXT TARGET: Complete US Market Coverage (6,000+ stocks)
*/
