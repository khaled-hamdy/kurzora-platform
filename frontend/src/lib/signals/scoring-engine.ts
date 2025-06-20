// Scoring Engine - Multi-Timeframe 0-100 Signal Scoring
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
  breakdown: {
    rsi: {
      score: number;
      weight: number;
      contribution: number;
      reason: string;
    };
    macd: {
      score: number;
      weight: number;
      contribution: number;
      reason: string;
    };
    ema: {
      score: number;
      weight: number;
      contribution: number;
      reason: string;
    };
    bollinger: {
      score: number;
      weight: number;
      contribution: number;
      reason: string;
    };
    supportResistance: {
      score: number;
      weight: number;
      contribution: number;
      reason: string;
    };
    volume: {
      score: number;
      weight: number;
      contribution: number;
      reason: string;
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
  recommendation: string;
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  riskRewardRatio: number;
  expiresAt: Date;
  analysis: string;
}

export class ScoringEngine {
  // Indicator weights (must sum to 1.0)
  private indicatorWeights = {
    rsi: 0.25, // 25% - Most important for momentum
    macd: 0.25, // 25% - Trend confirmation
    ema: 0.2, // 20% - Trend direction
    bollinger: 0.15, // 15% - Volatility and breakouts
    supportResistance: 0.1, // 10% - Key levels
    volume: 0.05, // 5% - Confirmation
  };

  // Timeframe weights (must sum to 1.0)
  private timeframeWeights = {
    "1H": 0.4, // 40% - Most responsive
    "4H": 0.3, // 30% - Balance of speed/reliability
    "1D": 0.2, // 20% - Trend confirmation
    "1W": 0.1, // 10% - Long-term trend
  };

  // Score individual RSI indicator
  private scoreRSI(rsi: RSIResult | null): { score: number; reason: string } {
    if (!rsi) return { score: 50, reason: "No RSI data available" };

    let score = 50;
    let reason = "";

    // RSI scoring logic based on overbought/oversold conditions
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

    return { score: Math.max(0, Math.min(100, score)), reason };
  }

  // Score MACD indicator
  private scoreMACD(macd: MACDResult | null): {
    score: number;
    reason: string;
  } {
    if (!macd) return { score: 50, reason: "No MACD data available" };

    let score = 50;
    let reason = "";

    // MACD line vs Signal line
    if (macd.macd > macd.signal) {
      score += 25;
      reason = "MACD above signal line (bullish)";
    } else {
      score -= 25;
      reason = "MACD below signal line (bearish)";
    }

    // Histogram momentum
    if (macd.histogram > 0) {
      score += 15;
      reason += ", positive histogram (momentum up)";
    } else {
      score -= 15;
      reason += ", negative histogram (momentum down)";
    }

    // Crossover signals (most important)
    if (macd.crossover === "bullish_crossover") {
      score += 20;
      reason += ", BULLISH CROSSOVER detected!";
    } else if (macd.crossover === "bearish_crossover") {
      score -= 20;
      reason += ", BEARISH CROSSOVER detected!";
    }

    // Trend strength
    if (macd.trend === "bullish") {
      score += 10;
      reason += ", bullish trend confirmed";
    } else if (macd.trend === "bearish") {
      score -= 10;
      reason += ", bearish trend confirmed";
    }

    return { score: Math.max(0, Math.min(100, score)), reason };
  }

  // Score EMA analysis
  private scoreEMA(ema: EMAAnalysis | null): { score: number; reason: string } {
    if (!ema) return { score: 50, reason: "No EMA data available" };

    let score = 50;
    let reason = "";

    // Price position relative to EMAs
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

    // EMA alignment bonus/penalty
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

    // Crossover signals (major events)
    if (ema.crossover === "golden_cross") {
      score = Math.max(score, 90);
      reason += ", GOLDEN CROSS - Major bullish signal!";
    } else if (ema.crossover === "death_cross") {
      score = Math.min(score, 10);
      reason += ", DEATH CROSS - Major bearish signal!";
    }

    // Trend strength adjustment
    if (ema.trend === "strong_bullish") {
      score += 5;
      reason += ", very strong bullish trend";
    } else if (ema.trend === "strong_bearish") {
      score -= 5;
      reason += ", very strong bearish trend";
    }

    return { score: Math.max(0, Math.min(100, score)), reason };
  }

  // Score Bollinger Bands
  private scoreBollinger(bollinger: BollingerBandsResult | null): {
    score: number;
    reason: string;
  } {
    if (!bollinger)
      return { score: 50, reason: "No Bollinger Bands data available" };

    let score = 50;
    let reason = "";

    // Position within bands (%B analysis)
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

    // Breakout signals (override normal scoring)
    if (bollinger.breakout === "bullish_breakout") {
      score = 85;
      reason = "BULLISH BREAKOUT above upper band - Strong momentum play!";
    } else if (bollinger.breakout === "bearish_breakdown") {
      score = 15;
      reason = "BEARISH BREAKDOWN below lower band - Strong sell signal!";
    }

    // Squeeze adjustment (potential for big moves)
    if (bollinger.squeeze) {
      score += 10;
      reason += ", low volatility squeeze detected (breakout pending)";
    }

    // Expansion adjustment (confirming strong moves)
    if (bollinger.expansion && bollinger.breakout !== "none") {
      score += 5;
      reason += ", high volatility expansion confirms move";
    }

    return { score: Math.max(0, Math.min(100, score)), reason };
  }

  // Score Support/Resistance
  private scoreSupportResistance(sr: SupportResistanceAnalysis | null): {
    score: number;
    reason: string;
  } {
    if (!sr)
      return { score: 50, reason: "No Support/Resistance data available" };

    let score = 50;
    let reason = "";

    // Signal-based scoring
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

    // Level strength adjustment
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

    return { score: Math.max(0, Math.min(100, score)), reason };
  }

  // Score Volume
  private scoreVolume(volume: VolumeAnalysis | null): {
    score: number;
    reason: string;
  } {
    if (!volume) return { score: 50, reason: "No volume data available" };

    let score = 50;
    let reason = "";

    // Volume ratio analysis
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

    // Volume trend
    if (volume.volumeTrend === "increasing") {
      score += 10;
      reason += ", increasing volume trend";
    } else if (volume.volumeTrend === "decreasing") {
      score -= 5;
      reason += ", decreasing volume trend";
    }

    // Volume signal confirmation
    if (volume.signal === "bullish") {
      score += 15;
      reason += " - BULLISH volume confirmation";
    } else if (volume.signal === "bearish") {
      score -= 15;
      reason += " - BEARISH volume confirmation";
    }

    return { score: Math.max(0, Math.min(100, score)), reason };
  }

  // Calculate composite score for a single timeframe
  private calculateTimeframeScore(
    ticker: string,
    timeframe: string,
    priceData: PriceData[]
  ): TimeframeScore | null {
    try {
      console.log(`📊 Calculating ${timeframe} score for ${ticker}...`);

      // Get technical analysis for this timeframe
      const analysis = TechnicalIndicators.analyzeStock(priceData);

      // Score each indicator
      const rsiResult = this.scoreRSI(analysis.rsi);
      const macdResult = this.scoreMACD(analysis.macd);
      const emaResult = this.scoreEMA(analysis.ema);
      const bollingerResult = this.scoreBollinger(analysis.bollingerBands);
      const srResult = this.scoreSupportResistance(analysis.supportResistance);
      const volumeResult = this.scoreVolume(analysis.volume);

      // Calculate weighted contributions
      const rsiContribution = rsiResult.score * this.indicatorWeights.rsi;
      const macdContribution = macdResult.score * this.indicatorWeights.macd;
      const emaContribution = emaResult.score * this.indicatorWeights.ema;
      const bollingerContribution =
        bollingerResult.score * this.indicatorWeights.bollinger;
      const srContribution =
        srResult.score * this.indicatorWeights.supportResistance;
      const volumeContribution =
        volumeResult.score * this.indicatorWeights.volume;

      // Calculate composite score
      const compositeScore = Math.round(
        rsiContribution +
          macdContribution +
          emaContribution +
          bollingerContribution +
          srContribution +
          volumeContribution
      );

      // Calculate confidence based on indicator agreement
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
      const confidence = Math.max(0, Math.min(100, 100 - Math.sqrt(variance)));

      return {
        timeframe,
        rsiScore: rsiResult.score,
        macdScore: macdResult.score,
        emaScore: emaResult.score,
        bollingerScore: bollingerResult.score,
        supportResistanceScore: srResult.score,
        volumeScore: volumeResult.score,
        compositeScore,
        confidence: Math.round(confidence),
        breakdown: {
          rsi: {
            score: rsiResult.score,
            weight: this.indicatorWeights.rsi,
            contribution: Math.round(rsiContribution * 100) / 100,
            reason: rsiResult.reason,
          },
          macd: {
            score: macdResult.score,
            weight: this.indicatorWeights.macd,
            contribution: Math.round(macdContribution * 100) / 100,
            reason: macdResult.reason,
          },
          ema: {
            score: emaResult.score,
            weight: this.indicatorWeights.ema,
            contribution: Math.round(emaContribution * 100) / 100,
            reason: emaResult.reason,
          },
          bollinger: {
            score: bollingerResult.score,
            weight: this.indicatorWeights.bollinger,
            contribution: Math.round(bollingerContribution * 100) / 100,
            reason: bollingerResult.reason,
          },
          supportResistance: {
            score: srResult.score,
            weight: this.indicatorWeights.supportResistance,
            contribution: Math.round(srContribution * 100) / 100,
            reason: srResult.reason,
          },
          volume: {
            score: volumeResult.score,
            weight: this.indicatorWeights.volume,
            contribution: Math.round(volumeContribution * 100) / 100,
            reason: volumeResult.reason,
          },
        },
      };
    } catch (error) {
      console.error(
        `❌ Error calculating ${timeframe} score for ${ticker}:`,
        error
      );
      return null;
    }
  }

  // Calculate final weighted score across all timeframes
  public calculateFinalScore(
    ticker: string,
    multiTimeframeData: Record<string, PriceData[]>
  ): FinalSignalScore | null {
    try {
      console.log(`🎯 Calculating final score for ${ticker}...`);

      const timeframeScores: Record<string, TimeframeScore> = {};

      // Calculate score for each timeframe
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
        console.warn(`⚠️ No valid timeframe scores for ${ticker}`);
        return null;
      }

      // Calculate weighted final score
      let finalScore = 0;
      let totalWeight = 0;

      for (const [timeframe, score] of Object.entries(timeframeScores)) {
        const weight = this.timeframeWeights[timeframe] || 0;
        finalScore += score.compositeScore * weight;
        totalWeight += weight;
      }

      // Normalize if not all timeframes available
      if (totalWeight > 0) {
        finalScore = finalScore / totalWeight;
      }

      finalScore = Math.round(finalScore);

      // Determine signal strength
      let signalStrength: FinalSignalScore["signalStrength"];
      if (finalScore >= 90) signalStrength = "STRONG_BUY";
      else if (finalScore >= 80) signalStrength = "BUY";
      else if (finalScore >= 60) signalStrength = "WEAK_BUY";
      else if (finalScore >= 40) signalStrength = "NEUTRAL";
      else if (finalScore >= 20) signalStrength = "WEAK_SELL";
      else if (finalScore >= 10) signalStrength = "SELL";
      else signalStrength = "STRONG_SELL";

      // Calculate overall confidence
      const confidenceValues = Object.values(timeframeScores).map(
        (s) => s.confidence
      );
      const avgConfidence =
        confidenceValues.reduce((a, b) => a + b, 0) / confidenceValues.length;

      // Generate recommendation text
      const recommendation = this.generateRecommendation(
        finalScore,
        signalStrength,
        timeframeScores
      );

      // Calculate risk management levels (simplified)
      const currentPrice = this.getCurrentPrice(multiTimeframeData);
      const { stopLoss, takeProfit, riskRewardRatio } =
        this.calculateRiskLevels(currentPrice, finalScore, signalStrength);

      // Generate analysis summary
      const analysis = this.generateAnalysis(
        ticker,
        finalScore,
        timeframeScores
      );

      return {
        ticker,
        finalScore,
        signalStrength,
        timeframeScores,
        confidence: Math.round(avgConfidence),
        recommendation,
        entryPrice: currentPrice,
        stopLoss,
        takeProfit,
        riskRewardRatio,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        analysis,
      };
    } catch (error) {
      console.error(`❌ Error calculating final score for ${ticker}:`, error);
      return null;
    }
  }

  // Helper methods
  private getCurrentPrice(
    multiTimeframeData: Record<string, PriceData[]>
  ): number {
    // Get current price from shortest timeframe data
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
    const riskPercent = strength.includes("STRONG") ? 0.02 : 0.015; // 2% or 1.5%
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

  private generateRecommendation(
    score: number,
    strength: string,
    timeframes: Record<string, TimeframeScore>
  ): string {
    const tf1H = timeframes["1H"]?.compositeScore || 0;
    const tf4H = timeframes["4H"]?.compositeScore || 0;
    const tf1D = timeframes["1D"]?.compositeScore || 0;

    if (score >= 85) {
      return `Strong ${strength} signal with high timeframe alignment. Multiple indicators confirm strong momentum.`;
    } else if (score >= 70) {
      return `Good ${strength} opportunity with solid indicator confluence across timeframes.`;
    } else if (score >= 60) {
      return `Moderate ${strength} signal. Consider position sizing and wait for better confirmation.`;
    } else if (score <= 15) {
      return `Strong ${strength} signal with bearish momentum. Avoid long positions.`;
    } else if (score <= 30) {
      return `${strength} bias with downward pressure across multiple timeframes.`;
    } else {
      return `Neutral signal with mixed timeframe readings. Wait for clearer direction.`;
    }
  }

  private generateAnalysis(
    ticker: string,
    score: number,
    timeframes: Record<string, TimeframeScore>
  ): string {
    let analysis = `${ticker} Technical Analysis Summary:\n\n`;

    // Add timeframe breakdown
    for (const [tf, data] of Object.entries(timeframes)) {
      analysis += `${tf}: ${data.compositeScore}/100 (${data.confidence}% confidence)\n`;
    }

    analysis += `\nFinal Score: ${score}/100\n`;
    analysis += `Confidence: High timeframe alignment indicates ${
      score >= 70 ? "strong" : score >= 50 ? "moderate" : "weak"
    } signal reliability.`;

    return analysis;
  }
}

// Export singleton instance
export const scoringEngine = new ScoringEngine();
