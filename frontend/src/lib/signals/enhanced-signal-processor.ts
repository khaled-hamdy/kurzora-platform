// ===================================================================
// ENHANCED SIGNAL PROCESSOR WITH AUTO-SAVE INTEGRATION
// ===================================================================
// File: src/lib/signals/enhanced-signal-processor.ts
// Purpose: Signal processing with automatic database storage
// Integration: Extends existing signal processor with auto-save functionality

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
  };
}

interface EnhancedProcessingConfig {
  enableAutoSave: boolean;
  minScoreForSave: number;
  batchSize: number;
  enableDetailedLogging: boolean;
  clearOldSignals: boolean;
  oldSignalsCutoffHours: number;
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
        `   Clear Old Signals: ${
          this.config.clearOldSignals ? "Enabled" : "Disabled"
        } (${this.config.oldSignalsCutoffHours}h = ${Math.round(
          this.config.oldSignalsCutoffHours * 60
        )} minutes)`
      );
    }
  }

  // ===================================================================
  // MAIN PROCESSING METHODS
  // ===================================================================

  /**
   * Process entire stock universe with auto-save
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
      const signals = await this.processSignalsFromData(
        multiTimeframeData,
        stocks,
        progressCallback
      );

      if (this.config.enableDetailedLogging) {
        console.log(
          `✅ Signal processing complete: ${signals.length} signals generated`
        );
      }

      // Step 5: Auto-save to database if enabled
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

        autoSaveResult = await this.autoSaveService.autoSaveSignals(
          signals,
          stockInfoMap
        );

        if (this.config.enableDetailedLogging) {
          console.log(
            `💾 Auto-save complete: ${autoSaveResult.signalsSaved} signals saved to database`
          );
        }
      }

      // Step 6: Calculate final statistics
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

      return {
        status: "healthy",
        message: "All systems operational. Enhanced signal processing ready.",
        details: {
          signalProcessor: "healthy",
          database: "connected",
          api: "connected",
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
   * Manual save signals to database
   */
  public async saveSignalsToDatabase(
    signals: ProcessedSignal[],
    stockInfo: Record<
      string,
      { companyName: string; sector: string; exchange: string }
    >
  ) {
    return await this.autoSaveService.autoSaveSignals(signals, stockInfo);
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
}

// ===================================================================
// CONVENIENCE FUNCTIONS
// ===================================================================

/**
 * Quick function to process stocks with auto-save
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
 * Quick function to test the enhanced system
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
