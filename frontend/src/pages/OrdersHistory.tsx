
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { ArrowLeft, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';

interface ClosedTrade {
  id: string;
  symbol: string;
  name: string;
  entryPrice: number;
  exitPrice: number;
  shares: number;
  pnl: number;
  pnlPercent: number;
  score: number;
  closedDate: string;
  reasonForClosing: string;
}

const OrdersHistory: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mock data for closed trades with updated structure
  const [closedTrades] = useState<ClosedTrade[]>([
    {
      id: '1',
      symbol: 'AAPL',
      name: 'Apple Inc.',
      entryPrice: 160.02,
      exitPrice: 172.45,
      shares: 50,
      pnl: 621.50,
      pnlPercent: 7.8,
      score: 88,
      closedDate: '2025-06-08',
      reasonForClosing: 'Target Hit'
    },
    {
      id: '2',
      symbol: 'NVDA',
      name: 'NVIDIA Corp.',
      entryPrice: 750.12,
      exitPrice: 745.30,
      shares: 20,
      pnl: -96.40,
      pnlPercent: -0.6,
      score: 92,
      closedDate: '2025-06-07',
      reasonForClosing: 'Manual Exit'
    },
    {
      id: '3',
      symbol: 'MSFT',
      name: 'Microsoft Corp.',
      entryPrice: 412.45,
      exitPrice: 425.80,
      shares: 30,
      pnl: 400.50,
      pnlPercent: 3.2,
      score: 85,
      closedDate: '2025-06-06',
      reasonForClosing: 'Target Hit'
    },
    {
      id: '4',
      symbol: 'TSLA',
      name: 'Tesla Inc.',
      entryPrice: 225.50,
      exitPrice: 218.90,
      shares: 40,
      pnl: -264.00,
      pnlPercent: -2.9,
      score: 78,
      closedDate: '2025-06-05',
      reasonForClosing: 'Stop Loss'
    },
    {
      id: '5',
      symbol: 'META',
      name: 'Meta Platforms Inc.',
      entryPrice: 320.54,
      exitPrice: 342.15,
      shares: 25,
      pnl: 540.25,
      pnlPercent: 6.7,
      score: 89,
      closedDate: '2025-06-04',
      reasonForClosing: 'Target Hit'
    }
  ]);

  if (!user) {
    navigate('/');
    return null;
  }

  const totalPnL = closedTrades.reduce((sum, trade) => sum + trade.pnl, 0);
  const winningTrades = closedTrades.filter(trade => trade.pnl > 0).length;
  const winRate = (winningTrades / closedTrades.length) * 100;

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const getReasonBadgeColor = (reason: string) => {
    switch (reason) {
      case 'Target Hit': return 'bg-emerald-600';
      case 'Stop Loss': return 'bg-red-600';
      case 'Manual Exit': return 'bg-blue-600';
      case 'Reversal': return 'bg-orange-600';
      default: return 'bg-gray-600';
    }
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 90) return 'bg-emerald-600';
    if (score >= 80) return 'bg-blue-600';
    if (score >= 70) return 'bg-amber-600';
    return 'bg-red-600';
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Button 
                onClick={handleBackToDashboard}
                variant="outline"
                className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600 hover:text-white hover:border-slate-500 transition-all duration-200"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-3xl font-bold text-white">Orders History</h1>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-blue-400" />
                  <div>
                    <p className="text-slate-400 text-sm">Total Trades</p>
                    <p className="text-white font-bold text-xl">{closedTrades.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  {totalPnL >= 0 ? (
                    <TrendingUp className="h-5 w-5 text-emerald-400" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-400" />
                  )}
                  <div>
                    <p className="text-slate-400 text-sm">Total P&L</p>
                    <p className={`font-bold text-xl ${totalPnL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-amber-400" />
                  <div>
                    <p className="text-slate-400 text-sm">Win Rate</p>
                    <p className="text-amber-400 font-bold text-xl">{winRate.toFixed(1)}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Trading History Table */}
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-blue-400" />
              <span>📘 Learn from Past Trades</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700">
                  <TableHead className="text-slate-300">Symbol</TableHead>
                  <TableHead className="text-slate-300">Entry Price</TableHead>
                  <TableHead className="text-slate-300">Exit Price</TableHead>
                  <TableHead className="text-slate-300">Shares</TableHead>
                  <TableHead className="text-slate-300">% Gain/Loss</TableHead>
                  <TableHead className="text-slate-300">Score</TableHead>
                  <TableHead className="text-slate-300">Final P&L</TableHead>
                  <TableHead className="text-slate-300">Reason</TableHead>
                  <TableHead className="text-slate-300">Closed Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {closedTrades.map((trade) => (
                  <TableRow key={trade.id} className="border-slate-700 hover:bg-slate-700/30">
                    <TableCell>
                      <div>
                        <div className="text-white font-semibold">{trade.symbol}</div>
                        <div className="text-slate-400 text-sm">{trade.name}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-white">${trade.entryPrice.toFixed(2)}</TableCell>
                    <TableCell className="text-white">${trade.exitPrice.toFixed(2)}</TableCell>
                    <TableCell className="text-white">{trade.shares}</TableCell>
                    <TableCell>
                      <span className={`font-semibold ${trade.pnlPercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {trade.pnlPercent >= 0 ? '+' : ''}{trade.pnlPercent.toFixed(1)}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getScoreBadgeColor(trade.score)} text-white`}>
                        {trade.score}/100
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className={`font-semibold ${trade.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(0)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className={getReasonBadgeColor(trade.reasonForClosing)}>
                        {trade.reasonForClosing}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-400">{trade.closedDate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <div className="text-xs text-gray-500 text-center mt-4">
          *These are simulated paper trading results. No real capital was involved.
        </div>
      </div>
    </Layout>
  );
};

export default OrdersHistory;
