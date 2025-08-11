#!/usr/bin/env node

// ==================================================================================
// 🎯 SESSION #402: DIVERGENCE RESULTS ANALYZER
// ==================================================================================
// 🚨 PURPOSE: Analyze Postman results to identify divergence-enhanced signals
// 📊 USAGE: Copy Postman response JSON and save as 'postman-results.json'
// 🔧 FEATURES: Detailed analysis of which signals have divergence patterns
// ==================================================================================

const fs = require("fs");
const path = require("path");

console.log("🔍 SESSION #402: Divergence Results Analyzer\n");

function analyzeDivergenceResults(filePath) {
  try {
    // Read the JSON file
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

    if (!data.success || !data.data || !data.data.signals) {
      console.log("❌ Invalid response format or no signals found");
      return;
    }

    const signals = data.data.signals;
    console.log(`📊 Total signals analyzed: ${signals.length}\n`);

    let divergenceSignals = [];
    let regularSignals = [];

    // Analyze each signal
    signals.forEach((signal, index) => {
      const divergenceData = signal.analysis?.session_402_divergence;

      if (divergenceData && divergenceData.hasValidDivergence === true) {
        divergenceSignals.push({
          index: index + 1,
          ticker: signal.ticker,
          score: signal.confidence_score || signal.kurzora_smart_score,
          divergenceData: divergenceData,
        });
      } else {
        regularSignals.push({
          index: index + 1,
          ticker: signal.ticker,
          score: signal.confidence_score || signal.kurzora_smart_score,
          reason: divergenceData?.reason || "No divergence analysis",
        });
      }
    });

    // Print detailed results
    console.log("🎉 DIVERGENCE-ENHANCED SIGNALS:");
    console.log("=====================================");

    if (divergenceSignals.length === 0) {
      console.log("❌ No divergence signals found");
    } else {
      divergenceSignals.forEach((signal, idx) => {
        console.log(`\n🎯 DIVERGENCE SIGNAL #${idx + 1}:`);
        console.log(`   Ticker: ${signal.ticker}`);
        console.log(`   Score: ${signal.score}`);
        console.log(
          `   Divergence Type: ${
            signal.divergenceData.strongestPattern?.type || "N/A"
          }`
        );
        console.log(
          `   Pattern Strength: ${
            signal.divergenceData.strongestPattern?.strength || "N/A"
          }`
        );
        console.log(
          `   Pattern Confidence: ${
            signal.divergenceData.strongestPattern?.confidenceScore || "N/A"
          }%`
        );
        console.log(
          `   Score Bonus: +${signal.divergenceData.scoreBonus || 0} points`
        );
        console.log(
          `   Total Patterns Found: ${
            signal.divergenceData.totalPatternsFound || 0
          }`
        );
        console.log(
          `   Valid Patterns: ${signal.divergenceData.validPatternsCount || 0}`
        );

        // Check for specific divergence types
        const pattern = signal.divergenceData.strongestPattern;
        if (pattern) {
          if (pattern.type.includes("BULLISH")) {
            console.log("   📈 BULLISH DIVERGENCE - Potential upward move");
          } else if (pattern.type.includes("BEARISH")) {
            console.log("   📉 BEARISH DIVERGENCE - Potential downward move");
          }

          if (pattern.type.includes("REGULAR")) {
            console.log("   🔄 REGULAR DIVERGENCE - Trend reversal signal");
          } else if (pattern.type.includes("HIDDEN")) {
            console.log("   🎯 HIDDEN DIVERGENCE - Trend continuation signal");
          }
        }
      });
    }

    console.log("\n\n📊 REGULAR SIGNALS (No Divergence):");
    console.log("=====================================");
    console.log(`Count: ${regularSignals.length}`);

    if (regularSignals.length > 0) {
      console.log("\nFirst 5 regular signals:");
      regularSignals.slice(0, 5).forEach((signal, idx) => {
        console.log(
          `   ${idx + 1}. ${signal.ticker} (Score: ${signal.score}) - ${
            signal.reason
          }`
        );
      });
    }

    // Summary statistics
    console.log("\n\n📈 SUMMARY STATISTICS:");
    console.log("=====================================");
    console.log(`🎯 Total Signals: ${signals.length}`);
    console.log(`💎 Divergence Signals: ${divergenceSignals.length}`);
    console.log(`📊 Regular Signals: ${regularSignals.length}`);
    console.log(
      `📈 Divergence Rate: ${(
        (divergenceSignals.length / signals.length) *
        100
      ).toFixed(1)}%`
    );

    if (divergenceSignals.length > 0) {
      const avgDivergenceScore =
        divergenceSignals.reduce((sum, s) => sum + (s.score || 0), 0) /
        divergenceSignals.length;
      const avgRegularScore =
        regularSignals.reduce((sum, s) => sum + (s.score || 0), 0) /
        regularSignals.length;

      console.log(
        `💎 Avg Divergence Signal Score: ${avgDivergenceScore.toFixed(1)}`
      );
      console.log(`📊 Avg Regular Signal Score: ${avgRegularScore.toFixed(1)}`);
      console.log(
        `🚀 Score Enhancement: +${(
          avgDivergenceScore - avgRegularScore
        ).toFixed(1)} points`
      );

      // Analyze divergence types
      const typeCount = {};
      divergenceSignals.forEach((signal) => {
        const type = signal.divergenceData.strongestPattern?.type;
        if (type) {
          typeCount[type] = (typeCount[type] || 0) + 1;
        }
      });

      console.log("\n🔍 Divergence Pattern Distribution:");
      Object.entries(typeCount).forEach(([type, count]) => {
        console.log(`   ${type}: ${count} signals`);
      });
    }
  } catch (error) {
    console.log(`❌ Error analyzing results: ${error.message}`);
    console.log("\n📝 Usage Instructions:");
    console.log("1. Copy your Postman response JSON");
    console.log('2. Save it as "postman-results.json" in the scripts folder');
    console.log("3. Run: node analyze-divergence-results.js");
  }
}

// Check for results file
const resultsFile = path.join(__dirname, "postman-results.json");

if (fs.existsSync(resultsFile)) {
  analyzeDivergenceResults(resultsFile);
} else {
  console.log("📝 INSTRUCTIONS:");
  console.log("=====================================");
  console.log("1. Run your 300-stock test in Postman");
  console.log("2. Copy the entire JSON response");
  console.log('3. Save it as "postman-results.json" in the scripts folder');
  console.log("4. Run this script again: node analyze-divergence-results.js");
  console.log(
    "\n🎯 This will show you exactly which signals have divergence patterns!"
  );
}
