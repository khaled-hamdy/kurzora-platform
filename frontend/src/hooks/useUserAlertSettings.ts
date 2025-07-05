// src/hooks/useUserAlertSettings.ts
// FIXED: Production hook for managing user alert settings with ACTUAL database schema
// 🔧 CORRECTED: Uses users table with notification_settings JSONB (matches Edge Function)
// 🚀 FIXED: Permanent solution for Telegram + Email settings

import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

export interface UserAlertSettings {
  // These come from users.notification_settings JSONB field
  minimum_score?: number;
  daily_alert_limit?: number;
  email_alerts_enabled?: boolean;
  telegram_alerts_enabled?: boolean;
  trading_hours_only?: boolean;
  quiet_hours_start?: string | null;
  quiet_hours_end?: string | null;
  timezone?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  subscription_tier: "starter" | "professional" | "elite";
  subscription_status: "trial" | "active" | "cancelled";
  notification_settings: UserAlertSettings;
  telegram_chat_id: string | null;
  daily_alerts_sent: number;
  last_alert_date: string | null;
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

  // 🔧 FIXED: Fetch user data from users table (matches Edge Function)
  const fetchData = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setError(null);
      console.log("🔍 FIXED: Fetching user data from users table...");

      // 🔧 FIXED: Query users table directly (same as Edge Function)
      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select(
          `
          id,
          email,
          name,
          subscription_tier,
          subscription_status,
          notification_settings,
          telegram_chat_id,
          daily_alerts_sent,
          last_alert_date,
          is_active
        `
        )
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error("❌ Error fetching user profile:", profileError);
        throw new Error(
          `Failed to fetch user profile: ${profileError.message}`
        );
      }

      console.log("✅ FIXED: User data loaded from users table:", {
        email: profile.email,
        subscription_tier: profile.subscription_tier,
        telegram_chat_id: profile.telegram_chat_id,
        notification_settings: profile.notification_settings,
      });

      setUserProfile(profile);

      // 🔧 FIXED: Extract notification_settings from the JSONB field
      const settings = profile.notification_settings || {};

      // 🔧 FIXED: Set default values if missing
      const defaultSettings: UserAlertSettings = {
        minimum_score: 65,
        daily_alert_limit: profile.subscription_tier === "starter" ? 3 : null,
        email_alerts_enabled: true,
        telegram_alerts_enabled: false,
        trading_hours_only: true,
        timezone: "UTC",
        ...settings, // Override with existing settings
      };

      setAlertSettings(defaultSettings);

      console.log("✅ FIXED: Alert settings processed:", defaultSettings);
    } catch (err) {
      console.error("❌ Error loading user data:", err);
      setError(err instanceof Error ? err.message : "Failed to load user data");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // 🔧 FIXED: Update settings in users.notification_settings JSONB field
  const updateSettings = useCallback(
    async (updates: Partial<UserAlertSettings>): Promise<boolean> => {
      if (!user?.id || !alertSettings) {
        setError("User not authenticated or settings not loaded");
        return false;
      }

      try {
        setSaving(true);
        setError(null);

        console.log("🔧 FIXED: Updating notification_settings with:", updates);

        // 🔧 FIXED: Merge with existing settings
        const updatedSettings = {
          ...alertSettings,
          ...updates,
        };

        // 🔧 FIXED: Update users table notification_settings JSONB field
        const { data, error } = await supabase
          .from("users")
          .update({
            notification_settings: updatedSettings,
            updated_at: new Date().toISOString(),
          })
          .eq("id", user.id)
          .select(
            `
            id,
            email,
            name,
            subscription_tier,
            subscription_status,
            notification_settings,
            telegram_chat_id,
            daily_alerts_sent,
            last_alert_date
          `
          )
          .single();

        if (error) {
          throw new Error(`Failed to update settings: ${error.message}`);
        }

        console.log("✅ FIXED: Settings updated successfully in users table");

        // Update local state
        setUserProfile(data);
        setAlertSettings(data.notification_settings || {});

        return true;
      } catch (err) {
        console.error("❌ Error updating settings:", err);
        setError(
          err instanceof Error ? err.message : "Failed to update settings"
        );
        return false;
      } finally {
        setSaving(false);
      }
    },
    [user?.id, alertSettings]
  );

  // 🔧 FIXED: Update telegram_chat_id in users table + notification_settings
  const updateTelegramChatId = useCallback(
    async (chatId: string): Promise<boolean> => {
      if (!user?.id || !alertSettings) {
        setError("User not authenticated or settings not loaded");
        return false;
      }

      try {
        setSaving(true);
        setError(null);

        console.log(
          "🔧 FIXED: Updating Telegram chat ID and enabling alerts:",
          chatId
        );

        // 🔧 FIXED: Update both telegram_chat_id field AND notification_settings
        const updatedSettings = {
          ...alertSettings,
          telegram_alerts_enabled: true,
        };

        const { data, error } = await supabase
          .from("users")
          .update({
            telegram_chat_id: chatId,
            notification_settings: updatedSettings,
            updated_at: new Date().toISOString(),
          })
          .eq("id", user.id)
          .select(
            `
            id,
            email,
            name,
            subscription_tier,
            subscription_status,
            notification_settings,
            telegram_chat_id,
            daily_alerts_sent,
            last_alert_date
          `
          )
          .single();

        if (error) {
          throw new Error(
            `Failed to update Telegram settings: ${error.message}`
          );
        }

        console.log("✅ FIXED: Telegram chat ID updated successfully:", {
          chat_id: data.telegram_chat_id,
          telegram_enabled: data.notification_settings?.telegram_alerts_enabled,
        });

        // Update local state
        setUserProfile(data);
        setAlertSettings(data.notification_settings || {});

        return true;
      } catch (err) {
        console.error("❌ Error updating Telegram chat ID:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to update Telegram settings"
        );
        return false;
      } finally {
        setSaving(false);
      }
    },
    [user?.id, alertSettings]
  );

  // 🔧 FIXED: Disable Telegram (clear chat_id + disable in settings)
  const disableTelegramAlerts = useCallback(async (): Promise<boolean> => {
    if (!user?.id || !alertSettings) {
      setError("User not authenticated or settings not loaded");
      return false;
    }

    try {
      setSaving(true);
      setError(null);

      console.log("🔧 FIXED: Disabling Telegram alerts");

      // 🔧 FIXED: Clear telegram_chat_id AND disable in notification_settings
      const updatedSettings = {
        ...alertSettings,
        telegram_alerts_enabled: false,
      };

      const { data, error } = await supabase
        .from("users")
        .update({
          telegram_chat_id: null,
          notification_settings: updatedSettings,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)
        .select(
          `
          id,
          email,
          name,
          subscription_tier,
          subscription_status,
          notification_settings,
          telegram_chat_id,
          daily_alerts_sent,
          last_alert_date
        `
        )
        .single();

      if (error) {
        throw new Error(`Failed to disable Telegram: ${error.message}`);
      }

      console.log("✅ FIXED: Telegram alerts disabled successfully");

      // Update local state
      setUserProfile(data);
      setAlertSettings(data.notification_settings || {});

      return true;
    } catch (err) {
      console.error("❌ Error disabling Telegram alerts:", err);
      setError(
        err instanceof Error ? err.message : "Failed to disable Telegram"
      );
      return false;
    } finally {
      setSaving(false);
    }
  }, [user?.id, alertSettings]);

  // 🔧 FIXED: Enable Telegram alerts
  const enableTelegramAlerts = useCallback(async (): Promise<boolean> => {
    return await updateSettings({ telegram_alerts_enabled: true });
  }, [updateSettings]);

  // 🔧 FIXED: Email functions
  const enableEmailAlerts = useCallback(async (): Promise<boolean> => {
    const success = await updateSettings({ email_alerts_enabled: true });
    if (success) {
      console.log("✅ FIXED: Email alerts enabled");
    }
    return success;
  }, [updateSettings]);

  const disableEmailAlerts = useCallback(async (): Promise<boolean> => {
    const success = await updateSettings({ email_alerts_enabled: false });
    if (success) {
      console.log("✅ FIXED: Email alerts disabled");
    }
    return success;
  }, [updateSettings]);

  // 🔧 FIXED: Refresh data
  const refreshSettings = useCallback(async (): Promise<void> => {
    setLoading(true);
    await fetchData();
  }, [fetchData]);

  // 🔧 FIXED: Get alert statistics (simplified for now)
  const getAlertStats = useCallback(async () => {
    if (!user?.id) return null;

    // 🔧 FIXED: Return simplified stats for now
    return {
      total_alerts_7_days: 0,
      successful_alerts: 0,
      failed_alerts: 0,
      success_rate: 0,
    };
  }, [user?.id]);

  const getEmailStats = useCallback(async () => {
    if (!user?.id) return null;

    // 🔧 FIXED: Return simplified stats for now
    return {
      total_alerts_7_days: 0,
      successful_alerts: 0,
      failed_alerts: 0,
      success_rate: 0,
    };
  }, [user?.id]);

  // 🔧 FIXED: COMPUTED PROPERTIES using actual data structure
  const computedProperties = useMemo(() => {
    // Telegram computed properties
    const canUseTelegram =
      userProfile?.subscription_tier === "professional" ||
      userProfile?.subscription_tier === "elite";

    const isConnected = Boolean(
      alertSettings?.telegram_alerts_enabled && userProfile?.telegram_chat_id
    );

    const canReceiveAlerts = canUseTelegram && isConnected;

    // Email computed properties
    const canUseEmail = true; // Email available to all users
    const isEmailEnabled = Boolean(
      alertSettings?.email_alerts_enabled !== false
    ); // Default true
    const canReceiveEmailAlerts =
      canUseEmail && isEmailEnabled && Boolean(userProfile?.email);

    console.log("🔍 FIXED: Computed properties:", {
      canUseTelegram,
      isConnected,
      canReceiveAlerts,
      telegram_chat_id: userProfile?.telegram_chat_id,
      telegram_alerts_enabled: alertSettings?.telegram_alerts_enabled,
      subscription_tier: userProfile?.subscription_tier,
    });

    return {
      canUseTelegram,
      isConnected,
      canReceiveAlerts,
      canUseEmail,
      isEmailEnabled,
      canReceiveEmailAlerts,
    };
  }, [userProfile, alertSettings]);

  // Load data on mount and user change
  useEffect(() => {
    if (user?.id) {
      fetchData();
    } else {
      setLoading(false);
      setAlertSettings(null);
      setUserProfile(null);
    }
  }, [user?.id, fetchData]);

  // 🔧 FIXED: Return object matching interface
  return useMemo(
    () => ({
      // Data state
      alertSettings,
      userProfile,

      // Loading states
      loading,
      saving,

      // Error states
      error,

      // Computed states - Telegram
      canUseTelegram: computedProperties.canUseTelegram,
      isConnected: computedProperties.isConnected,
      canReceiveAlerts: computedProperties.canReceiveAlerts,

      // Computed states - Email
      canUseEmail: computedProperties.canUseEmail,
      isEmailEnabled: computedProperties.isEmailEnabled,
      canReceiveEmailAlerts: computedProperties.canReceiveEmailAlerts,

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
    }),
    [
      alertSettings,
      userProfile,
      loading,
      saving,
      error,
      computedProperties,
      updateSettings,
      refreshSettings,
      enableTelegramAlerts,
      disableTelegramAlerts,
      updateTelegramChatId,
      enableEmailAlerts,
      disableEmailAlerts,
      getAlertStats,
      getEmailStats,
    ]
  );
}
