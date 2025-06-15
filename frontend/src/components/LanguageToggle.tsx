
import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { Languages, ChevronDown } from 'lucide-react';

const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'ar', label: 'العربية', flag: '🇸🇦' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' }
  ];

  const currentLanguage = languages.find(lang => lang.code === language);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="text-slate-300 hover:text-white hover:bg-slate-700/50 flex items-center space-x-2"
      >
        <Languages className="h-4 w-4" />
        <span className="flex items-center space-x-1">
          <span>{currentLanguage?.flag}</span>
          <span>{currentLanguage?.label}</span>
        </span>
        <ChevronDown className="h-3 w-3" />
      </Button>
      
      {isOpen && (
        <div className="absolute top-full mt-1 right-0 bg-slate-800 border border-slate-600 rounded-md shadow-lg z-50 min-w-[120px]">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code as any);
                setIsOpen(false);
              }}
              className="w-full px-3 py-2 text-left hover:bg-slate-700 text-slate-200 hover:text-white flex items-center space-x-2 first:rounded-t-md last:rounded-b-md transition-colors duration-200"
            >
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageToggle;
