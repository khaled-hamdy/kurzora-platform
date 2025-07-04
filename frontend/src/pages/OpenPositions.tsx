import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";
import { useToast } from "../hooks/use-toast";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  Eye,
  X,
  BarChart3,
  ArrowRight,
  Info,
  RefreshCw,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import OrderCloseDialog from "../components/orders/OrderCloseDialog";
import SignalModal from "../components/signals/SignalModal";
import { supabase } from "../lib/supabase";

interface Position {
  id: string;
  symbol: string;
  name: string;
  entryPrice: number;
  currentPrice: number;
  shares: number;
  entryDate: string;
  signalScore: number;
}

interface PaperTrade {
  id: string;
  ticker: string;
  trade_type: string;
  quantity: number;
  entry_price: number;
  current_price?: number; // ✅ NEW: Track current price in database
  is_open: boolean;
  opened_at: string;
  notes: string;
}

// ✅ FIXED: Accurate real-time price fetching with proper endpoints
const fetchRealTimePrice = async (ticker: string): Promise<number | null> => {
  try {
    const polygonApiKey = import.meta.env.VITE_POLYGON_API_KEY;

    if (!polygonApiKey) {
      console.warn("Polygon.io API key not configured");
      return null;
    }

    console.log(`🔍 Fetching real-time price for ${ticker}...`);

    // ✅ SOLUTION 1: Use last trade endpoint for most accurate current price
    const lastTradeResponse = await fetch(
      `https://api.polygon.io/v2/last/trade/${ticker}?apikey=${polygonApiKey}`
    );

    if (lastTradeResponse.ok) {
      const lastTradeData = await lastTradeResponse.json();
      console.log(`📊 Last trade data for ${ticker}:`, lastTradeData);

      if (lastTradeData?.results?.p && lastTradeData.results.p > 0) {
        const currentPrice = Number(lastTradeData.results.p);
        console.log(
          `✅ Got current price from last trade for ${ticker}: $${currentPrice}`
        );
        return currentPrice;
      }
    }

    // ✅ SOLUTION 2: Fallback to aggregates (daily) if last trade fails
    const today = new Date();
    const dateStr = today.toISOString().split("T")[0];

    console.log(`🔄 Trying daily aggregates for ${ticker} on ${dateStr}...`);

    const aggregatesResponse = await fetch(
      `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${dateStr}/${dateStr}?adjusted=true&sort=desc&limit=1&apikey=${polygonApiKey}`
    );

    if (aggregatesResponse.ok) {
      const aggregatesData = await aggregatesResponse.json();
      console.log(`📊 Aggregates data for ${ticker}:`, aggregatesData);

      if (aggregatesData?.results?.[0]?.c && aggregatesData.results[0].c > 0) {
        const currentPrice = Number(aggregatesData.results[0].c);
        console.log(
          `✅ Got current price from aggregates for ${ticker}: $${currentPrice}`
        );
        return currentPrice;
      }
    }

    // ✅ SOLUTION 3: Last resort - previous business day (but NOT outdated)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    // Skip weekends - go to Friday if today is Monday
    if (yesterday.getDay() === 0) {
      // Sunday
      yesterday.setDate(yesterday.getDate() - 2); // Go to Friday
    } else if (yesterday.getDay() === 6) {
      // Saturday
      yesterday.setDate(yesterday.getDate() - 1); // Go to Friday
    }

    const prevDateStr = yesterday.toISOString().split("T")[0];

    console.log(
      `🔄 Trying previous business day for ${ticker} on ${prevDateStr}...`
    );

    const prevDayResponse = await fetch(
      `https://api.polygon.io/v1/open-close/${ticker}/${prevDateStr}?adjusted=true&apikey=${polygonApiKey}`
    );

    if (prevDayResponse.ok) {
      const prevDayData = await prevDayResponse.json();
      console.log(`📊 Previous day data for ${ticker}:`, prevDayData);

      if (prevDayData?.close && prevDayData.close > 0) {
        const currentPrice = Number(prevDayData.close);
        console.log(
          `⚠️ Using previous business day close for ${ticker}: $${currentPrice}`
        );
        return currentPrice;
      }
    }

    console.warn(
      `❌ No valid price data found for ${ticker} from any endpoint`
    );
    return null;
  } catch (error) {
    console.error(`❌ Error fetching price for ${ticker}:`, error);
    return null;
  }
};

// ✅ NEW: Batch price update function
const updatePositionPrices = async (
  positions: Position[]
): Promise<{
  updated: number;
  errors: string[];
}> => {
  const results = {
    updated: 0,
    errors: [] as string[],
  };

  // Process positions in batches to respect rate limits
  for (const position of positions) {
    try {
      const realPrice = await fetchRealTimePrice(position.symbol);

      if (realPrice) {
        // Update database with real current price
        const { error: updateError } = await supabase
          .from("paper_trades")
          .update({
            current_price: realPrice,
            updated_at: new Date().toISOString(),
          })
          .eq("id", position.id);

        if (updateError) {
          console.error(
            `❌ Database update error for ${position.symbol}:`,
            updateError
          );
          results.errors.push(`${position.symbol}: Database update failed`);
        } else {
          results.updated++;
          console.log(`✅ Updated ${position.symbol} price: $${realPrice}`);
        }
      } else {
        results.errors.push(`${position.symbol}: Price fetch failed`);
      }

      // Add small delay to respect rate limits (300 calls/min = 200ms between calls)
      await new Promise((resolve) => setTimeout(resolve, 250));
    } catch (error) {
      console.error(`❌ Error processing ${position.symbol}:`, error);
      results.errors.push(`${position.symbol}: ${error.message}`);
    }
  }

  return results;
};

const OpenPositions: React.FC = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const [closeDialogOpen, setCloseDialogOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(
    null
  );
  const [signalModalOpen, setSignalModalOpen] = useState(false);
  const [selectedSignalData, setSelectedSignalData] = useState<any>(null);

  // State management
  const [openPositions, setOpenPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ NEW: Enhanced refresh state
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // ✅ ENHANCED: Load positions with real current prices
  const loadPositions = async () => {
    if (!user) {
      setOpenPositions([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log("🔄 Loading positions from database...");

      const { data, error: queryError } = await supabase
        .from("paper_trades")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_open", true)
        .order("opened_at", { ascending: false });

      if (queryError) {
        console.error("❌ Database error:", queryError);
        setError(queryError.message);
        return;
      }

      console.log("✅ Raw database data:", data);

      // Transform database data to Position format
      const positions: Position[] = (data || []).map((trade: PaperTrade) => {
        const companyName = trade.notes?.includes(" in ")
          ? trade.notes.split(" executed for ")[1]?.split(" in ")[0] ||
            `${trade.ticker} Corporation`
          : `${trade.ticker} Corporation`;

        return {
          id: trade.id,
          symbol: trade.ticker,
          name: companyName,
          entryPrice: Number(trade.entry_price),
          // ✅ ENHANCED: Use real current_price from database if available, otherwise entry price
          currentPrice: trade.current_price
            ? Number(trade.current_price)
            : Number(trade.entry_price),
          shares: trade.quantity,
          entryDate: trade.opened_at.split("T")[0],
          signalScore: 85, // Default score
        };
      });

      setOpenPositions(positions);
      console.log("✅ Transformed positions:", positions);
    } catch (err) {
      console.error("❌ Error loading positions:", err);
      setError(err instanceof Error ? err.message : "Failed to load positions");
    } finally {
      setLoading(false);
    }
  };

  // Load positions on component mount and user change
  useEffect(() => {
    loadPositions();
  }, [user?.id]);

  // Handle new trade from navigation state + refresh from database
  useEffect(() => {
    if (location.state?.newTrade) {
      console.log("🎉 New trade detected:", location.state.newTrade);
      loadPositions();

      const newTrade = location.state.newTrade;
      toast({
        title: "Trade Added to Positions!",
        description: `${newTrade.symbol} position is now being tracked.`,
      });

      navigate("/open-positions", { replace: true });
    }

    if (location.state?.shouldRefresh) {
      console.log("🔄 Refresh flag detected, reloading positions...");
      loadPositions();
      navigate("/open-positions", { replace: true });
    }
  }, [location.state, navigate]);

  if (!user) {
    navigate("/");
    return null;
  }

  // Loading state
  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="h-8 w-8 text-blue-400 animate-spin mr-3" />
            <span className="text-white text-lg">
              Loading your positions...
            </span>
          </div>
        </div>
      </Layout>
    );
  }

  // Error state
  if (error) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <Activity className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl text-white mb-2">Error loading positions</h3>
            <p className="text-slate-400 mb-4">{error}</p>
            <Button
              onClick={loadPositions}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  // Get existing position symbols for SignalModal
  const existingPositions = openPositions.map((position) => position.symbol);

  // Portfolio calculations
  const portfolioBalance = 100000;
  const totalPnL = openPositions.reduce((total, position) => {
    return (
      total + (position.currentPrice - position.entryPrice) * position.shares
    );
  }, 0);
  const totalPnLPercent = (totalPnL / portfolioBalance) * 100;

  const calculatePositionPnL = (position: Position) => {
    const pnl = (position.currentPrice - position.entryPrice) * position.shares;
    const pnlPercent =
      ((position.currentPrice - position.entryPrice) / position.entryPrice) *
      100;
    return { pnl, pnlPercent };
  };

  const handleOpenCloseDialog = (position: Position) => {
    console.log("Opening close dialog for position:", position);
    setSelectedPosition(position);
    setCloseDialogOpen(true);
  };

  const handleOpenSignalModal = (position: Position) => {
    const signalData = {
      symbol: position.symbol,
      name: position.name,
      price: position.currentPrice,
      change:
        ((position.currentPrice - position.entryPrice) / position.entryPrice) *
        100,
      signalScore: position.signalScore,
    };

    setSelectedSignalData(signalData);
    setSignalModalOpen(true);
  };

  const handleConfirmCloseOrder = async (
    closePrice: number,
    reason?: string
  ) => {
    if (!selectedPosition) return;

    try {
      // Update database to close the position
      const { error: updateError } = await supabase
        .from("paper_trades")
        .update({
          is_open: false,
          exit_price: closePrice,
          closed_at: new Date().toISOString(),
          profit_loss:
            (closePrice - selectedPosition.entryPrice) *
            selectedPosition.shares,
          profit_loss_percentage:
            ((closePrice - selectedPosition.entryPrice) /
              selectedPosition.entryPrice) *
            100,
        })
        .eq("id", selectedPosition.id);

      if (updateError) {
        console.error("❌ Error closing position:", updateError);
        toast({
          title: "Error closing position",
          description: updateError.message,
          variant: "destructive",
        });
        return;
      }

      const pnl =
        (closePrice - selectedPosition.entryPrice) * selectedPosition.shares;
      const pnlPercent =
        ((closePrice - selectedPosition.entryPrice) /
          selectedPosition.entryPrice) *
        100;

      // Determine reason if not provided
      let closeReason = reason || "Manual Exit";
      const takeProfit = selectedPosition.entryPrice * 1.15;
      const stopLoss = selectedPosition.entryPrice * 0.95;

      if (!reason) {
        if (closePrice >= takeProfit * 0.95) {
          closeReason = "Target Hit";
        } else if (closePrice <= stopLoss * 1.05) {
          closeReason = "Stop Loss";
        }
      }

      // Refresh positions from database
      await loadPositions();

      toast({
        title: "Position Closed",
        description: `${
          selectedPosition.symbol
        } position closed at $${closePrice.toFixed(2)}. P&L: ${
          pnl >= 0 ? "+" : ""
        }$${pnl.toFixed(2)}`,
      });

      // Navigate to orders history with the closed position data
      const newClosedPosition = {
        id: selectedPosition.id,
        symbol: selectedPosition.symbol,
        name: selectedPosition.name,
        entryPrice: selectedPosition.entryPrice,
        exitPrice: closePrice,
        shares: selectedPosition.shares,
        pnl: pnl,
        pnlPercent: pnlPercent,
        score: selectedPosition.signalScore,
        closedDate: new Date().toISOString().split("T")[0],
        reasonForClosing: closeReason,
      };

      navigate("/orders-history", {
        state: { newClosedPosition },
      });
    } catch (err) {
      console.error("❌ Error in handleConfirmCloseOrder:", err);
      toast({
        title: "Error closing position",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }

    setSelectedPosition(null);
    setCloseDialogOpen(false);
  };

  const handleGoToSignals = () => {
    navigate("/signals");
  };

  const handleViewOrdersHistory = () => {
    navigate("/orders-history");
  };

  // ✅ ENHANCED: Real-time price refresh function with improved accuracy
  const handleRefreshPositions = async () => {
    if (openPositions.length === 0) {
      toast({
        title: "No positions to update",
        description: "Open some positions first to track real-time prices.",
      });
      return;
    }

    console.log("🔄 Starting real-time price updates...");
    setRefreshing(true);

    try {
      // Show immediate feedback
      toast({
        title: "Updating prices...",
        description: `Fetching delayed prices for ${openPositions.length} position(s)`,
      });

      // Update prices using improved Polygon.io endpoints
      const results = await updatePositionPrices(openPositions);

      // Reload positions from database to get updated prices
      await loadPositions();

      // Set last updated timestamp
      setLastUpdated(new Date());

      // Show results
      if (results.updated > 0) {
        toast({
          title: "Prices Updated Successfully! 🎉",
          description: `Updated ${
            results.updated
          } position(s) with delayed prices. ${
            results.errors.length > 0
              ? `${results.errors.length} failed.`
              : "All prices current!"
          }`,
        });

        // ✅ PHASE 1.5: Auto-refresh dashboard after successful price updates
        console.log("🔄 Triggering dashboard refresh...");
        window.dispatchEvent(
          new CustomEvent("portfolioUpdated", {
            detail: {
              updated: results.updated,
              timestamp: new Date().toISOString(),
              positions: openPositions.map((p) => p.symbol),
            },
          })
        );
      } else {
        toast({
          title: "Price Update Issues",
          description:
            results.errors.length > 0
              ? `Failed to update prices: ${results.errors
                  .slice(0, 2)
                  .join(", ")}${results.errors.length > 2 ? "..." : ""}`
              : "No prices were updated. Please try again.",
          variant: "destructive",
        });
      }

      console.log(
        `✅ Price update complete: ${results.updated} updated, ${results.errors.length} errors`
      );
    } catch (error) {
      console.error("❌ Error during price refresh:", error);
      toast({
        title: "Price Update Failed",
        description: "Unable to fetch real-time prices. Please try again.",
        variant: "destructive",
      });
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <Layout>
      <TooltipProvider>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-white">My Positions</h1>
                {/* ✅ NEW: Last updated timestamp */}
                {lastUpdated && (
                  <p className="text-slate-400 text-sm mt-1 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1 text-emerald-400" />
                    Prices updated {lastUpdated.toLocaleTimeString()} (Delayed
                    15-20 min)
                  </p>
                )}
              </div>
              <div className="flex space-x-3">
                {/* ✅ ENHANCED: Smart refresh button with loading state */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleRefreshPositions}
                      disabled={refreshing}
                      variant="outline"
                      className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600 disabled:opacity-50"
                    >
                      <RefreshCw
                        className={`h-4 w-4 mr-2 ${
                          refreshing ? "animate-spin" : ""
                        }`}
                      />
                      {refreshing ? "Updating..." : "Refresh Prices"}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Fetch delayed prices from Polygon.io (15-20 min delay)
                    </p>
                  </TooltipContent>{" "}
                </Tooltip>

                <Button
                  onClick={handleViewOrdersHistory}
                  variant="outline"
                  className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600 hover:text-white hover:border-slate-500 transition-all duration-200"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  📘 Historical Trades
                </Button>
                <Button
                  onClick={handleGoToSignals}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <Activity className="h-4 w-4 mr-2" />
                  Browse Signals
                </Button>
              </div>
            </div>

            {/* Portfolio Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-blue-400" />
                    <div>
                      <p className="text-slate-400 text-sm">
                        Portfolio Balance
                      </p>
                      <p className="text-white font-bold text-xl">
                        ${portfolioBalance.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-emerald-400" />
                    <div>
                      <p className="text-slate-400 text-sm">Total P&L</p>
                      <p
                        className={`font-bold text-xl ${
                          totalPnL >= 0 ? "text-emerald-400" : "text-red-400"
                        }`}
                      >
                        {totalPnL >= 0 ? "+" : ""}${totalPnL.toFixed(0)} (
                        {totalPnL >= 0 ? "+" : ""}
                        {totalPnLPercent.toFixed(1)}%)
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-purple-400" />
                    <div>
                      <p className="text-slate-400 text-sm">Active Trades</p>
                      <p className="text-white font-bold text-xl">
                        {openPositions.length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-orange-400" />
                    <div>
                      <p className="text-slate-400 text-sm">Win Rate</p>
                      <p className="text-white font-bold text-xl">78%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Open Positions Section */}
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg text-white flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-emerald-400" />
                  <span>Open Positions ({openPositions.length})</span>
                </div>
                {/* ✅ ENHANCED: Better indicator */}
                <div className="flex items-center space-x-2">
                  {refreshing && (
                    <Badge className="bg-blue-600 text-white animate-pulse">
                      <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                      Updating Prices
                    </Badge>
                  )}
                  <Badge className="bg-orange-600 text-white">
                    ⏰ Delayed Data (15-20 min)
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {openPositions.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700">
                      <TableHead className="text-slate-300">Symbol</TableHead>
                      <TableHead className="text-slate-300">
                        Entry Price
                      </TableHead>
                      <TableHead className="text-slate-300">
                        Current Price
                      </TableHead>
                      <TableHead className="text-slate-300">Shares</TableHead>
                      <TableHead className="text-slate-300">P&L</TableHead>
                      <TableHead className="text-slate-300">% Change</TableHead>
                      <TableHead className="text-slate-300">Score</TableHead>
                      <TableHead className="text-slate-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {openPositions.map((position) => {
                      const { pnl, pnlPercent } =
                        calculatePositionPnL(position);
                      return (
                        <TableRow
                          key={position.id}
                          className="border-slate-700 hover:bg-slate-700/30"
                        >
                          <TableCell>
                            <div>
                              <div className="text-white font-semibold">
                                {position.symbol}
                              </div>
                              <div className="text-slate-400 text-sm">
                                {position.name}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-white">
                            ${position.entryPrice.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-white">
                            ${position.currentPrice.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-white">
                            {position.shares}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`font-semibold ${
                                pnl >= 0 ? "text-emerald-400" : "text-red-400"
                              }`}
                            >
                              {pnl >= 0 ? "+" : ""}${pnl.toFixed(0)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span
                              className={`font-semibold ${
                                pnlPercent >= 0
                                  ? "text-emerald-400"
                                  : "text-red-400"
                              }`}
                            >
                              {pnlPercent >= 0 ? "+" : ""}
                              {pnlPercent.toFixed(1)}%
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-emerald-600 text-white">
                              {position.signalScore}/100
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    onClick={() =>
                                      handleOpenSignalModal(position)
                                    }
                                    variant="outline"
                                    size="sm"
                                    className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white"
                                  >
                                    <Info className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>View Signal Details</p>
                                </TooltipContent>
                              </Tooltip>

                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    onClick={() =>
                                      handleOpenCloseDialog(position)
                                    }
                                    variant="outline"
                                    size="sm"
                                    className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Close Position</p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12">
                  <Activity className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                  <h3 className="text-xl text-white mb-2">No open positions</h3>
                  <p className="text-slate-400 mb-6">
                    Browse signals to start paper trading
                  </p>
                  <Button
                    onClick={handleGoToSignals}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    Go to Signals
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Dialogs */}
          <OrderCloseDialog
            open={closeDialogOpen}
            onOpenChange={setCloseDialogOpen}
            stock={
              selectedPosition
                ? {
                    symbol: selectedPosition.symbol,
                    name: selectedPosition.name,
                    price: selectedPosition.entryPrice,
                  }
                : { symbol: "", name: "", price: 0 }
            }
            shares={selectedPosition?.shares || 0}
            onConfirm={handleConfirmCloseOrder}
          />

          <SignalModal
            isOpen={signalModalOpen}
            onClose={() => setSignalModalOpen(false)}
            signal={selectedSignalData}
            onExecuteTrade={() => {}} // No action needed for viewing existing positions
            existingPositions={existingPositions}
            isViewingOnly={true}
          />

          {/* Disclaimer */}
          <div className="text-xs text-gray-500 text-center mt-8">
            *This is a simulation. No real capital is involved. Prices are
            delayed 15-20 minutes via Polygon.io.
            <br />
            For educational purposes only. Not financial advice.
          </div>
        </div>
      </TooltipProvider>
    </Layout>
  );
};

export default OpenPositions;
