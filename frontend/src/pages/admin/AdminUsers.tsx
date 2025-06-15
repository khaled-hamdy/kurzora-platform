
import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { UserPlus, Search, Filter, Download } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

const AdminUsers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const { toast } = useToast();

  const users = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user',
      status: 'active',
      subscription: 'Pro Trader',
      joinDate: '2024-01-15'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'analyst',
      status: 'active',
      subscription: 'Basic',
      joinDate: '2024-02-20'
    },
    {
      id: '3',
      name: 'Admin User',
      email: 'admin@kurzora.com',
      role: 'admin',
      status: 'active',
      subscription: 'Admin',
      joinDate: '2024-01-01'
    },
    {
      id: '4',
      name: 'Support Agent',
      email: 'support@kurzora.com',
      role: 'support',
      status: 'active',
      subscription: 'Support',
      joinDate: '2024-01-10'
    }
  ];

  const handleExportCSV = () => {
    const csvData = users.map(user => ({
      Name: user.name,
      Email: user.email,
      Role: user.role,
      Status: user.status,
      Subscription: user.subscription,
      'Join Date': user.joinDate
    }));

    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users-export.csv';
    a.click();
    
    toast({
      title: "Export Complete",
      description: "Users data has been exported to CSV.",
    });
  };

  const handleRoleChange = (userId: string, newRole: string) => {
    toast({
      title: "Role Updated",
      description: `User role has been changed to ${newRole}.`,
    });
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'analyst': return 'default';
      case 'support': return 'outline';
      default: return 'secondary';
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
            <p className="text-slate-400">Manage user accounts and permissions</p>
          </div>
          <div className="flex space-x-3">
            <Button onClick={handleExportCSV} variant="outline" className="border-slate-600 text-slate-300">
              <Download className="h-4 w-4 mr-2" />
              Export Users CSV
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
        </div>

        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-white">All Users</CardTitle>
              <div className="flex space-x-3">
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64 bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <Select value={filterRole} onValueChange={setFilterRole}>
                  <SelectTrigger className="w-48 bg-slate-700 border-slate-600 text-white">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="analyst">Analyst</SelectItem>
                    <SelectItem value="support">Support</SelectItem>
                    <SelectItem value="user">User</SelectItem>
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
                    <th className="text-left py-3 px-4 text-slate-300 font-medium">User</th>
                    <th className="text-left py-3 px-4 text-slate-300 font-medium">Role</th>
                    <th className="text-left py-3 px-4 text-slate-300 font-medium">Status</th>
                    <th className="text-left py-3 px-4 text-slate-300 font-medium">Subscription</th>
                    <th className="text-left py-3 px-4 text-slate-300 font-medium">Join Date</th>
                    <th className="text-left py-3 px-4 text-slate-300 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-slate-700/50">
                      <td className="py-3 px-4">
                        <div>
                          <div className="text-white font-medium">{user.name}</div>
                          <div className="text-slate-400 text-sm">{user.email}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Select
                          value={user.role}
                          onValueChange={(value) => handleRoleChange(user.id, value)}
                        >
                          <SelectTrigger className="w-32 bg-transparent border-none p-0 h-auto">
                            <Badge variant={getRoleBadgeVariant(user.role)} className="cursor-pointer">
                              {user.role}
                            </Badge>
                          </SelectTrigger>
                          <SelectContent className="bg-slate-700 border-slate-600">
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="analyst">Analyst</SelectItem>
                            <SelectItem value="support">Support</SelectItem>
                            <SelectItem value="user">User</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className="text-green-400 border-green-400">
                          {user.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-slate-300">{user.subscription}</td>
                      <td className="py-3 px-4 text-slate-300">{user.joinDate}</td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" className="border-slate-600 text-slate-300">
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" className="border-red-600 text-red-400">
                            Delete
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
    </AdminLayout>
  );
};

export default AdminUsers;
