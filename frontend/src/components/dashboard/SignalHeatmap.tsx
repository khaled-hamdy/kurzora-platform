import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useLanguage } from "../../contexts/LanguageContext";
import SignalFilters from "./SignalFilters";
import SignalLegend from "./SignalLegend";
import SignalTable from "./SignalTable";
import SignalSummaryStats from "./SignalSummaryStats";
import SignalHeatmapHeader from "./SignalHeatmapHeader";
import { useSignals } from "../../hooks/useSignals";
import { useAutoRefresh } from "../../hooks/useAutoRefresh"; // NEW: Add this import
import {
  filterSignals,
  calculateFinalScore,
} from "../../utils/signalCalculations";
import { Signal } from "../../types/signal";

interface SignalHeatmapProps {
  onOpenSignalModal?: (signal: any) => void;
}

const SignalHeatmap: React.FC<SignalHeatmapProps> = ({ onOpenSignalModal }) => {
  const { language } = useLanguage();
  const [timeFilter, setTimeFilter] = useState("1D");
  const [scoreThreshold, setScoreThreshold] = useState([70]);
  const [sectorFilter, setSectorFilter] = useState("all");
  const [marketFilter, setMarketFilter] = useState("global");
  const [highlightedCategory, setHighlightedCategory] = useState<string | null>(
    null
  );

  // ORIGINAL: Keep your existing autoRefresh state
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Real data from Supabase
  const { signals, loading, error, refetch } = useSignals(); // Make sure refetch is available

  // NEW: Add functional auto-refresh that works with your existing toggle
  const {
    isAutoRefreshEnabled,
    toggleAutoRefresh,
    lastRefreshTime,
    nextRefreshIn,
    forceRefresh,
  } = useAutoRefresh({
    refreshFunction: refetch || (() => window.location.reload()), // Use refetch if available
    intervalMs: 2 * 60 * 1000, // 2 minutes
    enabledByDefault: autoRefresh,
  });

  // NEW: Sync the functional auto-refresh with your existing state
  React.useEffect(() => {
    if (isAutoRefreshEnabled !== autoRefresh) {
      setAutoRefresh(isAutoRefreshEnabled);
    }
  }, [isAutoRefreshEnabled, autoRefresh]);

  // NEW: Enhanced toggle that matches SignalHeatmapHeader's expected signature
  const handleAutoRefreshToggle = (value: boolean) => {
    console.log(`🔄 Auto-refresh ${value ? "ENABLED" : "DISABLED"}`);
    setAutoRefresh(value);

    // Sync with functional auto-refresh
    if (value !== isAutoRefreshEnabled) {
      toggleAutoRefresh();
    }
  };

  const handleViewSignal = (signal: Signal, timeframe: string) => {
    const finalScore = calculateFinalScore(signal.signals);
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

  const filteredSignals = filterSignals(
    signals,
    timeFilter,
    scoreThreshold,
    sectorFilter,
    marketFilter
  );

  return (
    <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:bg-slate-800/70 transition-all duration-300">
      <CardHeader>
        <CardTitle>
          <SignalHeatmapHeader
            autoRefresh={autoRefresh}
            setAutoRefresh={handleAutoRefreshToggle} // Use enhanced toggle that accepts boolean
            lastRefreshTime={lastRefreshTime} // NEW: Pass refresh time
            nextRefreshIn={nextRefreshIn} // NEW: Pass countdown
            onForceRefresh={forceRefresh} // NEW: Pass manual refresh function
          />
        </CardTitle>

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

        {/* NEW: Loading indicator when auto-refreshing */}
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

        {/* NEW: Auto-refresh status indicator */}
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
