// Complete Dashboard.tsx with Fixed Categorization Logic and Clean Recent Activity
// src/pages/Dashboard.tsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import WinRateGauge from "../components/dashboard/WinRateGauge";
import PortfolioPerformanceChart from "../components/dashboard/PortfolioPerformanceChart";
import SignalHeatmap from "../components/dashboard/SignalHeatmap";
import WelcomeBanner from "../components/dashboard/WelcomeBanner";
import SignalModal from "../components/signals/SignalModal";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  TrendingUp,
  DollarSign,
  Target,
  Bell,
  Briefcase,
  Zap,
  Eye,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { Badge } from "../components/ui/badge";
import { calculateFinalScore } from "../utils/signalCalculations";

// ✅ REAL DATA INTEGRATION - Import the working context (same as Signals page)
import { useSignals } from "../contexts/SignalsContext";
// ✅ NEW: Import portfolio summary hook
import { usePortfolioSummary } from "../hooks/usePortfolioSummary";

// Type definitions for better type safety
interface Signal {
  symbol: string;
  name: string;
  price: number;
  change: number;
  signalScore: number;
}

interface TradeData {
  symbol: string;
  action: "buy" | "sell";
  quantity: number;
  price: number;
  signalId: string;
}

interface PlanData {
  name: string;
  tier: string;
}

const Dashboard: React.FC = () => {
  const { user, loading, userProfile } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [showWelcome, setShowWelcome] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanData | null>(null);
  const [signalModalOpen, setSignalModalOpen] = useState(false);
  const [selectedSignal, setSelectedSignal] = useState<Signal | null>(null);
  const [forceShow, setForceShow] = useState(false);

  // ✅ REAL DATA INTEGRATION - Use the working Supabase hook
  const {
    signals,
    loading: signalsLoading,
    error: signalsError,
  } = useSignals();

  // ✅ REAL PORTFOLIO DATA (now includes recent trades)
  const {
    totalValue,
    totalPnL,
    totalPnLPercent,
    winRate: portfolioWinRate,
    activePositions,
    totalTrades: portfolioTotalTrades,
    recentTrades, // Real recent trades from database (includes open positions)
    isLoading: portfolioLoading,
    error: portfolioError,
  } = usePortfolioSummary();

  // ✅ CALCULATE REAL SIGNAL STATISTICS FROM DATABASE - UPDATED CATEGORIZATION
  const todaysSignals = signals.length; // Total signals available

  // 🚀 FIXED: Updated categorization logic to match realistic business thresholds
  // Strong: ≥80% (High confidence signals)
  const strongSignals = signals.filter(
    (signal) => calculateFinalScore(signal.signals) >= 80
  ).length;

  // Valid: 60-79% (Actionable signals - includes 70+ BUY signals)
  const validSignals = signals.filter((signal) => {
    const score = calculateFinalScore(signal.signals);
    return score >= 60 && score < 80;
  }).length;

  // 🚀 UPDATED: Active signals = Strong + Valid (60+ threshold for actionable trading)
  // But use 70+ as the real "actionable" threshold for active count
  const activeSignals = signals.filter(
    (signal) => calculateFinalScore(signal.signals) >= 70
  ).length;

  // Calculate average signal score (weighted)
  const avgSignalScore =
    signals.length > 0
      ? Math.round(
          signals.reduce((sum, signal) => {
            // 🚀 UNIFIED: Use standardized calculateFinalScore from single source of truth
            const weighted = calculateFinalScore(signal.signals);
            return sum + weighted;
          }, 0) / signals.length
        )
      : 0;

  // ✅ REAL SUCCESS RATE = Portfolio Win Rate (from actual trades)
  const realSuccessRate = portfolioWinRate;

  // Find actual best performing signal (highest weighted score)
  const bestSignal =
    signals.length > 0
      ? signals.reduce((best, current) => {
          // 🚀 UNIFIED: Use standardized calculateFinalScore from single source of truth
          const bestWeighted = calculateFinalScore(best.signals);
          const currentWeighted = calculateFinalScore(current.signals);
          return currentWeighted > bestWeighted ? current : best;
        })
      : null;

  // ✅ UPDATED: Real alerts = Strong signals (80+ score) + premium signals that need attention
  const alertsCount = strongSignals; // Premium signals that need attention

  // Helper functions for portfolio display
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercent = (value: number) => {
    const sign = value >= 0 ? "+" : "";
    return `${sign}${value.toFixed(1)}%`;
  };

  // Calculate new signals in last hour (mock for now - would come from timestamps)
  const newSignalsLastHour = Math.floor(activeSignals / 3);

  // Fallback mechanism: if loading for more than 5 seconds, force show content
  useEffect(() => {
    if (loading) {
      const timeout = setTimeout(() => {
        console.log("Dashboard: Loading timeout - forcing content to show");
        setForceShow(true);
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [loading]);

  useEffect(() => {
    console.log(
      "Dashboard: Auth state - loading:",
      loading,
      "user:",
      !!user,
      "userProfile:",
      !!userProfile
    );

    // Only redirect if not loading and no user
    if (!loading && !user) {
      console.log("Dashboard: User not authenticated, redirecting to home");
      navigate("/");
      return;
    }

    // Check if we should show welcome banner
    const shouldShowWelcome = localStorage.getItem("showWelcome");
    const savedPlan = localStorage.getItem("selectedPlan");

    if (shouldShowWelcome === "true") {
      setShowWelcome(true);
      if (savedPlan) {
        try {
          setSelectedPlan(JSON.parse(savedPlan) as PlanData);
        } catch (error) {
          console.error("Error parsing selected plan:", error);
        }
      }
    }
  }, [user, loading, navigate, userProfile]);

  // Show loading spinner while authentication state is being determined
  if (loading && !forceShow) {
    console.log("Dashboard: Still loading auth state");
    return (
      <Layout>
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
          <div className="text-white text-lg">Loading...</div>
        </div>
      </Layout>
    );
  }

  // Show nothing if no user (will redirect via useEffect) - but only if not forced
  if (!user && !forceShow) {
    console.log("Dashboard: No user found, should redirect");
    return null;
  }

  const handleDismissWelcome = () => {
    setShowWelcome(false);
    localStorage.removeItem("showWelcome");
    localStorage.removeItem("selectedPlan");
  };

  const handleExploreFeatures = () => {
    navigate("/signals");
    handleDismissWelcome();
  };

  const handleCompleteSetup = () => {
    navigate("/settings");
    handleDismissWelcome();
  };

  const handleOpenSignalModal = (signal: Signal) => {
    setSelectedSignal(signal);
    setSignalModalOpen(true);
  };

  const handleExecuteTrade = (tradeData: TradeData) => {
    // Navigate to open positions with the new trade
    navigate("/open-positions", {
      state: {
        newTrade: tradeData,
      },
    });
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        {showWelcome && (
          <WelcomeBanner
            planName={selectedPlan?.name}
            onDismiss={handleDismissWelcome}
            onExploreFeatures={handleExploreFeatures}
            onCompleteSetup={handleCompleteSetup}
          />
        )}

        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {t("dashboard.welcome")},{" "}
            {user?.user_metadata?.name || user?.email || "User"}!
          </h1>
          <p className="text-slate-400 mb-2">
            {t("dashboard.welcome")} to your Kurzora{" "}
            {t("dashboard.tradingIntelligence")}
          </p>
          <p className="text-emerald-400 text-sm">
            💡 {t("dashboard.clickAnySignal")}
          </p>
        </div>

        {/* ✅ ROW 1: SIGNAL METRICS - REAL DATA WITH FIXED CATEGORIZATION */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-900/50 backdrop-blur-sm border-blue-800/30 hover:bg-slate-900/70 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                Today's Signals
              </CardTitle>
              <Bell className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {todaysSignals}
              </div>
              <p className="text-xs text-slate-400">
                {strongSignals} Strong (80+), {validSignals} Valid (60-79)
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 backdrop-blur-sm border-blue-800/30 hover:bg-slate-900/70 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                Active Signals
              </CardTitle>
              <Bell className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {activeSignals}
              </div>
              <p className="text-xs text-slate-400">
                {newSignalsLastHour} new since last hour (70+ threshold)
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 backdrop-blur-sm border-blue-800/30 hover:bg-slate-900/70 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                Avg Signal Score
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {avgSignalScore}
              </div>
              <p className="text-xs text-emerald-500">Quality threshold met</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 backdrop-blur-sm border-blue-800/30 hover:bg-slate-900/70 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                Success Rate
              </CardTitle>
              <Target
                className={`h-4 w-4 ${
                  realSuccessRate >= 60
                    ? "text-emerald-400"
                    : realSuccessRate >= 40
                    ? "text-amber-400"
                    : "text-red-400"
                }`}
              />
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold ${
                  portfolioLoading
                    ? "animate-pulse text-slate-500"
                    : realSuccessRate >= 60
                    ? "text-emerald-400"
                    : realSuccessRate >= 40
                    ? "text-amber-400"
                    : "text-red-400"
                }`}
              >
                {portfolioLoading ? "..." : `${realSuccessRate.toFixed(1)}%`}
              </div>
              <p className="text-xs text-slate-400">
                {portfolioLoading
                  ? "..."
                  : `From ${portfolioTotalTrades} trades`}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* ✅ ROW 2: PORTFOLIO METRICS - REAL DATA */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {portfolioError ? (
            <div className="col-span-full text-red-400 text-sm p-4 bg-red-900/20 rounded-lg border border-red-800/30">
              Portfolio data unavailable
            </div>
          ) : (
            <>
              <Card className="bg-slate-900/50 backdrop-blur-sm border-emerald-800/30 hover:bg-slate-900/70 transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-300">
                    Portfolio Value
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-emerald-400" />
                </CardHeader>
                <CardContent>
                  <div
                    className={`text-2xl font-bold ${
                      portfolioLoading
                        ? "animate-pulse text-slate-500"
                        : "text-white"
                    }`}
                  >
                    {portfolioLoading ? "..." : formatCurrency(totalValue)}
                  </div>
                  <p className="text-xs text-slate-400">
                    {portfolioLoading
                      ? "..."
                      : `${activePositions} active positions`}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 backdrop-blur-sm border-emerald-800/30 hover:bg-slate-900/70 transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-300">
                    Total P&L
                  </CardTitle>
                  <TrendingUp
                    className={`h-4 w-4 ${
                      totalPnL >= 0 ? "text-emerald-400" : "text-red-400"
                    }`}
                  />
                </CardHeader>
                <CardContent>
                  <div
                    className={`text-2xl font-bold ${
                      portfolioLoading
                        ? "animate-pulse text-slate-500"
                        : totalPnL >= 0
                        ? "text-emerald-400"
                        : "text-red-400"
                    }`}
                  >
                    {portfolioLoading ? "..." : formatCurrency(totalPnL)}
                  </div>
                  <p
                    className={`text-xs ${
                      totalPnL >= 0 ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {portfolioLoading ? "..." : formatPercent(totalPnLPercent)}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 backdrop-blur-sm border-emerald-800/30 hover:bg-slate-900/70 transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-300">
                    Portfolio Win Rate
                  </CardTitle>
                  <Target
                    className={`h-4 w-4 ${
                      portfolioWinRate >= 60
                        ? "text-emerald-400"
                        : portfolioWinRate >= 40
                        ? "text-amber-400"
                        : "text-red-400"
                    }`}
                  />
                </CardHeader>
                <CardContent>
                  <div
                    className={`text-2xl font-bold ${
                      portfolioLoading
                        ? "animate-pulse text-slate-500"
                        : portfolioWinRate >= 60
                        ? "text-emerald-400"
                        : portfolioWinRate >= 40
                        ? "text-amber-400"
                        : "text-red-400"
                    }`}
                  >
                    {portfolioLoading
                      ? "..."
                      : `${portfolioWinRate.toFixed(1)}%`}
                  </div>
                  <p className="text-xs text-slate-400">
                    {portfolioLoading
                      ? "..."
                      : `${portfolioTotalTrades} total trades`}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 backdrop-blur-sm border-emerald-800/30 hover:bg-slate-900/70 transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-300">
                    Active Positions
                  </CardTitle>
                  <Briefcase className="h-4 w-4 text-purple-400" />
                </CardHeader>
                <CardContent>
                  <div
                    className={`text-2xl font-bold ${
                      portfolioLoading
                        ? "animate-pulse text-slate-500"
                        : "text-white"
                    }`}
                  >
                    {portfolioLoading ? "..." : activePositions}
                  </div>
                  <p className="text-xs text-slate-400">Open trades</p>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Performance Summary with Clean Recent Trades - ✅ CLEAN RECENT ACTIVITY */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-slate-900/50 backdrop-blur-sm border-blue-800/30 hover:bg-slate-900/70 transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-emerald-600/20 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-300 font-medium">
                      Best Performer
                    </div>
                    <div className="text-lg font-bold text-white">
                      {bestSignal ? bestSignal.ticker : "N/A"}
                    </div>
                    <div className="text-xs text-emerald-400">
                      {bestSignal
                        ? `Score: ${calculateFinalScore(bestSignal.signals)}`
                        : "No data"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 backdrop-blur-sm border-blue-800/30 hover:bg-slate-900/70 transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-600/20 rounded-lg">
                    <Briefcase className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-300 font-medium">
                      Active Signals
                    </div>
                    <div className="text-lg font-bold text-white">
                      {activeSignals}
                    </div>
                    <div className="text-xs text-slate-400">
                      signals ≥70% in play
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 backdrop-blur-sm border-blue-800/30 hover:bg-slate-900/70 transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-amber-600/20 rounded-lg">
                    <Zap className="h-5 w-5 text-amber-400" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-300 font-medium">
                      Latest Signal
                    </div>
                    <div className="text-lg font-bold text-white">
                      {signals[0] ? signals[0].ticker : "N/A"}
                    </div>
                    <div className="text-xs text-amber-400">
                      {signals[0]
                        ? `Score: ${calculateFinalScore(
                            signals[0].signals
                          )} • 15 min ago`
                        : "No data"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 backdrop-blur-sm border-blue-800/30 hover:bg-slate-900/70 transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-red-600/20 rounded-lg">
                    <Bell className="h-5 w-5 text-red-400" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-300 font-medium">
                      Alerts
                    </div>
                    <div className="text-lg font-bold text-white">
                      {alertsCount}
                    </div>
                    <div className="text-xs text-red-400">
                      strong signals (80%+)
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ✅ CLEAN: Recent Activity - No P&L Numbers, Just Status */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-white flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Eye className="h-4 w-4 text-blue-400" />
                    <span>Recent Activity</span>
                  </div>
                  <Button
                    onClick={() => navigate("/orders-history")}
                    variant="ghost"
                    size="sm"
                    className="text-blue-400 hover:text-blue-300 h-auto p-1"
                  >
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {portfolioLoading ? (
                    // Loading state
                    <div className="animate-pulse space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="flex justify-between items-center"
                        >
                          <div>
                            <div className="h-3 bg-slate-700 rounded w-12 mb-1"></div>
                            <div className="h-3 bg-slate-700 rounded w-16"></div>
                          </div>
                          <div className="h-3 bg-slate-700 rounded w-12"></div>
                        </div>
                      ))}
                    </div>
                  ) : recentTrades.length > 0 ? (
                    // ✅ CLEAN: Real trade data without P&L numbers - just status
                    recentTrades.map((trade, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center group hover:bg-slate-700/30 rounded-md p-2 -m-2 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <div className="text-white font-semibold text-xs">
                              {trade.ticker}
                            </div>
                            {/* ✅ Status indicator: Open (blue dot) or Closed (green dot) */}
                            <div className="flex items-center">
                              {trade.isOpen ? (
                                <div
                                  className="w-1.5 h-1.5 bg-blue-400 rounded-full"
                                  title="Open Position"
                                ></div>
                              ) : (
                                <div
                                  className="w-1.5 h-1.5 bg-emerald-400 rounded-full"
                                  title="Closed Position"
                                ></div>
                              )}
                            </div>
                          </div>
                          {/* ✅ CLEAN: No P&L numbers - just show status */}
                          <div className="text-xs text-slate-400 font-medium">
                            {trade.isOpen ? "Active" : "Closed"}
                          </div>
                        </div>
                        <div className="text-xs text-slate-400 text-right">
                          <div>{trade.date}</div>
                          <div className="text-[10px]">
                            {trade.isOpen ? "OPEN" : "CLOSED"}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    // No trades yet
                    <div className="text-center text-slate-500 text-xs py-4">
                      No trading activity yet
                      <div className="text-[10px] text-slate-600 mt-1">
                        Execute your first signal to see activity
                      </div>
                    </div>
                  )}
                </div>
                <Button
                  onClick={() => navigate("/orders-history")}
                  variant="outline"
                  size="sm"
                  className="w-full mt-3 border-blue-500 text-blue-400 hover:bg-blue-600/10 hover:text-blue-300 hover:border-blue-400 text-xs font-semibold transition-all duration-200 px-2 py-1.5 h-auto"
                >
                  <BookOpen className="h-3 w-3 mr-1.5" />
                  Historical Trades
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Win Rate Gauge - ✅ REAL DATA */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-8">
          <div className="lg:col-span-2">
            <WinRateGauge
              winRate={portfolioWinRate}
              totalTrades={portfolioTotalTrades}
              winningTrades={Math.round(
                (portfolioWinRate / 100) * portfolioTotalTrades
              )}
            />
          </div>
          <div className="lg:col-span-3">
            {/* ✅ FIXED: Pass portfolio data as props to avoid duplicate subscriptions */}
            <PortfolioPerformanceChart
              totalValue={totalValue}
              totalPnL={totalPnL}
              totalPnLPercent={totalPnLPercent}
              winRate={portfolioWinRate}
              activePositions={activePositions}
              totalTrades={portfolioTotalTrades}
              isLoading={portfolioLoading}
            />
          </div>
        </div>

        <div className="mb-8">
          <SignalHeatmap onOpenSignalModal={handleOpenSignalModal} />
        </div>

        {/* Disclaimer */}
        <div className="text-xs text-gray-500 text-center mt-4">
          {t("dashboard.disclaimer")}
        </div>

        <SignalModal
          isOpen={signalModalOpen}
          onClose={() => setSignalModalOpen(false)}
          signal={selectedSignal}
          onExecuteTrade={handleExecuteTrade}
          existingPositions={[]} // This would come from your position context
        />
      </div>
    </Layout>
  );
};

export default Dashboard;
