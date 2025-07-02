// ===================================================================
// ENHANCED SIGNAL FILTERS UI COMPONENT
// ===================================================================
// File: src/components/signals/EnhancedFiltersPanel.tsx
// Purpose: Professional filtering interface with presets and customization

import React, { useState, useEffect } from "react";
import {
  Filter,
  Settings,
  Save,
  Download,
  Upload,
  BarChart3,
  TrendingUp,
  Shield,
  Brain,
  Zap,
  ChevronDown,
  ChevronRight,
  X,
  Check,
  AlertTriangle,
  Info,
} from "lucide-react";
import {
  EnhancedSignalFilter,
  EnhancedFilterConfig,
  FILTER_PRESETS,
  TechnicalFilterCriteria,
  RiskManagementFilters,
  MarketConditionFilters,
  PersonalizationFilters,
  CustomSignalCriteria,
} from "../../lib/signals/enhanced-filters";

// ===================================================================
// COMPONENT INTERFACES
// ===================================================================

interface EnhancedFiltersPanelProps {
  onFiltersChange: (config: Partial<EnhancedFilterConfig>) => void;
  currentStats?: {
    originalCount: number;
    filteredCount: number;
    rejectionReasons: Record<string, string[]>;
  };
  className?: string;
}

interface FilterSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  badge?: string;
}

// ===================================================================
// MAIN COMPONENT
// ===================================================================

const EnhancedFiltersPanel: React.FC<EnhancedFiltersPanelProps> = ({
  onFiltersChange,
  currentStats,
  className = "",
}) => {
  // ===================================================================
  // STATE MANAGEMENT
  // ===================================================================

  const [filterEngine] = useState(new EnhancedSignalFilter());
  const [currentConfig, setCurrentConfig] = useState<
    Partial<EnhancedFilterConfig>
  >({});
  const [activePreset, setActivePreset] = useState<string>("");
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    presets: true,
    technical: false,
    risk: false,
    market: false,
    personal: false,
    custom: false,
  });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [savePresetName, setSavePresetName] = useState("");
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  // ===================================================================
  // CONFIGURATION HELPERS
  // ===================================================================

  const updateConfig = (section: keyof EnhancedFilterConfig, updates: any) => {
    const newConfig = {
      ...currentConfig,
      [section]: {
        ...currentConfig[section],
        ...updates,
      },
    };
    setCurrentConfig(newConfig);
    onFiltersChange(newConfig);
  };

  const loadPreset = (presetName: string) => {
    const preset = FILTER_PRESETS[presetName];
    if (preset) {
      setCurrentConfig(preset);
      setActivePreset(presetName);
      onFiltersChange(preset);
      filterEngine.loadPreset(presetName);
    }
  };

  const clearAllFilters = () => {
    setCurrentConfig({});
    setActivePreset("");
    onFiltersChange({});
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // ===================================================================
  // SAVE/LOAD PRESETS
  // ===================================================================

  const saveCurrentAsPreset = () => {
    if (savePresetName.trim()) {
      filterEngine.saveAsPreset(savePresetName, currentConfig);
      setShowSaveDialog(false);
      setSavePresetName("");
      // Note: In real implementation, this would save to user preferences/database
    }
  };

  const exportConfig = () => {
    const configJson = JSON.stringify(currentConfig, null, 2);
    const blob = new Blob([configJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kurzora-filters-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target?.result as string);
          setCurrentConfig(imported);
          onFiltersChange(imported);
          setActivePreset("");
        } catch (error) {
          alert("Invalid configuration file");
        }
      };
      reader.readAsText(file);
    }
  };

  // ===================================================================
  // FILTER SECTION COMPONENT
  // ===================================================================

  const FilterSection: React.FC<FilterSectionProps> = ({
    title,
    icon,
    children,
    isOpen,
    onToggle,
    badge,
  }) => (
    <div className="bg-slate-800/50 rounded-lg border border-slate-700 mb-4">
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-slate-700/50 transition-colors rounded-t-lg"
      >
        <div className="flex items-center space-x-3">
          {icon}
          <span className="font-semibold text-white">{title}</span>
          {badge && (
            <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
              {badge}
            </span>
          )}
        </div>
        {isOpen ? (
          <ChevronDown className="w-5 h-5 text-slate-400" />
        ) : (
          <ChevronRight className="w-5 h-5 text-slate-400" />
        )}
      </button>
      {isOpen && (
        <div className="px-4 pb-4 border-t border-slate-700 mt-2">
          {children}
        </div>
      )}
    </div>
  );

  // ===================================================================
  // RENDER COMPONENT
  // ===================================================================

  return (
    <div
      className={`bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Filter className="w-6 h-6 text-blue-400" />
          <h3 className="text-xl font-bold text-white">
            Enhanced Signal Filters
          </h3>
          {currentStats && (
            <span className="text-sm text-slate-400">
              {currentStats.filteredCount}/{currentStats.originalCount} signals
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <label className="relative cursor-pointer">
            <input
              type="file"
              accept=".json"
              onChange={importConfig}
              className="hidden"
            />
            <Upload className="w-5 h-5 text-slate-400 hover:text-white transition-colors" />
          </label>
          <button
            onClick={exportConfig}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <Download className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowSaveDialog(true)}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <Save className="w-5 h-5" />
          </button>
          <button
            onClick={clearAllFilters}
            className="text-slate-400 hover:text-red-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Filter Stats */}
      {currentStats && (
        <div className="bg-slate-800/30 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-400">
                {currentStats.originalCount}
              </div>
              <div className="text-slate-400 text-sm">Original</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-400">
                {currentStats.filteredCount}
              </div>
              <div className="text-slate-400 text-sm">Passed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-400">
                {Math.round(
                  (currentStats.filteredCount / currentStats.originalCount) *
                    100
                )}
                %
              </div>
              <div className="text-slate-400 text-sm">Success Rate</div>
            </div>
          </div>
        </div>
      )}

      {/* Preset Selection */}
      <FilterSection
        title="Filter Presets"
        icon={<Zap className="w-5 h-5 text-yellow-400" />}
        isOpen={expandedSections.presets}
        onToggle={() => toggleSection("presets")}
        badge={activePreset}
      >
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.keys(FILTER_PRESETS).map((presetName) => (
            <button
              key={presetName}
              onClick={() => loadPreset(presetName)}
              className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                activePreset === presetName
                  ? "bg-blue-600 border-blue-500 text-white"
                  : "bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
              }`}
            >
              {presetName
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())}
            </button>
          ))}
        </div>

        <div className="mt-4 p-3 bg-slate-700/50 rounded-lg">
          <div className="flex items-start space-x-2">
            <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-slate-300">
              <p className="font-medium mb-1">Preset Descriptions:</p>
              <ul className="text-xs text-slate-400 space-y-1">
                <li>
                  <strong>Conservative:</strong> Low risk, large cap, good R:R
                  ratios
                </li>
                <li>
                  <strong>Aggressive:</strong> High risk, accepts volatility for
                  opportunity
                </li>
                <li>
                  <strong>Day Trader:</strong> Short-term focused, high volume,
                  tight stops
                </li>
                <li>
                  <strong>Islamic Compliant:</strong> Shariah-compliant stocks
                  only
                </li>
                <li>
                  <strong>Swing Trader:</strong> Medium-term holds, confluence
                  required
                </li>
              </ul>
            </div>
          </div>
        </div>
      </FilterSection>

      {/* Technical Filters */}
      <FilterSection
        title="Technical Analysis Filters"
        icon={<BarChart3 className="w-5 h-5 text-green-400" />}
        isOpen={expandedSections.technical}
        onToggle={() => toggleSection("technical")}
      >
        <div className="space-y-4">
          {/* RSI Filters */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                RSI Range
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  min="0"
                  max="100"
                  value={currentConfig.technical?.rsiMin || ""}
                  onChange={(e) =>
                    updateConfig("technical", {
                      rsiMin: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    })
                  }
                  className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                />
                <input
                  type="number"
                  placeholder="Max"
                  min="0"
                  max="100"
                  value={currentConfig.technical?.rsiMax || ""}
                  onChange={(e) =>
                    updateConfig("technical", {
                      rsiMax: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    })
                  }
                  className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Volume Ratio (Min)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                placeholder="e.g., 1.5"
                value={currentConfig.technical?.volumeRatioMin || ""}
                onChange={(e) =>
                  updateConfig("technical", {
                    volumeRatioMin: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  })
                }
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm"
              />
            </div>
          </div>

          {/* MACD & Momentum Toggles */}
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={currentConfig.technical?.macdBullish || false}
                onChange={(e) =>
                  updateConfig("technical", { macdBullish: e.target.checked })
                }
                className="rounded border-slate-600 bg-slate-700 text-blue-600"
              />
              <span className="text-sm text-slate-300">MACD Bullish Only</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={currentConfig.technical?.momentumPositive || false}
                onChange={(e) =>
                  updateConfig("technical", {
                    momentumPositive: e.target.checked,
                  })
                }
                className="rounded border-slate-600 bg-slate-700 text-blue-600"
              />
              <span className="text-sm text-slate-300">
                Positive Momentum Only
              </span>
            </label>
          </div>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={currentConfig.technical?.highVolumeOnly || false}
              onChange={(e) =>
                updateConfig("technical", { highVolumeOnly: e.target.checked })
              }
              className="rounded border-slate-600 bg-slate-700 text-blue-600"
            />
            <span className="text-sm text-slate-300">
              High Volume Only (1.5x+ average)
            </span>
          </label>
        </div>
      </FilterSection>

      {/* Risk Management Filters */}
      <FilterSection
        title="Risk Management"
        icon={<Shield className="w-5 h-5 text-red-400" />}
        isOpen={expandedSections.risk}
        onToggle={() => toggleSection("risk")}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Min Risk:Reward Ratio
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                placeholder="e.g., 2.0"
                value={currentConfig.riskManagement?.minRiskRewardRatio || ""}
                onChange={(e) =>
                  updateConfig("riskManagement", {
                    minRiskRewardRatio: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  })
                }
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Max Stop Loss %
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="50"
                placeholder="e.g., 5"
                value={currentConfig.riskManagement?.maxStopLossPercent || ""}
                onChange={(e) =>
                  updateConfig("riskManagement", {
                    maxStopLossPercent: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  })
                }
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Min Stock Price ($)
              </label>
              <input
                type="number"
                min="0"
                placeholder="e.g., 10"
                value={currentConfig.riskManagement?.minStockPrice || ""}
                onChange={(e) =>
                  updateConfig("riskManagement", {
                    minStockPrice: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  })
                }
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Max Position Size (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                placeholder="e.g., 10"
                value={currentConfig.riskManagement?.maxPositionSize || ""}
                onChange={(e) =>
                  updateConfig("riskManagement", {
                    maxPositionSize: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  })
                }
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm"
              />
            </div>
          </div>
        </div>
      </FilterSection>

      {/* Market Conditions */}
      <FilterSection
        title="Market Conditions"
        icon={<TrendingUp className="w-5 h-5 text-purple-400" />}
        isOpen={expandedSections.market}
        onToggle={() => toggleSection("market")}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Preferred Market Condition
            </label>
            <select
              value={
                currentConfig.marketConditions?.preferredMarketCondition || ""
              }
              onChange={(e) =>
                updateConfig("marketConditions", {
                  preferredMarketCondition: e.target.value || undefined,
                })
              }
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm"
            >
              <option value="">Any</option>
              <option value="trending">Trending</option>
              <option value="ranging">Ranging</option>
              <option value="volatile">Volatile</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Minimum Data Quality
            </label>
            <select
              value={currentConfig.marketConditions?.minimumDataQuality || ""}
              onChange={(e) =>
                updateConfig("marketConditions", {
                  minimumDataQuality: e.target.value || undefined,
                })
              }
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm"
            >
              <option value="">Any</option>
              <option value="limited">Limited</option>
              <option value="fair">Fair</option>
              <option value="good">Good</option>
              <option value="excellent">Excellent</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Minimum Timeframes Required
            </label>
            <input
              type="number"
              min="1"
              max="4"
              placeholder="e.g., 2"
              value={
                currentConfig.marketConditions?.minimumTimeframeCount || ""
              }
              onChange={(e) =>
                updateConfig("marketConditions", {
                  minimumTimeframeCount: e.target.value
                    ? Number(e.target.value)
                    : undefined,
                })
              }
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm"
            />
          </div>
        </div>
      </FilterSection>

      {/* Personalization */}
      <FilterSection
        title="Personal Preferences"
        icon={<Brain className="w-5 h-5 text-cyan-400" />}
        isOpen={expandedSections.personal}
        onToggle={() => toggleSection("personal")}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Trading Style
              </label>
              <select
                value={currentConfig.personalization?.tradingStyle || ""}
                onChange={(e) =>
                  updateConfig("personalization", {
                    tradingStyle: e.target.value || undefined,
                  })
                }
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm"
              >
                <option value="">Any</option>
                <option value="scalping">Scalping</option>
                <option value="day_trading">Day Trading</option>
                <option value="swing_trading">Swing Trading</option>
                <option value="position_trading">Position Trading</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Risk Tolerance
              </label>
              <select
                value={currentConfig.personalization?.riskTolerance || ""}
                onChange={(e) =>
                  updateConfig("personalization", {
                    riskTolerance: e.target.value || undefined,
                  })
                }
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm"
              >
                <option value="">Any</option>
                <option value="conservative">Conservative</option>
                <option value="moderate">Moderate</option>
                <option value="aggressive">Aggressive</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={
                  currentConfig.personalization?.islamicCompliantOnly || false
                }
                onChange={(e) =>
                  updateConfig("personalization", {
                    islamicCompliantOnly: e.target.checked,
                  })
                }
                className="rounded border-slate-600 bg-slate-700 text-blue-600"
              />
              <span className="text-sm text-slate-300">
                Islamic Compliant Only
              </span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={
                  currentConfig.personalization
                    ?.sectorDiversificationRequired || false
                }
                onChange={(e) =>
                  updateConfig("personalization", {
                    sectorDiversificationRequired: e.target.checked,
                  })
                }
                className="rounded border-slate-600 bg-slate-700 text-blue-600"
              />
              <span className="text-sm text-slate-300">
                Require Sector Diversification
              </span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Max Concurrent Positions
            </label>
            <input
              type="number"
              min="1"
              max="50"
              placeholder="e.g., 10"
              value={currentConfig.personalization?.maxPositionsCount || ""}
              onChange={(e) =>
                updateConfig("personalization", {
                  maxPositionsCount: e.target.value
                    ? Number(e.target.value)
                    : undefined,
                })
              }
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm"
            />
          </div>
        </div>
      </FilterSection>

      {/* Custom Criteria */}
      <FilterSection
        title="Advanced Custom Criteria"
        icon={<Settings className="w-5 h-5 text-orange-400" />}
        isOpen={expandedSections.custom}
        onToggle={() => toggleSection("custom")}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Min Timeframe Agreement (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                placeholder="e.g., 75"
                value={
                  currentConfig.customCriteria?.minimumTimeframeAgreement || ""
                }
                onChange={(e) =>
                  updateConfig("customCriteria", {
                    minimumTimeframeAgreement: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  })
                }
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Max Signal Age (hours)
              </label>
              <input
                type="number"
                min="0"
                placeholder="e.g., 24"
                value={currentConfig.customCriteria?.maxSignalAge || ""}
                onChange={(e) =>
                  updateConfig("customCriteria", {
                    maxSignalAge: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  })
                }
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm"
              />
            </div>
          </div>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={currentConfig.customCriteria?.onlyRecentSignals || false}
              onChange={(e) =>
                updateConfig("customCriteria", {
                  onlyRecentSignals: e.target.checked,
                })
              }
              className="rounded border-slate-600 bg-slate-700 text-blue-600"
            />
            <span className="text-sm text-slate-300">Only Recent Signals</span>
          </label>
        </div>
      </FilterSection>

      {/* Save Preset Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 w-96 border border-slate-700">
            <h4 className="text-lg font-semibold text-white mb-4">
              Save Filter Preset
            </h4>
            <input
              type="text"
              placeholder="Preset name..."
              value={savePresetName}
              onChange={(e) => setSavePresetName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white mb-4"
            />
            <div className="flex space-x-3">
              <button
                onClick={saveCurrentAsPreset}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium"
              >
                Save
              </button>
              <button
                onClick={() => setShowSaveDialog(false)}
                className="flex-1 bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedFiltersPanel;
