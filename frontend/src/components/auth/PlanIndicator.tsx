
import React from 'react';
import { Check, Star, Crown, TrendingUp } from 'lucide-react';

interface PlanIndicatorProps {
  planId?: string;
  planName?: string;
  price?: string;
  billingCycle?: string;
}

const PlanIndicator: React.FC<PlanIndicatorProps> = ({ 
  planId, 
  planName, 
  price, 
  billingCycle = 'monthly' 
}) => {
  if (!planId || !planName || !price) {
    return (
      <div className="text-center mb-6">
        <p className="text-slate-400">Create your account to get started</p>
      </div>
    );
  }

  const getIcon = () => {
    switch (planId) {
      case 'starter':
        return <TrendingUp className="h-5 w-5 text-blue-400" />;
      case 'professional':
        return <Star className="h-5 w-5 text-emerald-400" />;
      case 'elite':
        return <Crown className="h-5 w-5 text-amber-400" />;
      default:
        return <Check className="h-5 w-5 text-blue-400" />;
    }
  };

  const getBadge = () => {
    switch (planId) {
      case 'professional':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            Most Popular
          </span>
        );
      case 'elite':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30">
            Best Value
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4 mb-6 text-center">
      <div className="flex items-center justify-center space-x-2 mb-2">
        {getIcon()}
        <p className="text-sm text-slate-400">You're signing up for</p>
      </div>
      
      <div className="flex items-center justify-center space-x-2 mb-1">
        <h3 className="text-xl font-semibold text-white">{planName} Plan</h3>
        {getBadge()}
      </div>
      
      <p className="text-sm text-slate-400">
        ${price}/{billingCycle} after 7-day free trial
      </p>
      
      <button 
        onClick={() => window.location.href = '/pricing'}
        className="text-blue-400 hover:text-blue-300 text-sm underline mt-2 inline-block"
      >
        Change plan
      </button>
    </div>
  );
};

export default PlanIndicator;
