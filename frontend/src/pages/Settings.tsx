import React, { useCallback, useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useNavigate, useLocation } from "react-router-dom";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Bell,
  Shield,
  Mail,
  RefreshCw,
  Settings as SettingsIcon,
  Timer,
  Clock,
  Save,
  CheckCircle,
} from "lucide-react";
import { useToast } from "../hooks/use-toast";

// Import the production-ready TelegramConnection component
import { TelegramConnection } from "../components/telegram";

// Import the alert settings hook for email database integration
import { useUserAlertSettings } from "../hooks/useUserAlertSettings";

// Import the new ChangePasswordModal component
import { ChangePasswordModal } from "../components/ChangePasswordModal";

// 🚀 NEW: Import periodic signal generation hook
import { usePeriodicSignalGeneration } from "../hooks/usePeriodicSignalGeneration";

// 🚀 NEW: Enhanced Toggle with Clear On/Off Labels
const ClearToggle: React.FC<{
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  icon?: React.ElementType;
}> = ({
  id,
  label,
  description,
  checked,
  onCheckedChange,
  disabled,
  icon: Icon,
}) => {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-slate-600 bg-slate-700/30">
      <div className="flex items-center space-x-3">
        {Icon && <Icon className="h-4 w-4 text-slate-400" />}
        <div>
          <Label
            htmlFor={id}
            className="text-slate-300 cursor-pointer font-medium"
          >
            {label}
          </Label>
          {description && (
            <p className="text-xs text-slate-400 mt-1">{description}</p>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-3">
        {/* 🚀 NEW: Clear On/Off Text Labels */}
        <span
          className={`text-xs font-medium ${
            checked ? "text-emerald-400" : "text-slate-500"
          }`}
        >
          {checked ? "ON" : "OFF"}
        </span>
        <Switch
          id={id}
          checked={checked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

const Settings: React.FC = React.memo(() => {
  const { user, loading } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // 🚀 NEW: Refs for section scrolling
  const signalGenerationRef = useRef<HTMLDivElement>(null);

  // State for Change Password modal
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // 🚀 NEW: Save state management
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Get email settings from database (same pattern as Telegram)
  const {
    alertSettings,
    loading: settingsLoading,
    saving: settingsSaving,
    updateSettings,
  } = useUserAlertSettings();

  // 🚀 NEW: Auto-generation settings hook
  const {
    config: autoGenConfig,
    updateConfig: updateAutoGenConfig,
    isMarketHours,
    timeUntilNext,
  } = usePeriodicSignalGeneration({
    enabled: false, // Start disabled, user can enable
    intervalHours: 4, // Default 4 hours
    marketHoursOnly: true,
  });

  // 🚀 NEW: Local state for settings before saving
  const [localEmailEnabled, setLocalEmailEnabled] = useState(
    alertSettings?.email_enabled ?? true
  );
  const [localAutoGenConfig, setLocalAutoGenConfig] = useState(autoGenConfig);

  // 🚀 NEW: Handle scroll to section on navigation from Signals page
  useEffect(() => {
    if (location.state?.scrollToSection === "signal-generation") {
      setTimeout(() => {
        signalGenerationRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  }, [location.state]);

  // 🚀 NEW: Track unsaved changes
  useEffect(() => {
    const emailChanged =
      localEmailEnabled !== (alertSettings?.email_enabled ?? true);
    const autoGenChanged =
      JSON.stringify(localAutoGenConfig) !== JSON.stringify(autoGenConfig);
    setHasUnsavedChanges(emailChanged || autoGenChanged);
  }, [localEmailEnabled, localAutoGenConfig, alertSettings, autoGenConfig]);

  // 🚀 NEW: Sync local state when external state changes
  useEffect(() => {
    setLocalEmailEnabled(alertSettings?.email_enabled ?? true);
  }, [alertSettings]);

  useEffect(() => {
    setLocalAutoGenConfig(autoGenConfig);
  }, [autoGenConfig]);

  // 🔧 MEMOIZED: Handle email toggle changes (local state only)
  const handleEmailToggle = useCallback((enabled: boolean) => {
    setLocalEmailEnabled(enabled);
  }, []);

  // 🚀 NEW: Handle auto-generation toggle (local state only)
  const handleAutoGenToggle = useCallback((enabled: boolean) => {
    setLocalAutoGenConfig((prev) => ({ ...prev, enabled }));
  }, []);

  // 🚀 NEW: Handle interval change (local state only)
  const handleIntervalChange = useCallback((intervalHours: string) => {
    setLocalAutoGenConfig((prev) => ({
      ...prev,
      intervalHours: parseInt(intervalHours),
    }));
  }, []);

  // 🚀 NEW: Handle market hours toggle (local state only)
  const handleMarketHoursToggle = useCallback((marketHoursOnly: boolean) => {
    setLocalAutoGenConfig((prev) => ({ ...prev, marketHoursOnly }));
  }, []);

  // 🚀 NEW: Save all settings
  const handleSaveSettings = useCallback(async () => {
    setIsSaving(true);
    try {
      // Save email settings
      if (localEmailEnabled !== (alertSettings?.email_enabled ?? true)) {
        await updateSettings({ email_enabled: localEmailEnabled });
      }

      // Save auto-generation settings
      if (
        JSON.stringify(localAutoGenConfig) !== JSON.stringify(autoGenConfig)
      ) {
        updateAutoGenConfig(localAutoGenConfig);
      }

      setLastSaved(new Date());
      setHasUnsavedChanges(false);

      toast({
        title: "✅ Settings Saved",
        description: "Your preferences have been updated successfully",
      });
    } catch (error) {
      toast({
        title: "❌ Save Failed",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }, [
    localEmailEnabled,
    localAutoGenConfig,
    alertSettings,
    autoGenConfig,
    updateSettings,
    updateAutoGenConfig,
    toast,
  ]);

  // 🚀 NEW: Discard changes
  const handleDiscardChanges = useCallback(() => {
    setLocalEmailEnabled(alertSettings?.email_enabled ?? true);
    setLocalAutoGenConfig(autoGenConfig);
    setHasUnsavedChanges(false);
  }, [alertSettings, autoGenConfig]);

  // 🔧 MEMOIZED: Navigation handler
  const handleRedirect = useCallback(() => {
    console.log("Settings page: User not authenticated, redirecting to home");
    navigate("/");
  }, [navigate]);

  // 🔧 MEMOIZED: Change Password handler
  const handleChangePasswordClick = useCallback(() => {
    setShowPasswordModal(true);
  }, []);

  // 🔧 MEMOIZED: Close modal handler
  const handleClosePasswordModal = useCallback(() => {
    setShowPasswordModal(false);
  }, []);

  React.useEffect(() => {
    console.log("Settings page: Auth state - loading:", loading, "user:", user);

    // Only redirect if not loading and no user
    if (!loading && !user) {
      handleRedirect();
    }
  }, [user, loading, handleRedirect]);

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

          {/* 🚀 NEW: Save Banner */}
          {hasUnsavedChanges && (
            <div className="mt-4 p-4 bg-amber-900/20 border border-amber-500/30 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                  <span className="text-amber-400 font-medium">
                    You have unsaved changes
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={handleDiscardChanges}
                    variant="ghost"
                    size="sm"
                    className="text-slate-400 hover:text-white"
                  >
                    Discard
                  </Button>
                  <Button
                    onClick={handleSaveSettings}
                    disabled={isSaving}
                    size="sm"
                    className="bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    {isSaving ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* 🚀 NEW: Last Saved Indicator */}
          {lastSaved && !hasUnsavedChanges && (
            <div className="mt-4 p-3 bg-emerald-900/20 border border-emerald-500/30 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                <span className="text-emerald-400 text-sm">
                  Settings saved at {lastSaved.toLocaleTimeString()}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {/* Notification Settings - SIMPLIFIED */}
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg text-white flex items-center">
                <Bell className="h-5 w-5 mr-2 text-blue-400" />
                {t("settings.notifications")}
                {settingsSaving && (
                  <RefreshCw className="h-4 w-4 ml-2 animate-spin text-slate-400" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 🚀 IMPROVED: Email Alerts with Clear Toggle */}
              <ClearToggle
                id="email-alerts"
                label="Email Alerts"
                description="Get notified about high-scoring signals via email"
                checked={localEmailEnabled}
                onCheckedChange={handleEmailToggle}
                disabled={settingsLoading || settingsSaving}
                icon={Mail}
              />

              {/* REAL TelegramConnection component - shows 80% threshold automatically */}
              <TelegramConnection />

              {/* REMOVED: Push Notifications - too complex, email + Telegram is enough */}

              {/* REMOVED: Digest frequency dropdown - too complex */}
            </CardContent>
          </Card>

          {/* 🚀 NEW: Signal Generation Settings - ULTRA SIMPLE with Clear Toggles */}
          <Card
            ref={signalGenerationRef}
            id="signal-generation"
            className="bg-slate-800/50 backdrop-blur-sm border-slate-700"
          >
            <CardHeader>
              <CardTitle className="text-lg text-white flex items-center">
                <SettingsIcon className="h-5 w-5 mr-2 text-purple-400" />
                Signal Generation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 🚀 IMPROVED: Auto-Generation Toggle with Clear State */}
              <ClearToggle
                id="auto-generation"
                label="Auto-Generation"
                description="Automatically generate fresh signals on schedule"
                checked={localAutoGenConfig.enabled}
                onCheckedChange={handleAutoGenToggle}
                icon={Timer}
              />

              {/* Interval Selection */}
              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-600 bg-slate-700/30">
                <div className="flex items-center space-x-3">
                  <Clock className="h-4 w-4 text-slate-400" />
                  <Label className="text-slate-300 font-medium">
                    Generation Interval
                  </Label>
                </div>
                <Select
                  value={localAutoGenConfig.intervalHours.toString()}
                  onValueChange={handleIntervalChange}
                >
                  <SelectTrigger className="w-32 bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="4">Every 4 hours</SelectItem>
                    <SelectItem value="8">Every 8 hours</SelectItem>
                    <SelectItem value="12">Every 12 hours</SelectItem>
                    <SelectItem value="24">Daily</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 🚀 IMPROVED: Market Hours Toggle with Clear State */}
              <ClearToggle
                id="market-hours"
                label="Market Hours Only"
                description="Generate signals only during trading hours"
                checked={localAutoGenConfig.marketHoursOnly}
                onCheckedChange={handleMarketHoursToggle}
              />

              {/* Status Display */}
              {localAutoGenConfig.enabled && (
                <div className="mt-4 p-3 bg-slate-700/30 rounded-lg border border-slate-600">
                  <div className="text-xs text-slate-400 space-y-1">
                    <div className="flex justify-between">
                      <span>Market Status:</span>
                      <span
                        className={
                          isMarketHours ? "text-emerald-400" : "text-red-400"
                        }
                      >
                        {isMarketHours ? "🟢 Open" : "🔴 Closed"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Next Generation:</span>
                      <span className="text-slate-300">
                        {timeUntilNext || "Not scheduled"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className="text-emerald-400">✅ Active</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 🚀 NEW: Save Button for Signal Generation */}
              {hasUnsavedChanges && (
                <div className="pt-4 border-t border-slate-600">
                  <div className="flex justify-end space-x-2">
                    <Button
                      onClick={handleDiscardChanges}
                      variant="outline"
                      size="sm"
                      className="border-slate-600 text-slate-400 hover:bg-slate-700"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveSettings}
                      disabled={isSaving}
                      size="sm"
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      {isSaving ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      {isSaving ? "Saving..." : "Save Settings"}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* REMOVED: Language & Locale section - user has header dropdown already */}

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
                onClick={handleChangePasswordClick}
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

        {/* Change Password Modal */}
        <ChangePasswordModal
          isOpen={showPasswordModal}
          onClose={handleClosePasswordModal}
        />
      </div>
    </Layout>
  );
});

// Set display name for debugging
Settings.displayName = "Settings";

export default Settings;
