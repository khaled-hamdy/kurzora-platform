// 🎯 PURPOSE: Display confidence score with clear reasoning for signal reliability assessment
// 🔧 SESSION #315: Signal Explanation System - Component Foundation
// 🛡️ PRESERVATION: Analyzes real indicator data to provide confidence reasoning without modifying existing functionality
// 📝 HANDOVER: Uses 28-indicator transparency system to calculate confidence based on agreement, consensus, and data quality

"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  BarChart3,
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

// 🎯 Confidence analysis interface
interface ConfidenceAnalysis {
  overallConfidence: number;
  indicatorAgreement: number;
  timeframeConsensus: number;
  dataQuality: number;
  signalStrength: number;
  riskFactors: string[];
  strengthFactors: string[];
  confidenceLevel: "HIGH" | "MEDIUM" | "LOW";
  confidenceReasoning: string;
}

// 🎯 Component props interface
interface ConfidenceDisplayProps {
  signalId: string;
  finalScore: number;
  signalType: "bullish" | "bearish";
  className?: string;
}

// 📈 Timeframe weights matching V4 system
const TIMEFRAME_WEIGHTS = {
  "1H": 0.4,
  "4H": 0.3,
  "1D": 0.2,
  "1W": 0.1,
};

// 🔍 Confidence thresholds for analysis
const CONFIDENCE_THRESHOLDS = {
  HIGH: 80,
  MEDIUM: 60,
  LOW: 0,
};

export const ConfidenceDisplay: React.FC<ConfidenceDisplayProps> = ({
  signalId,
  finalScore,
  signalType,
  className = "",
}) => {
  // 🔧 Component state management
  const [indicators, setIndicators] = useState<IndicatorData[]>([]);
  const [confidenceAnalysis, setConfidenceAnalysis] =
    useState<ConfidenceAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 📊 Load indicator data and analyze confidence on component mount
  useEffect(() => {
    loadIndicatorDataAndAnalyze();
  }, [signalId, finalScore]);

  // 🔍 Fetch indicator data and perform confidence analysis
  const loadIndicatorDataAndAnalyze = async () => {
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
        setError("Failed to load confidence data");
        return;
      }

      // Validate we have indicator data
      if (!data || data.length === 0) {
        setError("No indicator data found for confidence analysis");
        return;
      }

      setIndicators(data);

      // Perform confidence analysis
      const analysis = analyzeConfidence(data, finalScore, signalType);
      setConfidenceAnalysis(analysis);
    } catch (err) {
      console.error("Error in loadIndicatorDataAndAnalyze:", err);
      setError("Failed to analyze signal confidence");
    } finally {
      setLoading(false);
    }
  };

  // 📈 Comprehensive confidence analysis based on indicator data
  const analyzeConfidence = (
    indicatorData: IndicatorData[],
    finalScore: number,
    signalType: "bullish" | "bearish"
  ): ConfidenceAnalysis => {
    // 🎯 Calculate indicator agreement (how many indicators agree on direction)
    const indicatorAgreement = calculateIndicatorAgreement(
      indicatorData,
      signalType
    );

    // 📊 Calculate timeframe consensus (agreement across timeframes)
    const timeframeConsensus = calculateTimeframeConsensus(
      indicatorData,
      signalType
    );

    // 🔍 Assess data quality (completeness and validity)
    const dataQuality = assessDataQuality(indicatorData);

    // 💪 Calculate signal strength based on score distribution
    const signalStrength = calculateSignalStrength(indicatorData, finalScore);

    // 🎯 Calculate overall confidence (weighted average)
    const overallConfidence = Math.round(
      indicatorAgreement * 0.3 +
        timeframeConsensus * 0.25 +
        dataQuality * 0.2 +
        signalStrength * 0.25
    );

    // 🔍 Identify risk and strength factors
    const { riskFactors, strengthFactors } = identifyConfidenceFactors(
      indicatorData,
      indicatorAgreement,
      timeframeConsensus,
      dataQuality,
      signalStrength,
      finalScore
    );

    // 📊 Determine confidence level and reasoning
    const confidenceLevel = getConfidenceLevel(overallConfidence);
    const confidenceReasoning = generateConfidenceReasoning(
      overallConfidence,
      indicatorAgreement,
      timeframeConsensus,
      dataQuality,
      signalStrength
    );

    return {
      overallConfidence,
      indicatorAgreement,
      timeframeConsensus,
      dataQuality,
      signalStrength,
      riskFactors,
      strengthFactors,
      confidenceLevel,
      confidenceReasoning,
    };
  };

  // 🎯 Calculate how well indicators agree on signal direction
  const calculateIndicatorAgreement = (
    indicatorData: IndicatorData[],
    signalType: "bullish" | "bearish"
  ): number => {
    const indicatorGroups: Record<string, number[]> = {};

    // Group scores by indicator name
    indicatorData.forEach((indicator) => {
      if (!indicatorGroups[indicator.indicator_name]) {
        indicatorGroups[indicator.indicator_name] = [];
      }
      indicatorGroups[indicator.indicator_name].push(indicator.score);
    });

    // Calculate average score per indicator and check agreement
    const indicatorAverages = Object.entries(indicatorGroups).map(
      ([name, scores]) => {
        const avg =
          scores.reduce((sum, score) => sum + score, 0) / scores.length;
        return { name, avg };
      }
    );

    // Determine how many indicators agree with signal type
    const expectedDirection =
      signalType === "bullish" ? "positive" : "negative";
    const agreeingIndicators = indicatorAverages.filter((indicator) => {
      if (expectedDirection === "positive") {
        return indicator.avg >= 50; // Bullish signals should have scores >= 50
      } else {
        return indicator.avg < 50; // Bearish signals should have scores < 50
      }
    });

    return Math.round(
      (agreeingIndicators.length / indicatorAverages.length) * 100
    );
  };

  // 📊 Calculate consensus across different timeframes
  const calculateTimeframeConsensus = (
    indicatorData: IndicatorData[],
    signalType: "bullish" | "bearish"
  ): number => {
    const timeframeScores: Record<string, number[]> = {};

    // Group scores by timeframe
    indicatorData.forEach((indicator) => {
      if (!timeframeScores[indicator.timeframe]) {
        timeframeScores[indicator.timeframe] = [];
      }
      timeframeScores[indicator.timeframe].push(indicator.score);
    });

    // Calculate average score per timeframe
    const timeframeAverages = Object.entries(timeframeScores).map(
      ([timeframe, scores]) => {
        const avg =
          scores.reduce((sum, score) => sum + score, 0) / scores.length;
        return { timeframe, avg };
      }
    );

    // Check how many timeframes agree with signal direction
    const expectedDirection =
      signalType === "bullish" ? "positive" : "negative";
    const agreeingTimeframes = timeframeAverages.filter((tf) => {
      if (expectedDirection === "positive") {
        return tf.avg >= 50;
      } else {
        return tf.avg < 50;
      }
    });

    return Math.round(
      (agreeingTimeframes.length / timeframeAverages.length) * 100
    );
  };

  // 🔍 Assess data quality and completeness
  const assessDataQuality = (indicatorData: IndicatorData[]): number => {
    // Expected: 7 indicators × 4 timeframes = 28 records
    const expectedRecords = 28;
    const actualRecords = indicatorData.length;

    // Check completeness
    const completeness = Math.min((actualRecords / expectedRecords) * 100, 100);

    // Check for null/invalid values
    const validRecords = indicatorData.filter(
      (indicator) =>
        indicator.score !== null &&
        indicator.score !== undefined &&
        indicator.score >= 0 &&
        indicator.score <= 100
    ).length;

    const validity = (validRecords / actualRecords) * 100;

    // Combined data quality score
    return Math.round((completeness + validity) / 2);
  };

  // 💪 Calculate signal strength based on score distribution
  const calculateSignalStrength = (
    indicatorData: IndicatorData[],
    finalScore: number
  ): number => {
    // Factor 1: Final score strength (40% weight)
    const scoreStrength = finalScore;

    // Factor 2: Score consistency (30% weight) - how close are individual scores to final score
    const scoreVariance =
      indicatorData.reduce((variance, indicator) => {
        return variance + Math.abs(indicator.score - finalScore);
      }, 0) / indicatorData.length;

    const consistency = Math.max(0, 100 - scoreVariance);

    // Factor 3: High-confidence indicators count (30% weight)
    const highConfidenceCount = indicatorData.filter(
      (indicator) => indicator.score >= 70
    ).length;
    const highConfidenceRatio =
      (highConfidenceCount / indicatorData.length) * 100;

    // Combined signal strength
    return Math.round(
      scoreStrength * 0.4 + consistency * 0.3 + highConfidenceRatio * 0.3
    );
  };

  // 🔍 Identify specific risk and strength factors
  const identifyConfidenceFactors = (
    indicatorData: IndicatorData[],
    indicatorAgreement: number,
    timeframeConsensus: number,
    dataQuality: number,
    signalStrength: number,
    finalScore: number
  ) => {
    const riskFactors: string[] = [];
    const strengthFactors: string[] = [];

    // Analyze agreement
    if (indicatorAgreement >= 80) {
      strengthFactors.push(
        `Strong indicator agreement (${indicatorAgreement}%)`
      );
    } else if (indicatorAgreement < 60) {
      riskFactors.push(`Low indicator agreement (${indicatorAgreement}%)`);
    }

    // Analyze timeframe consensus
    if (timeframeConsensus >= 75) {
      strengthFactors.push(
        `Excellent timeframe consensus (${timeframeConsensus}%)`
      );
    } else if (timeframeConsensus < 50) {
      riskFactors.push(`Poor timeframe consensus (${timeframeConsensus}%)`);
    }

    // Analyze data quality
    if (dataQuality >= 95) {
      strengthFactors.push(`High data quality (${dataQuality}%)`);
    } else if (dataQuality < 80) {
      riskFactors.push(`Data quality concerns (${dataQuality}%)`);
    }

    // Analyze signal strength
    if (signalStrength >= 80) {
      strengthFactors.push(`Strong signal consistency (${signalStrength}%)`);
    } else if (signalStrength < 60) {
      riskFactors.push(`Weak signal consistency (${signalStrength}%)`);
    }

    // Analyze final score
    if (finalScore >= 85) {
      strengthFactors.push(`Excellent signal score (${finalScore}/100)`);
    } else if (finalScore < 70) {
      riskFactors.push(`Moderate signal score (${finalScore}/100)`);
    }

    // Check for missing indicators
    const expectedIndicators = [
      "RSI",
      "MACD",
      "Volume",
      "Stochastic",
      "Williams_R",
      "Bollinger",
      "Support_Resistance",
    ];
    const presentIndicators = [
      ...new Set(indicatorData.map((i) => i.indicator_name)),
    ];
    const missingIndicators = expectedIndicators.filter(
      (ind) => !presentIndicators.includes(ind)
    );

    if (missingIndicators.length > 0) {
      riskFactors.push(`Missing indicators: ${missingIndicators.join(", ")}`);
    }

    return { riskFactors, strengthFactors };
  };

  // 📊 Determine confidence level based on overall score
  const getConfidenceLevel = (
    overallConfidence: number
  ): "HIGH" | "MEDIUM" | "LOW" => {
    if (overallConfidence >= CONFIDENCE_THRESHOLDS.HIGH) return "HIGH";
    if (overallConfidence >= CONFIDENCE_THRESHOLDS.MEDIUM) return "MEDIUM";
    return "LOW";
  };

  // 🎯 Generate human-readable confidence reasoning
  const generateConfidenceReasoning = (
    overallConfidence: number,
    indicatorAgreement: number,
    timeframeConsensus: number,
    dataQuality: number,
    signalStrength: number
  ): string => {
    const level = getConfidenceLevel(overallConfidence);

    if (level === "HIGH") {
      return `High confidence signal with ${indicatorAgreement}% indicator agreement and ${timeframeConsensus}% timeframe consensus. Strong data quality (${dataQuality}%) and signal consistency (${signalStrength}%) support this assessment.`;
    } else if (level === "MEDIUM") {
      return `Moderate confidence signal. While some factors are strong, areas like ${
        indicatorAgreement < 70
          ? "indicator agreement"
          : timeframeConsensus < 70
          ? "timeframe consensus"
          : "signal consistency"
      } could be improved for higher confidence.`;
    } else {
      return `Lower confidence signal due to mixed indicator signals and limited consensus across timeframes. Consider waiting for stronger confirmation before acting.`;
    }
  };

  // 🔧 Get confidence color scheme
  const getConfidenceColors = (level: "HIGH" | "MEDIUM" | "LOW") => {
    switch (level) {
      case "HIGH":
        return {
          bg: "bg-green-500/20",
          border: "border-green-500",
          text: "text-green-400",
          icon: CheckCircle,
        };
      case "MEDIUM":
        return {
          bg: "bg-yellow-500/20",
          border: "border-yellow-500",
          text: "text-yellow-400",
          icon: AlertTriangle,
        };
      case "LOW":
        return {
          bg: "bg-red-500/20",
          border: "border-red-500",
          text: "text-red-400",
          icon: XCircle,
        };
    }
  };

  // 🔧 Render loading state
  if (loading) {
    return (
      <Card className={`bg-slate-800 border-slate-700 ${className}`}>
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Signal Confidence
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400"></div>
            <span className="ml-3 text-slate-400">
              Analyzing signal confidence...
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // ⚠️ Render error state
  if (error || !confidenceAnalysis) {
    return (
      <Card className={`bg-slate-800 border-slate-700 ${className}`}>
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            Signal Confidence
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <p className="text-slate-400 mb-2">
              {error || "Unable to analyze confidence"}
            </p>
            <p className="text-sm text-slate-500">
              Confidence analysis unavailable
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const colors = getConfidenceColors(confidenceAnalysis.confidenceLevel);
  const IconComponent = colors.icon;

  return (
    <Card className={`bg-slate-800 border-slate-700 ${className}`}>
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Signal Confidence Analysis
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={`${colors.text} ${colors.border} border`}
            >
              {confidenceAnalysis.confidenceLevel} CONFIDENCE
            </Badge>
            <div className={`text-2xl font-bold ${colors.text}`}>
              {confidenceAnalysis.overallConfidence}%
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 🎯 Overall Confidence Display */}
        <div className={`${colors.bg} ${colors.border} border rounded-lg p-4`}>
          <div className="flex items-center gap-3 mb-3">
            <IconComponent className={`h-6 w-6 ${colors.text}`} />
            <h3 className={`text-lg font-semibold ${colors.text}`}>
              {confidenceAnalysis.confidenceLevel} Confidence
            </h3>
          </div>
          <p className="text-slate-300 leading-relaxed">
            {confidenceAnalysis.confidenceReasoning}
          </p>
        </div>

        {/* 📊 Confidence Metrics Breakdown */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Confidence Factors
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-700 rounded-lg p-3">
              <div className="text-sm text-slate-400 mb-1">
                Indicator Agreement
              </div>
              <div
                className={`text-xl font-bold ${
                  confidenceAnalysis.indicatorAgreement >= 70
                    ? "text-green-400"
                    : confidenceAnalysis.indicatorAgreement >= 50
                    ? "text-yellow-400"
                    : "text-red-400"
                }`}
              >
                {confidenceAnalysis.indicatorAgreement}%
              </div>
            </div>
            <div className="bg-slate-700 rounded-lg p-3">
              <div className="text-sm text-slate-400 mb-1">
                Timeframe Consensus
              </div>
              <div
                className={`text-xl font-bold ${
                  confidenceAnalysis.timeframeConsensus >= 70
                    ? "text-green-400"
                    : confidenceAnalysis.timeframeConsensus >= 50
                    ? "text-yellow-400"
                    : "text-red-400"
                }`}
              >
                {confidenceAnalysis.timeframeConsensus}%
              </div>
            </div>
            <div className="bg-slate-700 rounded-lg p-3">
              <div className="text-sm text-slate-400 mb-1">Data Quality</div>
              <div
                className={`text-xl font-bold ${
                  confidenceAnalysis.dataQuality >= 90
                    ? "text-green-400"
                    : confidenceAnalysis.dataQuality >= 70
                    ? "text-yellow-400"
                    : "text-red-400"
                }`}
              >
                {confidenceAnalysis.dataQuality}%
              </div>
            </div>
            <div className="bg-slate-700 rounded-lg p-3">
              <div className="text-sm text-slate-400 mb-1">Signal Strength</div>
              <div
                className={`text-xl font-bold ${
                  confidenceAnalysis.signalStrength >= 70
                    ? "text-green-400"
                    : confidenceAnalysis.signalStrength >= 50
                    ? "text-yellow-400"
                    : "text-red-400"
                }`}
              >
                {confidenceAnalysis.signalStrength}%
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Strength Factors */}
        {confidenceAnalysis.strengthFactors.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-green-400 mb-3 flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Confidence Strengths
            </h3>
            <div className="space-y-2">
              {confidenceAnalysis.strengthFactors.map((factor, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-slate-300"
                >
                  <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                  <span>{factor}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ⚠️ Risk Factors */}
        {confidenceAnalysis.riskFactors.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-yellow-400 mb-3 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Risk Considerations
            </h3>
            <div className="space-y-2">
              {confidenceAnalysis.riskFactors.map((factor, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-slate-300"
                >
                  <AlertTriangle className="h-4 w-4 text-yellow-400 flex-shrink-0" />
                  <span>{factor}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
