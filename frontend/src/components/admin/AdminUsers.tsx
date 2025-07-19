// 🎯 PURPOSE: Admin user management with SQL-based deletion
// 🔧 SESSION: Updated to use SQL script approach instead of Edge Functions
// 🛡️ PRESERVATION: All Session #201 bulletproof user creation functionality intact
// 📝 HANDOVER: Delete function generates SQL script for manual execution

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

// 🗑️ NEW: SQL Delete Modal Component
interface SQLDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
  onDeleted: () => void;
}

const SQLDeleteModal: React.FC<SQLDeleteModalProps> = ({
  isOpen,
  onClose,
  userEmail,
  onDeleted,
}) => {
  const [step, setStep] = useState<"confirm" | "sql" | "complete">("confirm");
  const [confirmText, setConfirmText] = useState("");
  const requiredText = "DELETE";

  // Generate the SQL script with the user's email
  const generateSQL = () => {
    return `-- 🗑️ DELETE USER: ${userEmail}
-- ⚠️ WARNING: This permanently deletes ALL user data
-- Run this in Supabase Dashboard → SQL Editor

BEGIN;

-- Delete in proper order (children first, parents last)
DELETE FROM alert_delivery_log 
WHERE user_id IN (
    SELECT id FROM users WHERE email = '${userEmail}'
    UNION 
    SELECT id FROM auth.users WHERE email = '${userEmail}'
);

DELETE FROM watchlist_items 
WHERE watchlist_id IN (
    SELECT w.id FROM watchlists w 
    WHERE w.user_id IN (
        SELECT id FROM users WHERE email = '${userEmail}'
        UNION 
        SELECT id FROM auth.users WHERE email = '${userEmail}'
    )
);

DELETE FROM watchlists 
WHERE user_id IN (
    SELECT id FROM users WHERE email = '${userEmail}'
    UNION 
    SELECT id FROM auth.users WHERE email = '${userEmail}'
);

DELETE FROM user_alert_settings 
WHERE user_id IN (
    SELECT id FROM users WHERE email = '${userEmail}'
    UNION 
    SELECT id FROM auth.users WHERE email = '${userEmail}'
);

DELETE FROM paper_trades 
WHERE user_id IN (
    SELECT id FROM users WHERE email = '${userEmail}'
    UNION 
    SELECT id FROM auth.users WHERE email = '${userEmail}'
);

DELETE FROM portfolio_snapshots 
WHERE user_id IN (
    SELECT id FROM users WHERE email = '${userEmail}'
    UNION 
    SELECT id FROM auth.users WHERE email = '${userEmail}'
);

DELETE FROM dashboard_metrics 
WHERE user_id IN (
    SELECT id FROM users WHERE email = '${userEmail}'
    UNION 
    SELECT id FROM auth.users WHERE email = '${userEmail}'
);

DELETE FROM user_sessions 
WHERE user_id IN (
    SELECT id FROM users WHERE email = '${userEmail}'
    UNION 
    SELECT id FROM auth.users WHERE email = '${userEmail}'
);

-- Finally delete from main users table
DELETE FROM users WHERE email = '${userEmail}';

-- Verify deletion
SELECT 
    'Remaining in users table' as check_type,
    COUNT(*) as remaining_records 
FROM users WHERE email = '${userEmail}'
UNION ALL
SELECT 
    'Remaining in auth.users table' as check_type,
    COUNT(*) as remaining_records 
FROM auth.users WHERE email = '${userEmail}';

-- If verification shows 0 records, run:
COMMIT;

-- MANUAL STEP: Go to Supabase Dashboard → Authentication → Users → Delete the user manually`;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateSQL());
      alert("SQL script copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const openSupabaseDashboard = () => {
    window.open(
      "https://supabase.com/dashboard/project/jmbkssafogvzizypjaoi/sql/new",
      "_blank"
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-slate-800 rounded-lg border border-red-500/50 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <Trash2 className="h-6 w-6 text-red-400" />
            <h2 className="text-xl font-semibold text-white">
              {step === "confirm" && "Confirm Deletion"}
              {step === "sql" && "SQL Script Ready"}
              {step === "complete" && "Deletion Complete"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === "confirm" && (
            <div className="space-y-4">
              <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4">
                <h3 className="text-red-400 font-semibold mb-2">
                  ⚠️ PERMANENT DELETION WARNING
                </h3>
                <p className="text-red-300 text-sm">
                  This will permanently delete user:{" "}
                  <span className="font-mono text-red-200">{userEmail}</span>
                </p>
                <p className="text-red-300 text-sm mt-2">
                  Including all trading history, watchlists, settings, and
                  authentication data.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Type <span className="font-mono text-red-400">DELETE</span> to
                  confirm:
                </label>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Type DELETE here..."
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setStep("sql")}
                  disabled={confirmText !== requiredText}
                  className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Generate SQL Script
                </button>
              </div>
            </div>
          )}

          {step === "sql" && (
            <div className="space-y-4">
              <div className="bg-blue-900/20 border border-blue-500/50 rounded-lg p-4">
                <h3 className="text-blue-400 font-semibold mb-2">
                  📋 SQL Deletion Script
                </h3>
                <p className="text-blue-300 text-sm">
                  Copy this script and run it in Supabase Dashboard → SQL Editor
                </p>
              </div>

              <div className="bg-slate-900 rounded-lg p-4 border border-slate-600">
                <pre className="text-sm text-slate-300 overflow-x-auto whitespace-pre-wrap">
                  {generateSQL()}
                </pre>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep("confirm")}
                  className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
                >
                  ← Back
                </button>
                <div className="flex space-x-3">
                  <button
                    onClick={copyToClipboard}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <span>📋 Copy SQL</span>
                  </button>
                  <button
                    onClick={openSupabaseDashboard}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <span>🔗 Open SQL Editor</span>
                  </button>
                  <button
                    onClick={() => setStep("complete")}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Mark as Done
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === "complete" && (
            <div className="space-y-4 text-center">
              <div className="bg-green-900/20 border border-green-500/50 rounded-lg p-6">
                <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-green-400 font-semibold text-lg mb-2">
                  Deletion Complete!
                </h3>
                <p className="text-green-300">
                  User <span className="font-mono">{userEmail}</span> has been
                  deleted.
                </p>
                <p className="text-green-300 text-sm mt-2">
                  Remember to also delete the user from Authentication → Users
                  in Supabase Dashboard.
                </p>
              </div>

              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => {
                    onDeleted();
                    onClose();
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  ✅ Refresh User List
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

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
    subscription_tier: "professional", // 🔧 FIXED: Default to professional for test users
    subscription_status: "trial",
    trial_end_date: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate default trial end date (30 days from now for test users)
  const getDefaultTrialEndDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 30); // 30 days for test users
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

  // 🔧 SESSION #201 BULLETPROOF FIX: Admin panel creates database profile directly
  // This completely bypasses AuthContext to eliminate race conditions
  const createUserProfileDirectly = async (
    userId: string,
    userEmail: string,
    targetTier: string
  ) => {
    console.log(
      "🏗️ ADMIN PANEL: Creating user profile directly in database..."
    );
    console.log("👤 USER ID:", userId);
    console.log("📧 EMAIL:", userEmail);
    console.log("🎯 TARGET TIER:", targetTier);

    try {
      // Create the complete user profile directly
      const profileData = {
        id: userId,
        email: userEmail.toLowerCase().trim(),
        name: userEmail.split("@")[0] || "User",
        subscription_tier: targetTier,
        subscription_status: "trial",
        language: "en",
        timezone: "UTC",
        starting_balance: 10000.0,
        current_balance: 10000.0,
        risk_percentage: 2.0,
        notification_settings: {
          email_alerts_enabled: true,
          telegram_alerts_enabled: targetTier === "professional",
          daily_alert_limit: targetTier === "starter" ? 3 : null,
          minimum_score: 65,
        },
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      console.log("📋 ADMIN PANEL: Profile data to insert:", {
        email: profileData.email,
        subscription_tier: profileData.subscription_tier,
        notification_settings: profileData.notification_settings,
      });

      // Insert directly into database
      const { data, error } = await supabase
        .from("users")
        .insert([profileData])
        .select()
        .single();

      if (error) {
        // Handle potential conflicts gracefully
        if (error.code === "23505") {
          // Duplicate key
          console.log(
            "🔄 ADMIN PANEL: User already exists, updating instead..."
          );

          const { data: updateData, error: updateError } = await supabase
            .from("users")
            .update({
              subscription_tier: targetTier,
              notification_settings: profileData.notification_settings,
              updated_at: new Date().toISOString(),
            })
            .eq("id", userId)
            .select()
            .single();

          if (updateError) {
            throw updateError;
          }

          console.log("✅ ADMIN PANEL: User profile updated successfully!");
          return updateData;
        } else {
          throw error;
        }
      }

      console.log("✅ ADMIN PANEL: User profile created successfully!");
      console.log("✅ VERIFIED TIER:", data.subscription_tier);

      return data;
    } catch (error) {
      console.error("💥 ADMIN PANEL: Direct profile creation failed:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log(
        "🆕 ADMIN PANEL: Creating test user with tier:",
        formData.subscription_tier
      );

      // Step 1: Create user with Supabase Auth (with special flag to prevent AuthContext profile creation)
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
            skip_authcontext_profile: true, // 🔧 NEW: Prevent AuthContext from creating profile
          },
        },
      });

      if (signUpError) throw signUpError;

      if (!data.user) {
        throw new Error("User creation failed - no user data returned");
      }

      console.log("✅ ADMIN PANEL: User created in Auth successfully");
      console.log("👤 USER ID:", data.user.id);

      // Step 2: Create database profile directly (NO waiting for AuthContext)
      console.log("🏗️ ADMIN PANEL: Creating database profile directly...");

      const profileResult = await createUserProfileDirectly(
        data.user.id,
        formData.email,
        formData.subscription_tier
      );

      // Step 3: Final verification
      console.log("🔍 ADMIN PANEL: Verifying final result...");
      console.log("✅ FINAL EMAIL:", profileResult.email);
      console.log("✅ FINAL TIER:", profileResult.subscription_tier);

      if (profileResult.subscription_tier !== formData.subscription_tier) {
        throw new Error(
          `CRITICAL: Final tier (${profileResult.subscription_tier}) does not match target (${formData.subscription_tier})`
        );
      }

      // Success!
      console.log(
        "🎉 ADMIN PANEL: Test user created successfully with correct tier!"
      );
      console.log("🎉 NO RACE CONDITIONS - Complete admin panel control!");

      onUserAdded();
      onClose();

      // Reset form
      setFormData({
        email: "",
        password: "",
        subscription_tier: "professional",
        subscription_status: "trial",
        trial_end_date: "",
      });
    } catch (err) {
      console.error("❌ ADMIN PANEL: Test user creation error:", err);
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
            <h2 className="text-xl font-semibold text-white">Add Test User</h2>
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
                placeholder="friend@example.com"
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

          {/* 🔧 SIMPLIFIED: Fixed to Professional only for test users */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Account Type
            </label>
            <div className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2">
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">
                  Professional Test User
                </span>
                <span className="text-purple-400 text-sm">
                  No Payment Required
                </span>
              </div>
              <p className="text-slate-400 text-xs mt-1">
                Full access for testing
              </p>
            </div>
          </div>

          {/* Trial End Date */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Test Access Expires
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
              User will lose access after this date (default: 30 days)
            </p>
          </div>

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
              <span>{loading ? "Creating..." : "Create Test User"}</span>
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

  // 🗑️ NEW: SQL Delete functionality state
  const [showSQLDeleteModal, setShowSQLDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string>("");

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

  // 🗑️ NEW: Simple delete function that opens SQL modal
  const handleDeleteUser = async (userEmail: string) => {
    setUserToDelete(userEmail);
    setShowSQLDeleteModal(true);
  };

  const handleUserDeleted = async () => {
    // Refresh the user list after deletion
    await fetchUsersData();
  };

  const handleUserAction = async (
    userId: string,
    action: string,
    userEmail?: string
  ) => {
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
        case "delete":
          // 🗑️ NEW: Handle delete action with SQL modal
          if (userEmail) {
            handleDeleteUser(userEmail);
          }
          return; // Don't refresh data yet
      }

      // Refresh data after action (except delete, which handles its own refresh)
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
            Manage platform users and create test accounts
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
            <span>Add Test User</span>
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
                        {/* 🗑️ NEW: Delete Button */}
                        <button
                          onClick={() =>
                            handleUserAction(user.id, "delete", user.email)
                          }
                          className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="h-4 w-4" />
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

      {/* 🗑️ NEW: SQL Delete Modal */}
      <SQLDeleteModal
        isOpen={showSQLDeleteModal}
        onClose={() => {
          setShowSQLDeleteModal(false);
          setUserToDelete("");
        }}
        userEmail={userToDelete}
        onDeleted={handleUserDeleted}
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
            {/* 🗑️ NEW: SQL deletion functionality indicator */}
            <div className="flex items-center space-x-2">
              <Trash2 className="h-4 w-4 text-red-400" />
              <span className="text-slate-300">SQL Delete Available</span>
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
