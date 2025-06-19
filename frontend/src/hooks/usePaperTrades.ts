import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";

interface ClosedTrade {
  id: string;
  symbol: string;
  name: string;
  entryPrice: number;
  exitPrice: number;
  shares: number;
  pnl: number;
  pnlPercent: number;
  score: number;
  closedDate: string;
  reasonForClosing: string;
}

interface PaperTradeData {
  trades: ClosedTrade[];
  summary: {
    totalTrades: number;
    totalPnL: number;
    winRate: number;
    avgReturn: number;
  };
}

export const usePaperTrades = () => {
  const [data, setData] = useState<PaperTradeData>({
    trades: [],
    summary: {
      totalTrades: 0,
      totalPnL: 0,
      winRate: 0,
      avgReturn: 0,
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchClosedTrades = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      console.log(
        "🔄 usePaperTrades: Fetching closed trades for user:",
        user.id
      );

      // Fetch closed trades from paper_trades table
      const { data: closedTradesData, error: fetchError } = await supabase
        .from("paper_trades")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_open", false)
        .order("closed_at", { ascending: false });

      if (fetchError) {
        console.error("❌ usePaperTrades: Database error:", fetchError);
        throw new Error("Failed to fetch closed trades");
      }

      console.log(
        "✅ usePaperTrades: Raw closed trades data:",
        closedTradesData
      );

      // Transform the data to match the ClosedTrade interface
      const transformedTrades: ClosedTrade[] = (closedTradesData || []).map(
        (trade) => {
          // Extract company name from notes if available, otherwise use ticker
          const companyName = trade.notes?.includes(" in ")
            ? trade.notes.split(" executed for ")[1]?.split(" in ")[0] ||
              `${trade.ticker} Corporation`
            : `${trade.ticker} Corporation`;

          // Calculate P&L from database or from prices
          const pnl =
            trade.profit_loss ||
            ((trade.exit_price || 0) - trade.entry_price) * trade.quantity;
          const pnlPercent =
            trade.profit_loss_percentage ||
            (((trade.exit_price || 0) - trade.entry_price) /
              trade.entry_price) *
              100;

          // Determine exit reason based on P&L if not specified
          let exitReason = "Manual Exit";
          if (pnl > 0 && pnlPercent > 5) {
            exitReason = "Target Hit";
          } else if (pnl < 0 && pnlPercent < -5) {
            exitReason = "Stop Loss";
          }

          return {
            id: trade.id,
            symbol: trade.ticker,
            name: companyName,
            entryPrice: Number(trade.entry_price),
            exitPrice: Number(trade.exit_price || trade.entry_price),
            shares: trade.quantity,
            pnl: Number(pnl),
            pnlPercent: Number(pnlPercent),
            score: 85,
            closedDate: trade.closed_at
              ? new Date(trade.closed_at).toISOString().split("T")[0]
              : "Unknown",
            reasonForClosing: exitReason,
          };
        }
      );

      // Calculate summary statistics
      const totalTrades = transformedTrades.length;
      const totalPnL = transformedTrades.reduce(
        (sum, trade) => sum + trade.pnl,
        0
      );
      const winningTrades = transformedTrades.filter(
        (trade) => trade.pnl > 0
      ).length;
      const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
      const avgReturn =
        totalTrades > 0
          ? transformedTrades.reduce(
              (sum, trade) => sum + trade.pnlPercent,
              0
            ) / totalTrades
          : 0;

      const summary = {
        totalTrades,
        totalPnL,
        winRate,
        avgReturn,
      };

      console.log("📊 usePaperTrades: Transformed trades:", transformedTrades);
      console.log("📊 usePaperTrades: Summary stats:", summary);

      setData({
        trades: transformedTrades,
        summary,
      });

      setError(null);
    } catch (err) {
      console.error("❌ usePaperTrades: Error fetching trades:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClosedTrades();
  }, [user]);

  const refreshTrades = () => {
    setLoading(true);
    fetchClosedTrades();
  };

  return {
    trades: data.trades,
    summary: data.summary,
    loading,
    error,
    refreshTrades,
  };
};
