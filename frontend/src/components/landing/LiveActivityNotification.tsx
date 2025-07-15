import React, { useState, useEffect } from "react";

// 🔧 PRESERVATION: Keeping exact same TypeScript interface structure
interface Signal {
  id: number;
  content: string;
  time: string;
  symbol: string;
  type: "institutional" | "breakout" | "momentum" | "pattern" | "volume";
}

// 🎯 REALISTIC APPROACH: Much larger pool of varied professional signals
const professionalSignalPool: Omit<Signal, "time">[] = [
  {
    id: 1,
    content: "NVDA institutional accumulation • Advanced AI analysis",
    symbol: "NVDA",
    type: "institutional",
  },
  {
    id: 2,
    content: "TSLA momentum convergence • Multi-timeframe confirmation",
    symbol: "TSLA",
    type: "momentum",
  },
  {
    id: 3,
    content: "AAPL reversal pattern • Institutional-grade validation",
    symbol: "AAPL",
    type: "pattern",
  },
  {
    id: 4,
    content: "MSFT breakout signal • Professional opportunity detected",
    symbol: "MSFT",
    type: "breakout",
  },
  {
    id: 5,
    content: "GOOGL volume surge • High-conviction setup identified",
    symbol: "GOOGL",
    type: "volume",
  },
  {
    id: 6,
    content: "AMZN technical pattern • Advanced quantitative analysis",
    symbol: "AMZN",
    type: "pattern",
  },
  {
    id: 7,
    content: "META institutional signal • Premium quality confirmation",
    symbol: "META",
    type: "institutional",
  },
  {
    id: 8,
    content: "AMD momentum breakout • Multi-dimensional validation",
    symbol: "AMD",
    type: "momentum",
  },
  {
    id: 9,
    content: "CRM professional setup • Institutional accumulation pattern",
    symbol: "CRM",
    type: "institutional",
  },
  {
    id: 10,
    content: "AVGO earnings signal • Advanced risk-reward analysis",
    symbol: "AVGO",
    type: "pattern",
  },
  {
    id: 11,
    content: "NFLX volume confirmation • High-probability technical setup",
    symbol: "NFLX",
    type: "volume",
  },
  {
    id: 12,
    content: "ADBE momentum signal • Professional-grade opportunity",
    symbol: "ADBE",
    type: "momentum",
  },
  {
    id: 13,
    content: "PYPL reversal detected • Institutional quality validation",
    symbol: "PYPL",
    type: "pattern",
  },
  {
    id: 14,
    content: "INTC breakout pattern • Advanced technical confirmation",
    symbol: "INTC",
    type: "breakout",
  },
  {
    id: 15,
    content: "COIN institutional signal • Premium analysis complete",
    symbol: "COIN",
    type: "institutional",
  },
];

// 🎯 DYNAMIC TIMESTAMPS: More realistic time variations
const generateRealisticTimestamp = (): string => {
  const timeOptions = [
    "1 minute ago",
    "2 minutes ago",
    "3 minutes ago",
    "4 minutes ago",
    "6 minutes ago",
    "7 minutes ago",
    "9 minutes ago",
    "11 minutes ago",
    "13 minutes ago",
    "15 minutes ago",
    "18 minutes ago",
    "22 minutes ago",
  ];
  return timeOptions[Math.floor(Math.random() * timeOptions.length)];
};

// 🎯 SMART ROTATION: Prevents immediate repeats and predictable patterns
class SmartSignalSelector {
  private recentSignals: number[] = [];
  private maxRecentHistory = 4; // Prevent last 4 signals from repeating

  selectNextSignal(): Signal {
    // Filter out recently shown signals
    const availableSignals = professionalSignalPool.filter(
      (signal) => !this.recentSignals.includes(signal.id)
    );

    // If we've used most signals, reset but keep last 2 to avoid immediate repeats
    if (availableSignals.length < 3) {
      this.recentSignals = this.recentSignals.slice(-2);
    }

    // Select random signal from available pool
    const selectedSignal =
      availableSignals[Math.floor(Math.random() * availableSignals.length)];

    // Add to recent history
    this.recentSignals.push(selectedSignal.id);
    if (this.recentSignals.length > this.maxRecentHistory) {
      this.recentSignals.shift();
    }

    // Return signal with dynamic timestamp
    return {
      ...selectedSignal,
      time: generateRealisticTimestamp(),
    };
  }
}

// 🔧 PRESERVATION: Keeping exact same React.FC type and component name
const LiveActivityNotification: React.FC = () => {
  // 🔧 PRESERVATION: Keeping exact same useState hooks and state management
  const [currentSignal, setCurrentSignal] = useState<Signal | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [signalSelector] = useState(() => new SmartSignalSelector());

  // 🔧 PRESERVATION: Keeping exact same useEffect structure with improved timing
  useEffect(() => {
    // Show first notification after 6 seconds - same as before
    const initialTimer = setTimeout(() => {
      const firstSignal = signalSelector.selectNextSignal();
      setCurrentSignal(firstSignal);
      setIsVisible(true);

      // Hide after 10 seconds - same as before
      const hideTimer = setTimeout(() => {
        setIsVisible(false);
      }, 10000);

      return () => clearTimeout(hideTimer);
    }, 6000);

    return () => clearTimeout(initialTimer);
  }, [signalSelector]);

  // 🎯 IMPROVED: Faster, more realistic rotation with smart selection
  useEffect(() => {
    if (!isVisible) return;

    // Rotate signals every 20 seconds (faster = more realistic)
    const interval = setInterval(() => {
      const nextSignal = signalSelector.selectNextSignal();
      setCurrentSignal(nextSignal);
      setIsVisible(true);

      // Hide after showing for 10 seconds
      setTimeout(() => {
        setIsVisible(false);
      }, 10000);
    }, 20000);

    return () => clearInterval(interval);
  }, [isVisible, signalSelector]);

  // 🔧 PRESERVATION: Keeping exact same visibility logic
  if (!isVisible || !currentSignal) return null;

  // 🎯 ENHANCED: Dynamic styling based on signal type for more variety
  const getSignalStyling = (type: string) => {
    switch (type) {
      case "institutional":
        return {
          border: "border-emerald-500/40",
          bg: "bg-emerald-500/10",
          dot: "bg-emerald-500",
        };
      case "momentum":
        return {
          border: "border-blue-500/40",
          bg: "bg-blue-500/10",
          dot: "bg-blue-500",
        };
      case "breakout":
        return {
          border: "border-amber-500/40",
          bg: "bg-amber-500/10",
          dot: "bg-amber-500",
        };
      case "pattern":
        return {
          border: "border-purple-500/40",
          bg: "bg-purple-500/10",
          dot: "bg-purple-500",
        };
      case "volume":
        return {
          border: "border-cyan-500/40",
          bg: "bg-cyan-500/10",
          dot: "bg-cyan-500",
        };
      default:
        return {
          border: "border-emerald-500/40",
          bg: "bg-emerald-500/10",
          dot: "bg-emerald-500",
        };
    }
  };

  const styling = getSignalStyling(currentSignal.type);

  // 🔧 PRESERVATION: Keeping exact same JSX structure, positioning, and responsive classes
  return (
    <div className="fixed bottom-4 left-4 z-40 animate-fade-in max-w-[calc(100vw-2rem)] md:max-w-xs mb-20 md:mb-0">
      <div
        className={`backdrop-blur-md border rounded-lg p-2 sm:p-3 pr-3 sm:pr-4 shadow-lg transition-all duration-300 hover:scale-105 ${styling.border} ${styling.bg}`}
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <div
            className={`w-2 h-2 rounded-full animate-pulse flex-shrink-0 ${styling.dot}`}
          ></div>
          <p className="text-xs sm:text-sm text-slate-200">
            <span className="font-medium">{currentSignal.symbol}</span>{" "}
            {currentSignal.content.substring(
              currentSignal.content.indexOf(" ") + 1
            )}
          </p>
        </div>
        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
          <span className="w-1 h-1 bg-slate-500 rounded-full"></span>
          {currentSignal.time}
        </p>
      </div>
    </div>
  );
};

export default LiveActivityNotification;
