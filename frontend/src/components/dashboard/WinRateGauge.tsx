
import React, { useState, useEffect } from 'react';
import { TrendingUp, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface WinRateGaugeProps {
  winRate: number;
  totalTrades: number;
  winningTrades: number;
}

const WinRateGauge: React.FC<WinRateGaugeProps> = ({ winRate, totalTrades, winningTrades }) => {
  const [animatedWinRate, setAnimatedWinRate] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedWinRate(winRate);
    }, 500);
    return () => clearTimeout(timer);
  }, [winRate]);

  const circumference = 2 * Math.PI * 45;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (animatedWinRate / 100) * circumference;

  const getGaugeColor = (rate: number) => {
    if (rate >= 80) return 'text-emerald-400';
    if (rate >= 70) return 'text-yellow-400';
    if (rate >= 60) return 'text-orange-400';
    return 'text-red-400';
  };

  const getGaugeStroke = (rate: number) => {
    if (rate >= 80) return 'stroke-emerald-400';
    if (rate >= 70) return 'stroke-yellow-400';
    if (rate >= 60) return 'stroke-orange-400';
    return 'stroke-red-400';
  };

  return (
    <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:bg-slate-800/70 transition-all duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-white flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-emerald-400" />
          <span>Win Rate</span>
          {winRate >= 60 && (
            <Award className="h-5 w-5 text-orange-400" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center">
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="rgb(71 85 105)"
                strokeWidth="8"
                fill="none"
                className="opacity-20"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className={`transition-all duration-2000 ease-out ${getGaugeStroke(animatedWinRate)}`}
                style={{
                  transitionProperty: 'stroke-dashoffset',
                  transitionDuration: '2s'
                }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className={`text-2xl font-bold ${getGaugeColor(winRate)}`}>
                  {Math.round(animatedWinRate)}%
                </div>
                {winRate >= 60 && (
                  <div className="text-xs text-orange-400 font-medium">
                    ≥60% Target
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Winning Trades</span>
            <span className="text-white font-medium">{winningTrades}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Total Trades</span>
            <span className="text-white font-medium">{totalTrades}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Losing Trades</span>
            <span className="text-white font-medium">{totalTrades - winningTrades}</span>
          </div>
        </div>

        {winRate >= 60 && (
          <div className="mt-4 p-3 bg-orange-900/20 border border-orange-700/50 rounded-lg">
            <div className="flex items-center space-x-2 text-orange-300 text-sm">
              <Award className="h-4 w-4" />
              <span className="font-medium">Target Performance</span>
            </div>
            <p className="text-orange-400/80 text-xs mt-1">
              You've reached the target performance level. Keep monitoring signals!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WinRateGauge;
