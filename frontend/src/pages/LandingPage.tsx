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

// Lazy load FAQ section for better performance
const FAQSection = lazy(() => import("../components/landing/FAQSection"));

const LandingPage: React.FC = () => {
  const { user, loading } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();
  const [showAuth, setShowAuth] = useState<"login" | "signup" | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  // Professional plan object for main CTA buttons
  const professionalPlan = {
    id: "professional",
    name: "Professional",
    price: "49",
    billingCycle: "monthly",
  };

  // Check if we should show signup from navigation state or URL params
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

  // Listen for custom signup events from pricing navigation
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

  const handleFooterLinkClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSignupClick = (planInfo?: any) => {
    if (planInfo) {
      setSelectedPlan(planInfo);
    }
    setShowAuth("signup");
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Redirect if user is logged in
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

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
      {/* Navigation */}
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

      {/* Hero Section */}
      <section className="pt-12 sm:pt-16 lg:pt-20 pb-12 sm:pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <div className="mb-4 sm:mb-6">
              <span className="text-blue-400 text-base sm:text-lg lg:text-xl font-semibold tracking-wide">
                KURZORA
              </span>
              <p className="text-emerald-400 text-lg sm:text-xl lg:text-2xl font-medium mt-1">
                {t("landing.aiSignalsSmarter")}
              </p>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
              {t("landing.aiPoweredTrading")}
              <span className="text-blue-400 block">
                {t("landing.intelligencePlatform")}
              </span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-slate-300 mb-6 sm:mb-8 leading-relaxed px-4">
              {t("landing.heroDescription")}
            </p>

            <div className="flex justify-center mb-6 px-4">
              <Button
                size="lg"
                onClick={() => handleSignupClick(professionalPlan)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg w-full sm:w-auto"
              >
                {t("landing.startTrial")}
              </Button>
            </div>

            {/* Hero Bullet Points */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 mb-8 text-sm sm:text-base">
              <div className="flex items-center gap-2 text-emerald-400">
                <Check className="h-4 w-4" />
                <span>{t("landing.winBigger")}</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400">
                <Check className="h-4 w-4" />
                <span>{t("landing.highConviction")}</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400">
                <Check className="h-4 w-4" />
                <span>{t("landing.riskOnly")}</span>
              </div>
            </div>

            {/* Trust Signals Bar */}
            <TrustSignalsBar />

            {/* Profit Stats */}
            <ProfitStats />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 sm:py-16 lg:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Why Traders Choose Kurzora
            </h2>
            <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto px-4">
              Professional-grade AI tools and insights for high-probability
              trading
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-12">
            <div className="bg-slate-900/50 backdrop-blur-sm border border-blue-800/30 rounded-lg p-6 sm:p-8 hover:bg-slate-900/70 transition-all duration-300">
              <div className="p-3 bg-blue-600/20 rounded-full w-fit mb-4 sm:mb-6">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">
                {t("features.multiTimeframe")}
              </h3>
              <p className="text-slate-400 text-sm sm:text-base">
                {t("features.multiTimeframeDesc")}
              </p>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-sm border border-blue-800/30 rounded-lg p-6 sm:p-8 hover:bg-slate-900/70 transition-all duration-300">
              <div className="p-3 bg-emerald-600/20 rounded-full w-fit mb-4 sm:mb-6">
                <Signal className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">
                {t("features.supportResistance")}
              </h3>
              <p className="text-slate-400 text-sm sm:text-base">
                {t("features.supportResistanceDesc")}
              </p>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-sm border border-blue-800/30 rounded-lg p-6 sm:p-8 hover:bg-slate-900/70 transition-all duration-300">
              <div className="p-3 bg-amber-600/20 rounded-full w-fit mb-4 sm:mb-6">
                <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-amber-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">
                {t("features.optionsFlow")}
              </h3>
              <p className="text-slate-400 text-sm sm:text-base">
                {t("features.optionsFlowDesc")}
              </p>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-sm border border-blue-800/30 rounded-lg p-6 sm:p-8 hover:bg-slate-900/70 transition-all duration-300">
              <div className="p-3 bg-amber-600/20 rounded-full w-fit mb-4 sm:mb-6">
                <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-amber-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">
                Risk Management
              </h3>
              <p className="text-slate-400 text-sm sm:text-base">
                Every signal includes calculated stop-loss and take-profit
                levels to maintain favorable risk-reward ratios. We target
                minimum 1:2 risk-reward for all trades.
              </p>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-sm border border-blue-800/30 rounded-lg p-6 sm:p-8 hover:bg-slate-900/70 transition-all duration-300">
              <div className="p-3 bg-red-600/20 rounded-full w-fit mb-4 sm:mb-6">
                <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-red-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">
                Validation & Scoring
              </h3>
              <p className="text-slate-400 text-sm sm:text-base">
                Each signal receives a score (0-100) based on strength of
                confirmation, historical pattern success rate, and current
                market volatility conditions.
              </p>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-sm border border-blue-800/30 rounded-lg p-6 sm:p-8 hover:bg-slate-900/70 transition-all duration-300">
              <div className="p-3 bg-indigo-600/20 rounded-full w-fit mb-4 sm:mb-6">
                <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">
                AI Enhancement
              </h3>
              <p className="text-slate-400 text-sm sm:text-base">
                Machine learning algorithms continuously improve signal quality
                by analyzing successful patterns and adapting to changing market
                conditions.
              </p>
            </div>
          </div>

          {/* Signal Score Understanding Section */}
          <div className="mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6 text-center">
              Understanding Signal Scores
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-4 bg-gradient-to-r from-emerald-900/50 to-emerald-800/30 rounded-lg border border-emerald-700">
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-2">💎</span>
                  <h4 className="text-lg font-semibold text-white">
                    Strong (80-100)
                  </h4>
                </div>
                <p className="text-slate-300 text-sm">
                  Highest confidence signals with multiple strong confirmations.
                  Historical win rate over 75%.
                </p>
              </div>

              <div className="p-4 bg-gradient-to-r from-blue-900/50 to-blue-800/30 rounded-lg border border-blue-700">
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-2">✅</span>
                  <h4 className="text-lg font-semibold text-white">
                    Valid (60-79)
                  </h4>
                </div>
                <p className="text-slate-300 text-sm">
                  Good quality signals with solid confirmations. Historical win
                  rate 60-75%.
                </p>
              </div>

              <div className="p-4 bg-gradient-to-r from-yellow-900/50 to-yellow-800/30 rounded-lg border border-yellow-700">
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-2">⚠️</span>
                  <h4 className="text-lg font-semibold text-white">
                    Weak (40-59)
                  </h4>
                </div>
                <p className="text-slate-300 text-sm">
                  Mixed confirmations with some conflicting indicators. Use
                  additional validation.
                </p>
              </div>

              <div className="p-4 bg-gradient-to-r from-red-900/50 to-red-800/30 rounded-lg border border-red-700">
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-2">🚫</span>
                  <h4 className="text-lg font-semibold text-white">
                    Ignore (0-39)
                  </h4>
                </div>
                <p className="text-slate-300 text-sm">
                  Multiple conflicting indicators. Not recommended for trading.
                </p>
              </div>
            </div>
          </div>

          {/* New content from 8th screenshot */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-blue-800/30 rounded-lg p-6 sm:p-8 text-center">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Ready to Transform Your Trading?
              </h3>
              <p className="text-slate-300 text-base sm:text-lg mb-6 leading-relaxed">
                Join thousands of traders already profiting with Kurzora's
                AI-powered signals. Experience the power of institutional-grade
                analysis combined with Shariah-compliant trading principles.
              </p>
              <div className="flex justify-center mb-6">
                <Button
                  size="lg"
                  onClick={() => handleSignupClick(professionalPlan)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg"
                >
                  Start Trial
                  <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 ml-1" />
                </Button>
              </div>
              <p className="text-slate-400 text-xs sm:text-sm">
                Cancel anytime • Money-back guarantee • Start with $0
              </p>
            </div>
          </div>

          <div className="flex justify-center mt-8 sm:mt-12">
            <div className="flex items-center bg-emerald-500/10 backdrop-blur-sm border border-emerald-500/20 rounded-lg px-3 sm:px-4 py-2 space-x-2 animate-pulse">
              <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-400" />
              <span className="text-emerald-400 text-xs sm:text-sm font-medium">
                {t("legal.shariahCompliant")}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonials"
        className="py-12 sm:py-16 lg:py-20 bg-slate-950/50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {t("landing.trustedBy")}
          </h2>
        </div>
        <TestimonialCarousel />
      </section>

      {/* FAQ Section */}
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

      {/* Demo Signal Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              See Kurzora in Action
            </h2>
            <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto px-4">
              This signal delivered a 2.3:1 profit ratio - risking $200 to make
              $460. Our AI identified institutional accumulation patterns
              combined with a bullish reversal setup scoring 87/100.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <DemoSignalChart />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-12 sm:py-16 lg:py-20">
        <PricingSection onSignupClick={handleSignupClick} />
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 bg-gradient-to-r from-blue-600 to-emerald-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 sm:mb-6">
            Ready to Transform Your Trading?
          </h2>
          <p className="text-blue-100 text-base sm:text-lg mb-6 sm:mb-8 px-4">
            Join thousands of traders already profiting with Kurzora. Start your
            free trial today.
          </p>
          <Button
            size="lg"
            onClick={() => handleSignupClick(professionalPlan)}
            className="bg-white text-blue-600 hover:bg-slate-100 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold w-full sm:w-auto"
          >
            {t("landing.startTrial")}
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 ml-1" />
          </Button>
          <p className="text-blue-100 text-xs sm:text-sm mt-4 px-4">
            {t("landing.cancelAnytime")} • {t("landing.moneyBack")}
          </p>
        </div>
      </section>

      {/* Disclaimer */}
      <div className="px-4 py-8">
        <p className="text-xs text-slate-500 text-center max-w-3xl mx-auto">
          *Average returns based on members who follow all signals with proper
          position sizing. Individual results vary. Past performance doesn't
          guarantee future results. {t("legal.tradingInvolves")}.
        </p>
      </div>

      {/* Footer */}
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
                {t("footer.description")}
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
                <a
                  href="#"
                  onClick={handleFooterLinkClick}
                  className="hover:text-white transition-colors"
                >
                  {t("footer.gdprCompliance")}
                </a>
                <a
                  href="#"
                  onClick={handleFooterLinkClick}
                  className="hover:text-white transition-colors"
                >
                  {t("footer.cookieNotice")}
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Live Activity Notification */}
      <LiveActivityNotification />
    </div>
  );
};

export default LandingPage;
