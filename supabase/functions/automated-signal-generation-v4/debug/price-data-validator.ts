// ==================================================================================
// 🐛 PRICE DATA VALIDATOR - DEBUG UTILITY FOR RSI DISCREPANCY INVESTIGATION
// ==================================================================================
// 🎯 PURPOSE: Validate and analyze price data quality for RSI calculation debugging
// 🔧 SCOPE: Compare price data with external sources and detect anomalies
// 📊 FEATURES: Price validation, timestamp checks, data integrity analysis
// ==================================================================================

export interface PriceDataAnalysis {
  totalPrices: number;
  priceRange: { min: number; max: number };
  currentPrice: number;
  priceChanges: {
    totalChanges: number;
    positiveChanges: number;
    negativeChanges: number;
    noChanges: number;
    avgPositive: number;
    avgNegative: number;
  };
  dataQuality: {
    hasNulls: boolean;
    hasZeros: boolean;
    hasNegatives: boolean;
    hasDuplicates: boolean;
    suspiciousJumps: number;
  };
  timestamps?: Date[];
}

export class PriceDataValidator {
  /**
   * 🔍 COMPREHENSIVE PRICE DATA ANALYSIS
   * PURPOSE: Analyze price data for quality issues and anomalies
   */
  static analyzePriceData(
    prices: number[],
    timestamps?: string[] | number[],
    ticker?: string
  ): PriceDataAnalysis {
    console.log(`\n🔍 PRICE DATA ANALYSIS FOR ${ticker || "UNKNOWN"}`);
    console.log("=".repeat(60));

    if (!prices || prices.length === 0) {
      console.log("❌ No price data provided");
      return this.getEmptyAnalysis();
    }

    // Basic price statistics
    const validPrices = prices.filter((p) => p != null && !isNaN(p));
    const priceRange = {
      min: Math.min(...validPrices),
      max: Math.max(...validPrices),
    };

    console.log(`📊 Total prices: ${prices.length}`);
    console.log(`📊 Valid prices: ${validPrices.length}`);
    console.log(
      `📊 Price range: $${priceRange.min.toFixed(
        2
      )} - $${priceRange.max.toFixed(2)}`
    );
    console.log(`📊 Current price: $${prices[prices.length - 1]?.toFixed(2)}`);

    // Calculate price changes
    const changes = [];
    for (let i = 1; i < prices.length; i++) {
      if (prices[i] != null && prices[i - 1] != null) {
        changes.push(prices[i] - prices[i - 1]);
      }
    }

    const positiveChanges = changes.filter((c) => c > 0);
    const negativeChanges = changes.filter((c) => c < 0);
    const noChanges = changes.filter((c) => c === 0);

    const priceChanges = {
      totalChanges: changes.length,
      positiveChanges: positiveChanges.length,
      negativeChanges: negativeChanges.length,
      noChanges: noChanges.length,
      avgPositive:
        positiveChanges.length > 0
          ? positiveChanges.reduce((a, b) => a + b, 0) / positiveChanges.length
          : 0,
      avgNegative:
        negativeChanges.length > 0
          ? negativeChanges.reduce((a, b) => a + b, 0) / negativeChanges.length
          : 0,
    };

    console.log(
      `📈 Positive changes: ${
        priceChanges.positiveChanges
      } (avg: +$${priceChanges.avgPositive.toFixed(4)})`
    );
    console.log(
      `📉 Negative changes: ${
        priceChanges.negativeChanges
      } (avg: $${priceChanges.avgNegative.toFixed(4)})`
    );
    console.log(`➡️ No changes: ${priceChanges.noChanges}`);

    // Data quality checks
    const dataQuality = {
      hasNulls: prices.some((p) => p == null),
      hasZeros: prices.some((p) => p === 0),
      hasNegatives: prices.some((p) => p < 0),
      hasDuplicates: this.hasDuplicateSequences(prices),
      suspiciousJumps: this.countSuspiciousJumps(prices),
    };

    console.log("\n🔍 DATA QUALITY CHECKS:");
    console.log(`   Null values: ${dataQuality.hasNulls ? "❌" : "✅"}`);
    console.log(`   Zero values: ${dataQuality.hasZeros ? "⚠️" : "✅"}`);
    console.log(
      `   Negative values: ${dataQuality.hasNegatives ? "❌" : "✅"}`
    );
    console.log(
      `   Duplicate sequences: ${dataQuality.hasDuplicates ? "⚠️" : "✅"}`
    );
    console.log(
      `   Suspicious jumps: ${
        dataQuality.suspiciousJumps > 0
          ? "⚠️" + dataQuality.suspiciousJumps
          : "✅"
      }`
    );

    // Show sample prices
    console.log("\n📊 PRICE SAMPLES:");
    console.log(
      "   First 5:",
      prices
        .slice(0, 5)
        .map((p) => `$${p?.toFixed(2)}`)
        .join(", ")
    );
    console.log(
      "   Last 5:",
      prices
        .slice(-5)
        .map((p) => `$${p?.toFixed(2)}`)
        .join(", ")
    );

    // Timestamp analysis if provided
    let timestampData: Date[] | undefined;
    if (timestamps && timestamps.length > 0) {
      timestampData = this.analyzeTimestamps(timestamps, ticker);
    }

    return {
      totalPrices: prices.length,
      priceRange,
      currentPrice: prices[prices.length - 1] || 0,
      priceChanges,
      dataQuality,
      timestamps: timestampData,
    };
  }

  /**
   * 🕐 TIMESTAMP ANALYSIS
   * PURPOSE: Analyze timestamp data for market hour alignment and gaps
   */
  private static analyzeTimestamps(
    timestamps: string[] | number[],
    ticker?: string
  ): Date[] {
    console.log(`\n🕐 TIMESTAMP ANALYSIS FOR ${ticker || "UNKNOWN"}`);
    console.log("-".repeat(40));

    const dates = timestamps.map((ts) => {
      if (typeof ts === "string") {
        return new Date(ts);
      } else {
        return new Date(ts * 1000); // Assume Unix timestamp
      }
    });

    console.log(
      `📅 Date range: ${dates[0]?.toISOString()} to ${dates[
        dates.length - 1
      ]?.toISOString()}`
    );

    // Check for gaps
    const gaps = [];
    for (let i = 1; i < dates.length; i++) {
      const timeDiff = dates[i].getTime() - dates[i - 1].getTime();
      const hoursDiff = timeDiff / (1000 * 60 * 60);

      if (hoursDiff > 25) {
        // More than a day gap
        gaps.push({ index: i, hours: hoursDiff });
      }
    }

    console.log(`📊 Timestamp gaps > 25 hours: ${gaps.length}`);
    if (gaps.length > 0 && gaps.length <= 5) {
      gaps.forEach((gap) => {
        console.log(
          `   Gap at index ${gap.index}: ${gap.hours.toFixed(1)} hours`
        );
      });
    }

    return dates;
  }

  /**
   * 🔍 DETECT DUPLICATE SEQUENCES
   * PURPOSE: Find repeated price sequences that might indicate data errors
   */
  private static hasDuplicateSequences(prices: number[]): boolean {
    if (prices.length < 6) return false;

    // Check for sequences of 3+ identical prices
    let consecutiveCount = 1;
    for (let i = 1; i < prices.length; i++) {
      if (prices[i] === prices[i - 1]) {
        consecutiveCount++;
        if (consecutiveCount >= 3) return true;
      } else {
        consecutiveCount = 1;
      }
    }

    return false;
  }

  /**
   * ⚠️ COUNT SUSPICIOUS PRICE JUMPS
   * PURPOSE: Detect unusual price movements that might indicate data errors
   */
  private static countSuspiciousJumps(prices: number[]): number {
    if (prices.length < 2) return 0;

    let suspiciousCount = 0;
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;

    for (let i = 1; i < prices.length; i++) {
      if (prices[i] && prices[i - 1]) {
        const change = Math.abs(prices[i] - prices[i - 1]);
        const percentChange = change / prices[i - 1];

        // Flag changes > 10% in a single period as suspicious
        if (percentChange > 0.1) {
          suspiciousCount++;
        }
      }
    }

    return suspiciousCount;
  }

  /**
   * 📊 COMPARE WITH EXTERNAL REFERENCE
   * PURPOSE: Compare price data with known reference values
   */
  static compareWithReference(
    ourPrices: number[],
    referencePrices: number[],
    referenceSource: string = "External"
  ): void {
    console.log(`\n🔍 PRICE COMPARISON WITH ${referenceSource.toUpperCase()}`);
    console.log("=".repeat(50));

    if (!referencePrices || referencePrices.length === 0) {
      console.log("❌ No reference prices provided");
      return;
    }

    const minLength = Math.min(ourPrices.length, referencePrices.length);
    console.log(`📊 Comparing last ${minLength} prices`);

    // Compare recent prices
    const ourRecent = ourPrices.slice(-minLength);
    const refRecent = referencePrices.slice(-minLength);

    let totalDifference = 0;
    let maxDifference = 0;
    let matchingPrices = 0;

    for (let i = 0; i < minLength; i++) {
      const diff = Math.abs(ourRecent[i] - refRecent[i]);
      const percentDiff = (diff / refRecent[i]) * 100;

      totalDifference += diff;
      maxDifference = Math.max(maxDifference, diff);

      if (diff < 0.01) matchingPrices++; // Within 1 cent

      if (i < 5 || i >= minLength - 5) {
        // Show first and last 5
        console.log(
          `   ${i + 1}: Ours=$${ourRecent[i].toFixed(2)}, Ref=$${refRecent[
            i
          ].toFixed(2)}, Diff=$${diff.toFixed(2)} (${percentDiff.toFixed(2)}%)`
        );
      }
    }

    const avgDifference = totalDifference / minLength;
    const matchPercent = (matchingPrices / minLength) * 100;

    console.log(`📊 Average difference: $${avgDifference.toFixed(4)}`);
    console.log(`📊 Maximum difference: $${maxDifference.toFixed(4)}`);
    console.log(
      `📊 Matching prices (±$0.01): ${matchingPrices}/${minLength} (${matchPercent.toFixed(
        1
      )}%)`
    );
  }

  private static getEmptyAnalysis(): PriceDataAnalysis {
    return {
      totalPrices: 0,
      priceRange: { min: 0, max: 0 },
      currentPrice: 0,
      priceChanges: {
        totalChanges: 0,
        positiveChanges: 0,
        negativeChanges: 0,
        noChanges: 0,
        avgPositive: 0,
        avgNegative: 0,
      },
      dataQuality: {
        hasNulls: false,
        hasZeros: false,
        hasNegatives: false,
        hasDuplicates: false,
        suspiciousJumps: 0,
      },
    };
  }
}

/**
 * 🎯 QUICK PRICE DEBUG FUNCTION
 * PURPOSE: One-line function to debug price data in RSI calculator
 */
export function debugPriceData(
  prices: number[],
  ticker?: string,
  timeframe?: string
): void {
  console.log(
    `\n🐛 QUICK PRICE DEBUG: ${ticker || "UNKNOWN"} ${timeframe || ""}`
  );
  PriceDataValidator.analyzePriceData(prices, undefined, ticker);
}
