import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export interface Signal {
  id: string;
  ticker: string;
  name: string;
  price: number;
  change: number;
  score: number;
  signal: "BUY" | "SELL";
  strength: "weak" | "moderate" | "strong";
  market: string;
  sector: string;
  timeframe: string;
  createdAt: string;
}

interface FilterState {
  market: string;
  sector: string;
  timeframe: string;
  scoreThreshold: number[];
}

export const useSupabaseSignalsWithFilters = () => {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [filteredSignals, setFilteredSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    market: "global",
    sector: "all",
    timeframe: "1D",
    scoreThreshold: [70],
  });

  // Fetch signals from Supabase with filtering
  const fetchSignals = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from("trading_signals")
        .select("*")
        .gte("confidence_score", filters.scoreThreshold[0])
        .order("confidence_score", { ascending: false });

      // Apply market filter
      if (filters.market !== "global") {
        query = query.eq("market", filters.market);
      }

      // Apply sector filter
      if (filters.sector !== "all") {
        query = query.eq("sector", filters.sector);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      const processedSignals = (data || []).map((signal) => ({
        id: signal.id,
        ticker: signal.ticker,
        name: signal.ticker, // Using ticker as name since no company_name column
        price: signal.entry_price || 0,
        change: 0, // Will be calculated later with real market data
        score: signal.confidence_score,
        signal: signal.signal_type === "bullish" ? "BUY" : "SELL",
        strength:
          signal.confidence_score >= 90
            ? "strong"
            : signal.confidence_score >= 80
            ? "moderate"
            : "weak",
        market: signal.market || "usa",
        sector: signal.sector || "technology",
        timeframe: filters.timeframe,
        createdAt: signal.created_at,
      }));

      setSignals(processedSignals);
      setFilteredSignals(processedSignals);
      console.log(
        `✅ Loaded ${processedSignals.length} signals with filters:`,
        filters
      );
    } catch (err) {
      console.error("Error fetching filtered signals:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  // Update filters and refresh data
  const updateFilters = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // Trigger data refresh
  const refreshData = () => {
    fetchSignals();
  };

  // Initial load and when filters change
  useEffect(() => {
    fetchSignals();
  }, [
    filters.market,
    filters.sector,
    filters.timeframe,
    filters.scoreThreshold,
  ]);

  return {
    signals: filteredSignals,
    loading,
    error,
    filters,
    updateFilters,
    refreshData,
    totalCount: signals.length,
  };
};
