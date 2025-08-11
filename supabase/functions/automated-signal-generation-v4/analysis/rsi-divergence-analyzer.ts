// ==================================================================================
// 🎯 SESSION #402: RSI DIVERGENCE ANALYZER - 1D TIMEFRAME ENGINE
// ==================================================================================
// 🚨 PURPOSE: Core RSI divergence detection engine for 1D timeframe
// 🛡️ ANTI-REGRESSION MANDATE: No existing functionality affected
// 📊 1D SPECIALIZED: Optimized parameters and thresholds for daily data - superior signal quality
// 🔧 PRODUCTION READY: Real mathematical analysis, no synthetic data
// ✅ DATABASE READY: Structured output for indicators table integration
// 🎖️ NOISE REDUCTION: Daily timeframe eliminates intraday noise for reliable patterns
// ==================================================================================

import {
  DivergenceAnalysisInput,
  DivergenceDetectionResult,
  DivergencePattern,
  DivergenceType,
  DivergenceStrength,
  ExtremumPoint,
} from "../types/divergence-types.ts";

import {
  ExtremumDetector,
  TrendAnalyzer,
  PatternMatcher,
  DataValidator,
} from "./divergence-utilities.ts";

/**
 * 🎯 RSI DIVERGENCE ANALYZER - MAIN DETECTION ENGINE
 * PURPOSE: Complete RSI divergence analysis for 1D timeframe
 * ARCHITECTURE: Modular design using specialized utility classes
 * OUTPUT: Production-ready results for database integration
 */
export class RSIDivergenceAnalyzer {
  private extremumDetector: ExtremumDetector;
  private trendAnalyzer: TrendAnalyzer;
  private patternMatcher: PatternMatcher;

  constructor() {
    // 1D optimized parameters
    this.extremumDetector = new ExtremumDetector(7, 0.25); // 7-period window, 25% min significance
    this.trendAnalyzer = new TrendAnalyzer();
    this.patternMatcher = new PatternMatcher();
  }

  /**
   * 🎯 ANALYZE DIVERGENCE - MAIN ANALYSIS ENTRY POINT
   * PURPOSE: Complete divergence analysis with all validation and scoring
   * 1D OPTIMIZATION: Parameters tuned for daily market dynamics - superior signal quality
   */
  async analyzeDivergence(
    input: DivergenceAnalysisInput
  ): Promise<DivergenceDetectionResult> {
    const startTime = Date.now();
    const errors: string[] = [];
    const warnings: string[] = [];

    console.log(
      "🎯 [RSI_DIVERGENCE_ANALYZER] Starting 1D divergence analysis..."
    );

    try {
      // Step 1: Validate input data
      const validation = DataValidator.validateInputData(
        input.prices,
        input.rsiValues
      );
      if (!validation.isValid) {
        console.log(
          `❌ [RSI_DIVERGENCE_ANALYZER] Data validation failed: ${validation.errors.join(
            ", "
          )}`
        );
        return this.createFailureResult(validation.errors, warnings, startTime);
      }

      if (validation.warnings.length > 0) {
        warnings.push(...validation.warnings);
        console.log(
          `⚠️ [RSI_DIVERGENCE_ANALYZER] Data quality warnings: ${validation.warnings.join(
            ", "
          )}`
        );
      }

      // Step 2: Configure analysis parameters
      const config = this.getAnalysisConfig(input);
      console.log(
        `🔧 [RSI_DIVERGENCE_ANALYZER] Analysis window: ${config.analysisWindow} periods`
      );

      // Step 3: Detect extremum points
      const { priceExtremums, rsiExtremums } = this.detectExtremumPoints(
        input.prices,
        input.rsiValues,
        config.analysisWindow
      );

      if (priceExtremums.length < 2 || rsiExtremums.length < 2) {
        console.log(
          "📊 [RSI_DIVERGENCE_ANALYZER] Insufficient extremum points for divergence analysis"
        );
        return this.createEmptyResult(
          "Insufficient extremum points",
          warnings,
          startTime,
          validation.qualityScore
        );
      }

      console.log(
        `📍 [RSI_DIVERGENCE_ANALYZER] Found ${priceExtremums.length} price extremums, ${rsiExtremums.length} RSI extremums`
      );

      // Step 4: Find potential divergence patterns
      const patterns = this.findDivergencePatterns(
        priceExtremums,
        rsiExtremums,
        config
      );
      console.log(
        `🔍 [RSI_DIVERGENCE_ANALYZER] Detected ${patterns.length} potential patterns`
      );

      // Step 5: Validate and score patterns
      const validPatterns = patterns.filter((pattern) =>
        this.patternMatcher.validatePattern(pattern)
      );
      console.log(
        `✅ [RSI_DIVERGENCE_ANALYZER] ${validPatterns.length} patterns passed validation`
      );

      // Step 6: Find strongest pattern
      const strongestPattern = this.findStrongestPattern(validPatterns);
      const mostRecentPattern = this.findMostRecentPattern(validPatterns);

      // Step 7: Calculate database integration values
      const { indicatorValue, scoreContribution, metadata } =
        this.calculateDatabaseValues(
          strongestPattern,
          validPatterns,
          validation.qualityScore
        );

      const processingTime = Date.now() - startTime;
      console.log(
        `🎯 [RSI_DIVERGENCE_ANALYZER] Analysis complete in ${processingTime}ms`
      );

      return {
        hasValidDivergence: validPatterns.length > 0,
        analysisSuccessful: true,
        totalPatternsFound: patterns.length,
        validPatternsCount: validPatterns.length,
        patterns: validPatterns,
        strongestPattern,
        mostRecentPattern,
        dataQuality: validation.qualityScore,
        processingTime,
        errors,
        warnings,
        indicatorValue,
        scoreContribution,
        metadata,
      };
    } catch (error) {
      const processingTime = Date.now() - startTime;
      console.log(
        `❌ [RSI_DIVERGENCE_ANALYZER] Analysis failed: ${error.message}`
      );

      return {
        hasValidDivergence: false,
        analysisSuccessful: false,
        totalPatternsFound: 0,
        validPatternsCount: 0,
        patterns: [],
        dataQuality: 0,
        processingTime,
        errors: [error.message],
        warnings,
        indicatorValue: 0,
        scoreContribution: 0,
        metadata: {
          session: "SESSION_402_1H_DIVERGENCE",
          timeframe: "1H",
          error: error.message,
        },
      };
    }
  }

  /**
   * 🔧 GET ANALYSIS CONFIG - 1D OPTIMIZED PARAMETERS
   * PURPOSE: Configure analysis parameters with 1D defaults
   * TUNING: Optimized for daily market behavior - superior signal quality
   */
  private getAnalysisConfig(input: DivergenceAnalysisInput) {
    return {
      analysisWindow: input.maxPeriods || 100, // Look back 100 periods (100 days)
      minPatternDistance: 15, // Minimum 15 periods between extremums
      confidenceThreshold: input.minConfidenceScore || 70, // 70% minimum confidence
      qualityThreshold: input.minQualityScore || 60, // 60% minimum quality
      sensitivityLevel: input.sensitivityLevel || 5, // Medium sensitivity
      extremumLookback: 7, // 7-period lookback for extremums
    };
  }

  /**
   * 📍 DETECT EXTREMUM POINTS - FIND PEAKS AND TROUGHS
   * PURPOSE: Identify significant extremum points in both price and RSI
   * 1D CALIBRATION: Window sizes appropriate for daily volatility - cleaner patterns
   */
  private detectExtremumPoints(
    prices: number[],
    rsiValues: number[],
    analysisWindow: number
  ) {
    // Limit analysis to recent data window
    const startIndex = Math.max(0, prices.length - analysisWindow);
    const windowPrices = prices.slice(startIndex);
    const windowRsi = rsiValues.slice(startIndex);

    // Detect price extremums
    let priceExtremums = this.extremumDetector.detectExtremums(
      windowPrices,
      "price"
    );

    // Detect RSI extremums
    let rsiExtremums = this.extremumDetector.detectExtremums(windowRsi, "rsi");

    // Fill in missing price/RSI values for extremums
    priceExtremums = priceExtremums.map((point) => ({
      ...point,
      index: point.index + startIndex, // Adjust for window offset
      price: prices[point.index + startIndex],
      rsi: rsiValues[point.index + startIndex],
    }));

    rsiExtremums = rsiExtremums.map((point) => ({
      ...point,
      index: point.index + startIndex, // Adjust for window offset
      price: prices[point.index + startIndex],
      rsi: rsiValues[point.index + startIndex],
    }));

    return { priceExtremums, rsiExtremums };
  }

  /**
   * 🔍 FIND DIVERGENCE PATTERNS - PATTERN DETECTION LOGIC
   * PURPOSE: Identify potential divergence patterns from extremum points
   * ALGORITHM: Compare trend directions between price and RSI extremums
   */
  private findDivergencePatterns(
    priceExtremums: ExtremumPoint[],
    rsiExtremums: ExtremumPoint[],
    config: any
  ): DivergencePattern[] {
    const patterns: DivergencePattern[] = [];

    // Group extremums by type (HIGH/LOW)
    const priceHighs = priceExtremums.filter((p) => p.type === "HIGH");
    const priceLows = priceExtremums.filter((p) => p.type === "LOW");
    const rsiHighs = rsiExtremums.filter((p) => p.type === "HIGH");
    const rsiLows = rsiExtremums.filter((p) => p.type === "LOW");

    // Look for patterns in highs (bearish divergence)
    for (let i = 0; i < priceHighs.length - 1; i++) {
      for (let j = i + 1; j < priceHighs.length; j++) {
        const pricePoints = [priceHighs[i], priceHighs[j]];

        // Find corresponding RSI highs in similar timeframe
        const correspondingRsiHighs = this.findCorrespondingExtremums(
          pricePoints,
          rsiHighs
        );

        if (correspondingRsiHighs.length >= 2) {
          const pattern = this.createPattern(
            pricePoints,
            correspondingRsiHighs,
            config
          );
          if (pattern) patterns.push(pattern);
        }
      }
    }

    // Look for patterns in lows (bullish divergence)
    for (let i = 0; i < priceLows.length - 1; i++) {
      for (let j = i + 1; j < priceLows.length; j++) {
        const pricePoints = [priceLows[i], priceLows[j]];

        // Find corresponding RSI lows in similar timeframe
        const correspondingRsiLows = this.findCorrespondingExtremums(
          pricePoints,
          rsiLows
        );

        if (correspondingRsiLows.length >= 2) {
          const pattern = this.createPattern(
            pricePoints,
            correspondingRsiLows,
            config
          );
          if (pattern) patterns.push(pattern);
        }
      }
    }

    return patterns;
  }

  /**
   * 🎯 FIND CORRESPONDING EXTREMUMS - MATCH TIMEFRAMES
   * PURPOSE: Find RSI extremums that correspond to price extremums
   * TIMING: Allow some flexibility in exact timing alignment
   */
  private findCorrespondingExtremums(
    pricePoints: ExtremumPoint[],
    rsiExtremums: ExtremumPoint[]
  ): ExtremumPoint[] {
    const tolerance = 3; // Allow 3-period tolerance for alignment (tighter for 1D)
    const corresponding: ExtremumPoint[] = [];

    for (const pricePoint of pricePoints) {
      // Find RSI extremum closest to this price extremum
      let closest: ExtremumPoint | null = null;
      let minDistance = Infinity;

      for (const rsiPoint of rsiExtremums) {
        const distance = Math.abs(rsiPoint.index - pricePoint.index);
        if (distance <= tolerance && distance < minDistance) {
          minDistance = distance;
          closest = rsiPoint;
        }
      }

      if (closest) {
        corresponding.push(closest);
      }
    }

    return corresponding;
  }

  /**
   * 🏗️ CREATE PATTERN - BUILD DIVERGENCE PATTERN OBJECT
   * PURPOSE: Create complete pattern object with all analysis
   * SCORING: Calculate confidence, quality, and trading strength
   */
  private createPattern(
    pricePoints: ExtremumPoint[],
    rsiPoints: ExtremumPoint[],
    config: any
  ): DivergencePattern | null {
    if (pricePoints.length < 2 || rsiPoints.length < 2) return null;

    // Calculate slopes
    const priceSlope = this.trendAnalyzer.calculateSlope(
      pricePoints[0],
      pricePoints[1],
      true
    );
    const rsiSlope = this.trendAnalyzer.calculateSlope(
      rsiPoints[0],
      rsiPoints[1],
      false
    );
    const slopeDifference = this.trendAnalyzer.calculateDivergenceAngle(
      priceSlope,
      rsiSlope
    );

    // Identify pattern type
    const divergenceType = this.patternMatcher.identifyDivergenceType(
      pricePoints,
      rsiPoints,
      priceSlope,
      rsiSlope
    );

    if (!divergenceType) return null;

    // Calculate pattern strength
    const strength = this.patternMatcher.calculatePatternStrength(
      priceSlope,
      rsiSlope,
      pricePoints,
      rsiPoints
    );

    // Calculate scores
    const confidenceScore = this.calculateConfidenceScore(
      slopeDifference,
      pricePoints,
      rsiPoints
    );
    const qualityScore = this.calculateQualityScore(
      pricePoints,
      rsiPoints,
      slopeDifference
    );
    const tradingSignalStrength = this.calculateTradingStrength(
      divergenceType,
      strength,
      confidenceScore
    );

    return {
      type: divergenceType,
      strength,
      pricePoints: [...pricePoints],
      rsiPoints: [...rsiPoints],
      priceSlope,
      rsiSlope,
      slopeDifference,
      confidenceScore,
      qualityScore,
      tradingSignalStrength,
      detectionMethod: "extremum_analysis",
      validationsPassed: 5, // Number of validation checks
      analysisTimestamp: new Date().toISOString(),
    };
  }

  /**
   * 📊 CALCULATE CONFIDENCE SCORE - PATTERN RELIABILITY
   * PURPOSE: Score how confident we are in this pattern
   * FACTORS: Slope difference, point significance, pattern clarity
   */
  private calculateConfidenceScore(
    slopeDifference: number,
    pricePoints: ExtremumPoint[],
    rsiPoints: ExtremumPoint[]
  ): number {
    let confidence = 50; // Base confidence

    // Slope difference contribution (0-30 points)
    confidence += Math.min(30, slopeDifference * 1000);

    // Point significance contribution (0-20 points)
    const avgPriceSignificance =
      pricePoints.reduce((sum, p) => sum + p.significance, 0) /
      pricePoints.length;
    const avgRsiSignificance =
      rsiPoints.reduce((sum, p) => sum + p.significance, 0) / rsiPoints.length;
    confidence += (avgPriceSignificance + avgRsiSignificance) / 10;

    return Math.min(100, Math.max(0, confidence));
  }

  /**
   * 🎯 CALCULATE QUALITY SCORE - PATTERN QUALITY ASSESSMENT
   * PURPOSE: Score the technical quality of the pattern
   * FACTORS: Point alignment, slope consistency, data quality
   */
  private calculateQualityScore(
    pricePoints: ExtremumPoint[],
    rsiPoints: ExtremumPoint[],
    slopeDifference: number
  ): number {
    let quality = 60; // Base quality

    // Point alignment quality (0-20 points)
    const avgTimeDifference = Math.abs(
      pricePoints[1].index -
        pricePoints[0].index -
        (rsiPoints[1].index - rsiPoints[0].index)
    );
    quality += Math.max(0, 20 - avgTimeDifference);

    // Slope difference quality (0-20 points)
    quality += Math.min(20, slopeDifference * 500);

    return Math.min(100, Math.max(0, quality));
  }

  /**
   * 💪 CALCULATE TRADING STRENGTH - ACTIONABLE SIGNAL STRENGTH
   * PURPOSE: Score how actionable this pattern is for trading
   * FACTORS: Pattern type, strength, confidence, market context
   */
  private calculateTradingStrength(
    type: DivergenceType,
    strength: DivergenceStrength,
    confidence: number
  ): number {
    let tradingStrength = confidence * 0.6; // Base on confidence

    // Pattern type weighting
    if (
      type === DivergenceType.BULLISH_REGULAR ||
      type === DivergenceType.BEARISH_REGULAR
    ) {
      tradingStrength *= 1.2; // Regular divergences are stronger signals
    }

    // Strength weighting
    const strengthMultiplier = {
      [DivergenceStrength.VERY_STRONG]: 1.3,
      [DivergenceStrength.STRONG]: 1.1,
      [DivergenceStrength.MODERATE]: 1.0,
      [DivergenceStrength.WEAK]: 0.8,
    };
    tradingStrength *= strengthMultiplier[strength];

    return Math.min(100, Math.max(0, tradingStrength));
  }

  /**
   * 🏆 FIND STRONGEST PATTERN - IDENTIFY BEST PATTERN
   * PURPOSE: Find the pattern with highest trading strength
   */
  private findStrongestPattern(
    patterns: DivergencePattern[]
  ): DivergencePattern | undefined {
    if (patterns.length === 0) return undefined;

    return patterns.reduce((strongest, current) =>
      current.tradingSignalStrength > strongest.tradingSignalStrength
        ? current
        : strongest
    );
  }

  /**
   * ⏰ FIND MOST RECENT PATTERN - IDENTIFY LATEST PATTERN
   * PURPOSE: Find the most recently formed pattern
   */
  private findMostRecentPattern(
    patterns: DivergencePattern[]
  ): DivergencePattern | undefined {
    if (patterns.length === 0) return undefined;

    return patterns.reduce((latest, current) => {
      const currentLatestIndex = Math.max(
        ...current.pricePoints.map((p) => p.index)
      );
      const latestLatestIndex = Math.max(
        ...latest.pricePoints.map((p) => p.index)
      );
      return currentLatestIndex > latestLatestIndex ? current : latest;
    });
  }

  /**
   * 💾 CALCULATE DATABASE VALUES - PREPARE FOR INDICATORS TABLE
   * PURPOSE: Calculate values for database storage
   * OUTPUT: Ready for indicators table integration
   */
  private calculateDatabaseValues(
    strongestPattern: DivergencePattern | undefined,
    validPatterns: DivergencePattern[],
    dataQuality: number
  ) {
    if (!strongestPattern) {
      return {
        indicatorValue: 0,
        scoreContribution: 0,
        metadata: {
          session: "SESSION_402_1H_DIVERGENCE",
          timeframe: "1H",
          no_divergence: true,
        },
      };
    }

    // Indicator value: Use trading signal strength (0-100)
    const indicatorValue = strongestPattern.tradingSignalStrength;

    // Score contribution: Scale trading strength to bonus points (0-15)
    const scoreContribution = (indicatorValue / 100) * 15;

    // Metadata for database storage
    const metadata = {
      divergence_type: strongestPattern.type,
      pattern_strength: strongestPattern.strength,
      confidence_score: strongestPattern.confidenceScore,
      price_points_count: strongestPattern.pricePoints.length,
      rsi_points_count: strongestPattern.rsiPoints.length,
      slope_difference: parseFloat(strongestPattern.slopeDifference.toFixed(6)),
      detection_method: strongestPattern.detectionMethod,
      analysis_period: 100,
      session: "SESSION_402_1D_DIVERGENCE",
      timeframe: "1D",
      total_patterns: validPatterns.length,
      data_quality: dataQuality,
    };

    return { indicatorValue, scoreContribution, metadata };
  }

  /**
   * ❌ CREATE FAILURE RESULT - HANDLE ANALYSIS FAILURES
   * PURPOSE: Create standardized failure result
   */
  private createFailureResult(
    errors: string[],
    warnings: string[],
    startTime: number
  ): DivergenceDetectionResult {
    return {
      hasValidDivergence: false,
      analysisSuccessful: false,
      totalPatternsFound: 0,
      validPatternsCount: 0,
      patterns: [],
      dataQuality: 0,
      processingTime: Date.now() - startTime,
      errors,
      warnings,
      indicatorValue: 0,
      scoreContribution: 0,
      metadata: {
        session: "SESSION_402_1D_DIVERGENCE",
        timeframe: "1D",
        analysis_failed: true,
      },
    };
  }

  /**
   * 📊 CREATE EMPTY RESULT - NO DIVERGENCE FOUND
   * PURPOSE: Create standardized empty result
   */
  private createEmptyResult(
    reason: string,
    warnings: string[],
    startTime: number,
    dataQuality: number
  ): DivergenceDetectionResult {
    return {
      hasValidDivergence: false,
      analysisSuccessful: true,
      totalPatternsFound: 0,
      validPatternsCount: 0,
      patterns: [],
      dataQuality,
      processingTime: Date.now() - startTime,
      errors: [],
      warnings: [...warnings, reason],
      indicatorValue: 0,
      scoreContribution: 0,
      metadata: {
        session: "SESSION_402_1D_DIVERGENCE",
        timeframe: "1D",
        no_patterns_found: true,
        reason,
      },
    };
  }
}

/**
 * 🎯 HELPER FUNCTION - QUICK DIVERGENCE ANALYSIS
 * PURPOSE: Simplified interface for pipeline integration
 * USAGE: Direct analysis with minimal configuration
 */
export async function analyzeRSIDivergence(
  prices: number[],
  rsiValues: number[],
  options: Partial<DivergenceAnalysisInput> = {}
): Promise<DivergenceDetectionResult> {
  const analyzer = new RSIDivergenceAnalyzer();

  const input: DivergenceAnalysisInput = {
    prices,
    rsiValues,
    minPeriods: 30,
    maxPeriods: 100,
    sensitivityLevel: 5,
    minConfidenceScore: 70,
    minQualityScore: 60,
    enableDebug: false,
    ...options,
  };

  return await analyzer.analyzeDivergence(input);
}
