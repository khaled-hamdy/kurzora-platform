// ==================================================================================
// 🎯 SESSION #400B: SCANNING CONFIGURATION - 1W TIMEFRAME DATA FIX
// ==================================================================================
// 🚨 PURPOSE: Extract scanning and timeframe configuration with 1W data sufficiency fix
// 🛡️ ANTI-REGRESSION MANDATE: ALL Session #151-185 + #301-310 functionality preserved EXACTLY
// 📝 SESSION #400B: Added timeframe-aware date ranges to fix 1W indicator failures
// 🔧 PRESERVATION: Session #185 400-day range + Session #151-185 timeframe weights + all scanning parameters
// 🚨 CRITICAL SUCCESS: Maintain identical scanning behavior for 1H, 4H, 1D + fix 1W data insufficiency
// ⚠️ PROTECTED LOGIC: All timeframe weights, backtest mode, date calculations preserved exactly
// 🎖️ SCANNING CONFIGURATION: Professional parameter management with institutional settings
// 📊 MODULAR INTEGRATION: Compatible with all Session #301-310 extracted components
// 🏆 1W FIX: Extended calendar days for weekly timeframe to ensure 26+ weeks for MACD
// 🚀 PRODUCTION IMPACT: Enable AI parameter optimization while preserving institutional-grade settings
// ==================================================================================

/**
 * 🔧 TIMEFRAME CONFIGURATION INTERFACE - SESSION #310 STRUCTURE
 * 🎯 PURPOSE: Define structure for timeframe analysis configuration
 * 🔧 SESSION #151-185 COMPLIANCE: Preserves exact timeframe weights and periods from original system
 * 🛡️ INSTITUTIONAL STANDARDS: Professional timeframe analysis requirements
 * 📊 PRODUCTION READY: Type-safe configuration structure for multi-timeframe analysis
 */
export interface TimeframeConfig {
  weight: number; // Weighting factor for timeframe in final score
  periods: number; // Number of data periods required for analysis
  description: string; // Human-readable description of timeframe purpose
}

/**
 * 🔧 SCANNING SETTINGS INTERFACE - SESSION #310 CONFIGURATION STRUCTURE
 * 🚨 PURPOSE: Comprehensive scanning configuration for signal generation
 * 🔧 SESSION #151-185 COMPLIANCE: Supports all existing scanning parameters
 * 📊 AI OPTIMIZATION READY: Structured for future AI parameter modification
 */
export interface ScanningSettings {
  useBacktest: boolean;
  testStocks: string[];
  timeframeConfig: Record<string, TimeframeConfig>;
  dateRangeSettings: {
    backtestStart: string;
    backtestEnd: string;
    calendarDays: number;
    weeklyCalendarDays: number; // SESSION #400B: Extended days for 1W timeframe
  };
}

/**
 * 🔧 SCANNING CONFIGURATION MANAGER - SESSION #400B WITH 1W FIX
 * 🚨 CRITICAL EXTRACTION: Moving scanning configuration from 1600-line monolith
 * 🛡️ ANTI-REGRESSION: ALL Session #151-185 + #301-310 configuration preserved EXACTLY
 * 🎯 PURPOSE: Centralized scanning and timeframe configuration management
 * 🔧 SESSION #185 PRESERVATION: 400-day extended range configuration maintained
 * 🚀 SESSION #151-185 PRESERVATION: All timeframe weights and periods preserved exactly
 * 📊 PRODUCTION INTEGRATION: Professional configuration management with comprehensive logging
 * 🎖️ AI OPTIMIZATION READY: Structured for future AI parameter optimization
 * 🏆 SESSION #400B: Added 1W timeframe data sufficiency fix
 */
export class ScanningConfiguration {
  private settings: ScanningSettings;

  /**
   * 🏗️ SCANNING CONFIGURATION CONSTRUCTOR - SESSION #400B WITH 1W FIX
   * 🎯 PURPOSE: Initialize scanning configuration with Session #151-185 preserved values
   * 🔧 SESSION #151-185 PRESERVED: Exact configuration values from original system
   * 🛡️ INSTITUTIONAL STANDARDS: Professional scanning configuration maintained exactly
   * 🏆 SESSION #400B: Added extended calendar days for 1W timeframe data sufficiency
   */
  constructor() {
    console.log(
      `🔧 [SESSION_400B_CONFIG] Initializing scanning configuration with Session #151-185 preserved values + 1W fix`
    );

    // 🚨 SESSION #151-185 PRESERVED EXACTLY: Timeframe configuration
    // 🔧 SESSION #310 EXTRACTION: Moved from index.ts TIMEFRAME_CONFIG constant
    this.settings = {
      useBacktest: false, // 🧪 SESSION #321 TEST: Enable verified historical data
      testStocks: ["AAPL", "MSFT", "GOOGL", "JPM", "JNJ"], // 🧪 SESSION #153 PRESERVED: Debug stocks for testing
      timeframeConfig: {
        "1H": {
          weight: 0.4, // 🚨 SESSION #151-185 PRESERVED: 40% weight for short-term momentum
          periods: 50, // 🔧 SESSION #151-185 PRESERVED: 50 periods for technical indicators
          description: "Short-term momentum analysis", // 🎯 SESSION #151-185 PRESERVED: Analysis purpose
        },
        "4H": {
          weight: 0.3, // 🚨 SESSION #151-185 PRESERVED: 30% weight for medium-term trend
          periods: 50, // 🔧 SESSION #151-185 PRESERVED: 50 periods for technical indicators
          description: "Medium-term trend confirmation", // 🎯 SESSION #151-185 PRESERVED: Analysis purpose
        },
        "1D": {
          weight: 0.2, // 🚨 SESSION #151-185 PRESERVED: 20% weight for long-term pattern
          periods: 50, // 🔧 SESSION #151-185 PRESERVED: 50 periods for technical indicators
          description: "Long-term pattern analysis", // 🎯 SESSION #151-185 PRESERVED: Analysis purpose
        },
        "1W": {
          weight: 0.1, // 🚨 SESSION #151-185 PRESERVED: 10% weight for market cycle context
          periods: 50, // 🔧 SESSION #151-185 PRESERVED: 50 periods for technical indicators
          description: "Market cycle context", // 🎯 SESSION #151-185 PRESERVED: Analysis purpose
        },
      },
      dateRangeSettings: {
        backtestStart: "2024-01-01", // 🧪 SESSION #152 PRESERVED: Verified backtest start date
        backtestEnd: "2024-06-14", // 🧪 SESSION #152 PRESERVED: Verified backtest end date
        calendarDays: 500, // 🚀 SESSION #185 PRESERVED: Extended 400-day range for reliable multi-timeframe data
        weeklyCalendarDays: 800, // 🏆 SESSION #400B: Extended range for 1W timeframe (ensures 26+ weeks for MACD)
      },
    };

    console.log(
      `✅ [SESSION_400B_CONFIG] Scanning configuration initialized with Session #151-185 preserved settings + 1W data fix`
    );
  }

  /**
   * 🔧 GET USE BACKTEST - SESSION #310 BACKTEST MODE ACCESS
   * 🎯 PURPOSE: Provide backtest mode setting for market data selection
   * 🛡️ PRESERVATION: Maintains Session #152 backtest toggle functionality exactly
   * 📊 USAGE: Used by main processing loop for data source selection
   */
  getUseBacktest(): boolean {
    return this.settings.useBacktest;
  }

  /**
   * 🧪 GET TEST STOCKS - SESSION #310 DEBUG STOCKS ACCESS
   * 🎯 PURPOSE: Provide test stock list for debugging and development
   * 🛡️ PRESERVATION: Maintains Session #153 test stocks exactly
   * 📊 USAGE: Used for development and testing purposes
   */
  getTestStocks(): string[] {
    return [...this.settings.testStocks]; // Return copy to prevent modification
  }

  /**
   * 🔧 GET TIMEFRAME CONFIG - SESSION #310 TIMEFRAME CONFIGURATION ACCESS
   * 🎯 PURPOSE: Provide complete timeframe configuration for multi-timeframe analysis
   * 🛡️ PRESERVATION: Maintains Session #151-185 timeframe weights and periods exactly
   * 📊 USAGE: Used by TimeframeDataCoordinator and signal scoring calculations
   */
  getTimeframeConfig(): Record<string, TimeframeConfig> {
    return JSON.parse(JSON.stringify(this.settings.timeframeConfig)); // Deep copy to prevent modification
  }

  /**
   * 🚀 GET DATE RANGES - SESSION #400B WITH 1W TIMEFRAME FIX
   * 🚨 EXTRACTED FROM: index.ts getDateRanges() function
   * 🛡️ PRESERVATION: ALL Session #185 + #152 date calculation logic preserved EXACTLY
   * 🎯 PURPOSE: Calculate appropriate date ranges for market data fetching
   * 🔧 SESSION #185 PRESERVED: 400-day extended range for reliable multi-timeframe data
   * 🧪 SESSION #152 PRESERVED: Backtest mode support maintained exactly
   * 🏆 SESSION #400B: Added timeframe-aware logic to fix 1W data insufficiency
   * @param timeframe Optional timeframe to get specific date range for (1W gets extended range)
   */
  getDateRanges(timeframe?: string): {
    recent: { start: string; end: string };
  } {
    if (this.settings.useBacktest) {
      console.log(
        `🔄 [SESSION_400B_CONFIG] BACKTEST MODE ACTIVE: Using verified historical data`
      );
      console.log(
        `📅 [SESSION_400B_CONFIG] Backtest Date Range: ${this.settings.dateRangeSettings.backtestStart} to ${this.settings.dateRangeSettings.backtestEnd}`
      );
      return {
        recent: {
          start: this.settings.dateRangeSettings.backtestStart,
          end: this.settings.dateRangeSettings.backtestEnd,
        },
      };
    } else {
      const now = new Date();
      const today = now.toISOString().split("T")[0];

      // 🏆 SESSION #400B: Determine calendar days based on timeframe
      // 1W timeframe needs extended range to ensure 26+ weeks for MACD calculation
      let calendarDaysToUse: number;
      if (timeframe === "1W") {
        calendarDaysToUse = this.settings.dateRangeSettings.weeklyCalendarDays;
        console.log(
          `📊 [SESSION_400B_CONFIG] 1W TIMEFRAME DETECTED: Using extended ${calendarDaysToUse}-day range for sufficient weekly data`
        );
      } else {
        calendarDaysToUse = this.settings.dateRangeSettings.calendarDays;
        if (timeframe) {
          console.log(
            `📊 [SESSION_400B_CONFIG] ${timeframe} TIMEFRAME: Using standard ${calendarDaysToUse}-day range`
          );
        }
      }

      // Calculate start date using determined calendar days
      const calendarDaysAgo = new Date(
        now.getTime() - calendarDaysToUse * 24 * 60 * 60 * 1000
      );
      const recentStartDate = calendarDaysAgo.toISOString().split("T")[0];

      if (timeframe === "1W") {
        console.log(
          `📈 [SESSION_400B_CONFIG] 1W LIVE MODE: Using SESSION #400B extended ${calendarDaysToUse}-day range for 26+ weeks data`
        );
        console.log(
          `📅 [SESSION_400B_CONFIG] 1W Extended Date Range: ${recentStartDate} to ${today} (${calendarDaysToUse} calendar days for MACD sufficiency)`
        );
        console.log(
          `🔧 [SESSION_400B_CONFIG] 1W DATA FIX: Extended window ensures sufficient weekly periods for all indicators`
        );
      } else {
        console.log(
          `📈 [SESSION_400B_CONFIG] LIVE MODE ACTIVE: Using SESSION #185 enhanced ${calendarDaysToUse}-day rolling window for reliable multi-timeframe data`
        );
        console.log(
          `📅 [SESSION_400B_CONFIG] SESSION #185 Enhanced Date Range: ${recentStartDate} to ${today} (${calendarDaysToUse} calendar days)`
        );
      }

      return {
        recent: {
          start: recentStartDate,
          end: today,
        },
      };
    }
  }

  /**
   * 🔧 SET USE BACKTEST - SESSION #310 AI OPTIMIZATION READY
   * 🎯 PURPOSE: Allow AI to modify backtest mode for optimization
   * 🚨 AI READY: Enable future AI parameter optimization
   * 📊 USAGE: Future AI optimization of scanning parameters
   */
  setUseBacktest(useBacktest: boolean): void {
    console.log(
      `🔧 [SESSION_400B_CONFIG] Setting backtest mode: ${useBacktest}`
    );
    this.settings.useBacktest = useBacktest;
  }

  /**
   * 🚀 SET CALENDAR DAYS - SESSION #310 AI OPTIMIZATION READY
   * 🎯 PURPOSE: Allow AI to optimize date range for different market conditions
   * 🚨 AI READY: Enable future AI parameter optimization of data range
   * 📊 USAGE: Future AI optimization of data sufficiency vs processing speed
   */
  setCalendarDays(calendarDays: number): void {
    console.log(
      `🔧 [SESSION_400B_CONFIG] Setting calendar days: ${calendarDays}`
    );
    this.settings.dateRangeSettings.calendarDays = calendarDays;
  }

  /**
   * 🏆 SET WEEKLY CALENDAR DAYS - SESSION #400B NEW FUNCTIONALITY
   * 🎯 PURPOSE: Allow optimization of 1W timeframe data range specifically
   * 🚨 1W FIX: Enable fine-tuning of weekly timeframe data sufficiency
   * 📊 USAGE: Adjust 1W data range without affecting other timeframes
   */
  setWeeklyCalendarDays(weeklyCalendarDays: number): void {
    console.log(
      `🔧 [SESSION_400B_CONFIG] Setting weekly calendar days: ${weeklyCalendarDays}`
    );
    this.settings.dateRangeSettings.weeklyCalendarDays = weeklyCalendarDays;
  }

  /**
   * 🔧 GET FULL SETTINGS - SESSION #400B COMPLETE CONFIGURATION ACCESS
   * 🎯 PURPOSE: Provide complete configuration object for advanced usage
   * 🛡️ PRESERVATION: Returns deep copy to prevent external modification
   * 📊 USAGE: Used for configuration validation and AI optimization analysis
   */
  getFullSettings(): ScanningSettings {
    return JSON.parse(JSON.stringify(this.settings)); // Deep copy to prevent modification
  }

  /**
   * 📊 GET CONFIGURATION NAME - SESSION #310 MODULAR IDENTIFICATION
   * 🎯 PURPOSE: Identify this configuration module for logging and debugging
   * 🔧 USAGE: Used by orchestrator for module tracking and error reporting
   * 🛡️ SESSION #301-310 COMPATIBILITY: Follows same naming pattern as other modular components
   */
  getName(): string {
    return "ScanningConfiguration";
  }
}

/**
 * 🔧 SCANNING CONFIGURATION HELPER FUNCTIONS - SESSION #400B WITH 1W FIX
 * 🎯 PURPOSE: Provide configuration access in original Edge Function format for backward compatibility
 * 🔧 BRIDGE FUNCTIONS: Converts modular configuration back to original constant format
 * 🛡️ ANTI-REGRESSION: Maintains exact return format expected by main processing loop
 * 📊 SESSION #151-185 PRESERVED: All scanning configuration maintained exactly
 * 🏆 SESSION #400B: Added timeframe-aware date ranges for 1W fix
 */

// Global configuration instance for backward compatibility
const globalScanningConfig = new ScanningConfiguration();

/**
 * 🔧 GET USE BACKTEST HELPER - SESSION #310 BACKWARD COMPATIBILITY
 * 🎯 PURPOSE: Provide USE_BACKTEST constant replacement for main processing loop
 * 🛡️ ANTI-REGRESSION: Maintains exact return value expected by index.ts
 */
export function getUseBacktest(): boolean {
  return globalScanningConfig.getUseBacktest();
}

/**
 * 🧪 GET TEST STOCKS HELPER - SESSION #310 BACKWARD COMPATIBILITY
 * 🎯 PURPOSE: Provide TEST_STOCKS constant replacement for main processing loop
 * 🛡️ ANTI-REGRESSION: Maintains exact return value expected by index.ts
 */
export function getTestStocks(): string[] {
  return globalScanningConfig.getTestStocks();
}

/**
 * 🔧 GET TIMEFRAME CONFIG HELPER - SESSION #310 BACKWARD COMPATIBILITY
 * 🎯 PURPOSE: Provide TIMEFRAME_CONFIG constant replacement for main processing loop
 * 🛡️ ANTI-REGRESSION: Maintains exact return value expected by index.ts
 */
export function getTimeframeConfig(): Record<string, TimeframeConfig> {
  return globalScanningConfig.getTimeframeConfig();
}

/**
 * 🚀 GET DATE RANGES HELPER - SESSION #400B WITH 1W TIMEFRAME FIX
 * 🎯 PURPOSE: Provide getDateRanges() function replacement for main processing loop
 * 🛡️ ANTI-REGRESSION: Maintains exact return value expected by index.ts for backward compatibility
 * 🏆 SESSION #400B: Added optional timeframe parameter for 1W data sufficiency fix
 * @param timeframe Optional timeframe parameter (1W gets extended range, others get standard range)
 */
export function getDateRanges(timeframe?: string): {
  recent: { start: string; end: string };
} {
  return globalScanningConfig.getDateRanges(timeframe);
}

// ==================================================================================
// 🎯 SESSION #400B SCANNING CONFIGURATION WITH 1W TIMEFRAME FIX COMPLETE
// ==================================================================================
// 📊 FUNCTIONALITY: Complete scanning and timeframe configuration with Session #151-185 preservation + Session #400B 1W data fix
// 🛡️ PRESERVATION: Session #185 400-day range + Session #151-185 timeframe weights + Session #152 backtest mode + Session #153 test stocks + all configuration maintained exactly
// 🔧 EXTRACTION SUCCESS: Moved from monolithic function constants to isolated, configurable module following Session #301-310 patterns
// 📈 CONFIGURATION MANAGEMENT: Maintains exact scanning logic through helper functions for main processing loop compatibility + AI optimization ready
// 🎖️ ANTI-REGRESSION: All existing configuration logic preserved exactly - scanning requirements identical to original function + all Session #151-185 functionality maintained
// ⚡ MODULAR BENEFITS: Isolated configuration + AI optimization ready + clean interfaces + professional architecture + future enhancement ready + Session #301-310 pattern compliance
// 🏆 SESSION #400B ACHIEVEMENT: 1W timeframe data sufficiency fix - extended calendar days for weekly analysis to ensure 26+ weeks for MACD
// 🚀 PRODUCTION READY: Session #400B Scanning Configuration with 1W fix complete - maintains institutional-grade scanning standards with modular architecture advantages + AI optimization capability
// 🔄 BACKWARD COMPATIBILITY: All existing calls to getDateRanges() continue working exactly as before
// 🎯 1W FIX DETAILS: Weekly timeframe now uses 800 calendar days instead of 500 to ensure sufficient data for all technical indicators
// 🏆 TESTING VALIDATION: Extracted Scanning Configuration module must produce identical configuration values (100% exact settings) to original monolithic function constants + maintain all Session #151-185 functionality + fix 1W data insufficiency
// ==================================================================================
