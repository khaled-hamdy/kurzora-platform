export interface Signal {
  ticker: string;
  name: string;
  price: number;
  change: number;
  signals: {
    "1H": number;
    "4H": number;
    "1D": number;
    "1W": number;
  };
  sector: string;
  market: string;
  timestamp: string;
  // Session #402: RSI Divergence Enhancement
  analysis?: {
    session_402_divergence?: {
      hasValidDivergence: boolean;
      analysisSuccessful: boolean;
      timeframe: string;
      strongestPattern?: {
        type:
          | "BULLISH_REGULAR"
          | "BEARISH_REGULAR"
          | "BULLISH_HIDDEN"
          | "BEARISH_HIDDEN";
        strength: "WEAK" | "MODERATE" | "STRONG" | "VERY_STRONG";
        confidenceScore: number;
        qualityScore: number;
      };
      scoreBonus?: number;
      totalPatternsFound: number;
      validPatternsCount: number;
    };
  };
  // Enhanced score fields
  confidence_score?: number;
  base_score?: number;
  divergence_bonus?: number;
}
