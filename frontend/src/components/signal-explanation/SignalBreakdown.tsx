<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { TrendingUp, TrendingDown, BarChart3, RefreshCw } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// 🎯 PURPOSE: Display complete signal score breakdown showing how 28 indicators combine into final score
// 🔧 SESSION #315: Signal Explanation System - Component Foundation
// 🛡️ PRESERVATION: Uses real 28-indicator transparency system, no synthetic logic
// 📝 HANDOVER: Queries indicators table for 7 indicators across 4 timeframes per signal

// Initialize Supabase client using established project patterns
const supabase = createClient(
  process.env.VITE_SUPABASE_URL || "https://jmbkssafogvzizypjaoi.supabase.co",
  process.env.VITE_SUPABASE_ANON_KEY || ""
);

// TypeScript interfaces following established project patterns
interface SignalBreakdownProps {
  signalId: string;
  finalScore: number;
  signalType: "bullish" | "bearish";
}

=======
// 🎯 PURPOSE: Display comprehensive signal score breakdown showing how 28 indicators combine into final score
// 🔧 SESSION #315: Signal Explanation System - Component Foundation
// 🛡️ PRESERVATION: Integrates with V4 system and 28-indicator transparency without modifying existing functionality
// 📝 HANDOVER: Uses real indicators table data, follows established patterns, production-ready

"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, BarChart3, AlertCircle } from "lucide-react";

// 📊 Database interface matching exact indicators table schema
>>>>>>> 5c4ed1d930c2e45c105be0ea799be757113595f7
interface IndicatorData {
  id: string;
  signal_id: string;
  indicator_name: string;
  timeframe: string;
<<<<<<< HEAD
  value: number;
  score: number;
  weight: number;
  created_at: string;
}

interface TimeframeContribution {
  timeframe: string;
  score: number;
  weight: number;
  contribution: number;
  indicators: IndicatorData[];
}

const SignalBreakdown: React.FC<SignalBreakdownProps> = ({
  signalId,
  finalScore,
  signalType,
}) => {
  // State management following established patterns
  const [indicatorData, setIndicatorData] = useState<IndicatorData[]>([]);
  const [timeframeBreakdown, setTimeframeBreakdown] = useState<
    TimeframeContribution[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch 28-indicator data from database on component mount
  useEffect(() => {
    fetchIndicatorData();
  }, [signalId]);

  // Database query function using established Supabase patterns
  const fetchIndicatorData = async () => {
=======
  score: number;
  weight: number;
  value: number;
  metadata: Record<string, any>;
  created_at: string;
}

// 🎯 Component props interface for signal breakdown display
interface SignalBreakdownProps {
  signalId: string;
  finalScore: number;
  signalType: "bullish" | "bearish";
  className?: string;
}

// 📈 Timeframe configuration with exact weights from V4 system
const TIMEFRAME_CONFIG = {
  "1H": { weight: 0.4, name: "1 Hour", color: "text-blue-400" },
  "4H": { weight: 0.3, name: "4 Hours", color: "text-green-400" },
  "1D": { weight: 0.2, name: "1 Day", color: "text-yellow-400" },
  "1W": { weight: 0.1, name: "1 Week", color: "text-purple-400" },
};

// 🔍 Indicator configuration matching V4 system indicators
const INDICATOR_CONFIG = {
  RSI: { name: "RSI Momentum", icon: TrendingUp, color: "bg-blue-500" },
  MACD: { name: "MACD Crossover", icon: BarChart3, color: "bg-green-500" },
  Volume: { name: "Volume Analysis", icon: BarChart3, color: "bg-yellow-500" },
  Stochastic: {
    name: "Stochastic Oscillator",
    icon: TrendingUp,
    color: "bg-purple-500",
  },
  Williams_R: { name: "Williams %R", icon: TrendingDown, color: "bg-red-500" },
  Bollinger: {
    name: "Bollinger Bands",
    icon: BarChart3,
    color: "bg-indigo-500",
  },
  Support_Resistance: {
    name: "Support/Resistance",
    icon: AlertCircle,
    color: "bg-pink-500",
  },
};

export const SignalBreakdown: React.FC<SignalBreakdownProps> = ({
  signalId,
  finalScore,
  signalType,
  className = "",
}) => {
  // 🔧 Component state management
  const [indicators, setIndicators] = useState<IndicatorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 📊 Load indicator data from database on component mount
  useEffect(() => {
    loadIndicatorData();
  }, [signalId]);

  // 🔍 Fetch 28 indicator records for this signal from indicators table
  const loadIndicatorData = async () => {
>>>>>>> 5c4ed1d930c2e45c105be0ea799be757113595f7
    try {
      setLoading(true);
      setError(null);

      // Query indicators table for all 28 records (7 indicators × 4 timeframes)
<<<<<<< HEAD
      const { data, error: queryError } = await supabase
        .from("indicators")
        .select("*")
        .eq("signal_id", signalId)
        .order("timeframe", { ascending: true })
        .order("indicator_name", { ascending: true });

      if (queryError) {
        throw new Error(`Database query failed: ${queryError.message}`);
      }

      if (!data || data.length === 0) {
        throw new Error("No indicator data found for this signal");
      }

      setIndicatorData(data);
      calculateTimeframeBreakdown(data);
    } catch (err) {
      console.error("Error fetching indicator data:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load signal breakdown"
      );
=======
      const { data, error: dbError } = await supabase
        .from("indicators")
        .select("*")
        .eq("signal_id", signalId)
        .order("indicator_name", { ascending: true })
        .order("timeframe", { ascending: true });

      if (dbError) {
        console.error("Error loading indicator data:", dbError);
        setError("Failed to load signal breakdown data");
        return;
      }

      // Validate we have the expected 28 indicator records
      if (!data || data.length === 0) {
        setError("No indicator data found for this signal");
        return;
      }

      setIndicators(data);
    } catch (err) {
      console.error("Error in loadIndicatorData:", err);
      setError("Failed to load signal breakdown");
>>>>>>> 5c4ed1d930c2e45c105be0ea799be757113595f7
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  // Calculate timeframe contribution breakdown using real weights from V4 system
  const calculateTimeframeBreakdown = (data: IndicatorData[]) => {
    // Timeframe weights from established V4 system (Sessions #300-325)
    const timeframeWeights = {
      "1H": 0.4, // 40% weight - most recent trends
      "4H": 0.3, // 30% weight - intermediate trends
      "1D": 0.2, // 20% weight - daily patterns
      "1W": 0.1, // 10% weight - long-term context
    };

    const timeframes = ["1H", "4H", "1D", "1W"];
    const breakdown: TimeframeContribution[] = [];

    timeframes.forEach((timeframe) => {
      const timeframeIndicators = data.filter(
        (indicator) => indicator.timeframe === timeframe
      );

      if (timeframeIndicators.length > 0) {
        // Calculate average score for this timeframe
        const averageScore =
          timeframeIndicators.reduce(
            (sum, indicator) => sum + indicator.score,
            0
          ) / timeframeIndicators.length;
        const weight =
          timeframeWeights[timeframe as keyof typeof timeframeWeights];
        const contribution = averageScore * weight;

        breakdown.push({
          timeframe,
          score: Math.round(averageScore),
          weight,
          contribution: Math.round(contribution),
          indicators: timeframeIndicators,
        });
      }
    });

    setTimeframeBreakdown(breakdown);
  };

  // Get color scheme based on signal type following established patterns
  const getScoreColor = (score: number) => {
    if (score >= 90)
      return signalType === "bullish" ? "text-emerald-400" : "text-red-400";
    if (score >= 80)
      return signalType === "bullish" ? "text-blue-400" : "text-orange-400";
    if (score >= 70) return "text-amber-400";
    return "text-slate-400";
  };

  const getBackgroundColor = (score: number) => {
    if (score >= 90)
      return signalType === "bullish" ? "bg-emerald-600/20" : "bg-red-600/20";
    if (score >= 80)
      return signalType === "bullish" ? "bg-blue-600/20" : "bg-orange-600/20";
    if (score >= 70) return "bg-amber-600/20";
    return "bg-slate-600/20";
  };

  // Loading state following established patterns
  if (loading) {
    return (
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-blue-400" />
            <span>Signal Score Breakdown</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-slate-700 rounded w-1/4 mb-2"></div>
                <div className="h-12 bg-slate-700/50 rounded"></div>
              </div>
            ))}
=======
  // 📈 Calculate weighted score contribution for each timeframe
  const calculateTimeframeContribution = () => {
    const timeframeScores: Record<string, number> = {};
    const timeframeCounts: Record<string, number> = {};

    // Sum scores by timeframe from all indicators
    indicators.forEach((indicator) => {
      if (!timeframeScores[indicator.timeframe]) {
        timeframeScores[indicator.timeframe] = 0;
        timeframeCounts[indicator.timeframe] = 0;
      }
      timeframeScores[indicator.timeframe] += indicator.score;
      timeframeCounts[indicator.timeframe] += 1;
    });

    // Calculate average score per timeframe and apply weights
    const contributions = Object.entries(timeframeScores).map(
      ([timeframe, totalScore]) => {
        const avgScore = totalScore / (timeframeCounts[timeframe] || 1);
        const weight =
          TIMEFRAME_CONFIG[timeframe as keyof typeof TIMEFRAME_CONFIG]
            ?.weight || 0;
        const weightedContribution = avgScore * weight;

        return {
          timeframe,
          avgScore: Math.round(avgScore),
          weight,
          weightedContribution: Math.round(weightedContribution),
          config: TIMEFRAME_CONFIG[timeframe as keyof typeof TIMEFRAME_CONFIG],
        };
      }
    );

    return contributions.sort((a, b) => b.weight - a.weight); // Sort by weight descending
  };

  // 🎯 Calculate indicator strength distribution
  const calculateIndicatorSummary = () => {
    const indicatorSummary: Record<
      string,
      { total: number; count: number; avg: number }
    > = {};

    // Group scores by indicator name
    indicators.forEach((indicator) => {
      if (!indicatorSummary[indicator.indicator_name]) {
        indicatorSummary[indicator.indicator_name] = {
          total: 0,
          count: 0,
          avg: 0,
        };
      }
      indicatorSummary[indicator.indicator_name].total += indicator.score;
      indicatorSummary[indicator.indicator_name].count += 1;
    });

    // Calculate average score per indicator
    Object.keys(indicatorSummary).forEach((key) => {
      const summary = indicatorSummary[key];
      summary.avg = Math.round(summary.total / summary.count);
    });

    return indicatorSummary;
  };

  // 🔧 Render loading state
  if (loading) {
    return (
      <Card className={`bg-slate-800 border-slate-700 ${className}`}>
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Signal Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400"></div>
            <span className="ml-3 text-slate-400">
              Loading signal breakdown...
            </span>
>>>>>>> 5c4ed1d930c2e45c105be0ea799be757113595f7
          </div>
        </CardContent>
      </Card>
    );
  }

<<<<<<< HEAD
  // Error state following established patterns
  if (error) {
    return (
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-red-400" />
              <span>Signal Score Breakdown</span>
            </div>
            <Button
              onClick={fetchIndicatorData}
              size="sm"
              variant="ghost"
              className="text-blue-400 hover:text-blue-300"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
=======
  // ⚠️ Render error state
  if (error || indicators.length === 0) {
    return (
      <Card className={`bg-slate-800 border-slate-700 ${className}`}>
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-400" />
            Signal Breakdown
>>>>>>> 5c4ed1d930c2e45c105be0ea799be757113595f7
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
<<<<<<< HEAD
            <div className="text-red-400 mb-2">
              ⚠️ Unable to load signal breakdown
            </div>
            <div className="text-slate-400 text-sm">{error}</div>
=======
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <p className="text-slate-400 mb-2">
              {error || "No signal data available"}
            </p>
            <p className="text-sm text-slate-500">
              Unable to display signal breakdown
            </p>
>>>>>>> 5c4ed1d930c2e45c105be0ea799be757113595f7
          </div>
        </CardContent>
      </Card>
    );
  }

<<<<<<< HEAD
  return (
    <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:bg-slate-800/70 transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-blue-400" />
            <span>Signal Score Breakdown</span>
          </div>
          <div className="flex items-center space-x-2">
            <div
              className={`px-3 py-1 rounded-full text-sm font-semibold ${getBackgroundColor(
                finalScore
              )} ${getScoreColor(finalScore)}`}
            >
              {finalScore}/100
            </div>
            {signalType === "bullish" ? (
              <TrendingUp className="h-5 w-5 text-emerald-400" />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-400" />
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Final Score Summary */}
        <div className="bg-slate-700/30 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-300 font-medium">
              Final Signal Score
            </span>
            <span className={`text-2xl font-bold ${getScoreColor(finalScore)}`}>
              {finalScore}
            </span>
          </div>
          <div className="w-full bg-slate-600 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                finalScore >= 90
                  ? signalType === "bullish"
                    ? "bg-emerald-500"
                    : "bg-red-500"
                  : finalScore >= 80
                  ? signalType === "bullish"
                    ? "bg-blue-500"
                    : "bg-orange-500"
                  : finalScore >= 70
                  ? "bg-amber-500"
                  : "bg-slate-500"
              }`}
              style={{ width: `${finalScore}%` }}
            ></div>
          </div>
        </div>

        {/* Timeframe Contribution Breakdown */}
        <div className="space-y-3">
          <h3 className="text-slate-300 font-medium mb-3">
            Timeframe Contribution Analysis
          </h3>
          {timeframeBreakdown.map((tf) => (
            <div key={tf.timeframe} className="bg-slate-700/20 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <span className="text-white font-medium text-sm">
                    {tf.timeframe}
                  </span>
                  <span className="text-slate-400 text-xs">
                    Weight: {Math.round(tf.weight * 100)}%
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-sm font-semibold ${getScoreColor(
                      tf.score
                    )}`}
                  >
                    {tf.score}/100
                  </span>
                  <span className="text-slate-400 text-xs">
                    (+{tf.contribution} pts)
                  </span>
                </div>
              </div>
              <div className="w-full bg-slate-600 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    tf.score >= 90
                      ? signalType === "bullish"
                        ? "bg-emerald-400"
                        : "bg-red-400"
                      : tf.score >= 80
                      ? signalType === "bullish"
                        ? "bg-blue-400"
                        : "bg-orange-400"
                      : tf.score >= 70
                      ? "bg-amber-400"
                      : "bg-slate-400"
                  }`}
                  style={{ width: `${tf.score}%` }}
                ></div>
              </div>
              <div className="text-xs text-slate-500 mt-1">
                {tf.indicators.length} indicators analyzed
              </div>
            </div>
          ))}
        </div>

        {/* Confidence Level Indicator */}
        <div className="bg-slate-700/30 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-slate-300 text-sm">Signal Confidence</span>
            <span
              className={`text-sm font-semibold ${
                finalScore >= 90
                  ? "text-emerald-400"
                  : finalScore >= 80
                  ? "text-blue-400"
                  : finalScore >= 70
                  ? "text-amber-400"
                  : "text-slate-400"
              }`}
            >
              {finalScore >= 90
                ? "Very High"
                : finalScore >= 80
                ? "High"
                : finalScore >= 70
                ? "Moderate"
                : "Low"}
            </span>
          </div>
        </div>

        {/* Data Source Information */}
        <div className="text-xs text-slate-500 border-t border-slate-700 pt-3">
          Analysis based on {indicatorData.length} indicator measurements across
          4 timeframes
=======
  // 📊 Calculate breakdown data
  const timeframeContributions = calculateTimeframeContribution();
  const indicatorSummary = calculateIndicatorSummary();

  return (
    <Card className={`bg-slate-800 border-slate-700 ${className}`}>
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Signal Breakdown
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={`${
                signalType === "bullish"
                  ? "border-green-400 text-green-400"
                  : "border-red-400 text-red-400"
              }`}
            >
              {signalType.toUpperCase()}
            </Badge>
            <div className="text-2xl font-bold text-white">
              {finalScore}/100
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 📈 Timeframe Contribution Section */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Timeframe Contribution
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {timeframeContributions.map(
              ({
                timeframe,
                avgScore,
                weight,
                weightedContribution,
                config,
              }) => (
                <div key={timeframe} className="bg-slate-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-sm font-medium ${
                        config?.color || "text-slate-400"
                      }`}
                    >
                      {config?.name || timeframe}
                    </span>
                    <span className="text-xs text-slate-400">
                      {Math.round(weight * 100)}% weight
                    </span>
                  </div>
                  <div className="text-xl font-bold text-white mb-1">
                    {avgScore}/100
                  </div>
                  <div className="text-sm text-slate-400">
                    Contributes: +{weightedContribution}
                  </div>
                  {/* Visual progress bar */}
                  <div className="w-full bg-slate-600 rounded-full h-2 mt-2">
                    <div
                      className={`h-2 rounded-full ${
                        avgScore >= 70
                          ? "bg-green-400"
                          : avgScore >= 50
                          ? "bg-yellow-400"
                          : "bg-red-400"
                      }`}
                      style={{ width: `${Math.min(avgScore, 100)}%` }}
                    />
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* 🎯 Indicator Summary Section */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Indicator Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.entries(indicatorSummary).map(
              ([indicatorName, summary]) => {
                const config =
                  INDICATOR_CONFIG[
                    indicatorName as keyof typeof INDICATOR_CONFIG
                  ];
                const IconComponent = config?.icon || BarChart3;

                return (
                  <div
                    key={indicatorName}
                    className="bg-slate-700 rounded-lg p-3 flex items-center gap-3"
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        config?.color || "bg-slate-500"
                      }`}
                    >
                      <IconComponent className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-white">
                        {config?.name || indicatorName}
                      </div>
                      <div className="text-lg font-bold text-white">
                        {summary.avg}/100
                      </div>
                    </div>
                    <div
                      className={`text-sm font-medium ${
                        summary.avg >= 70
                          ? "text-green-400"
                          : summary.avg >= 50
                          ? "text-yellow-400"
                          : "text-red-400"
                      }`}
                    >
                      {summary.avg >= 70
                        ? "Strong"
                        : summary.avg >= 50
                        ? "Moderate"
                        : "Weak"}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>

        {/* 📊 Signal Quality Assessment */}
        <div className="bg-slate-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-3">
            Signal Quality Assessment
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-400 mb-1">
                {indicators.filter((i) => i.score >= 70).length}
              </div>
              <div className="text-sm text-slate-400">Strong Indicators</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-400 mb-1">
                {indicators.filter((i) => i.score >= 50 && i.score < 70).length}
              </div>
              <div className="text-sm text-slate-400">Moderate Indicators</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-400 mb-1">
                {indicators.filter((i) => i.score < 50).length}
              </div>
              <div className="text-sm text-slate-400">Weak Indicators</div>
            </div>
          </div>
>>>>>>> 5c4ed1d930c2e45c105be0ea799be757113595f7
        </div>
      </CardContent>
    </Card>
  );
};
<<<<<<< HEAD

export default SignalBreakdown;
=======
>>>>>>> 5c4ed1d930c2e45c105be0ea799be757113595f7
