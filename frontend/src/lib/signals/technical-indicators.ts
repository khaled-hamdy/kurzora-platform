// Technical Indicators Calculator - RSI, MACD, Volume Analysis
// File: src/lib/signals/technical-indicators.ts

export interface RSIResult {
  value: number;
  signal: "oversold" | "overbought" | "neutral";
  strength: "strong" | "moderate" | "weak";
  trend: "bullish" | "bearish" | "neutral";
}

export interface MACDResult {
  macd: number;
  signal: number;
  histogram: number;
  trend: "bullish" | "bearish" | "neutral";
  crossover: "bullish_crossover" | "bearish_crossover" | "none";
}

export interface VolumeAnalysis {
  currentVolume: number;
  averageVolume: number;
  volumeRatio: number;
  volumeSpike: boolean;
  volumeTrend: "increasing" | "decreasing" | "stable";
  signal: "bullish" | "bearish" | "neutral";
}

export interface SupportResistanceLevel {
  price: number;
  strength: number;
  type: "support" | "resistance";
  tested: number;
  confidence: number;
}

export interface SupportResistanceAnalysis {
  currentPrice: number;
  nearestSupport: SupportResistanceLevel | null;
  nearestResistance: SupportResistanceLevel | null;
  levels: SupportResistanceLevel[];
  positionInRange: number; // 0-100, where price is in current range
  signal: "at_support" | "at_resistance" | "in_range" | "breakout";
}

export interface EMAAnalysis {
  ema20: number;
  ema50: number;
  currentPrice: number;
  emaAlignment: "bullish" | "bearish" | "neutral"; // EMA20 > EMA50 = bullish
  pricePosition: "above_both" | "between" | "below_both";
  crossover: "golden_cross" | "death_cross" | "none";
  trend:
    | "strong_bullish"
    | "bullish"
    | "neutral"
    | "bearish"
    | "strong_bearish";
  signal: "strong_buy" | "buy" | "hold" | "sell" | "strong_sell";
}

export interface BollingerBandsResult {
  upperBand: number;
  middleBand: number; // 20-period SMA
  lowerBand: number;
  currentPrice: number;
  percentB: number; // Position within bands (0-1)
  bandWidth: number; // Width of bands (volatility measure)
  squeeze: boolean; // Low volatility - potential breakout
  expansion: boolean; // High volatility - strong move
  position:
    | "above_upper"
    | "upper_zone"
    | "middle_zone"
    | "lower_zone"
    | "below_lower";
  signal:
    | "oversold_bounce"
    | "buy_dip"
    | "neutral"
    | "sell_rally"
    | "overbought_decline";
  breakout: "bullish_breakout" | "bearish_breakdown" | "none";
}

export interface PriceData {
  timestamp: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export class TechnicalIndicators {
  // RSI Calculation with 14-period default
  static calculateRSI(prices: number[], period: number = 14): RSIResult | null {
    if (prices.length < period + 1) {
      console.warn(
        `RSI: Need at least ${period + 1} price points, got ${prices.length}`
      );
      return null;
    }

    try {
      const gains: number[] = [];
      const losses: number[] = [];

      // Calculate price changes
      for (let i = 1; i < prices.length; i++) {
        const change = prices[i] - prices[i - 1];
        gains.push(change > 0 ? change : 0);
        losses.push(change < 0 ? Math.abs(change) : 0);
      }

      // Calculate average gains and losses for the period
      const avgGain = gains.slice(-period).reduce((a, b) => a + b, 0) / period;
      const avgLoss = losses.slice(-period).reduce((a, b) => a + b, 0) / period;

      // Avoid division by zero
      if (avgLoss === 0) {
        return {
          value: 100,
          signal: "overbought",
          strength: "strong",
          trend: "bullish",
        };
      }

      // Calculate RS and RSI
      const rs = avgGain / avgLoss;
      const rsi = 100 - 100 / (1 + rs);

      // Determine signals
      let signal: "oversold" | "overbought" | "neutral";
      let strength: "strong" | "moderate" | "weak";
      let trend: "bullish" | "bearish" | "neutral";

      if (rsi <= 30) {
        signal = "oversold";
        strength = rsi <= 20 ? "strong" : "moderate";
        trend = "bullish";
      } else if (rsi >= 70) {
        signal = "overbought";
        strength = rsi >= 80 ? "strong" : "moderate";
        trend = "bearish";
      } else {
        signal = "neutral";
        strength = "weak";
        trend = rsi > 50 ? "bullish" : rsi < 50 ? "bearish" : "neutral";
      }

      return {
        value: Math.round(rsi * 100) / 100,
        signal,
        strength,
        trend,
      };
    } catch (error) {
      console.error("RSI calculation error:", error);
      return null;
    }
  }

  // MACD Calculation (12, 26, 9 periods)
  static calculateMACD(
    prices: number[],
    fastPeriod: number = 12,
    slowPeriod: number = 26,
    signalPeriod: number = 9
  ): MACDResult | null {
    if (prices.length < slowPeriod + signalPeriod) {
      console.warn(
        `MACD: Need at least ${slowPeriod + signalPeriod} price points, got ${
          prices.length
        }`
      );
      return null;
    }

    try {
      // Calculate EMAs
      const fastEMA = this.calculateEMA(prices, fastPeriod);
      const slowEMA = this.calculateEMA(prices, slowPeriod);

      if (!fastEMA || !slowEMA) return null;

      // MACD Line = Fast EMA - Slow EMA
      const macdLine = fastEMA - slowEMA;

      // For Signal Line, we need multiple MACD values - simplified for demo
      const macdValues = [macdLine]; // In real implementation, calculate for multiple periods
      const signalLine = this.calculateEMA(macdValues, signalPeriod) || 0;

      // MACD Histogram = MACD Line - Signal Line
      const histogram = macdLine - signalLine;

      // Determine trend and crossovers
      let trend: "bullish" | "bearish" | "neutral";
      let crossover: "bullish_crossover" | "bearish_crossover" | "none";

      if (macdLine > signalLine) {
        trend = "bullish";
        crossover =
          histogram > 0 && Math.abs(histogram) < 0.1
            ? "bullish_crossover"
            : "none";
      } else if (macdLine < signalLine) {
        trend = "bearish";
        crossover =
          histogram < 0 && Math.abs(histogram) < 0.1
            ? "bearish_crossover"
            : "none";
      } else {
        trend = "neutral";
        crossover = "none";
      }

      return {
        macd: Math.round(macdLine * 10000) / 10000,
        signal: Math.round(signalLine * 10000) / 10000,
        histogram: Math.round(histogram * 10000) / 10000,
        trend,
        crossover,
      };
    } catch (error) {
      console.error("MACD calculation error:", error);
      return null;
    }
  }

  // Volume Analysis
  static analyzeVolume(
    priceData: PriceData[],
    period: number = 20
  ): VolumeAnalysis | null {
    if (priceData.length < period) {
      console.warn(
        `Volume analysis: Need at least ${period} data points, got ${priceData.length}`
      );
      return null;
    }

    try {
      const volumes = priceData.map((d) => d.volume);
      const currentVolume = volumes[volumes.length - 1];
      const recentVolumes = volumes.slice(-period);
      const averageVolume = recentVolumes.reduce((a, b) => a + b, 0) / period;

      // Volume ratio (current vs average)
      const volumeRatio = averageVolume > 0 ? currentVolume / averageVolume : 1;

      // Volume spike detection (2x average or more)
      const volumeSpike = volumeRatio >= 2.0;

      // Volume trend analysis (last 5 periods)
      const recentTrendVolumes = volumes.slice(-5);
      const firstHalf =
        recentTrendVolumes.slice(0, 2).reduce((a, b) => a + b, 0) / 2;
      const secondHalf =
        recentTrendVolumes.slice(-2).reduce((a, b) => a + b, 0) / 2;

      let volumeTrend: "increasing" | "decreasing" | "stable";
      const trendRatio = secondHalf / firstHalf;

      if (trendRatio > 1.2) {
        volumeTrend = "increasing";
      } else if (trendRatio < 0.8) {
        volumeTrend = "decreasing";
      } else {
        volumeTrend = "stable";
      }

      // Determine volume signal
      let signal: "bullish" | "bearish" | "neutral";

      if (volumeSpike && volumeTrend === "increasing") {
        // High volume with increasing trend - usually bullish
        signal = "bullish";
      } else if (volumeRatio < 0.5 && volumeTrend === "decreasing") {
        // Very low volume with decreasing trend - usually bearish
        signal = "bearish";
      } else {
        signal = "neutral";
      }

      return {
        currentVolume,
        averageVolume: Math.round(averageVolume),
        volumeRatio: Math.round(volumeRatio * 100) / 100,
        volumeSpike,
        volumeTrend,
        signal,
      };
    } catch (error) {
      console.error("Volume analysis error:", error);
      return null;
    }
  }

  // EMA Analysis (20 and 50 periods)
  static analyzeEMA(prices: number[]): EMAAnalysis | null {
    if (prices.length < 50) {
      console.warn(
        `EMA analysis: Need at least 50 price points, got ${prices.length}`
      );
      return null;
    }

    try {
      const ema20 = this.calculateEMA(prices, 20);
      const ema50 = this.calculateEMA(prices, 50);
      const currentPrice = prices[prices.length - 1];

      if (!ema20 || !ema50) return null;

      // EMA Alignment
      let emaAlignment: "bullish" | "bearish" | "neutral";
      if (ema20 > ema50 * 1.005) {
        // 0.5% buffer to avoid noise
        emaAlignment = "bullish";
      } else if (ema20 < ema50 * 0.995) {
        emaAlignment = "bearish";
      } else {
        emaAlignment = "neutral";
      }

      // Price Position relative to EMAs
      let pricePosition: "above_both" | "between" | "below_both";
      if (currentPrice > ema20 && currentPrice > ema50) {
        pricePosition = "above_both";
      } else if (currentPrice < ema20 && currentPrice < ema50) {
        pricePosition = "below_both";
      } else {
        pricePosition = "between";
      }

      // Detect crossovers (need historical data for this - simplified)
      const crossover = this.detectEMACrossover(prices, 20, 50);

      // Determine trend strength
      let trend:
        | "strong_bullish"
        | "bullish"
        | "neutral"
        | "bearish"
        | "strong_bearish";
      const emaSpread = Math.abs(ema20 - ema50) / ema50;

      if (emaAlignment === "bullish" && pricePosition === "above_both") {
        trend = emaSpread > 0.05 ? "strong_bullish" : "bullish";
      } else if (emaAlignment === "bearish" && pricePosition === "below_both") {
        trend = emaSpread > 0.05 ? "strong_bearish" : "bearish";
      } else {
        trend = "neutral";
      }

      // Generate signal
      let signal: "strong_buy" | "buy" | "hold" | "sell" | "strong_sell";

      if (trend === "strong_bullish" || crossover === "golden_cross") {
        signal = "strong_buy";
      } else if (trend === "bullish" && pricePosition === "above_both") {
        signal = "buy";
      } else if (trend === "strong_bearish" || crossover === "death_cross") {
        signal = "strong_sell";
      } else if (trend === "bearish" && pricePosition === "below_both") {
        signal = "sell";
      } else {
        signal = "hold";
      }

      return {
        ema20: Math.round(ema20 * 100) / 100,
        ema50: Math.round(ema50 * 100) / 100,
        currentPrice: Math.round(currentPrice * 100) / 100,
        emaAlignment,
        pricePosition,
        crossover,
        trend,
        signal,
      };
    } catch (error) {
      console.error("EMA analysis error:", error);
      return null;
    }
  }

  // Bollinger Bands Analysis (20-period, 2 standard deviations)
  static calculateBollingerBands(
    prices: number[],
    period: number = 20,
    stdDev: number = 2
  ): BollingerBandsResult | null {
    if (prices.length < period) {
      console.warn(
        `Bollinger Bands: Need at least ${period} price points, got ${prices.length}`
      );
      return null;
    }

    try {
      const recentPrices = prices.slice(-period);
      const currentPrice = prices[prices.length - 1];

      // Calculate 20-period Simple Moving Average (Middle Band)
      const sma = recentPrices.reduce((a, b) => a + b, 0) / period;

      // Calculate Standard Deviation
      const variance =
        recentPrices.reduce((sum, price) => sum + Math.pow(price - sma, 2), 0) /
        period;
      const standardDeviation = Math.sqrt(variance);

      // Calculate bands
      const upperBand = sma + standardDeviation * stdDev;
      const lowerBand = sma - standardDeviation * stdDev;

      // Calculate %B (position within bands)
      const percentB = (currentPrice - lowerBand) / (upperBand - lowerBand);

      // Calculate Band Width (measure of volatility)
      const bandWidth = (upperBand - lowerBand) / sma;

      // Detect squeeze (low volatility)
      const avgBandWidth = this.calculateAverageBandWidth(
        prices,
        period,
        stdDev,
        10
      );
      const squeeze = bandWidth < avgBandWidth * 0.7; // 30% below average
      const expansion = bandWidth > avgBandWidth * 1.3; // 30% above average

      // Determine position
      let position:
        | "above_upper"
        | "upper_zone"
        | "middle_zone"
        | "lower_zone"
        | "below_lower";

      if (currentPrice > upperBand) {
        position = "above_upper";
      } else if (percentB > 0.8) {
        position = "upper_zone";
      } else if (percentB >= 0.2 && percentB <= 0.8) {
        position = "middle_zone";
      } else if (percentB >= 0) {
        position = "lower_zone";
      } else {
        position = "below_lower";
      }

      // Generate signal
      let signal:
        | "oversold_bounce"
        | "buy_dip"
        | "neutral"
        | "sell_rally"
        | "overbought_decline";

      if (position === "below_lower" || percentB < 0.1) {
        signal = "oversold_bounce"; // Strong buy signal
      } else if (position === "lower_zone" && percentB < 0.3) {
        signal = "buy_dip"; // Buy signal
      } else if (position === "above_upper" || percentB > 0.9) {
        signal = "overbought_decline"; // Strong sell signal
      } else if (position === "upper_zone" && percentB > 0.7) {
        signal = "sell_rally"; // Sell signal
      } else {
        signal = "neutral";
      }

      // Detect breakouts
      let breakout: "bullish_breakout" | "bearish_breakdown" | "none";

      if (currentPrice > upperBand && expansion) {
        breakout = "bullish_breakout";
      } else if (currentPrice < lowerBand && expansion) {
        breakout = "bearish_breakdown";
      } else {
        breakout = "none";
      }

      return {
        upperBand: Math.round(upperBand * 100) / 100,
        middleBand: Math.round(sma * 100) / 100,
        lowerBand: Math.round(lowerBand * 100) / 100,
        currentPrice: Math.round(currentPrice * 100) / 100,
        percentB: Math.round(percentB * 1000) / 1000,
        bandWidth: Math.round(bandWidth * 10000) / 10000,
        squeeze,
        expansion,
        position,
        signal,
        breakout,
      };
    } catch (error) {
      console.error("Bollinger Bands calculation error:", error);
      return null;
    }
  }
  static analyzeSupportResistance(
    priceData: PriceData[],
    period: number = 50
  ): SupportResistanceAnalysis | null {
    if (priceData.length < period) {
      console.warn(
        `S/R analysis: Need at least ${period} data points, got ${priceData.length}`
      );
      return null;
    }

    try {
      const recentData = priceData.slice(-period);
      const currentPrice = recentData[recentData.length - 1].close;

      // Find potential support and resistance levels
      const levels: SupportResistanceLevel[] = [];

      // Look for swing highs and lows
      for (let i = 2; i < recentData.length - 2; i++) {
        const current = recentData[i];
        const prev2 = recentData[i - 2];
        const prev1 = recentData[i - 1];
        const next1 = recentData[i + 1];
        const next2 = recentData[i + 2];

        // Swing High (Resistance)
        if (
          current.high > prev2.high &&
          current.high > prev1.high &&
          current.high > next1.high &&
          current.high > next2.high
        ) {
          levels.push({
            price: current.high,
            strength: this.calculateLevelStrength(
              current.high,
              recentData,
              "resistance"
            ),
            type: "resistance",
            tested: this.countTouches(current.high, recentData, 0.01), // 1% tolerance
            confidence: 0.7,
          });
        }

        // Swing Low (Support)
        if (
          current.low < prev2.low &&
          current.low < prev1.low &&
          current.low < next1.low &&
          current.low < next2.low
        ) {
          levels.push({
            price: current.low,
            strength: this.calculateLevelStrength(
              current.low,
              recentData,
              "support"
            ),
            type: "support",
            tested: this.countTouches(current.low, recentData, 0.01), // 1% tolerance
            confidence: 0.7,
          });
        }
      }

      // Sort levels by strength and remove duplicates
      const uniqueLevels = this.removeDuplicateLevels(levels, 0.02); // 2% tolerance for duplicates
      const sortedLevels = uniqueLevels.sort((a, b) => b.strength - a.strength);

      // Find nearest support and resistance
      const supports = sortedLevels.filter(
        (l) => l.type === "support" && l.price < currentPrice
      );
      const resistances = sortedLevels.filter(
        (l) => l.type === "resistance" && l.price > currentPrice
      );

      const nearestSupport =
        supports.length > 0
          ? supports.reduce((a, b) =>
              Math.abs(a.price - currentPrice) <
              Math.abs(b.price - currentPrice)
                ? a
                : b
            )
          : null;

      const nearestResistance =
        resistances.length > 0
          ? resistances.reduce((a, b) =>
              Math.abs(a.price - currentPrice) <
              Math.abs(b.price - currentPrice)
                ? a
                : b
            )
          : null;

      // Calculate position in range (0-100)
      let positionInRange = 50; // Default to middle
      if (nearestSupport && nearestResistance) {
        const range = nearestResistance.price - nearestSupport.price;
        const positionFromSupport = currentPrice - nearestSupport.price;
        positionInRange = (positionFromSupport / range) * 100;
      }

      // Determine signal based on proximity to levels
      let signal: "at_support" | "at_resistance" | "in_range" | "breakout";

      if (
        nearestSupport &&
        Math.abs(currentPrice - nearestSupport.price) / currentPrice < 0.02
      ) {
        signal = "at_support";
      } else if (
        nearestResistance &&
        Math.abs(currentPrice - nearestResistance.price) / currentPrice < 0.02
      ) {
        signal = "at_resistance";
      } else if (currentPrice > (resistances[0]?.price || Infinity)) {
        signal = "breakout";
      } else {
        signal = "in_range";
      }

      return {
        currentPrice,
        nearestSupport,
        nearestResistance,
        levels: sortedLevels.slice(0, 10), // Top 10 levels
        positionInRange: Math.round(positionInRange * 100) / 100,
        signal,
      };
    } catch (error) {
      console.error("Support/Resistance analysis error:", error);
      return null;
    }
  }

  // Helper: Detect EMA crossovers
  private static detectEMACrossover(
    prices: number[],
    fastPeriod: number,
    slowPeriod: number
  ): "golden_cross" | "death_cross" | "none" {
    if (prices.length < slowPeriod + 1) return "none";

    try {
      // Current EMAs
      const currentFastEMA = this.calculateEMA(prices, fastPeriod);
      const currentSlowEMA = this.calculateEMA(prices, slowPeriod);

      // Previous EMAs (1 period ago)
      const prevPrices = prices.slice(0, -1);
      const prevFastEMA = this.calculateEMA(prevPrices, fastPeriod);
      const prevSlowEMA = this.calculateEMA(prevPrices, slowPeriod);

      if (!currentFastEMA || !currentSlowEMA || !prevFastEMA || !prevSlowEMA) {
        return "none";
      }

      // Golden Cross: Fast EMA crosses above Slow EMA
      if (prevFastEMA <= prevSlowEMA && currentFastEMA > currentSlowEMA) {
        return "golden_cross";
      }

      // Death Cross: Fast EMA crosses below Slow EMA
      if (prevFastEMA >= prevSlowEMA && currentFastEMA < currentSlowEMA) {
        return "death_cross";
      }

      return "none";
    } catch (error) {
      return "none";
    }
  }

  // Helper: Calculate average band width for squeeze detection
  private static calculateAverageBandWidth(
    prices: number[],
    period: number,
    stdDev: number,
    lookback: number
  ): number {
    const bandWidths: number[] = [];

    for (let i = period; i <= prices.length - lookback; i++) {
      const subset = prices.slice(i - period, i);
      const sma = subset.reduce((a, b) => a + b, 0) / period;
      const variance =
        subset.reduce((sum, price) => sum + Math.pow(price - sma, 2), 0) /
        period;
      const standardDeviation = Math.sqrt(variance);
      const upperBand = sma + standardDeviation * stdDev;
      const lowerBand = sma - standardDeviation * stdDev;
      const bandWidth = (upperBand - lowerBand) / sma;
      bandWidths.push(bandWidth);
    }

    return bandWidths.length > 0
      ? bandWidths.reduce((a, b) => a + b, 0) / bandWidths.length
      : 0.1;
  }
  private static calculateEMA(prices: number[], period: number): number | null {
    if (prices.length < period) return null;

    const multiplier = 2 / (period + 1);
    let ema = prices.slice(0, period).reduce((a, b) => a + b, 0) / period;

    for (let i = period; i < prices.length; i++) {
      ema = prices[i] * multiplier + ema * (1 - multiplier);
    }

    return ema;
  }

  // Helper: Calculate level strength
  private static calculateLevelStrength(
    price: number,
    data: PriceData[],
    type: "support" | "resistance"
  ): number {
    let strength = 0;
    const tolerance = 0.015; // 1.5% tolerance

    for (const candle of data) {
      const testPrice = type === "support" ? candle.low : candle.high;
      const difference = Math.abs(testPrice - price) / price;

      if (difference <= tolerance) {
        strength += 1;
        // Add extra weight for volume
        if (candle.volume > 0) {
          strength += candle.volume / 1000000; // Normalize volume impact
        }
      }
    }

    return Math.round(strength * 100) / 100;
  }

  // Helper: Count how many times a level was touched
  private static countTouches(
    price: number,
    data: PriceData[],
    tolerance: number
  ): number {
    let touches = 0;

    for (const candle of data) {
      const highDiff = Math.abs(candle.high - price) / price;
      const lowDiff = Math.abs(candle.low - price) / price;

      if (highDiff <= tolerance || lowDiff <= tolerance) {
        touches++;
      }
    }

    return touches;
  }

  // Helper: Remove duplicate levels that are too close to each other
  private static removeDuplicateLevels(
    levels: SupportResistanceLevel[],
    tolerance: number
  ): SupportResistanceLevel[] {
    const unique: SupportResistanceLevel[] = [];

    for (const level of levels) {
      const isDuplicate = unique.some(
        (existing) =>
          Math.abs(existing.price - level.price) / level.price <= tolerance
      );

      if (!isDuplicate) {
        unique.push(level);
      } else {
        // If duplicate, keep the one with higher strength
        const existingIndex = unique.findIndex(
          (existing) =>
            Math.abs(existing.price - level.price) / level.price <= tolerance
        );

        if (level.strength > unique[existingIndex].strength) {
          unique[existingIndex] = level;
        }
      }
    }

    return unique;
  }

  // Comprehensive analysis for a single stock
  static analyzeStock(priceData: PriceData[]): {
    rsi: RSIResult | null;
    macd: MACDResult | null;
    ema: EMAAnalysis | null;
    bollingerBands: BollingerBandsResult | null;
    volume: VolumeAnalysis | null;
    supportResistance: SupportResistanceAnalysis | null;
  } {
    console.log(`📊 Analyzing stock with ${priceData.length} data points...`);

    const prices = priceData.map((d) => d.close);

    return {
      rsi: this.calculateRSI(prices),
      macd: this.calculateMACD(prices),
      ema: this.analyzeEMA(prices),
      bollingerBands: this.calculateBollingerBands(prices),
      volume: this.analyzeVolume(priceData),
      supportResistance: this.analyzeSupportResistance(priceData),
    };
  }
}
