
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Bell, Globe, Shield, Key, Monitor, Smartphone, Mail, MessageSquare, CheckCircle, XCircle, Clock, Eye } from 'lucide-react';

const Settings: React.FC = () => {
  const { user, loading } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  // Settings state (removed signal-related state)
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [telegramAlerts, setTelegramAlerts] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [digestFreq, setDigestFreq] = useState('daily');
  const [twoFA, setTwoFA] = useState(false);
  const [autoTrading, setAutoTrading] = useState(false);
  const [showPnL, setShowPnL] = useState(true);
  const [showBacktest, setShowBacktest] = useState(false);
  const [uiDensity, setUiDensity] = useState('default');
  const [apiKey, setApiKey] = useState('sk-****************************');

  React.useEffect(() => {
    console.log('Settings page: Auth state - loading:', loading, 'user:', user);
    
    // Only redirect if not loading and no user
    if (!loading && !user) {
      console.log('Settings page: User not authenticated, redirecting to home');
      navigate('/');
    }
  }, [user, loading, navigate]);

  // Show loading spinner while authentication state is being determined
  if (loading) {
    console.log('Settings page: Still loading auth state');
    return (
      <Layout>
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
          <div className="text-white text-lg">{t('common.loading')}</div>
        </div>
      </Layout>
    );
  }

  // Show nothing if no user (will redirect via useEffect)
  if (!user) {
    console.log('Settings page: No user found, should redirect');
    return null;
  }

  const generateNewAPIKey = () => {
    const newKey = 'sk-' + Math.random().toString(36).substring(2, 30);
    setApiKey(newKey);
  };

  return (
    <Layout>
      <div className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${language === 'ar' ? 'rtl' : 'ltr'}`}>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{t('settings.title')}</h1>
          <p className="text-slate-400">Customize your trading experience and preferences</p>
        </div>

        <div className="space-y-6">
          {/* Notification Settings */}
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg text-white flex items-center">
                <Bell className="h-5 w-5 mr-2 text-blue-400" />
                {t('settings.notifications')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <Label className="text-slate-300">{t('settings.emailAlerts')}</Label>
                </div>
                <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4 text-slate-400" />
                  <Label className="text-slate-300">{t('settings.telegramAlerts')}</Label>
                </div>
                <Switch checked={telegramAlerts} onCheckedChange={setTelegramAlerts} />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Smartphone className="h-4 w-4 text-slate-400" />
                  <Label className="text-slate-300">{t('settings.pushNotifications')}</Label>
                </div>
                <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
              </div>

              <div>
                <Label className="text-slate-300 text-sm font-medium">{t('settings.digestFreq')}</Label>
                <Select value={digestFreq} onValueChange={setDigestFreq}>
                  <SelectTrigger className="mt-2 bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realtime">Real-Time</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Language & Locale */}
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg text-white flex items-center">
                <Globe className="h-5 w-5 mr-2 text-purple-400" />
                {t('settings.language')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-slate-300 text-sm font-medium">Language</Label>
                <div className="flex space-x-2 mt-2">
                  <Badge variant={language === 'en' ? 'default' : 'outline'} className="cursor-pointer">
                    🇺🇸 English
                  </Badge>
                  <Badge variant={language === 'ar' ? 'default' : 'outline'} className="cursor-pointer">
                    🇸🇦 العربية
                  </Badge>
                  <Badge variant={language === 'de' ? 'default' : 'outline'} className="cursor-pointer">
                    🇩🇪 Deutsch
                  </Badge>
                </div>
              </div>
              
              <div>
                <Label className="text-slate-300 text-sm font-medium">Timezone</Label>
                <Select defaultValue="utc">
                  <SelectTrigger className="mt-2 bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc">UTC</SelectItem>
                    <SelectItem value="est">EST (New York)</SelectItem>
                    <SelectItem value="cet">CET (Berlin)</SelectItem>
                    <SelectItem value="gst">GST (Dubai)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg text-white flex items-center">
                <Shield className="h-5 w-5 mr-2 text-red-400" />
                {t('settings.security')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600">
                {t('settings.changePassword')}
              </Button>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-slate-300">{t('settings.twoFA')}</Label>
                  <p className="text-xs text-slate-400">Add an extra layer of security</p>
                </div>
                <Switch checked={twoFA} onCheckedChange={setTwoFA} />
              </div>

              <div>
                <Label className="text-slate-300 text-sm font-medium">{t('settings.lastLogin')}</Label>
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Last login:</span>
                    <span className="text-white">Today, 2:15 PM</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">IP Address:</span>
                    <span className="text-white">192.168.1.1</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Device:</span>
                    <span className="text-white">Chrome on macOS</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* API & Auto-Trading */}
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg text-white flex items-center">
                <Key className="h-5 w-5 mr-2 text-yellow-400" />
                {t('settings.api')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-slate-300 text-sm font-medium">API Key</Label>
                <div className="flex space-x-2 mt-2">
                  <Input 
                    value={apiKey}
                    readOnly
                    className="bg-slate-700 border-slate-600 text-white font-mono text-sm"
                  />
                  <Button onClick={generateNewAPIKey} variant="outline" className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600">
                    Generate New
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-slate-300">{t('settings.autoTrading')}</Label>
                  <p className="text-xs text-slate-400">Only for signals ≥ 85% confidence</p>
                </div>
                <Switch checked={autoTrading} onCheckedChange={setAutoTrading} />
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-slate-300">{t('settings.brokerStatus')}</Label>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-green-400 text-sm">IBKR Connected</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* UI & Data Preferences */}
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg text-white flex items-center">
                <Monitor className="h-5 w-5 mr-2 text-cyan-400" />
                {t('settings.ui')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Eye className="h-4 w-4 text-slate-400" />
                  <Label className="text-slate-300">{t('settings.showPnL')}</Label>
                </div>
                <Switch checked={showPnL} onCheckedChange={setShowPnL} />
              </div>

              <div className="pt-4">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  {t('common.save')} {t('settings.title')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
