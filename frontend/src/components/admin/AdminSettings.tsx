import React, { useState, useEffect } from "react";
// CORRECT: Using the same import path as your working components
import { supabase } from "@/lib/supabase";
import {
  Settings,
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Key,
  Bell,
  Shield,
  TrendingUp,
  Globe,
  Server,
  Mail,
  MessageSquare,
  Clock,
  Zap,
  Lock,
  Database,
  Activity,
  BarChart3,
  DollarSign,
  Target,
  Sliders,
} from "lucide-react";

interface PlatformSettings {
  // Trading Parameters
  default_risk_percentage: number;
  confidence_threshold: number;
  max_signals_per_day: number;
  signal_expiry_hours: number;

  // Platform Configuration
  platform_status: "operational" | "maintenance" | "limited";
  maintenance_message: string;
  allow_new_signups: boolean;
  require_email_verification: boolean;

  // Notification Settings
  telegram_notifications_enabled: boolean;
  email_notifications_enabled: boolean;
  notification_frequency: "immediate" | "hourly" | "daily";

  // API Settings
  polygon_api_enabled: boolean;
  openai_api_enabled: boolean;
  make_webhooks_enabled: boolean;

  // Security Settings
  session_timeout_minutes: number;
  max_login_attempts: number;
  require_2fa_for_admin: boolean;
}

interface SystemStats {
  database_status: "healthy" | "warning" | "error";
  api_response_time: number;
  active_sessions: number;
  storage_usage_mb: number;
  last_backup: string;
  uptime_percentage: number;
}

const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<PlatformSettings | null>(null);
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showApiKeys, setShowApiKeys] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "platform" | "trading" | "notifications" | "security" | "system"
  >("platform");

  useEffect(() => {
    fetchSettingsData();
  }, []);

  const fetchSettingsData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate fetching platform settings (you can store these in Supabase later)
      const defaultSettings: PlatformSettings = {
        // Trading Parameters
        default_risk_percentage: 2.0,
        confidence_threshold: 80,
        max_signals_per_day: 50,
        signal_expiry_hours: 24,

        // Platform Configuration
        platform_status: "operational",
        maintenance_message: "",
        allow_new_signups: true,
        require_email_verification: true,

        // Notification Settings
        telegram_notifications_enabled: true,
        email_notifications_enabled: true,
        notification_frequency: "immediate",

        // API Settings
        polygon_api_enabled: true,
        openai_api_enabled: true,
        make_webhooks_enabled: false,

        // Security Settings
        session_timeout_minutes: 60,
        max_login_attempts: 5,
        require_2fa_for_admin: false,
      };

      // Simulate system stats
      const mockSystemStats: SystemStats = {
        database_status: "healthy",
        api_response_time: 145,
        active_sessions: 3,
        storage_usage_mb: 256,
        last_backup: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        uptime_percentage: 99.9,
      };

      setSettings(defaultSettings);
      setSystemStats(mockSystemStats);
    } catch (err) {
      console.error("Settings fetch error:", err);
      setError(err instanceof Error ? err.message : "Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!settings) return;

    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);

      // Simulate saving settings (implement Supabase storage later)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccessMessage("Settings saved successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error("Settings save error:", err);
      setError(err instanceof Error ? err.message : "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key: keyof PlatformSettings, value: any) => {
    if (!settings) return;
    setSettings({ ...settings, [key]: value });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
      case "healthy":
        return "text-green-400";
      case "warning":
      case "limited":
        return "text-yellow-400";
      case "error":
      case "maintenance":
        return "text-red-400";
      default:
        return "text-slate-400";
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      operational: "bg-green-900/50 text-green-400 border-green-500/50",
      maintenance: "bg-red-900/50 text-red-400 border-red-500/50",
      limited: "bg-yellow-900/50 text-yellow-400 border-yellow-500/50",
      healthy: "bg-green-900/50 text-green-400 border-green-500/50",
      warning: "bg-yellow-900/50 text-yellow-400 border-yellow-500/50",
      error: "bg-red-900/50 text-red-400 border-red-500/50",
    };
    return (
      colors[status as keyof typeof colors] ||
      "bg-slate-900/50 text-slate-400 border-slate-500/50"
    );
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor(
      (now.getTime() - time.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Less than 1 hour ago";
    if (diffInHours === 1) return "1 hour ago";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  const tabs = [
    { id: "platform", label: "Platform", icon: Globe },
    { id: "trading", label: "Trading", icon: TrendingUp },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "system", label: "System", icon: Server },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">
            System Settings
          </h1>
          <p className="text-slate-400">Loading configuration...</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-slate-800 rounded-lg p-6 border border-slate-700 animate-pulse"
            >
              <div className="h-4 bg-slate-700 rounded mb-4"></div>
              <div className="h-8 bg-slate-700 rounded mb-2"></div>
              <div className="h-3 bg-slate-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">
            System Settings
          </h1>
          <p className="text-slate-400">Error loading configuration</p>
        </div>

        <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-6">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <h3 className="text-lg font-semibold text-red-400">Error</h3>
          </div>
          <p className="text-red-300 mt-2">{error}</p>
          <button
            onClick={fetchSettingsData}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!settings || !systemStats) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">
            System Settings
          </h1>
          <p className="text-slate-400">
            Configure platform settings and features
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchSettingsData}
            className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleSaveSettings}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="bg-green-900/20 border border-green-500/50 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <p className="text-green-300">{successMessage}</p>
          </div>
        </div>
      )}

      {/* System Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Platform Status */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">
              Platform Status
            </h3>
            <Activity className="h-6 w-6 text-green-400" />
          </div>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(
              settings.platform_status
            )}`}
          >
            {settings.platform_status}
          </span>
          <p className="text-sm text-slate-400 mt-2">System operational</p>
        </div>

        {/* Database Health */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Database</h3>
            <Database className="h-6 w-6 text-blue-400" />
          </div>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(
              systemStats.database_status
            )}`}
          >
            {systemStats.database_status}
          </span>
          <p className="text-sm text-slate-400 mt-2">
            {systemStats.api_response_time}ms response
          </p>
        </div>

        {/* Active Sessions */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">
              Active Sessions
            </h3>
            <Activity className="h-6 w-6 text-purple-400" />
          </div>
          <p className="text-3xl font-bold text-purple-400">
            {systemStats.active_sessions}
          </p>
          <p className="text-sm text-slate-400 mt-2">Current users</p>
        </div>

        {/* Uptime */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Uptime</h3>
            <BarChart3 className="h-6 w-6 text-yellow-400" />
          </div>
          <p className="text-3xl font-bold text-yellow-400">
            {systemStats.uptime_percentage}%
          </p>
          <p className="text-sm text-slate-400 mt-2">Last 30 days</p>
        </div>
      </div>

      {/* Settings Tabs */}
      <div className="bg-slate-800 rounded-lg border border-slate-700">
        {/* Tab Navigation */}
        <div className="border-b border-slate-700">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-400"
                      : "border-transparent text-slate-400 hover:text-slate-300"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Platform Settings */}
          {activeTab === "platform" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">
                  Platform Configuration
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Platform Status
                    </label>
                    <select
                      value={settings.platform_status}
                      onChange={(e) =>
                        updateSetting("platform_status", e.target.value)
                      }
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="operational">Operational</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="limited">Limited</option>
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={settings.allow_new_signups}
                        onChange={(e) =>
                          updateSetting("allow_new_signups", e.target.checked)
                        }
                        className="rounded bg-slate-700 border-slate-600"
                      />
                      <span className="text-sm text-slate-300">
                        Allow New Signups
                      </span>
                    </label>
                  </div>

                  <div>
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={settings.require_email_verification}
                        onChange={(e) =>
                          updateSetting(
                            "require_email_verification",
                            e.target.checked
                          )
                        }
                        className="rounded bg-slate-700 border-slate-600"
                      />
                      <span className="text-sm text-slate-300">
                        Require Email Verification
                      </span>
                    </label>
                  </div>
                </div>

                {settings.platform_status === "maintenance" && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Maintenance Message
                    </label>
                    <textarea
                      value={settings.maintenance_message}
                      onChange={(e) =>
                        updateSetting("maintenance_message", e.target.value)
                      }
                      placeholder="Enter maintenance message for users..."
                      rows={3}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Trading Settings */}
          {activeTab === "trading" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">
                  Trading Parameters
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Default Risk Percentage (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      max="10"
                      value={settings.default_risk_percentage}
                      onChange={(e) =>
                        updateSetting(
                          "default_risk_percentage",
                          parseFloat(e.target.value)
                        )
                      }
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Confidence Threshold
                    </label>
                    <input
                      type="number"
                      min="50"
                      max="100"
                      value={settings.confidence_threshold}
                      onChange={(e) =>
                        updateSetting(
                          "confidence_threshold",
                          parseInt(e.target.value)
                        )
                      }
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Max Signals Per Day
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={settings.max_signals_per_day}
                      onChange={(e) =>
                        updateSetting(
                          "max_signals_per_day",
                          parseInt(e.target.value)
                        )
                      }
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Signal Expiry (Hours)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="168"
                      value={settings.signal_expiry_hours}
                      onChange={(e) =>
                        updateSetting(
                          "signal_expiry_hours",
                          parseInt(e.target.value)
                        )
                      }
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">
                  Notification Configuration
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">
                        Telegram Notifications
                      </h4>
                      <p className="text-sm text-slate-400">
                        Send trading signals via Telegram
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.telegram_notifications_enabled}
                        onChange={(e) =>
                          updateSetting(
                            "telegram_notifications_enabled",
                            e.target.checked
                          )
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">
                        Email Notifications
                      </h4>
                      <p className="text-sm text-slate-400">
                        Send alerts via email
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.email_notifications_enabled}
                        onChange={(e) =>
                          updateSetting(
                            "email_notifications_enabled",
                            e.target.checked
                          )
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Notification Frequency
                    </label>
                    <select
                      value={settings.notification_frequency}
                      onChange={(e) =>
                        updateSetting("notification_frequency", e.target.value)
                      }
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="immediate">Immediate</option>
                      <option value="hourly">Hourly Digest</option>
                      <option value="daily">Daily Summary</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">
                  Security Configuration
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Session Timeout (Minutes)
                    </label>
                    <input
                      type="number"
                      min="15"
                      max="480"
                      value={settings.session_timeout_minutes}
                      onChange={(e) =>
                        updateSetting(
                          "session_timeout_minutes",
                          parseInt(e.target.value)
                        )
                      }
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Max Login Attempts
                    </label>
                    <input
                      type="number"
                      min="3"
                      max="10"
                      value={settings.max_login_attempts}
                      onChange={(e) =>
                        updateSetting(
                          "max_login_attempts",
                          parseInt(e.target.value)
                        )
                      }
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={settings.require_2fa_for_admin}
                        onChange={(e) =>
                          updateSetting(
                            "require_2fa_for_admin",
                            e.target.checked
                          )
                        }
                        className="rounded bg-slate-700 border-slate-600"
                      />
                      <span className="text-sm text-slate-300">
                        Require 2FA for Admin Access
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* System Information */}
          {activeTab === "system" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">
                  System Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <h4 className="text-white font-medium mb-2">
                      Storage Usage
                    </h4>
                    <p className="text-2xl font-bold text-blue-400">
                      {systemStats.storage_usage_mb} MB
                    </p>
                    <p className="text-sm text-slate-400">Database size</p>
                  </div>

                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <h4 className="text-white font-medium mb-2">Last Backup</h4>
                    <p className="text-sm text-green-400">
                      {formatTimeAgo(systemStats.last_backup)}
                    </p>
                    <p className="text-sm text-slate-400">Automatic backup</p>
                  </div>

                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <h4 className="text-white font-medium mb-2">
                      API Response Time
                    </h4>
                    <p className="text-2xl font-bold text-yellow-400">
                      {systemStats.api_response_time}ms
                    </p>
                    <p className="text-sm text-slate-400">Average response</p>
                  </div>

                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <h4 className="text-white font-medium mb-2">
                      System Version
                    </h4>
                    <p className="text-lg font-semibold text-purple-400">
                      v1.0.0
                    </p>
                    <p className="text-sm text-slate-400">Current version</p>
                  </div>
                </div>
              </div>

              {/* API Status */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-4">
                  API Services Status
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <BarChart3 className="h-5 w-5 text-green-400" />
                      <span className="text-white">Polygon.io API</span>
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(
                        "healthy"
                      )}`}
                    >
                      {settings.polygon_api_enabled ? "Active" : "Disabled"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Zap className="h-5 w-5 text-blue-400" />
                      <span className="text-white">OpenAI API</span>
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(
                        "healthy"
                      )}`}
                    >
                      {settings.openai_api_enabled ? "Active" : "Disabled"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <MessageSquare className="h-5 w-5 text-purple-400" />
                      <span className="text-white">Make.com Webhooks</span>
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(
                        settings.make_webhooks_enabled ? "healthy" : "warning"
                      )}`}
                    >
                      {settings.make_webhooks_enabled ? "Active" : "Disabled"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Status */}
      <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span className="text-slate-300">
                Configuration System Active
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Settings className="h-4 w-4 text-blue-400" />
              <span className="text-slate-300">
                Real-time Settings Management
              </span>
            </div>
          </div>
          <span className="text-slate-400">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
