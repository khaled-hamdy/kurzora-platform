
import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Plus, TrendingUp, TrendingDown, Download, Search, Filter, Info } from 'lucide-react';
import CreateSignalModal from '../../components/admin/CreateSignalModal';
import SignalAuditModal from '../../components/admin/SignalAuditModal';
import { useToast } from '../../hooks/use-toast';

const AdminSignals: React.FC = () => {
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedSignalId, setSelectedSignalId] = useState<string | null>(null);
  const { toast } = useToast();

  const signals = [
    {
      id: '1',
      symbol: 'EUR/USD',
      type: 'Long',
      status: 'active',
      entryPrice: '1.0950',
      currentPrice: '1.0975',
      pnl: '+2.3%',
      createdAt: '2024-06-10 14:30',
      createdBy: 'admin@kurzora.com',
      lastModified: '2024-06-10 15:45',
      lastModifiedBy: 'admin@kurzora.com',
      isShariahCompliant: true,
      notes: 'Strong bullish momentum expected'
    },
    {
      id: '2',
      symbol: 'GBP/JPY',
      type: 'Short',
      status: 'closed',
      entryPrice: '189.45',
      currentPrice: '188.20',
      pnl: '+0.65%',
      createdAt: '2024-06-10 12:15',
      createdBy: 'analyst@kurzora.com',
      lastModified: '2024-06-10 16:20',
      lastModifiedBy: 'admin@kurzora.com',
      isShariahCompliant: false,
      notes: 'Technical analysis indicates downtrend'
    },
    {
      id: '3',
      symbol: 'USD/CHF',
      type: 'Long',
      status: 'pending',
      entryPrice: '0.8920',
      currentPrice: '0.8915',
      pnl: '-0.05%',
      createdAt: '2024-06-10 16:45',
      createdBy: 'admin@kurzora.com',
      lastModified: null,
      lastModifiedBy: null,
      isShariahCompliant: true,
      notes: 'Waiting for market confirmation'
    }
  ];

  const handleExportCSV = () => {
    const csvData = signals.map(signal => ({
      Symbol: signal.symbol,
      Type: signal.type,
      Status: signal.status,
      'Entry Price': signal.entryPrice,
      'Current Price': signal.currentPrice,
      'P&L': signal.pnl,
      'Created At': signal.createdAt,
      'Created By': signal.createdBy,
      'Shariah Compliant': signal.isShariahCompliant ? 'Yes' : 'No'
    }));

    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'signals-export.csv';
    a.click();
    
    toast({
      title: "Export Complete",
      description: "Signals data has been exported to CSV.",
    });
  };

  const handleCloseSignal = (signalId: string) => {
    toast({
      title: "Signal Closed",
      description: "Signal has been successfully closed.",
    });
  };

  const filteredSignals = signals.filter(signal => {
    const matchesSearch = signal.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         signal.createdBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || signal.status === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Signal Management</h1>
            <p className="text-slate-400">Create and manage trading signals</p>
          </div>
          <div className="flex space-x-3">
            <Button onClick={handleExportCSV} variant="outline" className="border-slate-600 text-slate-300">
              <Download className="h-4 w-4 mr-2" />
              Export Signals CSV
            </Button>
            <Button onClick={() => setShowCreateModal(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Signal
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-slate-300">Active Signals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">24</div>
              <p className="text-xs text-green-400">+3 from yesterday</p>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-slate-300">Success Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">84.2%</div>
              <p className="text-xs text-green-400">+2.1% this week</p>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-slate-300">Total P&L</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">+12.8%</div>
              <p className="text-xs text-green-400">+0.5% today</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-white">Recent Signals</CardTitle>
              <div className="flex space-x-3">
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search symbol or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64 bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-48 bg-slate-700 border-slate-600 text-white">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="all">All Signals</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-slate-300 font-medium">Symbol</th>
                    <th className="text-left py-3 px-4 text-slate-300 font-medium">Type</th>
                    <th className="text-left py-3 px-4 text-slate-300 font-medium">Status</th>
                    <th className="text-left py-3 px-4 text-slate-300 font-medium">Entry Price</th>
                    <th className="text-left py-3 px-4 text-slate-300 font-medium">Current Price</th>
                    <th className="text-left py-3 px-4 text-slate-300 font-medium">
                      <div className="flex items-center space-x-1">
                        <span>P&L</span>
                        <span 
                          className="cursor-help" 
                          title="Live P&L based on current market price vs entry price"
                        >
                          <Info className="h-3 w-3 text-slate-400" />
                        </span>
                      </div>
                    </th>
                    <th className="text-left py-3 px-4 text-slate-300 font-medium">Created</th>
                    <th className="text-left py-3 px-4 text-slate-300 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSignals.map((signal) => (
                    <tr key={signal.id} className="border-b border-slate-700/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-medium">{signal.symbol}</span>
                          {signal.isShariahCompliant && (
                            <Badge variant="outline" className="text-green-400 border-green-400 text-xs">
                              Halal
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          {signal.type === 'Long' ? (
                            <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-400 mr-1" />
                          )}
                          <span className="text-slate-300">{signal.type}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge 
                          variant={
                            signal.status === 'active' ? 'default' : 
                            signal.status === 'closed' ? 'secondary' : 'outline'
                          }
                        >
                          {signal.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-slate-300">{signal.entryPrice}</td>
                      <td className="py-3 px-4 text-slate-300">{signal.currentPrice}</td>
                      <td className="py-3 px-4">
                        <span className={signal.pnl.startsWith('+') ? 'text-green-400' : 'text-red-400'}>
                          {signal.pnl}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-300 text-sm">{signal.createdAt}</td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-slate-600 text-slate-300"
                            onClick={() => setSelectedSignalId(signal.id)}
                          >
                            Audit
                          </Button>
                          <Button variant="outline" size="sm" className="border-slate-600 text-slate-300">
                            Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-red-600 text-red-400"
                            onClick={() => handleCloseSignal(signal.id)}
                          >
                            Close
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <CreateSignalModal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
      />
      
      <SignalAuditModal 
        isOpen={!!selectedSignalId} 
        onClose={() => setSelectedSignalId(null)}
        signal={signals.find(s => s.id === selectedSignalId) || null}
      />
    </AdminLayout>
  );
};

export default AdminSignals;
