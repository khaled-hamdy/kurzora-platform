// ==================================================================================
// 🎯 SESSION #301-302: BASE INDICATOR INTERFACE - MODULAR FOUNDATION ENHANCED
// ==================================================================================
// 🚨 PURPOSE: Provide type-safe foundation for all technical indicator modules
// 🛡️ ANTI-REGRESSION: Created for Session #301 RSI extraction - supports future indicator modules
// 📝 SESSION #301 EXTRACTION: Base interface for RSI Calculator and all future indicator extractions
// 🔧 SESSION #302 ENHANCEMENT: Added MACD parameters while preserving ALL Session #301 functionality
// 🎖️ COMPATIBILITY: Session #301 RSI Calculator works unchanged with Session #302 enhancements
// ✅ PRODUCTION READY: Type-safe interface supporting all Session #183 real-indicator logic
// ==================================================================================

/**
 * 🎯 BASE INDICATOR INTERFACE - SESSION #301-302 ENHANCED
 * PURPOSE: Standardize technical indicator module structure for modular architecture
 * SESSION #301: Created for RSI Calculator extraction - foundation for all indicators
 * SESSION #302: Enhanced with MACD parameters while preserving RSI compatibility
 * ANTI-REGRESSION: Supports all Session #183 real-data-only logic patterns
 */
export interface TechnicalIndicatorInput {
  prices: number[];
  highs?: number[];
  lows?: number[];
  volumes?: number[];
  currentVolume?: number;

  // 🔧 SESSION #326 DEBUG PARAMETERS
  ticker?: string; // Stock ticker for debugging output
  timeframe?: string; // Timeframe for debugging output

  // 🔧 SESSION #301 RSI PARAMETERS (PRESERVED EXACTLY)
  period?: number; // RSI period (default: 14) - Session #301 foundation

  // 🔧 SESSION #302 MACD PARAMETERS (ADDED)
  shortPeriod?: number; // MACD short MA period (default: 12) - Session #302 addition
  longPeriod?: number; // MACD long MA period (default: 26) - Session #302 addition
}

/**
 * 🎯 INDICATOR RESULT INTERFACE - SESSION #301 PRESERVED
 * PURPOSE: Standardize indicator output format across all modules
 * SESSION #301: Foundation for RSI and all future indicator extractions
 * SESSION #183 COMPLIANCE: Supports null returns for insufficient real data
 * SESSION #302: Interface preserved exactly - no changes needed for MACD
 */
export interface IndicatorResult {
  value: number | null;
  isValid: boolean;
  metadata?: {
    period?: number;
    dataPoints?: number;
    calculationMethod?: string;
    sessionFix?: string;
    // 🔧 SESSION #302: MACD metadata can be added to existing structure
    macdComponents?: {
      shortMA?: number;
      longMA?: number;
      signal?: number;
    };
  };
}

/**
 * 🎯 TECHNICAL INDICATOR MODULE INTERFACE - SESSION #301 PRESERVED
 * PURPOSE: Define standard contract for all technical indicator modules
 * SESSION #301: Created for RSI Calculator - template for Session #302-304 extractions
 * SESSION #302: Interface preserved exactly - MACD Calculator uses same contract
 * MODULAR FOUNDATION: Enables clean separation of indicator logic
 */
export interface TechnicalIndicatorModule {
  /**
   * Calculate indicator value with Session #183 real-data-only compliance
   * SESSION #301: RSI Calculator implementation working
   * SESSION #302: MACD Calculator will use same interface
   * @param input - Validated market data input
   * @returns IndicatorResult with value or null for insufficient data
   */
  calculate(input: TechnicalIndicatorInput): IndicatorResult;

  /**
   * Validate input data meets minimum requirements for calculation
   * SESSION #301: RSI validation working
   * SESSION #302: MACD validation will use same pattern
   * @param input - Market data to validate
   * @returns boolean indicating if calculation is possible
   */
  validateInput(input: TechnicalIndicatorInput): boolean;

  /**
   * Get indicator name for logging and identification
   * SESSION #301: RSI Calculator working
   * SESSION #302: MACD Calculator will use same pattern
   * @returns string name of the indicator
   */
  getName(): string;
}

/**
 * 🎯 SESSION #301 EXTRACTION LOGGING INTERFACE - PRESERVED EXACTLY
 * PURPOSE: Standardize logging patterns across extracted indicator modules
 * ANTI-REGRESSION: Preserves comprehensive logging from original Edge Function
 * SESSION #302: MACD Calculator will use same logging patterns
 * PRODUCTION READY: Maintains debugging capabilities for future sessions
 */
export interface IndicatorLogger {
  logInsufficientData(
    indicatorName: string,
    dataLength: number,
    required: number
  ): void;
  logCalculationSuccess(indicatorName: string, value: number): void;
  logCalculationError(indicatorName: string, error: string): void;
}

/**
 * 🎯 DEFAULT LOGGER IMPLEMENTATION - SESSION #301 PRESERVED EXACTLY
 * PURPOSE: Preserve exact logging patterns from original Edge Function
 * SESSION #301: Maintains Session #183 logging compliance for RSI extraction
 * SESSION #302: MACD Calculator will use identical logging patterns
 * ANTI-REGRESSION: Identical console.log patterns as original function
 */
export const DefaultIndicatorLogger: IndicatorLogger = {
  logInsufficientData: (
    indicatorName: string,
    dataLength: number,
    required: number
  ): void => {
    console.log(
      `⚠️ ${indicatorName}: Insufficient data (${dataLength} prices, need ${required}) - returning null (no synthetic fallback)`
    );
  },

  logCalculationSuccess: (indicatorName: string, value: number): void => {
    console.log(
      `✅ ${indicatorName}: Real calculation successful - ${value.toFixed(
        2
      )} (authentic market data)`
    );
  },

  logCalculationError: (indicatorName: string, error: string): void => {
    console.log(
      `❌ ${indicatorName}: Calculation error - ${error} (no synthetic fallback)`
    );
  },
};

// ==================================================================================
// 🎯 SESSION #301-302 BASE INDICATOR INTERFACE ENHANCEMENT COMPLETE
// ==================================================================================
// 📊 FUNCTIONALITY: Type-safe foundation for all technical indicator modules + MACD parameter support
// 🛡️ PRESERVATION: All Session #301 RSI Calculator functionality preserved exactly
// 🔧 SESSION #302 ENHANCEMENT: Added shortPeriod and longPeriod parameters for MACD Calculator
// 📈 BACKWARD COMPATIBILITY: Session #301 RSI Calculator works unchanged with enhanced interface
// 🚀 FORWARD COMPATIBILITY: Ready for Session #303-304 Volume and Support/Resistance extractions
// 🎖️ ANTI-REGRESSION: Enhanced existing interface without breaking changes
// 🏆 MODULAR PROGRESS: Foundation supports Session #301 RSI + Session #302 MACD + future extractions
// ==================================================================================
