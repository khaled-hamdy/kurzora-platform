
import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageToggle from './LanguageToggle';

const Header: React.FC = () => {
  const { t } = useLanguage();

  return (
    <header className="bg-slate-900/50 backdrop-blur-sm border-b border-blue-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="logo-container">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 chart-element" />
                <span className="logo-text text-xl sm:text-2xl font-bold">Kurzora</span>
              </div>
            </div>
          </Link>
          
          <div className="flex items-center space-x-4">
            <LanguageToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
