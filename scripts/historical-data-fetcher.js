// ====================================================================
// KURZORA HISTORICAL DATA FETCHER - YEAR BY YEAR (CORRECTED VERSION)
// ====================================================================
// Purpose: Download 6 years of OHLCV data from Polygon.io (2019-2024)
// Approach: Year-by-year loading using Local Node.js script
// Usage: node historical-data-fetcher.js --year=2024
// Runtime: ~2 hours per year, ~$100 per year
// ====================================================================

const { createClient } = require("@supabase/supabase-js");
const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// ====================================================================
// CONFIGURATION
// ====================================================================

const CONFIG = {
  // Polygon.io settings
  POLYGON_API_KEY: process.env.POLYGON_API_KEY,
  POLYGON_BASE_URL: "https://api.polygon.io/v1/open-close",

  // Rate limiting (150ms between calls = safe for Polygon.io)
  API_DELAY_MS: 150,
  MAX_RETRIES: 3,
  RETRY_DELAY_MS: 1000,

  // Database settings
  SUPABASE_URL: process.env.VITE_SUPABASE_URL,
  SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY, // Service key for direct DB access

  // Logging
  LOG_FILE: `data-fetch-log-${new Date().toISOString().split("T")[0]}.txt`,
  PROGRESS_INTERVAL: 100, // Log progress every 100 API calls
};

// ====================================================================
// DYNAMIC STOCK UNIVERSE - READ FROM DATABASE
// ====================================================================
// NOTE: Stock list is loaded dynamically from active_stocks table
// This ensures backtesting uses EXACTLY the same stocks as live signals
let ACTIVE_STOCKS = []; // Will be populated from database

// ====================================================================
// UTILITY FUNCTIONS
// ====================================================================

function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}`;
  console.log(logMessage);

  // Also write to log file
  fs.appendFileSync(CONFIG.LOG_FILE, logMessage + "\n");
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getYearFromArgs() {
  const args = process.argv.slice(2);
  const yearArg = args.find((arg) => arg.startsWith("--year="));

  if (!yearArg) {
    console.error("❌ Error: Please specify a year using --year=YYYY");
    console.error("   Example: node historical-data-fetcher.js --year=2024");
    process.exit(1);
  }

  const year = parseInt(yearArg.split("=")[1]);

  if (year < 2019 || year > 2024) {
    console.error("❌ Error: Year must be between 2019 and 2024");
    process.exit(1);
  }

  return year;
}

function getDateRange(year) {
  const startDate = `${year}-01-01`;
  const endDate =
    year === 2024
      ? new Date().toISOString().split("T")[0] // Current date for 2024
      : `${year}-12-31`;

  return { startDate, endDate };
}

function validateOHLCVData(data) {
  const required = ["open", "high", "low", "close", "volume"];

  for (const field of required) {
    if (data[field] === undefined || data[field] === null) {
      return false;
    }
  }

  // Validate price logic
  if (
    data.high < data.low ||
    data.high < data.open ||
    data.high < data.close ||
    data.low > data.open ||
    data.low > data.close
  ) {
    return false;
  }

  // Validate positive values
  if (data.open <= 0 || data.high <= 0 || data.low <= 0 || data.close <= 0) {
    return false;
  }

  return true;
}

// ====================================================================
// POLYGON.IO API FUNCTIONS
// ====================================================================

async function fetchDailyData(ticker, date, retryCount = 0) {
  try {
    const url = `${CONFIG.POLYGON_BASE_URL}/${ticker}/${date}?adjusted=true&apikey=${CONFIG.POLYGON_API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 429) {
        // Rate limit
        log(`⚠️  Rate limit hit for ${ticker} ${date}, waiting...`);
        await sleep(2000);
        return await fetchDailyData(ticker, date, retryCount);
      }

      if (response.status === 404) {
        // No data for this date (weekend, holiday, etc.)
        return null;
      }

      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.status !== "OK" || !data.open) {
      return null; // No trading data for this date
    }

    // Validate data quality
    if (!validateOHLCVData(data)) {
      log(`⚠️  Invalid OHLCV data for ${ticker} ${date}, skipping`);
      return null;
    }

    return {
      ticker,
      trade_date: date,
      open_price: data.open,
      high_price: data.high,
      low_price: data.low,
      close_price: data.close,
      adjusted_close: data.close, // Polygon returns adjusted close by default
      volume: data.volume || 0,
      data_source: "polygon",
    };
  } catch (error) {
    if (retryCount < CONFIG.MAX_RETRIES) {
      log(
        `🔄 Retry ${retryCount + 1}/${
          CONFIG.MAX_RETRIES
        } for ${ticker} ${date}: ${error.message}`
      );
      await sleep(CONFIG.RETRY_DELAY_MS * (retryCount + 1));
      return await fetchDailyData(ticker, date, retryCount + 1);
    }

    log(
      `❌ Failed to fetch ${ticker} ${date} after ${CONFIG.MAX_RETRIES} retries: ${error.message}`
    );
    return null;
  }
}

// ====================================================================
// DATABASE FUNCTIONS
// ====================================================================

function initializeSupabase() {
  if (!CONFIG.SUPABASE_URL || !CONFIG.SUPABASE_SERVICE_KEY) {
    log("❌ Error: Missing Supabase configuration in environment variables");
    log("   Required: VITE_SUPABASE_URL and SUPABASE_SERVICE_KEY");
    process.exit(1);
  }

  return createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_SERVICE_KEY);
}

async function loadActiveStocks(supabase) {
  log("📊 Loading active stocks from database...");

  const { data, error } = await supabase
    .from("active_stocks")
    .select("ticker, company_name")
    .eq("is_active", true)
    .order("ticker");

  if (error) {
    log(`❌ Error loading active stocks: ${error.message}`);
    throw new Error(`Failed to load active stocks: ${error.message}`);
  }

  if (!data || data.length === 0) {
    log("❌ No active stocks found in database");
    throw new Error("No active stocks found in active_stocks table");
  }

  const stocks = data.map((row) => row.ticker);
  log(`✅ Loaded ${stocks.length} active stocks from database:`);

  // Log first 10 stocks as preview
  const preview = stocks.slice(0, 10);
  log(
    `   Preview: ${preview.join(", ")}${
      stocks.length > 10 ? ` ... (+${stocks.length - 10} more)` : ""
    }`
  );

  return stocks;
}

async function checkExistingData(supabase, ticker, year) {
  const { startDate, endDate } = getDateRange(year);

  const { data, error } = await supabase
    .from("backtest_historical_prices")
    .select("trade_date")
    .eq("ticker", ticker)
    .gte("trade_date", startDate)
    .lte("trade_date", endDate);

  if (error) {
    log(`⚠️  Error checking existing data for ${ticker}: ${error.message}`);
    return [];
  }

  return data.map((row) => row.trade_date);
}

async function saveToDatabase(supabase, records) {
  if (records.length === 0) return { success: true, count: 0 };

  const { data, error } = await supabase
    .from("backtest_historical_prices")
    .insert(records);

  if (error) {
    log(`❌ Database insert error: ${error.message}`);
    return { success: false, error: error.message };
  }

  return { success: true, count: records.length };
}

// ====================================================================
// MAIN PROCESSING FUNCTIONS
// ====================================================================

function generateTradingDates(year) {
  const dates = [];
  const start = new Date(`${year}-01-01`);
  const end = year === 2024 ? new Date() : new Date(`${year}-12-31`);

  for (
    let date = new Date(start);
    date <= end;
    date.setDate(date.getDate() + 1)
  ) {
    const dayOfWeek = date.getDay();

    // Skip weekends (0 = Sunday, 6 = Saturday)
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      dates.push(date.toISOString().split("T")[0]);
    }
  }

  return dates;
}

async function processStock(supabase, ticker, year, stockIndex, totalStocks) {
  log(
    `\n📊 Processing ${ticker} (${
      stockIndex + 1
    }/${totalStocks}) for year ${year}`
  );

  // Check for existing data
  const existingDates = await checkExistingData(supabase, ticker, year);
  const allTradingDates = generateTradingDates(year);
  const datesToFetch = allTradingDates.filter(
    (date) => !existingDates.includes(date)
  );

  if (datesToFetch.length === 0) {
    log(
      `✅ ${ticker} already has complete ${year} data (${existingDates.length} records)`
    );
    return { apiCalls: 0, records: 0, skipped: existingDates.length };
  }

  log(
    `📈 Fetching ${datesToFetch.length} missing dates for ${ticker} (${existingDates.length} existing)`
  );

  const records = [];
  let apiCalls = 0;
  let successfulFetches = 0;

  for (let i = 0; i < datesToFetch.length; i++) {
    const date = datesToFetch[i];

    // Rate limiting
    if (i > 0) {
      await sleep(CONFIG.API_DELAY_MS);
    }

    const data = await fetchDailyData(ticker, date);
    apiCalls++;

    if (data) {
      records.push(data);
      successfulFetches++;
    }

    // Progress tracking
    if (apiCalls % 50 === 0) {
      const progress = (((i + 1) / datesToFetch.length) * 100).toFixed(1);
      log(
        `📊 ${ticker} progress: ${progress}% (${successfulFetches}/${apiCalls} successful)`
      );
    }
  }

  // Save to database in batches
  let savedRecords = 0;
  const batchSize = 100;

  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize);
    const result = await saveToDatabase(supabase, batch);

    if (result.success) {
      savedRecords += result.count;
    } else {
      log(`❌ Failed to save batch for ${ticker}: ${result.error}`);
    }
  }

  log(
    `✅ ${ticker} complete: ${apiCalls} API calls, ${savedRecords} records saved`
  );

  return {
    apiCalls,
    records: savedRecords,
    skipped: existingDates.length,
  };
}

async function processYear(year) {
  log(`\n🚀 STARTING HISTORICAL DATA FETCH FOR YEAR ${year}`);
  log(`====================================================`);

  // Initialize Supabase
  const supabase = initializeSupabase();
  log(`✅ Connected to Supabase database`);

  // Verify Polygon.io API key
  if (!CONFIG.POLYGON_API_KEY) {
    log("❌ Error: Missing POLYGON_API_KEY in environment variables");
    process.exit(1);
  }
  log(`✅ Polygon.io API key configured`);

  // Load active stocks from database
  ACTIVE_STOCKS = await loadActiveStocks(supabase);

  // Calculate updated estimates based on actual stock count
  const estimatedApiCalls = ACTIVE_STOCKS.length * 252; // Rough estimate for trading days
  const estimatedCost = estimatedApiCalls * 0.002;
  const estimatedHours = (estimatedApiCalls * 0.15) / 3600; // 150ms per call

  // Processing statistics
  const stats = {
    totalApiCalls: 0,
    totalRecords: 0,
    totalSkipped: 0,
    stocksProcessed: 0,
    errors: 0,
    startTime: new Date(),
  };

  log(`📊 Processing ${ACTIVE_STOCKS.length} active stocks for year ${year}`);
  log(`⏱️  Estimated time: ~${estimatedHours.toFixed(1)} hours`);
  log(`💰 Estimated cost: ~$${estimatedCost.toFixed(2)}`);

  // Process each stock
  for (let i = 0; i < ACTIVE_STOCKS.length; i++) {
    const ticker = ACTIVE_STOCKS[i];

    try {
      const result = await processStock(
        supabase,
        ticker,
        year,
        i,
        ACTIVE_STOCKS.length
      );

      stats.totalApiCalls += result.apiCalls;
      stats.totalRecords += result.records;
      stats.totalSkipped += result.skipped;
      stats.stocksProcessed++;

      // Overall progress
      const overallProgress = (((i + 1) / ACTIVE_STOCKS.length) * 100).toFixed(
        1
      );
      const elapsed = (new Date() - stats.startTime) / 1000 / 60; // minutes
      const estimated = (elapsed / (i + 1)) * ACTIVE_STOCKS.length;
      const remaining = estimated - elapsed;

      log(
        `\n📊 OVERALL PROGRESS: ${overallProgress}% (${i + 1}/${
          ACTIVE_STOCKS.length
        })`
      );
      log(
        `⏱️  Elapsed: ${elapsed.toFixed(
          1
        )} min, Remaining: ~${remaining.toFixed(1)} min`
      );
      log(
        `💰 API calls so far: ${stats.totalApiCalls}, Cost: $${(
          stats.totalApiCalls * 0.002
        ).toFixed(2)}`
      );
    } catch (error) {
      log(`❌ Error processing ${ticker}: ${error.message}`);
      stats.errors++;
    }
  }

  // Final statistics
  const totalTime = (new Date() - stats.startTime) / 1000 / 60;
  const totalCost = stats.totalApiCalls * 0.002;

  log(`\n🎉 YEAR ${year} PROCESSING COMPLETE!`);
  log(`===================================`);
  log(`📊 Stocks processed: ${stats.stocksProcessed}/${ACTIVE_STOCKS.length}`);
  log(`📈 Records saved: ${stats.totalRecords.toLocaleString()}`);
  log(`🔄 Records skipped: ${stats.totalSkipped.toLocaleString()}`);
  log(`🌐 API calls made: ${stats.totalApiCalls.toLocaleString()}`);
  log(`💰 Total cost: $${totalCost.toFixed(2)}`);
  log(`⏱️  Total time: ${totalTime.toFixed(1)} minutes`);
  log(`❌ Errors: ${stats.errors}`);

  if (stats.errors === 0) {
    log(`\n✅ SUCCESS: Year ${year} data is ready for backtesting!`);
  } else {
    log(`\n⚠️  COMPLETED WITH ERRORS: Check the log above for details`);
  }
}

// ====================================================================
// MAIN EXECUTION
// ====================================================================

async function main() {
  try {
    const year = getYearFromArgs();
    await processYear(year);
  } catch (error) {
    log(`❌ Fatal error: ${error.message}`);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}
