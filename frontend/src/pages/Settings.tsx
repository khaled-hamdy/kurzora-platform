import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Switch } from "../components/ui/switch";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { Bell, Globe, Shield, Smartphone, Mail } from "lucide-react";

// Import the production-ready TelegramConnection component
import { TelegramConnection } from "../components/telegram";

const Settings: React.FC = () => {
  const { user, loading } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  // Ultra-simplified settings state - only essential toggles
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);

  React.useEffect(() => {
    console.log("Settings page: Auth state - loading:", loading, "user:", user);

    // Only redirect if not loading and no user
    if (!loading && !user) {
      console.log("Settings page: User not authenticated, redirecting to home");
      navigate("/");
    }
  }, [user, loading, navigate]);

  // Show loading spinner while authentication state is being determined
  if (loading) {
    console.log("Settings page: Still loading auth state");
    return (
      <Layout>
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
          <div className="text-white text-lg">{t("common.loading")}</div>
        </div>
      </Layout>
    );
  }

  // Show nothing if no user (will redirect via useEffect)
  if (!user) {
    console.log("Settings page: No user found, should redirect");
    return null;
  }

  return (
    <Layout>
      <div
        className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${
          language === "ar" ? "rtl" : "ltr"
        }`}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {t("settings.title")}
          </h1>
          <p className="text-slate-400">
            Customize your trading experience and preferences
          </p>
        </div>

        <div className="space-y-6">
          {/* Notification Settings - SIMPLIFIED */}
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg text-white flex items-center">
                <Bell className="h-5 w-5 mr-2 text-blue-400" />
                {t("settings.notifications")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <Label className="text-slate-300">
                    {t("settings.emailAlerts")}
                  </Label>
                </div>
                <Switch
                  checked={emailAlerts}
                  onCheckedChange={setEmailAlerts}
                />
              </div>

              {/* REAL TelegramConnection component - shows 70% threshold automatically */}
              <TelegramConnection />

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Smartphone className="h-4 w-4 text-slate-400" />
                  <Label className="text-slate-300">
                    {t("settings.pushNotifications")}
                  </Label>
                </div>
                <Switch
                  checked={pushNotifications}
                  onCheckedChange={setPushNotifications}
                />
              </div>

              {/* REMOVED: Digest frequency dropdown - too complex */}
            </CardContent>
          </Card>

          {/* Language & Locale - SIMPLIFIED */}
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg text-white flex items-center">
                <Globe className="h-5 w-5 mr-2 text-purple-400" />
                {t("settings.language")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-slate-300 text-sm font-medium">
                  Language
                </Label>
                <div className="flex space-x-2 mt-2">
                  <Badge
                    variant={language === "en" ? "default" : "outline"}
                    className="cursor-pointer"
                  >
                    🇺🇸 English
                  </Badge>
                  <Badge
                    variant={language === "ar" ? "default" : "outline"}
                    className="cursor-pointer"
                  >
                    🇸🇦 العربية
                  </Badge>
                  <Badge
                    variant={language === "de" ? "default" : "outline"}
                    className="cursor-pointer"
                  >
                    🇩🇪 Deutsch
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security - SIMPLIFIED (removed 2FA and complex features) */}
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg text-white flex items-center">
                <Shield className="h-5 w-5 mr-2 text-red-400" />
                {t("settings.security")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="outline"
                className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
              >
                {t("settings.changePassword")}
              </Button>

              <div>
                <Label className="text-slate-300 text-sm font-medium">
                  {t("settings.lastLogin")}
                </Label>
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Last login:</span>
                    <span className="text-white">Today, 2:15 PM</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Device:</span>
                    <span className="text-white">Chrome on macOS</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* REMOVED: API & Auto-Trading section entirely - too complex */}
          {/* REMOVED: UI & Data Preferences section entirely - user requested removal */}
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
