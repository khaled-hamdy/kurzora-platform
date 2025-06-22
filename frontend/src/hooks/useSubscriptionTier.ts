// src/hooks/useSubscriptionTier.ts

import { useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";

export interface SubscriptionLimits {
  // Signal access
  maxSignalsPerDay: number;
  canViewUnlimitedSignals: boolean;
  canAccessPremiumSignals: boolean;

  // Feature access
  canAccessTelegramPremium: boolean;
  canExportData: boolean;
  canAccessAdvancedFilters: boolean;
  canAccessAIExplanations: boolean;

  // Historical data
  signalHistoryDays: number;

  // Support
  prioritySupport: boolean;
}

export interface TrialStatus {
  isTrialActive: boolean;
  trialDaysLeft: number;
  trialEndsAt: Date | null;
  hasTrialExpired: boolean;
}

export interface UserSubscription {
  tier: "starter" | "professional" | "elite";
  status: "trial" | "active" | "expired" | "cancelled";
  limits: SubscriptionLimits;
  trial: TrialStatus;
  pricing: {
    monthlyPrice: number;
    yearlyPrice: number;
  };
}

// Tier configuration based on your $19/$49 strategy
const TIER_CONFIGS: Record<
  string,
  SubscriptionLimits & {
    pricing: { monthlyPrice: number; yearlyPrice: number };
  }
> = {
  starter: {
    // Signal limits - $19/month tier
    maxSignalsPerDay: 3,
    canViewUnlimitedSignals: false,
    canAccessPremiumSignals: false,

    // Feature access
    canAccessTelegramPremium: false,
    canExportData: false,
    canAccessAdvancedFilters: false,
    canAccessAIExplanations: false,

    // History
    signalHistoryDays: 7,

    // Support
    prioritySupport: false,

    // Pricing
    pricing: {
      monthlyPrice: 19,
      yearlyPrice: 190, // ~17/month with yearly discount
    },
  },

  professional: {
    // Signal limits - $49/month tier
    maxSignalsPerDay: 999, // Unlimited
    canViewUnlimitedSignals: true,
    canAccessPremiumSignals: true,

    // Feature access
    canAccessTelegramPremium: true,
    canExportData: true,
    canAccessAdvancedFilters: true,
    canAccessAIExplanations: true,

    // History
    signalHistoryDays: 30,

    // Support
    prioritySupport: true,

    // Pricing
    pricing: {
      monthlyPrice: 49,
      yearlyPrice: 490, // ~41/month with yearly discount
    },
  },

  elite: {
    // Future tier - $199/month (not implemented yet)
    maxSignalsPerDay: 999,
    canViewUnlimitedSignals: true,
    canAccessPremiumSignals: true,
    canAccessTelegramPremium: true,
    canExportData: true,
    canAccessAdvancedFilters: true,
    canAccessAIExplanations: true,
    signalHistoryDays: 90,
    prioritySupport: true,
    pricing: {
      monthlyPrice: 199,
      yearlyPrice: 1990,
    },
  },
};

export const useSubscriptionTier = (): UserSubscription | null => {
  const { userProfile, loading } = useAuth();

  return useMemo(() => {
    if (loading || !userProfile) {
      return null;
    }

    const tier = userProfile.subscription_tier || "starter";
    const status = userProfile.subscription_status || "trial";
    const subscriptionEndsAt = userProfile.subscription_ends_at
      ? new Date(userProfile.subscription_ends_at)
      : null;

    // Calculate trial status
    const now = new Date();
    const isTrialActive =
      status === "trial" && subscriptionEndsAt && subscriptionEndsAt > now;
    const hasTrialExpired =
      status === "trial" && subscriptionEndsAt && subscriptionEndsAt <= now;
    const trialDaysLeft = subscriptionEndsAt
      ? Math.max(
          0,
          Math.ceil(
            (subscriptionEndsAt.getTime() - now.getTime()) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 0;

    const trialStatus: TrialStatus = {
      isTrialActive,
      trialDaysLeft,
      trialEndsAt: subscriptionEndsAt,
      hasTrialExpired,
    };

    // Get tier configuration
    const tierConfig = TIER_CONFIGS[tier] || TIER_CONFIGS.starter;

    // During trial, users get professional features
    // After trial, they get tier-specific features
    const effectiveTier = isTrialActive ? "professional" : tier;
    const effectiveConfig = TIER_CONFIGS[effectiveTier] || TIER_CONFIGS.starter;

    return {
      tier: tier as "starter" | "professional" | "elite",
      status: status as "trial" | "active" | "expired" | "cancelled",
      limits: {
        maxSignalsPerDay: effectiveConfig.maxSignalsPerDay,
        canViewUnlimitedSignals: effectiveConfig.canViewUnlimitedSignals,
        canAccessPremiumSignals: effectiveConfig.canAccessPremiumSignals,
        canAccessTelegramPremium: effectiveConfig.canAccessTelegramPremium,
        canExportData: effectiveConfig.canExportData,
        canAccessAdvancedFilters: effectiveConfig.canAccessAdvancedFilters,
        canAccessAIExplanations: effectiveConfig.canAccessAIExplanations,
        signalHistoryDays: effectiveConfig.signalHistoryDays,
        prioritySupport: effectiveConfig.prioritySupport,
      },
      trial: trialStatus,
      pricing: tierConfig.pricing,
    };
  }, [userProfile, loading]);
};

// Convenience hooks for common checks
export const useCanAccessFeature = (
  feature: keyof SubscriptionLimits
): boolean => {
  const subscription = useSubscriptionTier();
  if (!subscription) return false;
  return subscription.limits[feature] as boolean;
};

export const useSignalLimits = () => {
  const subscription = useSubscriptionTier();
  if (!subscription) return { maxSignalsPerDay: 0, canViewUnlimited: false };

  return {
    maxSignalsPerDay: subscription.limits.maxSignalsPerDay,
    canViewUnlimited: subscription.limits.canViewUnlimitedSignals,
    isTrialActive: subscription.trial.isTrialActive,
    trialDaysLeft: subscription.trial.trialDaysLeft,
  };
};

export const useTrialStatus = () => {
  const subscription = useSubscriptionTier();
  if (!subscription) return null;
  return subscription.trial;
};

// Helper function to check if user can access a feature
export const checkFeatureAccess = (
  subscription: UserSubscription | null,
  feature: keyof SubscriptionLimits
): boolean => {
  if (!subscription) return false;
  return subscription.limits[feature] as boolean;
};
