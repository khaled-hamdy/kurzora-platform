// Stock Scanner - Fetches Real Market Data from Polygon.io
// File: src/lib/signals/stock-scanner.ts

export interface StockData {
  ticker: string;
  companyName: string;
  price: number;
  volume: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  marketCap?: number;
  sector: string;
  market: string;
}

export interface PolygonTickerResponse {
  ticker: string;
  name: string;
  market: string;
  locale: string;
  primary_exchange: string;
  type: string;
  active: boolean;
  currency_name: string;
  cik?: string;
  composite_figi?: string;
  share_class_figi?: string;
  last_updated_utc: string;
}

export interface PolygonPrevCloseResponse {
  ticker: string;
  queryCount: number;
  resultsCount: number;
  adjusted: boolean;
  results: Array<{
    T: string; // ticker
    v: number; // volume
    vw: number; // volume weighted average price
    o: number; // open
    c: number; // close
    h: number; // high
    l: number; // low
    t: number; // timestamp
    n: number; // number of transactions
  }>;
  status: string;
  request_id: string;
  count: number;
}

export class StockScanner {
  private apiKey: string;
  private baseUrl = "https://api.polygon.io";

  constructor() {
    this.apiKey = import.meta.env.VITE_POLYGON_API_KEY;
    if (!this.apiKey) {
      throw new Error("Polygon.io API key not found in environment variables");
    }
  }

  // Get list of active tickers from major exchanges
  async getActiveStocks(limit: number = 500): Promise<string[]> {
    try {
      console.log(`📊 StockScanner: Fetching ${limit} active stocks...`);

      // Get active stocks from major US exchanges
      const response = await fetch(
        `${this.baseUrl}/v3/reference/tickers?active=true&order=asc&limit=${limit}&sort=ticker&apikey=${this.apiKey}`
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch tickers: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      if (!data.results) {
        console.warn("No results returned from Polygon.io tickers API");
        return [];
      }

      // Filter for common stocks and major exchanges
      const filteredTickers = data.results
        .filter(
          (ticker: PolygonTickerResponse) =>
            ticker.active &&
            ticker.type === "CS" && // Common stock
            ticker.market === "stocks" &&
            ticker.primary_exchange &&
            ["XNYS", "XNAS"].includes(ticker.primary_exchange) && // NYSE, NASDAQ
            /^[A-Z]{1,5}$/.test(ticker.ticker) // Simple ticker format
        )
        .map((ticker: PolygonTickerResponse) => ticker.ticker)
        .slice(0, limit);

      console.log(
        `✅ StockScanner: Found ${filteredTickers.length} active stocks`
      );
      console.log(
        `📋 Sample tickers: ${filteredTickers.slice(0, 10).join(", ")}`
      );

      return filteredTickers;
    } catch (error) {
      console.error("❌ StockScanner: Error fetching active stocks:", error);
      // Fallback to common stocks if API fails
      return [
        "AAPL",
        "MSFT",
        "GOOGL",
        "AMZN",
        "NVDA",
        "TSLA",
        "META",
        "BRK.B",
        "JPM",
        "JNJ",
        "V",
        "PG",
        "UNH",
        "MA",
        "HD",
        "PFE",
        "BAC",
        "ABBV",
        "KO",
        "AVGO",
        "PEP",
        "TMO",
        "COST",
        "MRK",
        "WMT",
        "CSCO",
        "ACN",
        "LLY",
        "DHR",
        "VZ",
        "ABT",
        "ADBE",
        "NFLX",
        "CRM",
        "XOM",
        "NKE",
        "CVX",
        "QCOM",
        "TXN",
        "PM",
        "RTX",
        "ORCL",
        "BMY",
        "AMD",
        "NEE",
        "INTC",
        "LIN",
        "UPS",
        "T",
        "IBM",
        "GE",
        "MDT",
        "CAT",
        "HON",
      ].slice(0, limit);
    }
  }

  // Get market data for a specific stock
  async getStockData(ticker: string): Promise<StockData | null> {
    try {
      // Get previous day's data (most recent complete trading day)
      const response = await fetch(
        `${this.baseUrl}/v2/aggs/ticker/${ticker}/prev?adjusted=true&apikey=${this.apiKey}`
      );

      if (!response.ok) {
        console.warn(
          `⚠️ Failed to fetch data for ${ticker}: ${response.status}`
        );
        return null;
      }

      const data: PolygonPrevCloseResponse = await response.json();

      if (!data.results || data.results.length === 0) {
        console.warn(`⚠️ No data available for ${ticker}`);
        return null;
      }

      const result = data.results[0];

      // Calculate change percent
      const changePercent =
        result.o > 0 ? ((result.c - result.o) / result.o) * 100 : 0;

      // Determine sector and market (basic classification)
      const { sector, market } = this.classifyStock(ticker);

      const stockData: StockData = {
        ticker: result.T,
        companyName: this.getCompanyName(ticker),
        price: result.c,
        volume: result.v,
        changePercent: changePercent,
        high: result.h,
        low: result.l,
        open: result.o,
        sector,
        market,
      };

      return stockData;
    } catch (error) {
      console.error(`❌ Error fetching data for ${ticker}:`, error);
      return null;
    }
  }

  // Batch fetch market data for multiple stocks
  async scanStocks(
    tickers: string[],
    batchSize: number = 10
  ): Promise<StockData[]> {
    console.log(
      `🔍 StockScanner: Scanning ${tickers.length} stocks in batches of ${batchSize}...`
    );

    const results: StockData[] = [];

    // Process in batches to avoid rate limiting
    for (let i = 0; i < tickers.length; i += batchSize) {
      const batch = tickers.slice(i, i + batchSize);
      console.log(
        `📦 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(
          tickers.length / batchSize
        )}: ${batch.join(", ")}`
      );

      // Process batch concurrently
      const batchPromises = batch.map((ticker) => this.getStockData(ticker));
      const batchResults = await Promise.all(batchPromises);

      // Filter out null results and add to main results
      const validResults = batchResults.filter(
        (data): data is StockData => data !== null
      );
      results.push(...validResults);

      // Rate limiting: wait between batches
      if (i + batchSize < tickers.length) {
        console.log("⏳ Waiting 1 second to respect rate limits...");
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    console.log(
      `✅ StockScanner: Successfully scanned ${results.length}/${tickers.length} stocks`
    );
    return results;
  }

  // Basic stock classification (in a real system, this would be from a database)
  private classifyStock(ticker: string): { sector: string; market: string } {
    const techStocks = [
      "AAPL",
      "MSFT",
      "GOOGL",
      "AMZN",
      "META",
      "NVDA",
      "TSLA",
      "NFLX",
      "ADBE",
      "CRM",
      "ORCL",
      "IBM",
      "INTC",
      "AMD",
      "QCOM",
      "CSCO",
    ];
    const financeStocks = [
      "JPM",
      "BAC",
      "WFC",
      "C",
      "GS",
      "MS",
      "AXP",
      "BLK",
      "SCHW",
      "USB",
    ];
    const healthStocks = [
      "JNJ",
      "PFE",
      "UNH",
      "ABBV",
      "MRK",
      "TMO",
      "ABT",
      "BMY",
      "AMGN",
      "GILD",
    ];
    const consumerStocks = [
      "PG",
      "KO",
      "PEP",
      "WMT",
      "HD",
      "NKE",
      "MCD",
      "SBUX",
      "TGT",
      "COST",
    ];
    const energyStocks = [
      "XOM",
      "CVX",
      "COP",
      "EOG",
      "SLB",
      "PSX",
      "VLO",
      "MPC",
      "OXY",
      "KMI",
    ];

    let sector = "Other";
    if (techStocks.includes(ticker)) sector = "Technology";
    else if (financeStocks.includes(ticker)) sector = "Finance";
    else if (healthStocks.includes(ticker)) sector = "Healthcare";
    else if (consumerStocks.includes(ticker)) sector = "Consumer";
    else if (energyStocks.includes(ticker)) sector = "Energy";

    return { sector, market: "USA" };
  }

  // Basic company name lookup (in a real system, this would be from a database)
  private getCompanyName(ticker: string): string {
    const companyNames: { [key: string]: string } = {
      AAPL: "Apple Inc.",
      MSFT: "Microsoft Corporation",
      GOOGL: "Alphabet Inc.",
      AMZN: "Amazon.com Inc.",
      NVDA: "NVIDIA Corporation",
      TSLA: "Tesla Inc.",
      META: "Meta Platforms Inc.",
      JPM: "JPMorgan Chase & Co.",
      JNJ: "Johnson & Johnson",
      PG: "Procter & Gamble Co.",
      V: "Visa Inc.",
      UNH: "UnitedHealth Group Inc.",
      MA: "Mastercard Inc.",
      HD: "The Home Depot Inc.",
      PFE: "Pfizer Inc.",
      BAC: "Bank of America Corp.",
      ABBV: "AbbVie Inc.",
      KO: "The Coca-Cola Company",
      AVGO: "Broadcom Inc.",
      PEP: "PepsiCo Inc.",
    };

    return companyNames[ticker] || `${ticker} Corp.`;
  }

  // Test the scanner with a small sample
  async testScanner(): Promise<boolean> {
    try {
      console.log("🧪 Testing StockScanner...");

      const testTickers = ["AAPL", "MSFT", "GOOGL"];
      const results = await this.scanStocks(testTickers, 3);

      if (results.length === testTickers.length) {
        console.log("✅ StockScanner test passed!");
        console.log("📊 Sample results:", results);
        return true;
      } else {
        console.warn(
          `⚠️ StockScanner test incomplete: ${results.length}/${testTickers.length} stocks scanned`
        );
        return false;
      }
    } catch (error) {
      console.error("❌ StockScanner test failed:", error);
      return false;
    }
  }
}

// Export singleton instance
export const stockScanner = new StockScanner();
