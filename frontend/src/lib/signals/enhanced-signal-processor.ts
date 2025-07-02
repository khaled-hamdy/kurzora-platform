// ===================================================================
// ENHANCED SIGNAL PROCESSOR WITH AUTO-SAVE INTEGRATION + REAL PRICES - FIXED
// ===================================================================
// File: src/lib/signals/enhanced-signal-processor.ts
// Purpose: Signal processing with automatic database storage + real market prices + UI price display
// Integration: Extends existing signal processor with auto-save functionality + price fetching + price merging for UI

import { SignalProcessor, ProcessedSignal } from "./signal-processor";
import { StockScanner, StockInfo } from "./stock-scanner";
import { SignalAutoSaveService } from "./signal-auto-save";
import { MultiTimeframeData } from "./technical-indicators";

// ===================================================================
// INTERFACES & TYPES
// ===================================================================

interface EnhancedProcessingResult {
  signals: ProcessedSignal[];
  autoSaveResult: {
    success: boolean;
    signalsSaved: number;
    signalsFiltered: number;
    errors: string[];
    processingTime: number;
  };
  processingStats: {
    totalStocks: number;
    validDatasets: number;
    signalsGenerated: number;
    qualitySignals: number;
    databaseSaves: number;
    totalTime: number;
    apiCallsMade: number;
    pricesUpdated: number;
  };
}

interface EnhancedProcessingConfig {
  enableAutoSave: boolean;
  minScoreForSave: number;
  batchSize: number;
  enableDetailedLogging: boolean;
  clearOldSignals: boolean;
  oldSignalsCutoffHours: number;
  fetchRealPrices: boolean; // 🚀 NEW: Enable real price fetching
}

// 🚀 NEW: Price data interface
interface PriceData {
  currentPrice: number;
  changePercent: number;
  volume: number;
  timestamp: string;
}

// ===================================================================
// ENHANCED SIGNAL PROCESSOR CLASS
// ===================================================================

export class EnhancedSignalProcessor {
  private signalProcessor: SignalProcessor;
  private autoSaveService: SignalAutoSaveService;
  private config: EnhancedProcessingConfig;

  constructor(config?: Partial<EnhancedProcessingConfig>) {
    this.signalProcessor = new SignalProcessor();

    // Default configuration
    this.config = {
      enableAutoSave: true,
      minScoreForSave: 70,
      batchSize: 25,
      enableDetailedLogging: true,
      clearOldSignals: true,
      oldSignalsCutoffHours: 0.1, // 🔧 OPTIMIZED: 6 minutes for testing/development workflow
      fetchRealPrices: true, // 🚀 NEW: Enable real price fetching by default
      ...config,
    };

    // Initialize auto-save service
    this.autoSaveService = new SignalAutoSaveService({
      minScore: this.config.minScoreForSave,
      batchSize: this.config.batchSize,
      enableLogging: this.config.enableDetailedLogging,
      filterDuplicates: true,
      maxSignalsPerBatch: 100,
    });

    if (this.config.enableDetailedLogging) {
      console.log("🚀 Enhanced Signal Processor initialized");
      console.log(
        `   Auto-Save: ${this.config.enableAutoSave ? "Enabled" : "Disabled"}`
      );
      console.log(`   Min Score for DB: ${this.config.minScoreForSave}`);
      console.log(`   Batch Size: ${this.config.batchSize}`);
      console.log(
        `   Real Prices: ${
          this.config.fetchRealPrices ? "Enabled" : "Disabled"
        }`
      );
      console.log(
        `   Clear Old Signals: ${
          this.config.clearOldSignals ? "Enabled" : "Disabled"
        } (${this.config.oldSignalsCutoffHours}h = ${Math.round(
          this.config.oldSignalsCutoffHours * 60
        )} minutes)`
      );
    }
  }

  // ===================================================================
  // 🚀 NEW: PRICE FETCHING METHODS
  // ===================================================================

  /**
   * Fetch current market price for a single stock
   */
  private async fetchStockPrice(ticker: string): Promise<PriceData | null> {
    try {
      const apiKey = import.meta.env.VITE_POLYGON_API_KEY;
      if (!apiKey) {
        console.warn("⚠️ Polygon.io API key not found - using fallback prices");
        return null;
      }

      // Get current quote from Polygon.io
      const quoteUrl = `https://api.polygon.io/v2/last/trade/${ticker}?apikey=${apiKey}`;
      const quoteResponse = await fetch(quoteUrl);

      if (!quoteResponse.ok) {
        if (this.config.enableDetailedLogging) {
          console.warn(`⚠️ ${ticker}: Failed to fetch current price`);
        }
        return null;
      }

      const quoteData = await quoteResponse.json();

      if (!quoteData.results || !quoteData.results.p) {
        if (this.config.enableDetailedLogging) {
          console.warn(`⚠️ ${ticker}: No price data in response`);
        }
        return null;
      }

      const currentPrice = quoteData.results.p;

      // Get previous close for change calculation
      const prevCloseUrl = `https://api.polygon.io/v2/aggs/ticker/${ticker}/prev?adjusted=true&apikey=${apiKey}`;
      const prevResponse = await fetch(prevCloseUrl);

      let changePercent = 0;

      if (prevResponse.ok) {
        const prevData = await prevResponse.json();
        if (prevData.results && prevData.results.length > 0) {
          const prevClose = prevData.results[0].c;
          changePercent = ((currentPrice - prevClose) / prevClose) * 100;
        }
      }

      const priceData: PriceData = {
        currentPrice,
        changePercent,
        volume: quoteData.results.s || 0,
        timestamp: new Date().toISOString(),
      };

      if (this.config.enableDetailedLogging) {
        console.log(
          `💰 ${ticker}: $${currentPrice.toFixed(2)} (${
            changePercent >= 0 ? "+" : ""
          }${changePercent.toFixed(2)}%)`
        );
      }

      return priceData;
    } catch (error) {
      if (this.config.enableDetailedLogging) {
        console.warn(`⚠️ ${ticker}: Price fetch error -`, error.message);
      }
      return null;
    }
  }

  /**
   * Fetch prices for multiple stocks with rate limiting
   */
  private async fetchBatchPrices(
    tickers: string[]
  ): Promise<Record<string, PriceData>> {
    const priceData: Record<string, PriceData> = {};
    const batchSize = 5; // Rate limiting: 5 requests per batch
    const delayMs = 1000; // 1 second delay between batches

    if (this.config.enableDetailedLogging) {
      console.log(`💰 Fetching real prices for ${tickers.length} stocks...`);
    }

    for (let i = 0; i < tickers.length; i += batchSize) {
      const batch = tickers.slice(i, i + batchSize);

      // Process batch in parallel
      const batchPromises = batch.map((ticker) => this.fetchStockPrice(ticker));
      const batchResults = await Promise.allSettled(batchPromises);

      // Store results
      batch.forEach((ticker, index) => {
        const result = batchResults[index];
        if (result.status === "fulfilled" && result.value) {
          priceData[ticker] = result.value;
        }
      });

      // Rate limiting delay (except for last batch)
      if (i + batchSize < tickers.length) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }

    if (this.config.enableDetailedLogging) {
      console.log(
        `💰 Price fetching complete: ${Object.keys(priceData).length}/${
          tickers.length
        } prices retrieved`
      );
    }

    return priceData;
  }

  // ===================================================================
  // 🚀 NEW: PRICE MERGING FOR UI DISPLAY
  // ===================================================================

  /**
   * Update ProcessedSignal objects with fetched price data for UI display
   */
  private updateSignalsWithPrices(
    signals: ProcessedSignal[],
    priceData: Record<string, PriceData>
  ): ProcessedSignal[] {
    if (this.config.enableDetailedLogging) {
      console.log(
        `🔄 Updating ${signals.length} signals with fetched price data...`
      );
    }

    let updatedCount = 0;

    const updatedSignals = signals.map((signal) => {
      const priceInfo = priceData[signal.ticker];

      if (priceInfo) {
        updatedCount++;

        if (this.config.enableDetailedLogging) {
          console.log(
            `💰 ${
              signal.ticker
            }: Updated with real price ${priceInfo.currentPrice.toFixed(2)} (${
              priceInfo.changePercent >= 0 ? "+" : ""
            }${priceInfo.changePercent.toFixed(
              2
            )}%) → UI fields: current_price, price_change_percent`
          );
        }

        // Update signal with real price data
        return {
          ...signal,
          current_price: priceInfo.currentPrice, // 🔧 FIXED: Use snake_case to match database schema
          price_change_percent: priceInfo.changePercent, // 🔧 FIXED: Use snake_case to match database schema
          entryPrice: signal.entryPrice || priceInfo.currentPrice, // Use fetched price as entry if not set
          // Add volume info if available
          volume: priceInfo.volume,
          // Update timestamp to reflect when price was fetched
          lastUpdated: priceInfo.timestamp,
        };
      }

      // Return original signal if no price data available
      return signal;
    });

    if (this.config.enableDetailedLogging) {
      console.log(
        `✅ Price update complete: ${updatedCount}/${signals.length} signals updated with real prices`
      );
    }

    return updatedSignals;
  }

  // ===================================================================
  // MAIN PROCESSING METHODS (UPDATED WITH PRICE MERGING)
  // ===================================================================

  /**
   * Process entire stock universe with auto-save + real prices + UI price display
   */
  public async processStockUniverse(
    stockUniverse?: StockInfo[],
    progressCallback?: (progress: any) => void
  ): Promise<EnhancedProcessingResult> {
    const startTime = Date.now();

    if (this.config.enableDetailedLogging) {
      console.log("🚀 Starting enhanced stock universe processing...");
    }

    try {
      // Step 1: Get stock universe if not provided
      const stocks = stockUniverse || StockScanner.getDefaultStockUniverse();

      if (this.config.enableDetailedLogging) {
        console.log(`📊 Processing ${stocks.length} stocks from universe`);
      }

      // Step 2: Clear old signals if enabled
      if (this.config.clearOldSignals) {
        if (this.config.enableDetailedLogging) {
          console.log(
            `🧹 Clearing signals older than ${
              this.config.oldSignalsCutoffHours
            } hours (${Math.round(
              this.config.oldSignalsCutoffHours * 60
            )} minutes)...`
          );
        }

        const cleared = await this.autoSaveService.clearOldSignals(
          this.config.oldSignalsCutoffHours
        );

        if (this.config.enableDetailedLogging) {
          console.log(`🧹 Cleared ${cleared} old signals from database`);
        }
      }

      // Step 3: Scan stocks for market data
      const stockScanner = new StockScanner();
      const { multiTimeframeData, errors, stats } =
        await stockScanner.scanStocks(stocks, progressCallback);

      if (this.config.enableDetailedLogging) {
        console.log(
          `✅ Stock scanning complete: ${
            Object.keys(multiTimeframeData).length
          } datasets`
        );
      }

      // Step 4: Process signals for each stock
      let signals = await this.processSignalsFromData(
        multiTimeframeData,
        stocks,
        progressCallback
      );

      if (this.config.enableDetailedLogging) {
        console.log(
          `✅ Signal processing complete: ${signals.length} signals generated`
        );
      }

      // 🚀 Step 5: Fetch real prices for all stocks with signals
      let priceData: Record<string, PriceData> = {};
      let pricesUpdated = 0;

      if (this.config.fetchRealPrices && signals.length > 0) {
        const tickers = signals.map((s) => s.ticker);
        priceData = await this.fetchBatchPrices(tickers);
        pricesUpdated = Object.keys(priceData).length;

        if (this.config.enableDetailedLogging) {
          console.log(
            `💰 Real prices fetched: ${pricesUpdated} stocks updated`
          );
        }

        // 🔧 Step 5.5: Update signals with fetched price data for UI display
        signals = this.updateSignalsWithPrices(signals, priceData);

        if (this.config.enableDetailedLogging) {
          console.log(`🔄 Signals updated with price data for UI display`);
        }
      }

      // Step 6: Auto-save to database if enabled (now with price data)
      let autoSaveResult = {
        success: true,
        signalsSaved: 0,
        signalsFiltered: 0,
        errors: [],
        processingTime: 0,
      };

      if (this.config.enableAutoSave && signals.length > 0) {
        // Create stock info map for database integration
        const stockInfoMap = this.createStockInfoMap(stocks);

        // 🚀 Enhanced auto-save with price data
        autoSaveResult = await this.autoSaveService.autoSaveSignalsWithPrices(
          signals,
          stockInfoMap,
          priceData
        );

        if (this.config.enableDetailedLogging) {
          console.log(
            `💾 Auto-save complete: ${autoSaveResult.signalsSaved} signals saved to database with real prices`
          );
        }
      }

      // Step 7: Calculate final statistics
      const totalTime = Date.now() - startTime;
      const processingStats = {
        totalStocks: stocks.length,
        validDatasets: Object.keys(multiTimeframeData).length,
        signalsGenerated: signals.length,
        qualitySignals: signals.filter(
          (s) => s.finalScore >= this.config.minScoreForSave
        ).length,
        databaseSaves: autoSaveResult.signalsSaved,
        totalTime,
        apiCallsMade: stats?.apiCallsMade || 0,
        pricesUpdated, // 🚀 Track price updates
      };

      if (this.config.enableDetailedLogging) {
        console.log("🎉 Enhanced processing complete!");
        console.log(`   Total Time: ${Math.round(totalTime / 1000)}s`);
        console.log(
          `   Signals Generated: ${processingStats.signalsGenerated}`
        );
        console.log(
          `   Quality Signals (≥${this.config.minScoreForSave}): ${processingStats.qualitySignals}`
        );
        console.log(`   Database Saves: ${processingStats.databaseSaves}`);
        console.log(`   Prices Updated: ${processingStats.pricesUpdated}`);
        console.log(
          `   UI Signals with Prices: ${
            signals.filter((s) => s.current_price && s.current_price > 0).length
          }`
        );
      }

      return {
        signals, // 🔧 Now includes updated prices for UI display
        autoSaveResult,
        processingStats,
      };
    } catch (error) {
      console.error("❌ Enhanced processing failed:", error);
      throw new Error(`Enhanced signal processing failed: ${error.message}`);
    }
  }

  /**
   * Process signals from pre-scanned market data
   */
  private async processSignalsFromData(
    multiTimeframeData: Record<string, MultiTimeframeData>,
    stocks: StockInfo[],
    progressCallback?: (progress: any) => void
  ): Promise<ProcessedSignal[]> {
    const signals: ProcessedSignal[] = [];
    const stocksWithData = Object.keys(multiTimeframeData);

    for (let i = 0; i < stocksWithData.length; i++) {
      const ticker = stocksWithData[i];
      const stockData = multiTimeframeData[ticker];

      // Update progress
      if (progressCallback) {
        progressCallback({
          stage: `Processing Signal ${ticker}`,
          stocksScanned: i,
          totalStocks: stocksWithData.length,
          currentStock: ticker,
          signalsFound: signals.length,
          timeElapsed: 0,
          validSignals: signals.filter(
            (s) => s.finalScore >= this.config.minScoreForSave
          ).length,
          apiCallsMade: 0,
          dataQuality: "Processing",
          errors: 0,
        });
      }

      try {
        // Process signal for this stock
        const signal = await this.signalProcessor.processSignal(
          ticker,
          stockData
        );

        if (signal) {
          signals.push(signal);

          if (this.config.enableDetailedLogging) {
            console.log(
              `✅ ${ticker}: Signal generated (Score: ${signal.finalScore})`
            );
          }
        } else {
          if (this.config.enableDetailedLogging) {
            console.log(`⚠️ ${ticker}: No signal generated`);
          }
        }
      } catch (error) {
        console.error(`❌ ${ticker}: Signal processing error -`, error);
      }

      // Small delay to prevent overwhelming
      if (i % 10 === 0 && i > 0) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    return signals;
  }

  // ===================================================================
  // UTILITY METHODS
  // ===================================================================

  private createStockInfoMap(
    stocks: StockInfo[]
  ): Record<string, { companyName: string; sector: string; exchange: string }> {
    const stockMap: Record<
      string,
      { companyName: string; sector: string; exchange: string }
    > = {};

    stocks.forEach((stock) => {
      stockMap[stock.ticker] = {
        companyName: stock.companyName,
        sector: stock.sector,
        exchange: stock.exchange,
      };
    });

    return stockMap;
  }

  // ===================================================================
  // PUBLIC METHODS
  // ===================================================================

  /**
   * Test database connection
   */
  public async testDatabaseConnection(): Promise<boolean> {
    return await this.autoSaveService.testConnection();
  }

  /**
   * Test system health
   */
  public async testSystemHealth(): Promise<{
    status: string;
    message: string;
    details?: any;
  }> {
    try {
      // Test signal processor
      const signalProcessorHealth =
        await this.signalProcessor.testSystemHealth();

      if (signalProcessorHealth.status !== "healthy") {
        return signalProcessorHealth;
      }

      // Test database connection
      const dbConnected = await this.testDatabaseConnection();

      if (!dbConnected) {
        return {
          status: "error",
          message: "Database connection failed. Check Supabase configuration.",
        };
      }

      // Test stock scanner
      const stockScanner = new StockScanner();
      const apiConnected = await stockScanner.testConnection();

      if (!apiConnected) {
        return {
          status: "warning",
          message:
            "Polygon.io API connection failed. Signal generation may not work.",
        };
      }

      // 🚀 Test price fetching
      if (this.config.fetchRealPrices) {
        const testPrice = await this.fetchStockPrice("AAPL");
        if (!testPrice) {
          return {
            status: "warning",
            message:
              "Price fetching failed. Check Polygon.io API configuration.",
          };
        }
      }

      return {
        status: "healthy",
        message:
          "All systems operational. Enhanced signal processing with real prices ready.",
        details: {
          signalProcessor: "healthy",
          database: "connected",
          api: "connected",
          pricesFetching: this.config.fetchRealPrices ? "enabled" : "disabled",
          autoSave: this.config.enableAutoSave ? "enabled" : "disabled",
        },
      };
    } catch (error) {
      return {
        status: "error",
        message: `System health check failed: ${error.message}`,
      };
    }
  }

  /**
   * Get current configuration
   */
  public getConfig(): EnhancedProcessingConfig {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  public updateConfig(newConfig: Partial<EnhancedProcessingConfig>): void {
    this.config = { ...this.config, ...newConfig };

    // Update auto-save service config
    this.autoSaveService.updateConfig({
      minScore: this.config.minScoreForSave,
      batchSize: this.config.batchSize,
      enableLogging: this.config.enableDetailedLogging,
    });

    if (this.config.enableDetailedLogging) {
      console.log("🔄 Enhanced processor configuration updated:", newConfig);
    }
  }

  /**
   * Manual save signals to database with prices
   */
  public async saveSignalsToDatabase(
    signals: ProcessedSignal[],
    stockInfo: Record<
      string,
      { companyName: string; sector: string; exchange: string }
    >,
    priceData?: Record<string, PriceData>
  ) {
    if (priceData) {
      return await this.autoSaveService.autoSaveSignalsWithPrices(
        signals,
        stockInfo,
        priceData
      );
    } else {
      return await this.autoSaveService.autoSaveSignals(signals, stockInfo);
    }
  }

  /**
   * Clear old signals from database
   */
  public async clearOldSignals(hoursOld: number = 24): Promise<number> {
    return await this.autoSaveService.clearOldSignals(hoursOld);
  }

  /**
   * Get underlying signal processor (for compatibility)
   */
  public getSignalProcessor(): SignalProcessor {
    return this.signalProcessor;
  }

  /**
   * Get auto-save service (for advanced usage)
   */
  public getAutoSaveService(): SignalAutoSaveService {
    return this.autoSaveService;
  }

  // 🚀 NEW: Price-specific methods

  /**
   * Fetch price for a single stock
   */
  public async getStockPrice(ticker: string): Promise<PriceData | null> {
    return await this.fetchStockPrice(ticker);
  }

  /**
   * Update prices for existing signals in database
   */
  public async updateExistingSignalPrices(
    signalIds?: string[]
  ): Promise<number> {
    // This would be implemented in the auto-save service
    // For now, return 0 as placeholder
    console.log("🔄 Updating existing signal prices...");
    return 0;
  }

  /**
   * 🔧 NEW: Update existing signals with current prices (for UI refresh)
   */
  public async refreshSignalPrices(
    signals: ProcessedSignal[]
  ): Promise<ProcessedSignal[]> {
    if (!this.config.fetchRealPrices || signals.length === 0) {
      return signals;
    }

    const tickers = signals.map((s) => s.ticker);
    const priceData = await this.fetchBatchPrices(tickers);

    return this.updateSignalsWithPrices(signals, priceData);
  }
}

// ===================================================================
// CONVENIENCE FUNCTIONS
// ===================================================================

/**
 * Quick function to process stocks with auto-save + real prices
 */
export async function processStocksWithAutoSave(
  stocks?: StockInfo[],
  config?: Partial<EnhancedProcessingConfig>,
  progressCallback?: (progress: any) => void
): Promise<EnhancedProcessingResult> {
  const processor = new EnhancedSignalProcessor(config);
  return await processor.processStockUniverse(stocks, progressCallback);
}

/**
 * Quick function to test the enhanced system with prices
 */
export async function testEnhancedSystem(): Promise<{
  status: string;
  message: string;
  details?: any;
}> {
  const processor = new EnhancedSignalProcessor();
  return await processor.testSystemHealth();
}

// ===================================================================
// DEFAULT EXPORT
// ===================================================================

export default EnhancedSignalProcessor;
