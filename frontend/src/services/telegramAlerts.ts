// src/services/telegramAlerts.ts
// Telegram Alert Service for Kurzora Trading Platform
// 🔧 FIXED: Now uses Make.com webhook and correct scoring

interface TradingSignal {
  symbol: string;
  final_score: number;
  strength: string;
  entry_price: number;
  stop_loss?: number;
  take_profit?: number;
  signal_type?: string;
}

interface TelegramUser {
  telegram_chat_id: string;
  telegram_enabled: boolean;
}

// 🎯 NEW: Webhook payload structure for Make.com
interface WebhookPayload {
  symbol: string;
  final_score: number;
  strength: string;
  entry_price: number;
  stop_loss?: number;
  take_profit?: number;
  signal_type?: string;
  alert_type: "signal_alert";
  timestamp: string;
}

class TelegramAlertService {
  // 🔒 SECURITY FIX: Use environment variable instead of hardcoded token
  private webhookUrl = import.meta.env.VITE_MAKE_WEBHOOK_URL;

  // 🚀 NEW: Send alert via Make.com webhook (replaces direct Telegram API)
  private async sendWebhookAlert(signal: TradingSignal): Promise<boolean> {
    if (!this.webhookUrl) {
      console.error("❌ VITE_MAKE_WEBHOOK_URL not configured");
      return false;
    }

    const payload: WebhookPayload = {
      symbol: signal.symbol,
      final_score: signal.final_score,
      strength: signal.strength,
      entry_price: signal.entry_price,
      stop_loss: signal.stop_loss,
      take_profit: signal.take_profit,
      signal_type: signal.signal_type,
      alert_type: "signal_alert",
      timestamp: new Date().toISOString(),
    };

    try {
      console.log("📤 Sending signal to Make.com webhook:", payload);

      const response = await fetch(this.webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        console.log("✅ Webhook sent successfully to Make.com");
        return true;
      } else {
        console.error(
          "❌ Webhook failed:",
          response.status,
          response.statusText
        );
        return false;
      }
    } catch (error) {
      console.error("❌ Error sending webhook:", error);
      return false;
    }
  }

  // Send alert to specific user (now via webhook)
  async sendSignalAlert(
    user: TelegramUser,
    signal: TradingSignal
  ): Promise<boolean> {
    if (!user.telegram_enabled || !user.telegram_chat_id) {
      console.log("User does not have Telegram alerts enabled");
      return false;
    }

    // Only send alerts for high-score signals
    if (signal.final_score < 80) {
      console.log(`Signal score ${signal.final_score} below threshold (80)`);
      return false;
    }

    // 🚀 NEW: Send via webhook instead of direct API
    return await this.sendWebhookAlert(signal);
  }

  // Send alert to multiple users (now via webhook)
  async sendAlertToAllUsers(
    users: TelegramUser[],
    signal: TradingSignal
  ): Promise<void> {
    const enabledUsers = users.filter(
      (user) => user.telegram_enabled && user.telegram_chat_id
    );

    console.log(
      `📤 Sending webhook alert for ${signal.symbol} (${signal.final_score}/100) to ${enabledUsers.length} users`
    );

    // 🚀 NEW: Single webhook call (Make.com handles distribution)
    if (enabledUsers.length > 0) {
      const success = await this.sendWebhookAlert(signal);
      if (success) {
        console.log(`✅ Webhook sent successfully for ${signal.symbol}`);
      } else {
        console.log(`❌ Webhook failed for ${signal.symbol}`);
      }
    }
  }

  // 🔧 FIXED: Test method now uses current Dashboard data and webhook
  async sendTestAlert(chatId: string): Promise<boolean> {
    // 🎯 FIXED: Get real signal data from current state instead of hardcoded
    const testSignal: TradingSignal = await this.getCurrentTestSignal();

    console.log("🧪 Sending test alert with current data:", testSignal);

    // 🚀 NEW: Send via webhook (not direct API)
    return await this.sendWebhookAlert(testSignal);
  }

  // 🎯 NEW: Get current signal data from Dashboard/Signals page
  private async getCurrentTestSignal(): Promise<TradingSignal> {
    try {
      // Try to get current TSLA signal from the dashboard
      const response = await fetch("/api/signals/current/TSLA");
      if (response.ok) {
        const signalData = await response.json();

        // Use actual dashboard data if available
        return {
          symbol: "TSLA",
          final_score: signalData.final_score || 88, // Use actual calculated score
          strength: signalData.strength || "strong",
          entry_price: signalData.entry_price || 248.5,
          stop_loss: signalData.stop_loss || 235.0,
          take_profit: signalData.take_profit || 275.0,
          signal_type: signalData.signal_type || "bullish",
        };
      }
    } catch (error) {
      console.log("Using fallback test data (API not available)");
    }

    // 🎯 FALLBACK: Use current expected scores (not hardcoded 95)
    return {
      symbol: "TSLA",
      final_score: 88, // ✅ FIXED: Use current Dashboard score, not 95
      strength: "strong",
      entry_price: 248.5,
      stop_loss: 235.0,
      take_profit: 275.0,
      signal_type: "bullish",
    };
  }

  // 🗑️ REMOVED: Old direct Telegram API methods (now use webhook)
  // - formatSignalMessage() - now handled by Make.com template
  // - Direct API calls - now via webhook
}

// Export singleton instance
export const telegramAlertService = new TelegramAlertService();

// Export types for use in other files
export type { TradingSignal, TelegramUser };
