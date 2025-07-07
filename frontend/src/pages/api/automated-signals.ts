// 🎯 PURPOSE: HTTP endpoint that triggers existing enhanced-signal-processor.ts
// 🔧 SESSION #138: SINGLE SOURCE OF TRUTH - Uses existing working system exactly
// 🛡️ PRESERVATION: Zero new logic, just HTTP wrapper around existing system
// 📝 HANDOVER: Bulletproof automation using proven Session #134 enhanced processor

import type { NextApiRequest, NextApiResponse } from "next";
import { processStocksWithEnhancedRiskManagement } from "../../lib/signals/enhanced-signal-processor";
import { StockScanner } from "../../lib/signals/stock-scanner";

// 🔐 Simple API key validation for security
const AUTOMATION_API_KEY =
  process.env.AUTOMATION_API_KEY || "kurzora-automation-key-2025";

interface AutomatedSignalResponse {
  success: boolean;
  message: string;
  details: {
    total_signals: number;
    high_quality_signals: number;
    database_saves: number;
    processing_time: number;
    methodology: string;
    timestamp: string;
  };
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AutomatedSignalResponse>
) {
  // 🔐 Security: Only allow POST requests with correct API key
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
      details: {
        total_signals: 0,
        high_quality_signals: 0,
        database_saves: 0,
        processing_time: 0,
        methodology: "N/A",
        timestamp: new Date().toISOString(),
      },
      error: "Only POST method allowed",
    });
  }

  // 🔐 Validate API key (simple but effective)
  const providedKey =
    req.headers.authorization?.replace("Bearer ", "") || req.body?.api_key;
  if (providedKey !== AUTOMATION_API_KEY) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
      details: {
        total_signals: 0,
        high_quality_signals: 0,
        database_saves: 0,
        processing_time: 0,
        methodology: "N/A",
        timestamp: new Date().toISOString(),
      },
      error: "Invalid API key",
    });
  }

  console.log("🤖 Automated signal generation triggered via HTTP API...");
  console.log("🛡️ Using SINGLE SOURCE OF TRUTH: enhanced-signal-processor.ts");

  const startTime = Date.now();

  try {
    // 🎯 SINGLE SOURCE OF TRUTH: Use your existing enhanced-signal-processor.ts EXACTLY
    // This is the SAME code that works in your SignalsTest.tsx
    console.log("📊 Getting stock universe from existing stock-scanner.ts...");
    const allStocks = StockScanner.getDefaultStockUniverse();
    const stockUniverse = allStocks.slice(0, 3); // Test with just 3 stocks
    console.log(
      `🧪 TESTING: Processing only ${stockUniverse.length} stocks for quick test`
    );

    console.log(
      `📊 Processing ${stockUniverse.length} stocks using Session #134 enhanced methodology...`
    );

    // 🛡️ EXACT SAME CONFIGURATION as your working SignalsTest.tsx
    const result = await processStocksWithEnhancedRiskManagement(
      stockUniverse,
      {
        enableAutoSave: true, // ✅ Same as SignalsTest.tsx
        minScoreForSave: 80, // ✅ High quality signals only
        enableDetailedLogging: true, // ✅ Same as SignalsTest.tsx
        clearOldSignals: true, // ✅ Clean old signals
        fetchRealPrices: true, // ✅ Same as SignalsTest.tsx
        intelligentRiskManagement: true, // ✅ Session #134 enhanced
      },
      (progress) => {
        // Progress callback (same as SignalsTest.tsx)
        console.log(
          `📊 Progress: ${progress.stage} - ${progress.currentStock || ""}`
        );
      }
    );

    const processingTime = Date.now() - startTime;

    // 🎉 SUCCESS: Return same format as your existing system
    console.log(`🎉 Automated signal generation complete!`);
    console.log(
      `📊 Results: ${result.signals.length} signals, ${result.autoSaveResult.signalsSaved} saved to DB`
    );
    console.log(
      `💰 Enhanced prices: ${result.processingStats.pricesUpdated} stocks with real prices`
    );
    console.log(
      `🛡️ METHODOLOGY: Session #134 enhanced + Session #124 risk management`
    );

    // 📈 Count high-quality signals (same logic as your system)
    const highQualitySignals = result.signals.filter((s) => s.finalScore >= 80);

    return res.status(200).json({
      success: true,
      message: `Successfully generated ${result.autoSaveResult.signalsSaved} signals using existing enhanced-signal-processor.ts`,
      details: {
        total_signals: result.signals.length,
        high_quality_signals: highQualitySignals.length,
        database_saves: result.autoSaveResult.signalsSaved,
        processing_time: processingTime,
        methodology:
          "Session #134 enhanced smart entry + Session #124 risk management (SINGLE SOURCE OF TRUTH)",
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("❌ Automated signal generation failed:", error);

    const processingTime = Date.now() - startTime;

    return res.status(500).json({
      success: false,
      message: "Automated signal generation failed",
      details: {
        total_signals: 0,
        high_quality_signals: 0,
        database_saves: 0,
        processing_time: processingTime,
        methodology: "Session #134 enhanced (FAILED)",
        timestamp: new Date().toISOString(),
      },
      error: error.message,
    });
  }
}
