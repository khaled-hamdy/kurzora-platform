
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { AlertTriangle } from 'lucide-react';

const RiskDisclosure: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">{t('legal.riskDisclosure')}</h1>
          <div className="flex justify-center">
            <AlertTriangle className="h-12 w-12 text-amber-500" />
          </div>
        </div>
        
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Important Notice</h2>
          <p className="text-slate-300 mb-4">
            The trading signals provided by SwingTrader are algorithmic in nature and do not constitute financial advice. 
            These signals are generated using technical analysis and historical pattern recognition algorithms.
          </p>
          <p className="text-slate-300 mb-4">
            You acknowledge and agree that you use these signals at your own risk. SwingTrader is not liable for any 
            financial losses that may occur from using our signals or automated trading features.
          </p>
        </div>

        <div className="space-y-6 text-slate-300">
          <section>
            <h3 className="text-lg font-semibold text-white mb-2">Trading Risks</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>Trading stocks, options, and other financial instruments involves substantial risk of loss and is not suitable for all investors.</li>
              <li>Past performance of any trading system or methodology is not necessarily indicative of future results.</li>
              <li>You should consider your financial situation and risk tolerance before trading any financial instruments.</li>
              <li>No signal, analysis, or content on this platform guarantees profitability.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-2">Signal Accuracy</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>While our algorithms target a 68% accuracy rate based on historical data, actual performance may vary.</li>
              <li>Market conditions can change rapidly, affecting signal performance.</li>
              <li>Technical failures, latency, or other issues may affect signal delivery or execution.</li>
              <li>Users should independently verify signals before making trading decisions.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-2">Automated Trading Risks</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>Automated trading through our broker integration carries additional risks.</li>
              <li>Technical failures may occur, causing orders to not be executed or to be executed incorrectly.</li>
              <li>Market conditions may change between signal generation and order execution.</li>
              <li>Users are responsible for monitoring their automated trading activity.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-2">Financial Responsibility</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>You are solely responsible for your trading decisions and their outcomes.</li>
              <li>SwingTrader and its affiliates assume no responsibility for your trading results.</li>
              <li>We strongly recommend never trading with money you cannot afford to lose.</li>
              <li>Consider consulting with a qualified financial advisor before engaging in trading activities.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-2">Shariah Compliance Notice</h3>
            <p className="mb-2">
              While we offer Shariah-compliant filtering options, we make no guarantees regarding their perfect adherence to all 
              Islamic financial principles across all jurisdictions and schools of thought.
            </p>
            <p>
              Users seeking to trade according to Islamic financial principles should conduct their own due diligence and 
              possibly consult with an Islamic financial advisor.
            </p>
          </section>
        </div>
        
        <div className="mt-10 p-4 bg-amber-900/20 border border-amber-800/50 rounded-lg">
          <p className="text-amber-400 text-sm text-center">
            By using SwingTrader, you acknowledge that you have read, understood, and agree to this Risk Disclosure.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default RiskDisclosure;
