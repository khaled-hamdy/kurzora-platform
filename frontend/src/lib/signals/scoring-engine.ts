// Enhanced Scoring Engine - Multi-Timeframe 0-100 Signal Scoring with Data Quality Integration
// File: src/lib/signals/scoring-engine.ts

import {
  TechnicalIndicators,
  RSIResult,
  MACDResult,
  EMAAnalysis,
  BollingerBandsResult,
  VolumeAnalysis,
  SupportResistanceAnalysis,
  PriceData,
  DataQuality,
} from "./technical-indicators";

export interface TimeframeScore {
  timeframe: string;
  rsiScore: number;
  macdScore: number;
  emaScore: number;
  bollingerScore: number;
  supportResistanceScore: number;
  volumeScore: number;
  compositeScore: number;
  confidence: number;
  dataQualityScore: number; // NEW: Overall data quality score for this timeframe
  dataQualityLevel: string; // NEW: Overall data quality level
  breakdown: {
    rsi: {
      score: number;
      weight: number;
      contribution: number;
      reason: string;
      dataQuality: DataQuality | null; // NEW: Data quality info
      qualityAdjustedContribution: number; // NEW: Quality-weighted contribution
    };
    macd: {
      score: number;
      weight: number;
      contribution: number;
      reason: string;
      dataQuality: DataQuality | null;
      qualityAdjustedContribution: number;
    };
    ema: {
      score: number;
      weight: number;
      contribution: number;
      reason: string;
      dataQuality: DataQuality | null;
      qualityAdjustedContribution: number;
    };
    bollinger: {
      score: number;
      weight: number;
      contribution: number;
      reason: string;
      dataQuality: DataQuality | null;
      qualityAdjustedContribution: number;
    };
    supportResistance: {
      score: number;
      weight: number;
      contribution: number;
      reason: string;
      dataQuality: DataQuality | null;
      qualityAdjustedContribution: number;
    };
    volume: {
      score: number;
      weight: number;
      contribution: number;
      reason: string;
      dataQuality: DataQuality | null;
      qualityAdjustedContribution: number;
    };
  };
}

export interface FinalSignalScore {
  ticker: string;
  finalScore: number;
  signalStrength:
    | "STRONG_BUY"
    | "BUY"
    | "WEAK_BUY"
    | "NEUTRAL"
    | "WEAK_SELL"
    | "SELL"
    | "STRONG_SELL";
  timeframeScores: Record<string, TimeframeScore>;
  confidence: number;
  dataQualityScore: number; // NEW: Overall data quality across all timeframes
  dataQualityLevel: string; // NEW: Overall data quality level
  recommendation: string;
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  riskRewardRatio: number;
  expiresAt: Date;
  analysis: string;
}

export class ScoringEngine {
  // Indicator weights (must sum to 1.0) - INDUSTRY STANDARD PRESERVED
  private indicatorWeights = {
    rsi: 0.25, // 25% - Most important for momentum
    macd: 0.25, // 25% - Trend confirmation
    ema: 0.2, // 20% - Trend direction
    bollinger: 0.15, // 15% - Volatility and breakouts
    supportResistance: 0.1, // 10% - Key levels
    volume: 0.05, // 5% - Confirmation
  };

  // Timeframe weights (must sum to 1.0) - INDUSTRY STANDARD PRESERVED
  private timeframeWeights = {
    "1H": 0.4, // 40% - Most responsive
    "4H": 0.3, // 30% - Balance of speed/reliability
    "1D": 0.2, // 20% - Trend confirmation
    "1W": 0.1, // 10% - Long-term trend
  };

  // NEW: Data Quality Weight Multipliers
  private qualityMultipliers = {
    Excellent: 1.0, // Full weight
    Good: 0.9, // 90% weight
    Limited: 0.7, // 70% weight
    Insufficient: 0.0, // No weight
  };

  // Enhanced scoring with data quality integration
  private scoreRSI(rsi: RSIResult | null): {
    score: number;
    reason: string;
    dataQuality: DataQuality | null;
    qualityMultiplier: number;
  } {
    if (!rsi)
      return {
        score: 50,
        reason: "No RSI data available",
        dataQuality: null,
        qualityMultiplier: 0,
      };

    const qualityMultiplier =
      this.qualityMultipliers[rsi.dataQuality.level] || 0;

    let score = 50;
    let reason = "";

    // RSI scoring logic based on overbought/oversold conditions - INDUSTRY STANDARD PRESERVED
    if (rsi.value <= 20) {
      score = 95;
      reason = `Extremely oversold (${rsi.value.toFixed(
        1
      )}) - Strong buy opportunity`;
    } else if (rsi.value <= 30) {
      score = 85;
      reason = `Oversold (${rsi.value.toFixed(1)}) - Good buy opportunity`;
    } else if (rsi.value <= 40) {
      score = 75;
      reason = `Moderately oversold (${rsi.value.toFixed(1)}) - Bullish bias`;
    } else if (rsi.value <= 45) {
      score = 65;
      reason = `Slightly oversold (${rsi.value.toFixed(1)}) - Mild bullish`;
    } else if (rsi.value <= 55) {
      score = 50;
      reason = `Neutral zone (${rsi.value.toFixed(1)}) - No clear direction`;
    } else if (rsi.value <= 60) {
      score = 40;
      reason = `Slightly overbought (${rsi.value.toFixed(1)}) - Mild bearish`;
    } else if (rsi.value <= 70) {
      score = 30;
      reason = `Moderately overbought (${rsi.value.toFixed(1)}) - Bearish bias`;
    } else if (rsi.value <= 80) {
      score = 15;
      reason = `Overbought (${rsi.value.toFixed(1)}) - Sell opportunity`;
    } else {
      score = 5;
      reason = `Extremely overbought (${rsi.value.toFixed(
        1
      )}) - Strong sell signal`;
    }

    // Bonus for strong momentum signals
    if (rsi.strength === "strong") {
      score += 5;
      reason += " (Strong momentum)";
    }

    // Add data quality context to reason
    if (rsi.dataQuality.adaptive) {
      reason += ` [Adaptive analysis: ${rsi.dataQuality.level} quality]`;
    } else {
      reason += ` [${rsi.dataQuality.level} data quality]`;
    }

    return {
      score: Math.max(0, Math.min(100, score)),
      reason,
      dataQuality: rsi.dataQuality,
      qualityMultiplier,
    };
  }

  // Enhanced MACD scoring with data quality integration
  private scoreMACD(macd: MACDResult | null): {
    score: number;
    reason: string;
    dataQuality: DataQuality | null;
    qualityMultiplier: number;
  } {
    if (!macd)
      return {
        score: 50,
        reason: "No MACD data available",
        dataQuality: null,
        qualityMultiplier: 0,
      };

    const qualityMultiplier =
      this.qualityMultipliers[macd.dataQuality.level] || 0;

    let score = 50;
    let reason = "";

    // MACD scoring logic - INDUSTRY STANDARD PRESERVED
    if (macd.macd > macd.signal) {
      score += 25;
      reason = "MACD above signal line (bullish)";
    } else {
      score -= 25;
      reason = "MACD below signal line (bearish)";
    }

    if (macd.histogram > 0) {
      score += 15;
      reason += ", positive histogram (momentum up)";
    } else {
      score -= 15;
      reason += ", negative histogram (momentum down)";
    }

    if (macd.crossover === "bullish_crossover") {
      score += 20;
      reason += ", BULLISH CROSSOVER detected!";
    } else if (macd.crossover === "bearish_crossover") {
      score -= 20;
      reason += ", BEARISH CROSSOVER detected!";
    }

    if (macd.trend === "bullish") {
      score += 10;
      reason += ", bullish trend confirmed";
    } else if (macd.trend === "bearish") {
      score -= 10;
      reason += ", bearish trend confirmed";
    }

    // Add data quality context
    if (macd.dataQuality.adaptive) {
      reason += ` [Adaptive analysis: ${macd.dataQuality.level} quality]`;
    } else {
      reason += ` [${macd.dataQuality.level} data quality]`;
    }

    return {
      score: Math.max(0, Math.min(100, score)),
      reason,
      dataQuality: macd.dataQuality,
      qualityMultiplier,
    };
  }

  // Enhanced EMA scoring with data quality integration
  private scoreEMA(ema: EMAAnalysis | null): {
    score: number;
    reason: string;
    dataQuality: DataQuality | null;
    qualityMultiplier: number;
  } {
    if (!ema)
      return {
        score: 50,
        reason: "No EMA data available",
        dataQuality: null,
        qualityMultiplier: 0,
      };

    const qualityMultiplier =
      this.qualityMultipliers[ema.dataQuality.level] || 0;

    let score = 50;
    let reason = "";

    // EMA scoring logic - INDUSTRY STANDARD PRESERVED
    if (ema.pricePosition === "above_both") {
      score = 85;
      reason = `Price above both EMAs (${ema.ema20.toFixed(
        2
      )}, ${ema.ema50.toFixed(2)}) - Strong uptrend`;
    } else if (ema.pricePosition === "below_both") {
      score = 15;
      reason = `Price below both EMAs (${ema.ema20.toFixed(
        2
      )}, ${ema.ema50.toFixed(2)}) - Strong downtrend`;
    } else {
      score = 50;
      reason = `Price between EMAs - Consolidation phase`;
    }

    if (ema.emaAlignment === "bullish" && ema.pricePosition === "above_both") {
      score += 15;
      reason += ", EMAs aligned bullishly";
    } else if (
      ema.emaAlignment === "bearish" &&
      ema.pricePosition === "below_both"
    ) {
      score -= 15;
      reason += ", EMAs aligned bearishly";
    }

    if (ema.crossover === "golden_cross") {
      score = Math.max(score, 90);
      reason += ", GOLDEN CROSS - Major bullish signal!";
    } else if (ema.crossover === "death_cross") {
      score = Math.min(score, 10);
      reason += ", DEATH CROSS - Major bearish signal!";
    }

    if (ema.trend === "strong_bullish") {
      score += 5;
      reason += ", very strong bullish trend";
    } else if (ema.trend === "strong_bearish") {
      score -= 5;
      reason += ", very strong bearish trend";
    }

    // Add data quality context
    if (ema.dataQuality.adaptive) {
      reason += ` [Adaptive EMAs: ${ema.dataQuality.level} quality]`;
    } else {
      reason += ` [${ema.dataQuality.level} data quality]`;
    }

    return {
      score: Math.max(0, Math.min(100, score)),
      reason,
      dataQuality: ema.dataQuality,
      qualityMultiplier,
    };
  }

  // Enhanced Bollinger Bands scoring with data quality integration
  private scoreBollinger(bollinger: BollingerBandsResult | null): {
    score: number;
    reason: string;
    dataQuality: DataQuality | null;
    qualityMultiplier: number;
  } {
    if (!bollinger)
      return {
        score: 50,
        reason: "No Bollinger Bands data available",
        dataQuality: null,
        qualityMultiplier: 0,
      };

    const qualityMultiplier =
      this.qualityMultipliers[bollinger.dataQuality.level] || 0;

    let score = 50;
    let reason = "";

    // Bollinger Bands scoring logic - INDUSTRY STANDARD PRESERVED
    if (bollinger.percentB <= 0.1) {
      score = 90;
      reason = `Near lower band (%B: ${(bollinger.percentB * 100).toFixed(
        1
      )}%) - Oversold bounce expected`;
    } else if (bollinger.percentB <= 0.2) {
      score = 80;
      reason = `Below lower region (%B: ${(bollinger.percentB * 100).toFixed(
        1
      )}%) - Bullish opportunity`;
    } else if (bollinger.percentB <= 0.4) {
      score = 65;
      reason = `Lower half (%B: ${(bollinger.percentB * 100).toFixed(
        1
      )}%) - Slightly bullish`;
    } else if (bollinger.percentB <= 0.6) {
      score = 50;
      reason = `Middle zone (%B: ${(bollinger.percentB * 100).toFixed(
        1
      )}%) - Neutral`;
    } else if (bollinger.percentB <= 0.8) {
      score = 35;
      reason = `Upper half (%B: ${(bollinger.percentB * 100).toFixed(
        1
      )}%) - Slightly bearish`;
    } else if (bollinger.percentB <= 0.9) {
      score = 20;
      reason = `Above upper region (%B: ${(bollinger.percentB * 100).toFixed(
        1
      )}%) - Bearish opportunity`;
    } else {
      score = 10;
      reason = `Near upper band (%B: ${(bollinger.percentB * 100).toFixed(
        1
      )}%) - Overbought decline expected`;
    }

    if (bollinger.breakout === "bullish_breakout") {
      score = 85;
      reason = "BULLISH BREAKOUT above upper band - Strong momentum play!";
    } else if (bollinger.breakout === "bearish_breakdown") {
      score = 15;
      reason = "BEARISH BREAKDOWN below lower band - Strong sell signal!";
    }

    if (bollinger.squeeze) {
      score += 10;
      reason += ", low volatility squeeze detected (breakout pending)";
    }

    if (bollinger.expansion && bollinger.breakout !== "none") {
      score += 5;
      reason += ", high volatility expansion confirms move";
    }

    // Add data quality context
    if (bollinger.dataQuality.adaptive) {
      reason += ` [Adaptive period: ${bollinger.dataQuality.level} quality]`;
    } else {
      reason += ` [${bollinger.dataQuality.level} data quality]`;
    }

    return {
      score: Math.max(0, Math.min(100, score)),
      reason,
      dataQuality: bollinger.dataQuality,
      qualityMultiplier,
    };
  }

  // Enhanced Support/Resistance scoring with data quality integration
  private scoreSupportResistance(sr: SupportResistanceAnalysis | null): {
    score: number;
    reason: string;
    dataQuality: DataQuality | null;
    qualityMultiplier: number;
  } {
    if (!sr)
      return {
        score: 50,
        reason: "No Support/Resistance data available",
        dataQuality: null,
        qualityMultiplier: 0,
      };

    const qualityMultiplier =
      this.qualityMultipliers[sr.dataQuality.level] || 0;

    let score = 50;
    let reason = "";

    // S/R scoring logic - INDUSTRY STANDARD PRESERVED
    if (sr.signal === "at_support") {
      score = 85;
      reason = `At strong support level (${sr.nearestSupport?.price.toFixed(
        2
      )}) - Bounce opportunity`;
    } else if (sr.signal === "at_resistance") {
      score = 15;
      reason = `At strong resistance level (${sr.nearestResistance?.price.toFixed(
        2
      )}) - Rejection likely`;
    } else if (sr.signal === "breakout") {
      score = 80;
      reason = "Breakout above resistance - Momentum continuation";
    } else {
      score = 50;
      reason = `In range (${sr.positionInRange.toFixed(
        1
      )}% from support) - No key level nearby`;
    }

    if (sr.nearestSupport && sr.signal === "at_support") {
      const strengthBonus = Math.min(sr.nearestSupport.strength * 2, 10);
      score += strengthBonus;
      reason += `, tested ${sr.nearestSupport.tested} times`;
    }

    if (sr.nearestResistance && sr.signal === "at_resistance") {
      const strengthPenalty = Math.min(sr.nearestResistance.strength * 2, 10);
      score -= strengthPenalty;
      reason += `, tested ${sr.nearestResistance.tested} times`;
    }

    // Add data quality context
    if (sr.dataQuality.adaptive) {
      reason += ` [Adaptive S/R: ${sr.dataQuality.level} quality]`;
    } else {
      reason += ` [${sr.dataQuality.level} data quality]`;
    }

    return {
      score: Math.max(0, Math.min(100, score)),
      reason,
      dataQuality: sr.dataQuality,
      qualityMultiplier,
    };
  }

  // Enhanced Volume scoring with data quality integration
  private scoreVolume(volume: VolumeAnalysis | null): {
    score: number;
    reason: string;
    dataQuality: DataQuality | null;
    qualityMultiplier: number;
  } {
    if (!volume)
      return {
        score: 50,
        reason: "No volume data available",
        dataQuality: null,
        qualityMultiplier: 0,
      };

    const qualityMultiplier =
      this.qualityMultipliers[volume.dataQuality.level] || 0;

    let score = 50;
    let reason = "";

    // Volume scoring logic - INDUSTRY STANDARD PRESERVED
    if (volume.volumeSpike) {
      score += 20;
      reason = `Volume spike (${volume.volumeRatio.toFixed(
        1
      )}x average) - Strong conviction`;
    } else if (volume.volumeRatio > 1.5) {
      score += 10;
      reason = `Above average volume (${volume.volumeRatio.toFixed(
        1
      )}x) - Good participation`;
    } else if (volume.volumeRatio < 0.5) {
      score -= 10;
      reason = `Below average volume (${volume.volumeRatio.toFixed(
        1
      )}x) - Weak participation`;
    } else {
      reason = `Normal volume (${volume.volumeRatio.toFixed(1)}x average)`;
    }

    if (volume.volumeTrend === "increasing") {
      score += 10;
      reason += ", increasing volume trend";
    } else if (volume.volumeTrend === "decreasing") {
      score -= 5;
      reason += ", decreasing volume trend";
    }

    if (volume.signal === "bullish") {
      score += 15;
      reason += " - BULLISH volume confirmation";
    } else if (volume.signal === "bearish") {
      score -= 15;
      reason += " - BEARISH volume confirmation";
    }

    // Add data quality context
    if (volume.dataQuality.adaptive) {
      reason += ` [Adaptive analysis: ${volume.dataQuality.level} quality]`;
    } else {
      reason += ` [${volume.dataQuality.level} data quality]`;
    }

    return {
      score: Math.max(0, Math.min(100, score)),
      reason,
      dataQuality: volume.dataQuality,
      qualityMultiplier,
    };
  }

  // Enhanced timeframe score calculation with data quality integration
  private calculateTimeframeScore(
    ticker: string,
    timeframe: string,
    priceData: PriceData[]
  ): TimeframeScore | null {
    try {
      console.log(
        `📊 Enhanced scoring for ${ticker} ${timeframe} (${priceData.length} data points)...`
      );

      // Get enhanced technical analysis with data quality
      const analysis = TechnicalIndicators.analyzeStock(priceData);

      // Score each indicator with data quality integration
      const rsiResult = this.scoreRSI(analysis.rsi);
      const macdResult = this.scoreMACD(analysis.macd);
      const emaResult = this.scoreEMA(analysis.ema);
      const bollingerResult = this.scoreBollinger(analysis.bollingerBands);
      const srResult = this.scoreSupportResistance(analysis.supportResistance);
      const volumeResult = this.scoreVolume(analysis.volume);

      // Calculate standard contributions - INDUSTRY STANDARD PRESERVED
      const rsiContribution = rsiResult.score * this.indicatorWeights.rsi;
      const macdContribution = macdResult.score * this.indicatorWeights.macd;
      const emaContribution = emaResult.score * this.indicatorWeights.ema;
      const bollingerContribution =
        bollingerResult.score * this.indicatorWeights.bollinger;
      const srContribution =
        srResult.score * this.indicatorWeights.supportResistance;
      const volumeContribution =
        volumeResult.score * this.indicatorWeights.volume;

      // Calculate quality-adjusted contributions - NEW ENHANCEMENT
      const rsiQualityContribution =
        rsiContribution * rsiResult.qualityMultiplier;
      const macdQualityContribution =
        macdContribution * macdResult.qualityMultiplier;
      const emaQualityContribution =
        emaContribution * emaResult.qualityMultiplier;
      const bollingerQualityContribution =
        bollingerContribution * bollingerResult.qualityMultiplier;
      const srQualityContribution = srContribution * srResult.qualityMultiplier;
      const volumeQualityContribution =
        volumeContribution * volumeResult.qualityMultiplier;

      // Calculate total weight available (sum of quality multipliers)
      const totalQualityWeight =
        rsiResult.qualityMultiplier * this.indicatorWeights.rsi +
        macdResult.qualityMultiplier * this.indicatorWeights.macd +
        emaResult.qualityMultiplier * this.indicatorWeights.ema +
        bollingerResult.qualityMultiplier * this.indicatorWeights.bollinger +
        srResult.qualityMultiplier * this.indicatorWeights.supportResistance +
        volumeResult.qualityMultiplier * this.indicatorWeights.volume;

      // Calculate quality-adjusted composite score
      let compositeScore: number;
      if (totalQualityWeight > 0) {
        const qualityAdjustedTotal =
          rsiQualityContribution +
          macdQualityContribution +
          emaQualityContribution +
          bollingerQualityContribution +
          srQualityContribution +
          volumeQualityContribution;
        // Normalize by available quality weight to maintain 0-100 scale
        compositeScore = Math.round(qualityAdjustedTotal / totalQualityWeight);
      } else {
        compositeScore = 0; // No indicators available
      }

      // Calculate overall data quality for this timeframe
      const dataQualities = [
        rsiResult.dataQuality,
        macdResult.dataQuality,
        emaResult.dataQuality,
        bollingerResult.dataQuality,
        srResult.dataQuality,
        volumeResult.dataQuality,
      ].filter(Boolean) as DataQuality[];

      let dataQualityScore = 0;
      let dataQualityLevel = "Insufficient";

      if (dataQualities.length > 0) {
        dataQualityScore = Math.round(
          dataQualities.reduce((sum, dq) => sum + dq.score, 0) /
            dataQualities.length
        );

        if (dataQualityScore >= 95) dataQualityLevel = "Excellent";
        else if (dataQualityScore >= 80) dataQualityLevel = "Good";
        else if (dataQualityScore >= 50) dataQualityLevel = "Limited";
        else dataQualityLevel = "Insufficient";
      }

      // Enhanced confidence calculation including data quality
      const scores = [
        rsiResult.score,
        macdResult.score,
        emaResult.score,
        bollingerResult.score,
        srResult.score,
        volumeResult.score,
      ];
      const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
      const variance =
        scores.reduce((sum, score) => sum + Math.pow(score - avgScore, 2), 0) /
        scores.length;
      const indicatorAgreement = Math.max(
        0,
        Math.min(100, 100 - Math.sqrt(variance))
      );

      // Combine indicator agreement with data quality for final confidence
      const confidence = Math.round(
        indicatorAgreement * 0.7 + dataQualityScore * 0.3
      );

      console.log(
        `✅ ${ticker} ${timeframe}: Score ${compositeScore}/100, Quality ${dataQualityLevel} (${dataQualityScore}/100), Confidence ${confidence}%`
      );

      return {
        timeframe,
        rsiScore: rsiResult.score,
        macdScore: macdResult.score,
        emaScore: emaResult.score,
        bollingerScore: bollingerResult.score,
        supportResistanceScore: srResult.score,
        volumeScore: volumeResult.score,
        compositeScore,
        confidence,
        dataQualityScore,
        dataQualityLevel,
        breakdown: {
          rsi: {
            score: rsiResult.score,
            weight: this.indicatorWeights.rsi,
            contribution: Math.round(rsiContribution * 100) / 100,
            reason: rsiResult.reason,
            dataQuality: rsiResult.dataQuality,
            qualityAdjustedContribution:
              Math.round(rsiQualityContribution * 100) / 100,
          },
          macd: {
            score: macdResult.score,
            weight: this.indicatorWeights.macd,
            contribution: Math.round(macdContribution * 100) / 100,
            reason: macdResult.reason,
            dataQuality: macdResult.dataQuality,
            qualityAdjustedContribution:
              Math.round(macdQualityContribution * 100) / 100,
          },
          ema: {
            score: emaResult.score,
            weight: this.indicatorWeights.ema,
            contribution: Math.round(emaContribution * 100) / 100,
            reason: emaResult.reason,
            dataQuality: emaResult.dataQuality,
            qualityAdjustedContribution:
              Math.round(emaQualityContribution * 100) / 100,
          },
          bollinger: {
            score: bollingerResult.score,
            weight: this.indicatorWeights.bollinger,
            contribution: Math.round(bollingerContribution * 100) / 100,
            reason: bollingerResult.reason,
            dataQuality: bollingerResult.dataQuality,
            qualityAdjustedContribution:
              Math.round(bollingerQualityContribution * 100) / 100,
          },
          supportResistance: {
            score: srResult.score,
            weight: this.indicatorWeights.supportResistance,
            contribution: Math.round(srContribution * 100) / 100,
            reason: srResult.reason,
            dataQuality: srResult.dataQuality,
            qualityAdjustedContribution:
              Math.round(srQualityContribution * 100) / 100,
          },
          volume: {
            score: volumeResult.score,
            weight: this.indicatorWeights.volume,
            contribution: Math.round(volumeContribution * 100) / 100,
            reason: volumeResult.reason,
            dataQuality: volumeResult.dataQuality,
            qualityAdjustedContribution:
              Math.round(volumeQualityContribution * 100) / 100,
          },
        },
      };
    } catch (error) {
      console.error(
        `❌ Error calculating enhanced score for ${ticker} ${timeframe}:`,
        error
      );
      return null;
    }
  }

  // Enhanced final score calculation with data quality integration
  public calculateFinalScore(
    ticker: string,
    multiTimeframeData: Record<string, PriceData[]>
  ): FinalSignalScore | null {
    try {
      console.log(`🎯 Enhanced final scoring for ${ticker}...`);

      const timeframeScores: Record<string, TimeframeScore> = {};

      // Calculate enhanced score for each timeframe
      for (const [timeframe, priceData] of Object.entries(multiTimeframeData)) {
        if (priceData && priceData.length > 0) {
          const score = this.calculateTimeframeScore(
            ticker,
            timeframe,
            priceData
          );
          if (score) {
            timeframeScores[timeframe] = score;
          }
        }
      }

      if (Object.keys(timeframeScores).length === 0) {
        console.warn(`⚠️ No valid enhanced timeframe scores for ${ticker}`);
        return null;
      }

      // Calculate quality-weighted final score - PRESERVES TIMEFRAME WEIGHTS
      let qualityWeightedScore = 0;
      let totalQualityWeight = 0;

      for (const [timeframe, score] of Object.entries(timeframeScores)) {
        const timeframeWeight = this.timeframeWeights[timeframe] || 0;
        const qualityMultiplier = score.dataQualityScore / 100; // Convert to 0-1 multiplier
        const effectiveWeight =
          timeframeWeight * Math.max(0.3, qualityMultiplier); // Minimum 30% weight

        qualityWeightedScore += score.compositeScore * effectiveWeight;
        totalQualityWeight += effectiveWeight;
      }

      // Normalize final score
      const finalScore =
        totalQualityWeight > 0
          ? Math.round(qualityWeightedScore / totalQualityWeight)
          : 0;

      // Calculate overall data quality
      const qualityScores = Object.values(timeframeScores).map(
        (s) => s.dataQualityScore
      );
      const avgQualityScore = Math.round(
        qualityScores.reduce((a, b) => a + b, 0) / qualityScores.length
      );

      let dataQualityLevel: string;
      if (avgQualityScore >= 95) dataQualityLevel = "Excellent";
      else if (avgQualityScore >= 80) dataQualityLevel = "Good";
      else if (avgQualityScore >= 50) dataQualityLevel = "Limited";
      else dataQualityLevel = "Insufficient";

      // NEW REALISTIC SIGNAL STRENGTH THRESHOLDS - UPDATED FOR REAL TRADING CONDITIONS
      let signalStrength: FinalSignalScore["signalStrength"];
      if (finalScore >= 75)
        signalStrength = "STRONG_BUY"; // ≥75 (instead of ≥90)
      else if (finalScore >= 65) signalStrength = "BUY"; // ≥65 (instead of ≥80)
      else if (finalScore >= 55)
        signalStrength = "WEAK_BUY"; // ≥55 (instead of ≥60)
      else if (finalScore >= 45)
        signalStrength = "NEUTRAL"; // 45-54 (instead of 40-59)
      else if (finalScore >= 35)
        signalStrength = "WEAK_SELL"; // 35-44 (instead of 20-39)
      else if (finalScore >= 25)
        signalStrength = "SELL"; // 25-34 (instead of 10-19)
      else signalStrength = "STRONG_SELL"; // <25 (instead of <10)

      // Enhanced confidence calculation
      const confidenceValues = Object.values(timeframeScores).map(
        (s) => s.confidence
      );
      const avgConfidence = Math.round(
        confidenceValues.reduce((a, b) => a + b, 0) / confidenceValues.length
      );

      // Generate enhanced recommendation
      const recommendation = this.generateEnhancedRecommendation(
        finalScore,
        signalStrength,
        timeframeScores,
        dataQualityLevel,
        avgQualityScore
      );

      // Calculate risk management levels
      const currentPrice = this.getCurrentPrice(multiTimeframeData);
      const { stopLoss, takeProfit, riskRewardRatio } =
        this.calculateRiskLevels(currentPrice, finalScore, signalStrength);

      // Generate enhanced analysis summary
      const analysis = this.generateEnhancedAnalysis(
        ticker,
        finalScore,
        timeframeScores,
        dataQualityLevel,
        avgQualityScore
      );

      console.log(
        `🎉 ${ticker} final result: ${finalScore}/100 (${signalStrength}), Quality: ${dataQualityLevel} (${avgQualityScore}/100)`
      );

      return {
        ticker,
        finalScore,
        signalStrength,
        timeframeScores,
        confidence: avgConfidence,
        dataQualityScore: avgQualityScore,
        dataQualityLevel,
        recommendation,
        entryPrice: currentPrice,
        stopLoss,
        takeProfit,
        riskRewardRatio,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        analysis,
      };
    } catch (error) {
      console.error(
        `❌ Error calculating enhanced final score for ${ticker}:`,
        error
      );
      return null;
    }
  }

  // Helper methods - INDUSTRY STANDARD PRESERVED
  private getCurrentPrice(
    multiTimeframeData: Record<string, PriceData[]>
  ): number {
    const timeframes = ["1H", "4H", "1D", "1W"];
    for (const tf of timeframes) {
      const data = multiTimeframeData[tf];
      if (data && data.length > 0) {
        return data[data.length - 1].close;
      }
    }
    return 100; // Fallback
  }

  private calculateRiskLevels(
    currentPrice: number,
    score: number,
    strength: string
  ) {
    const riskPercent = strength.includes("STRONG") ? 0.02 : 0.015;
    const rewardMultiplier = score >= 80 ? 3 : score >= 60 ? 2.5 : 2;

    const stopLoss = currentPrice * (1 - riskPercent);
    const takeProfit =
      currentPrice + (currentPrice - stopLoss) * rewardMultiplier;
    const riskRewardRatio = rewardMultiplier;

    return {
      stopLoss: Math.round(stopLoss * 100) / 100,
      takeProfit: Math.round(takeProfit * 100) / 100,
      riskRewardRatio,
    };
  }

  // Enhanced recommendation generation with realistic thresholds context
  private generateEnhancedRecommendation(
    score: number,
    strength: string,
    timeframes: Record<string, TimeframeScore>,
    qualityLevel: string,
    qualityScore: number
  ): string {
    let recommendation = "";

    // Base recommendation with NEW REALISTIC THRESHOLDS
    if (score >= 75) {
      recommendation = `Strong ${strength} signal with excellent timeframe alignment - High conviction trade`;
    } else if (score >= 65) {
      recommendation = `Solid ${strength} opportunity with good indicator confluence - Recommended entry`;
    } else if (score >= 55) {
      recommendation = `Moderate ${strength} signal with decent setup - Consider scaled entry`;
    } else if (score >= 45) {
      recommendation = `Neutral signal with mixed readings - Wait for clearer direction`;
    } else if (score >= 35) {
      recommendation = `${strength} bias developing - Monitor for confirmation`;
    } else if (score >= 25) {
      recommendation = `${strength} signal with bearish momentum - Consider short position`;
    } else {
      recommendation = `Strong ${strength} signal with major downside risk - High conviction short`;
    }

    // Add data quality context - NEW ENHANCEMENT
    if (qualityLevel === "Excellent") {
      recommendation += ". Excellent data quality provides high reliability";
    } else if (qualityLevel === "Good") {
      recommendation += ". Good data quality supports the analysis";
    } else if (qualityLevel === "Limited") {
      recommendation += `. Limited data quality (${qualityScore}/100) - use smaller position sizing`;
    } else {
      recommendation += `. Poor data quality (${qualityScore}/100) - exercise caution`;
    }

    return recommendation;
  }

  // Enhanced analysis generation
  private generateEnhancedAnalysis(
    ticker: string,
    score: number,
    timeframes: Record<string, TimeframeScore>,
    qualityLevel: string,
    qualityScore: number
  ): string {
    let analysis = `${ticker} Enhanced Technical Analysis:\n\n`;

    // Timeframe breakdown with data quality
    for (const [tf, data] of Object.entries(timeframes)) {
      analysis += `${tf}: ${data.compositeScore}/100 (${data.confidence}% confidence, ${data.dataQualityLevel} quality)\n`;
    }

    analysis += `\nFinal Score: ${score}/100\n`;
    analysis += `Data Quality: ${qualityLevel} (${qualityScore}/100)\n`;
    analysis += `Reliability: ${
      qualityScore >= 90
        ? "Very High"
        : qualityScore >= 70
        ? "High"
        : qualityScore >= 50
        ? "Moderate"
        : "Low"
    } - ${
      score >= 65 && qualityScore >= 80
        ? "High confidence signal"
        : score >= 55 || qualityScore >= 60
        ? "Moderate confidence signal"
        : "Low confidence signal"
    }`;

    return analysis;
  }
}

// Export enhanced singleton instance
export const scoringEngine = new ScoringEngine();
