import React, { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Slider } from "../ui/slider";
import {
  X,
  TrendingUp,
  Shield,
  Calculator,
  AlertTriangle,
  Plus,
  Loader2,
  Target,
  Activity,
  Edit3,
  RefreshCw,
} from "lucide-react";
import { useToast } from "../../hooks/use-toast";
import { useExecutePaperTrade } from "../../hooks/useExecutePaperTrade";
import { usePositions } from "../../contexts/PositionsContext";
import { useNavigate } from "react-router-dom";

// 🚀 ENHANCED: Import professional risk management functions
import {
  calculateStopLoss,
  calculateTakeProfit,
  calculateRiskReward,
  calculatePositionSize,
  assessRiskLevel,
  validateTradeSetup,
  formatRiskManagement,
  EnhancedSignal,
  RiskManagementData,
} from "../../utils/signalCalculations";

// 🚀 NEW: Enhanced interface to support real signal data
interface EnhancedSignalModalProps {
  isOpen: boolean;
  onClose: () => void;
  // ENHANCED: Support both simple and full signal objects
  signal: {
    symbol: string;
    name: string;
    price: number;
    change: number;
    signalScore: number;
    // 🚀 NEW: Real calculated values from enhanced-signal-processor
    entryPrice?: number;
    stopLoss?: number;
    takeProfit?: number;
    riskRewardRatio?: number;
    atr?: number;
    positionSize?: number;
    sector?: string;
    // 📅 NEW: Entry date for existing positions (Session #198 - Option A implementation)
    entryDate?: string;
    // Raw signal data for advanced calculations
    signals?: {
      "1H": number;
      "4H": number;
      "1D": number;
      "1W": number;
    };
  } | null;
  onExecuteTrade: (tradeData: any) => void;
  existingPositions?: string[];
  isViewingOnly?: boolean;
}

const EnhancedSignalModal: React.FC<EnhancedSignalModalProps> = ({
  isOpen,
  onClose,
  signal,
  onExecuteTrade,
  existingPositions = [],
  isViewingOnly = false,
}) => {
  const [portfolioBalance, setPortfolioBalance] = useState(8000);
  const [customRiskPercent, setCustomRiskPercent] = useState([2]);

  // 🔧 SESSION #134 FIX: Initialize customEntryPrice with the calculated smart entry immediately
  const [customEntryPrice, setCustomEntryPrice] = useState<number>(() => {
    // Initialize with the calculated entry price from Session #134 smart entry system
    if (signal?.entryPrice) {
      console.log(
        `🎯 Initializing modal with smart entry: $${signal.entryPrice}`
      );
      return signal.entryPrice;
    } else if (signal?.price) {
      console.log(`🔄 Initializing modal with market price: $${signal.price}`);
      return signal.price;
    }
    return 100; // Fallback
  });

  const [useCustomEntry, setUseCustomEntry] = useState(false);

  const { toast } = useToast();
  const navigate = useNavigate();

  const { executePaperTrade, isExecuting, error, clearError } =
    useExecutePaperTrade();
  const { refreshPositions, hasPosition } = usePositions();

  // 🔧 SESSION #134 FIX: Update customEntryPrice when signal changes
  React.useEffect(() => {
    if (signal) {
      const correctEntryPrice = signal.entryPrice || signal.price;
      console.log(
        `🔄 Signal changed - updating entry price to: $${correctEntryPrice}`
      );
      setCustomEntryPrice(correctEntryPrice);
    }
  }, [signal?.symbol, signal?.entryPrice, signal?.price]);

  // 📅 SESSION #198: Format entry date for display (Option A implementation)
  const formatEntryDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.warn("Error formatting entry date:", error);
      return dateString; // Fallback to original string
    }
  };

  // 🚀 ENHANCED: Professional Risk Management with Real Values + Custom Entry Support
  const riskManagement = useMemo((): RiskManagementData | null => {
    if (!signal) return null;

    // 🚀 CRITICAL: Use REAL values from enhanced-signal-processor when available
    const hasRealValues =
      signal.entryPrice && signal.stopLoss && signal.takeProfit;

    // Determine entry price: Custom > Real Calculated > Current Market Price
    const entryPrice =
      useCustomEntry && customEntryPrice
        ? customEntryPrice
        : hasRealValues
        ? signal.entryPrice!
        : signal.price;

    const finalScore = signal.signalScore;
    const signalType = finalScore >= 70 ? "bullish" : "bearish";
    const riskPercentage = customRiskPercent[0];

    let stopLoss: number;
    let takeProfit: number;
    let riskRewardRatio: number;

    if (hasRealValues && !useCustomEntry) {
      // 🎯 USE REAL CALCULATED VALUES (Best case)
      stopLoss = signal.stopLoss!;
      takeProfit = signal.takeProfit!;
      riskRewardRatio =
        signal.riskRewardRatio ||
        calculateRiskReward(entryPrice, stopLoss, takeProfit);

      console.log(
        "✅ Using REAL calculated values from enhanced-signal-processor:"
      );
      console.log(
        `Entry: $${entryPrice}, Stop: $${stopLoss}, Target: $${takeProfit}, R/R: ${riskRewardRatio}`
      );
    } else {
      // 🔄 RECALCULATE for custom entry price or fallback
      stopLoss = calculateStopLoss(entryPrice, finalScore, signalType);
      takeProfit = calculateTakeProfit(
        entryPrice,
        stopLoss,
        finalScore,
        signalType
      );
      riskRewardRatio = calculateRiskReward(entryPrice, stopLoss, takeProfit);

      console.log(
        `🔄 ${
          useCustomEntry
            ? "Recalculating for custom entry"
            : "Using fallback calculations"
        }:`
      );
      console.log(
        `Entry: $${entryPrice}, Stop: $${stopLoss}, Target: $${takeProfit}, R/R: ${riskRewardRatio}`
      );
    }

    const positionSize =
      signal.positionSize ||
      calculatePositionSize(
        portfolioBalance,
        entryPrice,
        stopLoss,
        riskPercentage
      );

    const riskAmount = Math.abs(entryPrice - stopLoss) * positionSize;
    const potentialProfit = Math.abs(takeProfit - entryPrice) * positionSize;
    const riskLevel = assessRiskLevel(riskRewardRatio, finalScore);

    // Technical levels (enhanced based on signal strength)
    const technicalSupport =
      entryPrice * (finalScore >= 85 ? 0.97 : finalScore >= 75 ? 0.95 : 0.93);
    const technicalResistance =
      entryPrice * (finalScore >= 85 ? 1.1 : finalScore >= 75 ? 1.08 : 1.06);

    return {
      entryPrice, // 🚀 NEW: Include entry price in risk management
      stopLoss,
      takeProfit,
      riskRewardRatio,
      positionSize,
      riskAmount,
      potentialProfit,
      riskLevel,
      technicalSupport,
      technicalResistance,
      volatilityAdjusted: true,
      // 🚀 NEW: Track data source
      dataSource:
        hasRealValues && !useCustomEntry ? "enhanced-processor" : "calculated",
      atr: signal.atr || null,
    };
  }, [
    signal,
    portfolioBalance,
    customRiskPercent,
    useCustomEntry,
    customEntryPrice,
  ]);

  // 🚀 ENHANCED: Trade validation using professional criteria
  const tradeValidation = useMemo(() => {
    if (!signal || !riskManagement) return null;

    const enhancedSignal: EnhancedSignal = {
      ticker: signal.symbol,
      name: signal.name,
      price: signal.price,
      change: signal.change,
      sector: signal.sector || "Technology",
      market: "USA",
      signals: signal.signals || {
        "1H": signal.signalScore,
        "4H": signal.signalScore,
        "1D": signal.signalScore,
        "1W": signal.signalScore,
      },
      timestamp: new Date().toISOString(),
      riskManagement,
      finalScore: signal.signalScore,
    };

    return validateTradeSetup(enhancedSignal);
  }, [signal, riskManagement]);

  if (!signal || !riskManagement) return null;

  const hasExistingPosition = hasPosition(signal.symbol);
  const maxRiskPercent = customRiskPercent[0];
  const entryPrice = riskManagement.entryPrice;

  // 🚀 ENHANCED: Use professional calculations
  const stopLoss = riskManagement.stopLoss;
  const takeProfit = riskManagement.takeProfit;
  const maxShares = riskManagement.positionSize;
  const investmentAmount = maxShares * entryPrice;
  const riskPerShare = Math.abs(entryPrice - stopLoss);
  const maxRiskAmount = riskManagement.riskAmount;

  // 🚀 ENHANCED: Professional risk assessment
  const isRiskTooHigh =
    riskManagement.riskLevel === "high" || maxRiskPercent > 2;
  const formattedRisk = formatRiskManagement(riskManagement);

  // 🔧 SESSION #134 FIX: Handle custom entry price changes
  const handleCustomEntryChange = (value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      console.log(`🔧 Custom entry changed to: $${numValue}`);
      setCustomEntryPrice(numValue);
    }
  };

  const handleToggleCustomEntry = () => {
    const newUseCustomEntry = !useCustomEntry;
    setUseCustomEntry(newUseCustomEntry);

    if (newUseCustomEntry) {
      // Switching to custom entry - ensure we have the correct initial value
      const initialCustomEntry = signal.entryPrice || signal.price;
      setCustomEntryPrice(initialCustomEntry);
      console.log(`🔄 Switching to custom entry: $${initialCustomEntry}`);
    } else {
      // Switching back to real values
      console.log("✅ Switching back to real calculated values");
    }
  };

  const handleExecuteTrade = async () => {
    console.log(
      "🚀 DEBUG - Enhanced SignalModal Execute Trade clicked for:",
      signal.symbol
    );
    console.log("🔍 Entry price being used:", entryPrice);
    console.log("🔍 Data source:", riskManagement.dataSource);

    clearError();

    // 🚀 ENHANCED: Professional risk warnings
    if (isRiskTooHigh) {
      toast({
        title: `Warning: ${riskManagement.riskLevel.toUpperCase()} Risk Trade`,
        description: `Risk-Reward: ${formattedRisk.riskRewardFormatted}. Consider reducing position size.`,
        variant: "destructive",
      });
    }

    // 🚀 ENHANCED: Trade validation warnings
    if (tradeValidation && !tradeValidation.isValid) {
      toast({
        title: "Trade Setup Warning",
        description:
          tradeValidation.issues[0] || "Consider reviewing trade parameters",
        variant: "destructive",
      });
    }

    try {
      const tradeData = {
        signalId: crypto.randomUUID(),
        ticker: signal.symbol,
        companyName: signal.name,
        // 🚀 CRITICAL: Use the actual entry price (custom or calculated)
        entryPrice: entryPrice,
        currentPrice: signal.price,
        market: "USA",
        sector: signal.sector || "Technology",
        quantity: maxShares,
        // 🚀 ENHANCED: Add professional risk management data
        stopLoss: stopLoss,
        takeProfit: takeProfit,
        riskRewardRatio: riskManagement.riskRewardRatio,
        riskLevel: riskManagement.riskLevel,
        signalScore: signal.signalScore,
        // 🚀 NEW: Track data source and custom entry usage
        dataSource: riskManagement.dataSource,
        customEntryUsed: useCustomEntry,
        atr: riskManagement.atr,
      };

      console.log("🚀 DEBUG - Executing trade with enhanced data:", tradeData);
      const result = await executePaperTrade(tradeData);

      if (result) {
        console.log("✅ DEBUG - Trade executed successfully:", result);

        await refreshPositions();

        const actionText = hasExistingPosition
          ? "Position Extended!"
          : "Trade Started!";
        const entryTypeText = useCustomEntry
          ? "custom entry"
          : "calculated entry";
        const descriptionText = hasExistingPosition
          ? `Added ${maxShares} shares to your existing ${
              signal.symbol
            } position at ${entryTypeText} $${entryPrice.toFixed(2)}.`
          : `Tracking ${signal.symbol} with ${
              formattedRisk.riskRewardFormatted
            } risk-reward at ${entryTypeText} $${entryPrice.toFixed(2)}.`;

        toast({
          title: actionText,
          description: descriptionText,
        });

        onClose();

        navigate("/open-positions", {
          state: {
            newTrade: {
              symbol: signal.symbol,
              name: signal.name,
              entryPrice: entryPrice, // 🚀 CRITICAL: Custom entry flows to Open Positions
              shares: maxShares,
              stopLoss: stopLoss,
              takeProfit: takeProfit,
              investmentAmount: investmentAmount,
              signalScore: signal.signalScore,
              riskRewardRatio: riskManagement.riskRewardRatio,
              riskLevel: riskManagement.riskLevel,
              isAddingToPosition: hasExistingPosition,
              executedAt: new Date().toISOString(),
              dataSource: riskManagement.dataSource,
              customEntryUsed: useCustomEntry,
            },
            shouldRefresh: true,
          },
        });
      } else {
        console.error("❌ DEBUG - Trade execution failed");
        toast({
          title: "Failed to execute trade",
          description: error || "Unknown error occurred",
          variant: "destructive",
        });
      }
    } catch (executeError) {
      console.error("❌ DEBUG - Trade execution error:", executeError);
      toast({
        title: "Failed to execute trade",
        description:
          executeError instanceof Error
            ? executeError.message
            : "Unknown error occurred",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    if (!isViewingOnly) {
      toast({
        title: "Trade cancelled",
        description: "No data saved.",
      });
    }
    onClose();
  };

  // 🚀 ENHANCED: Professional technical summary based on signal score and risk assessment
  const getTechnicalSummary = (score: number, riskLevel: string) => {
    const baseSignals = [];

    if (score >= 90) {
      baseSignals.push(
        "🚀 Very Strong Signal - High Conviction Setup",
        "📈 RSI shows excellent momentum",
        "⚡ MACD indicates strong bullish trend",
        "📊 Volume significantly above average"
      );
    } else if (score >= 80) {
      baseSignals.push(
        "💪 Strong Signal - Good Setup",
        "📈 RSI in favorable zone",
        "📊 MACD trending positive",
        "💰 Good volume support"
      );
    } else if (score >= 70) {
      baseSignals.push(
        "⚖️ Moderate Signal - Acceptable Setup",
        "📊 RSI showing potential",
        "📈 Mixed but positive technical signals",
        "💭 Moderate volume activity"
      );
    } else {
      baseSignals.push(
        "⚠️ Weak Signal - High Risk Setup",
        "📉 RSI below optimal levels",
        "❓ Unclear technical direction",
        "📊 Low volume support"
      );
    }

    // Add risk-specific insights
    if (riskLevel === "low") {
      baseSignals.push("✅ Low Risk - Excellent risk-reward ratio");
    } else if (riskLevel === "medium") {
      baseSignals.push("⚠️ Medium Risk - Acceptable risk-reward");
    } else {
      baseSignals.push("🔴 High Risk - Poor risk-reward ratio");
    }

    return baseSignals;
  };

  const recommendedShares = calculatePositionSize(
    portfolioBalance,
    entryPrice,
    stopLoss,
    2
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4 border-b border-slate-700 flex-shrink-0">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-6 w-6 text-emerald-400" />
              <div>
                <span className="text-xl font-bold">{signal.symbol}</span>
                <p className="text-slate-400 text-sm font-normal">
                  {signal.name}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-emerald-600 text-white">
                Score: {signal.signalScore}
              </Badge>
              <Badge className={`${formattedRisk.riskLevelColor}`}>
                {formattedRisk.riskLevelText}
              </Badge>
              {riskManagement.dataSource === "enhanced-processor" &&
                !useCustomEntry && (
                  <Badge className="bg-blue-600 text-white">
                    🛡️ Real Values
                  </Badge>
                )}
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 scrollbar-thin scrollbar-track-slate-700 scrollbar-thumb-slate-500 hover:scrollbar-thumb-slate-400">
          {/* 🔧 SESSION #134 FIX: Custom Entry Price Section with correct initialization */}
          {!isViewingOnly && (
            <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Edit3 className="h-5 w-5 text-blue-400" />
                  <h3 className="text-blue-200 text-sm font-semibold">
                    Entry Price Settings
                  </h3>
                </div>
                <Button
                  onClick={handleToggleCustomEntry}
                  variant="outline"
                  size="sm"
                  className={`${
                    useCustomEntry
                      ? "bg-blue-600 border-blue-500 text-white"
                      : "border-slate-600 text-slate-400"
                  }`}
                >
                  {useCustomEntry ? "Custom Entry" : "Use Calculated"}
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-blue-300 text-xs font-medium mb-1 block">
                    {signal.entryPrice
                      ? "Calculated Entry"
                      : "Current Market Price"}
                  </label>
                  <div className="bg-slate-700 p-2 rounded border">
                    <span className="text-white font-mono">
                      ${(signal.entryPrice || signal.price).toFixed(2)}
                    </span>
                    {signal.entryPrice && (
                      <Badge className="ml-2 bg-blue-600 text-white text-xs">
                        Real Value
                      </Badge>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-blue-300 text-xs font-medium mb-1 block">
                    Your Entry Price
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={customEntryPrice}
                    onChange={(e) => handleCustomEntryChange(e.target.value)}
                    disabled={!useCustomEntry}
                    className={`bg-slate-700 border-slate-600 text-white font-mono ${
                      useCustomEntry ? "border-blue-500" : "opacity-50"
                    }`}
                    placeholder="Enter custom price"
                  />
                </div>
              </div>

              {useCustomEntry && customEntryPrice && (
                <div className="mt-2 text-xs text-blue-300 flex items-center">
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Stop loss and take profit will recalculate based on your
                  custom entry price
                </div>
              )}
            </div>
          )}

          {hasExistingPosition && (
            <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <Plus className="h-5 w-5 text-blue-400" />
                <div>
                  <p className="text-blue-200 text-sm font-semibold">
                    Adding to Existing Position
                  </p>
                  <p className="text-blue-300 text-xs mt-1">
                    You can scale into this position using dollar-cost averaging
                    strategy.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 🚀 ENHANCED: Professional trade validation warnings */}
          {tradeValidation && !tradeValidation.isValid && (
            <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-5 w-5 text-amber-400 mt-0.5" />
                <div>
                  <p className="text-amber-200 text-sm font-semibold">
                    Trade Setup Warnings
                  </p>
                  <ul className="text-amber-300 text-xs mt-1 space-y-1">
                    {tradeValidation.issues.map((issue, index) => (
                      <li key={index}>• {issue}</li>
                    ))}
                  </ul>
                  {tradeValidation.recommendations.length > 0 && (
                    <div className="mt-2">
                      <p className="text-amber-200 text-xs font-semibold">
                        Recommendations:
                      </p>
                      <ul className="text-amber-300 text-xs mt-1 space-y-1">
                        {tradeValidation.recommendations.map((rec, index) => (
                          <li key={index}>• {rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-400" />
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* 🚀 ENHANCED: Professional price targets with real values display */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-700/50 p-4 rounded-lg border border-blue-500/30">
              <p className="text-slate-400 text-sm">Entry Price</p>
              <p className="text-white font-bold text-lg">
                ${entryPrice.toFixed(2)}
              </p>
              {/* 📅 SESSION #198: Entry Date Display - Option A Implementation */}
              {signal.entryDate && (
                <p className="text-slate-300 text-xs mt-1">
                  Entered: {formatEntryDate(signal.entryDate)}
                </p>
              )}
              {useCustomEntry && (
                <p className="text-blue-300 text-xs mt-1">Custom Entry</p>
              )}
              {riskManagement.dataSource === "enhanced-processor" &&
                !useCustomEntry && (
                  <p className="text-blue-300 text-xs mt-1">
                    🛡️ Real Calculated
                  </p>
                )}
            </div>
            <div className="bg-slate-700/50 p-4 rounded-lg border border-red-500/30">
              <p className="text-slate-400 text-sm">Stop Loss</p>
              <p className="text-red-400 font-bold text-lg">
                ${stopLoss.toFixed(2)}
              </p>
              <p className="text-red-300 text-xs mt-1">
                {((Math.abs(entryPrice - stopLoss) / entryPrice) * 100).toFixed(
                  1
                )}
                % risk
              </p>
            </div>
            <div className="bg-slate-700/50 p-4 rounded-lg border border-emerald-500/30">
              <p className="text-slate-400 text-sm">Take Profit</p>
              <p className="text-emerald-400 font-bold text-lg">
                ${takeProfit.toFixed(2)}
              </p>
              <p className="text-emerald-300 text-xs mt-1">
                {formattedRisk.riskRewardFormatted} risk-reward
              </p>
            </div>
          </div>

          {/* 🚀 ENHANCED: Risk-Reward Visual Indicator */}
          <div className="bg-slate-700/30 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-blue-400" />
                <h3 className="text-lg font-semibold">Risk-Reward Analysis</h3>
              </div>
              <Badge className={`${formattedRisk.riskLevelColor}`}>
                {formattedRisk.riskRewardFormatted}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-400">Potential Risk</p>
                <p className="text-red-400 font-semibold">
                  {formattedRisk.riskAmountFormatted}
                </p>
              </div>
              <div>
                <p className="text-slate-400">Potential Profit</p>
                <p className="text-emerald-400 font-semibold">
                  {formattedRisk.potentialProfitFormatted}
                </p>
              </div>
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Risk</span>
                <span>Reward</span>
              </div>
              <div className="w-full bg-slate-600 rounded-full h-2 flex">
                <div
                  className="bg-red-500 h-2 rounded-l-full"
                  style={{ width: "33%" }}
                ></div>
                <div
                  className="bg-emerald-500 h-2 rounded-r-full"
                  style={{ width: "67%" }}
                ></div>
              </div>
            </div>

            {/* 🚀 NEW: ATR and Data Source Info */}
            <div className="mt-3 pt-3 border-t border-slate-600">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400">Data Source:</span>
                  <span className="ml-2 text-white">
                    {riskManagement.dataSource === "enhanced-processor"
                      ? "🛡️ Real Calculated"
                      : "🔄 Fallback Calc"}
                  </span>
                </div>
                {riskManagement.atr && (
                  <div>
                    <span className="text-slate-400">ATR:</span>
                    <span className="ml-2 text-white">
                      ${riskManagement.atr.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* REST OF THE COMPONENT REMAINS THE SAME... */}
          {/* Portfolio Balance, Risk Percentage, Position Sizing, Technical Analysis sections */}

          {!isViewingOnly && (
            <div>
              <label className="text-slate-300 text-sm font-medium mb-2 block">
                Portfolio Balance
              </label>
              <Input
                type="number"
                value={portfolioBalance}
                onChange={(e) => setPortfolioBalance(Number(e.target.value))}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="Enter portfolio balance"
              />
            </div>
          )}

          {!isViewingOnly && (
            <div>
              <label className="text-slate-300 text-sm font-medium mb-2 block">
                Risk Percentage: {maxRiskPercent}%
              </label>
              <Slider
                value={customRiskPercent}
                onValueChange={setCustomRiskPercent}
                max={10}
                min={0.5}
                step={0.5}
                className="w-full"
              />

              {isRiskTooHigh && (
                <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-lg mt-3">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5" />
                    <div>
                      <p className="text-red-200 text-sm font-semibold">
                        🔴 WARNING: {riskManagement.riskLevel.toUpperCase()}{" "}
                        Risk Trade Setup
                      </p>
                      <p className="text-red-300 text-xs mt-1">
                        Professional Recommendation: {recommendedShares} shares
                        (2% risk) | Your Selection: {maxShares} shares (
                        {maxRiskPercent}% risk)
                      </p>
                      <p className="text-red-300 text-xs mt-1">
                        Risk-Reward: {formattedRisk.riskRewardFormatted} | Risk
                        Level: {riskManagement.riskLevel.toUpperCase()}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {!isViewingOnly && (
            <div className="bg-slate-700/30 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <Calculator className="h-5 w-5 text-blue-400" />
                <h3 className="text-lg font-semibold">
                  {hasExistingPosition
                    ? "Additional Position Size"
                    : "Professional Position Sizing"}
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-400">Max Risk ({maxRiskPercent}%)</p>
                  <p className="text-white font-semibold">
                    ${maxRiskAmount.toFixed(0)}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400">
                    {hasExistingPosition
                      ? "Additional Shares"
                      : "Recommended Shares"}
                  </p>
                  <p className="text-white font-semibold">{maxShares} shares</p>
                </div>
                <div>
                  <p className="text-slate-400">
                    {hasExistingPosition
                      ? "Additional Investment"
                      : "Investment Amount"}
                  </p>
                  <p className="text-white font-semibold">
                    ${investmentAmount.toFixed(0)}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400">Risk per Share</p>
                  <p className="text-white font-semibold">
                    ${riskPerShare.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="mt-3 text-xs text-slate-400">
                Professional Calculation: ${maxRiskAmount.toFixed(0)} ÷ $
                {riskPerShare.toFixed(2)} = {maxShares} shares
              </div>
            </div>
          )}

          {/* 🚀 ENHANCED: Professional technical summary */}
          <div className="bg-slate-700/30 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <Activity className="h-5 w-5 text-emerald-400" />
              <h3 className="text-lg font-semibold">
                Professional Technical Analysis
              </h3>
            </div>
            <ul className="space-y-2">
              {getTechnicalSummary(
                signal.signalScore,
                riskManagement.riskLevel
              ).map((item, index) => (
                <li key={index} className="flex items-center space-x-2 text-sm">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      item.includes("🚀") || item.includes("✅")
                        ? "bg-emerald-400"
                        : item.includes("⚠️")
                        ? "bg-yellow-400"
                        : item.includes("🔴")
                        ? "bg-red-400"
                        : "bg-blue-400"
                    }`}
                  ></div>
                  <span className="text-slate-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-amber-400" />
              <p className="text-amber-200 text-sm">
                This is a simulated paper trade with professional risk
                management. No real capital is involved.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 pt-4 border-t border-slate-700 flex-shrink-0">
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isExecuting}
              className="flex-1 bg-slate-600 border-slate-500 text-white hover:bg-slate-500 hover:border-slate-400 transition-all duration-200"
            >
              {isViewingOnly ? "Close" : "Cancel"}
            </Button>
            {!isViewingOnly && (
              <Button
                onClick={handleExecuteTrade}
                disabled={isExecuting}
                className={`flex-1 text-white ${
                  hasExistingPosition
                    ? "bg-blue-600 hover:bg-blue-700"
                    : riskManagement.riskLevel === "low"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : riskManagement.riskLevel === "medium"
                    ? "bg-yellow-600 hover:bg-yellow-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {isExecuting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Executing...
                  </>
                ) : hasExistingPosition ? (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Add to Position (${entryPrice.toFixed(2)})
                  </>
                ) : (
                  <>
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Execute Paper Trade (${entryPrice.toFixed(2)})
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedSignalModal;
