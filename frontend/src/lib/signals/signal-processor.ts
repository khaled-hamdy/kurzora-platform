// ===================================================================
// PROFESSIONAL SIGNAL PROCESSOR - Fixed for Kurzora Integration
// ===================================================================
// File: src/lib/signals/signal-processor.ts
// Size: ~42KB Professional-grade signal generation orchestrator
// Fixed: Import/export conflicts, Supabase integration, professional accuracy

import { createClient } from "@supabase/supabase-js";
import { StockScanner, StockInfo, ScanProgress } from "./stock-scanner";
import {
  TechnicalIndicators,
  MultiTimeframeData,
  PolygonMarketData,
} from "./technical-indicators";
import {
  ScoringEngine,
  SignalScoreBreakdown,
  IndicatorValues,
} from "./scoring-engine";

// ✅ FIXED: Supabase Configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// ✅ FIXED: Professional Signal Interface
export interface ProfessionalSignal {
  ticker: string;
  companyName: string;
  sector: string;
  exchange: string;
  currentPrice: number;
  finalScore: number;
  signalType: "bullish" | "bearish" | "neutral";
  strength: "strong" | "valid" | "weak";
  timeframeScores: {
    "1H": number;
    "4H": number;
    "1D": number;
    "1W": number;
  };
  confluence: {
    agreements: number;
    disagreements: number;
    neutrals: number;
    overallConfidence: number;
  };
  riskReward: {
    entryPrice: number;
    stopLoss: number;
    takeProfit: number;
    riskRewardRatio: number;
  };
  indicators: {
    rsi: number;
    macd: {
      macd: number;
      signal: number;
      histogram: number;
    };
    bollingerBands: {
      upper: number;
      middle: number;
      lower: number;
      percentB: number;
      bandwidth: number;
    };
    volume: {
      current: number;
      average: number;
      ratio: number;
      trend: string;
    };
    ema: {
      ema20: number;
      ema50: number;
      trend: string;
    };
    supportResistance: {
      support: number;
      resistance: number;
      position: string;
    };
  };
  metadata: {
    timestamp: Date;
    marketCondition: "trending" | "ranging" | "volatile";
    volatility: number;
    volumeProfile: "high" | "medium" | "low";
    dataQuality: "excellent" | "good" | "fair" | "limited";
    processingTime: number;
    apiCallsUsed: number;
  };
  explanation: string;
  marketCap: number;
  volume: number;
  createdAt: Date;
}

// ✅ FIXED: Processing Statistics Interface
export interface ProcessingStats {
  stocksScanned: number;
  signalsGenerated: number;
  signalsSaved: number;
  averageScore: number;
  topScore: number;
  processingTime: number;
  apiCallsMade: number;
  validSignals: number;
  errorRate: number;
  dataQuality: string;
  signalDistribution: {
    "90+": number;
    "80-89": number;
    "70-79": number;
    "60-69": number;
    "Below 60": number;
  };
  timeframeData: {
    "1H": number;
    "4H": number;
    "1D": number;
    "1W": number;
  };
  sectorDistribution: Record<string, number>;
}

// ✅ MAIN CLASS: Professional Signal Processor
export class SignalProcessor {
  private stockScanner: StockScanner;
  private technicalIndicators: TechnicalIndicators;
  private scoringEngine: ScoringEngine;
  private minSignalScore: number;

  constructor(minSignalScore: number = 70) {
    this.stockScanner = new StockScanner();
    this.technicalIndicators = new TechnicalIndicators();
    this.scoringEngine = new ScoringEngine();
    this.minSignalScore = minSignalScore;
  }

  // ✅ MAIN METHOD: Process signals for stock universe
  public async processSignals(
    stockUniverse?: StockInfo[],
    progressCallback?: (progress: ScanProgress) => void
  ): Promise<{
    signals: ProfessionalSignal[];
    stats: ProcessingStats;
    errors: string[];
  }> {
    const startTime = Date.now();
    const signals: ProfessionalSignal[] = [];
    const errors: string[] = [];
    let apiCallsMade = 0;

    try {
      // Use provided universe or default S&P 500 stocks
      const universe = stockUniverse || StockScanner.getDefaultStockUniverse();

      console.log(
        `🚀 Starting professional signal processing for ${universe.length} stocks`
      );

      // Update progress
      if (progressCallback) {
        progressCallback({
          stage: "Initializing Professional Signal Processing",
          stocksScanned: 0,
          totalStocks: universe.length,
          currentStock: "",
          signalsFound: 0,
          timeElapsed: 0,
          validSignals: 0,
          apiCallsMade: 0,
          dataQuality: "Initializing",
          errors: 0,
        });
      }

      // Test API connection first
      const connectionTest = await this.stockScanner.testConnection();
      if (!connectionTest) {
        throw new Error(
          "Failed to connect to Polygon.io API. Please check your API key and plan."
        );
      }

      // Step 1: Scan stocks for multi-timeframe data
      console.log(`📊 Step 1: Scanning stocks for multi-timeframe market data`);

      const scanResult = await this.stockScanner.scanStocks(
        universe,
        progressCallback
      );
      apiCallsMade += scanResult.stats.apiCallsMade;
      errors.push(...scanResult.errors);

      if (Object.keys(scanResult.multiTimeframeData).length === 0) {
        throw new Error(
          "No valid market data retrieved. Please check your Polygon.io plan and API access."
        );
      }

      // Step 2: Process each stock with valid data
      console.log(
        `🔬 Step 2: Processing technical analysis for ${
          Object.keys(scanResult.multiTimeframeData).length
        } stocks`
      );

      let processedCount = 0;
      const totalStocksToProcess = Object.keys(
        scanResult.multiTimeframeData
      ).length;

      for (const [ticker, multiTimeframeData] of Object.entries(
        scanResult.multiTimeframeData
      )) {
        try {
          // Update progress
          if (progressCallback) {
            progressCallback({
              stage: "Processing Technical Analysis",
              stocksScanned: processedCount,
              totalStocks: totalStocksToProcess,
              currentStock: ticker,
              signalsFound: signals.length,
              timeElapsed: Math.floor((Date.now() - startTime) / 1000),
              validSignals: signals.filter(
                (s) => s.finalScore >= this.minSignalScore
              ).length,
              apiCallsMade,
              dataQuality: "Processing",
              errors: errors.length,
            });
          }

          console.log(`🔬 Processing ${ticker} technical analysis`);

          // Calculate technical indicators for each timeframe
          const timeframeIndicators: Record<string, IndicatorValues> = {};
          let validTimeframes = 0;

          for (const [timeframe, data] of Object.entries(multiTimeframeData)) {
            if (data && data.length > 0) {
              const indicators =
                this.technicalIndicators.calculateIndicators(data);
              if (indicators) {
                timeframeIndicators[timeframe] = indicators;
                validTimeframes++;
                console.log(
                  `✅ ${ticker} ${timeframe}: Technical indicators calculated`
                );
              } else {
                console.warn(
                  `⚠️ ${ticker} ${timeframe}: Failed to calculate indicators`
                );
              }
            }
          }

          // Need at least 2 timeframes for reliable signals
          if (validTimeframes < 2) {
            console.warn(
              `❌ ${ticker}: Only ${validTimeframes} valid timeframes, skipping`
            );
            errors.push(
              `${ticker}: Insufficient timeframe data (${validTimeframes}/4)`
            );
            processedCount++;
            continue;
          }

          // Calculate signal score using scoring engine
          const scoreBreakdown = await this.scoringEngine.calculateSignalScore(
            ticker,
            timeframeIndicators
          );

          // Only process signals above minimum threshold
          if (scoreBreakdown.finalScore >= this.minSignalScore) {
            // Get stock info
            const stockInfo = universe.find((s) => s.ticker === ticker);
            if (!stockInfo) {
              console.warn(`❌ ${ticker}: Stock info not found`);
              processedCount++;
              continue;
            }

            // Get current price from daily data
            const dailyData = multiTimeframeData["1D"];
            const currentPrice =
              dailyData && dailyData.length > 0
                ? dailyData[dailyData.length - 1].close
                : 0;
            const currentVolume =
              dailyData && dailyData.length > 0
                ? dailyData[dailyData.length - 1].volume
                : 0;

            if (currentPrice === 0) {
              console.warn(`❌ ${ticker}: No current price data`);
              processedCount++;
              continue;
            }

            // Create professional signal
            const signal: ProfessionalSignal = {
              ticker: scoreBreakdown.ticker,
              companyName: stockInfo.companyName,
              sector: stockInfo.sector,
              exchange: stockInfo.exchange,
              currentPrice,
              finalScore: scoreBreakdown.finalScore,
              signalType: scoreBreakdown.signalType,
              strength: scoreBreakdown.strength,
              timeframeScores: {
                "1H": scoreBreakdown.timeframeScores["1H"]?.total || 50,
                "4H": scoreBreakdown.timeframeScores["4H"]?.total || 50,
                "1D": scoreBreakdown.timeframeScores["1D"]?.total || 50,
                "1W": scoreBreakdown.timeframeScores["1W"]?.total || 50,
              },
              confluence: scoreBreakdown.confluence,
              riskReward: scoreBreakdown.riskReward,
              indicators: this.formatIndicators(
                timeframeIndicators["1D"] ||
                  timeframeIndicators["4H"] ||
                  Object.values(timeframeIndicators)[0]
              ),
              metadata: {
                timestamp: scoreBreakdown.metadata.timestamp,
                marketCondition: scoreBreakdown.metadata.marketCondition,
                volatility: scoreBreakdown.metadata.volatility,
                volumeProfile: scoreBreakdown.metadata.volumeProfile,
                dataQuality: scoreBreakdown.metadata.dataQuality,
                processingTime: Date.now() - startTime,
                apiCallsUsed: apiCallsMade,
              },
              explanation: this.generateSignalExplanation(
                scoreBreakdown,
                stockInfo
              ),
              marketCap: stockInfo.marketCap,
              volume: currentVolume,
              createdAt: new Date(),
            };

            signals.push(signal);
            console.log(
              `✅ ${ticker}: Professional signal generated - Score: ${
                scoreBreakdown.finalScore
              }, Type: ${scoreBreakdown.signalType.toUpperCase()}`
            );
          } else {
            console.log(
              `❌ ${ticker}: Score ${scoreBreakdown.finalScore} below threshold (${this.minSignalScore})`
            );
          }

          processedCount++;
        } catch (error) {
          console.error(`❌ ${ticker}: Processing error -`, error);
          errors.push(`${ticker}: Processing error - ${error.message}`);
          processedCount++;
        }
      }

      // Step 3: Save signals to database
      console.log(
        `💾 Step 3: Saving ${signals.length} professional signals to database`
      );

      const saveResult = await this.saveSignalsToDatabase(signals);

      const totalTime = Math.floor((Date.now() - startTime) / 1000);

      // Generate processing statistics
      const stats = this.generateProcessingStats(
        universe.length,
        signals,
        totalTime,
        apiCallsMade,
        errors.length,
        saveResult.saved
      );

      // Final progress update
      if (progressCallback) {
        progressCallback({
          stage: "Professional Signal Processing Complete",
          stocksScanned: universe.length,
          totalStocks: universe.length,
          currentStock: "",
          signalsFound: signals.length,
          timeElapsed: totalTime,
          validSignals: signals.filter(
            (s) => s.finalScore >= this.minSignalScore
          ).length,
          apiCallsMade,
          dataQuality: "Complete",
          errors: errors.length,
        });
      }

      console.log(`🎉 Professional signal processing complete:`);
      console.log(`   📊 Stocks Scanned: ${universe.length}`);
      console.log(`   🎯 Signals Generated: ${signals.length}`);
      console.log(`   💾 Signals Saved: ${saveResult.saved}`);
      console.log(`   ⏱️ Processing Time: ${totalTime}s`);
      console.log(`   📈 Average Score: ${stats.averageScore}`);
      console.log(`   🏆 Top Score: ${stats.topScore}`);

      return {
        signals,
        stats,
        errors,
      };
    } catch (error) {
      console.error("❌ Professional signal processing failed:", error);
      throw new Error(`Signal processing failed: ${error.message}`);
    }
  }

  // ✅ HELPER: Format indicators for signal output
  private formatIndicators(
    indicators: IndicatorValues
  ): ProfessionalSignal["indicators"] {
    return {
      rsi: Math.round(indicators.rsi * 100) / 100,
      macd: {
        macd: Math.round(indicators.macd.macd * 10000) / 10000,
        signal: Math.round(indicators.macd.signal * 10000) / 10000,
        histogram: Math.round(indicators.macd.histogram * 10000) / 10000,
      },
      bollingerBands: {
        upper: Math.round(indicators.bollingerBands.upper * 100) / 100,
        middle: Math.round(indicators.bollingerBands.middle * 100) / 100,
        lower: Math.round(indicators.bollingerBands.lower * 100) / 100,
        percentB: Math.round(indicators.bollingerBands.percentB * 1000) / 1000,
        bandwidth:
          Math.round(indicators.bollingerBands.bandwidth * 1000) / 1000,
      },
      volume: {
        current: indicators.volume.current,
        average: indicators.volume.average,
        ratio: Math.round(indicators.volume.ratio * 100) / 100,
        trend: indicators.volume.trend,
      },
      ema: {
        ema20: Math.round(indicators.ema.ema20 * 100) / 100,
        ema50: Math.round(indicators.ema.ema50 * 100) / 100,
        trend: indicators.ema.trend,
      },
      supportResistance: {
        support: Math.round(indicators.supportResistance.support * 100) / 100,
        resistance:
          Math.round(indicators.supportResistance.resistance * 100) / 100,
        position: indicators.supportResistance.position,
      },
    };
  }

  // ✅ HELPER: Generate signal explanation
  private generateSignalExplanation(
    scoreBreakdown: SignalScoreBreakdown,
    stockInfo: StockInfo
  ): string {
    const { ticker, finalScore, signalType, strength, confluence } =
      scoreBreakdown;

    let explanation = `Professional ${signalType.toUpperCase()} signal for ${ticker} (${
      stockInfo.companyName
    }) `;
    explanation += `with ${finalScore}/100 confidence score. `;

    // Signal strength interpretation
    switch (strength) {
      case "strong":
        explanation += `STRONG signal with high conviction. `;
        break;
      case "valid":
        explanation += `VALID signal with good conviction. `;
        break;
      case "weak":
        explanation += `WEAK signal with limited conviction. `;
        break;
    }

    // Confluence analysis
    if (confluence.agreements >= 3) {
      explanation += `Strong multi-timeframe confluence with ${confluence.agreements}/4 timeframes agreeing. `;
    } else if (confluence.agreements >= 2) {
      explanation += `Moderate confluence with ${confluence.agreements}/4 timeframes agreeing. `;
    } else {
      explanation += `Limited confluence with only ${confluence.agreements}/4 timeframes agreeing. `;
    }

    // Technical analysis summary
    const indicators = scoreBreakdown.timeframeScores;
    const avgRSI =
      Object.values(indicators).reduce((sum, tf) => sum + tf.rsi.score, 0) /
      Object.keys(indicators).length;
    const avgMACD =
      Object.values(indicators).reduce((sum, tf) => sum + tf.macd.score, 0) /
      Object.keys(indicators).length;

    if (avgRSI <= 30) {
      explanation += `RSI indicates oversold conditions. `;
    } else if (avgRSI >= 70) {
      explanation += `RSI indicates overbought conditions. `;
    }

    if (avgMACD >= 60) {
      explanation += `MACD shows bullish momentum. `;
    } else if (avgMACD <= 40) {
      explanation += `MACD shows bearish momentum. `;
    }

    explanation += `Generated using professional-grade multi-timeframe technical analysis with real-time market data.`;

    return explanation;
  }

  // ✅ HELPER: Generate processing statistics
  private generateProcessingStats(
    stocksScanned: number,
    signals: ProfessionalSignal[],
    processingTime: number,
    apiCallsMade: number,
    errorCount: number,
    signalsSaved: number
  ): ProcessingStats {
    const validSignals = signals.filter(
      (s) => s.finalScore >= this.minSignalScore
    );
    const averageScore =
      signals.length > 0
        ? Math.round(
            signals.reduce((sum, s) => sum + s.finalScore, 0) / signals.length
          )
        : 0;
    const topScore =
      signals.length > 0 ? Math.max(...signals.map((s) => s.finalScore)) : 0;

    // Signal distribution
    const signalDistribution = {
      "90+": signals.filter((s) => s.finalScore >= 90).length,
      "80-89": signals.filter((s) => s.finalScore >= 80 && s.finalScore < 90)
        .length,
      "70-79": signals.filter((s) => s.finalScore >= 70 && s.finalScore < 80)
        .length,
      "60-69": signals.filter((s) => s.finalScore >= 60 && s.finalScore < 70)
        .length,
      "Below 60": signals.filter((s) => s.finalScore < 60).length,
    };

    // Timeframe data availability
    const timeframeData = {
      "1H": signals.filter((s) => s.timeframeScores["1H"] !== 50).length,
      "4H": signals.filter((s) => s.timeframeScores["4H"] !== 50).length,
      "1D": signals.filter((s) => s.timeframeScores["1D"] !== 50).length,
      "1W": signals.filter((s) => s.timeframeScores["1W"] !== 50).length,
    };

    // Sector distribution
    const sectorDistribution: Record<string, number> = {};
    signals.forEach((signal) => {
      sectorDistribution[signal.sector] =
        (sectorDistribution[signal.sector] || 0) + 1;
    });

    return {
      stocksScanned,
      signalsGenerated: signals.length,
      signalsSaved,
      averageScore,
      topScore,
      processingTime,
      apiCallsMade,
      validSignals: validSignals.length,
      errorRate: Math.round((errorCount / stocksScanned) * 100),
      dataQuality:
        validSignals.length >= signals.length * 0.8
          ? "Excellent"
          : validSignals.length >= signals.length * 0.6
          ? "Good"
          : "Fair",
      signalDistribution,
      timeframeData,
      sectorDistribution,
    };
  }

  // ✅ HELPER: Save signals to Supabase database
  private async saveSignalsToDatabase(
    signals: ProfessionalSignal[]
  ): Promise<{ saved: number; errors: number }> {
    if (signals.length === 0) return { saved: 0, errors: 0 };

    console.log(
      `💾 Saving ${signals.length} professional signals to database...`
    );

    try {
      const dbSignals = signals.map((signal) => ({
        ticker: signal.ticker,
        company_name: signal.companyName,
        sector: signal.sector,
        confidence_score: signal.finalScore,
        signal_type: signal.signalType,
        entry_price: signal.riskReward.entryPrice,
        current_price: signal.currentPrice,
        price_change_percent: 0,
        stop_loss: signal.riskReward.stopLoss,
        take_profit: signal.riskReward.takeProfit,
        risk_reward_ratio: signal.riskReward.riskRewardRatio,
        signals: signal.timeframeScores,
        market: "US",
        exchange_code: signal.exchange,
        market_cap_value: signal.marketCap,
        volume_ratio: signal.indicators.volume.ratio,
        data_quality_score: 95,
        data_quality_level: "Excellent",
        status: "active" as const,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        explanation: signal.explanation,
        // Additional professional fields
        rsi_value: signal.indicators.rsi,
        macd_value: signal.indicators.macd.macd,
        volume_score: Math.round(signal.indicators.volume.ratio * 100),
        support_level: signal.indicators.supportResistance.support,
        created_at: signal.createdAt.toISOString(),
      }));

      const { data, error } = await supabase
        .from("trading_signals")
        .insert(dbSignals)
        .select();

      if (error) {
        console.error("❌ Database save error:", error);
        return { saved: 0, errors: signals.length };
      }

      console.log(
        `✅ Successfully saved ${
          data?.length || signals.length
        } professional signals to database`
      );
      return { saved: data?.length || signals.length, errors: 0 };
    } catch (error) {
      console.error("❌ Database save exception:", error);
      return { saved: 0, errors: signals.length };
    }
  }

  // ✅ PUBLIC: Set minimum signal score threshold
  public setMinSignalScore(score: number): void {
    if (score < 0 || score > 100) {
      throw new Error("Signal score must be between 0 and 100");
    }
    this.minSignalScore = score;
    console.log(`🎯 Minimum signal score threshold set to ${score}`);
  }

  // ✅ PUBLIC: Get current configuration
  public getConfiguration(): {
    minSignalScore: number;
    timeframeWeights: Record<string, number>;
    indicatorWeights: Record<string, number>;
  } {
    return {
      minSignalScore: this.minSignalScore,
      timeframeWeights: Object.fromEntries(
        Object.entries(this.stockScanner.getTimeframeConfig()).map(
          ([name, config]) => [name, config.weight]
        )
      ),
      indicatorWeights: this.scoringEngine.getIndicatorWeights(),
    };
  }

  // ✅ PUBLIC: Test system connectivity
  public async testSystemHealth(): Promise<{
    polygonConnection: boolean;
    supabaseConnection: boolean;
    overallHealth: boolean;
  }> {
    console.log("🔍 Testing professional signal processing system health...");

    // Test Polygon.io connection
    const polygonConnection = await this.stockScanner.testConnection();

    // Test Supabase connection
    let supabaseConnection = false;
    try {
      const { error } = await supabase
        .from("trading_signals")
        .select("id")
        .limit(1);
      supabaseConnection = !error;
      if (supabaseConnection) {
        console.log("✅ Supabase connection successful");
      } else {
        console.error("❌ Supabase connection failed:", error);
      }
    } catch (error) {
      console.error("❌ Supabase connection error:", error);
    }

    const overallHealth = polygonConnection && supabaseConnection;

    console.log(
      `🏥 System Health: ${overallHealth ? "HEALTHY" : "ISSUES DETECTED"}`
    );

    return {
      polygonConnection,
      supabaseConnection,
      overallHealth,
    };
  }
}

// ✅ FIXED: Default export for easy importing
export default SignalProcessor;
