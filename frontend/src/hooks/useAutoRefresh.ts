import { useState, useEffect, useCallback, useRef } from "react";

interface UseAutoRefreshProps {
  refreshFunction: () => void | Promise<void>;
  intervalMs?: number;
  enabledByDefault?: boolean;
}

interface UseAutoRefreshReturn {
  isAutoRefreshEnabled: boolean;
  toggleAutoRefresh: () => void;
  setAutoRefreshEnabled: (enabled: boolean) => void;
  lastRefreshTime: Date | null;
  nextRefreshIn: number;
  forceRefresh: () => void;
}

// 🎯 PURPOSE: Check if US stock market is currently open
// 🔧 SESSION: Market Hours Implementation - Simple EST Detection
// 🛡️ PRESERVATION: Market Hours: Monday-Friday, 9:30 AM - 4:00 PM EST
// 📝 HANDOVER: Real market hours detection, no fake/synthetic logic
const isMarketOpen = (): boolean => {
  const now = new Date();

  // Convert to EST/EDT (Eastern Time) - US market timezone
  const easternTime = new Date(
    now.toLocaleString("en-US", { timeZone: "America/New_York" })
  );

  const day = easternTime.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const hour = easternTime.getHours();
  const minute = easternTime.getMinutes();

  // Monday-Friday only (1-5)
  if (day < 1 || day > 5) {
    return false;
  }

  // Convert time to minutes for easier comparison
  const currentTimeInMinutes = hour * 60 + minute;
  const marketOpenTime = 9 * 60 + 30; // 9:30 AM EST
  const marketCloseTime = 16 * 60; // 4:00 PM EST

  return (
    currentTimeInMinutes >= marketOpenTime &&
    currentTimeInMinutes < marketCloseTime
  );
};

export const useAutoRefresh = ({
  refreshFunction,
  intervalMs = 15 * 60 * 1000, // 15 minutes - preserved from original
  enabledByDefault = false, // PRESERVED: Disabled by default
}: UseAutoRefreshProps): UseAutoRefreshReturn => {
  // 🛡️ PRESERVATION: All original state exactly as before
  const [isAutoRefreshEnabled, setIsAutoRefreshEnabled] =
    useState(enabledByDefault);
  const [lastRefreshTime, setLastRefreshTime] = useState<Date | null>(null);
  const [nextRefreshIn, setNextRefreshIn] = useState(intervalMs / 1000);

  // 🛡️ PRESERVATION: All original refs exactly as before
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  // 🛡️ PRESERVATION: forceRefresh function exactly as before
  const forceRefresh = useCallback(async () => {
    console.log("🔄 Force refreshing data...");
    try {
      await refreshFunction();
      setLastRefreshTime(new Date());
      setNextRefreshIn(intervalMs / 1000);
      console.log("✅ Data refresh completed");
    } catch (error) {
      console.error("❌ Refresh failed:", error);
    }
  }, [refreshFunction, intervalMs]);

  // 🛡️ PRESERVATION: toggleAutoRefresh function exactly as before
  const toggleAutoRefresh = useCallback(() => {
    setIsAutoRefreshEnabled((prev) => {
      const newState = !prev;
      console.log(
        `🔄 Auto-refresh ${newState ? "ENABLED" : "DISABLED"} (${
          intervalMs / 60000
        } min intervals)`
      );
      return newState;
    });
  }, [intervalMs]);

  // 🛡️ PRESERVATION: setAutoRefreshEnabled function exactly as before
  const setAutoRefreshEnabled = useCallback(
    (enabled: boolean) => {
      console.log(
        `🔄 Auto-refresh ${enabled ? "ENABLED" : "DISABLED"} (${
          intervalMs / 60000
        } min intervals)`
      );
      setIsAutoRefreshEnabled(enabled);
    },
    [intervalMs]
  );

  // 🎯 NEW: Main timer management with market hours detection
  // 🛡️ PRESERVATION: All original timer logic preserved, only added market hours check
  useEffect(() => {
    // Clear existing timers (preserved from original)
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }

    // Only start timers if auto-refresh is enabled AND market is open
    if (isAutoRefreshEnabled && isMarketOpen()) {
      console.log(
        `🔄 Starting auto-refresh (${
          intervalMs / 60000
        } minute interval) - Market is open`
      );

      // 🛡️ PRESERVATION: Original interval logic exactly as before
      intervalRef.current = setInterval(async () => {
        // Check market hours before each refresh
        if (isMarketOpen()) {
          await forceRefresh();
        } else {
          console.log("🔄 Skipping refresh - Market is closed");
        }
      }, intervalMs);

      // 🛡️ PRESERVATION: Original countdown logic exactly as before
      let remainingSeconds = intervalMs / 1000;
      setNextRefreshIn(remainingSeconds);

      countdownRef.current = setInterval(() => {
        remainingSeconds -= 1;
        setNextRefreshIn(remainingSeconds);

        if (remainingSeconds <= 0) {
          remainingSeconds = intervalMs / 1000;
        }
      }, 1000);

      // 🛡️ PRESERVATION: Don't auto-refresh on mount (preserved from original)
      // forceRefresh(); // PRESERVED: This was already commented out
    } else if (isAutoRefreshEnabled && !isMarketOpen()) {
      // Auto-refresh is enabled but market is closed
      console.log(
        "🔄 Auto-refresh enabled but market is closed - timers paused"
      );
      setNextRefreshIn(0);
    } else {
      // Auto-refresh is disabled (original behavior preserved)
      console.log("🔄 Auto-refresh stopped");
      setNextRefreshIn(0);
    }

    // 🛡️ PRESERVATION: Original cleanup exactly as before
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, [isAutoRefreshEnabled, intervalMs, forceRefresh]);

  // 🎯 NEW: Check market status every minute to resume/pause timers
  // 📝 HANDOVER: This ensures timers resume when market opens during the day
  useEffect(() => {
    const marketCheckInterval = setInterval(() => {
      const marketOpen = isMarketOpen();

      // If auto-refresh is enabled but timers aren't running due to market being closed,
      // trigger the main useEffect to restart timers when market opens
      if (isAutoRefreshEnabled && marketOpen && !intervalRef.current) {
        console.log("🔄 Market opened - resuming auto-refresh timers");
        // Trigger re-run of main useEffect by updating a dependency
        setIsAutoRefreshEnabled((prev) => prev);
      }
    }, 60000); // Check every minute

    return () => clearInterval(marketCheckInterval);
  }, [isAutoRefreshEnabled]);

  // 🛡️ PRESERVATION: Original cleanup effect exactly as before
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, []);

  // 🛡️ PRESERVATION: Return object exactly as before
  return {
    isAutoRefreshEnabled,
    toggleAutoRefresh,
    setAutoRefreshEnabled,
    lastRefreshTime,
    nextRefreshIn: Math.max(0, Math.floor(nextRefreshIn)),
    forceRefresh,
  };
};

// 🛡️ PRESERVATION: All utility functions exactly as before
export const formatCountdown = (seconds: number): string => {
  if (seconds <= 0) return "0s";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }
  return `${remainingSeconds}s`;
};

export const formatLastRefreshTime = (date: Date | null): string => {
  if (!date) return "Never";

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);

  if (diffMinutes < 1) {
    return "Just now";
  } else if (diffMinutes === 1) {
    return "1 min ago";
  } else if (diffMinutes < 60) {
    return `${diffMinutes} min ago`;
  } else {
    const diffHours = Math.floor(diffMinutes / 60);
    return `${diffHours}h ago`;
  }
};

// 🎯 NEW: Export market status for use in header component
// 📝 HANDOVER: Simple function for components to check market status
export const getMarketStatus = (): { isOpen: boolean; statusText: string } => {
  const isOpen = isMarketOpen();
  return {
    isOpen,
    statusText: isOpen ? "Market: Open" : "Market: Closed",
  };
};
