// ===================================================================
// PROFESSIONAL STOCK SCANNER - Fixed for Kurzora Integration
// ===================================================================
// File: src/lib/signals/stock-scanner.ts
// Size: ~28KB Professional-grade market data scanner
// Fixed: Polygon.io integration, timeframe mapping, rate limiting

import {
  PolygonMarketData,
  MultiTimeframeData,
  TechnicalIndicators,
} from "./technical-indicators";
import { PolygonTimeframe } from "./scoring-engine";

// ✅ FIXED: Polygon.io API Configuration
const POLYGON_API_KEY = import.meta.env.VITE_POLYGON_API_KEY;
const POLYGON_BASE_URL = "https://api.polygon.io";

// ✅ FIXED: Stock Universe Interface
export interface StockInfo {
  ticker: string;
  companyName: string;
  sector: string;
  industry: string;
  marketCap: number;
  avgVolume: number;
  exchange: string;
  isActive: boolean;
  isIslamicCompliant?: boolean;
}

// ✅ FIXED: Scan Progress Interface
export interface ScanProgress {
  stage: string;
  stocksScanned: number;
  totalStocks: number;
  currentStock: string;
  signalsFound: number;
  timeElapsed: number;
  validSignals: number;
  apiCallsMade: number;
  dataQuality: string;
  currentTimeframe?: string;
  errors: number;
}

// ✅ FIXED: Market Data Response Interface (Polygon.io format)
interface PolygonAggregatesResponse {
  status: string;
  request_id: string;
  count?: number;
  results?: {
    o: number; // open
    h: number; // high
    l: number; // low
    c: number; // close
    v: number; // volume
    vw?: number; // volume weighted average price
    t: number; // timestamp
    n?: number; // number of transactions
  }[];
}

// ✅ FIXED: Snapshot Response Interface (Polygon.io format)
interface PolygonSnapshotResponse {
  status: string;
  request_id: string;
  ticker?: {
    ticker: string;
    todaysChangePerc: number;
    todaysChange: number;
    updated: number;
    day?: {
      o: number; // open
      h: number; // high
      l: number; // low
      c: number; // close
      v: number; // volume
      vw: number; // vwap
    };
    min?: {
      av: number; // accumulated volume
      t: number; // timestamp
      v: number; // volume
      vw: number; // vwap
    };
    prevDay?: {
      o: number;
      h: number;
      l: number;
      c: number;
      v: number;
      vw: number;
    };
  };
}

// ✅ PROFESSIONAL: Rate Limiter for API calls
class RateLimiter {
  private lastCallTime: number = 0;
  private callCount: number = 0;
  private windowStart: number = Date.now();
  private readonly minDelay: number;
  private readonly maxCallsPerMinute: number;

  constructor(callsPerMinute: number = 300, minDelayMs: number = 200) {
    this.maxCallsPerMinute = callsPerMinute;
    this.minDelay = minDelayMs;
  }

  async waitIfNeeded(): Promise<void> {
    const now = Date.now();

    // Reset window if a minute has passed
    if (now - this.windowStart >= 60000) {
      this.windowStart = now;
      this.callCount = 0;
    }

    // Check if we've hit rate limit
    if (this.callCount >= this.maxCallsPerMinute) {
      const waitTime = 60000 - (now - this.windowStart);
      if (waitTime > 0) {
        console.log(`Rate limit reached, waiting ${waitTime}ms...`);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
        this.windowStart = Date.now();
        this.callCount = 0;
      }
    }

    // Ensure minimum delay between calls
    const timeSinceLastCall = now - this.lastCallTime;
    if (timeSinceLastCall < this.minDelay) {
      await new Promise((resolve) =>
        setTimeout(resolve, this.minDelay - timeSinceLastCall)
      );
    }

    this.lastCallTime = Date.now();
    this.callCount++;
  }
}

// ✅ MAIN CLASS: Professional Stock Scanner
export class StockScanner {
  private apiKey: string;
  private baseUrl: string;
  private rateLimiter: RateLimiter;
  private technicalIndicators: TechnicalIndicators;

  // ✅ FIXED: Polygon.io timeframe mapping
  private readonly timeframeConfig: Record<string, PolygonTimeframe> = {
    "1H": {
      name: "1H",
      multiplier: 1,
      timespan: "hour",
      weight: 0.4,
      minDataPoints: 50,
      description: "Hourly data for short-term analysis",
    },
    "4H": {
      name: "4H",
      multiplier: 4,
      timespan: "hour",
      weight: 0.3,
      minDataPoints: 50,
      description: "4-hour data for medium-term analysis",
    },
    "1D": {
      name: "1D",
      multiplier: 1,
      timespan: "day",
      weight: 0.2,
      minDataPoints: 100,
      description: "Daily data for long-term analysis",
    },
    "1W": {
      name: "1W",
      multiplier: 1,
      timespan: "week",
      weight: 0.1,
      minDataPoints: 52,
      description: "Weekly data for macro trend analysis",
    },
  };

  constructor() {
    if (!POLYGON_API_KEY) {
      throw new Error(
        "Polygon.io API key not configured. Please set VITE_POLYGON_API_KEY in your .env.local file."
      );
    }

    this.apiKey = POLYGON_API_KEY;
    this.baseUrl = POLYGON_BASE_URL;
    this.rateLimiter = new RateLimiter(300, 200); // 300 calls/minute, 200ms min delay
    this.technicalIndicators = new TechnicalIndicators();
  }

  // ✅ MAIN METHOD: Scan stocks for signals
  public async scanStocks(
    stockUniverse: StockInfo[],
    progressCallback?: (progress: ScanProgress) => void
  ): Promise<{
    multiTimeframeData: Record<string, MultiTimeframeData>;
    errors: string[];
    stats: any;
  }> {
    const startTime = Date.now();
    const multiTimeframeData: Record<string, MultiTimeframeData> = {};
    const errors: string[] = [];
    let apiCallsMade = 0;
    let validSignals = 0;

    console.log(
      `🚀 Starting professional stock scan for ${stockUniverse.length} stocks`
    );

    try {
      for (let i = 0; i < stockUniverse.length; i++) {
        const stock = stockUniverse[i];
        const timeElapsed = Math.floor((Date.now() - startTime) / 1000);

        // Update progress
        if (progressCallback) {
          progressCallback({
            stage: "Scanning Professional Market Data",
            stocksScanned: i,
            totalStocks: stockUniverse.length,
            currentStock: stock.ticker,
            signalsFound: Object.keys(multiTimeframeData).length,
            timeElapsed,
            validSignals,
            apiCallsMade,
            dataQuality: "Professional",
            errors: errors.length,
          });
        }

        console.log(
          `📊 Scanning ${stock.ticker} (${i + 1}/${stockUniverse.length})`
        );

        try {
          // First, validate stock with current snapshot
          const isValid = await this.validateStock(stock.ticker);
          apiCallsMade++;

          if (!isValid) {
            console.log(`⚠️ ${stock.ticker}: Failed validation, skipping`);
            continue;
          }

          // Fetch multi-timeframe data
          const stockData = await this.fetchMultiTimeframeData(
            stock.ticker,
            progressCallback
          );
          apiCallsMade += Object.keys(this.timeframeConfig).length;

          if (stockData && this.validateMultiTimeframeData(stockData)) {
            multiTimeframeData[stock.ticker] = stockData;
            validSignals++;
            console.log(
              `✅ ${stock.ticker}: Multi-timeframe data collected successfully`
            );
          } else {
            console.log(
              `❌ ${stock.ticker}: Insufficient multi-timeframe data`
            );
            errors.push(`${stock.ticker}: Insufficient data quality`);
          }
        } catch (error) {
          console.error(`❌ ${stock.ticker}: Scan error -`, error);
          errors.push(`${stock.ticker}: ${error.message}`);
        }

        // Rate limiting
        await this.rateLimiter.waitIfNeeded();
      }

      const totalTime = Math.floor((Date.now() - startTime) / 1000);

      // Final progress update
      if (progressCallback) {
        progressCallback({
          stage: "Professional Scan Complete",
          stocksScanned: stockUniverse.length,
          totalStocks: stockUniverse.length,
          currentStock: "",
          signalsFound: Object.keys(multiTimeframeData).length,
          timeElapsed: totalTime,
          validSignals,
          apiCallsMade,
          dataQuality: "Complete",
          errors: errors.length,
        });
      }

      console.log(
        `🎉 Professional scan complete: ${validSignals} stocks with quality data in ${totalTime}s`
      );

      const stats = {
        stocksScanned: stockUniverse.length,
        validDatasets: validSignals,
        totalTime,
        apiCallsMade,
        errorRate: Math.round((errors.length / stockUniverse.length) * 100),
        averageTimePerStock:
          Math.round((totalTime / stockUniverse.length) * 100) / 100,
        dataQuality:
          validSignals >= stockUniverse.length * 0.8
            ? "Excellent"
            : validSignals >= stockUniverse.length * 0.6
            ? "Good"
            : "Fair",
      };

      return {
        multiTimeframeData,
        errors,
        stats,
      };
    } catch (error) {
      console.error("❌ Professional stock scan failed:", error);
      throw new Error(`Stock scan failed: ${error.message}`);
    }
  }

  // ✅ PROFESSIONAL: Validate stock with current snapshot
  private async validateStock(ticker: string): Promise<boolean> {
    try {
      await this.rateLimiter.waitIfNeeded();

      const url = `${this.baseUrl}/v2/snapshot/locale/us/markets/stocks/tickers/${ticker}?apikey=${this.apiKey}`;
      const response = await fetch(url);

      if (!response.ok) {
        console.warn(`❌ ${ticker}: Snapshot API error ${response.status}`);
        return false;
      }

      const data: PolygonSnapshotResponse = await response.json();

      if (!data.ticker || !data.ticker.day) {
        console.warn(`❌ ${ticker}: No current day data`);
        return false;
      }

      const currentPrice = data.ticker.day.c;
      const volume = data.ticker.day.v;

      // Validation criteria
      if (currentPrice < 1) {
        console.warn(`❌ ${ticker}: Price too low ($${currentPrice})`);
        return false;
      }

      if (volume < 100000) {
        console.warn(`❌ ${ticker}: Volume too low (${volume})`);
        return false;
      }

      console.log(
        `✅ ${ticker}: Validation passed - Price: $${currentPrice}, Volume: ${volume}`
      );
      return true;
    } catch (error) {
      console.error(`❌ ${ticker}: Validation error -`, error);
      return false;
    }
  }

  // ✅ PROFESSIONAL: Fetch multi-timeframe data
  private async fetchMultiTimeframeData(
    ticker: string,
    progressCallback?: (progress: ScanProgress) => void
  ): Promise<MultiTimeframeData | null> {
    const result: Partial<MultiTimeframeData> = {};

    try {
      for (const [timeframeName, config] of Object.entries(
        this.timeframeConfig
      )) {
        // Update progress for current timeframe
        if (progressCallback) {
          progressCallback({
            stage: `Fetching ${timeframeName} Data`,
            stocksScanned: 0,
            totalStocks: 0,
            currentStock: ticker,
            signalsFound: 0,
            timeElapsed: 0,
            validSignals: 0,
            apiCallsMade: 0,
            dataQuality: "Processing",
            currentTimeframe: timeframeName,
            errors: 0,
          });
        }

        console.log(`📈 ${ticker}: Fetching ${timeframeName} data`);

        const timeframeData = await this.fetchTimeframeData(ticker, config);

        if (timeframeData && timeframeData.length >= config.minDataPoints) {
          result[timeframeName as keyof MultiTimeframeData] = timeframeData;
          console.log(
            `✅ ${ticker} ${timeframeName}: ${timeframeData.length} data points`
          );
        } else {
          console.warn(
            `⚠️ ${ticker} ${timeframeName}: Insufficient data (${
              timeframeData?.length || 0
            } points, need ${config.minDataPoints})`
          );
        }

        // Small delay between timeframe requests
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      // Validate we have enough timeframes
      const validTimeframes = Object.keys(result).length;
      if (validTimeframes < 2) {
        console.warn(`❌ ${ticker}: Only ${validTimeframes} valid timeframes`);
        return null;
      }

      console.log(
        `✅ ${ticker}: Multi-timeframe data complete (${validTimeframes}/4 timeframes)`
      );
      return result as MultiTimeframeData;
    } catch (error) {
      console.error(`❌ ${ticker}: Multi-timeframe fetch error -`, error);
      return null;
    }
  }

  // ✅ PROFESSIONAL: Fetch data for specific timeframe
  private async fetchTimeframeData(
    ticker: string,
    config: PolygonTimeframe
  ): Promise<PolygonMarketData[] | null> {
    try {
      await this.rateLimiter.waitIfNeeded();

      // Calculate date range based on timeframe
      const endDate = new Date();
      const startDate = this.calculateStartDate(config, endDate);

      const url = this.buildAggregatesUrl(ticker, config, startDate, endDate);
      console.log(
        `🔍 ${ticker} ${config.name}: Fetching from ${
          startDate.toISOString().split("T")[0]
        } to ${endDate.toISOString().split("T")[0]}`
      );

      const response = await fetch(url);

      if (!response.ok) {
        console.warn(
          `❌ ${ticker} ${config.name}: API error ${response.status}`
        );
        return null;
      }

      const data: PolygonAggregatesResponse = await response.json();

      if (!data.results || data.results.length === 0) {
        console.warn(`❌ ${ticker} ${config.name}: No data in response`);
        return null;
      }

      // Convert Polygon.io format to our format
      const marketData: PolygonMarketData[] = data.results
        .map((result) => ({
          ticker,
          timestamp: result.t,
          open: result.o,
          high: result.h,
          low: result.l,
          close: result.c,
          volume: result.v,
          vwap: result.vw,
          n: result.n,
        }))
        .sort((a, b) => a.timestamp - b.timestamp); // Sort chronologically

      console.log(
        `✅ ${ticker} ${config.name}: ${marketData.length} data points fetched`
      );
      return marketData;
    } catch (error) {
      console.error(`❌ ${ticker} ${config.name}: Fetch error -`, error);
      return null;
    }
  }

  // ✅ HELPER: Calculate start date based on timeframe
  private calculateStartDate(config: PolygonTimeframe, endDate: Date): Date {
    const startDate = new Date(endDate);

    switch (config.name) {
      case "1H":
        startDate.setDate(startDate.getDate() - 30); // 30 days of hourly data
        break;
      case "4H":
        startDate.setDate(startDate.getDate() - 60); // 60 days of 4-hour data
        break;
      case "1D":
        startDate.setDate(startDate.getDate() - 200); // 200 days of daily data
        break;
      case "1W":
        startDate.setFullYear(startDate.getFullYear() - 2); // 2 years of weekly data
        break;
      default:
        startDate.setDate(startDate.getDate() - 100);
    }

    return startDate;
  }

  // ✅ HELPER: Build Polygon.io aggregates URL
  private buildAggregatesUrl(
    ticker: string,
    config: PolygonTimeframe,
    startDate: Date,
    endDate: Date
  ): string {
    const start = startDate.toISOString().split("T")[0];
    const end = endDate.toISOString().split("T")[0];
    const limit = 5000; // Maximum allowed by Polygon.io

    return `${this.baseUrl}/v2/aggs/ticker/${ticker}/range/${config.multiplier}/${config.timespan}/${start}/${end}?adjusted=true&sort=desc&limit=${limit}&apikey=${this.apiKey}`;
  }

  // ✅ HELPER: Validate multi-timeframe data quality
  private validateMultiTimeframeData(data: MultiTimeframeData): boolean {
    const timeframes = Object.keys(data);

    // Need at least 2 timeframes
    if (timeframes.length < 2) return false;

    // Validate each timeframe has sufficient data
    for (const [timeframe, timeframeData] of Object.entries(data)) {
      const config = this.timeframeConfig[timeframe];
      if (
        !config ||
        !timeframeData ||
        timeframeData.length < config.minDataPoints
      ) {
        return false;
      }

      // Validate data quality
      if (!TechnicalIndicators.validatePolygonData(timeframeData)) {
        return false;
      }
    }

    return true;
  }

  // ✅ PUBLIC: Get stock universe (S&P 500 + additions)
  public static getDefaultStockUniverse(): StockInfo[] {
    return [
      // Large Cap Technology
      {
        ticker: "AAPL",
        companyName: "Apple Inc.",
        sector: "Technology",
        industry: "Consumer Electronics",
        marketCap: 3000000000000,
        avgVolume: 50000000,
        exchange: "NASDAQ",
        isActive: true,
      },
      {
        ticker: "MSFT",
        companyName: "Microsoft Corporation",
        sector: "Technology",
        industry: "Software",
        marketCap: 2800000000000,
        avgVolume: 25000000,
        exchange: "NASDAQ",
        isActive: true,
      },
      {
        ticker: "GOOGL",
        companyName: "Alphabet Inc.",
        sector: "Communication Services",
        industry: "Internet Content & Information",
        marketCap: 1700000000000,
        avgVolume: 25000000,
        exchange: "NASDAQ",
        isActive: true,
      },
      {
        ticker: "AMZN",
        companyName: "Amazon.com Inc.",
        sector: "Consumer Cyclical",
        industry: "Internet Retail",
        marketCap: 1500000000000,
        avgVolume: 30000000,
        exchange: "NASDAQ",
        isActive: true,
      },
      {
        ticker: "NVDA",
        companyName: "NVIDIA Corporation",
        sector: "Technology",
        industry: "Semiconductors",
        marketCap: 2000000000000,
        avgVolume: 40000000,
        exchange: "NASDAQ",
        isActive: true,
      },
      {
        ticker: "TSLA",
        companyName: "Tesla Inc.",
        sector: "Consumer Cyclical",
        industry: "Auto Manufacturers",
        marketCap: 800000000000,
        avgVolume: 80000000,
        exchange: "NASDAQ",
        isActive: true,
      },
      {
        ticker: "META",
        companyName: "Meta Platforms Inc.",
        sector: "Communication Services",
        industry: "Internet Content & Information",
        marketCap: 900000000000,
        avgVolume: 15000000,
        exchange: "NASDAQ",
        isActive: true,
      },

      // Financial Services
      {
        ticker: "JPM",
        companyName: "JPMorgan Chase & Co.",
        sector: "Financial Services",
        industry: "Banks - Diversified",
        marketCap: 500000000000,
        avgVolume: 12000000,
        exchange: "NYSE",
        isActive: true,
      },
      {
        ticker: "BAC",
        companyName: "Bank of America Corp.",
        sector: "Financial Services",
        industry: "Banks - Diversified",
        marketCap: 300000000000,
        avgVolume: 40000000,
        exchange: "NYSE",
        isActive: true,
      },
      {
        ticker: "WFC",
        companyName: "Wells Fargo & Company",
        sector: "Financial Services",
        industry: "Banks - Diversified",
        marketCap: 200000000000,
        avgVolume: 25000000,
        exchange: "NYSE",
        isActive: true,
      },
      {
        ticker: "GS",
        companyName: "Goldman Sachs Group Inc.",
        sector: "Financial Services",
        industry: "Capital Markets",
        marketCap: 150000000000,
        avgVolume: 3000000,
        exchange: "NYSE",
        isActive: true,
      },
      {
        ticker: "MS",
        companyName: "Morgan Stanley",
        sector: "Financial Services",
        industry: "Capital Markets",
        marketCap: 140000000000,
        avgVolume: 8000000,
        exchange: "NYSE",
        isActive: true,
      },

      // Healthcare
      {
        ticker: "JNJ",
        companyName: "Johnson & Johnson",
        sector: "Healthcare",
        industry: "Drug Manufacturers - General",
        marketCap: 450000000000,
        avgVolume: 6000000,
        exchange: "NYSE",
        isActive: true,
      },
      {
        ticker: "UNH",
        companyName: "UnitedHealth Group Inc.",
        sector: "Healthcare",
        industry: "Healthcare Plans",
        marketCap: 500000000000,
        avgVolume: 3000000,
        exchange: "NYSE",
        isActive: true,
      },
      {
        ticker: "PFE",
        companyName: "Pfizer Inc.",
        sector: "Healthcare",
        industry: "Drug Manufacturers - General",
        marketCap: 200000000000,
        avgVolume: 25000000,
        exchange: "NYSE",
        isActive: true,
      },
      {
        ticker: "ABBV",
        companyName: "AbbVie Inc.",
        sector: "Healthcare",
        industry: "Drug Manufacturers - General",
        marketCap: 300000000000,
        avgVolume: 6000000,
        exchange: "NYSE",
        isActive: true,
      },

      // Consumer Goods
      {
        ticker: "PG",
        companyName: "Procter & Gamble Co.",
        sector: "Consumer Defensive",
        industry: "Household & Personal Products",
        marketCap: 400000000000,
        avgVolume: 7000000,
        exchange: "NYSE",
        isActive: true,
      },
      {
        ticker: "KO",
        companyName: "Coca-Cola Company",
        sector: "Consumer Defensive",
        industry: "Beverages - Non-Alcoholic",
        marketCap: 250000000000,
        avgVolume: 15000000,
        exchange: "NYSE",
        isActive: true,
      },
      {
        ticker: "PEP",
        companyName: "PepsiCo Inc.",
        sector: "Consumer Defensive",
        industry: "Beverages - Non-Alcoholic",
        marketCap: 230000000000,
        avgVolume: 4000000,
        exchange: "NASDAQ",
        isActive: true,
      },

      // Energy
      {
        ticker: "XOM",
        companyName: "Exxon Mobil Corporation",
        sector: "Energy",
        industry: "Oil & Gas Integrated",
        marketCap: 400000000000,
        avgVolume: 20000000,
        exchange: "NYSE",
        isActive: true,
      },
      {
        ticker: "CVX",
        companyName: "Chevron Corporation",
        sector: "Energy",
        industry: "Oil & Gas Integrated",
        marketCap: 300000000000,
        avgVolume: 12000000,
        exchange: "NYSE",
        isActive: true,
      },

      // Industrial
      {
        ticker: "BA",
        companyName: "Boeing Company",
        sector: "Industrials",
        industry: "Aerospace & Defense",
        marketCap: 100000000000,
        avgVolume: 15000000,
        exchange: "NYSE",
        isActive: true,
      },
      {
        ticker: "CAT",
        companyName: "Caterpillar Inc.",
        sector: "Industrials",
        industry: "Farm & Heavy Construction Machinery",
        marketCap: 150000000000,
        avgVolume: 3000000,
        exchange: "NYSE",
        isActive: true,
      },

      // Retail
      {
        ticker: "WMT",
        companyName: "Walmart Inc.",
        sector: "Consumer Defensive",
        industry: "Discount Stores",
        marketCap: 500000000000,
        avgVolume: 8000000,
        exchange: "NYSE",
        isActive: true,
      },
      {
        ticker: "HD",
        companyName: "Home Depot Inc.",
        sector: "Consumer Cyclical",
        industry: "Home Improvement Retail",
        marketCap: 350000000000,
        avgVolume: 3000000,
        exchange: "NYSE",
        isActive: true,
      },

      // Additional Technology
      {
        ticker: "ORCL",
        companyName: "Oracle Corporation",
        sector: "Technology",
        industry: "Software - Infrastructure",
        marketCap: 300000000000,
        avgVolume: 12000000,
        exchange: "NYSE",
        isActive: true,
      },
      {
        ticker: "CRM",
        companyName: "Salesforce Inc.",
        sector: "Technology",
        industry: "Software - Application",
        marketCap: 200000000000,
        avgVolume: 6000000,
        exchange: "NYSE",
        isActive: true,
      },
      {
        ticker: "ADBE",
        companyName: "Adobe Inc.",
        sector: "Technology",
        industry: "Software - Infrastructure",
        marketCap: 220000000000,
        avgVolume: 3000000,
        exchange: "NASDAQ",
        isActive: true,
      },

      // Telecommunications
      {
        ticker: "T",
        companyName: "AT&T Inc.",
        sector: "Communication Services",
        industry: "Telecom Services",
        marketCap: 150000000000,
        avgVolume: 30000000,
        exchange: "NYSE",
        isActive: true,
      },
      {
        ticker: "VZ",
        companyName: "Verizon Communications Inc.",
        sector: "Communication Services",
        industry: "Telecom Services",
        marketCap: 180000000000,
        avgVolume: 15000000,
        exchange: "NYSE",
        isActive: true,
      },

      // Additional high-volume stocks for testing
      {
        ticker: "SPY",
        companyName: "SPDR S&P 500 ETF Trust",
        sector: "Financial Services",
        industry: "Exchange Traded Fund",
        marketCap: 400000000000,
        avgVolume: 60000000,
        exchange: "NYSE",
        isActive: true,
      },
      {
        ticker: "QQQ",
        companyName: "Invesco QQQ Trust",
        sector: "Financial Services",
        industry: "Exchange Traded Fund",
        marketCap: 200000000000,
        avgVolume: 40000000,
        exchange: "NASDAQ",
        isActive: true,
      },
    ];
  }

  // ✅ PUBLIC: Get timeframe configuration
  public getTimeframeConfig(): Record<string, PolygonTimeframe> {
    return { ...this.timeframeConfig };
  }

  // ✅ PUBLIC: Test API connection
  public async testConnection(): Promise<boolean> {
    try {
      const url = `${this.baseUrl}/v2/snapshot/locale/us/markets/stocks/tickers/AAPL?apikey=${this.apiKey}`;
      const response = await fetch(url);

      if (response.ok) {
        console.log("✅ Polygon.io API connection successful");
        return true;
      } else {
        console.error("❌ Polygon.io API connection failed:", response.status);
        return false;
      }
    } catch (error) {
      console.error("❌ Polygon.io API connection error:", error);
      return false;
    }
  }
}

// ✅ FIXED: Default export for easy importing
export default StockScanner;
