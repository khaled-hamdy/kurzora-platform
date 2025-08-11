#!/usr/bin/env node

// ==================================================================================
// 🎯 SESSION #402: DIVERGENCE UI INTEGRATION TEST
// ==================================================================================
// Tests the complete flow: Backend divergence detection → Frontend UI display
// This script calls the v4 function and saves the response for UI analysis

const fs = require("fs");
const path = require("path");

// Supabase configuration
const SUPABASE_URL = "https://jmbkssafogvzizypjaoi.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IjNtYnFkempncmpneGF3cXRyYXFtIiwidXJsIjoiUE5EdlBqeUxLWE1mZXdldnFQdWZMZVJUSVFXeEJCQjMuZXhhbXBsZSIsImlhdCI6MTYyOTM2ODA0NCwiZXhwIjoxOTQ0OTQ0MDQ0fQ.wfwcO-dLYBXd3tHTm8U2iOPXIEJ6FhGJnv2UBr-QJVK"; // Replace with your actual key

/**
 * Test divergence detection with backend and capture UI data
 */
async function testDivergenceIntegration() {
  console.log("🎯 SESSION #402: Testing Divergence UI Integration...\n");

  try {
    // Test parameters for divergence detection
    const testParams = {
      startIndex: 0,
      endIndex: 9, // Test 10 stocks for better chances of finding divergence
      divergenceEnabled: true,
      divergenceConfig: {
        timeframe: "1D",
        sensitivityLevel: 5,
        enableDebug: true,
      },
    };

    console.log(
      "📡 Calling automated-signal-generation-v4 with divergence enabled..."
    );

    const response = await fetch(
      `${SUPABASE_URL}/functions/v1/automated-signal-generation-v4`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          apikey: SUPABASE_ANON_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testParams),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    console.log("✅ Response received from backend\n");

    // Extract divergence statistics
    const divergenceStats = data.divergence_stats || {};
    const signals = data.data?.signals || [];

    console.log("📊 DIVERGENCE STATISTICS:");
    console.log(`   Total Signals: ${divergenceStats.total_signals || 0}`);
    console.log(
      `   Signals with Divergence: ${
        divergenceStats.signals_with_divergence || 0
      }`
    );
    console.log(
      `   Signals with Strong Divergence: ${
        divergenceStats.signals_with_strong_divergence || 0
      }`
    );
    console.log(
      `   Average Divergence Bonus: ${
        divergenceStats.average_divergence_bonus || 0
      }`
    );
    console.log(
      `   Divergence Enhancement Rate: ${
        divergenceStats.divergence_enhancement_rate || 0
      }%\n`
    );

    // Save full response for frontend testing
    const outputPath = path.join(__dirname, "divergence-ui-test-data.json");
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
    console.log(`💾 Full response saved to: ${outputPath}\n`);

    // Analyze signals for UI display
    console.log("🎨 SIGNALS FOR UI TESTING:");
    console.log("=".repeat(60));

    const uiReadySignals = [];

    signals.forEach((signal, index) => {
      const divergenceData = signal.analysis?.session_402_divergence;
      const hasDivergence = divergenceData?.hasValidDivergence === true;

      console.log(
        `${index + 1}. ${signal.ticker} (Score: ${
          signal.confidence_score || signal.final_score
        })`
      );

      if (hasDivergence) {
        const pattern = divergenceData.strongestPattern;
        const bonus = divergenceData.scoreBonus || 0;

        console.log(`   🎯 DIVERGENCE DETECTED!`);
        console.log(
          `   📊 Pattern: ${pattern?.type || "Unknown"} (${
            pattern?.strength || "Unknown"
          })`
        );
        console.log(`   💰 Score Bonus: +${bonus.toFixed(1)} points`);
        console.log(`   🎨 UI Badge: ${getUIBadgePreview(pattern)}`);
        console.log(
          `   📈 Enhanced Score: ${
            signal.confidence_score || signal.final_score
          } [+${Math.round(bonus)}]`
        );

        // Prepare for frontend testing
        uiReadySignals.push({
          ticker: signal.ticker,
          hasValidDivergence: true,
          pattern: pattern,
          scoreBonus: bonus,
          finalScore: signal.confidence_score || signal.final_score,
        });
      } else {
        console.log(`   📊 No divergence detected`);
      }
      console.log("");
    });

    // Save UI-ready signals for frontend integration
    const uiDataPath = path.join(__dirname, "ui-ready-signals.json");
    fs.writeFileSync(uiDataPath, JSON.stringify(uiReadySignals, null, 2));
    console.log(`🎨 UI-ready signals saved to: ${uiDataPath}`);

    console.log("\n🎯 NEXT STEPS FOR UI TESTING:");
    console.log("1. Visit: http://localhost:5173/divergence-test (mock data)");
    console.log(
      "2. Visit: http://localhost:5173/signals (real data integration)"
    );
    console.log(
      "3. Look for divergence badges and enhanced scores in SignalCards"
    );
    console.log("4. Check browser console for any UI integration issues");

    if (uiReadySignals.length > 0) {
      console.log(
        `\n🎉 SUCCESS: Found ${uiReadySignals.length} signals with divergence patterns!`
      );
      console.log(
        "Your divergence UI should display these enhancements automatically."
      );
    } else {
      console.log("\n⚠️  No divergence patterns found in this batch.");
      console.log(
        "This is normal - divergence patterns are rare and require specific market conditions."
      );
      console.log(
        "You can still test the UI with the mock data at /divergence-test"
      );
    }
  } catch (error) {
    console.error("❌ Error testing divergence integration:", error.message);
    console.log("\n🔧 TROUBLESHOOTING:");
    console.log("1. Check if Supabase function is deployed");
    console.log("2. Verify SUPABASE_URL and SUPABASE_ANON_KEY are correct");
    console.log("3. Ensure your JWT token hasn't expired");
    console.log(
      "4. Test the mock UI first: http://localhost:5173/divergence-test"
    );
  }
}

/**
 * Get UI badge preview for console display
 */
function getUIBadgePreview(pattern) {
  if (!pattern) return "❓ D";

  const isBullish = pattern.type.includes("BULLISH");
  const isRegular = pattern.type.includes("REGULAR");

  if (isBullish) {
    return isRegular ? "↗ D (Bullish Regular)" : "⤴ D (Bullish Hidden)";
  } else {
    return isRegular ? "↙ D (Bearish Regular)" : "⤵ D (Bearish Hidden)";
  }
}

// Run the test
if (require.main === module) {
  testDivergenceIntegration();
}

