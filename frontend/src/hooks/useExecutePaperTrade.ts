// src/hooks/useExecutePaperTrade.ts
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

export interface ExecuteTradeData {
  signalId: string;
  ticker: string;
  companyName: string;
  entryPrice: number;
  currentPrice: number;
  market: string;
  sector: string;
  quantity?: number;
}

export interface PaperTrade {
  id: string;
  user_id: string;
  signal_id: string;
  ticker: string;
  company_name: string;
  entry_price: number;
  current_price: number;
  quantity: number;
  total_investment: number;
  current_value: number;
  profit_loss: number;
  profit_loss_percentage: number;
  status: string;
  executed_at: string;
  market: string;
  sector: string;
}

export const useExecutePaperTrade = () => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const executePaperTrade = async (
    tradeData: ExecuteTradeData
  ): Promise<PaperTrade | null> => {
    if (!user) {
      setError("User not authenticated");
      return null;
    }

    setIsExecuting(true);
    setError(null);

    try {
      // Default quantity to 100 shares if not specified
      const quantity = tradeData.quantity || 100;
      const totalInvestment = tradeData.entryPrice * quantity;
      const currentValue = tradeData.currentPrice * quantity;
      const profitLoss = currentValue - totalInvestment;
      const profitLossPercentage = (profitLoss / totalInvestment) * 100;

      // Create paper trade record
      const { data: paperTrade, error: insertError } = await supabase
        .from("paper_trades")
        .insert({
          user_id: user.id,
          signal_id: tradeData.signalId,
          ticker: tradeData.ticker,
          company_name: tradeData.companyName,
          entry_price: tradeData.entryPrice,
          current_price: tradeData.currentPrice,
          quantity: quantity,
          total_investment: totalInvestment,
          current_value: currentValue,
          profit_loss: profitLoss,
          profit_loss_percentage: profitLossPercentage,
          status: "open",
          market: tradeData.market,
          sector: tradeData.sector,
          executed_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      // Update the signal status to 'triggered' and mark as having an open position
      const { error: updateError } = await supabase
        .from("trading_signals")
        .update({
          status: "triggered",
          has_open_position: true,
          position_id: paperTrade.id,
          executed_at: new Date().toISOString(),
        })
        .eq("id", tradeData.signalId);

      if (updateError) {
        console.warn("Failed to update signal status:", updateError);
        // Don't throw here as the paper trade was successfully created
      }

      console.log("✅ Paper trade executed successfully:", paperTrade);
      return paperTrade;
    } catch (err) {
      console.error("❌ Failed to execute paper trade:", err);
      setError(err instanceof Error ? err.message : "Failed to execute trade");
      return null;
    } finally {
      setIsExecuting(false);
    }
  };

  const getPaperTrades = async (): Promise<PaperTrade[]> => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from("paper_trades")
        .select("*")
        .eq("user_id", user.id)
        .order("executed_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error("Failed to fetch paper trades:", err);
      return [];
    }
  };

  const closePaperTrade = async (
    tradeId: string,
    exitPrice: number
  ): Promise<boolean> => {
    if (!user) return false;

    try {
      // Get the current trade
      const { data: trade, error: fetchError } = await supabase
        .from("paper_trades")
        .select("*")
        .eq("id", tradeId)
        .eq("user_id", user.id)
        .single();

      if (fetchError || !trade) {
        throw new Error("Trade not found");
      }

      // Calculate final P&L
      const currentValue = exitPrice * trade.quantity;
      const profitLoss = currentValue - trade.total_investment;
      const profitLossPercentage = (profitLoss / trade.total_investment) * 100;

      // Update trade as closed
      const { error: updateError } = await supabase
        .from("paper_trades")
        .update({
          status: "closed",
          current_price: exitPrice,
          current_value: currentValue,
          profit_loss: profitLoss,
          profit_loss_percentage: profitLossPercentage,
          closed_at: new Date().toISOString(),
        })
        .eq("id", tradeId);

      if (updateError) throw updateError;

      // Update signal status
      if (trade.signal_id) {
        await supabase
          .from("trading_signals")
          .update({
            has_open_position: false,
            position_id: null,
          })
          .eq("id", trade.signal_id);
      }

      return true;
    } catch (err) {
      console.error("Failed to close paper trade:", err);
      setError(err instanceof Error ? err.message : "Failed to close trade");
      return false;
    }
  };

  return {
    executePaperTrade,
    getPaperTrades,
    closePaperTrade,
    isExecuting,
    error,
    clearError: () => setError(null),
  };
};
