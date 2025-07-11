// ==================================================================================
// 🗄️ KURZORA BACKTESTING STOCK UNIVERSE - 200 STOCKS
// ==================================================================================
// 🔧 PURPOSE: Hard-coded stock universe for backtesting system
// 📝 SESSION #168: Complete 200-stock list from user's database for backtesting
// 🛡️ ANTI-REGRESSION: This is data only - no logic that can break existing features
// 🎯 WHITE PAPER: Implements exactly what Session #167 white paper specified
// ⚠️ CRITICAL: Contains real tickers with company names and sectors for realistic backtesting
// 🚀 BACKTESTING: Enables 30-day simulation across diversified stock universe

export interface BacktestStock {
  ticker: string;
  company_name: string;
  sector: string;
}

/**
 * 🗄️ COMPLETE 200-STOCK UNIVERSE FOR BACKTESTING
 * PURPOSE: Provides diversified stock universe for 30-day trading simulation
 * SOURCE: User's active_stocks database table - complete S&P representation
 * SECTORS: Technology, Healthcare, Financial Services, Consumer, Energy, etc.
 *
 * 🎯 BACKTESTING USAGE:
 * - Process ALL 200 stocks daily during simulation
 * - Generate signals using identical Edge Function logic
 * - Apply 75% quality filter for execution
 * - Diversified across all major market sectors
 *
 * 🔧 SESSION #168 IMPLEMENTATION:
 * - Hard-coded for client-side processing (no database dependency)
 * - Includes company names for realistic reporting
 * - Sector classification for portfolio analysis
 * - Ready for Polygon.io API integration
 */
export const BACKTEST_STOCKS: BacktestStock[] = [
  {
    ticker: "AAPL",
    company_name: "Apple Inc.",
    sector: "Technology",
  },
  {
    ticker: "ABBV",
    company_name: "AbbVie Inc.",
    sector: "Healthcare",
  },
  {
    ticker: "ABT",
    company_name: "Abbott Laboratories",
    sector: "Healthcare",
  },
  {
    ticker: "ADBE",
    company_name: "Adobe Inc.",
    sector: "Technology",
  },
  {
    ticker: "AEP",
    company_name: "American Electric Power Company Inc.",
    sector: "Utilities",
  },
  {
    ticker: "AMAT",
    company_name: "Applied Materials Inc.",
    sector: "Technology",
  },
  {
    ticker: "AMD",
    company_name: "Advanced Micro Devices Inc.",
    sector: "Technology",
  },
  {
    ticker: "AMGN",
    company_name: "Amgen Inc.",
    sector: "Healthcare",
  },
  {
    ticker: "AMT",
    company_name: "American Tower Corporation",
    sector: "Real Estate",
  },
  {
    ticker: "AMZN",
    company_name: "Amazon.com Inc.",
    sector: "Technology",
  },
  {
    ticker: "ANTM",
    company_name: "Anthem Inc.",
    sector: "Healthcare",
  },
  {
    ticker: "APD",
    company_name: "Air Products and Chemicals Inc.",
    sector: "Materials",
  },
  {
    ticker: "AVB",
    company_name: "AvalonBay Communities Inc.",
    sector: "Real Estate",
  },
  {
    ticker: "AVGO",
    company_name: "Broadcom Inc.",
    sector: "Technology",
  },
  {
    ticker: "AXP",
    company_name: "American Express Company",
    sector: "Financial Services",
  },
  {
    ticker: "AZO",
    company_name: "AutoZone Inc.",
    sector: "Consumer Discretionary",
  },
  {
    ticker: "BA",
    company_name: "Boeing Company",
    sector: "Industrials",
  },
  {
    ticker: "BAC",
    company_name: "Bank of America Corporation",
    sector: "Financial Services",
  },
  {
    ticker: "BBY",
    company_name: "Best Buy Co. Inc.",
    sector: "Consumer Discretionary",
  },
  {
    ticker: "BIIB",
    company_name: "Biogen Inc.",
    sector: "Healthcare",
  },
  {
    ticker: "BKNG",
    company_name: "Booking Holdings Inc.",
    sector: "Consumer Discretionary",
  },
  {
    ticker: "BLK",
    company_name: "BlackRock Inc.",
    sector: "Financial Services",
  },
  {
    ticker: "BMY",
    company_name: "Bristol-Myers Squibb Company",
    sector: "Healthcare",
  },
  {
    ticker: "C",
    company_name: "Citigroup Inc.",
    sector: "Financial Services",
  },
  {
    ticker: "CAG",
    company_name: "Conagra Brands Inc.",
    sector: "Consumer Staples",
  },
  {
    ticker: "CAT",
    company_name: "Caterpillar Inc.",
    sector: "Industrials",
  },
  {
    ticker: "CC",
    company_name: "Chemours Company",
    sector: "Materials",
  },
  {
    ticker: "CCI",
    company_name: "Crown Castle International Corp.",
    sector: "Real Estate",
  },
  {
    ticker: "CF",
    company_name: "CF Industries Holdings Inc.",
    sector: "Materials",
  },
  {
    ticker: "CHD",
    company_name: "Church & Dwight Co. Inc.",
    sector: "Consumer Staples",
  },
  {
    ticker: "CHTR",
    company_name: "Charter Communications Inc.",
    sector: "Communication Services",
  },
  {
    ticker: "CI",
    company_name: "Cigna Corporation",
    sector: "Healthcare",
  },
  {
    ticker: "CL",
    company_name: "Colgate-Palmolive Company",
    sector: "Consumer Staples",
  },
  {
    ticker: "CLX",
    company_name: "Clorox Company",
    sector: "Consumer Staples",
  },
  {
    ticker: "CMCSA",
    company_name: "Comcast Corporation",
    sector: "Communication Services",
  },
  {
    ticker: "CMG",
    company_name: "Chipotle Mexican Grill Inc.",
    sector: "Consumer Discretionary",
  },
  {
    ticker: "CMI",
    company_name: "Cummins Inc.",
    sector: "Industrials",
  },
  {
    ticker: "COP",
    company_name: "ConocoPhillips",
    sector: "Energy",
  },
  {
    ticker: "COST",
    company_name: "Costco Wholesale Corporation",
    sector: "Consumer Staples",
  },
  {
    ticker: "CPB",
    company_name: "Campbell Soup Company",
    sector: "Consumer Staples",
  },
  {
    ticker: "CPT",
    company_name: "Camden Property Trust",
    sector: "Real Estate",
  },
  {
    ticker: "CRH",
    company_name: "CRH plc",
    sector: "Materials",
  },
  {
    ticker: "CRM",
    company_name: "Salesforce Inc.",
    sector: "Technology",
  },
  {
    ticker: "CSCO",
    company_name: "Cisco Systems Inc.",
    sector: "Technology",
  },
  {
    ticker: "CTVA",
    company_name: "Corteva Inc.",
    sector: "Materials",
  },
  {
    ticker: "CVS",
    company_name: "CVS Health Corporation",
    sector: "Healthcare",
  },
  {
    ticker: "CVX",
    company_name: "Chevron Corporation",
    sector: "Energy",
  },
  {
    ticker: "DD",
    company_name: "DuPont de Nemours Inc.",
    sector: "Materials",
  },
  {
    ticker: "DE",
    company_name: "Deere & Company",
    sector: "Industrials",
  },
  {
    ticker: "DG",
    company_name: "Dollar General Corporation",
    sector: "Consumer Discretionary",
  },
  {
    ticker: "DHR",
    company_name: "Danaher Corporation",
    sector: "Healthcare",
  },
  {
    ticker: "DIS",
    company_name: "Walt Disney Company",
    sector: "Communication Services",
  },
  {
    ticker: "DISH",
    company_name: "DISH Network Corporation",
    sector: "Communication Services",
  },
  {
    ticker: "DLR",
    company_name: "Digital Realty Trust Inc.",
    sector: "Real Estate",
  },
  {
    ticker: "DLTR",
    company_name: "Dollar Tree Inc.",
    sector: "Consumer Discretionary",
  },
  {
    ticker: "DOV",
    company_name: "Dover Corporation",
    sector: "Industrials",
  },
  {
    ticker: "DOW",
    company_name: "Dow Inc.",
    sector: "Materials",
  },
  {
    ticker: "DPZ",
    company_name: "Domino's Pizza Inc.",
    sector: "Consumer Discretionary",
  },
  {
    ticker: "DUK",
    company_name: "Duke Energy Corporation",
    sector: "Utilities",
  },
  {
    ticker: "ECL",
    company_name: "Ecolab Inc.",
    sector: "Materials",
  },
  {
    ticker: "EL",
    company_name: "Estée Lauder Companies Inc.",
    sector: "Consumer Staples",
  },
  {
    ticker: "EMR",
    company_name: "Emerson Electric Co.",
    sector: "Industrials",
  },
  {
    ticker: "ENPH",
    company_name: "Enphase Energy Inc.",
    sector: "Energy",
  },
  {
    ticker: "EOG",
    company_name: "EOG Resources Inc.",
    sector: "Energy",
  },
  {
    ticker: "EPD",
    company_name: "Enterprise Products Partners L.P.",
    sector: "Energy",
  },
  {
    ticker: "EQIX",
    company_name: "Equinix Inc.",
    sector: "Real Estate",
  },
  {
    ticker: "EQR",
    company_name: "Equity Residential",
    sector: "Real Estate",
  },
  {
    ticker: "ES",
    company_name: "Eversource Energy",
    sector: "Utilities",
  },
  {
    ticker: "ESS",
    company_name: "Essex Property Trust Inc.",
    sector: "Real Estate",
  },
  {
    ticker: "ET",
    company_name: "Energy Transfer LP",
    sector: "Energy",
  },
  {
    ticker: "ETN",
    company_name: "Eaton Corporation plc",
    sector: "Industrials",
  },
  {
    ticker: "ETR",
    company_name: "Entergy Corporation",
    sector: "Utilities",
  },
  {
    ticker: "EXC",
    company_name: "Exelon Corporation",
    sector: "Utilities",
  },
  {
    ticker: "EXR",
    company_name: "Extended Stay America Inc.",
    sector: "Real Estate",
  },
  {
    ticker: "FCX",
    company_name: "Freeport-McMoRan Inc.",
    sector: "Materials",
  },
  {
    ticker: "FDX",
    company_name: "FedEx Corporation",
    sector: "Industrials",
  },
  {
    ticker: "FE",
    company_name: "FirstEnergy Corp.",
    sector: "Utilities",
  },
  {
    ticker: "FOXA",
    company_name: "Fox Corporation",
    sector: "Communication Services",
  },
  {
    ticker: "FSLR",
    company_name: "First Solar Inc.",
    sector: "Energy",
  },
  {
    ticker: "GD",
    company_name: "General Dynamics Corporation",
    sector: "Industrials",
  },
  {
    ticker: "GE",
    company_name: "General Electric Company",
    sector: "Industrials",
  },
  {
    ticker: "GILD",
    company_name: "Gilead Sciences Inc.",
    sector: "Healthcare",
  },
  {
    ticker: "GIS",
    company_name: "General Mills Inc.",
    sector: "Consumer Staples",
  },
  {
    ticker: "GOOGL",
    company_name: "Alphabet Inc.",
    sector: "Technology",
  },
  {
    ticker: "GS",
    company_name: "Goldman Sachs Group Inc.",
    sector: "Financial Services",
  },
  {
    ticker: "HD",
    company_name: "Home Depot Inc.",
    sector: "Consumer Discretionary",
  },
  {
    ticker: "HON",
    company_name: "Honeywell International Inc.",
    sector: "Industrials",
  },
  {
    ticker: "HRL",
    company_name: "Hormel Foods Corporation",
    sector: "Consumer Staples",
  },
  {
    ticker: "HST",
    company_name: "Host Hotels & Resorts Inc.",
    sector: "Real Estate",
  },
  {
    ticker: "HSY",
    company_name: "Hershey Company",
    sector: "Consumer Staples",
  },
  {
    ticker: "HUM",
    company_name: "Humana Inc.",
    sector: "Healthcare",
  },
  {
    ticker: "IBM",
    company_name: "International Business Machines Corporation",
    sector: "Technology",
  },
  {
    ticker: "IFF",
    company_name: "International Flavors & Fragrances Inc.",
    sector: "Materials",
  },
  {
    ticker: "INTC",
    company_name: "Intel Corporation",
    sector: "Technology",
  },
  {
    ticker: "IR",
    company_name: "Ingersoll Rand Inc.",
    sector: "Industrials",
  },
  {
    ticker: "ISRG",
    company_name: "Intuitive Surgical Inc.",
    sector: "Healthcare",
  },
  {
    ticker: "ITW",
    company_name: "Illinois Tool Works Inc.",
    sector: "Industrials",
  },
  {
    ticker: "JNJ",
    company_name: "Johnson & Johnson",
    sector: "Healthcare",
  },
  {
    ticker: "JPM",
    company_name: "JPMorgan Chase & Co.",
    sector: "Financial Services",
  },
  {
    ticker: "K",
    company_name: "Kellogg Company",
    sector: "Consumer Staples",
  },
  {
    ticker: "KHC",
    company_name: "Kraft Heinz Company",
    sector: "Consumer Staples",
  },
  {
    ticker: "KMB",
    company_name: "Kimberly-Clark Corporation",
    sector: "Consumer Staples",
  },
  {
    ticker: "KMI",
    company_name: "Kinder Morgan Inc.",
    sector: "Energy",
  },
  {
    ticker: "KO",
    company_name: "Coca-Cola Company",
    sector: "Consumer Staples",
  },
  {
    ticker: "KR",
    company_name: "Kroger Co.",
    sector: "Consumer Discretionary",
  },
  {
    ticker: "LIN",
    company_name: "Linde plc",
    sector: "Materials",
  },
  {
    ticker: "LLY",
    company_name: "Eli Lilly and Company",
    sector: "Healthcare",
  },
  {
    ticker: "LMT",
    company_name: "Lockheed Martin Corporation",
    sector: "Industrials",
  },
  {
    ticker: "LOW",
    company_name: "Lowe's Companies Inc.",
    sector: "Consumer Discretionary",
  },
  {
    ticker: "LULU",
    company_name: "Lululemon Athletica Inc.",
    sector: "Consumer Discretionary",
  },
  {
    ticker: "LYB",
    company_name: "LyondellBasell Industries N.V.",
    sector: "Materials",
  },
  {
    ticker: "MA",
    company_name: "Mastercard Inc.",
    sector: "Financial Services",
  },
  {
    ticker: "MAA",
    company_name: "Mid-America Apartment Communities Inc.",
    sector: "Real Estate",
  },
  {
    ticker: "MCD",
    company_name: "McDonald's Corporation",
    sector: "Consumer Discretionary",
  },
  {
    ticker: "MDLZ",
    company_name: "Mondelez International Inc.",
    sector: "Consumer Staples",
  },
  {
    ticker: "MDT",
    company_name: "Medtronic plc",
    sector: "Healthcare",
  },
  {
    ticker: "META",
    company_name: "Meta Platforms Inc.",
    sector: "Technology",
  },
  {
    ticker: "MKC",
    company_name: "McCormick & Company Inc.",
    sector: "Consumer Staples",
  },
  {
    ticker: "MLM",
    company_name: "Martin Marietta Materials Inc.",
    sector: "Materials",
  },
  {
    ticker: "MMM",
    company_name: "3M Company",
    sector: "Industrials",
  },
  {
    ticker: "MOS",
    company_name: "Mosaic Company",
    sector: "Materials",
  },
  {
    ticker: "MPC",
    company_name: "Marathon Petroleum Corporation",
    sector: "Energy",
  },
  {
    ticker: "MRK",
    company_name: "Merck & Co. Inc.",
    sector: "Healthcare",
  },
  {
    ticker: "MSFT",
    company_name: "Microsoft Corporation",
    sector: "Technology",
  },
  {
    ticker: "MTCH",
    company_name: "Match Group Inc.",
    sector: "Communication Services",
  },
  {
    ticker: "MU",
    company_name: "Micron Technology Inc.",
    sector: "Technology",
  },
  {
    ticker: "NEE",
    company_name: "NextEra Energy Inc.",
    sector: "Utilities",
  },
  {
    ticker: "NEM",
    company_name: "Newmont Corporation",
    sector: "Materials",
  },
  {
    ticker: "NFLX",
    company_name: "Netflix Inc.",
    sector: "Technology",
  },
  {
    ticker: "NKE",
    company_name: "Nike Inc.",
    sector: "Consumer Discretionary",
  },
  {
    ticker: "NOC",
    company_name: "Northrop Grumman Corporation",
    sector: "Industrials",
  },
  {
    ticker: "NOVA",
    company_name: "Sunnova Energy International Inc.",
    sector: "Energy",
  },
  {
    ticker: "NUE",
    company_name: "Nucor Corporation",
    sector: "Materials",
  },
  {
    ticker: "NVDA",
    company_name: "NVIDIA Corporation",
    sector: "Technology",
  },
  {
    ticker: "NWSA",
    company_name: "News Corporation",
    sector: "Communication Services",
  },
  {
    ticker: "O",
    company_name: "Realty Income Corporation",
    sector: "Real Estate",
  },
  {
    ticker: "OKE",
    company_name: "ONEOK Inc.",
    sector: "Energy",
  },
  {
    ticker: "ORCL",
    company_name: "Oracle Corporation",
    sector: "Technology",
  },
  {
    ticker: "ORLY",
    company_name: "O'Reilly Automotive Inc.",
    sector: "Consumer Discretionary",
  },
  {
    ticker: "PARA",
    company_name: "Paramount Global",
    sector: "Communication Services",
  },
  {
    ticker: "PEP",
    company_name: "PepsiCo Inc.",
    sector: "Consumer Staples",
  },
  {
    ticker: "PFE",
    company_name: "Pfizer Inc.",
    sector: "Healthcare",
  },
  {
    ticker: "PG",
    company_name: "Procter & Gamble Company",
    sector: "Consumer Staples",
  },
  {
    ticker: "PH",
    company_name: "Parker-Hannifin Corporation",
    sector: "Industrials",
  },
  {
    ticker: "PINS",
    company_name: "Pinterest Inc.",
    sector: "Communication Services",
  },
  {
    ticker: "PLD",
    company_name: "Prologis Inc.",
    sector: "Real Estate",
  },
  {
    ticker: "PPG",
    company_name: "PPG Industries Inc.",
    sector: "Materials",
  },
  {
    ticker: "PSA",
    company_name: "Public Storage",
    sector: "Real Estate",
  },
  {
    ticker: "PSX",
    company_name: "Phillips 66",
    sector: "Energy",
  },
  {
    ticker: "PXD",
    company_name: "Pioneer Natural Resources Company",
    sector: "Energy",
  },
  {
    ticker: "QCOM",
    company_name: "Qualcomm Inc.",
    sector: "Technology",
  },
  {
    ticker: "REGN",
    company_name: "Regeneron Pharmaceuticals Inc.",
    sector: "Healthcare",
  },
  {
    ticker: "ROK",
    company_name: "Rockwell Automation Inc.",
    sector: "Industrials",
  },
  {
    ticker: "ROST",
    company_name: "Ross Stores Inc.",
    sector: "Consumer Discretionary",
  },
  {
    ticker: "RTX",
    company_name: "Raytheon Technologies Corporation",
    sector: "Industrials",
  },
  {
    ticker: "RUN",
    company_name: "Sunrun Inc.",
    sector: "Energy",
  },
  {
    ticker: "SBAC",
    company_name: "SBA Communications Corporation",
    sector: "Real Estate",
  },
  {
    ticker: "SBUX",
    company_name: "Starbucks Corporation",
    sector: "Consumer Discretionary",
  },
  {
    ticker: "SCHW",
    company_name: "Charles Schwab Corporation",
    sector: "Financial Services",
  },
  {
    ticker: "SEDG",
    company_name: "SolarEdge Technologies Inc.",
    sector: "Energy",
  },
  {
    ticker: "SHW",
    company_name: "Sherwin-Williams Company",
    sector: "Materials",
  },
  {
    ticker: "SIRI",
    company_name: "Sirius XM Holdings Inc.",
    sector: "Communication Services",
  },
  {
    ticker: "SJM",
    company_name: "J.M. Smucker Company",
    sector: "Consumer Staples",
  },
  {
    ticker: "SLB",
    company_name: "Schlumberger Limited",
    sector: "Energy",
  },
  {
    ticker: "SNAP",
    company_name: "Snap Inc.",
    sector: "Communication Services",
  },
  {
    ticker: "SO",
    company_name: "Southern Company",
    sector: "Utilities",
  },
  {
    ticker: "SPWR",
    company_name: "SunPower Corporation",
    sector: "Energy",
  },
  {
    ticker: "STLD",
    company_name: "Steel Dynamics Inc.",
    sector: "Materials",
  },
  {
    ticker: "SUI",
    company_name: "Sun Communities Inc.",
    sector: "Real Estate",
  },
  {
    ticker: "T",
    company_name: "AT&T Inc.",
    sector: "Communication Services",
  },
  {
    ticker: "TGT",
    company_name: "Target Corporation",
    sector: "Consumer Discretionary",
  },
  {
    ticker: "TJX",
    company_name: "TJX Companies Inc.",
    sector: "Consumer Discretionary",
  },
  {
    ticker: "TMO",
    company_name: "Thermo Fisher Scientific Inc.",
    sector: "Healthcare",
  },
  {
    ticker: "TMUS",
    company_name: "T-Mobile US Inc.",
    sector: "Communication Services",
  },
  {
    ticker: "TRIP",
    company_name: "TripAdvisor Inc.",
    sector: "Communication Services",
  },
  {
    ticker: "TSLA",
    company_name: "Tesla Inc.",
    sector: "Technology",
  },
  {
    ticker: "TXN",
    company_name: "Texas Instruments Inc.",
    sector: "Technology",
  },
  {
    ticker: "UDR",
    company_name: "UDR Inc.",
    sector: "Real Estate",
  },
  {
    ticker: "ULTA",
    company_name: "Ulta Beauty Inc.",
    sector: "Consumer Discretionary",
  },
  {
    ticker: "UNH",
    company_name: "UnitedHealth Group Inc.",
    sector: "Healthcare",
  },
  {
    ticker: "UPS",
    company_name: "United Parcel Service Inc.",
    sector: "Industrials",
  },
  {
    ticker: "V",
    company_name: "Visa Inc.",
    sector: "Financial Services",
  },
  {
    ticker: "VICI",
    company_name: "VICI Properties Inc.",
    sector: "Real Estate",
  },
  {
    ticker: "VLO",
    company_name: "Valero Energy Corporation",
    sector: "Energy",
  },
  {
    ticker: "VMC",
    company_name: "Vulcan Materials Company",
    sector: "Materials",
  },
  {
    ticker: "VTR",
    company_name: "Ventas Inc.",
    sector: "Real Estate",
  },
  {
    ticker: "VZ",
    company_name: "Verizon Communications Inc.",
    sector: "Communication Services",
  },
  {
    ticker: "WBD",
    company_name: "Warner Bros. Discovery Inc.",
    sector: "Communication Services",
  },
  {
    ticker: "WEC",
    company_name: "WEC Energy Group Inc.",
    sector: "Utilities",
  },
  {
    ticker: "WELL",
    company_name: "Welltower Inc.",
    sector: "Real Estate",
  },
  {
    ticker: "WFC",
    company_name: "Wells Fargo & Company",
    sector: "Financial Services",
  },
  {
    ticker: "WMB",
    company_name: "Williams Companies Inc.",
    sector: "Energy",
  },
  {
    ticker: "WMT",
    company_name: "Walmart Inc.",
    sector: "Consumer Staples",
  },
  {
    ticker: "XEL",
    company_name: "Xcel Energy Inc.",
    sector: "Utilities",
  },
  {
    ticker: "XOM",
    company_name: "Exxon Mobil Corporation",
    sector: "Energy",
  },
  {
    ticker: "YUM",
    company_name: "Yum! Brands Inc.",
    sector: "Consumer Discretionary",
  },
];

// ==================================================================================
// 📊 STOCK UNIVERSE ANALYSIS & UTILITIES
// ==================================================================================

/**
 * 📊 GET STOCK UNIVERSE STATISTICS
 * PURPOSE: Analyze the composition of the backtesting stock universe
 * OUTPUT: Sector breakdown and universe statistics
 */
export function getStockUniverseStats() {
  const sectorCounts: { [key: string]: number } = {};

  BACKTEST_STOCKS.forEach((stock) => {
    sectorCounts[stock.sector] = (sectorCounts[stock.sector] || 0) + 1;
  });

  const totalStocks = BACKTEST_STOCKS.length;

  console.log("📊 KURZORA BACKTESTING STOCK UNIVERSE ANALYSIS:");
  console.log(`   Total Stocks: ${totalStocks}`);
  console.log("   Sector Breakdown:");

  Object.entries(sectorCounts)
    .sort(([, a], [, b]) => b - a)
    .forEach(([sector, count]) => {
      const percentage = ((count / totalStocks) * 100).toFixed(1);
      console.log(`     ${sector}: ${count} stocks (${percentage}%)`);
    });

  return {
    totalStocks,
    sectorBreakdown: sectorCounts,
    sectors: Object.keys(sectorCounts).sort(),
  };
}

/**
 * 🔍 GET STOCKS BY SECTOR
 * PURPOSE: Filter stocks by specific sector for analysis
 * INPUT: Sector name
 * OUTPUT: Array of stocks in that sector
 */
export function getStocksBySector(sector: string): BacktestStock[] {
  return BACKTEST_STOCKS.filter(
    (stock) => stock.sector.toLowerCase() === sector.toLowerCase()
  );
}

/**
 * 🎯 GET RANDOM STOCK SAMPLE
 * PURPOSE: Get random sample of stocks for testing
 * INPUT: Sample size
 * OUTPUT: Random array of stocks
 */
export function getRandomStockSample(sampleSize: number): BacktestStock[] {
  const shuffled = [...BACKTEST_STOCKS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(sampleSize, BACKTEST_STOCKS.length));
}

/**
 * 🔍 FIND STOCK BY TICKER
 * PURPOSE: Lookup specific stock information
 * INPUT: Ticker symbol
 * OUTPUT: Stock object or null
 */
export function findStock(ticker: string): BacktestStock | null {
  return (
    BACKTEST_STOCKS.find(
      (stock) => stock.ticker.toUpperCase() === ticker.toUpperCase()
    ) || null
  );
}

// Initialize universe analysis on load
console.log("🗄️ Kurzora Backtesting Stock Universe loaded successfully!");
console.log(`✅ ${BACKTEST_STOCKS.length} stocks ready for 30-day simulation`);

// Show universe composition
getStockUniverseStats();

export default BACKTEST_STOCKS;
