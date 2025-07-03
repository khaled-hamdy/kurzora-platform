// Dynamic Filter Configuration with Real Database Sectors
// File: src/config/filterConfig.ts

// 🌍 MARKET CONFIGURATION (unchanged)
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

// 🎨 SECTOR ICON AND COLOR MAPPING
// Maps database sector names to UI elements
const SECTOR_MAPPING = {
  technology: {
    icon: "💻",
    color: "bg-blue-600",
    description: "Software, hardware, and tech services",
  },
  "financial services": {
    icon: "🏦",
    color: "bg-green-600",
    description: "Banks, insurance, and financial services",
  },
  financial: {
    icon: "🏦",
    color: "bg-green-600",
    description: "Banks, insurance, and financial services",
  },
  industrials: {
    icon: "🏭",
    color: "bg-gray-600",
    description: "Manufacturing and industrial companies",
  },
  "basic materials": {
    icon: "🏗️",
    color: "bg-amber-600",
    description: "Mining, chemicals, and raw materials",
  },
  materials: {
    icon: "🏗️",
    color: "bg-amber-600",
    description: "Mining, chemicals, and raw materials",
  },
  "consumer cyclical": {
    icon: "🛍️",
    color: "bg-purple-600",
    description: "Retail and consumer discretionary",
  },
  "consumer defensive": {
    icon: "🥫",
    color: "bg-emerald-600",
    description: "Food, beverages, and staples",
  },
  "real estate": {
    icon: "🏠",
    color: "bg-red-600",
    description: "REITs and real estate companies",
  },
  healthcare: {
    icon: "🏥",
    color: "bg-pink-600",
    description: "Pharmaceuticals and medical devices",
  },
  energy: {
    icon: "⚡",
    color: "bg-yellow-600",
    description: "Oil, gas, and energy companies",
  },
  utilities: {
    icon: "💡",
    color: "bg-cyan-600",
    description: "Electric, gas, and water utilities",
  },
  communication: {
    icon: "📱",
    color: "bg-indigo-600",
    description: "Telecommunications and media",
  },
  crypto: {
    icon: "₿",
    color: "bg-orange-600",
    description: "Cryptocurrency and blockchain",
  },
};

// 🔄 DYNAMIC SECTOR CONFIGURATION
// Interface for sector config to maintain type safety
export interface SectorConfig {
  label: string;
  icon: string;
  description: string;
  color: string;
}

// Generate filter value from sector name
const createSectorKey = (sectorName: string): string => {
  return sectorName.toLowerCase().replace(/\s+/g, " ").trim();
};

// Get UI elements for a sector
const getSectorUIElements = (
  sectorName: string
): { icon: string; color: string; description: string } => {
  const normalizedName = sectorName.toLowerCase().trim();

  // Try exact match first
  if (SECTOR_MAPPING[normalizedName as keyof typeof SECTOR_MAPPING]) {
    return SECTOR_MAPPING[normalizedName as keyof typeof SECTOR_MAPPING];
  }

  // Try partial matches for flexibility
  for (const [key, value] of Object.entries(SECTOR_MAPPING)) {
    if (normalizedName.includes(key) || key.includes(normalizedName)) {
      return value;
    }
  }

  // Default fallback
  return { icon: "🏢", color: "bg-slate-600", description: sectorName };
};

// Generate dynamic sector configuration
export const generateDynamicSectorConfig = (
  realSectors: string[]
): Record<string, SectorConfig> => {
  console.log("🔧 Generating dynamic sector config from:", realSectors);

  // Start with "All Sectors" option
  const config: Record<string, SectorConfig> = {
    all: {
      label: "All Sectors",
      icon: "📊",
      description: "All industry sectors",
      color: "bg-slate-600",
    },
  };

  // Add real sectors from database
  realSectors.forEach((sectorName) => {
    if (sectorName && sectorName.trim()) {
      const key = createSectorKey(sectorName);
      const uiElements = getSectorUIElements(sectorName);

      config[key] = {
        label: sectorName,
        icon: uiElements.icon,
        description: uiElements.description,
        color: uiElements.color,
      };
    }
  });

  console.log("✅ Generated sector config:", Object.keys(config));
  return config;
};

// 🔧 FALLBACK SECTOR CONFIGURATION (for when dynamic loading fails)
export const FALLBACK_SECTOR_CONFIG = {
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
  "financial services": {
    label: "Financial Services",
    icon: "🏦",
    description: "Banks, insurance, and financial services",
    color: "bg-green-600",
  },
  industrials: {
    label: "Industrials",
    icon: "🏭",
    description: "Manufacturing and industrial companies",
    color: "bg-gray-600",
  },
  "basic materials": {
    label: "Basic Materials",
    icon: "🏗️",
    description: "Mining, chemicals, and raw materials",
    color: "bg-amber-600",
  },
  "consumer cyclical": {
    label: "Consumer Cyclical",
    icon: "🛍️",
    description: "Retail and consumer discretionary",
    color: "bg-purple-600",
  },
  "consumer defensive": {
    label: "Consumer Defensive",
    icon: "🥫",
    description: "Food, beverages, and staples",
    color: "bg-emerald-600",
  },
  "real estate": {
    label: "Real Estate",
    icon: "🏠",
    description: "REITs and real estate companies",
    color: "bg-red-600",
  },
};

// 📊 DEFAULT EXPORT (maintains backward compatibility)
export const SECTOR_CONFIG = FALLBACK_SECTOR_CONFIG;

// ⏰ TIMEFRAME CONFIGURATION (unchanged)
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

// 🎯 SCORE THRESHOLDS (unchanged)
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

// 🔧 HELPER FUNCTIONS (enhanced for dynamic sectors)
export const getMarketLabel = (marketKey: string): string => {
  return (
    MARKET_CONFIG[marketKey as keyof typeof MARKET_CONFIG]?.label || marketKey
  );
};

export const getSectorLabel = (
  sectorKey: string,
  dynamicConfig?: Record<string, SectorConfig>
): string => {
  // Use dynamic config if provided, otherwise fall back to static config
  const configToUse = dynamicConfig || SECTOR_CONFIG;
  return configToUse[sectorKey]?.label || sectorKey;
};

export const getSectorIcon = (
  sectorKey: string,
  dynamicConfig?: Record<string, SectorConfig>
): string => {
  const configToUse = dynamicConfig || SECTOR_CONFIG;
  return configToUse[sectorKey]?.icon || "🏢";
};

export const getSectorColor = (
  sectorKey: string,
  dynamicConfig?: Record<string, SectorConfig>
): string => {
  const configToUse = dynamicConfig || SECTOR_CONFIG;
  return configToUse[sectorKey]?.color || "bg-slate-600";
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

// 📋 TYPE DEFINITIONS (enhanced)
export type MarketKey = keyof typeof MARKET_CONFIG;
export type SectorKey = string; // Now dynamic, so can't be keyof
export type TimeframeKey = keyof typeof TIMEFRAME_CONFIG;

export interface FilterOptions {
  market: MarketKey;
  sector: SectorKey;
  timeframe: TimeframeKey;
  scoreThreshold: number[];
}

// 🚀 HOOK FOR DYNAMIC SECTOR CONFIG
// This integrates with useSectorData to provide real-time sector configuration
export const useDynamicSectorConfig = () => {
  // This would integrate with your useSectorData hook
  // For now, it returns the fallback config
  // In the enhanced version, it would return generateDynamicSectorConfig(realSectors)

  // TODO: Integrate with useSectorData hook
  // const { sectors } = useSectorData();
  // return generateDynamicSectorConfig(sectors.map(s => s.name));

  return FALLBACK_SECTOR_CONFIG;
};
