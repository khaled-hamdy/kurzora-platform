
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { CheckCircle, AlertTriangle, Layers, Signal, Gauge, BrainCircuit, TrendingUp, Shield } from 'lucide-react';

const HowItWorks: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      {/* Navigation */}
      <nav className="bg-slate-900/50 backdrop-blur-sm border-b border-blue-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <Link to="/" className="flex items-center space-x-2">
              <div className="logo-container">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 chart-element" />
                  <span className="logo-text text-xl sm:text-2xl font-bold">Kurzora</span>
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
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">How Our Signals Work</h1>
          <p className="text-slate-400 max-w-3xl mx-auto">
            Kurzora combines institutional-grade algorithms with advanced AI pattern recognition 
            to identify high-probability trading opportunities.
          </p>
        </div>

        {/* Signal Logic Process */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">Our Signal Generation Process</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-500/20 p-3 rounded-full">
                    <Layers className="h-6 w-6 text-blue-400" />
                  </div>
                  <CardTitle className="text-lg text-white">{t('features.multiTimeframe')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400">
                  {t('features.multiTimeframeDesc')}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-500/20 p-3 rounded-full">
                    <Signal className="h-6 w-6 text-purple-400" />
                  </div>
                  <CardTitle className="text-lg text-white">{t('features.supportResistance')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400">
                  {t('features.supportResistanceDesc')}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="bg-green-500/20 p-3 rounded-full">
                    <Gauge className="h-6 w-6 text-green-400" />
                  </div>
                  <CardTitle className="text-lg text-white">{t('features.optionsFlow')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400">
                  {t('features.optionsFlowDesc')}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="bg-amber-500/20 p-3 rounded-full">
                    <AlertTriangle className="h-6 w-6 text-amber-400" />
                  </div>
                  <CardTitle className="text-lg text-white">Risk Management</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400">
                  Every signal includes calculated stop-loss and take-profit levels to maintain favorable 
                  risk-reward ratios. We target minimum 1:2 risk-reward for all trades.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="bg-red-500/20 p-3 rounded-full">
                    <CheckCircle className="h-6 w-6 text-red-400" />
                  </div>
                  <CardTitle className="text-lg text-white">Validation & Scoring</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400">
                  Each signal receives a score (0-100) based on strength of confirmation, historical 
                  pattern success rate, and current market volatility conditions.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="bg-indigo-500/20 p-3 rounded-full">
                    <BrainCircuit className="h-6 w-6 text-indigo-400" />
                  </div>
                  <CardTitle className="text-lg text-white">AI Enhancement</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400">
                  Machine learning algorithms continuously improve signal quality by analyzing successful 
                  patterns and adapting to changing market conditions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Signal Score Explanation */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">Understanding Signal Scores</h2>
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-4 bg-gradient-to-r from-emerald-900/50 to-emerald-800/30 rounded-lg border border-emerald-700">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-2">💎</span>
                    <h3 className="text-lg font-semibold text-white">Strong (80-100)</h3>
                  </div>
                  <p className="text-slate-300 text-sm">
                    Highest confidence signals with multiple strong confirmations. 
                    Historical win rate over 75%.
                  </p>
                </div>

                <div className="p-4 bg-gradient-to-r from-blue-900/50 to-blue-800/30 rounded-lg border border-blue-700">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-2">✅</span>
                    <h3 className="text-lg font-semibold text-white">Valid (60-79)</h3>
                  </div>
                  <p className="text-slate-300 text-sm">
                    Good quality signals with solid confirmations.
                    Historical win rate 60-75%.
                  </p>
                </div>

                <div className="p-4 bg-gradient-to-r from-yellow-900/50 to-yellow-800/30 rounded-lg border border-yellow-700">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-2">⚠️</span>
                    <h3 className="text-lg font-semibold text-white">Weak (40-59)</h3>
                  </div>
                  <p className="text-slate-300 text-sm">
                    Mixed confirmations with some conflicting indicators.
                    Use additional validation.
                  </p>
                </div>

                <div className="p-4 bg-gradient-to-r from-red-900/50 to-red-800/30 rounded-lg border border-red-700">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-2">🚫</span>
                    <h3 className="text-lg font-semibold text-white">Ignore (0-39)</h3>
                  </div>
                  <p className="text-slate-300 text-sm">
                    Multiple conflicting indicators. Not recommended for trading.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Backtesting Results */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Backtesting & Performance</h2>
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-emerald-400 mb-1">68%</div>
                  <div className="text-slate-400">Average Win Rate</div>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-emerald-400 mb-1">180,000+</div>
                  <div className="text-slate-400">Trades Analyzed</div>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-emerald-400 mb-1">6%</div>
                  <div className="text-slate-400">Average ROI per Trade</div>
                </div>
              </div>
              
              <p className="text-slate-400 mb-4">
                Our signal algorithm has been extensively backtested across multiple market conditions, 
                including bull markets, bear markets, and sideways consolidations. Performance metrics 
                are constantly monitored and algorithms are updated to adapt to changing market dynamics.
              </p>
              
              <div className="bg-slate-900 rounded-md p-4 border border-slate-700">
                <p className="text-amber-400 text-sm flex items-center mb-2">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  <strong>Important Risk Disclosure</strong>
                </p>
                <p className="text-slate-400 text-sm">
                  Past performance is not indicative of future results. All trading signals are algorithmic 
                  and not financial advice. Trading involves significant risk of loss and may not be suitable 
                  for all investors. Always conduct your own research and consider your financial situation 
                  before trading.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-950/50 border-t border-blue-800/30 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="col-span-1 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="logo-container">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 chart-element" />
                    <span className="logo-text text-base sm:text-lg font-bold">Kurzora</span>
                  </div>
                </div>
              </div>
              <p className="text-slate-400 text-sm mb-4">
                Professional AI-powered trading intelligence with institutional-grade analysis.
              </p>
              <div className="flex items-center mt-4">
                <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full flex items-center">
                  <Shield className="h-3 w-3 mr-1" />
                  Shariah Compliant
                </span>
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4 text-sm sm:text-base">Platform</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4 text-sm sm:text-base">Support</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><a href="https://t.me/kurzora" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Telegram</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4 text-sm sm:text-base">Legal</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link to="/risk-disclosure" className="hover:text-white transition-colors">Risk Disclosure</Link></li>
                <li><Link to="/shariah-compliance" className="hover:text-white transition-colors">Shariah Compliance</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-blue-800/30 pt-6 sm:pt-8 mt-6 sm:mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-center text-slate-400 text-xs sm:text-sm">
                © 2024 Kurzora. All rights reserved. Trading involves risk and may not be suitable for all investors.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HowItWorks;
