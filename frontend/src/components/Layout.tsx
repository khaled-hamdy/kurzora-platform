import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import LanguageToggle from "./LanguageToggle";
import Footer from "./Footer";
import {
  Home,
  Activity,
  BarChart3,
  Settings,
  LogOut,
  User,
  TrendingUp,
  BookOpen,
  Shield,
  Menu,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, signOut, isAdmin } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  // 🔧 SESSION #197: Mobile menu toggle state for responsive navigation
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      console.log("Main layout logout button clicked");
      await signOut();
      // Don't navigate here - signOut will handle redirect
    } catch (error) {
      console.error("Main logout error:", error);
      // Fallback redirect if signOut fails
      navigate("/");
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  // 🔧 SESSION #197: Close mobile menu when navigation item is clicked
  const handleMobileNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  // 🚀 MAIN NAVIGATION ITEMS - ADMIN LINK ADDED HERE
  const navItems = [
    { path: "/dashboard", label: t("nav.dashboard"), icon: Home },
    { path: "/signals", label: t("nav.signals"), icon: Activity },
    {
      path: "/open-positions",
      label: t("nav.openPositions"),
      icon: TrendingUp,
    },
    {
      path: "/orders-history",
      label: t("nav.historicalTrades"),
      icon: BookOpen,
    },
    { path: "/settings", label: t("nav.settings"), icon: Settings },
  ];

  // 🛡️ ADD ADMIN LINK TO NAVIGATION IF USER IS ADMIN
  if (isAdmin()) {
    navItems.push({
      path: "/admin",
      label: "Admin Panel", // You can add t("nav.adminPanel") if you have translation
      icon: Shield,
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      {/* Top Navigation */}
      <nav className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/dashboard" className="flex items-center space-x-2">
                <div className="logo-container">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 chart-element" />
                    <span className="logo-text text-xl sm:text-2xl font-bold">
                      Kurzora
                    </span>
                  </div>
                </div>
              </Link>

              {/* 🖥️ DESKTOP NAVIGATION - ADMIN LINK APPEARS HERE */}
              <div className="hidden md:flex ml-10 space-x-8">
                {navItems.map(({ path, label, icon: Icon }) => (
                  <Link
                    key={path}
                    to={path}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(path)
                        ? path === "/admin"
                          ? "text-red-400 bg-red-400/10 border border-red-500/30" // Special styling for admin
                          : "text-emerald-400 bg-emerald-400/10"
                        : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 ${
                        path === "/admin" ? "text-red-400" : ""
                      }`}
                    />
                    <span>{label}</span>
                    {/* 👑 ADMIN CROWN ICON */}
                    {path === "/admin" && (
                      <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                    )}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* 🔧 SESSION #197: Mobile hamburger menu button */}
              <div className="md:hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="text-slate-300 hover:text-white hover:bg-slate-700/50"
                >
                  {isMobileMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </Button>
              </div>

              <LanguageToggle />

              {user && (
                <div className="flex items-center space-x-4">
                  {/* 🛡️ ADMIN BADGE - SHOWS ONLY FOR ADMIN USERS */}
                  {isAdmin() && (
                    <div className="hidden sm:flex items-center space-x-1 px-2 py-1 bg-red-600/20 border border-red-500/30 rounded-md">
                      <Shield className="h-3 w-3 text-red-400" />
                      <span className="text-xs text-red-400 font-medium">
                        ADMIN
                      </span>
                    </div>
                  )}

                  {/* Account Dropdown Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="flex items-center space-x-2 text-slate-300 hover:text-white hover:bg-slate-700/50"
                      >
                        <User className="h-4 w-4" />
                        <span className="hidden sm:inline text-sm">
                          {t("nav.account")}
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-56 bg-slate-800 border-slate-700"
                    >
                      <DropdownMenuItem
                        onClick={() => navigate("/profile")}
                        className="text-slate-200 hover:bg-slate-700 hover:text-white cursor-pointer"
                      >
                        <User className="h-4 w-4 mr-2" />
                        {t("nav.profile")}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => navigate("/settings")}
                        className="text-slate-200 hover:bg-slate-700 hover:text-white cursor-pointer"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        {t("nav.settings")}
                      </DropdownMenuItem>

                      {/* 🛡️ ADMIN DROPDOWN LINK - SHOWS ONLY FOR ADMIN USERS */}
                      {isAdmin() && (
                        <>
                          <DropdownMenuSeparator className="bg-slate-700" />
                          <DropdownMenuItem
                            onClick={() => navigate("/admin")}
                            className="text-red-400 hover:bg-red-900/20 hover:text-red-300 cursor-pointer border-l-2 border-red-500/50 pl-3"
                          >
                            <Shield className="h-4 w-4 mr-2" />
                            Admin Panel
                            <div className="ml-auto flex items-center space-x-1">
                              <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse"></div>
                            </div>
                          </DropdownMenuItem>
                        </>
                      )}

                      <DropdownMenuSeparator className="bg-slate-700" />
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="text-slate-200 hover:bg-slate-700 hover:text-white cursor-pointer"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        {t("nav.logout")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
          </div>

          {/* 🔧 SESSION #197: Mobile navigation - now toggleable instead of always visible */}
          {isMobileMenuOpen && (
            <div className="md:hidden relative z-50">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-slate-900/95 border-t border-slate-700">
                {navItems.map(({ path, label, icon: Icon }) => (
                  <Link
                    key={path}
                    to={path}
                    onClick={handleMobileNavClick}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActive(path)
                        ? path === "/admin"
                          ? "text-red-400 bg-red-400/10 border border-red-500/30" // Special styling for admin
                          : "text-emerald-400 bg-emerald-400/10"
                        : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 ${
                        path === "/admin" ? "text-red-400" : ""
                      }`}
                    />
                    <span>{label}</span>
                    {/* 👑 ADMIN INDICATOR ON MOBILE */}
                    {path === "/admin" && (
                      <div className="ml-auto flex items-center space-x-1">
                        <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                        <span className="text-xs text-red-300 font-medium">
                          ADMIN
                        </span>
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;
