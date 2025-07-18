import React, { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
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
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  BarChart3,
  RefreshCw,
  Activity,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { usePaperTrades } from "../hooks/usePaperTrades"; // ✅ NEW: Import real data hook
import { useToast } from "../hooks/use-toast";

const OrdersHistory: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // ✅ NEW: Use real data from database instead of mock data
  const {
    trades: closedTrades,
    summary,
    loading,
    error,
    refreshTrades,
  } = usePaperTrades();

  // ✅ NEW: Handle new closed position from navigation state
  useEffect(() => {
    if (location.state?.newClosedPosition) {
      console.log(
        "🎉 OrdersHistory: New closed position detected:",
        location.state.newClosedPosition
      );

      // Refresh trades from database
      refreshTrades();

      const closedPosition = location.state.newClosedPosition;
      toast({
        title: "Position Closed Successfully!",
        description: `${closedPosition.symbol} closed with P&L: ${
          closedPosition.pnl >= 0 ? "+" : ""
        }$${closedPosition.pnl.toFixed(2)}`,
      });

      // Clear the navigation state
      navigate("/orders-history", { replace: true });
    }
  }, [location.state, navigate, refreshTrades, toast]);

  if (!user) {
    navigate("/");
    return null;
  }

  // ✅ NEW: Loading state
  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="h-8 w-8 text-blue-400 animate-spin mr-3" />
            <span className="text-white text-lg">
              Loading your trading history...
            </span>
          </div>
        </div>
      </Layout>
    );
  }

  // ✅ NEW: Error state
  if (error) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <Activity className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl text-white mb-2">
              Error loading trading history
            </h3>
            <p className="text-slate-400 mb-4">{error}</p>
            <Button
              onClick={refreshTrades}
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

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  const getReasonBadgeColor = (reason: string) => {
    switch (reason) {
      case "Target Hit":
        return "bg-emerald-600";
      case "Stop Loss":
        return "bg-red-600";
      case "Manual Exit":
        return "bg-blue-600";
      case "Reversal":
        return "bg-orange-600";
      default:
        return "bg-gray-600";
    }
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 90) return "bg-emerald-600";
    if (score >= 80) return "bg-blue-600";
    if (score >= 70) return "bg-amber-600";
    return "bg-red-600";
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleBackToDashboard}
                variant="outline"
                className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600 hover:text-white hover:border-slate-500 transition-all duration-200"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-3xl font-bold text-white">Orders History</h1>
            </div>
            {/* ✅ NEW: Refresh button */}
            <Button
              onClick={refreshTrades}
              variant="outline"
              className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          {/* Summary Stats - ✅ NEW: Using real data from summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-blue-400" />
                  <div>
                    <p className="text-slate-400 text-sm">Total Trades</p>
                    <p className="text-white font-bold text-xl">
                      {summary.totalTrades}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  {summary.totalPnL >= 0 ? (
                    <TrendingUp className="h-5 w-5 text-emerald-400" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-400" />
                  )}
                  <div>
                    <p className="text-slate-400 text-sm">Total P&L</p>
                    <p
                      className={`font-bold text-xl ${
                        summary.totalPnL >= 0
                          ? "text-emerald-400"
                          : "text-red-400"
                      }`}
                    >
                      {summary.totalPnL >= 0 ? "+" : ""}$
                      {summary.totalPnL.toFixed(0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-amber-400" />
                  <div>
                    <p className="text-slate-400 text-sm">Win Rate</p>
                    <p className="text-amber-400 font-bold text-xl">
                      {summary.winRate.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Trading History Table */}
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-blue-400" />
                <span>📘 Learn from Past Trades</span>
              </div>
              {/* ✅ NEW: Show real data indicator */}
              <Badge className="bg-green-600 text-white">📊 Real Data</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {closedTrades.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700">
                    <TableHead className="text-slate-300">Symbol</TableHead>
                    <TableHead className="text-slate-300">
                      Entry Price
                    </TableHead>
                    <TableHead className="text-slate-300">Exit Price</TableHead>
                    <TableHead className="text-slate-300">Shares</TableHead>
                    <TableHead className="text-slate-300">
                      % Gain/Loss
                    </TableHead>
                    <TableHead className="text-slate-300">Score</TableHead>
                    <TableHead className="text-slate-300">Final P&L</TableHead>
                    <TableHead className="text-slate-300">Reason</TableHead>
                    {/* ✅ NEW: Entry Date column header */}
                    <TableHead className="text-slate-300">Entry Date</TableHead>
                    <TableHead className="text-slate-300">
                      Closed Date
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {closedTrades.map((trade) => (
                    <TableRow
                      key={trade.id}
                      className="border-slate-700 hover:bg-slate-700/30"
                    >
                      <TableCell>
                        <div>
                          <div className="text-white font-semibold">
                            {trade.symbol}
                          </div>
                          <div className="text-slate-400 text-sm">
                            {trade.name}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-white">
                        ${trade.entryPrice.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-white">
                        ${trade.exitPrice.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-white">
                        {trade.shares}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`font-semibold ${
                            trade.pnlPercent >= 0
                              ? "text-emerald-400"
                              : "text-red-400"
                          }`}
                        >
                          {trade.pnlPercent >= 0 ? "+" : ""}
                          {trade.pnlPercent.toFixed(1)}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`${getScoreBadgeColor(
                            trade.score
                          )} text-white`}
                        >
                          {trade.score}/100
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`font-semibold ${
                            trade.pnl >= 0 ? "text-emerald-400" : "text-red-400"
                          }`}
                        >
                          {trade.pnl >= 0 ? "+" : ""}${trade.pnl.toFixed(0)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={getReasonBadgeColor(
                            trade.reasonForClosing
                          )}
                        >
                          {trade.reasonForClosing}
                        </Badge>
                      </TableCell>
                      {/* ✅ NEW: Entry Date column data */}
                      <TableCell className="text-slate-400">
                        {trade.entryDate}
                      </TableCell>
                      <TableCell className="text-slate-400">
                        {trade.closedDate}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              // ✅ NEW: Empty state for no closed trades
              <div className="text-center py-12">
                <BarChart3 className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                <h3 className="text-xl text-white mb-2">
                  No trading history yet
                </h3>
                <p className="text-slate-400 mb-6">
                  Close some positions to see your trading performance here
                </p>
                <Button
                  onClick={() => navigate("/open-positions")}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  View Open Positions
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <div className="text-xs text-gray-500 text-center mt-4">
          *These are simulated paper trading results. No real capital was
          involved.
        </div>
      </div>
    </Layout>
  );
};

export default OrdersHistory;
