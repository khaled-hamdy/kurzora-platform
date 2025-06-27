// src/hooks/useUserAlertSettings.ts
// Production hook for managing user alert settings, Telegram connection, and Email alerts
// 🚀 PRODUCTION: Complete CRUD operations with subscription validation

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

export interface UserAlertSettings {
  id: string;
  user_id: string;
  min_signal_score: number;
  max_alerts_per_day: number;
  trading_hours_only: boolean;
  email_enabled: boolean;
  telegram_enabled: boolean;
  telegram_chat_id: string | null;
  push_enabled: boolean;
  quiet_hours_start: string | null;
  quiet_hours_end: string | null;
  timezone: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  subscription_tier: "starter" | "professional" | "elite";
  subscription_status: "trial" | "active" | "cancelled";
}

interface UseUserAlertSettingsReturn {
  // Data state
  alertSettings: UserAlertSettings | null;
  userProfile: UserProfile | null;

  // Loading states
  loading: boolean;
  saving: boolean;

  // Error states
  error: string | null;

  // Computed states - Telegram
  canUseTelegram: boolean;
  isConnected: boolean;
  canReceiveAlerts: boolean;

  // Computed states - Email
  canUseEmail: boolean;
  isEmailEnabled: boolean;
  canReceiveEmailAlerts: boolean;

  // Actions - General
  updateSettings: (updates: Partial<UserAlertSettings>) => Promise<boolean>;
  refreshSettings: () => Promise<void>;

  // Actions - Telegram
  enableTelegramAlerts: () => Promise<boolean>;
  disableTelegramAlerts: () => Promise<boolean>;
  updateTelegramChatId: (chatId: string) => Promise<boolean>;

  // Actions - Email
  enableEmailAlerts: () => Promise<boolean>;
  disableEmailAlerts: () => Promise<boolean>;

  // Stats
  getAlertStats: () => Promise<any>;
  getEmailStats: () => Promise<any>;
}

export function useUserAlertSettings(): UseUserAlertSettingsReturn {
  const { user } = useAuth();
  const [alertSettings, setAlertSettings] = useState<UserAlertSettings | null>(
    null
  );
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user alert settings and profile
  const fetchData = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setError(null);

      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error("Error fetching user profile:", profileError);
        // Create user profile if it doesn't exist
        const { data: newProfile, error: createError } = await supabase
          .from("users")
          .insert({
            id: user.id,
            email: user.email || "",
            name: user.user_metadata?.name || "User",
            subscription_tier: "starter",
            subscription_status: "trial",
          })
          .select()
          .single();

        if (createError) {
          throw new Error(
            `Failed to create user profile: ${createError.message}`
          );
        }
        setUserProfile(newProfile);
      } else {
        setUserProfile(profile);
      }

      // Fetch alert settings
      let { data: settings, error: settingsError } = await supabase
        .from("user_alert_settings")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (settingsError && settingsError.code === "PGRST116") {
        // Settings don't exist, create default ones
        console.log("Creating default alert settings for user");
        const { data: newSettings, error: createError } = await supabase
          .from("user_alert_settings")
          .insert({
            user_id: user.id,
            min_signal_score: 80,
            max_alerts_per_day: 10,
            trading_hours_only: true,
            email_enabled: true,
            telegram_enabled: false,
            telegram_chat_id: null,
            push_enabled: true,
            timezone: "UTC",
          })
          .select()
          .single();

        if (createError) {
          throw new Error(
            `Failed to create alert settings: ${createError.message}`
          );
        }
        settings = newSettings;
      } else if (settingsError) {
        throw new Error(
          `Failed to fetch alert settings: ${settingsError.message}`
        );
      }

      setAlertSettings(settings);
      console.log("✅ Alert settings loaded:", {
        email_enabled: settings?.email_enabled,
        telegram_enabled: settings?.telegram_enabled,
        telegram_chat_id: settings?.telegram_chat_id,
        user_subscription: profile?.subscription_tier,
      });
    } catch (err) {
      console.error("Error loading user data:", err);
      setError(err instanceof Error ? err.message : "Failed to load user data");
    } finally {
      setLoading(false);
    }
  };

  // Update alert settings
  const updateSettings = async (
    updates: Partial<UserAlertSettings>
  ): Promise<boolean> => {
    if (!user?.id || !alertSettings) {
      setError("User not authenticated or settings not loaded");
      return false;
    }

    try {
      setSaving(true);
      setError(null);

      const { data, error } = await supabase
        .from("user_alert_settings")
        .update(updates)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update settings: ${error.message}`);
      }

      setAlertSettings(data);
      console.log("✅ Settings updated successfully");
      return true;
    } catch (err) {
      console.error("Error updating settings:", err);
      setError(
        err instanceof Error ? err.message : "Failed to update settings"
      );
      return false;
    } finally {
      setSaving(false);
    }
  };

  // TELEGRAM FUNCTIONS (existing)
  // Enable Telegram alerts
  const enableTelegramAlerts = async (): Promise<boolean> => {
    return await updateSettings({ telegram_enabled: true });
  };

  // Disable Telegram alerts
  const disableTelegramAlerts = async (): Promise<boolean> => {
    return await updateSettings({
      telegram_enabled: false,
      telegram_chat_id: null,
    });
  };

  // Update Telegram chat ID
  const updateTelegramChatId = async (chatId: string): Promise<boolean> => {
    const success = await updateSettings({
      telegram_chat_id: chatId,
      telegram_enabled: true,
    });

    if (success) {
      console.log(`✅ Telegram chat ID updated: ${chatId}`);
    }

    return success;
  };

  // EMAIL FUNCTIONS (new - following Telegram pattern)
  // Enable Email alerts
  const enableEmailAlerts = async (): Promise<boolean> => {
    const success = await updateSettings({ email_enabled: true });

    if (success) {
      console.log("✅ Email alerts enabled");
    }

    return success;
  };

  // Disable Email alerts
  const disableEmailAlerts = async (): Promise<boolean> => {
    const success = await updateSettings({ email_enabled: false });

    if (success) {
      console.log("✅ Email alerts disabled");
    }

    return success;
  };

  // Refresh data
  const refreshSettings = async (): Promise<void> => {
    setLoading(true);
    await fetchData();
  };

  // Get Telegram alert statistics (existing)
  const getAlertStats = async () => {
    if (!user?.id) return null;

    try {
      const { data, error } = await supabase
        .from("alert_delivery_log")
        .select("*")
        .eq("user_id", user.id)
        .eq("delivery_channel", "telegram")
        .gte(
          "created_at",
          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        );

      if (error) {
        console.error("Error fetching alert stats:", error);
        return null;
      }

      const totalAlerts = data.length;
      const successfulAlerts = data.filter(
        (log) => log.delivery_status === "delivered"
      ).length;
      const failedAlerts = data.filter(
        (log) => log.delivery_status === "failed"
      ).length;

      return {
        total_alerts_7_days: totalAlerts,
        successful_alerts: successfulAlerts,
        failed_alerts: failedAlerts,
        success_rate:
          totalAlerts > 0 ? (successfulAlerts / totalAlerts) * 100 : 0,
      };
    } catch (error) {
      console.error("Error calculating alert stats:", error);
      return null;
    }
  };

  // Get Email alert statistics (new - following Telegram pattern)
  const getEmailStats = async () => {
    if (!user?.id) return null;

    try {
      const { data, error } = await supabase
        .from("alert_delivery_log")
        .select("*")
        .eq("user_id", user.id)
        .eq("delivery_channel", "email")
        .gte(
          "created_at",
          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        );

      if (error) {
        console.error("Error fetching email stats:", error);
        return null;
      }

      const totalAlerts = data.length;
      const successfulAlerts = data.filter(
        (log) => log.delivery_status === "delivered"
      ).length;
      const failedAlerts = data.filter(
        (log) => log.delivery_status === "failed"
      ).length;

      return {
        total_alerts_7_days: totalAlerts,
        successful_alerts: successfulAlerts,
        failed_alerts: failedAlerts,
        success_rate:
          totalAlerts > 0 ? (successfulAlerts / totalAlerts) * 100 : 0,
      };
    } catch (error) {
      console.error("Error calculating email stats:", error);
      return null;
    }
  };

  // COMPUTED PROPERTIES

  // Telegram computed properties (existing)
  const canUseTelegram =
    userProfile?.subscription_tier === "professional" ||
    userProfile?.subscription_tier === "elite";
  const isConnected = Boolean(
    alertSettings?.telegram_enabled && alertSettings?.telegram_chat_id
  );
  const canReceiveAlerts =
    canUseTelegram &&
    isConnected &&
    userProfile?.subscription_status === "active";

  // Email computed properties (new - simpler than Telegram)
  const canUseEmail = true; // Email available to all users (unlike Telegram which needs Professional)
  const isEmailEnabled = Boolean(alertSettings?.email_enabled);
  const canReceiveEmailAlerts =
    canUseEmail &&
    isEmailEnabled &&
    Boolean(userProfile?.email) && // User must have valid email address
    userProfile?.subscription_status === "active";

  // Load data on mount and user change
  useEffect(() => {
    if (user?.id) {
      fetchData();
    } else {
      setLoading(false);
      setAlertSettings(null);
      setUserProfile(null);
    }
  }, [user?.id]);

  return {
    // Data state
    alertSettings,
    userProfile,

    // Loading states
    loading,
    saving,

    // Error states
    error,

    // Computed states - Telegram
    canUseTelegram,
    isConnected,
    canReceiveAlerts,

    // Computed states - Email
    canUseEmail,
    isEmailEnabled,
    canReceiveEmailAlerts,

    // Actions - General
    updateSettings,
    refreshSettings,

    // Actions - Telegram
    enableTelegramAlerts,
    disableTelegramAlerts,
    updateTelegramChatId,

    // Actions - Email
    enableEmailAlerts,
    disableEmailAlerts,

    // Stats
    getAlertStats,
    getEmailStats,
  };
}
