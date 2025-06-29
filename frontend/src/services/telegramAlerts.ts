// src/services/telegramAlerts.ts
// Production Telegram Alert Service for Kurzora Trading Platform
// 🚀 PRODUCTION: Subscription-based alerts with database integration
// 🔧 FIXED: Proper array handling for Supabase joins + null safety

import { supabase } from "@/lib/supabase";
import { calculateFinalScore } from "@/utils/signalCalculations";

interface TradingSignal {
  id: string;
  symbol: string;
  signals: {
    "1H": number;
    "4H": number;
    "1D": number;
    "1W": number;
  };
  strength: string;
  entry_price: number;
  stop_loss?: number;
  take_profit?: number;
  signal_type?: string;
  created_at: string;
}

interface UserAlertSettings {
  user_id: string;
  telegram_enabled: boolean;
  telegram_chat_id: string | null;
  min_signal_score: number;
  max_alerts_per_day: number;
  trading_hours_only: boolean;
}

interface SubscriptionUser {
  id: string;
  email: string;
  subscription_tier: "starter" | "professional" | "elite";
  subscription_status: "active" | "trial" | "cancelled";
  alert_settings: UserAlertSettings;
}

// 🎯 Production webhook payload structure for Make.com
interface WebhookPayload {
  signal_id: string;
  symbol: string;
  final_score: number;
  strength: string;
  entry_price: number;
  stop_loss?: number;
  take_profit?: number;
  signal_type?: string;
  alert_type: "signal_alert";
  timestamp: string;
  user_count: number;
  eligible_users: Array<{
    user_id: string;
    chat_id: string;
    subscription_tier: string;
  }>;
}

class TelegramAlertService {
  private webhookUrl = import.meta.env.VITE_MAKE_WEBHOOK_URL;

  // 🚀 PRODUCTION: Send alerts to eligible Professional/Elite subscribers
  async processSignalForAlerts(signal: TradingSignal): Promise<boolean> {
    try {
      // Calculate the actual final score using the unified scoring function
      const finalScore = calculateFinalScore(signal.signals);

      console.log(
        `📊 Processing signal ${signal.symbol} with score ${finalScore}`
      );

      // Get eligible users for alerts
      const eligibleUsers = await this.getEligibleUsers(finalScore);

      if (eligibleUsers.length === 0) {
        console.log(
          `📭 No eligible users for ${signal.symbol} (score: ${finalScore})`
        );
        return false;
      }

      console.log(
        `🎯 Found ${eligibleUsers.length} eligible Professional users for Telegram alerts`
      );

      // Send webhook with real signal data and user list
      return await this.sendProductionWebhook(
        signal,
        finalScore,
        eligibleUsers
      );
    } catch (error) {
      console.error("❌ Error processing signal for alerts:", error);
      return false;
    }
  }

  // 🔍 Get users eligible for alerts based on subscription and preferences
  private async getEligibleUsers(
    signalScore: number
  ): Promise<SubscriptionUser[]> {
    try {
      console.log(
        `🔍 Searching for Professional users with signal score >= ${signalScore}`
      );

      const { data: users, error } = await supabase
        .from("users")
        .select(
          `
          id,
          email,
          subscription_tier,
          subscription_status,
          user_alert_settings (
            user_id,
            telegram_enabled,
            telegram_chat_id,
            min_signal_score,
            max_alerts_per_day,
            trading_hours_only
          )
        `
        )
        .eq("subscription_tier", "professional")
        .in("subscription_status", ["active", "trial"])
        .eq("user_alert_settings.telegram_enabled", true)
        .not("user_alert_settings.telegram_chat_id", "is", null)
        .lte("user_alert_settings.min_signal_score", signalScore);

      if (error) {
        console.error("❌ Database error fetching eligible users:", error);
        return [];
      }

      console.log(`📋 Database returned ${users?.length || 0} users`);

      // 🔧 FIXED: Properly handle Supabase join arrays and validate data
      const validUsers = (users || [])
        .filter((user) => {
          // Get first element from join array (Supabase returns arrays for joins)
          const alertSettings = user.user_alert_settings?.[0];

          if (!alertSettings) {
            console.log(`⚠️ Skipping ${user.email}: No alert settings found`);
            return false;
          }

          if (!alertSettings.telegram_enabled) {
            console.log(`⚠️ Skipping ${user.email}: Telegram not enabled`);
            return false;
          }

          if (!alertSettings.telegram_chat_id) {
            console.log(`⚠️ Skipping ${user.email}: No Chat ID`);
            return false;
          }

          console.log(
            `✅ User ${user.email} has valid Telegram settings: chat_id=${alertSettings.telegram_chat_id}`
          );
          return true;
        })
        .map((user) => ({
          ...user,
          alert_settings: user.user_alert_settings[0], // Extract first element
        }));

      // Filter users who haven't exceeded daily limits
      const filteredUsers = await this.filterByDailyLimits(validUsers);

      console.log(`🎯 Final eligible users: ${filteredUsers.length}`);
      return filteredUsers;
    } catch (error) {
      console.error("❌ Error fetching eligible users:", error);
      return [];
    }
  }

  // 📊 Filter users by daily alert limits
  private async filterByDailyLimits(users: any[]): Promise<SubscriptionUser[]> {
    const today = new Date().toISOString().split("T")[0];

    const filteredUsers: SubscriptionUser[] = [];

    for (const user of users) {
      try {
        // Alert settings is already extracted in getEligibleUsers
        const alertSettings = user.alert_settings;

        if (!alertSettings) {
          console.log(`⚠️ Skipping user ${user.email}: No alert settings`);
          continue;
        }

        // Check how many alerts sent today
        const { count } = await supabase
          .from("alert_delivery_log")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)
          .eq("delivery_channel", "telegram")
          .gte("created_at", `${today}T00:00:00`)
          .lt("created_at", `${today}T23:59:59`);

        const alertsToday = count || 0;
        const maxAlerts = alertSettings.max_alerts_per_day || 10;

        if (alertsToday < maxAlerts) {
          filteredUsers.push({
            id: user.id,
            email: user.email,
            subscription_tier: user.subscription_tier,
            subscription_status: user.subscription_status,
            alert_settings: alertSettings,
          });

          console.log(
            `✅ User ${user.email} eligible: ${alertsToday}/${maxAlerts} alerts today, chat_id=${alertSettings.telegram_chat_id}`
          );
        } else {
          console.log(
            `📈 User ${user.email} exceeded daily limit (${alertsToday}/${maxAlerts})`
          );
        }
      } catch (error) {
        console.error(
          `❌ Error checking daily limits for user ${user.id}:`,
          error
        );
      }
    }

    return filteredUsers;
  }

  // 🚀 Send production webhook with real signal and user data
  private async sendProductionWebhook(
    signal: TradingSignal,
    finalScore: number,
    eligibleUsers: SubscriptionUser[]
  ): Promise<boolean> {
    if (!this.webhookUrl) {
      console.error("❌ VITE_MAKE_WEBHOOK_URL not configured for production");
      return false;
    }

    // 🔧 FIXED: Add extra validation before mapping
    const validEligibleUsers = eligibleUsers.filter(
      (user) => user.alert_settings?.telegram_chat_id
    );

    if (validEligibleUsers.length === 0) {
      console.error("❌ No users with valid chat IDs after filtering");
      return false;
    }

    const payload: WebhookPayload = {
      signal_id: signal.id,
      symbol: signal.symbol,
      final_score: finalScore,
      strength: signal.strength,
      entry_price: signal.entry_price,
      stop_loss: signal.stop_loss,
      take_profit: signal.take_profit,
      signal_type: signal.signal_type,
      alert_type: "signal_alert",
      timestamp: new Date().toISOString(),
      user_count: validEligibleUsers.length,
      eligible_users: validEligibleUsers.map((user) => ({
        user_id: user.id,
        chat_id: user.alert_settings.telegram_chat_id!, // Safe now
        subscription_tier: user.subscription_tier,
      })),
    };

    try {
      console.log(`📤 Sending production webhook for ${signal.symbol}:`, {
        score: finalScore,
        users: validEligibleUsers.length,
        webhook_url: this.webhookUrl.substring(0, 50) + "...",
        chat_ids: payload.eligible_users.map((u) => u.chat_id),
        payload_preview: {
          symbol: payload.symbol,
          final_score: payload.final_score,
          user_count: payload.user_count,
        },
      });

      const response = await fetch(this.webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        console.log(
          `✅ Production webhook sent successfully for ${signal.symbol} to ${validEligibleUsers.length} users`
        );

        // Log successful alerts to database
        await this.logAlertDeliveries(signal.id, validEligibleUsers);

        return true;
      } else {
        const responseText = await response.text();
        console.error(
          `❌ Production webhook failed:`,
          response.status,
          response.statusText,
          responseText
        );
        return false;
      }
    } catch (error) {
      console.error("❌ Error sending production webhook:", error);
      return false;
    }
  }

  // 📝 Log alert deliveries to database for tracking
  private async logAlertDeliveries(
    signalId: string,
    users: SubscriptionUser[]
  ): Promise<void> {
    try {
      const deliveryLogs = users.map((user) => ({
        user_id: user.id,
        signal_id: signalId,
        alert_type: "signal_alert",
        delivery_channel: "telegram",
        delivery_status: "sent",
        sent_at: new Date().toISOString(),
      }));

      const { error } = await supabase
        .from("alert_delivery_log")
        .insert(deliveryLogs);

      if (error) {
        console.error("❌ Error logging alert deliveries:", error);
      } else {
        console.log(`✅ Logged ${deliveryLogs.length} alert deliveries`);
      }
    } catch (error) {
      console.error("❌ Error in logAlertDeliveries:", error);
    }
  }

  // 📊 Get alert statistics for admin dashboard
  async getAlertStats(dateRange: { start: string; end: string }) {
    try {
      const { data, error } = await supabase
        .from("alert_delivery_log")
        .select("*")
        .eq("delivery_channel", "telegram")
        .gte("created_at", dateRange.start)
        .lte("created_at", dateRange.end);

      if (error) throw error;

      return {
        total_alerts: data.length,
        successful_alerts: data.filter((log) => log.delivery_status === "sent")
          .length,
        failed_alerts: data.filter((log) => log.delivery_status === "failed")
          .length,
        unique_users: new Set(data.map((log) => log.user_id)).size,
      };
    } catch (error) {
      console.error("❌ Error fetching alert stats:", error);
      return null;
    }
  }

  // 🔧 Check service health for monitoring
  async healthCheck(): Promise<{ status: string; details: any }> {
    try {
      // Check webhook URL configuration
      if (!this.webhookUrl) {
        return {
          status: "error",
          details: { error: "Webhook URL not configured" },
        };
      }

      // Check database connectivity
      const { data, error } = await supabase
        .from("users")
        .select("id")
        .limit(1);

      if (error) {
        return {
          status: "error",
          details: { error: "Database connectivity failed", details: error },
        };
      }

      return {
        status: "healthy",
        details: {
          webhook_configured: true,
          database_connected: true,
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      return {
        status: "error",
        details: { error: "Health check failed", details: error },
      };
    }
  }
}

// Export singleton instance
export const telegramAlertService = new TelegramAlertService();

// Export types for use in other files
export type { TradingSignal, UserAlertSettings, SubscriptionUser };
