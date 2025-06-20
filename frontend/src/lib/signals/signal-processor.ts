// Signal Processor - Master Signal Generation System
// File: src/lib/signals/signal-processor.ts

import { stockScanner, StockData } from "./stock-scanner";
import { TechnicalIndicators, PriceData } from "./technical-indicators";
import { scoringEngine, FinalSignalScore } from "./scoring-engine";
import { supabase } from "../supabase";

export interface ProcessedSignal {
  id: string;
  ticker: string;
  companyName: string;
  sector: string;
  market: string;
  confidenceScore: number;
  signalStrength: string;
  entryPrice: number;
  currentPrice: number;
  priceChangePercent: number;
  stopLoss: number;
  takeProfit: number;
  riskRewardRatio: number;
  timeframeScores: Record<string, number>;
  explanation: string;
  status: "active";
  expiresAt: string;
  createdAt: string;
}

export interface SignalGenerationOptions {
  maxSignals?: number;
  minScore?: number;
  sectors?: string[];
  markets?: string[];
  timeframes?: string[];
}

export class SignalProcessor {
  private isProcessing = false;
  private lastProcessTime: Date | null = null;

  // Generate historical price data for technical analysis (mock data for demo)
  private generateHistoricalData(
    stockData: StockData,
    timeframe: string,
    periods: number = 100
  ): PriceData[] {
    const data: PriceData[] = [];
    const currentPrice = stockData.price;
    const currentVolume = stockData.volume;

    // Calculate time intervals based on timeframe
    let intervalMs: number;
    switch (timeframe) {
      case "1H":
        intervalMs = 60 * 60 * 1000;
        break;
      case "4H":
        intervalMs = 4 * 60 * 60 * 1000;
        break;
      case "1D":
        intervalMs = 24 * 60 * 60 * 1000;
        break;
      case "1W":
        intervalMs = 7 * 24 * 60 * 60 * 1000;
        break;
      default:
        intervalMs = 60 * 60 * 1000;
    }

    // Generate mock historical data with realistic price movements
    let price = currentPrice * 0.9; // Start 10% below current
    const baseVolume = currentVolume * 0.8;

    for (let i = 0; i < periods; i++) {
      const timestamp = new Date(Date.now() - (periods - i) * intervalMs);

      // Generate realistic OHLC data
      const volatility = 0.02; // 2% volatility
      const trend = (currentPrice - price) / periods; // Gradual trend toward current price

      const change = (Math.random() - 0.5) * volatility + trend;
      const open = price;
      const close = price * (1 + change);

      // Generate high/low with some randomness
      const range = Math.abs(close - open) * (1 + Math.random());
      const high = Math.max(open, close) + range * Math.random();
      const low = Math.min(open, close) - range * Math.random();

      // Generate volume with some spikes
      const volumeMultiplier = 0.5 + Math.random() * 1.5; // 0.5x to 2x base volume
      const volume = Math.round(baseVolume * volumeMultiplier);

      data.push({
        timestamp,
        open: Math.round(open * 100) / 100,
        high: Math.round(high * 100) / 100,
        low: Math.round(low * 100) / 100,
        close: Math.round(close * 100) / 100,
        volume,
      });

      price = close;
    }

    return data;
  }

  // Fetch real historical data from Polygon.io (for production)
  private async fetchPolygonHistoricalData(
    ticker: string,
    timeframe: string,
    periods: number = 100
  ): Promise<PriceData[]> {
    try {
      const apiKey = import.meta.env.VITE_POLYGON_API_KEY;
      if (!apiKey) {
        console.warn("⚠️ Polygon API key not found, using mock data");
        return [];
      }

      // Convert timeframe to Polygon format
      let multiplier = 1;
      let timespan = "hour";

      switch (timeframe) {
        case "1H":
          multiplier = 1;
          timespan = "hour";
          break;
        case "4H":
          multiplier = 4;
          timespan = "hour";
          break;
        case "1D":
          multiplier = 1;
          timespan = "day";
          break;
        case "1W":
          multiplier = 1;
          timespan = "week";
          break;
      }

      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - periods * multiplier);

      const fromDate = startDate.toISOString().split("T")[0];
      const toDate = endDate.toISOString().split("T")[0];

      const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/${multiplier}/${timespan}/${fromDate}/${toDate}?adjusted=true&sort=asc&apikey=${apiKey}`;

      console.log(`📈 Fetching ${timeframe} data for ${ticker}...`);

      const response = await fetch(url);
      if (!response.ok) {
        console.warn(`⚠️ Polygon API error for ${ticker}: ${response.status}`);
        return [];
      }

      const data = await response.json();

      if (!data.results || data.results.length === 0) {
        console.warn(`⚠️ No historical data for ${ticker}`);
        return [];
      }

      return data.results.map((candle: any) => ({
        timestamp: new Date(candle.t),
        open: candle.o,
        high: candle.h,
        low: candle.l,
        close: candle.c,
        volume: candle.v,
      }));
    } catch (error) {
      console.error(`❌ Error fetching historical data for ${ticker}:`, error);
      return [];
    }
  }

  // Get multi-timeframe data for a stock
  private async getMultiTimeframeData(
    stockData: StockData
  ): Promise<Record<string, PriceData[]>> {
    const timeframes = ["1H", "4H", "1D", "1W"];
    const multiTimeframeData: Record<string, PriceData[]> = {};

    console.log(`📊 Gathering multi-timeframe data for ${stockData.ticker}...`);

    for (const timeframe of timeframes) {
      try {
        // Try to get real data from Polygon.io first
        let data = await this.fetchPolygonHistoricalData(
          stockData.ticker,
          timeframe
        );

        // Fallback to mock data if Polygon.io fails
        if (data.length === 0) {
          console.log(
            `📝 Using mock data for ${stockData.ticker} ${timeframe}`
          );
          data = this.generateHistoricalData(stockData, timeframe);
        }

        if (data.length > 0) {
          multiTimeframeData[timeframe] = data;
          console.log(
            `✅ ${timeframe}: ${data.length} candles for ${stockData.ticker}`
          );
        }

        // Rate limiting - wait between API calls
        await new Promise((resolve) => setTimeout(resolve, 200));
      } catch (error) {
        console.error(
          `❌ Error getting ${timeframe} data for ${stockData.ticker}:`,
          error
        );

        // Fallback to mock data
        const mockData = this.generateHistoricalData(stockData, timeframe);
        if (mockData.length > 0) {
          multiTimeframeData[timeframe] = mockData;
        }
      }
    }

    return multiTimeframeData;
  }

  // Generate AI explanation for the signal
  private generateSignalExplanation(signal: FinalSignalScore): string {
    const { ticker, finalScore, signalStrength, timeframeScores } = signal;

    let explanation = `${ticker} shows a ${signalStrength} signal (${finalScore}/100). `;

    // Add timeframe analysis
    const tf1H = timeframeScores["1H"]?.compositeScore || 0;
    const tf4H = timeframeScores["4H"]?.compositeScore || 0;
    const tf1D = timeframeScores["1D"]?.compositeScore || 0;

    if (finalScore >= 80) {
      explanation += `Strong bullish momentum detected across multiple timeframes. `;
      explanation += `Short-term (1H: ${tf1H}) and medium-term (4H: ${tf4H}) indicators align bullishly. `;
    } else if (finalScore >= 60) {
      explanation += `Moderate bullish bias with good risk/reward potential. `;
      explanation += `Key technical levels support upward movement. `;
    } else if (finalScore <= 20) {
      explanation += `Strong bearish pressure across timeframes. `;
      explanation += `Multiple indicators suggest downward momentum. `;
    } else if (finalScore <= 40) {
      explanation += `Bearish bias with potential for further weakness. `;
      explanation += `Risk management crucial for any positions. `;
    } else {
      explanation += `Mixed signals across timeframes suggest consolidation. `;
      explanation += `Wait for clearer directional bias. `;
    }

    // Add specific indicator insights
    const rsiBreakdown = Object.values(timeframeScores)[0]?.breakdown?.rsi;
    const macdBreakdown = Object.values(timeframeScores)[0]?.breakdown?.macd;

    if (rsiBreakdown && rsiBreakdown.score >= 80) {
      explanation += `RSI indicates oversold conditions. `;
    } else if (rsiBreakdown && rsiBreakdown.score <= 20) {
      explanation += `RSI shows overbought levels. `;
    }

    if (macdBreakdown && macdBreakdown.reason.includes("CROSSOVER")) {
      explanation += `MACD crossover detected - significant momentum shift. `;
    }

    explanation += `Entry: $${signal.entryPrice}, Stop: $${signal.stopLoss}, Target: $${signal.takeProfit} (${signal.riskRewardRatio}:1 R/R).`;

    return explanation;
  }

  // Save signal to Supabase database
  private async saveSignalToDatabase(
    processedSignal: ProcessedSignal
  ): Promise<boolean> {
    try {
      const { error } = await supabase.from("trading_signals").insert({
        ticker: processedSignal.ticker,
        company_name: processedSignal.companyName,
        sector: processedSignal.sector,
        market: processedSignal.market,
        confidence_score: processedSignal.confidenceScore,
        entry_price: processedSignal.entryPrice,
        current_price: processedSignal.currentPrice,
        price_change_percent: processedSignal.priceChangePercent,
        stop_loss: processedSignal.stopLoss,
        take_profit: processedSignal.takeProfit,
        risk_reward_ratio: processedSignal.riskRewardRatio,
        signals: processedSignal.timeframeScores, // JSON field
        explanation: processedSignal.explanation,
        status: processedSignal.status,
        expires_at: processedSignal.expiresAt,
        created_at: processedSignal.createdAt,
      });

      if (error) {
        console.error("❌ Database insert error:", error);
        return false;
      }

      console.log(
        `✅ Signal saved: ${processedSignal.ticker} (${processedSignal.confidenceScore})`
      );
      return true;
    } catch (error) {
      console.error("❌ Error saving signal to database:", error);
      return false;
    }
  }

  // Process a single stock and generate signal
  private async processStock(
    stockData: StockData
  ): Promise<ProcessedSignal | null> {
    try {
      console.log(`🔍 Processing ${stockData.ticker}...`);

      // Get multi-timeframe data
      const multiTimeframeData = await this.getMultiTimeframeData(stockData);

      if (Object.keys(multiTimeframeData).length === 0) {
        console.warn(`⚠️ No valid timeframe data for ${stockData.ticker}`);
        return null;
      }

      // Calculate final signal score
      const signalScore = scoringEngine.calculateFinalScore(
        stockData.ticker,
        multiTimeframeData
      );

      if (!signalScore) {
        console.warn(`⚠️ Could not calculate score for ${stockData.ticker}`);
        return null;
      }

      // Convert to database format
      const processedSignal: ProcessedSignal = {
        id: `${stockData.ticker}-${Date.now()}`,
        ticker: stockData.ticker,
        companyName: stockData.companyName,
        sector: stockData.sector,
        market: stockData.market,
        confidenceScore: signalScore.finalScore,
        signalStrength: signalScore.signalStrength,
        entryPrice: signalScore.entryPrice,
        currentPrice: stockData.price,
        priceChangePercent: stockData.changePercent,
        stopLoss: signalScore.stopLoss,
        takeProfit: signalScore.takeProfit,
        riskRewardRatio: signalScore.riskRewardRatio,
        timeframeScores: Object.fromEntries(
          Object.entries(signalScore.timeframeScores).map(([tf, data]) => [
            tf,
            data.compositeScore,
          ])
        ),
        explanation: this.generateSignalExplanation(signalScore),
        status: "active",
        expiresAt: signalScore.expiresAt.toISOString(),
        createdAt: new Date().toISOString(),
      };

      console.log(
        `🎯 Generated signal: ${stockData.ticker} = ${signalScore.finalScore}/100 (${signalScore.signalStrength})`
      );

      return processedSignal;
    } catch (error) {
      console.error(`❌ Error processing ${stockData.ticker}:`, error);
      return null;
    }
  }

  // Main signal generation function
  public async generateSignals(
    options: SignalGenerationOptions = {}
  ): Promise<ProcessedSignal[]> {
    if (this.isProcessing) {
      console.warn("⚠️ Signal generation already in progress");
      return [];
    }

    try {
      this.isProcessing = true;
      console.log("🚀 Starting signal generation process...");

      const {
        maxSignals = 50,
        minScore = 60,
        sectors = [],
        markets = ["USA"],
        timeframes = ["1H", "4H", "1D", "1W"],
      } = options;

      // Step 1: Get active stocks to scan
      console.log("📊 Step 1: Fetching active stocks...");
      const tickers = await stockScanner.getActiveStocks(200); // Get more than needed

      if (tickers.length === 0) {
        console.error("❌ No active stocks found");
        return [];
      }

      console.log(`✅ Found ${tickers.length} active stocks to scan`);

      // Step 2: Scan stocks for market data
      console.log("📈 Step 2: Scanning market data...");
      const stockDataArray = await stockScanner.scanStocks(tickers, 5); // Process in batches of 5

      if (stockDataArray.length === 0) {
        console.error("❌ No market data retrieved");
        return [];
      }

      console.log(
        `✅ Retrieved market data for ${stockDataArray.length} stocks`
      );

      // Step 3: Filter stocks by criteria
      let filteredStocks = stockDataArray;

      if (sectors.length > 0) {
        filteredStocks = filteredStocks.filter((stock) =>
          sectors.includes(stock.sector)
        );
      }

      if (markets.length > 0) {
        filteredStocks = filteredStocks.filter((stock) =>
          markets.includes(stock.market)
        );
      }

      console.log(
        `📋 Filtered to ${filteredStocks.length} stocks meeting criteria`
      );

      // Step 4: Process stocks and generate signals
      console.log("🎯 Step 3: Generating signals...");
      const signals: ProcessedSignal[] = [];
      const batchSize = 3; // Process 3 stocks at a time to avoid overwhelming APIs

      for (
        let i = 0;
        i < filteredStocks.length && signals.length < maxSignals;
        i += batchSize
      ) {
        const batch = filteredStocks.slice(i, i + batchSize);
        console.log(
          `📦 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(
            filteredStocks.length / batchSize
          )}`
        );

        // Process batch
        const batchPromises = batch.map((stock) => this.processStock(stock));
        const batchResults = await Promise.all(batchPromises);

        // Filter valid signals that meet minimum score
        const validSignals = batchResults
          .filter((signal): signal is ProcessedSignal => signal !== null)
          .filter((signal) => signal.confidenceScore >= minScore);

        signals.push(...validSignals);

        console.log(
          `✅ Batch complete: ${validSignals.length} valid signals generated`
        );

        // Rate limiting between batches
        if (i + batchSize < filteredStocks.length) {
          await new Promise((resolve) => setTimeout(resolve, 2000)); // 2-second pause
        }
      }

      // Step 5: Sort by score and limit results
      signals.sort((a, b) => b.confidenceScore - a.confidenceScore);
      const finalSignals = signals.slice(0, maxSignals);

      // Step 6: Save to database
      console.log("💾 Step 4: Saving signals to database...");
      let savedCount = 0;

      for (const signal of finalSignals) {
        const saved = await this.saveSignalToDatabase(signal);
        if (saved) savedCount++;

        // Small delay between database writes
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      this.lastProcessTime = new Date();

      console.log(`🎉 Signal generation complete!`);
      console.log(
        `📊 Results: ${finalSignals.length} signals generated, ${savedCount} saved to database`
      );
      console.log(
        `📈 Top signals: ${finalSignals
          .slice(0, 5)
          .map((s) => `${s.ticker}(${s.confidenceScore})`)
          .join(", ")}`
      );

      return finalSignals;
    } catch (error) {
      console.error("❌ Error in signal generation:", error);
      return [];
    } finally {
      this.isProcessing = false;
    }
  }

  // Test the signal processor with a small sample
  public async testSignalGeneration(): Promise<boolean> {
    try {
      console.log("🧪 Testing signal generation system...");

      const testOptions: SignalGenerationOptions = {
        maxSignals: 5,
        minScore: 50,
      };

      const signals = await this.generateSignals(testOptions);

      if (signals.length > 0) {
        console.log("✅ Signal generation test passed!");
        console.log(`📊 Generated ${signals.length} test signals`);
        console.log(
          "🎯 Sample signals:",
          signals.map((s) => `${s.ticker}: ${s.confidenceScore}/100`)
        );
        return true;
      } else {
        console.warn(
          "⚠️ Signal generation test completed but no signals generated"
        );
        return false;
      }
    } catch (error) {
      console.error("❌ Signal generation test failed:", error);
      return false;
    }
  }

  // Get processing status
  public getStatus() {
    return {
      isProcessing: this.isProcessing,
      lastProcessTime: this.lastProcessTime,
    };
  }
}

// Export singleton instance
export const signalProcessor = new SignalProcessor();
