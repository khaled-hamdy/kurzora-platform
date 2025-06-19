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

  // Mock data for open positions
  const [openPositions, setOpenPositions] = useState<Position[]>([
    {
      id: "1",
      symbol: "AAPL",
      name: "Apple Inc.",
      entryPrice: 160.02,
      currentPrice: 165.2,
      shares: 227,
      entryDate: "2025-06-08",
      signalScore: 88,
    },
    {
      id: "2",
      symbol: "NVDA",
      name: "NVIDIA Corp.",
      entryPrice: 750.12,
      currentPrice: 748.3,
      shares: 45,
      entryDate: "2025-06-07",
      signalScore: 92,
    },
    {
      id: "3",
      symbol: "MSFT",
      name: "Microsoft Corp.",
      entryPrice: 412.45,
      currentPrice: 419.8,
      shares: 120,
      entryDate: "2025-06-06",
      signalScore: 85,
    },
    {
      id: "4",
      symbol: "META",
      name: "Meta Platforms Inc.",
      entryPrice: 320.54,
      currentPrice: 342.15,
      shares: 30,
      entryDate: "2025-06-05",
      signalScore: 89,
    },
    {
      id: "5",
      symbol: "ETH",
      name: "Ethereum",
      entryPrice: 2680.5,
      currentPrice: 2750.25,
      shares: 25,
      entryDate: "2025-06-04",
      signalScore: 91,
    },
    {
      id: "6",
      symbol: "EURUSD",
      name: "Euro / US Dollar",
      entryPrice: 1.0542,
      currentPrice: 1.0567,
      shares: 18,
      entryDate: "2025-06-03",
      signalScore: 92,
    },
  ]);

  // Get existing position symbols
  const existingPositions = openPositions.map((position) => position.symbol);

  // Check if there's a new trade from navigation state
  useEffect(() => {
    if (location.state?.newTrade) {
      const newTrade = location.state.newTrade;
      const newPosition: Position = {
        id: Date.now().toString(),
        symbol: newTrade.symbol,
        name: newTrade.name,
        entryPrice: newTrade.entryPrice,
        currentPrice: newTrade.entryPrice, // Start with entry price
        shares: newTrade.shares,
        entryDate: new Date().toISOString().split("T")[0],
        signalScore: newTrade.signalScore,
      };

      setOpenPositions((prev) => [newPosition, ...prev]);

      // Clear the navigation state
      navigate("/open-positions", { replace: true });
    }
  }, [location.state, navigate]);

  if (!user) {
    navigate("/");
    return null;
  }

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
    console.log("OpenPositions: Opening close dialog for position:", position);
    console.log("OpenPositions: Position shares:", position.shares);

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

  const handleConfirmCloseOrder = (closePrice: number, reason?: string) => {
    if (!selectedPosition) return;

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
        // Near take profit
        closeReason = "Target Hit";
      } else if (closePrice <= stopLoss * 1.05) {
        // Near stop loss
        closeReason = "Stop Loss";
      }
    }

    // Remove the position from open positions
    setOpenPositions((prev) =>
      prev.filter((p) => p.id !== selectedPosition.id)
    );

    // Navigate to orders history with the new closed position
    const newClosedPosition = {
      id: Date.now().toString(),
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

    toast({
      title: "Position Closed",
      description: `${
        selectedPosition.symbol
      } position closed at $${closePrice.toFixed(2)}. P&L: ${
        pnl >= 0 ? "+" : ""
      }$${pnl.toFixed(2)}`,
    });

    // Navigate to orders history to show the closed position
    navigate("/orders-history", {
      state: {
        newClosedPosition,
      },
    });

    setSelectedPosition(null);
    setCloseDialogOpen(false);
  };

  const handleGoToSignals = () => {
    navigate("/signals");
  };

  const handleViewOrdersHistory = () => {
    navigate("/orders-history");
  };

  return (
    <Layout>
      <TooltipProvider>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-white">My Positions</h1>
              <div className="flex space-x-3">
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

          {/* Open Positions Section - No More Tabs */}
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg text-white flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-emerald-400" />
                  <span>Open Positions ({openPositions.length})</span>
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
            isViewingOnly={true} // This is the key change - we're only viewing details
          />

          {/* Disclaimer */}
          <div className="text-xs text-gray-500 text-center mt-8">
            *This is a simulation. No real capital is involved.
          </div>
        </div>
      </TooltipProvider>
    </Layout>
  );
};

export default OpenPositions;
