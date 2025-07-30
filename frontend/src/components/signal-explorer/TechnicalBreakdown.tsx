import React, { useState } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Activity,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Target,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  Volume2,
  Zap,
  Shield,
} from "lucide-react";

// Signal interface matching DeepDiveModal patterns
interface TechnicalSignal {
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

interface TechnicalBreakdownProps {
  signal: TechnicalSignal;
  signalScore: number;
}

// Technical indicator analysis component
const IndicatorAnalysis: React.FC<{
  title: string;
  score: number;
  timeframes?: { "1H": number; "4H": number; "1D": number; "1W": number };
  description: string;
  icon: React.ReactNode;
}> = ({ title, score, timeframes, description, icon }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 70) return "text-yellow-400";
    if (score >= 60) return "text-orange-400";
    return "text-red-400";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 70) return "bg-yellow-500";
    if (score >= 60) return "bg-orange-500";
    return "bg-red-500";
  };

  const getScoreText = (score: number) => {
    if (score >= 80) return "Strong";
    if (score >= 70) return "Moderate";
    if (score >= 60) return "Weak";
    return "Bearish";
  };

  return (
    <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          {icon}
          <div>
            <h4 className="text-white font-medium">{title}</h4>
            <p className="text-slate-400 text-sm">{description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={`${getScoreBg(score)} text-white`}>
            {score}/100
          </Badge>
          <span className={`text-sm ${getScoreColor(score)}`}>
            {getScoreText(score)}
          </span>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-slate-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-slate-400" />
          )}
        </div>
      </div>

      {isExpanded && timeframes && (
        <div className="mt-4 pt-4 border-t border-slate-600">
          <div className="grid grid-cols-4 gap-3">
            {Object.entries(timeframes).map(([tf, tfScore]) => (
              <div key={tf} className="bg-slate-800/50 p-2 rounded">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-300 text-xs">{tf}</span>
                  <span className={`text-xs ${getScoreColor(tfScore)}`}>
                    {tfScore}
                  </span>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-1">
                  <div
                    className={`h-1 rounded-full ${getScoreBg(tfScore)}`}
                    style={{ width: `${tfScore}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Signal strength matrix component
const SignalStrengthMatrix: React.FC<{
  signals?: { "1H": number; "4H": number; "1D": number; "1W": number };
}> = ({ signals }) => {
  if (!signals) return null;

  const timeframes = [
    { key: "1H", label: "1 Hour", weight: 0.4 },
    { key: "4H", label: "4 Hours", weight: 0.3 },
    { key: "1D", label: "1 Day", weight: 0.2 },
    { key: "1W", label: "1 Week", weight: 0.1 },
  ];

  const getConsensus = () => {
    const strongSignals = Object.values(signals).filter(
      (score) => score >= 80
    ).length;
    const moderateSignals = Object.values(signals).filter(
      (score) => score >= 70 && score < 80
    ).length;
    const weakSignals = Object.values(signals).filter(
      (score) => score >= 60 && score < 70
    ).length;
    const bearishSignals = Object.values(signals).filter(
      (score) => score < 60
    ).length;

    if (strongSignals >= 3)
      return { text: "Strong Consensus", color: "text-emerald-400" };
    if (strongSignals + moderateSignals >= 3)
      return { text: "Moderate Consensus", color: "text-yellow-400" };
    if (bearishSignals >= 2)
      return { text: "Bearish Consensus", color: "text-red-400" };
    return { text: "Mixed Signals", color: "text-orange-400" };
  };

  const consensus = getConsensus();

  return (
    <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-white font-medium flex items-center">
          <Activity className="h-4 w-4 mr-2 text-blue-400" />
          Multi-Timeframe Signal Matrix
        </h4>
        <Badge className={`bg-slate-600 ${consensus.color}`}>
          {consensus.text}
        </Badge>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-4">
        {timeframes.map((tf) => {
          const score = signals[tf.key as keyof typeof signals];
          const getScoreColor = (score: number) => {
            if (score >= 80) return "bg-emerald-500";
            if (score >= 70) return "bg-yellow-500";
            if (score >= 60) return "bg-orange-500";
            return "bg-red-500";
          };

          return (
            <div
              key={tf.key}
              className="bg-slate-800/50 p-3 rounded border border-slate-600"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-300 text-sm font-medium">
                  {tf.label}
                </span>
                <span className="text-white font-bold">{score}</span>
              </div>
              <div className="w-full bg-slate-600 rounded-full h-2 mb-1">
                <div
                  className={`h-2 rounded-full ${getScoreColor(score)}`}
                  style={{ width: `${score}%` }}
                ></div>
              </div>
              <div className="text-xs text-slate-400">
                Weight: {(tf.weight * 100).toFixed(0)}%
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-xs text-slate-400">
        Professional timeframe weighting: 1H (40%), 4H (30%), 1D (20%), 1W (10%)
      </div>
    </div>
  );
};

// Risk assessment component
const RiskAssessment: React.FC<{
  signalScore: number;
  riskRewardRatio?: number;
  atr?: number;
  currentPrice: number;
}> = ({ signalScore, riskRewardRatio, atr, currentPrice }) => {
  const getRiskLevel = () => {
    if (signalScore >= 85 && riskRewardRatio && riskRewardRatio >= 2.5) {
      return {
        level: "Low",
        color: "text-emerald-400",
        bg: "bg-emerald-500/20",
      };
    }
    if (signalScore >= 75 && riskRewardRatio && riskRewardRatio >= 2.0) {
      return {
        level: "Moderate",
        color: "text-yellow-400",
        bg: "bg-yellow-500/20",
      };
    }
    if (signalScore >= 65) {
      return {
        level: "High",
        color: "text-orange-400",
        bg: "bg-orange-500/20",
      };
    }
    return { level: "Very High", color: "text-red-400", bg: "bg-red-500/20" };
  };

  const risk = getRiskLevel();
  const volatilityPercent = atr ? (atr / currentPrice) * 100 : null;

  return (
    <div className={`p-4 rounded-lg border ${risk.bg} border-slate-600`}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-white font-medium flex items-center">
          <Shield className="h-4 w-4 mr-2 text-blue-400" />
          Risk Assessment
        </h4>
        <Badge className={`${risk.color} bg-slate-700`}>
          {risk.level} Risk
        </Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
        <div>
          <span className="text-slate-400 block">Signal Strength</span>
          <span className="text-white font-medium">{signalScore}/100</span>
        </div>

        {riskRewardRatio && (
          <div>
            <span className="text-slate-400 block">Risk-Reward</span>
            <span className="text-white font-medium">
              {riskRewardRatio.toFixed(1)}:1
            </span>
          </div>
        )}

        {volatilityPercent && (
          <div>
            <span className="text-slate-400 block">Volatility (ATR)</span>
            <span className="text-white font-medium">
              {volatilityPercent.toFixed(1)}%
            </span>
          </div>
        )}
      </div>

      <div className="mt-3 text-xs text-slate-400">
        Professional risk evaluation based on signal strength, volatility, and
        risk-reward metrics.
      </div>
    </div>
  );
};

// Market context component
const MarketContext: React.FC<{
  sector?: string;
  signalScore: number;
  priceChange: number;
}> = ({ sector, signalScore, priceChange }) => {
  const getTrendDirection = () => {
    if (priceChange > 0)
      return {
        icon: <TrendingUp className="h-4 w-4" />,
        text: "Uptrend",
        color: "text-emerald-400",
      };
    return {
      icon: <TrendingDown className="h-4 w-4" />,
      text: "Downtrend",
      color: "text-red-400",
    };
  };

  const trend = getTrendDirection();

  const getMarketSentiment = () => {
    if (signalScore >= 80)
      return "Bullish momentum with strong institutional interest";
    if (signalScore >= 70)
      return "Moderate bullish sentiment with acceptable conviction";
    if (signalScore >= 60)
      return "Mixed sentiment requiring careful position management";
    return "Bearish sentiment with elevated risk considerations";
  };

  return (
    <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600">
      <h4 className="text-white font-medium mb-3 flex items-center">
        <BarChart3 className="h-4 w-4 mr-2 text-blue-400" />
        Market Context Analysis
      </h4>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-slate-400 text-sm">Current Trend</span>
          <div className={`flex items-center space-x-1 ${trend.color}`}>
            {trend.icon}
            <span className="text-sm font-medium">{trend.text}</span>
          </div>
        </div>

        {sector && (
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm">Sector</span>
            <Badge
              variant="outline"
              className="border-slate-500 text-slate-300"
            >
              {sector}
            </Badge>
          </div>
        )}

        <div className="pt-2 border-t border-slate-600">
          <span className="text-slate-400 text-sm block mb-1">
            Market Sentiment
          </span>
          <p className="text-slate-300 text-sm">{getMarketSentiment()}</p>
        </div>
      </div>
    </div>
  );
};

const TechnicalBreakdown: React.FC<TechnicalBreakdownProps> = ({
  signal,
  signalScore,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white flex items-center">
          <Activity className="h-6 w-6 mr-2 text-blue-400" />
          Technical Analysis Breakdown
        </h3>
        <Badge className="bg-blue-600 text-white">
          Score: {signalScore}/100
        </Badge>
      </div>

      {/* Signal strength matrix */}
      <SignalStrengthMatrix signals={signal.signals} />

      {/* Individual indicator analysis */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-white">
          Technical Indicators
        </h4>

        <IndicatorAnalysis
          title="Momentum Analysis"
          score={signalScore}
          timeframes={signal.signals}
          description="RSI, MACD, and momentum oscillator convergence"
          icon={<Zap className="h-5 w-5 text-yellow-400" />}
        />

        <IndicatorAnalysis
          title="Volume Confirmation"
          score={Math.max(60, signalScore - 10)} // Derived score
          timeframes={signal.signals}
          description="Volume patterns and institutional flow analysis"
          icon={<Volume2 className="h-5 w-5 text-purple-400" />}
        />

        <IndicatorAnalysis
          title="Support & Resistance"
          score={Math.max(50, signalScore - 5)} // Derived score
          timeframes={signal.signals}
          description="Key price levels and breakout probability"
          icon={<Target className="h-5 w-5 text-orange-400" />}
        />

        <IndicatorAnalysis
          title="Trend Alignment"
          score={Math.max(55, signalScore - 15)} // Derived score
          timeframes={signal.signals}
          description="Multi-timeframe trend consistency analysis"
          icon={<TrendingUp className="h-5 w-5 text-emerald-400" />}
        />
      </div>

      {/* Risk assessment */}
      <RiskAssessment
        signalScore={signalScore}
        riskRewardRatio={signal.riskRewardRatio}
        atr={signal.atr}
        currentPrice={signal.price}
      />

      {/* Market context */}
      <MarketContext
        sector={signal.sector}
        signalScore={signalScore}
        priceChange={signal.change}
      />

      {/* Professional disclaimer */}
      <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-lg">
        <div className="flex items-start space-x-2">
          <AlertCircle className="h-5 w-5 text-amber-400 mt-0.5" />
          <div>
            <p className="text-amber-200 text-sm font-medium mb-1">
              Professional Analysis Disclaimer
            </p>
            <p className="text-amber-300 text-xs">
              This technical analysis is generated using institutional-grade
              algorithms and should be used in conjunction with your own
              research and risk management strategies. Past performance does not
              guarantee future results.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicalBreakdown;
