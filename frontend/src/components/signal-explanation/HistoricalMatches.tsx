import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import {
  History,
  TrendingUp,
  TrendingDown,
  Clock,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  AlertTriangle,
  BarChart3,
  Calendar,
  DollarSign,
  Target,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// 🎯 PURPOSE: Historical Pattern Matches Display - Detailed visualization of similar historical signals
// 🔧 SESSION #317: Pattern Recognition Display - Comprehensive historical pattern analysis
// 🛡️ PRESERVATION: Uses Session #315-316 established patterns, integrates with existing components
// 📝 HANDOVER: Displays detailed historical matches from Session #317 pattern-matcher.ts backend
// ✅ PRODUCTION: Real database queries only, no synthetic data, follows exact established patterns

// Initialize Supabase client using established project patterns
const supabase = createClient(
  process.env.VITE_SUPABASE_URL || "",
  process.env.VITE_SUPABASE_ANON_KEY || ""
);

// TypeScript interfaces following established Session #315-316 patterns
interface HistoricalMatchesProps {
  signalId: string;
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

interface TimeframePeriod {
  label: string;
  days: number;
  matches: PatternMatch[];
}

const HistoricalMatches: React.FC<HistoricalMatchesProps> = ({
  signalId,
  signalType,
}) => {
  // State management following established Session #315-316 patterns
  const [patternAnalysis, setPatternAnalysis] =
    useState<PatternAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<string>("all");
  const [expandedMatch, setExpandedMatch] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"similarity" | "profit" | "date">(
    "similarity"
  );

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
        err instanceof Error
          ? err.message
          : "Failed to load historical patterns"
      );
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort historical matches
  const getFilteredAndSortedMatches = (): PatternMatch[] => {
    if (!patternAnalysis) return [];

    let matches = [...patternAnalysis.similar_patterns];

    // Filter by time period
    if (selectedPeriod !== "all") {
      const daysAgo = parseInt(selectedPeriod);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysAgo);

      matches = matches.filter((match) => {
        const matchDate = new Date(match.created_at);
        return matchDate >= cutoffDate;
      });
    }

    // Sort matches
    matches.sort((a, b) => {
      switch (sortBy) {
        case "similarity":
          return b.similarity_score - a.similarity_score;
        case "profit":
          const aPl = a.profit_loss_percentage || 0;
          const bPl = b.profit_loss_percentage || 0;
          return bPl - aPl;
        case "date":
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        default:
          return 0;
      }
    });

    return matches;
  };

  // Get time period breakdown
  const getTimeframePeriods = (): TimeframePeriod[] => {
    if (!patternAnalysis) return [];

    const periods = [
      { label: "Last 30 Days", days: 30 },
      { label: "Last 90 Days", days: 90 },
      { label: "Last 6 Months", days: 180 },
      { label: "Last Year", days: 365 },
    ];

    return periods.map((period) => {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - period.days);

      const matches = patternAnalysis.similar_patterns.filter((match) => {
        const matchDate = new Date(match.created_at);
        return matchDate >= cutoffDate;
      });

      return {
        label: period.label,
        days: period.days,
        matches,
      };
    });
  };

  // Get outcome color following established patterns
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

  const getOutcomeBgColor = (outcome: string) => {
    switch (outcome) {
      case "win":
        return "bg-emerald-600/20 border-emerald-700/50";
      case "loss":
        return "bg-red-600/20 border-red-700/50";
      case "breakeven":
        return "bg-amber-600/20 border-amber-700/50";
      default:
        return "bg-slate-600/20 border-slate-600/50";
    }
  };

  const getOutcomeIcon = (outcome: string) => {
    switch (outcome) {
      case "win":
        return <CheckCircle className="h-5 w-5 text-emerald-400" />;
      case "loss":
        return <XCircle className="h-5 w-5 text-red-400" />;
      case "breakeven":
        return <AlertTriangle className="h-5 w-5 text-amber-400" />;
      default:
        return <Clock className="h-5 w-5 text-slate-400" />;
    }
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Format holding period
  const formatHoldingPeriod = (hours?: number): string => {
    if (!hours) return "Unknown";
    if (hours < 24) return `${hours.toFixed(1)}h`;
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return `${days}d ${remainingHours.toFixed(0)}h`;
  };

  // Loading state following established Session #315-316 patterns
  if (loading) {
    return (
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <History className="h-5 w-5 text-blue-400" />
            <span>Historical Pattern Matches</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-slate-700 rounded w-2/3 mb-2"></div>
                <div className="h-20 bg-slate-700/50 rounded"></div>
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
              <History className="h-5 w-5 text-red-400" />
              <span>Historical Pattern Matches</span>
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
              ⚠️ Unable to load historical patterns
            </div>
            <div className="text-slate-400 text-sm">{error}</div>
            <div className="text-xs text-slate-500 mt-2">
              Historical analysis requires V4 edge function integration
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // No pattern analysis data
  if (!patternAnalysis || patternAnalysis.similar_patterns.length === 0) {
    return (
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <History className="h-5 w-5 text-blue-400" />
            <span>Historical Pattern Matches</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-slate-400 mb-2">
              No historical patterns found
            </div>
            <div className="text-xs text-slate-500">
              Insufficient historical data for pattern comparison
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const filteredMatches = getFilteredAndSortedMatches();
  const timeframePeriods = getTimeframePeriods();

  return (
    <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:bg-slate-800/70 transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <History className="h-5 w-5 text-blue-400" />
            <span>Historical Pattern Matches</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-400">
              {filteredMatches.length} matches
            </span>
            {signalType === "bullish" ? (
              <TrendingUp className="h-5 w-5 text-emerald-400" />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-400" />
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Statistics */}
        <div className="bg-slate-700/30 rounded-lg p-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-emerald-400">
                {
                  patternAnalysis.similar_patterns.filter(
                    (m) => m.outcome_type === "win"
                  ).length
                }
              </div>
              <div className="text-xs text-slate-400">Wins</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-red-400">
                {
                  patternAnalysis.similar_patterns.filter(
                    (m) => m.outcome_type === "loss"
                  ).length
                }
              </div>
              <div className="text-xs text-slate-400">Losses</div>
            </div>
            <div className="text-center">
              <div
                className={`text-lg font-bold ${
                  patternAnalysis.avg_profit_loss >= 0
                    ? "text-emerald-400"
                    : "text-red-400"
                }`}
              >
                {patternAnalysis.avg_profit_loss >= 0 ? "+" : ""}
                {patternAnalysis.avg_profit_loss.toFixed(1)}%
              </div>
              <div className="text-xs text-slate-400">Avg P/L</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-400">
                {patternAnalysis.avg_holding_period.toFixed(0)}h
              </div>
              <div className="text-xs text-slate-400">Avg Hold</div>
            </div>
          </div>
        </div>

        {/* Time Period Breakdown */}
        <div className="bg-slate-700/20 rounded-lg p-4">
          <div className="text-slate-300 font-medium mb-3">
            Historical Performance by Period
          </div>
          <div className="grid grid-cols-2 gap-3">
            {timeframePeriods.map((period) => {
              const wins = period.matches.filter(
                (m) => m.outcome_type === "win"
              ).length;
              const total = period.matches.length;
              const winRate = total > 0 ? (wins / total) * 100 : 0;

              return (
                <div key={period.label} className="bg-slate-600/20 rounded p-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-slate-400">
                      {period.label}
                    </span>
                    <span className="text-xs text-slate-300">
                      {total} matches
                    </span>
                  </div>
                  <div
                    className={`text-sm font-semibold ${
                      winRate >= 70
                        ? "text-emerald-400"
                        : winRate >= 50
                        ? "text-amber-400"
                        : "text-red-400"
                    }`}
                  >
                    {winRate.toFixed(0)}% win rate
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Filters and Sorting */}
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex gap-2">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="bg-slate-700 text-slate-300 text-sm rounded px-3 py-1 border border-slate-600"
            >
              <option value="all">All Time</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last 90 Days</option>
              <option value="180">Last 6 Months</option>
              <option value="365">Last Year</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "similarity" | "profit" | "date")
              }
              className="bg-slate-700 text-slate-300 text-sm rounded px-3 py-1 border border-slate-600"
            >
              <option value="similarity">Sort by Similarity</option>
              <option value="profit">Sort by Profit/Loss</option>
              <option value="date">Sort by Date</option>
            </select>
          </div>

          <div className="text-xs text-slate-500">
            Showing {filteredMatches.length} of{" "}
            {patternAnalysis.similar_patterns.length} matches
          </div>
        </div>

        {/* Historical Matches List */}
        <div className="space-y-3">
          {filteredMatches.slice(0, 20).map((match, index) => (
            <div
              key={`${match.signal_id}-${index}`}
              className={`border rounded-lg p-4 transition-all duration-200 ${getOutcomeBgColor(
                match.outcome_type
              )}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  {getOutcomeIcon(match.outcome_type)}
                  <div>
                    <div
                      className={`font-medium capitalize ${getOutcomeColor(
                        match.outcome_type
                      )}`}
                    >
                      {match.outcome_type}
                    </div>
                    <div className="text-xs text-slate-400">
                      {formatDate(match.created_at)}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  {match.profit_loss_percentage !== undefined && (
                    <div
                      className={`text-lg font-bold ${
                        match.profit_loss_percentage >= 0
                          ? "text-emerald-400"
                          : "text-red-400"
                      }`}
                    >
                      {match.profit_loss_percentage >= 0 ? "+" : ""}
                      {match.profit_loss_percentage.toFixed(2)}%
                    </div>
                  )}
                  <div className="text-xs text-slate-400">
                    {match.similarity_score.toFixed(1)}% similar
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-slate-400">Pattern:</span>
                  <div className="text-slate-300 capitalize">
                    {match.pattern_type.replace(/_/g, " ")}
                  </div>
                </div>

                {match.holding_period_hours && (
                  <div>
                    <span className="text-slate-400">Duration:</span>
                    <div className="text-slate-300">
                      {formatHoldingPeriod(match.holding_period_hours)}
                    </div>
                  </div>
                )}

                <div>
                  <span className="text-slate-400">Confidence:</span>
                  <div className="text-slate-300">
                    {match.confidence_level.toFixed(0)}%
                  </div>
                </div>
              </div>

              {match.market_conditions && (
                <button
                  onClick={() =>
                    setExpandedMatch(
                      expandedMatch === match.signal_id ? null : match.signal_id
                    )
                  }
                  className="flex items-center justify-between w-full mt-3 pt-3 border-t border-slate-600/30"
                >
                  <span className="text-xs text-slate-400">
                    Market Conditions
                  </span>
                  {expandedMatch === match.signal_id ? (
                    <ChevronUp className="h-3 w-3 text-slate-400" />
                  ) : (
                    <ChevronDown className="h-3 w-3 text-slate-400" />
                  )}
                </button>
              )}

              {expandedMatch === match.signal_id && match.market_conditions && (
                <div className="mt-2 grid grid-cols-2 gap-3 text-xs">
                  {match.market_conditions.market_regime && (
                    <div>
                      <span className="text-slate-400">Market Regime:</span>
                      <div className="text-slate-300 capitalize">
                        {match.market_conditions.market_regime}
                      </div>
                    </div>
                  )}
                  {match.market_conditions.volatility_level && (
                    <div>
                      <span className="text-slate-400">Volatility:</span>
                      <div className="text-slate-300 capitalize">
                        {match.market_conditions.volatility_level}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {filteredMatches.length > 20 && (
            <div className="text-center text-sm text-slate-500 py-4">
              Showing top 20 matches • {filteredMatches.length - 20} more
              available
            </div>
          )}
        </div>

        {/* Data Source Information */}
        <div className="text-xs text-slate-500 border-t border-slate-700 pt-3">
          Historical analysis based on {patternAnalysis.sample_size} similar
          patterns
          {" • "}
          Pattern: {patternAnalysis.pattern_signature}
          {" • "}
          Generated:{" "}
          {new Date(patternAnalysis.generated_at).toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
};

export default HistoricalMatches;
