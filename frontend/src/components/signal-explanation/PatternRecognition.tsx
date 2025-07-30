import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import {
  Brain,
  TrendingUp,
  TrendingDown,
  Target,
  Clock,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle,
  BarChart3,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// 🎯 PURPOSE: AI Pattern Recognition Display - Shows historical pattern analysis for current signal
// 🔧 SESSION #317: Pattern Recognition Display - Frontend component using real AI backend data
// 🛡️ PRESERVATION: Uses Session #315-316 established patterns, integrates with existing tabbed interface
// 📝 HANDOVER: Displays pattern matching results from Session #317 pattern-matcher.ts backend
// ✅ PRODUCTION: Real database queries only, no synthetic data, follows exact established patterns

// Initialize Supabase client using established project patterns
const supabase = createClient(
  process.env.VITE_SUPABASE_URL || "",
  process.env.VITE_SUPABASE_ANON_KEY || ""
);

// TypeScript interfaces following established Session #315-316 patterns
interface PatternRecognitionProps {
  signalId: string;
  finalScore: number;
  signalType: "bullish" | "bearish";
}

interface PatternMatch {
  signal_id: string;
  similarity_score: number;
  outcome_type: "win" | "loss" | "breakeven" | "expired";
  profit_loss_percentage?: number;
  holding_period_hours?: number;
  market_conditions?: Record<string, any>;
  pattern_type: string;
  confidence_level: number;
  created_at: string;
}

interface PatternAnalysis {
  current_signal_id: string;
  pattern_signature: string;
  similar_patterns: PatternMatch[];
  pattern_confidence: number;
  success_rate: number;
  avg_profit_loss: number;
  avg_holding_period: number;
  market_context: Record<string, any>;
  sample_size: number;
  generated_at: string;
}

const PatternRecognition: React.FC<PatternRecognitionProps> = ({
  signalId,
  finalScore,
  signalType,
}) => {
  // State management following established Session #315-316 patterns
  const [patternAnalysis, setPatternAnalysis] =
    useState<PatternAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // Fetch pattern analysis on component mount
  useEffect(() => {
    fetchPatternAnalysis();
  }, [signalId]);

  // Pattern analysis query function using established patterns from Session #315-316
  const fetchPatternAnalysis = async () => {
    try {
      setLoading(true);
      setError(null);

      // 🔧 SESSION #317: Call V4 edge function with pattern analysis request
      // Note: This will be integrated when pattern-matcher.ts is added to V4 edge function
      const { data, error: apiError } = await supabase.functions.invoke(
        "automated-signal-generation-v4",
        {
          body: {
            action: "analyze_patterns",
            signal_id: signalId,
          },
        }
      );

      if (apiError) {
        throw new Error(`Pattern analysis API error: ${apiError.message}`);
      }

      if (!data || !data.pattern_analysis) {
        throw new Error("No pattern analysis data returned");
      }

      setPatternAnalysis(data.pattern_analysis);
    } catch (err) {
      console.error("Error fetching pattern analysis:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load pattern analysis"
      );
    } finally {
      setLoading(false);
    }
  };

  // Get pattern confidence color following established Session #315-316 patterns
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-emerald-400";
    if (confidence >= 60) return "text-blue-400";
    if (confidence >= 40) return "text-amber-400";
    return "text-slate-400";
  };

  const getConfidenceBgColor = (confidence: number) => {
    if (confidence >= 80) return "bg-emerald-600/20";
    if (confidence >= 60) return "bg-blue-600/20";
    if (confidence >= 40) return "bg-amber-600/20";
    return "bg-slate-600/20";
  };

  // Get outcome color for pattern matches
  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case "win":
        return "text-emerald-400";
      case "loss":
        return "text-red-400";
      case "breakeven":
        return "text-amber-400";
      default:
        return "text-slate-400";
    }
  };

  const getOutcomeIcon = (outcome: string) => {
    switch (outcome) {
      case "win":
        return <CheckCircle className="h-4 w-4 text-emerald-400" />;
      case "loss":
        return <AlertCircle className="h-4 w-4 text-red-400" />;
      default:
        return <Clock className="h-4 w-4 text-slate-400" />;
    }
  };

  // Loading state following established Session #315-316 patterns
  if (loading) {
    return (
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Brain className="h-5 w-5 text-purple-400" />
            <span>AI Pattern Recognition</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
                <div className="h-16 bg-slate-700/50 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state following established Session #315-316 patterns
  if (error) {
    return (
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-red-400" />
              <span>AI Pattern Recognition</span>
            </div>
            <Button
              onClick={fetchPatternAnalysis}
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
              ⚠️ Unable to load pattern analysis
            </div>
            <div className="text-slate-400 text-sm">{error}</div>
            <div className="text-xs text-slate-500 mt-2">
              Pattern analysis requires V4 edge function integration
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // No pattern analysis data
  if (!patternAnalysis) {
    return (
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Brain className="h-5 w-5 text-purple-400" />
            <span>AI Pattern Recognition</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-slate-400 mb-2">
              No pattern analysis available
            </div>
            <div className="text-xs text-slate-500">
              Insufficient historical data for pattern matching
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
            <span>AI Pattern Recognition</span>
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
      <CardContent className="space-y-6">
        {/* Pattern Overview */}
        <div className="bg-slate-700/30 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-300 font-medium">Pattern Analysis</span>
            <div
              className={`px-3 py-1 rounded-full text-sm font-semibold ${getConfidenceBgColor(
                patternAnalysis.pattern_confidence
              )} ${getConfidenceColor(patternAnalysis.pattern_confidence)}`}
            >
              {patternAnalysis.pattern_confidence.toFixed(1)}% Confidence
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <div className="text-xs text-slate-400 mb-1">Success Rate</div>
              <div
                className={`text-lg font-bold ${
                  patternAnalysis.success_rate >= 70
                    ? "text-emerald-400"
                    : patternAnalysis.success_rate >= 50
                    ? "text-amber-400"
                    : "text-red-400"
                }`}
              >
                {patternAnalysis.success_rate.toFixed(1)}%
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-400 mb-1">Avg Profit/Loss</div>
              <div
                className={`text-lg font-bold ${
                  patternAnalysis.avg_profit_loss >= 0
                    ? "text-emerald-400"
                    : "text-red-400"
                }`}
              >
                {patternAnalysis.avg_profit_loss >= 0 ? "+" : ""}
                {patternAnalysis.avg_profit_loss.toFixed(2)}%
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-400">
            Pattern:{" "}
            <span className="text-slate-300">
              {patternAnalysis.pattern_signature}
            </span>
            {" • "}
            Sample Size:{" "}
            <span className="text-slate-300">
              {patternAnalysis.sample_size}
            </span>
          </div>
        </div>

        {/* Market Context */}
        {patternAnalysis.market_context &&
          Object.keys(patternAnalysis.market_context).length > 0 && (
            <div className="bg-slate-700/20 rounded-lg p-4">
              <button
                onClick={() =>
                  setExpandedSection(
                    expandedSection === "market" ? null : "market"
                  )
                }
                className="flex items-center justify-between w-full text-left"
              >
                <span className="text-slate-300 font-medium">
                  Market Context
                </span>
                {expandedSection === "market" ? (
                  <ChevronUp className="h-4 w-4 text-slate-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                )}
              </button>

              {expandedSection === "market" && (
                <div className="mt-3 space-y-2">
                  {patternAnalysis.market_context.dominant_market_regime && (
                    <div className="flex justify-between">
                      <span className="text-slate-400 text-sm">
                        Market Regime:
                      </span>
                      <span className="text-slate-300 text-sm capitalize">
                        {patternAnalysis.market_context.dominant_market_regime}
                      </span>
                    </div>
                  )}
                  {patternAnalysis.market_context.dominant_volatility && (
                    <div className="flex justify-between">
                      <span className="text-slate-400 text-sm">
                        Volatility:
                      </span>
                      <span className="text-slate-300 text-sm capitalize">
                        {patternAnalysis.market_context.dominant_volatility}
                      </span>
                    </div>
                  )}
                  {patternAnalysis.avg_holding_period > 0 && (
                    <div className="flex justify-between">
                      <span className="text-slate-400 text-sm">
                        Avg Holding Period:
                      </span>
                      <span className="text-slate-300 text-sm">
                        {patternAnalysis.avg_holding_period.toFixed(1)} hours
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

        {/* Top Pattern Matches */}
        {patternAnalysis.similar_patterns.length > 0 && (
          <div className="bg-slate-700/20 rounded-lg p-4">
            <button
              onClick={() =>
                setExpandedSection(
                  expandedSection === "matches" ? null : "matches"
                )
              }
              className="flex items-center justify-between w-full text-left"
            >
              <span className="text-slate-300 font-medium">
                Similar Historical Patterns (
                {patternAnalysis.similar_patterns.length})
              </span>
              {expandedSection === "matches" ? (
                <ChevronUp className="h-4 w-4 text-slate-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-slate-400" />
              )}
            </button>

            {expandedSection === "matches" && (
              <div className="mt-3 space-y-3">
                {patternAnalysis.similar_patterns
                  .slice(0, 5)
                  .map((match, index) => (
                    <div
                      key={match.signal_id}
                      className="border border-slate-600/30 rounded-lg p-3"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getOutcomeIcon(match.outcome_type)}
                          <span
                            className={`text-sm font-medium capitalize ${getOutcomeColor(
                              match.outcome_type
                            )}`}
                          >
                            {match.outcome_type}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-xs text-slate-400">
                            {match.similarity_score.toFixed(1)}% similar
                          </span>
                          {match.profit_loss_percentage !== undefined && (
                            <span
                              className={`text-sm font-semibold ${
                                match.profit_loss_percentage >= 0
                                  ? "text-emerald-400"
                                  : "text-red-400"
                              }`}
                            >
                              {match.profit_loss_percentage >= 0 ? "+" : ""}
                              {match.profit_loss_percentage.toFixed(2)}%
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-slate-400">Pattern Type:</span>
                          <div className="text-slate-300 capitalize">
                            {match.pattern_type.replace(/_/g, " ")}
                          </div>
                        </div>
                        {match.holding_period_hours && (
                          <div>
                            <span className="text-slate-400">
                              Holding Period:
                            </span>
                            <div className="text-slate-300">
                              {match.holding_period_hours.toFixed(1)}h
                            </div>
                          </div>
                        )}
                      </div>

                      {match.market_conditions && (
                        <div className="mt-2 text-xs text-slate-500">
                          Market:{" "}
                          {match.market_conditions.market_regime || "unknown"} •
                          Vol:{" "}
                          {match.market_conditions.volatility_level ||
                            "unknown"}
                        </div>
                      )}
                    </div>
                  ))}

                {patternAnalysis.similar_patterns.length > 5 && (
                  <div className="text-center text-xs text-slate-500">
                    ... and {patternAnalysis.similar_patterns.length - 5} more
                    similar patterns
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Pattern Confidence Breakdown */}
        <div className="bg-slate-700/20 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-300 font-medium">
              Pattern Confidence
            </span>
            <Target className="h-4 w-4 text-purple-400" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Historical Accuracy:</span>
              <span
                className={getConfidenceColor(patternAnalysis.success_rate)}
              >
                {patternAnalysis.success_rate.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Pattern Strength:</span>
              <span
                className={getConfidenceColor(
                  patternAnalysis.pattern_confidence
                )}
              >
                {patternAnalysis.pattern_confidence.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Sample Quality:</span>
              <span
                className={getConfidenceColor(
                  Math.min(100, patternAnalysis.sample_size * 10)
                )}
              >
                {patternAnalysis.sample_size >= 10
                  ? "High"
                  : patternAnalysis.sample_size >= 5
                  ? "Medium"
                  : "Low"}
              </span>
            </div>
          </div>

          <div className="w-full bg-slate-600 rounded-full h-2 mt-3">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                patternAnalysis.pattern_confidence >= 80
                  ? "bg-emerald-500"
                  : patternAnalysis.pattern_confidence >= 60
                  ? "bg-blue-500"
                  : patternAnalysis.pattern_confidence >= 40
                  ? "bg-amber-500"
                  : "bg-slate-500"
              }`}
              style={{
                width: `${Math.min(
                  100,
                  Math.max(5, patternAnalysis.pattern_confidence)
                )}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Data Source Information */}
        <div className="text-xs text-slate-500 border-t border-slate-700 pt-3">
          AI analysis based on {patternAnalysis.sample_size} similar historical
          patterns
          {" • "}
          Generated:{" "}
          {new Date(patternAnalysis.generated_at).toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
};

export default PatternRecognition;
