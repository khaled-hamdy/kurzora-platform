
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const SignalLegend: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-wrap items-center gap-3 text-xs">
      <span className="text-slate-400">{t('signals.legend')}:</span>
      <div className="flex items-center space-x-1">
        <div className="w-4 h-4 rounded border" style={{ backgroundColor: 'hsl(118, 95.3%, 49.8%)', borderColor: 'hsl(118, 95.3%, 49.8%)' }}></div>
        <span className="text-slate-300">💎 90-100 {t('signals.strong')}</span>
      </div>
      <div className="flex items-center space-x-1">
        <div className="w-4 h-4 rounded border" style={{ backgroundColor: 'hsl(208, 77.3%, 72.4%)', borderColor: 'hsl(208, 77.3%, 72.4%)' }}></div>
        <span className="text-slate-300">✅ 80-89 {t('signals.valid')}</span>
      </div>
      <div className="flex items-center space-x-1">
        <div className="w-4 h-4 bg-yellow-500 rounded border border-yellow-400"></div>
        <span className="text-slate-300">⚠️ 70-79 {t('signals.weak')}</span>
      </div>
    </div>
  );
};

export default SignalLegend;
