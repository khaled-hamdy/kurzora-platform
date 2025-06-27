// src/hooks/useSignalAlerts.ts
// Production Hook to monitor new signals and send Email + Telegram alerts
// 🚀 PRODUCTION: Subscription-based alerts with database integration
// 📧 ENHANCED: Now supports both Email and Telegram alerts in parallel

import { useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { telegramAlertService } from "@/services/telegramAlerts";
import { emailAlertService } from "@/services/emailAlerts";
import { calculateFinalScore } from "../utils/signalCalculations";

interface SignalAlertHookProps {
  enabled?: boolean;
}

interface TradingSignalData {
  id: string;
  ticker: string;
  symbol?: string;
  signals: {
    "1H": number;
    "4H": number;
    "1D": number;
    "1W": number;
  };
  entry_price: number;
  stop_loss?: number;
  take_profit?: number;
  signal_type?: string;
  strength?: string;
  status?: string;
  created_at: string;
}

export function useSignalAlerts({ enabled = true }: SignalAlertHookProps = {}) {
  const processedSignals = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!enabled) return;

    console.log(
      "🚀 Starting production signal alert monitoring (Email + Telegram)..."
    );

    // Monitor for new signals in real-time
    const subscription = supabase
      .channel("production-signal-alerts")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "trading_signals",
        },
        async (payload) => {
          console.log("🔔 New signal detected for production processing:", {
            id: payload.new.id,
            ticker: payload.new.ticker,
            created_at: payload.new.created_at,
          });
          await handleNewSignal(payload.new as TradingSignalData);
        }
      )
      .subscribe();

    // Check for recent high-score signals on mount
    checkRecentHighScoreSignals();

    return () => {
      console.log("🛑 Stopping signal alert monitoring");
      subscription.unsubscribe();
    };
  }, [enabled]);

  const handleNewSignal = async (signalData: TradingSignalData) => {
    const signalId = signalData.id;

    // Avoid processing the same signal multiple times
    if (processedSignals.current.has(signalId)) {
      console.log(`⏭️ Signal ${signalData.ticker} already processed, skipping`);
      return;
    }

    try {
      // Validate signal has required data structure
      if (!isValidSignalData(signalData)) {
        console.log(
          `⚠️ Signal ${signalData.ticker} missing required data structure`
        );
        return;
      }

      // Calculate final score using unified calculation
      const finalScore = calculateFinalScore(signalData.signals);

      console.log(
        `📊 Processing signal ${signalData.ticker} with calculated score: ${finalScore}`
      );

      // Check if signal meets alert criteria
      if (!shouldSendAlert(signalData, finalScore)) {
        console.log(
          `📭 Signal ${signalData.ticker} does not meet alert criteria`
        );
        return;
      }

      // 🚀 PRODUCTION: Process both Email and Telegram alerts in parallel
      console.log(
        `🔄 Sending alerts via Email + Telegram for ${signalData.ticker}...`
      );

      const [telegramSuccess, emailSuccess] = await Promise.all([
        telegramAlertService.processSignalForAlerts(signalData),
        emailAlertService.processSignalForEmailAlerts(signalData),
      ]);

      // Log results
      if (telegramSuccess) {
        console.log(`✅ Telegram alerts processed for ${signalData.ticker}`);
      } else {
        console.log(`❌ Telegram alerts failed for ${signalData.ticker}`);
      }

      if (emailSuccess) {
        console.log(`📧 Email alerts processed for ${signalData.ticker}`);
      } else {
        console.log(`❌ Email alerts failed for ${signalData.ticker}`);
      }

      // Mark as processed if at least one channel succeeded
      if (telegramSuccess || emailSuccess) {
        console.log(
          `✅ Alerts processed for ${
            signalData.ticker
          } (score: ${finalScore}) - Telegram: ${
            telegramSuccess ? "✅" : "❌"
          }, Email: ${emailSuccess ? "✅" : "❌"}`
        );
        processedSignals.current.add(signalId);
      } else {
        console.log(`❌ All alert channels failed for ${signalData.ticker}`);
      }
    } catch (error) {
      console.error(
        `❌ Error processing signal alert for ${signalData.ticker}:`,
        error
      );
    }
  };

  const checkRecentHighScoreSignals = async () => {
    try {
      console.log("🔍 Checking recent signals for alert processing...");

      // Get signals from the last 10 minutes
      const recentTimeThreshold = new Date(
        Date.now() - 10 * 60 * 1000
      ).toISOString();

      const { data: recentSignals, error } = await supabase
        .from("trading_signals")
        .select("*")
        .gte("created_at", recentTimeThreshold)
        .order("created_at", { ascending: false })
        .limit(50); // Limit to prevent overwhelming on startup

      if (error) {
        console.error("❌ Error fetching recent signals:", error);
        return;
      }

      const validSignals = recentSignals?.filter(isValidSignalData) || [];
      console.log(
        `📊 Found ${validSignals.length} valid recent signals to check`
      );

      // Filter by calculated score threshold
      const highScoreSignals = validSignals.filter((signal) => {
        const calculatedScore = calculateFinalScore(signal.signals);
        return calculatedScore >= 80;
      });

      console.log(
        `🎯 ${highScoreSignals.length} recent signals meet the alert threshold (≥80)`
      );

      // Process each qualifying signal
      for (const signal of highScoreSignals) {
        await handleNewSignal(signal);
      }
    } catch (error) {
      console.error("❌ Error checking recent signals:", error);
    }
  };

  const isValidSignalData = (
    signalData: any
  ): signalData is TradingSignalData => {
    return (
      signalData &&
      signalData.id &&
      (signalData.ticker || signalData.symbol) &&
      signalData.signals &&
      typeof signalData.signals === "object" &&
      signalData.signals["1H"] !== undefined &&
      signalData.signals["4H"] !== undefined &&
      signalData.signals["1D"] !== undefined &&
      signalData.signals["1W"] !== undefined &&
      signalData.entry_price !== undefined
    );
  };

  const shouldSendAlert = (
    signalData: TradingSignalData,
    calculatedScore: number
  ): boolean => {
    // Only send alerts for signals with calculated score >= 80
    if (calculatedScore < 80) {
      return false;
    }

    // Only send for active signals (if status field exists)
    if (signalData.status && signalData.status !== "active") {
      return false;
    }

    // Skip if signal is too old (older than 1 hour)
    const signalAge = Date.now() - new Date(signalData.created_at).getTime();
    const oneHourMs = 60 * 60 * 1000;
    if (signalAge > oneHourMs) {
      console.log(
        `⏰ Signal ${signalData.ticker} is too old (${Math.round(
          signalAge / 60000
        )} minutes), skipping alert`
      );
      return false;
    }

    return true;
  };

  // 🧪 TEST FUNCTION: Send test Telegram alert (existing)
  const sendTestAlert = async (): Promise<boolean> => {
    try {
      console.log("🧪 Creating test signal for Telegram alert verification...");

      const testSignal: TradingSignalData = {
        id: `test-telegram-${Date.now()}`,
        ticker: "AAPL",
        symbol: "AAPL",
        signals: {
          "1H": 85,
          "4H": 88,
          "1D": 82,
          "1W": 90,
        },
        entry_price: 190.5,
        stop_loss: 185.0,
        take_profit: 200.0,
        signal_type: "BUY",
        strength: "Strong",
        status: "active",
        created_at: new Date().toISOString(),
      };

      const finalScore = calculateFinalScore(testSignal.signals);
      console.log(`🎯 Test Telegram signal created with score: ${finalScore}`);

      if (!isValidSignalData(testSignal)) {
        console.error("❌ Test Telegram signal validation failed");
        return false;
      }

      const success = await telegramAlertService.processSignalForAlerts(
        testSignal
      );

      if (success) {
        console.log("✅ Test Telegram alert sent successfully");
        return true;
      } else {
        console.error("❌ Test Telegram alert failed to send");
        return false;
      }
    } catch (error) {
      console.error("❌ Error sending test Telegram alert:", error);
      return false;
    }
  };

  // 📧 NEW: Test function for email alerts
  const sendTestEmailAlert = async (): Promise<boolean> => {
    try {
      console.log("📧 Creating test signal for Email alert verification...");

      const testSignal: TradingSignalData = {
        id: `test-email-${Date.now()}`,
        ticker: "TSLA",
        symbol: "TSLA",
        signals: {
          "1H": 87,
          "4H": 85,
          "1D": 89,
          "1W": 83,
        },
        entry_price: 250.75,
        stop_loss: 240.0,
        take_profit: 270.0,
        signal_type: "BUY",
        strength: "Strong",
        status: "active",
        created_at: new Date().toISOString(),
      };

      const finalScore = calculateFinalScore(testSignal.signals);
      console.log(`📧 Test Email signal created with score: ${finalScore}`);

      if (!isValidSignalData(testSignal)) {
        console.error("❌ Test Email signal validation failed");
        return false;
      }

      const success = await emailAlertService.processSignalForEmailAlerts(
        testSignal
      );

      if (success) {
        console.log("✅ Test Email alert sent successfully");
        return true;
      } else {
        console.error("❌ Test Email alert failed to send");
        return false;
      }
    } catch (error) {
      console.error("❌ Error sending test Email alert:", error);
      return false;
    }
  };

  // 📧 NEW: Test both alert systems together
  const sendTestBothAlerts = async (): Promise<{
    telegram: boolean;
    email: boolean;
  }> => {
    try {
      console.log("🚀 Testing both Email + Telegram alerts together...");

      const testSignal: TradingSignalData = {
        id: `test-both-${Date.now()}`,
        ticker: "NVDA",
        symbol: "NVDA",
        signals: {
          "1H": 92,
          "4H": 88,
          "1D": 85,
          "1W": 91,
        },
        entry_price: 450.25,
        stop_loss: 430.0,
        take_profit: 480.0,
        signal_type: "BUY",
        strength: "Strong",
        status: "active",
        created_at: new Date().toISOString(),
      };

      const finalScore = calculateFinalScore(testSignal.signals);
      console.log(
        `🎯 Test signal created for both systems with score: ${finalScore}`
      );

      if (!isValidSignalData(testSignal)) {
        console.error("❌ Test signal validation failed");
        return { telegram: false, email: false };
      }

      // Test both systems in parallel
      const [telegramSuccess, emailSuccess] = await Promise.all([
        telegramAlertService.processSignalForAlerts(testSignal),
        emailAlertService.processSignalForEmailAlerts(testSignal),
      ]);

      console.log(
        `✅ Test results - Telegram: ${telegramSuccess ? "✅" : "❌"}, Email: ${
          emailSuccess ? "✅" : "❌"
        }`
      );

      return { telegram: telegramSuccess, email: emailSuccess };
    } catch (error) {
      console.error("❌ Error testing both alert systems:", error);
      return { telegram: false, email: false };
    }
  };

  // 🚀 PRODUCTION: Enhanced health check for both systems
  const getAlertSystemStatus = async () => {
    try {
      const [telegramHealth, emailHealth] = await Promise.all([
        telegramAlertService.healthCheck(),
        emailAlertService.emailHealthCheck(),
      ]);

      const processedCount = processedSignals.current.size;

      return {
        status:
          telegramHealth.status === "healthy" &&
          emailHealth.status === "healthy"
            ? "healthy"
            : "degraded",
        processed_signals_count: processedCount,
        telegram_health: telegramHealth.details,
        email_health: emailHealth.details,
        monitoring_enabled: enabled,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("❌ Error checking alert system status:", error);
      return {
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      };
    }
  };

  // 🚀 PRODUCTION: Get combined alert statistics
  const getAlertStats = async (dateRange?: { start: string; end: string }) => {
    try {
      const defaultRange = dateRange || {
        start: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        end: new Date().toISOString(),
      };

      const [telegramStats, emailStats] = await Promise.all([
        telegramAlertService.getAlertStats(defaultRange),
        emailAlertService.getEmailAlertStats(defaultRange),
      ]);

      return {
        telegram: telegramStats,
        email: emailStats,
        combined: {
          total_alerts:
            (telegramStats?.total_alerts || 0) +
            (emailStats?.total_email_alerts || 0),
          total_users:
            (telegramStats?.unique_users || 0) +
            (emailStats?.unique_email_users || 0),
        },
      };
    } catch (error) {
      console.error("❌ Error fetching combined alert stats:", error);
      return null;
    }
  };

  // 📧 NEW: Get email-only statistics
  const getEmailStats = async (dateRange?: { start: string; end: string }) => {
    try {
      const defaultRange = dateRange || {
        start: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        end: new Date().toISOString(),
      };

      return await emailAlertService.getEmailAlertStats(defaultRange);
    } catch (error) {
      console.error("❌ Error fetching email stats:", error);
      return null;
    }
  };

  // 🚀 PRODUCTION: Manual signal reprocessing for admin use
  const reprocessSignal = async (signalId: string) => {
    try {
      // Remove from processed set to allow reprocessing
      processedSignals.current.delete(signalId);

      // Fetch the signal data
      const { data: signalData, error } = await supabase
        .from("trading_signals")
        .select("*")
        .eq("id", signalId)
        .single();

      if (error || !signalData) {
        console.error("❌ Error fetching signal for reprocessing:", error);
        return false;
      }

      // Process the signal (will send to both Telegram and Email)
      await handleNewSignal(signalData);
      return true;
    } catch (error) {
      console.error("❌ Error reprocessing signal:", error);
      return false;
    }
  };

  return {
    // 🧪 TEST FUNCTIONS
    sendTestAlert, // Telegram test (existing)
    sendTestEmailAlert, // Email test (new)
    sendTestBothAlerts, // Both systems test (new)

    // 🚀 PRODUCTION: Admin/monitoring methods
    getAlertSystemStatus, // Enhanced for both systems
    getAlertStats, // Combined stats (enhanced)
    getEmailStats, // Email-only stats (new)
    reprocessSignal, // Enhanced to process both systems
    processedSignalsCount: processedSignals.current.size,
  };
}
