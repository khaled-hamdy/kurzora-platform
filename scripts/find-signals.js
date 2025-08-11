require("dotenv").config();
const fetch = require("node-fetch");

async function findSignals() {
  console.log("🎯 SESSION #402: Finding Signals with Wide Ranges");
  console.log("=".repeat(60));

  const ranges = [
    { start: 0, end: 50, name: "First 50 stocks" },
    { start: 50, end: 100, name: "Next 50 stocks" },
    { start: 100, end: 150, name: "Stocks 100-150" },
    { start: 0, end: 200, name: "All 200 stocks (LARGE TEST)" },
  ];

  for (let range of ranges) {
    console.log(`\n🔍 Testing ${range.name} (${range.start}-${range.end})`);
    console.log("-".repeat(40));

    try {
      const response = await fetch(
        `${process.env.VITE_SUPABASE_URL}/functions/v1/automated-signal-generation-v4`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
            apikey: process.env.SUPABASE_SERVICE_KEY,
          },
          body: JSON.stringify({
            startIndex: range.start,
            endIndex: range.end,
            batchNumber: 999,
            divergence: { enabled: true },
          }),
          timeout: 120000, // 2 minutes for large ranges
        }
      );

      console.log(`📊 Status: ${response.status}`);

      if (response.ok) {
        const data = await response.json();
        const signalCount = data.data?.signals?.length || 0;

        console.log(`📈 Signals Generated: ${signalCount}`);

        if (signalCount > 0) {
          console.log(
            `🎉 SUCCESS! Found ${signalCount} signals in range ${range.start}-${range.end}`
          );

          // Show divergence stats
          if (data.divergence_stats) {
            console.log(`📊 Divergence Enhancement:`);
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
              `   Enhancement Rate: ${data.divergence_stats.divergence_enhancement_rate}%`
            );
          }

          // Show first few signals with divergence bonuses
          const enhancedSignals = data.data.signals.filter(
            (s) => s.divergence_bonus > 0
          );
          if (enhancedSignals.length > 0) {
            console.log(`🎯 Enhanced Signals Examples:`);
            enhancedSignals.slice(0, 3).forEach((signal) => {
              console.log(
                `   ${signal.ticker}: ${signal.confidence_score}% (+${signal.divergence_bonus} divergence bonus)`
              );
            });
          }

          return; // Found signals, stop testing
        } else {
          console.log(`⚠️ No signals in this range`);
        }
      } else {
        const errorText = await response.text();
        console.log(`❌ Error: ${errorText.substring(0, 200)}...`);
      }
    } catch (error) {
      if (error.code === "ETIMEDOUT") {
        console.log(`⏰ Timeout - range too large`);
      } else {
        console.log(`❌ Error: ${error.message}`);
      }
    }
  }

  console.log("\n🔍 ANALYSIS:");
  console.log("If no signals found in any range, this suggests:");
  console.log("1. Current market conditions don't meet signal criteria");
  console.log("2. Gatekeeper rules are too strict");
  console.log("3. Data availability issues");
  console.log("4. All stocks currently have neutral indicators");
}

findSignals();
