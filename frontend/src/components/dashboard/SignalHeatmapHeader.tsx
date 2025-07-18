import React from "react";
import { Activity, RotateCcw } from "lucide-react";
import { Switch } from "../ui/switch";
import { useLanguage } from "../../contexts/LanguageContext";
import {
  formatLastRefreshTime,
  formatCountdown,
  getMarketStatus, // 🎯 NEW: Import market status function
} from "../../hooks/useAutoRefresh";

// 🛡️ PRESERVATION: Interface exactly as before
interface SignalHeatmapHeaderProps {
  autoRefresh: boolean;
  setAutoRefresh: (value: boolean) => void; // Keep your original function signature
  lastRefreshTime?: Date | null; // NEW: Optional last refresh time
  nextRefreshIn?: number; // NEW: Optional countdown in seconds
  onForceRefresh?: () => void; // NEW: Optional manual refresh function
}

const SignalHeatmapHeader: React.FC<SignalHeatmapHeaderProps> = ({
  autoRefresh,
  setAutoRefresh,
  lastRefreshTime,
  nextRefreshIn = 0,
  onForceRefresh,
}) => {
  const { t } = useLanguage();

  // 🎯 NEW: Get current market status
  // 📝 HANDOVER: Updates automatically, shows why auto-refresh may be paused
  const marketStatus = getMarketStatus();

  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
      {/* 🛡️ PRESERVATION: Left section exactly as before */}
      <div className="text-xl text-white flex items-center space-x-3">
        <Activity className="h-6 w-6 text-emerald-400" />
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
          <span>{t("signals.buySignalHeatmap")}</span>
        </div>
      </div>

      {/* 🛡️ PRESERVATION: Center section with enhanced market guidance */}
      <div className="flex-1 text-center space-y-1">
        <div className="text-slate-300 font-medium">
          {t("signals.lastUpdated")}:{" "}
          {lastRefreshTime
            ? formatLastRefreshTime(lastRefreshTime)
            : `2 ${t("dashboard.minAgo")}`}
        </div>

        {/* 🎯 ENHANCED: Smart countdown display with market guidance */}
        {/* 📝 HANDOVER: Shows countdown when market open, helpful message when closed */}
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

      {/* 🛡️ PRESERVATION: Right section with market status */}
      <div className="flex items-center space-x-3">
        {/* 🎯 NEW: Market status indicator */}
        {/* 📝 HANDOVER: Shows why auto-refresh may be paused outside market hours */}
        <div className="text-xs text-slate-400 mr-2">
          <span
            className={`${
              marketStatus.isOpen ? "text-emerald-400" : "text-amber-400"
            }`}
          >
            {marketStatus.statusText}
          </span>
        </div>

        {/* 🛡️ PRESERVATION: Manual refresh button exactly as before */}
        {onForceRefresh && (
          <button
            onClick={onForceRefresh}
            className="p-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors"
            title="Refresh now"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        )}

        {/* 🛡️ PRESERVATION: Auto refresh toggle exactly as before */}
        <span className="text-slate-300 font-medium">
          {t("signals.autoRefresh")}:
        </span>
        <Switch
          checked={autoRefresh}
          onCheckedChange={setAutoRefresh}
          className="data-[state=checked]:bg-emerald-600"
        />
        <span
          className={`font-bold ${
            autoRefresh ? "text-emerald-400" : "text-slate-500"
          }`}
        >
          {autoRefresh ? t("common.on") : t("common.off")}
        </span>
      </div>
    </div>
  );
};

export default SignalHeatmapHeader;
