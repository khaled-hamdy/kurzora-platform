require("dotenv").config();
const fetch = require("node-fetch");

const CONFIG = {
  EDGE_FUNCTION_URL: `${process.env.VITE_SUPABASE_URL}/functions/v1/automated-signal-generation-v4`,
  SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY,
};

async function testWithMoreStocks() {
  console.log("🎯 SESSION #402: Testing Divergence with More Stocks");
  console.log("=".repeat(60));

  const tests = [
    {
      name: "Test 5 Stocks (Standard)",
      params: {
        startIndex: 0,
        endIndex: 5,
        batchNumber: 999,
        divergence: { enabled: true, mode: "standard" },
      },
    },
    {
      name: "Test 10 Stocks (Sensitive)",
      params: {
        startIndex: 0,
        endIndex: 10,
        batchNumber: 999,
        divergence: { enabled: true, mode: "sensitive", sensitivityLevel: 8 },
      },
    },
    {
      name: "Test 20 Stocks (Conservative)",
      params: {
        startIndex: 0,
        endIndex: 20,
        batchNumber: 999,
        divergence: {
          enabled: true,
          mode: "conservative",
          sensitivityLevel: 3,
        },
      },
    },
  ];

  for (let test of tests) {
    console.log(`\n🔍 ${test.name}`);
    console.log("-".repeat(40));

    try {
      const response = await fetch(CONFIG.EDGE_FUNCTION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${CONFIG.SUPABASE_SERVICE_KEY}`,
          apikey: CONFIG.SUPABASE_SERVICE_KEY,
        },
        body: JSON.stringify(test.params),
        timeout: 60000,
      });

      const data = await response.json();

      console.log(`📊 Status: ${response.status}`);
      console.log(`📈 Signals Generated: ${data.data?.signals?.length || 0}`);

      if (data.divergence_stats && data.divergence_stats.total_signals > 0) {
        console.log(`📊 Divergence Results:`);
        console.log(`   Total Signals: ${data.divergence_stats.total_signals}`);
        console.log(
          `   With Divergence: ${data.divergence_stats.signals_with_divergence}`
        );
        console.log(
          `   Strong Divergence: ${data.divergence_stats.signals_with_strong_divergence}`
        );
        console.log(
          `   Avg Bonus: ${data.divergence_stats.average_divergence_bonus}`
        );
        console.log(
          `   Max Bonus: ${data.divergence_stats.max_divergence_bonus}`
        );
        console.log(
          `   Enhancement Rate: ${data.divergence_stats.divergence_enhancement_rate}%`
        );

        // Show first signal with divergence
        const signalWithDivergence = data.data.signals.find(
          (s) => s.divergence_bonus > 0
        );
        if (signalWithDivergence) {
          console.log(
            `🎯 Example Enhanced Signal (${signalWithDivergence.ticker}):`
          );
          console.log(
            `   Original Score: ${(
              signalWithDivergence.confidence_score -
              signalWithDivergence.divergence_bonus
            ).toFixed(2)}%`
          );
          console.log(
            `   Divergence Bonus: +${signalWithDivergence.divergence_bonus}`
          );
          console.log(
            `   Final Score: ${signalWithDivergence.confidence_score}%`
          );
          console.log(
            `   Strong Divergence: ${
              signalWithDivergence.has_strong_divergence ? "YES" : "NO"
            }`
          );

          if (signalWithDivergence.divergence_analysis?.strongestPattern) {
            const pattern =
              signalWithDivergence.divergence_analysis.strongestPattern;
            console.log(`   Pattern: ${pattern.type} (${pattern.strength})`);
            console.log(`   Confidence: ${pattern.confidenceScore}%`);
          }
        }
      } else {
        console.log(`📊 No signals generated in this range`);
      }
    } catch (error) {
      console.log(`❌ Test failed: ${error.message}`);
    }
  }
}

testWithMoreStocks();
