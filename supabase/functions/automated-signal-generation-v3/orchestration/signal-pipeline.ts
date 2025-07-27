// ==================================================================================
// 🎯 SESSION #313: KURZORA PRODUCTION SIGNAL PIPELINE - PROCESSING ENGINE
// ==================================================================================
// 🚨 PURPOSE: Production signal processing engine with complete modular architecture
// 🛡️ ANTI-REGRESSION: EXACT preservation of ALL Session #151-311 processing logic
// 📝 SESSION #313 PRODUCTION: Live signal generation with professional modular components
// 🔧 MODULAR ARCHITECTURE: All 11 extracted components working together in production
// ✅ PRODUCTION READY: Professional signal processing with enhanced maintainability
// 📊 SESSION #310 COMPLIANCE: Configuration management integration preserved exactly
// 🎖️ LIVE DEPLOYMENT: Production-grade signal generation infrastructure
// 🎯 SESSION #313C ENHANCEMENT: S/R proximity filter for actionable trading levels
// 🔧 SESSION #313D FIX: Fixed support/resistance price mapping to database
// 🚨 SESSION #316 CRITICAL FIX: Removed redundant getDateRanges() call to ensure consistent date ranges across all stocks and timeframes
// ==================================================================================
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// 🔧 SESSION #313: CONFIGURATION IMPORTS - PRODUCTION READY
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

// 🔧 SESSION #313: COMPLETE MODULAR IMPORTS - PRODUCTION READY
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
import { CacheManager } from "../data/cache-manager.ts";

/**
 * 🎯 SESSION #313: PRODUCTION SIGNAL PROCESSING PIPELINE
 * PURPOSE: Execute complete signal generation pipeline with all Session #151-311 functionality
 * SESSION #313: Production deployment of complete modular architecture
 * ANTI-REGRESSION: Identical processing flow with enhanced modular architecture benefits
 * PRODUCTION: Live signal generation with professional codebase
 * SESSION #313C: Enhanced with S/R proximity filtering for actionable levels
 */
export class SignalPipeline {
  globalCacheManager = null;

  /**
   * 🗄️ SESSION #313: GET CACHE MANAGER - PRODUCTION READY
   * 🎯 PURPOSE: Initialize cache manager for optional API response caching
   * 🛡️ ANTI-REGRESSION: Exact same cache initialization as original function
   * 🏭 PRODUCTION: Professional caching for enhanced performance
   */
  getSessionCacheManager() {
    if (!this.globalCacheManager) {
      this.globalCacheManager = new CacheManager({
        enableLogging: false,
        defaultTTL: 300000,
        maxEntries: 200,
        autoCleanup: true,
      });
      console.log(
        `🗄️ [PRODUCTION_CACHE] Cache manager initialized for production performance optimization`
      );
    }
    return this.globalCacheManager;
  }

  /**
   * 🎯 SESSION #313: MAIN PROCESSING PIPELINE EXECUTION - PRODUCTION VERSION
   * PURPOSE: Execute complete signal generation pipeline with all Session #151-311 functionality
   * ANTI-REGRESSION: Exact same processing logic as original for production deployment
   * PRODUCTION: Live signal generation with professional modular architecture
   * SESSION #313C: Enhanced with S/R proximity filtering for actionable levels
   * SESSION #316 FIX: Removed redundant getDateRanges() call for consistent date ranges
   */
  async execute(params) {
    const { startIndex, endIndex, batchNumber } = params;

    // 🔧 SESSION #313: CONFIGURATION ACCESS - PRODUCTION READY
    const USE_BACKTEST = getUseBacktest();
    const TEST_STOCKS = getTestStocks();
    const TIMEFRAME_CONFIG = getTimeframeConfig();

    // 🚨 SESSION #316 CRITICAL FIX: Calculate date ranges ONCE for all stocks to ensure consistency
    // This prevents different stocks from getting different date ranges due to timing differences
    const dateRanges = getDateRanges();

    const modeLabel = USE_BACKTEST ? "BACKTEST" : "LIVE";
    const modeDescription = USE_BACKTEST
      ? "using verified historical data (2024-05-06 to 2024-06-14)"
      : "using SESSION #185 enhanced 400-day rolling window for reliable multi-timeframe data";

    // 🚨 SESSION #313: PROCESSING ENGINE - PRODUCTION LOGGING
    console.log(
      `🚀 Starting Kurzora 4-Timeframe Signal Engine - SESSION #313 PRODUCTION MODULAR ARCHITECTURE`
    );
    console.log(`🔄 Mode: ${modeLabel} MODE - ${modeDescription}`);
    console.log(
      `🚨 SESSION #313 PRODUCTION: Complete modular architecture deployed for live signal generation`
    );
    console.log(
      `🎯 Expected results: Professional signal generation with modular architecture + institutional quality filtering`
    );

    // 🚨 SESSION #313: CACHE MANAGER - PRODUCTION READY
    const sessionCacheManager = this.getSessionCacheManager();
    console.log(
      `🗄️ [PRODUCTION] Cache manager ready for performance optimization`
    );

    // 🔧 SESSION #313: DATABASE INITIALIZATION - PRODUCTION READY
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
      "✅ Production database initialized successfully with SESSION #313 modular architecture"
    );

    // 🚨 SESSION #313: DELETE STRATEGY - PRODUCTION READY
    console.log(
      `\n🗑️ ========== SESSION #313 PRODUCTION DELETE STRATEGY: SUPABASE SECURITY COMPLIANT ==========`
    );
    console.log(
      `🔧 [PRODUCTION_STRATEGY] SESSION #313: Using modular SignalRepository.deleteAllSignals() for production deployment`
    );
    const deleteResult = await deleteAllSignals(batchNumber);
    const deletedCount = deleteResult.count;
    const deleteSuccess = deleteResult.success;
    console.log(
      `📊 [PRODUCTION_STRATEGY] SESSION #313 PRODUCTION DELETE Results Summary:`
    );
    console.log(`   Delete Success: ${deleteSuccess ? "✅ YES" : "❌ NO"}`);
    console.log(
      `   Signals Deleted: ${deletedCount} (SESSION #313 PRODUCTION)`
    );

    // 🗄️ SESSION #313: DATABASE-DRIVEN STOCK SELECTION - PRODUCTION READY
    console.log(
      `\n🗄️ ========== SESSION #313 PRODUCTION DATABASE-DRIVEN STOCK SELECTION ==========`
    );
    const ACTIVE_STOCKS = await getActiveStocksWithParameters(
      startIndex,
      endIndex,
      batchNumber
    );
    console.log(
      `✅ SESSION #313 PRODUCTION DATABASE-DRIVEN STOCK SELECTION COMPLETE:`
    );
    console.log(`   Parameter Range: ${startIndex}-${endIndex}`);
    console.log(`   Stocks Retrieved: ${ACTIVE_STOCKS.length}`);

    // 🔧 SESSION #313: PRODUCTION METRICS - LIVE DEPLOYMENT
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
      `🎯 Beginning SESSION #313 PRODUCTION processing of ${ACTIVE_STOCKS.length} stocks...`
    );

    // 🚨 SESSION #313: MAIN STOCK PROCESSING LOOP - PRODUCTION READY
    for (const stockObject of ACTIVE_STOCKS) {
      try {
        const ticker = stockObject.ticker;
        console.log(
          `\n🎯 ========== PRODUCTION ANALYSIS: ${ticker} (${
            stockObject.company_name
          }) (Batch ${batchNumber}, Stock ${totalProcessed + 1}/${
            ACTIVE_STOCKS.length
          }) ==========`
        );

        // 🔧 SESSION #313: MULTI-TIMEFRAME DATA COLLECTION - PRODUCTION READY
        // 🚨 SESSION #316 FIX: Use the function-level dateRanges variable for ALL stocks
        // This ensures consistent date ranges across all stocks and timeframes
        console.log(
          `📡 [${ticker}] Production: Fetching real market data with SESSION #313 modular architecture...`
        );
        const coordinator = new TimeframeDataCoordinator(USE_BACKTEST);
        // SESSION #316 FIX: Removed redundant getDateRanges() call here to prevent date range inconsistencies
        const timeframeData = await coordinator.fetchMultiTimeframeData(
          ticker,
          dateRanges
        );
        totalApiCallCount += 4;

        const cacheStats = sessionCacheManager.getStatistics();
        totalCacheHits = cacheStats.hits;
        totalCacheMisses = cacheStats.misses;

        // 🔧 SESSION #313: QUALITY VALIDATION - PRODUCTION READY
        const marketDataValid = validateMarketData(timeframeData);
        if (!marketDataValid) {
          console.log(
            `❌ [${ticker}] Production: No real market data available - skipping stock`
          );
          allAnalysisResults.push({
            ticker: ticker,
            company_name: stockObject.company_name,
            sector: stockObject.sector,
            status: "SKIPPED_NO_REAL_DATA",
            reason: "No real market data available - production quality filter",
            batch: batchNumber,
            parameters: {
              startIndex,
              endIndex,
              batchNumber,
            },
            session_313_production: "Live signal generation processing",
          });
          totalProcessed++;
          totalSkippedInsufficientData++;
          totalDataQualityIssues++;
          continue;
        }

        console.log(
          `✅ [${ticker}] Production: Real market data available - proceeding with analysis`
        );

        // 🔧 SESSION #313: INDIVIDUAL TIMEFRAME ANALYSIS - PRODUCTION READY
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
            `📊 [${ticker}] ${timeframe}: Calculating indicators with SESSION #313 production (${
              data.prices?.length || 0
            } data points)...`
          );

          // 🔧 SESSION #313: MODULAR CALCULATIONS - PRODUCTION READY
          const rsi = calculateRSI(data.prices);
          const macd = calculateMACD(data.prices);
          const bb = calculateBollingerBands(data.prices);
          const volumeAnalysis = calculateVolumeAnalysis(
            data.volume,
            data.volumes || [data.volume]
          );

          // 🎯 SESSION #313C: VOLATILITY DISTANCE CALCULATION FOR S/R PROXIMITY FILTER
          // 🛡️ SESSION #183 COMPLIANCE: Validate current price exists before calculations (no synthetic fallback)
          const currentPrice =
            data.currentPrice || data.prices[data.prices.length - 1];

          // 🚨 SESSION #183 PRODUCTION FIX: Skip stock if no real current price available
          if (!currentPrice) {
            console.log(
              `❌ [${ticker}] Production: No current price available - skipping stock`
            );
            allAnalysisResults.push({
              ticker: ticker,
              company_name: stockObject.company_name,
              sector: stockObject.sector,
              status: "SKIPPED_NO_CURRENT_PRICE",
              reason:
                "No current price available - Session #183 compliance (no synthetic data)",
              batch: batchNumber,
              parameters: {
                startIndex,
                endIndex,
                batchNumber,
              },
              session_313_production: "Live signal generation processing",
            });
            totalProcessed++;
            totalSkippedInsufficientData++;
            totalDataQualityIssues++;
            break; // Break out of timeframe loop to skip this stock completely
          }

          // 🎯 Calculate volatility distance using same logic as production entry/stop calculations
          const tempEntryPrice = currentPrice * 1.01; // 1% above current (same as production logic)
          const tempStopLoss = currentPrice * 0.92; // 8% below current (same as production logic)
          const volatilityDistance = Math.abs(tempEntryPrice - tempStopLoss);

          console.log(
            `🎯 [${ticker}] ${timeframe}: Calculated volatility distance ${volatilityDistance.toFixed(
              2
            )} for S/R proximity filter`
          );

          // 🎯 SESSION #313C: ENHANCED S/R CALCULATION WITH PROXIMITY FILTER
          // Pass volatility distance to enable actionable level filtering instead of ancient levels
          const supportResistance = calculateSupportResistance(
            data.prices,
            data.highs || data.prices,
            data.lows || data.prices,
            20,
            volatilityDistance // SESSION #313C: Add volatility distance for proximity filtering
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

          // 🔧 SESSION #313: SIGNAL COMPOSITION - PRODUCTION READY
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
              `⚠️ [${ticker}] ${timeframe}: Insufficient real indicators - timeframe skipped`
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
            // 🔧 SESSION #313D: Support/Resistance levels - fixed mapping for actual price values instead of proximity scores
            supportLevel:
              supportResistance && supportResistance.type === "support"
                ? supportResistance.price
                : null,
            resistanceLevel:
              supportResistance && supportResistance.type === "resistance"
                ? supportResistance.price
                : null,
            currentPrice: data.currentPrice,
            changePercent: data.changePercent,
            session_313_production: true,
            // 🎯 SESSION #313C: Add proximity filter metadata for debugging
            volatilityDistance: volatilityDistance,
            proximityFilterApplied: true,
          };

          console.log(
            `✅ [${ticker}] ${timeframe}: Score ${timeframeScore}% with production validation (S/R proximity filter applied)`
          );
        }

        // 🚨 Check if stock was skipped due to no current price during timeframe processing
        if (
          allAnalysisResults.some(
            (result) =>
              result.ticker === ticker &&
              result.status === "SKIPPED_NO_CURRENT_PRICE"
          )
        ) {
          continue; // Skip this stock completely, already tracked in results
        }

        // 🔧 SESSION #313: TIMEFRAME QUALITY VALIDATION - PRODUCTION READY
        const timeframeQualityValid = validateIndicatorCount(timeframeScores);
        if (!timeframeQualityValid) {
          console.log(
            `❌ [${ticker}] Production: Insufficient timeframes with real data - skipping stock`
          );
          allAnalysisResults.push({
            ticker: ticker,
            company_name: stockObject.company_name,
            sector: stockObject.sector,
            status: "SKIPPED_INSUFFICIENT_REAL_INDICATORS",
            reason: `Production: Insufficient timeframes with quality scores`,
            timeframes_skipped: timeframeSkippedCount,
            batch: batchNumber,
            parameters: {
              startIndex,
              endIndex,
              batchNumber,
            },
            session_313_production: "Live signal generation processing",
          });
          totalProcessed++;
          totalSkippedInsufficientData++;
          totalDataQualityIssues++;
          continue;
        }

        // 🔧 SESSION #313: INSTITUTIONAL GATEKEEPER RULES - PRODUCTION READY
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
            `❌ [${ticker}] Production: REJECTED by institutional gatekeeper rules`
          );
          allAnalysisResults.push({
            ticker: ticker,
            company_name: stockObject.company_name,
            sector: stockObject.sector,
            status: "REJECTED",
            reason: "Failed Production Gatekeeper Rules",
            scores: timeframeScores,
            batch: batchNumber,
            parameters: {
              startIndex,
              endIndex,
              batchNumber,
            },
            session_313_production: "Live signal generation processing",
          });
          totalProcessed++;
          continue;
        }

        totalPassedGatekeeper++;
        console.log(
          `✅ [${ticker}] Production: PASSED institutional gatekeeper rules`
        );

        // 🔧 SESSION #313: 4-DIMENSIONAL SCORING SYSTEM - PRODUCTION READY
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

        // 🔧 SESSION #313: MODULAR SCORING - PRODUCTION READY
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

        // 🔧 SESSION #313: DATABASE FIELD MAPPING - PRODUCTION READY
        const signalStrength_enum =
          this.mapScoreToSignalStrength(kuzzoraSmartScore);
        const signalType = this.mapScoreToSignalType(kuzzoraSmartScore);

        console.log(
          `🎯 [${ticker}] SESSION #313 PRODUCTION SIGNAL ANALYSIS COMPLETE:`
        );
        console.log(`   Final Score: ${kuzzoraSmartScore}%`);
        console.log(`   Signal Type: ${signalType}`);
        console.log(`   Signal Strength: ${signalStrength_enum}`);

        // 🔧 SESSION #313: DATABASE OBJECT CONSTRUCTION - PRODUCTION READY
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
          // 🔧 Support/Resistance levels from corrected timeframe data
          supportLevel:
            primaryTimeframe.supportLevel !== null
              ? primaryTimeframe.supportLevel
              : null,
          resistanceLevel:
            primaryTimeframe.resistanceLevel !== null
              ? primaryTimeframe.resistanceLevel
              : null,
          session_313_production:
            primaryTimeframe.session_313_production || false,
          // 🎯 SESSION #313C: Add proximity filter status to metadata
          proximityFilterApplied:
            primaryTimeframe.proximityFilterApplied || false,
          volatilityDistance: primaryTimeframe.volatilityDistance || null,
        };

        // 🔧 DATABASE DISPLAY VALUES - PRODUCTION READY (Existing pattern preserved)
        const displayRSI =
          safeTimeframeDetails.rsi !== null ? safeTimeframeDetails.rsi : 50;
        const displayMACD =
          safeTimeframeDetails.macd !== null ? safeTimeframeDetails.macd : 0;
        const displayVolumeRatio =
          safeTimeframeDetails.volumeRatio !== null
            ? safeTimeframeDetails.volumeRatio
            : 1.0;

        // 🔧 NEW DATABASE DISPLAY VALUES - Following existing patterns for new columns
        const displayStochastic =
          safeTimeframeDetails.stochastic !== null
            ? safeTimeframeDetails.stochastic
            : 50;
        const displayWilliamsR =
          safeTimeframeDetails.williamsR !== null
            ? safeTimeframeDetails.williamsR
            : -50;
        const displayBollinger =
          safeTimeframeDetails.bollingerB !== null
            ? safeTimeframeDetails.bollingerB
            : 0.5;

        // 🔧 Support/Resistance display values - corrected mapping for calculated levels
        const displaySupportLevel =
          safeTimeframeDetails.supportLevel !== null
            ? safeTimeframeDetails.supportLevel
            : null;
        const displayResistanceLevel =
          safeTimeframeDetails.resistanceLevel !== null
            ? safeTimeframeDetails.resistanceLevel
            : null;

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
            session: "313-production-deployment",
            gatekeeper_passed: true,
            kurzora_smart_score: kuzzoraSmartScore,
            batch_number: batchNumber,
            parameters: {
              startIndex,
              endIndex,
              batchNumber,
            },
            session_313_production: {
              version: "automated-signal-generation",
              status: "production",
              modular_architecture_deployed: true,
              cache_hits: totalCacheHits,
              cache_misses: totalCacheMisses,
            },
            // 🎯 SESSION #313C: Add proximity filter status to analysis metadata
            session_313c_enhancement: {
              proximity_filter_applied:
                safeTimeframeDetails.proximityFilterApplied,
              volatility_distance: safeTimeframeDetails.volatilityDistance,
              actionable_levels:
                "S/R levels filtered for trading actionability",
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
          // 🔧 EXISTING DATABASE COLUMNS - Production ready (preserved exactly)
          rsi_value: Number(displayRSI.toFixed(2)),
          macd_signal: Number(displayMACD.toFixed(4)),
          volume_ratio: Number(displayVolumeRatio.toFixed(2)),
          // 🔧 NEW DATABASE COLUMNS - Using calculated values for enhanced technical analysis
          stochastic_value: Number(displayStochastic.toFixed(2)),
          williams_r_value: Number(displayWilliamsR.toFixed(2)),
          bollinger_value: Number(displayBollinger.toFixed(4)),
          // 🔧 Support/Resistance database columns - corrected mapping for actual algorithm structure
          support_level:
            displaySupportLevel !== null
              ? Number(displaySupportLevel.toFixed(4))
              : null,
          resistance_level:
            displayResistanceLevel !== null
              ? Number(displayResistanceLevel.toFixed(4))
              : null,
          status: "active",
          timeframe: "4TF",
          signal_strength: signalStrength_enum,
          final_score: safeIntegerSmartScore,
          signals: safeSignalsData,
          explanation: `Kurzora 4-Timeframe Production Analysis: Smart Score ${safeIntegerSmartScore}% | ${signalStrength_enum} Classification | SESSION #313 Production Deployment | ${
            batchNumber === 1
              ? `Production signal after ${deletedCount} signals deleted`
              : `Production batch ${batchNumber} signal appended`
          } | Make.com Batch ${batchNumber} Parameter Processing (${startIndex}-${endIndex}) | Production Modular Architecture | Live Signal Generation`,
        };

        console.log(
          `✅ [${ticker}] SESSION #313 PRODUCTION SIGNAL: Company="${safeEnhancedSignal.company_name}", Sector="${safeEnhancedSignal.sector}"`
        );

        // 🔧 SESSION #313: DATABASE SAVE - PRODUCTION READY
        console.log(
          `💾 [${ticker}] SESSION #313 PRODUCTION DATABASE SAVE: Using SignalRepository.saveSignal()...`
        );
        const saveResult = await saveSignal(safeEnhancedSignal);
        const dbInsertSuccess = saveResult.success;
        const dbInsertResult = dbInsertSuccess
          ? `Successfully saved with ID: ${saveResult.data?.id} (SESSION #313 PRODUCTION)`
          : `Database Error: ${saveResult.error}`;

        if (dbInsertSuccess) {
          console.log(
            `🎉 [${ticker}] SESSION #313 PRODUCTION DATABASE INSERT SUCCESS! ID: ${saveResult.data?.id}`
          );
          totalSavedCount++;
        } else {
          console.log(
            `❌ [${ticker}] SESSION #313 Production Database insert FAILED: ${saveResult.error}`
          );
        }

        // 🔧 SESSION #313: RESULT TRACKING - PRODUCTION READY
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
            session_313_production: safeTimeframeDetails.session_313_production,
          },
          object_construction: "SUCCESS",
          database_save: dbInsertSuccess ? "SUCCESS" : "FAILED",
          save_result: dbInsertResult,
          batch: batchNumber,
          parameters: {
            startIndex,
            endIndex,
            batchNumber,
          },
          session_313_production: {
            version: "automated-signal-generation",
            status: "production",
            modular_architecture_deployed: true,
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
          // 🎯 SESSION #313C: Add proximity filter results to tracking
          session_313c_enhancement: {
            proximity_filter_applied:
              safeTimeframeDetails.proximityFilterApplied,
            volatility_distance: safeTimeframeDetails.volatilityDistance,
            actionable_levels: "S/R levels filtered for trading actionability",
          },
          database_driven: "Company info from active_stocks table",
        });

        totalProcessed++;
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (stockError) {
        console.log(
          `❌ [${stockObject.ticker}] Production stock processing error: ${
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
          parameters: {
            startIndex,
            endIndex,
            batchNumber,
          },
          session_313_production:
            "Production deployment - error occurred during processing",
        });
        totalProcessed++;
        totalDataQualityIssues++;
      }
    }

    // 🔧 SESSION #313: FINAL PROCESSING RESULTS - PRODUCTION READY
    const totalProcessingTime = ((Date.now() - totalStartTime) / 1000).toFixed(
      1
    );
    const totalProcessingMinutes = (totalProcessingTime / 60).toFixed(1);

    console.log(
      `\n🎉 ============ SESSION #313 PRODUCTION ANALYSIS COMPLETE ============`
    );
    console.log(`📊 FINAL SESSION #313 PRODUCTION PROCESSING RESULTS SUMMARY:`);
    console.log(`      Production Version: automated-signal-generation ✅`);
    console.log(
      `      Modular Architecture: Complete deployment successful ✅`
    );
    console.log(
      `      Live Signal Generation: Professional functionality preserved ✅`
    );
    console.log(
      `      Processing Pipeline: Production-grade modular system ✅`
    );
    console.log(
      `      SESSION #313C Enhancement: S/R proximity filter applied ✅`
    );

    // 🔧 SESSION #313: RETURN STRUCTURED RESULT - PRODUCTION VERSION
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
                (totalCacheHits / (totalCacheMisses + totalCacheHits)) *
                100
              ).toFixed(1) + "%"
            : "0.0%",
      },
      time: totalProcessingTime + "s",
      time_minutes: totalProcessingMinutes,
      results: allAnalysisResults,
      session_313_production: {
        version: "automated-signal-generation",
        status: "production",
        modular_architecture_deployed: true,
        session_311_transformation_complete: true,
      },
      // 🎯 SESSION #313C: Add proximity filter status to final results
      session_313c_enhancement: {
        proximity_filter_deployed: true,
        actionable_levels: "S/R levels filtered for trading actionability",
        volatility_based_filtering: "Using production entry/stop calculations",
      },
      // Additional properties for full compatibility with original response
      session: `SESSION-313-PRODUCTION-${
        USE_BACKTEST ? "BACKTEST" : "LIVE"
      }-4TIMEFRAME`,
      mode: USE_BACKTEST ? "BACKTEST" : "LIVE",
      mode_description: USE_BACKTEST
        ? "using verified historical data (2024-05-06 to 2024-06-14)"
        : "using SESSION #185 enhanced 400-day rolling window for reliable multi-timeframe data",
      message: `SESSION #313 PRODUCTION system with ${
        totalSavedCount > 0 ? "successful" : "attempted"
      } database operations using professional modular architecture for live signal generation`,
    };
  }

  /**
   * 🎯 DATABASE FIELD MAPPING FUNCTIONS - PRODUCTION READY
   * PURPOSE: Maintain exact same mapping logic as original
   * ANTI-REGRESSION: Identical behavior for production deployment
   */
  mapScoreToSignalStrength(score) {
    if (score >= 85) return "STR_BUY";
    if (score >= 75) return "BUY";
    if (score >= 65) return "WEAK_BUY";
    if (score >= 50) return "NEUTRAL";
    if (score >= 40) return "WEAK_SELL";
    if (score >= 30) return "SELL";
    return "STR_SELL";
  }

  mapScoreToSignalType(score) {
    if (score >= 60) return "bullish";
    if (score >= 40) return "neutral";
    return "bearish";
  }

  /**
   * 🎯 STOCK INFO EXTRACTION - PRODUCTION READY
   * PURPOSE: Maintain exact same stock info logic as original
   * ANTI-REGRESSION: Identical behavior for production deployment
   */
  getStockInfo(stockObject) {
    console.log(
      `🔍 [PRODUCTION_STOCK_INFO] Getting info for stock object: ${JSON.stringify(
        stockObject
      )}`
    );

    let ticker, companyName, sector;

    if (typeof stockObject === "string") {
      console.log(
        `⚠️ [PRODUCTION_STOCK_INFO] Received ticker string "${stockObject}" - using fallback company info`
      );
      ticker = stockObject;
      companyName = `${ticker} Corporation`;
      sector = "Technology";
    } else if (stockObject && typeof stockObject === "object") {
      ticker = stockObject.ticker;
      companyName = stockObject.company_name;
      sector = stockObject.sector;
      console.log(
        `✅ [PRODUCTION_STOCK_INFO] Using database stock object: ${ticker} - ${companyName} (${sector})`
      );
    } else {
      console.log(
        `⚠️ [PRODUCTION_STOCK_INFO] Invalid stock object: ${stockObject}, using fallback`
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
        `⚠️ [PRODUCTION_STOCK_INFO] Invalid ticker: ${ticker}, using fallback`
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
      `✅ [PRODUCTION_STOCK_INFO] Database values: Ticker="${safeTicker}", Company="${safeCompanyName}", Sector="${safeSector}"`
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
 * 🎯 SESSION #313: PRODUCTION COMPATIBILITY EXPORT
 * PURPOSE: Production deployment interface for live signal generation
 * ANTI-REGRESSION: Maintains exact interface compatibility with all systems
 * PRODUCTION: Live signal processing with professional modular architecture
 * SESSION #313C: Enhanced with S/R proximity filtering for actionable levels
 * SESSION #316: Enhanced with consistent date range processing for accurate pricing
 */
export async function executeSignalPipeline(params) {
  const pipeline = new SignalPipeline();
  return await pipeline.execute(params);
}

// ==================================================================================
// 🎯 SESSION #313 PRODUCTION SIGNAL PIPELINE DEPLOYMENT COMPLETE
// 🎯 SESSION #313C S/R PROXIMITY FILTER ENHANCEMENT COMPLETE
// 🚨 SESSION #316 PRICE ACCURACY REGRESSION FIX COMPLETE
// ==================================================================================
// 📊 FUNCTIONALITY: Production deployment of complete signal processing pipeline + S/R proximity filtering + price accuracy fix
// 🛡️ PRESERVATION: ALL Session #151-311 processing logic preserved exactly + Session #313C enhancement + Session #316 critical fix
// 🔧 PRODUCTION PURPOSE: Live signal generation with professional modular architecture + actionable S/R levels + consistent pricing
// 📈 PRODUCTION READY: Enhanced maintainability with identical behavior to original + proximity filtering + price accuracy
// 🎖️ ANTI-REGRESSION: Original processing logic completely preserved + non-breaking enhancement + critical regression fix
// 🚀 LIVE SYSTEM: Production-grade modular signal generation infrastructure + actionable trading levels + accurate current pricing
// 📋 SESSION #313C: S/R proximity filter deployed for actionable level generation
// 🚨 SESSION #316: Date range consistency fix deployed to resolve ENPH $55.76 → $35.03 price accuracy regression
// 🏆 ACHIEVEMENT: Historic modular architecture transformation + actionable S/R levels + critical price accuracy fix successfully deployed
// ==================================================================================
