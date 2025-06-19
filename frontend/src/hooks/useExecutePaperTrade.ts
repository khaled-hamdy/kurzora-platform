import { useState } from "react";
import { supabase } from "../lib/supabase";

export interface ExecuteTradeData {
  signalId?: string; // Make this optional
  ticker: string;
  companyName: string;
  entryPrice: number;
  currentPrice: number;
  market: string;
  sector: string;
  quantity: number;
}

export const useExecutePaperTrade = () => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const executePaperTrade = async (tradeData: ExecuteTradeData) => {
    console.log(`🚀 DEBUG - Executing paper trade for ${tradeData.ticker}...`);
    setIsExecuting(true);
    setError(null);

    try {
      // Get current user
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error("User not authenticated");
      }

      // ← FIXED: Set signal_id to null to match existing data pattern
      const paperTradeData = {
        user_id: user.id,
        signal_id: null, // ← Set to null instead of the UUID
        ticker: tradeData.ticker,
        trade_type: "buy" as const,
        quantity: tradeData.quantity,
        entry_price: tradeData.entryPrice,
        exit_price: null,
        stop_loss: tradeData.entryPrice * 0.95, // 5% stop loss
        take_profit: tradeData.entryPrice * 1.15, // 15% take profit
        profit_loss: null,
        profit_loss_percentage: null,
        is_open: true,
        opened_at: new Date().toISOString(),
        closed_at: null,
        notes: `Paper trade executed for ${tradeData.companyName} in ${tradeData.sector} sector`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      console.log("📝 DEBUG - Creating paper trade with data:", paperTradeData);

      const { data, error: insertError } = await supabase
        .from("paper_trades")
        .insert([paperTradeData])
        .select()
        .single();

      if (insertError) {
        console.error("❌ DEBUG - Database insert error:", insertError);
        throw insertError;
      }

      console.log("✅ DEBUG - Trade inserted successfully:", data);
      return data;
    } catch (err) {
      console.error("❌ DEBUG - Failed to execute paper trade:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      return null;
    } finally {
      setIsExecuting(false);
    }
  };

  return {
    executePaperTrade,
    isExecuting,
    error,
    clearError,
  };
};
