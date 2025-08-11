// ==================================================================================
// 🎯 SESSION #402: RSI DIVERGENCE DETECTION - TYPE DEFINITIONS (1D TIMEFRAME)
// ==================================================================================
// 🚨 PURPOSE: Production-ready type definitions for 1D RSI divergence detection
// 🛡️ ANTI-REGRESSION MANDATE: No existing functionality affected
// 📊 1D FOCUS: Optimized for daily timeframe analysis - superior signal quality
// 🔧 DATABASE INTEGRATION: Aligned with indicators table structure
// ✅ PRODUCTION READY: Real divergence detection, no synthetic data
// 🎖️ NOISE REDUCTION: Daily timeframe eliminates intraday noise for reliable patterns
// ==================================================================================

export enum DivergenceType {
  BULLISH_REGULAR = "BULLISH_REGULAR", // Price lower lows, RSI higher lows
  BEARISH_REGULAR = "BEARISH_REGULAR", // Price higher highs, RSI lower highs
  BULLISH_HIDDEN = "BULLISH_HIDDEN", // Price higher lows, RSI lower lows
  BEARISH_HIDDEN = "BEARISH_HIDDEN", // Price lower highs, RSI higher highs
}

export enum DivergenceStrength {
  WEAK = "WEAK", // 30-50 confidence
  MODERATE = "MODERATE", // 50-70 confidence
  STRONG = "STRONG", // 70-85 confidence
  VERY_STRONG = "VERY_STRONG", // 85+ confidence
}

/**
 * 🎯 EXTREMUM POINT - 1D TIMEFRAME PRICE/RSI PEAKS AND TROUGHS
 * PURPOSE: Identify significant highs and lows for divergence analysis
 * 1D OPTIMIZATION: Appropriate sensitivity for daily data - noise-free patterns
 */
export interface ExtremumPoint {
  index: number; // Position in price/RSI array
  price: number; // Price value at this point
  rsi: number; // RSI value at this point
  timestamp?: string; // Optional timestamp for debugging
  significance: number; // How significant this extremum is (0-100)
  type: "HIGH" | "LOW"; // Whether this is a peak or trough
}

/**
 * 🎯 DIVERGENCE PATTERN - COMPLETE PATTERN DEFINITION
 * PURPOSE: Full description of detected divergence pattern
 * DATABASE READY: Metadata structure matches indicators table
 */
export interface DivergencePattern {
  type: DivergenceType;
  strength: DivergenceStrength;
  pricePoints: ExtremumPoint[]; // Price extremums (usually 2-3 points)
  rsiPoints: ExtremumPoint[]; // RSI extremums (usually 2-3 points)
  priceSlope: number; // Price trend slope
  rsiSlope: number; // RSI trend slope
  slopeDifference: number; // Absolute difference between slopes
  confidenceScore: number; // Overall confidence (0-100)
  qualityScore: number; // Pattern quality (0-100)
  tradingSignalStrength: number; // Trading value (0-100)
  detectionMethod: string; // Algorithm used
  validationsPassed: number; // How many validation checks passed
  analysisTimestamp: string; // When pattern was detected
}

/**
 * 🎯 DIVERGENCE ANALYSIS INPUT - 1D TIMEFRAME CONFIGURATION
 * PURPOSE: Input parameters for 1D divergence analysis
 * 1D OPTIMIZED: Default values optimized for daily data - superior signal quality
 */
export interface DivergenceAnalysisInput {
  prices: number[]; // 1D price data
  rsiValues: number[]; // 1D RSI values
  minPeriods?: number; // Minimum lookback (default: 30 for 1D)
  maxPeriods?: number; // Maximum lookback (default: 100 for 1D)
  sensitivityLevel?: number; // Detection sensitivity 1-10 (default: 5)
  minConfidenceScore?: number; // Minimum confidence to accept (default: 70)
  minQualityScore?: number; // Minimum quality to accept (default: 60)
  enableDebug?: boolean; // Enable debug logging
}

/**
 * 🎯 DIVERGENCE DETECTION RESULT - COMPLETE ANALYSIS OUTPUT
 * PURPOSE: Full result structure for divergence analysis
 * DATABASE INTEGRATION: Designed for indicators table storage
 */
export interface DivergenceDetectionResult {
  hasValidDivergence: boolean; // Was valid divergence found?
  analysisSuccessful: boolean; // Did analysis complete without errors?
  totalPatternsFound: number; // How many patterns detected
  validPatternsCount: number; // How many passed validation
  patterns: DivergencePattern[]; // All detected patterns
  strongestPattern?: DivergencePattern; // Best pattern found
  mostRecentPattern?: DivergencePattern; // Most recent pattern
  dataQuality: number; // Input data quality (0-100)
  processingTime: number; // Analysis time in milliseconds
  errors: string[]; // Any errors encountered
  warnings: string[]; // Any warnings

  // Database integration fields
  indicatorValue: number; // Value for indicators.raw_value (0-100)
  scoreContribution: number; // Bonus points for signal score
  metadata: {
    // For indicators.metadata field
    divergence_type?: string;
    pattern_strength?: string;
    confidence_score?: number;
    price_points_count?: number;
    rsi_points_count?: number;
    slope_difference?: number;
    detection_method?: string;
    analysis_period?: number;
    session: string;
    timeframe: string;
    // Additional fields for error handling
    error?: string;
    analysis_failed?: boolean;
    no_patterns_found?: boolean;
    reason?: string;
  };
}

/**
 * 🎯 DIVERGENCE CONFIGURATION - 1D TIMEFRAME SETTINGS
 * PURPOSE: Configuration for 1D divergence detection system
 * PRODUCTION READY: Optimized parameters for daily analysis - superior signal quality
 */
export interface DivergenceConfig {
  enabled: boolean; // Enable/disable divergence detection
  timeframe: "1D"; // Fixed to 1D for noise-free analysis
  analysisWindow: number; // How many periods to analyze (default: 100)
  extremumLookback: number; // Extremum detection window (default: 7)
  minPatternDistance: number; // Minimum distance between extremums (default: 15)
  confidenceThreshold: number; // Minimum confidence to accept (default: 70)
  qualityThreshold: number; // Minimum quality to accept (default: 60)
  maxScoreBonus: number; // Maximum bonus points (default: 15)
  debugMode: boolean; // Enable detailed logging
}
