// src/components/signal-explorer/QualityAnalyzer.tsx
// 🎯 SESSION #321: Signal Quality Analysis Component
// 🏗️ BUILDS ON: Session #320 patterns and 28-indicator transparency system
// 🔧 PURPOSE: Analyze quality differences between signals with AI recommendations
// 🛡️ PRESERVATION: Uses existing Signal interface and database schema
// 📊 DATA SOURCE: Real database queries to indicators table for quality analysis

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  TrendingUp,
  TrendingDown,
  Shield,
  Target,
  Brain,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Crown,
  BarChart3,
  Zap,
  Info,
} from "lucide-react";
import { Signal } from "../../contexts/SignalsContext";
import { supabase } from "../../lib/supabase";

interface QualityAnalyzerProps {
  signals: Signal[];
  recommendedSignal: Signal | null;
}

// 🎯 QUALITY METRICS: Individual signal quality analysis
interface SignalQuality {
  signal: Signal;
  overallScore: number;
  strengthScore: number;
  riskScore: number;
  consistencyScore: number;
  enhancementScore: number;
  strengths: string[];
  weaknesses: string[];
  riskFactors: string[];
}

// 🔧 INDICATOR DATA: Structure for 28-indicator analysis
interface IndicatorData {
  indicator_name: string;
  timeframe: string;
  raw_value: number;
  score_contribution: number;
  metadata: any;
}

// 🚀 QUALITY COMPARISON MATRIX: Visual comparison grid
const QualityComparisonMatrix: React.FC<{ qualityData: SignalQuality[] }> = ({
  qualityData,
}) => {
  const metrics = [
    {
      key: "strengthScore",
      label: "Signal Strength",
      icon: <Zap className="h-4 w-4" />,
    },
    {
      key: "riskScore",
      label: "Risk Management",
      icon: <Shield className="h-4 w-4" />,
    },
    {
      key: "consistencyScore",
      label: "Consistency",
      icon: <Target className="h-4 w-4" />,
    },
    {
      key: "enhancementScore",
      label: "Data Quality",
      icon: <BarChart3 className="h-4 w-4" />,
    },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400 bg-emerald-600/20";
    if (score >= 60) return "text-amber-400 bg-amber-600/20";
    return "text-red-400 bg-red-600/20";
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">
        Quality Comparison Matrix
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left text-slate-400 py-3 px-4">Metric</th>
              {qualityData.map((quality) => (
                <th
                  key={quality.signal.ticker}
                  className="text-center text-slate-400 py-3 px-4"
                >
                  {quality.signal.ticker}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {metrics.map((metric) => (
              <tr key={metric.key} className="border-b border-slate-700/50">
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-2 text-white">
                    {metric.icon}
                    <span>{metric.label}</span>
                  </div>
                </td>
                {qualityData.map((quality) => {
                  const score = quality[
                    metric.key as keyof SignalQuality
                  ] as number;
                  return (
                    <td
                      key={quality.signal.ticker}
                      className="text-center py-4 px-4"
                    >
                      <Badge className={`${getScoreColor(score)} border-none`}>
                        {score}/100
                      </Badge>
                    </td>
                  );
                })}
              </tr>
            ))}
            <tr className="border-b-2 border-slate-600 bg-slate-800/30">
              <td className="py-4 px-4 font-bold text-white">
                Overall Quality
              </td>
              {qualityData.map((quality) => (
                <td
                  key={quality.signal.ticker}
                  className="text-center py-4 px-4"
                >
                  <Badge
                    className={`${getScoreColor(
                      quality.overallScore
                    )} border-none font-bold text-lg`}
                  >
                    {quality.overallScore}/100
                  </Badge>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

// 🎯 AI RECOMMENDATION CARD: Detailed recommendation explanation
const AIRecommendationCard: React.FC<{
  recommendedSignal: Signal;
  qualityData: SignalQuality[];
}> = ({ recommendedSignal, qualityData }) => {
  const recommendedQuality = qualityData.find(
    (q) => q.signal.ticker === recommendedSignal.ticker
  );

  if (!recommendedQuality) return null;

  return (
    <Card className="bg-gradient-to-r from-emerald-900/20 to-blue-900/20 border-emerald-500/30">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Crown className="h-5 w-5 mr-2 text-emerald-400" />
          AI Recommendation: {recommendedSignal.ticker}
          <Badge className="ml-2 bg-emerald-600 text-white">
            Score: {recommendedQuality.overallScore}/100
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 🚀 STRENGTHS: Why this signal is recommended */}
        <div>
          <h4 className="text-emerald-400 font-medium mb-2 flex items-center">
            <CheckCircle className="h-4 w-4 mr-1" />
            Key Strengths
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {recommendedQuality.strengths.map((strength, index) => (
              <div
                key={index}
                className="flex items-center text-sm text-slate-300"
              >
                <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2" />
                {strength}
              </div>
            ))}
          </div>
        </div>

        {/* 🔧 RISK FACTORS: Balanced analysis */}
        {recommendedQuality.riskFactors.length > 0 && (
          <div>
            <h4 className="text-amber-400 font-medium mb-2 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-1" />
              Risk Considerations
            </h4>
            <div className="space-y-1">
              {recommendedQuality.riskFactors.map((risk, index) => (
                <div
                  key={index}
                  className="flex items-center text-sm text-slate-400"
                >
                  <div className="w-2 h-2 bg-amber-400 rounded-full mr-2" />
                  {risk}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 🎯 ENHANCED DATA DISPLAY: Show Session #134 enhanced fields if available */}
        {recommendedSignal.hasEnhancedData && (
          <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600">
            <h4 className="text-blue-400 font-medium mb-3">
              Enhanced Risk Management Data
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {recommendedSignal.entryPrice && (
                <div>
                  <span className="text-slate-400">Smart Entry Price:</span>
                  <div className="text-emerald-400 font-semibold">
                    ${recommendedSignal.entryPrice.toFixed(2)}
                  </div>
                </div>
              )}
              {recommendedSignal.riskRewardRatio && (
                <div>
                  <span className="text-slate-400">Risk/Reward Ratio:</span>
                  <div className="text-blue-400 font-semibold">
                    {recommendedSignal.riskRewardRatio.toFixed(1)}:1
                  </div>
                </div>
              )}
              {recommendedSignal.stopLoss && (
                <div>
                  <span className="text-slate-400">Stop Loss:</span>
                  <div className="text-red-400 font-semibold">
                    ${recommendedSignal.stopLoss.toFixed(2)}
                  </div>
                </div>
              )}
              {recommendedSignal.takeProfit && (
                <div>
                  <span className="text-slate-400">Take Profit:</span>
                  <div className="text-emerald-400 font-semibold">
                    ${recommendedSignal.takeProfit.toFixed(2)}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// 🎯 MAIN QUALITY ANALYZER COMPONENT
const QualityAnalyzer: React.FC<QualityAnalyzerProps> = ({
  signals,
  recommendedSignal,
}) => {
  const [qualityData, setQualityData] = useState<SignalQuality[]>([]);
  const [indicatorData, setIndicatorData] = useState<
    Map<string, IndicatorData[]>
  >(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔧 FETCH INDICATOR DATA: Load 28-indicator transparency data for quality analysis
  useEffect(() => {
    const fetchIndicatorData = async () => {
      if (signals.length === 0) return;

      try {
        setLoading(true);
        setError(null);

        console.log(
          "🔍 SESSION #321: Fetching indicator data for quality analysis..."
        );

        // 🎯 REAL DATABASE QUERY: Fetch indicators for all signals being compared
        const signalTickers = signals.map((s) => s.ticker);

        const { data: signalsWithIndicators, error: queryError } =
          await supabase
            .from("trading_signals")
            .select(
              `
            ticker,
            id,
            indicators(
              indicator_name,
              timeframe,
              raw_value,
              score_contribution,
              metadata
            )
          `
            )
            .in("ticker", signalTickers)
            .eq("status", "active");

        if (queryError) {
          throw new Error(
            `Failed to fetch indicator data: ${queryError.message}`
          );
        }

        // 🔧 ORGANIZE INDICATOR DATA: Group by ticker for analysis
        const indicatorMap = new Map<string, IndicatorData[]>();

        signalsWithIndicators?.forEach((signalRecord) => {
          if (
            signalRecord.indicators &&
            Array.isArray(signalRecord.indicators)
          ) {
            indicatorMap.set(
              signalRecord.ticker,
              signalRecord.indicators as IndicatorData[]
            );
            console.log(
              `✅ ${signalRecord.ticker}: Loaded ${signalRecord.indicators.length} indicators`
            );
          }
        });

        setIndicatorData(indicatorMap);

        // 🚀 ANALYZE QUALITY: Process quality metrics for each signal
        const qualityAnalysis = signals.map((signal) =>
          analyzeSignalQuality(signal, indicatorMap.get(signal.ticker) || [])
        );
        setQualityData(qualityAnalysis);

        console.log(
          "✅ SESSION #321: Quality analysis complete for all signals"
        );
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        console.error("❌ Quality analysis error:", errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchIndicatorData();
  }, [signals]);

  // 🎯 QUALITY ANALYSIS LOGIC: Analyze signal quality using real data
  const analyzeSignalQuality = (
    signal: Signal,
    indicators: IndicatorData[]
  ): SignalQuality => {
    let strengthScore = 0;
    let riskScore = 0;
    let consistencyScore = 0;
    let enhancementScore = 0;
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const riskFactors: string[] = [];

    // 🔧 1. SIGNAL STRENGTH ANALYSIS (0-100)
    const finalScore = signal.finalScore || 0;
    strengthScore = finalScore;

    if (finalScore >= 85) {
      strengths.push("Exceptional signal strength (85+)");
    } else if (finalScore >= 75) {
      strengths.push("Strong signal confirmation");
    } else if (finalScore < 60) {
      weaknesses.push("Below-average signal strength");
      riskFactors.push("Low signal confidence");
    }

    // 🔧 2. RISK MANAGEMENT ANALYSIS (0-100)
    if (signal.hasEnhancedData) {
      riskScore += 40; // Base score for having enhanced data
      strengths.push("Complete risk management data available");

      if (signal.riskRewardRatio && signal.riskRewardRatio >= 2) {
        riskScore += 30;
        strengths.push(
          `Excellent R/R ratio (${signal.riskRewardRatio.toFixed(1)}:1)`
        );
      } else if (signal.riskRewardRatio && signal.riskRewardRatio >= 1.5) {
        riskScore += 20;
        strengths.push("Good risk-reward ratio");
      } else if (signal.riskRewardRatio && signal.riskRewardRatio < 1.5) {
        riskScore += 10;
        riskFactors.push("Below-optimal risk-reward ratio");
      }

      if (signal.stopLoss && signal.entryPrice) {
        const riskPercent =
          Math.abs((signal.stopLoss - signal.entryPrice) / signal.entryPrice) *
          100;
        if (riskPercent <= 3) {
          riskScore += 30;
          strengths.push("Conservative stop loss placement");
        } else if (riskPercent <= 5) {
          riskScore += 20;
        } else {
          riskScore += 10;
          riskFactors.push("Wide stop loss - higher risk");
        }
      }
    } else {
      riskScore = 30; // Limited score without enhanced data
      weaknesses.push("Limited risk management data");
      riskFactors.push("No enhanced risk calculations available");
    }

    // 🔧 3. TIMEFRAME CONSISTENCY ANALYSIS (0-100)
    if (signal.signals) {
      const timeframeScores = Object.values(signal.signals);
      const avgScore =
        timeframeScores.reduce((a, b) => a + b, 0) / timeframeScores.length;
      const maxDeviation = Math.max(
        ...timeframeScores.map((score) => Math.abs(score - avgScore))
      );

      if (maxDeviation <= 5) {
        consistencyScore = 100;
        strengths.push("Excellent timeframe alignment");
      } else if (maxDeviation <= 10) {
        consistencyScore = 80;
        strengths.push("Good timeframe consistency");
      } else if (maxDeviation <= 15) {
        consistencyScore = 60;
      } else {
        consistencyScore = 40;
        weaknesses.push("Inconsistent across timeframes");
        riskFactors.push("Mixed timeframe signals");
      }
    } else {
      consistencyScore = 30;
      weaknesses.push("No timeframe data available");
    }

    // 🔧 4. DATA ENHANCEMENT SCORE (0-100)
    if (indicators.length >= 20) {
      enhancementScore += 40;
      strengths.push("Rich indicator analysis (20+ indicators)");
    } else if (indicators.length >= 10) {
      enhancementScore += 30;
      strengths.push("Good indicator coverage");
    } else if (indicators.length > 0) {
      enhancementScore += 20;
    } else {
      enhancementScore += 10;
      weaknesses.push("Limited indicator data");
    }

    if (signal.hasEnhancedData) {
      enhancementScore += 30;
    }

    if (signal.sector && signal.sector !== "Unknown") {
      enhancementScore += 15;
    }

    if (signal.current_price && signal.current_price > 0) {
      enhancementScore += 15;
    }

    // 🎯 CALCULATE OVERALL SCORE: Weighted average of all metrics
    const overallScore = Math.round(
      strengthScore * 0.4 +
        riskScore * 0.3 +
        consistencyScore * 0.2 +
        enhancementScore * 0.1
    );

    return {
      signal,
      overallScore,
      strengthScore: Math.round(strengthScore),
      riskScore: Math.round(riskScore),
      consistencyScore: Math.round(consistencyScore),
      enhancementScore: Math.round(enhancementScore),
      strengths,
      weaknesses,
      riskFactors,
    };
  };

  // 🔔 LOADING STATE
  if (loading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="text-center py-12">
          <div className="animate-spin h-8 w-8 mx-auto mb-4 text-blue-400">
            <Brain className="h-8 w-8" />
          </div>
          <p className="text-slate-400">Analyzing signal quality...</p>
        </CardContent>
      </Card>
    );
  }

  // 🔔 ERROR STATE
  if (error) {
    return (
      <Card className="bg-red-900/20 border-red-600/30">
        <CardContent className="text-center py-8">
          <XCircle className="h-8 w-8 mx-auto mb-4 text-red-400" />
          <p className="text-red-300">Quality analysis failed: {error}</p>
          <Button
            variant="outline"
            className="mt-4 border-red-500 text-red-400 hover:bg-red-600/10"
            onClick={() => window.location.reload()}
          >
            Retry Analysis
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* 🚀 AI RECOMMENDATION: Show recommended signal if available */}
      {recommendedSignal && (
        <AIRecommendationCard
          recommendedSignal={recommendedSignal}
          qualityData={qualityData}
        />
      )}

      {/* 🔧 QUALITY COMPARISON MATRIX: Detailed side-by-side analysis */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Brain className="h-5 w-5 mr-2 text-blue-400" />
            Quality Analysis Results
            <Badge className="ml-2 bg-blue-600 text-white">
              {qualityData.length} Signals Analyzed
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <QualityComparisonMatrix qualityData={qualityData} />
        </CardContent>
      </Card>

      {/* 🎯 DETAILED INSIGHTS: Individual signal breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {qualityData.map((quality) => (
          <Card
            key={quality.signal.ticker}
            className="bg-slate-800/30 border-slate-700"
          >
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <span>{quality.signal.ticker} Analysis</span>
                <Badge
                  className={`
                  ${
                    quality.overallScore >= 80
                      ? "bg-emerald-600"
                      : quality.overallScore >= 60
                      ? "bg-amber-600"
                      : "bg-red-600"
                  } 
                  text-white
                `}
                >
                  {quality.overallScore}/100
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 🔧 STRENGTHS */}
              {quality.strengths.length > 0 && (
                <div>
                  <h4 className="text-emerald-400 font-medium mb-2 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Strengths
                  </h4>
                  <div className="space-y-1">
                    {quality.strengths.map((strength, index) => (
                      <div
                        key={index}
                        className="text-sm text-slate-300 flex items-center"
                      >
                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-2" />
                        {strength}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 🔧 WEAKNESSES */}
              {quality.weaknesses.length > 0 && (
                <div>
                  <h4 className="text-amber-400 font-medium mb-2 flex items-center">
                    <Info className="h-4 w-4 mr-1" />
                    Areas for Improvement
                  </h4>
                  <div className="space-y-1">
                    {quality.weaknesses.map((weakness, index) => (
                      <div
                        key={index}
                        className="text-sm text-slate-400 flex items-center"
                      >
                        <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mr-2" />
                        {weakness}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default QualityAnalyzer;
