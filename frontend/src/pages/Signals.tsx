import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import {
  useSubscriptionTier,
  useSignalLimits,
  useTrialStatus,
} from "../hooks/useSubscriptionTier";
import { useUserAlertSettings } from "../hooks/useUserAlertSettings";
import { TelegramAlertBanner } from "../components/telegram";
import Layout from "../components/Layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Slider } from "../components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Filter,
  RefreshCw,
  BarChart3,
  Crown,
  Zap,
  MessageSquare,
  AlertCircle,
  Clock,
} from "lucide-react";
import { useToast } from "../hooks/use-toast";
import SignalModal from "../components/signals/SignalModal";
import { useSignalsPageData } from "../hooks/useSignalsPageData";
import { usePositions } from "../contexts/PositionsContext";
import {
  filterSignalsByFinalScore,
  calculateFinalScore,
} from "../utils/signalCalculations";
import { Signal } from "../types/signal";
import { useSectorData } from "../hooks/useSectorData";

// ENHANCED DATE FORMATTING UTILITY
// Converts raw database timestamps to user-friendly format
const formatSignalDate = (timestamp: string | Date): string => {
  try {
    const signalDate = new Date(timestamp);
    const now = new Date();

    // Check if the date is valid
    if (isNaN(signalDate.getTime())) {
      return "Unknown date";
    }

    const diffInMs = now.getTime() - signalDate.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    // Format time as HH:MM AM/PM
    const formatTime = (date: Date) => {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    };

    // Format date and time
    const timeStr = formatTime(signalDate);

    // Recent timestamps (less than 1 minute)
    if (diffInMinutes < 1) {
      return "Just now";
    }

    // Very recent (less than 60 minutes)
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes === 1 ? "" : "s"} ago`;
    }

    // Same day (less than 24 hours and same calendar day)
    const isToday = signalDate.toDateString() === now.toDateString();
    if (isToday) {
      return `Today ${timeStr}`;
    }

    // Yesterday
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = signalDate.toDateString() === yesterday.toDateString();
    if (isYesterday) {
      return `Yesterday ${timeStr}`;
    }

    // This week (within 7 days)
    if (diffInDays < 7) {
      const dayName = signalDate.toLocaleDateString("en-US", {
        weekday: "long",
      });
      return `${dayName} ${timeStr}`;
    }

    // This year
    const isSameYear = signalDate.getFullYear() === now.getFullYear();
    if (isSameYear) {
      const monthDay = signalDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      return `${monthDay} ${timeStr}`;
    }

    // Different year
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

// Get relative time with icon for additional context
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

// ENHANCED MARKET FILTERING UTILITY
// Filter signals by market (Global vs USA)
const filterSignalsByMarket = (
  signals: Signal[],
  marketFilter: string
): Signal[] => {
  if (marketFilter === "global") {
    // Show all signals regardless of market
    return signals;
  }

  if (marketFilter === "usa") {
    // Show only US market signals
    // US markets typically include: NYSE, NASDAQ, AMEX
    // We can identify US stocks by:
    // 1. Market field containing 'US', 'NYSE', 'NASDAQ', 'AMEX'
    // 2. Or by common US stock patterns (most are 1-5 letter symbols)
    return signals.filter((signal) => {
      // Check if signal has explicit market information
      if (signal.market) {
        const market = signal.market.toLowerCase();
        return (
          market.includes("us") ||
          market.includes("nyse") ||
          market.includes("nasdaq") ||
          market.includes("amex") ||
          market === "stocks"
        ); // Many US stocks are marked as 'stocks'
      }

      // Fallback: Most US stocks have simple ticker patterns
      // This is a reasonable assumption for US markets
      const ticker = signal.ticker.toUpperCase();

      // US stocks are typically:
      // - 1-5 characters
      // - Alphabetic only (no numbers or special chars)
      // - Not crypto patterns (no $ or long names)
      const isUSPattern =
        /^[A-Z]{1,5}$/.test(ticker) &&
        !ticker.includes("$") &&
        ticker.length <= 5;

      return isUSPattern;
    });
  }

  // Default: show all signals
  return signals;
};

// Test component to verify alert settings hook
const TestAlertSettings = () => {
  const {
    alertSettings,
    userProfile,
    loading,
    error,
    isConnected,
    canUseTelegram,
  } = useUserAlertSettings();

  console.log("🔍 ALERT SETTINGS TEST:", {
    loading,
    error,
    alertSettings,
    userProfile,
    isConnected,
    canUseTelegram,
  });

  return null; // This component is invisible, just for testing
};

// Simple Telegram indicator component
const SignalTelegramIndicator: React.FC<{
  signalScore: number;
  ticker: string;
}> = ({ signalScore, ticker }) => {
  const { isConnected, canUseTelegram } = useUserAlertSettings();

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

// FUTURE-PROOF TRADINGVIEW CHART COMPONENT - AUTO-DETECTION
// No more manual exchange mapping - TradingView handles it automatically!

// Enhanced TradingView Chart Component with Auto-Detection
const TradingViewChart: React.FC<{
  symbol: string;
  theme?: string;
  height?: number;
}> = ({ symbol, theme = "dark", height = 400 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const [currentSymbol, setCurrentSymbol] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [fallbackIndex, setFallbackIndex] = useState(0);

  // Generate unique container ID to prevent conflicts
  const containerId = `tradingview_${symbol}_${Date.now()}_${Math.random()
    .toString(36)
    .substr(2, 9)}`;

  // Smart symbol detection with TradingView auto-detection + fallbacks
  const getSymbolOptions = (symbol) => {
    const upperSymbol = symbol.toUpperCase();

    // Return multiple options for TradingView to try
    // TradingView is smart enough to find the right exchange
    return [
      upperSymbol, // Auto-detection (TradingView finds the exchange)
      `NASDAQ:${upperSymbol}`, // Explicit NASDAQ (for tech stocks)
      `NYSE:${upperSymbol}`, // Explicit NYSE (for traditional companies)
      `AMEX:${upperSymbol}`, // American Stock Exchange (for some smaller companies)
    ];
  };

  // Cleanup function to prevent duplication
  const cleanup = () => {
    if (containerRef.current) {
      // Remove all child elements safely
      while (containerRef.current.firstChild) {
        containerRef.current.removeChild(containerRef.current.firstChild);
      }
    }

    if (scriptRef.current && scriptRef.current.parentNode) {
      scriptRef.current.parentNode.removeChild(scriptRef.current);
      scriptRef.current = null;
    }
  };

  // Load TradingView widget with proper error handling
  const loadWidget = (symbolToTry: string) => {
    if (!containerRef.current) return;

    cleanup(); // Clean up previous widget first

    setLoading(true);
    setError(null);

    console.log(
      `🎯 TradingView Auto-Detection: Trying symbol "${symbolToTry}" for ${symbol}`
    );

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    scriptRef.current = script;

    const config = {
      autosize: false,
      width: "100%",
      height: height,
      symbol: symbolToTry, // Let TradingView auto-detect or use explicit exchange
      interval: "1H",
      timezone: "Etc/UTC",
      theme: theme,
      style: "1",
      locale: "en",
      withdateranges: true,
      hide_side_toolbar: false,
      allow_symbol_change: false,
      details: true,
      hotlist: true,
      calendar: false,
      studies: [
        "RSI@tv-basicstudies",
        "MACD@tv-basicstudies",
        "BB@tv-basicstudies",
      ],
      show_popup_button: true,
      popup_width: "1000",
      popup_height: "650",
      no_referral_id: true,
    };

    script.innerHTML = JSON.stringify(config);

    // Handle script load with timeout for reliability
    const timeout = setTimeout(() => {
      console.warn(`⏰ TradingView widget timeout for symbol: ${symbolToTry}`);
      tryNextFallback();
    }, 8000); // 8 second timeout

    script.onload = () => {
      clearTimeout(timeout);
      // Give TradingView a moment to render and check for errors
      setTimeout(() => {
        const iframe = containerRef.current?.querySelector("iframe");
        if (iframe) {
          setLoading(false);
          setCurrentSymbol(symbolToTry);
          console.log(
            `✅ TradingView widget loaded successfully: ${symbolToTry}`
          );
        } else {
          // No iframe means the widget failed to load
          console.warn(
            `❌ TradingView widget failed to render: ${symbolToTry}`
          );
          tryNextFallback();
        }
      }, 2000); // Give TradingView 2 seconds to render
    };

    script.onerror = () => {
      clearTimeout(timeout);
      console.error(`❌ TradingView script error for symbol: ${symbolToTry}`);
      tryNextFallback();
    };

    containerRef.current.appendChild(script);
  };

  // Try next fallback option if current fails
  const tryNextFallback = () => {
    const symbolOptions = getSymbolOptions(symbol);

    if (fallbackIndex < symbolOptions.length - 1) {
      const nextIndex = fallbackIndex + 1;
      setFallbackIndex(nextIndex);
      console.log(
        `🔄 Trying fallback ${nextIndex + 1}/${symbolOptions.length}: ${
          symbolOptions[nextIndex]
        }`
      );
      loadWidget(symbolOptions[nextIndex]);
    } else {
      // All options exhausted
      setError(`Chart not available for ${symbol}`);
      setLoading(false);
      console.error(`❌ All symbol options exhausted for: ${symbol}`);
    }
  };

  // Effect to load widget when symbol changes
  useEffect(() => {
    if (!symbol) return;

    setFallbackIndex(0);
    const symbolOptions = getSymbolOptions(symbol);
    const firstOption = symbolOptions[0]; // Start with auto-detection

    loadWidget(firstOption);

    // Cleanup on unmount
    return cleanup;
  }, [symbol, theme, height]);

  // Retry function for manual retry
  const retry = () => {
    setFallbackIndex(0);
    setError(null);
    const symbolOptions = getSymbolOptions(symbol);
    loadWidget(symbolOptions[0]);
  };

  // Error state UI
  if (error) {
    return (
      <div className="w-full">
        <div className="bg-slate-800/50 border border-slate-600 rounded-lg p-6 text-center">
          <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">
            Chart Unavailable
          </h3>
          <p className="text-slate-400 mb-4">{error}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={retry}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Retry Chart
            </button>
            <a
              href={`https://www.tradingview.com/symbols/${symbol}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg"
            >
              View on TradingView
            </a>
          </div>
        </div>
        <div className="mt-2">
          <a
            href={`https://www.tradingview.com/symbols/${symbol}/`}
            rel="noopener nofollow"
            target="_blank"
            className="text-xs text-gray-500 hover:text-gray-400"
          >
            <span className="text-blue-400">{symbol} Chart</span> by TradingView
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {loading && (
        <div className="bg-slate-800/50 border border-slate-600 rounded-lg p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading chart for {symbol}...</p>
          {fallbackIndex > 0 && (
            <p className="text-xs text-slate-500 mt-2">
              Trying alternative format... ({fallbackIndex + 1}/4)
            </p>
          )}
        </div>
      )}

      <div
        ref={containerRef}
        className={loading ? "hidden" : "block"}
        style={{ minHeight: `${height}px` }}
      />

      <div className="mt-2">
        <a
          href={`https://www.tradingview.com/symbols/${
            currentSymbol || symbol
          }/`}
          rel="noopener nofollow"
          target="_blank"
          className="text-xs text-gray-500 hover:text-gray-400"
        >
          <span className="text-blue-400">{symbol} Chart</span> by TradingView
          {currentSymbol && currentSymbol !== symbol && (
            <span className="text-slate-500"> (Found as: {currentSymbol})</span>
          )}
        </a>
      </div>
    </div>
  );
};

// Subscription Status Banner Component
const SubscriptionStatusBanner: React.FC = () => {
  const subscription = useSubscriptionTier();
  const trialStatus = useTrialStatus();
  const signalLimits = useSignalLimits();

  if (!subscription) return null;

  if (trialStatus?.isTrialActive) {
    return (
      <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Crown className="h-6 w-6 text-purple-400" />
            <div>
              <h3 className="text-purple-400 font-semibold">
                🎉 Trial Active - Unlimited Access
              </h3>
              <p className="text-white text-sm">
                You have {trialStatus.trialDaysLeft} days left of Professional
                features
              </p>
            </div>
          </div>
          <Button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-white text-sm">
            Choose Plan
          </Button>
        </div>
      </div>
    );
  }

  if (signalLimits.canViewUnlimited) {
    return (
      <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-3">
          <Crown className="h-6 w-6 text-emerald-400" />
          <div>
            <h3 className="text-emerald-400 font-semibold">
              Professional Plan - Unlimited Signals
            </h3>
            <p className="text-white text-sm">
              You have access to all premium features and unlimited signals
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Zap className="h-6 w-6 text-amber-400" />
          <div>
            <h3 className="text-amber-400 font-semibold">
              Starter Plan - {signalLimits.maxSignalsPerDay} Fresh Signals/Day +
              All Your Positions
            </h3>
            <p className="text-white text-sm">
              Upgrade to Professional for unlimited fresh signals and premium
              features
            </p>
          </div>
        </div>
        <Button className="bg-amber-600 hover:bg-amber-700 px-4 py-2 rounded-lg text-white text-sm">
          Upgrade to Pro
        </Button>
      </div>
    </div>
  );
};

// Professional Filter Header Component
const FilterHeader: React.FC<{
  filteredSignals: Signal[];
  hiddenSignalsCount: number;
  subscription: any;
  signalLimits: any;
}> = ({ filteredSignals, hiddenSignalsCount, subscription, signalLimits }) => {
  return (
    <CardHeader>
      <CardTitle className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-blue-400" />
          <span className="text-white">Trading Filters</span>
        </div>

        <div className="flex items-center space-x-2">
          <div className="bg-emerald-600/20 border border-emerald-500/30 rounded-lg px-3 py-1.5">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-emerald-400 font-medium text-sm">
                {filteredSignals.length} Live Signals
              </span>
            </div>
          </div>

          {hiddenSignalsCount > 0 && (
            <div className="bg-amber-600/20 border border-amber-500/30 rounded-lg px-3 py-1.5">
              <div className="flex items-center space-x-1">
                <Crown className="h-3 w-3 text-amber-400" />
                <span className="text-amber-400 font-medium text-xs">
                  +{hiddenSignalsCount} Pro Only
                </span>
              </div>
            </div>
          )}
        </div>
      </CardTitle>

      <div className="text-xs text-slate-400 mt-2">
        {subscription && (
          <div className="flex items-center justify-between">
            <span>Real-time market scanning active</span>
            <span>
              {signalLimits.canViewUnlimited ? (
                <span className="text-emerald-400">
                  👑 Professional - Unlimited Access
                </span>
              ) : (
                <span className="text-amber-400">
                  ⚡ Starter - {signalLimits.maxSignalsPerDay} fresh/day +
                  positions
                </span>
              )}
            </span>
          </div>
        )}
      </div>
    </CardHeader>
  );
};

// Upgrade Prompt Component
const UpgradePrompt: React.FC<{ hiddenCount: number }> = ({ hiddenCount }) => {
  const signalLimits = useSignalLimits();

  return (
    <Card className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 border-amber-500/50 mt-6">
      <CardContent className="p-6">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-amber-600 rounded-full p-3">
              <Crown className="h-8 w-8 text-white" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            {hiddenCount} More Fresh Signals Available
          </h3>
          <p className="text-slate-300 mb-4">
            You're viewing {signalLimits.maxSignalsPerDay} fresh signals + all
            your existing positions. Upgrade to Professional to see all new
            trading opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3">
              <Crown className="h-5 w-5 mr-2" />
              Upgrade to Professional ($49/month)
            </Button>
            <Button
              variant="outline"
              className="border-amber-500 text-amber-400 hover:bg-amber-600/10 px-8 py-3"
            >
              View Pricing Plans
            </Button>
          </div>
          <p className="text-xs text-slate-400 mt-3">
            ✨ Unlimited signals • AI explanations • Telegram premium group •
            Priority support
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

// ENHANCED SIGNAL CARD COMPONENT - WITH PROPER DATE FORMATTING
const SignalCard: React.FC<{
  signal: Signal;
  isHighlighted: boolean;
  hasExistingPosition: boolean;
  buttonText: string;
  onViewSignal: (signal: Signal) => void;
  onToggleChart: (ticker: string) => void;
  showChart: boolean;
}> = ({
  signal,
  isHighlighted,
  hasExistingPosition,
  buttonText,
  onViewSignal,
  onToggleChart,
  showChart,
}) => {
  const finalScore = calculateFinalScore(signal.signals);
  const timeContext = getTimeContext(signal.timestamp);

  const getScoreColor = (score: number) => {
    if (score >= 90) return "bg-emerald-600";
    if (score >= 80) return "bg-blue-600";
    if (score >= 70) return "bg-amber-600";
    return "bg-red-600";
  };

  const getChangeColor = (change: number) => {
    return change >= 0 ? "text-emerald-400" : "text-red-400";
  };

  return (
    <Card
      className={`bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:bg-slate-800/70 transition-all duration-500 ${
        showChart ? "ring-2 ring-blue-500/50" : ""
      } ${
        isHighlighted
          ? "ring-4 ring-emerald-400 ring-opacity-75 bg-emerald-900/20 scale-[1.02]"
          : ""
      }`}
    >
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-2xl font-bold text-white">
                    {signal.ticker}
                  </h3>
                  {isHighlighted && (
                    <Badge className="bg-emerald-600 text-white animate-pulse">
                      Found!
                    </Badge>
                  )}
                </div>
                <p className="text-slate-400 text-lg">{signal.name}</p>
                <p className="text-slate-500 text-sm">{signal.sector}</p>
                {hasExistingPosition && (
                  <Badge className="bg-blue-600 text-white text-xs mt-2">
                    📈 Position Open
                  </Badge>
                )}

                {/* Telegram Alert Indicator */}
                <SignalTelegramIndicator
                  signalScore={finalScore}
                  ticker={signal.ticker}
                />

                {/* FIXED: FORMATTED SIGNAL DATE WITH CONTEXT */}
                <div className="flex items-center space-x-2 mt-2">
                  <Clock className="h-3 w-3 text-slate-500" />
                  <span className="text-xs text-slate-500">
                    {timeContext.icon} {formatSignalDate(signal.timestamp)}
                  </span>
                  <Badge className="bg-slate-700 text-slate-400 text-xs px-2 py-0.5">
                    {timeContext.context}
                  </Badge>
                </div>
              </div>
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

            <div className="grid grid-cols-2 gap-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Price</span>
                <span className="text-white font-semibold text-lg">
                  $
                  {signal.current_price
                    ? signal.current_price.toFixed(2)
                    : "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Change</span>
                <span
                  className={`font-semibold flex items-center text-lg ${getChangeColor(
                    signal.price_change_percent || 0
                  )}`}
                >
                  {(signal.price_change_percent || 0) >= 0 ? (
                    <TrendingUp className="h-5 w-5 mr-1" />
                  ) : (
                    <TrendingDown className="h-5 w-5 mr-1" />
                  )}
                  {(signal.price_change_percent || 0) >= 0 ? "+" : ""}
                  {signal.price_change_percent
                    ? signal.price_change_percent.toFixed(2)
                    : "0.00"}
                  %
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-700 mt-4">
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
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col justify-center space-y-3">
            <Button
              onClick={() => onViewSignal(signal)}
              className={`w-full text-white text-lg py-3 ${
                hasExistingPosition
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-emerald-600 hover:bg-emerald-700"
              }`}
              disabled={buttonText === "Loading..."}
            >
              <Activity className="h-5 w-5 mr-2" />
              {buttonText}
            </Button>

            <Button
              onClick={() => onToggleChart(signal.ticker)}
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Main Signals Component
const Signals: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // All hooks MUST be called before any early returns
  // Subscription data
  const subscription = useSubscriptionTier();
  const signalLimits = useSignalLimits();
  const trialStatus = useTrialStatus();

  // Position context
  const { hasPosition, getButtonText, refreshPositions, existingPositions } =
    usePositions();

  // State
  const [scoreThreshold, setScoreThreshold] = useState([70]);
  const [sectorFilter, setSectorFilter] = useState("all");
  const [marketFilter, setMarketFilter] = useState("global");
  const [selectedSignal, setSelectedSignal] = useState<{
    symbol: string;
    name: string;
    price: number;
    change: number;
    signalScore: number;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showChartsFor, setShowChartsFor] = useState<Set<string>>(new Set());
  const [targetStock, setTargetStock] = useState<string | null>(null);
  const [highlightedStock, setHighlightedStock] = useState<string | null>(null);
  const signalRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Data - ALL HOOKS MUST BE CALLED BEFORE EARLY RETURNS
  const {
    signals: realSignals,
    loading,
    error,
    refresh,
  } = useSignalsPageData();

  // Dynamic sector data from Polygon.io
  const {
    sectors: availableSectors,
    loading: sectorsLoading,
    error: sectorsError,
    refresh: refreshSectors,
  } = useSectorData();

  // URL parameter detection
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const stockParam = searchParams.get("stock");
    if (stockParam) {
      setTargetStock(stockParam.toUpperCase());
    }
  }, [location.search]);

  // Auto-scroll functionality
  useEffect(() => {
    if (targetStock && realSignals.length > 0 && !loading) {
      const baseFilteredSignals = filterSignalsByFinalScore(
        realSignals,
        scoreThreshold,
        sectorFilter,
        marketFilter
      );

      const targetSignal = baseFilteredSignals.find(
        (signal) => signal.ticker.toUpperCase() === targetStock.toUpperCase()
      );

      if (targetSignal && signalRefs.current[targetSignal.ticker]) {
        setTimeout(() => {
          const element = signalRefs.current[targetSignal.ticker];
          if (element) {
            element.scrollIntoView({
              behavior: "smooth",
              block: "center",
              inline: "nearest",
            });
            setHighlightedStock(targetSignal.ticker);
            setTimeout(() => {
              setHighlightedStock(null);
              navigate("/signals", { replace: true });
            }, 3000);
          }
        }, 500);
      } else {
        setTimeout(() => {
          setTargetStock(null);
          navigate("/signals", { replace: true });
        }, 2000);
      }
    }
  }, [
    targetStock,
    realSignals,
    loading,
    navigate,
    scoreThreshold,
    sectorFilter,
    marketFilter,
  ]);

  // ENHANCED FILTERING WITH MARKET FILTER FIX
  const baseFilteredSignals = React.useMemo(() => {
    console.log(`🔍 Filtering signals:`, {
      totalSignals: realSignals.length,
      scoreThreshold: scoreThreshold[0],
      sectorFilter,
      marketFilter,
    });

    // First apply score and sector filters
    let filtered = filterSignalsByFinalScore(
      realSignals,
      scoreThreshold,
      sectorFilter,
      "global" // Always use "global" for the existing function
    );

    console.log(`📊 After score/sector filter: ${filtered.length} signals`);

    // Then apply market filter separately
    filtered = filterSignalsByMarket(filtered, marketFilter);

    console.log(
      `🌍 After market filter (${marketFilter}): ${filtered.length} signals`
    );

    return filtered;
  }, [realSignals, scoreThreshold, sectorFilter, marketFilter]);

  // Apply subscription limits - FRESH vs POSITION filtering
  const { filteredSignals, hiddenSignalsCount } = React.useMemo(() => {
    if (!subscription || signalLimits.canViewUnlimited) {
      return {
        filteredSignals: baseFilteredSignals,
        hiddenSignalsCount: 0,
      };
    }

    // Separate fresh vs existing positions
    const inPositionSignals = baseFilteredSignals.filter((signal) =>
      hasPosition(signal.ticker)
    );

    const freshSignals = baseFilteredSignals.filter(
      (signal) => !hasPosition(signal.ticker)
    );

    // Apply limits ONLY to fresh signals
    const limit = signalLimits.maxSignalsPerDay;
    const limitedFreshSignals = freshSignals.slice(0, limit);
    const hiddenFreshSignals = Math.max(0, freshSignals.length - limit);

    // Combine: ALL positions + LIMITED fresh signals
    const combinedSignals = [...inPositionSignals, ...limitedFreshSignals];

    console.log(`🎯 DEBUG - Signals page Fresh vs Position filtering:`, {
      tier: subscription.tier,
      limit,
      totalSignals: baseFilteredSignals.length,
      inPositionSignals: inPositionSignals.length,
      freshSignals: freshSignals.length,
      limitedFreshSignals: limitedFreshSignals.length,
      hiddenFreshSignals,
      finalCombined: combinedSignals.length,
    });

    return {
      filteredSignals: combinedSignals,
      hiddenSignalsCount: hiddenFreshSignals,
    };
  }, [baseFilteredSignals, subscription, signalLimits, hasPosition]);

  // Early returns AFTER all hooks are called
  // Redirect if not authenticated
  if (!user) {
    navigate("/");
    return null;
  }

  // Helper functions
  const toggleChart = (signalId: string) => {
    setShowChartsFor((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(signalId)) {
        newSet.delete(signalId);
      } else {
        newSet.add(signalId);
      }
      return newSet;
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "bg-emerald-600";
    if (score >= 80) return "bg-blue-600";
    if (score >= 70) return "bg-amber-600";
    return "bg-red-600";
  };

  // Loading state
  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <TestAlertSettings />

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Trading Signals
            </h1>
            <p className="text-slate-400">
              Loading real-time signals from database...
              {targetStock && ` Looking for ${targetStock}...`}
            </p>
          </div>
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="h-8 w-8 text-blue-400 animate-spin mr-3" />
            <span className="text-white text-lg">Loading signals...</span>
          </div>
        </div>
      </Layout>
    );
  }

  // Error state
  if (error) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <TestAlertSettings />

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Trading Signals
            </h1>
            <p className="text-slate-400">
              Error loading signals from database
            </p>
          </div>
          <div className="text-center py-12">
            <Activity className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl text-white mb-2">Error loading signals</h3>
            <p className="text-slate-400 mb-4">{error}</p>
            <Button onClick={refresh} className="bg-blue-600 hover:bg-blue-700">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  // Event handlers - FIXED FIELD NAMES
  const handleViewSignal = (signal: Signal) => {
    const finalScore = calculateFinalScore(signal.signals);
    const signalData = {
      symbol: signal.ticker,
      name: signal.name,
      price: signal.current_price || 0, // 🔧 FIXED: Use current_price instead of price
      change: signal.price_change_percent || 0, // 🔧 FIXED: Use price_change_percent instead of change
      signalScore: finalScore,
    };
    setSelectedSignal(signalData);
    setIsModalOpen(true);
  };

  const handleExecuteTrade = (tradeData: any) => {
    navigate("/open-positions", {
      state: { newTrade: tradeData },
    });
    setIsModalOpen(false);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    refreshPositions();
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TestAlertSettings />

        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Trading Signals
              </h1>
              <p className="text-slate-400">
                Browse and execute paper trades based on AI-powered signals
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-emerald-600/20 border border-emerald-500/30 rounded-lg px-3 py-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-emerald-400 font-medium text-sm">
                    {realSignals.length} Total Signals
                  </span>
                </div>
              </div>
              {targetStock && (
                <Badge className="bg-emerald-600 text-white animate-pulse">
                  Navigating to {targetStock}
                </Badge>
              )}
              <Button
                onClick={refresh}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2 border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Refresh</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Subscription Status Banner */}
        <SubscriptionStatusBanner />

        {/* Telegram Alerts Banner */}
        <TelegramAlertBanner
          showOnSignalsPage={true}
          onConnect={() => {
            // Navigate to settings page for telegram connection
            navigate("/settings");
          }}
        />

        {/* Filters Section */}
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 mb-8">
          <FilterHeader
            filteredSignals={filteredSignals}
            hiddenSignalsCount={hiddenSignalsCount}
            subscription={subscription}
            signalLimits={signalLimits}
          />
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-slate-300 text-sm font-medium mb-2 block">
                  Min Score: {scoreThreshold[0]}%
                </label>
                <Slider
                  value={scoreThreshold}
                  onValueChange={setScoreThreshold}
                  max={100}
                  min={50}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>
              <div>
                <label className="text-slate-300 text-sm font-medium mb-2 block">
                  Sector{" "}
                  {sectorsLoading && (
                    <span className="text-xs text-slate-500">(Loading...)</span>
                  )}
                </label>
                <Select value={sectorFilter} onValueChange={setSectorFilter}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="all">🌐 All Sectors</SelectItem>
                    {availableSectors.map((sector) => (
                      <SelectItem key={sector.value} value={sector.value}>
                        {sector.icon} {sector.name}
                      </SelectItem>
                    ))}
                    {sectorsError && (
                      <SelectItem value="refresh" disabled>
                        <span className="text-amber-400">
                          ⚠️ Error loading sectors
                        </span>
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {sectorsError && (
                  <button
                    onClick={refreshSectors}
                    className="text-xs text-blue-400 hover:text-blue-300 mt-1"
                  >
                    🔄 Retry loading sectors
                  </button>
                )}
              </div>
              {/* FIXED MARKET FILTER - ONLY GLOBAL AND USA */}
              <div>
                <label className="text-slate-300 text-sm font-medium mb-2 block">
                  Market
                </label>
                <Select value={marketFilter} onValueChange={setMarketFilter}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="global">🌍 Global</SelectItem>
                    <SelectItem value="usa">🇺🇸 USA</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active filters summary */}
            <div className="mt-4 pt-4 border-t border-slate-700/50">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-4 text-slate-400">
                  <span>📊 Score: {scoreThreshold[0]}%+</span>
                  <span>
                    🏢{" "}
                    {sectorFilter === "all"
                      ? "All Sectors"
                      : availableSectors.find((s) => s.value === sectorFilter)
                          ?.name || sectorFilter}
                  </span>
                  <span>
                    🌍{" "}
                    {marketFilter === "global"
                      ? "Global Markets"
                      : marketFilter === "usa"
                      ? "USA Markets"
                      : marketFilter}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-emerald-400">Filters Active</span>
                  {sectorsLoading && (
                    <span className="text-blue-400 text-xs">
                      📡 Loading sectors from Polygon.io...
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Signals List */}
        <div className="space-y-6">
          {filteredSignals.map((signal) => {
            const hasExistingPosition = hasPosition(signal.ticker);
            const buttonText = getButtonText(signal.ticker);
            const isHighlighted = highlightedStock === signal.ticker;

            return (
              <div key={signal.ticker} className="space-y-4">
                <div ref={(el) => (signalRefs.current[signal.ticker] = el)}>
                  <SignalCard
                    signal={signal}
                    isHighlighted={isHighlighted}
                    hasExistingPosition={hasExistingPosition}
                    buttonText={buttonText}
                    onViewSignal={handleViewSignal}
                    onToggleChart={toggleChart}
                    showChart={showChartsFor.has(signal.ticker)}
                  />
                </div>

                {/* Enhanced TradingView Chart */}
                {showChartsFor.has(signal.ticker) && (
                  <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 border-t-2 border-t-blue-500">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                          <BarChart3 className="h-6 w-6 text-blue-400" />
                          <div>
                            <h3 className="text-xl font-bold text-white">
                              Live Chart Analysis - {signal.ticker}
                            </h3>
                            <p className="text-slate-400">
                              Final Score {calculateFinalScore(signal.signals)}
                              /100 • {signal.name} • TradingView verification
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge
                            className={`${getScoreColor(
                              calculateFinalScore(signal.signals)
                            )} text-white`}
                          >
                            Final Score: {calculateFinalScore(signal.signals)}
                          </Badge>
                          <Button
                            onClick={() => toggleChart(signal.ticker)}
                            variant="outline"
                            size="sm"
                            className="border-slate-600 text-slate-400 hover:bg-slate-700"
                          >
                            Hide Chart
                          </Button>
                        </div>
                      </div>
                      <div className="bg-slate-900/50 rounded-lg p-4">
                        <TradingViewChart
                          symbol={signal.ticker}
                          theme="dark"
                          height={500}
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            );
          })}
        </div>

        {/* Upgrade prompt for hidden fresh signals */}
        {hiddenSignalsCount > 0 && (
          <UpgradePrompt hiddenCount={hiddenSignalsCount} />
        )}

        {/* No signals found */}
        {filteredSignals.length === 0 && !loading && (
          <div className="text-center py-12">
            <Activity className="h-12 w-12 text-slate-500 mx-auto mb-4" />
            <h3 className="text-xl text-white mb-2">No signals found</h3>
            <p className="text-slate-400">
              Try adjusting your filters to see more signals
            </p>
            <Button
              onClick={refresh}
              className="mt-4 bg-blue-600 hover:bg-blue-700"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Signals
            </Button>
          </div>
        )}

        {/* Signal Modal */}
        <SignalModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          signal={selectedSignal}
          onExecuteTrade={handleExecuteTrade}
          existingPositions={existingPositions}
        />

        {/* Disclaimer */}
        <div className="text-xs text-gray-500 text-center mt-8">
          *This is a simulation. No real capital is involved.
        </div>
      </div>
    </Layout>
  );
};

export default Signals;
