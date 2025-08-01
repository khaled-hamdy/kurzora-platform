import React from "react";
import { Button } from "../ui/button";
import { useLanguage } from "../../contexts/LanguageContext";
import { usePositions } from "../../contexts/PositionsContext";
import { useNavigate } from "react-router-dom";
// ✅ FIXED: Import centralized scoring function
import { calculateFinalScore } from "../../utils/signalCalculations";

interface Signal {
  ticker: string;
  name: string;
  // 🚀 FIXED: Updated to match actual database columns
  current_price: number; // Was: price
  price_change_percent: number; // Was: change
  signals: {
    "1H": number;
    "4H": number;
    "1D": number;
    "1W": number;
  };
  sector: string;
  market: string;
  timestamp: string;
  // NEW: Add status tracking fields
  status: "active" | "triggered" | "expired" | "cancelled";
  has_open_position: boolean;
  position_id?: string;
  executed_at?: string;
}

interface SignalTableProps {
  filteredSignals: Signal[];
  timeFilter: string;
  highlightedCategory: string | null;
  onViewSignal: (signal: Signal, timeframe: string) => void;
}

const SignalTable: React.FC<SignalTableProps> = ({
  filteredSignals,
  timeFilter,
  highlightedCategory,
  onViewSignal,
}) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const {
    hasPosition,
    isLoading: positionsLoading,
    existingPositions,
  } = usePositions();

  // Debug logging
  console.log("🔍 DEBUG - Current existingPositions:", existingPositions);
  console.log("🔍 DEBUG - positionsLoading:", positionsLoading);

  const timeframes = ["1H", "4H", "1D", "1W"];

  const getSignalColor = (score: number) => {
    if (score >= 90) return "text-white shadow-lg border border-green-400"; // Strong - Green
    if (score >= 80) return "text-white shadow-md border border-blue-300"; // Valid - Blue
    if (score >= 70) return "text-black shadow-sm border border-yellow-400"; // Weak - Yellow
    return "bg-gray-600 text-gray-400 opacity-50"; // Below threshold
  };

  const getSignalBackgroundColor = (score: number) => {
    if (score >= 90) return { backgroundColor: "hsl(118, 95.3%, 49.8%)" }; // Strong - Green
    if (score >= 80) return { backgroundColor: "hsl(208, 77.3%, 72.4%)" }; // Valid - Blue
    if (score >= 70) return { backgroundColor: "#F1C40F" }; // Weak - Yellow
    return { backgroundColor: "#6b7280" }; // Below threshold
  };

  const getSignalIcon = (score: number) => {
    if (score >= 90) return "💎";
    if (score >= 80) return "✅";
    if (score >= 70) return "⚠️";
    return "";
  };

  // Status badge with context-based position detection
  const getStatusBadge = (signal: Signal) => {
    const { status } = signal;
    const hasRealPosition = hasPosition(signal.ticker);

    if (hasRealPosition || status === "triggered") {
      return {
        text: "IN POSITION",
        className: "bg-blue-500 text-white",
        icon: "📈",
      };
    }

    switch (status) {
      case "active":
        return {
          text: "FRESH",
          className: "bg-emerald-500 text-white animate-pulse",
          icon: "🔥",
        };
      case "expired":
        return {
          text: "EXPIRED",
          className: "bg-slate-500 text-slate-300",
          icon: "⏰",
        };
      case "cancelled":
        return {
          text: "CANCELLED",
          className: "bg-red-500 text-white",
          icon: "❌",
        };
      default:
        return {
          text: "ACTIVE",
          className: "bg-emerald-500 text-white",
          icon: "✨",
        };
    }
  };

  // 🎯 FINAL UX: Unified "View" button for ALL signals
  const getActionButton = (signal: Signal) => {
    const { status } = signal;
    const hasRealPosition = hasPosition(signal.ticker);

    console.log(`🔍 DEBUG - ${signal.ticker} button:`, {
      hasRealPosition,
      status,
    });

    if (status === "expired" || status === "cancelled") {
      return (
        <Button
          size="sm"
          className="bg-slate-600 text-slate-400 text-xs px-3 py-1"
          disabled
        >
          Unavailable
        </Button>
      );
    }

    // 🎯 UNIFIED UX: ALL signals get "View" button that navigates to Signals page
    return (
      <Button
        size="sm"
        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-1"
        onClick={() => {
          console.log(
            `🎯 DEBUG - View button clicked for ${signal.ticker} - Navigating to Signals page`
          );
          console.log(
            `🎯 ${
              hasRealPosition ? "Existing position" : "Fresh signal"
            } - User will see ${
              hasRealPosition ? "Add to Position" : "Execute Trade"
            } in Signals page`
          );
          navigate(`/signals?stock=${signal.ticker}`);
        }}
        disabled={positionsLoading}
      >
        View
      </Button>
    );
  };

  const formatPrice = (price: number, market: string) => {
    // 🚀 FIXED: Handle null/undefined prices gracefully
    if (!price || price === 0) {
      return "N/A";
    }

    if (market === "crypto") {
      if (price >= 1000) {
        return `$${price.toLocaleString()}`;
      } else if (price >= 1) {
        return `$${price.toFixed(2)}`;
      } else {
        return `$${price.toFixed(4)}`;
      }
    }
    return `$${price.toFixed(2)}`;
  };

  const getMarketFlag = (market: string) => {
    switch (market) {
      case "usa":
        return "🇺🇸";
      case "germany":
        return "🇩🇪";
      case "uk":
        return "🇬🇧";
      case "japan":
        return "🇯🇵";
      case "saudi":
        return "🇸🇦";
      case "uae":
        return "🇦🇪";
      case "qatar":
        return "🇶🇦";
      case "kuwait":
        return "🇰🇼";
      case "bahrain":
        return "🇧🇭";
      case "oman":
        return "🇴🇲";
      case "crypto":
        return "₿";
      default:
        return "";
    }
  };

  // ✅ REMOVED: Duplicate calculateFinalScore function - now using centralized one

  const getTooltipText = (signal: Signal, timeframe: string, score: number) => {
    return `${signal.ticker} ${timeframe}: ${score}% confidence\nRSI: 28, MACD > 0, Volume: 2.1x`;
  };

  const shouldHighlightScore = (score: number) => {
    if (!highlightedCategory) return false;
    if (highlightedCategory === "strong" && score >= 90) return true;
    if (highlightedCategory === "valid" && score >= 80 && score < 90)
      return true;
    if (highlightedCategory === "weak" && score >= 70 && score < 80)
      return true;
    return false;
  };

  // Check if entire row should blink based on final score category
  const shouldBlinkRow = (signal: Signal) => {
    if (!highlightedCategory) return false;
    const finalScore = calculateFinalScore(signal.signals);
    if (highlightedCategory === "strong" && finalScore >= 90) return true;
    if (highlightedCategory === "valid" && finalScore >= 80 && finalScore < 90)
      return true;
    if (highlightedCategory === "weak" && finalScore >= 70 && finalScore < 80)
      return true;
    return false;
  };

  const getHighlightedSignalColor = (score: number, isHighlighted: boolean) => {
    const baseColor = getSignalColor(score);
    if (isHighlighted) {
      return `${baseColor} ring-4 ring-emerald-300 ring-opacity-75 animate-pulse`;
    }
    return baseColor;
  };

  if (filteredSignals.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-slate-400">{t("signals.noSignals")}</div>
        <div className="text-slate-500 text-sm mt-1">
          {t("signals.tryLowering")}
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[800px]">
        {/* Header Row */}
        <div className="grid grid-cols-8 gap-2 mb-2">
          <div className="text-slate-400 text-sm font-medium">
            {t("signals.asset")}
          </div>
          <div className="text-slate-400 text-sm font-medium text-center">
            {t("signals.currentPrice")}
          </div>
          {timeframes.map((tf) => (
            <div
              key={tf}
              className={`text-center text-slate-400 text-sm font-medium ${
                tf === timeFilter ? "text-emerald-400" : ""
              }`}
            >
              {tf}
            </div>
          ))}
          <div className="text-center text-slate-400 text-sm font-medium">
            {t("signals.finalScore")}
          </div>
          <div className="text-slate-400 text-sm font-medium">
            {t("signals.actions")}
          </div>
        </div>

        {/* Signal Rows */}
        <div className="space-y-2">
          {filteredSignals.map((signal) => {
            const finalScore = calculateFinalScore(signal.signals);
            const isFinalScoreHighlighted = shouldHighlightScore(finalScore);
            const shouldRowBlink = shouldBlinkRow(signal);
            const statusBadge = getStatusBadge(signal);
            const hasRealPosition = hasPosition(signal.ticker);

            return (
              <div
                key={signal.ticker}
                className={`grid grid-cols-8 gap-2 items-center transition-all duration-200 rounded-lg p-2 ${
                  shouldRowBlink
                    ? "animate-pulse bg-slate-700/50 ring-2 ring-emerald-400/50"
                    : ""
                } ${hasRealPosition ? "border-l-4 border-blue-400" : ""}`}
              >
                {/* Stock Info with Status Badge */}
                <div className="flex flex-col">
                  <div className="text-white font-bold text-sm flex items-center space-x-1">
                    <span>{getMarketFlag(signal.market)}</span>
                    <span>{signal.ticker}</span>
                  </div>
                  <div className="text-slate-400 text-xs truncate">
                    {signal.name}
                  </div>
                  {/* Status Badge */}
                  <div className="mt-1">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${statusBadge.className}`}
                    >
                      <span className="mr-1">{statusBadge.icon}</span>
                      {statusBadge.text}
                    </span>
                  </div>
                </div>

                {/* 🚀 FIXED: Current Price using correct database columns */}
                <div className="text-center">
                  <div className="text-white font-medium text-sm">
                    {formatPrice(signal.current_price, signal.market)}
                  </div>
                  <div
                    className={`text-xs ${
                      signal.price_change_percent >= 0
                        ? "text-emerald-400"
                        : "text-red-400"
                    }`}
                  >
                    {signal.price_change_percent >= 0 ? "+" : ""}
                    {signal.price_change_percent
                      ? signal.price_change_percent.toFixed(2)
                      : "0.00"}
                    %
                  </div>
                </div>

                {/* Signal Scores for each timeframe */}
                {timeframes.map((tf) => {
                  const score =
                    signal.signals[tf as keyof typeof signal.signals];
                  const isHighlighted =
                    tf === timeFilter && shouldHighlightScore(score);
                  return (
                    <div key={tf} className="flex justify-center">
                      <div
                        className={`
                          px-2 py-1 rounded text-xs font-bold text-center min-w-[50px] cursor-pointer
                          transition-all duration-200 hover:scale-105 transform
                          ${getHighlightedSignalColor(score, isHighlighted)}
                          ${tf === timeFilter ? "ring-2 ring-emerald-400" : ""}
                        `}
                        style={getSignalBackgroundColor(score)}
                        title={getTooltipText(signal, tf, score)}
                        onClick={() => onViewSignal(signal, tf)}
                      >
                        {getSignalIcon(score)} {score}
                      </div>
                    </div>
                  );
                })}

                {/* Final Score */}
                <div className="flex justify-center">
                  <div
                    className={`
                      px-3 py-1 rounded text-sm font-bold text-center min-w-[60px] cursor-pointer
                      transition-all duration-200 hover:scale-105 transform
                      ${getHighlightedSignalColor(
                        finalScore,
                        isFinalScoreHighlighted
                      )}
                    `}
                    style={getSignalBackgroundColor(finalScore)}
                    title={`Final weighted score: ${finalScore}`}
                    onClick={() => onViewSignal(signal, "final")}
                  >
                    {getSignalIcon(finalScore)} {finalScore}
                  </div>
                </div>

                {/* 🎯 UNIFIED: Single "View" Button for ALL Signals */}
                <div className="flex justify-center">
                  {getActionButton(signal)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SignalTable;
