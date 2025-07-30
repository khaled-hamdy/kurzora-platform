import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// 🎯 PURPOSE: Display sophisticated confidence analysis with clear reasoning and risk assessment
// 🔧 SESSION #315: Signal Explanation System - Component Foundation
// 🛡️ PRESERVATION: Uses real 28-indicator data for confidence calculation, no synthetic logic
// 📝 HANDOVER: Analyzes indicator consistency and agreement for confidence scoring

// Initialize Supabase client using established project patterns
const supabase = createClient(
  process.env.VITE_SUPABASE_URL || "https://jmbkssafogvzizypjaoi.supabase.co",
  process.env.VITE_SUPABASE_ANON_KEY || ""
);

// TypeScript interfaces following established project patterns
interface ConfidenceDisplayProps {
  signalId: string;
  finalScore: number;
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

interface ConfidenceAnalysis {
  confidenceLevel: "Very High" | "High" | "Moderate" | "Low";
  confidenceScore: number;
  reasoningFactors: string[];
  riskFactors: string[];
  agreementMetrics: {
    indicatorAgreement: number;
    timeframeConsistency: number;
    strengthConsistency: number;
  };
  recommendations: string[];
}

const ConfidenceDisplay: React.FC<ConfidenceDisplayProps> = ({
  signalId,
  finalScore,
  signalType,
}) => {
  // State management following established patterns
  const [indicatorData, setIndicatorData] = useState<IndicatorData[]>([]);
  const [confidenceAnalysis, setConfidenceAnalysis] =
    useState<ConfidenceAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      analyzeConfidence(data);
    } catch (err) {
      console.error("Error fetching indicator data:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load confidence analysis"
      );
    } finally {
      setLoading(false);
    }
  };

  // Analyze confidence based on real indicator data
  const analyzeConfidence = (data: IndicatorData[]) => {
    // Calculate indicator agreement (how many indicators agree on direction)
    const strongScores = data.filter((d) => d.score >= 80).length;
    const totalIndicators = data.length;
    const indicatorAgreement = Math.round(
      (strongScores / totalIndicators) * 100
    );

    // Calculate timeframe consistency (consistency across timeframes)
    const timeframes = ["1H", "4H", "1D", "1W"];
    let consistentTimeframes = 0;

    timeframes.forEach((tf) => {
      const tfData = data.filter((d) => d.timeframe === tf);
      const avgScore =
        tfData.reduce((sum, d) => sum + d.score, 0) / tfData.length;
      if (avgScore >= 70) consistentTimeframes++;
    });

    const timeframeConsistency = Math.round(
      (consistentTimeframes / timeframes.length) * 100
    );

    // Calculate strength consistency (how consistent are the scores)
    const scores = data.map((d) => d.score);
    const avgScore =
      scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const variance =
      scores.reduce((sum, score) => sum + Math.pow(score - avgScore, 2), 0) /
      scores.length;
    const standardDeviation = Math.sqrt(variance);
    const strengthConsistency = Math.round(
      Math.max(0, ((20 - standardDeviation) / 20) * 100)
    );

    // Overall confidence score calculation
    const confidenceScore = Math.round(
      indicatorAgreement * 0.4 +
        timeframeConsistency * 0.35 +
        strengthConsistency * 0.25
    );

    // Determine confidence level
    let confidenceLevel: ConfidenceAnalysis["confidenceLevel"];
    if (confidenceScore >= 85) confidenceLevel = "Very High";
    else if (confidenceScore >= 70) confidenceLevel = "High";
    else if (confidenceScore >= 55) confidenceLevel = "Moderate";
    else confidenceLevel = "Low";

    // Generate reasoning factors based on actual data
    const reasoningFactors: string[] = [];
    if (indicatorAgreement >= 80) {
      reasoningFactors.push(
        `Strong indicator consensus (${indicatorAgreement}% agreement)`
      );
    } else if (indicatorAgreement >= 60) {
      reasoningFactors.push(
        `Moderate indicator consensus (${indicatorAgreement}% agreement)`
      );
    }

    if (timeframeConsistency >= 75) {
      reasoningFactors.push(
        `Multi-timeframe alignment (${consistentTimeframes}/4 timeframes confirm)`
      );
    }

    if (strengthConsistency >= 70) {
      reasoningFactors.push(`Consistent signal strength across indicators`);
    }

    if (finalScore >= 90) {
      reasoningFactors.push(`Exceptional final score (${finalScore}/100)`);
    } else if (finalScore >= 80) {
      reasoningFactors.push(`Strong final score (${finalScore}/100)`);
    }

    // Generate risk factors based on actual data
    const riskFactors: string[] = [];
    if (indicatorAgreement < 60) {
      riskFactors.push(
        `Mixed indicator signals (${indicatorAgreement}% agreement)`
      );
    }

    if (timeframeConsistency < 50) {
      riskFactors.push(
        `Timeframe divergence (only ${consistentTimeframes}/4 confirm)`
      );
    }

    if (strengthConsistency < 50) {
      riskFactors.push(`Inconsistent signal strength across indicators`);
    }

    if (finalScore < 80) {
      riskFactors.push(`Below premium threshold (${finalScore}/100)`);
    }

    // Generate recommendations based on confidence analysis
    const recommendations: string[] = [];
    if (confidenceLevel === "Very High") {
      recommendations.push(
        `High-confidence signal suitable for larger position sizes`
      );
      recommendations.push(`Multiple timeframes confirm signal direction`);
    } else if (confidenceLevel === "High") {
      recommendations.push(`Solid signal with good indicator support`);
      recommendations.push(`Consider standard position sizing`);
    } else if (confidenceLevel === "Moderate") {
      recommendations.push(`Mixed signals suggest reduced position sizing`);
      recommendations.push(`Monitor for additional confirmation`);
    } else {
      recommendations.push(
        `Low confidence - consider avoiding or very small position`
      );
      recommendations.push(`Wait for clearer market conditions`);
    }

    setConfidenceAnalysis({
      confidenceLevel,
      confidenceScore,
      reasoningFactors,
      riskFactors,
      agreementMetrics: {
        indicatorAgreement,
        timeframeConsistency,
        strengthConsistency,
      },
      recommendations,
    });
  };

  // Get confidence color scheme following established patterns
  const getConfidenceColor = (level: string) => {
    switch (level) {
      case "Very High":
        return signalType === "bullish" ? "text-emerald-400" : "text-red-400";
      case "High":
        return signalType === "bullish" ? "text-blue-400" : "text-orange-400";
      case "Moderate":
        return "text-amber-400";
      case "Low":
        return "text-slate-400";
      default:
        return "text-slate-400";
    }
  };

  const getConfidenceIcon = (level: string) => {
    switch (level) {
      case "Very High":
        return <CheckCircle className="h-5 w-5" />;
      case "High":
        return <Shield className="h-5 w-5" />;
      case "Moderate":
        return <AlertTriangle className="h-5 w-5" />;
      case "Low":
        return <XCircle className="h-5 w-5" />;
      default:
        return <Shield className="h-5 w-5" />;
    }
  };

  // Loading state following established patterns
  if (loading) {
    return (
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Shield className="h-5 w-5 text-blue-400" />
            <span>Confidence Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="animate-pulse">
              <div className="h-20 bg-slate-700/50 rounded mb-4"></div>
              <div className="h-32 bg-slate-700/30 rounded mb-4"></div>
              <div className="h-24 bg-slate-700/30 rounded"></div>
            </div>
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
              <Shield className="h-5 w-5 text-red-400" />
              <span>Confidence Analysis</span>
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
              ⚠️ Unable to load confidence analysis
            </div>
            <div className="text-slate-400 text-sm">{error}</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!confidenceAnalysis) return null;

  return (
    <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:bg-slate-800/70 transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-blue-400" />
            <span>Confidence Analysis</span>
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
        {/* Confidence Level Display */}
        <div className="bg-slate-700/30 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div
                className={getConfidenceColor(
                  confidenceAnalysis.confidenceLevel
                )}
              >
                {getConfidenceIcon(confidenceAnalysis.confidenceLevel)}
              </div>
              <span className="text-white text-lg font-semibold">
                {confidenceAnalysis.confidenceLevel} Confidence
              </span>
            </div>
            <div
              className={`text-2xl font-bold ${getConfidenceColor(
                confidenceAnalysis.confidenceLevel
              )}`}
            >
              {confidenceAnalysis.confidenceScore}/100
            </div>
          </div>
          <div className="w-full bg-slate-600 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${
                confidenceAnalysis.confidenceScore >= 85
                  ? signalType === "bullish"
                    ? "bg-emerald-500"
                    : "bg-red-500"
                  : confidenceAnalysis.confidenceScore >= 70
                  ? signalType === "bullish"
                    ? "bg-blue-500"
                    : "bg-orange-500"
                  : confidenceAnalysis.confidenceScore >= 55
                  ? "bg-amber-500"
                  : "bg-slate-500"
              }`}
              style={{ width: `${confidenceAnalysis.confidenceScore}%` }}
            ></div>
          </div>
        </div>

        {/* Agreement Metrics */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-slate-700/20 rounded-lg p-3 text-center">
            <div className="text-slate-300 text-sm mb-1">
              Indicator Agreement
            </div>
            <div
              className={`text-lg font-semibold ${
                confidenceAnalysis.agreementMetrics.indicatorAgreement >= 80
                  ? "text-emerald-400"
                  : confidenceAnalysis.agreementMetrics.indicatorAgreement >= 60
                  ? "text-blue-400"
                  : confidenceAnalysis.agreementMetrics.indicatorAgreement >= 40
                  ? "text-amber-400"
                  : "text-red-400"
              }`}
            >
              {confidenceAnalysis.agreementMetrics.indicatorAgreement}%
            </div>
          </div>
          <div className="bg-slate-700/20 rounded-lg p-3 text-center">
            <div className="text-slate-300 text-sm mb-1">
              Timeframe Consistency
            </div>
            <div
              className={`text-lg font-semibold ${
                confidenceAnalysis.agreementMetrics.timeframeConsistency >= 75
                  ? "text-emerald-400"
                  : confidenceAnalysis.agreementMetrics.timeframeConsistency >=
                    50
                  ? "text-blue-400"
                  : confidenceAnalysis.agreementMetrics.timeframeConsistency >=
                    25
                  ? "text-amber-400"
                  : "text-red-400"
              }`}
            >
              {confidenceAnalysis.agreementMetrics.timeframeConsistency}%
            </div>
          </div>
          <div className="bg-slate-700/20 rounded-lg p-3 text-center">
            <div className="text-slate-300 text-sm mb-1">
              Strength Consistency
            </div>
            <div
              className={`text-lg font-semibold ${
                confidenceAnalysis.agreementMetrics.strengthConsistency >= 70
                  ? "text-emerald-400"
                  : confidenceAnalysis.agreementMetrics.strengthConsistency >=
                    50
                  ? "text-blue-400"
                  : confidenceAnalysis.agreementMetrics.strengthConsistency >=
                    30
                  ? "text-amber-400"
                  : "text-red-400"
              }`}
            >
              {confidenceAnalysis.agreementMetrics.strengthConsistency}%
            </div>
          </div>
        </div>

        {/* Reasoning Factors */}
        {confidenceAnalysis.reasoningFactors.length > 0 && (
          <div className="bg-emerald-900/20 border border-emerald-800/30 rounded-lg p-4">
            <h3 className="text-emerald-400 font-medium mb-3 flex items-center space-x-2">
              <CheckCircle className="h-4 w-4" />
              <span>Supporting Factors</span>
            </h3>
            <ul className="space-y-2">
              {confidenceAnalysis.reasoningFactors.map((factor, index) => (
                <li
                  key={index}
                  className="text-slate-300 text-sm flex items-start space-x-2"
                >
                  <span className="text-emerald-400 mt-1">•</span>
                  <span>{factor}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Risk Factors */}
        {confidenceAnalysis.riskFactors.length > 0 && (
          <div className="bg-amber-900/20 border border-amber-800/30 rounded-lg p-4">
            <h3 className="text-amber-400 font-medium mb-3 flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4" />
              <span>Risk Considerations</span>
            </h3>
            <ul className="space-y-2">
              {confidenceAnalysis.riskFactors.map((factor, index) => (
                <li
                  key={index}
                  className="text-slate-300 text-sm flex items-start space-x-2"
                >
                  <span className="text-amber-400 mt-1">⚠</span>
                  <span>{factor}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Recommendations */}
        <div className="bg-blue-900/20 border border-blue-800/30 rounded-lg p-4">
          <h3 className="text-blue-400 font-medium mb-3 flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Trading Recommendations</span>
          </h3>
          <ul className="space-y-2">
            {confidenceAnalysis.recommendations.map((recommendation, index) => (
              <li
                key={index}
                className="text-slate-300 text-sm flex items-start space-x-2"
              >
                <span className="text-blue-400 mt-1">→</span>
                <span>{recommendation}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Data Source Information */}
        <div className="text-xs text-slate-500 border-t border-slate-700 pt-3">
          Confidence analysis based on {indicatorData.length} indicator
          measurements and statistical agreement patterns
        </div>
      </CardContent>
    </Card>
  );
};

export default ConfidenceDisplay;
