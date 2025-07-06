// FIXED: SignalGenerationService.ts - Progress Logic Fix
// src/services/signalGenerationService.ts

import {
  EnhancedSignalProcessor,
  processStocksWithIntelligentRiskManagement,
} from "../lib/signals/enhanced-signal-processor";
import { StockScanner } from "../lib/signals/stock-scanner";

export interface GenerationResult {
  success: boolean;
  totalProcessed: number;
  signalsGenerated: number;
  signalsSaved: number;
  errors: string[];
  duration: number;
}

export interface GenerationProgress {
  stage: "starting" | "processing" | "saving" | "complete" | "error";
  progress: number; // 0-100
  currentStock?: string;
  message: string;
}

export type ProgressCallback = (progress: GenerationProgress) => void;

export class SignalGenerationService {
  private isGenerating: boolean = false;

  constructor() {
    // No need to create processor instance - we use the standalone function
  }

  /**
   * Generate fresh signals using your working enhanced-signal-processor.ts
   * This matches exactly how SignalsTest.tsx works (Session #126 recovery)
   */
  async generateFreshSignals(
    onProgress?: ProgressCallback
  ): Promise<GenerationResult> {
    if (this.isGenerating) {
      throw new Error("Signal generation already in progress");
    }

    this.isGenerating = true;
    const startTime = Date.now();
    const errors: string[] = [];

    try {
      // Stage 1: Starting
      onProgress?.({
        stage: "starting",
        progress: 0,
        message: "Initializing Session #126 intelligent risk management...",
      });

      // Stage 2: Get stock universe (exactly like SignalsTest.tsx)
      onProgress?.({
        stage: "processing",
        progress: 5,
        message: "Getting stock universe from modular scanner...",
      });

      const stockUniverse = StockScanner.getDefaultStockUniverse();
      console.log(
        `📊 Processing ${stockUniverse.length} stocks from modular universe`
      );

      // Stage 3: Process stocks with exact Session #126 configuration
      onProgress?.({
        stage: "processing",
        progress: 10,
        message: "Starting Session #126 enhanced signal processing...",
      });

      // 🚀 FIXED: Progress callback logic - prevent reset to 10%
      let lastProgressPercentage = 10; // Track last progress to prevent going backwards

      // Use EXACT same function call as working SignalsTest.tsx
      const result = await processStocksWithIntelligentRiskManagement(
        stockUniverse,
        {
          enableAutoSave: true, // Always enable for integration
          minScoreForSave: 60, // Session #126 working threshold
          enableDetailedLogging: true, // Enable logging for debugging
          clearOldSignals: true, // Clear old signals first
          fetchRealPrices: true, // Fetch real prices
        },
        (progress) => {
          // 🚀 FIXED: Improved progress callback logic
          console.log("🔍 Raw progress callback received:", progress);

          // Calculate percentage based on stocks processed - FIXED LOGIC
          let percentage = 10; // Start at 10%

          // Check multiple possible progress indicators from enhanced-signal-processor
          if (
            progress.stocksScanned !== undefined &&
            progress.totalStocks !== undefined &&
            progress.totalStocks > 0
          ) {
            // Method 1: Use stocksScanned/totalStocks if available
            percentage =
              10 +
              Math.round((progress.stocksScanned / progress.totalStocks) * 80); // 10% to 90%
            console.log(
              `📊 Progress Method 1: ${progress.stocksScanned}/${progress.totalStocks} = ${percentage}%`
            );
          } else if (
            progress.processed !== undefined &&
            progress.total !== undefined &&
            progress.total > 0
          ) {
            // Method 2: Use processed/total if available
            percentage =
              10 + Math.round((progress.processed / progress.total) * 80); // 10% to 90%
            console.log(
              `📊 Progress Method 2: ${progress.processed}/${progress.total} = ${percentage}%`
            );
          } else if (progress.progress !== undefined && progress.progress > 0) {
            // Method 3: Use direct progress if available
            percentage = Math.max(10, Math.min(90, progress.progress));
            console.log(
              `📊 Progress Method 3: Direct progress = ${percentage}%`
            );
          } else {
            // Method 4: Increment based on stock names
            if (progress.currentStock) {
              lastProgressPercentage = Math.min(85, lastProgressPercentage + 2); // Increment by 2% per stock
              percentage = lastProgressPercentage;
              console.log(`📊 Progress Method 4: Incremental = ${percentage}%`);
            }
          }

          // 🚀 CRITICAL FIX: Prevent progress from going backwards
          percentage = Math.max(lastProgressPercentage, percentage);
          lastProgressPercentage = percentage;

          // Build descriptive message
          let message = progress.stage || "Processing stocks";
          if (progress.currentStock) {
            message = `Fetching ${progress.timeframe || "1H"} Data: ${
              progress.currentStock
            }`;
            if (
              progress.stocksScanned !== undefined &&
              progress.totalStocks !== undefined
            ) {
              message += ` (${progress.stocksScanned}/${progress.totalStocks})`;
            }
          }

          console.log(
            `✅ Sending progress update: ${percentage}% - ${message}`
          );

          onProgress?.({
            stage: "processing",
            progress: percentage,
            currentStock: progress.currentStock || "",
            message: message,
          });
        }
      );

      // Stage 4: Processing complete
      onProgress?.({
        stage: "saving",
        progress: 95,
        message: "Signals saved to trading_signals table...",
      });

      // Stage 5: Complete
      const duration = Date.now() - startTime;

      onProgress?.({
        stage: "complete",
        progress: 100,
        message: `✅ Generated ${result.signals?.length || 0} signals, saved ${
          result.autoSaveResult?.signalsSaved || 0
        } in ${Math.round(duration / 1000)}s`,
      });

      console.log("🎉 Signal generation service complete!");
      console.log(
        `📊 Results: ${result.signals?.length || 0} signals, ${
          result.autoSaveResult?.signalsSaved || 0
        } saved to DB`
      );

      return {
        success: true,
        totalProcessed: result.processingStats?.totalStocks || 0,
        signalsGenerated: result.signals?.length || 0,
        signalsSaved: result.autoSaveResult?.signalsSaved || 0,
        errors,
        duration,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      errors.push(errorMessage);

      onProgress?.({
        stage: "error",
        progress: 0,
        message: `❌ Error: ${errorMessage}`,
      });

      console.error("❌ Signal generation service failed:", error);

      return {
        success: false,
        totalProcessed: 0,
        signalsGenerated: 0,
        signalsSaved: 0,
        errors,
        duration: Date.now() - startTime,
      };
    } finally {
      this.isGenerating = false;
    }
  }

  /**
   * Check if signal generation is currently running
   */
  isCurrentlyGenerating(): boolean {
    return this.isGenerating;
  }

  /**
   * Get status of the signal generation system
   */
  async getSystemStatus(): Promise<{
    healthy: boolean;
    lastGenerationTime?: Date;
    apiConnectionStatus: "connected" | "disconnected" | "unknown";
  }> {
    try {
      // Test system health by checking if we can access the core functions
      const processor = new EnhancedSignalProcessor();
      const health = await processor.testSystemHealth();

      return {
        healthy: health.status === "healthy",
        lastGenerationTime: undefined, // Could be stored in localStorage
        apiConnectionStatus:
          health.status === "healthy" ? "connected" : "disconnected",
      };
    } catch (error) {
      console.warn("System health check failed:", error);
      return {
        healthy: false,
        apiConnectionStatus: "disconnected",
      };
    }
  }
}

// Export singleton instance
export const signalGenerationService = new SignalGenerationService();
