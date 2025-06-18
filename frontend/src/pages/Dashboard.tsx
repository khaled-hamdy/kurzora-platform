// Add: const { user, loading } = useAuth()
// Add: if (!user) redirect to login
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

  // Mock existing positions for preventing double trading
  const existingPositions = ["AAPL", "NVDA", "MSFT"]; // This would come from your state management

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

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-900/50 backdrop-blur-sm border-blue-800/30 hover:bg-slate-900/70 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                {t("dashboard.todaysSignals")}
              </CardTitle>
              <Bell className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">12</div>
              <p className="text-xs text-slate-400">
                3 {t("signals.strong")}, 9 {t("signals.valid")}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 backdrop-blur-sm border-blue-800/30 hover:bg-slate-900/70 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                {t("dashboard.activeSignals")}
              </CardTitle>
              <Bell className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">12</div>
              <p className="text-xs text-slate-400">
                3 {t("dashboard.newSinceLastHour")}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 backdrop-blur-sm border-blue-800/30 hover:bg-slate-900/70 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                {t("dashboard.avgSignalScore")}
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">82</div>
              <p className="text-xs text-emerald-500">
                {t("dashboard.qualityThreshold")}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 backdrop-blur-sm border-blue-800/30 hover:bg-slate-900/70 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                {t("dashboard.successRate")}
              </CardTitle>
              <Target className="h-4 w-4 text-amber-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-400">61%</div>
              <p className="text-xs text-slate-400">
                {t("dashboard.lastDays")}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Performance Summary with Recently Closed Positions */}
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
                      {t("dashboard.bestPerformer")}
                    </div>
                    <div className="text-lg font-bold text-white">AAPL</div>
                    <div className="text-xs text-emerald-400">
                      +$487 (+3.2%)
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
                      {t("dashboard.activeSignalsCount")}
                    </div>
                    <div className="text-lg font-bold text-white">3</div>
                    <div className="text-xs text-slate-400">
                      {t("dashboard.signalsInPlay")}
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
                      {t("dashboard.latestSignal")}
                    </div>
                    <div className="text-lg font-bold text-white">NVDA</div>
                    <div className="text-xs text-amber-400">
                      {t("common.score")}: 92 • 15 {t("dashboard.minAgo")}
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
                      {t("dashboard.alerts")}
                    </div>
                    <div className="text-lg font-bold text-white">2</div>
                    <div className="text-xs text-red-400">
                      {t("dashboard.positionsNearTarget")}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recently Closed Positions - moved to top */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-white flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Eye className="h-4 w-4 text-blue-400" />
                    <span>{t("dashboard.recentTrades")}</span>
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
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-white font-semibold text-xs">
                        AAPL
                      </div>
                      <div className="text-emerald-400 text-xs">+$621</div>
                    </div>
                    <div className="text-xs text-slate-400">Jun 8</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-white font-semibold text-xs">
                        NVDA
                      </div>
                      <div className="text-red-400 text-xs">-$96</div>
                    </div>
                    <div className="text-xs text-slate-400">Jun 7</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-white font-semibold text-xs">
                        MSFT
                      </div>
                      <div className="text-emerald-400 text-xs">+$401</div>
                    </div>
                    <div className="text-xs text-slate-400">Jun 6</div>
                  </div>
                </div>
                <Button
                  onClick={() => navigate("/orders-history")}
                  variant="outline"
                  size="sm"
                  className="w-full mt-3 border-blue-500 text-blue-400 hover:bg-blue-600/10 hover:text-blue-300 hover:border-blue-400 text-xs font-semibold transition-all duration-200 px-2 py-1.5 h-auto"
                >
                  <BookOpen className="h-3 w-3 mr-1.5" />
                  {t("dashboard.historicalTrades")}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-8">
          <div className="lg:col-span-2">
            <WinRateGauge winRate={61} totalTrades={127} winningTrades={77} />
          </div>
          <div className="lg:col-span-3">
            <PortfolioPerformanceChart />
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
          existingPositions={existingPositions}
        />
      </div>
    </Layout>
  );
};

export default Dashboard;
