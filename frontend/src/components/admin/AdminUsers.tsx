import React, { useState, useEffect } from "react";
// CORRECT: Using the same import path as your working components
import { supabase } from "@/lib/supabase";
import {
  Users,
  UserPlus,
  Search,
  Filter,
  MoreHorizontal,
  Mail,
  Calendar,
  Crown,
  Shield,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  DollarSign,
  Target,
  AlertCircle,
  X,
} from "lucide-react";

interface User {
  id: string;
  email: string;
  created_at: string;
  subscription_tier?: "starter" | "professional";
  subscription_status?: "active" | "trialing" | "trial";
  subscription_ends_at?: string;
  stripe_customer_id?: string;
  trial_end_date?: string;
  last_login?: string;
  is_active?: boolean;
  total_trades?: number;
  total_revenue?: number;
}

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  trialUsers: number;
  professionalUsers: number;
  newUsersThisWeek: number;
  totalRevenue: number;
  averageTradesPerUser: number;
}

// Add User Modal Component
interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserAdded: () => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({
  isOpen,
  onClose,
  onUserAdded,
}) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    subscription_tier: "starter",
    subscription_status: "trial",
    trial_end_date: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate default trial end date (7 days from now)
  const getDefaultTrialEndDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toISOString().split("T")[0]; // Format: YYYY-MM-DD
  };

  useEffect(() => {
    if (formData.subscription_status === "trial" && !formData.trial_end_date) {
      setFormData((prev) => ({
        ...prev,
        trial_end_date: getDefaultTrialEndDate(),
      }));
    }
  }, [formData.subscription_status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Create user with Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            subscription_tier: formData.subscription_tier,
            subscription_status: formData.subscription_status,
            trial_end_date:
              formData.subscription_status === "trial"
                ? formData.trial_end_date
                : null,
            created_by_admin: true,
          },
        },
      });

      if (signUpError) throw signUpError;

      // Success
      console.log("User created successfully:", data);
      onUserAdded();
      onClose();

      // Reset form
      setFormData({
        email: "",
        password: "",
        subscription_tier: "starter",
        subscription_status: "trial",
        trial_end_date: "",
      });
    } catch (err) {
      console.error("Add user error:", err);
      setError(err instanceof Error ? err.message : "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-slate-800 rounded-lg border border-slate-700 w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <UserPlus className="h-6 w-6 text-green-400" />
            <h2 className="text-xl font-semibold text-white">Add New User</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-slate-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="pl-10 pr-4 py-2 w-full bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="user@example.com"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Temporary Password
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Minimum 6 characters"
              minLength={6}
            />
          </div>

          {/* Subscription Tier - CORRECTED */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Subscription Tier
            </label>
            <select
              value={formData.subscription_tier}
              onChange={(e) =>
                setFormData({ ...formData, subscription_tier: e.target.value })
              }
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="starter">Starter ($19/month)</option>
              <option value="professional">Professional ($49/month)</option>
            </select>
          </div>

          {/* Subscription Status - SIMPLIFIED */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Account Status
            </label>
            <select
              value={formData.subscription_status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  subscription_status: e.target.value,
                })
              }
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="trial">7-Day Free Trial</option>
              <option value="active">Active Subscription</option>
            </select>
          </div>

          {/* Trial End Date - CONDITIONAL */}
          {formData.subscription_status === "trial" && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Trial End Date
              </label>
              <input
                type="date"
                required
                value={formData.trial_end_date}
                onChange={(e) =>
                  setFormData({ ...formData, trial_end_date: e.target.value })
                }
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                min={new Date().toISOString().split("T")[0]} // Can't set past dates
              />
              <p className="text-xs text-slate-400 mt-1">
                User will automatically lose access after this date unless they
                upgrade
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-3">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              <UserPlus className="h-4 w-4" />
              <span>{loading ? "Creating..." : "Create User"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchUsersData();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchQuery, filterStatus]);

  const fetchUsersData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch users and their trade data in parallel
      const [usersResult, tradesResult] = await Promise.all([
        // 🔧 SESSION #196 FIX: Select subscription fields from database
        // FIXED: Added missing subscription_tier, subscription_status, subscription_ends_at, stripe_customer_id
        supabase
          .from("users")
          .select(
            `
            id, 
            email, 
            created_at,
            subscription_tier,
            subscription_status,
            subscription_ends_at,
            stripe_customer_id
          `
          )
          .order("created_at", { ascending: false }),

        // Get trade counts per user
        supabase.from("paper_trades").select("user_id, id"),
      ]);

      if (usersResult.error) throw usersResult.error;
      if (tradesResult.error) throw tradesResult.error;

      // Process user data with trade counts
      const tradesByUser =
        tradesResult.data?.reduce((acc: any, trade) => {
          acc[trade.user_id] = (acc[trade.user_id] || 0) + 1;
          return acc;
        }, {}) || {};

      // 🔧 SESSION #196 FIX: Use real database values instead of hardcoded email logic
      // REMOVED: Hardcoded email pattern logic that ignored database data
      // NOW: Uses actual database subscription_tier and subscription_status values
      const processedUsers: User[] = (usersResult.data || []).map((user) => {
        // Use real database values with proper fallbacks
        const subscriptionTier = user.subscription_tier || "starter";
        const subscriptionStatus = user.subscription_status || "trial";

        // Calculate revenue based on actual subscription tier
        const monthlyRevenue = subscriptionTier === "professional" ? 49 : 19;

        return {
          ...user,
          subscription_tier: subscriptionTier,
          subscription_status: subscriptionStatus,
          is_active: true,
          total_trades: tradesByUser[user.id] || 0,
          total_revenue: monthlyRevenue,
          last_login: user.created_at, // Placeholder - can be enhanced later
        };
      });

      setUsers(processedUsers);

      // Calculate stats
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const stats: UserStats = {
        totalUsers: processedUsers.length,
        activeUsers: processedUsers.filter((u) => u.is_active).length,
        trialUsers: processedUsers.filter(
          (u) =>
            u.subscription_status === "trial" ||
            u.subscription_status === "trialing"
        ).length,
        professionalUsers: processedUsers.filter(
          (u) => u.subscription_tier === "professional"
        ).length,
        newUsersThisWeek: processedUsers.filter(
          (u) => new Date(u.created_at) >= weekAgo
        ).length,
        totalRevenue: processedUsers.reduce(
          (sum, u) => sum + (u.total_revenue || 0),
          0
        ),
        averageTradesPerUser:
          processedUsers.length > 0
            ? Math.round(
                processedUsers.reduce(
                  (sum, u) => sum + (u.total_trades || 0),
                  0
                ) / processedUsers.length
              )
            : 0,
      };

      setUserStats(stats);
    } catch (err) {
      console.error("Users fetch error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load users data"
      );
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((user) =>
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((user) => {
        switch (filterStatus) {
          case "active":
            return user.is_active && user.subscription_status === "active";
          case "trial":
            return (
              user.subscription_status === "trial" ||
              user.subscription_status === "trialing"
            );
          case "professional":
            return user.subscription_tier === "professional";
          case "inactive":
            return !user.is_active;
          default:
            return true;
        }
      });
    }

    setFilteredUsers(filtered);
  };

  const handleUserAction = async (userId: string, action: string) => {
    try {
      // Placeholder for user actions - you can implement these
      console.log(`Action: ${action} for user: ${userId}`);

      switch (action) {
        case "view":
          // Open user detail modal
          break;
        case "edit":
          // Open edit user modal
          break;
        case "deactivate":
          // Deactivate user
          break;
        case "upgrade":
          // Upgrade subscription
          break;
      }

      // Refresh data after action
      await fetchUsersData();
    } catch (err) {
      console.error("User action error:", err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      active: "bg-green-900/50 text-green-400 border-green-500/50",
      trial: "bg-blue-900/50 text-blue-400 border-blue-500/50",
      trialing: "bg-blue-900/50 text-blue-400 border-blue-500/50", // Handle "trialing" status
    };

    return badges[status as keyof typeof badges] || badges.trial;
  };

  const getTierBadge = (tier: string) => {
    const badges = {
      starter: "bg-slate-900/50 text-slate-400 border-slate-500/50",
      professional: "bg-purple-900/50 text-purple-400 border-purple-500/50",
    };

    return badges[tier as keyof typeof badges] || badges.starter;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">
            User Management
          </h1>
          <p className="text-slate-400">Loading user data...</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
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
            User Management
          </h1>
          <p className="text-slate-400">Error loading user data</p>
        </div>

        <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-6">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <h3 className="text-lg font-semibold text-red-400">Error</h3>
          </div>
          <p className="text-red-300 mt-2">{error}</p>
          <button
            onClick={fetchUsersData}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">
            User Management
          </h1>
          <p className="text-slate-400">
            Manage platform users and subscriptions
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchUsersData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
          >
            <TrendingUp className="h-4 w-4" />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
          >
            <UserPlus className="h-4 w-4" />
            <span>Add User</span>
          </button>
        </div>
      </div>

      {/* User Stats Grid */}
      {userStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Users */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Total Users</h3>
              <Users className="h-6 w-6 text-blue-400" />
            </div>
            <p className="text-3xl font-bold text-blue-400">
              {userStats.totalUsers.toLocaleString()}
            </p>
            <p className="text-sm text-slate-400 mt-2">
              {userStats.newUsersThisWeek} new this week
            </p>
          </div>

          {/* Active Users */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Active Users</h3>
              <CheckCircle className="h-6 w-6 text-green-400" />
            </div>
            <p className="text-3xl font-bold text-green-400">
              {userStats.activeUsers}
            </p>
            <p className="text-sm text-slate-400 mt-2">
              {Math.round((userStats.activeUsers / userStats.totalUsers) * 100)}
              % of total
            </p>
          </div>

          {/* Revenue */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                Monthly Revenue
              </h3>
              <DollarSign className="h-6 w-6 text-purple-400" />
            </div>
            <p className="text-3xl font-bold text-purple-400">
              ${userStats.totalRevenue.toLocaleString()}
            </p>
            <p className="text-sm text-slate-400 mt-2">Estimated recurring</p>
          </div>

          {/* Avg Trades */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Avg Trades</h3>
              <Target className="h-6 w-6 text-yellow-400" />
            </div>
            <p className="text-3xl font-bold text-yellow-400">
              {userStats.averageTradesPerUser}
            </p>
            <p className="text-sm text-slate-400 mt-2">Per user</p>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search users by email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-slate-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Users</option>
                <option value="active">Active</option>
                <option value="trial">Trial</option>
                <option value="professional">Professional</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <span className="text-sm text-slate-400">
              {filteredUsers.length} of {users.length} users
            </span>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Subscription
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Trades
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-700/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-white">
                            {user.email.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-medium">{user.email}</p>
                          <p className="text-slate-400 text-sm">
                            ID: {user.id.slice(0, 8)}...
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(
                          user.subscription_status || "trial"
                        )}`}
                      >
                        {user.subscription_status || "trial"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTierBadge(
                          user.subscription_tier || "starter"
                        )}`}
                      >
                        {user.subscription_tier || "starter"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white font-medium">
                        {user.total_trades || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white text-sm">
                          {formatDate(user.created_at)}
                        </p>
                        <p className="text-slate-400 text-xs">
                          {formatTimeAgo(user.created_at)}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleUserAction(user.id, "view")}
                          className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-700 rounded-lg transition-colors"
                          title="View User"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleUserAction(user.id, "edit")}
                          className="p-2 text-slate-400 hover:text-green-400 hover:bg-slate-700 rounded-lg transition-colors"
                          title="Edit User"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleUserAction(user.id, "upgrade")}
                          className="p-2 text-slate-400 hover:text-purple-400 hover:bg-slate-700 rounded-lg transition-colors"
                          title="Upgrade Subscription"
                        >
                          <Crown className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-slate-300 hover:bg-slate-700 rounded-lg transition-colors">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center space-y-3">
                      <Users className="h-12 w-12 text-slate-600" />
                      <p className="text-slate-400 text-lg">No users found</p>
                      <p className="text-slate-500 text-sm">
                        {searchQuery || filterStatus !== "all"
                          ? "Try adjusting your search or filters"
                          : "Users will appear here once they sign up"}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      <AddUserModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onUserAdded={fetchUsersData}
      />

      {/* Footer Status */}
      <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span className="text-slate-300">Real User Data Connected</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-blue-400" />
              <span className="text-slate-300">Live User Management</span>
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

export default AdminUsers;
