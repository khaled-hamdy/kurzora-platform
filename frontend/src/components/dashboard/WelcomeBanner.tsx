
import React, { useState, useEffect } from 'react';
import { X, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';

interface WelcomeBannerProps {
  planName?: string;
  onDismiss: () => void;
  onExploreFeatures: () => void;
  onCompleteSetup: () => void;
}

const WelcomeBanner: React.FC<WelcomeBannerProps> = ({
  planName,
  onDismiss,
  onExploreFeatures,
  onCompleteSetup
}) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss();
  };

  return (
    <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 mb-6 overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-4 left-4 w-2 h-2 bg-white/20 rounded-full"></div>
        <div className="absolute top-8 right-8 w-1 h-1 bg-white/30 rounded-full"></div>
        <div className="absolute bottom-6 left-8 w-1.5 h-1.5 bg-white/20 rounded-full"></div>
        <div className="absolute bottom-4 right-4 w-1 h-1 bg-white/25 rounded-full"></div>
      </div>
      
      <button
        onClick={handleDismiss}
        className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
      >
        <X className="h-5 w-5" />
      </button>
      
      <div className="relative z-10">
        <div className="flex items-center space-x-2 mb-2">
          <Sparkles className="h-6 w-6 text-yellow-300" />
          <h2 className="text-2xl font-bold text-white">Welcome to Kurzora! 🎉</h2>
        </div>
        
        <p className="text-lg mb-4 text-blue-100">
          {planName 
            ? `Your ${planName} trial has started` 
            : 'Your free trial has started'
          }
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={onExploreFeatures}
            className="bg-white text-blue-600 hover:bg-blue-50 font-medium flex items-center space-x-2"
          >
            <span>Explore Features</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button 
            onClick={onCompleteSetup}
            variant="outline"
            className="border-white text-white hover:bg-white/10 font-medium"
          >
            Complete Setup
          </Button>
        </div>
        
        <div className="mt-4 pt-4 border-t border-white/20">
          <p className="text-sm text-blue-100">
            Your 7-day free trial includes full access to all features. 
            No credit card required until trial ends.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner;
