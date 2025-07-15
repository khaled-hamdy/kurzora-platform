import React, { useState, useEffect, lazy, Suspense } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { Navigate, Link, useLocation } from "react-router-dom";
import {
  Shield,
  TrendingUp,
  Signal,
  Zap,
  Users,
  Award,
  BarChart3,
  ChevronRight,
  Menu,
  X,
  Check,
  CheckCircle,
  Brain,
  Eye,
  Target,
  DollarSign,
} from "lucide-react";
import { Button } from "../components/ui/button";
import LoginForm from "../components/auth/LoginForm";
import SignupForm from "../components/auth/SignupForm";
import TestimonialCarousel from "../components/testimonials/TestimonialCarousel";
import PricingSection from "../components/pricing/PricingSection";
import LanguageToggle from "../components/LanguageToggle";
import DemoSignalChart from "../components/dashboard/DemoSignalChart";
import TrustSignalsBar from "../components/landing/TrustSignalsBar";
import LiveActivityNotification from "../components/landing/LiveActivityNotification";
import ProfitStats from "../components/landing/ProfitStats";

// 🔧 PRESERVATION: Lazy load FAQ section for better performance - existing functionality maintained
const FAQSection = lazy(() => import("../components/landing/FAQSection"));

const LandingPage: React.FC = () => {
  // 🔧 PRESERVATION: All existing hooks and state management preserved exactly
  const { user, loading } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();
  const [showAuth, setShowAuth] = useState<"login" | "signup" | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  // 🔧 PRESERVATION: Professional plan object for main CTA buttons - existing functionality maintained
  const professionalPlan = {
    id: "professional",
    name: "Professional",
    price: "49",
    billingCycle: "monthly",
  };

  // 🔧 PRESERVATION: Existing plan selection logic from localStorage - critical for payment flows
  useEffect(() => {
    // Check localStorage for plan selection
    const savedPlan = localStorage.getItem("selectedPlan");
    if (savedPlan) {
      try {
        const plan = JSON.parse(savedPlan);
        setSelectedPlan(plan);
        setShowAuth("signup");
        // Clear the plan from localStorage to avoid persistence issues
        localStorage.removeItem("selectedPlan");
      } catch (error) {
        console.error("Error parsing saved plan:", error);
      }
    }

    if (location.state?.showSignup) {
      setShowAuth("signup");
    }
  }, [location.state]);

  // 🔧 PRESERVATION: Custom signup event handling for pricing navigation - critical for payment flows
  useEffect(() => {
    const handleShowSignup = (event: CustomEvent) => {
      setSelectedPlan(event.detail);
      setShowAuth("signup");
    };

    window.addEventListener("showSignup", handleShowSignup as EventListener);
    return () => {
      window.removeEventListener(
        "showSignup",
        handleShowSignup as EventListener
      );
    };
  }, []);

  // 🔧 PRESERVATION: Footer navigation helper function - existing functionality maintained
  const handleFooterLinkClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // 🔧 PRESERVATION: Signup click handler for plan selection - critical for payment flows
  const handleSignupClick = (planInfo?: any) => {
    if (planInfo) {
      setSelectedPlan(planInfo);
    }
    setShowAuth("signup");
  };

  // 🔧 PRESERVATION: Loading state while checking authentication - existing functionality maintained
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // 🔧 PRESERVATION: Authentication redirect logic - critical for user flows
  if (user && !showAuth && !loading) {
    console.log("🔄 LandingPage: User logged in, redirecting to dashboard");
    return <Navigate to="/dashboard" replace />;
  }

  // 🔧 PRESERVATION: Authentication forms display logic - critical for user registration
  if (showAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {showAuth === "login" ? (
            <LoginForm onSwitchToSignup={() => setShowAuth("signup")} />
          ) : (
            <SignupForm
              onSwitchToLogin={() => setShowAuth("login")}
              selectedPlan={selectedPlan}
            />
          )}
          <div className="text-center mt-4">
            <button
              onClick={() => {
                setShowAuth(null);
                setSelectedPlan(null);
              }}
              className="text-slate-400 hover:text-white text-sm"
            >
              ← Back to home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      {/* 🔧 PRESERVATION: Navigation - All existing functionality maintained */}
      <nav className="bg-slate-900/50 backdrop-blur-sm border-b border-blue-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <div className="flex items-center space-x-2">
              <div className="logo-container">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 chart-element" />
                  <span className="logo-text text-xl sm:text-2xl font-bold">
                    Kurzora
                  </span>
                </div>
              </div>
            </div>

            <div className="hidden md:flex space-x-4 lg:space-x-6">
              <Link
                to="/how-it-works"
                className="text-slate-300 hover:text-white transition-colors text-sm lg:text-base"
              >
                {t("nav.howItWorks")}
              </Link>
              <a
                href="#testimonials"
                className="text-slate-300 hover:text-white transition-colors text-sm lg:text-base"
              >
                {t("landing.testimonials")}
              </a>
              <a
                href="#pricing"
                className="text-slate-300 hover:text-white transition-colors text-sm lg:text-base"
              >
                {t("landing.pricing")}
              </a>
            </div>

            <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
              <LanguageToggle />
              <Button
                variant="ghost"
                onClick={() => setShowAuth("login")}
                className="text-slate-300 hover:text-white text-sm"
                size="sm"
              >
                {t("landing.signIn")}
              </Button>
              <Button
                onClick={() => handleSignupClick(professionalPlan)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
                size="sm"
              >
                {t("landing.getStarted")}
              </Button>
            </div>

            <div className="md:hidden flex items-center space-x-2">
              <LanguageToggle />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-slate-300 hover:text-white p-2"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>

          {/* 🔧 PRESERVATION: Mobile menu functionality - existing functionality maintained */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-blue-800/30 py-4">
              <div className="space-y-4">
                <Link
                  to="/how-it-works"
                  className="block text-slate-300 hover:text-white transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t("nav.howItWorks")}
                </Link>
                <a
                  href="#testimonials"
                  className="block text-slate-300 hover:text-white transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t("landing.testimonials")}
                </a>
                <a
                  href="#pricing"
                  className="block text-slate-300 hover:text-white transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t("landing.pricing")}
                </a>
                <div className="flex flex-col space-y-3 pt-4 border-t border-blue-800/30">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setShowAuth("login");
                      setMobileMenuOpen(false);
                    }}
                    className="text-slate-300 hover:text-white justify-start"
                    size="sm"
                  >
                    {t("landing.signIn")}
                  </Button>
                  <Button
                    onClick={() => {
                      handleSignupClick(professionalPlan);
                      setMobileMenuOpen(false);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white justify-start"
                    size="sm"
                  >
                    {t("landing.getStarted")}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* 🔧 PRESERVATION: Hero Section - Updated to "Professional Trading Intelligence" approach */}
      <section className="pt-12 sm:pt-16 lg:pt-20 pb-12 sm:pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <div className="mb-4 sm:mb-6">
              <span className="text-blue-400 text-base sm:text-lg lg:text-xl font-semibold tracking-wide">
                KURZORA
              </span>
              <p className="text-emerald-400 text-lg sm:text-xl lg:text-2xl font-medium mt-1">
                Professional Trading Intelligence
              </p>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
              Institutional-Grade
              <span className="text-blue-400 block">Signal Analysis</span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-slate-300 mb-6 sm:mb-8 leading-relaxed px-4">
              Join traders using our advanced AI analysis with professional risk
              management and verified performance tracking
            </p>

            {/* 🔧 PRESERVATION: Power Indicators Bar - Shows strength without revealing methods */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 mb-8 text-sm sm:text-base">
              <div className="flex items-center gap-2 text-emerald-400">
                <Shield className="h-4 w-4" />
                <span>Institutional Standards</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400">
                <Zap className="h-4 w-4" />
                <span>Advanced Signal Processing</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle className="h-4 w-4" />
                <span>Verified Performance</span>
              </div>
            </div>

            <div className="flex justify-center mb-6 px-4">
              <Button
                size="lg"
                onClick={() => handleSignupClick(professionalPlan)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg w-full sm:w-auto"
              >
                Experience Professional Signals
              </Button>
            </div>

            {/* 🔧 PRESERVATION: Trust signals and profit stats components */}
            <TrustSignalsBar />
            <ProfitStats />
          </div>
        </div>
      </section>

      {/* 🔧 PRESERVATION: Performance Showcase - New section showing power without revealing methods */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 bg-slate-950/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Proven Results That Speak for Themselves
            </h2>
            <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto px-4">
              Experience the difference professional-grade analysis makes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* 🔧 PRESERVATION: Card 1: Superior Signal Quality */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-emerald-700/50 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-emerald-400 mb-2">
                High-Conviction
              </div>
              <div className="text-lg font-semibold text-white mb-3">
                Superior Signal Quality
              </div>
              <p className="text-slate-400 text-sm">
                Rigorous institutional-grade filtering process
              </p>
              <div className="mt-4 inline-block bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-medium">
                Quality Over Quantity
              </div>
            </div>

            {/* 🔧 PRESERVATION: Card 2: Advanced Risk Management */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-blue-700/50 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">
                Professional
              </div>
              <div className="text-lg font-semibold text-white mb-3">
                Advanced Risk Management
              </div>
              <p className="text-slate-400 text-sm">
                Every signal includes calculated risk parameters
              </p>
              <div className="mt-4 inline-block bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-medium">
                Institutional Standards
              </div>
            </div>

            {/* 🔧 PRESERVATION: Card 3: Verified Performance Tracking */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-purple-700/50 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">
                Complete
              </div>
              <div className="text-lg font-semibold text-white mb-3">
                Verified Performance Tracking
              </div>
              <p className="text-slate-400 text-sm">
                Track every trade from entry to exit with audit trails
              </p>
              <div className="mt-4 inline-block bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-xs font-medium">
                100% Transparent
              </div>
            </div>

            {/* 🔧 PRESERVATION: Card 4: Real Market Data */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-amber-700/50 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-amber-400 mb-2">
                Zero Synthetic
              </div>
              <div className="text-lg font-semibold text-white mb-3">
                Real Market Data
              </div>
              <p className="text-slate-400 text-sm">
                Professional-grade historical analysis and validation
              </p>
              <div className="mt-4 inline-block bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full text-xs font-medium">
                Authentic Intelligence
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🔧 PRESERVATION: Why Traders Choose Kurzora - Updated with AI/Quantitative focus */}
      <section id="features" className="py-12 sm:py-16 lg:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Why Serious Traders Choose Kurzora
            </h2>
            <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto px-4">
              Professional-grade AI tools and insights for high-probability
              trading
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-12">
            {/* 🔧 PRESERVATION: Feature 1: AI-Powered Intelligence */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-blue-800/30 rounded-lg p-6 sm:p-8 hover:bg-slate-900/70 transition-all duration-300">
              <div className="p-3 bg-blue-600/20 rounded-full w-fit mb-4 sm:mb-6">
                <Brain className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">
                Advanced AI & Quantitative Analysis
              </h3>
              <p className="text-slate-400 text-sm sm:text-base">
                Sophisticated artificial intelligence processes vast market data
                with institutional-grade quantitative models - delivering
                insights beyond human analysis capabilities
              </p>
            </div>

            {/* 🔧 PRESERVATION: Feature 2: Institutional-Grade Standards */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-blue-800/30 rounded-lg p-6 sm:p-8 hover:bg-slate-900/70 transition-all duration-300">
              <div className="p-3 bg-emerald-600/20 rounded-full w-fit mb-4 sm:mb-6">
                <Award className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">
                Professional Quality Control
              </h3>
              <p className="text-slate-400 text-sm sm:text-base">
                Every signal undergoes rigorous institutional-standard
                validation before reaching you - ensuring only high-conviction
                opportunities
              </p>
            </div>

            {/* 🔧 PRESERVATION: Feature 3: Advanced Risk Protection */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-blue-800/30 rounded-lg p-6 sm:p-8 hover:bg-slate-900/70 transition-all duration-300">
              <div className="p-3 bg-amber-600/20 rounded-full w-fit mb-4 sm:mb-6">
                <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-amber-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">
                Built-in Risk Management
              </h3>
              <p className="text-slate-400 text-sm sm:text-base">
                Professional risk controls integrated with every signal -
                protect your capital with institutional-grade position sizing
                and stop management
              </p>
            </div>

            {/* 🔧 PRESERVATION: Feature 4: Complete Transparency */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-blue-800/30 rounded-lg p-6 sm:p-8 hover:bg-slate-900/70 transition-all duration-300">
              <div className="p-3 bg-indigo-600/20 rounded-full w-fit mb-4 sm:mb-6">
                <Eye className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">
                Full Performance Tracking
              </h3>
              <p className="text-slate-400 text-sm sm:text-base">
                Track every signal's complete lifecycle from entry to exit - see
                exactly how our intelligence performs over time
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 🔧 PRESERVATION: Signal Quality Explanation - Updated to hide specific thresholds */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 bg-slate-950/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Understanding Signal Quality
            </h2>
            <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto px-4">
              Our AI automatically prioritizes premium and quality signals for
              your attention
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 🔧 PRESERVATION: Updated: No specific score ranges revealed */}
            <div className="p-4 bg-gradient-to-r from-emerald-900/50 to-emerald-800/30 rounded-lg border border-emerald-700">
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-2">💎</span>
                <h4 className="text-lg font-semibold text-white">
                  Premium Quality
                </h4>
              </div>
              <p className="text-slate-300 text-sm">
                Highest confidence signals with multiple institutional
                confirmations and optimal risk-reward profiles
              </p>
            </div>

            <div className="p-4 bg-gradient-to-r from-blue-900/50 to-blue-800/30 rounded-lg border border-blue-700">
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-2">✅</span>
                <h4 className="text-lg font-semibold text-white">
                  Solid Quality
                </h4>
              </div>
              <p className="text-slate-300 text-sm">
                Well-validated signals with strong technical confirmations and
                good probability setups
              </p>
            </div>

            <div className="p-4 bg-gradient-to-r from-yellow-900/50 to-yellow-800/30 rounded-lg border border-yellow-700">
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-2">⚠️</span>
                <h4 className="text-lg font-semibold text-white">
                  Mixed Quality
                </h4>
              </div>
              <p className="text-slate-300 text-sm">
                Signals with some conflicting indicators - use additional
                validation and tighter risk management
              </p>
            </div>

            <div className="p-4 bg-gradient-to-r from-red-900/50 to-red-800/30 rounded-lg border border-red-700">
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-2">🚫</span>
                <h4 className="text-lg font-semibold text-white">
                  Below Standards
                </h4>
              </div>
              <p className="text-slate-300 text-sm">
                Signals that don't meet our institutional quality criteria -
                automatically filtered to protect your capital
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 🎯 SECTION 5: See Kurzora in Action - WHITE PAPER CENTERPIECE IMPLEMENTATION */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto">
          {/* 🎯 Major Section Header - Prominent positioning */}
          <div className="text-center mb-16 sm:mb-20">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-4 py-2 mb-6">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-emerald-400 text-sm font-medium">
                REAL HISTORICAL EXAMPLE
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              See Professional Trading
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 block">
                Intelligence in Action
              </span>
            </h2>
            <p className="text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
              Our AI identified institutional accumulation patterns ahead of
              record earnings results - delivering precise entry timing with
              professional risk management
            </p>
          </div>

          {/* 🎯 BROADCOM SHOWCASE - Real December 2024 Example */}
          <div className="max-w-6xl mx-auto">
            <div className="bg-gradient-to-r from-slate-900/90 to-slate-800/90 backdrop-blur-lg border border-blue-800/40 rounded-2xl p-8 sm:p-12 shadow-2xl">
              {/* 🎯 Company Header with Premium Badge */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-blue-600/20 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-blue-400" />
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-white">
                      AVGO - Broadcom Inc.
                    </h3>
                  </div>
                  <p className="text-slate-400 text-lg">
                    <span className="text-blue-400 font-semibold">
                      December 12-14, 2024
                    </span>{" "}
                    • Record Q4 2024 earnings: $51.6B revenue (+44% YoY)
                  </p>
                </div>
                <div className="mt-4 sm:mt-0">
                  <span className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    <span className="text-lg">💎</span>
                    PREMIUM SIGNAL
                  </span>
                </div>
              </div>

              {/* 🎯 Demo Chart - Existing component maintained */}
              <div className="mb-8">
                <DemoSignalChart />
              </div>

              {/* 🎯 KEY OUTCOME POINTS - White Paper Specified */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Precise Entry Timing */}
                <div className="bg-gradient-to-br from-blue-600/20 to-blue-500/10 border border-blue-500/30 rounded-xl p-6 text-center group hover:scale-105 transition-all duration-300">
                  <div className="text-4xl mb-3">📊</div>
                  <h4 className="text-white font-bold text-lg mb-2">
                    Precise Entry Timing
                  </h4>
                  <p className="text-blue-200 text-sm leading-relaxed">
                    AI identified optimal market entry point ahead of earnings
                    announcement
                  </p>
                </div>

                {/* Professional Risk Management */}
                <div className="bg-gradient-to-br from-emerald-600/20 to-emerald-500/10 border border-emerald-500/30 rounded-xl p-6 text-center group hover:scale-105 transition-all duration-300">
                  <div className="text-4xl mb-3">🎯</div>
                  <h4 className="text-white font-bold text-lg mb-2">
                    Professional Risk Management
                  </h4>
                  <p className="text-emerald-200 text-sm leading-relaxed">
                    Calculated stop-loss and position sizing included with
                    institutional standards
                  </p>
                </div>

                {/* Quick Execution */}
                <div className="bg-gradient-to-br from-amber-600/20 to-amber-500/10 border border-amber-500/30 rounded-xl p-6 text-center group hover:scale-105 transition-all duration-300">
                  <div className="text-4xl mb-3">⚡</div>
                  <h4 className="text-white font-bold text-lg mb-2">
                    Quick Execution
                  </h4>
                  <p className="text-amber-200 text-sm leading-relaxed">
                    Signal delivered within minutes of market opportunity
                    detection
                  </p>
                </div>

                {/* Verified Results */}
                <div className="bg-gradient-to-br from-purple-600/20 to-purple-500/10 border border-purple-500/30 rounded-xl p-6 text-center group hover:scale-105 transition-all duration-300">
                  <div className="text-4xl mb-3">📈</div>
                  <h4 className="text-white font-bold text-lg mb-2">
                    Verified Results
                  </h4>
                  <p className="text-purple-200 text-sm leading-relaxed">
                    Complete trade tracking from entry to profitable exit with
                    audit trail
                  </p>
                </div>
              </div>

              {/* 🎯 Call-to-Action - Major conversion driver */}
              <div className="text-center bg-gradient-to-r from-blue-600/10 to-emerald-600/10 border border-blue-500/20 rounded-xl p-8">
                <h4 className="text-2xl font-bold text-white mb-4">
                  Ready to Access Professional-Grade Intelligence?
                </h4>
                <p className="text-slate-300 mb-6 text-lg">
                  If our AI caught Broadcom's earnings surge, what else could it
                  identify for you?
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    onClick={() => handleSignupClick(professionalPlan)}
                    className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Start Free Trial
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() =>
                      document
                        .getElementById("pricing")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="border-slate-400 text-slate-300 hover:bg-slate-800/50 px-8 py-4 text-lg font-semibold"
                  >
                    View Pricing
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🔧 PRESERVATION: Testimonials Section - Keeping existing component */}
      <section
        id="testimonials"
        className="py-12 sm:py-16 lg:py-20 bg-slate-950/50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Trusted by Serious Traders Worldwide
          </h2>
        </div>
        <TestimonialCarousel />
      </section>

      {/* 🔧 PRESERVATION: FAQ Section - Keeping existing component */}
      <Suspense
        fallback={
          <div className="py-12 sm:py-16 lg:py-20 px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="text-white">Loading FAQ...</div>
            </div>
          </div>
        }
      >
        <FAQSection />
      </Suspense>

      {/* 🔧 PRESERVATION: Pricing Section - Keeping existing component */}
      <section id="pricing" className="py-12 sm:py-16 lg:py-20">
        <PricingSection onSignupClick={handleSignupClick} />
      </section>

      {/* 🔧 PRESERVATION: Disclaimer section - existing functionality maintained */}
      <div className="px-4 py-8">
        <p className="text-xs text-slate-500 text-center max-w-3xl mx-auto">
          Professional traders understand all investments carry risk. Past
          performance doesn't guarantee future results. Start with our risk-free
          trial.
        </p>
      </div>

      {/* 🔧 PRESERVATION: Footer - All existing functionality maintained */}
      <footer className="bg-slate-950/50 border-t border-blue-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="col-span-1 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="logo-container">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 chart-element" />
                    <span className="logo-text text-base sm:text-lg font-bold">
                      Kurzora
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-slate-400 text-sm mb-4">
                Advanced trading signals platform for Islamic finance compliance
              </p>
              <div className="flex items-center mt-4">
                <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full flex items-center animate-pulse">
                  <Shield className="h-3 w-3 mr-1" />
                  {t("legal.shariahCompliant")}
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4 text-sm sm:text-base">
                {t("footer.platform")}
              </h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <a
                    href="#"
                    onClick={handleFooterLinkClick}
                    className="hover:text-white transition-colors"
                  >
                    {t("footer.home")}
                  </a>
                </li>
                <li>
                  <Link
                    to="/how-it-works"
                    onClick={handleFooterLinkClick}
                    className="hover:text-white transition-colors"
                  >
                    {t("footer.howItWorks")}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4 text-sm sm:text-base">
                {t("footer.support")}
              </h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <Link
                    to="/contact"
                    onClick={handleFooterLinkClick}
                    className="hover:text-white transition-colors"
                  >
                    {t("footer.contact")}
                  </Link>
                </li>
                <li>
                  <a
                    href="https://discord.gg/kurzora"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    {t("footer.discord")}
                  </a>
                </li>
                <li>
                  <a
                    href="https://x.com/KurzoraPlatform"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    {t("footer.twitter")}
                  </a>
                </li>
              </ul>
            </div>

            {/* 🔧 PRESERVATION: Legal section - Smart disclaimer strategy maintained */}
            <div>
              <h3 className="text-white font-semibold mb-4 text-sm sm:text-base">
                {t("footer.legal")}
              </h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <Link
                    to="/privacy-policy"
                    onClick={handleFooterLinkClick}
                    className="hover:text-white transition-colors"
                  >
                    {t("footer.privacyPolicy")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms-of-service"
                    onClick={handleFooterLinkClick}
                    className="hover:text-white transition-colors"
                  >
                    {t("footer.termsOfService")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/risk-disclosure"
                    onClick={handleFooterLinkClick}
                    className="hover:text-white transition-colors"
                  >
                    {t("footer.riskDisclosure")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/shariah-compliance"
                    onClick={handleFooterLinkClick}
                    className="hover:text-white transition-colors"
                  >
                    {t("footer.shariahCompliance")}
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-blue-800/30 pt-6 sm:pt-8 mt-6 sm:pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-center text-slate-400 text-xs sm:text-sm">
                {t("footer.copyright")} {t("legal.tradingInvolves")}.
              </p>
              <div className="flex space-x-4 text-xs text-slate-400">
                {/* 🔧 FIX: Updated GDPR Compliance link from <a href="#"> to <Link to="/gdpr-compliance"> */}
                <Link
                  to="/gdpr-compliance"
                  onClick={handleFooterLinkClick}
                  className="hover:text-white transition-colors"
                >
                  {t("footer.gdprCompliance")}
                </Link>
                {/* 🔧 FIX: Updated Cookie Notice link from <a href="#"> to <Link to="/cookie-notice"> */}
                <Link
                  to="/cookie-notice"
                  onClick={handleFooterLinkClick}
                  className="hover:text-white transition-colors"
                >
                  {t("footer.cookieNotice")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* 🔧 PRESERVATION: Live Activity Notification component - existing functionality maintained */}
      <LiveActivityNotification />
    </div>
  );
};

export default LandingPage;
