
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ReferenceDot } from 'recharts';
import { TrendingUp, Calendar, Target, DollarSign } from 'lucide-react';

const demoData = [
  { time: '9:00', price: 150.25, date: 'Dec 18' },
  { time: '10:00', price: 149.80, date: 'Dec 18' },
  { time: '11:00', price: 148.95, date: 'Dec 18' },
  { time: '12:00', price: 149.15, date: 'Dec 18' }, // Entry point
  { time: '13:00', price: 150.30, date: 'Dec 18' },
  { time: '14:00', price: 151.20, date: 'Dec 18' },
  { time: '15:00', price: 152.45, date: 'Dec 18' },
  { time: '16:00', price: 153.10, date: 'Dec 18' },
  { time: '9:00', price: 153.85, date: 'Dec 19' },
  { time: '10:00', price: 154.60, date: 'Dec 19' },
  { time: '11:00', price: 155.25, date: 'Dec 19' },
  { time: '12:00', price: 156.15, date: 'Dec 19' }, // Exit point
  { time: '13:00', price: 155.90, date: 'Dec 19' },
  { time: '14:00', price: 155.40, date: 'Dec 19' },
];

const DemoSignalChart: React.FC = () => {
  const entryPrice = 149.15;
  const exitPrice = 156.15;
  const profitPercent = ((exitPrice - entryPrice) / entryPrice * 100).toFixed(1);

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm border border-blue-800/30 rounded-lg p-6">
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-2">
          <TrendingUp className="h-5 w-5 text-emerald-400" />
          <h3 className="text-xl font-semibold text-white">AAPL - Apple Inc.</h3>
          <span className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded text-sm font-medium">
            WINNING SIGNAL
          </span>
        </div>
        <p className="text-slate-400 text-sm">AI-Generated Long Signal • December 18-19, 2024</p>
      </div>

      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={demoData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="time" 
              stroke="#9CA3AF"
              fontSize={12}
            />
            <YAxis 
              stroke="#9CA3AF"
              fontSize={12}
              domain={['dataMin - 1', 'dataMax + 1']}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '6px',
                color: '#fff'
              }}
              formatter={(value) => [`$${value}`, 'Price']}
              labelFormatter={(label, payload) => {
                if (payload && payload[0]) {
                  return `${payload[0].payload.date} ${label}`;
                }
                return label;
              }}
            />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="#3B82F6" 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#3B82F6' }}
            />
            
            {/* Entry point */}
            <ReferenceDot 
              x="12:00" 
              y={entryPrice}
              r={6} 
              fill="#10B981" 
              stroke="#fff"
              strokeWidth={2}
            />
            
            {/* Exit point */}
            <ReferenceDot 
              x="12:00" 
              y={exitPrice}
              r={6} 
              fill="#EF4444" 
              stroke="#fff"
              strokeWidth={2}
            />
            
            {/* Entry line */}
            <ReferenceLine 
              y={entryPrice} 
              stroke="#10B981" 
              strokeDasharray="5 5"
              strokeOpacity={0.7}
            />
            
            {/* Exit line */}
            <ReferenceLine 
              y={exitPrice} 
              stroke="#EF4444" 
              strokeDasharray="5 5"
              strokeOpacity={0.7}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800/50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
            <span className="text-slate-300 text-sm">Entry Point</span>
          </div>
          <div className="text-white font-semibold">${entryPrice}</div>
          <div className="text-slate-400 text-xs">Dec 18, 12:00 PM</div>
        </div>

        <div className="bg-slate-800/50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-slate-300 text-sm">Exit Point</span>
          </div>
          <div className="text-white font-semibold">${exitPrice}</div>
          <div className="text-slate-400 text-xs">Dec 19, 12:00 PM</div>
        </div>

        <div className="bg-emerald-500/10 rounded-lg p-4 border border-emerald-500/20">
          <div className="flex items-center space-x-2 mb-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-300 text-sm">Profit</span>
          </div>
          <div className="text-emerald-400 font-bold text-lg">+{profitPercent}%</div>
          <div className="text-emerald-300 text-xs">in 2 days</div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <p className="text-blue-300 text-sm">
          <span className="font-medium">This signal made +{profitPercent}% in 2 days</span> - 
          Our AI identified a bullish reversal pattern with high probability success indicators.
        </p>
      </div>
    </div>
  );
};

export default DemoSignalChart;
