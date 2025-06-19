// src/hooks/useSignalsPageData.ts
import { useSignals } from "../contexts/SignalsContext";

// Custom hook that provides Signal[] format for the Signals page
export const useSignalsPageData = () => {
  // Use the shared context instead of individual hook
  const { signals, loading, error, refetch } = useSignals();

  console.log(
    "🔍 useSignalsPageData - Context loading:",
    loading,
    "Error:",
    error,
    "Signals count:",
    signals?.length
  );

  if (signals && signals.length > 0 && !loading) {
    console.log("🚀 Using cached signals from context - instant load!");
  }

  return {
    signals,
    loading,
    error,
    refresh: refetch,
  };
};
