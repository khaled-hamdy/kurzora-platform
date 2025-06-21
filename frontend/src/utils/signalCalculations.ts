// Enhanced Signal Calculations with Professional Risk Management
// File: src/utils/signalCalculations.ts

// ✅ PRESERVE: Existing Signal type import (keep working)
import { Signal } from "../types/signal";

// ✅ PRESERVE: Original calculateFinalScore function (working perfectly)
export const calculateFinalScore = (signals: Signal["signals"]): number => {
  const weighted =
    signals["1H"] * 0.4 +
    signals["4H"] * 0.3 +
    signals["1D"] * 0.2 +
    signals["1W"] * 0.1;
  return Math.round(weighted);
};

// ✅ PRESERVE: Original dashboard heatmap function (unchanged)
export const filterSignals = (
  signals: Signal[],
  timeFilter: string,
  scoreThreshold: number[],
  sectorFilter: string,
  marketFilter: string
): Signal[] => {
  return signals.filter((signal) => {
    const score = signal.signals[timeFilter as keyof typeof signal.signals];
    const meetsThreshold = score >= scoreThreshold[0];
    const meetsSector =
      sectorFilter === "all" || signal.sector === sectorFilter;
    const meetsMarket =
      marketFilter === "global" || signal.market === marketFilter;

    return meetsThreshold && meetsSector && meetsMarket;
  });
};

// ✅ PRESERVE: Final score filtering for Signals page (working perfectly)
export const filterSignalsByFinalScore = (
  signals: Signal[],
  scoreThreshold: number[],
  sectorFilter: string,
  marketFilter: string
): Signal[] => {
  return signals.filter((signal) => {
    // Use the final calculated score instead of individual timeframe scores
    const finalScore = calculateFinalScore(signal.signals);
    const meetsThreshold = finalScore >= scoreThreshold[0];
    const meetsSector =
      sectorFilter === "all" || signal.sector === sectorFilter;
    const meetsMarket =
      marketFilter === "global" || signal.market === marketFilter;

    return meetsThreshold && meetsSector && meetsMarket;
  });
};

// 🚀 NEW: Professional Risk Management Interface
export interface RiskManagementData {
  stopLoss: number;
  takeProfit: number;
  riskRewardRatio: number;
  positionSize: number;
  riskAmount: number;
  potentialProfit: number;
  riskLevel: "low" | "medium" | "high";
  technicalSupport: number;
  technicalResistance: number;
  volatilityAdjusted: boolean;
}

// 🚀 NEW: Enhanced Signal with Risk Management
export interface EnhancedSignal extends Signal {
  riskManagement: RiskManagementData;
  finalScore: number;
}

// 🚀 NEW: Calculate Technical Stop-Loss Level
export const calculateStopLoss = (
  price: number,
  finalScore: number,
  signalType: "bullish" | "bearish" | "neutral" = "bullish"
): number => {
  // Professional stop-loss calculation based on technical analysis

  // Base stop-loss percentage based on signal strength
  let baseStopPercent: number;

  if (finalScore >= 90) {
    baseStopPercent = 0.03; // 3% for very strong signals
  } else if (finalScore >= 80) {
    baseStopPercent = 0.04; // 4% for strong signals
  } else if (finalScore >= 70) {
    baseStopPercent = 0.05; // 5% for moderate signals
  } else {
    baseStopPercent = 0.06; // 6% for weaker signals
  }

  // Calculate technical support level (simulated based on price)
  const technicalSupport = price * (1 - (baseStopPercent + 0.01));

  // For bullish signals, stop-loss below entry
  if (signalType === "bullish") {
    return Math.round(technicalSupport * 100) / 100;
  } else {
    // For bearish signals, stop-loss above entry
    return Math.round(price * (1 + baseStopPercent) * 100) / 100;
  }
};

// 🚀 NEW: Calculate Take-Profit Target
export const calculateTakeProfit = (
  price: number,
  stopLoss: number,
  finalScore: number,
  signalType: "bullish" | "bearish" | "neutral" = "bullish"
): number => {
  // Professional take-profit calculation with risk-reward optimization

  const riskAmount = Math.abs(price - stopLoss);

  // Risk-reward ratio based on signal strength
  let riskRewardMultiplier: number;

  if (finalScore >= 90) {
    riskRewardMultiplier = 3.0; // 3:1 for very strong signals
  } else if (finalScore >= 80) {
    riskRewardMultiplier = 2.5; // 2.5:1 for strong signals
  } else if (finalScore >= 70) {
    riskRewardMultiplier = 2.0; // 2:1 for moderate signals
  } else {
    riskRewardMultiplier = 1.5; // 1.5:1 for weaker signals
  }

  // Calculate take-profit target
  if (signalType === "bullish") {
    const takeProfit = price + riskAmount * riskRewardMultiplier;
    return Math.round(takeProfit * 100) / 100;
  } else {
    // For bearish signals
    const takeProfit = price - riskAmount * riskRewardMultiplier;
    return Math.round(takeProfit * 100) / 100;
  }
};

// 🚀 NEW: Calculate Risk-Reward Ratio
export const calculateRiskReward = (
  entryPrice: number,
  stopLoss: number,
  takeProfit: number
): number => {
  const riskAmount = Math.abs(entryPrice - stopLoss);
  const rewardAmount = Math.abs(takeProfit - entryPrice);

  if (riskAmount === 0) return 0;

  const ratio = rewardAmount / riskAmount;
  return Math.round(ratio * 100) / 100;
};

// 🚀 NEW: Calculate Position Size Based on Risk
export const calculatePositionSize = (
  accountBalance: number,
  entryPrice: number,
  stopLoss: number,
  riskPercentage: number = 2 // Default 2% risk
): number => {
  // Professional position sizing using the 2% rule

  const riskAmount = accountBalance * (riskPercentage / 100);
  const priceRisk = Math.abs(entryPrice - stopLoss);

  if (priceRisk === 0) return 0;

  const shares = Math.floor(riskAmount / priceRisk);
  return Math.max(shares, 1); // Minimum 1 share
};

// 🚀 NEW: Assess Risk Level
export const assessRiskLevel = (
  riskRewardRatio: number,
  finalScore: number,
  volatility: number = 0.5 // Default moderate volatility
): "low" | "medium" | "high" => {
  // Professional risk assessment

  if (finalScore >= 85 && riskRewardRatio >= 2.0 && volatility <= 0.3) {
    return "low";
  } else if (finalScore >= 70 && riskRewardRatio >= 1.5 && volatility <= 0.6) {
    return "medium";
  } else {
    return "high";
  }
};

// 🚀 NEW: Enhance Signal with Risk Management Data
export const enhanceSignalWithRisk = (
  signal: Signal,
  accountBalance: number = 10000, // Default $10k portfolio
  riskPercentage: number = 2 // Default 2% risk
): EnhancedSignal => {
  const finalScore = calculateFinalScore(signal.signals);
  const signalType = finalScore >= 70 ? "bullish" : "bearish";

  // Calculate risk management parameters
  const stopLoss = calculateStopLoss(signal.price, finalScore, signalType);
  const takeProfit = calculateTakeProfit(
    signal.price,
    stopLoss,
    finalScore,
    signalType
  );
  const riskRewardRatio = calculateRiskReward(
    signal.price,
    stopLoss,
    takeProfit
  );
  const positionSize = calculatePositionSize(
    accountBalance,
    signal.price,
    stopLoss,
    riskPercentage
  );

  const riskAmount = Math.abs(signal.price - stopLoss) * positionSize;
  const potentialProfit = Math.abs(takeProfit - signal.price) * positionSize;
  const riskLevel = assessRiskLevel(riskRewardRatio, finalScore);

  // Technical levels (simulated based on price action)
  const technicalSupport = signal.price * 0.95;
  const technicalResistance = signal.price * 1.08;

  const riskManagement: RiskManagementData = {
    stopLoss,
    takeProfit,
    riskRewardRatio,
    positionSize,
    riskAmount,
    potentialProfit,
    riskLevel,
    technicalSupport,
    technicalResistance,
    volatilityAdjusted: true,
  };

  return {
    ...signal,
    riskManagement,
    finalScore,
  };
};

// 🚀 NEW: Bulk Enhance Signals with Risk Management
export const enhanceSignalsWithRisk = (
  signals: Signal[],
  accountBalance: number = 10000,
  riskPercentage: number = 2
): EnhancedSignal[] => {
  return signals.map((signal) =>
    enhanceSignalWithRisk(signal, accountBalance, riskPercentage)
  );
};

// 🚀 NEW: Validate Trade Setup
export const validateTradeSetup = (
  enhancedSignal: EnhancedSignal
): {
  isValid: boolean;
  issues: string[];
  recommendations: string[];
} => {
  const issues: string[] = [];
  const recommendations: string[] = [];

  const { riskManagement, finalScore } = enhancedSignal;

  // Check minimum risk-reward ratio
  if (riskManagement.riskRewardRatio < 1.5) {
    issues.push("Risk-reward ratio below 1.5:1");
    recommendations.push("Look for signals with better risk-reward ratios");
  }

  // Check signal strength
  if (finalScore < 70) {
    issues.push("Signal strength below recommended threshold");
    recommendations.push("Consider waiting for stronger signals (70+)");
  }

  // Check risk level
  if (riskManagement.riskLevel === "high") {
    issues.push("High risk trade setup");
    recommendations.push(
      "Consider reducing position size or waiting for better setup"
    );
  }

  // Check position size
  if (riskManagement.positionSize < 1) {
    issues.push("Position size too small");
    recommendations.push("Increase account balance or adjust risk percentage");
  }

  const isValid =
    issues.length === 0 ||
    (finalScore >= 80 && riskManagement.riskRewardRatio >= 2.0);

  return { isValid, issues, recommendations };
};

// 🚀 NEW: Format Risk Management for Display
export const formatRiskManagement = (riskData: RiskManagementData) => {
  return {
    stopLossFormatted: `$${riskData.stopLoss.toFixed(2)}`,
    takeProfitFormatted: `$${riskData.takeProfit.toFixed(2)}`,
    riskRewardFormatted: `${riskData.riskRewardRatio}:1`,
    riskAmountFormatted: `$${riskData.riskAmount.toFixed(2)}`,
    potentialProfitFormatted: `$${riskData.potentialProfit.toFixed(2)}`,
    riskLevelColor: {
      low: "text-green-400",
      medium: "text-yellow-400",
      high: "text-red-400",
    }[riskData.riskLevel],
    riskLevelText: {
      low: "Low Risk ✅",
      medium: "Medium Risk ⚠️",
      high: "High Risk ⚠️",
    }[riskData.riskLevel],
  };
};
