import { useAuth as useAuthContext } from "@/contexts/AuthContext";

// Re-export the auth context hook for convenience
export const useAuth = useAuthContext;

// Additional auth-related hooks can be added here

export const useUser = () => {
  const { user, userProfile, loading } = useAuthContext();

  return {
    user,
    profile: userProfile,
    loading,
    isAuthenticated: !!user,
    isPro: userProfile?.subscription_tier === "professional",
    isElite: userProfile?.subscription_tier === "elite",
  };
};

export const useAuthState = () => {
  const { user, session, loading } = useAuthContext();

  return {
    isLoading: loading,
    isAuthenticated: !!user && !!session,
    user,
    session,
  };
};
