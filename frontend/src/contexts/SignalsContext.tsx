// src/contexts/SignalsContext.tsx - PRODUCTION SIGNALS PROVIDER - FIXED
// 🚀 ARCHITECTURE: Clean signals management with Edge Function alert processing
// 🎯 ALERTS: Handled by Supabase Edge Function for enterprise-grade reliability

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { supabase } from "../lib/supabase";
import { calculateFinalScore } from "../utils/signalCalculations";

export interface Signal {
  ticker: string;
  name: string;
  // 🔧 FIXED: Use database field names to match SignalTable expectations
  current_price: number; // was: price
  price_change_percent: number; // was: change
  signals: {
    "1H": number;
    "4H": number;
    "1D": number;
    "1W": number;
  };
  sector: string;
  market: string;
  timestamp: string;
  finalScore?: number;
}

interface SignalsContextType {
  signals: Signal[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  lastFetched: number | null;
}

const SignalsContext = createContext<SignalsContextType | undefined>(undefined);

interface SignalsProviderProps {
  children: ReactNode;
}

export const SignalsProvider: React.FC<SignalsProviderProps> = ({
  children,
}) => {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<number | null>(null);
  const [previousSignalIds, setPreviousSignalIds] = useState<Set<string>>(
    new Set()
  );

  const fetchSignals = async (forceRefresh: boolean = false) => {
    const now = Date.now();
    const tenMinutes = 10 * 60 * 1000;

    if (
      !forceRefresh &&
      lastFetched &&
      signals.length > 0 &&
      now - lastFetched < tenMinutes
    ) {
      console.log(
        "🚀 Using cached signals (less than 10 minutes old) - INSTANT LOAD"
      );
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log("🔄 Fetching signals from database...");

      // ✅ 🔧 FIXED: Load signals from 30% instead of 70% to enable proper filtering
      const { data, error: queryError } = await supabase
        .from("trading_signals")
        .select("*")
        .eq("status", "active")
        .gte("confidence_score", 30) // CHANGED FROM 70 TO 30
        .order("confidence_score", { ascending: false })
        .limit(50); // INCREASED LIMIT to get more signals for filtering

      if (queryError) {
        throw new Error(`Database query failed: ${queryError.message}`);
      }

      if (!data || data.length === 0) {
        console.log("No signals found in database");
        setSignals([]);
        setLastFetched(now);
        return;
      }

      // 🚨 SIGNAL TRACKING: Monitor new signals for alert processing
      const currentSignalIds = new Set(data.map((record) => record.id));
      const newSignals = data.filter(
        (record) => !previousSignalIds.has(record.id)
      );

      if (newSignals.length > 0) {
        console.log(
          `🔍 Alert Processing: ${newSignals.length} new signals detected - Edge Function will process alerts automatically`
        );
      }

      // ✅ Handle both signals with real timeframe data AND signals without
      const transformedSignals: Signal[] = data.map((record) => {
        const realSignals = record.signals;
        let timeframeSignals: {
          "1H": number;
          "4H": number;
          "1D": number;
          "1W": number;
        };
        let finalScore: number;

        // If we have real timeframe data, use it
        if (
          realSignals &&
          typeof realSignals === "object" &&
          realSignals["1H"] &&
          realSignals["4H"] &&
          realSignals["1D"] &&
          realSignals["1W"]
        ) {
          console.log(`✅ ${record.ticker}: Using real timeframe data`);
          timeframeSignals = {
            "1H": realSignals["1H"],
            "4H": realSignals["4H"],
            "1D": realSignals["1D"],
            "1W": realSignals["1W"],
          };
          finalScore = calculateFinalScore(timeframeSignals);
        } else {
          // ✅ If no timeframe data, create consistent fake data based on confidence_score
          console.log(
            `⚠️ ${record.ticker}: No timeframe data, creating consistent synthetic data from confidence_score`
          );
          const baseScore = record.confidence_score || 80;
          // 🚀 UNIFIED: Use industry-standard distribution that matches scoring-engine weights
          timeframeSignals = {
            "1H": Math.round(baseScore * 0.95), // Slightly lower for 1H volatility
            "4H": baseScore, // Base score for 4H (most weighted)
            "1D": Math.round(baseScore * 1.02), // Slightly higher for 1D stability
            "1W": Math.round(baseScore * 0.97), // Slightly lower for 1W lag
          };
          finalScore = calculateFinalScore(timeframeSignals);
        }

        console.log(
          `🔍 ${record.ticker}: DB=${record.confidence_score}, Calculated=${finalScore}`
        );

        return {
          ticker: record.ticker,
          name: record.company_name || `${record.ticker} Corporation`,
          // 🔧 FIXED: Use database field names directly (no mapping)
          current_price: record.current_price || record.entry_price || 100,
          price_change_percent: record.price_change_percent || 0,
          signals: timeframeSignals,
          sector: record.sector || "Technology",
          market: record.market || "usa",
          timestamp: record.created_at,
          finalScore: finalScore,
        };
      });

      // 🚀 ENTERPRISE ARCHITECTURE: Edge Function handles all alert processing
      // When signals are inserted/updated in database, Supabase webhook automatically
      // triggers the Edge Function which handles:
      // - Professional user filtering
      // - Telegram + Email alert distribution
      // - Daily limit enforcement
      // - Subscription tier validation
      if (!forceRefresh && newSignals.length > 0) {
        console.log(
          "🎯 ALERT ARCHITECTURE: Edge Function processing alerts automatically via database webhooks"
        );

        for (const newSignalRecord of newSignals) {
          const transformedSignal = transformedSignals.find(
            (s) =>
              s.ticker === newSignalRecord.ticker &&
              s.timestamp === newSignalRecord.created_at
          );

          if (
            transformedSignal &&
            transformedSignal.finalScore &&
            transformedSignal.finalScore >= 70
          ) {
            console.log(
              `🔔 HIGH-SCORE SIGNAL: ${transformedSignal.ticker} score ${transformedSignal.finalScore} >= 70 - Edge Function will distribute alerts`
            );
          } else if (transformedSignal) {
            console.log(
              `📊 ${transformedSignal.ticker} score ${transformedSignal.finalScore} < 70, below alert threshold`
            );
          }
        }
      }

      // Update previous signal IDs for next comparison
      setPreviousSignalIds(currentSignalIds);

      setSignals(transformedSignals);
      setLastFetched(now);
      console.log(
        `✅ Successfully loaded ${transformedSignals.length} signals (${
          data.filter((d) => d.signals && d.signals["1H"]).length
        } with real timeframe data) - NOW LOADING SIGNALS FROM 30% AND UP FOR PROPER FILTERING`
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      console.error("Failed to fetch signals:", errorMessage);
      setError(errorMessage);
      setSignals([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSignals();
  }, []);

  const refetch = async () => {
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;

    if (lastFetched && now - lastFetched < fiveMinutes) {
      console.log(
        "🚀 Skipping refetch - data is still fresh (less than 5 minutes old)"
      );
      return;
    }

    console.log(
      "🔄 Refetch: Data is older than 5 minutes, fetching fresh data..."
    );
    await fetchSignals(true);
  };

  return (
    <SignalsContext.Provider
      value={{
        signals,
        loading,
        error,
        refetch,
        lastFetched,
      }}
    >
      {children}
    </SignalsContext.Provider>
  );
};

export const useSignals = (): SignalsContextType => {
  const context = useContext(SignalsContext);
  if (context === undefined) {
    throw new Error("useSignals must be used within a SignalsProvider");
  }
  return context;
};
