// src/services/emailAlerts.ts
// Production Email Alert Service for Kurzora Trading Platform
// 🚀 PRODUCTION: Subscription-based email alerts with database integration
// 📧 Following exact same pattern as telegramAlerts.ts

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
  email_enabled: boolean;
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

// 🎯 Production webhook payload structure for Make.com Email
interface EmailWebhookPayload {
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
    user_email: string;
    subscription_tier: string;
  }>;
}

class EmailAlertService {
  // 📧 WORKING Email webhook URL (same as Telegram)
  private webhookUrl =
    "https://hook.eu2.make.com/oatde944l01b32ng3ffxavgtfjcp1ffk";

  // 🚀 PRODUCTION: Send email alerts to eligible subscribers
  async processSignalForEmailAlerts(signal: TradingSignal): Promise<boolean> {
    try {
      // Calculate the actual final score using the unified scoring function
      const finalScore = calculateFinalScore(signal.signals);

      console.log(
        `📧 Processing signal ${signal.symbol} for email alerts with score ${finalScore}`
      );

      // Get eligible users for email alerts
      const eligibleUsers = await this.getEligibleEmailUsers(finalScore);

      if (eligibleUsers.length === 0) {
        console.log(
          `📭 No eligible users for email alerts ${signal.symbol} (score: ${finalScore})`
        );
        return false;
      }

      // Send email webhook with real signal data and user list
      return await this.sendEmailWebhook(signal, finalScore, eligibleUsers);
    } catch (error) {
      console.error("❌ Error processing signal for email alerts:", error);
      return false;
    }
  }

  // 🔍 Get users eligible for email alerts (available to all subscription tiers)
  private async getEligibleEmailUsers(
    signalScore: number
  ): Promise<SubscriptionUser[]> {
    try {
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
            email_enabled,
            min_signal_score,
            max_alerts_per_day,
            trading_hours_only
          )
        `
        )
        .in("subscription_status", ["active", "trial"])
        .eq("user_alert_settings.email_enabled", true)
        .not("email", "is", null)
        .lte("user_alert_settings.min_signal_score", signalScore);

      if (error) {
        console.error(
          "❌ Database error fetching eligible email users:",
          error
        );
        return [];
      }

      // Filter users who haven't exceeded daily limits
      const filteredUsers = await this.filterEmailUsersByDailyLimits(
        users || []
      );

      console.log(
        `✅ Found ${filteredUsers.length} eligible users for email alerts`
      );
      return filteredUsers;
    } catch (error) {
      console.error("❌ Error fetching eligible email users:", error);
      return [];
    }
  }

  // 📊 Filter email users by daily alert limits
  private async filterEmailUsersByDailyLimits(
    users: any[]
  ): Promise<SubscriptionUser[]> {
    const today = new Date().toISOString().split("T")[0];

    const filteredUsers: SubscriptionUser[] = [];

    for (const user of users) {
      try {
        // Check how many email alerts sent today
        const { count } = await supabase
          .from("alert_delivery_log")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)
          .eq("delivery_channel", "email")
          .gte("created_at", `${today}T00:00:00`)
          .lt("created_at", `${today}T23:59:59`);

        const alertsToday = count || 0;
        const maxAlerts = user.user_alert_settings?.max_alerts_per_day || 10;

        if (alertsToday < maxAlerts) {
          filteredUsers.push({
            id: user.id,
            email: user.email,
            subscription_tier: user.subscription_tier,
            subscription_status: user.subscription_status,
            alert_settings: user.user_alert_settings,
          });
        } else {
          console.log(
            `📧 User ${user.email} exceeded daily email limit (${alertsToday}/${maxAlerts})`
          );
        }
      } catch (error) {
        console.error(
          `❌ Error checking daily email limits for user ${user.id}:`,
          error
        );
      }
    }

    return filteredUsers;
  }

  // 🚀 Send production email webhook with real signal and user data
  private async sendEmailWebhook(
    signal: TradingSignal,
    finalScore: number,
    eligibleUsers: SubscriptionUser[]
  ): Promise<boolean> {
    if (!this.webhookUrl) {
      console.error("❌ Email webhook URL not configured for production");
      return false;
    }

    const payload: EmailWebhookPayload = {
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
      user_count: eligibleUsers.length,
      eligible_users: eligibleUsers.map((user) => ({
        user_id: user.id,
        user_email: user.email, // Use email instead of chat_id
        subscription_tier: user.subscription_tier,
      })),
    };

    try {
      console.log(`📧 Sending email webhook for ${signal.symbol}:`, {
        score: finalScore,
        users: eligibleUsers.length,
        webhook_url: this.webhookUrl.substring(0, 50) + "...",
      });

      const response = await fetch(this.webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        console.log(`✅ Email webhook sent successfully for ${signal.symbol}`);

        // Log successful email alerts to database
        await this.logEmailAlertDeliveries(signal.id, eligibleUsers);

        return true;
      } else {
        console.error(
          `❌ Email webhook failed:`,
          response.status,
          response.statusText
        );
        return false;
      }
    } catch (error) {
      console.error("❌ Error sending email webhook:", error);
      return false;
    }
  }

  // 📝 Log email alert deliveries to database for tracking
  private async logEmailAlertDeliveries(
    signalId: string,
    users: SubscriptionUser[]
  ): Promise<void> {
    try {
      const deliveryLogs = users.map((user) => ({
        user_id: user.id,
        signal_id: signalId,
        alert_type: "signal_alert",
        delivery_channel: "email", // Different from Telegram
        delivery_status: "sent",
        sent_at: new Date().toISOString(),
      }));

      const { error } = await supabase
        .from("alert_delivery_log")
        .insert(deliveryLogs);

      if (error) {
        console.error("❌ Error logging email alert deliveries:", error);
      } else {
        console.log(`✅ Logged ${deliveryLogs.length} email alert deliveries`);
      }
    } catch (error) {
      console.error("❌ Error in logEmailAlertDeliveries:", error);
    }
  }

  // 📊 Get email alert statistics for admin dashboard
  async getEmailAlertStats(dateRange: { start: string; end: string }) {
    try {
      const { data, error } = await supabase
        .from("alert_delivery_log")
        .select("*")
        .eq("delivery_channel", "email")
        .gte("created_at", dateRange.start)
        .lte("created_at", dateRange.end);

      if (error) throw error;

      return {
        total_email_alerts: data.length,
        successful_email_alerts: data.filter(
          (log) => log.delivery_status === "sent"
        ).length,
        failed_email_alerts: data.filter(
          (log) => log.delivery_status === "failed"
        ).length,
        unique_email_users: new Set(data.map((log) => log.user_id)).size,
      };
    } catch (error) {
      console.error("❌ Error fetching email alert stats:", error);
      return null;
    }
  }

  // 🔧 Check email service health for monitoring
  async emailHealthCheck(): Promise<{ status: string; details: any }> {
    try {
      // Check webhook URL configuration
      if (!this.webhookUrl) {
        return {
          status: "error",
          details: { error: "Email webhook URL not configured" },
        };
      }

      // Check database connectivity
      const { data, error } = await supabase
        .from("users")
        .select("id, email")
        .not("email", "is", null)
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
          email_webhook_configured: true,
          database_connected: true,
          webhook_url: this.webhookUrl,
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      return {
        status: "error",
        details: { error: "Email health check failed", details: error },
      };
    }
  }
}

// Export singleton instance
export const emailAlertService = new EmailAlertService();

// Export types for use in other files
export type { TradingSignal, UserAlertSettings, SubscriptionUser };
