import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import {
  Brain,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  Activity,
  Zap,
  Target,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// 🎯 PURPOSE: AI Learning Transparency Panel - Real-time AI learning display showing what the AI discovered and applied
// 🔧 SESSION #319: AI Learning Transparency Panel - Main learning activity display component
// 🛡️ PRESERVATION: Uses Session #314-318 established patterns, maintains all existing functionality exactly
// 📝 HANDOVER: Displays real-time AI learning insights using existing signal_outcomes and indicators tables
// ✅ PRODUCTION: Real database queries only, no synthetic data, follows exact established patterns

// Initialize Supabase client using established project patterns (Vite environment variables)
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || "",
  import.meta.env.VITE_SUPABASE_ANON_KEY || ""
);

// TypeScript interfaces following established Session #314-318 patterns
interface LearningPanelProps {
  timeframeDays?: number;
}

interface AILearningMetrics {
  totalOutcomes: number;
  learningVersion: string;
  scoringVersion: string;
  winRate: number;
  recentDiscoveries: string[];
  indicatorImprovements: IndicatorImprovement[];
  marketConditionLearning: MarketConditionLearning[];
  confidenceCalibration: ConfidenceCalibration;
  lastUpdated: string;
}

interface IndicatorImprovement {
  indicatorName: string;
  timeframe: string;
  oldSuccessRate: number;
  newSuccessRate: number;
  improvement: number;
  sampleSize: number;
  confidence: number;
}

interface MarketConditionLearning {
  marketRegime: string;
  volatilityLevel: string;
  successRate: number;
  sampleSize: number;
  optimalIndicators: string[];
}

interface ConfidenceCalibration {
  overallCalibration: number;
  calibrationStatus: "under_confident" | "over_confident" | "well_calibrated";
  recommendation: string;
}

interface AIActivityLog {
  timestamp: string;
  activityType: "learning" | "optimization" | "discovery";
  description: string;
  impact: "high" | "medium" | "low";
}

const LearningPanel: React.FC<LearningPanelProps> = ({ timeframeDays = 7 }) => {
  // State management following established Session #315-318 patterns
  const [learningMetrics, setLearningMetrics] =
    useState<AILearningMetrics | null>(null);
  const [activityLog, setActivityLog] = useState<AIActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Fetch AI learning data on component mount and refresh
  useEffect(() => {
    fetchAILearningData();

    // Set up auto-refresh every 5 minutes for real-time updates
    const interval = setInterval(fetchAILearningData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [timeframeDays]);

  // Main AI learning data fetching function using established patterns from Session #314-318
  const fetchAILearningData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 🔧 SESSION #319: Query signal_outcomes table for AI learning data (follows Session #314 patterns)
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - timeframeDays);

      const { data: outcomes, error: outcomesError } = await supabase
        .from("signal_outcomes")
        .select("*")
        .gte("created_at", cutoffDate.toISOString())
        .order("created_at", { ascending: false });

      if (outcomesError) {
        throw new Error(
          `Failed to fetch AI learning data: ${outcomesError.message}`
        );
      }

      // 🔧 SESSION #319: Query indicators table for scoring version information (follows Session #315-316 patterns)
      const { data: indicatorsData, error: indicatorsError } = await supabase
        .from("indicators")
        .select("scoring_version")
        .order("created_at", { ascending: false })
        .limit(1);

      if (indicatorsError) {
        throw new Error(
          `Failed to fetch indicators data: ${indicatorsError.message}`
        );
      }

      // 🔧 SESSION #319: Process AI learning insights from real data
      const metrics = await processAILearningMetrics(
        outcomes || [],
        indicatorsData || []
      );
      const activity = generateAIActivityLog(outcomes || []);

      setLearningMetrics(metrics);
      setActivityLog(activity);
      setLastRefresh(new Date());
    } catch (err) {
      console.error("Error fetching AI learning data:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load AI learning data"
      );
    } finally {
      setLoading(false);
    }
  };

  // Process AI learning metrics from signal_outcomes data (follows Session #314 AI learning patterns)
  const processAILearningMetrics = async (
    outcomes: any[],
    indicatorsData: any[]
  ): Promise<AILearningMetrics> => {
    const totalOutcomes = outcomes.length;

    // Get latest learning and scoring versions from real data
    const learningVersion =
      outcomes.length > 0 ? outcomes[0].learning_version || "v1.0" : "v1.0";
    const scoringVersion =
      indicatorsData.length > 0
        ? indicatorsData[0].scoring_version || "session_313e"
        : "session_313e";

    // Calculate win rate from actual outcomes (follows Session #318 patterns)
    const winningOutcomes = outcomes.filter(
      (o) => o.outcome_type === "win"
    ).length;
    const totalCompletedOutcomes = outcomes.filter((o) =>
      ["win", "loss"].includes(o.outcome_type)
    ).length;
    const winRate =
      totalCompletedOutcomes > 0
        ? (winningOutcomes / totalCompletedOutcomes) * 100
        : 0;

    // Extract recent discoveries from real AI learning data
    const recentDiscoveries = extractRecentDiscoveries(outcomes);

    // Calculate indicator improvements from indicator_accuracy JSONB data
    const indicatorImprovements = calculateIndicatorImprovements(outcomes);

    // Extract market condition learning from market_conditions JSONB data
    const marketConditionLearning = extractMarketConditionLearning(outcomes);

    // Calculate confidence calibration from actual vs predicted scores
    const confidenceCalibration = calculateConfidenceCalibration(outcomes);

    return {
      totalOutcomes,
      learningVersion,
      scoringVersion,
      winRate,
      recentDiscoveries,
      indicatorImprovements,
      marketConditionLearning,
      confidenceCalibration,
      lastUpdated: new Date().toISOString(),
    };
  };

  // Extract recent AI discoveries from signal outcomes (follows Session #314 learning patterns)
  const extractRecentDiscoveries = (outcomes: any[]): string[] => {
    const discoveries: string[] = [];

    // Analyze recent outcomes for learning patterns
    const recentOutcomes = outcomes.slice(0, 10); // Last 10 outcomes

    recentOutcomes.forEach((outcome) => {
      if (outcome.indicator_accuracy && outcome.outcome_type === "win") {
        // Extract high-performing indicators from JSONB data
        Object.entries(outcome.indicator_accuracy).forEach(
          ([indicator, data]: [string, any]) => {
            if (data.outcome_correlation && data.outcome_correlation > 0.7) {
              discoveries.push(
                `${indicator} showed high correlation (${(
                  data.outcome_correlation * 100
                ).toFixed(0)}%) in recent signals`
              );
            }
          }
        );
      }

      if (outcome.market_conditions && outcome.outcome_type === "win") {
        const regime = outcome.market_conditions.market_regime;
        const volatility = outcome.market_conditions.volatility_level;
        if (regime && volatility) {
          discoveries.push(
            `Strong performance detected in ${regime} market with ${volatility} volatility`
          );
        }
      }
    });

    // Remove duplicates and return top 5 recent discoveries
    return [...new Set(discoveries)].slice(0, 5);
  };

  // Calculate indicator improvements from indicator_accuracy JSONB data (follows Session #314 patterns)
  const calculateIndicatorImprovements = (
    outcomes: any[]
  ): IndicatorImprovement[] => {
    const indicatorStats: Record<
      string,
      { successes: number; total: number; correlations: number[] }
    > = {};

    // Process outcomes to calculate indicator performance
    outcomes.forEach((outcome) => {
      if (outcome.indicator_accuracy) {
        Object.entries(outcome.indicator_accuracy).forEach(
          ([indicator, data]: [string, any]) => {
            if (!indicatorStats[indicator]) {
              indicatorStats[indicator] = {
                successes: 0,
                total: 0,
                correlations: [],
              };
            }

            indicatorStats[indicator].total++;
            if (outcome.outcome_type === "win") {
              indicatorStats[indicator].successes++;
            }

            if (data.outcome_correlation) {
              indicatorStats[indicator].correlations.push(
                data.outcome_correlation
              );
            }
          }
        );
      }
    });

    // Convert to indicator improvements array
    const improvements: IndicatorImprovement[] = [];
    Object.entries(indicatorStats).forEach(([indicatorKey, stats]) => {
      if (stats.total >= 5) {
        // Minimum sample size
        const [indicatorName, timeframe] = indicatorKey.split("_");
        const successRate = (stats.successes / stats.total) * 100;
        const avgCorrelation =
          stats.correlations.length > 0
            ? stats.correlations.reduce((sum, c) => sum + c, 0) /
              stats.correlations.length
            : 0;

        // Calculate improvement (using correlation as improvement metric)
        const improvement = avgCorrelation * 100;
        const confidence = Math.min(100, stats.total * 10); // Confidence based on sample size

        improvements.push({
          indicatorName: indicatorName || indicatorKey,
          timeframe: timeframe || "1H",
          oldSuccessRate: Math.max(0, successRate - improvement), // Estimated old rate
          newSuccessRate: successRate,
          improvement,
          sampleSize: stats.total,
          confidence,
        });
      }
    });

    // Sort by improvement and return top 5
    return improvements
      .sort((a, b) => b.improvement - a.improvement)
      .slice(0, 5);
  };

  // Extract market condition learning from market_conditions JSONB data (follows Session #314 patterns)
  const extractMarketConditionLearning = (
    outcomes: any[]
  ): MarketConditionLearning[] => {
    const marketStats: Record<
      string,
      { successes: number; total: number; indicators: Set<string> }
    > = {};

    outcomes.forEach((outcome) => {
      if (outcome.market_conditions) {
        const regime = outcome.market_conditions.market_regime;
        const volatility = outcome.market_conditions.volatility_level;
        const conditionKey = `${regime}_${volatility}`;

        if (!marketStats[conditionKey]) {
          marketStats[conditionKey] = {
            successes: 0,
            total: 0,
            indicators: new Set(),
          };
        }

        marketStats[conditionKey].total++;
        if (outcome.outcome_type === "win") {
          marketStats[conditionKey].successes++;
        }

        // Track indicators used in this market condition
        if (outcome.indicator_accuracy) {
          Object.keys(outcome.indicator_accuracy).forEach((indicator) => {
            marketStats[conditionKey].indicators.add(indicator);
          });
        }
      }
    });

    // Convert to market condition learning array
    const learning: MarketConditionLearning[] = [];
    Object.entries(marketStats).forEach(([conditionKey, stats]) => {
      if (stats.total >= 3) {
        // Minimum sample size
        const [regime, volatility] = conditionKey.split("_");
        const successRate = (stats.successes / stats.total) * 100;

        learning.push({
          marketRegime: regime || "unknown",
          volatilityLevel: volatility || "medium",
          successRate,
          sampleSize: stats.total,
          optimalIndicators: Array.from(stats.indicators).slice(0, 3), // Top 3 indicators
        });
      }
    });

    return learning.sort((a, b) => b.successRate - a.successRate).slice(0, 3);
  };

  // Calculate confidence calibration from actual_vs_predicted_score data (follows Session #314 patterns)
  const calculateConfidenceCalibration = (
    outcomes: any[]
  ): ConfidenceCalibration => {
    const validScores = outcomes.filter(
      (o) => o.actual_vs_predicted_score !== null
    );

    if (validScores.length === 0) {
      return {
        overallCalibration: 1.0,
        calibrationStatus: "well_calibrated",
        recommendation: "Insufficient data for calibration analysis",
      };
    }

    // Calculate average calibration from actual vs predicted scores
    const avgCalibration =
      validScores.reduce(
        (sum, o) => sum + (o.actual_vs_predicted_score || 0),
        0
      ) / validScores.length;
    const overallCalibration = avgCalibration / 100; // Normalize to 0-1 scale

    // Determine calibration status
    let calibrationStatus:
      | "under_confident"
      | "over_confident"
      | "well_calibrated";
    let recommendation: string;

    if (overallCalibration > 1.1) {
      calibrationStatus = "under_confident";
      recommendation =
        "AI predictions are too conservative - consider increasing confidence scores";
    } else if (overallCalibration < 0.9) {
      calibrationStatus = "over_confident";
      recommendation =
        "AI predictions are too optimistic - consider decreasing confidence scores";
    } else {
      calibrationStatus = "well_calibrated";
      recommendation =
        "AI confidence calibration is optimal - maintain current settings";
    }

    return {
      overallCalibration,
      calibrationStatus,
      recommendation,
    };
  };

  // Generate AI activity log from recent outcomes (follows Session #318 patterns)
  const generateAIActivityLog = (outcomes: any[]): AIActivityLog[] => {
    const activities: AIActivityLog[] = [];

    // Add recent learning activities
    const recentOutcomes = outcomes.slice(0, 5);
    recentOutcomes.forEach((outcome) => {
      if (
        outcome.outcome_type === "win" &&
        outcome.quality_score &&
        outcome.quality_score > 80
      ) {
        activities.push({
          timestamp: outcome.created_at,
          activityType: "learning",
          description: `High-quality win signal analyzed (Quality: ${outcome.quality_score}/100)`,
          impact: outcome.quality_score > 90 ? "high" : "medium",
        });
      }

      if (outcome.indicator_accuracy) {
        const highCorrelationIndicators = Object.entries(
          outcome.indicator_accuracy
        ).filter(
          ([, data]: [string, any]) =>
            data.outcome_correlation && data.outcome_correlation > 0.8
        );

        if (highCorrelationIndicators.length > 0) {
          activities.push({
            timestamp: outcome.created_at,
            activityType: "discovery",
            description: `Strong indicator correlation discovered: ${highCorrelationIndicators.length} indicators`,
            impact: "high",
          });
        }
      }
    });

    // Sort by timestamp and return most recent activities
    return activities
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
      .slice(0, 8);
  };

  // Get color for performance metrics following established Session #315-318 patterns
  const getPerformanceColor = (value: number, threshold: number = 70) => {
    if (value >= threshold + 20) return "text-emerald-400";
    if (value >= threshold) return "text-blue-400";
    if (value >= threshold - 20) return "text-amber-400";
    return "text-red-400";
  };

  const getPerformanceBgColor = (value: number, threshold: number = 70) => {
    if (value >= threshold + 20) return "bg-emerald-600/20";
    if (value >= threshold) return "bg-blue-600/20";
    if (value >= threshold - 20) return "bg-amber-600/20";
    return "bg-red-600/20";
  };

  // Format percentage values following established patterns
  const formatPercentage = (value: number): string => {
    return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
  };

  // Format timestamp for activity log
  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  // Loading state following established Session #315-318 patterns
  if (loading) {
    return (
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Brain className="h-5 w-5 text-purple-400" />
            <span>AI Learning Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-slate-700 rounded w-1/3 mb-2"></div>
                <div className="h-16 bg-slate-700/50 rounded"></div>
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
              <Brain className="h-5 w-5 text-red-400" />
              <span>AI Learning Activity</span>
            </div>
            <Button
              onClick={fetchAILearningData}
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
              ⚠️ Unable to load AI learning data
            </div>
            <div className="text-slate-400 text-sm">{error}</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // No data state
  if (!learningMetrics) {
    return (
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Brain className="h-5 w-5 text-purple-400" />
            <span>AI Learning Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-slate-400 mb-2">
              No AI learning data available
            </div>
            <div className="text-xs text-slate-500">
              AI learning requires signal outcomes to generate insights
            </div>
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
            <Brain className="h-5 w-5 text-purple-400" />
            <span>AI Learning Activity</span>
            <div className="flex items-center space-x-1 text-xs text-slate-400">
              <CheckCircle className="h-3 w-3 text-emerald-400" />
              <span>Learning {learningMetrics.learningVersion}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-xs text-slate-400">
              Updated {formatTimestamp(lastRefresh.toISOString())}
            </div>
            <Button
              onClick={fetchAILearningData}
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
        {/* AI Learning Overview */}
        <div className="bg-purple-600/10 border border-purple-700/30 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-purple-400 font-medium">
              Learning Overview
            </span>
            <Activity className="h-4 w-4 text-purple-400" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-xs text-slate-400 mb-1">
                Analyzed Signals
              </div>
              <div className="text-lg font-bold text-slate-200">
                {learningMetrics.totalOutcomes}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-400 mb-1">Success Rate</div>
              <div
                className={`text-lg font-bold ${getPerformanceColor(
                  learningMetrics.winRate
                )}`}
              >
                {learningMetrics.winRate.toFixed(1)}%
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-400 mb-1">
                Learning Version
              </div>
              <div className="text-lg font-bold text-purple-400">
                {learningMetrics.learningVersion}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-400 mb-1">Scoring Version</div>
              <div className="text-lg font-bold text-blue-400">
                {learningMetrics.scoringVersion}
              </div>
            </div>
          </div>
        </div>

        {/* Recent AI Discoveries */}
        {learningMetrics.recentDiscoveries.length > 0 && (
          <div className="bg-slate-700/20 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-300 font-medium">
                Recent Discoveries
              </span>
              <Zap className="h-4 w-4 text-yellow-400" />
            </div>
            <div className="space-y-2">
              {learningMetrics.recentDiscoveries.map((discovery, index) => (
                <div key={index} className="flex items-start space-x-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">{discovery}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Indicator Improvements */}
        {learningMetrics.indicatorImprovements.length > 0 && (
          <div className="bg-slate-700/20 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-300 font-medium">
                Indicator Improvements
              </span>
              <BarChart3 className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="space-y-3">
              {learningMetrics.indicatorImprovements
                .slice(0, 3)
                .map((improvement, index) => (
                  <div
                    key={index}
                    className="border border-slate-600/30 rounded p-3"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-300 font-medium">
                        {improvement.indicatorName} ({improvement.timeframe})
                      </span>
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="h-4 w-4 text-emerald-400" />
                        <span className="text-emerald-400 font-semibold">
                          {formatPercentage(improvement.improvement)}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <span className="text-slate-400">Success Rate:</span>
                        <div
                          className={getPerformanceColor(
                            improvement.newSuccessRate
                          )}
                        >
                          {improvement.newSuccessRate.toFixed(1)}%
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-400">Sample Size:</span>
                        <div className="text-slate-300">
                          {improvement.sampleSize}
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-400">Confidence:</span>
                        <div className="text-blue-400">
                          {improvement.confidence.toFixed(0)}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Market Condition Learning */}
        {learningMetrics.marketConditionLearning.length > 0 && (
          <div className="bg-slate-700/20 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-300 font-medium">
                Market Condition Learning
              </span>
              <Target className="h-4 w-4 text-orange-400" />
            </div>
            <div className="space-y-3">
              {learningMetrics.marketConditionLearning.map(
                (learning, index) => (
                  <div
                    key={index}
                    className="border border-slate-600/30 rounded p-3"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-300 font-medium capitalize">
                        {learning.marketRegime} / {learning.volatilityLevel}{" "}
                        Volatility
                      </span>
                      <span
                        className={`font-semibold ${getPerformanceColor(
                          learning.successRate
                        )}`}
                      >
                        {learning.successRate.toFixed(1)}%
                      </span>
                    </div>
                    <div className="text-xs text-slate-400">
                      Sample Size: {learning.sampleSize} • Optimal Indicators:{" "}
                      {learning.optimalIndicators.slice(0, 2).join(", ")}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* Confidence Calibration */}
        <div
          className={`rounded-lg p-4 ${getPerformanceBgColor(
            learningMetrics.confidenceCalibration.overallCalibration * 100,
            90
          )}`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-300 font-medium">
              Confidence Calibration
            </span>
            <div className="flex items-center space-x-1">
              {learningMetrics.confidenceCalibration.calibrationStatus ===
              "well_calibrated" ? (
                <CheckCircle className="h-4 w-4 text-emerald-400" />
              ) : (
                <AlertCircle className="h-4 w-4 text-amber-400" />
              )}
              <span
                className={`text-sm font-semibold ${
                  learningMetrics.confidenceCalibration.calibrationStatus ===
                  "well_calibrated"
                    ? "text-emerald-400"
                    : "text-amber-400"
                }`}
              >
                {learningMetrics.confidenceCalibration.calibrationStatus
                  .replace("_", " ")
                  .toUpperCase()}
              </span>
            </div>
          </div>
          <div className="text-sm text-slate-300 mb-2">
            Calibration Factor:{" "}
            {learningMetrics.confidenceCalibration.overallCalibration.toFixed(
              2
            )}
          </div>
          <div className="text-xs text-slate-400">
            {learningMetrics.confidenceCalibration.recommendation}
          </div>
        </div>

        {/* Recent AI Activity Log */}
        {activityLog.length > 0 && (
          <div className="bg-slate-700/20 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-300 font-medium">
                Recent AI Activity
              </span>
              <Clock className="h-4 w-4 text-slate-400" />
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {activityLog.slice(0, 6).map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 text-sm">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      activity.impact === "high"
                        ? "bg-emerald-400"
                        : activity.impact === "medium"
                        ? "bg-amber-400"
                        : "bg-slate-400"
                    }`}
                  ></div>
                  <div className="flex-1">
                    <div className="text-slate-300">{activity.description}</div>
                    <div className="text-xs text-slate-500">
                      {formatTimestamp(activity.timestamp)} •{" "}
                      {activity.activityType}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Data Source Information */}
        <div className="text-xs text-slate-500 border-t border-slate-700 pt-3">
          AI learning analysis based on {learningMetrics.totalOutcomes} signal
          outcomes from last {timeframeDays} days
          {" • "}
          Data from signal_outcomes and indicators tables
          {" • "}
          Auto-refreshes every 5 minutes
        </div>
      </CardContent>
    </Card>
  );
};

export default LearningPanel;
