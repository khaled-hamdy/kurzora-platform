// ===================================================================
// ISOLATED SIGNALS TEST - NO DATABASE SAVES (PRODUCTION PROTECTION)
// ===================================================================
// File: src/pages/SignalsTest.tsx
// Purpose: Test signal generation WITHOUT affecting production database
// 🛡️ CRITICAL: Auto-save DISABLED to prevent production contamination
// 🎯 TESTING ONLY: Local processing for development verification

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
  Shield,
  AlertCircle,
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

// 🎯 Import modal for Execute Trade functionality
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
// ISOLATED SIGNALS TEST COMPONENT - NO DATABASE SAVES
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

  // 🛡️ CRITICAL: Auto-save DISABLED to protect production database
  const enableAutoSave = false; // LOCKED to false - no state needed
  const [minScoreForSave, setMinScoreForSave] = useState(60);
  const [enableDetailedLogging, setEnableDetailedLogging] = useState(true);
  const [fetchRealPrices, setFetchRealPrices] = useState(true);

  // 🎯 Modal state for Execute Trade functionality
  const [selectedSignal, setSelectedSignal] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ===================================================================
  // MODAL HANDLERS - EXECUTE TRADE FUNCTIONALITY
  // ===================================================================

  const handleExecuteTrade = (signal: ProcessedSignal) => {
    // Convert ProcessedSignal to modal format with smart entry data
    const modalSignal = {
      symbol: signal.ticker,
      name: `${signal.ticker} Corporation`,
      price: signal.current_price || 0,
      change: signal.priceChange || 0,
      signalScore: signal.finalScore,

      // Smart entry data from Session #134
      entryPrice: signal.entryPrice,
      stopLoss: signal.stopLoss,
      takeProfit: signal.takeProfit,
      riskRewardRatio: signal.riskRewardRatio,

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
    setSelectedSignal(modalSignal);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSignal(null);
  };

  const handleTradeExecution = (tradeData: any) => {
    console.log("🚀 Trade executed from signals-test:", tradeData);
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
          "✅ All systems operational - Test Environment Ready"
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
  // ISOLATED PROCESSING - NO DATABASE SAVES
  // ===================================================================

  const startEnhancedProcessing = async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    setProcessedSignals([]);
    setProcessingStats(null);
    setAutoSaveStats(null);
    setProgressMessage(
      "🛡️ Initializing ISOLATED test processing (no database saves)..."
    );

    try {
      console.log(
        "🛡️ Starting ISOLATED Signal Processing (TEST ONLY - NO DATABASE SAVES)..."
      );

      // Get stock universe
      const stockUniverse = StockScanner.getDefaultStockUniverse();
      console.log(
        `📊 Processing ${stockUniverse.length} stocks in ISOLATED test mode`
      );

      // 🛡️ CRITICAL: Force auto-save to FALSE
      const result = await processStocksWithIntelligentRiskManagement(
        stockUniverse,
        {
          enableAutoSave: false, // FORCED to false - never save to database
          minScoreForSave,
          enableDetailedLogging,
          clearOldSignals: false, // Don't clear production signals
          fetchRealPrices,
        },
        (progress) => {
          setCurrentProgress(progress);
          setProgressMessage(
            `${progress.stage}: ${progress.currentStock || ""} [TEST ONLY]`
          );
        }
      );

      // Update state with results
      setProcessedSignals(result.signals);
      setProcessingStats(result.processingStats);
      setAutoSaveStats(result.autoSaveResult);

      console.log("🎉 ISOLATED test processing complete!");
      console.log(
        `📊 Results: ${result.signals.length} signals generated (NOT saved to database)`
      );
      console.log(
        `💰 Prices Updated: ${result.processingStats.pricesUpdated} stocks with real prices`
      );

      setProgressMessage(
        `✅ Test processing complete! ${result.signals.length} signals generated (NOT saved to database)`
      );
    } catch (error) {
      console.error("❌ Test processing failed:", error);
      setProgressMessage(`❌ Test processing failed: ${error.message}`);
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
  // RENDER COMPONENT - ISOLATED TEST MODE
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
                🛡️ Isolated Test Environment - NO Database Saves
              </h1>
              <p className="text-slate-400 text-sm">
                Development testing only • No production database impact • Safe
                testing environment
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

      {/* Critical Warning Banner */}
      <div className="bg-red-900/50 border-b border-red-600">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-center space-x-3">
            <Shield className="w-5 h-5 text-red-400" />
            <span className="text-red-400 font-semibold">
              🛡️ ISOLATED TEST ENVIRONMENT
            </span>
            <span className="text-red-300">•</span>
            <span className="text-slate-300">
              No database saves • Production data protected • Development only
            </span>
            <span className="text-red-300">•</span>
            <span className="text-red-400 font-semibold">
              NOT FOR LIVE TRADING
            </span>
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
                🛡️ Isolated Test Processing (NO Database Impact)
              </h2>
              <p className="text-slate-400">
                Safe testing environment • Local processing only • Production
                database protected
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
                    : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl"
                }`}
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Testing...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    <span>🧪 Start Test Processing</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Configuration - Limited Options for Test Mode */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Auto-Save Status - LOCKED DISABLED */}
            <div className="flex items-center space-x-3 p-3 bg-red-900/20 border border-red-600 rounded-lg">
              <Shield className="w-5 h-5 text-red-400" />
              <div>
                <div className="text-sm font-medium text-red-400">
                  Database Auto-Save: PERMANENTLY DISABLED
                </div>
                <div className="text-xs text-red-300">
                  🛡️ Production database protected - Cannot be enabled
                </div>
              </div>
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
                <Activity className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-medium text-purple-400">
                  Test Status:
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
                  <div className="text-2xl font-bold text-red-400">0</div>
                  <div className="text-slate-400 text-sm">
                    DB Saves (Protected)
                  </div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-amber-400">
                    {Math.round((processingStats?.totalTime || 0) / 1000)}s
                  </div>
                  <div className="text-slate-400 text-sm">Total Time</div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-400">🛡️</div>
                  <div className="text-slate-400 text-sm">Isolated</div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Test Results Summary */}
        {autoSaveStats && (
          <div className="bg-slate-800/50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-purple-400" />
              🛡️ Isolated Test Results (Production Database Protected)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-slate-400 mb-2">
                  Test Processing Summary
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Signals Generated:</span>
                    <span className="text-white">
                      {processedSignals.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quality Signals:</span>
                    <span className="text-white">
                      {processingStats?.qualitySignals || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Database Saves:</span>
                    <span className="text-red-400 font-semibold">
                      0 (PROTECTED)
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
                  🛡️ Production Protection Status
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Database Auto-Save:</span>
                    <span className="text-red-400">🛡️ DISABLED</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Production Data:</span>
                    <span className="text-emerald-400">✅ Protected</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Subscriber Impact:</span>
                    <span className="text-emerald-400">✅ None</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Test Environment:</span>
                    <span className="text-purple-400">✅ Isolated</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Safe for Development:</span>
                    <span className="text-emerald-400">✅ Yes</span>
                  </div>
                </div>
              </div>

              {autoSaveStats.errors.length > 0 && (
                <div className="col-span-2">
                  <div className="text-sm text-slate-400 mb-2">
                    Test Errors (Non-Critical)
                  </div>
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

        {/* Signals Table - Test Results Only */}
        {processedSignals.length > 0 && (
          <div className="bg-slate-800/50 rounded-lg border border-slate-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-700">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                🛡️ Test Signals ({processedSignals.length}) - NOT Saved to
                Database
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Development testing only • Local processing • No production
                impact • Execute Trade available for UI testing
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
                      DB Status
                    </th>
                    <th className="px-4 py-3 text-center text-white font-semibold">
                      Test Action
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
                          <div className="flex items-center justify-center space-x-1">
                            <Shield className="w-4 h-4 text-red-400" />
                            <span className="text-red-400 text-xs font-medium">
                              NOT SAVED
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => handleExecuteTrade(signal)}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                          >
                            Test Modal
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {processedSignals.length > 50 && (
              <div className="px-6 py-4 bg-slate-700/50 text-center text-sm text-slate-400">
                Showing top 50 of {processedSignals.length} test signals (not
                saved to production database)
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!isProcessing && processedSignals.length === 0 && (
          <div className="text-center py-12">
            <div className="text-slate-400 mb-4">
              <Shield className="w-16 h-16 mx-auto mb-4 opacity-50 text-purple-400" />
              <p className="text-lg">🛡️ Isolated Test Environment Ready</p>
              <p className="text-sm">
                Safe development testing • No production database impact •
                Execute Trade UI testing available
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Signal Modal for Execute Trade Testing */}
      {isModalOpen && selectedSignal && (
        <SignalModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          signal={selectedSignal}
          onExecuteTrade={handleTradeExecution}
          existingPositions={[]}
        />
      )}
    </div>
  );
};

export default EnhancedSignalsTest;
