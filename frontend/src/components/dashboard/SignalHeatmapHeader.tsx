import React from "react";
import { Activity, RotateCcw } from "lucide-react";
import { Switch } from "../ui/switch";
import { useLanguage } from "../../contexts/LanguageContext";
import {
  formatLastRefreshTime,
  formatCountdown,
} from "../../hooks/useAutoRefresh";

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

  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
      {/* Left: Title */}
      <div className="text-xl text-white flex items-center space-x-3">
        <Activity className="h-6 w-6 text-emerald-400" />
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
          <span>{t("signals.buySignalHeatmap")}</span>
        </div>
      </div>

      {/* Center: Last Updated with Enhanced Info */}
      <div className="flex-1 text-center space-y-1">
        <div className="text-slate-300 font-medium">
          {t("signals.lastUpdated")}:{" "}
          {lastRefreshTime
            ? formatLastRefreshTime(lastRefreshTime)
            : `2 ${t("dashboard.minAgo")}`}
        </div>

        {/* Countdown Timer (only show when auto-refresh is on) */}
        {autoRefresh && nextRefreshIn > 0 && (
          <div className="text-xs text-emerald-400">
            Next refresh: {formatCountdown(nextRefreshIn)}
          </div>
        )}
      </div>

      {/* Right: Auto Refresh Controls */}
      <div className="flex items-center space-x-3">
        {/* Manual Refresh Button */}
        {onForceRefresh && (
          <button
            onClick={onForceRefresh}
            className="p-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors"
            title="Refresh now"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        )}

        {/* Auto Refresh Toggle */}
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
