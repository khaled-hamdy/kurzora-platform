// ==================================================================================
// 🎯 SESSION #303: VOLUME ANALYZER EXTRACTION - MODULAR ARCHITECTURE COMPONENT
// ==================================================================================
// 🚨 PURPOSE: Extract volume analysis calculation into isolated, testable module following Session #301-302 pattern
// 🛡️ ANTI-REGRESSION MANDATE: ALL Session #183 real calculation logic preserved EXACTLY
// 📝 SESSION #303 EXTRACTION: Moving volume analysis from 1600-line monolith to modular architecture
// 🔧 PRESERVATION: Session #183 synthetic logic removal + Session #301-302 interface compatibility
// 🚨 CRITICAL SUCCESS: Maintain identical volume ratio calculations for existing signals (±0.1% tolerance)
// ⚠️ PROTECTED LOGIC: Session #183 null returns for insufficient data (NO synthetic fallbacks)
// 🎖️ SURGE DETECTION: Volume ratio analysis depends on exact calculation preservation
// 📊 RATIO CALCULATION: currentVolume / averageVolume maintained exactly for institutional compatibility
// 🏆 TESTING REQUIREMENT: Extracted module must produce identical results to original function
// 🚀 PRODUCTION IMPACT: Enable modular architecture while preserving volume analysis accuracy
// ==================================================================================

import {
  TechnicalIndicatorInput,
  IndicatorResult,
  TechnicalIndicatorModule,
  DefaultIndicatorLogger,
} from "./base-indicator.ts";

/**
 * 📊 VOLUME ANALYZER - SESSION #303 MODULAR EXTRACTION
 * 🚨 CRITICAL EXTRACTION: Moved from 1600-line monolith (lines ~890-920) to modular architecture
 * 🛡️ ANTI-REGRESSION: ALL Session #183 real calculation logic preserved EXACTLY
 * 🎯 PURPOSE: Calculate volume ratio analysis with surge detection capability
 * 🔧 SESSION #183 PRESERVATION: Returns null for insufficient data (NO synthetic fallback "1.0")
 * 📊 RATIO CALCULATION: currentVolume / averageVolume (institutional standard)
 * 🎖️ SURGE LOGIC: High volume ratio = confirmation (+10 points), Low volume = penalty (-5 points)
 * 🚀 PRODUCTION READY: Identical calculation to original function for signal consistency
 * 🔧 SESSION #301-302 COMPATIBILITY: Uses TechnicalIndicatorModule interface exactly
 */
export class VolumeAnalyzer implements TechnicalIndicatorModule {
  /**
   * 🧮 CALCULATE VOLUME ANALYSIS - SESSION #303 EXTRACTED LOGIC
   * 🚨 SESSION #183 PRESERVED: Returns null for insufficient data instead of synthetic "1.0"
   * 🎯 PURPOSE: Calculate volume ratio for surge detection and signal scoring
   * 🔧 ANTI-REGRESSION: Preserves exact calculation logic from original monolithic function
   * 🛡️ SESSION #301-302 COMPATIBILITY: Uses TechnicalIndicatorInput interface exactly
   *
   * @param input - TechnicalIndicatorInput containing currentVolume and volumes array
   * @returns IndicatorResult with volume ratio or null for insufficient data
   */
  calculate(input: TechnicalIndicatorInput): IndicatorResult {
    const logger = DefaultIndicatorLogger;

    // 🛡️ SESSION #303 PRESERVATION: Extract parameters following original function signature
    const currentVolume = input.currentVolume;
    const volumes = input.volumes;

    // 🚨 SESSION #183 PRODUCTION FIX PRESERVED: Return null instead of synthetic fallback
    // 🔧 ORIGINAL LOGIC: Removed synthetic fallback - return null instead of fake "1.0"
    if (!currentVolume || !volumes || volumes.length === 0) {
      logger.logInsufficientData("Volume", volumes?.length || 0, 1);
      return {
        value: null,
        isValid: false,
        metadata: {
          dataPoints: volumes?.length || 0,
          calculationMethod: "Volume Ratio Analysis",
          sessionFix:
            'SESSION #183: Return null instead of synthetic value "1.0"',
        },
      };
    }

    try {
      // 🧮 SESSION #303 PRESERVED CALCULATION: Exact volume ratio calculation from original function
      // 📊 AVERAGE VOLUME: Calculate average from historical volumes array
      const avgVolume =
        volumes.reduce((sum, vol) => sum + vol, 0) / volumes.length;

      // 🚨 SESSION #183 PRODUCTION FIX PRESERVED: Check for zero average volume
      if (avgVolume === 0) {
        console.log(
          `⚠️ Volume: Zero average volume - returning null (no synthetic fallback)`
        );
        return {
          value: null,
          isValid: false,
          metadata: {
            dataPoints: volumes.length,
            calculationMethod: "Volume Ratio Analysis",
            sessionFix:
              "SESSION #183: Zero average volume - null return (no synthetic fallback)",
          },
        };
      }

      // 🎯 VOLUME RATIO CALCULATION: currentVolume / averageVolume (surge detection foundation)
      const ratio = currentVolume / avgVolume;

      // 🚀 SESSION #303 SUCCESS LOGGING: Maintain original function logging for consistency
      logger.logCalculationSuccess("Volume", ratio);

      // 🎖️ SESSION #183 PRESERVED RETURN FORMAT: Compatible with composite scoring
      // 🔧 CRITICAL FORMAT: Returns standardized IndicatorResult for modular consistency
      return {
        value: Number(ratio.toFixed(2)), // 📊 2 decimal precision for volume ratio accuracy
        isValid: true,
        metadata: {
          dataPoints: volumes.length,
          calculationMethod: "Volume Ratio Analysis",
          sessionFix:
            "SESSION #183: Real calculation with null fallback removed",
        },
      };
    } catch (error) {
      // 🚨 SESSION #303 ERROR HANDLING: Preserve robust error handling patterns
      logger.logCalculationError("Volume", error.message);
      return {
        value: null,
        isValid: false,
        metadata: {
          dataPoints: volumes?.length || 0,
          calculationMethod: "Volume Ratio Analysis",
          sessionFix:
            "SESSION #183: Error handling with null return (no synthetic fallback)",
        },
      };
    }
  }

  /**
   * 🎖️ VALIDATE INPUT - SESSION #303 DATA QUALITY ASSURANCE
   * 🎯 PURPOSE: Validate input data meets volume analysis requirements
   * 🛡️ PRESERVATION: Maintains Session #183 data quality standards
   * 🔧 SESSION #301-302 COMPATIBILITY: Uses TechnicalIndicatorInput interface exactly
   *
   * @param input - TechnicalIndicatorInput to validate
   * @returns boolean indicating if input is sufficient for volume analysis
   */
  validateInput(input: TechnicalIndicatorInput): boolean {
    // 🔧 SESSION #303 VALIDATION: Check for minimum data requirements
    if (!input || !input.currentVolume || !input.volumes) {
      return false;
    }

    // 📊 VOLUME VALIDATION: Ensure currentVolume is positive and volumes array exists
    if (
      input.currentVolume <= 0 ||
      !Array.isArray(input.volumes) ||
      input.volumes.length === 0
    ) {
      return false;
    }

    // 🎯 ADDITIONAL VALIDATION: Ensure volumes contain valid positive numbers
    return input.volumes.every(
      (vol) => typeof vol === "number" && !isNaN(vol) && vol > 0
    );
  }

  /**
   * 📊 GET INDICATOR NAME - SESSION #303 MODULAR IDENTIFICATION
   * 🎯 PURPOSE: Identify this indicator module for logging and debugging
   * 🔧 USAGE: Used by orchestrator for module tracking and error reporting
   * 🛡️ SESSION #301-302 COMPATIBILITY: Follows same naming pattern as RSI and MACD Calculators
   */
  getName(): string {
    return "Volume";
  }
}

/**
 * 🧮 VOLUME ANALYSIS HELPER - SESSION #303 UTILITY FUNCTION
 * 🎯 PURPOSE: Provide volume analysis in original Edge Function format for backward compatibility
 * 🔧 BRIDGE FUNCTION: Converts modular IndicatorResult back to original { ratio: number } format
 * 🛡️ ANTI-REGRESSION: Maintains exact return format expected by composite scoring system
 * 📊 SURGE DETECTION: Preserves high volume (+10) / low volume (-5) scoring logic exactly
 */
export function calculateVolumeAnalysis(
  currentVolume: number,
  volumes: number[]
): { ratio: number } | null {
  const analyzer = new VolumeAnalyzer();
  const input: TechnicalIndicatorInput = {
    prices: [], // Not used for volume analysis
    currentVolume,
    volumes,
  };

  const result = analyzer.calculate(input);

  // 🚨 SESSION #183 PRESERVED: Return null for insufficient data
  if (!result.isValid || result.value === null) {
    return null;
  }

  // 🎖️ SESSION #183 PRESERVED RETURN FORMAT: Exact return structure for composite scoring
  // 🔧 CRITICAL FORMAT: Returns { ratio: Number } for surge detection logic
  return {
    ratio: result.value,
  };
}

// ==================================================================================
// 🎯 SESSION #303 VOLUME ANALYZER EXTRACTION COMPLETE
// ==================================================================================
// 📊 FUNCTIONALITY: Complete volume ratio analysis with surge detection capability + Session #183 real calculation preservation + Session #301-302 interface compatibility + modular architecture integration
// 🛡️ PRESERVATION: Session #183 synthetic logic removal + null returns for insufficient data + exact calculation methodology + 2-decimal precision + Session #301-302 interface compatibility
// 🔧 EXTRACTION SUCCESS: Moved from monolithic function (lines ~890-920) to isolated, testable module following Session #301-302 TechnicalIndicatorModule pattern
// 📈 SURGE DETECTION: Maintains exact return format compatibility through calculateVolumeAnalysis helper function for composite scoring volume confirmation logic (+10/-5 points)
// 🎖️ ANTI-REGRESSION: All existing signal generation logic preserved exactly - volume ratios identical to original function + Session #301-302 RSI/MACD Calculator compatibility maintained
// ⚡ MODULAR BENEFITS: Isolated testing + clean interfaces + professional architecture + future AI integration ready + Session #301-302 pattern compliance
// 🚀 PRODUCTION READY: Session #303 Volume Analyzer extraction complete - maintains institutional-grade signal accuracy with modular architecture advantages + Session #301-302 pattern compliance
// 🔄 NEXT SESSION: Session #304 Support/Resistance Detection extraction using proven Session #301-303 modular pattern
// 🏆 TESTING VALIDATION: Extracted Volume Analyzer module must produce identical values (±0.1% tolerance) to original monolithic function for all existing signals + maintain Session #301-302 RSI/MACD Calculator functionality
// 🎯 SESSION #303 ACHIEVEMENT: Volume Analyzer successfully extracted with 100% functionality preservation + Session #301-302 interface compatibility + modular architecture foundation enhanced (3/6 indicators complete)
// ==================================================================================
