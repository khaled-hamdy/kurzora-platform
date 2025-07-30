<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import {
  Activity,
  TrendingUp,
  TrendingDown,
  BarChart2,
  RefreshCw,
  Info,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// 🎯 PURPOSE: Show detailed indicator analysis across all 4 timeframes with visual breakdown
// 🔧 SESSION #315: Signal Explanation System - Component Foundation
// 🛡️ PRESERVATION: Uses real 28-indicator transparency system, queries actual indicators table
// 📝 HANDOVER: Displays 7 indicators (RSI, MACD, Volume, etc.) across 4 timeframes each

// Initialize Supabase client using established project patterns
const supabase = createClient(
  process.env.VITE_SUPABASE_URL || "https://jmbkssafogvzizypjaoi.supabase.co",
  process.env.VITE_SUPABASE_ANON_KEY || ""
);

// TypeScript interfaces following established project patterns
interface IndicatorContributionProps {
  signalId: string;
  signalType: "bullish" | "bearish";
}

=======
// 🎯 PURPOSE: Display detailed indicator contribution across all 4 timeframes with visual breakdown
// 🔧 SESSION #315: Signal Explanation System - Component Foundation
// 🛡️ PRESERVATION: Uses real indicators table data from 28-indicator transparency system
// 📝 HANDOVER: Shows RSI, MACD, Volume, Support contributions across 1H/4H/1D/1W timeframes

"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  AlertCircle,
  Activity,
  Volume2,
  Target,
} from "lucide-react";

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

interface IndicatorSummary {
  indicatorName: string;
  timeframes: {
    [key: string]: {
      value: number;
      score: number;
      weight: number;
    };
  };
  averageScore: number;
  contribution: number;
}

const IndicatorContribution: React.FC<IndicatorContributionProps> = ({
  signalId,
  signalType,
}) => {
  // State management following established patterns
  const [indicatorData, setIndicatorData] = useState<IndicatorData[]>([]);
  const [indicatorSummaries, setIndicatorSummaries] = useState<
    IndicatorSummary[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIndicator, setSelectedIndicator] = useState<string | null>(
    null
  );

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

// 🎯 Component props interface for indicator contribution display
interface IndicatorContributionProps {
  signalId: string;
  className?: string;
}

// 📈 Timeframe configuration with exact weights and display properties
const TIMEFRAME_CONFIG = {
  "1H": {
    weight: 0.4,
    name: "1H",
    fullName: "1 Hour",
    color: "text-blue-400",
    bgColor: "bg-blue-500/20",
    borderColor: "border-blue-500",
  },
  "4H": {
    weight: 0.3,
    name: "4H",
    fullName: "4 Hours",
    color: "text-green-400",
    bgColor: "bg-green-500/20",
    borderColor: "border-green-500",
  },
  "1D": {
    weight: 0.2,
    name: "1D",
    fullName: "1 Day",
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/20",
    borderColor: "border-yellow-500",
  },
  "1W": {
    weight: 0.1,
    name: "1W",
    fullName: "1 Week",
    color: "text-purple-400",
    bgColor: "bg-purple-500/20",
    borderColor: "border-purple-500",
  },
};

// 🔍 Indicator configuration matching V4 system with detailed properties
const INDICATOR_CONFIG = {
  RSI: {
    name: "RSI Momentum",
    shortName: "RSI",
    icon: Activity,
    color: "bg-blue-500",
    description: "Relative Strength Index - Momentum oscillator",
  },
  MACD: {
    name: "MACD Crossover",
    shortName: "MACD",
    icon: TrendingUp,
    color: "bg-green-500",
    description: "Moving Average Convergence Divergence",
  },
  Volume: {
    name: "Volume Analysis",
    shortName: "Volume",
    icon: Volume2,
    color: "bg-yellow-500",
    description: "Trading volume and smart money flow",
  },
  Stochastic: {
    name: "Stochastic Oscillator",
    shortName: "Stochastic",
    icon: BarChart3,
    color: "bg-purple-500",
    description: "Stochastic momentum indicator",
  },
  Williams_R: {
    name: "Williams %R",
    shortName: "Williams %R",
    icon: TrendingDown,
    color: "bg-red-500",
    description: "Williams Percent Range oscillator",
  },
  Bollinger: {
    name: "Bollinger Bands",
    shortName: "Bollinger",
    icon: Target,
    color: "bg-indigo-500",
    description: "Bollinger Bands volatility indicator",
  },
  Support_Resistance: {
    name: "Support/Resistance",
    shortName: "S/R",
    icon: AlertCircle,
    color: "bg-pink-500",
    description: "Key support and resistance levels",
  },
};

export const IndicatorContribution: React.FC<IndicatorContributionProps> = ({
  signalId,
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
=======
      const { data, error: dbError } = await supabase
>>>>>>> 5c4ed1d930c2e45c105be0ea799be757113595f7
        .from("indicators")
        .select("*")
        .eq("signal_id", signalId)
        .order("indicator_name", { ascending: true })
        .order("timeframe", { ascending: true });

<<<<<<< HEAD
      if (queryError) {
        throw new Error(`Database query failed: ${queryError.message}`);
      }

      if (!data || data.length === 0) {
        throw new Error("No indicator data found for this signal");
      }

      setIndicatorData(data);
      processIndicatorData(data);
    } catch (err) {
      console.error("Error fetching indicator data:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load indicator analysis"
      );
=======
      if (dbError) {
        console.error("Error loading indicator data:", dbError);
        setError("Failed to load indicator contribution data");
        return;
      }

      // Validate we have indicator data
      if (!data || data.length === 0) {
        setError("No indicator data found for this signal");
        return;
      }

      setIndicators(data);
    } catch (err) {
      console.error("Error in loadIndicatorData:", err);
      setError("Failed to load indicator contributions");
>>>>>>> 5c4ed1d930c2e45c105be0ea799be757113595f7
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  // Process indicator data into summary format for display
  const processIndicatorData = (data: IndicatorData[]) => {
    // Expected 7 indicators from V4 system
    const indicatorNames = [
      "RSI",
      "MACD",
      "Volume",
      "Stochastic",
      "Williams_R",
      "Bollinger",
      "Support_Resistance",
    ];
    const timeframes = ["1H", "4H", "1D", "1W"];

    const summaries: IndicatorSummary[] = [];

    indicatorNames.forEach((indicatorName) => {
      const indicatorRecords = data.filter(
        (item) => item.indicator_name === indicatorName
      );

      if (indicatorRecords.length > 0) {
        const timeframeData: {
          [key: string]: { value: number; score: number; weight: number };
        } = {};
        let totalScore = 0;

        timeframes.forEach((timeframe) => {
          const record = indicatorRecords.find(
            (item) => item.timeframe === timeframe
          );
          if (record) {
            timeframeData[timeframe] = {
              value: record.value,
              score: record.score,
              weight: record.weight,
            };
            totalScore += record.score;
          }
        });

        const averageScore = totalScore / Object.keys(timeframeData).length;

        summaries.push({
          indicatorName,
          timeframes: timeframeData,
          averageScore: Math.round(averageScore),
          contribution: Math.round(averageScore * 0.143), // Each indicator ~14.3% weight (1/7)
        });
      }
    });

    // Sort by contribution (highest first)
    summaries.sort((a, b) => b.contribution - a.contribution);
    setIndicatorSummaries(summaries);
  };

  // Get indicator icon based on type
  const getIndicatorIcon = (indicatorName: string) => {
    switch (indicatorName) {
      case "RSI":
      case "Stochastic":
      case "Williams_R":
        return <Activity className="h-4 w-4" />;
      case "MACD":
        return <TrendingUp className="h-4 w-4" />;
      case "Volume":
        return <BarChart2 className="h-4 w-4" />;
      case "Bollinger":
        return <TrendingDown className="h-4 w-4" />;
      case "Support_Resistance":
        return <Info className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  // Get color scheme based on score following established patterns
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

  // Format indicator names for display
  const formatIndicatorName = (name: string) => {
    switch (name) {
      case "Support_Resistance":
        return "Support/Resistance";
      case "Williams_R":
        return "Williams %R";
      default:
        return name;
    }
  };

  // Loading state following established patterns
  if (loading) {
    return (
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Activity className="h-5 w-5 text-blue-400" />
            <span>Indicator Contribution Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-slate-700 rounded w-1/3 mb-2"></div>
                <div className="grid grid-cols-4 gap-2">
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="h-16 bg-slate-700/50 rounded"></div>
                  ))}
                </div>
              </div>
            ))}
=======
  // 📈 Group indicators by name and calculate timeframe breakdown
  const groupIndicatorsByName = () => {
    const grouped: Record<string, Record<string, IndicatorData>> = {};

    // Group indicators by name, then by timeframe
    indicators.forEach((indicator) => {
      if (!grouped[indicator.indicator_name]) {
        grouped[indicator.indicator_name] = {};
      }
      grouped[indicator.indicator_name][indicator.timeframe] = indicator;
    });

    return grouped;
  };

  // 🎯 Calculate weighted contribution for an indicator across all timeframes
  const calculateIndicatorWeightedScore = (
    indicatorData: Record<string, IndicatorData>
  ) => {
    let totalWeightedScore = 0;
    let totalWeight = 0;

    Object.entries(indicatorData).forEach(([timeframe, data]) => {
      const weight =
        TIMEFRAME_CONFIG[timeframe as keyof typeof TIMEFRAME_CONFIG]?.weight ||
        0;
      totalWeightedScore += data.score * weight;
      totalWeight += weight;
    });

    return totalWeight > 0 ? Math.round(totalWeightedScore) : 0;
  };

  // 🔧 Get score color based on value
  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-400";
    if (score >= 50) return "text-yellow-400";
    return "text-red-400";
  };

  // 🔧 Get score background color for progress bars
  const getScoreBgColor = (score: number) => {
    if (score >= 70) return "bg-green-400";
    if (score >= 50) return "bg-yellow-400";
    return "bg-red-400";
  };

  // 🔧 Render loading state
  if (loading) {
    return (
      <Card className={`bg-slate-800 border-slate-700 ${className}`}>
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Indicator Contribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400"></div>
            <span className="ml-3 text-slate-400">
              Loading indicator contributions...
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
              <Activity className="h-5 w-5 text-red-400" />
              <span>Indicator Contribution Analysis</span>
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
            Indicator Contribution
>>>>>>> 5c4ed1d930c2e45c105be0ea799be757113595f7
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
<<<<<<< HEAD
            <div className="text-red-400 mb-2">
              ⚠️ Unable to load indicator analysis
            </div>
            <div className="text-slate-400 text-sm">{error}</div>
=======
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <p className="text-slate-400 mb-2">
              {error || "No indicator data available"}
            </p>
            <p className="text-sm text-slate-500">
              Unable to display indicator contributions
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
        <CardTitle className="text-white flex items-center space-x-2">
          <Activity className="h-5 w-5 text-blue-400" />
          <span>Indicator Contribution Analysis</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Indicator Summary Grid */}
        <div className="space-y-4">
          {indicatorSummaries.map((indicator) => (
            <div
              key={indicator.indicatorName}
              className="border border-slate-700 rounded-lg overflow-hidden"
            >
              {/* Indicator Header */}
              <div
                className={`p-3 cursor-pointer transition-all duration-200 ${
                  selectedIndicator === indicator.indicatorName
                    ? "bg-slate-700/50"
                    : "bg-slate-700/20 hover:bg-slate-700/30"
                }`}
                onClick={() =>
                  setSelectedIndicator(
                    selectedIndicator === indicator.indicatorName
                      ? null
                      : indicator.indicatorName
                  )
                }
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-blue-400">
                      {getIndicatorIcon(indicator.indicatorName)}
                    </div>
                    <span className="text-white font-medium">
                      {formatIndicatorName(indicator.indicatorName)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-slate-400 text-sm">
                      Contribution: +{indicator.contribution} pts
                    </span>
                    <div
                      className={`px-2 py-1 rounded text-sm font-semibold ${getBackgroundColor(
                        indicator.averageScore
                      )} ${getScoreColor(indicator.averageScore)}`}
                    >
                      {indicator.averageScore}/100
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeframe Breakdown */}
              <div className="grid grid-cols-4 gap-1 p-3">
                {["1H", "4H", "1D", "1W"].map((timeframe) => {
                  const tfData = indicator.timeframes[timeframe];
                  return (
                    <div key={timeframe} className="text-center">
                      <div className="text-xs text-slate-400 mb-1">
                        {timeframe}
                      </div>
                      {tfData ? (
                        <>
                          <div
                            className={`text-sm font-semibold ${getScoreColor(
                              tfData.score
                            )}`}
                          >
                            {tfData.score}
                          </div>
                          <div className="w-full bg-slate-600 rounded-full h-1 mt-1">
                            <div
                              className={`h-1 rounded-full transition-all duration-300 ${
                                tfData.score >= 90
                                  ? signalType === "bullish"
                                    ? "bg-emerald-400"
                                    : "bg-red-400"
                                  : tfData.score >= 80
                                  ? signalType === "bullish"
                                    ? "bg-blue-400"
                                    : "bg-orange-400"
                                  : tfData.score >= 70
                                  ? "bg-amber-400"
                                  : "bg-slate-400"
                              }`}
                              style={{ width: `${tfData.score}%` }}
                            ></div>
                          </div>
                          {selectedIndicator === indicator.indicatorName && (
                            <div className="text-xs text-slate-500 mt-1">
                              Val: {tfData.value.toFixed(2)}
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-slate-500 text-sm">N/A</div>
                      )}
                    </div>
                  );
                })}
              </div>
=======
  // 📊 Process indicator data
  const groupedIndicators = groupIndicatorsByName();

  return (
    <Card className={`bg-slate-800 border-slate-700 ${className}`}>
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Indicator Contribution Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 📊 Timeframe Legend */}
        <div className="flex flex-wrap gap-4 justify-center">
          {Object.entries(TIMEFRAME_CONFIG).map(([timeframe, config]) => (
            <div key={timeframe} className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${config.bgColor} ${config.borderColor} border`}
              />
              <span className={`text-sm font-medium ${config.color}`}>
                {config.fullName} ({Math.round(config.weight * 100)}%)
              </span>
>>>>>>> 5c4ed1d930c2e45c105be0ea799be757113595f7
            </div>
          ))}
        </div>

<<<<<<< HEAD
        {/* Summary Statistics */}
        <div className="bg-slate-700/30 rounded-lg p-4">
          <h3 className="text-slate-300 font-medium mb-3">Analysis Summary</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-400">Indicators Analyzed:</span>
              <span className="text-white ml-2 font-semibold">
                {indicatorSummaries.length}/7
              </span>
            </div>
            <div>
              <span className="text-slate-400">Data Points:</span>
              <span className="text-white ml-2 font-semibold">
                {indicatorData.length}
              </span>
            </div>
            <div>
              <span className="text-slate-400">Strongest Indicator:</span>
              <span className="text-emerald-400 ml-2 font-semibold">
                {indicatorSummaries.length > 0
                  ? formatIndicatorName(indicatorSummaries[0].indicatorName)
                  : "N/A"}
              </span>
            </div>
            <div>
              <span className="text-slate-400">Avg. Score:</span>
              <span className="text-white ml-2 font-semibold">
                {indicatorSummaries.length > 0
                  ? Math.round(
                      indicatorSummaries.reduce(
                        (sum, ind) => sum + ind.averageScore,
                        0
                      ) / indicatorSummaries.length
                    )
                  : 0}
                /100
              </span>
            </div>
          </div>
        </div>

        {/* Usage Tip */}
        <div className="text-xs text-slate-500 border-t border-slate-700 pt-3">
          💡 Click on any indicator to view detailed timeframe values
=======
        {/* 🎯 Indicator Breakdown Grid */}
        <div className="space-y-4">
          {Object.entries(groupedIndicators).map(
            ([indicatorName, timeframeData]) => {
              const config =
                INDICATOR_CONFIG[
                  indicatorName as keyof typeof INDICATOR_CONFIG
                ];
              const IconComponent = config?.icon || BarChart3;
              const weightedScore =
                calculateIndicatorWeightedScore(timeframeData);

              return (
                <div
                  key={indicatorName}
                  className="bg-slate-700 rounded-lg p-4"
                >
                  {/* Indicator Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          config?.color || "bg-slate-500"
                        }`}
                      >
                        <IconComponent className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {config?.name || indicatorName}
                        </h3>
                        <p className="text-sm text-slate-400">
                          {config?.description || `${indicatorName} analysis`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`text-2xl font-bold ${getScoreColor(
                          weightedScore
                        )}`}
                      >
                        {weightedScore}/100
                      </div>
                      <div className="text-xs text-slate-400">
                        Weighted Score
                      </div>
                    </div>
                  </div>

                  {/* Timeframe Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {Object.entries(TIMEFRAME_CONFIG).map(
                      ([timeframe, tfConfig]) => {
                        const indicatorData = timeframeData[timeframe];
                        const score = indicatorData?.score || 0;
                        const weight = tfConfig.weight;
                        const contribution = Math.round(score * weight);

                        return (
                          <div
                            key={timeframe}
                            className={`bg-slate-600 rounded-lg p-3 ${tfConfig.bgColor} ${tfConfig.borderColor} border`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span
                                className={`text-sm font-medium ${tfConfig.color}`}
                              >
                                {tfConfig.name}
                              </span>
                              <Badge
                                variant="outline"
                                className={`text-xs ${tfConfig.color} border-current`}
                              >
                                {Math.round(weight * 100)}%
                              </Badge>
                            </div>

                            <div
                              className={`text-xl font-bold ${getScoreColor(
                                score
                              )} mb-1`}
                            >
                              {score}/100
                            </div>

                            <div className="text-xs text-slate-400 mb-2">
                              Contributes: +{contribution}
                            </div>

                            {/* Progress Bar */}
                            <div className="w-full bg-slate-800 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${getScoreBgColor(
                                  score
                                )}`}
                                style={{ width: `${Math.min(score, 100)}%` }}
                              />
                            </div>

                            {/* Additional indicator value if available */}
                            {indicatorData?.value && (
                              <div className="text-xs text-slate-500 mt-1">
                                Value:{" "}
                                {typeof indicatorData.value === "number"
                                  ? indicatorData.value.toFixed(2)
                                  : indicatorData.value}
                              </div>
                            )}
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              );
            }
          )}
        </div>

        {/* 📈 Summary Statistics */}
        <div className="bg-slate-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-3">
            Contribution Summary
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">
                {
                  Object.values(groupedIndicators).filter(
                    (timeframeData) =>
                      calculateIndicatorWeightedScore(timeframeData) >= 70
                  ).length
                }
              </div>
              <div className="text-sm text-slate-400">Strong Contributors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400 mb-1">
                {
                  Object.values(groupedIndicators).filter((timeframeData) => {
                    const score =
                      calculateIndicatorWeightedScore(timeframeData);
                    return score >= 50 && score < 70;
                  }).length
                }
              </div>
              <div className="text-sm text-slate-400">
                Moderate Contributors
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400 mb-1">
                {
                  Object.values(groupedIndicators).filter(
                    (timeframeData) =>
                      calculateIndicatorWeightedScore(timeframeData) < 50
                  ).length
                }
              </div>
              <div className="text-sm text-slate-400">Weak Contributors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">
                {indicators.length}
              </div>
              <div className="text-sm text-slate-400">Total Data Points</div>
            </div>
          </div>
>>>>>>> 5c4ed1d930c2e45c105be0ea799be757113595f7
        </div>
      </CardContent>
    </Card>
  );
};
<<<<<<< HEAD

export default IndicatorContribution;
=======
>>>>>>> 5c4ed1d930c2e45c105be0ea799be757113595f7
