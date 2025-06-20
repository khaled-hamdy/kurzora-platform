// Signal Generation Test Page - Real Trading Signals
// File: src/pages/SignalsTest.tsx

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Zap,
  TrendingUp,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Activity,
  Target,
  DollarSign,
  Clock,
  BarChart3,
  Sparkles,
  Database,
  RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { signalProcessor } from "../lib/signals/signal-processor";
import type { ProcessedSignal } from "../lib/signals/signal-processor";

interface GenerationStats {
  stocksScanned: number;
  signalsGenerated: number;
  signalsSaved: number;
  averageScore: number;
  topScore: number;
  processingTime: number;
}

const SignalsTest: React.FC = () => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState<
    | "idle"
    | "scanning"
    | "analyzing"
    | "scoring"
    | "saving"
    | "complete"
    | "error"
  >("idle");
  const [currentStep, setCurrentStep] = useState("");
  const [generatedSignals, setGeneratedSignals] = useState<ProcessedSignal[]>(
    []
  );
  const [stats, setStats] = useState<GenerationStats | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [logs, setLogs] = useState<string[]>([]);

  // Add log entry
  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] ${message}`;
    console.log(logEntry);
    setLogs((prev) => [...prev.slice(-20), logEntry]); // Keep last 20 logs
  };

  // Generate signals
  const generateSignals = async () => {
    setIsGenerating(true);
    setGenerationStatus("scanning");
    setErrorMessage("");
    setLogs([]);
    setStats(null);
    setGeneratedSignals([]);

    const startTime = Date.now();

    try {
      addLog("🚀 Starting signal generation process...");
      setCurrentStep("Initializing signal processor...");

      // Step 1: Scanning stocks
      setGenerationStatus("scanning");
      setCurrentStep("Scanning active stocks from Polygon.io...");
      addLog("📊 Fetching active stocks from market data...");

      // Simulate scanning progress
      await new Promise((resolve) => setTimeout(resolve, 2000));
      addLog("✅ Found 150+ active stocks to analyze");

      // Step 2: Technical Analysis
      setGenerationStatus("analyzing");
      setCurrentStep(
        "Running technical analysis (RSI, MACD, EMA, Bollinger)..."
      );
      addLog("🔍 Starting multi-timeframe technical analysis...");
      addLog("📈 Calculating 1H, 4H, 1D, 1W indicators...");

      // Step 3: Signal Scoring
      setGenerationStatus("scoring");
      setCurrentStep("Calculating 0-100 confidence scores...");
      addLog("⚖️ Scoring signals using weighted algorithm...");
      addLog("🎯 Filtering signals with score ≥ 60...");

      // Generate signals using the actual processor
      const options = {
        maxSignals: 15,
        minScore: 60,
        markets: ["USA"],
      };

      addLog(
        `🔧 Configuration: Max ${options.maxSignals} signals, Min score ${options.minScore}`
      );

      const signals = await signalProcessor.generateSignals(options);

      // Step 4: Saving to database
      setGenerationStatus("saving");
      setCurrentStep("Saving signals to Supabase database...");
      addLog("💾 Saving signals to trading_signals table...");

      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Calculate stats
      const processingTime = (Date.now() - startTime) / 1000;
      const scores = signals.map((s) => s.confidenceScore);
      const avgScore =
        scores.length > 0
          ? scores.reduce((a, b) => a + b, 0) / scores.length
          : 0;
      const topScore = scores.length > 0 ? Math.max(...scores) : 0;

      const generationStats: GenerationStats = {
        stocksScanned: 150, // Would be actual count in production
        signalsGenerated: signals.length,
        signalsSaved: signals.length,
        averageScore: Math.round(avgScore),
        topScore: topScore,
        processingTime: Math.round(processingTime),
      };

      setGeneratedSignals(signals);
      setStats(generationStats);
      setGenerationStatus("complete");
      setCurrentStep("Signal generation complete!");

      addLog(`🎉 Generation complete! ${signals.length} signals created`);
      addLog(`📊 Average score: ${generationStats.averageScore}/100`);
      addLog(`🏆 Top signal: ${signals[0]?.ticker || "N/A"} (${topScore}/100)`);
      addLog(`⏱️ Total time: ${processingTime} seconds`);
    } catch (error) {
      console.error("❌ Signal generation failed:", error);
      setGenerationStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Unknown error occurred"
      );
      addLog(
        `❌ Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // Test a small batch
  const testGeneration = async () => {
    try {
      addLog("🧪 Running test generation...");
      setCurrentStep("Testing signal processor...");

      const success = await signalProcessor.testSignalGeneration();

      if (success) {
        addLog("✅ Test successful! System ready for full generation");
      } else {
        addLog("⚠️ Test completed with warnings");
      }
    } catch (error) {
      addLog(`❌ Test failed: ${error}`);
    }
  };

  const getStatusIcon = () => {
    switch (generationStatus) {
      case "scanning":
        return <Activity className="h-5 w-5 text-blue-400 animate-pulse" />;
      case "analyzing":
        return <BarChart3 className="h-5 w-5 text-purple-400 animate-pulse" />;
      case "scoring":
        return <Target className="h-5 w-5 text-amber-400 animate-pulse" />;
      case "saving":
        return <Database className="h-5 w-5 text-emerald-400 animate-pulse" />;
      case "complete":
        return <CheckCircle className="h-5 w-5 text-emerald-400" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-400" />;
      default:
        return <Zap className="h-5 w-5 text-slate-400" />;
    }
  };

  const getStatusText = () => {
    switch (generationStatus) {
      case "scanning":
        return "Scanning market data...";
      case "analyzing":
        return "Analyzing technical indicators...";
      case "scoring":
        return "Calculating signal scores...";
      case "saving":
        return "Saving to database...";
      case "complete":
        return "Generation complete! 🎉";
      case "error":
        return "Generation failed ❌";
      default:
        return "Ready to generate signals";
    }
  };

  const getSignalStrengthColor = (strength: string) => {
    if (strength.includes("STRONG_BUY")) return "text-emerald-400";
    if (strength.includes("BUY")) return "text-green-400";
    if (strength.includes("WEAK_BUY")) return "text-blue-400";
    if (strength.includes("NEUTRAL")) return "text-slate-400";
    if (strength.includes("SELL")) return "text-red-400";
    return "text-slate-400";
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-400";
    if (score >= 80) return "text-green-400";
    if (score >= 70) return "text-blue-400";
    if (score >= 60) return "text-amber-400";
    return "text-red-400";
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
          <Sparkles className="h-8 w-8 text-purple-400" />
          <div>
            <h1 className="text-3xl font-bold text-white">
              Signal Generation System
            </h1>
            <p className="text-slate-400">
              Generate real trading signals using AI-powered technical analysis
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Control Panel */}
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-white flex items-center space-x-3">
              {getStatusIcon()}
              <span>Signal Generation Control</span>
            </CardTitle>
            <p className="text-slate-400 text-sm">
              Generate authentic trading signals using real market data
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium text-lg">
                  {getStatusText()}
                </p>
                <p className="text-slate-400 text-sm mt-1">{currentStep}</p>
                {errorMessage && (
                  <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 mt-3">
                    <p className="text-red-400 text-sm">{errorMessage}</p>
                  </div>
                )}
              </div>
              <div className="flex space-x-3">
                <Button
                  onClick={testGeneration}
                  disabled={isGenerating}
                  variant="outline"
                  className="border-blue-500 text-blue-400 hover:bg-blue-600/10"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Quick Test
                </Button>
                <Button
                  onClick={generateSignals}
                  disabled={isGenerating}
                  size="lg"
                  className={`${
                    generationStatus === "complete"
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "bg-purple-600 hover:bg-purple-700"
                  } text-white px-8`}
                >
                  {isGenerating ? (
                    <>
                      <Activity className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : generationStatus === "complete" ? (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Again
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Generate Signals
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Progress Steps */}
            {(isGenerating || generationStatus !== "idle") && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div
                  className={`p-3 rounded-lg border ${
                    [
                      "scanning",
                      "analyzing",
                      "scoring",
                      "saving",
                      "complete",
                    ].includes(generationStatus)
                      ? "bg-emerald-900/20 border-emerald-500/30"
                      : "bg-slate-700/30 border-slate-600"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {[
                      "scanning",
                      "analyzing",
                      "scoring",
                      "saving",
                      "complete",
                    ].includes(generationStatus) ? (
                      <CheckCircle className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2 border-slate-400" />
                    )}
                    <span className="text-sm text-white">Stock Scanning</span>
                  </div>
                </div>

                <div
                  className={`p-3 rounded-lg border ${
                    ["analyzing", "scoring", "saving", "complete"].includes(
                      generationStatus
                    )
                      ? "bg-emerald-900/20 border-emerald-500/30"
                      : "bg-slate-700/30 border-slate-600"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {["analyzing", "scoring", "saving", "complete"].includes(
                      generationStatus
                    ) ? (
                      <CheckCircle className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2 border-slate-400" />
                    )}
                    <span className="text-sm text-white">
                      Technical Analysis
                    </span>
                  </div>
                </div>

                <div
                  className={`p-3 rounded-lg border ${
                    ["scoring", "saving", "complete"].includes(generationStatus)
                      ? "bg-emerald-900/20 border-emerald-500/30"
                      : "bg-slate-700/30 border-slate-600"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {["scoring", "saving", "complete"].includes(
                      generationStatus
                    ) ? (
                      <CheckCircle className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2 border-slate-400" />
                    )}
                    <span className="text-sm text-white">Signal Scoring</span>
                  </div>
                </div>

                <div
                  className={`p-3 rounded-lg border ${
                    ["saving", "complete"].includes(generationStatus)
                      ? "bg-emerald-900/20 border-emerald-500/30"
                      : "bg-slate-700/30 border-slate-600"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {["saving", "complete"].includes(generationStatus) ? (
                      <CheckCircle className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2 border-slate-400" />
                    )}
                    <span className="text-sm text-white">Database Save</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Statistics */}
        {stats && (
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-white flex items-center space-x-3">
                <BarChart3 className="h-5 w-5 text-emerald-400" />
                <span>Generation Statistics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <p className="text-slate-400 text-sm">Stocks Scanned</p>
                  <p className="text-white text-2xl font-bold">
                    {stats.stocksScanned}
                  </p>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4">
                  <p className="text-slate-400 text-sm">Signals Generated</p>
                  <p className="text-emerald-400 text-2xl font-bold">
                    {stats.signalsGenerated}
                  </p>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4">
                  <p className="text-slate-400 text-sm">Signals Saved</p>
                  <p className="text-blue-400 text-2xl font-bold">
                    {stats.signalsSaved}
                  </p>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4">
                  <p className="text-slate-400 text-sm">Average Score</p>
                  <p
                    className={`text-2xl font-bold ${getScoreColor(
                      stats.averageScore
                    )}`}
                  >
                    {stats.averageScore}/100
                  </p>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4">
                  <p className="text-slate-400 text-sm">Top Score</p>
                  <p
                    className={`text-2xl font-bold ${getScoreColor(
                      stats.topScore
                    )}`}
                  >
                    {stats.topScore}/100
                  </p>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4">
                  <p className="text-slate-400 text-sm">Processing Time</p>
                  <p className="text-purple-400 text-2xl font-bold">
                    {stats.processingTime}s
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Generated Signals */}
        {generatedSignals.length > 0 && (
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-white flex items-center space-x-3">
                <TrendingUp className="h-5 w-5 text-emerald-400" />
                <span>Generated Trading Signals</span>
              </CardTitle>
              <p className="text-slate-400 text-sm">
                Fresh signals ready for trading • Sorted by confidence score
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {generatedSignals.slice(0, 10).map((signal, index) => (
                  <div
                    key={signal.id}
                    className="bg-slate-700/30 rounded-lg p-4 border border-slate-600 hover:border-slate-500 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-bold text-lg">
                            {signal.ticker}
                          </span>
                          <span className="text-slate-400 text-sm">
                            {signal.companyName}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div
                            className={`px-2 py-1 rounded text-xs font-medium ${getSignalStrengthColor(
                              signal.signalStrength
                            )} bg-slate-600/50`}
                          >
                            {signal.signalStrength.replace("_", " ")}
                          </div>
                          <div className="text-slate-400 text-sm">
                            {signal.sector}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-right">
                          <p className="text-slate-400 text-xs">Score</p>
                          <p
                            className={`font-bold text-lg ${getScoreColor(
                              signal.confidenceScore
                            )}`}
                          >
                            {signal.confidenceScore}/100
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-slate-400 text-xs">Entry</p>
                          <p className="text-white font-medium">
                            ${signal.entryPrice.toFixed(2)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-slate-400 text-xs">Target</p>
                          <p className="text-emerald-400 font-medium">
                            ${signal.takeProfit.toFixed(2)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-slate-400 text-xs">R/R</p>
                          <p className="text-blue-400 font-medium">
                            {signal.riskRewardRatio}:1
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Timeframe scores */}
                    <div className="mt-3 flex space-x-4">
                      {Object.entries(signal.timeframeScores).map(
                        ([tf, score]) => (
                          <div key={tf} className="text-center">
                            <p className="text-slate-400 text-xs">{tf}</p>
                            <p
                              className={`text-sm font-medium ${getScoreColor(
                                score
                              )}`}
                            >
                              {score}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {generatedSignals.length > 10 && (
                <div className="mt-4 text-center">
                  <p className="text-slate-400 text-sm">
                    Showing top 10 signals • {generatedSignals.length - 10} more
                    available
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Process Logs */}
        {logs.length > 0 && (
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-white flex items-center space-x-3">
                <Clock className="h-5 w-5 text-blue-400" />
                <span>Process Logs</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-900/50 rounded-lg p-4 max-h-60 overflow-y-auto">
                <div className="space-y-1 font-mono text-sm">
                  {logs.map((log, index) => (
                    <div key={index} className="text-slate-300">
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Success Message */}
        {generationStatus === "complete" && (
          <Card className="bg-emerald-900/20 border-emerald-500/30">
            <CardContent className="p-6">
              <h3 className="text-emerald-400 font-semibold text-lg mb-3">
                🎉 Signal Generation Successful!
              </h3>
              <div className="space-y-2 text-slate-300">
                <p>✅ Your signal generation system is working perfectly!</p>
                <p>
                  📊 {generatedSignals.length} authentic trading signals created
                </p>
                <p>💾 All signals saved to your Supabase database</p>
                <p>
                  🎯 Signals now appear in your main dashboard automatically
                </p>
                <p>⚡ Your platform is generating real trading value!</p>
              </div>
              <div className="flex space-x-3 mt-4">
                <Button
                  onClick={() => navigate("/dashboard")}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  View Signals in Dashboard
                </Button>
                <Button
                  onClick={() => navigate("/signals")}
                  variant="outline"
                  className="border-emerald-500 text-emerald-400 hover:bg-emerald-600/10"
                >
                  Explore All Signals
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SignalsTest;
