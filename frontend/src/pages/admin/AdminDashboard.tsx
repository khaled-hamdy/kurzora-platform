
import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { Search, Filter, Users, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [activityFilter, setActivityFilter] = useState('all');
  const [activitySearch, setActivitySearch] = useState('');

  const recentActivity = [
    {
      id: '1',
      type: 'user',
      description: 'New user registration: john@example.com',
      timestamp: '2024-06-10 16:45',
      icon: Users,
      color: 'text-blue-400'
    },
    {
      id: '2',
      type: 'signal',
      description: 'Signal created for EUR/USD by admin@kurzora.com',
      timestamp: '2024-06-10 16:30',
      icon: TrendingUp,
      color: 'text-green-400'
    },
    {
      id: '3',
      type: 'system',
      description: 'System backup completed successfully',
      timestamp: '2024-06-10 16:00',
      icon: CheckCircle,
      color: 'text-emerald-400'
    },
    {
      id: '4',
      type: 'user',
      description: 'Password reset requested: jane@example.com',
      timestamp: '2024-06-10 15:45',
      icon: Users,
      color: 'text-yellow-400'
    },
    {
      id: '5',
      type: 'signal',
      description: 'Signal closed for AAPL - profit target reached',
      timestamp: '2024-06-10 15:30',
      icon: TrendingUp,
      color: 'text-green-400'
    },
    {
      id: '6',
      type: 'system',
      description: 'Failed login attempt detected from suspicious IP',
      timestamp: '2024-06-10 15:15',
      icon: AlertTriangle,
      color: 'text-red-400'
    }
  ];

  const filteredActivity = recentActivity.filter(activity => {
    const matchesFilter = activityFilter === 'all' || activity.type === activityFilter.replace(' events', '');
    const matchesSearch = activity.description.toLowerCase().includes(activitySearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-slate-400">System overview and recent activity</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">1,247</div>
              <p className="text-xs text-green-400">+12% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Active Signals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">42</div>
              <p className="text-xs text-blue-400">+3 today</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Pending Issues</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">7</div>
              <p className="text-xs text-orange-400">Requires attention</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">System Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">98.9%</div>
              <p className="text-xs text-green-400">All systems operational</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-white">Recent Activity</CardTitle>
              <div className="flex space-x-3">
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search by email or symbol..."
                    value={activitySearch}
                    onChange={(e) => setActivitySearch(e.target.value)}
                    className="w-64 bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <Select value={activityFilter} onValueChange={setActivityFilter}>
                  <SelectTrigger className="w-48 bg-slate-700 border-slate-600 text-white">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="user events">User Events</SelectItem>
                    <SelectItem value="signal events">Signal Events</SelectItem>
                    <SelectItem value="system events">System Events</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredActivity.map((activity) => {
                const IconComponent = activity.icon;
                return (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 bg-slate-700/30 rounded-lg">
                    <IconComponent className={`h-5 w-5 mt-0.5 ${activity.color}`} />
                    <div className="flex-1">
                      <p className="text-white text-sm">{activity.description}</p>
                      <p className="text-slate-400 text-xs mt-1">{activity.timestamp}</p>
                    </div>
                    <Badge variant="outline" className={`text-xs ${activity.color.replace('text-', 'border-')}`}>
                      {activity.type}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
