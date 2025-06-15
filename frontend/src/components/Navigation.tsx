
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Briefcase, 
  History, 
  Settings,
  Shield
} from 'lucide-react';

const Navigation: React.FC = () => {
  const { t } = useLanguage();

  const navItems = [
    {
      to: '/dashboard',
      icon: LayoutDashboard,
      label: t('nav.dashboard')
    },
    {
      to: '/signals',
      icon: TrendingUp,
      label: t('nav.signals')
    },
    {
      to: '/open-positions',
      icon: Briefcase,
      label: t('nav.openPositions')
    },
    {
      to: '/orders-history',
      icon: History,
      label: t('nav.ordersHistory')
    },
    {
      to: '/settings',
      icon: Settings,
      label: t('nav.settings')
    },
    {
      to: '/admin',
      icon: Shield,
      label: t('nav.admin')
    }
  ];

  return (
    <nav className="bg-slate-900/50 backdrop-blur-sm border-r border-blue-800/30 w-64 min-h-screen">
      <div className="p-4">
        <div className="space-y-2">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`
                }
              >
                <IconComponent className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
