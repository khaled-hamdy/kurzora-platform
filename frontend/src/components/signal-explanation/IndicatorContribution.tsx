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

interface IndicatorData {
  id: string;
  signal_id: string;
  indicator_name: string;
  timeframe: string;
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
    try {
      setLoading(true);
      setError(null);

      // Query indicators table for all 28 records (7 indicators × 4 timeframes)
      const { data, error: queryError } = await supabase
        .from("indicators")
        .select("*")
        .eq("signal_id", signalId)
        .order("indicator_name", { ascending: true })
        .order("timeframe", { ascending: true });

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
    } finally {
      setLoading(false);
    }
  };

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
          </div>
        </CardContent>
      </Card>
    );
  }

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
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-red-400 mb-2">
              ⚠️ Unable to load indicator analysis
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
            </div>
          ))}
        </div>

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
        </div>
      </CardContent>
    </Card>
  );
};

export default IndicatorContribution;
