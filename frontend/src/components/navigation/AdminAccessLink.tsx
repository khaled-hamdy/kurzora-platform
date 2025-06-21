// =============================================
// STEP 1: Create the AdminAccessLink component
// =============================================
// File: src/components/navigation/AdminAccessLink.tsx

import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Shield, Crown, Settings } from "lucide-react";

const AdminAccessLink: React.FC = () => {
  const { user } = useAuth();

  // Check if user is admin (same logic as AdminProtectedRoute)
  const isAdmin = () => {
    if (!user) return false;

    const adminEmails = [
      "admin@kurzora.com",
      "khaled@kurzora.com",
      "khaledhamdy@gmail.com",
      "test@kurzora.com",
      // Add your actual email here
    ];

    return (
      user.user_metadata?.has_admin_access === true ||
      user.user_metadata?.role === "admin" ||
      adminEmails.includes(user.email || "")
    );
  };

  // Don't render anything if user is not admin
  if (!user || !isAdmin()) {
    return null;
  }

  return (
    <Link
      to="/admin"
      className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gradient-to-r from-red-500/20 to-purple-500/20 border border-red-500/30 hover:border-red-400/50 transition-all duration-200 hover:shadow-lg hover:shadow-red-500/20"
      title="Access Admin Panel"
    >
      <Shield className="h-4 w-4 text-red-400" />
      <span className="text-red-400 font-medium text-sm">Admin Panel</span>
      <Crown className="h-3 w-3 text-red-300" />
    </Link>
  );
};

export default AdminAccessLink;

// =============================================
// STEP 2: Integration Examples for Different Navigation Types
// =============================================

// Option A: If you have a TOP HEADER NAVIGATION
// Add to your main header component (e.g., src/components/layout/Header.tsx)

import AdminAccessLink from "../navigation/AdminAccessLink";

const Header = () => {
  return (
    <header className="bg-slate-900 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Your existing header content */}
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-white">Kurzora</h1>
            {/* Other navigation items */}
          </div>

          {/* Right side with user menu and admin access */}
          <div className="flex items-center space-x-4">
            {/* Add the admin link here */}
            <AdminAccessLink />

            {/* Your existing user menu, notifications, etc. */}
            <UserProfileDropdown />
          </div>
        </div>
      </div>
    </header>
  );
};

// Option B: If you have a SIDEBAR NAVIGATION
// Add to your sidebar component (e.g., src/components/layout/Sidebar.tsx)

import AdminAccessLink from "../navigation/AdminAccessLink";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-slate-900 min-h-screen">
      <div className="p-4">
        {/* Your existing sidebar content */}
        <nav className="space-y-2">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/signals">Signals</Link>
          <Link to="/positions">Positions</Link>
          <Link to="/settings">Settings</Link>

          {/* Add admin access at the bottom */}
          <div className="pt-4 mt-4 border-t border-slate-700">
            <AdminAccessLink />
          </div>
        </nav>
      </div>
    </aside>
  );
};

// Option C: If you have a USER DROPDOWN MENU
// Add to your user menu component

import AdminAccessLink from "../navigation/AdminAccessLink";

const UserDropdownMenu = () => {
  return (
    <div className="dropdown-menu">
      {/* Your existing menu items */}
      <Link to="/profile">Profile</Link>
      <Link to="/settings">Settings</Link>

      {/* Add admin access in the menu */}
      <div className="border-t border-slate-700 pt-2 mt-2">
        <AdminAccessLink />
      </div>

      <button onClick={logout}>Logout</button>
    </div>
  );
};

// =============================================
// STEP 3: Quick Integration for Dashboard Page
// =============================================

// If you want to add it directly to your Dashboard page as a floating button
// Add to your Dashboard.tsx file:

import AdminAccessLink from "../components/navigation/AdminAccessLink";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      {/* Your existing dashboard content */}

      {/* Floating admin access button (optional) */}
      <div className="fixed bottom-4 right-4 z-50">
        <AdminAccessLink />
      </div>
    </div>
  );
};

// =============================================
// FINAL FILE STRUCTURE
// =============================================

/*
src/
├── components/
│   ├── navigation/
│   │   └── AdminAccessLink.tsx        ← Create this file
│   ├── layout/
│   │   ├── Header.tsx                 ← Add AdminAccessLink import here
│   │   └── Sidebar.tsx                ← OR add import here
│   └── admin/
│       ├── AdminProtectedRoute.tsx    ← Already exists
│       ├── AdminLayout.tsx            ← Already exists 
│       ├── AdminDashboard.tsx         ← Already exists
│       ├── AdminUsers.tsx             ← Already exists
│       └── AdminSettings.tsx          ← Already exists
*/
