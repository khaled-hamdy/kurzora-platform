import React from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  CheckCircle,
  AlertTriangle,
  Layers,
  Signal,
  Gauge,
  BrainCircuit,
  TrendingUp,
  Shield,
  Brain,
  Award,
  Eye,
  Zap,
} from "lucide-react";

// 🔧 PRESERVATION: Keeping exact same component structure and TypeScript patterns
// 🔧 SESSION #188: FOOTER FIX - Changed Telegram link to Twitter link for consistency with Session #187 pattern
const HowItWorks: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      {/* 🔧 PRESERVATION: Navigation - All existing functionality maintained */}
      <nav className="bg-slate-900/50 backdrop-blur-sm border-b border-blue-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <Link to="/" className="flex items-center space-x-2">
              <div className="logo-container">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 chart-element" />
                  <span className="logo-text text-xl sm:text-2xl font-bold">
                    Kurzora
                  </span>
                </div>
              </div>
            </Link>

            <Link
              to="/"
              className="text-slate-300 hover:text-white transition-colors text-sm"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 🎯 WHITE PAPER COMPLIANT: Header section with institutional positioning */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-2 mb-6">
            <Brain className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 text-sm font-medium">
              INSTITUTIONAL-GRADE INTELLIGENCE
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Professional Trading
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 block">
              Intelligence Platform
            </span>
          </h1>
          <p className="text-slate-400 max-w-4xl mx-auto text-lg leading-relaxed">
            Kurzora delivers sophisticated market intelligence through advanced
            AI and institutional-grade analysis systems designed for serious
            traders who demand professional-quality signals.
          </p>
        </div>

        {/* 🎯 AUDI APPROACH: Show sophistication without revealing specific methods */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Our Intelligence Framework
          </h2>
          <p className="text-slate-400 text-center mb-12 max-w-3xl mx-auto">
            Powered by institutional-grade algorithms and advanced pattern
            recognition, our platform identifies high-conviction opportunities
            with professional risk management.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* 🎯 Card 1: Multi-Dimensional Analysis - Professional language without revealing methods */}
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:bg-slate-800/70 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-500/20 p-3 rounded-full">
                    <Layers className="h-6 w-6 text-blue-400" />
                  </div>
                  <CardTitle className="text-lg text-white">
                    Multi-Dimensional Analysis
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 leading-relaxed">
                  Advanced multi-timeframe analysis with institutional-grade
                  pattern recognition to identify convergence points and reduce
                  false signals through sophisticated validation.
                </p>
              </CardContent>
            </Card>

            {/* 🎯 Card 2: Professional Market Structure - Institutional focus */}
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:bg-slate-800/70 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-500/20 p-3 rounded-full">
                    <Signal className="h-6 w-6 text-purple-400" />
                  </div>
                  <CardTitle className="text-lg text-white">
                    Market Structure Intelligence
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 leading-relaxed">
                  Professional-grade analysis of market structure, institutional
                  flow patterns, and key technical levels to enhance signal
                  precision and timing accuracy.
                </p>
              </CardContent>
            </Card>

            {/* 🎯 Card 3: Quantitative Models - Hide specific indicators */}
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:bg-slate-800/70 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="bg-emerald-500/20 p-3 rounded-full">
                    <Gauge className="h-6 w-6 text-emerald-400" />
                  </div>
                  <CardTitle className="text-lg text-white">
                    Quantitative Intelligence
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 leading-relaxed">
                  Sophisticated quantitative models analyze market sentiment,
                  volatility patterns, and momentum indicators to identify
                  optimal entry and exit opportunities.
                </p>
              </CardContent>
            </Card>

            {/* 🎯 Card 4: Professional Risk Management - Remove specific ratios */}
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:bg-slate-800/70 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="bg-amber-500/20 p-3 rounded-full">
                    <Shield className="h-6 w-6 text-amber-400" />
                  </div>
                  <CardTitle className="text-lg text-white">
                    Institutional Risk Controls
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 leading-relaxed">
                  Every signal includes professional-grade risk management with
                  calculated position sizing, stop-loss parameters, and
                  profit-taking strategies based on institutional standards.
                </p>
              </CardContent>
            </Card>

            {/* 🎯 Card 5: Quality Validation - Remove scoring system details */}
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:bg-slate-800/70 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="bg-indigo-500/20 p-3 rounded-full">
                    <Award className="h-6 w-6 text-indigo-400" />
                  </div>
                  <CardTitle className="text-lg text-white">
                    Quality Assurance
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 leading-relaxed">
                  Rigorous validation process ensures only high-conviction
                  opportunities reach you, with comprehensive confirmation
                  analysis and market condition assessment.
                </p>
              </CardContent>
            </Card>

            {/* 🎯 Card 6: AI Enhancement - Professional positioning */}
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:bg-slate-800/70 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="bg-cyan-500/20 p-3 rounded-full">
                    <BrainCircuit className="h-6 w-6 text-cyan-400" />
                  </div>
                  <CardTitle className="text-lg text-white">
                    Adaptive Intelligence
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 leading-relaxed">
                  Advanced machine learning continuously enhances signal quality
                  by analyzing successful patterns and adapting to evolving
                  market dynamics and conditions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 🎯 WHITE PAPER COMPLIANT: Signal Quality without revealing specific thresholds */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Understanding Signal Intelligence
          </h2>
          <p className="text-slate-400 text-center mb-12 max-w-3xl mx-auto">
            Our advanced AI automatically categorizes and prioritizes signals
            based on institutional-grade quality criteria, ensuring you focus on
            the highest-probability opportunities.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 🎯 Premium Quality - No specific score ranges */}
            <div className="p-6 bg-gradient-to-br from-emerald-900/50 to-emerald-800/30 rounded-xl border border-emerald-700/50 hover:scale-105 transition-all duration-300">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">💎</span>
                <h3 className="text-xl font-bold text-white">
                  Premium Intelligence
                </h3>
              </div>
              <p className="text-emerald-100 leading-relaxed">
                Highest conviction signals with multiple institutional
                confirmations and optimal risk-reward profiles for maximum
                probability setups.
              </p>
            </div>

            {/* 🎯 Professional Quality - Qualitative description */}
            <div className="p-6 bg-gradient-to-br from-blue-900/50 to-blue-800/30 rounded-xl border border-blue-700/50 hover:scale-105 transition-all duration-300">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">✅</span>
                <h3 className="text-xl font-bold text-white">
                  Professional Grade
                </h3>
              </div>
              <p className="text-blue-100 leading-relaxed">
                Well-validated signals with strong technical confirmations and
                institutional-quality analysis for reliable trading
                opportunities.
              </p>
            </div>

            {/* 🎯 Standard Quality - Professional language */}
            <div className="p-6 bg-gradient-to-br from-amber-900/50 to-amber-800/30 rounded-xl border border-amber-700/50 hover:scale-105 transition-all duration-300">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">⚠️</span>
                <h3 className="text-xl font-bold text-white">
                  Standard Quality
                </h3>
              </div>
              <p className="text-amber-100 leading-relaxed">
                Signals requiring additional validation and enhanced risk
                management due to mixed market confirmations and varying
                indicator strength.
              </p>
            </div>

            {/* 🎯 Filtered - Professional explanation */}
            <div className="p-6 bg-gradient-to-br from-slate-900/50 to-slate-800/30 rounded-xl border border-slate-700/50 hover:scale-105 transition-all duration-300">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">🛡️</span>
                <h3 className="text-xl font-bold text-white">Quality Filter</h3>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Our institutional-grade filtering automatically removes signals
                that don't meet professional quality standards to protect your
                capital.
              </p>
            </div>
          </div>
        </div>

        {/* 🎯 PROFESSIONAL VALIDATION: Remove specific numbers, focus on credibility */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Institutional-Grade Validation
          </h2>

          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border-slate-700/50">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                {/* 🎯 Remove specific percentages - use qualitative metrics */}
                <div className="bg-slate-700/50 rounded-xl p-6 text-center border border-slate-600/50">
                  <div className="text-3xl font-bold text-emerald-400 mb-2">
                    Institutional
                  </div>
                  <div className="text-slate-400">Quality Standards</div>
                  <p className="text-xs text-slate-500 mt-2">
                    Professional-grade validation
                  </p>
                </div>

                <div className="bg-slate-700/50 rounded-xl p-6 text-center border border-slate-600/50">
                  <div className="text-3xl font-bold text-blue-400 mb-2">
                    Extensive
                  </div>
                  <div className="text-slate-400">Market Analysis</div>
                  <p className="text-xs text-slate-500 mt-2">
                    Comprehensive historical testing
                  </p>
                </div>

                <div className="bg-slate-700/50 rounded-xl p-6 text-center border border-slate-600/50">
                  <div className="text-3xl font-bold text-purple-400 mb-2">
                    Advanced
                  </div>
                  <div className="text-slate-400">Risk Management</div>
                  <p className="text-xs text-slate-500 mt-2">
                    Institutional-grade controls
                  </p>
                </div>
              </div>

              {/* 🎯 Professional explanation without revealing specific methods */}
              <p className="text-slate-400 mb-6 leading-relaxed">
                Our signal intelligence platform undergoes continuous validation
                across multiple market conditions, including volatile and stable
                periods. The sophisticated analysis framework adapts to changing
                market dynamics while maintaining institutional-grade quality
                standards.
              </p>

              {/* 🔧 PRESERVATION: Risk disclosure maintained */}
              <div className="bg-slate-900/70 rounded-lg p-6 border border-slate-700">
                <p className="text-amber-400 text-sm flex items-center mb-3">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  <strong>Professional Risk Disclosure</strong>
                </p>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Past performance is not indicative of future results. All
                  trading signals are algorithmic analysis tools and not
                  financial advice. Trading involves significant risk of loss
                  and may not be suitable for all investors. Always conduct your
                  own research and consider your financial situation before
                  making any trading decisions.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 🎯 NEW: Professional Technology Section - Show sophistication without revealing methods */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Technology Excellence
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border border-blue-700/30">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-600/20 p-3 rounded-full">
                    <Brain className="h-6 w-6 text-blue-400" />
                  </div>
                  <CardTitle className="text-xl text-white">
                    Advanced AI Systems
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 leading-relaxed">
                  Sophisticated artificial intelligence processes vast amounts
                  of market data with institutional-grade pattern recognition,
                  delivering insights beyond traditional analysis capabilities.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-900/20 to-emerald-800/10 border border-emerald-700/30">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="bg-emerald-600/20 p-3 rounded-full">
                    <Zap className="h-6 w-6 text-emerald-400" />
                  </div>
                  <CardTitle className="text-xl text-white">
                    Real-Time Processing
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 leading-relaxed">
                  Professional-grade infrastructure delivers signals within
                  minutes of market opportunities, ensuring optimal timing for
                  high-probability setups and entries.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border border-purple-700/30">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-600/20 p-3 rounded-full">
                    <Shield className="h-6 w-6 text-purple-400" />
                  </div>
                  <CardTitle className="text-xl text-white">
                    Institutional Security
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 leading-relaxed">
                  Bank-level security protocols and institutional-grade data
                  protection ensure your trading intelligence and personal
                  information remain completely secure.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-900/20 to-amber-800/10 border border-amber-700/30">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="bg-amber-600/20 p-3 rounded-full">
                    <Eye className="h-6 w-6 text-amber-400" />
                  </div>
                  <CardTitle className="text-xl text-white">
                    Complete Transparency
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 leading-relaxed">
                  Full performance tracking and signal lifecycle monitoring
                  provide complete visibility into every aspect of our
                  professional trading intelligence platform.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* 🔧 PRESERVATION: Footer - All existing functionality maintained */}
      <footer className="bg-slate-950/50 border-t border-blue-800/30 mt-12">
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
                Professional AI-powered trading intelligence with
                institutional-grade analysis.
              </p>
              <div className="flex items-center mt-4">
                <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full flex items-center">
                  <Shield className="h-3 w-3 mr-1" />
                  Shariah Compliant
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4 text-sm sm:text-base">
                Platform
              </h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/pricing"
                    className="hover:text-white transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4 text-sm sm:text-base">
                Support
              </h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <Link
                    to="/contact"
                    className="hover:text-white transition-colors"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  {/* 🔧 SESSION #188: FOOTER FIX - Changed Telegram to Twitter with correct URL */}
                  <a
                    href="https://x.com/KurzoraPlatform"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Twitter
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4 text-sm sm:text-base">
                Legal
              </h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <Link
                    to="/privacy-policy"
                    className="hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms-of-service"
                    className="hover:text-white transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    to="/risk-disclosure"
                    className="hover:text-white transition-colors"
                  >
                    Risk Disclosure
                  </Link>
                </li>
                <li>
                  <Link
                    to="/shariah-compliance"
                    className="hover:text-white transition-colors"
                  >
                    Shariah Compliance
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-blue-800/30 pt-6 sm:pt-8 mt-6 sm:mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-center text-slate-400 text-xs sm:text-sm">
                © 2024 Kurzora. All rights reserved. Trading involves risk and
                may not be suitable for all investors.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HowItWorks;
