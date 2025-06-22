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
  calculateFinalScore,
} from "../../utils/signalCalculations";
import { Signal } from "../../types/signal";

interface SignalHeatmapProps {
  onOpenSignalModal?: (signal: any) => void;
}

// ✅ NEW: Dashboard Upgrade Prompt Component
const DashboardUpgradePrompt: React.FC<{ hiddenCount: number }> = ({
  hiddenCount,
}) => {
  const signalLimits = useSignalLimits();

  return (
    <div className="mt-4 p-4 bg-gradient-to-r from-amber-900/30 to-orange-900/30 border border-amber-500/50 rounded-lg">
      <div className="text-center">
        <div className="flex justify-center mb-3">
          <div className="bg-amber-600 rounded-full p-2">
            <Crown className="h-6 w-6 text-white" />
          </div>
        </div>
        <h3 className="text-lg font-bold text-white mb-2">
          {hiddenCount} More Fresh Signals Available
        </h3>
        <p className="text-slate-300 text-sm mb-3">
          You're viewing {signalLimits.maxSignalsPerDay} fresh signals. Your
          existing positions are always shown. Upgrade to Professional to see
          all new trading opportunities.
        </p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Button className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 text-sm">
            <Crown className="h-4 w-4 mr-2" />
            Upgrade to Professional
          </Button>
          <Button
            variant="outline"
            className="border-amber-500 text-amber-400 hover:bg-amber-600/10 px-6 py-2 text-sm"
          >
            View All Pricing
          </Button>
        </div>
        <p className="text-xs text-slate-400 mt-2">
          ✨ Unlimited signals • AI explanations • Premium Telegram group
        </p>
      </div>
    </div>
  );
};

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
  const [scoreThreshold, setScoreThreshold] = useState([70]);
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
    const finalScore = calculateFinalScore(signal.signals);

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
        status: signal.status,
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

  // ✅ STEP 1: Apply existing filters first
  const baseFilteredSignals = filterSignals(
    signals,
    timeFilter,
    scoreThreshold,
    sectorFilter,
    marketFilter
  );

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

        {/* ✅ UPDATED: Show upgrade prompt for hidden FRESH signals */}
        {hiddenSignalsCount > 0 && (
          <DashboardUpgradePrompt hiddenCount={hiddenSignalsCount} />
        )}

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
