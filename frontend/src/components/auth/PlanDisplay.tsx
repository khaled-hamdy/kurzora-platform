
import React from 'react';

const planDetails = {
  starter: {
    name: 'Starter',
    price: 29,
    badge: null,
    icon: '📈'
  },
  professional: {
    name: 'Professional', 
    price: 79,
    badge: 'Most Popular',
    icon: '⭐'
  },
  elite: {
    name: 'Elite',
    price: 199,
    badge: 'Best Value',
    icon: '👑'
  }
};

interface PlanDisplayProps {
  planInfo: {
    id: string;
    name: string;
    price: string;
    billingCycle?: string;
  } | null;
  onChangePlan: () => void;
}

const PlanDisplay: React.FC<PlanDisplayProps> = ({ planInfo, onChangePlan }) => {
  if (!planInfo) return null;

  const planDetail = planDetails[planInfo.id as keyof typeof planDetails];
  const planIcon = planDetail?.icon || '⭐';
  const planBadge = planDetail?.badge;

  const getPlanBadge = () => {
    if (!planBadge) return null;
    
    const badgeClass = planInfo.id === 'professional' 
      ? 'bg-green-500/20 text-green-400' 
      : 'bg-amber-500/20 text-amber-400';
    
    return (
      <span className={`inline-block ${badgeClass} text-xs px-2 py-1 rounded-full mb-2`}>
        {planBadge}
      </span>
    );
  };

  return (
    <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4 mb-6 text-center relative">
      <span className="text-green-400 text-xl mb-2">{planIcon}</span>
      <p className="text-sm text-gray-400 mb-1">You're signing up for</p>
      <h3 className="text-2xl font-bold text-white">{planInfo.name} Plan</h3>
      {getPlanBadge()}
      <p className="text-gray-400">${planInfo.price}/{planInfo.billingCycle || 'monthly'} after 7-day free trial</p>
      <button 
        onClick={onChangePlan}
        className="mt-3 px-4 py-2 text-sm border border-blue-500 text-blue-400 rounded-lg hover:bg-blue-500/10 transition-colors"
      >
        Change plan
      </button>
    </div>
  );
};

export default PlanDisplay;
