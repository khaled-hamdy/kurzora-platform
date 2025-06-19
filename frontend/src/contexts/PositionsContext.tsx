// src/contexts/PositionsContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { useAuth } from "./AuthContext";
import { supabase } from "../lib/supabase";

interface PositionsContextType {
  existingPositions: string[];
  isLoading: boolean;
  error: string | null;
  refreshPositions: () => Promise<void>;
  hasPosition: (ticker: string) => boolean;
  getButtonText: (ticker: string) => string;
  forceRefresh: () => void; // ✅ NEW: Manual refresh trigger
}

const PositionsContext = createContext<PositionsContextType | undefined>(
  undefined
);

export const usePositions = () => {
  const context = useContext(PositionsContext);
  if (!context) {
    throw new Error("usePositions must be used within a PositionsProvider");
  }
  return context;
};

interface PositionsProviderProps {
  children: ReactNode;
}

export const PositionsProvider: React.FC<PositionsProviderProps> = ({
  children,
}) => {
  const { user } = useAuth();
  const [existingPositions, setExistingPositions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // ✅ NEW: Force refresh state

  // ✅ FIX 4: Use useCallback to prevent unnecessary re-renders
  const refreshPositions = useCallback(async () => {
    if (!user) {
      setExistingPositions([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log("🔄 PositionsContext: Loading user positions...");

      const { data, error: queryError } = await supabase
        .from("paper_trades")
        .select("ticker")
        .eq("user_id", user.id)
        .eq("is_open", true);

      if (queryError) {
        console.error(
          "❌ PositionsContext: Error loading positions:",
          queryError
        );
        setError(queryError.message);
        return;
      }

      const tickers = [...new Set(data?.map((trade) => trade.ticker) || [])];
      setExistingPositions(tickers);

      console.log("✅ PositionsContext: Loaded positions:", tickers);
    } catch (err) {
      console.error("❌ PositionsContext: Error in refreshPositions:", err);
      setError(err instanceof Error ? err.message : "Failed to load positions");
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  // ✅ FIX 5: Manual force refresh function
  const forceRefresh = useCallback(() => {
    console.log("🔄 PositionsContext: Force refresh triggered");
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  // ✅ FIX 6: Load positions when user changes OR when force refresh is triggered
  useEffect(() => {
    refreshPositions();
  }, [user?.id, refreshTrigger, refreshPositions]);

  // ✅ FIX 7: Set up real-time subscription for live updates
  useEffect(() => {
    if (!user) return;

    console.log("🔔 PositionsContext: Setting up real-time subscription");

    const subscription = supabase
      .channel("paper_trades_changes")
      .on(
        "postgres_changes",
        {
          event: "*", // Listen to all changes (INSERT, UPDATE, DELETE)
          schema: "public",
          table: "paper_trades",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log(
            "🔔 PositionsContext: Real-time update received:",
            payload
          );
          // Refresh positions when data changes
          refreshPositions();
        }
      )
      .subscribe();

    return () => {
      console.log("🔕 PositionsContext: Cleaning up subscription");
      subscription.unsubscribe();
    };
  }, [user?.id, refreshPositions]);

  // Helper functions
  const hasPosition = (ticker: string): boolean => {
    return existingPositions.includes(ticker);
  };

  const getButtonText = (ticker: string): string => {
    if (isLoading) return "Loading...";
    return hasPosition(ticker) ? "Add to Position" : "Execute Trade";
  };

  const value: PositionsContextType = {
    existingPositions,
    isLoading,
    error,
    refreshPositions,
    hasPosition,
    getButtonText,
    forceRefresh, // ✅ NEW: Expose force refresh
  };

  return (
    <PositionsContext.Provider value={value}>
      {children}
    </PositionsContext.Provider>
  );
};
