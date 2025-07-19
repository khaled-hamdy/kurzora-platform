import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useLanguage } from "../../contexts/LanguageContext";
// ✅ NEW: Import subscription hooks
import {
  useSubscriptionTier,
  useSignalLimits,
  useTrialStatus,
} from "../../hooks/useSubscriptionTier";
import { Button } from "../ui/button";
import { Crown, Zap } from "lucide-react";
import SignalFilters from "./SignalFilters";
import SignalLegend from "./SignalLegend";
import SignalTable from "./SignalTable";
import SignalSummaryStats from "./SignalSummaryStats";
import SignalHeatmapHeader from "./SignalHeatmapHeader";
import { useSignals } from "../../hooks/useSignals";
import { useAutoRefresh } from "../../hooks/useAutoRefresh";
import { usePositions } from "../../contexts/PositionsContext";
import {
  filterSignals,
  filterSignalsByFinalScore,
  calculateFinalScore,
} from "../../utils/signalCalculations";
import { Signal } from "../../types/signal";

interface SignalHeatmapProps {
  onOpenSignalModal?: (signal: any) => void;
}

// 🚀 CASE-INSENSITIVE SECTOR MATCHING FUNCTION
const normalizeSectorName = (sectorName: string): string => {
  return sectorName.toLowerCase().replace(/\s+/g, " ").trim();
};

const sectorMatches = (signalSector: string, filterSector: string): boolean => {
  if (filterSector === "all") return true;

  // Handle both the filter key and the actual sector name
  const normalizedSignalSector = normalizeSectorName(signalSector);
  const normalizedFilterSector = normalizeSectorName(filterSector);

  // Try exact match first
  if (normalizedSignalSector === normalizedFilterSector) {
    return true;
  }

  // Try partial matches for flexibility
  return (
    normalizedSignalSector.includes(normalizedFilterSector) ||
    normalizedFilterSector.includes(normalizedSignalSector)
  );
};

// 🚀 EXCHANGE-TO-COUNTRY MARKET MATCHING FUNCTION
const marketMatches = (signalMarket: string, filterMarket: string): boolean => {
  if (filterMarket === "global") return true;

  // Handle case where signal.market might be null/undefined
  if (!signalMarket) return filterMarket === "global";

  const normalizedSignalMarket = signalMarket.toLowerCase().trim();
  const normalizedFilterMarket = filterMarket.toLowerCase().trim();

  // 🚀 USA Exchange Mapping
  if (normalizedFilterMarket === "usa") {
    const usaExchanges = [
      "nasdaq",
      "nyse",
      "amex",
      "otc",
      "pink",
      "usa",
      "us",
      "united states",
    ];

    return usaExchanges.some(
      (exchange) =>
        normalizedSignalMarket === exchange ||
        normalizedSignalMarket.includes(exchange)
    );
  }

  // Direct country match
  if (normalizedSignalMarket === normalizedFilterMarket) {
    return true;
  }

  // 🚀 Future: Add other country mappings here
  // Saudi Arabia: TADAWUL
  // UAE: DFM, ADX
  // etc.

  // Fallback: partial match
  return (
    normalizedSignalMarket.includes(normalizedFilterMarket) ||
    normalizedFilterMarket.includes(normalizedSignalMarket)
  );
};

// 📝 SESSION #206: DASHBOARD UPGRADE PROMPT COMPONENT REMOVED
// Previously: Large DashboardUpgradePrompt component with crown icon, upgrade buttons, and features list
// Reason: Clean UX strategy - remove upgrade fatigue from Dashboard
// Users now focus on their signal data without pressure

// ✅ NEW: Dashboard Subscription Status Indicator
const DashboardSubscriptionIndicator: React.FC = () => {
  const subscription = useSubscriptionTier();
  const trialStatus = useTrialStatus();
  const signalLimits = useSignalLimits();

  if (!subscription) return null;

  // Don't show banner in dashboard - just a subtle indicator
  if (trialStatus?.isTrialActive) {
    return (
      <div className="text-center text-xs text-purple-400 mb-2">
        ✨ Trial Active - {trialStatus.trialDaysLeft} days left of unlimited
        access
      </div>
    );
  }

  if (signalLimits.canViewUnlimited) {
    return (
      <div className="text-center text-xs text-emerald-400 mb-2">
        👑 Professional Plan - Unlimited signals access
      </div>
    );
  }

  return (
    <div className="text-center text-xs text-amber-400 mb-2">
      ⚡ Starter Plan - {signalLimits.maxSignalsPerDay} fresh signals per day +
      all your positions
    </div>
  );
};

const SignalHeatmap: React.FC<SignalHeatmapProps> = ({ onOpenSignalModal }) => {
  const { language } = useLanguage();
  const [timeFilter, setTimeFilter] = useState("1D");
  // 🔧 FIXED: Changed initial scoreThreshold from [70] to [30] to match new database query
  const [scoreThreshold, setScoreThreshold] = useState([30]);
  const [sectorFilter, setSectorFilter] = useState("all");
  const [marketFilter, setMarketFilter] = useState("global");
  const [highlightedCategory, setHighlightedCategory] = useState<string | null>(
    null
  );

  // ✅ NEW: Import subscription data
  const subscription = useSubscriptionTier();
  const signalLimits = useSignalLimits();
  const trialStatus = useTrialStatus();

  // ✅ NEW: Import position detection
  const { hasPosition } = usePositions();

  // ORIGINAL: Keep your existing autoRefresh state
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Real data from Supabase
  const { signals, loading, error, refetch } = useSignals();

  // FIXED: Remove intervalMs to use the new 15-minute default
  const {
    isAutoRefreshEnabled,
    toggleAutoRefresh,
    lastRefreshTime,
    nextRefreshIn,
    forceRefresh,
  } = useAutoRefresh({
    refreshFunction: refetch || (() => window.location.reload()),
    // Removed intervalMs line - now uses 15 minute default!
    enabledByDefault: autoRefresh,
  });

  // Sync the functional auto-refresh with your existing state
  React.useEffect(() => {
    if (isAutoRefreshEnabled !== autoRefresh) {
      setAutoRefresh(isAutoRefreshEnabled);
    }
  }, [isAutoRefreshEnabled, autoRefresh]);

  // Enhanced toggle that matches SignalHeatmapHeader's expected signature
  const handleAutoRefreshToggle = (value: boolean) => {
    console.log(`🔄 Auto-refresh ${value ? "ENABLED" : "DISABLED"}`);
    setAutoRefresh(value);

    // Sync with functional auto-refresh
    if (value !== isAutoRefreshEnabled) {
      toggleAutoRefresh();
    }
  };

  // UPDATED: Enhanced handleViewSignal to support Execute functionality
  const handleViewSignal = (signal: Signal, timeframe: string) => {
    // 🔧 FIXED: Use database score instead of recalculating
    const finalScore =
      (signal as any).confidence_score ||
      (signal as any).final_score ||
      calculateFinalScore(signal.signals);

    // Check if this is an "execute" action
    if (timeframe === "execute") {
      // For execute, we want to trigger your existing execute modal
      const executeSignalData = {
        symbol: signal.ticker,
        name: signal.name,
        price: signal.price,
        change: signal.change,
        signalScore: finalScore,
        // Add additional data your execute modal might need
        entryPrice: signal.price,
        currentPrice: signal.price,
        sector: signal.sector,
        market: signal.market,
        status: (signal as any).status || "active",
        // Indicate this is for execution
        action: "execute",
      };

      if (onOpenSignalModal) {
        onOpenSignalModal(executeSignalData);
      }
      return;
    }

    // For regular "view" actions, use the original logic
    const signalData = {
      symbol: signal.ticker,
      name: signal.name,
      price: signal.price,
      change: signal.change,
      signalScore: finalScore,
    };

    if (onOpenSignalModal) {
      onOpenSignalModal(signalData);
    }
  };

  // ✅ STEP 1: Apply consistent final score filtering - 🔧 FIXED DATABASE SCORE BUG
  const baseFilteredSignals = React.useMemo(() => {
    return signals.filter((signal) => {
      // 🔧 FIXED: Use database score instead of recalculating (fixes 45-47 signals showing when slider = 70%)
      const finalScore =
        (signal as any).confidence_score ||
        (signal as any).final_score ||
        calculateFinalScore(signal.signals);
      const meetsThreshold = finalScore >= scoreThreshold[0];

      // 🚀 FIXED: Use case-insensitive sector matching instead of direct string comparison
      const meetsSector = sectorMatches(signal.sector || "", sectorFilter);

      // 🚀 FIXED: Use exchange-to-country market matching instead of direct string comparison
      const meetsMarket = marketMatches(signal.market || "", marketFilter);

      // Debug logging when filters are active
      if (sectorFilter !== "all" || marketFilter !== "global") {
        console.log(`🔍 Signal ${signal.ticker} filtering:`, {
          sector: signal.sector,
          sectorFilter,
          meetsSector,
          market: signal.market,
          marketFilter,
          meetsMarket,
          finalScore,
          meetsThreshold,
        });
      }

      return meetsThreshold && meetsSector && meetsMarket;
    });
  }, [signals, scoreThreshold, sectorFilter, marketFilter]);

  // ✅ UPDATED STEP 2: Apply subscription limits ONLY to fresh signals (not positions)
  const { filteredSignals, hiddenSignalsCount } = React.useMemo(() => {
    if (!subscription || signalLimits.canViewUnlimited) {
      // Professional users or trial users get all signals
      return {
        filteredSignals: baseFilteredSignals,
        hiddenSignalsCount: 0,
      };
    }

    // ✅ NEW BUSINESS LOGIC: Separate fresh vs. existing positions
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

    console.log(`🎯 DEBUG - Dashboard Fresh vs Position filtering:`, {
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

  return (
    <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:bg-slate-800/70 transition-all duration-300">
      <CardHeader>
        <CardTitle>
          <SignalHeatmapHeader
            autoRefresh={autoRefresh}
            setAutoRefresh={handleAutoRefreshToggle}
            lastRefreshTime={lastRefreshTime}
            nextRefreshIn={nextRefreshIn}
            onForceRefresh={forceRefresh}
          />
        </CardTitle>

        {/* ✅ NEW: Show subscription status in Dashboard */}
        <DashboardSubscriptionIndicator />

        <SignalLegend />
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Filter Bar */}
        <SignalFilters
          timeFilter={timeFilter}
          setTimeFilter={setTimeFilter}
          scoreThreshold={scoreThreshold}
          setScoreThreshold={setScoreThreshold}
          sectorFilter={sectorFilter}
          setSectorFilter={setSectorFilter}
          marketFilter={marketFilter}
          setMarketFilter={setMarketFilter}
          language={language}
        />

        {/* ✅ UPDATED: Show subscription-aware signal count with fresh vs position breakdown */}
        {subscription && (
          <div className="text-center text-sm text-slate-400">
            Showing {filteredSignals.length} signals
            {baseFilteredSignals.length !== filteredSignals.length && (
              <span className="text-amber-400">
                {" "}
                ({hiddenSignalsCount} fresh signals hidden by{" "}
                {subscription.tier} plan limits)
              </span>
            )}
            <div className="text-xs text-slate-500 mt-1">
              All your positions +{" "}
              {signalLimits.canViewUnlimited
                ? "unlimited"
                : signalLimits.maxSignalsPerDay}{" "}
              fresh signals
            </div>
          </div>
        )}

        {/* Loading indicator when auto-refreshing */}
        {loading && autoRefresh && (
          <div className="text-center py-2">
            <div className="inline-flex items-center space-x-2 text-emerald-400">
              <div className="w-3 h-3 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm">Auto-refreshing signals...</span>
            </div>
          </div>
        )}

        <SignalTable
          filteredSignals={filteredSignals}
          timeFilter={timeFilter}
          highlightedCategory={highlightedCategory}
          onViewSignal={handleViewSignal}
        />

        <SignalSummaryStats
          filteredSignals={filteredSignals}
          timeFilter={timeFilter}
          highlightedCategory={highlightedCategory}
          setHighlightedCategory={setHighlightedCategory}
        />

        {/* 📝 SESSION #206: DASHBOARD UPGRADE PROMPT REMOVED FOR CLEAN UX */}
        {/* Previously: Large upgrade prompt showed here when hiddenSignalsCount > 0 */}
        {/* Result: Users now focus on their signal data without upgrade pressure */}

        {/* Auto-refresh status indicator */}
        <div className="text-center text-xs text-slate-500 border-t border-slate-700 pt-3">
          {autoRefresh ? (
            <span>
              🔄 Auto-refresh active • Next update in{" "}
              {Math.floor(nextRefreshIn / 60)}m {nextRefreshIn % 60}s
            </span>
          ) : (
            <span>
              ⏸️ Auto-refresh paused • Toggle to enable automatic updates
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SignalHeatmap;
