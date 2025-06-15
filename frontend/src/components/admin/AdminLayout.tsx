
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Shield, Users, BarChart3, Settings } from 'lucide-react';
import { Button } from '../ui/button';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  const getNavLinkClasses = (path: string) => {
    const baseClasses = "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-300";
    if (isActiveRoute(path)) {
      return `${baseClasses} bg-blue-600 text-white shadow-lg`;
    }
    return `${baseClasses} text-slate-300 hover:text-white hover:bg-slate-700/50`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      <nav className="bg-slate-900/50 backdrop-blur-sm border-b border-red-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/dashboard" className="text-slate-300 hover:text-white">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Platform
                </Link>
              </Button>
              <div className="h-6 w-px bg-slate-600"></div>
              <div className="flex items-center space-x-1">
                <Shield className="h-5 w-5 text-red-400" />
                <span className="text-white font-semibold">Admin Panel</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-300">
                Welcome, <span className="text-red-400 font-medium">{user?.name}</span>
              </span>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        <aside className="w-64 min-h-screen bg-slate-900/30 border-r border-red-500/20">
          <div className="p-4">
            <nav className="space-y-2">
              <Link to="/admin" className={getNavLinkClasses('/admin')}>
                <BarChart3 className="h-4 w-4 mr-3" />
                Dashboard
              </Link>
              <Link to="/admin/users" className={getNavLinkClasses('/admin/users')}>
                <Users className="h-4 w-4 mr-3" />
                Users
              </Link>
              <Link to="/admin/signals" className={getNavLinkClasses('/admin/signals')}>
                <BarChart3 className="h-4 w-4 mr-3" />
                Signals
              </Link>
              <Link to="/admin/settings" className={getNavLinkClasses('/admin/settings')}>
                <Settings className="h-4 w-4 mr-3" />
                Settings
              </Link>
            </nav>
          </div>
        </aside>

        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
