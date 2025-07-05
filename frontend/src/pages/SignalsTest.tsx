// ===================================================================
// ENHANCED SIGNALS TEST WITH DATABASE AUTO-SAVE & REAL PRICES - FIXED
// ===================================================================
// File: src/pages/SignalsTest.tsx  // ✅ CHANGE FROM: EnhancedSignalsTest.tsx
// Purpose: Test signal generation with automatic database storage and real price display
// 🎯 THRESHOLD FIX: Changed default minScoreForSave from 70 to 60 to match UI

import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Play,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Minus,
  Database,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  Activity,
  BarChart3,
  Zap,
  DollarSign,
} from "lucide-react";

import {
  EnhancedSignalProcessor,
  processStocksWithAutoSave,
} from "../lib/signals/enhanced-signal-processor";
import {
  ProcessedSignal,
  SignalStrength,
} from "../lib/signals/signal-processor";
import { StockScanner } from "../lib/signals/stock-scanner";

// ===================================================================
// INTERFACES
// ===================================================================

interface EnhancedProcessingStats {
  totalStocks: number;
  validDatasets: number;
  signalsGenerated: number;
  qualitySignals: number;
  databaseSaves: number;
  totalTime: number;
  apiCallsMade: number;
  pricesUpdated: number; // 🚀 NEW: Track price updates
}

interface AutoSaveStats {
  success: boolean;
  signalsSaved: number;
  signalsFiltered: number;
  errors: string[];
  processingTime: number;
}

interface SystemHealthStatus {
  status: string;
  message: string;
  details?: any;
}

// ===================================================================
// ENHANCED SIGNALS TEST COMPONENT
// ===================================================================

const EnhancedSignalsTest: React.FC = () => {
  // ===================================================================
  // STATE MANAGEMENT
  // ===================================================================

  const [isProcessing, setIsProcessing] = useState(false);
  const [processedSignals, setProcessedSignals] = useState<ProcessedSignal[]>(
    []
  );
  const [processingStats, setProcessingStats] =
    useState<EnhancedProcessingStats | null>(null);
  const [autoSaveStats, setAutoSaveStats] = useState<AutoSaveStats | null>(
    null
  );
  const [systemHealth, setSystemHealth] = useState<SystemHealthStatus | null>(
    null
  );
  const [progressMessage, setProgressMessage] = useState<string>("");
  const [currentProgress, setCurrentProgress] = useState<any>(null);

  // Configuration state - 🎯 FIXED: Changed default from 70 to 60
  const [enableAutoSave, setEnableAutoSave] = useState(true);
  const [minScoreForSave, setMinScoreForSave] = useState(60); // 🎯 FIXED: Changed from 70 to 60
  const [enableDetailedLogging, setEnableDetailedLogging] = useState(true);
  const [fetchRealPrices, setFetchRealPrices] = useState(true); // 🚀 NEW: Real price toggle

  // ===================================================================
  // SYSTEM TESTING
  // ===================================================================

  const testEnhancedSystem = async () => {
    try {
      setProgressMessage("Testing system health...");
      const processor = new EnhancedSignalProcessor();
      const health = await processor.testSystemHealth();
      setSystemHealth(health);

      if (health.status === "healthy") {
        setProgressMessage("✅ All systems operational");
      } else {
        setProgressMessage(`⚠️ System issue: ${health.message}`);
      }
    } catch (error) {
      setSystemHealth({
        status: "error",
        message: `System test failed: ${error.message}`,
      });
      setProgressMessage("❌ System test failed");
    }
  };

  // ===================================================================
  // ENHANCED PROCESSING - FIXED
  // ===================================================================

  const startEnhancedProcessing = async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    setProcessedSignals([]);
    setProcessingStats(null);
    setAutoSaveStats(null);
    setProgressMessage("Initializing enhanced processing...");

    try {
      console.log(
        "🚀 Starting Enhanced Signal Processing with Auto-Save & Real Prices..."
      );

      // Get stock universe
      const stockUniverse = StockScanner.getDefaultStockUniverse();
      console.log(
        `📊 Processing ${stockUniverse.length} stocks from modular universe`
      );

      // 🔧 FIXED: Remove oldSignalsCutoffHours override - let Enhanced Signal Processor use its correct 0.1 hours default
      const result = await processStocksWithAutoSave(
        stockUniverse,
        {
          enableAutoSave,
          minScoreForSave, // 🎯 FIXED: Now defaults to 60 instead of 70
          enableDetailedLogging,
          clearOldSignals: true,
          // ✅ REMOVED: oldSignalsCutoffHours: 24 - this was causing the duplicate filtering issue!
          fetchRealPrices, // 🚀 NEW: Enable real price fetching
        },
        (progress) => {
          setCurrentProgress(progress);
          setProgressMessage(
            `${progress.stage}: ${progress.currentStock || ""}`
          );
        }
      );

      // Update state with results
      setProcessedSignals(result.signals);
      setProcessingStats(result.processingStats);
      setAutoSaveStats(result.autoSaveResult);

      console.log("🎉 Enhanced processing complete!");
      console.log(
        `📊 Results: ${result.signals.length} signals, ${result.autoSaveResult.signalsSaved} saved to DB`
      );
      console.log(
        `💰 Prices Updated: ${result.processingStats.pricesUpdated} stocks with real prices`
      );

      setProgressMessage(
        `✅ Enhanced processing complete! ${result.autoSaveResult.signalsSaved} signals saved with real prices`
      );
    } catch (error) {
      console.error("❌ Enhanced processing failed:", error);
      setProgressMessage(`❌ Processing failed: ${error.message}`);
    } finally {
      setIsProcessing(false);
      setCurrentProgress(null);
    }
  };

  // ===================================================================
  // UTILITY FUNCTIONS
  // ===================================================================

  const getScoreColor = (score: number): string => {
    if (score >= 80) return "bg-emerald-600 text-white";
    if (score >= 70) return "bg-blue-600 text-white";
    if (score >= 60) return "bg-amber-600 text-white";
    if (score >= 50) return "bg-slate-600 text-slate-300";
    return "bg-red-600 text-white";
  };

  const getSignalIcon = (signal?: SignalStrength) => {
    switch (signal) {
      case SignalStrength.STRONG_BUY:
      case SignalStrength.BUY:
        return <TrendingUp className="w-4 h-4" />;
      case SignalStrength.STRONG_SELL:
      case SignalStrength.SELL:
        return <TrendingDown className="w-4 h-4" />;
      default:
        return <Minus className="w-4 h-4" />;
    }
  };

  const getHealthStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Clock className="w-5 h-5 text-slate-400" />;
    }
  };

  // 🚀 NEW: Price formatting utilities
  const formatPrice = (price: number | undefined): string => {
    if (!price || price === 0) return "N/A";
    return `$${price.toFixed(2)}`;
  };

  const formatPriceChange = (changePercent: number | undefined): string => {
    if (!changePercent && changePercent !== 0) return "0.00%";
    const sign = changePercent >= 0 ? "+" : "";
    return `${sign}${changePercent.toFixed(2)}%`;
  };

  const getPriceChangeColor = (changePercent: number | undefined): string => {
    if (!changePercent && changePercent !== 0) return "text-slate-400";
    return changePercent >= 0 ? "text-emerald-400" : "text-red-400";
  };

  // ===================================================================
  // LIFECYCLE
  // ===================================================================

  useEffect(() => {
    testEnhancedSystem();
  }, []);

  // ===================================================================
  // RENDER COMPONENT
  // ===================================================================

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.history.back()}
                className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Dashboard</span>
              </button>
            </div>

            <div className="text-center">
              <h1 className="text-2xl font-bold text-white mb-1">
                🚀 Enhanced Signal Processor
              </h1>
              <p className="text-slate-400 text-sm">
                Complete automation pipeline • Database auto-save • Real-time
                pricing
              </p>
            </div>

            <div className="text-right">
              <div className="text-sm text-slate-400">System Status</div>
              <div className="flex items-center space-x-2">
                {systemHealth && getHealthStatusIcon(systemHealth.status)}
                <span
                  className={`text-sm font-bold ${
                    systemHealth?.status === "healthy"
                      ? "text-emerald-400"
                      : systemHealth?.status === "warning"
                      ? "text-amber-400"
                      : "text-red-400"
                  }`}
                >
                  {systemHealth?.status || "Testing..."}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Control Panel */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-2">
                🎯 Enhanced Processing Control
              </h2>
              <p className="text-slate-400">
                Complete automation pipeline with database auto-save & real
                prices
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={startEnhancedProcessing}
                disabled={
                  !systemHealth ||
                  systemHealth.status === "error" ||
                  isProcessing
                }
                className={`flex items-center space-x-3 px-6 py-3 rounded-lg font-semibold text-lg transition-all duration-200 ${
                  !systemHealth || systemHealth.status === "error"
                    ? "bg-red-600/50 text-red-200 cursor-not-allowed"
                    : isProcessing
                    ? "bg-amber-600 text-white cursor-wait"
                    : "bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl"
                }`}
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Database className="w-5 h-5" />
                    <span>🚀 Start Enhanced Processing</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Configuration - UPDATED */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="enableAutoSave"
                checked={enableAutoSave}
                onChange={(e) => setEnableAutoSave(e.target.checked)}
                disabled={isProcessing}
                className="rounded border-slate-600 bg-slate-700 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="enableAutoSave"
                className="text-sm text-slate-300"
              >
                Enable Database Auto-Save
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <label className="text-sm text-slate-300">
                Min Score for DB:
              </label>
              <select
                value={minScoreForSave}
                onChange={(e) => setMinScoreForSave(Number(e.target.value))}
                disabled={isProcessing}
                className="px-3 py-1 bg-slate-700 border border-slate-600 rounded text-white text-sm"
              >
                <option value={60}>60+</option>
                <option value={70}>70+</option>
                <option value={80}>80+</option>
              </select>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="fetchRealPrices"
                checked={fetchRealPrices}
                onChange={(e) => setFetchRealPrices(e.target.checked)}
                disabled={isProcessing}
                className="rounded border-slate-600 bg-slate-700 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="fetchRealPrices"
                className="text-sm text-slate-300"
              >
                🚀 Fetch Real Prices
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="enableLogging"
                checked={enableDetailedLogging}
                onChange={(e) => setEnableDetailedLogging(e.target.checked)}
                disabled={isProcessing}
                className="rounded border-slate-600 bg-slate-700 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="enableLogging" className="text-sm text-slate-300">
                Detailed Logging
              </label>
            </div>
          </div>

          {/* System Health */}
          {systemHealth && systemHealth.status !== "healthy" && (
            <div
              className={`rounded-lg p-4 ${
                systemHealth.status === "warning"
                  ? "bg-amber-900/50 border border-amber-600"
                  : "bg-red-900/50 border border-red-600"
              }`}
            >
              <div className="flex items-center space-x-2">
                {getHealthStatusIcon(systemHealth.status)}
                <span className="font-semibold">System Status:</span>
                <span>{systemHealth.message}</span>
              </div>
            </div>
          )}

          {/* Progress */}
          {(isProcessing || progressMessage) && (
            <div className="mt-4 p-4 bg-slate-700/50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Activity className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-blue-400">
                  Status:
                </span>
                <span className="text-sm text-slate-300">
                  {progressMessage}
                </span>
              </div>

              {currentProgress && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400">Progress:</span>
                    <span className="ml-2 text-white">
                      {currentProgress.stocksScanned}/
                      {currentProgress.totalStocks}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">Signals:</span>
                    <span className="ml-2 text-white">
                      {currentProgress.signalsFound}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">Quality:</span>
                    <span className="ml-2 text-white">
                      {currentProgress.validSignals}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">Time:</span>
                    <span className="ml-2 text-white">
                      {currentProgress.timeElapsed}s
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Results Dashboard - UPDATED WITH PRICE INFO */}
        {(processingStats || autoSaveStats) && (
          <div className="grid grid-cols-2 md:grid-cols-7 gap-4 mb-8">
            {processingStats && (
              <>
                <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-white">
                    {processingStats.totalStocks}
                  </div>
                  <div className="text-slate-400 text-sm">Stocks Scanned</div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    {processingStats.signalsGenerated}
                  </div>
                  <div className="text-slate-400 text-sm">
                    Signals Generated
                  </div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-emerald-400">
                    {processingStats.qualitySignals}
                  </div>
                  <div className="text-slate-400 text-sm">Quality Signals</div>
                </div>
                {/* 🚀 NEW: Prices Updated stat */}
                <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {processingStats.pricesUpdated}
                  </div>
                  <div className="text-slate-400 text-sm">Prices Updated</div>
                </div>
              </>
            )}

            {autoSaveStats && (
              <>
                <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-400">
                    {autoSaveStats.signalsSaved}
                  </div>
                  <div className="text-slate-400 text-sm">Saved to DB</div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-amber-400">
                    {Math.round((processingStats?.totalTime || 0) / 1000)}s
                  </div>
                  <div className="text-slate-400 text-sm">Total Time</div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                  <div
                    className={`text-2xl font-bold ${
                      autoSaveStats.success
                        ? "text-emerald-400"
                        : "text-red-400"
                    }`}
                  >
                    {autoSaveStats.success ? "✅" : "❌"}
                  </div>
                  <div className="text-slate-400 text-sm">Auto-Save</div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Auto-Save Results */}
        {autoSaveStats && (
          <div className="bg-slate-800/50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Database className="w-5 h-5 mr-2" />
              Database Auto-Save Results
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-slate-400 mb-2">Save Summary</div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Signals Processed:</span>
                    <span className="text-white">
                      {processedSignals.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quality Filter (≥{minScoreForSave}):</span>
                    <span className="text-white">
                      {processingStats?.qualitySignals || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saved to Database:</span>
                    <span className="text-emerald-400">
                      {autoSaveStats.signalsSaved}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Real Prices Fetched:</span>
                    <span className="text-green-400">
                      {processingStats?.pricesUpdated || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Processing Time:</span>
                    <span className="text-white">
                      {autoSaveStats.processingTime}ms
                    </span>
                  </div>
                </div>
              </div>

              {autoSaveStats.errors.length > 0 && (
                <div>
                  <div className="text-sm text-slate-400 mb-2">Errors</div>
                  <div className="space-y-1 text-sm text-red-400 max-h-32 overflow-y-auto">
                    {autoSaveStats.errors.map((error, index) => (
                      <div key={index} className="text-xs">
                        • {error}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Signals Table - UPDATED WITH PRICE COLUMNS */}
        {processedSignals.length > 0 && (
          <div className="bg-slate-800/50 rounded-lg border border-slate-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-700">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Generated Signals ({processedSignals.length}) with Real Prices
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-white font-semibold">
                      #
                    </th>
                    <th className="px-4 py-3 text-left text-white font-semibold">
                      Ticker
                    </th>
                    <th className="px-4 py-3 text-center text-white font-semibold">
                      Current Price
                    </th>
                    <th className="px-4 py-3 text-center text-white font-semibold">
                      Change %
                    </th>
                    <th className="px-4 py-3 text-center text-white font-semibold">
                      Score
                    </th>
                    <th className="px-4 py-3 text-center text-white font-semibold">
                      Type
                    </th>
                    <th className="px-4 py-3 text-center text-white font-semibold">
                      Strength
                    </th>
                    <th className="px-4 py-3 text-center text-white font-semibold">
                      Saved
                    </th>
                    <th className="px-4 py-3 text-left text-white font-semibold">
                      Explanation
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {processedSignals
                    .sort((a, b) => b.finalScore - a.finalScore)
                    .slice(0, 50) // Show top 50 signals
                    .map((signal, index) => (
                      <tr
                        key={signal.ticker}
                        className="hover:bg-slate-700/50 transition-colors"
                      >
                        <td className="px-4 py-3 text-slate-400 text-sm">
                          {index + 1}
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-mono font-semibold text-white">
                            {signal.ticker}
                          </span>
                        </td>
                        {/* 🚀 FIXED: Current Price using correct snake_case database columns */}
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center space-x-1">
                            <DollarSign className="w-3 h-3 text-green-400" />
                            <span className="text-white font-mono">
                              {formatPrice(signal.current_price)}
                            </span>
                          </div>
                        </td>
                        {/* 🚀 FIXED: Price Change using correct snake_case database columns */}
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`font-mono font-semibold ${getPriceChangeColor(
                              signal.price_change_percent
                            )}`}
                          >
                            {formatPriceChange(signal.price_change_percent)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`inline-flex items-center justify-center w-16 h-8 rounded text-sm font-bold ${getScoreColor(
                              signal.finalScore
                            )}`}
                          >
                            {signal.finalScore}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              signal.signalType === "bullish"
                                ? "bg-emerald-600/20 text-emerald-400"
                                : signal.signalType === "bearish"
                                ? "bg-red-600/20 text-red-400"
                                : "bg-slate-600/20 text-slate-400"
                            }`}
                          >
                            {signal.signalType}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            {getSignalIcon(signal.signalStrength)}
                            <span className="text-sm text-slate-300">
                              {signal.signalStrength?.replace(/_/g, " ") ||
                                "N/A"}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {signal.finalScore >= minScoreForSave ? (
                            <CheckCircle className="w-4 h-4 text-emerald-400 mx-auto" />
                          ) : (
                            <XCircle className="w-4 h-4 text-slate-500 mx-auto" />
                          )}
                        </td>
                        <td className="px-4 py-3 text-slate-300 text-sm max-w-64 truncate">
                          {signal.explanation || "No explanation available"}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {processedSignals.length > 50 && (
              <div className="px-6 py-4 bg-slate-700/50 text-center text-sm text-slate-400">
                Showing top 50 of {processedSignals.length} signals with real
                prices
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!isProcessing && processedSignals.length === 0 && (
          <div className="text-center py-12">
            <div className="text-slate-400 mb-4">
              <Zap className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Ready for enhanced signal processing</p>
              <p className="text-sm">
                Test the complete automation pipeline with database auto-save &
                real prices
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedSignalsTest;
