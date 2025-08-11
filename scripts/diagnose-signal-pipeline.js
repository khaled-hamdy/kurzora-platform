require("dotenv").config();
const fetch = require("node-fetch");

const CONFIG = {
  EDGE_FUNCTION_URL: `${process.env.VITE_SUPABASE_URL}/functions/v1/automated-signal-generation-v4`,
  SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY,
};

async function diagnoseSignalPipeline() {
  console.log("🎯 SESSION #402: Diagnosing Signal Pipeline");
  console.log("=".repeat(60));

  try {
    const response = await fetch(CONFIG.EDGE_FUNCTION_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CONFIG.SUPABASE_SERVICE_KEY}`,
        apikey: CONFIG.SUPABASE_SERVICE_KEY,
      },
      body: JSON.stringify({
        startIndex: 0,
        endIndex: 50, // Test with more stocks
        batchNumber: 999,
        divergence: { enabled: true, mode: "standard" },
      }),
      timeout: 120000, // 2 minutes timeout
    });

    console.log(`📊 HTTP Status: ${response.status}`);
    console.log(
      `📊 Response Headers:`,
      Object.fromEntries(response.headers.entries())
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.log(`❌ Error Response:`);
      console.log(errorText);
      return;
    }

    const data = await response.json();

    console.log("\n🔍 RESPONSE ANALYSIS:");
    console.log(`📊 Session #402 Active: ${!!data.session_402_divergence}`);
    console.log(`📊 Session #313 Present: ${!!data.session_313_production}`);
    console.log(`📊 Data Object Present: ${!!data.data}`);
    console.log(`📊 Signals Array Present: ${!!data.data?.signals}`);
    console.log(`📊 Signals Length: ${data.data?.signals?.length || 0}`);

    if (data.metadata) {
      console.log(`📊 Metadata Present: YES`);
      console.log(
        `📊 Processing Time: ${data.metadata.processingTime || "N/A"}ms`
      );
      console.log(`📊 Success: ${data.metadata.success || data.success}`);
    } else {
      console.log(`📊 Metadata Present: NO`);
    }

    if (data.errors && data.errors.length > 0) {
      console.log(`❌ Errors Found:`);
      data.errors.forEach((error) => console.log(`   ${error}`));
    }

    if (data.data?.signals && data.data.signals.length === 0) {
      console.log("\n⚠️ ZERO SIGNALS GENERATED - POSSIBLE CAUSES:");
      console.log("   1. Market conditions - no signals meet criteria");
      console.log("   2. Gatekeeper rules too strict");
      console.log("   3. Data availability issues");
      console.log("   4. Pipeline processing errors");
      console.log("   5. Database connection issues");
    }

    // Save full response for analysis
    const fs = require("fs");
    fs.writeFileSync("diagnostic-response.json", JSON.stringify(data, null, 2));
    console.log("\n📁 Full response saved to: diagnostic-response.json");
  } catch (error) {
    console.log(`❌ Diagnostic failed: ${error.message}`);
    if (error.code === "ECONNRESET" || error.code === "ETIMEDOUT") {
      console.log(
        "   This might be a timeout - the function is taking too long"
      );
    }
  }
}

diagnoseSignalPipeline();
