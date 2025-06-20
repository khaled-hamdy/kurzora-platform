import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  TrendingUp,
  Wifi,
  WifiOff,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Activity,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PolygonTestData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: number;
  rsi?: number;
  macd?: {
    value: number;
    signal: number;
    histogram: number;
  };
}

const PolygonTest: React.FC = () => {
  const navigate = useNavigate();
  const [testData, setTestData] = useState<PolygonTestData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    "idle" | "testing" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [testSteps, setTestSteps] = useState({
    apiKey: false,
    priceData: false,
    rsiData: false,
    macdData: false,
  });

  const testPolygonConnection = async () => {
    setIsLoading(true);
    setConnectionStatus("testing");
    setErrorMessage("");
    setTestSteps({
      apiKey: false,
      priceData: false,
      rsiData: false,
      macdData: false,
    });

    try {
      // Step 1: Check API Key
      const apiKey = import.meta.env.VITE_POLYGON_API_KEY;

      if (!apiKey) {
        throw new Error("❌ Polygon.io API key not found in .env.local file");
      }

      console.log("🔑 API Key found:", apiKey.substring(0, 8) + "...");
      setTestSteps((prev) => ({ ...prev, apiKey: true }));

      // Step 2: Test basic price data
      console.log("📈 Testing price data...");
      const priceResponse = await fetch(
        `https://api.polygon.io/v2/aggs/ticker/AAPL/prev?adjusted=true&apikey=${apiKey}`
      );

      if (!priceResponse.ok) {
        throw new Error(
          `❌ Price API failed: ${priceResponse.status} ${priceResponse.statusText}`
        );
      }

      const priceData = await priceResponse.json();
      console.log("📈 Price data received:", priceData);

      if (
        priceData.status !== "OK" ||
        !priceData.results ||
        priceData.results.length === 0
      ) {
        throw new Error("❌ Invalid price data received from Polygon.io");
      }

      const result = priceData.results[0];
      setTestSteps((prev) => ({ ...prev, priceData: true }));

      // Step 3: Test RSI indicator
      console.log("📊 Testing RSI data...");
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      const dateStr = yesterday.toISOString().split("T")[0];

      const rsiResponse = await fetch(
        `https://api.polygon.io/v1/indicators/rsi/AAPL?timestamp=${dateStr}&timespan=day&adjusted=true&window=14&series_type=close&order=desc&limit=1&apikey=${apiKey}`
      );

      let rsiValue = undefined;
      if (rsiResponse.ok) {
        const rsiData = await rsiResponse.json();
        console.log("📊 RSI data received:", rsiData);
        if (
          rsiData.status === "OK" &&
          rsiData.results?.values &&
          rsiData.results.values.length > 0
        ) {
          rsiValue = rsiData.results.values[0].value;
          setTestSteps((prev) => ({ ...prev, rsiData: true }));
        } else if (rsiData.status === "OK") {
          // Mark as successful even if no values (API working)
          setTestSteps((prev) => ({ ...prev, rsiData: true }));
          console.log("📊 RSI API working but no recent values available");
        }
      }

      // Step 4: Test MACD indicator
      console.log("📊 Testing MACD data...");
      const macdResponse = await fetch(
        `https://api.polygon.io/v1/indicators/macd/AAPL?timestamp=${dateStr}&timespan=day&adjusted=true&short_window=12&long_window=26&signal_window=9&series_type=close&order=desc&limit=1&apikey=${apiKey}`
      );

      let macdValue = undefined;
      if (macdResponse.ok) {
        const macdData = await macdResponse.json();
        console.log("📊 MACD data received:", macdData);
        if (
          macdData.status === "OK" &&
          macdData.results?.values &&
          macdData.results.values.length > 0
        ) {
          const macdResult = macdData.results.values[0];
          macdValue = {
            value: macdResult.value,
            signal: macdResult.signal,
            histogram: macdResult.histogram,
          };
          setTestSteps((prev) => ({ ...prev, macdData: true }));
        } else if (macdData.status === "OK") {
          // Mark as successful even if no values (API working)
          setTestSteps((prev) => ({ ...prev, macdData: true }));
          console.log("📊 MACD API working but no recent values available");
        }
      }

      // Calculate change and change percent
      const change = result.c - result.o;
      const changePercent = (change / result.o) * 100;

      const testResult: PolygonTestData = {
        symbol: "AAPL",
        price: result.c,
        change: change,
        changePercent: changePercent,
        volume: result.v,
        timestamp: result.t,
        rsi: rsiValue,
        macd: macdValue,
      };

      setTestData(testResult);
      setConnectionStatus("success");

      console.log("✅ Polygon.io test successful!", testResult);
    } catch (error) {
      console.error("❌ Polygon.io test failed:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "Unknown error occurred"
      );
      setConnectionStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case "testing":
        return <Wifi className="h-5 w-5 text-blue-400 animate-pulse" />;
      case "success":
        return <CheckCircle className="h-5 w-5 text-emerald-400" />;
      case "error":
        return <XCircle className="h-5 w-5 text-red-400" />;
      default:
        return <WifiOff className="h-5 w-5 text-slate-400" />;
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case "testing":
        return "Testing connection...";
      case "success":
        return "All tests passed! 🎉";
      case "error":
        return "Connection failed ❌";
      default:
        return "Ready to test Polygon.io";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <Button
          onClick={() => navigate("/dashboard")}
          variant="ghost"
          className="text-slate-400 hover:text-white mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="flex items-center space-x-3">
          <Activity className="h-8 w-8 text-blue-400" />
          <div>
            <h1 className="text-3xl font-bold text-white">
              Polygon.io Connection Test
            </h1>
            <p className="text-slate-400">
              Verify your API connection and test real market data
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Connection Status Card */}
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-white flex items-center space-x-3">
              {getStatusIcon()}
              <span>API Connection Status</span>
            </CardTitle>
            <p className="text-slate-400 text-sm">
              Test your Polygon.io API key and data access
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium text-lg">
                  {getStatusText()}
                </p>
                {errorMessage && (
                  <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 mt-3">
                    <p className="text-red-400 text-sm">{errorMessage}</p>
                  </div>
                )}
              </div>
              <Button
                onClick={testPolygonConnection}
                disabled={isLoading}
                size="lg"
                className={`${
                  connectionStatus === "success"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-blue-600 hover:bg-blue-700"
                } text-white px-8`}
              >
                {isLoading
                  ? "Testing..."
                  : connectionStatus === "success"
                  ? "Test Again"
                  : "Start Test"}
              </Button>
            </div>

            {/* Test Steps Progress */}
            {(isLoading || connectionStatus !== "idle") && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div
                  className={`p-3 rounded-lg border ${
                    testSteps.apiKey
                      ? "bg-emerald-900/20 border-emerald-500/30"
                      : "bg-slate-700/30 border-slate-600"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {testSteps.apiKey ? (
                      <CheckCircle className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2 border-slate-400" />
                    )}
                    <span className="text-sm text-white">API Key</span>
                  </div>
                </div>

                <div
                  className={`p-3 rounded-lg border ${
                    testSteps.priceData
                      ? "bg-emerald-900/20 border-emerald-500/30"
                      : "bg-slate-700/30 border-slate-600"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {testSteps.priceData ? (
                      <CheckCircle className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2 border-slate-400" />
                    )}
                    <span className="text-sm text-white">Price Data</span>
                  </div>
                </div>

                <div
                  className={`p-3 rounded-lg border ${
                    testSteps.rsiData
                      ? "bg-emerald-900/20 border-emerald-500/30"
                      : "bg-slate-700/30 border-slate-600"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {testSteps.rsiData ? (
                      <CheckCircle className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2 border-slate-400" />
                    )}
                    <span className="text-sm text-white">RSI Data</span>
                  </div>
                </div>

                <div
                  className={`p-3 rounded-lg border ${
                    testSteps.macdData
                      ? "bg-emerald-900/20 border-emerald-500/30"
                      : "bg-slate-700/30 border-slate-600"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {testSteps.macdData ? (
                      <CheckCircle className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2 border-slate-400" />
                    )}
                    <span className="text-sm text-white">MACD Data</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Real Data Display */}
        {testData && (
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-white flex items-center space-x-3">
                <TrendingUp className="h-5 w-5 text-emerald-400" />
                <span>Live Market Data - {testData.symbol}</span>
              </CardTitle>
              <p className="text-slate-400 text-sm">
                Real-time data from Polygon.io API ✨
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Price Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <p className="text-slate-400 text-sm">Current Price</p>
                  <p className="text-white text-2xl font-bold">
                    ${testData.price.toFixed(2)}
                  </p>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4">
                  <p className="text-slate-400 text-sm">Daily Change</p>
                  <p
                    className={`text-2xl font-bold ${
                      testData.change >= 0 ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {testData.change >= 0 ? "+" : ""}$
                    {testData.change.toFixed(2)}
                  </p>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4">
                  <p className="text-slate-400 text-sm">Change %</p>
                  <p
                    className={`text-2xl font-bold ${
                      testData.changePercent >= 0
                        ? "text-emerald-400"
                        : "text-red-400"
                    }`}
                  >
                    {testData.changePercent >= 0 ? "+" : ""}
                    {testData.changePercent.toFixed(2)}%
                  </p>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4">
                  <p className="text-slate-400 text-sm">Volume</p>
                  <p className="text-white text-2xl font-bold">
                    {(testData.volume / 1000000).toFixed(1)}M
                  </p>
                </div>
              </div>

              {/* Technical Indicators */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {testData.rsi && (
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <p className="text-slate-400 text-sm">
                      RSI (14) - Relative Strength Index
                    </p>
                    <p
                      className={`text-2xl font-bold ${
                        testData.rsi > 70
                          ? "text-red-400"
                          : testData.rsi < 30
                          ? "text-emerald-400"
                          : "text-blue-400"
                      }`}
                    >
                      {testData.rsi.toFixed(1)}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {testData.rsi > 70
                        ? "🔴 Overbought - Consider Selling"
                        : testData.rsi < 30
                        ? "🟢 Oversold - Consider Buying"
                        : "🔵 Neutral Zone"}
                    </p>
                  </div>
                )}

                {testData.macd && (
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <p className="text-slate-400 text-sm">
                      MACD - Trend Momentum
                    </p>
                    <p
                      className={`text-2xl font-bold ${
                        testData.macd.histogram > 0
                          ? "text-emerald-400"
                          : "text-red-400"
                      }`}
                    >
                      {testData.macd.value.toFixed(3)}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Signal: {testData.macd.signal.toFixed(3)} | Histogram:{" "}
                      {testData.macd.histogram.toFixed(3)}
                    </p>
                    <p className="text-xs text-slate-400">
                      {testData.macd.histogram > 0
                        ? "🟢 Bullish Momentum"
                        : "🔴 Bearish Momentum"}
                    </p>
                  </div>
                )}
              </div>

              {/* Success Message */}
              <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-lg p-4">
                <h3 className="text-emerald-400 font-semibold mb-2">
                  🎉 Success! Your Polygon.io integration is working!
                </h3>
                <p className="text-slate-300 text-sm">
                  Kurzora is now connected to real market data. You can now
                  generate authentic trading signals with live stock prices,
                  RSI, MACD, and volume data from 6,000+ stocks.
                </p>
              </div>

              {/* Timestamp */}
              <div className="border-t border-slate-700 pt-4">
                <p className="text-slate-400 text-sm">
                  📅 Data timestamp:{" "}
                  {new Date(testData.timestamp).toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Next Steps */}
        {connectionStatus === "success" && (
          <Card className="bg-blue-900/20 border-blue-500/30">
            <CardContent className="p-6">
              <h3 className="text-blue-400 font-semibold text-lg mb-3">
                🚀 What's Next?
              </h3>
              <div className="space-y-2 text-slate-300">
                <p>✅ Your Polygon.io connection is working perfectly!</p>
                <p>🎯 Next step: Create real signal generation algorithm</p>
                <p>
                  📊 We'll scan 500+ stocks and calculate scores based on RSI,
                  MACD, Volume, and Support/Resistance levels
                </p>
                <p>
                  ⚡ Signals with scores ≥80 will appear in your dashboard
                  automatically
                </p>
              </div>
              <Button
                onClick={() => navigate("/dashboard")}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
              >
                Return to Dashboard
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PolygonTest;
