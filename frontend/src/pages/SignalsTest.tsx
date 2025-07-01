// ===================================================================
// ENHANCED SIGNALS TEST WITH INTEGRATED DEBUG SYSTEM
// ===================================================================
// File: src/pages/SignalsTest.tsx
// Purpose: Professional signal processing with built-in API debugging
// Features: Complete analysis + real-time debug panel + issue resolution

import React, { useState, useEffect, useMemo } from "react";
import {
  ArrowLeft,
  Play,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Minus,
  Filter,
  Search,
  Bug,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Activity,
} from "lucide-react";
import { StockScanner } from "../lib/signals/stock-scanner";
import {
  SignalProcessor,
  ProcessedSignal,
  SignalStrength,
} from "../lib/signals/signal-processor";

// ===================================================================
// INTERFACES & TYPES
// ===================================================================

interface StockResult {
  ticker: string;
  score: number;
  accepted: boolean;
  reason?: string;
  signalStrength?: SignalStrength;
  signalType?: "bullish" | "bearish" | "neutral";
  companyName?: string;
  sector?: string;
}

interface ProcessingStats {
  totalProcessed: number;
  signalsGenerated: number;
  scoreDistribution: {
    above70: number;
    between60_70: number;
    between50_60: number;
    below50: number;
  };
  highestScore: number;
  averageScore: number;
  processingTime: number;
}

interface DebugResult {
  testName: string;
  status: "passed" | "failed" | "warning";
  message: string;
  details?: any;
  timestamp: Date;
}

interface DebugState {
  isRunning: boolean;
  results: DebugResult[];
  summary: {
    total: number;
    passed: number;
    failed: number;
    warnings: number;
  };
}

// ===================================================================
// DEBUG CONFIGURATION
// ===================================================================

const DEBUG_CONFIG = {
  apiKey: import.meta.env.VITE_POLYGON_API_KEY,
  baseUrl: "https://api.polygon.io",
  testTicker: "AAPL",
  enableDetailedLogging: true,
  rateLimitDelay: 200, // ms between requests
};

// ===================================================================
// MAIN COMPONENT
// ===================================================================

const SignalsTest: React.FC = () => {
  // ===================================================================
  // STATE MANAGEMENT
  // ===================================================================

  // Processing States
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStats, setProcessingStats] =
    useState<ProcessingStats | null>(null);
  const [allResults, setAllResults] = useState<StockResult[]>([]);
  const [processedSignals, setProcessedSignals] = useState<ProcessedSignal[]>(
    []
  );
  const [systemHealthy, setSystemHealthy] = useState<boolean | null>(null);
  const [healthMessage, setHealthMessage] = useState<string>("");

  // Debug States
  const [debugState, setDebugState] = useState<DebugState>({
    isRunning: false,
    results: [],
    summary: { total: 0, passed: 0, failed: 0, warnings: 0 },
  });
  const [showDebugPanel, setShowDebugPanel] = useState(false);

  // Filtering States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    "all" | "accepted" | "rejected"
  >("all");
  const [scoreRangeFilter, setScoreRangeFilter] = useState<
    "all" | "70+" | "60-69" | "50-59" | "<50"
  >("all");
  const [sortBy, setSortBy] = useState<"score" | "ticker" | "sector">("score");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  // ===================================================================
  // DEBUG FUNCTIONS
  // ===================================================================

  const addDebugResult = (result: DebugResult) => {
    setDebugState((prev) => {
      const newResults = [...prev.results, result];
      const summary = {
        total: newResults.length,
        passed: newResults.filter((r) => r.status === "passed").length,
        failed: newResults.filter((r) => r.status === "failed").length,
        warnings: newResults.filter((r) => r.status === "warning").length,
      };
      return { ...prev, results: newResults, summary };
    });
  };

  const clearDebugResults = () => {
    setDebugState({
      isRunning: false,
      results: [],
      summary: { total: 0, passed: 0, failed: 0, warnings: 0 },
    });
  };

  // Debug Test 1: Basic API Connectivity
  const testBasicConnection = async (): Promise<boolean> => {
    try {
      const url = `${DEBUG_CONFIG.baseUrl}/v2/snapshot/locale/us/markets/stocks/tickers/${DEBUG_CONFIG.testTicker}?apikey=${DEBUG_CONFIG.apiKey}`;

      const response = await fetch(url);

      if (!response.ok) {
        let errorMsg = `API request failed (${response.status})`;
        if (response.status === 401) errorMsg += " - Invalid API key";
        else if (response.status === 403)
          errorMsg += " - Access denied - check plan permissions";
        else if (response.status === 429) errorMsg += " - Rate limited";

        addDebugResult({
          testName: "Basic API Connection",
          status: "failed",
          message: errorMsg,
          details: { status: response.status, statusText: response.statusText },
          timestamp: new Date(),
        });
        return false;
      }

      const data = await response.json();

      if (data.status === "OK" && data.ticker) {
        addDebugResult({
          testName: "Basic API Connection",
          status: "passed",
          message: `Successfully connected to API. Current ${
            DEBUG_CONFIG.testTicker
          } price: $${data.ticker.day?.c || "N/A"}`,
          details: { price: data.ticker.day?.c, volume: data.ticker.day?.v },
          timestamp: new Date(),
        });
        return true;
      } else {
        addDebugResult({
          testName: "Basic API Connection",
          status: "failed",
          message: "Unexpected API response format",
          details: data,
          timestamp: new Date(),
        });
        return false;
      }
    } catch (error) {
      addDebugResult({
        testName: "Basic API Connection",
        status: "failed",
        message: `Connection error: ${error.message}`,
        details: { error: error.message },
        timestamp: new Date(),
      });
      return false;
    }
  };

  // Debug Test 2: Date Range Validation
  const testDateRanges = (): boolean => {
    try {
      const endDate = new Date();
      const testRanges = [
        { name: "1H", days: 30 },
        { name: "4H", days: 60 },
        { name: "1D", days: 200 },
        { name: "1W", years: 2 },
      ];

      const validRanges = [];
      const issues = [];

      for (const range of testRanges) {
        const startDate = new Date(endDate);

        if (range.days) {
          startDate.setDate(startDate.getDate() - range.days);
        } else if ((range as any).years) {
          startDate.setFullYear(startDate.getFullYear() - (range as any).years);
        }

        const startStr = startDate.toISOString().split("T")[0];
        const endStr = endDate.toISOString().split("T")[0];

        if (startDate >= endDate) {
          issues.push(`${range.name}: Invalid date range`);
        } else if (startDate < new Date("2020-01-01")) {
          issues.push(`${range.name}: Very old start date (${startStr})`);
        } else {
          validRanges.push(`${range.name}: ${startStr} to ${endStr}`);
        }
      }

      if (issues.length > 0) {
        addDebugResult({
          testName: "Date Range Validation",
          status: "failed",
          message: `Date range issues found: ${issues.join(", ")}`,
          details: { issues, validRanges },
          timestamp: new Date(),
        });
        return false;
      } else {
        addDebugResult({
          testName: "Date Range Validation",
          status: "passed",
          message: `All date ranges valid (${validRanges.length} timeframes)`,
          details: { validRanges },
          timestamp: new Date(),
        });
        return true;
      }
    } catch (error) {
      addDebugResult({
        testName: "Date Range Validation",
        status: "failed",
        message: `Date calculation error: ${error.message}`,
        details: { error: error.message },
        timestamp: new Date(),
      });
      return false;
    }
  };

  // Debug Test 3: Single Timeframe Request
  const testSingleTimeframe = async (): Promise<boolean> => {
    try {
      const endDate = new Date();
      const startDate = new Date(endDate);
      startDate.setDate(startDate.getDate() - 30); // 30 days

      const start = startDate.toISOString().split("T")[0];
      const end = endDate.toISOString().split("T")[0];

      const url = `${DEBUG_CONFIG.baseUrl}/v2/aggs/ticker/${DEBUG_CONFIG.testTicker}/range/1/day/${start}/${end}?adjusted=true&sort=desc&limit=5000&apikey=${DEBUG_CONFIG.apiKey}`;

      const response = await fetch(url);

      if (!response.ok) {
        addDebugResult({
          testName: "Single Timeframe (Daily)",
          status: "failed",
          message: `Daily data request failed (${response.status})`,
          details: { url, status: response.status },
          timestamp: new Date(),
        });
        return false;
      }

      const data = await response.json();

      if (!data.results || data.results.length === 0) {
        // Check if it's a weekend issue
        const dayOfWeek = new Date().getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

        addDebugResult({
          testName: "Single Timeframe (Daily)",
          status: isWeekend ? "warning" : "failed",
          message: isWeekend
            ? `No data returned (weekend detected - markets closed)`
            : `No data returned for ${DEBUG_CONFIG.testTicker} (${start} to ${end})`,
          details: {
            dateRange: `${start} to ${end}`,
            isWeekend,
            dataStatus: data.status,
          },
          timestamp: new Date(),
        });
        return false;
      }

      const firstResult = data.results[0];
      addDebugResult({
        testName: "Single Timeframe (Daily)",
        status: "passed",
        message: `Successfully retrieved ${data.results.length} daily data points`,
        details: {
          dataPoints: data.results.length,
          dateRange: `${start} to ${end}`,
          sampleData: {
            date: new Date(firstResult.t).toISOString().split("T")[0],
            close: firstResult.c,
            volume: firstResult.v,
          },
        },
        timestamp: new Date(),
      });
      return true;
    } catch (error) {
      addDebugResult({
        testName: "Single Timeframe (Daily)",
        status: "failed",
        message: `Request error: ${error.message}`,
        details: { error: error.message },
        timestamp: new Date(),
      });
      return false;
    }
  };

  // Debug Test 4: Multiple Timeframes
  const testMultipleTimeframes = async (): Promise<boolean> => {
    const timeframes = [
      { name: "1D", multiplier: 1, timespan: "day", days: 30 },
      { name: "1H", multiplier: 1, timespan: "hour", days: 7 },
      { name: "4H", multiplier: 4, timespan: "hour", days: 14 },
      { name: "1W", multiplier: 1, timespan: "week", days: 365 },
    ];

    const results = [];

    for (const tf of timeframes) {
      try {
        const endDate = new Date();
        const startDate = new Date(endDate);
        startDate.setDate(startDate.getDate() - tf.days);

        const start = startDate.toISOString().split("T")[0];
        const end = endDate.toISOString().split("T")[0];

        const url = `${DEBUG_CONFIG.baseUrl}/v2/aggs/ticker/${DEBUG_CONFIG.testTicker}/range/${tf.multiplier}/${tf.timespan}/${start}/${end}?adjusted=true&sort=desc&limit=5000&apikey=${DEBUG_CONFIG.apiKey}`;

        const response = await fetch(url);

        if (!response.ok) {
          results.push({
            timeframe: tf.name,
            success: false,
            error: `HTTP ${response.status}`,
          });
          continue;
        }

        const data = await response.json();
        const count = data.results?.length || 0;

        if (count > 0) {
          results.push({ timeframe: tf.name, success: true, count });
        } else {
          results.push({
            timeframe: tf.name,
            success: false,
            error: "No data returned",
          });
        }

        // Rate limiting delay
        await new Promise((resolve) =>
          setTimeout(resolve, DEBUG_CONFIG.rateLimitDelay)
        );
      } catch (error) {
        results.push({
          timeframe: tf.name,
          success: false,
          error: error.message,
        });
      }
    }

    const successful = results.filter((r) => r.success).length;
    const status =
      successful > 0
        ? successful === timeframes.length
          ? "passed"
          : "warning"
        : "failed";

    addDebugResult({
      testName: "Multiple Timeframes",
      status,
      message: `${successful}/${timeframes.length} timeframes working`,
      details: { results },
      timestamp: new Date(),
    });

    return successful > 0;
  };

  // Debug Test 5: Rate Limiting Check
  const testRateLimiting = async (): Promise<boolean> => {
    try {
      const requests = 5;
      const promises = [];

      for (let i = 0; i < requests; i++) {
        const url = `${DEBUG_CONFIG.baseUrl}/v2/snapshot/locale/us/markets/stocks/tickers/${DEBUG_CONFIG.testTicker}?apikey=${DEBUG_CONFIG.apiKey}`;
        promises.push(fetch(url));
      }

      const responses = await Promise.all(promises);

      let successCount = 0;
      let rateLimitedCount = 0;
      let errorCount = 0;

      responses.forEach((response, i) => {
        if (response.ok) {
          successCount++;
        } else if (response.status === 429) {
          rateLimitedCount++;
        } else {
          errorCount++;
        }
      });

      const status = rateLimitedCount > 0 ? "warning" : "passed";

      addDebugResult({
        testName: "Rate Limiting Check",
        status,
        message: `${successCount} successful, ${rateLimitedCount} rate limited, ${errorCount} errors`,
        details: {
          successCount,
          rateLimitedCount,
          errorCount,
          totalRequests: requests,
        },
        timestamp: new Date(),
      });

      return true;
    } catch (error) {
      addDebugResult({
        testName: "Rate Limiting Check",
        status: "failed",
        message: `Rate limiting test failed: ${error.message}`,
        details: { error: error.message },
        timestamp: new Date(),
      });
      return false;
    }
  };

  // Main Debug Runner
  const runComprehensiveDebug = async () => {
    setDebugState((prev) => ({ ...prev, isRunning: true }));
    clearDebugResults();
    setShowDebugPanel(true);

    const tests = [
      { name: "Basic Connection", fn: testBasicConnection },
      { name: "Date Ranges", fn: testDateRanges },
      { name: "Single Timeframe", fn: testSingleTimeframe },
      { name: "Multiple Timeframes", fn: testMultipleTimeframes },
      { name: "Rate Limiting", fn: testRateLimiting },
    ];

    for (const test of tests) {
      try {
        await test.fn();
      } catch (error) {
        addDebugResult({
          testName: test.name,
          status: "failed",
          message: `Test exception: ${error.message}`,
          details: { error: error.message },
          timestamp: new Date(),
        });
      }

      // Small delay between tests
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    setDebugState((prev) => ({ ...prev, isRunning: false }));
  };

  // ===================================================================
  // LIFECYCLE HOOKS
  // ===================================================================

  useEffect(() => {
    testSystemHealth();
  }, []);

  // ===================================================================
  // SYSTEM HEALTH CHECK
  // ===================================================================

  const testSystemHealth = async () => {
    try {
      const signalProcessor = new SignalProcessor();
      const healthCheck = await signalProcessor.testSystemHealth();

      setSystemHealthy(healthCheck.status === "healthy");
      setHealthMessage(healthCheck.message);

      if (healthCheck.status !== "healthy") {
        console.error("❌ System health check failed:", healthCheck);
      }
    } catch (error) {
      setSystemHealthy(false);
      setHealthMessage(`System initialization failed: ${error.message}`);
      console.error("❌ System health check error:", error);
    }
  };

  // ===================================================================
  // SIGNAL PROCESSING
  // ===================================================================

  const startRealMarketScan = async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    setAllResults([]);
    setProcessedSignals([]);
    setProcessingStats(null);

    try {
      console.log("🚀 Starting comprehensive market scan...");
      const startTime = Date.now();

      // Initialize systems
      const stockScanner = new StockScanner();
      const signalProcessor = new SignalProcessor();
      signalProcessor.clearResults();

      // Get stock universe (105 stocks)
      const stockUniverse = StockScanner.getDefaultStockUniverse();
      console.log(`📊 Scanning ${stockUniverse.length} stocks for signals`);

      // Scan all stocks
      const { multiTimeframeData, errors } = await stockScanner.scanStocks(
        stockUniverse,
        (progress) => {
          console.log(
            `📈 Progress: ${progress.stocksScanned}/${progress.totalStocks} - ${progress.currentStock}`
          );
        }
      );

      console.log(
        `✅ Stock scanning complete. Processing ${
          Object.keys(multiTimeframeData).length
        } valid datasets`
      );

      // Process each stock for signals
      const results: StockResult[] = [];
      const processedSignalsList: ProcessedSignal[] = [];

      for (const stock of stockUniverse) {
        const stockData = multiTimeframeData[stock.ticker];

        if (stockData) {
          try {
            const signal = await signalProcessor.processSignal(
              stock.ticker,
              stockData
            );

            if (signal) {
              results.push({
                ticker: stock.ticker,
                score: signal.finalScore,
                accepted: true,
                signalStrength: signal.signalStrength,
                signalType: signal.signalType,
                companyName: stock.companyName,
                sector: stock.sector,
              });
              processedSignalsList.push(signal);
            } else {
              // Get the result from processor's internal tracking
              const processorResults = signalProcessor.getAllResults();
              const result = processorResults.find(
                (r) => r.ticker === stock.ticker
              );

              results.push({
                ticker: stock.ticker,
                score: result?.score || 0,
                accepted: false,
                reason: result?.reason || "Processing failed",
                companyName: stock.companyName,
                sector: stock.sector,
              });
            }
          } catch (error) {
            console.error(`❌ Error processing ${stock.ticker}:`, error);
            results.push({
              ticker: stock.ticker,
              score: 0,
              accepted: false,
              reason: `Error: ${error.message}`,
              companyName: stock.companyName,
              sector: stock.sector,
            });
          }
        } else {
          results.push({
            ticker: stock.ticker,
            score: 0,
            accepted: false,
            reason: "No valid timeframe data",
            companyName: stock.companyName,
            sector: stock.sector,
          });
        }
      }

      // Generate statistics
      const totalTime = Math.floor((Date.now() - startTime) / 1000);
      const stats = generateStats(results, totalTime);

      setAllResults(results);
      setProcessedSignals(processedSignalsList);
      setProcessingStats(stats);

      console.log("🎉 Market scan completed successfully!");
      console.log(
        `📊 Results: ${stats.signalsGenerated}/${stats.totalProcessed} signals generated`
      );
    } catch (error) {
      console.error("❌ Market scan failed:", error);
      alert(`Market scan failed: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // ===================================================================
  // UTILITY FUNCTIONS
  // ===================================================================

  const generateStats = (
    results: StockResult[],
    processingTime: number
  ): ProcessingStats => {
    const totalProcessed = results.length;
    const signalsGenerated = results.filter((r) => r.accepted).length;

    const scoreDistribution = {
      above70: results.filter((r) => r.score >= 70).length,
      between60_70: results.filter((r) => r.score >= 60 && r.score < 70).length,
      between50_60: results.filter((r) => r.score >= 50 && r.score < 60).length,
      below50: results.filter((r) => r.score < 50).length,
    };

    const scores = results.map((r) => r.score);
    const highestScore = scores.length > 0 ? Math.max(...scores) : 0;
    const averageScore =
      scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;

    return {
      totalProcessed,
      signalsGenerated,
      scoreDistribution,
      highestScore,
      averageScore: Math.round(averageScore * 100) / 100,
      processingTime,
    };
  };

  // ===================================================================
  // FILTERED RESULTS
  // ===================================================================

  const filteredResults = useMemo(() => {
    let filtered = [...allResults];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (r) =>
          r.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.sector?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((r) =>
        selectedCategory === "accepted" ? r.accepted : !r.accepted
      );
    }

    // Score range filter
    if (scoreRangeFilter !== "all") {
      switch (scoreRangeFilter) {
        case "70+":
          filtered = filtered.filter((r) => r.score >= 70);
          break;
        case "60-69":
          filtered = filtered.filter((r) => r.score >= 60 && r.score < 70);
          break;
        case "50-59":
          filtered = filtered.filter((r) => r.score >= 50 && r.score < 60);
          break;
        case "<50":
          filtered = filtered.filter((r) => r.score < 50);
          break;
      }
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal, bVal;

      switch (sortBy) {
        case "ticker":
          aVal = a.ticker;
          bVal = b.ticker;
          break;
        case "sector":
          aVal = a.sector || "";
          bVal = b.sector || "";
          break;
        case "score":
        default:
          aVal = a.score;
          bVal = b.score;
          break;
      }

      if (sortOrder === "desc") {
        return bVal > aVal ? 1 : -1;
      } else {
        return aVal > bVal ? 1 : -1;
      }
    });

    return filtered;
  }, [
    allResults,
    searchTerm,
    selectedCategory,
    scoreRangeFilter,
    sortBy,
    sortOrder,
  ]);

  // ===================================================================
  // HELPER FUNCTIONS
  // ===================================================================

  const getScoreColor = (score: number): string => {
    if (score >= 75) return "bg-emerald-600 text-white";
    if (score >= 65) return "bg-blue-600 text-white";
    if (score >= 55) return "bg-amber-600 text-white";
    if (score >= 45) return "bg-slate-600 text-slate-300";
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

  const getStrengthText = (signal?: SignalStrength): string => {
    if (!signal) return "N/A";
    return signal.replace(/_/g, " ");
  };

  const getDebugStatusIcon = (status: "passed" | "failed" | "warning") => {
    switch (status) {
      case "passed":
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-400" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
    }
  };

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
                🔬 PROFESSIONAL Stock Signal Generator
              </h1>
              <p className="text-slate-400 text-sm">
                Institutional-grade multi-timeframe analysis • TradingView
                accuracy • Integrated debugging
              </p>
            </div>

            <div className="text-right">
              <div className="text-sm text-slate-400">System Status</div>
              <div
                className={`text-sm font-bold ${
                  systemHealthy ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {systemHealthy ? "✅ Healthy" : "❌ Error"}
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
                🎯 Professional Signal Processing Control
              </h2>
              <p className="text-slate-400">
                Multi-timeframe institutional analysis • TradingView-accurate
                calculations • All 105 stocks visible
              </p>
            </div>

            <div className="flex items-center space-x-4">
              {/* Debug Button */}
              <button
                onClick={runComprehensiveDebug}
                disabled={debugState.isRunning}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  debugState.isRunning
                    ? "bg-amber-600/50 text-amber-200 cursor-wait"
                    : "bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white shadow-lg hover:shadow-xl"
                }`}
              >
                {debugState.isRunning ? (
                  <>
                    <Activity className="w-4 h-4 animate-pulse" />
                    <span>Debugging...</span>
                  </>
                ) : (
                  <>
                    <Bug className="w-4 h-4" />
                    <span>🔍 Debug API</span>
                  </>
                )}
              </button>

              {/* Main Processing Button */}
              <button
                onClick={startRealMarketScan}
                disabled={!systemHealthy || isProcessing}
                className={`flex items-center space-x-3 px-6 py-3 rounded-lg font-semibold text-lg transition-all duration-200 ${
                  !systemHealthy
                    ? "bg-red-600/50 text-red-200 cursor-not-allowed"
                    : isProcessing
                    ? "bg-amber-600 text-white cursor-wait"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"
                }`}
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    <span>🚀 Start Signal Processing</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {!systemHealthy && (
            <div className="bg-red-900/50 border border-red-600 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-red-400">
                <span className="font-semibold">❌ System Error:</span>
                <span>{healthMessage}</span>
              </div>
            </div>
          )}
        </div>

        {/* Debug Panel */}
        {showDebugPanel && (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <Bug className="w-5 h-5 mr-2" />
                API Debug Results
              </h3>

              <div className="flex items-center space-x-4">
                {/* Debug Summary */}
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-emerald-400">
                    {debugState.summary.passed} passed
                  </span>
                  <span className="text-red-400">
                    {debugState.summary.failed} failed
                  </span>
                  <span className="text-amber-400">
                    {debugState.summary.warnings} warnings
                  </span>
                </div>

                <button
                  onClick={() => setShowDebugPanel(false)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
            </div>

            {debugState.isRunning && (
              <div className="bg-slate-700/50 rounded-lg p-4 mb-4">
                <div className="flex items-center space-x-2 text-amber-400">
                  <Activity className="w-4 h-4 animate-pulse" />
                  <span>Running comprehensive API diagnostics...</span>
                </div>
              </div>
            )}

            {debugState.results.length > 0 && (
              <div className="space-y-3">
                {debugState.results.map((result, index) => (
                  <div
                    key={index}
                    className={`border rounded-lg p-4 ${
                      result.status === "passed"
                        ? "bg-emerald-900/20 border-emerald-600/50"
                        : result.status === "failed"
                        ? "bg-red-900/20 border-red-600/50"
                        : "bg-amber-900/20 border-amber-600/50"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        {getDebugStatusIcon(result.status)}
                        <div>
                          <div className="font-medium text-white">
                            {result.testName}
                          </div>
                          <div className="text-sm text-slate-300 mt-1">
                            {result.message}
                          </div>
                          {result.details && (
                            <details className="mt-2">
                              <summary className="text-xs text-slate-400 cursor-pointer hover:text-slate-300">
                                View Details
                              </summary>
                              <pre className="text-xs text-slate-400 mt-1 bg-slate-800/50 p-2 rounded overflow-auto">
                                {JSON.stringify(result.details, null, 2)}
                              </pre>
                            </details>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-slate-400">
                        <Clock className="w-3 h-3 inline mr-1" />
                        {result.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {debugState.results.length === 0 && !debugState.isRunning && (
              <div className="text-center py-8 text-slate-400">
                <Bug className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Click "🔍 Debug API" to run comprehensive diagnostics</p>
              </div>
            )}
          </div>
        )}

        {/* Statistics Overview */}
        {processingStats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-slate-800/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">
                {processingStats.totalProcessed}
              </div>
              <div className="text-slate-400 text-sm">Stocks Scanned</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-emerald-400">
                {processingStats.signalsGenerated}
              </div>
              <div className="text-slate-400 text-sm">Qualified Signals</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">
                {processingStats.highestScore}
              </div>
              <div className="text-slate-400 text-sm">Highest Score</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-amber-400">
                {processingStats.averageScore}
              </div>
              <div className="text-slate-400 text-sm">Average Score</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">
                {processingStats.processingTime}s
              </div>
              <div className="text-slate-400 text-sm">Processing Time</div>
            </div>
          </div>
        )}

        {/* Score Distribution */}
        {processingStats && (
          <div className="bg-slate-800/50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">
              📊 Score Distribution Analysis
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-400">
                  {processingStats.scoreDistribution.above70}
                </div>
                <div className="text-slate-400 text-sm">70+ (BUY)</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {processingStats.scoreDistribution.between60_70}
                </div>
                <div className="text-slate-400 text-sm">60-69 (WEAK BUY)</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-400">
                  {processingStats.scoreDistribution.between50_60}
                </div>
                <div className="text-slate-400 text-sm">50-59 (NEUTRAL)</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-400">
                  {processingStats.scoreDistribution.below50}
                </div>
                <div className="text-slate-400 text-sm">&lt;50 (WEAK/SELL)</div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        {allResults.length > 0 && (
          <div className="bg-slate-800/50 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Filters & Search
              </h3>
              <div className="text-slate-400">
                Showing {filteredResults.length} of {allResults.length} stocks
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search ticker, company, sector..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as any)}
                className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Stocks</option>
                <option value="accepted">Accepted Signals</option>
                <option value="rejected">Rejected Stocks</option>
              </select>

              {/* Score Range Filter */}
              <select
                value={scoreRangeFilter}
                onChange={(e) => setScoreRangeFilter(e.target.value as any)}
                className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Scores</option>
                <option value="70+">70+ (BUY)</option>
                <option value="60-69">60-69 (WEAK BUY)</option>
                <option value="50-59">50-59 (NEUTRAL)</option>
                <option value="<50">&lt;50 (WEAK/SELL)</option>
              </select>

              {/* Sort */}
              <div className="flex space-x-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="score">Sort by Score</option>
                  <option value="ticker">Sort by Ticker</option>
                  <option value="sector">Sort by Sector</option>
                </select>
                <button
                  onClick={() =>
                    setSortOrder(sortOrder === "desc" ? "asc" : "desc")
                  }
                  className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white hover:bg-slate-600"
                >
                  {sortOrder === "desc" ? "↓" : "↑"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Results Table */}
        {allResults.length > 0 && (
          <div className="bg-slate-800/50 rounded-lg border border-slate-700 overflow-hidden">
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
                    <th className="px-4 py-3 text-left text-white font-semibold">
                      Company
                    </th>
                    <th className="px-4 py-3 text-left text-white font-semibold">
                      Sector
                    </th>
                    <th className="px-4 py-3 text-center text-white font-semibold">
                      Score
                    </th>
                    <th className="px-4 py-3 text-center text-white font-semibold">
                      Signal
                    </th>
                    <th className="px-4 py-3 text-center text-white font-semibold">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-white font-semibold">
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {filteredResults.map((result, index) => (
                    <tr
                      key={result.ticker}
                      className="hover:bg-slate-700/50 transition-colors"
                    >
                      <td className="px-4 py-3 text-slate-400 text-sm">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono font-semibold text-white">
                          {result.ticker}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-300 text-sm max-w-48 truncate">
                        {result.companyName || "N/A"}
                      </td>
                      <td className="px-4 py-3 text-slate-400 text-sm">
                        {result.sector || "N/A"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex items-center justify-center w-16 h-8 rounded text-sm font-bold ${getScoreColor(
                            result.score
                          )}`}
                        >
                          {result.score}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          {getSignalIcon(result.signalStrength)}
                          <span className="text-sm font-medium text-slate-300">
                            {getStrengthText(result.signalStrength)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                            result.accepted
                              ? "bg-emerald-600/20 text-emerald-400"
                              : "bg-red-600/20 text-red-400"
                          }`}
                        >
                          {result.accepted ? "✅ Accepted" : "❌ Rejected"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-400 text-sm max-w-48 truncate">
                        {result.reason || "Signal generated"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* No Results */}
        {allResults.length === 0 && !isProcessing && (
          <div className="text-center py-12">
            <div className="text-slate-400 mb-4">
              <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Ready to scan all 105 stocks</p>
              <p className="text-sm">
                Click "🚀 Start Signal Processing" to begin comprehensive
                analysis
              </p>
              <p className="text-sm mt-2">
                Use "🔍 Debug API" first if you encounter issues
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignalsTest;
