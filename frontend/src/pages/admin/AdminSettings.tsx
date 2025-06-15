
import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
import { Save, Database, Mail, Shield } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

const AdminSettings: React.FC = () => {
  const [autoCloseEnabled, setAutoCloseEnabled] = useState(false);
  const [autoCloseDays, setAutoCloseDays] = useState(3);
  const { toast } = useToast();

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "System settings have been updated successfully.",
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">System Settings</h1>
          <p className="text-slate-400">Configure platform settings and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Database className="h-5 w-5 mr-2 text-blue-400" />
                System Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-slate-300">Platform Name</Label>
                <Input 
                  defaultValue="Kurzora Trading Platform"
                  className="bg-slate-700 border-slate-600 text-white mt-1"
                />
              </div>
              <div>
                <Label className="text-slate-300">Maximum Users</Label>
                <Input 
                  defaultValue="10000"
                  type="number"
                  className="bg-slate-700 border-slate-600 text-white mt-1"
                />
              </div>
              <div>
                <Label className="text-slate-300">Signal Refresh Rate (seconds)</Label>
                <Input 
                  defaultValue="30"
                  type="number"
                  className="bg-slate-700 border-slate-600 text-white mt-1"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Mail className="h-5 w-5 mr-2 text-green-400" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-slate-300">Email Notifications</Label>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-slate-300">SMS Alerts</Label>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-slate-300">Push Notifications</Label>
                <Switch defaultChecked />
              </div>
              <div>
                <Label className="text-slate-300">Admin Email</Label>
                <Input 
                  defaultValue="admin@kurzora.com"
                  type="email"
                  className="bg-slate-700 border-slate-600 text-white mt-1"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Shield className="h-5 w-5 mr-2 text-red-400" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-slate-300">Two-Factor Authentication</Label>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-slate-300">Login Attempts Limit</Label>
                <Input 
                  defaultValue="5"
                  type="number"
                  className="bg-slate-700 border-slate-600 text-white w-20"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-slate-300">Session Timeout (minutes)</Label>
                <Input 
                  defaultValue="60"
                  type="number"
                  className="bg-slate-700 border-slate-600 text-white w-20"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-slate-300">Auto-logout on inactivity</Label>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Trading Parameters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-slate-300">Default Risk Level (%)</Label>
                <Input 
                  defaultValue="2"
                  type="number"
                  step="0.1"
                  className="bg-slate-700 border-slate-600 text-white mt-1"
                />
              </div>
              <div>
                <Label className="text-slate-300">Max Signals Per Day</Label>
                <Input 
                  defaultValue="10"
                  type="number"
                  className="bg-slate-700 border-slate-600 text-white mt-1"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-slate-300">Auto-close Signals</Label>
                <Switch 
                  checked={autoCloseEnabled}
                  onCheckedChange={setAutoCloseEnabled}
                />
              </div>
              {autoCloseEnabled && (
                <div>
                  <Label className="text-slate-300">Auto-close after X days</Label>
                  <Input 
                    value={autoCloseDays}
                    onChange={(e) => setAutoCloseDays(Number(e.target.value))}
                    type="number"
                    min="1"
                    max="30"
                    className="bg-slate-700 border-slate-600 text-white mt-1"
                  />
                  <p className="text-slate-400 text-xs mt-1">
                    Signals will automatically close after {autoCloseDays} days
                  </p>
                </div>
              )}
              <div className="flex items-center justify-between">
                <Label className="text-slate-300">Demo Mode Available</Label>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSaveSettings} className="bg-blue-600 hover:bg-blue-700">
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
