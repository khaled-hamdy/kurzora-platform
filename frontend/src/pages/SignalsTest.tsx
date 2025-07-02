// ===================================================================
// SIGNALS TEST WITH ENHANCED FILTERING INTEGRATION
// ===================================================================
// File: src/pages/SignalsTest.tsx (Updated with Enhanced Filters)
// Purpose: Integration example showing how to add enhanced filtering

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
  Settings,
  Eye,
  EyeOff,
} from "lucide-react";
import { StockScanner } from "../lib/signals/stock-scanner";
import {
  SignalProcessor,
  ProcessedSignal,
  SignalStrength,
} from "../lib/signals/signal-processor";

// ===================================================================
// NEW IMPORTS - Enhanced Filtering System
// ===================================================================
import {
  EnhancedSignalFilter,
  EnhancedFilterConfig,
  FilteringStats,
} from "../lib/signals/enhanced-filters";
import EnhancedFiltersPanel from "../components/signals/EnhancedFiltersPanel";

// ===================================================================
// EXISTING INTERFACES (keeping your current structure)
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

// ===================================================================
// ENHANCED SIGNALS TEST COMPONENT
// ===================================================================

const SignalsTest: React.FC = () => {
  // ===================================================================
  // EXISTING STATE (keeping your current structure)
  // ===================================================================

  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStats, setProcessingStats] =
    useState<ProcessingStats | null>(null);
  const [allResults, setAllResults] = useState<StockResult[]>([]);
  const [processedSignals, setProcessedSignals] = useState<ProcessedSignal[]>(
    []
  );
  const [systemHealthy, setSystemHealthy] = useState<boolean | null>(null);
  const [healthMessage, setHealthMessage] = useState<string>("");

  // ===================================================================
  // NEW STATE - Enhanced Filtering
  // ===================================================================

  const [enhancedFilter] = useState(new EnhancedSignalFilter());
  const [filterConfig, setFilterConfig] = useState<
    Partial<EnhancedFilterConfig>
  >({});
  const [showEnhancedFilters, setShowEnhancedFilters] = useState(false);
  const [filteredSignals, setFilteredSignals] = useState<ProcessedSignal[]>([]);
  const [filterStats, setFilterStats] = useState<FilteringStats | null>(null);
  const [filterRecommendations, setFilterRecommendations] = useState<string[]>(
    []
  );

  // ===================================================================
  // EXISTING BASIC FILTERS (keeping for backward compatibility)
  // ===================================================================

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
  // ENHANCED FILTERING LOGIC
  // ===================================================================

  const applyEnhancedFiltering = (signals: ProcessedSignal[]) => {
    if (Object.keys(filterConfig).length === 0) {
      // No enhanced filters applied, use original signals
      setFilteredSignals(signals);
      setFilterStats(null);
      setFilterRecommendations([]);
      return;
    }

    console.log(`🔍 Applying enhanced filters to ${signals.length} signals`);

    const result = enhancedFilter.filterSignals(signals, filterConfig);

    setFilteredSignals(result.filteredSignals);
    setFilterStats(result.filterStats);
    setFilterRecommendations(result.recommendations);

    console.log(
      `✅ Enhanced filtering complete: ${result.filteredSignals.length} signals passed`
    );
  };

  // Apply enhanced filtering whenever processedSignals or filterConfig changes
  useEffect(() => {
    if (processedSignals.length > 0) {
      applyEnhancedFiltering(processedSignals);
    }
  }, [processedSignals, filterConfig]);

  // ===================================================================
  // COMBINED FILTERING (Enhanced + Basic)
  // ===================================================================

  const finalFilteredResults = useMemo(() => {
    // Start with enhanced filtered signals, but convert to StockResult format for compatibility
    let results: StockResult[] = [];

    if (filteredSignals.length > 0) {
      // Convert ProcessedSignal[] to StockResult[] for existing UI
      results = filteredSignals.map((signal) => ({
        ticker: signal.ticker,
        score: signal.finalScore,
        accepted: true,
        signalStrength: signal.signalStrength,
        signalType: signal.signalType,
        companyName: signal.ticker, // Would need additional mapping
        sector: "Unknown", // Would need additional mapping
      }));
    } else {
      // Fall back to original allResults if no enhanced filtering
      results = [...allResults];
    }

    // Apply basic filters for backward compatibility
    if (searchTerm) {
      results = results.filter(
        (r) =>
          r.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.sector?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      results = results.filter((r) =>
        selectedCategory === "accepted" ? r.accepted : !r.accepted
      );
    }

    if (scoreRangeFilter !== "all") {
      switch (scoreRangeFilter) {
        case "70+":
          results = results.filter((r) => r.score >= 70);
          break;
        case "60-69":
          results = results.filter((r) => r.score >= 60 && r.score < 70);
          break;
        case "50-59":
          results = results.filter((r) => r.score >= 50 && r.score < 60);
          break;
        case "<50":
          results = results.filter((r) => r.score < 50);
          break;
      }
    }

    // Sort results
    results.sort((a, b) => {
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

    return results;
  }, [
    filteredSignals,
    allResults,
    searchTerm,
    selectedCategory,
    scoreRangeFilter,
    sortBy,
    sortOrder,
  ]);

  // ===================================================================
  // EXISTING METHODS (keeping your current implementation)
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

  const startRealMarketScan = async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    setAllResults([]);
    setProcessedSignals([]);
    setFilteredSignals([]);
    setProcessingStats(null);
    setFilterStats(null);

    try {
      console.log("🚀 Starting comprehensive market scan...");
      const startTime = Date.now();

      const stockScanner = new StockScanner();
      const signalProcessor = new SignalProcessor();
      signalProcessor.clearResults();

      const stockUniverse = StockScanner.getDefaultStockUniverse();
      console.log(`📊 Scanning ${stockUniverse.length} stocks for signals`);

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
  // EXISTING HELPER FUNCTIONS (keeping your current implementation)
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

  // ===================================================================
  // LIFECYCLE
  // ===================================================================

  useEffect(() => {
    testSystemHealth();
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
                🔬 ENHANCED Stock Signal Generator
              </h1>
              <p className="text-slate-400 text-sm">
                Professional filtering • Custom presets • Advanced criteria •
                AI-powered insights
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
                🎯 Enhanced Signal Processing Control
              </h2>
              <p className="text-slate-400">
                Advanced filtering • Professional presets • Custom criteria •
                Real-time insights
              </p>
            </div>

            <div className="flex items-center space-x-4">
              {/* Enhanced Filters Toggle */}
              <button
                onClick={() => setShowEnhancedFilters(!showEnhancedFilters)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  showEnhancedFilters
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                    : "bg-slate-700 hover:bg-slate-600 text-slate-300"
                }`}
              >
                {showEnhancedFilters ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
                <span>Enhanced Filters</span>
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
                    <span>🚀 Start Enhanced Analysis</span>
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

        {/* Enhanced Filters Panel */}
        {showEnhancedFilters && (
          <EnhancedFiltersPanel
            onFiltersChange={setFilterConfig}
            currentStats={
              filterStats
                ? {
                    originalCount: filterStats.originalCount,
                    filteredCount: filterStats.finalCount,
                    rejectionReasons: filterStats.rejectionReasons,
                  }
                : undefined
            }
            className="mb-8"
          />
        )}

        {/* Filter Recommendations */}
        {filterRecommendations.length > 0 && (
          <div className="bg-blue-900/20 border border-blue-600/50 rounded-lg p-4 mb-8">
            <h4 className="font-semibold text-blue-400 mb-2">
              💡 Filter Insights & Recommendations
            </h4>
            <ul className="space-y-1">
              {filterRecommendations.map((rec, index) => (
                <li key={index} className="text-sm text-blue-300">
                  • {rec}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Enhanced Statistics Overview */}
        {processingStats && (
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
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
              <div className="text-slate-400 text-sm">Base Signals</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">
                {filteredSignals.length}
              </div>
              <div className="text-slate-400 text-sm">Filtered Signals</div>
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
              <div className="text-2xl font-bold text-cyan-400">
                {filterStats
                  ? Math.round(
                      (filterStats.finalCount / filterStats.originalCount) * 100
                    )
                  : 100}
                %
              </div>
              <div className="text-slate-400 text-sm">Filter Pass Rate</div>
            </div>
          </div>
        )}

        {/* Basic Filters (keeping for backward compatibility) */}
        {finalFilteredResults.length > 0 && (
          <div className="bg-slate-800/50 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Quick Filters & Search
              </h3>
              <div className="text-slate-400">
                Showing {finalFilteredResults.length} signals
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
                <option value="all">All Signals</option>
                <option value="accepted">Accepted Only</option>
                <option value="rejected">Rejected Only</option>
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

        {/* Results Table (keeping your existing table structure) */}
        {finalFilteredResults.length > 0 && (
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
                  {finalFilteredResults.map((result, index) => (
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
        {finalFilteredResults.length === 0 && !isProcessing && (
          <div className="text-center py-12">
            <div className="text-slate-400 mb-4">
              <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Ready for enhanced signal analysis</p>
              <p className="text-sm">
                Configure enhanced filters and click "🚀 Start Enhanced
                Analysis"
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignalsTest;
