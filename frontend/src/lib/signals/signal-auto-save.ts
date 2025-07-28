// ===================================================================
// SIGNAL AUTO-SAVE SERVICE - DATABASE INTEGRATION WITH REAL PRICES
// ===================================================================
// File: src/lib/signals/signal-auto-save.ts
// Purpose: Automatically save high-quality trading signals to database with real price data
// Integration: Connects signal generation → database storage → dashboard display
// 🔧 SESSION #325: Phase 2 Migration - Removed deprecated column writes to support indicators table

import { createClient } from "@supabase/supabase-js";
import { ProcessedSignal, SignalStrength } from "./signal-processor";

// ===================================================================
// INTERFACES & TYPES
// ===================================================================

// 🔧 SESSION #325: Updated interface - removed deprecated columns (rsi_value, macd_signal, etc.)
// Frontend now reads from Session #321 indicators table instead of these columns
interface DatabaseSignal {
  ticker: string;
  signal_type: "bullish" | "bearish" | "neutral";
  confidence_score: number;
  final_score: number;
  entry_price: number;
  current_price: number;
  price_change_percent: number;
  sector: string;
  market: string;
  signal_strength: string;
  explanation: string;
  timeframe: string;
  created_at?: string;
}

interface AutoSaveResult {
  success: boolean;
  signalsSaved: number;
  signalsFiltered: number;
  errors: string[];
  savedSignals: DatabaseSignal[];
  processingTime: number;
}

interface AutoSaveConfig {
  minScore: number;
  batchSize: number;
  enableLogging: boolean;
  filterDuplicates: boolean;
  maxSignalsPerBatch: number;
}

// 🚀 NEW: Price data interface
interface PriceData {
  currentPrice: number;
  changePercent: number;
  volume: number;
  timestamp: string;
}

// ===================================================================
// SIGNAL AUTO-SAVE SERVICE
// ===================================================================

export class SignalAutoSaveService {
  private supabase;
  private config: AutoSaveConfig;

  constructor(config?: Partial<AutoSaveConfig>) {
    // Initialize Supabase client
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error(
        "Supabase credentials not configured. Please check .env.local file."
      );
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);

    // Default configuration
    this.config = {
      minScore: 70, // Only save signals with score ≥ 70
      batchSize: 25, // Process 25 signals at a time
      enableLogging: true,
      filterDuplicates: true,
      maxSignalsPerBatch: 100,
      ...config,
    };

    if (this.config.enableLogging) {
      console.log("🔄 Signal Auto-Save Service initialized");
      console.log(`   Min Score Threshold: ${this.config.minScore}`);
      console.log(`   Batch Size: ${this.config.batchSize}`);
      console.log(`   Duplicate Filtering: ${this.config.filterDuplicates}`);
    }
  }

  // ===================================================================
  // MAIN AUTO-SAVE FUNCTIONS
  // ===================================================================

  /**
   * Auto-save signals without price data (original method)
   */
  public async autoSaveSignals(
    signals: ProcessedSignal[],
    stockInfo: Record<
      string,
      { companyName: string; sector: string; exchange: string }
    >
  ): Promise<AutoSaveResult> {
    return this.autoSaveSignalsWithPrices(signals, stockInfo, {});
  }

  /**
   * Auto-save signals with real price data from Polygon.io
   */
  public async autoSaveSignalsWithPrices(
    signals: ProcessedSignal[],
    stockInfo: Record<
      string,
      { companyName: string; sector: string; exchange: string }
    >,
    priceData: Record<string, PriceData> = {}
  ): Promise<AutoSaveResult> {
    const startTime = Date.now();

    if (this.config.enableLogging) {
      console.log(`🔄 Starting auto-save for ${signals.length} signals...`);
      if (Object.keys(priceData).length > 0) {
        console.log(
          `💰 Real prices available for ${Object.keys(priceData).length} stocks`
        );
      }
    }

    try {
      // Step 1: Filter high-quality signals
      const filteredSignals = this.filterQualitySignals(signals);

      if (this.config.enableLogging) {
        console.log(
          `✅ Quality Filter: ${filteredSignals.length}/${signals.length} signals passed (≥${this.config.minScore} score)`
        );
      }

      if (filteredSignals.length === 0) {
        return {
          success: true,
          signalsSaved: 0,
          signalsFiltered: signals.length,
          errors: [],
          savedSignals: [],
          processingTime: Date.now() - startTime,
        };
      }

      // Step 2: Convert to database format with price data
      const databaseSignals = await this.convertToDbFormat(
        filteredSignals,
        stockInfo,
        priceData
      );

      // Step 3: Remove duplicates if enabled
      const uniqueSignals = this.config.filterDuplicates
        ? await this.filterDuplicates(databaseSignals)
        : databaseSignals;

      if (this.config.enableLogging && this.config.filterDuplicates) {
        const duplicatesRemoved = databaseSignals.length - uniqueSignals.length;
        if (duplicatesRemoved > 0) {
          console.log(
            `🔄 Duplicate Filter: Removed ${duplicatesRemoved} duplicate signals`
          );
        }
      }

      // Step 4: Batch save to database
      const saveResult = await this.batchSaveToDatabase(uniqueSignals);

      const processingTime = Date.now() - startTime;

      if (this.config.enableLogging) {
        const priceInfo =
          Object.keys(priceData).length > 0 ? " with real prices" : "";
        console.log(
          `🎉 Auto-save complete: ${saveResult.signalsSaved} signals saved${priceInfo} in ${processingTime}ms`
        );
        if (saveResult.errors.length > 0) {
          console.warn(
            `⚠️ Encountered ${saveResult.errors.length} errors during save`
          );
        }
      }

      return {
        success: saveResult.signalsSaved > 0 || uniqueSignals.length === 0,
        signalsSaved: saveResult.signalsSaved,
        signalsFiltered: signals.length - filteredSignals.length,
        errors: saveResult.errors,
        savedSignals: saveResult.savedSignals,
        processingTime,
      };
    } catch (error) {
      console.error("❌ Auto-save service error:", error);
      return {
        success: false,
        signalsSaved: 0,
        signalsFiltered: 0,
        errors: [`Auto-save failed: ${error.message}`],
        savedSignals: [],
        processingTime: Date.now() - startTime,
      };
    }
  }

  // ===================================================================
  // SIGNAL FILTERING
  // ===================================================================

  private filterQualitySignals(signals: ProcessedSignal[]): ProcessedSignal[] {
    return signals.filter((signal) => {
      // Primary filter: score threshold
      if (signal.finalScore < this.config.minScore) {
        return false;
      }

      // Additional quality checks
      if (!signal.ticker || signal.ticker.length === 0) {
        return false;
      }

      if (!signal.signalType || signal.signalType === "neutral") {
        return false;
      }

      if (!signal.signalStrength) {
        return false;
      }

      return true;
    });
  }

  private async filterDuplicates(
    signals: DatabaseSignal[]
  ): Promise<DatabaseSignal[]> {
    try {
      // Get existing signals from last 24 hours to check for duplicates
      const { data: existingSignals, error } = await this.supabase
        .from("trading_signals")
        .select("ticker, signal_type, created_at")
        .gte(
          "created_at",
          new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        );

      if (error) {
        console.warn("⚠️ Could not check for duplicates:", error.message);
        return signals; // Return all signals if duplicate check fails
      }

      if (!existingSignals || existingSignals.length === 0) {
        return signals; // No existing signals, all are unique
      }

      // Create a set of existing signal keys
      const existingKeys = new Set(
        existingSignals.map((s) => `${s.ticker}-${s.signal_type}`)
      );

      // Filter out duplicates
      const uniqueSignals = signals.filter((signal) => {
        const key = `${signal.ticker}-${signal.signal_type}`;
        return !existingKeys.has(key);
      });

      return uniqueSignals;
    } catch (error) {
      console.warn("⚠️ Duplicate filtering error:", error.message);
      return signals; // Return all signals if filtering fails
    }
  }

  // ===================================================================
  // DATABASE OPERATIONS
  // ===================================================================

  private async convertToDbFormat(
    signals: ProcessedSignal[],
    stockInfo: Record<
      string,
      { companyName: string; sector: string; exchange: string }
    >,
    priceData: Record<string, PriceData> = {}
  ): Promise<DatabaseSignal[]> {
    return signals.map((signal) => {
      const stock = stockInfo[signal.ticker];
      const prices = priceData[signal.ticker]; // Get real price data if available

      // 🚀 FIXED: Use real prices if available, otherwise use existing fallback logic
      let currentPrice = signal.currentPrice || signal.entryPrice || 0;
      let priceChangePercent = signal.priceChangePercent || 0;

      // Override with real prices if available
      if (prices && prices.currentPrice) {
        currentPrice = prices.currentPrice;
        priceChangePercent = prices.changePercent || 0;

        if (this.config.enableLogging) {
          console.log(
            `💰 ${signal.ticker}: Real price $${prices.currentPrice.toFixed(
              2
            )} (${
              prices.changePercent >= 0 ? "+" : ""
            }${prices.changePercent.toFixed(2)}%)`
          );
        }
      }

      // 🔧 SESSION #325: Removed deprecated column assignments (rsi_value, macd_signal, etc.)
      // These indicators are now stored in Session #321 indicators table instead
      return {
        ticker: signal.ticker,
        signal_type: signal.signalType,
        confidence_score: Math.round(
          signal.confidenceScore || signal.finalScore
        ),
        final_score: signal.finalScore,
        entry_price: this.roundToDecimals(signal.entryPrice || currentPrice, 4),

        // 🚀 FIXED: Use real prices instead of always falling back to 0
        current_price: this.roundToDecimals(currentPrice, 4),
        price_change_percent: this.roundToDecimals(priceChangePercent, 4),

        sector: stock?.sector || "Unknown",
        market: this.determineMarket(signal.ticker, stock?.exchange),
        signal_strength: signal.signalStrength || SignalStrength.NEUTRAL,
        explanation:
          signal.explanation || this.generateDefaultExplanation(signal),
        timeframe: signal.primaryTimeframe || "1D",
      };
    });
  }

  private async batchSaveToDatabase(signals: DatabaseSignal[]): Promise<{
    signalsSaved: number;
    errors: string[];
    savedSignals: DatabaseSignal[];
  }> {
    const errors: string[] = [];
    const savedSignals: DatabaseSignal[] = [];
    let totalSaved = 0;

    // Process in batches to avoid overwhelming the database
    const batches = this.chunkArray(signals, this.config.batchSize);

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];

      if (this.config.enableLogging) {
        console.log(
          `🔄 Saving batch ${i + 1}/${batches.length} (${
            batch.length
          } signals)...`
        );
      }

      try {
        const { data, error } = await this.supabase
          .from("trading_signals")
          .insert(batch)
          .select();

        if (error) {
          console.error(`❌ Batch ${i + 1} save error:`, error);
          errors.push(`Batch ${i + 1}: ${error.message}`);
          continue;
        }

        if (data) {
          totalSaved += data.length;
          savedSignals.push(...batch);

          if (this.config.enableLogging) {
            console.log(
              `✅ Batch ${i + 1}: ${data.length} signals saved successfully`
            );
          }
        }

        // Small delay between batches to be gentle on the database
        if (i < batches.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      } catch (error) {
        console.error(`❌ Batch ${i + 1} unexpected error:`, error);
        errors.push(`Batch ${i + 1}: ${error.message}`);
      }
    }

    return {
      signalsSaved: totalSaved,
      errors,
      savedSignals,
    };
  }

  // ===================================================================
  // UTILITY FUNCTIONS
  // ===================================================================

  private chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }

  private roundToDecimals(value: number, decimals: number): number {
    return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
  }

  private determineMarket(ticker: string, exchange?: string): string {
    if (exchange) {
      return exchange === "NASDAQ"
        ? "NASDAQ"
        : exchange === "NYSE"
        ? "NYSE"
        : "US";
    }

    // Default logic based on ticker characteristics
    if (ticker.includes(".")) {
      return "International";
    }

    return "US";
  }

  private generateDefaultExplanation(signal: ProcessedSignal): string {
    const strength = signal.signalStrength?.toLowerCase() || "moderate";
    const type = signal.signalType === "bullish" ? "upward" : "downward";
    const score = signal.finalScore;

    return `${strength} ${type} signal detected with ${score}% confidence. Technical indicators suggest favorable conditions for this trading opportunity.`;
  }

  // ===================================================================
  // PUBLIC UTILITY METHODS
  // ===================================================================

  public async testConnection(): Promise<boolean> {
    try {
      const { data, error } = await this.supabase
        .from("trading_signals")
        .select("count", { count: "exact", head: true });

      if (error) {
        console.error("❌ Database connection test failed:", error);
        return false;
      }

      if (this.config.enableLogging) {
        console.log("✅ Database connection test successful");
      }
      return true;
    } catch (error) {
      console.error("❌ Database connection error:", error);
      return false;
    }
  }

  public async clearOldSignals(hoursOld: number = 24): Promise<number> {
    try {
      const cutoffTime = new Date(
        Date.now() - hoursOld * 60 * 60 * 1000
      ).toISOString();

      const { data, error } = await this.supabase
        .from("trading_signals")
        .delete()
        .lt("created_at", cutoffTime)
        .select();

      if (error) {
        console.error("❌ Error clearing old signals:", error);
        return 0;
      }

      const deletedCount = data ? data.length : 0;

      if (this.config.enableLogging && deletedCount > 0) {
        console.log(
          `🧹 Cleared ${deletedCount} signals older than ${hoursOld} hours`
        );
      }

      return deletedCount;
    } catch (error) {
      console.error("❌ Unexpected error clearing old signals:", error);
      return 0;
    }
  }

  public getConfig(): AutoSaveConfig {
    return { ...this.config };
  }

  public updateConfig(newConfig: Partial<AutoSaveConfig>): void {
    this.config = { ...this.config, ...newConfig };

    if (this.config.enableLogging) {
      console.log("🔄 Auto-save configuration updated:", newConfig);
    }
  }
}

// ===================================================================
// DEFAULT EXPORT
// ===================================================================

export default SignalAutoSaveService;