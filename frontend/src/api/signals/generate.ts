// API Endpoint for Real Signal Generation
// File: src/api/signals/generate.ts

import { StockScanner } from "../../lib/signals/stock-scanner";
import { TechnicalIndicators } from "../../lib/signals/technical-indicators";
import { ScoringEngine } from "../../lib/signals/scoring-engine";
import { SignalProcessor } from "../../lib/signals/signal-processor";

interface GenerateSignalsRequest {
  stockLimit?: number;
  minScore?: number;
  includeTimeframes?: string[];
}

interface GenerateSignalsResponse {
  signals: any[];
  stocksScanned: number;
  processingTime: number;
  success: boolean;
  error?: string;
}

export async function POST(request: Request): Promise<Response> {
  console.log("🚀 Starting real signal generation API...");

  try {
    const body: GenerateSignalsRequest = await request.json();
    const {
      stockLimit = 150,
      minScore = 60,
      includeTimeframes = ["1H", "4H", "1D", "1W"],
    } = body;

    const startTime = Date.now();
    console.log(
      `📊 Scanning up to ${stockLimit} stocks with min score ${minScore}...`
    );

    // Initialize your real signal generation system
    const stockScanner = new StockScanner();
    const technicalIndicators = new TechnicalIndicators();
    const scoringEngine = new ScoringEngine();
    const signalProcessor = new SignalProcessor();

    // Perform real stock scanning
    console.log("🔍 Starting real market scan...");
    const scanResults = await stockScanner.scanMarket({
      limit: stockLimit,
      minScore: minScore,
      includeTimeframes: includeTimeframes,
    });

    console.log(
      `✅ Scan complete! Found ${scanResults.length} qualifying signals`
    );

    // Filter and enhance results
    const enhancedSignals = scanResults
      .filter((signal) => signal.confidence_score >= minScore)
      .sort((a, b) => b.confidence_score - a.confidence_score)
      .slice(0, 20); // Limit to top 20 signals

    const processingTime = (Date.now() - startTime) / 1000;

    const response: GenerateSignalsResponse = {
      signals: enhancedSignals,
      stocksScanned: stockLimit,
      processingTime: Math.round(processingTime),
      success: true,
    };

    console.log(
      `🎉 API Success: ${enhancedSignals.length} signals in ${processingTime}s`
    );

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("❌ Signal generation API error:", error);

    const errorResponse: GenerateSignalsResponse = {
      signals: [],
      stocksScanned: 0,
      processingTime: 0,
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

// Alternative: Simple function call version for direct integration
export async function generateRealSignals(
  options: GenerateSignalsRequest = {}
) {
  const { stockLimit = 150, minScore = 60 } = options;

  try {
    console.log("🚀 Direct signal generation starting...");

    // Import your existing signal processor
    const { SignalProcessor } = await import(
      "../../lib/signals/signal-processor"
    );
    const signalProcessor = new SignalProcessor();

    // Generate signals using your existing system
    const results = await signalProcessor.generateSignals({
      stockLimit,
      minScore,
      timeframes: ["1H", "4H", "1D", "1W"],
    });

    console.log(`✅ Direct generation complete: ${results.length} signals`);
    return results;
  } catch (error) {
    console.error("❌ Direct signal generation error:", error);
    throw error;
  }
}
