// ==================================================================================
// 🎯 SESSION #402: DIVERGENCE UTILITIES - 1D EXTREMUM & TREND ANALYSIS
// ==================================================================================
// 🚨 PURPOSE: Core utilities for 1D RSI divergence detection
// 🛡️ ANTI-REGRESSION MANDATE: No existing functionality affected
// 📊 1D OPTIMIZED: Specialized for daily timeframe analysis - superior signal quality
// 🔧 PRODUCTION READY: Real extremum detection and trend analysis
// ✅ NO SYNTHETIC DATA: Pure mathematical analysis
// 🎖️ NOISE REDUCTION: Daily timeframe eliminates intraday noise for reliable patterns
// ==================================================================================

import {
  ExtremumPoint,
  DivergencePattern,
  DivergenceType,
  DivergenceStrength,
} from "../types/divergence-types.ts";

/**
 * 🎯 EXTREMUM DETECTOR - 1D TIMEFRAME PEAK AND TROUGH DETECTION
 * PURPOSE: Identify significant highs and lows in price and RSI data
 * 1D OPTIMIZATION: Sensitivity tuned for daily market data - noise-free patterns
 * ALGORITHM: Local extremum detection with significance scoring
 */
export class ExtremumDetector {
  private lookbackWindow: number;
  private minSignificance: number;

  constructor(lookbackWindow: number = 7, minSignificance: number = 0.25) {
    this.lookbackWindow = lookbackWindow; // 7 periods for 1D data
    this.minSignificance = minSignificance; // 25% minimum significance
  }

  /**
   * 🔍 DETECT EXTREMUMS - FIND PEAKS AND TROUGHS
   * PURPOSE: Identify all significant extremum points in the data
   * 1D TUNING: Optimized window size for daily volatility patterns - noise-free
   */
  detectExtremums(values: number[], type: "price" | "rsi"): ExtremumPoint[] {
    const extremums: ExtremumPoint[] = [];
    const minDistance = Math.max(5, Math.floor(this.lookbackWindow / 2)); // Minimum 5 periods apart for 1D

    for (
      let i = this.lookbackWindow;
      i < values.length - this.lookbackWindow;
      i++
    ) {
      const isHigh = this.isLocalHigh(values, i);
      const isLow = this.isLocalLow(values, i);

      if (isHigh || isLow) {
        const significance = this.calculateSignificance(
          values,
          i,
          this.lookbackWindow,
          isHigh
        );

        if (significance >= this.minSignificance) {
          // Check minimum distance from previous extremum
          const lastExtremum = extremums[extremums.length - 1];
          if (
            !lastExtremum ||
            Math.abs(i - lastExtremum.index) >= minDistance
          ) {
            extremums.push({
              index: i,
              price: type === "price" ? values[i] : 0, // Will be filled by caller
              rsi: type === "rsi" ? values[i] : 0, // Will be filled by caller
              significance: significance * 100, // Convert to 0-100 scale
              type: isHigh ? "HIGH" : "LOW",
            });
          }
        }
      }
    }

    return extremums;
  }

  /**
   * 🔝 CHECK LOCAL HIGH - IS THIS POINT A LOCAL MAXIMUM?
   * PURPOSE: Determine if current point is higher than surrounding points
   * 1D ANALYSIS: Check both sides for reliable peak detection - noise-free
   */
  private isLocalHigh(values: number[], index: number): boolean {
    const currentValue = values[index];

    // Check left side
    for (let i = index - this.lookbackWindow; i < index; i++) {
      if (values[i] >= currentValue) return false;
    }

    // Check right side
    for (let i = index + 1; i <= index + this.lookbackWindow; i++) {
      if (values[i] >= currentValue) return false;
    }

    return true;
  }

  /**
   * 🔻 CHECK LOCAL LOW - IS THIS POINT A LOCAL MINIMUM?
   * PURPOSE: Determine if current point is lower than surrounding points
   * 1D ANALYSIS: Check both sides for reliable trough detection - noise-free
   */
  private isLocalLow(values: number[], index: number): boolean {
    const currentValue = values[index];

    // Check left side
    for (let i = index - this.lookbackWindow; i < index; i++) {
      if (values[i] <= currentValue) return false;
    }

    // Check right side
    for (let i = index + 1; i <= index + this.lookbackWindow; i++) {
      if (values[i] <= currentValue) return false;
    }

    return true;
  }

  /**
   * 📊 CALCULATE SIGNIFICANCE - HOW IMPORTANT IS THIS EXTREMUM?
   * PURPOSE: Score the significance of an extremum point
   * FACTORS: Relative height/depth, surrounding volatility, data range
   */
  private calculateSignificance(
    values: number[],
    index: number,
    lookback: number,
    isHigh: boolean
  ): number {
    const currentValue = values[index];
    let significanceSum = 0;
    let count = 0;

    // Compare with surrounding values
    for (let i = index - lookback; i <= index + lookback; i++) {
      if (i === index || i < 0 || i >= values.length) continue;
      const difference = isHigh
        ? currentValue - values[i]
        : values[i] - currentValue;
      if (difference > 0) {
        significanceSum += difference;
        count++;
      }
    }

    const averageDifference = count > 0 ? significanceSum / count : 0;
    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);
    const range = maxValue - minValue;

    // Normalize significance by data range
    return range > 0 ? averageDifference / range : 0;
  }
}

/**
 * 🎯 TREND ANALYZER - SLOPE AND DIRECTION ANALYSIS
 * PURPOSE: Calculate trends and slopes for divergence detection
 * 1D OPTIMIZATION: Appropriate slope thresholds for daily data - superior signals
 */
export class TrendAnalyzer {
  /**
   * 📈 CALCULATE SLOPE - TREND DIRECTION AND MAGNITUDE
   * PURPOSE: Calculate slope between two extremum points
   * MATH: Rise over run, normalized for time periods
   */
  calculateSlope(
    point1: ExtremumPoint,
    point2: ExtremumPoint,
    usePrice: boolean = true
  ): number {
    const value1 = usePrice ? point1.price : point1.rsi;
    const value2 = usePrice ? point2.price : point2.rsi;
    const deltaY = value2 - value1;
    const deltaX = point2.index - point1.index;
    return deltaX !== 0 ? deltaY / deltaX : 0;
  }

  /**
   * 📐 CALCULATE DIVERGENCE ANGLE - DIFFERENCE IN TRENDS
   * PURPOSE: Measure how much price and RSI trends diverge
   * 1D CALIBRATION: Thresholds appropriate for daily volatility - cleaner signals
   */
  calculateDivergenceAngle(priceSlope: number, rsiSlope: number): number {
    return Math.abs(priceSlope - rsiSlope);
  }

  /**
   * 🎯 CLASSIFY TREND STRENGTH - HOW STRONG IS THE TREND?
   * PURPOSE: Categorize trend strength for pattern validation
   * 1D THRESHOLDS: Calibrated for daily price movements - superior signal quality
   */
  classifyTrendStrength(slope: number, dataRange: number): string {
    const normalizedSlope = Math.abs(slope) / dataRange;

    if (normalizedSlope > 0.03) return "STRONG"; // Adjusted for 1D
    if (normalizedSlope > 0.015) return "MODERATE"; // Adjusted for 1D
    if (normalizedSlope > 0.007) return "WEAK"; // Adjusted for 1D
    return "FLAT";
  }
}

/**
 * 🎯 PATTERN MATCHER - DIVERGENCE PATTERN CLASSIFICATION
 * PURPOSE: Identify and classify divergence patterns
 * 1D SPECIALIZATION: Pattern rules optimized for daily timeframe - noise-free analysis
 */
export class PatternMatcher {
  /**
   * 🔍 IDENTIFY DIVERGENCE TYPE - CLASSIFY THE PATTERN
   * PURPOSE: Determine the type of divergence pattern
   * LOGIC: Compare price and RSI trend directions
   */
  identifyDivergenceType(
    pricePoints: ExtremumPoint[],
    rsiPoints: ExtremumPoint[],
    priceSlope: number,
    rsiSlope: number
  ): DivergenceType | null {
    if (pricePoints.length < 2 || rsiPoints.length < 2) return null;

    const priceDirection = priceSlope > 0 ? "UP" : "DOWN";
    const rsiDirection = rsiSlope > 0 ? "UP" : "DOWN";
    const firstPriceType = pricePoints[0].type;
    const lastPriceType = pricePoints[pricePoints.length - 1].type;

    // Regular Bullish: Price makes lower lows, RSI makes higher lows
    if (
      priceDirection === "DOWN" &&
      rsiDirection === "UP" &&
      firstPriceType === "LOW" &&
      lastPriceType === "LOW"
    ) {
      return DivergenceType.BULLISH_REGULAR;
    }

    // Regular Bearish: Price makes higher highs, RSI makes lower highs
    if (
      priceDirection === "UP" &&
      rsiDirection === "DOWN" &&
      firstPriceType === "HIGH" &&
      lastPriceType === "HIGH"
    ) {
      return DivergenceType.BEARISH_REGULAR;
    }

    // Hidden Bullish: Price makes higher lows, RSI makes lower lows
    if (
      priceDirection === "UP" &&
      rsiDirection === "DOWN" &&
      firstPriceType === "LOW" &&
      lastPriceType === "LOW"
    ) {
      return DivergenceType.BULLISH_HIDDEN;
    }

    // Hidden Bearish: Price makes lower highs, RSI makes higher highs
    if (
      priceDirection === "DOWN" &&
      rsiDirection === "UP" &&
      firstPriceType === "HIGH" &&
      lastPriceType === "HIGH"
    ) {
      return DivergenceType.BEARISH_HIDDEN;
    }

    return null;
  }

  /**
   * 💪 CALCULATE PATTERN STRENGTH - HOW STRONG IS THIS PATTERN?
   * PURPOSE: Score the strength of the divergence pattern
   * FACTORS: Slope difference, point significance, pattern clarity
   */
  calculatePatternStrength(
    priceSlope: number,
    rsiSlope: number,
    pricePoints: ExtremumPoint[],
    rsiPoints: ExtremumPoint[]
  ): DivergenceStrength {
    const slopeDifference = Math.abs(priceSlope - rsiSlope);
    const avgPriceSignificance =
      pricePoints.reduce((sum, p) => sum + p.significance, 0) /
      pricePoints.length;
    const avgRsiSignificance =
      rsiPoints.reduce((sum, p) => sum + p.significance, 0) / rsiPoints.length;

    // Combined strength score (0-100)
    const strengthScore =
      slopeDifference * 100 + (avgPriceSignificance + avgRsiSignificance) / 2;

    if (strengthScore >= 85) return DivergenceStrength.VERY_STRONG;
    if (strengthScore >= 70) return DivergenceStrength.STRONG;
    if (strengthScore >= 50) return DivergenceStrength.MODERATE;
    return DivergenceStrength.WEAK;
  }

  /**
   * ✅ VALIDATE PATTERN - IS THIS A VALID DIVERGENCE?
   * PURPOSE: Ensure pattern meets quality standards
   * 1D CRITERIA: Validation rules for daily timeframe - higher quality standards
   */
  validatePattern(pattern: DivergencePattern): boolean {
    // Must have at least 2 points of each type
    if (pattern.pricePoints.length < 2 || pattern.rsiPoints.length < 2)
      return false;

    // Must have valid divergence type
    if (!Object.values(DivergenceType).includes(pattern.type)) return false;

    // Higher confidence and quality thresholds for 1D
    if (pattern.confidenceScore < 50 || pattern.qualityScore < 40) return false;

    // Minimum slope difference for meaningful divergence (relaxed for 1D)
    if (pattern.slopeDifference < 0.0005) return false;

    return true;
  }
}

/**
 * 🎯 DATA VALIDATOR - INPUT DATA QUALITY CHECKS
 * PURPOSE: Ensure input data is suitable for divergence analysis
 * 1D REQUIREMENTS: Minimum data quality for reliable daily analysis
 */
export class DataValidator {
  /**
   * ✅ VALIDATE INPUT DATA - CHECK DATA QUALITY
   * PURPOSE: Ensure price and RSI data is suitable for analysis
   * REQUIREMENTS: Sufficient length, no null values, reasonable ranges
   */
  static validateInputData(
    prices: number[],
    rsiValues: number[]
  ): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    qualityScore: number;
  } {
    const errors: string[] = [];
    const warnings: string[] = [];
    let qualityScore = 100;

    // Check basic requirements
    if (!prices || prices.length === 0) {
      errors.push("Price data is empty or null");
      return { isValid: false, errors, warnings, qualityScore: 0 };
    }

    if (!rsiValues || rsiValues.length === 0) {
      errors.push("RSI data is empty or null");
      return { isValid: false, errors, warnings, qualityScore: 0 };
    }

    if (prices.length !== rsiValues.length) {
      errors.push("Price and RSI data lengths do not match");
      return { isValid: false, errors, warnings, qualityScore: 0 };
    }

    // Check minimum length for 1D analysis (need at least 50 periods)
    if (prices.length < 50) {
      errors.push(
        "Insufficient data: minimum 50 periods required for 1D analysis"
      );
      return { isValid: false, errors, warnings, qualityScore: 0 };
    }

    // Check for null or invalid values
    const hasNullPrices = prices.some(
      (p) => p === null || p === undefined || isNaN(p)
    );
    const hasNullRsi = rsiValues.some(
      (r) => r === null || r === undefined || isNaN(r)
    );

    if (hasNullPrices) {
      errors.push("Price data contains null or invalid values");
      qualityScore -= 30;
    }

    if (hasNullRsi) {
      errors.push("RSI data contains null or invalid values");
      qualityScore -= 30;
    }

    // Check RSI range (should be 0-100)
    const invalidRsi = rsiValues.some((r) => r < 0 || r > 100);
    if (invalidRsi) {
      warnings.push("RSI values outside normal range (0-100)");
      qualityScore -= 10;
    }

    // Check price volatility (detect flat or suspicious data)
    const priceRange = Math.max(...prices) - Math.min(...prices);
    const avgPrice = prices.reduce((sum, p) => sum + p, 0) / prices.length;
    const volatilityRatio = priceRange / avgPrice;

    if (volatilityRatio < 0.01) {
      warnings.push("Very low price volatility detected");
      qualityScore -= 15;
    }

    // Data is valid if no errors
    const isValid = errors.length === 0;

    return {
      isValid,
      errors,
      warnings,
      qualityScore: Math.max(0, qualityScore),
    };
  }
}
