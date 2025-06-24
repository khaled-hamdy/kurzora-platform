// src/hooks/useSignalAlerts.ts
// Production Hook to monitor new signals and send Telegram alerts
// 🚀 PRODUCTION: Subscription-based alerts with database integration

import { useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { telegramAlertService } from "@/services/telegramAlerts";
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

    console.log("🚀 Starting production signal alert monitoring...");

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

      // 🚀 PRODUCTION: Use new production service method
      const success = await telegramAlertService.processSignalForAlerts(
        signalData
      );

      if (success) {
        console.log(
          `✅ Production alerts processed for ${signalData.ticker} (score: ${finalScore})`
        );
        // Mark signal as processed
        processedSignals.current.add(signalId);
      } else {
        console.log(`❌ Failed to process alerts for ${signalData.ticker}`);
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

  // 🧪 TEST FUNCTION: Send test alert to verify Telegram integration
  const sendTestAlert = async (): Promise<boolean> => {
    try {
      console.log("🧪 Creating test signal for Telegram alert verification...");

      // Create a realistic test signal with high score
      const testSignal: TradingSignalData = {
        id: `test-${Date.now()}`,
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
      console.log(`🎯 Test signal created with score: ${finalScore}`);

      // Validate the test signal
      if (!isValidSignalData(testSignal)) {
        console.error("❌ Test signal validation failed");
        return false;
      }

      // Send test signal through production webhook system
      const success = await telegramAlertService.processSignalForAlerts(
        testSignal
      );

      if (success) {
        console.log(
          "✅ Test alert sent successfully through production system"
        );
        return true;
      } else {
        console.error("❌ Test alert failed to send");
        return false;
      }
    } catch (error) {
      console.error("❌ Error sending test alert:", error);
      return false;
    }
  };

  // 🚀 PRODUCTION: Health check method for monitoring
  const getAlertSystemStatus = async () => {
    try {
      const healthCheck = await telegramAlertService.healthCheck();
      const processedCount = processedSignals.current.size;

      return {
        status: healthCheck.status,
        processed_signals_count: processedCount,
        service_health: healthCheck.details,
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

  // 🚀 PRODUCTION: Get alert statistics for admin dashboard
  const getAlertStats = async (dateRange?: { start: string; end: string }) => {
    try {
      const defaultRange = dateRange || {
        start: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Last 24 hours
        end: new Date().toISOString(),
      };

      return await telegramAlertService.getAlertStats(defaultRange);
    } catch (error) {
      console.error("❌ Error fetching alert stats:", error);
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

      // Process the signal
      await handleNewSignal(signalData);
      return true;
    } catch (error) {
      console.error("❌ Error reprocessing signal:", error);
      return false;
    }
  };

  return {
    // 🧪 TEST FUNCTION: For development testing
    sendTestAlert,

    // 🚀 PRODUCTION: Admin/monitoring methods
    getAlertSystemStatus,
    getAlertStats,
    reprocessSignal,
    processedSignalsCount: processedSignals.current.size,
  };
}
