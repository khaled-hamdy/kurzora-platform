import React from "react";
import { Activity, RotateCcw } from "lucide-react";
import { Switch } from "../ui/switch";
import { Badge } from "../ui/badge";
import { useLanguage } from "../../contexts/LanguageContext";
import {
  formatLastRefreshTime,
  formatCountdown,
  getMarketStatus,
} from "../../hooks/useAutoRefresh";

// 🎯 PURPOSE: Signals page header with market hours auto-refresh controls
// 🔧 SESSION: Market Hours Auto-Refresh - Signals Page Implementation
// 🛡️ PRESERVATION: Same pattern as SignalHeatmapHeader.tsx for consistency
// 📝 HANDOVER: Complete header component with auto-refresh, market status, and target stock support

interface SignalsPageHeaderProps {
  autoRefresh: boolean;
  setAutoRefresh: (value: boolean) => void;
  lastRefreshTime?: Date | null;
  nextRefreshIn?: number;
  onForceRefresh?: () => void;
  targetStock?: string | null; // 🎯 NEW: Support for target stock navigation badge
}

const SignalsPageHeader: React.FC<SignalsPageHeaderProps> = ({
  autoRefresh,
  setAutoRefresh,
  lastRefreshTime,
  nextRefreshIn = 0,
  onForceRefresh,
  targetStock,
}) => {
  const { t } = useLanguage();

  // 🎯 NEW: Get current market status
  // 📝 HANDOVER: Updates automatically, shows why auto-refresh may be paused
  const marketStatus = getMarketStatus();

  return (
    <div className="mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* 🛡️ PRESERVATION: Left section - Main title and description */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-white mb-2">
            Trading Signals
          </h1>
          <p className="text-slate-400">
            Browse and execute paper trades based on AI-powered signals •
            Automated generation 3x daily
          </p>

          {/* 🎯 NEW: Last updated display with market guidance */}
          <div className="mt-2 space-y-1">
            <div className="text-sm text-slate-300">
              {t("signals.lastUpdated")}:{" "}
              {lastRefreshTime
                ? formatLastRefreshTime(lastRefreshTime)
                : "Loading..."}
            </div>

            {/* 🎯 ENHANCED: Smart countdown display with market guidance */}
            {autoRefresh && (
              <div className="text-xs">
                {marketStatus.isOpen && nextRefreshIn > 0 ? (
                  // Market is open - show countdown timer
                  <span className="text-emerald-400">
                    Next refresh: {formatCountdown(nextRefreshIn)}
                  </span>
                ) : marketStatus.isOpen && nextRefreshIn === 0 ? (
                  // Market is open but no countdown (edge case)
                  <span className="text-emerald-400">Auto-refresh active</span>
                ) : (
                  // Market is closed - show helpful guidance
                  <span className="text-amber-400">
                    Resumes when market opens (Mon-Fri 9:30 AM - 4:00 PM EST)
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 🛡️ PRESERVATION: Right section - Target stock badge and auto-refresh controls */}
        <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          {/* 🛡️ PRESERVATION: Target stock navigation badge */}
          {targetStock && (
            <Badge className="bg-emerald-600 text-white animate-pulse">
              Navigating to {targetStock}
            </Badge>
          )}

          {/* 🎯 NEW: Auto-refresh controls section */}
          <div className="flex items-center space-x-3 bg-slate-800/30 rounded-lg px-4 py-2 border border-slate-700/50">
            {/* 🎯 NEW: Market status indicator */}
            <div className="text-xs text-slate-400">
              <span
                className={`${
                  marketStatus.isOpen ? "text-emerald-400" : "text-amber-400"
                }`}
              >
                {marketStatus.statusText}
              </span>
            </div>

            {/* 🎯 NEW: Manual refresh button */}
            {onForceRefresh && (
              <button
                onClick={onForceRefresh}
                className="p-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors"
                title="Refresh now"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            )}

            {/* 🎯 NEW: Auto refresh toggle */}
            <span className="text-slate-300 font-medium text-sm">
              {t("signals.autoRefresh")}:
            </span>
            <Switch
              checked={autoRefresh}
              onCheckedChange={setAutoRefresh}
              className="data-[state=checked]:bg-emerald-600"
            />
            <span
              className={`font-bold text-sm ${
                autoRefresh ? "text-emerald-400" : "text-slate-500"
              }`}
            >
              {autoRefresh ? t("common.on") : t("common.off")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignalsPageHeader;
