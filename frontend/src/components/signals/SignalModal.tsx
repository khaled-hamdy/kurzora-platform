import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Slider } from "../ui/slider";
import {
  X,
  TrendingUp,
  Shield,
  Calculator,
  AlertTriangle,
  Plus,
} from "lucide-react";
import { useToast } from "../../hooks/use-toast";

interface SignalModalProps {
  isOpen: boolean;
  onClose: () => void;
  signal: {
    symbol: string;
    name: string;
    price: number;
    change: number;
    signalScore: number;
  } | null;
  onExecuteTrade: (tradeData: any) => void;
  existingPositions?: string[]; // Array of symbols with existing positions
  isViewingOnly?: boolean; // New prop to indicate if this is just for viewing details
}

const SignalModal: React.FC<SignalModalProps> = ({
  isOpen,
  onClose,
  signal,
  onExecuteTrade,
  existingPositions = [],
  isViewingOnly = false,
}) => {
  const [portfolioBalance, setPortfolioBalance] = useState(8000);
  const [customRiskPercent, setCustomRiskPercent] = useState([2]);
  const { toast } = useToast();

  if (!signal) return null;

  const hasExistingPosition = existingPositions.includes(signal.symbol);
  const maxRiskPercent = customRiskPercent[0];
  const maxRiskAmount = (portfolioBalance * maxRiskPercent) / 100;
  const entryPrice = signal.price;
  const stopLoss = entryPrice * 0.95; // 5% stop loss
  const takeProfit = entryPrice * 1.15; // 15% take profit
  const riskPerShare = entryPrice - stopLoss;
  const maxShares = Math.floor(maxRiskAmount / riskPerShare);
  const investmentAmount = maxShares * entryPrice;
  const isRiskTooHigh = maxRiskPercent > 2;

  const handleExecuteTrade = () => {
    // REMOVED: Blocking logic for existing positions - now allows adding to position

    if (isRiskTooHigh) {
      toast({
        title: "Warning: Risk exceeds 2% of portfolio",
        description: `Consider reducing position size to stay within risk limits.`,
        variant: "destructive",
      });
      // Allow trade to continue but with warning
    }

    const tradeData = {
      symbol: signal.symbol,
      name: signal.name,
      entryPrice: entryPrice,
      shares: maxShares,
      stopLoss: stopLoss,
      takeProfit: takeProfit,
      investmentAmount: investmentAmount,
      signalScore: signal.signalScore,
      isAddingToPosition: hasExistingPosition, // Flag to indicate if this is adding to existing position
    };

    onExecuteTrade(tradeData);

    // ENHANCED: Different success messages based on action type
    const actionText = hasExistingPosition
      ? "Position Extended!"
      : "Trade Started!";
    const descriptionText = hasExistingPosition
      ? `Added ${maxShares} shares to your existing ${signal.symbol} position.`
      : `Tracking ${signal.symbol} under Open Positions.`;

    toast({
      title: actionText,
      description: descriptionText,
    });

    onClose();
  };

  const handleCancel = () => {
    // Only show cancel toast if not in viewing mode
    if (!isViewingOnly) {
      toast({
        title: "Trade cancelled",
        description: "No data saved.",
      });
    }
    onClose();
  };

  const getTechnicalSummary = (score: number) => {
    if (score >= 90)
      return [
        "RSI shows strong momentum",
        "MACD indicates bullish trend",
        "Volume above average",
        "Price breaking resistance",
      ];
    if (score >= 80)
      return [
        "RSI in favorable zone",
        "MACD trending positive",
        "Good volume support",
      ];
    return [
      "RSI showing potential",
      "Mixed technical signals",
      "Moderate volume",
    ];
  };

  const recommendedShares = Math.floor(
    (portfolioBalance * 2) / 100 / riskPerShare
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4 border-b border-slate-700 flex-shrink-0">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-6 w-6 text-emerald-400" />
              <div>
                <span className="text-xl font-bold">{signal.symbol}</span>
                <p className="text-slate-400 text-sm font-normal">
                  {signal.name}
                </p>
              </div>
            </div>
            <Badge className="bg-emerald-600 text-white">
              Score: {signal.signalScore}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 scrollbar-thin scrollbar-track-slate-700 scrollbar-thumb-slate-500 hover:scrollbar-thumb-slate-400">
          {/* ENHANCED: Position Enhancement Notice (instead of warning) */}
          {hasExistingPosition && (
            <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <Plus className="h-5 w-5 text-blue-400" />
                <div>
                  <p className="text-blue-200 text-sm font-semibold">
                    Adding to Existing Position
                  </p>
                  <p className="text-blue-300 text-xs mt-1">
                    You can scale into this position using dollar-cost averaging
                    strategy.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Price Information */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-700/50 p-4 rounded-lg">
              <p className="text-slate-400 text-sm">Entry Price</p>
              <p className="text-white font-bold text-lg">
                ${entryPrice.toFixed(2)}
              </p>
            </div>
            <div className="bg-slate-700/50 p-4 rounded-lg">
              <p className="text-slate-400 text-sm">Stop Loss</p>
              <p className="text-red-400 font-bold text-lg">
                ${stopLoss.toFixed(2)}
              </p>
            </div>
            <div className="bg-slate-700/50 p-4 rounded-lg">
              <p className="text-slate-400 text-sm">Take Profit</p>
              <p className="text-emerald-400 font-bold text-lg">
                ${takeProfit.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Portfolio Balance */}
          {!isViewingOnly && (
            <div>
              <label className="text-slate-300 text-sm font-medium mb-2 block">
                Portfolio Balance
              </label>
              <Input
                type="number"
                value={portfolioBalance}
                onChange={(e) => setPortfolioBalance(Number(e.target.value))}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="Enter portfolio balance"
              />
            </div>
          )}

          {/* Custom Risk Slider */}
          {!isViewingOnly && (
            <div>
              <label className="text-slate-300 text-sm font-medium mb-2 block">
                Risk Percentage: {maxRiskPercent}%
              </label>
              <Slider
                value={customRiskPercent}
                onValueChange={setCustomRiskPercent}
                max={10}
                min={0.5}
                step={0.5}
                className="w-full"
              />

              {/* Risk Warning */}
              {isRiskTooHigh && (
                <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-lg mt-3">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5" />
                    <div>
                      <p className="text-red-200 text-sm font-semibold">
                        🔴 WARNING: This position risks more than 2% of your
                        capital
                      </p>
                      <p className="text-red-300 text-xs mt-1">
                        Recommended: {recommendedShares} shares | Your
                        selection: {maxShares} shares ({maxRiskPercent}% risk)
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Position Sizing */}
          {!isViewingOnly && (
            <div className="bg-slate-700/30 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <Calculator className="h-5 w-5 text-blue-400" />
                <h3 className="text-lg font-semibold">
                  {hasExistingPosition
                    ? "Additional Position Size"
                    : "Position Sizing"}
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-400">Max Risk ({maxRiskPercent}%)</p>
                  <p className="text-white font-semibold">
                    ${maxRiskAmount.toFixed(0)}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400">
                    {hasExistingPosition
                      ? "Additional Shares"
                      : "Shares to Buy"}
                  </p>
                  <p className="text-white font-semibold">{maxShares} shares</p>
                </div>
                <div>
                  <p className="text-slate-400">
                    {hasExistingPosition
                      ? "Additional Investment"
                      : "Investment Amount"}
                  </p>
                  <p className="text-white font-semibold">
                    ${investmentAmount.toFixed(0)}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400">Risk per Share</p>
                  <p className="text-white font-semibold">
                    ${riskPerShare.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="mt-3 text-xs text-slate-400">
                ${maxRiskAmount.toFixed(0)} ÷ ${riskPerShare.toFixed(2)} ={" "}
                {maxShares} shares
              </div>
            </div>
          )}

          {/* Technical Summary */}
          <div className="bg-slate-700/30 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">Technical Summary</h3>
            <ul className="space-y-2">
              {getTechnicalSummary(signal.signalScore).map((item, index) => (
                <li key={index} className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <span className="text-slate-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Disclaimer */}
          <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-amber-400" />
              <p className="text-amber-200 text-sm">
                This is a simulated paper trade. No real capital is involved.
              </p>
            </div>
          </div>
        </div>

        {/* ENHANCED: Action Buttons with Smart Text */}
        <div className="p-6 pt-4 border-t border-slate-700 flex-shrink-0">
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex-1 bg-slate-600 border-slate-500 text-white hover:bg-slate-500 hover:border-slate-400 transition-all duration-200"
            >
              {isViewingOnly ? "Close" : "Cancel"}
            </Button>
            {!isViewingOnly && (
              <Button
                onClick={handleExecuteTrade}
                className={`flex-1 text-white ${
                  hasExistingPosition
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-emerald-600 hover:bg-emerald-700"
                }`}
              >
                {hasExistingPosition ? (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Add to Position
                  </>
                ) : (
                  <>
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Execute Paper Trade
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SignalModal;
