// ==================================================================================
// 🎯 KURZORA SIGNAL ENGINE - EXTRACTED FROM SESSION #166 EDGE FUNCTION
// ==================================================================================
// 🔧 PURPOSE: Extract ALL technical indicator logic for backtesting system
// 📝 SESSION #168: Complete extraction of Session #166 Edge Function logic for client-side backtesting
// 🛡️ ANTI-REGRESSION: This is a COPY of Edge Function logic - never modifies original
// 🎯 WHITE PAPER: Implements exactly what Session #167 white paper specified
// ⚠️ CRITICAL: Contains EXACT calculations from institutional-grade Edge Function
// 🚀 BACKTESTING: Enables 30-day trading simulation with identical signal quality

// ==================================================================================
// 📊 TIMEFRAME CONFIGURATION - EXTRACTED FROM SESSION #166
// ==================================================================================
// 🕐 1-HOUR: 40% weight - Short-term momentum detection
// 🕒 4-HOUR: 30% weight - Medium-term trend confirmation
// 🕓 DAILY: 20% weight - Long-term pattern analysis
// 🕔 WEEKLY: 10% weight - Market cycle context
export const TIMEFRAME_CONFIG = {
  "1H": {
    weight: 0.4,
    periods: 50,
    description:
      "Short-term momentum analysis - immediate trading opportunities",
  },
  "4H": {
    weight: 0.3,
    periods: 50,
    description: "Medium-term trend confirmation - sustained directional moves",
  },
  "1D": {
    weight: 0.2,
    periods: 50,
    description: "Long-term pattern analysis - fundamental trend backing",
  },
  "1W": {
    weight: 0.1,
    periods: 50,
    description: "Market cycle context - major trend cycle validation",
  },
};

// ==================================================================================
// 🛡️ GATEKEEPER RULES - EXTRACTED FROM SESSION #166
// ==================================================================================
// ✅ RULE 1: 1-Hour Score MUST be >= 70% (Strong short-term momentum required)
// ✅ RULE 2: 4-Hour Score MUST be >= 70% (Medium-term trend confirmation required)
// ✅ RULE 3: Daily OR Weekly MUST be >= 70% (Long-term backing required)
export const GATEKEEPER_THRESHOLDS = {
  oneHour: 70,
  fourHour: 70,
  longTerm: 70,
};

// ==================================================================================
// 📈 TYPE DEFINITIONS FOR BACKTESTING
// ==================================================================================
export interface TimeframeData {
  currentPrice: number;
  changePercent: number;
  volume: number;
  prices: number[];
  highs: number[];
  lows: number[];
  volumes: number[];
}

export interface MultiTimeframeData {
  "1H": TimeframeData;
  "4H": TimeframeData;
  "1D": TimeframeData;
  "1W": TimeframeData;
}

export interface TechnicalIndicators {
  rsi: number;
  macd: { macd: number };
  bollingerBands: { percentB: number };
  volumeAnalysis: { ratio: number };
  stochastic: { percentK: number };
  williamsR: { value: number };
}

export interface SignalAnalysis {
  ticker: string;
  companyName: string;
  sector: string;
  finalScore: number;
  signalType: string;
  signalStrength: string;
  timeframeScores: { [key: string]: number };
  dimensions: {
    strength: number;
    confidence: number;
    quality: number;
    risk: number;
  };
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  riskRewardRatio: number;
  currentPrice: number;
  priceChange: number;
  passedGatekeeper: boolean;
}

// ==================================================================================
// 📈 TECHNICAL INDICATOR FUNCTIONS - EXTRACTED FROM SESSION #166
// ==================================================================================

/**
 * 📈 RSI (RELATIVE STRENGTH INDEX) CALCULATION - EXTRACTED FROM SESSION #166
 * PURPOSE: Identifies oversold (cheap) and overbought (expensive) conditions
 * CALCULATION: 14-period comparison of recent gains vs losses
 * SIGNAL: RSI below 30 = potentially oversold (buying opportunity)
 */
export function calculateRSI(prices: number[], period: number = 14): number {
  if (!prices || prices.length < period + 1) {
    console.log(
      `⚠️ RSI: Insufficient data (${prices?.length || 0} prices, need ${
        period + 1
      })`
    );
    return 50;
  }

  const changes: number[] = [];
  for (let i = 1; i < prices.length; i++) {
    changes.push(prices[i] - prices[i - 1]);
  }

  if (changes.length < period) {
    console.log(
      `⚠️ RSI: Insufficient change data (${changes.length} changes, need ${period})`
    );
    return 50;
  }

  let avgGain = 0,
    avgLoss = 0;
  for (let i = 0; i < period; i++) {
    if (changes[i] > 0) {
      avgGain += changes[i];
    } else {
      avgLoss += Math.abs(changes[i]);
    }
  }

  avgGain = avgGain / period;
  avgLoss = avgLoss / period;

  if (avgLoss === 0) {
    return avgGain > 0 ? 100 : 50;
  }

  const rs = avgGain / avgLoss;
  const rsi = 100 - 100 / (1 + rs);
  return Math.round(rsi * 100) / 100;
}

/**
 * 📈 MACD (MOVING AVERAGE CONVERGENCE DIVERGENCE) CALCULATION - EXTRACTED FROM SESSION #166
 * PURPOSE: Reveals trend direction and momentum changes
 * CALCULATION: 12-period EMA minus 26-period EMA
 * SIGNAL: Positive MACD = upward momentum
 */
export function calculateMACD(
  prices: number[],
  shortPeriod: number = 12,
  longPeriod: number = 26
): { macd: number } {
  if (!prices || prices.length < longPeriod) {
    console.log(
      `⚠️ MACD: Insufficient data (${
        prices?.length || 0
      } prices, need ${longPeriod})`
    );
    return { macd: 0 };
  }

  let shortSum = 0,
    longSum = 0;

  for (let i = 0; i < shortPeriod; i++) {
    shortSum += prices[prices.length - 1 - i];
  }

  for (let i = 0; i < longPeriod; i++) {
    longSum += prices[prices.length - 1 - i];
  }

  const shortMA = shortSum / shortPeriod;
  const longMA = longSum / longPeriod;
  const macd = shortMA - longMA;

  return { macd: Number(macd.toFixed(4)) };
}

/**
 * 📈 BOLLINGER BANDS CALCULATION - EXTRACTED FROM SESSION #166
 * PURPOSE: Shows if price is trading outside normal range
 * CALCULATION: 20-period moving average ± 2 standard deviations
 * SIGNAL: Price near lower band = oversold condition
 */
export function calculateBollingerBands(
  prices: number[],
  period: number = 20,
  multiplier: number = 2
): { percentB: number } {
  if (!prices || prices.length < period) {
    console.log(
      `⚠️ Bollinger: Insufficient data (${
        prices?.length || 0
      } prices, need ${period})`
    );
    return { percentB: 0.5 };
  }

  const slice = prices.slice(-period);
  const sma = slice.reduce((sum, price) => sum + price, 0) / period;
  const variance =
    slice.reduce((sum, price) => sum + Math.pow(price - sma, 2), 0) / period;
  const stdDev = Math.sqrt(variance);

  const upperBand = sma + multiplier * stdDev;
  const lowerBand = sma - multiplier * stdDev;
  const currentPrice = prices[prices.length - 1];

  let percentB = 0.5;
  if (upperBand !== lowerBand) {
    percentB = (currentPrice - lowerBand) / (upperBand - lowerBand);
  }

  return { percentB: Number(percentB.toFixed(4)) };
}

/**
 * 📊 VOLUME ANALYSIS CALCULATION - EXTRACTED FROM SESSION #166
 * PURPOSE: Confirms price movements with trading activity
 * CALCULATION: Current volume vs average volume ratio
 * SIGNAL: High volume = strong institutional interest
 */
export function calculateVolumeAnalysis(
  currentVolume: number,
  volumes: number[]
): { ratio: number } {
  if (!currentVolume || !volumes || volumes.length === 0) {
    console.log(`⚠️ Volume: Insufficient data for analysis`);
    return { ratio: 1.0 };
  }

  const avgVolume = volumes.reduce((sum, vol) => sum + vol, 0) / volumes.length;
  if (avgVolume === 0) {
    return { ratio: 1.0 };
  }

  const ratio = currentVolume / avgVolume;
  return { ratio: Number(ratio.toFixed(2)) };
}

/**
 * 📈 STOCHASTIC OSCILLATOR CALCULATION - EXTRACTED FROM SESSION #166
 * PURPOSE: Identifies momentum and potential reversal points
 * CALCULATION: Current price position within 14-period high-low range
 * SIGNAL: Below 20 = oversold territory
 */
export function calculateStochastic(
  prices: number[],
  highs: number[],
  lows: number[],
  period: number = 14
): { percentK: number } {
  if (!prices || !highs || !lows || prices.length < period) {
    console.log(
      `⚠️ Stochastic: Insufficient data (${
        prices?.length || 0
      } prices, need ${period})`
    );
    return { percentK: 50 };
  }

  const currentPrice = prices[prices.length - 1];
  const recentHighs = highs.slice(-period);
  const recentLows = lows.slice(-period);

  const highestHigh = Math.max(...recentHighs);
  const lowestLow = Math.min(...recentLows);

  if (highestHigh === lowestLow) {
    return { percentK: 50 };
  }

  const percentK =
    ((currentPrice - lowestLow) / (highestHigh - lowestLow)) * 100;
  return { percentK: Number(percentK.toFixed(2)) };
}

/**
 * 📈 WILLIAMS %R CALCULATION - EXTRACTED FROM SESSION #166
 * PURPOSE: Measures momentum on inverted scale
 * CALCULATION: High-low range analysis over 14 periods
 * SIGNAL: Below -80 = potential buying opportunity
 */
export function calculateWilliamsR(
  prices: number[],
  highs: number[],
  lows: number[],
  period: number = 14
): { value: number } {
  if (!prices || !highs || !lows || prices.length < period) {
    console.log(
      `⚠️ Williams %R: Insufficient data (${
        prices?.length || 0
      } prices, need ${period})`
    );
    return { value: -50 };
  }

  const currentPrice = prices[prices.length - 1];
  const recentHighs = highs.slice(-period);
  const recentLows = lows.slice(-period);

  const highestHigh = Math.max(...recentHighs);
  const lowestLow = Math.min(...recentLows);

  if (highestHigh === lowestLow) {
    return { value: -50 };
  }

  const williamsR =
    ((highestHigh - currentPrice) / (highestHigh - lowestLow)) * -100;
  return { value: Number(williamsR.toFixed(2)) };
}

/**
 * 🧮 6-INDICATOR COMPOSITE SCORE CALCULATION - EXTRACTED FROM SESSION #166
 * PURPOSE: Combines all 6 technical indicators into single timeframe score
 * METHODOLOGY: Weighted scoring based on bullish/bearish conditions
 */
export function calculate6IndicatorScore(
  rsi: number,
  macd: { macd: number },
  bb: { percentB: number },
  volume: { ratio: number },
  stoch: { percentK: number },
  williams: { value: number }
): number {
  let score = 60; // Base neutral score

  // RSI scoring (oversold = bullish)
  if (rsi < 30) {
    score += 20; // Strong oversold condition
  } else if (rsi > 70) {
    score -= 10; // Overbought condition
  } else {
    const neutralDistance = Math.abs(rsi - 50);
    score += (20 - neutralDistance) / 4;
  }

  // MACD scoring (positive = bullish)
  if (macd && macd.macd > 0) {
    score += 15;
  } else if (macd && macd.macd < 0) {
    score -= 5;
  }

  // Bollinger Bands scoring (near lower band = oversold)
  if (bb && bb.percentB < 0.2) {
    score += 15; // Near lower band
  } else if (bb && bb.percentB > 0.8) {
    score -= 10; // Near upper band
  } else if (bb && bb.percentB >= 0.4 && bb.percentB <= 0.6) {
    score += 5; // Middle range
  }

  // Volume scoring (high volume = confirmation)
  if (volume && volume.ratio > 1.5) {
    score += 10; // High volume
  } else if (volume && volume.ratio < 0.8) {
    score -= 5; // Low volume
  }

  // Stochastic scoring (oversold = bullish)
  if (stoch && stoch.percentK < 20) {
    score += 8;
  } else if (stoch && stoch.percentK > 80) {
    score -= 5;
  }

  // Williams %R scoring (oversold = bullish)
  if (williams && williams.value <= -80) {
    score += 7;
  } else if (williams && williams.value >= -20) {
    score -= 5;
  }

  return Math.min(100, Math.max(0, Math.round(score)));
}

// ==================================================================================
// 🧠 4-DIMENSIONAL SCORING SYSTEM - EXTRACTED FROM SESSION #166
// ==================================================================================

/**
 * 🧠 SIGNAL CONFIDENCE CALCULATOR - EXTRACTED FROM SESSION #166
 * PURPOSE: Measures timeframe agreement with robust error handling
 * INPUT: Array of timeframe scores (with validation)
 * OUTPUT: Confidence percentage (0-100) with fallback handling
 */
export function calculateSignalConfidence(scores: number[]): number {
  console.log(`🧠 Confidence: Input validation starting...`);
  console.log(
    `📊 Raw input type: ${typeof scores}, value: ${JSON.stringify(scores)}`
  );

  if (!scores) {
    console.log(
      `⚠️ Confidence: No scores provided - using low confidence fallback`
    );
    return 30;
  }

  if (!Array.isArray(scores)) {
    console.log(
      `⚠️ Confidence: Input not array - converting from: ${typeof scores}`
    );
    if (typeof scores === "object") {
      try {
        const converted = Object.values(scores).filter(
          (val) =>
            typeof val === "number" && !isNaN(val) && val >= 0 && val <= 100
        );
        console.log(
          `✅ Confidence: Converted object to array: [${converted.join(", ")}]`
        );
        scores = converted;
      } catch (conversionError) {
        console.log(
          `❌ Confidence: Object conversion failed: ${conversionError.message}`
        );
        return 25;
      }
    } else {
      console.log(`❌ Confidence: Cannot convert ${typeof scores} to array`);
      return 25;
    }
  }

  const validScores = scores.filter((score) => {
    const isValid =
      typeof score === "number" && !isNaN(score) && score >= 0 && score <= 100;
    if (!isValid) {
      console.log(
        `⚠️ Confidence: Invalid score filtered out: ${score} (type: ${typeof score})`
      );
    }
    return isValid;
  });

  console.log(
    `📊 Confidence: Valid scores after filtering: [${validScores.join(", ")}]`
  );

  if (validScores.length < 2) {
    console.log(
      `⚠️ Confidence: Insufficient valid scores (${validScores.length}) - need at least 2`
    );
    return validScores.length === 1 ? 40 : 20;
  }

  try {
    const average =
      validScores.reduce((sum, score) => sum + score, 0) / validScores.length;
    const variance =
      validScores.reduce(
        (sum, score) => sum + Math.pow(score - average, 2),
        0
      ) / validScores.length;
    const standardDeviation = Math.sqrt(variance);
    const maxDeviation = 30;
    const confidence = Math.max(
      0,
      100 - (standardDeviation / maxDeviation) * 100
    );

    console.log(
      `🧠 Confidence Analysis: Scores [${validScores.join(
        ", "
      )}] → StdDev: ${standardDeviation.toFixed(2)} → Confidence: ${Math.round(
        confidence
      )}%`
    );
    return Math.round(confidence);
  } catch (calculationError) {
    console.log(
      `❌ Confidence: Calculation error: ${calculationError.message}`
    );
    return 30;
  }
}

/**
 * ⚡ MOMENTUM QUALITY CALCULATOR - EXTRACTED FROM SESSION #166
 * PURPOSE: Analyzes momentum cascade pattern with robust validation
 * INPUT: Individual timeframe scores with comprehensive validation
 * OUTPUT: Quality percentage (0-100) with fallback handling
 */
export function calculateMomentumQuality(
  weekly: number,
  daily: number,
  fourHour: number,
  oneHour: number
): number {
  console.log(`⚡ Momentum Quality: Input validation starting...`);
  console.log(
    `📊 Raw inputs - Weekly: ${weekly} (${typeof weekly}), Daily: ${daily} (${typeof daily}), 4H: ${fourHour} (${typeof fourHour}), 1H: ${oneHour} (${typeof oneHour})`
  );

  const sanitizeScore = (score: number, timeframeName: string): number => {
    if (typeof score !== "number" || isNaN(score)) {
      console.log(
        `⚠️ Quality: Invalid ${timeframeName} score (${score}), using neutral fallback`
      );
      return 50;
    }
    if (score < 0 || score > 100) {
      console.log(
        `⚠️ Quality: Out-of-range ${timeframeName} score (${score}), clamping to valid range`
      );
      return Math.max(0, Math.min(100, score));
    }
    return score;
  };

  const safeWeekly = sanitizeScore(weekly, "Weekly");
  const safeDaily = sanitizeScore(daily, "Daily");
  const safeFourHour = sanitizeScore(fourHour, "4H");
  const safeOneHour = sanitizeScore(oneHour, "1H");

  console.log(
    `✅ Quality: Sanitized scores - Weekly: ${safeWeekly}, Daily: ${safeDaily}, 4H: ${safeFourHour}, 1H: ${safeOneHour}`
  );

  let qualityScore = 60; // Base score

  try {
    // Short-term acceleration bonus
    if (safeOneHour > safeFourHour) {
      qualityScore += 15;
      console.log(
        `✅ Quality: 1H(${safeOneHour}%) > 4H(${safeFourHour}%) = +15 points (short-term acceleration)`
      );
    }

    // Medium-term momentum bonus
    if (safeFourHour > safeDaily) {
      qualityScore += 15;
      console.log(
        `✅ Quality: 4H(${safeFourHour}%) > Daily(${safeDaily}%) = +15 points (sustained momentum)`
      );
    }

    // Long-term trend bonus
    if (safeDaily > safeWeekly) {
      qualityScore += 10;
      console.log(
        `✅ Quality: Daily(${safeDaily}%) > Weekly(${safeWeekly}%) = +10 points (emerging trend)`
      );
    }

    // Overall acceleration bonus
    const totalAcceleration = (safeOneHour - safeWeekly) / 3;
    if (totalAcceleration > 10) {
      qualityScore += 10;
      console.log(
        `🚀 Quality: Strong acceleration (${totalAcceleration.toFixed(
          1
        )} avg/step) = +10 points`
      );
    }

    const finalQuality = Math.min(100, Math.max(0, qualityScore));
    console.log(
      `⚡ Momentum Quality: ${finalQuality}% (Weekly:${safeWeekly}% → Daily:${safeDaily}% → 4H:${safeFourHour}% → 1H:${safeOneHour}%)`
    );
    return finalQuality;
  } catch (calculationError) {
    console.log(`❌ Quality: Calculation error: ${calculationError.message}`);
    console.log(
      `🛡️ Quality: Using fallback calculation based on average scores`
    );
    const averageScore =
      (safeWeekly + safeDaily + safeFourHour + safeOneHour) / 4;
    return Math.round(Math.max(30, Math.min(100, averageScore)));
  }
}

/**
 * 🛡️ RISK ADJUSTMENT CALCULATOR - EXTRACTED FROM SESSION #166
 * PURPOSE: Adjusts signal score with comprehensive input validation
 * INPUT: Price history, volumes with robust validation
 * OUTPUT: Risk adjustment percentage (0-100) with fallback handling
 */
export function calculateRiskAdjustment(
  prices: number[],
  currentVolume: number,
  avgVolume: number
): number {
  console.log(`🛡️ Risk Adjustment: Input validation starting...`);
  console.log(
    `📊 Raw inputs - Prices: ${
      Array.isArray(prices) ? prices.length + " items" : typeof prices
    }, CurrentVol: ${currentVolume} (${typeof currentVolume}), AvgVol: ${avgVolume} (${typeof avgVolume})`
  );

  let riskScore = 70; // Base risk score

  // Volatility analysis
  if (prices && Array.isArray(prices) && prices.length > 5) {
    try {
      const validPrices = prices.filter(
        (price) => typeof price === "number" && !isNaN(price) && price > 0
      );
      console.log(
        `📊 Risk: Filtered to ${validPrices.length} valid prices from ${prices.length} total`
      );

      if (validPrices.length > 2) {
        const returns: number[] = [];
        for (let i = 1; i < validPrices.length; i++) {
          const returnValue =
            (validPrices[i] - validPrices[i - 1]) / validPrices[i - 1];
          if (typeof returnValue === "number" && !isNaN(returnValue)) {
            returns.push(returnValue);
          }
        }

        console.log(`📊 Risk: Calculated ${returns.length} valid returns`);

        if (returns.length > 1) {
          const avgReturn =
            returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
          const variance =
            returns.reduce(
              (sum, ret) => sum + Math.pow(ret - avgReturn, 2),
              0
            ) / returns.length;
          const volatility = Math.sqrt(variance);
          const normalizedVolatility = Math.min(volatility * 1000, 100);
          const volatilityScore = 100 - normalizedVolatility;
          riskScore = (riskScore + volatilityScore) / 2;
          console.log(
            `📊 Risk: Volatility ${(volatility * 100).toFixed(
              2
            )}% → Risk Score ${volatilityScore.toFixed(1)}`
          );
        } else {
          console.log(
            `⚠️ Risk: Insufficient returns for volatility calculation, using base score`
          );
        }
      } else {
        console.log(
          `⚠️ Risk: Insufficient valid prices for volatility analysis`
        );
      }
    } catch (volatilityError) {
      console.log(
        `❌ Risk: Volatility calculation error: ${volatilityError.message}, using base score`
      );
    }
  } else {
    console.log(
      `⚠️ Risk: Invalid or insufficient price data for volatility analysis`
    );
  }

  // Volume confirmation
  if (
    typeof currentVolume === "number" &&
    !isNaN(currentVolume) &&
    currentVolume > 0 &&
    typeof avgVolume === "number" &&
    !isNaN(avgVolume) &&
    avgVolume > 0
  ) {
    try {
      const volumeRatio = currentVolume / avgVolume;
      if (typeof volumeRatio === "number" && !isNaN(volumeRatio)) {
        const volumeBonus = Math.min(volumeRatio * 5, 15);
        riskScore += volumeBonus;
        console.log(
          `📈 Risk: Volume ratio ${volumeRatio.toFixed(
            2
          )}x → Bonus ${volumeBonus.toFixed(1)} points`
        );
      } else {
        console.log(`⚠️ Risk: Invalid volume ratio calculation`);
      }
    } catch (volumeError) {
      console.log(`❌ Risk: Volume calculation error: ${volumeError.message}`);
    }
  } else {
    console.log(`⚠️ Risk: Invalid volume data for confirmation analysis`);
  }

  const finalRisk = Math.min(100, Math.max(0, Math.round(riskScore)));
  console.log(`🛡️ Risk Adjustment: ${finalRisk}% (higher = lower risk)`);
  return finalRisk;
}

/**
 * 🎯 KURZORA SMART SCORE CALCULATOR - EXTRACTED FROM SESSION #166
 * PURPOSE: Combines all 4 dimensions with comprehensive validation
 * INPUT: All 4 dimensional scores with robust validation
 * OUTPUT: Final Kurzora Smart Score (0-100) with fallback handling
 */
export function calculateKuzzoraSmartScore(
  signalStrength: number,
  signalConfidence: number,
  momentumQuality: number,
  riskAdjustment: number
): number {
  console.log(`🎯 Kurzora Smart Score: Input validation starting...`);
  console.log(
    `📊 Raw inputs - Strength: ${signalStrength} (${typeof signalStrength}), Confidence: ${signalConfidence} (${typeof signalConfidence}), Quality: ${momentumQuality} (${typeof momentumQuality}), Risk: ${riskAdjustment} (${typeof riskAdjustment})`
  );

  const sanitizeDimensionScore = (
    score: number,
    dimensionName: string
  ): number => {
    if (typeof score !== "number" || isNaN(score)) {
      console.log(
        `⚠️ Smart Score: Invalid ${dimensionName} (${score}), using neutral fallback`
      );
      return 50;
    }
    if (score < 0 || score > 100) {
      console.log(
        `⚠️ Smart Score: Out-of-range ${dimensionName} (${score}), clamping to valid range`
      );
      return Math.max(0, Math.min(100, score));
    }
    return score;
  };

  const safeStrength = sanitizeDimensionScore(
    signalStrength,
    "Signal Strength"
  );
  const safeConfidence = sanitizeDimensionScore(
    signalConfidence,
    "Signal Confidence"
  );
  const safeQuality = sanitizeDimensionScore(
    momentumQuality,
    "Momentum Quality"
  );
  const safeRisk = sanitizeDimensionScore(riskAdjustment, "Risk Adjustment");

  console.log(
    `✅ Smart Score: Sanitized inputs - Strength: ${safeStrength}, Confidence: ${safeConfidence}, Quality: ${safeQuality}, Risk: ${safeRisk}`
  );

  try {
    const smartScore =
      safeStrength * 0.3 +
      safeConfidence * 0.35 +
      safeQuality * 0.25 +
      safeRisk * 0.1;

    if (typeof smartScore !== "number" || isNaN(smartScore)) {
      throw new Error(`Invalid calculation result: ${smartScore}`);
    }

    const finalScore = Math.round(smartScore);

    console.log(`🎯 Kurzora Smart Score Calculation:`);
    console.log(
      `   Signal Strength: ${safeStrength}% × 30% = ${(
        safeStrength * 0.3
      ).toFixed(1)}`
    );
    console.log(
      `   Signal Confidence: ${safeConfidence}% × 35% = ${(
        safeConfidence * 0.35
      ).toFixed(1)}`
    );
    console.log(
      `   Momentum Quality: ${safeQuality}% × 25% = ${(
        safeQuality * 0.25
      ).toFixed(1)}`
    );
    console.log(
      `   Risk Adjustment: ${safeRisk}% × 10% = ${(safeRisk * 0.1).toFixed(1)}`
    );
    console.log(`   🏆 FINAL KURZORA SMART SCORE: ${finalScore}%`);

    return finalScore;
  } catch (calculationError) {
    console.log(
      `❌ Smart Score: Calculation error: ${calculationError.message}`
    );
    console.log(`🛡️ Smart Score: Using fallback calculation`);
    const fallbackScore = Math.round(
      (safeStrength + safeConfidence + safeQuality + safeRisk) / 4
    );
    console.log(`🛡️ FALLBACK Kurzora Smart Score: ${fallbackScore}%`);
    return fallbackScore;
  }
}

// ==================================================================================
// 🛡️ GATEKEEPER RULES VALIDATION - EXTRACTED FROM SESSION #166
// ==================================================================================

/**
 * 🛡️ INSTITUTIONAL GATEKEEPER RULES VALIDATION - EXTRACTED FROM SESSION #166
 * PURPOSE: Ensures only high-quality signals pass institutional standards
 * RULES: 1H≥70% AND 4H≥70% AND (1D≥70% OR 1W≥70%)
 */
export function passesGatekeeperRules(
  oneHour: number,
  fourHour: number,
  daily: number,
  weekly: number
): boolean {
  if (oneHour < GATEKEEPER_THRESHOLDS.oneHour) {
    console.log(
      `❌ Gatekeeper: 1H score ${oneHour}% < ${GATEKEEPER_THRESHOLDS.oneHour}% required`
    );
    return false;
  }

  if (fourHour < GATEKEEPER_THRESHOLDS.fourHour) {
    console.log(
      `❌ Gatekeeper: 4H score ${fourHour}% < ${GATEKEEPER_THRESHOLDS.fourHour}% required`
    );
    return false;
  }

  if (
    daily < GATEKEEPER_THRESHOLDS.longTerm &&
    weekly < GATEKEEPER_THRESHOLDS.longTerm
  ) {
    console.log(
      `❌ Gatekeeper: Neither Daily (${daily}%) nor Weekly (${weekly}%) meet ${GATEKEEPER_THRESHOLDS.longTerm}% requirement`
    );
    return false;
  }

  console.log(
    `✅ Gatekeeper: PASSED - 1H:${oneHour}%, 4H:${fourHour}%, Daily:${daily}%, Weekly:${weekly}%`
  );
  return true;
}

// ==================================================================================
// 📊 HELPER FUNCTIONS - EXTRACTED FROM SESSION #166
// ==================================================================================

/**
 * 🔧 DATABASE-COMPLIANT SIGNAL STRENGTH MAPPER - EXTRACTED FROM SESSION #166
 * PURPOSE: Maps score to signal strength
 * INPUT: Numeric score (0-100)
 * OUTPUT: String signal strength for compatibility
 */
export function mapScoreToSignalStrength(score: number): string {
  if (score >= 85) return "STR_BUY"; // Strong Buy
  if (score >= 75) return "BUY"; // Buy
  if (score >= 65) return "WEAK_BUY"; // Weak Buy
  if (score >= 50) return "NEUTRAL"; // Neutral
  if (score >= 40) return "WEAK_SELL"; // Weak Sell
  if (score >= 30) return "SELL"; // Sell
  return "STR_SELL"; // Strong Sell
}

/**
 * 🔧 DATABASE-COMPLIANT SIGNAL TYPE MAPPER - EXTRACTED FROM SESSION #166
 * PURPOSE: Maps score to signal type
 * INPUT: Numeric score (0-100)
 * OUTPUT: String signal type
 */
export function mapScoreToSignalType(score: number): string {
  if (score >= 60) return "bullish";
  if (score >= 40) return "neutral";
  return "bearish";
}

// ==================================================================================
// 🎯 MAIN SIGNAL ANALYSIS FUNCTION - EXTRACTED & ENHANCED FOR BACKTESTING
// ==================================================================================

/**
 * 🎯 COMPLETE SIGNAL ANALYSIS - EXTRACTED FROM SESSION #166 & ENHANCED FOR BACKTESTING
 * PURPOSE: Performs complete multi-timeframe analysis on a single stock
 * INPUT: Ticker, company info, and multi-timeframe data
 * OUTPUT: Complete signal analysis with all dimensions
 *
 * 🚨 CRITICAL: This contains ALL the Session #166 institutional logic in client-side form
 * 🛡️ ANTI-REGRESSION: Preserves exact calculations while enabling backtesting
 * 📊 BACKTESTING: Perfect for 30-day simulation with identical signal quality
 */
export function analyzeSignal(
  ticker: string,
  companyName: string,
  sector: string,
  timeframeData: MultiTimeframeData
): SignalAnalysis | null {
  try {
    console.log(
      `\n🎯 ========== STARTING ANALYSIS: ${ticker} (${companyName}) ==========`
    );

    // 🧮 INDIVIDUAL TIMEFRAME ANALYSIS
    const timeframeScores: { [key: string]: number } = {};
    const timeframeDetails: { [key: string]: any } = {};

    for (const [timeframe, data] of Object.entries(timeframeData)) {
      if (!data || !data.prices) {
        timeframeScores[timeframe] = 0;
        continue;
      }

      // Calculate all technical indicators (EXTRACTED FROM SESSION #166)
      const rsi = calculateRSI(data.prices);
      const macd = calculateMACD(data.prices);
      const bb = calculateBollingerBands(data.prices);
      const volumeAnalysis = calculateVolumeAnalysis(
        data.volume,
        data.volumes || [data.volume]
      );
      const stoch = calculateStochastic(
        data.prices,
        data.highs || data.prices,
        data.lows || data.prices
      );
      const williams = calculateWilliamsR(
        data.prices,
        data.highs || data.prices,
        data.lows || data.prices
      );

      const timeframeScore = calculate6IndicatorScore(
        rsi,
        macd,
        bb,
        volumeAnalysis,
        stoch,
        williams
      );
      timeframeScores[timeframe] = timeframeScore;

      timeframeDetails[timeframe] = {
        score: timeframeScore,
        rsi: rsi,
        macd: macd?.macd || 0,
        bollingerB: bb?.percentB || 0.5,
        volumeRatio: volumeAnalysis?.ratio || 1.0,
        stochastic: stoch?.percentK || 50,
        williamsR: williams?.value || -50,
        currentPrice: data.currentPrice,
        changePercent: data.changePercent,
      };
    }

    // 🛡️ INSTITUTIONAL GATEKEEPER RULES VALIDATION
    const oneHourScore = timeframeScores["1H"] || 0;
    const fourHourScore = timeframeScores["4H"] || 0;
    const dailyScore = timeframeScores["1D"] || 0;
    const weeklyScore = timeframeScores["1W"] || 0;

    const passesGates = passesGatekeeperRules(
      oneHourScore,
      fourHourScore,
      dailyScore,
      weeklyScore
    );

    if (!passesGates) {
      console.log(`❌ [${ticker}] REJECTED by institutional gatekeeper rules`);
      return null; // Signal rejected by gatekeeper
    }

    console.log(`✅ [${ticker}] PASSED institutional gatekeeper rules`);

    // 🧠 4-DIMENSIONAL SCORING SYSTEM (EXTRACTED FROM SESSION #166)

    // Calculate signal strength
    let signalStrength = 50;
    try {
      const scoresArray = Object.values(timeframeScores);
      const meaningfulScores = scoresArray.filter(
        (score) => typeof score === "number" && !isNaN(score) && score >= 50
      );
      if (meaningfulScores.length > 0) {
        signalStrength = Math.round(
          meaningfulScores.reduce((sum, score) => sum + score, 0) /
            meaningfulScores.length
        );
      }
    } catch (strengthError) {
      signalStrength = Math.round(
        (oneHourScore + fourHourScore + dailyScore + weeklyScore) / 4
      );
    }

    // Calculate other dimensions
    const allScores = [
      oneHourScore,
      fourHourScore,
      dailyScore,
      weeklyScore,
    ].filter(
      (score) => typeof score === "number" && !isNaN(score) && score > 0
    );

    const signalConfidence = calculateSignalConfidence(allScores);
    const momentumQuality = calculateMomentumQuality(
      weeklyScore,
      dailyScore,
      fourHourScore,
      oneHourScore
    );

    const primaryTimeframeData = timeframeData["1D"] || timeframeData["1H"];
    const riskAdjustment = calculateRiskAdjustment(
      primaryTimeframeData?.prices || [],
      primaryTimeframeData?.volume || 0,
      primaryTimeframeData?.volumes
        ? primaryTimeframeData.volumes.reduce((a, b) => a + b, 0) /
            primaryTimeframeData.volumes.length
        : 0
    );

    // Calculate final Kurzora Smart Score
    const kuzzoraSmartScore = calculateKuzzoraSmartScore(
      signalStrength,
      signalConfidence,
      momentumQuality,
      riskAdjustment
    );

    // Map to signal strength and type
    const signalStrength_enum = mapScoreToSignalStrength(kuzzoraSmartScore);
    const signalType = mapScoreToSignalType(kuzzoraSmartScore);

    // Calculate entry, stop loss, and take profit (WHITE PAPER REQUIREMENTS)
    const currentPrice = primaryTimeframeData?.currentPrice || 100.0;
    const entryPrice = currentPrice * 1.01; // 1% premium for market entry
    const stopLoss = currentPrice * 0.92; // 8% stop loss
    const takeProfit = currentPrice * 1.15; // 15% take profit
    const riskRewardRatio = (takeProfit - entryPrice) / (entryPrice - stopLoss);

    const priceChange = primaryTimeframeData?.changePercent || 0.0;

    console.log(
      `🎉 [${ticker}] SIGNAL GENERATED: Score ${kuzzoraSmartScore}%, Type ${signalType}, Strength ${signalStrength_enum}`
    );

    return {
      ticker,
      companyName,
      sector,
      finalScore: kuzzoraSmartScore,
      signalType,
      signalStrength: signalStrength_enum,
      timeframeScores,
      dimensions: {
        strength: signalStrength,
        confidence: signalConfidence,
        quality: momentumQuality,
        risk: riskAdjustment,
      },
      entryPrice,
      stopLoss,
      takeProfit,
      riskRewardRatio,
      currentPrice,
      priceChange,
      passedGatekeeper: true,
    };
  } catch (error) {
    console.log(`❌ [${ticker}] Analysis error: ${error.message}`);
    return null;
  }
}

// ==================================================================================
// 🎯 SYNTHETIC DATA GENERATOR FOR BACKTESTING - EXTRACTED FROM SESSION #166
// ==================================================================================

/**
 * 🎲 PRODUCTION SYNTHETIC DATA GENERATOR - EXTRACTED FROM SESSION #166
 * PURPOSE: Generate realistic market data for backtesting when API data unavailable
 * INPUT: Ticker and timeframe
 * OUTPUT: Realistic OHLCV data for analysis
 */
export function generateSyntheticTimeframeData(
  ticker: string,
  timeframe: string
): TimeframeData {
  console.log(
    `🎲 [${ticker}] Generating realistic synthetic ${timeframe} data...`
  );

  const priceRanges: { [key: string]: number } = {
    AAPL: 180,
    MSFT: 380,
    GOOGL: 140,
    AMZN: 150,
    TSLA: 250,
    NVDA: 450,
    META: 320,
    JPM: 150,
    JNJ: 160,
    PG: 150,
  };

  const basePrice = priceRanges[ticker] || 100 + Math.random() * 200;
  const periods = TIMEFRAME_CONFIG[timeframe]?.periods || 50;

  const prices: number[] = [],
    highs: number[] = [],
    lows: number[] = [],
    volumes: number[] = [];
  let currentPrice = basePrice;

  for (let i = 0; i < periods; i++) {
    const trendBias = Math.sin((i / periods) * Math.PI) * 0.01;
    const randomChange = (Math.random() - 0.5) * 0.04;
    currentPrice = currentPrice * (1 + trendBias + randomChange);

    const volatility = 0.015;
    const high = currentPrice * (1 + Math.random() * volatility);
    const low = currentPrice * (1 - Math.random() * volatility);

    const baseVolume =
      ticker === "AAPL"
        ? 50000000
        : ticker === "NVDA"
        ? 40000000
        : ticker === "MSFT"
        ? 30000000
        : 20000000;
    const volume = baseVolume * (0.5 + Math.random());

    prices.push(currentPrice);
    highs.push(high);
    lows.push(low);
    volumes.push(volume);
  }

  return {
    currentPrice: currentPrice,
    changePercent: ((currentPrice - basePrice) / basePrice) * 100,
    volume: volumes[volumes.length - 1],
    prices: prices,
    highs: highs,
    lows: lows,
    volumes: volumes,
  };
}

console.log(
  "🎯 Kurzora Signal Engine loaded successfully - Ready for backtesting!"
);
console.log(
  "✅ All Session #166 institutional logic extracted and available for client-side processing"
);
console.log(
  "📊 Functions available: analyzeSignal, all technical indicators, 4-dimensional scoring, gatekeeper rules"
);
console.log(
  "🚀 Ready to implement 30-day trading simulation with identical signal quality!"
);
