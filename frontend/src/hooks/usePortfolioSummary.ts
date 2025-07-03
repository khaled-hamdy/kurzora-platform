// Fixed usePortfolioSummary hook - Proper Portfolio Value + $25K Starting Balance
// src/hooks/usePortfolioSummary.ts
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";

interface RecentTrade {
  ticker: string;
  pnl: number;
  date: string;
  profit_loss_percentage?: number;
  isOpen: boolean; // Track if position is open or closed
}

interface PortfolioSummary {
  totalValue: number; // Total account value (cash + open positions)
  availableCash: number; // NEW: Cash available for trading
  totalPnL: number; // Total profit/loss from all trades
  totalPnLPercent: number; // P&L percentage vs starting balance
  winRate: number; // Success rate from closed trades
  activePositions: number; // Number of open positions
  totalTrades: number; // Total number of trades executed
  recentTrades: RecentTrade[]; // Recent trading activity
  isLoading: boolean;
  error: string | null;
}

// ✅ UPGRADED: Starting balance increased to $25,000 (industry best practice)
const STARTING_BALANCE = 25000; // $25K virtual money for proper portfolio management

export const usePortfolioSummary = (): PortfolioSummary => {
  const { user } = useAuth();
  const [summary, setSummary] = useState<PortfolioSummary>({
    totalValue: STARTING_BALANCE, // Start with $25K
    availableCash: STARTING_BALANCE, // All cash initially
    totalPnL: 0,
    totalPnLPercent: 0,
    winRate: 0,
    activePositions: 0,
    totalTrades: 0,
    recentTrades: [],
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

        // Separate open and closed trades
        const openTrades = trades?.filter((trade) => trade.is_open) || [];
        const closedTrades = trades?.filter((trade) => !trade.is_open) || [];

        // 💰 CALCULATE OPEN POSITIONS VALUE (current market value of stocks owned)
        const openPositionsValue = openTrades.reduce((sum, trade) => {
          const currentPrice = trade.current_price || trade.entry_price;
          const currentValue = currentPrice * trade.quantity;
          return sum + currentValue;
        }, 0);

        // 📈 CALCULATE TOTAL P&L (profit/loss from all trading activity)

        // Unrealized P&L (from open positions)
        const openPnL = openTrades.reduce((sum, trade) => {
          const currentPrice = trade.current_price || trade.entry_price;
          const pnl = (currentPrice - trade.entry_price) * trade.quantity;
          return sum + pnl;
        }, 0);

        // Realized P&L (from closed positions)
        const closedPnL = closedTrades.reduce((sum, trade) => {
          return sum + (trade.profit_loss || 0);
        }, 0);

        const totalPnL = openPnL + closedPnL;

        // 🏦 CALCULATE PORTFOLIO VALUE (total account value)
        // Portfolio Value = Starting Balance + Total P&L
        // This represents the total value of the user's account
        const totalValue = STARTING_BALANCE + totalPnL;

        // 💵 CALCULATE AVAILABLE CASH (money available for new trades)
        // Available Cash = Total Portfolio Value - Open Positions Value
        const availableCash = totalValue - openPositionsValue;

        // 📊 CALCULATE P&L PERCENTAGE (vs starting balance)
        const totalPnLPercent = (totalPnL / STARTING_BALANCE) * 100;

        // 🎯 CALCULATE WIN RATE (only from closed trades)
        const winningTrades = closedTrades.filter(
          (trade) => (trade.profit_loss || 0) > 0
        ).length;
        const winRate =
          closedTrades.length > 0
            ? (winningTrades / closedTrades.length) * 100
            : 0;

        // 📋 PREPARE RECENT TRADES (last 3 trades regardless of status)
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
            isOpen: trade.is_open,
          };
        });

        // ✅ UPDATE STATE WITH CORRECTED CALCULATIONS
        setSummary({
          totalValue, // $25,000 + $38,836 = $63,836 (total account value)
          availableCash, // $63,836 - $0 = $63,836 (available for trading)
          totalPnL, // +$38,836 (unchanged - your trading profit)
          totalPnLPercent, // 155.3% return on $25K starting balance
          winRate, // 100% (unchanged - perfect win rate!)
          activePositions: openTrades.length, // 0 (no open positions)
          totalTrades: trades?.length || 0, // Total trades executed
          recentTrades, // Recent trading activity
          isLoading: false,
          error: null,
        });

        // 🎉 LOG SUCCESS (for debugging)
        console.log("Portfolio Summary Calculated:", {
          startingBalance: STARTING_BALANCE,
          totalPnL,
          totalValue,
          availableCash,
          openPositions: openTrades.length,
          closedTrades: closedTrades.length,
          winRate: `${winRate.toFixed(1)}%`,
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
          console.log("Portfolio data changed - refreshing summary");
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
