// Periodic Signal Fetching Hook - Market Hours Detection & Auto-Generation
// src/hooks/usePeriodicSignalGeneration.ts

import { useState, useEffect, useCallback, useRef } from "react";
import {
  signalGenerationService,
  GenerationResult,
  GenerationProgress,
} from "../services/signalGenerationService";

export interface PeriodicConfig {
  enabled: boolean;
  intervalHours: number; // How often to generate (1-24 hours)
  marketHoursOnly: boolean; // Only generate during market hours
}

export interface GenerationState {
  isGenerating: boolean;
  lastGeneration?: Date;
  nextGeneration?: Date;
  lastResult?: GenerationResult;
  progress?: GenerationProgress;
  error?: string;
}

const DEFAULT_CONFIG: PeriodicConfig = {
  enabled: false,
  intervalHours: 4, // Generate every 4 hours by default
  marketHoursOnly: true,
};

export const usePeriodicSignalGeneration = (
  initialConfig?: Partial<PeriodicConfig>
) => {
  const [config, setConfig] = useState<PeriodicConfig>({
    ...DEFAULT_CONFIG,
    ...initialConfig,
  });

  const [state, setState] = useState<GenerationState>({
    isGenerating: false,
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const configRef = useRef(config);
  configRef.current = config;

  // Check if we're currently in market hours (9:30 AM - 4:00 PM ET, Mon-Fri)
  const isMarketHours = useCallback((): boolean => {
    const now = new Date();
    const timeInET = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      hour: "numeric",
      minute: "numeric",
      weekday: "short",
      hour12: false,
    }).formatToParts(now);

    const hour = parseInt(
      timeInET.find((part) => part.type === "hour")?.value || "0"
    );
    const weekday = timeInET.find((part) => part.type === "weekday")?.value;

    // Market hours: 9:30 AM - 4:00 PM ET, Monday-Friday
    const isWeekday = weekday && !["Sat", "Sun"].includes(weekday);
    const isDuringMarketHours = hour >= 9 && hour < 16; // 9 AM - 4 PM

    return isWeekday && isDuringMarketHours;
  }, []);

  // Calculate next generation time
  const calculateNextGeneration = useCallback(
    (lastGen?: Date): Date => {
      const now = new Date();
      const lastGenTime = lastGen || now;

      let nextGen = new Date(
        lastGenTime.getTime() + config.intervalHours * 60 * 60 * 1000
      );

      // If market hours only, adjust to next market hours if needed
      if (config.marketHoursOnly && !isMarketHours()) {
        // If we're outside market hours, schedule for next market open (9 AM ET)
        const nextMarketOpen = new Date();
        nextMarketOpen.setHours(9, 30, 0, 0); // 9:30 AM

        // If it's weekend or after market close, move to next business day
        const dayOfWeek = nextMarketOpen.getDay();
        if (dayOfWeek === 0) {
          // Sunday
          nextMarketOpen.setDate(nextMarketOpen.getDate() + 1); // Monday
        } else if (dayOfWeek === 6) {
          // Saturday
          nextMarketOpen.setDate(nextMarketOpen.getDate() + 2); // Monday
        } else if (nextMarketOpen.getTime() < now.getTime()) {
          // Market closed today, move to tomorrow
          nextMarketOpen.setDate(nextMarketOpen.getDate() + 1);
          // Skip weekends
          if (nextMarketOpen.getDay() === 0)
            nextMarketOpen.setDate(nextMarketOpen.getDate() + 1);
          if (nextMarketOpen.getDay() === 6)
            nextMarketOpen.setDate(nextMarketOpen.getDate() + 2);
        }

        nextGen = nextMarketOpen;
      }

      return nextGen;
    },
    [config.intervalHours, config.marketHoursOnly, isMarketHours]
  );

  // Manual signal generation
  const generateSignalsManually =
    useCallback(async (): Promise<GenerationResult> => {
      if (state.isGenerating) {
        throw new Error("Signal generation already in progress");
      }

      setState((prev) => ({ ...prev, isGenerating: true, error: undefined }));

      try {
        const result = await signalGenerationService.generateFreshSignals(
          (progress) => {
            setState((prev) => ({ ...prev, progress }));
          }
        );

        const now = new Date();
        setState((prev) => ({
          ...prev,
          isGenerating: false,
          lastGeneration: now,
          nextGeneration: calculateNextGeneration(now),
          lastResult: result,
          progress: undefined,
          error: result.success ? undefined : result.errors.join(", "),
        }));

        return result;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        setState((prev) => ({
          ...prev,
          isGenerating: false,
          error: errorMessage,
          progress: undefined,
        }));
        throw error;
      }
    }, [state.isGenerating, calculateNextGeneration]);

  // Automatic periodic generation
  const scheduleNextGeneration = useCallback(() => {
    if (intervalRef.current) {
      clearTimeout(intervalRef.current);
    }

    if (!configRef.current.enabled) {
      return;
    }

    const now = new Date();
    const nextGen = calculateNextGeneration(state.lastGeneration);
    const msUntilNext = Math.max(0, nextGen.getTime() - now.getTime());

    console.log(
      `📅 Next automatic signal generation scheduled for: ${nextGen.toLocaleString()}`
    );

    intervalRef.current = setTimeout(async () => {
      // Double-check config and market hours before generating
      if (!configRef.current.enabled) {
        return;
      }

      if (configRef.current.marketHoursOnly && !isMarketHours()) {
        console.log("⏰ Skipping generation - outside market hours");
        scheduleNextGeneration(); // Reschedule
        return;
      }

      try {
        console.log("🚀 Starting automatic signal generation...");
        await generateSignalsManually();
        console.log("✅ Automatic signal generation completed");
      } catch (error) {
        console.error("❌ Automatic signal generation failed:", error);
      }

      // Schedule the next generation
      scheduleNextGeneration();
    }, msUntilNext);

    setState((prev) => ({ ...prev, nextGeneration: nextGen }));
  }, [
    calculateNextGeneration,
    state.lastGeneration,
    isMarketHours,
    generateSignalsManually,
  ]);

  // Update configuration
  const updateConfig = useCallback((newConfig: Partial<PeriodicConfig>) => {
    setConfig((prev) => {
      const updated = { ...prev, ...newConfig };

      // Save to localStorage for persistence
      try {
        localStorage.setItem("periodicSignalConfig", JSON.stringify(updated));
      } catch (error) {
        console.warn("Failed to save periodic signal config:", error);
      }

      return updated;
    });
  }, []);

  // Load configuration from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("periodicSignalConfig");
      if (saved) {
        const savedConfig = JSON.parse(saved);
        setConfig((prev) => ({ ...prev, ...savedConfig }));
      }
    } catch (error) {
      console.warn("Failed to load periodic signal config:", error);
    }
  }, []);

  // Setup/cleanup periodic generation when config changes
  useEffect(() => {
    if (config.enabled) {
      scheduleNextGeneration();
    } else {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
        intervalRef.current = null;
      }
      setState((prev) => ({ ...prev, nextGeneration: undefined }));
    }

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, [
    config.enabled,
    config.intervalHours,
    config.marketHoursOnly,
    scheduleNextGeneration,
  ]);

  // Get formatted time until next generation
  const getTimeUntilNext = useCallback((): string | null => {
    if (!state.nextGeneration) return null;

    const now = new Date();
    const diff = state.nextGeneration.getTime() - now.getTime();

    if (diff <= 0) return "Generating...";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  }, [state.nextGeneration]);

  return {
    // State
    config,
    state,

    // Actions
    generateSignalsManually,
    updateConfig,

    // Computed values
    isMarketHours: isMarketHours(),
    timeUntilNext: getTimeUntilNext(),

    // Status
    canGenerate:
      !state.isGenerating && !signalGenerationService.isCurrentlyGenerating(),
  };
};
