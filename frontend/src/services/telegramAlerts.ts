// src/services/telegramAlerts.ts
// Telegram Alert Service for Kurzora Trading Platform

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

class TelegramAlertService {
  private botToken = "7595665491:AAGS7TpH2LyWUlzu9HiG2NYiGPxIyXzpSx4";
  private apiUrl = `https://api.telegram.org/bot${this.botToken}`;

  // Send alert to specific user
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

    const message = this.formatSignalMessage(signal);

    try {
      const response = await fetch(`${this.apiUrl}/sendMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: user.telegram_chat_id,
          text: message,
          parse_mode: "HTML",
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(
          "✅ Telegram alert sent successfully:",
          result.result.message_id
        );
        return true;
      } else {
        console.error(
          "❌ Failed to send Telegram alert:",
          response.status,
          response.statusText
        );
        return false;
      }
    } catch (error) {
      console.error("❌ Error sending Telegram alert:", error);
      return false;
    }
  }

  // Send alert to multiple users
  async sendAlertToAllUsers(
    users: TelegramUser[],
    signal: TradingSignal
  ): Promise<void> {
    const enabledUsers = users.filter(
      (user) => user.telegram_enabled && user.telegram_chat_id
    );

    console.log(
      `📤 Sending alert to ${enabledUsers.length} users for ${signal.symbol} (${signal.final_score}/100)`
    );

    const promises = enabledUsers.map((user) =>
      this.sendSignalAlert(user, signal)
    );
    const results = await Promise.allSettled(promises);

    const successful = results.filter(
      (result) => result.status === "fulfilled" && result.value
    ).length;
    console.log(
      `✅ Successfully sent ${successful}/${enabledUsers.length} Telegram alerts`
    );
  }

  // Format signal message for Telegram
  private formatSignalMessage(signal: TradingSignal): string {
    const emoji =
      signal.final_score >= 90 ? "🔥" : signal.final_score >= 85 ? "💎" : "⭐";
    const signalTypeEmoji =
      signal.signal_type === "bullish"
        ? "📈"
        : signal.signal_type === "bearish"
        ? "📉"
        : "📊";

    return `
${emoji} <b>KURZORA SIGNAL ALERT</b> ${emoji}

${signalTypeEmoji} <b>${signal.symbol}</b> - Score: <b>${
      signal.final_score
    }/100</b>
💪 Strength: ${signal.strength}
📈 Entry: $${signal.entry_price}
${signal.stop_loss ? `🛡️ Stop Loss: $${signal.stop_loss}` : ""}
${signal.take_profit ? `🎯 Take Profit: $${signal.take_profit}` : ""}

⚡ Act fast on this ${signal.strength} signal!

🔗 <a href="https://kurzora.com/signals">View Chart</a>
`.trim();
  }

  // Test method - send test alert to specific chat ID
  async sendTestAlert(chatId: string): Promise<boolean> {
    const testSignal: TradingSignal = {
      symbol: "TSLA",
      final_score: 95,
      strength: "strong",
      entry_price: 248.5,
      stop_loss: 235.0,
      take_profit: 275.0,
      signal_type: "bullish",
    };

    const testUser: TelegramUser = {
      telegram_chat_id: chatId,
      telegram_enabled: true,
    };

    return await this.sendSignalAlert(testUser, testSignal);
  }
}

// Export singleton instance
export const telegramAlertService = new TelegramAlertService();

// Export types for use in other files
export type { TradingSignal, TelegramUser };
