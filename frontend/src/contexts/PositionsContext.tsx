// src/contexts/PositionsContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
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

  const refreshPositions = async () => {
    if (!user) {
      setExistingPositions([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log("🔄 Loading user positions...");

      // CORRECTED: Use the actual column name from your database
      const { data, error: queryError } = await supabase
        .from("paper_trades")
        .select("ticker")
        .eq("user_id", user.id)
        .eq("is_open", true); // Use the correct boolean column

      if (queryError) {
        console.error("❌ Error loading positions:", queryError);
        setError(queryError.message);
        return;
      }

      const tickers = [...new Set(data?.map((trade) => trade.ticker) || [])];
      setExistingPositions(tickers);

      console.log("✅ Loaded positions:", tickers);
    } catch (err) {
      console.error("❌ Error in refreshPositions:", err);
      setError(err instanceof Error ? err.message : "Failed to load positions");
    } finally {
      setIsLoading(false);
    }
  };

  // Load positions when user changes
  useEffect(() => {
    refreshPositions();
  }, [user?.id]);

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
  };

  return (
    <PositionsContext.Provider value={value}>
      {children}
    </PositionsContext.Provider>
  );
};
