// ===================================================================
// PROFESSIONAL SCORING ENGINE - Fixed for Kurzora Integration
// ===================================================================
// File: src/lib/signals/scoring-engine.ts
// Size: ~34KB Professional-grade multi-timeframe scoring algorithm
// Fixed: Import/export conflicts, Polygon.io timeframe mapping, undefined property errors

// ✅ FIXED: Proper TypeScript interface exports
export interface TimeframeScore {
  rsi: { score: number; weight: number; contribution: number };
  macd: { score: number; weight: number; contribution: number };
  bollingerBands: { score: number; weight: number; contribution: number };
  volume: { score: number; weight: number; contribution: number };
  momentum: { score: number; weight: number; contribution: number };
  total: number;
  confidence: number;
  timeframe: string;
}

export interface SignalScoreBreakdown {
  ticker: string;
  finalScore: number;
  signalType: "bullish" | "bearish" | "neutral";
  strength: "strong" | "valid" | "weak";
  timeframeScores: Record<string, TimeframeScore>;
  confluence: {
    agreements: number;
    disagreements: number;
    neutrals: number;
    overallConfidence: number;
  };
  riskReward: {
    entryPrice: number;
    stopLoss: number;
    takeProfit: number;
    riskRewardRatio: number;
  };
  metadata: {
    timestamp: Date;
    marketCondition: "trending" | "ranging" | "volatile";
    volatility: number;
    volumeProfile: "high" | "medium" | "low";
    dataQuality: "excellent" | "good" | "fair" | "limited";
  };
}

export interface IndicatorValues {
  rsi: number;
  macd: {
    macd: number;
    signal: number;
    histogram: number;
  };
  bollingerBands: {
    upper: number;
    middle: number;
    lower: number;
    percentB: number;
    bandwidth: number;
  };
  ema: {
    ema20: number;
    ema50: number;
    trend: "bullish" | "bearish" | "neutral";
  };
  volume: {
    current: number;
    average: number;
    ratio: number;
    trend: "high" | "medium" | "low";
  };
  supportResistance: {
    support: number;
    resistance: number;
    position: "near_support" | "near_resistance" | "middle" | "breakout";
  };
}

// ✅ FIXED: Polygon.io Timeframe Mapping
export interface PolygonTimeframe {
  name: string; // "1H", "4H", "1D", "1W"
  multiplier: number; // 1, 4, 1, 1
  timespan: string; // "hour", "hour", "day", "week"
  weight: number; // 0.40, 0.30, 0.20, 0.10
  minDataPoints: number; // Minimum data points needed
  description: string;
}

// ✅ FIXED: Professional Scoring Engine Class with proper exports
export class ScoringEngine {
  // Professional indicator weights (institutional grade)
  private readonly indicatorWeights = {
    rsi: 0.25, // 25% - Momentum
    macd: 0.25, // 25% - Trend following
    bollingerBands: 0.2, // 20% - Volatility
    volume: 0.2, // 20% - Confirmation
    momentum: 0.1, // 10% - Price action
  };

  // ✅ FIXED: Polygon.io compatible timeframe configuration
  private readonly timeframes: Record<string, PolygonTimeframe> = {
    "1H": {
      name: "1H",
      multiplier: 1,
      timespan: "hour",
      weight: 0.4,
      minDataPoints: 50,
      description: "Short-term momentum and entries",
    },
    "4H": {
      name: "4H",
      multiplier: 4,
      timespan: "hour",
      weight: 0.3,
      minDataPoints: 50,
      description: "Medium-term trend confirmation",
    },
    "1D": {
      name: "1D",
      multiplier: 1,
      timespan: "day",
      weight: 0.2,
      minDataPoints: 100,
      description: "Long-term trend analysis",
    },
    "1W": {
      name: "1W",
      multiplier: 1,
      timespan: "week",
      weight: 0.1,
      minDataPoints: 52,
      description: "Macro trend validation",
    },
  };

  // ✅ FIXED: Constructor with proper initialization
  constructor() {
    // Validate timeframe weights sum to 1.0
    const totalWeight = Object.values(this.timeframes).reduce(
      (sum, tf) => sum + tf.weight,
      0
    );
    if (Math.abs(totalWeight - 1.0) > 0.001) {
      throw new Error(`Timeframe weights must sum to 1.0, got ${totalWeight}`);
    }
  }

  // ✅ FIXED: Main scoring method with proper error handling
  public async calculateSignalScore(
    ticker: string,
    indicators: Record<string, IndicatorValues>
  ): Promise<SignalScoreBreakdown> {
    try {
      // Validate input data
      if (!ticker || typeof ticker !== "string") {
        throw new Error("Invalid ticker provided");
      }

      if (!indicators || typeof indicators !== "object") {
        throw new Error("Invalid indicators data provided");
      }

      // Calculate scores for each timeframe
      const timeframeScores: Record<string, TimeframeScore> = {};
      let validTimeframes = 0;

      for (const [timeframeName, timeframeConfig] of Object.entries(
        this.timeframes
      )) {
        const timeframeIndicators = indicators[timeframeName];

        if (
          timeframeIndicators &&
          this.validateIndicatorData(timeframeIndicators)
        ) {
          timeframeScores[timeframeName] = this.calculateTimeframeScore(
            timeframeIndicators,
            timeframeConfig
          );
          validTimeframes++;
        } else {
          console.warn(
            `${ticker}: Insufficient data for ${timeframeName} timeframe`
          );
          // Use neutral score for missing timeframes
          timeframeScores[timeframeName] =
            this.createNeutralTimeframeScore(timeframeConfig);
        }
      }

      // Ensure we have at least 2 valid timeframes for reliable scoring
      if (validTimeframes < 2) {
        console.warn(
          `${ticker}: Only ${validTimeframes} valid timeframes, using conservative scoring`
        );
      }

      // Calculate final weighted score
      const finalScore = this.calculateFinalScore(timeframeScores);

      // Determine signal characteristics
      const signalType = this.determineSignalType(finalScore, timeframeScores);
      const strength = this.determineSignalStrength(
        finalScore,
        validTimeframes
      );
      const confluence = this.calculateConfluence(timeframeScores);
      const riskReward = this.calculateRiskReward(finalScore, indicators);

      // Generate metadata
      const metadata = {
        timestamp: new Date(),
        marketCondition: this.determineMarketCondition(timeframeScores),
        volatility: this.calculateVolatility(indicators),
        volumeProfile: this.determineVolumeProfile(indicators),
        dataQuality: this.assessDataQuality(validTimeframes, indicators),
      };

      return {
        ticker,
        finalScore,
        signalType,
        strength,
        timeframeScores,
        confluence,
        riskReward,
        metadata,
      };
    } catch (error) {
      console.error(`ScoringEngine error for ${ticker}:`, error);
      throw new Error(
        `Failed to calculate signal score for ${ticker}: ${error.message}`
      );
    }
  }

  // ✅ FIXED: Timeframe score calculation with proper validation
  private calculateTimeframeScore(
    indicators: IndicatorValues,
    timeframe: PolygonTimeframe
  ): TimeframeScore {
    try {
      // RSI Score (0-100)
      const rsiScore = this.calculateRSIScore(indicators.rsi);
      const rsiContribution = rsiScore * this.indicatorWeights.rsi;

      // MACD Score (0-100)
      const macdScore = this.calculateMACDScore(indicators.macd);
      const macdContribution = macdScore * this.indicatorWeights.macd;

      // Bollinger Bands Score (0-100)
      const bbScore = this.calculateBollingerBandsScore(
        indicators.bollingerBands
      );
      const bbContribution = bbScore * this.indicatorWeights.bollingerBands;

      // Volume Score (0-100)
      const volumeScore = this.calculateVolumeScore(indicators.volume);
      const volumeContribution = volumeScore * this.indicatorWeights.volume;

      // Momentum Score (0-100) - based on EMA relationship
      const momentumScore = this.calculateMomentumScore(indicators.ema);
      const momentumContribution =
        momentumScore * this.indicatorWeights.momentum;

      // Total weighted score
      const total =
        rsiContribution +
        macdContribution +
        bbContribution +
        volumeContribution +
        momentumContribution;

      // Confidence based on indicator agreement
      const confidence = this.calculateIndicatorConfidence([
        rsiScore,
        macdScore,
        bbScore,
        volumeScore,
        momentumScore,
      ]);

      return {
        rsi: {
          score: rsiScore,
          weight: this.indicatorWeights.rsi,
          contribution: rsiContribution,
        },
        macd: {
          score: macdScore,
          weight: this.indicatorWeights.macd,
          contribution: macdContribution,
        },
        bollingerBands: {
          score: bbScore,
          weight: this.indicatorWeights.bollingerBands,
          contribution: bbContribution,
        },
        volume: {
          score: volumeScore,
          weight: this.indicatorWeights.volume,
          contribution: volumeContribution,
        },
        momentum: {
          score: momentumScore,
          weight: this.indicatorWeights.momentum,
          contribution: momentumContribution,
        },
        total: Math.round(total),
        confidence: Math.round(confidence),
        timeframe: timeframe.name,
      };
    } catch (error) {
      console.error(`Error calculating ${timeframe.name} score:`, error);
      return this.createNeutralTimeframeScore(timeframe);
    }
  }

  // ✅ PROFESSIONAL: RSI Scoring Algorithm
  private calculateRSIScore(rsi: number): number {
    if (typeof rsi !== "number" || isNaN(rsi) || rsi < 0 || rsi > 100) {
      return 50; // Neutral score for invalid RSI
    }

    // Professional RSI interpretation
    if (rsi <= 20) return 95; // Extremely oversold - strong buy
    if (rsi <= 30) return 85; // Oversold - buy
    if (rsi <= 35) return 75; // Moderately oversold - bullish
    if (rsi <= 45) return 65; // Below neutral - slightly bullish
    if (rsi <= 55) return 50; // Neutral zone
    if (rsi <= 65) return 40; // Above neutral - slightly bearish
    if (rsi <= 70) return 30; // Moderately overbought - bearish
    if (rsi <= 80) return 20; // Overbought - sell
    return 10; // Extremely overbought - strong sell
  }

  // ✅ PROFESSIONAL: MACD Scoring Algorithm
  private calculateMACDScore(macd: {
    macd: number;
    signal: number;
    histogram: number;
  }): number {
    if (
      !macd ||
      typeof macd.macd !== "number" ||
      typeof macd.signal !== "number" ||
      typeof macd.histogram !== "number"
    ) {
      return 50; // Neutral score for invalid MACD
    }

    let score = 50; // Base neutral score

    // MACD Line vs Signal Line
    const macdDiff = macd.macd - macd.signal;
    if (macdDiff > 0) {
      score += Math.min(25, macdDiff * 1000); // Bullish when MACD > Signal
    } else {
      score += Math.max(-25, macdDiff * 1000); // Bearish when MACD < Signal
    }

    // Histogram momentum
    if (macd.histogram > 0) {
      score += Math.min(15, macd.histogram * 500); // Increasing momentum
    } else {
      score += Math.max(-15, macd.histogram * 500); // Decreasing momentum
    }

    // Zero line cross consideration
    if (macd.macd > 0 && macd.signal > 0) {
      score += 10; // Both above zero line - bullish
    } else if (macd.macd < 0 && macd.signal < 0) {
      score -= 10; // Both below zero line - bearish
    }

    return Math.max(0, Math.min(100, Math.round(score)));
  }

  // ✅ PROFESSIONAL: Bollinger Bands Scoring Algorithm
  private calculateBollingerBandsScore(bb: {
    upper: number;
    middle: number;
    lower: number;
    percentB: number;
    bandwidth: number;
  }): number {
    if (!bb || typeof bb.percentB !== "number" || isNaN(bb.percentB)) {
      return 50; // Neutral score for invalid Bollinger Bands
    }

    let score = 50; // Base neutral score

    // %B interpretation (where price is relative to bands)
    if (bb.percentB <= 0) {
      score = 90; // Below lower band - oversold, very bullish
    } else if (bb.percentB <= 0.2) {
      score = 80; // Near lower band - oversold, bullish
    } else if (bb.percentB <= 0.3) {
      score = 70; // Below lower third - moderately bullish
    } else if (bb.percentB <= 0.7) {
      score = 50; // Middle zone - neutral
    } else if (bb.percentB <= 0.8) {
      score = 30; // Above upper third - moderately bearish
    } else if (bb.percentB <= 1.0) {
      score = 20; // Near upper band - overbought, bearish
    } else {
      score = 10; // Above upper band - very overbought, very bearish
    }

    // Bandwidth adjustment (volatility consideration)
    if (bb.bandwidth && typeof bb.bandwidth === "number") {
      if (bb.bandwidth < 0.1) {
        // Low volatility - squeeze situation, potential breakout
        score = 60; // Slightly bullish for potential expansion
      } else if (bb.bandwidth > 0.3) {
        // High volatility - reduce confidence
        score = score * 0.9;
      }
    }

    return Math.max(0, Math.min(100, Math.round(score)));
  }

  // ✅ PROFESSIONAL: Volume Scoring Algorithm
  private calculateVolumeScore(volume: {
    current: number;
    average: number;
    ratio: number;
    trend: string;
  }): number {
    if (
      !volume ||
      typeof volume.ratio !== "number" ||
      isNaN(volume.ratio) ||
      volume.ratio <= 0
    ) {
      return 50; // Neutral score for invalid volume data
    }

    let score = 50; // Base neutral score

    // Volume ratio interpretation
    if (volume.ratio >= 3.0) {
      score = 95; // Extremely high volume - very bullish
    } else if (volume.ratio >= 2.0) {
      score = 85; // Very high volume - bullish
    } else if (volume.ratio >= 1.5) {
      score = 75; // High volume - moderately bullish
    } else if (volume.ratio >= 1.2) {
      score = 65; // Above average volume - slightly bullish
    } else if (volume.ratio >= 0.8) {
      score = 50; // Normal volume - neutral
    } else if (volume.ratio >= 0.5) {
      score = 40; // Below average volume - slightly bearish
    } else {
      score = 30; // Low volume - bearish (lack of conviction)
    }

    // Volume trend adjustment
    if (volume.trend === "high") {
      score += 5; // Trending higher volume
    } else if (volume.trend === "low") {
      score -= 5; // Trending lower volume
    }

    return Math.max(0, Math.min(100, Math.round(score)));
  }

  // ✅ PROFESSIONAL: Momentum Scoring Algorithm (EMA-based)
  private calculateMomentumScore(ema: {
    ema20: number;
    ema50: number;
    trend: string;
  }): number {
    if (
      !ema ||
      typeof ema.ema20 !== "number" ||
      typeof ema.ema50 !== "number" ||
      isNaN(ema.ema20) ||
      isNaN(ema.ema50)
    ) {
      return 50; // Neutral score for invalid EMA data
    }

    let score = 50; // Base neutral score

    // EMA relationship (short vs long term trend)
    const emaDiff = ((ema.ema20 - ema.ema50) / ema.ema50) * 100; // Percentage difference

    if (emaDiff >= 5) {
      score = 90; // Strong uptrend - very bullish
    } else if (emaDiff >= 2) {
      score = 80; // Moderate uptrend - bullish
    } else if (emaDiff >= 0.5) {
      score = 70; // Weak uptrend - moderately bullish
    } else if (emaDiff >= -0.5) {
      score = 50; // Sideways - neutral
    } else if (emaDiff >= -2) {
      score = 30; // Weak downtrend - moderately bearish
    } else if (emaDiff >= -5) {
      score = 20; // Moderate downtrend - bearish
    } else {
      score = 10; // Strong downtrend - very bearish
    }

    // Trend consistency bonus
    if (ema.trend === "bullish" && emaDiff > 0) {
      score += 5; // Consistent bullish trend
    } else if (ema.trend === "bearish" && emaDiff < 0) {
      score -= 5; // Consistent bearish trend
    }

    return Math.max(0, Math.min(100, Math.round(score)));
  }

  // ✅ FIXED: Final score calculation with proper weighting
  private calculateFinalScore(
    timeframeScores: Record<string, TimeframeScore>
  ): number {
    let weightedTotal = 0;
    let totalWeight = 0;

    for (const [timeframeName, score] of Object.entries(timeframeScores)) {
      const timeframeConfig = this.timeframes[timeframeName];
      if (timeframeConfig && score.total !== undefined) {
        weightedTotal += score.total * timeframeConfig.weight;
        totalWeight += timeframeConfig.weight;
      }
    }

    if (totalWeight === 0) {
      return 50; // Neutral score if no valid timeframes
    }

    // Normalize if we don't have all timeframes
    const finalScore = weightedTotal / totalWeight;
    return Math.max(0, Math.min(100, Math.round(finalScore)));
  }

  // ✅ FIXED: Signal type determination
  private determineSignalType(
    score: number,
    timeframeScores: Record<string, TimeframeScore>
  ): "bullish" | "bearish" | "neutral" {
    if (score >= 70) {
      return "bullish";
    } else if (score <= 40) {
      return "bearish";
    } else {
      return "neutral";
    }
  }

  // ✅ FIXED: Signal strength determination
  private determineSignalStrength(
    score: number,
    validTimeframes: number
  ): "strong" | "valid" | "weak" {
    // Adjust strength based on data quality
    const qualityMultiplier = validTimeframes >= 3 ? 1.0 : 0.9;
    const adjustedScore = score * qualityMultiplier;

    if (adjustedScore >= 80) {
      return "strong";
    } else if (adjustedScore >= 70 || adjustedScore <= 30) {
      return "valid";
    } else {
      return "weak";
    }
  }

  // ✅ HELPER: Validate indicator data
  private validateIndicatorData(indicators: IndicatorValues): boolean {
    try {
      return (
        typeof indicators.rsi === "number" &&
        !isNaN(indicators.rsi) &&
        indicators.macd &&
        typeof indicators.macd.macd === "number" &&
        indicators.bollingerBands &&
        typeof indicators.bollingerBands.percentB === "number" &&
        indicators.volume &&
        typeof indicators.volume.ratio === "number" &&
        indicators.ema &&
        typeof indicators.ema.ema20 === "number"
      );
    } catch {
      return false;
    }
  }

  // ✅ HELPER: Create neutral timeframe score for missing data
  private createNeutralTimeframeScore(
    timeframe: PolygonTimeframe
  ): TimeframeScore {
    return {
      rsi: {
        score: 50,
        weight: this.indicatorWeights.rsi,
        contribution: 50 * this.indicatorWeights.rsi,
      },
      macd: {
        score: 50,
        weight: this.indicatorWeights.macd,
        contribution: 50 * this.indicatorWeights.macd,
      },
      bollingerBands: {
        score: 50,
        weight: this.indicatorWeights.bollingerBands,
        contribution: 50 * this.indicatorWeights.bollingerBands,
      },
      volume: {
        score: 50,
        weight: this.indicatorWeights.volume,
        contribution: 50 * this.indicatorWeights.volume,
      },
      momentum: {
        score: 50,
        weight: this.indicatorWeights.momentum,
        contribution: 50 * this.indicatorWeights.momentum,
      },
      total: 50,
      confidence: 30, // Lower confidence for neutral/missing data
      timeframe: timeframe.name,
    };
  }

  // ✅ HELPER: Calculate indicator confidence
  private calculateIndicatorConfidence(scores: number[]): number {
    if (scores.length === 0) return 30;

    const avg = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const variance =
      scores.reduce((sum, score) => sum + Math.pow(score - avg, 2), 0) /
      scores.length;
    const stdDev = Math.sqrt(variance);

    // Higher confidence when indicators agree (low standard deviation)
    const confidence = Math.max(30, Math.min(100, 100 - stdDev * 2));
    return Math.round(confidence);
  }

  // ✅ HELPER: Calculate confluence between timeframes
  private calculateConfluence(
    timeframeScores: Record<string, TimeframeScore>
  ): any {
    const scores = Object.values(timeframeScores).map((ts) => ts.total);
    let agreements = 0;
    let disagreements = 0;
    let neutrals = 0;

    for (const score of scores) {
      if (score >= 60) agreements++;
      else if (score <= 40) disagreements++;
      else neutrals++;
    }

    const total = scores.length;
    const overallConfidence =
      total > 0 ? Math.round((agreements / total) * 100) : 50;

    return { agreements, disagreements, neutrals, overallConfidence };
  }

  // ✅ HELPER: Calculate risk/reward ratios
  private calculateRiskReward(
    score: number,
    indicators: Record<string, IndicatorValues>
  ): any {
    // Use 1D timeframe for risk/reward calculation (most stable)
    const dailyIndicators = indicators["1D"];
    if (!dailyIndicators || !dailyIndicators.bollingerBands) {
      return {
        entryPrice: 0,
        stopLoss: 0,
        takeProfit: 0,
        riskRewardRatio: 2.0,
      };
    }

    const currentPrice = dailyIndicators.bollingerBands.middle; // Use SMA as proxy for current price
    const stopLoss = currentPrice * 0.95; // 5% stop loss
    const targetMultiplier = 1 + (score - 50) * 0.001; // Dynamic target based on score
    const takeProfit = currentPrice * targetMultiplier;
    const riskRewardRatio =
      (takeProfit - currentPrice) / (currentPrice - stopLoss);

    return {
      entryPrice: Math.round(currentPrice * 100) / 100,
      stopLoss: Math.round(stopLoss * 100) / 100,
      takeProfit: Math.round(takeProfit * 100) / 100,
      riskRewardRatio: Math.round(riskRewardRatio * 100) / 100,
    };
  }

  // ✅ HELPER: Determine market condition
  private determineMarketCondition(
    timeframeScores: Record<string, TimeframeScore>
  ): "trending" | "ranging" | "volatile" {
    const scores = Object.values(timeframeScores).map((ts) => ts.total);
    const avg = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const variance =
      scores.reduce((sum, score) => sum + Math.pow(score - avg, 2), 0) /
      scores.length;

    if (variance > 400) return "volatile";
    if (avg > 60 || avg < 40) return "trending";
    return "ranging";
  }

  // ✅ HELPER: Calculate volatility
  private calculateVolatility(
    indicators: Record<string, IndicatorValues>
  ): number {
    const dailyIndicators = indicators["1D"];
    if (
      dailyIndicators &&
      dailyIndicators.bollingerBands &&
      dailyIndicators.bollingerBands.bandwidth
    ) {
      return Math.round(dailyIndicators.bollingerBands.bandwidth * 100);
    }
    return 50; // Default volatility
  }

  // ✅ HELPER: Determine volume profile
  private determineVolumeProfile(
    indicators: Record<string, IndicatorValues>
  ): "high" | "medium" | "low" {
    const volumes = Object.values(indicators)
      .filter((ind) => ind.volume && ind.volume.ratio)
      .map((ind) => ind.volume.ratio);

    if (volumes.length === 0) return "medium";

    const avgVolume =
      volumes.reduce((sum, vol) => sum + vol, 0) / volumes.length;

    if (avgVolume >= 1.5) return "high";
    if (avgVolume >= 0.8) return "medium";
    return "low";
  }

  // ✅ HELPER: Assess data quality
  private assessDataQuality(
    validTimeframes: number,
    indicators: Record<string, IndicatorValues>
  ): "excellent" | "good" | "fair" | "limited" {
    if (validTimeframes >= 4) return "excellent";
    if (validTimeframes >= 3) return "good";
    if (validTimeframes >= 2) return "fair";
    return "limited";
  }

  // ✅ PUBLIC: Get timeframe configuration (for external use)
  public getTimeframeConfig(): Record<string, PolygonTimeframe> {
    return { ...this.timeframes };
  }

  // ✅ PUBLIC: Validate timeframe name
  public isValidTimeframe(timeframe: string): boolean {
    return timeframe in this.timeframes;
  }

  // ✅ PUBLIC: Get indicator weights (for external use)
  public getIndicatorWeights(): Record<string, number> {
    return { ...this.indicatorWeights };
  }
}

// ✅ FIXED: Default export for easy importing
export default ScoringEngine;
