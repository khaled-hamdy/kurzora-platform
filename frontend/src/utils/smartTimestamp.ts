// src/utils/smartTimestamp.ts
// Smart timestamp utility for market-aware signal timing
// Provides context-aware timestamps that understand trading hours

export interface MarketAwareTimestamp {
  display: string;
  context: "live" | "after-hours" | "pre-market" | "weekend" | "holiday";
  actionable: boolean;
  nextTradingSession?: string;
  timeOnly?: string;
  contextBadge?: {
    text: string;
    color: string;
    bgColor: string;
  };
}

export interface MarketHours {
  open: { hour: number; minute: number };
  close: { hour: number; minute: number };
  timezone: string;
}

// US Market Hours (Eastern Time)
const US_MARKET_HOURS: MarketHours = {
  open: { hour: 9, minute: 30 },
  close: { hour: 16, minute: 0 },
  timezone: "America/New_York",
};

// Market holidays for 2025 (expand as needed)
const MARKET_HOLIDAYS_2025 = [
  "2025-01-01", // New Year's Day
  "2025-01-20", // Martin Luther King Jr. Day
  "2025-02-17", // Presidents' Day
  "2025-04-18", // Good Friday
  "2025-05-26", // Memorial Day
  "2025-06-19", // Juneteenth
  "2025-07-04", // Independence Day
  "2025-09-01", // Labor Day
  "2025-11-27", // Thanksgiving
  "2025-12-25", // Christmas Day
];

/**
 * Check if a date is a market holiday
 */
function isMarketHoliday(date: Date): boolean {
  const dateString = date.toISOString().split("T")[0];
  return MARKET_HOLIDAYS_2025.includes(dateString);
}

/**
 * Check if a date is a weekend (Saturday or Sunday)
 */
function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6; // Sunday = 0, Saturday = 6
}

/**
 * Get current time in US Eastern timezone
 */
function getCurrentEasternTime(): Date {
  return new Date(
    new Date().toLocaleString("en-US", { timeZone: "America/New_York" })
  );
}

/**
 * Get next trading day (skips weekends and holidays)
 */
function getNextTradingDay(date: Date): Date {
  let nextDay = new Date(date);
  nextDay.setDate(nextDay.getDate() + 1);

  // Keep advancing until we find a non-weekend, non-holiday day
  while (isWeekend(nextDay) || isMarketHoliday(nextDay)) {
    nextDay.setDate(nextDay.getDate() + 1);
  }

  return nextDay;
}

/**
 * Determine market status at a given time
 */
function getMarketStatus(timestamp: Date): {
  status: "open" | "closed" | "pre-market" | "after-hours";
  context: "live" | "after-hours" | "pre-market" | "weekend" | "holiday";
} {
  const easternTime = new Date(
    timestamp.toLocaleString("en-US", { timeZone: "America/New_York" })
  );

  // Check if it's a holiday
  if (isMarketHoliday(easternTime)) {
    return { status: "closed", context: "holiday" };
  }

  // Check if it's a weekend
  if (isWeekend(easternTime)) {
    return { status: "closed", context: "weekend" };
  }

  const hour = easternTime.getHours();
  const minute = easternTime.getMinutes();
  const timeInMinutes = hour * 60 + minute;

  const marketOpenMinutes =
    US_MARKET_HOURS.open.hour * 60 + US_MARKET_HOURS.open.minute;
  const marketCloseMinutes =
    US_MARKET_HOURS.close.hour * 60 + US_MARKET_HOURS.close.minute;

  // Pre-market: 4:00 AM - 9:30 AM EST
  if (timeInMinutes >= 4 * 60 && timeInMinutes < marketOpenMinutes) {
    return { status: "pre-market", context: "pre-market" };
  }

  // Market hours: 9:30 AM - 4:00 PM EST
  if (
    timeInMinutes >= marketOpenMinutes &&
    timeInMinutes < marketCloseMinutes
  ) {
    return { status: "open", context: "live" };
  }

  // After-hours: 4:00 PM - 8:00 PM EST (extended hours)
  if (timeInMinutes >= marketCloseMinutes && timeInMinutes < 20 * 60) {
    return { status: "after-hours", context: "after-hours" };
  }

  // Overnight: 8:00 PM - 4:00 AM EST (next day)
  return { status: "closed", context: "after-hours" };
}

/**
 * Format timestamp for user's timezone (Berlin CEST)
 */
function formatUserTime(timestamp: Date, includeDate: boolean = false): string {
  const now = new Date();
  const isToday = timestamp.toDateString() === now.toDateString();
  const isYesterday =
    timestamp.toDateString() ===
    new Date(now.getTime() - 24 * 60 * 60 * 1000).toDateString();

  // Time formatting options for Berlin timezone
  const timeOptions: Intl.DateTimeFormatOptions = {
    timeZone: "Europe/Berlin",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  const timeString = timestamp.toLocaleString("en-US", timeOptions);

  if (!includeDate) {
    return timeString;
  }

  if (isToday) {
    return `Today ${timeString}`;
  } else if (isYesterday) {
    return `Yesterday ${timeString}`;
  } else {
    // For older signals, show date
    return timestamp.toLocaleString("en-US", {
      timeZone: "Europe/Berlin",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }
}

/**
 * Get next trading session information
 */
function getNextTradingSession(currentTime: Date): string {
  const nextTradingDay = getNextTradingDay(currentTime);

  // Format next trading day
  const today = new Date();
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

  if (nextTradingDay.toDateString() === today.toDateString()) {
    return `Today 9:30 AM EST`;
  } else if (nextTradingDay.toDateString() === tomorrow.toDateString()) {
    return `Tomorrow 9:30 AM EST`;
  } else {
    return (
      nextTradingDay.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
      }) + ` 9:30 AM EST`
    );
  }
}

/**
 * Get context badge information for UI display
 */
function getContextBadge(context: string): {
  text: string;
  color: string;
  bgColor: string;
} {
  switch (context) {
    case "live":
      return {
        text: "Live",
        color: "text-green-400",
        bgColor: "bg-green-900/20 border-green-500/30",
      };
    case "pre-market":
      return {
        text: "Pre-Market",
        color: "text-yellow-400",
        bgColor: "bg-yellow-900/20 border-yellow-500/30",
      };
    case "after-hours":
      return {
        text: "After Hours",
        color: "text-amber-400",
        bgColor: "bg-amber-900/20 border-amber-500/30",
      };
    case "weekend":
      return {
        text: "Weekend",
        color: "text-blue-400",
        bgColor: "bg-blue-900/20 border-blue-500/30",
      };
    case "holiday":
      return {
        text: "Holiday",
        color: "text-red-400",
        bgColor: "bg-red-900/20 border-red-500/30",
      };
    default:
      return {
        text: "Market Closed",
        color: "text-gray-400",
        bgColor: "bg-gray-900/20 border-gray-500/30",
      };
  }
}

/**
 * Create market-aware timestamp display
 */
export function createMarketAwareTimestamp(
  timestamp: Date | string
): MarketAwareTimestamp {
  const signalTime =
    typeof timestamp === "string" ? new Date(timestamp) : timestamp;
  const currentTime = new Date();
  const { context } = getMarketStatus(signalTime);

  // Format the time in user's timezone (Berlin)
  const userTimeDisplay = formatUserTime(signalTime, true);
  const timeOnly = formatUserTime(signalTime, false);
  const contextBadge = getContextBadge(context);

  // Determine the appropriate display message
  let display: string;
  let actionable: boolean;
  let nextTradingSession: string | undefined;

  switch (context) {
    case "live":
      display = `Live signal - Trade immediately`;
      actionable = true;
      break;

    case "after-hours":
      nextTradingSession = getNextTradingSession(currentTime);
      if (isWeekend(currentTime)) {
        display = `Weekend signal - Valid ${nextTradingSession}`;
      } else {
        display = `After-hours signal - Valid ${nextTradingSession}`;
      }
      actionable = false;
      break;

    case "pre-market":
      display = `Pre-market signal - Valid at 9:30 AM EST`;
      actionable = false;
      nextTradingSession = `Today 9:30 AM EST`;
      break;

    case "weekend":
      nextTradingSession = getNextTradingSession(currentTime);
      display = `Weekend signal - Valid ${nextTradingSession}`;
      actionable = false;
      break;

    case "holiday":
      nextTradingSession = getNextTradingSession(currentTime);
      display = `Holiday signal - Valid ${nextTradingSession}`;
      actionable = false;
      break;

    default:
      display = "Signal generated during market closure";
      actionable = false;
  }

  return {
    display,
    context,
    actionable,
    nextTradingSession,
    timeOnly,
    contextBadge,
  };
}

/**
 * Get simple display for current context (for header badges, etc.)
 */
export function getMarketContextBadge(): {
  text: string;
  color: "green" | "yellow" | "red" | "gray";
  pulsing: boolean;
} {
  const currentTime = getCurrentEasternTime();
  const { context } = getMarketStatus(currentTime);

  switch (context) {
    case "live":
      return { text: "Market Open", color: "green", pulsing: true };
    case "pre-market":
      return { text: "Pre-Market", color: "yellow", pulsing: false };
    case "after-hours":
      return { text: "After Hours", color: "yellow", pulsing: false };
    case "weekend":
      return { text: "Weekend", color: "gray", pulsing: false };
    case "holiday":
      return { text: "Market Holiday", color: "red", pulsing: false };
    default:
      return { text: "Market Closed", color: "gray", pulsing: false };
  }
}

/**
 * Check if it's currently a good time to generate signals
 */
export function isGoodTimeForSignalGeneration(): boolean {
  const { context } = getMarketStatus(getCurrentEasternTime());
  // Generate signals during market hours and pre-market for next session
  return context === "live" || context === "pre-market";
}

/**
 * Simple timestamp formatter for basic displays (backwards compatible)
 */
export function formatSimpleTimestamp(timestamp: Date | string): string {
  const signalTime =
    typeof timestamp === "string" ? new Date(timestamp) : timestamp;
  return formatUserTime(signalTime, true);
}
