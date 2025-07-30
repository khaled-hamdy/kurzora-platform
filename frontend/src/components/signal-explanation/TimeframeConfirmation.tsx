import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  RefreshCw,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// 🎯 PURPOSE: Visual confirmation system showing timeframe strength with green/yellow/red indicators
// 🔧 SESSION #316: Multi-Timeframe Confirmation Display - Quick visual assessment component
// 🛡️ PRESERVATION: Uses Session #315 established patterns, queries 28-indicator transparency system
// 📝 HANDOVER: Green (≥80%), Yellow (60-79%), Red (<60%) confirmation levels for 1H, 4H, 1D, 1W
// ✅ PRODUCTION: Real database queries only, no synthetic data, follows exact established patterns

// Initialize Supabase client using established project patterns
const supabase = createClient(
  process.env.VITE_SUPABASE_URL || "https://jmbkssafogvzizypjaoi.supabase.co",
  process.env.VITE_SUPABASE_ANON_KEY || ""
);

// TypeScript interfaces following established Session #315 patterns
interface TimeframeConfirmationProps {
  signalId: string;
  finalScore: number;
  signalType: "bullish" | "bearish";
}

interface IndicatorData {
  id: string;
  signal_id: string;
  indicator_name: string;
  timeframe: string;
  raw_value: number | null;
  score_contribution: number | null;
  created_at: string;
}

interface TimeframeConfirmation {
  timeframe: string;
  score: number;
  weight: number;
  confirmation: "strong" | "moderate" | "weak";
  indicatorCount: number;
  strengthDescription: string;
}

const TimeframeConfirmation: React.FC<TimeframeConfirmationProps> = ({
  signalId,
  finalScore,
  signalType,
}) => {
  // State management following established Session #315 patterns
  const [indicatorData, setIndicatorData] = useState<IndicatorData[]>([]);
  const [timeframeConfirmations, setTimeframeConfirmations] = useState<
    TimeframeConfirmation[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Established timeframe weights from confirmed project documentation (Session #151, Financial Data docs)
  const timeframeWeights = {
    "1H": 0.4, // 40% - Most recent trends
    "4H": 0.3, // 30% - Intermediate trends
    "1D": 0.2, // 20% - Daily patterns
    "1W": 0.1, // 10% - Long-term context
  };

  // Fetch 28-indicator data from database on component mount
  useEffect(() => {
    fetchIndicatorData();
  }, [signalId]);

  // Database query function using established Supabase patterns from Session #315
  const fetchIndicatorData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Query indicators table for all 28 records (7 indicators × 4 timeframes)
      // Using exact database schema confirmed in analysis
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
      processTimeframeConfirmations(data);
    } catch (err) {
      console.error("Error fetching indicator data:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load timeframe confirmations"
      );
    } finally {
      setLoading(false);
    }
  };

  // Process timeframe data into confirmation levels using real database data
  const processTimeframeConfirmations = (data: IndicatorData[]) => {
    const timeframes = ["1H", "4H", "1D", "1W"];
    const confirmations: TimeframeConfirmation[] = [];

    timeframes.forEach((timeframe) => {
      const timeframeData = data.filter((d) => d.timeframe === timeframe);

      if (timeframeData.length > 0) {
        // Calculate average score for this timeframe using real score_contribution values
        const validScores = timeframeData
          .map((d) => d.score_contribution)
          .filter((score): score is number => score !== null);

        const averageScore =
          validScores.length > 0
            ? validScores.reduce((sum, score) => sum + score, 0) /
              validScores.length
            : 0;

        // Determine confirmation level based on established thresholds
        let confirmation: "strong" | "moderate" | "weak";
        let strengthDescription: string;

        if (averageScore >= 80) {
          confirmation = "strong";
          strengthDescription = `Strong ${signalType} confirmation`;
        } else if (averageScore >= 60) {
          confirmation = "moderate";
          strengthDescription = `Moderate ${signalType} signals`;
        } else {
          confirmation = "weak";
          strengthDescription = "Mixed or weak signals";
        }

        confirmations.push({
          timeframe,
          score: Math.round(averageScore),
          weight: timeframeWeights[timeframe as keyof typeof timeframeWeights],
          confirmation,
          indicatorCount: timeframeData.length,
          strengthDescription,
        });
      }
    });

    setTimeframeConfirmations(confirmations);
  };

  // Get confirmation color and icon based on confirmation level (green/yellow/red system)
  const getConfirmationDisplay = (
    confirmation: "strong" | "moderate" | "weak"
  ) => {
    switch (confirmation) {
      case "strong":
        return {
          color: "text-emerald-400",
          bgColor: "bg-emerald-900/20",
          borderColor: "border-emerald-700/50",
          icon: <CheckCircle className="h-5 w-5" />,
        };
      case "moderate":
        return {
          color: "text-amber-400",
          bgColor: "bg-amber-900/20",
          borderColor: "border-amber-700/50",
          icon: <AlertTriangle className="h-5 w-5" />,
        };
      case "weak":
        return {
          color: "text-slate-400",
          bgColor: "bg-slate-700/20",
          borderColor: "border-slate-600/50",
          icon: <XCircle className="h-5 w-5" />,
        };
      default:
        return {
          color: "text-slate-400",
          bgColor: "bg-slate-700/20",
          borderColor: "border-slate-600/50",
          icon: <XCircle className="h-5 w-5" />,
        };
    }
  };

  // Get timeframe description for user understanding
  const getTimeframeDescription = (timeframe: string) => {
    switch (timeframe) {
      case "1H":
        return "Short-term momentum";
      case "4H":
        return "Intraday trend strength";
      case "1D":
        return "Daily pattern analysis";
      case "1W":
        return "Long-term trend context";
      default:
        return "Technical analysis";
    }
  };

  // Loading state following established Session #315 patterns
  if (loading) {
    return (
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Clock className="h-5 w-5 text-blue-400" />
            <span>Timeframe Confirmation</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center justify-between mb-2">
                  <div className="h-4 bg-slate-700 rounded w-8"></div>
                  <div className="h-4 bg-slate-700 rounded w-16"></div>
                </div>
                <div className="h-16 bg-slate-700/50 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state following established Session #315 patterns
  if (error) {
    return (
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-red-400" />
              <span>Timeframe Confirmation</span>
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
              ⚠️ Unable to load timeframe confirmations
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
            <Clock className="h-5 w-5 text-blue-400" />
            <span>Timeframe Confirmation</span>
          </div>
          <div className="flex items-center space-x-2">
            {signalType === "bullish" ? (
              <TrendingUp className="h-5 w-5 text-emerald-400" />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-400" />
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Confirmation Summary */}
        <div className="bg-slate-700/30 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-300 font-medium">
              Overall Signal Strength
            </span>
            <span className={`text-lg font-bold ${
              finalScore >= 90
                ? signalType === "bullish"
                  ? "text-emerald-400"
                  : "text-red-400"
                : finalScore >= 80
                ? signalType === "bullish"
                  ? "text-blue-400"
                  : "text-orange-400"
                : finalScore >= 70
                ? "text-amber-400"
                : "text-slate-400"
            }`}>
              {finalScore}/100
            </span>
          </div>
          <div className="text-xs text-slate-400">
            Based on weighted multi-timeframe analysis
          </div>
        </div>

        {/* Individual Timeframe Confirmations */}
        <div className="space-y-3">
          {timeframeConfirmations.map((tf) => {
            const display = getConfirmationDisplay(tf.confirmation);
            return (
              <div
                key={tf.timeframe}
                className={`border rounded-lg p-4 transition-all duration-200 ${display.bgColor} ${display.borderColor}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className={display.color}>{display.icon}</div>
                    <div>
                      <span className="text-white font-medium text-sm">
                        {tf.timeframe}
                      </span>
                      <div className="text-xs text-slate-400">
                        {getTimeframeDescription(tf.timeframe)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${display.color}`}>
                      {tf.score}
                    </div>
                    <div className="text-xs text-slate-400">
                      {Math.round(tf.weight * 100)}% weight
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 text-sm">
                    {tf.strengthDescription}
                  </span>
                  <span className="text-slate-400 text-xs">
                    {tf.indicatorCount} indicators
                  </span>
                </div>
                {/* Visual progress bar for confirmation strength */}
                <div className="w-full bg-slate-600 rounded-full h-2 mt-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      tf.confirmation === "strong"
                        ? "bg-emerald-400"
                        : tf.confirmation === "moderate"
                        ? "bg-amber-400"
                        : "bg-slate-400"
                    }`}
                    style={{ width: `${Math.min(Math.abs(tf.score), 100)}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Confirmation Legend */}
        <div className="bg-slate-700/20 rounded-lg p-3">
          <div className="text-slate-300 text-sm font-medium mb-2">
            Confirmation Levels
          </div>
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-3 w-3 text-emerald-400" />
              <span className="text-slate-400">Strong (≥80%)</span>
            </div>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-3 w-3 text-amber-400" />
              <span className="text-slate-400">Moderate (60-79%)</span>
            </div>
            <div className="flex items-center space-x-2">
              <XCircle className="h-3 w-3 text-slate-400" />
              <span className="text-slate-400">Weak (<60%)</span>
            </div>
          </div>
        </div>

        {/* Data Source Information */}
        <div className="text-xs text-slate-500 border-t border-slate-700 pt-3">
          Confirmation analysis based on {indicatorData.length} indicator measurements
          across 4 timeframes
        </div>
      </CardContent>
    </Card>
  );
};

export default TimeframeConfirmation;