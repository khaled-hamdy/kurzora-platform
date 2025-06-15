
import React, { useState, useEffect, useRef } from 'react';

interface AnimatedNumberProps {
  value: string;
  color: string;
  duration?: number;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ value, color, duration = 2000 }) => {
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
    // For values like "+4.7%" or "-2.1%", extract the number
    const match = value.match(/[+-]?(\d+\.?\d*)/);
    if (match) {
      const numericValue = parseFloat(match[1]);
      const prefix = value.includes('-') ? '-' : value.includes('+') ? '+' : '';
      const suffix = value.replace(/[+-]?\d+\.?\d*/, '');
      
      let current = 0;
      const increment = numericValue / (duration / 50);
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= numericValue) {
          setDisplayValue(value);
          clearInterval(timer);
        } else {
          setDisplayValue(prefix + current.toFixed(1) + suffix);
        }
      }, 50);
    } else {
      // For non-numeric values like "2:1"
      setTimeout(() => setDisplayValue(value), duration / 2);
    }
  };

  return (
    <div ref={elementRef} className={`text-3xl font-bold ${color} transition-all duration-300`}>
      {displayValue}
    </div>
  );
};

const ProfitStats: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mt-12 sm:mt-16 px-4">
      <div className="bg-slate-900/50 backdrop-blur-sm border border-blue-800/30 rounded-lg p-4 sm:p-6 hover:scale-105 transition-transform duration-300 hover:shadow-lg hover:shadow-blue-500/10 text-center">
        <AnimatedNumber value="+4.7%" color="text-emerald-400" />
        <p className="text-slate-400 mt-2 text-xs sm:text-sm">Avg Winning Trade</p>
      </div>
      <div className="bg-slate-900/50 backdrop-blur-sm border border-blue-800/30 rounded-lg p-4 sm:p-6 hover:scale-105 transition-transform duration-300 hover:shadow-lg hover:shadow-blue-500/10 text-center">
        <AnimatedNumber value="-2.1%" color="text-red-400" />
        <p className="text-slate-400 mt-2 text-xs sm:text-sm">Avg Losing Trade</p>
      </div>
      <div className="bg-slate-900/50 backdrop-blur-sm border border-blue-800/30 rounded-lg p-4 sm:p-6 hover:scale-105 transition-transform duration-300 hover:shadow-lg hover:shadow-blue-500/10 text-center">
        <AnimatedNumber value="2:1" color="text-blue-400" />
        <p className="text-slate-400 mt-2 text-xs sm:text-sm">Profit Ratio</p>
      </div>
      <div className="bg-slate-900/50 backdrop-blur-sm border border-blue-800/30 rounded-lg p-4 sm:p-6 hover:scale-105 transition-transform duration-300 hover:shadow-lg hover:shadow-blue-500/10 text-center">
        <AnimatedNumber value="+47%" color="text-emerald-400" />
        <p className="text-slate-400 mt-2 text-xs sm:text-sm">Annual Avg Return</p>
      </div>
    </div>
  );
};

export default ProfitStats;
