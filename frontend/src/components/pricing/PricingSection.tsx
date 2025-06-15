
import React, { useState } from 'react';
import { Check, Star, Zap, Crown, TrendingUp } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { toast } from 'sonner';

interface PricingTier {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
  features: string[];
  cta: string;
  popular?: boolean;
  icon: React.ReactNode;
  badge?: string;
}

const pricingTiers: PricingTier[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: '$29',
    features: [
      '2-3 signals per day',
      'Telegram instant alerts',
      '30-day signal history',
      'Basic filtering',
      'Community Discord'
    ],
    cta: 'Start Free Trial',
    icon: <TrendingUp className="h-6 w-6" />
  },
  {
    id: 'professional',
    name: 'Professional',
    price: '$79',
    features: [
      '5-7 signals per day',
      'Priority alerts (get them first)',
      'Advanced filters',
      'Sector analysis',
      'API access (100 calls/day)',
      'Priority customer support',
      'Extended signal history'
    ],
    cta: 'Start 7-day Trial',
    popular: true,
    icon: <Star className="h-6 w-6" />,
    badge: 'Most Popular'
  },
  {
    id: 'elite',
    name: 'Elite',
    price: '$199',
    features: [
      'ALL signals (10-20 per day)',
      'Earliest access (5 min before others)',
      'Custom watchlist alerts',
      'White-label options',
      'API access (1000 calls/day)',
      'Dedicated account manager',
      'Exclusive webinars',
      'Early access to new features'
    ],
    cta: 'Go Elite Now',
    icon: <Crown className="h-6 w-6" />,
    badge: 'Best Value'
  }
];

interface PricingSectionProps {
  onSignupClick?: (planInfo?: any) => void;
}

const PricingSection: React.FC<PricingSectionProps> = ({ onSignupClick }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const handleSubscribe = (tier: PricingTier) => {
    const price = tier.price.replace('$', '');
    const planInfo = {
      id: tier.id,
      name: tier.name,
      price: price,
      billingCycle
    };
    
    if (onSignupClick) {
      // Store plan info for the signup form
      localStorage.setItem('selectedPlan', JSON.stringify(planInfo));
      onSignupClick(planInfo);
    } else {
      // If we're on a dedicated pricing page, store the plan and navigate cleanly
      localStorage.setItem('selectedPlan', JSON.stringify(planInfo));
      window.location.href = '/';
      // Use a timeout to trigger signup after navigation
      setTimeout(() => {
        const event = new CustomEvent('showSignup', { detail: planInfo });
        window.dispatchEvent(event);
      }, 100);
    }
  };

  const getDiscountedPrice = (price: string) => {
    if (billingCycle === 'yearly') {
      const numPrice = parseInt(price.replace('$', ''));
      const discounted = Math.round(numPrice * 0.8); // 20% discount for yearly
      return `$${discounted}`;
    }
    return price;
  };

  const getDailyPrice = (price: string) => {
    const numPrice = parseInt(price.replace('$', ''));
    return (numPrice / 30).toFixed(2);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-white mb-4">
          Choose Your Trading Edge
        </h2>
        <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
          Join thousands of profitable traders with our proven signal technology. 
          All plans include a 7-day free trial with no commitment.
        </p>
        
        <div className="flex items-center justify-center space-x-4 mb-8">
          <span className={`text-sm ${billingCycle === 'monthly' ? 'text-white' : 'text-slate-400'}`}>
            Monthly
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={`text-sm ${billingCycle === 'yearly' ? 'text-white' : 'text-slate-400'}`}>
            Yearly
          </span>
          {billingCycle === 'yearly' && (
            <span className="bg-emerald-600 text-white text-xs px-2 py-1 rounded-full">
              Save 20%
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {pricingTiers.map((tier) => (
          <Card
            key={tier.id}
            className={`relative bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:bg-slate-800/70 transition-all duration-300 ${
              tier.popular ? 'ring-2 ring-emerald-500 scale-105' : ''
            }`}
          >
            {tier.badge && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-emerald-600 text-white text-xs px-3 py-1 rounded-full">
                  {tier.badge}
                </span>
              </div>
            )}
            
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className={`p-3 rounded-full ${tier.popular ? 'bg-emerald-600' : 'bg-slate-700'}`}>
                  <div className="text-white">
                    {tier.icon}
                  </div>
                </div>
              </div>
              
              <CardTitle className="text-xl text-white mb-2">{tier.name}</CardTitle>
              
              <div className="flex items-center justify-center space-x-2">
                <span className="text-3xl font-bold text-white">
                  {getDiscountedPrice(tier.price)}
                </span>
                <span className="text-slate-400">/{billingCycle === 'monthly' ? 'month' : 'year'}</span>
              </div>
              
              <p className="text-sm text-slate-400 mt-2">
                Just ${getDailyPrice(tier.price)}/day
              </p>
              
              {tier.originalPrice && billingCycle === 'monthly' && (
                <div className="text-slate-500 text-sm line-through">
                  {tier.originalPrice}/month
                </div>
              )}
            </CardHeader>
            
            <CardContent className="space-y-6">
              <ul className="space-y-3">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <Check className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button
                onClick={() => handleSubscribe(tier)}
                className={`w-full ${
                  tier.popular
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-slate-700 hover:bg-slate-600 text-white border-slate-600'
                }`}
                variant={tier.popular ? 'default' : 'outline'}
              >
                {tier.cta}
              </Button>
              
              <p className="text-center text-xs text-slate-400">
                7-day free trial • Cancel anytime • No setup fees
              </p>
              
              <p className="text-xs text-slate-500 text-center mt-2">
                🔐 256-bit SSL encryption • PCI compliant • Powered by Stripe
              </p>
              
              <p className="text-xs text-slate-500 text-center mt-2">
                One winning trade pays for 6 months
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-16 text-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="flex flex-col items-center">
            <div className="p-3 bg-emerald-600/20 rounded-full mb-4">
              <Zap className="h-6 w-6 text-emerald-400" />
            </div>
            <h3 className="text-white font-semibold mb-2">Instant Setup</h3>
            <p className="text-slate-400 text-sm">Start receiving signals within minutes of signing up</p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="p-3 bg-emerald-600/20 rounded-full mb-4">
              <Star className="h-6 w-6 text-emerald-400" />
            </div>
            <h3 className="text-white font-semibold mb-2">Proven Results</h3>
            <p className="text-slate-400 text-sm">Average 78% win rate across all our signal strategies</p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="p-3 bg-emerald-600/20 rounded-full mb-4">
              <TrendingUp className="h-6 w-6 text-emerald-400" />
            </div>
            <h3 className="text-white font-semibold mb-2">Expert Support</h3>
            <p className="text-slate-400 text-sm">Get help from our team of professional traders</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingSection;
