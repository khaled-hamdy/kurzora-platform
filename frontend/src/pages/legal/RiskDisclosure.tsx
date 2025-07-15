import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { AlertTriangle, TrendingUp, Shield } from "lucide-react";

// 🎯 PURPOSE: Risk Disclosure page for legal compliance and user protection
// 🔧 SESSION #178: LAYOUT FIX - Replaced dashboard Layout with public layout pattern
// 🔧 SESSION #188: FOOTER FIX - Changed Telegram link to Twitter link for consistency with Session #187 pattern
// 🔧 SESSION #189: DISCORD CONSISTENCY FIX - Added Discord link to Support section to match Home Page footer pattern
// 🛡️ PRESERVATION: Maintains all existing functionality and legal protections exactly
// 📝 HANDOVER: Professional risk disclosure following "Audi Approach" - clear but not intimidating
// 🚨 LAYOUT CHANGE: Copied navigation pattern from HowItWorks.tsx to fix dashboard navigation showing on legal pages

const RiskDisclosure: React.FC = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  return (
    // 🔧 SESSION #178: Public layout wrapper (replaces dashboard Layout component)
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      {/* 🔧 SESSION #178: Simple public navigation (copied from HowItWorks.tsx pattern) */}
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

      {/* 🛡️ PRESERVED: All existing risk disclosure content maintained exactly */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section with Warning Icon */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">
            {language === "ar"
              ? "الكشف عن المخاطر"
              : language === "de"
              ? "Risikoaufklärung"
              : "Risk Disclosure"}
          </h1>
          <div className="flex justify-center">
            <AlertTriangle className="h-12 w-12 text-amber-500" />
          </div>
        </div>

        {/* Professional Introduction - Matches "Audi Approach" Positioning */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">
            Important Notice
          </h2>
          <p className="text-slate-300 mb-4">
            The trading intelligence provided by Kurzora represents
            institutional-grade analysis using advanced AI and quantitative
            models. These signals are generated through sophisticated technical
            analysis and historical pattern recognition algorithms designed for
            professional traders.
          </p>
          <p className="text-slate-300 mb-4">
            Professional traders understand that all financial markets carry
            inherent risks. You acknowledge and agree that you use our
            institutional-grade analysis at your own discretion. Kurzora
            provides educational tools and analysis - not financial advice.
          </p>
        </div>

        {/* Main Content Sections */}
        <div className="space-y-6 text-slate-300">
          {/* Trading Risks */}
          <section>
            <h3 className="text-lg font-semibold text-white mb-2">
              Market Risk Considerations
            </h3>
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>
                  Trading stocks and financial instruments involves substantial
                  risk and may not be suitable for all investors.
                </li>
                <li>
                  Past performance of any trading methodology is not necessarily
                  indicative of future results.
                </li>
                <li>
                  Professional traders assess their financial situation and risk
                  tolerance before making trading decisions.
                </li>
                <li>
                  No analysis or signal guarantees profitability - markets can
                  move unpredictably.
                </li>
                <li>
                  Institutional-grade analysis tools are designed for
                  sophisticated users who understand market dynamics.
                </li>
              </ul>
            </div>
          </section>

          {/* Signal Intelligence Accuracy */}
          <section>
            <h3 className="text-lg font-semibold text-white mb-2">
              Signal Intelligence Performance
            </h3>
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>
                  Our AI algorithms are designed to identify high-probability
                  trading opportunities using institutional-grade analysis.
                </li>
                <li>
                  Signal performance varies based on market conditions,
                  volatility, and economic factors.
                </li>
                <li>
                  Professional risk management and position sizing are essential
                  components of successful trading.
                </li>
                <li>
                  Technical failures, data delays, or connectivity issues may
                  affect signal delivery or timing.
                </li>
                <li>
                  Users should independently validate signals using their own
                  research and analysis.
                </li>
              </ul>
            </div>
          </section>

          {/* Platform and Technology Risks */}
          <section>
            <h3 className="text-lg font-semibold text-white mb-2">
              Platform and Technology Considerations
            </h3>
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>
                  Our institutional-grade platform relies on advanced technology
                  infrastructure and data feeds.
                </li>
                <li>
                  Internet connectivity, server availability, or data provider
                  issues may occasionally impact service.
                </li>
                <li>
                  Market conditions can change rapidly between signal generation
                  and potential trade execution.
                </li>
                <li>
                  Users are responsible for monitoring their trading activity
                  and managing their portfolios.
                </li>
                <li>
                  Emergency procedures and backup systems are in place to
                  maintain service reliability.
                </li>
              </ul>
            </div>
          </section>

          {/* Professional Responsibility */}
          <section>
            <h3 className="text-lg font-semibold text-white mb-2">
              Professional Trading Responsibility
            </h3>
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>
                  You are solely responsible for your trading decisions and
                  their financial outcomes.
                </li>
                <li>
                  Kurzora provides analysis tools and educational resources -
                  not personalized investment advice.
                </li>
                <li>
                  Professional traders understand the importance of proper risk
                  management and position sizing.
                </li>
                <li>
                  Consider consulting with qualified financial professionals for
                  personalized investment guidance.
                </li>
                <li>
                  Never trade with capital you cannot afford to lose or that is
                  needed for essential expenses.
                </li>
              </ul>
            </div>
          </section>

          {/* Educational Purpose Statement */}
          <section>
            <h3 className="text-lg font-semibold text-white mb-2">
              Educational and Analytical Purpose
            </h3>
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <p className="text-sm mb-3">
                Kurzora's institutional-grade platform is designed for
                educational and analytical purposes, providing sophisticated
                traders with:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Advanced market analysis and pattern recognition</li>
                <li>Professional-grade risk assessment tools</li>
                <li>
                  Institutional-quality data processing and signal generation
                </li>
                <li>Comprehensive performance tracking and analytics</li>
                <li>Educational resources for advanced trading concepts</li>
              </ul>
              <p className="text-sm mt-3">
                These tools are intended to supplement your own research and
                analysis - not replace professional judgment or due diligence.
              </p>
            </div>
          </section>

          {/* Shariah Compliance Notice */}
          <section>
            <h3 className="text-lg font-semibold text-white mb-2">
              Shariah Compliance Considerations
            </h3>
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <p className="mb-2 text-sm">
                While Kurzora offers advanced Shariah-compliant filtering
                options using institutional-grade screening methodologies, we
                provide these tools for educational and analytical purposes.
              </p>
              <p className="text-sm">
                Professional traders seeking to follow Islamic financial
                principles should conduct their own due diligence and consider
                consulting with qualified Islamic financial advisors to ensure
                compliance with their specific requirements and interpretations.
              </p>
            </div>
          </section>

          {/* Regulatory Compliance */}
          <section>
            <h3 className="text-lg font-semibold text-white mb-2">
              Regulatory and Compliance Information
            </h3>
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <p className="text-sm mb-2">
                Kurzora operates as an educational technology platform providing
                market analysis tools. We are not a registered investment
                advisor, broker-dealer, or financial institution. Our
                institutional-grade analysis tools are designed for:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm mb-2">
                <li>Educational purposes and market research</li>
                <li>Sophisticated traders who understand market risks</li>
                <li>Professional analysis and pattern recognition</li>
                <li>Advanced risk management education</li>
              </ul>
              <p className="text-sm">
                Users are responsible for compliance with applicable laws and
                regulations in their jurisdiction.
              </p>
            </div>
          </section>
        </div>

        {/* Contact Footer - UPDATED: Kurzora support email */}
        <div className="mt-10 p-4 bg-amber-900/20 border border-amber-800/50 rounded-lg">
          <p className="text-amber-400 text-sm text-center">
            By using Kurzora's institutional-grade trading intelligence
            platform, you acknowledge that you have read, understood, and agree
            to this Risk Disclosure. For questions, contact us at
            support@kurzora.com.
          </p>
        </div>
      </div>

      {/* 🔧 SESSION #178: Public footer (copied from HowItWorks.tsx pattern) */}
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
                    to="/how-it-works"
                    className="hover:text-white transition-colors"
                  >
                    How It Works
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
                  {/* 🔧 SESSION #189: DISCORD CONSISTENCY FIX - Added Discord link to match Home Page footer pattern */}
                  <a
                    href="https://discord.gg/kurzora"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Discord
                  </a>
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

export default RiskDisclosure;
