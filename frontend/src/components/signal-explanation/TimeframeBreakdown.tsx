import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Activity,
  Info,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// 🎯 PURPOSE: Detailed timeframe analysis breakdown with trend quality explanations for each timeframe
// 🔧 SESSION #316: Multi-Timeframe Confirmation Display - Comprehensive analysis component
// 🛡️ PRESERVATION: Uses Session #315 established patterns, queries 28-indicator transparency system
// 📝 HANDOVER: Shows detailed 1H, 4H, 1D, 1W analysis with indicator contributions and trend quality reasoning
// ✅ PRODUCTION: Real database queries only, no synthetic data, follows exact established patterns

// Initialize Supabase client using established project patterns
const supabase = createClient(
  process.env.VITE_SUPABASE_URL || "https://jmbkssafogvzizypjaoi.supabase.co",
  process.env.VITE_SUPABASE_ANON_KEY || ""
);

// TypeScript interfaces following established Session #315 patterns
interface TimeframeBreakdownProps {
  signalId: string;
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

interface TimeframeDetail {
  timeframe: string;
  weight: number;
  averageScore: number;
  indicators: {
    name: string;
    rawValue: number | null;
    contribution: number | null;
    strength: "strong" | "moderate" | "weak" | "negative";
  }[];
  trendQuality: string;
  keyInsights: string[];
  riskFactors: string[];
}

const TimeframeBreakdown: React.FC<TimeframeBreakdownProps> = ({
  signalId,
  signalType,
}) => {
  // State management following established Session #315 patterns
  const [indicatorData, setIndicatorData] = useState<IndicatorData[]>([]);
  const [timeframeDetails, setTimeframeDetails] = useState<TimeframeDetail[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedTimeframes, setExpandedTimeframes] = useState<Set<string>>(
    new Set()
  );

  // Established timeframe weights from confirmed project documentation
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
      processTimeframeDetails(data);
    } catch (err) {
      console.error("Error fetching indicator data:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load timeframe breakdown"
      );
    } finally {
      setLoading(false);
    }
  };

  // Process indicator data into detailed timeframe analysis using real database data
  const processTimeframeDetails = (data: IndicatorData[]) => {
    const timeframes = ["1H", "4H", "1D", "1W"];
    const details: TimeframeDetail[] = [];

    timeframes.forEach((timeframe) => {
      const timeframeData = data.filter((d) => d.timeframe === timeframe);

      if (timeframeData.length > 0) {
        // Process indicators for this timeframe
        const indicators = timeframeData.map((d) => {
          const contribution = d.score_contribution || 0;
          let strength: "strong" | "moderate" | "weak" | "negative";

          if (contribution >= 80) strength = "strong";
          else if (contribution >= 60) strength = "moderate";
          else if (contribution >= 0) strength = "weak";
          else strength = "negative";

          return {
            name: formatIndicatorName(d.indicator_name),
            rawValue: d.raw_value,
            contribution,
            strength,
          };
        });

        // Calculate average score for timeframe
        const validContributions = indicators
          .map((i) => i.contribution)
          .filter((c): c is number => c !== null);

        const averageScore =
          validContributions.length > 0
            ? validContributions.reduce((sum, c) => sum + c, 0) /
              validContributions.length
            : 0;

        // Generate trend quality explanation based on real data analysis
        const trendQuality = generateTrendQualityExplanation(
          timeframe,
          averageScore,
          indicators,
          signalType
        );

        // Generate key insights based on indicator contributions
        const keyInsights = generateKeyInsights(
          timeframe,
          indicators,
          signalType
        );

        // Generate risk factors based on weak indicators
        const riskFactors = generateRiskFactors(timeframe, indicators);

        details.push({
          timeframe,
          weight: timeframeWeights[timeframe as keyof typeof timeframeWeights],
          averageScore: Math.round(averageScore),
          indicators,
          trendQuality,
          keyInsights,
          riskFactors,
        });
      }
    });

    setTimeframeDetails(details);
  };

  // Format indicator names for display consistency
  const formatIndicatorName = (name: string) => {
    switch (name) {
      case "SUPPORT_RESISTANCE":
        return "Support/Resistance";
      case "Williams_R":
        return "Williams %R";
      default:
        return name;
    }
  };

  // Generate trend quality explanation based on real indicator analysis
  const generateTrendQualityExplanation = (
    timeframe: string,
    averageScore: number,
    indicators: TimeframeDetail["indicators"],
    signalType: "bullish" | "bearish"
  ): string => {
    const strongIndicators = indicators.filter(
      (i) => i.strength === "strong"
    ).length;
    const totalIndicators = indicators.length;

    if (averageScore >= 80) {
      return `Strong ${signalType} trend with ${strongIndicators}/${totalIndicators} indicators showing high confidence. ${getTimeframeContext(
        timeframe
      )} patterns strongly support the signal direction.`;
    } else if (averageScore >= 60) {
      return `Moderate ${signalType} trend with mixed indicator signals. ${getTimeframeContext(
        timeframe
      )} shows some supporting evidence but requires confirmation from other timeframes.`;
    } else {
      return `Weak trend quality with conflicting signals. ${getTimeframeContext(
        timeframe
      )} analysis shows insufficient conviction for reliable ${signalType} direction.`;
    }
  };

  // Get contextual explanation for each timeframe
  const getTimeframeContext = (timeframe: string): string => {
    switch (timeframe) {
      case "1H":
        return "Short-term momentum";
      case "4H":
        return "Intraday trend analysis";
      case "1D":
        return "Daily pattern recognition";
      case "1W":
        return "Weekly trend context";
      default:
        return "Technical analysis";
    }
  };

  // Generate key insights based on strongest indicators
  const generateKeyInsights = (
    timeframe: string,
    indicators: TimeframeDetail["indicators"],
    signalType: "bullish" | "bearish"
  ): string[] => {
    const insights: string[] = [];
    const strongIndicators = indicators.filter((i) => i.strength === "strong");

    if (strongIndicators.length > 0) {
      const strongNames = strongIndicators.map((i) => i.name).join(", ");
      insights.push(`${strongNames} showing strong ${signalType} signals`);
    }

    const rsiIndicator = indicators.find((i) => i.name === "RSI");
    if (rsiIndicator && rsiIndicator.rawValue !== null) {
      if (rsiIndicator.rawValue < 30) {
        insights.push(
          `RSI oversold at ${rsiIndicator.rawValue.toFixed(
            1
          )} - potential reversal`
        );
      } else if (rsiIndicator.rawValue > 70) {
        insights.push(
          `RSI overbought at ${rsiIndicator.rawValue.toFixed(
            1
          )} - momentum caution`
        );
      }
    }

    const volumeIndicator = indicators.find((i) => i.name === "Volume");
    if (
      volumeIndicator &&
      volumeIndicator.contribution &&
      volumeIndicator.contribution > 70
    ) {
      insights.push(
        "Volume supporting price movement with institutional interest"
      );
    }

    return insights;
  };

  // Generate risk factors based on negative or weak indicators
  const generateRiskFactors = (
    timeframe: string,
    indicators: TimeframeDetail["indicators"]
  ): string[] => {
    const risks: string[] = [];
    const negativeIndicators = indicators.filter(
      (i) => i.strength === "negative"
    );
    const weakIndicators = indicators.filter((i) => i.strength === "weak");

    if (negativeIndicators.length > 0) {
      const negativeNames = negativeIndicators.map((i) => i.name).join(", ");
      risks.push(`${negativeNames} showing conflicting signals`);
    }

    if (weakIndicators.length >= indicators.length / 2) {
      risks.push(`Multiple weak indicators suggesting low confidence`);
    }

    const macdIndicator = indicators.find((i) => i.name === "MACD");
    if (
      macdIndicator &&
      macdIndicator.contribution !== null &&
      macdIndicator.contribution < 0
    ) {
      risks.push("MACD showing momentum divergence");
    }

    return risks;
  };

  // Toggle timeframe expansion for detailed view
  const toggleTimeframeExpansion = (timeframe: string) => {
    const newExpanded = new Set(expandedTimeframes);
    if (newExpanded.has(timeframe)) {
      newExpanded.delete(timeframe);
    } else {
      newExpanded.add(timeframe);
    }
    setExpandedTimeframes(newExpanded);
  };

  // Get indicator strength color
  const getIndicatorStrengthColor = (strength: string) => {
    switch (strength) {
      case "strong":
        return "text-emerald-400";
      case "moderate":
        return "text-blue-400";
      case "weak":
        return "text-amber-400";
      case "negative":
        return "text-red-400";
      default:
        return "text-slate-400";
    }
  };

  // Get timeframe score color
  const getTimeframeScoreColor = (score: number) => {
    if (score >= 80)
      return signalType === "bullish" ? "text-emerald-400" : "text-red-400";
    if (score >= 60)
      return signalType === "bullish" ? "text-blue-400" : "text-orange-400";
    if (score >= 40) return "text-amber-400";
    return "text-slate-400";
  };

  // Loading state following established Session #315 patterns
  if (loading) {
    return (
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-blue-400" />
            <span>Timeframe Breakdown</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-6 bg-slate-700 rounded w-1/4 mb-3"></div>
                <div className="h-32 bg-slate-700/50 rounded"></div>
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
              <span>Timeframe Breakdown</span>
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
              ⚠️ Unable to load timeframe breakdown
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
            <BarChart3 className="h-5 w-5 text-blue-400" />
            <span>Detailed Timeframe Analysis</span>
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
        {/* Timeframe Detail Cards */}
        {timeframeDetails.map((tf) => (
          <div
            key={tf.timeframe}
            className="border border-slate-700 rounded-lg overflow-hidden"
          >
            {/* Timeframe Header */}
            <div
              className="bg-slate-700/30 p-4 cursor-pointer hover:bg-slate-700/40 transition-colors"
              onClick={() => toggleTimeframeExpansion(tf.timeframe)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-white font-semibold text-lg">
                    {tf.timeframe}
                  </span>
                  <span className="text-slate-400 text-sm">
                    {Math.round(tf.weight * 100)}% weight
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <span
                    className={`text-xl font-bold ${getTimeframeScoreColor(
                      tf.averageScore
                    )}`}
                  >
                    {tf.averageScore}/100
                  </span>
                  {expandedTimeframes.has(tf.timeframe) ? (
                    <ChevronUp className="h-5 w-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-slate-400" />
                  )}
                </div>
              </div>
              <div className="text-slate-300 text-sm mt-1">
                {tf.trendQuality}
              </div>
            </div>

            {/* Expanded Content */}
            {expandedTimeframes.has(tf.timeframe) && (
              <div className="p-4 space-y-4">
                {/* Indicator Contributions */}
                <div>
                  <h4 className="text-slate-300 font-medium mb-3 flex items-center space-x-2">
                    <Activity className="h-4 w-4" />
                    <span>Indicator Contributions</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {tf.indicators.map((indicator, idx) => (
                      <div key={idx} className="bg-slate-700/20 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-white text-sm font-medium">
                            {indicator.name}
                          </span>
                          <span
                            className={`text-sm font-semibold ${getIndicatorStrengthColor(
                              indicator.strength
                            )}`}
                          >
                            {indicator.contribution !== null
                              ? indicator.contribution
                              : "N/A"}
                          </span>
                        </div>
                        {indicator.rawValue !== null && (
                          <div className="text-xs text-slate-400">
                            Raw Value: {indicator.rawValue.toFixed(2)}
                          </div>
                        )}
                        <div className="w-full bg-slate-600 rounded-full h-1.5 mt-2">
                          <div
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                              indicator.strength === "strong"
                                ? "bg-emerald-400"
                                : indicator.strength === "moderate"
                                ? "bg-blue-400"
                                : indicator.strength === "weak"
                                ? "bg-amber-400"
                                : "bg-red-400"
                            }`}
                            style={{
                              width: `${Math.min(
                                Math.abs(indicator.contribution || 0),
                                100
                              )}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Insights */}
                {tf.keyInsights.length > 0 && (
                  <div className="bg-blue-900/20 border border-blue-800/30 rounded-lg p-3">
                    <h4 className="text-blue-400 font-medium mb-2 flex items-center space-x-2">
                      <Info className="h-4 w-4" />
                      <span>Key Insights</span>
                    </h4>
                    <ul className="space-y-1">
                      {tf.keyInsights.map((insight, idx) => (
                        <li
                          key={idx}
                          className="text-slate-300 text-sm flex items-start space-x-2"
                        >
                          <span className="text-blue-400 mt-1">→</span>
                          <span>{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Risk Factors */}
                {tf.riskFactors.length > 0 && (
                  <div className="bg-amber-900/20 border border-amber-800/30 rounded-lg p-3">
                    <h4 className="text-amber-400 font-medium mb-2 flex items-center space-x-2">
                      <Activity className="h-4 w-4" />
                      <span>Risk Considerations</span>
                    </h4>
                    <ul className="space-y-1">
                      {tf.riskFactors.map((risk, idx) => (
                        <li
                          key={idx}
                          className="text-slate-300 text-sm flex items-start space-x-2"
                        >
                          <span className="text-amber-400 mt-1">⚠</span>
                          <span>{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {/* Summary Statistics */}
        <div className="bg-slate-700/30 rounded-lg p-4">
          <h3 className="text-slate-300 font-medium mb-3">Analysis Summary</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-400">Timeframes Analyzed:</span>
              <span className="text-white ml-2 font-semibold">
                {timeframeDetails.length}/4
              </span>
            </div>
            <div>
              <span className="text-slate-400">Total Indicators:</span>
              <span className="text-white ml-2 font-semibold">
                {indicatorData.length}
              </span>
            </div>
          </div>
        </div>

        {/* Data Source Information */}
        <div className="text-xs text-slate-500 border-t border-slate-700 pt-3">
          💡 Click on any timeframe header to expand detailed analysis
        </div>
      </CardContent>
    </Card>
  );
};

export default TimeframeBreakdown;
