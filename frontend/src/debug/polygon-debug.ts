// ===================================================================
// POLYGON.IO API DEBUG SCRIPT - STEP-BY-STEP TESTING
// ===================================================================
// File: src/debug/polygon-debug.ts
// Purpose: Test Polygon.io API connectivity and identify data fetching issues
// Usage: Copy this into a new file and run it to debug the API

// Test Configuration
const DEBUG_CONFIG = {
  apiKey: "SBhhGVNtL5yTr_ordVMKDQKt3Zdim6bJ", // Your Stocks Developer API key
  baseUrl: "https://api.polygon.io",
  testTicker: "AAPL", // Known liquid stock for testing
  testDate: "2024-12-01", // Recent date for testing
  enableLogging: true,
  logLevel: "detailed", // "detailed" | "summary"
};

// ===================================================================
// DEBUG FUNCTIONS
// ===================================================================

function log(message: string, level: "info" | "warn" | "error" = "info") {
  if (!DEBUG_CONFIG.enableLogging) return;

  const timestamp = new Date().toISOString().substring(11, 19);
  const prefix = level === "error" ? "❌" : level === "warn" ? "⚠️" : "✅";
  console.log(`[${timestamp}] ${prefix} ${message}`);
}

// Test 1: Basic API Connectivity
async function testBasicConnection(): Promise<boolean> {
  log("=== TEST 1: Basic API Connectivity ===");

  try {
    const url = `${DEBUG_CONFIG.baseUrl}/v2/snapshot/locale/us/markets/stocks/tickers/${DEBUG_CONFIG.testTicker}?apikey=${DEBUG_CONFIG.apiKey}`;
    log(`Testing URL: ${url}`);

    const response = await fetch(url);
    log(`Response Status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      log(`❌ API Request Failed: ${response.status}`, "error");

      if (response.status === 401) {
        log("🔑 Authentication Error - Check API key", "error");
      } else if (response.status === 403) {
        log("🚫 Forbidden - Check API plan permissions", "error");
      } else if (response.status === 429) {
        log("⏱️ Rate Limited - Too many requests", "error");
      }

      return false;
    }

    const data = await response.json();
    log(
      `Response Data Structure: ${JSON.stringify(Object.keys(data), null, 2)}`
    );

    if (data.status === "OK" && data.ticker) {
      log(`✅ Basic connectivity successful for ${DEBUG_CONFIG.testTicker}`);
      log(`Current Price: $${data.ticker.day?.c || "N/A"}`);
      log(`Volume: ${data.ticker.day?.v?.toLocaleString() || "N/A"}`);
      return true;
    } else {
      log(`❌ Unexpected response format: ${JSON.stringify(data)}`, "error");
      return false;
    }
  } catch (error) {
    log(`❌ Connection Error: ${error.message}`, "error");
    return false;
  }
}

// Test 2: Date Range Calculation
function testDateCalculations(): boolean {
  log("=== TEST 2: Date Range Calculations ===");

  try {
    const endDate = new Date();
    const testRanges = [
      { name: "1H", days: 30 },
      { name: "4H", days: 60 },
      { name: "1D", days: 200 },
      { name: "1W", years: 2 },
    ];

    for (const range of testRanges) {
      const startDate = new Date(endDate);

      if (range.days) {
        startDate.setDate(startDate.getDate() - range.days);
      } else if (range.years) {
        startDate.setFullYear(startDate.getFullYear() - range.years);
      }

      const startStr = startDate.toISOString().split("T")[0];
      const endStr = endDate.toISOString().split("T")[0];

      log(`${range.name}: ${startStr} to ${endStr}`);

      // Validate dates
      if (startDate >= endDate) {
        log(`❌ Invalid date range for ${range.name}`, "error");
        return false;
      }

      if (startDate < new Date("2020-01-01")) {
        log(
          `⚠️ Very old start date for ${range.name} - might have limited data`,
          "warn"
        );
      }
    }

    log("✅ All date calculations look valid");
    return true;
  } catch (error) {
    log(`❌ Date calculation error: ${error.message}`, "error");
    return false;
  }
}

// Test 3: URL Construction
function testUrlConstruction(): boolean {
  log("=== TEST 3: URL Construction ===");

  try {
    const testConfigs = [
      { name: "1H", multiplier: 1, timespan: "hour", days: 30 },
      { name: "4H", multiplier: 4, timespan: "hour", days: 60 },
      { name: "1D", multiplier: 1, timespan: "day", days: 200 },
      { name: "1W", multiplier: 1, timespan: "week", years: 2 },
    ];

    const endDate = new Date();

    for (const config of testConfigs) {
      const startDate = new Date(endDate);

      if (config.days) {
        startDate.setDate(startDate.getDate() - config.days);
      } else if (config.years) {
        startDate.setFullYear(startDate.getFullYear() - (config as any).years);
      }

      const start = startDate.toISOString().split("T")[0];
      const end = endDate.toISOString().split("T")[0];
      const limit = 5000;

      const url = `${DEBUG_CONFIG.baseUrl}/v2/aggs/ticker/${DEBUG_CONFIG.testTicker}/range/${config.multiplier}/${config.timespan}/${start}/${end}?adjusted=true&sort=desc&limit=${limit}&apikey=${DEBUG_CONFIG.apiKey}`;

      log(`${config.name} URL: ${url}`);

      // Basic URL validation
      if (!url.includes(DEBUG_CONFIG.testTicker)) {
        log(`❌ Missing ticker in URL for ${config.name}`, "error");
        return false;
      }

      if (!url.includes(start) || !url.includes(end)) {
        log(`❌ Missing dates in URL for ${config.name}`, "error");
        return false;
      }

      if (!url.includes(DEBUG_CONFIG.apiKey)) {
        log(`❌ Missing API key in URL for ${config.name}`, "error");
        return false;
      }
    }

    log("✅ All URL constructions look valid");
    return true;
  } catch (error) {
    log(`❌ URL construction error: ${error.message}`, "error");
    return false;
  }
}

// Test 4: Single Timeframe API Request
async function testSingleTimeframe(): Promise<boolean> {
  log("=== TEST 4: Single Timeframe Request ===");

  try {
    // Test 1D timeframe (most reliable)
    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 30); // 30 days of daily data

    const start = startDate.toISOString().split("T")[0];
    const end = endDate.toISOString().split("T")[0];

    const url = `${DEBUG_CONFIG.baseUrl}/v2/aggs/ticker/${DEBUG_CONFIG.testTicker}/range/1/day/${start}/${end}?adjusted=true&sort=desc&limit=5000&apikey=${DEBUG_CONFIG.apiKey}`;

    log(`Testing Daily Data URL: ${url}`);

    const response = await fetch(url);
    log(`Response Status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      log(`❌ Daily data request failed: ${response.status}`, "error");

      if (response.status === 401) {
        log("🔑 Authentication failed - API key issue", "error");
      } else if (response.status === 403) {
        log(
          "🚫 Access denied - Check plan permissions for daily data",
          "error"
        );
      } else if (response.status === 429) {
        log("⏱️ Rate limited", "error");
      }

      return false;
    }

    const data = await response.json();

    if (DEBUG_CONFIG.logLevel === "detailed") {
      log(`Full Response: ${JSON.stringify(data, null, 2)}`);
    }

    log(`Response Status: ${data.status}`);
    log(`Results Count: ${data.count || 0}`);
    log(`Results Array Length: ${data.results?.length || 0}`);

    if (!data.results || data.results.length === 0) {
      log(
        `❌ No data returned for ${DEBUG_CONFIG.testTicker} daily timeframe`,
        "error"
      );
      log(`Date range: ${start} to ${end}`, "warn");

      // Check if it's a weekend/holiday issue
      const now = new Date();
      const dayOfWeek = now.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        log(`⚠️ Today is weekend - markets closed`, "warn");
      }

      return false;
    }

    // Analyze the data
    const firstResult = data.results[0];
    log(`Sample Data Point:`);
    log(`  Open: $${firstResult.o}`);
    log(`  High: $${firstResult.h}`);
    log(`  Low: $${firstResult.l}`);
    log(`  Close: $${firstResult.c}`);
    log(`  Volume: ${firstResult.v?.toLocaleString()}`);
    log(`  Timestamp: ${new Date(firstResult.t).toISOString()}`);

    log(
      `✅ Daily timeframe data successfully retrieved (${data.results.length} points)`
    );
    return true;
  } catch (error) {
    log(`❌ Single timeframe test error: ${error.message}`, "error");
    return false;
  }
}

// Test 5: Multiple Timeframe Test
async function testMultipleTimeframes(): Promise<boolean> {
  log("=== TEST 5: Multiple Timeframes Test ===");

  const timeframes = [
    { name: "1D", multiplier: 1, timespan: "day", days: 30 },
    { name: "1H", multiplier: 1, timespan: "hour", days: 7 }, // Shorter range for hourly
    { name: "4H", multiplier: 4, timespan: "hour", days: 14 },
    { name: "1W", multiplier: 1, timespan: "week", days: 365 },
  ];

  const results = [];

  for (const tf of timeframes) {
    try {
      log(`Testing ${tf.name} timeframe...`);

      const endDate = new Date();
      const startDate = new Date(endDate);
      startDate.setDate(startDate.getDate() - tf.days);

      const start = startDate.toISOString().split("T")[0];
      const end = endDate.toISOString().split("T")[0];

      const url = `${DEBUG_CONFIG.baseUrl}/v2/aggs/ticker/${DEBUG_CONFIG.testTicker}/range/${tf.multiplier}/${tf.timespan}/${start}/${end}?adjusted=true&sort=desc&limit=5000&apikey=${DEBUG_CONFIG.apiKey}`;

      const response = await fetch(url);

      if (!response.ok) {
        log(`❌ ${tf.name}: Failed (${response.status})`, "error");
        results.push({
          timeframe: tf.name,
          success: false,
          error: response.status,
        });
        continue;
      }

      const data = await response.json();
      const count = data.results?.length || 0;

      if (count > 0) {
        log(`✅ ${tf.name}: ${count} data points`);
        results.push({ timeframe: tf.name, success: true, count });
      } else {
        log(`❌ ${tf.name}: No data returned`, "warn");
        results.push({ timeframe: tf.name, success: false, error: "No data" });
      }

      // Rate limiting delay
      await new Promise((resolve) => setTimeout(resolve, 300));
    } catch (error) {
      log(`❌ ${tf.name}: Exception - ${error.message}`, "error");
      results.push({
        timeframe: tf.name,
        success: false,
        error: error.message,
      });
    }
  }

  // Summary
  const successful = results.filter((r) => r.success).length;
  log(
    `\n📊 Timeframe Test Summary: ${successful}/${results.length} successful`
  );

  results.forEach((result) => {
    if (result.success) {
      log(`  ✅ ${result.timeframe}: ${(result as any).count} points`);
    } else {
      log(`  ❌ ${result.timeframe}: ${(result as any).error}`, "error");
    }
  });

  return successful > 0;
}

// Test 6: Rate Limiting Check
async function testRateLimiting(): Promise<boolean> {
  log("=== TEST 6: Rate Limiting Check ===");

  try {
    const requests = 5; // Test 5 rapid requests
    const promises = [];

    log(`Making ${requests} rapid requests to test rate limiting...`);

    for (let i = 0; i < requests; i++) {
      const url = `${DEBUG_CONFIG.baseUrl}/v2/snapshot/locale/us/markets/stocks/tickers/${DEBUG_CONFIG.testTicker}?apikey=${DEBUG_CONFIG.apiKey}`;
      promises.push(fetch(url));
    }

    const responses = await Promise.all(promises);

    let successCount = 0;
    let rateLimitedCount = 0;

    for (let i = 0; i < responses.length; i++) {
      const response = responses[i];
      if (response.ok) {
        successCount++;
        log(`  Request ${i + 1}: ✅ Success (${response.status})`);
      } else if (response.status === 429) {
        rateLimitedCount++;
        log(`  Request ${i + 1}: ⏱️ Rate Limited (${response.status})`, "warn");
      } else {
        log(`  Request ${i + 1}: ❌ Failed (${response.status})`, "error");
      }
    }

    log(
      `Results: ${successCount} successful, ${rateLimitedCount} rate limited`
    );

    if (rateLimitedCount > 0) {
      log(`⚠️ Rate limiting detected - need to implement delays`, "warn");
    } else {
      log(`✅ No immediate rate limiting issues`);
    }

    return true;
  } catch (error) {
    log(`❌ Rate limiting test error: ${error.message}`, "error");
    return false;
  }
}

// ===================================================================
// MAIN DEBUG RUNNER
// ===================================================================

export async function runPolygonDebug(): Promise<void> {
  log("🔍 POLYGON.IO API DEBUG SESSION STARTED");
  log("=====================================\n");

  const tests = [
    { name: "Basic Connection", fn: testBasicConnection },
    { name: "Date Calculations", fn: testDateCalculations },
    { name: "URL Construction", fn: testUrlConstruction },
    { name: "Single Timeframe", fn: testSingleTimeframe },
    { name: "Multiple Timeframes", fn: testMultipleTimeframes },
    { name: "Rate Limiting", fn: testRateLimiting },
  ];

  const results = [];

  for (const test of tests) {
    try {
      log(`\n🧪 Running ${test.name} Test...`);
      const result = await test.fn();
      results.push({ name: test.name, success: result });
      log(`${test.name}: ${result ? "✅ PASSED" : "❌ FAILED"}\n`);
    } catch (error) {
      log(`❌ ${test.name} Test Exception: ${error.message}`, "error");
      results.push({ name: test.name, success: false, error: error.message });
    }
  }

  // Final Summary
  log("=====================================");
  log("🎯 DEBUG SESSION COMPLETE");
  log("=====================================");

  const passed = results.filter((r) => r.success).length;
  log(`📊 Overall Results: ${passed}/${results.length} tests passed\n`);

  results.forEach((result) => {
    const status = result.success ? "✅ PASS" : "❌ FAIL";
    log(`  ${status} ${result.name}`);
    if (!result.success && (result as any).error) {
      log(`      Error: ${(result as any).error}`, "error");
    }
  });

  log("\n🔧 Next Steps:");
  if (passed === 0) {
    log("❌ All tests failed - Check API key and network connectivity");
  } else if (passed < 3) {
    log("⚠️ Major issues detected - Focus on failed tests above");
  } else if (passed < 6) {
    log("⚠️ Some issues detected - Review failed tests and implement fixes");
  } else {
    log("✅ All tests passed - API connectivity is working correctly!");
  }

  log("\n📝 Copy this debug output to share with your development team");
  log("=====================================\n");
}

// ===================================================================
// USAGE INSTRUCTIONS
// ===================================================================

/*
HOW TO RUN THIS DEBUG SCRIPT:

1. Create a new file: src/debug/polygon-debug.ts
2. Copy this entire code into that file
3. In your component or test file, import and run:

   import { runPolygonDebug } from '../debug/polygon-debug';
   
   // Add a button to trigger debugging
   <button onClick={runPolygonDebug}>
     🔍 Debug Polygon API
   </button>

4. Or run directly in browser console:
   
   // Copy the function code into console and run:
   runPolygonDebug();

5. Check the browser console for detailed debug output

WHAT TO LOOK FOR:
- ✅ All tests passing = API is working
- ❌ Basic Connection failed = API key or network issue
- ❌ Single Timeframe failed = Data access issue
- ⚠️ Rate limiting = Need to add delays between requests

This will help identify exactly where the "No valid timeframe data" error is coming from!
*/
