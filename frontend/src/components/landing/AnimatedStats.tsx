
import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

interface AnimatedNumberProps {
  value: string;
  duration?: number;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ value, duration = 2000 }) => {
  const [displayValue, setDisplayValue] = useState('0');
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateNumber();
        }
      },
      { threshold: 0.5 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  const animateNumber = () => {
    const numericValue = parseInt(value.replace(/[^0-9]/g, ''));
    const suffix = value.replace(/[0-9]/g, '');
    let current = 0;
    const increment = numericValue / (duration / 50);
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= numericValue) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current) + suffix);
      }
    }, 50);
  };

  return (
    <div ref={elementRef} className="text-emerald-400 text-2xl sm:text-3xl font-bold mb-2 transition-all duration-300">
      {displayValue}
    </div>
  );
};

const AnimatedStats: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-12 sm:mt-16 px-4">
      <div className="bg-slate-900/50 backdrop-blur-sm border border-blue-800/30 rounded-lg p-4 sm:p-6 hover:scale-105 transition-transform duration-300 hover:shadow-lg hover:shadow-blue-500/10">
        <AnimatedNumber value={t('landing.accuracy')} />
        <div className="text-slate-300 text-xs sm:text-sm">Win Rate</div>
      </div>
      <div className="bg-slate-900/50 backdrop-blur-sm border border-blue-800/30 rounded-lg p-4 sm:p-6 hover:scale-105 transition-transform duration-300 hover:shadow-lg hover:shadow-blue-500/10">
        <AnimatedNumber value={t('landing.avgRoi')} />
        <div className="text-slate-300 text-xs sm:text-sm">Per Trade</div>
      </div>
      <div className="bg-slate-900/50 backdrop-blur-sm border border-blue-800/30 rounded-lg p-4 sm:p-6 hover:scale-105 transition-transform duration-300 hover:shadow-lg hover:shadow-blue-500/10">
        <AnimatedNumber value={t('landing.tradesAnalyzed')} />
        <div className="text-slate-300 text-xs sm:text-sm">Historical Data</div>
      </div>
    </div>
  );
};

export default AnimatedStats;
