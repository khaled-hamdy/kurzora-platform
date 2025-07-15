import React, { useState, useEffect, useRef } from "react";

// 🔧 PRESERVATION: Keeping same interface structure but allowing both number and text animation
interface AnimatedNumberProps {
  value: string;
  color: string;
  duration?: number;
}

// 🔧 PRESERVATION: Keeping same AnimatedNumber component structure but enhancing for text
const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  color,
  duration = 2000,
}) => {
  const [displayValue, setDisplayValue] = useState("");
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  // 🔧 PRESERVATION: Keeping exact same IntersectionObserver logic
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateValue();
        }
      },
      { threshold: 0.5 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  // 🎯 ENHANCED: Updated animation to handle both numbers and text smoothly
  const animateValue = () => {
    // Check if value contains numbers for percentage animation
    const match = value.match(/[+-]?(\d+\.?\d*)/);
    if (match) {
      // 🔧 PRESERVATION: Keep original number animation logic for compatibility
      const numericValue = parseFloat(match[1]);
      const prefix = value.includes("-") ? "-" : value.includes("+") ? "+" : "";
      const suffix = value.replace(/[+-]?\d+\.?\d*/, "");

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
      // 🎯 NEW: Text animation for qualitative metrics - typewriter effect
      let currentIndex = 0;
      const timer = setInterval(() => {
        if (currentIndex <= value.length) {
          setDisplayValue(value.substring(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(timer);
        }
      }, duration / value.length);
    }
  };

  // 🔧 PRESERVATION: Keeping exact same JSX structure and CSS classes
  return (
    <div
      ref={elementRef}
      className={`text-3xl font-bold ${color} transition-all duration-300`}
    >
      {displayValue}
    </div>
  );
};

// 🔧 PRESERVATION: Keeping same React.FC structure and component name
const ProfitStats: React.FC = () => {
  // 🔧 PRESERVATION: Keeping exact same JSX structure, grid layout, and all CSS classes
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mt-12 sm:mt-16 px-4">
      {/* 🎯 AUDI APPROACH: Changed to qualitative metrics while preserving layout */}
      <div className="bg-slate-900/50 backdrop-blur-sm border border-blue-800/30 rounded-lg p-4 sm:p-6 hover:scale-105 transition-transform duration-300 hover:shadow-lg hover:shadow-blue-500/10 text-center">
        <AnimatedNumber value="Institutional" color="text-emerald-400" />
        <p className="text-slate-400 mt-2 text-xs sm:text-sm">Signal Quality</p>
      </div>
      <div className="bg-slate-900/50 backdrop-blur-sm border border-blue-800/30 rounded-lg p-4 sm:p-6 hover:scale-105 transition-transform duration-300 hover:shadow-lg hover:shadow-blue-500/10 text-center">
        <AnimatedNumber value="Advanced" color="text-blue-400" />
        <p className="text-slate-400 mt-2 text-xs sm:text-sm">
          Risk Management
        </p>
      </div>
      <div className="bg-slate-900/50 backdrop-blur-sm border border-blue-800/30 rounded-lg p-4 sm:p-6 hover:scale-105 transition-transform duration-300 hover:shadow-lg hover:shadow-blue-500/10 text-center">
        <AnimatedNumber value="Multi-Frame" color="text-purple-400" />
        <p className="text-slate-400 mt-2 text-xs sm:text-sm">Analysis Depth</p>
      </div>
      <div className="bg-slate-900/50 backdrop-blur-sm border border-blue-800/30 rounded-lg p-4 sm:p-6 hover:scale-105 transition-transform duration-300 hover:shadow-lg hover:shadow-blue-500/10 text-center">
        <AnimatedNumber value="Real-Time" color="text-emerald-400" />
        <p className="text-slate-400 mt-2 text-xs sm:text-sm">
          Signal Delivery
        </p>
      </div>
    </div>
  );
};

export default ProfitStats;
