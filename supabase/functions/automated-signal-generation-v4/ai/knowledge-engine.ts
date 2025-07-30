/**
 * 🎯 PURPOSE: AI Learning System - Knowledge Engine for Signal Optimization
 * 🔧 SESSION #314: Advanced AI learning from signal outcomes and market patterns
 * 🛡️ PRESERVATION: Reads from existing data, does not modify signal generation systems
 * 📝 HANDOVER: Complete AI learning foundation for signal quality improvement
 *
 * File: supabase/functions/automated-signal-generation-v4/ai/knowledge-engine.ts
 *
 * This component analyzes signal outcomes to build AI knowledge for future signal optimization.
 * It learns from successful/failed signals to improve confidence scoring and indicator weighting.
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// 🔧 SESSION #314: TypeScript interfaces matching exact database schema patterns
interface SignalOutcome {
  id: string;
  signal_id: string;
  user_id?: string;
  outcome_type: "win" | "loss" | "breakeven" | "expired";
  entry_price?: number;
  exit_price?: number;
  profit_loss?: number;
  profit_loss_percentage?: number;
  holding_period_hours?: number;
  actual_vs_predicted_score?: number;
  indicator_accuracy?: Record<string, any>;
  market_conditions?: Record<string, any>;
  signal_created_at?: string;
  trade_executed_at?: string;
  trade_closed_at?: string;
  learning_version?: string;
  quality_score?: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

interface LearningInsight {
  insight_type:
    | "indicator_weight"
    | "market_condition"
    | "confidence_calibration"
    | "pattern_recognition";
  insight_data: Record<string, any>;
  confidence_level: number; // 0-100
  sample_size: number;
  learning_version: string;
  generated_at: string;
}

interface IndicatorLearning {
  indicator_name: string;
  timeframe: string;
  success_rate: number;
  optimal_ranges: {
    min_value?: number;
    max_value?: number;
    best_performance_range?: [number, number];
  };
  market_condition_performance: Record<string, number>;
  sample_size: number;
  confidence_score: number;
}

interface MarketConditionLearning {
  market_regime: "bull" | "bear" | "sideways";
  volatility_level: "high" | "medium" | "low";
  sector_performance: Record<string, number>;
  optimal_indicators: string[];
  success_rate: number;
  sample_size: number;
  avg_holding_period: number;
}

interface ConfidenceCalibration {
  predicted_range: [number, number]; // e.g., [70, 80]
  actual_success_rate: number;
  calibration_factor: number; // Adjustment multiplier
  sample_size: number;
  recommendation: "increase" | "decrease" | "maintain";
}

interface PatternRecognition {
  pattern_type: string;
  indicator_combination: string[];
  market_conditions: Record<string, any>;
  success_criteria: {
    min_profit_percentage: number;
    max_holding_hours: number;
    min_success_rate: number;
  };
  success_rate: number;
  avg_profit: number;
  sample_size: number;
}

/**
 * 🎯 PURPOSE: Main AI Knowledge Engine Class
 * 🔧 SESSION #314: Production-ready learning system for signal optimization
 * 🛡️ PRESERVATION: Read-only analysis, does not modify existing signal generation
 */
export class KnowledgeEngine {
  private supabase: any;
  private learningVersion: string;

  constructor(supabaseUrl: string, supabaseKey: string, version = "v1.0") {
    // 🔧 SESSION #314: Initialize Supabase client following V4 patterns
    this.supabase = createClient(supabaseUrl, supabaseKey);
    this.learningVersion = version;
  }

  /**
   * 🎯 PURPOSE: Generate comprehensive AI learning insights from signal outcomes
   * 🔧 SESSION #314: Main learning orchestrator function
   * 📝 HANDOVER: Call this to generate all learning insights from available data
   */
  async generateLearningInsights(minimumSampleSize = 10): Promise<{
    indicators: IndicatorLearning[];
    market_conditions: MarketConditionLearning[];
    confidence_calibration: ConfidenceCalibration[];
    patterns: PatternRecognition[];
    summary: Record<string, any>;
  }> {
    console.log(
      "🧠 AI Knowledge Engine: Starting comprehensive learning analysis..."
    );

    try {
      // 🔧 SESSION #314: Get all signal outcomes for analysis
      const { data: outcomes, error } = await this.supabase
        .from("signal_outcomes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch signal outcomes: ${error.message}`);
      }

      if (!outcomes || outcomes.length < minimumSampleSize) {
        console.log(
          `⚠️ Insufficient data for learning (${
            outcomes?.length || 0
          } < ${minimumSampleSize})`
        );
        return {
          indicators: [],
          market_conditions: [],
          confidence_calibration: [],
          patterns: [],
          summary: {
            total_outcomes: outcomes?.length || 0,
            learning_status: "insufficient_data",
            minimum_required: minimumSampleSize,
          },
        };
      }

      console.log(`📊 Analyzing ${outcomes.length} signal outcomes...`);

      // 🔧 SESSION #314: Generate all learning insights in parallel
      const [
        indicatorLearning,
        marketConditionLearning,
        confidenceCalibration,
        patternRecognition,
      ] = await Promise.all([
        this.analyzeIndicatorPerformance(outcomes),
        this.analyzeMarketConditionPerformance(outcomes),
        this.calibrateConfidenceScores(outcomes),
        this.recognizeSuccessPatterns(outcomes),
      ]);

      // 🔧 SESSION #314: Generate learning summary
      const summary = this.generateLearningSummary(outcomes, {
        indicators: indicatorLearning,
        market_conditions: marketConditionLearning,
        confidence_calibration: confidenceCalibration,
        patterns: patternRecognition,
      });

      console.log("✅ AI Knowledge Engine: Learning analysis complete");

      return {
        indicators: indicatorLearning,
        market_conditions: marketConditionLearning,
        confidence_calibration: confidenceCalibration,
        patterns: patternRecognition,
        summary: summary,
      };
    } catch (error) {
      console.error("❌ AI Knowledge Engine error:", error);
      throw new Error(`Learning insight generation failed: ${error.message}`);
    }
  }

  /**
   * 🎯 PURPOSE: Analyze individual indicator performance across all outcomes
   * 🔧 SESSION #314: Learn which indicators predict success most accurately
   * 📝 HANDOVER: Builds intelligence for indicator weight optimization
   */
  private async analyzeIndicatorPerformance(
    outcomes: SignalOutcome[]
  ): Promise<IndicatorLearning[]> {
    const indicatorStats: Record<
      string,
      {
        successes: number;
        failures: number;
        values: number[];
        market_conditions: Record<string, { successes: number; total: number }>;
      }
    > = {};

    // 🔧 SESSION #314: Collect indicator performance data
    outcomes.forEach((outcome) => {
      if (!outcome.indicator_accuracy) return;

      const isSuccess = outcome.outcome_type === "win";
      const marketRegime =
        outcome.market_conditions?.market_regime || "unknown";

      Object.entries(outcome.indicator_accuracy).forEach(
        ([indicatorKey, data]: [string, any]) => {
          if (!indicatorStats[indicatorKey]) {
            indicatorStats[indicatorKey] = {
              successes: 0,
              failures: 0,
              values: [],
              market_conditions: {},
            };
          }

          const stats = indicatorStats[indicatorKey];

          // 🔧 SESSION #314: Track success/failure rates
          if (isSuccess) {
            stats.successes++;
          } else if (outcome.outcome_type === "loss") {
            stats.failures++;
          }

          // 🔧 SESSION #314: Collect indicator values for range analysis
          if (data.raw_value !== null && data.raw_value !== undefined) {
            stats.values.push(data.raw_value);
          }

          // 🔧 SESSION #314: Track performance by market condition
          if (!stats.market_conditions[marketRegime]) {
            stats.market_conditions[marketRegime] = { successes: 0, total: 0 };
          }
          stats.market_conditions[marketRegime].total++;
          if (isSuccess) {
            stats.market_conditions[marketRegime].successes++;
          }
        }
      );
    });

    // 🔧 SESSION #314: Convert statistics to learning insights
    const learningResults: IndicatorLearning[] = [];

    Object.entries(indicatorStats).forEach(([indicatorKey, stats]) => {
      const totalSignals = stats.successes + stats.failures;
      if (totalSignals < 5) return; // Skip indicators with insufficient data

      // 🔧 SESSION #314: Calculate success rate
      const successRate = (stats.successes / totalSignals) * 100;

      // 🔧 SESSION #314: Determine optimal value ranges
      const optimalRanges = this.calculateOptimalRanges(stats.values);

      // 🔧 SESSION #314: Calculate market condition performance
      const marketConditionPerformance: Record<string, number> = {};
      Object.entries(stats.market_conditions).forEach(
        ([condition, conditionStats]) => {
          marketConditionPerformance[condition] =
            conditionStats.total > 0
              ? (conditionStats.successes / conditionStats.total) * 100
              : 0;
        }
      );

      // 🔧 SESSION #314: Calculate confidence score based on sample size and consistency
      const confidenceScore = this.calculateLearningConfidence(
        totalSignals,
        successRate
      );

      // 🔧 SESSION #314: Extract indicator name and timeframe
      const [indicatorName, timeframe] = indicatorKey.split("_");

      learningResults.push({
        indicator_name: indicatorName || indicatorKey,
        timeframe: timeframe || "1H",
        success_rate: Math.round(successRate * 100) / 100,
        optimal_ranges: optimalRanges,
        market_condition_performance: marketConditionPerformance,
        sample_size: totalSignals,
        confidence_score: confidenceScore,
      });
    });

    // 🔧 SESSION #314: Sort by confidence score and success rate
    return learningResults.sort((a, b) => {
      const aScore = a.confidence_score * a.success_rate;
      const bScore = b.confidence_score * b.success_rate;
      return bScore - aScore;
    });
  }

  /**
   * 🎯 PURPOSE: Calculate optimal value ranges for indicator performance
   * 🔧 SESSION #314: Statistical analysis of indicator values
   * 📝 HANDOVER: Determines best performing value ranges for each indicator
   */
  private calculateOptimalRanges(values: number[]): {
    min_value?: number;
    max_value?: number;
    best_performance_range?: [number, number];
  } {
    if (values.length === 0) {
      return {};
    }

    // 🔧 SESSION #314: Basic statistics
    const sortedValues = values.sort((a, b) => a - b);
    const minValue = sortedValues[0];
    const maxValue = sortedValues[sortedValues.length - 1];

    // 🔧 SESSION #314: Calculate optimal range using quartiles
    const q1Index = Math.floor(values.length * 0.25);
    const q3Index = Math.floor(values.length * 0.75);
    const q1 = sortedValues[q1Index];
    const q3 = sortedValues[q3Index];

    // 🔧 SESSION #314: Best performance range (middle 50% of values)
    const bestPerformanceRange: [number, number] = [q1, q3];

    return {
      min_value: Math.round(minValue * 1000) / 1000,
      max_value: Math.round(maxValue * 1000) / 1000,
      best_performance_range: [
        Math.round(bestPerformanceRange[0] * 1000) / 1000,
        Math.round(bestPerformanceRange[1] * 1000) / 1000,
      ],
    };
  }

  /**
   * 🎯 PURPOSE: Analyze performance by market conditions
   * 🔧 SESSION #314: Learn optimal strategies for different market regimes
   * 📝 HANDOVER: Market-adaptive signal intelligence
   */
  private async analyzeMarketConditionPerformance(
    outcomes: SignalOutcome[]
  ): Promise<MarketConditionLearning[]> {
    const conditionStats: Record<
      string,
      {
        outcomes: SignalOutcome[];
        successes: number;
        failures: number;
        total_profit: number;
        total_holding_time: number;
        indicators_used: Record<string, number>;
        sectors: Record<string, { successes: number; total: number }>;
      }
    > = {};

    // 🔧 SESSION #314: Group outcomes by market conditions
    outcomes.forEach((outcome) => {
      if (!outcome.market_conditions) return;

      const regime = outcome.market_conditions.market_regime;
      const volatility = outcome.market_conditions.volatility_level;
      const conditionKey = `${regime}_${volatility}`;

      if (!conditionStats[conditionKey]) {
        conditionStats[conditionKey] = {
          outcomes: [],
          successes: 0,
          failures: 0,
          total_profit: 0,
          total_holding_time: 0,
          indicators_used: {},
          sectors: {},
        };
      }

      const stats = conditionStats[conditionKey];
      stats.outcomes.push(outcome);

      // 🔧 SESSION #314: Track performance metrics
      if (outcome.outcome_type === "win") {
        stats.successes++;
        if (outcome.profit_loss_percentage) {
          stats.total_profit += outcome.profit_loss_percentage;
        }
      } else if (outcome.outcome_type === "loss") {
        stats.failures++;
        if (outcome.profit_loss_percentage) {
          stats.total_profit += outcome.profit_loss_percentage; // Negative value
        }
      }

      // 🔧 SESSION #314: Track holding time
      if (outcome.holding_period_hours) {
        stats.total_holding_time += outcome.holding_period_hours;
      }

      // 🔧 SESSION #314: Track indicator usage
      if (outcome.indicator_accuracy) {
        Object.keys(outcome.indicator_accuracy).forEach((indicator) => {
          stats.indicators_used[indicator] =
            (stats.indicators_used[indicator] || 0) + 1;
        });
      }

      // 🔧 SESSION #314: Track sector performance
      const sector = outcome.market_conditions.sector || "unknown";
      if (!stats.sectors[sector]) {
        stats.sectors[sector] = { successes: 0, total: 0 };
      }
      stats.sectors[sector].total++;
      if (outcome.outcome_type === "win") {
        stats.sectors[sector].successes++;
      }
    });

    // 🔧 SESSION #314: Convert to learning insights
    const learningResults: MarketConditionLearning[] = [];

    Object.entries(conditionStats).forEach(([conditionKey, stats]) => {
      const [regime, volatility] = conditionKey.split("_");
      const totalOutcomes = stats.successes + stats.failures;

      if (totalOutcomes < 3) return; // Skip conditions with insufficient data

      // 🔧 SESSION #314: Calculate metrics
      const successRate = (stats.successes / totalOutcomes) * 100;
      const avgHoldingPeriod = stats.total_holding_time / stats.outcomes.length;

      // 🔧 SESSION #314: Identify optimal indicators for this condition
      const sortedIndicators = Object.entries(stats.indicators_used)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5) // Top 5 most used indicators
        .map(([indicator]) => indicator);

      // 🔧 SESSION #314: Calculate sector performance
      const sectorPerformance: Record<string, number> = {};
      Object.entries(stats.sectors).forEach(([sector, sectorStats]) => {
        sectorPerformance[sector] =
          sectorStats.total > 0
            ? (sectorStats.successes / sectorStats.total) * 100
            : 0;
      });

      learningResults.push({
        market_regime: regime as "bull" | "bear" | "sideways",
        volatility_level: volatility as "high" | "medium" | "low",
        sector_performance: sectorPerformance,
        optimal_indicators: sortedIndicators,
        success_rate: Math.round(successRate * 100) / 100,
        sample_size: totalOutcomes,
        avg_holding_period: Math.round(avgHoldingPeriod * 100) / 100,
      });
    });

    // 🔧 SESSION #314: Sort by success rate and sample size
    return learningResults.sort((a, b) => {
      const aScore = a.success_rate * Math.log(a.sample_size + 1);
      const bScore = b.success_rate * Math.log(b.sample_size + 1);
      return bScore - aScore;
    });
  }

  /**
   * 🎯 PURPOSE: Calibrate confidence scores based on actual performance
   * 🔧 SESSION #314: Learn how to adjust prediction confidence
   * 📝 HANDOVER: Improves signal confidence accuracy over time
   */
  private async calibrateConfidenceScores(
    outcomes: SignalOutcome[]
  ): Promise<ConfidenceCalibration[]> {
    // 🔧 SESSION #314: Group outcomes by confidence score ranges
    const confidenceRanges = [
      [0, 50],
      [50, 60],
      [60, 70],
      [70, 80],
      [80, 90],
      [90, 100],
    ];

    const calibrationResults: ConfidenceCalibration[] = [];

    for (const [minConf, maxConf] of confidenceRanges) {
      // 🔧 SESSION #314: Get original signal data for confidence scores
      const rangeOutcomes = await this.getOutcomesWithConfidenceRange(
        outcomes,
        minConf,
        maxConf
      );

      if (rangeOutcomes.length < 5) continue; // Skip ranges with insufficient data

      // 🔧 SESSION #314: Calculate actual success rate
      const successes = rangeOutcomes.filter(
        (o) => o.outcome_type === "win"
      ).length;
      const total = rangeOutcomes.filter((o) =>
        ["win", "loss"].includes(o.outcome_type)
      ).length;
      const actualSuccessRate = total > 0 ? (successes / total) * 100 : 0;

      // 🔧 SESSION #314: Calculate expected success rate (midpoint of range)
      const expectedSuccessRate = (minConf + maxConf) / 2;

      // 🔧 SESSION #314: Calculate calibration factor
      const calibrationFactor =
        expectedSuccessRate > 0 ? actualSuccessRate / expectedSuccessRate : 1.0;

      // 🔧 SESSION #314: Determine recommendation
      let recommendation: "increase" | "decrease" | "maintain";
      if (calibrationFactor > 1.1) {
        recommendation = "increase"; // Actual performance better than predicted
      } else if (calibrationFactor < 0.9) {
        recommendation = "decrease"; // Actual performance worse than predicted
      } else {
        recommendation = "maintain"; // Well calibrated
      }

      calibrationResults.push({
        predicted_range: [minConf, maxConf],
        actual_success_rate: Math.round(actualSuccessRate * 100) / 100,
        calibration_factor: Math.round(calibrationFactor * 1000) / 1000,
        sample_size: total,
        recommendation: recommendation,
      });
    }

    return calibrationResults.sort((a, b) => b.sample_size - a.sample_size);
  }

  /**
   * 🎯 PURPOSE: Get outcomes with original confidence scores from trading signals
   * 🔧 SESSION #314: Link outcomes back to original signal confidence
   * 📝 HANDOVER: Enables confidence calibration analysis
   */
  private async getOutcomesWithConfidenceRange(
    outcomes: SignalOutcome[],
    minConf: number,
    maxConf: number
  ): Promise<SignalOutcome[]> {
    // 🔧 SESSION #314: Get signal IDs from outcomes
    const signalIds = outcomes.map((o) => o.signal_id).filter(Boolean);

    if (signalIds.length === 0) return [];

    // 🔧 SESSION #314: Get original signals with confidence scores
    const { data: signals, error } = await this.supabase
      .from("trading_signals")
      .select("id, confidence_score")
      .in("id", signalIds)
      .gte("confidence_score", minConf)
      .lt("confidence_score", maxConf);

    if (error || !signals) return [];

    // 🔧 SESSION #314: Filter outcomes to match confidence range
    const signalIdsInRange = new Set(signals.map((s) => s.id));
    return outcomes.filter((outcome) =>
      signalIdsInRange.has(outcome.signal_id)
    );
  }

  /**
   * 🎯 PURPOSE: Recognize patterns in successful signals
   * 🔧 SESSION #314: Identify winning indicator combinations and conditions
   * 📝 HANDOVER: Pattern-based signal optimization insights
   */
  private async recognizeSuccessPatterns(
    outcomes: SignalOutcome[]
  ): Promise<PatternRecognition[]> {
    const patterns: Record<
      string,
      {
        occurrences: SignalOutcome[];
        successes: number;
        total_profit: number;
        holding_times: number[];
      }
    > = {};

    // 🔧 SESSION #314: Analyze successful outcomes for patterns
    const successfulOutcomes = outcomes.filter((o) => o.outcome_type === "win");

    successfulOutcomes.forEach((outcome) => {
      if (!outcome.indicator_accuracy || !outcome.market_conditions) return;

      // 🔧 SESSION #314: Create pattern signature
      const indicators = Object.keys(outcome.indicator_accuracy).sort();
      const marketCondition = `${outcome.market_conditions.market_regime}_${outcome.market_conditions.volatility_level}`;
      const patternKey = `${indicators
        .slice(0, 3)
        .join("+")}@${marketCondition}`;

      if (!patterns[patternKey]) {
        patterns[patternKey] = {
          occurrences: [],
          successes: 0,
          total_profit: 0,
          holding_times: [],
        };
      }

      const pattern = patterns[patternKey];
      pattern.occurrences.push(outcome);
      pattern.successes++;

      if (outcome.profit_loss_percentage) {
        pattern.total_profit += outcome.profit_loss_percentage;
      }

      if (outcome.holding_period_hours) {
        pattern.holding_times.push(outcome.holding_period_hours);
      }
    });

    // 🔧 SESSION #314: Convert patterns to recognition insights
    const recognitionResults: PatternRecognition[] = [];

    Object.entries(patterns).forEach(([patternKey, pattern]) => {
      if (pattern.occurrences.length < 3) return; // Skip patterns with insufficient occurrences

      // 🔧 SESSION #314: Parse pattern components
      const [indicatorPart, conditionPart] = patternKey.split("@");
      const indicators = indicatorPart.split("+");
      const [regime, volatility] = conditionPart.split("_");

      // 🔧 SESSION #314: Calculate pattern metrics
      const avgProfit = pattern.total_profit / pattern.successes;
      const avgHoldingTime =
        pattern.holding_times.length > 0
          ? pattern.holding_times.reduce((a, b) => a + b, 0) /
            pattern.holding_times.length
          : 0;

      // 🔧 SESSION #314: Calculate success rate against all similar conditions
      const totalSimilarOutcomes = outcomes.filter(
        (o) =>
          o.market_conditions?.market_regime === regime &&
          o.market_conditions?.volatility_level === volatility &&
          ["win", "loss"].includes(o.outcome_type)
      ).length;

      const successRate =
        totalSimilarOutcomes > 0
          ? (pattern.successes / totalSimilarOutcomes) * 100
          : 0;

      recognitionResults.push({
        pattern_type: `${regime}_${volatility}_pattern`,
        indicator_combination: indicators,
        market_conditions: {
          market_regime: regime,
          volatility_level: volatility,
        },
        success_criteria: {
          min_profit_percentage: Math.max(2.0, avgProfit * 0.8), // At least 80% of average profit
          max_holding_hours: Math.min(48, avgHoldingTime * 1.5), // At most 150% of average holding time
          min_success_rate: Math.max(60, successRate * 0.9), // At least 90% of current success rate
        },
        success_rate: Math.round(successRate * 100) / 100,
        avg_profit: Math.round(avgProfit * 100) / 100,
        sample_size: pattern.occurrences.length,
      });
    });

    // 🔧 SESSION #314: Sort by success rate and sample size
    return recognitionResults.sort((a, b) => {
      const aScore = a.success_rate * Math.log(a.sample_size + 1);
      const bScore = b.success_rate * Math.log(b.sample_size + 1);
      return bScore - aScore;
    });
  }

  /**
   * 🎯 PURPOSE: Calculate learning confidence based on sample size and consistency
   * 🔧 SESSION #314: Statistical confidence in learning insights
   * 📝 HANDOVER: Higher confidence for larger, more consistent datasets
   */
  private calculateLearningConfidence(
    sampleSize: number,
    successRate: number
  ): number {
    // 🔧 SESSION #314: Base confidence on sample size (logarithmic scale)
    const sampleConfidence = Math.min(100, 20 * Math.log10(sampleSize + 1));

    // 🔧 SESSION #314: Adjust for success rate consistency (avoid extreme values)
    const consistencyFactor = 1 - Math.abs(successRate - 50) / 50;
    const adjustedConfidence =
      sampleConfidence * (0.7 + 0.3 * consistencyFactor);

    return Math.round(adjustedConfidence * 100) / 100;
  }

  /**
   * 🎯 PURPOSE: Generate comprehensive learning summary
   * 🔧 SESSION #314: High-level insights and recommendations
   * 📝 HANDOVER: Executive summary of AI learning progress
   */
  private generateLearningSummary(
    outcomes: SignalOutcome[],
    insights: {
      indicators: IndicatorLearning[];
      market_conditions: MarketConditionLearning[];
      confidence_calibration: ConfidenceCalibration[];
      patterns: PatternRecognition[];
    }
  ): Record<string, any> {
    const totalOutcomes = outcomes.length;
    const wins = outcomes.filter((o) => o.outcome_type === "win").length;
    const losses = outcomes.filter((o) => o.outcome_type === "loss").length;
    const winRate = wins + losses > 0 ? (wins / (wins + losses)) * 100 : 0;

    // 🔧 SESSION #314: Find best performing elements
    const bestIndicator =
      insights.indicators.length > 0 ? insights.indicators[0] : null;

    const bestMarketCondition =
      insights.market_conditions.length > 0
        ? insights.market_conditions[0]
        : null;

    const bestPattern =
      insights.patterns.length > 0 ? insights.patterns[0] : null;

    // 🔧 SESSION #314: Calculate average confidence calibration
    const avgCalibrationFactor =
      insights.confidence_calibration.length > 0
        ? insights.confidence_calibration.reduce(
            (sum, cal) => sum + cal.calibration_factor,
            0
          ) / insights.confidence_calibration.length
        : 1.0;

    // 🔧 SESSION #314: Generate actionable recommendations
    const recommendations = [];

    if (bestIndicator && bestIndicator.success_rate > 70) {
      recommendations.push(
        `Increase weight for ${bestIndicator.indicator_name} (${bestIndicator.success_rate}% success rate)`
      );
    }

    if (bestMarketCondition && bestMarketCondition.success_rate > 70) {
      recommendations.push(
        `Optimize for ${bestMarketCondition.market_regime}_${bestMarketCondition.volatility_level} conditions`
      );
    }

    if (avgCalibrationFactor < 0.9) {
      recommendations.push(
        "Reduce confidence scores - actual performance below predictions"
      );
    } else if (avgCalibrationFactor > 1.1) {
      recommendations.push(
        "Increase confidence scores - actual performance exceeds predictions"
      );
    }

    if (bestPattern && bestPattern.success_rate > 80) {
      recommendations.push(
        `Focus on pattern: ${bestPattern.indicator_combination.join("+")} in ${
          bestPattern.pattern_type
        }`
      );
    }

    return {
      total_outcomes: totalOutcomes,
      overall_win_rate: Math.round(winRate * 100) / 100,
      wins: wins,
      losses: losses,
      learning_insights_generated: {
        indicators: insights.indicators.length,
        market_conditions: insights.market_conditions.length,
        confidence_calibrations: insights.confidence_calibration.length,
        patterns: insights.patterns.length,
      },
      best_performing: {
        indicator: bestIndicator
          ? `${bestIndicator.indicator_name} (${bestIndicator.success_rate}%)`
          : "None identified",
        market_condition: bestMarketCondition
          ? `${bestMarketCondition.market_regime}_${bestMarketCondition.volatility_level} (${bestMarketCondition.success_rate}%)`
          : "None identified",
        pattern: bestPattern
          ? `${bestPattern.indicator_combination.join("+")} (${
              bestPattern.success_rate
            }%)`
          : "None identified",
      },
      confidence_calibration: {
        average_factor: Math.round(avgCalibrationFactor * 1000) / 1000,
        status:
          avgCalibrationFactor > 1.1
            ? "under_confident"
            : avgCalibrationFactor < 0.9
            ? "over_confident"
            : "well_calibrated",
      },
      recommendations: recommendations,
      learning_version: this.learningVersion,
      generated_at: new Date().toISOString(),
    };
  }

  /**
   * 🎯 PURPOSE: Get specific learning recommendations for signal improvement
   * 🔧 SESSION #314: Actionable insights for signal generation optimization
   * 📝 HANDOVER: Call this to get targeted improvement suggestions
   */
  async getOptimizationRecommendations(
    focusArea?: "indicators" | "market_conditions" | "confidence" | "patterns"
  ): Promise<{
    recommendations: string[];
    priority_actions: string[];
    confidence_level: number;
  }> {
    try {
      // 🔧 SESSION #314: Generate latest learning insights
      const insights = await this.generateLearningInsights(5);

      const recommendations: string[] = [];
      const priorityActions: string[] = [];

      // 🔧 SESSION #314: Focus on specific area or provide comprehensive recommendations
      if (!focusArea || focusArea === "indicators") {
        const topIndicators = insights.indicators.slice(0, 3);
        topIndicators.forEach((indicator) => {
          if (indicator.success_rate > 70) {
            recommendations.push(
              `Increase ${indicator.indicator_name} weight in ${indicator.timeframe} timeframe (${indicator.success_rate}% success)`
            );
            if (indicator.confidence_score > 80) {
              priorityActions.push(
                `High priority: Optimize ${indicator.indicator_name} weighting`
              );
            }
          }
        });
      }

      if (!focusArea || focusArea === "market_conditions") {
        const topConditions = insights.market_conditions.slice(0, 2);
        topConditions.forEach((condition) => {
          if (condition.success_rate > 65) {
            recommendations.push(
              `Optimize signal generation for ${condition.market_regime} market with ${condition.volatility_level} volatility (${condition.success_rate}% success)`
            );
            priorityActions.push(
              `Consider market-adaptive strategies for ${condition.market_regime} conditions`
            );
          }
        });
      }

      if (!focusArea || focusArea === "confidence") {
        const calibrations = insights.confidence_calibration;
        calibrations.forEach((cal) => {
          if (cal.sample_size >= 10) {
            const range = `${cal.predicted_range[0]}-${cal.predicted_range[1]}%`;
            if (cal.recommendation === "increase") {
              recommendations.push(
                `Increase confidence scores in ${range} range (actual: ${cal.actual_success_rate}%)`
              );
            } else if (cal.recommendation === "decrease") {
              recommendations.push(
                `Decrease confidence scores in ${range} range (actual: ${cal.actual_success_rate}%)`
              );
              priorityActions.push(
                `Critical: Recalibrate ${range} confidence range`
              );
            }
          }
        });
      }

      if (!focusArea || focusArea === "patterns") {
        const topPatterns = insights.patterns.slice(0, 2);
        topPatterns.forEach((pattern) => {
          if (pattern.success_rate > 75 && pattern.sample_size >= 3) {
            recommendations.push(
              `Prioritize signal pattern: ${pattern.indicator_combination.join(
                "+"
              )} in ${pattern.pattern_type} (${pattern.success_rate}% success)`
            );
            priorityActions.push(
              `Implement pattern recognition for ${pattern.pattern_type}`
            );
          }
        });
      }

      // 🔧 SESSION #314: Calculate overall confidence in recommendations
      const totalSampleSize = insights.summary.total_outcomes || 0;
      const confidenceLevel = Math.min(100, 30 + totalSampleSize * 2); // Increases with more data

      return {
        recommendations:
          recommendations.length > 0
            ? recommendations
            : ["Insufficient data for specific recommendations"],
        priority_actions:
          priorityActions.length > 0
            ? priorityActions
            : ["Continue collecting signal outcome data"],
        confidence_level: Math.round(confidenceLevel * 100) / 100,
      };
    } catch (error) {
      console.error("Error generating optimization recommendations:", error);
      return {
        recommendations: [
          "Error generating recommendations - check data availability",
        ],
        priority_actions: ["Verify signal outcomes data integrity"],
        confidence_level: 0,
      };
    }
  }
}

/**
 * 🎯 PURPOSE: Factory function to create KnowledgeEngine instance
 * 🔧 SESSION #314: Easy instantiation following V4 patterns
 * 📝 HANDOVER: Use this to create knowledge engine with environment variables
 */
export function createKnowledgeEngine(version = "v1.0"): KnowledgeEngine {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Missing required environment variables: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY"
    );
  }

  return new KnowledgeEngine(supabaseUrl, supabaseKey, version);
}

/**
 * 🎯 PURPOSE: Export main classes and functions for edge function integration
 * 🔧 SESSION #314: Ready for integration with V4 signal generation system
 * 📝 HANDOVER: Import these in your main edge function for AI learning
 */
export default KnowledgeEngine;
