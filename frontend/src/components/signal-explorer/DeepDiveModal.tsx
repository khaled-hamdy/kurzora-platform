// src/components/signal-explorer/DeepDiveModal.tsx
// 🎯 SESSION #321: Enhanced Deep Dive Modal with Comparison Mode Support
// 🏗️ BUILDS ON: Session #320 Deep Dive Modal System (PRESERVED EXACTLY)
// 🔧 PURPOSE: Add comparison mode while maintaining all existing functionality
// 🛡️ PRESERVATION: All Session #320 functionality preserved exactly
// 📊 DATA SOURCE: Compatible with existing Signal interface and patterns

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  X,
  TrendingUp,
  BarChart3,
  Activity,
  Clock,
  Target,
  AlertCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  Compare,
  Crown,
  ArrowLeftRight,
} from "lucide-react";
import { useToast } from "../../hooks/use-toast";
import ChartIntegration from "./ChartIntegration";
import TechnicalBreakdown from "./TechnicalBreakdown";
import SignalComparison from "./SignalComparison";
import QualityAnalyzer from "./QualityAnalyzer";

// 🎯 SESSION #320: Original Signal interface (PRESERVED EXACTLY)
interface DeepDiveSignal {
  symbol: string;
  name: string;
  price: number;
  change: number;
  signalScore: number;
  entryPrice?: number;
  stopLoss?: number;
  takeProfit?: number;
  riskRewardRatio?: number;
  atr?: number;
  sector?: string;
  signals?: {
    "1H": number;
    "4H": number;
    "1D": number;
    "1W": number;
  };
}

// 🚀 SESSION #321: Enhanced props with comparison mode support
interface DeepDiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  signal: DeepDiveSignal | null;
  onExecuteTrade?: () => void;
  // 🔧 NEW SESSION #321 PROPS: Comparison mode support
  comparisonMode?: boolean;
  comparisonSignals?: DeepDiveSignal[];
  availableSignals?: DeepDiveSignal[];
  onAddToComparison?: (signal: DeepDiveSignal) => void;
  onRemoveFromComparison?: (signal: DeepDiveSignal) => void;
}

// 🎯 SESSION #320: Professional timeframe analysis component (PRESERVED EXACTLY)
const TimeframeAnalysis: React.FC<{
  signals?: { "1H": number; "4H": number; "1D": number; "1W": number };
}> = ({ signals }) => {
  if (!signals) return null;

  const timeframes = [
    { key: "1H", label: "1 Hour", score: signals["1H"] },
    { key: "4H", label: "4 Hours", score: signals["4H"] },
    { key: "1D", label: "1 Day", score: signals["1D"] },
    { key: "1W", label: "1 Week", score: signals["1W"] },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 70) return "bg-yellow-500";
    if (score >= 60) return "bg-orange-500";
    return "bg-red-500";
  };

  const getScoreText = (score: number) => {
    if (score >= 80) return "Strong";
    if (score >= 70) return "Moderate";
    if (score >= 60) return "Weak";
    return "Caution";
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white flex items-center">
        <Clock className="h-5 w-5 mr-2 text-blue-400" />
        Multi-Timeframe Analysis
      </h3>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {timeframes.map((tf) => (
          <div
            key={tf.key}
            className="bg-slate-700/50 p-3 rounded-lg border border-slate-600"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-300 text-sm font-medium">
                {tf.label}
              </span>
              <Badge
                className={`${getScoreColor(tf.score)} text-white text-xs`}
              >
                {tf.score}
              </Badge>
            </div>
            <div className="text-xs text-slate-400">
              {getScoreText(tf.score)}
            </div>
            <div className="w-full bg-slate-600 rounded-full h-1.5 mt-2">
              <div
                className={`h-1.5 rounded-full ${getScoreColor(tf.score)}`}
                style={{ width: `${tf.score}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 🎯 SESSION #320: Signal strength indicator component (PRESERVED EXACTLY)
const SignalStrengthIndicator: React.FC<{ score: number; title: string }> = ({
  score,
  title,
}) => {
  const getStrengthLevel = (score: number) => {
    if (score >= 90)
      return {
        label: "Exceptional",
        color: "text-emerald-400",
        bg: "bg-emerald-500",
      };
    if (score >= 80)
      return {
        label: "Strong",
        color: "text-emerald-400",
        bg: "bg-emerald-500",
      };
    if (score >= 70)
      return {
        label: "Moderate",
        color: "text-yellow-400",
        bg: "bg-yellow-500",
      };
    if (score >= 60)
      return { label: "Weak", color: "text-orange-400", bg: "bg-orange-500" };
    return { label: "Caution", color: "text-red-400", bg: "bg-red-500" };
  };

  const strength = getStrengthLevel(score);

  return (
    <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-semibold">{title}</h3>
        <Badge className={`${strength.bg} text-white`}>{score}/100</Badge>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-slate-300 text-sm">Signal Strength</span>
          <span className={`text-sm font-medium ${strength.color}`}>
            {strength.label}
          </span>
        </div>

        <div className="w-full bg-slate-600 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${strength.bg}`}
            style={{ width: `${score}%` }}
          ></div>
        </div>

        <div className="text-xs text-slate-400">
          {score >= 80
            ? "High probability setup with strong confirmation"
            : score >= 70
            ? "Moderate setup with acceptable risk-reward"
            : score >= 60
            ? "Weak setup requiring careful consideration"
            : "High risk setup - proceed with caution"}
        </div>
      </div>
    </div>
  );
};

// 🎯 SESSION #320: Price levels analysis component (PRESERVED EXACTLY)
const PriceLevelsAnalysis: React.FC<{ signal: DeepDiveSignal }> = ({
  signal,
}) => {
  const currentPrice = signal.price;
  const entryPrice = signal.entryPrice || currentPrice;
  const stopLoss = signal.stopLoss;
  const takeProfit = signal.takeProfit;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white flex items-center">
        <Target className="h-5 w-5 mr-2 text-emerald-400" />
        Price Level Analysis
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-700/50 p-4 rounded-lg border border-blue-500/30">
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-300 text-sm">Current Price</span>
            <span className="text-white font-bold">
              ${currentPrice.toFixed(2)}
            </span>
          </div>
          <div className="text-xs text-slate-400">Market Price</div>
        </div>

        {entryPrice && (
          <div className="bg-slate-700/50 p-4 rounded-lg border border-emerald-500/30">
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-300 text-sm">Entry Price</span>
              <span className="text-emerald-400 font-bold">
                ${entryPrice.toFixed(2)}
              </span>
            </div>
            <div className="text-xs text-slate-400">
              {(((entryPrice - currentPrice) / currentPrice) * 100).toFixed(1)}%
              from current
            </div>
          </div>
        )}

        {stopLoss && (
          <div className="bg-slate-700/50 p-4 rounded-lg border border-red-500/30">
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-300 text-sm">Stop Loss</span>
              <span className="text-red-400 font-bold">
                ${stopLoss.toFixed(2)}
              </span>
            </div>
            <div className="text-xs text-slate-400">
              {(((stopLoss - currentPrice) / currentPrice) * 100).toFixed(1)}%
              risk
            </div>
          </div>
        )}
      </div>

      {takeProfit && signal.riskRewardRatio && (
        <div className="bg-slate-700/30 p-3 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-slate-300 text-sm">Take Profit Target</span>
            <div className="text-right">
              <div className="text-emerald-400 font-bold">
                ${takeProfit.toFixed(2)}
              </div>
              <div className="text-xs text-emerald-300">
                {signal.riskRewardRatio.toFixed(1)}:1 R/R
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 🚀 SESSION #321: Comparison mode header component
const ComparisonModeHeader: React.FC<{
  comparisonSignals: DeepDiveSignal[];
  onRemoveFromComparison: (signal: DeepDiveSignal) => void;
}> = ({ comparisonSignals, onRemoveFromComparison }) => {
  return (
    <div className="bg-gradient-to-r from-blue-900/20 to-emerald-900/20 p-4 rounded-lg border border-blue-500/30 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-semibold flex items-center">
          <Compare className="h-5 w-5 mr-2 text-blue-400" />
          Comparison Mode Active
        </h3>
        <Badge className="bg-blue-600 text-white">
          {comparisonSignals.length} Signals
        </Badge>
      </div>

      <div className="flex flex-wrap gap-2">
        {comparisonSignals.map((signal) => (
          <Badge
            key={signal.symbol}
            className="bg-slate-700 text-white border border-slate-600 pr-1"
          >
            <span className="mr-2">{signal.symbol}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemoveFromComparison(signal)}
              className="h-4 w-4 p-0 hover:bg-red-600/20"
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </div>
    </div>
  );
};

// 🎯 SESSION #321: Enhanced Deep Dive Modal with Comparison Mode Support
const DeepDiveModal: React.FC<DeepDiveModalProps> = ({
  isOpen,
  onClose,
  signal,
  onExecuteTrade,
  // 🔧 SESSION #321: New comparison mode props
  comparisonMode = false,
  comparisonSignals = [],
  availableSignals = [],
  onAddToComparison,
  onRemoveFromComparison,
}) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // 🎯 SESSION #320: Reset tab when modal opens with new signal (PRESERVED EXACTLY)
  useEffect(() => {
    if (isOpen && signal) {
      setActiveTab("overview");
    }
  }, [isOpen, signal?.symbol]);

  // 🚀 SESSION #321: Enhanced tab reset for comparison mode
  useEffect(() => {
    if (isOpen && comparisonMode && comparisonSignals.length >= 2) {
      setActiveTab("comparison");
    }
  }, [isOpen, comparisonMode, comparisonSignals.length]);

  // 🎯 SESSION #320: Handle execute trade (PRESERVED EXACTLY)
  const handleExecuteTrade = () => {
    if (onExecuteTrade) {
      onClose(); // Close analysis modal
      onExecuteTrade(); // Open trade execution modal
    } else {
      toast({
        title: "Trade Execution",
        description: "Trade execution functionality not available",
        variant: "destructive",
      });
    }
  };

  // 🚀 SESSION #321: Handle comparison mode operations
  const handleAddToComparison = (signalToAdd: DeepDiveSignal) => {
    if (onAddToComparison) {
      onAddToComparison(signalToAdd);
      toast({
        title: "Signal Added",
        description: `${signalToAdd.symbol} added to comparison`,
      });
    }
  };

  const handleRemoveFromComparison = (signalToRemove: DeepDiveSignal) => {
    if (onRemoveFromComparison) {
      onRemoveFromComparison(signalToRemove);
      toast({
        title: "Signal Removed",
        description: `${signalToRemove.symbol} removed from comparison`,
      });
    }
  };

  // 🔧 SESSION #321: Convert signal format for comparison components
  const convertToComparisonFormat = (signals: DeepDiveSignal[]) => {
    return signals.map((s) => ({
      ticker: s.symbol,
      name: s.name,
      current_price: s.price,
      price_change_percent: s.change,
      finalScore: s.signalScore,
      entryPrice: s.entryPrice,
      stopLoss: s.stopLoss,
      takeProfit: s.takeProfit,
      riskRewardRatio: s.riskRewardRatio,
      atr: s.atr,
      sector: s.sector,
      signals: s.signals,
      market: "usa",
      timestamp: new Date().toISOString(),
      hasEnhancedData: !!(s.entryPrice && s.stopLoss && s.takeProfit),
      dataSource: "enhanced-processor" as const,
    }));
  };

  // 🔧 SESSION #320: Return null if no signal in single mode (PRESERVED EXACTLY)
  if (!comparisonMode && !signal) return null;

  // 🚀 SESSION #321: Determine modal title based on mode
  const getModalTitle = () => {
    if (comparisonMode && comparisonSignals.length >= 2) {
      return "Signal Quality Comparison";
    }
    return signal ? signal.symbol : "Signal Analysis";
  };

  const getModalSubtitle = () => {
    if (comparisonMode && comparisonSignals.length >= 2) {
      return `Comparing ${comparisonSignals.length} signals with AI analysis`;
    }
    return signal ? signal.name : "";
  };

  // 🚀 SESSION #321: Enhanced tab list for comparison mode
  const getTabsList = () => {
    if (comparisonMode && comparisonSignals.length >= 2) {
      return (
        <TabsList className="grid w-full grid-cols-3 bg-slate-900 m-4 mb-0">
          <TabsTrigger
            value="comparison"
            className="data-[state=active]:bg-slate-700"
          >
            <Compare className="h-4 w-4 mr-2" />
            Comparison
          </TabsTrigger>
          <TabsTrigger
            value="quality"
            className="data-[state=active]:bg-slate-700"
          >
            <Crown className="h-4 w-4 mr-2" />
            Quality Analysis
          </TabsTrigger>
          <TabsTrigger
            value="advanced"
            className="data-[state=active]:bg-slate-700"
          >
            Advanced Analysis
          </TabsTrigger>
        </TabsList>
      );
    }

    // 🎯 SESSION #320: Original tabs for single signal mode (PRESERVED EXACTLY)
    return (
      <TabsList className="grid w-full grid-cols-4 bg-slate-900 m-4 mb-0">
        <TabsTrigger
          value="overview"
          className="data-[state=active]:bg-slate-700"
        >
          Overview
        </TabsTrigger>
        <TabsTrigger value="chart" className="data-[state=active]:bg-slate-700">
          Chart Analysis
        </TabsTrigger>
        <TabsTrigger
          value="technical"
          className="data-[state=active]:bg-slate-700"
        >
          Technical Details
        </TabsTrigger>
        <TabsTrigger
          value="advanced"
          className="data-[state=active]:bg-slate-700"
        >
          Advanced Analysis
        </TabsTrigger>
      </TabsList>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-6xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4 border-b border-slate-700 flex-shrink-0">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BarChart3 className="h-6 w-6 text-blue-400" />
              <div>
                <span className="text-xl font-bold">{getModalTitle()}</span>
                <p className="text-slate-400 text-sm font-normal">
                  {getModalSubtitle()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {comparisonMode ? (
                <Badge className="bg-blue-600 text-white">
                  <Compare className="h-3 w-3 mr-1" />
                  Comparison Mode
                </Badge>
              ) : (
                <Badge className="bg-blue-600 text-white">Deep Analysis</Badge>
              )}
              {signal && (
                <>
                  <Badge className="bg-emerald-600 text-white">
                    Score: {signal.signalScore}
                  </Badge>
                  {signal.sector && (
                    <Badge
                      variant="outline"
                      className="border-slate-500 text-slate-300"
                    >
                      {signal.sector}
                    </Badge>
                  )}
                </>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="h-full flex flex-col"
          >
            {getTabsList()}

            <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-thin scrollbar-track-slate-700 scrollbar-thumb-slate-500 hover:scrollbar-thumb-slate-400">
              {/* 🚀 SESSION #321: Comparison mode tabs */}
              {comparisonMode && comparisonSignals.length >= 2 && (
                <>
                  <TabsContent value="comparison" className="space-y-6 mt-0">
                    <ComparisonModeHeader
                      comparisonSignals={comparisonSignals}
                      onRemoveFromComparison={handleRemoveFromComparison}
                    />
                    <SignalComparison
                      signals={convertToComparisonFormat(availableSignals)}
                      selectedSignals={convertToComparisonFormat(
                        comparisonSignals
                      )}
                      onAddSignal={(signal) => {
                        const originalSignal = availableSignals.find(
                          (s) => s.symbol === signal.ticker
                        );
                        if (originalSignal)
                          handleAddToComparison(originalSignal);
                      }}
                      onRemoveSignal={(signal) => {
                        const originalSignal = comparisonSignals.find(
                          (s) => s.symbol === signal.ticker
                        );
                        if (originalSignal)
                          handleRemoveFromComparison(originalSignal);
                      }}
                      onViewDeepDive={(signal) => {
                        // Switch to single signal mode for deep dive
                        const originalSignal =
                          availableSignals.find(
                            (s) => s.symbol === signal.ticker
                          ) ||
                          comparisonSignals.find(
                            (s) => s.symbol === signal.ticker
                          );
                        if (originalSignal) {
                          // This would need to be handled by parent component
                          toast({
                            title: "Deep Dive",
                            description: `Opening detailed analysis for ${signal.ticker}`,
                          });
                        }
                      }}
                      maxSignals={3}
                    />
                  </TabsContent>

                  <TabsContent value="quality" className="mt-0">
                    <QualityAnalyzer
                      signals={convertToComparisonFormat(comparisonSignals)}
                      recommendedSignal={null} // Will be calculated internally
                    />
                  </TabsContent>
                </>
              )}

              {/* 🎯 SESSION #320: Original single signal tabs (PRESERVED EXACTLY) */}
              {!comparisonMode && signal && (
                <>
                  <TabsContent value="overview" className="space-y-6 mt-0">
                    <SignalStrengthIndicator
                      score={signal.signalScore}
                      title="Overall Signal Strength"
                    />

                    <PriceLevelsAnalysis signal={signal} />

                    <TimeframeAnalysis signals={signal.signals} />

                    {/* 🎯 SESSION #320: Quick actions for overview tab (PRESERVED EXACTLY) */}
                    <div className="bg-slate-700/20 p-4 rounded-lg border border-slate-600">
                      <h3 className="text-white font-semibold mb-3">
                        Quick Actions
                      </h3>
                      <div className="flex space-x-3">
                        <Button
                          onClick={() => setActiveTab("chart")}
                          variant="outline"
                          className="border-slate-500 text-slate-300 hover:bg-slate-600"
                        >
                          <BarChart3 className="h-4 w-4 mr-2" />
                          View Chart
                        </Button>
                        <Button
                          onClick={() => setActiveTab("technical")}
                          variant="outline"
                          className="border-slate-500 text-slate-300 hover:bg-slate-600"
                        >
                          <Activity className="h-4 w-4 mr-2" />
                          Technical Analysis
                        </Button>
                        {onExecuteTrade && (
                          <Button
                            onClick={handleExecuteTrade}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                          >
                            <TrendingUp className="h-4 w-4 mr-2" />
                            Execute Trade
                          </Button>
                        )}
                        {/* 🚀 SESSION #321: Add to comparison button */}
                        {onAddToComparison &&
                          !comparisonSignals.some(
                            (s) => s.symbol === signal.symbol
                          ) && (
                            <Button
                              onClick={() => handleAddToComparison(signal)}
                              variant="outline"
                              className="border-blue-500 text-blue-400 hover:bg-blue-600/10"
                            >
                              <ArrowLeftRight className="h-4 w-4 mr-2" />
                              Compare Signal
                            </Button>
                          )}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="chart" className="mt-0">
                    <ChartIntegration
                      symbol={signal.symbol}
                      currentPrice={signal.price}
                      entryPrice={signal.entryPrice}
                      stopLoss={signal.stopLoss}
                      takeProfit={signal.takeProfit}
                    />
                  </TabsContent>

                  <TabsContent value="technical" className="mt-0">
                    <TechnicalBreakdown
                      signal={signal}
                      signalScore={signal.signalScore}
                    />
                  </TabsContent>
                </>
              )}

              {/* 🎯 SESSION #320: Advanced analysis tab (PRESERVED EXACTLY) */}
              <TabsContent value="advanced" className="space-y-6 mt-0">
                <div className="bg-slate-700/30 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2 text-yellow-400" />
                    Advanced Analysis Features
                  </h3>
                  <div className="space-y-4 text-slate-300">
                    <div className="p-3 bg-slate-800/50 rounded border border-slate-600">
                      <h4 className="font-medium text-white mb-2">
                        AI-Powered Insights
                      </h4>
                      <p className="text-sm">
                        Advanced machine learning models analyze market
                        patterns, sentiment, and institutional flow to provide
                        deeper signal validation.
                      </p>
                    </div>
                    <div className="p-3 bg-slate-800/50 rounded border border-slate-600">
                      <h4 className="font-medium text-white mb-2">
                        Correlation Analysis
                      </h4>
                      <p className="text-sm">
                        Cross-market correlation studies help identify
                        supporting or conflicting signals across different asset
                        classes and timeframes.
                      </p>
                    </div>
                    <div className="p-3 bg-slate-800/50 rounded border border-slate-600">
                      <h4 className="font-medium text-white mb-2">
                        Risk Assessment Matrix
                      </h4>
                      <p className="text-sm">
                        Multi-dimensional risk evaluation considering
                        volatility, liquidity, market conditions, and portfolio
                        impact analysis.
                      </p>
                    </div>
                    {/* 🚀 SESSION #321: Enhanced comparison features in advanced tab */}
                    {comparisonMode && comparisonSignals.length >= 2 && (
                      <div className="p-3 bg-emerald-800/20 rounded border border-emerald-600/30">
                        <h4 className="font-medium text-emerald-400 mb-2">
                          Multi-Signal Quality Analysis
                        </h4>
                        <p className="text-sm">
                          Comparative analysis across {comparisonSignals.length}{" "}
                          signals using 28-indicator transparency system with
                          AI-powered recommendations based on risk-reward
                          optimization and timeframe consistency.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* 🎯 SESSION #320: Footer with actions (PRESERVED EXACTLY + SESSION #321 enhancements) */}
        <div className="p-6 pt-4 border-t border-slate-700 flex-shrink-0">
          <div className="flex justify-between items-center">
            <div className="text-sm text-slate-400">
              {comparisonMode && comparisonSignals.length >= 2
                ? `Comparing ${comparisonSignals.length} signals with AI analysis`
                : `Signal generated: ${new Date().toLocaleString()}`}
            </div>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="bg-slate-600 border-slate-500 text-white hover:bg-slate-500"
              >
                Close Analysis
              </Button>
              {/* 🎯 SESSION #320: Execute trade button (PRESERVED EXACTLY) */}
              {!comparisonMode && onExecuteTrade && signal && (
                <Button
                  onClick={handleExecuteTrade}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Execute Trade
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeepDiveModal;
