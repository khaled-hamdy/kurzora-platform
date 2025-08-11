// src/components/test/DivergenceUITest.tsx
// Session #402: Divergence UI Testing Component
// Shows different divergence patterns for UI preview

import React from "react";
import SignalCard from "../signals/SignalCard";

// Mock signals with different divergence patterns
const mockSignalsWithDivergence = [
  // 1. Strong Bullish Regular Divergence
  {
    ticker: "AAPL",
    name: "Apple Inc.",
    company_name: "Apple Inc.",
    sector: "Technology",
    confidence_score: 89,
    current_price: 178.32,
    price_change_percent: 2.15,
    created_at: new Date().toISOString(),
    signals: { "1H": 85, "4H": 88, "1D": 89, "1W": 82 },
    analysis: {
      session_402_divergence: {
        hasValidDivergence: true,
        analysisSuccessful: true,
        timeframe: "1D",
        strongestPattern: {
          type: "BULLISH_REGULAR" as const,
          strength: "STRONG" as const,
          confidenceScore: 87.5,
          qualityScore: 82.3,
        },
        scoreBonus: 12.8,
        totalPatternsFound: 3,
        validPatternsCount: 2,
      },
    },
    base_score: 76,
    divergence_bonus: 12.8,
  },

  // 2. Very Strong Bearish Regular Divergence
  {
    ticker: "TSLA",
    name: "Tesla Inc.",
    company_name: "Tesla Inc.",
    sector: "Automotive",
    confidence_score: 91,
    current_price: 245.67,
    price_change_percent: -1.85,
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 mins ago
    signals: { "1H": 88, "4H": 90, "1D": 91, "1W": 85 },
    analysis: {
      session_402_divergence: {
        hasValidDivergence: true,
        analysisSuccessful: true,
        timeframe: "1D",
        strongestPattern: {
          type: "BEARISH_REGULAR" as const,
          strength: "VERY_STRONG" as const,
          confidenceScore: 93.2,
          qualityScore: 89.1,
        },
        scoreBonus: 15.4,
        totalPatternsFound: 4,
        validPatternsCount: 3,
      },
    },
    base_score: 76,
    divergence_bonus: 15.4,
  },

  // 3. Moderate Bullish Hidden Divergence
  {
    ticker: "MSFT",
    name: "Microsoft Corporation",
    company_name: "Microsoft Corporation",
    sector: "Technology",
    confidence_score: 83,
    current_price: 412.89,
    price_change_percent: 0.95,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    signals: { "1H": 80, "4H": 82, "1D": 83, "1W": 78 },
    analysis: {
      session_402_divergence: {
        hasValidDivergence: true,
        analysisSuccessful: true,
        timeframe: "1D",
        strongestPattern: {
          type: "BULLISH_HIDDEN" as const,
          strength: "MODERATE" as const,
          confidenceScore: 74.8,
          qualityScore: 71.2,
        },
        scoreBonus: 8.3,
        totalPatternsFound: 2,
        validPatternsCount: 1,
      },
    },
    base_score: 75,
    divergence_bonus: 8.3,
  },

  // 4. Regular Signal (No Divergence) - for comparison
  {
    ticker: "GOOGL",
    name: "Alphabet Inc.",
    company_name: "Alphabet Inc.",
    sector: "Technology",
    confidence_score: 76,
    current_price: 142.33,
    price_change_percent: 1.22,
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    signals: { "1H": 74, "4H": 76, "1D": 76, "1W": 72 },
    // No divergence data - should show regular display
  },

  // 5. Weak Bearish Hidden Divergence
  {
    ticker: "NVDA",
    name: "NVIDIA Corporation",
    company_name: "NVIDIA Corporation",
    sector: "Technology",
    confidence_score: 79,
    current_price: 118.45,
    price_change_percent: -0.75,
    created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    signals: { "1H": 75, "4H": 77, "1D": 79, "1W": 73 },
    analysis: {
      session_402_divergence: {
        hasValidDivergence: true,
        analysisSuccessful: true,
        timeframe: "1D",
        strongestPattern: {
          type: "BEARISH_HIDDEN" as const,
          strength: "WEAK" as const,
          confidenceScore: 65.3,
          qualityScore: 58.7,
        },
        scoreBonus: 4.2,
        totalPatternsFound: 1,
        validPatternsCount: 1,
      },
    },
    base_score: 75,
    divergence_bonus: 4.2,
  },
];

/**
 * Divergence UI Test Component
 * Shows different divergence patterns in SignalCard
 */
const DivergenceUITest: React.FC = () => {
  const handleViewSignal = (signal: any) => {
    console.log("Viewing signal:", signal.ticker);
    alert(`Viewing ${signal.ticker} signal details`);
  };

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            🎯 Session #402: Divergence UI Test
          </h1>
          <p className="text-slate-400">
            Testing different divergence patterns in professional display format
          </p>
        </div>

        <div className="grid gap-6">
          {mockSignalsWithDivergence.map((signal, index) => (
            <div key={signal.ticker} className="space-y-2">
              <h3 className="text-lg font-medium text-slate-300">
                {index + 1}. {signal.ticker} -
                {signal.analysis?.session_402_divergence ? (
                  <span className="text-emerald-400 ml-2">
                    {signal.analysis.session_402_divergence.strongestPattern?.type.replace(
                      "_",
                      " "
                    )}
                    (
                    {
                      signal.analysis.session_402_divergence.strongestPattern
                        ?.strength
                    }
                    )
                  </span>
                ) : (
                  <span className="text-slate-500 ml-2">No Divergence</span>
                )}
              </h3>

              <SignalCard
                signal={signal}
                onViewSignal={handleViewSignal}
                buttonText="View Details"
                className="transform transition-all duration-200 hover:scale-[1.01]"
              />
            </div>
          ))}
        </div>

        <div className="mt-12 bg-slate-800/50 rounded-lg p-6 border border-slate-700">
          <h2 className="text-xl font-bold text-white mb-4">
            🎨 Visual Legend
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <p className="text-slate-300 font-medium">Divergence Badges:</p>
              <div className="space-y-1 text-slate-400">
                <p>
                  <span className="text-emerald-400">↗ D</span> - Bullish
                  Regular (Trend Reversal Up)
                </p>
                <p>
                  <span className="text-red-400">↙ D</span> - Bearish Regular
                  (Trend Reversal Down)
                </p>
                <p>
                  <span className="text-emerald-400">⤴ D</span> - Bullish Hidden
                  (Trend Continuation Up)
                </p>
                <p>
                  <span className="text-red-400">⤵ D</span> - Bearish Hidden
                  (Trend Continuation Down)
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-slate-300 font-medium">Score Enhancement:</p>
              <div className="space-y-1 text-slate-400">
                <p>
                  <span className="text-white">84</span>{" "}
                  <span className="text-emerald-400">[+12]</span> - Enhanced
                  score format
                </p>
                <p>
                  <span className="text-emerald-400/70">
                    Divergence Enhanced
                  </span>{" "}
                  - Enhancement indicator
                </p>
                <p>Badge opacity reflects pattern strength</p>
                <p>Tooltip shows detailed pattern info</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DivergenceUITest;
