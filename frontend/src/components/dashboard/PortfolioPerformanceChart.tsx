
import React, { useState } from 'react';
import { TrendingUp, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../ui/chart';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Button } from '../ui/button';

const PortfolioPerformanceChart: React.FC = () => {
  const [timeframe, setTimeframe] = useState('3M');

  // Mock data for different timeframes
  const chartData = {
    '1M': [
      { date: 'Week 1', portfolio: 100, benchmark: 100 },
      { date: 'Week 2', portfolio: 103.2, benchmark: 101.5 },
      { date: 'Week 3', portfolio: 107.8, benchmark: 102.1 },
      { date: 'Week 4', portfolio: 112.4, benchmark: 103.8 },
    ],
    '3M': [
      { date: 'Jan', portfolio: 100, benchmark: 100 },
      { date: 'Feb', portfolio: 108.5, benchmark: 103.2 },
      { date: 'Mar', portfolio: 125.7, benchmark: 107.8 },
      { date: 'Apr', portfolio: 142.3, benchmark: 111.5 },
      { date: 'May', portfolio: 158.9, benchmark: 115.2 },
      { date: 'Jun', portfolio: 187.3, benchmark: 118.9 },
    ],
    '1Y': [
      { date: 'Q1', portfolio: 100, benchmark: 100 },
      { date: 'Q2', portfolio: 125.7, benchmark: 108.5 },
      { date: 'Q3', portfolio: 158.9, benchmark: 115.2 },
      { date: 'Q4', portfolio: 187.3, benchmark: 118.9 },
    ],
  };

  const currentData = chartData[timeframe as keyof typeof chartData];
  const latestData = currentData[currentData.length - 1];
  const initialData = currentData[0];
  const portfolioGrowth = ((latestData.portfolio - initialData.portfolio) / initialData.portfolio) * 100;

  const chartConfig = {
    portfolio: {
      label: "Portfolio",
      color: "rgb(16 185 129)", // emerald-500
    },
    benchmark: {
      label: "S&P 500",
      color: "rgb(59 130 246)", // blue-500
    },
  };

  return (
    <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:bg-slate-800/70 transition-all duration-300">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-white flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-emerald-400" />
            <span>Portfolio Performance</span>
          </CardTitle>
          <div className="flex space-x-1">
            {['1M', '3M', '1Y'].map((period) => (
              <Button
                key={period}
                variant={timeframe === period ? "default" : "ghost"}
                size="sm"
                onClick={() => setTimeframe(period)}
                className={`text-xs h-7 px-2 ${
                  timeframe === period 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                {period}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="text-2xl font-bold text-emerald-400">
            +{portfolioGrowth.toFixed(1)}%
          </div>
          <p className="text-xs text-slate-400">
            vs S&P 500: +{((latestData.benchmark - initialData.benchmark) / initialData.benchmark * 100).toFixed(1)}%
          </p>
        </div>

        <ChartContainer config={chartConfig} className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={currentData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: 'rgb(148 163 184)' }}
              />
              <YAxis 
                hide
                domain={['dataMin - 5', 'dataMax + 5']}
              />
              <ChartTooltip 
                content={<ChartTooltipContent />}
                cursor={{ stroke: 'rgb(71 85 105)', strokeWidth: 1 }}
              />
              <Line
                type="monotone"
                dataKey="portfolio"
                stroke="var(--color-portfolio)"
                strokeWidth={2}
                dot={{ fill: "var(--color-portfolio)", strokeWidth: 0, r: 3 }}
                activeDot={{ r: 4, fill: "var(--color-portfolio)" }}
              />
              <Line
                type="monotone"
                dataKey="benchmark"
                stroke="var(--color-benchmark)"
                strokeWidth={2}
                strokeDasharray="3 3"
                dot={{ fill: "var(--color-benchmark)", strokeWidth: 0, r: 3 }}
                activeDot={{ r: 4, fill: "var(--color-benchmark)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>

        <div className="mt-4 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-0.5 bg-emerald-400 rounded"></div>
              <span className="text-slate-400">Portfolio</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-0.5 bg-blue-400 rounded border-dashed"></div>
              <span className="text-slate-400">S&P 500</span>
            </div>
          </div>
          <div className="text-slate-400 flex items-center space-x-1">
            <Calendar className="h-3 w-3" />
            <span>{timeframe}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PortfolioPerformanceChart;
