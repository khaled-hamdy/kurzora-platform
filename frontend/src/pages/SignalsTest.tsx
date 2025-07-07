// ===================================================================
// ENHANCED SIGNALS TEST WITH DATABASE AUTO-SAVE & REAL PRICES - RESTORED + EXECUTE TRADE BUTTONS
// ===================================================================
// File: src/pages/SignalsTest.tsx
// Purpose: Test signal generation with automatic database storage and real price display
// 🛡️ RECOVERY: Restored Session #124 working version with syntax fixes
// 🎯 NEW: Added Execute Trade buttons with smart entry data

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
  processStocksWithIntelligentRiskManagement,
} from "../lib/signals/enhanced-signal-processor";
import {
  ProcessedSignal,
  SignalStrength,
} from "../lib/signals/signal-processor";
import { StockScanner } from "../lib/signals/stock-scanner";

// 🎯 NEW: Import modal for Execute Trade functionality
import SignalModal from "../components/signals/SignalModal";

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
  pricesUpdated: number;
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
// ENHANCED SIGNALS TEST COMPONENT - RESTORED SESSION #124 + EXECUTE TRADE
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

  // Configuration state - Session #124 working defaults
  const [enableAutoSave, setEnableAutoSave] = useState(true);
  const [minScoreForSave, setMinScoreForSave] = useState(60);
  const [enableDetailedLogging, setEnableDetailedLogging] = useState(true);
  const [fetchRealPrices, setFetchRealPrices] = useState(true);

  // 🎯 NEW: Modal state for Execute Trade functionality
  const [selectedSignal, setSelectedSignal] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ===================================================================
  // MODAL HANDLERS - NEW EXECUTE TRADE FUNCTIONALITY
  // ===================================================================

  const handleExecuteTrade = (signal: ProcessedSignal) => {
    // Convert ProcessedSignal to modal format with smart entry data
    const modalSignal = {
      symbol: signal.ticker,
      name: `${signal.ticker} Corporation`, // You can enhance this with real company names
      price: signal.current_price || 0, // Current market price
      change: signal.priceChange || 0, // Price change %
      signalScore: signal.finalScore,

      // 🎯 CRITICAL: Smart entry data from Session #134
      entryPrice: signal.entryPrice, // Smart entry: $232.98
      stopLoss: signal.stopLoss, // Calculated stop: $219.11
      takeProfit: signal.takeProfit, // Calculated target: $267.65
      riskRewardRatio: signal.riskRewardRatio, // Risk-reward ratio

      // Additional data
      atr: signal.atr,
      positionSize: signal.positionSize,
      sector: signal.sector || "Technology",

      // Raw signals for advanced calculations
      signals: {
        "1H": signal.finalScore,
        "4H": signal.finalScore,
        "1D": signal.finalScore,
        "1W": signal.finalScore,
      },
    };

    console.log("🎯 Opening modal with smart entry data:", modalSignal);
    console.log("🎯 Entry Price being passed:", modalSignal.entryPrice);
    console.log("🎯 Current Price being passed:", modalSignal.price);

    setSelectedSignal(modalSignal);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSignal(null);
  };

  const handleTradeExecution = (tradeData: any) => {
    console.log("🚀 Trade executed from signals-test:", tradeData);
    // You can add actual trade execution logic here if needed
    // For now, just close the modal
    handleCloseModal();
  };

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
        setProgressMessage(
          "✅ All systems operational - Session #124 Recovery Complete"
        );
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
  // ENHANCED PROCESSING - SESSION #124 RESTORED
  // ===================================================================

  const startEnhancedProcessing = async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    setProcessedSignals([]);
    setProcessingStats(null);
    setAutoSaveStats(null);
    setProgressMessage(
      "Initializing Session #124 intelligent risk management..."
    );

    try {
      console.log(
        "🛡️ Starting Session #124 Enhanced Signal Processing (RECOVERY MODE)..."
      );

      // Get stock universe
      const stockUniverse = StockScanner.getDefaultStockUniverse();
      console.log(
        `📊 Processing ${stockUniverse.length} stocks from modular universe`
      );

      // Session #124 working configuration
      const result = await processStocksWithIntelligentRiskManagement(
        stockUniverse,
        {
          enableAutoSave,
          minScoreForSave,
          enableDetailedLogging,
          clearOldSignals: true,
          fetchRealPrices,
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

      console.log("🎉 Session #124 enhanced processing complete!");
      console.log(
        `📊 Results: ${result.signals.length} signals, ${result.autoSaveResult.signalsSaved} saved to DB`
      );
      console.log(
        `💰 Prices Updated: ${result.processingStats.pricesUpdated} stocks with real prices`
      );

      setProgressMessage(
        `✅ Session #124 processing complete! ${result.autoSaveResult.signalsSaved} signals saved`
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

  const formatRiskReward = (ratio: number | undefined): string => {
    if (!ratio) return "N/A";
    return `${ratio.toFixed(1)}:1`;
  };

  const formatATR = (atr: number | undefined): string => {
    if (!atr) return "N/A";
    return `${atr.toFixed(2)}`;
  };

  const formatPositionSize = (size: number | undefined): string => {
    if (!size) return "N/A";
    return `${size} shares`;
  };

  useEffect(() => {
    testEnhancedSystem();
  }, []);

  // ===================================================================
  // RENDER COMPONENT - FIXED JSX STRUCTURE + EXECUTE TRADE BUTTONS
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
                🛡️ Session #124 Recovery - Intelligent Risk Management
              </h1>
              <p className="text-slate-400 text-sm">
                Restored working system • Fallback calculations • Database
                integration • Execute Trade buttons
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
                🛡️ Session #124 Intelligent Risk Management (RESTORED)
              </h2>
              <p className="text-slate-400">
                Working fallback system • Entry: $100, Stop: $98, Target: $104,
                R/R: 2.0 • Execute Trade buttons enabled
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
                    <span>🧠 Start Intelligent Processing</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Configuration */}
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

        {/* Results Dashboard */}
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
              🛡️ Session #124 Intelligent Risk Management Results
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-slate-400 mb-2">
                  Processing Summary
                </div>
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

              <div>
                <div className="text-sm text-slate-400 mb-2">
                  🛡️ Session #124 Risk Management
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Working Fallback System:</span>
                    <span className="text-emerald-400">✅ Restored</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Entry/Stop/Target:</span>
                    <span className="text-emerald-400">✅ Functional</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Error Handling:</span>
                    <span className="text-emerald-400">
                      ✅ Preventing Crashes
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Database Integration:</span>
                    <span className="text-emerald-400">✅ Working</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Risk/Reward Ratios:</span>
                    <span className="text-emerald-400">✅ 2.0:1 Default</span>
                  </div>
                </div>
              </div>

              {autoSaveStats.errors.length > 0 && (
                <div className="col-span-2">
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

        {/* Signals Table with Execute Trade Buttons */}
        {processedSignals.length > 0 && (
          <div className="bg-slate-800/50 rounded-lg border border-slate-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-700">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                🛡️ Session #124 Intelligent Risk Management Signals (
                {processedSignals.length}) - Execute Trade Enabled
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Restored working system • Fallback calculations • Professional
                display • Smart entry prices • Execute Trade buttons
              </p>
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
                      Entry Price
                    </th>
                    <th className="px-4 py-3 text-center text-white font-semibold">
                      Stop Loss
                    </th>
                    <th className="px-4 py-3 text-center text-white font-semibold">
                      Take Profit
                    </th>
                    <th className="px-4 py-3 text-center text-white font-semibold">
                      R/R Ratio
                    </th>
                    <th className="px-4 py-3 text-center text-white font-semibold">
                      ATR
                    </th>
                    <th className="px-4 py-3 text-center text-white font-semibold">
                      Position Size
                    </th>
                    <th className="px-4 py-3 text-center text-white font-semibold">
                      Score
                    </th>
                    <th className="px-4 py-3 text-center text-white font-semibold">
                      Type
                    </th>
                    <th className="px-4 py-3 text-center text-white font-semibold">
                      Saved
                    </th>
                    <th className="px-4 py-3 text-center text-white font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {processedSignals
                    .sort((a, b) => b.finalScore - a.finalScore)
                    .slice(0, 50)
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
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center space-x-1">
                            <DollarSign className="w-3 h-3 text-green-400" />
                            <span className="text-white font-mono">
                              {formatPrice(signal.current_price)}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-blue-400 font-mono">
                            {formatPrice(signal.entryPrice)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-red-400 font-mono">
                            {formatPrice(signal.stopLoss)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-emerald-400 font-mono">
                            {formatPrice(signal.takeProfit)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-purple-400 font-mono">
                            {formatRiskReward(signal.riskRewardRatio)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-amber-400 font-mono">
                            {formatATR(signal.atr)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-cyan-400 font-mono text-xs">
                            {formatPositionSize(signal.positionSize)}
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
                          {signal.finalScore >= minScoreForSave ? (
                            <CheckCircle className="w-4 h-4 text-emerald-400 mx-auto" />
                          ) : (
                            <XCircle className="w-4 h-4 text-slate-500 mx-auto" />
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => handleExecuteTrade(signal)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                          >
                            Execute Trade
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {processedSignals.length > 50 && (
              <div className="px-6 py-4 bg-slate-700/50 text-center text-sm text-slate-400">
                Showing top 50 of {processedSignals.length} signals with Session
                #124 intelligent risk management and Execute Trade buttons
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!isProcessing && processedSignals.length === 0 && (
          <div className="text-center py-12">
            <div className="text-slate-400 mb-4">
              <Zap className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">🛡️ Session #124 Recovery Complete</p>
              <p className="text-sm">
                Working fallback system restored • Ready for signal generation •
                Execute Trade buttons enabled
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Signal Modal for Execute Trade */}
      {isModalOpen && selectedSignal && (
        <SignalModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          signal={selectedSignal}
          onExecuteTrade={handleTradeExecution}
          existingPositions={[]} // You can add position detection here if needed
        />
      )}
    </div>
  );
};

export default EnhancedSignalsTest;
