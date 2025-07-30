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
interface IndicatorData {
  id: string;
  signal_id: string;
  indicator_name: string;
  timeframe: string;
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
    try {
      setLoading(true);
      setError(null);

      // Query indicators table for all 28 records (7 indicators × 4 timeframes)
      const { data, error: dbError } = await supabase
        .from("indicators")
        .select("*")
        .eq("signal_id", signalId)
        .order("indicator_name", { ascending: true })
        .order("timeframe", { ascending: true });

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
    } finally {
      setLoading(false);
    }
  };

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
          </div>
        </CardContent>
      </Card>
    );
  }

  // ⚠️ Render error state
  if (error || indicators.length === 0) {
    return (
      <Card className={`bg-slate-800 border-slate-700 ${className}`}>
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-400" />
            Indicator Contribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <p className="text-slate-400 mb-2">
              {error || "No indicator data available"}
            </p>
            <p className="text-sm text-slate-500">
              Unable to display indicator contributions
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

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
            </div>
          ))}
        </div>

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
        </div>
      </CardContent>
    </Card>
  );
};
