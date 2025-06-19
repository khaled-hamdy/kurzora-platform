import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Slider } from "../components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Filter,
  RefreshCw,
} from "lucide-react";
import { useToast } from "../hooks/use-toast";
import SignalModal from "../components/signals/SignalModal";
import { useSignalsPageData } from "../hooks/useSignalsPageData";
import { usePositions } from "../contexts/PositionsContext"; // Use shared context!
import {
  filterSignals,
  calculateFinalScore,
} from "../utils/signalCalculations";
import { Signal } from "../types/signal";

const Signals: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // OPTIMIZED: Use shared context instead of individual database calls
  const { hasPosition, getButtonText, refreshPositions } = usePositions();

  const [timeFilter, setTimeFilter] = useState("1D");
  const [scoreThreshold, setScoreThreshold] = useState([70]);
  const [sectorFilter, setSectorFilter] = useState("all");
  const [marketFilter, setMarketFilter] = useState("global");
  const [selectedSignal, setSelectedSignal] = useState<{
    symbol: string;
    name: string;
    price: number;
    change: number;
    signalScore: number;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Use real data from shared context
  const {
    signals: realSignals,
    loading,
    error,
    refresh,
  } = useSignalsPageData();

  if (!user) {
    navigate("/");
    return null;
  }

  // Show loading state
  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Trading Signals
            </h1>
            <p className="text-slate-400">
              Loading real-time signals from database...
            </p>
          </div>
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="h-8 w-8 text-blue-400 animate-spin mr-3" />
            <span className="text-white text-lg">Loading signals...</span>
          </div>
        </div>
      </Layout>
    );
  }

  // Show error state
  if (error) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Trading Signals
            </h1>
            <p className="text-slate-400">
              Error loading signals from database
            </p>
          </div>
          <div className="text-center py-12">
            <Activity className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl text-white mb-2">Error loading signals</h3>
            <p className="text-slate-400 mb-4">{error}</p>
            <Button onClick={refresh} className="bg-blue-600 hover:bg-blue-700">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  // Use real signals with optimized filtering
  const filteredSignals = filterSignals(
    realSignals,
    timeFilter,
    scoreThreshold,
    sectorFilter,
    marketFilter
  );

  const handleViewSignal = (signal: Signal) => {
    const finalScore = calculateFinalScore(signal.signals);
    const signalData = {
      symbol: signal.ticker,
      name: signal.name,
      price: signal.price,
      change: signal.change,
      signalScore: finalScore,
    };

    setSelectedSignal(signalData);
    setIsModalOpen(true);
  };

  const handleExecuteTrade = (tradeData: any) => {
    // Navigate to open positions with the new trade data
    navigate("/open-positions", {
      state: {
        newTrade: tradeData,
      },
    });
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    // OPTIMIZED: Just refresh positions context once instead of individual calls
    refreshPositions();
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "bg-emerald-600";
    if (score >= 80) return "bg-blue-600";
    if (score >= 70) return "bg-amber-600";
    return "bg-red-600";
  };

  const getChangeColor = (change: number) => {
    return change >= 0 ? "text-emerald-400" : "text-red-400";
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Trading Signals
              </h1>
              <p className="text-slate-400">
                Browse and execute paper trades based on AI-powered signals
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className="bg-green-600 text-white">
                {realSignals.length} Live Signals
              </Badge>
              <Button
                onClick={refresh}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Refresh</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-blue-400" />
              <span>Filters</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="text-slate-300 text-sm font-medium mb-2 block">
                  Timeframe
                </label>
                <Select value={timeFilter} onValueChange={setTimeFilter}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="1D">1 Day</SelectItem>
                    <SelectItem value="1W">1 Week</SelectItem>
                    <SelectItem value="1M">1 Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-slate-300 text-sm font-medium mb-2 block">
                  Min Score: {scoreThreshold[0]}
                </label>
                <Slider
                  value={scoreThreshold}
                  onValueChange={setScoreThreshold}
                  max={100}
                  min={50}
                  step={5}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-slate-300 text-sm font-medium mb-2 block">
                  Sector
                </label>
                <Select value={sectorFilter} onValueChange={setSectorFilter}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="all">All Sectors</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="energy">Energy</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-slate-300 text-sm font-medium mb-2 block">
                  Market
                </label>
                <Select value={marketFilter} onValueChange={setMarketFilter}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="global">Global</SelectItem>
                    <SelectItem value="us">US Markets</SelectItem>
                    <SelectItem value="crypto">Crypto</SelectItem>
                    <SelectItem value="forex">Forex</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Signals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSignals.map((signal) => {
            const finalScore = calculateFinalScore(signal.signals);
            const hasExistingPosition = hasPosition(signal.ticker); // OPTIMIZED: Direct context call
            const buttonText = getButtonText(signal.ticker); // OPTIMIZED: Direct context call

            return (
              <Card
                key={signal.ticker}
                className="bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:bg-slate-800/70 transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        {signal.ticker}
                      </h3>
                      <p className="text-slate-400 text-sm">{signal.name}</p>
                      {hasExistingPosition && (
                        <Badge className="bg-blue-600 text-white text-xs mt-1">
                          📈 Position Open
                        </Badge>
                      )}
                      <p className="text-xs text-slate-500 mt-1">
                        {signal.timestamp}
                      </p>
                    </div>
                    <Badge
                      className={`${getScoreColor(finalScore)} text-white`}
                    >
                      {finalScore}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Price</span>
                      <span className="text-white font-semibold">
                        ${signal.price.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Change</span>
                      <span
                        className={`font-semibold flex items-center ${getChangeColor(
                          signal.change
                        )}`}
                      >
                        {signal.change >= 0 ? (
                          <TrendingUp className="h-4 w-4 mr-1" />
                        ) : (
                          <TrendingDown className="h-4 w-4 mr-1" />
                        )}
                        {signal.change >= 0 ? "+" : ""}
                        {signal.change.toFixed(2)}%
                      </span>
                    </div>

                    <div className="pt-3 border-t border-slate-700">
                      <div className="flex justify-between text-sm text-slate-400 mb-2">
                        <span>Signal Strength</span>
                        <span>
                          {finalScore >= 90
                            ? "Very Strong"
                            : finalScore >= 80
                            ? "Strong"
                            : "Moderate"}
                        </span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getScoreColor(
                            finalScore
                          )}`}
                          style={{ width: `${finalScore}%` }}
                        ></div>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleViewSignal(signal)}
                      className={`w-full text-white ${
                        hasExistingPosition
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "bg-emerald-600 hover:bg-emerald-700"
                      }`}
                      disabled={buttonText === "Loading..."}
                    >
                      <Activity className="h-4 w-4 mr-2" />
                      {buttonText}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredSignals.length === 0 && !loading && (
          <div className="text-center py-12">
            <Activity className="h-12 w-12 text-slate-500 mx-auto mb-4" />
            <h3 className="text-xl text-white mb-2">No signals found</h3>
            <p className="text-slate-400">
              Try adjusting your filters to see more signals
            </p>
            <Button
              onClick={refresh}
              className="mt-4 bg-blue-600 hover:bg-blue-700"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Signals
            </Button>
          </div>
        )}

        {/* Signal Modal */}
        <SignalModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          signal={selectedSignal}
          onExecuteTrade={handleExecuteTrade}
          existingPositions={[]} // Not needed anymore, context handles this
        />

        {/* Disclaimer */}
        <div className="text-xs text-gray-500 text-center mt-8">
          *This is a simulation. No real capital is involved.
        </div>
      </div>
    </Layout>
  );
};

export default Signals;
