// ==================================================================================
// 🎯 SESSION #301: RSI CALCULATOR MODULE - EXTRACTED FROM ORIGINAL EDGE FUNCTION
// ==================================================================================
// 🚨 PURPOSE: Extract RSI calculation logic into modular component (Session #301 Phase 1)
// 🛡️ ANTI-REGRESSION: EXACT preservation of Session #183 real-data-only RSI logic
// 📝 SESSION #301 EXTRACTION: Moved from lines 451-480 of original Edge Function
// 🔧 ORIGINAL FUNCTION PROTECTION: Original index.ts remains UNTOUCHED during extraction
// ✅ PRODUCTION READY: Identical RSI behavior with modular architecture benefits
// 📊 SESSION #183 COMPLIANCE: Returns null for insufficient data (no synthetic fallbacks)
// ==================================================================================

import {
  TechnicalIndicatorModule,
  TechnicalIndicatorInput,
  IndicatorResult,
  DefaultIndicatorLogger,
} from "./base-indicator.ts";

/**
 * 🎯 RSI CALCULATOR MODULE
 * PURPOSE: Exact extraction of RSI calculation from original Edge Function
 * SESSION #301: First modular component extraction - proves modular approach works
 * SESSION #183 PRESERVATION: All real-data-only logic preserved exactly
 * ANTI-REGRESSION: Identical input/output behavior to original calculateRSI function
 */
export class RSICalculator implements TechnicalIndicatorModule {
  private readonly defaultPeriod = 14;

  /**
   * 🎯 RSI CALCULATION - SESSION #183 REAL INDICATOR LOGIC PRESERVED EXACTLY
   * EXTRACTED FROM: Original Edge Function lines 451-480
   * SESSION #183 FIX: Returns null for insufficient data (no synthetic "50" fallback)
   * ANTI-REGRESSION: Identical algorithm, validation, and output as original function
   */
  calculate(input: TechnicalIndicatorInput): IndicatorResult {
    const prices = input.prices;
    const period = input.period || this.defaultPeriod;

    // 🚨 SESSION #183 PRODUCTION FIX: Exact validation logic from original function
    // PRESERVED: Same validation as original - prices.length < period + 1
    if (!prices || prices.length < period + 1) {
      DefaultIndicatorLogger.logInsufficientData(
        "RSI",
        prices?.length || 0,
        period + 1
      );
      return {
        value: null,
        isValid: false,
        metadata: {
          period: period,
          dataPoints: prices?.length || 0,
          calculationMethod: "session-183-real-data-only",
          sessionFix:
            "SESSION #183: Returns null for insufficient data (no synthetic fallback)",
        },
      };
    }

    // 🎯 EXACT RSI ALGORITHM FROM ORIGINAL FUNCTION
    // PRESERVED: Identical price change calculation logic
    const changes = [];
    for (let i = 1; i < prices.length; i++) {
      changes.push(prices[i] - prices[i - 1]);
    }

    // 🚨 SESSION #183 PRODUCTION FIX: Exact validation from original function
    // PRESERVED: Same change validation - changes.length < period
    if (changes.length < period) {
      console.log(
        `⚠️ RSI: Insufficient change data (${changes.length} changes, need ${period}) - returning null (no synthetic fallback)`
      );
      return {
        value: null,
        isValid: false,
        metadata: {
          period: period,
          dataPoints: changes.length,
          calculationMethod: "session-183-real-data-only",
          sessionFix: "SESSION #183: Returns null for insufficient change data",
        },
      };
    }

    // 🎯 EXACT GAIN/LOSS CALCULATION FROM ORIGINAL FUNCTION
    // PRESERVED: Identical average gain/loss algorithm
    let avgGain = 0,
      avgLoss = 0;
    for (let i = 0; i < period; i++) {
      if (changes[i] > 0) {
        avgGain += changes[i];
      } else {
        avgLoss += Math.abs(changes[i]);
      }
    }

    avgGain = avgGain / period;
    avgLoss = avgLoss / period;

    // 🎯 EXACT RSI CALCULATION FROM ORIGINAL FUNCTION
    // PRESERVED: Identical edge case handling and RS calculation
    if (avgLoss === 0) {
      const edgeCaseResult = avgGain > 0 ? 100 : 50;
      DefaultIndicatorLogger.logCalculationSuccess("RSI", edgeCaseResult);
      return {
        value: edgeCaseResult,
        isValid: true,
        metadata: {
          period: period,
          dataPoints: prices.length,
          calculationMethod: "session-183-real-data-edge-case",
          sessionFix: "SESSION #183: Edge case - zero average loss",
        },
      };
    }

    // 🎯 FINAL RSI CALCULATION - EXACT ALGORITHM FROM ORIGINAL FUNCTION
    // PRESERVED: Identical RS ratio and RSI formula
    const rs = avgGain / avgLoss;
    const rsi = 100 - 100 / (1 + rs);

    // 🎯 EXACT OUTPUT FORMAT FROM ORIGINAL FUNCTION
    // PRESERVED: Same rounding logic - Math.round(rsi * 100) / 100
    const finalRSI = Math.round(rsi * 100) / 100;

    DefaultIndicatorLogger.logCalculationSuccess("RSI", finalRSI);

    return {
      value: finalRSI,
      isValid: true,
      metadata: {
        period: period,
        dataPoints: prices.length,
        calculationMethod: "session-183-real-rsi-calculation",
        sessionFix:
          "SESSION #183: Real RSI calculation with authentic market data",
      },
    };
  }

  /**
   * 🎯 INPUT VALIDATION - SESSION #301 MODULAR ENHANCEMENT
   * PURPOSE: Pre-validate input before calculation attempt
   * ANTI-REGRESSION: Uses same validation logic as original function
   */
  validateInput(input: TechnicalIndicatorInput): boolean {
    const prices = input.prices;
    const period = input.period || this.defaultPeriod;

    // Same validation logic as original function
    return prices && Array.isArray(prices) && prices.length >= period + 1;
  }

  /**
   * 🎯 MODULE IDENTIFICATION
   * PURPOSE: Support logging and debugging in modular system
   * SESSION #301: Standard interface implementation
   */
  getName(): string {
    return "RSI";
  }

  /**
   * 🎯 LEGACY FUNCTION COMPATIBILITY
   * PURPOSE: Provide exact same function signature as original Edge Function
   * SESSION #301: Enables drop-in replacement during integration testing
   * ANTI-REGRESSION: Identical behavior to original calculateRSI(prices, period = 14)
   */
  static calculateRSI(prices: number[], period: number = 14): number | null {
    const calculator = new RSICalculator();
    const result = calculator.calculate({ prices, period });
    return result.value;
  }
}

/**
 * 🎯 DIRECT EXPORT FOR LEGACY COMPATIBILITY
 * PURPOSE: Maintain exact same function call pattern as original Edge Function
 * SESSION #301: Enables seamless integration without changing calling code
 * ANTI-REGRESSION: Drop-in replacement for original calculateRSI function
 */
export function calculateRSI(
  prices: number[],
  period: number = 14
): number | null {
  return RSICalculator.calculateRSI(prices, period);
}

// ==================================================================================
// 🎯 SESSION #301 RSI CALCULATOR EXTRACTION COMPLETE
// ==================================================================================
// 📊 FUNCTIONALITY: Exact RSI calculation extracted from original Edge Function
// 🛡️ PRESERVATION: All Session #183 real-data-only logic preserved exactly
// 🔧 MODULAR ARCHITECTURE: Clean separation with identical behavior to original
// 📈 PRODUCTION READY: Drop-in replacement with enhanced modular benefits
// 🎖️ ANTI-REGRESSION: Original Edge Function remains untouched - zero risk extraction
// 🚀 TESTING READY: Legacy function available for validation against original
// 📋 SESSION #302 PREPARATION: Template established for MACD Calculator extraction
// ==================================================================================
// 🧪 VALIDATION COMMANDS:
// const original = originalEdgeFunction.calculateRSI([100, 105, 103, 108], 14);
// const extracted = calculateRSI([100, 105, 103, 108], 14);
// console.log('Identical:', original === extracted); // Should be true
// ==================================================================================
