// Google Analytics 4 Configuration for Kurzora (Vite Compatible)
// File: src/lib/analytics.ts

// 🎯 Get Google Analytics ID from Vite environment variables
export const GA_MEASUREMENT_ID =
  import.meta.env.VITE_GA_MEASUREMENT_ID || "G-1F84JH8BET";

// Declare gtag function for TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

// Initialize Google Analytics
export const initGA = () => {
  if (typeof window !== "undefined" && GA_MEASUREMENT_ID) {
    console.log("🎯 Initializing Google Analytics with ID:", GA_MEASUREMENT_ID);

    // Initialize gtag if it exists
    if (window.gtag) {
      window.gtag("config", GA_MEASUREMENT_ID, {
        page_title: document.title,
        page_location: window.location.href,
      });
    }
  }
};

// Track page views
export const trackPageView = (url: string) => {
  if (typeof window !== "undefined" && GA_MEASUREMENT_ID && window.gtag) {
    console.log("📊 Tracking page view:", url);
    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

// Track custom events
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (typeof window !== "undefined" && GA_MEASUREMENT_ID && window.gtag) {
    console.log("🎯 Tracking event:", action, category, label);
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// 🎯 KURZORA-SPECIFIC TRACKING EVENTS

// Track when user views a signal
export const trackSignalView = (
  signalId: string,
  signalTicker: string,
  signalScore: number
) => {
  trackEvent(
    "view_signal",
    "signals",
    `${signalTicker}-${signalId}`,
    signalScore
  );
};

// Track when user starts a trial
export const trackTrialStart = (tier: string) => {
  trackEvent("trial_start", "subscription", tier);
};

// Track when user subscribes (this is MONEY! 💰)
export const trackSubscription = (tier: string, amount: number) => {
  trackEvent("purchase", "subscription", tier, amount);
};

// Track when user executes a paper trade
export const trackSignalExecute = (signalId: string, signalTicker: string) => {
  trackEvent("execute_trade", "paper_trading", `${signalTicker}-${signalId}`);
};

// Track when user uses filters (helps understand what they want)
export const trackFilterUse = (filterType: string, filterValue: string) => {
  trackEvent("use_filter", "signals", `${filterType}-${filterValue}`);
};

// Track dashboard visits
export const trackDashboardView = () => {
  trackEvent("page_view", "dashboard", "main_dashboard");
};

// Track when user changes settings
export const trackSettingsChange = (settingType: string, newValue: string) => {
  trackEvent("change_setting", "settings", `${settingType}-${newValue}`);
};

// Track when user views TradingView charts
export const trackChartView = (symbol: string) => {
  trackEvent("view_chart", "charts", symbol);
};

// Track email alerts toggle
export const trackEmailAlert = (enabled: boolean) => {
  trackEvent("toggle_email_alerts", "alerts", enabled ? "enabled" : "disabled");
};

// Track Telegram alerts toggle
export const trackTelegramAlert = (enabled: boolean) => {
  trackEvent(
    "toggle_telegram_alerts",
    "alerts",
    enabled ? "enabled" : "disabled"
  );
};

// Export all tracking functions for easy import
export const analytics = {
  init: initGA,
  trackPageView,
  trackEvent,
  trackSignalView,
  trackTrialStart,
  trackSubscription,
  trackSignalExecute,
  trackFilterUse,
  trackDashboardView,
  trackSettingsChange,
  trackChartView,
  trackEmailAlert,
  trackTelegramAlert,
};
