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

export const useAutoRefresh = ({
  refreshFunction,
  intervalMs = 15 * 60 * 1000, // 15 minutes
  enabledByDefault = false, // CHANGED: Disabled by default
}: UseAutoRefreshProps): UseAutoRefreshReturn => {
  const [isAutoRefreshEnabled, setIsAutoRefreshEnabled] =
    useState(enabledByDefault);
  const [lastRefreshTime, setLastRefreshTime] = useState<Date | null>(null);
  const [nextRefreshIn, setNextRefreshIn] = useState(intervalMs / 1000);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

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

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }

    if (isAutoRefreshEnabled) {
      console.log(
        `🔄 Starting auto-refresh (${intervalMs / 60000} minute interval)`
      );

      intervalRef.current = setInterval(async () => {
        await forceRefresh();
      }, intervalMs);

      let remainingSeconds = intervalMs / 1000;
      setNextRefreshIn(remainingSeconds);

      countdownRef.current = setInterval(() => {
        remainingSeconds -= 1;
        setNextRefreshIn(remainingSeconds);

        if (remainingSeconds <= 0) {
          remainingSeconds = intervalMs / 1000;
        }
      }, 1000);

      // Don't auto-refresh on mount, only when manually enabled
      // forceRefresh(); // REMOVED: This was causing immediate refresh
    } else {
      console.log("🔄 Auto-refresh stopped");
      setNextRefreshIn(0);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, [isAutoRefreshEnabled, intervalMs, forceRefresh]);

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

  return {
    isAutoRefreshEnabled,
    toggleAutoRefresh,
    setAutoRefreshEnabled,
    lastRefreshTime,
    nextRefreshIn: Math.max(0, Math.floor(nextRefreshIn)),
    forceRefresh,
  };
};

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
