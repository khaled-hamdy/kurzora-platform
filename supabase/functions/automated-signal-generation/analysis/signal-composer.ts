// ==================================================================================
// 🎯 SESSION #305D: SIGNAL COMPOSER EXTRACTION - MODULAR ARCHITECTURE COMPONENT
// ==================================================================================
// 🚨 PURPOSE: Extract 7-indicator composite scoring into isolated, testable module following Session #305C pattern
// 🛡️ ANTI-REGRESSION MANDATE: ALL Session #183 + #302 + #303 + #304B functionality preserved EXACTLY
// 📝 SESSION #305D EXTRACTION: Moving calculate7IndicatorScore from 1600-line monolith to modular architecture
// 🔧 PRESERVATION: Session #304B S/R integration + Session #183 null handling + Session #302-303 modular integration
// 🚨 CRITICAL SUCCESS: Maintain identical scoring values for existing signals (±0.1% tolerance)
// ⚠️ PROTECTED LOGIC: Session #304B S/R proximity scoring (±12 to ±8 points) + 4/7 minimum requirement
// 🎖️ COMPOSITE SCORING: All 7 indicators (RSI, MACD, Bollinger, Volume, Stochastic, Williams, S/R) preserved exactly
// 📊 MODULAR INTEGRATION: Sessions #302 MACD + #303 Volume + #304 S/R module compatibility maintained
// 🏆 TESTING REQUIREMENT: Extracted module must produce identical scores to original function
// 🚀 PRODUCTION IMPACT: Enable modular architecture while preserving composite scoring accuracy
// ==================================================================================

/**
 * 🧮 INDICATOR VALUES INTERFACE - SESSION #305D SIGNAL INPUT STRUCTURE
 * 🎯 PURPOSE: Define structure for 7-indicator composite scoring input
 * 🔧 SESSION #304B COMPLIANCE: Includes supportResistance parameter for S/R proximity scoring
 * 🛡️ SESSION #302-303 INTEGRATION: Supports modular MACD and Volume analyzer results
 * 📊 PRODUCTION READY: Type-safe input structure for all technical indicators
 */
export interface IndicatorValues {
  rsi: number | null;
  macd: { macd: number } | null; // Session #302: Modular MACD Calculator format
  bb: { percentB: number } | null;
  volume: { ratio: number } | null; // Session #303: Modular Volume Analyzer format
  stoch: { percentK: number } | null;
  williams: { value: number } | null;
  supportResistance: { proximity: number; type: string } | null; // Session #304: Modular S/R Analyzer format
}

/**
 * 🎯 SIGNAL COMPOSER RESULT INTERFACE - SESSION #305D OUTPUT STRUCTURE
 * 🚨 PURPOSE: Standardized result format for composite signal scoring
 * 🔧 SESSION #183 COMPLIANCE: Supports null returns for insufficient real indicators
 * 📊 METADATA TRACKING: Comprehensive information for debugging and future sessions
 */
export interface SignalComposerResult {
  finalScore: number | null;
  realIndicatorCount: number;
  isValid: boolean;
  metadata: {
    requiredIndicators: number;
    actualIndicators: number;
    sessionIntegration: string;
    calculationMethod: string;
    preservedSessions: string[];
  };
}

/**
 * 🧮 SIGNAL COMPOSER - SESSION #305D MODULAR EXTRACTION
 * 🚨 CRITICAL EXTRACTION: Moved from 1600-line monolith (lines ~891-1050) to modular architecture
 * 🛡️ ANTI-REGRESSION: ALL Session #183 + #302 + #303 + #304B functionality preserved EXACTLY
 * 🎯 PURPOSE: Calculate 7-indicator composite scoring with S/R proximity analysis
 * 🔧 SESSION #304B PRESERVATION: S/R proximity scoring (±12 to ±8 points) maintained exactly
 * 🚨 SESSION #183 PRESERVATION: Null handling + 4/7 minimum requirement + no synthetic fallbacks
 * 📊 MODULAR INTEGRATION: Session #302 MACD + Session #303 Volume + Session #304 S/R compatibility
 * 🎖️ COMPOSITE LOGIC: All 7 indicators weighted and scored exactly as original function
 * 🚀 PRODUCTION READY: Identical scoring calculations to original monolithic function
 * 🔧 SESSION #305C COMPATIBILITY: Follows TimeframeDataCoordinator modular pattern exactly
 */
export class SignalComposer {
  /**
   * 🎯 CALCULATE 7-INDICATOR COMPOSITE SCORE - SESSION #305D EXTRACTED CORE LOGIC
   * 🚨 SESSION #183 + #302 + #303 + #304B PRESERVED: All functionality moved exactly from original function
   * 🛡️ ANTI-REGRESSION: Zero modifications to scoring logic, null handling, or S/R integration
   * 🔧 PURPOSE: Generate composite signal score from 7 technical indicators with modular integration
   * 📊 SESSION #304B PRESERVED: S/R proximity scoring with ±12 to ±8 point adjustments
   * 🎖️ SESSION #183 PRESERVED: 4/7 minimum real indicator requirement + null returns
   * 🚀 MODULAR PRESERVED: Session #302 MACD + Session #303 Volume integration maintained exactly
   *
   * @param indicators - IndicatorValues containing all 7 technical indicators
   * @returns SignalComposerResult with final score or null for insufficient indicators
   */
  calculateCompositeScore(indicators: IndicatorValues): SignalComposerResult {
    console.log(
      `🧮 [COMPOSITE_SCORE] SESSION #183 + #302 + #303 + #304 ENHANCED: Calculating composite score with real indicators + modular MACD + modular Volume + modular S/R...`
    );

    // 🚨 SESSION #183 PRODUCTION FIX PRESERVED: Count real indicators (non-null values)
    let realIndicatorCount = 0;
    let score = 60; // Base neutral score - PRESERVED EXACTLY

    // RSI scoring (oversold = bullish) - SESSION #183 FIX: Only process if real value exists
    if (indicators.rsi !== null && typeof indicators.rsi === "number") {
      realIndicatorCount++;
      if (indicators.rsi < 30) {
        score += 20; // Strong oversold condition - PRESERVED EXACTLY
      } else if (indicators.rsi > 70) {
        score -= 10; // Overbought condition - PRESERVED EXACTLY
      } else {
        const neutralDistance = Math.abs(indicators.rsi - 50);
        score += (20 - neutralDistance) / 4; // PRESERVED EXACTLY
      }
      console.log(`✅ [COMPOSITE_SCORE] Real RSI processed: ${indicators.rsi}`);
    } else {
      console.log(
        `⚠️ [COMPOSITE_SCORE] RSI null - skipping indicator (no synthetic fallback)`
      );
    }

    // 🔧 SESSION #302 INTEGRATION PRESERVED: MACD scoring with modular calculator result
    // MACD scoring (positive = bullish) - SESSION #183 + #302 FIX: Only process if real value exists from modular calculator
    if (
      indicators.macd !== null &&
      indicators.macd &&
      typeof indicators.macd.macd === "number"
    ) {
      realIndicatorCount++;
      if (indicators.macd.macd > 0) {
        score += 15; // PRESERVED EXACTLY
      } else if (indicators.macd.macd < 0) {
        score -= 5; // PRESERVED EXACTLY
      }
      console.log(
        `✅ [COMPOSITE_SCORE] Real MACD processed: ${indicators.macd.macd} (SESSION #302 modular calculator)`
      );
    } else {
      console.log(
        `⚠️ [COMPOSITE_SCORE] MACD null - skipping indicator (no synthetic fallback, SESSION #302 modular)`
      );
    }

    // Bollinger Bands scoring (near lower band = oversold) - SESSION #183 FIX: Only process if real value exists
    if (
      indicators.bb !== null &&
      indicators.bb &&
      typeof indicators.bb.percentB === "number"
    ) {
      realIndicatorCount++;
      if (indicators.bb.percentB < 0.2) {
        score += 15; // Near lower band - PRESERVED EXACTLY
      } else if (indicators.bb.percentB > 0.8) {
        score -= 10; // Near upper band - PRESERVED EXACTLY
      } else if (
        indicators.bb.percentB >= 0.4 &&
        indicators.bb.percentB <= 0.6
      ) {
        score += 5; // Middle range - PRESERVED EXACTLY
      }
      console.log(
        `✅ [COMPOSITE_SCORE] Real Bollinger processed: ${indicators.bb.percentB}`
      );
    } else {
      console.log(
        `⚠️ [COMPOSITE_SCORE] Bollinger null - skipping indicator (no synthetic fallback)`
      );
    }

    // 🔧 SESSION #303 INTEGRATION PRESERVED: Volume scoring with modular analyzer result
    // Volume scoring (high volume = confirmation) - SESSION #183 + #303 FIX: Only process if real value exists from modular analyzer
    if (
      indicators.volume !== null &&
      indicators.volume &&
      typeof indicators.volume.ratio === "number"
    ) {
      realIndicatorCount++;
      if (indicators.volume.ratio > 1.5) {
        score += 10; // High volume - PRESERVED EXACTLY
      } else if (indicators.volume.ratio < 0.8) {
        score -= 5; // Low volume - PRESERVED EXACTLY
      }
      console.log(
        `✅ [COMPOSITE_SCORE] Real Volume processed: ${indicators.volume.ratio} (SESSION #303 modular analyzer)`
      );
    } else {
      console.log(
        `⚠️ [COMPOSITE_SCORE] Volume null - skipping indicator (no synthetic fallback, SESSION #303 modular)`
      );
    }

    // Stochastic scoring (oversold = bullish) - SESSION #183 FIX: Only process if real value exists
    if (
      indicators.stoch !== null &&
      indicators.stoch &&
      typeof indicators.stoch.percentK === "number"
    ) {
      realIndicatorCount++;
      if (indicators.stoch.percentK < 20) {
        score += 8; // PRESERVED EXACTLY
      } else if (indicators.stoch.percentK > 80) {
        score -= 5; // PRESERVED EXACTLY
      }
      console.log(
        `✅ [COMPOSITE_SCORE] Real Stochastic processed: ${indicators.stoch.percentK}`
      );
    } else {
      console.log(
        `⚠️ [COMPOSITE_SCORE] Stochastic null - skipping indicator (no synthetic fallback)`
      );
    }

    // Williams %R scoring (oversold = bullish) - SESSION #183 FIX: Only process if real value exists
    if (
      indicators.williams !== null &&
      indicators.williams &&
      typeof indicators.williams.value === "number"
    ) {
      realIndicatorCount++;
      if (indicators.williams.value <= -80) {
        score += 7; // PRESERVED EXACTLY
      } else if (indicators.williams.value >= -20) {
        score -= 5; // PRESERVED EXACTLY
      }
      console.log(
        `✅ [COMPOSITE_SCORE] Real Williams %R processed: ${indicators.williams.value}`
      );
    } else {
      console.log(
        `⚠️ [COMPOSITE_SCORE] Williams %R null - skipping indicator (no synthetic fallback)`
      );
    }

    // 🔧 SESSION #304B INTEGRATION PRESERVED: Support/Resistance scoring with modular analyzer result
    // Support/Resistance scoring (proximity to levels = smart entry) - SESSION #183 + #304 FIX: Only process if real value exists from modular analyzer
    if (
      indicators.supportResistance !== null &&
      indicators.supportResistance &&
      typeof indicators.supportResistance.proximity === "number"
    ) {
      realIndicatorCount++;
      if (indicators.supportResistance.proximity >= 80) {
        score += 12; // Very close to support (bullish) - SESSION #304B PRESERVED EXACTLY
      } else if (indicators.supportResistance.proximity <= 20) {
        score -= 8; // Very close to resistance (bearish) - SESSION #304B PRESERVED EXACTLY
      } else if (
        indicators.supportResistance.proximity >= 60 &&
        indicators.supportResistance.proximity < 80
      ) {
        score += 6; // Moderately close to support - SESSION #304B PRESERVED EXACTLY
      } else if (
        indicators.supportResistance.proximity > 20 &&
        indicators.supportResistance.proximity <= 40
      ) {
        score -= 4; // Moderately close to resistance - SESSION #304B PRESERVED EXACTLY
      }
      console.log(
        `✅ [COMPOSITE_SCORE] Real S/R processed: ${indicators.supportResistance.proximity}% proximity, type: ${indicators.supportResistance.type} (SESSION #304 modular analyzer)`
      );
    } else {
      console.log(
        `⚠️ [COMPOSITE_SCORE] Support/Resistance null - skipping indicator (no synthetic fallback, SESSION #304 modular)`
      );
    }

    // 🚨 SESSION #183 + #304B PRODUCTION FIX PRESERVED: Require minimum real indicators for valid signal (updated for 7 indicators)
    if (realIndicatorCount < 4) {
      console.log(
        `❌ [COMPOSITE_SCORE] Insufficient real indicators (${realIndicatorCount}/7) - signal quality too low`
      );
      return {
        finalScore: null,
        realIndicatorCount,
        isValid: false,
        metadata: {
          requiredIndicators: 4,
          actualIndicators: realIndicatorCount,
          sessionIntegration: "SESSION #183 + #302 + #303 + #304B",
          calculationMethod:
            "7-Indicator Composite Scoring with S/R Proximity Analysis",
          preservedSessions: ["#183", "#302", "#303", "#304B"],
        },
      };
    }

    const finalScore = Math.min(100, Math.max(0, Math.round(score)));
    console.log(
      `✅ [COMPOSITE_SCORE] SESSION #183 + #302 + #303 + #304 SUCCESS: Real composite score ${finalScore}% based on ${realIndicatorCount}/7 authentic indicators (modular MACD + modular Volume + modular S/R integrated)`
    );

    return {
      finalScore,
      realIndicatorCount,
      isValid: true,
      metadata: {
        requiredIndicators: 4,
        actualIndicators: realIndicatorCount,
        sessionIntegration: "SESSION #183 + #302 + #303 + #304B",
        calculationMethod:
          "7-Indicator Composite Scoring with S/R Proximity Analysis",
        preservedSessions: ["#183", "#302", "#303", "#304B"],
      },
    };
  }

  /**
   * 🎖️ VALIDATE INDICATORS - SESSION #305D INPUT VALIDATION
   * 🎯 PURPOSE: Validate indicator input structure meets composite scoring requirements
   * 🛡️ PRESERVATION: Maintains Session #183 data quality standards
   * 🔧 SESSION #305C COMPATIBILITY: Follows established modular validation pattern
   *
   * @param indicators - IndicatorValues to validate
   * @returns boolean indicating if indicators are sufficient for scoring
   */
  validateIndicators(indicators: IndicatorValues): boolean {
    if (!indicators || typeof indicators !== "object") {
      return false;
    }

    // Count valid (non-null) indicators
    let validCount = 0;

    if (indicators.rsi !== null) validCount++;
    if (indicators.macd !== null && indicators.macd?.macd !== undefined)
      validCount++;
    if (indicators.bb !== null && indicators.bb?.percentB !== undefined)
      validCount++;
    if (indicators.volume !== null && indicators.volume?.ratio !== undefined)
      validCount++;
    if (indicators.stoch !== null && indicators.stoch?.percentK !== undefined)
      validCount++;
    if (
      indicators.williams !== null &&
      indicators.williams?.value !== undefined
    )
      validCount++;
    if (
      indicators.supportResistance !== null &&
      indicators.supportResistance?.proximity !== undefined
    )
      validCount++;

    // SESSION #304B REQUIREMENT: Minimum 4/7 indicators
    return validCount >= 4;
  }

  /**
   * 📊 GET COMPOSER NAME - SESSION #305D MODULAR IDENTIFICATION
   * 🎯 PURPOSE: Identify this composer module for logging and debugging
   * 🔧 USAGE: Used by orchestrator for module tracking and error reporting
   * 🛡️ SESSION #305C COMPATIBILITY: Follows same naming pattern as TimeframeDataCoordinator
   */
  getName(): string {
    return "SignalComposer";
  }
}

/**
 * 🧮 7-INDICATOR COMPOSITE SCORE HELPER - SESSION #305D UTILITY FUNCTION
 * 🎯 PURPOSE: Provide composite scoring in original Edge Function format for backward compatibility
 * 🔧 BRIDGE FUNCTION: Converts modular SignalComposerResult back to original number | null format
 * 🛡️ ANTI-REGRESSION: Maintains exact return format expected by main processing loop
 * 📊 SESSION #304B PRESERVED: All S/R proximity scoring + 4/7 minimum + modular integration maintained exactly
 */
export function calculate7IndicatorScore(
  rsi: number | null,
  macd: { macd: number } | null,
  bb: { percentB: number } | null,
  volume: { ratio: number } | null,
  stoch: { percentK: number } | null,
  williams: { value: number } | null,
  supportResistance: { proximity: number; type: string } | null
): number | null {
  const composer = new SignalComposer();

  const indicators: IndicatorValues = {
    rsi,
    macd,
    bb,
    volume,
    stoch,
    williams,
    supportResistance,
  };

  const result = composer.calculateCompositeScore(indicators);

  // 🚨 SESSION #183 + #304B PRESERVED: Return null for insufficient indicators
  if (!result.isValid || result.finalScore === null) {
    return null;
  }

  // 🎖️ SESSION #183 + #304B PRESERVED RETURN FORMAT: Exact return value for main processing loop
  // 🔧 CRITICAL FORMAT: Returns number | null exactly as original function
  return result.finalScore;
}

// ==================================================================================
// 🎯 SESSION #305D SIGNAL COMPOSER EXTRACTION COMPLETE
// ==================================================================================
// 📊 FUNCTIONALITY: Complete 7-indicator composite scoring with S/R proximity analysis + Session #183 + #302 + #303 + #304B preservation + modular architecture integration
// 🛡️ PRESERVATION: Session #304B S/R integration + Session #183 null handling + Session #302 MACD modular + Session #303 Volume modular + all scoring calculations + 4/7 minimum requirement + comprehensive logging
// 🔧 EXTRACTION SUCCESS: Moved from monolithic function (lines ~891-1050) to isolated, testable module following Session #305C TimeframeDataCoordinator pattern
// 📈 COMPOSITE SCORING: Maintains exact scoring logic for all 7 indicators through calculate7IndicatorScore helper function for main processing loop compatibility
// 🎖️ ANTI-REGRESSION: All existing signal generation logic preserved exactly - composite scores identical to original function + all Session #302-304B modular integration maintained
// ⚡ MODULAR BENEFITS: Isolated testing + clean interfaces + professional architecture + future AI integration ready + Session #305C pattern compliance
// 🚀 PRODUCTION READY: Session #305D Signal Composer extraction complete - maintains institutional-grade scoring accuracy with modular architecture advantages + Session #305C pattern compliance
// 🔄 NEXT SESSION: Session #305E or commit Session #305D success to GitHub following established pattern
// 🏆 TESTING VALIDATION: Extracted Signal Composer module must produce identical scores (±0.1% tolerance) to original monolithic function for all existing signals + maintain all Session #302-304B functionality
// 🎯 SESSION #305D ACHIEVEMENT: Signal Composer successfully extracted with 100% functionality preservation + Session #302-304B integration + modular architecture foundation enhanced (6/6 major extractions approaching completion)
// ==================================================================================
