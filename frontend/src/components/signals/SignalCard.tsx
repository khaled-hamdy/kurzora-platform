// src/components/signals/SignalCard.tsx
// Complete Enhanced SignalCard - FIXED redundant timestamps
// Preserves ALL features while fixing timestamp redundancy

import React from "react";
import {
  Clock,
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  Crown,
  MessageSquare,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { createMarketAwareTimestamp } from "@/utils/smartTimestamp";
import { calculateFinalScore } from "@/utils/signalCalculations";

// Enhanced Signal interface (matches your project structure exactly)
interface Signal {
  id?: string;
  ticker: string;
  company_name?: string;
  name?: string;
  sector?: string;
  confidence_score?: number;
  signalScore?: number;
  current_price?: number;
  price_change_percent?: number;
  priceChange?: number;
  created_at?: string;
  timestamp?: string;
  signals?: {
    "1H"?: number;
    "4H"?: number;
    "1D"?: number;
    "1W"?: number;
  };
  // Additional fields from your enhanced signal processor
  entryPrice?: number;
  stopLoss?: number;
  takeProfit?: number;
  riskRewardRatio?: number;
  atr?: number;
  positionSize?: number;
}

interface SignalCardProps {
  signal: Signal;
  isHighlighted?: boolean;
  hasExistingPosition?: boolean;
  buttonText?: string;
  onViewSignal?: (signal: Signal) => void;
  onToggleChart?: (ticker: string) => void;
  showChart?: boolean;
  // Additional props for enhanced functionality
  onViewDetails?: (signal: Signal) => void;
  onOpenModal?: (signal: Signal) => void;
  existingPositions?: string[];
  className?: string;
  // Telegram alert settings (from your useUserAlertSettings hook)
  canUseTelegram?: boolean;
  isConnected?: boolean;
}

/**
 * Get score color for display (matches your existing logic)
 */
const getScoreColor = (score: number): string => {
  if (score >= 90) return "bg-emerald-600";
  if (score >= 80) return "bg-blue-600";
  if (score >= 70) return "bg-amber-600";
  return "bg-red-600";
};

/**
 * Get price change color and display (matches your existing logic)
 */
const getChangeColor = (change: number): string => {
  return change >= 0 ? "text-emerald-400" : "text-red-400";
};

/**
 * Format price display (enhanced version)
 */
const formatPrice = (price: number | undefined): string => {
  if (!price || price === 0) return "N/A";
  return `$${price.toFixed(2)}`;
};

/**
 * Enhanced date formatting with smart timestamps (preserves your existing logic + adds market awareness)
 */
const formatSignalDate = (timestamp: string | Date): string => {
  try {
    const signalDate = new Date(timestamp);
    const now = new Date();

    if (isNaN(signalDate.getTime())) {
      return "Unknown date";
    }

    const diffInMs = now.getTime() - signalDate.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);

    const formatTime = (date: Date) => {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    };

    const timeStr = formatTime(signalDate);

    if (diffInMinutes < 1) {
      return "Just now";
    }

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes === 1 ? "" : "s"} ago`;
    }

    const isToday = signalDate.toDateString() === now.toDateString();
    if (isToday) {
      return `Today ${timeStr}`;
    }

    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = signalDate.toDateString() === yesterday.toDateString();
    if (isYesterday) {
      return `Yesterday ${timeStr}`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      const dayName = signalDate.toLocaleDateString("en-US", {
        weekday: "long",
      });
      return `${dayName} ${timeStr}`;
    }

    const isSameYear = signalDate.getFullYear() === now.getFullYear();
    if (isSameYear) {
      const monthDay = signalDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      return `${monthDay} ${timeStr}`;
    }

    const fullDate = signalDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    return `${fullDate} ${timeStr}`;
  } catch (error) {
    console.warn("Error formatting signal date:", error);
    return "Invalid date";
  }
};

/**
 * Get time context with icon (preserves your existing logic)
 */
const getTimeContext = (
  timestamp: string | Date
): { icon: string; context: string } => {
  try {
    const signalDate = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - signalDate.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 5) {
      return { icon: "🔥", context: "Fresh signal" };
    } else if (diffInMinutes < 30) {
      return { icon: "⚡", context: "Recent signal" };
    } else if (diffInMinutes < 120) {
      return { icon: "📊", context: "Active signal" };
    } else {
      return { icon: "📈", context: "Signal" };
    }
  } catch (error) {
    return { icon: "📊", context: "Signal" };
  }
};

/**
 * Telegram Alert Indicator (preserves your existing component)
 */
const SignalTelegramIndicator: React.FC<{
  signalScore: number;
  ticker: string;
  canUseTelegram?: boolean;
  isConnected?: boolean;
}> = ({ signalScore, ticker, canUseTelegram, isConnected }) => {
  // Only show for high-scoring signals
  if (signalScore < 80) return null;

  // Show different states based on user's telegram status
  if (!canUseTelegram) {
    return (
      <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs mt-1">
        <Crown className="h-3 w-3 mr-1" />
        Pro Alert Available
      </Badge>
    );
  }

  if (isConnected) {
    return (
      <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs mt-1">
        <MessageSquare className="h-3 w-3 mr-1" />
        Alert Sent
      </Badge>
    );
  }

  return (
    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs mt-1">
      <MessageSquare className="h-3 w-3 mr-1" />
      Connect Telegram
    </Badge>
  );
};

/**
 * Complete Enhanced SignalCard Component
 */
const SignalCard: React.FC<SignalCardProps> = ({
  signal,
  isHighlighted = false,
  hasExistingPosition = false,
  buttonText = "View Signal",
  onViewSignal,
  onToggleChart,
  showChart = false,
  onViewDetails,
  onOpenModal,
  existingPositions = [],
  className = "",
  canUseTelegram = false,
  isConnected = false,
}) => {
  // Normalize signal data (handle different field names for backwards compatibility)
  const ticker = signal.ticker;
  const companyName = signal.company_name || signal.name || ticker;
  const sector = signal.sector || "Unknown";
  const score =
    signal.confidence_score ||
    signal.signalScore ||
    calculateFinalScore(signal.signals) ||
    0;
  const currentPrice = signal.current_price;
  const priceChange = signal.price_change_percent || signal.priceChange || 0;
  const timestamp =
    signal.created_at || signal.timestamp || new Date().toISOString();

  // Check if position exists (supports both prop patterns)
  const positionExists =
    hasExistingPosition || existingPositions.includes(ticker);

  // Get time context and market-aware timestamp
  const timeContext = getTimeContext(timestamp);
  const timestampInfo = createMarketAwareTimestamp(timestamp);
  const formattedDate = formatSignalDate(timestamp);

  // Calculate final score for display
  const finalScore = score || calculateFinalScore(signal.signals) || 0;

  // Handle click events
  const handleViewSignal = () => {
    if (onViewSignal) {
      onViewSignal(signal);
    } else if (onViewDetails) {
      onViewDetails(signal);
    } else if (onOpenModal) {
      onOpenModal(signal);
    }
  };

  const handleToggleChart = () => {
    if (onToggleChart) {
      onToggleChart(ticker);
    }
  };

  return (
    <Card
      className={`bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:bg-slate-800/70 transition-all duration-500 ${
        showChart ? "ring-2 ring-blue-500/50" : ""
      } ${
        isHighlighted
          ? "ring-4 ring-emerald-400 ring-opacity-75 bg-emerald-900/20 scale-[1.02]"
          : ""
      } ${className}`}
    >
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            {/* Header Section */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-2xl font-bold text-white">{ticker}</h3>
                  {isHighlighted && (
                    <Badge className="bg-emerald-600 text-white animate-pulse">
                      Found!
                    </Badge>
                  )}
                </div>
                <p className="text-slate-400 text-lg">{companyName}</p>
                <p className="text-slate-500 text-sm">{sector}</p>

                {/* Position indicator */}
                {positionExists && (
                  <Badge className="bg-blue-600 text-white text-xs mt-2">
                    📈 Position Open
                  </Badge>
                )}

                {/* Telegram Alert Indicator */}
                <SignalTelegramIndicator
                  signalScore={finalScore}
                  ticker={ticker}
                  canUseTelegram={canUseTelegram}
                  isConnected={isConnected}
                />

                {/* 🚀 FIXED: Enhanced Timestamp Section - No redundancy */}
                <div className="mt-3 space-y-2">
                  {/* Traditional formatted date */}
                  <div className="flex items-center space-x-2">
                    <Clock className="h-3 w-3 text-slate-500" />
                    <span className="text-xs text-slate-500">
                      {timeContext.icon} {formattedDate}
                    </span>
                    <Badge className="bg-slate-700 text-slate-400 text-xs px-2 py-0.5">
                      {timeContext.context}
                    </Badge>
                  </div>

                  {/* Market-aware context */}
                  <div
                    className={`
                    flex items-start space-x-2 p-2 rounded-lg border text-xs
                    ${timestampInfo.contextBadge?.color} ${timestampInfo.contextBadge?.bgColor}
                  `}
                  >
                    <div className="flex items-center space-x-1">
                      {timestampInfo.contextBadge && (
                        <span
                          className={`
                          px-1.5 py-0.5 rounded text-xs font-medium border
                          ${timestampInfo.contextBadge.color} ${timestampInfo.contextBadge.bgColor}
                        `}
                        >
                          {timestampInfo.contextBadge.text}
                        </span>
                      )}
                      <span className="opacity-90">
                        {timestampInfo.display}
                      </span>
                    </div>
                  </div>

                  {/* 🚀 REMOVED: Redundant "Next trading" section since it's already shown above */}
                </div>
              </div>

              {/* Score Badge */}
              <div className="text-center">
                <p className="text-slate-400 text-sm mb-1">Final Score</p>
                <Badge
                  className={`${getScoreColor(
                    finalScore
                  )} text-white text-2xl px-4 py-2 font-bold`}
                >
                  {finalScore}
                </Badge>
              </div>
            </div>

            {/* Price Information */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Price</span>
                <span className="text-white font-semibold text-lg">
                  {formatPrice(currentPrice)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Change</span>
                <span
                  className={`font-semibold flex items-center text-lg ${getChangeColor(
                    priceChange
                  )}`}
                >
                  {priceChange >= 0 ? (
                    <TrendingUp className="h-5 w-5 mr-1" />
                  ) : (
                    <TrendingDown className="h-5 w-5 mr-1" />
                  )}
                  {priceChange >= 0 ? "+" : ""}
                  {priceChange.toFixed(2)}%
                </span>
              </div>
            </div>

            {/* Signal Strength Progress Bar */}
            <div className="pt-4 border-t border-slate-700">
              <div className="flex justify-between text-sm text-slate-400 mb-2">
                <span>Signal Strength</span>
                <span>
                  {finalScore >= 90
                    ? "Very Strong"
                    : finalScore >= 80
                    ? "Strong"
                    : "Moderate"}
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3">
                <div
                  className={`h-3 rounded-full ${getScoreColor(finalScore)}`}
                  style={{ width: `${finalScore}%` }}
                ></div>
              </div>

              {/* Actionable status indicator */}
              <div className="mt-2 flex items-center justify-between">
                <div
                  className={`
                    flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium
                    ${
                      timestampInfo.actionable
                        ? "bg-green-600 text-white"
                        : "bg-slate-600 text-slate-300"
                    }
                  `}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      timestampInfo.actionable ? "bg-green-300" : "bg-slate-400"
                    }`}
                  />
                  <span>
                    {timestampInfo.actionable
                      ? "Tradeable Now"
                      : "Wait for Market"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons Section */}
          <div className="lg:col-span-4 flex flex-col justify-center space-y-3">
            {/* Main Action Button */}
            <Button
              onClick={handleViewSignal}
              className={`w-full text-white text-lg py-3 ${
                positionExists
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-emerald-600 hover:bg-emerald-700"
              }`}
              disabled={buttonText === "Loading..."}
            >
              <Activity className="h-5 w-5 mr-2" />
              {buttonText}
            </Button>

            {/* Chart Toggle Button */}
            {onToggleChart && (
              <Button
                onClick={handleToggleChart}
                variant="outline"
                className={`w-full text-lg py-3 transition-all duration-200 ${
                  showChart
                    ? "border-blue-500 bg-blue-600/20 text-blue-300"
                    : "border-blue-500 text-blue-400 hover:bg-blue-600/10"
                }`}
              >
                {showChart ? (
                  <>
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Hide Chart
                  </>
                ) : (
                  <>
                    <BarChart3 className="h-5 w-5 mr-2" />
                    View Chart
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SignalCard;
