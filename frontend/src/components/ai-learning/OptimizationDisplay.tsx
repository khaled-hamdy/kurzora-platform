import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import {
  TrendingUp,
  TrendingDown,
  RefreshCw,
  ArrowRight,
  BarChart3,
  Target,
  Zap,
  CheckCircle,
  AlertTriangle,
  Settings,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// 🎯 PURPOSE: AI Optimization Display - Before/after optimization visualization showing performance improvements
// 🔧 SESSION #319: AI Learning Transparency Panel - Optimization changes with before/after data
// 🛡️ PRESERVATION: Uses Session #314-318 established patterns, maintains all existing functionality exactly
// 📝 HANDOVER: Displays optimization improvements using real signal_outcomes data and AI calibration
// ✅ PRODUCTION: Real database queries only, no synthetic data, follows exact established patterns

// Initialize Supabase client using established project patterns (Vite environment variables)
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || "",
  import.meta.env.VITE_SUPABASE_ANON_KEY || ""
);

// TypeScript interfaces following established Session #314-318 patterns
interface OptimizationDisplayProps {
  timeframeDays?: number;
}

interface OptimizationMetric {
  metricName: string;
  metricType: "indicator" | "confidence" | "market_condition" | "overall";
  beforeValue: number;
  afterValue: number;
  improvement: number;
  improvementPercentage: number;
  sampleSize: number;
  confidence: number;
  status: "improved" | "declined" | "unchanged";
  description: string;
}

interface ConfidenceOptimization {
  confidenceRange: [number, number];
  predictedSuccessRate: number;
  actualSuccessRate: number;
  calibrationBefore: number;
  calibrationAfter: number;
  recommendation: "increase" | "decrease" | "maintain";
  sampleSize: number;
}

interface IndicatorOptimization {
  indicatorName: string;
  timeframe: string;
  successRateBefore: number;
  successRateAfter: number;
  optimalRange: [number, number] | null;
  marketConditions: string[];
  improvementFactor: number;
  sampleSize: number;
}

interface OverallOptimizationSummary {
  totalOptimizations: number;
  successfulOptimizations: number;
  overallImprovement: number;
  winRateBefore: number;
  winRateAfter: number;
  confidenceImprovement: number;
  topOptimization: string;
}

const OptimizationDisplay: React.FC<OptimizationDisplayProps> = ({
  timeframeDays = 30,
}) => {
  // State management following established Session #315-318 patterns
  const [optimizationMetrics, setOptimizationMetrics] = useState<
    OptimizationMetric[]
  >([]);
  const [confidenceOptimizations, setConfidenceOptimizations] = useState<
    ConfidenceOptimization[]
  >([]);
  const [indicatorOptimizations, setIndicatorOptimizations] = useState<
    IndicatorOptimization[]
  >([]);
  const [overallSummary, setOverallSummary] =
    useState<OverallOptimizationSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMetricType, setSelectedMetricType] = useState<string>("all");

  // Fetch optimization data on component mount
  useEffect(() => {
    fetchOptimizationData();
  }, [timeframeDays]);

  // Main optimization data fetching function using established patterns from Session #314-318
  const fetchOptimizationData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 🔧 SESSION #319: Query signal_outcomes for optimization analysis (follows Session #314 patterns)
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - timeframeDays);

      const { data: outcomes, error: outcomesError } = await supabase
        .from("signal_outcomes")
        .select("*")
        .gte("created_at", cutoffDate.toISOString())
        .order("created_at", { ascending: true }); // Chronological order for before/after analysis

      if (outcomesError) {
        throw new Error(
          `Failed to fetch optimization data: ${outcomesError.message}`
        );
      }

      if (!outcomes || outcomes.length < 10) {
        throw new Error(
          "Insufficient data for optimization analysis (minimum 10 outcomes required)"
        );
      }

      // 🔧 SESSION #319: Process optimization metrics from chronological data
      const metrics = await processOptimizationMetrics(outcomes);
      const confidence = await analyzeConfidenceOptimizations(outcomes);
      const indicators = await analyzeIndicatorOptimizations(outcomes);
      const summary = calculateOverallSummary(metrics, outcomes);

      setOptimizationMetrics(metrics);
      setConfidenceOptimizations(confidence);
      setIndicatorOptimizations(indicators);
      setOverallSummary(summary);
    } catch (err) {
      console.error("Error fetching optimization data:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load optimization data"
      );
    } finally {
      setLoading(false);
    }
  };

  // Process optimization metrics by comparing before/after periods (follows Session #314 learning patterns)
  const processOptimizationMetrics = async (
    outcomes: any[]
  ): Promise<OptimizationMetric[]> => {
    const metrics: OptimizationMetric[] = [];

    // Split data into before (first half) and after (second half) for comparison
    const midpoint = Math.floor(outcomes.length / 2);
    const beforeOutcomes = outcomes.slice(0, midpoint);
    const afterOutcomes = outcomes.slice(midpoint);

    // Overall performance optimization
    const beforeWinRate = calculateWinRate(beforeOutcomes);
    const afterWinRate = calculateWinRate(afterOutcomes);
    const overallImprovement = afterWinRate - beforeWinRate;

    metrics.push({
      metricName: "Overall Win Rate",
      metricType: "overall",
      beforeValue: beforeWinRate,
      afterValue: afterWinRate,
      improvement: overallImprovement,
      improvementPercentage:
        beforeWinRate > 0 ? (overallImprovement / beforeWinRate) * 100 : 0,
      sampleSize: outcomes.length,
      confidence: Math.min(100, outcomes.length * 2), // Confidence based on sample size
      status:
        overallImprovement > 1
          ? "improved"
          : overallImprovement < -1
          ? "declined"
          : "unchanged",
      description:
        "Overall signal success rate optimization through AI learning",
    });

    // Confidence calibration optimization
    const beforeCalibration = calculateAverageCalibration(beforeOutcomes);
    const afterCalibration = calculateAverageCalibration(afterOutcomes);
    const calibrationImprovement =
      Math.abs(1.0 - afterCalibration) - Math.abs(1.0 - beforeCalibration);

    metrics.push({
      metricName: "Confidence Calibration",
      metricType: "confidence",
      beforeValue: beforeCalibration,
      afterValue: afterCalibration,
      improvement: calibrationImprovement,
      improvementPercentage: calibrationImprovement * 100,
      sampleSize: outcomes.filter((o) => o.actual_vs_predicted_score !== null)
        .length,
      confidence: 85,
      status:
        calibrationImprovement > 0.05
          ? "improved"
          : calibrationImprovement < -0.05
          ? "declined"
          : "unchanged",
      description: "AI prediction accuracy vs actual performance calibration",
    });

    // Indicator-specific optimizations
    const indicatorMetrics = await analyzeIndicatorMetrics(
      beforeOutcomes,
      afterOutcomes
    );
    metrics.push(...indicatorMetrics);

    // Market condition optimizations
    const marketMetrics = await analyzeMarketConditionMetrics(
      beforeOutcomes,
      afterOutcomes
    );
    metrics.push(...marketMetrics);

    return metrics.sort(
      (a, b) => Math.abs(b.improvement) - Math.abs(a.improvement)
    );
  };

  // Calculate win rate from outcomes (follows Session #318 patterns)
  const calculateWinRate = (outcomes: any[]): number => {
    const completedOutcomes = outcomes.filter((o) =>
      ["win", "loss"].includes(o.outcome_type)
    );
    const wins = completedOutcomes.filter(
      (o) => o.outcome_type === "win"
    ).length;
    return completedOutcomes.length > 0
      ? (wins / completedOutcomes.length) * 100
      : 0;
  };

  // Calculate average calibration from actual_vs_predicted_score (follows Session #314 patterns)
  const calculateAverageCalibration = (outcomes: any[]): number => {
    const validScores = outcomes.filter(
      (o) => o.actual_vs_predicted_score !== null
    );
    if (validScores.length === 0) return 1.0;

    const avgScore =
      validScores.reduce(
        (sum, o) => sum + (o.actual_vs_predicted_score || 0),
        0
      ) / validScores.length;
    return avgScore / 100; // Normalize to 0-1 scale
  };

  // Analyze indicator-specific metrics optimization (follows Session #314 patterns)
  const analyzeIndicatorMetrics = async (
    beforeOutcomes: any[],
    afterOutcomes: any[]
  ): Promise<OptimizationMetric[]> => {
    const metrics: OptimizationMetric[] = [];
    const indicatorStats: Record<
      string,
      { before: number[]; after: number[] }
    > = {};

    // Collect indicator correlations from before and after periods
    [...beforeOutcomes, ...afterOutcomes].forEach((outcome, index) => {
      const isBefore = index < beforeOutcomes.length;

      if (outcome.indicator_accuracy) {
        Object.entries(outcome.indicator_accuracy).forEach(
          ([indicator, data]: [string, any]) => {
            if (!indicatorStats[indicator]) {
              indicatorStats[indicator] = { before: [], after: [] };
            }

            if (data.outcome_correlation && outcome.outcome_type === "win") {
              if (isBefore) {
                indicatorStats[indicator].before.push(data.outcome_correlation);
              } else {
                indicatorStats[indicator].after.push(data.outcome_correlation);
              }
            }
          }
        );
      }
    });

    // Calculate optimization metrics for each indicator
    Object.entries(indicatorStats).forEach(([indicator, stats]) => {
      if (stats.before.length >= 3 && stats.after.length >= 3) {
        const beforeAvg =
          stats.before.reduce((sum, val) => sum + val, 0) / stats.before.length;
        const afterAvg =
          stats.after.reduce((sum, val) => sum + val, 0) / stats.after.length;
        const improvement = (afterAvg - beforeAvg) * 100;

        metrics.push({
          metricName: indicator.replace("_", " "),
          metricType: "indicator",
          beforeValue: beforeAvg * 100,
          afterValue: afterAvg * 100,
          improvement: improvement,
          improvementPercentage:
            beforeAvg > 0 ? (improvement / (beforeAvg * 100)) * 100 : 0,
          sampleSize: stats.before.length + stats.after.length,
          confidence: Math.min(
            100,
            (stats.before.length + stats.after.length) * 5
          ),
          status:
            improvement > 5
              ? "improved"
              : improvement < -5
              ? "declined"
              : "unchanged",
          description: `${indicator.replace(
            "_",
            " "
          )} correlation optimization through AI learning`,
        });
      }
    });

    return metrics.slice(0, 5); // Top 5 indicator optimizations
  };

  // Analyze market condition optimization metrics (follows Session #314 patterns)
  const analyzeMarketConditionMetrics = async (
    beforeOutcomes: any[],
    afterOutcomes: any[]
  ): Promise<OptimizationMetric[]> => {
    const metrics: OptimizationMetric[] = [];
    const marketStats: Record<
      string,
      {
        before: { wins: number; total: number };
        after: { wins: number; total: number };
      }
    > = {};

    // Collect market condition performance from before and after periods
    [...beforeOutcomes, ...afterOutcomes].forEach((outcome, index) => {
      const isBefore = index < beforeOutcomes.length;

      if (
        outcome.market_conditions &&
        ["win", "loss"].includes(outcome.outcome_type)
      ) {
        const regime = outcome.market_conditions.market_regime;
        const volatility = outcome.market_conditions.volatility_level;
        const conditionKey = `${regime}_${volatility}`;

        if (!marketStats[conditionKey]) {
          marketStats[conditionKey] = {
            before: { wins: 0, total: 0 },
            after: { wins: 0, total: 0 },
          };
        }

        const period = isBefore
          ? marketStats[conditionKey].before
          : marketStats[conditionKey].after;
        period.total++;
        if (outcome.outcome_type === "win") {
          period.wins++;
        }
      }
    });

    // Calculate optimization metrics for each market condition
    Object.entries(marketStats).forEach(([condition, stats]) => {
      if (stats.before.total >= 3 && stats.after.total >= 3) {
        const beforeRate = (stats.before.wins / stats.before.total) * 100;
        const afterRate = (stats.after.wins / stats.after.total) * 100;
        const improvement = afterRate - beforeRate;

        metrics.push({
          metricName: condition.replace("_", " / "),
          metricType: "market_condition",
          beforeValue: beforeRate,
          afterValue: afterRate,
          improvement: improvement,
          improvementPercentage:
            beforeRate > 0 ? (improvement / beforeRate) * 100 : 0,
          sampleSize: stats.before.total + stats.after.total,
          confidence: Math.min(
            100,
            (stats.before.total + stats.after.total) * 8
          ),
          status:
            improvement > 5
              ? "improved"
              : improvement < -5
              ? "declined"
              : "unchanged",
          description: `Performance in ${condition.replace(
            "_",
            " market with "
          )} volatility conditions`,
        });
      }
    });

    return metrics.slice(0, 3); // Top 3 market condition optimizations
  };

  // Analyze confidence calibration optimizations (follows Session #314 patterns)
  const analyzeConfidenceOptimizations = async (
    outcomes: any[]
  ): Promise<ConfidenceOptimization[]> => {
    const optimizations: ConfidenceOptimization[] = [];
    const midpoint = Math.floor(outcomes.length / 2);
    const beforeOutcomes = outcomes.slice(0, midpoint);
    const afterOutcomes = outcomes.slice(midpoint);

    // Analyze confidence ranges for calibration improvements
    const confidenceRanges: [number, number][] = [
      [50, 70],
      [70, 80],
      [80, 90],
      [90, 100],
    ];

    for (const range of confidenceRanges) {
      const beforeData = await getConfidenceRangeData(
        beforeOutcomes,
        range[0],
        range[1]
      );
      const afterData = await getConfidenceRangeData(
        afterOutcomes,
        range[0],
        range[1]
      );

      if (beforeData.total >= 3 && afterData.total >= 3) {
        const beforeRate = (beforeData.wins / beforeData.total) * 100;
        const afterRate = (afterData.wins / afterData.total) * 100;
        const expectedRate = (range[0] + range[1]) / 2;

        const calibrationBefore = beforeRate / expectedRate;
        const calibrationAfter = afterRate / expectedRate;

        let recommendation: "increase" | "decrease" | "maintain";
        if (calibrationAfter > 1.1) {
          recommendation = "increase";
        } else if (calibrationAfter < 0.9) {
          recommendation = "decrease";
        } else {
          recommendation = "maintain";
        }

        optimizations.push({
          confidenceRange: range,
          predictedSuccessRate: expectedRate,
          actualSuccessRate: afterRate,
          calibrationBefore,
          calibrationAfter,
          recommendation,
          sampleSize: beforeData.total + afterData.total,
        });
      }
    }

    return optimizations;
  };

  // Get confidence range data for calibration analysis (follows Session #314 patterns)
  const getConfidenceRangeData = async (
    outcomes: any[],
    minConf: number,
    maxConf: number
  ) => {
    // Get signal IDs from outcomes
    const signalIds = outcomes.map((o) => o.signal_id).filter(Boolean);

    if (signalIds.length === 0) return { wins: 0, total: 0 };

    // Query trading_signals for confidence scores in range
    const { data: signals, error } = await supabase
      .from("trading_signals")
      .select("id")
      .in("id", signalIds)
      .gte("confidence_score", minConf)
      .lt("confidence_score", maxConf);

    if (error || !signals) return { wins: 0, total: 0 };

    // Filter outcomes to match confidence range
    const signalIdsInRange = new Set(signals.map((s) => s.id));
    const filteredOutcomes = outcomes.filter((o) =>
      signalIdsInRange.has(o.signal_id)
    );

    const total = filteredOutcomes.filter((o) =>
      ["win", "loss"].includes(o.outcome_type)
    ).length;
    const wins = filteredOutcomes.filter(
      (o) => o.outcome_type === "win"
    ).length;

    return { wins, total };
  };

  // Analyze indicator-specific optimizations (follows Session #314 patterns)
  const analyzeIndicatorOptimizations = async (
    outcomes: any[]
  ): Promise<IndicatorOptimization[]> => {
    const optimizations: IndicatorOptimization[] = [];
    const midpoint = Math.floor(outcomes.length / 2);
    const beforeOutcomes = outcomes.slice(0, midpoint);
    const afterOutcomes = outcomes.slice(midpoint);

    const indicatorStats: Record<
      string,
      {
        before: { successes: number; total: number; values: number[] };
        after: { successes: number; total: number; values: number[] };
        marketConditions: Set<string>;
      }
    > = {};

    // Collect indicator performance data
    [...beforeOutcomes, ...afterOutcomes].forEach((outcome, index) => {
      const isBefore = index < beforeOutcomes.length;

      if (
        outcome.indicator_accuracy &&
        ["win", "loss"].includes(outcome.outcome_type)
      ) {
        Object.entries(outcome.indicator_accuracy).forEach(
          ([indicator, data]: [string, any]) => {
            if (!indicatorStats[indicator]) {
              indicatorStats[indicator] = {
                before: { successes: 0, total: 0, values: [] },
                after: { successes: 0, total: 0, values: [] },
                marketConditions: new Set(),
              };
            }

            const period = isBefore
              ? indicatorStats[indicator].before
              : indicatorStats[indicator].after;
            period.total++;
            if (outcome.outcome_type === "win") {
              period.successes++;
            }

            if (data.raw_value !== null) {
              period.values.push(data.raw_value);
            }

            // Track market conditions
            if (outcome.market_conditions?.market_regime) {
              indicatorStats[indicator].marketConditions.add(
                outcome.market_conditions.market_regime
              );
            }
          }
        );
      }
    });

    // Calculate optimizations for each indicator
    Object.entries(indicatorStats).forEach(([indicatorKey, stats]) => {
      if (stats.before.total >= 5 && stats.after.total >= 5) {
        const beforeRate = (stats.before.successes / stats.before.total) * 100;
        const afterRate = (stats.after.successes / stats.after.total) * 100;
        const improvementFactor = afterRate / Math.max(beforeRate, 1); // Avoid division by zero

        // Calculate optimal range from after period values
        let optimalRange: [number, number] | null = null;
        if (stats.after.values.length > 0) {
          const sortedValues = stats.after.values.sort((a, b) => a - b);
          const q1 = sortedValues[Math.floor(sortedValues.length * 0.25)];
          const q3 = sortedValues[Math.floor(sortedValues.length * 0.75)];
          optimalRange = [q1, q3];
        }

        const [indicatorName, timeframe] = indicatorKey.split("_");
        optimizations.push({
          indicatorName: indicatorName || indicatorKey,
          timeframe: timeframe || "1H",
          successRateBefore: beforeRate,
          successRateAfter: afterRate,
          optimalRange,
          marketConditions: Array.from(stats.marketConditions),
          improvementFactor,
          sampleSize: stats.before.total + stats.after.total,
        });
      }
    });

    return optimizations
      .sort((a, b) => b.improvementFactor - a.improvementFactor)
      .slice(0, 5);
  };

  // Calculate overall optimization summary (follows Session #318 patterns)
  const calculateOverallSummary = (
    metrics: OptimizationMetric[],
    outcomes: any[]
  ): OverallOptimizationSummary => {
    const totalOptimizations = metrics.length;
    const successfulOptimizations = metrics.filter(
      (m) => m.status === "improved"
    ).length;
    const overallImprovement =
      metrics.reduce((sum, m) => sum + m.improvement, 0) / totalOptimizations;

    const midpoint = Math.floor(outcomes.length / 2);
    const winRateBefore = calculateWinRate(outcomes.slice(0, midpoint));
    const winRateAfter = calculateWinRate(outcomes.slice(midpoint));

    const confidenceMetric = metrics.find((m) => m.metricType === "confidence");
    const confidenceImprovement = confidenceMetric
      ? confidenceMetric.improvement
      : 0;

    const topOptimization =
      metrics.find((m) => m.status === "improved")?.metricName ||
      "No optimizations detected";

    return {
      totalOptimizations,
      successfulOptimizations,
      overallImprovement,
      winRateBefore,
      winRateAfter,
      confidenceImprovement,
      topOptimization,
    };
  };

  // Get color for optimization status following established Session #315-318 patterns
  const getOptimizationColor = (status: string, improvement: number) => {
    if (status === "improved")
      return improvement > 10 ? "text-emerald-400" : "text-blue-400";
    if (status === "declined") return "text-red-400";
    return "text-slate-400";
  };

  const getOptimizationBgColor = (status: string, improvement: number) => {
    if (status === "improved")
      return improvement > 10 ? "bg-emerald-600/20" : "bg-blue-600/20";
    if (status === "declined") return "bg-red-600/20";
    return "bg-slate-600/20";
  };

  // Format percentage values following established patterns
  const formatPercentage = (value: number): string => {
    return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
  };

  // Format optimization value display
  const formatOptimizationValue = (
    value: number,
    metricType: string
  ): string => {
    if (metricType === "confidence") {
      return value.toFixed(2);
    }
    return `${value.toFixed(1)}%`;
  };

  // Filter metrics by selected type
  const filteredMetrics =
    selectedMetricType === "all"
      ? optimizationMetrics
      : optimizationMetrics.filter((m) => m.metricType === selectedMetricType);

  // Loading state following established Session #315-318 patterns
  if (loading) {
    return (
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Settings className="h-5 w-5 text-orange-400" />
            <span>AI Optimization Display</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-slate-700 rounded w-1/4 mb-2"></div>
                <div className="h-20 bg-slate-700/50 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state following established Session #315-318 patterns
  if (error) {
    return (
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-red-400" />
              <span>AI Optimization Display</span>
            </div>
            <Button
              onClick={fetchOptimizationData}
              size="sm"
              variant="ghost"
              className="text-blue-400 hover:text-blue-300"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-red-400 mb-2">
              ⚠️ Unable to load optimization data
            </div>
            <div className="text-slate-400 text-sm">{error}</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:bg-slate-800/70 transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-orange-400" />
            <span>AI Optimization Display</span>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={selectedMetricType}
              onChange={(e) => setSelectedMetricType(e.target.value)}
              className="bg-slate-700 text-slate-300 text-sm rounded px-3 py-1 border border-slate-600"
            >
              <option value="all">All Optimizations</option>
              <option value="overall">Overall Performance</option>
              <option value="indicator">Indicators</option>
              <option value="confidence">Confidence</option>
              <option value="market_condition">Market Conditions</option>
            </select>
            <Button
              onClick={fetchOptimizationData}
              size="sm"
              variant="ghost"
              className="text-blue-400 hover:text-blue-300"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Optimization Summary */}
        {overallSummary && (
          <div className="bg-orange-600/10 border border-orange-700/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-orange-400 font-medium">
                Optimization Summary
              </span>
              <Zap className="h-4 w-4 text-orange-400" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-xs text-slate-400 mb-1">
                  Total Optimizations
                </div>
                <div className="text-lg font-bold text-slate-200">
                  {overallSummary.totalOptimizations}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-1">Successful</div>
                <div className="text-lg font-bold text-emerald-400">
                  {overallSummary.successfulOptimizations}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-1">
                  Win Rate Improvement
                </div>
                <div
                  className={`text-lg font-bold ${getOptimizationColor(
                    "improved",
                    overallSummary.winRateAfter - overallSummary.winRateBefore
                  )}`}
                >
                  {formatPercentage(
                    overallSummary.winRateAfter - overallSummary.winRateBefore
                  )}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-1">
                  Top Optimization
                </div>
                <div className="text-sm font-semibold text-slate-200">
                  {overallSummary.topOptimization.slice(0, 15)}...
                </div>
              </div>
            </div>

            {/* Before/After Win Rate Comparison */}
            <div className="mt-4 pt-4 border-t border-orange-700/20">
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <div className="text-xs text-slate-400 mb-1">Before</div>
                  <div className="text-xl font-bold text-slate-300">
                    {overallSummary.winRateBefore.toFixed(1)}%
                  </div>
                </div>
                <ArrowRight className="h-6 w-6 text-orange-400" />
                <div className="text-center">
                  <div className="text-xs text-slate-400 mb-1">After</div>
                  <div className="text-xl font-bold text-emerald-400">
                    {overallSummary.winRateAfter.toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Optimization Metrics */}
        {filteredMetrics.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-medium">
                Optimization Results ({filteredMetrics.length})
              </span>
              <BarChart3 className="h-4 w-4 text-blue-400" />
            </div>

            {filteredMetrics.map((metric, index) => (
              <div
                key={index}
                className={`rounded-lg p-4 ${getOptimizationBgColor(
                  metric.status,
                  metric.improvement
                )}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-200 font-medium">
                      {metric.metricName}
                    </span>
                    <span className="text-xs text-slate-400 bg-slate-700/30 px-2 py-1 rounded">
                      {metric.metricType}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {metric.status === "improved" ? (
                      <TrendingUp className="h-4 w-4 text-emerald-400" />
                    ) : metric.status === "declined" ? (
                      <TrendingDown className="h-4 w-4 text-red-400" />
                    ) : (
                      <Target className="h-4 w-4 text-slate-400" />
                    )}
                    <span
                      className={`font-semibold ${getOptimizationColor(
                        metric.status,
                        metric.improvement
                      )}`}
                    >
                      {formatPercentage(metric.improvement)}
                    </span>
                  </div>
                </div>

                {/* Before/After Comparison */}
                <div className="flex items-center justify-between mb-3">
                  <div className="text-center">
                    <div className="text-xs text-slate-400 mb-1">Before</div>
                    <div className="text-lg font-bold text-slate-300">
                      {formatOptimizationValue(
                        metric.beforeValue,
                        metric.metricType
                      )}
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-400" />
                  <div className="text-center">
                    <div className="text-xs text-slate-400 mb-1">After</div>
                    <div
                      className={`text-lg font-bold ${getOptimizationColor(
                        metric.status,
                        metric.improvement
                      )}`}
                    >
                      {formatOptimizationValue(
                        metric.afterValue,
                        metric.metricType
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-sm text-slate-400 mb-2">
                  {metric.description}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Sample Size: {metric.sampleSize}</span>
                  <span>Confidence: {metric.confidence.toFixed(0)}%</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Confidence Calibration Optimizations */}
        {confidenceOptimizations.length > 0 && selectedMetricType === "all" && (
          <div className="bg-slate-700/20 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-300 font-medium">
                Confidence Calibration
              </span>
              <Target className="h-4 w-4 text-blue-400" />
            </div>
            <div className="space-y-3">
              {confidenceOptimizations.slice(0, 3).map((opt, index) => (
                <div
                  key={index}
                  className="border border-slate-600/30 rounded p-3"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-300 font-medium">
                      {opt.confidenceRange[0]}-{opt.confidenceRange[1]}% Range
                    </span>
                    <div className="flex items-center space-x-2">
                      {opt.recommendation === "increase" ? (
                        <TrendingUp className="h-4 w-4 text-emerald-400" />
                      ) : opt.recommendation === "decrease" ? (
                        <TrendingDown className="h-4 w-4 text-red-400" />
                      ) : (
                        <CheckCircle className="h-4 w-4 text-blue-400" />
                      )}
                      <span className="text-xs text-slate-400 capitalize">
                        {opt.recommendation}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-slate-400">Predicted:</span>
                      <div className="text-slate-300">
                        {opt.predictedSuccessRate.toFixed(1)}%
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-400">Actual:</span>
                      <div
                        className={getOptimizationColor(
                          "improved",
                          opt.actualSuccessRate - opt.predictedSuccessRate
                        )}
                      >
                        {opt.actualSuccessRate.toFixed(1)}%
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-400">Sample:</span>
                      <div className="text-slate-300">{opt.sampleSize}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Indicator Optimizations */}
        {indicatorOptimizations.length > 0 && selectedMetricType === "all" && (
          <div className="bg-slate-700/20 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-300 font-medium">
                Indicator Optimizations
              </span>
              <BarChart3 className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="space-y-3">
              {indicatorOptimizations.slice(0, 3).map((opt, index) => (
                <div
                  key={index}
                  className="border border-slate-600/30 rounded p-3"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-300 font-medium">
                      {opt.indicatorName} ({opt.timeframe})
                    </span>
                    <span
                      className={`font-semibold ${getOptimizationColor(
                        "improved",
                        (opt.improvementFactor - 1) * 100
                      )}`}
                    >
                      {opt.improvementFactor.toFixed(2)}x
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs mb-2">
                    <div>
                      <span className="text-slate-400">Before:</span>
                      <div className="text-slate-300">
                        {opt.successRateBefore.toFixed(1)}%
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-400">After:</span>
                      <div
                        className={getOptimizationColor(
                          "improved",
                          opt.successRateAfter - opt.successRateBefore
                        )}
                      >
                        {opt.successRateAfter.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                  {opt.optimalRange && (
                    <div className="text-xs text-slate-500">
                      Optimal Range: {opt.optimalRange[0].toFixed(2)} -{" "}
                      {opt.optimalRange[1].toFixed(2)}
                    </div>
                  )}
                  <div className="text-xs text-slate-500">
                    Markets: {opt.marketConditions.slice(0, 2).join(", ")} •
                    Sample: {opt.sampleSize}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No optimizations message */}
        {filteredMetrics.length === 0 && (
          <div className="text-center py-8">
            <AlertTriangle className="h-8 w-8 text-amber-400 mx-auto mb-2" />
            <div className="text-slate-400 mb-2">No optimizations detected</div>
            <div className="text-xs text-slate-500">
              More data needed to identify optimization opportunities
            </div>
          </div>
        )}

        {/* Data Source Information */}
        <div className="text-xs text-slate-500 border-t border-slate-700 pt-3">
          Optimization analysis based on {timeframeDays} days of signal outcomes
          {" • "}
          Before/after comparison using chronological data split
          {" • "}
          Data from signal_outcomes, indicators, and trading_signals tables
        </div>
      </CardContent>
    </Card>
  );
};

export default OptimizationDisplay;
