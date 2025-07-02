import React from "react";
import { useLanguage } from "../../contexts/LanguageContext";
// ✅ FIXED: Import centralized scoring function
import { calculateFinalScore } from "../../utils/signalCalculations";

interface Signal {
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
  timestamp: string;
}

interface SignalSummaryStatsProps {
  filteredSignals: Signal[];
  timeFilter: string;
  highlightedCategory: string | null;
  setHighlightedCategory: (category: string | null) => void;
}

const SignalSummaryStats: React.FC<SignalSummaryStatsProps> = ({
  filteredSignals,
  timeFilter,
  highlightedCategory,
  setHighlightedCategory,
}) => {
  const { t } = useLanguage();

  // Get stocks for each category with their final scores
  const getStocksForCategory = (category: string) => {
    return filteredSignals
      .map((signal) => ({
        ticker: signal.ticker,
        score: calculateFinalScore(signal.signals),
      }))
      .filter((item) => {
        // 🚀 UPDATED: New categorization logic
        if (category === "strong") return item.score >= 80; // Strong: ≥80%
        if (category === "valid") return item.score >= 60 && item.score < 80; // Valid: 60-79% (includes 70+ BUY signals!)
        if (category === "weak") return item.score < 60; // Weak: <60%
        return false;
      });
  };

  // Handle category click to trigger blinking
  const handleCategoryClick = (category: string) => {
    setHighlightedCategory(category);
    // Reset after 3 seconds
    setTimeout(() => {
      setHighlightedCategory(null);
    }, 3000);
  };

  // 🚀 UPDATED: New categorization logic matching realistic business thresholds
  const strongSignals = filteredSignals.filter(
    (s) => calculateFinalScore(s.signals) >= 80 // Strong: ≥80%
  );

  const validSignals = filteredSignals.filter((s) => {
    const score = calculateFinalScore(s.signals);
    return score >= 60 && score < 80; // Valid: 60-79% (includes 70+ BUY signals!)
  });

  const weakSignals = filteredSignals.filter((s) => {
    const score = calculateFinalScore(s.signals);
    return score < 60; // Weak: <60%
  });

  return (
    <div className="mt-6 pt-4 border-t border-slate-700">
      {/* Add timeframe indicator label */}
      <div className="mb-4 text-center">
        <div className="text-slate-300 text-sm font-medium">
          Summary reflects weighted final scores (not just {timeFilter} only)
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Strong (≥80%) */}
        <div
          className={`text-center cursor-pointer hover:bg-slate-700/30 rounded-lg p-3 transition-all duration-200 shadow-md hover:shadow-lg ${
            highlightedCategory === "strong"
              ? "animate-pulse bg-slate-600/50 ring-2 ring-emerald-400/50"
              : ""
          }`}
          onClick={() => handleCategoryClick("strong")}
          onMouseEnter={() => setHighlightedCategory("strong")}
          onMouseLeave={() => {
            if (highlightedCategory === "strong") {
              setTimeout(() => setHighlightedCategory(null), 100);
            }
          }}
        >
          <div
            className="text-lg font-bold"
            style={{ color: "hsl(118, 95.3%, 49.8%)" }}
          >
            {strongSignals.length}
          </div>
          <div className="text-slate-400 text-sm">Strong (80%+)</div>
          {highlightedCategory === "strong" &&
            getStocksForCategory("strong").length > 0 && (
              <div className="mt-1 text-xs text-slate-300">
                {getStocksForCategory("strong").map((item) => (
                  <div key={item.ticker}>
                    {item.ticker} ({item.score})
                  </div>
                ))}
              </div>
            )}
        </div>

        {/* Valid (60-79%) - NOW INCLUDES YOUR 70+ BUY SIGNALS! */}
        <div
          className={`text-center cursor-pointer hover:bg-slate-700/30 rounded-lg p-3 transition-all duration-200 shadow-md hover:shadow-lg ${
            highlightedCategory === "valid"
              ? "animate-pulse bg-slate-600/50 ring-2 ring-blue-400/50"
              : ""
          }`}
          onClick={() => handleCategoryClick("valid")}
          onMouseEnter={() => setHighlightedCategory("valid")}
          onMouseLeave={() => {
            if (highlightedCategory === "valid") {
              setTimeout(() => setHighlightedCategory(null), 100);
            }
          }}
        >
          <div
            className="text-lg font-bold"
            style={{ color: "hsl(208, 77.3%, 72.4%)" }}
          >
            {validSignals.length}
          </div>
          <div className="text-slate-400 text-sm">Valid (60-79%)</div>
          {highlightedCategory === "valid" &&
            getStocksForCategory("valid").length > 0 && (
              <div className="mt-1 text-xs text-slate-300">
                {getStocksForCategory("valid").map((item) => (
                  <div key={item.ticker}>
                    {item.ticker} ({item.score})
                  </div>
                ))}
              </div>
            )}
        </div>

        {/* Weak (<60%) */}
        <div
          className={`text-center cursor-pointer hover:bg-slate-700/30 rounded-lg p-3 transition-all duration-200 shadow-md hover:shadow-lg ${
            highlightedCategory === "weak"
              ? "animate-pulse bg-slate-600/50 ring-2 ring-red-400/50"
              : ""
          }`}
          onClick={() => handleCategoryClick("weak")}
          onMouseEnter={() => setHighlightedCategory("weak")}
          onMouseLeave={() => {
            if (highlightedCategory === "weak") {
              setTimeout(() => setHighlightedCategory(null), 100);
            }
          }}
        >
          <div className="text-red-400 text-lg font-bold">
            {weakSignals.length}
          </div>
          <div className="text-slate-400 text-sm">Weak (&lt;60%)</div>
          {highlightedCategory === "weak" &&
            getStocksForCategory("weak").length > 0 && (
              <div className="mt-1 text-xs text-slate-300">
                {getStocksForCategory("weak").map((item) => (
                  <div key={item.ticker}>
                    {item.ticker} ({item.score})
                  </div>
                ))}
              </div>
            )}
        </div>

        {/* Total Signals */}
        <div className="text-center p-3 rounded-lg shadow-md">
          <div className="text-white text-lg font-bold">
            {filteredSignals.length}
          </div>
          <div className="text-slate-400 text-sm">Total Signals</div>
        </div>
      </div>
    </div>
  );
};

export default SignalSummaryStats;
