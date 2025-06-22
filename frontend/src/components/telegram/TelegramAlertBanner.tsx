// src/components/telegram/TelegramAlertBanner.tsx
import React from "react";
import { useSubscriptionTier } from "../../hooks/useSubscriptionTier";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Send, Crown, Settings } from "lucide-react";

// Telegram Alert Banner Component (shows in Signals page)
export const TelegramAlertBanner: React.FC = () => {
  const subscription = useSubscriptionTier();

  if (!subscription) return null;

  // Professional users - show connected status
  if (subscription.limits.canAccessTelegramPremium) {
    return (
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Send className="h-6 w-6 text-blue-400" />
            <div>
              <h3 className="text-blue-400 font-semibold flex items-center">
                <Crown className="h-4 w-4 mr-2" />
                Telegram Alerts Active
              </h3>
              <p className="text-white text-sm">
                You'll receive instant notifications for high-score signals
                (70%+)
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="border-green-500 text-green-400 hover:bg-green-600/10"
            onClick={async () => {
              // Manual test trigger
              const WEBHOOK_URL =
                "https://hook.eu2.make.com/eq4gio8f2ifal3hikm4yyag3962bspan";
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
                    user: { telegram_chat_id: "1390805707" },
                    alert_type: "manual_test",
                  }),
                });
                console.log("🚨 Test alert sent!", response.ok ? "✅" : "❌");
              } catch (error) {
                console.error("❌ Test alert failed:", error);
              }
            }}
          >
            <Send className="h-4 w-4 mr-2" />
            Test Alert
          </Button>
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
              Get notified the moment high-confidence signals appear
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

  if (!subscription) return null;

  // Only show for high-score signals (70%+)
  if (signalScore < 70) return null;

  // Professional users - show "Alert Sent" status
  if (subscription.limits.canAccessTelegramPremium) {
    return (
      <div className="mt-2 flex items-center space-x-2">
        <Badge className="bg-blue-600/20 border border-blue-500/30 text-blue-400 text-xs">
          <Send className="h-3 w-3 mr-1" />
          Telegram Alert Sent
        </Badge>
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

// ✅ UPDATED: Webhook trigger function with your new URL
export const triggerTelegramAlert = async (
  signalData: any,
  userChatId: string
) => {
  // ✅ NEW WEBHOOK URL
  const WEBHOOK_URL =
    "https://hook.eu2.make.com/eq4gio8f2ifal3hikm4yyag3962bspan";

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
      timeframe: "1D", // Default timeframe
      explanation: `${signalData.ticker} shows strong technical indicators with a confidence score of ${signalData.finalScore}/100.`,
    },
    user: {
      telegram_chat_id: userChatId,
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
      console.log("✅ Telegram alert sent successfully");
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

//✅ NEW: Auto-trigger function for high-score signals
export const autoTriggerTelegramAlert = async (signalData: any) => {
  // Only trigger for high-score signals (70%+)
  if (signalData.finalScore < 70) {
    console.log(
      `🔕 Signal score ${signalData.finalScore}% below threshold (70%)`
    );
    return false;
  }

  // You can add user chat ID from their profile/settings
  // For now, using your test chat ID
  const TEST_CHAT_ID = "1390805707";

  console.log(
    `🚨 Triggering Telegram alert for ${signalData.ticker} (${signalData.finalScore}%)`
  );

  return await triggerTelegramAlert(signalData, TEST_CHAT_ID);
};
