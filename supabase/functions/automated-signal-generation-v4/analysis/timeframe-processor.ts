// SESSION #400C: PRODUCTION FIX - TIMEFRAME-AWARE DATE RANGES
// PURPOSE: Fix 1W timeframe data insufficiency with internal timeframe-specific date ranges
// ANTI-REGRESSION: ALL Session #301-317 functionality preserved exactly
// 1W FIX: Coordinator now calls getDateRanges(timeframe) internally for each timeframe
// BACKWARD COMPATIBILITY: External interface unchanged, maintains existing patterns

import { getDateRanges } from "../config/scanning-config.ts";

/**
 * MULTI-TIMEFRAME DATA COORDINATOR WITH 1W TIMEFRAME FIX
 * PURPOSE: Fetch market data across all 4 timeframes with timeframe-specific date ranges
 * SESSION #400C: Added internal timeframe-aware date range logic for 1W fix
 * ANTI-REGRESSION: ALL Session #185 + #184 + #183 functionality preserved EXACTLY
 * 1W FIX: Uses extended date range for weekly timeframe to ensure 26+ weeks for MACD
 * PRODUCTION READY: Professional API handling with rate limiting and error recovery
 * BACKWARD COMPATIBILITY: External interface unchanged for signal-pipeline.ts
 */
export class TimeframeDataCoordinator {
  USE_BACKTEST;
  POLYGON_API_KEY;

  constructor(useBacktest = false) {
    this.USE_BACKTEST = useBacktest;
    this.POLYGON_API_KEY = Deno.env.get("POLYGON_API_KEY") || null;
  }

  async fetchMultiTimeframeData(ticker, dateRanges) {
    try {
      console.log(
        `🚨 [${ticker}] SESSION #400C - TIMEFRAME-AWARE COORDINATOR - 1W FIX VERSION`
      );

      // API key validation
      if (!this.POLYGON_API_KEY) {
        console.log(`❌ Missing Polygon API key for ${ticker}`);
        return null;
      }

      // SESSION #400C: Log received dateRanges for backward compatibility debugging
      console.log(
        `🔍 [${ticker}] SESSION #400C: External dateRanges parameter received (backward compatibility maintained)`
      );

      const modeLabel = this.USE_BACKTEST ? "BACKTEST" : "LIVE";
      console.log(
        `\n🔄 [${ticker}] Using ${modeLabel} MODE for SESSION #400C enhanced timeframe-aware data collection`
      );

      // SESSION #400C: Get timeframe-specific date ranges internally
      // This fixes 1W timeframe getting insufficient data while maintaining backward compatibility
      console.log(
        `🎯 [${ticker}] SESSION #400C: Calculating timeframe-specific date ranges for 1W fix...`
      );

      const timeframeSpecificRanges = {
        "1H": getDateRanges("1H"), // Standard 500-day range
        "4H": getDateRanges("4H"), // Standard 500-day range
        "1D": getDateRanges("1D"), // Standard 500-day range
        "1W": getDateRanges("1W"), // Extended 800-day range for sufficient weekly data
      };

      // Log timeframe-specific ranges for debugging
      for (const [timeframe, ranges] of Object.entries(
        timeframeSpecificRanges
      )) {
        const isExtended =
          timeframe === "1W" ? " (EXTENDED for 26+ weeks)" : " (standard)";
        console.log(
          `📅 [${ticker}] ${timeframe} range: ${ranges.recent.start} to ${ranges.recent.end}${isExtended}`
        );
      }

      // SESSION #317 PRODUCTION FIX: Multi-fallback getCurrentPrice() call
      console.log(
        `🔍 [${ticker}] SESSION #317 PRODUCTION FIX: Calling multi-fallback getCurrentPrice()...`
      );

      const consistentCurrentPrice = await this.getCurrentPrice(ticker);

      console.log(
        `🔍 [${ticker}] SESSION #317 PRODUCTION FIX: getCurrentPrice() returned: ${consistentCurrentPrice} (type: ${typeof consistentCurrentPrice})`
      );

      // SESSION #316 PRICE ACCURACY FIX: Use consistent current price across all timeframes
      console.log(
        `🔧 [${ticker}] SESSION #316 PRICE CONSISTENCY: ${
          consistentCurrentPrice
            ? `Using consistent current price $${consistentCurrentPrice.toFixed(
                2
              )} across all timeframes`
            : "Current price unavailable - will use individual timeframe close prices"
        }`
      );

      // SESSION #400C: Build timeframe-specific API endpoints with appropriate date ranges
      // 1W timeframe now gets extended range for sufficient weekly data
      const endpoints = {};
      for (const timeframe of ["1H", "4H", "1D", "1W"]) {
        const ranges = timeframeSpecificRanges[timeframe];
        const limits = {
          "1H": 5000,
          "4H": 2000,
          "1D": 200,
          "1W": 50,
        };

        const multipliers = {
          "1H": "1/hour",
          "4H": "4/hour",
          "1D": "1/day",
          "1W": "1/week",
        };

        endpoints[
          timeframe
        ] = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/${multipliers[timeframe]}/${ranges.recent.start}/${ranges.recent.end}?adjusted=true&sort=asc&limit=${limits[timeframe]}&apikey=${this.POLYGON_API_KEY}`;
      }

      // SESSION #400C: Log API URLs for debugging timeframe-specific ranges
      console.log(
        `🔍 [${ticker}] SESSION #400C: API URLs with timeframe-specific date ranges:`
      );
      for (const [timeframe, url] of Object.entries(endpoints)) {
        const debugUrl = url.replace(this.POLYGON_API_KEY, "[API_KEY_HIDDEN]");
        console.log(`🔍 [${ticker}] ${timeframe} URL: ${debugUrl}`);
        const dateMatch = url.match(/(\d{4}-\d{2}-\d{2})\/(\d{4}-\d{2}-\d{2})/);
        if (dateMatch) {
          const isExtended = timeframe === "1W" ? " (EXTENDED for 1W fix)" : "";
          console.log(
            `🔍 [${ticker}] ${timeframe} dates: ${dateMatch[1]} to ${dateMatch[2]}${isExtended}`
          );
        }
      }

      const timeframeData = {};

      // Process each timeframe with timeframe-specific date ranges
      for (const [timeframe, url] of Object.entries(endpoints)) {
        try {
          const rangeInfo =
            timeframe === "1W"
              ? "extended 800-day range"
              : "standard 500-day range";
          console.log(
            `📡 [${ticker}] ${modeLabel}: Fetching ${timeframe} real market data with ${rangeInfo}...`
          );

          // SESSION #316 FIX: Pass consistent current price to prevent timeframe-specific price inconsistencies
          const timeframeResult = await this.fetchTimeframeWithRetry(
            ticker,
            timeframe,
            url,
            modeLabel,
            consistentCurrentPrice // SESSION #316: Pass consistent price to all timeframes
          );
          if (timeframeResult) {
            timeframeData[timeframe] = timeframeResult;
          }

          // Rate limiting with shorter delays for better performance
          await new Promise((resolve) => setTimeout(resolve, 100));
        } catch (timeframeError) {
          console.log(
            `❌ [${ticker}] Error fetching ${timeframe}: ${timeframeError.message}`
          );
          console.log(
            `🚫 [${ticker}] ${timeframe}: API error - no synthetic fallback, skipping`
          );
          // Note: No synthetic data fallback - we skip this timeframe instead
        }
      }

      // SESSION #183 PRESERVATION: Accept ANY real market data, return null only if NO timeframes have data
      if (Object.keys(timeframeData).length === 0) {
        console.log(
          `❌ [${ticker}] No real market data available from any timeframe`
        );
        console.log(
          `🚫 [${ticker}] Skipping stock - no real market data available (better than false signals)`
        );
        return null; // Return null instead of synthetic data
      }

      // SESSION #400C: Enhanced data summary logging with timeframe-specific range info
      console.log(
        `📊 [${ticker}] ${modeLabel} SESSION #400C Enhanced Real Market Data Summary:`
      );
      console.log(
        `   ✅ Timeframes Available: ${
          Object.keys(timeframeData).length
        }/4 (${Object.keys(timeframeData).join(", ")})`
      );
      for (const [tf, data] of Object.entries(timeframeData)) {
        const rangeInfo = tf === "1W" ? " (EXTENDED RANGE)" : "";
        console.log(
          `   📈 ${tf}: ${
            data.prices?.length || 0
          } data points, Current: $${data.currentPrice?.toFixed(2)}${rangeInfo}`
        );
      }

      console.log(
        `✅ [${ticker}] Processing with SESSION #400C timeframe-aware enhanced data collection`
      );
      console.log(
        `🔧 [${ticker}] SESSION #316 PRICE CONSISTENCY: All timeframes using ${
          consistentCurrentPrice
            ? "consistent current price"
            : "individual close prices"
        }`
      );

      return timeframeData;
    } catch (error) {
      console.log(`🚨 [${ticker}] Major error: ${error.message}`);
      console.log(
        `🚫 [${ticker}] Critical error - no synthetic fallback, returning null`
      );
      return null; // Return null instead of synthetic data
    }
  }

  /**
   * SESSION #317 PRODUCTION FIX: MULTI-FALLBACK getCurrentPrice() IMPLEMENTATION
   * PURPOSE: Fetch actual current market price with multiple fallback strategies
   * PROBLEM SOLVED: Snapshot API returning empty results for some stocks
   * SOLUTION: Three-tier fallback system using real Polygon.io endpoints
   * PRODUCTION SAFE: Only real market data, no synthetic generation
   * SESSION #316: Used once at coordinator level for consistent pricing across all timeframes
   */
  async getCurrentPrice(ticker) {
    try {
      // VALIDATION: API key check
      if (!this.POLYGON_API_KEY) {
        console.log(`❌ [${ticker}] Missing Polygon API key for current price`);
        return null;
      }

      // VALIDATION: Backtest mode handling
      if (this.USE_BACKTEST) {
        console.log(
          `🔄 [${ticker}] BACKTEST MODE: Skipping real-time price fetch`
        );
        return null;
      }

      console.log(
        `💰 [${ticker}] SESSION #317: Starting multi-fallback price fetch...`
      );

      // STRATEGY 1: SNAPSHOT ENDPOINT (Real-time quotes) - PRIMARY APPROACH
      console.log(`💰 [${ticker}] STRATEGY 1: Attempting snapshot endpoint...`);

      const snapshotUrl = `https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/tickers/${ticker}?apikey=${this.POLYGON_API_KEY}`;

      try {
        const snapshotResponse = await fetch(snapshotUrl, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "User-Agent": "Kurzora-Production-Session-317",
          },
        });

        console.log(
          `📡 [${ticker}] Snapshot API Response Status: ${snapshotResponse.status}`
        );

        if (snapshotResponse.ok) {
          const snapshotData = await snapshotResponse.json();
          console.log(
            `📊 [${ticker}] Snapshot response has results: ${
              snapshotData.results ? "YES" : "NO"
            }`
          );
          console.log(
            `📊 [${ticker}] Snapshot results length: ${
              snapshotData.results?.length || 0
            }`
          );

          if (snapshotData.results && snapshotData.results[0]) {
            const result = snapshotData.results[0];
            const currentPrice =
              result.value ||
              result.lastQuote?.price ||
              result.lastTrade?.price;

            if (currentPrice && typeof currentPrice === "number") {
              console.log(
                `✅ [${ticker}] STRATEGY 1 SUCCESS: Snapshot price $${currentPrice.toFixed(
                  2
                )}`
              );
              return currentPrice;
            } else {
              console.log(
                `⚠️ [${ticker}] STRATEGY 1: Snapshot has no valid price fields`
              );
            }
          } else {
            console.log(
              `⚠️ [${ticker}] STRATEGY 1: Snapshot returned empty results array`
            );
          }
        } else {
          console.log(
            `⚠️ [${ticker}] STRATEGY 1: Snapshot HTTP ${snapshotResponse.status}`
          );
        }
      } catch (snapshotError) {
        console.log(
          `⚠️ [${ticker}] STRATEGY 1: Snapshot error: ${snapshotError.message}`
        );
      }

      // STRATEGY 2: PREVIOUS CLOSE ENDPOINT - FALLBACK 1 (Very reliable)
      console.log(
        `💰 [${ticker}] STRATEGY 2: Attempting previous close endpoint...`
      );

      const prevCloseUrl = `https://api.polygon.io/v2/aggs/ticker/${ticker}/prev?apikey=${this.POLYGON_API_KEY}`;

      try {
        const prevCloseResponse = await fetch(prevCloseUrl, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "User-Agent": "Kurzora-Production-Session-317",
          },
        });

        console.log(
          `📡 [${ticker}] Previous close API Response Status: ${prevCloseResponse.status}`
        );

        if (prevCloseResponse.ok) {
          const prevCloseData = await prevCloseResponse.json();
          console.log(
            `📊 [${ticker}] Previous close status: ${prevCloseData.status}`
          );
          console.log(
            `📊 [${ticker}] Previous close results count: ${
              prevCloseData.resultsCount || 0
            }`
          );

          if (
            prevCloseData.status === "OK" &&
            prevCloseData.results &&
            prevCloseData.results.length > 0
          ) {
            const closePrice = prevCloseData.results[0].c;

            if (closePrice && typeof closePrice === "number") {
              console.log(
                `✅ [${ticker}] STRATEGY 2 SUCCESS: Previous close price $${closePrice.toFixed(
                  2
                )}`
              );
              return closePrice;
            } else {
              console.log(
                `⚠️ [${ticker}] STRATEGY 2: Previous close has no valid price`
              );
            }
          } else {
            console.log(
              `⚠️ [${ticker}] STRATEGY 2: Previous close returned no data`
            );
          }
        } else {
          console.log(
            `⚠️ [${ticker}] STRATEGY 2: Previous close HTTP ${prevCloseResponse.status}`
          );
        }
      } catch (prevCloseError) {
        console.log(
          `⚠️ [${ticker}] STRATEGY 2: Previous close error: ${prevCloseError.message}`
        );
      }

      // STRATEGY 3: DAILY AGGREGATES ENDPOINT - FALLBACK 2 (Final fallback)
      console.log(
        `💰 [${ticker}] STRATEGY 3: Attempting daily aggregates endpoint...`
      );

      // Use recent date range for daily aggregates (last 7 days to ensure we get data)
      const endDate = new Date().toISOString().split("T")[0];
      const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];
      const dailyUrl = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${startDate}/${endDate}?apikey=${this.POLYGON_API_KEY}`;

      try {
        const dailyResponse = await fetch(dailyUrl, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "User-Agent": "Kurzora-Production-Session-317",
          },
        });

        console.log(
          `📡 [${ticker}] Daily aggregates API Response Status: ${dailyResponse.status}`
        );

        if (dailyResponse.ok) {
          const dailyData = await dailyResponse.json();
          console.log(
            `📊 [${ticker}] Daily aggregates status: ${dailyData.status}`
          );
          console.log(
            `📊 [${ticker}] Daily aggregates results count: ${
              dailyData.resultsCount || 0
            }`
          );

          if (
            dailyData.status === "OK" &&
            dailyData.results &&
            dailyData.results.length > 0
          ) {
            // Get the most recent day's close price
            const latestResult =
              dailyData.results[dailyData.results.length - 1];
            const latestClosePrice = latestResult.c;

            if (latestClosePrice && typeof latestClosePrice === "number") {
              console.log(
                `✅ [${ticker}] STRATEGY 3 SUCCESS: Latest daily close price $${latestClosePrice.toFixed(
                  2
                )}`
              );
              return latestClosePrice;
            } else {
              console.log(
                `⚠️ [${ticker}] STRATEGY 3: Daily aggregates has no valid close price`
              );
            }
          } else {
            console.log(
              `⚠️ [${ticker}] STRATEGY 3: Daily aggregates returned no data`
            );
          }
        } else {
          console.log(
            `⚠️ [${ticker}] STRATEGY 3: Daily aggregates HTTP ${dailyResponse.status}`
          );
        }
      } catch (dailyError) {
        console.log(
          `⚠️ [${ticker}] STRATEGY 3: Daily aggregates error: ${dailyError.message}`
        );
      }

      // ALL STRATEGIES FAILED - RETURN NULL (No synthetic data generation)
      console.log(
        `❌ [${ticker}] All pricing strategies failed - returning null`
      );
      console.log(
        `⚠️ [${ticker}] Will use timeframe-specific close prices as fallback`
      );
      return null;
    } catch (error) {
      console.log(
        `⚠️ [${ticker}] getCurrentPrice() critical error: ${error.message}`
      );
      console.log(`🔍 [${ticker}] Error Stack:`, error.stack);
      return null;
    }
  }

  /**
   * DAILY CHANGE FIX: GET YESTERDAY'S CLOSE PRICE
   * PURPOSE: Fetch actual yesterday's close price via separate API call for accurate daily change
   * WEEKEND/HOLIDAY PROOF: Automatically handles market closures by fetching last 5 trading days
   * PRODUCTION SOLUTION: Completely independent of 400-day data, dedicated to daily change calculation
   * PRODUCTION SAFE: Uses real Polygon.io API, no synthetic data generation
   * ANTI-REGRESSION: Zero impact on existing signal processing or technical indicators
   */
  async getYesterdayClose(ticker) {
    try {
      // VALIDATION: API key check
      if (!this.POLYGON_API_KEY) {
        console.log(
          `❌ [${ticker}] Missing Polygon API key for yesterday close`
        );
        return null;
      }

      // VALIDATION: Backtest mode handling
      if (this.USE_BACKTEST) {
        console.log(
          `🔄 [${ticker}] BACKTEST MODE: Skipping yesterday close fetch`
        );
        return null;
      }

      console.log(
        `📅 [${ticker}] DAILY CHANGE FIX: Fetching yesterday's close price...`
      );

      // Fetch last 20 trading days to handle extended holidays (Christmas week, international holidays)
      // Ensures sufficient trading day data even during 4+ day holiday periods
      const endDate = new Date().toISOString().split("T")[0];
      const startDate = new Date(Date.now() - 20 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];

      const dailyUrl = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${startDate}/${endDate}?adjusted=true&sort=asc&apikey=${this.POLYGON_API_KEY}`;

      console.log(`📅 [${ticker}] Yesterday API: ${startDate} to ${endDate}`);

      const response = await fetch(dailyUrl, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "User-Agent": "Kurzora-Yesterday-Fix",
        },
      });

      console.log(
        `📡 [${ticker}] Yesterday API Response Status: ${response.status}`
      );

      if (response.ok) {
        const data = await response.json();
        console.log(`📊 [${ticker}] Yesterday status: ${data.status}`);
        console.log(
          `📊 [${ticker}] Yesterday results count: ${data.resultsCount || 0}`
        );

        // PRODUCTION FIX: Accept both "OK" and "DELAYED" status from Polygon API
        // "DELAYED" status still contains valid data, just indicates slightly delayed market data
        if (
          (data.status === "OK" || data.status === "DELAYED") &&
          data.results &&
          data.results.length >= 3
        ) {
          // HOLIDAY-PROOF FIX: When market is closed, getCurrentPrice() uses "previous close" (last trading day)
          // To get actual daily change, we need the trading day BEFORE the last trading day
          // Use third-to-last trading day to ensure we compare different trading sessions
          // This automatically handles holidays since API only returns actual trading days
          const yesterdayResult = data.results[data.results.length - 3];
          const yesterdayClose = yesterdayResult.c;

          if (yesterdayClose && typeof yesterdayClose === "number") {
            const yesterdayDate = new Date(yesterdayResult.t)
              .toISOString()
              .split("T")[0];
            console.log(
              `✅ [${ticker}] DAILY CHANGE FIX SUCCESS: Previous trading day (${yesterdayDate}) close: ${yesterdayClose.toFixed(
                2
              )}`
            );
            return yesterdayClose;
          } else {
            console.log(
              `⚠️ [${ticker}] Previous trading day result has no valid close price`
            );
          }
        } else if (
          (data.status === "OK" || data.status === "DELAYED") &&
          data.results &&
          data.results.length === 2
        ) {
          // Fallback: If only 2 days available, use second-to-last (better than same day)
          const yesterdayResult = data.results[data.results.length - 2];
          const yesterdayClose = yesterdayResult.c;
          if (yesterdayClose && typeof yesterdayClose === "number") {
            console.log(
              `⚠️ [${ticker}] DAILY CHANGE FIX FALLBACK: Using second-to-last day close: ${yesterdayClose.toFixed(
                2
              )}`
            );
            return yesterdayClose;
          }
          // PRODUCTION FIX: Accept both "OK" and "DELAYED" status for final fallback case
        } else if (
          (data.status === "OK" || data.status === "DELAYED") &&
          data.results &&
          data.results.length === 1
        ) {
          // Final fallback: If only one day available, use it (better than nothing)
          const onlyResult = data.results[0];
          const onlyClose = onlyResult.c;
          if (onlyClose && typeof onlyClose === "number") {
            console.log(
              `⚠️ [${ticker}] DAILY CHANGE FIX FINAL FALLBACK: Using only available day close: ${onlyClose.toFixed(
                2
              )}`
            );
            return onlyClose;
          }
        } else {
          console.log(
            `⚠️ [${ticker}] Yesterday API returned insufficient data`
          );
        }
      } else {
        console.log(`⚠️ [${ticker}] Yesterday API HTTP ${response.status}`);
      }
    } catch (error) {
      console.log(`⚠️ [${ticker}] getYesterdayClose() error: ${error.message}`);
    }

    // Complete fallback: Return null to use existing logic
    console.log(
      `⚠️ [${ticker}] DAILY CHANGE FIX: Falling back to existing logic`
    );
    return null;
  }

  async fetchTimeframeWithRetry(
    ticker,
    timeframe,
    url,
    modeLabel,
    consistentCurrentPrice = null // SESSION #316: Consistent price parameter
  ) {
    let response;
    let retryCount = 0;
    const maxRetries = 2;

    // Retry loop with improved error handling
    while (retryCount <= maxRetries) {
      try {
        response = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "User-Agent": "Kurzora-Signal-Engine-Session-305B",
          },
        });
        if (response.ok) {
          break; // Success, exit retry loop
        } else if (retryCount < maxRetries) {
          console.log(
            `⚠️ [${ticker}] ${timeframe}: HTTP ${response.status}, retrying (${
              retryCount + 1
            }/${maxRetries})...`
          );
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second before retry
          retryCount++;
        } else {
          throw new Error(
            `HTTP ${response.status} after ${maxRetries} retries`
          );
        }
      } catch (fetchError) {
        if (retryCount < maxRetries) {
          console.log(
            `⚠️ [${ticker}] ${timeframe}: Fetch error, retrying (${
              retryCount + 1
            }/${maxRetries}): ${fetchError.message}`
          );
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second before retry
          retryCount++;
        } else {
          throw fetchError;
        }
      }
    }

    if (!response?.ok) {
      console.log(
        `❌ [${ticker}] HTTP ${response?.status} for ${timeframe} data after retries`
      );
      console.log(
        `🚫 [${ticker}] ${timeframe}: Skipping due to API error - no synthetic fallback`
      );
      return null;
    }

    const data = await response.json();

    // Comprehensive data debugging and quality assessment
    console.log(
      `📊 [${ticker}] ${timeframe} ${modeLabel} Response: status=${
        data.status
      }, results=${data.results?.length || 0}`
    );
    console.log(`🔍 [${ticker}] ${timeframe} SESSION #185 Data Quality Check:`);

    if (data.results && data.results.length > 0) {
      const results = data.results;
      console.log(`   📈 Data Points: ${results.length}`);
      console.log(
        `   📅 Date Range: ${
          new Date(results[0].t).toISOString().split("T")[0]
        } to ${
          new Date(results[results.length - 1].t).toISOString().split("T")[0]
        }`
      );

      // SESSION #317 DEBUG: Log the actual date range returned by API for comparison
      const actualStartDate = new Date(results[0].t)
        .toISOString()
        .split("T")[0];
      const actualEndDate = new Date(results[results.length - 1].t)
        .toISOString()
        .split("T")[0];
      console.log(
        `🔍 [${ticker}] ${timeframe} SESSION #317 DEBUG: API returned actual dates ${actualStartDate} to ${actualEndDate}`
      );

      console.log(
        `   💰 Price Range: $${Math.min(...results.map((r) => r.c)).toFixed(
          2
        )} - $${Math.max(...results.map((r) => r.c)).toFixed(2)}`
      );
      console.log(
        `   📊 Volume Range: ${Math.min(
          ...results.map((r) => r.v)
        ).toLocaleString()} - ${Math.max(
          ...results.map((r) => r.v)
        ).toLocaleString()}`
      );

      // Technical indicator data sufficiency check
      const sufficientForIndicators = this.validateDataSufficiency(
        results,
        timeframe
      );
      if (!sufficientForIndicators) {
        console.log(
          `⚠️ [${ticker}] ${timeframe}: Insufficient data for some technical indicators - will use available data`
        );
      }

      // DAILY CHANGE FIX: Fetch yesterday's close for 1D timeframe before processing
      let yesterdayClose = null;
      if (timeframe === "1D") {
        console.log(
          `📅 [${ticker}] 1D timeframe detected - fetching yesterday's close for accurate daily change...`
        );
        yesterdayClose = await this.getYesterdayClose(ticker);
        if (yesterdayClose) {
          console.log(
            `✅ [${ticker}] Yesterday's close fetched: $${yesterdayClose.toFixed(
              2
            )}`
          );
        } else {
          console.log(
            `⚠️ [${ticker}] Yesterday's close fetch failed - will use fallback calculation`
          );
        }
      }

      // Process timeframe data based on type
      // SESSION #316 FIX: Pass consistent current price to prevent timeframe-specific pricing inconsistencies
      // DAILY CHANGE FIX: Pass yesterday's close for accurate daily change calculation
      return this.processTimeframeData(
        ticker,
        timeframe,
        results,
        modeLabel,
        consistentCurrentPrice, // SESSION #316: Pass consistent price for accuracy
        yesterdayClose // DAILY CHANGE FIX: Pass yesterday's close for 1D timeframe
      );
    } else {
      console.log(`   ❌ No data points received`);
      console.log(
        `🚫 [${ticker}] ${timeframe}: No real data available - skipping (no synthetic fallback)`
      );
      return null;
    }
  }

  /**
   * VALIDATE DATA SUFFICIENCY - Technical indicator data sufficiency check
   * PURPOSE: Ensure data meets technical indicator requirements
   */
  validateDataSufficiency(results, timeframe) {
    let sufficientForIndicators = true;
    const dataRequirements = {
      RSI: 15,
      MACD: 26,
      Bollinger: 20,
      Stochastic: 14,
    };

    console.log(`   🎯 ${timeframe} Technical Indicator Data Sufficiency:`);
    for (const [indicator, required] of Object.entries(dataRequirements)) {
      const sufficient = results.length >= required;
      console.log(
        `      ${indicator}: ${results.length}/${required} ${
          sufficient ? "✅" : "❌"
        }`
      );
      if (!sufficient) sufficientForIndicators = false;
    }

    return sufficientForIndicators;
  }

  /**
   * PROCESS TIMEFRAME DATA - Convert API response to TimeframeDataPoint format
   * ANTI-REGRESSION: processTimeframeData remains synchronous (Session #220 lesson learned)
   * SESSION #316 PRICE ACCURACY FIX: Use consistent current price across all timeframes
   * DAILY CHANGE FIX: Use actual yesterday's close price for accurate daily change calculation
   * PURPOSE: Convert API response to TimeframeDataPoint format
   */
  processTimeframeData(
    ticker,
    timeframe,
    results,
    modeLabel,
    consistentCurrentPrice = null, // SESSION #316: Consistent price parameter
    yesterdayClose = null // DAILY CHANGE FIX: Yesterday's close price for 1D timeframe
  ) {
    if (timeframe === "1D") {
      // Use all available daily data instead of just last day
      const latestResult = results[results.length - 1];

      // SESSION #316 PRICE ACCURACY FIX: Use consistent current price if available,
      // otherwise fallback to timeframe's close price (preserves existing fallback logic)
      const finalCurrentPrice = consistentCurrentPrice || latestResult.c;

      // DAILY CHANGE FIX: Use actual yesterday's close price for accurate daily change
      let dailyChangePercent = 0;

      if (yesterdayClose && typeof yesterdayClose === "number") {
        // Use the actual yesterday's close price fetched via separate API call
        dailyChangePercent =
          ((finalCurrentPrice - yesterdayClose) / yesterdayClose) * 100;
        console.log(
          `💰 [${ticker}] DAILY CHANGE FIX APPLIED: Accurate daily change ${dailyChangePercent.toFixed(
            2
          )}% (Current: $${finalCurrentPrice.toFixed(
            2
          )} vs Yesterday: $${yesterdayClose.toFixed(2)})`
        );
      } else {
        // Fallback to existing logic if yesterday's close fetch failed
        const previousResult =
          results.length >= 2 ? results[results.length - 2] : results[0];
        dailyChangePercent =
          ((finalCurrentPrice - previousResult.c) / previousResult.c) * 100;
        console.log(
          `⚠️ [${ticker}] DAILY CHANGE FIX FALLBACK: Using existing calculation ${dailyChangePercent.toFixed(
            2
          )}% (yesterday API failed)`
        );
      }

      const timeframeData = {
        currentPrice: finalCurrentPrice,
        changePercent: dailyChangePercent, // Now uses accurate yesterday's close or fallback
        volume: latestResult.v,
        prices: results.map((r) => r.c),
        highs: results.map((r) => r.h),
        lows: results.map((r) => r.l),
        volumes: results.map((r) => r.v),
      };

      // Enhanced logging to show price source for debugging
      const priceSource = consistentCurrentPrice
        ? "CONSISTENT_CURRENT"
        : "TIMEFRAME_CLOSE";
      const changeSource = yesterdayClose ? "YESTERDAY_API" : "FALLBACK_CALC";
      console.log(
        `✅ [${ticker}] ${timeframe} ${modeLabel} Success: ${
          results.length
        } days, Current: $${finalCurrentPrice.toFixed(
          2
        )} (${priceSource}), Change: ${timeframeData.changePercent.toFixed(
          2
        )}% (${changeSource}), Vol: ${latestResult.v.toLocaleString()}`
      );

      return timeframeData;
    } else {
      // Use more data points for better technical analysis
      const processedResults = results.slice(-200); // Keep last 200 periods for better analysis
      const latestResult = processedResults[processedResults.length - 1];

      // PERIOD CHANGE FIX: Calculate change vs previous period (not first period in range)
      // Previous WRONG logic: Used first period in range (could be weeks/months ago)
      // New CORRECT logic: Use previous period's close price
      const previousResult =
        processedResults.length >= 2
          ? processedResults[processedResults.length - 2]
          : processedResults[0];

      // SESSION #316 PRICE ACCURACY FIX: Use consistent current price if available,
      // otherwise fallback to timeframe's close price (preserves existing fallback logic)
      const finalCurrentPrice = consistentCurrentPrice || latestResult.c;

      const timeframeData = {
        currentPrice: finalCurrentPrice,
        // PERIOD CHANGE FIX: Compare current price vs previous period's close
        changePercent:
          ((finalCurrentPrice - previousResult.c) / previousResult.c) * 100,
        volume: latestResult.v,
        prices: processedResults.map((r) => r.c),
        highs: processedResults.map((r) => r.h),
        lows: processedResults.map((r) => r.l),
        volumes: processedResults.map((r) => r.v),
      };

      // Enhanced logging to show price source for debugging
      const priceSource = consistentCurrentPrice
        ? "CONSISTENT_CURRENT"
        : "TIMEFRAME_CLOSE";
      console.log(
        `✅ [${ticker}] ${timeframe} ${modeLabel} Success: ${
          processedResults.length
        } periods, Current: $${finalCurrentPrice.toFixed(
          2
        )} (${priceSource}), Change: ${timeframeData.changePercent.toFixed(2)}%`
      );

      return timeframeData;
    }
  }
}
