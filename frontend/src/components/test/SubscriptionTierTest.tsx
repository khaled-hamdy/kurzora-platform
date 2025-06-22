// src/components/test/SubscriptionTierTest.tsx

import React from "react";
import {
  useSubscriptionTier,
  useTrialStatus,
  useSignalLimits,
} from "@/hooks/useSubscriptionTier";
import { useAuth } from "@/contexts/AuthContext";

const SubscriptionTierTest: React.FC = () => {
  const { userProfile, loading } = useAuth();
  const subscription = useSubscriptionTier();
  const trialStatus = useTrialStatus();
  const signalLimits = useSignalLimits();

  if (loading) {
    return (
      <div className="p-6 bg-slate-800 rounded-lg">
        <h2 className="text-xl font-bold text-white mb-4">
          🔄 Loading Subscription Data...
        </h2>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="p-6 bg-red-900/20 border border-red-500/30 rounded-lg">
        <h2 className="text-xl font-bold text-red-400 mb-4">
          ❌ Not Logged In
        </h2>
        <p className="text-red-300">Please log in to test subscription tier</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold text-white">
        🧪 Subscription Tier Test
      </h1>

      {/* Raw User Data */}
      <div className="bg-slate-800 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-400 mb-3">
          📋 Raw Database Data
        </h3>
        <div className="space-y-2 text-sm">
          <div>
            <span className="text-slate-400">Email:</span>{" "}
            <span className="text-white">{userProfile.email}</span>
          </div>
          <div>
            <span className="text-slate-400">Subscription Tier:</span>{" "}
            <span className="text-green-400">
              {userProfile.subscription_tier || "Not Set"}
            </span>
          </div>
          <div>
            <span className="text-slate-400">Subscription Status:</span>{" "}
            <span className="text-yellow-400">
              {userProfile.subscription_status || "Not Set"}
            </span>
          </div>
          <div>
            <span className="text-slate-400">Trial Ends At:</span>{" "}
            <span className="text-purple-400">
              {userProfile.subscription_ends_at || "Not Set"}
            </span>
          </div>
        </div>
      </div>

      {/* Processed Subscription Data */}
      {subscription ? (
        <div className="bg-slate-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-green-400 mb-3">
            ✅ Processed Subscription Info
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-400">Current Tier:</span>
              <div className="text-xl font-bold text-white">
                {subscription.tier.toUpperCase()}
              </div>
            </div>
            <div>
              <span className="text-slate-400">Status:</span>
              <div className="text-xl font-bold text-white">
                {subscription.status.toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-red-400 mb-3">
            ❌ Subscription Hook Failed
          </h3>
          <p className="text-red-300">
            The useSubscriptionTier hook returned null
          </p>
        </div>
      )}

      {/* Trial Status */}
      {trialStatus && (
        <div className="bg-slate-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-purple-400 mb-3">
            ⏰ Trial Status
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-400">Trial Active:</span>
              <div
                className={`text-lg font-bold ${
                  trialStatus.isTrialActive ? "text-green-400" : "text-red-400"
                }`}
              >
                {trialStatus.isTrialActive ? "✅ YES" : "❌ NO"}
              </div>
            </div>
            <div>
              <span className="text-slate-400">Days Left:</span>
              <div className="text-lg font-bold text-white">
                {trialStatus.trialDaysLeft}
              </div>
            </div>
          </div>
          {trialStatus.trialEndsAt && (
            <div className="mt-2">
              <span className="text-slate-400">Trial Ends:</span>
              <div className="text-white">
                {trialStatus.trialEndsAt.toLocaleDateString()}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Signal Limits */}
      <div className="bg-slate-800 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-yellow-400 mb-3">
          📊 Signal Limits
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-slate-400">Max Signals Per Day:</span>
            <div className="text-2xl font-bold text-white">
              {signalLimits.maxSignalsPerDay === 999
                ? "∞"
                : signalLimits.maxSignalsPerDay}
            </div>
          </div>
          <div>
            <span className="text-slate-400">Unlimited Access:</span>
            <div
              className={`text-lg font-bold ${
                signalLimits.canViewUnlimited
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {signalLimits.canViewUnlimited ? "✅ YES" : "❌ NO"}
            </div>
          </div>
        </div>
      </div>

      {/* Feature Access */}
      {subscription && (
        <div className="bg-slate-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-orange-400 mb-3">
            🚀 Feature Access
          </h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {Object.entries(subscription.limits).map(([feature, hasAccess]) => (
              <div key={feature} className="flex justify-between">
                <span className="text-slate-400">
                  {feature.replace(/([A-Z])/g, " $1").toLowerCase()}:
                </span>
                <span className={hasAccess ? "text-green-400" : "text-red-400"}>
                  {typeof hasAccess === "boolean"
                    ? hasAccess
                      ? "✅"
                      : "❌"
                    : hasAccess}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pricing Info */}
      {subscription && (
        <div className="bg-slate-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-green-400 mb-3">
            💰 Pricing
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-400">Monthly:</span>
              <div className="text-xl font-bold text-white">
                ${subscription.pricing.monthlyPrice}
              </div>
            </div>
            <div>
              <span className="text-slate-400">Yearly:</span>
              <div className="text-xl font-bold text-white">
                ${subscription.pricing.yearlyPrice}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionTierTest;
