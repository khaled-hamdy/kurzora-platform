#!/usr/bin/env node

// ==================================================================================
// 🎯 SESSION #402: DIVERGENCE SYSTEM TESTER - 1D TIMEFRAME VALIDATION
// ==================================================================================
// 🚨 PURPOSE: Test the complete 1D RSI divergence detection system
// 🛡️ PRODUCTION TESTING: Validate real divergence analysis integration
// 📊 1D FOCUSED: Test daily timeframe divergence detection - superior signal quality
// 🔧 DATABASE INTEGRATION: Verify indicators table saving
// 🎖️ NOISE REDUCTION: Daily timeframe eliminates intraday noise for reliable patterns
// ==================================================================================

const https = require("https");

const SUPABASE_URL = "https://jmbkssafogvzizypjaoi.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptYmtzc2Fmb2d2eml6eXBqYW9pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwODY1MzMsImV4cCI6MjA2NTY2MjUzM30.w0BScLJUgOdqe2mqNjCFo8cZHZRQC8zurUdJ2NyVK-4";

console.log("🚀 SESSION #402: Testing Complete 1D Divergence System...\n");

async function testDivergenceFunction() {
  console.log("📡 Testing Divergence-Enhanced Edge Function v4...");

  const testParams = {
    startIndex: 0,
    endIndex: 2, // Test 3 stocks
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

async function analyzeDivergenceResults(response) {
  console.log("\n🔍 DIVERGENCE ANALYSIS RESULTS:");
  console.log("=====================================");

  if (!response.data || !response.data.signals) {
    console.log("❌ No signals found in response");
    return;
  }

  const signals = response.data.signals;
  let divergenceSignals = 0;
  let strongDivergenceSignals = 0;
  let totalDivergenceBonus = 0;

  console.log(`📊 Total signals analyzed: ${signals.length}`);

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

      console.log(`   📈 Divergence Analysis:`);
      console.log(
        `      ✅ Analysis Successful: ${
          divergenceData.analysisSuccessful || false
        }`
      );
      console.log(
        `      🎯 Has Valid Divergence: ${
          divergenceData.hasValidDivergence || false
        }`
      );
      console.log(
        `      📊 Patterns Found: ${divergenceData.totalPatternsFound || 0}`
      );
      console.log(
        `      ✅ Valid Patterns: ${divergenceData.validPatternsCount || 0}`
      );
      console.log(
        `      🕒 Processing Time: ${divergenceData.processingTime || "N/A"}ms`
      );

      if (divergenceData.hasValidDivergence) {
        divergenceSignals++;

        if (divergenceData.strongestPattern) {
          const pattern = divergenceData.strongestPattern;
          console.log(`      🎯 Strongest Pattern:`);
          console.log(`         Type: ${pattern.type || "N/A"}`);
          console.log(`         Strength: ${pattern.strength || "N/A"}`);
          console.log(
            `         Confidence: ${pattern.confidenceScore || "N/A"}%`
          );
          console.log(
            `         Trading Strength: ${
              pattern.tradingSignalStrength || "N/A"
            }%`
          );

          if (pattern.tradingSignalStrength >= 70) {
            strongDivergenceSignals++;
          }
        }
      }

      if (divergenceData.errors && divergenceData.errors.length > 0) {
        console.log(`      ❌ Errors: ${divergenceData.errors.join(", ")}`);
      }

      if (divergenceData.warnings && divergenceData.warnings.length > 0) {
        console.log(`      ⚠️ Warnings: ${divergenceData.warnings.join(", ")}`);
      }
    } else {
      console.log(`   ❌ No Session #402 divergence data found`);
    }
  });

  console.log("\n📈 DIVERGENCE SUMMARY:");
  console.log("=====================================");
  console.log(
    `🎯 Signals with divergence: ${divergenceSignals}/${signals.length}`
  );
  console.log(
    `💪 Strong divergence signals: ${strongDivergenceSignals}/${signals.length}`
  );
  console.log(
    `📊 Divergence success rate: ${(
      (divergenceSignals / signals.length) *
      100
    ).toFixed(1)}%`
  );

  // Check for indicators table data
  if (response.data.indicators_created) {
    console.log(`\n💾 DATABASE INTEGRATION:`);
    console.log(
      `📊 Total indicators created: ${response.data.indicators_created}`
    );
    console.log(`✅ Divergence indicators should be included in database`);
  }
}

async function runTest() {
  try {
    console.log("🎯 SESSION #402: Starting 1D Divergence System Test...\n");

    const startTime = Date.now();
    const response = await testDivergenceFunction();
    const duration = Date.now() - startTime;

    console.log(`✅ Function completed in ${duration}ms\n`);

    // Analyze divergence-specific results
    await analyzeDivergenceResults(response);

    // Check overall system health
    console.log("\n🏥 SYSTEM HEALTH CHECK:");
    console.log("=====================================");
    console.log(
      `📡 Function Status: ${response.success ? "✅ SUCCESS" : "❌ FAILED"}`
    );
    console.log(`📊 Processing Time: ${duration}ms`);
    console.log(`🎯 Session: ${response.session || "Unknown"}`);

    if (response.error) {
      console.log(`❌ Error: ${response.error}`);
    }

    console.log("\n🎯 SESSION #402: 1D Divergence System Test Complete! 🚀");
  } catch (error) {
    console.log(`❌ Test failed: ${error.message}`);
    console.log(`🔧 Error details:`, error);
  }
}

// Run the test
runTest();
