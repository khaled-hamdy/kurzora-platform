// Enhanced Technical Indicators Calculator - RSI, MACD, Volume Analysis with Data Quality Handling
// File: src/lib/signals/technical-indicators.ts

export interface DataQuality {
  level: "Excellent" | "Good" | "Limited" | "Insufficient";
  score: number; // 0-100
  dataPoints: number;
  minRequired: number;
  adaptive: boolean; // Whether adaptive analysis was used
  message: string;
}

export interface RSIResult {
  value: number;
  signal: "oversold" | "overbought" | "neutral";
  strength: "strong" | "moderate" | "weak";
  trend: "bullish" | "bearish" | "neutral";
  dataQuality: DataQuality;
}

export interface MACDResult {
  macd: number;
  signal: number;
  histogram: number;
  trend: "bullish" | "bearish" | "neutral";
  crossover: "bullish_crossover" | "bearish_crossover" | "none";
  dataQuality: DataQuality;
}

export interface VolumeAnalysis {
  currentVolume: number;
  averageVolume: number;
  volumeRatio: number;
  volumeSpike: boolean;
  volumeTrend: "increasing" | "decreasing" | "stable";
  signal: "bullish" | "bearish" | "neutral";
  dataQuality: DataQuality;
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
  dataQuality: DataQuality;
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
  dataQuality: DataQuality;
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
  dataQuality: DataQuality;
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
  // Enhanced Data Quality Assessment
  private static assessDataQuality(
    dataPoints: number,
    minRequired: number,
    indicatorName: string
  ): DataQuality {
    const ratio = dataPoints / minRequired;
    let level: DataQuality["level"];
    let score: number;
    let adaptive = false;
    let message: string;

    if (dataPoints < 20) {
      level = "Insufficient";
      score = 0;
      message = `❌ ${indicatorName}: Insufficient data (${dataPoints} points) - Skipped`;
    } else if (ratio >= 1.0) {
      level = "Excellent";
      score = 100;
      message = `✅ ${indicatorName}: Excellent data quality (${dataPoints} points) - Full analysis`;
    } else if (ratio >= 0.8) {
      level = "Good";
      score = 85;
      message = `✅ ${indicatorName}: Good data quality (${dataPoints} points) - Standard analysis`;
    } else if (ratio >= 0.4) {
      level = "Limited";
      score = 65;
      adaptive = true;
      message = `⚠️ ${indicatorName}: Limited data quality (${dataPoints} points) - Adaptive analysis`;
    } else {
      level = "Insufficient";
      score = 0;
      message = `❌ ${indicatorName}: Insufficient data (${dataPoints} points) - Skipped`;
    }

    return {
      level,
      score,
      dataPoints,
      minRequired,
      adaptive,
      message,
    };
  }

  // RSI Calculation with Enhanced Data Quality Handling
  static calculateRSI(prices: number[], period: number = 14): RSIResult | null {
    const minRequired = period + 1; // 15 for RSI(14)
    const dataQuality = this.assessDataQuality(
      prices.length,
      minRequired,
      "RSI"
    );

    console.log(dataQuality.message);

    if (dataQuality.level === "Insufficient") {
      return null;
    }

    try {
      // Adaptive period for limited data
      let adaptivePeriod = period;
      if (dataQuality.adaptive && prices.length < minRequired) {
        adaptivePeriod = Math.max(7, Math.floor(prices.length * 0.7)); // Use 70% of available data, min 7
        console.log(
          `🔧 RSI: Using adaptive period ${adaptivePeriod} instead of ${period}`
        );
      }

      const gains: number[] = [];
      const losses: number[] = [];

      // Calculate price changes
      for (let i = 1; i < prices.length; i++) {
        const change = prices[i] - prices[i - 1];
        gains.push(change > 0 ? change : 0);
        losses.push(change < 0 ? Math.abs(change) : 0);
      }

      // Calculate average gains and losses for the adaptive period
      const avgGain =
        gains.slice(-adaptivePeriod).reduce((a, b) => a + b, 0) /
        adaptivePeriod;
      const avgLoss =
        losses.slice(-adaptivePeriod).reduce((a, b) => a + b, 0) /
        adaptivePeriod;

      // Avoid division by zero
      if (avgLoss === 0) {
        return {
          value: 100,
          signal: "overbought",
          strength: "strong",
          trend: "bullish",
          dataQuality,
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
        dataQuality,
      };
    } catch (error) {
      console.error("❌ RSI calculation error:", error);
      return null;
    }
  }

  // MACD Calculation with Enhanced Data Quality Handling
  static calculateMACD(
    prices: number[],
    fastPeriod: number = 12,
    slowPeriod: number = 26,
    signalPeriod: number = 9
  ): MACDResult | null {
    const minRequired = slowPeriod + signalPeriod; // 35 for MACD(12,26,9)
    const dataQuality = this.assessDataQuality(
      prices.length,
      minRequired,
      "MACD"
    );

    console.log(dataQuality.message);

    if (dataQuality.level === "Insufficient") {
      return null;
    }

    try {
      // Adaptive periods for limited data
      let adaptiveFast = fastPeriod;
      let adaptiveSlow = slowPeriod;
      let adaptiveSignal = signalPeriod;

      if (dataQuality.adaptive && prices.length < minRequired) {
        // Scale down periods proportionally
        const scaleFactor = Math.max(0.5, prices.length / minRequired);
        adaptiveFast = Math.max(5, Math.floor(fastPeriod * scaleFactor));
        adaptiveSlow = Math.max(10, Math.floor(slowPeriod * scaleFactor));
        adaptiveSignal = Math.max(3, Math.floor(signalPeriod * scaleFactor));

        console.log(
          `🔧 MACD: Using adaptive periods (${adaptiveFast},${adaptiveSlow},${adaptiveSignal}) instead of (${fastPeriod},${slowPeriod},${signalPeriod})`
        );
      }

      // Calculate EMAs
      const fastEMA = this.calculateEMA(prices, adaptiveFast);
      const slowEMA = this.calculateEMA(prices, adaptiveSlow);

      if (!fastEMA || !slowEMA) return null;

      // MACD Line = Fast EMA - Slow EMA
      const macdLine = fastEMA - slowEMA;

      // For Signal Line, we need multiple MACD values - simplified for demo
      const macdValues = [macdLine]; // In real implementation, calculate for multiple periods
      const signalLine = this.calculateEMA(macdValues, adaptiveSignal) || 0;

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
        dataQuality,
      };
    } catch (error) {
      console.error("❌ MACD calculation error:", error);
      return null;
    }
  }

  // Volume Analysis with Enhanced Data Quality Handling
  static analyzeVolume(
    priceData: PriceData[],
    period: number = 20
  ): VolumeAnalysis | null {
    const minRequired = period; // 20 for volume analysis
    const dataQuality = this.assessDataQuality(
      priceData.length,
      minRequired,
      "Volume"
    );

    console.log(dataQuality.message);

    if (dataQuality.level === "Insufficient") {
      return null;
    }

    try {
      // Adaptive period for limited data
      let adaptivePeriod = period;
      if (dataQuality.adaptive && priceData.length < minRequired) {
        adaptivePeriod = Math.max(5, Math.floor(priceData.length * 0.8)); // Use 80% of available data, min 5
        console.log(
          `🔧 Volume: Using adaptive period ${adaptivePeriod} instead of ${period}`
        );
      }

      const volumes = priceData.map((d) => d.volume);
      const currentVolume = volumes[volumes.length - 1];
      const recentVolumes = volumes.slice(-adaptivePeriod);
      const averageVolume =
        recentVolumes.reduce((a, b) => a + b, 0) / adaptivePeriod;

      // Volume ratio (current vs average)
      const volumeRatio = averageVolume > 0 ? currentVolume / averageVolume : 1;

      // Volume spike detection (2x average or more)
      const volumeSpike = volumeRatio >= 2.0;

      // Volume trend analysis (last 5 periods or adaptive)
      const trendPeriods = Math.min(5, Math.floor(adaptivePeriod / 2));
      const recentTrendVolumes = volumes.slice(-trendPeriods);
      const halfPoint = Math.floor(trendPeriods / 2);
      const firstHalf = recentTrendVolumes.slice(0, halfPoint);
      const secondHalf = recentTrendVolumes.slice(-halfPoint);

      let volumeTrend: "increasing" | "decreasing" | "stable";

      if (firstHalf.length > 0 && secondHalf.length > 0) {
        const firstAvg =
          firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
        const secondAvg =
          secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
        const trendRatio = secondAvg / firstAvg;

        if (trendRatio > 1.2) {
          volumeTrend = "increasing";
        } else if (trendRatio < 0.8) {
          volumeTrend = "decreasing";
        } else {
          volumeTrend = "stable";
        }
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
        dataQuality,
      };
    } catch (error) {
      console.error("❌ Volume analysis error:", error);
      return null;
    }
  }

  // EMA Analysis with Enhanced Data Quality Handling
  static analyzeEMA(prices: number[]): EMAAnalysis | null {
    const minRequired = 50; // 50 for EMA(20,50)
    const dataQuality = this.assessDataQuality(
      prices.length,
      minRequired,
      "EMA"
    );

    console.log(dataQuality.message);

    if (dataQuality.level === "Insufficient") {
      return null;
    }

    try {
      // Adaptive periods for limited data
      let adaptiveShort = 20;
      let adaptiveLong = 50;

      if (dataQuality.adaptive && prices.length < minRequired) {
        // Use shorter EMAs for limited data
        adaptiveShort = Math.max(10, Math.floor(prices.length * 0.4)); // 40% of available data
        adaptiveLong = Math.max(15, Math.floor(prices.length * 0.7)); // 70% of available data
        console.log(
          `🔧 EMA: Using adaptive periods (${adaptiveShort},${adaptiveLong}) instead of (20,50)`
        );
      }

      const emaShort = this.calculateEMA(prices, adaptiveShort);
      const emaLong = this.calculateEMA(prices, adaptiveLong);
      const currentPrice = prices[prices.length - 1];

      if (!emaShort || !emaLong) return null;

      // EMA Alignment
      let emaAlignment: "bullish" | "bearish" | "neutral";
      if (emaShort > emaLong * 1.005) {
        // 0.5% buffer to avoid noise
        emaAlignment = "bullish";
      } else if (emaShort < emaLong * 0.995) {
        emaAlignment = "bearish";
      } else {
        emaAlignment = "neutral";
      }

      // Price Position relative to EMAs
      let pricePosition: "above_both" | "between" | "below_both";
      if (currentPrice > emaShort && currentPrice > emaLong) {
        pricePosition = "above_both";
      } else if (currentPrice < emaShort && currentPrice < emaLong) {
        pricePosition = "below_both";
      } else {
        pricePosition = "between";
      }

      // Detect crossovers (need historical data for this - simplified)
      const crossover = this.detectEMACrossover(
        prices,
        adaptiveShort,
        adaptiveLong
      );

      // Determine trend strength
      let trend:
        | "strong_bullish"
        | "bullish"
        | "neutral"
        | "bearish"
        | "strong_bearish";
      const emaSpread = Math.abs(emaShort - emaLong) / emaLong;

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
        ema20: Math.round(emaShort * 100) / 100,
        ema50: Math.round(emaLong * 100) / 100,
        currentPrice: Math.round(currentPrice * 100) / 100,
        emaAlignment,
        pricePosition,
        crossover,
        trend,
        signal,
        dataQuality,
      };
    } catch (error) {
      console.error("❌ EMA analysis error:", error);
      return null;
    }
  }

  // Bollinger Bands Analysis with Enhanced Data Quality Handling
  static calculateBollingerBands(
    prices: number[],
    period: number = 20,
    stdDev: number = 2
  ): BollingerBandsResult | null {
    const minRequired = period; // 20 for Bollinger Bands
    const dataQuality = this.assessDataQuality(
      prices.length,
      minRequired,
      "Bollinger"
    );

    console.log(dataQuality.message);

    if (dataQuality.level === "Insufficient") {
      return null;
    }

    try {
      // Adaptive period for limited data
      let adaptivePeriod = period;
      if (dataQuality.adaptive && prices.length < minRequired) {
        adaptivePeriod = Math.max(10, Math.floor(prices.length * 0.8)); // Use 80% of available data, min 10
        console.log(
          `🔧 Bollinger: Using adaptive period ${adaptivePeriod} instead of ${period}`
        );
      }

      const recentPrices = prices.slice(-adaptivePeriod);
      const currentPrice = prices[prices.length - 1];

      // Calculate Simple Moving Average (Middle Band)
      const sma = recentPrices.reduce((a, b) => a + b, 0) / adaptivePeriod;

      // Calculate Standard Deviation
      const variance =
        recentPrices.reduce((sum, price) => sum + Math.pow(price - sma, 2), 0) /
        adaptivePeriod;
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
        adaptivePeriod,
        stdDev,
        Math.min(10, Math.floor(adaptivePeriod / 2))
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
        dataQuality,
      };
    } catch (error) {
      console.error("❌ Bollinger Bands calculation error:", error);
      return null;
    }
  }

  // Support/Resistance Analysis with Enhanced Data Quality Handling
  static analyzeSupportResistance(
    priceData: PriceData[],
    period: number = 50
  ): SupportResistanceAnalysis | null {
    const minRequired = period; // 50 for S/R analysis
    const dataQuality = this.assessDataQuality(
      priceData.length,
      minRequired,
      "S/R"
    );

    console.log(dataQuality.message);

    if (dataQuality.level === "Insufficient") {
      return null;
    }

    try {
      // Adaptive period for limited data
      let adaptivePeriod = period;
      if (dataQuality.adaptive && priceData.length < minRequired) {
        adaptivePeriod = Math.max(20, Math.floor(priceData.length * 0.9)); // Use 90% of available data, min 20
        console.log(
          `🔧 S/R: Using adaptive period ${adaptivePeriod} instead of ${period}`
        );
      }

      const recentData = priceData.slice(-adaptivePeriod);
      const currentPrice = recentData[recentData.length - 1].close;

      // Find potential support and resistance levels
      const levels: SupportResistanceLevel[] = [];

      // Adaptive swing detection based on data availability
      const swingLookback = Math.max(2, Math.floor(adaptivePeriod / 20)); // At least 2, scale with data

      // Look for swing highs and lows
      for (let i = swingLookback; i < recentData.length - swingLookback; i++) {
        const current = recentData[i];
        let isSwingHigh = true;
        let isSwingLow = true;

        // Check surrounding periods for swing identification
        for (let j = 1; j <= swingLookback; j++) {
          if (i - j >= 0 && i + j < recentData.length) {
            if (
              current.high <= recentData[i - j].high ||
              current.high <= recentData[i + j].high
            ) {
              isSwingHigh = false;
            }
            if (
              current.low >= recentData[i - j].low ||
              current.low >= recentData[i + j].low
            ) {
              isSwingLow = false;
            }
          }
        }

        // Swing High (Resistance)
        if (isSwingHigh) {
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
        if (isSwingLow) {
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
        dataQuality,
      };
    } catch (error) {
      console.error("❌ Support/Resistance analysis error:", error);
      return null;
    }
  }

  // Helper: Detect EMA crossovers with adaptive periods
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

    for (let i = period; i <= prices.length - Math.max(1, lookback); i++) {
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

  // Enhanced comprehensive analysis for a single stock with data quality reporting
  static analyzeStock(priceData: PriceData[]): {
    rsi: RSIResult | null;
    macd: MACDResult | null;
    ema: EMAAnalysis | null;
    bollingerBands: BollingerBandsResult | null;
    volume: VolumeAnalysis | null;
    supportResistance: SupportResistanceAnalysis | null;
    overallDataQuality: DataQuality;
  } {
    console.log(
      `📊 Enhanced analysis: ${priceData.length} data points available`
    );

    const prices = priceData.map((d) => d.close);

    // Perform all analyses
    const rsi = this.calculateRSI(prices);
    const macd = this.calculateMACD(prices);
    const ema = this.analyzeEMA(prices);
    const bollingerBands = this.calculateBollingerBands(prices);
    const volume = this.analyzeVolume(priceData);
    const supportResistance = this.analyzeSupportResistance(priceData);

    // Calculate overall data quality
    const qualities = [
      rsi?.dataQuality,
      macd?.dataQuality,
      ema?.dataQuality,
      bollingerBands?.dataQuality,
      volume?.dataQuality,
      supportResistance?.dataQuality,
    ].filter(Boolean) as DataQuality[];

    let overallDataQuality: DataQuality;

    if (qualities.length === 0) {
      overallDataQuality = {
        level: "Insufficient",
        score: 0,
        dataPoints: priceData.length,
        minRequired: 50,
        adaptive: false,
        message: "❌ Overall: Insufficient data for analysis",
      };
    } else {
      const avgScore =
        qualities.reduce((sum, q) => sum + q.score, 0) / qualities.length;
      const excellentCount = qualities.filter(
        (q) => q.level === "Excellent"
      ).length;
      const adaptiveCount = qualities.filter((q) => q.adaptive).length;

      let level: DataQuality["level"];
      if (avgScore >= 95) level = "Excellent";
      else if (avgScore >= 80) level = "Good";
      else if (avgScore >= 50) level = "Limited";
      else level = "Insufficient";

      overallDataQuality = {
        level,
        score: Math.round(avgScore),
        dataPoints: priceData.length,
        minRequired: 50,
        adaptive: adaptiveCount > 0,
        message: `📊 Overall: ${level} data quality (${Math.round(
          avgScore
        )}/100) - ${excellentCount}/${qualities.length} indicators optimal${
          adaptiveCount > 0 ? `, ${adaptiveCount} adaptive` : ""
        }`,
      };
    }

    console.log(overallDataQuality.message);

    return {
      rsi,
      macd,
      ema,
      bollingerBands,
      volume,
      supportResistance,
      overallDataQuality,
    };
  }
}
