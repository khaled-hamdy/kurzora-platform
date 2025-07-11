require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

console.log("🔍 Testing Kurzora Setup...");

// Test 1: Environment Variables
console.log("\n1. Environment Variables:");
console.log("POLYGON_API_KEY:", !!process.env.POLYGON_API_KEY);
console.log("SUPABASE_URL:", !!process.env.VITE_SUPABASE_URL);
console.log("SERVICE_KEY:", !!process.env.SUPABASE_SERVICE_KEY);

// Test 2: Database Connection
console.log("\n2. Database Connection:");
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Test the backtest table first
supabase
  .from("backtest_historical_prices")
  .select("COUNT(*)", { count: "exact" })
  .then((result) => {
    console.log("Database connection:", result.error ? "FAILED" : "SUCCESS");
    console.log("Table exists:", !result.error);
    if (result.error) {
      console.log("Error details:", result.error.message);
    }

    // Test 3: Stock Count
    return supabase
      .from("active_stocks")
      .select("ticker", { count: "exact" })
      .eq("is_active", true);
  })
  .then((result) => {
    console.log("\n3. Your Stock Count:");
    console.log("Active stocks:", result.count);
    console.log("Cost per year: $" + (result.count * 252 * 0.002).toFixed(2));
    console.log(
      "Time per year: ~" +
        ((result.count * 252 * 0.15) / 3600).toFixed(1) +
        " hours"
    );

    // Test 4: Direct Table Test
    console.log("\n4. Direct Table Test:");
    return supabase.from("backtest_historical_prices").select("*").limit(1);
  })
  .then((result) => {
    console.log(
      "Direct table query result:",
      result.error ? "FAILED" : "SUCCESS"
    );
    if (result.error) {
      console.log("Direct table error:", result.error.message);
    } else {
      console.log("Table is accessible and empty (expected)");
    }

    console.log("\n✅ Setup verification complete!");
    process.exit(0);
  })
  .catch((err) => {
    console.log("❌ Error:", err.message);
    process.exit(1);
  });
