
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { TrendingUp, TrendingDown, Volume } from 'lucide-react';

interface ChartProps {
  symbol: string;
  timeframe: string;
  signalScore: number;
}

const RealisticSignalChart: React.FC<ChartProps> = ({ symbol, timeframe, signalScore }) => {
  // Mock price data for realistic chart
  const generateMockData = () => {
    const basePrice = 155.88;
    const data = [];
    const volatility = 0.02;
    
    for (let i = 0; i < 50; i++) {
      const variation = (Math.random() - 0.5) * volatility;
      const price = basePrice * (1 + variation + (i * 0.001));
      data.push({
        time: i,
        price: price,
        volume: Math.random() * 1000000 + 500000
      });
    }
    return data;
  };

  const data = generateMockData();
  const maxPrice = Math.max(...data.map(d => d.price));
  const minPrice = Math.min(...data.map(d => d.price));
  const priceRange = maxPrice - minPrice;
  const maxVolume = Math.max(...data.map(d => d.volume));

  // Signal trigger point (around 70% through the chart)
  const signalIndex = Math.floor(data.length * 0.7);

  return (
    <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg text-white flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-emerald-400" />
            <span>{symbol} - {timeframe} Chart</span>
          </CardTitle>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span className="text-slate-300">Signal Entry</span>
            </div>
            <div className="text-emerald-400 font-semibold">Score: {signalScore}/100</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Main Price Chart */}
          <div className="bg-slate-900/50 rounded-lg p-4 h-80 relative overflow-hidden">
            {/* Grid Background */}
            <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
              <defs>
                <pattern id="grid" width="40" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 30" fill="none" stroke="#334155" strokeWidth="0.5" opacity="0.3"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {/* Price Line Chart */}
            <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 2 }}>
              <defs>
                <linearGradient id="priceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.3"/>
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.05"/>
                </linearGradient>
              </defs>
              
              {/* Price Area */}
              <path
                d={`M 0 ${320 - ((data[0].price - minPrice) / priceRange) * 240} 
                   ${data.map((point, index) => 
                     `L ${(index / (data.length - 1)) * 800} ${320 - ((point.price - minPrice) / priceRange) * 240}`
                   ).join(' ')} 
                   L 800 320 L 0 320 Z`}
                fill="url(#priceGradient)"
              />
              
              {/* Price Line */}
              <path
                d={`M 0 ${320 - ((data[0].price - minPrice) / priceRange) * 240} 
                   ${data.map((point, index) => 
                     `L ${(index / (data.length - 1)) * 800} ${320 - ((point.price - minPrice) / priceRange) * 240}`
                   ).join(' ')}`}
                stroke="#10b981"
                strokeWidth="2"
                fill="none"
              />

              {/* Signal Entry Point */}
              <circle
                cx={(signalIndex / (data.length - 1)) * 800}
                cy={320 - ((data[signalIndex].price - minPrice) / priceRange) * 240}
                r="6"
                fill="#f59e0b"
                stroke="#fbbf24"
                strokeWidth="2"
              />

              {/* Signal Entry Line */}
              <line
                x1={(signalIndex / (data.length - 1)) * 800}
                y1="0"
                x2={(signalIndex / (data.length - 1)) * 800}
                y2="320"
                stroke="#f59e0b"
                strokeWidth="1"
                strokeDasharray="4,4"
                opacity="0.6"
              />

              {/* Support Line */}
              <line
                x1="0"
                y1={320 - ((minPrice * 1.01 - minPrice) / priceRange) * 240}
                x2="800"
                y2={320 - ((minPrice * 1.01 - minPrice) / priceRange) * 240}
                stroke="#ef4444"
                strokeWidth="1"
                strokeDasharray="2,2"
                opacity="0.7"
              />

              {/* Resistance Line */}
              <line
                x1="0"
                y1={320 - ((maxPrice * 0.99 - minPrice) / priceRange) * 240}
                x2="800"
                y2={320 - ((maxPrice * 0.99 - minPrice) / priceRange) * 240}
                stroke="#3b82f6"
                strokeWidth="1"
                strokeDasharray="2,2"
                opacity="0.7"
              />
            </svg>

            {/* Price Labels */}
            <div className="absolute left-2 top-2 text-xs text-slate-400">
              ${maxPrice.toFixed(2)}
            </div>
            <div className="absolute left-2 bottom-2 text-xs text-slate-400">
              ${minPrice.toFixed(2)}
            </div>

            {/* Signal Entry Label */}
            <div 
              className="absolute bg-amber-500 text-black text-xs px-2 py-1 rounded transform -translate-x-1/2"
              style={{ 
                left: `${(signalIndex / (data.length - 1)) * 100}%`,
                top: `${100 - ((data[signalIndex].price - minPrice) / priceRange) * 75}%`
              }}
            >
              Entry: ${data[signalIndex].price.toFixed(2)}
            </div>
          </div>

          {/* Volume Chart */}
          <div className="bg-slate-900/30 rounded-lg p-4 h-20 mt-4 relative">
            <div className="flex items-end justify-between h-full">
              {data.map((point, index) => (
                <div
                  key={index}
                  className={`bg-blue-500 opacity-60 ${index === signalIndex ? 'bg-amber-500 opacity-100' : ''}`}
                  style={{
                    height: `${(point.volume / maxVolume) * 100}%`,
                    width: `${800 / data.length - 1}px`,
                  }}
                />
              ))}
            </div>
            <div className="absolute bottom-1 left-2 text-xs text-slate-400 flex items-center">
              <Volume className="h-3 w-3 mr-1" />
              Volume
            </div>
          </div>

          {/* Legend */}
          <div className="flex justify-between items-center mt-4 text-xs">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-0.5 bg-emerald-500"></div>
                <span className="text-slate-300">Price</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-0.5 bg-red-500 opacity-70"></div>
                <span className="text-slate-300">Support</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-0.5 bg-blue-500 opacity-70"></div>
                <span className="text-slate-300">Resistance</span>
              </div>
            </div>
            <div className="text-slate-400">
              Last Updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RealisticSignalChart;
