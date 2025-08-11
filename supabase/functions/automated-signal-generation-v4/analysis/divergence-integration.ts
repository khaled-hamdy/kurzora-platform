// ==================================================================================
// 🎯 SESSION #402: RSI DIVERGENCE INTEGRATION - SIGNAL PIPELINE INTEGRATION
// ==================================================================================
// 🚨 PURPOSE: Real RSI divergence integration for 1D timeframe
// 🛡️ ANTI-REGRESSION MANDATE: No existing functionality affected
// 📊 1D SPECIALIZED: Production-ready divergence detection - superior signal quality
// 🔧 DATABASE READY: Structured for indicators table integration
// ✅ NO SYNTHETIC DATA: Real mathematical analysis only
// 🎖️ NOISE REDUCTION: Daily timeframe eliminates intraday noise for reliable patterns
// ==================================================================================

import { analyzeRSIDivergence } from "./rsi-divergence-analyzer.ts";
import { DivergenceDetectionResult } from "../types/divergence-types.ts";

/**
 * 🎯 ENHANCE SIGNAL WITH DIVERGENCE - MAIN INTEGRATION FUNCTION
 * PURPOSE: Add real RSI divergence analysis to signal processing
 * 1D FOCUS: Optimized for daily timeframe analysis - superior signal quality
 * DATABASE: Returns structured data for indicators table
 */
export async function enhanceSignalWithDivergence(
  ticker: string,
  prices: number[],
  rsiValues: number[],
  currentSignalScore: number,
  options: { sensitivityLevel?: number; enableDebug?: boolean } = {}
): Promise<{
  enhancedScore: number;
  divergenceBonus: number;
  hasStrongDivergence: boolean;
  divergenceMetadata: any;
  divergenceIndicatorData?: any; // For database storage
}> {
  console.log(
    `🎯 [DIVERGENCE_INTEGRATION] Starting real 1D divergence analysis for ${ticker}...`
  );

  try {
    // Real divergence analysis using production algorithm
    const divergenceResult: DivergenceDetectionResult =
      await analyzeRSIDivergence(prices, rsiValues, {
        sensitivityLevel: options.sensitivityLevel || 5,
        enableDebug: options.enableDebug || false,
        minConfidenceScore: 70,
        minQualityScore: 60,
        maxPeriods: 100, // 1D optimized window
      });

    // Extract key values
    const divergenceBonus = divergenceResult.scoreContribution;
    const hasStrongDivergence =
      divergenceResult.hasValidDivergence &&
      (divergenceResult.strongestPattern?.tradingSignalStrength || 0) >= 70;
    const enhancedScore = Math.min(100, currentSignalScore + divergenceBonus);

    // Create comprehensive metadata
    const divergenceMetadata = {
      session: "SESSION_402_1D_DIVERGENCE_PRODUCTION",
      analysisTimestamp: new Date().toISOString(),
      analysisSuccessful: divergenceResult.analysisSuccessful,
      hasValidDivergence: divergenceResult.hasValidDivergence,

      // Pattern summary
      totalPatternsFound: divergenceResult.totalPatternsFound,
      validPatternsCount: divergenceResult.validPatternsCount,
      dataQuality: divergenceResult.dataQuality,
      processingTime: divergenceResult.processingTime,

      // Strongest pattern details
      strongestPattern: divergenceResult.strongestPattern
        ? {
            type: divergenceResult.strongestPattern.type,
            strength: divergenceResult.strongestPattern.strength,
            confidenceScore: divergenceResult.strongestPattern.confidenceScore,
            tradingSignalStrength:
              divergenceResult.strongestPattern.tradingSignalStrength,
            pricePointsCount:
              divergenceResult.strongestPattern.pricePoints.length,
            rsiPointsCount: divergenceResult.strongestPattern.rsiPoints.length,
            slopeDifference: divergenceResult.strongestPattern.slopeDifference,
          }
        : null,

      // Analysis quality
      errors: divergenceResult.errors,
      warnings: divergenceResult.warnings,
      timeframe: "1D",
    };

    // Prepare indicator data for database storage
    const divergenceIndicatorData = divergenceResult.hasValidDivergence
      ? {
          indicator_name: "RSI_DIVERGENCE",
          timeframe: "1D",
          raw_value: divergenceResult.indicatorValue,
          score_contribution: divergenceResult.scoreContribution,
          scoring_version: "session_402_1d_divergence",
          metadata: divergenceResult.metadata,
        }
      : null;

    console.log(
      `✅ [DIVERGENCE_INTEGRATION] ${ticker}: Real analysis complete`
    );
    console.log(
      `📊 [DIVERGENCE_INTEGRATION] ${ticker}: Patterns found: ${divergenceResult.totalPatternsFound}, Valid: ${divergenceResult.validPatternsCount}`
    );
    console.log(
      `💰 [DIVERGENCE_INTEGRATION] ${ticker}: Bonus: ${divergenceBonus.toFixed(
        2
      )}, Enhanced Score: ${enhancedScore.toFixed(2)}`
    );

    return {
      enhancedScore,
      divergenceBonus,
      hasStrongDivergence,
      divergenceMetadata,
      divergenceIndicatorData,
    };
  } catch (error) {
    console.log(
      `❌ [DIVERGENCE_INTEGRATION] ${ticker}: Error during divergence analysis: ${error.message}`
    );

    return {
      enhancedScore: currentSignalScore,
      divergenceBonus: 0,
      hasStrongDivergence: false,
      divergenceMetadata: {
        session: "SESSION_402_1D_DIVERGENCE_PRODUCTION",
        analysisTimestamp: new Date().toISOString(),
        error: error.message,
        analysisSuccessful: false,
        timeframe: "1D",
      },
      divergenceIndicatorData: null,
    };
  }
}

export class DivergencePipelineManager {
  private isEnabled: boolean = true;
  private sensitivityLevel: number = 5;

  constructor(config: { sensitivityLevel?: number; enabled?: boolean } = {}) {
    this.isEnabled = config.enabled !== false;
    this.sensitivityLevel = config.sensitivityLevel || 5;
  }

  configureDivergence(options: {
    enabled?: boolean;
    sensitivityLevel?: number;
  }): void {
    if (options.enabled !== undefined) {
      this.isEnabled = options.enabled;
    }
    if (options.sensitivityLevel !== undefined) {
      this.sensitivityLevel = options.sensitivityLevel;
    }
    console.log(
      `🔧 [DIVERGENCE_PIPELINE] Configured - Enabled: ${this.isEnabled}, Sensitivity: ${this.sensitivityLevel}`
    );
  }

  getStatus(): { enabled: boolean; ready: boolean } {
    return { enabled: this.isEnabled, ready: true };
  }
}
