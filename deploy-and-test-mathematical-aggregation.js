const https = require("https");
const fs = require("fs");

console.log("🧮 KURZORA MATHEMATICAL AGGREGATION DEPLOYMENT TEST");
console.log("====================================================");

const projectId = "jmblsasofgvzizypiaci";
const authToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptYmxzYXNvZmd2eml6eXBpYWNpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNjM1OTQzOCwiZXhwIjoyMDUxOTM1NDM4fQ.PovV6ZbrYsKthFtiRzJWKLaamNQ2HnYHv2SiK9IJmJg7ccyukFaiCpF3RM56aXUkOa";

const edgeFunctionUrl = `https://${projectId}.supabase.co/functions/v1/automated-signal-generation-v4`;
const testTickers = ["A", "AAPL"];

console.log(`🎯 Testing: ${testTickers.join(", ")}`);
console.log(`📡 URL: ${edgeFunctionUrl}`);

const testPayload = {
  action: "full_analysis",
  tickers: testTickers,
  include_debug: true,
};
const data = JSON.stringify(testPayload);
const urlParts = edgeFunctionUrl.replace("https://", "").split("/");

const options = {
  hostname: urlParts[0],
  port: 443,
  path: "/" + urlParts.slice(1).join("/"),
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${authToken}`,
    "Content-Length": data.length,
  },
};

console.log("📡 Making request...");

const req = https.request(options, (res) => {
  let body = "";
  res.on("data", (chunk) => {
    body += chunk;
  });
  res.on("end", () => {
    console.log(`📥 Response status: ${res.statusCode}`);

    try {
      const result = JSON.parse(body);

      if (result.signals?.length) {
        console.log(`✅ Generated ${result.signals.length} signals`);

        const timeframeStats = { "1H": 0, "4H": 0, "1D": 0, "1W": 0 };
        let macdSuccesses = 0;
        let mathematicalAggregations = 0;

        result.signals.forEach((signal) => {
          if (signal.signals) {
            Object.keys(signal.signals).forEach((tf) => {
              if (timeframeStats.hasOwnProperty(tf)) timeframeStats[tf]++;
            });
          }
          if (signal.indicator_name === "MACD" && signal.raw_value !== null)
            macdSuccesses++;
          if (
            signal.metadata &&
            JSON.stringify(signal.metadata).includes("Mathematical")
          )
            mathematicalAggregations++;
        });

        console.log("\n📊 Timeframe Success:");
        Object.entries(timeframeStats).forEach(([tf, count]) => {
          const percentage = ((count / result.signals.length) * 100).toFixed(1);
          const status = count > 0 ? "✅" : "❌";
          const target =
            tf === "4H" || tf === "1W" ? "(TARGET)" : "(PRESERVED)";
          console.log(
            `   ${status} ${tf}: ${count} (${percentage}%) ${target}`
          );
        });

        console.log(
          `\n🧮 Mathematical Aggregations: ${mathematicalAggregations}`
        );
        console.log(`🔧 MACD Successes: ${macdSuccesses}`);

        const fourHSuccess = timeframeStats["4H"] > 0;
        const oneWSuccess = timeframeStats["1W"] > 0;
        const macdFixed = macdSuccesses > 0;

        console.log("\n🎯 SUCCESS CRITERIA:");
        console.log(`   ${fourHSuccess ? "✅" : "❌"} 4H working (CRITICAL)`);
        console.log(`   ${oneWSuccess ? "✅" : "❌"} 1W working (CRITICAL)`);
        console.log(`   ${macdFixed ? "✅" : "❌"} MACD fixed (BUG FIX)`);

        if (fourHSuccess && oneWSuccess && macdFixed) {
          console.log("\n🏆 MATHEMATICAL AGGREGATION: COMPLETE SUCCESS!");
        } else {
          console.log("\n⚠️  Mathematical aggregation needs attention");
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        fs.writeFileSync(
          `math-agg-test-${timestamp}.json`,
          JSON.stringify(result, null, 2)
        );
        console.log(`\n💾 Report saved: math-agg-test-${timestamp}.json`);
      } else {
        console.log("❌ No signals in response");
        console.log(
          "Raw response:",
          JSON.stringify(result || {}).substring(0, 500)
        );
      }
    } catch (e) {
      console.log("❌ Parse error:", e.message);
      console.log("Raw response:", body.substring(0, 500));
    }
  });
});

req.on("error", (error) => console.error("❌ Request failed:", error.message));
req.write(data);
req.end();
