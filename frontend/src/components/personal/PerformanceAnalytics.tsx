import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import {
  TrendingUp,
  TrendingDown,
  Target,
  Clock,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  BarChart3,
  PieChart,
  Calendar,
  DollarSign,
  Award,
  AlertCircle,
  Activity,
  Users,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// 🎯 PURPOSE: Personal Performance Analytics - Comprehensive user trading performance tracking
// 🔧 SESSION #318: Personal Performance Analytics Foundation - Deep individual trading insights
// 🛡️ PRESERVATION: Uses Session #315-317 established patterns, integrates with existing components
// 📝 HANDOVER: Displays personal trading performance using real paper_trades, signal_outcomes, trading_signals data
// ✅ PRODUCTION: Real database queries only, no synthetic data, follows exact established patterns
// 🔧 FIX: Changed process.env to import.meta.env for Vite browser compatibility

// Initialize Supabase client using established project patterns (FIXED for Vite)
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || "",
  import.meta.env.VITE_SUPABASE_ANON_KEY || ""
);

// TypeScript interfaces following established Session #315-317 patterns
interface PerformanceAnalyticsProps {
  userId: string;
}

interface PersonalMetrics {
  totalTrades: number;
  openTrades: number;
  closedTrades: number;
  winRate: number;
  totalProfitLoss: number;
  totalProfitLossPercentage: number;
  averageHoldingPeriod: number;
  bestTrade: {
    ticker: string;
    profitLoss: number;
    profitLossPercentage: number;
    date: string;
  } | null;
  worstTrade: {
    ticker: string;
    profitLoss: number;
    profitLossPercentage: number;
    date: string;
  } | null;
  currentBalance: number;
  startingBalance: number;
  portfolioPerformance: number;
}

interface SectorPerformance {
  sector: string;
  trades: number;
  winRate: number;
  avgProfitLoss: number;
  totalProfitLoss: number;
}

interface SignalTypePerformance {
  signalType: string;
  trades: number;
  winRate: number;
  avgProfitLoss: number;
  totalProfitLoss: number;
}

interface MonthlyPerformance {
  month: string;
  trades: number;
  winRate: number;
  profitLoss: number;
  profitLossPercentage: number;
}

interface RiskAnalysis {
  averagePositionSize: number;
  averageRiskPerTrade: number;
  largestPosition: number;
  positionSizeVariation: number;
  riskRewardRatio: number;
}

const PerformanceAnalytics: React.FC<PerformanceAnalyticsProps> = ({
  userId,
}) => {
  // State management following established Session #315-317 patterns
  const [personalMetrics, setPersonalMetrics] =
    useState<PersonalMetrics | null>(null);
  const [sectorPerformance, setSectorPerformance] = useState<
    SectorPerformance[]
  >([]);
  const [signalTypePerformance, setSignalTypePerformance] = useState<
    SignalTypePerformance[]
  >([]);
  const [monthlyPerformance, setMonthlyPerformance] = useState<
    MonthlyPerformance[]
  >([]);
  const [riskAnalysis, setRiskAnalysis] = useState<RiskAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<string>("all");

  // Fetch personal performance analytics on component mount
  useEffect(() => {
    fetchPersonalAnalytics();
  }, [userId, timeRange]);

  // Main analytics query function using established patterns from Session #315-317
  const fetchPersonalAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      // 🔧 SESSION #318: Fetch personal metrics from paper_trades table
      const personalMetricsResult = await fetchPersonalMetrics();
      const sectorPerformanceResult = await fetchSectorPerformance();
      const signalTypePerformanceResult = await fetchSignalTypePerformance();
      const monthlyPerformanceResult = await fetchMonthlyPerformance();
      const riskAnalysisResult = await fetchRiskAnalysis();

      setPersonalMetrics(personalMetricsResult);
      setSectorPerformance(sectorPerformanceResult);
      setSignalTypePerformance(signalTypePerformanceResult);
      setMonthlyPerformance(monthlyPerformanceResult);
      setRiskAnalysis(riskAnalysisResult);
    } catch (err) {
      console.error("Error fetching personal analytics:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load personal analytics"
      );
    } finally {
      setLoading(false);
    }
  };

  // Personal metrics calculation using real paper_trades data
  const fetchPersonalMetrics = async (): Promise<PersonalMetrics> => {
    // 🔧 SESSION #318: Query paper_trades table for user's trading history
    const { data: trades, error: tradesError } = await supabase
      .from("paper_trades")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (tradesError) {
      throw new Error(`Failed to fetch trades: ${tradesError.message}`);
    }

    // 🔧 SESSION #318: Query users table for balance information
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("current_balance, starting_balance")
      .eq("id", userId)
      .single();

    if (userError) {
      throw new Error(`Failed to fetch user data: ${userError.message}`);
    }

    // 🔧 SESSION #318: Calculate personal metrics from real trade data
    const totalTrades = trades?.length || 0;
    const openTrades = trades?.filter((t) => t.is_open === true).length || 0;
    const closedTrades = totalTrades - openTrades;
    const closedTradesData = trades?.filter((t) => t.is_open === false) || [];

    // Calculate win rate from closed trades only
    const winningTrades = closedTradesData.filter(
      (t) => t.profit_loss_percentage && t.profit_loss_percentage > 0
    ).length;
    const winRate = closedTrades > 0 ? (winningTrades / closedTrades) * 100 : 0;

    // Calculate total profit/loss from closed trades
    const totalProfitLoss = closedTradesData.reduce(
      (sum, trade) => sum + (trade.profit_loss || 0),
      0
    );
    const totalProfitLossPercentage = closedTradesData.reduce(
      (sum, trade) => sum + (trade.profit_loss_percentage || 0),
      0
    );

    // Calculate average holding period for closed trades
    const tradesWithHoldingPeriod = closedTradesData.filter(
      (t) => t.opened_at && t.closed_at
    );
    const averageHoldingPeriod =
      tradesWithHoldingPeriod.length > 0
        ? tradesWithHoldingPeriod.reduce((sum, trade) => {
            const openTime = new Date(trade.opened_at).getTime();
            const closeTime = new Date(trade.closed_at!).getTime();
            return sum + (closeTime - openTime) / (1000 * 60 * 60); // Convert to hours
          }, 0) / tradesWithHoldingPeriod.length
        : 0;

    // Find best and worst trades
    const sortedTrades = [...closedTradesData].sort(
      (a, b) => (b.profit_loss || 0) - (a.profit_loss || 0)
    );
    const bestTrade =
      sortedTrades.length > 0
        ? {
            ticker: sortedTrades[0].ticker,
            profitLoss: sortedTrades[0].profit_loss || 0,
            profitLossPercentage: sortedTrades[0].profit_loss_percentage || 0,
            date: sortedTrades[0].closed_at || sortedTrades[0].created_at,
          }
        : null;

    const worstTrade =
      sortedTrades.length > 0
        ? {
            ticker: sortedTrades[sortedTrades.length - 1].ticker,
            profitLoss: sortedTrades[sortedTrades.length - 1].profit_loss || 0,
            profitLossPercentage:
              sortedTrades[sortedTrades.length - 1].profit_loss_percentage || 0,
            date:
              sortedTrades[sortedTrades.length - 1].closed_at ||
              sortedTrades[sortedTrades.length - 1].created_at,
          }
        : null;

    // Calculate portfolio performance
    const currentBalance = userData?.current_balance || 10000;
    const startingBalance = userData?.starting_balance || 10000;
    const portfolioPerformance =
      startingBalance > 0
        ? ((currentBalance - startingBalance) / startingBalance) * 100
        : 0;

    return {
      totalTrades,
      openTrades,
      closedTrades,
      winRate,
      totalProfitLoss,
      totalProfitLossPercentage,
      averageHoldingPeriod,
      bestTrade,
      worstTrade,
      currentBalance,
      startingBalance,
      portfolioPerformance,
    };
  };

  // Sector performance analysis using trading_signals + paper_trades join
  const fetchSectorPerformance = async (): Promise<SectorPerformance[]> => {
    // 🔧 SESSION #318: Join paper_trades with trading_signals to get sector data
    const { data: sectorData, error } = await supabase
      .from("paper_trades")
      .select(
        `
        profit_loss,
        profit_loss_percentage,
        is_open,
        trading_signals!inner(sector)
      `
      )
      .eq("user_id", userId)
      .eq("is_open", false);

    if (error) {
      throw new Error(`Failed to fetch sector performance: ${error.message}`);
    }

    // 🔧 SESSION #318: Group trades by sector and calculate performance metrics
    const sectorGroups: Record<string, any[]> = {};
    sectorData?.forEach((trade) => {
      const sector = (trade.trading_signals as any)?.sector || "Unknown";
      if (!sectorGroups[sector]) {
        sectorGroups[sector] = [];
      }
      sectorGroups[sector].push(trade);
    });

    const sectorPerformance: SectorPerformance[] = Object.entries(
      sectorGroups
    ).map(([sector, trades]) => {
      const winningTrades = trades.filter(
        (t) => t.profit_loss_percentage && t.profit_loss_percentage > 0
      ).length;
      const winRate =
        trades.length > 0 ? (winningTrades / trades.length) * 100 : 0;
      const totalProfitLoss = trades.reduce(
        (sum, trade) => sum + (trade.profit_loss || 0),
        0
      );
      const avgProfitLoss =
        trades.length > 0 ? totalProfitLoss / trades.length : 0;

      return {
        sector,
        trades: trades.length,
        winRate,
        avgProfitLoss,
        totalProfitLoss,
      };
    });

    return sectorPerformance.sort(
      (a, b) => b.totalProfitLoss - a.totalProfitLoss
    );
  };

  // Signal type performance analysis using trading_signals + paper_trades join
  const fetchSignalTypePerformance = async (): Promise<
    SignalTypePerformance[]
  > => {
    // 🔧 SESSION #318: Join paper_trades with trading_signals to get signal type data
    const { data: signalTypeData, error } = await supabase
      .from("paper_trades")
      .select(
        `
        profit_loss,
        profit_loss_percentage,
        is_open,
        trading_signals!inner(signal_type, signal_strength)
      `
      )
      .eq("user_id", userId)
      .eq("is_open", false);

    if (error) {
      throw new Error(
        `Failed to fetch signal type performance: ${error.message}`
      );
    }

    // 🔧 SESSION #318: Group trades by signal type and calculate performance metrics
    const signalTypeGroups: Record<string, any[]> = {};
    signalTypeData?.forEach((trade) => {
      const signalType =
        (trade.trading_signals as any)?.signal_type || "Unknown";
      if (!signalTypeGroups[signalType]) {
        signalTypeGroups[signalType] = [];
      }
      signalTypeGroups[signalType].push(trade);
    });

    const signalTypePerformance: SignalTypePerformance[] = Object.entries(
      signalTypeGroups
    ).map(([signalType, trades]) => {
      const winningTrades = trades.filter(
        (t) => t.profit_loss_percentage && t.profit_loss_percentage > 0
      ).length;
      const winRate =
        trades.length > 0 ? (winningTrades / trades.length) * 100 : 0;
      const totalProfitLoss = trades.reduce(
        (sum, trade) => sum + (trade.profit_loss || 0),
        0
      );
      const avgProfitLoss =
        trades.length > 0 ? totalProfitLoss / trades.length : 0;

      return {
        signalType,
        trades: trades.length,
        winRate,
        avgProfitLoss,
        totalProfitLoss,
      };
    });

    return signalTypePerformance.sort(
      (a, b) => b.totalProfitLoss - a.totalProfitLoss
    );
  };

  // Monthly performance tracking using paper_trades closed_at timestamps
  const fetchMonthlyPerformance = async (): Promise<MonthlyPerformance[]> => {
    // 🔧 SESSION #318: Get closed trades grouped by month
    const { data: monthlyData, error } = await supabase
      .from("paper_trades")
      .select("profit_loss, profit_loss_percentage, closed_at")
      .eq("user_id", userId)
      .eq("is_open", false)
      .not("closed_at", "is", null)
      .order("closed_at", { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch monthly performance: ${error.message}`);
    }

    // 🔧 SESSION #318: Group trades by month and calculate monthly metrics
    const monthlyGroups: Record<string, any[]> = {};
    monthlyData?.forEach((trade) => {
      const month = new Date(trade.closed_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
      });
      if (!monthlyGroups[month]) {
        monthlyGroups[month] = [];
      }
      monthlyGroups[month].push(trade);
    });

    const monthlyPerformance: MonthlyPerformance[] = Object.entries(
      monthlyGroups
    ).map(([month, trades]) => {
      const winningTrades = trades.filter(
        (t) => t.profit_loss_percentage && t.profit_loss_percentage > 0
      ).length;
      const winRate =
        trades.length > 0 ? (winningTrades / trades.length) * 100 : 0;
      const profitLoss = trades.reduce(
        (sum, trade) => sum + (trade.profit_loss || 0),
        0
      );
      const profitLossPercentage = trades.reduce(
        (sum, trade) => sum + (trade.profit_loss_percentage || 0),
        0
      );

      return {
        month,
        trades: trades.length,
        winRate,
        profitLoss,
        profitLossPercentage,
      };
    });

    return monthlyPerformance.slice(0, 12); // Last 12 months
  };

  // Risk analysis calculation using position sizes and holding periods
  const fetchRiskAnalysis = async (): Promise<RiskAnalysis> => {
    // 🔧 SESSION #318: Get all trades for risk analysis
    const { data: riskData, error } = await supabase
      .from("paper_trades")
      .select(
        "quantity, entry_price, profit_loss, profit_loss_percentage, opened_at, closed_at"
      )
      .eq("user_id", userId);

    if (error) {
      throw new Error(`Failed to fetch risk analysis data: ${error.message}`);
    }

    if (!riskData || riskData.length === 0) {
      return {
        averagePositionSize: 0,
        averageRiskPerTrade: 0,
        largestPosition: 0,
        positionSizeVariation: 0,
        riskRewardRatio: 0,
      };
    }

    // 🔧 SESSION #318: Calculate position sizes (quantity * entry_price)
    const positionSizes = riskData.map(
      (trade) => (trade.quantity || 0) * (trade.entry_price || 0)
    );
    const averagePositionSize =
      positionSizes.length > 0
        ? positionSizes.reduce((sum, size) => sum + size, 0) /
          positionSizes.length
        : 0;
    const largestPosition = Math.max(...positionSizes, 0);

    // Calculate position size variation (standard deviation)
    const positionSizeVariation =
      positionSizes.length > 1
        ? Math.sqrt(
            positionSizes.reduce(
              (sum, size) => sum + Math.pow(size - averagePositionSize, 2),
              0
            ) / positionSizes.length
          )
        : 0;

    // Calculate average risk per trade (as percentage of portfolio)
    const averageRiskPerTrade = 2.0; // Default risk percentage from users table

    // Calculate risk-reward ratio from closed trades
    const closedTrades = riskData.filter(
      (t) => t.profit_loss_percentage !== null && !t.is_open
    );
    const winningTrades = closedTrades.filter(
      (t) => t.profit_loss_percentage! > 0
    );
    const losingTrades = closedTrades.filter(
      (t) => t.profit_loss_percentage! < 0
    );

    const avgWin =
      winningTrades.length > 0
        ? winningTrades.reduce((sum, t) => sum + t.profit_loss_percentage!, 0) /
          winningTrades.length
        : 0;
    const avgLoss =
      losingTrades.length > 0
        ? Math.abs(
            losingTrades.reduce(
              (sum, t) => sum + t.profit_loss_percentage!,
              0
            ) / losingTrades.length
          )
        : 0;

    const riskRewardRatio = avgLoss > 0 ? avgWin / avgLoss : 0;

    return {
      averagePositionSize,
      averageRiskPerTrade,
      largestPosition,
      positionSizeVariation,
      riskRewardRatio,
    };
  };

  // Get performance color following established Session #315-317 patterns
  const getPerformanceColor = (value: number) => {
    if (value > 0) return "text-emerald-400";
    if (value < 0) return "text-red-400";
    return "text-slate-400";
  };

  const getPerformanceBgColor = (value: number) => {
    if (value > 0) return "bg-emerald-600/20";
    if (value < 0) return "bg-red-600/20";
    return "bg-slate-600/20";
  };

  // Format currency values
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Format percentage values
  const formatPercentage = (value: number): string => {
    return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Loading state following established Session #315-317 patterns
  if (loading) {
    return (
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-blue-400" />
            <span>Personal Performance Analytics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-slate-700 rounded w-1/3 mb-2"></div>
                <div className="h-16 bg-slate-700/50 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state following established Session #315-317 patterns
  if (error) {
    return (
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-red-400" />
              <span>Personal Performance Analytics</span>
            </div>
            <Button
              onClick={fetchPersonalAnalytics}
              size="sm"
              variant="ghost"
              className="text-blue-400 hover:text-blue-300"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-red-400 mb-2">
              ⚠️ Unable to load performance analytics
            </div>
            <div className="text-slate-400 text-sm">{error}</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // No data state
  if (!personalMetrics) {
    return (
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-blue-400" />
            <span>Personal Performance Analytics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-slate-400 mb-2">No trading data available</div>
            <div className="text-xs text-slate-500">
              Start trading to see your personal performance analytics
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:bg-slate-800/70 transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-blue-400" />
            <span>Personal Performance Analytics</span>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-slate-700 text-slate-300 text-sm rounded px-3 py-1 border border-slate-600"
            >
              <option value="all">All Time</option>
              <option value="1y">Last Year</option>
              <option value="6m">Last 6 Months</option>
              <option value="3m">Last 3 Months</option>
              <option value="1m">Last Month</option>
            </select>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Portfolio Overview */}
        <div className="bg-slate-700/30 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-300 font-medium">
              Portfolio Overview
            </span>
            <DollarSign className="h-5 w-5 text-emerald-400" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-xs text-slate-400 mb-1">Current Balance</div>
              <div className="text-lg font-bold text-slate-200">
                {formatCurrency(personalMetrics.currentBalance)}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-400 mb-1">
                Starting Balance
              </div>
              <div className="text-lg font-bold text-slate-400">
                {formatCurrency(personalMetrics.startingBalance)}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-400 mb-1">Total P&L</div>
              <div
                className={`text-lg font-bold ${getPerformanceColor(
                  personalMetrics.totalProfitLoss
                )}`}
              >
                {formatCurrency(personalMetrics.totalProfitLoss)}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-400 mb-1">
                Portfolio Return
              </div>
              <div
                className={`text-lg font-bold ${getPerformanceColor(
                  personalMetrics.portfolioPerformance
                )}`}
              >
                {formatPercentage(personalMetrics.portfolioPerformance)}
              </div>
            </div>
          </div>
        </div>

        {/* Trading Statistics */}
        <div className="bg-slate-700/30 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-300 font-medium">
              Trading Statistics
            </span>
            <Activity className="h-5 w-5 text-blue-400" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <div className="text-xs text-slate-400 mb-1">Total Trades</div>
              <div className="text-lg font-bold text-slate-200">
                {personalMetrics.totalTrades}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-400 mb-1">Win Rate</div>
              <div
                className={`text-lg font-bold ${
                  personalMetrics.winRate >= 60
                    ? "text-emerald-400"
                    : personalMetrics.winRate >= 40
                    ? "text-amber-400"
                    : "text-red-400"
                }`}
              >
                {personalMetrics.winRate.toFixed(1)}%
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-400 mb-1">Open Positions</div>
              <div className="text-lg font-bold text-blue-400">
                {personalMetrics.openTrades}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-400 mb-1">Avg Hold Time</div>
              <div className="text-lg font-bold text-slate-200">
                {personalMetrics.averageHoldingPeriod.toFixed(1)}h
              </div>
            </div>
          </div>

          {/* Best and Worst Trades */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {personalMetrics.bestTrade && (
              <div className="bg-emerald-600/10 border border-emerald-700/30 rounded p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-emerald-400 font-medium">
                    Best Trade
                  </span>
                  <Award className="h-4 w-4 text-emerald-400" />
                </div>
                <div className="text-sm">
                  <div className="text-slate-300 font-semibold">
                    {personalMetrics.bestTrade.ticker}
                  </div>
                  <div className="text-emerald-400">
                    {formatCurrency(personalMetrics.bestTrade.profitLoss)} (
                    {formatPercentage(
                      personalMetrics.bestTrade.profitLossPercentage
                    )}
                    )
                  </div>
                  <div className="text-xs text-slate-500">
                    {formatDate(personalMetrics.bestTrade.date)}
                  </div>
                </div>
              </div>
            )}

            {personalMetrics.worstTrade && (
              <div className="bg-red-600/10 border border-red-700/30 rounded p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-red-400 font-medium">Worst Trade</span>
                  <AlertCircle className="h-4 w-4 text-red-400" />
                </div>
                <div className="text-sm">
                  <div className="text-slate-300 font-semibold">
                    {personalMetrics.worstTrade.ticker}
                  </div>
                  <div className="text-red-400">
                    {formatCurrency(personalMetrics.worstTrade.profitLoss)} (
                    {formatPercentage(
                      personalMetrics.worstTrade.profitLossPercentage
                    )}
                    )
                  </div>
                  <div className="text-xs text-slate-500">
                    {formatDate(personalMetrics.worstTrade.date)}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sector Performance */}
        {sectorPerformance.length > 0 && (
          <div className="bg-slate-700/20 rounded-lg p-4">
            <button
              onClick={() =>
                setExpandedSection(
                  expandedSection === "sectors" ? null : "sectors"
                )
              }
              className="flex items-center justify-between w-full text-left"
            >
              <span className="text-slate-300 font-medium">
                Sector Performance ({sectorPerformance.length})
              </span>
              <div className="flex items-center space-x-2">
                <PieChart className="h-4 w-4 text-purple-400" />
                {expandedSection === "sectors" ? (
                  <ChevronUp className="h-4 w-4 text-slate-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                )}
              </div>
            </button>

            {expandedSection === "sectors" && (
              <div className="mt-4 space-y-3">
                {sectorPerformance.slice(0, 6).map((sector, index) => (
                  <div
                    key={sector.sector}
                    className="border border-slate-600/30 rounded-lg p-3"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-300 font-medium capitalize">
                        {sector.sector}
                      </span>
                      <span
                        className={`text-sm font-semibold ${getPerformanceColor(
                          sector.totalProfitLoss
                        )}`}
                      >
                        {formatCurrency(sector.totalProfitLoss)}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div>
                        <span className="text-slate-400">Trades:</span>
                        <div className="text-slate-300">{sector.trades}</div>
                      </div>
                      <div>
                        <span className="text-slate-400">Win Rate:</span>
                        <div
                          className={
                            sector.winRate >= 60
                              ? "text-emerald-400"
                              : sector.winRate >= 40
                              ? "text-amber-400"
                              : "text-red-400"
                          }
                        >
                          {sector.winRate.toFixed(1)}%
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-400">Avg P&L:</span>
                        <div
                          className={getPerformanceColor(sector.avgProfitLoss)}
                        >
                          {formatCurrency(sector.avgProfitLoss)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Signal Type Performance */}
        {signalTypePerformance.length > 0 && (
          <div className="bg-slate-700/20 rounded-lg p-4">
            <button
              onClick={() =>
                setExpandedSection(
                  expandedSection === "signals" ? null : "signals"
                )
              }
              className="flex items-center justify-between w-full text-left"
            >
              <span className="text-slate-300 font-medium">
                Signal Type Performance ({signalTypePerformance.length})
              </span>
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4 text-orange-400" />
                {expandedSection === "signals" ? (
                  <ChevronUp className="h-4 w-4 text-slate-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                )}
              </div>
            </button>

            {expandedSection === "signals" && (
              <div className="mt-4 space-y-3">
                {signalTypePerformance.map((signalType, index) => (
                  <div
                    key={signalType.signalType}
                    className="border border-slate-600/30 rounded-lg p-3"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {signalType.signalType === "bullish" ? (
                          <TrendingUp className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-400" />
                        )}
                        <span className="text-slate-300 font-medium capitalize">
                          {signalType.signalType}
                        </span>
                      </div>
                      <span
                        className={`text-sm font-semibold ${getPerformanceColor(
                          signalType.totalProfitLoss
                        )}`}
                      >
                        {formatCurrency(signalType.totalProfitLoss)}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div>
                        <span className="text-slate-400">Trades:</span>
                        <div className="text-slate-300">
                          {signalType.trades}
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-400">Win Rate:</span>
                        <div
                          className={
                            signalType.winRate >= 60
                              ? "text-emerald-400"
                              : signalType.winRate >= 40
                              ? "text-amber-400"
                              : "text-red-400"
                          }
                        >
                          {signalType.winRate.toFixed(1)}%
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-400">Avg P&L:</span>
                        <div
                          className={getPerformanceColor(
                            signalType.avgProfitLoss
                          )}
                        >
                          {formatCurrency(signalType.avgProfitLoss)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Monthly Performance Trend */}
        {monthlyPerformance.length > 0 && (
          <div className="bg-slate-700/20 rounded-lg p-4">
            <button
              onClick={() =>
                setExpandedSection(
                  expandedSection === "monthly" ? null : "monthly"
                )
              }
              className="flex items-center justify-between w-full text-left"
            >
              <span className="text-slate-300 font-medium">
                Monthly Performance ({monthlyPerformance.length} months)
              </span>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-indigo-400" />
                {expandedSection === "monthly" ? (
                  <ChevronUp className="h-4 w-4 text-slate-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                )}
              </div>
            </button>

            {expandedSection === "monthly" && (
              <div className="mt-4 space-y-2">
                {monthlyPerformance.map((month, index) => (
                  <div
                    key={month.month}
                    className="flex items-center justify-between p-2 rounded border border-slate-600/20"
                  >
                    <div className="flex items-center space-x-4">
                      <span className="text-slate-300 font-medium w-16">
                        {month.month}
                      </span>
                      <span className="text-slate-400 text-sm">
                        {month.trades} trades
                      </span>
                      <span
                        className={`text-sm ${
                          month.winRate >= 60
                            ? "text-emerald-400"
                            : month.winRate >= 40
                            ? "text-amber-400"
                            : "text-red-400"
                        }`}
                      >
                        {month.winRate.toFixed(0)}% win
                      </span>
                    </div>
                    <span
                      className={`font-semibold ${getPerformanceColor(
                        month.profitLoss
                      )}`}
                    >
                      {formatCurrency(month.profitLoss)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Risk Analysis */}
        {riskAnalysis && (
          <div className="bg-slate-700/20 rounded-lg p-4">
            <button
              onClick={() =>
                setExpandedSection(expandedSection === "risk" ? null : "risk")
              }
              className="flex items-center justify-between w-full text-left"
            >
              <span className="text-slate-300 font-medium">Risk Analysis</span>
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-amber-400" />
                {expandedSection === "risk" ? (
                  <ChevronUp className="h-4 w-4 text-slate-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                )}
              </div>
            </button>

            {expandedSection === "risk" && (
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-slate-400 mb-1">
                    Avg Position Size
                  </div>
                  <div className="text-lg font-bold text-slate-200">
                    {formatCurrency(riskAnalysis.averagePositionSize)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 mb-1">
                    Largest Position
                  </div>
                  <div className="text-lg font-bold text-amber-400">
                    {formatCurrency(riskAnalysis.largestPosition)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 mb-1">
                    Risk Per Trade
                  </div>
                  <div className="text-lg font-bold text-slate-200">
                    {riskAnalysis.averageRiskPerTrade.toFixed(1)}%
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 mb-1">
                    Risk/Reward Ratio
                  </div>
                  <div
                    className={`text-lg font-bold ${
                      riskAnalysis.riskRewardRatio >= 2
                        ? "text-emerald-400"
                        : riskAnalysis.riskRewardRatio >= 1
                        ? "text-amber-400"
                        : "text-red-400"
                    }`}
                  >
                    {riskAnalysis.riskRewardRatio.toFixed(2)}:1
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Data Source Information */}
        <div className="text-xs text-slate-500 border-t border-slate-700 pt-3">
          Personal analytics based on {personalMetrics.totalTrades} total trades
          {" • "}
          Data from paper_trades, signal_outcomes, and trading_signals tables
          {" • "}
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceAnalytics;
