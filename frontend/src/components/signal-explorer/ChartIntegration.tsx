import React, { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  BarChart3,
  RefreshCw,
  AlertTriangle,
  Loader2,
  TrendingUp,
  Target,
  Shield,
} from "lucide-react";

interface ChartIntegrationProps {
  symbol: string;
  currentPrice: number;
  entryPrice?: number;
  stopLoss?: number;
  takeProfit?: number;
  height?: number;
  interval?: string;
}

// TradingView configuration interface
interface TradingViewConfig {
  symbol: string;
  interval: string;
  theme: "light" | "dark";
  style: string;
  locale: string;
  toolbar_bg: string;
  enable_publishing: boolean;
  container_id: string;
  autosize: boolean;
  width?: number;
  height?: number;
}

const ChartIntegration: React.FC<ChartIntegrationProps> = ({
  symbol,
  currentPrice,
  entryPrice,
  stopLoss,
  takeProfit,
  height = 600,
  interval = "1H",
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [chartInterval, setChartInterval] = useState(interval);

  // Chart cleanup function
  const cleanupChart = () => {
    if (chartContainerRef.current) {
      // Safe cleanup method to prevent DOM errors
      chartContainerRef.current.innerHTML = "";
    }
  };

  // Initialize TradingView chart with external-embedding pattern
  const initializeChart = async () => {
    if (!chartContainerRef.current || !symbol) return;

    try {
      setIsLoading(true);
      setError(null);

      // Clean up any existing chart content
      cleanupChart();

      // Generate unique container ID
      const containerId = `tradingview_${symbol}_${Date.now()}`;
      chartContainerRef.current.id = containerId;

      // TradingView configuration
      const config: TradingViewConfig = {
        symbol: symbol, // Auto-detect exchange - no hardcoded prefixes
        interval: chartInterval,
        theme: "dark",
        style: "1",
        locale: "en",
        toolbar_bg: "#1e293b",
        enable_publishing: false,
        container_id: containerId,
        autosize: true,
        height: height,
      };

      // Create and configure TradingView script
      const script = document.createElement("script");
      script.src =
        "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script.type = "text/javascript";
      script.async = true;

      // Use innerHTML method for configuration (proven working pattern)
      script.innerHTML = JSON.stringify(config);

      // Handle script load events
      script.onload = () => {
        console.log(`✅ TradingView chart loaded successfully for ${symbol}`);
        setIsLoading(false);
      };

      script.onerror = () => {
        console.error(`❌ Failed to load TradingView chart for ${symbol}`);
        setError("Failed to load chart widget");
        setIsLoading(false);
      };

      // Append script to container
      if (chartContainerRef.current) {
        chartContainerRef.current.appendChild(script);
      }
    } catch (chartError) {
      console.error("Chart initialization error:", chartError);
      setError(
        chartError instanceof Error ? chartError.message : "Unknown chart error"
      );
      setIsLoading(false);
    }
  };

  // Initialize chart on mount and symbol changes
  useEffect(() => {
    if (symbol) {
      initializeChart();
    }

    // Cleanup on unmount
    return () => {
      cleanupChart();
    };
  }, [symbol, chartInterval]);

  // Retry chart loading
  const handleRetry = async () => {
    setIsRetrying(true);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Brief delay
    await initializeChart();
    setIsRetrying(false);
  };

  // Interval change handler
  const handleIntervalChange = (newInterval: string) => {
    setChartInterval(newInterval);
  };

  // Price level indicators component
  const PriceLevelIndicators: React.FC = () => {
    if (!entryPrice && !stopLoss && !takeProfit) return null;

    return (
      <div className="mb-4 p-3 bg-slate-700/30 rounded-lg border border-slate-600">
        <h4 className="text-white font-medium mb-3 flex items-center">
          <Target className="h-4 w-4 mr-2 text-blue-400" />
          Key Price Levels
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-400">Current:</span>
            <span className="text-white font-mono">
              ${currentPrice.toFixed(2)}
            </span>
          </div>
          {entryPrice && (
            <div className="flex justify-between">
              <span className="text-slate-400">Entry:</span>
              <span className="text-emerald-400 font-mono">
                ${entryPrice.toFixed(2)}
              </span>
            </div>
          )}
          {stopLoss && (
            <div className="flex justify-between">
              <span className="text-slate-400">Stop:</span>
              <span className="text-red-400 font-mono">
                ${stopLoss.toFixed(2)}
              </span>
            </div>
          )}
          {takeProfit && (
            <div className="flex justify-between">
              <span className="text-slate-400">Target:</span>
              <span className="text-emerald-400 font-mono">
                ${takeProfit.toFixed(2)}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Chart header with controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <BarChart3 className="h-5 w-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">
            Technical Chart Analysis
          </h3>
          <Badge variant="outline" className="border-slate-500 text-slate-300">
            {symbol}
          </Badge>
        </div>

        <div className="flex items-center space-x-2">
          {/* Timeframe selector */}
          <div className="flex bg-slate-700 rounded-lg p-1">
            {["15m", "1H", "4H", "1D", "1W"].map((tf) => (
              <button
                key={tf}
                onClick={() => handleIntervalChange(tf)}
                className={`px-3 py-1 text-xs rounded transition-colors ${
                  chartInterval === tf
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:text-white hover:bg-slate-600"
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {error && (
            <Button
              onClick={handleRetry}
              disabled={isRetrying}
              size="sm"
              variant="outline"
              className="border-slate-500 text-slate-300 hover:bg-slate-600"
            >
              {isRetrying ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Price level indicators */}
      <PriceLevelIndicators />

      {/* Chart container */}
      <div className="relative">
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-slate-800/90 flex items-center justify-center z-10 rounded-lg">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-400 mx-auto mb-2" />
              <p className="text-slate-300 text-sm">
                Loading {symbol} chart...
              </p>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && !isLoading && (
          <div className="bg-red-500/10 border border-red-500/30 p-6 rounded-lg text-center">
            <AlertTriangle className="h-8 w-8 text-red-400 mx-auto mb-2" />
            <h4 className="text-red-200 font-medium mb-2">
              Chart Loading Error
            </h4>
            <p className="text-red-300 text-sm mb-4">{error}</p>
            <Button
              onClick={handleRetry}
              disabled={isRetrying}
              size="sm"
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isRetrying ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Retrying...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry Chart
                </>
              )}
            </Button>
          </div>
        )}

        {/* TradingView chart container */}
        <div
          ref={chartContainerRef}
          className={`w-full bg-slate-900 rounded-lg border border-slate-700 ${
            isLoading ? "opacity-50" : ""
          }`}
          style={{ height: `${height}px`, minHeight: "400px" }}
        />
      </div>

      {/* Chart information footer */}
      <div className="bg-slate-700/20 p-3 rounded-lg border border-slate-600">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-4">
            <span>Powered by TradingView</span>
            <span>•</span>
            <span>Real-time data</span>
            <span>•</span>
            <span>Timeframe: {chartInterval}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="h-3 w-3" />
            <span>Professional Analysis</span>
          </div>
        </div>
      </div>

      {/* Chart usage tips */}
      <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg">
        <h4 className="text-blue-200 font-medium mb-2 flex items-center">
          <TrendingUp className="h-4 w-4 mr-2" />
          Chart Analysis Tips
        </h4>
        <ul className="text-blue-300 text-sm space-y-1">
          <li>• Use multiple timeframes to confirm signal strength</li>
          <li>• Look for volume confirmation on breakouts</li>
          <li>• Monitor key support and resistance levels</li>
          <li>• Consider market context and overall trend direction</li>
        </ul>
      </div>
    </div>
  );
};

export default ChartIntegration;
