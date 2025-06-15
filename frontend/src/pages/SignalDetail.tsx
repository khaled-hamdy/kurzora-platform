import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import RealisticSignalChart from '../components/charts/RealisticSignalChart';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ArrowLeft, Shield, ArrowRight, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SignalComponent {
  name: string;
  condition: string;
  status: boolean;
  tooltip: string;
}

const SignalDetail: React.FC = () => {
  const { user, loading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const { symbol } = useParams<{ symbol: string }>();

  // Get data from navigation state or use defaults
  const selectedStock = location.state?.selectedStock;
  const timeframe = location.state?.timeframe || '1D';
  const score = location.state?.score || 88;

  useEffect(() => {
    console.log('SignalDetail page: Auth state - loading:', loading, 'user:', user);
    
    // Only redirect if not loading and no user
    if (!loading && !user) {
      console.log('SignalDetail page: User not authenticated, redirecting to home');
      navigate('/');
    }
  }, [user, loading, navigate]);

  // Show loading spinner while authentication state is being determined
  if (loading) {
    console.log('SignalDetail page: Still loading auth state');
    return (
      <Layout>
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
          <div className="text-white text-lg">Loading...</div>
        </div>
      </Layout>
    );
  }

  // Show nothing if no user (will redirect via useEffect)
  if (!user) {
    console.log('SignalDetail page: No user found, should redirect');
    return null;
  }

  // Mock data for the signal detail
  const signalData = {
    symbol: symbol || 'AAPL',
    name: selectedStock?.name || 'Apple Inc.',
    price: selectedStock?.price || 155.88,
    change: selectedStock?.change || 2.34,
    signal: 'BUY',
    score: score,
    badge: score >= 90 ? 'strong' : score >= 80 ? 'valid' : 'weak',
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString(),
    shariahCompliant: true,
    timeframe: timeframe,
    components: [
      {
        name: 'RSI (14)',
        condition: 'Oversold < 30',
        status: true,
        tooltip: 'tooltip.rsi'
      },
      {
        name: 'MACD Histogram',
        condition: 'Crossed above 0',
        status: true,
        tooltip: 'tooltip.macd'
      },
      {
        name: 'Volume',
        condition: '2× 20-day average',
        status: true,
        tooltip: 'tooltip.volume'
      },
      {
        name: 'Support Zone',
        condition: 'Detected via volume clusters',
        status: true,
        tooltip: 'tooltip.support'
      },
      {
        name: 'Multi-Timeframe Match',
        condition: 'M5, H1, D1 all bullish',
        status: true,
        tooltip: 'tooltip.timeframe'
      }
    ]
  };

  const getBadgeClass = (badge: string) => {
    switch(badge) {
      case 'strong': return 'bg-emerald-600 text-white';
      case 'valid': return 'bg-blue-600 text-white';
      case 'weak': return 'bg-yellow-600 text-white';
      case 'ignore': return 'bg-red-600 text-white';
      default: return 'bg-slate-600 text-white';
    }
  }

  const getBadgeEmoji = (badge: string) => {
    switch(badge) {
      case 'strong': return '💎';
      case 'valid': return '✅';
      case 'weak': return '⚠️';
      case 'ignore': return '🚫';
      default: return '';
    }
  }

  const getBadgeText = (badge: string) => {
    switch(badge) {
      case 'strong': return t('signal.strong');
      case 'valid': return t('signal.valid');
      case 'weak': return t('signal.weak');
      case 'ignore': return t('signal.ignore');
      default: return '';
    }
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-4">
          <Link to="/signals" className="text-slate-400 hover:text-white flex items-center space-x-1 mb-4">
            <ArrowLeft className="h-4 w-4" />
            <span>{t('signal.backToSignals')}</span>
          </Link>
          
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-2">
                {signalData.symbol}
                {signalData.shariahCompliant && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Shield className="h-5 w-5 text-green-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{t('legal.shariahCompliant')}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                <span className="text-slate-400 text-lg font-normal"> {signalData.name}</span>
                <span className="text-emerald-400 text-lg font-normal">({signalData.timeframe})</span>
              </h1>
              <p className="text-slate-400">
                {signalData.date} • {signalData.time}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                signalData.signal === 'BUY' ? 'bg-emerald-600 text-white' : 
                signalData.signal === 'HOLD' ? 'bg-yellow-600 text-white' : 
                'bg-red-600 text-white'
              }`}>
                {signalData.signal}
              </div>
              <div className={`px-3 py-1 rounded text-sm font-medium ${getBadgeClass(signalData.badge as string)}`}>
                {getBadgeEmoji(signalData.badge as string)} {getBadgeText(signalData.badge as string)}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {/* Realistic Signal Chart */}
            <div className="mb-6">
              <RealisticSignalChart 
                symbol={signalData.symbol} 
                timeframe={signalData.timeframe}
                signalScore={signalData.score}
              />
            </div>
            
            {/* Signal Components */}
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg text-white flex justify-between items-center">
                  <span>{t('signal.title')} - {t('signal.score')}: {signalData.score}/100</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('signal.component')}</TableHead>
                      <TableHead>{t('signal.condition')}</TableHead>
                      <TableHead>{t('signal.status')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {signalData.components.map((component, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="font-medium text-white">
                            {component.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <span>{component.condition}</span>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger className="ml-1">
                                  <AlertTriangle className="h-3 w-3 text-blue-400" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{t(component.tooltip)}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className={`flex justify-center ${component.status ? 'text-green-500' : 'text-red-500'}`}>
                            {component.status ? '✓' : '✗'}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="mt-6 p-4 bg-slate-800 rounded-md border border-slate-700">
                  <p className="text-slate-300">
                    {t('signal.summary')} {t('signal.score')}: {signalData.score}/100
                  </p>
                </div>

                <div className="mt-6 flex justify-center">
                  <Button 
                    variant="outline" 
                    className="flex items-center space-x-2"
                    onClick={() => navigate('/how-it-works')}
                  >
                    <span>{t('signal.learnHow')}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            {/* Price Information */}
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 mb-6">
              <CardHeader>
                <CardTitle className="text-lg text-white">Price Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Current Price</span>
                    <span className="text-white font-semibold">${signalData.price}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Daily Change</span>
                    <span className={`font-semibold ${signalData.change > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {signalData.change > 0 ? '+' : ''}{signalData.change}%
                    </span>
                  </div>
                  
                  <div className="border-t border-slate-700 my-4"></div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <TrendingUp className="h-4 w-4 text-emerald-400 mr-2" />
                      <span className="text-slate-400">Target</span>
                    </div>
                    <span className="text-emerald-400 font-semibold">$162.11</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <TrendingDown className="h-4 w-4 text-red-400 mr-2" />
                      <span className="text-slate-400">Stop Loss</span>
                    </div>
                    <span className="text-red-400 font-semibold">$151.21</span>
                  </div>
                  
                  <div className="border-t border-slate-700 my-4"></div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Risk/Reward</span>
                    <span className="text-white font-semibold">1:3.4</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Actions */}
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg text-white">Trade This Signal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                    Place Buy Order
                  </Button>

                  <div className="flex justify-center">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex items-center space-x-2"
                      onClick={() => navigate('/broker-integration')}
                    >
                      <span>Setup Auto-Trading</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SignalDetail;
