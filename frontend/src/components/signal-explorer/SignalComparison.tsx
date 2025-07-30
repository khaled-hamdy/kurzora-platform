// src/components/signal-explorer/SignalComparison.tsx
// 🎯 SESSION #321: Signal Quality Comparison Tool
// 🏗️ BUILDS ON: Session #320 Deep Dive Modal System patterns
// 🔧 PURPOSE: Allow users to compare 2-3 signals side-by-side with quality analysis
// 🛡️ PRESERVATION: Uses existing Signal interface from SignalsContext
// 📊 DATA SOURCE: Leverages 28-indicator transparency system for quality analysis

import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  X,
  Plus,
  TrendingUp,
  TrendingDown,
  Target,
  Shield,
  AlertCircle,
  BarChart3,
  Zap,
  Crown,
} from "lucide-react";
import { useToast } from "../../hooks/use-toast";
import { Signal } from "../../contexts/SignalsContext";
import QualityAnalyzer from "./QualityAnalyzer";

// 🎯 SESSION #321: Comparison interface using existing Signal structure
interface SignalComparisonProps {
  signals: Signal[];
  selectedSignals: Signal[];
  onAddSignal: (signal: Signal) => void;
  onRemoveSignal: (signal: Signal) => void;
  onViewDeepDive: (signal: Signal) => void;
  maxSignals?: number;
}

// 🔧 COMPARISON SLOT COMPONENT: Individual signal display in comparison view
const ComparisonSlot: React.FC<{
  signal: Signal | null;
  onRemove?: () => void;
  onViewDeepDive?: (signal: Signal) => void;
  slotIndex: number;
  isRecommended?: boolean;
}> = ({ signal, onRemove, onViewDeepDive, slotIndex, isRecommended }) => {
  if (!signal) {
    return (
      <Card className="bg-slate-800/30 border-slate-700 border-dashed h-[400px] flex items-center justify-center">
        <div className="text-center text-slate-400">
          <Plus className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">Add Signal {slotIndex + 1}</p>
          <p className="text-sm">Select a signal to compare</p>
        </div>
      </Card>
    );
  }

  // 🎯 SCORE COLOR LOGIC: Using Session #320 patterns
  const getScoreColor = (score: number) => {
    if (score >= 90) return "bg-emerald-600";
    if (score >= 80) return "bg-blue-600";
    if (score >= 70) return "bg-amber-600";
    return "bg-red-600";
  };

  const getChangeColor = (change: number) => {
    return change >= 0 ? "text-emerald-400" : "text-red-400";
  };

  const finalScore = signal.finalScore || 0;
  const priceChange = signal.price_change_percent || 0;

  return (
    <Card
      className={`bg-slate-800/50 border-slate-700 relative ${
        isRecommended ? "ring-2 ring-emerald-500" : ""
      }`}
    >
      {/* 🚀 RECOMMENDED BADGE: AI recommendation indicator */}
      {isRecommended && (
        <div className="absolute -top-2 -right-2 z-10">
          <Badge className="bg-emerald-600 text-white animate-pulse">
            <Crown className="h-3 w-3 mr-1" />
            AI Pick
          </Badge>
        </div>
      )}

      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-white">
              {signal.ticker}
            </CardTitle>
            <p className="text-slate-400 text-sm">{signal.name}</p>
            <p className="text-slate-500 text-xs">{signal.sector}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={`${getScoreColor(finalScore)} text-white`}>
              {finalScore}
            </Badge>
            {onRemove && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onRemove}
                className="text-slate-400 hover:text-white hover:bg-slate-700 p-1"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* 🔧 PRICE INFORMATION: Following Session #320 patterns */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-slate-400 text-sm">Current Price</p>
            <p className="text-white font-semibold text-lg">
              ${signal.current_price?.toFixed(2) || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-slate-400 text-sm">Change</p>
            <p
              className={`font-semibold text-lg flex items-center ${getChangeColor(
                priceChange
              )}`}
            >
              {priceChange >= 0 ? (
                <TrendingUp className="h-4 w-4 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-1" />
              )}
              {priceChange >= 0 ? "+" : ""}
              {priceChange.toFixed(2)}%
            </p>
          </div>
        </div>

        {/* 🎯 ENHANCED FIELDS: Display Session #134 enhanced data if available */}
        {signal.hasEnhancedData && (
          <div className="space-y-2 p-3 bg-slate-700/30 rounded-lg border border-slate-600">
            <h4 className="text-white font-medium text-sm">
              Enhanced Analysis
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {signal.entryPrice && (
                <div>
                  <span className="text-slate-400">Entry: </span>
                  <span className="text-emerald-400 font-medium">
                    ${signal.entryPrice.toFixed(2)}
                  </span>
                </div>
              )}
              {signal.riskRewardRatio && (
                <div>
                  <span className="text-slate-400">R/R: </span>
                  <span className="text-blue-400 font-medium">
                    {signal.riskRewardRatio.toFixed(1)}:1
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 🔧 TIMEFRAME SCORES: Display multi-timeframe analysis */}
        <div className="space-y-2">
          <h4 className="text-white font-medium text-sm">Timeframe Scores</h4>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(signal.signals || {}).map(([timeframe, score]) => (
              <div
                key={timeframe}
                className="flex justify-between items-center"
              >
                <span className="text-slate-400 text-xs">{timeframe}</span>
                <Badge
                  className={`${getScoreColor(score)} text-white text-xs`}
                  variant="secondary"
                >
                  {score}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* 🚀 ACTION BUTTONS: Deep dive integration */}
        <div className="pt-4 border-t border-slate-700">
          <Button
            onClick={() => onViewDeepDive?.(signal)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Deep Analysis
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// 🎯 MAIN COMPARISON COMPONENT: Session #321 Signal Quality Comparison Tool
const SignalComparison: React.FC<SignalComparisonProps> = ({
  signals,
  selectedSignals,
  onAddSignal,
  onRemoveSignal,
  onViewDeepDive,
  maxSignals = 3,
}) => {
  const [showQualityAnalysis, setShowQualityAnalysis] = useState(false);
  const [recommendedSignal, setRecommendedSignal] = useState<Signal | null>(
    null
  );
  const { toast } = useToast();

  // 🔧 QUALITY ANALYSIS: Trigger analysis when we have 2+ signals
  useEffect(() => {
    if (selectedSignals.length >= 2) {
      setShowQualityAnalysis(true);
      // 🎯 AI RECOMMENDATION: Simple logic based on existing data
      analyzeAndRecommend();
    } else {
      setShowQualityAnalysis(false);
      setRecommendedSignal(null);
    }
  }, [selectedSignals]);

  // 🚀 AI RECOMMENDATION LOGIC: Uses existing signal data for intelligent recommendations
  const analyzeAndRecommend = () => {
    if (selectedSignals.length < 2) return;

    try {
      // 🎯 SCORING CRITERIA: Based on existing signal fields
      const scoredSignals = selectedSignals.map((signal) => {
        let qualityScore = 0;
        let reasons: string[] = [];

        // 1. Final Score Weight (40%)
        const finalScore = signal.finalScore || 0;
        qualityScore += (finalScore / 100) * 40;
        if (finalScore >= 85) reasons.push("Exceptional signal strength");

        // 2. Enhanced Data Availability (20%)
        if (signal.hasEnhancedData) {
          qualityScore += 20;
          reasons.push("Complete risk management data");
        }

        // 3. Risk-Reward Ratio (20%)
        if (signal.riskRewardRatio && signal.riskRewardRatio >= 2) {
          qualityScore += 20;
          reasons.push("Favorable risk-reward ratio");
        } else if (signal.riskRewardRatio && signal.riskRewardRatio >= 1.5) {
          qualityScore += 10;
        }

        // 4. Multi-timeframe Consistency (20%)
        if (signal.signals) {
          const timeframeScores = Object.values(signal.signals);
          const avgScore =
            timeframeScores.reduce((a, b) => a + b, 0) / timeframeScores.length;
          const consistency = timeframeScores.every(
            (score) => Math.abs(score - avgScore) <= 10
          );
          if (consistency) {
            qualityScore += 20;
            reasons.push("Consistent across timeframes");
          } else {
            qualityScore += 10;
          }
        }

        return {
          signal,
          qualityScore,
          reasons,
        };
      });

      // 🎯 SELECT BEST SIGNAL: Highest quality score
      const bestSignal = scoredSignals.reduce((best, current) =>
        current.qualityScore > best.qualityScore ? current : best
      );

      setRecommendedSignal(bestSignal.signal);

      // 🔔 TOAST NOTIFICATION: Inform user of AI recommendation
      toast({
        title: "AI Analysis Complete",
        description: `${bestSignal.signal.ticker} recommended based on ${bestSignal.reasons.length} quality factors`,
      });
    } catch (error) {
      console.error("Error in AI recommendation analysis:", error);
    }
  };

  // 🔧 SIGNAL SELECTION: Handle adding signals with validation
  const handleAddSignal = (signal: Signal) => {
    if (selectedSignals.length >= maxSignals) {
      toast({
        title: "Maximum Signals Reached",
        description: `You can compare up to ${maxSignals} signals at once`,
        variant: "destructive",
      });
      return;
    }

    if (selectedSignals.some((s) => s.ticker === signal.ticker)) {
      toast({
        title: "Signal Already Selected",
        description: `${signal.ticker} is already in the comparison`,
        variant: "destructive",
      });
      return;
    }

    onAddSignal(signal);
  };

  // 🎯 AVAILABLE SIGNALS: Filter out already selected signals
  const availableSignals = signals.filter(
    (signal) =>
      !selectedSignals.some((selected) => selected.ticker === signal.ticker)
  );

  return (
    <div className="space-y-6">
      {/* 🔧 HEADER: Comparison tool header with status */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Signal Quality Comparison
          </h2>
          <p className="text-slate-400">
            Compare up to {maxSignals} signals side-by-side with AI-powered
            quality analysis
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="border-slate-500 text-slate-300">
            {selectedSignals.length}/{maxSignals} Selected
          </Badge>
          {showQualityAnalysis && (
            <Badge className="bg-emerald-600 text-white">
              <Zap className="h-3 w-3 mr-1" />
              AI Analysis Active
            </Badge>
          )}
        </div>
      </div>

      {/* 🚀 COMPARISON GRID: Side-by-side signal comparison */}
      <div
        className={`grid gap-6 ${
          maxSignals === 2
            ? "grid-cols-1 lg:grid-cols-2"
            : maxSignals === 3
            ? "grid-cols-1 lg:grid-cols-3"
            : "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
        }`}
      >
        {Array.from({ length: maxSignals }, (_, index) => (
          <ComparisonSlot
            key={index}
            signal={selectedSignals[index] || null}
            onRemove={() =>
              selectedSignals[index] && onRemoveSignal(selectedSignals[index])
            }
            onViewDeepDive={onViewDeepDive}
            slotIndex={index}
            isRecommended={
              recommendedSignal?.ticker === selectedSignals[index]?.ticker
            }
          />
        ))}
      </div>

      {/* 🎯 QUALITY ANALYZER: Show detailed comparison when 2+ signals selected */}
      {showQualityAnalysis && selectedSignals.length >= 2 && (
        <QualityAnalyzer
          signals={selectedSignals}
          recommendedSignal={recommendedSignal}
        />
      )}

      {/* 🔧 SIGNAL SELECTOR: Available signals to add to comparison */}
      {selectedSignals.length < maxSignals && availableSignals.length > 0 && (
        <Card className="bg-slate-800/30 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Plus className="h-5 w-5 mr-2 text-emerald-400" />
              Add Signal to Comparison
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
              {availableSignals.slice(0, 12).map((signal) => (
                <Card
                  key={signal.ticker}
                  className="bg-slate-700/50 border-slate-600 hover:bg-slate-700 cursor-pointer transition-colors"
                  onClick={() => handleAddSignal(signal)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-white">{signal.ticker}</h4>
                      <Badge
                        className={`${
                          signal.finalScore && signal.finalScore >= 80
                            ? "bg-emerald-600"
                            : "bg-slate-600"
                        } text-white`}
                      >
                        {signal.finalScore || 0}
                      </Badge>
                    </div>
                    <p className="text-slate-400 text-sm truncate">
                      {signal.name}
                    </p>
                    <p className="text-slate-500 text-xs">{signal.sector}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 🔔 EMPTY STATE: Show when no signals available */}
      {selectedSignals.length === 0 && (
        <Card className="bg-slate-800/30 border-slate-700">
          <CardContent className="text-center py-12">
            <BarChart3 className="h-16 w-16 mx-auto mb-4 text-slate-500" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Start Your Comparison
            </h3>
            <p className="text-slate-400 mb-6">
              Select 2-3 signals to compare their quality, risk-reward ratios,
              and get AI recommendations
            </p>
            {availableSignals.length === 0 && (
              <div className="bg-amber-600/20 border border-amber-600/30 rounded-lg p-4">
                <AlertCircle className="h-5 w-5 mx-auto mb-2 text-amber-400" />
                <p className="text-amber-300 text-sm">
                  No signals available for comparison. Please refresh the
                  signals list.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SignalComparison;
