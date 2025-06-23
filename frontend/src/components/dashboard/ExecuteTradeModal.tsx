// src/components/dashboard/ExecuteTradeModal.tsx
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  AlertTriangle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import {
  useExecutePaperTrade,
  ExecuteTradeData,
} from "@/hooks/useExecutePaperTrade";
import { usePositions } from "@/contexts/PositionsContext";
// ✅ FIXED: Import centralized scoring function
import { calculateFinalScore } from "../../utils/signalCalculations";

interface Signal {
  id: string;
  ticker: string;
  company_name?: string;
  current_price: number;
  entry_price?: number;
  confidence_score: number;
  // ✅ FIXED: Add signals field for timeframe data
  signals?: {
    "1H": number;
    "4H": number;
    "1D": number;
    "1W": number;
  };
  sector?: string;
  market?: string;
  status?: string;
}

interface ExecuteTradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  signal: Signal | null;
  onSuccess?: (trade: any) => void;
}

export const ExecuteTradeModal: React.FC<ExecuteTradeModalProps> = ({
  isOpen,
  onClose,
  signal,
  onSuccess,
}) => {
  const [quantity, setQuantity] = useState(100);
  const [showSuccess, setShowSuccess] = useState(false);
  const { executePaperTrade, isExecuting, error, clearError } =
    useExecutePaperTrade();
  const { refreshPositions } = usePositions();

  if (!signal) return null;

  // ✅ FIXED: Calculate final score using centralized function if timeframe data available
  const finalScore = signal.signals
    ? calculateFinalScore(signal.signals)
    : calculateFinalScore({
        "1H": signal.confidence_score,
        "4H": signal.confidence_score,
        "1D": signal.confidence_score,
        "1W": signal.confidence_score,
      }); // ✅ FIXED: Use calculated score instead of raw DB value

  const entryPrice = signal.entry_price || signal.current_price;
  const totalInvestment = entryPrice * quantity;
  const isHighConfidence = finalScore >= 85;

  const handleExecute = async () => {
    console.log(`🚀 DEBUG - Button clicked for ${signal.ticker}`);
    clearError();

    const tradeData: ExecuteTradeData = {
      signalId: signal.id,
      ticker: signal.ticker,
      companyName: signal.company_name || signal.ticker,
      entryPrice: entryPrice,
      currentPrice: signal.current_price,
      market: signal.market || "USA",
      sector: signal.sector || "Technology",
      quantity: quantity,
    };

    console.log(`🚀 DEBUG - Executing trade for: ${signal.ticker}`, tradeData);

    try {
      const result = await executePaperTrade(tradeData);

      if (result) {
        console.log("✅ DEBUG - Trade executed successfully:", result);

        // CRITICAL: Force multiple refresh attempts to ensure state updates
        console.log("🔄 DEBUG - Starting position refresh sequence...");

        // First refresh attempt
        try {
          await refreshPositions();
          console.log("✅ DEBUG - First refresh completed");
        } catch (refreshError) {
          console.error("❌ DEBUG - First refresh failed:", refreshError);
        }

        // Wait and try again to ensure the database has the new data
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Second refresh attempt
        try {
          await refreshPositions();
          console.log("✅ DEBUG - Second refresh completed");
        } catch (refreshError) {
          console.error("❌ DEBUG - Second refresh failed:", refreshError);
        }

        // Third refresh attempt after another delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        try {
          await refreshPositions();
          console.log("✅ DEBUG - Final refresh completed");
        } catch (refreshError) {
          console.error("❌ DEBUG - Final refresh failed:", refreshError);
        }

        console.log("🎉 DEBUG - All refresh attempts completed");

        setShowSuccess(true);

        // Close modal and trigger success callback
        setTimeout(() => {
          setShowSuccess(false);
          onClose();
          onSuccess?.(result);

          // One final refresh after modal closes
          setTimeout(() => {
            console.log("🔄 DEBUG - Final background refresh");
            refreshPositions().catch(console.error);
          }, 500);
        }, 2000);
      } else {
        console.error("❌ DEBUG - Trade execution failed - no result returned");
      }
    } catch (executeError) {
      console.error("❌ DEBUG - Trade execution error:", executeError);
    }
  };

  const handleClose = () => {
    console.log("🚪 DEBUG - Modal closing");
    setQuantity(100);
    clearError();
    setShowSuccess(false);
    onClose();
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "bg-emerald-500";
    if (score >= 80) return "bg-blue-500";
    if (score >= 70) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Excellent";
    if (score >= 80) return "Strong";
    if (score >= 70) return "Moderate";
    return "Weak";
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-slate-900 border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-emerald-400" />
            Execute Paper Trade
          </DialogTitle>
        </DialogHeader>

        {showSuccess ? (
          <div className="py-8 text-center">
            <CheckCircle className="h-16 w-16 text-emerald-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Trade Executed!
            </h3>
            <p className="text-slate-400">
              Your paper trade for {signal.ticker} has been successfully
              executed. The button should update momentarily.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Signal Information */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {signal.ticker}
                    </h3>
                    <p className="text-sm text-slate-400">
                      {signal.company_name || "Company"}
                    </p>
                  </div>
                  <Badge
                    className={`${getScoreColor(
                      finalScore
                    )} text-white px-3 py-1`}
                  >
                    {finalScore}/100
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-slate-400">Entry Price</Label>
                    <p className="text-white font-semibold">
                      ${entryPrice.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-slate-400">Current Price</Label>
                    <p className="text-white font-semibold">
                      ${signal.current_price.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-slate-400">Signal Strength</Label>
                    <p className="text-white font-semibold">
                      {getScoreLabel(finalScore)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-slate-400">Sector</Label>
                    <p className="text-white font-semibold">
                      {signal.sector || "Technology"}
                    </p>
                  </div>
                </div>

                {/* ✅ FIXED: Show calculation source for debugging */}
                {signal.signals && (
                  <div className="mt-3 pt-3 border-t border-slate-700">
                    <Label className="text-slate-400 text-xs">
                      Score Breakdown
                    </Label>
                    <div className="flex gap-2 text-xs text-slate-500 mt-1">
                      <span>1H: {signal.signals["1H"]}</span>
                      <span>4H: {signal.signals["4H"]}</span>
                      <span>1D: {signal.signals["1D"]}</span>
                      <span>1W: {signal.signals["1W"]}</span>
                      <span>→ Final: {finalScore}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Trade Configuration */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="quantity" className="text-slate-300">
                  Quantity (Shares)
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  min="1"
                  max="10000"
                  className="bg-slate-800 border-slate-700 text-white mt-1"
                />
              </div>

              {/* Investment Summary */}
              <Card className="bg-slate-800/30 border-slate-700">
                <CardContent className="p-4">
                  <h4 className="text-white font-semibold mb-3">
                    Investment Summary
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Shares:</span>
                      <span className="text-white">
                        {quantity.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Price per share:</span>
                      <span className="text-white">
                        ${entryPrice.toFixed(2)}
                      </span>
                    </div>
                    <Separator className="bg-slate-700" />
                    <div className="flex justify-between font-semibold">
                      <span className="text-slate-300">Total Investment:</span>
                      <span className="text-emerald-400">
                        ${totalInvestment.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Risk Warning */}
            {!isHighConfidence && (
              <Alert className="bg-yellow-500/10 border-yellow-500/30">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <AlertDescription className="text-yellow-200">
                  This signal has a moderate confidence score ({finalScore}
                  /100). Consider the risk before executing.
                </AlertDescription>
              </Alert>
            )}

            {/* Error Display */}
            {error && (
              <Alert className="bg-red-500/10 border-red-500/30">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <AlertDescription className="text-red-200">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isExecuting}
                className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </Button>
              <Button
                onClick={handleExecute}
                disabled={isExecuting}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {isExecuting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Executing...
                  </>
                ) : (
                  <>
                    <Target className="h-4 w-4 mr-2" />
                    Execute Paper Trade
                  </>
                )}
              </Button>
            </div>

            {/* Disclaimer */}
            <p className="text-xs text-slate-500 text-center">
              This is a simulated paper trade. No real money will be invested.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
