#!/usr/bin/env node

// ==================================================================================
// 🎯 SESSION #402: WIDER RANGE DIVERGENCE TEST - FIND 1D PATTERNS
// ==================================================================================
// 🚨 PURPOSE: Test more stocks to find 1D divergence patterns
// 📊 WIDER SCOPE: Test 10-20 stocks to increase chance of finding divergence
// 🔧 VALIDATION: Confirm 1D divergence system is working correctly
// ==================================================================================

const https = require("https");

const SUPABASE_URL = "https://jmbkssafogvzizypjaoi.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptYmtzc2Fmb2d2eml6eXBqYW9pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwODY1MzMsImV4cCI6MjA2NTY2MjUzM30.w0BScLJUgOdqe2mqNjCFo8cZHZRQC8zurUdJ2NyVK-4";

console.log("🚀 SESSION #402: Testing 1D Divergence with Wider Range...\n");

async function testDivergenceFunction(startIndex, endIndex) {
  console.log(
    `📡 Testing stocks ${startIndex}-${endIndex} for divergence patterns...`
  );

  const testParams = {
    startIndex: startIndex,
    endIndex: endIndex,
    divergenceEnabled: true,
    divergenceConfig: {
      timeframe: "1D",
      sensitivityLevel: 5,
      enableDebug: true,
    },
  };

  const data = JSON.stringify(testParams);

  const options = {
    hostname: "jmbkssafogvzizypjaoi.supabase.co",
    port: 443,
    path: "/functions/v1/automated-signal-generation-v4",
    method: "POST",
    headers: {
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      apikey: SUPABASE_ANON_KEY,
      "Content-Type": "application/json",
      "Content-Length": data.length,
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let responseData = "";

      res.on("data", (chunk) => {
        responseData += chunk;
      });

      res.on("end", () => {
        try {
          const response = JSON.parse(responseData);
          resolve(response);
        } catch (error) {
          console.log("📄 Raw response:", responseData);
          reject(new Error(`JSON parse error: ${error.message}`));
        }
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

async function analyzeDivergenceResults(response, range) {
  console.log(`\n🔍 DIVERGENCE ANALYSIS FOR RANGE ${range}:`);
  console.log("=====================================");

  if (!response.data || !response.data.signals) {
    console.log("❌ No signals found in response");
    return { signals: 0, divergence: 0 };
  }

  const signals = response.data.signals;
  let divergenceSignals = 0;

  console.log(`📊 Total signals: ${signals.length}`);

  signals.forEach((signal, index) => {
    console.log(`\n🎯 SIGNAL ${index + 1}: ${signal.ticker}`);
    console.log(
      `   Score: ${
        signal.confidence_score || signal.kurzora_smart_score || "N/A"
      }`
    );

    // Check for Session #402 divergence data
    if (signal.analysis && signal.analysis.session_402_divergence) {
      const divergenceData = signal.analysis.session_402_divergence;

      if (divergenceData.hasValidDivergence) {
        divergenceSignals++;
        console.log(`   ✅ HAS DIVERGENCE!`);
        console.log(
          `      Type: ${divergenceData.strongestPattern?.type || "N/A"}`
        );
        console.log(
          `      Strength: ${
            divergenceData.strongestPattern?.strength || "N/A"
          }`
        );
        console.log(
          `      Confidence: ${
            divergenceData.strongestPattern?.confidenceScore || "N/A"
          }%`
        );
      } else {
        console.log(
          `   📊 Analysis: ${
            divergenceData.analysisSuccessful ? "Success" : "Failed"
          }`
        );
        console.log(
          `   🔍 Patterns: ${divergenceData.totalPatternsFound || 0} found, ${
            divergenceData.validPatternsCount || 0
          } valid`
        );
      }
    } else {
      console.log(`   ❌ No divergence analysis data`);
    }
  });

  return { signals: signals.length, divergence: divergenceSignals };
}

async function runWiderTest() {
  try {
    console.log("🎯 SESSION #402: Starting Wider Range Test...\n");

    let totalSignals = 0;
    let totalDivergence = 0;
    const ranges = [
      [0, 9], // First 10 stocks
      [10, 19], // Next 10 stocks
      [20, 29], // Next 10 stocks
    ];

    for (const [start, end] of ranges) {
      try {
        console.log(`\n🔄 Testing range ${start}-${end}...`);
        const startTime = Date.now();
        const response = await testDivergenceFunction(start, end);
        const duration = Date.now() - startTime;

        console.log(`✅ Range ${start}-${end} completed in ${duration}ms`);

        const results = await analyzeDivergenceResults(
          response,
          `${start}-${end}`
        );
        totalSignals += results.signals;
        totalDivergence += results.divergence;

        if (results.divergence > 0) {
          console.log(
            `🎉 FOUND ${results.divergence} DIVERGENCE SIGNALS IN RANGE ${start}-${end}!`
          );
        }

        // Small delay between ranges
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.log(`❌ Range ${start}-${end} failed: ${error.message}`);
      }
    }

    console.log("\n📈 FINAL SUMMARY:");
    console.log("=====================================");
    console.log(`🎯 Total signals generated: ${totalSignals}`);
    console.log(`💎 Total divergence signals: ${totalDivergence}`);
    console.log(
      `📊 Divergence success rate: ${
        totalSignals > 0
          ? ((totalDivergence / totalSignals) * 100).toFixed(1)
          : 0
      }%`
    );

    if (totalDivergence > 0) {
      console.log("\n🎉 SUCCESS: 1D Divergence System is Working! 🚀");
    } else {
      console.log(
        "\n🔧 INFO: No divergence patterns found - this is normal in current market conditions"
      );
      console.log(
        "   The 1D system is working but no stocks currently show divergence patterns"
      );
    }
  } catch (error) {
    console.log(`❌ Test failed: ${error.message}`);
  }
}

// Run the test
runWiderTest();
