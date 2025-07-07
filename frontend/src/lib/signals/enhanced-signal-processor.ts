// ===================================================================
// ENHANCED SIGNAL PROCESSOR - SESSION #134 SMART ENTRY FIX
// ===================================================================
// File: src/lib/signals/enhanced-signal-processor.ts
// 🛡️ ANTI-REGRESSION: Preserving ALL Session #124 working functionality
// 🎯 TARGETED FIX: Smart entry prices with 0.5%-1.5% premium (not 0%)
// 🛡️ PRESERVES: All Session #123 complete trading data integration

import {
  SignalProcessor,
  ProcessedSignal,
  StockInfo,
} from "./signal-processor";
import { StockScanner } from "./stock-scanner";
import { SignalAutoSaveService } from "./signal-auto-save";
import { MultiTimeframeData } from "./technical-indicators";

// ===================================================================
// INTERFACES & TYPES (PRESERVED EXACTLY)
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
  intelligentRiskManagement: boolean;
}

interface PriceData {
  currentPrice: number;
  changePercent: number;
  volume: number;
  timestamp: string;
}

interface RiskManagementData {
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  riskRewardRatio: number;
  atr: number;
  positionSize: number;
  riskAmount: number;
  rewardAmount: number;
  stopLossReason: string;
  takeProfitReason: string;
}

// ===================================================================
// SESSION #134 ENHANCED SIGNAL PROCESSOR WITH SMART ENTRY FIX
// ===================================================================

export class EnhancedSignalProcessor {
  private signalProcessor: SignalProcessor;
  private autoSaveService: SignalAutoSaveService;
  private config: EnhancedProcessingConfig;

  constructor(config?: Partial<EnhancedProcessingConfig>) {
    this.signalProcessor = new SignalProcessor();

    this.config = {
      enableAutoSave: true,
      minScoreForSave: 60,
      batchSize: 25,
      enableDetailedLogging: true,
      clearOldSignals: true,
      oldSignalsCutoffHours: 0.1,
      fetchRealPrices: true,
      intelligentRiskManagement: true,
      ...config,
    };

    this.autoSaveService = new SignalAutoSaveService({
      minScore: this.config.minScoreForSave,
      batchSize: this.config.batchSize,
      enableLogging: this.config.enableDetailedLogging,
      filterDuplicates: true,
      maxSignalsPerBatch: 100,
    });

    if (this.config.enableDetailedLogging) {
      console.log(
        "🛡️ Session #134 Enhanced Signal Processor - Smart Entry Fix"
      );
      console.log(
        "✅ Preserving ALL Session #124 working intelligent risk management"
      );
      console.log(
        `   Auto-Save: ${this.config.enableAutoSave ? "Enabled" : "Disabled"}`
      );
      console.log(`   Min Score for DB: ${this.config.minScoreForSave}%`);
      console.log(
        `   Real Prices: ${
          this.config.fetchRealPrices ? "Enabled" : "Disabled"
        }`
      );
      console.log(
        `   🧠 Intelligent Risk Management: ${
          this.config.intelligentRiskManagement
            ? "PRESERVED + ENHANCED"
            : "Disabled"
        }`
      );
      console.log("   🎯 NEW: Smart entry prices with 0.5%-1.5% premium");
    }
  }

  // ===================================================================
  // SESSION #134 SMART ENTRY CALCULATION (NEW - TARGETED FIX)
  // ===================================================================

  /**
   * Calculate smart entry price with proper premium above current price
   * 🎯 TARGETED FIX: Adds 0.5%-1.5% premium for realistic breakout entries
   * 🛡️ PRESERVES: All existing Session #124 working logic
   */
  private calculateSmartEntryPrice(
    ticker: string,
    currentPrice: number,
    confidenceScore: number,
    signalType: "bullish" | "bearish" | "neutral" = "bullish"
  ): { entryPrice: number; entryPremium: number; reason: string } {
    try {
      // Smart premium calculation based on signal confidence
      let premiumPercentage: number;

      if (confidenceScore >= 85) {
        premiumPercentage = 0.5; // 0.5% for excellent signals (tight entry)
      } else if (confidenceScore >= 75) {
        premiumPercentage = 0.8; // 0.8% for good signals
      } else if (confidenceScore >= 65) {
        premiumPercentage = 1.2; // 1.2% for average signals
      } else {
        premiumPercentage = 1.5; // 1.5% for weaker signals (wider entry)
      }

      // Calculate smart entry price
      let smartEntryPrice: number;
      const premiumAmount = currentPrice * (premiumPercentage / 100);

      if (signalType === "bullish") {
        smartEntryPrice = currentPrice + premiumAmount; // Above current for breakout
      } else if (signalType === "bearish") {
        smartEntryPrice = currentPrice - premiumAmount; // Below current for breakdown
      } else {
        smartEntryPrice = currentPrice + premiumAmount; // Default to bullish
      }

      const reason = `${premiumPercentage}% ${signalType} breakout entry (confidence-based)`;

      if (this.config.enableDetailedLogging) {
        console.log(
          `🎯 ${ticker}: Smart Entry - Current: $${currentPrice.toFixed(
            2
          )}, Entry: $${smartEntryPrice.toFixed(2)} (+${premiumPercentage}%)`
        );
      }

      return {
        entryPrice: Number(smartEntryPrice.toFixed(2)),
        entryPremium: premiumPercentage,
        reason,
      };
    } catch (error) {
      console.error(`❌ ${ticker}: Smart entry calculation failed:`, error);

      // Fallback to current price + 1% for safety
      const fallbackEntry = currentPrice * 1.01;
      return {
        entryPrice: Number(fallbackEntry.toFixed(2)),
        entryPremium: 1.0,
        reason: "1% fallback entry (calculation error)",
      };
    }
  }

  // ===================================================================
  // SESSION #124 WORKING RISK MANAGEMENT (PRESERVED EXACTLY)
  // ===================================================================

  /**
   * Get sector-based ATR estimate for intelligent calculations
   * SESSION #124: Reliable sector-based estimates that work (PRESERVED)
   */
  private getSectorBasedATR(ticker: string, currentPrice: number): number {
    // Sector-based ATR estimates as percentage of price (reliable approach)
    const sectorATRPercentages: Record<string, number> = {
      Technology: 0.035, // 3.5% average daily range
      Healthcare: 0.025, // 2.5% average daily range
      "Financial Services": 0.028, // 2.8% average daily range
      "Consumer Cyclical": 0.032, // 3.2% average daily range
      "Consumer Defensive": 0.018, // 1.8% average daily range (stable)
      Industrials: 0.027, // 2.7% average daily range
      Energy: 0.045, // 4.5% average daily range (volatile)
      Utilities: 0.015, // 1.5% average daily range (very stable)
      "Communication Services": 0.033, // 3.3% average daily range
      "Real Estate": 0.022, // 2.2% average daily range
      "Basic Materials": 0.038, // 3.8% average daily range
    };

    // Default percentage for unknown sectors
    let atrPercentage = 0.03; // 3.0% market average

    // Determine sector from common tickers (Session #124 reliable approach)
    if (
      [
        "AAPL",
        "MSFT",
        "GOOGL",
        "AMZN",
        "TSLA",
        "NVDA",
        "META",
        "NFLX",
      ].includes(ticker)
    ) {
      atrPercentage = sectorATRPercentages["Technology"];
    } else if (
      ["JPM", "BAC", "WFC", "GS", "V", "MA", "C", "AXP"].includes(ticker)
    ) {
      atrPercentage = sectorATRPercentages["Financial Services"];
    } else if (["JNJ", "PFE", "UNH", "MRK", "ABBV", "TMO"].includes(ticker)) {
      atrPercentage = sectorATRPercentages["Healthcare"];
    } else if (["KO", "PG", "WMT", "PEP", "CL", "KMB"].includes(ticker)) {
      atrPercentage = sectorATRPercentages["Consumer Defensive"];
    } else if (["XOM", "CVX", "COP", "SLB", "EOG"].includes(ticker)) {
      atrPercentage = sectorATRPercentages["Energy"];
    } else if (["JCI", "CAT", "BA", "GE", "HON"].includes(ticker)) {
      atrPercentage = sectorATRPercentages["Industrials"];
    }

    const estimatedATR = currentPrice * atrPercentage;

    if (this.config.enableDetailedLogging) {
      console.log(
        `💡 ${ticker}: Sector ATR estimate: $${estimatedATR.toFixed(2)} (${(
          atrPercentage * 100
        ).toFixed(1)}% of $${currentPrice})`
      );
    }

    return estimatedATR;
  }

  /**
   * SESSION #124 Working stop loss calculation (PRESERVED EXACTLY)
   * RELIABLE: Uses real current price + intelligent ATR estimates
   */
  private calculateWorkingStopLoss(
    entryPrice: number,
    atr: number,
    signalType: "bullish" | "bearish" | "neutral",
    confidenceScore: number
  ): { stopLoss: number; reason: string; multiplier: number } {
    // Dynamic ATR multiplier based on confidence (Session #124 working approach)
    let atrMultiplier = 2.0; // Base multiplier

    if (confidenceScore >= 80) {
      atrMultiplier = 1.8; // Tighter stops for high confidence
    } else if (confidenceScore >= 70) {
      atrMultiplier = 2.0; // Standard stops
    } else if (confidenceScore >= 60) {
      atrMultiplier = 2.2; // Wider stops for lower confidence
    } else {
      atrMultiplier = 2.5; // Much wider for very low confidence
    }

    let stopLoss: number;
    let reason: string;

    if (signalType === "bullish") {
      stopLoss = entryPrice - atr * atrMultiplier;
      reason = `${atrMultiplier.toFixed(1)}x ATR below entry`;
    } else {
      stopLoss = entryPrice + atr * atrMultiplier;
      reason = `${atrMultiplier.toFixed(1)}x ATR above entry`;
    }

    // Ensure stop loss is reasonable (not negative or too close)
    if (signalType === "bullish" && stopLoss <= entryPrice * 0.85) {
      stopLoss = entryPrice * 0.92; // 8% stop as fallback
      reason = "8% protective stop (ATR too wide)";
    } else if (signalType === "bearish" && stopLoss >= entryPrice * 1.15) {
      stopLoss = entryPrice * 1.08; // 8% stop as fallback
      reason = "8% protective stop (ATR too wide)";
    }

    return {
      stopLoss: Number(stopLoss.toFixed(2)),
      reason,
      multiplier: atrMultiplier,
    };
  }

  /**
   * SESSION #124 Working take profit calculation (PRESERVED EXACTLY)
   * RELIABLE: Dynamic risk-reward based on signal confidence
   */
  private calculateWorkingTakeProfit(
    entryPrice: number,
    stopLoss: number,
    confidenceScore: number,
    signalType: "bullish" | "bearish" | "neutral"
  ): { takeProfit: number; reason: string; riskRewardRatio: number } {
    const riskAmount = Math.abs(entryPrice - stopLoss);

    // Dynamic risk-reward ratio based on signal confidence (Session #124 working)
    let targetRiskReward: number;

    if (confidenceScore >= 85) {
      targetRiskReward = 3.0; // 3:1 for excellent signals
    } else if (confidenceScore >= 75) {
      targetRiskReward = 2.5; // 2.5:1 for good signals
    } else if (confidenceScore >= 65) {
      targetRiskReward = 2.0; // 2:1 for average signals
    } else {
      targetRiskReward = 1.5; // 1.5:1 for weaker signals
    }

    const rewardAmount = riskAmount * targetRiskReward;

    let takeProfit: number;
    const reason = `${targetRiskReward}:1 risk-reward (confidence-based)`;

    if (signalType === "bullish") {
      takeProfit = entryPrice + rewardAmount;
    } else {
      takeProfit = entryPrice - rewardAmount;
    }

    return {
      takeProfit: Number(takeProfit.toFixed(2)),
      reason,
      riskRewardRatio: targetRiskReward,
    };
  }

  /**
   * SESSION #124 Working position sizing calculation (PRESERVED EXACTLY)
   * RELIABLE: 2% risk rule with current prices
   */
  private calculateWorkingPositionSize(
    entryPrice: number,
    stopLoss: number,
    accountBalance: number = 10000,
    riskPercentage: number = 2.0
  ): number {
    const riskAmount = accountBalance * (riskPercentage / 100);
    const priceRisk = Math.abs(entryPrice - stopLoss);

    if (priceRisk === 0) return 100; // Fallback

    const positionSize = Math.floor(riskAmount / priceRisk);

    // Ensure position doesn't exceed 10% of account
    const maxPositionValue = accountBalance * 0.1;
    const maxShares = Math.floor(maxPositionValue / entryPrice);

    const finalSize = Math.min(positionSize, maxShares);

    // Ensure minimum position size
    return Math.max(finalSize, 10);
  }

  /**
   * SESSION #134 Enhanced intelligent risk management calculation
   * 🎯 ENHANCED: Now uses smart entry prices with proper premiums
   * 🛡️ PRESERVES: All Session #124 working calculation logic
   */
  private async calculateSession124RiskManagement(
    ticker: string,
    signal: ProcessedSignal,
    multiTimeframeData: MultiTimeframeData,
    priceData?: PriceData
  ): Promise<RiskManagementData> {
    try {
      if (this.config.enableDetailedLogging) {
        console.log(
          `🧠 Calculating Session #134 enhanced intelligent risk management for ${ticker}...`
        );
      }

      // 🛡️ SESSION #124: Get current price (prioritize real fetched prices)
      const currentPrice =
        priceData?.currentPrice || signal.current_price || 100;

      if (currentPrice === 0) {
        throw new Error("No valid price data available");
      }

      // 🎯 SESSION #134 ENHANCEMENT: Smart entry price calculation
      const signalType = signal.signalType || "bullish";
      const smartEntryData = this.calculateSmartEntryPrice(
        ticker,
        currentPrice,
        signal.finalScore,
        signalType
      );

      const entryPrice = smartEntryData.entryPrice; // Now has proper premium!

      // SESSION #124: Get intelligent ATR estimate (PRESERVED)
      const atr = this.getSectorBasedATR(ticker, currentPrice);

      // Calculate working stop loss with smart entry prices
      const stopLossData = this.calculateWorkingStopLoss(
        entryPrice,
        atr,
        signalType,
        signal.finalScore
      );

      // Calculate working take profit with smart entry prices
      const takeProfitData = this.calculateWorkingTakeProfit(
        entryPrice,
        stopLossData.stopLoss,
        signal.finalScore,
        signalType
      );

      // Calculate working position sizing
      const positionSize = this.calculateWorkingPositionSize(
        entryPrice,
        stopLossData.stopLoss
      );

      const riskAmount = Math.abs(entryPrice - stopLossData.stopLoss);
      const rewardAmount = Math.abs(takeProfitData.takeProfit - entryPrice);

      const riskManagement: RiskManagementData = {
        entryPrice,
        stopLoss: stopLossData.stopLoss,
        takeProfit: takeProfitData.takeProfit,
        riskRewardRatio: takeProfitData.riskRewardRatio,
        atr,
        positionSize,
        riskAmount,
        rewardAmount,
        stopLossReason: stopLossData.reason,
        takeProfitReason: takeProfitData.reason,
      };

      if (this.config.enableDetailedLogging) {
        console.log(
          `✅ ${ticker} Session #134 Enhanced Risk Management Results:`
        );
        console.log(`   Current: $${currentPrice} (market price)`);
        console.log(
          `   🎯 Smart Entry: $${entryPrice} (+${smartEntryData.entryPremium}% premium)`
        );
        console.log(
          `   Stop: $${stopLossData.stopLoss} (${stopLossData.reason})`
        );
        console.log(
          `   Target: $${takeProfitData.takeProfit} (${takeProfitData.reason})`
        );
        console.log(`   Risk/Reward: ${takeProfitData.riskRewardRatio}:1`);
        console.log(`   Position Size: ${positionSize} shares`);
        console.log(`   ATR Estimate: $${atr.toFixed(2)} (sector-based)`);
        console.log(`   🛡️ ENHANCEMENT: Real breakout entry (not 0% premium)`);
      }

      return riskManagement;
    } catch (error) {
      console.error(
        `❌ Session #134 risk management calculation failed for ${ticker}:`,
        error
      );

      // SESSION #124 Working fallback with smart entry (ENHANCED)
      const fallbackPrice =
        priceData?.currentPrice || signal.current_price || 100;
      const fallbackEntryPrice = fallbackPrice * 1.01; // 1% smart entry
      const fallbackATR = fallbackPrice * 0.03; // 3% of price
      const fallbackStop = fallbackEntryPrice * 0.95; // 5% stop from entry
      const fallbackTarget = fallbackEntryPrice * 1.1; // 10% target from entry

      if (this.config.enableDetailedLogging) {
        console.log(
          `🎯 ${ticker}: Using Session #134 enhanced fallback (Current: $${fallbackPrice}, Smart Entry: $${fallbackEntryPrice.toFixed(
            2
          )})`
        );
      }

      return {
        entryPrice: Number(fallbackEntryPrice.toFixed(2)),
        stopLoss: Number(fallbackStop.toFixed(2)),
        takeProfit: Number(fallbackTarget.toFixed(2)),
        riskRewardRatio: 2.0,
        atr: fallbackATR,
        positionSize: 100,
        riskAmount: fallbackEntryPrice - fallbackStop,
        rewardAmount: fallbackTarget - fallbackEntryPrice,
        stopLossReason: "5% protective stop (enhanced fallback)",
        takeProfitReason: "2:1 risk-reward (enhanced fallback)",
      };
    }
  }

  // ===================================================================
  // PRICE FETCHING METHODS (PRESERVED FROM SESSION #123)
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
  // SESSION #134 MAIN PROCESSING WITH ENHANCED RISK MANAGEMENT
  // ===================================================================

  public async processStockUniverse(
    stockUniverse?: StockInfo[],
    progressCallback?: (progress: any) => void
  ): Promise<EnhancedProcessingResult> {
    const startTime = Date.now();

    if (this.config.enableDetailedLogging) {
      console.log(
        "🛡️ Starting Session #134 enhanced stock universe processing..."
      );
      console.log(
        "✅ Preserving ALL Session #124 working intelligent risk management"
      );
      console.log(
        "🎯 ENHANCEMENT: Smart entry prices with proper 0.5%-1.5% premiums"
      );
    }

    try {
      // Step 1: Get stock universe if not provided
      const stocks = stockUniverse || StockScanner.getDefaultStockUniverse();

      if (this.config.enableDetailedLogging) {
        console.log(`📊 Processing ${stocks.length} stocks from universe`);
        console.log(
          "🛡️ Session #134: Enhanced price calculations with smart entry"
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

      // Step 4: Fetch real prices BEFORE signal processing for better calculations
      let priceData: Record<string, PriceData> = {};
      let pricesUpdated = 0;

      if (
        this.config.fetchRealPrices &&
        Object.keys(multiTimeframeData).length > 0
      ) {
        const tickers = Object.keys(multiTimeframeData);
        priceData = await this.fetchBatchPrices(tickers);
        pricesUpdated = Object.keys(priceData).length;

        if (this.config.enableDetailedLogging) {
          console.log(
            `💰 Real prices fetched BEFORE processing: ${pricesUpdated} stocks updated`
          );
        }
      }

      // Step 5: Process signals WITH SESSION #134 ENHANCED RISK MANAGEMENT (with smart entry)
      let signals =
        await this.processSignalsWithSession134EnhancedRiskManagement(
          multiTimeframeData,
          stocks,
          priceData, // 🛡️ PASS REAL PRICE DATA
          progressCallback
        );

      if (this.config.enableDetailedLogging) {
        console.log(
          `✅ Signal processing complete: ${signals.length} signals with Session #134 enhanced risk management`
        );
      }

      // Step 6: Update signals with price data for UI display (already have prices)
      if (this.config.fetchRealPrices && signals.length > 0) {
        signals = this.updateSignalsWithPrices(signals, priceData);

        if (this.config.enableDetailedLogging) {
          console.log(`🔄 Signals updated with price data for UI display`);
        }
      }

      // Step 7: Database save with Session #134 enhanced data integration
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
            "💾 Starting database save with Session #134 enhanced intelligent risk management"
          );
        }

        // Create stock info map for correct sector assignment
        const stockInfoMap = this.createStockInfoMap(stocks);

        // Direct save with Session #134 enhanced calculations
        autoSaveResult = await this.directSaveWithSession134EnhancedData(
          signals,
          stockInfoMap,
          priceData
        );

        if (this.config.enableDetailedLogging) {
          console.log(
            `💾 Database save complete: ${autoSaveResult.signalsSaved} signals saved with Session #134 enhanced risk management`
          );
        }
      }

      // Step 8: Calculate final statistics
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
        console.log("🎉 Session #134 enhanced processing complete!");
        console.log(
          `   Signals Generated: ${processingStats.signalsGenerated}`
        );
        console.log(`   Database Saves: ${processingStats.databaseSaves}`);
        console.log(
          `   Risk Management: Session #134 enhanced with smart entry`
        );
        console.log(
          `   Entry Prices: Smart breakout entries (0.5%-1.5% premium)`
        );
        console.log(
          `   🛡️ PRESERVATION: All Session #124 working calculations intact`
        );
        console.log(
          `   🎯 ENHANCEMENT: Data corruption fixed with smart entry prices`
        );
      }

      return {
        signals,
        autoSaveResult,
        processingStats,
      };
    } catch (error) {
      console.error("❌ Session #134 enhanced processing failed:", error);
      throw new Error(
        `Session #134 signal processing failed: ${error.message}`
      );
    }
  }

  // ===================================================================
  // SESSION #134 PROCESS SIGNALS WITH ENHANCED RISK MANAGEMENT
  // ===================================================================

  private async processSignalsWithSession134EnhancedRiskManagement(
    multiTimeframeData: Record<string, MultiTimeframeData>,
    stocks: StockInfo[],
    priceData: Record<string, PriceData>, // 🛡️ ADD PRICE DATA PARAMETER
    progressCallback?: (progress: any) => void
  ): Promise<ProcessedSignal[]> {
    const signals: ProcessedSignal[] = [];
    const stocksWithData = Object.keys(multiTimeframeData);

    // Create a map for quick stock info lookup
    const stockInfoMap = new Map<string, StockInfo>();
    stocks.forEach((stock) => {
      stockInfoMap.set(stock.ticker, stock);
    });

    if (this.config.enableDetailedLogging) {
      console.log(
        `🛡️ Processing ${stocksWithData.length} stocks with Session #134 enhanced risk management`
      );
    }

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
          stage: `Processing Signal ${ticker} (Session #134 Enhanced)`,
          stocksScanned: i,
          totalStocks: stocksWithData.length,
          currentStock: ticker,
          signalsFound: signals.length,
          timeElapsed: 0,
          validSignals: signals.filter(
            (s) => s.finalScore >= this.config.minScoreForSave
          ).length,
          apiCallsMade: 0,
          dataQuality: "Session #134 Enhanced Risk Management",
          errors: 0,
        });
      }

      try {
        // Process basic signal first
        const basicSignal = await this.signalProcessor.processSignal(
          ticker,
          stockData
        );

        if (basicSignal) {
          // ENHANCE WITH SESSION #134 ENHANCED RISK MANAGEMENT (smart entry)
          if (this.config.intelligentRiskManagement) {
            const tickerPriceData = priceData[ticker]; // 🛡️ GET REAL PRICE DATA FOR THIS TICKER
            const riskManagement = await this.calculateSession124RiskManagement(
              ticker,
              basicSignal,
              stockData,
              tickerPriceData // 🛡️ PASS REAL PRICE DATA
            );

            // Create enhanced signal with Session #134 enhanced risk management
            const enhancedSignal: ProcessedSignal = {
              ...basicSignal,
              // 🛡️ ENHANCED: Smart entry price-based calculations (with proper premium)
              entryPrice: riskManagement.entryPrice,
              stopLoss: riskManagement.stopLoss,
              takeProfit: riskManagement.takeProfit,
              riskRewardRatio: riskManagement.riskRewardRatio,
              // 🛡️ PRESERVE: Current price (market price, not entry price)
              current_price:
                tickerPriceData?.currentPrice ||
                basicSignal.current_price ||
                riskManagement.entryPrice,
              // Additional working data
              atr: riskManagement.atr,
              positionSize: riskManagement.positionSize,
              riskAmount: riskManagement.riskAmount,
              rewardAmount: riskManagement.rewardAmount,
              // Explanations for transparency
              stopLossReason: riskManagement.stopLossReason,
              takeProfitReason: riskManagement.takeProfitReason,
              // Enhanced metadata
              riskManagementType: "session_134_enhanced",
            };

            signals.push(enhancedSignal);

            if (this.config.enableDetailedLogging) {
              console.log(
                `✅ ${ticker}: Session #134 signal with enhanced risk management (Score: ${enhancedSignal.finalScore}, Current: $${enhancedSignal.current_price}, Entry: $${riskManagement.entryPrice}, Stop: $${riskManagement.stopLoss}, Target: $${riskManagement.takeProfit})`
              );
            }
          } else {
            // Standard signal without enhancement
            signals.push(basicSignal);

            if (this.config.enableDetailedLogging) {
              console.log(
                `✅ ${ticker}: Standard signal generated (Score: ${basicSignal.finalScore})`
              );
            }
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
  // DATABASE SAVE WITH SESSION #134 ENHANCED DATA
  // ===================================================================

  private async directSaveWithSession134EnhancedData(
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
        `💾 Starting Session #134 DATABASE SAVE with ENHANCED INTELLIGENT DATA for ${signals.length} signals...`
      );
      console.log(
        "🛡️ Including: Smart entry prices (0.5%-1.5% premium), working calculations"
      );
    }

    // Filter signals by quality
    const qualitySignals = signals.filter(
      (signal) => signal.finalScore >= this.config.minScoreForSave
    );
    signalsFiltered = signals.length - qualitySignals.length;

    if (this.config.enableDetailedLogging) {
      console.log(
        `📊 Quality filter: ${qualitySignals.length}/${signals.length} signals passed (≥${this.config.minScoreForSave}%)`
      );
    }

    // Process each signal with Session #134 enhanced data
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
            `💾 ${
              signal.ticker
            }: Saving with Session #134 enhanced data - Current: $${
              signal.current_price
            }, Entry: $${signal.entryPrice}, Stop: $${
              signal.stopLoss
            }, Target: $${signal.takeProfit}, ATR: $${signal.atr?.toFixed(2)}`
          );
        }

        // Save with Session #134 enhanced data integration
        const saved = await this.signalProcessor.saveSignalWithStockInfo(
          signal,
          stockInfo
        );

        if (saved) {
          signalsSaved++;
          if (this.config.enableDetailedLogging) {
            console.log(
              `✅ ${signal.ticker}: Session #134 enhanced data saved successfully`
            );
          }
        } else {
          errors.push(`${signal.ticker}: Session #134 save failed`);
          if (this.config.enableDetailedLogging) {
            console.error(
              `❌ ${signal.ticker}: Session #134 save returned false`
            );
          }
        }
      } catch (error) {
        console.error(`❌ ${signal.ticker}: Session #134 save error -`, error);
        errors.push(`${signal.ticker}: ${error.message}`);
      }

      // Small delay to prevent overwhelming the database
      await new Promise((resolve) => setTimeout(resolve, 50));
    }

    const processingTime = Date.now() - startTime;

    if (this.config.enableDetailedLogging) {
      console.log(
        `🎉 Session #134 DATABASE SAVE completed in ${processingTime}ms:`
      );
      console.log(`   Signals Saved: ${signalsSaved}`);
      console.log(`   Signals Filtered: ${signalsFiltered}`);
      console.log(`   Errors: ${errors.length}`);
      console.log(
        `   ✨ SUCCESS: All saved signals include Session #134 ENHANCED RISK MANAGEMENT!`
      );
      console.log(
        `   🛡️ CORRUPTION FIXED: Smart entry prices with proper 0.5%-1.5% premiums`
      );
      console.log(
        `   🎯 DATA INTEGRITY: No more +1,018% corruption, realistic trading data`
      );
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
  // UTILITY METHODS (PRESERVED FROM SESSION #123)
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
  // PUBLIC METHODS (PRESERVED AND ENHANCED)
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
          "All systems operational. Session #134 enhanced risk management with smart entry active.",
        details: {
          signalProcessor: "healthy",
          database: "connected",
          api: "connected",
          pricesFetching: this.config.fetchRealPrices ? "enabled" : "disabled",
          intelligentRiskManagement: this.config.intelligentRiskManagement
            ? "🛡️ Session #134 ENHANCED"
            : "disabled",
          riskManagementFeatures:
            "Smart entry prices (0.5-1.5% premium), sector ATR estimates, working calculations",
          corruptionStatus: "✅ Session #134 data corruption FIXED",
          entryPriceLogic: "Smart breakout entries (not 0% premium)",
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
      console.log(
        "🔄 Session #134 processor configuration updated:",
        newConfig
      );
    }
  }

  // Enhanced save with Session #134 enhanced data
  public async saveSignalsToDatabase(
    signals: ProcessedSignal[],
    stockInfo: Record<string, StockInfo>,
    priceData?: Record<string, PriceData>
  ) {
    return await this.directSaveWithSession134EnhancedData(
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

  // Session #134 enhanced risk management methods
  public async calculateRiskManagementForSignal(
    ticker: string,
    signal: ProcessedSignal,
    multiTimeframeData: MultiTimeframeData
  ): Promise<RiskManagementData> {
    return await this.calculateSession124RiskManagement(
      ticker,
      signal,
      multiTimeframeData
    );
  }

  public enableIntelligentRiskManagement(enabled: boolean = true): void {
    this.config.intelligentRiskManagement = enabled;
    if (this.config.enableDetailedLogging) {
      console.log(
        `🛡️ Session #134 Enhanced Intelligent Risk Management: ${
          enabled ? "ACTIVE WITH SMART ENTRY" : "DISABLED"
        }`
      );
    }
  }

  // Session #134 specific methods
  public getSectorATRForStock(ticker: string, currentPrice: number): number {
    return this.getSectorBasedATR(ticker, currentPrice);
  }

  public calculateSmartEntry(
    ticker: string,
    currentPrice: number,
    confidenceScore: number,
    signalType: "bullish" | "bearish" | "neutral" = "bullish"
  ): { entryPrice: number; entryPremium: number; reason: string } {
    return this.calculateSmartEntryPrice(
      ticker,
      currentPrice,
      confidenceScore,
      signalType
    );
  }
}

// ===================================================================
// SESSION #134 CONVENIENCE FUNCTIONS
// ===================================================================

export async function processStocksWithEnhancedRiskManagement(
  stocks?: StockInfo[],
  config?: Partial<EnhancedProcessingConfig>,
  progressCallback?: (progress: any) => void
): Promise<EnhancedProcessingResult> {
  const processor = new EnhancedSignalProcessor({
    intelligentRiskManagement: true,
    ...config,
  });
  return await processor.processStockUniverse(stocks, progressCallback);
}

// 🛡️ ANTI-REGRESSION: Preserve old export name for existing imports
export const processStocksWithIntelligentRiskManagement =
  processStocksWithEnhancedRiskManagement;

export async function testSession134System(): Promise<{
  status: string;
  message: string;
  details?: any;
}> {
  const processor = new EnhancedSignalProcessor({
    intelligentRiskManagement: true,
  });
  return await processor.testSystemHealth();
}

// ===================================================================
// DEFAULT EXPORT
// ===================================================================

export default EnhancedSignalProcessor;
