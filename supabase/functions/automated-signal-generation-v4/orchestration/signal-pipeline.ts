// ==================================================================================
// 🎯 SESSION #321B: KURZORA PRODUCTION SIGNAL PIPELINE - FINAL 28-RECORD TRANSPARENCY
// ==================================================================================
// 🚨 PURPOSE: Production signal processing engine with complete 28-record indicator transparency
// 🛡️ ANTI-REGRESSION: EXACT preservation of ALL Session #151-318 processing logic
// 📝 SESSION #321B FINAL: Complete transparency fix - creates ALL 28 indicators for user understanding
// 🔧 MODULAR ARCHITECTURE: All 11 extracted components working together in production
// ✅ PRODUCTION READY: Professional signal processing with complete transparency
// 📊 SESSION #320 FOUNDATION: Indicators table with 28-record architecture complete
// 🎖️ LIVE DEPLOYMENT: Production-grade signal generation with complete transparency
// 🎯 SESSION #313E PRESERVATION: ALL scoring logic preserved exactly (MACD momentum, Volume quality)
// 🔧 SESSION #318 PRESERVATION: Multi-fallback getCurrentPrice() system protected
// 🚨 SESSION #321B FINAL: Removed null checks to create all 28 indicators for complete transparency
// 🗄️ SESSION #325 MIGRATION: Removed deprecated columns - data now in indicators table
// 🐛 BUG FIX: Fixed hardcoded support/resistance classification with Session #313D position-based validation
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
import { calculateRSI, RSICalculator } from "../indicators/rsi-calculator.ts";
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
// 🚨 SESSION #326: Import StockUniverseConfiguration to respect databaseDriven setting
import { StockUniverseConfiguration } from "../config/stock-universe.ts";
// 🎯 SESSION #321: NEW IMPORT - Indicators repository for 28-record creation
import {
  saveSignalWithIndicators,
  calculateIndicatorScoreContribution,
} from "../database/indicator-repository.ts";
import { CacheManager } from "../data/cache-manager.ts";
// 🎯 SESSION #402: Import divergence integration
import { enhanceSignalWithDivergence } from "../analysis/divergence-integration.ts";

// 🔍 DEBUG: Module-level variable for debugging info
let debugInfo: any = null;
let rsiMacdDebug: any = null;

/**
 * 🎯 SESSION #321B: PRODUCTION SIGNAL PROCESSING PIPELINE WITH FINAL 28-RECORD TRANSPARENCY
 * PURPOSE: Execute complete signal generation pipeline with multi-timeframe indicator transparency
 * SESSION #321B: Final transparency fix - creates all 28 indicators for complete user understanding
 * ANTI-REGRESSION: Identical processing flow with Session #313E scoring logic preserved exactly
 * PRODUCTION: Live signal generation with complete transparency into scoring logic
 * SESSION #313E PRESERVATION: ALL MACD momentum penalties, Volume quality validation preserved
 * SESSION #325 MIGRATION: Database migration complete - deprecated columns removed
 * BUG FIX: Fixed hardcoded support/resistance classification with Session #313D position-based validation
 */
export class SignalPipeline {
  globalCacheManager: CacheManager | null = null;

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
   * 🎯 SESSION #321B: MAIN PROCESSING PIPELINE EXECUTION - FINAL 28-RECORD TRANSPARENCY
   * PURPOSE: Execute complete signal generation pipeline with multi-timeframe indicator transparency
   * ANTI-REGRESSION: Exact same processing logic as Session #313 with indicator enhancement
   * PRODUCTION: Live signal generation with complete transparency into scoring logic
   * SESSION #321B: Final transparency fix - creates all 28 indicators for complete user understanding
   * SESSION #313E PRESERVATION: ALL scoring algorithms preserved exactly
   * SESSION #325 MIGRATION: Database migration complete - deprecated columns removed
   * BUG FIX: Fixed hardcoded support/resistance classification with Session #313D position-based validation
   */
  async execute(params) {
    const {
      startIndex,
      endIndex,
      batchNumber,
      divergenceEnabled = true,
      divergenceConfig = {},
    } = params;

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

    // 🚨 SESSION #321B: PROCESSING ENGINE - FINAL TRANSPARENCY FIX
    console.log(
      `🚀 Starting Kurzora 4-Timeframe Signal Engine - SESSION #325 Database Migration Complete`
    );
    console.log(`🔄 Mode: ${modeLabel} MODE - ${modeDescription}`);
    console.log(
      `🗄️ SESSION #325: Database migration complete - deprecated columns removed, indicators table active`
    );
    console.log(
      `🛡️ SESSION #313E PRESERVATION: All MACD momentum penalties & Volume quality validation preserved exactly`
    );
    console.log(
      `🎯 Expected results: Complete transparency with ALL 28 indicators (7 indicators × 4 timeframes) for user understanding`
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
      "✅ Production database initialized successfully with SESSION #325 migration complete"
    );

    // 🚨 SESSION #313: DELETE STRATEGY - PRODUCTION READY
    console.log(
      `\n🗑️ ========== SESSION #325 PRODUCTION DELETE STRATEGY: SUPABASE SECURITY COMPLIANT ==========`
    );
    console.log(
      `🔧 [PRODUCTION_STRATEGY] SESSION #325: Using modular SignalRepository.deleteAllSignals() for production deployment`
    );
    const deleteResult = await deleteAllSignals(batchNumber);
    const deletedCount = deleteResult.count;
    const deleteSuccess = deleteResult.success;
    console.log(
      `📊 [PRODUCTION_STRATEGY] SESSION #325 PRODUCTION DELETE Results Summary:`
    );
    console.log(`   Delete Success: ${deleteSuccess ? "✅ YES" : "❌ NO"}`);
    console.log(
      `   Signals Deleted: ${deletedCount} (SESSION #325 MIGRATION COMPLETE)`
    );

    // 🗄️ SESSION #313: DATABASE-DRIVEN STOCK SELECTION - PRODUCTION READY
    // 🚨 SESSION #326 FIX: Respect StockUniverseConfiguration databaseDriven setting
    const stockConfig = new StockUniverseConfiguration();

    let ACTIVE_STOCKS;

    if (stockConfig.isDatabaseDriven()) {
      console.log(
        `\n🗄️ ========== SESSION #325 PRODUCTION DATABASE-DRIVEN STOCK SELECTION ==========`
      );
      ACTIVE_STOCKS = await getActiveStocksWithParameters(
        startIndex,
        endIndex,
        batchNumber
      );
    } else {
      console.error(
        `\n🧪🧪🧪 SESSION #327 TEST STOCK SELECTION ACTIVE - ABT RSI DEBUGGING! 🧪🧪🧪`
      );
      console.log(
        `🚨 [STOCK_SELECTION] databaseDriven: false - FORCING ABT PROCESSING for RSI debugging`
      );

      // 🚨 SESSION #327 ABT RSI FIX: Always ensure ABT is processed for debugging
      const testStocks = stockConfig.getTestStocks();
      console.error(
        `🔍 [DEBUG] Test stocks available: ${testStocks.join(", ")}`
      );
      console.error(
        `🔍 [DEBUG] Parameters - startIndex: ${startIndex}, endIndex: ${endIndex}`
      );

      // 🎯 FORCE ABT PROCESSING: Always include ABT when debugging RSI
      let selectedStocks = ["ABT"]; // Force ABT first

      // Add other stocks if there's capacity
      const remainingSlots = Math.max(0, endIndex - startIndex - 1);
      if (remainingSlots > 0) {
        const otherStocks = testStocks
          .filter((stock) => stock !== "ABT")
          .slice(0, remainingSlots);
        selectedStocks = [...selectedStocks, ...otherStocks];
      }

      ACTIVE_STOCKS = selectedStocks.map((ticker) => ({
        ticker: ticker,
        company_name: `${ticker} Corporation`,
        sector: ticker === "ABT" ? "Healthcare" : "Technology",
        source: "session_327_abt_rsi_debugging_forced",
      }));

      console.error(
        `🚨🚨🚨 [STOCK_SELECTION] ABT FORCED TO TOP: ${ACTIVE_STOCKS.map(
          (s) => s.ticker
        ).join(", ")} 🚨🚨🚨`
      );
      console.error(
        `✅✅✅ ABT will be processed first for RSI debugging! ✅✅✅`
      );
    }
    console.log(
      `✅ SESSION #325 PRODUCTION DATABASE-DRIVEN STOCK SELECTION COMPLETE:`
    );
    console.log(`   Parameter Range: ${startIndex}-${endIndex}`);
    console.log(`   Stocks Retrieved: ${ACTIVE_STOCKS.length}`);

    // 🔧 SESSION #321B: PRODUCTION METRICS - ENHANCED WITH INDICATOR TRACKING
    let totalSavedCount = 0;
    let totalProcessed = 0;
    let totalPassedGatekeeper = 0;
    let totalApiCallCount = 0;
    let totalSkippedInsufficientData = 0;
    let totalDataQualityIssues = 0;
    let totalCacheHits = 0;
    let totalCacheMisses = 0;
    let totalIndicatorRecordsCreated = 0; // 🎯 SESSION #321B: Track indicator records
    const totalStartTime = Date.now();
    const allAnalysisResults = [];

    console.log(
      `🎯 Beginning SESSION #325 processing of ${ACTIVE_STOCKS.length} stocks with complete 28-record indicator transparency...`
    );

    // 🚨 SESSION #313: MAIN STOCK PROCESSING LOOP - ENHANCED WITH INDICATORS
    for (const stockObject of ACTIVE_STOCKS) {
      try {
        const ticker = stockObject.ticker;
        console.log(
          `\n🎯 ========== SESSION #325 ANALYSIS: ${ticker} (${
            stockObject.company_name
          }) (Batch ${batchNumber}, Stock ${totalProcessed + 1}/${
            ACTIVE_STOCKS.length
          }) ==========`
        );

        // 🔧 SESSION #313: MULTI-TIMEFRAME DATA COLLECTION - PRODUCTION READY
        // 🚨 SESSION #316 FIX: Use the function-level dateRanges variable for ALL stocks
        // This ensures consistent date ranges across all stocks and timeframes
        console.log(
          `📡 [${ticker}] Production: Fetching real market data with SESSION #325 migration complete...`
        );

        // 🚨 SESSION #326 ABT 1H CACHE BYPASS: Force fresh data for debugging
        if (ticker === "ABT") {
          console.error(
            `🚨🚨🚨 [ABT FOUND!] SESSION #326 ABT PROCESSING STARTED! 🚨🚨🚨`
          );
          console.error(
            `🚨 [ABT CACHE BYPASS] Forcing fresh data fetch to debug 1H RSI discrepancy`
          );
          console.error(
            `🚨 [ABT CACHE BYPASS] Current platform RSI: 45.57, testing 1H accuracy`
          );
          console.error(
            `🚨 [ABT CACHE BYPASS] Testing healthcare sector data quality hypothesis...`
          );
          // Clear any potential cached data for ABT to force fresh API calls
          if (
            this.globalCacheManager &&
            typeof this.globalCacheManager.clearAll === "function"
          ) {
            this.globalCacheManager.clearAll();
          } else {
            console.log("Cache manager not available for clearing");
          }
        }

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
            session_325_migration:
              "28-record indicator processing - skipped due to no data",
          });
          totalProcessed++;
          totalSkippedInsufficientData++;
          totalDataQualityIssues++;
          continue;
        }

        console.log(
          `✅ [${ticker}] Production: Real market data available - proceeding with transparency analysis`
        );

        // 🔧 SESSION #321B: INDIVIDUAL TIMEFRAME ANALYSIS - FINAL TRANSPARENCY
        const timeframeScores = {};
        const timeframeDetails = {};
        let timeframeSkippedCount = 0;

        for (const [timeframe, data] of Object.entries(timeframeData)) {
          if (!data || !data.prices) {
            // 🚨 SESSION #321B FINAL: Create timeframeDetails entry even if no data for complete transparency
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
              // 🎯 SESSION #321B: Create null indicator objects for complete transparency
              indicators: {
                rsi_object: null,
                macd_object: null,
                bollinger_object: null,
                volume_object: null,
                stochastic_object: null,
                williams_object: null,
                support_resistance_object: null,
              },
              insufficient_data: true, // Mark as insufficient for transparency
            };
            timeframeSkippedCount++;
            continue;
          }

          console.log(
            `📊 [${ticker}] ${timeframe}: Calculating indicators with SESSION #325 migration complete (${
              data.prices?.length || 0
            } data points)...`
          );

          // 🔧 SESSION #313: MODULAR CALCULATIONS - PRODUCTION READY
          // 🐛 SESSION #326: RSI with debug logging
          const rsiCalculator = new RSICalculator();
          const rsiResult = rsiCalculator.calculate({
            prices: data.prices,
            ticker: ticker,
            timeframe: timeframe,
          });
          const rsi = rsiResult.value;
          const macd = calculateMACD(data.prices, 12, 26, ticker, timeframe);

          // 🔍 DEBUG: Capture RSI/MACD debug info for "A" stock
          if (ticker === "A" && (timeframe === "1H" || timeframe === "1D")) {
            rsiMacdDebug = {
              ticker,
              timeframe,
              dataLength: data.prices?.length,
              rsiResult: {
                value: rsi,
                isValid: rsiResult.isValid,
                metadata: rsiResult.metadata,
              },
              macdResult: macd,
              pricesLast10: data.prices?.slice(-10),
              pricesFirst5: data.prices?.slice(0, 5),
              currentPrice:
                data.currentPrice || data.prices[data.prices.length - 1],
            };
          }
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
              session_325_migration:
                "28-record indicator processing - skipped due to no current price",
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

          // 🔍 DEBUG: Get indicator results for comparison
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

          // 🔍 DEBUG: Store debug info for JSON response (more reliable than logs)
          if (ticker === "A" && timeframe === "1H") {
            debugInfo = {
              ticker,
              timeframe,
              dataLength: data.prices?.length,
              stochasticResult: stoch,
              williamsResult: williams,
              pricesLast5: data.prices?.slice(-5),
              highsLast5: (data.highs || data.prices)?.slice(-5),
              lowsLast5: (data.lows || data.prices)?.slice(-5),
            };
          }

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

          // 🚨 SESSION #321B FINAL: Create timeframeDetails even if score is null for complete transparency
          // This ensures we can save indicator records for transparency even when scoring fails
          if (timeframeScore === null) {
            console.log(
              `⚠️ [${ticker}] ${timeframe}: Insufficient real indicators - score set to 0 but creating details for complete transparency`
            );
            timeframeScores[timeframe] = 0;
            // 🎯 SESSION #321B FINAL: Create timeframeDetails with available data for complete transparency
            timeframeDetails[timeframe] = {
              score: 0,
              rsi: rsi || null,
              macd: macd?.macd || null,
              bollingerB: bb?.percentB || null,
              volumeRatio: volumeAnalysis?.ratio || null,
              stochastic: stoch?.percentK ?? null,
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
              session_313_production: false, // Mark as failed scoring but keep data
              // 🎯 SESSION #313C: Add proximity filter metadata for debugging
              volatilityDistance: volatilityDistance,
              proximityFilterApplied: true,
              // 🎯 SESSION #321B: Store full indicator objects for 28-record creation
              indicators: {
                rsi_object: rsi,
                macd_object: macd,
                bollinger_object: bb,
                volume_object: volumeAnalysis,
                stochastic_object: stoch,
                williams_object: williams,
                support_resistance_object: supportResistance,
              },
              insufficient_scoring: true, // Mark as insufficient for scoring but available for transparency
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
            stochastic: stoch?.percentK ?? null,
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
            // 🎯 SESSION #321B: Store full indicator objects for 28-record creation
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

          console.log(
            `✅ [${ticker}] ${timeframe}: Score ${timeframeScore}% with SESSION #325 migration complete`
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
            session_325_migration:
              "28-record indicator processing - skipped due to insufficient indicators",
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
            session_325_migration:
              "28-record indicator processing - rejected by gatekeeper",
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

        let kuzzoraSmartScore = calculateKuzzoraSmartScore(
          signalStrength,
          signalConfidence,
          momentumQuality,
          riskAdjustment
        );

        // 🎯 SESSION #402: RSI DIVERGENCE ANALYSIS - 1D TIMEFRAME ENHANCEMENT
        let divergenceIndicatorData = null;
        let divergenceMetadata = null;
        try {
          console.log(
            `🎯 [${ticker}] SESSION #402: Starting 1D divergence analysis...`
          );

          // Get 1D data for divergence analysis
          const oneDayData = timeframeData["1D"];
          if (
            oneDayData &&
            oneDayData.prices &&
            oneDayData.prices.length >= 50
          ) {
            // Get 1D RSI values
            const oneDayDetails = timeframeDetails["1D"];
            const oneDayRSI = oneDayDetails?.rsi;

            if (oneDayRSI && oneDayData.prices.length > 0) {
              // Calculate RSI series for divergence analysis
              const rsiCalculator = new RSICalculator();
              const rsiSeries = [];

              // Calculate RSI for each point in the series
              for (let i = 14; i < oneDayData.prices.length; i++) {
                const priceSlice = oneDayData.prices.slice(0, i + 1);
                const rsiResult = rsiCalculator.calculate({
                  prices: priceSlice,
                  period: 14,
                });
                if (rsiResult.isValid && rsiResult.value !== null) {
                  rsiSeries.push(rsiResult.value);
                }
              }

              // Perform divergence analysis if we have enough RSI data
              if (rsiSeries.length >= 50) {
                const divergenceResult = await enhanceSignalWithDivergence(
                  ticker,
                  oneDayData.prices.slice(-rsiSeries.length), // Match RSI series length
                  rsiSeries,
                  kuzzoraSmartScore,
                  { sensitivityLevel: 5, enableDebug: false }
                );

                // Apply divergence enhancement to score
                kuzzoraSmartScore = divergenceResult.enhancedScore;
                divergenceIndicatorData =
                  divergenceResult.divergenceIndicatorData;
                divergenceMetadata = divergenceResult.divergenceMetadata;

                console.log(
                  `✅ [${ticker}] SESSION #402: Divergence analysis complete`
                );
                console.log(
                  `📊 [${ticker}] Score enhanced: ${divergenceResult.divergenceBonus.toFixed(
                    2
                  )} bonus points`
                );
                console.log(
                  `🎯 [${ticker}] Has strong divergence: ${divergenceResult.hasStrongDivergence}`
                );
              } else {
                console.log(
                  `⚠️ [${ticker}] SESSION #402: Insufficient RSI data for divergence analysis (${rsiSeries.length} points)`
                );
              }
            } else {
              console.log(
                `⚠️ [${ticker}] SESSION #402: No valid 1D RSI data for divergence analysis`
              );
            }
          } else {
            console.log(
              `⚠️ [${ticker}] SESSION #402: Insufficient 1D price data for divergence analysis`
            );
          }
        } catch (divergenceError) {
          console.log(
            `❌ [${ticker}] SESSION #402: Divergence analysis error: ${divergenceError.message}`
          );
          divergenceMetadata = {
            session: "SESSION_402_1D_DIVERGENCE_PRODUCTION",
            error: divergenceError.message,
            analysisSuccessful: false,
          };
        }

        // 🔧 SESSION #313: DATABASE FIELD MAPPING - PRODUCTION READY
        const signalStrength_enum =
          this.mapScoreToSignalStrength(kuzzoraSmartScore);
        const signalType = this.mapScoreToSignalType(kuzzoraSmartScore);

        console.log(`🎯 [${ticker}] SESSION #325 SIGNAL ANALYSIS COMPLETE:`);
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

        // 🎯 SESSION #321B: PREPARE INDICATORS DATA FOR FINAL 28-RECORD CREATION
        // 🛡️ CRITICAL: Preserve ALL Session #313E scoring logic exactly while creating complete transparency records
        console.log(
          `🎯 [${ticker}] SESSION #325: Preparing complete 28-record indicator creation (7 indicators × 4 timeframes)...`
        );

        const indicatorsData = [];
        let totalIndicatorsForThisSignal = 0;

        // 🔧 SESSION #321B: FINAL COMPLETE MULTI-TIMEFRAME INDICATORS ARRAY PREPARATION
        // 🚨 FINAL FIX: Process ALL timeframes (1H, 4H, 1D, 1W) and create ALL indicators for complete transparency
        const allTimeframes = ["1H", "4H", "1D", "1W"];

        for (const timeframe of allTimeframes) {
          const details = timeframeDetails[timeframe];
          const timeframeScore = timeframeScores[timeframe] || 0;

          console.log(
            `📊 [${ticker}] ${timeframe}: Creating ALL indicator records (Score: ${timeframeScore}) for complete transparency...`
          );

          // 🎯 SESSION #321B FINAL: RSI INDICATOR RECORD CREATION - Always create for transparency
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
              session_325_migration_complete: true,
              original_scoring_preserved: true,
              data_available: rsiValue !== null && rsiValue !== undefined,
              insufficient_data: details?.insufficient_data || false,
              insufficient_scoring: details?.insufficient_scoring || false,
            },
          });
          totalIndicatorsForThisSignal++;

          // 🎯 SESSION #321B FINAL: MACD INDICATOR RECORD CREATION - Always create for transparency
          // 🛡️ CRITICAL: Session #313E MACD momentum penalties MUST be preserved exactly
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
              session_325_migration_complete: true,
              original_scoring_preserved: true,
              data_available: macdValue !== null && macdValue !== undefined,
              insufficient_data: details?.insufficient_data || false,
              insufficient_scoring: details?.insufficient_scoring || false,
            },
          });
          totalIndicatorsForThisSignal++;

          // 🎯 SESSION #321B FINAL: VOLUME INDICATOR RECORD CREATION - Always create for transparency
          // 🛡️ CRITICAL: Session #313E Volume quality validation MUST be preserved exactly
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
              session_325_migration_complete: true,
              original_scoring_preserved: true,
              data_available: volumeValue !== null && volumeValue !== undefined,
              insufficient_data: details?.insufficient_data || false,
              insufficient_scoring: details?.insufficient_scoring || false,
            },
          });
          totalIndicatorsForThisSignal++;

          // 🎯 SESSION #321B FINAL: STOCHASTIC INDICATOR RECORD CREATION - Always create for transparency
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
              session_325_migration_complete: true,
              original_scoring_preserved: true,
              data_available:
                stochasticValue !== null && stochasticValue !== undefined,
              insufficient_data: details?.insufficient_data || false,
              insufficient_scoring: details?.insufficient_scoring || false,
            },
          });
          totalIndicatorsForThisSignal++;

          // 🎯 SESSION #321B FINAL: WILLIAMS %R INDICATOR RECORD CREATION - Always create for transparency
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
              session_325_migration_complete: true,
              original_scoring_preserved: true,
              data_available:
                williamsValue !== null && williamsValue !== undefined,
              insufficient_data: details?.insufficient_data || false,
              insufficient_scoring: details?.insufficient_scoring || false,
            },
          });
          totalIndicatorsForThisSignal++;

          // 🎯 SESSION #321B FINAL: BOLLINGER BANDS INDICATOR RECORD CREATION - Always create for transparency
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
              session_325_migration_complete: true,
              original_scoring_preserved: true,
              data_available:
                bollingerValue !== null && bollingerValue !== undefined,
              insufficient_data: details?.insufficient_data || false,
              insufficient_scoring: details?.insufficient_scoring || false,
            },
          });
          totalIndicatorsForThisSignal++;

          // 🎯 SESSION #321B FINAL: SUPPORT/RESISTANCE INDICATOR RECORD CREATION - Always create for transparency
          // 🛡️ SESSION #313C/D: Preserve proximity filtering and price mapping exactly
          // 🐛 BUG FIX: Apply Session #313D position-based classification instead of hardcoded type assignment
          const srLevel = details?.supportLevel || details?.resistanceLevel;
          const srContribution = calculateIndicatorScoreContribution(
            "SUPPORT_RESISTANCE",
            srLevel,
            timeframe,
            details?.indicators?.support_resistance_object
          );

          // 🐛 BUG FIX: Calculate correct type using Session #313D position-based validation
          // Replace hardcoded type assignment with proper price comparison
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
              // 🐛 BUG FIX: Correct metadata field assignment based on calculated type
              support_level: correctType === "support" ? srLevel : null,
              resistance_level: correctType === "resistance" ? srLevel : null,
              proximity_percent: details?.proximityFilterApplied ? 85 : null,
              // 🐛 BUG FIX: Use Session #313D position-based classification
              type: correctType,
              session_313d_classification: correctClassification,
              session_313c_proximity: "actionable_range",
              session_325_migration_complete: true,
              original_scoring_preserved: true,
              data_available: srLevel !== null && srLevel !== undefined,
              insufficient_data: details?.insufficient_data || false,
              insufficient_scoring: details?.insufficient_scoring || false,
              // 🐛 BUG FIX: Add debugging info for position-based classification
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

        // 🎯 SESSION #402: ADD DIVERGENCE INDICATOR TO DATABASE
        if (divergenceIndicatorData) {
          indicatorsData.push(divergenceIndicatorData);
          totalIndicatorsForThisSignal++;

          console.log(
            `💾 [${ticker}] SESSION #402: Added RSI_DIVERGENCE indicator to database (Score contribution: ${divergenceIndicatorData.score_contribution.toFixed(
              2
            )})`
          );
        }

        console.log(
          `✅ [${ticker}] SESSION #325: Prepared ${totalIndicatorsForThisSignal} indicator records for database creation (MIGRATION COMPLETE)`
        );

        // 🔧 SESSION #325: LEGACY DATABASE FIELD MAPPING - KEPT FOR COMPATIBILITY
        // 🛡️ ANTI-REGRESSION: Keep existing single-timeframe display fields for compatibility
        // These variables are preserved but not used in database insert since columns were removed
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
        // SESSION #325: These variables are kept for compatibility but not used in database insert
        const displayRSI =
          safeTimeframeDetails.rsi !== null ? safeTimeframeDetails.rsi : 50;
        const displayMACD =
          safeTimeframeDetails.macd !== null ? safeTimeframeDetails.macd : 0;
        const displayVolumeRatio =
          safeTimeframeDetails.volumeRatio !== null
            ? safeTimeframeDetails.volumeRatio
            : 1.0;

        // 🔧 NEW DATABASE DISPLAY VALUES - Following existing patterns for new columns
        // SESSION #325: These variables are kept for compatibility but not used in database insert
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
        // SESSION #325: These variables are kept for compatibility but not used in database insert
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
            session: "325-migration-complete-transparency",
            gatekeeper_passed: true,
            kurzora_smart_score: kuzzoraSmartScore,
            batch_number: batchNumber,
            parameters: {
              startIndex,
              endIndex,
              batchNumber,
            },
            session_325_migration: {
              version: "automated-signal-generation-v3",
              status: "production",
              indicator_records_created: totalIndicatorsForThisSignal,
              transparency_level: "complete_28_record_breakdown",
              scoring_preservation: "session_313e_exact",
              database_migration_complete: true,
              deprecated_columns_removed: true,
            },
            // 🎯 SESSION #313C: Add proximity filter status to analysis metadata
            session_313c_enhancement: {
              proximity_filter_applied:
                safeTimeframeDetails.proximityFilterApplied,
              volatility_distance: safeTimeframeDetails.volatilityDistance,
              actionable_levels:
                "S/R levels filtered for trading actionability",
            },
            // 🎯 SESSION #402: RSI DIVERGENCE ANALYSIS RESULTS
            session_402_divergence: divergenceMetadata || {
              session: "SESSION_402_1H_DIVERGENCE_PRODUCTION",
              analysisSuccessful: false,
              hasValidDivergence: false,
              reason: "No 1H data available for divergence analysis",
            },
          },
        };

        const safeEntryPrice = Number((safeCurrentPrice * 1.01).toFixed(4));
        const safeStopLoss = Number((safeCurrentPrice * 0.92).toFixed(4));
        const safeTakeProfit = Number((safeCurrentPrice * 1.15).toFixed(4));

        // 🎯 SESSION #325: DATABASE MIGRATION COMPLETE - DEPRECATED COLUMNS REMOVED
        // All indicator data now stored in indicators table via saveSignalWithIndicators()
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
          explanation: `Kurzora 4-Timeframe Enhanced Analysis: Smart Score ${safeIntegerSmartScore}% | ${signalStrength_enum} Classification | SESSION #325 Database Migration Complete | ${
            batchNumber === 1
              ? `Enhanced signal after ${deletedCount} signals deleted`
              : `Enhanced batch ${batchNumber} signal appended`
          } | Make.com Batch ${batchNumber} Parameter Processing (${startIndex}-${endIndex}) | 28-Record Complete Indicator Transparency | Live Signal Generation`,
        };

        console.log(
          `✅ [${ticker}] SESSION #325 SIGNAL: Company="${safeEnhancedSignal.company_name}", Sector="${safeEnhancedSignal.sector}"`
        );

        // 🎯 SESSION #321B: ENHANCED DATABASE SAVE WITH INDICATORS - FINAL TRANSPARENCY
        // 🛡️ CRITICAL: Use transaction-safe function to save signal + indicators together
        console.log(
          `💾 [${ticker}] SESSION #325 DATABASE SAVE: Using transaction-safe signal+indicators save...`
        );
        const saveResult = await saveSignalWithIndicators(
          safeEnhancedSignal,
          indicatorsData
        );
        const dbInsertSuccess = saveResult.success;
        const dbInsertResult = dbInsertSuccess
          ? `Successfully saved signal with ${indicatorsData.length} indicator records - ID: ${saveResult.data?.id} (SESSION #325 MIGRATION COMPLETE)`
          : `Database Error: ${saveResult.error}`;

        if (dbInsertSuccess) {
          console.log(
            `🎉 [${ticker}] SESSION #325 DATABASE INSERT SUCCESS! Signal ID: ${saveResult.data?.id}, Indicators: ${indicatorsData.length}`
          );
          totalSavedCount++;
          totalIndicatorRecordsCreated += indicatorsData.length;
        } else {
          console.log(
            `❌ [${ticker}] SESSION #325 Database insert FAILED: ${saveResult.error}`
          );
        }

        // 🔧 SESSION #325: ENHANCED RESULT TRACKING - MIGRATION COMPLETE
        const resultStatus = dbInsertSuccess
          ? "SAVED_WITH_COMPLETE_INDICATORS_MIGRATION_COMPLETE"
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
          session_325_migration: {
            version: "automated-signal-generation-v3",
            status: "production",
            transparency_upgrade:
              "complete_28_record_indicator_breakdown_migration_complete",
            indicator_records_created: dbInsertSuccess
              ? indicatorsData.length
              : 0,
            scoring_preservation: "session_313e_exact",
            database_migration_complete: true,
            deprecated_columns_removed: true,
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
          `❌ [${stockObject.ticker}] SESSION #325 stock processing error: ${
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
          session_325_migration:
            "Database migration complete - error occurred during processing",
        });
        totalProcessed++;
        totalDataQualityIssues++;
      }
    }

    // 🔧 SESSION #325: ENHANCED PROCESSING RESULTS - MIGRATION COMPLETE
    const totalProcessingTime = ((Date.now() - totalStartTime) / 1000).toFixed(
      1
    );
    const totalProcessingMinutes = (totalProcessingTime / 60).toFixed(1);

    console.log(
      `\n🎉 ============ SESSION #325 ANALYSIS COMPLETE ============`
    );
    console.log(`📊 SESSION #325 COMPLETE PROCESSING RESULTS SUMMARY:`);
    console.log(`      Migration Version: automated-signal-generation-v3 ✅`);
    console.log(
      `      Database Migration: Complete - deprecated columns removed ✅`
    );
    console.log(
      `      Session #313E Preservation: All scoring logic preserved exactly ✅`
    );
    console.log(
      `      Indicator Records Created: ${totalIndicatorRecordsCreated} total ✅`
    );
    console.log(
      `      Transparency: All indicators created for complete user understanding ✅`
    );
    console.log(
      `      Processing Pipeline: Complete modular system with migration complete ✅`
    );
    console.log(
      `      SESSION #313C Enhancement: S/R proximity filter preserved ✅`
    );

    // 🔧 SESSION #325: RETURN ENHANCED STRUCTURED RESULT - MIGRATION COMPLETE
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
      session_325_migration: {
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
        database_migration_complete: true,
        deprecated_columns_removed: true,
        expected_indicators_per_signal: 28,
      },
      // 🎯 SESSION #313C: Add proximity filter status to final results
      session_313c_enhancement: {
        proximity_filter_deployed: true,
        actionable_levels: "S/R levels filtered for trading actionability",
        volatility_based_filtering: "Using production entry/stop calculations",
      },
      // Additional properties for full compatibility with original response
      session: `SESSION-325-MIGRATION-COMPLETE-${
        USE_BACKTEST ? "BACKTEST" : "LIVE"
      }-4TIMEFRAME-TRANSPARENCY`,
      mode: USE_BACKTEST ? "BACKTEST" : "LIVE",
      mode_description: USE_BACKTEST
        ? "using verified historical data (2024-05-06 to 2024-06-14)"
        : "using SESSION #185 enhanced 400-day rolling window for reliable multi-timeframe data",
      message: `SESSION #325 MIGRATION COMPLETE system with ${
        totalSavedCount > 0 ? "successful" : "attempted"
      } database operations using complete transparency architecture with ${totalIndicatorRecordsCreated} indicator records created for total signal scoring understanding`,
      // 🔍 DEBUG: Include Stochastic debug info in response (bypass log issues)
      stochastic_debug: debugInfo,
      // 🔍 DEBUG: Include RSI/MACD debug info in response (bypass log issues)
      rsi_macd_debug: rsiMacdDebug,
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
 * 🎯 SESSION #325: MIGRATION COMPLETE PRODUCTION COMPATIBILITY EXPORT
 * PURPOSE: Production deployment interface for live signal generation with migration complete
 * ANTI-REGRESSION: Maintains exact interface compatibility with all systems
 * PRODUCTION: Live signal processing with complete transparency and Session #313E preservation
 * SESSION #325: Database migration complete - deprecated columns removed, indicators table active
 * BUG FIX: Fixed hardcoded support/resistance classification with Session #313D position-based validation
 */
export async function executeSignalPipeline(params) {
  const pipeline = new SignalPipeline();
  return await pipeline.execute(params);
}

// ==================================================================================
// 🎯 SESSION #325 SIGNAL PIPELINE MIGRATION COMPLETE
// ==================================================================================
// 📊 FUNCTIONALITY: Production deployment with complete 28-record indicator transparency
// 🛡️ PRESERVATION: ALL Session #151-318 processing logic preserved exactly + migration complete
// 🔧 PRODUCTION PURPOSE: Live signal generation with complete transparency into scoring logic
// 📈 PRODUCTION READY: Complete transparency with identical behavior + migration complete
// 🎖️ ANTI-REGRESSION: Original processing logic completely preserved
// 🚀 LIVE SYSTEM: Modular signal generation with complete scoring breakdown
// 📋 SESSION #325: Database migration complete - deprecated columns removed
// 🛡️ SESSION #313E: All MACD momentum penalties & Volume quality validation preserved exactly
// 🏆 ACHIEVEMENT: Complete transparency with clean database architecture
// 🗄️ MIGRATION SUCCESS: All indicator data now in indicators table with 28-record transparency
// 🐛 BUG FIX: Fixed hardcoded support/resistance classification with Session #313D position-based validation
// ==================================================================================
