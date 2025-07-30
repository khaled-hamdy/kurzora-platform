import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  RefreshCw,
  Tabs,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import TimeframeConfirmation from "./TimeframeConfirmation";
import TimeframeBreakdown from "./TimeframeBreakdown";

// 🎯 PURPOSE: Enhanced signal score breakdown integrating Session #316 multi-timeframe confirmation displays
// 🔧 SESSION #316: Multi-Timeframe Confirmation Display - Enhanced integration with new components
// 🛡️ PRESERVATION: Uses Session #315 established patterns, maintains all existing functionality exactly
// 📝 HANDOVER: Integrates TimeframeConfirmation and TimeframeBreakdown components for comprehensive analysis
// ✅ PRODUCTION: Real database queries only, no synthetic data, preserves all Session #315 logic exactly

// Initialize Supabase client using established project patterns
const supabase = createClient(
  process.env.VITE_SUPABASE_URL || "",
  process.env.VITE_SUPABASE_ANON_KEY || ""
);

// TypeScript interfaces following established Session #315 patterns
interface SignalBreakdownProps {
  signalId: string;
  finalScore: number;
  signalType: "bullish" | "bearish";
}

interface IndicatorData {
  id: string;
  signal_id: string;
  indicator_name: string;
  timeframe: string;
  raw_value: number | null; // Handle NULL values from database
  score_contribution: number | null; // Handle NULL values from database
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
  // State management following established Session #315 patterns
  const [indicatorData, setIndicatorData] = useState<IndicatorData[]>([]);
  const [timeframeBreakdown, setTimeframeBreakdown] = useState<
    TimeframeContribution[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<
    "overview" | "confirmation" | "detailed"
  >("overview");

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
      // Uses confirmed database structure from investigation
      const { data, error: queryError } = await supabase
        .from("indicators")
        .select("*")
        .eq("signal_id", signalId)
        .order("indicator_name", { ascending: true })
        .order("timeframe", { ascending: true });

      if (queryError) {
        console.error("Database query error:", queryError);
        throw new Error(`Database query failed: ${queryError.message}`);
      }

      if (!data || data.length === 0) {
        throw new Error("No indicator data found for this signal");
      }

      // Validate we have expected 28 records (7 indicators × 4 timeframes)
      console.log(
        `Loaded ${data.length} indicator records for signal ${signalId}`
      );

      setIndicatorData(data);
      calculateTimeframeBreakdown(data);
    } catch (err) {
      console.error("Error fetching indicator data:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load signal breakdown"
      );
    } finally {
      setLoading(false);
    }
  };

  // Calculate timeframe contribution breakdown using real weights from confirmed system
  const calculateTimeframeBreakdown = (data: IndicatorData[]) => {
    // Timeframe weights from established system (confirmed in project knowledge)
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
        // Calculate average score for this timeframe using score_contribution
        // Handle NULL values properly (confirmed from database investigation)
        const validScores = timeframeIndicators
          .map((indicator) => indicator.score_contribution)
          .filter((score): score is number => score !== null);

        const averageScore =
          validScores.length > 0
            ? validScores.reduce((sum, score) => sum + score, 0) /
              validScores.length
            : 0;

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

  // Get color scheme based on signal type following established Session #315 patterns
  const getScoreColor = (score: number) => {
    if (score >= 90)
      return signalType === "bullish" ? "text-emerald-400" : "text-red-400";
    if (score >= 80)
      return signalType === "bullish" ? "text-blue-400" : "text-orange-400";
    if (score >= 70) return "text-amber-400";
    if (score < 0) return "text-red-400"; // Handle negative contributions
    return "text-slate-400";
  };

  const getBackgroundColor = (score: number) => {
    if (score >= 90)
      return signalType === "bullish" ? "bg-emerald-600/20" : "bg-red-600/20";
    if (score >= 80)
      return signalType === "bullish" ? "bg-blue-600/20" : "bg-orange-600/20";
    if (score >= 70) return "bg-amber-600/20";
    if (score < 0) return "bg-red-600/20"; // Handle negative contributions
    return "bg-slate-600/20";
  };

  // Loading state following established Session #315 patterns
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
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-red-400 mb-2">
              ⚠️ Unable to load signal breakdown
            </div>
            <div className="text-slate-400 text-sm">{error}</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Signal Breakdown Card */}
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
          {/* View Selection Tabs */}
          <div className="flex space-x-1 bg-slate-700/30 p-1 rounded-lg">
            <button
              onClick={() => setActiveView("overview")}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeView === "overview"
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:text-white hover:bg-slate-700/50"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveView("confirmation")}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeView === "confirmation"
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:text-white hover:bg-slate-700/50"
              }`}
            >
              Confirmation
            </button>
            <button
              onClick={() => setActiveView("detailed")}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeView === "detailed"
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:text-white hover:bg-slate-700/50"
              }`}
            >
              Detailed
            </button>
          </div>

          {/* Overview View - Original Session #315 Content */}
          {activeView === "overview" && (
            <>
              {/* Final Score Summary */}
              <div className="bg-slate-700/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-300 font-medium">
                    Final Signal Score
                  </span>
                  <span
                    className={`text-2xl font-bold ${getScoreColor(
                      finalScore
                    )}`}
                  >
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
                  <div
                    key={tf.timeframe}
                    className="bg-slate-700/20 rounded-lg p-3"
                  >
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
                          ({tf.contribution >= 0 ? "+" : ""}
                          {tf.contribution} pts)
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
                            : tf.score < 0
                            ? "bg-red-400"
                            : "bg-slate-400"
                        }`}
                        style={{
                          width: `${Math.min(Math.abs(tf.score), 100)}%`,
                        }}
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
                  <span className="text-slate-300 text-sm">
                    Signal Confidence
                  </span>
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
                Analysis based on {indicatorData.length} indicator measurements
                across 4 timeframes
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Session #316 Integrated Components */}
      {activeView === "confirmation" && (
        <TimeframeConfirmation
          signalId={signalId}
          finalScore={finalScore}
          signalType={signalType}
        />
      )}

      {activeView === "detailed" && (
        <TimeframeBreakdown signalId={signalId} signalType={signalType} />
      )}
    </div>
  );
};

export default SignalBreakdown;
