// src/hooks/useSignalAlerts.ts
// Hook to monitor new signals and send Telegram alerts
// 🎯 FIXED: Now uses calculateFinalScore for consistent scoring

import { useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import {
  telegramAlertService,
  TradingSignal,
  TelegramUser,
} from "@/services/telegramAlerts";
// 🎯 CRITICAL FIX: Import the working calculation function
import { calculateFinalScore } from "../utils/signalCalculations";
// Telegram functionality is handled by triggerTelegramAlert function

interface SignalAlertHookProps {
  enabled?: boolean;
}

export function useSignalAlerts({ enabled = true }: SignalAlertHookProps = {}) {
  const processedSignals = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!enabled) return;

    // Monitor for new signals in real-time
    const subscription = supabase
      .channel("signal-alerts")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "trading_signals",
        },
        async (payload) => {
          console.log("🔔 New signal detected:", payload.new);
          await handleNewSignal(payload.new as any);
        }
      )
      .subscribe();

    // Also check for existing high-score signals on mount
    checkExistingSignals();

    return () => {
      subscription.unsubscribe();
    };
  }, [enabled]);

  const handleNewSignal = async (signalData: any) => {
    const signalId = signalData.id;

    // Avoid processing the same signal multiple times
    if (processedSignals.current.has(signalId)) {
      return;
    }

    // 🎯 FIXED: Calculate score from signals JSONB
    const calculatedScore = calculateScoreFromSignalData(signalData);

    // Check if signal meets alert criteria
    if (!shouldSendAlert(signalData, calculatedScore)) {
      return;
    }

    console.log(
      `📢 Processing alert for ${signalData.ticker} (${calculatedScore}/100) - CALCULATED score`
    );

    try {
      // Get users who want Telegram alerts
      const users = await getTelegramUsers();

      // 🎯 FIXED: Format signal using calculated score
      const signal: TradingSignal = {
        symbol: signalData.ticker || signalData.symbol,
        final_score: calculatedScore, // ✅ Now uses calculated score
        strength: getStrengthFromScore(calculatedScore),
        entry_price: signalData.entry_price || 0,
        stop_loss: signalData.stop_loss,
        take_profit: signalData.take_profit,
        signal_type: signalData.signal_type,
      };

      // Send alerts to all enabled users
      await telegramAlertService.sendAlertToAllUsers(users, signal);

      // Mark signal as processed
      processedSignals.current.add(signalId);
    } catch (error) {
      console.error("❌ Error processing signal alert:", error);
    }
  };

  const checkExistingSignals = async () => {
    try {
      // 🎯 FIXED: Get all recent signals, then filter by calculated score
      const { data: recentSignals, error } = await supabase
        .from("trading_signals")
        .select("*")
        .gte("created_at", new Date(Date.now() - 5 * 60 * 1000).toISOString()) // Last 5 minutes
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching recent signals:", error);
        return;
      }

      console.log(
        `🔍 Found ${recentSignals?.length || 0} recent signals to check`
      );

      // 🎯 FIXED: Filter by calculated score instead of database field
      const highScoreSignals =
        recentSignals?.filter((signal) => {
          const calculatedScore = calculateScoreFromSignalData(signal);
          return calculatedScore >= 80;
        }) || [];

      console.log(
        `🎯 ${highScoreSignals.length} signals meet the 80+ calculated score threshold`
      );

      // Process each recent signal
      for (const signal of highScoreSignals) {
        await handleNewSignal(signal);
      }
    } catch (error) {
      console.error("Error checking existing signals:", error);
    }
  };

  // 🎯 FIXED: Use calculated score parameter
  const shouldSendAlert = (
    signalData: any,
    calculatedScore: number
  ): boolean => {
    // Only send alerts for signals with calculated score >= 80
    if (calculatedScore < 80) {
      console.log(
        `Signal ${signalData.ticker} calculated score ${calculatedScore} below threshold (80)`
      );
      return false;
    }

    // Only send for active signals
    if (signalData.status && signalData.status !== "active") {
      return false;
    }

    return true;
  };

  // 🎯 UNIFIED HELPER: Calculate score from signal data using platform's single source of truth
  const calculateScoreFromSignalData = (signalData: any): number => {
    try {
      // Parse signals JSONB field
      const signals = signalData.signals || {};

      // Verify we have the required timeframe data
      if (signals["1H"] && signals["4H"] && signals["1D"] && signals["1W"]) {
        // 🚀 UNIFIED: Use the platform's single source of truth from scoring-engine
        const calculatedScore = calculateFinalScore(signals);

        console.log("🎯 Timeframe Data:", signals);
        console.log("✅ Calculated Score:", calculatedScore);

        // Log any discrepancy with database values (for debugging)
        if (calculatedScore !== signalData.final_score) {
          console.log(
            "🎯 UNIFIED! Telegram now uses calculated score from scoring-engine instead of database field!"
          );
          console.log(
            `📊 DB final_score: ${signalData.final_score} → Calculated: ${calculatedScore}`
          );
        }

        return calculatedScore;
      } else {
        // 🚀 IMPROVED: Create synthetic timeframe data for consistency
        console.log("⚠️ Missing timeframe data, creating synthetic signals");
        const baseScore =
          signalData.final_score || signalData.confidence_score || 75;
        const syntheticSignals = {
          "1H": Math.round(baseScore * 0.95),
          "4H": baseScore,
          "1D": Math.round(baseScore * 1.02),
          "1W": Math.round(baseScore * 0.97),
        };
        return calculateFinalScore(syntheticSignals);
      }
    } catch (error) {
      console.error("❌ Error calculating score from signal data:", error);
      // Final fallback - but still use synthetic approach for consistency
      const baseScore =
        signalData.final_score || signalData.confidence_score || 75;
      const syntheticSignals = {
        "1H": Math.round(baseScore * 0.95),
        "4H": baseScore,
        "1D": Math.round(baseScore * 1.02),
        "1W": Math.round(baseScore * 0.97),
      };
      return calculateFinalScore(syntheticSignals);
    }
  };

  const getTelegramUsers = async (): Promise<TelegramUser[]> => {
    try {
      const { data: alertSettings, error } = await supabase
        .from("user_alert_settings")
        .select("telegram_chat_id, telegram_enabled")
        .eq("telegram_enabled", true)
        .not("telegram_chat_id", "is", null);

      if (error) {
        console.error("Error fetching telegram users:", error);
        return [];
      }

      return (
        alertSettings?.map((setting) => ({
          telegram_chat_id: setting.telegram_chat_id,
          telegram_enabled: setting.telegram_enabled,
        })) || []
      );
    } catch (error) {
      console.error("Error getting Telegram users:", error);
      return [];
    }
  };

  const getStrengthFromScore = (score: number): string => {
    if (score >= 90) return "very strong";
    if (score >= 85) return "strong";
    if (score >= 80) return "moderate";
    return "weak";
  };

  // Manual test function
  const sendTestAlert = async () => {
    try {
      const success = await telegramAlertService.sendTestAlert("1390805707");
      console.log(success ? "✅ Test alert sent!" : "❌ Test alert failed");
      return success;
    } catch (error) {
      console.error("❌ Error sending test alert:", error);
      return false;
    }
  };

  return {
    sendTestAlert,
  };
}
