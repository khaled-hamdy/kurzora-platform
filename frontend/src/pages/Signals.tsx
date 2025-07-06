// Complete Enhanced Signals.tsx - UX IMPROVEMENTS IMPLEMENTED
// src/pages/Signals.tsx
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
  Sparkles,
  Settings,
  Play,
  Pause,
  Timer,
  Save,
  CheckCircle,
  DollarSign,
  X,
} from "lucide-react";
import { useToast } from "../hooks/use-toast";
// 🚀 UPDATED: Import the enhanced SignalModal with real values support
import EnhancedSignalModal from "../components/signals/SignalModal";
import { useSignalsPageData } from "../hooks/useSignalsPageData";
import { usePositions } from "../contexts/PositionsContext";
import {
  filterSignalsByFinalScore,
  calculateFinalScore,
} from "../utils/signalCalculations";
import { Signal } from "../types/signal";
import { useSectorData } from "../hooks/useSectorData";

// 🚀 NEW: Import the signal generation integration
import { usePeriodicSignalGeneration } from "../hooks/usePeriodicSignalGeneration";
import { GenerationProgress } from "../services/signalGenerationService";

// ENHANCED DATE FORMATTING UTILITY - PRESERVED FROM ORIGINAL
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

// Get relative time with icon for additional context - PRESERVED FROM ORIGINAL
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

// Filter signals by market (Global vs USA) - PRESERVED FROM ORIGINAL
const filterSignalsByMarket = (
  signals: Signal[],
  marketFilter: string
): Signal[] => {
  if (marketFilter === "global") {
    return signals;
  }

  if (marketFilter === "usa") {
    return signals.filter((signal) => {
      if (signal.market) {
        const market = signal.market.toLowerCase();
        return (
          market.includes("us") ||
          market.includes("nyse") ||
          market.includes("nasdaq") ||
          market.includes("amex") ||
          market === "stocks"
        );
      }

      const ticker = signal.ticker.toUpperCase();
      const isUSPattern =
        /^[A-Z]{1,5}$/.test(ticker) &&
        !ticker.includes("$") &&
        ticker.length <= 5;

      return isUSPattern;
    });
  }

  return signals;
};

// 🚀 IMPROVED: Signal Generation Controls with Better UX
const SignalGenerationControls: React.FC<{
  onGenerateManually: () => void;
  canGenerate: boolean;
  isGenerating: boolean;
  progress?: GenerationProgress;
  periodicConfig: any;
  timeUntilNext?: string | null;
  isMarketHours: boolean;
}> = ({
  onGenerateManually,
  canGenerate,
  isGenerating,
  progress,
  periodicConfig,
  timeUntilNext,
  isMarketHours,
}) => {
  const navigate = useNavigate();

  // 🚀 NEW: Navigate directly to Signal Generation section
  const handleSettingsNavigation = () => {
    navigate("/settings", {
      state: { scrollToSection: "signal-generation" },
    });
  };

  // Enhanced progress display with better error handling
  const getProgressDisplay = () => {
    if (!progress) return null;

    const displayProgress = Math.max(0, Math.min(100, progress.progress || 0));
    const progressMessage = progress.message || "Processing...";
    const currentStock = progress.currentStock || "";

    const isStuck =
      displayProgress === 85 &&
      progressMessage.includes("Fetching") &&
      currentStock.includes("(0/0)");

    return (
      <div className="flex items-center space-x-2 bg-blue-900/30 border border-blue-500/40 rounded-lg px-4 py-2.5 backdrop-blur-sm">
        <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
        <div className="text-sm min-w-0">
          <div className="text-blue-300 font-medium truncate">
            {isStuck ? "Completing signal analysis..." : progressMessage}
          </div>
          {currentStock && !isStuck && (
            <div className="text-xs text-blue-400 truncate">{currentStock}</div>
          )}
        </div>
        <div className="text-sm text-blue-400 font-bold flex-shrink-0">
          {displayProgress}%
        </div>
      </div>
    );
  };

  return (
    <div className="flex items-center space-x-3">
      {/* Enhanced Generation Progress */}
      {isGenerating && getProgressDisplay()}

      {/* Periodic Status */}
      {!isGenerating && periodicConfig.enabled && timeUntilNext && (
        <div className="flex items-center space-x-2 bg-emerald-900/30 border border-emerald-500/40 rounded-lg px-3 py-2 backdrop-blur-sm">
          <Timer className="h-3 w-3 text-emerald-400 flex-shrink-0" />
          <div className="text-xs">
            <div className="text-emerald-400 font-medium">
              Auto: {timeUntilNext}
            </div>
            <div className="text-emerald-300">
              {isMarketHours ? "Market Open" : "Market Closed"}
            </div>
          </div>
        </div>
      )}

      {/* Manual Generate Button */}
      <Button
        onClick={onGenerateManually}
        disabled={!canGenerate}
        className={`${
          isGenerating
            ? "bg-blue-600/50 cursor-not-allowed"
            : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        } text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 flex-shrink-0`}
      >
        <Sparkles className={`h-4 w-4 ${isGenerating ? "animate-spin" : ""}`} />
        <span className="whitespace-nowrap">
          {isGenerating ? "Generating..." : "Generate Fresh Signals"}
        </span>
      </Button>

      {/* 🚀 IMPROVED: Industry Standard Settings Button */}
      <Button
        onClick={handleSettingsNavigation}
        variant="outline"
        size="sm"
        className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white flex-shrink-0 bg-slate-800/50"
      >
        <Settings className="h-4 w-4 mr-2" />
        <span className="whitespace-nowrap">Auto-Generation Settings</span>
      </Button>
    </div>
  );
};

// Test component to verify alert settings hook - PRESERVED FROM ORIGINAL
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

// Simple Telegram indicator component - PRESERVED FROM ORIGINAL
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

// 🚀 REMOVED: SubscriptionStatusBanner Component (replaced with Pro badge in header)

// Enhanced Filter Header Component with Generation Controls - ENHANCED
const FilterHeader: React.FC<{
  filteredSignals: Signal[];
  hiddenSignalsCount: number;
  subscription: any;
  signalLimits: any;
  generationControls: React.ReactNode;
}> = ({
  filteredSignals,
  hiddenSignalsCount,
  subscription,
  signalLimits,
  generationControls,
}) => {
  return (
    <CardHeader>
      <CardTitle className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-blue-400" />
          <span className="text-white">Trading Filters</span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Generation Controls */}
          <div className="relative">{generationControls}</div>

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

          {/* 🚀 NEW: Small Pro Badge */}
          {signalLimits.canViewUnlimited && (
            <Badge className="bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 text-xs px-2 py-1">
              <Crown className="h-3 w-3 mr-1" />
              Pro
            </Badge>
          )}
        </div>
      </CardTitle>

      <div className="text-xs text-slate-400 mt-2">
        {subscription && (
          <div className="flex items-center justify-between">
            <span>Real-time market scanning active</span>
            <span>
              {signalLimits.canViewUnlimited ? (
                <span className="text-emerald-400">Unlimited Access</span>
              ) : (
                <span className="text-amber-400">
                  {signalLimits.maxSignalsPerDay} fresh/day + positions
                </span>
              )}
            </span>
          </div>
        )}
      </div>
    </CardHeader>
  );
};

// Upgrade Prompt Component - PRESERVED FROM ORIGINAL
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

// ENHANCED SIGNAL CARD COMPONENT - PRESERVED FROM ORIGINAL
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

                {/* FORMATTED SIGNAL DATE WITH CONTEXT */}
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

// Main Signals Component with Integration - ENHANCED
const Signals: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // All existing hooks - PRESERVED
  const subscription = useSubscriptionTier();
  const signalLimits = useSignalLimits();
  const trialStatus = useTrialStatus();
  const { hasPosition, getButtonText, refreshPositions, existingPositions } =
    usePositions();

  // 🚀 NEW: Periodic signal generation hook
  const {
    config: periodicConfig,
    state: generationState,
    generateSignalsManually,
    updateConfig: updatePeriodicConfig,
    isMarketHours,
    timeUntilNext,
    canGenerate,
  } = usePeriodicSignalGeneration({
    enabled: false, // Start disabled, user can enable
    intervalHours: 4, // Default 4 hours
    marketHoursOnly: true,
  });

  // Existing state - PRESERVED
  const [scoreThreshold, setScoreThreshold] = useState([70]);
  const [sectorFilter, setSectorFilter] = useState("all");
  const [marketFilter, setMarketFilter] = useState("global");
  const [selectedSignal, setSelectedSignal] = useState<any>(null); // 🚀 UPDATED: Type changed to support enhanced signal data
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showChartsFor, setShowChartsFor] = useState<Set<string>>(new Set());
  const [targetStock, setTargetStock] = useState<string | null>(null);
  const [highlightedStock, setHighlightedStock] = useState<string | null>(null);
  const signalRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Existing data hooks - PRESERVED
  const {
    signals: realSignals,
    loading,
    error,
    refresh,
  } = useSignalsPageData();

  const {
    sectors: availableSectors,
    loading: sectorsLoading,
    error: sectorsError,
    refresh: refreshSectors,
  } = useSectorData();

  // 🚀 NEW: Handle manual signal generation
  const handleGenerateSignals = async () => {
    try {
      const result = await generateSignalsManually();

      if (result.success) {
        toast({
          title: "✅ Signals Generated Successfully!",
          description: `Generated ${result.signalsGenerated} signals, saved ${
            result.signalsSaved
          } to database in ${Math.round(result.duration / 1000)}s`,
        });

        // Refresh the signals display using existing refresh mechanism
        refresh();
      } else {
        toast({
          title: "❌ Signal Generation Failed",
          description: result.errors.join(", "),
          variant: "destructive",
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast({
        title: "❌ Generation Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  // ALL EXISTING useEffect hooks and logic - PRESERVED COMPLETELY
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const stockParam = searchParams.get("stock");
    if (stockParam) {
      setTargetStock(stockParam.toUpperCase());
    }
  }, [location.search]);

  // Enhanced filtering (existing logic) - PRESERVED
  const baseFilteredSignals = React.useMemo(() => {
    let filtered = filterSignalsByFinalScore(
      realSignals,
      scoreThreshold,
      sectorFilter,
      "global"
    );
    filtered = filterSignalsByMarket(filtered, marketFilter);
    return filtered;
  }, [realSignals, scoreThreshold, sectorFilter, marketFilter]);

  // Apply subscription limits (existing logic) - PRESERVED
  const { filteredSignals, hiddenSignalsCount } = React.useMemo(() => {
    if (!subscription || signalLimits.canViewUnlimited) {
      return {
        filteredSignals: baseFilteredSignals,
        hiddenSignalsCount: 0,
      };
    }

    const inPositionSignals = baseFilteredSignals.filter((signal) =>
      hasPosition(signal.ticker)
    );

    const freshSignals = baseFilteredSignals.filter(
      (signal) => !hasPosition(signal.ticker)
    );

    const limit = signalLimits.maxSignalsPerDay;
    const limitedFreshSignals = freshSignals.slice(0, limit);
    const hiddenFreshSignals = Math.max(0, freshSignals.length - limit);

    const combinedSignals = [...inPositionSignals, ...limitedFreshSignals];

    return {
      filteredSignals: combinedSignals,
      hiddenSignalsCount: hiddenFreshSignals,
    };
  }, [baseFilteredSignals, subscription, signalLimits, hasPosition]);

  // Early returns - PRESERVED
  if (!user) {
    navigate("/");
    return null;
  }

  // Helper functions - PRESERVED
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

  // Loading state - PRESERVED
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

  // Error state - PRESERVED
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

  // 🚀 ENHANCED: Event handler with REAL values support
  const handleViewSignal = (signal: Signal) => {
    const finalScore = calculateFinalScore(signal.signals);

    // 🚀 CRITICAL: Pass FULL signal object with real calculated values
    const enhancedSignalData = {
      symbol: signal.ticker,
      name: signal.name,
      price: signal.current_price || 0,
      change: signal.price_change_percent || 0,
      signalScore: finalScore,

      // 🚀 CRITICAL: Pass real calculated values from enhanced-signal-processor
      entryPrice: signal.entryPrice || signal.current_price, // Real calculated entry price
      stopLoss: signal.stopLoss, // Real calculated stop loss
      takeProfit: signal.takeProfit, // Real calculated take profit
      riskRewardRatio: signal.riskRewardRatio, // Real calculated R/R ratio
      atr: signal.atr, // Real ATR value
      positionSize: signal.positionSize, // Real calculated position size
      sector: signal.sector, // Sector information

      // Raw signal data for advanced calculations
      signals: signal.signals || {
        "1H": finalScore,
        "4H": finalScore,
        "1D": finalScore,
        "1W": finalScore,
      },
    };

    console.log(
      "🔍 Passing enhanced signal data to modal:",
      enhancedSignalData
    );
    console.log("✅ Real values included:", {
      entryPrice: enhancedSignalData.entryPrice,
      stopLoss: enhancedSignalData.stopLoss,
      takeProfit: enhancedSignalData.takeProfit,
      riskRewardRatio: enhancedSignalData.riskRewardRatio,
      atr: enhancedSignalData.atr,
    });

    setSelectedSignal(enhancedSignalData);
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

        {/* Header Section - PRESERVED */}
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

        {/* 🚀 REMOVED: SubscriptionStatusBanner (replaced with Pro badge in FilterHeader) */}

        {/* Telegram Alerts Banner - FIXED (hardcoded ≥80% removed) */}
        <TelegramAlertBanner
          showOnSignalsPage={true}
          onConnect={() => {
            navigate("/settings");
          }}
        />

        {/* 🚀 ENHANCED: Filters Section with Signal Generation Controls */}
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 mb-8">
          <FilterHeader
            filteredSignals={filteredSignals}
            hiddenSignalsCount={hiddenSignalsCount}
            subscription={subscription}
            signalLimits={signalLimits}
            generationControls={
              <SignalGenerationControls
                onGenerateManually={handleGenerateSignals}
                canGenerate={canGenerate}
                isGenerating={generationState.isGenerating}
                progress={generationState.progress}
                periodicConfig={periodicConfig}
                timeUntilNext={timeUntilNext}
                isMarketHours={isMarketHours}
              />
            }
          />
          <CardContent>
            {/* Existing filter controls - PRESERVED COMPLETELY */}
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
                  </SelectContent>
                </Select>
              </div>
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

            {/* Active filters summary - PRESERVED */}
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
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Signals List - PRESERVED COMPLETELY */}
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

                {/* TradingView Chart (if shown) - PRESERVED */}
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
                        <div className="h-96 bg-slate-800 rounded flex items-center justify-center">
                          <span className="text-slate-400">
                            TradingView Chart: {signal.ticker}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            );
          })}
        </div>

        {/* Upgrade prompt for hidden fresh signals - PRESERVED */}
        {hiddenSignalsCount > 0 && (
          <UpgradePrompt hiddenCount={hiddenSignalsCount} />
        )}

        {/* No signals found - FIXED (removed "Refresh Signals" button) */}
        {filteredSignals.length === 0 && !loading && (
          <div className="text-center py-12">
            <Activity className="h-12 w-12 text-slate-500 mx-auto mb-4" />
            <h3 className="text-xl text-white mb-2">No signals found</h3>
            <p className="text-slate-400 mb-4">
              Try adjusting your filters or generate fresh signals using the
              "Generate Fresh Signals" button above
            </p>
          </div>
        )}

        {/* 🚀 UPDATED: Enhanced Signal Modal with real values and custom entry price */}
        <EnhancedSignalModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          signal={selectedSignal}
          onExecuteTrade={handleExecuteTrade}
          existingPositions={existingPositions}
        />

        {/* Disclaimer - PRESERVED */}
        <div className="text-xs text-gray-500 text-center mt-8">
          *This is a simulation. No real capital is involved.
        </div>
      </div>
    </Layout>
  );
};

export default Signals;
