// File: backend/test-signal-alerts.js
// Test script to verify the signal alerts API endpoint
// Run this to make sure everything works before setting up the database trigger

import fetch from "node-fetch";

const API_URL = "http://localhost:3001/api/process-signal-alerts";

// Test payload that mimics what the database trigger will send
const testPayload = {
  type: "INSERT",
  table: "trading_signals",
  record: {
    id: "test-signal-123",
    ticker: "AAPL",
    signal_type: "bullish",
    confidence_score: 95,
    signals: {
      "1H": 96,
      "4H": 94,
      "1D": 93,
      "1W": 97,
    },
    entry_price: 150.0,
    stop_loss: 145.0,
    take_profit: 160.0,
    final_score: 95,
    status: "active",
    created_at: new Date().toISOString(),
  },
  timestamp: new Date().toISOString(),
};

async function testSignalAlertsAPI() {
  console.log("🧪 Testing Signal Alerts API...");
  console.log("📍 API URL:", API_URL);
  console.log("📦 Test Payload:", JSON.stringify(testPayload, null, 2));

  try {
    console.log("\n🚀 Sending test request...");

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testPayload),
    });

    const result = await response.json();

    console.log(`\n📊 Response Status: ${response.status}`);
    console.log("📋 Response Body:", JSON.stringify(result, null, 2));

    if (response.ok) {
      console.log("\n✅ SUCCESS: API endpoint is working correctly!");

      if (result.processed) {
        console.log("📧 Email alerts were processed and sent!");
      } else {
        console.log(
          "📭 Email alerts were not sent (possibly no eligible users or score too low)"
        );
      }

      if (result.userCount > 0) {
        console.log(`👥 Found ${result.userCount} eligible users for alerts`);
      }
    } else {
      console.log("\n❌ ERROR: API request failed");
      console.log("🔍 Check your backend server and environment variables");
    }
  } catch (error) {
    console.log("\n❌ CONNECTION ERROR:", error.message);
    console.log("🔍 Make sure your backend server is running on port 3001");
    console.log("💡 Run: cd backend && npm run dev");
  }
}

// Also test the health endpoint
async function testHealthEndpoint() {
  console.log("\n🏥 Testing Health Endpoint...");

  try {
    const response = await fetch("http://localhost:3001/health");
    const result = await response.json();

    if (response.ok) {
      console.log("✅ Health check passed:", result.status);
    } else {
      console.log("❌ Health check failed");
    }
  } catch (error) {
    console.log("❌ Health endpoint not reachable:", error.message);
  }
}

// Run tests
async function runAllTests() {
  console.log("🚀 KURZORA EMAIL ALERTS - API TEST\n");

  await testHealthEndpoint();
  await testSignalAlertsAPI();

  console.log("\n" + "=".repeat(50));
  console.log("📋 NEXT STEPS:");
  console.log("1. If tests pass ✅ - Deploy the database trigger");
  console.log(
    "2. If tests fail ❌ - Check backend server and environment variables"
  );
  console.log(
    "3. Check the deployment guide: EMAIL_ALERTS_DEPLOYMENT_GUIDE.md"
  );
  console.log("=".repeat(50));
}

runAllTests();
