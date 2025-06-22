// src/components/telegram/TelegramAlertBanner.tsx
import React from "react";
import { useSubscriptionTier } from "../../hooks/useSubscriptionTier";
import { useUserAlertSettings } from "../../hooks/useUserAlertSettings";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Send, Crown, Settings, CheckCircle, AlertCircle } from "lucide-react";

// Telegram Alert Banner Component (shows in Signals page)
export const TelegramAlertBanner: React.FC = () => {
  const subscription = useSubscriptionTier();
  const { telegramStatus, getEffectiveChatId, loading } =
    useUserAlertSettings();

  if (!subscription || loading) return null;

  // Professional users - show connection status and test button
  if (subscription.limits.canAccessTelegramPremium) {
    const isConnected = telegramStatus.isConnected;
    const canReceiveAlerts = telegramStatus.canReceiveAlerts;

    return (
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Send className="h-6 w-6 text-blue-400" />
              {isConnected && (
                <CheckCircle className="absolute -top-1 -right-1 h-3 w-3 text-green-400" />
              )}
            </div>
            <div>
              <h3 className="text-blue-400 font-semibold flex items-center">
                <Crown className="h-4 w-4 mr-2" />
                {isConnected
                  ? "Telegram Alerts Connected"
                  : "Telegram Alerts Available"}
              </h3>
              <p className="text-white text-sm">
                {isConnected
                  ? "You'll receive instant notifications for high-score signals (≥80%)"
                  : "Connect your Telegram to receive instant notifications"}
              </p>
              {isConnected && (
                <div className="flex items-center mt-1 space-x-2">
                  <Badge className="bg-green-600/20 border border-green-500/30 text-green-400 text-xs">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Connected
                  </Badge>
                  <span className="text-xs text-gray-400">
                    Chat ID: {telegramStatus.chatId?.slice(-6)}***
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="flex space-x-2">
            {isConnected && (
              <Button
                size="sm"
                variant="outline"
                className="border-green-500 text-green-400 hover:bg-green-600/10"
                onClick={async () => {
                  // Manual test trigger using real user data
                  const WEBHOOK_URL =
                    "https://hook.eu2.make.com/oatde944l0b32nq3ffxavgtficplfk";

                  const effectiveChatId = getEffectiveChatId();

                  try {
                    const response = await fetch(WEBHOOK_URL, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        signal: {
                          symbol: "TEST",
                          final_score: 89,
                          strength: "Strong",
                        },
                        user: {
                          telegram_chat_id: effectiveChatId,
                          email:
                            subscription.tier === "professional"
                              ? "professional"
                              : "admin",
                        },
                        alert_type: "manual_test",
                      }),
                    });

                    if (response.ok) {
                      console.log(
                        "🚨 Test alert sent successfully to:",
                        effectiveChatId
                      );
                    } else {
                      console.error(
                        "❌ Test alert failed:",
                        response.statusText
                      );
                    }
                  } catch (error) {
                    console.error("❌ Test alert error:", error);
                  }
                }}
              >
                <Send className="h-4 w-4 mr-2" />
                Test Alert
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              className="border-blue-500 text-blue-400 hover:bg-blue-600/10"
              onClick={() => {
                if (isConnected) {
                  // TODO: Navigate to Telegram settings page
                  console.log("Navigate to Telegram settings");
                } else {
                  // Show connection instructions
                  alert(`🔗 Connect Your Telegram Account

Step 1: Open Telegram app on your phone
Step 2: Search for: @kurzora_alert_bot
Step 3: Send this message: /start
Step 4: Send your email: ${
                    subscription?.tier === "professional"
                      ? "pro@kurzora.com"
                      : "your@email.com"
                  }
Step 5: The bot will confirm your connection

🎯 You'll then receive instant alerts for signals ≥80%!`);
                }
              }}
            >
              <Settings className="h-4 w-4 mr-2" />
              {isConnected ? "Settings" : "Connect"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Starter users - show upgrade prompt
  return (
    <div className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-blue-500/30 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Send className="h-6 w-6 text-blue-400" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full animate-pulse"></div>
          </div>
          <div>
            <h3 className="text-blue-400 font-semibold flex items-center">
              🚨 Instant Telegram Alerts
              <Badge className="bg-amber-600 text-white text-xs ml-2">
                PRO ONLY
              </Badge>
            </h3>
            <p className="text-white text-sm">
              Get notified the moment high-confidence signals appear (≥80%
              score)
            </p>
          </div>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2">
          <Crown className="h-4 w-4 mr-2" />
          Upgrade for Alerts
        </Button>
      </div>
    </div>
  );
};

// Signal Card Telegram Indicator (shows on each signal)
export const SignalTelegramIndicator: React.FC<{
  signalScore: number;
  ticker: string;
}> = ({ signalScore, ticker }) => {
  const subscription = useSubscriptionTier();
  const { telegramStatus, minSignalScore } = useUserAlertSettings();

  if (!subscription) return null;

  // Only show for signals that meet the user's threshold
  if (signalScore < minSignalScore) return null;

  // Professional users - show alert status
  if (subscription.limits.canAccessTelegramPremium) {
    const willReceiveAlert = telegramStatus.canReceiveAlerts;

    return (
      <div className="mt-2 flex items-center space-x-2">
        <Badge
          className={`text-xs ${
            willReceiveAlert
              ? "bg-blue-600/20 border border-blue-500/30 text-blue-400"
              : "bg-orange-600/20 border border-orange-500/30 text-orange-400"
          }`}
        >
          <Send className="h-3 w-3 mr-1" />
          {willReceiveAlert ? "Alert Sent" : "Connect Telegram"}
        </Badge>
        {!willReceiveAlert && (
          <span className="text-xs text-gray-400">Configure in settings</span>
        )}
      </div>
    );
  }

  // Starter users - show upgrade prompt
  return (
    <div className="mt-2 p-2 bg-blue-900/20 border border-blue-500/30 rounded">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Send className="h-4 w-4 text-blue-400" />
          <span className="text-blue-400 text-xs font-medium">
            High-Score Alert Available
          </span>
          <Crown className="h-3 w-3 text-amber-400" />
        </div>
        <Button
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1 h-6"
        >
          Get Alert
        </Button>
      </div>
    </div>
  );
};

// ✅ UPDATED: Webhook trigger function with new webhook URL
export const triggerTelegramAlert = async (
  signalData: any,
  userChatId?: string
) => {
  const WEBHOOK_URL =
    "https://hook.eu2.make.com/oatde944l0b32nq3ffxavgtficplfk";

  // Use provided chat ID or fallback to admin
  const chatId = userChatId || "1390805707";

  const payload = {
    signal: {
      symbol: signalData.ticker,
      final_score: signalData.finalScore,
      strength:
        signalData.finalScore >= 90
          ? "Very Strong"
          : signalData.finalScore >= 80
          ? "Strong"
          : "Moderate",
      timeframe: "1D",
      explanation: `${signalData.ticker} shows strong technical indicators with a confidence score of ${signalData.finalScore}/100.`,
    },
    user: {
      telegram_chat_id: chatId,
      subscription_tier: "professional",
      name: "Professional User",
    },
    alert_type: "high_score_signal",
  };

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      console.log(`✅ Telegram alert sent successfully to: ${chatId}`);
      return true;
    } else {
      console.error("❌ Failed to send Telegram alert");
      return false;
    }
  } catch (error) {
    console.error("❌ Error sending Telegram alert:", error);
    return false;
  }
};

// ✅ UPDATED: Auto-trigger function with dynamic user detection
export const autoTriggerTelegramAlert = async (
  signalData: any,
  userId?: string
) => {
  // This function should be called with the current user's ID
  // For now, we'll import the hook data here, but ideally this should be passed from the calling component

  try {
    // Create a temporary hook call to get user settings
    // Note: This is not ideal - in production, the alert settings should be passed as parameters
    const userSettings = await getUserAlertSettingsById(userId);

    if (!userSettings) {
      console.log("🔕 No user settings found, using admin fallback");
      return await triggerTelegramAlert(signalData, "1390805707");
    }

    // Check if signal meets user's threshold
    if (signalData.finalScore < userSettings.min_signal_score) {
      console.log(
        `🔕 Signal score ${signalData.finalScore}% below user threshold (${userSettings.min_signal_score}%)`
      );
      return false;
    }

    // Check if user can receive telegram alerts
    const canReceive =
      userSettings.telegram_enabled &&
      userSettings.telegram_chat_id &&
      (signalData.userSubscriptionTier === "professional" ||
        signalData.userSubscriptionStatus === "trial");

    if (canReceive) {
      console.log(
        `🚨 Triggering Telegram alert for ${signalData.ticker} (${signalData.finalScore}%) to user's phone`
      );
      return await triggerTelegramAlert(
        signalData,
        userSettings.telegram_chat_id
      );
    } else {
      console.log(
        `🚨 User not connected, sending to admin fallback for ${signalData.ticker} (${signalData.finalScore}%)`
      );
      return await triggerTelegramAlert(signalData, "1390805707");
    }
  } catch (error) {
    console.error("❌ Error in auto-trigger, using admin fallback:", error);
    return await triggerTelegramAlert(signalData, "1390805707");
  }
};

// Helper function to get user alert settings by ID (for use in auto-trigger)
const getUserAlertSettingsById = async (userId?: string) => {
  if (!userId) return null;

  try {
    const { supabase } = await import("@/lib/supabase");
    const { data, error } = await supabase
      .from("user_alert_settings")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error("Error fetching user alert settings:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error importing supabase or fetching settings:", error);
    return null;
  }
};
