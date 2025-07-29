import React, { useCallback, useState, useEffect } from "react";
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
import {
  Bell,
  Shield,
  Mail,
  RefreshCw,
  Save,
  CheckCircle,
  MessageSquare,
  Info,
} from "lucide-react";
import { useToast } from "../hooks/use-toast";

// Import the production-ready TelegramConnection component
import { TelegramConnection } from "../components/telegram";

// Import subscription tier hooks for conditional rendering
import {
  useSubscriptionTier,
  useSignalLimits,
} from "../hooks/useSubscriptionTier";

// Import the alert settings hook for email database integration
import { useUserAlertSettings } from "../hooks/useUserAlertSettings";

// Import the new ChangePasswordModal component
import { ChangePasswordModal } from "../components/ChangePasswordModal";

// 🚮 REMOVED: usePeriodicSignalGeneration import (Signal Generation section removed)

// 🚀 PRESERVED: Enhanced Toggle with Clear On/Off Labels
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
        {/* 🚀 PRESERVED: Clear On/Off Text Labels */}
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
  const { toast } = useToast();

  // 🚀 NEW: Get subscription tier for conditional Telegram rendering
  const subscription = useSubscriptionTier();
  const signalLimits = useSignalLimits();

  // 🚮 REMOVED: signalGenerationRef (Signal Generation section removed)

  // State for Change Password modal - PRESERVED
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // 🚀 PRESERVED: Save state management
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Get email settings from database (same pattern as Telegram) - PRESERVED
  const {
    alertSettings,
    loading: settingsLoading,
    saving: settingsSaving,
    updateSettings,
  } = useUserAlertSettings();

  // 🚮 REMOVED: usePeriodicSignalGeneration hook (Signal Generation section removed)

  // 🔧 FIELD NAME CONSISTENCY FIX: Use email_alerts_enabled to match Edge Function
  // Previously used email_enabled but Edge Function expects email_alerts_enabled
  // This ensures Settings toggle works with existing alert distribution system
  const [localEmailEnabled, setLocalEmailEnabled] = useState(
    alertSettings?.email_alerts_enabled ?? true
  );

  // 🚮 REMOVED: localAutoGenConfig state (Signal Generation section removed)

  // 🚮 REMOVED: scroll-to-section logic (Signal Generation section removed)

  // 🔧 FIELD NAME CONSISTENCY FIX: Track changes using email_alerts_enabled field
  // This matches the field name that Edge Function checks for email preferences
  useEffect(() => {
    const emailChanged =
      localEmailEnabled !== (alertSettings?.email_alerts_enabled ?? true);
    setHasUnsavedChanges(emailChanged);
  }, [localEmailEnabled, alertSettings]);

  // 🔧 FIELD NAME CONSISTENCY FIX: Sync local state using email_alerts_enabled field
  // Ensures Settings toggle displays correct state from database
  useEffect(() => {
    setLocalEmailEnabled(alertSettings?.email_alerts_enabled ?? true);
  }, [alertSettings]);

  // 🚮 REMOVED: useEffect for localAutoGenConfig (Signal Generation section removed)

  // 🔧 PRESERVED: Handle email toggle changes (local state only)
  const handleEmailToggle = useCallback((enabled: boolean) => {
    setLocalEmailEnabled(enabled);
  }, []);

  // 🚮 REMOVED: Auto-generation handlers (Signal Generation section removed)

  // 🔧 FIELD NAME CONSISTENCY FIX: Save using email_alerts_enabled field
  // This ensures the setting is saved with the field name Edge Function expects
  const handleSaveSettings = useCallback(async () => {
    setIsSaving(true);
    try {
      // Save email settings using consistent field name
      if (localEmailEnabled !== (alertSettings?.email_alerts_enabled ?? true)) {
        await updateSettings({ email_alerts_enabled: localEmailEnabled });
      }

      // 🚮 REMOVED: Auto-generation settings save logic

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
  }, [localEmailEnabled, alertSettings, updateSettings, toast]);

  // 🔧 FIELD NAME CONSISTENCY FIX: Discard changes using email_alerts_enabled field
  // Resets local state to match database value using consistent field naming
  const handleDiscardChanges = useCallback(() => {
    setLocalEmailEnabled(alertSettings?.email_alerts_enabled ?? true);
    setHasUnsavedChanges(false);
  }, [alertSettings]);

  // 🔧 PRESERVED: Navigation handler
  const handleRedirect = useCallback(() => {
    console.log("Settings page: User not authenticated, redirecting to home");
    navigate("/");
  }, [navigate]);

  // 🔧 PRESERVED: Change Password handler
  const handleChangePasswordClick = useCallback(() => {
    setShowPasswordModal(true);
  }, []);

  // 🔧 PRESERVED: Close modal handler
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

  // Show loading spinner while authentication state is being determined - PRESERVED
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

  // Show nothing if no user (will redirect via useEffect) - PRESERVED
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
            Customize your notification preferences and account security
          </p>

          {/* 🚀 PRESERVED: Save Banner */}
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

          {/* 🚀 PRESERVED: Last Saved Indicator */}
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
          {/* PRESERVED: Notification Settings - SIMPLIFIED */}
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
              {/* 🔧 FIELD NAME CONSISTENCY FIX: Email Alerts using correct field name */}
              {/* This toggle now works with Edge Function by using email_alerts_enabled field */}
              <ClearToggle
                id="email-alerts"
                label="Email Alerts"
                description="Get notified about high-scoring signals via email"
                checked={localEmailEnabled}
                onCheckedChange={handleEmailToggle}
                disabled={settingsLoading || settingsSaving}
                icon={Mail}
              />

              {/* 📝 SESSION #206: CONDITIONAL TELEGRAM SECTION BASED ON SUBSCRIPTION TIER */}
              {/* Professional users: Full TelegramConnection component */}
              {/* Starter users: Contextual disabled text following Session #205 UX strategy */}
              {signalLimits.canViewUnlimited ? (
                // Professional users get the full working TelegramConnection component
                <TelegramConnection />
              ) : (
                // Starter users get contextual text about Professional plan feature
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 mb-2">
                    <MessageSquare className="h-4 w-4 text-slate-400" />
                    <Label className="text-slate-300 font-medium">
                      🔔 Telegram Alerts
                    </Label>
                  </div>
                  <p className="text-sm text-slate-400 mb-3">
                    Get instant notifications for high-probability signals
                  </p>

                  {/* Disabled toggle for Starter users */}
                  <div className="flex items-center justify-between p-3 rounded-lg border border-slate-600 bg-slate-700/30 opacity-60">
                    <div className="flex items-center space-x-3">
                      <MessageSquare className="h-4 w-4 text-slate-400" />
                      <div>
                        <Label className="text-slate-300 font-medium">
                          Enable Telegram Alerts
                        </Label>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-xs font-medium text-slate-500">
                        OFF
                      </span>
                      <Switch checked={false} disabled={true} />
                    </div>
                  </div>

                  {/* Contextual Professional plan info - SESSION #206: Dead link removed */}
                  <div className="flex items-start space-x-2 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                    <Info className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-400">
                      ℹ️ Telegram alerts are available with Professional plan.
                    </div>
                  </div>
                </div>
              )}

              {/* PRESERVED: REMOVED: Push Notifications - too complex, email + Telegram is enough */}

              {/* PRESERVED: REMOVED: Digest frequency dropdown - too complex */}
            </CardContent>
          </Card>

          {/* 🚮 REMOVED: Signal Generation Settings Card - Entire section removed */}

          {/* PRESERVED: Security - SIMPLIFIED (removed 2FA and complex features) */}
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

          {/* PRESERVED: REMOVED: API & Auto-Trading section entirely - too complex */}
          {/* PRESERVED: REMOVED: UI & Data Preferences section entirely - user requested removal */}
        </div>

        {/* PRESERVED: Change Password Modal */}
        <ChangePasswordModal
          isOpen={showPasswordModal}
          onClose={handleClosePasswordModal}
        />
      </div>
    </Layout>
  );
});

// Set display name for debugging - PRESERVED
Settings.displayName = "Settings";

export default Settings;
