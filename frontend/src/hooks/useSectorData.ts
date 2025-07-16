// Production Sector Data Hook - Database Integration
// File: src/hooks/useSectorData.ts
// 🎯 PURPOSE: Fetch real sectors from active_stocks table for Dashboard and Signals filtering
// 🔧 SESSION #178: Complete rewrite to use actual Supabase database instead of fake APIs
// 🛡️ PRESERVATION: Maintains exact interface for existing components
// 📝 HANDOVER: Queries active_stocks table for 11 real sectors, "All Sectors" added by generateDynamicSectorConfig

import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";

// Interface for sector data returned by this hook
interface SectorData {
  name: string;
  value: string;
  icon: string;
  count?: number;
}

// Interface for hook return value
interface SectorDataState {
  sectors: SectorData[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

// Sector icon mapping for consistent UI across all sectors
const SECTOR_ICONS: Record<string, string> = {
  technology: "💻",
  "consumer discretionary": "🛍️",
  "consumer staples": "🥫",
  energy: "⚡",
  healthcare: "🏥",
  industrials: "🏭",
  "real estate": "🏠",
  materials: "🏗️",
  "communication services": "📱",
  "financial services": "🏦",
  utilities: "💡",
  // Default fallback
  default: "📊",
};

// Cache configuration for performance
const SECTOR_CACHE_KEY = "kurzora_sectors_cache";
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export const useSectorData = (): SectorDataState => {
  // State management
  const [sectors, setSectors] = useState<SectorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get sector icon based on sector name
  const getSectorIcon = (sectorName: string): string => {
    const normalizedName = sectorName.toLowerCase();
    return SECTOR_ICONS[normalizedName] || SECTOR_ICONS.default;
  };

  // Create filter value from sector name (for filtering compatibility)
  const createFilterValue = (sectorName: string): string => {
    return sectorName.toLowerCase().replace(/\s+/g, " ").trim();
  };

  // Load cached sectors from session storage
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

  // Cache sectors to session storage
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

  // Fetch sectors from active_stocks table in database
  const fetchSectorsFromDatabase = async (): Promise<SectorData[]> => {
    try {
      console.log("🔍 Fetching sectors from active_stocks table...");

      // Query active_stocks table for unique sectors with counts
      const { data, error } = await supabase
        .from("active_stocks")
        .select("sector")
        .not("sector", "is", null)
        .not("sector", "eq", "");

      if (error) {
        console.error("❌ Database query error:", error);
        throw error;
      }

      if (!data || !Array.isArray(data)) {
        throw new Error("Invalid response format from database");
      }

      // Count sectors and create unique list
      const sectorCounts = new Map<string, number>();
      data.forEach((row) => {
        if (row.sector && row.sector.trim()) {
          const sector = row.sector.trim();
          sectorCounts.set(sector, (sectorCounts.get(sector) || 0) + 1);
        }
      });

      // Convert to SectorData format (only real sectors, no "All Sectors")
      const sectorData: SectorData[] = [];

      // Add real sectors sorted alphabetically
      Array.from(sectorCounts.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .forEach(([sectorName, count]) => {
          sectorData.push({
            name: sectorName,
            value: createFilterValue(sectorName),
            icon: getSectorIcon(sectorName),
            count: count,
          });
        });

      console.log(`✅ Found ${sectorCounts.size} unique sectors from database`);
      console.log("📊 Sectors:", Array.from(sectorCounts.keys()));

      return sectorData;
    } catch (error) {
      console.error("❌ Failed to fetch sectors from database:", error);
      throw error;
    }
  };

  // Main fetch function with caching
  const fetchSectors = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Try cache first for performance
      const cached = loadCachedSectors();
      if (cached && cached.length > 0) {
        console.log("📦 Using cached sectors:", cached.length);
        setSectors(cached);
        setLoading(false);
        return;
      }

      // Fetch fresh data from database
      console.log("🔍 Fetching fresh sector data from database...");
      const sectorData = await fetchSectorsFromDatabase();

      // Cache successful result
      cacheSectors(sectorData);

      // Update state
      setSectors(sectorData);
      console.log("📊 Sectors loaded successfully:", sectorData.length);
    } catch (error) {
      console.error("❌ Failed to load sectors:", error);
      setError("Failed to load sectors from database");

      // Set minimal fallback to prevent UI breaking (no "All Sectors" - let generateDynamicSectorConfig handle it)
      setSectors([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh function to force reload
  const refresh = useCallback(() => {
    sessionStorage.removeItem(SECTOR_CACHE_KEY);
    fetchSectors();
  }, [fetchSectors]);

  // Initial load on component mount
  useEffect(() => {
    fetchSectors();
  }, [fetchSectors]);

  // Debug logging for development
  console.log("🔍 useSectorData - Current state:", {
    sectorsCount: sectors.length,
    loading,
    error,
    sectors: sectors.map((s) => `${s.name} (${s.count})`),
  });

  return {
    sectors,
    loading,
    error,
    refresh,
  };
};
