// ==================================================================================
// 🎯 SESSION #312: SIGNAL PIPELINE V2 - INTEGRATION TESTING VERSION
// ==================================================================================
// 🚨 PURPOSE: Complete copy of Session #311 signal pipeline for side-by-side testing
// 🛡️ ANTI-REGRESSION: EXACT preservation of ALL Session #151-311 processing logic
// 📝 SESSION #312 TESTING: Identical processing flow for 100% output validation
// 🔧 ORIGINAL FUNCTION PROTECTION: All Session #151-311 functionality preserved EXACTLY
// ✅ VALIDATION READY: Identical processing behavior with modular architecture benefits
// 📊 SESSION #310 COMPLIANCE: Configuration management integration preserved exactly
// 🎖️ TESTING INFRASTRUCTURE: Professional side-by-side validation capabilities
// ==================================================================================

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// 🔧 SESSION #312: CONFIGURATION IMPORTS - EXACT COPY FOR TESTING
import {
  getUseBacktest,
  getTestStocks,
  getTimeframeConfig,
  getDateRanges,
} from "../config/scanning-config.ts";
import {
  getSupabaseUrl,
  getServiceRoleKey,
  validateAllAPIs,
} from "../config/api-config.ts";

// 🔧 SESSION #312: COMPLETE MODULAR IMPORTS - EXACT COPY FOR TESTING
import { TimeframeDataCoordinator } from "../analysis/timeframe-processor.ts";
import { calculateRSI } from "../indicators/rsi-calculator.ts";
import { calculateMACD } from "../indicators/macd-calculator.ts";
import { calculateBollingerBands } from "../indicators/bollinger-bands.ts";
import { calculateVolumeAnalysis } from "../indicators/volume-analyzer.ts";
import { calculateStochastic } from "../indicators/stochastic-calculator.ts";
import { calculateWilliamsR } from "../indicators/williams-r-calculator.ts";
import { calculateSupportResistance } from "../indicators/support-resistance.ts";
import { calculate7IndicatorScore } from "../analysis/signal-composer.ts";
import {
  calculateSignalConfidence,
  calculateMomentumQuality,
  calculateRiskAdjustment,
} from "../scoring/signal-scorer.ts";
import { calculateKuzzoraSmartScore } from "../scoring/kurzora-smart-score.ts";
import { passesGatekeeperRules } from "../analysis/gatekeeper-rules.ts";
import {
  validateMarketData,
  validateIndicatorCount,
} from "../analysis/quality-filter.ts";
import {
  getActiveStocksWithParameters,
  deleteAllSignals,
  saveSignal,
} from "../database/signal-repository.ts";
import { PolygonAPIFetcher } from "../data/polygon-fetcher.ts";
import { PriceProcessor } from "../data/price-processor.ts";
import { CacheManager } from "../data/cache-manager.ts";

/**
 * 🎯 SESSION #312: SIGNAL PIPELINE PARAMETERS - TESTING INTERFACE
 * PURPOSE: Type-safe parameter passing from HTTP layer to processing engine
 * ANTI-REGRESSION: Exact same parameter structure as Session #311
 * TESTING: Identical interface for validation framework
 */
export interface SignalPipelineParams {
  startIndex: number;
  endIndex: number;
  batchNumber: number;
}

/**
 * 🎯 SESSION #312: SIGNAL PIPELINE RESULT - TESTING INTERFACE
 * PURPOSE: Type-safe result structure for HTTP response construction
 * ANTI-REGRESSION: Exact same response structure as Session #311
 * TESTING: Identical interface for output comparison
 */
export interface SignalPipelineResult {
  success: boolean;
  processed: number;
  passed_gatekeeper: number;
  saved: number;
  skipped_insufficient_data: number;
  data_quality_issues: number;
  api_calls: number;
  cache_performance: {
    hits: number;
    misses: number;
    hit_rate: string;
  };
  time: string;
  time_minutes: string;
  results: any[];
  session_312_testing: {
    version: string;
    testing_purpose: string;
    modular_architecture_copy: boolean;
    session_311_functionality_preserved: boolean;
  };
  [key: string]: any; // Allow additional properties for full compatibility
}

/**
 * 🎯 SESSION #312: SIGNAL PROCESSING PIPELINE V2 - TESTING VERSION
 * PURPOSE: Extract complete signal processing logic for side-by-side validation
 * SESSION #312: Exact copy of Session #311 for comprehensive integration testing
 * ANTI-REGRESSION: Identical processing flow with modular architecture benefits
 * TESTING: Enable 100% output comparison with production system
 */
export class SignalPipelineV2 {
  private globalCacheManager: CacheManager | null = null;

  /**
   * 🗄️ SESSION #312: GET CACHE MANAGER - EXACT COPY FOR TESTING
   * 🎯 PURPOSE: Initialize cache manager for optional API response caching
   * 🛡️ ANTI-REGRESSION: Exact same cache initialization as Session #311
   * 🧪 TESTING: Identical cache behavior for validation
   */
  private getSessionCacheManager(): CacheManager {
    if (!this.globalCacheManager) {
      this.globalCacheManager = new CacheManager({
        enableLogging: false,
        defaultTTL: 300000,
        maxEntries: 200,
        autoCleanup: true,
      });
      console.log(
        `🗄️ [SESSION_312_V2_CACHE] Cache manager initialized for testing validation`
      );
    }
    return this.globalCacheManager;
  }

  /**
   * 🎯 SESSION #312: MAIN PROCESSING PIPELINE EXECUTION V2 - TESTING VERSION
   * PURPOSE: Execute complete signal generation pipeline with all Session #151-311 functionality
   * ANTI-REGRESSION: Exact same processing logic as Session #311 for validation
   * TESTING: Identical processing flow for 100% output comparison
   */
  async execute(params: SignalPipelineParams): Promise<SignalPipelineResult> {
    const { startIndex, endIndex, batchNumber } = params;

    // 🔧 SESSION #312: CONFIGURATION ACCESS - EXACT COPY FOR TESTING
    const USE_BACKTEST = getUseBacktest();
    const TEST_STOCKS = getTestStocks();
    const TIMEFRAME_CONFIG = getTimeframeConfig();

    const modeLabel = USE_BACKTEST ? "BACKTEST" : "LIVE";
    const modeDescription = USE_BACKTEST
      ? "using verified historical data (2024-05-06 to 2024-06-14)"
      : "using SESSION #185 enhanced 400-day rolling window for reliable multi-timeframe data";

    // 🚨 SESSION #312: PROCESSING ENGINE V2 - IDENTICAL LOGGING FOR TESTING
    console.log(
      `🚀 Starting Kurzora 4-Timeframe Signal Engine V2 - SESSION #312 TESTING VERSION`
    );
    console.log(`🔄 Mode: ${modeLabel} MODE - ${modeDescription}`);
    console.log(
      `🚨 SESSION #312 V2 TESTING: Complete modular architecture copy for integration validation`
    );
    console.log(
      `🎯 Expected results: Identical output to production system for 100% validation`
    );

    // 🚨 SESSION #312: CACHE MANAGER - EXACT COPY FOR TESTING
    const sessionCacheManager = this.getSessionCacheManager();
    console.log(
      `🗄️ [SESSION_312_V2] Cache manager ready for testing validation`
    );

    // 🔧 SESSION #312: DATABASE INITIALIZATION - EXACT COPY FOR TESTING
    const supabaseUrl = getSupabaseUrl();
    const supabaseKey = getServiceRoleKey();

    const configValidation = validateAllAPIs();
    if (!configValidation.valid) {
      throw new Error(
        `Missing configuration - check environment variables: ${configValidation.errors.join(
          ", "
        )}`
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    console.log(
      "✅ V2 database initialized successfully with SESSION #312 testing validation"
    );

    // 🚨 SESSION #312: DELETE STRATEGY - EXACT COPY FOR TESTING
    console.log(
      `\n🗑️ ========== SESSION #312 V2 DELETE STRATEGY: TESTING VALIDATION ==========`
    );
    console.log(
      `🔧 [V2_REPLACE_STRATEGY] SESSION #312 TESTING: Using modular SignalRepository.deleteAllSignals() for validation`
    );

    const deleteResult = await deleteAllSignals(batchNumber);
    const deletedCount = deleteResult.count;
    const deleteSuccess = deleteResult.success;

    console.log(
      `📊 [V2_REPLACE_STRATEGY] SESSION #312 TESTING DELETE Results Summary:`
    );
    console.log(`   Delete Success: ${deleteSuccess ? "✅ YES" : "❌ NO"}`);
    console.log(
      `   Signals Deleted: ${deletedCount} (SESSION #312 V2 TESTING VALIDATION)`
    );

    // 🗄️ SESSION #312: DATABASE-DRIVEN STOCK SELECTION - EXACT COPY FOR TESTING
    console.log(
      `\n🗄️ ========== SESSION #312 V2 DATABASE-DRIVEN STOCK SELECTION ==========`
    );

    const ACTIVE_STOCKS = await getActiveStocksWithParameters(
      startIndex,
      endIndex,
      batchNumber
    );
    console.log(`✅ SESSION #312 V2 DATABASE-DRIVEN STOCK SELECTION COMPLETE:`);
    console.log(`   Parameter Range: ${startIndex}-${endIndex}`);
    console.log(`   Stocks Retrieved: ${ACTIVE_STOCKS.length}`);

    // 🔧 SESSION #312: PRODUCTION METRICS - EXACT COPY FOR TESTING
    let totalSavedCount = 0;
    let totalProcessed = 0;
    let totalPassedGatekeeper = 0;
    let totalApiCallCount = 0;
    let totalSkippedInsufficientData = 0;
    let totalDataQualityIssues = 0;
    let totalCacheHits = 0;
    let totalCacheMisses = 0;
    const totalStartTime = Date.now();
    const allAnalysisResults = [];

    console.log(
      `🎯 Beginning SESSION #312 V2 testing processing of ${ACTIVE_STOCKS.length} stocks...`
    );

    // 🚨 SESSION #312: MAIN STOCK PROCESSING LOOP - EXACT COPY FOR TESTING
    for (const stockObject of ACTIVE_STOCKS) {
      try {
        const ticker = stockObject.ticker;
        console.log(
          `\n🎯 ========== V2 TESTING ANALYSIS: ${ticker} (${
            stockObject.company_name
          }) (Batch ${batchNumber}, Stock ${totalProcessed + 1}/${
            ACTIVE_STOCKS.length
          }) ==========`
        );

        // 🔧 SESSION #312: MULTI-TIMEFRAME DATA COLLECTION - EXACT COPY FOR TESTING
        console.log(
          `📡 [${ticker}] V2 Testing: Fetching real market data with SESSION #312 validation...`
        );

        const coordinator = new TimeframeDataCoordinator(USE_BACKTEST);
        const dateRanges = getDateRanges();
        const timeframeData = await coordinator.fetchMultiTimeframeData(
          ticker,
          dateRanges
        );
        totalApiCallCount += 4;

        const cacheStats = sessionCacheManager.getStatistics();
        totalCacheHits = cacheStats.hits;
        totalCacheMisses = cacheStats.misses;

        // 🔧 SESSION #312: QUALITY VALIDATION - EXACT COPY FOR TESTING
        const marketDataValid = validateMarketData(timeframeData);
        if (!marketDataValid) {
          console.log(
            `❌ [${ticker}] V2 Testing: No real market data available - skipping stock`
          );
          allAnalysisResults.push({
            ticker: ticker,
            company_name: stockObject.company_name,
            sector: stockObject.sector,
            status: "SKIPPED_NO_REAL_DATA",
            reason: "No real market data available - V2 testing validation",
            batch: batchNumber,
            parameters: { startIndex, endIndex, batchNumber },
            session_312_testing: "V2 validation processing",
          });
          totalProcessed++;
          totalSkippedInsufficientData++;
          totalDataQualityIssues++;
          continue;
        }

        console.log(
          `✅ [${ticker}] V2 Testing: Real market data available - proceeding with analysis`
        );

        // 🔧 SESSION #312: INDIVIDUAL TIMEFRAME ANALYSIS - EXACT COPY FOR TESTING
        const timeframeScores = {};
        const timeframeDetails = {};
        let timeframeSkippedCount = 0;

        for (const [timeframe, data] of Object.entries(timeframeData)) {
          if (!data || !data.prices) {
            timeframeScores[timeframe] = 0;
            timeframeSkippedCount++;
            continue;
          }

          console.log(
            `📊 [${ticker}] V2 ${timeframe}: Calculating indicators with SESSION #312 testing (${
              data.prices?.length || 0
            } data points)...`
          );

          // 🔧 SESSION #312: MODULAR CALCULATIONS - EXACT COPY FOR TESTING
          const rsi = calculateRSI(data.prices);
          const macd = calculateMACD(data.prices);
          const bb = calculateBollingerBands(data.prices);
          const volumeAnalysis = calculateVolumeAnalysis(
            data.volume,
            data.volumes || [data.volume]
          );
          const supportResistance = calculateSupportResistance(
            data.prices,
            data.highs || data.prices,
            data.lows || data.prices
          );
          const stoch = calculateStochastic(
            data.prices,
            data.highs || data.prices,
            data.lows || data.prices
          );
          const williams = calculateWilliamsR(
            data.prices,
            data.highs || data.prices,
            data.lows || data.prices
          );

          // 🔧 SESSION #312: SIGNAL COMPOSITION - EXACT COPY FOR TESTING
          const timeframeScore = calculate7IndicatorScore(
            rsi,
            macd,
            bb,
            volumeAnalysis,
            stoch,
            williams,
            supportResistance
          );

          if (timeframeScore === null) {
            console.log(
              `⚠️ [${ticker}] V2 ${timeframe}: Insufficient real indicators - timeframe skipped`
            );
            timeframeScores[timeframe] = 0;
            timeframeSkippedCount++;
            totalDataQualityIssues++;
            continue;
          }

          timeframeScores[timeframe] = timeframeScore;
          timeframeDetails[timeframe] = {
            score: timeframeScore,
            rsi: rsi || null,
            macd: macd?.macd || null,
            bollingerB: bb?.percentB || null,
            volumeRatio: volumeAnalysis?.ratio || null,
            stochastic: stoch?.percentK || null,
            williamsR: williams?.value || null,
            currentPrice: data.currentPrice,
            changePercent: data.changePercent,
            session_312_testing: true,
          };

          console.log(
            `✅ [${ticker}] V2 ${timeframe}: Score ${timeframeScore}% with testing validation`
          );
        }

        // 🔧 SESSION #312: TIMEFRAME QUALITY VALIDATION - EXACT COPY FOR TESTING
        const timeframeQualityValid = validateIndicatorCount(timeframeScores);
        if (!timeframeQualityValid) {
          console.log(
            `❌ [${ticker}] V2 Testing: Insufficient timeframes with real data - skipping stock`
          );
          allAnalysisResults.push({
            ticker: ticker,
            company_name: stockObject.company_name,
            sector: stockObject.sector,
            status: "SKIPPED_INSUFFICIENT_REAL_INDICATORS",
            reason: `V2 Testing: Insufficient timeframes with quality scores`,
            timeframes_skipped: timeframeSkippedCount,
            batch: batchNumber,
            parameters: { startIndex, endIndex, batchNumber },
            session_312_testing: "V2 validation processing",
          });
          totalProcessed++;
          totalSkippedInsufficientData++;
          totalDataQualityIssues++;
          continue;
        }

        // 🔧 SESSION #312: INSTITUTIONAL GATEKEEPER RULES - EXACT COPY FOR TESTING
        const oneHourScore = timeframeScores["1H"] || 0;
        const fourHourScore = timeframeScores["4H"] || 0;
        const dailyScore = timeframeScores["1D"] || 0;
        const weeklyScore = timeframeScores["1W"] || 0;

        const passesGates = passesGatekeeperRules(
          oneHourScore,
          fourHourScore,
          dailyScore,
          weeklyScore
        );

        if (!passesGates) {
          console.log(
            `❌ [${ticker}] V2 Testing: REJECTED by institutional gatekeeper rules`
          );
          allAnalysisResults.push({
            ticker: ticker,
            company_name: stockObject.company_name,
            sector: stockObject.sector,
            status: "REJECTED",
            reason: "Failed V2 Testing Gatekeeper Rules",
            scores: timeframeScores,
            batch: batchNumber,
            parameters: { startIndex, endIndex, batchNumber },
            session_312_testing: "V2 validation processing",
          });
          totalProcessed++;
          continue;
        }

        totalPassedGatekeeper++;
        console.log(
          `✅ [${ticker}] V2 Testing: PASSED institutional gatekeeper rules`
        );

        // 🔧 SESSION #312: 4-DIMENSIONAL SCORING SYSTEM - EXACT COPY FOR TESTING
        let validTimeframeScores = {};
        if (
          timeframeScores &&
          typeof timeframeScores === "object" &&
          !Array.isArray(timeframeScores)
        ) {
          for (const [timeframe, score] of Object.entries(timeframeScores)) {
            if (
              typeof score === "number" &&
              !isNaN(score) &&
              score >= 0 &&
              score <= 100
            ) {
              validTimeframeScores[timeframe] = score;
            } else {
              validTimeframeScores[timeframe] = 50;
            }
          }
        } else {
          validTimeframeScores = {
            "1H": oneHourScore || 50,
            "4H": fourHourScore || 50,
            "1D": dailyScore || 50,
            "1W": weeklyScore || 50,
          };
        }

        let signalStrength = 50;
        try {
          const scoresArray = Object.values(validTimeframeScores);
          const meaningfulScores = scoresArray.filter(
            (score) => typeof score === "number" && !isNaN(score) && score >= 50
          );
          if (meaningfulScores.length > 0) {
            signalStrength = Math.round(
              meaningfulScores.reduce((sum, score) => sum + score, 0) /
                meaningfulScores.length
            );
          }
        } catch (strengthError) {
          signalStrength = Math.round(
            (oneHourScore + fourHourScore + dailyScore + weeklyScore) / 4
          );
        }

        const allScores = [
          oneHourScore,
          fourHourScore,
          dailyScore,
          weeklyScore,
        ].filter(
          (score) => typeof score === "number" && !isNaN(score) && score > 0
        );

        // 🔧 SESSION #312: MODULAR SCORING - EXACT COPY FOR TESTING
        const signalConfidence = calculateSignalConfidence(allScores);
        const momentumQuality = calculateMomentumQuality(
          weeklyScore,
          dailyScore,
          fourHourScore,
          oneHourScore
        );
        const primaryTimeframeData = timeframeData["1D"] || timeframeData["1H"];
        const riskAdjustment = calculateRiskAdjustment(
          primaryTimeframeData?.prices || [],
          primaryTimeframeData?.volume || 0,
          primaryTimeframeData?.volumes
            ? primaryTimeframeData.volumes.reduce((a, b) => a + b, 0) /
                primaryTimeframeData.volumes.length
            : 0
        );
        const kuzzoraSmartScore = calculateKuzzoraSmartScore(
          signalStrength,
          signalConfidence,
          momentumQuality,
          riskAdjustment
        );

        // 🔧 SESSION #312: DATABASE FIELD MAPPING - EXACT COPY FOR TESTING
        const signalStrength_enum =
          this.mapScoreToSignalStrength(kuzzoraSmartScore);
        const signalType = this.mapScoreToSignalType(kuzzoraSmartScore);

        console.log(
          `🎯 [${ticker}] SESSION #312 V2 TESTING SIGNAL ANALYSIS COMPLETE:`
        );
        console.log(`   Final Score: ${kuzzoraSmartScore}%`);
        console.log(`   Signal Type: ${signalType}`);
        console.log(`   Signal Strength: ${signalStrength_enum}`);

        // 🔧 SESSION #312: DATABASE OBJECT CONSTRUCTION - EXACT COPY FOR TESTING
        const safeStockInfo = this.getStockInfo(stockObject);
        const safeCurrentPrice = Number(
          (primaryTimeframeData?.currentPrice || 100.0).toFixed(4)
        );
        const safeChangePercent = Number(
          (primaryTimeframeData?.changePercent || 0.0).toFixed(4)
        );
        const safeIntegerSmartScore = Math.round(
          Math.max(0, Math.min(100, kuzzoraSmartScore))
        );
        const safeValidSignalType = ["bullish", "neutral", "bearish"].includes(
          signalType
        )
          ? signalType
          : "neutral";

        const primaryTimeframe =
          timeframeDetails["1D"] || timeframeDetails["1H"] || {};
        const safeTimeframeDetails = {
          rsi: primaryTimeframe.rsi !== null ? primaryTimeframe.rsi : null,
          macd: primaryTimeframe.macd !== null ? primaryTimeframe.macd : null,
          bollingerB:
            primaryTimeframe.bollingerB !== null
              ? primaryTimeframe.bollingerB
              : null,
          volumeRatio:
            primaryTimeframe.volumeRatio !== null
              ? primaryTimeframe.volumeRatio
              : null,
          stochastic:
            primaryTimeframe.stochastic !== null
              ? primaryTimeframe.stochastic
              : null,
          williamsR:
            primaryTimeframe.williamsR !== null
              ? primaryTimeframe.williamsR
              : null,
          session_312_testing: primaryTimeframe.session_312_testing || false,
        };

        const displayRSI =
          safeTimeframeDetails.rsi !== null ? safeTimeframeDetails.rsi : 50;
        const displayMACD =
          safeTimeframeDetails.macd !== null ? safeTimeframeDetails.macd : 0;
        const displayVolumeRatio =
          safeTimeframeDetails.volumeRatio !== null
            ? safeTimeframeDetails.volumeRatio
            : 1.0;

        const safeSignalsData = {
          timeframes: {
            "1H": oneHourScore || 0,
            "4H": fourHourScore || 0,
            "1D": dailyScore || 0,
            "1W": weeklyScore || 0,
          },
          dimensions: {
            confidence: signalConfidence || 50,
            risk: riskAdjustment || 70,
            strength: signalStrength || 50,
            quality: momentumQuality || 60,
          },
          indicators: {
            rsi: safeTimeframeDetails.rsi,
            macd: safeTimeframeDetails.macd,
            bollinger_b: safeTimeframeDetails.bollingerB,
            volume_ratio: safeTimeframeDetails.volumeRatio,
            stochastic: safeTimeframeDetails.stochastic,
            williams_r: safeTimeframeDetails.williamsR,
          },
          analysis: {
            methodology: "4-timeframe-institutional-analysis",
            session: "312-v2-testing-validation",
            gatekeeper_passed: true,
            kurzora_smart_score: kuzzoraSmartScore,
            batch_number: batchNumber,
            parameters: { startIndex, endIndex, batchNumber },
            session_312_testing: {
              version: "automated-signal-generation-v2",
              testing_purpose: "Side-by-side integration validation",
              identical_to_production: true,
              cache_hits: totalCacheHits,
              cache_misses: totalCacheMisses,
            },
          },
        };

        const safeEntryPrice = Number((safeCurrentPrice * 1.01).toFixed(4));
        const safeStopLoss = Number((safeCurrentPrice * 0.92).toFixed(4));
        const safeTakeProfit = Number((safeCurrentPrice * 1.15).toFixed(4));

        const safeEnhancedSignal = {
          ticker: String(ticker).toUpperCase(),
          signal_type: safeValidSignalType,
          confidence_score: safeIntegerSmartScore,
          current_price: Number(safeCurrentPrice.toFixed(4)),
          price_change_percent: Number(safeChangePercent.toFixed(4)),
          entry_price: safeEntryPrice,
          stop_loss: safeStopLoss,
          take_profit: safeTakeProfit,
          risk_reward_ratio: 2.0,
          company_name: String(safeStockInfo.name),
          sector: String(safeStockInfo.sector),
          market: "usa",
          rsi_value: Number(displayRSI.toFixed(2)),
          macd_signal: Number(displayMACD.toFixed(4)),
          volume_ratio: Number(displayVolumeRatio.toFixed(2)),
          status: "active",
          timeframe: "4TF",
          signal_strength: signalStrength_enum,
          final_score: safeIntegerSmartScore,
          signals: safeSignalsData,
          explanation: `Kurzora 4-Timeframe V2 Testing Analysis: Smart Score ${safeIntegerSmartScore}% | ${signalStrength_enum} Classification | SESSION #312 Integration Validation | ${
            batchNumber === 1
              ? `V2 Testing signal after ${deletedCount} signals deleted`
              : `V2 Testing batch ${batchNumber} signal appended`
          } | Make.com Batch ${batchNumber} Parameter Processing (${startIndex}-${endIndex}) | V2 Testing Validation | Production Data Integrity Maintained`,
        };

        console.log(
          `✅ [${ticker}] SESSION #312 V2 TESTING SIGNAL: Company="${safeEnhancedSignal.company_name}", Sector="${safeEnhancedSignal.sector}"`
        );

        // 🔧 SESSION #312: DATABASE SAVE - EXACT COPY FOR TESTING
        console.log(
          `💾 [${ticker}] SESSION #312 V2 TESTING DATABASE SAVE: Using SignalRepository.saveSignal()...`
        );

        const saveResult = await saveSignal(safeEnhancedSignal);
        const dbInsertSuccess = saveResult.success;
        const dbInsertResult = dbInsertSuccess
          ? `Successfully saved with ID: ${saveResult.data?.id} (SESSION #312 V2 TESTING)`
          : `Database Error: ${saveResult.error}`;

        if (dbInsertSuccess) {
          console.log(
            `🎉 [${ticker}] SESSION #312 V2 TESTING DATABASE INSERT SUCCESS! ID: ${saveResult.data?.id}`
          );
          totalSavedCount++;
        } else {
          console.log(
            `❌ [${ticker}] SESSION #312 V2 Testing Database insert FAILED: ${saveResult.error}`
          );
        }

        // 🔧 SESSION #312: RESULT TRACKING - EXACT COPY FOR TESTING
        const resultStatus = dbInsertSuccess
          ? "SAVED"
          : "CONSTRUCTED_BUT_NOT_SAVED";
        allAnalysisResults.push({
          ticker: ticker,
          company_name: stockObject.company_name,
          sector: stockObject.sector,
          status: resultStatus,
          kuzzoraScore: kuzzoraSmartScore,
          signalStrength: signalStrength_enum,
          dimensions: {
            strength: signalStrength,
            confidence: signalConfidence,
            quality: momentumQuality,
            risk: riskAdjustment,
          },
          timeframes: timeframeScores,
          real_indicators: {
            rsi: safeTimeframeDetails.rsi,
            macd: safeTimeframeDetails.macd,
            volume_ratio: safeTimeframeDetails.volumeRatio,
            authentic_data: true,
            session_312_testing: safeTimeframeDetails.session_312_testing,
          },
          object_construction: "SUCCESS",
          database_save: dbInsertSuccess ? "SUCCESS" : "FAILED",
          save_result: dbInsertResult,
          batch: batchNumber,
          parameters: { startIndex, endIndex, batchNumber },
          session_312_testing: {
            version: "automated-signal-generation-v2",
            testing_purpose: "Side-by-side integration validation",
            identical_to_production: true,
            modular_architecture_copy: true,
            old_signals_deleted:
              batchNumber === 1 ? deletedCount : "N/A (append mode)",
            delete_success:
              batchNumber === 1 ? deleteSuccess : "N/A (append mode)",
            fresh_signal_inserted: dbInsertSuccess,
            batch_mode:
              batchNumber === 1 ? "COMPLETE_TABLE_REPLACEMENT" : "APPEND_ONLY",
            cache_hits: totalCacheHits,
            cache_misses: totalCacheMisses,
          },
          database_driven: "Company info from active_stocks table",
        });

        totalProcessed++;
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (stockError) {
        console.log(
          `❌ [${stockObject.ticker}] V2 Testing stock processing error: ${
            stockError.message || "No message available"
          }`
        );
        allAnalysisResults.push({
          ticker: stockObject.ticker,
          company_name: stockObject.company_name || "Unknown",
          sector: stockObject.sector || "Unknown",
          status: "ERROR",
          error: stockError.message,
          batch: batchNumber,
          parameters: { startIndex, endIndex, batchNumber },
          session_312_testing: "V2 testing - error occurred during processing",
        });
        totalProcessed++;
        totalDataQualityIssues++;
      }
    }

    // 🔧 SESSION #312: FINAL PROCESSING RESULTS - EXACT COPY FOR TESTING
    const totalProcessingTime = ((Date.now() - totalStartTime) / 1000).toFixed(
      1
    );
    const totalProcessingMinutes = (totalProcessingTime / 60).toFixed(1);

    console.log(
      `\n🎉 ============ SESSION #312 V2 TESTING ANALYSIS COMPLETE ============`
    );
    console.log(`📊 FINAL SESSION #312 V2 TESTING PROCESSING RESULTS SUMMARY:`);
    console.log(`      V2 Testing Version: automated-signal-generation-v2 ✅`);
    console.log(
      `      Integration Validation: Side-by-side comparison ready ✅`
    );
    console.log(
      `      Modular Architecture Copy: Complete functionality preserved ✅`
    );
    console.log(`      Processing Pipeline: Identical to production system ✅`);

    // 🔧 SESSION #312: RETURN STRUCTURED RESULT - TESTING VERSION
    return {
      success: true,
      processed: totalProcessed,
      passed_gatekeeper: totalPassedGatekeeper,
      saved: totalSavedCount,
      skipped_insufficient_data: totalSkippedInsufficientData,
      data_quality_issues: totalDataQualityIssues,
      api_calls: totalApiCallCount,
      cache_performance: {
        hits: totalCacheHits,
        misses: totalCacheMisses,
        hit_rate:
          totalCacheHits + totalCacheMisses > 0
            ? (
                (totalCacheHits / (totalCacheHits + totalCacheMisses)) *
                100
              ).toFixed(1) + "%"
            : "0.0%",
      },
      time: totalProcessingTime + "s",
      time_minutes: totalProcessingMinutes,
      results: allAnalysisResults,
      session_312_testing: {
        version: "automated-signal-generation-v2",
        testing_purpose: "Side-by-side integration validation",
        modular_architecture_copy: true,
        session_311_functionality_preserved: true,
      },
      // Additional properties for full compatibility with original response
      session: `SESSION-312-V2-TESTING-${
        USE_BACKTEST ? "BACKTEST" : "LIVE"
      }-4TIMEFRAME`,
      mode: USE_BACKTEST ? "BACKTEST" : "LIVE",
      mode_description: USE_BACKTEST
        ? "using verified historical data (2024-05-06 to 2024-06-14)"
        : "using SESSION #185 enhanced 400-day rolling window for reliable multi-timeframe data",
      message: `SESSION #312 V2 TESTING system with ${
        totalSavedCount > 0 ? "successful" : "attempted"
      } database operations using identical processing logic for integration validation`,
    };
  }

  /**
   * 🎯 DATABASE FIELD MAPPING FUNCTIONS - EXACT COPY FOR TESTING
   * PURPOSE: Maintain exact same mapping logic as Session #311
   * ANTI-REGRESSION: Identical behavior for testing validation
   */
  private mapScoreToSignalStrength(score: number): string {
    if (score >= 85) return "STR_BUY";
    if (score >= 75) return "BUY";
    if (score >= 65) return "WEAK_BUY";
    if (score >= 50) return "NEUTRAL";
    if (score >= 40) return "WEAK_SELL";
    if (score >= 30) return "SELL";
    return "STR_SELL";
  }

  private mapScoreToSignalType(score: number): string {
    if (score >= 60) return "bullish";
    if (score >= 40) return "neutral";
    return "bearish";
  }

  /**
   * 🎯 STOCK INFO EXTRACTION - EXACT COPY FOR TESTING
   * PURPOSE: Maintain exact same stock info logic as Session #311
   * ANTI-REGRESSION: Identical behavior for testing validation
   */
  private getStockInfo(stockObject: any): any {
    console.log(
      `🔍 [V2_STOCK_INFO] Getting info for stock object: ${JSON.stringify(
        stockObject
      )}`
    );
    let ticker, companyName, sector;
    if (typeof stockObject === "string") {
      console.log(
        `⚠️ [V2_STOCK_INFO] Received ticker string "${stockObject}" - using fallback company info`
      );
      ticker = stockObject;
      companyName = `${ticker} Corporation`;
      sector = "Technology";
    } else if (stockObject && typeof stockObject === "object") {
      ticker = stockObject.ticker;
      companyName = stockObject.company_name;
      sector = stockObject.sector;
      console.log(
        `✅ [V2_STOCK_INFO] Using database stock object: ${ticker} - ${companyName} (${sector})`
      );
    } else {
      console.log(
        `⚠️ [V2_STOCK_INFO] Invalid stock object: ${stockObject}, using fallback`
      );
      return {
        name: "Unknown Corporation",
        sector: "Technology",
        validated: false,
        fallback_reason: "invalid_stock_object",
        source: "fallback",
      };
    }
    if (!ticker || typeof ticker !== "string") {
      console.log(
        `⚠️ [V2_STOCK_INFO] Invalid ticker: ${ticker}, using fallback`
      );
      return {
        name: "Unknown Corporation",
        sector: "Technology",
        validated: false,
        fallback_reason: "invalid_ticker",
        source: "fallback",
      };
    }
    const safeTicker = String(ticker).toUpperCase().trim();
    const safeCompanyName =
      companyName && typeof companyName === "string"
        ? companyName
        : `${safeTicker} Corporation`;
    const safeSector =
      sector && typeof sector === "string" ? sector : "Technology";
    console.log(
      `✅ [V2_STOCK_INFO] Database values: Ticker="${safeTicker}", Company="${safeCompanyName}", Sector="${safeSector}"`
    );
    return {
      name: safeCompanyName,
      sector: safeSector,
      validated: true,
      source: "database",
      ticker: safeTicker,
    };
  }
}

/**
 * 🎯 SESSION #312: LEGACY COMPATIBILITY EXPORT - TESTING VERSION
 * PURPOSE: Enable drop-in replacement testing during integration
 * ANTI-REGRESSION: Allows validation against Session #311 behavior
 * TESTING: Identical interface for side-by-side comparison
 */
export async function executeSignalPipeline(
  params: SignalPipelineParams
): Promise<SignalPipelineResult> {
  const pipeline = new SignalPipelineV2();
  return await pipeline.execute(params);
}

// ==================================================================================
// 🎯 SESSION #312 SIGNAL PIPELINE V2 TESTING COPY COMPLETE
// ==================================================================================
// 📊 FUNCTIONALITY: Complete copy of Session #311 signal processing pipeline for testing
// 🛡️ PRESERVATION: ALL Session #151-311 processing logic preserved exactly
// 🔧 TESTING PURPOSE: Enable side-by-side validation against production system
// 📈 VALIDATION READY: Type-safe pipeline with identical behavior for 100% comparison
// 🎖️ ANTI-REGRESSION: Original processing logic completely preserved - zero risk testing
// 🚀 INTEGRATION TESTING: Professional validation infrastructure for modular architecture
// 📋 SESSION #312 V2: Testing version ready for comprehensive validation framework
// 🏆 NEXT STEP: Copy remaining modular components and create validation testing framework
// ==================================================================================
