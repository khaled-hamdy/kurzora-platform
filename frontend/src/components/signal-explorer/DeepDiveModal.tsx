import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  X,
  TrendingUp,
  BarChart3,
  Activity,
  Clock,
  Target,
  AlertCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useToast } from "../../hooks/use-toast";
import ChartIntegration from "./ChartIntegration";
import TechnicalBreakdown from "./TechnicalBreakdown";

// Signal interface matching existing SignalModal patterns
interface DeepDiveSignal {
  symbol: string;
  name: string;
  price: number;
  change: number;
  signalScore: number;
  entryPrice?: number;
  stopLoss?: number;
  takeProfit?: number;
  riskRewardRatio?: number;
  atr?: number;
  sector?: string;
  signals?: {
    "1H": number;
    "4H": number;
    "1D": number;
    "1W": number;
  };
}

interface DeepDiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  signal: DeepDiveSignal | null;
  onExecuteTrade?: () => void; // Optional link to trade execution
}

// Professional timeframe analysis component
const TimeframeAnalysis: React.FC<{
  signals?: { "1H": number; "4H": number; "1D": number; "1W": number };
}> = ({ signals }) => {
  if (!signals) return null;

  const timeframes = [
    { key: "1H", label: "1 Hour", score: signals["1H"] },
    { key: "4H", label: "4 Hours", score: signals["4H"] },
    { key: "1D", label: "1 Day", score: signals["1D"] },
    { key: "1W", label: "1 Week", score: signals["1W"] },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 70) return "bg-yellow-500";
    if (score >= 60) return "bg-orange-500";
    return "bg-red-500";
  };

  const getScoreText = (score: number) => {
    if (score >= 80) return "Strong";
    if (score >= 70) return "Moderate";
    if (score >= 60) return "Weak";
    return "Caution";
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white flex items-center">
        <Clock className="h-5 w-5 mr-2 text-blue-400" />
        Multi-Timeframe Analysis
      </h3>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {timeframes.map((tf) => (
          <div
            key={tf.key}
            className="bg-slate-700/50 p-3 rounded-lg border border-slate-600"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-300 text-sm font-medium">
                {tf.label}
              </span>
              <Badge
                className={`${getScoreColor(tf.score)} text-white text-xs`}
              >
                {tf.score}
              </Badge>
            </div>
            <div className="text-xs text-slate-400">
              {getScoreText(tf.score)}
            </div>
            <div className="w-full bg-slate-600 rounded-full h-1.5 mt-2">
              <div
                className={`h-1.5 rounded-full ${getScoreColor(tf.score)}`}
                style={{ width: `${tf.score}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Signal strength indicator component
const SignalStrengthIndicator: React.FC<{ score: number; title: string }> = ({
  score,
  title,
}) => {
  const getStrengthLevel = (score: number) => {
    if (score >= 90)
      return {
        label: "Exceptional",
        color: "text-emerald-400",
        bg: "bg-emerald-500",
      };
    if (score >= 80)
      return {
        label: "Strong",
        color: "text-emerald-400",
        bg: "bg-emerald-500",
      };
    if (score >= 70)
      return {
        label: "Moderate",
        color: "text-yellow-400",
        bg: "bg-yellow-500",
      };
    if (score >= 60)
      return { label: "Weak", color: "text-orange-400", bg: "bg-orange-500" };
    return { label: "Caution", color: "text-red-400", bg: "bg-red-500" };
  };

  const strength = getStrengthLevel(score);

  return (
    <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-semibold">{title}</h3>
        <Badge className={`${strength.bg} text-white`}>{score}/100</Badge>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-slate-300 text-sm">Signal Strength</span>
          <span className={`text-sm font-medium ${strength.color}`}>
            {strength.label}
          </span>
        </div>

        <div className="w-full bg-slate-600 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${strength.bg}`}
            style={{ width: `${score}%` }}
          ></div>
        </div>

        <div className="text-xs text-slate-400">
          {score >= 80
            ? "High probability setup with strong confirmation"
            : score >= 70
            ? "Moderate setup with acceptable risk-reward"
            : score >= 60
            ? "Weak setup requiring careful consideration"
            : "High risk setup - proceed with caution"}
        </div>
      </div>
    </div>
  );
};

// Price levels analysis component
const PriceLevelsAnalysis: React.FC<{ signal: DeepDiveSignal }> = ({
  signal,
}) => {
  const currentPrice = signal.price;
  const entryPrice = signal.entryPrice || currentPrice;
  const stopLoss = signal.stopLoss;
  const takeProfit = signal.takeProfit;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white flex items-center">
        <Target className="h-5 w-5 mr-2 text-emerald-400" />
        Price Level Analysis
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-700/50 p-4 rounded-lg border border-blue-500/30">
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-300 text-sm">Current Price</span>
            <span className="text-white font-bold">
              ${currentPrice.toFixed(2)}
            </span>
          </div>
          <div className="text-xs text-slate-400">Market Price</div>
        </div>

        {entryPrice && (
          <div className="bg-slate-700/50 p-4 rounded-lg border border-emerald-500/30">
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-300 text-sm">Entry Price</span>
              <span className="text-emerald-400 font-bold">
                ${entryPrice.toFixed(2)}
              </span>
            </div>
            <div className="text-xs text-slate-400">
              {(((entryPrice - currentPrice) / currentPrice) * 100).toFixed(1)}%
              from current
            </div>
          </div>
        )}

        {stopLoss && (
          <div className="bg-slate-700/50 p-4 rounded-lg border border-red-500/30">
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-300 text-sm">Stop Loss</span>
              <span className="text-red-400 font-bold">
                ${stopLoss.toFixed(2)}
              </span>
            </div>
            <div className="text-xs text-slate-400">
              {(((stopLoss - currentPrice) / currentPrice) * 100).toFixed(1)}%
              risk
            </div>
          </div>
        )}
      </div>

      {takeProfit && signal.riskRewardRatio && (
        <div className="bg-slate-700/30 p-3 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-slate-300 text-sm">Take Profit Target</span>
            <div className="text-right">
              <div className="text-emerald-400 font-bold">
                ${takeProfit.toFixed(2)}
              </div>
              <div className="text-xs text-emerald-300">
                {signal.riskRewardRatio.toFixed(1)}:1 R/R
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DeepDiveModal: React.FC<DeepDiveModalProps> = ({
  isOpen,
  onClose,
  signal,
  onExecuteTrade,
}) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Reset tab when modal opens with new signal
  useEffect(() => {
    if (isOpen && signal) {
      setActiveTab("overview");
    }
  }, [isOpen, signal?.symbol]);

  if (!signal) return null;

  const handleExecuteTrade = () => {
    if (onExecuteTrade) {
      onClose(); // Close analysis modal
      onExecuteTrade(); // Open trade execution modal
    } else {
      toast({
        title: "Trade Execution",
        description: "Trade execution functionality not available",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-6xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4 border-b border-slate-700 flex-shrink-0">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BarChart3 className="h-6 w-6 text-blue-400" />
              <div>
                <span className="text-xl font-bold">{signal.symbol}</span>
                <p className="text-slate-400 text-sm font-normal">
                  {signal.name}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-blue-600 text-white">Deep Analysis</Badge>
              <Badge className="bg-emerald-600 text-white">
                Score: {signal.signalScore}
              </Badge>
              {signal.sector && (
                <Badge
                  variant="outline"
                  className="border-slate-500 text-slate-300"
                >
                  {signal.sector}
                </Badge>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="h-full flex flex-col"
          >
            <TabsList className="grid w-full grid-cols-4 bg-slate-900 m-4 mb-0">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-slate-700"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="chart"
                className="data-[state=active]:bg-slate-700"
              >
                Chart Analysis
              </TabsTrigger>
              <TabsTrigger
                value="technical"
                className="data-[state=active]:bg-slate-700"
              >
                Technical Details
              </TabsTrigger>
              <TabsTrigger
                value="advanced"
                className="data-[state=active]:bg-slate-700"
              >
                Advanced Analysis
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-thin scrollbar-track-slate-700 scrollbar-thumb-slate-500 hover:scrollbar-thumb-slate-400">
              <TabsContent value="overview" className="space-y-6 mt-0">
                <SignalStrengthIndicator
                  score={signal.signalScore}
                  title="Overall Signal Strength"
                />

                <PriceLevelsAnalysis signal={signal} />

                <TimeframeAnalysis signals={signal.signals} />

                {/* Quick actions for overview tab */}
                <div className="bg-slate-700/20 p-4 rounded-lg border border-slate-600">
                  <h3 className="text-white font-semibold mb-3">
                    Quick Actions
                  </h3>
                  <div className="flex space-x-3">
                    <Button
                      onClick={() => setActiveTab("chart")}
                      variant="outline"
                      className="border-slate-500 text-slate-300 hover:bg-slate-600"
                    >
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View Chart
                    </Button>
                    <Button
                      onClick={() => setActiveTab("technical")}
                      variant="outline"
                      className="border-slate-500 text-slate-300 hover:bg-slate-600"
                    >
                      <Activity className="h-4 w-4 mr-2" />
                      Technical Analysis
                    </Button>
                    {onExecuteTrade && (
                      <Button
                        onClick={handleExecuteTrade}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Execute Trade
                      </Button>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="chart" className="mt-0">
                <ChartIntegration
                  symbol={signal.symbol}
                  currentPrice={signal.price}
                  entryPrice={signal.entryPrice}
                  stopLoss={signal.stopLoss}
                  takeProfit={signal.takeProfit}
                />
              </TabsContent>

              <TabsContent value="technical" className="mt-0">
                <TechnicalBreakdown
                  signal={signal}
                  signalScore={signal.signalScore}
                />
              </TabsContent>

              <TabsContent value="advanced" className="space-y-6 mt-0">
                <div className="bg-slate-700/30 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2 text-yellow-400" />
                    Advanced Analysis Features
                  </h3>
                  <div className="space-y-4 text-slate-300">
                    <div className="p-3 bg-slate-800/50 rounded border border-slate-600">
                      <h4 className="font-medium text-white mb-2">
                        AI-Powered Insights
                      </h4>
                      <p className="text-sm">
                        Advanced machine learning models analyze market
                        patterns, sentiment, and institutional flow to provide
                        deeper signal validation.
                      </p>
                    </div>
                    <div className="p-3 bg-slate-800/50 rounded border border-slate-600">
                      <h4 className="font-medium text-white mb-2">
                        Correlation Analysis
                      </h4>
                      <p className="text-sm">
                        Cross-market correlation studies help identify
                        supporting or conflicting signals across different asset
                        classes and timeframes.
                      </p>
                    </div>
                    <div className="p-3 bg-slate-800/50 rounded border border-slate-600">
                      <h4 className="font-medium text-white mb-2">
                        Risk Assessment Matrix
                      </h4>
                      <p className="text-sm">
                        Multi-dimensional risk evaluation considering
                        volatility, liquidity, market conditions, and portfolio
                        impact analysis.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        <div className="p-6 pt-4 border-t border-slate-700 flex-shrink-0">
          <div className="flex justify-between items-center">
            <div className="text-sm text-slate-400">
              Signal generated: {new Date().toLocaleString()}
            </div>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="bg-slate-600 border-slate-500 text-white hover:bg-slate-500"
              >
                Close Analysis
              </Button>
              {onExecuteTrade && (
                <Button
                  onClick={handleExecuteTrade}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Execute Trade
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeepDiveModal;
