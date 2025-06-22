// src/hooks/useUserAlertSettings.ts

import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

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

export interface TelegramConnectionStatus {
  isConnected: boolean;
  chatId: string | null;
  alertsEnabled: boolean;
  canReceiveAlerts: boolean; // connected AND enabled AND professional tier
}

export const useUserAlertSettings = () => {
  const { userProfile, loading: authLoading } = useAuth();
  const [alertSettings, setAlertSettings] = useState<UserAlertSettings | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch alert settings from database
  const fetchAlertSettings = async (userId: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("user_alert_settings")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (fetchError) {
        if (fetchError.code === "PGRST116") {
          // No settings found, create default settings
          const defaultSettings = {
            user_id: userId,
            min_signal_score: 80,
            max_alerts_per_day: 10,
            trading_hours_only: true,
            email_enabled: true,
            telegram_enabled: false,
            telegram_chat_id: null,
            push_enabled: true,
            quiet_hours_start: null,
            quiet_hours_end: null,
            timezone: "UTC",
          };

          const { data: newData, error: createError } = await supabase
            .from("user_alert_settings")
            .insert(defaultSettings)
            .select()
            .single();

          if (createError) throw createError;
          setAlertSettings(newData);
        } else {
          throw fetchError;
        }
      } else {
        setAlertSettings(data);
      }
    } catch (err) {
      console.error("Error fetching alert settings:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch alert settings"
      );
    } finally {
      setLoading(false);
    }
  };

  // Update alert settings in database
  const updateAlertSettings = async (updates: Partial<UserAlertSettings>) => {
    if (!alertSettings || !userProfile)
      return { error: "No user or settings found" };

    try {
      const { data, error: updateError } = await supabase
        .from("user_alert_settings")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userProfile.id)
        .select()
        .single();

      if (updateError) throw updateError;

      setAlertSettings(data);
      return { data, error: null };
    } catch (err) {
      console.error("Error updating alert settings:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update settings";
      setError(errorMessage);
      return { error: errorMessage, data: null };
    }
  };

  // Connect Telegram account
  const connectTelegram = async (chatId: string) => {
    return await updateAlertSettings({
      telegram_chat_id: chatId,
      telegram_enabled: true,
    });
  };

  // Disconnect Telegram account
  const disconnectTelegram = async () => {
    return await updateAlertSettings({
      telegram_chat_id: null,
      telegram_enabled: false,
    });
  };

  // Toggle telegram alerts
  const toggleTelegramAlerts = async (enabled: boolean) => {
    return await updateAlertSettings({
      telegram_enabled: enabled,
    });
  };

  // Update signal score threshold
  const updateSignalThreshold = async (minScore: number) => {
    return await updateAlertSettings({
      min_signal_score: minScore,
    });
  };

  // Update daily alert limit
  const updateDailyLimit = async (maxAlerts: number) => {
    return await updateAlertSettings({
      max_alerts_per_day: maxAlerts,
    });
  };

  // Fetch settings when user changes
  useEffect(() => {
    if (userProfile?.id && !authLoading) {
      fetchAlertSettings(userProfile.id);
    }
  }, [userProfile?.id, authLoading]);

  // Calculate telegram connection status
  const telegramStatus: TelegramConnectionStatus = useMemo(() => {
    const isConnected = !!(
      alertSettings?.telegram_enabled && alertSettings?.telegram_chat_id
    );
    const chatId = alertSettings?.telegram_chat_id || null;
    const alertsEnabled = alertSettings?.telegram_enabled || false;

    // Check if user can receive alerts (must be professional tier)
    const canReceiveAlerts =
      isConnected &&
      alertsEnabled &&
      (userProfile?.subscription_tier === "professional" ||
        userProfile?.subscription_status === "trial");

    return {
      isConnected,
      chatId,
      alertsEnabled,
      canReceiveAlerts,
    };
  }, [alertSettings, userProfile]);

  // Get effective chat ID for alerts (user's or fallback)
  const getEffectiveChatId = (): string => {
    if (telegramStatus.canReceiveAlerts && telegramStatus.chatId) {
      return telegramStatus.chatId;
    }
    // Fallback to admin chat ID
    return "1390805707";
  };

  return {
    // Data
    alertSettings,
    telegramStatus,
    loading: loading || authLoading,
    error,

    // Telegram functions
    connectTelegram,
    disconnectTelegram,
    toggleTelegramAlerts,
    getEffectiveChatId,

    // General settings functions
    updateAlertSettings,
    updateSignalThreshold,
    updateDailyLimit,

    // Convenience getters
    minSignalScore: alertSettings?.min_signal_score || 80,
    maxAlertsPerDay: alertSettings?.max_alerts_per_day || 10,
    emailEnabled: alertSettings?.email_enabled || true,
    telegramEnabled: alertSettings?.telegram_enabled || false,
    telegramChatId: alertSettings?.telegram_chat_id || null,
    tradingHoursOnly: alertSettings?.trading_hours_only || true,

    // Refresh function
    refresh: () => userProfile?.id && fetchAlertSettings(userProfile.id),
  };
};

// Convenience hook for checking if user can receive telegram alerts
export const useCanReceiveTelegramAlerts = (): boolean => {
  const { telegramStatus } = useUserAlertSettings();
  return telegramStatus.canReceiveAlerts;
};

// Convenience hook for getting the effective chat ID for alerts
export const useEffectiveTelegramChatId = (): string => {
  const { getEffectiveChatId } = useUserAlertSettings();
  return getEffectiveChatId();
};
