// src/contexts/SignalsContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { supabase } from "../lib/supabase";

export interface Signal {
  ticker: string;
  name: string;
  price: number;
  change: number;
  signals: {
    "1H": number;
    "4H": number;
    "1D": number;
    "1W": number;
  };
  sector: string;
  market: string;
  timestamp: string;
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

  const fetchSignals = async (forceRefresh: boolean = false) => {
    // Extended cache: 10 minutes for trading signals (more appropriate)
    const now = Date.now();
    const tenMinutes = 10 * 60 * 1000; // Changed from 2 minutes to 10 minutes

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
      console.log("🔄 Fetching fresh signals from database...");

      const { data, error: queryError } = await supabase
        .from("trading_signals")
        .select("*")
        .eq("status", "active")
        .gte("confidence_score", 70)
        .order("confidence_score", { ascending: false })
        .limit(20);

      if (queryError) {
        throw new Error(`Database query failed: ${queryError.message}`);
      }

      if (!data || data.length === 0) {
        console.log("No signals found in database");
        setSignals([]);
        setLastFetched(now);
        return;
      }

      // Transform Supabase data to match SignalTable interface
      const transformedSignals: Signal[] = data.map((record) => {
        const baseScore = record.confidence_score || 80;

        return {
          ticker: record.ticker,
          name: record.company_name || `${record.ticker} Corporation`,
          price: record.entry_price || record.current_price || 100,
          change: record.price_change_percent || Math.random() * 4 - 2,
          signals: {
            "1H": Math.min(
              100,
              Math.floor(baseScore * 0.85 + Math.random() * 5)
            ),
            "4H": Math.min(
              100,
              Math.floor(baseScore * 0.92 + Math.random() * 5)
            ),
            "1D": baseScore,
            "1W": Math.min(
              100,
              Math.floor(baseScore * 1.05 + Math.random() * 5)
            ),
          },
          sector: record.sector || "Technology",
          market: record.market || "usa",
          timestamp: record.created_at,
        };
      });

      setSignals(transformedSignals);
      setLastFetched(now);
      console.log(
        `✅ Successfully loaded ${transformedSignals.length} signals and cached for 10 minutes`
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

  // Smart refetch: Only force refresh if data is older than 5 minutes
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
    await fetchSignals(true); // Force refresh
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
