// Dynamic Sector Data Hook - Polygon.io Integration
// File: src/hooks/useSectorData.ts

import { useState, useEffect, useCallback } from "react";

interface SectorData {
  name: string;
  value: string;
  icon: string;
  count?: number;
}

interface SectorDataState {
  sectors: SectorData[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

// Sector icon mapping for consistent UI
const SECTOR_ICONS: Record<string, string> = {
  technology: "💻",
  financial: "🏦",
  healthcare: "🏥",
  industrial: "🏭",
  materials: "🏗️",
  "basic materials": "🏗️",
  energy: "⚡",
  utilities: "💡",
  "real estate": "🏠",
  "consumer cyclical": "🛍️",
  "consumer defensive": "🥫",
  "consumer discretionary": "🛍️",
  "consumer staples": "🥫",
  communication: "📱",
  telecommunications: "📞",
  aerospace: "✈️",
  automotive: "🚗",
  retail: "🛒",
  default: "🏢",
};

// Fallback sectors (current known sectors from your database)
const FALLBACK_SECTORS: SectorData[] = [
  { name: "Technology", value: "technology", icon: "💻" },
  { name: "Financial Services", value: "financial", icon: "🏦" },
  { name: "Industrials", value: "industrials", icon: "🏭" },
  { name: "Basic Materials", value: "basic materials", icon: "🏗️" },
  { name: "Consumer Cyclical", value: "consumer cyclical", icon: "🛍️" },
  { name: "Consumer Defensive", value: "consumer defensive", icon: "🥫" },
  { name: "Real Estate", value: "real estate", icon: "🏠" },
];

// Cache key for session storage
const SECTOR_CACHE_KEY = "kurzora_sectors_cache";
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export const useSectorData = (): SectorDataState => {
  const [sectors, setSectors] = useState<SectorData[]>(FALLBACK_SECTORS); // Initialize with fallback
  const [loading, setLoading] = useState(false); // Start with false, show sectors immediately
  const [error, setError] = useState<string | null>(null);

  // Debug logging
  console.log("🔍 useSectorData - Current state:", {
    sectorsCount: sectors.length,
    loading,
    error,
    sectors: sectors.map((s) => s.name),
  });

  // Get sector icon based on name
  const getSectorIcon = (sectorName: string): string => {
    const normalizedName = sectorName.toLowerCase();
    return SECTOR_ICONS[normalizedName] || SECTOR_ICONS.default;
  };

  // Create filter value from sector name
  const createFilterValue = (sectorName: string): string => {
    return sectorName.toLowerCase().replace(/\s+/g, " ").trim();
  };

  // Load cached sectors
  const loadCachedSectors = (): SectorData[] | null => {
    try {
      const cached = sessionStorage.getItem(SECTOR_CACHE_KEY);
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);
      const isExpired = Date.now() - timestamp > CACHE_DURATION;

      if (isExpired) {
        sessionStorage.removeItem(SECTOR_CACHE_KEY);
        return null;
      }

      console.log("📦 Using cached sector data");
      return data;
    } catch (error) {
      console.warn("Failed to load cached sectors:", error);
      return null;
    }
  };

  // Cache sectors
  const cacheSectors = (sectorData: SectorData[]) => {
    try {
      const cacheObject = {
        data: sectorData,
        timestamp: Date.now(),
      };
      sessionStorage.setItem(SECTOR_CACHE_KEY, JSON.stringify(cacheObject));
      console.log("💾 Cached sector data");
    } catch (error) {
      console.warn("Failed to cache sectors:", error);
    }
  };

  // Fetch sectors from Polygon.io
  const fetchSectorsFromPolygon = async (): Promise<SectorData[]> => {
    const apiKey = import.meta.env.VITE_POLYGON_API_KEY;

    if (!apiKey) {
      throw new Error("Polygon.io API key not configured");
    }

    console.log("🔍 Fetching sectors from Polygon.io...");

    // Method 1: Try getting sectors from stock universe endpoint
    try {
      // First, let's get a sample of tickers to extract sectors
      const response = await fetch(
        `https://api.polygon.io/v3/reference/tickers?market=stocks&active=true&limit=1000&apikey=${apiKey}`
      );

      if (!response.ok) {
        throw new Error(`Polygon API error: ${response.status}`);
      }

      const data = await response.json();

      if (!data.results || !Array.isArray(data.results)) {
        throw new Error("Invalid response format from Polygon.io");
      }

      // Extract unique sectors
      const sectorSet = new Set<string>();
      data.results.forEach((ticker: any) => {
        if (ticker.sic_description) {
          // Use SIC description as sector
          sectorSet.add(ticker.sic_description);
        }
        if (ticker.sector) {
          sectorSet.add(ticker.sector);
        }
      });

      // Convert to our format
      const polygonSectors: SectorData[] = Array.from(sectorSet)
        .filter((sector) => sector && sector.trim().length > 0)
        .map((sectorName) => ({
          name: sectorName,
          value: createFilterValue(sectorName),
          icon: getSectorIcon(sectorName),
        }))
        .sort((a, b) => a.name.localeCompare(b.name));

      console.log(`✅ Found ${polygonSectors.length} sectors from Polygon.io`);
      return polygonSectors;
    } catch (error) {
      console.error("❌ Failed to fetch from Polygon.io:", error);
      throw error;
    }
  };

  // Fetch sectors from your own database as backup
  const fetchSectorsFromDatabase = async (): Promise<SectorData[]> => {
    try {
      console.log("🔍 Fetching sectors from database...");

      // This would use your existing useSignalsPageData or similar
      // For now, we'll use the current known sectors
      // In a real implementation, you'd query your Supabase table

      const response = await fetch("/api/sectors"); // This would be your API endpoint

      // If API doesn't exist yet, use fallback
      console.log("📊 Using fallback sector data");
      return FALLBACK_SECTORS;
    } catch (error) {
      console.log("📊 Using fallback sector data");
      return FALLBACK_SECTORS;
    }
  };

  // Main fetch function with fallback strategy
  const fetchSectors = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Try cache first
      const cached = loadCachedSectors();
      if (cached && cached.length > 0) {
        console.log("📦 Using cached sectors:", cached.length);
        setSectors(cached);
        setLoading(false);
        return;
      }

      let sectorData: SectorData[] = FALLBACK_SECTORS; // Default to fallback

      try {
        // Primary: Try Polygon.io
        console.log("🔍 Attempting Polygon.io fetch...");
        sectorData = await fetchSectorsFromPolygon();
        console.log(
          "✅ Successfully fetched sectors from Polygon.io:",
          sectorData.length
        );
      } catch (polygonError) {
        console.warn("⚠️ Polygon.io failed, using fallback...", polygonError);
        sectorData = FALLBACK_SECTORS;
      }

      // Always ensure we have sectors
      if (!sectorData || sectorData.length === 0) {
        console.log("⚠️ No sectors fetched, using fallback");
        sectorData = FALLBACK_SECTORS;
      }

      // Cache successful result (only if from Polygon)
      if (sectorData !== FALLBACK_SECTORS) {
        cacheSectors(sectorData);
      }

      setSectors(sectorData);
      console.log(
        "📊 Final sectors set:",
        sectorData.map((s) => s.name)
      );
    } catch (error) {
      console.error("❌ All sector fetch methods failed:", error);
      setError("Failed to load sectors");
      setSectors(FALLBACK_SECTORS); // Always provide fallback
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh function to force reload
  const refresh = useCallback(() => {
    sessionStorage.removeItem(SECTOR_CACHE_KEY);
    fetchSectors();
  }, [fetchSectors]);

  // Initial load
  useEffect(() => {
    fetchSectors();
  }, [fetchSectors]);

  return {
    sectors,
    loading,
    error,
    refresh,
  };
};
