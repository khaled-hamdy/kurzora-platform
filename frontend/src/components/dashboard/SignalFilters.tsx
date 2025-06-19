import React from "react";
import { Filter, Calendar, Globe } from "lucide-react";
import { Button } from "../ui/button";
import { Slider } from "../ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import {
  MARKET_CONFIG,
  SECTOR_CONFIG,
  TIMEFRAME_CONFIG,
} from "../../config/filterConfig";

interface SignalFiltersProps {
  timeFilter: string;
  setTimeFilter: (value: string) => void;
  scoreThreshold: number[];
  setScoreThreshold: (value: number[]) => void;
  sectorFilter: string;
  setSectorFilter: (value: string) => void;
  marketFilter: string;
  setMarketFilter: (value: string) => void;
  language: string;
  onFiltersChange?: () => void; // NEW: Callback to trigger data refresh
}

const SignalFilters: React.FC<SignalFiltersProps> = ({
  timeFilter,
  setTimeFilter,
  scoreThreshold,
  setScoreThreshold,
  sectorFilter,
  setSectorFilter,
  marketFilter,
  setMarketFilter,
  language,
  onFiltersChange,
}) => {
  const timeframes = ["1H", "4H", "1D", "1W"];

  // ENHANCED: Market filter handler with data refresh
  const handleMarketChange = (value: string) => {
    console.log("🌍 Market filter changed to:", value);
    setMarketFilter(value);
    // Trigger data refresh after filter change
    if (onFiltersChange) {
      setTimeout(() => onFiltersChange(), 100);
    }
  };

  // ENHANCED: Sector filter handler with data refresh
  const handleSectorChange = (value: string) => {
    console.log("🏢 Sector filter changed to:", value);
    setSectorFilter(value);
    // Trigger data refresh after filter change
    if (onFiltersChange) {
      setTimeout(() => onFiltersChange(), 100);
    }
  };

  // ENHANCED: Score threshold handler with data refresh
  const handleScoreChange = (value: number[]) => {
    console.log("📊 Score threshold changed to:", value[0]);
    setScoreThreshold(value);
    // Trigger data refresh after filter change
    if (onFiltersChange) {
      setTimeout(() => onFiltersChange(), 200);
    }
  };

  // ENHANCED: Timeframe handler with data refresh
  const handleTimeframeChange = (period: string) => {
    console.log("⏰ Timeframe changed to:", period);
    setTimeFilter(period);
    // Trigger data refresh after filter change
    if (onFiltersChange) {
      setTimeout(() => onFiltersChange(), 100);
    }
  };

  return (
    <div className="space-y-6 p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
      {/* Row 1: Main Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Score Threshold - Enhanced with feedback */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <Label className="text-slate-300 text-sm font-medium">
              {language === "ar"
                ? `الحد الأدنى: ${scoreThreshold[0]}%`
                : language === "de"
                ? `Min Score: ${scoreThreshold[0]}%`
                : `Min Score: ${scoreThreshold[0]}%`}
            </Label>
          </div>
          <div className="px-2">
            <Slider
              value={scoreThreshold}
              onValueChange={handleScoreChange}
              max={100}
              min={60}
              step={5}
              className="w-full [&_[role=slider]]:h-6 [&_[role=slider]]:w-6 [&_[role=slider]]:bg-emerald-500 [&_[role=slider]]:border-2 [&_[role=slider]]:border-white [&_[role=slider]]:shadow-lg [&_.slider-track]:h-3 [&_.slider-range]:h-3 [&_.slider-range]:bg-emerald-500"
            />
          </div>
          {/* Score range indicator */}
          <div className="flex justify-between text-xs text-slate-400 px-2">
            <span>60</span>
            <span className="text-emerald-400 font-medium">
              {scoreThreshold[0]}
            </span>
            <span>100</span>
          </div>
        </div>

        {/* Market Filter - Enhanced with config */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Globe className="h-4 w-4 text-slate-400" />
            <Label className="text-slate-300 text-sm font-medium">
              {language === "ar"
                ? "السوق"
                : language === "de"
                ? "Markt"
                : "Market"}
            </Label>
          </div>
          <Select value={marketFilter} onValueChange={handleMarketChange}>
            <SelectTrigger className="w-full h-11 bg-slate-700 border-slate-600 text-white hover:bg-slate-600 focus:ring-2 focus:ring-emerald-400 transition-all duration-200 rounded-lg shadow-lg text-base">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600 rounded-lg shadow-xl z-50">
              {Object.entries(MARKET_CONFIG).map(([key, config]) => (
                <SelectItem
                  key={key}
                  value={key}
                  className="hover:bg-slate-600 focus:bg-slate-600 rounded cursor-pointer py-3 text-base"
                >
                  {config.icon} {config.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sector Filter - Enhanced with config */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <Label className="text-slate-300 text-sm font-medium">
              {language === "ar"
                ? "القطاع"
                : language === "de"
                ? "Sektor"
                : "Sector"}
            </Label>
          </div>
          <Select value={sectorFilter} onValueChange={handleSectorChange}>
            <SelectTrigger className="w-full h-11 bg-slate-700 border-slate-600 text-white hover:bg-slate-600 focus:ring-2 focus:ring-emerald-400 transition-all duration-200 rounded-lg shadow-lg text-base">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600 rounded-lg shadow-xl z-50">
              {Object.entries(SECTOR_CONFIG).map(([key, config]) => (
                <SelectItem
                  key={key}
                  value={key}
                  className="hover:bg-slate-600 focus:bg-slate-600 rounded cursor-pointer py-3 text-base"
                >
                  {config.icon} {config.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Row 2: Timeframe Buttons - Enhanced */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-slate-400" />
          <Label className="text-slate-300 text-sm font-medium">
            {language === "ar"
              ? "الإطار الزمني"
              : language === "de"
              ? "Zeitrahmen"
              : "Timeframe"}
          </Label>
        </div>
        <div className="flex flex-wrap gap-3">
          {timeframes.map((period) => (
            <Button
              key={period}
              variant={timeFilter === period ? "default" : "outline"}
              size="lg"
              onClick={() => handleTimeframeChange(period)}
              className={`px-6 py-3 text-base font-medium transition-all duration-200 rounded-lg shadow-md hover:shadow-lg min-w-[80px] ${
                timeFilter === period
                  ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-400/25"
                  : "bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600 hover:text-white hover:border-slate-500"
              }`}
            >
              {period}
            </Button>
          ))}
        </div>
      </div>

      {/* BONUS: Filter Status Indicator */}
      <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-700/50 pt-3">
        <div className="flex items-center space-x-4">
          <span>
            🌍{" "}
            {MARKET_CONFIG[marketFilter as keyof typeof MARKET_CONFIG]?.label}
          </span>
          <span>
            🏢{" "}
            {SECTOR_CONFIG[sectorFilter as keyof typeof SECTOR_CONFIG]?.label}
          </span>
          <span>📊 Min: {scoreThreshold[0]}%</span>
          <span>⏰ {timeFilter}</span>
        </div>
        <div className="text-emerald-400">Filters Active</div>
      </div>
    </div>
  );
};

export default SignalFilters;
