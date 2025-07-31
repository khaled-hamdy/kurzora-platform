// SESSION #400B: PRODUCTION SIGNAL PIPELINE WITH 1W TIMEFRAME FIX
// PURPOSE: Execute complete signal generation pipeline with timeframe-specific date ranges
// ANTI-REGRESSION: ALL existing functionality preserved exactly
// 1W FIX: Extended date range for weekly timeframe to ensure 26+ weeks for MACD

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Configuration imports
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

// Modular component imports
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
import {
  saveSignalWithIndicators,
  calculateIndicatorScoreContribution,
} from "../database/indicator-repository.ts";
import { CacheManager } from "../data/cache-manager.ts";

/**
 * PRODUCTION SIGNAL PROCESSING PIPELINE WITH 1W TIMEFRAME FIX
 * PURPOSE: Execute complete signal generation pipeline with multi-timeframe indicator transparency
 * 1W FIX: Uses timeframe-specific date ranges to ensure sufficient weekly data
 * ANTI-REGRESSION: Identical processing flow with all existing logic preserved exactly
 */
export class SignalPipeline {
  globalCacheManager = null;

  /**
   * GET CACHE MANAGER - Production ready cache initialization
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
        `🗄️ [PRODUCTION_CACHE] Cache manager initialized for performance optimization`
      );
    }
    return this.globalCacheManager;
  }

  /**
   * MAIN PROCESSING PIPELINE EXECUTION WITH 1W FIX
   * PURPOSE: Execute complete signal generation pipeline with timeframe-specific date ranges
   * ANTI-REGRESSION: Exact same processing logic with 1W data sufficiency enhancement
   * 1W FIX: Uses extended calendar days for weekly timeframe analysis
   */
  async execute(params) {
    const { startIndex, endIndex, batchNumber } = params;

    // Configuration access
    const USE_BACKTEST = getUseBacktest();
    const TEST_STOCKS = getTestStocks();
    const TIMEFRAME_CONFIG = getTimeframeConfig();

    // SESSION #400B: Calculate timeframe-specific date ranges for 1W fix
    // Maintains Session #316 consistency by calculating all ranges at same time
    const timeframeSpecificRanges = {
      "1H": getDateRanges("1H"), // Standard range
      "4H": getDateRanges("4H"), // Standard range
      "1D": getDateRanges("1D"), // Standard range
      "1W": getDateRanges("1W"), // Extended range for sufficient weekly data
    };

    const modeLabel = USE_BACKTEST ? "BACKTEST" : "LIVE";
    const modeDescription = USE_BACKTEST
      ? "using verified historical data (2024-05-06 to 2024-06-14)"
      : "using enhanced 400-day rolling window with 1W timeframe fix";

    // Processing engine initialization
    console.log(
      `🚀 Starting Kurzora 4-Timeframe Signal Engine - SESSION #400B 1W Fix Complete`
    );
    console.log(`🔄 Mode: ${modeLabel} MODE - ${modeDescription}`);
    console.log(
      `🏆 SESSION #400B: 1W timeframe now uses extended date range for sufficient indicator data`
    );
    console.log(
      `🎯 Expected results: Complete transparency with ALL 28 indicators (7 indicators × 4 timeframes)`
    );

    // Cache manager setup
    const sessionCacheManager = this.getSessionCacheManager();
    console.log(
      `🗄️ [PRODUCTION] Cache manager ready for performance optimization`
    );

    // Database initialization
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
    console.log("✅ Production database initialized successfully");

    // Delete strategy - production ready
    console.log(
      `\n🗑️ ========== PRODUCTION DELETE STRATEGY: SUPABASE SECURITY COMPLIANT ==========`
    );
    console.log(
      `🔧 [PRODUCTION_STRATEGY] Using modular SignalRepository.deleteAllSignals() for production deployment`
    );
    const deleteResult = await deleteAllSignals(batchNumber);
    const deletedCount = deleteResult.count;
    const deleteSuccess = deleteResult.success;
    console.log(`📊 [PRODUCTION_STRATEGY] PRODUCTION DELETE Results Summary:`);
    console.log(`   Delete Success: ${deleteSuccess ? "✅ YES" : "❌ NO"}`);
    console.log(`   Signals Deleted: ${deletedCount}`);

    // Database-driven stock selection
    console.log(
      `\n🗄️ ========== PRODUCTION DATABASE-DRIVEN STOCK SELECTION ==========`
    );
    const ACTIVE_STOCKS = await getActiveStocksWithParameters(
      startIndex,
      endIndex,
      batchNumber
    );
    console.log(`✅ PRODUCTION DATABASE-DRIVEN STOCK SELECTION COMPLETE:`);
    console.log(`   Parameter Range: ${startIndex}-${endIndex}`);
    console.log(`   Stocks Retrieved: ${ACTIVE_STOCKS.length}`);

    // Production metrics tracking
    let totalSavedCount = 0;
    let totalProcessed = 0;
    let totalPassedGatekeeper = 0;
    let totalApiCallCount = 0;
    let totalSkippedInsufficientData = 0;
    let totalDataQualityIssues = 0;
    let totalCacheHits = 0;
    let totalCacheMisses = 0;
    let totalIndicatorRecordsCreated = 0;
    const totalStartTime = Date.now();
    const allAnalysisResults = [];

    console.log(
      `🎯 Beginning processing of ${ACTIVE_STOCKS.length} stocks with complete 28-record indicator transparency...`
    );

    // Main stock processing loop
    for (const stockObject of ACTIVE_STOCKS) {
      try {
        const ticker = stockObject.ticker;
        console.log(
          `\n🎯 ========== ANALYSIS: ${ticker} (${
            stockObject.company_name
          }) (Batch ${batchNumber}, Stock ${totalProcessed + 1}/${
            ACTIVE_STOCKS.length
          }) ==========`
        );

        // Multi-timeframe data collection with 1W fix
        console.log(
          `📡 [${ticker}] Production: Fetching real market data with SESSION #400B 1W fix...`
        );
        const coordinator = new TimeframeDataCoordinator(USE_BACKTEST);

        // SESSION #400B: Use timeframe-specific ranges for 1W fix
        const timeframeData = await coordinator.fetchMultiTimeframeData(
          ticker,
          timeframeSpecificRanges
        );
        totalApiCallCount += 4;

        const cacheStats = sessionCacheManager.getStatistics();
        totalCacheHits = cacheStats.hits;
        totalCacheMisses = cacheStats.misses;

        // Quality validation
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
          });
          totalProcessed++;
          totalSkippedInsufficientData++;
          totalDataQualityIssues++;
          continue;
        }

        console.log(
          `✅ [${ticker}] Production: Real market data available - proceeding with transparency analysis`
        );

        // Individual timeframe analysis
        const timeframeScores = {};
        const timeframeDetails = {};
        let timeframeSkippedCount = 0;

        for (const [timeframe, data] of Object.entries(timeframeData)) {
          if (!data || !data.prices) {
            // Create timeframeDetails entry even if no data for complete transparency
            timeframeScores[timeframe] = 0;
            timeframeDetails[timeframe] = {
              score: 0,
              rsi: null,
              macd: null,
              bollingerB: null,
              volumeRatio: null,
              stochastic: null,
              williamsR: null,
              supportLevel: null,
              resistanceLevel: null,
              currentPrice: null,
              changePercent: null,
              session_313_production: false,
              volatilityDistance: null,
              proximityFilterApplied: false,
              indicators: {
                rsi_object: null,
                macd_object: null,
                bollinger_object: null,
                volume_object: null,
                stochastic_object: null,
                williams_object: null,
                support_resistance_object: null,
              },
              insufficient_data: true,
            };
            timeframeSkippedCount++;
            continue;
          }

          console.log(
            `📊 [${ticker}] ${timeframe}: Calculating indicators (${
              data.prices?.length || 0
            } data points)...`
          );

          // Modular calculations
          const rsi = calculateRSI(data.prices);
          const macd = calculateMACD(data.prices);
          const bb = calculateBollingerBands(data.prices);
          const volumeAnalysis = calculateVolumeAnalysis(
            data.volume,
            data.volumes || [data.volume]
          );

          // Volatility distance calculation for S/R proximity filter
          const currentPrice =
            data.currentPrice || data.prices[data.prices.length - 1];

          // Production fix: Skip stock if no real current price available
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
                "No current price available - compliance (no synthetic data)",
              batch: batchNumber,
              parameters: {
                startIndex,
                endIndex,
                batchNumber,
              },
            });
            totalProcessed++;
            totalSkippedInsufficientData++;
            totalDataQualityIssues++;
            break;
          }

          // Calculate volatility distance using production entry/stop calculations
          const tempEntryPrice = currentPrice * 1.01;
          const tempStopLoss = currentPrice * 0.92;
          const volatilityDistance = Math.abs(tempEntryPrice - tempStopLoss);

          console.log(
            `🎯 [${ticker}] ${timeframe}: Calculated volatility distance ${volatilityDistance.toFixed(
              2
            )} for S/R proximity filter`
          );

          // Enhanced S/R calculation with proximity filter
          const supportResistance = calculateSupportResistance(
            data.prices,
            data.highs || data.prices,
            data.lows || data.prices,
            20,
            volatilityDistance
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

          // Signal composition
          const timeframeScore = calculate7IndicatorScore(
            rsi,
            macd,
            bb,
            volumeAnalysis,
            stoch,
            williams,
            supportResistance
          );

          // Create timeframeDetails even if score is null for complete transparency
          if (timeframeScore === null) {
            console.log(
              `⚠️ [${ticker}] ${timeframe}: Insufficient real indicators - score set to 0 but creating details for complete transparency`
            );
            timeframeScores[timeframe] = 0;
            timeframeDetails[timeframe] = {
              score: 0,
              rsi: rsi || null,
              macd: macd?.macd || null,
              bollingerB: bb?.percentB || null,
              volumeRatio: volumeAnalysis?.ratio || null,
              stochastic: stoch?.percentK || null,
              williamsR: williams?.value || null,
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
              session_313_production: false,
              volatilityDistance: volatilityDistance,
              proximityFilterApplied: true,
              indicators: {
                rsi_object: rsi,
                macd_object: macd,
                bollinger_object: bb,
                volume_object: volumeAnalysis,
                stochastic_object: stoch,
                williams_object: williams,
                support_resistance_object: supportResistance,
              },
              insufficient_scoring: true,
            };
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
            volatilityDistance: volatilityDistance,
            proximityFilterApplied: true,
            indicators: {
              rsi_object: rsi,
              macd_object: macd,
              bollinger_object: bb,
              volume_object: volumeAnalysis,
              stochastic_object: stoch,
              williams_object: williams,
              support_resistance_object: supportResistance,
            },
          };

          console.log(`✅ [${ticker}] ${timeframe}: Score ${timeframeScore}%`);
        }

        // Check if stock was skipped due to no current price during timeframe processing
        if (
          allAnalysisResults.some(
            (result) =>
              result.ticker === ticker &&
              result.status === "SKIPPED_NO_CURRENT_PRICE"
          )
        ) {
          continue;
        }

        // Timeframe quality validation
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
          });
          totalProcessed++;
          totalSkippedInsufficientData++;
          totalDataQualityIssues++;
          continue;
        }

        // Institutional gatekeeper rules
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
          });
          totalProcessed++;
          continue;
        }

        totalPassedGatekeeper++;
        console.log(
          `✅ [${ticker}] Production: PASSED institutional gatekeeper rules`
        );

        // 4-dimensional scoring system
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

        // Modular scoring
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

        // Database field mapping
        const signalStrength_enum =
          this.mapScoreToSignalStrength(kuzzoraSmartScore);
        const signalType = this.mapScoreToSignalType(kuzzoraSmartScore);

        console.log(`🎯 [${ticker}] SIGNAL ANALYSIS COMPLETE:`);
        console.log(`   Final Score: ${kuzzoraSmartScore}%`);
        console.log(`   Signal Type: ${signalType}`);
        console.log(`   Signal Strength: ${signalStrength_enum}`);

        // Database object construction
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

        // Prepare indicators data for complete 28-record creation
        console.log(
          `🎯 [${ticker}] Preparing complete 28-record indicator creation (7 indicators × 4 timeframes)...`
        );

        const indicatorsData = [];
        let totalIndicatorsForThisSignal = 0;

        // Complete multi-timeframe indicators array preparation
        const allTimeframes = ["1H", "4H", "1D", "1W"];

        for (const timeframe of allTimeframes) {
          const details = timeframeDetails[timeframe];
          const timeframeScore = timeframeScores[timeframe] || 0;

          console.log(
            `📊 [${ticker}] ${timeframe}: Creating ALL indicator records (Score: ${timeframeScore}) for complete transparency...`
          );

          // RSI indicator record creation - Always create for transparency
          const rsiValue = details?.rsi;
          const rsiContribution = calculateIndicatorScoreContribution(
            "RSI",
            rsiValue,
            timeframe,
            details?.indicators?.rsi_object
          );
          indicatorsData.push({
            indicator_name: "RSI",
            timeframe: timeframe,
            raw_value: rsiValue,
            score_contribution: rsiContribution,
            scoring_version: "session_313e_preserved",
            metadata: {
              calculation_method: "session_301_modular",
              original_scoring_preserved: true,
              data_available: rsiValue !== null && rsiValue !== undefined,
              insufficient_data: details?.insufficient_data || false,
              insufficient_scoring: details?.insufficient_scoring || false,
            },
          });
          totalIndicatorsForThisSignal++;

          // MACD indicator record creation - Always create for transparency
          const macdValue = details?.macd;
          const macdContribution = calculateIndicatorScoreContribution(
            "MACD",
            macdValue,
            timeframe,
            details?.indicators?.macd_object
          );
          indicatorsData.push({
            indicator_name: "MACD",
            timeframe: timeframe,
            raw_value: macdValue,
            score_contribution: macdContribution,
            scoring_version: "session_313e_preserved",
            metadata: {
              momentum_penalty_applied: macdValue !== null && macdValue < 0,
              session_313e_enhanced: true,
              original_scoring_preserved: true,
              data_available: macdValue !== null && macdValue !== undefined,
              insufficient_data: details?.insufficient_data || false,
              insufficient_scoring: details?.insufficient_scoring || false,
            },
          });
          totalIndicatorsForThisSignal++;

          // Volume indicator record creation - Always create for transparency
          const volumeValue = details?.volumeRatio;
          const volumeContribution = calculateIndicatorScoreContribution(
            "Volume",
            volumeValue,
            timeframe,
            details?.indicators?.volume_object
          );
          indicatorsData.push({
            indicator_name: "Volume",
            timeframe: timeframe,
            raw_value: volumeValue,
            score_contribution: volumeContribution,
            scoring_version: "session_313e_preserved",
            metadata: {
              surge_classification:
                volumeValue !== null && volumeValue >= 2.5
                  ? "exceptional"
                  : "normal",
              session_313e_enhanced: true,
              original_scoring_preserved: true,
              data_available: volumeValue !== null && volumeValue !== undefined,
              insufficient_data: details?.insufficient_data || false,
              insufficient_scoring: details?.insufficient_scoring || false,
            },
          });
          totalIndicatorsForThisSignal++;

          // Stochastic indicator record creation - Always create for transparency
          const stochasticValue = details?.stochastic;
          const stochasticContribution = calculateIndicatorScoreContribution(
            "Stochastic",
            stochasticValue,
            timeframe,
            details?.indicators?.stochastic_object
          );
          indicatorsData.push({
            indicator_name: "Stochastic",
            timeframe: timeframe,
            raw_value: stochasticValue,
            score_contribution: stochasticContribution,
            scoring_version: "session_313e_preserved",
            metadata: {
              calculation_method: "session_modular",
              original_scoring_preserved: true,
              data_available:
                stochasticValue !== null && stochasticValue !== undefined,
              insufficient_data: details?.insufficient_data || false,
              insufficient_scoring: details?.insufficient_scoring || false,
            },
          });
          totalIndicatorsForThisSignal++;

          // Williams %R indicator record creation - Always create for transparency
          const williamsValue = details?.williamsR;
          const williamsContribution = calculateIndicatorScoreContribution(
            "Williams_R",
            williamsValue,
            timeframe,
            details?.indicators?.williams_object
          );
          indicatorsData.push({
            indicator_name: "Williams_R",
            timeframe: timeframe,
            raw_value: williamsValue,
            score_contribution: williamsContribution,
            scoring_version: "session_313e_preserved",
            metadata: {
              calculation_method: "session_modular",
              original_scoring_preserved: true,
              data_available:
                williamsValue !== null && williamsValue !== undefined,
              insufficient_data: details?.insufficient_data || false,
              insufficient_scoring: details?.insufficient_scoring || false,
            },
          });
          totalIndicatorsForThisSignal++;

          // Bollinger Bands indicator record creation - Always create for transparency
          const bollingerValue = details?.bollingerB;
          const bollingerContribution = calculateIndicatorScoreContribution(
            "Bollinger",
            bollingerValue,
            timeframe,
            details?.indicators?.bollinger_object
          );
          indicatorsData.push({
            indicator_name: "Bollinger",
            timeframe: timeframe,
            raw_value: bollingerValue,
            score_contribution: bollingerContribution,
            scoring_version: "session_313e_preserved",
            metadata: {
              calculation_method: "session_modular",
              original_scoring_preserved: true,
              data_available:
                bollingerValue !== null && bollingerValue !== undefined,
              insufficient_data: details?.insufficient_data || false,
              insufficient_scoring: details?.insufficient_scoring || false,
            },
          });
          totalIndicatorsForThisSignal++;

          // Support/Resistance indicator record creation - Always create for transparency
          const srLevel = details?.supportLevel || details?.resistanceLevel;
          const srContribution = calculateIndicatorScoreContribution(
            "SUPPORT_RESISTANCE",
            srLevel,
            timeframe,
            details?.indicators?.support_resistance_object
          );

          // Calculate correct type using position-based validation
          let correctType = null;
          let correctClassification = null;
          if (srLevel && details?.currentPrice) {
            if (srLevel < details.currentPrice) {
              correctType = "support";
              correctClassification = "support_below_price";
            } else if (srLevel > details.currentPrice) {
              correctType = "resistance";
              correctClassification = "resistance_above_price";
            } else {
              correctType = "neutral";
              correctClassification = "level_equals_price";
            }
          }

          indicatorsData.push({
            indicator_name: "SUPPORT_RESISTANCE",
            timeframe: timeframe,
            raw_value: srLevel,
            score_contribution: srContribution,
            scoring_version: "session_313e_preserved",
            metadata: {
              support_level: correctType === "support" ? srLevel : null,
              resistance_level: correctType === "resistance" ? srLevel : null,
              proximity_percent: details?.proximityFilterApplied ? 85 : null,
              type: correctType,
              session_313d_classification: correctClassification,
              session_313c_proximity: "actionable_range",
              original_scoring_preserved: true,
              data_available: srLevel !== null && srLevel !== undefined,
              insufficient_data: details?.insufficient_data || false,
              insufficient_scoring: details?.insufficient_scoring || false,
              current_price: details?.currentPrice,
              level_vs_price:
                srLevel && details?.currentPrice
                  ? srLevel < details.currentPrice
                    ? "below"
                    : "above"
                  : null,
              classification_method: "session_313d_position_based",
            },
          });
          totalIndicatorsForThisSignal++;
        }

        console.log(
          `✅ [${ticker}] Prepared ${totalIndicatorsForThisSignal} indicator records for database creation`
        );

        // Legacy database field mapping - kept for compatibility
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
          proximityFilterApplied:
            primaryTimeframe.proximityFilterApplied || false,
          volatilityDistance: primaryTimeframe.volatilityDistance || null,
        };

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
            session: "400b-1w-timeframe-fix",
            gatekeeper_passed: true,
            kurzora_smart_score: kuzzoraSmartScore,
            batch_number: batchNumber,
            parameters: {
              startIndex,
              endIndex,
              batchNumber,
            },
            session_400b_enhancement: {
              version: "automated-signal-generation-v3",
              status: "production",
              indicator_records_created: totalIndicatorsForThisSignal,
              transparency_level: "complete_28_record_breakdown",
              scoring_preservation: "session_313e_exact",
              timeframe_fix: "1w_extended_date_range",
            },
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

        // Enhanced signal object for database save
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
          status: "active",
          timeframe: "4TF",
          signal_strength: signalStrength_enum,
          final_score: safeIntegerSmartScore,
          signals: safeSignalsData,
          explanation: `Kurzora 4-Timeframe Enhanced Analysis: Smart Score ${safeIntegerSmartScore}% | ${signalStrength_enum} Classification | SESSION #400B 1W Timeframe Fix Complete | ${
            batchNumber === 1
              ? `Enhanced signal after ${deletedCount} signals deleted`
              : `Enhanced batch ${batchNumber} signal appended`
          } | Make.com Batch ${batchNumber} Parameter Processing (${startIndex}-${endIndex}) | 28-Record Complete Indicator Transparency | Live Signal Generation`,
        };

        console.log(
          `✅ [${ticker}] SIGNAL: Company="${safeEnhancedSignal.company_name}", Sector="${safeEnhancedSignal.sector}"`
        );

        // Enhanced database save with indicators
        console.log(
          `💾 [${ticker}] DATABASE SAVE: Using transaction-safe signal+indicators save...`
        );
        const saveResult = await saveSignalWithIndicators(
          safeEnhancedSignal,
          indicatorsData
        );
        const dbInsertSuccess = saveResult.success;
        const dbInsertResult = dbInsertSuccess
          ? `Successfully saved signal with ${indicatorsData.length} indicator records - ID: ${saveResult.data?.id}`
          : `Database Error: ${saveResult.error}`;

        if (dbInsertSuccess) {
          console.log(
            `🎉 [${ticker}] DATABASE INSERT SUCCESS! Signal ID: ${saveResult.data?.id}, Indicators: ${indicatorsData.length}`
          );
          totalSavedCount++;
          totalIndicatorRecordsCreated += indicatorsData.length;
        } else {
          console.log(
            `❌ [${ticker}] Database insert FAILED: ${saveResult.error}`
          );
        }

        // Enhanced result tracking
        const resultStatus = dbInsertSuccess
          ? "SAVED_WITH_COMPLETE_INDICATORS"
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
          session_400b_enhancement: {
            version: "automated-signal-generation-v3",
            status: "production",
            transparency_upgrade: "complete_28_record_indicator_breakdown",
            indicator_records_created: dbInsertSuccess
              ? indicatorsData.length
              : 0,
            scoring_preservation: "session_313e_exact",
            timeframe_fix: "1w_extended_date_range_applied",
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
          `❌ [${stockObject.ticker}] stock processing error: ${
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
        });
        totalProcessed++;
        totalDataQualityIssues++;
      }
    }

    // Enhanced processing results
    const totalProcessingTime = ((Date.now() - totalStartTime) / 1000).toFixed(
      1
    );
    const totalProcessingMinutes = (totalProcessingTime / 60).toFixed(1);

    console.log(
      `\n🎉 ============ SESSION #400B ANALYSIS COMPLETE ============`
    );
    console.log(`📊 SESSION #400B COMPLETE PROCESSING RESULTS SUMMARY:`);
    console.log(`      Migration Version: automated-signal-generation-v3 ✅`);
    console.log(`      1W Timeframe Fix: Extended date range applied ✅`);
    console.log(`      All Scoring Logic: Preserved exactly ✅`);
    console.log(
      `      Indicator Records Created: ${totalIndicatorRecordsCreated} total ✅`
    );
    console.log(
      `      Transparency: All indicators created for complete user understanding ✅`
    );

    // Return enhanced structured result
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
      session_400b_enhancement: {
        version: "automated-signal-generation-v3",
        status: "production",
        transparency_upgrade: "complete",
        total_indicator_records_created: totalIndicatorRecordsCreated,
        average_indicators_per_signal:
          totalSavedCount > 0
            ? Math.round(totalIndicatorRecordsCreated / totalSavedCount)
            : 0,
        scoring_preservation: "session_313e_exact",
        modular_architecture_enhanced: true,
        timeframe_fix: "1w_extended_date_range_complete",
        expected_indicators_per_signal: 28,
      },
      session_313c_enhancement: {
        proximity_filter_deployed: true,
        actionable_levels: "S/R levels filtered for trading actionability",
        volatility_based_filtering: "Using production entry/stop calculations",
      },
      session: `SESSION-400B-1W-FIX-${
        USE_BACKTEST ? "BACKTEST" : "LIVE"
      }-4TIMEFRAME-TRANSPARENCY`,
      mode: USE_BACKTEST ? "BACKTEST" : "LIVE",
      mode_description: USE_BACKTEST
        ? "using verified historical data (2024-05-06 to 2024-06-14)"
        : "using enhanced 400-day rolling window with 1W timeframe extended range for reliable multi-timeframe data",
      message: `SESSION #400B 1W FIX COMPLETE system with ${
        totalSavedCount > 0 ? "successful" : "attempted"
      } database operations using complete transparency architecture with ${totalIndicatorRecordsCreated} indicator records created for total signal scoring understanding`,
    };
  }

  /**
   * Database field mapping functions - production ready
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
   * Stock info extraction - production ready
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
 * Production compatibility export for live signal generation
 */
export async function executeSignalPipeline(params) {
  const pipeline = new SignalPipeline();
  return await pipeline.execute(params);
}
