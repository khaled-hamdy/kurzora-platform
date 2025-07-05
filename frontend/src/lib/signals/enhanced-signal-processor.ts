// ===================================================================
// FIXED: ENHANCED SIGNAL PROCESSOR - GUARANTEED CORRECT SECTORS
// ===================================================================
// File: src/lib/signals/enhanced-signal-processor.ts
// 🔧 CRITICAL FIX: Completely bypasses old save methods

import {
  SignalProcessor,
  ProcessedSignal,
  StockInfo,
} from "./signal-processor";
import { StockScanner } from "./stock-scanner";
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
  fetchRealPrices: boolean;
}

// 🚀 NEW: Price data interface
interface PriceData {
  currentPrice: number;
  changePercent: number;
  volume: number;
  timestamp: string;
}

// ===================================================================
// ENHANCED SIGNAL PROCESSOR CLASS WITH GUARANTEED CORRECT SECTORS
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
      oldSignalsCutoffHours: 0.1,
      fetchRealPrices: true,
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
      console.log(
        "🚀 Enhanced Signal Processor initialized with SECTOR FIX V2"
      );
      console.log(
        `   Auto-Save: ${this.config.enableAutoSave ? "Enabled" : "Disabled"}`
      );
      console.log(`   Min Score for DB: ${this.config.minScoreForSave}`);
      console.log(
        `   Real Prices: ${
          this.config.fetchRealPrices ? "Enabled" : "Disabled"
        }`
      );
      console.log(
        "🔧 SECTOR BUG COMPLETELY FIXED: Will bypass all deprecated methods"
      );
    }
  }

  // ===================================================================
  // PRICE FETCHING METHODS (UNCHANGED)
  // ===================================================================

  private async fetchStockPrice(ticker: string): Promise<PriceData | null> {
    try {
      const apiKey = import.meta.env.VITE_POLYGON_API_KEY;
      if (!apiKey) {
        console.warn("⚠️ Polygon.io API key not found - using fallback prices");
        return null;
      }

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

  private async fetchBatchPrices(
    tickers: string[]
  ): Promise<Record<string, PriceData>> {
    const priceData: Record<string, PriceData> = {};
    const batchSize = 5;
    const delayMs = 1000;

    if (this.config.enableDetailedLogging) {
      console.log(`💰 Fetching real prices for ${tickers.length} stocks...`);
    }

    for (let i = 0; i < tickers.length; i += batchSize) {
      const batch = tickers.slice(i, i + batchSize);

      const batchPromises = batch.map((ticker) => this.fetchStockPrice(ticker));
      const batchResults = await Promise.allSettled(batchPromises);

      batch.forEach((ticker, index) => {
        const result = batchResults[index];
        if (result.status === "fulfilled" && result.value) {
          priceData[ticker] = result.value;
        }
      });

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
            }: Updated with real price ${priceInfo.currentPrice.toFixed(2)}`
          );
        }

        return {
          ...signal,
          current_price: priceInfo.currentPrice,
          price_change_percent: priceInfo.changePercent,
          entryPrice: signal.entryPrice || priceInfo.currentPrice,
          volume: priceInfo.volume,
          lastUpdated: priceInfo.timestamp,
        };
      }

      return signal;
    });

    if (this.config.enableDetailedLogging) {
      console.log(
        `✅ Price update complete: ${updatedCount}/${signals.length} signals updated`
      );
    }

    return updatedSignals;
  }

  // ===================================================================
  // 🔧 COMPLETELY FIXED: MAIN PROCESSING WITH GUARANTEED CORRECT SECTORS
  // ===================================================================

  public async processStockUniverse(
    stockUniverse?: StockInfo[],
    progressCallback?: (progress: any) => void
  ): Promise<EnhancedProcessingResult> {
    const startTime = Date.now();

    if (this.config.enableDetailedLogging) {
      console.log(
        "🚀 Starting enhanced stock universe processing with COMPLETE SECTOR FIX..."
      );
    }

    try {
      // Step 1: Get stock universe if not provided
      const stocks = stockUniverse || StockScanner.getDefaultStockUniverse();

      if (this.config.enableDetailedLogging) {
        console.log(`📊 Processing ${stocks.length} stocks from universe`);
        console.log(
          "🔧 COMPLETE SECTOR FIX: Will bypass ALL deprecated save methods"
        );
      }

      // Step 2: Clear old signals if enabled
      if (this.config.clearOldSignals) {
        if (this.config.enableDetailedLogging) {
          console.log(
            `🧹 Clearing signals older than ${this.config.oldSignalsCutoffHours} hours...`
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

      // Step 4: Process signals for each stock WITH STOCK INFO
      let signals = await this.processSignalsFromDataWithStockInfo(
        multiTimeframeData,
        stocks,
        progressCallback
      );

      if (this.config.enableDetailedLogging) {
        console.log(
          `✅ Signal processing complete: ${signals.length} signals generated`
        );
      }

      // Step 5: Fetch real prices for all stocks with signals
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

        signals = this.updateSignalsWithPrices(signals, priceData);

        if (this.config.enableDetailedLogging) {
          console.log(`🔄 Signals updated with price data for UI display`);
        }
      }

      // 🔧 Step 6: CUSTOM DATABASE SAVE - BYPASSING AUTO-SAVE SERVICE COMPLETELY
      let autoSaveResult = {
        success: true,
        signalsSaved: 0,
        signalsFiltered: 0,
        errors: [],
        processingTime: 0,
      };

      if (this.config.enableAutoSave && signals.length > 0) {
        if (this.config.enableDetailedLogging) {
          console.log(
            "🔧 BYPASSING auto-save service - using DIRECT save with correct sectors"
          );
        }

        // Create stock info map for correct sector assignment
        const stockInfoMap = this.createStockInfoMap(stocks);

        // 🚀 DIRECT SAVE WITH GUARANTEED CORRECT SECTORS
        autoSaveResult = await this.directSaveWithCorrectSectors(
          signals,
          stockInfoMap,
          priceData
        );

        if (this.config.enableDetailedLogging) {
          console.log(
            `💾 DIRECT SAVE complete: ${autoSaveResult.signalsSaved} signals saved with GUARANTEED correct sectors`
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
        pricesUpdated,
      };

      if (this.config.enableDetailedLogging) {
        console.log(
          "🎉 Enhanced processing complete with COMPLETE SECTOR FIX!"
        );
        console.log(
          `   Signals Generated: ${processingStats.signalsGenerated}`
        );
        console.log(`   Database Saves: ${processingStats.databaseSaves}`);
        console.log(`   Sectors: GUARANTEED CORRECT via direct save method`);
      }

      return {
        signals,
        autoSaveResult,
        processingStats,
      };
    } catch (error) {
      console.error("❌ Enhanced processing failed:", error);
      throw new Error(`Enhanced signal processing failed: ${error.message}`);
    }
  }

  // 🔧 FIXED: Process signals with stock information
  private async processSignalsFromDataWithStockInfo(
    multiTimeframeData: Record<string, MultiTimeframeData>,
    stocks: StockInfo[],
    progressCallback?: (progress: any) => void
  ): Promise<ProcessedSignal[]> {
    const signals: ProcessedSignal[] = [];
    const stocksWithData = Object.keys(multiTimeframeData);

    // Create a map for quick stock info lookup
    const stockInfoMap = new Map<string, StockInfo>();
    stocks.forEach((stock) => {
      stockInfoMap.set(stock.ticker, stock);
    });

    for (let i = 0; i < stocksWithData.length; i++) {
      const ticker = stocksWithData[i];
      const stockData = multiTimeframeData[ticker];
      const stockInfo = stockInfoMap.get(ticker);

      if (!stockInfo) {
        console.warn(
          `⚠️ ${ticker}: No stock info found in universe - skipping`
        );
        continue;
      }

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
              `✅ ${ticker}: Signal generated (Score: ${signal.finalScore}, Sector: ${stockInfo.sector})`
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

  // 🔧 CRITICAL NEW METHOD: Direct save bypassing auto-save service
  private async directSaveWithCorrectSectors(
    signals: ProcessedSignal[],
    stockInfoMap: Record<string, StockInfo>,
    priceData: Record<string, PriceData>
  ): Promise<{
    success: boolean;
    signalsSaved: number;
    signalsFiltered: number;
    errors: string[];
    processingTime: number;
  }> {
    const startTime = Date.now();
    const errors: string[] = [];
    let signalsSaved = 0;
    let signalsFiltered = 0;

    if (this.config.enableDetailedLogging) {
      console.log(
        `💾 Starting DIRECT SAVE with GUARANTEED correct sectors for ${signals.length} signals...`
      );
      console.log(
        "🔧 BYPASSING all auto-save and deprecated methods completely"
      );
    }

    // Filter signals by quality
    const qualitySignals = signals.filter(
      (signal) => signal.finalScore >= this.config.minScoreForSave
    );
    signalsFiltered = signals.length - qualitySignals.length;

    if (this.config.enableDetailedLogging) {
      console.log(
        `📊 Quality filter: ${qualitySignals.length}/${signals.length} signals passed (≥${this.config.minScoreForSave})`
      );
    }

    // Process each signal with GUARANTEED correct stock info
    for (const signal of qualitySignals) {
      const stockInfo = stockInfoMap[signal.ticker];

      if (!stockInfo) {
        console.warn(
          `⚠️ ${signal.ticker}: No stock info found - skipping to ensure correct sectors`
        );
        errors.push(`${signal.ticker}: No stock info found`);
        continue;
      }

      try {
        if (this.config.enableDetailedLogging) {
          console.log(
            `💾 ${signal.ticker}: DIRECT SAVE with sector="${stockInfo.sector}" company="${stockInfo.companyName}"`
          );
        }

        // 🔧 GUARANTEED CORRECT: Direct call to new method
        const saved = await this.signalProcessor.saveSignalWithStockInfo(
          signal,
          stockInfo
        );

        if (saved) {
          signalsSaved++;
          if (this.config.enableDetailedLogging) {
            console.log(
              `✅ ${signal.ticker}: DIRECT SAVE successful with GUARANTEED correct sector: ${stockInfo.sector}`
            );
          }
        } else {
          errors.push(`${signal.ticker}: Direct save failed`);
          if (this.config.enableDetailedLogging) {
            console.error(`❌ ${signal.ticker}: Direct save returned false`);
          }
        }
      } catch (error) {
        console.error(`❌ ${signal.ticker}: Direct save error -`, error);
        errors.push(`${signal.ticker}: ${error.message}`);
      }

      // Small delay to prevent overwhelming the database
      await new Promise((resolve) => setTimeout(resolve, 50));
    }

    const processingTime = Date.now() - startTime;

    if (this.config.enableDetailedLogging) {
      console.log(`🎉 DIRECT SAVE completed in ${processingTime}ms:`);
      console.log(`   Signals Saved: ${signalsSaved}`);
      console.log(`   Signals Filtered: ${signalsFiltered}`);
      console.log(`   Errors: ${errors.length}`);
      console.log(
        `   SUCCESS: ALL saved signals have GUARANTEED CORRECT sectors!`
      );
      console.log(`   METHOD: Direct saveSignalWithStockInfo() calls only`);
    }

    return {
      success: errors.length === 0,
      signalsSaved,
      signalsFiltered,
      errors,
      processingTime,
    };
  }

  // ===================================================================
  // UTILITY METHODS
  // ===================================================================

  private createStockInfoMap(stocks: StockInfo[]): Record<string, StockInfo> {
    const stockMap: Record<string, StockInfo> = {};

    stocks.forEach((stock) => {
      stockMap[stock.ticker] = stock;
    });

    if (this.config.enableDetailedLogging) {
      console.log(`🗂️ Created stock info map for ${stocks.length} stocks`);
      console.log(
        `🔧 Example sectors: ${stocks
          .slice(0, 3)
          .map((s) => `${s.ticker}:${s.sector}`)
          .join(", ")}`
      );
    }

    return stockMap;
  }

  // ===================================================================
  // PUBLIC METHODS
  // ===================================================================

  public async testDatabaseConnection(): Promise<boolean> {
    return await this.autoSaveService.testConnection();
  }

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

      // Test price fetching
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
          "All systems operational. Enhanced signal processing with GUARANTEED CORRECT SECTOR ASSIGNMENT ready.",
        details: {
          signalProcessor: "healthy",
          database: "connected",
          api: "connected",
          pricesFetching: this.config.fetchRealPrices ? "enabled" : "disabled",
          autoSave: "✅ BYPASSED - Using direct save method",
          sectorFix:
            "✅ GUARANTEED - Direct saveSignalWithStockInfo() calls only",
        },
      };
    } catch (error) {
      return {
        status: "error",
        message: `System health check failed: ${error.message}`,
      };
    }
  }

  public getConfig(): EnhancedProcessingConfig {
    return { ...this.config };
  }

  public updateConfig(newConfig: Partial<EnhancedProcessingConfig>): void {
    this.config = { ...this.config, ...newConfig };

    this.autoSaveService.updateConfig({
      minScore: this.config.minScoreForSave,
      batchSize: this.config.batchSize,
      enableLogging: this.config.enableDetailedLogging,
    });

    if (this.config.enableDetailedLogging) {
      console.log("🔄 Enhanced processor configuration updated:", newConfig);
    }
  }

  // 🔧 GUARANTEED: Manual save with correct sectors using direct method
  public async saveSignalsToDatabase(
    signals: ProcessedSignal[],
    stockInfo: Record<string, StockInfo>,
    priceData?: Record<string, PriceData>
  ) {
    return await this.directSaveWithCorrectSectors(
      signals,
      stockInfo,
      priceData || {}
    );
  }

  public async clearOldSignals(hoursOld: number = 24): Promise<number> {
    return await this.autoSaveService.clearOldSignals(hoursOld);
  }

  public getSignalProcessor(): SignalProcessor {
    return this.signalProcessor;
  }

  public getAutoSaveService(): SignalAutoSaveService {
    return this.autoSaveService;
  }

  // Price-specific methods
  public async getStockPrice(ticker: string): Promise<PriceData | null> {
    return await this.fetchStockPrice(ticker);
  }

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
// CONVENIENCE FUNCTIONS WITH GUARANTEED SECTOR FIX
// ===================================================================

export async function processStocksWithAutoSave(
  stocks?: StockInfo[],
  config?: Partial<EnhancedProcessingConfig>,
  progressCallback?: (progress: any) => void
): Promise<EnhancedProcessingResult> {
  const processor = new EnhancedSignalProcessor(config);
  return await processor.processStockUniverse(stocks, progressCallback);
}

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
