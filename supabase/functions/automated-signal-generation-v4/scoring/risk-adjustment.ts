// ==================================================================================
// 🎯 SESSION #306C: RISK ADJUSTMENT CALCULATOR EXTRACTION - MODULAR ARCHITECTURE COMPONENT
// ==================================================================================
// 🚨 PURPOSE: Extract risk adjustment calculation into isolated, testable module following Session #305D pattern
// 🛡️ ANTI-REGRESSION MANDATE: ALL Session #157 crash-resistant risk analysis preserved EXACTLY
// 📝 SESSION #306C EXTRACTION: Moving calculateRiskAdjustment from 1600-line monolith to modular architecture
// 🔧 PRESERVATION: Session #157 crash-resistant methodology + volatility analysis + volume confirmation
// 🚨 CRITICAL SUCCESS: Maintain identical risk adjustment calculations for existing signals (±0.1% tolerance)
// ⚠️ PROTECTED LOGIC: Session #157 volatility analysis + volume confirmation bonuses + price array processing
// 🎖️ RISK SCORING: Volatility-based risk analysis with volume confirmation and crash-resistant error handling
// 📊 MODULAR INTEGRATION: Session #305D compatibility maintained exactly
// 🏆 TESTING REQUIREMENT: Extracted module must produce identical risk scores to original function
// 🚀 PRODUCTION IMPACT: Enable modular architecture while preserving risk calculation accuracy
// ==================================================================================

/**
 * 🛡️ RISK INPUT INTERFACE - SESSION #306C RISK CALCULATION STRUCTURE
 * 🎯 PURPOSE: Define structure for risk adjustment calculation input
 * 🔧 SESSION #157 COMPLIANCE: Supports price arrays for volatility analysis and volume data
 * 🛡️ VOLATILITY ANALYSIS: Price array for return calculations and variance analysis
 * 📊 PRODUCTION READY: Type-safe input structure for risk calculations
 */
export interface RiskInput {
  prices: number[];
  currentVolume: number;
  avgVolume: number;
  validationRequired?: boolean;
}

/**
 * 🎯 RISK ADJUSTMENT RESULT INTERFACE - SESSION #306C OUTPUT STRUCTURE
 * 🚨 PURPOSE: Standardized result format for risk adjustment calculation
 * 🔧 SESSION #157 COMPLIANCE: Includes detailed breakdown for debugging and validation
 * 📊 CRASH-RESISTANT: Comprehensive information for error recovery and analysis
 */
export interface RiskResult {
  riskAdjustment: number;
  volatilityAnalysis: {
    volatility: number;
    normalizedVolatility: number;
    volatilityScore: number;
    validReturns: number;
  };
  volumeConfirmation: {
    volumeRatio: number;
    volumeBonus: number;
    isVolumeValid: boolean;
  };
  isValid: boolean;
  metadata: {
    pricesProcessed: number;
    returnsCalculated: number;
    calculationMethod: string;
    preservedSessions: string[];
    errorRecovery?: string;
  };
}

/**
 * 🛡️ RISK ADJUSTMENT CALCULATOR - SESSION #306C MODULAR EXTRACTION
 * 🚨 CRITICAL EXTRACTION: Moved from 1600-line monolith (lines ~1050-1100) to modular architecture
 * 🛡️ ANTI-REGRESSION: ALL Session #157 crash-resistant methodology preserved EXACTLY
 * 🎯 PURPOSE: Calculate risk adjustment using volatility analysis and volume confirmation with comprehensive error handling
 * 🔧 SESSION #157 PRESERVATION: Crash-resistant logic + volatility calculations + volume bonuses + price processing
 * 🚀 PRODUCTION READY: Identical risk calculations to original monolithic function
 * 🔧 SESSION #305D COMPATIBILITY: Follows ConfidenceCalculator and MomentumQualityCalculator patterns exactly
 */
export class RiskAdjustmentCalculator {
  /**
   * 🛡️ CALCULATE RISK ADJUSTMENT - SESSION #306C EXTRACTED CORE LOGIC
   * 🚨 SESSION #157 PRESERVED: All crash-resistant logic moved exactly from original function
   * 🛡️ ANTI-REGRESSION: Zero modifications to risk logic, volatility analysis, or volume calculations
   * 🔧 PURPOSE: Generate risk adjustment from price volatility and volume confirmation
   * 📊 SESSION #157 PRESERVED: Price processing + volatility calculation + volume bonuses + error handling
   * 🎖️ CRASH-RESISTANT: All defensive programming patterns maintained exactly
   * 🚀 PRODUCTION PRESERVED: Identical risk calculations to original monolithic function
   *
   * @param input - RiskInput containing prices array and volume data
   * @returns RiskResult with risk adjustment score and detailed breakdown
   */
  calculateRiskAdjustment(input: RiskInput): RiskResult {
    console.log(
      `🛡️ [RISK_CALC] CRASH-RESISTANT Risk Adjustment: Input validation starting...`
    );

    // 🚨 SESSION #157 PRESERVED: Base risk score exactly as original
    let riskScore = 70; // Base risk score - preserved exactly

    // Initialize result structure
    const result: RiskResult = {
      riskAdjustment: riskScore,
      volatilityAnalysis: {
        volatility: 0,
        normalizedVolatility: 0,
        volatilityScore: 0,
        validReturns: 0,
      },
      volumeConfirmation: {
        volumeRatio: 0,
        volumeBonus: 0,
        isVolumeValid: false,
      },
      isValid: true,
      metadata: {
        pricesProcessed: 0,
        returnsCalculated: 0,
        calculationMethod: "SESSION #157 volatility_volume_analysis",
        preservedSessions: ["#157"],
      },
    };

    // 🚨 SESSION #157 PRESERVED: Volatility analysis (preserved exactly)
    if (
      input.prices &&
      Array.isArray(input.prices) &&
      input.prices.length > 5
    ) {
      try {
        // 🚨 SESSION #157 PRESERVED: Filter valid prices exactly as original
        const validPrices = input.prices.filter(
          (price) => typeof price === "number" && !isNaN(price) && price > 0
        );

        console.log(
          `📊 [RISK_CALC] Filtered to ${validPrices.length} valid prices from ${input.prices.length} total`
        );
        result.metadata.pricesProcessed = validPrices.length;

        if (validPrices.length > 2) {
          // 🚨 SESSION #157 PRESERVED: Returns calculation exactly as original
          const returns = [];
          for (let i = 1; i < validPrices.length; i++) {
            const returnValue =
              (validPrices[i] - validPrices[i - 1]) / validPrices[i - 1];
            if (typeof returnValue === "number" && !isNaN(returnValue)) {
              returns.push(returnValue);
            }
          }

          result.metadata.returnsCalculated = returns.length;

          if (returns.length > 1) {
            // 🚨 SESSION #157 PRESERVED: Volatility calculation exactly as original
            const avgReturn =
              returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
            const variance =
              returns.reduce(
                (sum, ret) => sum + Math.pow(ret - avgReturn, 2),
                0
              ) / returns.length;
            const volatility = Math.sqrt(variance);

            // 🚨 SESSION #157 PRESERVED: Normalized volatility calculation exactly as original
            const normalizedVolatility = Math.min(volatility * 1000, 100);
            const volatilityScore = 100 - normalizedVolatility;

            // 🚨 SESSION #157 PRESERVED: Risk score adjustment exactly as original
            riskScore = (riskScore + volatilityScore) / 2;

            // Update volatility analysis results
            result.volatilityAnalysis = {
              volatility: Number((volatility * 100).toFixed(2)),
              normalizedVolatility: Number(normalizedVolatility.toFixed(2)),
              volatilityScore: Number(volatilityScore.toFixed(1)),
              validReturns: returns.length,
            };

            console.log(
              `📊 [RISK_CALC] Volatility ${(volatility * 100).toFixed(
                2
              )}% → Risk Score ${volatilityScore.toFixed(1)}`
            );
          }
        }
      } catch (volatilityError) {
        console.log(
          `❌ [RISK_CALC] Volatility calculation error: ${volatilityError.message}, using base score`
        );
        result.metadata.errorRecovery = "volatility_calculation_error";
      }
    }

    // 🚨 SESSION #157 PRESERVED: Volume confirmation (preserved exactly)
    if (
      typeof input.currentVolume === "number" &&
      !isNaN(input.currentVolume) &&
      input.currentVolume > 0 &&
      typeof input.avgVolume === "number" &&
      !isNaN(input.avgVolume) &&
      input.avgVolume > 0
    ) {
      try {
        // 🚨 SESSION #157 PRESERVED: Volume ratio calculation exactly as original
        const volumeRatio = input.currentVolume / input.avgVolume;

        if (typeof volumeRatio === "number" && !isNaN(volumeRatio)) {
          // 🚨 SESSION #157 PRESERVED: Volume bonus calculation exactly as original
          const volumeBonus = Math.min(volumeRatio * 5, 15);
          riskScore += volumeBonus;

          // Update volume confirmation results
          result.volumeConfirmation = {
            volumeRatio: Number(volumeRatio.toFixed(2)),
            volumeBonus: Number(volumeBonus.toFixed(1)),
            isVolumeValid: true,
          };

          console.log(
            `📈 [RISK_CALC] Volume ratio ${volumeRatio.toFixed(
              2
            )}x → Bonus ${volumeBonus.toFixed(1)} points`
          );
        }
      } catch (volumeError) {
        console.log(
          `❌ [RISK_CALC] Volume calculation error: ${volumeError.message}`
        );
        result.metadata.errorRecovery = result.metadata.errorRecovery
          ? `${result.metadata.errorRecovery}, volume_calculation_error`
          : "volume_calculation_error";
      }
    }

    // 🚨 SESSION #157 PRESERVED: Final risk score clamping exactly as original
    const finalRisk = Math.min(100, Math.max(0, Math.round(riskScore)));
    result.riskAdjustment = finalRisk;

    console.log(
      `🛡️ [RISK_CALC] CRASH-RESISTANT Risk Adjustment: ${finalRisk}% (higher = lower risk)`
    );

    return result;
  }

  /**
   * 🎖️ VALIDATE RISK INPUT - SESSION #306C INPUT VALIDATION
   * 🎯 PURPOSE: Validate risk input meets calculation requirements
   * 🛡️ PRESERVATION: Maintains Session #157 validation standards
   * 🔧 SESSION #305D COMPATIBILITY: Follows established modular validation pattern
   *
   * @param input - RiskInput to validate
   * @returns boolean indicating if input is sufficient for risk calculation
   */
  validateInput(input: RiskInput): boolean {
    if (!input) {
      return false;
    }

    // Basic validation - at least one component should be available
    const hasPrices =
      input.prices && Array.isArray(input.prices) && input.prices.length > 2;
    const hasVolumeData =
      typeof input.currentVolume === "number" &&
      typeof input.avgVolume === "number" &&
      input.avgVolume > 0;

    return hasPrices || hasVolumeData;
  }

  /**
   * 📊 GET CALCULATOR NAME - SESSION #306C MODULAR IDENTIFICATION
   * 🎯 PURPOSE: Identify this calculator module for logging and debugging
   * 🔧 USAGE: Used by orchestrator for module tracking and error reporting
   * 🛡️ SESSION #305D COMPATIBILITY: Follows same naming pattern as other modular components
   */
  getName(): string {
    return "RiskAdjustmentCalculator";
  }
}

/**
 * 🛡️ CALCULATE RISK ADJUSTMENT HELPER - SESSION #306C UTILITY FUNCTION
 * 🎯 PURPOSE: Provide risk calculation in original Edge Function format for backward compatibility
 * 🔧 BRIDGE FUNCTION: Converts modular RiskResult back to original number format
 * 🛡️ ANTI-REGRESSION: Maintains exact return format expected by main processing loop
 * 📊 SESSION #157 PRESERVED: All crash-resistant logic + volatility analysis + volume confirmation maintained exactly
 */
export function calculateRiskAdjustment(
  prices: number[],
  currentVolume: number,
  avgVolume: number
): number {
  const calculator = new RiskAdjustmentCalculator();

  const input: RiskInput = {
    prices: prices,
    currentVolume: currentVolume,
    avgVolume: avgVolume,
    validationRequired: true,
  };

  const result = calculator.calculateRiskAdjustment(input);

  // 🚨 SESSION #157 PRESERVED RETURN FORMAT: Exact return value for main processing loop
  // 🔧 CRITICAL FORMAT: Returns number exactly as original function
  return result.riskAdjustment;
}

// ==================================================================================
// 🎯 SESSION #306C RISK ADJUSTMENT CALCULATOR EXTRACTION COMPLETE
// ==================================================================================
// 📊 FUNCTIONALITY: Complete risk adjustment calculation with Session #157 crash-resistant methodology preserved + modular architecture integration
// 🛡️ PRESERVATION: Session #157 crash-resistant logic + volatility analysis + volume confirmation + price array processing + all calculation methods
// 🔧 EXTRACTION SUCCESS: Moved from monolithic function (lines ~1050-1100) to isolated, testable module following Session #305D pattern
// 📈 RISK CALCULATION: Maintains exact volatility and volume analysis through calculateRiskAdjustment helper function for main processing loop compatibility
// 🎖️ ANTI-REGRESSION: All existing risk adjustment logic preserved exactly - risk scores identical to original function + all Session #157 crash-resistant methodology maintained
// ⚡ MODULAR BENEFITS: Isolated testing + clean interfaces + professional architecture + future AI integration ready + Session #305D pattern compliance
// 🚀 PRODUCTION READY: Session #306C Risk Adjustment Calculator extraction complete - maintains crash-resistant risk accuracy with modular architecture advantages + Session #305D pattern compliance
// 🔄 NEXT MODULE: Session #306D Kurzora Smart Score Calculator extraction following established pattern
// 🏆 TESTING VALIDATION: Extracted Risk Adjustment Calculator module must produce identical risk scores (±0.1% tolerance) to original monolithic function for all existing signals + maintain all Session #157 functionality
// 🎯 SESSION #306C ACHIEVEMENT: Risk Adjustment Calculator successfully extracted with 100% functionality preservation + Session #157 methodology + modular architecture foundation enhanced (3/4 scoring modules complete)
// ==================================================================================
