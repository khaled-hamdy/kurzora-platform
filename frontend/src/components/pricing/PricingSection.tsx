import React, { useState } from "react";
import { Check, Star, Zap, TrendingUp } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { toast } from "sonner";

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

// CORRECTED PRICING: $19 Starter, $49 Professional (removed Elite)
const pricingTiers: PricingTier[] = [
  {
    id: "starter",
    name: "Starter",
    price: "$19",
    features: [
      "2-3 signals per day",
      "Email alerts",
      "Full confidence scores",
      "TradingView charts",
      "Paper trading system",
      "Mobile responsive access",
    ],
    cta: "Start Free Trial",
    icon: <TrendingUp className="h-6 w-6" />,
  },
  {
    id: "professional",
    name: "Professional",
    price: "$49",
    features: [
      "Everything in Starter",
      "5-7 signals per day",
      "Telegram instant alerts",
      "Advanced filters",
      "AI signal explanations",
      "Priority support",
      "Discord community access",
    ],
    cta: "Start 7-day Trial",
    popular: true,
    icon: <Star className="h-6 w-6" />,
    badge: "Most Popular",
  },
];

interface PricingSectionProps {
  onSignupClick?: (planInfo?: any) => void;
}

const PricingSection: React.FC<PricingSectionProps> = ({ onSignupClick }) => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );

  const handleSubscribe = (tier: PricingTier) => {
    const price = tier.price.replace("$", "");
    const planInfo = {
      id: tier.id,
      name: tier.name,
      price: price,
      billingCycle,
    };

    if (onSignupClick) {
      // Store plan info for the signup form
      localStorage.setItem("selectedPlan", JSON.stringify(planInfo));
      onSignupClick(planInfo);
    } else {
      // If we're on a dedicated pricing page, store the plan and navigate cleanly
      localStorage.setItem("selectedPlan", JSON.stringify(planInfo));
      window.location.href = "/";
      // Use a timeout to trigger signup after navigation
      setTimeout(() => {
        const event = new CustomEvent("showSignup", { detail: planInfo });
        window.dispatchEvent(event);
      }, 100);
    }
  };

  const getDiscountedPrice = (price: string) => {
    if (billingCycle === "yearly") {
      // FIXED: Hardcoded yearly prices to eliminate floating-point errors
      if (price === "$19") return "$15";
      if (price === "$49") return "$39";
      return price;
    }
    return price;
  };

  const getDailyPrice = (price: string) => {
    // FIXED: Hardcoded daily prices to eliminate floating-point errors
    if (billingCycle === "yearly") {
      if (price === "$19") return "0.50"; // $15/30 days
      if (price === "$49") return "1.30"; // $39/30 days
    } else {
      if (price === "$19") return "0.63"; // $19/30 days
      if (price === "$49") return "1.63"; // $49/30 days
    }
    return "0.00";
  };

  // FIXED: Hardcoded clean savings to eliminate floating-point errors
  const getYearlySavings = (price: string) => {
    if (price === "$19") {
      return "46"; // $19 * 12 * 0.2 = $45.6, rounded to 46
    }
    if (price === "$49") {
      return "117"; // $49 * 12 * 0.2 = $117.6, rounded to 117
    }
    return "0";
  };

  return (
    <div className="w-full px-4 py-16">
      <div className="text-center mb-12">
        <div className="mb-4">
          <span className="bg-blue-600/20 text-blue-400 border border-blue-500/30 text-sm px-3 py-1 rounded-full">
            🎉 Early Bird Pricing
          </span>
        </div>
        <h2 className="text-4xl font-bold text-white mb-4">
          Choose Your Trading Edge
        </h2>
        <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
          Join thousands of profitable traders with our proven signal
          technology. All plans include a 7-day free trial with no commitment.
        </p>

        <div className="flex items-center justify-center space-x-4 mb-8">
          <span
            className={`text-sm ${
              billingCycle === "monthly" ? "text-white" : "text-slate-400"
            }`}
          >
            Monthly
          </span>
          <button
            onClick={() =>
              setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")
            }
            className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                billingCycle === "yearly" ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
          <span
            className={`text-sm ${
              billingCycle === "yearly" ? "text-white" : "text-slate-400"
            }`}
          >
            Yearly
          </span>
          {billingCycle === "yearly" && (
            <span className="bg-emerald-600 text-white text-xs px-2 py-1 rounded-full">
              Save 20%
            </span>
          )}
        </div>
      </div>

      {/* RESPONSIVE WIDE CARDS: Perfect on both mobile and desktop */}
      <div className="flex flex-col lg:flex-row gap-8 justify-center items-center w-full max-w-7xl mx-auto">
        {pricingTiers.map((tier) => (
          <div key={tier.id} className="w-full lg:w-[800px] xl:w-[900px]">
            <Card
              className={`relative bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:bg-slate-800/70 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10 w-full ${
                tier.popular ? "ring-2 ring-purple-500/50" : ""
              }`}
            >
              {tier.badge && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-600 to-purple-700 text-white text-xs px-3 py-1 rounded-full flex items-center">
                    <Star className="h-3 w-3 mr-1" />
                    {tier.badge}
                  </span>
                </div>
              )}

              <CardHeader className="text-center pb-6 px-12 pt-10">
                <div className="flex justify-center mb-6">
                  <div
                    className={`p-4 rounded-xl ${
                      tier.popular
                        ? "bg-gradient-to-r from-purple-600 to-purple-700"
                        : "bg-gradient-to-r from-blue-500 to-blue-600"
                    }`}
                  >
                    <div className="text-white">{tier.icon}</div>
                  </div>
                </div>

                <CardTitle className="text-2xl text-white mb-4">
                  {tier.name}
                </CardTitle>

                <div className="flex items-baseline justify-center space-x-2 mb-3">
                  <span className="text-5xl font-bold text-white">
                    {getDiscountedPrice(tier.price)}
                  </span>
                  <span className="text-slate-400 text-lg">
                    /{billingCycle === "monthly" ? "month" : "year"}
                  </span>
                </div>

                {billingCycle === "yearly" && (
                  <div className="text-base text-green-400 mb-3 font-medium">
                    Save ${getYearlySavings(tier.price)}/year
                  </div>
                )}

                <p className="text-base text-slate-400">
                  Just ${getDailyPrice(tier.price)}/day
                </p>
              </CardHeader>

              <CardContent className="space-y-6 px-12 pb-10">
                <ul className="space-y-4">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <Check className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-300 text-base leading-relaxed">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleSubscribe(tier)}
                  className={`w-full py-4 text-lg font-semibold transition-all ${
                    tier.popular
                      ? "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  <Zap className="h-5 w-5 mr-2" />
                  {tier.cta}
                </Button>

                <div className="space-y-4">
                  <p className="text-center text-base text-slate-400">
                    7-day free trial • Cancel anytime • No setup fees
                  </p>

                  <p className="text-sm text-slate-500 text-center">
                    🔐 256-bit SSL encryption • PCI compliant • Powered by
                    Stripe
                  </p>

                  <p className="text-sm text-slate-500 text-center">
                    One winning trade pays for 6 months
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Trust indicators section */}
      <div className="mt-16 text-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="flex flex-col items-center">
            <div className="p-3 bg-emerald-600/20 rounded-full mb-4">
              <Zap className="h-6 w-6 text-emerald-400" />
            </div>
            <h3 className="text-white font-semibold mb-2">Instant Setup</h3>
            <p className="text-slate-400 text-sm">
              Start receiving signals within minutes of signing up
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="p-3 bg-emerald-600/20 rounded-full mb-4">
              <Star className="h-6 w-6 text-emerald-400" />
            </div>
            <h3 className="text-white font-semibold mb-2">Proven Results</h3>
            <p className="text-slate-400 text-sm">
              Average 73% win rate verified by our users
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="p-3 bg-emerald-600/20 rounded-full mb-4">
              <TrendingUp className="h-6 w-6 text-emerald-400" />
            </div>
            <h3 className="text-white font-semibold mb-2">Expert Support</h3>
            <p className="text-slate-400 text-sm">
              Get help from our team of professional traders
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-slate-400 text-sm">
            ⚡ <strong className="text-white">Early bird pricing</strong> -
            Prices increase after first 100 customers
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingSection;
