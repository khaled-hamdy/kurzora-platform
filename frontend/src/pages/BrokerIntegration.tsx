
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader, 
  CardTitle 
} from '../components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '../components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  AlertTriangle,
  CheckCircle,
  Lock,
  Zap,
  Settings,
  Link as LinkIcon
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';

const BrokerIntegration: React.FC = () => {
  const { user, loading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const [broker, setBroker] = useState<string>("");
  const [apiKey, setApiKey] = useState<string>("");
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [autoTrading, setAutoTrading] = useState<boolean>(false);
  const [minScore, setMinScore] = useState<number>(80);

  React.useEffect(() => {
    console.log('BrokerIntegration page: Auth state - loading:', loading, 'user:', user);
    
    // Only redirect if not loading and no user
    if (!loading && !user) {
      console.log('BrokerIntegration page: User not authenticated, redirecting to home');
      navigate('/');
    }
  }, [user, loading, navigate]);

  // Show loading spinner while authentication state is being determined
  if (loading) {
    console.log('BrokerIntegration page: Still loading auth state');
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
    console.log('BrokerIntegration page: No user found, should redirect');
    return null;
  }

  const handleConnect = () => {
    if (broker && apiKey) {
      // Simulate connection success
      setIsConnected(true);
    }
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setAutoTrading(false);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Automated Broker Connection
          </h1>
          <p className="text-slate-400">
            Connect your brokerage account to enable automated trading based on our signals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg text-white">Broker Integration Setup</CardTitle>
                <CardDescription>
                  Connect your broker API to enable automated trading
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <Label htmlFor="broker">Select Your Broker</Label>
                    <Select 
                      disabled={isConnected} 
                      value={broker} 
                      onValueChange={setBroker}
                    >
                      <SelectTrigger id="broker" className="bg-slate-900 border-slate-700">
                        <SelectValue placeholder="Select a broker" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-slate-700">
                        <SelectItem value="interactive-brokers">Interactive Brokers</SelectItem>
                        <SelectItem value="alpaca">Alpaca</SelectItem>
                        <SelectItem value="tradier">Tradier</SelectItem>
                        <SelectItem value="robinhood">Robinhood</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="api-key" className="flex items-center">
                      API Key
                      <Lock className="h-3 w-3 text-slate-500 ml-1" />
                    </Label>
                    <Input
                      id="api-key"
                      type="password"
                      placeholder="Enter your API key"
                      className="bg-slate-900 border-slate-700"
                      disabled={isConnected}
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                    />
                    <p className="text-xs text-slate-400 mt-1">
                      Your keys are encrypted and securely stored
                    </p>
                  </div>

                  {isConnected ? (
                    <div className="flex space-x-4">
                      <Button 
                        onClick={handleDisconnect}
                        variant="destructive"
                        className="mt-2"
                      >
                        Disconnect Broker
                      </Button>
                      <div className="flex items-center mt-2 bg-green-900/20 text-green-400 px-3 py-1 rounded-md">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        <span className="text-sm">Connected Successfully</span>
                      </div>
                    </div>
                  ) : (
                    <Button 
                      onClick={handleConnect}
                      className="mt-2 bg-blue-600 hover:bg-blue-700"
                      disabled={!broker || !apiKey}
                    >
                      <LinkIcon className="h-4 w-4 mr-2" />
                      Connect Broker
                    </Button>
                  )}

                  {isConnected && (
                    <div className="mt-6 pt-6 border-t border-slate-700">
                      <h3 className="text-lg font-medium text-white mb-4">Auto-Trading Settings</h3>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="space-y-0.5">
                          <div className="flex items-center">
                            <Zap className="h-5 w-5 text-amber-400 mr-2" />
                            <Label htmlFor="auto-trading" className="text-lg">Auto-Trading</Label>
                          </div>
                          <p className="text-xs text-slate-400">
                            Automatically execute trades based on signals
                          </p>
                        </div>
                        <Switch 
                          id="auto-trading"
                          checked={autoTrading}
                          onCheckedChange={setAutoTrading}
                        />
                      </div>
                      
                      {autoTrading && (
                        <>
                          <div className="mt-4 space-y-2">
                            <div className="flex items-center justify-between">
                              <Label htmlFor="min-score">Minimum Signal Score: {minScore}</Label>
                              <span className="text-sm text-slate-400">{minScore}/100</span>
                            </div>
                            <input
                              id="min-score"
                              type="range"
                              min="60"
                              max="95"
                              step="5"
                              value={minScore}
                              onChange={(e) => setMinScore(Number(e.target.value))}
                              className="w-full"
                            />
                            <div className="flex justify-between text-xs text-slate-500">
                              <span>Lower (More Trades)</span>
                              <span>Higher (Fewer Trades)</span>
                            </div>
                          </div>
                          
                          <div className="mt-4 grid grid-cols-2 gap-3">
                            <Card className="bg-slate-900 border-slate-700">
                              <CardContent className="p-3">
                                <div className="flex items-center mb-2">
                                  <Settings className="h-4 w-4 text-blue-400 mr-2" />
                                  <Label className="text-sm">Position Size</Label>
                                </div>
                                <Select defaultValue="fixed">
                                  <SelectTrigger className="bg-slate-800 border-slate-700 h-8 text-sm">
                                    <SelectValue placeholder="Position size" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-slate-900 border-slate-700">
                                    <SelectItem value="fixed">Fixed ($1000)</SelectItem>
                                    <SelectItem value="percent">Percentage (5%)</SelectItem>
                                    <SelectItem value="risk">Risk-Based (1%)</SelectItem>
                                  </SelectContent>
                                </Select>
                              </CardContent>
                            </Card>
                            
                            <Card className="bg-slate-900 border-slate-700">
                              <CardContent className="p-3">
                                <div className="flex items-center mb-2">
                                  <Settings className="h-4 w-4 text-blue-400 mr-2" />
                                  <Label className="text-sm">Order Type</Label>
                                </div>
                                <Select defaultValue="market">
                                  <SelectTrigger className="bg-slate-800 border-slate-700 h-8 text-sm">
                                    <SelectValue placeholder="Order type" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-slate-900 border-slate-700">
                                    <SelectItem value="market">Market</SelectItem>
                                    <SelectItem value="limit">Limit</SelectItem>
                                    <SelectItem value="stop">Stop</SelectItem>
                                  </SelectContent>
                                </Select>
                              </CardContent>
                            </Card>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg text-white">Supported Brokers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-slate-700/30 rounded-lg">
                    <h4 className="font-medium text-white">Interactive Brokers</h4>
                    <p className="text-xs text-slate-400 mt-1">Best for professional traders</p>
                  </div>
                  <div className="p-3 bg-slate-700/30 rounded-lg">
                    <h4 className="font-medium text-white">Alpaca</h4>
                    <p className="text-xs text-slate-400 mt-1">Commission-free API trading</p>
                  </div>
                  <div className="p-3 bg-slate-700/30 rounded-lg">
                    <h4 className="font-medium text-white">Tradier</h4>
                    <p className="text-xs text-slate-400 mt-1">Options-focused platform</p>
                  </div>
                  <div className="p-3 bg-slate-700/30 rounded-lg">
                    <h4 className="font-medium text-white">Robinhood</h4>
                    <p className="text-xs text-slate-400 mt-1">Popular retail platform</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="bg-amber-900/20 border border-amber-800/50 rounded-lg p-4">
              <div className="flex items-start mb-2">
                <AlertTriangle className="h-5 w-5 text-amber-400 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-amber-400 text-sm font-medium">Important Notice</p>
              </div>
              <p className="text-slate-300 text-sm">
                This is a demo simulation. Real execution requires secure OAuth and explicit consent.
                Auto-trading involves significant risk. Use at your own discretion.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BrokerIntegration;
