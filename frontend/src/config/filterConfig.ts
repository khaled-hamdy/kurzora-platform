// 🌍 MARKET CONFIGURATION
// This defines all the markets your platform supports with proper flags and labels

export const MARKET_CONFIG = {
  global: {
    label: "Global",
    icon: "🌍",
    countries: ["All Countries"],
    description: "All markets worldwide",
  },
  usa: {
    label: "USA",
    icon: "🇺🇸",
    countries: ["United States"],
    description: "United States stock market",
  },
  saudi: {
    label: "Saudi Arabia",
    icon: "🇸🇦",
    countries: ["Saudi Arabia"],
    description: "Tadawul (Saudi Stock Exchange)",
  },
  uae: {
    label: "UAE",
    icon: "🇦🇪",
    countries: ["United Arab Emirates"],
    description: "Abu Dhabi & Dubai stock exchanges",
  },
  qatar: {
    label: "Qatar",
    icon: "🇶🇦",
    countries: ["Qatar"],
    description: "Qatar Stock Exchange",
  },
  kuwait: {
    label: "Kuwait",
    icon: "🇰🇼",
    countries: ["Kuwait"],
    description: "Boursa Kuwait",
  },
  bahrain: {
    label: "Bahrain",
    icon: "🇧🇭",
    countries: ["Bahrain"],
    description: "Bahrain Bourse",
  },
};

// 🏢 SECTOR CONFIGURATION
// This defines all the sectors your platform tracks with proper icons and descriptions

export const SECTOR_CONFIG = {
  all: {
    label: "All Sectors",
    icon: "📊",
    description: "All industry sectors",
    color: "bg-slate-600",
  },
  technology: {
    label: "Technology",
    icon: "💻",
    description: "Software, hardware, and tech services",
    color: "bg-blue-600",
  },
  finance: {
    label: "Finance",
    icon: "🏦",
    description: "Banks, insurance, and financial services",
    color: "bg-green-600",
  },
  healthcare: {
    label: "Healthcare",
    icon: "🏥",
    description: "Pharmaceuticals, medical devices, and health services",
    color: "bg-red-600",
  },
  energy: {
    label: "Energy",
    icon: "⚡",
    description: "Oil, gas, renewable energy, and utilities",
    color: "bg-yellow-600",
  },
  consumer: {
    label: "Consumer",
    icon: "🛒",
    description: "Retail, consumer goods, and services",
    color: "bg-purple-600",
  },
  crypto: {
    label: "Crypto",
    icon: "₿",
    description: "Cryptocurrency and blockchain companies",
    color: "bg-orange-600",
  },
};

// ⏰ TIMEFRAME CONFIGURATION
// This defines the different chart timeframes available

export const TIMEFRAME_CONFIG = {
  "1H": {
    label: "1 Hour",
    description: "Short-term signals",
    icon: "⚡",
  },
  "4H": {
    label: "4 Hours",
    description: "Intraday signals",
    icon: "📈",
  },
  "1D": {
    label: "1 Day",
    description: "Daily signals",
    icon: "📊",
  },
  "1W": {
    label: "1 Week",
    description: "Weekly signals",
    icon: "📅",
  },
};

// 🎯 SCORE THRESHOLDS
// This defines the score ranges and their meanings

export const SCORE_CONFIG = {
  ranges: {
    strong: { min: 90, max: 100, label: "Strong", color: "bg-green-500" },
    moderate: { min: 80, max: 89, label: "Moderate", color: "bg-yellow-500" },
    weak: { min: 70, max: 79, label: "Weak", color: "bg-orange-500" },
    poor: { min: 0, max: 69, label: "Poor", color: "bg-red-500" },
  },
  defaultThreshold: 70,
  minimumThreshold: 60,
  maximumThreshold: 100,
};

// 🔧 HELPER FUNCTIONS
// Utility functions to work with the configurations

export const getMarketLabel = (marketKey: string): string => {
  return (
    MARKET_CONFIG[marketKey as keyof typeof MARKET_CONFIG]?.label || marketKey
  );
};

export const getSectorLabel = (sectorKey: string): string => {
  return (
    SECTOR_CONFIG[sectorKey as keyof typeof SECTOR_CONFIG]?.label || sectorKey
  );
};

export const getScoreColor = (score: number): string => {
  if (score >= 90) return SCORE_CONFIG.ranges.strong.color;
  if (score >= 80) return SCORE_CONFIG.ranges.moderate.color;
  if (score >= 70) return SCORE_CONFIG.ranges.weak.color;
  return SCORE_CONFIG.ranges.poor.color;
};

export const getScoreLabel = (score: number): string => {
  if (score >= 90) return SCORE_CONFIG.ranges.strong.label;
  if (score >= 80) return SCORE_CONFIG.ranges.moderate.label;
  if (score >= 70) return SCORE_CONFIG.ranges.weak.label;
  return SCORE_CONFIG.ranges.poor.label;
};

// 📋 TYPE DEFINITIONS
// TypeScript types for better development experience

export type MarketKey = keyof typeof MARKET_CONFIG;
export type SectorKey = keyof typeof SECTOR_CONFIG;
export type TimeframeKey = keyof typeof TIMEFRAME_CONFIG;

export interface FilterOptions {
  market: MarketKey;
  sector: SectorKey;
  timeframe: TimeframeKey;
  scoreThreshold: number[];
}
