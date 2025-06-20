// Fixed usePortfolioSummary hook - Recent Trades now shows ALL recent activity
// src/hooks/usePortfolioSummary.ts
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";

interface RecentTrade {
  ticker: string;
  pnl: number;
  date: string;
  profit_loss_percentage?: number;
  isOpen: boolean; // NEW: Track if position is open or closed
}

interface PortfolioSummary {
  totalValue: number;
  totalPnL: number;
  totalPnLPercent: number;
  winRate: number;
  activePositions: number;
  totalTrades: number;
  recentTrades: RecentTrade[]; // Shows ALL recent activity (open + closed)
  isLoading: boolean;
  error: string | null;
}

export const usePortfolioSummary = (): PortfolioSummary => {
  const { user } = useAuth();
  const [summary, setSummary] = useState<PortfolioSummary>({
    totalValue: 0,
    totalPnL: 0,
    totalPnLPercent: 0,
    winRate: 0,
    activePositions: 0,
    totalTrades: 0,
    recentTrades: [], // Shows most recent trading activity
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    if (!user) return;

    const fetchPortfolioSummary = async () => {
      try {
        setSummary((prev) => ({ ...prev, isLoading: true, error: null }));

        // Fetch all paper trades for the user (ordered by creation date)
        const { data: trades, error } = await supabase
          .from("paper_trades")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }); // Most recent first

        if (error) throw error;

        // Calculate metrics
        const openTrades = trades?.filter((trade) => trade.is_open) || [];
        const closedTrades = trades?.filter((trade) => !trade.is_open) || [];

        // Portfolio Value (sum of current market values for open positions)
        const totalValue = openTrades.reduce((sum, trade) => {
          const currentPrice = trade.current_price || trade.entry_price;
          const currentValue = currentPrice * trade.quantity;
          return sum + currentValue;
        }, 0);

        // Total P&L (open + closed)
        const openPnL = openTrades.reduce((sum, trade) => {
          const currentPrice = trade.current_price || trade.entry_price;
          const pnl = (currentPrice - trade.entry_price) * trade.quantity;
          return sum + pnl;
        }, 0);

        const closedPnL = closedTrades.reduce((sum, trade) => {
          return sum + (trade.profit_loss || 0);
        }, 0);

        const totalPnL = openPnL + closedPnL;

        // Calculate total investment for percentage
        const totalInvestment =
          trades?.reduce((sum, trade) => {
            return sum + trade.entry_price * trade.quantity;
          }, 0) || 1;

        const totalPnLPercent = (totalPnL / totalInvestment) * 100;

        // Win Rate (only from closed trades)
        const winningTrades = closedTrades.filter(
          (trade) => (trade.profit_loss || 0) > 0
        ).length;
        const winRate =
          closedTrades.length > 0
            ? (winningTrades / closedTrades.length) * 100
            : 0;

        // 🎯 FIXED: Recent Trades now shows ALL recent activity (last 3 trades regardless of status)
        const recentTrades = (trades || []).slice(0, 3).map((trade) => {
          let pnl: number;
          let date: string;

          if (trade.is_open) {
            // For open positions, calculate unrealized P&L
            const currentPrice = trade.current_price || trade.entry_price;
            pnl = (currentPrice - trade.entry_price) * trade.quantity;
            date = new Date(trade.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
          } else {
            // For closed positions, use actual profit/loss
            pnl = trade.profit_loss || 0;
            date = trade.closed_at
              ? new Date(trade.closed_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              : new Date(trade.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
          }

          return {
            ticker: trade.ticker,
            pnl,
            date,
            profit_loss_percentage:
              trade.profit_loss_percentage ||
              ((trade.current_price || trade.entry_price - trade.entry_price) /
                trade.entry_price) *
                100,
            isOpen: trade.is_open, // Track if this is an open or closed position
          };
        });

        setSummary({
          totalValue,
          totalPnL,
          totalPnLPercent,
          winRate,
          activePositions: openTrades.length,
          totalTrades: trades?.length || 0,
          recentTrades, // ✅ Now includes your latest trades (2222.SR, AMZN, etc.)
          isLoading: false,
          error: null,
        });
      } catch (error) {
        console.error("Error fetching portfolio summary:", error);
        setSummary((prev) => ({
          ...prev,
          isLoading: false,
          error: error.message || "Failed to fetch portfolio data",
        }));
      }
    };

    fetchPortfolioSummary();

    // Set up real-time subscription for updates
    const subscription = supabase
      .channel("portfolio-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "paper_trades",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          console.log("Portfolio data changed - refreshing Recent Trades");
          fetchPortfolioSummary();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  return summary;
};
